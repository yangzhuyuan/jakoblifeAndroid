<template>
	<view style="padding: 20px;">
		<!-- <view class="pagedsismj_4">
			<picker style="flex: 2;" @change="types_change" :value="types_index" :range="types_array">
				<view style="font-size: 14px;color: white;">
					{{types_array[types_index]}}
				</view>
			</picker>
			<picker @change="types_change" :value="types_index" :range="types_array">
				<uni-icons style="flex: 1;" type="bottom" size="18" color="white"></uni-icons>
			</picker>
		</view> -->
		<view style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
			{{$t('当天')}}：
		</view>
		<view class="charts-box-ppg">
			<qiun-data-charts type="line" :opts="optsPPG" :chartData="chartDataPPG" />
		</view>
		<view style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
			{{$t('两周')}}：{{$t('平均')}}
		</view>
		<view class="charts-box-ppg">
			<qiun-data-charts type="line" :opts="optsPPG2" :chartData="chartDataPPG2" />
		</view>
	</view>
</template>

<script>
	const Language = uni.getLocale();
	export default {
		data() {
			return {
				shareid: '',
				types_index: uni.getStorageSync("types_index") || 0,
				types_array: [this.$t("心情指数"), this.$t("抑郁风险评分"), this.$t("压力指数"), this.$t("疲劳指数"), this.$t("恢复指数")],

				// 图表数据
				chartDataPPG: {
					categories: [""],
					series: [{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						}
					]
				},
				chartDataPPG2: {
					categories: [""],
					series: [{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						},
						{
							legendShape: "none",
							name: "",
							data: [""],
							color: '#3298F7'
						}
					]
				},

				// 图表配置（基础部分）
				baseOpts: {
					color: ["#3298F7", "#3298F7", "#3298F7", "#3298F7", "#3298F7"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						splitNumber: 10,
						data: [{
							min: 0,
							max: 10
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					}
				},
				optsPPG: null, // 将在 created 中动态生成
				optsPPG2: null, // 将在 created 中动态生成

				// 各指标对应的 MarkLine 配置映射
				markLineConfigs: {
					0: { // 心情指数
						lines: [{
								value: 8,
								color: "#41EB08",
								label: "积极愉悦2",
								offsetX: 145
							},
							{
								value: 6,
								color: "#3298F7",
								label: "平静稳定2",
								offsetX: 115
							},
							{
								value: 4,
								color: "#FF6B6B",
								label: "轻微压力2",
								offsetX: 83
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "明显压力2",
								offsetX: 122
							}
						]
					},
					1: { // 抑郁风险评分
						lines: [{
								value: 8,
								color: "#FF6B6B",
								label: "较高风险2",
								offsetX: 70
							},
							{
								value: 5,
								color: "#3298F7",
								label: "中等风险2",
								offsetX: 90
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "较低风险2",
								offsetX: 70
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "",
								offsetX: 60,
								showLabel: false
							} // 占位，不显示
						]
					},
					2: { // 压力指数
						lines: [{
								value: 5,
								color: "#FF6B6B",
								label: "压力大2",
								offsetX: 85
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "压力小2",
								offsetX: 85
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "",
								offsetX: 60,
								showLabel: false
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "",
								offsetX: 60,
								showLabel: false
							}
						]
					},
					3: { // 疲劳指数
						lines: [{
								value: 5,
								color: "#FF6B6B",
								label: "疲劳度高2",
								offsetX: 125
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "疲劳度低2",
								offsetX: 120
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "",
								offsetX: 60,
								showLabel: false
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "",
								offsetX: 60,
								showLabel: false
							}
						]
					},
					4: { // 恢复指数
						lines: [{
								value: 5,
								color: "#FF6B6B",
								label: "恢复快2",
								offsetX: 100
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "恢复慢2",
								offsetX: 100
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "",
								offsetX: 60,
								showLabel: false
							},
							{
								value: 0,
								color: "#D8D8D6",
								label: "",
								offsetX: 60,
								showLabel: false
							}
						]
					}
				}
			};
		},
		created() {
			this.initChartOptions();
		},
		onShow() {

		},
		onLoad(options) {
			this.shareid = options.shareid;
			// 根据传入的 register 设置初始索引
			const registerMap = {
				"心情指数": 0,
				"Mood Index": 0,
				"抑郁风险评分": 1,
				"Depression risk score": 1,
				"压力指数": 2,
				"Pressure Index": 2,
				"疲劳指数": 3,
				"Fatigue Index": 3,
				"恢复指数": 4,
				"Recovery Index": 4
			};
			const initialIndex = registerMap[options.register] !== undefined ? registerMap[options.register] : 0;
			this.types_index = initialIndex;

			switch (initialIndex) {
				case 0:
					uni.setNavigationBarTitle({
						title: this.$t("心情指数")
					});
					break
				case 1:
					uni.setNavigationBarTitle({
						title: this.$t("抑郁风险评分")
					});
					break
				case 2:
					uni.setNavigationBarTitle({
						title: this.$t("压力指数")
					});
					break
				case 3:
					uni.setNavigationBarTitle({
						title: this.$t("疲劳指数")
					});
					break
				case 4:
					uni.setNavigationBarTitle({
						title: this.$t("恢复指数")
					});
					break
			}
			this.loadChartData(initialIndex, options.shareid);
		},
		methods: {
			// 初始化图表配置
			initChartOptions() {
				this.optsPPG = JSON.parse(JSON.stringify(this.baseOpts));
				this.optsPPG2 = JSON.parse(JSON.stringify(this.baseOpts));
				this.updateMarkLineForIndex(this.types_index);
			},

			// 根据索引更新 markLine 配置
			updateMarkLineForIndex(index) {
				const config = this.markLineConfigs[index] || this.markLineConfigs[0];
				const markLineData = config.lines.map(line => this.getMarkLineConfig(line));
				this.optsPPG.extra.markLine = {
					type: "dash",
					data: markLineData
				};
				this.optsPPG2.extra.markLine = {
					type: "dash",
					data: markLineData
				};
			},

			// 生成单条 markLine 配置
			getMarkLineConfig({
				value,
				color,
				label,
				offsetX,
				showLabel = true
			}) {
				const isChinese = Language === 'zh-Hans' || Language === 'zh-Hant';
				// 基础配置
				const base = {
					value,
					lineColor: color,
					showLabel,
					labelText: label ? this.$t(label) : "",
					labelAlign: "left",
					labelOffsetX: isChinese ? 60 : offsetX,
					labelFontColor: "#D8D8D6",
					labelOffsetY: -15,
					labelBgOpacity: -0.8,
					borderWidth: 0,
					borderColor: "transparent",
					borderRadius: 4,
					padding: [4, 8, 4, 8]
				};
				// 如果不显示标签，清空相关文本
				if (!showLabel) {
					base.labelText = "";
				}
				return base;
			},

			types_change(e) {
				this.types_index = e.detail.value;
				this.updateMarkLineForIndex(this.types_index);
				this.loadChartData(this.types_index, this.shareid);
				uni.setStorageSync("types_index", this.types_index);
			},

			loadChartData(index, shareId) {
				this.share_query_log1(index, shareId);
				this.share_query_log2(index, shareId);
			},

			getCurrentTimePPG() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},

			// 计算平均值 (简化版)
			calculateAverage(arr) {
				if (!arr || arr.length === 0) return 0;
				const sum = arr.reduce((acc, val) => acc + (val || 0), 0);
				return parseFloat((sum / arr.length).toFixed(2));
			},

			// 处理当天数据 (share_query_log1)
			share_query_log1(recordId, shareId) {
				const data = {
					deviceSn: shareId,
					dataType: "1",
					slaveList: [{
							slaveSn: "1",
							register: "mood_index"
						},
						{
							slaveSn: "1",
							register: "depression_risk_score"
						},
						{
							slaveSn: "1",
							register: "stress_index"
						},
						{
							slaveSn: "1",
							register: "fatigue_index"
						},
						{
							slaveSn: "1",
							register: "recovery_index"
						}
					],
					startTime: this.getCurrentTimePPG() + " 00:00:00",
					endTime: this.getCurrentTimePPG() + " 23:59:59",
				};

				this.$post(this.$url_APP_IP + this.$url_query_log, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((res) => {
					// 清空当前系列数据
					this.chartDataPPG.series.forEach(s => s.data = []);
					this.chartDataPPG.categories = [];

					if (res.code === 200 && res.data) {
						const timePointsMap = new Map();
						Object.keys(res.data).forEach(register => {
							const items = res.data[register] || [];
							items.forEach(item => {
								if (!item || item.length < 2) return;
								const value = parseFloat(item[0]);
								const timestamp = item[1];
								if (!timePointsMap.has(timestamp)) {
									timePointsMap.set(timestamp, {
										timestamp,
										moodIndex: null,
										depressionRiskScore: null,
										stressIndex: null,
										fatigueIndex: null,
										recoveryIndex: null
									});
								}
								const timePoint = timePointsMap.get(timestamp);
								switch (register) {
									case 'mood_index':
										timePoint.moodIndex = value;
										break;
									case 'depression_risk_score':
										timePoint.depressionRiskScore = value;
										break;
									case 'stress_index':
										timePoint.stressIndex = value;
										break;
									case 'fatigue_index':
										timePoint.fatigueIndex = value;
										break;
									case 'recovery_index':
										timePoint.recoveryIndex = value;
										break;
								}
							});
						});

						const formattedData = Array.from(timePointsMap.values())
							.sort((a, b) => a.timestamp - b.timestamp);

						// 构建 categories 和对应 series 数据
						formattedData.forEach((item, index) => {
							this.chartDataPPG.categories.push(index + 1); // 倒序编号
							// 根据 recordId 只填充对应的数据系列
							const targetSeries = this.chartDataPPG.series[recordId];
							if (targetSeries) {
								let value = null;
								switch (recordId) {
									case 0:
										value = item.moodIndex;
										break;
									case 1:
										value = item.depressionRiskScore;
										break;
									case 2:
										value = item.stressIndex;
										break;
									case 3:
										value = item.fatigueIndex;
										break;
									case 4:
										value = item.recoveryIndex;
										break;
								}
								targetSeries.data.push(value);
							}
						});
					}
					// 即使无数据，markLine 也已经由 updateMarkLineForIndex 设置好了
				}).catch(err => {
					console.error("share_query_log1 error", err);
				});
			},

			// 处理两周平均数据 (share_query_log2)
			share_query_log2(recordId, shareId) {
				const endTimeStr = this.getCurrentTimePPG() + " 23:59:59";
				const endDate = new Date(endTimeStr);
				const startDate = new Date(endDate);
				startDate.setDate(startDate.getDate() - 13);
				const startTimeStr = startDate.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00";
				const data = {
					deviceSn: shareId,
					dataType: "1",
					slaveList: [{
							slaveSn: "1",
							register: "mood_index"
						},
						{
							slaveSn: "1",
							register: "depression_risk_score"
						},
						{
							slaveSn: "1",
							register: "stress_index"
						},
						{
							slaveSn: "1",
							register: "fatigue_index"
						},
						{
							slaveSn: "1",
							register: "recovery_index"
						}
					],
					startTime: startTimeStr,
					endTime: endTimeStr,
				};

				this.$post(this.$url_APP_IP + this.$url_query_log, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((res) => {
					// console.log("share_query_log2", share_query_log2)
					// 清空数据
					this.chartDataPPG2.series.forEach(s => s.data = []);
					this.chartDataPPG2.categories = [];
					if (res.code === 200 && res.data) {
						const timePointsMap = new Map();
						Object.keys(res.data).forEach(register => {
							const items = res.data[register] || [];
							items.forEach(item => {
								if (!item || item.length < 2) return;
								const value = parseFloat(item[0]);
								const timestamp = item[1];
								if (!timePointsMap.has(timestamp)) {
									timePointsMap.set(timestamp, {
										timestamp,
										moodIndex: 0,
										depressionRiskScore: 0,
										stressIndex: 0,
										fatigueIndex: 0,
										recoveryIndex: 0,
										count: 0
									});
								}
								const timePoint = timePointsMap.get(timestamp);
								switch (register) {
									case 'mood_index':
										timePoint.moodIndex += value;
										break;
									case 'depression_risk_score':
										timePoint.depressionRiskScore += value;
										break;
									case 'stress_index':
										timePoint.stressIndex += value;
										break;
									case 'fatigue_index':
										timePoint.fatigueIndex += value;
										break;
									case 'recovery_index':
										timePoint.recoveryIndex += value;
										break;
								}
								timePoint.count++;
							});
						});

						// 按日期聚合（正确版本）
						const dailyMap = new Map();

						// 先按指标分类处理
						const moodDataByDate = new Map();
						const depressionDataByDate = new Map();
						const stressDataByDate = new Map();
						const fatigueDataByDate = new Map();
						const recoveryDataByDate = new Map();

						Array.from(timePointsMap.values()).forEach(item => {
							const date = new Date(item.timestamp * 1000);
							const dateKey =
								`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

							// 情绪指标
							if (item.moodIndex > 0) {
								if (!moodDataByDate.has(dateKey)) moodDataByDate.set(dateKey, []);
								moodDataByDate.get(dateKey).push(item.moodIndex);
							}

							// 抑郁风险
							if (item.depressionRiskScore > 0) {
								if (!depressionDataByDate.has(dateKey)) depressionDataByDate.set(dateKey,
									[]);
								depressionDataByDate.get(dateKey).push(item.depressionRiskScore);
							}

							// 压力指数
							if (item.stressIndex > 0) {
								if (!stressDataByDate.has(dateKey)) stressDataByDate.set(dateKey, []);
								stressDataByDate.get(dateKey).push(item.stressIndex);
							}

							// 疲劳指数
							if (item.fatigueIndex > 0) {
								if (!fatigueDataByDate.has(dateKey)) fatigueDataByDate.set(dateKey, []);
								fatigueDataByDate.get(dateKey).push(item.fatigueIndex);
							}

							// 恢复指数
							if (item.recoveryIndex > 0) {
								if (!recoveryDataByDate.has(dateKey)) recoveryDataByDate.set(dateKey, []);
								recoveryDataByDate.get(dateKey).push(item.recoveryIndex);
							}
						});

						// 获取所有日期
						const allDates = new Set([
							...moodDataByDate.keys(),
							...depressionDataByDate.keys(),
							...stressDataByDate.keys(),
							...fatigueDataByDate.keys(),
							...recoveryDataByDate.keys()
						]);

						// 计算每天每个指标的平均值
						const dailyAverages = Array.from(allDates)
							.map(dateKey => {
								// 计算情绪指数平均值
								const moodValues = moodDataByDate.get(dateKey) || [];
								const avgMood = moodValues.length > 0 ?
									moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length :
									0;

								// 计算抑郁风险平均值
								const depressionValues = depressionDataByDate.get(dateKey) || [];
								const avgDepression = depressionValues.length > 0 ?
									depressionValues.reduce((sum, val) => sum + val, 0) / depressionValues
									.length :
									0;

								// 计算压力指数平均值
								const stressValues = stressDataByDate.get(dateKey) || [];
								const avgStress = stressValues.length > 0 ?
									stressValues.reduce((sum, val) => sum + val, 0) / stressValues.length :
									0;

								// 计算疲劳指数平均值
								const fatigueValues = fatigueDataByDate.get(dateKey) || [];
								const avgFatigue = fatigueValues.length > 0 ?
									fatigueValues.reduce((sum, val) => sum + val, 0) / fatigueValues.length :
									0;

								// 计算恢复指数平均值
								const recoveryValues = recoveryDataByDate.get(dateKey) || [];
								const avgRecovery = recoveryValues.length > 0 ?
									recoveryValues.reduce((sum, val) => sum + val, 0) / recoveryValues.length :
									0;

								return {
									date: dateKey,
									avgMood,
									avgDepression,
									avgStress,
									avgFatigue,
									avgRecovery,
									// 可选：记录每天有多少条数据，用于调试
									countMood: moodValues.length,
									countDepression: depressionValues.length,
									countStress: stressValues.length,
									countFatigue: fatigueValues.length,
									countRecovery: recoveryValues.length
								};
							})
							.sort((a, b) => new Date(a.date) - new Date(b.date));

						// 调试： 打印每天的数据量
						console.log('每日数据统计:', dailyAverages.map(d => ({
							date: d.date,
							mood: `值:${d.avgMood.toFixed(2)} (${d.countMood}条)`,
							depression: `值:${d.avgDepression.toFixed(2)} (${d.countDepression}条)`,
							stress: `值:${d.avgStress.toFixed(2)} (${d.countStress}条)`,
							fatigue: `值:${d.avgFatigue.toFixed(2)} (${d.countFatigue}条)`,
							recovery: `值:${d.avgRecovery.toFixed(2)} (${d.countRecovery}条)`
						})));

						// 填充图表
						const targetSeries = this.chartDataPPG2.series[recordId];
						dailyAverages.forEach(day => {
							this.chartDataPPG2.categories.push(day.date.slice(8)); // 显示日
							let value = null;
							switch (recordId) {
								case 0:
									value = day.avgMood.toFixed(1);
									break;
								case 1:
									value = day.avgDepression.toFixed(1);
									break;
								case 2:
									value = day.avgStress.toFixed(1);
									break;
								case 3:
									value = day.avgFatigue.toFixed(1);
									break;
								case 4:
									value = day.avgRecovery.toFixed(1);
									break;
							}
							targetSeries.data.push(value);
						});
					}
				}).catch(err => {
					console.error("share_query_log2 error", err);
				});
			}
		}
	};
</script>

<style>
	.pagedsismj_4 {
		background: #3298F7;
		margin: 20px 0;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		padding: 15px;
		border-radius: 20px;
	}

	.charts-box-ppg {
		padding: 5px;
		background: white;
		border-radius: 20px;
		height: auto;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}
</style>