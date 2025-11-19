// utils/dailyClear.js

/**
 * 检查并清除今日目标数据
 */
export const clearDailyGoalData = () => {
	const today = getTodayDateString();
	const lastClearDate = uni.getStorageSync('lastClearDate');

	// 如果是新的一天，清除今日目标数据
	if (lastClearDate !== today) {
		uni.removeStorageSync("today_Daily_Goal");
		uni.setStorageSync('lastClearDate', today);
		console.log('✅ 今日目标数据已清除');
		return true;
	}

	return false;
};

/**
 * 获取今日日期字符串 (YYYY-MM-DD)
 */
export const getTodayDateString = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const date = String(now.getDate()).padStart(2, '0');
	return `${year}-${month}-${date}`;
};

/**
 * 手动立即清除数据（用于测试）
 */
export const forceClearDailyGoal = () => {
	uni.removeStorageSync("today_Daily_Goal");
	uni.removeStorageSync('lastClearDate');
	console.log('✅ 今日目标数据已强制清除');
};