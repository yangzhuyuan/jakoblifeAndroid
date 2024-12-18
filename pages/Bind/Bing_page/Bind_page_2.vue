<template>
	<view style="color: black; background: white;height: 100vh;width: 100vw;">
		<view v-if="img_scan" style="padding: 80px 20px 20px 20px;">
			<app-scan ref="appScan" @getCode="getCode" />
		</view>
		<view v-else style="padding: 80px 20px 20px 20px;">
			<view class="imgss">
				<image class="imgss1" :src="scan_img"></image>
			</view>
			<view style="text-align: center;margin-top: 20px;">{{xinghao}}
			</view>
		</view>
		<view style="text-align: center;margin-top: 15px;padding-bottom: 180px;padding: 20px;">{{context_msg}}</view>
		<view style="position: fixed; bottom: 0;width: 100vw; background: white;">
			<button style="margin: 20px;border-radius: 30px;background: #3298F7; color: white; "
				@click="True_Bind()">{{$t('BDSBitem.button_0')}}</button>
			<button @click="unbind()"
				style="margin: 20px;border-radius: 30px;background: #DBDBDB; color: white;">{{$t('XZGLLXitem.button_4')}}</button>
		</view>
	</view>
</template>

<script>
	import scan  from "../../components/p-scan/scan.vue"
	import appScan from "../../../uni_modules/simbalkj-scan/components/simbalkj-scan/appScan.vue"
	export default {
		components: {
			appScan
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})
			console.log(uni.getStorageSync("token"))

		},

		data() {
			return {
				img_scan: true,
				scan_img: "../../../static/image-active.png",
				xinghao: '',
				context_msg: this.$t('BDSBitem.title_9'),
			};
		},
		methods: {
			getCode(barNumber) {
				this.context_msg = barNumber
				this.img_scan = false
				this.get_device_info()


			},
			True_Bind() {
				if (this.context_msg === this.$t('BDSBitem.title_9')) {
					uni.showToast({
						title: this.$t('BDSBitem.title_12'),
						icon: 'none'
					})
					return
				}

				this.queryDevices()


			},
			unbind() {
				uni.reLaunch({
					url: '../../login/login_land'
				})
			},

			queryDevices() {
				let that = this
				uni.request({
					url: that.$url_queryDevices,
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("查询用户的绑定设备", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.rows == null) {
									uni.navigateTo({
										url: "../Bing_page/Bind_pg?sn=" + that.context_msg.replace('IMEI:',
											'')
									})
								} else {
									uni.getStorageInfo({
										success(ress) {
											if (ress.keys.includes('deviceSn')) {
												if (uni.getStorageSync("deviceSn") == that.context_msg
													.replace('IMEI:', '')) {
													uni.showToast({
														title: '当前主页面已绑定该设备',
														icon: 'none'
													})
													uni.switchTab({
														url: '/pages/tabBar/main/Main'
													})
												} else {
													for (let i = 0; res.data.rows.length > i; i++) {
														if (res.data.rows[i].deviceSn.includes(that
																.context_msg.replace(
																	'IMEI:',
																	''))) {
															uni.showToast({
																title: '绑定成功',
																icon: 'none'
															})
															uni.setStorageSync("deviceSn", that.context_msg
																.replace('IMEI:',
																	''))
															uni.switchTab({
																url: '/pages/tabBar/main/Main'
															})
															return
														} else {
															uni.navigateTo({
																url: "../Bing_page/Bind_pg?sn=" +
																	that.context_msg
																	.replace('IMEI:',
																		'')
															})
														}
													}
												}
											} else {

												uni.navigateTo({
													url: "../Bing_page/Bind_pg?sn=" + that
														.context_msg
														.replace('IMEI:',
															'')
												})


											}

										}
									})
									console.log(uni.getStorageSync("deviceSn"))

								}

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					}
				})
			},



			//获取设备基础信息
			get_device_info() {
				let that = this
				console.log("token", uni.getStorageSync("token"))
				console.log("sn", that.context_msg)
				uni.request({
					url: that.$url_get_device_info,
					method: 'POST',
					data: {
						deviceSn: that.context_msg
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("获取设备基础信息", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								that.xinghao = "型号:" + res.data.data.model
								that.context_msg = "IMEI:" + res.data.data.deviceSn
								that.scan_img = res.data.data.picturePath
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								that.img_scan = true
							}
						} else {
							console.log("设备绑定失败", res)
						}

					}
				})
			}
		}
	};
</script>

<style>
	.imgss {
		margin-top: 20px;
		padding-top: 10px;
		padding-bottom: 30px;
		width: 90vw;
		height: 260px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: gainsboro;
	}

	.imgss1 {
		padding-top: 20px;
		width: 80vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>