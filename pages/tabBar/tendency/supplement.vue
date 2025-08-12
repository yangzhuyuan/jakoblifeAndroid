<template>
	<view class="pagestyle">
		<view class="title_text">{{$t('相关信息')}}</view>
		<view class="bt_BG">
			<view class="text">{{$t('报告日期')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker fields="day" mode="date" :value="profDate" @change="bindDateChange">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor(profDate)">{{profDate}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('监测时间')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker :value="index1" @change="Monitoring" :range="array1">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor1(index1)">{{array1[index1]}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('起床时间')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker fields="month" mode="time" :value="time" @change="bindTimeChange">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor(time)">{{time}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('就寝时间')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker fields="month" mode="time" :value="time1" @change="bindTimeChange_1">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor(time1)">{{time1}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('是否午休')}}</view>
			<view
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
				<view class="select_bg" :style="getStatusColor(select)" @click="select_click(0)">
					{{select}}
				</view>
				<uni-icons type="bottom" size="20" style="margin-right: 20px;" @click="select_click(0)"></uni-icons>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('午休时长')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker :value="index" @change="bindTimeChange_2" :range="array">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor1(index)">{{array[index]}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text_1">{{$t('是否服用药物')}}</view>
			<view
				style="width: 40vw; display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
				<view class="select_bg" :style="getStatusColor(select2)" @click="select_click(2)">
					{{select2}}
				</view>
				<uni-icons type="bottom" size="20" style="margin-right: 20px;" @click="select_click(2)"></uni-icons>
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
		<view class="bt_BG">
			<view class="text_1">{{$t('工作是否倒班')}}</view>
			<view
				style="width: 50vw; display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
				<view class="select_bg" :style="getStatusColor(select4)" @click="select_click(4)">
					{{select4}}
				</view>
				<uni-icons type="bottom" size="20" style="margin-right: 20px;" @click="select_click(4)"></uni-icons>
			</view>
		</view>
		<view class="butoonstyles">
			<button class="buttonstyle_1" @click="skilp()">{{$t('跳过')}}</button>
			<button class="buttonstyle_2" @click="btn_tuesss()">{{$t('确认')}}</button>
		</view>
		<view class="titlestyle">
			<uni-icons @click="back()" type="left" size="20"
				style="color: white;margin-left: 20px;margin-top: 30px;"></uni-icons>
			<view class="titlestyle_1">{{$t('信息补充')}}</view>
			<view style="margin-right: 20px;margin-top: 30px;"></view>
		</view>

		<view style="width: 100vw;">
			<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="select_text" @click="sex_yes()">{{$t('是')}}</view>
					<view style="border-top: 1px solid gainsboro;"></view>
					<view class="select_text" @click="sex_no()">{{$t('否')}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				select: uni.getStorageSync("select") !== "" ? uni.getStorageSync("select") : this.$t('请选择'),
				select2: uni.getStorageSync("select2") !== "" ? uni.getStorageSync("select2") : this.$t('请选择'),
				select3: uni.getStorageSync("select3") !== "" ? uni.getStorageSync("select3") : this.$t('请选择'),
				select4: uni.getStorageSync("select4") !== "" ? uni.getStorageSync("select4") : this.$t('请选择'),
			}
		},



		methods: {


			getCurrentTime() {
				const now = new Date(); // 获取当前时间
				// 获取年、月、日
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要加 1
				const day = String(now.getDate()).padStart(2, "0");
				// 获取小时、分钟、秒
				const hours = String(now.getHours()).padStart(2, "0");
				const minutes = String(now.getMinutes()).padStart(2, "0");
				const seconds = String(now.getSeconds()).padStart(2, "0");
				return `${year}-${month}-${day}`
			},


			back() {
				uni.navigateBack()
			},
			getStatusColor(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === this.$t('请选择') ? 'gray' : 'black'
				};
			},
			getStatusColor1(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === 0 ? 'gray' : 'black'
				};
			},
			bindDateChange(e) {
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
					uni.navigateTo({
						url: '../../tabBar/tendency/Report?profDate=' + this.profDate + "&time=" + this.time +
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
		height: 100vh;
		background: #EFEFF4;
	}

	.titlestyle {
		position: fixed;
		top: 0;
		width: 100vw;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #3298F7;
		height: 83px;
	}

	.titlestyle_1 {
		margin-top: 30px;
		color: white;
		font-size: 17px;
		font-weight: 500;
	}

	.title_text {
		padding-top: 108px;
		margin-left: 24px;
		margin-right: 24px;
		color: #999999;
		font-size: 12px;
	}

	.bt_BG {
		width: auto;
		height: 54px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		margin-left: 20px;
		margin-right: 20px;
		margin-top: 20px;
		background: white;
		border-radius: 50px;
	}

	.text {
		width: 40vw;
		font-size: 16px;
		margin-left: 20px;
		font-weight: 400;
	}

	.text_1 {
		width: 70vw;
		font-size: 16px;
		margin-left: 20px;
		font-weight: 400;
	}


	.select_bg {
		width: 100vw;
		text-align: right;
		margin-right: 15px;
		font-size: 16px;
	}

	.date_bg {
		text-align: center;
		font-size: 16px;
	}

	.select_text {
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.popup_bg {
		padding: 20px;
		width: 50vw;
		margin-left: 20px;
		margin-right: 20px;
		background: white;
		border-radius: 20px;
	}

	.butoonstyles {
		margin-top: 60px;
		margin-left: 20px;
		margin-right: 20px;
		padding-bottom: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.buttonstyle_1 {
		width: 108px;
		height: 48px;
		border-radius: 100px;
		color: white;
		background: #3298F7;
	}

	.buttonstyle_2 {
		width: 108px;
		height: 48px;
		color: white;
		border-radius: 100px;
		background: #3298F7;
	}
</style>