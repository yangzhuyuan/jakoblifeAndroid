<template>
	<view>
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

		onLoad() {
			this.change()
		},

		methods: {
			change() {
				// 开启定时器，定时器同样可以用在请求当中
				let clearInt = setInterval(() => {
					this.progress++;
					this.prosgress_bg++;
					if (this.progress === 100) {
						clearInterval(clearInt)
						uni.showToast({
							title: "设备绑定成功",
							con: "success"
						});
						setTimeout(function() {
							uni.navigateTo({
								url: "../Bing_page/Bind_success"
							})
						}, 500)
					}
				}, 300)
			}
		},

	}
</script>

<style>
</style>