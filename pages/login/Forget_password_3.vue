<template>
	<view style="padding: 20px;">
		<view style="flex-direction: column; display: flex;padding-top: 80px; align-items: center; ">
			<image src="../../static/icons/success.png" style="width: 100px; height: 100px;"></image>
			<view style="margin-top: 40px;font-weight: bold;text-align: center;">{{$t('WJMMitem.title_0')}}</view>
		</view>
		<view style="position: fixed; bottom: 0;left: 0; width: 100vw;">
			<button
				style="background:#3298F7; color: white; border-radius: 30px;font-weight: bold;margin: 20px 20px 40px 20px;"
				@click="back()">{{$t('zhuceitem.btn_0')}}</button>
		</view>
	</view>
</template>
<script>
	export default {
		onLoad(res) {
			uni.setNavigationBarTitle({
				title: this.$t('WJMM')
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

</style>