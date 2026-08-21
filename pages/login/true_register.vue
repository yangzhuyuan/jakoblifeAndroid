<template>
	<view class="register-page">
		<!-- 用户名输入 -->
		<view class="input-group">
			<image class="input-icon" src="../../static/icons/15.png" />
			<input type="text" :placeholder="$t('请输入会员名')" maxlength="32" v-model="vip_unername" />
		</view>

		<!-- 密码输入 -->
		<view class="input-group">
			<image class="input-icon" src="../../static/icons/16.png" />
			<input :type="isPassword1 ? 'password' : 'text'" maxlength="16" :placeholder="$t('请输入密码')"
				v-model="vip_password" />
			<image class="input-icon" :src="isPassword1 ? urlicon1 : urlicon2" @click="img_mima1" />
		</view>

		<!-- 密码提示 -->
		<view class="password-hint" :style="{ color: passwordHintColor }">
			{{ $t('请输入不小于八位数密码') }}
		</view>

		<!-- 确认密码输入 -->
		<view class="input-group">
			<image class="input-icon" src="../../static/icons/16.png" />
			<input :type="isPassword2 ? 'password' : 'text'" maxlength="16" :placeholder="$t('请确认密码')"
				v-model="vip_password_2" />
			<image class="input-icon" :src="isPassword2 ? urlicon3 : urlicon4" @click="img_mima2" />
		</view>

		<!-- 密码不一致提示 -->
		<view v-show="showPasswordMismatch" class="error-hint">
			{{ $t('两次输入的密码不一致') }}
		</view>

		<!-- 国家选择器 -->
		<!-- <view class="country-selector">
			<view class="country-label">{{ $t('所在国家') }}：</view>
			<CountryPicker :language="isChineseLang ? 'chinese' : 'english'" @change="onCountryChange"
				:modename="modeName" />
		</view> -->

		<!-- 底部协议和注册按钮 -->
		<view class="footer">
			<view class="agreement">
				<checkbox class="round-checkbox" color="#ffffff" activeBorderColor="#D2D2D2"
					activeBackgroundColor="#3298F7" :checked="isAgreed" @click="toggleAgreement" />
				<text class="agreement-text">{{ $t('已阅读并同意') }}</text>
				<text class="agreement-link" @click="Service_Agreement">
					{{ $t('JakobLife软件服务使用协议') }}
				</text>
			</view>
			<button class="register-btn" @click="True_Register">
				{{ $t('创建我的帐户') }}
			</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		isInChinaByIP
	} from '../api/isInChinaByIP.js'
	import CountryPicker from '@/pages/components/CountryPicker.vue'
	import Vue from 'vue'
	import {
		setActiveAppRegion
	} from '@/pages/api/appBaseHosts.js'

	export default {
		name: 'RegisterPage',
		components: {
			CountryPicker
		},
		computed: {
			...mapState(['tokens', 'unername']),
			// 判断是否为中文语言
			isChineseLang() {
				return this.lan === 'zh-Hans' || this.lan === 'zh-Hant'
			},
			// 密码提示颜色
			passwordHintColor() {
				return this.isPasswordValid ? '#3298F7' : '#F55A5A'
			}
		},
		data() {
			return {
				// 表单数据
				vip_unername: '',
				vip_password: '',
				vip_password_2: '',
				// 协议同意状态
				isAgreed: false,
				// 密码显示控制
				isPassword1: true,
				isPassword2: true,
				// 图标路径
				urlicon1: "../../static/icons/mima_1.png",
				urlicon2: "../../static/icons/mima_2.png",
				urlicon3: "../../static/icons/mima_1.png",
				urlicon4: "../../static/icons/mima_2.png",
				// 地区相关
				location: '',
				// 当前语言
				lan: uni.getLocale(),
				// 国家选择器
				modeName: 'edit',
				// 错误状态
				showPasswordMismatch: false,
				isPasswordValid: true
			}
		},
		onShow() {
			this.checkLocationAndAgreement()
		},
		onLoad() {
			this.setNavigationTitle()
		},
		methods: {
			...mapMutations(['register_token', 'register_unername']),

			// 设置导航栏标题
			setNavigationTitle() {
				uni.setNavigationBarTitle({
					title: this.$t('注册')
				})
			},

			// 检查地区并监听协议同意事件
			async checkLocationAndAgreement() {
				try {
					const isInChina = await isInChinaByIP()
					this.location = isInChina ? "境内" : "境外"

					// 监听协议页面返回的数据
					uni.$once('checked', (data) => {
						this.isAgreed = data
					})
				} catch (error) {
					console.error('获取地区失败:', error)
					this.location = "境外" // 默认境外
				}
			},

			// 国家选择回调
			onCountryChange(country) {
				console.log('选中国家:', country)
				this.modeName = country.name
			},

			// 切换协议同意状态
			toggleAgreement() {
				this.isAgreed = !this.isAgreed
			},

			// 跳转服务协议页面
			Service_Agreement() {
				uni.navigateTo({
					url: `../service/Service_Agreement?CB=${this.isAgreed}`
				})
			},

			// 切换密码可见性
			img_mima1() {
				this.isPassword1 = !this.isPassword1
			},

			img_mima2() {
				this.isPassword2 = !this.isPassword2
			},

			// 显示错误提示
			showError(message) {
				uni.showToast({
					title: message,
					icon: 'none'
				})
			},

			// 重置错误状态
			resetErrors() {
				this.showPasswordMismatch = false
				this.isPasswordValid = true
			},

			// 表单验证
			validateForm() {
				this.resetErrors()

				// 验证会员名
				if (!this.vip_unername.trim()) {
					this.showError(this.$t('会员名未设置'))
					return false
				}

				// 验证密码
				if (!this.vip_password) {
					this.showError(this.$t('密码未设置'))
					return false
				}

				if (this.vip_password.length < 8) {
					this.isPasswordValid = false
					this.showError(this.$t('密码不能低于8位数'))
					return false
				}

				// 验证确认密码
				if (!this.vip_password_2) {
					this.showError(this.$t('再次输入的密码未设置'))
					return false
				}

				if (this.vip_password !== this.vip_password_2) {
					this.showPasswordMismatch = true
					this.showError(this.$t('两次输入的密码不一致'))
					return false
				}

				// // 验证国家选择
				// if (!this.modeName || this.modeName === "edit") {
				// 	this.showError(this.$t('请选择国家'))
				// 	return false
				// }

				// 验证协议同意
				if (!this.isAgreed) {
					this.showError(this.$t('请阅读并同意JakobLife软件服务使用协议'))
					return false
				}

				return true
			},

			// 注册主流程
			async True_Register() {
				if (!this.validateForm()) return
				// 设置API地址
				// const isChina = this.modeName === "中国" || this.modeName === "China"
				// setActiveAppRegion(isChina ? 'cn' : 'us', Vue)
				uni.showLoading({
					title: this.$t('注册中'),
					mask: true
				})
				await this.register()
			},

			// 调用注册API
			register() {
				const requestData = {
					username: this.vip_unername,
					password: this.vip_password,
					code: "",
					uuid: "",
					smsCode: "",
					email: '',
					phone: "",
					userType: '01',
					phoneNum: "",
					nickName: '',
					remark: this.$url_APP_IP
				}
				this.$post(this.$url_APP_IP + "/prod-api/app/register", requestData, {
					'content-type': 'application/json;charset=UTF-8'
				}).then(this.handleRegisterResponse).catch(this.handleRegisterError)
			},
			// 处理注册响应
			handleRegisterResponse(res) {
				uni.hideLoading()
				switch (res.code) {
					case 200:
						this.handleRegisterSuccess(res)
						break
					case 500:
						this.showError(this.$t("注册账号已存在"))
						break
					default:
						this.showError(res.msg || this.$t("注册失败"))
						break
				}
			},

			// 处理注册成功
			handleRegisterSuccess(res) {
				this.register_token(res.token)
				this.register_unername(this.vip_unername)
				uni.showToast({
					title: this.$t("成功"),
					icon: 'none'
				})
				// const isChina = this.modeName === "中国" || this.modeName === "China"
				const isChina = this.location === "境内"
				// 根据地区跳转
				setTimeout(() => {
					const navigationTarget = isChina ? '../login/Bind_phone' : "/pages/login/true_register_email"
					// const navigationTarget = "/pages/login/true_register_email"
					uni.navigateTo({
						url: navigationTarget
					})
				}, 300)
			},

			// 处理注册错误
			handleRegisterError(error) {
				uni.hideLoading()
				console.error('注册请求失败:', error)
				this.showError(this.$t('网络错误请稍后重试'))
			}
		}
	}
</script>

<style scoped>
	.register-page {
		padding-top: 10px;
		background: #F7F7F7;
		color: black;
		min-height: 100vh;
	}

	/* 输入框组样式 */
	.input-group {
		height: 54px;
		margin: 24px 20px 0 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: white;
		border-radius: 40px;
		padding: 0 20px;
	}

	.input-group .input-icon {
		width: 20px;
		height: 20px;
		margin-right: 15px;
		flex-shrink: 0;
	}

	.input-group input {
		flex: 1;
		font-size: 16px;
	}

	/* 密码提示 */
	.password-hint {
		margin: 15px 0 0 40px;
		font-size: 14px;
		transition: color 0.2s ease;
	}

	/* 错误提示 */
	.error-hint {
		margin: 15px 0 0 40px;
		color: #F55A5A;
		font-size: 14px;
	}

	/* 国家选择器 */
	.country-selector {
		height: 54px;
		margin-top: 24px;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background-color: white;
		border-radius: 40px;
		padding: 0 20px;
	}

	.country-label {
		font-size: 14px;
		font-weight: bold;
		margin-right: 10px;
		flex-shrink: 0;
	}

	/* 底部区域 */
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.agreement {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-left: 20px;
		margin-bottom: 10px;
	}

	.round-checkbox {
		font-size: 12px;
		transform: scale(0.8);
	}

	.agreement-text {
		font-size: 12px;
		margin-left: 5px;
	}

	.agreement-link {
		color: cornflowerblue;
		font-size: 12px;
		margin-left: 5px;
	}

	/* 注册按钮 */
	.register-btn {
		margin: 20px 20px 30px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		border: none;
	}
</style>