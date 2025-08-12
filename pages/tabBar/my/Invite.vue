<template>
	<view style="color: black;height: 100vh;width: 100vw;">
		<view class="view_bg">
			<image :src="avatar" class="img_bg"></image>
		</view>
		<view class="name_bg_1">{{name}}</view>
		<view style="text-align: center;font-size: 14px;color: gray;margin-top: 15px;">{{sharePhone}}</view>
		<view class="name_bg">{{$t('想和您共享健康数据')}}</view>
		<view class="bt_bg">
			<button class="bt_Accept" @click="Accept()">{{$t('接受')}}</button>
			<button class="bt_Turn_down" @click="Turn_down()">{{$t('拒绝')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: "../../../static/icons/40x40.png",
				name: '',
				id: '',
				sharePhone: ''
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("邀请")
			})
		},
		onLoad: function(option) {
			console.log(option)
			this.avatar = option.AVATAR === "" ? '../../../static/icons/40x40.png' : option.AVATAR
			this.name = option.NAME === "null" ? this.$t("未设置会员名") : option.NAME
			this.id = option.ID
			this.sharePhone = option.sharePhone
		},

		methods: {
			Turn_down() {
				this.accepted(false)
			},
			Accept() {
				this.accepted(true)
			},
			//处理分享请求（同意/拒绝
			accepted(isAccepted) {
				let that = this
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/share/data/accepted",
					method: 'POST',
					data: {
						id: that.id,
						isAccepted: isAccepted
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						console.log("获取待处理分享请求列表", pending)
						if (pending.data.code == 200) {
							if (isAccepted === true) {
								uni.navigateTo({
									url: "../my/Invite_2"
								})
							} else if (isAccepted === false) {
								uni.navigateBack()
							}
						}
					},
					fail(erro) {
						console.log("获取待处理分享请求列表失败", erro)
					}
				})
			}
		}
	}
</script>

<style>
	.view_bg {
		display: flex;
		justify-content: center;
		padding-top: 40px;
	}

	.img_bg {
		border: 1px solid gainsboro;
		width: 80px;
		height: 80px;
		border-radius: 40px;
	}

	.name_bg_1 {
		text-align: center;
		margin-top: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.name_bg {
		text-align: center;
		margin-top: 15px;
		font-size: 14px;
		font-weight: bold;
	}

	.bt_bg {

		flex-direction: column;
		position: fixed;
		bottom: 0;
		width: 100vw;
	}

	.bt_Turn_down {
		background: #F55A5A;
		border-radius: 40px;
		color: white;
		margin: 15px 20px 20px 20px;
	}

	.bt_Accept {
		background: #3298F7;
		border-radius: 40px;
		color: white;
		margin: 15px 20px 20px 20px;
	}
</style>