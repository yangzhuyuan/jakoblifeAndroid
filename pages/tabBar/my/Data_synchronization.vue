<template>
	<view style="padding: 20px;">
		<view style="background: white;border-radius: 10px;padding: 10px;">
			<view @click="failure()" style="display: flex; flex-direction: row; align-items: center; padding: 10px;">
				<text style="width: 90%; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_13')}}</text>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="takes_a_long_time()"
				style="display: flex; flex-direction: row; align-items: center;padding: 10px;">
				<text style="width: 90%; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_14')}}</text>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
		</view>
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
				title: this.$t('wodelist.bzzxitem.title_2')
			})
		},
		methods: {
			failure() {
				uni.navigateTo({
					url: "../my/Data_synchronization_1?ID=1"
				})

			},
			takes_a_long_time() {
				uni.navigateTo({
					url: "../my/Data_synchronization_1?ID=2"
				})
			}
		}
	}
</script>

<style>

</style>