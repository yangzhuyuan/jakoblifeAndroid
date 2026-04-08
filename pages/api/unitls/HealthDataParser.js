/**
 * 健康数据协议解析器（血压 + 心率）
 */
class HealthDataParser {

	/**
	 * 将16进制字符串转为二进制字符串
	 */
	hexToBinary(hex) {
		return parseInt(hex, 16).toString(2).padStart(16, '0');
	}

	/**
	 * 解析时间戳（大端序，16bit）
	 * 格式：1bit预留 + 6bit年 + 4bit月 + 5bit日
	 */
	parseBinaryTime(hexTime) {
		const binaryTime = this.hexToBinary(hexTime);
		const year = parseInt(binaryTime.slice(1, 7), 2) + 2000;
		const month = String(parseInt(binaryTime.slice(7, 11), 2)).padStart(2, '0');
		const day = String(parseInt(binaryTime.slice(11), 2)).padStart(2, '0');
		return {
			year,
			month,
			day,
			datealltime: `${year}-${month}-${day}`
		};
	}

	/**
	 * 将秒数转为 HH:MM:SS
	 */
	secondsToTime(seconds) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}

	/**
	 * 解析单条血压数据（8 Byte）
	 */
	parseBloodPressureData(hexData) {
		// hexData: 16字符 = 8 Byte
		const seconds = parseInt(hexData.slice(0, 8), 16); // 4 Byte
		const bpType = parseInt(hexData.slice(8, 10), 16); // 1 Byte
		const isAuto = parseInt(hexData.slice(10, 12), 16); // 1 Byte
		const highPressure = parseInt(hexData.slice(12, 14), 16); // 1 Byte
		const lowPressure = parseInt(hexData.slice(14, 16), 16); // 1 Byte

		return {
			seconds,
			time: this.secondsToTime(seconds),
			bpType,
			isAuto: isAuto === 1,
			measureMode: isAuto === 1 ? '自动' : '手动',
			highPressure,
			lowPressure,
			unit: 'mmHg'
		};
	}

	/**
	 * 解析心率数据（8 Byte）
	 */
	parseHeartRateData(hexData) {
		const seconds = parseInt(hexData.slice(0, 8), 16);
		const hrType = parseInt(hexData.slice(8, 10), 16);
		const isAuto = parseInt(hexData.slice(10, 12), 16);
		const reserved = parseInt(hexData.slice(12, 14), 16);
		const heartRate = parseInt(hexData.slice(14, 16), 16);

		return {
			seconds,
			time: this.secondsToTime(seconds),
			hrType,
			isAuto: isAuto === 1,
			measureMode: isAuto === 1 ? '自动' : '手动',
			reserved,
			heartRate,
			unit: 'bpm'
		};
	}

	/**
	 * 解析KeyValue数据体（自动识别血压/心率）
	 */
	parseKeyValue(payloadHex, dataType = 'bloodPressure') {
		// 数据头 4 Byte = 8字符
		const headerHex = payloadHex.slice(0, 8);
		const timestampHex = headerHex.slice(0, 4); // 2 Byte
		const reserved = headerHex.slice(4, 6); // 1 Byte
		const count = parseInt(headerHex.slice(6, 8), 16); // 1 Byte

		const dateInfo = this.parseBinaryTime(timestampHex);

		// 选择解析器
		const parseRecord = dataType === 'heartRate' ?
			this.parseHeartRateData.bind(this) :
			this.parseBloodPressureData.bind(this);

		// 解析N条数据
		const records = [];
		const dataStart = 8; // 数据头之后

		for (let i = 0; i < count; i++) {
			const start = dataStart + (i * 16); // 每条16字符
			const recordHex = payloadHex.slice(start, start + 16);
			const recordData = parseRecord(recordHex);
			records.push({
				index: i + 1,
				date: dateInfo.datealltime,
				...recordData
			});
		}

		return {
			dataType,
			date: dateInfo,
			count,
			records
		};
	}

	/**
	 * 解析完整协议数据（主入口）
	 * 根据 Protocolsubcommand 自动判断：01=血压, 00=心率
	 */
	parseProtocolData(protocolObj) {
		const {
			Protocollength,
			Protocolcalibrationposition,
			Protocolcommand,
			Versionprotocol,
			Protocolsubcommand,
			Commandlinelength,
			Covmamlueand // 数据负载
		} = protocolObj;

		// 解析协议头
		const protocolHeader = {
			totalLength: parseInt(Protocollength, 16),
			checksum: Protocolcalibrationposition,
			command: parseInt(Protocolcommand, 16),
			version: parseInt(Versionprotocol, 16),
			subCommand: parseInt(Protocolsubcommand, 16),
			payloadLength: parseInt(Commandlinelength, 16)
		};

		// 根据子命令判断数据类型
		const dataType = protocolHeader.subCommand === 0 ? 'heartRate' : 'bloodPressure';

		// 解析数据负载
		const keyValue = this.parseKeyValue(Covmamlueand, dataType);

		return {
			header: protocolHeader,
			data: keyValue,
			raw: {
				payload: Covmamlueand
			}
		};
	}

	/**
	 * 便捷方法：仅解析血压
	 */
	parseBloodPressure(protocolObj) {
		return this.parseProtocolData(protocolObj);
	}

	/**
	 * 便捷方法：仅解析心率
	 */
	parseHeartRate(protocolObj) {
		// 强制指定为心率类型
		const result = this.parseProtocolData(protocolObj);
		if (result.data.dataType !== 'heartRate') {
			// 重新按心率解析
			result.data = this.parseKeyValue(protocolObj.Covmamlueand, 'heartRate');
		}
		return result;
	}
}

// 保持向后兼容的别名
const BloodPressureParser = HealthDataParser;

// 导出
export {
	HealthDataParser,
	BloodPressureParser
};