<template>
	<view style="padding-top: 20px; background: #F7F7F7; color: black;width: 100vw; height: 100vh;">
		<view class="linear">
			<image class="img_bg" src="../../../static/icons/17.png" />
			<input type="number" :placeholder="loact==='境内'?$t('请输入手机号'):$t('请输入邮箱')"
				style="width: 70vw;margin-left: 10px; " maxlength="11" v-model="unername_phone" />
		</view>

		<view style="display: flex; flex-direction: row;">
			<view class="linear_1">
				<image class="img_bg" src="../../../static/icons/18.png" />
				<input type="number" :placeholder="$t('请输入验证码')" style="margin-left: 10px;" maxlength="8"
					v-model="yanzhengma" />
			</view>
			<button class="linear_btn" style="background: #3298F7; color: white;"
				@tap="huoqu">{{yanzheng?$t('获取验证码'): codetime+msg}}</button>
		</view>
		<button class="button_back" @tap="btn_next">{{$t('下一步')}}</button>


		<view class="container_bg" v-show="tanchuang">
			<view class="modalss">
				<view style="background: white;  margin-left: 20px;margin-right: 20px;border-radius: 20px;">
					<view
						style="text-align: center; font-size: 16px; color: black; font-weight: bold;padding-top: 20px;">
						{{$t('请填写图形验证码')}}
					</view>
					<view class="modal-content_bg">
						<input class="edit_bg" type="number" :placeholder="$t('请输入图形验证码')" v-model="yzm" />
						<view>
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
			...mapState(['uuid'])
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
				yzm: '',
				loact: "",
			}
		},

		onLoad(res) {
			//带过来的数据res
			console.log(res)
			//标题名称
			uni.setNavigationBarTitle({
				title: this.$t('重置密码')
			})
			this.loact = res.loact
		},

		methods: {
			...mapMutations(['login', 'getImgID']),

			getback(phone, yzm) {
				return {
					background: phone === "" || yzm === "" ? "#DBDBDB" : "#3298F7"
				}
			},

			huoqu() {
				if (this.unername_phone == "" || this.unername_phone == undefined) {
					uni.showToast({
						title: this.loact === '境内' ? this.$t('请输入手机号') : this.$t('请输入邮箱'),
						icon: 'none'
					})
					return
				} else if (this.codetime > 0) {
					uni.showToast({
						title: this.$t('不能重复获取'),
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
				this.$get(this.$url_captchaImage, {}, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						this.yangzhengma_img = "data:image/png;base64," + res.img;
						this.getImgID(res.uuid)
					}
				})
			},


			//点击验证码，切换
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
						'content-type': 'application/x-www-form-urlencoded'
					}).then(res => {
						if (res.code == 200) {
							console.log("校验验证码", res)
							this.tanchuang = false
							if (this.loact === "境内") {
								this.send_phone_reset_code()
							} else if (this.loact === "境外") {
								this.send_email_reset_code()
							}
						} else {
							uni.showToast({
								title: this.$t("图形验证错误"),
								icon: 'none'
							})
							this.captchaImage();
						}
					})
				}
			},


			btn_next() {
				if (this.unername_phone === "" || this.unername_phone === undefined) {
					uni.showToast({
						title: this.$t('请输入手机号'),
						icon: 'none'
					})
					return
				} else if (this.yanzhengma === "" || this.yanzhengma === undefined) {
					uni.showToast({
						title: this.$t('请输入验证码'),
						icon: 'none'
					})
					return
				} else {
					if (this.loact === "境内") {
						this.check_reset_code()
					} else if (this.loact === "境外") {
						this.check_reset_code1()
					}
				}
			},
			//发送重置密码短信
			send_phone_reset_code() {
				let that = this
				uni.request({
					url: that.$url_send_phone_reset_code,
					method: 'POST',
					data: {
						phone: that.unername_phone
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						console.log("发送重置密码短信", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								that.yanzheng = 0
								if (that.codetime > 0) {
									uni.showToast({
										title: that.$t('不能重复获取'),
										icon: "none"
									})
									return
								} else {
									that.codetime = 60
									that.msg = that.$t('s后可重发')
									let timer = setInterval(() => {
										that.codetime-- + that.msg;
										if (that.codetime < 1) {
											clearInterval(timer);
											that.msg = ''
											that.codetime = that.$t('重新获取')
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
			//发送重置密码邮件
			send_email_reset_code() {
				let that = this
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/app/send_email_reset_code",
					method: 'POST',
					data: {
						email: that.unername_phone
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						console.log("发送重置密码短信", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								that.yanzheng = 0
								if (that.codetime > 0) {
									uni.showToast({
										title: that.$t('不能重复获取'),
										icon: "none"
									})
									return
								} else {
									that.codetime = 60
									that.msg = that.$t('s后可重发')
									let timer = setInterval(() => {
										that.codetime-- + that.msg;
										if (that.codetime < 1) {
											clearInterval(timer);
											that.msg = ''
											that.codetime = that.$t('重新获取')
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

			//校验重置密码验证码
			check_reset_code() {
				let that = this
				uni.request({
					url: that.$url_check_reset_code,
					method: 'POST',
					data: {
						phone: that.unername_phone,
						code: that.yanzhengma,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: (res) => {
						console.log("校验重置密码验证码：", res)
						if (res.data.code == 200) {
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateTo({
									url: '../../login/Forget_password_2?phone=' + that
										.unername_phone
								})
							}, 300)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(res) {
						console.log("失败", res)
					}

				})
			},
			check_reset_code1() {
				let that = this
				uni.request({
					url: that.$url_check_reset_code,
					method: 'POST',
					data: {
						email: that.unername_phone,
						code: that.yanzhengma,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: (res) => {
						console.log("校验重置密码验证码：", res)
						if (res.data.code == 200) {
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateTo({
									url: '../../pages/login/Forget_password_2?phone=' +
										that.unername_phone
								})
							}, 300)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(res) {
						console.log("失败", res)
					}
				})
			}
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

	.button_back {
		width: auto;
		margin: 40px 20px 0 20px;
		background: #3298F7 !important;
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