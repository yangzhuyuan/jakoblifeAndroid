<template>
	<view style="color: black; background: #F7F7F7; color: black;width: 100vw; height: 100vh;">
		<view style="padding-top: 80px;color: black;">
			<view class="linear">
				<image class="img_bg" src="../../static/icons/16.png" />
				<input type="text" :password=isPassword1 :placeholder="$t('login.input_1')"
					style="width: 65vw;margin-left: 15px; " v-model="passwrod" />
				<image class="img_bg" :src="isPassword1 ? urlicon1 : urlicon2" @tap="img_mima1" />
			</view>

			<view class="linear" style="margin-top: 20px;">
				<image class="img_bg" src="../../static/icons/16.png" />
				<input type="text" :password=isPassword2 :placeholder="$t('zhuceitem.input_1')"
					style="width: 65vw;margin-left: 15px; " v-model="true_passwrod" />
				<image class="img_bg" :src="isPassword2 ? urlicon3 : urlicon4" @tap="img_mima2" />
			</view>
			<button class="btn_bg" @tap="btn_next">{{$t('zhuceitem.btn_0')}}</button>
		</view>
	</view>
</template>

<script>
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
			}
		},
		onLoad(res) {
			//带过来的数据res
			console.log(res)

			this.phone = res.phone

			//标题名称
			uni.setNavigationBarTitle({
				title: this.$t('WJMM')
			})
		},

		methods: {
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
						title: this.$t('login.input_1'),
						icon: "none"
					})
					return
				}
				if (this.true_passwrod === "" || this.true_passwrod === undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_2'),
						icon: "none"
					})
					return
				}
				if (this.passwrod.length < 8) {
					uni.showToast({
						title: "密码不能低于8位数",
						icon: "none"
					})
					return
				}
				if (this.true_passwrod.length < 8) {
					uni.showToast({
						title: "密码不能低于8位数",
						icon: "none"
					})
					return
				}
				if (this.passwrod != this.true_passwrod) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_3'),
						icon: "none"
					})
					return
				}
				// uni.navigateTo({
				// 	url: 'Forget_password_3'
				// })
				this.Reset_password()

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
			}

		}
	}
</script>

<style>
	.linear {
		display: flex;
		align-items: center;
		height: 45px;
		background-color: white;
		border-radius: 25px;
		margin-left: 20px;
		margin-right: 20px;
		padding: 0 15px 0 15px;
		flex-direction: row;
	}

	.img_bg {
		width: 20px;
		height: 20px;
	}

	.btn_bg {
		margin-top: 40px;
		margin-left: 20px;
		margin-right: 20px;
		background: #3298F7;
		color: white;
		border-radius: 30px;
		font-weight: bold;
	}
</style>