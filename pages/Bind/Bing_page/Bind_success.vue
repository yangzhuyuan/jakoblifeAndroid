<template>
	<view style="color: black;height: 100vh;width: 100vw;">
		<view style="display: flex; justify-content: center;">
			<image class="img" src="../../../static/icons/success.png"></image>
		</view>
		<view style="margin-top: 60px;text-align: center;">{{$t('BDSBitem.title_11')}}</view>
		<button class="btn_BG" @click="btn_click()">{{$t('login.text_13')}}</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {

			}
		},



		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})
		},

		methods: {
			...mapMutations(['register_unername']),
			btn_click() {
				this.user()
			},
			user() {
				let that = this
				uni.request({
					url: that.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: function(res) {
						console.log("获取用户信息成功:", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.data.weight === '' || res.data.data.weight == null) {
									that.register_unername(res.data.data.nickName)
									uni.reLaunch({
										url: '../../login/Register_success2'
									})
								} else {
									uni.switchTab({
										url: '../../tabBar/main/Main'
									})
								}
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						} else {
							console.log("获取数据错误")
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style>
	.img {
		margin-top: 80px;
		width: 100px;
		height: 100px;
	}

	.btn_BG {
		margin: 40px 20px 0 20px;
		background: #3298F7;
		color: white;
		font-weight: bold;
		border-radius: 50px;
	}
</style>