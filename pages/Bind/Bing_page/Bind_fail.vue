<template>
	<view>
		<view>
			<view style="flex-direction: column; display: flex;padding-top: 120rpx; align-items: center; ">
				<image src="../../../static/icons/shibaitubiao.png" style="width: 120rpx; height: 120rpx;"></image>
				<view style="margin-top: 120rpx;font-weight: bold">添加失败，请重试。</view>
			</view>
			<button
				style=" margin-top: 100rpx;margin-left: 40rpx;margin-right: 40rpx;background:skyblue; color: white; border-radius: 50rpx;"
				@tap="back">重新绑定</button>
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

			}
		},
		methods: {
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

	.btn {
		margin: 60rpx 40rpx 0 40rpx;
		border-radius: 50rpx;
		background: skyblue;
		color: white;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 38rpx;
		text-align: center;
		margin-top: 10rpx;
	}
</style>