<template>
	<view>
		<view class="controller">

			<view class="today-btn_1">
				<view style="font-weight: bold;font-size: 14px;">{{$t("帮助")}}</view>
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
				<view style="font-weight: bold;font-size: 14px;" @click="backToday">{{$t("回到今天")}}</view>
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
		getAppointDate,
		getBeijingWeekDay,
		getMonthBounds,
		getWeekStart,
		parseBeijingDate,
		getDateInfo
	} from './dateManage.js'
	import getChineseCalendar from './chineseCalendar.js'
	import getSolarTerm from './solarTerm.js'
	import {
		solarFestival,
		lunarFestival
	} from './festival.js'

	const today = currentDate()

	export default {
		props: {
			dots: {
				type: Array,
				default: () => []
			},
			keyName: {
				type: String,
				default: 'value'
			},
			defaultViewType: {
				type: String,
				default: 'month'
			},
			allowFuture: {
				type: Boolean,
				default: false
			},
			minDate: {
				type: String,
				default: ''
			},
			showLunarCalendar: {
				type: Boolean,
				default: false
			},
			showSolarTerm: {
				type: Boolean,
				default: false
			},
			showFestival: {
				type: Boolean,
				default: false
			},
			customStyle: {
				type: Object,
				default: () => {}
			},
			activeBgColor: {
				type: String,
				default: '#3c9cff'
			},
			activeColor: {
				type: String,
				default: '#fff'
			}
		},
		data() {
			return {
				week: [this.$t("周日"), this.$t("周一"), this.$t("周二"), this.$t("周三"), this.$t("周四"), this.$t("周五"), this.$t(
					"周六")],
				virtually_data: [],
				days: [],
				current: currentDate(),
				changeType: '',
				prevDisabled: false,
				nextDisabled: true,
				viewType: '',
				// 手势相关
				touchStartX: 0,
				touchStartY: 0,
				touchStartTime: 0,
				isTouching: false,
				isMoving: false
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
				const parts = parseBeijingDate(this.current)
				return `${parts.year}-${padStart(parts.month)}`
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
			 * 回到今天
			 */
			backToday() {
				this.nextDisabled = !this.allowFuture
				this.current = today
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
					const bounds = getMonthBounds(date)
					const minDiff = getDaysDifference(bounds.firstDay, this.minDate)
					this.prevDisabled = minDiff <= 0
					if (getDaysDifference(date, this.minDate) <= 0) {
						_default = this.minDate
					}
				}
				this.current = _default

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
				// 如果正在滑动，不触发点击
				if (this.isMoving) return
				if ((data.after && !this.allowFuture) || data.before || this.current == data.date) return
				this.current = data.date
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
				const dateStr = value || today
				const bounds = getMonthBounds(dateStr)
				const {
					year,
					month,
					days
				} = bounds

				this._nowYear = year
				this._nowMonth = month

				const firstDayWeekday = getBeijingWeekDay(year, month, 1)

				let prevYear = year
				let prevMonth = month - 1
				if (prevMonth === 0) {
					prevMonth = 12
					prevYear = year - 1
				}
				const prevMonthDays = getMonthDays(prevMonth, prevYear)

				const date_arrs = []

				if (this.minDate) {
					this.prevDisabled = getDaysDifference(bounds.firstDay, this.minDate) <= 0
				}

				for (let i = prevMonthDays - firstDayWeekday + 1; i <= prevMonthDays; i++) {
					const _d = `${prevYear}-${padStart(prevMonth)}-${padStart(i)}`
					date_arrs.push({
						type: 'prev',
						...this.getDateDetail(_d, i)
					})
				}

				for (let i = 1; i <= days; i++) {
					const _d = `${year}-${padStart(month)}-${padStart(i)}`
					date_arrs.push({
						type: 'current',
						...this.getDateDetail(_d, i)
					})
				}

				const remaining = 42 - date_arrs.length
				let nextYear = year
				let nextMonth = month + 1
				if (nextMonth === 13) {
					nextMonth = 1
					nextYear = year + 1
				}

				for (let i = 1; i <= remaining; i++) {
					const _d = `${nextYear}-${padStart(nextMonth)}-${padStart(i)}`
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

				const baseStr = date || this.current
				const baseInfo = getDateInfo(baseStr)

				const currentWeekday = baseInfo.weekday
				const weekStartStr = getWeekStart(baseStr)
				const offsetDays = typeMap[type]
				const targetStartStr = getAppointDate(weekStartStr, offsetDays)

				const weekDays = []

				for (let i = 0; i < 7; i++) {
					const dayStr = getAppointDate(targetStartStr, i)
					const dayInfo = getDateInfo(dayStr)

					weekDays.push({
						type: 'current',
						...this.getDateDetail(dayStr, dayInfo.day)
					})
				}

				let selectDate = weekDays[Math.min(currentWeekday, 6)].date

				if (!this.allowFuture) {
					const lastDayOfWeek = weekDays[6].date
					this.nextDisabled = getDaysDifference(today, lastDayOfWeek) < 0

					if (getDaysDifference(today, selectDate) < 0) {
						selectDate = today
					}
				}

				if (this.minDate) {
					const firstDayOfWeek = weekDays[0].date
					this.prevDisabled = getDaysDifference(firstDayOfWeek, this.minDate) <= 0

					if (getDaysDifference(selectDate, this.minDate) <= 0) {
						selectDate = this.minDate
					}
				}

				this.current = selectDate
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
				const parts = parseBeijingDate(this.current)
				let {
					year,
					month,
					day
				} = parts

				if (type == 'prev') {
					if (month == 1) {
						month = 12
						year = year - 1
					} else {
						month--
					}
				} else if (type == 'next') {
					if (month == 12) {
						month = 1
						year = year + 1
					} else {
						month++
					}
				}

				const days = getMonthDays(month, year)
				if (day > days) {
					day = days
				}
				return `${year}-${padStart(month)}-${padStart(day)}`
			},

			/**
			 * 获取日期详情
			 */
			getDateDetail(date, day) {
				const dayDiff = getDaysDifference(today, date)
				const minDayDiff = this.minDate ? getDaysDifference(date, this.minDate) : 0
				const isToday = date === today
				const obj = {
					date,
					day: isToday ? this.$t("今") : day,
					today: isToday,
					before: minDayDiff < 0,
					after: dayDiff < 0,
					lunarDate: '',
					lunarCalendar: {},
					solarTermName: '',
					festival: ''
				}
				if (this.showLunarCalendar) {
					const lcd = getChineseCalendar(date)
					obj.lunarDate = lcd.day || lcd.month
					obj.lunarCalendar = lcd
				}

				if (this.showSolarTerm) {
					const stn = getSolarTerm(date)
					if (stn) {
						obj.lunarDate = stn
						obj.solarTermName = stn
					}
				}

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

			// ========== 手势滑动修复 ==========

			/**
			 * 触摸开始
			 */
			touchstart(e) {
				if (this.changeType) return

				this.isTouching = true
				this.isMoving = false
				this.touchStartX = e.touches[0].pageX
				this.touchStartY = e.touches[0].pageY
				this.touchStartTime = Date.now()
			},

			/**
			 * 触摸移动
			 */
			touchmove(e) {
				if (!this.isTouching || this.changeType) return

				const moveX = e.touches[0].pageX
				const moveY = e.touches[0].pageY
				const deltaX = Math.abs(moveX - this.touchStartX)
				const deltaY = Math.abs(moveY - this.touchStartY)

				// 水平滑动超过10px，且水平滑动大于垂直滑动（防止上下滚动时误触发）
				if (deltaX > 10 && deltaX > deltaY) {
					this.isMoving = true
					// 阻止默认滚动行为
					e.preventDefault()
				}
			},

			/**
			 * 触摸结束
			 */
			touchend(e) {
				if (!this.isTouching || this.changeType) {
					this.resetTouch()
					return
				}

				const endTime = Date.now()
				const duration = endTime - this.touchStartTime
				const endX = e.changedTouches[0].pageX
				const deltaX = endX - this.touchStartX
				const absDeltaX = Math.abs(deltaX)

				// 快速点击（时间短 + 位移小）= 不滑动
				if (duration < 300 && absDeltaX < 30) {
					this.resetTouch()
					return
				}

				// 滑动距离必须超过80px
				if (absDeltaX < 80) {
					this.resetTouch()
					return
				}

				// 执行滑动切换
				let type = ''
				if (deltaX < 0) {
					// 向左滑 -> 下一页
					if (this.nextDisabled) {
						this.resetTouch()
						return
					}
					type = 'next'
				} else {
					// 向右滑 -> 上一页
					if (this.prevDisabled) {
						this.resetTouch()
						return
					}
					type = 'prev'
				}

				this.resetTouch()
				this.handleChange(type)

				setTimeout(() => {
					this.changeType = ''
					this.virtually_data = [...this.__days]
				}, 500)
			},

			/**
			 * 重置触摸状态
			 */
			resetTouch() {
				this.isTouching = false
				this.isMoving = false
				this.touchStartX = 0
				this.touchStartY = 0
				this.touchStartTime = 0
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>

<style lang="scss" scoped>
	@import './index.scss';
</style>