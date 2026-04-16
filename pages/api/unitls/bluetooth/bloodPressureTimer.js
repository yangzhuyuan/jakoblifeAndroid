// /api/unitls/bluetooth/bloodPressureTimer.js

import {
	buildPacket
} from './checksum.js';

/**
 * 构建血压定时监测的KeyValue数据
 * @param {Object} config - { maxTimers, timers: [{index, enabled, startHour, startMinute, endHour, endMinute, interval}] }
 * @returns {Uint8Array}
 */
export function buildBloodPressureTimerKeyValue(config) {
	const {
		maxTimers = 3, timers = []
	} = config;

	if (timers.length === 0) {
		throw new Error('定时器数组不能为空');
	}
	if (timers.length > maxTimers) {
		throw new Error(`定时器数量${timers.length}超出最大值${maxTimers}`);
	}
	if (maxTimers > 15) {
		throw new Error('最大数量不能超过15');
	}

	const currentCount = timers.length;
	// 第一个字节：最大数量(高4bit) | 当前数量(低4bit)
	const firstByte = ((maxTimers & 0x0F) << 4) | (currentCount & 0x0F);

	const bytes = [firstByte];

	for (const timer of timers) {
		// 验证并转换数据（确保是数字）
		const index = parseInt(timer.index, 10);
		const enabled = !!timer.enabled;
		const startHour = parseInt(timer.startHour, 10);
		const startMinute = parseInt(timer.startMinute, 10);
		const endHour = parseInt(timer.endHour, 10);
		const endMinute = parseInt(timer.endMinute, 10);
		const interval = parseInt(timer.interval, 10);

		// 验证范围
		if (index < 0 || index > 15) throw new Error(`索引超出范围(0-15): ${index}`);
		if (startHour < 0 || startHour > 23) throw new Error(`开始小时非法: ${startHour}`);
		if (startMinute < 0 || startMinute > 59) throw new Error(`开始分钟非法: ${startMinute}`);
		if (endHour < 0 || endHour > 23) throw new Error(`结束小时非法: ${endHour}`);
		if (endMinute < 0 || endMinute > 59) throw new Error(`结束分钟非法: ${endMinute}`);
		if (interval < 15 || interval > 3825 || interval % 15 !== 0) {
			throw new Error(`间隔必须是15的倍数且在15-3825之间: ${interval}`);
		}

		// 字节0：预留3bit(000) + 索引4bit + 开关1bit
		const secondByte = ((index & 0x0F) << 1) | (enabled ? 0x01 : 0x00);
		bytes.push(secondByte);

		// 开始时间（2字节，大端）：时 + 分
		bytes.push(startHour & 0xFF);
		bytes.push(startMinute & 0xFF);

		// 结束时间（2字节，大端）：时 + 分
		bytes.push(endHour & 0xFF);
		bytes.push(endMinute & 0xFF);

		// 时间间隔：实际值/15
		bytes.push((interval / 15) & 0xFF);
	}

	return new Uint8Array(bytes);
}

/**
 * 构建完整的血压定时监测协议包（CMD:0x03 KEY:0x21）
 * @param {Object} config - { maxTimers, timers: [...] }
 * @returns {Uint8Array}
 */
export function buildBloodPressureTimerPacket(config) {
	const keyValue = buildBloodPressureTimerKeyValue(config);
	return buildPacket(0x03, 0x21, keyValue);
}

/**
 * 解析血压定时监测响应数据（固件上报）
 * @param {Uint8Array} keyValue - 解析后的KeyValue数据
 * @returns {Object} { maxTimers, currentCount, timers: [...] }
 */
export function parseBloodPressureTimerResponse(keyValue) {
	if (keyValue.length < 1) {
		throw new Error('KeyValue数据为空');
	}

	const firstByte = keyValue[0];
	const maxTimers = (firstByte >> 4) & 0x0F;
	const currentCount = firstByte & 0x0F;

	const expectedLength = 1 + currentCount * 6;
	if (keyValue.length !== expectedLength) {
		throw new Error(`KeyValue长度错误：期望${expectedLength}，实际${keyValue.length}`);
	}

	const timers = [];
	let offset = 1;

	for (let i = 0; i < currentCount; i++) {
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
		currentCount,
		timers
	};
}

/**
 * 构建扩展指令包（CMD:0x03 KEY:0x22）- 用于读取配置
 * @param {Uint8Array} keyValue - 可选的数据
 * @returns {Uint8Array}
 */
export function buildBloodPressureTimerExtPacket(keyValue = new Uint8Array(0)) {
	return buildPacket(0x03, 0x22, keyValue);
}