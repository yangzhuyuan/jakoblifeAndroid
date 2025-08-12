<template>
	<view style="padding: 20px;color: black; height: 100vh;background: #F7F7F7;">
		<view style="flex-direction: column; display: flex;padding-top: 108px; align-items: center; ">
			<image src="../../static/icons/success.png" style="width: 68px; height: 68px;"></image>
			<view style="margin-top: 20px;font-weight: 400;font-size: 16px; text-align: center;">
				{{$t('密码已重置成功')}}
			</view>
		</view>
		<view style="position: fixed; bottom: 0;left: 0; width: 100vw;">
			<button class="btn_bg" @click="back()">{{$t('下一步')}}</button>
		</view>
	</view>
</template>
<script>
	export default {
		onLoad(res) {
			uni.setNavigationBarTitle({
				title: this.$t('重置密码')
			})
		},

		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},

		methods: {
			back() {
				uni.redirectTo({
					url: '/pages/login/login_land'
				})
			}

		}
	}
</script>

<style>
	.btn_bg {
		width: auto;
		margin: 20px 20px 108px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
	}
</style>