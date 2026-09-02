<template>
	<view class="detail-page">
		<view class="chart-wrap-card">
			<view class="pagedsismj_4">
				<picker style="flex: 2;" @change="onTypeChange" :value="types_index" :range="types_array">
					<view class="picker-text">
						{{ types_array[types_index] }}
					</view>
				</picker>
				<picker @change="onTypeChange" :value="types_index" :range="types_array">
					<uni-icons style="flex: 1;" type="bottom" size="18" color="white"></uni-icons>
				</picker>
			</view>
			<view class="chart-section-title">{{ $t('当天') }}：</view>
			<view class="charts-box-ppg">
				<qiun-data-charts type="line" :opts="optsPPG" :chartData="chartDataPPG" />
			</view>
			<view class="chart-section-title">{{ $t('两周') }}：{{ $t('平均') }}</view>
			<view class="charts-box-ppg">
				<qiun-data-charts type="line" :opts="optsPPG2" :chartData="chartDataPPG2" />
			</view>
			<view class="chart-divider"></view>
			<view class="page-transparent">
				<view class="table-title">{{ $t('指标阈值表') }}</view>
				<view class="table-box">
					<view class="thead">
						<text class="th">{{ $t('指标名称') }}</text>
						<text class="th">{{ $t('阈值') }}</text>
						<text class="th">{{ $t('对应描述') }}</text>
					</view>
					<view class="tbody" v-for="(row, i) in Indicatorlist" :key="i">
						<text class="td">{{ row.zh }}</text>
						<text class="td">
							<text :class="row.red ? 'red' : ''">{{ row.val }}</text>
						</text>
						<text class="td">
							<text :class="row.red ? 'red' : ''">{{ row.desc }}</text>
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				types_index: 0,
				types_array: [],
				optsPPG: {},
				chartDataPPG: {
					categories: [],
					series: []
				},
				optsPPG2: {},
				chartDataPPG2: {
					categories: [],
					series: []
				},
				Indicatorlist: []
			}
		},
		onLoad() {
			const cached = uni.getStorageSync('emotion_trend_detail') || {}
			this.types_index = Number(cached.types_index || 0)
			this.types_array = cached.types_array || []
			this.optsPPG = cached.optsPPG || {}
			this.chartDataPPG = cached.chartDataPPG || {
				categories: [],
				series: []
			}
			this.optsPPG2 = cached.optsPPG2 || {}
			this.chartDataPPG2 = cached.chartDataPPG2 || {
				categories: [],
				series: []
			}
			this.Indicatorlist = cached.Indicatorlist || []
			uni.setNavigationBarTitle({
				title: this.$t('AI健康趋势分析')
			})
		},
		methods: {
			onTypeChange(e) {
				this.types_index = Number(e.detail.value || 0)
			}
		}
	}
</script>

<style scoped>
	.detail-page {
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		min-height: 100vh;
		padding: 16px;
		box-sizing: border-box;
	}

	.chart-wrap-card {
		padding: 16px;
		margin-bottom: 20px;
		box-sizing: border-box;
	}

	.pagedsismj_4 {
		background: #3298F7;
		margin: 0 0 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		padding: 15px;
		border-radius: 20px;
	}

	.picker-text {
		font-size: 14px;
		color: white;
	}

	.chart-section-title {
		margin: 20px 0;
		font-size: 20px;
		font-weight: 600;
		color: #1a2b4a;
	}

	.charts-box-ppg {
		padding: 5px;
		background: white;
		border-radius: 20px;
		width: 100%;
		height: 300px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.chart-divider {
		margin-top: 20px;
		width: 100%;
		height: 1px;
		background: #eef1f6;
	}

	.page-transparent {
		background: transparent;
		padding: 20rpx 0 0;
	}

	.table-title {
		font-size: 17px;
		font-weight: 600;
		display: flex;
		justify-content: center;
		margin-bottom: 12px;
		color: #1a2b4a;
	}

	.table-box {
		display: flex;
		flex-direction: column;
		border: 1rpx solid rgba(0, 0, 0, 0.15);
		border-radius: 8rpx;
		overflow: hidden;
	}

	.thead {
		display: flex;
		background: rgba(0, 0, 0, 0.03);
	}

	.th {
		flex: 1;
		padding: 14rpx 10rpx;
		font-size: 26rpx;
		color: #333;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.th:last-child {
		border-right: 0;
	}

	.tbody {
		display: flex;
		border-top: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td {
		flex: 1;
		padding: 12rpx 10rpx;
		font-size: 26rpx;
		color: #444;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td:last-child {
		border-right: 0;
	}

	.red {
		color: #e60012;
		font-weight: 500;
	}
</style>