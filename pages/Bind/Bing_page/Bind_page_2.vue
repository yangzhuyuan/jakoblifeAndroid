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
		<view v-if="img_scan" class="Message">{{ context_msg }}</view>
		<view class="Messageback">
			<button class="button_style" @click="True_Bind()">{{$t("确认绑定")}}</button>
			<button class="button_style1" @click="unbind()">{{$t("暂不绑定")}}</button>
		</view>
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

			};
		},
		onLoad(res) {
			console.log(res)
			this.SELECT_TYPE = res.SELECT_TYPE
			this.modelConnectType = res.modelConnectType
			this.modelname = res.name
			uni.setNavigationBarTitle({
				title: this.$t("绑定设备")
			})
		},

		onShow() {
			this.resetState();
			// 检查存储权限
			plus.android.checkPermission("android.permission.CAMERA", (granted) => {
				if (granted.checkResult !== 0) {
					this.$refs.popup.open('top')
				}
			});
		},

		methods: {

			resetState() {
				this.img_scan = true;
				this.scan_img = "../../../static/image-active.png";
				this.xinghao = '';
				this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
				this.context_msg1 = "";
				this.modelId = '';
			},

			getCode(barNumber) {
				if (this.modelname === "BPW1") {
					const regex = /para=([^&]+)/;
					const match = barNumber.match(regex);
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
				console.log(data)
				this.$post(this.$url_jakoblife_fat_scale, data, {
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
				this.$post(this.$url_get_device_info, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						if (res.data.model === this.modelname) {
							if (res.data.model === "BPW1" && res.data.mac) {
								const resultmac = this.context_msg.slice(6, this.context_msg.length);
								if (resultmac === res.data.deviceSn.slice(6, res.data.deviceSn.length)) {
									this.img_scan = false;
									this.xinghao = this.$t("型号") + res.data.model;
									this.context_msg = this.modelConnectType === "0" ? "IMEI:" + res.data
										.deviceSn :
										"SN:" + res.data.deviceSn;
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
								this.context_msg = this.modelConnectType === "0" ? "IMEI:" + res.data.deviceSn :
									"SN:" + res.data.deviceSn;
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
							title: res.msg,
							icon: 'none'
						});
						this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');

					}
				})
			},
			updateScanImagePath(picturePath) {
				if (picturePath) {
					if (lan === 'zh-Hans') {
						this.scan_img = this.$url_APP_IP + picturePath;
					} else {
						this.scan_img = modelIdToImagePath[this.modelId];
					}
				} else {
					this.scan_img = modelIdToImagePath[this.modelId];
				}
			},

			queryDevices() {
				this.$post(this.$url_queryDevices, {}, {
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
				this.$post(this.$url_bind_device, data, {
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
		height: 300px;
		z-index: 500;
		/* 确保低于弹窗的 z-index */
	}

	.img_scansty_1 {
		padding: 20px 20px 0 20px;
	}

	.imgss {
		padding-top: 10px;
		padding-bottom: 30px;
		width: 90vw;
		height: 260px;
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
		margin: 20px 0;
		font-size: 16px;
		font-weight: bold;
	}

	.Message {
		height: 22px;
		margin-top: 60px;
		text-align: center;
		font-size: 16px;
		font-weight: 400;
		color: black;
	}

	.Message1 {
		height: 22px;
		text-align: center;
		font-size: 16px;
		font-weight: 400;
		color: black;
	}

	.Messageback {
		position: fixed;
		bottom: 0;
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
		margin: 20px 20px 46px 20px;
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

	.popup-content {
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		border-radius: 20px;
		padding: 15px;
		height: 50px;
		margin: 20px;
		background-color: #fff;
	}
</style>