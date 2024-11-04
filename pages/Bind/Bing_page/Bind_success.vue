<template>
	<view>
		<view style="display: flex; justify-content: center;">
			<image class="img" src="../../../static/icons/success.png"></image>
		</view>
		<view style="margin-top: 60px;text-align: center;">{{$t('BDSBitem.title_11')}}</view>
		<button class="btn_BG" @click="btn_click()">{{$t('login.text_13')}}</button>
	</view>
</template>

<script>
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
			btn_click() {
				uni.reLaunch({
					url: "/pages/tabBar/main/Main"
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