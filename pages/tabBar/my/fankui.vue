<template>
	<view style="padding: 20px;background: #F7F7F7; color: black;height: 100vh;">
		<view class="uni-textarea">
			<textarea placeholder="请输入反馈和建议" v-model="jianyicongtext" />
		</view>
		<button class="bt_Accept" @click="Accept()">{{$t('提交')}}</button>
		<view class="lianxibg" @click="lianxibt()">联系我们</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				jianyicongtext: '',
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('反馈')
			})
		},
		methods: {
			Accept() {
				if (!this.jianyicongtext) {
					uni.showToast({
						title: this.$t("请输入"),
						icon: 'none'
					})
					return
				} else {
					uni.showToast({
						title: this.$t("成功"),
						icon: 'none'
					})
					this.jianyicongtext = ""
				}
			},
			lianxibt() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Webview1"
				})
			},
		}
	}
</script>

<style>
	.bt_Accept {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 40px 20px 0 20px;
		height: 48px;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		width: auto;
		color: white;
		background: #3298F7;
	}

	.lianxibg {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		color: #3298F7;
	}
</style>