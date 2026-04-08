/**
 * 手表蓝牙协议工具类
 * 协议版本号: 0x01
 * 协议标识位: 0xE0
 * ACK标识位: 0x0E
 */

// 天气状态映射 (根据和风天气图标转协议格式)
const WEATHER_MAP = {
	// 晴
	'100': 0x00, // 晴
	'150': 0x00, // 晴
	// 阴/多云
	'101': 0x01, // 多云
	'102': 0x01, // 少云
	'103': 0x01, // 晴间多云
	'104': 0x01, // 阴
	// 雾/霾 (映射为阴)
	'501': 0x01, // 雾
	'502': 0x01, // 霾
	'503': 0x01, // 扬沙
	'504': 0x01, // 浮尘
	'505': 0x01, // 沙尘暴
	'506': 0x01, // 强沙尘暴
	'507': 0x01, // 龙卷风
	'508': 0x01, // 尘卷风
	'509': 0x01, // 浓雾
	'510': 0x01, // 强浓雾
	'511': 0x01, // 中度霾
	'512': 0x01, // 重度霾
	'513': 0x01, // 严重霾
	'514': 0x01, // 大雾
	'515': 0x01, // 特强浓雾
	// 雨
	'300': 0x02, // 阵雨
	'301': 0x02, // 强阵雨
	'302': 0x02, // 雷阵雨
	'303': 0x02, // 强雷阵雨
	'304': 0x02, // 雷阵雨伴有冰雹
	'305': 0x02, // 小雨
	'306': 0x02, // 中雨
	'307': 0x02, // 大雨
	'308': 0x02, // 极端降雨
	'309': 0x02, // 毛毛雨
	'310': 0x02, // 暴雨
	'311': 0x02, // 大暴雨
	'312': 0x02, // 特大暴雨
	'313': 0x02, // 冻雨
	'314': 0x02, // 小到中雨
	'315': 0x02, // 中到大雨
	'316': 0x02, // 大到暴雨
	'317': 0x02, // 暴雨到大暴雨
	'318': 0x02, // 大暴雨到特大暴雨
	'399': 0x02, // 雨
	// 雪
	'400': 0x03, // 小雪
	'401': 0x03, // 中雪
	'402': 0x03, // 大雪
	'403': 0x03, // 暴雪
	'404': 0x03, // 雨夹雪
	'405': 0x03, // 雨雪天气
	'406': 0x03, // 阵雨夹雪
	'407': 0x03, // 阵雪
	'408': 0x03, // 小到中雪
	'409': 0x03, // 中到大雪
	'410': 0x03, // 大到暴雪
	'499': 0x03, // 雪
	// 默认
	'999': 0x01 // 默认阴
};

// 空气质量映射
const AQI_MAP = {
	'1': 0x00, // 优
	'2': 0x01, // 良
	'3': 0x01, // 轻度污染(映射为良)
	'4': 0x02, // 中度污染(映射为差)
	'5': 0x02, // 重度污染(映射为差)
	'6': 0x02 // 严重污染(映射为差)
};

export default {
	/**
	 * UTF-8编码函数 (替代TextEncoder)
	 * @param {String} str 
	 * @returns {Array} 字节数组
	 */
	utf8ToBytes(str) {
		if (!str) return [];

		const bytes = [];
		for (let i = 0; i < str.length; i++) {
			const charCode = str.charCodeAt(i);

			if (charCode < 0x80) {
				// 单字节字符 (ASCII)
				bytes.push(charCode);
			} else if (charCode < 0x800) {
				// 双字节字符
				bytes.push(0xC0 | (charCode >> 6));
				bytes.push(0x80 | (charCode & 0x3F));
			} else if (charCode < 0xD800 || charCode >= 0xE000) {
				// 三字节字符
				bytes.push(0xE0 | (charCode >> 12));
				bytes.push(0x80 | ((charCode >> 6) & 0x3F));
				bytes.push(0x80 | (charCode & 0x3F));
			} else {
				// 四字节字符 (代理对)
				i++;
				const nextCharCode = str.charCodeAt(i);
				const codePoint = ((charCode & 0x3FF) << 10) | (nextCharCode & 0x3FF) + 0x10000;

				bytes.push(0xF0 | (codePoint >> 18));
				bytes.push(0x80 | ((codePoint >> 12) & 0x3F));
				bytes.push(0x80 | ((codePoint >> 6) & 0x3F));
				bytes.push(0x80 | (codePoint & 0x3F));
			}
		}

		return bytes;
	},

	/**
	 * 生成当前天气命令 (KEY:0x00)
	 * @param {Object} weatherData - 和风天气数据
	 * @param {Object} location - 位置信息
	 * @returns {ArrayBuffer} - 蓝牙发送的数据
	 */
	buildCurrentWeatherCommand(weatherData, location) {
		try {
			// console.log('开始生成天气命令, 输入数据:', {
			// 	weatherData,
			// 	location
			// });
			// 1. 日期戳 (当前日期)
			const today = new Date();
			const year = today.getFullYear() - 2000; // 与2000年差值
			const month = today.getMonth() + 1;
			const day = today.getDate();

			// console.log('日期信息:', {
			// 	year,
			// 	month,
			// 	day
			// });

			// 组装日期戳 (2字节)
			// 预留1bit + 年6bit + 月4bit + 日5bit
			let dateValue = (0 << 15) | ((year & 0x3F) << 9) | ((month & 0x0F) << 5) | (day & 0x1F);
			const dateBytes = [
				(dateValue >> 8) & 0xFF, // 高位
				dateValue & 0xFF // 低位
			];

			// console.log('日期戳字节:', this.bytesToHex(dateBytes));

			// 2. 天气状态 (1字节)
			const weatherCode = weatherData.current?.icon || '104';
			const weatherState = WEATHER_MAP[weatherCode] || 0x01;
			// console.log('天气状态:', {
			// 	weatherCode,
			// 	weatherState
			// });

			// 3. 空气指数 (1字节)
			const aqi = weatherData.current?.aqi || '1';
			const airQuality = AQI_MAP[aqi] || 0x01;
			// console.log('空气质量:', {
			// 	aqi,
			// 	airQuality
			// });

			// 4. 温度转换函数
			const encodeTemperature = (temp) => {
				const value = parseInt(temp) || 0;
				const isPositive = value >= 0 ? 1 : 0;
				const absValue = Math.min(Math.abs(value), 63); // 6bit最大值63
				// 预留1bit(0) + 正负1bit + 温度值6bit
				return (0 << 7) | (isPositive << 6) | (absValue & 0x3F);
			};

			// 当前气温
			const currentTemp = encodeTemperature(weatherData.current?.temp || 0);
			// console.log('当前气温:', weatherData.current?.temp, '->', currentTemp.toString(16));

			// 今日高温 (从预报中取)
			const todayStr = today.toISOString().split('T')[0];
			const todayForecast = weatherData.forecast?.find(f => f.date === todayStr) ||
				weatherData.forecast?.[0] || {};
			const highTemp = encodeTemperature(todayForecast.tempMax || 0);
			const lowTemp = encodeTemperature(todayForecast.tempMin || 0);
			// console.log('气温范围:', {
			// 	high: todayForecast.tempMax,
			// 	low: todayForecast.tempMin
			// });

			// 5. 气压 (2字节)
			const pressure = parseInt(weatherData.current?.pressure || 0);
			const pressureBytes = [
				(pressure >> 8) & 0xFF, // 高位
				pressure & 0xFF // 低位
			];
			// console.log('气压:', pressure, '->', this.bytesToHex(pressureBytes));

			// 6. 湿度 (1字节)
			const humidity = parseInt(weatherData.current?.humidity || 0);
			// console.log('湿度:', humidity);

			// 7. 城市名称 (UTF-8编码)
			const cityName = location?.name || location?.adm2 || '';
			const cityNameBytes = this.utf8ToBytes(cityName);
			// console.log('城市名称:', cityName, 'UTF-8字节:', this.bytesToHex(cityNameBytes));

			// 组装KeyValue
			const keyValue = [
				...dateBytes, // 2字节
				weatherState, // 1字节
				airQuality, // 1字节
				currentTemp, // 1字节
				highTemp, // 1字节
				lowTemp, // 1字节
				...pressureBytes, // 2字节
				humidity, // 1字节
				...cityNameBytes // N字节
			];

			// console.log('KeyValue:', this.bytesToHex(keyValue));
			// console.log('KeyValue长度:', keyValue.length);

			// 命令指令长度 (KeyValueLen)
			const keyValueLen = keyValue.length;
			const keyValueLenBytes = [
				(keyValueLen >> 8) & 0xFF, // 高位(预留7位应为0)
				keyValueLen & 0xFF // 低位
			];

			// 协议长度 = 总长度 - 4
			// 总长度 = 标识(1) + 长度(2) + 校验(1) + 命令(1) + 版本(1) + KEY(1) + 指令长度(2) + KeyValue(N)
			const totalLength = 1 + 2 + 1 + 1 + 1 + 1 + 2 + keyValueLen;
			const protocolLength = totalLength - 4;
			const protocolLengthBytes = [
				(protocolLength >> 8) & 0xFF, // 高位(预留7位应为0)
				protocolLength & 0xFF // 低位
			];

			// console.log('协议长度:', {
			// 	totalLength,
			// 	protocolLength
			// });

			// 组装完整协议(暂不包含校验和)
			const protocolWithoutChecksum = [
				0xE0, // 协议标识位
				...protocolLengthBytes, // 协议长度
				0x00, // 协议校准位(暂填0)
				0x05, // 协议命令(天气)
				0x01, // 协议版本号
				0x00, // 协议子命令(当前天气)
				...keyValueLenBytes, // 命令指令长度
				...keyValue // 命令指令值
			];

			// console.log('协议(无校验):', this.bytesToHex(protocolWithoutChecksum));

			// 计算校验和(除去校验字节本身)
			let sum = 0;
			for (let i = 0; i < protocolWithoutChecksum.length; i++) {
				if (i !== 3) { // 跳过校验和字节(索引3)
					sum += protocolWithoutChecksum[i];
				}
			}
			const checksum = sum & 0xFF;

			// console.log('校验和计算:', {
			// 	sum,
			// 	checksum: checksum.toString(16)
			// });

			// 填入校验和
			protocolWithoutChecksum[3] = checksum;

			// 转换为ArrayBuffer
			const buffer = new ArrayBuffer(protocolWithoutChecksum.length);
			const view = new Uint8Array(buffer);
			view.set(protocolWithoutChecksum);

			// console.log('✅ 生成的天气命令:', this.bytesToHex(protocolWithoutChecksum).trim());

			return buffer;

		} catch (error) {
			console.error('❌ 生成天气命令失败:', error);
			console.error('错误堆栈:', error.stack);
			return null;
		}
	},

	/**
	 * 解析ACK响应
	 * @param {ArrayBuffer} buffer - 收到的ACK数据
	 * @returns {Object} - 解析结果
	 */
	parseAckResponse(buffer) {
		try {
			const bytes = new Uint8Array(buffer);

			if (bytes.length < 10) {
				return {
					success: false,
					error: '数据长度不足'
				};
			}

			// 解析ACK
			const ackFlag = bytes[0]; // 应为0x0E
			const length = (bytes[1] << 8) | bytes[2];
			const checksum = bytes[3];
			const cmd = bytes[4];
			const version = bytes[5];
			const key = bytes[6];
			const keyValueLen = (bytes[7] << 8) | bytes[8];
			const errorCode = bytes[9];

			// 校验和验证
			let sum = 0;
			for (let i = 0; i < bytes.length; i++) {
				if (i !== 3) sum += bytes[i];
			}
			const calcChecksum = sum & 0xFF;
			const checksumValid = (calcChecksum === checksum);

			// 错误码映射
			const errorMap = {
				0x00: '协议正确',
				0x01: '协议标志位错误',
				0x02: '协议长度错误',
				0x03: '协议校准位错误',
				0x04: '命令指令长度错误',
				0x05: '协议版本号错误',
				0x06: '协议命令错误',
				0x07: '协议命令指令错误',
				0x08: '设置睡眠时间段失败'
			};

			const result = {
				success: errorCode === 0x00,
				ackFlag: ackFlag,
				length: length,
				checksum: checksum,
				checksumValid: checksumValid,
				cmd: cmd,
				version: version,
				key: key,
				keyValueLen: keyValueLen,
				errorCode: errorCode,
				errorMessage: errorMap[errorCode] || '未知错误',
				rawData: this.bytesToHex(bytes)
			};

			console.log('ACK解析结果:', result);
			return result;

		} catch (error) {
			console.error('解析ACK失败:', error);
			return {
				success: false,
				error: error.message
			};
		}
	},

	/**
	 * 字节数组转十六进制字符串
	 * @param {Uint8Array|Array} bytes 
	 * @returns {String}
	 */
	bytesToHex(bytes) {
		if (!bytes) return '';
		return Array.from(bytes)
			.map(b => b.toString(16).padStart(2, '0'))
			.join('');
	},

	/**
	 * 十六进制字符串转字节数组
	 * @param {String} hexStr - 如 "e0 00 15 4b"
	 * @returns {Uint8Array}
	 */
	hexToBytes(hexStr) {
		const hex = hexStr.replace(/\s+/g, '');
		const bytes = [];
		for (let i = 0; i < hex.length; i += 2) {
			bytes.push(parseInt(hex.substr(i, 2), 16));
		}
		return new Uint8Array(bytes);
	}
};