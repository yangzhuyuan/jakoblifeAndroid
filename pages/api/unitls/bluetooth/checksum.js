/**
 * 计算协议校验位（sumcheck）
 * 规则：除去校验位自身字节（索引3），整个协议字节数据相加取和的后8位
 * @param {Uint8Array} data - 完整的协议数据
 * @returns {number} 校验和（1字节）
 */
export function calculateChecksum(data) {
	const checksumIndex = 3;
	let total = 0;
	for (let i = 0; i < data.length; i++) {
		if (i === checksumIndex) continue;
		total += data[i];
	}
	return total & 0xFF;
}

/**
 * 验证协议校验位是否正确
 * @param {Uint8Array} data - 完整协议数据
 * @returns {boolean} true=校验通过
 */
export function verifyChecksum(data) {
	if (data.length < 10) return false;
	const receivedChecksum = data[3];
	const calculatedChecksum = calculateChecksum(data);
	return receivedChecksum === calculatedChecksum;
}

/**
 * 从2字节中提取9位有效长度（大端模式，忽略高7位预留位）
 * @param {number} highByte - 高8位
 * @param {number} lowByte - 低8位
 * @returns {number} 提取出的9位长度值
 */
export function extractLength(highByte, lowByte) {
	const combined = (highByte << 8) | lowByte;
	return combined & 0x01FF; // 只取低9位
}

/**
 * 构建2字节长度字段（大端模式：7bit预留 + 9bit有效长度）
 * @param {number} length - 有效长度值（0-511）
 * @returns {Array} 2字节长度字段 [highByte, lowByte]
 */
export function buildLengthField(length) {
	if (length < 0 || length > 511) {
		throw new Error('长度值超出9位范围（0-511）');
	}
	const combined = length & 0x01FF;
	const highByte = (combined >> 8) & 0xFF; // 实际只有低1位有效
	const lowByte = combined & 0xFF;
	return [highByte, lowByte];
}

/**
 * 构建血压定时监测的KeyValue数据（CMD:0x03 KEY:0x21）
 * 格式：1字节数量 + N*6字节定时监测属性
 * 
 * 数量字节（1Byte）：
 *   - 高4bit：定时监测最大数量（Max）
 *   - 低4bit：当前定时监测数量（M）
 * 
 * 定时监测属性（6字节/组）：
 *   - 字节0：预留3bit(0) + 定时监测索引4bit + 定时监测开关1bit
 *   - 字节1-2：开始时间（高位:时，低位:分）
 *   - 字节3-4：结束时间（高位:时，低位:分）
 *   - 字节5：时间间隔（实际间隔/15）
 * 
 * @param {Array} timers - 定时器数组 [{index, enabled, startHour, startMinute, endHour, endMinute, interval}]
 * @param {number} maxTimers - 设备支持的最大定时数量（默认3）
 * @returns {Uint8Array}
 */
export function buildBloodPressureTimerKeyValue(timers, maxTimers = 3) {
	if (!Array.isArray(timers) || timers.length === 0) {
		throw new Error('定时器数组不能为空');
	}
	if (timers.length > maxTimers) {
		throw new Error(`定时器数量超出最大值${maxTimers}：${timers.length}`);
	}

	const currentCount = timers.length;
	// 第一个字节：最大数量(高4bit) | 当前数量(低4bit)
	const firstByte = ((maxTimers & 0x0F) << 4) | (currentCount & 0x0F);

	const bytes = [firstByte];

	for (const timer of timers) {
		// 验证数据范围
		if (timer.index < 0 || timer.index > 15) {
			throw new Error(`定时监测索引超出范围(0-15)：${timer.index}`);
		}
		if (timer.startHour < 0 || timer.startHour > 23 || timer.startMinute < 0 || timer.startMinute > 59) {
			throw new Error(`开始时间非法：${timer.startHour}:${timer.startMinute}`);
		}
		if (timer.endHour < 0 || timer.endHour > 23 || timer.endMinute < 0 || timer.endMinute > 59) {
			throw new Error(`结束时间非法：${timer.endHour}:${timer.endMinute}`);
		}
		if (timer.interval < 15 || timer.interval > 255 * 15 || timer.interval % 15 !== 0) {
			throw new Error(`时间间隔必须是15的倍数且在有效范围内：${timer.interval}`);
		}

		// 字节0：预留3bit(000) + 索引4bit + 开关1bit
		// 格式：0000 0000 -> 000[索引4bit][开关1bit]
		const indexBits = (timer.index & 0x0F) << 1;
		const enableBit = timer.enabled ? 0x01 : 0x00;
		const secondByte = indexBits | enableBit;
		bytes.push(secondByte);

		// 开始时间（2字节，大端）：时 + 分
		bytes.push(timer.startHour & 0xFF);
		bytes.push(timer.startMinute & 0xFF);

		// 结束时间（2字节，大端）：时 + 分
		bytes.push(timer.endHour & 0xFF);
		bytes.push(timer.endMinute & 0xFF);

		// 时间间隔：实际值/15
		const intervalValue = Math.floor(timer.interval / 15);
		bytes.push(intervalValue & 0xFF);
	}

	return new Uint8Array(bytes);
}

/**
 * 解析血压定时监测的KeyValue数据
 * @param {Uint8Array} keyValue - KeyValue数据
 * @returns {Object} 解析结果 {maxTimers, currentTimers, timers: [...]}
 */
export function parseBloodPressureTimerKeyValue(keyValue) {
	if (keyValue.length < 1) {
		throw new Error('KeyValue数据为空');
	}

	const firstByte = keyValue[0];
	const maxTimers = (firstByte >> 4) & 0x0F;
	const currentTimers = firstByte & 0x0F;

	const expectedLength = 1 + currentTimers * 6;
	if (keyValue.length !== expectedLength) {
		throw new Error(`KeyValue长度错误：期望${expectedLength}，实际${keyValue.length}`);
	}

	const timers = [];
	let offset = 1;

	for (let i = 0; i < currentTimers; i++) {
		const attrByte = keyValue[offset];
		const index = (attrByte >> 1) & 0x0F;
		const enabled = (attrByte & 0x01) === 0x01;

		const startHour = keyValue[offset + 1];
		const startMinute = keyValue[offset + 2];
		const endHour = keyValue[offset + 3];
		const endMinute = keyValue[offset + 4];
		const interval = keyValue[offset + 5] * 15;

		timers.push({
			index,
			enabled,
			startHour,
			startMinute,
			endHour,
			endMinute,
			interval
		});

		offset += 6;
	}

	return {
		maxTimers,
		currentTimers,
		timers
	};
}

/**
 * 构建完整协议包（大端模式）
 * 协议格式（长度：10-512Bytes）：
 * ---------------------------------------------------------------------------------
 * 字节 | 0      | 1-2           | 3        | 4   | 5       | 6   | 7-8           | 9...
 *      | 0xE0   | 协议长度       | sumcheck | CMD | Version | KEY | KeyValueLen   | KeyValue
 *      | 1Byte  | 2Byte(9bit有效)| 1Byte   | 1Byte| 1Byte  |1Byte| 2Byte(9bit有效)| 1-503Byte
 * ---------------------------------------------------------------------------------
 * 
 * @param {number} cmd - 协议命令（如0x03）
 * @param {number} key - 协议子命令（如0x21）
 * @param {Uint8Array} keyValue - 指令值数据
 * @param {number} version - 协议版本号（默认0x01）
 * @returns {Uint8Array} 完整协议包
 */
export function buildPacket(cmd, key, keyValue, version = 0x01) {
	// 固定头部长度：1+2+1+1+1+1+2 = 9字节
	const headerLength = 9;
	const totalLength = headerLength + keyValue.length;

	// 验证总长度范围 10-512
	if (totalLength < 10 || totalLength > 512) {
		throw new Error(`协议总长度超出范围（10-512Bytes）：${totalLength}`);
	}

	// 验证KeyValue长度 1-503
	if (keyValue.length < 1 || keyValue.length > 503) {
		throw new Error(`KeyValue长度超出范围（1-503）：${keyValue.length}`);
	}

	// 创建数据缓冲区
	const packet = new Uint8Array(totalLength);

	// 填充协议头（大端模式）
	packet[0] = 0xE0; // 协议标识位

	// 协议长度 = 总长度 - 4（标识位+长度字段自身占4字节）
	const protocolLength = totalLength - 4;
	const lengthField = buildLengthField(protocolLength);
	packet[1] = lengthField[0]; // 高字节（大端）
	packet[2] = lengthField[1]; // 低字节

	packet[3] = 0x00; // 校验位（临时占位，后面计算）
	packet[4] = cmd & 0xFF; // 协议命令
	packet[5] = version & 0xFF; // 协议版本号
	packet[6] = key & 0xFF; // 协议子命令

	// KeyValue长度字段（9bit有效）
	const keyLenField = buildLengthField(keyValue.length);
	packet[7] = keyLenField[0]; // 高字节
	packet[8] = keyLenField[1]; // 低字节

	// 复制KeyValue数据
	packet.set(keyValue, 9);

	// 计算并填充校验和
	packet[3] = calculateChecksum(packet);

	return packet;
}

/**
 * 解析完整协议包
 * @param {Uint8Array} data - 完整的协议数据
 * @returns {Object} 解析后的协议对象
 */
export function parsePacket(data) {
	if (data.length < 10) {
		throw new Error(`协议包长度不足（最小10字节）：${data.length}`);
	}

	if (!verifyChecksum(data)) {
		throw new Error('协议校验失败');
	}

	// 解析协议标识位
	const marker = data[0];
	if (marker !== 0xE0) {
		throw new Error(`协议标识位错误：期望0xE0，实际0x${marker.toString(16).padStart(2, '0')}`);
	}

	// 解析协议长度字段（验证）
	const protocolLength = extractLength(data[1], data[2]);
	const expectedTotalLength = protocolLength + 4;

	if (expectedTotalLength !== data.length) {
		throw new Error(`协议长度字段与实际数据长度不符：期望${expectedTotalLength}，实际${data.length}`);
	}

	// 解析各字段
	const cmd = data[4];
	const version = data[5];
	const key = data[6];

	// 解析KeyValue长度
	const keyValueLen = extractLength(data[7], data[8]);

	if (keyValueLen < 1 || keyValueLen > 503) {
		throw new Error(`KeyValue长度超出范围（1-503）：${keyValueLen}`);
	}

	if (9 + keyValueLen > data.length) {
		throw new Error(`数据长度不足：需要${9 + keyValueLen}，实际${data.length}`);
	}

	// 提取KeyValue
	const keyValue = data.slice(9, 9 + keyValueLen);

	return {
		marker,
		cmd,
		version,
		key,
		keyValue,
		keyValueLen,
		protocolLength,
		totalLength: data.length,
		rawData: data
	};
}

/**
 * 将Uint8Array转换为十六进制字符串（用于调试）
 * @param {Uint8Array} data 
 * @returns {string}
 */
export function toHexString(data, separator = ' ') {
	return Array.from(data)
		.map(b => b.toString(16).padStart(2, '0'))
		.join(separator);
}