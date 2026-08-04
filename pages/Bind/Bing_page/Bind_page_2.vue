<template>
	<view class="backpage">
		<!-- 扫码区域 -->
		<view v-if="img_scan" class="img_scansty">
			<app-scan ref="appScan" @getCode="getCode" />
		</view>
		<view v-else class="img_scansty_1">
			<view class="imgss">
				<image lazy-load class="imgss1" mode="aspectFit" :src="scan_img" />
			</view>
			<view class="Model_number">{{ xinghao }}</view>
			<view class="Message1">{{ context_msg }}</view>
		</view>

		<!-- 扫码提示 -->
		<view v-if="img_scan" class="Message">
			{{ modelname === 'BPW1' ? $t('扫描手表里边的二维码') : $t('扫描设备背面的二维码') }}
		</view>
		<!-- 操作按钮 -->
		<button class="button_style2" style="" @click="ButtonTap">{{ $t('输入设备码') }}</button>
		<!-- 设备示意图 -->
		<view class="device-images">
			<template v-if="modelname === 'BPW1'">
				<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao2.jpg" />
				<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao1.jpg" />
			</template>
			<template v-else-if="modelname === 'BPW6'">
				<image class="imgss_sc" mode="aspectFit"
					:src="(language === 'zh-Hans' || language == 'zh-Hant')?'/static/image/U19M_zh_1.jpg':'/static/image/U19M_en_1.jpg'" />
				<image class="imgss_sc" mode="aspectFit"
					:src="(language === 'zh-Hans' || language == 'zh-Hant')?'/static/image/U19M_zh_2.jpg':'/static/image/U19M_en_2.jpg'" />
			</template>
			<image v-else-if="isScaleDevice" class="imgss_sc" mode="aspectFit" src="/static/image/sc_tz.jpg" />
			<image v-else class="imgss_sc" mode="aspectFit" src="/static/image/sc_xy.jpg" />
		</view>

		<!-- 底部操作区 -->
		<view class="Messageback">
			<button class="button_style" @click="True_Bind">{{ $t('确认绑定') }}</button>
			<button class="button_style1" @click="unbind">{{ $t('暂不绑定') }}</button>
		</view>

		<!-- 手动输入弹窗 -->
		<uni-popup ref="qiehuanpopup" type="center" :mask-click="true">
			<view class="popup-content">
				<view class="popup-title">{{ $t('手动输入') }}</view>
				<input v-model="inputcontext" :placeholder="$t('输入设备码')" class="popup-input">
				<button class="btn-confirm" @click="shoudongbtn">{{ $t('确定') }}</button>
				<button class="btn-cancel" @click="shoudongbtncancle">{{ $t('取消') }}</button>
			</view>
		</uni-popup>

		<!-- 相机权限提示 -->
		<uni-popup ref="popup" :mask-click="true">
			<view class="popup-content">{{ $t('允许使用摄像头') }}</view>
		</uni-popup>

		<!-- 配对成功弹窗 -->
		<uni-popup ref="popup1" :mask-click="true">
			<view class="popupstusdsd_2">
				<view class="popup-body">
					<view class="popupstusdsditem">{{ $t('配对成功') }}</view>
					<view class="popupstusdsditem_1">{{ $t('蓝牙已连接成功') }}</view>
					<view v-if="modelname === 'BPW6'">{{ $t('标准蓝牙提示BPW6') }}</view>
					<view v-else>{{ $t('标准蓝牙提示') }}</view>
				</view>
				<button class="butonstsd" @click="turesss">{{ $t('确定') }}</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import appScan from '@/uni_modules/simbalkj-scan/components/simbalkj-scan/appScan.vue'
	import {
		u16proBLE
	} from '@/pages/api/protocol/u16pro-ble-manager.js'

	// 常量定义
	const PLATFORM = uni.getSystemInfoSync().platform
	const CURRENT_LANG = uni.getLocale()
	const BPW6_SERVICE = '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E'

	// 设备图片映射
	const DEVICE_IMAGES = {
		zh: {
			30000: '/static/image/BPW1.png',
			30001: '/static/image/BPW6.jpg',
			20000: '/static/image/jls260.png',
			20001: '/static/image/jls260.png',
			10000: '/static/image/617.png',
			10001: '/static/image/BP68.png',
			10002: '/static/image/BP67.png',
			10003: '/static/image/68G.png',
			10004: '/static/image/BP67.png',
			10005: '/static/image/68G.png',
			10006: '/static/image/68G.png'
		},
		default: {
			30000: '/static/image/shoubiao1.png',
			30001: '/static/image/BPW6.jpg',
			20000: '/static/image/tizhi1.jpg',
			20001: '/static/image/tizhi1.jpg',
			10000: '/static/image/xueya1.png',
			10001: '/static/image/xueya1.png',
			10002: '/static/image/xueya1.png',
			10003: '/static/image/xueya1.png',
			10004: '/static/image/xueya1.png',
			10005: '/static/image/xueya1.png',
			10006: '/static/image/xueya1.png'
		}
	}

	// 体脂秤设备列表
	const SCALE_DEVICES = ['JL-S260', 'JL-S100']

	// 蓝牙协议常量
	const BLE_CONSTANTS = {
		ACK_HEADER: 0xe0,
		PROTOCOL_VERSION: 0x00,
		CMD_BIND: 0x08,
		KEY_BIND: 0x00,
		CMD_TIME: 0x02,
		KEY_TIME: 0x08,
		MAX_RETRY: 3,
		RETRY_DELAY: 2000,
		SCAN_TIMEOUT: 12
	}

	export default {
		components: {
			appScan
		},

		data() {
			return {
				// 界面状态
				img_scan: true,
				scan_img: '/static/image-active.png',
				xinghao: '',
				context_msg: this.$t('请将条码放入扫码框内即可自动扫描'),

				// 设备信息
				modelConnectType: '',
				SELECT_TYPE: '',
				modelname: '',
				modelId: '',
				context_msg1: '',

				// 输入相关
				inputcontext: '',

				// 权限状态标记 - 关键修复
				locationChecked: false,
				locationGranted: false,
				pendingLocationCheck: false,

				// BPW1专用
				BPW1deviceId: '',
				BPW1model: '30000',
				// BPW6专用
				BPW6deviceId: '',
				BPW6model: '30001',

				// 蓝牙相关
				writeuuid: '',
				scanTimer: null,
				retryCount: 0,
				language: uni.getLocale(),
			}
		},

		computed: {
			// 是否为体脂秤设备
			isScaleDevice() {
				return SCALE_DEVICES.includes(this.modelname)
			},

			// 当前语言对应的图片映射
			imageMap() {
				return ['zh-Hans', 'zh-Hant'].includes(CURRENT_LANG) ?
					DEVICE_IMAGES.zh :
					DEVICE_IMAGES.default
			}
		},

		onLoad(options) {
			this.SELECT_TYPE = options.SELECT_TYPE
			this.modelConnectType = options.modelConnectType
			this.modelname = options.name

			uni.setNavigationBarTitle({
				title: this.$t('绑定设备')
			})
		},

		onShow() {
			this.setDeviceBindingActive(true)
			// 关键修复：如果正在等待用户从设置返回，检查权限并继续
			if (this.pendingLocationCheck) {
				this.pendingLocationCheck = false
				this.checkLocationAndContinue()
				return
			}

			// 如果已经获得权限，不再重复初始化
			if (this.locationGranted) {
				// 只需确保蓝牙适配器开启
				this.ensureBluetoothEnabled()
				return
			}

			// 首次进入或需要重新初始化
			uni.closeBluetoothAdapter()
			setTimeout(() => this.initBluetooth(), 1000)
		},

		onHide() {
			if (!this.pendingLocationCheck) {
				this.setDeviceBindingActive(false)
			}
		},

		onUnload() {
			this.cleanup()
		},

		mounted() {
			// 监听弹窗关闭
			this.$refs.qiehuanpopup?.$on('change', (e) => {
				if (!e.show) this.onPopupClose()
			})
		},

		methods: {
			...mapMutations(['setacktypes', 'setacktypes6']),

			setDeviceBindingActive(active) {
				const gt = this.$globalTimers
				if (gt) {
					gt.deviceBindingActive = active
				}
				uni.$emit(active ? 'DEVICE_BIND_PAGE_ACTIVE' : 'DEVICE_BIND_PAGE_INACTIVE')
			},

			// ==================== 蓝牙初始化 ====================

			/**
			 * 初始化蓝牙
			 */
			initBluetooth() {
				uni.openBluetoothAdapter({
					success: () => this.handleBluetoothReady(),
					fail: (err) => this.handleBluetoothError(err)
				})
			},

			/**
			 * 确保蓝牙已启用
			 */
			ensureBluetoothEnabled() {
				uni.openBluetoothAdapter({
					success: () => console.log('蓝牙已就绪'),
					fail: (err) => {
						if (err.errCode === 10001) {
							// 蓝牙被关闭，提示用户
							uni.showModal({
								content: this.$t('当前蓝牙未开启是否去设置打开'),
								showCancel: false,
								success: (res) => {
									if (res.confirm) this.openBluetoothSettings()
								}
							})
						}
					}
				})
			},

			/**
			 * 蓝牙准备就绪
			 */
			handleBluetoothReady() {
				// 检查定位权限（Android）
				this.checkAndroidLocation()
			},

			/**
			 * 蓝牙错误处理
			 */
			handleBluetoothError(err) {
				console.error('蓝牙初始化失败:', err)
				uni.hideLoading()

				if (err.errCode === 10001) {
					uni.showModal({
						content: this.$t('当前蓝牙未开启是否去设置打开'),
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								this.openBluetoothSettings()
								// 不重置扫描状态，保持当前界面
							}
						}
					})
				}
			},

			// ==================== Android定位权限管理 ====================

			/**
			 * 检查Android定位服务 - 关键修复
			 */
			checkAndroidLocation() {
				// #ifdef APP-PLUS
				if (PLATFORM !== 'android') {
					this.locationGranted = true
					this.startCameraCheck()
					return
				}

				// Android 12+ 不需要定位权限
				if (this.getAndroidVersion() >= 12) {
					this.locationChecked = true
					this.locationGranted = true
					this.startCameraCheck()
					return
				}

				// 导入Android类
				const Context = plus.android.importClass('android.content.Context')
				const LocationManager = plus.android.importClass('android.location.LocationManager')
				const mainActivity = plus.android.runtimeMainActivity()
				const locationManager = mainActivity.getSystemService(Context.LOCATION_SERVICE)

				// 检查GPS是否开启
				const isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)

				if (!isGpsEnabled) {
					// GPS未开启，显示弹窗（保持扫描界面）
					this.showGPSEnableDialog(mainActivity)
				} else {
					// GPS已开启，检查应用权限
					this.checkAppLocationPermission(mainActivity)
				}
				// #endif
			},

			/**
			 * 显示GPS开启弹窗
			 */
			showGPSEnableDialog(activity) {
				// 关键：标记正在等待用户从设置返回
				this.pendingLocationCheck = true

				uni.showModal({
					title: this.$t('提示'),
					content: this.$t('您的手机定位服务未开启'),
					confirmText: this.$t('去开启'),
					cancelText: this.$t('暂不开启'),
					success: (res) => {
						if (res.confirm) {
							// 跳转到系统定位设置
							const Intent = plus.android.importClass('android.content.Intent')
							const Settings = plus.android.importClass('android.provider.Settings')
							const intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
							activity.startActivity(intent)
							uni.setStorageSync('dingwei', '1')
							// 注意：这里不关闭pendingLocationCheck，等待onShow处理
						} else {
							this.pendingLocationCheck = false
							uni.setStorageSync('dingwei', '0')
							uni.navigateBack()
						}
					}
				})
			},

			/**
			 * 检查应用定位权限
			 */
			checkAppLocationPermission(activity) {
				const PackageManager = plus.android.importClass('android.content.pm.PackageManager')
				const permission = 'android.permission.ACCESS_FINE_LOCATION'

				const hasPermission = activity.checkSelfPermission(permission) === PackageManager.PERMISSION_GRANTED

				if (hasPermission) {
					// 已有权限，继续
					this.locationChecked = true
					this.locationGranted = true
					uni.setStorageSync('appQX', '1')
					this.startCameraCheck()
				} else {
					// 需要申请权限
					this.showPermissionRequestDialog(activity)
				}
			},

			/**
			 * 显示权限申请弹窗
			 */
			showPermissionRequestDialog(activity) {
				// 关键：标记正在等待用户从设置返回
				this.pendingLocationCheck = true

				uni.showModal({
					title: this.$t('提示'),
					content: this.$t('需要获取您手机定位权限和附近设备权限'),
					confirmText: this.$t('去开启'),
					cancelText: this.$t('暂不开启'),
					success: (res) => {
						if (res.confirm) {
							// 跳转到应用权限设置
							const Intent = plus.android.importClass('android.content.Intent')
							const Uri = plus.android.importClass('android.net.Uri')
							const uri = Uri.fromParts('package', activity.getPackageName(), null)
							const intent = new Intent('android.settings.APPLICATION_DETAILS_SETTINGS', uri)
							intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
							activity.startActivity(intent)
							// 注意：这里不关闭pendingLocationCheck，等待onShow处理
						} else {
							this.pendingLocationCheck = false
							uni.navigateBack()
						}
					}
				})
			},

			/**
			 * 用户从设置返回后，检查权限并继续 - 关键修复
			 */
			checkLocationAndContinue() {
				// #ifdef APP-PLUS
				const mainActivity = plus.android.runtimeMainActivity()
				const Context = plus.android.importClass('android.content.Context')
				const LocationManager = plus.android.importClass('android.location.LocationManager')
				const locationManager = mainActivity.getSystemService(Context.LOCATION_SERVICE)

				const isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)

				if (!isGpsEnabled) {
					// 用户没有开启GPS
					uni.showToast({
						title: this.$t('定位服务未开启'),
						icon: 'none'
					})
					return
				}

				// 检查应用权限
				const PackageManager = plus.android.importClass('android.content.pm.PackageManager')
				const hasPermission = mainActivity.checkSelfPermission('android.permission.ACCESS_FINE_LOCATION') ===
					PackageManager.PERMISSION_GRANTED

				if (hasPermission) {
					// 权限已获取，关键：保持当前界面状态
					this.locationChecked = true
					this.locationGranted = true
					uni.setStorageSync('appQX', '1')

					// 继续检查相机权限，不重置扫描界面
					this.startCameraCheck()

					uni.showToast({
						title: this.$t('权限已获取'),
						icon: 'success',
						duration: 2000
					})
				} else {
					// 用户没有授予权限
					uni.showToast({
						title: this.$t('权限未获取'),
						icon: 'none'
					})
				}
				// #endif
			},

			/**
			 * 获取Android版本
			 */
			getAndroidVersion() {
				const system = uni.getSystemInfoSync().system
				const match = system.match(/Android\s(\d+)/i)
				return match ? parseInt(match[1]) : 0
			},

			/**
			 * 开始检查相机权限（保持扫描界面）
			 */
			startCameraCheck() {
				this.$nextTick(() => {
					// #ifdef APP-PLUS
					plus.android.checkPermission('android.permission.CAMERA', (result) => {
						if (result.checkResult !== 0) {
							this.$refs.popup?.open('top')
						} else {
							setTimeout(() => {
								this.$refs.popup?.close()
							}, 3000)
						}
					})
					// #endif
				})
			},

			// ==================== 手动输入 ====================

			ButtonTap() {
				// 切换到输入界面，不重置其他状态
				this.img_scan = false
				this.$refs.qiehuanpopup?.open('center')
			},

			onPopupClose() {
				// 弹窗关闭时，如果没有输入内容，返回扫描界面
				if (!this.inputcontext && !this.context_msg1) {
					this.img_scan = true
				}
			},

			/**
			 * 处理BPW1手动输入
			 */
			handleBPW1ManualInput() {
				const prefix = this.inputcontext.slice(0, 4)

				if (prefix === '4142') {
					this.context_msg = `300000${this.inputcontext}`
					this.BPW1deviceId = this.formatMacAddress(this.inputcontext)
					this.getDeviceInfo()
					this.$refs.qiehuanpopup?.close()
				} else {
					uni.showToast({
						title: this.$t('选中的设备与扫码设备不匹配'),
						icon: 'none'
					})
				}
			},

			/**
			 * 格式化MAC地址
			 */
			formatMacAddress(mac) {
				const clean = mac.replace(/[^a-fA-F0-9]/g, '')
				return clean.match(/.{1,2}/g).join(':').toUpperCase()
			},

			shoudongbtn() {
				if (!this.inputcontext) {
					uni.showToast({
						title: this.$t('输入设备码'),
						icon: 'none'
					})
					return
				}

				if (this.modelname === 'BPW1') {
					this.handleBPW1ManualInput()
				} else {
					this.context_msg = this.inputcontext
					this.getDeviceInfo()
					this.$refs.qiehuanpopup?.close()
				}
			},

			shoudongbtncancle() {
				this.$refs.qiehuanpopup?.close()
				// 返回扫描界面，但不完全重置状态
				if (!this.context_msg1) {
					this.img_scan = true
				}
				this.inputcontext = ''
			},

			// ==================== 扫码处理 ====================

			/**
			 * 处理扫码结果
			 */
			getCode(barCode) {
				switch (this.modelname) {
					case 'BPW1':
						this.handleBPW1Code(barCode)
						break;
					case 'BPW6':
						this.handleBPW6Code(barCode)
						break
					default:
						this.context_msg = barCode
						this.img_scan = false
						this.getDeviceInfo()
						break;
				}
			},

			/**
			 * 处理BPW1扫码
			 */
			handleBPW1Code(barCode) {
				const match = barCode.match(/para=([^&]+)/)
				if (match?.[1]) {
					this.BPW1deviceId = match[1]
					const cleanMac = match[1].replace(/:/g, '')
					const prefix = cleanMac.slice(0, 4)
					this.context_msg = prefix === '4142' ? `300000${cleanMac}` : match[1]
				} else {
					let output = this.formatMacCustom(barCode);
					console.log("output", output); // 输出: 41:42:2E:E1:C6:6D
					this.BPW1deviceId = output;
					this.context_msg = barCode
				}
				this.img_scan = false
				this.getDeviceInfo()
			},

			handleBPW6Code(barCode) {
				if (barCode && !barCode.includes("300001")) {
					this.BPW6deviceId = barCode
					const cleanMac = barCode.replace(/:/g, '')
					const prefix = cleanMac.slice(0, 4)
					this.context_msg = `300001${cleanMac}`
				} else {
					let output = this.formatMacCustom(barCode);
					this.BPW6deviceId = output;
					this.context_msg = barCode
				}
				this.img_scan = false
				this.getDeviceInfo()
			},

			// ==================== 设备信息查询 ====================

			/**
			 * 获取设备信息
			 */
			getDeviceInfo() {
				const data = {
					deviceSn: this.context_msg
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_info, data, {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
						'content-type': 'application/x-www-form-urlencoded'
					}).then(res => this.handleDeviceInfoResponse(res))
					.catch(() => this.showDeviceMismatch())
			},

			/**
			 * 处理设备信息响应
			 */
			handleDeviceInfoResponse(res) {
				if (res.code !== 200 || res.data.model !== this.modelname) {
					this.showDeviceMismatch()
					return
				}
				// BPW1特殊验证
				if (res.data.model === 'BPW1' && res.data.mac) {
					const inputSn = this.context_msg.slice(6, 16)
					const serverSn = res.data.deviceSn.slice(6, 16)
					if (inputSn !== serverSn) {
						this.showDeviceMismatch()
						return
					}
				}
				if (res.data.model === 'BPW6' && res.data.mac) {
					const inputSn = this.context_msg.slice(6, 16)
					const serverSn = res.data.deviceSn.slice(6, 16)
					if (inputSn !== serverSn) {
						this.showDeviceMismatch()
						return
					}
				}
				// 设置设备信息（保持img_scan = false）
				this.setDeviceInfo(res.data)
			},

			/**
			 * 设置设备信息
			 */
			setDeviceInfo(data) {
				this.img_scan = false // 确保显示设备信息界面
				this.xinghao = `${this.$t('型号')}${data.model==="BPW6"?"U19M":data.model}`
				this.context_msg = `SN:${data.deviceSn}`
				this.context_msg1 = data.deviceSn
				this.modelId = data.modelId
				if (data.model === 'BPW6' && data.mac && !this.BPW6deviceId) {
					this.BPW6deviceId = data.mac
				}
				this.updateScanImage(data.picturePath)
			},
			/**
			 * 显示设备不匹配提示
			 */
			showDeviceMismatch() {
				this.img_scan = true // 返回扫描界面
				uni.showToast({
					title: this.$t('选中的设备与扫码设备不匹配'),
					icon: 'none'
				})
				this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描')
			},

			/**
			 * 更新扫描图片
			 */
			updateScanImage(picturePath) {
				if (picturePath && ['zh-Hans', 'zh-Hant'].includes(CURRENT_LANG)) {
					this.scan_img = this.imageMap[this.modelId] || picturePath
				} else {
					this.scan_img = this.imageMap[this.modelId] || '/static/image-active.png'
				}
			},

			// ==================== 绑定流程 ====================

			True_Bind() {
				if (this.context_msg === this.$t('请将条码放入扫码框内即可自动扫描')) {
					uni.showToast({
						title: this.$t('请扫描设备的设备码'),
						icon: 'none'
					})
					return
				}
				this.queryUserDevices()
			},

			unbind() {
				uni.switchTab({
					url: '/pages/tabBar/main/Main'
				})
			},

			/**
			 * 查询用户已绑定设备
			 */
			queryUserDevices() {
				this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => this.handleQueryResponse(res))
					.catch(err => {
						uni.showToast({
							title: this.$("失败"),
							icon: 'none'
						})
					})
			},

			/**
			 * 处理查询响应
			 */
			handleQueryResponse(res) {
				if (res.code !== 200) {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					return
				}
				// 无设备直接跳转
				if (!res.rows?.length) {
					this.navigateToBind(this.modelId)
					return
				}
				// 检查是否已绑定
				const exists = res.rows.some(item => item.deviceSn === this.context_msg1)
				if (exists) {
					uni.setStorageSync('deviceSn', this.context_msg1)
					uni.showToast({
						title: this.$t('当前主页面已绑定该设备'),
						icon: 'none'
					})
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/tabBar/main/Main'
						})
					}, 1500)
				} else {
					this.navigateToBind(this.modelId)
				}
			},

			/**
			 * 跳转到绑定页面
			 */
			navigateToBind(modelId) {
				const routes = {
					0: () => this.bindDeviceDirectly(this.context_msg1, '', modelId),
					1: () => this.handleBLEBind(modelId),
					2: () => uni.navigateTo({
						url: `../../Bind/Bing_xueya/Bing_xueya?SELECT_TYPE=${this.SELECT_TYPE}&sn=${this.context_msg1}&modelname=${this.modelname}&modelId=${modelId}`
					})
				}
				routes[this.modelConnectType]?.()
			},

			/**
			 * 直接绑定（无需蓝牙）
			 */
			bindDeviceDirectly(sn, mac, modelId) {
				const data = {
					deviceSn: sn,
					mac: mac.trim()
				}

				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code === 200) {
						uni.setStorageSync('deviceSn', sn)
						uni.navigateTo({
							url: `../Bing_page/Bind_success?modelId=${modelId}`
						})
					} else {
						uni.reLaunch({
							url: `../Bing_page/Bind_fail?bindcode=${res.code}`
						})
					}
				}).catch(() => {
					uni.reLaunch({
						url: '../Bing_page/Bind_fail'
					})
				})
			},

			/**
			 * 处理蓝牙绑定
			 */
			handleBLEBind(modelId) {
				if (this.modelname === 'BPW1') {
					this.BPW1model = modelId
					this.bindBPW1Device(this.context_msg1, this.BPW1deviceId, modelId)
				} else if (this.modelname === 'BPW6') {
					this.BPW6model = modelId
					this.bindBPW6Device(this.context_msg1, this.BPW6deviceId, modelId)
				} else {
					uni.navigateTo({
						url: `../../Bind/Bing_xueya/Bing_xueya_LY?SELECT_TYPE=${this.SELECT_TYPE}&sn=${this.context_msg1}&modelname=${this.modelname}&modelId=${modelId}`
					})
				}
			},

			// ==================== BPW1蓝牙绑定 ====================

			/**
			 * 绑定BPW1设备
			 */
			bindBPW1Device(sn, mac, modelId) {
				const data = {
					deviceSn: sn,
					mac: mac.trim()
				}
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
						'content-type': 'application/x-www-form-urlencoded;'
					}).then(res => this.handleBPW1BindResponse(res, sn, mac))
					.catch(() => uni.reLaunch({
						url: '../Bing_page/Bind_fail'
					}))
			},
			formatMacCustom(hexStr) {
				// 去掉前6个字符 '300000'，然后取后面的MAC地址
				let mac = hexStr.slice(6); // 得到 '41422EE1C66D'
				// 每两位一组，用冒号连接
				let result = mac.match(/.{2}/g).join(':');
				// 转换为大写（如果需要）
				return result.toUpperCase();
			},

			/**
			 * 处理BPW1绑定响应
			 */
			handleBPW1BindResponse(res, sn, mac) {
				if (res.code === 401) {
					uni.showToast({
						title: this.$t('此设备已被其他账号绑定'),
						icon: 'none'
					})
					return
				}

				if (res.code !== 200) {
					uni.reLaunch({
						url: '../Bing_page/Bind_fail'
					})
					return
				}

				uni.setStorageSync('appQX', '1')
				uni.setStorageSync('deviceSn', sn)

				uni.showLoading({
					title: this.$t('连接中'),
					mask: true
				})

				this.startBPW1Connection(mac, sn)
			},

			// ==================== BPW6蓝牙绑定 ====================

			/**
			 * 绑定BPW6设备
			 */
			bindBPW6Device(sn, mac, modelId) {
				const normalizedMac = this.formatMacAddress(mac || '')
				const data = {
					deviceSn: sn,
					mac: (normalizedMac || mac || '').trim()
				}
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
						'content-type': 'application/x-www-form-urlencoded;'
					}).then(res => this.handleBPW6BindResponse(res, sn, normalizedMac || mac))
					.catch(() => uni.reLaunch({
						url: '../Bing_page/Bind_fail'
					}))
			},

			/**
			 * 处理BPW6绑定响应
			 */
			handleBPW6BindResponse(res, sn, mac) {
				if (res.code === 401) {
					uni.showToast({
						title: this.$t('此设备已被其他账号绑定'),
						icon: 'none'
					})
					return
				}

				if (res.code !== 200) {
					uni.reLaunch({
						url: '../Bing_page/Bind_fail'
					})
					return
				}

				uni.setStorageSync('appQX', '1')
				uni.setStorageSync('deviceSn', sn)

				uni.showLoading({
					title: this.$t('连接中'),
					mask: true
				})

				this.startBPW6Connection(mac, sn)
			},

			/**
			 * 开始BPW6蓝牙连接
			 */
			startBPW6Connection(mac, sn) {
				uni.openBluetoothAdapter({
					success: () => {
						uni.startBluetoothDevicesDiscovery({
							allowDuplicatesKey: true,
							success: () => this.onBPW6DeviceFound(mac, sn),
							fail: (e) => {
								console.error('BPW6蓝牙扫描失败', e)
								uni.showModal({
									content: this.$t('蓝牙连接失败'),
									showCancel: false,
									success: (res) => {
										if (res.confirm) {
											this.unbindDevice(sn)
											this.img_scan = true
											uni.hideLoading()
										}
									}
								})
							}
						})
					},
					fail: (err) => {
						uni.hideLoading()
						if (err.errCode === 10001) {
							uni.showModal({
								content: this.$t('当前蓝牙未开启是否去设置打开'),
								showCancel: false,
								success: (res) => res.confirm && this.openBluetoothSettings()
							})
						}
					}
				})

				this.setacktypes6(0)
			},

			/**
			 * 监听BPW6设备
			 */
			onBPW6DeviceFound(targetMac, sn) {
				console.log(targetMac, sn)
				let scanCount = 0
				let found = false
				this.scanTimer = setInterval(() => {
					scanCount++
					if (scanCount >= BLE_CONSTANTS.SCAN_TIMEOUT && !found) {
						this.stopScan()
						uni.showToast({
							title: this.$t('连接超时'),
							icon: 'none'
						})
						this.img_scan = true
						this.unbindDevice(sn)
						uni.hideLoading()
					}
				}, 1000)

				uni.onBluetoothDeviceFound((res) => {
					for (const device of res.devices) {
						if ((device.name.includes("U19M") || device.name.includes("U16H")) && device.deviceId ===
							targetMac) {
							found = true
							this.stopScan()
							setTimeout(() => this.createBPW6BLEConnection(device.deviceId, sn), 5000)
							break
						}
					}
				})
			},
			/**
			 * 创建BPW6 BLE连接（带重试）
			 */
			createBPW6BLEConnection(deviceId, sn) {
				console.log(deviceId, sn)
				this.retryCount = 0
				const tryConnect = () => {
					this.retryCount++
					uni.createBLEConnection({
						deviceId: deviceId.trim(),
						success: () => this.handleBPW6ConnectionSuccess(deviceId, sn),
						fail: (err) => this.handleBPW6ConnectionFail(err, deviceId, sn, tryConnect)
					})
				}

				tryConnect()
			},

			handleBPW6ConnectionSuccess(deviceId, sn) {
				uni.hideLoading()
				uni.setStorageSync('BPW6devicemac', deviceId)
				uni.setStorageSync('BPW6deviceSn', sn)
				uni.setStorageSync('BPW6deviceId', deviceId)
				this.$refs.popup1?.open('center')
				this.setacktypes6(0)
				// setTimeout(() => {
				// 	this.getBPW6BLEDeviceServices(deviceId, sn)
				// }, 2000)
			},

			handleBPW6ConnectionFail(err, deviceId, sn, retryFn) {
				console.error(`BPW6连接失败(${this.retryCount}/${BLE_CONSTANTS.MAX_RETRY}):`, err)
				this.cleanupBPW6Connection(deviceId, sn)

				if (this.retryCount < BLE_CONSTANTS.MAX_RETRY) {
					setTimeout(retryFn, BLE_CONSTANTS.RETRY_DELAY)
					return
				}

				uni.showToast({
					title: this.$t('连接超时'),
					icon: 'none'
				})
				this.img_scan = true
				this.unbindDevice(sn)
				uni.hideLoading()
			},

			cleanupBPW6Connection(deviceId, sn) {
				this.unbindDevice(sn)
				uni.closeBLEConnection({
					deviceId
				})
				uni.hideLoading()
				uni.closeBluetoothAdapter()
				uni.openBluetoothAdapter()
			},

			getBPW6BLEDeviceServices(deviceId, sn) {
				uni.getBLEDeviceServices({
					deviceId,
					success: (res) => {
						const services = res.services || []
						const bpw6Service = services.find((item) =>
							String(item.uuid).toUpperCase() === BPW6_SERVICE
						) || services[2]
						if (bpw6Service && bpw6Service.uuid) {
							this.getBPW6BLEDeviceCharacteristics(deviceId, bpw6Service.uuid, sn)
						}
					},
					fail: (err) => {
						console.error('BPW6获取服务失败', err)
					}
				})
			},

			getBPW6BLEDeviceCharacteristics(deviceId, serviceId, sn) {
				uni.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success: async (res) => {
						for (const item of res.characteristics) {
							if (item.properties.notify) {
								uni.notifyBLECharacteristicValueChange({
									state: true,
									deviceId,
									serviceId,
									characteristicId: item.uuid
								})
							}
							if (item.properties.write) {
								try {
									await u16proBLE.setTime(new Date(), 0, deviceId)
								} catch (syncErr) {
									console.error('BPW6时间同步失败', syncErr)
								}
								uni.setStorageSync('BPW6devicemac', deviceId)
								uni.setStorageSync('BPW6deviceSn', sn)
								uni.setStorageSync('BPW6deviceId', deviceId)
							}
						}
						this.setacktypes6(0)
					},
					fail: (err) => {
						console.error('BPW6获取特征值失败', err)
					}
				})
			},

			/**
			 * 开始BPW1蓝牙连接
			 */
			startBPW1Connection(mac, sn) {
				uni.openBluetoothAdapter({
					success: () => {
						uni.startBluetoothDevicesDiscovery({
							allowDuplicatesKey: true,
							success: () => this.onBPW1DeviceFound(mac, sn),
							fail: (e) => {
								console.error('蓝牙扫描失败', e)
								uni.showModal({
									content: this.$t('蓝牙连接失败'),
									showCancel: false,
									success: (res) => {
										if (res.confirm) {
											this.unbindDevice(sn)
											this.img_scan = true
											uni.hideLoading()
										}
									}
								})

							}
						})
					},
					fail: (err) => {
						uni.hideLoading()
						if (err.errCode === 10001) {
							uni.showModal({
								content: this.$t('当前蓝牙未开启是否去设置打开'),
								showCancel: false,
								success: (res) => res.confirm && this.openBluetoothSettings()
							})
						}
					}
				})

				this.setacktypes(0)
			},

			/**
			 * 监听BPW1设备
			 */
			onBPW1DeviceFound(targetMac, sn) {
				let scanCount = 0
				let found = false

				this.scanTimer = setInterval(() => {
					scanCount++
					if (scanCount >= BLE_CONSTANTS.SCAN_TIMEOUT && !found) {
						this.stopScan()
						uni.showToast({
							title: this.$t('连接超时'),
							icon: 'none'
						})
						this.img_scan = true
						this.unbindDevice(sn)
						uni.hideLoading()
					}
				}, 1000)

				uni.onBluetoothDeviceFound((res) => {
					for (const device of res.devices) {
						if (device.name === 'BPW1' && device.deviceId === targetMac) {
							found = true
							this.stopScan()
							setTimeout(() => this.createBLEConnection(device.deviceId, sn), 5000)
							break
						}
					}
				})
			},

			/**
			 * 停止扫描
			 */
			stopScan() {
				clearInterval(this.scanTimer)
				uni.stopBluetoothDevicesDiscovery()
			},

			/**
			 * 创建BLE连接（带重试）
			 */
			createBLEConnection(deviceId, sn) {
				this.retryCount = 0
				const tryConnect = () => {
					this.retryCount++
					uni.createBLEConnection({
						deviceId: deviceId.trim(),
						success: () => this.handleConnectionSuccess(deviceId, sn),
						fail: (err) => this.handleConnectionFail(err, deviceId, sn, tryConnect)
					})
				}

				tryConnect()
			},

			/**
			 * 连接成功
			 */
			handleConnectionSuccess(deviceId, sn) {
				uni.hideLoading()
				this.$refs.popup1?.open('center')
				setTimeout(() => {
					this.getBLEDeviceServices(deviceId, sn)
				}, 2000)
			},

			/**
			 * 连接失败处理
			 */
			handleConnectionFail(err, deviceId, sn, retryFn) {
				console.error(`连接失败(${this.retryCount}/${BLE_CONSTANTS.MAX_RETRY}):`, err)

				this.cleanupConnection(deviceId, sn)

				if (this.retryCount < BLE_CONSTANTS.MAX_RETRY) {
					setTimeout(retryFn, BLE_CONSTANTS.RETRY_DELAY)
				} else {
					uni.showToast({
						title: this.$t('连接超时'),
						icon: 'none'
					})
					this.img_scan = true
					this.unbindDevice(sn)
					uni.hideLoading()
				}
			},

			/**
			 * 清理连接资源
			 */
			cleanupConnection(deviceId, sn) {
				this.unbindDevice(sn)
				uni.closeBLEConnection({
					deviceId
				})
				uni.hideLoading()
				uni.closeBluetoothAdapter()
				uni.openBluetoothAdapter()
			},

			/**
			 * 解绑设备
			 */
			unbindDevice(deviceSn) {
				uni.request({
					url: this.$url_APP_IP + this.$url_getunbind,
					method: 'POST',
					data: {
						deviceSn
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
						'content-type': 'application/x-www-form-urlencoded'
					}
				})
			},

			// ==================== 蓝牙通信 ====================

			/**
			 * 获取BLE服务
			 */
			getBLEDeviceServices(deviceId, sn) {
				uni.getBLEDeviceServices({
					deviceId,
					success: (res) => {
						if (res.services.length === 3) {
							this.getBLECharacteristics(deviceId, res.services[1].uuid, sn)
						}
					}
				})
			},

			/**
			 * 获取特征值
			 */
			getBLECharacteristics(deviceId, serviceId, sn) {
				uni.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success: (res) => {
						for (const char of res.characteristics) {
							if (char.properties.write) {
								this.writeuuid = char.uuid
								// this.sendFactoryCommand(deviceId, serviceId, char.uuid, sn)
								this.sendInitialCommand(deviceId, serviceId, char.uuid)
								this.sendBindCommand(deviceId, serviceId, char.uuid, sn)
								this.sendTimeCommand(deviceId, serviceId, char.uuid)
							}
						}
						this.setacktypes(0)
					}
				})
			},

			/**
			 * 恢复出厂设置命令
			 */
			sendFactoryCommand(deviceId, serviceId, charId) {
				const buffer = this.hexToArrayBuffer('e00006f4020109000101')
				this.writeBLEValue(deviceId, serviceId, charId, buffer, 'writeNoResponse')
			},

			/**
			 * 发送初始命令
			 */
			sendInitialCommand(deviceId, serviceId, charId) {
				const buffer = this.hexToArrayBuffer('e00006e7000000000100')
				this.writeBLEValue(deviceId, serviceId, charId, buffer, 'writeNoResponse')
			},

			/**
			 * 发送绑定命令
			 */
			sendBindCommand(deviceId, serviceId, charId, sn) {
				const snBytes = this.snToBytes(sn)
				const command = this.buildCommand(BLE_CONSTANTS.CMD_BIND, BLE_CONSTANTS.KEY_BIND, snBytes)

				setTimeout(() => {
					this.writeBLECommand(deviceId, serviceId, charId, command, 'writeNoResponse')
				}, 2000)
			},

			/**
			 * 发送时间同步命令
			 */
			sendTimeCommand(deviceId, serviceId, charId) {
				const timeBytes = this.getTimeBytes()
				const command = this.buildCommand(BLE_CONSTANTS.CMD_TIME, BLE_CONSTANTS.KEY_TIME, timeBytes)

				setTimeout(() => {
					this.writeBLECommand(deviceId, serviceId, charId, command, 'writeNoResponse')
				}, 3000)
			},

			/**
			 * 构建蓝牙命令
			 */
			buildCommand(cmd, key, data) {
				const len = data.length
				const cmdLen = len + 5
				const command = new Uint8Array(len + 8)

				command[0] = BLE_CONSTANTS.ACK_HEADER
				command[1] = (cmdLen >> 8) & 0xFF
				command[2] = cmdLen & 0xFF
				command[3] = cmd
				command[4] = BLE_CONSTANTS.PROTOCOL_VERSION
				command[5] = key
				command[6] = (len >> 8) & 0xFF
				command[7] = len & 0xFF
				command.set(data, 8)

				return command
			},

			/**
			 * SN转字节数组
			 */
			snToBytes(sn) {
				return new Uint8Array([
					parseInt(sn.slice(0, 2), 16),
					parseInt(sn.slice(2, 4), 16),
					parseInt(sn.slice(4, 6), 16),
					parseInt(sn.slice(6, 8), 16),
					parseInt(sn.slice(8, 10), 16),
					parseInt(sn.slice(10, 12), 16),
					parseInt(sn.slice(12, 14), 16),
					parseInt(sn.slice(14, 16), 16)
				])
			},

			/**
			 * 获取时间字节
			 */
			getTimeBytes() {
				const now = new Date()
				return new Uint8Array([
					(((now.getFullYear() - 2000) << 2) + ((now.getMonth() + 1) >> 2)) & 0xFF,
					(((now.getMonth() + 1) & 0x03) << 6) + (now.getDate() << 1) + (now.getHours() >> 4),
					(((now.getHours() & 0x0F) << 4) + (now.getMinutes() >> 2)) & 0xFF,
					(((now.getMinutes() & 0x03) << 6) + now.getSeconds()) & 0xFF
				])
			},

			/**
			 * 写入BLE命令（带校验和）
			 */
			writeBLECommand(deviceId, serviceId, charId, command, writeType) {
				const checksum = this.calculateChecksum(command)
				const finalCmd = new Uint8Array(command.length + 1)

				finalCmd.set(command.subarray(0, 3), 0)
				finalCmd[3] = checksum
				finalCmd.set(command.subarray(3), 4)

				const hexStr = Array.from(finalCmd)
					.map(b => b.toString(16).padStart(2, '0'))
					.join('')

				this.writeBLEValue(deviceId, serviceId, charId, this.hexToArrayBuffer(hexStr), writeType)
			},

			/**
			 * 计算校验和
			 */
			calculateChecksum(bytes) {
				return bytes.reduce((sum, byte) => sum + byte, 0) % 256
			},

			/**
			 * 写入BLE特征值
			 */
			writeBLEValue(deviceId, serviceId, charId, buffer, writeType) {
				uni.writeBLECharacteristicValue({
					deviceId,
					serviceId,
					characteristicId: charId,
					writeType,
					value: buffer
				})
			},

			/**
			 * Hex字符串转ArrayBuffer
			 */
			hexToArrayBuffer(hex) {
				const buffer = new ArrayBuffer(hex.length / 2)
				const view = new DataView(buffer)
				for (let i = 0; i < hex.length; i += 2) {
					view.setUint8(i / 2, parseInt(hex.substr(i, 2), 16))
				}
				return buffer
			},

			// ==================== 工具方法 ====================

			/**
			 * 打开蓝牙设置
			 */
			openBluetoothSettings() {
				// #ifdef APP-PLUS
				if (PLATFORM === 'android') {
					const main = plus.android.runtimeMainActivity()
					const Intent = plus.android.importClass('android.content.Intent')
					const Settings = plus.android.importClass('android.provider.Settings')
					main.startActivity(new Intent(Settings.ACTION_BLUETOOTH_SETTINGS))
				} else if (PLATFORM === 'ios') {
					plus.runtime.launchApplication({
						action: 'App-Prefs:root=BLE'
					})
				}
				// #endif
			},

			/**
			 * 确认配对成功
			 */
			turesss() {
				uni.hideLoading()
				this.$refs.popup1?.close()
				if (this.modelname === 'BPW6') {
					this.setacktypes6(0)
					uni.reLaunch({
						url: `../../Bind/Bing_page/Bind_success?modelId=${this.BPW6model}`
					})
					return
				}
				this.setacktypes(0)
				uni.reLaunch({
					url: `../../Bind/Bing_page/Bind_success?modelId=${this.BPW1model}`
				})
			},

			/**
			 * 清理资源
			 */
			cleanup() {
				this.setDeviceBindingActive(false)
				clearInterval(this.scanTimer)
				uni.stopBluetoothDevicesDiscovery()
				uni.closeBLEConnection()
				uni.closeBluetoothAdapter()
			}
		}
	}
</script>

<style scoped lang="scss">
	.backpage {
		color: #000;
		background: #F7F7F7;
		min-height: 100vh;
	}

	.img_scansty {
		width: 100%;
		height: 220px;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}

	.img_scansty_1 {
		padding: 20px 20px 0;
	}

	.imgss {
		width: 90vw;
		height: 180px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		border-radius: 10px;
		padding-top: 10px;
		padding-bottom: 30px;
	}

	.imgss1 {
		width: 80vw;
		height: 100%;
		object-fit: contain;
		padding-top: 20px;
	}

	.Model_number {
		text-align: center;
		margin-top: 20px;
		font-size: 12px;
		font-weight: bold;
	}

	.Message {
		height: 22px;
		margin-top: 50px;
		text-align: center;
		font-size: 12px;
		color: red;
	}

	.Message1 {
		height: 22px;
		text-align: center;
		font-size: 12px;
	}

	.device-images {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.imgss_sc {
		width: 120px;
		height: 120px;
		object-fit: contain;
		padding-top: 20px;
	}

	.Messageback {
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		background: #F7F7F7;
		padding: 0 20px;
	}

	.button_style {
		width: 100%;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		border-radius: 30px;
		background: #3298F7;
		color: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.button_style1 {
		width: 100%;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		border-radius: 30px;
		background: #3298F7;
		color: #fff;
		margin-top: 20px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.button_style2 {
		width: 80%;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		border-radius: 30px;
		background: #3298F7;
		color: #fff;
		margin-top: 20px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	// 弹窗样式
	.popup-content {
		background: #fff;
		border-radius: 20px;
		padding: 20px;
		margin: 20px;
	}

	.popup-title {
		font-size: 16px;
		color: #000;
		text-align: center;
		font-weight: 600;
	}

	.popup-input {
		border: 1px solid #999;
		margin: 10px 0;
		height: 48px;
		text-align: center;
		border-radius: 4px;
	}

	.btn-confirm {
		background: #3298F7;
		margin: 20px 0;
		color: #fff;
		border-radius: 4px;
	}

	.btn-cancel {
		background: #ff4d4f;
		margin: 20px 0;
		color: #fff;
		border-radius: 4px;
	}

	.popupstusdsd_2 {
		background: #fff;
		border-radius: 20px;
		padding: 20px;
		margin: 60px 20px;
		text-align: center;
	}

	.popup-body {
		padding: 10px 0 40px;
	}

	.popupstusdsditem {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.popupstusdsditem_1 {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.butonstsd {
		margin: 10px 50px 20px;
		border-radius: 20px;
		background: #3298F7;
		color: #fff;
	}
</style>