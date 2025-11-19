// 16 进制 → Uint8Array
export function hexStringToBytes(hex) {
	const str = hex.trim().replace(/\s/g, '');
	if (str.length % 2) return null;
	const bytes = new Uint8Array(str.length / 2);
	for (let i = 0; i < str.length; i += 2) {
		bytes[i >> 1] = parseInt(str.substr(i, 2), 16);
	}
	return bytes;
}

// 两字节大端 → 无符号 int
export function byte2IntLR(hi, lo) {
	return ((hi & 0xff) << 8 | (lo & 0xff)) >>> 0;
}


// 日期解析
export function getDateBean([hi, lo]) {
	const year = 2000 + ((hi & 0xff) >> 1);
	const month = ((hi & 0x01) << 3) | ((lo >> 5) & 0x07);
	const day = lo & 0x1f;
	return {
		year,
		month,
		day,
		formatDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
	};
}