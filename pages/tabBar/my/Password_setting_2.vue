<template>
	<view>
		<view style="flex-direction: column; display: flex;padding-top: 120rpx; align-items: center; ">
			<image src="../../../static/icons/success.png" style="width: 120rpx; height: 120rpx;"></image>
			<view style="margin-top: 120rpx;font-weight: bold">密码已修改成功，请重新登录!</view>
		</view>
		<button
			style=" margin-top: 100rpx;margin-left: 40rpx;margin-right: 40rpx;background:skyblue; color: white; border-radius: 50rpx;"
			@tap="back">确定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			back() {
				uni.redirectTo({
					url: '/pages/login/login_land'
				})
			}

		}
	}
</script>

<style>

</style>