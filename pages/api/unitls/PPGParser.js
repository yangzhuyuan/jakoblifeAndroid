// PPGParser.js - 修正版PPG数据解析器
export default {
	/**
	 * 解析完整的PPG HEX数据包
	 * @param {string} hexString - HEX字符串
	 * @param {number} dataItemDefine - 数据项定义（默认为0x05，表示绿光+红外光）
	 * @returns {Object} 解析结果
	 */
	parsePPGData(hexString, dataItemDefine = 0x05) {
		try {
			// 1. 将HEX字符串转换为字节数组
			const bytes = this.hexToBytes(hexString);

			if (bytes.length < 2) {
				return {
					success: false,
					error: '数据长度不足，至少需要2个字节（序号和条数）',
					data: []
				};
			}

			// 2. 解析前两个字节
			const seqNumber = bytes[0]; // 序号 (1字节)
			const declaredCount = bytes[1]; // 声明的数据条数 X (1字节)

			// 3. 确保dataItemDefine是数字
			const dataItemDefineNum = Number(dataItemDefine);

			// 4. 根据数据项定义确定数据结构和每条记录字节数
			const dataStructure = this.getDataStructure(dataItemDefineNum);
			const recordSize = this.getRecordSize(dataItemDefineNum);
			// 5. 计算实际能解析的条数
			const availableBytes = bytes.length - 2;
			const maxPossibleRecords = Math.floor(availableBytes / recordSize);
			const actualDataCount = Math.min(declaredCount, maxPossibleRecords);
			if (actualDataCount === 0) {
				return {
					success: false,
					error: `没有足够的数据，需要至少${recordSize}字节数据，当前只有${availableBytes}字节`,
					data: []
				};
			}

			// 6. 解析PPG数据
			const ppgData = [];
			let offset = 2;

			for (let i = 0; i < actualDataCount; i++) {
				if (offset + recordSize - 1 >= bytes.length) {
					console.warn(`第${i+1}条数据不完整，停止解析`);
					break;
				}

				const recordData = this.parseSingleRecord(bytes, offset, dataStructure, recordSize);
				recordData.index = i + 1;
				ppgData.push(recordData);
				offset += recordSize;
			}

			// 7. 统计佩戴状态
			const wearingStats = {
				total: ppgData.length,
				wearing: ppgData.filter(item => item.wearingCode === 1).length,
				notWearing: ppgData.filter(item => item.wearingCode === 0).length
			};

			// 8. 准备返回结果
			const result = {
				success: true,
				seqNumber: seqNumber,
				declaredCount: declaredCount,
				actualCount: actualDataCount,
				data: ppgData,
				totalBytes: bytes.length,
				wearingStats: wearingStats,
				recordSize: recordSize,
				dataStructure: dataStructure,
				dataItemDefine: '0x' + dataItemDefineNum.toString(16).toUpperCase(),
				firstTimestamp: ppgData.length > 0 ? ppgData[0].seconds : 0,
				firstTime: ppgData.length > 0 ? ppgData[0].time : '00:00:00'
			};

			// 9. 如果数据不完整，添加警告信息
			if (actualDataCount < declaredCount) {
				result.warning = `数据不完整：声明${declaredCount}条，实际解析${actualDataCount}条`;
				result.status = 'partial';
				result.missingCount = declaredCount - actualDataCount;
			} else {
				result.status = 'complete';
			}

			return result;

		} catch (error) {
			console.error('PPG数据解析失败:', error);
			return {
				success: false,
				error: error.message || '解析失败',
				data: []
			};
		}
	},

	/**
	 * 获取数据项定义对应的数据结构
	 */
	getDataStructure(dataItemDefine) {
		// 确保是数字
		const defineNum = Number(dataItemDefine);
		const binary = defineNum.toString(2).padStart(8, '0');
		return {
			hasGreen: binary[7] === '1', // bit0 (LSB)
			hasRed: binary[6] === '1', // bit1  
			hasIR: binary[5] === '1', // bit2
			hasAmbient: binary[4] === '1', // bit3
			binary: binary,
			lightCount: (binary[7] === '1' ? 1 : 0) +
				(binary[6] === '1' ? 1 : 0) +
				(binary[5] === '1' ? 1 : 0) +
				(binary[4] === '1' ? 1 : 0)
		};
	},

	/**
	 * 根据灯光值数量计算每条记录的字节数
	 * 规则：1个灯光值→9字节，2个→13字节，3个→18字节，4个→21字节
	 */
	getRecordSize(dataItemDefine) {
		// 确保是数字
		const defineNum = Number(dataItemDefine);
		const structure = this.getDataStructure(defineNum);
		const lightCount = structure.lightCount;
		// 根据灯光值数量确定字节数
		const sizeMap = {
			0: 5, // 只有秒数(4)和佩戴(1) - 理论上不会出现
			1: 9, // 4 + 1*4 + 1 = 9
			2: 13, // 4 + 2*4 + 1 = 13
			3: 18, // 4 + 3*4 + 2? = 18 (注意：佩戴状态可能是2字节？)
			4: 21 // 4 + 4*4 + 1 = 21
		};

		const size = sizeMap[lightCount] || 21;
		return size;
	},

	/**
	 * 解析单条记录
	 */
	parseSingleRecord(bytes, offset, dataStructure, recordSize) {
		let currentOffset = offset;
		const record = {};

		// 1. 解析秒数（4字节，大端序）
		record.seconds = this.readUint32BE(bytes, currentOffset);
		currentOffset += 4;

		// 将秒数转换为时间格式
		record.time = this.secondsToTime(record.seconds);

		// 2. 解析灯光值（根据数据项定义）
		if (dataStructure.hasGreen) {
			if (currentOffset + 4 > bytes.length) {
				throw new Error('数据不足，无法解析绿光值');
			}
			const greenRaw = this.readUint32BE(bytes, currentOffset);
			record.greenValue = this.parse31BitSigned(greenRaw);
			currentOffset += 4;
			// console.log(`  绿光值: ${record.greenValue} (原始: 0x${greenRaw.toString(16)})`);
		}

		if (dataStructure.hasRed) {
			if (currentOffset + 4 > bytes.length) {
				throw new Error('数据不足，无法解析红光值');
			}
			const redRaw = this.readUint32BE(bytes, currentOffset);
			record.redValue = this.parse31BitSigned(redRaw);
			currentOffset += 4;
			// console.log(`  红光值: ${record.redValue}`);
		}

		if (dataStructure.hasIR) {
			if (currentOffset + 4 > bytes.length) {
				throw new Error('数据不足，无法解析红外光值');
			}
			const irRaw = this.readUint32BE(bytes, currentOffset);
			record.irValue = this.parse31BitSigned(irRaw);
			currentOffset += 4;
			// console.log(`  红外值: ${record.irValue} (原始: 0x${irRaw.toString(16)})`);
		}

		if (dataStructure.hasAmbient) {
			if (currentOffset + 4 > bytes.length) {
				throw new Error('数据不足，无法解析环境光值');
			}
			const ambientRaw = this.readUint32BE(bytes, currentOffset);
			record.ambientValue = this.parse31BitSigned(ambientRaw);
			currentOffset += 4;
			// console.log(`  环境光: ${record.ambientValue}`);
		}

		// 3. 解析佩戴状态（最后1字节）
		// 注意：根据记录大小和已解析的字节数计算佩戴状态的位置
		const bytesParsed = currentOffset - offset;
		const wearingOffset = recordSize - 1; // 佩戴状态是最后1字节

		if (offset + wearingOffset >= bytes.length) {
			throw new Error('数据不足，无法解析佩戴状态');
		}

		record.wearingCode = bytes[offset + wearingOffset];
		record.wearing = record.wearingCode === 1 ? '已佩戴' : '未佩戴';
		// console.log(`  佩戴状态: ${record.wearing} (${record.wearingCode}), 位置: offset+${wearingOffset}`);

		// 4. 保存原始HEX用于调试
		record.rawHex = this.bytesToHex(bytes, offset, recordSize);

		// 5. 记录解析位置信息（调试用）
		record._debug = {
			offset: offset,
			recordSize: recordSize,
			bytesParsed: bytesParsed,
			wearingOffset: wearingOffset,
			expectedPosition: offset + wearingOffset
		};

		return record;
	},

	/**
	 * 从字节数组中读取32位无符号整数（大端序）
	 */
	readUint32BE(bytes, offset) {
		if (offset + 4 > bytes.length) {
			throw new Error(`读取32位整数越界: offset=${offset}, bytes.length=${bytes.length}`);
		}

		const value = (bytes[offset] << 24) |
			(bytes[offset + 1] << 16) |
			(bytes[offset + 2] << 8) |
			bytes[offset + 3];
		return value;
	},

	/**
	 * 解析31位有符号整数（最高位bit31为符号位）
	 * 0 = 正数，1 = 负数
	 * 低31位（bit0-30）为数值
	 */
	parse31BitSigned(rawValue) {
		// 确保是32位无符号整数
		const value = rawValue >>> 0;

		// bit31（最高位）是符号位
		const isNegative = (value & 0x80000000) !== 0;

		// 取低31位作为数值
		const magnitude = value & 0x7FFFFFFF;

		// 根据符号位返回相应值
		const result = isNegative ? -magnitude : magnitude;
		return result;
	},

	/**
	 * 将秒数转换为时间字符串（HH:mm:ss）
	 */
	secondsToTime(totalSeconds) {
		if (totalSeconds === undefined || totalSeconds === null || isNaN(totalSeconds)) {
			return '00:00:00';
		}

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return this.padZero(hours) + ':' +
			this.padZero(minutes) + ':' +
			this.padZero(seconds);
	},

	/**
	 * 补零函数
	 */
	padZero(num) {
		return num.toString().padStart(2, '0');
	},

	/**
	 * 将字节数组转换为HEX字符串
	 */
	bytesToHex(bytes, offset, length) {
		let hexStr = '';
		const end = Math.min(offset + length, bytes.length);
		for (let i = offset; i < end; i++) {
			hexStr += bytes[i].toString(16).padStart(2, '0') + ' ';
		}
		return hexStr.trim();
	},

	/**
	 * 将HEX字符串转换为字节数组
	 */
	hexToBytes(hexString) {
		if (!hexString || typeof hexString !== 'string') {
			return new Uint8Array(0);
		}

		// 移除所有空格和换行
		const cleanHex = hexString.replace(/[\s\n\r]/g, '').toUpperCase();

		// 验证HEX格式
		if (!/^[0-9A-F]+$/.test(cleanHex)) {
			throw new Error('无效的HEX字符串');
		}

		// 检查长度是否为偶数
		if (cleanHex.length % 2 !== 0) {
			throw new Error('HEX字符串长度应为偶数');
		}

		const byteCount = cleanHex.length / 2;
		const bytes = new Uint8Array(byteCount);

		for (let i = 0; i < byteCount; i++) {
			const hexByte = cleanHex.substr(i * 2, 2);
			const byteValue = parseInt(hexByte, 16);

			if (isNaN(byteValue)) {
				throw new Error(`无效的HEX字节: ${hexByte}`);
			}

			bytes[i] = byteValue;
		}
		return bytes;
	},

	/**
	 * 测试函数 - 专门用于测试你的数据
	 */
	testPPGData(hexString) {
		console.log('=== 测试PPG数据解析 ===');
		console.log('原始数据:', hexString.substring(0, 100) + '...');

		// 测试数据项定义0x05
		console.log('\n--- 测试数据项定义0x05 (绿光+红外光) ---');
		const result05 = this.parsePPGData(hexString, 0x05);
		this.printResult(result05);

		// 测试数据项定义0x0F
		console.log('\n--- 测试数据项定义0x0F (全部灯光值) ---');
		const result0F = this.parsePPGData(hexString, 0x0F);
		this.printResult(result0F);

		return {
			result05,
			result0F
		};
	},

	/**
	 * 打印解析结果
	 */
	printResult(result) {
		if (result.success) {
			// console.log(`✅ 解析成功: ${result.actualCount}/${result.declaredCount}条数据`);
			// console.log(`记录大小: ${result.recordSize}字节`);
			// console.log(`数据结构: ${JSON.stringify(result.dataStructure)}`);
			// console.log(`第一个时间: ${result.firstTime} (${result.firstTimestamp}秒)`);

			// 显示前2条数据的详细信息
			if (result.data.length >= 2) {
				console.log('\n前2条数据详情:');
				for (let i = 0; i < 2; i++) {
					const item = result.data[i];
					console.log(`\n第${item.index}条:`);
					console.log(`  时间: ${item.time} (${item.seconds}秒)`);
					if (item.greenValue !== undefined) console.log(`  绿光: ${item.greenValue}`);
					if (item.redValue !== undefined) console.log(`  红光: ${item.redValue}`);
					if (item.irValue !== undefined) console.log(`  红外: ${item.irValue}`);
					if (item.ambientValue !== undefined) console.log(`  环境光: ${item.ambientValue}`);
					console.log(`  佩戴: ${item.wearing} (${item.wearingCode})`);
					console.log(`  原始: ${item.rawHex}`);
				}
			}
		} else {
			console.log(`❌ 解析失败: ${result.error}`);
		}
	},

	/**
	 * 简单解析示例
	 */
	simpleParse(hexString) {
		console.log('=== 简单解析 ===');
		const bytes = this.hexToBytes(hexString);
		console.log(`总字节数: ${bytes.length}`);
		console.log(`头部: 序号=${bytes[0]}, 条数=${bytes[1]}`);

		// 显示前20字节
		console.log('前20字节:');
		for (let i = 0; i < Math.min(20, bytes.length); i++) {
			console.log(`  [${i}]: 0x${bytes[i].toString(16).padStart(2, '0')} (${bytes[i]})`);
		}

		// 尝试手动解析第一条数据（假设是13字节格式）
		console.log('\n尝试手动解析第一条数据 (13字节格式):');
		if (bytes.length >= 15) { // 2头部 + 13数据
			const offset = 2;
			// 秒数
			const seconds = this.readUint32BE(bytes, offset);
			console.log(`  秒数: 0x${seconds.toString(16)} = ${seconds} = ${this.secondsToTime(seconds)}`);

			// 绿光值
			const green = this.readUint32BE(bytes, offset + 4);
			console.log(`  绿光: 0x${green.toString(16)} = ${this.parse31BitSigned(green)}`);

			// 红外值
			const ir = this.readUint32BE(bytes, offset + 8);
			console.log(`  红外: 0x${ir.toString(16)} = ${this.parse31BitSigned(ir)}`);

			// 佩戴状态（第13字节）
			const wearing = bytes[offset + 12];
			console.log(`  佩戴: 0x${wearing.toString(16)} = ${wearing} = ${wearing === 1 ? '已佩戴' : '未佩戴'}`);
		}
	}
};