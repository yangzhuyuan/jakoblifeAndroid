<template>
	<view style="display: flex;flex-direction: column; height: 100vh;padding: 10px;color: black;">
		<view style="display: flex; justify-content: center;">
			<image class="img" src="../../../static/icons/success.png"></image>
		</view>
		<view style="margin-top: 20px;text-align: center; font-weight: 600;font-size: 17px;">
			{{$t('您已向')}} {{name}} {{$t('发出共享健康数据邀请')}}。
		</view>
		<button class="btn_BG" @click="btn_click()">{{$t('确定')}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: ""
			}
		},

		onLoad(res) {
			this.name = res.NAME
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('共享给')
			})
		},


		methods: {
			btn_click() {
				uni.reLaunch({
					url: "/pages/tabBar/share/Share"
				})
			}

		}
	}
</script>

<style>
	.img {
		margin-top: 108px;
		width: 68px;
		height: 68px;
	}

	.btn_BG {
		width: auto;
		height: 48px;
		font-weight: 600;
		font-size: 16px;
		position: fixed;
		bottom: 50px;
		left: 20px;
		right: 20px;
		background: #3298F7;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50px;
	}
</style>