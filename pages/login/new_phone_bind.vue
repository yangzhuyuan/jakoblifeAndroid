<template>
	<view style="padding: 20px;color: black; background: #F7F7F7;width: 100vw; height: 100vh;">
		<view style="flex-direction: column; display: flex;padding-top: 80px; align-items: center; ">
			<image src="../../static/icons/success.png" style="width: 100px; height: 100px;"></image>
			<view style="margin-top: 40px;font-weight: bold;text-align: center;">{{$t('wodelist.aqzxitem.title_10')}}
			</view>
		</view>
		<view style="position: fixed; bottom: 0;left: 0; width: 100vw;">
			<button
				style="background:#3298F7; color: white; border-radius: 30px;font-weight: bold;margin: 20px 20px 40px 20px;"
				@click="back()">{{$t('login.text_13')}}</button>
		</view>
	</view>
</template>
<script>
	export default {
		onLoad(res) {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.aqzxitem.title_11')
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
				uni.navigateBack({
					delta: 3
				})
			}
		}
	}
</script>

<style>

</style>