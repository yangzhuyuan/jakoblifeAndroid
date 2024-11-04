<template>
	<view style="padding: 10px;">
		<view style="display:flex;flex-direction: column;align-items: center;">
			<image style="width: 180px;height:180px;" src="../../../static/icons/14.png"></image>
			<text style=" font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_titles0')}}</text>
			<text style="margin-top: 5px; font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_titles1')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 20px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: left;margin-left:10px;">
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_titles2')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('wodelist.zx_titles3')}}</text>
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_titles4')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('wodelist.zx_titles5')}}</text>
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('wodelist.zx_titles6')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('wodelist.zx_titles7')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: left;margin-left:10px;">
			<view>
				<image src="../../../static/icons/warning.png" style="width: 25px;height: 25px;"></image>
				<text style="margin-left: 5px; font-size: 14px;">{{$t('wodelist.zx_titles8')}}</text>
			</view>
		</view>
		<button @click="Sign_OUT()"
			style="margin:40px 20px 80px 20px;background: #3298F7;color: white;border-radius: 40px;">{{$t('wodelist.zx_title1')}}</button>
	</view>
</template>

<script>
	export default {

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.zx_title0')
			})
		},

		methods: {
			Sign_OUT() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Cancel_account_1"
				})
			},
		},

	}
</script>

<style>

</style>