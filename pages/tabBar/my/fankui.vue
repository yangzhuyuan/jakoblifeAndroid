<template>
	<view class="fankui-page">
		<view class="uni-textarea input-card">
			<textarea class="feedback-textarea" placeholder="请输入反馈和建议" v-model="jianyicongtext" />
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
	.fankui-page {
		min-height: 100vh;
		padding: 24px 16px 40px;
		box-sizing: border-box;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		color: #1a2b4a;
	}

	.input-card {
		background: #ffffff;
		border-radius: 16px;
		padding: 16px;
		box-shadow: 0 2px 12px rgba(50, 152, 247, 0.08);
		border: 1px solid #e8f0fe;
		min-height: 180px;
		box-sizing: border-box;
	}

	.feedback-textarea {
		width: 100%;
		min-height: 160px;
		font-size: 15px;
		line-height: 1.6;
		color: #1a2b4a;
		background: transparent;
	}

	.bt_Accept {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 36px 8px 0;
		height: 48px;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		width: auto;
		color: #ffffff;
		background: #3298F7;
		box-shadow: 0 4px 14px rgba(50, 152, 247, 0.35);
		border: none;
	}

	.bt_Accept::after {
		border: none;
	}

	.bt_Accept:active {
		opacity: 0.9;
		transform: scale(0.98);
	}

	.lianxibg {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		padding: 10px;
		color: #3298F7;
		font-size: 15px;
		font-weight: 500;
	}

	.lianxibg:active {
		opacity: 0.7;
	}
</style>
