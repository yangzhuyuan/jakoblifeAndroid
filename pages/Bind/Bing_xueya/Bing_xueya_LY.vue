<template>
	<view style="display: flex;height: 100vh;color: black;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<view style="width: auto;margin: 20px; background: white; border-radius: 10px;padding: 20px;">
				<image style="width: 100%; " :src="SELECT_TYPE === '0' ? imagess:imagess1"></image>
			</view>
			<view style="margin: 10px 20px 0 20px;">{{$t('BDSBitem.title_13')}}</view>
			<view style="margin: 0 20px 0 20px;">{{$t('BDSBitem.title_14')}}</view>
			<view style="flex-direction: row; display: flex; margin-top: 100px; justify-content: center;">
				<checkbox style="font-size: 28rpx; margin-right:10px;" color="#ffffff" class="round"
					activeBackgroundColor="#3298F7" active-border-color="#D5D5D5" :checked="cb" @click="checked">
					{{$t('BDSBitem.title_2')}}
				</checkbox>
			</view>
			<button class="btn" @click="btn_next()">{{$t('zhuceitem.btn_0')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,
				sn: '',
				serviceId: '',
				SELECT_TYPE: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png'
			}
		},

		onLoad(opt) {
			this.sn = opt.sn
			this.SELECT_TYPE = opt.SELECT_TYPE
			console.log("的撒娇快回答快回答卡", opt)
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
					url: '../Bing_xueya/lanyashebe?SELECT_TYPE=' + this.SELECT_TYPE + "&sn=" + this.sn
				})
			},

		}
	}
</script>

<style>
	.btn {
		margin: 60rpx 40rpx 0 40rpx;
		border-radius: 50rpx;
		background: #3298F7;
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