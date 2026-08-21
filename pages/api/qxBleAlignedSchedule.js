/**
 * 定时测量：支持无感 / 情绪两套时段，各自在 [开始, 结束] 内按间隔对齐时钟刻度触发
 * （如 8:34–18:52、间隔 30 分 → 9:00、9:30…）。多套同时开启时取槽位并集，同一时刻只下发一次 PPG。
 * 读 uni 缓存：switchHER/starttime/endtime/Interval_time（无感）、
 * switchEmotion/starttimeEmotion/endtimeEmotion/Interval_time_emotion（情绪）、deviceIdwatch
 * 定时从服务端拉 QX_DATA 写回缓存；后台/熄屏靠持久化下次槽位时间 + 保活闹钟补发。
 */

import Vue from 'vue'
import {
	getRequest
} from './request.js'
import {
	APP_IP_CN,
	getActiveAppBaseUrl
} from './appBaseHosts.js'
import {
	getCurrentTime,
	jakobLifeDebugFileLog
} from './jakobLifeDebugFileLog.js'
import keepAliveManager from '@/nativeplugins/KeepAlivesdkplugin/keepAliveManager.js'
import {
	u16proBLE
} from './protocol/u16pro-ble-manager.js'
import {
	getLocalTimeAllJSON,
	getDeviceTimezoneOffsetMinutes,
	getGMTTimezoneStrict
} from './unitls/timezone.js'

const INTERVAL_MINUTES = [10, 30, 60, 120]
const DAY_MIN = 1440
/** 无感 / 情绪两套定时配置（storage key） */
const SCHEDULE_PROFILES = [{
	id: 'wugan',
	switchKey: 'switchHER',
	startKey: 'starttime',
	endKey: 'endtime',
	intervalKey: 'Interval_time',
	defaultStart: '08:00',
	defaultEnd: '18:00'
}, {
	id: 'emotion',
	switchKey: 'switchEmotion',
	startKey: 'starttimeEmotion',
	endKey: 'endtimeEmotion',
	intervalKey: 'Interval_time_emotion',
	defaultStart: '08:00',
	defaultEnd: '18:00'
}]
const POLL_OUTSIDE_MS = 60 * 1000
/** 有完整本地配置时，拉取 QX_DATA 的最小间隔（毫秒） */
const QX_REMOTE_REFRESH_MIN_MS = 3 * 60 * 1000
/** 本地缺 key 时拉取最小间隔，防止 planNext 连打 */
const QX_REMOTE_REFRESH_MISSING_MS = 12 * 1000
/** 与 App.vue getBaseUrl 未写入 storage 时的默认一致 */
const FALLBACK_BASE_URL = APP_IP_CN

const OTA_DATA_RES_WATCH_CMD_IDS = new Set([
	'6986AF9F0656352E382E350741423536313043',
	'69C0EB890656352E382E370741423536313043',
	'69D616630656352E382E380741423536313043',
	'69E5814C0656352E382E390741423536313043',
	'69E587830656352E382E380741423536313043'
])

const DEFAULT_SERVICE_ID = '81EEA001-E735-49EC-8A11-7E32CAE1E14E'
const DEFAULT_CHAR_ID = '81EEA003-E735-49EC-8A11-7E32CAE1E14E'
/** 下次应触发测量的时间戳（毫秒），熄屏/后台时靠保活闹钟据此补发 */
const QX_BLE_NEXT_FIRE_AT_KEY = 'qx_ble_next_fire_at'
/** 仅定时调度发起的采集（与 Reports 手动测量 sendwatch 区分，避免误判「测量仍未结束」） */
const QX_BLE_SCHEDULED_MEASURE_KEY = 'qx_ble_scheduled_measure'
/** 本轮定时会话归属机型：bpw1 | bpw6（与 sendwatch 配套，避免双绑互清/互挡） */
export const QX_BLE_SCHEDULED_DEVICE_KEY = 'qx_ble_scheduled_device'
/** Main 正在拉 PPG / 上传：纠偏勿清 sendwatch，避免后台传完才上传 */
const QX_PPG_XFER_BUSY_KEY = 'qx_ble_ppg_xfer_busy'
/** 拉数/上传开始时间戳，超时则视为残留 */
const QX_PPG_XFER_BUSY_AT_KEY = 'qx_ble_ppg_xfer_busy_at'
/** 拉数/上传超时（毫秒）：超时后允许纠偏/新槽抢占，避免永久堵死下一槽 */
const QX_PPG_XFER_ORPHAN_MS = 12 * 60 * 1000
/** 定时情绪测量是否走 BPW6（Reports_Alerts_new 传入 devicetype=true） */
export const QX_EMOTION_BPW6_KEY = 'qx_emotion_bpw6'
/** 手动「立即测量」进行中（BPW1/BPW6）：调度勿纠偏清灰、勿抢发定时命令 */
export const QX_EMOTION_IMMEDIATE_BUSY_KEY = 'qx_emotion_immediate_busy'
const QX_EMOTION_IMMEDIATE_BUSY_AT_KEY = 'qx_emotion_immediate_busy_at'
/** 本轮立即测量归属机型：bpw1 | bpw6（与 busy 配套，避免双绑互清/互挡） */
export const QX_EMOTION_IMMEDIATE_DEVICE_KEY = 'qx_emotion_immediate_device'
/** 立即测量保护窗（毫秒） */
const QX_EMOTION_IMMEDIATE_BUSY_MAX_MS = 5 * 60 * 1000
/** 当前这轮测量对应的槽位时间戳（毫秒），用于区分「同槽重复触发」与「拖入下一间隔」 */
const QX_BLE_MEASURE_SLOT_AT_KEY = 'qx_ble_measure_slot_at'
/** 情绪定时：原生保活闹钟固定每 15 秒唤醒一次，检查是否到达对齐槽位 */
export const QX_BLE_SLOT_ALARM_POLL_SEC = 15
/** 到点下发失败（忙/抢占失败等）后，同槽位补发间隔（毫秒） */
const QX_SLOT_DISPATCH_RETRY_MS = 20 * 1000
/** 槽位到点：测量命令写入失败时连续重试次数，用尽后跳过该槽 */
const QX_SLOT_DISPATCH_MAX_ATTEMPTS = 3
/** 同槽连续重试间隔（毫秒） */
const QX_SLOT_DISPATCH_RETRY_GAP_MS = 800
/** 在设定的测量时段内，心跳间隔（毫秒）；前台再二次节流 */
const QX_SCHEDULE_HEARTBEAT_MS = 20 * 1000
/** 前台待命心跳最少间隔（避免与保活叠成 7 秒一卡） */
const QX_FG_HEARTBEAT_WORK_MIN_MS = 30 * 1000
/** 前台扫已连接列表节流 */
const QX_FG_BLE_POLL_MIN_MS = 60 * 1000

let qxLastFgBlePollAt = 0
let qxLastKeepAliveNotifAt = 0
let qxLastHeartbeatWorkAt = 0
/** 情绪定时开关打开时，后台实时通信间隔（毫秒）：BPW1 时间同步 / BPW6 读电量 */
const QX_BLE_TIME_SYNC_INTERVAL_MS = 13 * 1000
/** 后台实时通信时段：20:00–次日 06:00 */
const QX_BLE_TIME_SYNC_NIGHT_START_HOUR = 20
const QX_BLE_TIME_SYNC_NIGHT_END_HOUR = 6
/** 下发 BLE 后等待手表采集结束的最长时间（毫秒） */
const QX_MEASURE_SESSION_MAX_MS = 5 * 60 * 1000
/** 无结束回调时纠偏：后台拉数约 3–5 分钟，过短会误杀上传中会话 */
const QX_MEASURE_SESSION_ORPHAN_MS = 8 * 60 * 1000
/** scheduleDeferredPlanNext 在 inFlight 滞留时的最大重试次数 */
const QX_DEFERRED_PLAN_MAX_RETRY = 4

/**
 * 情绪定时/立即测量目标机型。
 * 优先服务端绑定快照（与 Main.shouldUseBpw6ForEmotionImmediate 一致），
 * 避免仅绑 BPW6 时本地残留 deviceIdwatch 误走 BPW1。
 */
export function isQxBpw6EmotionMode() {
	// 先清「已解绑但仍留在本地」的 BPW1 mac，否则会被当成双绑且 emotionBpw6=false
	purgeStaleBpw1WatchIfUnbound()
	const flag = uni.getStorageSync(QX_EMOTION_BPW6_KEY)
	// 1) 服务端绑定快照：单绑强制对应机型
	try {
		const snap = uni.getStorageSync('qx_emotion_bind_snapshot')
		if (snap && typeof snap === 'object') {
			const snapBpw1 = !!snap.hasBpw1
			const snapBpw6 = !!snap.hasBpw6
			if (snapBpw1 && !snapBpw6) {
				if (flag === true || flag === 'true') {
					try {
						uni.setStorageSync(QX_EMOTION_BPW6_KEY, false)
					} catch (e) {}
				}
				return false
			}
			if (snapBpw6 && !snapBpw1) {
				if (flag !== true && flag !== 'true') {
					try {
						uni.setStorageSync(QX_EMOTION_BPW6_KEY, true)
					} catch (e2) {}
				}
				return true
			}
			if (snapBpw1 && snapBpw6) {
				return flag === true || flag === 'true'
			}
		}
	} catch (eSnap) {}
	const hasBpw6 = !!uni.getStorageSync('BPW6devicemac')
	const hasBpw1 = !!uni.getStorageSync('deviceIdwatch')
	// 仅绑 BPW1：强制 BPW1 情绪定时（清残留 qx_emotion_bpw6，避免误发 BPW6 PPG）
	if (hasBpw1 && !hasBpw6) {
		if (flag === true || flag === 'true') {
			try {
				uni.setStorageSync(QX_EMOTION_BPW6_KEY, false)
			} catch (e) {}
		}
		return false
	}
	// 仅绑 BPW6 时按 BPW6 情绪定时，避免一直用空的 deviceIdwatch 误报未连接
	if (hasBpw6 && !hasBpw1) {
		if (flag !== true && flag !== 'true') {
			try {
				uni.setStorageSync(QX_EMOTION_BPW6_KEY, true)
			} catch (e) {}
		}
		return true
	}
	// 双绑：严格按设置页写入的机型开关，勿用连接态改写
	return flag === true || flag === 'true'
}

/** 标记手动立即测量进行中，阻止同机型定时调度抢占/清灰 */
export function markQxEmotionImmediateBusy(deviceKind = '') {
	try {
		uni.setStorageSync(QX_EMOTION_IMMEDIATE_BUSY_KEY, 1)
		uni.setStorageSync(QX_EMOTION_IMMEDIATE_BUSY_AT_KEY, Date.now())
		if (deviceKind === 'bpw1' || deviceKind === 'bpw6') {
			uni.setStorageSync(QX_EMOTION_IMMEDIATE_DEVICE_KEY, deviceKind)
		}
	} catch (e) {}
}

export function clearQxEmotionImmediateBusy() {
	try {
		uni.removeStorageSync(QX_EMOTION_IMMEDIATE_BUSY_KEY)
		uni.removeStorageSync(QX_EMOTION_IMMEDIATE_BUSY_AT_KEY)
		uni.removeStorageSync(QX_EMOTION_IMMEDIATE_DEVICE_KEY)
	} catch (e) {}
}

export function getQxEmotionImmediateDevice() {
	try {
		const d = uni.getStorageSync(QX_EMOTION_IMMEDIATE_DEVICE_KEY)
		if (d === 'bpw1' || d === 'bpw6') {
			return d
		}
	} catch (e) {}
	try {
		const v = uni.getStorageSync(QX_EMOTION_IMMEDIATE_BUSY_KEY)
		if (v !== 1 && v !== '1' && v !== true && v !== 'true') {
			return ''
		}
	} catch (e2) {
		return ''
	}
	return isQxBpw6EmotionMode() ? 'bpw6' : 'bpw1'
}

/**
 * 仅清本机立即测量 busy；另一机型进行中则保留。
 * @returns {boolean} 是否实际清理
 */
export function clearQxEmotionImmediateBusyIfDevice(deviceKind) {
	if (deviceKind !== 'bpw1' && deviceKind !== 'bpw6') {
		clearQxEmotionImmediateBusy()
		return true
	}
	const active = getQxEmotionImmediateDevice()
	if (active && active !== deviceKind) {
		return false
	}
	clearQxEmotionImmediateBusy()
	return true
}

/**
 * @param {'bpw1'|'bpw6'|''} [deviceKind] 传入机型时仅认该机立即测量；空则任意机型
 */
export function isQxEmotionImmediateBusy(deviceKind = '') {
	try {
		const v = uni.getStorageSync(QX_EMOTION_IMMEDIATE_BUSY_KEY)
		if (v !== 1 && v !== '1' && v !== true && v !== 'true') {
			return false
		}
		const at = Number(uni.getStorageSync(QX_EMOTION_IMMEDIATE_BUSY_AT_KEY))
		if (Number.isFinite(at) && at > 0 && Date.now() - at > QX_EMOTION_IMMEDIATE_BUSY_MAX_MS) {
			clearQxEmotionImmediateBusy()
			return false
		}
		if (deviceKind === 'bpw1' || deviceKind === 'bpw6') {
			const active = getQxEmotionImmediateDevice()
			if (active && active !== deviceKind) {
				return false
			}
		}
		return true
	} catch (e) {
		return false
	}
}

function readQxEmotionDeviceId() {
	if (isQxBpw6EmotionMode()) {
		return uni.getStorageSync('BPW6devicemac') || ''
	}
	return uni.getStorageSync('deviceIdwatch') || ''
}

function normalizeQxBleDeviceId(id) {
	if (!id) return ''
	return String(id).trim().toUpperCase()
}

function isSameQxBleDeviceId(a, b) {
	const na = normalizeQxBleDeviceId(a)
	const nb = normalizeQxBleDeviceId(b)
	return !!na && na === nb
}

/**
 * 清掉已解绑仍残留的 deviceIdwatch，避免「未绑 BPW1」却被当成双绑走 BPW1 命令。
 * 依据：绑定快照 hasBpw1=false，或 deviceList 中已无该 mac。
 * @returns {boolean} 是否清理了残留
 */
function purgeStaleBpw1WatchIfUnbound() {
	const bpw1 = uni.getStorageSync('deviceIdwatch') || ''
	if (!bpw1) return false
	let shouldClear = false
	try {
		const snap = uni.getStorageSync('qx_emotion_bind_snapshot')
		if (snap && typeof snap === 'object') {
			if (snap.hasBpw1 === true || snap.hasBpw1 === 'true') {
				return false
			}
			if (snap.hasBpw1 === false || snap.hasBpw1 === 'false') {
				shouldClear = true
			}
		}
	} catch (eSnap) {}
	if (!shouldClear) {
		try {
			const list = uni.getStorageSync('deviceList')
			if (Array.isArray(list) && list.length > 0) {
				const stillBound = list.some((mac) => isSameQxBleDeviceId(mac, bpw1))
				if (!stillBound) {
					shouldClear = true
				}
			}
		} catch (eList) {}
	}
	// 绑定明细：服务端无 BPW1 → 残留；有 BPW1 但 mac 不一致 → 纠正为服务端 mac
	if (!shouldClear) {
		try {
			const rows = uni.getStorageSync('lixianlist')
			if (Array.isArray(rows) && rows.length > 0) {
				const bpw1Rows = rows.filter((row) => row && String(row.deviceModelId) === '30000' &&
					row.mac)
				if (bpw1Rows.length === 0) {
					shouldClear = true
				} else {
					const hasBpw1Row = bpw1Rows.some((row) => isSameQxBleDeviceId(row.mac, bpw1))
					if (!hasBpw1Row) {
						try {
							uni.setStorageSync('deviceIdwatch', bpw1Rows[0].mac)
						} catch (eFix) {}
						console.log('[qxBle] //定时测量-纠正BPW1mac', bpw1, '→', bpw1Rows[0].mac)
						return false
					}
				}
			}
		} catch (eRows) {}
	}
	if (!shouldClear) return false
	try {
		uni.removeStorageSync('deviceIdwatch')
	} catch (eRm) {}
	if (uni.getStorageSync('BPW6devicemac')) {
		try {
			uni.setStorageSync(QX_EMOTION_BPW6_KEY, true)
		} catch (eFlag) {}
	}
	console.log('[qxBle] //定时测量-清残留BPW1', bpw1)
	return true
}

/** 任一已绑定手表的连接提示（不依赖情绪机型开关） */
function readAnyWatchConnectedHint() {
	const bpw6 = uni.getStorageSync('BPW6devicemac')
	if (bpw6) {
		if (u16proBLE && u16proBLE.isConnected) {
			if (!u16proBLE.deviceId || isSameQxBleDeviceId(u16proBLE.deviceId, bpw6)) {
				return true
			}
		}
		const f6 = uni.getStorageSync('qx_bpw6_ble_connected')
		if (f6 === true || f6 === 'true' || f6 === 1 || f6 === '1') {
			return true
		}
	}
	const bpw1 = uni.getStorageSync('deviceIdwatch')
	if (bpw1) {
		const f1 = uni.getStorageSync('qx_bpw1_ble_connected')
		if (f1 === true || f1 === 'true' || f1 === 1 || f1 === '1') {
			return true
		}
	}
	return false
}

/** Main/u16pro 已确认连接时的兜底（系统已连接列表偶发漏报） */
function readQxBleConnectedHint(deviceId = '') {
	const dev = deviceId || readQxEmotionDeviceId()
	if (!dev) {
		return readAnyWatchConnectedHint()
	}
	if (isSameQxBleDeviceId(dev, uni.getStorageSync('BPW6devicemac'))) {
		if (u16proBLE && u16proBLE.isConnected) {
			if (!u16proBLE.deviceId || isSameQxBleDeviceId(u16proBLE.deviceId, dev)) {
				return true
			}
		}
		const flag = uni.getStorageSync('qx_bpw6_ble_connected')
		return flag === true || flag === 'true' || flag === 1 || flag === '1'
	}
	const flag = uni.getStorageSync('qx_bpw1_ble_connected')
	return flag === true || flag === 'true' || flag === 1 || flag === '1'
}

/**
 * BPW6 是否有「GATT 仍活着」证据（写成功/通道在）——后台系统列表常空，不能只靠 hint/会话粘性
 */
function hasBpw6LiveLinkEvidence(deviceId = '') {
	const mac = deviceId || uni.getStorageSync('BPW6devicemac') || ''
	if (!mac || !u16proBLE) return false
	try {
		const id = u16proBLE.deviceId || u16proBLE.bcDeviceId || ''
		// 仅当明确指向其它设备时才否定；id 空不否定
		if (id && !isSameQxBleDeviceId(id, mac)) return false
		if (u16proBLE.isBcNotifying) return true
		if (u16proBLE.isConnected) return true
		const lastOk = Number(u16proBLE._lastGattWriteOkAt) || 0
		if (lastOk > 0 && Date.now() - lastOk < 180000) return true
		// 主服务特征仍在：即使 deviceId 被误清，也视为链路曾建立且可能仍可用
		if (u16proBLE.serviceId && u16proBLE.writeCharId) return true
		if (u16proBLE.bcServiceId && u16proBLE.bcWriteCharId) return true
	} catch (e) {}
	return false
}

/** 原生确认手机蓝牙是否关闭（null=无法判断，勿当已关闭） */
function isAndroidBluetoothReallyOff() {
	// #ifdef APP-PLUS
	try {
		if (uni.getSystemInfoSync().platform !== 'android') return null
		const BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter')
		const adapter = BluetoothAdapter.getDefaultAdapter()
		if (!adapter) return null
		return !adapter.isEnabled()
	} catch (e) {
		return null
	}
	// #endif
	return null
}

/** 有活链路证据时恢复 BPW6 已连接标记（避免读电量成功却心跳报未连接） */
function restoreBpw6ConnectedFromLiveEvidence(reason = '') {
	const mac = uni.getStorageSync('BPW6devicemac') || ''
	if (!mac) return false
	notifyQxBleWatchConnectionState(true, mac)
	qxBleBpw6SessionConnected = true
	qxBleBpw6BgConnectedLatch = true
	try {
		uni.setStorageSync('qx_bpw6_ble_connected', true)
	} catch (e) {}
	return true
}

/**
 * 后台 BPW6 连接展示：
 * 已绑定则后台默认保显「已连接」（系统空列表/误清标记很常见）。
 * 仅原生确认手机蓝牙关闭时才报未连接。
 */
function resolveBpw6BgBleConnectedForLog(scheduleDev) {
	if (qxAppInForeground) return null
	const bpw6 = uni.getStorageSync('BPW6devicemac') || ''
	if (!bpw6) return null
	// 双绑且情绪目标是 BPW1：不改 BPW1 的连接展示
	if (scheduleDev && !isSameQxBleDeviceId(scheduleDev, bpw6)) {
		const bpw1 = uni.getStorageSync('deviceIdwatch') || ''
		if (bpw1) return null
	}
	if (isAndroidBluetoothReallyOff() === true) return false
	// 后台：绑了 BPW6 且蓝牙未确认关闭 → 一律保显已连接
	qxBleBpw6BgConnectedLatch = true
	qxBleBpw6SessionConnected = true
	if (!qxBleWatchConnected || !readQxBleConnectedHint(bpw6)) {
		restoreBpw6ConnectedFromLiveEvidence('后台保显')
	}
	return true
}

/**
 * App 层主动同步手表 BLE 连接态（连接成功/断开时调用）
 * 按实际 deviceId 写入对应标记，不因情绪机型开关写错 key
 */
export function notifyQxBleWatchConnectionState(connected, deviceId = '') {
	const bpw6 = uni.getStorageSync('BPW6devicemac')
	const bpw1 = uni.getStorageSync('deviceIdwatch')
	const on = !!connected

	if (deviceId && bpw6 && isSameQxBleDeviceId(deviceId, bpw6)) {
		// 后台忽略「断开」通知（系统列表漏报会经 Main 误报断开）
		if (!on && !qxAppInForeground) {
			return
		}
		try {
			uni.setStorageSync('qx_bpw6_ble_connected', on)
		} catch (e) {}
		if (u16proBLE) {
			u16proBLE.isConnected = on
			if (on) {
				u16proBLE.deviceId = deviceId
			} else if (isSameQxBleDeviceId(u16proBLE.deviceId, deviceId)) {
				u16proBLE.deviceId = ''
			}
		}
		updateQxBleWatchConnectionState(on, 'notify-bpw6')
		return
	}
	if (deviceId && bpw1 && isSameQxBleDeviceId(deviceId, bpw1)) {
		try {
			uni.setStorageSync('qx_bpw1_ble_connected', on)
		} catch (e) {}
		updateQxBleWatchConnectionState(on, 'notify-bpw1')
		return
	}

	const watchId = readQxEmotionDeviceId()
	if (deviceId && watchId && !isSameQxBleDeviceId(deviceId, watchId)) {
		// 未匹配到已存 mac 时，仍按当前连接设备落标记（绑定瞬间 mac 可能刚写入）
		if (on && deviceId) {
			try {
				if (isQxBpw6EmotionMode()) {
					uni.setStorageSync('qx_bpw6_ble_connected', true)
					if (u16proBLE) {
						u16proBLE.isConnected = true
						u16proBLE.deviceId = deviceId
					}
				} else {
					uni.setStorageSync('qx_bpw1_ble_connected', true)
				}
			} catch (e) {}
			updateQxBleWatchConnectionState(true, 'notify-unmatched-on')
		}
		return
	}
	if (!watchId && !deviceId) {
		updateQxBleWatchConnectionState(false, 'notify-no-device')
		return
	}
	updateQxBleWatchConnectionState(on, 'notifyFromApp')
	try {
		if (isQxBpw6EmotionMode() || (deviceId && bpw6 && isSameQxBleDeviceId(deviceId, bpw6))) {
			uni.setStorageSync('qx_bpw6_ble_connected', on)
			if (u16proBLE) {
				u16proBLE.isConnected = on
				if (on && deviceId) u16proBLE.deviceId = deviceId
			}
		} else {
			uni.setStorageSync('qx_bpw1_ble_connected', on)
		}
	} catch (e) {}
}

/**
 * 手机蓝牙关闭：真实断开，清 BPW6 会话粘性（避免心跳仍报 BLE已连接）
 * 仅 adapter-off 调用；空列表漏报不要走这里。
 * 原生确认蓝牙仍开时直接忽略，防止华为切后台误报把粘性清掉。
 */
export function markQxBleBpw6AdapterDown() {
	if (isAndroidBluetoothReallyOff() !== true) {
		console.log('[qxBle] 忽略 adapter-down（原生蓝牙未确认关闭）')
		return
	}
	qxBleBpw6SessionConnected = false
	qxBleBpw6BgConnectedLatch = false
	qxBleWatchConnected = false
	try {
		uni.setStorageSync('qx_bpw6_ble_connected', false)
		if (u16proBLE) u16proBLE.isConnected = false
	} catch (e) {}
}

function clearQxDeviceConnectedFlags(deviceId = '') {
	const bpw6 = uni.getStorageSync('BPW6devicemac') || ''
	const bpw1 = uni.getStorageSync('deviceIdwatch') || ''
	const clearBpw6 = !deviceId || (bpw6 && isSameQxBleDeviceId(deviceId, bpw6))
	const clearBpw1 = !deviceId || (bpw1 && isSameQxBleDeviceId(deviceId, bpw1))
	// 后台勿清 BPW6 连接标记（系统列表漏报会导致误清）
	if (clearBpw6 && !qxAppInForeground && bpw6) {
		return
	}
	try {
		if (clearBpw6) {
			uni.setStorageSync('qx_bpw6_ble_connected', false)
			if (u16proBLE && (!u16proBLE.deviceId || !deviceId ||
					isSameQxBleDeviceId(u16proBLE.deviceId, deviceId || bpw6))) {
				u16proBLE.isConnected = false
			}
			if (qxAppInForeground) {
				qxBleBpw6SessionConnected = false
			}
		}
		if (clearBpw1) {
			uni.setStorageSync('qx_bpw1_ble_connected', false)
		}
	} catch (e) {}
	if (deviceId && readQxEmotionDeviceId() &&
		isSameQxBleDeviceId(deviceId, readQxEmotionDeviceId())) {
		qxBleWatchConnected = false
	} else if (!deviceId) {
		qxBleWatchConnected = false
	}
}

function isQxBleNoConnectionError(err) {
	if (!err) return false
	const code = err.errCode != null ? err.errCode : err.code
	if (code === 10004 || code === '10004') return true
	const msg = String(err.errMsg || err.message || err || '')
	return msg.indexOf('no connection') >= 0 || msg.indexOf('10004') >= 0
}

/** 仅查系统已连接列表（不使用 App 假标记） */
function querySystemBleConnected(deviceId) {
	return new Promise((resolve) => {
		if (!deviceId) {
			resolve(false)
			return
		}
		const run = () => {
			if (typeof uni.getConnectedBluetoothDevices !== 'function') {
				resolve(false)
				return
			}
			uni.getConnectedBluetoothDevices({
				success: (res) => {
					const list = res.devices || []
					resolve(list.some((d) => isSameQxBleDeviceId(d && d.deviceId, deviceId)))
				},
				fail: () => resolve(false)
			})
		}
		if (typeof uni.openBluetoothAdapter === 'function') {
			uni.openBluetoothAdapter({
				success: run,
				fail: run
			})
		} else {
			run()
		}
	})
}

function createQxBleConnection(deviceId) {
	return new Promise((resolve) => {
		if (!deviceId || typeof uni.createBLEConnection !== 'function') {
			resolve(false)
			return
		}
		const markConnectedHint = () => {
			try {
				uni.removeStorageSync('bpw6_bg_need_bt_reconnect')
			} catch (e) {}
		}
		uni.createBLEConnection({
			deviceId,
			timeout: 8000,
			success: () => {
				markConnectedHint()
				resolve(true)
			},
			fail: (err) => {
				const msg = String((err && err.errMsg) || '')
				if (msg.indexOf('already') >= 0 || (err && (err.errCode === -1 || err.code === -
						1))) {
					markConnectedHint()
					resolve(true)
					return
				}
				resolve(false)
			}
		})
	})
}

/**
 * BPW6 静默重连请求：不改连接展示标记；通知 Main 循环 createBLEConnection，
 * 并本地补一次 GATT 连接（Main 未挂载时仍可恢复链路）。
 */
let _qxBpw6SilentReconnectAt = 0
export function requestBpw6SilentReconnect(deviceId = '', reason = '') {
	const mac = deviceId || uni.getStorageSync('BPW6devicemac') || ''
	if (!mac) return
	const now = Date.now()
	// 与 Main 侧节流配合，避免多入口狂打 createBLEConnection
	if (now - _qxBpw6SilentReconnectAt < 1500) {
		try {
			uni.$emit('BPW6_ENSURE_RECONNECT', {
				deviceId: mac,
				reason: reason || 'qxBle'
			})
		} catch (e) {}
		return
	}
	_qxBpw6SilentReconnectAt = now
	try {
		uni.$emit('BPW6_ENSURE_RECONNECT', {
			deviceId: mac,
			reason: reason || 'qxBle'
		})
	} catch (e) {}
	createQxBleConnection(mac).then((ok) => {
		if (ok) {
			notifyQxBleWatchConnectionState(true, mac)
		}
	}).catch(() => {})
}

async function ensureQxBleDeviceConnectedForWrite(deviceId) {
	if (!deviceId) return false
	let ok = await querySystemBleConnected(deviceId)
	if (!ok) {
		// 后台/熄屏时 getConnectedBluetoothDevices 常空列表误报未连接；
		// 对齐最早定时下发：有设备则尝试重连/hint 后直接写，勿先清 hint 再卡死。
		const reconnected = await createQxBleConnection(deviceId)
		if (reconnected) {
			await delayMs(400)
			ok = true
			const confirmed = await querySystemBleConnected(deviceId)
			if (!confirmed) {
				console.log('[qxBle] 重连后系统列表仍未命中，按已连接继续下发', deviceId)
			}
		} else if (readQxBleConnectedHint(deviceId) || hasBpw6LiveLinkEvidence(deviceId) ||
			qxBleBpw6SessionConnected || qxBleBpw6BgConnectedLatch) {
			// 后台空列表 + create already/失败：粘性/活链路仍按已连接继续，否则到点永不发 PPG
			ok = true
			console.log('[qxBle] 系统列表未命中，按粘性/活链路继续下发', deviceId)
		} else {
			clearQxDeviceConnectedFlags(deviceId)
			return false
		}
	}
	if (!ok) return false
	notifyQxBleWatchConnectionState(true, deviceId)
	// 后台 BPW6：勿在此 ensureBc（getServices 易挂死且无超时）；通道准备放调度直发（带超时）
	if (qxAppInForeground && isSameQxBleDeviceId(deviceId, uni.getStorageSync('BPW6devicemac'))) {
		try {
			await Promise.race([
				Promise.resolve(u16proBLE.ensureBcServiceReady(deviceId, {
					force: true
				})).catch((e) => {
					console.log('[qxBle] BC通道准备失败', e)
				}),
				delayMs(4000)
			])
		} catch (e) {
			console.log('[qxBle] BC通道准备异常', e)
		}
	}
	return true
}

/**
 * 解析实际下发目标：按绑定/情绪机型开关选设备。
 * 注意：后台 getConnectedBluetoothDevices 常空列表，不可据此永久改机型或误切 BPW6。
 * 单绑/快照机型锁定后绝不交叉发到另一机型。
 */
async function resolveQxMeasurementTarget() {
	purgeStaleBpw1WatchIfUnbound()
	const bpw6 = uni.getStorageSync('BPW6devicemac') || ''
	const bpw1 = uni.getStorageSync('deviceIdwatch') || ''
	let useBpw6 = isQxBpw6EmotionMode()
	let deviceId = useBpw6 ? bpw6 : bpw1

	// 单设备绑定：锁定机型，不交叉
	if (bpw1 && !bpw6) {
		useBpw6 = false
		deviceId = bpw1
	} else if (bpw6 && !bpw1) {
		useBpw6 = true
		deviceId = bpw6
	} else if (bpw1 && bpw6) {
		// 双绑：严格跟随情绪机型开关；系统列表仅作「本轮无目标 mac」兜底，不写 storage
		const bpw1Real = await querySystemBleConnected(bpw1)
		const bpw6Real = await querySystemBleConnected(bpw6)
		if (!deviceId) {
			if (useBpw6 && bpw6Real) {
				deviceId = bpw6
			} else if (!useBpw6 && bpw1Real) {
				deviceId = bpw1
			} else {
				deviceId = useBpw6 ? (bpw6 || bpw1) : (bpw1 || bpw6)
				useBpw6 = !!(deviceId && bpw6 && isSameQxBleDeviceId(deviceId, bpw6))
			}
		}
		// BPW6 模式：即使系统列表仅有 BPW1 也不改走 BPW1（会误发到未绑定/非目标机）
		// BPW1 模式：即使系统列表空也不改走 BPW6（后台误判会导致发错 PPG）
	} else if (!deviceId) {
		deviceId = bpw6 || bpw1
		useBpw6 = !!(deviceId && bpw6 && isSameQxBleDeviceId(deviceId, bpw6))
	}

	// 情绪机型为 BPW6 时，目标必须落在 BPW6 MAC（避免残留 deviceIdwatch 把定时拐到 BPW1 命令）
	if (isQxBpw6EmotionMode() && bpw6) {
		useBpw6 = true
		deviceId = bpw6
	}
	// 有 BPW6、无有效 BPW1：强制 BPW6（双绑残留已在 purge 清掉；此处再兜底）
	if (bpw6 && !uni.getStorageSync('deviceIdwatch')) {
		useBpw6 = true
		deviceId = bpw6
	}
	if (deviceId) {
		await ensureQxBleDeviceConnectedForWrite(deviceId)
	}
	return {
		deviceId,
		useBpw6
	}
}

let qxBleTimer = null
let qxMeasureWatchdogTimer = null
let qxHeartbeatTimer = null
let qxBleTimeSyncTimer = null
let deferredPlanNextTimer = null
let lastQxRemoteFetchAt = 0
let planNextInFlight = false
let qxMeasureInFlight = false
/** 本轮调度启动后、首次采集完成前（首次测量心跳用前台/后台代替「测量进行中」） */
let qxScheduleSessionFirstRun = false
/** App 是否在前台（后台不发 Toast，避免阻塞 BLE 流程） */
let qxAppInForeground = true
/** 防止 runQxBleScheduleWakeTick 并发（保活闹钟与 JS 定时器同时到点） */
let qxWakeTickInFlight = false
/** wakeTick 开始时间，用于超时强制解锁，避免永久 wake-busy */
let qxWakeTickStartedAt = 0
/** 心跳到点补发去抖（Mate60 深睡时原生闹钟可能数分钟不回调 JS） */
let heartbeatDueTriggerPending = false
/** 同槽 execute 互斥（毫秒时间戳，用于抢槽窗口） */
let qxSlotExecuteLockAt = 0
/** 抢占槽位时刻（BLE 写入完成前尚无 sendwatch） */
let qxSlotClaimedAt = 0
/** 本轮 BLE 测量命令成功下发时刻（用于纠偏滞留 inFlight） */
let qxMeasureSessionStartedAt = 0
let deferredPlanNextRetry = 0
/** inFlight 但无 sendwatch/调度标记：超过该时间视为假「测量进行中」（毫秒） */
const QX_RECONCILE_FLAGS_GRACE_MS = 90 * 1000
/** 抢占槽位后、sendwatch 写入前仍视为忙（覆盖后台探测+通道准备+PPG） */
const QX_SLOT_CLAIM_ACTIVE_MS = 90 * 1000
/** 抢占后始终未出现 sendwatch/会话：强制清忙（毫秒） */
const QX_SLOT_CLAIM_ORPHAN_MS = 90 * 1000
/** 槽位到点后仍允许同槽下发/补发的宽限（毫秒） */
const QX_SLOT_DUE_GRACE_MS = 15 * 1000
/** 逾期超过该时长则放弃旧槽、对齐到下一时刻，不再补发（毫秒） */
const QX_SLOT_OVERDUE_ABANDON_MS = 180 * 1000
/** Main.vue 测量中标记（与 UI sleep_alertdisabled 一致） */
const QX_MAIN_SLEEP_ALERT_DISABLED_KEY = 'sleep_alertdisabled'

/** getConnectedBluetoothDevices 实时同步的手表连接态 */
let qxBleWatchConnected = false
/** BPW6 本会话曾确认连接：后台空列表保显，仅前台确认断开才清 */
let qxBleBpw6SessionConnected = false
/** 后台连接锁存：一旦已连接，仅原生蓝牙关闭或前台确认断开才清 */
let qxBleBpw6BgConnectedLatch = false
let qxBleConnectionListenerBound = false
let qxBleMonitoredDeviceId = ''
let qxBleConnectedPollInFlight = false

function parseLocalYMDFromDate(date = new Date()) {
	const [year, month, day] = getLocalTimeAllJSON(date).YMD.split('-').map(Number)
	return {
		year,
		month,
		day
	}
}

/** 设备本地当天 0 点起的分钟数 */
function getLocalMinuteOfDay(date = new Date()) {
	const timePart = getLocalTimeAllJSON(date).YMDHMS.split(' ')[1] || '00:00:00'
	const [h, m] = timePart.split(':').map(Number)
	return h * 60 + m
}

/** 设备本地某时刻对应的 UTC 毫秒时间戳 */
function buildLocalTimestampMs(year, month, day, minuteOfDay, refDate = new Date()) {
	const offsetMin = getDeviceTimezoneOffsetMinutes(refDate)
	const h = Math.floor(minuteOfDay / 60)
	const m = minuteOfDay % 60
	return Date.UTC(year, month - 1, day, h, m, 0) - offsetMin * 60000
}

/** 本地日期加减天数（用正午避免 DST 边界） */
function addLocalDays(year, month, day, daysToAdd) {
	const offsetMin = getDeviceTimezoneOffsetMinutes()
	const noonUtc = Date.UTC(year, month - 1, day, 12, 0, 0) - offsetMin * 60000 + daysToAdd * 86400000
	return parseLocalYMDFromDate(new Date(noonUtc))
}

function hasOngoingQxWork() {
	return qxMeasureInFlight || planNextInFlight
}

/** 测量开始/结束后刷新保活前台通知文案（含「正在测量中」） */
function refreshKeepAliveNotificationIfNeeded() {
	try {
		if (keepAliveManager && typeof keepAliveManager.updateNotification === 'function') {
			keepAliveManager.updateNotification()
		}
	} catch (e) {
		console.log('[qxBle] 刷新保活通知', e)
	}
}

export function refreshQxBleKeepAliveNotification() {
	refreshKeepAliveNotificationIfNeeded()
}

/** 手表 PPG/定时采集是否仍在进行（含 Main 已收 02 但尚未 notify 调度器） */
function hasActiveQxBleCollection() {
	const send = uni.getStorageSync('sendwatch')
	if (send === 1 || send === '1') return true
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	return scheduled === 1 || scheduled === '1'
}

/**
 * 本轮定时会话归属：bpw1 | bpw6 | ''。
 * 无显式机型时按情绪开关兜底（兼容旧版本只写了 sendwatch 的残留）。
 */
export function getQxScheduledMeasureDevice() {
	try {
		const d = uni.getStorageSync(QX_BLE_SCHEDULED_DEVICE_KEY)
		if (d === 'bpw1' || d === 'bpw6') {
			return d
		}
	} catch (e) {}
	if (!hasActiveQxBleCollection()) {
		return ''
	}
	return isQxBpw6EmotionMode() ? 'bpw6' : 'bpw1'
}

/** BPW1 定时 PPG 进行中（不含 BPW6 定时，避免双绑互挡） */
export function isQxBpw1ScheduledMeasureActive() {
	if (!hasActiveQxBleCollection()) return false
	return getQxScheduledMeasureDevice() === 'bpw1'
}

/** BPW6 定时 PPG 进行中（不含 BPW1 定时） */
export function isQxBpw6ScheduledMeasureActive() {
	if (!hasActiveQxBleCollection()) return false
	return getQxScheduledMeasureDevice() === 'bpw6'
}

/** 已抢占槽位且仍在 BLE 下发/采集窗口内（此时尚无 sendwatch） */
function isQxSlotClaimActive() {
	if (qxSlotClaimedAt <= 0) return false
	return Date.now() - qxSlotClaimedAt < QX_SLOT_CLAIM_ACTIVE_MS
}

/** 调度器是否正在执行/等待本轮定时采集 */
function isQxScheduleMeasureBusy() {
	if (qxMeasureInFlight || hasActiveQxBleCollection() || isQxSlotClaimActive()) {
		return true
	}
	// 同机型立即测量进行中：定时勿抢发（另一机型立即测量不挡本机定时）
	const schedKind = isQxBpw6EmotionMode() ? 'bpw6' : 'bpw1'
	if (isQxEmotionImmediateBusy(schedKind)) {
		return true
	}
	// 真实托管拉数中（标志偶发已清）仍算忙；裸残留 xfer 不算
	return !!(u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead())
}

/** 本轮槽位未完成前勿重算下一槽位（避免 21:40 到点却立刻排到 21:45） */
function shouldPreserveCurrentMeasureSlot() {
	if (isQxMeasureSessionActive()) return true
	const measureSlot = readMeasureSlotAt()
	if (measureSlot <= 0) return false
	return Date.now() - measureSlot < readIntervalMinute() * 60 * 1000
}

function markQxScheduledMeasureStorage(deviceKind = '') {
	uni.setStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY, 1)
	if (deviceKind === 'bpw1' || deviceKind === 'bpw6') {
		try {
			uni.setStorageSync(QX_BLE_SCHEDULED_DEVICE_KEY, deviceKind)
		} catch (e) {}
	}
}

function clearQxScheduledMeasureStorage() {
	uni.removeStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	try {
		uni.removeStorageSync(QX_BLE_SCHEDULED_DEVICE_KEY)
	} catch (e2) {}
}

/**
 * 仅当本轮定时归属该机型（或尚无归属）时清 sendwatch/调度标记。
 * 避免 BPW1 结束包清掉 BPW6 定时，或反之。
 * @returns {boolean} 是否实际清理
 */
export function clearQxScheduledMeasureIfDevice(deviceKind) {
	if (deviceKind !== 'bpw1' && deviceKind !== 'bpw6') {
		uni.removeStorageSync('sendwatch')
		clearQxScheduledMeasureStorage()
		return true
	}
	const active = getQxScheduledMeasureDevice()
	if (active && active !== deviceKind) {
		return false
	}
	uni.removeStorageSync('sendwatch')
	clearQxScheduledMeasureStorage()
	return true
}

export function markQxPpgXferBusy() {
	try {
		uni.setStorageSync(QX_PPG_XFER_BUSY_KEY, 1)
		uni.setStorageSync(QX_PPG_XFER_BUSY_AT_KEY, Date.now())
	} catch (e) {}
}

/** 拉数/上传进行中刷新时间戳，避免长传数被 xfer orphan 误清 */
export function touchQxPpgXferBusy() {
	try {
		if (!isQxPpgXferBusy()) return
		uni.setStorageSync(QX_PPG_XFER_BUSY_AT_KEY, Date.now())
	} catch (e) {}
}

export function clearQxPpgXferBusy() {
	try {
		uni.removeStorageSync(QX_PPG_XFER_BUSY_KEY)
		uni.removeStorageSync(QX_PPG_XFER_BUSY_AT_KEY)
	} catch (e) {}
}

export function isQxPpgXferBusy() {
	try {
		const v = uni.getStorageSync(QX_PPG_XFER_BUSY_KEY)
		return v === 1 || v === '1'
	} catch (e) {
		return false
	}
}

/**
 * 定时 PPG 拉数/上传专用：强占 WakeLock + 保活前台服务
 * （立即测量不调用，避免影响前台立即测量体验）
 * 仅托管拉数中 touch 时间戳；等待测完勿续期（否则 xfer 永不 orphan、假「测量进行中」）
 */
export function ensureQxPpgXferBackgroundRuntime(reason = '') {
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().platform !== 'android') return Promise.resolve(true)
	acquireQxBleWakeLock()
	// 前台：勿频繁 setAlarm/刷通知（会卡页面）；后台才加强唤醒
	if (qxAppInForeground) {
		const managed = !!(u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead())
		if (managed || isQxPpgXferBusy()) {
			touchQxPpgXferBusy()
		}
		return Promise.resolve(true)
	}
	ensureQxBleKeepAliveForBackground()
	const managed = !!(u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead())
	if (managed || isQxPpgXferBusy()) {
		touchQxPpgXferBusy()
		// 仅后台：托管分块 1 秒唤醒；上传 3 秒
		const wakeAt = Date.now() + (managed ? 1000 : 3000)
		try {
			if (keepAliveManager && typeof keepAliveManager.setAlarmForQxNextSlot === 'function') {
				keepAliveManager.setAlarmForQxNextSlot(wakeAt)
			}
		} catch (eAlarm) {}
	}
	const now = Date.now()
	if (!qxLastKeepAliveNotifAt || now - qxLastKeepAliveNotifAt > 8000) {
		qxLastKeepAliveNotifAt = now
		try {
			refreshKeepAliveNotificationIfNeeded()
		} catch (e) {}
	}
	if (reason) {}
	return Promise.resolve(true)
	// #endif
	return Promise.resolve(true)
}

/** 拉数/上传标记超时或无时间戳：视为残留，可清并可被新槽抢占 */
function isQxPpgXferOrphaned() {
	if (!isQxPpgXferBusy()) return false
	try {
		const at = Number(uni.getStorageSync(QX_PPG_XFER_BUSY_AT_KEY))
		if (!Number.isFinite(at) || at <= 0) return true
		return Date.now() - at > QX_PPG_XFER_ORPHAN_MS
	} catch (e) {
		return true
	}
}

function cancelDeferredPlanNext() {
	if (deferredPlanNextTimer != null) {
		clearTimeout(deferredPlanNextTimer)
		deferredPlanNextTimer = null
	}
}

/**
 * 清除上一轮排程任务（JS 定时器、心跳、延后排程、槽位缓存等），避免重复调度冲突
 * @param {object} [opts]
 * @param {boolean} [opts.preserveMeasureSession] 采集中时保留测量会话与 inFlight，仅清排程侧重复任务
 */
function clearQxBleScheduleTasks(opts = {}) {
	const preserveMeasure = !!opts.preserveMeasureSession
	clearTimer()
	stopScheduleHeartbeat()
	cancelDeferredPlanNext()
	clearQxMeasureWatchdog()
	heartbeatDueTriggerPending = false
	planNextInFlight = false
	deferredPlanNextRetry = 0
	if (preserveMeasure) {
		return
	}
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	releaseQxSlotExecuteLock()
	qxScheduleSessionFirstRun = false
	clearQxScheduledMeasureStorage()
	clearStaleQxScheduledMeasureState()
	clearNextFireAt()
	clearMeasureSlotAt()
}

/** 无 inFlight 但残留定时采集标记时清理（防止延后排程死循环） */
function clearStaleQxScheduledMeasureState() {
	if (qxMeasureInFlight || isQxSlotClaimActive()) return
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	if (scheduled !== 1 && scheduled !== '1') return
	const sendwatch = uni.getStorageSync('sendwatch')
	if (sendwatch === 1 || sendwatch === '1') return
	clearQxScheduledMeasureStorage()
	cancelDeferredPlanNext()
}

function isQxScheduledMeasureStorageOn() {
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	return scheduled === 1 || scheduled === '1'
}

/** Main 正在采集（读 storage，不改 Main.vue） */
export function isMainSleepAlertMeasureBusy() {
	const v = uni.getStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY)
	return v === true || v === 'true' || v === 1 || v === '1'
}

/** 清除调度侧「测量进行中」相关状态（不误清非定时测量的 sendwatch） */
function resetQxScheduleBusyState(reason, opts = {}) {
	const advanceSlot = opts.advanceSlot === true
	const clearSendwatch = opts.clearSendwatch === true ||
		(opts.clearSendwatch !== false && (qxMeasureInFlight || isQxScheduledMeasureStorageOn()))
	const wasInFlight = qxMeasureInFlight
	const logSessionEnd = opts.sessionEnd !== false
	clearQxMeasureWatchdog()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	deferredPlanNextRetry = 0
	releaseQxSlotExecuteLock()
	qxScheduleSessionFirstRun = false
	clearQxScheduledMeasureStorage()
	clearMeasureSlotAt()
	// 必须清 xfer：否则心跳 touch 续期 → 永久「测量进行中」
	clearQxPpgXferBusy()
	if (clearSendwatch) {
		uni.removeStorageSync('sendwatch')
	}
	// 立即测量进行中：只清调度残留，勿清灰/勿发 busy=false（否则会打断手动立即测量）
	if (!isQxEmotionImmediateBusy()) {
		try {
			uni.setStorageSync('sleep_alertdisabled', false)
		} catch (e) {}
		try {
			uni.$emit('EMOTION_MEASURE_BUSY', false)
		} catch (e2) {}
	}
	if (logSessionEnd && (wasInFlight || reason)) {}
	if (advanceSlot && isSwitchOn() && isCurrentlyInScheduleWindow()) {
		syncNextAlignedFireAt(new Date(Date.now() + 800))
		const nextAt = readNextFireAt()
		if (nextAt > 0 && Date.now() >= nextAt - 500) {
			scheduleDeferredPlanNext(`采集结束-${reason}`)
		}
	}
}

function getQxMeasureStatusLabel() {
	// 首次调度启动中 / 采集中：统一显示测量状态；前后台由 appendQxHeartbeatStatusParts 单独追加
	if (isQxScheduleMeasureBusy()) {
		return '测量进行中'
	}
	// sleep_alertdisabled 单独残留时不显示「测量进行中」，避免无采集/失败后卡死
	// 有定时采集证据时仍显示（与 isQxMeasureSessionActive 对齐）
	if (isMainSleepAlertMeasureBusy()) {
		const sendwatch = uni.getStorageSync('sendwatch')
		const hasSend = sendwatch === 1 || sendwatch === '1'
		if (hasSend || isQxScheduledMeasureStorageOn() || readMeasureSlotAt() > 0) {
			return '测量进行中'
		}
	}
	return '待命'
}

/** 心跳末尾状态 */
function appendQxHeartbeatStatusParts(parts) {
	const fgLabel = qxAppInForeground ? '前台' : '后台'
	parts.push(getQxMeasureStatusLabel())
	parts.push(fgLabel)
}

function clearQxMeasureWatchdog() {
	if (qxMeasureWatchdogTimer != null) {
		clearTimeout(qxMeasureWatchdogTimer)
		qxMeasureWatchdogTimer = null
	}
}

function startQxMeasureWatchdog() {
	clearQxMeasureWatchdog()
	qxMeasureWatchdogTimer = setTimeout(() => {
		qxMeasureWatchdogTimer = null
		if (!qxMeasureInFlight) return
		const managed = !!(u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead())
		// 仅真实托管拉数中延后；裸 xfer/等待测完超时一律结束，避免假「测量进行中」
		if (managed) {
			startQxMeasureWatchdog()
			return
		}
		finishQxBleMeasurementSession('采集超时')
	}, QX_MEASURE_SESSION_MAX_MS)
}

/** 计算 anchor 之后第一个对齐槽位时间戳（多时段并集） */
function computeAlignedSlotAt(anchorDate) {
	const slot = getNextUnionAlignedSlotDate(new Date(), anchorDate)
	return slot ? slot.getTime() : 0
}

/** 是否已到下一间隔且上一轮采集仍未结束（按并集下一槽点，重叠只算一次） */
function isNewIntervalDueWhileMeasuring(now = Date.now()) {
	if (!isQxMeasureSessionActive()) return false
	const measureSlot = readMeasureSlotAt()
	if (measureSlot <= 0) return false
	const next = getNextUnionAlignedSlotDate(new Date(now), new Date(measureSlot + 1))
	if (next) {
		return now >= next.getTime() - 500
	}
	return now >= measureSlot + readIntervalMs() - 500
}

/**
 * 新槽到点、上一轮未结束：判上一轮失败，恢复待命并清标记，不补发旧槽
 * @returns {number} 应执行的新槽位时间戳
 */
function failPreviousSlotForNewDue(dueSlotAt, reason = '') {
	const oldSlot = readMeasureSlotAt() || readNextFireAt()
	cancelDeferredPlanNext()
	clearQxMeasureWatchdog()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	qxSlotExecuteLockAt = 0
	deferredPlanNextRetry = 0
	qxScheduleSessionFirstRun = false
	clearQxPpgXferBusy()
	clearQxScheduledMeasureStorage()
	clearMeasureSlotAt()
	uni.removeStorageSync('sendwatch')
	uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, false)
	try {
		uni.$emit('EMOTION_MEASURE_BUSY', false)
	} catch (e) {}
	let targetAt = dueSlotAt
	if (!(targetAt > 0)) {
		const anchor = new Date(Math.max(Date.now(), (oldSlot || Date.now()) + readIntervalMs()))
		targetAt = computeAlignedSlotAt(anchor)
		if (targetAt <= 0) {
			targetAt = syncNextAlignedFireAt(anchor)
		}
	} else {
		persistNextFireAt(targetAt)
	}
	return targetAt
}

function getQxSlotOverdueSec(slotAt, now = Date.now()) {
	if (!slotAt || slotAt <= 0) return 0
	return Math.max(0, Math.floor((now - slotAt) / 1000))
}

/** 槽位逾期是否已超过放弃补发阈值（180 秒） */
function isQxSlotOverdueAbandoned(slotAt, now = Date.now()) {
	if (!slotAt || slotAt <= 0) return false
	return now > slotAt + QX_SLOT_OVERDUE_ABANDON_MS
}

/** 槽位逾期是否已达指定毫秒数（含边界，用于下发失败 13 秒等） */
function isQxSlotOverdueAtLeastMs(slotAt, minOverdueMs, now = Date.now()) {
	if (!slotAt || slotAt <= 0 || !(minOverdueMs > 0)) return false
	return now >= slotAt + minOverdueMs
}

/**
 * 逾期达到 minOverdueMs：清空旧槽位并对齐下一格
 * @returns {number} 当前应使用的下一槽位时间戳
 */
function skipQxSlotIfOverdueAtLeast(reason = '', minOverdueMs, logTag = '', now = Date.now(),
	skipThresholdCheck = false) {
	const oldAt = readNextFireAt()
	if (!skipThresholdCheck && !isQxSlotOverdueAtLeastMs(oldAt, minOverdueMs, now)) {
		return oldAt
	}
	const overdueSec = getQxSlotOverdueSec(oldAt, now)
	const anchor = new Date(Math.max(now, oldAt + 1000))
	let newAt = computeAlignedSlotAt(anchor)
	if (newAt <= 0) {
		newAt = syncNextAlignedFireAt(anchor)
	} else {
		persistNextFireAt(newAt)
	}
	if (readMeasureSlotAt() === oldAt && !isQxMeasureSessionActive()) {
		clearMeasureSlotAt()
		releaseQxSlotExecuteLock()
		clearQxScheduledMeasureStorage()
	}
	const tag = logTag || '//定时测量-逾期清空'
	return newAt
}

/** 逾期超过 180 秒：清空旧槽位时间，对齐到当前下一格，不补发 */
function skipQxSlotIfOverdueBeyondAbandon(reason = '', now = Date.now()) {
	const oldAt = readNextFireAt()
	if (!isQxSlotOverdueAbandoned(oldAt, now)) {
		return oldAt
	}
	return skipQxSlotIfOverdueAtLeast(reason, 0, '//定时测量-逾期超180秒清空', now, true)
}

/** 下发失败：已到/已过槽位则立即清空逾期时间，改排下一对齐时刻（不同槽补发） */
function clearQxSlotOnDispatchFail(reason = '', now = Date.now()) {
	const oldAt = readNextFireAt() || readMeasureSlotAt()
	if (!oldAt || oldAt <= 0 || now < oldAt - 500) {
		return readNextFireAt()
	}
	return skipQxSlotIfOverdueAtLeast(reason, 0, '//定时测量-下发失败清空', now, true)
}

function scheduleQxDispatchAfterSlotClear(reason, now = Date.now()) {
	const nextAt = readNextFireAt()
	scheduleQxBleNativeAlarm()
	if (nextAt > 0 && now >= nextAt - 500) {
		// 新槽已到点：必须立刻下发一次
		runQxBleScheduleWakeTick(reason || '新槽必发').catch((e) => {
			console.log('[qxBle] dispatch-fail wake', e)
		})
	} else if (nextAt > 0) {
		// 新槽未到点：对准该槽，到点必发
		schedulePlanNext(Math.max(0, nextAt - now))
	} else {
		scheduleDeferredPlanNext(reason)
	}
}

/** 到点应下发的槽位：若跨间隔且上一轮未结束则先失败上一轮并对齐到最新槽 */
function resolveQxDueSlotForDispatch(now = Date.now()) {
	let nextAt = skipQxSlotIfOverdueBeyondAbandon('排程', now)
	if (nextAt <= 0) {
		nextAt = readNextFireAt()
	}
	if (isNewIntervalDueWhileMeasuring(now)) {
		const measureSlot = readMeasureSlotAt()
		const anchor = new Date(Math.max(now, measureSlot + readIntervalMs()))
		let newAt = computeAlignedSlotAt(anchor)
		if (newAt <= 0) {
			newAt = syncNextAlignedFireAt(anchor)
		}
		failPreviousSlotForNewDue(newAt, '新槽到点上一轮未结束')
		return readNextFireAt() || newAt
	}
	if (nextAt > 0 && isQxSlotSupersededByNextInterval(nextAt)) {
		const anchorMs = Math.max(now, nextAt + readIntervalMs())
		const anchor = new Date(anchorMs)
		let newAt = computeAlignedSlotAt(anchor)
		if (newAt <= 0) {
			newAt = syncNextAlignedFireAt(anchor)
		}
		if (isQxMeasureSessionActive()) {
			failPreviousSlotForNewDue(newAt, '逾期不补发旧槽')
		} else {
			persistNextFireAt(newAt)
		}
		return newAt
	}
	return nextAt
}

/** 到点新槽位抢占：终止上一轮（判失败、清数据），由随后 execute 发新槽命令 */
function abortQxBleMeasurementForNewSlot(reason, dueSlotAt = 0) {
	if (!isQxMeasureSessionActive() && uni.getStorageSync('sendwatch') !== 1 &&
		uni.getStorageSync('sendwatch') !== '1') {
		clearQxScheduledMeasureStorage()
		return false
	}
	failPreviousSlotForNewDue(dueSlotAt, reason)
	return true
}

/**
 * 设备/Main 已结束采集但调度仍标记「测量进行中」时纠偏（常见于后台未收到 BLE notify）
 * @returns {boolean} 是否已纠偏结束会话
 */
function reconcileQxMeasureInFlightState() {
	if (!qxMeasureInFlight) return false
	// 拉数/上传中：勿因标记短暂不一致结束会话
	if (isQxPpgXferBusy()) return false
	const sendwatch = uni.getStorageSync('sendwatch')
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const hasSched = scheduled === 1 || scheduled === '1'
	if (!hasSend && !hasSched) {
		const refAt = qxMeasureSessionStartedAt || qxSlotClaimedAt
		if (refAt <= 0 || Date.now() - refAt < QX_RECONCILE_FLAGS_GRACE_MS) {
			return false
		}
		finishQxBleMeasurementSession('状态纠偏-标记已清')
		return true
	}
	const started = qxMeasureSessionStartedAt
	if (started > 0 && Date.now() - started > QX_MEASURE_SESSION_ORPHAN_MS) {
		finishQxBleMeasurementSession('状态纠偏-会话超时')
		return true
	}
	return false
}

/**
 * 纠正假「测量进行中」：无真实采集的 inFlight / 槽位抢占 / 残留调度标记
 * @returns {boolean} 是否已纠偏
 */
function reconcileQxScheduleBusyState() {
	const now = Date.now()
	const managed = !!(u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead())
	const sessionRef = qxMeasureSessionStartedAt || qxSlotClaimedAt || readMeasureSlotAt()
	const sessionAge = sessionRef > 0 ? now - sessionRef : 0

	// 无真实托管拉数且会话超时：强制恢复待命
	// 但 xfer 仍忙且未 orphan 时勿清（拉数刚结束→上传/云端轮询中）
	if (!managed && sessionRef > 0 && sessionAge > QX_MEASURE_SESSION_ORPHAN_MS &&
		(qxMeasureInFlight || hasActiveQxBleCollection() || isQxPpgXferBusy() ||
			isMainSleepAlertMeasureBusy() || isQxSlotClaimActive())) {
		if (isQxPpgXferBusy() && !isQxPpgXferOrphaned()) {
			return false
		}
		resetQxScheduleBusyState('纠偏-超时无拉数强制待命', {
			advanceSlot: true,
			clearSendwatch: true,
			sessionEnd: true
		})
		return true
	}

	if (reconcileQxMeasureInFlightState()) {
		return true
	}
	// 拉数/上传中：仅托管拉数保护；其余清残留 xfer
	if (isQxPpgXferBusy()) {
		if (managed) {
			return false
		}
		if (isQxPpgXferOrphaned() || !qxMeasureInFlight ||
			(sessionRef > 0 && sessionAge > QX_RECONCILE_FLAGS_GRACE_MS)) {
			clearQxPpgXferBusy()
		} else if (qxMeasureInFlight) {
			// 等待测完窗口内：暂不纠偏
			return false
		}
	}
	const hasSched = isQxScheduledMeasureStorageOn()
	const sendwatch = uni.getStorageSync('sendwatch')
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const hasSleepUiBusy = isMainSleepAlertMeasureBusy()
	const measureSlot = readMeasureSlotAt()

	// 无 inFlight、无抢占：残留调度/sendwatch/测量中 UI 标记应恢复待命
	// （页面重载后 inFlight 丢失最常见；勿误清无槽位的手动 sendwatch）
	if (!qxMeasureInFlight && !isQxSlotClaimActive()) {
		// hasSend 且无槽位、无调度：多为上一轮残留（拉数未完成/纠偏半清）。
		// 有 xfer 时已在上方处理；此处必须清掉，否则新槽 forever「测量进行中」且不下发。
		if (hasSend && !hasSched && measureSlot <= 0) {
			resetQxScheduleBusyState('纠偏-无槽位残留sendwatch', {
				advanceSlot: false,
				clearSendwatch: true,
				sessionEnd: false
			})
			return true
		}
		if (hasSched || (hasSend && measureSlot > 0) ||
			(hasSleepUiBusy && (hasSched || (hasSend && measureSlot > 0) || measureSlot > 0))) {
			const refAt = qxMeasureSessionStartedAt || measureSlot || 0
			// refAt==0 时勿立刻清（会把 startedAt 置 0 后每次心跳都纠偏）
			if (refAt > 0 && now - refAt >= QX_RECONCILE_FLAGS_GRACE_MS) {
				resetQxScheduleBusyState('纠偏-残留测量中标记', {
					advanceSlot: false,
					clearSendwatch: !!(hasSched || (hasSend && measureSlot > 0)),
					sessionEnd: false
				})
				return true
			}
			// 无 startedAt/槽位时间戳但有调度标记：视为死会话，立即清
			if (refAt <= 0 && (hasSched || hasSend)) {
				resetQxScheduleBusyState('纠偏-无时间戳死会话', {
					advanceSlot: false,
					clearSendwatch: true,
					sessionEnd: false
				})
				return true
			}
		}
		// 仅 sleep_alertdisabled 残留、无 sendwatch/调度/槽位
		if (hasSleepUiBusy && !hasSend && !hasSched && measureSlot <= 0) {
			if (isQxEmotionImmediateBusy()) {
				return false
			}
			try {
				uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, false)
			} catch (e) {}
			try {
				uni.$emit('EMOTION_MEASURE_BUSY', false)
			} catch (e2) {}
			return true
		}
	}

	if (hasSched && !qxMeasureInFlight && !isQxSlotClaimActive() && !hasSend) {
		clearQxScheduledMeasureStorage()
		return true
	}

	if (qxSlotClaimedAt > 0 && qxMeasureSessionStartedAt <= 0) {
		const claimAge = now - qxSlotClaimedAt
		if (claimAge >= QX_SLOT_CLAIM_ORPHAN_MS) {
			resetQxScheduleBusyState('纠偏-抢占无采集', {
				advanceSlot: true,
				clearSendwatch: hasSched || hasSend,
				sessionEnd: false
			})
			return true
		}
	}

	if (qxMeasureInFlight && !hasSend && !hasSched) {
		// 后台准备期（探测/notify）尚无 sendwatch：勿当假 inFlight 清掉，否则会跳槽并重复下发
		if (isQxSlotClaimActive()) {
			return false
		}
		const refAt = qxMeasureSessionStartedAt || qxSlotClaimedAt
		if (refAt > 0 && now - refAt >= QX_RECONCILE_FLAGS_GRACE_MS) {
			resetQxScheduleBusyState('纠偏-inFlight无采集', {
				advanceSlot: true,
				clearSendwatch: true,
				sessionEnd: false
			})
			return true
		}
	}

	if (hasSched && hasSend && !qxMeasureInFlight && qxMeasureSessionStartedAt <= 0) {
		const refAt = qxSlotClaimedAt || measureSlot
		if (refAt > 0 && now - refAt >= QX_SLOT_CLAIM_ORPHAN_MS) {
			resetQxScheduleBusyState('纠偏-标记在会话未启动', {
				advanceSlot: true,
				clearSendwatch: true,
				sessionEnd: false
			})
			return true
		}
	}

	// BPW6：已下发但长时间无结束回调 → 按失败恢复待命（避免一直「测量进行中」）
	if (!managed && isQxBpw6EmotionMode() &&
		(qxMeasureInFlight || hasSend || hasSched || hasSleepUiBusy)) {
		const started = qxMeasureSessionStartedAt || qxSlotClaimedAt || measureSlot
		if (started > 0 && now - started > QX_MEASURE_SESSION_ORPHAN_MS) {
			resetQxScheduleBusyState('纠偏-BPW6会话超时', {
				advanceSlot: true,
				clearSendwatch: true,
				sessionEnd: true
			})
			return true
		}
	}

	return false
}

function finishQxBleMeasurementSession(reason) {
	if (!qxMeasureInFlight && !isQxScheduledMeasureStorageOn() && !isQxSlotClaimActive() &&
		!isMainSleepAlertMeasureBusy() && uni.getStorageSync('sendwatch') !== 1 &&
		uni.getStorageSync('sendwatch') !== '1') {
		return
	}
	resetQxScheduleBusyState(reason, {
		advanceSlot: true,
		clearSendwatch: true
	})
	resumeQxBleTimeSyncAfterMeasure()
	refreshKeepAliveNotificationIfNeeded()
}

/** Main.vue 收到手表「结束采集」或采集异常清理 sendwatch 时调用
 * @param {string} reason
 * @param {'bpw1'|'bpw6'|''} [deviceKind] 传入机型时仅清本机定时，避免双绑互清
 */
export function onQxBleWatchCollectionEnded(reason = '设备采集结束', deviceKind = '') {
	if (deviceKind === 'bpw1' || deviceKind === 'bpw6') {
		const active = getQxScheduledMeasureDevice()
		if (active && active !== deviceKind) {
			return
		}
		clearQxPpgXferBusy()
		if (deviceKind === 'bpw6') {
			clearBpw6ScheduleCompleteRelayFlag()
		}
		const wasInFlight = qxMeasureInFlight
		clearQxScheduledMeasureIfDevice(deviceKind)
		try {
			uni.setStorageSync('sleep_alertdisabled', false)
		} catch (e) {}
		if (wasInFlight) {
			finishQxBleMeasurementSession(reason)
			return
		}
		resetQxScheduleBusyState(reason, {
			advanceSlot: false,
			clearSendwatch: false,
			sessionEnd: false
		})
		refreshKeepAliveNotificationIfNeeded()
		return
	}
	clearQxPpgXferBusy()
	clearBpw6ScheduleCompleteRelayFlag()
	const wasInFlight = qxMeasureInFlight
	clearQxScheduledMeasureStorage()
	uni.removeStorageSync('sendwatch')
	try {
		uni.setStorageSync('sleep_alertdisabled', false)
	} catch (e) {}
	if (wasInFlight) {
		finishQxBleMeasurementSession(reason)
		return
	}
	resetQxScheduleBusyState(reason, {
		advanceSlot: false,
		clearSendwatch: false,
		sessionEnd: false
	})
	refreshKeepAliveNotificationIfNeeded()
}

function scheduleDeferredPlanNext(reason) {
	if (deferredPlanNextTimer != null) return
	deferredPlanNextTimer = setTimeout(() => {
		deferredPlanNextTimer = null
		if (qxMeasureInFlight) {
			reconcileQxScheduleBusyState()
			if (qxMeasureInFlight) {
				deferredPlanNextRetry += 1
				if (deferredPlanNextRetry >= QX_DEFERRED_PLAN_MAX_RETRY) {
					finishQxBleMeasurementSession('延后排程强制结束')
				} else {
					scheduleDeferredPlanNext('测量仍未结束')
				}
			}
			if (qxMeasureInFlight) return
		}
		deferredPlanNextRetry = 0
		clearStaleQxScheduledMeasureState()
		planNext({
			lifecycle: true
		}).catch((e) => console.log('[qxBle] deferred planNext', e))
	}, 8500)
}

export function setQxBleAppForegroundState(foreground) {
	qxAppInForeground = !!foreground
}

export function isQxBleAppInForeground() {
	return !!qxAppInForeground
}

/** 测量/休眠唤醒期间持有 CPU，避免发 BLE 时被系统挂起 */
function acquireQxBleWakeLock() {
	// #ifdef APP-PLUS
	try {
		const plugin = uni.requireNativePlugin('ThirdSdkPlugin-ThirdSdkModule')
		if (plugin && typeof plugin.acquireWakeLock === 'function') {
			plugin.acquireWakeLock({}, () => {})
		}
	} catch (e) {
		console.log('[qxBle] acquireWakeLock', e)
	}
	// #endif
}

function updateQxBleWatchConnectionState(connected, reason = '') {
	const was = qxBleWatchConnected
	qxBleWatchConnected = !!connected
	if (qxBleWatchConnected) {
		const bpw6 = uni.getStorageSync('BPW6devicemac')
		if (bpw6 && isSameQxBleDeviceId(readQxEmotionDeviceId(), bpw6)) {
			qxBleBpw6SessionConnected = true
			qxBleBpw6BgConnectedLatch = true
		}
	} else if (qxAppInForeground) {
		// 仅前台确认断开时清会话粘性
		qxBleBpw6SessionConnected = false
		qxBleBpw6BgConnectedLatch = false
	}
	if (was && !qxBleWatchConnected) {}
}

/**
 * 调用 getConnectedBluetoothDevices 同步连接态
 * @param {{ reason?: string, logOnMissing?: boolean }} options
 */
function syncQxBleWatchConnectedFromSystem(options = {}) {
	const reason = options.reason || ''
	const logOnMissing = !!options.logOnMissing
	return new Promise((resolve) => {
		const dev = readQxEmotionDeviceId()
		if (!dev) {
			qxBleWatchConnected = false
			qxBleMonitoredDeviceId = ''
			resolve(false)
			return
		}
		qxBleMonitoredDeviceId = dev
		const finish = (connectedFromSystem, allowHint = false) => {
			let connected = !!connectedFromSystem
			const isBpw6Target = isSameQxBleDeviceId(dev, uni.getStorageSync('BPW6devicemac'))
			const hadHint = readQxBleConnectedHint(dev)
			const hadMem = !!qxBleWatchConnected

			// 后台：getConnectedBluetoothDevices 空列表不可信，BPW6 绝不因此降为未连接
			if (!connected && !qxAppInForeground && isBpw6Target) {
				if (hadHint || hadMem || allowHint || qxBleBpw6SessionConnected ||
					qxBleBpw6BgConnectedLatch || hasBpw6LiveLinkEvidence(dev)) {
					updateQxBleWatchConnectionState(true, `${reason || 'sys'}-bg-keep`)
					qxBleBpw6BgConnectedLatch = true
					try {
						uni.setStorageSync('qx_bpw6_ble_connected', true)
					} catch (e) {}
					resolve(true)
					return
				}
				resolve(!!qxBleWatchConnected)
				return
			}

			// 前台/非 BPW6：系统已连接列表常漏报时用 hint 兜底
			if (!connected && (allowHint || isBpw6Target) && hadHint) {
				connected = true
			}
			if (connected) {
				updateQxBleWatchConnectionState(true, reason || 'getConnectedBluetoothDevices')
				try {
					if (isBpw6Target) {
						uni.setStorageSync('qx_bpw6_ble_connected', true)
					} else {
						uni.setStorageSync('qx_bpw1_ble_connected', true)
					}
				} catch (e) {}
				resolve(true)
				return
			}
			// 仅前台确认未连接时才清标记
			if (!allowHint) {
				clearQxDeviceConnectedFlags(dev)
			}
			updateQxBleWatchConnectionState(false, reason || 'getConnectedBluetoothDevices')
			resolve(false)
		}
		if (typeof uni.getConnectedBluetoothDevices !== 'function') {
			finish(false, true)
			return
		}
		if (qxBleConnectedPollInFlight) {
			resolve(qxBleWatchConnected)
			return
		}
		qxBleConnectedPollInFlight = true
		const queryConnected = () => {
			uni.getConnectedBluetoothDevices({
				success: (res) => {
					qxBleConnectedPollInFlight = false
					const list = res.devices || []
					const connected = list.some((d) => isSameQxBleDeviceId(d && d.deviceId,
						dev))
					finish(connected, false)
				},
				fail: (err) => {
					qxBleConnectedPollInFlight = false
					finish(false, true)
				}
			})
		}
		// 与 Main 一致：先确保适配器可用，再查已连接列表（否则易空列表误报未连接）
		if (typeof uni.openBluetoothAdapter === 'function') {
			uni.openBluetoothAdapter({
				success: queryConnected,
				fail: () => {
					queryConnected()
				}
			})
		} else {
			queryConnected()
		}
	})
}

/** 注册连接变化监听，并由时段内心跳持续轮询 getConnectedBluetoothDevices */
function initQxBleConnectionMonitor() {
	const dev = readQxEmotionDeviceId()
	if (!qxBleConnectionListenerBound) {
		qxBleConnectionListenerBound = true
		if (typeof uni.onBLEConnectionStateChange === 'function') {
			uni.onBLEConnectionStateChange((change) => {
				if (!change) return
				const watchId = readQxEmotionDeviceId()
				if (!watchId || !isSameQxBleDeviceId(change.deviceId, watchId)) return
				// BPW6 后台假断开：不立刻改未连接，交给带 hint 的系统查询兜底
				if (!change.connected && !qxAppInForeground &&
					isSameQxBleDeviceId(change.deviceId, uni.getStorageSync('BPW6devicemac'))) {
					syncQxBleWatchConnectedFromSystem({
						reason: 'onBLEConnectionStateChange-bg'
					})
					// 展示态保持；通知 Main / 本地静默重连 GATT
					requestBpw6SilentReconnect(change.deviceId, 'qxBle-bg-disconnect')
					return
				}
				updateQxBleWatchConnectionState(!!change.connected, 'onBLEConnectionStateChange')
				try {
					if (isQxBpw6EmotionMode()) {
						uni.setStorageSync('qx_bpw6_ble_connected', !!change.connected)
					} else {
						uni.setStorageSync('qx_bpw1_ble_connected', !!change.connected)
					}
				} catch (e) {}
				syncQxBleWatchConnectedFromSystem({
					reason: 'onBLEConnectionStateChange'
				})
			})
		}
		// 主链路/BC 写入成功：立刻恢复已连接（解决读电量成功但心跳长期「未连接」）
		try {
			uni.$on('BPW6_GATT_ALIVE', (payload) => {
				const mac = (payload && payload.deviceId) || uni.getStorageSync('BPW6devicemac') || ''
				if (!mac) return
				notifyQxBleWatchConnectionState(true, mac)
				qxBleBpw6SessionConnected = true
				qxBleBpw6BgConnectedLatch = true
			})
		} catch (eOn) {}
	}
	if (dev) {
		if (readQxBleConnectedHint(dev) || hasBpw6LiveLinkEvidence(dev)) {
			updateQxBleWatchConnectionState(true, 'init-hint')
		}
		syncQxBleWatchConnectedFromSystem({
			reason: 'initQxBleConnectionMonitor'
		})
	} else {
		qxBleWatchConnected = false
		qxBleMonitoredDeviceId = ''
	}
}

/** 时段内心跳：后台/熄屏时补一轮 getConnectedBluetoothDevices */
function pollQxBleWatchConnectedState() {
	const dev = readQxEmotionDeviceId()
	if (!dev) return
	// BPW6 后台：系统列表不可信，只巩固已连接标记，绝不在此降为未连接
	if (!qxAppInForeground && isSameQxBleDeviceId(dev, uni.getStorageSync('BPW6devicemac'))) {
		if (isAndroidBluetoothReallyOff() === true) return
		updateQxBleWatchConnectionState(true, '后台心跳保连')
		qxBleBpw6SessionConnected = true
		qxBleBpw6BgConnectedLatch = true
		try {
			uni.setStorageSync('qx_bpw6_ble_connected', true)
		} catch (e) {}
		return
	}
	syncQxBleWatchConnectedFromSystem({
		reason: '时段内心跳轮询'
	})
}

/** 是否已配置手表 deviceId（下发测量仅依赖此项，不因已连接列表拦截） */
function hasQxBleWatchDeviceId() {
	return !!readQxEmotionDeviceId()
}

/** 监测用：同步 getConnectedBluetoothDevices（仅日志/心跳，不阻断下发） */
function verifyQxBleWatchConnected(reason = '') {
	initQxBleConnectionMonitor()
	return syncQxBleWatchConnectedFromSystem({
		reason: reason || 'verify',
		logOnMissing: false
	})
}

/** 到点未成功：未跨间隔则同槽补发；跨间隔且上一轮未结束则判失败并执行最新槽（不补发旧槽） */
function scheduleQxSlotDispatchRetry(reason = '') {
	const now = Date.now()
	skipQxSlotIfOverdueBeyondAbandon(`补发前-${reason || 'retry'}`, now)
	if (isNewIntervalDueWhileMeasuring(now)) {
		const slotAt = resolveQxDueSlotForDispatch(now)
		if (slotAt > 0 && now >= slotAt - 500) {
			scheduleQxBleNativeAlarm()
			runQxBleScheduleWakeTick(`新槽-${reason || 'retry'}`).catch((e) => {
				console.log('[qxBle] new-slot wake', e)
			})
		}
		return
	}
	if (isQxMeasureSessionActive()) return
	const pendingSlot = readNextFireAt()
	if (pendingSlot > 0 && now >= pendingSlot - 500) {
		// 到点未成功：短间隔再试，勿立刻清空槽位（否则会跳到下一格并丢掉本槽）
		if (qxMeasureInFlight || isQxSlotClaimActive()) return
		const retryMs = Math.min(QX_SLOT_DISPATCH_RETRY_MS, 8 * 1000)
		schedulePlanNext(retryMs)
		scheduleQxBleNativeAlarm()
		return
	}
	const slotAt = skipQxOverdueSlotToCurrentAligned(reason)
	if (slotAt > 0 && now >= slotAt - 500) {
		if (qxMeasureInFlight) return
		scheduleQxBleNativeAlarm()
		runQxBleScheduleWakeTick(`跳过逾期-${reason || 'retry'}`).catch((e) => {
			console.log('[qxBle] skip-overdue wake', e)
		})
		return
	}
	if (slotAt > 0) {
		persistNextFireAt(slotAt)
		const delay = Math.max(QX_SLOT_DISPATCH_RETRY_MS, slotAt - now)
		schedulePlanNext(delay)
	} else {
		scheduleDeferredPlanNext(reason || 'retry')
	}
	scheduleQxBleNativeAlarm()
}

/**
 * 熄屏/后台：前台服务 + 原生闹钟 + WakeLock，维持定时与 BLE 传输
 * @param {string} reason 日志原因
 */
export function ensureQxBleBackgroundRuntime(reason = '') {
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().platform !== 'android') return Promise.resolve(true)
	if (!isSwitchOn()) return Promise.resolve(false)
	acquireQxBleWakeLock()
	ensureQxBleKeepAliveForBackground()
	if (reason) {}
	return Promise.resolve(hasQxBleWatchDeviceId())
	// #endif
	return Promise.resolve(true)
}

/** 将原生闹钟对准下一槽位（休眠/Doze 主路径） */
export function scheduleQxBleNativeAlarm() {
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().platform !== 'android') return
	if (!isSwitchOn()) return
	try {
		const nextAt = readNextFireAt()
		keepAliveManager.setAlarmForQxNextSlot(nextAt)
	} catch (e) {
		console.log('[qxBle] scheduleQxBleNativeAlarm', e)
	}
	// #endif
}

/** 控制台 + jakoblife调试日志.txt 双写 */
function qxScheduleLog(...parts) {
	const msg = parts.map((a) => {
		if (a === null) return 'null'
		if (typeof a === 'undefined') return 'undefined'
		if (typeof a === 'object') {
			try {
				return JSON.stringify(a)
			} catch (e) {
				return '[Object]'
			}
		}
		return String(a)
	}).join(' | ')
	console.log('[qxBle]', msg)
}

function formatSlotTime(ts) {
	if (!ts || !Number.isFinite(ts)) return '-'
	const local = getLocalTimeAllJSON(new Date(ts))
	return `${local.YMDHMS}`
}

const SCHEDULE_LOG_LABEL = {
	wugan: '无感',
	emotion: '情绪'
}

/** 心跳/快照：无感+情绪时段文案（仅日志） */
function formatActiveSchedulesForLog() {
	const schedules = listActiveSchedules()
	if (!schedules.length) {
		const {
			t1,
			t2
		} = readScheduleTimes()
		return `时段${t1}-${t2}/${readIntervalMinute()}分`
	}
	return schedules.map((s) => {
		const name = SCHEDULE_LOG_LABEL[s.id] || s.id
		return `${name}${s.t1}-${s.t2}/${s.intervalMin}分`
	}).join(' | ')
}

/**
 * 下一共同槽点：两套及以上活跃时段在同一时刻都有槽位的最近时间（仅日志）。
 * 少于两套时返回 null。
 */
function getNextCommonSlotDate(now = new Date(), earliest = null) {
	const schedules = listActiveSchedules()
	if (schedules.length < 2) return null
	let cursorEarliest = earliest
	for (let n = 0; n < 300; n++) {
		const union = getNextUnionAlignedSlotDate(now, cursorEarliest)
		if (!union) return null
		const ts = union.getTime()
		const isCommon = schedules.every((s) => {
			const slot = getNextAlignedSlotDate(now, s.t1, s.t2, s.intervalMin, new Date(ts))
			return slot && slot.getTime() === ts
		})
		if (isCommon) return union
		cursorEarliest = new Date(ts + 1)
	}
	return null
}

/** 心跳：各套下一槽位 + 共同槽点 + 并集下一槽（仅日志，重叠并集只触发一次） */
function formatNextSlotsForLog(nextUnionAt, now = new Date()) {
	const schedules = listActiveSchedules()
	const parts = schedules.map((s) => {
		const name = SCHEDULE_LOG_LABEL[s.id] || s.id
		const slot = getNextAlignedSlotDate(now, s.t1, s.t2, s.intervalMin, null)
		return `${name}下一槽${slot ? formatSlotTime(slot.getTime()) : '-'}`
	})
	const common = getNextCommonSlotDate(now, null)
	parts.push(`共同槽点${common ? formatSlotTime(common.getTime()) : '-'}`)
	parts.push(`并集下一槽${formatSlotTime(nextUnionAt)}`)
	return parts.join(' | ')
}

function getScheduleSnapshot() {
	const schedules = listActiveSchedules()
	const {
		t1,
		t2
	} = readScheduleTimes()
	return {
		开关: isSwitchOn(),
		开始: t1,
		结束: t2,
		间隔分钟: readIntervalMinute(),
		活跃时段数: schedules.length,
		时段: formatActiveSchedulesForLog(),
		时段内: isCurrentlyInScheduleWindow(),
		设备: readQxEmotionDeviceId() || '无',
		下一槽位: formatSlotTime(readNextFireAt())
	}
}

function getAppBaseUrl() {
	try {
		return getActiveAppBaseUrl(Vue)
	} catch (e) {
		const proto = Vue.prototype.$url_APP_IP
		if (proto && typeof proto === 'string') return proto
		return FALLBACK_BASE_URL
	}
}

/** 与 Reports_Alerts_new.parseQxDataRow 一致 */
function parseQxDataRow(dataStr) {
	if (!dataStr || typeof dataStr !== 'string') return null
	try {
		let objStr = dataStr.trim()
		if (!objStr.startsWith('{')) objStr = '{' + objStr
		if (!objStr.endsWith('}')) objStr = objStr + '}'
		const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
			v = v.trim()
			if (v === 'true' || v === 'false') return `"${k}":${v}`
			if (!isNaN(v) && v !== '' && !v.includes('/') && !v.includes(':')) return `"${k}":${v}`
			return `"${k}":"${v}"`
		})
		return JSON.parse(fixed)
	} catch (e) {
		console.error('[qxBle] parseQxDataRow', e)
		return null
	}
}

function normalizeTimePicker(t) {
	const parts = String(t).split(':')
	if (parts.length < 2) return null
	const h = parseInt(parts[0], 10)
	const m = parseInt(parts[1], 10)
	if (Number.isNaN(h) || Number.isNaN(m)) return null
	const hh = String(Math.min(23, Math.max(0, h))).padStart(2, '0')
	const mm = String(Math.min(59, Math.max(0, m))).padStart(2, '0')
	return `${hh}:${mm}`
}

function needsQxStorageRefresh() {
	const t1 = uni.getStorageSync('starttime')
	const t2 = uni.getStorageSync('endtime')
	const ix = uni.getStorageSync('Interval_time')
	if (t1 === '' || t1 === undefined || t1 === null) return true
	if (t2 === '' || t2 === undefined || t2 === null) return true
	if (ix === '' || ix === undefined || ix === null) return true
	return false
}

/**
 * 请求 QX_DATA 并写回无感 / 情绪两套 starttime / endtime / Interval / switch
 * @returns {Promise<boolean>} 是否成功写入
 */
export async function fetchQxDataAndApplyStorage() {
	const token = uni.getStorageSync('token')
	if (!token) return false
	const base = getAppBaseUrl()
	const res = await getRequest(base + '/prod-api/device/data/list', {
		dataType: 'QX_DATA'
	}, {
		Authorization: 'Bearer ' + token,
		'content-type': 'application/json'
	})
	if (res.code !== 200 || !res.rows || !res.rows.length || !res.rows[0].data) {
		if (!needsQxStorageRefresh()) {
			return true
		}
		return false
	}
	const row = parseQxDataRow(res.rows[0].data)
	if (!row) return false
	if (row.starttime != null && row.starttime !== '') {
		const t = normalizeTimePicker(String(row.starttime))
		if (t) uni.setStorageSync('starttime', t)
	}
	if (row.endtime != null && row.endtime !== '') {
		const t = normalizeTimePicker(String(row.endtime))
		if (t) uni.setStorageSync('endtime', t)
	}
	if (row.intervalMinute != null && row.intervalMinute !== '') {
		const n = Number(row.intervalMinute)
		let ix = INTERVAL_MINUTES.indexOf(n)
		if (ix < 0) ix = 0
		uni.setStorageSync('Interval_time', ix)
	}
	if (row.SWITCH_QX !== undefined) {
		const on = row.SWITCH_QX === true || row.SWITCH_QX === 'true'
		uni.setStorageSync('switchHER', on)
	}
	if (row.starttimeEmotion != null && row.starttimeEmotion !== '') {
		const t = normalizeTimePicker(String(row.starttimeEmotion))
		if (t) uni.setStorageSync('starttimeEmotion', t)
	}
	if (row.endtimeEmotion != null && row.endtimeEmotion !== '') {
		const t = normalizeTimePicker(String(row.endtimeEmotion))
		if (t) uni.setStorageSync('endtimeEmotion', t)
	}
	if (row.intervalMinuteEmotion != null && row.intervalMinuteEmotion !== '') {
		const n = Number(row.intervalMinuteEmotion)
		let ix = INTERVAL_MINUTES.indexOf(n)
		if (ix < 0) ix = 0
		uni.setStorageSync('Interval_time_emotion', ix)
	}
	if (row.SWITCH_QX_EMOTION !== undefined) {
		const on = row.SWITCH_QX_EMOTION === true || row.SWITCH_QX_EMOTION === 'true'
		uni.setStorageSync('switchEmotion', on)
	}
	return true
}

export async function maybeRefreshQxFromServer() {
	const token = uni.getStorageSync('token')
	if (!token) return
	const now = Date.now()
	const missing = needsQxStorageRefresh()
	const gap = missing ? QX_REMOTE_REFRESH_MISSING_MS : QX_REMOTE_REFRESH_MIN_MS
	if (now - lastQxRemoteFetchAt < gap) return
	lastQxRemoteFetchAt = now
	try {
		await fetchQxDataAndApplyStorage()
	} catch (e) {
		console.log('[qxBle] QX_DATA 拉取失败', e)
	}
}

function hexToArrayBuffer(hex) {
	const buffer = new ArrayBuffer(hex.length / 2)
	const dataView = new DataView(buffer)
	for (let i = 0; i < hex.length; i += 2) {
		dataView.setUint8(i / 2, parseInt(hex.substr(i, 2), 16))
	}
	return buffer
}

/**
 * 定时调度侧 BPW1 写入：对齐可用 Main.vue
 * 固定服务/特征值 + writeNoResponse 直写（不做 writeType 回退风暴）
 */
function resolveBpw1ScheduleWriteTargets(deviceId, serviceId, characteristicId) {
	const storedWrite = uni.getStorageSync('writeuuid')
	const storedSvc = uni.getStorageSync('serviceIdwatch')
	const storedDev = uni.getStorageSync('deviceIdwatch')
	return {
		deviceId: storedDev || deviceId,
		serviceId: storedSvc || serviceId || DEFAULT_SERVICE_ID,
		characteristicId: storedWrite || characteristicId || DEFAULT_CHAR_ID
	}
}

function writeBpw1ScheduleCommand(deviceId, serviceId, characteristicId, hexCommand) {
	const targets = resolveBpw1ScheduleWriteTargets(deviceId, serviceId, characteristicId)
	return new Promise((resolve, reject) => {
		uni.writeBLECharacteristicValue({
			deviceId: targets.deviceId,
			serviceId: targets.serviceId,
			characteristicId: targets.characteristicId,
			writeType: 'writeNoResponse',
			value: hexToArrayBuffer(hexCommand),
			success() {
				resolve(true)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

/** 构建手表时间同步 BLE 帧（与 Main.vue 一致：CMD 0x02 / key 0x08） */
function buildQxBleTimeSyncHex() {
	const local = getLocalTimeAllJSON()
	const [year, month, day] = local.YMD.split('-').map(Number)
	const [hour, minutes, seconds] = (local.YMDHMS.split(' ')[1] || '00:00:00').split(':').map(Number)
	const bytes1 = new Uint8Array(4)
	bytes1[0] = (((year - 2000) << 2) + ((month & 0xFF) >> 2)) & 0xFF
	bytes1[1] = (((month & 0x03) << 6) + (day << 1) + (hour >> 4)) & 0xFF
	bytes1[2] = (((hour & 0x0F) << 4) + (minutes >> 2)) & 0xFF
	bytes1[3] = (((minutes & 0x03) << 6) + seconds) & 0xFF
	const dataLen = bytes1.length
	const command = new Uint8Array(dataLen + 8)
	command[0] = 0xe0
	command[1] = ((5 + dataLen) >> 8) & 0xFF
	command[2] = (5 + dataLen) & 0xFF
	command[3] = 0x02
	command[4] = 0x01
	command[5] = 0x08
	command[6] = (dataLen >> 8) & 0xFF
	command[7] = dataLen & 0xFF
	command.set(bytes1, 8)
	let sum = 0
	for (let i = 0; i < command.length; i++) {
		sum += command[i]
	}
	sum = sum % 256
	const modifiedCommand = new Uint8Array(command.length + 1)
	modifiedCommand.set(command.subarray(0, 3), 0)
	modifiedCommand[3] = sum
	modifiedCommand.set(command.subarray(3), 4)
	return Array.from(modifiedCommand).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** 当前是否为后台时间同步允许的夜间时段（21:00–06:00） */
function isQxBleTimeSyncNightHour() {
	const timePart = getLocalTimeAllJSON().YMDHMS.split(' ')[1] || '00:00:00'
	const hour = parseInt(timePart.split(':')[0], 10)
	return hour >= QX_BLE_TIME_SYNC_NIGHT_START_HOUR || hour <= QX_BLE_TIME_SYNC_NIGHT_END_HOUR
}

/** 是否允许挂着后台实时通信定时器（开关开、测量时段内、后台、非采集中） */
function canRunQxBleTimeSyncTimer() {
	if (!isSwitchOn()) return false
	if (!isCurrentlyInScheduleWindow()) return false
	if (!readQxEmotionDeviceId()) return false
	if (qxAppInForeground) return false
	if (isQxMeasureSessionActive()) return false
	return true
}

/** 当前 tick 是否应真正下发（在 canRun 基础上再加 21:00–06:00） */
function canEnableQxBleTimeSyncLoop() {
	return canRunQxBleTimeSyncTimer() && isQxBleTimeSyncNightHour()
}

function shouldSkipQxBleTimeSyncTick() {
	if (!canEnableQxBleTimeSyncLoop()) return true
	if (qxMeasureInFlight) return true
	return false
}

/** BPW1：时间同步；BPW6：读电量作实时通信保活（与 BPW1 同一定时节奏） */
function sendQxBleTimeSyncOnce() {
	if (shouldSkipQxBleTimeSyncTick()) {
		return Promise.resolve(false)
	}
	if (isQxBpw6EmotionMode()) {
		const deviceId = uni.getStorageSync('BPW6devicemac') || readQxEmotionDeviceId()
		if (!deviceId) {
			return Promise.resolve(false)
		}
		return Promise.resolve()
			.then(() => u16proBLE.readBattery(deviceId))
			.then(() => {
				console.log('[qxBle] BPW6实时通信(读电量)成功')
				return true
			})
			.catch((err) => {
				console.log('[qxBle] BPW6实时通信(读电量)失败', err)
				return false
			})
	}
	const deviceId = uni.getStorageSync('deviceIdwatch')
	if (!deviceId) {
		return Promise.resolve(false)
	}
	const hex = buildQxBleTimeSyncHex()
	return writeBpw1ScheduleCommand(deviceId, DEFAULT_SERVICE_ID, DEFAULT_CHAR_ID, hex)
		.then(() => {
			console.log('[qxBle] 时间同步成功')
			return true
		})
		.catch((err) => {
			console.log('[qxBle] 时间同步失败', err)
			return false
		})
}

function tickQxBleTimeSync() {
	if (!canRunQxBleTimeSyncTimer()) {
		stopQxBleTimeSyncLoop()
		return
	}
	if (!isQxBleTimeSyncNightHour()) {
		return
	}
	if (shouldSkipQxBleTimeSyncTick()) {
		return
	}
	sendQxBleTimeSyncOnce()
}

function stopQxBleTimeSyncLoop() {
	if (qxBleTimeSyncTimer != null) {
		clearInterval(qxBleTimeSyncTimer)
		qxBleTimeSyncTimer = null
	}
}

/** 定时测量下发前暂停周期时间同步 */
function pauseQxBleTimeSyncForMeasure() {
	stopQxBleTimeSyncLoop()
}

/** 定时测量结束后恢复周期时间同步（仅后台且 21:00–06:00） */
function resumeQxBleTimeSyncAfterMeasure() {
	startQxBleTimeSyncLoop()
}

function startQxBleTimeSyncLoop() {
	stopQxBleTimeSyncLoop()
	if (!canRunQxBleTimeSyncTimer()) {
		return
	}
	qxBleTimeSyncTimer = setInterval(tickQxBleTimeSync, QX_BLE_TIME_SYNC_INTERVAL_MS)
}

function parseHM(timeStr) {
	if (!timeStr || typeof timeStr !== 'string') return NaN
	const parts = timeStr.split(':')
	if (parts.length < 2) return NaN
	const h = parseInt(parts[0], 10)
	const m = parseInt(parts[1], 10)
	if (Number.isNaN(h) || Number.isNaN(m)) return NaN
	if (h < 0 || h > 23 || m < 0 || m > 59) return NaN
	return h * 60 + m
}

function windowSpanMin(s, e) {
	if (e > s) return e - s
	if (e < s) return DAY_MIN - s + e
	return 0
}

function scheduleWindowOk(s, e) {
	if (Number.isNaN(s) || Number.isNaN(e) || s === e) return false
	const span = windowSpanMin(s, e)
	return span > 0 && span <= DAY_MIN
}

function readStorageFlagOn(key) {
	const v = uni.getStorageSync(key)
	return v === true || v === 'true' || v === 1 || v === '1'
}

/** 任一套定时开关打开（无感或情绪） */
function isSwitchOn() {
	return SCHEDULE_PROFILES.some((p) => readStorageFlagOn(p.switchKey))
}

function isWithinWindowMinute(nowM, s, e) {
	if (Number.isNaN(nowM) || Number.isNaN(s) || Number.isNaN(e) || s === e) return false
	if (e > s) return nowM >= s && nowM <= e
	if (e < s) return nowM >= s || nowM <= e
	return false
}

function readProfileIntervalMinute(intervalKey) {
	const ix = parseInt(uni.getStorageSync(intervalKey), 10)
	const idx = Number.isNaN(ix) ? 0 : ix
	return INTERVAL_MINUTES[idx] ?? 10
}

/**
 * 已开启且时段合法的调度配置列表（用于槽位并集）
 * @returns {{id:string,t1:string,t2:string,intervalMin:number,s:number,e:number}[]}
 */
function listActiveSchedules() {
	const list = []
	for (let i = 0; i < SCHEDULE_PROFILES.length; i++) {
		const p = SCHEDULE_PROFILES[i]
		if (!readStorageFlagOn(p.switchKey)) continue
		const t1 = uni.getStorageSync(p.startKey) || p.defaultStart
		const t2 = uni.getStorageSync(p.endKey) || p.defaultEnd
		const intervalMin = readProfileIntervalMinute(p.intervalKey)
		const s = parseHM(t1)
		const e = parseHM(t2)
		if (!scheduleWindowOk(s, e) || intervalMin <= 0) continue
		list.push({
			id: p.id,
			t1,
			t2,
			intervalMin,
			s,
			e
		})
	}
	return list
}

/** 活跃配置中的最小间隔；无活跃时回退无感配置（兼容旧逻辑） */
function readIntervalMinute() {
	const schedules = listActiveSchedules()
	if (schedules.length) {
		let min = schedules[0].intervalMin
		for (let i = 1; i < schedules.length; i++) {
			if (schedules[i].intervalMin < min) min = schedules[i].intervalMin
		}
		return min
	}
	return readProfileIntervalMinute('Interval_time')
}

function delayMs(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 展示/兼容：优先无感时段，否则取第一套活跃时段 */
function readScheduleTimes() {
	if (readStorageFlagOn('switchHER') || !readStorageFlagOn('switchEmotion')) {
		return {
			t1: uni.getStorageSync('starttime') || '08:00',
			t2: uni.getStorageSync('endtime') || '18:00'
		}
	}
	return {
		t1: uni.getStorageSync('starttimeEmotion') || '08:00',
		t2: uni.getStorageSync('endtimeEmotion') || '18:00'
	}
}

/**
 * 相对开始时刻，到下一个时钟对齐刻度（0 / I / 2I… 分）所需的分钟偏移。
 * 例：8:34、I=30 → 26（对齐到 9:00）；8:00、I=30 → 0。
 */
function clockAlignOffsetMin(startMin, intervalMin) {
	const rem = startMin % intervalMin
	return rem === 0 ? 0 : intervalMin - rem
}

/**
 * 下一个对齐槽位的 Date：按间隔 I 对齐到时钟刻度（如整点/半点），且落在 [start,end] 内。
 * @param {Date} [earliest] 槽位时刻须 >= earliest（上次发送后取下一格）
 */
function getNextAlignedSlotDate(now, t1, t2, intervalMin, earliest = null) {
	const s = parseHM(t1)
	const e = parseHM(t2)
	const I = intervalMin
	if (!scheduleWindowOk(s, e) || I <= 0) return null
	const tol = 800
	const nowTs = earliest instanceof Date ? earliest.getTime() : now.getTime() - tol
	const {
		year,
		month,
		day
	} = parseLocalYMDFromDate(now)
	const alignOff = clockAlignOffsetMin(s, I)

	if (e > s) {
		const firstM = s + alignOff
		for (let dAdd = 0; dAdd < 3; dAdd++) {
			const dParts = dAdd === 0 ? {
				year,
				month,
				day
			} : addLocalDays(year, month, day, dAdd)
			for (let m = firstM; m <= e; m += I) {
				const candTs = buildLocalTimestampMs(dParts.year, dParts.month, dParts.day, m, now)
				if (candTs >= nowTs) return new Date(candTs)
			}
		}
		return null
	}

	const span = windowSpanMin(s, e)
	for (let dAdd = -1; dAdd <= 3; dAdd++) {
		const dParts = dAdd === 0 ? {
			year,
			month,
			day
		} : addLocalDays(year, month, day, dAdd)
		const startTs = buildLocalTimestampMs(dParts.year, dParts.month, dParts.day, s, now)
		for (let off = alignOff; off <= span; off += I) {
			const candTs = startTs + off * 60000
			if (candTs >= nowTs) return new Date(candTs)
		}
	}
	return null
}

/**
 * 多套时段槽位并集中的下一个时刻；同一时间点只出现一次（重叠只下发一次 PPG）。
 */
function getNextUnionAlignedSlotDate(now, earliest = null) {
	const schedules = listActiveSchedules()
	if (!schedules.length) return null
	let best = null
	for (let i = 0; i < schedules.length; i++) {
		const sch = schedules[i]
		const slot = getNextAlignedSlotDate(now, sch.t1, sch.t2, sch.intervalMin, earliest)
		if (!slot) continue
		const ts = slot.getTime()
		if (best == null || ts < best.getTime()) best = slot
	}
	return best
}

/** 计算并持久化下一个对齐槽位时间戳；无槽位返回 0 */
function syncNextAlignedFireAt(earliest = null) {
	const now = Date.now()
	const existing = readNextFireAt()
	if (existing > 0 && now >= existing - 500 && now <= existing + QX_SLOT_DUE_GRACE_MS &&
		!isQxSlotOverdueAbandoned(existing, now) && !isQxSlotSupersededByNextInterval(existing) &&
		!isQxMeasureSessionActive()) {
		persistNextFireAt(existing)
		return existing
	}
	const slot = getNextUnionAlignedSlotDate(new Date(), earliest)
	if (!slot) {
		clearNextFireAt()
		return 0
	}
	persistNextFireAt(slot.getTime())
	return slot.getTime()
}

function persistNextFireAt(ts) {
	uni.setStorageSync(QX_BLE_NEXT_FIRE_AT_KEY, ts)
}

function readNextFireAt() {
	const n = Number(uni.getStorageSync(QX_BLE_NEXT_FIRE_AT_KEY))
	return Number.isFinite(n) && n > 0 ? n : 0
}

function readIntervalMs() {
	return readIntervalMinute() * 60 * 1000
}

/** 是否已到「下一间隔」测量时刻（旧槽应放弃、不再同槽补发；按并集下一槽点） */
function isQxSlotSupersededByNextInterval(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	const next = getNextUnionAlignedSlotDate(new Date(), new Date(slotAt + 1))
	if (next) {
		return Date.now() >= next.getTime() - 500
	}
	return Date.now() >= slotAt + readIntervalMs() - 500
}

/** 供保活通知等模块判断是否在采集中（与 isQxMeasureSessionActive 一致） */
export function isQxBleMeasureSessionActive() {
	return isQxMeasureSessionActive()
}

/**
 * 调度侧是否仍有「进程内」采集运行时（inFlight / 槽位抢占）。
 * 不含 storage 残留的 sleep_alertdisabled/sendwatch，供 Main 判断杀进程后的死会话。
 */
export function hasQxBleLiveMeasureRuntime() {
	return !!(qxMeasureInFlight || isQxSlotClaimActive())
}

/**
 * 定时采集会话进行中（inFlight / sendwatch / 调度标记 / 真实拉数）。
 * 勿把单独的 sleep_alertdisabled 当测量中（按钮灰态残留会假「测量进行中」）。
 */
function isQxMeasureSessionActive() {
	if (qxMeasureInFlight) return true
	if (isQxSlotClaimActive()) return true
	if (u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead()) return true
	if (isQxPpgXferBusy() && !isQxPpgXferOrphaned()) {
		// 仅有有效拉数/上传标记才算；孤儿 xfer 不算
		return true
	}
	const sendwatch = uni.getStorageSync('sendwatch')
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const hasSched = isQxScheduledMeasureStorageOn()
	if (hasSend || hasSched) {
		if (readMeasureSlotAt() > 0 || hasSched) return true
	}
	return false
}

/**
 * 若已过下一测量时刻：跳过旧槽，按当前对齐时间重算下一槽位
 * @returns {number} 应使用的槽位时间戳
 */
function skipQxOverdueSlotToCurrentAligned(reason = '') {
	const now = Date.now()
	skipQxSlotIfOverdueBeyondAbandon(reason, now)
	const oldAt = readNextFireAt()
	if (!isQxSlotSupersededByNextInterval(oldAt)) {
		return oldAt
	}
	return resolveQxDueSlotForDispatch(now)
}

function clearNextFireAt() {
	uni.removeStorageSync(QX_BLE_NEXT_FIRE_AT_KEY)
}

function persistMeasureSlotAt(ts) {
	if (Number.isFinite(ts) && ts > 0) {
		uni.setStorageSync(QX_BLE_MEASURE_SLOT_AT_KEY, ts)
	}
}

function readMeasureSlotAt() {
	const n = Number(uni.getStorageSync(QX_BLE_MEASURE_SLOT_AT_KEY))
	return Number.isFinite(n) && n > 0 ? n : 0
}

function clearMeasureSlotAt() {
	uni.removeStorageSync(QX_BLE_MEASURE_SLOT_AT_KEY)
}

/** 同槽是否已占用（含采集标记，防 18:45:00 与 18:45:05 双发） */
function isSameQxSlotAlreadyClaimed(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	const claimed = readMeasureSlotAt()
	if (claimed !== slotAt) return false
	if (!isQxScheduleMeasureBusy()) {
		if (claimed === slotAt) {
			clearMeasureSlotAt()
		}
		return false
	}
	return true
}

/** 同步抢占槽位；失败表示本轮已由其它唤醒路径占用 */
function tryBeginQxSlotExecute(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	if (isSameQxSlotAlreadyClaimed(slotAt)) return false
	if (qxSlotExecuteLockAt === slotAt) return false
	qxSlotExecuteLockAt = slotAt
	qxSlotClaimedAt = Date.now()
	persistMeasureSlotAt(slotAt)
	qxMeasureInFlight = true
	return true
}

function releaseQxSlotExecuteLock() {
	qxSlotExecuteLockAt = 0
}

/** 新槽到点可抢占：槽位晚于进行中槽，或已进入下一测量间隔 */
function shouldPreemptMeasureForSlot(dueSlotAt) {
	if (!isQxScheduleMeasureBusy()) return false
	// 同机型手动立即测量：定时绝不可抢占
	const schedKind = isQxBpw6EmotionMode() ? 'bpw6' : 'bpw1'
	if (isQxEmotionImmediateBusy(schedKind)) return false
	// 真实拉数/上传中：勿抢占（超时由 xfer orphan 处理）
	if (isQxPpgXferBusy() && !isQxPpgXferOrphaned()) {
		return false
	}
	const measureSlot = readMeasureSlotAt()
	// 无槽位却仍 busy（残留 sendwatch/UI）：新槽到点必须抢占，否则永久不下发
	if (measureSlot <= 0) {
		return dueSlotAt > 0 && Date.now() >= dueSlotAt - 500
	}
	if (Date.now() >= measureSlot + readIntervalMs() - 500) return true
	return dueSlotAt > measureSlot + 500
}

/** 保活闹钟间隔（秒）：情绪定时固定 15 秒唤醒，检查是否到对齐槽位 */
export function getQxBleKeepAliveAlarmIntervalSec() {
	if (!isSwitchOn()) return null
	return QX_BLE_SLOT_ALARM_POLL_SEC
}

function runOneQxMeasurement(deviceId, serviceId, characteristicId, useBpw6 = null) {
	const bpw6Mac = uni.getStorageSync('BPW6devicemac') || ''
	const bpw1Mac = uni.getStorageSync('deviceIdwatch') || ''
	const isBpw6Dev = !!(bpw6Mac && deviceId && isSameQxBleDeviceId(deviceId, bpw6Mac))
	const isBpw1Dev = !!(bpw1Mac && deviceId && isSameQxBleDeviceId(deviceId, bpw1Mac))
	// 以目标 MAC 为准：BPW6 设备必须走 PPG，BPW1 必须走 BPW1 命令（互不交叉）
	// 注意：useBpw6===false 时旧逻辑会强制 BPW1，导致绑 BPW6 也走 BPW1、无「调度直发BPW6 PPG」日志
	let bpw6 = false
	if (isBpw6Dev) {
		bpw6 = true
	} else if (isBpw1Dev) {
		bpw6 = false
	} else {
		bpw6 = useBpw6 === true || (useBpw6 !== false && isQxBpw6EmotionMode())
	}
	console.log('[qxBle] //定时测量-机型路径', bpw6 ? 'BPW6-PPG' : 'BPW1-CMD', deviceId || '-',
		'useBpw6=', useBpw6, 'emotionBpw6=', isQxBpw6EmotionMode())
	if (bpw6) {
		return runOneBpw6QxMeasurement(deviceId)
	}
	return runOneBpw1QxMeasurement(deviceId, serviceId, characteristicId)
}

/**
 * 黑屏/后台：对齐 BPW1「延迟→探测→再延迟→下发」节奏。
 * BPW1 用 e0000609 探测帧；BPW6 用 readBattery 作实时通信探测。
 * 探测失败不阻断 PPG；带超时避免 write 挂起导致整槽失败。
 */
async function probeBpw6LinkBeforeMeasure(deviceId) {
	try {
		await Promise.race([
			Promise.resolve(u16proBLE.readBattery(deviceId)),
			delayMs(2500)
		])
		console.log('[qxBle] 定时测量-BPW6探测(读电量)完成', deviceId)
	} catch (err) {
		console.log('[qxBle] 定时测量-BPW6探测(读电量)失败，继续下发PPG', err)
	}
}

/** Main 定时 BPW6 PPG 启动事件（与立即测量同 Core；仅前台路径） */
export const QX_BPW6_SCHEDULED_PPG_START_EVENT = 'QX_BPW6_SCHEDULED_PPG_START'
/** 调度直发后完成帧中继 → Main 静默拉数上传 */
export const QX_BPW6_SCHEDULED_PPG_COMPLETE_EVENT = 'QX_BPW6_SCHEDULED_PPG_COMPLETE'
/** 调度侧已挂完成 watch，Main 勿再重复挂（同 pending key） */
const QX_BPW6_SCHEDULE_COMPLETE_RELAY_KEY = 'qx_bpw6_schedule_complete_relay'

let qxBpw6ScheduleCompleteWatchArmed = false

function clearBpw6ScheduleCompleteRelayFlag() {
	qxBpw6ScheduleCompleteWatchArmed = false
	try {
		uni.removeStorageSync(QX_BPW6_SCHEDULE_COMPLETE_RELAY_KEY)
	} catch (e) {}
}

/** 调度直发后挂起完成帧，回前台/保活唤醒时由 Main 拉数上传 */
function armBpw6ScheduleCompleteRelay(deviceId) {
	if (!u16proBLE.watchPpgMeasurementComplete) return
	if (qxBpw6ScheduleCompleteWatchArmed) return
	qxBpw6ScheduleCompleteWatchArmed = true
	try {
		uni.setStorageSync(QX_BPW6_SCHEDULE_COMPLETE_RELAY_KEY, 1)
	} catch (e) {}
	const targetDeviceId = deviceId || readQxEmotionDeviceId()
	u16proBLE.watchPpgMeasurementComplete(5 * 60 * 1000).then((payload) => {
		clearBpw6ScheduleCompleteRelayFlag()
		try {
			uni.$emit(QX_BPW6_SCHEDULED_PPG_COMPLETE_EVENT, {
				deviceId: targetDeviceId,
				payload: payload || {
					success: true,
					completed: true,
					type: 'ppg_measurement_complete'
				}
			})
		} catch (eEmit) {
			console.log('[qxBle] 中继Main完成事件失败', eEmit)
		}
	}).catch((err) => {
		clearBpw6ScheduleCompleteRelayFlag()
		const msg = err && err.message ? err.message : String(err || '')
		if (msg.indexOf('已由0x4B完成') >= 0) {
			return
		}
		console.log('[qxBle] 调度等待PPG完成结束', msg)
	})
}

export function isQxBpw6ScheduleCompleteRelayActive() {
	if (qxBpw6ScheduleCompleteWatchArmed) return true
	try {
		const v = uni.getStorageSync(QX_BPW6_SCHEDULE_COMPLETE_RELAY_KEY)
		return v === 1 || v === '1'
	} catch (e) {
		return false
	}
}

/** 请求 Main 用与立即测量同一套 Core 启动 BPW6 PPG
 * @returns {Promise<true|false|'no-listener'>}
 */
function requestMainBpw6ScheduledPpgStart(deviceId, timeoutMs = 45000) {
	return new Promise((resolve) => {
		let settled = false
		let acked = false
		const finish = (result) => {
			if (settled) return
			settled = true
			clearTimeout(timer)
			clearTimeout(ackTimer)
			resolve(result)
		}
		const timer = setTimeout(() => {
			// 已 ack：Main 已接管，勿再直发（避免重复 PPG）；仅无 ack 才算无监听
			finish(acked ? true : 'no-listener')
		}, timeoutMs)
		// 后台 Main 常冻住/未挂监听：800ms 无 ack 立刻改走调度直发
		const ackTimer = setTimeout(() => {
			if (!acked && !settled) {
				finish('no-listener')
			}
		}, 800)
		try {
			uni.$emit(QX_BPW6_SCHEDULED_PPG_START_EVENT, {
				deviceId,
				ack: () => {
					acked = true
				},
				reply: (ok) => {
					acked = true
					finish(!!ok)
				}
			})
		} catch (e) {
			finish('no-listener')
		}
	})
}

/** 调度侧直发 PPG：与 Main 立即测量/血压后同一 startPPGMeasurementWithDuration 协议 */
async function startBpw6PpgDirectFromSchedule(deviceId) {
	const targetDeviceId = deviceId
	await ensureQxBleBackgroundRuntime('BPW6调度直发前')
	armBpw6ScheduleCompleteRelay(targetDeviceId)
	try {
		uni.$emit('EMOTION_MEASURE_BUSY', true)
	} catch (eBusy) {}
	try {
		await Promise.race([
			Promise.resolve(u16proBLE.ensureBcServiceReady(targetDeviceId, {
				force: false
			})).catch((err) => {
				console.log('[qxBle] BPW6调度直发通道准备失败，继续下发', err)
			}),
			delayMs(2500)
		])
	} catch (err) {
		console.log('[qxBle] BPW6调度直发通道准备异常，继续下发', err)
	}
	try {
		if (typeof u16proBLE.ensurePpgPreferForDevice === 'function') {
			u16proBLE.ensurePpgPreferForDevice(targetDeviceId)
		}
	} catch (ePref) {}
	const profile = (typeof u16proBLE.getPpgDeviceProfile === 'function') ?
		(u16proBLE.getPpgDeviceProfile(targetDeviceId) || '') : ''
	// 与 Main 血压后/定时静默启动相同参数（immediateMode=false, forceNotify=false）
	const skip49 = profile === 'standard' || profile === 'compat' || !!u16proBLE._ppgPrefer4AStart
	let result = null
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			result = await Promise.race([
				u16proBLE.startPPGMeasurementWithDuration(60, targetDeviceId, true, {
					forceNotify: false,
					skip49: skip49 || attempt > 1,
					immediateMode: false
				}),
				delayMs(12000).then(() => null)
			])
			if (result && result.success) {
				console.log('[qxBle] //定时测量-BLE命令已下发', targetDeviceId, '成功')
				return result
			}
			console.log('[qxBle] //定时测量-BLE命令已下发', targetDeviceId, '失败', attempt)
		} catch (err) {
			console.log('[qxBle] //定时测量-PPG启动异常', attempt, err)
			result = null
		}
		if (attempt < 3) {
			await delayMs(800 * attempt)
		}
	}
	clearBpw6ScheduleCompleteRelayFlag()
	try {
		if (typeof u16proBLE.cancelPpgMeasurementCompleteWatch === 'function') {
			u16proBLE.cancelPpgMeasurementCompleteWatch()
		}
	} catch (eCancel) {}
	throw new Error('BPW6 PPG启动失败')
}

/**
 * BPW6 定时测量：
 * - 后台：调度直发（与立即测量同命令）
 * - 前台：优先 Main；无响应再直发
 * 不改立即测量 / 血压后 PPG
 */
async function runOneBpw6QxMeasurement(deviceId) {
	const targetDeviceId = deviceId || readQxEmotionDeviceId()
	if (!targetDeviceId) {
		throw new Error('无BPW6设备')
	}

	const markSessionBusyEarly = (emitBusy) => {
		uni.setStorageSync('sendwatch', 1)
		markQxScheduledMeasureStorage('bpw6')
		try {
			uni.setStorageSync('sleep_alertdisabled', true)
		} catch (e) {}
		if (emitBusy) {
			try {
				uni.$emit('EMOTION_MEASURE_BUSY', true)
			} catch (e2) {}
		}
		if (!qxMeasureSessionStartedAt) {
			qxMeasureSessionStartedAt = Date.now()
		}
	}
	const finishStarted = (tag) => {
		markSessionBusyEarly(true)
		qxMeasureSessionStartedAt = Date.now()
		refreshKeepAliveNotificationIfNeeded()
		markQxPpgXferBusy()
		ensureQxPpgXferBackgroundRuntime(tag)
	}
	markSessionBusyEarly(false)
	console.log('[qxBle] //定时测量-BPW6开始下发', targetDeviceId, qxAppInForeground ? '前台' : '后台')
	await ensureQxBleBackgroundRuntime('BPW6定时下发前')
	// 后台：直发（与立即测量同 startPPG）；前台可先走 Main
	if (!qxAppInForeground) {
		await delayMs(200)
		await probeBpw6LinkBeforeMeasure(targetDeviceId)
		await delayMs(100)
		await startBpw6PpgDirectFromSchedule(targetDeviceId)
		finishStarted('BPW6后台直发成功-等待测完')
		return
	}

	const mainResult = await requestMainBpw6ScheduledPpgStart(targetDeviceId)
	if (mainResult === true) {
		finishStarted('BPW6定时启动成功-等待测完')
		return
	}
	await startBpw6PpgDirectFromSchedule(targetDeviceId)
	finishStarted('BPW6定时直发成功-等待测完')
}

function runOneBpw1QxMeasurement(deviceId, serviceId, characteristicId) {
	console.log('[qxBle] //定时测量-BPW1开始下发', deviceId)
	return new Promise((resolve, reject) => {
		// 对齐 Main：延迟→探测→再延迟→测量；写入走兼容 write（不改 Main）
		setTimeout(() => {
			writeBpw1ScheduleCommand(deviceId, serviceId, characteristicId, 'e0000609200101000100')
				.then(() => {
					setTimeout(() => {
						const otaBP = uni.getStorageSync('otaBP')
						let ppgHex = 'e00006F3060104000101'
						if (OTA_DATA_RES_WATCH_CMD_IDS.has(otaBP)) {
							ppgHex = 'e0000611030125000101'
						}
						writeBpw1ScheduleCommand(deviceId, serviceId, characteristicId,
								ppgHex)
							.then(() => {
								uni.setStorageSync('sendwatch', 1)
								markQxScheduledMeasureStorage('bpw1')
								qxMeasureSessionStartedAt = Date.now()
								// 与 BPW6 一致：标记传数忙，心跳勿扫蓝牙/重活，避免后台收 PPG 变慢
								markQxPpgXferBusy()
								ensureQxPpgXferBackgroundRuntime('BPW1定时下发成功-等待传数')
								uni.removeStorageSync('otaBP')
								refreshKeepAliveNotificationIfNeeded()
								resolve()
							})
							.catch((err) => {
								uni.removeStorageSync('otaBP')
								clearQxScheduledMeasureIfDevice('bpw1')
								reject(err)
							})
					}, 3000)
				})
				.catch((err) => {
					clearQxScheduledMeasureIfDevice('bpw1')
					reject(err)
				})
		}, 3000)
	})
}

function clearTimer() {
	if (qxBleTimer != null) {
		clearTimeout(qxBleTimer)
		qxBleTimer = null
	}
}

function stopScheduleHeartbeat() {
	if (qxHeartbeatTimer != null) {
		clearInterval(qxHeartbeatTimer)
		qxHeartbeatTimer = null
	}
	stopQxBleTimeSyncLoop()
}

/** 测量时段内心跳（tag 可选，如「保活」表示熄屏下由原生闹钟触发） */
function tickScheduleHeartbeat(tag = '') {
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) {
		stopScheduleHeartbeat()
		return
	}
	const managedRead = !!(u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead())
	const xferBusy = isQxPpgXferBusy()
	const measureBusy = xferBusy || isQxMeasureSessionActive()
	// 托管分块拉数 / BPW1定时传数：极简心跳，勿打长日志/扫蓝牙（会拖慢到数分钟）
	if (managedRead || (measureBusy && !qxAppInForeground)) {
		ensureQxPpgXferBackgroundRuntime(managedRead ? '心跳传数保活' : '心跳BPW1测量保活')
		try {
			if (managedRead && typeof u16proBLE.pokePpgManagedReadKeepAlive === 'function') {
				u16proBLE.pokePpgManagedReadKeepAlive(undefined, {
					allowChunkResend: true
				})
			}
		} catch (ePoke) {}
		// 仍打一行轻量状态，方便对照；不做 getConnectedBluetoothDevices / 纠偏重活
		try {
			const now = Date.now()
			const nextAt = readNextFireAt()
			const remainSec = nextAt > 0 ? Math.max(0, Math.ceil((nextAt - now) / 1000)) : -1
			qxScheduleLog(
				'//定时测量-时段内心跳',
				tag ? `来源${tag}` : '',
				formatActiveSchedulesForLog(),
				formatNextSlotsForLog(nextAt, new Date(now)),
				`距并集槽位${remainSec}秒`,
				'测量进行中',
				qxAppInForeground ? '前台' : '后台',
				'BLE已连接(传数中免扫)'
			)
		} catch (eLog) {}
		return
	}
	const now = Date.now()
	let nextAt = readNextFireAt()
	// 无下一槽用 -1，避免当成 remainSec=0 误走「临近到点」分支
	const remainSecEarly = nextAt > 0 ? Math.max(0, Math.ceil((nextAt - now) / 1000)) : -1
	const buildBleConnectedForHeartbeatLog = () => {
		// 最近 GATT 仍活着：直接已连接（读电量/校时成功却报未连接的常见情况）
		const bpw6 = uni.getStorageSync('BPW6devicemac') || ''
		if (!qxAppInForeground && bpw6 && hasBpw6LiveLinkEvidence(bpw6) &&
			isAndroidBluetoothReallyOff() !== true) {
			restoreBpw6ConnectedFromLiveEvidence('心跳活链路')
			return true
		}
		const scheduleDev = readQxEmotionDeviceId()
		const bgBpw6 = resolveBpw6BgBleConnectedForLog(scheduleDev)
		if (bgBpw6 !== null) return bgBpw6
		return !!scheduleDev && (!!qxBleWatchConnected || readQxBleConnectedHint(scheduleDev))
	}
	const logHeartbeatStatusLine = (remainSec) => {
		const parts = [
			'//定时测量-时段内心跳',
			tag ? `来源${tag}` : '',
			formatActiveSchedulesForLog(),
			formatNextSlotsForLog(nextAt, new Date(now)),
			`距并集槽位${remainSec}秒`
		].filter(Boolean)
		appendQxHeartbeatStatusParts(parts)
		parts.push(buildBleConnectedForHeartbeatLog() ? 'BLE已连接' : 'BLE未连接')
		qxScheduleLog(...parts)
	}
	// 前台空闲（无槽或离点>45s）：只打轻量状态日志，跳过扫蓝牙/刷通知等重活
	if (qxAppInForeground && !xferBusy && !qxMeasureInFlight &&
		(remainSecEarly < 0 || remainSecEarly > 45)) {
		if (!qxLastHeartbeatWorkAt || now - qxLastHeartbeatWorkAt >= QX_FG_HEARTBEAT_WORK_MIN_MS) {
			qxLastHeartbeatWorkAt = now
			logHeartbeatStatusLine(remainSecEarly)
		}
		return
	}
	// 前台假「测量中」且无槽/离点还远：低频纠偏 + 状态日志，不扫蓝牙/刷通知/设闹钟
	if (qxAppInForeground && !xferBusy && qxMeasureInFlight &&
		(remainSecEarly < 0 || remainSecEarly > 45)) {
		if (qxLastHeartbeatWorkAt && now - qxLastHeartbeatWorkAt < QX_FG_HEARTBEAT_WORK_MIN_MS) {
			return
		}
		qxLastHeartbeatWorkAt = now
		reconcileQxScheduleBusyState()
		logHeartbeatStatusLine(remainSecEarly)
		return
	}
	qxLastHeartbeatWorkAt = now
	if (isQxSlotOverdueAbandoned(nextAt, now) && !isQxMeasureSessionActive()) {
		nextAt = skipQxSlotIfOverdueBeyondAbandon(`心跳-${tag || '-'}`, now)
	}
	const remainSec = nextAt > 0 ? Math.max(0, Math.ceil((nextAt - now) / 1000)) : -1
	// 先纠偏假测量中，再打日志/状态，避免一直打印「测量进行中」
	reconcileQxScheduleBusyState()
	const scheduleDev = readQxEmotionDeviceId()
	// 心跳展示：BPW6 后台保显；活链路证据优先
	let bleConnected = false
	const bpw6Mac = uni.getStorageSync('BPW6devicemac') || ''
	if (!qxAppInForeground && bpw6Mac && hasBpw6LiveLinkEvidence(bpw6Mac) &&
		isAndroidBluetoothReallyOff() !== true) {
		bleConnected = true
		restoreBpw6ConnectedFromLiveEvidence('心跳活链路')
	} else {
		const bgBpw6 = resolveBpw6BgBleConnectedForLog(scheduleDev)
		if (bgBpw6 !== null) {
			bleConnected = bgBpw6
		} else {
			bleConnected = !!scheduleDev && (!!qxBleWatchConnected || readQxBleConnectedHint(scheduleDev))
		}
	}
	// 前后台都打状态串（前台空闲已在上方轻量分支打印）
	{
		const parts = [
			'//定时测量-时段内心跳',
			tag ? `来源${tag}` : '',
			formatActiveSchedulesForLog(),
			formatNextSlotsForLog(nextAt, new Date(now)),
			`距并集槽位${remainSec}秒`
		].filter(Boolean)
		appendQxHeartbeatStatusParts(parts)
		parts.push(bleConnected ? 'BLE已连接' : 'BLE未连接')
		qxScheduleLog(...parts)
	}
	// 前台：勿每心跳刷保活通知
	if (isQxMeasureSessionActive() && !qxAppInForeground) {
		if (!qxLastKeepAliveNotifAt || now - qxLastKeepAliveNotifAt > 8000) {
			qxLastKeepAliveNotifAt = now
			refreshKeepAliveNotificationIfNeeded()
		}
	}
	// 前台已连接：几乎不扫蓝牙；后台/未连接才轮询
	const shouldPollBle = !xferBusy && !qxAppInForeground
	if (shouldPollBle) {
		pollQxBleWatchConnectedState()
	} else if (!xferBusy && qxAppInForeground && !bleConnected) {
		if (!qxLastFgBlePollAt || now - qxLastFgBlePollAt >= QX_FG_BLE_POLL_MIN_MS) {
			qxLastFgBlePollAt = now
			pollQxBleWatchConnectedState()
		}
	}
	if (xferBusy) {
		ensureQxPpgXferBackgroundRuntime('心跳传数保活')
	} else if (qxMeasureInFlight && !qxAppInForeground) {
		ensureQxBleKeepAliveForBackground()
		acquireQxBleWakeLock()
	}
	// 新间隔到点且上一轮未结束：判失败并执行最新槽，不补发旧槽
	if (isNewIntervalDueWhileMeasuring() && !heartbeatDueTriggerPending) {
		heartbeatDueTriggerPending = true
		ensureQxBleKeepAliveForBackground()
		runQxBleScheduleWakeTick('heartbeat-new-slot')
			.finally(() => {
				heartbeatDueTriggerPending = false
			})
			.catch((e) => console.log('[qxBle] heartbeat-new-slot', e))
	} else if (nextAt > 0 && remainSec >= 0 && remainSec <= 3 && !heartbeatDueTriggerPending) {
		// 到点必唤醒：勿用 isQxMeasureSessionActive（残留 sendwatch 会挡住且无命令日志）
		clearStaleSessionFlagsIfSlotDue(now)
		if (isQxScheduleMeasureBusy() && !shouldPreemptMeasureForSlot(nextAt)) {
			// 真实测量中：跳过
		} else {
			heartbeatDueTriggerPending = true
			ensureQxBleKeepAliveForBackground()
			runQxBleScheduleWakeTick(remainSec > 0 ? 'heartbeat-near-due' : 'heartbeat-overdue').then((r) => {
				console.log('[qxBle] //定时测量-心跳到点结果', r)
				if (r === 'dispatch-skipped' || r === 'wake-busy') {
					scheduleQxSlotDispatchRetry('heartbeat-overdue')
				}
			}).finally(() => {
				heartbeatDueTriggerPending = false
			}).catch((e) => {
				heartbeatDueTriggerPending = false
				console.log('[qxBle] heartbeat-overdue', e)
			})
		}
	} else if (nextAt > 0 && remainSec > 0 && remainSec <= 45 && !isQxScheduleMeasureBusy()) {
		// 前台只在最后 20 秒设闹钟，避免每心跳跨原生桥
		if (!qxAppInForeground || remainSec <= 20) {
			scheduleQxBleNativeAlarm()
		}
		if (remainSec <= 20 && !qxAppInForeground) {
			ensureQxBleKeepAliveForBackground()
		}
	}
}

/** 保活每 15 秒唤醒时打心跳（后台 JS setInterval 会停） */
export function logQxBleScheduleHeartbeatFromKeepAlive() {
	const managedRead = !!(u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead())
	if (managedRead) {
		ensureQxPpgXferBackgroundRuntime('保活唤醒-传数')
		try {
			if (typeof u16proBLE.pokePpgManagedReadKeepAlive === 'function') {
				u16proBLE.pokePpgManagedReadKeepAlive(undefined, {
					allowChunkResend: true
				})
			}
		} catch (ePoke) {}
		return
	}
	// 前台：保活闹钟勿打扰 UI；仅临近到点/真忙才轻量 tick
	if (qxAppInForeground) {
		if (isQxPpgXferBusy()) {
			return
		}
		if (!qxMeasureInFlight) {
			try {
				const nextAt = readNextFireAt()
				const remain = nextAt > 0 ? Math.ceil((nextAt - Date.now()) / 1000) : -1
				if (remain < 0 || remain > 45) {
					return
				}
			} catch (e) {
				return
			}
		}
		tickScheduleHeartbeat('保活前台')
		return
	}
	if (isQxPpgXferBusy() || isQxMeasureSessionActive()) {
		ensureQxPpgXferBackgroundRuntime('保活唤醒-传数')
		// 测量/传数中勿再进完整 tick（会扫蓝牙）
		try {
			const now = Date.now()
			const nextAt = readNextFireAt()
			const remainSec = nextAt > 0 ? Math.max(0, Math.ceil((nextAt - now) / 1000)) : -1
			qxScheduleLog(
				'//定时测量-时段内心跳',
				'来源保活15秒',
				formatActiveSchedulesForLog(),
				formatNextSlotsForLog(nextAt, new Date(now)),
				`距并集槽位${remainSec}秒`,
				'测量进行中',
				'后台',
				'BLE已连接(传数中免扫)'
			)
		} catch (e) {}
		return
	} else if (qxMeasureInFlight) {
		ensureQxBleKeepAliveForBackground()
		acquireQxBleWakeLock()
	}
	tickScheduleHeartbeat('保活15秒')
}

function startScheduleHeartbeat() {
	stopScheduleHeartbeat()
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) return
	tickScheduleHeartbeat()
	qxHeartbeatTimer = setInterval(tickScheduleHeartbeat, QX_SCHEDULE_HEARTBEAT_MS)
}

function schedulePlanNext(ms) {
	clearTimer()
	qxBleTimer = setTimeout(() => {
		qxBleTimer = null
		runQxBleScheduleWakeTick('js-timer')
			.then((r) => {
				if (r === 'dispatch-skipped') {
					scheduleQxSlotDispatchRetry('js-timer')
					return
				}
				if (r === 'needs-plan') {
					return planNext({
						lifecycle: true
					})
				}
				if (r === 'executed' || r === 'restarted') {
					if (shouldPreserveCurrentMeasureSlot()) {
						scheduleQxBleNativeAlarm()
						return
					}
					return planNext({
						lifecycle: true
					})
				}
			})
			.catch((e) => console.log('[qxBle] wakeTick', e))
	}, ms)
}

async function executeQxMeasurementOnce() {
	if (!isSwitchOn()) return false
	if (!isCurrentlyInScheduleWindow()) {
		return false
	}
	// 同机型手动立即测量进行中：禁止定时下发抢通道
	const schedKind = isQxBpw6EmotionMode() ? 'bpw6' : 'bpw1'
	if (isQxEmotionImmediateBusy(schedKind)) {
		console.log('[qxBle] //定时测量-跳过(立即测量占用)', schedKind)
		return false
	}
	let slotAt = resolveQxDueSlotForDispatch()
	if (isQxScheduleMeasureBusy()) {
		if (shouldPreemptMeasureForSlot(slotAt)) {
			failPreviousSlotForNewDue(slotAt, '下发前新槽抢占')
		} else if (!reconcileQxScheduleBusyState() || isQxScheduleMeasureBusy()) {
			return false
		}
	}
	slotAt = readNextFireAt() || slotAt
	if (isQxSlotSupersededByNextInterval(slotAt)) {
		slotAt = skipQxOverdueSlotToCurrentAligned('下发前')
	}
	if (slotAt <= 0) {
		return false
	}
	if (isSameQxSlotAlreadyClaimed(slotAt)) {
		return false
	}
	// 先抢占槽位再连 BLE，避免长时间「待命」且无 inFlight 导致到点不触发/重复补发
	if (!tryBeginQxSlotExecute(slotAt)) {
		return false
	}
	uni.setStorageSync('sendwatch', 1)
	markQxScheduledMeasureStorage()
	try {
		uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, true)
	} catch (eUi) {}
	// 不在此 EMIT busy：避免 Main 过早 arm 0x58 watch；真正启动成功后再发
	qxMeasureSessionStartedAt = Date.now()
	pauseQxBleTimeSyncForMeasure()
	refreshKeepAliveNotificationIfNeeded()
	await ensureQxBleBackgroundRuntime('下发测量前')

	const target = await resolveQxMeasurementTarget()
	let dev = target.deviceId
	let useBpw6 = !!target.useBpw6
	if (!dev) {
		resetQxScheduleBusyState('无可用设备', {
			advanceSlot: false,
			clearSendwatch: true,
			sessionEnd: false
		})
		return false
	}
	// 目标已是 BPW6 MAC / 情绪机型 BPW6：强制 PPG（防止 useBpw6=false 拐到 BPW1 写命令）
	const bpw6Mac = uni.getStorageSync('BPW6devicemac') || ''
	if (bpw6Mac && (isSameQxBleDeviceId(dev, bpw6Mac) || isQxBpw6EmotionMode())) {
		useBpw6 = true
		dev = bpw6Mac
	}
	// console.log('[qxBle] //定时测量-下发目标', useBpw6 ? 'bpw6' : 'bpw1', dev,
	// 	'emotionBpw6=', isQxBpw6EmotionMode())
	// 解析目标后再打机型归属，后续结束/纠偏按机型隔离
	markQxScheduledMeasureStorage(useBpw6 ? 'bpw6' : 'bpw1')
	verifyQxBleWatchConnected('下发测量前').catch(() => {})
	let lastError = null
	for (let attempt = 1; attempt <= QX_SLOT_DISPATCH_MAX_ATTEMPTS; attempt++) {
		try {
			const ready = await ensureQxBleDeviceConnectedForWrite(dev)
			if (!ready) {
				throw {
					errMsg: 'writeBLECharacteristicValue:fail no connection',
					errCode: 10004,
					code: 10004
				}
			}
			await runOneQxMeasurement(dev, DEFAULT_SERVICE_ID, DEFAULT_CHAR_ID, useBpw6)
			const activeSlot = readMeasureSlotAt() || slotAt
			if (activeSlot > 0) {
				const next = getNextUnionAlignedSlotDate(new Date(), new Date(activeSlot + 1))
				persistNextFireAt(next ? next.getTime() : activeSlot)
			}
			startQxMeasureWatchdog()
			refreshKeepAliveNotificationIfNeeded()
			return true
		} catch (e) {
			lastError = e
			clearQxScheduledMeasureIfDevice(useBpw6 ? 'bpw6' : 'bpw1')
			qxMeasureSessionStartedAt = 0
			try {
				uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, false)
			} catch (errUi) {}
			if (isQxBleNoConnectionError(e)) {
				clearQxDeviceConnectedFlags(dev)
				await createQxBleConnection(dev)
				await delayMs(600)
			}
			if (attempt < QX_SLOT_DISPATCH_MAX_ATTEMPTS) {
				await delayMs(QX_SLOT_DISPATCH_RETRY_GAP_MS)
			}
		}
	}
	// 连续三次下发失败：跳过本槽，排下一对齐槽位；新槽到点必须再下发
	const now = Date.now()
	const failedSlot = readMeasureSlotAt() || slotAt
	const clearedOnFail = failedSlot > 0 && now >= failedSlot - 500
	if (clearedOnFail) {
		clearQxSlotOnDispatchFail('BLE下发失败达上限', now)
	}
	resetQxScheduleBusyState('BLE下发失败达上限', {
		advanceSlot: !clearedOnFail,
		clearSendwatch: true
	})
	resumeQxBleTimeSyncAfterMeasure()
	refreshKeepAliveNotificationIfNeeded()
	if (clearedOnFail) {
		scheduleQxDispatchAfterSlotClear('BLE下发失败达上限-新槽', now)
	} else {
		scheduleQxSlotDispatchRetry('BLE下发失败达上限')
	}
	return false
}

/**
 * 到点前：若无真实测量运行时，清掉残留 sendwatch/调度标记。
 * 否则 isQxMeasureSessionActive() 会挡住心跳到点唤醒，连命令日志都没有。
 */
function clearStaleSessionFlagsIfSlotDue(now = Date.now()) {
	const nextAt = readNextFireAt()
	if (!(nextAt > 0 && now >= nextAt - 3000)) return false
	if (hasQxBleLiveMeasureRuntime()) return false
	if (u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead()) return false
	const schedKind = isQxBpw6EmotionMode() ? 'bpw6' : 'bpw1'
	if (isQxEmotionImmediateBusy(schedKind)) return false
	const sendwatch = uni.getStorageSync('sendwatch')
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const hasSched = isQxScheduledMeasureStorageOn()
	const hasSleepUi = isMainSleepAlertMeasureBusy()
	if (!hasSend && !hasSched && !hasSleepUi && readMeasureSlotAt() <= 0) return false
	// console.log('[qxBle] 到点清残留假会话，允许下发', {
	// 	hasSend,
	// 	hasSched,
	// 	slot: readMeasureSlotAt()
	// })
	resetQxScheduleBusyState('到点清残留假会话', {
		advanceSlot: false,
		clearSendwatch: true,
		sessionEnd: false
	})
	return true
}

/**
 * 保活闹钟 / 回前台 / JS 定时器：按持久化的下次触发时间补发测量（后台熄屏不依赖 setTimeout）
 */
export async function runQxBleScheduleWakeTick(source = 'wake') {
	if (qxWakeTickInFlight) {
		// 后台长准备/拉数时若异常未清，避免永久 wake-busy 导致到点不下发
		if (qxWakeTickStartedAt > 0 && Date.now() - qxWakeTickStartedAt > 45 * 1000) {
			console.log('[qxBle] wake-busy 超时强制解锁', source)
			qxWakeTickInFlight = false
			qxWakeTickStartedAt = 0
			heartbeatDueTriggerPending = false
		} else {
			return 'wake-busy'
		}
	}
	qxWakeTickInFlight = true
	qxWakeTickStartedAt = Date.now()
	try {
		return await runQxBleScheduleWakeTickInner(source)
	} finally {
		qxWakeTickInFlight = false
		qxWakeTickStartedAt = 0
	}
}

async function runQxBleScheduleWakeTickInner(source = 'wake') {
	reconcileQxScheduleBusyState()
	clearStaleSessionFlagsIfSlotDue()
	if (!isSwitchOn()) {
		return 'off'
	}
	const deviceId = readQxEmotionDeviceId()
	if (!deviceId) {
		// console.log('[qxBle] wake无设备', source)
		return 'no-device'
	}
	if (!listActiveSchedules().length) {
		return 'invalid-window'
	}
	if (!isCurrentlyInScheduleWindow()) {
		clearNextFireAt()
		return 'outside-window'
	}
	const now = Date.now()
	let nextAt = resolveQxDueSlotForDispatch(now)
	if (nextAt <= 0) {
		await planNext({
			lifecycle: true
		})
		return 'needs-plan'
	}
	if (now < nextAt - 500) {
		return 'not-due'
	}
	// console.log('[qxBle] //定时测量-到点唤醒', source, formatSlotTime(nextAt))
	const overdueSec = getQxSlotOverdueSec(nextAt, now)
	if (overdueSec > 0 && overdueSec <= QX_SLOT_OVERDUE_ABANDON_MS / 1000) {} else if (overdueSec >
		QX_SLOT_OVERDUE_ABANDON_MS / 1000) {}
	if (isQxScheduleMeasureBusy() || isSameQxSlotAlreadyClaimed(nextAt)) {
		if (!shouldPreemptMeasureForSlot(nextAt)) {
			// console.log('[qxBle] //定时测量-到点跳过(已在测量)', source)
			return 'already-running'
		}
		failPreviousSlotForNewDue(nextAt, '新间隔到点抢占')
		const restarted = await executeQxMeasurementOnce()
		console.log('[qxBle] //定时测量-到点抢占下发', source, restarted ? '成功' : '失败')
		return restarted ? 'restarted' : 'dispatch-skipped'
	}
	const executed = await executeQxMeasurementOnce()
	return executed ? 'executed' : 'dispatch-skipped'
}

function isCurrentlyInScheduleWindow() {
	const nowM = getLocalMinuteOfDay()
	const schedules = listActiveSchedules()
	for (let i = 0; i < schedules.length; i++) {
		const sch = schedules[i]
		if (isWithinWindowMinute(nowM, sch.s, sch.e)) return true
	}
	return false
}

/** 系统时区变更后：按新时区重算下一槽位并刷新原生闹钟 */
export function replanQxBleScheduleOnTimezoneChange() {
	if (!isSwitchOn()) {
		return Promise.resolve()
	}
	if (isQxMeasureSessionActive()) {
		return planNext({
			lifecycle: false
		}).catch((e) => console.log('[qxBle] timezone planNext', e))
	}
	clearNextFireAt()
	return planNext().catch((e) => console.log('[qxBle] timezone planNext', e))
}

/**
 * @param {object} [opts]
 * @param {boolean} [opts.lifecycle] 前后台切换：不中断测量/排程中的定时器，保留已有下一槽位
 */
async function planNext(opts = {}) {
	const lifecycle = !!opts.lifecycle
	reconcileQxScheduleBusyState()
	clearStaleQxScheduledMeasureState()
	if (planNextInFlight) {
		return
	}
	planNextInFlight = true
	try {
		if (!lifecycle || !hasOngoingQxWork()) {
			clearTimer()
		}
		await maybeRefreshQxFromServer()
		if (!isSwitchOn()) {
			stopScheduleHeartbeat()
			clearNextFireAt()
			return
		}
		const deviceId = readQxEmotionDeviceId()
		if (!deviceId) {
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		if (!listActiveSchedules().length) {
			clearNextFireAt()
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		if (!isCurrentlyInScheduleWindow()) {
			stopScheduleHeartbeat()
			clearNextFireAt()
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		const now = Date.now()
		let nextAt = readNextFireAt()
		const measureSlot = readMeasureSlotAt()
		if (shouldPreserveCurrentMeasureSlot() && measureSlot > 0) {
			persistNextFireAt(measureSlot)
			nextAt = measureSlot
		} else if (lifecycle && nextAt > now - 1000) {} else {
			nextAt = syncNextAlignedFireAt(null)
		}
		if (nextAt <= 0) {
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		if (now >= nextAt - 500) {
			if (!isQxScheduleMeasureBusy() || shouldPreemptMeasureForSlot(nextAt)) {
				const dueResult = await runQxBleScheduleWakeTick('planNext-due')
				if (dueResult === 'dispatch-skipped') {
					scheduleQxSlotDispatchRetry('planNext-due')
				}
				nextAt = readNextFireAt()
				if (nextAt <= 0) {
					nextAt = syncNextAlignedFireAt(new Date(Date.now() + 800))
				}
			}
		}
		const delay = Math.max(0, nextAt - Date.now())
		if (!lifecycle || !isQxScheduleMeasureBusy()) {
			schedulePlanNext(delay)
		} else if (delay <= 0) {
			scheduleQxSlotDispatchRetry('planNext-到点但测量忙')
		}
		scheduleQxBleNativeAlarm()
		startScheduleHeartbeat()
	} finally {
		planNextInFlight = false
	}
}

export function stopGlobalQxBleAlignedSchedule() {
	clearQxBleScheduleTasks({
		preserveMeasureSession: false
	})
}

/** Android：启动/刷新保活前台服务 + 闹钟，保证后台到点能执行 JS 发 BLE */
export function ensureQxBleKeepAliveForBackground() {
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().platform !== 'android') return
	if (!isSwitchOn()) return
	try {
		keepAliveManager.ensureRunningForAppTimers()
		acquireQxBleWakeLock()
		scheduleQxBleNativeAlarm()
	} catch (e) {
		console.log('[qxBle] ensureQxBleKeepAliveForBackground', e)
	}
	// #endif
}

/** 保活原生闹钟触发：到点发测量并刷新下一槽位（后台主路径） */
export async function handleQxBleKeepAliveWake() {
	reconcileQxScheduleBusyState()
	clearStaleSessionFlagsIfSlotDue()
	clearStaleQxScheduledMeasureState()
	await ensureQxBleBackgroundRuntime('保活闹钟')
	const wakeResult = await runQxBleScheduleWakeTick('keepAlive-alarm')
	if (!isSwitchOn()) return
	// 未到点勿全量 planNext（会重设 JS 定时器/连打三次原生闹钟，易导致链断）
	if (wakeResult === 'dispatch-skipped') {
		scheduleQxSlotDispatchRetry('keepAlive-alarm')
	} else if (wakeResult === 'executed' || wakeResult === 'restarted' || wakeResult === 'needs-plan') {
		if (!shouldPreserveCurrentMeasureSlot()) {
			await planNext({
				lifecycle: true
			})
		} else {
			scheduleQxBleNativeAlarm()
		}
	} else if (wakeResult === 'already-running') {
		scheduleQxBleNativeAlarm()
	} else if (wakeResult === 'not-due' || wakeResult === 'busy') {
		scheduleQxBleNativeAlarm()
	}
	if (isQxScheduleMeasureBusy()) {
		acquireQxBleWakeLock()
		if (wakeResult === 'busy') {
			scheduleDeferredPlanNext('保活唤醒时测量进行中')
		}
		scheduleQxBleNativeAlarm()
	}
}

/** App 进入后台/熄屏：不中断进行中的 BLE/排程，仅加强保活 */
export function onQxBleAppBackground() {
	if (!isSwitchOn()) return
	setQxBleAppForegroundState(false)
	startQxBleTimeSyncLoop()
	ensureQxBleBackgroundRuntime('熄屏/进后台')
	if (hasOngoingQxWork()) {
		return
	}
	const nextAt = readNextFireAt()
	const remainSec = nextAt > 0 ? Math.ceil((nextAt - Date.now()) / 1000) : 999
	scheduleQxBleNativeAlarm()
	if (nextAt > 0 && remainSec <= 90) {
		runQxBleScheduleWakeTick('app-background-near-slot').catch((e) => console.log('[qxBle] bg near slot', e))
	}
}

/** App 回前台：不中断测量；仅补检到点，勿全量重启排程 */
export function onQxBleAppForeground() {
	setQxBleAppForegroundState(true)
	stopQxBleTimeSyncLoop()
	// BPW6：回前台补静默重连（不改展示/测量逻辑）
	const bpw6Mac = uni.getStorageSync('BPW6devicemac')
	if (bpw6Mac) {
		requestBpw6SilentReconnect(bpw6Mac, 'app-foreground')
	}
	if (!isSwitchOn()) return
	reconcileQxScheduleBusyState()
	if (isQxScheduleMeasureBusy()) {
		ensureQxBleKeepAliveForBackground()
		return
	}
	return runQxBleScheduleWakeTick('app-foreground').then((r) => {
		if (r === 'dispatch-skipped') {
			scheduleQxSlotDispatchRetry('app-foreground')
			return
		}
		if (r === 'executed' || r === 'restarted' || r === 'needs-plan') {
			return planNext({
				lifecycle: true
			})
		}
		scheduleQxBleNativeAlarm()
	})
}

/** 保存成功或重新进入定时：先清上一轮排程任务，再全新排程（采集中仅清重复任务） */
export function startGlobalQxBleAlignedSchedule() {
	initQxBleConnectionMonitor()
	const measuring = isQxMeasureSessionActive()
	clearQxBleScheduleTasks({
		preserveMeasureSession: measuring
	})
	if (measuring) {
		ensureQxBleKeepAliveForBackground()
		return planNext({
			lifecycle: true
		}).catch((e) => console.log('[qxBle] planNext', e))
	}
	qxScheduleSessionFirstRun = true
	ensureQxBleKeepAliveForBackground()
	return planNext().catch((e) => console.log('[qxBle] planNext', e))
}

/** App 启动：先尝试拉 QX_DATA 写缓存，再若开关开则恢复调度 */
export async function resumeQxBleScheduleIfEnabled() {
	initQxBleConnectionMonitor()

	await maybeRefreshQxFromServer().catch(() => {})
	if (!isSwitchOn()) {
		return
	}
	if (isQxMeasureSessionActive()) {
		clearQxBleScheduleTasks({
			preserveMeasureSession: true
		})
		ensureQxBleKeepAliveForBackground()
		await planNext({
			lifecycle: true
		}).catch((e) => console.log('[qxBle] planNext lifecycle', e))
	} else {
		startGlobalQxBleAlignedSchedule()
	}
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().platform === 'android' && isSwitchOn()) {
		setTimeout(() => ensureQxBleBackgroundRuntime('恢复调度后'), 500)
	}
	// #endif
}

try {
	keepAliveManager.registerQxBleWakeHandler(handleQxBleKeepAliveWake)
	keepAliveManager.registerQxBleHeartbeat(logQxBleScheduleHeartbeatFromKeepAlive)
	keepAliveManager.registerQxBleMeasuringCheck(isQxBleMeasureSessionActive)
} catch (e) {
	console.log('[qxBle] registerQxBleWakeHandler', e)
}