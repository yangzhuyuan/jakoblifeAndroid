<template>
	<view style="padding: 10px 10px 108px 10px;background: #F7F7F7; color: black;height: 100vh;">
		<view style="display:flex;flex-direction: column;align-items: center;">
			<image style="width: 180px;height: 180px; " :src="loginimg"></image>
			<text style=" font-size: 16px; font-weight: bold;">{{$t('注销JakobLife账号')}}</text>
			<text
				style="margin-top: 5px; font-size: 16px; font-weight: bold;text-align: center;">{{$t('您将放弃以下资产或权益')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: left;margin-left:10px;">
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('该账号所有的数据将被清空')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('所有设备会与您当前登录的账号解除绑定')}}</text>
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('在手机中')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('同时')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: center; margin-top: 40px;">
			<checkbox style="font-size: 28rpx;" color="#ffffff" class="round" activeBorderColor="#D2D2D2"
				activeBackgroundColor="#3298F7" :checked="cb" @click="checked">{{$t('本人已阅读并同意注销协议')}}
			</checkbox>
		</view>
		<button @click="Think_again()" class="button_back">{{$t('再想想')}}</button>


		<button @click="Definitive_cancellation()" class="button_back" :style="getback(cb)">{{$t('确认注销')}}</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,
				loginimg: '',
				binddevice: false,
				share: false,
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('注销账号')
			})
			const lan = uni.getLocale();
			if (lan == 'zh-Hans') {
				this.loginimg = "../../../static/icons/14.png"
			} else {
				this.loginimg = "../../../static/icons/loginssss.png"
			}
			this.queryDevices()
			this.shareList()
		},
		methods: {
			queryDevices() {
				this.$post(this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						if (res.rows.length === 0) {
							this.binddevice = false
						} else {
							this.binddevice = true
						}
					}
				})
			},

			shareList() {
				const data = {
					shareId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_share_list, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(pending => {
					if (pending.code === 200) {
						if (pending.data.length === 0) {
							this.share = false
						} else {
							this.share = true
						}
					}
				})
			},

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


			Think_again() {
				uni.navigateBack();
			},
			Definitive_cancellation() {
				let that = this
				if (that.cb == false) {
					uni.showToast({
						title: that.$t("请您阅读并同意注销协议"),
						icon: "none"
					})
					return
				} else if (that.binddevice === true || that.share === true) {
					uni.showModal({
						title: that.$t('注销提示'),
						content: that.$t('您的帐户有绑定'),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {}
						}
					});
					return
				} else {
					uni.showModal({
						title: that.$t('注销提示'),
						content: that.$t('请确认是否注销JakobLife账号'),
						success: function(res) {
							if (res.confirm) {
								that.delete_self()
							} else if (res.cancel) {

							}
						}
					});
				}
			},
			//注销用户
			delete_self() {
				this.$post(this.$url_delete_self, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: this.$t("注销成功"),
							icon: "none"
						})
						uni.clearStorageSync()
						setTimeout(function() {
							uni.reLaunch({
								url: "/pages/login/login_land"
							})
						}, 1000)
					}
				})
			}
		}
	}
</script>

<style>
	.button_back {
		margin: 30px 20px 20px 20px;
		background: #3298F7;
		color: white;
		border-radius: 40px;
	}
</style>