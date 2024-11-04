<template>
	<view>
		<view style="padding-top: 120rpx;">
			<view
				style="align-items: center; height: 50rpx; background-color: white; border-radius: 50rpx;margin-left: 80rpx; margin-right: 80rpx;padding: 20rpx;flex-direction: row; display: flex;">
				<image class="login-logo" style="  width: 40rpx ; height: 40rpx; "
					src="../../../static/icons/miama.png">
				</image>
				<input type="text" :password=isPassword1 placeholder="请输入密码" style="width: 80%;margin-left: 15rpx; "
					v-model="passwrod" />
				<image style=" width: 40rpx ; height: 40rpx; " :src="isPassword1 ? urlicon1 : urlicon2"
					@tap="img_mima1"></image>

			</view>

			<view
				style="margin-top: 80rpx; align-items: center; height: 50rpx; background-color: white; border-radius: 50rpx;margin-left: 80rpx; margin-right: 80rpx;padding: 20rpx;flex-direction: row; display: flex;">
				<image class="login-logo" style="  width: 40rpx ; height: 40rpx; "
					src="../../../static/icons/miama.png">
				</image>
				<input type="text" :password=isPassword2 placeholder="请确认密码" style="width: 80%;margin-left: 15rpx; "
					v-model="true_passwrod" />
				<image style=" width: 40rpx ; height: 40rpx; " :src="isPassword2 ? urlicon3 : urlicon4"
					@tap="img_mima2"></image>
			</view>
			<button
				style=" margin-top: 80rpx;margin-left: 40rpx;margin-right: 40rpx;background:skyblue; color: white; border-radius: 50rpx;font-weight: bold;"
				@tap="btn_next">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isPassword1: true,
				urlicon1: "../../../static/icons/mima_1.png",
				urlicon2: "../../../static/icons/mima_2.png",
				isPassword2: true,
				urlicon3: "../../../static/icons/mima_1.png",
				urlicon4: "../../../static/icons/mima_2.png",
			}
		},
		methods: {
			img_mima1() {
				if (this.isPassword1 == true) {
					this.isPassword1 = false
				} else {
					this.isPassword1 = true
				}
			},
			img_mima2() {
				if (this.isPassword2 == true) {
					this.isPassword2 = false
				} else {
					this.isPassword2 = true
				}
			},

			btn_next() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Password_setting_2"
				})
			}

		}
	}
</script>

<style>

</style>