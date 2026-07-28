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
/** 定时情绪测量是否走 BPW6（Reports_Alerts_new 传入 devicetype=true） */
export const QX_EMOTION_BPW6_KEY = 'qx_emotion_bpw6'
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
/** 在设定的测量时段内，心跳日志间隔（毫秒） */
const QX_SCHEDULE_HEARTBEAT_MS = 10 * 1000
/** 情绪定时开关打开时，后台实时通信间隔（毫秒）：BPW1 时间同步 / BPW6 读电量 */
const QX_BLE_TIME_SYNC_INTERVAL_MS = 13 * 1000
/** 后台实时通信时段：20:00–次日 06:00 */
const QX_BLE_TIME_SYNC_NIGHT_START_HOUR = 20
const QX_BLE_TIME_SYNC_NIGHT_END_HOUR = 6
/** 下发 BLE 后等待手表采集结束的最长时间（毫秒） */
const QX_MEASURE_SESSION_MAX_MS = 5 * 60 * 1000
/** 无结束回调时纠偏：PPG 传输约 80s + 上传，超过则视为已结束（后台 Main 未收 notify） */
const QX_MEASURE_SESSION_ORPHAN_MS = 3 * 60 * 1000
/** scheduleDeferredPlanNext 在 inFlight 滞留时的最大重试次数 */
const QX_DEFERRED_PLAN_MAX_RETRY = 4

export function isQxBpw6EmotionMode() {
	const flag = uni.getStorageSync(QX_EMOTION_BPW6_KEY)
	const hasBpw6 = !!uni.getStorageSync('BPW6devicemac')
	const hasBpw1 = !!uni.getStorageSync('deviceIdwatch')
	// 仅绑 BPW6 时按 BPW6 情绪定时，避免一直用空的 deviceIdwatch 误报未连接
	if (hasBpw6 && !hasBpw1) {
		if (flag !== true && flag !== 'true') {
			try {
				uni.setStorageSync(QX_EMOTION_BPW6_KEY, true)
			} catch (e) {}
		}
		return true
	}
	return flag === true || flag === 'true'
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
			console.warn('[qxBle] 后台忽略 BPW6 断开通知', deviceId)
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

function clearQxDeviceConnectedFlags(deviceId = '') {
	const bpw6 = uni.getStorageSync('BPW6devicemac') || ''
	const bpw1 = uni.getStorageSync('deviceIdwatch') || ''
	const clearBpw6 = !deviceId || (bpw6 && isSameQxBleDeviceId(deviceId, bpw6))
	const clearBpw1 = !deviceId || (bpw1 && isSameQxBleDeviceId(deviceId, bpw1))
	// 后台勿清 BPW6 连接标记（系统列表漏报会导致误清）
	if (clearBpw6 && !qxAppInForeground && bpw6) {
		console.warn('[qxBle] 后台跳过清 BPW6 连接标记', deviceId || bpw6)
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
		uni.createBLEConnection({
			deviceId,
			timeout: 8000,
			success: () => {
				console.log('[qxBle] 下发前重连成功', deviceId)
				resolve(true)
			},
			fail: (err) => {
				const msg = String((err && err.errMsg) || '')
				if (msg.indexOf('already') >= 0 || (err && (err.errCode === -1 || err.code === -
						1))) {
					resolve(true)
					return
				}
				console.warn('[qxBle] 下发前重连失败', deviceId, err)
				resolve(false)
			}
		})
	})
}

async function ensureQxBleDeviceConnectedForWrite(deviceId) {
	if (!deviceId) return false
	let ok = await querySystemBleConnected(deviceId)
	if (!ok) {
		// 后台/熄屏时 getConnectedBluetoothDevices 常空列表误报未连接；
		// 对齐最早定时下发：有设备则尝试重连/hint 后直接写，勿先清 hint 再卡死。
		console.warn('[qxBle] 系统未连接，尝试重连后再下发', deviceId)
		const reconnected = await createQxBleConnection(deviceId)
		if (reconnected) {
			await delayMs(600)
			ok = true
			const confirmed = await querySystemBleConnected(deviceId)
			if (!confirmed) {
				console.warn('[qxBle] 重连后系统列表仍未命中，按已连接继续下发', deviceId)
			}
		} else if (readQxBleConnectedHint(deviceId)) {
			console.warn('[qxBle] 系统列表未命中，使用连接hint继续下发', deviceId)
			ok = true
		} else {
			clearQxDeviceConnectedFlags(deviceId)
			return false
		}
	}
	if (!ok) return false
	notifyQxBleWatchConnectionState(true, deviceId)
	if (isSameQxBleDeviceId(deviceId, uni.getStorageSync('BPW6devicemac'))) {
		try {
			// 后台勿强制 rediscover（getBLEDeviceServices 易失败），有缓存通道则直接写
			await u16proBLE.ensureBcServiceReady(deviceId, {
				force: !!qxAppInForeground
			})
		} catch (e) {
			console.warn('[qxBle] BC通道准备失败', e)
		}
	}
	return true
}

/**
 * 解析实际下发目标：避免「BPW6已连却拿过期 BPW1 mac 去写」导致 10004
 */
async function resolveQxMeasurementTarget() {
	const bpw6 = uni.getStorageSync('BPW6devicemac') || ''
	const bpw1 = uni.getStorageSync('deviceIdwatch') || ''
	let useBpw6 = isQxBpw6EmotionMode()
	let deviceId = useBpw6 ? bpw6 : bpw1

	const bpw1Real = bpw1 ? await querySystemBleConnected(bpw1) : false
	const bpw6Real = bpw6 ? await querySystemBleConnected(bpw6) : false

	if (!useBpw6 && !bpw1Real && bpw6Real) {
		console.warn('[qxBle] BPW1未真正连接，改用已连接的BPW6下发')
		useBpw6 = true
		deviceId = bpw6
		try {
			uni.setStorageSync(QX_EMOTION_BPW6_KEY, true)
		} catch (e) {}
	} else if (useBpw6 && !bpw6Real && bpw1Real) {
		console.warn('[qxBle] BPW6未真正连接，改用已连接的BPW1下发')
		useBpw6 = false
		deviceId = bpw1
	} else if (!deviceId) {
		deviceId = bpw6Real ? bpw6 : (bpw1Real ? bpw1 : (bpw6 || bpw1))
		useBpw6 = !!(deviceId && bpw6 && isSameQxBleDeviceId(deviceId, bpw6))
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
const QX_RECONCILE_FLAGS_GRACE_MS = 35 * 1000
/** 抢占槽位后、sendwatch 写入前仍视为忙（覆盖探测+PPG 约 6s） */
const QX_SLOT_CLAIM_ACTIVE_MS = 45 * 1000
/** 抢占后始终未出现 sendwatch/会话：强制清忙（毫秒） */
const QX_SLOT_CLAIM_ORPHAN_MS = 40 * 1000
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
		console.warn('[qxBle] 刷新保活通知', e)
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

/** 已抢占槽位且仍在 BLE 下发/采集窗口内（此时尚无 sendwatch） */
function isQxSlotClaimActive() {
	if (qxSlotClaimedAt <= 0) return false
	return Date.now() - qxSlotClaimedAt < QX_SLOT_CLAIM_ACTIVE_MS
}

/** 调度器是否正在执行/等待本轮定时采集 */
function isQxScheduleMeasureBusy() {
	return qxMeasureInFlight || hasActiveQxBleCollection() || isQxSlotClaimActive()
}

/** 本轮槽位未完成前勿重算下一槽位（避免 21:40 到点却立刻排到 21:45） */
function shouldPreserveCurrentMeasureSlot() {
	if (isQxMeasureSessionActive()) return true
	const measureSlot = readMeasureSlotAt()
	if (measureSlot <= 0) return false
	return Date.now() - measureSlot < readIntervalMinute() * 60 * 1000
}

function markQxScheduledMeasureStorage() {
	uni.setStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY, 1)
}

function clearQxScheduledMeasureStorage() {
	uni.removeStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
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
		// qxScheduleLog('//定时测量-清除旧排程任务', '采集中-保留测量会话')
		// console.log('//定时测量-清除旧排程任务', '采集中-保留测量会话')
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
	// qxScheduleLog('//定时测量-清除旧排程任务', '已停止上一轮排程')
	// console.log('//定时测量-清除旧排程任务', '已停止上一轮排程')
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
	// qxScheduleLog('//定时测量-清理残留调度采集标记')
	// console.log('//定时测量-清理残留调度采集标记')
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
	if (clearSendwatch) {
		uni.removeStorageSync('sendwatch')
	}
	// 结束定时会话时同步清 Main 测量中标记，避免心跳一直「测量进行中」
	try {
		uni.setStorageSync('sleep_alertdisabled', false)
	} catch (e) {}
	try {
		uni.$emit('EMOTION_MEASURE_BUSY', false)
	} catch (e2) {}
	if (logSessionEnd && (wasInFlight || reason)) {
		// qxScheduleLog('//定时测量-采集结束恢复待命', reason || '-')
		// console.log('//定时测量-采集结束恢复待命', reason || '-')
	}
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
		// qxScheduleLog('//定时测量-采集超时', `${QX_MEASURE_SESSION_MAX_MS / 60000}分钟无结束信号`)
		// console.log('//定时测量-采集超时', `${QX_MEASURE_SESSION_MAX_MS / 60000}分钟无结束信号`)
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
	clearQxScheduledMeasureStorage()
	clearMeasureSlotAt()
	uni.removeStorageSync('sendwatch')
	uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, false)
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
	// qxScheduleLog('//定时测量-上一槽位失败', formatSlotTime(oldSlot),
	// 	targetAt > 0 ? `执行新槽${formatSlotTime(targetAt)}` : '无新槽', reason || '-')
	// console.log('//定时测量-上一槽位失败', formatSlotTime(oldSlot),
	// 	targetAt > 0 ? `执行新槽${formatSlotTime(targetAt)}` : '无新槽', reason || '-')
	// qxScheduleLog('//定时测量-恢复待命', '不补发旧槽')
	// console.log('//定时测量-恢复待命', '不补发旧槽')
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
	// qxScheduleLog(tag,
	// 	`原${formatSlotTime(oldAt)}`, `逾期${overdueSec}秒`,
	// 	`新${formatSlotTime(newAt)}`, reason || '-')
	// console.log(tag,
	// 	`原${formatSlotTime(oldAt)}`, `逾期${overdueSec}秒`,
	// 	`新${formatSlotTime(newAt)}`, reason || '-')
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
			console.warn('[qxBle] dispatch-fail wake', e)
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
			// qxScheduleLog('//定时测量-跳过逾期槽位', '新槽位', formatSlotTime(newAt))
			// console.log('//定时测量-跳过逾期槽位', '新槽位', formatSlotTime(newAt))
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
	const sendwatch = uni.getStorageSync('sendwatch')
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const hasSched = scheduled === 1 || scheduled === '1'
	if (!hasSend && !hasSched) {
		const refAt = qxMeasureSessionStartedAt || qxSlotClaimedAt
		if (refAt <= 0 || Date.now() - refAt < QX_RECONCILE_FLAGS_GRACE_MS) {
			return false
		}
		// qxScheduleLog('//定时测量-状态纠偏', 'sendwatch/调度标记已清，结束滞留会话')
		// console.log('//定时测量-状态纠偏', 'sendwatch/调度标记已清，结束滞留会话')
		finishQxBleMeasurementSession('状态纠偏-标记已清')
		return true
	}
	const started = qxMeasureSessionStartedAt
	if (started > 0 && Date.now() - started > QX_MEASURE_SESSION_ORPHAN_MS) {
		// qxScheduleLog('//定时测量-状态纠偏',
		// 	`下发后${Math.round((Date.now() - started) / 1000)}秒无结束回调`)
		// console.log('//定时测量-状态纠偏',
		// 	`下发后${Math.round((Date.now() - started) / 1000)}秒无结束回调`)
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
	if (reconcileQxMeasureInFlightState()) {
		return true
	}
	const now = Date.now()
	const hasSched = isQxScheduledMeasureStorageOn()
	const sendwatch = uni.getStorageSync('sendwatch')
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const hasSleepUiBusy = isMainSleepAlertMeasureBusy()
	const measureSlot = readMeasureSlotAt()

	// 无 inFlight、无抢占：残留调度/sendwatch/测量中 UI 标记应恢复待命
	// （页面重载后 inFlight 丢失最常见；勿误清无槽位的手动 sendwatch）
	if (!qxMeasureInFlight && !isQxSlotClaimActive()) {
		if (hasSched || (hasSend && measureSlot > 0) ||
			(hasSleepUiBusy && (hasSched || hasSend || measureSlot > 0))) {
			const refAt = qxMeasureSessionStartedAt || measureSlot || 0
			if (refAt <= 0 || now - refAt >= QX_RECONCILE_FLAGS_GRACE_MS) {
				console.log('[qxBle] 状态纠偏: 清除残留测量中标记', {
					hasSched,
					hasSend,
					hasSleepUiBusy,
					measureSlot
				})
				resetQxScheduleBusyState('纠偏-残留测量中标记', {
					advanceSlot: false,
					clearSendwatch: !!(hasSched || (hasSend && measureSlot > 0)),
					sessionEnd: false
				})
				return true
			}
		}
	}

	if (hasSched && !qxMeasureInFlight && !isQxSlotClaimActive()) {
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
	if (isQxBpw6EmotionMode() && (qxMeasureInFlight || hasSend || hasSched || hasSleepUiBusy)) {
		const started = qxMeasureSessionStartedAt || qxSlotClaimedAt || measureSlot
		if (started > 0 && now - started > QX_MEASURE_SESSION_ORPHAN_MS) {
			console.log('[qxBle] 状态纠偏: BPW6会话超时恢复待命',
				`${Math.round((now - started) / 1000)}秒`)
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

/** Main.vue 收到手表「结束采集」或采集异常清理 sendwatch 时调用 */
export function onQxBleWatchCollectionEnded(reason = '设备采集结束') {
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
	// console.log("//定时测量-延后排程', reason")
	deferredPlanNextTimer = setTimeout(() => {
		deferredPlanNextTimer = null
		if (qxMeasureInFlight) {
			reconcileQxScheduleBusyState()
			if (qxMeasureInFlight) {
				deferredPlanNextRetry += 1
				if (deferredPlanNextRetry >= QX_DEFERRED_PLAN_MAX_RETRY) {
					// qxScheduleLog('//定时测量-延后排程', '多次等待仍忙，强制结束滞留会话')
					// console.log('//定时测量-延后排程', '多次等待仍忙，强制结束滞留会话')
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
		}).catch((e) => console.warn('[qxBle] deferred planNext', e))
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
		console.warn('[qxBle] acquireWakeLock', e)
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
		}
	} else if (qxAppInForeground) {
		// 仅前台确认断开时清会话粘性
		qxBleBpw6SessionConnected = false
	}
	if (was && !qxBleWatchConnected) {
		// qxScheduleLog('//定时测量-BLE连接状态', reason || '-', '手表已断开',
		// 	uni.getStorageSync('deviceIdwatch') || '')
	}
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
				if (hadHint || hadMem || allowHint || qxBleBpw6SessionConnected) {
					updateQxBleWatchConnectionState(true, `${reason || 'sys'}-bg-keep`)
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
					console.warn('[qxBle] 后台忽略 BPW6 断开回调，保留连接态', change.deviceId)
					syncQxBleWatchConnectedFromSystem({
						reason: 'onBLEConnectionStateChange-bg'
					})
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
		} else {
			// qxScheduleLog('//定时测量-BLE连接监听', 'onBLEConnectionStateChange不可用')
			// console.log('//定时测量-BLE连接监听', 'onBLEConnectionStateChange不可用')
		}
	}
	if (dev) {
		if (readQxBleConnectedHint(dev)) {
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
		if (qxBleWatchConnected || readQxBleConnectedHint(dev) || qxBleBpw6SessionConnected) {
			updateQxBleWatchConnectionState(true, '后台心跳保连')
			try {
				uni.setStorageSync('qx_bpw6_ble_connected', true)
			} catch (e) {}
		}
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
			// qxScheduleLog('//定时测量-新槽立即下发', formatSlotTime(slotAt), reason || '-')
			// console.log('//定时测量-新槽立即下发', formatSlotTime(slotAt), reason || '-')
			scheduleQxBleNativeAlarm()
			runQxBleScheduleWakeTick(`新槽-${reason || 'retry'}`).catch((e) => {
				console.warn('[qxBle] new-slot wake', e)
			})
		}
		return
	}
	if (isQxMeasureSessionActive()) return
	const pendingSlot = readNextFireAt()
	if (pendingSlot > 0 && now >= pendingSlot - 500) {
		clearQxSlotOnDispatchFail(`下发失败-${reason || 'retry'}`, now)
		scheduleQxDispatchAfterSlotClear(`下发失败-${reason || 'retry'}`, now)
		return
	}
	const slotAt = skipQxOverdueSlotToCurrentAligned(reason)
	if (slotAt > 0 && now >= slotAt - 500) {
		if (qxMeasureInFlight) return
		// qxScheduleLog('//定时测量-逾期后按新槽位立即下发', formatSlotTime(slotAt), reason || '-')
		// console.log('//定时测量-逾期后按新槽位立即下发', formatSlotTime(slotAt), reason || '-')
		scheduleQxBleNativeAlarm()
		runQxBleScheduleWakeTick(`跳过逾期-${reason || 'retry'}`).catch((e) => {
			console.warn('[qxBle] skip-overdue wake', e)
		})
		return
	}
	if (slotAt > 0) {
		persistNextFireAt(slotAt)
		const delay = Math.max(QX_SLOT_DISPATCH_RETRY_MS, slotAt - now)
		// qxScheduleLog('//定时测量-未到点补发重试', reason || '-',
		// 	formatSlotTime(slotAt), `${Math.round(delay / 1000)}秒后`)
		// console.log('//定时测量-未到点补发重试', reason || '-',
		// 	formatSlotTime(slotAt), `${Math.round(delay / 1000)}秒后`)
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
	if (reason) {
		// console.log('//定时测量-加强后台运行', reason)
	}
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
		// console.log('//定时测量-原生槽位闹钟', `每${QX_BLE_SLOT_ALARM_POLL_SEC}秒唤醒`,
		// 	`下一槽位${formatSlotTime(nextAt)}`)
	} catch (e) {
		console.warn('[qxBle] scheduleQxBleNativeAlarm', e)
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
	jakobLifeDebugFileLog('[qxBle]', msg)
}

function formatSlotTime(ts) {
	if (!ts || !Number.isFinite(ts)) return '-'
	const local = getLocalTimeAllJSON(new Date(ts))
	return `${local.YMDHMS}`
	// return `${local.YMDHMS} ${getGMTTimezoneStrict()}`
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
		// console.warn('[qxBle] QX_DATA list empty or error', res && res.code)
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
	// console.log('//定时测量-QX_DATA已同步', JSON.stringify(getScheduleSnapshot()))
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
		console.warn('[qxBle] QX_DATA 拉取失败', e)
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
				console.warn('[qxBle] BPW6实时通信(读电量)失败', err)
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
			console.warn('[qxBle] 时间同步失败', err)
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
		// console.log('//定时测量-保留宽限内槽位', formatSlotTime(existing))
		return existing
	}
	const slot = getNextUnionAlignedSlotDate(new Date(), earliest)
	if (!slot) {
		clearNextFireAt()
		// console.log('//定时测量-无可用槽位', `间隔${readIntervalMinute()}分`)
		return 0
	}
	persistNextFireAt(slot.getTime())
	// console.log('//定时测量-下一槽位', formatSlotTime(slot.getTime()),
	// 	`间隔${readIntervalMinute()}分`)
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

/** 定时采集会话进行中（含 Main sleep_alertdisabled / inFlight / sendwatch） */
function isQxMeasureSessionActive() {
	if (isMainSleepAlertMeasureBusy()) return true
	if (qxMeasureInFlight) return true
	const sendwatch = uni.getStorageSync('sendwatch')
	if (readMeasureSlotAt() > 0 && (sendwatch === 1 || sendwatch === '1' ||
			isQxScheduledMeasureStorageOn())) {
		return true
	}
	return isQxSlotClaimActive()
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
	const measureSlot = readMeasureSlotAt()
	if (measureSlot <= 0) return false
	if (Date.now() >= measureSlot + readIntervalMs() - 500) return true
	return dueSlotAt > measureSlot + 500
}

/** 保活闹钟间隔（秒）：情绪定时固定 15 秒唤醒，检查是否到对齐槽位 */
export function getQxBleKeepAliveAlarmIntervalSec() {
	if (!isSwitchOn()) return null
	return QX_BLE_SLOT_ALARM_POLL_SEC
}

function runOneQxMeasurement(deviceId, serviceId, characteristicId, useBpw6 = null) {
	const bpw6 = useBpw6 === true || (useBpw6 !== false && isQxBpw6EmotionMode())
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
		console.warn('[qxBle] 定时测量-BPW6探测(读电量)失败，继续下发PPG', err)
	}
}

async function runOneBpw6QxMeasurement(deviceId) {
	const targetDeviceId = deviceId || readQxEmotionDeviceId()
	if (!targetDeviceId) {
		throw new Error('无BPW6设备')
	}

	// 前台：保持原逻辑（准备通道 + 等待 PPG 应答）
	if (qxAppInForeground) {
		try {
			await u16proBLE.ensureBcServiceReady(targetDeviceId, {
				force: true
			})
		} catch (err) {
			console.warn('[qxBle] BPW6 PPG通道准备失败', err)
		}
		// const result = await u16proBLE.startPPGMeasurement(targetDeviceId)
		const result = await u16proBLE.startPPGMeasurementWithDuration(60, targetDeviceId)
		if (!result || !result.success) {
			throw new Error('BPW6 PPG启动失败')
		}
		uni.setStorageSync('sendwatch', 1)
		markQxScheduledMeasureStorage()
		try {
			uni.setStorageSync('sleep_alertdisabled', true)
		} catch (e) {}
		try {
			uni.$emit('EMOTION_MEASURE_BUSY', true)
		} catch (e2) {}
		qxMeasureSessionStartedAt = Date.now()
		refreshKeepAliveNotificationIfNeeded()
		return
	}

	// 后台/黑屏：对齐 BPW1 —— 先 settle，再探测，再下发；不等 notify 应答
	await ensureQxBleBackgroundRuntime('BPW6黑屏下发前')
	await delayMs(3000)
	await probeBpw6LinkBeforeMeasure(targetDeviceId)
	await delayMs(3000)
	// 轻量保 BC notify（不 force rediscover），降低后台 0x49 status=0 拒绝概率
	try {
		await u16proBLE.ensureBcServiceReady(targetDeviceId, {
			force: false
		})
	} catch (err) {
		console.warn('[qxBle] BPW6后台PPG通道准备失败，继续下发', err)
	}

	let result = null
	try {
		// await u16proBLE.startPPGMeasurement(targetDeviceId, false)
		await u16proBLE.startPPGMeasurementWithDuration(60, targetDeviceId, false)
		result = {
			success: true
		}
		console.log('[qxBle] 后台已下发BPW6 PPG启动命令(不等应答)', targetDeviceId)
	} catch (err) {
		console.warn('[qxBle] 后台BPW6 PPG首次下发失败，重试一次', err)
		await delayMs(800)
		try {
			// await u16proBLE.startPPGMeasurement(targetDeviceId, false)
			await u16proBLE.startPPGMeasurementWithDuration(60, targetDeviceId, false)
			result = {
				success: true
			}
			console.log('[qxBle] 后台BPW6 PPG重试下发成功', targetDeviceId)
		} catch (err2) {
			const msg = String((err2 && err2.message) || err2 || '')
			if (msg.indexOf('响应超时') >= 0 || msg.indexOf('timeout') >= 0) {
				console.warn('[qxBle] 后台PPG应答超时，按已下发继续', err2)
				result = {
					success: true
				}
			} else {
				throw err2
			}
		}
	}
	if (!result || !result.success) {
		throw new Error('BPW6 PPG启动失败')
	}
	uni.setStorageSync('sendwatch', 1)
	markQxScheduledMeasureStorage()
	try {
		uni.setStorageSync('sleep_alertdisabled', true)
	} catch (e) {}
	try {
		uni.$emit('EMOTION_MEASURE_BUSY', true)
	} catch (e2) {}
	qxMeasureSessionStartedAt = Date.now()
	refreshKeepAliveNotificationIfNeeded()
}

function runOneBpw1QxMeasurement(deviceId, serviceId, characteristicId) {
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
								markQxScheduledMeasureStorage()
								qxMeasureSessionStartedAt = Date.now()
								uni.removeStorageSync('otaBP')
								refreshKeepAliveNotificationIfNeeded()
								resolve()
							})
							.catch((err) => {
								uni.removeStorageSync('otaBP')
								uni.removeStorageSync('sendwatch')
								clearQxScheduledMeasureStorage()
								reject(err)
							})
					}, 3000)
				})
				.catch((err) => {
					uni.removeStorageSync('sendwatch')
					clearQxScheduledMeasureStorage()
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
	const now = Date.now()
	let nextAt = readNextFireAt()
	if (isQxSlotOverdueAbandoned(nextAt, now) && !isQxMeasureSessionActive()) {
		nextAt = skipQxSlotIfOverdueBeyondAbandon(`心跳-${tag || '-'}`, now)
	}
	const remainSec = nextAt > 0 ? Math.max(0, Math.ceil((nextAt - now) / 1000)) : 0
	const parts = [
		'//定时测量-时段内心跳',
		tag ? `来源${tag}` : '',
		formatActiveSchedulesForLog(),
		formatNextSlotsForLog(nextAt, new Date(now)),
		`距并集槽位${remainSec}秒`
	].filter(Boolean)
	appendQxHeartbeatStatusParts(parts)
	const scheduleDev = readQxEmotionDeviceId()
	// 心跳展示：内存态 + hint；BPW6 后台用会话粘性，避免空列表误报未连接
	let bleConnected = !!scheduleDev && (!!qxBleWatchConnected || readQxBleConnectedHint(scheduleDev))
	if (!bleConnected && scheduleDev && !qxAppInForeground &&
		isSameQxBleDeviceId(scheduleDev, uni.getStorageSync('BPW6devicemac')) &&
		qxBleBpw6SessionConnected) {
		bleConnected = true
		updateQxBleWatchConnectionState(true, '心跳后台会话保显')
		try {
			uni.setStorageSync('qx_bpw6_ble_connected', true)
		} catch (e) {}
	}
	parts.push(bleConnected ? 'BLE已连接' : 'BLE未连接')
	if (isQxMeasureSessionActive()) {
		refreshKeepAliveNotificationIfNeeded()
	}
	qxScheduleLog(...parts)
	pollQxBleWatchConnectedState()
	reconcileQxScheduleBusyState()
	// 新间隔到点且上一轮未结束：判失败并执行最新槽，不补发旧槽
	if (isNewIntervalDueWhileMeasuring() && !heartbeatDueTriggerPending) {
		heartbeatDueTriggerPending = true
		const newAt = resolveQxDueSlotForDispatch()
		// qxScheduleLog('//定时测量-心跳新槽抢占', formatSlotTime(newAt), tag || '-')
		// console.log('//定时测量-心跳新槽抢占', formatSlotTime(newAt), tag || '-')
		ensureQxBleKeepAliveForBackground()
		runQxBleScheduleWakeTick('heartbeat-new-slot')
			.finally(() => {
				heartbeatDueTriggerPending = false
			})
			.catch((e) => console.warn('[qxBle] heartbeat-new-slot', e))
	} else if (nextAt > 0 && remainSec <= 0 && !isQxMeasureSessionActive() && !heartbeatDueTriggerPending) {
		heartbeatDueTriggerPending = true
		// qxScheduleLog('//定时测量-心跳到点补发', formatSlotTime(nextAt), tag || '-')
		// console.log('//定时测量-心跳到点补发', formatSlotTime(nextAt), tag || '-')
		ensureQxBleKeepAliveForBackground()
		runQxBleScheduleWakeTick('heartbeat-overdue')
			.then((r) => {
				if (r === 'dispatch-skipped') {
					scheduleQxSlotDispatchRetry('heartbeat-overdue')
				}
			})
			.finally(() => {
				heartbeatDueTriggerPending = false
			})
			.catch((e) => console.warn('[qxBle] heartbeat-overdue', e))
	} else if (nextAt > 0 && remainSec > 0 && remainSec <= 45 && !isQxScheduleMeasureBusy()) {
		scheduleQxBleNativeAlarm()
		if (remainSec <= 20) {
			ensureQxBleKeepAliveForBackground()
		}
	}
}

/** 保活每 15 秒唤醒时打心跳（后台 JS setInterval 会停） */
export function logQxBleScheduleHeartbeatFromKeepAlive() {
	if (qxMeasureInFlight) {
		acquireQxBleWakeLock()
		ensureQxBleKeepAliveForBackground()
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
	// console.log('//定时测量-设置JS定时器', `delayMs=${ms}`, `约${formatSlotTime(Date.now() + ms)}`)
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
			.catch((e) => console.warn('[qxBle] wakeTick', e))
	}, ms)
}

async function executeQxMeasurementOnce() {
	if (!isSwitchOn()) return false
	if (!isCurrentlyInScheduleWindow()) {
		return false
	}
	const target = await resolveQxMeasurementTarget()
	const dev = target.deviceId
	if (!dev) {
		console.warn('//定时测量-跳过执行', '无可用设备或未真正连接')
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
	if (!tryBeginQxSlotExecute(slotAt)) {
		return false
	}
	pauseQxBleTimeSyncForMeasure()
	refreshKeepAliveNotificationIfNeeded()
	await ensureQxBleBackgroundRuntime('下发测量前')
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
			await runOneQxMeasurement(dev, DEFAULT_SERVICE_ID, DEFAULT_CHAR_ID, target.useBpw6)
			const activeSlot = readMeasureSlotAt() || slotAt
			if (activeSlot > 0) {
				persistNextFireAt(activeSlot)
			}
			console.log('//定时测量-BLE命令已下发', `槽位${formatSlotTime(activeSlot)}`,
				`第${attempt}/${QX_SLOT_DISPATCH_MAX_ATTEMPTS}次`,
				target.useBpw6 ? 'BPW6' : 'BPW1', dev)
			startQxMeasureWatchdog()
			refreshKeepAliveNotificationIfNeeded()
			return true
		} catch (e) {
			lastError = e
			console.warn('//定时测量-测量命令下发失败',
				`槽位${formatSlotTime(slotAt)}`,
				`第${attempt}/${QX_SLOT_DISPATCH_MAX_ATTEMPTS}次`, e)
			uni.removeStorageSync('sendwatch')
			clearQxScheduledMeasureStorage()
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
	console.warn('//定时测量-三次下发失败跳过槽位', formatSlotTime(failedSlot), lastError)
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
 * 保活闹钟 / 回前台 / JS 定时器：按持久化的下次触发时间补发测量（后台熄屏不依赖 setTimeout）
 */
export async function runQxBleScheduleWakeTick(source = 'wake') {
	if (qxWakeTickInFlight) {
		return 'wake-busy'
	}
	qxWakeTickInFlight = true
	try {
		return await runQxBleScheduleWakeTickInner(source)
	} finally {
		qxWakeTickInFlight = false
	}
}

async function runQxBleScheduleWakeTickInner(source = 'wake') {
	// console.log('//定时测量-唤醒检查', `来源=${source}`, getScheduleSnapshot())
	reconcileQxMeasureInFlightState()
	if (!isSwitchOn()) {
		// qxScheduleLog('//定时测量-唤醒跳过', '开关关闭')
		// console.log('//定时测量-唤醒跳过', '开关关闭')
		return 'off'
	}
	const deviceId = readQxEmotionDeviceId()
	if (!deviceId) {
		// qxScheduleLog('//定时测量-唤醒跳过', '无deviceIdwatch')
		// console.log('//定时测量-唤醒跳过', '无deviceIdwatch')
		return 'no-device'
	}
	if (!listActiveSchedules().length) {
		// qxScheduleLog('//定时测量-唤醒跳过', '时段配置无效')
		// console.log('//定时测量-唤醒跳过', '时段配置无效')
		return 'invalid-window'
	}
	if (!isCurrentlyInScheduleWindow()) {
		clearNextFireAt()
		// qxScheduleLog('//定时测量-唤醒跳过', '当前不在时段内')
		// console.log('//定时测量-唤醒跳过', '当前不在时段内')
		return 'outside-window'
	}
	const now = Date.now()
	let nextAt = resolveQxDueSlotForDispatch(now)
	if (nextAt <= 0) {
		// console.log('//定时测量-唤醒转排程', '未设置下一槽位')
		await planNext({
			lifecycle: true
		})
		return 'needs-plan'
	}
	if (now < nextAt - 500) {
		// console.log('//定时测量-唤醒未到点', `下一槽位${formatSlotTime(nextAt)}`,
		// 	`剩余${nextAt - now}ms`)
		return 'not-due'
	}
	const overdueSec = getQxSlotOverdueSec(nextAt, now)
	if (overdueSec > 0 && overdueSec <= QX_SLOT_OVERDUE_ABANDON_MS / 1000) {
		// qxScheduleLog('//定时测量-唤醒补发逾期槽位', formatSlotTime(nextAt), `逾期${overdueSec}秒`)
		// console.log('//定时测量-唤醒补发逾期槽位', formatSlotTime(nextAt), `逾期${overdueSec}秒`)
	} else if (overdueSec > QX_SLOT_OVERDUE_ABANDON_MS / 1000) {
		// qxScheduleLog('//定时测量-唤醒跳过逾期槽位', formatSlotTime(nextAt),
		// 	`逾期${overdueSec}秒超180秒已清空`)
		// console.log('//定时测量-唤醒跳过逾期槽位', formatSlotTime(nextAt),
		// 	`逾期${overdueSec}秒超180秒已清空`)
	}
	if (isQxScheduleMeasureBusy() || isSameQxSlotAlreadyClaimed(nextAt)) {
		if (!shouldPreemptMeasureForSlot(nextAt)) {
			// qxScheduleLog('//定时测量-唤醒到点', '本轮槽位已下发，跳过重复',
			// 	`槽位${formatSlotTime(nextAt)}`,
			// 	`进行中槽位${formatSlotTime(readMeasureSlotAt())}`)
			// console.log('//定时测量-唤醒到点', '本轮槽位已下发，跳过重复',
			// 	`槽位${formatSlotTime(nextAt)}`,
			// 	`进行中槽位${formatSlotTime(readMeasureSlotAt())}`)
			return 'already-running'
		}
		// console.log('//定时测量-唤醒到点', '上一轮拖入新间隔，终止并重测',
		// 	`新槽位${formatSlotTime(nextAt)}`,
		// 	`原进行中槽位${formatSlotTime(readMeasureSlotAt())}`)
		failPreviousSlotForNewDue(nextAt, '新间隔到点抢占')
		const restarted = await executeQxMeasurementOnce()
		return restarted ? 'restarted' : 'dispatch-skipped'
	}
	// console.log('//定时测量-唤醒到点执行', `槽位${formatSlotTime(nextAt)}`)
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
	qxScheduleLog('//定时测量-系统时区变更', getGMTTimezoneStrict(), getScheduleSnapshot())
	if (!isSwitchOn()) {
		return Promise.resolve()
	}
	if (isQxMeasureSessionActive()) {
		return planNext({
			lifecycle: false
		}).catch((e) => console.warn('[qxBle] timezone planNext', e))
	}
	clearNextFireAt()
	return planNext().catch((e) => console.warn('[qxBle] timezone planNext', e))
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
		// console.log('//定时测量-planNext跳过', '排程进行中')
		return
	}
	planNextInFlight = true
	try {
		// console.log('//定时测量-planNext开始', lifecycle ? 'lifecycle' : 'normal', getScheduleSnapshot())
		if (!lifecycle || !hasOngoingQxWork()) {
			clearTimer()
		} else {
			// console.log('//定时测量-planNext', '进行中任务保留，不清理JS定时器')
		}
		await maybeRefreshQxFromServer()
		if (!isSwitchOn()) {
			stopScheduleHeartbeat()
			clearNextFireAt()
			// qxScheduleLog('//定时测量-planNext结束', '开关关闭')
			// console.log('//定时测量-planNext结束', '开关关闭')
			return
		}
		const deviceId = readQxEmotionDeviceId()
		if (!deviceId) {
			// qxScheduleLog('//定时测量-planNext', '无设备，60秒后重试')
			// console.log('//定时测量-planNext', '无设备，60秒后重试')
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		if (!listActiveSchedules().length) {
			clearNextFireAt()
			// qxScheduleLog('//定时测量-planNext', '时段无效')
			// console.log('//定时测量-planNext', '时段无效')
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		if (!isCurrentlyInScheduleWindow()) {
			stopScheduleHeartbeat()
			clearNextFireAt()
			// qxScheduleLog('//定时测量-planNext', '时段外60秒后重试')
			// console.log('//定时测量-planNext', '时段外60秒后重试')
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		const now = Date.now()
		let nextAt = readNextFireAt()
		const measureSlot = readMeasureSlotAt()
		if (shouldPreserveCurrentMeasureSlot() && measureSlot > 0) {
			persistNextFireAt(measureSlot)
			nextAt = measureSlot
			// console.log('//定时测量-保留进行中槽位', formatSlotTime(measureSlot))
		} else if (lifecycle && nextAt > now - 1000) {
			// console.log('//定时测量-保留既有下一槽位', formatSlotTime(nextAt))
		} else {
			nextAt = syncNextAlignedFireAt(null)
		}
		if (nextAt <= 0) {
			// console.log('//定时测量-planNext', '无下一槽位，60秒后重试')
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		// console.log('//定时测量-时段内对齐槽位排程', t1, t2, `间隔${readIntervalMinute()}分钟`,
		// 	`下一槽位${formatSlotTime(nextAt)}`)
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
			} else {
				// qxScheduleLog('//定时测量-planNext', '到点但本轮已下发，不重复触发',
				// 	`槽位${formatSlotTime(nextAt)}`)
				// console.log('//定时测量-planNext', '到点但本轮已下发，不重复触发',
				// 	`槽位${formatSlotTime(nextAt)}`)
			}
		}
		const delay = Math.max(0, nextAt - Date.now())
		// console.log('//定时测量-已排程', `delayMs=${delay}`, `触发约${formatSlotTime(nextAt)}`)
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
	// qxScheduleLog('//定时测量-停止调度', getScheduleSnapshot())
	// console.log('//定时测量-停止调度', getScheduleSnapshot())
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
		// console.log('//定时测量-已确保后台保活与精确闹钟')
	} catch (e) {
		console.warn('[qxBle] ensureQxBleKeepAliveForBackground', e)
	}
	// #endif
}

/** 保活原生闹钟触发：到点发测量并刷新下一槽位（后台主路径） */
export async function handleQxBleKeepAliveWake() {
	reconcileQxMeasureInFlightState()
	clearStaleQxScheduledMeasureState()
	await ensureQxBleBackgroundRuntime('保活闹钟')
	// console.log('//定时测量-保活闹钟触发', getScheduleSnapshot())
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
	// qxScheduleLog('//定时测量-应用进入后台', getScheduleSnapshot())
	// console.log('//定时测量-应用进入后台', getScheduleSnapshot())
	ensureQxBleBackgroundRuntime('熄屏/进后台')
	if (hasOngoingQxWork()) {
		// qxScheduleLog('//定时测量-后台', '测量/排程进行中，保持原生闹钟与WakeLock')
		// console.log('//定时测量-后台', '测量/排程进行中，保持原生闹钟与WakeLock')
		return
	}
	const nextAt = readNextFireAt()
	const remainSec = nextAt > 0 ? Math.ceil((nextAt - Date.now()) / 1000) : 999
	scheduleQxBleNativeAlarm()
	if (nextAt > 0 && remainSec <= 90) {
		runQxBleScheduleWakeTick('app-background-near-slot').catch((e) => console.warn('[qxBle] bg near slot', e))
	}
}

/** App 回前台：不中断测量；仅补检到点，勿全量重启排程 */
export function onQxBleAppForeground() {
	setQxBleAppForegroundState(true)
	stopQxBleTimeSyncLoop()
	if (!isSwitchOn()) return
	// qxScheduleLog('//定时测量-应用回前台', getScheduleSnapshot())
	// console.log('//定时测量-应用回前台', getScheduleSnapshot())
	reconcileQxScheduleBusyState()
	if (isQxScheduleMeasureBusy()) {
		// qxScheduleLog('//定时测量-前台', '测量进行中，等待采集结束')
		// console.log('//定时测量-前台', '测量进行中，等待采集结束')
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
		// qxScheduleLog('//定时测量-启动调度', '采集中-已清旧排程后补排', getScheduleSnapshot())
		// console.log('//定时测量-启动调度', '采集中-已清旧排程后补排', getScheduleSnapshot())
		ensureQxBleKeepAliveForBackground()
		return planNext({
			lifecycle: true
		}).catch((e) => console.warn('[qxBle] planNext', e))
	}
	qxScheduleSessionFirstRun = true
	// qxScheduleLog('//定时测量-启动调度', '全新排程', getScheduleSnapshot())
	// console.log('//定时测量-启动调度', '全新排程', getScheduleSnapshot())
	ensureQxBleKeepAliveForBackground()
	return planNext().catch((e) => console.warn('[qxBle] planNext', e))
}

/** App 启动：先尝试拉 QX_DATA 写缓存，再若开关开则恢复调度 */
export async function resumeQxBleScheduleIfEnabled() {
	initQxBleConnectionMonitor()
	// qxScheduleLog('//定时测量-尝试恢复调度')
	// console.log('//定时测量-尝试恢复调度')
	await maybeRefreshQxFromServer().catch(() => {})
	if (!isSwitchOn()) {
		// qxScheduleLog('//定时测量-恢复跳过', '开关关闭')
		// console.log('//定时测量-恢复跳过', '开关关闭')
		return
	}
	if (isQxMeasureSessionActive()) {
		clearQxBleScheduleTasks({
			preserveMeasureSession: true
		})
		// qxScheduleLog('//定时测量-恢复调度', '采集中-已清旧排程后补排')
		// console.log('//定时测量-恢复调度', '采集中-已清旧排程后补排')
		ensureQxBleKeepAliveForBackground()
		await planNext({
			lifecycle: true
		}).catch((e) => console.warn('[qxBle] planNext lifecycle', e))
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
	console.warn('[qxBle] registerQxBleWakeHandler', e)
}