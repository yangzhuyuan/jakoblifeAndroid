/**
 * 计算协议校验位（sumcheck）
 * 规则：除去校验位自身字节，整个协议字节数据相加取和的后8位
 * @param {Uint8Array} data - 完整的协议数据
 * @returns {number} 校验和（1字节）
 */
export function calculateChecksum(data) {
	// 校验位位于第4个字节（索引3）
	const checksumIndex = 3;
	let total = 0;
	for (let i = 0; i < data.length; i++) {
		if (i === checksumIndex) continue; // 跳过校验位自身
		total += data[i];
	}
	// 取后8位
	return total & 0xFF;
}

/**
 * 验证协议校验位是否正确
 * @param {Uint8Array} data - 完整协议数据
 * @returns {boolean} true=校验通过
 */
export function verifyChecksum(data) {
	if (data.length < 10) return false; // 最小长度为10字节

	const receivedChecksum = data[3];
	const calculatedChecksum = calculateChecksum(data);

	return receivedChecksum === calculatedChecksum;
}

/**
 * 从2字节中提取9位有效长度（忽略高7位预留位）
 * @param {number} highByte - 高8位
 * @param {number} lowByte - 低8位
 * @returns {number} 提取出的9位长度值
 */
export function extractLength(highByte, lowByte) {
	// 组合成16位数值
	const combined = (highByte << 8) | lowByte;
	// 只取低9位（bit0-bit8），忽略高7位预留位
	return combined & 0x01FF; // 0x01FF = 511 (二进制: 00000001 11111111)
}

/**
 * 构建2字节长度字段（7bit预留 + 9bit有效长度）
 * @param {number} length - 有效长度值（0-511）
 * @returns {Uint8Array} 2字节长度字段 [high, low]
 */
export function buildLengthField(length) {
	if (length < 0 || length > 511) {
		throw new Error('长度值超出9位范围（0-511）');
	}
	// 高7位预留为0，低9位为有效长度
	// 组合成16位数值：高7位为0，低9位为length
	const combined = length & 0x01FF; // 确保只取低9位
	// 拆分为高8位和低8位
	const highByte = (combined >> 8) & 0xFF;
	const lowByte = combined & 0xFF;
	return [highByte, lowByte]; // 返回普通数组，而不是Uint8Array
}

/**
 * 构建完整协议包
 * 协议格式（长度：10-512Bytes）：
 * ---------------------------------------------------------------------------------
 * 协议标识位 | 协议长度         | 协议校准位 | 协议命令 | 协议版本号 | 协议子命令 | 命令指令、长度    | 命令指令值
 * 1Byte     | 2Byte           | 1Byte     | 1Byte   | 1Byte     | 1Byte     | 2Byte            | 1~503Byte
 * 0xE0      | 7bit预留 + 9bit | sumcheck  | CMD     | Version   | KEY       | 7bit预留 + 9bit  | KeyValue
 *           | Lenth           |           |         |           |           | KeyValueLen      |
 * ---------------------------------------------------------------------------------
 * 
 * 说明：
 * - 协议长度：Lenth为协议数据-4的值（9位有效）
 * - 命令指令长度：KeyValueLen为命令指令值整体位数（9位有效）
 * 
 * @param {number} cmd - 协议命令
 * @param {number} key - 协议子命令
 * @param {Uint8Array} keyValue - 指令值数据
 * @returns {Uint8Array} 完整协议包
 */
/**
 * 构建完整协议包（最安全的版本）
 */
export function buildPacket(cmd, key, keyValue) {
	// 固定头部长度
	const headerLength = 9;
	const totalLength = headerLength + keyValue.length;
	// 验证长度
	if (totalLength < 9 || totalLength > 512) {
		throw new Error(`协议总长度超出范围（10-512Bytes）：${totalLength}`);
	}
	// 创建数据缓冲区
	const packet = new Uint8Array(totalLength);
	// 填充头部
	packet[0] = 0xE0;
	// 协议长度
	const protocolLength = totalLength - 4;
	if (protocolLength < 0 || protocolLength > 511) {
		throw new Error(`协议长度值超出9位范围：${protocolLength}`);
	}
	const lengthField = buildLengthField(protocolLength);
	packet[1] = lengthField[0]; // 现在lengthField是普通数组
	packet[2] = lengthField[1];
	packet[3] = 0; // 校验位（临时）
	packet[4] = cmd;
	packet[5] = 0x01;
	packet[6] = key;
	// KeyValue长度
	const keyLenField = buildLengthField(keyValue.length);
	packet[7] = keyLenField[0];
	packet[8] = keyLenField[1];
	// 手动复制KeyValue数据
	for (let i = 0; i < keyValue.length; i++) {
		packet[9 + i] = keyValue[i];
	}
	// 计算校验和
	packet[3] = calculateChecksum(packet);
	// 额外验证：确保没有多余的字节
	if (packet.length !== totalLength) {
		console.error('数据包长度异常！');
	}
	return packet;
}
/**
 * 解析协议包
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
		throw new Error(`协议标识位错误：期望0xE0，实际0x${marker.toString(16)}`);
	}

	// 解析协议长度字段（2字节，9位有效）
	const protocolLength = extractLength(data[1], data[2]);
	const actualTotalLength = protocolLength + 4; // 加上4得到实际总长度

	if (actualTotalLength !== data.length) {
		throw new Error(`协议长度字段与实际数据长度不符：期望${actualTotalLength}，实际${data.length}`);
	}

	// 解析协议命令
	const cmd = data[4];

	// 解析协议版本号
	const version = data[5];

	// 解析协议子命令
	const key = data[6];

	// 解析命令指令长度字段（2字节，9位有效）
	const keyValueLen = extractLength(data[7], data[8]);

	// 验证KeyValue长度是否在范围内
	if (keyValueLen < 0 || keyValueLen > 503) {
		throw new Error(`KeyValue长度超出范围（1-503）：${keyValueLen}`);
	}

	// 验证数据长度是否足够包含KeyValue
	if (9 + keyValueLen > data.length) {
		throw new Error(`数据长度不足：需要${9 + keyValueLen}，实际${data.length}`);
	}

	// 提取KeyValue数据
	const keyValue = data.slice(9, 9 + keyValueLen);

	return {
		marker, // 协议标识位（应为0xE0）
		cmd, // 协议命令
		version, // 协议版本号
		key, // 协议子命令
		keyValue, // 指令值数据（Uint8Array）
		keyValueLen, // 指令值长度
		protocolLength, // 协议长度（Lenth）
		totalLength: actualTotalLength, // 实际总长度
		rawData: data // 原始数据
	};
}