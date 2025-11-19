// utils/hex.js
/* 把一个 16 进制字符串转成 Uint8Array */
export function hexToU8a(hex) {
	const str = hex.replace(/\s/g, '');
	const len = str.length;
	if (len % 2 !== 0) throw new Error('Invalid hex length');
	const res = new Uint8Array(len / 2);
	for (let i = 0; i < len; i += 2) {
		res[i / 2] = parseInt(str.substr(i, 2), 16);
	}
	return res;
}

/* 等价于 Java 的 HexUtil.byte2IntLR(byte... arr) */
export function byte2IntLR(...arr) {
	// arr 可以是 [0x12, 0x34]，也可以是 Uint8Array
	let res = 0;
	for (let i = 0; i < arr.length; i++) {
		res = (res << 8) | (arr[i] & 0xff);
	}
	// JS 里位运算都是带符号 32 位，需要 >>>0 转无符号
	return res >>> 0;
}
export function hexStringToBytes(hex) {
	if (!hex || hex.trim() === '') return null;
	let str = hex.trim().replace(/\s/g, '').replace(/^0x/i, '');
	if (str.length % 2) return null;
	const bytes = new Uint8Array(str.length / 2);
	for (let i = 0; i < str.length; i += 2) {
		bytes[i >> 1] = parseInt(str.substr(i, 2), 16);
	}
	return bytes;
}