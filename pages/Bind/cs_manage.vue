<template>
	<view class="backpage">
		<view class="titless">{{$t('选择管理1')}}</view>
		<view class="title_1">{{$t('选择管理2')}}</view>
		<view class="context_btn" @click="navigateTo('血压管理', 0)">
			<image lazy-load class="img" mode="aspectFit" src="../../static/icons/3.png" />
			<view class="context_title">{{$t('血压管理')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view class="context_btn" @click="navigateTo('体脂管理', 1)">
			<image class="img" mode="aspectFit" src="../../static/icons/6.png" />
			<view class="context_title">{{$t('体脂管理')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view class="btnstylsd">
			<button class="btn_bg" @click="skip()">{{$t('暂不选择')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SHEBEI: '',
			}
		},
		onLoad(RES) {
			uni.setNavigationBarTitle({
				title: this.$t('选择管理类型')
			})
			this.SHEBEI = RES.SHEBEI
		},
		methods: {
			navigateTo(title, type) {
				uni.navigateTo({
					url: `../Bind/Bing_page/Bing_page?SELECT_TYPE=${type}&SHEBEI=${this.SHEBEI}`
				});
			},
			skip() {
				uni.switchTab({
					url: "../tabBar/main/Main"
				})
			},
		}
	}
</script>

<style>
	.backpage {
		padding-top: 20px;
		color: black;
		background: #F7F7F7;
		height: 100vh;
	}

	.titless {
		width: auto;
		margin: 20px 20px 0 20px;
		font-size: 16px;
		font-weight: 400;
		color: #1A1A1A;
	}

	.title_1 {
		width: auto;
		margin: 5px 20px 0 20px;
		font-size: 12px;
		font-weight: 400;
		color: #999999;
	}

	.img {
		width: 36px;
		height: 36px;
		margin-left: 15px;
		object-fit: contain;
	}

	.context_btn {
		width: auto;
		height: 60px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: white;
		padding: 10px;
		margin: 24px 20px 0 20px;
		border-radius: 50px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.context_title {
		width: 55vw;
		font-size: 16px;
		color: black;
		font-weight: 400;
		margin-left: 15px;
	}

	.btnstylsd {
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.btn_bg {
		width: auto;
		margin: 20px 20px 48px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}
</style>