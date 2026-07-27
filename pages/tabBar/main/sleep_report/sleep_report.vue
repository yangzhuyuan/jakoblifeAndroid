<template>
	<view style="padding: 20px;">
		<button class="btnstyle" @click="setting()">{{$t("定时测量")}}</button>
		<button class="btnstyle" @click="sleep_alert()">{{$t("立即测量")}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: uni.getStorageSync("deviceIdwatch"),
				serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E", //BPW1蓝牙设备服务值
			}
		},
		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('情绪检测')
			})
		},
		methods: {
			setting() {
				uni.navigateTo({
					url: '/pages/tabBar/main/sleep_report/Reports_Alerts'
				})
			},
			sleep_alert() {
				// uni.navigateTo({
				// 	url: '/pages/tabBar/main/sleep_report/sleep_alerts'
				// })
				uni.showLoading({
					title: this.$t("设置中"),
					mask: true
				})
				this.startheart(1)
				uni.setStorageSync("sleep_alert", 1)
			},
			startheart(type) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								that.sendstartheartwatch(item.uuid, type)
							}
						}
					},
					fail(res) {
						uni.showToast({
							title: that.$t("请检查设备连接"),
							icon: 'none'
						})
					}
				})
			},
			//血压实时测量命令：e0 00 06 F4 06 01 05 00 01 01
			sendstartheartwatch(writeuuid, type) {
				let that = this
				let buffer2
				if (type === 1) {
					buffer2 = that.toArrayBuffer("e00006F3060104000101") //心率
				} else if (type === 2) {
					buffer2 = that.toArrayBuffer("e00006F5060106000101") //血氧
				} else {
					buffer2 = that.toArrayBuffer("e00006F4060105000101") //血压
				}
				console.log(that.deviceId)
				console.log(that.serviceId)
				console.log(writeuuid)
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: that.serviceId,
						characteristicId: writeuuid,
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							if (type === 1 || type === 2) {
								console.log("1开始心率/血氧测量：" + (type === 1 ? "e00006F3060104000101" :
									"e00006F5060106000101"), res)
							} else {
								console.log("1开始血压测量：" + "e00006F4060105000101", res)
							}
							uni.hideLoading()
							uni.showLoading({
								title: that.$t("开始测量"),
								mask: true
							})
						},
						fail(err) {
							console.error("2开始心率/血氧测量：", err)
						},
					})
				}, 3000)
			},

			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
		}
	}
</script>

<style>
	.btnstyle {
		margin-top: 20px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}
</style>