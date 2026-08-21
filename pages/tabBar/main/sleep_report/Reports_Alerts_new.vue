<template>
	<view style="padding-top: 20px;padding-bottom: 80px;">
		<view v-if="showAppManageTips" class="app-manage-tips">
			<view class="watch-upgrade-permission-tip">{{ $t('定时测量权限操作注意') }}</view>
			<view class="app-link-row" @click="openExamplePopup">
				<text class="link-icon-anim icon-point">👉</text>
				<text class="app-setting-link-text">{{$t('查看操作示例图')}}</text>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="tip-text">{{$t('定时测量方案一')}}：{{ manualGuideText }}</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="tip-text">{{$t('定时测量方案二')}}：{{ afterJumpGuideText }}</view>
			<view class="app-link-list">
				<view class="app-link-row" @click="openAppAuthorizeSetting">
					<text class="link-icon-anim icon-gear">⚙️</text>
					<text class="app-setting-link-text">{{$t('去设置')}}</text>
				</view>
				<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			</view>
		</view>
		<uni-popup ref="examplePopup" type="center" :mask-click="true">
			<view class="example-popup">
				<view class="example-popup-title">{{$t('定时测量操作示例')}}</view>
				<scroll-view scroll-y class="example-scroll">
					<view v-for="(group, groupIndex) in exampleGroups" :key="groupIndex" class="example-group">
						<view class="example-group-title">{{$t(group.titleKey)}}</view>
						<view v-for="(item, stepIndex) in group.steps" :key="stepIndex" class="example-item">
							<image class="example-img" :src="item.src" mode="widthFix"
								@click="previewExampleImage(groupIndex, stepIndex)" />
							<view class="example-caption">{{$t(item.captionKey)}}</view>
						</view>
					</view>
				</scroll-view>
				<button class="example-close-btn" @click="closeExamplePopup">{{$t('知道了')}}</button>
			</view>
		</uni-popup>
		<view v-if="showWuganSection" class="path-tip">{{$t('动态监测报告填写路径提示')}}</view>
		<view v-if="showWuganSection" class="bt_BG">
			<view class="context_btn2">
				<view class="context_title1">{{$t('无感测量开关')}}
					<view v-if="sending" class="sending-status">
						<text class="sending-text">{{$t("配置中")}}</text>
						<text class="sending-icon-animate">⏳</text>
					</view>
				</view>
				<switch style="display: flex;flex: 1;justify-content: flex-end;" :checked="switchHER"
					@change="switch1ChangeHER" color="#4CD964" />
			</view>
			<view class="timer-item">
				<view class="context_btn1">
					<view class="text">{{$t('开始时间')}}：</view>
					<view class="uni-list-cell-db picker-wrap">
						<picker fields="month" mode="time" :value="time1" @change="bindTimeChange_1">
							<view class="date_bg" :style="getStatusColor(time1)">{{time1}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('结束时间')}}：</view>
					<view class="uni-list-cell-db picker-wrap">
						<picker fields="month" mode="time" :value="time2" @change="bindTimeChange_2">
							<view class="date_bg" :style="getStatusColor(time2)">{{time2}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('间隔时间')}}：</view>
					<view class="uni-list-cell-db picker-wrap">
						<picker :value="index1" @change="Interval_time" :range="array1">
							<view class="date_bg">{{array1[index1]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view v-if="showEmotionSection" class="bt_BG">
			<view class="context_btn2">
				<view class="context_title1">{{$t('情绪测量开关')}}
					<view v-if="sending && !showWuganSection" class="sending-status">
						<text class="sending-text">{{$t("配置中")}}</text>
						<text class="sending-icon-animate">⏳</text>
					</view>
				</view>
				<switch style="display: flex;flex: 1;justify-content: flex-end;" :checked="switchEmotion"
					@change="switchEmotionChange" color="#4CD964" />
			</view>
			<view class="timer-item">
				<view class="context_btn1">
					<view class="text">{{$t('开始时间')}}：</view>
					<view class="uni-list-cell-db picker-wrap">
						<picker fields="month" mode="time" :value="time1Emotion" @change="bindTimeChangeEmotion_1">
							<view class="date_bg" :style="getStatusColor(time1Emotion)">{{time1Emotion}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('结束时间')}}：</view>
					<view class="uni-list-cell-db picker-wrap">
						<picker fields="month" mode="time" :value="time2Emotion" @change="bindTimeChangeEmotion_2">
							<view class="date_bg" :style="getStatusColor(time2Emotion)">{{time2Emotion}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('间隔时间')}}：</view>
					<view class="uni-list-cell-db picker-wrap">
						<picker :value="indexEmotion" @change="Interval_time_emotion" :range="array1">
							<view class="date_bg">{{array1[indexEmotion]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<button class="buttonstyle" @click="clickset()">{{sending?$t("配置中"):$t("保存")}}</button>
		<view class="battery-hint">
			<text>{{$t('打开该功能手表和手机电池消耗会明显增加')}}</text>
		</view>

	</view>
</template>

<script>
	import {
		startGlobalQxBleAlignedSchedule,
		stopGlobalQxBleAlignedSchedule,
		ensureQxBleKeepAliveForBackground,
		QX_EMOTION_BPW6_KEY
	} from '@/pages/api/qxBleAlignedSchedule.js'
	import {
		detectQxManufacturerType,
		getQxManualGuideI18nKey,
		getQxAfterJumpGuideI18nKey,
		isQxHuaweiHonorDevice
	} from '@/pages/api/qxAppManageGuide.js'
	import {
		getQxDingshiExampleGroups,
		flattenQxDingshiExampleSteps
	} from '@/pages/api/qxDingshiExampleImages.js'

	/** 间隔选项（分钟），与云端 QX_DATA、全局调度模块一致 */
	const INTERVAL_MINUTES = [10, 30, 60, 120]

	export default {
		data() {
			return {
				sending: false,
				switchHER: uni.getStorageSync("switchHER") || false,
				time1: uni.getStorageSync("starttime") !== '' ? uni.getStorageSync("starttime") : this.getCurrentTime(),
				time2: uni.getStorageSync("endtime") !== '' ? uni.getStorageSync("endtime") : this
					.getCurrentTimePlusHour(),
				array1: [this.$t('分钟10'), this.$t('分钟30'), this.$t('分钟60'), this.$t('分钟120')],
				index1: uni.getStorageSync("Interval_time") !== "" ? uni.getStorageSync("Interval_time") : 0,
				switchEmotion: uni.getStorageSync("switchEmotion") || false,
				time1Emotion: uni.getStorageSync("starttimeEmotion") !== '' ? uni.getStorageSync(
					"starttimeEmotion") : this.getCurrentTime(),
				time2Emotion: uni.getStorageSync("endtimeEmotion") !== '' ? uni.getStorageSync(
					"endtimeEmotion") : this.getCurrentTimePlusHour(),
				indexEmotion: uni.getStorageSync("Interval_time_emotion") !== "" ? uni.getStorageSync(
					"Interval_time_emotion") : 0,
				deviceId: uni.getStorageSync("deviceIdwatch"), //BPW1蓝牙mac
				manufacturerType: detectQxManufacturerType(),
				devicetype: false,
				/** wugan=仅无感；emotion=仅情绪定时；all=两者（兼容旧入口） */
				settingMode: 'all',
			}
		},

		computed: {
			showWuganSection() {
				return this.settingMode === 'wugan' || this.settingMode === 'all'
			},
			showEmotionSection() {
				return this.settingMode === 'emotion' || this.settingMode === 'all'
			},
			showAppManageTips() {
				return isQxHuaweiHonorDevice()
			},
			manualGuideText() {
				return this.$t(getQxManualGuideI18nKey(this.manufacturerType))
			},
			afterJumpGuideText() {
				return this.$t(getQxAfterJumpGuideI18nKey(this.manufacturerType))
			},
			exampleGroups() {
				return getQxDingshiExampleGroups()
			},
			flatExampleSteps() {
				return flattenQxDingshiExampleSteps(this.exampleGroups)
			}
		},

		onLoad(options) {
			const mode = String((options && options.mode) || '').toLowerCase()
			if (mode === 'wugan' || mode === 'emotion' || mode === 'all') {
				this.settingMode = mode
			} else {
				// 无 mode 时按来源兜底：监测页无压入口应带 mode=wugan；情绪页带 mode=emotion
				this.settingMode = 'all'
			}
			this.devicetype = options.devicetype
			const isBpw6 = options.devicetype === 'true' || options.devicetype === true
			if (options.devicetype !== undefined && options.devicetype !== null && options.devicetype !== '') {
				uni.setStorageSync(QX_EMOTION_BPW6_KEY, isBpw6)
			}
			if (isBpw6) {
				this.deviceId = uni.getStorageSync('BPW6devicemac')
			} else {
				this.deviceId = uni.getStorageSync('deviceIdwatch')
			}
		},
		onShow() {
			const titleKey = this.settingMode === 'wugan' ?
				'无感测量开关' :
				(this.settingMode === 'emotion' ? '情绪测量开关' : '定时测量')
			uni.setNavigationBarTitle({
				title: this.$t(titleKey)
			})
			this.manufacturerType = detectQxManufacturerType()
			this.QX_DATA()
		},
		methods: {
			// 接口获取定时测量配置（QX_DATA）
			QX_DATA() {
				const data = {
					dataType: 'QX_DATA'
				}
				this.$get(this.$url_APP_IP + '/prod-api/device/data/list', data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					// console.log('获取情绪定时测量配置', res)
					if (res.code !== 200 || !res.rows || !res.rows.length || !res.rows[0].data) return
					const row = this.parseQxDataRow(res.rows[0].data)
					if (!row) return
					if (row.starttime != null && row.starttime !== '') {
						this.time1 = this.normalizeTimePicker(String(row.starttime))
						uni.setStorageSync('starttime', this.time1)
					}
					if (row.endtime != null && row.endtime !== '') {
						this.time2 = this.normalizeTimePicker(String(row.endtime))
						uni.setStorageSync('endtime', this.time2)
					}
					if (row.intervalMinute != null && row.intervalMinute !== '') {
						const n = Number(row.intervalMinute)
						let ix = INTERVAL_MINUTES.indexOf(n)
						if (ix < 0) ix = 0
						this.index1 = ix
						uni.setStorageSync('Interval_time', this.index1)
					}
					if (row.SWITCH_QX !== undefined) {
						this.switchHER = row.SWITCH_QX === true || row.SWITCH_QX === 'true'
						uni.setStorageSync('switchHER', this.switchHER)
					}
					if (row.starttimeEmotion != null && row.starttimeEmotion !== '') {
						this.time1Emotion = this.normalizeTimePicker(String(row.starttimeEmotion))
						uni.setStorageSync('starttimeEmotion', this.time1Emotion)
					}
					if (row.endtimeEmotion != null && row.endtimeEmotion !== '') {
						this.time2Emotion = this.normalizeTimePicker(String(row.endtimeEmotion))
						uni.setStorageSync('endtimeEmotion', this.time2Emotion)
					}
					if (row.intervalMinuteEmotion != null && row.intervalMinuteEmotion !== '') {
						const n = Number(row.intervalMinuteEmotion)
						let ix = INTERVAL_MINUTES.indexOf(n)
						if (ix < 0) ix = 0
						this.indexEmotion = ix
						uni.setStorageSync('Interval_time_emotion', this.indexEmotion)
					}
					if (row.SWITCH_QX_EMOTION !== undefined) {
						this.switchEmotion = row.SWITCH_QX_EMOTION === true || row.SWITCH_QX_EMOTION ===
							'true'
						uni.setStorageSync('switchEmotion', this.switchEmotion)
					}
					this.$forceUpdate()
				})
			},
			/** 解析云端 QX_DATA 的 data 串（无引号 JSON 风格，与 formatDatacard 一致） */
			parseQxDataRow(dataStr) {
				if (!dataStr || typeof dataStr !== 'string') return null
				try {
					let objStr = dataStr.trim()
					if (!objStr.startsWith('{')) objStr = '{' + objStr
					if (!objStr.endsWith('}')) objStr = objStr + '}'
					const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
						v = v.trim()
						if (v === 'true' || v === 'false') return `"${k}":${v}`
						if (!isNaN(v) && v !== '' && !v.includes('/') && !v.includes(':')) return `"${k}":${v}`
						return `"${k}":"${v}"`
					})
					return JSON.parse(fixed)
				} catch (e) {
					console.error('parseQxDataRow', e)
					return null
				}
			},
			/** 转为 HH:mm，供 picker mode="time" */
			normalizeTimePicker(t) {
				const parts = String(t).split(':')
				if (parts.length < 2) return this.getCurrentTime()
				const h = parseInt(parts[0], 10)
				const m = parseInt(parts[1], 10)
				if (Number.isNaN(h) || Number.isNaN(m)) return this.getCurrentTime()
				const hh = String(Math.min(23, Math.max(0, h))).padStart(2, '0')
				const mm = String(Math.min(59, Math.max(0, m))).padStart(2, '0')
				return `${hh}:${mm}`
			},

			// 获取当前时间（格式：HH:mm）
			getCurrentTime() {
				const now = new Date()
				const hours = now.getHours().toString().padStart(2, '0')
				const minutes = now.getMinutes().toString().padStart(2, '0')
				return `${hours}:${minutes}`
			},

			// 获取当前时间加60分钟
			getCurrentTimePlusHour() {
				const now = new Date()
				// 加60分钟
				now.setMinutes(now.getMinutes() + 60)
				const hours = now.getHours().toString().padStart(2, '0')
				const minutes = now.getMinutes().toString().padStart(2, '0')
				return `${hours}:${minutes}`
			},
			timeToMinutes(timeStr) {
				if (!timeStr || typeof timeStr !== 'string') return NaN
				const parts = timeStr.split(':')
				if (parts.length < 2) return NaN
				const h = parseInt(parts[0], 10)
				const m = parseInt(parts[1], 10)
				if (Number.isNaN(h) || Number.isNaN(m)) return NaN
				if (h < 0 || h > 23 || m < 0 || m > 59) return NaN
				return h * 60 + m
			},
			validateScheduleWindow(t1 = this.time1, t2 = this.time2) {
				const DAY = 24 * 60
				const s = this.timeToMinutes(t1)
				const e = this.timeToMinutes(t2)
				if (Number.isNaN(s) || Number.isNaN(e)) {
					return {
						ok: false,
						msg: this.$t('结束须晚于开始')
					}
				}
				if (e === s) {
					return {
						ok: false,
						msg: this.$t('结束须晚于开始')
					}
				}
				// 同一天内 e>s 为 e-s；跨自然日（次日）e<s 为 (24h - s + e)
				const spanMin = e > s ? (e - s) : (DAY - s + e)
				if (spanMin > DAY) {
					return {
						ok: false,
						msg: this.$t('时段不超过24小时')
					}
				}
				if (spanMin <= 0) {
					return {
						ok: false,
						msg: this.$t('时段不超过24小时')
					}
				}
				return {
					ok: true
				}
			},
			/** 保存成功后：全局按时钟刻度对齐槽位调度蓝牙（见 pages/api/qxBleAlignedSchedule.js） */
			afterQxSavedStartBleSchedule() {
				stopGlobalQxBleAlignedSchedule()
				if (!this.switchHER && !this.switchEmotion) return
				if (this.switchHER && !this.validateScheduleWindow(this.time1, this.time2).ok) return
				if (this.switchEmotion && !this.validateScheduleWindow(this.time1Emotion, this.time2Emotion)
					.ok) return
				uni.setStorageSync('starttime', this.time1)
				uni.setStorageSync('endtime', this.time2)
				uni.setStorageSync('Interval_time', this.index1)
				uni.setStorageSync('switchHER', this.switchHER)
				uni.setStorageSync('starttimeEmotion', this.time1Emotion)
				uni.setStorageSync('endtimeEmotion', this.time2Emotion)
				uni.setStorageSync('Interval_time_emotion', this.indexEmotion)
				uni.setStorageSync('switchEmotion', this.switchEmotion)
				const isBpw6 = this.devicetype === 'true' || this.devicetype === true
				uni.setStorageSync(QX_EMOTION_BPW6_KEY, isBpw6)
				const dev = isBpw6 ?
					uni.getStorageSync('BPW6devicemac') :
					uni.getStorageSync('deviceIdwatch')
				if (!dev) {
					console.warn('[qxBle] 保存后无设备MAC，已启动调度并每分钟重试', isBpw6 ? 'BPW6' : 'BPW1')
				}
				ensureQxBleKeepAliveForBackground()
				startGlobalQxBleAlignedSchedule()
			},



			bindTimeChange_1(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(next, this.time2)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.time1 = next
				uni.setStorageSync('starttime', this.time1)
			},
			bindTimeChange_2(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(this.time1, next)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.time2 = next
				uni.setStorageSync('endtime', this.time2)
			},
			Interval_time(e) {
				this.index1 = e.detail.value
				uni.setStorageSync("Interval_time", this.index1)
				const v = this.validateScheduleWindow(this.time1, this.time2)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
			},
			bindTimeChangeEmotion_1(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(next, this.time2Emotion)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.time1Emotion = next
				uni.setStorageSync('starttimeEmotion', this.time1Emotion)
			},
			bindTimeChangeEmotion_2(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(this.time1Emotion, next)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.time2Emotion = next
				uni.setStorageSync('endtimeEmotion', this.time2Emotion)
			},
			Interval_time_emotion(e) {
				this.indexEmotion = e.detail.value
				uni.setStorageSync('Interval_time_emotion', this.indexEmotion)
				const v = this.validateScheduleWindow(this.time1Emotion, this.time2Emotion)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
			},

			getStatusColor(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === this.$t('请选择') ? 'gray' : 'black'
				};
			},


			switch1ChangeHER(e) {
				let that = this
				that.switchHER = e.detail.value
				uni.setStorageSync("switchHER", that.switchHER)
				that.$forceUpdate()
				if (e.detail.value === false) {
					console.log("1that.switchHER", that.switchHER)
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					console.log("2that.switchHER", that.switchHER)
				}
			},
			switchEmotionChange(e) {
				this.switchEmotion = e.detail.value
				uni.setStorageSync('switchEmotion', this.switchEmotion)
				this.$forceUpdate()
			},

			clickset() {
				let that = this
				// 仅校验当前页可见区块，避免隐藏区块开关导致无法保存
				if (that.showWuganSection && that.switchHER === true) {
					const w = that.validateScheduleWindow(that.time1, that.time2)
					if (!w.ok) {
						uni.showToast({
							title: w.msg,
							icon: 'none'
						})
						return
					}
				}
				if (that.showEmotionSection && that.switchEmotion === true) {
					const w2 = that.validateScheduleWindow(that.time1Emotion, that.time2Emotion)
					if (!w2.ok) {
						uni.showToast({
							title: w2.msg,
							icon: 'none'
						})
						return
					}
				}
				that.saveQXData()
			},

			// 定时测量配置同步云端（与单位保存 editData 方式一致）
			saveQXData() {
				const postData = {
					starttime: this.time1,
					endtime: this.time2,
					intervalMinute: INTERVAL_MINUTES[this.index1] ?? 10,
					SWITCH_QX: this.switchHER,
					starttimeEmotion: this.time1Emotion,
					endtimeEmotion: this.time2Emotion,
					intervalMinuteEmotion: INTERVAL_MINUTES[this.indexEmotion] ?? 10,
					SWITCH_QX_EMOTION: this.switchEmotion
				}
				const editData = {
					dataType: 'QX_DATA',
					data: this.formatDatacard([postData])
				}
				console.log('editData', editData)
				this.$post(this.$url_APP_IP + '/prod-api/device/data/editData', editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: this.$t('保存成功'),
							icon: 'none'
						})
						if (!this.switchHER && !this.switchEmotion) {
							uni.removeStorageSync('sendwatch')
						}
						this.afterQxSavedStartBleSchedule()
						// setTimeout(() => {
						// 	uni.switchTab({
						// 		url: '/pages/tabBar/main/Main'
						// 	})
						// }, 50)
					} else {
						uni.showToast({
							title: this.$t('失败'),
							icon: 'none'
						})
					}
				})
			},
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',')
			},

			openExamplePopup() {
				this.$refs.examplePopup.open()
			},
			closeExamplePopup() {
				this.$refs.examplePopup.close()
			},
			previewExampleImage(groupIndex, stepIndex) {
				let current = 0
				for (let i = 0; i < groupIndex; i++) {
					current += (this.exampleGroups[i].steps || []).length
				}
				current += stepIndex
				const urls = this.flatExampleSteps.map((item) => item.src)
				uni.previewImage({
					urls,
					current
				})
			},
			openAppAuthorizeSetting() {
				uni.openAppAuthorizeSetting({
					success(res) {
						console.log('跳转成功', res)
					},
					fail(err) {
						console.log('跳转失败', err)
					}
				})
			},

		}
	}
</script>

<style>
	.popup_bg {
		padding: 20px;
		width: 50vw;
		margin-left: 20px;
		margin-right: 20px;
		background: white;
		border-radius: 20px;
	}

	.select_text {
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.context_btn1 {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		height: 56px;
		padding: 0 20px;

	}

	.picker-wrap {
		display: flex;
		justify-content: center;
		border: 1rpx solid #ddd;
		border-radius: 12rpx;
		padding: 12rpx 24rpx;
		min-width: 180rpx;
		align-items: center;
		background: white;
	}

	.context_btn2 {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 56px;
		padding: 0 20px;

	}

	.context_title1 {
		display: flex;
		flex: 1;
		font-size: 16px;
		color: black;
	}

	.timer-item {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		margin-left: 10px;
		margin-right: 10px;
		border: 1rpx solid #eee;
		border-radius: 16rpx;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #fafafa;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

	}

	.sending-status {
		display: flex;
		align-items: center;
		margin-left: 16rpx;
		padding: 4rpx 16rpx;
		background: linear-gradient(135deg, #fff3e0 0%, #ffe6cc 100%);
		border-radius: 24rpx;
	}

	.sending-text {
		color: #ff6600;
		font-size: 24rpx;
		font-weight: 500;
		margin-right: 8rpx;
	}

	.sending-icon-animate {
		color: #ff6600;
		font-size: 28rpx;
		display: inline-block;
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.bt_BG {
		width: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-left: 20px;
		margin-right: 20px;
		margin-top: 20px;
		padding: 20px;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.text {
		font-size: 16px;
		font-weight: 400;
	}

	.date_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 16px;
	}

	.buttonstyle {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-top: 40px;
		margin-left: 20px;
		margin-right: 20px;
		background: #3298F7;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.battery-hint {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		padding: 24rpx 32rpx;
		border-radius: 20rpx;
		z-index: 1;
	}

	.battery-hint text {
		font-size: 26rpx;
		line-height: 1.6;
		color: red;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		text-decoration: underline;
		/* 可选：设置下划线颜色 */
		text-decoration-color: red;
		font-style: italic;
	}

	.buttonstyle_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-top: 40px;
		margin-left: 20px;
		margin-right: 20px;
		background: red;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
	}

	.app-manage-tips {
		margin: 0 20px 20px;
		background: white;
		padding: 15px;
		border-radius: 15px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.watch-upgrade-permission-tip {
		font-size: 14px;
		line-height: 1.6;
		color: #e53935;
		margin: 12px 5px 8px;
		text-decoration: underline;
		/* 可选：设置下划线颜色 */
		text-decoration-color: #ff0000;
		font-style: italic;
	}

	.tip-text {
		font-size: 14px;
		line-height: 1.6;
		color: #666;
		margin-top: 10px;
	}

	.tip-after-jump {
		margin-top: 16px;
	}

	.app-link-list {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
	}

	.app-link-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 8px;
	}

	.app-setting-link-text {
		color: #007aff;
		font-size: 14px;
		margin-left: 10px;
		text-decoration: underline;
		/* 可选：设置下划线颜色 */
		text-decoration-color: #007aff;
		font-style: italic;
	}

	.link-icon-anim {
		display: inline-block;
		font-size: 18px;
		line-height: 1;
		margin-right: 8rpx;
	}

	/* 👉 左右指向动效 */
	.icon-point {
		animation: link-point-bounce 1.2s ease-in-out infinite;
	}

	/* ⚙️ 旋转动效 */
	.icon-gear {
		animation: link-gear-spin 2.5s linear infinite;
	}

	@keyframes link-point-bounce {

		0%,
		100% {
			transform: translateX(0) scale(1);
		}

		50% {
			transform: translateX(12rpx) scale(1.08);
		}
	}

	@keyframes link-gear-spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.example-popup {
		width: 88vw;
		max-height: 80vh;
		background: #fff;
		border-radius: 16px;
		padding: 16px;
		display: flex;
		flex-direction: column;
	}

	.example-popup-title {
		font-size: 16px;
		font-weight: 600;
		text-align: center;
		margin-bottom: 12px;
		color: #333;
	}

	.example-scroll {
		max-height: 62vh;
	}

	.example-group {
		margin-bottom: 8px;
	}

	.example-group-title {
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
		margin: 12px 0 8px;
	}

	.example-item {
		margin-bottom: 16px;
	}

	.example-img {
		width: 100%;
		border-radius: 8px;
	}

	.example-caption {
		margin-top: 8px;
		font-size: 13px;
		line-height: 1.5;
		color: #666;
	}

	.example-close-btn {
		margin-top: 8px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 44px;
		line-height: 44px;
		background: #3298F7;
		color: #fff;
		font-size: 15px;
		border-radius: 22px;
	}

	.path-tip {
		margin: 20px;
		color: red;
		font-size: 14px;
		line-height: 1.6;
		background: white;
		padding: 15px;
		border-radius: 15px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		text-decoration: underline;
		/* 可选：设置下划线颜色 */
		text-decoration-color: #ff0000;
		font-style: italic;
		white-space: pre-line;
	}
</style>