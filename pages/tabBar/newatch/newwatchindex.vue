<template>
	<view class="page">
		<view class="row" v-show="showListView">
			<button class="button" size="mini" @click="startScan()">开始扫描</button>
		</view>
		<view class="row">
			<text>日志</text>
		</view>
		<view class="row" v-show="!showListView && message">
			<text class="log-text">{{ message }}</text>
		</view>
		<view class="row" v-show="showListView">
			<text>设备列表</text>
			<text>({{deviceList.length}})</text>
		</view>
		<scroll-view class="border list" scroll-y v-show="showListView">
			<view v-for="(item, index) in deviceList" :key="item.identifier || item.macAddress || index"
				class="list-item" @click="toConnect(item.identifier)">
				<view class="row list-item-row">
					<view class="column">
						<text class="text">{{item.name}}</text>
						<text class="text">{{item.macAddress}}</text>
					</view>
					<text class="text">{{item.rssiValue}}</text>
				</view>
			</view>
		</scroll-view>
		<scroll-view class="border list" scroll-y v-show="!showListView">
			<view v-for="(item, index) in deviceInfoList" :key="index" class="list-item"
				@click="deviceInfoItemClick(index)">
				<text class="text">{{item.text}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		requireYcBle
	} from './util/ycBleAliases.js'

	const DEVICE_MENU = [{
			text: '1.DisConnect Device'
		},
		{
			text: '2.Health data'
		},
		{
			text: '3.Query'
		},
		{
			text: '4.Setting'
		},
		{
			text: '5.App Controller'
		},
		{
			text: '6.Device Controller'
		},
		{
			text: '7.ECG'
		},
		{
			text: '8.OtaDeviceWidget'
		},
		{
			text: '9.Collection data'
		},
		{
			text: '10.Watch face'
		},
		{
			text: '11.Log'
		}
	]

	const HEALTH_QUERIES = [{
			type: 0,
			label: '步数,距离，卡路里'
		},
		{
			type: 1,
			label: '睡眠'
		},
		{
			type: 2,
			label: '心率'
		},
		{
			type: 3,
			label: '血压'
		},
		{
			type: 4,
			label: '组合数据(血氧/体温等)'
		},
		{
			type: 5,
			label: '有创综合(血脂尿酸)'
		},
		{
			type: 6,
			label: '运动数据'
		},
		{
			type: 7,
			label: '压力/最大摄氧量'
		}
	]

	/** 连接后开启的实时上传类型 DeviceRealTimeDataType */
	const REALTIME_UPLOAD_TYPES = [{
			type: 0,
			name: 'step'
		},
		{
			type: 1,
			name: 'heartRate'
		},
		{
			type: 2,
			name: 'bloodOxygen'
		},
		{
			type: 3,
			name: 'bloodPressure'
		},
		{
			type: 4,
			name: 'hrv'
		},
		{
			type: 5,
			name: 'respirationRate'
		},
		{
			type: 6,
			name: 'sportMode'
		},
		{
			type: 7,
			name: 'combinedData'
		}
	]

	/**
	 * Real_Upload* -> 展示名 + 对应历史 query 类型
	 * 睡眠一般无实时流，靠测量结束/连接后历史拉取
	 */
	const REAL_UPLOAD_META = {
		1536: {
			label: '步数/运动',
			query: [0],
			toastKey: 'step'
		},
		1537: {
			label: '心率',
			query: [2],
			toastKey: 'heartValue'
		},
		1538: {
			label: '血氧',
			query: [4],
			toastKey: 'bloodOxygenValue'
		},
		1539: {
			label: '血压',
			query: [3],
			toastKey: 'bloodSBP'
		},
		1541: {
			label: 'ECG波形',
			query: null,
			toastKey: null
		},
		1542: {
			label: '运动跑步',
			query: [6],
			toastKey: null
		},
		1543: {
			label: '呼吸率',
			query: [4],
			toastKey: null
		},
		1546: {
			label: '综合数据',
			query: [4],
			toastKey: null
		},
		1550: {
			label: '充气血压过程',
			query: [3],
			toastKey: 'pressureValue'
		},
		1552: {
			label: '身体指数',
			query: [7],
			toastKey: null
		}
	}

	const MENU_ROUTES = {
		1: '/pages/tabBar/newatch/health_data/health_data',
		2: '/pages/tabBar/newatch/query/query',
		3: '/pages/tabBar/newatch/setting/setting',
		4: '/pages/tabBar/newatch/appController/appController',
		5: '/pages/tabBar/newatch/deviceController/deviceController',
		6: '/pages/tabBar/newatch/ecg/ecg',
		7: '/pages/tabBar/newatch/ota/ota',
		8: '/pages/tabBar/newatch/collection_data/collection_data',
		9: '/pages/tabBar/newatch/watch_face/watch_face',
		10: '/pages/tabBar/newatch/log/log'
	}

	const ANDROID_LOCATION_PERMISSIONS = [
		'android.permission.ACCESS_FINE_LOCATION',
		'android.permission.ACCESS_FINE_LOCATION'
	]
	const ANDROID_BLE_PERMISSIONS = [
		'android.permission.BLUETOOTH',
		'android.permission.BLUETOOTH_SCAN',
		'android.permission.BLUETOOTH_CONNECT'
	]

	/** 手表一键测量 healthDataType -> query；兼容「测量枚举」与 HealthDataType 两套编号 */
	const MEASURE_TYPE_TO_QUERY = {
		0: [2, 0], // 测量枚举心率 / HealthDataType.step
		1: [3, 1], // 测量枚举血压 / HealthDataType.sleep
		2: [2, 4], // HealthDataType.heartRate / 测量枚举血氧 —— 两种都拉
		3: [3], // HealthDataType.bloodPressure
		4: [4], // combined / 血氧体温
		5: [5, 7],
		6: [1, 6], // sleep / sport
		7: [7, 0],
		8: [6],
		9: [5]
	}

	/** Constants.DATATYPE */
	const DATA_TYPE_DEVICE_SPORT_STATE = 1036
	const DATA_TYPE_DEVICE_SWITCH_DIAL = 1037
	const DATA_TYPE_DEVICE_MEASUREMENT_RESULT = 1038
	const DATA_TYPE_INFLATED_BLOOD_RESULT = 1040
	const DATA_TYPE_MEASURE_STATUS_AND_RESULTS = 1043

	let systemInfo
	let ble
	let identifier = ''
	let androidPushRegistered = false
	let androidBleStateRegistered = false
	let androidPushReady = false
	let globalEventBound = false
	let globalEvent = null
	let connectReadyTimer = null
	let rwOkRetryTimer = null
	let healthQueryTimer = null
	let pendingQueryTypes = []
	let lastStepToastAt = 0
	/** 是否已在 ReadWriteOK(10) 下重试过心率/血氧实时上传 */
	let realUploadRetriedOnRwOk = false
	/** type -> 最近一条记录指纹，推送触发拉取后用于去重提示 */
	let historyFingerprint = {}
	/** Constants.BLEState（YCBTClient.connectState） */
	const BLE_STATE = {
		Disconnect: 3,
		Disconnecting: 4,
		Connecting: 5,
		Connected: 6,
		CharacteristicNotification: 9,
		ReadWriteOK: 10
	}
	/** 插件 BluetoothState：仅 connectState==10 时才映射为 connected=2 */
	const PLUGIN_BLE_STATE = {
		off: 0,
		on: 1,
		connected: 2,
		connectFailed: 3,
		disconnected: 4
	}

	export default {
		data() {
			return {
				deviceList: [],
				deviceInfoList: DEVICE_MENU,
				showListView: true,
				message: '',
				blutoothStatus: 0
			}
		},
		onShow() {
			this.initMethods()
			if (!androidPushReady) {
				this.showListView = true
			}
		},
		methods: {
			isValidScanDevice(item) {
				const mac = String(item.macAddress || item.deviceIdentifier || '').trim()
				return !!mac
			},
			isAndroid() {
				return systemInfo == 'android'
			},
			isAndroidOrIOS() {
				const type = uni.getSystemInfoSync().platform
				if (type === 'android') {
					systemInfo = 'android'
				} else if (type === 'ios') {
					systemInfo = 'ios'
				} else {
					systemInfo = 'other'
				}
			},
			initMethods() {
				this.isAndroidOrIOS()
				ble = requireYcBle()
				console.log('bluetooth-ycSdkPlugin插件调用initPluginchu开始初始化：', ble)
				ble.initPlugin((res) => {
					console.log('initPlugin', res.message)
					// init 后再反射，YCBTClient 更容易加载到
					// this.printNativeConstructors()
				})
				console.log('initPlugin初始化结束 end')
				this.bindGlobalBleEvent()
			},
			/** 把原生类方法打印成和 uni 插件对象类似的 JSON */
			dumpJavaClassMethods(className) {
				if (!this.isAndroid() || typeof plus === 'undefined' || !plus.android) {
					return null
				}
				try {
					const ReflectArray = plus.android.importClass('java.lang.reflect.Array')
					const Modifier = plus.android.importClass('java.lang.reflect.Modifier')
					let klass = null
					try {
						const loader = plus.android.runtimeMainActivity().getClassLoader()
						klass = plus.android.invoke(loader, 'loadClass', className)
					} catch (e1) {
						console.warn('[dump] loadClass 失败', className, e1)
					}
					if (!klass) {
						const JavaClass = plus.android.importClass('java.lang.Class')
						klass = plus.android.invoke(JavaClass, 'forName', className)
					}
					if (!klass) {
						// importClass 后再取 .class
						const Imported = plus.android.importClass(className)
						if (Imported) {
							klass = plus.android.invoke(Imported, 'getClass')
							if (!klass && Imported.class) {
								klass = Imported.class
							}
						}
					}
					if (!klass) {
						throw new Error('Class 为 null: ' + className)
					}
					const methods = plus.android.invoke(klass, 'getDeclaredMethods')
					const len = ReflectArray.getLength(methods)
					const map = {}
					for (let i = 0; i < len; i++) {
						const m = ReflectArray.get(methods, i)
						const name = String(plus.android.invoke(m, 'getName'))
						const mods = Number(plus.android.invoke(m, 'getModifiers'))
						const isStatic = !!Modifier.isStatic(mods)
						const params = plus.android.invoke(m, 'getParameterTypes')
						const pLen = ReflectArray.getLength(params)
						const paramNames = []
						for (let j = 0; j < pLen; j++) {
							const p = ReflectArray.get(params, j)
							paramNames.push(String(plus.android.invoke(p, 'getSimpleName')))
						}
						const key = name + '(' + paramNames.join(',') + ')' + (isStatic ? ' [static]' : '')
						map[key] = 'function() { [native code] }'
					}
					const ctors = plus.android.invoke(klass, 'getDeclaredConstructors')
					const cLen = ReflectArray.getLength(ctors)
					for (let i = 0; i < cLen; i++) {
						const c = ReflectArray.get(ctors, i)
						const params = plus.android.invoke(c, 'getParameterTypes')
						const pLen = ReflectArray.getLength(params)
						const paramNames = []
						for (let j = 0; j < pLen; j++) {
							const p = ReflectArray.get(params, j)
							paramNames.push(String(plus.android.invoke(p, 'getSimpleName')))
						}
						map['<init>(' + paramNames.join(',') + ')'] = 'function() { [native code] }'
					}
					return map
				} catch (e) {
					console.warn('[dump] 读取失败 ' + className, e)
					return null
				}
			},
			/** 把 uni.requireNativePlugin 对象打印成方法名 map */
			dumpJsPluginMethods(pluginObj) {
				if (!pluginObj || typeof pluginObj !== 'object') return null
				const map = {}
				Object.keys(pluginObj).forEach((key) => {
					const v = pluginObj[key]
					map[key] = typeof v === 'function' ? 'function() { [native code] }' : v
				})
				return map
			},
			printNativeConstructors() {
				if (ble) {
					console.log('[ctor/methods] bluetooth-ycSdkPlugin(JS)=', this.dumpJsPluginMethods(ble))
				}
				const names = [
					'com.android.bluetooth.ycSdkPlugin.BluetoothPlugin',
					'com.yucheng.ycbtsdk.YCBTClient'
				]
				names.forEach((name) => {
					const map = this.dumpJavaClassMethods(name)
					console.log('[ctor/methods] ' + name + '=', map)
					// if (map) {
					// 	console.log('[ctor/methods] ' + name + ' JSON=' + JSON.stringify(map, null, 2))
					// }
				})
			},
			parsePluginBleState(res) {
				if (res == null) return NaN
				if (typeof res === 'number' || typeof res === 'string') return Number(res)
				if (res.bluetoothStateChange != null) return Number(res.bluetoothStateChange)
				if (res.data != null && typeof res.data !== 'object') return Number(res.data)
				if (res.data && res.data.bluetoothStateChange != null) {
					return Number(res.data.bluetoothStateChange)
				}
				return NaN
			},
			bindGlobalBleEvent() {
				console.log('[globalEvent] bindGlobalBleEvent 进入, bound=', globalEventBound)
				if (globalEventBound) {
					console.log('[globalEvent] 已绑定过，跳过重复监听')
					return
				}
				try {
					globalEvent = uni.requireNativePlugin('globalEvent')
					console.log('globalEvent', globalEvent)
				} catch (e) {
					console.warn('[globalEvent] 加载失败', e)
					return
				}
				if (!globalEvent || typeof globalEvent.addEventListener !== 'function') {
					console.warn('[globalEvent] addEventListener 不可用', globalEvent)
					return
				}
				const onState = (eventName, res) => {
					console.log('蓝牙状态[' + eventName + ']' + JSON.stringify(res))
					const state = this.parsePluginBleState(res)
					this.blutoothStatus = state
					this.appendLog('[globalEvent] ' + eventName + ' ' + JSON.stringify(res))
					if (state === PLUGIN_BLE_STATE.connected) {
						this.onPluginBleConnected()
					}
				}
				const eventNames = [
					'bluetoothStateChange',
					'bleStateChangeEvent',
					'bloodPressureEvent',
					'bloodOxygenEvent',
					'deviceMeasurementResult'
				]
				eventNames.forEach((eventName) => {
					try {
						globalEvent.addEventListener(eventName, (res) => onState(eventName, res))
						console.log('[globalEvent] 已监听', eventName)
					} catch (e) {
						console.warn('[globalEvent] 监听失败', eventName, e)
					}
				})
				globalEventBound = false
				console.log('[globalEvent] 绑定完成, 共', eventNames.length, '个事件')
			},
			onPluginBleConnected() {
				uni.hideLoading()
				this.showListView = false
				this.appendLog('[globalEvent] 设备已连接，拉取健康数据')
				this.scheduleHealthQuery([2, 3, 4, 6, 7], 800)
				if (this.isAndroid()) {
					this.waitForAndroidBleReady()
				}
			},
			isJavaProxy(obj) {
				return !!(obj && typeof obj === 'object' && (obj.__TYPE__ === 'JSBObject' ||
					obj.className === 'java.util.HashMap' ||
					(typeof obj.className === 'string' && obj.className.indexOf('java.') === 0)))
			},
			javaByteArrayToJs(value) {
				const ReflectArray = plus.android.importClass('java.lang.reflect.Array')
				const len = ReflectArray.getLength(value)
				const bytes = []
				for (let i = 0; i < len; i++) {
					bytes.push(ReflectArray.getByte(value, i) & 0xff)
				}
				return bytes
			},
			/** fastjson 会把 byte[] 编成 base64 字符串 */
			decodeDatasBytes(datas) {
				if (datas == null) return []
				if (Array.isArray(datas)) {
					return datas.map((n) => Number(n) & 0xff)
				}
				if (typeof datas === 'string') {
					try {
						const Base64 = plus.android.importClass('android.util.Base64')
						const arr = Base64.decode(datas, 0)
						return this.javaByteArrayToJs(arr)
					} catch (e) {
						console.warn('[push] base64 datas 解码失败', e)
						return []
					}
				}
				try {
					const clsName = String(
						plus.android.invoke(plus.android.invoke(datas, 'getClass'), 'getName') || ''
					)
					if (clsName === '[B') {
						return this.javaByteArrayToJs(datas)
					}
				} catch (e2) {}
				return []
			},
			javaValueToJs(value, depth) {
				if (value == null || depth > 4) return value
				const t = typeof value
				if (t === 'string' || t === 'number' || t === 'boolean') return value
				if (!this.isJavaProxy(value) && t === 'object' && !value.getClass) {
					if (Array.isArray(value)) {
						return value.map((v) => this.javaValueToJs(v, depth + 1))
					}
					return value
				}
				try {
					const clsName = String(
						plus.android.invoke(plus.android.invoke(value, 'getClass'), 'getName') || ''
					)
					if (clsName === '[B') {
						return this.javaByteArrayToJs(value)
					}
					if (clsName.indexOf('HashMap') >= 0 || clsName.indexOf('Map') >= 0) {
						return this.javaMapToObject(value, depth + 1)
					}
					if (clsName.indexOf('Integer') >= 0 || clsName.indexOf('Long') >= 0 ||
						clsName.indexOf('Short') >= 0 || clsName.indexOf('Byte') >= 0 ||
						clsName.indexOf('Double') >= 0 || clsName.indexOf('Float') >= 0) {
						return Number(plus.android.invoke(value, 'doubleValue'))
					}
					if (clsName.indexOf('Boolean') >= 0) {
						return !!plus.android.invoke(value, 'booleanValue')
					}
					if (clsName === 'java.lang.String') {
						return String(value)
					}
				} catch (e) {}
				try {
					return String(plus.android.invoke(value, 'toString'))
				} catch (e2) {
					return value
				}
			},
			/**
			 * uni-app plus.android 回调里的 HashMap 是 JSBObject 代理，不能 JSON.stringify。
			 * 优先 keySet（保留 byte[]），fastjson 作兜底。
			 */
			javaMapToObject(map, depth) {
				if (!map) return null
				if (depth == null) depth = 0
				if (!this.isJavaProxy(map) && typeof map === 'object' && map.dataType !== undefined) {
					return map
				}
				try {
					plus.android.importClass(map)
					const result = {}
					const keySet = plus.android.invoke(map, 'keySet')
					const iterator = plus.android.invoke(keySet, 'iterator')
					while (plus.android.invoke(iterator, 'hasNext')) {
						const key = String(plus.android.invoke(iterator, 'next'))
						const raw = plus.android.invoke(map, 'get', key)
						result[key] = this.javaValueToJs(raw, depth + 1)
					}
					if (Object.keys(result).length) return result
				} catch (e2) {
					console.warn('[push] keySet map 失败', e2)
				}
				try {
					const Fastjson = plus.android.importClass('com.alibaba.fastjson.JSON')
					const jsonStr = Fastjson.toJSONString(map)
					if (jsonStr && typeof jsonStr === 'string' && jsonStr.charAt(0) === '{') {
						const parsed = JSON.parse(jsonStr)
						if (typeof parsed.datas === 'string') {
							parsed.datas = this.decodeDatasBytes(parsed.datas)
						}
						return parsed
					}
				} catch (e) {
					console.warn('[push] fastjson map 失败', e)
				}
				const knownKeys = ['dataType', 'data', 'datas', 'sportState', 'sportType',
					'heartValue', 'heartRate', 'bloodSBP', 'bloodDBP', 'OOValue',
					'bloodOxygenValue', 'bloodOxygen', 'step', 'sportStep', 'calories',
					'sportCalorie', 'distance', 'sportDistance', 'systolicBloodPressure',
					'diastolicBloodPressure', 'pressureValue', 'signalValue',
					'deviceSportStateChange', 'deviceHealthDataMeasureStateChange'
				]
				const fallback = {}
				knownKeys.forEach((k) => {
					try {
						const v = plus.android.invoke(map, 'get', k)
						if (v != null) fallback[k] = this.javaValueToJs(v, depth + 1)
					} catch (e3) {}
				})
				return fallback
			},
			mapGetNumber(map, key) {
				if (!map) return undefined
				try {
					let v
					if (this.isJavaProxy(map) || (map.get && typeof map.get === 'function')) {
						v = plus.android.invoke(map, 'get', key)
					} else {
						v = map[key]
					}
					if (v == null) return undefined
					if (typeof v === 'number') return v
					try {
						return Number(plus.android.invoke(v, 'intValue'))
					} catch (e) {
						return Number(v)
					}
				} catch (e2) {
					return undefined
				}
			},
			appendLog() {
				const parts = []
				for (let i = 0; i < arguments.length; i++) {
					const t = arguments[i]
					parts.push(typeof t === 'string' ? t : JSON.stringify(t))
				}
				const line = parts.join(' ')
				console.log(line)
				setTimeout(() => {
					this.message = line
				}, 0)
			},
			getNativeConnectState() {
				try {
					const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
					return Number(YCBTClient.connectState())
				} catch (e) {
					return -1
				}
			},
			isAndroidBleReady(state) {
				return Number(state) === BLE_STATE.ReadWriteOK
			},
			isAndroidGattConnected(state) {
				const s = Number(state)
				return s >= BLE_STATE.Connected && s <= BLE_STATE.ReadWriteOK
			},
			clearConnectReadyTimer() {
				if (connectReadyTimer) {
					clearTimeout(connectReadyTimer)
					connectReadyTimer = null
				}
			},
			clearRwOkRetryTimer() {
				if (rwOkRetryTimer) {
					clearTimeout(rwOkRetryTimer)
					rwOkRetryTimer = null
				}
			},
			registerAndroidBleStateChange() {
				if (!this.isAndroid() || androidBleStateRegistered) return
				if (typeof plus === 'undefined' || !plus.android) return
				try {
					const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
					const self = this
					const cb = plus.android.implements(
						'com.yucheng.ycbtsdk.response.BleConnectResponse', {
							onConnectResponse: function(code) {
								const st = Number(code)
								console.log('[ble] registerBleStateChange=', st)
								if (st === BLE_STATE.ReadWriteOK) {
									self.onAndroidBleReady(st)
									return
								}
								if (!androidPushReady && self.isAndroidGattConnected(st)) {
									// 先到 6/9 不立刻初始化推送，继续等 10
									console.log('[ble] 已连接但未 ReadWriteOK，继续等待 state=', st)
								}
							}
						}
					)
					YCBTClient.registerBleStateChange(cb)
					androidBleStateRegistered = true
					console.log('[ble] registerBleStateChange 已注册')
				} catch (e) {
					console.warn('[ble] registerBleStateChange failed', e)
				}
			},
			waitForAndroidBleReady() {
				this.clearConnectReadyTimer()
				this.clearRwOkRetryTimer()
				realUploadRetriedOnRwOk = false
				this.registerAndroidBleStateChange()
				let tries = 0
				const maxWaitTries = 60 // 最多约 30s 等 ReadWriteOK(10)
				const tick = () => {
					const st = this.getNativeConnectState()
					console.log('[ble] poll connectState=', st)
					if (this.isAndroidBleReady(st)) {
						this.onAndroidBleReady(st)
						return
					}
					tries++
					if (tries > maxWaitTries) {
						if (this.isAndroidGattConnected(st)) {
							this.appendLog('[ble] 等待 ReadWriteOK(10) 超时，当前 state=' + st + '，先初始化并稍后重试')
							this.onAndroidBleReady(st)
							return
						}
						this.appendLog('[ble] 等待 GATT 就绪超时，state=' + st)
						uni.hideLoading()
						return
					}
					connectReadyTimer = setTimeout(tick, 500)
				}
				tick()
			},
			/** 未到 10 就初始化后，继续盯到 10 再重开心率/血氧实时上传 */
			watchForReadWriteOk() {
				this.clearRwOkRetryTimer()
				let tries = 0
				const tick = () => {
					const st = this.getNativeConnectState()
					console.log('[ble] watch ReadWriteOK poll=', st)
					if (st === BLE_STATE.ReadWriteOK) {
						this.retryHeartOxygenRealUpload('poll-to-10')
						return
					}
					tries++
					if (tries > 60) {
						this.appendLog('[ble] 后续仍未到 ReadWriteOK(10)，心率/血氧实时可能不可用')
						// 再强制开一次，部分机型停在 9 也能通
						this.retryHeartOxygenRealUpload('timeout-retry-at-' + st)
						return
					}
					rwOkRetryTimer = setTimeout(tick, 500)
				}
				tick()
			},
			retryHeartOxygenRealUpload(reason) {
				const st = this.getNativeConnectState()
				// 已在 10 成功重试过则跳过重复调用（到 10 的那次除外）
				if (realUploadRetriedOnRwOk && reason !== 'state-change-to-10' && reason !== 'poll-to-10') {
					return
				}
				console.log('[push] retry HR/SpO2 real upload, reason=', reason, 'state=', st)
				this.appendLog('[push] 重试心率/血氧实时上传 state=' + st + ' reason=' + reason)
				try {
					this.registerAndroidRealDataCallback()
					this.enableHeartRealUpload()
					this.enableBloodOxygenRealUpload()
					if (st === BLE_STATE.ReadWriteOK) {
						realUploadRetriedOnRwOk = true
						this.clearRwOkRetryTimer()
					}
				} catch (e) {
					console.warn('[push] retryHeartOxygenRealUpload failed', e)
				}
			},
			onAndroidBleReady(state) {
				const st = Number(state)
				if (androidPushReady) {
					// 先前在 9 初始化过，现在到了 10：补开心率/血氧实时通道
					if (st === BLE_STATE.ReadWriteOK) {
						this.retryHeartOxygenRealUpload('state-change-to-10')
					}
					return
				}
				androidPushReady = true
				this.clearConnectReadyTimer()
				uni.hideLoading()
				this.appendLog('[ble] GATT 已就绪 state=' + st)
				// 先注册实时回调并打开心率/血氧上传，再延迟配对，避免 createBond 打断实时通道
				this.setupAndroidDevicePush()
				if (st !== BLE_STATE.ReadWriteOK) {
					this.watchForReadWriteOk()
				} else {
					realUploadRetriedOnRwOk = true
				}
				setTimeout(() => {
					this.tryCreateBondAfterConnect()
				}, 5000)
			},
			queryHealthByTypes(types, opt) {
				if (!ble || typeof ble.queryDeviceHealthData !== 'function') return
				const options = opt || {}
				const uniq = Array.from(new Set([].concat(...types.map((t) => Array.isArray(t) ? t : [t]))
					.filter((t) => t !== undefined && t !== null)))
				uniq.forEach((type) => {
					const label = (HEALTH_QUERIES.find((q) => q.type === type) || {}).label || ('type=' + type)
					ble.queryDeviceHealthData(type, (queryRes) => {
						this.appendLog('[自动拉取]' + label + ' ：')
						this.appendLog('[自动拉取数据] ' + JSON.stringify(queryRes && queryRes.data))
						this.detectHistoryChange(type, queryRes && queryRes.data, {
							silent: !!options.silent,
							forceToast: !!options.forceToast
						})
					})
				})
			},
			latestHistoryItem(data) {
				if (data == null) return null
				const list = Array.isArray(data) ? data : (data.list || data.data || null)
				if (!Array.isArray(list) || !list.length) {
					if (typeof data === 'object' && !Array.isArray(data)) return data
					return null
				}
				return list.slice().sort((a, b) => {
					const ta = Number(a.startTimeStamp || a.heartStartTime || a.startTime || a.time || 0)
					const tb = Number(b.startTimeStamp || b.heartStartTime || b.startTime || b.time || 0)
					return tb - ta
				})[0]
			},
			historyItemFingerprint(type, item) {
				if (!item) return ''
				const time = item.startTimeStamp || item.heartStartTime || item.startTime || item.time || ''
				if (type === 2) {
					return time + '|' + (item.heartRate != null ? item.heartRate : item.heartValue)
				}
				if (type === 4) {
					return time + '|' + item.bloodOxygen + '|' + item.temperature + '|' + item.respirationRate
				}
				if (type === 0) {
					return time + '|' + item.step + '|' + item.distance + '|' + item.calories
				}
				if (type === 1) {
					return time + '|' + (item.deepSleepSeconds || item.sleepLen || '')
				}
				if (type === 6) {
					return time + '|' + item.sportType + '|' + item.step
				}
				return time + '|' + JSON.stringify(item).slice(0, 120)
			},
			formatHistoryToast(type, item) {
				if (!item) return ''
				if (type === 2) {
					const hr = item.heartRate != null ? item.heartRate : item.heartValue
					return '新心率 ' + hr
				}
				if (type === 4) {
					if (item.bloodOxygen) return '新血氧 ' + item.bloodOxygen
					if (item.temperature) return '新体温 ' + item.temperature
					return '新组合数据'
				}
				if (type === 0) return '新步数 ' + item.step
				if (type === 1) return '新睡眠数据'
				if (type === 6) return '新运动数据'
				if (type === 7) return '新身体指数'
				return '新健康数据'
			},
			detectHistoryChange(type, data, opt) {
				const options = opt || {}
				const item = this.latestHistoryItem(data)
				const fp = this.historyItemFingerprint(type, item)
				const prev = historyFingerprint[type]
				if (!fp) return
				if (!prev) {
					historyFingerprint[type] = fp
					if (!options.forceToast) return
				}
				if (fp === prev && !options.forceToast) return
				historyFingerprint[type] = fp
				const label = (HEALTH_QUERIES.find((q) => q.type === type) || {}).label || type
				this.appendLog('[发现新数据]' + label + ' ' + JSON.stringify(item))
				if (!options.silent) {
					uni.showToast({
						title: this.formatHistoryToast(type, item).slice(0, 24),
						duration: 2000
					})
				}
			},
			/**
			 * 手表测完心率/血氧通常不像血压有 1040 结果包，而是：
			 * 1) 可能推 Real_Upload 1537/1538（onRealDataResponse）
			 * 2) 或只发测量结束 1038/1043，数值写入历史
			 * 这里在设备事件触发后按次数补拉，体验接近血压主动上报（不是常驻定时器）
			 */
			fetchHeartOxygenAfterMeasure(measureType) {
				const t = Number(measureType)
				let types = [2, 4]
				if (t === 0 || t === 2) types = [2, 4]
				if (t === 1 || t === 3) types = [3, 2]
				// 测量枚举：血氧常为 2 或 4
				if (t === 4) types = [4, 2]
				this.appendLog('[测量结束] 主动补拉心率/血氧 type=' + t)
				this.retryHeartOxygenRealUpload('measure-end');
				[800, 2000, 4000].forEach((delay) => {
					setTimeout(() => {
						this.queryHealthByTypes(types, {
							forceToast: true
						})
					}, delay)
				})
			},
			enableDeviceHealthMonitor() {
				if (!ble) return
				if (typeof ble.setDeviceHealthMonitoringMode === 'function') {
					ble.setDeviceHealthMonitoringMode([1, 1], (res) => {
						console.log('[monitor] healthMonitoring=', res)
					})
				}
				try {
					const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
					const cb = plus.android.implements(
						'com.yucheng.ycbtsdk.response.BleDataResponse', {
							onDataResponse: function(c) {
								console.log('[monitor] bloodOxygenMode=', c)
							}
						}
					)
					YCBTClient.settingBloodOxygenModeMonitor(true, 1, cb)
				} catch (e) {
					console.warn('[monitor] bloodOxygenMode failed', e)
				}
			},
			scheduleHealthQuery(types, delayMs) {
				pendingQueryTypes = pendingQueryTypes.concat([].concat(...(types || []).map((t) => Array.isArray(t) ?
					t : [t])))
				if (healthQueryTimer) clearTimeout(healthQueryTimer)
				healthQueryTimer = setTimeout(() => {
					const list = pendingQueryTypes.slice()
					pendingQueryTypes = []
					healthQueryTimer = null
					this.queryHealthByTypes(list)
				}, delayMs == null ? 800 : delayMs)
			},
			syncAllHealthHistory() {
				this.appendLog('[同步] 拉取全部健康历史')
				this.queryHealthByTypes(HEALTH_QUERIES.map((q) => q.type))
			},
			summarizeRealData(dataType, obj) {
				const meta = REAL_UPLOAD_META[dataType] || {
					label: '实时' + dataType
				}
				if (!obj || typeof obj !== 'object') return meta.label
				if (dataType === 1536) {
					const step = obj.step != null ? obj.step : obj.sportStep
					const dist = obj.distance != null ? obj.distance : obj.sportDistance
					const cal = obj.calories != null ? obj.calories : obj.sportCalorie
					return '步数=' + step + ' 距离=' + dist + ' 卡路里=' + cal
				}
				if (dataType === 1537) {
					return '心率=' + (obj.heartValue != null ? obj.heartValue : obj.heartRate)
				}
				if (dataType === 1538) {
					return '血氧=' + (obj.bloodOxygenValue != null ? obj.bloodOxygenValue : obj.OOValue)
				}
				if (dataType === 1539) {
					return '血压=' + obj.bloodSBP + '/' + obj.bloodDBP + ' 心率=' + obj.heartValue
				}
				if (dataType === 1550) {
					return '充气压=' + obj.pressureValue + ' 信号=' + obj.signalValue
				}
				if (dataType === 1541) {
					let len = 0
					try {
						const d = typeof obj.data === 'string' ? JSON.parse(obj.data) : obj.data
						len = Array.isArray(d) ? d.length : 0
					} catch (e) {}
					return 'ECG波形 samples=' + len
				}
				if (meta.toastKey && obj[meta.toastKey] != null) {
					return meta.label + '=' + obj[meta.toastKey]
				}
				return meta.label + ' ' + JSON.stringify(obj)
			},
			onDeviceMeasureResult(healthDataType, state, bytes) {
				const t = Number(healthDataType)
				const s = Number(state)
				this.appendLog('[测量状态] type=' + t + ' state=' + s + ' bytes=' + JSON.stringify(bytes || []))
				const pickHr = () => {
					if (!bytes || !bytes.length) return null
					const candidates = bytes.length >= 3 ? [bytes[2], bytes[0], bytes[1]] : bytes
					for (let i = 0; i < candidates.length; i++) {
						const v = candidates[i] & 0xff
						if (v >= 30 && v <= 220) return v
					}
					return null
				}
				const pickSpo2 = () => {
					if (!bytes || bytes.length < 3) return null
					const v = bytes[2] & 0xff
					if (v >= 70 && v <= 100) return v
					return null
				}
				const maybeHr = pickHr()
				const maybeSpo2 = pickSpo2()
				if (maybeHr != null && s !== 1 && (t === 0 || t === 2 || bytes.length <= 2)) {
					this.appendLog('[测量心率值] ' + maybeHr)
					uni.showToast({
						title: '心率 ' + maybeHr,
						duration: 2000
					})
				}
				if (maybeSpo2 != null && s !== 1 && (t === 2 || t === 4)) {
					this.appendLog('[测量血氧值] ' + maybeSpo2)
					uni.showToast({
						title: '血氧 ' + maybeSpo2,
						duration: 2000
					})
				}
				// state=1 多为开始：打开心率/血氧实时通道，数据走 onRealDataResponse
				if (s === 1) {
					this.enableHeartRealUpload()
					this.enableBloodOxygenRealUpload()
					return
				}
				// 结束：像血压一样尽快把结果显示出来（实时包或历史补拉）
				this.fetchHeartOxygenAfterMeasure(t)
			},
			enableHeartRealUpload() {
				this.enableRealUploadType(1, 'heartRate')
				if (!this.isAndroid()) return
				try {
					const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
					const logCb = (name) => plus.android.implements(
						'com.yucheng.ycbtsdk.response.BleDataResponse', {
							onDataResponse: function(code, ratio, map) {
								console.log('[push] ' + name + '=', code, ratio)
							}
						}
					)
					YCBTClient.settingHeartMonitor(1, 1, logCb('settingHeartMonitor'))
					YCBTClient.appRealAllDataFromDevice(1, 1, logCb('appRealAllDataFromDevice'))
				} catch (e) {
					console.warn('[push] enableHeartRealUpload failed', e)
				}
			},
			enableBloodOxygenRealUpload() {
				this.enableRealUploadType(2, 'bloodOxygen')
				if (!this.isAndroid()) return
				try {
					const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
					const logCb = plus.android.implements(
						'com.yucheng.ycbtsdk.response.BleDataResponse', {
							onDataResponse: function(code, ratio, map) {
								console.log('[push] bloodOxygenModeMonitor=', code, ratio)
							}
						}
					)
					YCBTClient.settingBloodOxygenModeMonitor(true, 1, logCb)
				} catch (e) {
					console.warn('[push] enableBloodOxygenRealUpload failed', e)
				}
			},
			/** 打开指定实时上传类型；数据走 appRegisterRealDataCallBack.onRealDataResponse */
			enableRealUploadType(type, name) {
				if (!this.isAndroid()) return
				try {
					if (ble && typeof ble.realTimeDataUpload === 'function') {
						ble.realTimeDataUpload([true, type], (res) => {
							console.log('[push] realTimeDataUpload ' + name + '=', res)
						})
					}
					const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
					const bleDataCb = plus.android.implements(
						'com.yucheng.ycbtsdk.response.BleDataResponse', {
							onDataResponse: function(code, ratio, map) {
								console.log('[push] appRealDataFromDevice ' + name + '=', code, ratio)
							}
						}
					)
					YCBTClient.appRealDataFromDevice(1, type, bleDataCb)
				} catch (e) {
					console.warn('[push] enableRealUploadType failed', name, e)
				}
			},
			parseInflatedBloodResult(bytes) {
				if (!bytes || bytes.length < 4) return null
				return {
					status: bytes[0] & 0xff,
					systolicBloodPressure: bytes[1] & 0xff,
					diastolicBloodPressure: bytes[2] & 0xff,
					heartRate: bytes[3] & 0xff,
					raw: bytes
				}
			},
			onInflatedBloodMeasureResult(obj, dataMap) {
				const bytes = this.decodeDatasBytes(obj.datas != null ? obj.datas :
					(this.isJavaProxy(dataMap) ? plus.android.invoke(dataMap, 'get', 'datas') : null))
				const parsed = this.parseInflatedBloodResult(bytes)
				this.appendLog('[充气血压结果] ' + JSON.stringify(parsed || {
					bytes
				}))
				if (parsed && (parsed.systolicBloodPressure > 0 || parsed.diastolicBloodPressure > 0)) {
					uni.showToast({
						title: parsed.systolicBloodPressure + '/' + parsed.diastolicBloodPressure,
						duration: 2000
					})
				}
				this.scheduleHealthQuery([3, 2], 500)
			},
			onSportStateChange(obj) {
				const stateInfo = obj.deviceSportStateChange || obj
				const state = stateInfo.state != null ? stateInfo.state : stateInfo.sportState
				const sportType = stateInfo.sportType
				this.appendLog('[运动状态] state=' + state + ' sportType=' + sportType)
				if (Number(state) === 0) {
					this.scheduleHealthQuery([6, 0], 800)
				}
			},
			/**
			 * 1043 DeviceMeasurStatusAndResults：部分表把心率/血氧结果放这里
			 * 常见：[healthType, state, value...] 或 [state, value]
			 */
			onMeasureStatusAndResults(bytes) {
				this.appendLog('[测量状态结果1043] ' + JSON.stringify(bytes))
				if (!bytes || !bytes.length) {
					this.scheduleHealthQuery([0, 1, 2, 3, 4, 6, 7], 800)
					return
				}
				let healthType = bytes[0] & 0xff
				let state = bytes.length > 1 ? (bytes[1] & 0xff) : 0
				let value = bytes.length > 2 ? (bytes[2] & 0xff) : null
				// 若首字节像心率值（而不是类型），兼容 [hr] / [hr, ...]
				if (bytes.length <= 2 && healthType >= 30 && healthType <= 220) {
					value = healthType
					healthType = 2
					state = 0
				}
				if (value != null && value >= 30 && value <= 220 && (healthType === 0 || healthType === 2)) {
					this.appendLog('[1043心率] ' + value)
					uni.showToast({
						title: '心率 ' + value,
						duration: 2000
					})
				}
				if (value != null && value >= 70 && value <= 100 && (healthType === 2 || healthType === 4)) {
					this.appendLog('[1043血氧] ' + value)
					uni.showToast({
						title: '血氧 ' + value,
						duration: 2000
					})
				}
				if (Number(state) === 1) {
					this.enableHeartRealUpload()
					this.enableBloodOxygenRealUpload()
					return
				}
				this.fetchHeartOxygenAfterMeasure(healthType)
			},
			onAndroidRealData(dataType, dataMap) {
				const n = Number(dataType)
				const obj = this.javaMapToObject(dataMap) || {}
				console.log('[onRealDataResponse] dataType=', n, 'raw=', obj)
				const summary = this.summarizeRealData(n, obj)
				this.appendLog('[实时上报] ', summary)

				// 心率 Real_UploadHeart=1537 / 血氧 Real_UploadBloodOxygen=1538
				if (n === 1537) {
					const hr = obj.heartValue != null ? obj.heartValue : obj.heartRate
					this.appendLog('[实时心率] ' + hr)
					if (hr != null && Number(hr) > 0) {
						uni.showToast({
							title: '心率 ' + hr,
							duration: 1500
						})
					}
					this.scheduleHealthQuery([2], 600)
					return
				}
				if (n === 1538) {
					const spo2 = obj.bloodOxygenValue != null ? obj.bloodOxygenValue : (obj.OOValue != null ? obj.OOValue :
						obj.bloodOxygen)
					this.appendLog('[实时血氧] ' + spo2)
					if (spo2 != null && Number(spo2) > 0) {
						uni.showToast({
							title: '血氧 ' + spo2,
							duration: 1500
						})
					}
					this.scheduleHealthQuery([4], 600)
					return
				}

				// ECG 实时波形（测量中高频推送，不弹 toast）
				if (n === 1541) {
					try {
						uni.$emit('yc-ecg-realtime', obj)
					} catch (e) {}
					return
				}

				const meta = REAL_UPLOAD_META[n]
				if (!meta) return

				if (n === 1536) {
					const now = Date.now()
					if (now - lastStepToastAt > 5000) {
						lastStepToastAt = now
						uni.showToast({
							title: String(summary).slice(0, 20),
							duration: 1000
						})
						this.scheduleHealthQuery(meta.query, 3000)
					}
					return
				}
				if (n === 1550) return

				uni.showToast({
					title: String(summary).slice(0, 24),
					duration: 1500
				})
				this.scheduleHealthQuery(meta.query, 600)
			},
			registerAndroidRealDataCallback() {
				if (!this.isAndroid() || typeof plus === 'undefined' || !plus.android) return
				const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
				const self = this
				console.log("回调onRealDataResponse")
				const realDataCb = plus.android.implements(
					'com.yucheng.ycbtsdk.response.BleRealDataResponse', {
						onRealDataResponse: function(dataType, map) {
							console.log('[onRealDataResponse] 回调 dataType=', dataType)
							self.onAndroidRealData(dataType, map)
						}
					}
				)
				YCBTClient.appRegisterRealDataCallBack(realDataCb)
				console.log('[push] appRegisterRealDataCallBack 已注册 (心率1537/血氧1538)')
			},
			onAndroidDeviceToApp(code, dataMap) {
				if (Number(code) !== 0) {
					console.log('[deviceToApp] ignore code=', code)
					return
				}
				const type = this.mapGetNumber(dataMap, 'dataType')
				const obj = this.javaMapToObject(dataMap) || {}
				const dataType = type != null ? type : Number(obj.dataType)
				this.appendLog('[deviceToApp] dataType=' + dataType + ' ' + JSON.stringify(obj))

				if (dataType === DATA_TYPE_DEVICE_SWITCH_DIAL) {
					return
				}
				if (dataType === DATA_TYPE_DEVICE_SPORT_STATE) {
					this.onSportStateChange(obj)
					return
				}
				if (dataType === DATA_TYPE_INFLATED_BLOOD_RESULT) {
					this.onInflatedBloodMeasureResult(obj, dataMap)
					return
				}
				if (dataType === DATA_TYPE_MEASURE_STATUS_AND_RESULTS) {
					this.onMeasureStatusAndResults(this.decodeDatasBytes(obj.datas))
					return
				}
				if (dataType !== DATA_TYPE_DEVICE_MEASUREMENT_RESULT) {
					return
				}
				const bytes = this.decodeDatasBytes(obj.datas)
				let healthDataType = bytes[0]
				let state = bytes[1]
				if (healthDataType === undefined && obj.data != null) {
					healthDataType = Number(obj.data)
				}
				this.onDeviceMeasureResult(healthDataType, state, bytes)
			},
			setupAndroidDevicePush() {
				if (!this.isAndroid()) return
				if (typeof plus === 'undefined' || !plus.android) {
					console.warn('[push] plus.android 不可用')
					return
				}
				try {
					const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
					console.log('[push] setupAndroidDevicePush connectState=', this.getNativeConnectState())
					const self = this
					if (!androidPushRegistered) {
						const deviceToAppCb = plus.android.implements(
							'com.yucheng.ycbtsdk.response.BleDeviceToAppDataResponse', {
								onDataResponse: function(code, map) {
									console.log('[deviceToApp] code=', code)
									self.onAndroidDeviceToApp(code, map)
								}
							}
						)
						YCBTClient.deviceToApp(deviceToAppCb)
						// 心率/血氧：必须接 appRegisterRealDataCallBack -> onRealDataResponse
						this.registerAndroidRealDataCallback()
						androidPushRegistered = true
						console.log('[push] deviceToApp + RealData 已注册')
					} else {
						// 部分机型回调会被覆盖，连接就绪后重新挂一次
						this.registerAndroidRealDataCallback()
					}
					this.enableHeartRealUpload()
					this.enableBloodOxygenRealUpload()
					REALTIME_UPLOAD_TYPES.forEach(({
						type,
						name
					}) => {
						if (type === 1 || type === 2) return
						this.enableRealUploadType(type, name)
					})

					this.enableDeviceHealthMonitor()
					setTimeout(() => {
						historyFingerprint = {}
						this.syncAllHealthHistory()
					}, 1500)
				} catch (e) {
					console.error('[push] 注册失败', e)
				}
			},
			fillDeviceList(list, {
				sortByRssi = false
			} = {}) {
				const devices = Array.from(list || [])
				if (sortByRssi) {
					devices.sort((a, b) => parseInt(b.rssiValue) - parseInt(a.rssiValue))
				}
				const nextList = []
				devices.forEach((item) => {
					const mac = String(item.macAddress || item.deviceIdentifier || '').trim()
					item.macAddress = mac
					item.name = String(item.name || '').trim()
					if (this.isAndroid()) {
						item.identifier = mac
					}
					console.log(
						'设备信息name:' + item.name +
						'--macAddress:' + item.macAddress +
						(item.identifier ? '--identifier:' + item.identifier : '') +
						'--rssi:' + item.rssiValue
					)
					if (this.isValidScanDevice(item)) {
						nextList.push(item)
					} else {
						console.log('设备被过滤', item)
					}
				})
				this.deviceList = nextList
			},
			startScan() {
				uni.showLoading({
					title: '正在扫描...',
					mask: false
				})
				if (this.isAndroid()) {
					this.startAndroidScan()
					return
				}
				this.startIosScan()
			},
			startAndroidScan() {
				plus.android.requestPermissions(ANDROID_LOCATION_PERMISSIONS, (e) => {
					console.log('uniapp有权限' + JSON.stringify(e))
				})
				plus.android.requestPermissions(ANDROID_BLE_PERMISSIONS, (e) => {
					console.log('uniapp有权限' + JSON.stringify(e))
					uni.showLoading({
						title: '加载中'
					})
					ble.scanDevice(6, (res) => {
						uni.hideLoading()
						console.log(res.data)
						this.fillDeviceList(res.data)
					})
				})
			},
			startIosScan() {
				console.log('ios scanDevice111:' + JSON.stringify(ble))
				ble.scanDevice(6, (res) => {
					uni.hideLoading()
					console.log(res.data)
					this.fillDeviceList(res.data, {
						sortByRssi: true
					})
				})
			},
			/**
			 * Android：连接成功后先拉设备能力，再按 isHasCreateBond 走 YCBTClient.createBond
			 * 注意：plus.android.invoke 对 boolean 常返回 null，需直接调静态方法
			 */
			tryCreateBondAfterConnect() {
				if (!this.isAndroid()) return
				if (typeof plus === 'undefined' || !plus.android) {
					console.warn('[createBond] plus.android 不可用')
					return
				}
				const runBond = () => {
					try {
						const YCBTClient = plus.android.importClass('com.yucheng.ycbtsdk.YCBTClient')
						const FunctionConstant = plus.android.importClass(
							'com.yucheng.ycbtsdk.Constants$FunctionConstant'
						)
						const key = FunctionConstant.ISHASCREATEBOND || 'isHasCreateBond'
						const supported = !!YCBTClient.isSupportFunction(key)
						const bonded = !!YCBTClient.isBond()
						console.log('[createBond] key=', key, 'supported=', supported, 'isBond=', bonded)
						if (!supported) {
							console.warn('[createBond] 设备不支持 isHasCreateBond，跳过')
							return
						}
						if (bonded) {
							console.log('[createBond] 已配对，跳过 createBond')
							return
						}
						YCBTClient.createBond()
						console.log('[createBond] createBond 已调用')
					} catch (e) {
						console.error('[createBond] 调用失败', e)
					}
				}
				if (ble && typeof ble.getDeviceFeature === 'function') {
					ble.getDeviceFeature((featureRes) => {
						console.log('[createBond] getDeviceFeature=', featureRes)
						runBond()
					})
					return
				}
				runBond()
			},
			toConnect(address) {
				identifier = address
				uni.showLoading({
					title: '加载中'
				})
				console.log('开始连接设备' + address)
				ble.connectDevice(address, (res) => {
					console.log('连接设备返回的结果', res)
					switch (res.code) {
						case 0:
							console.log('连接请求已发出', res)
							this.showListView = false
							androidPushReady = false
							ble.getBluetoothState((resState) => {
								console.log('插件蓝牙状态', resState, 'native=', this.getNativeConnectState())
							})
							// connectDevice 的 code=0 只表示发起连接；真正就绪靠 globalEvent.bleStateChangeEvent==2
							if (this.isAndroid()) {
								this.waitForAndroidBleReady()
							}
							ble.setDeviceSyncPhoneTime((resTime) => {
								console.log('设置时间(同步手机时间)', resTime)
							})
							ble.setDeviceLanguage(0x01, (resLanguage) => {
								console.log('设置语言', resLanguage)
							})
							break
						default:
							console.log('连接设备失败', res)
							uni.hideLoading()
							break
					}
				})
			},
			onDisconnectSuccess() {
				this.clearConnectReadyTimer()
				this.clearRwOkRetryTimer()
				androidPushReady = false
				realUploadRetriedOnRwOk = false
				historyFingerprint = {}
				uni.hideLoading()
				uni.showToast({
					title: '断连成功',
					duration: 2000
				})
				this.showListView = true
			},
			disconnectDevice() {
				if (this.isAndroid()) {
					ble.disconnectDevice((res) => {
						this.onDisconnectSuccess()
					})
					return
				}
				ble.disConnectDevice(identifier, (res) => {
					this.onDisconnectSuccess()
				})
			},
			deviceInfoItemClick(index) {
				console.log('deviceInfoItemClick.index:' + index)
				if (index === 0) {
					this.disconnectDevice()
					return
				}
				const url = MENU_ROUTES[index]
				if (url) {
					uni.navigateTo({
						url
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		width: 100vw;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-content: flex-start;
		align-items: flex-start;
		margin: 15px 10px;
		padding: 5px;

		.button {
			width: 100px;
			font-size: 11px;
			background-color: #003366;
			color: white;
		}

		.log-text {
			font-size: 12px;
			color: #003366;
			word-break: break-all;
		}
	}

	.border {
		border: solid 1px gray;
	}

	.list {
		width: 93vw;
		height: 50vh;
		padding-left: 3vw;
		padding-right: 3vw;
		padding-top: 3vw;

		.list-item {
			background-color: #f8f8f8;
			border: solid 1px darkgray;
			box-shadow: 1px 1px 3px;
			margin-bottom: 3vw;

			.text {
				height: 30px;
				line-height: 30px;
				margin-left: 5px;
				color: #003366;
			}

			.row {
				margin: 3px 10px !important;
				padding: 0 !important;
			}
		}
	}
</style>