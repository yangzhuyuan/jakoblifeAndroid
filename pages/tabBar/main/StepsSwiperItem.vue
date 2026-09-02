<template>
	<view class="steps-page">
		<view class="steps-header">
			<view class="steps-header-left">
				<text class="steps-title">{{ $t('每日活动') }}</text>
				<text class="steps-subtitle">{{ $t('您近期的运动与步数趋势') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			<!-- <view class="steps-date-badge">
				<uni-icons type="calendar" size="16" color="#3298F7"></uni-icons>
				<text class="steps-date-text">{{ dateLabel }}</text>
			</view> -->
		</view>

		<view class="steps-card main-card">
			<view class="main-top-row">
				<view class="main-top-left">
					<view class="steps-icon-wrap">
						<image src="../../../static/icons/1.png" class="steps-icon-img" mode="aspectFit"></image>
					</view>
					<view class="steps-info">
						<text class="steps-label">{{ $t('步数') }}</text>
						<text class="steps-value">{{ displaySteps }}</text>
						<text class="steps-sub">{{ $t('今日') }}</text>
					</view>
				</view>
				<view class="col-divider"></view>
				<view class="main-top-right">
					<view class="progress-ring-box">
						<view class="progress-ring-track"></view>
						<view v-if="progressPercent > 0" class="progress-ring-fill" :style="ringGradientStyle"></view>
						<view class="progress-ring-inner">
							<text class="progress-percent">{{ progressPercent }}%</text>
						</view>
					</view>
					<view class="goal-info">
						<text class="goal-label">{{ $t('每天目标') }}</text>
						<text class="goal-value">{{ displayGoal }}</text>
						<text class="goal-sub">{{ $t('步') }}</text>
					</view>
				</view>
			</view>

			<view v-if="showEmptyStatus" class="main-status-section">
				<view class="main-divider"></view>
				<view class="main-status-row">
					<view class="status-icon-wrap">
						<image src="/static/page_icon/yundong_1.png" class="status-icon-img" mode="aspectFit"></image>
					</view>
					<view class="status-text-wrap">
						<text class="status-title">{{ $t('尚未记录步数') }}</text>
						<text class="status-desc">{{ $t('佩戴或同步设备后即可开始记录') }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="steps-card chart-card">
			<text class="chart-title">{{ $t('天步数7') }}</text>
			<view class="charts-box-2">
				<qiun-data-charts type="column" :opts="chartOpts" :chartData="displayChartData" />
				<view v-if="!hasChartData" class="chart-empty-overlay">
					<view class="chart-empty-box">
						<uni-icons type="bars" size="18" color="#3298F7"></uni-icons>
						<text class="chart-empty-text">{{ $t('数据不足暂时无法显示趋势') }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="goal-action-row">
			<button class="goal-set-btn" @click="openGoalPopup">
				<uni-icons type="flag-filled" size="18" color="#ffffff"></uni-icons>
				<text class="goal-set-text">{{ $t('设置每日目标') }}</text>
			</button>
			<button class="goal-sync-btn" @click="$emit('sync-steps')">
				<uni-icons type="refreshempty" size="18" color="#3298F7"></uni-icons>
				<text class="goal-sync-text">{{ $t('同步设备') }}</text>
			</button>
		</view>

		<uni-popup ref="goalPopup" :mask-click="false">
			<view class="goal-popup-panel">
				<view class="goal-popup-header">
					<text class="goal-popup-title">{{ $t('设置每日目标') }}</text>
					<text class="goal-popup-close" @click="closeGoalPopup">✖</text>
				</view>
				<view class="goal-popup-body">
					<view class="goal-popup-input-wrap">
						<input type="number" v-model="popupGoalInput" :placeholder="$t('请输入每日目标')"
							class="goal-popup-input" />
						<text class="goal-popup-unit">{{ $t('步') }}</text>
					</view>
				</view>
				<button class="goal-popup-confirm" @click="confirmDailyGoal">{{ $t('确认') }}</button>
			</view>
		</uni-popup>

		<view v-if="stepsNum > 0 && goalNum > 0 && stepsNum >= goalNum" class="tip-card tip-success">
			<view class="tip-avatar">
				<image mode="aspectFit" class="tip-avatar-img" src="/static/page_icon/yundong_2.png" />
			</view>
			<view class="tip-body">
				<text class="tip-title">{{ $t('今天达标了明天在加油') }}</text>
				<uni-icons class="tip-icon" type="hand-up-filled" size="22" color="#3298F7"></uni-icons>
			</view>
		</view>
		<view v-else-if="stepsNum > 0 && stepsNum < 5000 && xueya !== 0" class="tip-card tip-warn">
			<view class="tip-avatar">
				<image mode="aspectFit" class="tip-avatar-img" src="/static/page_icon/yundong_2.png" />
			</view>
			<view class="tip-body">
				<text class="tip-title warn-text">{{ $t('你的血压有点高') }}</text>
				<uni-icons class="tip-icon" type="fire-filled" size="22" color="#E53935"></uni-icons>
			</view>
		</view>
		<view v-else-if="stepsNum > 0 && goalNum > 0 && stepsNum < goalNum" class="tip-card tip-info">
			<view class="tip-avatar">
				<image mode="aspectFit" class="tip-avatar-img" src="/static/page_icon/yundong_2.png" />
			</view>
			<view class="tip-body">
				<text class="tip-title">{{ $t('今天没达标明天要多运动') }}</text>
			</view>
		</view>
		<view v-else class="tip-card">
			<view class="tip-avatar">
				<image mode="aspectFit" class="tip-avatar-img" src="/static/image/app_icon_all.jpg" />
			</view>
			<view class="tip-body tip-body-column">
				<text class="tip-title">{{ $t('每一步都很重要') }}</text>
				<text class="tip-desc">{{ $t('准备好后可以从短距离步行开始') }}</text>
			</view>
		</view>

		<view class="steps-bottom-spacer"></view>
	</view>
</template>

<script>
	export default {
		name: 'StepsSwiperItem',
		props: {
			bushu: {
				type: [String, Number],
				default: '--/--'
			},
			bushu_time: {
				type: String,
				default: '--/--'
			},
			today_Daily_Goal: {
				type: [String, Number],
				default: '0'
			},
			dailyGoal: {
				type: [String, Number],
				default: ''
			},
			chartData: {
				type: Object,
				default: () => ({
					categories: [0],
					series: [{
						name: '',
						data: [0]
					}]
				})
			},
			opts: {
				type: Object,
				default: () => ({})
			},
			xueya: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				popupGoalInput: ''
			}
		},
		computed: {
			dailyGoalModel: {
				get() {
					return this.dailyGoal
				},
				set(val) {
					this.$emit('update:dailyGoal', val)
				}
			},
			stepsNum() {
				const todayKey = this.localTodayMd()
				const cats = (this.displayChartData.categories || [])
				const vals = (this.displayChartData.series[0] && this.displayChartData.series[0].data) || []
				const idx = cats.indexOf(todayKey)
				if (idx >= 0) {
					const n = Number(vals[idx])
					if (Number.isFinite(n) && n > 0) return n
				}
				if (!this.isTodaySteps) return 0
				const n = this.parseStepsVal(this.bushu)
				return n == null ? 0 : n
			},
			goalNum() {
				const n = parseInt(this.today_Daily_Goal, 10)
				return isNaN(n) || n <= 0 ? 0 : n
			},
			isTodaySteps() {
				const md = this.normalizeMdKey(this.bushu_time)
				if (!md) return false
				return md === this.localTodayMd()
			},
			hasValidSteps() {
				return this.stepsNum > 0
			},
			showEmptyStatus() {
				return !this.hasValidSteps
			},
			displaySteps() {
				return this.hasValidSteps ? this.formatNumber(this.stepsNum) : '0'
			},
			displayGoal() {
				if (!this.goalNum) return this.today_Daily_Goal
				return this.formatNumber(this.goalNum)
			},
			progressPercent() {
				if (!this.goalNum) return 0
				return Math.min(100, Math.round((this.stepsNum / this.goalNum) * 100))
			},
			ringGradientStyle() {
				const p = Math.min(100, Math.max(0, this.progressPercent))
				const deg = p * 3.6
				return {
					background: `conic-gradient(#3298F7 0deg, #3298F7 ${deg}deg, #e8ecf2 ${deg}deg, #e8ecf2 360deg)`
				}
			},
			displayChartData() {
				const source = {}
				const cats = (this.chartData && this.chartData.categories) || []
				const series = (this.chartData && this.chartData.series) || []
				const vals = (series[0] && series[0].data) || []
				cats.forEach((c, i) => {
					const key = this.normalizeMdKey(c)
					if (!key) return
					const n = Number(vals[i])
					source[key] = Number.isFinite(n) && n >= 0 ? n : 0
				})
				const todayKey = this.localTodayMd()
				const apiKey = this.normalizeMdKey(this.bushu_time)
				const apiVal = this.parseStepsVal(this.bushu)
				if (apiKey === todayKey && apiVal != null) {
					const prev = Number(source[todayKey])
					if (!Number.isFinite(prev) || prev <= 0) {
						source[todayKey] = apiVal
					}
				}
				const now = new Date()
				const categories = []
				const data = []
				for (let i = 6; i >= 0; i--) {
					const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
					const key = this.formatMd(d.getMonth() + 1, d.getDate())
					categories.push(key)
					data.push(Number(source[key]) || 0)
				}
				if (!categories.length) {
					categories.push(todayKey)
					data.push(Number(source[todayKey]) || 0)
				}
				return {
					categories,
					series: [{
						legendShape: 'circle',
						name: (series[0] && series[0].name) || this.$t('步数'),
						data
					}]
				}
			},
			hasChartData() {
				const data = (this.displayChartData.series[0] && this.displayChartData.series[0].data) || []
				return data.some(item => Number(item) > 0)
			},
			chartOpts() {
				const base = this.opts || {}
				const extra = base.extra || {}
				const column = extra.column || {}
				const count = Math.max((this.displayChartData.categories || []).length, 2)
				return Object.assign({}, base, {
					padding: [20, 15, 20, 5],
					dataLabel: true,
					legend: Object.assign({
						show: true,
						position: 'bottom',
						float: 'center'
					}, base.legend || {}),
					xAxis: Object.assign({}, base.xAxis || {}, {
						disableGrid: true,
						fontSize: 11,
						itemCount: count,
						marginTop: 8
					}),
					extra: Object.assign({}, extra, {
						column: Object.assign({}, column, {
							type: 'group',
							width: count > 4 ? 22 : 30
						})
					})
				})
			},
			dateLabel() {
				const raw = String(this.bushu_time || '').trim()
				if (!raw || raw === '--/--' || raw === '-/-') {
					return this.formatDateFromParts(new Date())
				}
				const parts = raw.split(/[\/\-.]/)
				if (parts.length >= 2) {
					const month = parseInt(parts[0], 10)
					const day = parseInt(parts[1], 10)
					if (!isNaN(month) && !isNaN(day)) {
						return this.formatDateLabel(month, day)
					}
				}
				return raw
			}
		},
		methods: {
			parseStepsVal(val) {
				const raw = String(val == null ? '' : val).trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === '--') return null
				const n = parseInt(raw, 10)
				return Number.isFinite(n) && n >= 0 ? n : null
			},
			formatMd(month, day) {
				return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
			},
			localTodayMd() {
				const now = new Date()
				return this.formatMd(now.getMonth() + 1, now.getDate())
			},
			normalizeMdKey(raw) {
				const s = String(raw == null ? '' : raw).trim()
				if (!s || s === '--/--' || s === '-/-' || s === '--') return ''
				const iso = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/)
				if (iso) {
					const month = parseInt(iso[2], 10)
					const day = parseInt(iso[3], 10)
					if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
						return this.formatMd(month, day)
					}
				}
				const parts = s.split(/[\/\-.]/)
				if (parts.length < 2) return ''
				let month = parseInt(parts[0], 10)
				let day = parseInt(parts[1], 10)
				if (month > 12 && day >= 1 && day <= 12) {
					const tmp = month
					month = day
					day = tmp
				}
				if (!(month >= 1 && month <= 12 && day >= 1 && day <= 31)) return ''
				return this.formatMd(month, day)
			},
			openGoalPopup() {
				const goal = this.today_Daily_Goal
				this.popupGoalInput = goal && goal !== '--/--' ? String(goal) : ''
				this.$refs.goalPopup.open()
			},
			closeGoalPopup() {
				this.$refs.goalPopup.close()
			},
			confirmDailyGoal() {
				const val = String(this.popupGoalInput || '').trim()
				if (!val) {
					uni.showToast({
						title: this.$t('设置的目标值不能为空'),
						icon: 'none',
						duration: 1500
					})
					return
				}
				this.$emit('update:dailyGoal', val)
				this.$nextTick(() => {
					this.$emit('daily-goal-set')
					this.closeGoalPopup()
				})
			},
			formatNumber(num) {
				const n = Number(num)
				if (!Number.isFinite(n)) return String(num)
				return n.toLocaleString()
			},
			formatDateFromParts(date) {
				return this.formatDateLabel(date.getMonth() + 1, date.getDate())
			},
			formatDateLabel(month, day) {
				const locale = (this.$i18n && this.$i18n.locale) || uni.getLocale() || ''
				if (locale.indexOf('zh') === 0) {
					return `${month}${this.$t('月')}${day}${this.$t('日')}`
				}
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				return `${months[month - 1] || month} ${day}`
			}
		}
	}
</script>

<style scoped>
	.steps-page {
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		padding: 5px 16px 0;
		min-height: 100%;
		box-sizing: border-box;
	}

	.steps-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.steps-header-left {
		flex: 1;
		margin-top: 15px;
		padding-right: 12px;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.steps-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.steps-subtitle {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: #7a8699;
		line-height: 1.4;
	}

	.steps-date-badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border-radius: 20px;
		padding: 8px 12px;
		flex-shrink: 0;
		box-shadow: 0 1px 4px rgba(50, 152, 247, 0.06);
	}

	.steps-date-text {
		margin-left: 6px;
		font-size: 13px;
		font-weight: 600;
		color: #3298F7;
	}

	.steps-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		margin-bottom: 16px;
		overflow: hidden;
	}

	.main-card {
		padding: 16px 16px 14px;
	}

	.main-top-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.main-top-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex: 0.88;
		min-width: 0;
		padding-right: 4px;
	}

	.main-top-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex: 1.12;
		min-width: 0;
		padding-left: 14px;
	}

	.col-divider {
		width: 1px;
		align-self: stretch;
		min-height: 58px;
		background: #e8ebf0;
		flex-shrink: 0;
		margin-left: -6px;
	}

	.steps-icon-wrap {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.steps-icon-img {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		object-fit: contain;
	}

	.steps-info {
		margin-left: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	.steps-label {
		font-size: 13px;
		font-weight: 600;
		color: #1a2b4a;
		line-height: 1.2;
	}

	.steps-value {
		margin-top: 2px;
		font-size: 26px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.1;
	}

	.steps-sub {
		margin-top: 2px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.2;
	}

	.progress-ring-box {
		position: relative;
		width: 68px;
		height: 68px;
		flex-shrink: 0;
	}

	.progress-ring-track {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 6px solid #e8ecf2;
		box-sizing: border-box;
	}

	.progress-ring-fill {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		padding: 6px;
		box-sizing: border-box;
	}

	.progress-ring-inner {
		position: absolute;
		top: 6px;
		left: 6px;
		right: 6px;
		bottom: 6px;
		border-radius: 50%;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.progress-percent {
		font-size: 14px;
		font-weight: 700;
		color: #3298F7;
		line-height: 1;
	}

	.goal-info {
		margin-left: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
		flex: 1;
	}

	.goal-label {
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.2;
	}

	.goal-value {
		margin-top: 2px;
		font-size: 24px;
		font-weight: 700;
		color: #3298F7;
		line-height: 1.1;
	}

	.goal-sub {
		margin-top: 2px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.2;
	}

	.main-status-section {
		padding-top: 2px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.main-divider {
		width: 100%;
		height: 1px;
		background: #e8ebf0;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.main-status-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}

	.status-icon-wrap {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: #eaf4ff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.status-icon-img {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		object-fit: contain;
	}

	.status-text-wrap {
		flex: none;
		margin-left: 12px;
	}

	.status-title {
		display: block;
		font-size: 14px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.4;
	}

	.status-desc {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.45;
	}

	.chart-card {
		padding: 16px 12px 12px;
	}

	.chart-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		padding: 0 4px 8px;
	}

	.charts-box-2 {
		position: relative;
		height: 220px;
	}

	.chart-empty-overlay {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.chart-empty-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #eaf4ff;
		border-radius: 12px;
		padding: 10px 14px;
		margin-bottom: 40px;
		max-width: 88%;
	}

	.chart-empty-text {
		margin-left: 8px;
		font-size: 12px;
		color: #3298F7;
		line-height: 1.4;
	}

	.goal-action-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;
		gap: 10px;
	}

	.goal-set-btn {
		flex: 1;
		height: 48px;
		margin: 0;
		padding: 0 12px;
		background: #3298F7;
		border-radius: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border: none;
		line-height: 48px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.goal-set-btn::after {
		border: none;
	}

	.goal-set-text {
		margin-left: 6px;
		font-size: 14px;
		font-weight: 600;
		color: #ffffff;
		white-space: nowrap;
	}

	.goal-sync-btn {
		flex: 1;
		height: 48px;
		margin: 0;
		padding: 0 12px;
		background: #ffffff;
		border: 1.5px solid #3298F7;
		border-radius: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		line-height: 48px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.goal-sync-btn::after {
		border: none;
	}

	.goal-sync-text {
		margin-left: 6px;
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
		white-space: nowrap;
	}

	.goal-popup-panel {
		width: 75vw;
		background: #ffffff;
		border-radius: 20px;
		overflow: hidden;
	}

	.goal-popup-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 20px 20px 0;
	}

	.goal-popup-title {
		font-size: 18px;
		font-weight: 700;
		color: #1a2b4a;
	}

	.goal-popup-close {
		font-size: 22px;
		color: #8a94a6;
		line-height: 1;
		padding: 4px;
	}

	.goal-popup-body {
		padding: 20px;
	}

	.goal-popup-input-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #f7f7f7;
		border-radius: 10px;
		padding: 15px;
	}

	.goal-popup-input {
		flex: 1;
		text-align: center;
		font-size: 16px;
		color: #1a2b4a;
	}

	.goal-popup-unit {
		margin-left: 8px;
		font-size: 14px;
		color: #8a94a6;
		flex-shrink: 0;
	}

	.goal-popup-confirm {
		margin: 0 50px 20px;
		border-radius: 30px;
		background: #3298F7;
		color: #ffffff;
		font-size: 16px;
		line-height: 44px;
	}

	.goal-popup-confirm::after {
		border: none;
	}

	.tip-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ACC7EA;
		border-radius: 16px;
		padding: 14px 16px;
		margin-bottom: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.tip-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
		background: #ffffff;
	}

	.tip-avatar-img {
		width: 48px;
		height: 48px;
	}

	.tip-body {
		flex: 1;
		margin-left: 12px;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.tip-title {
		font-size: 14px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.4;
	}

	.tip-icon {
		margin-left: 6px;
		flex-shrink: 0;
	}

	.tip-desc {
		display: block;
		width: 100%;
		margin-top: 4px;
		font-size: 12px;
		color: #7a8699;
		line-height: 1.4;
	}

	.warn-text {
		color: #E53935;
	}

	.tip-body-column {
		flex-direction: column;
		align-items: flex-start;
	}

	.steps-bottom-spacer {
		height: 160px;
	}
</style>