<template>
	<view style="padding: 20px;color: black;height: 100vh;background: #EFEFF4;">
		<view class="titless">{{$t('XZGLLXitem.title_0')}}</view>
		<view class="title_1">{{$t('XZGLLXitem.title_1')}}</view>
		<view class="context_btn" @click="xueya_click()">
			<image class="img" src="../../static/icons/3.png" />
			<view class="context_title">{{$t('XZGLLXitem.button_0')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view class="context_btn" @click="tizhi_click()">
			<image class="img" src="../../static/icons/6.png" />
			<view class="context_title">{{$t('XZGLLXitem.button_1')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view style="width:100vw;position: fixed;bottom: 0;left: 0;">
			<button style="margin:0 15px 40px 15px; background: #3298F7; color: white; border-radius: 50rpx;"
				@tap="skile">{{$t('XZGLLXitem.button_2')}}</button>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="pupup_title" style="margin-top: 10px;">{{$t('XZGLLXitem.title_2')}}</view>
					<view class="pupup_title">{{$t('XZGLLXitem.title_3')}}</view>
					<view class="pupup_title">{{$t('XZGLLXitem.title_4')}}</view>
					<view style="margin-top: 20px;" @click="click_button(0)">{{$t('XZGLLXitem.title_5')}}</view>
					<view style="margin-top: 5px;" @click="click_button(1)">{{$t('XZGLLXitem.title_6')}}</view>
					<view style="margin-top: 5px;" @click="click_button(2)">{{$t('XZGLLXitem.title_7')}}</view>
					<view style="margin-top: 5px;" @click="click_button(3)">{{$t('XZGLLXitem.title_8')}}</view>

					<view class="btn">
						<button @tap="agree"
							style="width: 25vw;height: 50px; display: flex; justify-content: center; align-items: center; background: #3298F7; color: white;border-radius: 30px; font-weight: bold;">{{$t('login.text_4')}}</button>
						<button @tap="Turn_down"
							style="width: 25vw;line-height: 25px; height: 50px; display: flex; justify-content: center; align-items: center;background: lightgray; color: white;border-radius: 30px; font-weight: bold;">{{$t('XZGLLXitem.button_3')}}</button>
					</view>


				</view>
			</uni-popup>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				select_types: "",
				typess: '',
			}
		},

		onLoad(res) {
			console.log(res)
			uni.setNavigationBarTitle({
				title: this.$t('XZGLLX')
			})
			this.typess = res.typesss
		},

		methods: {

			click_button(id) {
				uni.navigateTo({
					url: '../service/Usage_agreement?id=' + id
				})
			},

			xueya_click() {
				this.queryDevices("xy")

				// this.select_types = "0",
				// 	this.$refs.popup.open('bottom')
			},
			tizhi_click() {
				this.queryDevices("tz")
				// this.select_types = "1",
				// 	this.$refs.popup.open('bottom')
			},
			skile() {
				uni.switchTab({
					url: "../tabBar/main/Main"
				})
			},
			agree() {
				this.$refs.popup.close()
				uni.navigateTo({
					url: "../Bind/Bing_page/Bing_page?SELECT_TYPE=" + this.select_types
				})
			},
			Turn_down() {
				this.$refs.popup.close()
			},


			//查询用户的绑定设备
			queryDevices(type) {
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
									uni.showToast({
										title: '当前未绑定任何设备',
										icon: 'none'
									})
								} else {

									if (type == 'xy') {
										for (let i = 0; res.data.rows.length > i; i++) {
											if (res.data.rows[i].deviceTypeId == "10") {
												uni.setStorageSync("deviceSn", res.data.rows[i].deviceSn)
											}
										}

										if (that.typess == "main") {
											uni.switchTab({
												url: '/pages/tabBar/main/Main'
											})
										} else if (that.typess == "qushi") {
											uni.switchTab({
												url: '/pages/tabBar/tendency/Tendency'
											})
										} else {
											uni.switchTab({
												url: '/pages/tabBar/my/My'
											})
										}

									} else {
										for (let i = 0; res.data.rows.length > i; i++) {
											if (res.data.rows[i].deviceTypeId == "11") {
												uni.setStorageSync("deviceSn", res.data.rows[i].deviceSn)
											}
										}

										if (that.typess == "main") {
											uni.switchTab({
												url: '/pages/tabBar/main/Main'
											})
										} else if (that.typess == "qushi") {
											uni.switchTab({
												url: '/pages/tabBar/tendency/Tendency'
											})
										} else if (that.typess == "my") {
											uni.switchTab({
												url: '/pages/tabBar/my/My'
											})
										}

									}
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

		}
	}
</script>

<style>
	.titless {
		margin-top: 20px;
		font-size: 18px;
		font-weight: bold;
		color: black;
	}

	.title_1 {
		margin-top: 5px;
		font-size: 14px;
		color: gray;
	}

	.img {
		width: 50px;
		height: 45px;

	}

	.context_btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: white;
		padding: 10px;
		margin-top: 20px;
		border-radius: 30px;

	}

	.context_title {
		width: 70vw;
		font-size: 18px;
		color: black;
		font-weight: bold;
		margin-left: 10px;
	}

	.popup_bg {
		background: white;
		margin: 0 15px 40px 15px;
		border-radius: 50rpx;
		padding: 20px;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 18px;
		margin-top: 10rpx;
	}


	.btn {
		margin-top: 20px;
		margin-bottom: 20px;
		display: flex;
		flex-direction: row;

	}
</style>