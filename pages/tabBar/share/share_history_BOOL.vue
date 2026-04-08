<template>
	<view style="padding: 20px;">
		<view style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
			{{$t('当天')}}：
		</view>
		<view class="charts-box-ppg">
			<qiun-data-charts type="line" :opts="xeuyaopts" :chartData="chartData" />
		</view>
		<view style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
			{{$t('两周')}}：{{$t('平均')}}
		</view>
		<view class="charts-box-ppg">
			<qiun-data-charts type="line" :opts="xeuyaopts2" :chartData="chartData2" />
		</view>
	</view>
</template>

<script>
	const Language = uni.getLocale();
	export default {
		data() {
			return {
				shareid: [],
				// 图表数据
				chartData: {
					categories: [0],
					series: [{
						legendShape: "#FC7F41",
						name: this.$t("收缩压"),
						data: [0]
					}, {
						legendShape: "#7AE545",
						name: this.$t("舒张压"),
						data: [0]
					}, {
						legendShape: "#0865EB",
						name: this.$t("脉搏"),
						data: [0]
					}]
				},
				xeuyaopts: {
					color: ["#FC7F41", "#7AE545", "#0865EB"],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					xAxis: {
						disableGrid: true,
						gridType: "dash",
						fontSize: 10,
						calibration: false,
						axisLine: false,
					},
					yAxis: {
						splitNumber: 4,
						gridType: "dash",
						data: [{
							min: 0,
							max: 200,
							position: "left",
							fontSize: 10,
							textAlign: "left",
							calibration: false,
							axisLine: true,
						}],
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				chartData2: {
					categories: [0],
					series: [{
						legendShape: "#FC7F41",
						name: this.$t("收缩压"),
						data: [0]
					}, {
						legendShape: "#7AE545",
						name: this.$t("舒张压"),
						data: [0]
					}, {
						legendShape: "#0865EB",
						name: this.$t("脉搏"),
						data: [0]
					}]
				},
				xeuyaopts2: {
					color: ["#FC7F41", "#7AE545", "#0865EB"],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					xAxis: {
						disableGrid: true,
						gridType: "dash",
						fontSize: 10,
						calibration: false,
						axisLine: false,
					},
					yAxis: {
						splitNumber: 4,
						gridType: "dash",
						data: [{
							min: 0,
							max: 200,
							position: "left",
							fontSize: 10,
							textAlign: "left",
							calibration: false,
							axisLine: true,
						}],
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				},

			};
		},

		onShow() {

		},
		onLoad(options) {
			this.shareid = [];
			this.shareid.push(options.shareid)
			uni.setNavigationBarTitle({
				title: this.$t("共享")
			});
			this.queryBloodPressureData(this.shareid)
			this.queryBloodPressureData2(this.shareid)
		},
		methods: {
			getCurrentTimePPG() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			// 处理当天数据 (share_query_log1)
			queryBloodPressureData(deviceSn) {
				let data = {
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
					startTime: this.getCurrentTimePPG() + " 00:00:00",
					endTime: this.getCurrentTimePPG() + " 23:59:59",
				};
				// console.log("res.data血压数据查询传参：", data)
				this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((queryBloodPressureDatares) => {
					// console.log("queryBloodPressureDatares：", queryBloodPressureDatares)
					if (queryBloodPressureDatares.code === 200) {
						this.chartData.categories = []
						this.chartData.series[0].data = []
						this.chartData.series[1].data = []
						this.chartData.series[2].data = []
						queryBloodPressureDatares.data[0].object.details.slice().reverse().forEach(item => {
							console.log(item)
							this.chartData.categories.push(item.time);
							this.chartData.series[0].data.push(item.highPressure);
							this.chartData.series[1].data.push(item.lowPressure);
							this.chartData.series[2].data.push(item.heartrate);
						})
					}
				})
			},

			// 处理两周平均数据 (share_query_log2)
			queryBloodPressureData2(deviceSn) {
				let endTime = this.getCurrentTimePPG() + " 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() - 13) // 两周
				let startTime = minusOneWeek.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				let data = {
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
					startTime: startTime,
					endTime: endTime,
				};
				// console.log("2res.data血压数据查询传参：", data)
				this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((queryBloodPressureDatares) => {
					// console.log("2queryBloodPressureDatares：", queryBloodPressureDatares)
					if (queryBloodPressureDatares.code === 200) {
						this.chartData2.categories = []
						this.chartData2.series[0].data = []
						this.chartData2.series[1].data = []
						this.chartData2.series[2].data = []
						queryBloodPressureDatares.data.forEach(item => {
							// console.log("item", item)
							this.chartData2.categories.push(item.dateTime);
							this.chartData2.series[0].data.push(item.object.summary.highPressureAvg);
							this.chartData2.series[1].data.push(item.object.summary.lowPressureAvg);
							this.chartData2.series[2].data.push(item.object.summary.heartrateAvg);
						})
					}
				})
			},
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