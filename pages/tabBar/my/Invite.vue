<template>
	<view style="color: black;height: 100vh;width: 100vw;">
		<view class="view_bg">
			<image :src="avatar" class="img_bg">
			</image>
		</view>
		<view class="name_bg_1">{{name}}</view>
		<view style="text-align: center;font-size: 12px;color: gray;">{{id}}</view>
		<view class="name_bg">{{name}}{{$t('wodelist.xiaoxiitem.title_2')}}</view>
		<view class="bt_bg">
			<button class="bt_Accept" @click="Accept()">{{$t('wodelist.xiaoxiitem.button_1')}}</button>
			<button class="bt_Turn_down" @click="Turn_down()">{{$t('XZGLLXitem.button_3')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: "../../../static/icons/40x40.png",
				name: "a",
				id: "123456789"

			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("wodelist.xiaoxiitem.title_1")
			})
		},
		onLoad: function(option) {
			console.log(option)
			this.avatar = option.AVATAR
			this.name = option.NAME
		},

		methods: {
			Turn_down() {
				// uni.showToast({
				// 	title: "您拒绝了" + this.name + "的共享健康数据",
				// 	icon: "none"
				// })
				uni.navigateBack()
			},
			Accept() {
				uni.navigateTo({
					url: "../my/Invite_2?NAME=" + this.name
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
		font-size: 14px;
		font-weight: bold;
	}

	.name_bg {
		text-align: center;
		margin-top: 10px;
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