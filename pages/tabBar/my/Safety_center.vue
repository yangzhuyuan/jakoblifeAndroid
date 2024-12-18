<template>
	<view style="padding: 20px;color: black;height: 100vh;background: #EFEFF4;">
		<view style="background: white; padding: 10px; border-radius: 20px;">
			<view>
				<view class="bt_BG" @click="Member_name_modification()">
					<view class="textsss">{{$t('wodelist.wdjkdaitem.title_1')}}</view>
					<view
						style=" width: 40vw;justify-content: flex-end; display: flex;flex-direction: row;  align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{vip_name}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; margin-top: 10px;  height: 1px;"></view>
			<view>
				<view class="bt_BG" @click="Change_number()">
					<view class="textsss">{{$t('zhuceitem.title_0')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{vip_phone}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%;margin-top: 10px;  height: 1px;"></view>
			<view>
				<view class="bt_BG" @click="Password_setting()">
					<view class="textsss">{{$t('wodelist.aqzxitem.title_1')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;"></view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;margin-top: 10px;"></view>
			<view style="padding-bottom: 10px;" @click="Cancel_account()">
				<view class="bt_BG">
					<view class="textsss">{{$t('wodelist.zx_title0')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;"></view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view style="margin: 20px 0 20px 15px; font-weight: bold;">{{$t('wodelist.aqzxitem.title_2')}}</view>
		<view style="background: white; padding: 10px; border-radius: 20px;">
			<view @click="click_other_sign(0)">
				<view class="bt_BG">
					<view class="textsss">{{$t('wodelist.aqzxitem.title_3')}}</view>
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
			<view style="background: gainsboro; width: 100%; height: 1px; margin-top: 10px;"></view>
			<view style="margin-bottom: 10px;">
				<view class="bt_BG">
					<view class="textsss">APPLE ID</view>
					<view
						style="width: 40vw;justify-content: flex-end; display: flex;margin-bottom: 10px; flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{apple_ID}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view style="display: flex;justify-content: center;">
			<button @click="logout()"
				style="position: fixed; bottom: 40px; border-radius: 30px; background: #3298F7; color: white; width: 80vw;">{{$t('wodelist.aqzxitem.title_12')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				vip_name: this.$t('wodelist.aqzxitem.title_0'),
				vip_phone: this.$t('wodelist.aqzxitem.title_13'),
				wx_phone: this.$t('wodelist.aqzxitem.title_13'),
				weixin_bind: false,
				qq_bind: false,
				qq_ID: this.$t('wodelist.aqzxitem.title_13'),
				apple_ID: this.$t('wodelist.aqzxitem.title_13')
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.aqzx')
			})
			let that = this;
			uni.request({
				url: that.$url_getInfo,
				method: 'GET',
				header: {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				},
				success: function(res) {
					console.log("获取用户信息成功:", res)
					if (res.statusCode == 200) {
						if (res.data.code == 200) {
							that.vip_name = res.data.data.nickName
							that.phone = res.data.data.phonenumber
							if (res.data.data.phonenumber === "" || res.data.data.phonenumber === null) {
								that.vip_phone = this.$t('wodelist.aqzxitem.title_13')
							} else {
								that.vip_phone = res.data.data.phonenumber.substring(0, 3) + '****' + res.data
									.data.phonenumber.substring(7)
							}


							if (res.data.thirdGroup.wx == true) {
								that.wx_phone = "已绑定"
								that.weixin_bind = true
							} else {
								that.wx_phone = "未绑定"
								that.weixin_bind = false
							}

							if (res.data.thirdGroup.qq == true) {
								that.qq_ID = "已绑定"
								that.qq_bind = true
							} else {
								that.qq_ID = "未绑定"
								that.qq_bind = false
							}



						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					} else {
						console.log("获取数据错误")
					}
				},
				fail(err) {
					console.log(err)
				}
			})
		},

		methods: {
			//会员名
			Member_name_modification() {
				uni.navigateTo({
					url: '../../tabBar/my/Member_name_modification?PHONE=' + this.phone
				})
			},
			//绑定手机号
			Change_number() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Change_number"
				})
			},
			//设置登录密码
			Password_setting() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Password_setting"
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
				// let aaads = []
				// aaads = uni.getStorageSync("kapianlist")
				// console.log("dsajddadadsa", aaads)
				// let bbb = []
				// for (let i = 0; aaads.length > i; i++) {
				// 	aaads[i].tokensss = uni.getStorageSync("token")
				// 	bbb.push(aaads[i])
				// }
				// uni.setStorageSync("kapianlistall",bbb)
				// console.log("dsajddadadsa", uni.getStorageSync("kapianlistall"))
				// let aaads1 = []
				// aaads1 = uni.getStorageSync("kapianlist2")
				// console.log("dsajddadadsa", aaads1)
				// let bbb1 = []
				// for (let i = 0; aaads1.length > i; i++) {
				// 	aaads1[i].tokensss = uni.getStorageSync("token")
				// 	bbb1.push(aaads1[i])
				// }
				// uni.setStorageSync("kapianlistall2",bbb1)
				// console.log("dsajddadadsa", uni.getStorageSync("kapianlistall2"))
				
			
				uni.removeStorageSync("token")
				uni.removeStorageSync("deviceSn")
				uni.removeStorageSync("kapianlist")
				uni.removeStorageSync("kapianlist2")
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
								that.wx_phone = "已绑定"
								that.weixin_bind = true
							} else {
								that.qq_ID = "已绑定"
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
		flex-direction: row;
		padding-top: 10px;
		padding-left: 10px;
		align-items: center;

	}

	.textsss {
		width: 50vw;
		font-size: 16px;
		font-weight: bold;
		text-align: left;
	}
</style>