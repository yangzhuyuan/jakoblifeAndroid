// protocol/u16pro-ble-manager.js
import {
	BLE_UUID,
	CMD,
	DATA_TYPE
} from './u16pro-constants.js'
import {
	U16ProProtocol
} from './u16pro-protocol.js'

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
			screenOffTime: 10
		}

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
			hrBaseTimestamp: 0, // 当天0点UTC时间戳
			hrLastTimestamp: 0, // 上一个数据点的结束时间戳

			isReadingSpO2History: false,
			spO2Buffer: [],
			spO2TotalPackets: 0,
			spO2ReceivedPackets: 0
		}

		// 回调函数
		this.callbacks = {
			onDataChanged: null,
			onBPHistory: null,
			onHRHistory: null,
			onSpO2History: null,
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
	 * 初始化蓝牙数据监听（全局只调用一次）
	 */
	_initListener() {
		// 监听数据接收（必须在 enableNotify 之后）
		uni.onBLECharacteristicValueChange((res) => {
			let hexData = this.ab2hex(res.value)
			let targetDeviceId = res.deviceId
			this._handleDataReceived(res, targetDeviceId)
		})
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
		console.log('【接收】', hexStr)
		const result = U16ProProtocol.parseResponse([...bytes])

		if (result.error && result.error !== 'CRC校验失败') {
			console.error('解析错误:', result.error)
			if (this.callbacks.onError) this.callbacks.onError(result.error)
			return
		}

		// 分发处理
		switch (result.cmd) {
			case CMD.SET_TIME:
				console.log("【时间同步成功】", hexStr)
				break
			case CMD.DATA_CHANGED:
				console.log("【血压手表通知 app 有新的数据改变】", result.data.dataType)
				this._handleDataChanged(result.data.dataType, deviceId)
				break
			case CMD.READ_BATTERY:
				this.state.battery = result.data.battery
				console.log('【电量】:', this.state.battery + '%')
				break
			case CMD.READ_BP_HISTORY:
				console.log('【血压】:', result.data)
				this._handleBPHistoryResponse(result.data)
				break
			case CMD.READ_HR_HISTORY:
				console.log('【心率】:', result.data)
				this._handleHRHistoryResponse(result.data)
				break
			case CMD.READ_SPO2_HISTORY:
				console.log('【血氧】:', result.data)
				this._handleSpO2HistoryResponse(result.data)
				break
			case CMD.READ_DAILY_INFO:
				this._handleDailyInfoResponse(result.data)
				break
			case CMD.READ_SETTINGS:
				this.state.settings = result.data
				console.log('【设备设置】:', result.data)
				break
			case CMD.TOGGLE_HR_AUTO:
				if (result.data.isRead) {
					this.state.hrAutoEnabled = result.data.value === 0x01
					console.log('【自动心率】:', this.state.hrAutoEnabled)
				}
				break
			case CMD.TOGGLE_SPO2_AUTO:
				if (result.data.isRead) {
					this.state.spO2AutoEnabled = result.data.value === 0x01
					console.log('【自动血氧】:', this.state.spO2AutoEnabled)
				}
				break
			case CMD.SET_SCREEN_OFF:
				if (result.data.isRead) {
					this.state.screenOffTime = result.data.value
					console.log('【息屏时间】:', this.state.screenOffTime)
				}
				break
			case CMD.SET_GOALS:
				this.state.goals = result.data
				console.log('【目标设置】:', result.data)
				break
			case CMD.FIND_DEVICE:
				console.log('【查找设备】响应')
				break
			default:
				console.log('【未处理命令】:', result.cmd, result.data)
		}
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
			[DATA_TYPE.TEMPERATURE]: '体温',
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
				this.readLatestBPHistory(1, deviceId)
				break
			case DATA_TYPE.HEART_RATE:
				this.readLatestHRHistory(deviceId)
				break
			case DATA_TYPE.BLOOD_OXYGEN:
				this.readLatestSpO2History(deviceId)
				break
			case DATA_TYPE.BATTERY:
				this.readBattery(deviceId)
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

			// 清空状态
			this._resetHRReadingState()
			return
		}

		// 索引包
		if (data.isIndex) {
			this.readingState.isReadingHRHistory = true
			this.readingState.hrTotalPackets = data.totalPackets
			this.readingState.hrInterval = data.interval
			this.readingState.hrReceivedPackets = 0
			this.readingState.hrBuffer = []
			this.readingState.hrLastTimestamp = 0

			console.log('【心率历史】索引包 - 总包数:', data.totalPackets,
				'间隔:', data.interval, '分钟',
				'数据包数量:', data.totalPackets - 1)
			return
		}

		// 数据包
		if (!data.hrData || data.hrData.length === 0) {
			console.log('【心率历史】包', data.packetIndex, '无数据')
			return
		}

		const intervalSeconds = this.readingState.hrInterval * 60
		let packetStartTimestamp = 0

		if (data.packetIndex === 1) {
			// 包1：使用自带的时间戳
			packetStartTimestamp = data.timestamp
			this.readingState.hrLastTimestamp = packetStartTimestamp

			console.log(`【包${data.packetIndex}】使用自带时间戳:`,
				packetStartTimestamp + "|" + this.readingState.hrLastTimestamp,
				'数据点数:', data.hrData.length)
		} else {
			// 包2及以后：基于上一个包的结束时间计算
			if (this.readingState.hrLastTimestamp > 0) {
				// 计算偏移：包1有9个点，包2+每个有13个点
				// 包2起始时间 = 包1起始时间 + 9 * interval
				// 包3起始时间 = 包2起始时间 + 13 * interval
				// 通用公式：当前包起始时间 = 上一个包起始时间 + 上一个包的数据点数 * interval

				let prevPacketDataCount = (data.packetIndex === 2) ? 9 : 13
				packetStartTimestamp = this.readingState.hrLastTimestamp + (prevPacketDataCount * intervalSeconds)
				this.readingState.hrLastTimestamp = packetStartTimestamp

				console.log(`【包${data.packetIndex}】基于上一包计算起始时间:`,
					packetStartTimestamp + "|" + this.readingState.hrLastTimestamp,
					'数据点数:', data.hrData.length,
					'上一包数据点数:', prevPacketDataCount)
			} else {
				// 异常：没有基准时间戳，使用请求日期的0点
				packetStartTimestamp = this.readingState.hrBaseTimestamp || 0
				this.readingState.hrLastTimestamp = packetStartTimestamp

				console.warn(`【包${data.packetIndex}】警告：无基准时间戳，使用0点`,
					new Date(packetStartTimestamp * 1000).toISOString())
			}
		}

		// 处理每个心率值
		let validCount = 0
		for (let i = 0; i < data.hrData.length; i++) {
			const value = data.hrData[i]
			// 协议说明：不存在数据填充0，所以0表示无数据
			if (value !== null && value > 0) {
				const offsetSeconds = i * intervalSeconds
				const actualTimestamp = packetStartTimestamp + offsetSeconds
				const date = new Date(actualTimestamp * 1000)
				// 使用本地时间显示
				this.readingState.hrBuffer.push({
					timestamp: actualTimestamp,
					value: value,
					timeStr: `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`,
					packetIndex: data.packetIndex,
					indexInPacket: i
				})
				validCount++
			}
		}

		this.readingState.hrReceivedPackets++

		console.log('【心率历史】收到包', data.packetIndex,
			'有效数据:', validCount, '/', data.hrData.length,
			'累计心率值:', this.readingState.hrBuffer.length, '条',
			'包进度:', this.readingState.hrReceivedPackets, '/',
			this.readingState.hrTotalPackets - 1)

		// 检查是否接收完成（数据包数量 = 总包数 - 1，因为包0是索引包）
		if (this.readingState.hrReceivedPackets >= this.readingState.hrTotalPackets - 1) {
			this._finalizeHRHistoryRead()
		}
	}

	/**
	 * 完成心率历史读取
	 */
	_finalizeHRHistoryRead() {
		const totalHrValues = this.readingState.hrBuffer.length
		console.log('【心率历史】读取完成，共收到', totalHrValues, '条心率值')

		// 按时间排序
		this.readingState.hrBuffer.sort((a, b) => a.timestamp - b.timestamp)

		// 去重（基于时间戳）
		const uniqueMap = new Map()
		for (const item of this.readingState.hrBuffer) {
			if (!uniqueMap.has(item.timestamp)) {
				uniqueMap.set(item.timestamp, item)
			}
		}
		const uniqueList = Array.from(uniqueMap.values())

		if (uniqueList.length !== totalHrValues) {
			console.log('【心率历史】去重:', totalHrValues, '->', uniqueList.length)
		}

		// 更新状态（新数据在前）
		this.state.heartRateList = [...uniqueList, ...this.state.heartRateList]

		if (this.callbacks.onHRHistory) {
			this.callbacks.onHRHistory({
				list: uniqueList,
				allList: this.state.heartRateList,
				completed: true,
				totalCount: uniqueList.length,
				interval: this.readingState.hrInterval
			})
		}

		// 清空状态
		this._resetHRReadingState()
	}

	/**
	 * 重置心率读取状态
	 */
	_resetHRReadingState() {
		this.readingState.isReadingHRHistory = false
		this.readingState.hrBuffer = []
		this.readingState.hrTotalPackets = 0
		this.readingState.hrReceivedPackets = 0
		this.readingState.hrInterval = 0
		this.readingState.hrBaseTimestamp = 0
		this.readingState.hrLastTimestamp = 0
	}

	/**
	 * 处理血压历史响应
	 */
	_handleBPHistoryResponse(data) {
		if (data.empty) {
			console.log('【血压历史】读取完成，共', this.readingState.bpBuffer.length, '条')
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
			return
		}

		this.readingState.bpBuffer.push(data)
		console.log('【血压历史】收到第', this.readingState.bpBuffer.length, '条:', data)

		if (this.readingState.bpBuffer.length >= this.readingState.expectedBPCount) {
			console.log('【血压历史】已达到预期数量，停止接收')
			this.readingState.isReadingBPHistory = false
		}
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
			return
		}

		if (data.isIndex) {
			this.readingState.spO2TotalPackets = data.totalPackets || 0
			this.readingState.spO2ReceivedPackets = 0
			this.readingState.spO2Buffer = []
			this.state.spO2List = []
			console.log('【血氧历史】总包数:', data.totalPackets, '间隔:', data.interval, '分钟')

			if (data.totalPackets <= 1) {
				console.log('【血氧历史】无数据包，读取完成')
				this.readingState.isReadingSpO2History = false
				if (this.callbacks.onSpO2History) {
					this.callbacks.onSpO2History({
						list: [],
						completed: true
					})
				}
			}
			return
		}

		this.readingState.spO2ReceivedPackets++

		if (!data.spo2Data || data.spo2Data.length === 0) {
			console.log('【血氧历史】包', data.packetIndex, '无血氧数据')
			return
		}

		const intervalSeconds = (data.interval || 60) * 60
		const itemsPerPacket = data.spo2Data.length
		const baseOffsetSeconds = (data.packetIndex - 1) * itemsPerPacket * intervalSeconds

		console.log(`【血氧历史】处理包${data.packetIndex}: 时间戳=${data.timestamp}, 数据组数=${itemsPerPacket}`)

		data.spo2Data.forEach((item) => {
			if (item.max > 0 && item.max <= 100) {
				const offsetSeconds = item.hour * intervalSeconds
				const timestamp = data.timestamp + baseOffsetSeconds + offsetSeconds

				this.state.spO2List.push({
					timestamp: timestamp,
					date: U16ProProtocol.timestampToDate(timestamp),
					spO2Max: item.max,
					spO2Min: item.min,
					hour: item.hour
				})
			}
		})

		console.log('【血氧历史】进度:', this.readingState.spO2ReceivedPackets, '/', this.readingState.spO2TotalPackets,
			'累计:', this.state.spO2List.length, '条')

		if (this.readingState.spO2ReceivedPackets >= this.readingState.spO2TotalPackets - 1) {
			this.state.spO2List.sort((a, b) => a.timestamp - b.timestamp)
			console.log('【血氧历史】接收完成，共', this.state.spO2List.length, '条血氧数据')
			this.readingState.isReadingSpO2History = false

			if (this.callbacks.onSpO2History) {
				this.callbacks.onSpO2History({
					list: this.state.spO2List,
					completed: true,
					totalCount: this.state.spO2List.length
				})
			}
		}
	}

	/**
	 * 处理运动/睡眠信息响应
	 */
	_handleDailyInfoResponse(data) {
		if (!this.state.dailyInfo) this.state.dailyInfo = {}

		if (data.type === 'activity') {
			this.state.dailyInfo.activity = data
			console.log('【日常信息-运动】:', data)
		} else if (data.type === 'sleep') {
			this.state.dailyInfo.sleep = data
			console.log('【日常信息-睡眠】:', data)
		} else {
			console.log('【日常信息】:', data)
		}
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
		console.log('【发送deviceId】:', targetDeviceId)
		console.log('【发送serviceId】:', this.serviceId)
		console.log('【发送writeCharId】:', this.writeCharId)
		console.log('【发送数据】:', hexStr)

		return new Promise((resolve, reject) => {
			uni.writeBLECharacteristicValue({
				deviceId: targetDeviceId,
				serviceId: this.serviceId,
				characteristicId: this.writeCharId,
				value: buffer,
				success: (res) => {
					console.log('【发送成功】')
					resolve(res)
				},
				fail: (err) => {
					console.error('【发送失败】:', err)
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
		this.state.dailyInfo = null
		const packet = U16ProProtocol.buildReadDailyInfo(daysAgo)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.4 读取/设置用户参数
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
	async readBPHistory(timestamp = 0, direction = 0, count = 10, deviceId) {
		console.log("【读取血压历史】deviceId:", deviceId)
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
	async readLatestBPHistory(count = 1, deviceId) {
		console.log("【读取最新血压】count:", count, "deviceId:", deviceId)
		return this.readBPHistory(0, 0, count, deviceId)
	}

	/**
	 * 4.6 读取心率历史
	 * @param {number|Object} timestampOrEncoded - Unix时间戳(秒) 或 编码对象 {year, month, day}
	 * @param {string} deviceId - 设备ID
	 * @param {boolean} isEncoded - 是否为编码格式
	 */
	async readHRHistory(timestampOrEncoded, deviceId, isEncoded = false) {
		console.log('=== 开始读取心率历史 ===', timestampOrEncoded)
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
					`编码日期: ${fullYear}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`)

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
			return this.sendCommand(packet, deviceId)

		} catch (error) {
			console.error('【读取心率历史】参数处理失败:', error.message)
			this._resetHRReadingState()
			throw error
		}
	}

	/**
	 * 读取最新心率历史（当天）
	 */
	async readLatestHRHistory(deviceId) {
		const now = new Date()
		// 本地时间当天0点
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const timestamp = Math.floor(today.getTime() / 1000)
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
		console.log(`【设置自动心率】${enable ? '开启' : '关闭'}`)
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
		const packet = U16ProProtocol.buildToggleSpO2Auto(false, enable)
		return this.sendCommand(packet, deviceId)
	}

	/**
	 * 4.11 读取血氧历史
	 */
	async readSpO2History(date, deviceId) {
		if (this.readingState.isReadingSpO2History) {
			throw new Error('正在读取血氧历史，请稍候')
		}

		this.readingState.isReadingSpO2History = true
		this.state.spO2List = []

		const d = new Date(date)
		const dayStart = U16ProProtocol.dateToTimestamp(d)

		const packet = U16ProProtocol.buildReadSpO2History(dayStart)
		return this.sendCommand(packet, deviceId)
	}

	async readLatestSpO2History(deviceId) {
		return this.readSpO2History(new Date(), deviceId)
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
				break
			case 'spo2':
				this.state.spO2List = []
				break
			case 'all':
				this.state.bloodPressureList = []
				this.state.heartRateList = []
				this.state.spO2List = []
				this.state.dailyInfo = null
				break
			default:
				console.warn('【警告】未知历史类型:', type)
		}
	}
}

// 导出单例
export const u16proBLE = new U16ProBLEManager()