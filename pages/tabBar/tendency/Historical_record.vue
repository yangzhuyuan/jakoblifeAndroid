<template>
	<view class="container">
		<!-- 顶部导航 -->
		<view class="navbar">
			<view class="navbar-left" @click="back">
				<uni-icons type="left" size="24" color="black"></uni-icons>
			</view>
			<view class="navbar-title">{{ $t("历史记录") }}</view>
			<view class="nav-switch">
				<view class="switch-item" :class="{active: isCalendarView}" @click="switchView('calendar')">
					{{ $t("日历") }}
				</view>
				<view class="switch-item" :class="{active: isListView}" @click="switchView('list')">
					{{ $t("列表") }}
				</view>
			</view>
		</view>

		<!-- 功能切换 -->
		<view class="swiper-container">
			<liu-goods-swiper :goodsList="goodsList" @clickItem="chooseItem"></liu-goods-swiper>
		</view>

		<!-- 日期选择 -->
		<view class="date-container">
			<week-fold-calendar v-if="isCalendarView" @change="onDateChange" allow-future default-view-type="week" />
			<view v-else class="month-selector">
				<view class="date-help" @click="showHelp">{{$t("帮助")}}</view>
				<view class="date-controls">
					<uni-icons type="left" size="22" @click="prevMonth"></uni-icons>
					<view class="date-label">{{ currentMonth }}</view>
					<uni-icons type="right" size="22" @click="nextMonth"></uni-icons>
				</view>
				<view class="date-export" @click="exportData">{{$t('导出')}}</view>
			</view>
		</view>

		<!-- 数据展示 -->
		<view class="content-area">
			<!-- 加载状态 -->
			<view v-if="loading" class="loading-container">
				<uni-load-more status="loading" :contentText="{contentrefresh: $t('加载中')}"></uni-load-more>
			</view>

			<!-- 有数据时的展示 -->
			<template v-else-if="hasData">
				<!-- 血压数据 -->
				<blood-pressure-list v-if="currentItemType === ITEM_TYPES.BLOOD_PRESSURE" :data="swipeList"
					:view-type="currentView" :blood-unit="bloodUnit" @delete-record="handleDeleteRecord"
					@toggle-expand="handleToggleExpand" @show-bmi-info="showBmiInfo" />

				<!-- 体脂数据 -->
				<body-fat-list v-else-if="currentItemType === ITEM_TYPES.BODY_FAT" :data="swipeList"
					:view-type="currentView" @delete-record="handleDeleteRecord" @toggle-expand="handleToggleExpand"
					@show-bmi-info="showBmiInfo" />

				<!-- 血氧数据 -->
				<blood-oxygen-list v-else-if="currentItemType === ITEM_TYPES.BLOOD_OXYGEN" :data="swipeList"
					:view-type="currentView" @delete-record="handleDeleteRecord" @toggle-expand="handleToggleExpand"
					@show-bmi-info="showOxygenInfo" />
			</template>

			<!-- 无数据状态 -->
			<view v-else class="no-data">
				<text>{{$t('暂无数据')}}</text>
				<button v-if="!deviceSn.length" class="bind-device-btn" @click="queryDevices">
					{{$t('重新加载设备')}}
				</button>
			</view>
		</view>

		<!-- 弹窗组件 -->
		<blood-pressure-popup ref="bloodPressurePopup" />
		<bmi-popup ref="bmiPopup" />
		<blood-oxygen-popup ref="bloodOxygenPopup" />
		<export-popup ref="exportPopup" @export="handleExport" />
	</view>
</template>

<script>
	import BloodPressureList from '../tendency/historecal/BloodPressureList.vue';
	import BloodPressurePopup from '../tendency/historecal/BloodPressurePopup.vue';
	import BodyFatList from '../tendency/historecal/BodyFatList.vue';
	import BloodOxygenList from '../tendency/historecal/BloodOxygenList.vue';
	import BmiPopup from '../tendency/historecal/BmiPopup.vue';
	import BloodOxygenPopup from '../tendency/historecal/BloodOxygenPopup.vue';
	import ExportPopup from '../tendency/historecal/ExportPopup.vue';

	export default {
		components: {
			BloodPressureList,
			BodyFatList,
			BloodOxygenList,
			BloodPressurePopup,
			BmiPopup,
			BloodOxygenPopup,
			ExportPopup
		},

		data() {
			const now = new Date();
			const year = now.getFullYear();
			const month = (now.getMonth() + 1).toString().padStart(2, '0');
			const day = now.getDate().toString().padStart(2, '0');
			const currentMonth = `${year}-${month}`;
			const today = `${year}-${month}-${day}`; // 本地日期，不是 UTC
			return {
				// 常量定义
				ITEM_TYPES: {
					BLOOD_PRESSURE: 'blood_pressure',
					BODY_FAT: 'body_fat',
					BLOOD_OXYGEN: 'blood_oxygen',
					ECG: 'ecg',
					BLOOD_SUGAR: 'blood_sugar'
				},

				// 状态管理
				currentItemType: 'blood_pressure', // 使用英文标识，避免国际化问题
				currentView: 'calendar',
				currentMonth: currentMonth,
				currentDate: today,

				// 数据状态
				loading: false,
				swipeList: [],
				deviceSn: [],

				// 配置
				goodsList: []
			}
		},

		computed: {
			// 计算属性优化
			isCalendarView() {
				return this.currentView === 'calendar';
			},

			isListView() {
				return this.currentView === 'list';
			},

			hasData() {
				return this.swipeList && this.swipeList.length > 0;
			},

			bloodUnit() {
				const stored = uni.getStorageSync("Blood");
				return (stored === 0 || stored === "" || stored === undefined) ? "mmHg" : "kPa";
			},

			// 当前时间范围
			currentDateRange() {
				if (this.isCalendarView) {
					return {
						start: `${this.currentDate} 00:00:00`,
						end: `${this.currentDate} 23:59:59`
					};
				} else {
					return this.getMonthDateRange(this.currentMonth);
				}
			},

			// 显示用的当前项目名称（国际化）
			currentItemDisplayName() {
				const nameMap = {
					[this.ITEM_TYPES.BLOOD_PRESSURE]: this.$t('血压'),
					[this.ITEM_TYPES.BODY_FAT]: this.$t('体脂'),
					[this.ITEM_TYPES.BLOOD_OXYGEN]: this.$t('血氧'),
					[this.ITEM_TYPES.ECG]: this.$t('心电'),
					[this.ITEM_TYPES.BLOOD_SUGAR]: this.$t('血糖')
				};
				return nameMap[this.currentItemType] || this.$t('血压');
			}
		},

		onLoad() {
			this.initGoodsList();
		},

		onShow() {
			this.initPage();
		},

		methods: {
			// 初始化商品列表（确保在onLoad中调用）
			initGoodsList() {
				this.goodsList = [{
						name: this.$t('血压'),
						type: this.ITEM_TYPES.BLOOD_PRESSURE
					},
					{
						name: this.$t('血氧'),
						type: this.ITEM_TYPES.BLOOD_OXYGEN
					},
					{
						name: this.$t('心电'),
						type: this.ITEM_TYPES.ECG
					},
					{
						name: this.$t('体脂'),
						type: this.ITEM_TYPES.BODY_FAT
					},
					{
						name: this.$t('血糖'),
						type: this.ITEM_TYPES.BLOOD_SUGAR
					}
				];
			},

			// 初始化页面
			async initPage() {
				uni.setNavigationBarTitle({
					title: this.$t('历史记录')
				});
				await this.queryDevices();
			},

			// 项目选择
			async chooseItem(e) {
				console.log("chooseItem", e.name);
				// 根据显示名称找到对应的类型
				const item = this.goodsList.find(goods => goods.name === e.name);
				if (item) {
					this.currentItemType = item.type;
				} else {
					this.currentItemType = this.ITEM_TYPES.BLOOD_PRESSURE;
				}

				console.log("当前项目类型:", this.currentItemType);

				const noDataItems = [
					this.ITEM_TYPES.ECG,
					this.ITEM_TYPES.BLOOD_SUGAR
				];

				if (noDataItems.includes(this.currentItemType)) {
					console.log("切换到无数据项目");
					this.swipeList = [];
					return;
				}

				await this.fetchData();
			},

			// 视图切换
			async switchView(viewType) {
				this.currentView = viewType;
				await this.fetchData();
			},

			// 日期变化
			async onDateChange(e) {
				this.currentDate = e.date;
				await this.fetchData();
			},

			// 月份导航
			async prevMonth() {
				this.currentMonth = this.getPrevMonth(this.currentMonth);
				await this.fetchData();
			},

			async nextMonth() {
				this.currentMonth = this.getNextMonth(this.currentMonth);
				await this.fetchData();
			},

			// 数据获取
			async fetchData() {
				if (!this.deviceSn.length) {
					console.log("没有设备信息，无法获取数据");
					this.swipeList = [];
					return;
				}

				this.loading = true;
				try {
					const {
						start,
						end
					} = this.currentDateRange;
					switch (this.currentItemType) {
						case this.ITEM_TYPES.BLOOD_PRESSURE:
							await this.queryBloodPressureData(this.deviceSn, start, end);
							break;
						case this.ITEM_TYPES.BLOOD_OXYGEN:
							await this.queryOxygenData(this.deviceSn, start, end);
							break;
						case this.ITEM_TYPES.BODY_FAT:
							await this.queryBodyFatData(this.deviceSn, start, end);
							break;
						default:
							this.swipeList = [];
							break;
					}
				} catch (error) {
					console.error('数据获取失败:', error);
					uni.showToast({
						title: this.$t('数据获取失败'),
						icon: 'none'
					});
					this.swipeList = [];
				} finally {
					this.loading = false;
				}
			},

			// 查询设备
			async queryDevices() {
				this.loading = true;
				try {
					const res = await this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
						'Authorization': 'Bearer ' + uni.getStorageSync("token")
					});
					if (res.code === 200 && res.rows && res.rows.length > 0) {
						this.deviceSn = [];
						this.deviceSn.push(uni.getStorageSync("userid"))
						// this.deviceSn = res.rows.map(item => item.deviceSn);
						await this.fetchData();
					} else {
						this.deviceSn = [];
						this.deviceSn.push(uni.getStorageSync("userid"))
						this.swipeList = [];
						// uni.showToast({
						// 	title: this.$t('当前未绑定任何设备'),
						// 	icon: 'none'
						// });
						await this.fetchData();
					}
				} catch (error) {
					console.error('设备查询失败:', error);
					this.deviceSn = [];
					this.deviceSn.push(uni.getStorageSync("userid"))
					this.swipeList = [];
					await this.fetchData();
				} finally {
					this.loading = false;
				}
			},

			// 血压数据查询
			async queryBloodPressureData(deviceSn, startTime, endTime) {
				const data = {
					deviceSn,
					dataType: "pressure",
					slaveList: [{
							slaveSn: "0",
							register: "highPressure"
						},
						{
							slaveSn: "0",
							register: "lowPressure"
						},
						{
							slaveSn: "0",
							register: "heartrate"
						}
					],
					startTime,
					endTime,
				};
				const res = await this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				});
				if (res.code === 200) {
					this.processBloodPressureData(res.data || []);
				} else {
					throw new Error(res.msg || '血压数据查询失败');
				}
			},
			// 血氧数据查询
			async queryOxygenData(deviceSn, startTime, endTime) {
				const data = {
					deviceSn,
					dataType: "pressure",
					slaveList: [{
						slaveSn: "0",
						register: "oxygen"
					}],
					startTime,
					endTime,
				};
				console.log("【原始血氧数据传参】" + this.$url_APP_IP, data);
				const res = await this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				});
				console.log("【原始血氧数据】:", res);
				if (res.code === 200) {
					this.processBloodOxygenData(res.data || []);
				} else {
					throw new Error(res.msg || '血氧数据查询失败');
				}
			},

			// 体脂数据查询
			async queryBodyFatData(deviceSn, startTime, endTime) {
				const data = {
					deviceSn,
					dataType: "weight",
					slaveList: [{
						slaveSn: "0",
						register: "weight"
					}],
					startTime,
					endTime,
				};
				const res = await this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token")
				});
				if (res.code === 200) {
					this.processBodyFatData(res.data || []);
				} else {
					throw new Error(res.msg || '体脂数据查询失败');
				}
			},

			// 处理血压数据
			processBloodPressureData(data) {
				if (!data || data.length === 0) {
					this.swipeList = [];
					return;
				}
				this.swipeList = data.map(item => ({
					...item,
					object: {
						...item.object,
						summary: this.calculateBloodPressureLevel(item.object.summary),
						details: (item.object.details || []).map(detail =>
							this.calculateBloodPressureLevel(detail, true)
						)
					}
				}));
			},

			getOxygenValue(data) {
				if (!data) return null;
				const value = data.oxygen ?? data.Oxygen ?? data.spo2 ?? data.SpO2 ?? data.oxygenAvg;
				return value == null || value === '' ? null : value;
			},

			normalizeOxygenSummary(summary, details) {
				const avg = this.getOxygenValue(summary);
				if (avg != null) {
					return {
						...summary,
						oxygenAvg: avg
					};
				}
				if (!details || !details.length) {
					return summary;
				}
				const values = details.map(detail => Number(this.getOxygenValue(detail)))
					.filter(value => !Number.isNaN(value));
				if (!values.length) {
					return summary;
				}
				const oxygenAvg = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
				return {
					...summary,
					oxygenAvg
				};
			},

			// 处理血氧数据
			processBloodOxygenData(data) {
				console.log("【原始血氧数据】", data);
				if (!data || data.length === 0) {
					this.swipeList = [];
					return;
				}
				this.swipeList = data.map(item => {
					const details = (item.object?.details || []).map(detail =>
						this.calculateBloodOxygenLevel(detail, true)
					);
					const summary = this.calculateBloodOxygenLevel(
						this.normalizeOxygenSummary(item.object?.summary || {}, details)
					);
					return {
						...item,
						object: {
							...item.object,
							summary,
							details
						}
					};
				});
			},

			// 处理体脂数据
			processBodyFatData(data) {
				console.log("原始体脂数据:", data);

				if (!data || data.length === 0) {
					this.swipeList = [];
					return;
				}

				this.swipeList = data.map(item => ({
					...item,
					object: {
						...item.object,
						summary: this.calculateBodyFatLevel(item.object.summary),
						details: (item.object.details || []).map(detail =>
							this.calculateBodyFatLevel(detail, true)
						)
					}
				}));
			},

			// 计算血压等级
			calculateBloodPressureLevel(data, isDetail = false) {
				if (!data) return isDetail ? {
					level2: this.$t("未知"),
					xueyalist1: 4
				} : {
					level: this.$t("未知"),
					xueyalist: 4
				};

				const low = isDetail ? data.lowPressure : data.lowPressureAvg;
				const high = isDetail ? data.highPressure : data.highPressureAvg;

				let level, xueyalist;

				if ((low >= 61 && low <= 80) && (high >= 91 && high <= 120)) {
					level = this.$t("正常血压");
					xueyalist = 0;
				} else if ((low >= 81 && low <= 90) || (high >= 121 && high <= 140)) {
					level = this.$t("正常高血压值");
					xueyalist = 1;
				} else if ((low >= 91 && low <= 100) || (high >= 141 && high <= 160)) {
					level = this.$t("一级高血压");
					xueyalist = 2;
				} else if ((low >= 101 && low <= 110) || (high >= 161 && high <= 180)) {
					level = this.$t("二级高血压");
					xueyalist = 3;
				} else {
					level = this.$t("未知");
					xueyalist = 4;
				}

				return isDetail ? {
					...data,
					level2: level,
					xueyalist1: xueyalist
				} : {
					...data,
					level,
					xueyalist,
					expanded: false
				};
			},

			// 计算血氧等级
			calculateBloodOxygenLevel(data, isDetail = false) {
				if (!data) return isDetail ? {
					level2: this.$t("未知"),
					oxygenlist1: 3
				} : {
					level: this.$t("未知"),
					oxygenlist: 3
				};

				const oxygen = isDetail ? this.getOxygenValue(data) : (data.oxygenAvg ?? this.getOxygenValue(data));
				const val = parseInt(oxygen);
				let level, oxygenlist;

				if (Number.isNaN(val)) {
					level = this.$t("未知");
					oxygenlist = 3;
				} else if (val <= 95) {
					level = this.$t('偏低');
					oxygenlist = 0;
				} else if (val < 98) {
					level = this.$t('正常');
					oxygenlist = 1;
				} else {
					level = this.$t('偏高');
					oxygenlist = 2;
				}

				return isDetail ? {
					...data,
					oxygen,
					level2: level,
					oxygenlist1: oxygenlist
				} : {
					...data,
					oxygenAvg: oxygen,
					level,
					oxygenlist,
					expanded: false
				};
			},

			// 计算体脂等级
			calculateBodyFatLevel(data, isDetail = false) {
				if (!data) return isDetail ? {
					level1: this.$t("未知"),
					tizhilists1: 6
				} : {
					level: this.$t("未知"),
					tizhilists: 6
				};

				const bmi = isDetail ? data.bmi : data.bmiAvg;

				let level, tizhilists;

				if (bmi < 18.5) {
					level = this.$t("体重过轻");
					tizhilists = 0;
				} else if (bmi >= 18.5 && bmi <= 24.9) {
					level = this.$t("正常体重");
					tizhilists = 1;
				} else if (bmi >= 25.0 && bmi <= 29.9) {
					level = this.$t("超重");
					tizhilists = 2;
				} else if (bmi >= 30.0 && bmi <= 34.9) {
					level = this.$t("一级肥胖");
					tizhilists = 3;
				} else if (bmi >= 35.0 && bmi <= 39.9) {
					level = this.$t("二级肥胖");
					tizhilists = 4;
				} else if (bmi >= 40) {
					level = this.$t("三级肥胖或病态肥胖");
					tizhilists = 5;
				} else {
					level = this.$t("未知");
					tizhilists = 6;
				}

				return isDetail ? {
					...data,
					level1: level,
					tizhilists1: tizhilists
				} : {
					...data,
					level,
					tizhilists,
					expanded: false
				};
			},

			// 工具方法
			getMonthDateRange(yearMonth) {
				const [year, month] = yearMonth.split('-').map(Number);
				const endOfMonth = new Date(year, month, 0).getDate();

				return {
					start: `${yearMonth}-01 00:00:00`,
					end: `${yearMonth}-${endOfMonth} 23:59:59`
				};
			},

			getPrevMonth(currentMonth) {
				const [year, month] = currentMonth.split('-').map(Number);
				const prevMonth = month === 1 ? 12 : month - 1;
				const prevYear = month === 1 ? year - 1 : year;

				return `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
			},

			getNextMonth(currentMonth) {
				const [year, month] = currentMonth.split('-').map(Number);
				const nextMonth = month === 12 ? 1 : month + 1;
				const nextYear = month === 12 ? year + 1 : year;

				return `${nextYear}-${nextMonth.toString().padStart(2, '0')}`;
			},

			// 事件处理
			back() {
				uni.navigateBack();
			},

			showHelp() {
				uni.showModal({
					title: this.$t('帮助'),
					content: this.$t('这里是使用帮助信息'),
					showCancel: false
				});
			},

			exportData() {
				this.$refs.exportPopup.open();
			},

			async handleExport(exportConfig) {
				try {
					console.log("导出配置:", exportConfig);
					if (exportConfig.format === "pdf") {
						uni.navigateTo({
							url: '../tendency/yulan?chooseItem_name=' + this.currentItemType + "&starttime=" +
								exportConfig.startDate + "&endtime=" + exportConfig.endDate + "&deviceSn=" +
								this
								.deviceSn
						})
					} else {
						if (this.currentItemType === "血压" || this.currentItemType === "blood_pressure") {
							this.query_log_v2s(this.deviceSn, exportConfig.startDate, exportConfig.endDate)
						} else if (this.currentItemType === this.ITEM_TYPES.BLOOD_OXYGEN) {
							this.query_log_v23s(this.deviceSn, exportConfig.startDate, exportConfig.endDate)
						} else if (this.currentItemType == "体脂" || this.currentItemType == "body_fat") {
							this.query_log_v22s(this.deviceSn, exportConfig.startDate, exportConfig.endDate)
						}
					}
					// 实现导出逻辑
				} catch (error) {
					console.error('导出失败:', error);
				}
			},

			query_log_v2s(deviceSn, startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						dataType: "pressure",
						slaveList: [{
								slaveSn: "0",
								register: "highPressure"
							},
							{
								slaveSn: "0",
								register: "lowPressure"
							},
							{
								slaveSn: "0",
								register: "heartrate"
							}
						],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList1111 = []
							res.data.data.forEach((item, index) => {
								res.data.data[index].object.details.forEach((item1, index1) => {
									res.data.data[index]
										.object.details[index1].dateTime = res.data
										.data[index].dateTime
									res.data.data[index]
										.object.details[index1].modelName = res.data
										.data[index].modelName
									res.data.data[index]
										.object.details[index1].deviceSn = res.data
										.data[index].deviceSn
									res.data.data[index]
										.object.details[index1].highPressureAvg = res.data
										.data[index].object
										.summary.highPressureAvg
									res.data.data[index]
										.object.details[index1].lowPressureAvg = res
										.data.data[index].object
										.summary.lowPressureAvg
									res.data.data[index]
										.object.details[index1].heartrateAvg = res.data
										.data[
											index].object
										.summary.heartrateAvg
									res.data.data[index].object
										.details[index1].time1 = res.data.data[index]
										.object
										.details[index1].time
									res.data.data[index]
										.object.details[index1].highPressure1 = res.data
										.data[
											index]
										.object.details[index1].highPressure
									res.data.data[index]
										.object.details[index1].lowPressure1 = res.data
										.data[
											index]
										.object.details[index1].lowPressure
									res.data.data[index]
										.object.details[index1].heartrate1 = res.data.data[
											index]
										.object.details[index1].heartrate

									that.$delete(res.data.data[index].object.details[
											index1],
										"lowPressure")
									that.$delete(res.data.data[index].object.details[
											index1],
										"heartrate")
									that.$delete(res.data.data[index].object.details[
											index1],
										"time")
									that.$delete(res.data.data[index].object.details[
											index1],
										"highPressure")

									that.swipeList1111.push(res.data.data[index]
										.object.details[index1])
								})
							})
							// 要导出的json数据
							const jsonData = that.swipeList1111
							// 列标题
							let worksheet = 'sht1'
							const lan = uni.getLocale();
							let str =
								'<tr><td style="text-align: center">Date</td><td style="text-align: center">Equipment model</td><td style="text-align: center">Equipment sn</td><td style="text-align: center">Average SBP/mmHg</td><td style="text-align: center">Average DBP/mmHg</td><td style="text-align: center">Average Pulse/BPM</td><td style="text-align: center">Time</td><td style="text-align: center">SBP/mmHg</td><td style="text-align: center">DBP/mmHg</td><td style="text-align: center">Pulse/BPM</td></tr>'
							if (lan == 'zh-Hans' || lan == 'zh-Hant') {
								str =
									'<tr><td style="text-align: center">日期</td><td style="text-align: center">设备型号</td><td style="text-align: center">设备sn</td><td style="text-align: center">平均收缩压/mmHg</td><td style="text-align: center">平均舒张压/mmHg</td><td style="text-align: center">平均脉搏/BPM</td><td style="text-align: center">时间</td><td style="text-align: center">收缩压/mmHg</td><td style="text-align: center">舒张压/mmHg</td><td style="text-align: center">脉搏/BPM</td></tr>'
							} else {
								str =
									'<tr><td style="text-align: center">Date</td><td style="text-align: center">Equipment model</td><td style="text-align: center">Equipment sn</td><td style="text-align: center">Average SBP/mmHg</td><td style="text-align: center">Average DBP/mmHg</td><td style="text-align: center">Average Pulse/BPM</td><td style="text-align: center">Time</td><td style="text-align: center">SBP/mmHg</td><td style="text-align: center">DBP/mmHg</td><td style="text-align: center">Pulse/BPM</td></tr>'
							}
							// 循环遍历，每行加入tr标签，每个单元格加td标签
							for (let i = 0; i < jsonData.length; i++) {
								str += '<tr>'
								for (let item in jsonData[i]) {
									// 增加\t为了不让表格显示科学计数法或者其他格式
									str += `<td>${jsonData[i][item] + '\t'}</td>`
								}
								str += '</tr>'
							}
							// 下载的表格模板数据
							let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
																		    xmlns:x="urn:schemas-microsoft-com:office:excel" 
																		    xmlns="http://www.w3.org/TR/REC-html40">
																		    <head><!--[if gte mso 9]><xml encoding="UTF-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
																		    <x:Name>${worksheet}</x:Name>
																		    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
																		    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
																		    </head><body><table>${str}</table></body></html>`
							// 下载模板
							// #ifdef APP-PLUS
							that.appExportFile(template)
							// #endif
							// 下载模板
							// #ifdef MP-WEIXIN
							that.wxExportFile(template)
							// #endif
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//历史记录V2 - 血氧
			query_log_v23s(deviceSn, startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						dataType: "pressure",
						slaveList: [{
							slaveSn: "0",
							register: "oxygen"
						}],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json'
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList1111 = []
							res.data.data.forEach((item, index) => {
								res.data.data[index].object.details.forEach((item1, index1) => {
									const detail = res.data.data[index].object.details[index1]
									detail.dateTime = res.data.data[index].dateTime
									detail.modelName = res.data.data[index].modelName
									detail.deviceSn = res.data.data[index].deviceSn
									detail.oxygenAvg = res.data.data[index].object.summary
										.oxygenAvg
									detail.time1 = detail.time
									detail.oxygen1 = detail.oxygen
									that.$delete(detail, "time")
									that.swipeList1111.push(detail)
								})
							})
							const jsonData = that.swipeList1111
							let worksheet = 'sht1'
							const lan = uni.getLocale();
							let str =
								'<tr><td style="text-align: center">Date</td><td style="text-align: center">Model number</td><td style="text-align: center">Equipment sn</td><td style="text-align: center">Average SpO2/%</td><td style="text-align: center">Time</td><td style="text-align: center">SpO2/%</td></tr>'
							if (lan == 'zh-Hans' || lan == 'zh-Hant') {
								str =
									'<tr><td style="text-align: center">日期</td><td style="text-align: center">型号</td><td style="text-align: center">设备sn</td><td style="text-align: center">平均血氧/%</td><td style="text-align: center">时间</td><td style="text-align: center">血氧/%</td></tr>'
							}
							for (let i = 0; i < jsonData.length; i++) {
								str += '<tr>'
								for (let item in jsonData[i]) {
									str += `<td>${jsonData[i][item] + '\t'}</td>`
								}
								str += '</tr>'
							}
							let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
																		    xmlns:x="urn:schemas-microsoft-com:office:excel" 
																		    xmlns="http://www.w3.org/TR/REC-html40">
																		    <head><!--[if gte mso 9]><xml encoding="UTF-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
																		    <x:Name>${worksheet}</x:Name>
																		    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
																		    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
																		    </head><body><table>${str}</table></body></html>`
							// #ifdef APP-PLUS
							that.appExportFile(template)
							// #endif
							// #ifdef MP-WEIXIN
							that.wxExportFile(template)
							// #endif
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//历史记录V2 - 体脂
			query_log_v22s(deviceSn, startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						dataType: "weight",
						slaveList: [{
							slaveSn: "0",
							register: "weight"
						}],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList1111 = []
							res.data.data.forEach((item, index) => {
								res.data.data[index].object.details.forEach((item1, index1) => {
									res.data.data[index]
										.object.details[index1].dateTime = res.data.data[
											index]
										.dateTime
									res.data.data[index]
										.object.details[index1].modelName = res.data.data[
											index].modelName
									res.data.data[index]
										.object.details[index1].deviceSn = res.data.data[
											index]
										.deviceSn
									res.data.data[index]
										.object.details[index1].weightAvg = res.data.data[
											index].object.summary
										.weightAvg
									res.data.data[index]
										.object.details[index1].bmiAvg = res.data.data[
											index]
										.object.summary.bmiAvg

									res.data.data[index]
										.object.details[index1].time1 = res.data.data[
											index]
										.object.details[index1].time
									res.data.data[index]
										.object.details[index1].weight1 = res.data.data[
											index]
										.object.details[index1].weight
									res.data.data[index]
										.object.details[index1].bmi1 = res.data.data[index]
										.object.details[index1].bmi

									that.$delete(res.data.data[index].object.details[
											index1],
										"weight")
									that.$delete(res.data.data[index].object.details[
											index1],
										"time")
									that.$delete(res.data.data[index].object.details[
											index1],
										"bmi")

									that.swipeList1111.push(res.data.data[index]
										.object.details[index1])
								})

								console.log("dsajkhsahdas体重", that.swipeList1111)
							})
							// 要导出的json数据
							const jsonData = that.swipeList1111
							// 列标题
							let worksheet = 'sht1'
							const lan = uni.getLocale();
							let str =
								'<tr><td style="text-align: center">Date</td><td style="text-align: center">Model number</td><td style="text-align: center">Equipment sn</td><td style="text-align: center">Average weight/kg</td><td style="text-align: center">Average BMI</td><td style="text-align: center">Time</td><td style="text-align: center">Weight/kg</td><td style="text-align: center">BMI</td></tr>'
							if (lan == 'zh-Hans' || lan == 'zh-Hant') {
								str =
									'<tr><td style="text-align: center">日期</td><td style="text-align: center">型号</td><td style="text-align: center">设备sn</td><td style="text-align: center">平均体重/kg</td><td style="text-align: center">平均BMI</td><td style="text-align: center">时间</td><td style="text-align: center">体重/kg</td><td style="text-align: center">BMI</td></tr>'
							} else {
								str =
									'<tr><td style="text-align: center">Date</td><td style="text-align: center">Model number</td><td style="text-align: center">Equipment sn</td><td style="text-align: center">Average weight/kg</td><td style="text-align: center">Average BMI</td><td style="text-align: center">Time</td><td style="text-align: center">Weight/kg</td><td style="text-align: center">BMI</td></tr>'
							}
							for (let i = 0; i < jsonData.length; i++) {
								str += '<tr>'
								for (let item in jsonData[i]) {
									// 增加\t为了不让表格显示科学计数法或者其他格式
									str += `<td>${jsonData[i][item] + '\t'}</td>`
								}
								str += '</tr>'
							}
							// 下载的表格模板数据
							let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
																		    xmlns:x="urn:schemas-microsoft-com:office:excel" 
																		    xmlns="http://www.w3.org/TR/REC-html40">
																		    <head><!--[if gte mso 9]><xml encoding="UTF-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
																		    <x:Name>${worksheet}</x:Name>
																		    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
																		    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
																		    </head><body><table>${str}</table></body></html>`
							// 下载模板
							// #ifdef APP-PLUS
							that.appExportFile(template)
							// #endif
							// 下载模板
							// #ifdef MP-WEIXIN
							that.wxExportFile(template)
							// #endif
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			appExportFile(fileData, documentName = '项目Excel文件') {
				// PUBLIC_DOCUMENTS: 程序公用文档目录常量
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, fs => {
					let rootObj = fs.root,
						fullPath = rootObj.fullPath
					console.log('开始导出数据********')
					// 创建文件夹
					rootObj.getDirectory(documentName, {
						create: true
					}, dirEntry => {
						// 创建文件,防止重名
						let fileName = 'excel' + this.uuid() + '.xlsx'
						dirEntry.getFile(fileName, {
							create: true
						}, fileEntry => {
							fileEntry.createWriter(writer => {
								writer.onwritestart = res => console.log('正在导出')
								//  /storage/emulated/0指的就是系统路径
								let pathStr = fullPath.replace('/storage/emulated/0', '')
								// 成功导出数据
								writer.onwrite = res => {
									// 文件路径
									let filePath = res.target.fileName
									uni.hideLoading()
									setTimeout(() => {
										console.log('成功导出')
										this.successTip = `文件位置：${filePath}`

										uni.openDocument({
											filePath,
											success: res => console
												.log('打开文档成功'),
											fail: err => console.log(
												err)
										})
									}, 500)
								}
								// 写入内容
								writer.write(fileData)
							}, err => console.log(err.message))
						})
					})
				})
			},

			wxExportFile(template, documentName = '项目Excel文件') {
				const fs = wx.getFileSystemManager()
				// 创建文件名字, 防止重名
				let filePath = wx.env.USER_DATA_PATH + '/' + (documentName + this.uuid()) + '.xls'
				fs.writeFile({
					filePath,
					data: template,
					encoding: 'utf8',
					success: res => {

						wx.openDocument({
							filePath,
							showMenu: true, //是否显示右上角菜单
							success: res => console.log('打开文档成功。文件位置', filePath),
							fail: err => console.log(err)
						})
					},
					fail: err => console.info(err)
				})
			},
			uuid() {
				return 'xxx-xxx-xxx'.replace(/[xy]/g, c => {
					var r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8)
					return v.toString(16)
				})
			},
			async handleDeleteRecord(recordInfo) {
				console.log("删除记录:", recordInfo);
				try {
					let data = {
						deviceSn: recordInfo.deviceSn,
						timeList: recordInfo.timestamps
					}
					const res = await this.$post(this.$url_APP_IP + this.$url_batch_del_data_log, data, {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json'
					});
					console.log(res);
					if (res.code == 200) {
						uni.showToast({
							title: this.$t('删除成功'),
							icon: 'none'
						});
						// 删除成功后重新获取数据，确保数据实时更新
						await this.fetchData();
					} else {
						uni.showToast({
							title: res.msg || this.$t('删除失败'),
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('删除失败:', error);
					uni.showToast({
						title: this.$t('删除失败'),
						icon: 'none'
					});
				}
			},

			handleToggleExpand(index) {
				// console.log("切换展开状态:", index);
				// 实现展开逻辑
			},

			showBmiInfo() {
				this.$refs.bmiPopup.open();
			},

			showOxygenInfo() {
				this.$refs.bloodOxygenPopup.open();
			}
		}
	}
</script>

<style scoped>
	.container {
		color: black;
		min-height: 100vh;
		background-color: #F7F7F7;
	}

	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 60px 20px 10px;
		background: #F7F7F7;
		z-index: 1000;
	}

	.navbar-left {
		width: 20vw;
	}

	.navbar-title {
		font-size: 18px;
		font-weight: bold;
	}

	.nav-switch {
		display: flex;
		gap: 16px;
	}

	.switch-item {
		font-size: 16px;
		color: black;
		transition: all 0.3s;
	}

	.switch-item.active {
		color: #3298F7;
		font-weight: bold;
	}

	.swiper-container {
		padding: 130px 10px 0;
	}

	.date-container {
		margin-top: 10px;
	}

	.month-selector {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
	}

	.date-controls {
		display: flex;
		align-items: center;
		gap: 30px;
	}

	.date-label {
		font-size: 18px;
		font-weight: 500;
	}

	.date-help,
	.date-export {
		font-size: 14px;
		font-weight: bold;
		color: #3298F7;
	}

	.content-area {
		padding: 20px 10px;
		min-height: 300px;
	}

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50px 0;
	}

	.no-data {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 50px 0;
		color: #999;
		font-size: 16px;
		gap: 20px;
	}

	.bind-device-btn {
		background: #3298F7;
		color: white;
		padding: 10px 20px;
		border-radius: 20px;
		font-size: 14px;
	}

	/* 响应式设计 */
	@media (max-width: 375px) {
		.navbar {
			padding: 50px 15px 10px;
		}

		.swiper-container {
			padding: 120px 5px 0;
		}

		.date-controls {
			gap: 20px;
		}
	}
</style>