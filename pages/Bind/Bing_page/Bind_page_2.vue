<template>
	<view class="backpage">
		<view v-if="img_scan" class="img_scansty">
			<app-scan ref="appScan" @getCode="getCode" />
		</view>
		<view v-else class="img_scansty_1">
			<view class="imgss">
				<image lazy-load class="imgss1" mode="aspectFit" :src="scan_img" />
			</view>
			<view class="Model_number">{{ xinghao }}</view>
			<view v-if="img_scan===false" class="Message1">{{ context_msg }}</view>
		</view>
		<view v-if="img_scan" class="Message">{{modelname ==="BPW1"?$t("扫描手表里边的二维码"):$t("扫描设备背面的二维码")}}</view>
		<button class="button_style1" @click="ButtonTap()">{{$t("输入设备码")}}</button>
		<view v-if="modelname==='BPW1'"
			style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao2.jpg" />
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao1.jpg" />
		</view>
		<view v-else-if="modelname==='JL-S260'||modelname==='JL-S100'"
			style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_tz.jpg" />
		</view>
		<view v-else style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_xy.jpg" />
		</view>
		<view class="Messageback">
			<button class="button_style" @click="True_Bind()">{{$t("确认绑定")}}</button>
			<button class="button_style1" @click="unbind()">{{$t("暂不绑定")}}</button>
		</view>
		<!-- 手动输入弹窗 -->
		<uni-popup ref="qiehuanpopup" type="center" :mask-click="true">
			<view class="popup-content">
				<view style="font-size:16px;color:black;text-align: center;font-weight: 600;">
					{{ $t('手动输入') }}
				</view>
				<input v-model="inputcontext" :placeholder="$t('输入设备码')"
					style="border:1px solid gray;margin:10px;height:48px;text-align:center;">
				<button style="background: #3298F7;margin:20px;color: white;"
					@click="shoudongbtn()">{{$t("确定")}}</button>
				<button style="background: red;margin:20px;color: white;"
					@click="shoudongbtncancle()">{{$t("取消")}}</button>
			</view>
		</uni-popup>
		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" :mask-click="true">
				<view class="popup-content">
					{{$t("允许使用摄像头")}}
				</view>
			</uni-popup>
		</view>

		<view>
			<uni-popup ref="popup1" :mask-click="true">
				<view class="popupstusdsd_2">
					<view style="padding: 10px 0 40px 0">
						<view class="popupstusdsditem">{{$t("配对成功")}}</view>
						<view class="popupstusdsditem_1">{{$t("蓝牙已连接成功")}}</view>
						<view>{{$t("标准蓝牙提示")}}</view>
					</view>
					<button @tap="turesss()" class="butonstsd">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>

	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	const platform = uni.getSystemInfoSync().platform;
	import appScan from "../../../uni_modules/simbalkj-scan/components/simbalkj-scan/appScan.vue"
	const lan = uni.getLocale();
	const modelIdToImagePathzh = {
		30000: "/static/image/BPW1.png", // 手表
		30001: "/static/image/BPW1.png", // 手表
		20000: "/static/image/tizhi1.jpg", // 体脂秤
		20001: "/static/image/tizhi1.jpg", // 体脂秤
		10000: "/static/image/xueya1.png", // 血压计
		10001: "/static/image/xueya1.png", // 血压计
		10002: "/static/image/xueya1.png", // 血压计
		10003: "/static/image/xueya1.png", // 血压计
		10004: "/static/image/xueya1.png", // 血压计
		10005: "/static/image/xueya1.png", // 血压计
		10006: "/static/image/xueya1.png", // 血压计
	};
	const modelIdToImagePath = {
		30000: "/static/image/shoubiao1.png", // 手表
		30001: "/static/image/shoubiao1.png", // 手表
		20000: "/static/image/tizhi1.jpg", // 体脂秤
		20001: "/static/image/tizhi1.jpg", // 体脂秤
		10000: "/static/image/xueya1.png", // 血压计
		10001: "/static/image/xueya1.png", // 血压计
		10002: "/static/image/xueya1.png", // 血压计
		10003: "/static/image/xueya1.png", // 血压计
		10004: "/static/image/xueya1.png", // 血压计
		10005: "/static/image/xueya1.png", // 血压计
		10006: "/static/image/xueya1.png", // 血压计
	};
	import {
		checkNotificationPermissions
	} from "../../api/unitls/permission.js";
	export default {
		components: {
			appScan
		},
		data() {
			return {
				img_scan: true,
				scan_img: "../../../static/image-active.png",
				xinghao: '',
				context_msg: this.$t('请将条码放入扫码框内即可自动扫描'),
				modelConnectType: '',
				SELECT_TYPE: '',
				modelname: '',
				context_msg1: "",
				modelId: '',
				inputcontext: '',
				locationChecked: false, // 标记位
				BPW1deviceId: "",
				BPW1model: '30000',
			};
		},

		onLoad(res) {
			// console.log(JSON.stringify(res))
			this.SELECT_TYPE = res.SELECT_TYPE
			this.modelConnectType = res.modelConnectType
			this.modelname = res.name
			uni.setNavigationBarTitle({
				title: this.$t("绑定设备")
			})

		},

		onShow() {
			uni.closeBluetoothAdapter();
			this.resetState();
			if (this.locationChecked) return; // 已经跑过就不再跑
			this.locationChecked = true;
			uni.openBluetoothAdapter({
				success: (openBluetoothAdapter) => {
					console.log("openBluetoothAdapter", openBluetoothAdapter)
				},
				fail: (openBluetoothAdaptererr) => {
					uni.hideLoading()
					if (openBluetoothAdaptererr.errCode === 10001) {
						uni.showModal({
							content: this.$t("当前蓝牙未开启是否去设置打开"),
							showCancel: false,
							success: (modalres) => {
								if (modalres.confirm) {
									this.openBLE();
								}
							}
						});
					}
				}
			});
			this.openLocationServiceAndroid();
			this.$nextTick(() => {
				plus.android.checkPermission("android.permission.CAMERA", (granted) => {
					if (granted.checkResult !== 0) {
						this.$refs.popup.open('top');
					} else {
						setTimeout(() => {
							this.locationChecked = false;
							this.$refs.popup?.close(); // 可选链，防止再次报错
						}, 3000);
					}
				});
			});
		},

		mounted() {
			// 手动监听弹窗关闭
			this.$refs.qiehuanpopup.$on('change', (e) => {
				if (e.show === false) {
					this.onClosePopup();
				}
			});
		},

		methods: {
			...mapMutations(['setacktypes']),
			// #ifdef APP-PLUS
			openLocationServiceAndroid() {
				let system = uni.getSystemInfoSync();
				if (system.platform === 'android') {
					// 导入Android原生类
					var Context = plus.android.importClass("android.content.Context");
					var LocationManager = plus.android.importClass("android.location.LocationManager");
					var Intent = plus.android.importClass("android.content.Intent");
					var Settings = plus.android.importClass("android.provider.Settings");
					// 获取主Activity和定位服务
					var mainActivity = plus.android.runtimeMainActivity();
					var locationService = mainActivity.getSystemService(Context.LOCATION_SERVICE);
					// 检查GPS是否开启
					if (!locationService.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
						uni.showModal({
							title: this.$t("提示"),
							content: this.$t("您的手机定位服务未开启"),
							confirmText: this.$t("去开启"),
							cancelText: this.$t("暂不开启"),
							success: (res) => {
								if (res.confirm) {
									// 跳转到系统定位服务设置页面
									var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
									mainActivity.startActivity(intent);
									uni.setStorageSync("dingwei", 1)
								} else {
									uni.navigateBack()
									uni.setStorageSync("dingwei", 0)
								}
							}
						});
					} else {
						uni.setStorageSync("dingwei", 1)
						checkNotificationPermissions();
						if (uni.getStorageSync("appQX") !== "1") {
							uni.showModal({
								title: this.$t("提示"),
								content: this.$t("需要获取您手机定位权限和附近设备权限"),
								confirmText: this.$t("去开启"),
								cancelText: this.$t("暂不开启"),
								success: (res) => {
									if (res.confirm) {
										// 跳转到系统定位服务设置页面
										// #ifdef APP-PLUS
										const main = plus.android.runtimeMainActivity()
										const Intent = plus.android.importClass('android.content.Intent')
										const Uri = plus.android.importClass('android.net.Uri')
										const uri = Uri.fromParts('package', main.getPackageName(), null)
										const intent = new Intent(
											'android.settings.APPLICATION_DETAILS_SETTINGS', uri)
										intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
										main.startActivity(intent)
										// #endif
									} else {
										uni.navigateBack()
									}
								}
							});
						}
					}
				}
			},
			// #endif

			ButtonTap() {
				this.img_scan = false
				this.$refs.qiehuanpopup.open("center")
			},

			onClosePopup() {
				this.resetState()
			},
			formatMacAddress(mac) {
				// 移除可能存在的分隔符
				mac = mac.replace(/[^a-fA-F0-9]/g, '');
				// 每2个字符添加冒号
				return mac.match(/.{1,2}/g).join(':').toUpperCase();
			},
			shoudongbtn() {
				if (!this.inputcontext) {
					uni.showToast({
						title: this.$t("输入设备码"),
						icon: "none"
					})
					return
				} else {
					if (this.modelname === "BPW1") {
						// const resultStr = this.inputcontext.replace(/:/g, '');
						const resultStr1 = this.inputcontext.slice(0, 4)
						if (resultStr1 === "4142") {
							this.context_msg = "300000" + this.inputcontext
							this.BPW1deviceId = this.formatMacAddress(this.inputcontext)
							// console.log("this.inputcontext", this.BPW1deviceId)
							this.get_device_info()
							this.$refs.qiehuanpopup?.close()
						} else {
							uni.showToast({
								title: this.$t("选中的设备与扫码设备不匹配"),
								icon: "none"
							})
						}
					} else {
						this.context_msg = this.inputcontext
						this.get_device_info()
						this.$refs.qiehuanpopup?.close()
					}
				}
			},

			shoudongbtncancle() {
				this.$refs.qiehuanpopup?.close()
				this.resetState()
			},

			resetState() {
				if (Vue.prototype.$globalTimers.heartbeatInterval) {
					clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
					Vue.prototype.$globalTimers.heartbeatInterval = null;
				}
				this.img_scan = true;
				this.scan_img = "../../../static/image-active.png";
				this.xinghao = '';
				this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
				this.context_msg1 = "";
				this.modelId = '';
				this.inputcontext = ''
			},

			getCode(barNumber) {
				if (this.modelname === "BPW1") {
					const regex = /para=([^&]+)/;
					const match = barNumber.match(regex);
					// console.log(match)
					if (match && match[1]) {
						this.BPW1deviceId = match[1]
						const resultStr = match[1].replace(/:/g, '');
						const resultStr1 = resultStr.slice(0, 4)
						if (resultStr1 === "4142") {
							this.context_msg = "300000" + resultStr
							// this.jakoblife_fat_scale("300000" + resultStr, match[1])
						} else {
							this.context_msg = match[1]
						}
						this.img_scan = false
						this.get_device_info()
					} else {
						this.context_msg = barNumber
						this.img_scan = false
						this.get_device_info()
						console.log('para 的值未找到', barNumber.slice(6, barNumber.length));
					}
				} else {
					this.context_msg = barNumber
					this.img_scan = false
					this.get_device_info()
				}
			},

			jakoblife_fat_scale(deviceSn, mac) {
				const data = {
					deviceSn: deviceSn,
					mac: mac,
					deviceTypeId: "2",
					slaveData: {},
					time: this.datatime(this.dundatetime())
				}
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					console.log("上报数据手表", res)
					this.context_msg = deviceSn
					this.img_scan = false
					this.get_device_info()
				}).catch(errro => {
					console.log("errro", errro)
				})
			},
			dundatetime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now
					.getMonth() + 1;
				const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
				const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
				const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
				const timesssaa = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
				return timesssaa
			},
			datatime(dateStr) {
				let date = new Date(dateStr);
				let timestamp = date.getTime();
				let timestampInSeconds = Math.floor(timestamp / 1000);
				return timestampInSeconds
			},
			True_Bind() {
				if (this.context_msg === this.$t('请将条码放入扫码框内即可自动扫描')) {
					uni.showToast({
						title: this.$t('请扫描设备的设备码'),
						icon: 'none'
					})
					return
				}
				this.queryDevices()

			},
			unbind() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			},
			//获取设备基础信息
			get_device_info() {
				const data = {
					deviceSn: this.context_msg
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_info, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code === 200) {
						if (res.data.model === this.modelname) {
							if (res.data.model === "BPW1" && res.data.mac) {
								const resultmac = data.deviceSn.slice(6, data.deviceSn.length);
								if (resultmac === res.data.deviceSn.slice(6, res.data.deviceSn.length)) {
									this.img_scan = false;
									this.xinghao = this.$t("型号") + res.data.model;
									this.context_msg = "SN:" + res.data.deviceSn;
									this.context_msg1 = res.data.deviceSn;
									this.modelId = res.data.modelId;
									this.updateScanImagePath(res.data.picturePath);
								} else {
									this.img_scan = true;
									uni.showToast({
										title: this.$t("选中的设备与扫码设备不匹配"),
										icon: "none"
									});
									this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
								}
							} else {
								this.img_scan = false;
								this.xinghao = this.$t("型号") + res.data.model;
								this.context_msg = "SN:" + res.data.deviceSn;
								this.context_msg1 = res.data.deviceSn;
								this.modelId = res.data.modelId;
								this.updateScanImagePath(res.data.picturePath);
							}
						} else {
							this.img_scan = true;
							uni.showToast({
								title: this.$t("选中的设备与扫码设备不匹配"),
								icon: "none"
							});
							this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
						}
					} else {
						this.img_scan = true;
						uni.showToast({
							title: this.$t("选中的设备与扫码设备不匹配"),
							icon: 'none'
						});
						this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');

					}
				})
			},
			updateScanImagePath(picturePath) {
				if (picturePath) {
					if (lan === 'zh-Hans' || lan === 'zh-Hant') {
						// this.scan_img = this.$url_APP_IP + picturePath;
						this.scan_img = modelIdToImagePathzh[this.modelId];
					} else {
						this.scan_img = modelIdToImagePath[this.modelId];
					}
				} else {
					this.scan_img = modelIdToImagePath[this.modelId];
				}
			},

			queryDevices() {
				this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						if (res.rows.length === 0) {
							this.navigateTo(this.modelId);
						} else {
							const deviceExists = res.rows.some(item => item.deviceSn === this.context_msg1);
							if (deviceExists) {
								uni.showToast({
									title: this.$t("当前主页面已绑定该设备"),
									icon: 'none'
								});
								uni.setStorageSync("deviceSn", this.context_msg1);
								uni.switchTab({
									url: '/pages/tabBar/main/Main'
								});
							} else {
								this.navigateTo(this.modelId);
							}
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})
			},

			navigateTo(modelId) {
				if (this.modelConnectType == 0) {
					this.bind_device(this.context_msg1, "", modelId);
				} else if (this.modelConnectType == 1) {
					if (this.modelname === "BPW1") {
						this.BPW1model = modelId
						this.BPW1binddevice(this.context_msg1, this.BPW1deviceId, modelId);
					} else {
						uni.navigateTo({
							url: "../../Bind/Bing_xueya/Bing_xueya_LY?SELECT_TYPE=" + this.SELECT_TYPE + "&sn=" +
								this.context_msg1 + "&modelname=" + this.modelname + "&modelId=" + modelId
						})
					}
				} else if (this.modelConnectType == 2) {
					uni.navigateTo({
						url: "../../Bind/Bing_xueya/Bing_xueya?SELECT_TYPE=" + this.SELECT_TYPE + "&sn=" + this
							.context_msg1 + "&modelname=" + this.modelname + "&modelId=" + modelId
					})
				}
			},

			// BPW1手表设备绑定
			BPW1binddevice(sn, MACdeviceID, modelId) {
				let data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				};
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					// console.log(res)
					if (res.code === 200) {
						uni.setStorageSync("appQX", "1")
						uni.setStorageSync("deviceSn", sn);
						uni.showLoading({
							title: this.$t("连接中"),
							mask: true
						})
						uni.openBluetoothAdapter({
							success: (res) => {
								uni.startBluetoothDevicesDiscovery({
									allowDuplicatesKey: true,
									success: () => {
										this.onDeviceFound(MACdeviceID, sn)
									},
									fail: e => console.log("开始扫描失败", e),
								});
							},
							fail: (err) => {
								uni.hideLoading()
								if (err.errCode === 10001) {
									uni.showModal({
										content: this.$t("当前蓝牙未开启是否去设置打开"),
										showCancel: false,
										success: (modalres) => {
											if (modalres.confirm) {
												this.openBLE();
											}
										}
									});
								}
							}
						});
						this.setacktypes(0)
					} else if (res.code === 401) {
						uni.showToast({
							title: this.$t("此设备已被其他账号绑定"),
							icon: 'none'
						})
						return
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail"
						});
					}
				}).catch(erro => {
					uni.reLaunch({
						url: "../Bing_page/Bind_fail"
					});
				})
			},
			onDeviceFound(MACdeviceID, sn) {
				console.log(MACdeviceID, sn)
				let that = this
				let timersdsa = 0
				let tiersds = null
				let bioshi = 0
				uni.onBluetoothDeviceFound((res) => {
					const deviceArray = res.devices;
					for (const item of deviceArray) {
						let idList = []
						idList.push(item);
						if (idList[0].name === "BPW1" && idList[0].deviceId === MACdeviceID) {
							uni.stopBluetoothDevicesDiscovery({
								success: (res) => {
									bioshi = 1
									setTimeout(() => {
										that.createBLEConnection(idList[0].deviceId, sn)
									}, 5000)
									console.log("stopBluetoothDevicesDiscovery", res)
								}
							})
						}
					}
				});
				tiersds = setInterval(() => {
					timersdsa++
					if (timersdsa === 12 && bioshi === 0) {
						clearInterval(tiersds)
						tiersds = null
						uni.stopBluetoothDevicesDiscovery();
						uni.showToast({
							title: that.$t("连接超时"),
							icon: "none"
						})
					}
				}, 1000)
			},

			createBLEConnection(deviceId, sn) {
				const MAX_RETRY_ATTEMPTS = 3;
				let attemptCount = 0;
				const executeConnection = () => {
					attemptCount++;
					uni.createBLEConnection({
						deviceId: deviceId.trim(),
						// timeout: 8000,
						success: (res) => this.handleConnectionSuccess(deviceId, sn),
						fail: (error) => this.handleConnectionFailure(error, deviceId, sn, attemptCount,
							MAX_RETRY_ATTEMPTS, executeConnection)
					});
				};
				executeConnection();
			},

			// 连接成功处理
			handleConnectionSuccess(deviceId, sn) {
				let that = this
				uni.hideLoading();
				if (that.$refs.popup1 && that.$refs.popup1.close) {
					that.$refs.popup1.open("center");
				}
				setTimeout(() => {
					that.getBLEDeviceServices(deviceId, sn);
				}, 2000);
			},

			// 连接失败处理
			handleConnectionFailure(error, deviceId, sn, currentAttempt, maxAttempts, retryCallback) {
				console.error(`BLE连接失败 (尝试 ${currentAttempt}/${maxAttempts}):`, JSON.stringify(error), deviceId);
				// 清理资源
				this.cleanupBLEConnection(deviceId, sn);
				// 根据错误码决定是否重试
				const shouldRetry = this.shouldRetryConnection(error.errCode, currentAttempt, maxAttempts);
				if (shouldRetry) {
					const delay = error.errCode === 10012 ? 2000 : 2000; // 可根据错误码调整延迟
					setTimeout(retryCallback, delay);
				}
				if (currentAttempt === 3) {
					uni.showToast({
						title: this.$t("连接超时"),
						icon: "none"
					})
				}
			},

			// 判断是否应重试连接
			shouldRetryConnection(errCode, currentAttempt, maxAttempts) {
				if (currentAttempt >= maxAttempts) {
					return false;
				}
				// 10002: 设备未找到，通常需要重置适配器后重试
				// 10012: 连接超时，需要重试
				// 其他错误也尝试重试一次
				const retryableErrors = [10002, 10012];
				return retryableErrors.includes(errCode) || true; // 默认允许重试
			},

			// 清理BLE连接资源
			cleanupBLEConnection(deviceId, sn) {
				// 解绑设备
				this.getunbind(sn);
				// 关闭连接
				uni.closeBLEConnection({
					deviceId: deviceId
				});
				// 隐藏加载
				uni.hideLoading();
				// 重置蓝牙适配器
				uni.closeBluetoothAdapter();
				uni.openBluetoothAdapter();
			},




			//获取蓝牙外围设备的服务
			getBLEDeviceServices(deviceId, sn) {
				let that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						switch (res.services.length) {
							case 3:
								that.getBLEDeviceCharacteristics3(deviceId, res.services[1].uuid, sn)
								break
						}
					},
					fail(res) {}
				})
			},
			getBLEDeviceCharacteristics3(deviceId, serviceId, sn) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								let buffer = that.toArrayBuffer("e00006e7000000000100")
								uni.writeBLECharacteristicValue({
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									writeType: "writeNoResponse",
									value: buffer,
									success: (writeres) => {
										that.writeuuid = item.uuid
									},
									fail: (writeerr) => {
										that.writeuuid = item.uuid
									}
								});
							}
							that.setacktypes(0)
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败222', res)
					}
				})
			},
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
			// 定义一个函数来计算校验和
			calculateChecksumsss2(deviceId, serviceId, writeuuid, sn) {
				const ACK_HEADER = 0xe0; // 常量-头部
				const BleDeviceConfig = {
					PROTOCOL_VERSION: 0x00 // 协议版本号
				};
				const bindcommandId = 0x08; // CMD-协议命令
				const bindcommandKey = 0x00; // key-协议子命令
				const bindbtys = new Uint8Array([
					parseInt(sn.slice(0, 2), 16),
					parseInt(sn.slice(2, 4), 16),
					parseInt(sn.slice(4, 6), 16),
					parseInt(sn.slice(6, 8), 16),
					parseInt(sn.slice(8, 10), 16),
					parseInt(sn.slice(10, 12), 16),
					parseInt(sn.slice(12, 14), 16),
					parseInt(sn.slice(14, 16), 16)
				]);
				const binddataLen = bindbtys.length;
				const bindcommand = new Uint8Array(binddataLen + 8);
				bindcommand[0] = ACK_HEADER;
				bindcommand[1] = ((5 + binddataLen) >> 8) & 0xFF;
				bindcommand[2] = (5 + binddataLen) & 0xFF;
				bindcommand[3] = bindcommandId;
				bindcommand[4] = BleDeviceConfig.PROTOCOL_VERSION;
				bindcommand[5] = bindcommandKey;
				bindcommand[6] = (binddataLen >> 8) & 0xFF;
				bindcommand[7] = binddataLen & 0xFF;
				bindcommand.set(bindbtys, 8);
				setTimeout(() => {
					this.writeBLECommand(deviceId, serviceId, writeuuid, bindcommand, platform ===
						"android" ? 'writeNoResponse' : 'write',
						(res) => console.log("绑定设备成功：", res),
						(err) => console.log("绑定设备失败：", err)
					);
				}, 2000);
				const commandId = 0x02; // CMD-协议命令
				const commandKey = 0x08; // key-协议子命令
				const now = new Date();
				const bytes1 = new Uint8Array([
					(((now.getFullYear() - 2000) << 2) + ((now.getMonth() + 1) >> 2)) & 0xFF,
					(((now.getMonth() + 1) & 0x03) << 6) + (now.getDate() << 1) + (now.getHours() >> 4),
					(((now.getHours() & 0x0F) << 4) + (now.getMinutes() >> 2)) & 0xFF,
					(((now.getMinutes() & 0x03) << 6) + now.getSeconds()) & 0xFF
				]);
				const dataLen = bytes1.length;
				const command = new Uint8Array(dataLen + 8);
				command[0] = ACK_HEADER;
				command[1] = ((5 + dataLen) >> 8) & 0xFF;
				command[2] = (5 + dataLen) & 0xFF;
				command[3] = commandId;
				command[4] = BleDeviceConfig.PROTOCOL_VERSION;
				command[5] = commandKey;
				command[6] = (dataLen >> 8) & 0xFF;
				command[7] = dataLen & 0xFF;
				command.set(bytes1, 8);
				setTimeout(() => {
					this.writeBLECommand(deviceId, serviceId, writeuuid, command, "writeNoResponse",
						(res) => {
							console.log("时间命令数据回复成功：", res);
						},
						(err) => {
							console.log("时间命令数据回复失败：", res);
						}
					);
				}, 3000);
			},
			calculateChecksum11(bytes) {
				let sum = 0;
				bytes.forEach(byte => sum += byte);
				return sum % 256;
			},
			writeBLECommand(deviceId, serviceId, writeuuid, command, writeType, successCallback, failCallback) {
				const checksum = this.calculateChecksum11(command);
				const modifiedCommand = new Uint8Array(command.length + 1);
				modifiedCommand.set(command.subarray(0, 3), 0);
				modifiedCommand[3] = checksum;
				modifiedCommand.set(command.subarray(3), 4);
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const buffer = this.toArrayBuffer(hexCommand);
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: writeuuid,
					writeType: writeType,
					value: buffer,
					success: successCallback,
					fail: failCallback
				});
			},
			//确认按钮
			turesss() {
				uni.hideLoading()
				let that = this
				that.$refs.popup1.close();
				that.setacktypes(0)
				uni.reLaunch({
					url: "../../Bind/Bing_page/Bind_success?modelId=" + that
						.BPW1model
				})
			},
			getunbind(deviceSn) {
				uni.request({
					url: this.$url_APP_IP + this.$url_getunbind,
					method: 'POST',
					data: {
						deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token'),
						'content-type': 'application/x-www-form-urlencoded'
					},
				});
			},

			openBLE() {
				this.checked = false
				if (platform === "android") {
					const main = plus.android.runtimeMainActivity();
					const Intent = plus.android.importClass("android.content.Intent");
					const mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
					main.startActivity(mIntent);
				} else if (platform === "ios") {
					plus.runtime.launchApplication({
						action: 'App-Prefs:root=BLE'
					}, function(e) {});
				}
			},

			bind_device(sn, MACdeviceID, modelId) {
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				}
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(bind_device => {
					if (bind_device.code == 200) {
						uni.setStorageSync("deviceSn", sn);
						uni.navigateTo({
							url: `../Bing_page/Bind_success?modelId=${modelId}`
						});
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail?bindcode=" + bind_device.code
						});
					}
				})
			},
		}
	};
</script>

<style scoped lang="scss">
	.backpage {
		color: black;
		background: #F7F7F7;
		height: 100vh;
		width: 100vw;
	}

	.img_scansty {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 220px;
		z-index: 100;
		/* 确保低于弹窗的 z-index */
	}

	.img_scansty_1 {
		padding: 20px 20px 0 20px;
	}

	.imgss {
		padding-top: 10px;
		padding-bottom: 30px;
		width: 90vw;
		height: 180px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		background: white;
	}

	.imgss1 {
		padding-top: 20px;
		width: 80vw;
		display: flex;
		justify-content: center;
		align-items: center;
		object-fit: contain;
	}

	.Model_number {
		text-align: center;
		margin: 20px 0 0;
		font-size: 12px;
		font-weight: bold;
	}

	.Message {
		height: 22px;
		margin-top: 50px;
		text-align: center;
		font-size: 12px;
		font-weight: 400;
		color: red;
	}

	.Message1 {
		height: 22px;
		text-align: center;
		font-size: 12px;
		font-weight: 400;
		color: black;
	}

	.Messageback {
		position: fixed;
		bottom: 20px;
		width: 100vw;
		background: #F7F7F7;
	}

	.button_style {
		width: auto;
		height: 48px;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.button_style1 {
		width: auto;
		height: 48px;
		margin: 20px 20px 0 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		border-radius: 30px;
		background: #3298F7;
		color: #FFFFFF !important;
		border: none !important;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.imgss_sc {
		padding-top: 20px;
		width: 120px;
		height: 120px;
		display: flex;
		justify-content: center;
		align-items: center;
		object-fit: contain;
	}

	/* 弹窗内容样式 */
	.popup-content {
		background: #fff;
		border-radius: 20px;
		padding: 20px;
		margin: 20px;
		box-sizing: border-box;
	}

	// BPW1绑定弹窗样式
	.popupstusdsd_2 {
		border-radius: 20px;
		background: #fff;
		text-align: center;
		padding: 20px;
		margin: 60px 20px 60px 20px;
		z-index: 999999;
	}

	.popupstusdsd {
		border-radius: 20px;
		background: #fff;
		width: 80vw;
		text-align: center;
		margin: 0 40px 60px 40px;
	}

	.popupstusdsditem_1 {
		font-size: 18px;
		font-weight: bold;
	}

	.butonstsd {
		margin: 10px 50px 20px 50px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}
</style>