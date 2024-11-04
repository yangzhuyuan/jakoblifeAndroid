<template>
	<view style="display: flex; flex-direction: column;">
		<image style="width: 90vw; margin: 20px;" src="../../../static/image.png"></image>
		<view style="margin: 15px 15px 0 20px;">{{$t('BDSBitem.title_25')}}</view>
		<view style="margin: 0 25px 0 20px;">{{$t('BDSBitem.title_26')}}</view>
		<view style="position: fixed; bottom: 40px; width: 100vw;">
			<button class="btn" @click="btn_next()">{{$t('BDSBitem.title_27')}}</button>
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
				title: this.$t('BDSBitem.title_24')
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
</style>