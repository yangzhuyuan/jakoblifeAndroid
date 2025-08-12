<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				timer: null, //定时器名称
				lastx: 0,
				lasty: 0,
				lastz: 0,
				lastTime: 0,
				stepCount: 0,
				notifyTriggered: false, // 初始化通知标志
				intervalId: null, // 用于存储定时器的 ID
			}
		},


		onLaunch: function() {
			let that = this
			// 根据手机系统设置app语言
			const lan = uni.getLocale();
			let locale = "zh-CN"; // 默认语言设置为中文
			switch (lan) {
				case 'en':
				case 'en-US':
					locale = "en-US";
					break;
				case 'zh-Hans':
					locale = "zh-CN";
					break;
			}
			that._i18n.locale = locale;
			//关闭启动图
			setTimeout(() => {
				plus.navigator.closeSplashscreen()
			}, 1000)
		},

		onHide() {
			this.stopInterval();
			this.startInterval();
		},

		mounted() {
			this.notifyTriggered = false; // 确保初始值为 false
		},

		onShow: function() {
			let that = this
			const permissions = ['android.permission.ACCESS_FINE_LOCATION',
				'android.permission.ACCESS_COARSE_LOCATION', 'android.permission.BLUETOOTH_ADVERTISE',
				'android.permission.BLUETOOTH', 'android.permission.BLUETOOTH_ADMIN',
				'android.permission.BLUETOOTH_ADVERTISE', 'android.permission.BLUETOOTH_CONNECT',
			]
			let timesder = setInterval(res => {
				if (uni.getStorageSync("token")) {
					clearInterval(timesder)
					that.checkNotificationPermissions(permissions);
				}
			}, 2000)
			plus.runtime.setBadgeNumber(0);
			that.stopInterval();
			that.startInterval();
			that.setTabBarItems();
			that.accelerometerStart();

		},

		globalData: {
			test: ''
		},

		methods: {
			...mapMutations(['setUniverifyErrorMsg', 'setUniverifyLogin', 'setlanyaId']),
			//获取手机权限
			checkNotificationPermissions(permissions) {
				// 申请通知权限
				plus.android.requestPermissions(permissions, function(e) {
					if (e.deniedAlways.length > 0) { //权限被永久拒绝
						uni.setStorageSync("appQX", "0")
						// 弹出提示框解释为何需要定位权限，引导用户打开设置页面开启
						const Intent = plus.android.importClass('android.content.Intent');
						const Build = plus.android.importClass('android.os.Build');
						let intent;
						if (Build.VERSION.SDK_INT >= 33) { // Android 13 及以上
							intent = new Intent('android.settings.ACTION_APP_NOTIFICATION_SETTINGS');
							intent.putExtra('android.provider.extra.APP_PACKAGE', main.getPackageName());
						} else if (Build.VERSION.SDK_INT >= 26) { // Android 8.0 及以上
							intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
							intent.putExtra('android.provider.extra.APP_PACKAGE', main.getPackageName());
						} else if (Build.VERSION.SDK_INT >= 21) { // Android 5.0 - 7.0
							intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
							intent.putExtra('app_package', main.getPackageName());
							intent.putExtra('app_uid', main.getApplicationInfo().uid);
						} else {
							intent = new Intent('android.settings.APPLICATION_DETAILS_SETTINGS');
							intent.setData(plus.android.net.Uri.fromParts('package', main.getPackageName(),
								null));
						}
						main.startActivity(intent);
						return
					}
					if (e.deniedPresent.length > 0) { //权限被临时拒绝
						// 弹出提示框解释为何需要定位权限，可再次调用plus.android.requestPermissions申请权限
					}
					if (e.granted.length > 0) { //权限被允许
						uni.setStorageSync("appQX", "1")
					}
				}, function(e) {});
			},

			// 发送推送消息
			sendPushMessage(pushClientId) {
				const now = new Date(); // 获取当前时间
				const houres = now.getHours() < 10 ? "0" + now.getHours() : now.getHours()
				const Minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()
				const Seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()
				const timestamp = now.toLocaleDateString() + " " + houres + ":" + Minutes + ":" + Seconds;
				uniCloud.callFunction({
						name: "testUniPush", // 云函数名称
						data: {
							cids: pushClientId, // 使用存储的设备 CID（接收者cid）
							title: "jakobLife",
							content: this.$t("测量通知") + timestamp,
							request_id: "",
							timestamp: timestamp
						}
					})
					.then((dataRes) => {
						this.notifyTriggered = false
					})
					.catch((err) => {
						this.notifyTriggered = false
						uni.showToast({
							title: err.errMsg,
							icon: "none"
						})
					})
			},
			//闹钟
			naozhog() {
				let that = this
				let week = that.week(new Date().toDateString())
				that.timer = setInterval(function() {
					let houres = new Date().getHours() < 10 ? "0" + new Date()
						.getHours() : new Date().getHours()
					let minutes = new Date().getMinutes() < 10 ? "0" + new Date()
						.getMinutes() : new Date()
						.getMinutes()
					let time = houres + ":" + minutes
					// 放入你自己的业务逻辑代码
					uni.getStorageInfo({
						success(resssd) {
							if (resssd.keys.includes("tixing")) {
								let autiolist = uni.getStorageSync("tixing")
								for (let i = 0; autiolist.length > i; i++) {
									if (autiolist[i].switch === true &&
										autiolist[i].weekly.includes(
											week) && autiolist[i].times ===
										time) {
										if (autiolist[i].Audios == "雷达(默认)") {
											if (uni.getSystemInfoSync()
												.platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/lieda.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'/static/autio/lieda.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											}
										} else if (autiolist[i].Audios ==
											"波浪") {
											if (uni.getSystemInfoSync()
												.platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/bolang.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'/static/autio/bolang.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											}
										} else if (autiolist[i].Audios ==
											"倒影") {
											if (uni.getSystemInfoSync()
												.platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/daoying.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'/static/autio/daoying.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											}
										} else if (autiolist[i].Audios ==
											"灯塔") {
											if (uni.getSystemInfoSync().platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/dengta.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'/static/autio/dengta.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											}
										} else if (autiolist[i].Audios ==
											"山顶") {
											if (uni.getSystemInfoSync()
												.platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/shanding.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'/static/autio/shanding.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											}
										} else if (autiolist[i].Audios ==
											"水晶") {
											if (uni.getSystemInfoSync()
												.platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/shuijing.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay =
													true;
												innerAudioContext.src =
													'/static/autio/shuijing.mp3';
												innerAudioContext.onPlay(
													() => {});
												innerAudioContext.onError((
													res) => {});
											}
										}
									}
								}
							}
						}
					})
				}, 3000);
			},
			startInterval() {
				// 启动定时器
				this.intervalId = setInterval(this.receiver_list, 5000);
			},
			stopInterval() {
				// 停止定时器
				if (this.intervalId) {
					clearInterval(this.intervalId);
					this.intervalId = null; // 清空定时器 ID
				}
			},
			//查看别人分享给我的数据点列表
			receiver_list() {
				let that = this
				uni.request({
					url: that.$url_receiver_list,
					method: 'POST',
					data: {
						receiverId: uni.getStorageSync("userid")
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						if (pending.data.code === 200 && pending.data.data && pending.data.data.length > 0) {
							let pendingDevices = pending.data.data;
							that.notifyTriggered = false
							uni.getStorageInfo({
								success(res) {
									if (res.keys.includes("switchList")) {
										if (uni.getStorageSync("switchList").length === pendingDevices
											.length) {
											const shuzhangya1 = uni.getStorageSync("shuzhangyaId1")
											const shuzhangya2 = uni.getStorageSync("shuzhangyaId2")
											const shousuoya1 = uni.getStorageSync("shousuoyaId1")
											const shousuoya2 = uni.getStorageSync("shousuoyaId2")
											const maibo1 = uni.getStorageSync("maiboId1")
											const maibo2 = uni.getStorageSync("maiboId2")
											const xeuyang1 = uni.getStorageSync("xeuyang1")
											const xeuyang2 = uni.getStorageSync("xeuyang2")
											// 判断设备数量是否一致
											const storedDevices = uni.getStorageSync("switchList") || [];
											if (storedDevices.length === pendingDevices.length) {
												// 创建快速查找映射
												const pendingMap = new Map(pendingDevices.map(d => [d
													.sharerId, d
												]));
												// 更新 storedDevices 中的 registerVal 值
												const updatedDevices = storedDevices.map(storedDevice => {
													const pendingDevice = pendingMap.get(
														storedDevice.sharerId);
													if (!pendingDevice) return storedDevice;
													const updatedDataPoints = storedDevice
														.dataPoints.flatMap(dp => {
															const pendingDataPoints =
																pendingDevice.dataPoints
																.filter(pdp => pdp.register ===
																	dp.register);
															if (pendingDataPoints.length > 0) {
																// 为每个匹配的 pendingDataPoint 创建一个新的 dp 对象
																return pendingDataPoints.map(
																	pendingDataPoint => ({
																		...dp,
																		registerVal: pendingDataPoint
																			.registerVal
																	}));
															} else {
																// 如果没有匹配项，保留原始的 dp 对象
																return dp;
															}
														});
													return {
														...storedDevice,
														dataPoints: updatedDataPoints
													};
												});
												// 如果数据发生变化，保存更新后的数据到本地存储
												uni.setStorageSync("switchList", updatedDevices);
												// 保存原始副本
												const originalData = JSON.parse(JSON.stringify(
													storedDevices));
												// 检查数据是否发生变化
												let hasDataChanged = false;
												for (let i = 0; i < updatedDevices.length; i++) {
													if (updatedDevices[i].swicth === true) {
														// 找到原始数据中对应的设备
														const originalDevice = originalData.find(device =>
															device.sharerId === updatedDevices[i]
															.sharerId);
														if (!originalDevice) {
															// 如果原始数据中没有找到对应的设备，说明数据发生了变化
															hasDataChanged = true;
															break;
														}
														// 比较 dataPoints 是否发生变化
														const originalDataPoints = originalDevice
															.dataPoints;
														const updatedDataPoints = updatedDevices[i]
															.dataPoints;

														if (originalDataPoints.length !== updatedDataPoints
															.length) {
															// 如果 dataPoints 数组长度不同，说明数据发生了变化
															hasDataChanged = true;
															break;
														}
														for (let j = 0; j < originalDataPoints
															.length; j++) {
															const originalPoint = originalDataPoints[j];
															const updatedPoint = updatedDataPoints.find(
																point => point.register ===
																originalPoint.register);
															if (!updatedPoint) {
																// 如果更新后的 dataPoints 中没有找到对应的字段，说明数据发生了变化
																hasDataChanged = true;
																break;
															}
															if (originalPoint.registerVal !== updatedPoint
																.registerVal) {
																// 如果字段值发生变化，说明数据发生了变化
																hasDataChanged = true;
																break;
															}
														}
														if (hasDataChanged) {
															break; // 如果发现变化，退出循环
														}
													}
												}
												if (hasDataChanged) {
													let aaa = uni.getStorageSync("switchList")
													let bbb = []
													// 保存更新后的数据到本地存储
													for (let i = 0; aaa.length > i; i++) {
														for (let aa = 0; aaa[i].dataPoints.length >
															aa; aa++) {
															if (aaa[i].dataPoints[aa].register ===
																"lowPressure") {
																const lowPressure = parseInt(aaa[i]
																	.dataPoints[aa].registerVal);
																if (shuzhangya1 <= lowPressure &&
																	shuzhangya2 >= lowPressure) {
																	aaa[i].jingbaoshow1 = false
																	aaa[i].jingbao1 = lowPressure + "mmHg"
																} else {
																	aaa[i].jingbaoshow1 = true
																	aaa[i].jingbao1 = lowPressure + "mmHg"
																	that.notifyTriggered = true
																}
															}
															if (aaa[i].dataPoints[aa].register ===
																"highPressure") {
																const highPressure = parseInt(aaa[i]
																	.dataPoints[aa].registerVal);
																if (shousuoya1 <= highPressure &&
																	shousuoya2 >= highPressure) {
																	aaa[i].jingbaoshow2 = false
																	aaa[i].jingbao2 = highPressure + "mmHg"
																} else {
																	aaa[i].jingbaoshow2 = true
																	aaa[i].jingbao2 = highPressure + "mmHg"
																	that.notifyTriggered = true
																}
															}
															if (aaa[i].dataPoints[aa].register ===
																"heartrate") {
																const heartrate = parseInt(aaa[i]
																	.dataPoints[aa].registerVal);
																if (maibo1 <= heartrate && maibo2 >=
																	heartrate) {
																	aaa[i].jingbaoshow3 = false
																	aaa[i].jingbao3 = heartrate + "BPM"
																} else {
																	aaa[i].jingbaoshow3 = true
																	aaa[i].jingbao3 = heartrate + "BPM"
																	that.notifyTriggered = true
																}
															}
															if (aaa[i].dataPoints[aa].register ===
																"oxygen") {
																const oxygen = parseInt(aaa[i].dataPoints[
																	aa].registerVal);
																if (xeuyang1 <= oxygen && xeuyang2 >=
																	oxygen) {
																	aaa[i].jingbaoshow4 = false
																	aaa[i].jingbao4 = oxygen + "%"
																} else {
																	aaa[i].jingbaoshow4 = true
																	aaa[i].jingbao4 = oxygen + "%"
																	that.notifyTriggered = true

																}
															}
														}
														bbb.push(aaa[i])
														uni.setStorageSync("switchList", bbb)
													}
													that.checkAndNotify();
												}
											}
										} else {
											let array1 = uni.getStorageSync("switchList");
											let array2 = [];
											// 遍历 pendingdata
											pendingDevices.forEach(item => {
												item.swicth = false;
												item.jingbaoshow1 = false;
												item.jingbao1 = "";
												item.jingbaoshow2 = false;
												item.jingbao2 = "";
												item.jingbaoshow3 = false;
												item.jingbao3 = "";
												item.dataPoints.forEach(dataPoint => {
													let value = parseInt(dataPoint
														.registerVal);
													switch (dataPoint.register) {
														case "lowPressure":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.shuzhangya1, that
																.shuzhangya2,
																"jingbaoshow1",
																"jingbao1", "mmHg");
															break;
														case "highPressure":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.shousuoya1, that
																.shousuoya2,
																"jingbaoshow2",
																"jingbao2", "mmHg");
															break;
														case "heartrate":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.maibo1, that.maibo2,
																"jingbaoshow3",
																"jingbao3", "BPM");
															break;
														case "oxygen":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.xeuyang1, that
																.xeuyang2,
																"jingbaoshow4",
																"jingbao4", "%");
															break;
													}
												});
												array2.push(item);
											});
											let combinedArray = array2.concat(
												array1.filter(item => !array2.some(
													longItem => longItem.id === item.id))
											);
											// 更新
											uni.setStorageSync("switchList", combinedArray)
										}
									}
								}
							})
						}
					},
					fail(erro) {}
				})
			},
			// 定义报警逻辑的通用函数
			checkAlarm(item, register, value, min, max, showKey, alarmKey, unit) {
				if (min !== "" && max !== "") {
					if (value >= min && value <= max) {
						item[showKey] = false;
						item[alarmKey] = "";
					} else {
						if (item.swicth === false) {
							item[showKey] = false;
							item[alarmKey] = "";
						} else {
							item[showKey] = true;
							item[alarmKey] = value + unit;
						}
					}
				} else {
					item[showKey] = false;
					item[alarmKey] = "";
				}
			},
			// 封装检查和通知的逻辑
			checkAndNotify() {
				let that = this
				if (that.notifyTriggered) {
					uni.getPushClientId({
						success(res) {
							that.sendPushMessage(res.cid);
							that.notifyTriggered = false;
						},
						fail(err) {
							that.notifyTriggered = false;
						}
					});
				}
			},
			// 获取当前星期几
			week(e) {
				let week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
				let date = new Date(e);
				let getday = date.getDay();
				return week[getday];
			},
			// 启动加速度计
			accelerometerStart() {
				const that = this;
				uni.onAccelerometerChange((res) => {
					that.handleAccelerometerChange(res);
				});
			},
			// 处理加速度计变化
			handleAccelerometerChange(res) {
				const {
					x,
					y,
					z
				} = res;
				const xxx = x - this.lastx;
				const yyy = y - this.lasty;
				const zzz = z - this.lastz;
				this.lastx = x;
				this.lasty = y;
				this.lastz = z;
				const dele = Math.sqrt(xxx * xxx + yyy * yyy + zzz * zzz);
				if (dele > 1.5) {
					this.handleStepCount();
				}
			},
			// 处理步数计数
			handleStepCount() {
				const currentTime = new Date().getTime();
				if (currentTime - this.lastTime > 1000) {
					this.stepCount++;
					this.lastTime = currentTime;
				}
				this.saveStepCount();
				this.checkDailyReset();
			},
			// 保存步数到本地存储
			saveStepCount() {
				uni.setStorageSync("settept", this.stepCount);
			},
			// 检查是否需要重置每日步数
			checkDailyReset() {
				const currentTime = new Date().getTime();
				const formattedTime = this.formatDate(currentTime);
				if (formattedTime === "23:59:59" || formattedTime === "0:0:0") {
					uni.removeStorageSync("settept1");
				}
			},
			//时间戳转时间
			formatDate(value) {
				const data = new Date(value);
				const month = data.getMonth();
				const day = data.getDate();
				const year = data.getFullYear();
				const hours = data.getHours();
				const minutes = data.getMinutes();
				const seconds = data.getSeconds();
				return `${hours}:${minutes}:${seconds}`;
			},
			// 修改底部导航
			setTabBarItems() {
				// 修改底部导航
				uni.setTabBarItem({
					index: 0,
					text: this.$t('首页')
				});
				uni.setTabBarItem({
					index: 1,
					text: this.$t('趋势')
				});
				uni.setTabBarItem({
					index: 2,
					text: this.$t('设备'),
				});
				uni.setTabBarItem({
					index: 3,
					text: this.$t('共享')
				});
				uni.setTabBarItem({
					index: 4,
					text: this.$t('我的')
				});

			}
		}
	}
</script>

<style lang="scss">
	//设置圆角
	checkbox.round .wx-checkbox-input,
	checkbox.round .uni-checkbox-input {
		border-radius: 20px;
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	checkbox.round1 .wx-checkbox-input,
	checkbox.round1 .uni-checkbox-input {
		border-radius: 50px;
		width: 20px;
		height: 20px;
	}

	//设置背景色(例如我这里是黄色的checkbox,我就设置一个checkbox.yellow)
	checkbox.yellow[checked] .wx-checkbox-input,
	checkbox.yellow.checked .uni-checkbox-input {
		background-color: #ffca28 !important;
		border-color: #ffca28 !important;
		color: #ffffff !important;
	}

	//设置背景色
	checkbox.red[checked] .wx-checkbox-input,
	checkbox.red.checked .uni-checkbox-input {
		background-color: #e54d42 !important;
		border-color: #e54d42 !important;
		color: #ffffff !important;
	}

	page {
		background-color: #efeff4;
		height: 100%;
		font-size: 28rpx;
		line-height: 1.8;
	}
</style>