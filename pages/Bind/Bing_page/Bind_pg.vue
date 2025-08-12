<template>
	<view style="color: black;height: 100vh;">
		<view style="display: flex;justify-content: center;padding-top: 80px;">
			<circle-progress-bar :pro="prosgress_bg / 100" :border_back_color="'#dcdcdc'" :border_color="'#297DFE'"
				style="color: #297DFE; font-size: 24px; font-weight: 600;">
				{{progress}}%
			</circle-progress-bar>
		</view>
		<view style="margin-top: 20px;text-align: center;font-size: 16px;padding: 20px;font-weight: 600;">
			{{$t('绑定设备中请不要退出app')}}
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

		onLoad(optiona) {
			this.change(optiona.sn, optiona.MACdeviceID, optiona.modelId)
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t('绑定设备')
			})
		},
		methods: {
			change(sn, MACdeviceID, modelId) {
				let that = this
				// 开启定时器，定时器同样可以用在请求当中
				let clearInt = setInterval(() => {
					that.progress++;
					that.prosgress_bg++;
					if (that.progress === 100) {
						clearInterval(clearInt)
						uni.showToast({
							title: that.$t("设备绑定成功"),
							icon: "none"
						});
						that.bind_device(sn, MACdeviceID, modelId)
					}
				}, 100)
			},
			//设备绑定
			bind_device(sn, MACdeviceID, modelId) {
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				}
				this.$post(this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(bind_device => {
					if (bind_device.code == 200) {
						uni.setStorageSync("deviceSn", sn)
						uni.navigateTo({
							url: "../Bing_page/Bind_success?modelId=" + modelId
						})
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail?bindcode=" + bind_device.code
						})
					}
				})
			},
		},
	}
</script>