/**
 * INT16 小端 hex 连续流 → ble-test-data.js
 * 解包：mV = int16 / (32767/voltageRange)，默认 voltageRange=500（对齐 upload/store_data）
 * 组帧：mV→ADC→23|len|LE|cs|0A，供模拟回放走 tryParse/parseWave
 */
const fs = require('fs');
const path = require('path');

const VOLTAGE_RANGE = 500;
const FS_HZ = 250;
const CUSTOMER_GAIN = 400;
const ABS_LIMIT_MV = 5;
const BLE_ADC_MID = 2048;
const BLE_ADC_FS_MV = 3300;
const BLE_ADC_FULL = 4096;
const GROUPS_PER_FRAME = 5;

const src =
	process.argv[2] ||
	path.join(__dirname, 'ble_int16_raw.hex');
const outJs = path.join(__dirname, 'ble-test-data.js');

let raw = fs.readFileSync(src, 'utf8');
raw = raw.replace(/[\s\u4e00-\u9fff]/g, '');
if (!/^[0-9A-Fa-f]+$/.test(raw) || raw.length % 4 !== 0) {
	throw new Error('invalid INT16 hex: len=' + raw.length);
}

const scale = 32767 / VOLTAGE_RANGE;
const mv = [];
for (let i = 0; i < raw.length; i += 4) {
	const iv = (parseInt(raw.substr(i, 2), 16) | (parseInt(raw.substr(i + 2, 2), 16) << 8)) << 16 >> 16;
	mv.push(parseFloat((iv / scale).toFixed(6)));
}

function bleMvToAdc(mvVal) {
	const x = Math.round(
		Number(mvVal) * CUSTOMER_GAIN * BLE_ADC_FULL / BLE_ADC_FS_MV + BLE_ADC_MID
	);
	return Math.max(0, Math.min(4095, x));
}

function bleFrameChecksum(payloadBytes) {
	let s = 0;
	for (let i = 0; i < payloadBytes.length; i++) s = (s + (payloadBytes[i] & 0xff)) & 0xff;
	if (s === 0x0a) s = 0x00;
	return s;
}

function buildBleWaveFrameBytes(adcSamples) {
	const n = adcSamples.length;
	const payload = [n & 0xff];
	for (let i = 0; i < n; i++) {
		const adc = adcSamples[i] | 0;
		payload.push(adc & 0xff, (adc >> 8) & 0xff);
	}
	return [0x23, ...payload, bleFrameChecksum(payload), 0x0a];
}

function encodeBleWaveFrameHexList(mvList) {
	const frames = [];
	for (let i = 0; i < mvList.length;) {
		const n = Math.min(GROUPS_PER_FRAME, mvList.length - i);
		const adcs = [];
		for (let j = 0; j < n; j++) adcs.push(bleMvToAdc(mvList[i + j]));
		i += n;
		frames.push(
			buildBleWaveFrameBytes(adcs)
				.map((b) => ('00' + b.toString(16)).slice(-2))
				.join('')
		);
	}
	return frames;
}

const frames = encodeBleWaveFrameHexList(mv);
const sec = +(mv.length / FS_HZ).toFixed(3);

function fmtNum(v) {
	const n = Number(v);
	if (!Number.isFinite(n)) return '0';
	return String(parseFloat(n.toFixed(6)));
}

const lines = [];
lines.push('/**');
lines.push(' * Auto-generated from ' + path.basename(src));
lines.push(' * Source: INT16 LE hex, voltageRange=' + VOLTAGE_RANGE + ' → mV → BLE protocol frames');
lines.push(' * n=' + mv.length + ' fs=' + FS_HZ + 'Hz → ' + sec + 's; frames=' + frames.length);
lines.push(' */');
lines.push('export const bleTestEcgFs = ' + FS_HZ + ';');
lines.push('export const bleTestEcgSeconds = ' + Math.round(sec) + ';');
lines.push('/** false：已是 mV，无需 uV→mV */');
lines.push('export const bleTestEcgNeedUvToMv = false;');
lines.push('/** INT16 小端 hex（无空格），对齐 store_data 上报格式 */');
lines.push('export const bleTestEcgInt16Hex =');
lines.push('\t\'' + raw + '\';');
lines.push('export const bleTestEcgVoltageRange = ' + VOLTAGE_RANGE + ';');
lines.push('/** 原始协议帧 hex（无空格），模拟回放直接喂 tryParse */');
lines.push('export const bleTestEcgFrameHex = [');
for (let f = 0; f < frames.length; f += 6) {
	const chunk = frames
		.slice(f, f + 6)
		.map((h) => "'" + h + "'")
		.join(', ');
	lines.push('\t' + chunk + (f + 6 < frames.length ? ',' : ''));
}
lines.push('];');
lines.push('export const bleTestEcgData = [');
for (let j = 0; j < mv.length; j += 8) {
	const chunk = mv
		.slice(j, j + 8)
		.map(fmtNum)
		.join(', ');
	lines.push('\t' + chunk + (j + 8 < mv.length ? ',' : ''));
}
lines.push('];');
lines.push('');

fs.writeFileSync(outJs, lines.join('\n'));

const abs = mv.map(Math.abs).sort((a, b) => a - b);
const pct = (q) => abs[Math.floor((abs.length - 1) * q)];
console.log(
	JSON.stringify(
		{
			src: path.basename(src),
			points: mv.length,
			frames: frames.length,
			sec,
			min: +Math.min(...mv).toFixed(6),
			max: +Math.max(...mv).toFixed(6),
			p50: +pct(0.5).toFixed(6),
			headMv: mv.slice(0, 5),
			headInt16: [
				(parseInt(raw.substr(0, 2), 16) | (parseInt(raw.substr(2, 2), 16) << 8)) << 16 >> 16,
				(parseInt(raw.substr(4, 2), 16) | (parseInt(raw.substr(6, 2), 16) << 8)) << 16 >> 16
			],
			bytes: fs.statSync(outJs).size
		},
		null,
		2
	)
);
