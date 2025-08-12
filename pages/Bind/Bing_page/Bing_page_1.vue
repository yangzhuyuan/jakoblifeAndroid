<template>
	<view style=" color: black;height: 100vh;background: #EFEFF4;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<view class="shebeistyle">
				<image style="padding: 40px;" :src="SELECT_TYPE === '0' ? imagess:imagess1" />
			</view>
			<view v-show="modelConnectType === '0' ? true : false "
				style="margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">
				{{$t("绑定提醒1")}}
			</view>
			<view v-if="modelConnectType === '0'" style="margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">
				{{$t("绑定提醒2")}}
			</view>
			<view v-else style="margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">
				{{$t("绑定提醒3")}}
			</view>
			<!-- <view style="position: fixed;bottom: 0; width: 100vw;"> -->
				<view style="flex-direction: row; display: flex; justify-content: center;margin-top: 118px;">
					<checkbox style="font-size: 12px;" color="#ffffff" class="round" activeBackgroundColor="#3298F7"
						active-border-color="#DBDBDB" :checked="cb" @click="checked">{{$t('准备就绪')}}
					</checkbox>
				</view>
				<button plain="true" class="btn" :style="getback(cb)" @click="btn_next()">{{$t('下一步')}}</button>
				<view class="textsss" @click="bing_fail()">{{$t('绑定失败')}}</view>
			<!-- </view> -->
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="pupup_title">{{$t('绑定失败')}}</view>
					<view style="margin-top: 20px; font-size: 12px; color: #999999;">{{$t('绑定失败1')}}</view>
					<view style="margin-top: 5px; font-size: 12px; color: #999999;">{{$t('绑定失败2')}}</view>
					<view style="margin-top: 5px; font-size: 12px; color: #999999;">{{$t('绑定失败3')}}</view>
					<view style="margin-top: 5px; font-size: 12px; color: #999999;">{{$t('绑定失败4')}}</view>
					<button class="btn_1" @tap="knowe()">{{$t('知道了')}}</button>
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
				SELECT_TYPE: '',
				modelConnectType: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png'
			}
		},

		onLoad(opt) {
			console.log("当前页面Bind_page_1:", "上个页面带过来的数据----------" + JSON.stringify(opt))
			this.SELECT_TYPE = opt.SELECT_TYPE
			this.modelConnectType = opt.modelConnectType
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("绑定设备")
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
					url: "../Bing_page/Bind_page_2?modelConnectType=" + this.modelConnectType + "&SELECT_TYPE=" +
						this.SELECT_TYPE
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
	.shebeistyle {
		display: flex;
		width: auto;
		height: 301px;
		margin: 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
	}


	.btn {
		width: auto;
		height: 48px;
		font-size: 16px;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 20px 0 20px;
		border-radius: 30px;
		background: #3298F7;
		color: white !important;
		border: none !important;
	}

	.textsss {
		text-align: center;
		margin-top: 20px;
		font-size: 12px;
		font-weight: 400;
		margin-bottom: 50px;
		color: #3298F7;
		margin-left: 10px;

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

	.btn_1 {
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
</style>