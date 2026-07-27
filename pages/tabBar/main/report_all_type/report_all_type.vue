<template>
	<view class="container">
		<!-- <view class="path-tip">{{$t('动态监测报告填写路径提示')}}</view> -->
		<button class="buttonstyle button-24h" @click="clickset(24)">{{$t("小时监测报告24")}}</button>
		<button class="buttonstyle button-7d" @click="clickset(7)">{{$t("天监测报告7")}}</button>
		<button class="buttonstyle button-report" @click="goToSupplement">{{$t("连续血压监控详细风险报告")}}</button>
		<button class="buttonstyle button-data" @click="goToSupplementdata">{{$t("无感血压报告")}}</button>
	</view>
</template>

<script>
	export default {
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("报告")
			})
		},
		methods: {
			clickset(type) {
				uni.navigateTo({
					url: '../../main/globalweather/Personal_Information?type=' + type
				})
			},
			goToSupplement() {
				uni.navigateTo({
					url: '/pages/tabBar/tendency/supplement'
				})
			},
			goToSupplementdata() {
				uni.navigateTo({
					url: '/pages/tabBar/main/report_all_type/Smooth_BP_Data'
				})
			}

		}
	}
</script>

<style scoped>
	.container {
		min-height: 100vh;
		padding: 20px 20px 0 20px;
		box-sizing: border-box;
	}

	.path-tip {
		margin: 10px;
		color: red;
		font-size: 14px;
		line-height: 1.6;
		background: white;
		padding: 10px;
		border-radius: 15px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		text-decoration: underline;
		/* 可选：设置下划线颜色 */
		text-decoration-color: #ff0000;
		font-style: italic;
	}

	.buttonstyle {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 100px;
		margin: 30px 20rpx;
		color: white;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 48rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		transition: all 0.3s;
	}

	.button-24h {
		background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
	}

	.button-7d {
		background: linear-gradient(135deg, #52C41A 0%, #389e0d 100%);
	}

	.button-report {
		background: linear-gradient(135deg, #ff9500 0%, #ff6b00 100%);
	}

	.button-data {
		background: linear-gradient(135deg, #EB1508 0%, #EB2208 100%);
	}

	button::after {
		border: none;
	}
</style>