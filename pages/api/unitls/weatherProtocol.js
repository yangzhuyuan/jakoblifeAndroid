/**
 * 天气预报协议编码器 - 符合完整协议规范
 * 
 * 协议格式:
 * 0xE0 | 协议长度(2B) | sumcheck(1B) | CMD(1B) | Version(1B) | KEY(1B) | KeyValueLen(2B) | KeyValue
 * 
 * 天气预报具体数据 (KEY:0x01):
 * KeyValue = 预报数据数量(1B) + 天气数据(5B * 7天) + 城市名称(NB, UTF-8)
 */
class WeatherForecastEncoder {
	constructor() {
		this.bytes = [];
	}

	/**
	 * 从天气数据编码
	 * @param {Object} weatherData - 天气数据对象
	 * @param {Object} options - 配置选项
	 * @returns {Uint8Array} 编码后的二进制数据
	 */
	encodeFromWeatherData(weatherData, options = {}) {
		if (!weatherData) {
			throw new Error('无效的天气数据');
		}

		const {
			cmd = 0x05, // 天气命令
				version = 0x01, // 协议版本号
				key = 0x01, // 天气预报KEY
		} = options;

		const location = weatherData.location || {};
		const forecast = weatherData.forecast || [];

		// 确保是7天预报
		const forecast7Days = this._ensure7Days(forecast);

		return this.encode({
			cmd,
			version,
			key,
			days: 7,
			forecast: forecast7Days,
			cityName: location.name || location.adm2 || '',
		});
	}

	/**
	 * 确保有7天预报数据
	 */
	_ensure7Days(forecast) {
		const result = [];

		// 复制前7天
		for (let i = 0; i < 7; i++) {
			if (i < forecast.length && forecast[i]) {
				result.push(forecast[i]);
			} else {
				// 补全缺失的数据
				const date = new Date();
				date.setDate(date.getDate() + i);
				result.push({
					date: this._formatDate(date),
					weatherDay: '晴',
					iconDay: '100',
					tempMax: '20',
					tempMin: '10'
				});
			}
		}

		return result;
	}

	/**
	 * 格式化日期为 YYYY-MM-DD
	 */
	_formatDate(date) {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	/**
	 * 编码天气预报数据
	 * @param {Object} params - 编码参数
	 * @returns {Uint8Array} 编码后的二进制数据
	 */
	encode(params) {
		const {
			cmd = 0x05,
				version = 0x01,
				key = 0x01,
				days = 7,
				forecast = [],
				cityName = ''
		} = params;

		// 重置
		this.bytes = [];

		// 1. 协议标识位 (1字节)
		this._writeByte(0xE0);

		// 2. 协议长度 (2字节) - 先占位
		this._writeByte(0x00);
		this._writeByte(0x00);

		// 3. 协议校准位 (1字节) - 先占位
		this._writeByte(0x00);

		// 4. 协议命令 (1字节)
		this._writeByte(cmd);

		// 5. 协议版本号 (1字节)
		this._writeByte(version);

		// 6. 协议子命令/KEY (1字节)
		this._writeByte(key);

		// 7. 命令指令长度 (2字节) - KeyValueLen，先占位
		this._writeByte(0x00);
		this._writeByte(0x00);

		// 记录KeyValue开始位置
		const keyValueStart = this.bytes.length;

		// 8. KeyValue数据
		// 8.1 预报数据数量 (1字节) - 强制7天
		this._writeByte(7);

		// 8.2 天气数据 (5字节 * 7天)
		for (let i = 0; i < 7; i++) {
			const dayData = forecast[i] || this._getDefaultDayData(i);
			this._writeWeatherData(dayData);
		}

		// 8.3 城市名称 (UTF-8编码)
		this._writeCityName(cityName);

		// 计算KeyValue长度
		const keyValueLen = this.bytes.length - keyValueStart;

		// 更新协议长度 (协议数据-4)
		const totalLength = this.bytes.length;
		const protocolLength = totalLength - 4;
		this.bytes[1] = (protocolLength >> 8) & 0xFF;
		this.bytes[2] = protocolLength & 0xFF;

		// 更新命令指令长度 (KeyValueLen)
		this.bytes[7] = (keyValueLen >> 8) & 0xFF;
		this.bytes[8] = keyValueLen & 0xFF;

		// 计算并更新sumcheck
		this._updateSumCheck();

		return new Uint8Array(this.bytes);
	}

	/**
	 * 更新协议校准位 (sumcheck)
	 * 除去该字节，整个协议字节数据相加取和的后8位
	 */
	_updateSumCheck() {
		let sum = 0;
		// 从第0字节开始，跳过第3字节(sumcheck本身)
		for (let i = 0; i < this.bytes.length; i++) {
			if (i !== 3) {
				sum += this.bytes[i];
			}
		}
		// 取后8位
		this.bytes[3] = sum & 0xFF;
	}

	/**
	 * 写入单个字节
	 */
	_writeByte(value) {
		this.bytes.push(value & 0xFF);
	}

	/**
	 * 获取默认天气数据
	 */
	_getDefaultDayData(dayOffset) {
		const date = new Date();
		date.setDate(date.getDate() + dayOffset);
		return {
			date: this._formatDate(date),
			weatherDay: '晴',
			iconDay: '100',
			tempMax: 20,
			tempMin: 10
		};
	}

	/**
	 * 写入天气数据（5字节）
	 */
	_writeWeatherData(day) {
		// 1. 日期戳 (2字节)
		this._writeDateStamp(day.date);

		// 2. 天气状态 (1字节)
		this._writeWeatherState(day.iconDay || day.weatherDay);

		// 3. 最高温度 (1字节)
		this._writeTemperature(day.tempMax);

		// 4. 最低温度 (1字节)
		this._writeTemperature(day.tempMin);
	}

	/**
	 * 写入日期戳（2字节）
	 * 格式: 预留(1bit) + 年(6bit) + 月(4bit) + 日(5bit)
	 */
	_writeDateStamp(dateStr) {
		let d;
		if (dateStr instanceof Date) {
			d = dateStr;
		} else if (typeof dateStr === 'string') {
			const parts = dateStr.split('-');
			if (parts.length === 3) {
				d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
			} else {
				d = new Date();
			}
		} else {
			d = new Date();
		}

		// 计算与2000年的差值
		const year = d.getFullYear();
		const yearOffset = year - 2000; // 6bit: 0-63
		const month = d.getMonth() + 1; // 4bit: 1-12
		const day = d.getDate(); // 5bit: 1-31

		// 组合日期戳 (16位)
		// bit15: 预留(0)
		// bit14-9: 年(6bit)
		// bit8-5: 月(4bit)
		// bit4-0: 日(5bit)
		let dateValue = 0;
		dateValue |= (yearOffset & 0x3F) << 9; // 年放到bit9-14
		dateValue |= (month & 0x0F) << 5; // 月放到bit5-8
		dateValue |= (day & 0x1F); // 日放到bit0-4

		// 写入2字节（大端序）
		this._writeByte((dateValue >> 8) & 0xFF);
		this._writeByte(dateValue & 0xFF);
	}

	/**
	 * 天气状态映射表
	 */
	static WEATHER_MAP = {
		"100": 0, // 晴
		"101": 1, // 多云 -> 阴
		"102": 1, // 少云 -> 阴
		"103": 1, // 晴间多云 -> 阴
		"104": 1, // 阴
		"300": 2, // 雨
		"301": 2, // 雨
		"302": 2, // 雨
		"303": 2, // 雨
		"304": 2, // 雨
		"305": 2, // 雨
		"306": 2, // 雨
		"307": 2, // 雨
		"308": 2, // 雨
		"309": 2, // 雨
		"310": 2, // 雨
		"311": 2, // 雨
		"312": 2, // 雨
		"400": 3, // 雪
		"401": 3, // 雪
		"402": 3, // 雪
		"403": 3, // 雪
		"404": 3, // 雪
		"405": 3, // 雪
		"406": 3, // 雪
		"407": 3, // 雪
	};

	/**
	 * 写入天气状态（1字节）
	 * 0:晴、1:阴、2:雨、3:雪
	 */
	_writeWeatherState(weatherStr) {
		let code = 0; // 默认晴

		if (typeof weatherStr === 'number') {
			code = weatherStr;
		} else if (typeof weatherStr === 'string') {
			// 优先使用icon代码映射
			if (WeatherForecastEncoder.WEATHER_MAP[weatherStr] !== undefined) {
				code = WeatherForecastEncoder.WEATHER_MAP[weatherStr];
			} else {
				const str = weatherStr.toLowerCase();
				if (str.includes('雨') || str.includes('rain')) {
					code = 2;
				} else if (str.includes('雪') || str.includes('snow')) {
					code = 3;
				} else if (str.includes('阴') || str.includes('cloud') || str.includes('overcast')) {
					code = 1;
				} else if (str.includes('多云')) {
					code = 1; // 多云映射为阴
				} else {
					code = 0; // 晴
				}
			}
		}

		this._writeByte(code & 0xFF);
	}

	/**
	 * 写入温度（1字节）
	 * 格式: 预留(1bit) + 正负标识(1bit) + 温度值(6bit)
	 */
	_writeTemperature(tempStr) {
		// 转换为数字
		let temp = typeof tempStr === 'string' ? parseInt(tempStr) : (tempStr || 0);

		let tempByte = 0;

		// 处理正负
		if (temp >= 0) {
			tempByte |= 0x40; // bit6 = 1 正数
		}

		// 取绝对值，限制在0-63范围内
		const absTemp = Math.min(Math.abs(temp), 63);
		tempByte |= absTemp & 0x3F;

		this._writeByte(tempByte);
	}

	/**
	 * 写入城市名称（UTF-8编码）
	 */
	_writeCityName(cityName) {
		if (!cityName) return;

		// 将字符串转换为UTF-8字节数组
		const utf8Bytes = this._stringToUTF8(cityName);

		// 写入每个字节
		for (let i = 0; i < utf8Bytes.length; i++) {
			this._writeByte(utf8Bytes[i]);
		}
	}

	/**
	 * 字符串转UTF-8字节数组
	 */
	_stringToUTF8(str) {
		const utf8 = [];
		for (let i = 0; i < str.length; i++) {
			let charCode = str.charCodeAt(i);
			if (charCode < 0x80) {
				utf8.push(charCode);
			} else if (charCode < 0x800) {
				utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
			} else if (charCode < 0xd800 || charCode >= 0xe000) {
				utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
			} else {
				// 代理对
				i++;
				charCode = ((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff);
				charCode += 0x10000;
				utf8.push(0xf0 | (charCode >> 18), 0x80 | ((charCode >> 12) & 0x3f),
					0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
			}
		}
		return utf8;
	}

	/**
	 * 获取编码结果的十六进制字符串
	 */
	getHexString() {
		return Array.from(this.bytes)
			.map(b => b.toString(16).padStart(2, '0'))
			.join('');
	}

	/**
	 * 获取带0x前缀的十六进制字符串
	 */
	getHexWithPrefix() {
		return Array.from(this.bytes)
			.map(b => '0x' + b.toString(16).padStart(2, '0').toUpperCase())
			.join(', ');
	}

	/**
	 * 验证sumcheck
	 */
	verifySumCheck() {
		const receivedSumCheck = this.bytes[3];
		let calculatedSum = 0;
		for (let i = 0; i < this.bytes.length; i++) {
			if (i !== 3) {
				calculatedSum += this.bytes[i];
			}
		}
		calculatedSum &= 0xFF;
		return {
			received: receivedSumCheck,
			calculated: calculatedSum,
			valid: receivedSumCheck === calculatedSum
		};
	}
}

/**
 * 天气预报协议解码器
 */
class WeatherForecastDecoder {
	/**
	 * 解码二进制数据
	 */
	decode(data) {
		const bytes = Array.from(data);
		let offset = 0;

		// 1. 协议标识位
		const protocolFlag = bytes[offset++];

		// 2. 协议长度
		const protocolLength = (bytes[offset] << 8) | bytes[offset + 1];
		offset += 2;

		// 3. 协议校准位
		const sumCheck = bytes[offset++];

		// 4. 协议命令
		const cmd = bytes[offset++];

		// 5. 协议版本号
		const version = bytes[offset++];

		// 6. 协议子命令/KEY
		const key = bytes[offset++];

		// 7. 命令指令长度
		const keyValueLen = (bytes[offset] << 8) | bytes[offset + 1];
		offset += 2;

		// 验证sumcheck
		let calculatedSum = 0;
		for (let i = 0; i < bytes.length; i++) {
			if (i !== 3) {
				calculatedSum += bytes[i];
			}
		}
		calculatedSum &= 0xFF;
		const sumCheckValid = (sumCheck === calculatedSum);

		// 记录KeyValue开始
		const keyValueStart = offset;

		// 8. 解析KeyValue
		// 8.1 预报数据数量
		const days = bytes[offset++];

		// 8.2 天气数据
		const forecast = [];
		for (let i = 0; i < days; i++) {
			if (offset + 4 >= bytes.length) break;

			// 日期戳
			const dateStamp = (bytes[offset] << 8) | bytes[offset + 1];
			offset += 2;

			const year = 2000 + ((dateStamp >> 9) & 0x3F);
			const month = (dateStamp >> 5) & 0x0F;
			const day = dateStamp & 0x1F;

			// 天气状态
			const weatherCode = bytes[offset++];
			const weatherMap = ['晴', '阴', '雨', '雪'];
			const weather = weatherMap[weatherCode] || '晴';

			// 最高温度
			const tempMaxByte = bytes[offset++];
			const tempMaxSign = (tempMaxByte & 0x40) ? '' : '-';
			const tempMax = parseInt(tempMaxSign + (tempMaxByte & 0x3F));

			// 最低温度
			const tempMinByte = bytes[offset++];
			const tempMinSign = (tempMinByte & 0x40) ? '' : '-';
			const tempMin = parseInt(tempMinSign + (tempMinByte & 0x3F));

			forecast.push({
				date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
				weather: weather,
				weatherCode: weatherCode,
				tempMax: tempMax,
				tempMin: tempMin
			});
		}

		// 8.3 城市名称
		const cityNameBytes = bytes.slice(offset);
		let cityName = '';
		if (cityNameBytes.length > 0) {
			try {
				cityName = decodeURIComponent(escape(String.fromCharCode.apply(null, cityNameBytes)));
			} catch (e) {
				cityName = '解析失败';
			}
		}

		return {
			header: {
				protocolFlag: `0x${protocolFlag.toString(16).toUpperCase()}`,
				protocolLength,
				sumCheck: `0x${sumCheck.toString(16).padStart(2, '0').toUpperCase()}`,
				sumCheckValid,
				cmd: `0x${cmd.toString(16).padStart(2, '0').toUpperCase()}`,
				version: `0x${version.toString(16).padStart(2, '0').toUpperCase()}`,
				key: `0x${key.toString(16).padStart(2, '0').toUpperCase()}`,
				keyValueLen
			},
			days,
			forecast,
			cityName,
			rawLength: bytes.length
		};
	}

	/**
	 * 从十六进制字符串解码
	 */
	decodeFromHex(hexStr) {
		const cleanHex = hexStr.replace(/0x/g, '').replace(/,/g, '').replace(/\s/g, '');
		const bytes = [];
		for (let i = 0; i < cleanHex.length; i += 2) {
			bytes.push(parseInt(cleanHex.substr(i, 2), 16));
		}
		return this.decode(bytes);
	}
}

// 导出
export {
	WeatherForecastEncoder,
	WeatherForecastDecoder
};