<template>
	<view style="align-items: center; display: flex; width: 100vw;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<view style="display: flex; width: auto; margin: 20px;justify-content: center; background: white; border-radius: 10px;">
				<image style="width: 80%; " src="../../../static/image/1.png" />
			</view>
			<view style="margin: 15px 0 0 15px; font-size: 16px;">{{$t('BDSBitem.title_0')}}</view>
			<text style="margin: 0 25px 0 15px; font-size: 16px;">{{$t('BDSBitem.title_1')}}</text>
			<view style="flex-direction: row; display: flex; margin-top: 120px; justify-content: center;">
				<checkbox style="font-size: 16px;" color="#ffffff" class="round" activeBackgroundColor="blue"
					active-border-color="#DBDBDB" :checked="cb" @click="checked">{{$t('BDSBitem.title_2')}}
				</checkbox>
			</view>
			<button class="btn" @click="btn_next()">{{$t('zhuceitem.btn_0')}}</button>
			<view class="textsss" @click="bing_fail()">{{$t('BDSBitem.title_3')}}</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="pupup_title" style="margin-top: 10px;">{{$t('BDSBitem.title_3')}}</view>
					<view style="margin-top: 20px; color: #999999;">{{$t('BDSBitem.title_4')}}</view>
					<view style="margin-top: 10px;color: #999999;">{{$t('BDSBitem.title_5')}}</view>
					<view style="margin-top: 10px;margin-bottom: 10px; color: #999999;">{{$t('BDSBitem.title_6')}}
					</view>
					<text style="color: #999999;">{{$t('BDSBitem.title_7')}}</text>
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
				cb: false,
			}
		},


		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})
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
					url: "../Bing_page/Bind_page_2"
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
	.btn {
		margin: 20px 40px 0 40px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
	}

	.textsss {
		text-align: center;
		margin-top: 20px;
		margin-bottom: 50px;
		color: #3298F7;
		font-size: 28rpx;
	}

	.popup_bg {
		background: white;
		margin: 15px;
		border-radius: 30px;
		padding: 40rpx;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 16px;
		text-align: center;
		margin-top: 5px;
	}
</style>