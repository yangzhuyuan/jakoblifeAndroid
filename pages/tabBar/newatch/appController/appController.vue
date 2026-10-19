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
	var ble;
	var systemInfo;
	var _this;
	export default {
		data() {
			return {
				title: 'Setting',
				message: "",
				settingList: [{
						text: "1.Find device"
					},
					{
						text: "2.System operator"
					},
					{
						text: "3.BloodPressure calibration"
					},
					{
						text: "4.Temperature calibration"
					},
					{
						text: "5.Blood glucose calibration"
					},
					{
						text: "6.Today weather"
					},
					{
						text: "7.Tomorrow weather"
					},
					{
						text: "8.UricAcid calibration"
					},
					{
						text: "9.BloodFat calibration"
					},
					{
						text: "10.Android Push Notifications"
					},
					{
						text: "11.Set business card"
					},
					{
						text: "12.Query business card"
					},
					{
						text: "13.Set JL Contacts"
					},
					{
						text: "14.Query JL Contacts"
					},
					{
						text: "15.Real data upload"
					},
					{
						text: "16.Menstrual cycle"
					},
					{
						text: "17.UUID"
					},
					{
						text: "18.YC Contacts"
					}
				]
			};
		},

		methods: {
			onLoad() {
				_this = this;
				_this.isAndroidOrIOS();
				if (systemInfo == "android") {
					ble = uni.requireNativePlugin('bluetooth-ycSdkPlugin');
				} else {
					ble = uni.requireNativePlugin('DCTestUniPlugin');
				}
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
						ble.findDevice([0, 1], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 1:
						ble.deviceSystemOperator(0, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 2:
						ble.bloodPressureCalibration([120, 80], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 3:
						ble.temperatureCalibration((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 4:
						ble.bloodGlucoseCalibration([1, "7.2"], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 5:
						ble.sendTodayWeather([1, 20, 18, 12], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 6:
						ble.sendTomorrowWeather([1, 20, 18, 12], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 7:
						ble.uricAcidCalibration(800, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 8:
						ble.bloodFatCalibration("5.6", (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 9:
						ble.appPushNotifications([3, "你好", "吃了吗？"], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 10:
						ble.sendBusinessCard([3, "https://me.wechat/xxxx"], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 11:
						ble.queryBusinessCard(3, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 12:
						ble.updateJieLiDeviceContacts([{
							name: "111",
							phone: "12345678"
						}, {
							name: "222",
							phone: "12345678"
						}], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 13:
						ble.queryJieLiDeviceContacts((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 14:
						ble.realTimeDataUpload([0, 1], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 15:
						ble.sendDeviceMenstrualCycle([1000, 3, 28], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 16:
						ble.sendPhoneUUIDToDevice("ABCD-1234678-4321-1131321", (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 17:
						ble.updateDeviceContacts([{
							name: "111",
							phone: "12345678"
						}, {
							name: "222",
							phone: "12345678"
						}], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					default:
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