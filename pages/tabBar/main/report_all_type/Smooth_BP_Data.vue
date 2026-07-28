<template>
	<view class="page">
		<view class="filter-tabs">
			<text :class="['tab', currentTab === 'all' ? 'active' : '']" @click="switchTab('all')">
				{{$t('全部')}}({{dataList.length}})
			</text>
			<text :class="['tab', currentTab === 'day' ? 'active' : '']" @click="switchTab('day')">
				{{$t('白天')}}({{dayCount}})
			</text>
			<text :class="['tab', currentTab === 'night' ? 'active' : '']" @click="switchTab('night')">
				{{$t('夜间')}}({{nightCount}})
			</text>
		</view>

		<view class="table-tip">{{dataTipText}}</view>
		<view v-show="modeltips" class="model-tip">{{$t('您的无感血压AI模型正在建立中大概需要2周时间')}}</view>
		<view class="table-header">
			<text class="col-time">{{$t('测量时间')}}</text>
			<text class="col-period">{{$t('时段')}}</text>
			<text class="col-value">{{$t('收缩压')}}</text>
			<text class="col-value">{{$t('舒张压')}}</text>
			<text class="col-value">{{$t('心率')}}</text>
			<text class="col-status">{{$t('状态')}}</text>
		</view>

		<scroll-view scroll-y class="list-scroll">
			<view v-if="loading" class="empty-tip">{{$t('加载中')}}</view>
			<view v-else-if="filteredList.length === 0" class="empty-tip">{{$t('暂无数据')}}</view>
			<view v-for="(item, index) in filteredList" :key="index"
				:class="['table-row', item.period === 'night' ? 'night-row' : '']">
				<view class="col-time">
					<text class="time-date">{{item.datePart}}</text>
					<text class="time-clock">{{item.clockPart}}</text>
				</view>
				<text class="col-period">
					<text :class="['period-tag', item.period]">{{item.periodText}}</text>
				</text>
				<text class="col-value">{{item.systolic}}</text>
				<text class="col-value">{{item.diastolic}}</text>
				<text class="col-value">{{item.heartRate}}</text>
				<text class="col-status">
					<text :class="['status-tag', item.status]">{{item.statusText}}</text>
				</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getChinaTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'
	export default {
		data() {
			return {
				loading: false,
				dataList: [],
				currentTab: 'all',
				bloodUnit: uni.getStorageSync('Blood') === 0 || uni.getStorageSync('Blood') === '' ? 'mmHg' : 'kPa',
				pacitime: '',
				filterVarList: "JLvFLGvJL01v1W",
				period: "1W",
				modeltips: true,
			}
		},
		computed: {
			filteredList() {
				if (this.currentTab === 'all') return this.dataList
				return this.dataList.filter(item => item.period === this.currentTab)
			},
			dayCount() {
				return this.dataList.filter(item => item.period === 'day').length
			},
			nightCount() {
				return this.dataList.filter(item => item.period === 'night').length
			},
			// 提示日期取手机本地「昨天」
			dataTipText() {
				const yesterday = new Date()
				yesterday.setDate(yesterday.getDate() - 1)
				const month = yesterday.getMonth() + 1
				const day = yesterday.getDate()
				const isZh = (this.$i18n && this.$i18n.locale || '').indexOf('zh') === 0
				const dateStr = isZh ?
					`${month}月${day}日` :
					`${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][yesterday.getMonth()]} ${day}`
				return this.$t('当天数据云端计算中需明天查询', {
					date: dateStr
				})
			}
		},
		onShow() {
			const modeltipsbool = uni.getStorageSync("temperature")
			console.log("modeltipsbool", modeltipsbool)
			uni.setNavigationBarTitle({
				title: this.$t('无感血压报告')
			})
			this.calculateTimeRange()
			this.get_retVarList()
			if (modeltipsbool && modeltipsbool !== '-/-' && Number(modeltipsbool) >= 500) this.modeltips = false
		},
		methods: {
			switchTab(tab) {
				this.currentTab = tab
			},

			calculateTimeRange() {
				const endTime = getChinaTimeAllJSON().YMD
				this.pacitime = endTime
			},

			// 手机本地日期：只保留「昨天」和「前天」（如今天 18 号 → 16、17 号）
			getTargetDateSet() {
				const pad = (n) => String(n).padStart(2, '0')
				const formatYMD = (d) =>
					`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
				const today = new Date()
				const yesterday = new Date(today)
				yesterday.setDate(today.getDate() - 1)
				const dayBefore = new Date(today)
				dayBefore.setDate(today.getDate() - 2)
				return new Set([formatYMD(yesterday), formatYMD(dayBefore)])
			},

			isInvalidValue(value) {
				const v = String(value == null ? '' : value).trim()
				return !v || v >= '999999990.00' || v === 'NA'
			},

			getPeriod(timeStr) {
				const parts = (timeStr || '').split(':')
				const hour = parseInt(parts[0], 10) || 0
				const minute = parseInt(parts[1], 10) || 0
				const timeInMinutes = hour * 60 + minute
				const dayStart = 6 * 60
				const dayEnd = 21 * 60 + 30
				if (timeInMinutes >= dayStart && timeInMinutes < dayEnd) {
					return {
						period: 'day',
						periodText: this.$t('白天')
					}
				}
				return {
					period: 'night',
					periodText: this.$t('夜间')
				}
			},

			convertPressure(value) {
				if (this.isInvalidValue(value)) return '-'
				if (this.bloodUnit === 'mmHg') return value
				return (Number(value) * 0.133).toFixed(1)
			},

			formatHeartRate(value) {
				if (this.isInvalidValue(value)) return '-'
				return value
			},

			getStatus(sys, dia) {
				const systolic = Number(sys)
				const diastolic = Number(dia)
				if (!sys || !dia || Number.isNaN(systolic) || Number.isNaN(diastolic)) {
					return {
						code: '',
						text: '/'
					}
				}
				if (systolic >= 140 || diastolic >= 90) {
					return {
						code: 'high',
						text: this.$t('偏高')
					}
				}
				if (systolic <= 90 || diastolic <= 60) {
					return {
						code: 'low',
						text: this.$t('偏低')
					}
				}
				if (systolic >= 120 || diastolic >= 80) {
					return {
						code: 'warning',
						text: this.$t('正常高值')
					}
				}
				return {
					code: 'normal',
					text: this.$t('正常')
				}
			},

			processRetVarList(retVarListStr) {
				if (!retVarListStr) return []
				const targetDates = this.getTargetDateSet()
				const rows = retVarListStr.split(';').filter(Boolean)
				const list = []
				for (const row of rows) {
					const parts = row.split(',').map(item => item.trim())
					if (parts.length < 4) continue
					const fullTime = parts[0]
					if (this.isInvalidValue(parts[1]) || this.isInvalidValue(parts[2])) continue
					const timeSegments = fullTime.split(' ')
					const datePart = timeSegments[0] || fullTime
					if (!targetDates.has(datePart)) continue
					const timePart = timeSegments[1] || fullTime
					const periodInfo = this.getPeriod(timePart)
					const timestamp = new Date(fullTime.replace(/-/g, '/')).getTime()
					const status = this.getStatus(parts[1], parts[2])
					const clockPart = timeSegments[1] ? timeSegments[1].substring(0, 5) : ''
					list.push({
						time: fullTime.length >= 16 ? fullTime.substring(0, 16) : fullTime,
						datePart,
						clockPart,
						systolic: this.convertPressure(parts[1]),
						diastolic: this.convertPressure(parts[2]),
						heartRate: this.formatHeartRate(parts[3]),
						period: periodInfo.period,
						periodText: periodInfo.periodText,
						status: status.code,
						statusText: status.text,
						timestamp
					})
				}
				const sorted = list.sort((a, b) => b.timestamp - a.timestamp)
				const seen = new Set()
				return sorted.filter(item => {
					const key = `${item.time}_${item.systolic}_${item.diastolic}_${item.heartRate}`
					if (seen.has(key)) return false
					seen.add(key)
					return true
				})
			},
			get_retVarList() {
				const that = this
				const token = uni.getStorageSync('token')
				if (!token) {
					that.dataList = []
					return
				}
				that.loading = true
				const data = {
					userId: uni.getStorageSync("userid"),
					profDate: that.pacitime,
					filterVarList: that.filterVarList,
					retVarList: 'TIME_MEASURE,JLvOPRvJL01vSBP,JLvOPRvJL01vDBP,JLvOPRvJL01vHR'
				}
				console.log('get_retVarLisdata参数：', data)
				that.$post(that.$url_APP_IP + '/prod-api/device_app/get_retVarList', data, {
					'Authorization': 'Bearer ' + token,
					'content-type': 'application/x-www-form-urlencoded'
				}).then((res) => {
					console.log('get_retVarLis：', res)
					if (res.code === 200 && res.data && res.data.retVarList) {
						that.dataList = that.processRetVarList(res.data.retVarList)
					} else {
						that.dataList = []
					}
				}).catch((e) => {
					console.warn('[Smooth_BP_Data] get_retVarList failed', e)
					that.dataList = []
				}).finally(() => {
					that.loading = false
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		padding: 10px;
		height: 100vh;
		box-sizing: border-box;
		background: #f5f5f5;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.filter-tabs {
		position: sticky;
		top: 0;
		z-index: 20;
		flex-shrink: 0;
		display: flex;
		background: #ffffff;
		padding: 20rpx;
		border-bottom: 1px solid #e5e5e5;
	}

	.table-tip {
		flex-shrink: 0;
		padding: 16rpx 20rpx;
		font-size: 24rpx;
		line-height: 1.5;
		color: red;
		text-align: center;
		background: #fff8e8;
		border-bottom: 1px solid #f0e6c8;
	}

	.model-tip {
		margin-top: 16rpx;
		padding: 16rpx 20rpx;
		font-size: 22rpx;
		line-height: 1.5;
		color: #c0392b;
		text-align: left;
		background: rgba(255, 248, 232, 0.95);
		border-radius: 12rpx;
	}

	.tab {
		flex: 1;
		text-align: center;
		font-size: 26rpx;
		color: #666;
		padding: 16rpx 0;
		border-radius: 8rpx;
	}

	.tab.active {
		color: #007aff;
		background: rgba(0, 122, 255, 0.08);
		font-weight: 600;
	}

	.table-header,
	.table-row {
		display: flex;
		align-items: flex-start;
		padding: 20rpx 16rpx;
	}

	.table-header {
		align-items: center;
		flex-shrink: 0;
		background: #ffffff;
		border-bottom: 1px solid #e5e5e5;
		font-size: 26rpx;
		font-weight: 600;
		color: #333;
	}

	.table-row {
		background: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		font-size: 26rpx;
		color: #333;
	}

	.table-row:nth-child(even) {
		background: #fafafa;
	}

	.table-row.night-row {
		background: #f3f6fb;
	}

	.col-time {
		flex: 0.85;
		min-width: 0;
		display: flex;
		flex-direction: column;
		line-height: 1.3;
	}

	.time-date {
		font-size: 22rpx;
		color: #666;
		word-break: break-all;
	}

	.time-clock {
		font-size: 24rpx;
		color: #333;
		margin-top: 4rpx;
	}

	.col-period {
		flex: 0.75;
		text-align: center;
		padding-top: 2rpx;
	}

	.col-value {
		flex: 0.65;
		text-align: center;
		padding-top: 2rpx;
	}

	.col-status {
		flex: 0.85;
		text-align: center;
		padding-top: 2rpx;
	}

	.period-tag {
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-size: 22rpx;
	}

	.period-tag.day {
		color: #007aff;
		background: rgba(0, 122, 255, 0.1);
	}

	.period-tag.night {
		color: #5856d6;
		background: rgba(88, 86, 214, 0.1);
	}

	.status-tag {
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-size: 22rpx;
	}

	.status-tag.normal {
		background: #e8f5e9;
		color: #4caf50;
	}

	.status-tag.warning {
		background: #fff3e0;
		color: #ff9800;
	}

	.status-tag.high {
		background: #ffebee;
		color: #f44336;
	}

	.status-tag.low {
		background: #e3f2fd;
		color: #2196f3;
	}

	.list-scroll {
		flex: 1;
		height: 0;
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.empty-tip {
		padding: 80rpx 20rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}
</style>