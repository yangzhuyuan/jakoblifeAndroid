<template>
	<view style="align-items: center; display: flex; width: 100vw;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<image style="width: 90%;margin: 20px;" src="../../../static/image.png"></image>
			<view style="margin: 15px 0 0 15px;">1、将血压计开机；</view>
			<view style="margin: 0 25px 0 15px;">2、在待机状态下按“设定”和“记忆”键，随后WiFi图标开始闪烁，进入配网模式。</view>
			<view style="flex-direction: row; display: flex; margin-top: 100rpx; justify-content: center;">
				<checkbox style="font-size: 28rpx; margin-right:10px;" color="#ffffff" class="round"
					activeBackgroundColor="blue" :checked="cb" @click="checked">准备就绪
				</checkbox>
			</view>
			<button class="btn" @click="btn_next()">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,

			}
		},
		methods: {

			checked() {
				if (this.cb == true) {
					this.cb = false
				} else {
					this.cb = true
				}
			},

			btn_next() {
				if (this.cb == false) {
					uni.showToast({
						title: "是否准备就绪",
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: '../Bing_xueya/Bing_xueya_2'
				})
			},

		}
	}
</script>

<style>
	.btn {
		margin: 60rpx 40rpx 0 40rpx;
		border-radius: 50rpx;
		background: skyblue;
		color: white;
	}

	.text {
		text-align: center;
		margin-top: 40rpx;
		color: deepskyblue;
		font-size: 28rpx;
	}

	.popup_bg {
		background: white;
		margin: 30rpx;
		border-radius: 50rpx;
		padding: 40rpx;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 38rpx;
		text-align: center;
		margin-top: 10rpx;
	}
</style>