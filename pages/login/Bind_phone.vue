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
				@tap="huoqu">{{yanzheng ? $t('获取验证码'): codetime+msg}}</button>
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
			...mapState(['tokens', 'uuid'])
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

		onLoad(res) {
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
				if (this.unername_phone === "" || this.unername_phone === undefined) {
					uni.showToast({
						title: this.$t('请输入手机号'),
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
				let _that = this
				uni.request({
					url: this.$url_captchaImage,
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
									that.tanchuang = false
									that.send_phone_register_code()
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
			btn_next() {
				if (this.unername_phone === "" || this.unername_phone === undefined) {
					uni.showToast({
						title: this.$t('请输入手机号'),
						icon: 'none'
					})
					return
				} else if (this.yanzhengma == "" || this.yanzhengma == undefined) {
					uni.showToast({
						title: this.$t('请输入验证码'),
						icon: 'none'
					})
					return
				} else {
					this.bind_phone()
				}
			},
			//发送手机绑定验证码
			send_phone_register_code() {
				let that = this
				uni.request({
					url: that.$url_send_phone_register_code,
					method: 'POST',
					data: {
						phone: that.unername_phone
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("发送手机绑定验证码:", res)
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
								title: that.$t("该手机号已被绑定"),
								icon: 'none'
							})
						}
					},
					fail(res) {
						console.log("失败", res)
					}
				})
			},
			//第三方登录后用户绑定手机号
			bind_phone() {
				let that = this
				uni.request({
					url: that.$url_bind_phone,
					method: 'PUT',
					data: {
						code: that.yanzhengma,
						phoneNum: that.unername_phone
					},
					header: {
						'Authorization': 'Bearer ' + that.tokens,
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("第三方登录后用户绑定手机号:", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.showToast({
									title: that.$t("成功"),
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateTo({
										url: '../../pages/login/Register_success'
									})
								}, 300)
							} else if (res.data.code === 500) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: that.$t("该手机号已被绑定"),
									icon: 'none'
								})
							}
						}
					},
					fail(res) {
						console.log("失败", res)
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