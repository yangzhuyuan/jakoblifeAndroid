/**
 * 心电图详情页显示用极性校正（仅供 ecgFullUpright 使用）。
 * 不改动上报/测量/原 ecgFull 逻辑。
 */
export const ECG_DISPLAY_POLARITY = -1;

/**
 * 将 ECG 采样整体取反，使 R 峰朝上（画布约定：正值向上）。
 * @param {number[]} arr
 * @param {number} [polarity=ECG_DISPLAY_POLARITY]
 * @returns {number[]}
 */
export function flipEcgDisplayPolarity(arr, polarity = ECG_DISPLAY_POLARITY) {
	if (!arr || !arr.length) return [];
	if (polarity === 1) return arr.slice();
	const out = new Array(arr.length);
	for (let i = 0; i < arr.length; i++) {
		const v = arr[i];
		out[i] = Number.isFinite(v) ? v * polarity : v;
	}
	return out;
}
