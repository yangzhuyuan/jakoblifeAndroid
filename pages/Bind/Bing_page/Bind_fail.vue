<template>
	<view style="color: black;height: 100vh;background: #F7F7F7;">
		<view>
			<view style="display: flex;flex-direction: column; padding-top: 120px; align-items: center; ">
				<image src="../../../static/icons/shibaitubiao.png" style="width: 68px; height: 68px;"></image>
				<view style="margin-top: 20px;font-weight: 600;font-size: 17px;">{{$t('添加失败请重试')}}</view>
				<view style="font-weight: 600;font-size: 17px;">{{bindqu}}</view>
			</view>
			<view style="position: fixed; bottom: 50px;width: 100vw;">
				<button class="button_bg" @click="back()">{{$t('重新绑定')}}</button>
				<view class="text" @click="bing_fail()">{{$t('绑定失败')}}</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="pupup_title">{{$t('绑定失败')}}</view>
					<view style="margin-top: 20px; font-size: 12px; color: #999999;">{{$t('绑定失败1')}}</view>
					<view style="margin-top: 5px; font-size: 12px; color: #999999;">{{$t('绑定失败2')}}</view>
					<view style="margin-top: 5px; font-size: 12px; color: #999999;">{{$t('绑定失败3')}}</view>
					<view style="margin-top: 5px; font-size: 12px; color: #999999;">{{$t('绑定失败4')}}</view>
					<button class="btn" @tap="knowe()">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bindqu: '',
			}
		},

		onLoad(opts) {
			switch (opts.bindcode) {
				case "401":
					this.bindqu = this.$t("该设备与其他帐号绑定")
					break
				default:
					this.bindqu = ''
					break
			}
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t('绑定设备')
			})
		},

		methods: {
			back() {
				uni.switchTab({
					url: "../../tabBar/my/My"
				})
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
	.text {
		text-align: center;
		margin-top: 20px;
		color: #3298F7;
		font-size: 12px;
	}

	.popup_bg {
		width: auto;
		margin-left: 20px;
		margin-right: 20px;
		margin-bottom: 88px;
		background: white;
		border-radius: 24px;
		padding: 20px;
	}

	.btn {
		width: 120px;
		margin-top: 20px;
		height: 48px;
		display: flex;
		font-size: 17px;
		font-weight: 600px;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		background: #3298F7;
		color: white;
	}

	.pupup_title {
		text-align: center;
		margin-top: 20rpx;
		font-size: 16px;
		font-weight: 600;
	}

	.button_bg {
		width: auto;
		height: 48px;
		font-size: 16px;
		margin-left: 20px;
		margin-bottom: 10px;
		margin-right: 20px;
		display: flex;
		font-weight: 600;
		justify-content: center;
		align-items: center;
		color: white;
		border: none;
		background: #3298F7;
		border-radius: 30px;
	}
</style>