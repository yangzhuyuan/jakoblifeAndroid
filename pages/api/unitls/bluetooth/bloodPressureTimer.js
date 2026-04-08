import {
	buildPacket,
	parsePacket
} from './checksum.js';

/**
 * 构建血压定时监测指令 (CMD:0x03, KEY:0x21)
 * 附：与扩展KEY:0x22关联，bit7标志位关联
 * 
 * KeyValue格式 (1+6*M Byte，最大1+6*Max Byte)：
 * ---------------------------------------------------------------------------------
 * 数量 (1Byte)：
 *   - 高4位：定时监测最大数量 (单位:Max个)
 *   - 低4位：当前定时监测数量 (单位:M个)
 * 
 * 定时监测属性 (6*M Byte)：
 *   - 第1字节：组合字节
 *        bit7: 定时监测开关 (1bit) - 0:关闭 1:开启
 *        bit6-3: 定时监测索引 (4bit) - 当前定时监测索引:0~Max-1
 *        bit2-0: 预留 (3bit)
 *   - 第2-3字节：开始时间(2Byte) - 高位:时 低位:分
 *   - 第4-5字节：结束时间(2Byte) - 高位:时 低位:分
 *   - 第6字节：时间间隔(1Byte) - 实际时间间隔/15 (单位:15分钟)
 * ---------------------------------------------------------------------------------
 * 
 * 注：请确保定时监测的时间段之间没有重合
 * 
 * @param {Object} params - 参数对象
 * @param {number} params.maxTimers - 定时监测最大数量 (Max) 1-15
 * @param {Array} params.timers - 定时监测设置数组 (长度M)
 * @param {number} params.timers[].index - 定时监测索引 (0~Max-1, 4bit)
 * @param {boolean} params.timers[].enabled - 定时监测开关
 * @param {number} params.timers[].startHour - 开始小时 (0-23)
 * @param {number} params.timers[].startMinute - 开始分钟 (0-59)
 * @param {number} params.timers[].endHour - 结束小时 (0-23)
 * @param {number} params.timers[].endMinute - 结束分钟 (0-59)
 * @param {number} params.timers[].interval - 时间间隔（分钟），必须是15的倍数
 * @returns {Uint8Array} 完整协议包
 */
export function buildBloodPressureTimerPacket({
	maxTimers,
	timers
}) {
	// 验证最大定时器数量
	if (maxTimers < 1 || maxTimers > 15) {
		throw new Error(`定时监测最大数量超出范围（1-15）：${maxTimers}`);
	}

	// 当前定时监测数量
	const currentCount = timers.length;

	// 验证当前定时器数量
	if (currentCount < 1 || currentCount > 15) {
		throw new Error(`当前定时监测数量超出范围（1-15）：${currentCount}`);
	}

	if (currentCount > maxTimers) {
		throw new Error(`当前定时监测数量不能大于最大数量：${currentCount} > ${maxTimers}`);
	}

	// 计算KeyValue长度: 1 + 6 * currentCount
	const keyValueLength = 1 + 6 * currentCount;

	// 验证KeyValue长度是否在范围内（1-503）
	if (keyValueLength < 1 || keyValueLength > 503) {
		throw new Error(`KeyValue长度超出范围：${keyValueLength}`);
	}

	const keyValue = new Uint8Array(keyValueLength);

	// 第一个字节：数量
	// 高4位: 定时监测最大数量(Max), 低4位: 当前定时监测数量(M)
	keyValue[0] = ((maxTimers & 0x0F) << 4) | (currentCount & 0x0F);

	// 用于验证时间段是否重合的数组
	const timeRanges = [];

	// 填充每个定时监测属性
	for (let i = 0; i < currentCount; i++) {
		const setting = timers[i];
		const offset = 1 + i * 6;

		// 验证索引范围（0~Max-1, 4bit）
		if (setting.index < 0 || setting.index > maxTimers - 1) {
			throw new Error(`定时监测索引超出范围（0-${maxTimers-1}）：${setting.index}`);
		}
		if (setting.index > 15) {
			throw new Error(`定时监测索引超出4bit范围（0-15）：${setting.index}`);
		}

		/**
		 * 第1字节：组合字节
		 * bit7: 定时监测开关 (1bit)
		 * bit6-3: 定时监测索引 (4bit)
		 * bit2-0: 预留 (3bit)
		 */
		let controlByte = 0;

		// 设置开关位 (bit7)
		if (setting.enabled) {
			controlByte |= 0x80; // 1000 0000
		}

		// 设置索引位 (bit6-3) - 左移3位到bit6-3
		controlByte |= (setting.index & 0x0F) << 3;

		// 预留位(bit2-0)默认为0

		keyValue[offset] = controlByte;

		// 验证小时和分钟范围
		if (setting.startHour < 0 || setting.startHour > 23) {
			throw new Error(`开始小时无效（0-23）：${setting.startHour}`);
		}
		if (setting.startMinute < 0 || setting.startMinute > 59) {
			throw new Error(`开始分钟无效（0-59）：${setting.startMinute}`);
		}
		if (setting.endHour < 0 || setting.endHour > 23) {
			throw new Error(`结束小时无效（0-23）：${setting.endHour}`);
		}
		if (setting.endMinute < 0 || setting.endMinute > 59) {
			throw new Error(`结束分钟无效（0-59）：${setting.endMinute}`);
		}

		// 第2-3字节：开始时间 - 高位:时 低位:分
		keyValue[offset + 1] = setting.startHour; // 时
		keyValue[offset + 2] = setting.startMinute; // 分

		// 第4-5字节：结束时间 - 高位:时 低位:分
		keyValue[offset + 3] = setting.endHour; // 时
		keyValue[offset + 4] = setting.endMinute; // 分

		// 验证时间顺序
		const startMinutes = setting.startHour * 60 + setting.startMinute;
		const endMinutes = setting.endHour * 60 + setting.endMinute;

		if (endMinutes <= startMinutes) {
			throw new Error(
				`结束时间必须大于开始时间：${setting.endHour}:${setting.endMinute} <= ${setting.startHour}:${setting.startMinute}`
			);
		}

		// 第6字节：时间间隔 - 实际时间间隔/15
		// 注意：允许间隔为0（表示默认间隔）
		if (setting.interval < 0 || setting.interval > 255 * 15) {
			throw new Error(`时间间隔超出范围（0-3825分钟）：${setting.interval}`);
		}
		if (setting.interval > 0 && setting.interval % 15 !== 0) {
			throw new Error(`时间间隔必须是15的倍数：${setting.interval}`);
		}

		// 计算存储值，如果间隔为0则存储值也为0
		const intervalValue = setting.interval === 0 ? 0 : setting.interval / 15;
		if (intervalValue < 0 || intervalValue > 255) {
			throw new Error(`时间间隔存储值超出范围（0-255）：${intervalValue}`);
		}
		keyValue[offset + 5] = intervalValue;

		// 记录时间段用于重合检查
		timeRanges.push({
			index: setting.index,
			start: startMinutes,
			end: endMinutes
		});
	}

	// 检查时间段是否重合
	for (let i = 0; i < timeRanges.length; i++) {
		for (let j = i + 1; j < timeRanges.length; j++) {
			const a = timeRanges[i];
			const b = timeRanges[j];
			// 检查是否重合：时间段a和b有重叠
			if (Math.max(a.start, b.start) < Math.min(a.end, b.end)) {
				throw new Error(`时间段重合：索引${a.index}和索引${b.index}的时间段有重叠`);
			}
		}
	}
	// 构建完整协议包
	const packet = buildPacket(0x03, 0x21, keyValue);
	return packet;
}

/**
 * 解析定时监测属性组合字节
 * @param {number} controlByte - 组合字节值
 * @returns {Object} 解析结果
 */
export function parseTimerControlByte(controlByte) {
	return {
		enabled: (controlByte & 0x80) !== 0, // bit7: 开关
		index: (controlByte >> 3) & 0x0F, // bit6-3: 索引 (右移3位，取低4位)
		reserved: controlByte & 0x07 // bit2-0: 预留
	};
}

/**
 * 解析血压定时监测响应数据
 * @param {Uint8Array} keyValue - 指令值数据
 * @returns {Object} 解析后的定时监测设置
 */
export function parseBloodPressureTimerResponse(keyValue) {
	if (keyValue.length < 1) {
		throw new Error('KeyValue数据长度不足');
	}

	// 解析第一个字节：数量
	const countByte = keyValue[0];
	const maxTimers = (countByte >> 4) & 0x0F; // 高4位：定时监测最大数量
	const currentCount = countByte & 0x0F; // 低4位：当前定时监测数量

	// 验证数据长度是否匹配
	const expectedLength = 1 + 6 * currentCount;
	if (keyValue.length !== expectedLength) {
		throw new Error(`数据长度不匹配：期望${expectedLength}，实际${keyValue.length}`);
	}

	const timers = [];

	for (let i = 0; i < currentCount; i++) {
		const offset = 1 + i * 6;

		// 解析第1字节：组合字节
		const controlByte = keyValue[offset];
		const {
			enabled,
			index,
			reserved
		} = parseTimerControlByte(controlByte);

		// 解析开始时间 (第2-3字节)
		const startHour = keyValue[offset + 1];
		const startMinute = keyValue[offset + 2];

		// 解析结束时间 (第4-5字节)
		const endHour = keyValue[offset + 3];
		const endMinute = keyValue[offset + 4];

		// 解析时间间隔 (第6字节) - 实际时间间隔 = 存储值 × 15
		const intervalValue = keyValue[offset + 5];
		const interval = intervalValue * 15;

		// 计算分钟总数用于验证
		const startMinutes = startHour * 60 + startMinute;
		const endMinutes = endHour * 60 + endMinute;

		timers.push({
			index,
			enabled,
			startHour,
			startMinute,
			endHour,
			endMinute,
			interval,
			intervalValue,
			startMinutes,
			endMinutes,
			reserved // 可选：返回预留位
		});
	}

	return {
		maxTimers,
		currentCount,
		timers
	};
}

/**
 * 构建血压定时监测扩展指令 (CMD:0x03, KEY:0x22)
 * 与KEY:0x21关联，bit7标志位关联
 * 
 * @param {Array} timerFlags - 定时监测标志位数组
 * @returns {Uint8Array} 完整协议包
 */
export function buildBloodPressureTimerExtPacket(timerFlags) {
	// 扩展指令格式（需要根据实际协议定义）
	// 这里假设是一个标志位数组，与KEY:0x21的bit7关联
	const keyValue = new Uint8Array(timerFlags.length);

	for (let i = 0; i < timerFlags.length; i++) {
		keyValue[i] = timerFlags[i] ? 1 : 0;
	}

	return buildPacket(0x03, 0x22, keyValue);
}

/**
 * 将十六进制字符串转换为Uint8Array
 * @param {string} hexString - 十六进制字符串（可包含空格）
 * @returns {Uint8Array}
 */
export function hexToBytes(hexString) {
	const hex = hexString.replace(/\s+/g, '');
	if (hex.length % 2 !== 0) {
		throw new Error('十六进制字符串长度必须为偶数');
	}
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
	}
	return bytes;
}

/**
 * 将Uint8Array转换为十六进制字符串
 * @param {Uint8Array} bytes
 * @param {boolean} withSpaces - 是否添加空格分隔
 * @returns {string}
 */
export function bytesToHex(bytes, withSpaces = true) {
	if (!bytes || bytes.length === 0) return '';
	const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
	return withSpaces ? hex.join('') : hex.join('');
}

/**
 * 测试函数：验证数据包解析
 * @param {string} hexString - 十六进制数据包
 */
export function testParsePacket(hexString) {
	try {
		const bytes = hexToBytes(hexString);
		console.log('原始数据:', bytesToHex(bytes, true));

		// 使用checksum.js的parsePacket解析协议头
		const parsed = parsePacket(bytes);
		console.log('协议头解析:', {
			cmd: `0x${parsed.cmd.toString(16).padStart(2, '0')}`,
			key: `0x${parsed.key.toString(16).padStart(2, '0')}`,
			keyValueLen: parsed.keyValueLen
		});

		// 解析KeyValue
		if (parsed.cmd === 0x03 && parsed.key === 0x21) {
			const result = parseBloodPressureTimerResponse(parsed.keyValue);
			console.log('血压定时监测配置:', JSON.stringify(result, null, 2));
			return result;
		}
	} catch (e) {
		console.error('解析失败:', e.message);
	}
}

/**
 * 测试构建函数
 */
export function test() {
	console.log('========== 测试构建函数 ==========');

	const config = {
		maxTimers: 1,
		timers: [{
			index: 0,
			enabled: true,
			startHour: 8,
			startMinute: 0,
			endHour: 12,
			endMinute: 0,
			interval: 30
		}]
	};

	console.log('测试配置:', JSON.stringify(config, null, 2));

	try {
		const packet = buildBloodPressureTimerPacket(config);
		console.log('生成数据包:', bytesToHex(packet, true));
		console.log('数据包长度:', packet.length);
		console.log('预期长度: 17');
		console.log('期望数据包: E0 00 0D ?? 03 01 21 00 07 11 80 08 00 0C 00 02');

		// 验证校验和
		const checksum = packet[3].toString(16).padStart(2, '0').toUpperCase();
		console.log('实际校验和:', checksum);

		return packet;
	} catch (e) {
		console.error('测试失败:', e.message);
	}
}

// 自动运行测试（可选）
// test();