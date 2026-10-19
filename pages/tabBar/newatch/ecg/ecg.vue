<template>
	<view class="page">

		<view style="margin-left: 20px;margin-right: 20px;">
			<text style="word-break: break-all;">{{ countDownText }}</text>
		</view>
		<view style="margin-left: 20px;margin-right: 20px;margin-top: 8px;">
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
		requireYcBle
	} from '../util/ycBleAliases.js';

	var systemInfo;
	var ble;
	var _this;
	export default {
		data() {
			return {
				title: 'Setting',
				message: "",
				ecgPacketCount: 0,
				ecgSampleCount: 0,
				settingList: [{
					text: "开始测量ECG",
				}, {
					text: "ECG数据查询",
				}, {
					text: "ECG测量结果获取",
				}, {
					text: "ECG历史记录",
				}, {
					text: "9.28 查询设备收集信息(ECG)",
				}],
				// 9.28 type: 0 ECG / 1 PPG / 2 三轴加速度 / 3 六轴 / 4 九轴 / 5 磁力计 / 6 充气血压
				collectDataType: {
					ecg: 0x00,
					ppg: 0x01,
					acc3: 0x02,
					sixAxis: 0x03,
					nineAxis: 0x04,
					magnetometer: 0x05,
					inflatableBp: 0x06
				},
				countDown: 60, // 初始倒计时时间，单位秒
				timer: null, // 计时器对象
				countDownText: '倒计时未开始'
			};
		},

		methods: {
			onLoad() {
				_this = this;
				_this.initMethods();
				var globalEvent = uni.requireNativePlugin('globalEvent');
				globalEvent.addEventListener("ecgEvent", function(res) {
					console.log(JSON.stringify(res.data));
					_this.onEcgPacket(res);
				});
				uni.$on('yc-ecg-realtime', _this.onEcgPacket);
			},
			onUnload() {
				uni.$off('yc-ecg-realtime', _this.onEcgPacket);
				if (_this.timer) {
					clearInterval(_this.timer);
					_this.timer = null;
				}
			},
			onEcgPacket(payload) {
				_this.ecgPacketCount += 1;
				let samples = 0;
				try {
					const raw = payload && (payload.data != null ? payload.data : payload);
					const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
					if (Array.isArray(arr)) {
						samples = arr.length;
						_this.ecgSampleCount += samples;
					}
				} catch (e) {}
				_this.message = 'ECG实时1541 包=' + _this.ecgPacketCount +
					' 本包采样=' + samples +
					' 累计采样=' + _this.ecgSampleCount;
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
			initMethods() {

				//判断是安卓和ios系统
				_this.isAndroidOrIOS();
				ble = requireYcBle();
				console.log("initPlugin start123" + ble);
				console.log("appEcgTestStart:" + typeof ble.appEcgTestStart);
				//初始化插件
				ble.initPlugin((res) => {
					console.log("initPlugin" + res.message);

				});
				console.log("initPlugin end")
			},
			settingItemClick(index) {
				console.log("点击index:" + index + ",text:" + _this.settingList[index].text);
				if (!ble) {
					uni.showToast({
						title: '插件未初始化',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '加载中'
				});
				switch (index) {
					case 0:
						//开始ecg测量（appEcgTestStart = startECGMeasurement 别名）
						_this.countDown = 60;
						_this.ecgPacketCount = 0;
						_this.ecgSampleCount = 0;
						_this.countDownText = '倒计时 60 秒';
						ble.appEcgTestStart((res) => {
							uni.hideLoading();
							console.log("开始测量ECG数据:" + JSON.stringify(res));
							console.log(res && res.data);
							_this.message = JSON.stringify(res);
							//60秒倒计时
							_this.startCountDown();
						});
						break;
					case 1:
						// ECG历史基本信息（dataType=0 表示ECG）
						ble.queryCollectDataBasicInfo(0, (res) => {
							uni.hideLoading();
							console.log("ECG数据查询:" + JSON.stringify(res));
							_this.message = JSON.stringify(res);
						});
						break;
					case 2:
						// 7.3 获取ECG结果（文档 getAIDiagnosisResult = 插件 getECGResult）
						ble.getAIDiagnosisResult((res) => {
							uni.hideLoading();
							console.log(res);
							console.log("ecg结果:" + JSON.stringify(res));
							_this.message = JSON.stringify(res);
						});
						break;
					case 3:
						// 7.4 同步ECG/PPG历史列表（文档 collectEcgList）
						ble.collectEcgList((res) => {
							uni.hideLoading();
							console.log(res);
							console.log("ecg历史记录:" + JSON.stringify(res));
							_this.message = JSON.stringify(res);
						});
						break;
					case 4:
						// 9.28 查询设备收集信息：[type, index]，type=0 ECG，index 从列表取；示例同步第 1 条
						ble.queryCollectDataInfo([_this.collectDataType.ecg, 1], (res) => {
							uni.hideLoading();
							console.log(res);
							console.log("9.28 queryCollectDataInfo code:" + (res && res.code));
							_this.message = res && res.data;
							if (res && res.code === 0) {
								uni.showToast({
									title: '操作成功',
									duration: 2000
								});
							} else {
								uni.showToast({
									title: '操作失败',
									icon: 'none',
									duration: 2000
								});
							}
						});
						break;
					default:
						uni.hideLoading();
						break;
				}
			},
			startCountDown() {
				if (_this.timer) {
					clearInterval(_this.timer);
					_this.timer = null;
				}
				_this.timer = setInterval(() => {
					if (_this.countDown > 0) {
						_this.countDown--; // 每秒减少1
						_this.countDownText = `倒计时 ${_this.countDown} 秒（包${_this.ecgPacketCount}）`;
						console.log("countDown:" + _this.countDown);
					} else {
						console.log("countDown结束:" + _this.countDown);
						clearInterval(_this.timer); // 倒计时结束，清除计时器
						_this.timer = null;
						_this.countDownText = '测量结束，获取诊断结果…';
						//倒计时结束，停止测量（appEcgTestEnd = stopECGMeasurement 别名）
						ble.appEcgTestEnd((res) => {
							uni.hideLoading();
							console.log(JSON.stringify(res));
							_this.message = JSON.stringify(res);
							// 7.3 获取ecg测量结果
							ble.getAIDiagnosisResult((resultRes) => {
								console.log(resultRes);
								console.log("ecg结果:" + JSON.stringify(resultRes));
								_this.message = JSON.stringify(resultRes);
								_this.countDownText = '诊断结果已返回';
							});
						});
					}
				}, 1000); // 每秒钟执行一次
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