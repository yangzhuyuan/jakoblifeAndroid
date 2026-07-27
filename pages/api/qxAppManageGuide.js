/** 与保活模块 keepAliveManager 厂商分类一致 */
export const QX_MANUFACTURER = {
	HUAWEI: 'HUAWEI',
	XIAOMI: 'XIAOMI',
	OPPO: 'OPPO',
	VIVO: 'VIVO',
	// SAMSUNG: 'SAMSUNG',
	OTHER: 'OTHER'
}

const MANUAL_GUIDE_KEYS = {
	[QX_MANUFACTURER.HUAWEI]: '定时测量手动指引华为',
	[QX_MANUFACTURER.XIAOMI]: '定时测量手动指引小米',
	[QX_MANUFACTURER.OPPO]: '定时测量手动指引OPPO',
	[QX_MANUFACTURER.VIVO]: '定时测量手动指引vivo',
	// [QX_MANUFACTURER.SAMSUNG]: '定时测量手动指引三星',
	[QX_MANUFACTURER.OTHER]: '定时测量手动指引通用'
}

const AFTER_JUMP_GUIDE_KEYS = {
	[QX_MANUFACTURER.HUAWEI]: '定时测量跳转指引华为',
	[QX_MANUFACTURER.XIAOMI]: '定时测量跳转指引小米',
	[QX_MANUFACTURER.OPPO]: '定时测量跳转指引OPPO',
	[QX_MANUFACTURER.VIVO]: '定时测量跳转指引vivo',
	// [QX_MANUFACTURER.SAMSUNG]: '定时测量跳转指引三星',
	[QX_MANUFACTURER.OTHER]: '定时测量跳转指引通用'
}

/**
 * 从系统信息识别厂商类型（与 keepAliveManager 白名单分支对齐）
 */
/** 是否为华为/荣耀机型（仅此类显示应用管理提示） */
export function isQxHuaweiHonorDevice() {
	try {
		const info = uni.getSystemInfoSync()
		if (info.platform !== 'android') return false
		const raw = String(info.deviceBrand || info.brand || info.model || '').toUpperCase()
		return raw.includes('HUAWEI') || raw.includes('HONOR')
	} catch (e) {
		return false
	}
}

/** 是否为三星机型（与 detect 中 SAMSUNG 分支一致，用于隐藏应用管理提示） */
export function isQxSamsungDevice() {
	try {
		const info = uni.getSystemInfoSync()
		const raw = String(info.deviceBrand || info.brand || info.model || '').toUpperCase()
		return raw.includes('SAMSUNG')
	} catch (e) {
		return false
	}
}

export function detectQxManufacturerType() {
	try {
		const info = uni.getSystemInfoSync()
		const raw = String(info.deviceBrand || info.brand || info.model || '').toUpperCase()
		if (raw.includes('HUAWEI') || raw.includes('HONOR')) return QX_MANUFACTURER.HUAWEI
		if (raw.includes('XIAOMI') || raw.includes('REDMI')) return QX_MANUFACTURER.XIAOMI
		if (raw.includes('OPPO') || raw.includes('REALME') || raw.includes('ONEPLUS')) return QX_MANUFACTURER.OPPO
		if (raw.includes('VIVO') || raw.includes('IQOO')) return QX_MANUFACTURER.VIVO
		// if (raw.includes('SAMSUNG')) return QX_MANUFACTURER.SAMSUNG
	} catch (e) {
		console.warn('[qxAppManageGuide] detect manufacturer failed', e)
	}
	return QX_MANUFACTURER.OTHER
}

export function getQxManualGuideI18nKey(manufacturerType) {
	return MANUAL_GUIDE_KEYS[manufacturerType] || MANUAL_GUIDE_KEYS[QX_MANUFACTURER.OTHER]
}

export function getQxAfterJumpGuideI18nKey(manufacturerType) {
	return AFTER_JUMP_GUIDE_KEYS[manufacturerType] || AFTER_JUMP_GUIDE_KEYS[QX_MANUFACTURER.OTHER]
}
