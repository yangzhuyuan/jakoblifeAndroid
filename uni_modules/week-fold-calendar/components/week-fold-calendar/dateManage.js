/**
 * 使用本地时间（用户所在时区）
 */

/**
 * 获取当前本地时间的年月日
 */
export function getLocalNow() {
	const now = new Date();
	return {
		year: now.getFullYear(),
		month: now.getMonth() + 1, // getMonth 是 0-11
		day: now.getDate(),
		hour: now.getHours(),
		minute: now.getMinutes(),
		second: now.getSeconds()
	};
}

/**
 * 将日期字符串解析为本地时间对象
 */
export function parseLocalDate(dateStr) {
	if (!dateStr) return getLocalNow();

	const clean = dateStr.replace(/\//g, '-');
	const match = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (!match) return getLocalNow();

	const [, year, month, day] = match;
	return {
		year: parseInt(year),
		month: parseInt(month),
		day: parseInt(day)
	};
}

/**
 * 获取本地时间的星期几 (0=周日, 1=周一, ..., 6=周六)
 * 使用 Zeller 公式
 */
export function getLocalWeekDay(year, month, day) {
	if (month < 3) {
		month += 12;
		year -= 1;
	}
	const c = Math.floor(year / 100);
	const y = year % 100;
	const w = (y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor(26 * (month + 1) / 10) + day - 1) % 7;
	return (w + 7) % 7;
}

/**
 * 获取月份天数
 */
export function getMonthDays(month, year) {
	if (month === 2) {
		const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
		return isLeap ? 29 : 28;
	}
	return [1, 3, 5, 7, 8, 10, 12].includes(month) ? 31 : 30;
}

export function padStart(n) {
	return n.toString().padStart(2, '0');
}

/**
 * 当前本地日期字符串
 */
export function currentDate(format = 'yyyy-mm-dd') {
	const now = getLocalNow();
	return formatDateParts(now, format);
}

/**
 * 格式化日期对象
 */
export function formatDateParts(parts, format = 'yyyy-mm-dd') {
	const {
		year,
		month,
		day
	} = parts;
	const y = year;
	const m = padStart(month);
	const d = padStart(day);

	switch (format) {
		case 'yyyy-mm-dd':
			return `${y}-${m}-${d}`;
		case 'yyyy/mm/dd':
			return `${y}/${m}/${d}`;
		case 'yyyy年mm月dd日':
			return `${y}年${m}月${d}日`;
		case 'yyyy-mm':
			return `${y}-${m}`;
		case 'yyyy/mm':
			return `${y}/${m}`;
		case 'yyyy年mm月':
			return `${y}年${m}月`;
		default:
			return `${y}-${m}-${d}`;
	}
}

/**
 * 格式化日期字符串
 */
export function formattedDate(dateStr, format = 'yyyy-mm-dd') {
	const parts = parseLocalDate(dateStr);
	return formatDateParts(parts, format);
}

/**
 * 日期转天数（从1970-01-01开始）
 */
function dateToDays(year, month, day) {
	const y = year - 1;
	const leapYears = Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
	const normalDays = y * 365 + leapYears;

	const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
		monthDays[2] = 29;
	}

	let monthTotal = 0;
	for (let i = 1; i < month; i++) {
		monthTotal += monthDays[i];
	}

	return normalDays + monthTotal + day - 1;
}

/**
 * 天数转日期
 */
function daysToDate(days) {
	let year = Math.floor(days / 365.2425) + 1;

	while (dateToDays(year, 1, 1) > days) year--;
	while (dateToDays(year + 1, 1, 1) <= days) year++;

	const yearStart = dateToDays(year, 1, 1);
	const dayOfYear = days - yearStart;

	const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
		monthDays[2] = 29;
	}

	let month = 1;
	let remaining = dayOfYear;
	while (month <= 12 && remaining >= monthDays[month]) {
		remaining -= monthDays[month];
		month++;
	}

	return {
		year,
		month,
		day: remaining + 1
	};
}

/**
 * 计算日期差（天数）
 */
export function getDaysDifference(startStr, endStr) {
	const start = parseLocalDate(startStr);
	const end = parseLocalDate(endStr);
	return dateToDays(start.year, start.month, start.day) - dateToDays(end.year, end.month, end.day);
}

/**
 * 获取指定偏移天数的日期
 */
export function getAppointDate(targetStr, dayOffset) {
	const target = parseLocalDate(targetStr);
	const targetDays = dateToDays(target.year, target.month, target.day);
	const resultDays = targetDays + dayOffset;
	const result = daysToDate(resultDays);
	return formatDateParts(result, 'yyyy-mm-dd');
}

/**
 * 计算月份差
 */
export function reduMonths(startStr, endStr) {
	const start = parseLocalDate(startStr);
	const end = parseLocalDate(endStr);
	return (start.year - end.year) * 12 + (start.month - end.month);
}

/**
 * 获取月份边界
 */
export function getMonthBounds(dateStr) {
	const parts = parseLocalDate(dateStr);
	const {
		year,
		month
	} = parts;
	const days = getMonthDays(month, year);

	return {
		firstDay: `${year}-${padStart(month)}-01`,
		lastDay: `${year}-${padStart(month)}-${padStart(days)}`,
		year,
		month,
		days
	};
}

/**
 * 获取周起始日（周日）
 */
export function getWeekStart(dateStr) {
	const parts = parseLocalDate(dateStr);
	const weekday = getLocalWeekDay(parts.year, parts.month, parts.day);
	const currentDays = dateToDays(parts.year, parts.month, parts.day);
	const weekStartDays = currentDays - weekday;
	const result = daysToDate(weekStartDays);
	return formatDateParts(result, 'yyyy-mm-dd');
}

/**
 * 获取日期详情
 */
export function getDateInfo(dateStr) {
	const parts = parseLocalDate(dateStr);
	const weekday = getLocalWeekDay(parts.year, parts.month, parts.day);

	return {
		...parts,
		padMonth: padStart(parts.month),
		padDay: padStart(parts.day),
		weekday,
		dateStr: formatDateParts(parts, 'yyyy-mm-dd')
	};
}

// 为了保持兼容性，保留原来的函数名作为别名
export const getBeijingNow = getLocalNow;
export const getBeijingWeekDay = getLocalWeekDay;
export const parseBeijingDate = parseLocalDate;