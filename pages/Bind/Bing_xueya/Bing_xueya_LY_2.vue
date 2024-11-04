<template>
	<view style="display: flex; flex-direction: column;">
		<image style="width: 90vw; margin: 20px;" src="../../../static/image.png"></image>
		<view style="margin: 15px 0 0 15px;">1、打开手机设置，进入蓝牙连接；</view>
		<view style="margin: 0 25px 0 15px;">2、选择对应设备型号进行连接。</view>
		<button class="btn" @click="btn_next()">我已完成连接</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {


			btn_next() {
				uni.navigateTo({
		
				})
			},

		}
	}
</script>

<style>
	.btn {
		margin: 100px 40rpx 0 40rpx;
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