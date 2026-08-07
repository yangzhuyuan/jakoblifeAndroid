/**
 * 中国区 / 美区 API 根地址（与 main.js 中 Vue.prototype.$APP_IP1 / $APP_IP2 一致）。
 * 切换测试 / 正式环境时只改本文件，并调用 refreshActiveAppBaseUrl 同步到全局。
 */
// 测试域名
export const APP_IP_CN = 'https://jakoblife-qa.jakob-techs.com'
// 正式域名（启用时与上面二选一，并注释掉测试行）
// export const APP_IP_CN = 'https://jakoblife.jakob-techs.com'

// export const APP_IP_US = 'https://jakoblife.us.jakob-techs.com'

export const APP_IP_US = APP_IP_CN

export const URL_APP_IP_STORAGE_KEY = 'URL_APP_IP'
/** 登录后记录的区域：cn | us，改域名后仍按区域映射到最新 APP_IP_CN / APP_IP_US */
export const URL_APP_REGION_STORAGE_KEY = 'URL_APP_REGION'

function isUsHost(url) {
	if (!url || typeof url !== 'string') return false
	return url.includes('.us.jakob') || url.includes('jakoblife.us.')
}

/** 将 appBaseHosts 最新值写入 Vue.prototype.$APP_IP1 / $APP_IP2 */
export function syncVueAppHosts(Vue) {
	if (!Vue || !Vue.prototype) return
	Vue.prototype.$APP_IP1 = APP_IP_CN
	Vue.prototype.$APP_IP2 = APP_IP_US
}

function resolveRegionFromStorage() {
	const region = uni.getStorageSync(URL_APP_REGION_STORAGE_KEY)
	if (region === 'us' || region === 'cn') return region
	const stored = uni.getStorageSync(URL_APP_IP_STORAGE_KEY)
	if (!stored) return 'cn'
	if (stored === APP_IP_US || isUsHost(stored)) return 'us'
	return 'cn'
}

function urlForRegion(region) {
	return region === 'us' ? APP_IP_US : APP_IP_CN
}

/**
 * 登录/切换区域时调用，写入区域并同步当前配置下的根地址
 */
export function setActiveAppRegion(region, Vue) {
	syncVueAppHosts(Vue)
	const r = region === 'us' ? 'us' : 'cn'
	const url = urlForRegion(r)
	uni.setStorageSync(URL_APP_REGION_STORAGE_KEY, r)
	uni.setStorageSync(URL_APP_IP_STORAGE_KEY, url)
	if (Vue && Vue.prototype) {
		Vue.prototype.$url_APP_IP = url
	}
	return url
}

/**
 * 按已选区域刷新为 appBaseHosts 中最新的 CN/US 地址（改域名后即时生效）
 */
export function refreshActiveAppBaseUrl(Vue) {
	syncVueAppHosts(Vue)
	const region = resolveRegionFromStorage()
	const active = urlForRegion(region)
	uni.setStorageSync(URL_APP_REGION_STORAGE_KEY, region)
	uni.setStorageSync(URL_APP_IP_STORAGE_KEY, active)
	if (Vue && Vue.prototype) {
		Vue.prototype.$url_APP_IP = active
	}
	return active
}

export function getActiveAppBaseUrl(Vue) {
	return refreshActiveAppBaseUrl(Vue)
}