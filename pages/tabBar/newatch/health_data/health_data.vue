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
	var systemInfo;
	var ble;
	var _this;
	var isRun = false;
	export default {
		data() {
			return {
				title: 'Health Data',
				message: "",
				settingList: [
					// {
					// 	text: "0.实时步数"
					// }, 
					{
						text: "1.Query Step"
					},
					{
						text: "2.Query Sleep"
					},
					{
						text: "3.Query Heart rate"
					},
					{
						text: "4.Query Blood pressure"
					},
					{
						text: "5.Query CombinedData"
					},
					{
						text: "6.Query InvasiveComprehensiveData"
					},
					{
						text: "7.Query Sport mode record"
					},
					{
						text: "8.Query Body Index data"
					},
					{
						text: "9.Delete Step"
					},
					{
						text: "10.Delete Sleep"
					},
					{
						text: "11.Delete Heart rate"
					},
					{
						text: "12.Delete Blood pressure"
					},
					{
						text: "13.Delete CombinedData"
					},
					{
						text: "14.Delete InvasiveComprehensiveData"
					},
					{
						text: "15.Delete Sport mode record"
					},
					{
						text: "16.Delete Body Index data"
					}
				]
			};
		},

		methods: {
			onLoad() {
				_this = this;
				_this.isAndroidOrIOS();
				if (systemInfo == "android") {
					console.log("android");
					ble = uni.requireNativePlugin('bluetooth-ycSdkPlugin');
				} else {
					console.log("ios");
					ble = uni.requireNativePlugin('DCTestUniPlugin');
				}
				console.log("initPlugin");
				ble.initPlugin((res) => {
					console.log("initPlugin" + res.message);
				});
				_this.isRun = false;
				var globalEvent = uni.requireNativePlugin('globalEvent');
				console.log("globalEvent");
				var eventName = "sportRealDataEvent";
				var eventName2 = "sportRealDataEvent2";
				var eventName3 = "";
				if (systemInfo == "ios") {
					eventName = "YCReceivedRealTimeDataTypeStep";
					eventName2 = "YCReceivedRealTimeDataTypeRealTimeMonitoringMode";
					eventName3 = "YCDeviceBleDeviceStateChange";
				}
				if (systemInfo == "ios") {
					ble.removeEventListener(eventName);
				} else {
					globalEvent.removeEventListener(eventName);
				}
				globalEvent.addEventListener(eventName, function(res) {

					_this.isRun = false;
					if (!_this.isRun) {
						console.log("实时步数" + JSON.stringify(res));
						_this.updateText(JSON.stringify(res), false);
					}
				});
				globalEvent.addEventListener(eventName2, function(res) {
					globalEvent.removeEventListener(eventName);
					_this.isRun = true;
					if (_this.isRun) {
						console.log("运动数据" + JSON.stringify(res));
						_this.updateText(JSON.stringify(res), true);
					}
				});
				console.log("3333333" + eventName3);
				globalEvent.addEventListener(eventName3, function(res) {
					console.log("蓝牙状态" + JSON.stringify(res));
					_this.updateText(JSON.stringify(res), true);

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
			updateText(res, flag) {
				if (flag) {
					_this.message = "运动数据:" + JSON.stringify(res);
				} else {
					_this.message = "实时步数:" + JSON.stringify(res);
				}

			},
			showFailed(code, res) {
				_this.message = res;
				if (code == 0) {
					uni.showToast({
						title: '操作成功',
						duration: 2000
					});
				} else {
					uni.showToast({
						title: '操作失败',
						duration: 2000
					});
				}
			},
			settingItemClick(index) {
				console.log("点击index:" + index + ",text:" + _this.settingList[index].text);
				uni.showLoading({
					title: '加载中'
				});
				switch (index) {
					case 0:
						ble.queryDeviceHealthData(0, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 1:
						try {
							ble.queryDeviceHealthData(1, (res) => {
								uni.hideLoading();
								console.log(JSON.stringify(res.data));
								_this.showFailed(res.code, res.data);
							});
						} catch (e) {
							console.log(e);
						}
						break;
					case 2:
						ble.queryDeviceHealthData(2, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 3:
						ble.queryDeviceHealthData(3, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 4:
						ble.queryDeviceHealthData(4, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 5:
						ble.queryDeviceHealthData(5, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 6:
						ble.queryDeviceHealthData(6, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 7:
						ble.queryDeviceHealthData(7, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 8:
						ble.deleteDeviceHealthData(1, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 9:
						ble.deleteDeviceHealthData(2, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 10:
						ble.deleteDeviceHealthData(3, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 11:
						ble.deleteDeviceHealthData(4, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 12:
						ble.deleteDeviceHealthData(5, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 13:
						ble.deleteDeviceHealthData(6, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 14:
						ble.deleteDeviceHealthData(7, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
						});
						break;
					case 15:
						ble.deleteDeviceHealthData(8, (res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res.data));
							_this.showFailed(res.code, res.data);
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