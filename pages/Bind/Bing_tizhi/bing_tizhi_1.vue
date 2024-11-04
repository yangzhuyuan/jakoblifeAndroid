<template>
	<view style="align-items: center; display: flex; width: 100vw;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<image style="width: 90%;margin: 20px;" src="../../../static/image.png"></image>
			<view style="margin: 15px 0 0 15px;">1、将SIM卡按照标识正确插入设备中；</view>
			<view style="margin: 0 25px 0 15px;">2、使用“JakobLife”APP扫描机身标贴的IMEI码或包装彩盒标贴的二维码进行绑定。</view>
			<view style="flex-direction: row; display: flex; margin-top: 100rpx; justify-content: center;">
				<checkbox style="font-size: 28rpx;" color="#ffffff"  class="round" activeBackgroundColor="blue" :checked="cb"
					@click="checked">准备就绪
				</checkbox>
			</view>
			<button class="btn" @click="btn_next()">下一步</button>
			<view class="text" @click="bing_fail()">绑定失败？</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="pupup_title" style="margin-top: 20rpx;">绑定失败?</view>
					<view style="margin-top: 50rpx;">1、请确保按照标识正确插入SIM卡在设备中，并检查网络连接是否正常，若无信号请在关机状态下重新插入SIM卡；</view>
					<view style="margin-top: 10rpx;">2、请扫描机身标贴的IMEI码或包装彩盒标贴的二维码重新绑定；</view>
					<view style="margin-top: 10rpx;">3、重启设备进行尝试；</view>
					<view style="margin-top: 10rpx;">4、若仍无法绑定，请拨打我们的服务热线0755-86561393。</view>
					<button class="btn" @tap="knowe()">知道了</button>
				</view>
			</uni-popup>
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

				}


			},
			bing_fail() {
				this.$refs.popup.open("bottom")
			},
			knowe() {
				this.$refs.popup.close()
			}

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