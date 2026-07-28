// protocol/u16pro-protocol.js
import {
	CMD,
	BC_PACKET
} from './u16pro-constants.js'
import {
	getLocalTimeAllJSON
} from '../unitls/timezone.js'

export class U16ProProtocol {
	/**
	 * 计算CRC校验（CheckSum8 Modulo 256）
	 * 前15个字节相加，取低8位
	 */
	static calcCRC(data) {
		let sum = 0
		const bytes = Array.isArray(data) ? data : this.hexToBytes(data)
		for (let i = 0; i < 15; i++) {
			sum += bytes[i] || 0
		}
		return sum & 0xFF
	}

	/**
	 * 验证CRC
	 */
	static verifyCRC(data) {
		const bytes = Array.isArray(data) ? data : this.hexToBytes(data)
		if (bytes.length !== 16) return false
		const receivedCRC = bytes[15]
		const calculatedCRC = this.calcCRC(bytes.slice(0, 15))
		return receivedCRC === calculatedCRC
	}

	/**
	 * 构建16字节命令包
	 */
	static buildPacket(cmd, payload = []) {
		const packet = new Array(16).fill(0)
		packet[0] = cmd & 0x7F // Bit7必须为0

		// 填充payload（最多14字节）
		for (let i = 0; i < Math.min(payload.length, 14); i++) {
			packet[i + 1] = payload[i] & 0xFF
		}

		// 计算CRC
		packet[15] = this.calcCRC(packet)

		return packet
	}

	/**
	 * 小端序转Uint32（修正）
	 */
	static littleEndianToUint32(bytes, offset) {
		return bytes[offset] +
			(bytes[offset + 1] << 8) +
			(bytes[offset + 2] << 16) +
			(bytes[offset + 3] * 16777216)
	}

	/**
	 * Uint32转小端字节序
	 */
	static uint32ToLittleEndian(value) {
		return [
			value & 0xFF,
			(value >> 8) & 0xFF,
			(value >> 16) & 0xFF,
			(value >> 24) & 0xFF
		]
	}

	/**
	 * 小端序转有符号Int32（PPG 32位ADC码）
	 */
	static littleEndianToInt32(bytes, offset) {
		const u = this.littleEndianToUint32(bytes, offset)
		return u > 0x7FFFFFFF ? u - 0x100000000 : u
	}

	/**
	 * 小端序转Uint16（血压原始 PA 样本）
	 */
	static littleEndianToUint16(bytes, offset) {
		return (bytes[offset] + (bytes[offset + 1] << 8)) & 0xFFFF
	}

	/**
	 * BCD编码（用于时间设置）
	 */
	static toBCD(value) {
		return ((Math.floor(value / 10) << 4) | (value % 10)) & 0xFF
	}

	/**
	 * BCD解码
	 */
	static fromBCD(value) {
		const high = (value >> 4) & 0x0F
		const low = value & 0x0F
		if (high > 9 || low > 9) return null
		return high * 10 + low
	}

	/**
	 * 解码血压动态测量开始小时
	 * 设备可能返回：直接小时(0-23)、BCD小时(0x21=21)、或 hour*dayInterval(21*9=189)
	 */
	static decodeBPDynamicStartHour(byteValue, dayInterval) {
		if (byteValue <= 23) return byteValue

		const bcdHour = this.fromBCD(byteValue)
		if (bcdHour !== null && bcdHour <= 23) return bcdHour

		if (dayInterval > 0 && byteValue % dayInterval === 0) {
			const hour = byteValue / dayInterval
			if (hour <= 23) return hour
		}

		return byteValue
	}

	/**
	 * 字节数组转16进制字符串
	 */
	static bytesToHex(bytes) {
		return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
	}

	/**
	 * 16进制字符串转字节数组
	 */
	static hexToBytes(hex) {
		const clean = hex.replace(/\s/g, '')
		const bytes = []
		for (let i = 0; i < clean.length; i += 2) {
			bytes.push(parseInt(clean.substr(i, 2), 16))
		}
		return bytes
	}

	/**
	 * 时间戳转日期（本地时间）
	 * 注意：设备返回的时间戳按本地 Date 解析（与参考 BPW6 解析一致）
	 */
	static timestampToDate(timestamp) {
		const date = new Date(timestamp * 1000)
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds(),
			formatted: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`
		}
	}

	/**
	 * 日期转时间戳（本地时间当天0点）
	 * 发送给设备时使用本地时间0点
	 */
	static dateToTimestamp(date) {
		const d = new Date(date)
		// 使用本地时间获取年月日
		const year = d.getFullYear()
		const month = d.getMonth()
		const day = d.getDate()

		// 本地时间0点的时间戳
		const localDate = new Date(year, month, day)
		const timestamp = Math.floor(localDate.getTime() / 1000)

		// console.log('【BPW6日期转时间戳】本地:',
		// 	`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
		// 	'->', timestamp,
		// 	'对应:', new Date(timestamp * 1000).toLocaleString())

		return timestamp
	}

	// ==================== 命令构建 ====================

	/**
	 * 4.1 设置时间/语言（写入手机本地墙钟，与手机当前显示一致）
	 */
	static buildSetTime(date = new Date(), lang = 0) {
		const local = getLocalTimeAllJSON(date)
		const [datePart, timePart] = local.YMDHMS.split(' ')
		const [year, month, day] = datePart.split('-').map(Number)
		const [hour, minute, second] = timePart.split(':').map(Number)
		const payload = [
			this.toBCD(year % 100),
			this.toBCD(month),
			this.toBCD(day),
			this.toBCD(hour),
			this.toBCD(minute),
			this.toBCD(second),
			lang & 0x01
		]
		return this.buildPacket(CMD.SET_TIME, payload)
	}

	/**
	 * 4.2 读取电量
	 */
	static buildReadBattery() {
		return this.buildPacket(CMD.READ_BATTERY)
	}

	/**
	 * 4.3 读取某天运动/睡眠信息
	 */
	static buildReadDailyInfo(daysAgo = 0) {
		return this.buildPacket(CMD.READ_DAILY_INFO, [daysAgo & 0xFF])
	}

	/**
	 * 4.4 读取/设置用户参数
	 */
	static buildSetSettings(isRead = true, params = {}) {
		const payload = [isRead ? 0x01 : 0x02]

		if (!isRead) {
			payload.push(
				params.timeFormat || 0,
				params.unit || 0,
				params.gender || 0,
				params.age || 30,
				params.height || 170,
				params.weight || 65,
				params.strapSize || 12,
				params.hrAlarm || 120
			)
		}

		return this.buildPacket(CMD.READ_SETTINGS, payload)
	}

	/**
	 * 4.5 读取血压历史数据
	 */
	static buildReadBPHistory(timestamp = 0, direction = 0, count = 10) {
		const payload = [
			...this.uint32ToLittleEndian(timestamp),
			direction & 0x01,
			Math.min(count, 50) & 0xFF
		]
		return this.buildPacket(CMD.READ_BP_HISTORY, payload)
	}

	/**
	 * 4.6/4.7 读取自动心率数据
	 * 协议：下发当天时间戳，手环返回该日整天数据（索引包 + 多个数据包，间隔如 5 分钟；无数据填 0）
	 * @param {number} timestamp - 当天本地 0 点 unix 秒
	 */
	static buildReadHRHistory(timestamp) {
		// 确保时间戳有效
		if (!timestamp || timestamp === 0) {
			const now = new Date()
			// 使用本地时间 0 点（与设备 setTime 本地墙钟一致）
			const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
			timestamp = Math.floor(localDate.getTime() / 1000)
		}
		const payload = this.uint32ToLittleEndian(timestamp)
		return this.buildPacket(CMD.READ_HR_HISTORY, payload)
	}

	/**
	 * 4.6 读取自动心率数据（编码格式）
	 * @param {Object} encoded - {year, month, day} year范围为0-199
	 */
	static buildReadHRHistoryEncoded(encoded) {
		const {
			year,
			month,
			day
		} = encoded

		// 编码格式：年月日直接放入payload
		const payload = [
			year & 0xFF,
			month & 0xFF,
			day & 0xFF,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]

		console.log('【构建心率请求-编码格式】', `20${String(year).padStart(2,'0')}-${month}-${day}`)
		return this.buildPacket(CMD.READ_HR_HISTORY, payload)
	}

	/**
	 * 4.7 开关自动心率测量
	 */
	static buildToggleHRAuto(isRead = true, enable = true) {
		const payload = [
			isRead ? 0x01 : 0x02,
			isRead ? 0x00 : (enable ? 0x01 : 0x02)
		]
		return this.buildPacket(CMD.TOGGLE_HR_AUTO, payload)
	}

	/**
	 * 4.8 设置息屏时间
	 */
	static buildSetScreenOff(isRead = true, seconds = 10) {
		const payload = [
			isRead ? 0x01 : 0x02,
			isRead ? 0x00 : (seconds & 0xFF)
		]
		return this.buildPacket(CMD.SET_SCREEN_OFF, payload)
	}

	/**
	 * 4.9 设置目标参数
	 */
	static buildSetGoals(isRead = true, goals = {}) {
		const payload = [isRead ? 0x01 : 0x02]

		if (!isRead) {
			const steps = goals.steps || 6000
			const calories = goals.calories || 2000
			const stand = goals.stand || 12
			const distance = goals.distance || 3000
			const sleep = goals.sleep || 480
			const sport = goals.sport || 60

			payload.push(
				steps & 0xFF, (steps >> 8) & 0xFF, (steps >> 16) & 0xFF,
				calories & 0xFF, (calories >> 8) & 0xFF,
				stand & 0xFF,
				distance & 0xFF, (distance >> 8) & 0xFF, (distance >> 16) & 0xFF,
				sleep & 0xFF, (sleep >> 8) & 0xFF,
				sport & 0xFF, (sport >> 8) & 0xFF
			)
		}

		return this.buildPacket(CMD.SET_GOALS, payload)
	}

	/**
	 * 4.10 开关自动血氧测量
	 */
	static buildToggleSpO2Auto(isRead = true, enable = true) {
		const payload = [
			isRead ? 0x01 : 0x02,
			isRead ? 0x00 : (enable ? 0x01 : 0x02)
		]
		return this.buildPacket(CMD.TOGGLE_SPO2_AUTO, payload)
	}
	/**
	 * 大端字节序转Uint32（时间戳）
	 * 设备返回的时间戳是大端格式！
	 */
	static bigEndianToUint32(bytes, start = 0) {
		return ((bytes[start] << 24) |
			(bytes[start + 1] << 16) |
			(bytes[start + 2] << 8) |
			(bytes[start + 3])) >>> 0
	}

	/**
	 * Uint32转大端字节序
	 */
	static uint32ToBigEndian(value) {
		return [
			(value >> 24) & 0xFF,
			(value >> 16) & 0xFF,
			(value >> 8) & 0xFF,
			value & 0xFF
		]
	}

	/**
	 * 4.11 读取自动血氧数据
	 */
	static buildReadSpO2History(timestamp) {
		if (!timestamp || timestamp === 0) {
			const now = new Date()
			// 修复：使用本地时间0点，与心率保持一致
			const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
			timestamp = Math.floor(localDate.getTime() / 1000)
			// console.log('【构建血氧请求】使用当前本地日期0点:', timestamp, '对应:', new Date(timestamp * 1000).toLocaleString())
		}
		const payload = this.uint32ToLittleEndian(timestamp)
		// console.log('【BPW6构建血氧请求】时间戳:', timestamp, '小端:', payload, '本地时间:', new Date(timestamp * 1000)
		// 	.toLocaleString())
		return this.buildPacket(CMD.READ_SPO2_HISTORY, payload)
	}
	/**
	 * 4.12 查找设备
	 */
	static buildFindDevice() {
		return this.buildPacket(CMD.FIND_DEVICE, [0x55, 0xAA])
	}

	/**
	 * 4.14 读取脉诊测量数据
	 * @param {number} timestamp - 时间戳（小端格式），0表示从最新开始
	 * @param {number} direction - 回溯方向：0=从最新向历史回溯，1=从指定时间戳向历史回溯
	 * @param {number} count - 请求条数（最多50条）
	 */
	static buildReadPulseDiagnosis(timestamp = 0, direction = 0, count = 10) {
		const payload = [
			...this.uint32ToLittleEndian(timestamp),
			direction & 0x01,
			Math.min(count, 50) & 0xFF,
			0, 0, 0, 0, 0, 0, 0, 0, 0
		]
		return this.buildPacket(CMD.READ_PULSE_DIAGNOSIS, payload)
	}

	/**
	 * 4.16 APP设置血压动态测量参数
	 * @param {Object} params
	 * @param {boolean|number} params.enabled - 功能开关 1打开 0关闭
	 * @param {number} params.startHour - 开始时间，单位小时（如21表示21:00开始）
	 * @param {number} params.dayInterval - 白天间隔，单位分钟
	 * @param {number} params.nightInterval - 晚上间隔，单位分钟
	 */
	static buildSetBPDynamicParams(params = {}) {
		const enabled = params.enabled !== undefined ? params.enabled : true
		const payload = [
			(enabled === true || enabled === 1) ? 0x01 : 0x00,
			(params.startHour ?? 21) & 0xFF,
			(params.dayInterval ?? 9) & 0xFF,
			(params.nightInterval ?? 9) & 0xFF
		]
		return this.buildPacket(CMD.SET_BP_DYNAMIC_PARAMS, payload)
	}

	/**
	 * 4.17 APP读取血压动态测量参数
	 */
	static buildReadBPDynamicParams() {
		return this.buildPacket(CMD.READ_BP_DYNAMIC_PARAMS)
	}

	/**
	 * 解析血压动态测量参数响应
	 */
	static parseBPDynamicParams(bytes) {
		const dayInterval = bytes[3]
		const nightInterval = bytes[4]
		const rawStartHour = bytes[2]
		const startHour = this.decodeBPDynamicStartHour(rawStartHour, dayInterval)

		return {
			enabled: bytes[1] === 0x01,
			startHour,
			rawStartHour,
			dayInterval,
			nightInterval,
			startTime: `${String(startHour).padStart(2, '0')}:00`,
			type: 'bp_dynamic_params'
		}
	}

	/**
	 * 解析脉诊测量数据响应
	 */
	static parsePulseDiagnosis(bytes) {
		const cmd = bytes[0] & 0x7F

		// 检查是否执行失败（最高位为1）
		if ((bytes[0] & 0x80) !== 0) {
			return {
				error: true,
				message: '命令执行失败',
				type: 'pulse_error'
			}
		}

		const timestamp = this.littleEndianToUint32(bytes, 1)

		// 无数据：时间戳为 0xFFFFFFFF
		if (timestamp === 0xFFFFFFFF) {
			return {
				empty: true,
				timestamp,
				message: '无脉诊数据',
				type: 'pulse_empty'
			}
		}

		const bloodStasisIndex = bytes[5] // BB: 血瘀指数
		const qiBloodIndex = bytes[6] // CC: 气血指数
		const dampnessIndex = bytes[7] // DD: 湿气指数

		return {
			cmd,
			timestamp,
			date: this.timestampToDate(timestamp),
			bloodStasisIndex, // 血瘀指数
			dampnessIndex, // 湿气指数
			qiBloodIndex, // 气血指数
			type: 'pulse_data'
		}
	}



	/**
	 * 重启设备
	 */
	static buildRestart() {
		return this.buildPacket(CMD.RESTART)
	}

	/**
	 * 4.14 恢复出厂设置
	 */
	static buildFactoryReset() {
		return this.buildPacket(CMD.FACTORY_RESET, [0x66, 0x66])
	}

	// ==================== 0xBC协议包（血压原始 / RRI / PPG） ====================

	/**
	 * CRC16/MODBUS 校验（数据区）
	 */
	static calcCRC16Modbus(data) {
		let crc = 0xFFFF
		const bytes = Array.isArray(data) ? data : this.hexToBytes(data)
		for (let i = 0; i < bytes.length; i++) {
			crc ^= bytes[i]
			for (let j = 0; j < 8; j++) {
				if (crc & 0x0001) {
					crc = (crc >> 1) ^ 0xA001
				} else {
					crc >>= 1
				}
			}
		}
		return crc & 0xFFFF
	}

	/**
	 * 构建 0xBC 扩展协议包
	 * 格式：0xBC CMD AA BB CC DD [Data...]
	 */
	static buildBcPacket(cmd, data = []) {
		const payload = data.map(b => b & 0xFF)
		const dataLen = payload.length
		const crc = dataLen === 0 ?
			BC_PACKET.EMPTY_DATA_CRC :
			this.calcCRC16Modbus(payload)

		return [
			BC_PACKET.HEADER,
			cmd & 0xFF,
			dataLen & 0xFF,
			(dataLen >> 8) & 0xFF,
			crc & 0xFF,
			(crc >> 8) & 0xFF,
			...payload
		]
	}

	/** 钳制 PPG 采集秒数到协议范围 10~60 */
	static clampPpgDurationSeconds(seconds) {
		const n = Number(seconds)
		const fallback = BC_PACKET.PPG_DURATION_MAX
		if (!Number.isFinite(n)) {
			return fallback
		}
		return Math.max(
			BC_PACKET.PPG_DURATION_MIN,
			Math.min(BC_PACKET.PPG_DURATION_MAX, Math.round(n))
		)
	}

	/**
	 * 4.1 APP获取血压原始数据大小（0x2E）
	 * 业务暂未调用，仅协议层预留
	 */
	static buildBpRawGetSize() {
		return this.buildBcPacket(CMD.BP_RAW_GET_SIZE)
	}

	/**
	 * 4.2 APP按偏移获取血压原始数据（0x2F，<=128bytes/包）
	 */
	static buildBpRawGetData(offset = 0) {
		return this.buildBcPacket(CMD.BP_RAW_GET_DATA, this.uint32ToLittleEndian(offset >>> 0))
	}

	/**
	 * 4.3 请求RRI数据（0x48，须开心血管预警；N=1~24组）
	 */
	static buildRriGet(groupCount = 1) {
		const n = Math.max(1, Math.min(BC_PACKET.RRI_MAX_GROUPS, Number(groupCount) || 1))
		return this.buildBcPacket(CMD.RRI_GET, [n & 0xFF])
	}

	/**
	 * 4.4 APP发起PPG测量并设置测量时长（10~60秒）
	 */
	static buildPPGStartWithDuration(seconds) {
		const duration = this.clampPpgDurationSeconds(seconds)
		return this.buildBcPacket(CMD.PPG_START_WITH_DURATION, [duration])
	}

	/**
	 * 4.5 APP发起PPG测量
	 */
	static buildPPGStart() {
		return this.buildBcPacket(CMD.PPG_START)
	}

	/**
	 * 4.5 APP发起PPG测量（带时长，串口实测部分固件走 0x4A+EE）
	 */
	static buildPPGStartWithDurationOn4A(seconds) {
		const duration = this.clampPpgDurationSeconds(seconds)
		return this.buildBcPacket(CMD.PPG_START, [duration])
	}

	/**
	 * 4.6 APP终止PPG测量
	 */
	static buildPPGStop() {
		return this.buildBcPacket(CMD.PPG_STOP)
	}

	/**
	 * 4.7 APP获取PPG数据大小
	 */
	static buildPPGGetSize() {
		return this.buildBcPacket(CMD.PPG_GET_SIZE)
	}

	/**
	 * 4.8 APP按偏移获取PPG数据
	 * @param {number} offset - 偏移位置（bytes）
	 */
	static buildPPGGetData(offset = 0) {
		return this.buildBcPacket(CMD.PPG_GET_DATA, this.uint32ToLittleEndian(offset >>> 0))
	}

	/**
	 * 解析 0xBC 扩展协议响应
	 */
	static parseBcResponse(bytes) {
		if (!bytes || bytes.length < 6) {
			return {
				error: 'BC包长度不足',
				raw: bytes
			}
		}

		if (bytes[0] !== BC_PACKET.HEADER) {
			return {
				error: 'BC包头错误',
				raw: bytes
			}
		}

		const cmd = bytes[1]
		const dataLen = bytes[2] + (bytes[3] << 8)
		const receivedCrc = bytes[4] + (bytes[5] << 8)
		const expectedLen = 6 + dataLen

		if (bytes.length < expectedLen) {
			return {
				error: 'BC包数据不完整',
				cmd,
				dataLen,
				raw: this.bytesToHex(bytes)
			}
		}

		const data = bytes.slice(6, 6 + dataLen)
		const calculatedCrc = dataLen === 0 ?
			BC_PACKET.EMPTY_DATA_CRC :
			this.calcCRC16Modbus(data)

		const result = {
			cmd,
			dataLen,
			data: [...data],
			raw: this.bytesToHex(bytes.slice(0, expectedLen)),
			crcValid: receivedCrc === calculatedCrc
		}

		if (!result.crcValid) {
			console.warn('BC包CRC16校验失败', {
				cmd: cmd.toString(16),
				receivedCrc: receivedCrc.toString(16),
				calculatedCrc: calculatedCrc.toString(16)
			})
		}

		switch (cmd) {
			case CMD.BP_RAW_GET_SIZE:
				result.parsed = this.parseBcSizePayload(data, 'bp_raw_size')
				break
			case CMD.BP_RAW_GET_DATA:
				// 备注版偶发：发0x2E却用0x2F回4字节大小；空包表示无更多数据
				if (dataLen === 0) {
					result.parsed = {
						empty: true,
						offset: 0,
						chunkSize: 0,
						rawData: [],
						type: 'bp_raw_chunk'
					}
				} else if (dataLen === 4) {
					result.parsed = this.parseBcSizePayload(data, 'bp_raw_size')
				} else {
					result.parsed = this.parseBcOffsetChunk(data, 'bp_raw_chunk', 'rawData')
				}
				break
			case CMD.RRI_GET:
				result.parsed = this.parseRriPayload(data)
				break
			case CMD.PPG_START_WITH_DURATION:
			case CMD.PPG_START:
			case CMD.PPG_STOP:
				result.parsed = this.parsePPGCommandResult(data)
				break
			case CMD.PPG_GET_SIZE:
				result.parsed = this.parsePPGSize(data)
				break
			case CMD.PPG_GET_DATA:
				result.parsed = this.parsePPGChunk(data)
				break
			case CMD.PPG_MEASUREMENT_COMPLETE:
				result.parsed = this.parsePPGCommandResult(data)
				break
			default:
				result.parsed = {
					payload: [...data]
				}
		}

		return result
	}

	/**
	 * 解析 PPG 启停命令应答
	 * 0x01=成功 0x00=失败 0x02=已开始/进行中（串口实测 BC 4A → 3E 81 02）
	 */
	static parsePPGCommandResult(data) {
		if (data.length === 0) {
			return {
				success: false,
				status: null,
				type: 'ppg_command'
			}
		}

		const status = data[0]
		const success = status === BC_PACKET.SUCCESS_DATA ||
			status === BC_PACKET.PPG_STATUS_BUSY

		return {
			success,
			status,
			type: 'ppg_command'
		}
	}

	/**
	 * 解析 4字节小端 size（PPG / 血压原始共用）
	 */
	static parseBcSizePayload(data, type = 'bc_size') {
		if (data.length < 4) {
			return {
				error: 'BC数据大小格式错误',
				type
			}
		}
		return {
			size: this.littleEndianToUint32(data, 0),
			type
		}
	}

	/**
	 * 解析 offset(4)+len(1)+payload 分块（PPG / 血压原始共用）
	 */
	static parseBcOffsetChunk(data, type, payloadKey = 'rawData') {
		if (data.length < 5) {
			return {
				error: 'BC数据块格式错误',
				type
			}
		}
		const offset = this.littleEndianToUint32(data, 0)
		const chunkSize = data[4]
		const payload = data.slice(5, 5 + chunkSize)
		return {
			offset,
			chunkSize,
			[payloadKey]: [...payload],
			type
		}
	}

	/**
	 * 解析 PPG 数据大小应答（4字节小端）
	 */
	static parsePPGSize(data) {
		return this.parseBcSizePayload(data, 'ppg_size')
	}

	/**
	 * 解析 PPG 数据块应答
	 * Data区：偏移(4) + 数据大小(1) + PPG数据(n)
	 */
	static parsePPGChunk(data) {
		return this.parseBcOffsetChunk(data, 'ppg_chunk', 'ppgData')
	}

	/**
	 * 将 PPG 原始字节解析为 32 位 ADC 码序列（有符号小端，无单位，200Hz）
	 * 不改变现有上传用的原始字节缓冲，仅作协议层解释
	 */
	static parsePpgAdcSamples(bytes) {
		const list = Array.isArray(bytes) ? bytes : []
		const sampleBytes = BC_PACKET.PPG_ADC_BYTES
		const samples = []
		const usable = list.length - (list.length % sampleBytes)
		for (let i = 0; i < usable; i += sampleBytes) {
			samples.push(this.littleEndianToInt32(list, i))
		}
		const sampleRateHz = BC_PACKET.PPG_SAMPLE_RATE_HZ
		return {
			samples,
			sampleCount: samples.length,
			sampleRateHz,
			sampleBytes,
			unit: null, // 无单位：32位ADC码
			durationSec: sampleRateHz > 0 ? samples.length / sampleRateHz : 0,
			remainderBytes: list.length - usable,
			type: 'ppg_adc'
		}
	}

	/**
	 * 血压原始压力样本（备注版示例多为 16bit 小端 PA）
	 * 业务暂未使用
	 */
	static parseBpRawPressureSamples(bytes) {
		const list = Array.isArray(bytes) ? bytes : []
		const samples = []
		const usable = list.length - (list.length % 2)
		for (let i = 0; i < usable; i += 2) {
			samples.push(this.littleEndianToUint16(list, i))
		}
		return {
			samples,
			sampleCount: samples.length,
			sampleBytes: 2,
			unit: 'PA',
			remainderBytes: list.length - usable,
			type: 'bp_raw_pa'
		}
	}

	/**
	 * 解析 RRI 应答：每字节一个间期，单位 10ms，单组 n<=123
	 */
	static parseRriPayload(data) {
		const raw = Array.isArray(data) ? [...data] : []
		const intervalsMs = raw.map(b => (b & 0xFF) * BC_PACKET.RRI_UNIT_MS)
		return {
			raw,
			intervalsMs,
			count: raw.length,
			unitMs: BC_PACKET.RRI_UNIT_MS,
			type: 'rri_data'
		}
	}

	// ==================== 响应解析 ====================

	/**
	 * 解析响应数据
	 */
	static parseResponse(bytes) {
		if (bytes.length !== 16) {
			return {
				error: '数据长度错误',
				raw: bytes
			}
		}

		const cmd = bytes[0]
		const isError = (cmd & 0x80) !== 0
		const originalCmd = cmd & 0x7F

		// 验证CRC（仅警告，不阻止解析）
		if (!this.verifyCRC(bytes)) {
			console.warn('CRC校验失败')
		}

		const result = {
			cmd: originalCmd,
			isError,
			raw: this.bytesToHex(bytes),
			bytes: [...bytes]
		}

		if (isError) {
			result.error = '设备执行失败'
			if (bytes[1] === 0xEE) {
				result.error = '命令未定义'
			}
			return result
		}
		// console.log("originalCmd", originalCmd)
		switch (originalCmd) {
			case CMD.SET_TIME:
				result.data = {
					success: true,
					language: bytes[1]
				}
				break
			case CMD.FIND_DEVICE:
				result.data = {
					success: bytes[1] === 0x01,
					status: bytes[1]
				}
				break
			case CMD.RESTART:
				result.data = {
					success: bytes[1] === 0x01,
					status: bytes[1]
				}
				break
			case CMD.FACTORY_RESET:
				result.data = {
					success: bytes[1] === 0x01,
					status: bytes[1]
				}
				break
			case CMD.READ_BATTERY:
				result.data = {
					battery: bytes[1]
				}
				break
			case CMD.READ_DAILY_INFO:
				result.data = this.parseDailyInfo(bytes)
				break
			case CMD.READ_SETTINGS:
				result.data = this.parseSettings(bytes)
				break
			case CMD.BP_MEASUREMENT:
				result.data = {
					success: 0x32,
					type: "BP_MEASUREMENT"
				}
				console.log('【解析血压测量响应】', result.data)
				break
			case CMD.BP_DYNAMIC_PARAMS_CHANGED:
				result.data = {
					...this.parseBPDynamicParams(bytes),
					type: 'bp_dynamic_params_changed',
					notify: true
				}
				console.log('【解析血压动态测量参数变更通知】', result.data)
				break
			case CMD.READ_BP_HISTORY:
				result.data = this.parseBPHistory(bytes)
				break
			case CMD.HR_MEASUREMENT:
				console.log('【解析心率测量响应】', bytes)
				break
			case CMD.READ_HR_HISTORY:
				result.data = this.parseHRHistory(bytes)
				break
			case CMD.SpO2_MEASUREMENT:
				result.data = {
					success: 0x39,
					type: "SpO2_MEASUREMENT"
				}
				console.log('【解析血压测量响应】', result.data)
				break
			case CMD.READ_SPO2_HISTORY:
				result.data = this.parseSpO2History(bytes)
				break
			case CMD.READ_PULSE_DIAGNOSIS:
				result.data = this.parsePulseDiagnosis(bytes)
				break;
			case CMD.SET_BP_DYNAMIC_PARAMS:
				result.data = {
					success: true,
					type: 'bp_dynamic_params_set'
				}
				break
			case CMD.READ_BP_DYNAMIC_PARAMS:
				result.data = this.parseBPDynamicParams(bytes)
				break
			case CMD.TOGGLE_HR_AUTO:
			case CMD.TOGGLE_SPO2_AUTO:
			case CMD.SET_SCREEN_OFF:
				result.data = {
					isRead: bytes[1] === 0x01,
					value: bytes[2],
					enabled: bytes[2] === 0x01
				}
				break
			case CMD.SET_GOALS:
				result.data = this.parseGoals(bytes)
				break
			case CMD.DATA_CHANGED:
				result.data = {
					dataType: bytes[1]
				}
				break
			case CMD.BP_SUCCES:
				result.data = {
					dataType: bytes[1]
				}
				break
			default:
				console.warn('未知命令响应:', originalCmd)
				result.data = {
					payload: bytes.slice(1, 15)
				}
		}

		return result
	}

	/**
	 * 解析心率历史数据
	 * 协议格式：
	 * - 索引包：0x15 00 总包数 间隔 00...
	 * - 数据包1：0x15 01 时间戳(4字节) 心率值(9字节)
	 * - 数据包2+：0x15 02 心率值(13字节) 00 00
	 */
	static parseHRHistory(bytes) {
		const packetIndex = bytes[1]

		// 无数据标记
		if (packetIndex === 0xFF) {
			return {
				empty: true,
				error: '该日期无历史数据',
				type: 'hr_empty'
			}
		}

		// 索引包：包序为0
		if (packetIndex === 0) {
			return {
				isIndex: true,
				totalPackets: bytes[2], // 总包数（包括索引包）
				interval: bytes[3], // 测量间隔（分钟）
				type: 'hr_index'
			}
		}

		// 数据包1：有时间戳（字节2-5），9个心率值（字节6-14）
		if (packetIndex === 1) {
			// ✅ 修正：使用正确的小端序解析
			const timestamp = this.littleEndianToUint32(bytes, 2)
			const hrData = []

			// 字节6-14共9个字节，每个字节一个心率值
			for (let i = 6; i <= 14; i++) {
				const value = bytes[i]
				hrData.push(value > 0 && value <= 200 ? value : null)
			}

			return {
				isIndex: false,
				packetIndex,
				hasTimestamp: true,
				timestamp,
				hrData,
				hrDataCount: hrData.length,
				type: 'hr_data'
			}
		}

		// 数据包2+：无时间戳，13个心率值（字节2-14）
		const hrData = []
		for (let i = 2; i <= 14; i++) {
			const value = bytes[i]
			hrData.push(value > 0 && value <= 200 ? value : null)
		}

		return {
			isIndex: false,
			packetIndex,
			hasTimestamp: false,
			timestamp: 0,
			hrData,
			hrDataCount: hrData.length,
			type: 'hr_data'
		}
	}
	/**
	 * 解析血氧历史数据
	 */
	static parseSpO2History(bytes) {
		const packetIndex = bytes[1]

		// 空数据回复: 0x2D FF 00 00 00 00 00 00 00 00 00 00 00 00 00 CRC
		if (packetIndex === 0xFF) {
			return {
				empty: true,
				error: '该日期无历史数据',
				type: 'spo2_empty'
			}
		}

		// 索引包: 0x2D 00 BB CC 00 00 00 00 00 00 00 00 00 00 00 CRC
		if (packetIndex === 0x00) {
			return {
				isIndex: true,
				totalPackets: bytes[2], // 总包数（包括索引包）
				interval: bytes[3], // 测量间隔（分钟，如0x3C=60分钟）
				type: 'spo2_index'
			}
		}

		// ========== 数据包 ==========

		let timestamp = 0
		let dataStartIndex = 0 // 血氧数据开始位置
		let hourOffset = 0 // 本包起始小时偏移

		// 第一个数据包 (0x01): 包含4字节时间戳 + 10字节血氧数据
		if (packetIndex === 0x01) {
			// 小端模式解析时间戳: bytes[2] ~ bytes[5]
			timestamp = this.littleEndianToUint32(bytes, 2)
			dataStartIndex = 6 // 血氧数据从bytes[6]开始
			hourOffset = 0 // 0时开始
		}
		// 后续数据包 (0x02, 0x03...): 只有包序 + 14字节血氧数据，无时间戳
		else {
			dataStartIndex = 2 // 血氧数据从bytes[2]开始（紧接包序）
			// 小时偏移需要根据前面的包计算，这里先返回原始数据，由上层处理
			hourOffset = -1 // 标记为未知，需要上层根据包序推算
			timestamp = 0 // 无时间戳，依赖上次的baseTimestamp
		}

		// 解析血氧数据：每小时一个字节
		const spo2Data = []
		for (let i = dataStartIndex; i <= 14; i++) {
			const value = bytes[i]
			// 值为0表示该小时无数据，跳过
			if (value !== 0) {
				spo2Data.push({
					value: value, // 血氧值（如0x63=99）
					hour: -1, // 具体小时需要上层根据包序和位置计算
					index: i - dataStartIndex // 本包内的索引位置
				})
			}
		}

		return {
			isIndex: false,
			packetIndex,
			timestamp, // 0x01包有值，后续包为0
			dataStartIndex, // 血氧数据开始位置
			hourOffset, // 起始小时偏移（0x01包为0，其他为-1）
			spo2Data, // 血氧数据数组
			rawData: bytes.slice(dataStartIndex, 15), // 原始血氧数据部分
			type: 'spo2_data'
		}
	}

	/**
	 * 解析某天运动/睡眠信息
	 */
	static parseDailyInfo(bytes) {
		const index = bytes[1]
		const daysAgo = bytes[2]

		// BCD 解码：每4位代表一个十进制数字
		const bcdToDec = (bcd) => {
			return ((bcd >> 4) * 10) + (bcd & 0x0F)
		}

		const year = 2000 + bcdToDec(bytes[3])
		const month = bcdToDec(bytes[4])
		const day = bcdToDec(bytes[5])

		// 验证日期有效性
		const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		const dateStr2 = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
		const dateObj = new Date(dateStr)
		const isValidDate = dateObj.getFullYear() === year &&
			(dateObj.getMonth() + 1) === month &&
			dateObj.getDate() === day

		if (index === 0) {
			const steps = (bytes[6] << 16) | (bytes[7] << 8) | bytes[8]
			const calories = (bytes[9] << 8) | bytes[10]
			const stand = bytes[11]
			const distance = (bytes[12] << 16) | (bytes[13] << 8) | bytes[14]

			return {
				index,
				daysAgo,
				date: dateStr,
				isValidDate, // 添加有效性标记
				steps,
				calories,
				standHours: stand,
				distance,
				type: 'activity'
			}
		} else {
			const sleepTotal = (bytes[6] << 8) | bytes[7]
			const sleepDeep = (bytes[8] << 8) | bytes[9]
			const sleepLight = (bytes[10] << 8) | bytes[11]
			const sportTime = (bytes[12] << 8) | bytes[13]
			const caloriesHigh = bytes[14] // NN: 总卡路里的高8位

			return {
				index,
				daysAgo,
				date: dateStr2,
				isValidDate,
				sleepTotal,
				sleepDeep,
				sleepLight,
				sportTime,
				caloriesHigh, // 如果需要可以组合成完整卡路里
				type: 'sleep'
			}
		}
	}

	/**
	 * 解析用户设置
	 */
	static parseSettings(bytes) {
		return {
			is24Hour: bytes[2] === 0,
			isMetric: bytes[3] === 0,
			gender: bytes[4] === 0 ? 'male' : 'female',
			age: bytes[5],
			height: bytes[6],
			weight: bytes[7],
			strapSize: bytes[8],
			hrAlarm: bytes[9],
			type: "0A",
		}
	}

	/**
	 * 解析血压历史数据
	 */
	static parseBPHistory(bytes) {
		const timestamp = this.littleEndianToUint32(bytes, 1)

		if (timestamp === 0xFFFFFFFF || (bytes[5] === 0 && bytes[6] === 0)) {
			return {
				empty: true,
				timestamp: 0xFFFFFFFF
			}
		}

		const diastolic = bytes[5]
		const systolic = bytes[6]
		const pulse = bytes[7]

		return {
			type: "BPdata",
			timestamp,
			date: this.timestampToDate(timestamp),
			diastolic,
			systolic,
			pulse,
			bpLevel: this.getBPLevel(systolic, diastolic)
		}
	}

	/**
	 * 解析目标参数
	 */
	static parseGoals(bytes) {
		const steps = bytes[2] | (bytes[3] << 8) | (bytes[4] << 16)
		const calories = bytes[5] | (bytes[6] << 8)
		const stand = bytes[7]
		const distance = bytes[8] | (bytes[9] << 8) | (bytes[10] << 16)
		const sleep = bytes[11] | (bytes[12] << 8)
		const sport = bytes[13] | (bytes[14] << 8)

		return {
			steps,
			calories,
			stand,
			distance,
			sleep,
			sport
		}
	}

	/**
	 * 血压分级（中国标准）
	 */
	static getBPLevel(systolic, diastolic) {
		if (systolic < 120 && diastolic < 80) return {
			level: 'normal',
			text: '正常'
		}
		if (systolic < 130 && diastolic < 85) return {
			level: 'normal_high',
			text: '正常高值'
		}
		if (systolic < 140 && diastolic < 90) return {
			level: 'mild',
			text: '轻度高血压'
		}
		if (systolic < 160 && diastolic < 100) return {
			level: 'moderate',
			text: '中度高血压'
		}
		if (systolic < 180 && diastolic < 110) return {
			level: 'severe',
			text: '重度高血压'
		}
		return {
			level: 'danger',
			text: '危险'
		}
	}
}