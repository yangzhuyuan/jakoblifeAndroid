<template>
	<view class="page">
		<view class="ecg-container">
			<ecg-wave ref="wave" />
		</view>
		<view class="control-panel"></view>
		<view style="padding:0px 20px;">
			<button class="btn secondary" @tap="$emit('start-measure')">{{$t('发送ECG测量命令')}}</button>
		</view>
		<view style="padding: 20px;color: red;">{{$t("ECG测量提示")}}</view>
		<view class="stats-panel" v-if="statsVisible">
			<view class="stats-row">
				<text class="stats-label">{{$t('基础特征提取状态')}}</text>
				<text class="stats-value">{{ baseFeaturesExtracted }}</text>
			</view>
			<view class="stats-row">
				<text class="stats-label">{{$t('衍生特征提取状态')}}</text>
				<text class="stats-value">{{ derivedFeaturesExtracted }}</text>
			</view>
			<view class="stats-row">
				<text class="stats-label">{{$t('信号质量评分')}}</text>
				<text class="stats-value">{{ qualityScore }}</text>
			</view>
			<view class="stats-row" :class="{ 'stats-row-column': isLongModelScore(modelScore) }">
				<text class="stats-label">{{$t('模型评分')}}</text>
				<text class="stats-value" :class="{ 'stats-value-hint': isLongModelScore(modelScore) }">{{ formatModelScore(modelScore) }}</text>
			</view>
		</view>
		<view class="ecgdatarows_sty" v-for="(item,index) in ecgdatarows" :key="index">
			<view class="ecgdatarows_sty_item">
				<view class="ecgdatarows_sty_item_1">
					<view>{{item.createTime}}</view>
					<view
						@click="$emit('ecg-detail', item.createTime, item.startTime, item.recordId, item.rawData, item.voltageRange, item.dataFormat, item.dataLength)"
						class="ecgdatarows_sty_item_bt">{{$t('心电图')}}
					</view>
				</view>
				<view class="ecgdatarows_sty_item_1">
					<text class="stats-label">{{$t('信号质量评分')}}</text>
					<text class="stats-value">{{ item.qualityScore }}</text>
				</view>
				<view class="ecgdatarows_sty_item_1" :class="{ 'stats-row-column': isLongModelScore(item.modelScore) }">
					<text class="stats-label">{{$t('模型评分')}}</text>
					<text class="stats-value" :class="{ 'stats-value-hint': isLongModelScore(item.modelScore) }">{{ formatModelScore(item.modelScore) }}</text>
				</view>
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
	}

	.stats-panel {
		background: #fff;
		border-radius: 16rpx;
		padding: 24px;
		margin-left: 10px;
		margin-right: 10px;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 0;
	}

	.stats-label {
		font-size: 26rpx;
		color: #666;
	}

	.stats-value {
		font-size: 26rpx;
		color: #333;
		font-family: monospace;
	}

	.stats-row-column {
		flex-direction: column;
		align-items: stretch;
	}

	.stats-value-hint {
		font-family: inherit;
		white-space: pre-wrap;
		line-height: 1.6;
		margin-top: 8rpx;
		color: #e64340;
		font-size: 24rpx;
	}

	.ecgdatarows_sty {
		margin: 20px 20px 0 20px;
	}

	.ecgdatarows_sty_item {
		display: flex;
		flex-direction: column;
		background: wheat;
		padding: 15px;
		border-radius: 20px;
		color: black;
		font-weight: bold;
	}

	.ecgdatarows_sty_item_1 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: black;
		font-weight: bold;
	}

	.ecgdatarows_sty_item_bt {
		border: 1px solid #07c160;
		padding: 5px 20px;
		border-radius: 100px;
	}
</style>