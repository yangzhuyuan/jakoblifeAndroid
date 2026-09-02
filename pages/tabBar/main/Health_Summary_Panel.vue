<template>
	<view class="hs-page" :class="{ 'is-embedded': embedded }">
		<view class="hs-header">
			<view class="hs-header-left">
				<text class="hs-title">{{ $t('健康摘要') }}</text>
				<text class="hs-subtitle">{{ $t('基于您近期的心脏健康测量数据和趋势') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
		</view>
		<view class="emotion-tip-card">
			<uni-icons type="info" size="18" color="#3298F7"></uni-icons>
			<text class="emotion-tip-text">{{ $t('血压计注意事项') }}</text>
		</view>
		<view class="hs-card status-card">
			<view class="status-main">
				<view class="status-check" :class="overall.tone">
					<text class="status-check-mark">✓</text>
				</view>
				<view class="status-body">
					<text class="status-label">{{ $t('总体状态') }}</text>
					<text class="status-value" :class="overall.tone">{{ overall.title }}</text>
					<text class="status-desc">{{ overall.desc }}</text>
				</view>
			</view>
			<text class="status-time">{{ $t('今日更新') }}</text>
		</view>
		<view class="metric-grid">
			<view class="metric-card" v-for="(m, i) in metrics" :key="i">
				<view class="metric-left" @click.stop="onMetricTap(m)">
					<image class="metric-icon-img" :src="m.icon" mode="aspectFit" />
					<text v-if="m.measurable" class="metric-measure">{{ $t('测量') }}</text>
				</view>
				<view class="metric-right">
					<text class="metric-name">{{ m.name }}</text>
					<text class="metric-value">{{ m.value }}</text>
					<text class="metric-unit" v-if="m.unit">{{ m.unit }}</text>
					<view class="metric-status" v-if="m.status">
						<view class="dot" :class="m.tone"></view>
						<text class="metric-status-text" :class="m.tone">{{ m.status }}</text>
						<view v-if="m.helpType" class="metric-help" @click.stop="onStatusHelpTap(m)">
							<uni-icons type="help" size="15"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="hs-card trends-card">
			<text class="trends-title">{{ $t('天趋势7') }}</text>
			<view class="trend-row" v-for="(t, i) in trends" :key="i" @click="onTrendTap(t)">
				<view class="trend-icon">
					<image class="trend-icon-img" :src="t.icon" mode="aspectFit" />
				</view>
				<text class="trend-name">{{ t.name }}</text>
				<view class="sparkline" :class="t.tone">
					<qiun-data-charts v-if="sparkShow" type="line" :canvas2d="false" :inScrollView="true"
						:animation="false" :ontouch="false" :ontap="false" :disableScroll="true" :optsWatch="false"
						:tooltipShow="false" :errorShow="false" :reshow="sparkReshow"
						:canvas-id="'hsSpark' + t.key + (embedded ? 'e' : 'p')" :opts="t.opts"
						:chartData="t.chartData" />
				</view>
				<text class="trend-status" :class="t.tone">{{ t.status }}</text>
			</view>
		</view>
		<view class="insight-card">
			<view class="insight-top">
				<view class="insight-avatar">
					<image mode="aspectFit" class="insight-avatar-text" src="/static/image/app_icon_all.jpg" />
				</view>
				<view class="insight-body">
					<text class="insight-title">{{ $t('AI健康趋势分析') }}</text>
					<text class="insight-text">{{ insightText }}</text>
				</view>
			</view>
			<button class="insight-btn" @click="onViewReport">{{ $t('查看详细报告') }} ›</button>
		</view>
		<text class="hs-footer">{{ $t('仅用于健康测量与趋势分析不用于诊断或治疗') }}</text>
	</view>
</template>

<script>
	import WeightConverter from '@/pages/api/unitls/weightConverter.js'

	export default {
		name: 'HealthSummaryPanel',
		props: {
			embedded: {
				type: Boolean,
				default: false
			},
			autoLoad: {
				type: Boolean,
				default: true
			},
			syncHighPressure: {
				type: [String, Number],
				default: ''
			},
			syncLowPressure: {
				type: [String, Number],
				default: ''
			},
			syncPulse: {
				type: [String, Number],
				default: ''
			},
			tabActive: {
				type: Boolean,
				default: true
			}
		},
		data() {
			const sparkBase = {
				padding: [10, 6, 4, 6],
				legend: {
					show: false
				},
				dataLabel: false,
				dataPointShape: true,
				enableScroll: false,
				xAxis: {
					disabled: true,
					disableGrid: true,
					axisLine: false,
					fontSize: 1
				},
				yAxis: {
					disabled: true,
					disableGrid: true,
					disableLine: true,
					data: [{
						min: 0,
						max: 200,
						axisLine: false
					}]
				},
				extra: {
					line: {
						type: 'straight',
						width: 2,
						activeType: 'hollow'
					}
				}
			};
			const sparkCats = ['', '', '', '', '', '', ''];
			const emptyWeek = [null, null, null, null, null, null, null];
			return {
				rangeIndex: 0,
				bloodUnitIndex: 0,
				heightUnitIndex: 0,
				spo2: '--',
				heightVal: '-',
				highPressure: '-',
				lowPressure: '-',
				pulse: '-',
				dayAvgHigh: null,
				dayAvgLow: null,
				dayAvgHr: null,
				weekAvgHigh: null,
				weekAvgLow: null,
				weekAvgHr: null,
				sparkShow: false,
				sparkReshow: true,
				sparkOptsBp: Object.assign({}, sparkBase, {
					color: ['#FC7F41', '#7AE545']
				}),
				sparkOptsByTone: {
					ok: Object.assign({}, sparkBase, {
						color: ['#007AFF'],
						yAxis: {
							disabled: true,
							disableGrid: true,
							disableLine: true,
							data: [{
								min: 40,
								max: 120,
								axisLine: false
							}]
						}
					}),
					warn: Object.assign({}, sparkBase, {
						color: ['#FF9500'],
						yAxis: {
							disabled: true,
							disableGrid: true,
							disableLine: true,
							data: [{
								min: 40,
								max: 120,
								axisLine: false
							}]
						}
					}),
					mute: Object.assign({}, sparkBase, {
						color: ['#C7C7CC'],
						yAxis: {
							disabled: true,
							disableGrid: true,
							disableLine: true,
							data: [{
								min: 40,
								max: 120,
								axisLine: false
							}]
						}
					})
				},
				sparkChartBp: {
					categories: sparkCats.slice(),
					series: [{
						name: '',
						data: emptyWeek.slice(),
						connectNulls: true
					}, {
						name: '',
						data: emptyWeek.slice(),
						connectNulls: true
					}]
				},
				sparkChartHr: {
					categories: sparkCats.slice(),
					series: [{
						name: '',
						data: emptyWeek.slice(),
						connectNulls: true
					}]
				}
			};
		},
		computed: {
			rangeLabel() {
				return this.rangeIndex === 0 ? this.$t('最近7天') : this.$t('最近30天');
			},
			bloodUnit() {
				return this.bloodUnitIndex === 0 ? 'mmHg' : 'kPa';
			},
			heightUnit() {
				return this.heightUnitIndex === 0 ? this.$t('英寸') : this.$t('厘米');
			},
			bpValue() {
				const s = this.highPressure;
				const d = this.lowPressure;
				if (!this.isValidMetric(s) || !this.isValidMetric(d)) return '--/--';
				if (this.bloodUnit === 'kPa') {
					return `${(Number(s) * 0.133).toFixed(1)}/${(Number(d) * 0.133).toFixed(1)}`;
				}
				return `${s}/${d}`;
			},
			hrValue() {
				if (!this.isValidMetric(this.pulse)) return '--';
				return String(this.pulse);
			},
			spo2Value() {
				if (!this.isValidMetric(this.spo2)) return '--';
				return String(this.spo2);
			},
			heightValue() {
				if (!this.isValidMetric(this.heightVal)) return '--';
				const val = this.heightUnitIndex === 0 ?
					WeightConverter.cmToInch(this.heightVal) : this.heightVal;
				if (val == null || val === '') return '--';
				return String(val);
			},
			bpStatus() {
				if (!this.isValidMetric(this.highPressure) || !this.isValidMetric(this.lowPressure)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				const highPressure = Number(this.highPressure);
				const lowPressure = Number(this.lowPressure);
				const pressureRanges = [{
						lowMin: 61,
						lowMax: 80,
						highMin: 91,
						highMax: 120,
						level: 0,
						name: this.$t('正常血压')
					},
					{
						lowMin: 81,
						lowMax: 90,
						highMin: 121,
						highMax: 140,
						level: 1,
						name: this.$t('正常高值')
					},
					{
						lowMin: 91,
						lowMax: 100,
						highMin: 141,
						highMax: 160,
						level: 2,
						name: this.$t('一级高血压')
					},
					{
						lowMin: 101,
						lowMax: 110,
						highMin: 161,
						highMax: 180,
						level: 3,
						name: this.$t('二级高血压')
					}
				];
				for (let i = 0; i < pressureRanges.length; i++) {
					const range = pressureRanges[i];
					if ((lowPressure >= range.lowMin && lowPressure <= range.lowMax) ||
						(highPressure >= range.highMin && highPressure <= range.highMax)) {
						return {
							text: range.name,
							tone: range.level === 0 ? 'ok' : 'warn'
						};
					}
				}
				return {
					text: this.$t('未知'),
					tone: 'mute'
				};
			},
			hrStatus() {
				if (!this.isValidMetric(this.pulse)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				const hr = Number(this.pulse);
				if (hr < 60) {
					return {
						text: this.$t('过慢'),
						tone: 'warn'
					};
				}
				if (hr > 100) {
					return {
						text: this.$t('过快'),
						tone: 'warn'
					};
				}
				return {
					text: this.$t('正常'),
					tone: 'ok'
				};
			},
			spo2Status() {
				if (!this.isValidMetric(this.spo2)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				const val = parseInt(this.spo2, 10);
				if (isNaN(val)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				if (val <= 95) {
					return {
						text: this.$t('偏低'),
						tone: 'warn'
					};
				}
				if (val < 98) {
					return {
						text: this.$t('正常'),
						tone: 'ok'
					};
				}
				return {
					text: this.$t('偏高'),
					tone: 'warn'
				};
			},
			metrics() {
				return [{
						name: this.$t('血压'),
						icon: '/static/icons/3.png',
						measurable: true,
						measureType: 1,
						helpType: 'bp',
						value: this.bpValue,
						unit: this.isValidMetric(this.highPressure) ? this.bloodUnit : this.bloodUnit,
						status: this.bpStatus.text,
						tone: this.bpStatus.tone
					},
					{
						name: this.$t('心率'),
						icon: '/static/icons/5.png',
						measurable: true,
						measureType: 0,
						value: this.hrValue,
						unit: this.isValidMetric(this.pulse) ? "BPM" : 'BPM',
						status: this.hrStatus.text,
						tone: this.hrStatus.tone
					},
					{
						name: this.$t('血氧'),
						icon: '/static/page_icon/10.png',
						measurable: true,
						measureType: 2,
						helpType: 'spo2',
						value: this.spo2Value,
						unit: this.isValidMetric(this.spo2) ? '%' : '%',
						status: this.spo2Status.text,
						tone: this.spo2Status.tone
					},
					{
						name: this.$t('身高'),
						icon: '/static/icons/2.png',
						measurable: false,
						value: this.heightValue,
						unit: this.isValidMetric(this.heightVal) ? this.heightUnit : '',
						status: '',
						tone: 'ok'
					}
				];
			},
			bpTrendStatus() {
				if (!this.isValidMetric(this.dayAvgHigh) || !this.isValidMetric(this.dayAvgLow) ||
					!this.isValidMetric(this.weekAvgHigh) || !this.isValidMetric(this.weekAvgLow)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				const deltaHigh = Math.abs(Number(this.dayAvgHigh) - Number(this.weekAvgHigh));
				const deltaLow = Math.abs(Number(this.dayAvgLow) - Number(this.weekAvgLow));
				const unstable = deltaHigh >= 14 && deltaLow >= 14;
				return {
					text: this.$t(unstable ? '不稳定' : '稳定'),
					tone: unstable ? 'warn' : 'ok'
				};
			},
			hrTrendStatus() {
				if (!this.isValidMetric(this.dayAvgHr) || !this.isValidMetric(this.weekAvgHr)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				const unstable = Math.abs(Number(this.dayAvgHr) - Number(this.weekAvgHr)) >= 11;
				return {
					text: this.$t(unstable ? '不稳定' : '稳定'),
					tone: unstable ? 'warn' : 'ok'
				};
			},
			trends() {
				const bp = this.bpTrendStatus;
				const hr = this.hrTrendStatus;
				return [{
						key: 'bp',
						name: this.$t('血压'),
						icon: '/static/icons/3.png',
						opts: this.sparkOptsBp,
						chartData: this.sparkChartBp,
						status: bp.text,
						tone: bp.tone
					},
					{
						key: 'hr',
						name: this.$t('心率'),
						icon: '/static/icons/5.png',
						opts: this.sparkOptsByTone[hr.tone],
						chartData: this.sparkChartHr,
						status: hr.text,
						tone: hr.tone
					}
				];
			},
			overall() {
				const bp = this.bpTrendStatus;
				const hr = this.hrTrendStatus;
				if (bp.tone === 'warn' || hr.tone === 'warn') {
					return {
						title: this.$t('需关注'),
						desc: this.$t('您近期部分测量数据与7天平均水平存在明显波动建议持续关注'),
						tone: 'warn'
					};
				}
				if (bp.tone === 'ok' || hr.tone === 'ok') {
					return {
						title: this.$t('趋势稳定'),
						desc: this.$t('您近期的测量数据总体保持在个人日常范围内'),
						tone: 'ok'
					};
				}
				return {
					title: this.$t('暂无数据'),
					desc: this.$t('暂无数据'),
					tone: 'mute'
				};
			},
			insightText() {
				const tone = this.overall.tone;
				if (tone === 'warn') {
					return this.$t('您的心血管测量数据较个人基线出现明显波动已检测到有意义的联合变化建议持续关注');
				}
				if (tone === 'ok') {
					return this.$t('您的心血管测量数据总体保持稳定与个人基线一致未发现有意义的联合变化');
				}
				return this.$t('暂无数据');
			}
		},
		mounted() {
			this.syncUnitSettings();
			uni.$on('UNIT_SETTINGS_CHANGED', this.syncUnitSettings);
			this.$nextTick(() => {
				if (this.autoLoad) this.refreshData();
				setTimeout(() => {
					if (!this.sparkShow) this.sparkShow = true;
				}, 280);
			});
		},
		watch: {
			syncHighPressure() {
				this.scheduleHomeSync();
			},
			syncLowPressure() {
				this.scheduleHomeSync();
			},
			syncPulse() {
				this.scheduleHomeSync();
			},
			tabActive(val) {
				if (val) {
					this.syncUnitSettings();
					this.nudgeSparkCharts();
				}
			}
		},
		beforeDestroy() {
			uni.$off('UNIT_SETTINGS_CHANGED', this.syncUnitSettings);
			if (this._syncTimer) {
				clearTimeout(this._syncTimer);
				this._syncTimer = null;
			}
			if (this._sparkNudge) {
				clearTimeout(this._sparkNudge);
				this._sparkNudge = null;
			}
			if (this._useridRetry) {
				clearTimeout(this._useridRetry);
				this._useridRetry = null;
			}
		},
		methods: {
			normalizeUnitIndex(val) {
				if (val === '' || val == null) return 0;
				return Number(val) === 1 ? 1 : 0;
			},
			syncUnitSettings() {
				this.bloodUnitIndex = this.normalizeUnitIndex(uni.getStorageSync('Blood'));
				this.heightUnitIndex = this.normalizeUnitIndex(uni.getStorageSync('danwei1'));
			},
			scheduleHomeSync() {
				if (this._syncTimer) return;
				this._syncTimer = setTimeout(() => {
					this._syncTimer = null;
					this.applyHomeSync();
				}, 400);
			},
			onMetricTap(m) {
				if (!m || !m.measurable || m.measureType == null) return;
				this.$emit('measure-link', m.measureType);
			},
			onStatusHelpTap(m) {
				if (!m || !m.helpType) return;
				if (m.helpType === 'bp') {
					this.$emit('xueya-tap');
					return;
				}
				if (m.helpType === 'spo2') {
					this.$emit('bmi-tap', m.name);
				}
			},
			refreshData() {
				if (!this.embedded) {
					uni.setNavigationBarTitle({
						title: this.$t('健康摘要')
					});
				}
				this.syncUnitSettings();
				this.applyLocalHomeCache();
				this.loadHomeMetrics();
				this.loadTrendStability();
				this.loadWeekTrendChart();
				const userid = uni.getStorageSync('userid');
				if (!userid) {
					this._useridTries = (this._useridTries || 0) + 1;
					if (this._useridTries < 6) {
						this._useridRetry = setTimeout(() => {
							this._useridRetry = null;
							this.loadTrendStability();
							this.loadWeekTrendChart();
						}, 400);
					}
				} else {
					this._useridTries = 0;
				}
			},
			localYmd() {
				const now = new Date();
				const y = now.getFullYear();
				const m = now.getMonth() + 1;
				const d = now.getDate();
				return y + '-' + (m >= 10 ? m : '0' + m) + '-' + (d >= 10 ? d : '0' + d);
			},
			shiftYmd(daysBack) {
				const d = new Date();
				d.setDate(d.getDate() - daysBack);
				const y = d.getFullYear();
				const m = d.getMonth() + 1;
				const day = d.getDate();
				return y + '-' + (m >= 10 ? m : '0' + m) + '-' + (day >= 10 ? day : '0' + day);
			},
			buildWeekDates() {
				const list = [];
				for (let i = 6; i >= 0; i--) {
					const dateStr = this.shiftYmd(i);
					const parts = dateStr.split('-');
					list.push({
						dateStr: dateStr,
						month: Number(parts[1]),
						day: Number(parts[2])
					});
				}
				return list;
			},
			timestampToDateStr(timestamp) {
				if (timestamp == null || timestamp === '') return '';
				const str = String(timestamp).trim();
				if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
					const parts = str.slice(0, 10).split('-');
					const y = parts[0];
					const m = Number(parts[1]);
					const d = Number(parts[2]);
					if (!y || !m || !d) return '';
					return y + '-' + (m >= 10 ? m : '0' + m) + '-' + (d >= 10 ? d : '0' + d);
				}
				let ts = parseInt(str, 10);
				if (!Number.isFinite(ts)) return '';
				if (ts < 10000000000) ts = ts * 1000;
				if (ts < 1000000000000) return '';
				const date = new Date(ts);
				if (isNaN(date.getTime()) || date.getFullYear() < 2000) return '';
				const y = date.getFullYear();
				const m = date.getMonth() + 1;
				const d = date.getDate();
				return y + '-' + (m >= 10 ? m : '0' + m) + '-' + (d >= 10 ? d : '0' + d);
			},
			nudgeSparkCharts() {
				if (this._sparkNudge) clearTimeout(this._sparkNudge);
				this._sparkNudge = setTimeout(() => {
					this._sparkNudge = null;
					this.sparkShow = false;
					this.sparkReshow = false;
					this.$nextTick(() => {
						this.sparkShow = true;
						this.sparkReshow = true;
					});
				}, 160);
			},
			hasSparkValues(data) {
				if (!data || !data.length) return false;
				for (let i = 0; i < data.length; i++) {
					if (this.isValidMetric(data[i])) return true;
				}
				return false;
			},
			applyBpWeekChart(dateList, bpMap) {
				if (!bpMap || !bpMap.size) return;
				const cats = dateList.map(function() {
					return '';
				});
				const highs = [];
				const lows = [];
				for (let i = 0; i < dateList.length; i++) {
					const dayData = bpMap.get(dateList[i].dateStr);
					highs.push(dayData && dayData.high != null ? dayData.high : null);
					lows.push(dayData && dayData.low != null ? dayData.low : null);
				}
				if (!this.hasSparkValues(highs) && !this.hasSparkValues(lows)) return;
				this.sparkChartBp = {
					categories: cats,
					series: [{
						name: '',
						data: highs,
						connectNulls: true
					}, {
						name: '',
						data: lows,
						connectNulls: true
					}]
				};
				this.nudgeSparkCharts();
			},
			fillHrSparkFromLogs(list) {
				const dateList = this.buildWeekDates();
				const hrMap = new Map();
				if (Array.isArray(list)) {
					for (let i = 0; i < list.length; i++) {
						const d = this.itemYmd(list[i]);
						const s = this.getLogSummary(list[i]);
						if (d && s && this.isValidMetric(s.heartrateAvg)) {
							hrMap.set(d, Number(s.heartrateAvg));
						}
					}
				}
				const data = [];
				for (let i = 0; i < dateList.length; i++) {
					data.push(hrMap.has(dateList[i].dateStr) ? hrMap.get(dateList[i].dateStr) : null);
				}
				this.sparkChartHr = {
					categories: dateList.map(function() {
						return '';
					}),
					series: [{
						name: '',
						data: data,
						connectNulls: true
					}]
				};
				this.nudgeSparkCharts();
			},
			fillBpSparkFromLogs(list) {
				if (this.hasSparkValues(this.sparkChartBp.series[0].data) || this.hasSparkValues(this.sparkChartBp
						.series[1].data)) {
					return;
				}
				const dateList = this.buildWeekDates();
				const bpMap = new Map();
				if (Array.isArray(list)) {
					for (let i = 0; i < list.length; i++) {
						const d = this.itemYmd(list[i]);
						const s = this.getLogSummary(list[i]);
						if (!d || !s) continue;
						bpMap.set(d, {
							high: this.isValidMetric(s.highPressureAvg) ? Number(s.highPressureAvg) : null,
							low: this.isValidMetric(s.lowPressureAvg) ? Number(s.lowPressureAvg) : null
						});
					}
				}
				this.applyBpWeekChart(dateList, bpMap);
			},
			toMetricNum(val) {
				if (val == null || val === '' || val === '-') return null;
				const n = parseFloat(val);
				return Number.isFinite(n) ? n : null;
			},
			parseTrendPoint(item) {
				if (item == null) return {
					dateStr: '',
					value: null
				};
				if (Array.isArray(item)) {
					let dateStr = this.timestampToDateStr(item[1]);
					let value = this.toMetricNum(item[0]);
					if (!dateStr && this.timestampToDateStr(item[0])) {
						dateStr = this.timestampToDateStr(item[0]);
						value = this.toMetricNum(item[1]);
					}
					return {
						dateStr,
						value
					};
				}
				const ts = item.time || item.timestamp || item.dateTime || item.date;
				const value = item.value != null ? item.value : (item.avg != null ? item.avg : item[0]);
				return {
					dateStr: this.timestampToDateStr(ts) || this.itemYmd(item),
					value: this.toMetricNum(value)
				};
			},
			loadWeekTrendChart() {
				const ymd = this.localYmd();
				const todayEnd = ymd + ' 23:59:59';
				const weekStart = this.shiftYmd(6) + ' 00:00:00';
				const userid = uni.getStorageSync('userid');
				if (!userid) return;
				const typesIndex = Number(uni.getStorageSync('types_index') || 0);
				const slaveSn = typesIndex == 1 ? '2' : '3';
				const dateList = this.buildWeekDates();
				const header = this.trendHeader();
				const postTrend = (sn) => {
					return this.$post(this.$url_APP_IP + this.$url_get_trend_data, {
						deviceSn: userid,
						timeLevel: 0,
						slaveList: [{
								slaveSn: sn,
								register: 'highPressure'
							},
							{
								slaveSn: sn,
								register: 'lowPressure'
							},
							{
								slaveSn: '0',
								register: 'weight'
							}
						],
						startTime: weekStart,
						endTime: todayEnd,
						aggregateType: 'average'
					}, header);
				};
				const parseBpMap = (res) => {
					const bpMap = new Map();
					let data = res && res.data;
					if (typeof data === 'string') {
						try {
							data = JSON.parse(data);
						} catch (e) {
							data = null;
						}
					}
					if (!res || res.code != 200 || !data) return bpMap;
					const put = (list, field) => {
						if (!Array.isArray(list)) return;
						list.forEach(item => {
							const pt = this.parseTrendPoint(item);
							if (!pt.dateStr) return;
							if (!bpMap.has(pt.dateStr)) {
								bpMap.set(pt.dateStr, {
									high: null,
									low: null
								});
							}
							if (pt.value != null) bpMap.get(pt.dateStr)[field] = pt.value;
						});
					};
					put(data.highPressure, 'high');
					put(data.lowPressure, 'low');
					return bpMap;
				};
				const hasBpSpark = () => {
					return this.hasSparkValues(this.sparkChartBp.series[0].data) || this.hasSparkValues(this
						.sparkChartBp.series[1].data);
				};
				postTrend(slaveSn).then(res => {
					this.applyBpWeekChart(dateList, parseBpMap(res));
					if (hasBpSpark()) return;
					const otherSn = slaveSn === '2' ? '3' : '2';
					return postTrend(otherSn).then(res2 => {
						this.applyBpWeekChart(dateList, parseBpMap(res2));
						if (!hasBpSpark()) this.fillBpSparkFromLogs(this._weekLogs);
					});
				}).catch(() => {
					this.fillBpSparkFromLogs(this._weekLogs);
				});
			},
			getLogObject(item) {
				if (!item) return null;
				let obj = item.object;
				if (typeof obj === 'string') {
					try {
						obj = JSON.parse(obj);
					} catch (e) {
						return null;
					}
				}
				return obj || null;
			},
			avgDetails(details, key) {
				if (!Array.isArray(details) || !details.length) return null;
				let sum = 0;
				let n = 0;
				for (let i = 0; i < details.length; i++) {
					const v = details[i] && details[i][key];
					if (this.isValidMetric(v)) {
						sum += Number(v);
						n++;
					}
				}
				return n ? (sum / n) : null;
			},
			getLogSummary(item) {
				const obj = this.getLogObject(item);
				if (!obj) return null;
				const summary = obj.summary || {};
				const details = obj.details || [];
				const high = this.isValidMetric(summary.highPressureAvg) ? summary.highPressureAvg : this.avgDetails(
					details, 'highPressure');
				const low = this.isValidMetric(summary.lowPressureAvg) ? summary.lowPressureAvg : this.avgDetails(
					details, 'lowPressure');
				const hr = this.isValidMetric(summary.heartrateAvg) ? summary.heartrateAvg : this.avgDetails(details,
					'heartrate');
				return {
					highPressureAvg: high,
					lowPressureAvg: low,
					heartrateAvg: hr
				};
			},
			meanSummaries(list, field) {
				if (!Array.isArray(list) || !list.length) return null;
				let sum = 0;
				let n = 0;
				for (let i = 0; i < list.length; i++) {
					const s = this.getLogSummary(list[i]);
					if (s && this.isValidMetric(s[field])) {
						sum += Number(s[field]);
						n++;
					}
				}
				return n ? (sum / n) : null;
			},
			itemYmd(item) {
				const dt = (item && (item.dateTime || item.date)) || '';
				return String(dt).slice(0, 10);
			},
			pickTodayItem(list, ymd) {
				if (!Array.isArray(list) || !list.length) return null;
				for (let i = 0; i < list.length; i++) {
					if (this.itemYmd(list[i]) === ymd) return list[i];
				}
				let latest = list[0];
				for (let i = 1; i < list.length; i++) {
					if (this.itemYmd(list[i]) > this.itemYmd(latest)) latest = list[i];
				}
				return latest;
			},
			applyDaySummary(summary) {
				if (!summary) return;
				if (this.isValidMetric(summary.highPressureAvg)) this.dayAvgHigh = summary.highPressureAvg;
				if (this.isValidMetric(summary.lowPressureAvg)) this.dayAvgLow = summary.lowPressureAvg;
				if (this.isValidMetric(summary.heartrateAvg)) this.dayAvgHr = summary.heartrateAvg;
			},
			applyDayFromHome() {
				if (!this.isValidMetric(this.dayAvgHigh) && this.isValidMetric(this.highPressure)) {
					this.dayAvgHigh = this.highPressure;
				}
				if (!this.isValidMetric(this.dayAvgLow) && this.isValidMetric(this.lowPressure)) {
					this.dayAvgLow = this.lowPressure;
				}
				if (!this.isValidMetric(this.dayAvgHr) && this.isValidMetric(this.pulse)) {
					this.dayAvgHr = this.pulse;
				}
			},
			applyWeekAvg(avg) {
				if (!avg) return false;
				let ok = false;
				if (this.isValidMetric(avg.highPressure)) {
					this.weekAvgHigh = avg.highPressure;
					ok = true;
				}
				if (this.isValidMetric(avg.lowPressure)) {
					this.weekAvgLow = avg.lowPressure;
					ok = true;
				}
				if (this.isValidMetric(avg.heartrate)) {
					this.weekAvgHr = avg.heartrate;
					ok = true;
				}
				return ok;
			},
			trendHeader() {
				return {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				};
			},
			fetchWeekMinmax(userid, slaveSn, weekStart, todayEnd, header) {
				this.$post(this.$url_APP_IP + this.$url_query_minmax, {
					deviceSn: userid,
					dataType: 'min',
					slaveList: [{
							slaveSn: slaveSn,
							register: 'highPressure'
						},
						{
							slaveSn: slaveSn,
							register: 'lowPressure'
						},
						{
							slaveSn: slaveSn,
							register: 'heartrate'
						}
					],
					startTime: weekStart,
					endTime: todayEnd
				}, header).then(res => {
					if (res && (res.code == 200) && res.data && res.data.avg && this.applyWeekAvg(res.data.avg)) {
						return;
					}
					const otherSn = slaveSn === '2' ? '3' : '2';
					if (otherSn === slaveSn) return;
					this.$post(this.$url_APP_IP + this.$url_query_minmax, {
						deviceSn: userid,
						dataType: 'min',
						slaveList: [{
							slaveSn: otherSn,
							register: 'highPressure'
						}],
						startTime: weekStart,
						endTime: todayEnd
					}, header).then(res2 => {
						if (res2 && res2.code == 200 && res2.data && res2.data.avg) {
							this.applyWeekAvg(res2.data.avg);
						}
					}).catch(() => {});
				}).catch(() => {});
			},
			loadTrendStability() {
				this.dayAvgHigh = null;
				this.dayAvgLow = null;
				this.dayAvgHr = null;
				this.weekAvgHigh = null;
				this.weekAvgLow = null;
				this.weekAvgHr = null;
				const ymd = this.localYmd();
				const todayEnd = ymd + ' 23:59:59';
				const weekStart = this.shiftYmd(6) + ' 00:00:00';
				const userid = uni.getStorageSync('userid');
				if (!userid) return;
				const typesIndex = Number(uni.getStorageSync('types_index') || 0);
				const slaveSn = typesIndex == 1 ? '2' : '3';
				const header = this.trendHeader();
				this.$post(this.$url_APP_IP + this.$url_query_log_v2, {
					deviceSn: [userid],
					dataType: 'pressure',
					slaveList: [{
							slaveSn: '0',
							register: 'highPressure'
						},
						{
							slaveSn: '0',
							register: 'lowPressure'
						},
						{
							slaveSn: '0',
							register: 'heartrate'
						}
					],
					startTime: weekStart,
					endTime: todayEnd
				}, header).then(res => {
					const list = res && (Array.isArray(res.data) ? res.data : (Array.isArray(res.rows) ? res.rows :
						[]));
					this._weekLogs = list || [];
					if (res && res.code == 200 && list.length) {
						this.applyDaySummary(this.getLogSummary(this.pickTodayItem(list, ymd)));
						this.fillHrSparkFromLogs(list);
						this.fillBpSparkFromLogs(list);
						if (!this.isValidMetric(this.weekAvgHigh)) {
							this.weekAvgHigh = this.meanSummaries(list, 'highPressureAvg');
						}
						if (!this.isValidMetric(this.weekAvgLow)) {
							this.weekAvgLow = this.meanSummaries(list, 'lowPressureAvg');
						}
						if (!this.isValidMetric(this.weekAvgHr)) {
							this.weekAvgHr = this.meanSummaries(list, 'heartrateAvg');
						}
					}
					this.applyDayFromHome();
					this.fetchWeekMinmax(userid, slaveSn, weekStart, todayEnd, header);
				}).catch(() => {
					this.applyDayFromHome();
					this.fetchWeekMinmax(userid, slaveSn, weekStart, todayEnd, header);
				});
			},
			isValidMetric(val) {
				if (val == null || val === '') return false;
				const s = String(val).trim();
				if (!s || s === '-' || s === '--' || s === '--/--' || s === '-/-' || s === 'NA') return false;
				const n = Number(s);
				if (Number.isFinite(n) && n >= 999999990) return false;
				return true;
			},
			isValidRegisterVal(val) {
				return val != null && val !== '' && val !== '-/-';
			},
			getLatestRegisterFromList(list, register) {
				if (!list || !list.length) return null;
				let best = null;
				for (let i = 0; i < list.length; i++) {
					const row = list[i];
					if (!row || row.register !== register) continue;
					if (!this.isValidRegisterVal(row.registerVal) && !(row.updateTime > 0)) continue;
					if (!best) {
						best = row;
						continue;
					}
					const tNew = Number(row.updateTime) || 0;
					const tOld = Number(best.updateTime) || 0;
					if (tNew > tOld) {
						best = row;
					} else if (tNew === tOld && this.isValidRegisterVal(row.registerVal) &&
						!this.isValidRegisterVal(best.registerVal)) {
						best = row;
					}
				}
				return best;
			},
			getLatestRegisterEntry(data1, data2, type) {
				const merged = [];
				if (data1 && data1.length) merged.push(...data1);
				if (data2 && data2.length) merged.push(...data2);
				const best = this.getLatestRegisterFromList(merged, type);
				if (!best) {
					return {
						value: '-/-',
						time: 0
					};
				}
				return {
					value: this.isValidRegisterVal(best.registerVal) ? best.registerVal : '-/-',
					time: Number(best.updateTime) || 0
				};
			},
			getLatestBloodPressurePair(data1, data2) {
				const pickSide = (sideData) => {
					const high = this.getLatestRegisterFromList(sideData, 'highPressure');
					const low = this.getLatestRegisterFromList(sideData, 'lowPressure');
					const time = Math.max(Number(high && high.updateTime) || 0, Number(low && low.updateTime) || 0);
					const hasVal = this.isValidRegisterVal(high && high.registerVal) ||
						this.isValidRegisterVal(low && low.registerVal);
					return {
						high: high && high.registerVal,
						low: low && low.registerVal,
						time,
						hasVal
					};
				};
				const a = pickSide(data1 || []);
				const b = pickSide(data2 || []);
				if (a.hasVal && b.hasVal) return a.time >= b.time ? a : b;
				if (a.hasVal) return a;
				if (b.hasVal) return b;
				return a.time >= b.time ? a : b;
			},
			applyLocalHomeCache() {
				const high = uni.getStorageSync('highPressure');
				const low = uni.getStorageSync('lowPressure');
				const pulse = uni.getStorageSync('pulse');
				const spo2 = uni.getStorageSync('xueyang');
				if (this.isValidMetric(high)) this.highPressure = high;
				if (this.isValidMetric(low)) this.lowPressure = low;
				if (this.isValidMetric(pulse)) this.pulse = pulse;
				if (this.isValidMetric(spo2)) this.spo2 = spo2;
				this.applyHomeSync();
			},
			applyHomeSync() {
				if (this.isValidMetric(this.syncHighPressure)) this.highPressure = this.syncHighPressure;
				if (this.isValidMetric(this.syncLowPressure)) this.lowPressure = this.syncLowPressure;
				if (this.isValidMetric(this.syncPulse)) this.pulse = this.syncPulse;
			},
			loadHomeMetrics() {
				this.$post(this.$url_APP_IP + this.$url_list_recipe, {
					userId: uni.getStorageSync('userid')
				}, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code != 200 || !Array.isArray(res.data)) return;
					const data = res.data;
					const sn2 = data.filter(item => item.slaveSn === '2');
					const sn3 = data.filter(item => item.slaveSn === '3');
					const latestBp = this.getLatestBloodPressurePair(sn2, sn3);
					const latestHr = this.getLatestRegisterEntry(sn2, sn3, 'heartrate');
					const latestO2 = this.getLatestRegisterEntry(sn2, sn3, 'oxygen');
					if (this.isValidRegisterVal(latestBp.high) && this.isValidRegisterVal(latestBp.low)) {
						this.highPressure = latestBp.high;
						this.lowPressure = latestBp.low;
					}
					if (this.isValidRegisterVal(latestHr.value)) {
						this.pulse = latestHr.value;
					}
					if (this.isValidRegisterVal(latestO2.value)) {
						this.spo2 = latestO2.value;
					} else if (this.isValidMetric(uni.getStorageSync('xueyang'))) {
						this.spo2 = uni.getStorageSync('xueyang');
					}
					const heightRow = this.getLatestRegisterFromList(data, 'height');
					if (heightRow && this.isValidRegisterVal(heightRow.registerVal)) {
						this.heightVal = heightRow.registerVal;
					}
					this.applyHomeSync();
				}).catch(() => {});
			},
			onRangeTap() {
				uni.showActionSheet({
					itemList: [this.$t('最近7天'), this.$t('最近30天')],
					success: (res) => {
						this.rangeIndex = res.tapIndex;
					}
				});
			},
			onTrendTap() {},
			onViewReport() {
				uni.navigateTo({
					url: '/pages/tabBar/main/report_all_type/report_all_type'
				});
			}
		}
	};
</script>

<style scoped>
	.hs-page {
		min-height: 100vh;
		background: #F8F9FB;
		padding: 32rpx 32rpx 56rpx;
		box-sizing: border-box;
	}

	.hs-page.is-embedded {
		min-height: auto;
		padding: 8rpx 24rpx 16rpx;
	}

	.hs-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 28rpx;
	}

	.emotion-tip-card {
		margin-top: 14px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #eaf4ff;
		border-radius: 14px;
		padding: 14px;
		margin-bottom: 20px;
		box-sizing: border-box;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.emotion-tip-text {
		flex: 1;
		margin-left: 8px;
		font-size: 12px;
		color: #5c677a;
		line-height: 1.5;
	}

	.hs-header-left {
		margin-top: 20px;
		flex: 1;
		padding-right: 20rpx;
	}

	.hs-title {
		font-size: 44rpx;
		font-weight: 700;
		color: #1A1C1E;
		display: block;
		margin-bottom: 10rpx;
		line-height: 1.25;
	}

	.hs-subtitle {
		font-size: 24rpx;
		color: #8E8E93;
		line-height: 1.45;
		display: block;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.hs-range {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #EBF5FF;
		border: 2rpx solid #007AFF;
		border-radius: 999rpx;
		padding: 10rpx 20rpx;
		flex-shrink: 0;
		margin-top: 4rpx;
	}

	.hs-range-icon {
		font-size: 22rpx;
		margin-right: 8rpx;
		color: #007AFF;
		line-height: 1;
	}

	.hs-range-text {
		font-size: 22rpx;
		color: #007AFF;
		font-weight: 600;
		line-height: 1;
	}

	.hs-range-arrow {
		font-size: 16rpx;
		color: #007AFF;
		margin-left: 8rpx;
		line-height: 1;
	}

	.hs-card {
		background: #FFFFFF;
		border-radius: 40rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		border: 1rpx solid rgba(16, 24, 40, 0.03);
	}

	.status-card {
		display: flex;
		flex-direction: column;
	}

	.status-main {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.status-check {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 10rpx solid #34C759;
		background: rgba(52, 199, 89, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 28rpx;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.status-check.warn {
		border-color: #FF9500;
		background: rgba(255, 149, 0, 0.08);
	}

	.status-check.mute {
		border-color: #C7C7CC;
		background: rgba(199, 199, 204, 0.16);
	}

	.status-check-mark {
		font-size: 56rpx;
		color: #34C759;
		font-weight: 700;
		line-height: 1;
	}

	.status-check.warn .status-check-mark {
		color: #FF9500;
	}

	.status-check.mute .status-check-mark {
		color: #C7C7CC;
	}

	.status-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.status-label {
		font-size: 24rpx;
		color: #8E8E93;
		margin-bottom: 8rpx;
	}

	.status-value {
		font-size: 40rpx;
		font-weight: 700;
		color: #34C759;
		margin-bottom: 10rpx;
		line-height: 1.2;
	}

	.status-value.warn {
		color: #FF9500;
	}

	.status-value.mute {
		color: #8E8E93;
	}

	.status-desc {
		font-size: 26rpx;
		color: #3A3A3C;
		line-height: 1.5;
	}

	.status-time {
		display: block;
		text-align: center;
		font-size: 22rpx;
		color: #AEAEB2;
		margin-top: 24rpx;
	}

	.metric-grid {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.metric-card {
		width: 48.4%;
		background: #FFFFFF;
		border-radius: 32rpx;
		padding: 20rpx;
		margin-bottom: 20px;
		box-sizing: border-box;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		border: 1rpx solid rgba(16, 24, 40, 0.03);
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.metric-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 88rpx;
		margin-right: 16rpx;
	}

	.metric-icon-img {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
	}

	.metric-measure {
		margin-top: 18rpx;
		font-size: 22rpx;
		line-height: 1.2;
		color: #3298F7;
		font-weight: 500;
		text-align: center;
	}

	.metric-right {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.metric-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #8E8E93;
		margin-bottom: 4rpx;
		line-height: 1.3;
		text-align: left;
	}

	.metric-value {
		font-size: 42rpx;
		font-weight: 700;
		color: #007AFF;
		line-height: 1.25;
		word-break: break-all;
		text-align: left;
	}

	.metric-unit {
		font-size: 26rpx;
		color: #8E8E93;
		margin-top: 2rpx;
		line-height: 1.2;
		text-align: left;
	}

	.metric-status {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-top: 8rpx;
	}

	.dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		margin-right: 8rpx;
		background: #34C759;
		flex-shrink: 0;
	}

	.dot.warn {
		background: #FF9500;
	}

	.dot.mute {
		background: #C7C7CC;
	}

	.metric-status-text {
		font-size: 24rpx;
		color: #8E8E93;
		line-height: 1.3;
	}

	.metric-status-text.warn {
		color: #FF9500;
	}

	.metric-status-text.mute {
		color: #AEAEB2;
	}

	.metric-help {
		margin-left: 4rpx;
		flex-shrink: 0;
	}

	.trends-card {
		padding-bottom: 20rpx;
	}

	.trends-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #1A1C1E;
		margin-bottom: 4rpx;
		display: block;
	}

	.trend-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #F2F2F7;
	}

	.trend-row:last-child {
		border-bottom: none;
		padding-bottom: 8rpx;
	}

	.trend-icon {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12rpx;
		flex-shrink: 0;
		overflow: hidden;
	}

	.trend-icon-img {
		width: 48rpx;
		height: 48rpx;
	}

	.trend-name {
		width: 60px;
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1C1E;
		flex-shrink: 0;
	}

	.sparkline {
		flex: 1;
		display: flex;
		height: 72rpx;
		min-width: 160rpx;
		overflow: hidden;
		pointer-events: none;
	}

	.trend-status {
		font-size: 22rpx;
		font-weight: 600;
		color: #34C759;
		flex-shrink: 0;
		margin-left: 8rpx;
		white-space: nowrap;
	}

	.trend-status.warn {
		color: #FF9500;
	}

	.trend-status.mute {
		color: #AEAEB2;
	}

	.insight-card {
		margin-top: 20px;
		background: #EBF5FF;
		border: 2rpx solid #D6EBFF;
		border-radius: 40rpx;
		padding: 28rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.insight-top {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		margin-bottom: 24rpx;
	}

	.insight-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: linear-gradient(160deg, #5AC8FA 0%, #007AFF 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.insight-avatar-text {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.insight-body {
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.insight-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #007AFF;
		margin-bottom: 10rpx;
		line-height: 1.3;
	}

	.insight-text {
		font-size: 26rpx;
		color: #3A3A3C;
		line-height: 1.55;
	}

	.insight-btn {
		background: #007AFF;
		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: 600;
		border-radius: 24rpx;
		height: 88rpx;
		line-height: 88rpx;
		border: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}

	.insight-btn::after {
		border: none;
	}

	.hs-footer {
		display: block;
		text-align: center;
		font-size: 22rpx;
		color: #AEAEB2;
		line-height: 1.6;
		padding: 0 32rpx;
	}
</style>