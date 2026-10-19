// 仅用于后台保活资格判断；不要用 MAC、在线状态或设备型号判断是否已绑定。
export const DEVICE_BINDING_STATE_CHANGED = 'DEVICE_BINDING_STATE_CHANGED'
const STORAGE_KEY = 'app_bound_device_state'
let revision = 0

function currentScope() {
	const token = uni.getStorageSync('token')
	if (!token) return ''
	// 缓存按登录凭据及环境隔离，不额外保存原始 token。
	const value = String(uni.getStorageSync('URL_APP_IP') || '') + '|' + token
	let hash = 2166136261
	for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
	return (hash >>> 0).toString(16)
}

export function getDeviceBindingContext() {
	return { scope: currentScope(), revision }
}

export function hasAnyBoundDevice() {
	const scope = currentScope()
	const state = uni.getStorageSync(STORAGE_KEY)
	return !!(scope && state && state.scope === scope && state.hasDevices === true)
}

function saveState(hasDevices) {
	const scope = currentScope()
	if (!scope) return
	const previous = uni.getStorageSync(STORAGE_KEY)
	uni.setStorageSync(STORAGE_KEY, { scope, hasDevices })
	if (!previous || previous.scope !== scope || previous.hasDevices !== hasDevices) {
		uni.$emit(DEVICE_BINDING_STATE_CHANGED, hasDevices)
	}
}

// 失败/非列表响应不覆盖缓存；绑定、解绑或切换账号之前发出的旧请求不能覆盖新状态。
export function recordBoundDevices(rows, context = getDeviceBindingContext()) {
	if (!Array.isArray(rows) || context.scope !== currentScope() || context.revision !== revision) return
	saveState(rows.length > 0)
}

export function markDeviceBound() {
	revision++
	saveState(true)
}

export function recordDeviceUnbound(deviceSn, rows, context = getDeviceBindingContext()) {
	if (!deviceSn || !Array.isArray(rows) || context.scope !== currentScope()) return
	revision++
	saveState(rows.some(item => String(item.deviceSn) !== String(deviceSn)))
}

// APP_LOGOUT 在清空 storage 前发出，先通知现有后台任务停止。
uni.$on('APP_LOGOUT', () => {
	revision++
	uni.removeStorageSync(STORAGE_KEY)
	uni.$emit(DEVICE_BINDING_STATE_CHANGED, false)
})
