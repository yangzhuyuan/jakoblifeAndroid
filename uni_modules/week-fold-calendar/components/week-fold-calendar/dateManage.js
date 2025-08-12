// dateManage.js
export function padStart(n) {
	return n.toString().padStart(2, 0);
}

export function currentDate(format = 'yyyy-mm-dd') {
	const date = new Date();
	const year = date.getFullYear();
	const month = padStart(date.getMonth() + 1);
	const day = padStart(date.getDate());
	if (format === 'yyyy-mm-dd') {
		return `${year}-${month}-${day}`;
	}
	if (format === 'yyyy/mm/dd') {
		return `${year}/${month}/${day}`;
	}
	return `${year}年${month}月${day}日`;
}

export function formattedDate(timestamp, format = 'yyyy-mm-dd') {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = padStart(date.getMonth() + 1);
	const day = padStart(date.getDate());
	switch (format) {
		case 'yyyy-mm-dd':
			return `${year}-${month}-${day}`;
		case 'yyyy/mm/dd':
			return `${year}/${month}/${day}`;
		case 'yyyy年mm月dd日':
			return `${year}年${month}月${day}日`;
		case 'yyyy-mm':
			return `${year}-${month}`;
		case 'yyyy/mm':
			return `${year}/${month}`;
		case 'yyyy年mm月':
			return `${year}年${month}月`;
		default:
			return `${year}-${month}-${day}`;
	}
}

export function getAppointDate(targetDate, day) {
	const datetmp = new Date(targetDate.replace(/-/g, '/')).getTime();
	let result = new Date(datetmp + 24 * 60 * 60 * 1000 * day);
	return `${result.getFullYear()}-${padStart(result.getMonth() + 1)}-${padStart(result.getDate())}`;
}

export function getDaysDifference(startDate, enDate) {
	const sDate = Date.parse(startDate.replace(/-/g, '/'));
	const eDate = Date.parse(enDate.replace(/-/g, '/'));
	const days = (sDate - eDate) / (24 * 60 * 60 * 1000);
	return days;
}

export function getMonthDays(nowMonth, nowYear) {
	let month_arr = [1, 3, 5, 7, 8, 10, 12];
	let days = 0;
	if (nowMonth == 2) {
		if (nowYear % 4 == 0) {
			days = 29;
		} else {
			days = 28;
		}
	} else if (month_arr.indexOf(nowMonth) >= 0) {
		days = 31;
	} else {
		days = 30;
	}
	return days;
}

export function reduMonths(startMonth, endMonth) {
	let startY = startMonth.split('-')[0];
	let startM = startMonth.split('-')[1];
	let endY = endMonth.split('-')[0];
	let endM = endMonth.split('-')[1];
	startMonth = startY + startM;
	endMonth = endY + endM;
	if (startMonth > endMonth) {
		let reduY = startY - endY;
		let reduM = startM - endM;
		return reduY * 12 + reduM;
	} else if (startMonth < endMonth) {
		return -1;
	} else {
		return 0;
	}
}