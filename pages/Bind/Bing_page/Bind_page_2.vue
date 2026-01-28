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
	</view>
</template>

<script>
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
			};
		},

		onLoad(res) {
			console.log(JSON.stringify(res))
			this.SELECT_TYPE = res.SELECT_TYPE
			this.modelConnectType = res.modelConnectType
			this.modelname = res.name
			uni.setNavigationBarTitle({
				title: this.$t("绑定设备")
			})
		},

		onShow() {
			this.resetState();
			if (this.locationChecked) return; // 已经跑过就不再跑
			this.locationChecked = true;
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
					console.log(match)
					if (match && match[1]) {
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
								console.log(data.deviceSn)
								console.log(resultmac)
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
					uni.navigateTo({
						url: "../../Bind/Bing_xueya/Bing_xueya_LY?SELECT_TYPE=" + this.SELECT_TYPE + "&sn=" + this
							.context_msg1 + "&modelname=" + this.modelname + "&modelId=" + modelId
					})
				} else if (this.modelConnectType == 2) {
					uni.navigateTo({
						url: "../../Bind/Bing_xueya/Bing_xueya?SELECT_TYPE=" + this.SELECT_TYPE + "&sn=" + this
							.context_msg1 + "&modelname=" + this.modelname + "&modelId=" + modelId
					})
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
</style>