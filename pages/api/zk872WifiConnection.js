const ZK872_NAME = /^(?:ZK-?B?872B?|JAKOBLIFE872B?)(?:$|[ _-])/i
const WIFI_SERVICE = '0000FFFF-0000-1000-8000-00805F9B34FB'

export function isZk872WifiModel(modelId, modelName) {
	return String(modelId) === '10005' || ZK872_NAME.test(String(modelName || '').trim())
}

// 只负责准备 Wi-Fi 配网所需的 BLE 连接，不发送 AT、不绑定或解绑设备。
export function createZk872WifiConnector({
	api, deviceId = '', allowNameFallback = false, usePassedDeviceId = false, onAttempt = () => {}, onLog = () => {}
}) {
	const targetDeviceId = String(deviceId || '').trim()
	const normalizeDeviceId = id => {
		const value = String(id || '').trim().toUpperCase()
		const mac = value.replace(/[:-]/g, '')
		return /^[0-9A-F]{12}$/.test(mac) ? mac : value
	}
	let cancelled = false
	let handedOff = false
	let pendingCancel = null
	let stopScanListener = null
	let activeDeviceId = ''
	const error = (code, message) => Object.assign(new Error(message), { code })
	const cancelError = () => error('CANCELLED', 'ZK872 connection cancelled')
	const closeConnection = (id) => {
		if (id) api.closeBLEConnection({ deviceId: id, complete: () => {} })
	}

	function call(method, options = {}, timeout = 6000) {
		if (cancelled) return Promise.reject(cancelError())
		return new Promise((resolve, reject) => {
			let settled = false
			const finish = (err, result) => {
				if (settled) return
				settled = true
				clearTimeout(timer)
				if (pendingCancel === abort) pendingCancel = null
				if (err) reject(err)
				else resolve(result || {})
			}
			const abort = () => finish(cancelError())
			const timer = setTimeout(() => finish(error('TIMEOUT', method + ' timeout')), timeout)
			pendingCancel = abort
			try {
				api[method]({
					...options,
					success: (result) => {
						// 页面已退出时，迟到的原生成功回调不能留下扫描或连接。
						if (cancelled) {
							if (method === 'createBLEConnection' && !handedOff) closeConnection(options.deviceId)
							if (method === 'startBluetoothDevicesDiscovery') api.stopBluetoothDevicesDiscovery({})
							return
						}
						finish(null, result)
					},
					fail: (err) => finish(err || error('BLE_FAILED', method + ' failed'))
				})
			} catch (err) {
				finish(err)
			}
		})
	}

	function wait(ms) {
		if (cancelled) return Promise.reject(cancelError())
		return new Promise((resolve, reject) => {
			const abort = () => {
				clearTimeout(timer)
				pendingCancel = null
				reject(cancelError())
			}
			const timer = setTimeout(() => {
				pendingCancel = null
				resolve()
			}, ms)
			pendingCancel = abort
		})
	}

	async function scanDevice() {
		const candidates = new Map()
		let exactDevice = null
		let listening = true
		onLog('开始扫描配网设备，目标地址', targetDeviceId || '(未提供)')
		const handler = (res) => {
			if (!listening || cancelled) return
			for (const device of (res && res.devices) || []) {
				if (!device.deviceId) continue
				const id = normalizeDeviceId(device.deviceId)
				const matchesAddress = targetDeviceId && id === normalizeDeviceId(targetDeviceId)
				const matchesName = [device.name, device.localName].some(name => ZK872_NAME.test(String(name || '').trim()))
				if (matchesAddress || matchesName) {
					if (!candidates.has(id)) onLog('扫描发现配网设备', {
						deviceId: device.deviceId, name: device.name, localName: device.localName,
						matchesAddress: !!matchesAddress
					})
					candidates.set(id, device)
				}
				if (matchesAddress) exactDevice = device
			}
		}
		stopScanListener = () => {
			listening = false
			if (typeof api.offBluetoothDeviceFound === 'function') api.offBluetoothDeviceFound(handler)
			stopScanListener = null
		}
		try {
			api.onBluetoothDeviceFound(handler)
			await call('startBluetoothDevicesDiscovery', { allowDuplicatesKey: true })
			// 收集一轮广播，避免只连接最先上报的同型号设备。
			await wait(8000)
		} finally {
			if (stopScanListener) stopScanListener()
			if (!cancelled) {
				await call('stopBluetoothDevicesDiscovery', {}, 2000).catch(err => onLog('停止扫描', err))
			}
		}
		if (cancelled) throw cancelError()
		// 地址优先；首次绑定的接口地址可能并非广播地址，仅允许回退到唯一的同型号设备。
		// 管理页重新配网必须仍然匹配选中设备的地址。
		if (exactDevice) {
			onLog('扫描找到配网设备', exactDevice.deviceId)
			return exactDevice
		}
		if (targetDeviceId && !allowNameFallback) throw error('NOT_FOUND', 'ZK872 target address not found')
		if (candidates.size > 1) throw error('MULTIPLE_DEVICES', 'Multiple ZK872 devices found')
		if (!candidates.size) throw error('NOT_FOUND', 'ZK872 not found')
		const device = Array.from(candidates.values())[0]
		if (targetDeviceId) onLog('首次绑定地址未匹配，使用唯一同型号广播设备', device.deviceId)
		onLog('扫描找到配网设备', device.deviceId)
		return device
	}

	async function prepareDevice(device) {
		activeDeviceId = device.deviceId
		try {
			await call('createBLEConnection', { deviceId: activeDeviceId, timeout: 10000 }, 12000)
		} catch (err) {
			const code = Number(err.errCode != null ? err.errCode : err.code)
			if (code !== 10010 && !(code === -1 && /already/i.test(err.errMsg || ''))) throw err
		}
		await wait(2000)
		const platform = api.getSystemInfoSync().platform
		if (platform === 'android' && typeof api.setBLEMTU === 'function') {
			try {
				await call('setBLEMTU', { deviceId: activeDeviceId, mtu: 512 }, 3000)
			} catch (err) {
				if (cancelled) throw err
				onLog('MTU设置未完成，继续获取服务', err)
			}
		}
		const { services = [] } = await call('getBLEDeviceServices', { deviceId: activeDeviceId })
		const service = services.find(item => [WIFI_SERVICE, 'FFFF'].includes(String(item.uuid).toUpperCase()))
		if (!service) throw error('NO_WIFI_SERVICE', 'Wi-Fi BLE service not found')
		const { characteristics = [] } = await call('getBLEDeviceCharacteristics', {
			deviceId: activeDeviceId, serviceId: service.uuid
		})
		let writeChar, notifyChar
		for (const characteristic of characteristics) {
			const props = characteristic.properties || {}
			if (props.write || props.writeNoResponse) writeChar = characteristic
			if (props.notify || props.indicate) notifyChar = characteristic
		}
		if (!writeChar || !notifyChar) throw error('NO_WIFI_CHARACTERISTICS', 'Wi-Fi BLE characteristics not found')
		return {
			deviceId: activeDeviceId,
			name: device.name || device.localName || 'ZK-B872B',
			serviceId: service.uuid,
			uuid: writeChar.uuid,
			notifyuuid: notifyChar.uuid,
			writeTypeHint: platform === 'android' || !writeChar.properties.write ? 'writeNoResponse' : 'write'
		}
	}

	function cancel() {
		cancelled = true
		if (pendingCancel) pendingCancel()
		if (stopScanListener) {
			stopScanListener()
			api.stopBluetoothDevicesDiscovery({})
		}
		if (!handedOff && activeDeviceId) {
			closeConnection(activeDeviceId)
			activeDeviceId = ''
		}
	}

	return {
		cancel,
		keepConnection() { handedOff = true },
		async connect() {
			let lastError
			let needsDiscovery = !usePassedDeviceId || !targetDeviceId
			for (let attempt = 1; attempt <= 2; attempt++) {
				if (cancelled) throw cancelError()
				onAttempt(attempt)
				try {
					await call('openBluetoothAdapter')
					// 首次绑定先扫描；设备管理入口可复用上页传入的已绑定设备标识。
					if (!needsDiscovery) onLog('使用设备管理页传入的蓝牙标识连接', targetDeviceId)
					const device = needsDiscovery ? await scanDevice() : { deviceId: targetDeviceId }
					return await prepareDevice(device)
				} catch (err) {
					if (cancelled) throw cancelError()
					lastError = err
					onLog('连接失败，第' + attempt + '次', err)
					if (!needsDiscovery && Number(err.errCode != null ? err.errCode : err.code) === 10002) {
						needsDiscovery = true
						if (attempt < 2) onLog('直连未发现设备，重试前扫描目标地址', targetDeviceId)
					}
					if (activeDeviceId) {
						await call('closeBLEConnection', { deviceId: activeDeviceId }, 2000).catch(() => {})
						activeDeviceId = ''
					}
					if (attempt < 2) await wait(1000)
				}
			}
			cancel()
			throw lastError
		}
	}
}
