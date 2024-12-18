<template>
	<view style="padding: 10px;background: #F7F7F7; color: black;height: 100vh;">
		<view class="linear">
			<image class="img_bg" src="../../static/icons/15.png" />
			<input type="text" :placeholder="$t('zhuceitem.input_0')" maxlength="32"
				style="width: 70vw;margin-left: 15px; " v-model="vip_unername" />
		</view>
		<view class="linear">
			<image class="img_bg" src="../../static/icons/16.png" />
			<input :password=isPassword1 type="text" maxlength="16" :placeholder="$t('login.input_1')"
				style="width: 65vw;margin-left: 15px; " v-model="vip_password" />
			<image class="img_bg" :src="isPassword1 ? urlicon1 : urlicon2" @tap="img_mima1" />
		</view>
		<view class="title_tishi" :style="getcolor(act)">请输入不小于八位数密码</view>
		<view class="linear">
			<image class="img_bg" src="../../static/icons/16.png" />
			<input :password=isPassword2 type="text" maxlength="16" :placeholder="$t('zhuceitem.input_1')"
				style="width: 65vw;margin-left: 15px; " v-model="vip_password_2" />
			<image class="img_bg" :src="isPassword2 ? urlicon3 : urlicon4" @tap="img_mima2" />
		</view>
		<view v-show='act1' style="margin: 15px 0 0 30px;color: #F55A5A;">两次输入的密码不一致</view>
		<view style="position: fixed; bottom: 0;left: 0; width: 100vw;">
			<view style="display: flex;flex-direction: column; ">
				<view style="display: flex;flex-direction: row;justify-content: center;">
					<checkbox style="font-size: 14px;margin-left: 15px;" class="round" color="#ffffff"
						activeBorderColor="#D2D2D2" activeBackgroundColor="#3298F7" :checked="cb" @click="checked">
					</checkbox>
					<view style="text-align: center;">{{$t('zhuceitem.check_text')}}</view>
					<view style="color: cornflowerblue;font-size: 14px;" @tap="Service_Agreement">
						{{$t('login.text_5')}}
					</view>
				</view>
				<button class="button_back" :style="getback(cb)"
					@click="True_Register()">{{$t('zhuceitem.btn_0')}}</button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: {
			...mapState(['tokens', 'unername'])
		},
		data() {
			return {
				act: "0",
				act1: false,
				vip_unername: '',
				vip_password: '',
				vip_password_2: '',
				cb: false,
				isPassword1: true,
				urlicon1: "../../static/icons/mima_1.png",
				urlicon2: "../../static/icons/mima_2.png",
				isPassword2: true,
				urlicon3: "../../static/icons/mima_1.png",
				urlicon4: "../../static/icons/mima_2.png",

			}
		},

		onShow() {
			let that = this;
			//使用协议返回过来的数据
			uni.$once('checked', function(data) {
				that.cb = data
			})
		},

		onLoad(opeation) {
			uni.setNavigationBarTitle({
				title: this.$t('zhuce')
			})
		},

		methods: {
			...mapMutations(['register_token', 'register_unername']),

			getback(id) {
				return {
					background: id == false ? "#DBDBDB" : "#3298F7"
				}
			},

			getcolor(id) {
				return {
					color: id === "0" ? '#3298F7' : '#F55A5A'
				}
			},

			checked() {
				if (this.cb == false) {
					this.cb = true
				} else {
					this.cb = false
				}
			},

			Service_Agreement() {
				uni.navigateTo({
					url: "../service/Service_Agreement?CB=" + this.cb
				})
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
			True_Register() {
				if (this.vip_unername == '' || this.vip_unername == undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_0'),
						icon: 'none'
					})
					return
				} else if (this.vip_password == '' || this.vip_password == undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_1'),
						icon: 'none'
					})
					return
				} else if (this.vip_password.length < 8) {
					this.act = "1"
					uni.showToast({
						title: "密码不可以低于8位数",
						icon: 'none'
					})
					return
				} else if (this.vip_password_2 == '' || this.vip_password_2 == undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_2'),
						icon: 'none'
					})
					return
				} else if (this.vip_password != this.vip_password_2) {
					this.act1 = true
					uni.showToast({
						title: this.$t('zhuceitem.toast_3'),
						icon: 'none'
					})
					return
				} else if (this.cb == false) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_4'),
						icon: 'none'
					})
					return
				} else {
					this.register()
				}
			},
			//App用户名密码注册
			register() {
				let that = this
				uni.request({
					url: that.$url_register,
					method: 'POST',
					data: {
						username: that.vip_unername,
						password: that.vip_password,
						code: "",
						uuid: "",
						smsCode: "",
						email: '',
						phone: "",
						userType: '01', //（00系统用户，01App用户）
						phoneNum: "",
						nickName: ''
					},
					header: {
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: (res) => {
						console.log("App用户名密码注册：", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								that.register_token(res.data.token)
								that.register_unername(that.vip_unername)
								uni.setStorageSync("token", res.data.token)
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateTo({
										url: '../login/Bind_phone'
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
				})
			}


		}
	}
</script>

<style>
	.title_tishi {
		margin: 15px 0 0 30px;
		color: #3298F7;
	}

	.linear {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 45px;
		background-color: white;
		border-radius: 30px;
		margin: 20px 20px 0 20px;
		padding: 0 15px 0 15px;
	}

	.img_bg {
		width: 20px;
		height: 20px;
	}

	.button_back {
		background: #3298F7;
		color: white;
		border-radius: 30px;
		font-weight: bold;
		margin: 20px 20px 20px 20px;
	}
</style>