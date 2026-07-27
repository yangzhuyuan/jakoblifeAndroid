// protocol/u16pro-ble-manager.js
import {
	BLE_UUID,
	BC_BLE_UUID,
	CMD,
	DATA_TYPE,
	BC_PACKET
} from './u16pro-constants.js'
import {
	U16ProProtocol
} from './u16pro-protocol.js'
import Messages from '../language.js'

function resolveI18nLocale() {
	const lan = uni.getLocale()
	switch (lan) {
		case 'en':
		case 'en-US':
			return 'en-US'
		case 'zh-Hans':
		case 'zh-Hant':
			return 'zh-CN'
		default:
			return 'en-US'
	}
}

function t(key) {
	const locale = resolveI18nLocale()
	return Messages[locale]?.[key] || Messages['zh-CN']?.[key] || key
}

class U16ProBLEManager {
	constructor() {
		this.deviceId = ''
		this.serviceId = BLE_UUID.SERVICE
		this.writeCharId = BLE_UUID.WRITE
		this.notifyCharId = BLE_UUID.NOTIFY
		this.isConnected = false
		this.isNotifying = false

		// 数据缓存
		this.state = {
			battery: 0,
			bloodPressureList: [],
			heartRateList: [],
			spO2List: [],
			dailyInfo: null,
			settings: null,
			goals: null,
			hrAutoEnabled: false,
			spO2AutoEnabled: false,
			screenOffTime: 10,
			pulseDiagnosisList: [], // 脉诊历史数据列表
			bpDynamicParams: null, // 血压动态测量参数
			ppgData: [], // PPG原始数据
			ppgDataSize: 0, // PPG数据总大小
			ppgMeasuring: false, // 是否正在PPG测量
		}

		// 心率历史快照（timestamp -> {timestamp,value}），用于实时对比「刚写入」的槽
		this._hrSnapshotMap = new Map()
		// DATA_CHANGED 到达瞬间冻结的对比基线（避免连接同步把刚测的变化吃掉）
		this._hrCompareSnapshot = null
		// 最近一次包1的当天 0:00（协议 5 分钟网格起点）
		this._hrDayStartTimestamp = 0
		this._hrRetryUsed = false

		// 读取状态
		this.readingState = {
			isReadingBPHistory: false,
			bpBuffer: [],
			expectedBPCount: 0,

			isReadingHRHistory: false,
			hrBuffer: [],
			hrTotalPackets: 0,
			hrReceivedPackets: 0,
			hrInterval: 0, // 测量间隔（分钟）
			hrBaseTimestamp: 0, // 请求的当天0点
			hrDayStartTimestamp: 0, // 包1返回的当天0:00（5分钟网格起点）
			hrLastTimestamp: 0, // 上一个数据点的结束时间戳
			hrRealtimeMode: false, // 实时测量：允许提前刷新 UI，并以手机当前墙钟对齐最新点
			hrSeedOnly: false, // 连接后只建快照不上报
			hrProgressiveEmittedTs: 0,
			hrProgressiveEmittedValue: null,
			pendingHRRead: null,
			hrScheduleTimer: null,
			hrReadTimeoutTimer: null,

			isReadingSpO2History: false,
			spO2Buffer: [],
			spO2TotalPackets: 0,
			spO2ReceivedPackets: 0,
			pendingSpO2Read: null,
			spO2ScheduleTimer: null,
			/** true：DATA_CHANGED 触发的实时读（可上报）；false：连接后历史同步（不上报） */
			spo2RealtimeMode: false,
			spo2RealtimeSeq: 0,

			isReadingPulseDiagnosis: false, // 是否正在读取脉诊数据
			pulseBuffer: [], // 脉诊数据缓冲区
			expectedPulseCount: 0, // 期望读取的条数
			lastTimestamp: 0 // 最后一条数据的时间戳，用于继续读取
		}

		// PPG读取状态（0xBC扩展协议）
		this.ppgReadingState = {
			isReading: false,
			totalSize: 0,
			buffer: [],
			currentOffset: 0
		}

		// 0xBC命令等待队列（key -> { resolve, reject, timer, acceptCmds, expectedOffset }）
		this._pendingBcRequests = {}
		this.bcReceiveBuffer = []

		// PPG自定义蓝牙服务（0xBC协议独立通道）
		this.bcServiceId = BC_BLE_UUID.SERVICE
		this.bcWriteCharId = BC_BLE_UUID.WRITE
		this.bcNotifyCharId = BC_BLE_UUID.NOTIFY
		this.bcDeviceId = ''
		this.isBcNotifying = false
		this.bcWriteType = 'writeNoResponse'
		this._bleListenerInitialized = false
		this._forwardNotifyHandler = null
		this._bcServiceReadyPromise = null
		this._lastBcNotifyTime = 0
		/** 0x49 无应答后记住，后续直接走 0x4A+时长（BPW6 首次绑定常见） */
		this._ppgPrefer4AStart = false
		this._ppgOperationLock = false
		this._ppgManagedRead = false

		// 回调函数
		this.callbacks = {
			onDataChanged: null,
			onBPHistory: null,
			onHRHistory: null,
			onSpO2History: null,
			onBPDynamicParamsChanged: null,
			onPPGMeasurement: null,
			onPPGData: null,
			onError: null,
			onConnected: null,
			onDisconnected: null
		}

		// 初始化监听器 - 使用全局监听，不依赖特定 deviceId
		this._initListener()
	}

	/**
	 * ArrayBuffer 转十六进制字符串
	 */
	ab2hex(buffer) {
		const hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr.join(' ')
	}

	// ==================== 初始化与连接 ====================

	/**
	 * 比较蓝牙 UUID（忽略大小写与连字符差异）
	 */
	_isSameBleUuid(uuidA, uuidB) {
		if (!uuidA || !uuidB) return false
		return String(uuidA).replace(/-/g, '').toUpperCase() === String(uuidB).replace(/-/g, '').toUpperCase()
	}

	/**
	 * 重置 PPG 自定义服务状态（断连/重连时调用）
	 */
	resetBcServiceState() {
		this.isBcNotifying = false
		this.bcDeviceId = ''
		this.bcServiceId = BC_BLE_UUID.SERVICE
		this.bcWriteCharId = BC_BLE_UUID.WRITE
		this.bcNotifyCharId = BC_BLE_UUID.NOTIFY
		// 对齐 Main BPW6 成功下发：优先 writeNoResponse
		this.bcWriteType = 'writeNoResponse'
		this.bcReceiveBuffer = []
		this._lastBcNotifyTime = 0
		Object.keys(this._pendingBcRequests).forEach((key) => {
			this._rejectPendingBcRequest(key, new Error('BC服务已重置'))
		})
	}

	_sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	/**
	 * 从 notify 数据中拆分多个 0xBC 包（设备可能粘包发送）
	 */
	_splitBcPackets(bytes) {
		const packets = []
		let incomplete = []
		let i = 0
		while (i < bytes.length) {
			if (bytes[i] !== BC_PACKET.HEADER) {
				i++
				continue
			}
			if (i + 4 >= bytes.length) {
				incomplete = bytes.slice(i)
				break
			}
			const dataLen = bytes[i + 2] + (bytes[i + 3] << 8)
			const packetLen = 6 + dataLen
			if (i + packetLen > bytes.length) {
				incomplete = bytes.slice(i)
				break
			}
			packets.push(bytes.slice(i, i + packetLen))
			i += packetLen
		}
		return {
			packets,
			incomplete
		}
	}

	_getPendingBcRequestKey(cmd, expectedOffset) {
		return expectedOffset !== undefined ?
			`cmd_${cmd}_offset_${expectedOffset}` :
			String(cmd)
	}

	_tryResolvePendingBcRequest(result) {
		for (const key of Object.keys(this._pendingBcRequests)) {
			const pending = this._pendingBcRequests[key]
			if (!pending) continue

			const acceptCmds = pending.acceptCmds || [pending.requestCmd]
			if (!acceptCmds.includes(result.cmd)) {
				continue
			}

			if (pending.expectedOffset !== undefined && result.cmd === CMD.PPG_GET_DATA) {
				const parsed = result.parsed || {}
				if (parsed.offset !== pending.expectedOffset) {
					console.log('【PPG】offset不匹配，继续等待', {
						expected: pending.expectedOffset,
						received: parsed.offset
					})
					continue
				}
			}

			clearTimeout(pending.timer)
			delete this._pendingBcRequests[key]
			pending.resolve(result)
			return true
		}
		if (result && result.cmd !== undefined) {
			const pendingKeys = Object.keys(this._pendingBcRequests)
			const isUnsolicitedPpgNotify = !pendingKeys.length && (
				result.cmd === CMD.PPG_MEASUREMENT_COMPLETE ||
				result.cmd === CMD.PPG_STOP
			)
			if (!isUnsolicitedPpgNotify) {
				console.warn('【PPG】收到BC应答但未匹配等待队列', {
					cmd: '0x' + result.cmd.toString(16),
					pendingKeys
				})
			}
		}
		return false
	}

	/**
	 * 设置 Main.vue 等页面的 notify 转发回调（uni-app 全局只能有一个监听）
	 */
	setForwardNotifyHandler(handler) {
		this._forwardNotifyHandler = typeof handler === 'function' ? handler : null
		this._registerUnifiedBleListener()
	}

	/**
	 * 注册统一的 BLE notify 监听（BC 协议优先，再转发给页面层）
	 */
	_registerUnifiedBleListener() {
		if (this._bleListenerInitialized) {
			return
		}
		uni.onBLECharacteristicValueChange((res) => {
			const bytes = [...new Uint8Array(res.value)]
			const hexStr = U16ProProtocol.bytesToHex(bytes)
			const serviceUpper = (res.serviceId || '').toUpperCase()
			const isBcPacket = bytes.length && bytes[0] === BC_PACKET.HEADER
			const isBcService = this._isSameBleUuid(serviceUpper, BC_BLE_UUID.SERVICE)

			if (isBcPacket || isBcService) {
				// console.log('【PPG notify】serviceId:', res.serviceId, 'data:', hexStr)
				this._lastBcNotifyTime = Date.now()
				const bcResult = this._handleBcDataReceived(bytes, res.deviceId)
				if (this._forwardNotifyHandler) {
					this._forwardNotifyHandler(res, bytes, bcResult)
				}
				return
			}

			if (this._isSameBleUuid(serviceUpper, BLE_UUID.SERVICE)) {
				const mainResult = this._handleDataReceived(res, res.deviceId)
				if (this._forwardNotifyHandler) {
					this._forwardNotifyHandler(res, bytes, mainResult)
					// 达到预期条数时设备可能不发空包，补发完成事件以便 App 结束同步并上报
					if (mainResult && mainResult._bpHistoryBatchComplete) {
						this._forwardNotifyHandler(res, bytes, {
							type: 'BP_history_empty',
							empty: true,
							count: mainResult._bpHistoryCompletedCount || 0
						})
					}
				}
				return
			}

			if (this._forwardNotifyHandler) {
				this._forwardNotifyHandler(res, bytes, null)
			}
		})
		this._bleListenerInitialized = true
	}

	/**
	 * 初始化蓝牙数据监听（全局只调用一次）
	 */
	_initListener() {
		if (this._bleListenerInitialized) {
			return
		}
		this._registerUnifiedBleListener()
	}

	/**
	 * 发送 BC 命令前确保 notify 监听有效（防止被其他页面覆盖）
	 */
	_ensureBcNotifyListenerActive() {
		this._registerUnifiedBleListener()
	}

	/**
	 * 扫描并连接设备
	 */
	async scanAndConnect(deviceNamePrefix = 'U16PRO') {
		return new Promise((resolve, reject) => {
			// 1. 初始化蓝牙
			uni.openBluetoothAdapter({
				success: () => {
					// 2. 开始扫描
					uni.startBluetoothDevicesDiscovery({
						allowDuplicatesKey: false,
						success: () => {
							console.log('开始扫描设备...')

							// 3. 监听发现设备
							uni.onBluetoothDeviceFound((res) => {
								const device = res.devices[0]
								if (device.name && device.name.includes(
										deviceNamePrefix)) {
									console.log('发现设备:', device.name, device
										.deviceId)

									// 停止扫描
									uni.stopBluetoothDevicesDiscovery()

									// 连接设备
									this._connectDevice(device.deviceId)
										.then(() => resolve(device))
										.catch(reject)
								}
							})

							// 超时处理
							setTimeout(() => {
								uni.stopBluetoothDevicesDiscovery()
								if (!this.isConnected) {
									reject(new Error('扫描超时，未找到设备'))
								}
							}, 10000)
						},
						fail: reject
					})
				},
				fail: reject
			})
		})
	}

	/**
	 * 连接指定设备
	 */
	async _connectDevice(deviceId) {
		return new Promise((resolve, reject) => {
			uni.createBLEConnection({
				deviceId,
				timeout: 10000,
				success: () => {
					console.log('设备连接成功:', deviceId)
					this.deviceId = deviceId

					// 关键修复：连接成功后重新初始化监听，确保 deviceId 正确
					this._initListener()

					// 获取服务和特征值
					setTimeout(() => {
						this._discoverServices()
							.then(() => {
								this.isConnected = true
								if (this.callbacks.onConnected) {
									this.callbacks.onConnected(deviceId)
								}
								resolve()
							})
							.catch(reject)
					}, 500)
				},
				fail: reject
			})
		})
	}

	/**
	 * 发现服务和特征值
	 */
	async _discoverServices() {
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceServices({
				deviceId: this.deviceId,
				success: (res) => {
					const service = res.services.find(s => s.uuid.toUpperCase() === this
						.serviceId.toUpperCase())
					if (!service) {
						reject(new Error('未找到指定服务'))
						return
					}

					uni.getBLEDeviceCharacteristics({
						deviceId: this.deviceId,
						serviceId: this.serviceId,
						success: (charRes) => {
							const writeChar = charRes.characteristics.find(
								c => c.uuid.toUpperCase() === this.writeCharId
								.toUpperCase() && c.properties.write
							)
							const notifyChar = charRes.characteristics.find(
								c => c.uuid.toUpperCase() === this.notifyCharId
								.toUpperCase() && (c.properties.notify || c
									.properties.indicate)
							)

							if (!writeChar || !notifyChar) {
								reject(new Error('未找到必要的特征值'))
								return
							}

							// 启用通知
							this._enableNotify()
								.then(resolve)
								.catch(reject)
						},
						fail: reject
					})
				},
				fail: reject
			})
		})
	}

	/**
	 * 启用特征值通知
	 */
	async _enableNotify() {
		return new Promise((resolve, reject) => {
			uni.notifyBLECharacteristicValueChange({
				deviceId: this.deviceId,
				serviceId: this.serviceId,
				characteristicId: this.notifyCharId,
				state: true,
				success: () => {
					console.log('通知已启用')
					this.isNotifying = true
					resolve()
				},
				fail: reject
			})
		})
	}

	// ==================== 数据接收处理 ====================

	/**
	 * 处理接收到的数据
	 */
	_handleDataReceived(res, deviceId) {
		const bytes = new Uint8Array(res.value)

		const hexStr = U16ProProtocol.bytesToHex([...bytes])
		// console.log('【接收】', hexStr)
		const result = U16ProProtocol.parseResponse([...bytes])
		// console.log('【解析结果】', result)
		if (result.error && result.error !== 'CRC校验失败') {
			console.error('解析错误:', result.error)
			if (this.callbacks.onError) this.callbacks.onError(result.error)
			return
		}
		// 分发处理
		switch (result.cmd) {
			case CMD.BP_SUCCES:
				let BP_SUCCES = {
					type: "BP_SUCCES",
					message: "【手环完成血压测量】",
				}
				return BP_SUCCES
				break
			case CMD.SET_TIME:
				let SET_TIME = {
					type: "SET_TIME",
					message: "【时间同步成功】",
				}
				return SET_TIME
				break
			case CMD.DATA_CHANGED:
				this._handleDataChanged(result.data.dataType, deviceId)
				return {
					type: "dataupdate",
						message: "【手表通知 app 有新的数据改变】",
						dataType: result.data && result.data.dataType
				}
				break
			case CMD.READ_BATTERY:
				this.state.battery = result.data.battery
				let batteryInfo = {
					type: 'battery',
					value: "电量：" + this.state.battery + "%"
				}
				return batteryInfo
				break
			case CMD.BP_MEASUREMENT:
				// console.log('【BPW6血压】:', result.data)
				return result.data
				break
			case CMD.BP_DYNAMIC_PARAMS_CHANGED:
				this.state.bpDynamicParams = result.data
				// console.log('【血压动态测量参数变更通知】:', result.data)
				if (this.callbacks.onBPDynamicParamsChanged) {
					this.callbacks.onBPDynamicParamsChanged({
						...result.data,
						deviceId
					})
				}
				return {
					type: 'bp_dynamic_params_changed',
						...result.data
				}
				break
			case CMD.SpO2_MEASUREMENT:
				// console.log('【BPW6血氧】:', result.data)
				return result.data
				break
			case CMD.READ_BP_HISTORY:
				// console.log('【BPW6血压】:', result.data)
				return this._handleBPHistoryResponse(result.data)
				break
			case CMD.READ_HR_HISTORY:
				let hrHistoryResult = this._handleHRHistoryResponse(result.data)
				// console.log('【BPW6心率】', result.data)
				return hrHistoryResult
				break
			case CMD.READ_SPO2_HISTORY: {
				const spO2HistoryResult = this._handleSpO2HistoryResponse(result.data)
				const spo2Realtime = !!this.readingState.spo2RealtimeMode
				const spo2RealtimeSeq = this.readingState.spo2RealtimeSeq || 0
				// 本轮读已结束（有完整结果或空）时清除 realtime，避免污染后续连接同步
				const spo2RoundDone = (Array.isArray(spO2HistoryResult) && spO2HistoryResult.length > 0) ||
					(spO2HistoryResult && spO2HistoryResult.type === 'SpO2_history_empty')
				if (spo2RoundDone) {
					this.readingState.spo2RealtimeMode = false
				}
				// 仅在读完一天数据后回调，避免中间包空 dataarray 干扰
				if (Array.isArray(spO2HistoryResult) && spO2HistoryResult.length > 0) {
					return {
						type: 'oxygen',
						dataarray: spO2HistoryResult,
						realtime: spo2Realtime,
						realtimeSeq: spo2RealtimeSeq
					}
				}
				if (spO2HistoryResult && spO2HistoryResult.type === 'SpO2_history_empty') {
					return {
						...spO2HistoryResult,
						realtime: spo2Realtime,
						realtimeSeq: spo2RealtimeSeq
					}
				}
				return
			}
			case CMD.READ_DAILY_INFO:
				// console.log('【处理运动/睡眠信息响应】', result.data)
				return this._handleDailyInfoResponse(result.data)
				break
			case CMD.READ_SETTINGS:
				this.state.settings = result.data
				let settingsStr = {
					type: "settings",
					message: "RRI 数据更新(心血管糖尿病健康预警数据)" + this.state.settings,
				}
				return settingsStr
				break
			case CMD.TOGGLE_HR_AUTO:
				if (result.data.isRead) {
					this.state.hrAutoEnabled = result.data.value === 0x01
				}
				let hrAutoInfo = {
					type: 'hrAutoInfo',
					hrAutoEnabled: '【BPW6自动心率】:' + this.state.hrAutoEnabled
				}
				return hrAutoInfo
				break
			case CMD.TOGGLE_SPO2_AUTO:
				if (result.data.isRead) {
					this.state.spO2AutoEnabled = result.data.value === 0x01
				}
				let spO2AutoInfo = {
					type: 'spO2AutoInfo',
					spO2AutoEnabled: '【BPW6自动血氧】:' + this.state.spO2AutoEnabled
				}
				return spO2AutoInfo
				break

			case CMD.SET_SCREEN_OFF:
				if (result.data.isRead) {
					this.state.screenOffTime = result.data.value
				}
				let SET_SCREEN_OFF = {
					type: 'SET_SCREEN_OFF',
					spO2AutoEnabled: '【息屏时间】:' + this.state.screenOffTime
				}
				return SET_SCREEN_OFF
				break
			case CMD.SET_GOALS:
				this.state.goals = result.data
				let goalsStr = {
					type: "goals",
					message: '【目标设置】:' + this.state.goals,
				}
				return goalsStr
				break
			case CMD.FIND_DEVICE:
				let FIND_DEVICE = {
					type: "FIND_DEVICE",
					message: "【查找设备】响应",
				}
				return FIND_DEVICE
				break
			case CMD.READ_PULSE_DIAGNOSIS:
				console.log('【脉诊】:', result.data)
				if (result.data.type === "pulse_empty") {
					return result.data
				} else {
					return this._handlePulseDiagnosisResponse(result.data)
				}
				break;
			case CMD.SET_BP_DYNAMIC_PARAMS:
				console.log('【血压动态测量参数】设置成功')
				return {
					type: 'bpDynamicParamsSet',
						success: true,
						message: '【血压动态测量参数】设置成功'
				}
				break
			case CMD.READ_BP_DYNAMIC_PARAMS:
				this.state.bpDynamicParams = result.data
				console.log('【血压动态测量参数】:', result.data)
				return {
					type: 'bpDynamicParams',
						...result.data
				}
				break
			default:
				let FIND_NO = {
					type: "FIND_NO",
					message: "【未处理命令】" + result.cmd + result.data,
				}
				return FIND_NO
				break
		}
	}

	/**
	 * 处理 0xBC 自定义服务响应（PPG）
	 */
	_handleBcDataReceived(bytes, deviceId) {
		const merged = [...this.bcReceiveBuffer, ...bytes]
		const {
			packets,
			incomplete
		} = this._splitBcPackets(merged)
		this.bcReceiveBuffer = incomplete

		if (!packets.length && !incomplete.length) {
			console.warn('【BC数据】无有效0xBC包', U16ProProtocol.bytesToHex(bytes))
			return
		}

		let lastResult = null
		for (const packet of packets) {
			lastResult = this._processSingleBcPacket(packet, deviceId)
		}
		return lastResult
	}

	_processSingleBcPacket(bytes, deviceId) {
		// console.log('【接收 0xBC 数据】', U16ProProtocol.bytesToHex(bytes))
		if (!bytes.length || bytes[0] !== BC_PACKET.HEADER) {
			return
		}

		const result = U16ProProtocol.parseBcResponse(bytes)

		if (result.error) {
			console.error('【BC协议解析错误】', result.error, result)
			if (this.callbacks.onError) this.callbacks.onError(result.error)
			this._rejectPendingBcRequest(String(result.cmd), new Error(result.error))
			return {
				type: 'bc_error',
				error: result.error,
				cmd: result.cmd
			}
		}

		this._tryResolvePendingBcRequest(result)

		const isPpgCmd = result.cmd === CMD.PPG_START_WITH_DURATION ||
			result.cmd === CMD.PPG_START ||
			result.cmd === CMD.PPG_STOP ||
			result.cmd === CMD.PPG_GET_SIZE ||
			result.cmd === CMD.PPG_GET_DATA ||
			result.cmd === CMD.PPG_MEASUREMENT_COMPLETE

		if (!isPpgCmd) {
			return
		}

		switch (result.cmd) {
			case CMD.PPG_START_WITH_DURATION:
			case CMD.PPG_START:
			case CMD.PPG_STOP:
				console.log('【PPG测量命令响应】', result.parsed)
				if (result.cmd === CMD.PPG_STOP && result.parsed?.success) {
					this.state.ppgMeasuring = false
				} else if ((result.cmd === CMD.PPG_START_WITH_DURATION ||
						result.cmd === CMD.PPG_START) && result.parsed?.success) {
					this.state.ppgMeasuring = true
				} else if ((result.cmd === CMD.PPG_START_WITH_DURATION ||
						result.cmd === CMD.PPG_START) && result.parsed?.success === false) {
					this.state.ppgMeasuring = false
				}
				if (this.callbacks.onPPGMeasurement) {
					this.callbacks.onPPGMeasurement({
						...result.parsed,
						cmd: result.cmd,
						deviceId
					})
				}
				return {
					cmd: result.cmd,
						...result.parsed,
						type: 'ppg_command'
				}
			case CMD.PPG_MEASUREMENT_COMPLETE:
				console.log('【PPG测量完成通知】', result.parsed)
				this.state.ppgMeasuring = false
				if (this.callbacks.onPPGMeasurement) {
					this.callbacks.onPPGMeasurement({
						...result.parsed,
						cmd: result.cmd,
						completed: true,
						deviceId
					})
				}
				return {
					cmd: result.cmd,
						...result.parsed,
						type: 'ppg_measurement_complete'
				}
			case CMD.PPG_GET_SIZE:
				console.log('【PPG数据大小】', result.parsed)
				this.state.ppgDataSize = result.parsed.size || 0
				return {
					...result.parsed,
						type: 'ppg_size'
				}
			case CMD.PPG_GET_DATA:
				return this._handlePPGChunkResponse(result.parsed, deviceId)
		}
	}

	/**
	 * 处理 PPG 数据块响应
	 */
	_handlePPGChunkResponse(parsed, deviceId) {
		if (parsed.error) {
			console.error('【PPG数据块错误】', parsed.error)
			this._resetPPGReadingState()
			if (this.callbacks.onError) this.callbacks.onError(parsed.error)
			return {
				type: 'ppg_chunk_error',
				error: parsed.error
			}
		}

		if (this.ppgReadingState.isReading) {
			this.ppgReadingState.buffer.push(...parsed.ppgData)
			this.ppgReadingState.currentOffset = parsed.offset + parsed.chunkSize
		}
		const isComplete = this.ppgReadingState.isReading &&
			(this.ppgReadingState.currentOffset >= this.ppgReadingState.totalSize ||
				parsed.chunkSize === 0)

		if (isComplete) {
			this.state.ppgData = [...this.ppgReadingState.buffer]
			const finalResult = {
				type: this._ppgManagedRead ? 'ppg_chunk' : 'ppg_data',
				size: this.state.ppgData.length,
				ppgData: this.state.ppgData,
				completed: true,
				managedRead: this._ppgManagedRead
			}

			if (!this._ppgManagedRead && this.callbacks.onPPGData) {
				this.callbacks.onPPGData({
					...finalResult,
					deviceId
				})
			}

			this._resetPPGReadingState()
			return finalResult
		}

		return {
			type: 'ppg_chunk',
			...parsed,
			totalReceived: this.ppgReadingState.buffer.length
		}
	}

	_resolvePendingBcRequest(cmd, result) {
		const pending = this._pendingBcRequests[cmd]
		if (!pending) return
		clearTimeout(pending.timer)
		delete this._pendingBcRequests[cmd]
		pending.resolve(result)
	}

	_rejectPendingBcRequest(key, error) {
		const pending = this._pendingBcRequests[key]
		if (!pending) return
		clearTimeout(pending.timer)
		delete this._pendingBcRequests[key]
		pending.reject(error)
	}

	_waitForBcResponse(cmd, options = {}) {
		const {
			timeout = 10000,
				acceptCmds = [cmd],
				expectedOffset
		} = options
		const key = this._getPendingBcRequestKey(cmd, expectedOffset)

		return new Promise((resolve, reject) => {
			if (this._pendingBcRequests[key]) {
				clearTimeout(this._pendingBcRequests[key].timer)
			}
			const timer = setTimeout(() => {
				delete this._pendingBcRequests[key]
				const offsetHint = expectedOffset !== undefined ? ` offset=${expectedOffset}` : ''
				reject(new Error(`BC命令0x${cmd.toString(16)}${offsetHint}响应超时`))
			}, timeout)
			this._pendingBcRequests[key] = {
				resolve,
				reject,
				timer,
				acceptCmds,
				expectedOffset,
				requestCmd: cmd
			}
		})
	}

	_resetPPGReadingState() {
		this.ppgReadingState.isReading = false
		this.ppgReadingState.totalSize = 0
		this.ppgReadingState.buffer = []
		this.ppgReadingState.currentOffset = 0
	}

	/**
	 * 处理数据改变通知 (0x73)
	 */
	_handleDataChanged(dataType, deviceId) {
		const typeMap = {
			[DATA_TYPE.HEART_RATE]: '心率',
			[DATA_TYPE.BLOOD_PRESSURE]: '血压',
			[DATA_TYPE.BLOOD_OXYGEN]: '血氧',
			[DATA_TYPE.STEPS]: '计步',
			[DATA_TYPE.TEMPERATURE]: '脉诊',
			[DATA_TYPE.SLEEP]: '睡眠',
			[DATA_TYPE.SPORT]: '运动记录',
			[DATA_TYPE.ALARM]: '闹钟',
			[DATA_TYPE.DISTURB]: '勿扰设置',
			[DATA_TYPE.RECORD]: '录音',
			[DATA_TYPE.TIME_FORMAT]: '时间格式',
			[DATA_TYPE.BATTERY]: '电量'
		}

		const typeName = typeMap[dataType] || '未知'
		console.log(`【数据改变通知】${typeName} 有更新`, dataType)

		// 根据类型自动获取数据
		switch (dataType) {
			case DATA_TYPE.BLOOD_PRESSURE:
				// 连续/动态测量有新数据：只拉最新1条，避免与历史同步冲突导致无法实时显示上报
				if (this.readingState.isReadingBPHistory) {
					if (this.readingState.bpBuffer.length >= (this.readingState.expectedBPCount || 0) &&
						this.readingState.expectedBPCount > 0) {
						this.readingState.isReadingBPHistory = false
					} else {
						console.log('【数据改变通知】血压历史读取中，跳过本次拉取')
						break
					}
				}
				this.readLatestBPHistory(1, deviceId).catch(err => {
					console.warn('【数据改变通知】血压最新数据拉取失败', err)
				})
				break
			case DATA_TYPE.HEART_RATE:
				// 通知瞬间冻结基线；新一次测量允许再重读一次
				this._hrRetryUsed = false
				this._freezeHrCompareSnapshot()
				this.scheduleReadLatestHRHistory(deviceId, {
					realtime: true
				})
				break
			case DATA_TYPE.BLOOD_OXYGEN:
				// 参考实现：延迟再读；忙碌则结束后补读
				this._scheduleSpO2HistoryRead(deviceId)
				break
			case DATA_TYPE.BATTERY:
				this.readBattery(deviceId)
				break
			case DATA_TYPE.TEMPERATURE: // 脉诊数据
				this.readLatestPulseDiagnosis(1000, deviceId)
				break
			case DATA_TYPE.STEPS:
			case DATA_TYPE.SLEEP:
				this.readDailyInfo(0, deviceId)
				break

		}

		// 触发回调
		if (this.callbacks.onDataChanged) {
			this.callbacks.onDataChanged({
				type: dataType,
				typeName,
				deviceId
			})
		}
	}

	/**
	 * 处理心率历史数据响应
	 * @param {Object} data - 解析后的心率数据包
	 */
	_handleHRHistoryResponse(data) {
		// 无数据响应
		if (data.empty) {
			console.log('【心率历史】该日期无数据')
			this.readingState.isReadingHRHistory = false
			if (this.callbacks.onHRHistory) {
				this.callbacks.onHRHistory({
					list: [],
					allList: this.state.heartRateList,
					completed: true,
					totalCount: 0,
					interval: this.readingState.hrInterval,
					empty: true
				})
			}
			this._resetHRReadingState()
			this._flushPendingHRHistoryReadSoon()
			return {
				type: 'HR_history_empty',
				empty: true
			}
		}
		// 有数据交互时刷新超时，避免大包读取中途被误杀
		this._armHRReadTimeout()
		// 索引包
		if (data.isIndex) {
			this.readingState.isReadingHRHistory = true
			this.readingState.hrTotalPackets = data.totalPackets
			this.readingState.hrInterval = data.interval
			this.readingState.hrReceivedPackets = 0
			this.readingState.hrBuffer = []
			this.readingState.hrLastTimestamp = 0
			return {
				type: 'HR_history_index',
				totalPackets: data.totalPackets,
				interval: data.interval
			}
		}
		// 数据包
		if (!data.hrData || data.hrData.length === 0) {
			console.log('【心率历史】包', data.packetIndex, '无数据')
			return
		}
		const intervalSeconds = this.readingState.hrInterval * 60
		let packetStartTimestamp = 0
		if (data.packetIndex === 1) {
			// 包1：时间戳 = 当天 0:00（协议网格起点）
			packetStartTimestamp = data.timestamp
			this.readingState.hrLastTimestamp = packetStartTimestamp
			this.readingState.hrDayStartTimestamp = packetStartTimestamp
			this._hrDayStartTimestamp = packetStartTimestamp
		} else {
			// 包2及以后：基于上一个包的结束时间计算
			if (this.readingState.hrLastTimestamp > 0) {
				let prevPacketDataCount = (data.packetIndex === 2) ? 9 : 13
				packetStartTimestamp = this.readingState.hrLastTimestamp + (prevPacketDataCount * intervalSeconds)
				this.readingState.hrLastTimestamp = packetStartTimestamp
			} else {
				packetStartTimestamp = this.readingState.hrBaseTimestamp || 0
				this.readingState.hrLastTimestamp = packetStartTimestamp
			}
		}
		let lastValidIndex = -1
		for (let i = data.hrData.length - 1; i >= 0; i--) {
			if (data.hrData[i] !== null && data.hrData[i] > 0) {
				lastValidIndex = i
				break
			}
		}
		for (let i = 0; i < data.hrData.length; i++) {
			const value = data.hrData[i]
			// 协议：0 表示无数据
			if (value !== null && value > 0) {
				const offsetSeconds = i * intervalSeconds
				const actualTimestamp = packetStartTimestamp + offsetSeconds
				const date = new Date(actualTimestamp * 1000)
				const dataItem = {
					timestamp: actualTimestamp,
					value: value,
					timeStr: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
					packetIndex: data.packetIndex,
					indexInPacket: i,
				}
				if (i === lastValidIndex) {
					const updateDate = new Date()
					dataItem.updateTime = Date.now()
					dataItem.updateTimeStr =
						`${updateDate.getFullYear()}-${String(updateDate.getMonth() + 1).padStart(2, '0')}-${String(updateDate.getDate()).padStart(2, '0')} ${String(updateDate.getHours()).padStart(2, '0')}:${String(updateDate.getMinutes()).padStart(2, '0')}:${String(updateDate.getSeconds()).padStart(2, '0')}`
				}
				this.readingState.hrBuffer.push(dataItem)
			}
		}
		this.readingState.hrReceivedPackets++
		// 实时模式：每包都尝试提前刷新最新值，不必等整天读完
		const progressive = this._buildProgressiveHRResult()
		if (this.readingState.hrReceivedPackets >= this.readingState.hrTotalPackets - 1) {
			return this._finalizeHRHistoryRead()
		}
		return progressive
	}

	/**
	 * 实时读取过程中提前抛出当前缓冲内最新心率，加快卡片显示
	 */
	_buildProgressiveHRResult() {
		if (!this.readingState.hrRealtimeMode) {
			return
		}
		const buffer = this.readingState.hrBuffer
		if (!buffer || buffer.length === 0) {
			return
		}
		const nowSec = Math.floor(Date.now() / 1000)
		let latestNear = null
		let latestFresh = null
		let latestAny = null
		for (let i = 0; i < buffer.length; i++) {
			const item = buffer[i]
			if (!item || item.value == null || item.value === '') {
				continue
			}
			if (!latestAny || item.timestamp > latestAny.timestamp ||
				(item.timestamp === latestAny.timestamp &&
					(item.updateTime || 0) >= (latestAny.updateTime || 0))) {
				latestAny = item
			}
			// 近 30 分钟槽：优先上屏
			if (item.timestamp >= nowSec - 30 * 60) {
				if (!latestNear || item.timestamp > latestNear.timestamp ||
					(item.timestamp === latestNear.timestamp &&
						(item.updateTime || 0) >= (latestNear.updateTime || 0))) {
					latestNear = item
				}
			}
			// 本包刚写入(updateTime)且在 2 小时内：自动心率关闭时也能尽快上屏
			if (item.updateTime && (nowSec - item.timestamp) <= 2 * 3600) {
				if (!latestFresh || item.timestamp > latestFresh.timestamp ||
					(item.timestamp === latestFresh.timestamp &&
						(item.updateTime || 0) >= (latestFresh.updateTime || 0))) {
					latestFresh = item
				}
			}
		}
		const latest = latestNear || latestFresh
		if (!latest) {
			return
		}
		const prevTs = this.readingState.hrProgressiveEmittedTs || 0
		const prevVal = this.readingState.hrProgressiveEmittedValue
		if (latest.timestamp < prevTs) {
			return
		}
		if (latest.timestamp === prevTs && String(latest.value) === String(prevVal)) {
			return
		}
		this.readingState.hrProgressiveEmittedTs = latest.timestamp
		this.readingState.hrProgressiveEmittedValue = latest.value
		return {
			type: 'heartRate',
			allList: [latest],
			latestRealtime: latest,
			progressive: true
		}
	}

	_cloneHrSnapshotMap(src) {
		const out = new Map()
		if (!(src instanceof Map)) {
			return out
		}
		src.forEach((v, k) => {
			out.set(k, {
				timestamp: v.timestamp,
				value: v.value
			})
		})
		return out
	}

	_freezeHrCompareSnapshot() {
		// 只冻第一次通知时的基线；合并多次 DATA_CHANGED 时保持测量前快照
		if (this._hrCompareSnapshot instanceof Map && this._hrCompareSnapshot.size > 0) {
			return
		}
		const base = this._hrSnapshotMap instanceof Map ? this._hrSnapshotMap : new Map()
		this._hrCompareSnapshot = this._cloneHrSnapshotMap(base)
		console.log('【心率历史】冻结对比基线', this._hrCompareSnapshot.size)
	}
	_pickMaxTsHr(list) {
		if (!list || !list.length) {
			return null
		}
		let best = list[0]
		for (let i = 1; i < list.length; i++) {
			if ((list[i].timestamp || 0) >= (best.timestamp || 0)) {
				best = list[i]
			}
		}
		return best
	}

	_getSnapshotFrontier(prevMap) {
		let maxTs = 0
		let maxItem = null
		if (!(prevMap instanceof Map)) {
			return {
				maxTs: 0,
				maxItem: null
			}
		}
		prevMap.forEach((v, ts) => {
			if (ts >= maxTs) {
				maxTs = ts
				maxItem = v
			}
		})
		return {
			maxTs,
			maxItem
		}
	}

	/**
	 * 按协议 5 分钟网格，计算手机本地「当前理想槽」时间戳
	 */
	_getIdealHrSlotTs() {
		const intervalMin = this.readingState.hrInterval > 0 ? this.readingState.hrInterval : 5
		const intervalSec = intervalMin * 60
		const dayStart = this.readingState.hrDayStartTimestamp ||
			this._hrDayStartTimestamp ||
			this.readingState.hrBaseTimestamp || 0
		if (!dayStart) {
			return null
		}
		const now = new Date()
		const localMinutes = now.getHours() * 60 + now.getMinutes()
		const slotIndex = Math.floor(localMinutes / intervalMin)
		return {
			dayStart,
			slotIndex,
			idealTs: dayStart + slotIndex * intervalSec,
			intervalSec,
			intervalMin
		}
	}

	/**
	 * 在变化点中选最可信的一条：优先靠近理想槽，其次时间戳最大
	 */
	_pickBestChangedHr(changedAll, idealTs, intervalSec) {
		if (!changedAll || !changedAll.length) {
			return null
		}
		if (changedAll.length === 1) {
			return changedAll[0]
		}
		const limit = (intervalSec || 300) * 6
		let nearBest = null
		let nearDist = Infinity
		for (let i = 0; i < changedAll.length; i++) {
			const c = changedAll[i]
			const dist = Math.abs((c.timestamp || 0) - (idealTs || 0))
			if (dist < nearDist) {
				nearDist = dist
				nearBest = c
			}
		}
		if (nearBest && nearDist <= limit) {
			return nearBest
		}
		return this._pickMaxTsHr(changedAll)
	}

	/**
	 * 实时读完（DATA_CHANGED 后）：优先取「相对冻结快照真正变化」的点
	 * 理想槽仅在自身发生变化时优先；若理想槽未变却有其它变化点（设备时钟/时区偏差），
	 * 必须用变化点，否则会显示并上报上一次槽位的旧值
	 * 同槽同值去重由 Main 对照本地/服务端缓存处理
	 */
	_findRealtimeChangedHr(uniqueList) {
		if (!uniqueList || uniqueList.length === 0) {
			return {
				item: null,
				skipUpload: true
			}
		}
		const prevMap = (this._hrCompareSnapshot instanceof Map && this._hrCompareSnapshot.size > 0) ?
			this._hrCompareSnapshot :
			(this._hrSnapshotMap instanceof Map ? this._hrSnapshotMap : new Map())
		const tail = uniqueList[uniqueList.length - 1]
		const ideal = this._getIdealHrSlotTs()

		const valueChanged = []
		const newlyAppeared = []
		for (let i = 0; i < uniqueList.length; i++) {
			const item = uniqueList[i]
			if (!item || item.value == null || item.value === '') {
				continue
			}
			const prev = prevMap.get(item.timestamp)
			if (!prev) {
				newlyAppeared.push(item)
			} else if (String(prev.value) !== String(item.value)) {
				valueChanged.push(item)
			}
		}
		const changedAll = valueChanged.concat(newlyAppeared)

		if (ideal) {
			const byTs = new Map()
			for (let i = 0; i < uniqueList.length; i++) {
				const it = uniqueList[i]
				if (it && it.timestamp != null) {
					byTs.set(it.timestamp, it)
				}
			}
			const atIdeal = byTs.get(ideal.idealTs)
			const prevIdeal = prevMap.get(ideal.idealTs)
			const idealChanged = !!(atIdeal && (!prevIdeal ||
				String(prevIdeal.value) !== String(atIdeal.value)))
			console.log('【心率历史】当前5分钟槽', {
				dayStart: ideal.dayStart,
				slotIndex: ideal.slotIndex,
				idealTs: ideal.idealTs,
				atIdeal: atIdeal ? atIdeal.value : null,
				prevIdeal: prevIdeal ? prevIdeal.value : null,
				idealChanged,
				changedCount: changedAll.length
			})

			// 1) 理想槽相对快照有变化 → 最可信
			if (idealChanged) {
				console.log('【心率历史】选用理想槽上报', atIdeal.timestamp, atIdeal.value)
				return {
					item: atIdeal,
					skipUpload: false
				}
			}

			// 2) 理想槽未变，但有其它变化点（常见于手表时钟与手机槽位不一致）
			if (changedAll.length >= 1) {
				const best = this._pickBestChangedHr(changedAll, ideal.idealTs, ideal.intervalSec)
				if (best) {
					console.log('【心率历史】理想槽未变，选用变化点', best.timestamp, best.value, {
						idealTs: ideal.idealTs,
						atIdeal: atIdeal ? atIdeal.value : null
					})
					return {
						item: best,
						skipUpload: false
					}
				}
			}

			// 3) 理想槽有值且无任何变化：仍交由 Main 做同值去重上报
			if (atIdeal) {
				console.log('【心率历史】选用理想槽上报(无变化)', atIdeal.timestamp, atIdeal.value)
				return {
					item: atIdeal,
					skipUpload: false
				}
			}

			// 理想槽尚未写入：重读一次
			console.log('【心率历史】理想槽为空，请求重读', ideal.idealTs)
			return {
				item: tail,
				skipUpload: true,
				needRetry: true
			}
		}

		if (changedAll.length >= 1 && changedAll.length <= 8) {
			const best = this._pickMaxTsHr(changedAll)
			console.log('【心率历史】无理想槽信息，选用变化点', best.timestamp, best.value)
			return {
				item: best,
				skipUpload: false
			}
		}

		console.log('【心率历史】无法定位上报点，跳过', {
			changed: changedAll.length,
			points: uniqueList.length
		})
		return {
			item: tail,
			skipUpload: true
		}
	}

	/**
	 * 完成心率历史读取
	 */
	_finalizeHRHistoryRead() {
		const totalHrValues = this.readingState.hrBuffer.length
		const wasRealtime = !!this.readingState.hrRealtimeMode
		const wasSeedOnly = !!this.readingState.hrSeedOnly
		this.readingState.hrBuffer.sort((a, b) => a.timestamp - b.timestamp)
		const uniqueMap = new Map()
		for (const item of this.readingState.hrBuffer) {
			const prev = uniqueMap.get(item.timestamp)
			if (!prev) {
				uniqueMap.set(item.timestamp, item)
				continue
			}
			const prevUpdate = prev.updateTime || 0
			const itemUpdate = item.updateTime || 0
			if (itemUpdate > prevUpdate) {
				uniqueMap.set(item.timestamp, item)
			} else if (itemUpdate === prevUpdate) {
				uniqueMap.set(item.timestamp, item)
			}
		}
		const uniqueList = Array.from(uniqueMap.values()).sort((a, b) => a.timestamp - b.timestamp)
		if (uniqueList.length !== totalHrValues) {
			console.log('【心率历史】去重:', totalHrValues, '->', uniqueList.length)
		}

		const found = wasRealtime ? this._findRealtimeChangedHr(uniqueList) : {
			item: null,
			skipUpload: true
		}
		const latestRealtime = found.item
		if (latestRealtime) {
			latestRealtime.updateTime = Date.now()
		}

		const needRetry = !!(wasRealtime && found && found.needRetry && !this._hrRetryUsed)
		const retryDeviceId = this.deviceId

		// 覆盖快照与列表，禁止无限累加
		const snap = new Map()
		for (let i = 0; i < uniqueList.length; i++) {
			const item = uniqueList[i]
			if (item && item.timestamp != null) {
				snap.set(item.timestamp, {
					timestamp: item.timestamp,
					value: item.value
				})
			}
		}
		// 待重读时保留冻结基线，且不把未写完的结果盖进对比快照
		if (needRetry) {
			console.log('【心率历史】保留冻结基线并安排重读')
		} else if (!(wasSeedOnly && this._hrCompareSnapshot instanceof Map)) {
			this._hrSnapshotMap = snap
		} else {
			console.log('【心率历史】seed 不同步覆盖快照（已有测量冻结基线）')
		}
		this.state.heartRateList = uniqueList
		if (wasRealtime && !needRetry) {
			this._hrCompareSnapshot = null
			this._hrRetryUsed = false
		}

		const skipUpload = !!(found && found.skipUpload) || wasSeedOnly || needRetry
		if (this.callbacks.onHRHistory) {
			this.callbacks.onHRHistory({
				list: uniqueList,
				allList: uniqueList,
				latestRealtime,
				skipUpload,
				completed: true,
				totalCount: uniqueList.length,
				interval: this.readingState.hrInterval
			})
		}
		this._resetHRReadingState()
		if (needRetry && retryDeviceId) {
			this._hrRetryUsed = true
			this.readingState.pendingHRRead = {
				deviceId: retryDeviceId,
				options: {
					realtime: true,
					isRetry: true
				}
			}
			if (this.readingState.hrScheduleTimer) {
				clearTimeout(this.readingState.hrScheduleTimer)
			}
			this.readingState.hrScheduleTimer = setTimeout(() => {
				this.readingState.hrScheduleTimer = null
				this.flushPendingHRHistoryRead()
			}, 2500)
		} else if (wasRealtime) {
			this.readingState.pendingHRRead = null
			if (this.readingState.hrScheduleTimer) {
				clearTimeout(this.readingState.hrScheduleTimer)
				this.readingState.hrScheduleTimer = null
			}
		} else {
			this._flushPendingHRHistoryReadSoon()
		}
		return {
			type: 'heartRate',
			allList: uniqueList,
			latestRealtime,
			skipUpload
		}
	}

	/**
	 * 重置心率读取状态（保留 pending / 定时器，便于测完后补拉）
	 */
	_resetHRReadingState() {
		if (this.readingState.hrReadTimeoutTimer) {
			clearTimeout(this.readingState.hrReadTimeoutTimer)
			this.readingState.hrReadTimeoutTimer = null
		}
		this.readingState.isReadingHRHistory = false
		this.readingState.hrBuffer = []
		this.readingState.hrTotalPackets = 0
		this.readingState.hrReceivedPackets = 0
		this.readingState.hrInterval = 0
		this.readingState.hrBaseTimestamp = 0
		this.readingState.hrDayStartTimestamp = 0
		this.readingState.hrLastTimestamp = 0
		this.readingState.hrRealtimeMode = false
		this.readingState.hrSeedOnly = false
		this.readingState.hrProgressiveEmittedTs = 0
		this.readingState.hrProgressiveEmittedValue = null
	}

	_armHRReadTimeout(deviceId) {
		if (this.readingState.hrReadTimeoutTimer) {
			clearTimeout(this.readingState.hrReadTimeoutTimer)
		}
		this.readingState.hrReadTimeoutTimer = setTimeout(() => {
			this.readingState.hrReadTimeoutTimer = null
			if (!this.readingState.isReadingHRHistory) {
				return
			}
			console.warn('【心率历史】读取超时，强制结束以免后续测量卡住')
			this._resetHRReadingState()
			this._flushPendingHRHistoryReadSoon()
		}, 30000)
	}

	/**
	 * 调度读取最新心率（可合并短时间内的多次数据变更通知）
	 */
	scheduleReadLatestHRHistory(deviceId, options = {}) {
		this.readingState.pendingHRRead = {
			deviceId,
			options: options || {}
		}
		// 实时测量到来时，打断非实时的整日历史读取，避免测完后久等
		if (options.realtime && this.readingState.isReadingHRHistory && !this.readingState.hrRealtimeMode) {
			console.log('【心率历史】打断整日同步，优先拉取实时心率')
			this._resetHRReadingState()
		}
		if (this.readingState.hrScheduleTimer) {
			clearTimeout(this.readingState.hrScheduleTimer)
		}
		const delayMs = options.realtime ? (options.isRetry ? 0 : 300) : 0
		this.readingState.hrScheduleTimer = setTimeout(() => {
			this.readingState.hrScheduleTimer = null
			this.flushPendingHRHistoryRead()
		}, delayMs)
	}

	_flushPendingHRHistoryReadSoon() {
		setTimeout(() => this.flushPendingHRHistoryRead(), 50)
	}

	flushPendingHRHistoryRead() {
		const pending = this.readingState.pendingHRRead
		if (!pending || !pending.deviceId) {
			return
		}
		if (this.readingState.isReadingHRHistory) {
			return
		}
		this.readingState.pendingHRRead = null
		this.readLatestHRHistory(pending.deviceId, pending.options || {}).catch(err => {
			const msg = err && err.message ? err.message : String(err)
			console.warn('【心率历史】调度读取失败', msg)
			if (msg.indexOf('正在读取') >= 0) {
				this.readingState.pendingHRRead = pending
			}
		})
	}

	/**
	 * 处理血压历史响应
	 */
	_handleBPHistoryResponse(data) {
		if (data.empty) {
			const completedCount = this.readingState.bpBuffer.length
			console.log('【血压历史】读取完成，共', completedCount, '条')
			this.readingState.isReadingBPHistory = false
			this.state.bloodPressureList = [...this.readingState.bpBuffer, ...this.state.bloodPressureList]
			if (this.callbacks.onBPHistory) {
				this.callbacks.onBPHistory({
					list: this.readingState.bpBuffer,
					allList: this.state.bloodPressureList,
					completed: true
				})
			}
			this.readingState.bpBuffer = []
			return {
				type: 'BP_history_empty',
				empty: true,
				count: completedCount
			}
		}

		this.readingState.bpBuffer.push(data)
		// console.log('【血压历史】收到第', this.readingState.bpBuffer.length, '条:', data)
		if (this.readingState.expectedBPCount > 0 &&
			this.readingState.bpBuffer.length >= this.readingState.expectedBPCount) {
			const completedCount = this.readingState.bpBuffer.length
			console.log('【血压历史】已达到预期数量，停止接收', completedCount)
			this.readingState.isReadingBPHistory = false
			this.state.bloodPressureList = [...this.readingState.bpBuffer, ...this.state.bloodPressureList]
			if (this.callbacks.onBPHistory) {
				this.callbacks.onBPHistory({
					list: this.readingState.bpBuffer,
					allList: this.state.bloodPressureList,
					completed: true
				})
			}
			this.readingState.bpBuffer = []
			// 标记批次完成，由统一监听补发 BP_history_empty（部分固件不发空结束包）
			return {
				...data,
				_bpHistoryBatchComplete: true,
				_bpHistoryCompletedCount: completedCount
			}
		}
		return data
	}
	/**
	 * 处理血氧历史响应
	 */
	_handleSpO2HistoryResponse(data) {
		if (data.empty) {
			console.log('【血氧历史】该日期无数据')
			this.readingState.isReadingSpO2History = false
			if (this.callbacks.onSpO2History) {
				this.callbacks.onSpO2History({
					list: [],
					completed: true,
					empty: true
				})
			}
			this._flushPendingSpO2Reread()
			return {
				type: 'SpO2_history_empty',
				empty: true
			}
		}

		if (data.isIndex) {
			this.readingState.spO2TotalPackets = data.totalPackets || 0
			this.readingState.spO2ReceivedPackets = 0
			this.readingState.spO2Buffer = []
			this.readingState.spO2BaseTimestamp = 0
			this.readingState.spO2Interval = data.interval || 60
			this.state.spO2List = []
			if (data.totalPackets <= 1) {
				console.log('【血氧历史】无数据包，读取完成')
				this.readingState.isReadingSpO2History = false
				if (this.callbacks.onSpO2History) {
					this.callbacks.onSpO2History({
						list: [],
						completed: true
					})
				}
				this._flushPendingSpO2Reread()
				return {
					type: 'SpO2_history_empty',
					empty: true
				}
			}
			return
		}
		this.readingState.spO2ReceivedPackets++
		if (data.packetIndex === 0x01) {
			this.readingState.spO2BaseTimestamp = data.timestamp
		}
		const baseTimestamp = this.readingState.spO2BaseTimestamp

		if (!baseTimestamp && data.packetIndex !== 0x01) {
			console.error('【血氧历史】错误：收到后续数据包但无基础时间戳！')
			return
		}
		// 0x01: 0~8；0x02: 9~21；0x03: 22~23
		let startHour = 0
		if (data.packetIndex === 0x01) {
			startHour = 0
		} else if (data.packetIndex === 0x02) {
			startHour = 9
		} else if (data.packetIndex === 0x03) {
			startHour = 22
		} else {
			startHour = 9 + (data.packetIndex - 2) * 14
		}
		data.spo2Data.forEach((item) => {
			const hour = startHour + item.index
			if (hour >= 24) return
			const itemTimestamp = baseTimestamp + hour * 3600
			this.state.spO2List.push({
				timestamp: itemTimestamp,
				date: this.getCurrentTime(),
				spO2: item.value,
				hour: hour,
				packetIndex: data.packetIndex,
			})
		})
		if (this.readingState.spO2ReceivedPackets >= this.readingState.spO2TotalPackets - 1) {
			const spo2ByTimestamp = new Map()
			for (const item of this.state.spO2List) {
				const prev = spo2ByTimestamp.get(item.timestamp)
				if (!prev || (item.updateTime || 0) >= (prev.updateTime || 0)) {
					spo2ByTimestamp.set(item.timestamp, item)
				}
			}
			this.state.spO2List = Array.from(spo2ByTimestamp.values()).sort((a, b) => a.timestamp - b.timestamp)
			if (this.state.spO2List.length > 0) {
				const latest = this.state.spO2List[this.state.spO2List.length - 1]
				latest.updateTime = Date.now()
				latest.updateTimeStr = this.getCurrentTime()
			}
			console.log('【血氧历史】完成，共', this.state.spO2List.length, '条')
			this.readingState.isReadingSpO2History = false
			if (this.callbacks.onSpO2History) {
				this.callbacks.onSpO2History({
					list: this.state.spO2List,
					completed: true,
					totalCount: this.state.spO2List.length
				})
			}
			const completedList = this.state.spO2List
			this._flushPendingSpO2Reread()
			return completedList
		}
	}

	_flushPendingSpO2Reread() {
		if (!this._spo2HistoryRereadAfterDone) {
			return
		}
		this._spo2HistoryRereadAfterDone = false
		const rerereadId = this._spo2HistoryPendingDeviceId
		const realtime = this._spo2HistoryPendingRealtime !== false
		setTimeout(() => {
			this.readLatestSpO2History(rerereadId, {
				realtime
			}).catch(err => {
				console.warn('【血氧】补读历史失败:', err && err.message ? err.message : err)
			})
		}, 300)
	}

	//时间格式YYYY-MM-DD hh:mm:ss
	getCurrentTime() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	/**
	 * 处理运动/睡眠信息响应
	 */
	_handleDailyInfoResponse(data) {
		if (!this.state.dailyInfo) this.state.dailyInfo = {}
		if (data.type === 'activity') {
			this.state.dailyInfo.activity = data
			// console.log('【日常信息-运动】:', data)
		} else if (data.type === 'sleep') {
			this.state.dailyInfo.sleep = data
			// console.log('【日常信息-睡眠】:', data)
		} else {
			console.log('【日常信息】:', data)
		}
		return data
	}


	/**
	 * 处理脉诊数据响应
	 */
	_handlePulseDiagnosisResponse(data) {
		// 无数据响应
		if (data.empty) {
			console.log('【脉诊历史】该日期无数据或已读取完毕')
			this.readingState.isReadingPulseDiagnosis = false

			if (this.callbacks.onPulseDiagnosis) {
				this.callbacks.onPulseDiagnosis({
					list: this.readingState.pulseBuffer,
					allList: this.state.pulseDiagnosisList,
					completed: true,
					totalCount: this.readingState.pulseBuffer.length,
					empty: this.readingState.pulseBuffer.length === 0
				})
			}

			// 将缓冲区的数据合并到状态中
			if (this.readingState.pulseBuffer.length > 0) {
				this.state.pulseDiagnosisList = [...this.readingState.pulseBuffer, ...this.state.pulseDiagnosisList]
			}

			// 重置读取状态
			this._resetPulseReadingState()
			return
		}

		// 处理错误响应
		if (data.error) {
			console.error('【脉诊历史】读取错误:', data.message)
			this.readingState.isReadingPulseDiagnosis = false
			if (this.callbacks.onError) {
				this.callbacks.onError(`脉诊读取失败: ${data.message}`)
			}
			this._resetPulseReadingState()
			return
		}

		// 有效数据
		const pulseItem = {
			timestamp: data.timestamp,
			date: data.date,
			bloodStasisIndex: data.bloodStasisIndex, // 血瘀指数
			dampnessIndex: data.dampnessIndex, // 湿气指数
			qiBloodIndex: data.qiBloodIndex, // 气血指数
			updateTime: Date.now(),
			updateTimeStr: this.getCurrentTime(),
			type: "pulse_data_his"
		}

		console.log('血瘀:', data.bloodStasisIndex)
		console.log('湿气:', data.dampnessIndex)
		console.log('气血:', data.qiBloodIndex)

		// 添加血瘀、湿气、气血的等级评估方法
		pulseItem.bloodStasisLevel = this._getBloodStasisLevel(data.bloodStasisIndex)
		pulseItem.dampnessLevel = this._getDampnessLevel(data.dampnessIndex)
		pulseItem.qiBloodLevel = this._getQiBloodLevel(data.qiBloodIndex)

		this.readingState.pulseBuffer.push(pulseItem)
		this.readingState.lastTimestamp = data.timestamp

		console.log('【脉诊历史】收到第', this.readingState.pulseBuffer.length, '条:',
			`时间:${data.date.formatted}, 血瘀:${data.bloodStasisIndex}, 湿气:${data.dampnessIndex}, 气血:${data.qiBloodIndex}`
		)

		// 检查是否达到预期数量
		if (this.readingState.pulseBuffer.length >= this.readingState.expectedPulseCount) {
			console.log('【脉诊历史】已达到预期数量，停止接收')
			this.readingState.isReadingPulseDiagnosis = false

			if (this.callbacks.onPulseDiagnosis) {
				this.callbacks.onPulseDiagnosis({
					list: this.readingState.pulseBuffer,
					allList: [...this.readingState.pulseBuffer, ...this.state.pulseDiagnosisList],
					completed: true,
					totalCount: this.readingState.pulseBuffer.length
				})
			}

			// 合并到状态中
			this.state.pulseDiagnosisList = [...this.readingState.pulseBuffer, ...this.state.pulseDiagnosisList]
			this._resetPulseReadingState()
		}

		return pulseItem
	}

	/**
	 * 重置脉诊读取状态
	 */
	_resetPulseReadingState() {
		this.readingState.isReadingPulseDiagnosis = false
		this.readingState.pulseBuffer = []
		this.readingState.expectedPulseCount = 0
		this.readingState.lastTimestamp = 0
	}

	/**
	 * 获取血瘀指数等级
	 * @param {number} score - 血瘀分数 (0-10)
	 */
	_getBloodStasisLevel(score) {
		if (score >= 7) return {
			level: 'severe',
			text: '血瘀重',
			description: '血瘀程度较重，建议及时调理',
			color: 'red'
		}
		if (score >= 4) return {
			level: 'moderate',
			text: '血瘀较重',
			description: '血瘀程度偏重，需要注意',
			color: 'yellow'
		}
		return {
			level: 'normal',
			text: '血瘀一般',
			description: '血瘀程度较轻，状况良好',
			color: 'green'
		}
	}

	/**
	 * 获取湿气指数等级
	 * @param {number} score - 湿气分数 (0-10)
	 */
	_getDampnessLevel(score) {
		if (score >= 7) return {
			level: 'severe',
			text: '湿气重浊',
			description: '湿气重浊，建议及时调理',
			color: 'red'
		}
		if (score >= 5) return {
			level: 'moderate',
			text: '湿气较重',
			description: '湿气偏重，需要注意',
			color: 'yellow'
		}
		if (score === 4) return {
			level: 'normal',
			text: '湿气一般',
			description: '湿气程度一般',
			color: 'yellow'
		}
		return {
			level: 'normal',
			text: '湿气一般',
			description: '湿气程度较轻，状况良好',
			color: 'green'
		}
	}

	/**
	 * 获取气血指数等级
	 * @param {number} score - 气血分数 (0-10)
	 */
	_getQiBloodLevel(score) {
		if (score >= 9) return {
			level: 'excellent',
			text: '气血旺盛',
			description: '气血充沛，状态良好',
			color: 'green'
		}
		if (score >= 7) return {
			level: 'good',
			text: '气血一般',
			description: '气血状态正常',
			color: 'green'
		}
		if (score >= 4) return {
			level: 'poor',
			text: '气血不足',
			description: '气血偏弱，建议适当调理',
			color: 'yellow'
		}
		return {
			level: 'critical',
			text: '气血虚亏',
			description: '气血虚亏较重，建议及时调理',
			color: 'red'
		}
	}





	/**
	 * 读取脉诊历史数据
	 * @param {number} timestamp - 时间戳，0表示从最新开始
	 * @param {number} direction - 回溯方向：0=从最新向历史回溯，1=从指定时间戳向历史回溯
	 * @param {number} count - 请求条数（最多50条）
	 * @param {string} deviceId - 设备ID
	 */
	async readPulseDiagnosis(timestamp = 0, direction = 0, count = 10, deviceId) {
		console.log('【读取脉诊历史】timestamp:', timestamp, 'direction:', direction, 'count:', count)
		// if (this.readingState.isReadingPulseDiagnosis) {
		// 	throw new Error('正在读取脉诊历史，请稍候')
		// }
		this.readingState.isReadingPulseDiagnosis = true
		this.readingState.pulseBuffer = []
		this.readingState.expectedPulseCount = Math.min(count, 50)

		const packet = U16ProProtocol.buildReadPulseDiagnosis(timestamp, direction, count)
		return this.sendCommand(packet, deviceId)
	}




	/**
	 * 读取最新脉诊数据（便捷方法）
	 * @param {number} count - 获取条数
	 * @param {string} deviceId - 设备ID
	 */
	async readLatestPulseDiagnosis(count = 10, deviceId) {
		return this.readPulseDiagnosis(0, 0, count, deviceId)
	}
	/**
	 * 刷新最新脉诊数据（便捷方法）
	 * @param {number} count - 获取条数
	 * @param {string} deviceId - 设备ID
	 */
	async readLatestPulseDiagnosis2(count = 10, deviceId) {
		return this.readPulseDiagnosis2(0, 0, count, deviceId)
	}
	/**
	 * 刷新脉诊历史数据
	 * @param {number} timestamp - 时间戳，0表示从最新开始
	 * @param {number} direction - 回溯方向：0=从最新向历史回溯，1=从指定时间戳向历史回溯
	 * @param {number} count - 请求条数（最多50条）
	 * @param {string} deviceId - 设备ID
	 */
	async readPulseDiagnosis2(timestamp = 0, direction = 0, count = 10, deviceId) {
		console.log('【读取脉诊历史】timestamp:', timestamp, 'direction:', direction, 'count:', count)

		this.readingState.isReadingPulseDiagnosis = true
		this.readingState.pulseBuffer = []
		this.readingState.expectedPulseCount = Math.min(count, 50)
		const packet = U16ProProtocol.buildReadPulseDiagnosis(timestamp, direction, count)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 继续读取更早的脉诊数据
	 * 使用已获取的最后一条数据的时间戳继续读取
	 */
	async readMorePulseDiagnosis(deviceId) {
		if (this.state.pulseDiagnosisList.length === 0) {
			console.log('【脉诊历史】无已有数据，请先调用 readLatestPulseDiagnosis')
			return this.readLatestPulseDiagnosis(10, deviceId)
		}

		// 获取最早的一条数据的时间戳
		const oldestEntry = [...this.state.pulseDiagnosisList].sort((a, b) => a.timestamp - b.timestamp)[0]
		if (oldestEntry && oldestEntry.timestamp) {
			// 方向为1，从该时间戳向历史回溯
			return this.readPulseDiagnosis(oldestEntry.timestamp, 1, 10, deviceId)
		}

		return this.readLatestPulseDiagnosis(10, deviceId)
	}

	// ==================== 命令发送 ====================

	/**
	 * 发送命令
	 */
	async sendCommand(packet, deviceId) {
		const targetDeviceId = deviceId || this.deviceId

		if (!targetDeviceId) {
			throw new Error('deviceId 不能为空')
		}

		const buffer = new Uint8Array(packet).buffer
		const hexStr = U16ProProtocol.bytesToHex(packet)
		console.log('【发送数据】:' + hexStr)
		return new Promise((resolve, reject) => {
			uni.writeBLECharacteristicValue({
				deviceId: targetDeviceId,
				serviceId: this.serviceId,
				characteristicId: this.writeCharId,
				value: buffer,
				success: (res) => {
					console.log('【BPW6发送成功】：' + hexStr)
					resolve(res)
				},
				fail: (err) => {
					console.error('【BPW6发送失败】:' + hexStr, err)
					reject(err)
				}
			})
		})
	}

	// ==================== 公共API ====================

	/**
	 * 4.1 设置时间
	 */
	async setTime(date = new Date(), lang = 0, deviceId) {
		const packet = U16ProProtocol.buildSetTime(date, lang)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.2 读取电量
	 */
	async readBattery(deviceId) {
		const packet = U16ProProtocol.buildReadBattery()
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.3 读取某天运动/睡眠信息
	 */
	async readDailyInfo(daysAgo = 0, deviceId) {
		console.log(`【BPW6读取某天运动/睡眠信息】${daysAgo ? '10 天前' : '当天'}`)
		this.state.dailyInfo = null
		const packet = U16ProProtocol.buildReadDailyInfo(daysAgo)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.4 设置时间格式/公英制/用户参数
	 */
	async readSettings(deviceId) {
		const packet = U16ProProtocol.buildSetSettings(true)
		return this.sendCommand(packet, deviceId)
	}

	async setSettings(params, deviceId) {
		const packet = U16ProProtocol.buildSetSettings(false, params)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.5 读取血压历史
	 */
	async readBPHistory(timestamp = 0, direction = 0, count = 50, deviceId) {
		console.log("【BPW6读取血压历史】deviceId:", deviceId)
		if (this.readingState.isReadingBPHistory) {
			throw new Error('正在读取血压历史，请稍候')
		}
		this.readingState.isReadingBPHistory = true
		this.readingState.bpBuffer = []
		this.readingState.expectedBPCount = count
		const packet = U16ProProtocol.buildReadBPHistory(timestamp, direction, count)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 读取最新血压数据（便捷方法）
	 */
	async readLatestBPHistory(count = 50, deviceId) {
		console.log("【BPW6读取最新血压】count:", count, "deviceId:", deviceId)
		return this.readBPHistory(0, 0, count, deviceId)
	}

	/**
	 * 4.6 读取心率历史
	 * @param {number|Object} timestampOrEncoded - Unix时间戳(秒) 或 编码对象 {year, month, day}
	 * @param {string} deviceId - 设备ID
	 * @param {boolean} isEncoded - 是否为编码格式
	 */
	async readHRHistory(timestampOrEncoded, deviceId, isEncoded = false) {
		// console.log('=== 开始读取心率历史 ===', timestampOrEncoded)
		// 防止重复读取
		if (this.readingState.isReadingHRHistory) {
			throw new Error('正在读取心率历史，请稍候')
		}
		let baseTimestamp
		let packet
		try {
			if (isEncoded) {
				// 验证编码对象
				if (!timestampOrEncoded || typeof timestampOrEncoded !== 'object') {
					throw new Error('编码格式参数必须是对象: {year, month, day}')
				}

				const {
					year,
					month,
					day
				} = timestampOrEncoded

				// 验证字段范围
				if (!Number.isInteger(year) || year < 0 || year > 199) {
					throw new Error(`年份范围错误: ${year} (应为 0-199, 表示2000-2199)`)
				}
				if (!Number.isInteger(month) || month < 1 || month > 12) {
					throw new Error(`月份范围错误: ${month}`)
				}
				if (!Number.isInteger(day) || day < 1 || day > 31) {
					throw new Error(`日期范围错误: ${day}`)
				}

				packet = U16ProProtocol.buildReadHRHistoryEncoded(timestampOrEncoded)

				// 使用UTC计算基准时间戳，避免时区问题
				const fullYear = 2000 + year
				// 本地时间0点
				const localDate = new Date(fullYear, month - 1, day)
				baseTimestamp = Math.floor(localDate.getTime() / 1000)

				console.log(
					`编码日期: ${fullYear}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`
				)

			} else {
				// 验证Unix时间戳
				if (!Number.isInteger(timestampOrEncoded) || timestampOrEncoded <= 0) {
					throw new Error(`无效的时间戳: ${timestampOrEncoded}`)
				}

				packet = U16ProProtocol.buildReadHRHistory(timestampOrEncoded)
				const date = new Date(timestampOrEncoded * 1000)
				// 本地时间当天0点
				const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
				baseTimestamp = Math.floor(localDate.getTime() / 1000)
			}

			// 验证packet生成成功
			if (!packet || packet.length !== 16) {
				throw new Error('协议包构建失败或长度错误')
			}

			// 设置读取状态
			this.readingState.hrBaseTimestamp = baseTimestamp
			this.readingState.isReadingHRHistory = true
			this._armHRReadTimeout(deviceId)
			return this.sendCommand(packet, deviceId)

		} catch (error) {
			console.error('【读取心率历史】参数处理失败:', error.message)
			this._resetHRReadingState()
			throw error
		}
	}

	/**
	 * 读取最新心率历史（协议 0x15：按下发时间戳对应「整天」自动心率 5 分钟槽）
	 * @param {string} deviceId
	 * @param {Object} [options]
	 * @param {boolean} [options.realtime] - true：测量后拉取，对比快照找出刚写入的槽
	 * @param {boolean} [options.seedOnly] - true：连接后建整天快照，不上报
	 */
	async readLatestHRHistory(deviceId, options = {}) {
		const now = new Date()
		const seedOnly = !!(options && options.seedOnly)
		const realtime = !!(options && options.realtime) && !seedOnly
		this.readingState.hrRealtimeMode = realtime
		this.readingState.hrSeedOnly = seedOnly
		this.readingState.hrProgressiveEmittedTs = 0
		this.readingState.hrProgressiveEmittedValue = null
		// 实时读前若无快照，用当前列表垫一层基线
		if (realtime && (!(this._hrSnapshotMap instanceof Map) || this._hrSnapshotMap.size === 0)) {
			const seed = new Map()
			const list = this.state.heartRateList || []
			for (let i = 0; i < list.length; i++) {
				const item = list[i]
				if (item && item.timestamp != null && item.value != null && item.value !== '') {
					seed.set(item.timestamp, {
						timestamp: item.timestamp,
						value: item.value
					})
				}
			}
			if (seed.size > 0) {
				this._hrSnapshotMap = seed
				console.log('【心率历史】用现有列表垫快照', seed.size)
			}
		}
		// 协议：时间戳对应「一整天」；必须用本地当天 0 点，禁止用 now-90min（槽位错位、对比噪声）
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const timestamp = Math.floor(today.getTime() / 1000)
		console.log('【心率历史】请求当天数据', {
			realtime,
			seedOnly,
			dayStart: timestamp,
			dayStartKey: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} 00:00`
		})
		return this.readHRHistory(timestamp, deviceId)
	}

	/**
	 * 读取自动心率状态
	 */
	async readHRAutoStatus(deviceId) {
		console.log('【读取自动心率状态，开关自动心率测量功能】')
		const packet = U16ProProtocol.buildToggleHRAuto(true)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 设置自动心率
	 */
	async setHRAuto(enable, deviceId) {
		console.log(`【BPW6设置自动心率】${enable ? '开启' : '关闭'}`)
		const packet = U16ProProtocol.buildToggleHRAuto(false, enable)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 确保自动心率已开启（如果未开启则开启）
	 */
	async ensureHRAutoEnabled(deviceId) {
		await this.readHRAutoStatus(deviceId)
		await new Promise(resolve => setTimeout(resolve, 500))

		if (!this.state.hrAutoEnabled) {
			console.log('自动心率未开启，正在开启...')
			await this.setHRAuto(true, deviceId)
			await new Promise(resolve => setTimeout(resolve, 500))
			await this.readHRAutoStatus(deviceId)
			console.log('自动心率已开启')
		} else {
			console.log('自动心率已开启')
		}
	}

	/**
	 * 确保自动心率已关闭（后台定时测关掉；手动测/上报不受影响）
	 */
	async ensureHRAutoDisabled(deviceId) {
		await this.readHRAutoStatus(deviceId)
		await new Promise(resolve => setTimeout(resolve, 500))

		if (this.state.hrAutoEnabled) {
			console.log('自动心率已开启，正在关闭...')
			await this.setHRAuto(false, deviceId)
			await new Promise(resolve => setTimeout(resolve, 500))
			await this.readHRAutoStatus(deviceId)
			console.log('自动心率已关闭')
		} else {
			console.log('自动心率已关闭')
		}
	}

	/**
	 * 4.8 设置息屏时间
	 */
	async readScreenOffTime(deviceId) {
		const packet = U16ProProtocol.buildSetScreenOff(true)
		return this.sendCommand(packet, deviceId)
	}

	async setScreenOffTime(seconds, deviceId) {
		const packet = U16ProProtocol.buildSetScreenOff(false, seconds)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.9 设置目标参数
	 */
	async readGoals(deviceId) {
		const packet = U16ProProtocol.buildSetGoals(true)
		return this.sendCommand(packet, deviceId)
	}

	async setGoals(goals, deviceId) {
		const packet = U16ProProtocol.buildSetGoals(false, goals)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.10 开关自动血氧
	 */
	async readSpO2AutoStatus(deviceId) {
		const packet = U16ProProtocol.buildToggleSpO2Auto(true)
		return this.sendCommand(packet, deviceId)
	}

	async setSpO2Auto(enable, deviceId) {
		console.log(`【BPW6设置自动血氧】${enable ? '开启' : '关闭'}`)
		const packet = U16ProProtocol.buildToggleSpO2Auto(false, enable)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.11 读取血氧历史
	 * @param {Date} date
	 * @param {string} deviceId
	 * @param {{ realtime?: boolean }} [options] realtime=true 表示测量后拉取（可上报）
	 */
	async readSpO2History(date, deviceId, options = {}) {
		if (this.readingState.isReadingSpO2History) {
			throw new Error('正在读取血氧历史，请稍候')
		}

		this.readingState.isReadingSpO2History = true
		this.readingState.spo2RealtimeMode = !!(options && options.realtime)
		if (this.readingState.spo2RealtimeMode) {
			this._spo2RealtimeSeqCounter = (this._spo2RealtimeSeqCounter || 0) + 1
			this.readingState.spo2RealtimeSeq = this._spo2RealtimeSeqCounter
		} else {
			this.readingState.spo2RealtimeSeq = 0
		}
		this.state.spO2List = []

		const d = new Date(date)
		const dayStart = U16ProProtocol.dateToTimestamp(d)

		const packet = U16ProProtocol.buildReadSpO2History(dayStart)
		try {
			return await this.sendCommand(packet, deviceId)
		} catch (err) {
			this.readingState.isReadingSpO2History = false
			this.readingState.spo2RealtimeMode = false
			this.readingState.spo2RealtimeSeq = 0
			throw err
		}
	}

	async readLatestSpO2History(deviceId, options = {}) {
		return this.readSpO2History(new Date(), deviceId, options)
	}

	/**
	 * 实时血氧：延迟再读历史；若正在读则结束后补读一次（补读仍带 realtime）
	 */
	_scheduleSpO2HistoryRead(deviceId, delayMs = 1200) {
		if (this._spo2HistoryReadTimer) {
			clearTimeout(this._spo2HistoryReadTimer)
			this._spo2HistoryReadTimer = null
		}
		this._spo2HistoryPendingDeviceId = deviceId
		this._spo2HistoryPendingRealtime = true
		this._spo2HistoryReadTimer = setTimeout(() => {
			this._spo2HistoryReadTimer = null
			const targetId = this._spo2HistoryPendingDeviceId || deviceId
			const realtime = this._spo2HistoryPendingRealtime !== false
			if (this.readingState.isReadingSpO2History) {
				this._spo2HistoryRereadAfterDone = true
				console.log('【血氧】正在读取中，完成后补读(实时)')
				return
			}
			this.readLatestSpO2History(targetId, {
				realtime
			}).catch(err => {
				console.warn('【血氧】延迟读取历史失败:', err && err.message ? err.message : err)
			})
		}, delayMs)
	}

	/**
	 * 4.16 设置血压动态测量参数
	 * @param {Object} params
	 * @param {boolean|number} params.enabled - 功能开关 1打开 0关闭
	 * @param {number} params.startHour - 开始时间，单位小时
	 * @param {number} params.dayInterval - 白天间隔，单位分钟
	 * @param {number} params.nightInterval - 晚上间隔，单位分钟
	 */
	async setBPDynamicParams(params, deviceId) {
		console.log('【设置血压动态测量参数】', params)
		const packet = U16ProProtocol.buildSetBPDynamicParams(params)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.17 读取血压动态测量参数
	 */
	async readBPDynamicParams(deviceId) {
		console.log('【读取血压动态测量参数】')
		const packet = U16ProProtocol.buildReadBPDynamicParams()
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.12 查找设备
	 */
	async findDevice(deviceId) {
		const packet = U16ProProtocol.buildFindDevice()
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 重启设备
	 */
	async restart(deviceId) {
		const packet = U16ProProtocol.buildRestart()
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.14 恢复出厂设置
	 */
	async factoryReset(deviceId) {
		const packet = U16ProProtocol.buildFactoryReset()
		return this.sendCommand(packet, deviceId)
	}

	// ==================== PPG测量（0xBC自定义蓝牙服务） ====================

	/**
	 * 根据特征值属性选择 write 方式
	 * 对齐 Main BPW6：优先 writeNoResponse
	 */
	_resolveBcWriteType(writeChar) {
		const props = writeChar.properties || {}
		if (props.writeNoResponse) return 'writeNoResponse'
		if (props.write) return 'write'
		return 'writeNoResponse'
	}

	/**
	 * 发现PPG自定义蓝牙服务并启用notify
	 */
	async ensureBcServiceReady(deviceId, options = {}) {
		const {
			force = false
		} = options
		const targetDeviceId = deviceId || this.deviceId
		if (!targetDeviceId) {
			throw new Error('deviceId 不能为空')
		}

		this._ensureBcNotifyListenerActive()

		if (this.bcDeviceId && this.bcDeviceId !== targetDeviceId) {
			this.resetBcServiceState()
		}
		if (!force && this.bcDeviceId === targetDeviceId && this.isBcNotifying) {
			return
		}

		if (this._bcServiceReadyPromise) {
			await this._bcServiceReadyPromise
			if (!force && this.bcDeviceId === targetDeviceId && this.isBcNotifying) {
				return
			}
		}

		this._bcServiceReadyPromise = this._enableBcServiceNotify(targetDeviceId)
		try {
			await this._bcServiceReadyPromise
		} finally {
			this._bcServiceReadyPromise = null
		}
	}

	async _refreshBcNotify(targetDeviceId) {
		if (!this.bcServiceId || !this.bcNotifyCharId) {
			await this.ensureBcServiceReady(targetDeviceId, {
				force: true
			})
			return
		}

		await new Promise((resolve, reject) => {
			uni.notifyBLECharacteristicValueChange({
				deviceId: targetDeviceId,
				serviceId: this.bcServiceId,
				characteristicId: this.bcNotifyCharId,
				state: true,
				success: () => {
					this.bcDeviceId = targetDeviceId
					this.isBcNotifying = true
					console.log('【PPG】BC notify 已刷新', {
						serviceId: this.bcServiceId,
						notifyCharId: this.bcNotifyCharId
					})
					setTimeout(resolve, 250)
				},
				fail: (err) => {
					console.warn('【PPG】BC notify 刷新失败，重新发现服务', err)
					this.isBcNotifying = false
					this.ensureBcServiceReady(targetDeviceId, {
						force: true
					}).then(resolve).catch(reject)
				}
			})
		})
	}

	async _reSubscribeBcNotify(targetDeviceId) {
		if (!this.bcServiceId || !this.bcNotifyCharId) {
			await this.ensureBcServiceReady(targetDeviceId, {
				force: true
			})
			return
		}

		console.log('【PPG】BC notify 重新订阅（先关后开）')
		await new Promise((resolve) => {
			uni.notifyBLECharacteristicValueChange({
				deviceId: targetDeviceId,
				serviceId: this.bcServiceId,
				characteristicId: this.bcNotifyCharId,
				state: false,
				success: resolve,
				fail: resolve
			})
		})
		await this._sleep(200)
		await this._refreshBcNotify(targetDeviceId)
		await this._sleep(300)
	}

	/**
	 * 发送 BC 命令前：注册监听 + 按需启用 notify（与 0x4A 相同路径，不重复 re-subscribe）
	 */
	async _prepareBcChannel(targetDeviceId, options = {}) {
		const {
			forceNotify = false
		} = options
		this.bcReceiveBuffer = []
		this._ensureBcNotifyListenerActive()

		const channelReady = this.bcServiceId && this.bcNotifyCharId && this.bcWriteCharId
		const notifyReady = this.isBcNotifying && this.bcDeviceId === targetDeviceId
		const neverReceivedBc = !this._lastBcNotifyTime
		const sinceLastNotifyMs = this._lastBcNotifyTime ?
			Date.now() - this._lastBcNotifyTime :
			-1

		if (channelReady && notifyReady && !forceNotify && !neverReceivedBc) {
			// console.log('【PPG】BC通道已就绪，跳过notify刷新', {
			// 	sinceLastNotifyMs
			// })
			return
		}

		console.log('【PPG】BC notify 需要启用', {
			forceNotify,
			notifyReady,
			channelReady,
			neverReceivedBc,
			sinceLastNotifyMs
		})
		await this.ensureBcServiceReady(targetDeviceId, {
			force: true
		})
		await this._sleep(300)
	}

	isPpgOperationInProgress() {
		return this._ppgOperationLock
	}

	isPpgManagedRead() {
		return this._ppgManagedRead
	}

	async _enableBcServiceNotify(targetDeviceId) {
		await new Promise((resolve, reject) => {
			uni.getBLEDeviceServices({
				deviceId: targetDeviceId,
				success: (res) => {
					const service = res.services.find(s =>
						this._isSameBleUuid(s.uuid, BC_BLE_UUID.SERVICE) ||
						this._isSameBleUuid(s.uuid, this.bcServiceId)
					)
					if (!service) {
						reject(new Error('未找到PPG自定义蓝牙服务'))
						return
					}

					const resolvedServiceId = service.uuid
					uni.getBLEDeviceCharacteristics({
						deviceId: targetDeviceId,
						serviceId: resolvedServiceId,
						success: (charRes) => {
							const list = charRes.characteristics || []
							let writeChar = list.find(
								c => this._isSameBleUuid(c.uuid, BC_BLE_UUID.WRITE) &&
								(c.properties.write || c.properties.writeNoResponse)
							)
							if (!writeChar) {
								writeChar = list.find(
									c => c.properties && (c.properties.write || c.properties
										.writeNoResponse)
								)
							}
							let notifyChar = list.find(
								c => this._isSameBleUuid(c.uuid, BC_BLE_UUID.NOTIFY) &&
								(c.properties.notify || c.properties.indicate)
							)
							if (!notifyChar) {
								notifyChar = list.find(
									c => c.properties && (c.properties.notify || c.properties
										.indicate)
								)
							}

							if (!writeChar || !notifyChar) {
								reject(new Error('未找到PPG自定义蓝牙特征值'))
								return
							}

							this.bcServiceId = resolvedServiceId
							this.bcWriteCharId = writeChar.uuid
							this.bcNotifyCharId = notifyChar.uuid
							this.bcWriteType = this._resolveBcWriteType(writeChar)

							uni.notifyBLECharacteristicValueChange({
								deviceId: targetDeviceId,
								serviceId: resolvedServiceId,
								characteristicId: notifyChar.uuid,
								state: true,
								success: () => {
									this.bcDeviceId = targetDeviceId
									this.isBcNotifying = true
									setTimeout(resolve, 200)
								},
								fail: (err) => {
									this.isBcNotifying = false
									this.bcDeviceId = ''
									reject(err)
								}
							})
						},
						fail: reject
					})
				},
				fail: reject
			})
		})
	}

	/**
	 * PPG BC 通道写入：对齐 Main BPW6（优先 writeNoResponse），
	 * 每次重建 buffer；10007 再尝试其它 writeType；必要时 rediscover。
	 */
	_writeBcCharacteristic(targetDeviceId, buffer, hexStr, options = {}) {
		const allowRediscover = options.allowRediscover !== false
		const preferred = this.bcWriteType === 'write' || this.bcWriteType === 'writeNoResponse' ?
			this.bcWriteType :
			'writeNoResponse'
		const writeModes = []
		;[preferred, 'writeNoResponse', null, 'write'].forEach((m) => {
			if (writeModes.indexOf(m) < 0) writeModes.push(m)
		})
		const packetBytes = hexStr ? U16ProProtocol.hexToBytes(hexStr) : null
		const buildFreshBuffer = () => {
			if (packetBytes && packetBytes.length) {
				return new Uint8Array(packetBytes).buffer
			}
			return buffer
		}

		const attemptWrite = (modeIndex, allowRediscoverNow) => new Promise((resolve, reject) => {
			if (modeIndex >= writeModes.length) {
				if (allowRediscoverNow) {
					console.warn('【PPG】所有writeType均失败，重新发现BC服务后重试')
					this.isBcNotifying = false
					this.ensureBcServiceReady(targetDeviceId, {
							force: true
						})
						.then(() => this._sleep(300))
						.then(() => attemptWrite(0, false).then(resolve).catch(reject))
						.catch(reject)
					return
				}
				reject(new Error('PPG写入失败: property not support'))
				return
			}

			const mode = writeModes[modeIndex]
			const modeLabel = mode || 'default'
			const writeOptions = {
				deviceId: targetDeviceId,
				serviceId: this.bcServiceId,
				characteristicId: this.bcWriteCharId,
				value: buildFreshBuffer(),
				success: (res) => {
					if (mode) {
						this.bcWriteType = mode
					} else if (!this.bcWriteType) {
						this.bcWriteType = 'writeNoResponse'
					}
					resolve(res)
				},
				fail: (err) => {
					const errCode = err && (err.errCode != null ? err.errCode : err.code)
					console.warn('【PPG】writeType=' + modeLabel + ' 失败', {
						errCode,
						serviceId: this.bcServiceId,
						characteristicId: this.bcWriteCharId,
						err
					})
					if (errCode === 10007 && modeIndex + 1 < writeModes.length) {
						const nextLabel = writeModes[modeIndex + 1] || 'default'
						console.warn('【PPG】尝试下一writeType=' + nextLabel)
						attemptWrite(modeIndex + 1, allowRediscoverNow).then(resolve).catch(reject)
						return
					}
					if (errCode === 10007 && allowRediscoverNow) {
						console.warn('【PPG】writeType均不支持，重新发现BC服务')
						this.isBcNotifying = false
						this.ensureBcServiceReady(targetDeviceId, {
								force: true
							})
							.then(() => this._sleep(300))
							.then(() => attemptWrite(0, false).then(resolve).catch(reject))
							.catch(reject)
						return
					}
					// 非 10007：短延迟同模式重试一次，再换模式
					if (modeIndex + 1 < writeModes.length) {
						setTimeout(() => {
							attemptWrite(modeIndex + 1, allowRediscoverNow).then(resolve).catch(reject)
						}, 120)
						return
					}
					console.error('【PPG发送失败】:' + hexStr, err)
					reject(err)
				}
			}
			if (mode === 'writeNoResponse') {
				writeOptions.writeType = 'writeNoResponse'
			} else if (mode === 'write') {
				writeOptions.writeType = 'write'
			}
			uni.writeBLECharacteristicValue(writeOptions)
		})

		return attemptWrite(0, allowRediscover)
	}

	/**
	 * 仅在确认正在测量时发送停止，避免空闲时发 0x4B 导致无法立即启动
	 */
	async _ensurePpgIdleBeforeStart(deviceId) {
		const targetDeviceId = deviceId || this.deviceId
		if (!targetDeviceId || !this.state.ppgMeasuring) {
			console.log('【PPG】设备未在测量中，跳过预停止')
			return
		}

		try {
			const stopPromise = this._waitForBcResponse(CMD.PPG_STOP, {
				timeout: 3000
			})
			await this.sendBcCommand(U16ProProtocol.buildPPGStop(), targetDeviceId, {
				skipPrepare: true
			})
			const stopResult = await stopPromise
			console.log('【PPG】预停止结果', stopResult.parsed)
			if (stopResult.parsed?.success) {
				this.state.ppgMeasuring = false
			}
		} catch (err) {
			console.log('【PPG】预停止（可忽略）', err.message || err)
		}
		await this._sleep(800)
	}

	async _sendPpgStartAndWait(packet, waitCmd, acceptCmds, deviceId, options = {}) {
		const {
			timeout = 15000
		} = options
		const targetDeviceId = deviceId || this.deviceId
		const responsePromise = this._waitForBcResponse(waitCmd, {
			acceptCmds,
			timeout
		})
		await this.sendBcCommand(packet, targetDeviceId, {
			skipPrepare: true
		})
		const result = await responsePromise
		return result.parsed
	}

	getPpgStartHint(result) {
		if (!result) {
			return t('PPG无响应')
		}
		if (result.success) {
			if (result.status === BC_PACKET.PPG_STATUS_BUSY) {
				return t('PPG测量已在进行中')
			}
			return t('PPG测量已开启')
		}
		return t('设备拒绝开启PPG可能未佩戴或设备忙碌请稍后重试')
	}

	/**
	 * 带锁执行 PPG 启动并等待应答
	 */
	async _executePpgStart(packet, waitCmd, acceptCmds, deviceId, logLabel, prepareOptions = {}) {
		const targetDeviceId = deviceId || this.deviceId
		if (!targetDeviceId) {
			throw new Error('deviceId 不能为空')
		}

		const {
			timeout,
			skipRetry = false,
			forceNotify,
			rejectRetries
		} = prepareOptions
		const waitOptions = timeout ? {
			timeout
		} : {}
		const isFirstBc = !this._lastBcNotifyTime
		const useForceNotify = forceNotify === true || isFirstBc
		// 首次绑定/设备拒绝(status=0)：多轮刷新 BC 再发，避免外层空转 0x49 超时
		const maxRejectRetries = skipRetry ? 0 : Math.max(1, Number(rejectRetries) || (useForceNotify ? 3 : 1))

		this._ppgOperationLock = true
		try {
			await this._prepareBcChannel(targetDeviceId, {
				forceNotify: useForceNotify
			})
			// 首次绑定/首次 BC：多留通道稳定时间，降低设备 status=0 拒绝
			if (isFirstBc || useForceNotify) {
				await this._sleep(isFirstBc ? 1200 : 500)
			}
			await this._ensurePpgIdleBeforeStart(targetDeviceId)

			console.log(`【PPG】等待${logLabel}应答 notify...`, U16ProProtocol.bytesToHex(packet))
			let parsed
			try {
				parsed = await this._sendPpgStartAndWait(
					packet,
					waitCmd,
					acceptCmds,
					targetDeviceId,
					waitOptions
				)
			} catch (err) {
				if (skipRetry || !String(err.message || err).includes('响应超时')) {
					throw err
				}
				console.warn('【PPG】应答超时，刷新监听后重试', err.message)
				this._ensureBcNotifyListenerActive()
				await this._prepareBcChannel(targetDeviceId, {
					forceNotify: true
				})
				await this._sleep(500)
				parsed = await this._sendPpgStartAndWait(
					packet,
					waitCmd,
					acceptCmds,
					targetDeviceId,
					waitOptions
				)
			}

			let rejectRound = 0
			while (!skipRetry && parsed && parsed.success === false && rejectRound < maxRejectRetries) {
				rejectRound++
				const waitMs = 1200 + rejectRound * 800
				console.warn(`【PPG】启动被拒(status=${parsed.status})，刷新BC后第${rejectRound}次重试`, parsed)
				await this._prepareBcChannel(targetDeviceId, {
					forceNotify: true
				})
				await this._sleep(waitMs)
				this._ensureBcNotifyListenerActive()
				parsed = await this._sendPpgStartAndWait(
					packet,
					waitCmd,
					acceptCmds,
					targetDeviceId,
					waitOptions
				)
			}
			return parsed
		} finally {
			this._ppgOperationLock = false
		}
	}

	/**
	 * 发送 0xBC 协议命令（走PPG自定义write通道）
	 */
	async sendBcCommand(packet, deviceId, options = {}) {
		const {
			skipPrepare = false
		} = options
		const targetDeviceId = deviceId || this.deviceId
		if (!targetDeviceId) {
			throw new Error('deviceId 不能为空')
		}

		if (!skipPrepare) {
			await this._prepareBcChannel(targetDeviceId)
		}

		const buffer = new Uint8Array(packet).buffer
		const hexStr = U16ProProtocol.bytesToHex(packet)
		// 后台 skipPrepare：仍允许一次 rediscover（UUID 错会导致连续 10007）
		return this._writeBcCharacteristic(targetDeviceId, buffer, hexStr, {
			allowRediscover: true
		})
	}

	/**
	 * 4.4 开启PPG测量并设置测量时长（10~60秒）
	 * 发送 BC 49 01 00 BF 51 EE；串口实测约 180ms 内应答 BC 4A 01 00 7E 80 01（非 0x49）
	 * 若无应答则同一会话降级为 BC 4A 01 00 BF 51 EE（与已验证可用的 0x4A 通道一致）
	 * BPW6 首次绑定常见：0x49 一直超时、0x4A 先 status=0 后成功 → 记住后跳过 0x49
	 * @param {number} seconds
	 * @param {string} [deviceId]
	 * @param {boolean} [waitResponse=true]
	 * @param {{ forceNotify?: boolean, skip49?: boolean }} [prepareOptions]
	 */
	async startPPGMeasurementWithDuration(seconds, deviceId, waitResponse = true, prepareOptions = {}) {
		const packet49 = U16ProProtocol.buildPPGStartWithDuration(seconds)
		const targetDeviceId = deviceId || this.deviceId
		if (!targetDeviceId) {
			throw new Error('deviceId 不能为空')
		}
		if (!waitResponse) {
			return this.sendBcCommand(packet49, targetDeviceId)
		}

		const forceNotify = prepareOptions.forceNotify === true || !this._lastBcNotifyTime
		const skip49 = prepareOptions.skip49 === true || this._ppgPrefer4AStart === true

		if (!skip49) {
			try {
				const parsed = await this._executePpgStart(
					packet49,
					CMD.PPG_START,
					[CMD.PPG_START, CMD.PPG_START_WITH_DURATION],
					targetDeviceId,
					'0x49(等0x4A)', {
						timeout: 3000,
						skipRetry: true,
						forceNotify
					}
				)
				if (parsed?.success) {
					return parsed
				}
				console.warn('【PPG】0x49 设备拒绝', parsed)
				this._ppgPrefer4AStart = true
			} catch (err) {
				console.warn('【PPG】0x49 无应答', err.message || err)
				this._ppgPrefer4AStart = true
			}
		} else {
			console.log('【PPG】跳过0x49，直接0x4A+时长')
		}

		const packet4a = U16ProProtocol.buildPPGStartWithDurationOn4A(seconds)
		console.log('【PPG】改用0x4A+时长', U16ProProtocol.bytesToHex(packet4a))
		return this._executePpgStart(
			packet4a,
			CMD.PPG_START,
			[CMD.PPG_START],
			targetDeviceId,
			'0x4A+时长', {
				forceNotify: true,
				rejectRetries: forceNotify || !this._lastBcNotifyTime ? 3 : 2
			}
		)
	}

	/**
	 * 4.5 开启PPG测量（0x4A，无 data 区：BC 4A 00 00 FF FF）
	 */
	async startPPGMeasurement(deviceId, waitResponse = true) {
		const packet = U16ProProtocol.buildPPGStart()
		if (!waitResponse) {
			// 定时后台下发：有写通道 UUID 则跳过 rediscover（后台 getServices 易失败）
			const skipPrepare = !!(this.bcServiceId && this.bcWriteCharId)
			return this.sendBcCommand(packet, deviceId, {
				skipPrepare
			})
		}
		return this._executePpgStart(
			packet,
			CMD.PPG_START,
			[CMD.PPG_START],
			deviceId,
			'0x4A'
		)
	}

	/**
	 * 4.6 停止PPG测量
	 */
	async stopPPGMeasurement(deviceId, waitResponse = true) {
		const packet = U16ProProtocol.buildPPGStop()
		if (!waitResponse) {
			return this.sendBcCommand(packet, deviceId)
		}
		const responsePromise = this._waitForBcResponse(CMD.PPG_STOP)
		await this.sendBcCommand(packet, deviceId)
		const result = await responsePromise
		return result.parsed
	}

	/**
	 * 4.7 请求PPG数据大小
	 */
	async getPPGDataSize(deviceId, waitResponse = true) {
		const packet = U16ProProtocol.buildPPGGetSize()
		if (!waitResponse) {
			return this.sendBcCommand(packet, deviceId)
		}
		const responsePromise = this._waitForBcResponse(CMD.PPG_GET_SIZE)
		await this.sendBcCommand(packet, deviceId)
		const result = await responsePromise
		return result.parsed
	}

	/**
	 * 4.8 按偏移请求PPG数据（单包，最多128bytes）
	 */
	async getPPGDataAtOffset(offset, deviceId, waitResponse = true) {
		const packet = U16ProProtocol.buildPPGGetData(offset)
		if (!waitResponse) {
			return this.sendBcCommand(packet, deviceId)
		}
		const responsePromise = this._waitForBcResponse(CMD.PPG_GET_DATA, {
			expectedOffset: offset,
			timeout: 15000
		})
		await this.sendBcCommand(packet, deviceId)
		const result = await responsePromise
		return result.parsed
	}

	/**
	 * 读取全部PPG数据（0x4C 一次，再按 offset 顺序逐包 0x4D）
	 */
	async readAllPPGData(deviceId) {
		if (this.ppgReadingState.isReading) {
			throw new Error('正在读取PPG数据，请稍候')
		}

		const sizeResult = await this.getPPGDataSize(deviceId)
		if (sizeResult.error || !sizeResult.size) {
			return {
				size: 0,
				ppgData: [],
				empty: true
			}
		}

		this.ppgReadingState.isReading = true
		this.ppgReadingState.totalSize = sizeResult.size
		this.ppgReadingState.buffer = []
		this.ppgReadingState.currentOffset = 0
		this._ppgManagedRead = true

		const allData = []
		let offset = 0
		let chunkIndex = 0

		try {
			while (offset < sizeResult.size) {
				// console.log(`【PPG】请求第${chunkIndex}包 offset=${offset}`)
				const chunk = await this.getPPGDataAtOffset(offset, deviceId)
				if (chunk.error || !chunk.ppgData) {
					throw new Error(chunk.error || 'PPG数据块读取失败')
				}
				if (chunk.offset !== offset) {
					throw new Error(`PPG offset不匹配: 期望${offset}, 收到${chunk.offset}`)
				}
				allData.push(...chunk.ppgData)
				if (chunk.chunkSize === 0) {
					break
				}
				offset += chunk.chunkSize
				chunkIndex++
				if (offset < sizeResult.size) {
					await this._sleep(BC_PACKET.PPG_READ_INTERVAL_MS)
				}
			}

			this.state.ppgData = allData
			this.state.ppgDataSize = sizeResult.size
			this._resetPPGReadingState()

			const finalResult = {
				size: allData.length,
				ppgData: allData,
				completed: true
			}

			return finalResult
		} catch (error) {
			this._resetPPGReadingState()
			throw error
		} finally {
			this._ppgManagedRead = false
		}
	}

	// ==================== 断开连接 ====================

	async disconnect(deviceId) {
		const targetDeviceId = deviceId || this.deviceId

		if (targetDeviceId) {
			await new Promise((resolve) => {
				uni.closeBLEConnection({
					deviceId: targetDeviceId,
					success: resolve,
					fail: resolve
				})
			})
		}

		uni.closeBluetoothAdapter()
		this.isConnected = false
		this.isNotifying = false
		this.resetBcServiceState()
		this.deviceId = ''
	}

	// ==================== 工具方法 ====================

	/**
	 * 获取当前状态
	 */
	getState() {
		return {
			...this.state,
			readingState: {
				...this.readingState
			}
		}
	}

	/**
	 * 设置回调
	 */
	on(event, callback) {
		if (this.callbacks[event] !== undefined) {
			this.callbacks[event] = callback
		} else {
			console.warn('【警告】未知事件类型:', event)
		}
	}

	/**
	 * 清除指定类型的数据（用于重新读取）
	 */
	clearHistory(type) {
		switch (type) {
			case 'bp':
				this.state.bloodPressureList = []
				break
			case 'hr':
				this.state.heartRateList = []
				this._hrSnapshotMap = new Map()
				this._hrCompareSnapshot = null
				break
			case 'spo2':
				this.state.spO2List = []
				break
			case 'pulse': //脉诊
				this.state.pulseDiagnosisList = []
				break
			case 'ppg':
				this.state.ppgData = []
				this.state.ppgDataSize = 0
				this._resetPPGReadingState()
				break
			case 'all':
				this.state.bloodPressureList = []
				this.state.heartRateList = []
				this._hrSnapshotMap = new Map()
				this._hrCompareSnapshot = null
				this.state.spO2List = []
				this.state.pulseDiagnosisList = [] //脉诊
				this.state.ppgData = []
				this.state.ppgDataSize = 0
				this._resetPPGReadingState()
				this.state.dailyInfo = null
				break
			default:
				console.warn('【警告】未知历史类型:', type)
		}
	}
}

// 导出单例
export const u16proBLE = new U16ProBLEManager()