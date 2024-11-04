<template>
	<view>
		<view v-if="types" style="background: #F7F7F7; padding-bottom: 50px;">
			<view style="padding-top: 20px;">
				<view class="title_time">
					<view v-if="DAY" class="button_time_1" @tap="button_DAY">{{$t('shouye_item.title_32')}}</view>
					<view v-else class="button_time_2" @tap="button_DAY">{{$t('shouye_item.title_32')}}</view>
					<view class="view_bor"></view>
					<view v-if="WEEK" class="button_time_1" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view v-else class="button_time_2" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view class="view_bor"></view>
					<view v-if="MON" class="button_time_1" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view v-else class="button_time_2" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view class="view_bor"></view>
					<view v-if="SIX_MON" class="button_time_1" @tap="button_SIX_MON">6{{$t('shouye_item.title_36')}}
					</view>
					<view v-else class="button_time_2" @tap="button_SIX_MON">6{{$t('shouye_item.title_36')}}</view>
					<view class="view_bor"></view>
					<view v-if="YEAR" class="button_time_1" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
					<view v-else class="button_time_2" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
				</view>
				<view style="display: flex;justify-content: center;margin-top: 20px;">
					<picker fields="day" mode="date" :value="date" :start="startDate" :end="endDate"
						@change="bindDateChange">
						<view style="display: flex;flex-direction: row;">
							<view style="font-size: 18px;color: gray;">{{date}}</view>
							<uni-icons type="bottom" size="18" style="margin-left: 10px;"></uni-icons>
						</view>
					</picker>
				</view>
				<view class="table_bg">
					<view style="display: flex; flex-direction: row;">
						<view>
							<view style="display: flex; flex-direction: row;align-items: center;">
								<view style="background: #FC7F41;width: 10px; height: 10px;border-radius: 5px" />
								<view style="margin-left: 5px;color: gray;">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							</view>
							<view class="table_item_text">{{Systolic_blood_pressure}}</view>
						</view>
						<view style="margin-left: 20px;">
							<view style="display: flex; flex-direction: row;align-items: center;">
								<view style="background: #7AE545;width: 10px; height: 10px;border-radius: 5px"></view>
								<view style="margin-left: 5px;color: gray;">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							</view>
							<view class="table_item_text">{{Diastolic_blood_pressure}}</view>
						</view>
					</view>
					<view class="charts-box">
						<qiun-data-charts type="column" :opts="opts" :chartData="chartData" />
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_0')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(lately_Blood_pressure)" />
						<view class="title_font_bg">{{lately_Blood_pressure}}</view>
						<!-- <uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons> -->
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{lately_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{lately_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{lately_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_1')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(average_Blood_pressure)" />
						<view class="title_font_bg">{{average_Blood_pressure}}</view>
						<!-- <uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons> -->
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{average_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{average_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{average_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_2')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(Maximum_Blood_pressure)" />
						<view class="title_font_bg">{{Maximum_Blood_pressure}}</view>
						<!-- <uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons> -->
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{Maximum_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{Maximum_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{Maximum_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_3')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(Minimum_Blood_pressure)" />
						<view class="title_font_bg">{{Minimum_Blood_pressure}}</view>
						<!-- <uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons> -->
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{Minimum_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{Minimum_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{Minimum_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<uni-fab ref="fab" :pattern="pattern" horizontal="right" vertical="bottom" :direction="direction"
				@trigger="trigger" @fabClick="fabClick" />
		</view>
		<view v-else style="padding-bottom: 20px;">
			<view style="display: flex;flex-direction: column; justify-content: center; padding: 20px 10px 10px 10px;">
				<view class="title_time">
					<view v-if="DAY" class="button_time_1" @tap="button_DAY">{{$t('shouye_item.title_32')}}</view>
					<view v-else class="button_time_2" @tap="button_DAY">{{$t('shouye_item.title_32')}}</view>
					<view class="view_bor"></view>
					<view v-if="WEEK" class="button_time_1" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view v-else class="button_time_2" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view class="view_bor"></view>
					<view v-if="MON" class="button_time_1" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view v-else class="button_time_2" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view class="view_bor"></view>
					<view v-if="SIX_MON" class="button_time_1" @tap="button_SIX_MON">6{{$t('shouye_item.title_36')}}
					</view>
					<view v-else class="button_time_2" @tap="button_SIX_MON">6{{$t('shouye_item.title_36')}}</view>
					<view class="view_bor"></view>
					<view v-if="YEAR" class="button_time_1" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
					<view v-else class="button_time_2" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
				</view>
				<view class="charts-box-2">
					<view class="text_title_types_1">
						<view style="display: flex;flex-direction: column; align-items: center;">
							<text class="text_title_types_2">{{$t('qushiitem.title_10')}}</text>
							<view style="font-size: 18px; font-weight: bold;">{{Mean_value}}</view>
						</view>
						<view style="display: flex;flex-direction: column; align-items: center;width: 33%;">
							<text class="text_title_types_2">BMI</text>
							<view style="font-size: 18px; font-weight: bold;">{{bmi}}</view>

						</view>
						<view style="display: flex;flex-direction: column; align-items: center;width: 33%;">
							<text class="text_title_types_2">{{$t('qushiitem.title_11')}}</text>
							<view style="font-size: 18px; font-weight: bold;">{{weight_value}}</view>
						</view>
					</view>
					<qiun-data-charts type="line" :opts="opts2" :chartData="chartData2" />
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/6.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_12')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(lately_Blood_pressure)" />
						<view class="title_font_bg">{{lately_Blood_pressure}}</view>
						<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('qushiitem.title_13')}}/mmHg</view>
							<view class="text_item_bg_1">{{lately_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('qushiitem.title_14')}}/mmHg</view>
							<view class="text_item_bg_1">{{lately_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('qushiitem.title_15')}}/BMP</view>
							<view class="text_item_bg_1">{{lately_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg_toast" >{{Detection_result}}</view>

			<uni-fab ref="fab" :pattern="pattern1" horizontal="right" vertical="bottom" direction="horizontal"
				@trigger="trigger" @fabClick="fabClick" />

		</view>

		<view>
			<uni-popup ref="qs_popup" @change="QS()" :mask-click="true">
				<view style="border-radius: 20px;background:#fff; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: center; padding: 10px;">
						<picker fields="day" mode="date" :value="birthday" :start="startDate" :end="endDate"
							@change="bindDateChange1">
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 16px;color: black;">{{birthday}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="padding: 10px;width: 80vw;">
						<view
							style="margin:0 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shousuoya" :placeholder="$t('qushiitem.title_4')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">mmHg</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shuzhangya" :placeholder="$t('qushiitem.title_5')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">mmHg</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="maibo" :placeholder="$t('qushiitem.title_6')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">mmHg</text>
						</view>

					</view>
					<button @tap="truesss()"
						style="margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">确
						认</button>
				</view>
			</uni-popup>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				types: false,
				date: new Date().toISOString().slice(0, 10).replace("-", "/").replace("-", "/"),
				DAY: true,
				WEEK: false,
				MON: false,
				SIX_MON: false,
				YEAR: false,
				Systolic_blood_pressure: "90-100",
				Diastolic_blood_pressure: "60-80",
				chartData: {
					categories: ["08:26", "13:15", "15:35"],
					series: [{
							legendShape: "none",
							name: "",
							data: [90, 100, 120]
						},
						{
							legendShape: "none",
							name: "",
							data: [60, 80, 100]
						}
					]
				},
				opts: {
					color: ["#FC7F41", "#7AE545"],
					enableScroll: false,
					enableMarkLine: false,
					xAxis: {
						disableGrid: true,
						gridType: "dash",
						fontSize: 10,
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
							axisLine: false,
							axisLine: true,


						}]
					},
					extra: {
						column: {
							type: "group",
							width: 8,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08,
							linearType: "custom",
							seriesGap: 5,
							linearOpacity: 1,
							barBorderCircle: true,
							customColor: [
								"#E79A5D",
								"#87C491"
							],
						}
					},
				},
				lately_Blood_pressure: "-",
				lately_Systolic_blood_pressure: "90-100",
				lately_Diastolic_blood_pressure: "60-80",
				lately_pulse: "70",

				average_Blood_pressure: "-",
				average_Systolic_blood_pressure: "90-100",
				average_Diastolic_blood_pressure: "70-80",
				average_pulse: "70",

				Maximum_Blood_pressure: "-",
				Maximum_Systolic_blood_pressure: "90-100",
				Maximum_Diastolic_blood_pressure: "60-80",
				Maximum_pulse: "70",

				Minimum_Blood_pressure: "-",
				Minimum_Systolic_blood_pressure: "90-100",
				Minimum_Diastolic_blood_pressure: "60-80",
				Minimum_pulse: "70",


				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				pattern1: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				is_color_type: false,
				chartData2: {
					categories: ["8/28", "8/29", "8/30", "8/31", "9/1", "9/2", "9/3", ""],
					series: [{
						legendShape: "none",
						name: "",
						data: [53, 53.2, 54, 56, 52.2, 55, 56.6]
					}, ]
				},
				opts2: {
					color: ["#3298F7"],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},


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
							min: 50,
							max: 58,
							position: "left",
							fontSize: 10,
							textAlign: "left",
							calibration: false,
							axisLine: true,
						}],
					},
					extra: {
						line: {
							type: "curve",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				Mean_value: "52.6",
				bmi: "18.9",
				weight_value: "2.96",
				weight: "增重速度",
				Detection_result: "您的身体数据均为正常,请继续保持",
				min_width: "50.1",
				max_width: "58.3",
				birthday: this.$t('shouye_item.title_21'),
				shousuoya: "",
				shuzhangya: "",
				maibo: "",

			};
		},

		onReady() {
			// this.getServerData();
			// this.getServerData2();
			// console.log(this.chartData2)
		},

		onNavigationBarButtonTap(e) {
			console.log(e)
			if (e.float === "left") {
				if (this.types == true) {
					this.types = false
				} else {
					this.types = true
				}
			} else {
				if (this.types === true) {
					uni.navigateTo({
						url: "../tendency/Historical_record"
					})
				} else {
					uni.navigateTo({
						url: "../tendency/Historical_record_2"
					})
				}

			}
		},


		// onBackPress() {
		// 	if (this.$refs.fab.isShow) {
		// 		this.$refs.fab.close()
		// 		return true
		// 	}
		// 	return false
		// },

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('qushi')
			})
		},

		onLoad() {
			this.bg()
		},




		methods: {
			//弹窗数据提交按钮
			truesss() {
				if (this.shuzhangya === "" || this.shuzhangya === undefined) {
					uni.showToast({
						title: this.$t('qushiitem.title_4'),
						icon: "none"
					})
					return
				} else if (this.shousuoya === "" || this.shousuoya === undefined) {
					uni.showToast({
						title: this.$t('qushiitem.title_5'),
						icon: "none"
					})
					return
				} else if (this.maibo === "" || this.maibo === undefined) {
					uni.showToast({
						title: this.$t('qushiitem.title_6'),
						icon: "none"
					})
					return
				} else {
					this.$refs.qs_popup.close()

				}
			},
			bg(bg) {
				if (bg === this.$t('qushiitem.title_7')) {
					return {
						background: "#58BF78"
					}
				} else if (bg === this.$t('qushiitem.title_8')) {
					return {
						background: "#FCCD41"
					}
				} else if (bg === this.$t('qushiitem.title_9')) {
					return {
						background: "#F55A5A"
					}
				}
			},

			bindDateChange(e) {
				this.date = e.detail.value.replace("-", "/").replace("-", "/")
			},
			bindDateChange1(e) {
				this.birthday = e.detail.value.replace("-", "/").replace("-", "/")
			},

			getServerData() {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						categories: ["08:26", "13:15", "15:35"],
						series: [{
								legendShape: "none",
								name: "",
								data: [90, 100, 120]
							},
							{
								legendShape: "none",
								name: "",
								data: [60, 80, 100]
							}
						]
					};
					this.chartData = JSON.parse(JSON.stringify(res));
				}, 500);
			},

			getServerData2() {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
					let res = {
						categories: ["8/28", "8/29", "8/30", "8/31", "9/1", "9/2", "9/3", ""],
						series: [{
							legendShape: "none",
							name: "",
							data: [53, 53.2, 54, 56, 52.2, 55, 56.6]
						}, ]
					};
					this.chartData2 = JSON.parse(JSON.stringify(res));
					console.log(this.chartData2)
				}, 500);

			},

			button_DAY() {
				this.DAY = true
				this.WEEK = false
				this.MON = false
				this.SIX_MON = false
				this.YEAR = false

			},
			button_WEEK() {
				this.DAY = false
				this.WEEK = true
				this.MON = false
				this.SIX_MON = false
				this.YEAR = false

			},
			button_MON() {
				this.DAY = false
				this.WEEK = false
				this.MON = true
				this.SIX_MON = false
				this.YEAR = false

			},
			button_SIX_MON() {
				this.DAY = false
				this.WEEK = false
				this.MON = false
				this.SIX_MON = true
				this.YEAR = false

			},
			button_YEAR() {
				this.DAY = false
				this.WEEK = false
				this.MON = false
				this.SIX_MON = false
				this.YEAR = true

			},


			fabClick() {
				this.$refs.qs_popup.open("center")
				// uni.navigateTo({
				// 	url: "../tendency/Add_new_data"
				// })
			},


			closess() {
				this.$refs.qs_popup.close()
			},
			trigger() {

			},


		}
	};
</script>

<style scoped>
	.title_all {
		height: 60px;
		padding: 30px 10px 10px 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: fixed;
		width: 100vw;
		top: 0;
		background: #F7F7F7;
	}



	.title {
		color: black;
		text-align: center;
		width: 85%;
		font-weight: bold;
		font-size: 16px;
	}

	.title2 {
		color: black;
		text-align: center;
		width: 85%;
		font-weight: bold;
		font-size: 16px;
	}

	.title_time {
		border-radius: 10px;
		background: #3298F7;
		width: 90%;
		display: flex;
		margin-left: 3%;
		padding: 5px;
		flex-direction: row;
	}

	.table_bg {
		background: white;
		margin: 15px;
		padding: 10px 15px 0 15px;
		border-radius: 20px;
	}

	.table_item_text {
		font-size: 18px;
		font-weight: bold;
		margin-top: 5px;
		margin-left: 15px;
	}

	.img_iocn_bg {
		width: 40px;
		height: 40px;
	}

	.xueya_type {
		width: 15px;
		height: 15px;
		border-radius: 10px;
		background: #258C41;
		margin-left: 10px;
	}

	.title_font_bg {
		margin-left: 5px;
		font-weight: bold
	}

	.title_type_bg {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 15px;
	}

	.border_bg {
		margin: 5px 10px 0 20px;
		background: gainsboro;
		width: 65vw;
		height: 1px;
	}

	.title_all_bg {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 10px;
		margin-right: 10px;
	}

	.text_item_bg {
		font-size: 12px;
		margin-left: 10px;
		margin-right: 10px;
		color: gray;
		width: 60px;
		margin-top: 5px;
		white-space: nowrap;
		overflow: auto;

	}




	.text_item_bg_1 {
		font-size: 16px;
		margin-left: 10px;
	}

	.icon_item_bg {
		display: flex;
		flex-direction: row;
		margin: 10px;
		padding: 10px 5px 10px 5px;
		background: white;
		border-radius: 20px;
	}
	.icon_item_bg_toast {
		text-align: center;
		margin: 20px 10px 10px 10px;
		color: #3298F7;
		padding: 15px 0 15px 0;
		background: white;
		border-radius: 15px;
	}

	.icon_item_bg_1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 5px;
	}

	.button_time_1 {
		width: 18%;
		height: 30px;
		font-size: 14px;
		color: black;
		display: flex;
		background: white;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
	}

	.button_time_2 {
		width: 18%;
		height: 30px;
		font-size: 14px;
		display: flex;
		background: none;
		justify-content: center;
		border: none;
		color: white;
		align-items: center;
	}

	.text_title_types_1 {
		margin-left: 10px;
		margin-right: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.text_title_types_2 {
		width: 100px;
		margin-top: 15px;
		text-align: center;
		font-size: 12px;
		white-space: nowrap;
		overflow: auto;
	}

	.view_bor {
		height: 30px;
		background: white;
		width: 1px;
		margin-left: 4px;
		margin-right: 4px;
	}

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		margin-top: 20px;
		width: 100%;
		height: auto;
		background: white;
	}

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box-2 {
		margin-top: 20px;
		padding: 5px;
		background: white;
		border-radius: 20px;
		width: 92vw;
		height: auto;
	}





	.tite_icon {
		background: #0686CC;
		width: 80px;
		text-align: center;
		color: white;
		border-top-left-radius: 20px;
		border-bottom-right-radius: 20px;
	}
</style>