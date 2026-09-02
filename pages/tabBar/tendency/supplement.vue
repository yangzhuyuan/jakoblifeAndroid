<template>
	<view class="pagestyle">
		<view class="page-body">
			<view class="tip-box">
				<image class="tip-icon" src="/static/image/app_icon_all.jpg" mode="aspectFit"></image>
				<view class="title_text">{{$t('相关信息')}}</view>
			</view>
			<view class="form-card">
				<view class="bt_BG">
					<view class="text">{{$t('报告日期')}}</view>
					<view class="uni-list-cell-db row-right">
						<picker fields="day" mode="date" :value="profDate" @change="bindDateChange">
							<view class="picker-inner">
								<view class="date_bg" :style="getStatusColor(profDate)">{{profDate}}</view>
								<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="row-line"></view>
				<view class="bt_BG">
					<view class="text">{{$t('监测时间')}}</view>
					<view class="uni-list-cell-db row-right">
						<picker :value="index1" @change="Monitoring" :range="array1">
							<view class="picker-inner">
								<view class="date_bg" :style="getStatusColor1(index1)">{{array1[index1]}}</view>
								<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="row-line"></view>
				<view class="bt_BG">
					<view class="text">{{$t('起床时间')}}</view>
					<view class="uni-list-cell-db row-right">
						<picker fields="month" mode="time" :value="time" @change="bindTimeChange">
							<view class="picker-inner">
								<view class="date_bg" :style="getStatusColor(time)">{{time}}</view>
								<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="row-line"></view>
				<view class="bt_BG">
					<view class="text">{{$t('就寝时间')}}</view>
					<view class="uni-list-cell-db row-right">
						<picker fields="month" mode="time" :value="time1" @change="bindTimeChange_1">
							<view class="picker-inner">
								<view class="date_bg" :style="getStatusColor(time1)">{{time1}}</view>
								<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="row-line"></view>
				<view class="bt_BG">
					<view class="text">{{$t('是否午休')}}</view>
					<view class="row-right row-right-align">
						<view class="select_bg" :style="getStatusColor(select)" @click="select_click(0)">
							{{select}}
						</view>
						<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"
							@click="select_click(0)"></uni-icons>
					</view>
				</view>
				<view class="row-line"></view>
				<view class="bt_BG">
					<view class="text">{{$t('午休时长')}}</view>
					<view class="uni-list-cell-db row-right">
						<picker :value="index" @change="bindTimeChange_2" :range="array">
							<view class="picker-inner">
								<view class="date_bg" :style="getStatusColor1(index)">{{array[index]}}</view>
								<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
				<view class="row-line"></view>
				<view class="bt_BG">
					<view class="text_1">{{$t('是否服用药物')}}</view>
					<view class="row-right row-right-align">
						<view class="select_bg" :style="getStatusColor(select2)" @click="select_click(2)">
							{{select2}}
						</view>
						<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"
							@click="select_click(2)"></uni-icons>
					</view>
				</view>
				<!-- <view class="bt_BG">
					<view class="text">{{$t('当前用药')}}</view>
					<view
						style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
						<view class="select_bg" :style="getStatusColor(select3)" @click="select_click(3)">
							{{select3}}
						</view>
						<uni-icons type="bottom" size="20" style="margin-right: 20px;" @click="select_click(3)"></uni-icons>
					</view>
				</view> -->
				<view class="row-line"></view>
				<view class="bt_BG">
					<view class="text_1">{{$t('工作是否倒班')}}</view>
					<view class="row-right row-right-align">
						<view class="select_bg" :style="getStatusColor(select4)" @click="select_click(4)">
							{{select4}}
						</view>
						<uni-icons class="picker-icon" type="bottom" size="14" color="#C5CDD8"
							@click="select_click(4)"></uni-icons>
					</view>
				</view>
			</view>

			<view class="butoonstyles">
				<button class="buttonstyle_1" @click="skilp()">{{$t('跳过')}}</button>
				<button class="buttonstyle_2" @click="btn_tuesss()">{{$t('确认')}}</button>
			</view>
		</view>

		<view class="popup-wrap">
			<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="select_text" @click="sex_yes()">{{$t('是')}}</view>
					<view class="popup-line"></view>
					<view class="select_text" @click="sex_no()">{{$t('否')}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		getLocalTimeAllJSON,
		resolveChinaReportDateFromLocal
	} from '@/pages/api/unitls/timezone.js'

	export default {
		data() {
			return {
				// 界面展示：手机本地日期
				profDate: this.getCurrentTime(),
				time: uni.getStorageSync("bindTimeChange") !== '' ? uni.getStorageSync("bindTimeChange") : this.$t(
					'请选择'),
				time1: uni.getStorageSync("bindTimeChange_1") !== '' ? uni.getStorageSync("bindTimeChange_1") : this.$t(
					'请选择'),
				array: [this.$t('请选择'), this.$t('分钟30'), this.$t('分钟60'), this.$t('分钟90'),
					this.$t('分钟120'), this.$t('小时以上2')
				],
				index: uni.getStorageSync("bindTimeChange_2") !== "" ? uni.getStorageSync("bindTimeChange_2") : 0,
				array1: [this.$t('请选择'), this.$t('监测时间在1天之内'), this.$t('监测时间在2天之内'), this.$t('监测时间在3天之内'), this.$t(
					'监测时间在4天之内'), this.$t('监测时间在5天之内'), this.$t('监测时间在6天之内'), this.$t('监测时间在当周之内'), this.$t(
					'监测时间在前2周之内'), this.$t('监测时间在前3周之内'), this.$t('监测时间在当月之内'), this.$t('监测时间在前2月之内'), this.$t(
					'监测时间在前3月之内')],
				index1: uni.getStorageSync("Monitoring") !== "" ? uni.getStorageSync("Monitoring") : 0,
				selectID: '',
				select: this.getSelectValue("select"),
				select2: this.getSelectValue("select2"),
				select3: this.getSelectValue("select3"),
				select4: this.getSelectValue("select4"),
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('信息补充')
			})
		},

		methods: {

			getSelectValue(key, defaultText = '请选择') {
				const value = uni.getStorageSync(key);
				if (!value || value === "") {
					return this.$t(defaultText);
				}
				// 判断是否为"是/Yes"
				const isYes = value === "是" || value === "Yes";
				// 返回对应的翻译
				const translateKey = isYes ? "是" : "否";
				return this.$t(translateKey);
			},
			getCurrentTime() {
				// 报告日期展示用手机本地日历日
				return getLocalTimeAllJSON().YMD
			},
			/** 跳转下一页时的报告日：本地展示 → 中国时区（含凌晨 1 点门槛） */
			getProfDateForNextPage() {
				return resolveChinaReportDateFromLocal(this.profDate)
			},

			back() {
				uni.navigateBack()
			},
			getStatusColor(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === this.$t('请选择') ? '#9ba3af' : '#1a2b4a'
				};
			},
			getStatusColor1(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === 0 ? '#9ba3af' : '#1a2b4a'
				};
			},
			bindDateChange(e) {
				// picker 仍按本地日期写入，展示不变
				this.profDate = e.detail.value
			},
			bindTimeChange(e) {
				console.log(e)
				this.time = e.detail.value
				uni.setStorageSync("bindTimeChange", this.time)
			},
			bindTimeChange_1(e) {
				this.time1 = e.detail.value
				uni.setStorageSync("bindTimeChange_1", this.time1)
			},
			bindTimeChange_2(e) {
				this.index = e.detail.value
				uni.setStorageSync("bindTimeChange_2", this.index)
			},
			Monitoring(e) {
				this.index1 = e.detail.value
				uni.setStorageSync("Monitoring", this.index1)
			},


			select_click(id) {
				this.$refs.popup.open("center")
				this.selectID = id
			},

			sex_yes() {
				this.$refs.popup.close()
				if (this.selectID === 0) {
					this.select = this.$t("是")
					uni.setStorageSync("select", this.select)
				} else if (this.selectID === 2) {
					this.select2 = this.$t("是")
					uni.setStorageSync("select2", this.select2)
				} else if (this.selectID === 3) {
					this.select3 = this.$t("是")
					uni.setStorageSync("select3", this.select3)
				} else if (this.selectID === 4) {
					this.select4 = this.$t("是")
					uni.setStorageSync("select4", this.select4)
				}
			},
			sex_no() {
				this.$refs.popup.close()
				if (this.selectID === 0) {
					this.select = this.$t("否")
					uni.setStorageSync("select", this.select)
				} else if (this.selectID === 2) {
					this.select2 = this.$t("否")
					uni.setStorageSync("select2", this.select2)
				} else if (this.selectID === 3) {
					this.select3 = this.$t("否")
					uni.setStorageSync("select2", this.select3)
				} else if (this.selectID === 4) {
					this.select4 = this.$t("否")
					uni.setStorageSync("select4", this.select4)
				}
			},

			skilp() {
				// uni.navigateTo({
				// 	url: "/pages/tabBar/tendency/Report"
				// })
				uni.navigateBack()
			},
			btn_tuesss() {
				if (this.profDate === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择报告日期'),
						icon: 'none'
					})
					return
				} else if (this.index1 === 0) {
					uni.showToast({
						title: this.$t('请选择监测时间'),
						icon: 'none'
					})
					return
				} else if (this.time === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择起床时间'),
						icon: 'none'
					})
					return
				} else if (this.time1 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择就寝时间'),
						icon: 'none'
					})
					return
				} else if (this.select === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择是否午休'),
						icon: 'none'
					})
					return
				} else if (this.index === 0) {
					uni.showToast({
						title: this.$t('请选择午休时长'),
						icon: 'none'
					})
					return
				} else if (this.select2 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择是否服用药物'),
						icon: 'none'
					})
					return
					// } else if (this.select3 === this.$t('请选择')) {
					// 	uni.showToast({
					// 		title: this.$t('请选择当前用药'),
					// 		icon: 'none'
					// 	})
					// 	return
				} else if (this.select4 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择工作是否倒班'),
						icon: 'none'
					})
					return
				} else {
					const profDateForNext = this.getProfDateForNextPage()
					uni.navigateTo({
						url: '../../tabBar/tendency/Report?profDate=' + profDateForNext + "&time=" + this.time +
							"&time1=" +
							this.time1 + "&select=" + this.select + "&index=" + this.index + "&select2=" + this
							.select2 + "&select4=" + this.select4 + "&index1=" + this.index1
						// + "&select3=" + this.select3
					})
				}
			}
		}
	}
</script>

<style>
	.pagestyle {
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #eef6fc 40%, #f4f7fb 100%);
		color: #1a2b4a;
		box-sizing: border-box;
	}

	.page-body {
		padding: 16px 16px 40px;
		box-sizing: border-box;
	}

	.tip-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 14px 16px;
		background: linear-gradient(90deg, #ffffff 0%, #eef3f8 45%, #e2eaf2 100%);
		border: 1px solid #dce4ec;
		border-radius: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		margin-bottom: 16px;
	}

	.tip-icon {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		flex-shrink: 0;
		margin-right: 12px;
		object-fit: contain;
		background: transparent;
	}

	.title_text {
		flex: 1;
		min-width: 0;
		color: #6b7c93;
		font-size: 13px;
		font-weight: 500;
		line-height: 1.55;
	}

	.form-card {
		background: #ffffff;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		padding: 4px 0;
	}

	.bt_BG {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		min-height: 52px;
		padding: 12px 16px;
		box-sizing: border-box;
		background: transparent;
		margin: 0;
		border-radius: 0;
		box-shadow: none;
	}

	.row-line {
		height: 1px;
		background: #eef1f5;
		margin: 0 16px;
	}

	.text {
		flex-shrink: 0;
		font-size: 15px;
		font-weight: 600;
		color: #1a2b4a;
		margin-left: 0;
		width: auto;
		max-width: 38%;
	}

	.text_1 {
		flex-shrink: 0;
		font-size: 15px;
		font-weight: 600;
		color: #1a2b4a;
		margin-left: 0;
		width: auto;
		max-width: 48%;
	}

	.row-right {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		flex-direction: row;
		margin-left: 12px;
		min-width: 0;
	}

	.row-right-align {
		align-items: center;
	}

	.picker-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.picker-icon {
		margin-left: 6px;
		flex-shrink: 0;
	}

	.select_bg {
		flex: 1;
		text-align: right;
		font-size: 14px;
		color: #1a2b4a;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.date_bg {
		text-align: right;
		font-size: 14px;
		color: #1a2b4a;
		max-width: 52vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.select_text {
		text-align: center;
		padding: 14px 10px;
		font-size: 16px;
		font-weight: 600;
		color: #3298F7;
	}

	.popup-wrap {
		width: 100vw;
	}

	.popup_bg {
		padding: 8px 0;
		width: 56vw;
		margin-left: 20px;
		margin-right: 20px;
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(26, 43, 74, 0.12);
	}

	.popup-line {
		height: 1px;
		background: #eef1f5;
	}

	.butoonstyles {
		margin-top: 36px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		padding-bottom: 40px;
	}

	.buttonstyle_1 {
		width: 130px;
		height: 48px;
		line-height: 48px;
		border-radius: 100px;
		color: #3298F7;
		background: #ffffff;
		border: 1.5px solid #3298F7;
		font-size: 16px;
		font-weight: 600;
		box-shadow: 0 2px 10px rgba(50, 152, 247, 0.12);
		margin: 0 10px;
	}

	.buttonstyle_1::after {
		border: none;
	}

	.buttonstyle_2 {
		width: 130px;
		height: 48px;
		line-height: 48px;
		color: #ffffff;
		border-radius: 100px;
		background: #3298F7;
		font-size: 16px;
		font-weight: 600;
		box-shadow: 0 4px 14px rgba(50, 152, 247, 0.35);
		border: none;
		margin: 0 10px;
	}

	.buttonstyle_2::after {
		border: none;
	}

	.buttonstyle_1:active,
	.buttonstyle_2:active {
		opacity: 0.9;
		transform: scale(0.98);
	}

	.sleep-card {
		padding: 10px;
		margin-bottom: 20px;
		font-size: 14px;
		font-weight: 600;
		color: #3298f7;
	}

	.sleep-title {
		margin-bottom: 6px;
	}

	.sleep-line {
		color: #040000;
		font-weight: 600;
		font-size: 10px;
		margin-top: 4px;
	}
</style>