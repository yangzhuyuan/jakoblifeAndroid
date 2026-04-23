// protocol/u16pro-protocol.js
import {
	CMD,
	RESPONSE_MASK
} from './u16pro-constants.js'

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
	 * BCD编码（用于时间设置）
	 */
	static toBCD(value) {
		return ((Math.floor(value / 10) << 4) | (value % 10)) & 0xFF
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
	 * 注意：设备返回的时间戳是本地时间（已含时区偏移）
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

		console.log('【日期转时间戳】本地:',
			`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
			'->', timestamp,
			'对应:', new Date(timestamp * 1000).toLocaleString())

		return timestamp
	}

	// ==================== 命令构建 ====================

	/**
	 * 4.1 设置时间/语言
	 */
	static buildSetTime(date, lang = 0) {
		const payload = [
			this.toBCD(date.getFullYear() % 100),
			this.toBCD(date.getMonth() + 1),
			this.toBCD(date.getDate()),
			this.toBCD(date.getHours()),
			this.toBCD(date.getMinutes()),
			this.toBCD(date.getSeconds()),
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
	 * 4.6 读取自动心率数据
	 * @param {number} timestamp - 日期时间戳（当天UTC 0点）
	 */
	static buildReadHRHistory(timestamp) {
		console.log('【构建读取自动心率数据命令】', timestamp)

		// 确保时间戳有效
		if (!timestamp || timestamp === 0) {
			const now = new Date()
			// 修复：使用本地时间0点，不是UTC
			const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
			timestamp = Math.floor(localDate.getTime() / 1000)
			console.log('【构建心率请求】使用当前本地日期0点:', timestamp, '对应:', new Date(timestamp * 1000).toLocaleString())
		}

		const payload = this.uint32ToLittleEndian(timestamp)
		console.log('【构建心率请求】时间戳:', timestamp, '小端:', payload, '本地时间:', new Date(timestamp * 1000).toLocaleString())
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
			console.log('【构建血氧请求】使用当前本地日期0点:', timestamp, '对应:', new Date(timestamp * 1000).toLocaleString())
		}
		const payload = this.uint32ToLittleEndian(timestamp)
		console.log('【构建血氧请求】时间戳:', timestamp, '小端:', payload, '本地时间:', new Date(timestamp * 1000).toLocaleString())
		return this.buildPacket(CMD.READ_SPO2_HISTORY, payload)
	}



	/**
	 * 4.12 查找设备
	 */
	static buildFindDevice() {
		return this.buildPacket(CMD.FIND_DEVICE, [0x55, 0xAA])
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
			case CMD.READ_BP_HISTORY:
				result.data = this.parseBPHistory(bytes)
				break
			case CMD.READ_HR_HISTORY:
				result.data = this.parseHRHistory(bytes)
				break
			case CMD.READ_SPO2_HISTORY:
				result.data = this.parseSpO2History(bytes)
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

		if (packetIndex === 0xFF) {
			return {
				empty: true,
				error: '该日期无历史数据',
				type: 'spo2_empty'
			}
		}

		if (packetIndex === 0) {
			return {
				isIndex: true,
				totalPackets: bytes[2],
				interval: bytes[3],
				type: 'spo2_index'
			}
		}

		const timestamp = this.littleEndianToUint32(bytes, 2)
		const spo2Data = []

		for (let i = 6; i <= 14; i += 2) {
			if (i + 1 <= 14) {
				const maxVal = bytes[i]
				const minVal = bytes[i + 1]
				if (maxVal > 0 || minVal > 0) {
					spo2Data.push({
						max: maxVal,
						min: minVal,
						hour: Math.floor((i - 6) / 2)
					})
				}
			} else if (i <= 14) {
				const maxVal = bytes[i]
				if (maxVal > 0) {
					spo2Data.push({
						max: maxVal,
						min: maxVal,
						hour: Math.floor((i - 6) / 2)
					})
				}
			}
		}

		return {
			isIndex: false,
			packetIndex,
			timestamp,
			date: this.timestampToDate(timestamp),
			spo2Data,
			rawData: bytes.slice(6, 15),
			type: 'spo2_data'
		}
	}

	/**
	 * 解析某天运动/睡眠信息
	 */
	static parseDailyInfo(bytes) {
		const index = bytes[1]
		const daysAgo = bytes[2]
		const year = 2000 + bytes[3]
		const month = bytes[4]
		const day = bytes[5]

		if (index === 0) {
			const steps = (bytes[6] << 16) | (bytes[7] << 8) | bytes[8]
			const calories = (bytes[9] << 8) | bytes[10]
			const stand = bytes[11]
			const distance = (bytes[12] << 16) | (bytes[13] << 8) | bytes[14]

			return {
				index,
				daysAgo,
				date: `${year}-${month}-${day}`,
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

			return {
				index,
				daysAgo,
				date: `${year}-${month}-${day}`,
				sleepTotal,
				sleepDeep,
				sleepLight,
				sportTime,
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
			hrAlarm: bytes[9]
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