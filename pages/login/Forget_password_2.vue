<template>
	<view style="color: black; background: #F7F7F7; color: black;height: 100vh;">
		<view style="padding-top: 49px;color: black;">
			<view class="linear">
				<image class="img_bg" src="../../static/icons/16.png" />
				<input type="text" :password=isPassword1 :placeholder="$t('请输入密码')"
					style="width: 55vw;margin-left: 15px; " v-model="passwrod" />
				<image class="img_bg" :src="isPassword1 ? urlicon1 : urlicon2" @tap="img_mima1" />
			</view>

			<view class="linear" style="margin-top: 20px;">
				<image class="img_bg" src="../../static/icons/16.png" />
				<input type="text" :password=isPassword2 :placeholder="$t('请确认密码')"
					style="width: 55vw;margin-left: 15px; " v-model="true_passwrod" />
				<image class="img_bg" :src="isPassword2 ? urlicon3 : urlicon4" @tap="img_mima2" />
			</view>
			<button class="btn_bg" @tap="btn_next">{{$t('下一步')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		isInChinaByIP
	} from '../api/isInChinaByIP.js';
	export default {
		data() {
			return {
				phone: '',
				passwrod: "",
				true_passwrod: "",
				isPassword1: true,
				urlicon1: "../../static/icons/mima_1.png",
				urlicon2: "../../static/icons/mima_2.png",
				isPassword2: true,
				urlicon3: "../../static/icons/mima_1.png",
				urlicon4: "../../static/icons/mima_2.png",
				loact: uni.getStorageSync('loact'),
			}
		},
		onLoad(res) {
			//带过来的数据res
			console.log(res)

			this.phone = res.phone



		},


		onShow() {
			let that = this
			//标题名称
			uni.setNavigationBarTitle({
				title: that.$t('重置密码')
			})

			if (!that.validateEmail(that.phone)) {
				that.loact = "境内"
			} else if (that.validateEmail(that.phone)) {
				that.loact = "境外"
			} else {
				isInChinaByIP().then(isInChina => {
					if (isInChina) {
						console.log('用户在中国境内');
						that.loact = "境内"
					} else {
						that.loact = "境外"
					}
				});
			}
		},

		methods: {

			//判断是否是邮箱
			validateEmail(email) {
				const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				return reg.test(email);
			},


			img_mima1() {
				if (this.isPassword1 == true) {
					this.isPassword1 = false
				} else {
					this.isPassword1 = true
				}
			},
			img_mima2() {
				if (this.isPassword2 == true) {
					this.isPassword2 = false
				} else {
					this.isPassword2 = true
				}
			},

			btn_next() {
				if (this.passwrod === "" || this.passwrod === undefined) {
					uni.showToast({
						title: this.$t('请输入密码'),
						icon: "none"
					})
					return
				}
				if (this.true_passwrod === "" || this.true_passwrod === undefined) {
					uni.showToast({
						title: this.$t('再次输入的密码未设置'),
						icon: "none"
					})
					return
				}
				if (this.passwrod.length < 8) {
					uni.showToast({
						title: this.$t("密码不能低于8位数"),
						icon: "none"
					})
					return
				}
				if (this.true_passwrod.length < 8) {
					uni.showToast({
						title: this.$t("密码不能低于8位数"),
						icon: "none"
					})
					return
				}
				if (this.passwrod != this.true_passwrod) {
					uni.showToast({
						title: this.$t('两次输入的密码不一致'),
						icon: "none"
					})
					return
				}

				if (this.loact === "境内") {
					this.Reset_password()
				} else if (this.loact === "境外") {
					this.Reset_password1()
				}


			},

			//手机验证码后重置密码
			Reset_password() {
				uni.request({
					url: this.$url_reset_password_by_phone,
					method: 'POST',
					data: {
						phone: this.phone,
						password: this.passwrod,
						repeatPassword: this.true_passwrod
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("手机验证码后重置密码:", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.navigateTo({
									url: 'Forget_password_3'
								})
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'error'
								})
							}
						}

					}
				})
			},
			Reset_password1() {
				uni.request({
					url: this.$url_reset_password_by_phone,
					method: 'POST',
					data: {
						email: this.phone,
						password: this.passwrod,
						repeatPassword: this.true_passwrod
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("手机验证码后重置密码:", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.navigateTo({
									url: 'Forget_password_3'
								})
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'error'
								})
							}
						}

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

	.btn_bg {
		width: auto;
		margin: 20px 20px 0 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
	}
</style>