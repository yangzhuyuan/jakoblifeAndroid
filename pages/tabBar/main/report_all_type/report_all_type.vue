<template>
	<view class="page">
		<view class="wave"></view>
		<view class="content">
			<view class="hs-header">
				<view class="header">
					<text class="page-title">{{ $t('监测报告') }}</text>
					<text class="page-subtitle">{{ $t('监测报告副标题') }}</text>
				</view>
				<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			</view>
			<view class="card" hover-class="card-hover" @click="clickset(24)">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/baogao_1.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('小时监测报告24标题') }}</text>
					<text class="card-desc">{{ $t('小时监测报告24描述') }}</text>
				</view>
				<uni-icons class="card-arrow" type="right" size="16" color="#C3CDD8"></uni-icons>
			</view>
			<view class="card" hover-class="card-hover" @click="clickset(7)">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/baogao_2.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('天趋势报告7标题') }}</text>
					<text class="card-desc">{{ $t('天趋势报告7描述') }}</text>
				</view>
				<uni-icons class="card-arrow" type="right" size="16" color="#C3CDD8"></uni-icons>
			</view>
			<view class="card" hover-class="card-hover" @click="goToSupplement">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/baogao_3.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('连续血压趋势分析') }}</text>
					<text class="card-desc">{{ $t('连续血压趋势分析描述') }}</text>
				</view>
				<uni-icons class="card-arrow" type="right" size="16" color="#C3CDD8"></uni-icons>
			</view>
			<view class="card" hover-class="card-hover" @click="goToSupplementdata">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/baogao_4.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('无气囊充气血压报告') }}</text>
					<text class="card-desc">{{ $t('无气囊充气血压报告描述') }}</text>
				</view>
				<uni-icons class="card-arrow" type="right" size="16" color="#C3CDD8"></uni-icons>
			</view>
			<view class="info-box">
				<uni-icons type="info" size="16" color="#4A78C6"></uni-icons>
				<text class="info-text">{{ $t('报告仅用于查看测量数据和趋势分析') }}</text>
			</view>
		</view>
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
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #eef6fc 40%, #f4f7fb 100%);
		box-sizing: border-box;
		position: relative;
	}

	.wave {
		position: absolute;
		top: -180rpx;
		left: -120rpx;
		width: 560rpx;
		height: 420rpx;
		background: radial-gradient(ellipse at center, #FFFFFF 0%, rgba(255, 255, 255, 0.55) 46%, rgba(244, 248, 252, 0) 72%);
		pointer-events: none;
		z-index: 0;
	}

	.content {
		position: relative;
		z-index: 1;
		padding: 32rpx 40rpx 56rpx;
		box-sizing: border-box;
	}

	.header {
		margin-top: 10px;
		margin-bottom: 36rpx;
		padding: 8rpx 8rpx 0;
	}

	.hs-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 28rpx;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.page-title {
		display: block;
		font-size: 48rpx;
		font-weight: 700;
		color: #1A2B4A;
		line-height: 1.3;
	}

	.page-subtitle {
		display: block;
		margin-top: 12rpx;
		font-size: 26rpx;
		color: #8A97AB;
		line-height: 1.5;
	}

	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		border-radius: 32rpx;
		padding: 36rpx 32rpx;
		margin-bottom: 28rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.card-hover {
		opacity: 0.86;
	}

	.card-icon {
		width: 58px;
		height: 58px;
		border-radius: 50%;
		background: #E8F0FE;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.card-icon-img {
		width: 58px;
		height: 58px;
	}

	.card-text {
		flex: 1;
		min-width: 0;
		padding: 0 28rpx;
	}

	.card-title {
		display: block;
		font-size: 30rpx;
		font-weight: 700;
		color: #1A2B4A;
		line-height: 1.35;
	}

	.card-desc {
		display: block;
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #8A94A6;
		line-height: 1.45;
	}

	.card-arrow {
		flex-shrink: 0;
	}

	.info-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: #EAF2FF;
		border: 2rpx solid #D4E4FA;
		border-radius: 24rpx;
		padding: 22rpx 24rpx;
		margin-top: 8rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.info-text {
		flex: 1;
		margin-left: 12rpx;
		font-size: 24rpx;
		color: #4A78C6;
		line-height: 1.5;
	}
</style>