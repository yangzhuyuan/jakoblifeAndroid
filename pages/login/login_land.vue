<template>
	<view style="padding:80px 0 0 0; background: #F7F7F7; color: black;height: 100vh;">
		<view style="background: #F7F7F7; padding: 20px;">
			<view class="title_bg">{{$t('login.title_0')}}</view>
			<view class="title_bg">{{$t('login.title_1')}}</view>
			<view class="linear">
				<image class="img_style" src="../../static/icons/15.png" />
				<input type="text" :placeholder="$t('login.input_0')" style="width: 70vw;margin-left: 10px;"
					v-model="unername" />
			</view>
			<view v-if="mm_yzm">
				<view class="linear">
					<image class="img_style" src="../../static/icons/16.png" />
					<input type="text" :password=isPassword :placeholder="$t('login.input_1')"
						style="width: 55vw; margin-left: 10px;margin-right: 20px;" v-model="passwrod" />
					<image class="img_style" :src="isPassword ? urlicon1 : urlicon2" @tap="img_mima" />
				</view>
				<view style="margin-top: 20px; display: flex;flex-direction:row;">
					<view class="text_bg" @tap="Forget">{{$t('login.text_0')}}</view>
					<view class="text_bg_1" @click="duanxiuan">{{$t('login.text_1')}}</view>
				</view>
			</view>
			<view v-else>
				<view style="display: flex; flex-direction: row;">
					<view class="linear_1">
						<image class="img_style" src="../../static/icons/18.png" />
						<input type="text" :placeholder="$t('login.input_2')" style="margin-left: 10px; width: 35vw;"
							maxlength="8" v-model="yanzhengma" />
					</view>
					<button class="linear_btn" @tap="huoqu">{{yanzheng?$t('login.text_3'): codetime+msg}}</button>
				</view>
				<view style="margin-top: 20px; display: flex;flex-direction:row;">
					<view class="text_bg"></view>
					<view class="text_bg_1" @click="MMDL()">{{$t('login.text_2')}}</view>
				</view>
			</view>
			<view class="linear_ck">
				<checkbox class="round" color="#ffffff" activeBorderColor="#D2D2D2" activeBackgroundColor="#3298F7"
					:checked="cb" @click="checked">
				</checkbox>
				<view style="display: flex;flex-direction: row;align-items: center;">
					<view style="color: black; font-size: 16px;">{{$t('login.text_4')}}</view>
					<view style="color: #3298F7;font-size: 14px;" @tap="Service_Agreement">{{$t('login.text_5')}}
					</view>
				</view>
			</view>
			<button class="button_back" :style="getback(unername,passwrod,yanzhengma,cb)"
				@tap="login_sumbit1">{{$t('login.text_6')}}</button>
			<view
				style="display: flex; flex-direction: row;margin-top: 30px;justify-content: center;align-items: center;">
				<view style="font-size: 16px;text-align: center;color: black;">{{$t('login.text_7')}}
				</view>
				<view style="color: #3298F7;font-size: 16px;" @click="login_land()">
					{{$t('login.text_8')}}
				</view>
			</view>
			<view
				style=" display: flex;justify-content: center; align-items: center;flex-direction: column;padding-top: 120px;">
				<view style="display: flex;justify-content: center;align-items: center; display: flex;font-size: 14px;">
					<view style="background: gainsboro; width: 80px; height: 1px; margin-right: 10px"></view>
					<view style="font-size: 16px;">其它登录方式</view>
					<view style="background: gainsboro; width: 80px; height: 1px;margin-left: 10px;"></view>
				</view>
				<view style="display:flex;justify-content: center;margin-top: 40px;">
					<image @click="other_sbuitm('weixin')" class="img_dsf1" src="../../static/weixin.jpg" />
					<image @click="other_sbuitm('qq')" class="img_dsf" src="../../static/qq.jpg" />
					<image @click="other_sbuitm('apple')" class="img_dsf" src="../../static/pingguodenglu.png" />
				</view>
			</view>
		</view>
		<view class="container_bg" v-show="tanchuang">
			<view class="modalss">
				<view style="background: white;  margin-left: 20px;margin-right: 20px;border-radius: 20px;">
					<view
						style="text-align: center; font-size: 16px; color: black; font-weight: bold;padding-top: 20px;">
						{{$t('login.text_10')}}
					</view>
					<view class="modal-content_bg">
						<input class="edit_bg" type="number" :placeholder="$t('login.text_11')" v-model="yzm" />
						<view>
							<image :src="yangzhengma_img" style="width: 120px; height: 45px;"></image>
							<view style="text-align: center; color: dodgerblue;margin-top: 10px;" @click="clickCode">
								{{$t('login.text_12')}}
							</view>
						</view>
					</view>
					<view style="display: flex; flex-direction: row; border-top: 1rpx solid gainsboro;">
						<view class="text_yzm" @click="closeModal_cancle">{{$t('login.text_14')}}
						</view>
						<view style="border-left: 1rpx solid gainsboro;"></view>
						<view class="text_yzm_1" @click="closeModal">{{$t('login.text_13')}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			...mapState(['uuid'])
		},
		data() {
			return {
				yangzhengma_img: '',
				unername: uni.getStorageSync("unername") != "" ? uni.getStorageSync("unername") : '', //会员名或手机号
				passwrod: "", //密码
				yanzhengma: '',
				tanchuang: false, //数字验证弹窗
				mm_yzm: true, //显示密码或验证码
				yanzheng: 1, //验证码读秒后显示的内容
				isPassword: true, //判断密码是否可见
				codetime: 0, //验证码秒数
				cb: true, //选择框
				urlicon1: "../../static/icons/mima_1.png", //密码可见iocn
				urlicon2: "../../static/icons/mima_2.png", //密码不可见icon
				msg: this.$t('zhuceitem.input_3'),
				yzm: "", //验证码
			}
		},

		// onReady() {
		// 	plus.navigator.setStatusBarStyle('dark'); // light（白色）、dark（黑色）
		// },

		//禁止手机物理按键返回上一层
		onBackPress(options) {
			if (options.from === 'backbutton') {
				return false;
			}
			return false
		},


		onShow() {
			let that = this;
			//使用协议返回过来的数据
			uni.$once('checked', function(data) {
				that.cb = data
			})
		},


		onLoad() {
			// if (uni.getStorageSync("token") == "" || uni.getStorageSync("token") == undefined) {
			// 	this.fastLoginFn()
			// 	console.log('bbbbb')
			// }
		},

		methods: {
			...mapMutations(['getImgID', 'other_sign_access_token', 'other_sign_openid', 'other_sign_other_types']),


			getback(name, mm, yzm, cb) {
				if (this.mm_yzm == true) {
					return {
						background: name === "" || mm === "" || cb == false ? "#DBDBDB" : "#3298F7"
					}
				} else {
					return {
						background: name === "" || yzm == "" || cb == false ? "#DBDBDB" : "#3298F7"
					}
				}
			},


			//服务协议
			Service_Agreement() {
				uni.navigateTo({
					url: "../service/Service_Agreement?CB=" + this.cb
				})
			},
			//忘记密码
			Forget() {
				uni.navigateTo({
					url: '/pages/login/Forget_password'
				})
			},

			//注册
			login_land() {
				uni.navigateTo({
					url: "/pages/login/true_register"
				})
			},

			//点击切换验证码图片
			clickCode() {
				this.captchaImage()
			},

			//关闭验证码弹窗
			closeModal_cancle() {
				this.tanchuang = false
			},

			//点击校验验证码
			closeModal() {
				if (this.yzm === "" || this.yzm === undefined) {
					uni.showToast({
						title: this.$t('login.text_19'),
						icon: 'none'
					})
					return
				} else {
					let that = this
					uni.request({
						url: that.$url_check_code,
						method: 'POST',
						data: {
							code: that.yzm,
							uuid: that.uuid
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
						},
						success(res) {
							if (res.statusCode == 200) {
								if (res.data.code == 200) {
									console.log("校验验证码", res.data)
									that.tanchuang = false
									that.send_login_code()
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
									that.captchaImage()
								}
							}
							console.log("校验验证码", res)
						}
					})
				}
			},

			//点击获取验证码
			huoqu() {
				if (this.unername == "" || this.unername == undefined) {
					uni.showToast({
						title: this.$t('login.text_16'),
						icon: "none"
					})
					return
				}
				if (this.codetime > 0) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_5'),
						icon: "none"
					})
					return
				} else {
					this.tanchuang = true
					this.yzm = ''
					this.captchaImage();
				}
			},

			//获取验证码图片
			captchaImage() {
				let _that = this
				uni.request({
					url: _that.$url_captchaImage,
					method: 'GET',
					header: {
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log('获取图形验证码', res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								_that.yangzhengma_img = "data:image/png;base64," + res.data.img;
								_that.getImgID(res.data.uuid)
							} else {
								console.log(res.data.code)
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(erro) {
						console.log(erro)
					}
				})
			},

			//发送手机登录验证码
			send_login_code() {
				let that = this
				uni.request({
					url: that.$url_send_login_code,
					method: 'POST',
					data: {
						phone: that.unername
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						console.log("发送手机登录验证码", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								that.yanzheng = 0
								if (that.codetime > 0) {
									uni.showToast({
										title: that.$t('zhuceitem.toast_5'),
										icon: "none"
									})
									return
								} else {
									that.codetime = 60
									that.msg = that.$t('zhuceitem.input_3')
									let timer = setInterval(() => {
										that.codetime-- + that.msg;
										if (that.codetime < 1) {
											clearInterval(timer);
											that.msg = ''
											that.codetime = that.$t('zhuceitem.input_4')
										}
									}, 1000)

								}
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}
					}
				})
			},

			//登录
			login_sumbit1() {
				if (this.mm_yzm == true) {
					if (this.unername == "" || this.unername == undefined) {
						uni.showToast({
							title: this.$t('login.input_0'),
							icon: 'none',
						})
						return
					} else if (this.passwrod == "" || this.passwrod == undefined) {
						uni.showToast({
							title: this.$t('login.input_1'),
							icon: 'none'
						})
						return
					} else if (this.cb == false) {
						uni.showToast({
							title: this.$t('login.text_17'),
							icon: "none"
						})
						return
					} else {
						this.user_login()
					}
				} else {
					if (this.unername === "" || this.unername === undefined) {
						uni.showToast({
							title: this.$t('login.input_0'),
							icon: 'none'
						})
						return
					} else if (this.yanzhengma === "" || this.yanzhengma === undefined) {
						uni.showToast({
							title: this.$t('login.text_18'),
							icon: 'none'
						})
						return
					} else if (this.cb == false) {
						uni.showToast({
							title: this.$t('login.text_17'),
							icon: "none"
						})
						return
					} else {
						this.app_login()
					}
				}
			},

			//用户名登录
			user_login() {
				uni.request({
					url: this.$url_user_login,
					method: 'POST',
					data: {
						username: this.unername,
						password: this.passwrod,
						code: this.yzm,
						uuid: this.uuid,
						smsCode: this.yanzhengma,
						email: '',
						phone: this.unername,
					},
					header: {
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: (res) => {
						console.log("用户名登录", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.setStorageSync("token", res.data.token)
								uni.setStorageSync("unername", this.unername)
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								setTimeout(function() {
									uni.switchTab({
										url: "../tabBar/main/Main"
									})
								}, 300)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}
					},
					fail(res) {
						console.log("失败", res)
					}
				});
			},
			//手机验证码登录
			app_login() {
				uni.request({
					url: this.$url_app_login,
					method: 'POST',
					data: {
						smsCode: this.yanzhengma,
						phoneNum: this.unername
					},
					header: {
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: (res) => {
						console.log("手机验证码登录", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.setStorageSync("token", res.data.token)
								uni.setStorageSync("unername", this.unername)
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								setTimeout(function() {
									uni.switchTab({
										url: "../tabBar/main/Main"
									})
								}, 300)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}
					},
					fail(res) {
						console.log("失败", res)
					}
				});
			},
			//判断点击是否选中服务协议
			checked() {
				if (this.cb == true) {
					this.cb = false;
				} else {
					this.cb = true;
				}
			},

			//判断点击密码是否可见
			img_mima() {
				if (this.isPassword == true) {
					this.isPassword = false
				} else {
					this.isPassword = true
				}
			},

			//点击切断到短信登录
			duanxiuan() {
				this.mm_yzm = false
			},
			//点击切断到密码登录
			MMDL() {
				this.mm_yzm = true
			},
			//一键登录
			fastLoginFn() {
				console.log("手机号一键登录")
				var this_ = this
				uni.login({
					provider: "univerify",
					univerifyStyle: {
						"fullScreen": true, // 是否全屏显示，默认值： false
						"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
						"backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）
						"icon": {
							"path": "../../../static/icons/60x60.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
							"width": "60px", //图标宽度 默认值：60px
							"height": "60px" //图标高度 默认值：60px
						},
						"closeIcon": {
							"path": "../../../static/icons/60x60.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
							"width": "60px", //图标宽度 默认值：60px (HBuilderX 4.0支持)
							"height": "60px" //图标高度 默认值：60px (HBuilderX 4.0支持)
						},
						"phoneNum": {
							"color": "#202020" // 手机号文字颜色 默认值：#202020
						},
						"slogan": {
							"color": "#BBBBBB" //  slogan 字体颜色 默认值：#BBBBBB
						},
						"authButton": {
							"normalColor": "#3479f5", // 授权按钮正常状态背景颜色 默认值：#3479f5
							"highlightColor": "#2861c5", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
							"disabledColor": "#73aaf5", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
							"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff
							"title": "确认注册", // 授权按钮文案 默认值：“本机号码一键登录”
							"borderRadius": "24px" // 授权按钮圆角 默认值："24px" （按钮高度的一半）
						},
						"otherLoginButton": {
							"visible": true, // 是否显示其他登录按钮，默认值：true
							"normalColor": "#DBDBDB", // 其他登录按钮正常状态背景颜色 默认值：透明
							"highlightColor": "", // 其他登录按钮按下状态背景颜色 默认值：透明
							"textColor": "#ffffff", // 其他登录按钮文字颜色 默认值：#656565
							"title": "其他登录方式", // 其他登录方式按钮文字 默认值：“其他登录方式”
							"borderColor": "#ffffff", //边框颜色 默认值：透明（仅iOS支持）
							"borderRadius": "24px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
						},
						"privacyTerms": {
							"defaultCheckBoxState": false, // 条款勾选框初始状态 默认值： true
							"isCenterHint": true, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
							"uncheckedImage": "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
							"checkedImage": "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
							"checkBoxSize": 16, // 可选 条款勾选框大小
							"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB
							"fontSize": 14,
							"termsColor": "#5496E3", //  协议文字颜色 默认值： #5496E3
							"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
							"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
							"privacyItems": [ // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
								{
									"url": "https://jakoblife.jakob-techs.com/privacy.html", // 点击跳转的协议详情页面
									"title": "用户服务协议" // 协议名称
								}
							]
						},
					},
					success: (res) => {
						console.log("一键登录调用返回的数据", res)
						uniCloud.callFunction({
								name: "getPhoneNumber", // 云函数名称
								data: {
									access_token: res.authResult.access_token, // 客户端一键登录接口返回的access_token
									openid: res.authResult.openid // 客户端一键登录接口返回的openid
								}
							})
							.then((dataRes) => {
								console.log("云函数返回的参数", dataRes)
								let phone = dataRes.result.phoneNumber
								console.log("云函数返回的参数手机号", phone)
								// this.userPhone = dataRes.result.data.phoneNumber
								// // 这里进行登录操作
								// this.loginFast({
								// 	phone
								// })
							})
							.catch((err) => {
								console.log("云函数报错", err)
								uni.showToast({
									title: err.errMsg,
									icon: "none"
								})
								this_ = this
								setTimeout(() => {
									uni.closeAuthView() //关闭一键登录弹出窗口
									this_.onClickMsgLogin()
								}, 500)
							})
						uni.showToast({
							title: res.authResult,
							icon: "none"
						})
						// console.log("云函数调用返回数据", dataRes)
					},
					fail(err) {
						// 登录失败或者点击其他登录方式,自定义按钮等
						console.log("一键登录uni.login失败", err)
						setTimeout(() => {
							uni.closeAuthView() //关闭一键登录弹出窗口
							this_.onClickMsgLogin()
						}, 500)
					}
				})
			},
			//第三方登录
			other_sbuitm(type) {
				let that = this
				switch (type) {
					case "weixin":
						uni.login({
							provider: 'weixin',
							// onlyAuthorize: true, // 微信登录仅请求授权认证
							success: function(res) {
								console.log("客户端成功获取授权", res);
								that.check_auth(res.authResult.access_token, res.authResult.openid, "weixin")
							},
							fail: function(err) {
								// 登录授权失败
								// err.code是错误码
								uni.showToast({
									title: err,
									icon: 'none'
								})
							}
						});
						break;
					case "qq":
						uni.login({
							provider: 'qq',
							success: function(loginRes) {
								console.log(loginRes);
								that.check_auth(loginRes.authResult.access_token, loginRes.authResult.openid,
									"qq")
							},
							fail: function(err) {
								// 登录授权失败
								// err.code是错误码
								uni.showToast({
									title: err,
									icon: 'none'
								})
							}
						});
						break
					case "apple":
						uni.login({
							provider: 'apple',
							success: function(loginRes) {
								console.log(loginRes.authResult);
								that.check_auth(loginRes.authResult.access_token, loginRes.authResult.openid,
									"apple")
							},
							fail: function(err) {
								// 登录授权失败
								// err.code是错误码
								uni.showToast({
									title: err,
									icon: 'none'
								})
							}
						});
						break
				}
			},

			//校验第三方账号是否已注册
			check_auth(access_token, openid, othersss_types) {
				let that = this
				uni.request({
					url: that.$url_check_auth,
					method: 'POST',
					data: {
						openId: openid
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						console.log("校验第三方账号是否已注册", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.setStorageSync("token", res.data.data)
								uni.switchTab({
									url: '/pages/tabBar/main/Main'
								})
							} else {
								that.other_sign_access_token(access_token)
								that.other_sign_openid(openid)
								that.other_sign_other_types(othersss_types)
								uni.reLaunch({
									url: '../login/Force_binding_phone'
								})
							}
						} else {
							console.log(res)
						}
					}
				})
			},
		}
	}
</script>

<style>
	.title_bg {
		color: black;
		height: 50px;
		margin-left: 10px;
		font-size: 28px;
		font-weight: bold;
	}

	.linear {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 50px;
		background-color: white;
		border-radius: 40px;
		margin: 20px 0 0 0;
		padding: 0 20px 0 20px;
	}

	.linear_1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 50px;
		background-color: white;
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		margin: 20px 0 0 0;
		padding: 0 20px 0 20px;
	}

	.linear_btn {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		margin-left: 10px;
		height: 50px;
		font-size: 12px;
		text-align: center;
		width: 60vw;
		line-height: 18px;
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
		background: #3298F7;
		color: white;
		/* white-space: nowrap;
		text-overflow: ellipsis;
		overflow: auto; */
	}

	.img_style {
		width: 20px;
		height: 20px;
	}

	.text_bg {
		font-size: 16px;
		color: cornflowerblue;
		width: 50vw;
		margin-left: 10px;
	}

	.text_bg_1 {
		font-size: 16px;
		color: cornflowerblue;
		width: 50vw;
		text-align: right;
		margin-right: 10px
	}

	.linear_ck {
		flex-direction: row;
		display: flex;
		margin-top: 40px;
		margin-left: 30px;
		/* align-items: center; */
	}

	.button_back {
		background: #3298F7;
		margin: 20px 30px 0 30px;
		color: white;
		border-radius: 30px;
		font-weight: bold;
	}

	.img_dsf {
		border-radius: 20px;
		height: 50px;
		width: 50px;
		margin-left: 15px;
	}

	.img_dsf1 {
		border-radius: 20px;
		height: 50px;
		width: 50px;
	}




	.container_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.modalss {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		justify-content: center;
		align-items: center;
	}

	.edit_bg {
		color: black;
		margin-left: 10px;
		padding: 10px;
		margin-top: 5px;
		font-size: 14px;
		border-radius: 10px;
		margin-right: 10px;
		background: #F5F5F5;
	}

	.modal-content_bg {
		background-color: #fff;
		padding: 20px;
		display: flex;
		flex-direction: row;
		border-radius: 8px;
	}


	.text_yzm {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 45px;
		font-size: 16px;
		font-weight: bold;
		width: 45vw;
	}

	.text_yzm_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 45px;
		width: 45vw;
		font-size: 16px;
		font-weight: bold;
		color: dodgerblue
	}
</style>