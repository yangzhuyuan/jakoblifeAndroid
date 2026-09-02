<template>
	<view class="sleep-page">
		<view class="sleep-header">
			<view class="sleep-header-left">
				<text class="sleep-title">{{ $t('睡眠摘要') }}</text>
				<text class="sleep-subtitle">{{ $t('基于最近一次记录的睡眠数据') }}</text>
			</view>
			<view class="sleep-date-badge">
				<uni-icons type="calendar" size="16" color="#3298F7"></uni-icons>
				<text class="sleep-date-text">{{ dateLabel }}</text>
			</view>
		</view>
		<view class="sleep-card main-card">
			<view class="main-top-row">
				<view class="sleep-hero-wrap">
					<image lazy-load src="/static/page_icon/shuimian_1.png" class="sleep-hero-img" mode="aspectFit" />
				</view>
				<view class="sleep-data-wrap">
					<text class="sleep-data-title">{{ mainTitle }}</text>
					<view class="sleep-stage-row">
						<text class="stage-label">{{ $t('浅睡') }}</text>
						<text class="stage-value">{{ displayLight }}</text>
					</view>
					<view class="stage-divider"></view>
					<view class="sleep-stage-row">
						<text class="stage-label">{{ $t('深睡') }}</text>
						<text class="stage-value">{{ displayDeep }}</text>
					</view>
					<view class="stage-divider"></view>
					<view class="sleep-stage-row">
						<text class="stage-label">{{ $t('快速眼动') }}</text>
						<text class="stage-value">{{ displayRem }}</text>
					</view>
				</view>
			</view>
			<view v-if="showEmptyStatus" class="main-status-section">
				<view class="main-divider"></view>
				<view class="main-status-row">
					<view class="status-icon-wrap">
						<image lazy-load src="/static/page_icon/shuimian_2.png" class="sleep-hero-img_2"
							mode="aspectFit" />
					</view>
					<text class="status-desc">{{ $t('请在睡眠期间佩戴设备并于早晨同步') }}</text>
				</view>
			</view>
		</view>
		<view class="sleep-card score-card">
			<view class="score-ring-box">
				<view class="score-ring-track"></view>
				<view v-if="hasScore" class="score-ring-fill" :style="scoreRingStyle"></view>
				<view class="score-ring-inner">
					<uni-icons type="star-filled" size="18" :color="scoreIconColor"></uni-icons>
				</view>
			</view>
			<view class="score-info">
				<text class="score-label">{{ $t('睡眠评分') }}</text>
				<view class="score-value-row">
					<text class="score-value" :class="scoreColorClass">{{ displayScore }}</text>
					<text class="score-max">/ 100</text>
				</view>
				<text class="score-desc">{{ $t('记录睡眠数据后将显示评分') }}</text>
			</view>
		</view>
		<view class="sleep-card med-card">
			<view class="med-icon-wrap">
				<image lazy-load src="/static/page_icon/shuimian_3.png" class="sleep-hero-img_3" mode="aspectFit" />
			</view>
			<view class="med-info">
				<text class="med-title">{{ $t('服药记录') }}</text>
				<text class="med-desc">{{ $t('可选信息有助于完善趋势分析') }}</text>
			</view>
			<switch @change="$emit('medication-change', $event)" class="med-switch" :checked="medication"
				color="#3298F7" />
		</view>
		<view class="sleep-card tip-card">
			<view class="tip-icon-wrap">
				<image lazy-load src="/static/page_icon/shuimian_5.png" class="sleep-hero-img_4" mode="aspectFit" />
			</view>
			<view class="tip-body">
				<template v-if="hasAnalysisTip">
					<text class="tip-title">{{ $t('睡眠血压交叉分析') }}</text>
					<view v-for="(line, idx) in sleepTip" :key="idx" class="tip-line">
						<text>{{ $t(line) }}</text>
					</view>
				</template>
				<template v-else-if="hasScore && !hasAnalysisTip">
					<text class="tip-title">{{ $t('睡眠良好') }}</text>
				</template>
				<template v-else>
					<text class="tip-title">{{ $t('睡眠建议') }}</text>
					<text class="tip-desc">{{ $t('为了获得更连贯的趋势请尽量每天在相近时间佩戴设备入睡') }}</text>
				</template>
			</view>
		</view>
		<view class="sleep-bottom-spacer"></view>
	</view>
</template>

<script>
	export default {
		name: 'SleepSwiperItem',
		props: {
			sleep: {
				type: String,
				default: '--/--'
			},
			sleep_time: {
				type: String,
				default: '--/--'
			},
			totalLight: {
				type: String,
				default: 'NA'
			},
			totalDeep: {
				type: String,
				default: 'NA'
			},
			totalRem: {
				type: String,
				default: 'NA'
			},
			sleep_point: {
				type: [String, Number],
				default: '--/--'
			},
			medication: {
				type: Boolean,
				default: false
			},
			sleepTip: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			hasValidSleep() {
				const raw = String(this.sleep || '').trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === '0H0M' || raw === '0h0m') {
					return false
				}
				return true
			},
			showEmptyStatus() {
				return !this.hasValidSleep
			},
			mainTitle() {
				return this.hasValidSleep ? this.displaySleep : this.$t('暂无睡眠数据')
			},
			displaySleep() {
				return this.formatSleepDisplay(this.sleep)
			},
			displayLight() {
				return this.formatStageValue(this.totalLight)
			},
			displayDeep() {
				return this.formatStageValue(this.totalDeep)
			},
			displayRem() {
				return this.formatStageValue(this.totalRem)
			},
			hasScore() {
				const raw = String(this.sleep_point == null ? '' : this.sleep_point).trim()
				return raw && raw !== '--/--' && raw !== '-/-' && !isNaN(parseInt(raw, 10))
			},
			scoreNum() {
				const n = parseInt(this.sleep_point, 10)
				return isNaN(n) ? 0 : n
			},
			displayScore() {
				return this.hasScore ? String(this.scoreNum) : '—'
			},
			scoreColorClass() {
				if (!this.hasScore) return ''
				if (this.scoreNum >= 80) return 'score-good'
				if (this.scoreNum >= 60) return 'score-warn'
				return 'score-bad'
			},
			scoreIconColor() {
				if (!this.hasScore) return '#c5ced8'
				if (this.scoreNum >= 80) return '#58BF78'
				if (this.scoreNum >= 60) return '#FFEC01'
				return '#F55A5A'
			},
			scoreRingStyle() {
				const p = this.hasScore ? Math.min(100, Math.max(0, this.scoreNum)) : 0
				const deg = p * 3.6
				const color = this.scoreNum >= 80 ? '#58BF78' : (this.scoreNum >= 60 ? '#FFEC01' : '#F55A5A')
				return {
					background: `conic-gradient(${color} 0deg, ${color} ${deg}deg, #e8ecf2 ${deg}deg, #e8ecf2 360deg)`
				}
			},
			hasAnalysisTip() {
				return this.hasScore && this.sleepTip && this.sleepTip.length && this.scoreNum < 85
			},
			dateLabel() {
				const raw = String(this.sleep_time || '').trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === '00/00') {
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
			formatStageValue(val) {
				const raw = String(val == null ? '' : val).trim()
				if (!raw || raw === 'NA' || raw === '--/--' || raw === '-/-') return '—'
				return raw
			},
			formatSleepDisplay(val) {
				const raw = String(val || '').trim()
				if (!raw || raw === '--/--') return '—'
				return raw
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
	.sleep-page {
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		padding: 16px 16px 0;
		min-height: 100%;
		box-sizing: border-box;
	}

	.sleep-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.sleep-header-left {
		flex: 1;
		padding-right: 12px;
	}

	.sleep-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.sleep-subtitle {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: #7a8699;
		line-height: 1.4;
	}

	.sleep-date-badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border-radius: 20px;
		padding: 8px 12px;
		flex-shrink: 0;
		box-shadow: 0 1px 4px rgba(50, 152, 247, 0.06);
	}

	.sleep-date-text {
		margin-left: 6px;
		font-size: 13px;
		font-weight: 600;
		color: #3298F7;
	}

	.sleep-card {
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
		align-items: flex-start;
	}

	.sleep-hero-wrap {
		width: 88px;
		height: 88px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.sleep-hero-img {
		width: 88px;
		height: 88px;
		border-radius: 50%;
	}

	.sleep-data-wrap {
		flex: 1;
		margin-left: 14px;
		min-width: 0;
	}

	.sleep-data-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
		margin-bottom: 10px;
	}

	.sleep-stage-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
	}

	.stage-label {
		font-size: 14px;
		color: #8a94a6;
	}

	.stage-value {
		font-size: 14px;
		font-weight: 600;
		color: #1a2b4a;
	}

	.stage-divider {
		height: 1px;
		background: #eef0f4;
	}

	.main-status-section {
		padding-top: 2px;
	}

	.main-divider {
		width: 100%;
		height: 1px;
		background: #e8ebf0;
		margin: 14px 0 12px;
	}

	.main-status-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.status-icon-wrap {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #eaf4ff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.sleep-hero-img_2 {
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}

	.status-desc {
		margin-left: 10px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.45;
		flex: 1;
	}

	.score-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px;
	}

	.score-ring-box {
		position: relative;
		width: 68px;
		height: 68px;
		flex-shrink: 0;
	}

	.score-ring-track {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 6px solid #e8ecf2;
		box-sizing: border-box;
	}

	.score-ring-fill {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		padding: 6px;
		box-sizing: border-box;
	}

	.score-ring-inner {
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

	.score-info {
		flex: 1;
		margin-left: 14px;
		min-width: 0;
	}

	.score-label {
		display: block;
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.score-value-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 4px;
	}

	.score-value {
		font-size: 28px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.1;
	}

	.score-good {
		color: #58BF78;
	}

	.score-warn {
		color: #FFEC01;
	}

	.score-bad {
		color: #F55A5A;
	}

	.score-max {
		margin-left: 4px;
		font-size: 16px;
		color: #8a94a6;
	}

	.score-desc {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.med-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px;
	}

	.med-icon-wrap {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.sleep-hero-img_3 {
		width: 42px;
		height: 42px;
		border-radius: 50%;
	}

	.med-info {
		flex: 1;
		margin-left: 12px;
		min-width: 0;
		padding-right: 8px;
	}

	.med-title {
		display: block;
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.med-desc {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.med-switch {
		transform: scale(0.82);
		flex-shrink: 0;
	}

	.tip-card {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #E6EFFA;
		padding: 16px;
		border: 0.5px skyblue solid;
	}

	.tip-icon-wrap {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.sleep-hero-img_4 {
		width: 42px;
		height: 42px;
		border-radius: 50%;
	}

	.tip-body {
		flex: 1;
		margin-left: 12px;
		min-width: 0;
	}

	.tip-title {
		display: block;
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.4;
	}

	.tip-desc {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: #4a6b8a;
		line-height: 1.45;
	}

	.tip-line {
		margin-top: 6px;
		font-size: 13px;
		color: #1a2b4a;
		line-height: 1.45;
		font-weight: 600;
	}

	.sleep-bottom-spacer {
		height: 160px;
	}
</style>