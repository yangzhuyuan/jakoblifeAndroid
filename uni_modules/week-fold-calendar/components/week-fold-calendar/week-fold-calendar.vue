<template>
	<view>
		<view class="controller">

			<view class="today-btn_1">
				<view style="font-weight: bold;font-size: 14px;">帮助</view>
			</view>

			<view class="action">
				<!-- 月份切换 -->
				<view class="arrow left" :class="{disabled: prevDisabled}" @click="handleChange('prev')">
					<text class="icon"></text>
				</view>
				<view class="date">{{ dateLabel }}</view>
				<view class="arrow right" :class="{disabled: nextDisabled}" @click="handleChange('next')">
					<text class="icon"></text>
				</view>
			</view>

			<view class="today-btn">
				<view style="font-weight: bold;font-size: 14px;" @click="backToday">回到今天</view>
			</view>

		</view>

		<view class="calender" :class="[viewType]">
			<view class="week-box">
				<view :key="index" v-for="(item,index) in week" class="week">
					{{ item }}
				</view>
			</view>

			<view class="day-box">
				<view class="placeholder" :class="[changeType]">
					<view :key="index" v-for="(item,index) in virtually_data" class="item" :class="{
							in: item.set || item.get,
							before: item.before,
							after: item.after && !allowFuture,
							active: current == item.date && item.type === 'current',
							prev: item.type === 'prev',
							next: item.type === 'next',
						}" :style="[cty]">
						<view>
							<view>{{ item.day }}</view>
							<view v-if="item.lunarDate" class="lc">{{ item.lunarDate }}</view>
						</view>
						<view class="dots" v-show="item[keyName]"></view>
					</view>
				</view>

				<view class="days" :class="[changeType]" @touchend="touchend" @touchmove="touchmove"
					@touchstart="touchstart">
					<view :key="index" v-for="(item,index) in days" class="item" :class="{
							in: item.set || item.get,
							before: item.before,
							after: item.after && !allowFuture,
							active: current == item.date && item.type === 'current',
							prev: item.type === 'prev',
							next: item.type === 'next',
						}" :style="[cty]" @click="itemClick(item)">
						<view>
							<view>{{ item.day }}</view>
							<view v-if="item.lunarDate" class="lc">{{ item.lunarDate }}</view>
						</view>
						<view class="dots" v-show="item[keyName]"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="view-change-btn" @click="changeViewType">
			{{ viewType === 'month' ? '收起' : '展开' }}
		</view> -->
	</view>
</template>

<script>
	import {
		padStart,
		currentDate,
		getDaysDifference,
		formattedDate,
		getMonthDays,
		reduMonths,
		getAppointDate
	} from './dateManage.js'
	import getChineseCalendar from './chineseCalendar.js'
	import getSolarTerm from './solarTerm.js'
	import {
		solarFestival,
		lunarFestival
	} from './festival.js'
	const today = currentDate()
	let startX = 0
	let endX = 0

	export default {
		props: {
			dots: { // 数据点
				type: Array,
				default: () => []
			},
			keyName: { // 数据点的key
				type: String,
				default: 'value'
			},
			defaultViewType: { // 日历视图
				type: String,
				default: 'month'
			},
			allowFuture: { // 允许选择未来日期
				type: Boolean,
				default: false
			},
			minDate: { // 过去日期限制
				type: String,
				default: ''
			},
			showLunarCalendar: { // 显示农历
				type: Boolean,
				default: false
			},
			showSolarTerm: { // 显示24节气
				type: Boolean,
				default: false
			},
			showFestival: { // 显示节日
				type: Boolean,
				default: false
			},

			customStyle: { // 自定义默认样式
				type: Object,
				default: () => {}
			},
			activeBgColor: { // 自定义选中样式
				type: String,
				default: '#3c9cff'
			},
			activeColor: { // 自定义选中样式
				type: String,
				default: '#fff'
			}
		},
		data() {
			return {
				week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				virtually_data: [],
				days: [],
				current: currentDate(),
				changeType: '',
				prevDisabled: false,
				nextDisabled: true,
				viewType: ''
			}
		},
		watch: {
			dots: {
				immediate: true,
				deep: true,
				handler() {
					this.setCalenderDots()
				}
			},
			current(n) {
				const __data = this.days.find(item => item.date == n)
				this.$emit('change', __data)
			}
		},
		computed: {
			showTodayBtn() {
				return this.current != today
			},
			dateLabel() {
				if (this.viewType === 'week') {
					return formattedDate(this.current, 'yyyy-mm')
				} else {
					return formattedDate(this.current, 'yyyy-mm')
				}
			},
			cty() {
				return {
					...this.customStyle,
					'--active': this.activeColor,
					'--active-bg': this.activeBgColor,
				}
			}
		},
		created() {
			this.nextDisabled = !this.allowFuture
			this.viewType = this.defaultViewType || 'month'
			this.init()
		},
		methods: {
			/**
			 * 回今日
			 */
			backToday() {
				this.nextDisabled = !this.allowFuture
				this.init()
			},

			/**
			 * 日历切换
			 */
			handleChange(type) {
				if (type === 'next' && this.nextDisabled) return
				if (type === 'prev' && this.prevDisabled) return

				if (this.viewType === 'week') {
					this.switchWeek(type)
				} else {
					this.switchMonth(type)
				}
			},

			/**
			 * 初始化日历
			 */
			init() {
				this.virtually_data = []
				this.current = today

				if (this.viewType === 'week') {
					this.initWeekCalender()
				} else {
					this.initMonthCalender()
				}
			},

			/**
			 * 切换月份
			 */
			switchMonth(type) {
				if (this._clock) return
				this._clock = true
				this.changeType = type

				const date = this.getMonth(type)
				this.initMonthCalender(date)

				let _default = date
				if (!this.allowFuture) {
					const monthDiff = reduMonths(today, date)
					this.nextDisabled = monthDiff <= 0
					if (getDaysDifference(today, _default) < 0) {
						_default = today
					}
				}
				if (this.minDate) {
					const cd = new Date(date)
					const firstDay = formattedDate(new Date(cd.getFullYear(), cd.getMonth(), 1))
					const minDiff = getDaysDifference(firstDay, this.minDate)
					this.prevDisabled = minDiff <= 0
					if (getDaysDifference(date, this.minDate) <= 0) {
						_default = this.minDate
					}
				}
				this.current = _default

				// 500ms节流
				setTimeout(() => {
					this.changeType = ''
					this._clock = false
					this.virtually_data = [...this.__days]
				}, 500)
			},

			/**
			 * 切换星期
			 */
			switchWeek(type) {
				if (this._clock) return
				this._clock = true
				this.changeType = type

				this.initWeekCalender(this.current, type)

				// 500ms节流
				setTimeout(() => {
					this.changeType = ''
					this._clock = false
					this.virtually_data = [...this.__days]
				}, 500)
			},

			/**
			 * 日期点击
			 */
			itemClick(data) {
				if (data.after && !this.allowFuture || data.before || this.current == data.date) return
				this.current = data.date
				// 点击其他月份的日期，切换日历
				if (data.type !== 'current') {
					this.handleChange(data.type)
				}
			},

			/**
			 * 切换日历视图
			 */
			changeViewType() {
				const type = this.viewType === 'month' ? 'week' : 'month'
				this.viewType = type
				this.virtually_data = []
				if (type === 'week') {
					this.initWeekCalender(this.current, 'current')
				} else {
					this.initMonthCalender(this.current)
				}
			},

			/**
			 * 初始化月份日历
			 */
			initMonthCalender(value) {
				let date = new Date()
				if (value) {
					date = new Date(value)
				}
				const nowMonth = date.getMonth() + 1
				const nowYear = date.getFullYear()
				const nowDay = date.getDate()

				this._nowYear = nowYear
				this._nowMonth = nowMonth
				this._nowDay = nowDay

				const days = getMonthDays(nowMonth, nowYear)
				const start_date = new Date(nowYear, nowMonth - 1, 1)
				const end_date = new Date(nowYear, nowMonth - 1, days)
				const prev_date = new Date(start_date.getTime() - 1)
				const prev_date_days = prev_date.getDate()
				const next_date = new Date(end_date.getTime() + 86401 * 1000)
				const start_week = start_date.getDay()
				const date_arrs = []

				if (this.minDate) {
					const cd = new Date(date)
					const firstDay = formattedDate(new Date(cd.getFullYear(), cd.getMonth(), 1))
					this.prevDisabled = getDaysDifference(firstDay, this.minDate) <= 0
				}

				// 上月
				for (let i = prev_date_days - start_week + 1; i <= prev_date_days; i++) {
					const _d = this.dateComplement(`${prev_date.getFullYear()}-${prev_date.getMonth()+1}-${i}`)

					date_arrs.push({
						type: 'prev',
						...this.getDateDetail(_d, i)
					})
				}

				// 当前月
				for (let i = 1; i <= days; i++) {
					const _d = this.dateComplement(`${nowYear}-${nowMonth}-${i}`)

					date_arrs.push({
						type: 'current',
						...this.getDateDetail(_d, i)
					})
				}

				// 下月
				const date_arrs_length = date_arrs.length
				for (let i = 1; i <= 42 - date_arrs_length; i++) {
					const _d = this.dateComplement(`${next_date.getFullYear()}-${next_date.getMonth()+1}-${i}`)

					date_arrs.push({
						type: 'next',
						...this.getDateDetail(_d, i)
					})
				}

				this.days = date_arrs
				this.__days = date_arrs
				if (!this.virtually_data.length) {
					this.virtually_data = [...this.__days]
				}
				this.setCalenderDots()
			},

			/**
			 * 初始化星期日历
			 */
			initWeekCalender(date, type = 'current') {
				const typeMap = {
					prev: -7,
					current: 0,
					next: 7
				}
				const timestamp = 3600 * 24 * 1000
				const t_date = new Date(new Date(date || this.current).getTime() + typeMap[type] * timestamp)
				const ty = t_date.getFullYear()
				const tm = t_date.getMonth()
				const td = t_date.getDate() - t_date.getDay()
				const weekStart = new Date(ty, tm, td)
				const weekDays = []
				for (var i = 0; i < 7; i++) {
					const _d = getAppointDate(formattedDate(weekStart), i)
					const day = new Date(_d).getDate()

					weekDays.push({
						type: 'current',
						...this.getDateDetail(_d, day)
					})
				}
				const selectDate = weekDays[new Date(this.current).getDay()].date
				let _default = selectDate
				if (!this.allowFuture) {
					const weekDiff = getDaysDifference(today, weekDays[weekDays.length - 1].date)
					this.nextDisabled = weekDiff <= 0
					if (getDaysDifference(today, _default) < 0) {
						_default = today
					}
				}
				if (this.minDate) {
					const firstDay = weekDays[0].date
					const minDiff = getDaysDifference(firstDay, this.minDate)
					this.prevDisabled = minDiff <= 0
					if (getDaysDifference(selectDate, this.minDate) <= 0) {
						_default = this.minDate
					}
				}
				this.current = _default
				this.days = weekDays
				this.__days = weekDays
				if (!this.virtually_data.length) {
					this.virtually_data = [...this.__days]
				}
				this.setCalenderDots()
			},

			/**
			 * 设置日历数据点
			 */
			setCalenderDots() {
				if (this.dots.length) {
					for (var d = 0; d < this.dots.length; d++) {
						for (var i = 0; i < this.days.length; i++) {
							if (this.dots[d].date == this.days[i].date) {
								this.$set(this.days, i, {
									...this.days[i],
									...this.dots[d]
								})
							}
						}
					}
				}
				this.$nextTick(() => {
					this.$emit('inited', this.days)
				})
			},

			/**
			 * 月份切换计算
			 */
			getMonth(type) {
				let nowYear = parseInt(this._nowYear)
				let nowMonth = parseInt(this._nowMonth)
				let nowDay = new Date(this.current).getDate()

				if (type == 'prev') {
					if (nowMonth == 1) {
						nowMonth = 12
						nowYear = nowYear - 1
					} else {
						nowMonth--
					}
				} else if (type == 'next') {
					if (nowMonth == 12) {
						nowMonth = 1
						nowYear = nowYear + 1
					} else {
						nowMonth++
					}
				}

				let days = getMonthDays(nowMonth, nowYear)
				if (nowDay > days) {
					nowDay = days
				}
				return this.dateComplement(`${nowYear}-${nowMonth}-${nowDay}`)
			},

			/**
			 * 日期格式化
			 */
			dateComplement(date) {
				return date.replace(/-(\d)(?!\d)/g, '-0$1')
			},

			/**
			 * 获取日期详情
			 * @param {String} date 公历日期 yyyy-mm-dd
			 * @param {String} day 公历日期 dd
			 */
			getDateDetail(date, day) {
				const dayDiff = getDaysDifference(today, date)
				const minDayDiff = this.minDate ? getDaysDifference(date, this.minDate) : 0
				const isToday = today == date
				const obj = {
					date, // 日期  yyyy-mm-dd
					day: isToday ? '今' : day, // 日期  dd
					today: isToday, // 今天
					before: minDayDiff < 0, // 是否过往日期
					after: dayDiff < 0, // 是否以后日期
					lunarDate: '', // 农历日期
					lunarCalendar: {}, // 农历数据集
					solarTermName: '', // 24节气
					festival: '' // 节日
				}

				// 农历
				if (this.showLunarCalendar) {
					const lcd = getChineseCalendar(date)
					obj.lunarDate = lcd.day || lcd.month
					obj.lunarCalendar = lcd
				}

				// 24节气
				if (this.showSolarTerm) {
					const stn = getSolarTerm(date)
					if (stn) {
						obj.lunarDate = stn
						obj.solarTermName = stn
					}
				}

				// 节日
				if (this.showFestival) {
					const _sf = solarFestival[date.substr(5)]
					if (_sf) {
						obj.lunarDate = _sf
						obj.festival = _sf
					}
					let fullDate = obj.lunarCalendar.fullDate
					if (!fullDate) {
						fullDate = getChineseCalendar(date).fullDate
					}
					const _lf = lunarFestival[fullDate]
					if (_lf) {
						obj.lunarDate = _lf
						obj.festival = _lf
					}
				}
				return obj
			},

			// 手势滑动操作
			touchstart(e) {
				if (this.changeType) return
				this.__st = e.timeStamp
				startX = e.touches[0].pageX
			},

			touchmove(e) {
				if (this.changeType) return
				endX = e.touches[0].pageX
			},

			touchend(e) {
				if (this.changeType) return
				try {
					// 300毫秒快速操作，切换日历
					if (e.timeStamp - this.__st > 300 || endX == 0) {
						startX = 0
						endX = 0
						return
					}

					const rangeX = Math.abs(endX - startX)
					// 滑动范围限制
					if (rangeX < 80) return
					let type = ''

					if (endX < startX) {
						if (this.nextDisabled) return
						type = 'next'

					} else if (endX > startX) {
						if (this.prevDisabled) return
						type = 'prev'
					}

					startX = 0
					endX = 0

					this.handleChange(type)

					// 500ms节流
					setTimeout(() => {
						this.changeType = ''
						this.virtually_data = [...this.__days]
					}, 500)
				} catch (e) {
					console.error('touchend', e);
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>