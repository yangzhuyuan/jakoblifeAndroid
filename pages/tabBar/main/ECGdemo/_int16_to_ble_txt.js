/**
 * INT16 LE hex → BLE.txt 格式（#浮点帧 + 校验 + 0A，含起止控制帧）
 * Usage: node _int16_to_ble_txt.js <input_hex.txt> <output_BLE.txt>
 */
const fs = require('fs');
const path = require('path');

const CTRL_START = [0xa6, 0x15, 0x01, 0x16, 0x0a];
const CTRL_END = [0xa6, 0x15, 0x00, 0x15, 0x0a];
const BYTES_PER_LINE = 16;

function checksum(payloadBytes) {
	let s = 0;
	for (let i = 0; i < payloadBytes.length; i++) s = (s + payloadBytes[i]) & 0xff;
	return s;
}

function encodeSampleFrame(v) {
	// 与 BLE.txt 一致：固定两位小数，如 #-33.03 / #9.00
	const text = Number(v).toFixed(2);
	const payload = [];
	for (let i = 0; i < text.length; i++) payload.push(text.charCodeAt(i) & 0xff);
	const cs = checksum(payload);
	return [0x23, ...payload, cs, 0x0a];
}

function wrapHexLines(bytes, n = BYTES_PER_LINE) {
	const parts = bytes.map((b) => (b & 0xff).toString(16).padStart(2, '0').toUpperCase());
	const lines = [];
	for (let i = 0; i < parts.length; i += n) {
		lines.push(parts.slice(i, i + n).join(' '));
	}
	return lines.join('\n') + (parts.length ? '\n' : '');
}

function main() {
	const inPath = process.argv[2];
	const outPath = process.argv[3];
	if (!inPath || !outPath) {
		console.error('Usage: node _int16_to_ble_txt.js <input_hex.txt> <output_BLE.txt>');
		process.exit(1);
	}
	const raw = fs.readFileSync(inPath, 'utf8');
	const hexList = String(raw).match(/[0-9A-Fa-f]{2}/g) || [];
	if (hexList.length < 2) {
		console.error('No hex bytes found');
		process.exit(1);
	}
	if (hexList.length % 2 !== 0) {
		console.warn('Odd byte count, dropping last nibble-pair imbalance:', hexList.length);
	}
	const nSamples = Math.floor(hexList.length / 2);
	const samples = [];
	for (let i = 0; i < nSamples; i++) {
		const lo = parseInt(hexList[i * 2], 16);
		const hi = parseInt(hexList[i * 2 + 1], 16);
		let v = (hi << 8) | lo;
		if (v & 0x8000) v = v - 0x10000;
		samples.push(v);
	}

	const outBytes = [...CTRL_START];
	for (let i = 0; i < samples.length; i++) {
		outBytes.push(...encodeSampleFrame(samples[i]));
	}
	outBytes.push(...CTRL_END);

	fs.writeFileSync(outPath, wrapHexLines(outBytes), 'utf8');
	const absMin = Math.min(...samples);
	const absMax = Math.max(...samples);
	console.log(JSON.stringify({
		inputBytes: hexList.length,
		samples: samples.length,
		outBytes: outBytes.length,
		sampleRange: [absMin, absMax],
		headSamples: samples.slice(0, 8),
		outPath
	}, null, 2));
}

main();
