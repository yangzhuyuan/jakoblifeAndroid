<template>
	<view style="color: black;height: 100vh;width: 100vw;">
		<view style="display: flex;justify-content: center;padding-top: 80px;">
			<circle-progress-bar :pro="prosgress_bg / 100" :border_back_color="'#dcdcdc'" :border_color="'#297DFE'"
				style="color: #297DFE; font-size: 22px; font-weight: bold;">
				{{progress}}%
			</circle-progress-bar>
		</view>
		<view style="margin-top: 60px;text-align: center;font-size: 16px;padding: 20px;">
			{{$t('BDSBitem.title_16')}}
		</view>
	</view>
</template>

<script>
	import CircleProgressBar from '../../components/circle-progress-bar/circle-progress-bar.vue'
	export default {
		components: {
			CircleProgressBar,
		},


		data() {
			return {
				prosgress_bg: 0,
				progress: "0",
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})
		},

		onLoad(ops) {
			this.change(ops.sn)
		},

		methods: {
			change(sn) {
				let that = this
				// 开启定时器，定时器同样可以用在请求当中
				let clearInt = setInterval(() => {
					this.progress++;
					this.prosgress_bg++;
					if (this.progress === 100) {
						clearInterval(clearInt)
						uni.showToast({
							title: "设备绑定成功",
							con: "none"
						});
						that.bind_device(sn)
					}
				}, 300)
			},
			//设备绑定
			bind_device(sn) {
				let that = this
				console.log("token", uni.getStorageSync("token"))
				console.log("sn", sn)
				uni.request({
					url: that.$url_bind_device,
					method: 'POST',
					data: {
						deviceSn: sn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(res) {
						console.log("设备绑定", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.setStorageSync("deviceSn", sn)
								setTimeout(function() {
									uni.navigateTo({
										url: "../Bing_page/Bind_success"
									})
								}, 500)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateTo({
										url: "../Bing_page/Bind_fail"
									})
								}, 500)
							}
						} else {
							console.log("设备绑定失败", res)
						}

					}
				})
			},

		},

	}
</script>

<style>
</style>