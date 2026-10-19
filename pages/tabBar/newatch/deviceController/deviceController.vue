<template>
	<view class="page">

		<view style="margin-left: 20px;margin-right: 20px;">
			<text style="word-break: break-all;">{{ message }}</text>
		</view>

		<scroll-view class="border list" scroll-y="true">
			<view v-for="(item,index) in settingList" :key="index" class="list-item" @click="settingItemClick(index)">
				<text class="text">{{item.text}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		MeasureState,
		MeasureHealthDataType
	} from '../util/ycHealthConstants.js';
	import {
		requireYcBle
	} from '../util/ycBleAliases.js';

	var ble;
	var systemInfo;
	var _this;
	export default {
		data() {
			return {
				title: 'Setting',
				message: "",
				settingList: [{
						text: "1.Add photo on"
					},
					{
						text: "2.Add photo off"
					},
					{
						text: "3.Start run"
					},
					{
						text: "4.Stop run"
					},
					{
						text: "5.Start measure heart rate"
					},
					{
						text: "6.Stop measure heart rate"
					},
					{
						text: "7.Start measure blood pressure"
					},
					{
						text: "8.Stop measure blood pressure"
					},
					{
						text: "9.Start measure blood oxygen"
					},
					{
						text: "10.Stop measure blood oxygen"
					},
					{
						text: "11.Start measure temperature"
					},
					{
						text: "12.Stop measure temperature"
					},
					{
						text: "13.Start measure pressure"
					},
					{
						text: "14.Stop measure pressure"
					},
					{
						text: "15.Start measure blood glucose"
					},
					{
						text: "16.Stop measure blood glucose"
					},
					{
						text: "17.Start measure hrv"
					},
					{
						text: "18.Stop measure hrv"
					},
					{
						text: "19.10.4 一键测量示例 [0,1] 停止血压"
					}
				],
				MeasureState,
				MeasureHealthDataType,
				deviceSportState: [{
					stop: 0
				}, {
					start: 1
				}, {
					pause: 2
				}, {
					continueSport: 3
				}],
				deviceSportType: [{
						none: 0
					},
					{
						run: 0x01
					},
					{
						swimming: 0x02
					},
					{
						riding: 0x03
					},
					{
						fitness: 0x04
					},
					{
						ropeskipping: 0x06
					},
					{
						playball: 0x07
					},
					{
						walk: 0x08
					},
					{
						badminton: 0x09
					},
					{
						football: 0x0A
					},
					{
						mountaineering: 0x0B
					},
					{
						pingPang: 0x0C
					},
					{
						freeMode: 0x0D
					},
					{
						indoorRunning: 0x0E
					},
					{
						outdoorRunning: 0x0F
					},
					{
						outdoorWalking: 0x10
					},
					{
						indoorWalking: 0x11
					},
					{
						runMode: 0x12
					},
					{
						indoorRiding: 0x13
					},
					{
						stepper: 0x14
					},
					{
						rowingMachine: 0x15
					},
					{
						realTimeMonitoring: 0x16
					},
					{
						situps: 0x17
					},
					{
						jumping: 0x18
					},
					{
						weightTraining: 0x19
					},
					{
						yoga: 0x1A
					},
					{
						onfoot: 0x1B
					},
					{
						volleyball: 0x1C
					},
					{
						kayak: 0x1D
					},
					{
						rollerSkating: 0x1E
					},
					{
						tennis: 0x1F
					},
					{
						golf: 0x20
					},
					{
						ellipticalMachine: 0x21
					},
					{
						dance: 0x22
					},
					{
						rockClimbing: 0x23
					},
					{
						aerobics: 0x24
					},
					{
						otherSports: 0x25
					}
				],

			};
		},

		methods: {
			onLoad() {
				_this = this;
				_this.isAndroidOrIOS();
				ble = requireYcBle();
				ble.initPlugin((res) => {
					console.log("initPlugin" + res.message);
				});
				var globalEvent = uni.requireNativePlugin('globalEvent');

				var eventName = "deviceMeasurementResult";
				if (systemInfo == "ios") {
					eventName = "YCDeviceControlTypeHealthDataMeasurementResult";
				}
				console.log("eventName:" + eventName);
				globalEvent.addEventListener(eventName, function(res) {
					console.log("测量" + JSON.stringify(res));
				});

				globalEvent.addEventListener('HeartEvent', function(res) {
					console.log("心率数据" + JSON.stringify(res));
				});
				globalEvent.addEventListener('bloodOxygenEvent', function(res) {
					console.log("血氧数据" + JSON.stringify(res));
				});
				globalEvent.addEventListener('bloodPressureEvent', function(res) {
					console.log("血压数据" + JSON.stringify(res));
				});
				globalEvent.addEventListener('tempEvent', function(res) {
					console.log("体温和血糖数据" + JSON.stringify(res));
				});
				globalEvent.addEventListener('BloodDataEvent', function(res) {
					console.log("充气血压数据" + JSON.stringify(res));
				});
				globalEvent.addEventListener('sportDataEvent', function(res) {
					console.log("运动数据" + JSON.stringify(res));
				});
			},
			isAndroidOrIOS() {
				let type = uni.getSystemInfoSync().platform
				switch (type) {
					case 'android':
						systemInfo = "android";
						break;
					case 'ios':
						systemInfo = "ios";
						break;
					default:
						systemInfo = "other";
						break;
				}
			},
			settingItemClick(index) {
				console.log("点击index:" + index + ",text:" + _this.settingList[index].text);
				uni.showLoading({
					title: '加载中'
				});
				switch (index) {
					case 0:
						ble.appControlTakePhoto(true, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 1:
						ble.appControlTakePhoto(false, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 2:

						ble.appControlSport([_this.deviceSportState[1].start, _this.deviceSportType[1].run], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "开始运动成功";
						});
						break;
					case 3:
						uni.hideLoading();
						ble.appControlSport([_this.deviceSportState[0].stop, _this.deviceSportType[1].run], (res) => {
							console.log(res.data);
						});
						_this.message = "停止运动成功";
						break;
					case 4:
						// 10.4 开始单次测心率 [state=1, dataType=0]
						ble.appControlMeasureHealthData([MeasureState.single, MeasureHealthDataType.heartRate], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
							console.log("code:" + res.code);
						});
						break;
					case 5:
						ble.appControlMeasureHealthData([MeasureState.off, MeasureHealthDataType.heartRate], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 6:
						// 开始测血压（插件无 appStartBloodMeasurement，用 10.4 一键测量）
						ble.appControlMeasureHealthData([MeasureState.single, MeasureHealthDataType.bloodPressure], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
							console.log("code:" + res.code);
						});
						break;
					case 7:
						ble.appControlMeasureHealthData([MeasureState.off, MeasureHealthDataType.bloodPressure], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 8:
						ble.appControlMeasureHealthData([MeasureState.single, MeasureHealthDataType.bloodOxygen], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 9:
						ble.appControlMeasureHealthData([MeasureState.off, MeasureHealthDataType.bloodOxygen], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 10:
						ble.appControlMeasureHealthData([MeasureState.single, MeasureHealthDataType.bodyTemperature], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 11:
						ble.appControlMeasureHealthData([MeasureState.off, MeasureHealthDataType.bodyTemperature], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 12:
						ble.appControlMeasureHealthData([MeasureState.single, MeasureHealthDataType.pressure], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 13:
						ble.appControlMeasureHealthData([MeasureState.off, MeasureHealthDataType.pressure], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 14:
						ble.appControlMeasureHealthData([MeasureState.single, MeasureHealthDataType.bloodGlucose], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 15:
						ble.appControlMeasureHealthData([MeasureState.off, MeasureHealthDataType.bloodGlucose], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 16:
						ble.appControlMeasureHealthData([MeasureState.single, MeasureHealthDataType.hrv], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 17:
						ble.appControlMeasureHealthData([MeasureState.off, MeasureHealthDataType.hrv], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 18:
						// 文档示例：ble.appControlMeasureHealthData([0,1], ...) => 停止血压测量
						ble.appControlMeasureHealthData([0, 1], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					default:
						uni.hideLoading();
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		padding-top: 20px;
		padding-bottom: 20px;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-content: flex-start;
		align-items: flex-start;

	}

	.list {
		margin-top: 100px;
		margin-bottom: 100px;

		.list-item {
			background-color: #f8f8f8;

			.text {
				height: 50px;
				line-height: 50px;
				margin-left: 20px;
				color: #003366;
			}
		}
	}

	.log {
		width: 87vw;
		font-size: 13px;
		color: #003366;

		.log-bottom {
			height: 10vw;
		}
	}
</style>