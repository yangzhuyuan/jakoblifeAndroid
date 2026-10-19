/**
 * WHO/ISH 2020 血压分类（与弹窗等级表一致）
 *
 * 规则：
 * 1. 血压偏低：收缩压 < 91 或舒张压 < 61；收缩压已进入高血压区间时仍按高血压分级
 * 2. 正常血压：收缩压与舒张压均需满足
 * 3. 其余等级：任一满足即可
 * 4. 高压、低压分属不同等级时，优先按收缩压；收缩压未命中再按舒张压
 *
 * @param {number|string} lowPressure 舒张压
 * @param {number|string} highPressure 收缩压
 * @returns {{ level: number, key: string }}
 *   level: 0 正常 / 1 正常高血压值 / 2 一级 / 3 二级 / 4 偏低 / -1 未知
 */
export function classifyBloodPressure(lowPressure, highPressure) {
	const low = Number(lowPressure);
	const high = Number(highPressure);
	if (!Number.isFinite(low) || !Number.isFinite(high)) {
		return {
			level: -1,
			key: '未知'
		};
	}

	// 血压偏低：小于正常下限；收缩压已达高血压范围时不按偏低处理
	if (high < 91 || (low < 61 && high <= 120)) {
		return {
			level: 4,
			key: '血压偏低'
		};
	}

	// 正常血压：双条件同时满足
	if (high >= 91 && high <= 120 && low >= 61 && low <= 80) {
		return {
			level: 0,
			key: '正常血压'
		};
	}

	// 优先收缩压
	if (high >= 121 && high <= 140) {
		return {
			level: 1,
			key: '正常高血压值'
		};
	}
	if (high >= 141 && high <= 160) {
		return {
			level: 2,
			key: '一级高血压'
		};
	}
	if (high >= 161 && high <= 180) {
		return {
			level: 3,
			key: '二级高血压'
		};
	}

	// 收缩压未命中时再看舒张压
	if (low >= 81 && low <= 90) {
		return {
			level: 1,
			key: '正常高血压值'
		};
	}
	if (low >= 91 && low <= 100) {
		return {
			level: 2,
			key: '一级高血压'
		};
	}
	if (low >= 101 && low <= 110) {
		return {
			level: 3,
			key: '二级高血压'
		};
	}

	return {
		level: -1,
		key: '未知'
	};
}

export default {
	classifyBloodPressure
};
