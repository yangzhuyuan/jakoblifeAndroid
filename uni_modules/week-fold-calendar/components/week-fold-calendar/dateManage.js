function padStart(n) {
	return n.toString().padStart(2, 0)
}

module.exports = {
	padStart,
	/**
	 * 时间戳转日期
	 * @param timestamp 日期、时间戳
	 * @param format 日期格式
	 * @returns 返回转换后日期格式
	 * */
	formattedDate(timestamp, format = 'yyyy-mm-dd') {
		const date = new Date(timestamp)
		const year = date.getFullYear()
		const month = padStart(date.getMonth() + 1)
		const day = padStart(date.getDate())

		switch (format){
		case 'yyyy-mm-dd':
			return `${year}-${month}-${day}`
		case 'yyyy/mm/dd':
			return `${year}/${month}/${day}`
		case 'yyyy年mm月dd日':
			return `${year}年${month}月${day}日`
		case 'yyyy-mm':
			return `${year}-${month}`
		case 'yyyy/mm':
			return `${year}/${month}`
		case 'yyyy年mm月':
			return `${year}年${month}月`
		default:
			return `${year}-${month}-${day}`
		}
	},

	/**
	 * 获取指定日期
	 * @param {String} targetDate 开始日期
	 * @param {number} day 几天，正数为往后的日期，负数为往前的日期
	 * @returns {number} 返回 day 后的日期
	 * */
	getAppointDate(targetDate, day) {
		const datetmp = new Date(targetDate.replace(/-/g, '/')).getTime()
		let result = new Date(datetmp + 24 * 60 * 60 * 1000 * day)
		return `${result.getFullYear()}-${padStart(result.getMonth() + 1)}-${padStart(result.getDate())}`
	},

	/**
	 * 获取当前时间
	 * @param format 日期格式
	 * @returns 返回当前日期
	 */
	currentDate(format = 'yyyy-mm-dd') {
		const date = new Date()
		const year = date.getFullYear()
		const month = padStart(date.getMonth() + 1)
		const day = padStart(date.getDate())
		if (format === 'yyyy-mm-dd') {
			return `${year}-${month}-${day}`
		}
		if (format === 'yyyy/mm/dd') {
			return `${year}/${month}/${day}`
		}
		return `${year}年${month}月${day}日`
	},

	/**
	 * 计算日期差
	 * @param startDate  开始日期 yyyy-MM-dd
	 * @param enDate  结束日期 yyyy-MM-dd
	 * @returns {number} 返回两日期相差的天数
	 */
	getDaysDifference(startDate, enDate) {
		const sDate = Date.parse(startDate.replace(/-/g, '/'))
		const eDate = Date.parse(enDate.replace(/-/g, '/'))

		const days = (sDate - eDate) / (24 * 60 * 60 * 1000)
		return days
	},

	/**
	 * 当前月份天数
	 */
	getMonthDays(nowMonth, nowYear) {
		let month_arr = [1, 3, 5, 7, 8, 10, 12]
		let days = 0
		if (nowMonth == 2) {
			if (nowYear % 4 == 0) {
				days = 29
			} else {
				days = 28
			}
		} else if (month_arr.indexOf(nowMonth) >= 0) {
			days = 31
		} else {
			days = 30
		}
		return days
	},

	/**
	 * 月份计算
	 */
	reduMonths(startMonth, endMonth) {

		let startY = startMonth.split('-')[0]
		let startM = startMonth.split('-')[1]
		let endY = endMonth.split('-')[0]
		let endM = endMonth.split('-')[1]
		startMonth = startY + startM
		endMonth = endY + endM
		if (startMonth > endMonth) {
			let reduY = startY - endY,
				reduM = startM - endM
			return reduY * 12 + reduM
		} else if (startMonth < endMonth) {

			return -1
		} else {
			return 0
		}
	},
}