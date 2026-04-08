/**
 * 手环回复协议解析器 - 大端模式版本
 * 协议格式: 大端数据模式
 * 数据: 01ff01040000da1e00d820081101005f500000002204830000002000010e00
 * 结构: 重力(2B) + 心率(2B) + GPS(2B) + 其他1(2B) + 其他2(1B) + 扩展(NB)
 */

class BandKeyValueParser {
	constructor() {
		this.result = {};
		this.bytes = [];
		this.offset = 0;
	}

	/**
	 * 解析入口 - 直接传入KeyValue数据段
	 * @param {string|Array<number>|Uint8Array|ArrayBuffer} data - 输入数据
	 * @returns {Object} 完整解析结果
	 */
	parse(data) {
		this.bytes = this._toBytes(data);
		this.offset = 0;

		if (this.bytes.length < 11) {
			throw new Error(`数据长度不足，至少需要11字节，实际${this.bytes.length}字节`);
		}

		// 按大端模式解析
		this._parseGravity(); // 01 ff -> 0x01FF (大端)
		this._parseHeartRate(); // 01 04 -> 0x0104 (大端)
		this._parseGPS(); // 00 00 -> 0x0000 (大端)
		this._parseOther1(); // da 1e -> 0xDA1E (大端)
		this._parseOther2(); // 00    -> 0x00 (1字节)
		this._parseExtensions(); // 剩余所有字节

		return this.result;
	}

	// ==================== 数据转换 ====================

	_toBytes(data) {
		if (typeof data === 'string') {
			const hex = data.replace(/[\s,]+/g, '').toLowerCase();
			if (!/^[0-9a-f]+$/.test(hex)) throw new Error('非法十六进制字符');
			if (hex.length % 2 !== 0) throw new Error('十六进制长度必须为偶数');

			const bytes = [];
			for (let i = 0; i < hex.length; i += 2) {
				bytes.push(parseInt(hex.substr(i, 2), 16));
			}
			return bytes;
		}

		if (data instanceof ArrayBuffer) {
			return Array.from(new Uint8Array(data));
		}

		if (data instanceof Uint8Array) {
			return Array.from(data);
		}

		if (Array.isArray(data)) {
			return data.map(b => b & 0xFF);
		}

		throw new Error('不支持的数据类型');
	}

	/**
	 * 读取2字节 - 大端模式 (高位在前)
	 * 例如: 字节[0x01, 0xFF] -> 0x01FF
	 */
	_readUint16() {
		const b1 = this.bytes[this.offset++]; // 高位
		const b2 = this.bytes[this.offset++]; // 低位
		return (b1 << 8) | b2; // 大端: 高位左移8位
	}

	_readByte() {
		return this.bytes[this.offset++];
	}

	// ==================== 重力芯片解析 (2字节) ====================

	_parseGravity() {
		const value = this._readUint16(); // 大端: 0x01FF

		this.result.gravity = {
			value: value,
			hex: `0x${this._hex(value, 2)}`,
			binary: this._bin16(value),

			// Bit8: 芯片存在标志 (0x0100 = 0000 0001 0000 0000)
			hasChip: !!(value & 0x0100),

			// Bit7: 睡眠模式 (0=主动, 1=被动)
			sleepPassive: !!(value & 0x0080),
			sleepMode: (value & 0x0080) ? '被动睡眠' : '主动睡眠',

			// Bit6: 计步模式 (0=主动, 1=被动)
			stepPassive: !!(value & 0x0040),
			stepMode: (value & 0x0040) ? '被动计步' : '主动计步',

			// Bit5-2: 运动预留 (4bit)
			reservedMotion: (value >> 2) & 0x0F,

			// Bit1: 睡眠功能 (1=支持, 0=无)
			hasSleep: !!(value & 0x0002),

			// Bit0: 计步功能 (1=支持, 0=无)
			hasStep: !!(value & 0x0001),

			// Bit15-9: 预留 (7bit)
			reserved: (value >> 9) & 0x7F
		};
	}

	// ==================== 心率芯片解析 (2字节) ====================

	_parseHeartRate() {
		const value = this._readUint16(); // 大端: 0x0104
		const funcCode = value & 0x00FF; // 取低8位

		const funcMap = {
			0x00: '无功能',
			0x01: '仅心率',
			0x02: '心率+血压',
			0x03: '心率+血氧',
			0x04: '心率+血压+血氧'
		};

		this.result.heartRate = {
			value: value,
			hex: `0x${this._hex(value, 2)}`,
			binary: this._bin16(value),

			// Bit8: 芯片存在标志
			hasChip: !!(value & 0x0100),

			// Bit7-0: 功能类型
			functionCode: funcCode,
			functionType: funcMap[funcCode] || `未知(0x${this._hex(funcCode)})`,

			// 派生属性
			hasHeartRate: funcCode !== 0x00,
			hasBloodPressure: funcCode === 0x02 || funcCode === 0x04,
			hasBloodOxygen: funcCode === 0x03 || funcCode === 0x04,

			// Bit15-9: 预留
			reserved: (value >> 9) & 0x7F
		};
	}

	// ==================== GPS芯片解析 (2字节) ====================

	_parseGPS() {
		const value = this._readUint16(); // 大端: 0x0000
		const funcCode = value & 0x00FF;

		let funcType = '无功能';
		if (funcCode === 0x01) funcType = '仅定位';
		else if (funcCode !== 0x00) funcType = `未知(0x${this._hex(funcCode)})`;

		this.result.gps = {
			value: value,
			hex: `0x${this._hex(value, 2)}`,
			binary: this._bin16(value),

			// Bit8: 芯片存在标志
			hasChip: !!(value & 0x0100),

			// Bit7-0: 功能类型
			functionCode: funcCode,
			functionType: funcType,
			hasLocation: funcCode === 0x01,

			// Bit15-9: 预留
			reserved: (value >> 9) & 0x7F
		};
	}

	// ==================== 其他功能1解析 (2字节) ====================

	_parseOther1() {
		const value = this._readUint16(); // 大端: 0xDA1E

		this.result.other1 = {
			value: value,
			hex: `0x${this._hex(value, 2)}`,
			binary: this._bin16(value),

			// Bit15: 久坐提醒 (1=支持, 0=不支持)
			sedentaryReminder: !!(value & 0x8000),

			// Bit14: 时制设置 (1=支持, 0=不支持)
			timeFormatSetting: !!(value & 0x4000),

			// Bit13-11: 预留 (3bit)
			reserved1: (value >> 11) & 0x07,

			// Bit10-4: 预留 (7bit)
			reserved2: (value >> 4) & 0x7F,

			// Bit3: 抬手亮屏时段设定 (1=支持, 0=不支持)
			raiseToWakeSetting: !!(value & 0x0008),

			// Bit2-0: 预留 (3bit)
			reserved3: value & 0x07
		};
	}

	// ==================== 其他功能2解析 (1字节) ====================

	_parseOther2() {
		const value = this._readByte();

		this.result.other2 = {
			value: value,
			hex: `0x${this._hex(value)}`,
			binary: this._bin(value),

			// Bit7-0: 全部预留
			reserved: value
		};
	}

	// ==================== 功能扩展解析 (N字节) ====================

	_parseExtensions() {
		const extensions = [];
		let extNum = 1;

		while (this.offset < this.bytes.length) {
			const byte = this._readByte();
			const ext = this._parseExtensionByte(extNum, byte);
			extensions.push(ext);
			extNum++;
		}

		this.result.extensions = extensions;
		this.result.extensionCount = extensions.length;
	}

	_parseExtensionByte(num, byte) {
		const base = {
			number: num,
			offset: this.offset - 1,
			value: byte,
			hex: `0x${this._hex(byte)}`,
			binary: this._bin(byte)
		};

		switch (num) {
			case 1:
				return {
					...base,
					name: '扩展1-基础功能',
						features: {
							doNotDisturb: !!(byte & 0x80), // Bit7: 勿扰模式
							unitSetting: !!(byte & 0x40), // Bit6: 单位设置
							sceneMode: !!(byte & 0x20), // Bit5: 情景模式
							weatherForecast: !!(byte & 0x10), // Bit4: 天气预报
							reserved1: !!(byte & 0x08), // Bit3: 预留
							language5Byte: !!(byte & 0x04), // Bit2: 语言类型数据占用5Byte
							reserved2: !!(byte & 0x02), // Bit1: 预留
							reserved3: !!(byte & 0x01) // Bit0: 预留
						}
				};

			case 2:
				return {
					...base, name: '扩展2-预留', features: {
						reserved: byte
					}
				};

			case 3:
				return {
					...base, name: '扩展3-市场表盘类型定义', features: {
						reserved: byte
					}
				};

			case 4:
				return {
					...base,
					name: '扩展4-天气格式1',
						features: {
							reserved1: !!(byte & 0x80), // Bit7: 预留
							todayWeatherNewFormat1: !!(byte & 0x40), // Bit6: 当天天气新格式一
							reserved2: !!(byte & 0x20), // Bit5: 预留
							reserved3: !!(byte & 0x10), // Bit4: 预留
							reserved4: !!(byte & 0x08), // Bit3: 预留
							reserved5: !!(byte & 0x04), // Bit2: 预留
							reserved6: !!(byte & 0x02), // Bit1: 预留
							deviceInfoUpload: !!(byte & 0x01) // Bit0: 设备信息上传支持
						}
				};

			case 5:
				return {
					...base,
					name: '扩展5-天气格式2+血氧',
						features: {
							reserved1: !!(byte & 0x80), // Bit7: 预留
							reserved2: !!(byte & 0x40), // Bit6: 预留
							reserved3: !!(byte & 0x20), // Bit5: 预留
							reserved4: !!(byte & 0x10), // Bit4: 预留
							reserved5: !!(byte & 0x08), // Bit3: 预留
							todayWeatherNewFormat2: !!(byte & 0x04), // Bit2: 当天天气新格式二
							weatherForecastNewFormat1: !!(byte & 0x02), // Bit1: 天气预报新格式一
							bloodOxygenAutoMeasure: !!(byte & 0x01) // Bit0: 血氧自动测量
						}
				};

			case 6:
				return {
					...base, name: '扩展6-预留', features: {
						reserved: byte
					}
				};

			case 7:
				return {
					...base,
					name: '扩展7-久坐提醒精确',
						features: {
							sedentaryReminderPrecise: !!(byte & 0x80), // Bit7: 久坐提醒时段精确至分钟
							reserved: byte & 0x7F // Bit6-0: 预留
						}
				};

			case 8:
				return {
					...base,
					name: '扩展8-喝水提醒',
						features: {
							reserved1: !!(byte & 0x80), // Bit7: 预留
							reserved2: !!(byte & 0x40), // Bit6: 预留
							reserved3: !!(byte & 0x20), // Bit5: 预留
							waterReminder: !!(byte & 0x10), // Bit4: 喝水提醒
							reserved4: !!(byte & 0x08), // Bit3: 预留
							reserved5: !!(byte & 0x04), // Bit2: 预留
							reserved6: !!(byte & 0x02), // Bit1: 预留
							reserved7: !!(byte & 0x01) // Bit0: 预留
						}
				};

			case 9:
			case 10:
			case 11:
				return {
					...base, name: `扩展${num}-预留`, features: {
						reserved: byte
					}
				};

			case 12:
				return {
					...base,
					name: '扩展12-5610睡眠算法',
						features: {
							reserved: (byte >> 2) & 0x3F, // Bit7-2: 预留
							sleepAlgorithm5610: !!(byte & 0x02), // Bit1: 5610平台算法睡眠支持
							reserved1: !!(byte & 0x01) // Bit0: 预留
						}
				};

			case 13:
				return {
					...base,
					name: '扩展13-REM睡眠合并',
						features: {
							reserved1: !!(byte & 0x80), // Bit7: 预留
							remMergeToLightSleep: !!(byte & 0x40), // Bit6: 快速眼动合并到浅睡标志位
							reserved2: byte & 0x3F // Bit5-0: 预留
						}
				};

			case 14:
				return {
					...base,
					name: '扩展14-睡眠监测开关',
						features: {
							sleepMonitorEnable: !!(byte & 0x80), // Bit7: 开启睡眠监测标志位
							reserved: byte & 0x7F // Bit6-0: 预留
						}
				};

			case 15:
			case 16:
				return {
					...base, name: `扩展${num}-预留`, features: {
						reserved: byte
					}
				};

			case 17:
				return {
					...base,
					name: '扩展17-阈值提醒',
						features: {
							reserved: (byte >> 2) & 0x3F, // Bit7-2: 预留
							heartRateThresholdAlert: !!(byte & 0x02), // Bit1: 心率过高过低提醒阈值标志位
							bloodOxygenThresholdAlert: !!(byte & 0x01) // Bit0: 血氧过低提醒阈值标志位
						}
				};

			case 18:
				return {
					...base,
					name: '扩展18-清醒时间合并',
						features: {
							reserved1: (byte >> 6) & 0x03, // Bit7-6: 预留
							awakeMergeToLightSleep: !!(byte & 0x20), // Bit5: 清醒时间合并到浅睡标志位
							reserved2: byte & 0x1F // Bit4-0: 预留
						}
				};

			case 19:
				return {
					...base, name: '扩展19-预留', features: {
						reserved: byte
					}
				};

			case 20:
				return {
					...base,
					name: '扩展20-数据上传',
						features: {
							reserved: (byte >> 2) & 0x3F, // Bit7-2: 预留
							bloodPressureDataUpload: !!(byte & 0x02), // Bit1: 固件上传血压模块测量数据
							accPpgDataUpload: !!(byte & 0x01) // Bit0: 固件上传ACC、PPG数据支持
						}
				};

			default:
				return {
					...base,
					name: `扩展${num}-未定义`,
						features: {
							reserved: byte,
							note: '超出文档定义范围(1-20)'
						}
				};
		}
	}

	// ==================== 工具函数 ====================

	_hex(value, bytes = 1) {
		return value.toString(16).padStart(bytes * 2, '0').toUpperCase();
	}

	_bin(value, bits = 8) {
		return value.toString(2).padStart(bits, '0');
	}

	_bin16(value) {
		return this._bin((value >> 8) & 0xFF, 8) + ' ' + this._bin(value & 0xFF, 8);
	}

	// ==================== 生成结构化报告 ====================

	generateReport() {
		const r = this.result;
		const ext = {};
		(r.extensions || []).forEach(e => {
			ext[e.number] = e.features;
		});

		return {
			sensors: {
				gravity: {
					available: r.gravity?.hasChip || false,
					step: r.gravity?.hasStep ? {
						supported: true,
						mode: r.gravity.stepMode
					} : {
						supported: false
					},
					sleep: r.gravity?.hasSleep ? {
						supported: true,
						mode: r.gravity.sleepMode
					} : {
						supported: false
					}
				},
				heartRate: {
					available: r.heartRate?.hasChip || false,
					type: r.heartRate?.functionType || '无',
					bloodPressure: r.heartRate?.hasBloodPressure || false,
					bloodOxygen: r.heartRate?.hasBloodOxygen || false
				},
				gps: {
					available: r.gps?.hasChip || false,
					location: r.gps?.hasLocation || false
				}
			},

			features: {
				basic: {
					sedentaryReminder: r.other1?.sedentaryReminder || false,
					sedentaryReminderPrecise: ext[7]?.sedentaryReminderPrecise || false,
					timeFormatSetting: r.other1?.timeFormatSetting || false,
					raiseToWake: r.other1?.raiseToWakeSetting || false,
					doNotDisturb: ext[1]?.doNotDisturb || false,
					unitSetting: ext[1]?.unitSetting || false,
					sceneMode: ext[1]?.sceneMode || false,
					waterReminder: ext[8]?.waterReminder || false
				},
				weather: {
					forecast: ext[1]?.weatherForecast || false,
					todayFormat1: ext[4]?.todayWeatherNewFormat1 || false,
					todayFormat2: ext[5]?.todayWeatherNewFormat2 || false,
					forecastNewFormat1: ext[5]?.weatherForecastNewFormat1 || false
				},
				health: {
					bloodOxygenAutoMeasure: ext[5]?.bloodOxygenAutoMeasure || false,
					heartRateThresholdAlert: ext[17]?.heartRateThresholdAlert || false,
					bloodOxygenThresholdAlert: ext[17]?.bloodOxygenThresholdAlert || false,
					sleep: {
						algorithm5610: ext[12]?.sleepAlgorithm5610 || false,
						remMergeToLight: ext[13]?.remMergeToLightSleep || false,
						awakeMergeToLight: ext[18]?.awakeMergeToLightSleep || false,
						monitorEnable: ext[14]?.sleepMonitorEnable || false
					}
				},
				dataUpload: {
					deviceInfo: ext[4]?.deviceInfoUpload || false,
					bloodPressure: ext[20]?.bloodPressureDataUpload || false,
					accPpg: ext[20]?.accPpgDataUpload || false
				},
				language: {
					fiveByte: ext[1]?.language5Byte || false
				}
			},

			raw: r
		};
	}

	// ==================== 格式化输出 ====================

	format() {
		const r = this.result;
		const lines = [];

		lines.push('╔════════════════════════════════════════════════╗');
		lines.push('║     手环KeyValue数据段解析结果 (大端模式)      ║');
		lines.push('╚════════════════════════════════════════════════╝');
		lines.push('');

		// 数据概览
		const totalBytes = this.bytes.length;
		lines.push(`数据长度: ${totalBytes}字节, 大端模式 (高位在前)`);
		lines.push('');

		// 重力芯片
		lines.push('┌─ 重力芯片 (2字节: 01 FF) ────────────────────┐');
		lines.push(`│ 大端值: ${r.gravity?.hex} (二进制: ${r.gravity?.binary})`);
		lines.push(`│ 芯片存在: ${r.gravity?.hasChip ? '✅ 有' : '❌ 无'}`);
		if (r.gravity?.hasChip) {
			lines.push(`│ 计步功能: ${r.gravity?.hasStep ? '✅ 支持' : '❌ 不支持'} (${r.gravity?.stepMode})`);
			lines.push(`│ 睡眠功能: ${r.gravity?.hasSleep ? '✅ 支持' : '❌ 不支持'} (${r.gravity?.sleepMode})`);
			lines.push(`│ 运动预留: 0x${this._hex(r.gravity?.reservedMotion)}`);
		}
		lines.push('└──────────────────────────────────────────────┘');
		lines.push('');

		// 心率芯片
		lines.push('┌─ 心率芯片 (2字节: 01 04) ────────────────────┐');
		lines.push(`│ 大端值: ${r.heartRate?.hex} (二进制: ${r.heartRate?.binary})`);
		lines.push(`│ 芯片存在: ${r.heartRate?.hasChip ? '✅ 有' : '❌ 无'}`);
		lines.push(`│ 功能类型: ${r.heartRate?.functionType}`);
		if (r.heartRate?.hasHeartRate) {
			lines.push(`│ 详细功能:`);
			lines.push(`│   - 心率监测: ✅`);
			if (r.heartRate?.hasBloodPressure) lines.push(`│   - 血压监测: ✅`);
			if (r.heartRate?.hasBloodOxygen) lines.push(`│   - 血氧监测: ✅`);
		}
		lines.push('└──────────────────────────────────────────────┘');
		lines.push('');

		// GPS芯片
		lines.push('┌─ GPS芯片 (2字节: 00 00) ─────────────────────┐');
		lines.push(`│ 大端值: ${r.gps?.hex} (二进制: ${r.gps?.binary})`);
		lines.push(`│ 芯片存在: ${r.gps?.hasChip ? '✅ 有' : '❌ 无'}`);
		lines.push(`│ 功能类型: ${r.gps?.functionType}`);
		lines.push('└──────────────────────────────────────────────┘');
		lines.push('');

		// 其他功能1
		lines.push('┌─ 其他功能1 (2字节: DA 1E) ───────────────────┐');
		lines.push(`│ 大端值: ${r.other1?.hex} (二进制: ${r.other1?.binary})`);
		lines.push(`│ 久坐提醒: ${r.other1?.sedentaryReminder ? '✅ 支持' : '❌ 不支持'}`);
		lines.push(`│ 时制设置: ${r.other1?.timeFormatSetting ? '✅ 支持' : '❌ 不支持'}`);
		lines.push(`│ 抬手亮屏: ${r.other1?.raiseToWakeSetting ? '✅ 支持' : '❌ 不支持'}`);
		lines.push('└──────────────────────────────────────────────┘');
		lines.push('');

		// 其他功能2
		lines.push('┌─ 其他功能2 (1字节: 00) ──────────────────────┐');
		lines.push(`│ 值: ${r.other2?.hex} (二进制: ${r.other2?.binary})`);
		lines.push(`│ 说明: 全部预留`);
		lines.push('└──────────────────────────────────────────────┘');
		lines.push('');

		// 功能扩展
		lines.push('┌─ 功能扩展 ───────────────────────────────────┐');
		lines.push(`│ 共${r.extensionCount}个扩展字节`);
		lines.push('│');

		(r.extensions || []).forEach(ext => {
			const enabled = Object.entries(ext.features || {})
				.filter(([k, v]) => !k.startsWith('reserved') && v === true)
				.map(([k, v]) => {
					const nameMap = {
						doNotDisturb: '勿扰模式',
						unitSetting: '单位设置',
						sceneMode: '情景模式',
						weatherForecast: '天气预报',
						language5Byte: '语言5字节',
						todayWeatherNewFormat1: '当天天气新格式一',
						deviceInfoUpload: '设备信息上传',
						todayWeatherNewFormat2: '当天天气新格式二',
						weatherForecastNewFormat1: '天气预报新格式一',
						bloodOxygenAutoMeasure: '血氧自动测量',
						sedentaryReminderPrecise: '久坐提醒精确至分钟',
						waterReminder: '喝水提醒',
						sleepAlgorithm5610: '5610睡眠算法',
						remMergeToLightSleep: 'REM合并到浅睡',
						sleepMonitorEnable: '睡眠监测开关',
						heartRateThresholdAlert: '心率阈值提醒',
						bloodOxygenThresholdAlert: '血氧阈值提醒',
						awakeMergeToLightSleep: '清醒时间合并到浅睡',
						bloodPressureDataUpload: '血压数据上传',
						accPpgDataUpload: 'ACC/PPG数据上传'
					};
					return nameMap[k] || k;
				});

			lines.push(`│ 扩展${ext.number}: ${ext.hex} ${ext.binary}`);
			lines.push(`│   ${ext.name}`);
			if (enabled.length > 0) {
				lines.push(`│   启用: ${enabled.join(', ')}`);
			} else {
				lines.push(`│   (无启用功能)`);
			}
			lines.push('│');
		});

		lines.push('└──────────────────────────────────────────────┘');

		return lines.join('\n');
	}
}

// 导出
export default BandKeyValueParser;