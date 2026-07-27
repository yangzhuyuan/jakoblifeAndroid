<template>
	<view class="container">
		<!-- 头部 -->
		<view class="header">
			<view class="header-title">
				<text class="title">🌿 {{$t("脉诊健康管理")}}</text>
				<text class="subtitle">{{$t("中医脉诊数字化分析体质健康监测")}}</text>
			</view>
			<view class="demo-badge">
				<text>❤️</text>
			</view>
		</view>
		<!-- 统计卡片 -->
		<view class="stats-grid">
			<view class="stat-card">
				<text class="stat-value">{{ stats.totalCount }}</text>
				<text class="stat-label">{{$t("总测量次数")}}</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ stats.avgBloodStasis }}</text>
				<text class="stat-label">{{$t("平均血瘀指数")}}</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ stats.avgDampness }}</text>
				<text class="stat-label">{{$t("平均湿气指数")}}</text>
			</view>
			<view class="stat-card">
				<text class="stat-value">{{ stats.avgQiBlood }}</text>
				<text class="stat-label">{{$t("平均气血指数")}}</text>
			</view>
		</view>

		<!-- 最新测量结果 -->
		<view class="latest-result" v-if="latestData">
			<view class="card-header">
				<text class="card-title">📋 {{$t("最新测量结果")}}</text>
				<text class="result-date">{{ latestData.date.formatted }}</text>
			</view>
			<view class="result-grid">
				<view class="result-item" :class="'level-' + latestData.bloodStasisLevel.level">
					<view class="result-icon">🩸</view>
					<text class="result-label">{{$t("血瘀指数")}}</text>
					<text class="result-value">{{ latestData.bloodStasisIndex }}</text>
					<view class="progress-bar">
						<view class="progress-fill"
							:style="{ width: (latestData.bloodStasisIndex / 10 * 100) + '%', background: getProgressColor(latestData.bloodStasisIndex, false) }">
						</view>
					</view>
					<text class="result-level">{{ latestData.bloodStasisLevel.text }}</text>
					<text class="result-desc">{{ latestData.bloodStasisLevel.description }}</text>
				</view>
				<view class="result-item" :class="'level-' + latestData.dampnessLevel.level">
					<view class="result-icon">💧</view>
					<text class="result-label">{{$t("湿气指数")}}</text>
					<text class="result-value">{{ latestData.dampnessIndex }}</text>
					<view class="progress-bar">
						<view class="progress-fill"
							:style="{ width: (latestData.dampnessIndex / 10 * 100) + '%', background: getProgressColor(latestData.dampnessIndex, false) }">
						</view>
					</view>
					<text class="result-level">{{ latestData.dampnessLevel.text }}</text>
					<text class="result-desc">{{ latestData.dampnessLevel.description }}</text>
				</view>
				<view class="result-item" :class="'level-' + latestData.qiBloodLevel.level">
					<view class="result-icon">⚡</view>
					<text class="result-label">{{$t("气血指数")}}</text>
					<text class="result-value">{{ latestData.qiBloodIndex }}</text>
					<view class="progress-bar">
						<view class="progress-fill"
							:style="{ width: (latestData.qiBloodIndex / 10 * 100) + '%', background: getProgressColor(latestData.qiBloodIndex, true) }">
						</view>
					</view>
					<text class="result-level">{{ latestData.qiBloodLevel.text }}</text>
					<text class="result-desc">{{ latestData.qiBloodLevel.description }}</text>
				</view>
			</view>
		</view>

		<!-- 健康建议 -->
		<view class="advice-card" v-if="latestData">
			<view class="card-header">
				<text class="card-title">💡 {{$t("健康建议")}}</text>
				<text class="advice-badge">{{$t("基于中医理论")}}</text>
			</view>
			<view class="advice-content">
				<view class="advice-item" v-for="(advice, idx) in healthAdvices" :key="idx">
					<text class="advice-icon">{{ advice.icon }}</text>
					<view class="advice-text">
						<text class="advice-title">{{ advice.title }}</text>
						<text class="advice-desc">{{ advice.description }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 操作按钮栏 -->
		<view class="action-bar">
			<button class="btn-action" @click="startData">
				<text class="btn-icon">📏️</text>
				<text>{{$t("测量数据")}}</text>
			</button>
			<button class="btn-action" @click="refreshData">
				<text class="btn-icon">🔄</text>
				<text>{{$t("刷新数据")}}</text>
			</button>
			<button class="btn-action" @click="clearAllData">
				<text class="btn-icon">🗑️</text>
				<text>{{$t("清空数据")}}</text>
			</button>
		</view>

		<!-- 历史记录列表 -->
		<view class="history-card">
			<view class="card-header">
				<text class="card-title">📜 {{$t("历史记录")}}</text>
				<text class="history-count">{{$t("共")}} {{ pulseDataList.length }} {{$t("条")}}</text>
			</view>

			<scroll-view scroll-y class="history-list" @scrolltolower="loadMoreData" :enable-back-to-top="true">
				<view v-for="(item, index) in displayList" :key="index" class="history-item">
					<view class="history-time">
						<text class="history-date">{{ item.date.formatted }}</text>
					</view>
					<view class="history-data">
						<view class="history-data-item">
							<text class="data-label">{{$t("血瘀")}}</text>
							<text class="data-value" :style="{ color: getIndexColor(item.bloodStasisIndex, false) }">
								{{ item.bloodStasisIndex }}
							</text>
							<view class="mini-progress">
								<view class="mini-progress-fill"
									:style="{ width: (item.bloodStasisIndex / 10 * 100) + '%', background: getProgressColor(item.bloodStasisIndex, false) }">
								</view>
							</view>
						</view>
						<view class="history-data-item">
							<text class="data-label">{{$t("湿气")}}</text>
							<text class="data-value" :style="{ color: getIndexColor(item.dampnessIndex, false) }">
								{{ item.dampnessIndex }}
							</text>
							<view class="mini-progress">
								<view class="mini-progress-fill"
									:style="{ width: (item.dampnessIndex / 10 * 100) + '%', background: getProgressColor(item.dampnessIndex, false) }">
								</view>
							</view>
						</view>
						<view class="history-data-item">
							<text class="data-label">{{$t("气血")}}</text>
							<text class="data-value" :style="{ color: getIndexColor(item.qiBloodIndex, true) }">
								{{ item.qiBloodIndex }}
							</text>
							<view class="mini-progress">
								<view class="mini-progress-fill"
									:style="{ width: (item.qiBloodIndex / 10 * 100) + '%', background: getProgressColor(item.qiBloodIndex, true) }">
								</view>
							</view>
						</view>
					</view>
					<view class="history-tags">
						<text class="tag" :class="'tag-' + item.bloodStasisLevel.level">
							{{ item.bloodStasisLevel.text }}
						</text>
						<text class="tag" :class="'tag-' + item.dampnessLevel.level">
							{{ item.dampnessLevel.text }}
						</text>
						<text class="tag" :class="'tag-' + item.qiBloodLevel.level">
							{{ item.qiBloodLevel.text }}
						</text>
					</view>
				</view>

				<view v-if="hasMoreData && pulseDataList.length > pageSize" class="load-more">
					<text class="load-more-text" @tap="loadMoreData">{{$t("加载更多")}}</text>
				</view>
				<view v-if="!hasMoreData && pulseDataList.length > 0" class="load-more">
					<text class="load-more-text load-end">—— {{$t("没有更多数据了")}} ——</text>
				</view>
				<view v-if="pulseDataList.length === 0" class="load-more">
					<text class="load-more-text">{{$t("暂无脉诊数据")}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 免责声明和评分说明 -->
		<view class="footer-note">
			<view class="disclaimer">
				<text class="disclaimer-icon">⚠️</text>
				<text class="disclaimer-text">{{$t("脉诊数据来源于智能设备检测仅供健康参考")}}</text>
			</view>
			<view class="score-guide">
				<view class="guide-title">📊 {{$t("评分说明")}}</view>
				<view class="guide-content">
					<view class="guide-item">
						<text class="guide-label">{{$t("血瘀湿气")}}：</text>
						<text class="guide-desc">{{$t("血瘀湿气评分规则")}}</text>
					</view>
					<view class="guide-item">
						<text class="guide-label">{{$t("气血")}}：</text>
						<text class="guide-desc">{{$t("气血评分规则")}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载提示 -->
		<view class="loading-mask" v-if="isLoading">
			<view class="loading-content">
				<view class="loading-spinner"></view>
				<text class="loading-text">{{$t("处理中")}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		u16proBLE
	} from '../../api/protocol/u16pro-ble-manager.js'
	const BPW6SERVICE = '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E';
	const BPW6WRITE = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
	const BPW6NOTIFY = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
	export default {
		data() {
			return {
				isLoading: false,
				pulseDataList: [],
				displayList: [],
				pageSize: 20, // 增加每页显示数量
				currentPage: 1,
				hasMoreData: true,
				stats: {
					totalCount: 0,
					avgBloodStasis: 0,
					avgDampness: 0,
					avgQiBlood: 0
				},
				healthAdvices: [],
				deviceId: uni.getStorageSync("BPW6devicemac")
			}
		},
		computed: {
			latestData() {
				return this.pulseDataList.length > 0 ? this.pulseDataList[0] : null
			}
		},
		onLoad() {
			this.loadRealData()
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("脉诊健康管理")
			})
			this.loadRealData()

		},
		methods: {
			/**
			 * 加载真实数据
			 */
			loadRealData() {
				const realData = uni.getStorageSync("Taking_pulse") || []
				// 处理数据，补充等级信息
				this.pulseDataList = realData.map(item => {
					return {
						...item,
						bloodStasisLevel: this._getBloodStasisLevel(item.bloodStasisIndex),
						dampnessLevel: this._getDampnessLevel(item.dampnessIndex),
						qiBloodLevel: this._getQiBloodLevel(item.qiBloodIndex)
					}
				}).sort((a, b) => b.timestamp - a.timestamp)

				this.updateStats()
				this.updateHealthAdvices()
				this.updateDisplayList()
			},

			/**
			 * 获取血瘀指数等级
			 * @param {number} score - 血瘀分数 (0-10)
			 */
			_getBloodStasisLevel(score) {
				if (score >= 7) return {
					level: 'severe',
					text: this.$t('血瘀重'),
					description: this.$t('血瘀程度较重建议及时调理'),
					color: 'red'
				}
				if (score >= 4) return {
					level: 'moderate',
					text: this.$t('血瘀较重'),
					description: this.$t('血瘀程度偏重需要注意'),
					color: 'yellow'
				}
				return {
					level: 'normal',
					text: this.$t('血瘀一般'),
					description: this.$t('血瘀程度较轻状况良好'),
					color: 'green'
				}
			},

			/**
			 * 获取湿气指数等级
			 * @param {number} score - 湿气分数 (0-10)
			 */
			_getDampnessLevel(score) {
				if (score >= 7) return {
					level: 'severe',
					text: this.$t('湿气重浊'),
					description: this.$t('湿气重浊建议及时调理'),
					color: 'red'
				}
				if (score >= 5) return {
					level: 'moderate',
					text: this.$t('湿气较重'),
					description: this.$t('湿气偏重需要注意'),
					color: 'yellow'
				}
				if (score === 4) return {
					level: 'normal',
					text: this.$t('湿气一般'),
					description: this.$t('湿气程度一般'),
					color: 'yellow'
				}
				return {
					level: 'normal',
					text: this.$t('湿气一般'),
					description: this.$t('湿气程度较轻状况良好'),
					color: 'green'
				}
			},

			/**
			 * 获取气血指数等级
			 * @param {number} score - 气血分数 (0-10)
			 */
			_getQiBloodLevel(score) {
				if (score >= 9) return {
					level: 'excellent',
					text: this.$t('气血旺盛'),
					description: this.$t('气血充沛状态良好'),
					color: 'green'
				}
				if (score >= 7) return {
					level: 'good',
					text: this.$t('气血一般'),
					description: this.$t('气血状态正常'),
					color: 'green'
				}
				if (score >= 4) return {
					level: 'poor',
					text: this.$t('气血不足'),
					description: this.$t('气血偏弱建议适当调理'),
					color: 'yellow'
				}
				return {
					level: 'critical',
					text: this.$t('气血虚亏'),
					description: this.$t('气血虚亏较重建议及时调理'),
					color: 'red'
				}
			},

			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
			/**
			 * 测量数据
			 */
			startData() {
				console.log('[BPW6] 诊脉 测量数据已发送', this.deviceId);
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: BPW6SERVICE,
					characteristicId: BPW6WRITE,
					writeType: 'writeNoResponse',
					value: this.toArrayBuffer('3A00000000000000000000000000003A'),
					success(res) {
						console.log('[BPW6] 诊脉 测量数据已发送', res);
					},
					fail(err) {
						console.log('[BPW6] 诊脉 测量数据发送失败', err);
					},
				});
			},

			/**
			 * 刷新数据
			 */
			refreshData() {
				u16proBLE.readLatestPulseDiagnosis2(1000, this.deviceId) //增诊脉数据
				uni.showToast({
					title: this.$t("刷新中"),
					icon: "loading",
					mask: true,
					duration: 2000
				})

				setTimeout(() => {
					this.loadRealData()
					uni.showToast({
						title: this.$t('数据已刷新'),
						icon: 'none'
					})
				}, 2000)
			},

			/**
			 * 清空所有数据
			 */
			clearAllData() {
				uni.showModal({
					title: this.$t('确认清空'),
					content: this.$t('确定要清空所有脉诊数据吗此操作不可恢复'),
					confirmColor: '#e74c3c',
					success: (res) => {
						if (res.confirm) {
							this.pulseDataList = []
							this.displayList = []
							this.currentPage = 1
							this.hasMoreData = false
							this.updateStats()
							this.updateHealthAdvices()
							uni.removeStorageSync("Taking_pulse")
							uni.showToast({
								title: this.$t('已清空所有数据'),
								icon: 'none'
							})
						}
					}
				})
			},

			/**
			 * 获取进度条颜色
			 * 血瘀/湿气：越高越红，越低越绿
			 * 气血：越高越绿，越低越红
			 */
			getProgressColor(value, reverse = false) {
				if (reverse) {
					// 气血指数：越高越好
					if (value >= 9) return '#2ecc71'
					if (value >= 7) return '#f39c12'
					if (value >= 4) return '#e67e22'
					return '#e74c3c'
				} else {
					// 血瘀/湿气指数：越低越好
					if (value <= 3) return '#2ecc71'
					if (value <= 6) return '#f39c12'
					return '#e74c3c'
				}
			},

			/**
			 * 获取指数颜色
			 */
			getIndexColor(value, reverse = false) {
				if (reverse) {
					if (value >= 9) return '#2ecc71'
					if (value >= 7) return '#f39c12'
					if (value >= 4) return '#e67e22'
					return '#e74c3c'
				} else {
					if (value <= 3) return '#2ecc71'
					if (value <= 6) return '#f39c12'
					return '#e74c3c'
				}
			},

			/**
			 * 更新显示列表（分页）
			 */
			updateDisplayList() {
				this.currentPage = 1
				this.displayList = this.pulseDataList.slice(0, this.pageSize)
				this.hasMoreData = this.pulseDataList.length > this.pageSize
			},

			/**
			 * 加载更多数据
			 */
			loadMoreData() {
				if (!this.hasMoreData || this.isLoading) return

				this.isLoading = true

				setTimeout(() => {
					this.currentPage++
					const end = this.currentPage * this.pageSize
					this.displayList = this.pulseDataList.slice(0, end)
					this.hasMoreData = this.pulseDataList.length > end
					this.isLoading = false
				}, 300)
			},

			/**
			 * 更新统计数据
			 */
			updateStats() {
				const count = this.pulseDataList.length
				if (count === 0) {
					this.stats = {
						totalCount: 0,
						avgBloodStasis: 0,
						avgDampness: 0,
						avgQiBlood: 0
					}
					return
				}

				let sumBloodStasis = 0
				let sumDampness = 0
				let sumQiBlood = 0

				this.pulseDataList.forEach(item => {
					sumBloodStasis += item.bloodStasisIndex
					sumDampness += item.dampnessIndex
					sumQiBlood += item.qiBloodIndex
				})

				this.stats = {
					totalCount: count,
					avgBloodStasis: (sumBloodStasis / count).toFixed(1),
					avgDampness: (sumDampness / count).toFixed(1),
					avgQiBlood: (sumQiBlood / count).toFixed(1)
				}
			},

			/**
			 * 更新健康建议
			 */
			updateHealthAdvices() {
				if (!this.latestData) {
					this.healthAdvices = [{
						icon: '📋',
						title: this.$t('暂无数据'),
						description: this.$t('暂无脉诊数据')
					}]
					return
				}

				const advices = []
				const bloodStasis = this.latestData.bloodStasisLevel
				const dampness = this.latestData.dampnessLevel
				const qiBlood = this.latestData.qiBloodLevel

				// 血瘀建议
				if (bloodStasis.level === 'severe') {
					advices.push({
						icon: '🩸',
						title: this.$t('血瘀调理'),
						description: this.$t('血瘀程度较重建议多食山楂丹参茶适当运动促进血液循环必要时咨询中医')
					})
				} else if (bloodStasis.level === 'moderate') {
					advices.push({
						icon: '🩸',
						title: this.$t('血瘀调理'),
						description: this.$t('血瘀程度偏重注意饮食运动可适当食用活血化瘀食物')
					})
				}

				// 湿气建议
				if (dampness.level === 'severe') {
					advices.push({
						icon: '💧',
						title: this.$t('祛湿调理'),
						description: this.$t('湿气重浊建议少食生冷多食薏米红豆保持运动排汗可配合艾灸调理')
					})
				} else if (dampness.level === 'moderate') {
					advices.push({
						icon: '💧',
						title: this.$t('祛湿调理'),
						description: this.$t('湿气偏重注意少食生冷适当运动排汗')
					})
				}

				// 气血建议
				if (qiBlood.level === 'critical') {
					advices.push({
						icon: '⚡',
						title: this.$t('气血调理'),
						description: this.$t('气血虚亏较重建议立即调理多食红枣桂圆枸杞保证充足睡眠')
					})
				} else if (qiBlood.level === 'poor') {
					advices.push({
						icon: '⚡',
						title: this.$t('气血调理'),
						description: this.$t('气血偏弱建议适当补充营养可服用补气血食物')
					})
				}

				// 综合建议
				if (advices.length === 0) {
					advices.push({
						icon: '✅',
						title: this.$t('健康状况良好'),
						description: this.$t('各项指标良好请继续保持健康的生活方式定期监测')
					})
				} else {
					advices.push({
						icon: '📌',
						title: this.$t('温馨提示'),
						description: this.$t('以上建议仅供参考如有不适请及时就医')
					})
				}

				this.healthAdvices = advices
			}
		}
	}
</script>

<style scoped>
	.container {
		min-height: 100vh;
		/* 新配色：薄荷绿渐变背景 */
		background: linear-gradient(135deg, #e0f2e9 0%, #b9dfcc 100%);
		padding: 15px;
		padding-bottom: 40rpx;
	}

	/* 头部样式 */
	.header {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 30rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	}

	.header-title {
		flex: 1;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		display: block;
	}

	.subtitle {
		font-size: 22rpx;
		color: #999;
		margin-top: 8rpx;
		display: block;
	}

	.demo-badge {
		padding: 12rpx 24rpx;
		border-radius: 60rpx;
		background: linear-gradient(135deg, #667eea, #764ba2);
		color: white;
		font-size: 24rpx;
		font-weight: bold;
	}

	/* 统计卡片网格 */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.stat-card {
		background: white;
		border-radius: 25rpx;
		padding: 30rpx;
		text-align: center;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.stat-value {
		font-size: 52rpx;
		font-weight: bold;
		color: #667eea;
		display: block;
		margin-bottom: 10rpx;
	}

	.stat-label {
		font-size: 24rpx;
		color: #666;
	}

	/* 卡片通用样式 */
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	/* 最新结果 */
	.latest-result,
	.advice-card,
	.history-card {
		background: white;
		border-radius: 25rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.result-date {
		font-size: 24rpx;
		color: #999;
	}

	.result-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
		margin-top: 20rpx;
	}

	.result-item {
		text-align: center;
		padding: 25rpx 15rpx;
		border-radius: 20rpx;
		background: #f8f9fa;
	}

	.result-icon {
		font-size: 48rpx;
		margin-bottom: 10rpx;
	}

	.result-label {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-bottom: 10rpx;
	}

	.result-value {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}

	.progress-bar {
		width: 100%;
		height: 8rpx;
		background: #e0e0e0;
		border-radius: 4rpx;
		overflow: hidden;
		margin: 15rpx 0;
	}

	.progress-fill {
		height: 100%;
		border-radius: 4rpx;
		transition: width 0.3s ease;
	}

	.result-level {
		font-size: 24rpx;
		display: block;
		margin-bottom: 8rpx;
		font-weight: bold;
	}

	.result-desc {
		font-size: 20rpx;
		color: #999;
		display: block;
		line-height: 1.4;
	}

	/* 健康建议 */
	.advice-badge {
		font-size: 22rpx;
		color: #999;
	}

	.advice-content {
		margin-top: 20rpx;
	}

	.advice-item {
		display: flex;
		margin-bottom: 20rpx;
		padding: 20rpx;
		background: #f8f9fa;
		border-radius: 20rpx;
	}

	.advice-icon {
		font-size: 48rpx;
		margin-right: 20rpx;
	}

	.advice-text {
		flex: 1;
	}

	.advice-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 8rpx;
	}

	.advice-desc {
		font-size: 24rpx;
		color: #666;
		line-height: 1.5;
	}

	/* 操作按钮 */
	.action-bar {
		display: flex;
		gap: 20rpx;
		margin-bottom: 30rpx;
		flex-wrap: wrap;
	}

	.btn-action {
		flex: 1;
		min-width: 160rpx;
		background: white;
		border: none;
		border-radius: 60rpx;
		padding: 24rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
		font-size: 28rpx;
		color: #333;
	}

	.btn-action[disabled] {
		opacity: 0.5;
	}

	.btn-icon {
		font-size: 32rpx;
		margin-right: 10rpx;
	}

	/* 历史记录 */
	.history-list {
		max-height: 800rpx;
		/* 拉高历史记录显示区域 */
	}

	.history-item {
		border-bottom: 1rpx solid #eee;
		padding: 25rpx 0;
	}

	.history-time {
		margin-bottom: 15rpx;
	}

	.history-date {
		font-size: 26rpx;
		color: #333;
		font-weight: bold;
	}

	.history-data {
		display: flex;
		gap: 20rpx;
		margin-bottom: 15rpx;
	}

	.history-data-item {
		flex: 1;
		text-align: center;
	}

	.data-label {
		font-size: 22rpx;
		color: #999;
		display: block;
		margin-bottom: 8rpx;
	}

	.data-value {
		font-size: 32rpx;
		font-weight: bold;
		display: inline-block;
	}

	.mini-progress {
		width: 80%;
		margin: 10rpx auto 0;
		height: 6rpx;
		background: #e0e0e0;
		border-radius: 3rpx;
		overflow: hidden;
	}

	.mini-progress-fill {
		height: 100%;
		border-radius: 3rpx;
	}

	.history-tags {
		display: flex;
		gap: 15rpx;
		flex-wrap: wrap;
		justify-content: center;
	}

	.tag {
		font-size: 20rpx;
		padding: 6rpx 20rpx;
		border-radius: 30rpx;
		background: #f0f0f0;
	}

	.history-count {
		font-size: 26rpx;
		color: #999;
	}

	/* 等级颜色 */
	.level-excellent {
		background: #d4edda;
	}

	.level-excellent .result-level {
		color: #155724;
	}

	.level-good {
		background: #d4edda;
	}

	.level-good .result-level {
		color: #155724;
	}

	.level-normal {
		background: #d1ecf1;
	}

	.level-normal .result-level {
		color: #0c5460;
	}

	.level-moderate {
		background: #fff3cd;
	}

	.level-moderate .result-level {
		color: #856404;
	}

	.level-severe {
		background: #f8d7da;
	}

	.level-severe .result-level {
		color: #721c24;
	}

	.level-poor {
		background: #ffeaa7;
	}

	.level-poor .result-level {
		color: #d35400;
	}

	.level-critical {
		background: #f8d7da;
	}

	.level-critical .result-level {
		color: #721c24;
	}

	.tag-excellent {
		background: #d4edda;
		color: #155724;
	}

	.tag-good {
		background: #d4edda;
		color: #155724;
	}

	.tag-normal {
		background: #d1ecf1;
		color: #0c5460;
	}

	.tag-moderate {
		background: #fff3cd;
		color: #856404;
	}

	.tag-severe {
		background: #f8d7da;
		color: #721c24;
	}

	.tag-poor {
		background: #ffeaa7;
		color: #d35400;
	}

	.tag-critical {
		background: #f8d7da;
		color: #721c24;
	}

	/* 底部说明区域 */
	.footer-note {
		margin-top: 20rpx;
		padding: 25rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 25rpx;
		box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.disclaimer-icon {
		font-size: 32rpx;
		margin-right: 12rpx;
	}

	.disclaimer-text {
		font-size: 24rpx;
		color: #e67e22;
		font-weight: bold;
	}

	.score-guide {
		margin-top: 5rpx;
	}

	.guide-title {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 15rpx;
		text-align: center;
	}

	.guide-content {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.guide-item {
		display: flex;
		align-items: baseline;
		justify-content: center;
		flex-wrap: wrap;
	}

	.guide-label {
		font-size: 24rpx;
		font-weight: bold;
		color: #667eea;
		margin-right: 10rpx;
	}

	.guide-desc {
		font-size: 24rpx;
		color: #666;
	}

	/* 加载状态 */
	.load-more {
		text-align: center;
		padding: 30rpx;
	}

	.load-more-text {
		font-size: 24rpx;
		color: #999;
	}

	.load-end {
		color: #ccc;
	}

	/* 加载遮罩 */
	.loading-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.loading-content {
		background: white;
		border-radius: 30rpx;
		padding: 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.loading-spinner {
		width: 60rpx;
		height: 60rpx;
		border: 4rpx solid #f3f3f3;
		border-top: 4rpx solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 20rpx;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		font-size: 28rpx;
		color: #666;
	}
</style>