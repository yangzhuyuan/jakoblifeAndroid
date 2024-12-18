<template>
	<view style="padding-top: 20px;color: black;height: 100vh;background: #EFEFF4;">
		<view class="linear">
			<image class="img_bg" src="../../../static/icons/17.png" />
			<input type="text" :placeholder="$t('wodelist.aqzxitem.title_15')" style="width: 70vw;margin-left: 10px; "
				maxlength="11" v-model="unername" />
		</view>

		<view style="display: flex; flex-direction: row;">
			<view class="linear_1">
				<image class="img_bg" src="../../../static/icons/18.png" />
				<input type="text" :placeholder="$t('login.text_18')" style="margin-left: 10px;width: 35vw;"
					maxlength="8" v-model="yanzhengma" />
			</view>
			<button class="linear_btn" style="background: #3298F7; color: white;"
				@tap="huoqu">{{yanzheng?$t('login.text_3'): codetime+msg}}</button>
		</view>
		<button
			style=" margin:40px 15px 0 15px; background:#3298F7; color: white; border-radius: 30px;font-weight: bold;"
			@tap="btn_next">{{$t('zhuceitem.btn_1')}}</button>


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
				yangzhengma_img: '', //验证码图片
				msg: this.$t('zhuceitem.input_3'),
				unername: '',
				yanzhengma: '',
				yanzheng: 1,
				codetime: 0,
				tanchuang: false,
				yzm: '',
				phone: '',
			}
		},

		onLoad(res) {
			//带过来的数据res
			console.log(res)
			this.phone = res.PHONE

		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.aqzxitem.title_14')
			})
		},


		methods: {
			...mapMutations(['login', 'getImgID']),
			huoqu() {
				if (this.unername == "" || this.unername == undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.input_2'),
						icon: 'none'
					})
					return
				} else if (this.codetime > 0) {
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
									that.send_phone_reset_code()
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
				if (this.unername === "" || this.unername === undefined) {
					uni.showToast({
						title: this.$t('wodelist.aqzxitem.title_15'),
						icon: 'none'
					})
					return
				} else if (this.yanzhengma === "" || this.yanzhengma === undefined) {
					uni.showToast({
						title: this.$t('login.input_2'),
						icon: 'none'
					})
					return
				} else {
					this.check_change_name_code()
				}
			},
			//发送更换会员名验证码
			send_phone_reset_code() {
				
				let that = this
				console.log("Daskhsdhadas",that.phone)
				uni.request({
					url: that.$url_send_change_name_code,
					method: 'POST',
					data: {
						phone: that.phone
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						console.log("发送重置密码短信", res)
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
			//更换会员名称
			check_change_name_code() {
				let that = this
				uni.request({
					url: that.$url_check_change_name_code,
					method: 'POST',
					data: {
						name: that.unername,
						phone: that.phone,
						code: that.yanzhengma,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: (res) => {
						console.log("更换会员名称：", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
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

				})
			}

		}
	}
</script>

<style>
	.linear {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 45px;
		background-color: white;
		border-radius: 30px;
		margin: 0 20px 0 20px;
		padding: 0 15px 0 15px;
	}

	.img_bg {
		width: 20px;
		height: 20px;
	}

	.linear_1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 45px;
		background-color: white;
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		margin: 20px 5px 0 20px;
		padding: 0 20px 0 15px;
	}

	.linear_btn {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		margin-right: 20px;
		height: 45px;
		font-size: 12px;
		text-align: center;
		width: 40vw;
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
		background: #3298F7;
		color: white;
		line-height: 18px;
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