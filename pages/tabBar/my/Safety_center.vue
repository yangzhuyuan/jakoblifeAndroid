<template>
	<view class="safety-page">
		<view class="hero">
			<view class="hero-text">
				<text class="hero-desc">{{ $t('安全中心副标题') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
		</view>
		<text class="section-title">{{ $t('账户信息') }}</text>
		<view class="safety-card">
			<view class="row" @click="Member_name_modification()">
				<view class="icon-box">
					<uni-icons type="person-filled" size="20" color="#3298F7"></uni-icons>
				</view>
				<text class="row-label">{{ $t('会员名') }}</text>
				<view class="row-right">
					<text class="row-value">{{ vip_name }}</text>
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
			<view class="row-line"></view>
			<view class="row" @click="Change_number()">
				<view class="icon-box">
					<uni-icons type="phone-filled" size="20" color="#3298F7"></uni-icons>
				</view>
				<text class="row-label">{{ nameoremail }}</text>
				<view class="row-right">
					<text class="row-value">{{ vip_phone }}</text>
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
			<view class="row-line"></view>
			<view class="row" @click="Password_setting()">
				<view class="icon-box">
					<uni-icons type="locked-filled" size="20" color="#3298F7"></uni-icons>
				</view>
				<view class="row-main">
					<text class="row-label">{{ $t('设置登录密码') }}</text>
					<text class="row-sub">{{ $t('更新您的账户密码') }}</text>
				</view>
				<view class="row-right">
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
		</view>

		<text class="section-title">{{ $t('账户操作') }}</text>
		<view class="safety-card">
			<view class="row" @click="logout()">
				<view class="icon-box">
					<uni-icons type="redo" size="20" color="#3298F7"></uni-icons>
				</view>
				<text class="row-label">{{ $t('退出登录') }}</text>
				<view class="row-right">
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
			<view class="row-line"></view>
			<view class="row" @click="Cancel_account()">
				<view class="icon-box icon-box-danger">
					<uni-icons type="trash-filled" size="20" color="#E54D42"></uni-icons>
				</view>
				<view class="row-main">
					<text class="row-label row-label-danger">{{ $t('注销账号') }}</text>
					<text class="row-sub">{{ $t('永久删除您的账户及相关数据') }}</text>
				</view>
				<view class="row-right">
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
		</view>

		<text v-show="otherloginssd" class="section-title">{{ $t('第三方账号绑定') }}</text>
		<view v-show="otherloginssd" class="safety-card">
			<view class="row" @click="click_other_sign(0)">
				<view class="icon-box icon-box-img">
					<image class="third-icon" src="../../../static/page_icon/icon_weichat.png" mode="aspectFit"></image>
				</view>
				<text class="row-label">{{ $t('微信') }}</text>
				<view class="row-right">
					<text class="row-value">{{ wx_phone }}</text>
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
			<view class="row-line"></view>
			<view class="row" @click="click_other_sign(1)">
				<view class="icon-box icon-box-img">
					<image class="third-icon" src="../../../static/page_icon/icon_QQ.png" mode="aspectFit"></image>
				</view>
				<text class="row-label">QQ</text>
				<view class="row-right">
					<text class="row-value">{{ qq_ID }}</text>
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
		</view>

		<view class="tip-banner">
			<view class="tip-icon">
				<uni-icons type="checkmarkempty" size="14" color="#ffffff"></uni-icons>
			</view>
			<text class="tip-text">{{ $t('账户安全提示') }}</text>
		</view>
	</view>
</template>

<script>
	import {
		isInChinaByIP
	} from '../../api/isInChinaByIP.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	const systemInfo = uni.getSystemInfoSync(); //获取手机信息
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
				otherloginssd: true,
				loact: "",
				nameoremail: '',

			}
		},

		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('安全中心')
			})
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#DCEEFC'
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
			...mapMutations(['setacktypes']),
			getinfor() {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_getInfo,
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
				const appQXTipShown = uni.getStorageSync("appQXTipShown")
				uni.clearStorageSync()
				uni.setStorageSync("appQX", appQX)
				uni.setStorageSync("tongzhi", tongzhi)
				if (appQXTipShown) {
					uni.setStorageSync("appQXTipShown", appQXTipShown)
				}
				this.setacktypes(0)
				uni.setStorageSync("last_app_version", systemInfo.appVersion)
				uni.setStorageSync('userAgreed', true) // 设置缓存，下次进入应用不再弹出
				uni.reLaunch({
					url: '/pages/login/login_land'
				})
			},

			click_other_sign(id) {
				let that = this
				switch (id) {
					case 0:
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
					url: that.$url_APP_IP + that.$url_bind_third,
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

<style scoped>
	.safety-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 36%, #f4f7fb 100%);
		box-sizing: border-box;
		padding: 8px 16px calc(28px + env(safe-area-inset-bottom));
	}

	.hero {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 4px 4px 8px;
		min-height: 96px;
	}

	.hero-text {
		flex: 1;
		padding-right: 12px;
		min-width: 0;
	}

	.hero-desc {
		font-size: 14px;
		line-height: 1.5;
		color: #8a94a6;
		font-weight: 400;
	}

	.hero-img {
		width: 96px;
		height: 96px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.section-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		margin: 20px 4px 12px;
	}

	.safety-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
		padding: 4px 16px;
		margin-bottom: 20px;
		overflow: hidden;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 14px 0;
		min-height: 56px;
		box-sizing: border-box;
	}

	.row-line {
		height: 1px;
		background: #eef1f5;
		margin-left: 52px;
	}

	.icon-box {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: #e8f0fe;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-right: 12px;
	}

	.icon-box-danger {
		background: #fce8e6;
	}

	.icon-box-img {
		background: #f3f6fa;
		padding: 4px;
		box-sizing: border-box;
	}

	.third-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		object-fit: contain;
	}

	.row-main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.row-label {
		flex: 1;
		font-size: 15px;
		font-weight: 600;
		color: #1a2b4a;
		min-width: 0;
	}

	.row-main .row-label {
		flex: none;
	}

	.row-label-danger {
		color: #e54d42;
	}

	.row-sub {
		margin-top: 4px;
		font-size: 12px;
		color: #9ba3af;
		line-height: 1.4;
	}

	.row-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
		margin-left: 8px;
		max-width: 46%;
	}

	.row-value {
		font-size: 14px;
		color: #9ba3af;
		margin-right: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: right;
	}

	.tip-banner {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #ebf3ff;
		border-radius: 14px;
		padding: 14px 16px;
		margin: 20px 0 8px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.tip-icon {
		display: flex;
		flex-direction: row;
		width: 22px;
		height: 22px;
		border-radius: 11px;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-right: 10px;
		margin-top: 1px;
	}

	.tip-text {
		flex: 1;
		font-size: 13px;
		line-height: 1.5;
		color: #3b7dd8;
		font-weight: 500;
	}
</style>