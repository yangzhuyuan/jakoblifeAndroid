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
 * 报告就绪日（中国日历 YYYY-MM-DD）——国内原逻辑
 * 永远按中国时间；当天凌晨 1 点前报告尚未就绪，用前一天
 */
export function resolveChinaReportReadyYmd(now = new Date()) {
	const chinaNow = getChinaTimeAllJSON(now)
	const chinaHour = Number(chinaNow.YMDHMS.slice(11, 13))
	if (chinaHour < 1) {
		return getChinaTimeAllJSON(new Date(now.getTime() - 24 * 60 * 60 * 1000)).YMD
	}
	return chinaNow.YMD
}

/** 国内监测报告于 07:00 切换日期；24 小时为 06:00–06:00，7 天保留 08:00–21:05。 */
export function resolveChinaMonitorReportRange(days = 1, now = new Date()) {
	// 同为 UTC+8 的其他国家保持原规则；固定 GMT/UTC 或无地区 ID 时沿用偏移判断。
	const zone = String(getDeviceTimeZone() || '').toLowerCase()
	const chinaZones = ['asia/shanghai', 'asia/chongqing', 'asia/chungking', 'asia/harbin', 'asia/urumqi', 'prc']
	if (zone && !chinaZones.includes(zone) && !/^(etc\/)?(gmt|utc)/.test(zone)) return null
	if (!isChinaTimezone(now)) return null
	const chinaNow = getChinaTimeAllJSON(now)
	const profYmd = Number(chinaNow.YMDHMS.slice(11, 13)) < 7 ?
		shiftCalendarDay(chinaNow.YMD, -1) : chinaNow.YMD
	// 监测截止日为报告日期的前一天；接口仍使用报告日期，避免再回退一天。
	const endYmd = shiftCalendarDay(profYmd, -1)
	const isWeek = days === 7
	return {
		startTime: `${shiftCalendarDay(endYmd, isWeek ? -6 : -1)} ${isWeek ? '08:00:00' : '06:00:00'}`,
		endTime: `${endYmd} ${isWeek ? '21:05:00' : '06:00:00'}`,
		profYmd
	}
}

/**
 * 日历日加减（按 YYYY-MM-DD，不走本地时区）
 * @param {string} ymd
 * @param {number} deltaDays
 * @returns {string}
 */
export function shiftCalendarDay(ymd, deltaDays) {
	const parts = String(ymd).split('-').map((n) => parseInt(n, 10))
	if (parts.length < 3 || parts.some((n) => !Number.isFinite(n))) {
		return ymd
	}
	const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
	dt.setUTCDate(dt.getUTCDate() + Number(deltaDays || 0))
	return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`
}

export function isChinaEarlyMorningHour(now = new Date()) {
	return Number(getChinaTimeAllJSON(now).YMDHMS.slice(11, 13)) < 1
}

/**
 * 国外 24 小时监测结束日（手机本地日历 YYYY-MM-DD）
 * 未过「本地次日」的中国 01:00 → 本地昨天
 *   例：手机 6 号、尚未过中国 7 号 01:00 → 结束日 5 号（监测时间/列表 4–5，接口仍传 6）
 * 已过 → 本地今天（监测时间/列表 5–6）
 * 24 小时 / 7 天监测显示用；无感勿走此函数
 */
export function resolveAbroadHour24EndYmd(now = new Date()) {
	const localYmd = getLocalTimeAllJSON(now).YMD
	const nextLocalYmd = shiftCalendarDay(localYmd, 1)
	const thresholdMs = new Date(`${nextLocalYmd}T01:00:00+08:00`).getTime()
	if (!Number.isFinite(thresholdMs) || now.getTime() >= thresholdMs) {
		return localYmd
	}
	return shiftCalendarDay(localYmd, -1)
}

/**
 * 国外监测结束日（手机本地日历 YYYY-MM-DD）——7 天/无感
 * 仅中国 00:00–00:59（且中国日历已比本地晚一天）额外往前一天；过了 01:00 恢复本地今天
 */
export function resolveAbroadMonitorEndYmd(now = new Date()) {
	const localYmd = getLocalTimeAllJSON(now).YMD
	const chinaNow = getChinaTimeAllJSON(now)
	if (chinaNow.YMD > localYmd && isChinaEarlyMorningHour(now)) {
		return shiftCalendarDay(localYmd, -1)
	}
	return localYmd
}

/** 国外且处于中国 00:00–00:59：无数据时可把 profDate 回退一天 */
export function canFallbackAbroadProfDate(now = new Date()) {
	return !isChinaTimezone(now) && isChinaEarlyMorningHour(now)
}

export function hasRetVarListPayload(res) {
	if (!res || Number(res.code) !== 200 || !res.data) {
		return false
	}
	const raw = res.data.retVarList
	return raw != null && String(raw).trim() !== ''
}

/**
 * 监测/无感接口 profDate：
 * 国内、国外都按中国就绪日——本地 5 号且中国已过 6 号 01:00 传 6 号；
 * 中国 6 号 00:00–00:59（未过凌晨 1 点）传 5 号
 */
export function resolveReportProfYmd(now = new Date()) {
	return resolveChinaReportReadyYmd(now)
}

/**
 * 信息补充页「报告日期」跳转参数：
 * 国内选 D → 已过「D+1 日 07:00」则传 D+1，否则仍传 D；选今天时使用最新就绪报告日。
 * 国外仍按中国「D+1 日 01:00」换算，未到时传 D。
 * 例（其他时区）：洛杉矶选 21 号，中国已过 22 号 01:00 → 传 22；未过 → 传 21。
 * @param {string} localDateYmd 界面所选本地日期 YYYY-MM-DD
 * @param {Date} [now]
 * @returns {string} YYYY-MM-DD
 */
export function resolveChinaReportDateFromLocal(localDateYmd, now = new Date()) {
	const localToday = getLocalTimeAllJSON(now).YMD
	const selected = String(localDateYmd || '').trim().slice(0, 10)
	const dateYmd = /^\d{4}-\d{2}-\d{2}$/.test(selected) ? selected : localToday
	const chinaRange = resolveChinaMonitorReportRange(1, now)
	if (chinaRange && dateYmd === localToday) return chinaRange.profYmd
	const nextDay = addOneCalendarDay(dateYmd)
	// 国内 07:00、国外保持中国 01:00 的报告就绪门槛。
	const thresholdMs = new Date(`${nextDay}T${chinaRange ? '07' : '01'}:00:00+08:00`).getTime()
	if (!Number.isFinite(thresholdMs)) {
		return dateYmd
	}
	if (now.getTime() >= thresholdMs) {
		return nextDay
	}
	return dateYmd
}
