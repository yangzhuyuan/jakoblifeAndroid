<template>
	<view>
		<view v-if="img_scan">
			<app-scan ref="appScan" @getCode="getCode" />
		</view>
		<view v-else>
			<image class="imgss" :src="scan_img"></image>
		</view>
		<view style="text-align: center;margin-top: 45px;padding-bottom: 180px;">{{context_msg}}</view>
		<view style="position: fixed; bottom: 0;width: 100vw; background: white;">
			<button style="margin: 20px;border-radius: 30px;background: #3298F7; color: white; "
				@click="True_Bind()">{{$t('BDSBitem.button_0')}}</button>
			<button @click="unbind()"
				style="margin: 20px;border-radius: 30px;background: #DBDBDB; color: white;">{{$t('XZGLLXitem.button_4')}}</button>
		</view>


	</view>
</template>

<script>
	import appScan from "../../../uni_modules/simbalkj-scan/components/simbalkj-scan/appScan.vue"
	export default {
		components: {
			appScan
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})

			console.log(uni.getStorageSync("token"))
		},

		data() {
			return {
				img_scan: true,
				scan_img: "../../../static/image-active.png",
				context_msg: this.$t('BDSBitem.title_9'),
			};
		},
		methods: {
			getCode(barNumber) {
				this.context_msg = barNumber
				this.img_scan = false
			},
			True_Bind() {
				if (this.context_msg === this.$t('BDSBitem.title_9')) {
					uni.showToast({
						title: this.$t('BDSBitem.title_12'),
						icon: 'error'
					})
					return
				}
				this.bind_device()
			},
			unbind() {
				uni.reLaunch({
					url: '../../login/login_land'
				})
			},
			//设备绑定
			bind_device() {
				uni.request({
					url: this.$url_bind_device,
					method: 'POST',
					data: {
						deviceSn: this.context_msg
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("设备绑定", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								// uni.showToast({
								// 	title: res.data.msg,
								// 	icon:"none"
								// })
								uni.navigateTo({
									url: "../Bing_page/Bind_pg"
								})

							} else {
								uni.showToast({
									title: res.data.msg,
									iocn: 'none'
								})
								this.img_scan = true
							}
						} else {
							console.log("设备绑定失败", res)
						}

					}
				})
			}

		}
	};
</script>

<style>
	.imgss {
		top: 25px;
		left: 20px;
		width: 90vw;
		height: 260px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>