<template>
	<view style="color: black;height: 100vh;width: 100vw;">
		<view class="view_bg">
			<image class="img_bg" src="../../../static/icons/success.png">
			</image>
		</view>
		<view class="name_bg">{{name}}{{$t('wodelist.xiaoxiitem.title_3')}}</view>

		<button class="bt_Turn_down" @click="bt_ok()">{{$t('login.text_13')}}</button>

	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "aa"

			}
		},

		onLoad: function(res) {
			this.name = res.NAME

		},

		methods: {
			bt_ok() {
				uni.reLaunch({
					url: "/pages/tabBar/my/My"
				})

			}

		}
	}
</script>

<style>
	.view_bg {
		display: flex;
		justify-content: center;
		padding-top: 120px;
	}

	.img_bg {
		border: 1px solid gainsboro;
		width: 80px;
		height: 80px;
		border-radius: 40px;
	}

	.name_bg {
		text-align: center;
		margin-top: 20px;
		font-size: 14px;
		font-weight: bold;
	}



	.bt_Turn_down {
		display: flex;
		align-items: center;
		position: fixed;
		justify-content: center;
		bottom: 0;
		margin: 0 15px 40px 15px;
		width: 90vw;
		background: #3298F7;
		height: 40px;
		border-radius: 40px;
		color: white;
	}
</style>