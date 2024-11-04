<template>
	<view>
		<view>
			<view style="display: flex;flex-direction: column; padding-top: 120px; align-items: center; ">
				<image src="../../../static/icons/shibaitubiao.png" style="width: 80px; height: 80px;"></image>
				<view style="margin-top: 40px;font-weight: bold">{{$t('BDSBitem.title_22')}}</view>
			</view>
			<view style="position: fixed; bottom: 50px;width: 100vw;">
				<button
					style=" margin-top: 50px;margin-left: 20px;margin-right: 20px;background:#3298F7; color: white; border-radius: 25px;"
					@tap="back">{{$t('BDSBitem.title_23')}}</button>
				<view class="text" @click="bing_fail()">{{$t('BDSBitem.title_3')}}</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="pupup_title" style="margin-top: 20rpx;">{{$t('BDSBitem.title_3')}}</view>
					<view style="margin-top: 25px;">{{$t('BDSBitem.title_4')}}</view>
					<view style="margin-top: 5px;">{{$t('BDSBitem.title_5')}}</view>
					<view style="margin-top: 5px;">{{$t('BDSBitem.title_6')}}</view>
					<view style="margin-top: 5px;">{{$t('BDSBitem.title_7')}}</view>
					<button class="btn" @tap="knowe()">{{$t('BDSBitem.title_8')}}</button>
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
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})
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
		color: #3298F7;
		font-size: 14px;
	}

	.popup_bg {
		background: white;
		margin:15px;
		border-radius: 25px;
		padding: 20px;
	}

	.btn {
		margin: 30px 20px 0 20px;
		border-radius: 25px;
		background: #3298F7;
		color: white;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 19px;
		text-align: center;
		margin-top: 5px;
	}
</style>