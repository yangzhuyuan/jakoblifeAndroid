<template>
	<view style="padding-top: 20px; background: #F7F7F7; color: black;width: 100vw; height: 100vh;">
		<view class="linear">
			<image class="img_bg" src="../../static/icons/17.png" />
			<input type="number" :placeholder="$t('请输入手机号')" style="width: 70vw;margin-left: 10px; " maxlength="11"
				v-model="unername_phone" />
		</view>
		<view style="display: flex; flex-direction: row;">
			<view class="linear_1">
				<image class="img_bg" src="../../static/icons/18.png" />
				<input type="text" :placeholder="$t('请输入验证码')" style="margin-left: 10px;" maxlength="8"
					v-model="yanzhengma" />
			</view>
			<button class="linear_btn" style="background: #3298F7; color: white;"
				@tap="huoqu">{{yanzheng?$t('获取验证码'): codetime+msg}}</button>
		</view>
		<button class="button_back" @tap="btn_next">{{$t('完成')}}</button>
		<view class="container_bg" v-show="tanchuang">
			<view class="modalss">
				<view style="background: white;  margin-left: 20px;margin-right: 20px;border-radius: 20px;">
					<view
						style="text-align: center; font-size: 16px; color: black; font-weight: bold;padding-top: 20px;">
						{{$t('请填写图形验证码')}}
					</view>
					<view class="modal-content_bg">
						<input class="edit_bg" type="number" :placeholder="$t('请输入图形验证码')" v-model="yzm" />
						<view style="margin-top: 8px;">
							<image :src="yangzhengma_img" style="width: 120px; height: 45px;"></image>
							<view style="text-align: center; color: dodgerblue;margin-top: 10px;" @click="clickCode">
								{{$t('看不清')}}
							</view>
						</view>
					</view>
					<view style="display: flex; flex-direction: row; border-top: 1rpx solid gainsboro;">
						<view class="text_yzm" @click="closeModal_cancle">{{$t('取消')}}
						</view>
						<view style="border-left: 1rpx solid gainsboro;"></view>
						<view class="text_yzm_1" @click="closeModal">{{$t('确定')}}</view>
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
			...mapState(['uuid', 'access_token', 'openid', 'other_types'])
		},
		data() {
			return {
				yangzhengma_img: '', //验证码图片
				msg: this.$t('s后可重发'),
				unername_phone: '',
				yanzhengma: '',
				yanzheng: 1,
				codetime: 0,
				tanchuang: false,
				width: 100,
				height: 35,
				yzm: '',
			}
		},

		onShow(res) {
			//标题名称
			uni.setNavigationBarTitle({
				title: this.$t('绑定手机号')
			})
		},

		methods: {
			...mapMutations(['getImgID']),

			getback(phone, yzm) {
				return {
					background: phone === "" || yzm === "" ? "#DBDBDB" : "#3298F7"
				}
			},

			huoqu() {
				if (!this.unername_phone) {
					uni.showToast({
						title: this.$t('请输入手机号'),
						icon: 'none'
					});
					return;
				}
				if (this.codetime > 0) {
					uni.showToast({
						title: this.$t('不能重复获取'),
						icon: 'none'
					});
					return;
				}
				this.tanchuang = true;
				this.yzm = '';
				this.captchaImage();
			},

			//获取验证码图片
			captchaImage() {
				this.$get(this.$url_captchaImage, {}, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						this.yangzhengma_img = "data:image/png;base64," + res.img;
						this.getImgID(res.uuid)
					}
				})
			},
			//点击切换图形验证码
			clickCode() {
				this.captchaImage();
			},
			//关闭验证码弹窗
			closeModal_cancle() {
				this.tanchuang = false
			},
			//点击校验验证码
			closeModal() {
				if (this.yzm === "" || this.yzm === undefined) {
					uni.showToast({
						title: this.$t('请输入验证码结果'),
						icon: 'none'
					})
					return
				} else {
					const data = {
						code: this.yzm,
						uuid: this.uuid
					}
					this.$post(this.$url_check_code, data, {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					}).then(res => {
						if (res.code == 200) {
							this.tanchuang = false
							this.send_phone_register_code()
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
							this.captchaImage();
						}
					})
				}
			},
			validateInputs() {
				if (!this.unername_phone) {
					this.showToast('请输入手机号');
					return false;
				}
				if (!this.yanzhengma) {
					this.showToast('请输入验证码');
					return false;
				}
				return true;
			},

			showToast(title) {
				uni.showToast({
					title: this.$t(title),
					icon: 'none'
				});
			},
			btn_next() {
				if (!this.validateInputs()) return;
				switch (this.other_types) {
					case 'weixin':
						this.getweixincode();
						break;
					case 'qq':
						this.getqqcode();
						break;
					case 'apple':
						// 如果有苹果相关的逻辑，可以在这里实现
						break;
					default:
						this.bind_phone();
						break;
				}
			},
			//发送手机绑定验证码
			send_phone_register_code() {
				const data = {
					phone: this.unername_phone
				}
				this.$post(this.$url_send_phone_register_code, data, {
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: this.$t('成功'),
							icon: "none"
						})
						this.yanzheng = 0
						if (this.codetime > 0) {
							uni.showToast({
								title: this.$t('不能重复获取'),
								icon: "none"
							})
							return
						} else {
							this.codetime = 60
							this.msg = this.$t('s后可重发')
							let timer = setInterval(() => {
								this.codetime-- + this.msg;
								if (this.codetime < 1) {
									clearInterval(timer);
									this.msg = ''
									this.codetime = this.$t('重新获取')
								}
							}, 1000)
						}
					} else {
						uni.showToast({
							title: this.$t("该手机号已被绑定"),
							icon: 'none'
						})
					}
				})
			},
			//微信使用accessToken和openId登录
			getweixincode() {
				const data = {
					accessToken: this.access_token,
					openId: this.openid,
					code: this.yanzhengma,
					phoneNum: this.unername_phone
				}
				this.$post(this.$url_wechat_login, data, {
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code == 200) {
						uni.setStorageSync("token", res.data)
						uni.showToast({
							title: this.$t("成功"),
							icon: 'none'
						})
						setTimeout(function() {
							uni.navigateTo({
								url: '../../pages/login/Register_success'
							})
						}, 300)
					} else {
						uni.showToast({
							title: this.$t("失败"),
							icon: "none"
						})
					}
				})
			},
			//qq使用accessToken和openId登录
			getqqcode() {
				const data = {
					accessToken: this.access_token,
					openId: this.openid,
					code: this.yanzhengma,
					phoneNum: this.unername_phone
				}
				this.$post(this.$url_qq_login, data, {
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code == 200) {
						uni.setStorageSync("token", res.data)
						uni.showToast({
							title: this.$t("成功"),
							icon: 'none'
						})
						setTimeout(function() {
							uni.navigateTo({
								url: '../../pages/login/Register_success'
							})
						}, 300)
					} else {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
					}
				})
			},
			//第三方登录后用户绑定手机号
			bind_phone() {
				const data = {
					code: this.yanzhengma,
					phoneNum: this.unername_phone
				}
				this.$put(this.$url_bind_phone, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: this.$t("成功"),
							icon: 'none'
						})
						setTimeout(function() {
							uni.navigateTo({
								url: '../../pages/login/Register_success'
							})
						}, 300)
					} else if (res.data.code === 500) {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: this.$t("该手机号已被绑定"),
							icon: 'none'
						})
					}
				})
			},

		}
	}
</script>

<style>
	.linear {
		width: auto;
		height: 54px;
		margin-top: 24px;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: white;
		border-radius: 40px;
	}

	.img_bg {
		width: 20px;
		height: 20px;
		margin-left: 20px;
	}

	.linear_1 {
		width: auto;
		height: 54px;
		margin-top: 24px;
		margin-left: 20px;
		margin-right: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: white;
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.linear_btn {
		width: 125px;
		height: 54px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 24px;
		margin-right: 20px;
		font-size: 14px;
		text-align: center;
		border-radius: 10px 30px 30px 10px;
		background: #3298F7;
		color: white;
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


	.tanchuangstyle {
		width: auto;
		background: white;
		margin-left: 20px;
		margin-right: 20px;
		border-radius: 20px;
	}

	.tanchuangstyle_1 {
		text-align: center;
		height: 22px;
		font-size: 16px;
		color: #1A1A1A;
		font-weight: 600;
		padding-top: 20px;
	}

	.edit_bg {
		color: black;
		margin-left: 10px;
		padding: 10px;
		height: 35px;
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
		font-size: 16px;
		height: 62px;
		font-weight: 400;
		width: 45vw;
	}

	.text_yzm_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 45vw;
		height: 62px;
		font-size: 16px;
		font-weight: 400;
		color: dodgerblue
	}

	.button_back {
		width: auto;
		margin: 40px 20px 0 20px;
		background: #3298F7;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		color: #FFFFFF !important;
	}
</style>