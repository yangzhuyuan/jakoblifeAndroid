<template>
	<view class="page">


		<view style="margin-left: 20px;margin-right: 20px;">
			<text style="word-break: break-all;">{{ message }}</text>
		</view>
		<scroll-view class="list" scroll-y="true">
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
						text: "1.Sync phone time"
					},
					{
						text: "2.Step goal"
					},
					{
						text: "3.Sleep goal"
					},
					{
						text: "4.User info"
					},
					{
						text: "5.Skin color"
					},
					{
						text: "6.Unit"
					},
					{
						text: "7.NoDisturb"
					},
					{
						text: "8.Language"
					},
					{
						text: "9.Sedentary"
					},
					{
						text: "10.Wearing position"
					},
					{
						text: "11.Phone sysyem info"
					},
					{
						text: "12.AntiLost"
					},
					{
						text: "13.Info push(ANCS)"
					},
					{
						text: "14.Health monitoring(HR)"
					},
					{
						text: "15.Temperature monitoring(Deprecated)"
					},
					{
						text: "16.Heart rate alarm"
					},
					{
						text: "17.Blood pressure alarm"
					},
					{
						text: "18.Sp02 alarm"
					},
					{
						text: "19.Respiration rate alarm"
					},
					{
						text: "20.Temperature alarm"
					},
					{
						text: "21.Theme"
					},
					{
						text: "22.Wrist bright screen"
					},
					{
						text: "23.Sleep reminder"
					},
					{
						text: "24.Drink water reminder"
					}, {
						text: "25.Find Phone"
					}, {
						text: "26.setDeviceHealthMonitoringMode"
					}
				]
			};
		},

		methods: {
			onLoad() {
				_this = this;
				//判断是安卓和ios系统
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
						//设置系统时间
						ble.setDeviceSyncPhoneTime((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 1:
						//设置不是目标，参数是步数目标
						ble.setDeviceStepGoal(10000, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 2:
						//设置睡眠目标,参数是一个数组，包括小时和分钟
						ble.setDeviceSleepGoal([8, 30], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 3:
						//设置个人信息，包括身高，体重，性别0代表男性，1代表女性，年龄
						ble.setDeviceUserInfo([170, 65, 1, 18], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 4:
						//设置肤色，参数是等级
						ble.setDeviceSkinColor(0, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 5:
						//设置单位，包括距离单位，体重单位，体温单位，时间单位，血糖单位，尿酸单位
						ble.setDeviceUnit([0, 0, 0, 0, 0, 0], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 6:
						//设置勿扰，第一个参数位true打开勿扰，false关闭勿扰，第二个参数和第三个参数代表勿扰开始时间的小时和分钟，第四个参数和第五个参数代表勿扰结束时间的小时和分钟
						ble.setDeviceNotDisturb([true, 9, 30, 12, 0], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 7:
						//设置语言，参数0代表英语，1代表中文
						ble.setDeviceLanguage(0, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 8:
						ble.setDeviceSedentary([9, 30, 12, 0, 14, 0, 18, 30, 30], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 9:
						//设置左右手佩戴，0代表左手，1代表右手
						ble.setDeviceWearingPosition(0, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 10:
						ble.setPhoneSystemInfo([0, "0"], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 11:
						ble.setDeviceAntiLost(true, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 12:
						ble.setDeviceInfoPush([0, 1], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 13:
						ble.setDeviceHealthMonitoringMode([0, 0], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 14:
						ble.setDeviceTemperatureMonitoringMode([0, 0], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 15:
						ble.setDeviceHeartRateAlarm([0, 0, 0], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 16:
						ble.setDeviceBloodPressureAlarm([160, 120, 80, 60], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 17:
						ble.setDeviceBloodOxygenAlarm([0, 0], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 18:
						ble.setDeviceRespirationRateAlarm([30, 6], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 19:
						ble.setDeviceTemperatureAlarm(["37.3", "33"], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 20:
						ble.queryDeviceTheme(0, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 21:
						ble.setDeviceWristBrightScreen(true, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 22:
						ble.setDeviceSleepReminder([22, 30], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 23:
						ble.setDevicePeriodicReminderTask([9, 30, 18, 0, 0], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 24:
						console.log("找手机开关设置");
						ble.settingFindPhone(1, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = "操作成功";
						});
						break;
					case 25:
						console.log("设置检测模式");
						ble.setDeviceHealthMonitoringMode([1, 20], (res) => {
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