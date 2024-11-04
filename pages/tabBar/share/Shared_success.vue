<template>
	<view style="display: flex;flex-direction: column; justify-content: center; padding: 10px;">
		<view style="display: flex; justify-content: center;">
			<image class="img" src="../../../static/icons/success.png"></image>
		</view>
		<view style="margin-top: 60px;text-align: center; font-weight: bold;font-size: 16px;">{{$t('gongxiangitem.title_13')}} {{name}} {{$t('gongxiangitem.title_14')}}。
		</view>
		<button class="btn_BG" @click="btn_click()">{{$t('login.text_13')}}</button>
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
				title: this.$t('gongxiangitem.title_11')
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
		margin-top: 80px;
		width: 80px;
		height: 80px;
	}

	.btn_BG {
		position: fixed;
		bottom: 50px;
		left: 5vw;
		width: 88vw;
		background: #3298F7;
		color: white;
		font-weight: bold;
		border-radius: 50px;
	}
</style>