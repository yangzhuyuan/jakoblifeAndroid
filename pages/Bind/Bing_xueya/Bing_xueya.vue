<template>
	<view style="display: flex; color: black;height: 100vh;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<view class="shebeistyle">
				<image style="width: 280px;" :src="SELECT_TYPE === '0' ? imagess:imagess1" />
			</view>
			<view style="margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">
				{{SELECT_TYPE === '0' ? $t('将血压计开机'):$t('将体脂秤开机')}}
			</view>
			<view style="width: auto; margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">{{$t('在待机状态下')}}
			</view>
			<view style="flex-direction: row; display: flex; margin-top: 100rpx; justify-content: center;">
				<checkbox style="font-size: 28rpx; margin-right:10px;" color="#ffffff" class="round"
					activeBackgroundColor="#3298F7" active-border-color="#D5D5D5" :checked="cb" @click="checked">
					{{$t('准备就绪')}}
				</checkbox>
			</view>
			<button class="btn" plain="true" :style="getback(cb)" @click="btn_next()">{{$t('下一步')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,
				SELECT_TYPE: '',
				sn: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png',
				modelId: '',
			}
		},

		onLoad(opt) {
			console.log("上个页面带过来的数据", opt)
			this.sn = opt.sn
			this.modelId = opt.modelId
			this.SELECT_TYPE = opt.SELECT_TYPE
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('绑定设备')
			})
		},


		methods: {
			getback(id) {
				return {
					background: id === false ? "#DBDBDB" : "#3298F7"
				}
			},


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
						title: this.$t("是否准备就绪"),
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: '../Bing_xueya/lanya_wifi?sn=' + this.sn + "&SELECT_TYPE=" + this.SELECT_TYPE +
						"&modelId=" + this.modelId
				})
			},
		}
	}
</script>

<style>
	.shebeistyle {
		display: flex;
		width: auto;
		height: 301px;
		margin: 20px 20px 20px 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
	}

	.btn {
		width: auto;
		height: 48px;
		font-size: 16px;
		font-weight: 400;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 20px 0 20px;
		border-radius: 30px;
		background: #3298F7;
		color: white !important;
		border: none !important;
	}

	.text {
		text-align: center;
		margin-top: 40rpx;
		color: #3298F7;
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