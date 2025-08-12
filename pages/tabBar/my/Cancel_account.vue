<template>
	<view style="padding: 10px 10px 108px 10px;background: #F7F7F7; color: black; height: 100vh;">
		<view style="display:flex;flex-direction: column;align-items: center;">
			<image style="width: 180px;height:180px;" :src="loginimg"></image>
			<text style=" font-size: 16px; font-weight: bold;">{{$t('注销账号')}}</text>
			<text style="margin-top: 5px; font-size: 16px; font-weight: bold;">{{$t('您账号下的JakobLife账号')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 20px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: left;margin-left:10px;">
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('安全验证')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('您的JakobLife账号服务权益处于安全状态')}}</text>
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('提前保留重要信息')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('由您本人发起')}}</text>
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('请您谨慎操作')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('账号注销后')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: left;margin-left:10px;">
			<view>
				<image src="../../../static/icons/warning.png" style="width: 25px;height: 25px;"></image>
				<text style="margin-left: 5px; font-size: 14px;">{{$t('账号注销服务')}}</text>
			</view>
		</view>
		<button @click="Sign_OUT()"
			style="margin:40px 20px 20px 20px;background: #3298F7;color: white;border-radius: 40px;">{{$t('注销JakobLife账号')}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginimg: '',
			}
		},

		onShow() {
			
			uni.setNavigationBarTitle({
				title: this.$t('注销账号')
			})
			const lan = uni.getLocale();
			if (lan == 'zh-Hans') {
				this.loginimg = "../../../static/icons/14.png"
			} else {
				this.loginimg = "../../../static/icons/loginssss.png"
			}
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