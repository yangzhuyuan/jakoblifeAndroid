/**
 * Parse ble_notify dump → ble-test-data.js
 * Protocol: 23|len|LE uint16×len|cs|0A → (adc-2048)*3300/4096/400 = mV（对齐 PC customer_gain）
 * Checksum: (len+data)&0xFF; if 0x0A then 0x00
 * |mV|>5 丢弃（对齐 PC ABS_LIMIT）
 */
const fs = require('fs');
const path = require('path');

const CUSTOMER_GAIN = 400;
const ABS_LIMIT_MV = 5;

const src =
	process.argv[2] ||
	path.join(__dirname, 'ble_notify_20260822_102705.txt');
const outDir = __dirname;
const outJs = path.join(outDir, 'ble-test-data.js');

const txt = fs.readFileSync(src, 'utf8');
const hexList = txt.match(/[0-9A-Fa-f]{2}/g) || [];
const arr = hexList.map((h) => parseInt(h, 16));

function checksumOk(frame) {
	if (frame.length < 5 || frame[frame.length - 1] !== 0x0a) return false;
	const sumRx = frame[frame.length - 2];
	let sum = 0;
	for (let i = 1; i < frame.length - 2; i++) sum = (sum + frame[i]) & 0xff;
	if (sum === 0x0a) sum = 0x00;
	return sum === sumRx;
}

function adcToMv(adc) {
	return ((adc - 2048) * 3300) / 4096 / CUSTOMER_GAIN;
}

const mv = [];
const frames = [];
let i = 0;
let ok = 0;
let bad = 0;
let cmds = 0;
let dropped = 0;

while (i < arr.length) {
	const head = arr[i];
	if (head === 0x23) {
		if (i + 1 >= arr.length) break;
		const n = arr[i + 1];
		if (n < 1 || n > 30) {
			i++;
			continue;
		}
		const fl = 4 + n * 2;
		if (i + fl > arr.length) break;
		const frame = arr.slice(i, i + fl);
		if (frame[fl - 1] !== 0x0a || !checksumOk(frame)) {
			i++;
			bad++;
			continue;
		}
		frames.push(frame.map((b) => ('00' + b.toString(16)).slice(-2)).join(''));
		for (let g = 0; g < n; g++) {
			const off = 2 + g * 2;
			const adc = frame[off] | (frame[off + 1] << 8);
			const v = adcToMv(adc);
			if (Math.abs(v) > ABS_LIMIT_MV) {
				dropped++;
				continue;
			}
			mv.push(v);
		}
		ok++;
		i += fl;
		continue;
	}
	if (head === 0xa5 || head === 0xa6) {
		let found = false;
		for (let end = i + 4; end < Math.min(arr.length, i + 16); end++) {
			if (arr[end] !== 0x0a) continue;
			const frame = arr.slice(i, end + 1);
			if (checksumOk(frame)) {
				cmds++;
				i = end + 1;
				found = true;
				break;
			}
		}
		if (!found) i++;
		continue;
	}
	i++;
}

const fsHz = 250;
const sec = +(mv.length / fsHz).toFixed(3);

function fmtNum(v) {
	const n = Number(v);
	if (!Number.isFinite(n)) return '0';
	return String(parseFloat(n.toFixed(6)));
}

const lines = [];
lines.push('/**');
lines.push(' * Auto-generated from ' + path.basename(src));
lines.push(' * Protocol: 23|len|LE uint16×len|cs|0A → (adc-2048)*3300/4096/' + CUSTOMER_GAIN + ' = mV');
lines.push(' * Checksum: (len+data)&0xFF; if 0x0A then 0x00; |mV|>' + ABS_LIMIT_MV + ' drop');
lines.push(' * n=' + mv.length + ' fs=' + fsHz + 'Hz → ' + sec + 's; frames=' + frames.length + '; dropped=' + dropped);
lines.push(' */');
lines.push('export const bleTestEcgFs = ' + fsHz + ';');
lines.push('export const bleTestEcgSeconds = ' + Math.round(sec) + ';');
lines.push('/** false：已是协议解析后的临床 mV（含 /gain' + CUSTOMER_GAIN + '） */');
lines.push('export const bleTestEcgNeedUvToMv = false;');
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

if (path.resolve(src) !== path.resolve(path.join(outDir, path.basename(src)))) {
	fs.copyFileSync(src, path.join(outDir, path.basename(src)));
}
fs.writeFileSync(outJs, lines.join('\n'));

const abs = mv.map(Math.abs).sort((a, b) => a - b);
const pct = (q) => abs[Math.floor((abs.length - 1) * q)];
console.log(
	JSON.stringify(
		{
			src: path.basename(src),
			outJs,
			okFrames: ok,
			badSkips: bad,
			cmds,
			points: mv.length,
			dropped,
			sec,
			min: +Math.min(...mv).toFixed(6),
			max: +Math.max(...mv).toFixed(6),
			p50: +pct(0.5).toFixed(6),
			p99: +pct(0.99).toFixed(6),
			headMv: mv.slice(0, 5).map((v) => +v.toFixed(6)),
			bytes: fs.statSync(outJs).size
		},
		null,
		2
	)
);
