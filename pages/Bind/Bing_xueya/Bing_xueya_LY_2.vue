<template>
	<view style="display: flex; flex-direction: column;color: black;width: 100vw;height: 100vh;">
		<view class="shebeistyle">
			<image style="padding: 20px;" src="/static/image/ly.png"></image>
		</view>
		<view style="margin: 15px 15px 0 20px;">{{$t('蓝牙设备绑定1')}}</view>
		<view style="margin: 0 25px 0 20px;">{{$t('蓝牙设备绑定2')}}</view>
		<view style="position: fixed; bottom: 40px; width: 100vw;">
			<button class="btn" @click="btn_next()">{{$t('我已完成连接')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('蓝牙设备绑定')
			})
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
		margin: 100px 20px 0 20px;
		border-radius: 25px;
		background: #3298F7;
		color: white;
	}

	.text {
		text-align: center;
		margin-top: 20px;
		color: deepskyblue;
		font-size: 14px;
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

	.shebeistyle {
		display: flex;
		width: auto;
		margin: 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
	}
</style>