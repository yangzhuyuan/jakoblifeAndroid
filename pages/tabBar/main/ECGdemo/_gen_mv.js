const fs = require('fs');
const path = 'c:/Users/27474/xwechat_files/wxid_jg1rfb2upl3y12_d4a0/msg/file/2026-07/250hz_40s(1).txt';
const txt = fs.readFileSync(path, 'utf8');
const hexList = txt.match(/[0-9A-Fa-f]{2}/g) || [];
const bytes = hexList.map((h) => parseInt(h, 16));
const lines = [];
let cur = [];
for (const b of bytes) {
	if (b === 0x0a) {
		lines.push(Buffer.from(cur));
		cur = [];
	} else cur.push(b);
}
if (cur.length) lines.push(Buffer.from(cur));
const vals = [];
for (const lb of lines) {
	const t = lb.toString('latin1').trim();
	if (!t.startsWith('#')) continue;
	const m = t.match(/#\s*([-+]?\d+(?:\.\d+)?)/);
	if (m) vals.push(Number(m[1]));
}
const vr = 500;
const scale = 32767 / vr;
const n = Math.min(vals.length, 10000);
const mv = [];
for (let i = 0; i < n; i++) {
	const x = Math.max(-vr, Math.min(vr, vals[i] / 1000));
	const iv = Math.trunc(x * scale);
	mv.push(Number((iv / scale).toFixed(6)));
}
const out = 'd:/workdemo/jianbo3/jakoblifeandroidn/pages/tabBar/main/ECGdemo/parsed_voltage_mV.txt';
fs.writeFileSync(out, `# unit=mV n=${mv.length} fs=250Hz voltage_range=500\n` + mv.join('\n') + '\n');
console.log(JSON.stringify({ n: mv.length, min: Math.min(...mv), max: Math.max(...mv), head20: mv.slice(0, 20), out }, null, 2));
