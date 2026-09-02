<template>
	<view class="page">
		<view class="ecg-container">
			<ecg-wave ref="wave" :box-height="boxHeight" />
		</view>
		<view class="control-panel"></view>
		<view style="padding:0px 20px;">
			<button class="btn secondary" @tap="$emit('start-measure')">{{$t('发送ECG测量命令')}}</button>
		</view>
		<view style="padding: 20px;color: red;">{{$t("ECG测量提示")}}</view>
		<view class="stats-panel" v-if="statsVisible">
			<view class="stats-panel-head">
				<view class="stats-panel-head-left">
					<view class="stats-panel-accent"></view>
					<text class="stats-panel-title">{{$t('最新测量数据')}}</text>
				</view>
				<image class="stats-panel-logo" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			</view>

			<view class="stats-status-grid">
				<view class="stats-status-item">
					<text class="stats-status-label">{{$t('基础特征提取状态')}}</text>
					<text class="stats-status-value">{{ baseFeaturesExtracted }}</text>
				</view>
				<view class="stats-status-item">
					<text class="stats-status-label">{{$t('衍生特征提取状态')}}</text>
					<text class="stats-status-value">{{ derivedFeaturesExtracted }}</text>
				</view>
			</view>

			<view class="stats-metrics">
				<view class="stats-metric-item">
					<text class="stats-metric-label">{{$t('信号质量评分')}}</text>
					<text class="stats-metric-value">{{ qualityScore }}</text>
				</view>
				<view class="stats-metric-item" v-if="!isLongModelScore(modelScore)">
					<text class="stats-metric-label">{{$t('模型评分')}}</text>
					<text class="stats-metric-value">{{ formatModelScore(modelScore) }}</text>
				</view>
			</view>

			<view class="stats-warning" v-if="isLongModelScore(modelScore)">
				<text class="stats-warning-title">{{$t('模型评分')}}</text>
				<text class="stats-warning-text">{{ formatModelScore(modelScore) }}</text>
			</view>
		</view>
		<view class="record-list">
			<view class="record-card" v-for="(item,index) in ecgdatarows" :key="index">
				<view class="record-header">
					<text class="record-time">{{ item.createTime }}</text>
					<view
						@click="$emit('ecg-detail', item.createTime, item.startTime, item.recordId, item.rawData, item.voltageRange, item.dataFormat, item.dataLength)"
						class="record-ecg-btn">{{$t('心电图')}}</view>
				</view>
				<view class="record-metrics">
					<view class="metric-item">
						<text class="metric-label">{{$t('信号质量评分')}}</text>
						<text class="metric-value">{{ item.qualityScore }}</text>
					</view>
					<view class="metric-item" v-if="!isLongModelScore(item.modelScore)">
						<text class="metric-label">{{$t('模型评分')}}</text>
						<text class="metric-value">{{ formatModelScore(item.modelScore) }}</text>
					</view>
				</view>
				<view class="record-warning" v-if="isLongModelScore(item.modelScore)">
					<text class="record-warning-title">{{$t('模型评分')}}</text>
					<text class="record-warning-text">{{ formatModelScore(item.modelScore) }}</text>
				</view>
				<template v-if="getAfScoreInfo(item.modelScore)">
					<view class="record-divider"></view>
					<view class="af-block">
						<view class="af-section">
							<text class="af-title">{{$t('房颤提示')}}</text>
							<view class="af-prompt-tag" :class="'af-level-' + getAfRiskLevel(item.modelScore)">
								{{ getAfScoreInfo(item.modelScore).prompt }}
							</view>
						</view>
						<view class="af-section">
							<text class="af-title">{{$t('房颤建议')}}</text>
							<text class="af-suggestion">{{ getAfScoreInfo(item.modelScore).suggestion }}</text>
						</view>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import ecgWave from "../../components/ecg-wave/ecg-wave.vue";

	export default {
		name: 'EcgSwiperItem',
		components: {
			ecgWave
		},
		props: {
			statsVisible: {
				type: Boolean,
				default: true
			},
			baseFeaturesExtracted: {
				type: String,
				default: ''
			},
			derivedFeaturesExtracted: {
				type: String,
				default: ''
			},
			qualityScore: {
				type: [String, Number],
				default: ''
			},
			modelScore: {
				type: [String, Number],
				default: ''
			},
			ecgdatarows: {
				type: Array,
				default: () => []
			},
			boxHeight: {
				type: Number,
				default: 120
			}
		},
		methods: {
			formatModelScore(score) {
				if (score == null || score === '') {
					return this.$t('ECG房颤数据质量偏低提示')
				}
				return score
			},
			isLongModelScore(score) {
				const text = this.formatModelScore(score)
				return typeof text === 'string' && text.length > 20
			},
			getAfScoreInfo(score) {
				const num = Number(score)
				if (!Number.isFinite(num)) {
					return null
				}
				if (num >= 800) {
					return {
						prompt: this.$t('ECG房颤评分低风险'),
						suggestion: this.$t('ECG房颤评分低风险建议')
					}
				}
				if (num >= 500) {
					return {
						prompt: this.$t('ECG房颤评分可疑'),
						suggestion: this.$t('ECG房颤评分可疑建议')
					}
				}
				return {
					prompt: this.$t('ECG房颤评分高风险'),
					suggestion: this.$t('ECG房颤评分高风险建议')
				}
			},
			getAfRiskLevel(score) {
				const num = Number(score)
				if (!Number.isFinite(num)) return 'unknown'
				if (num >= 800) return 'low'
				if (num >= 500) return 'medium'
				return 'high'
			}
		}
	}
</script>

<style scoped>
	.page {
		display: flex;
		flex-direction: column;
		padding-bottom: 100px;
		background: white;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.ecg-container {
		padding: 10px;
		overflow: visible;
		box-sizing: border-box;
	}

	.control-panel {
		padding: 24px;
		margin-top: 240px;
		margin-left: 10px;
		margin-right: 10px;
	}

	.btn {
		flex: 1;
		min-width: 160rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		border: none;
	}

	.btn.secondary {
		background: #f0f0f0;
		color: #333;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.stats-panel {
		background: linear-gradient(165deg, #eff6ff 0%, #f0f9ff 45%, #f8fafc 100%);
		border-radius: 28rpx;
		padding: 36rpx 32rpx 40rpx;
		margin: 0 24rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		border: 1rpx solid #dbeafe;
	}

	.stats-panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32rpx;
		padding-bottom: 28rpx;
		border-bottom: 1rpx solid rgba(147, 197, 253, 0.45);
	}

	.stats-panel-head-left {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
	}

	.stats-panel-logo {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		flex-shrink: 0;
		margin-left: 20rpx;
		background: #ffffff;
		border: 2rpx solid #bfdbfe;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.stats-panel-accent {
		width: 8rpx;
		height: 36rpx;
		border-radius: 999rpx;
		background: linear-gradient(180deg, #60a5fa 0%, #2563eb 100%);
		margin-right: 18rpx;
		flex-shrink: 0;
	}

	.stats-panel-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #1e3a8a;
		line-height: 1.4;
	}

	.stats-status-grid {
		display: flex;
		gap: 24rpx;
		margin-bottom: 24rpx;
	}

	.stats-status-item {
		flex: 1;
		background: rgba(255, 255, 255, 0.92);
		border-radius: 20rpx;
		padding: 26rpx 24rpx;
		border: 1rpx solid #e0e7ff;
		min-width: 0;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.stats-status-label {
		display: block;
		font-size: 22rpx;
		color: #64748b;
		line-height: 1.5;
		margin-bottom: 14rpx;
	}

	.stats-status-value {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #0f172a;
		line-height: 1.4;
		word-break: break-all;
	}

	.stats-metrics {
		display: flex;
		gap: 24rpx;
	}

	.stats-metric-item {
		flex: 1;
		background: rgba(255, 255, 255, 0.96);
		border-radius: 20rpx;
		padding: 28rpx 26rpx;
		border: 1rpx solid #dbeafe;
		min-width: 0;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.stats-metric-label {
		display: block;
		font-size: 22rpx;
		color: #64748b;
		line-height: 1.5;
		margin-bottom: 16rpx;
	}

	.stats-metric-value {
		display: block;
		font-size: 38rpx;
		font-weight: 700;
		color: #1d4ed8;
		line-height: 1.2;
		word-break: break-all;
	}

	.stats-warning {
		margin-top: 24rpx;
		background: #fef2f2;
		border: 1rpx solid #fecaca;
		border-radius: 20rpx;
		padding: 24rpx 26rpx;
	}

	.stats-warning-title {
		display: block;
		font-size: 22rpx;
		color: #991b1b;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.stats-warning-text {
		display: block;
		font-size: 24rpx;
		color: #dc2626;
		line-height: 1.7;
		white-space: pre-wrap;
		font-weight: 400;
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14rpx 0;
		border-bottom: 1rpx solid #f1f5f9;
	}

	.stats-row:last-child {
		border-bottom: none;
	}

	.stats-label {
		font-size: 26rpx;
		color: #64748b;
		font-weight: 500;
	}

	.stats-value {
		font-size: 28rpx;
		color: #0f172a;
		font-weight: 600;
		font-family: inherit;
	}

	.stats-row-column {
		flex-direction: column;
		align-items: stretch;
	}

	.stats-value-hint {
		font-family: inherit;
		white-space: pre-wrap;
		line-height: 1.7;
		margin-top: 12rpx;
		color: #dc2626;
		font-size: 24rpx;
		font-weight: 400;
		background: #fef2f2;
		border-radius: 12rpx;
		padding: 16rpx 20rpx;
	}

	.record-list {
		padding: 16rpx 24rpx 0;
	}

	.record-card {
		background: linear-gradient(165deg, #eff6ff 0%, #f0f9ff 45%, #f8fafc 100%);
		border-radius: 28rpx;
		padding: 36rpx 32rpx 40rpx;
		margin-top: 28rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		border: 1rpx solid #dbeafe;
	}

	.record-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32rpx;
		padding-bottom: 24rpx;
		border-bottom: 1rpx solid rgba(147, 197, 253, 0.45);
	}

	.record-time {
		font-size: 32rpx;
		font-weight: 600;
		color: #1e3a8a;
		line-height: 1.4;
	}

	.record-ecg-btn {
		flex-shrink: 0;
		padding: 12rpx 32rpx;
		border-radius: 999rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #ffffff;
		background: linear-gradient(135deg, #34d399 0%, #059669 100%);
		border: 1rpx solid #6ee7b7;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.record-metrics {
		display: flex;
		gap: 24rpx;
	}

	.metric-item {
		flex: 1;
		background: rgba(255, 255, 255, 0.96);
		border-radius: 20rpx;
		padding: 28rpx 26rpx;
		border: 1rpx solid #dbeafe;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.metric-label {
		display: block;
		font-size: 22rpx;
		color: #64748b;
		line-height: 1.5;
		margin-bottom: 16rpx;
	}

	.metric-value {
		display: block;
		font-size: 38rpx;
		font-weight: 700;
		color: #1d4ed8;
		line-height: 1.2;
		word-break: break-all;
	}

	.record-warning {
		margin-top: 24rpx;
		background: #fef2f2;
		border: 1rpx solid #fecaca;
		border-radius: 20rpx;
		padding: 24rpx 26rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.record-warning-title {
		display: block;
		font-size: 22rpx;
		color: #991b1b;
		font-weight: 600;
		margin-bottom: 12rpx;
	}

	.record-warning-text {
		display: block;
		font-size: 24rpx;
		color: #dc2626;
		line-height: 1.75;
		white-space: pre-wrap;
		font-weight: 400;
	}

	.record-divider {
		height: 1rpx;
		background: rgba(147, 197, 253, 0.45);
		margin: 32rpx 0 28rpx;
	}

	.af-block {
		display: flex;
		flex-direction: column;
		gap: 28rpx;
	}

	.af-section {
		display: flex;
		flex-direction: column;
	}

	.af-title {
		font-size: 24rpx;
		color: #475569;
		font-weight: 600;
		line-height: 1.5;
		margin-bottom: 14rpx;
	}

	.af-prompt-tag {
		display: inline-flex;
		align-self: flex-start;
		padding: 12rpx 24rpx;
		border-radius: 999rpx;
		font-size: 26rpx;
		font-weight: 600;
		line-height: 1.4;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.af-level-low {
		color: #047857;
		background: #ecfdf5;
		border: 1rpx solid #6ee7b7;
	}

	.af-level-medium {
		color: #b45309;
		background: #fffbeb;
		border: 1rpx solid #fcd34d;
	}

	.af-level-high {
		color: #b91c1c;
		background: #fef2f2;
		border: 1rpx solid #fca5a5;
	}

	.af-suggestion {
		font-size: 26rpx;
		color: #334155;
		line-height: 1.8;
		white-space: pre-wrap;
		background: rgba(255, 255, 255, 0.96);
		border-radius: 20rpx;
		padding: 24rpx 26rpx;
		border: 1rpx solid #e0e7ff;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}
</style>