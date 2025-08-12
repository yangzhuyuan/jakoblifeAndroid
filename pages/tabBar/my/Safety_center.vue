<template>
	<view style="padding: 20px;color: black;height: 100vh;background: #EFEFF4;">
		<view style="background: white; padding: 10px; border-radius: 20px;box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);">
			<view>
				<view class="bt_BG" @click="Member_name_modification()">
					<view class="textsss">{{$t('会员名')}}</view>
					<view
						style=" width: 40vw;justify-content: flex-end; display: flex;flex-direction: row;  align-items: center;">
						<view class="textstyles">{{vip_name}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; margin-top: 10px;  height: 1px;"></view>
			<view>
				<view class="bt_BG" @click="Change_number()">
					<view class="textsss">{{nameoremail}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view class="textstyles">{{vip_phone}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>

			<view style="background: gainsboro; width: 100%;margin-top: 10px;  height: 1px;"></view>
			<view>
				<view class="bt_BG" @click="Password_setting()">
					<view class="textsss">{{$t('设置登录密码')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view class="textstyles"></view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;margin-top: 10px;"></view>
			<view style="padding-bottom: 10px;" @click="Cancel_account()">
				<view class="bt_BG">
					<view class="textsss">{{$t('注销账号')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view class="textstyles"></view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view v-show="otherloginssd" style="margin: 20px 0 20px 20px; color: 12px; color: #999999; font-weight: 400;">
			{{$t('第三方账号绑定')}}
		</view>
		<view v-show="otherloginssd"
			style="background: white; padding: 10px; border-radius: 20px;box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);">
			<view @click="click_other_sign(0)">
				<view class="bt_BG">
					<view class="textsss">{{$t('微信')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;display: flex;flex-direction: row; align-items: center;">
						<view
							style="color: gray; text-align: right; font-size: 14px;display: flex;align-items: center;">
							<image v-show="weixin_bind" src="../../../static/page_icon/icon_weichat.png"
								style="width: 45px;height: 45px;margin-right: 10px;"></image>{{wx_phone}}
						</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;margin-top: 10px;"></view>
			<view @click="click_other_sign(1)">
				<view class="bt_BG">
					<view class="textsss">QQ</view>
					<view
						style="width: 40vw;justify-content: flex-end;display: flex;flex-direction: row; align-items: center;">
						<view
							style="color: gray; text-align: right; font-size: 14px;display: flex;align-items: center;">
							<image v-show="qq_bind" src="../../../static/page_icon/icon_QQ.png"
								style="width: 45px;height: 45px;margin-right: 10px;"></image>{{qq_ID}}
						</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<!-- <view style="background: gainsboro; width: 100%; height: 1px; margin-top: 10px;"></view> -->
			<!-- <view style="margin-bottom: 10px;">
				<view class="bt_BG">
					<view class="textsss">APPLE ID</view>
					<view
						style="width: 40vw;justify-content: flex-end; display: flex;margin-bottom: 10px; flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{apple_ID}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view> -->
		</view>
		<view style="display: flex;justify-content: center;">
			<button @click="logout()"
				style="box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);position: fixed; bottom: 40px; border-radius: 30px; background: #3298F7; color: white; width: 80vw;">{{$t('退出登录')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		isInChinaByIP
	} from '../../api/isInChinaByIP.js';
	export default {
		data() {
			return {
				phone: '',
				vip_name: this.$t('未设置会员名'),
				vip_phone: this.$t('未绑定'),
				wx_phone: this.$t('未绑定'),
				weixin_bind: false,
				qq_bind: false,
				qq_ID: this.$t('未绑定'),
				apple_ID: this.$t('未绑定'),
				otherloginssd: false,
				loact: "",
				nameoremail: '',

			}
		},

		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('安全中心')
			})
			isInChinaByIP().then(isInChina => {
				if (isInChina) {
					that.loact = "境内"
					that.otherloginssd = true
					that.nameoremail = that.$t('绑定手机号1')
					that.getinfor()

				} else {
					that.loact = "境外"
					that.otherloginssd = false
					that.nameoremail = that.$t('绑定邮箱1')
					that.getinfor()
				}
			});
		},

		methods: {

			getinfor() {
				let that = this
				uni.request({
					url: that.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: function(res) {
						if (res.data.code == 200) {
							that.vip_name = res.data.data.nickName === null || res.data.data.nickName ===
								"未登录" ? res.data.data.userName : res.data.data.nickName
							that.phone = res.data.data.phonenumber === null ? res.data.data
								.email : res.data.data.phonenumber
							if (that.loact === "境内") {
								if (res.data.data.phonenumber === null && res.data.data.email ===
									null) {
									that.nameoremail = that.$t("绑定手机号1")
								} else if (res.data.data.phonenumber !== null && res.data.data
									.email === null) {
									that.nameoremail = that.$t("绑定手机号1")
								} else if (res.data.data.phonenumber === null && res.data.data
									.email !== null) {
									that.nameoremail = that.$t("绑定邮箱1")
								}
							} else if (that.loact === "境外") {
								if (res.data.data.phonenumber === null && res.data.data.email ===
									null) {
									that.nameoremail = that.$t("绑定邮箱1")
								} else if (res.data.data.phonenumber !== null && res.data.data
									.email === null) {
									that.nameoremail = that.$t("绑定手机号1")
								} else if (res.data.data.phonenumber === null && res.data.data
									.email !== null) {
									that.nameoremail = that.$t("绑定邮箱1")
								}
							}


							if (that.phone === "" || that.phone === null) {
								that.vip_phone = that.$t('未绑定')
							} else {
								that.vip_phone = that.phone.substring(0, 3) + '****' + that
									.phone.substring(7)
							}
							if (res.data.thirdGroup.wx == true) {
								that.wx_phone = that.$t("已绑定")
								that.weixin_bind = true
							} else {
								that.wx_phone = that.$t("未绑定")
								that.weixin_bind = false
							}

							if (res.data.thirdGroup.qq == true) {
								that.qq_ID = that.$t("已绑定")
								that.qq_bind = true
							} else {
								that.qq_ID = that.$t("未绑定")
								that.qq_bind = false
							}
						} else if (res.data.code == 401) {
							return
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},

			//会员名
			Member_name_modification() {
				uni.navigateTo({
					url: '../../tabBar/my/Member_name_modification?PHONE=' + this.phone
				})
			},
			//绑定手机号
			Change_number() {
				uni.navigateTo({
					url: '../../tabBar/my/Change_number?PHONE=' + this.phone
				})
			},
			//设置登录密码
			Password_setting() {
				uni.navigateTo({
					url: "../../tabBar/my/Password_setting?loact=" + this.loact
				})

			},
			//注销账号
			Cancel_account() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Cancel_account"
				})
			},
			//退出登录
			logout() {
				const appQX = uni.getStorageSync("appQX")
				const tongzhi = uni.getStorageSync("tongzhi")
				uni.clearStorageSync()
				uni.setStorageSync("appQX", appQX)
				uni.setStorageSync("tongzhi", tongzhi)
				uni.reLaunch({
					url: '/pages/login/login_land'
				})
			},

			click_other_sign(id) {
				let that = this
				switch (id) {
					case 0:
						console.log("weixin")
						uni.login({
							provider: 'weixin',
							success(res) {
								console.log(res)
								that.bind_third(res.authResult.access_token, res.authResult.openId, 0)
							},
							fail: function(err) {
								// 登录授权失败
								// err.code是错误码
								uni.showToast({
									title: err,
									icon: 'none'
								})
							}
						})
						break
					case 1:
						console.log("qq")
						uni.login({
							provider: 'qq',
							success(res) {
								console.log(res)
								that.bind_third(res.authResult.access_token, res.authResult.openId, 1)
							},
							fail: function(err) {
								// 登录授权失败
								// err.code是错误码
								uni.showToast({
									title: err,
									icon: 'none'
								})
							}
						})
						break
				}
			},
			//手机登陆后绑定第三方信息
			bind_third(accessToken, openId, source) {
				let that = this
				uni.request({
					url: that.$url_bind_third,
					method: 'POST',
					data: {
						accessToken: accessToken,
						openId: openId,
						source: source
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("手机登陆后绑定第三方信息", res)
						if (res.data.code == 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							if (source === 0) {
								that.wx_phone = that.$t("已绑定")
								that.weixin_bind = true
							} else {
								that.qq_ID = that.$t("已绑定")
								that.qq_bind = true
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}

					}
				})

			},

		}
	}
</script>

<style>
	.bt_BG {
		height: auto;
		display: flex;
		height: 56px;
		flex-direction: row;
		padding-top: 10px;
		padding-left: 10px;
		padding-right: 10px;
		align-items: center;

	}

	.textsss {
		width: 50vw;
		font-size: 16px;
		font-weight: 400;
		text-align: left;
	}

	.textstyles {
		color: gray;
		text-align: right;
		font-size: 16px;
		font-weight: 400;
	}
</style>