<template>
	<view class="weight-page">
		<view class="weight-header">
			<view class="weight-header-left">
				<text class="weight-title">{{ $t('体重摘要') }}</text>
				<text class="weight-subtitle">{{ $t('记录体重随时间的变化') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			<!-- <view class="weight-date-badge">
				<uni-icons type="calendar" size="16" color="#3298F7"></uni-icons>
				<text class="weight-date-text">{{ dateLabel }}</text>
			</view> -->
		</view>

		<view class="summary-row">
			<view class="weight-card current-card" @click="$emit('new-latest')">
				<view class="scale-icon-wrap">
					<image src="../../../static/icons/6.png" class="scale-icon" mode="aspectFit" />
				</view>
				<text class="card-label">{{ $t('当前体重') }}</text>
				<view class="current-value-row">
					<text class="current-value">{{ displayLatestWeight }}</text>
					<text class="current-unit">{{ newweightKG }}</text>
				</view>
				<view class="current-divider"></view>
				<text class="measured-text">{{ measuredLabel }}</text>
			</view>

			<view class="weight-card goals-card">
				<view class="goal-row" @click="$emit('initial')">
					<view class="scale-icon-wrap2">
						<image src="/static/page_icon/chushitizhong.png" class="scale-icon2" mode="aspectFit" />
					</view>
					<view class="goal-row-text">
						<text class="goal-label">{{ $t('初始体重') }}</text>
						<text class="goal-value">{{ displayInitialWeight }} {{ chuhsikg }}</text>
					</view>
				</view>
				<view class="goal-divider"></view>
				<view class="goal-row" @click="$emit('target')">
					<view class="scale-icon-wrap2">
						<image src="/static/page_icon/mubiao.png" class="scale-icon2" mode="aspectFit" />
					</view>
					<view class="goal-row-text">
						<text class="goal-label">{{ $t('目标体重') }}</text>
						<text class="goal-value">{{ displayTargetWeight }} {{ chuhsikg }}</text>
					</view>
				</view>
				<view class="goal-divider"></view>
				<view class="edit-goals-link" @click="$emit('target')">{{ $t('编辑目标') }}</view>
			</view>
		</view>
		<view class="info-banner">
			<uni-icons type="info-filled" size="18" color="#3298F7"></uni-icons>
			<text class="info-banner-text">{{ $t('体脂秤注意事项') }}</text>
		</view>
		<view class="section-card measure-card" @click="$emit('body-measure-click')">
			<view class="measure-card-header">
				<text class="measure-card-title">{{ $t('身体围度') }}</text>
				<text class="measure-unit">{{ $t('单位') }}</text>
			</view>
			<view class="measure-grid">
				<view class="measure-item">
					<text class="measure-label">{{ $t('胸围') }}</text>
					<text class="measure-value">{{ formatMeasure(Chest_circumference) }}</text>
				</view>
				<view class="measure-item">
					<text class="measure-label">{{ $t('腰围') }}</text>
					<text class="measure-value">{{ formatMeasure(waistline) }}</text>
				</view>
				<view class="measure-item">
					<text class="measure-label">{{ $t('臀围') }}</text>
					<text class="measure-value">{{ formatMeasure(Hip_circumference) }}</text>
				</view>
				<view class="measure-item">
					<text class="measure-label">{{ $t('上臂围') }}</text>
					<text class="measure-value">{{ formatMeasure(Upper_Chest_circumference) }}</text>
				</view>
				<view class="measure-item">
					<text class="measure-label">{{ $t('大腿围') }}</text>
					<text class="measure-value">{{ formatMeasure(Thigh_circumference) }}</text>
				</view>
				<view class="measure-item">
					<text class="measure-label">{{ $t('小腿围') }}</text>
					<text class="measure-value">{{ formatMeasure(Calf_circumference) }}</text>
				</view>
			</view>
			<view class="add-measure-btn" @click.stop="$emit('body-measure-click')">
				<text class="add-measure-text">+ {{ $t('添加围度数据') }}</text>
			</view>
		</view>
		<view class="section-card trend-card">
			<view class="trend-header">
				<uni-icons type="bars" size="18" color="#3298F7"></uni-icons>
				<text class="trend-title">{{ $t('体重趋势') }}</text>
			</view>
			<view class="trend-chart-wrap">
				<view v-if="hasTrendData" class="charts-box-trend">
					<qiun-data-charts type="line" :opts="trendOpts" :chartData="trendChartData" />
				</view>
				<view v-else-if="showTrendEmpty" class="trend-empty">
					<uni-icons type="bars" size="22" color="#3298F7"></uni-icons>
					<text class="trend-empty-text">{{ $t('需要更多测量数据才能显示趋势') }}</text>
				</view>
			</view>
		</view>
		<view style="background: #f4f7fb;">
			<view class="data_bg_A">
				<view class="tzkpsx" v-show="binaji2" @click="$emit('tiaozhen2')">{{ $t('编辑数据卡片') }}</view>
				<view class="drag-containersss">
					<basic-drag v-model="list2Model" :disabled="disabledsaaa2" itemKey="title" :column="2"
						itemHeight="130px" @update:disabled="$emit('update:disabled', $event)">
						<template #item="{element}">
							<view class="data_item_bgsss" :class="'animation2-' + animation2">
								<view class="icon_bgsss">
									<image :src="element.image" class="img_style" mode="aspectFit" />
									<text class="icon_text_bgsss">{{ element.title }}</text>
								</view>
								<view
									style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
									<view v-if="element.bmi_show">
										<view style="display: flex; flex-direction: row;align-items: center;">
											<text
												style="margin-left: 5px; color: black;font-size: 10px;white-space: nowrap;text-overflow: ellipsis;overflow: auto;width: 45px;text-align: right;">{{ element.BMI_ys }}</text>
											<uni-icons type="help" size="15"
												@tap="$emit('bmi-tap', element.title)"></uni-icons>
										</view>
									</view>
									<view
										style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end;">
										<view v-if="element.bmi_show">
											<view v-if="element.BMI_TF == 0">
												<view
													style="width: 10px; height:10px;background: #FCCD41;border-radius: 50px;">
												</view>
											</view>
											<view v-else-if="element.BMI_TF == 1"
												style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
												<view
													style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
												</view>
											</view>
											<view v-else-if="element.BMI_TF == 2"
												style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
												<view
													style="width: 10px; height:10px;background: #FC7F41;border-radius: 50px;">
												</view>
											</view>
											<view v-else-if="element.BMI_TF == 3"
												style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
												<view
													style="width: 10px; height:10px;background: #F55A5A;border-radius: 50px;">
												</view>
											</view>
											<view v-else-if="element.BMI_TF == 4"
												style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
												<view
													style="width: 10px; height:10px;background: #7A0101;border-radius: 50px;">
												</view>
											</view>
											<view v-else-if="element.BMI_TF == 10"
												style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
												<view
													style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
												</view>
											</view>
											<view v-else
												style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
												<view
													style="width: 10px; height:10px;background: #333333;border-radius: 50px;">
												</view>
											</view>
										</view>
										<text
											style="text-align: right;font-size: 16px;margin-left: 10px;">{{ element.Step_number }}</text>
									</view>
									<text
										style="text-align: right;color: gray;font-size: 10px;">{{ element.type_LX }}</text>
									<text style="text-align: right;font-size: 13px;">{{ element.Step_count }}</text>
								</view>
								<view v-show="delate_icon2" class="delete-button"
									@touchstart.stop.prevent="$emit('delete-card', element.title, element)">
									<image src="/static/icons/minus_filled.png" class="delete-icon" mode="aspectFit" />
								</view>
							</view>
						</template>
					</basic-drag>
				</view>
				<view v-show="button_show2" style="display: flex;flex-direction: column;">
					<view style="display: flex;justify-content: center;color: gray;">{{ $t('长按拖动可调整数据卡片位置') }}
					</view>
					<view
						style="display: flex;flex-direction: row;justify-content: space-between; align-items: center; margin-top: 20px;">
						<view @click="$emit('confirm-cards')" class="cardstyle_1">{{ $t('确认') }}</view>
						<view @tap.stop="$emit('add-card')" class="cardstyle_2">{{ $t('添加数据卡片') }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="weight-bottom-spacer"></view>
	</view>
</template>

<script>
	import BasicDrag from '@/components/basic-drag/index.vue';
	import WeightConverter from '../../api/unitls/weightConverter.js';

	export default {
		name: 'BodyFatSwiperItem',
		components: {
			BasicDrag
		},
		props: {
			tabActive: {
				type: Boolean,
				default: false
			},
			Latest_weight: {
				type: [String, Number],
				default: '--/--'
			},
			newweightKG: {
				type: String,
				default: ''
			},
			Latest_date: {
				type: String,
				default: '--/--'
			},
			Initial_weight: {
				type: [String, Number],
				default: '--/--'
			},
			chuhsikg: {
				type: String,
				default: ''
			},
			Target_weight: {
				type: [String, Number],
				default: '--/--'
			},
			list2: {
				type: Array,
				default: () => []
			},
			binaji2: {
				type: Boolean,
				default: true
			},
			disabledsaaa2: {
				type: Boolean,
				default: true
			},
			animation2: {
				type: String,
				default: ''
			},
			delate_icon2: {
				type: Boolean,
				default: false
			},
			button_show2: {
				type: Boolean,
				default: false
			},
			Chest_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			waistline: {
				type: [String, Number],
				default: '--/--'
			},
			Hip_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Upper_Chest_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Thigh_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Calf_circumference: {
				type: [String, Number],
				default: '--/--'
			}
		},
		data() {
			return {
				trendLoaded: false,
				trendRawData: null,
				initialWeightKg: null,
				targetWeightKg: null,
				latestWeightKgFallback: null,
				trendChartData: {
					categories: [],
					series: [{
						name: '',
						data: []
					}]
				},
				trendOpts: {
					color: ['#3298F7'],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						splitNumber: 4,
						data: [{
							min: 0,
							max: 100
						}]
					},
					extra: {
						line: {
							type: 'curve',
							width: 2,
							activeType: 'hollow'
						}
					}
				}
			}
		},
		watch: {
			tabActive(val) {
				if (val) {
					this.fetchTodayTrend()
				}
			},
			Latest_weight: {
				immediate: true,
				handler(val) {
					this.cacheWeightKgFromDisplay(val, 'latestWeightKgFallback', this.newweightKG)
					if (this.tabActive) {
						this.fetchTodayTrend()
					}
				}
			},
			Initial_weight: {
				immediate: true,
				handler(val) {
					this.cacheWeightKgFromDisplay(val, 'initialWeightKg', this.chuhsikg)
				}
			},
			Target_weight: {
				immediate: true,
				handler(val) {
					this.cacheWeightKgFromDisplay(val, 'targetWeightKg', this.chuhsikg)
				}
			},
			newweightKG() {
				if (this.trendRawData) {
					this.buildTrendChart(this.trendRawData)
				}
			}
		},
		mounted() {
			if (this.tabActive) {
				this.fetchTodayTrend()
			}
		},
		computed: {
			list2Model: {
				get() {
					return this.list2
				},
				set(val) {
					this.$emit('update:list2', val)
				}
			},
			dateLabel() {
				return this.formatDateLabel(this.Latest_date)
			},
			measuredLabel() {
				const date = this.formatDateLabel(this.Latest_date)
				const locale = (this.$i18n && this.$i18n.locale) || uni.getLocale() || ''
				if (locale.indexOf('zh') === 0) {
					return `${this.$t('测量于')}${date}`
				}
				return `${this.$t('测量于')} ${date}`
			},
			hasTrendData() {
				if (!this.trendLoaded) return false
				const series = (this.trendChartData && this.trendChartData.series) || []
				const data = (series[0] && series[0].data) || []
				return data.length > 0 && data.some(item => item != null && !Number.isNaN(Number(item)))
			},
			showTrendEmpty() {
				return this.trendLoaded && !this.hasTrendData
			},
			displayLatestWeight() {
				const kg = uni.getStorageSync('weightkg')
				if (this.isValidWeightNum(kg)) {
					return this.formatWeightFromKg(Number(kg), this.newweightKG)
				}
				if (this.isValidWeightNum(this.latestWeightKgFallback)) {
					return this.formatWeightFromKg(this.latestWeightKgFallback, this.newweightKG)
				}
				return this.Latest_weight
			},
			displayInitialWeight() {
				if (this.isValidWeightNum(this.initialWeightKg)) {
					return this.formatWeightFromKg(this.initialWeightKg, this.chuhsikg)
				}
				return this.Initial_weight
			},
			displayTargetWeight() {
				if (this.isValidWeightNum(this.targetWeightKg)) {
					return this.formatWeightFromKg(this.targetWeightKg, this.chuhsikg)
				}
				return this.Target_weight
			}
		},
		methods: {
			isValidWeightNum(val) {
				if (val == null || val === '') return false
				const raw = String(val).trim()
				if (!raw || raw === '-' || raw === '--' || raw === '--/--' || raw === '-/-' || raw === 'NA') {
					return false
				}
				return Number.isFinite(Number(raw))
			},
			isKgUnitLabel(unit) {
				const u = String(unit || '')
				return u === 'KG' || u === 'kg' || u === this.$t('千克') || u === this.$t('千克1')
			},
			formatWeightFromKg(kg, unit) {
				const value = Number(kg)
				if (!Number.isFinite(value)) return kg
				if (this.isKgUnitLabel(unit)) {
					return Number(value.toFixed(1))
				}
				return WeightConverter.kgToLb(value, 1)
			},
			cacheWeightKgFromDisplay(displayVal, field, unit) {
				if (!this.isValidWeightNum(displayVal)) return
				const n = Number(displayVal)
				this[field] = this.isKgUnitLabel(unit) ? n : WeightConverter.lbToKg(n, 2)
			},
			formatMeasure(val) {
				const raw = String(val == null ? '' : val).trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === 'NA') return '—'
				return raw
			},
			formatDateLabel(rawDate) {
				const raw = String(rawDate || '').trim()
				if (!raw || raw === '--/--' || raw === '-/-') {
					return this.formatDateFromParts(new Date())
				}
				const parts = raw.split(/[\/\-.]/)
				if (parts.length >= 2) {
					const month = parseInt(parts[0], 10)
					const day = parseInt(parts[1], 10)
					if (!isNaN(month) && !isNaN(day)) {
						const locale = (this.$i18n && this.$i18n.locale) || uni.getLocale() || ''
						if (locale.indexOf('zh') === 0) {
							return `${month}${this.$t('月')}${day}${this.$t('日')}`
						}
						const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
						return `${months[month - 1] || month} ${day}`
					}
				}
				return raw
			},
			formatDateFromParts(date) {
				const locale = (this.$i18n && this.$i18n.locale) || uni.getLocale() || ''
				const month = date.getMonth() + 1
				const day = date.getDate()
				if (locale.indexOf('zh') === 0) {
					return `${month}${this.$t('月')}${day}${this.$t('日')}`
				}
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				return `${months[month - 1] || month} ${day}`
			},
			getTodayRange() {
				const now = new Date()
				const year = now.getFullYear()
				const month = String(now.getMonth() + 1).padStart(2, '0')
				const day = String(now.getDate()).padStart(2, '0')
				const today = `${year}-${month}-${day}`
				return {
					start: `${today} 00:00:00`,
					end: `${today} 23:59:59`
				}
			},
			isKgUnit() {
				return this.isKgUnitLabel(this.newweightKG)
			},
			formatTrendWeight(kg) {
				const value = Number(kg)
				if (Number.isNaN(value)) return null
				if (this.isKgUnit()) {
					return Number(value.toFixed(1))
				}
				return WeightConverter.kgToLb(value, 1)
			},
			buildTrendChart(rawData) {
				const points = [];
				(rawData || []).forEach(item => {
					const details = (item.object && item.object.details) || []
					if (details.length) {
						details.forEach(detail => {
							const weightKg = detail.weight != null ? detail.weight : detail.weightAvg
							const displayWeight = this.formatTrendWeight(weightKg)
							if (displayWeight == null) return
							points.push({
								label: detail.time || '',
								timestamp: parseInt(detail.timestamp, 10) || 0,
								weight: displayWeight
							})
						})
					} else if (item.object && item.object.summary && item.object.summary.weightAvg != null) {
						const displayWeight = this.formatTrendWeight(item.object.summary.weightAvg)
						if (displayWeight != null) {
							points.push({
								label: item.dateTime || '',
								timestamp: 0,
								weight: displayWeight
							})
						}
					}
				})
				points.sort((a, b) => {
					if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp
					return 0
				})
				if (!points.length) {
					this.trendChartData = {
						categories: [],
						series: [{
							name: this.$t('体重'),
							data: []
						}]
					}
					return
				}
				const weights = points.map(item => item.weight)
				const minWeight = Math.min(...weights)
				const maxWeight = Math.max(...weights)
				const padding = Math.max(1, Math.round((maxWeight - minWeight) * 0.2) || 2)
				this.trendOpts = {
					...this.trendOpts,
					yAxis: {
						splitNumber: 4,
						data: [{
							min: Math.max(0, Math.floor(minWeight - padding)),
							max: Math.ceil(maxWeight + padding)
						}]
					}
				}
				this.trendChartData = {
					categories: points.map(item => item.label || '--'),
					series: [{
						name: this.$t('体重'),
						data: points.map(item => item.weight)
					}]
				}
			},
			async queryBodyFatData(deviceSn, startTime, endTime) {
				const data = {
					deviceSn,
					dataType: 'weight',
					slaveList: [{
						slaveSn: '0',
						register: 'weight'
					}],
					startTime,
					endTime
				}
				const res = await this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token')
				})
				if (res.code === 200) {
					return res.data || []
				}
				throw new Error(res.msg || '体脂数据查询失败')
			},
			async fetchTodayTrend() {
				const userId = uni.getStorageSync('userid')
				if (!userId) {
					this.trendLoaded = true
					this.buildTrendChart([])
					return
				}
				try {
					const {
						start,
						end
					} = this.getTodayRange()
					const rawData = await this.queryBodyFatData([userId], start, end)
					this.trendRawData = rawData
					this.buildTrendChart(rawData)
				} catch (error) {
					console.error('当天体重趋势查询失败:', error)
					this.buildTrendChart([])
				} finally {
					this.trendLoaded = true
				}
			}
		}
	}
</script>

<style scoped>
	.weight-page {
		background: #f4f7fb;
		padding: 5px 16px 0;
		min-height: 100%;
		box-sizing: border-box;
	}

	.weight-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.weight-header-left {
		flex: 1;
		margin-top: 15px;
		padding-right: 12px;
	}

	.weight-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.weight-subtitle {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: #7a8699;
		line-height: 1.4;
	}

	.weight-date-badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border-radius: 20px;
		padding: 8px 12px;
		flex-shrink: 0;
		box-shadow: 0 1px 4px rgba(50, 152, 247, 0.06);
	}

	.weight-date-text {
		margin-left: 6px;
		font-size: 13px;
		font-weight: 600;
		color: #3298F7;
	}

	.summary-row {
		display: flex;
		flex-direction: row;
		gap: 10px;
		margin-bottom: 16px;
	}

	.weight-card {
		flex: 1;
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		min-width: 0;
	}

	.current-card {
		padding: 14px 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.scale-icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.scale-icon {
		width: 44px;
		height: 44px;
		border-radius: 12px;
	}

	.scale-icon-wrap2 {
		width: 22px;
		height: 22px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.scale-icon2 {
		width: 22px;
		height: 22px;
		border-radius: 12px;
	}

	.card-label {
		margin-top: 10px;
		font-size: 13px;
		color: #8a94a6;
	}

	.current-value-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 6px;
	}

	.current-value {
		font-size: 34px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1;
	}

	.current-unit {
		margin-left: 6px;
		font-size: 14px;
		color: #8a94a6;
	}

	.current-divider {
		width: 100%;
		height: 1px;
		background: #eef0f4;
		margin-top: 10px;
	}

	.measured-text {
		margin-top: 10px;
		font-size: 11px;
		color: #8a94a6;
		text-align: center;
	}

	.goals-card {
		padding: 10px 12px 12px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.goal-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 8px 0;
	}

	.goal-row-text {
		margin-left: 8px;
		min-width: 0;
		text-align: center;
	}

	.goal-label {
		display: block;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.3;
		text-align: center;
	}

	.goal-value {
		display: block;
		margin-top: 2px;
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.2;
		text-align: center;
	}

	.goal-divider {
		height: 1px;
		background: #eef0f4;
	}

	.edit-goals-link {
		padding-top: 10px;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
	}

	.info-banner {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #E8F3FD;
		border-radius: 12px;
		padding: 12px 14px;
		border: 1px solid skyblue;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.info-banner-text {
		flex: 1;
		margin-left: 10px;
		font-size: 12px;
		color: #4a6b8a;
		line-height: 1.45;
	}

	.measure-btn {
		width: 100%;
		height: 48px;
		margin: 0 0 16px;
		padding: 0 16px;
		background: #3298F7;
		border-radius: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border: none;
		box-shadow: 0 4px 12px rgba(50, 152, 247, 0.22);
	}

	.measure-btn::after {
		border: none;
	}

	.measure-btn-icon {
		width: 20px;
		height: 20px;
	}

	.measure-btn-text {
		margin-left: 8px;
		font-size: 15px;
		font-weight: 600;
		color: #ffffff;
	}

	.section-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		margin-bottom: 16px;
		margin-top: 16px;
		overflow: hidden;
	}

	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		margin-top: 0;
		padding: 20px 0 40px 0;
	}

	.title_zs1 {
		display: flex;
		margin-right: 20px;
		margin-left: 20px;
		margin-bottom: 20px;
		color: black;
		font-weight: 600;
		font-size: 12px;
	}

	.tzkpsx {
		height: 38px;
		width: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		margin: 0 20px 20px 20px;
		padding: 10px;
		font-size: 13px;
		font-weight: 400;
		border-radius: 10px;
		color: #3298F7;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.drag-containersss {
		display: flex;
		justify-content: center;
		padding-left: 20px;
	}

	.data_item_bgsss {
		height: 90px;
		line-height: 20px;
		width: 36vw;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: space-between;
		align-items: center;
		border-radius: 20px;
		padding: 10px;
		margin-left: 2px;
		margin-top: 2px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
	}

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.animation2-shake {
		animation: shake 1s infinite;
	}

	@keyframes shake {
		0% {
			transform: translateX(0) rotate(-2deg)
		}

		50% {
			transform: translateX(5px) rotate(2deg)
		}

		100% {
			transform: translateX(0) rotate(-2deg)
		}
	}

	.delete-button {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.01);
		z-index: 10;
	}

	.delete-icon {
		width: 25px;
		height: 25px;
		pointer-events: none;
	}

	.cardstyle_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-right: 10px;
		margin-left: 10vw;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.cardstyle_2 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-left: 10px;
		margin-right: 10vw;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.measure-card {
		padding: 16px;
	}

	.measure-card-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.measure-card-title {
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
	}

	.measure-unit {
		font-size: 13px;
		color: #8a94a6;
	}

	.measure-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.measure-item {
		width: 16%;
		min-width: 48px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 12px;
	}

	.measure-label {
		font-size: 11px;
		color: #8a94a6;
		text-align: center;
		line-height: 1.3;
	}

	.measure-value {
		margin-top: 8px;
		width: 100%;
		min-height: 34px;
		background: #f4f7fb;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: 600;
		color: #1a2b4a;
	}

	.add-measure-btn {
		margin-top: 4px;
		height: 44px;
		border: 1.5px solid #3298F7;
		border-radius: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-measure-text {
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
	}

	.trend-chart-wrap {
		min-height: 200px;
	}

	.charts-box-trend {
		width: 100%;
		height: 200px;
	}

	.trend-card {
		padding: 16px;
	}

	.trend-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 12px;
	}

	.trend-title {
		margin-left: 8px;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
	}

	.trend-empty {
		border: 1px dashed #d8dee8;
		border-radius: 12px;
		padding: 24px 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.trend-empty-text {
		margin-top: 10px;
		font-size: 12px;
		color: #3298F7;
		text-align: center;
		line-height: 1.45;
	}

	.weight-bottom-spacer {
		height: 180px;
	}

	.current-divider {
		margin: 12px 0 8px;
		height: 1px;
		background: #eef1f6;
	}
</style>