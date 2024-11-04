<template>
	<view style="padding: 10px;">
		<view style="display:flex;flex-direction: column;align-items: center;">
			<image style="width: 180px;height: 180px; " src="../../../static/icons/14.png"></image>
			<text style=" font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_title1')}}</text>
			<text
				style="margin-top: 5px; font-size: 16px; font-weight: bold;text-align: center;">{{$t('wodelist.zx_title2')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: left;margin-left:10px;">
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_title3')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('wodelist.zx_title4')}}</text>
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_title5')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('wodelist.zx_title6')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: center; margin-top: 40px;">
			<checkbox style="font-size: 28rpx;" color="#ffffff" class="round" activeBorderColor="#D2D2D2"
				activeBackgroundColor="#3298F7" :checked="cb" @click="checked">{{$t('wodelist.zx_title7')}}
			</checkbox>
		</view>
		<button @click="Think_again()"
			style="margin:30px 20px 20px 20px;background: #3298F7;color: white;border-radius: 40px;">{{$t('wodelist.zx_title8')}}</button>


		<button @click="Definitive_cancellation()"
			style="margin:10px 20px 80px 20px;background: #3298F7;color: white;border-radius: 40px;">{{$t('wodelist.zx_title9')}}</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false

			}
		},



		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.zx_title0')
			})
		},
		methods: {
			checked() {
				if (this.cb == true) {
					this.cb = false
				} else {
					this.cb = true
				}
			},


			Think_again() {
				uni.navigateBack();
			},
			Definitive_cancellation() {
				if (this.cb == false) {
					uni.showToast({
						title: "请您阅读并同意注销协议",
						icon: "none"
					})
					return
				} else {
					uni.showModal({
						title: '注销提示',
						content: '请确认是否注销JakobLife账号',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								uni.showToast({
									title: "注销成功",
									icon: "success"
								})
								setTimeout(function() {
									uni.reLaunch({
										url: "/pages/login/login_land"
									})
								}, 1000)
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			}
		}
	}
</script>

<style>

</style>