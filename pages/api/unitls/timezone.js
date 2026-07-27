export function formatGMTOffset(offsetMinutes) {
	const sign = offsetMinutes >= 0 ? '+' : '-';
	const absMinutes = Math.abs(offsetMinutes);
	const hoursStr = String(Math.floor(absMinutes / 60)).padStart(2, '0');
	const minutesStr = String(absMinutes % 60).padStart(2, '0');
	return `GMT${sign}${hoursStr}:${minutesStr}`;
}

/** 获取手机 GMT 偏移，如 GMT+08:00、GMT+05:30 */
export function getGMTTimezoneStrict() {
	// #ifdef APP-PLUS
	try {
		if (plus.os.name === 'Android') {
			const TimeZone = plus.android.importClass('java.util.TimeZone');
			const tz = TimeZone.getDefault();
			const offsetMs = tz.getRawOffset() + tz.getDSTSavings();
			return formatGMTOffset(Math.round(offsetMs / 60000));
		}
		if (plus.os.name === 'iOS') {
			const NSTimeZone = plus.ios.importClass('NSTimeZone');
			const localTz = NSTimeZone.localTimeZone();
			const secondsFromGMT = plus.ios.invoke(localTz, 'secondsFromGMT') || 0;
			plus.ios.deleteObject(localTz);
			return formatGMTOffset(Math.round(secondsFromGMT / 60));
		}
	} catch (e) {}
	// #endif
	return formatGMTOffset(-new Date().getTimezoneOffset());
}

/** 获取 IANA 时区 ID，如 Asia/Shanghai */
export function getDeviceTimeZone() {
	// #ifdef APP-PLUS
	try {
		if (plus.os.name === 'Android') {
			const TimeZone = plus.android.importClass('java.util.TimeZone');
			return TimeZone.getDefault().getID() || '';
		}
		if (plus.os.name === 'iOS') {
			const NSTimeZone = plus.ios.importClass('NSTimeZone');
			const localTz = NSTimeZone.localTimeZone();
			const timeZoneId = plus.ios.invoke(localTz, 'name') || '';
			plus.ios.deleteObject(localTz);
			return timeZoneId;
		}
	} catch (e) {}
	// #endif
	try {
		if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
			return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
		}
	} catch (e) {}
	return '';
}

/** 中国时区 UTC+8（无夏令时） */
const CHINA_OFFSET_MINUTES = 8 * 60

let cachedTimezoneSignature = ''
let timezoneWatchTimer = null
let timezoneWatchCallbacks = []

function pad2(value) {
	return String(value).padStart(2, '0')
}

/** 获取设备当前时区偏移（分钟，东为正），优先读原生 API，时区变更后可即时生效 */
export function getDeviceTimezoneOffsetMinutes(date = new Date()) {
	// #ifdef APP-PLUS
	try {
		if (plus.os.name === 'Android') {
			const TimeZone = plus.android.importClass('java.util.TimeZone')
			const tz = TimeZone.getDefault()
			return Math.round(tz.getOffset(date.getTime()) / 60000)
		}
		if (plus.os.name === 'iOS') {
			const NSTimeZone = plus.ios.importClass('NSTimeZone')
			const localTz = NSTimeZone.localTimeZone()
			const secondsFromGMT = plus.ios.invoke(localTz, 'secondsFromGMT') || 0
			plus.ios.deleteObject(localTz)
			return Math.round(secondsFromGMT / 60)
		}
	} catch (e) {}
	// #endif
	return -date.getTimezoneOffset()
}

/** 时区签名，用于检测系统时区是否变更 */
export function getTimezoneSignature() {
	return [
		getDeviceTimeZone(),
		getDeviceTimezoneOffsetMinutes(),
		getGMTTimezoneStrict()
	].join('|')
}

/** 同步并返回当前时区签名（首次或手动刷新） */
export function syncTimezoneSignature() {
	cachedTimezoneSignature = getTimezoneSignature()
	return cachedTimezoneSignature
}

/** 检测时区是否相对上次签名发生变化 */
export function checkTimezoneChanged() {
	const current = getTimezoneSignature()
	if (!cachedTimezoneSignature) {
		cachedTimezoneSignature = current
		return false
	}
	if (cachedTimezoneSignature === current) {
		return false
	}
	cachedTimezoneSignature = current
	return true
}

/**
 * 监听系统时区变更（App 前台运行期间）
 * @param {Function} callback 时区变更时回调
 * @param {number} intervalMs 轮询间隔，默认 30 秒
 */
export function startTimezoneWatch(callback, intervalMs = 30000) {
	if (typeof callback === 'function' && !timezoneWatchCallbacks.includes(callback)) {
		timezoneWatchCallbacks.push(callback)
	}
	if (timezoneWatchTimer) {
		return
	}
	syncTimezoneSignature()
	timezoneWatchTimer = setInterval(() => {
		if (!checkTimezoneChanged()) {
			return
		}
		const signature = getTimezoneSignature()
		timezoneWatchCallbacks.slice().forEach((cb) => {
			try {
				cb(signature)
			} catch (e) {
				console.warn('[timezone] watch callback', e)
			}
		})
	}, intervalMs)
}

export function stopTimezoneWatch(callback) {
	if (typeof callback === 'function') {
		timezoneWatchCallbacks = timezoneWatchCallbacks.filter((cb) => cb !== callback)
	} else {
		timezoneWatchCallbacks = []
	}
	if (timezoneWatchCallbacks.length > 0) {
		return
	}
	if (timezoneWatchTimer) {
		clearInterval(timezoneWatchTimer)
		timezoneWatchTimer = null
	}
}

/**
 * 解析指定时刻在中国时区（Asia/Shanghai / UTC+8）下的年月日时分秒
 * 对绝对时间戳（如服务端 updateTime 毫秒）直接按 UTC+8 取日历日
 * 不依赖 Intl，兼容旧版 Android WebView
 */
export function getChinaDateParts(date = new Date()) {
	// 与 getLocalTimeAllJSON 相同算法：绝对时间 + 固定东八区偏移，再用 UTC getter 读分量
	const china = new Date(date.getTime() + CHINA_OFFSET_MINUTES * 60000)
	return {
		year: String(china.getUTCFullYear()),
		month: pad2(china.getUTCMonth() + 1),
		day: pad2(china.getUTCDate()),
		hours: pad2(china.getUTCHours()),
		minutes: pad2(china.getUTCMinutes()),
		seconds: pad2(china.getUTCSeconds())
	}
}

/** 中国时区日期，如 2026/07/07 */
export function getChinaDateString(date = new Date()) {
	const {
		year,
		month,
		day
	} = getChinaDateParts(date)
	return `${year}/${month}/${day}`
}

/**
 * 设备本地时区常用时间格式（与 Main.vue getTimeAllJSON 结构一致）
 * 通过原生时区 API 计算，系统改时区后无需重启 App 即可生效
 */
export function getLocalTimeAllJSON(date = new Date()) {
	const offsetMinutes = getDeviceTimezoneOffsetMinutes(date)
	const shifted = new Date(date.getTime() + offsetMinutes * 60000)
	const year = String(shifted.getUTCFullYear())
	const month = pad2(shifted.getUTCMonth() + 1)
	const day = pad2(shifted.getUTCDate())
	const hours = pad2(shifted.getUTCHours())
	const minutes = pad2(shifted.getUTCMinutes())
	const seconds = pad2(shifted.getUTCSeconds())

	return {
		YMDHMS: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
		YMD: `${year}-${month}-${day}`,
		MD: `${month}/${day}`,
		YMD000000: `${year}-${month}-${day} 00:00:00`,
		YMDHMSWIFI: `${year}${month}${day}${hours}${minutes}${seconds}`
	}
}

/**
 * 将绝对时间戳转为「手机本地墙钟按 UTC+8 编码」的秒级时间戳。
 * 国内服务端按东八区展示 time 字段；非东八区手机若直接上传绝对时间戳，
 * 会显示成中国时区的另一天/另一时刻。东八区手机上该转换是恒等的。
 */
export function toChinaEncodedLocalTimestamp(absoluteTsSeconds) {
	const ts = Number(absoluteTsSeconds)
	if (!Number.isFinite(ts) || ts <= 0) {
		return 0
	}
	const local = getLocalTimeAllJSON(new Date(ts * 1000))
	const ms = new Date(local.YMDHMS.replace(' ', 'T') + '+08:00').getTime()
	if (Number.isNaN(ms)) {
		return 0
	}
	return Math.floor(ms / 1000)
}

/**
 * 中国时区常用时间格式（与 Main.vue getTimeAllJSON 结构一致）
 */
export function getChinaTimeAllJSON(date = new Date()) {
	const {
		year,
		month,
		day,
		hours,
		minutes,
		seconds
	} = getChinaDateParts(date)

	return {
		YMDHMS: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
		YMD: `${year}-${month}-${day}`,
		MD: `${month}/${day}`,
		YMD000000: `${year}-${month}-${day} 00:00:00`,
		chinaDate: `${year}/${month}/${day}`
	}
}

/**
 * 日历日 +1（按 YYYY-MM-DD，不走本地时区）
 */
function addOneCalendarDay(ymd) {
	const parts = String(ymd).split('-').map((n) => parseInt(n, 10))
	if (parts.length < 3 || parts.some((n) => !Number.isFinite(n))) {
		return ymd
	}
	const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
	dt.setUTCDate(dt.getUTCDate() + 1)
	return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`
}

/** 当前设备是否为中国时区（东八区 / Asia/Shanghai 等） */
export function isChinaTimezone(date = new Date()) {
	const id = String(getDeviceTimeZone() || '').toLowerCase()
	if (
		id === 'asia/shanghai' ||
		id === 'asia/chongqing' ||
		id === 'asia/harbin' ||
		id === 'asia/urumqi' ||
		id === 'prc'
	) {
		return true
	}
	return getDeviceTimezoneOffsetMinutes(date) === CHINA_OFFSET_MINUTES
}

/**
 * 信息补充页「报告日期」跳转参数：
 * 选 D → 中国已过「D+1 日 01:00」则传 D+1，否则仍传 D
 * 例（中国）：选 22 号，中国已过 23 号 01:00 → 传 23；选 25 号，未过 26 号 01:00 → 传 25。
 * 例（其他时区）：洛杉矶选 21 号，中国已过 22 号 01:00 → 传 22；未过 → 传 21。
 * @param {string} localDateYmd 界面所选本地日期 YYYY-MM-DD
 * @param {Date} [now]
 * @returns {string} YYYY-MM-DD
 */
export function resolveChinaReportDateFromLocal(localDateYmd, now = new Date()) {
	const localToday = getLocalTimeAllJSON(now).YMD
	const selected = String(localDateYmd || '').trim().slice(0, 10)
	const dateYmd = /^\d{4}-\d{2}-\d{2}$/.test(selected) ? selected : localToday
	const nextDay = addOneCalendarDay(dateYmd)
	// 中国时区（UTC+8）下「次日 01:00:00」的绝对时刻
	const thresholdMs = new Date(`${nextDay}T01:00:00+08:00`).getTime()
	if (!Number.isFinite(thresholdMs)) {
		return dateYmd
	}
	if (now.getTime() >= thresholdMs) {
		return nextDay
	}
	return dateYmd
}
