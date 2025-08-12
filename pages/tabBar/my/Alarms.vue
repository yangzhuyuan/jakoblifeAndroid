<template>
	<view class="pagestyle">
		<view class="pagestyle_1">
			<view class="viewstyle">
				<view class="titlestyle">{{$t("收缩压")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shousuoya1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shousuoya2" />
				</view>
			</view>
			<view class="linestyle"></view>
			<view class="viewstyle">
				<view class="titlestyle">{{$t("舒张压")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shuzhangya1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shuzhangya2" />
				</view>
			</view>
			<view class="linestyle"></view>
			<view class="viewstyle">
				<view class="titlestyle">{{$t("脉搏")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="maibo1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="maibo2" />
				</view>
			</view>
			<view class="linestyle"></view>
			<view class="viewstyle">
				<view class="titlestyle">{{$t("血氧")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="xeuyang1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="xeuyang2" />
				</view>
			</view>
		</view>
		<button class="buttonstyle" @click="clickset()">{{$t("设置新的正常范围")}}</button>
		<view style="margin-top: 20px;font-size: 14px; font-weight: 400;color: gray;">{{$t("警报使用提示1")}}</view>
		<view style="margin-top: 5px;font-size: 14px; font-weight: 400;color: gray;">{{$t("警报使用提示2")}}</view>
		<view style="background: gainsboro;height: 1px; margin-top: 10px;"></view>
		<view style="background: white;box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);">
			<view
				style="display: flex;justify-content: space-between; align-items: center; padding: 10px;margin: 0 15px 0 15px;">
				<image :src="avatar"
					style="border-radius: 20px; width: 40px; height: 40px; border: 1px solid gainsboro;">
				</image>
				<view style="flex: 2;margin-left: 20px;">
					<view style="font-weight: 600;font-size: 16px; color: black;">
						{{$t("用户1")+'：'+ name}}
					</view>
				</view>
				<switch @change="switch1Change1" style="transform:scale(0.6);" :checked="swicth" color="#0686CC" />
			</view>
			<view class="container" v-show="jingbaoshow2">
				<view style="font-size: 16px; font-weight: 600;">{{$t("收缩压")}}{{$t("警报")}}:</view>
				<view style="font-size: 14px; font-weight: 400;">{{jingbao2}}</view>
			</view>
			<view class="container" v-show="jingbaoshow1">
				<view style="font-size: 16px; font-weight: 600;">{{$t("舒张压")}}{{$t("警报")}}:</view>
				<view style="font-size: 14px; font-weight: 400;">{{jingbao1}}</view>
			</view>
			<view class="container" v-show="jingbaoshow3">
				<view style="font-size: 16px; font-weight: 600;">{{$t("脉搏")}}{{$t("警报")}}:</view>
				<view style="font-size: 14px; font-weight: 400;">{{jingbao3}}</view>
			</view>
			<view class="container" v-show="jingbaoshow4">
				<view style="font-size: 16px; font-weight: 600;">{{$t("血氧")}}{{$t("警报")}}:</view>
				<view style="font-size: 14px; font-weight: 400;">{{jingbao4}}</view>
			</view>
			<view style="background: gainsboro;height: 1px;"></view>
		</view>
		<view style="padding-bottom: 80px;">
			<view style="background: white;" v-for="(item,index) in filterList" :key="item.id">
				<view
					style="display: flex;justify-content: space-between; align-items: center; padding: 10px;margin: 0 15px 0 15px;">
					<image
						:src="item.shareAvatar==='' || item.shareAvatar===null? '/static/icons/80x80.png':item.shareAvatar"
						style="border-radius: 20px; width: 40px; height: 40px; border: 1px solid gainsboro;">
					</image>
					<view style="flex: 2;margin-left: 20px;">
						<view style="font-weight: 600;font-size: 16px; color: black;">
							{{$t("用户")+'：'+ (item.shareName === null ? item.sharePhone:item.shareName)}}
						</view>
					</view>
					<switch @change="switch1Change(item.swicth,index)" style="transform:scale(0.6);"
						:checked="item.swicth" color="#0686CC" />
				</view>
				<view class="container" v-show="item.jingbaoshow2">
					<view style="font-size: 16px; font-weight: 600;">{{$t("收缩压")}}{{$t("警报")}}:</view>
					<view style="font-size: 14px; font-weight: 400;">{{item.jingbao2}}</view>
				</view>
				<view class="container" v-show="item.jingbaoshow1">
					<view style="font-size: 16px; font-weight: 600;">{{$t("舒张压")}}{{$t("警报")}}:</view>
					<view style="font-size: 14px; font-weight: 400;">{{item.jingbao1}}</view>
				</view>
				<view class="container" v-show="item.jingbaoshow3">
					<view style="font-size: 16px; font-weight: 600;">{{$t("脉搏")}}{{$t("警报")}}:</view>
					<view style="font-size: 14px; font-weight: 400;">{{item.jingbao3}}</view>
				</view>
				<view class="container" v-show="item.jingbaoshow4">
					<view style="font-size: 16px; font-weight: 600;">{{$t("血氧")}}{{$t("警报")}}:</view>
					<view style="font-size: 14px; font-weight: 400;">{{item.jingbao4}}</view>
				</view>
				<view style="background: gainsboro;height: 1px;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			...mapState(['info'])
		},
		data() {
			return {
				//舒张压
				shuzhangya1: '',
				shuzhangya2: '',
				//收缩压
				shousuoya1: '',
				shousuoya2: '',
				//脉搏
				maibo1: '',
				maibo2: '',
				//血氧
				xeuyang1: '',
				xeuyang2: '',
				filterList: [],
				avatar: '',
				name: '',
				jingbao1: '',
				jingbao2: '',
				jingbao3: '',
				jingbao4: '',
				jingbaoshow1: false,
				jingbaoshow2: false,
				jingbaoshow3: false,
				jingbaoshow4: false,
				swicth: false,
				letnewtimers: null,
				listletnewtimers: null,
				qunxisnds: uni.getStorageSync("tongzhi"),
			}
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("警报")
			})
			that.checkNotificationPermissions1()
			if (!that.qunxisnds) {
				uni.showToast({
					title: "通知权限，用于发送数据报警",
					icon: 'none',
					duration: 4000
				})
			}
			// 设置用户头像和名称
			that.avatar = that.info.avatar || '/static/icons/80x80.png';
			that.name = that.info.nickName || that.info.userName;
			// 定义存储键和对应的变量名
			const storageKeys = [{
					key: "shuzhangyaId1",
					variable: "shuzhangya1"
				},
				{
					key: "shuzhangyaId2",
					variable: "shuzhangya2"
				},
				{
					key: "shousuoyaId1",
					variable: "shousuoya1"
				},
				{
					key: "shousuoyaId2",
					variable: "shousuoya2"
				},
				{
					key: "maiboId1",
					variable: "maibo1"
				},
				{
					key: "maiboId2",
					variable: "maibo2"
				},
				{
					key: "xeuyang1",
					variable: "xeuyang1"
				},
				{
					key: "xeuyang2",
					variable: "xeuyang2"
				},
				{
					key: "xueyang",
					variable: "xueyang"
				},
				{
					key: "swichs",
					variable: "swicth"
				}
			];
			// 获取存储信息
			uni.getStorageInfo({
				success(res) {
					res.keys.forEach(key => {
						const item = storageKeys.find(item => item.key === key);
						if (item) {
							that[item.variable] = uni.getStorageSync(key);
						}
					});
					if (that.swicth === true) {
						that.startIntervalTimer();
					}
					that.listletnewtimers = setInterval(() => {
						that.receiver_list();
					}, 1000);
				}
			});
		},

		onUnload() {
			this.clearIntervalTimer()
			if (this.listletnewtimers) {
				clearInterval(this.listletnewtimers);
				this.listletnewtimers = null;
			}
		},

		methods: {
			checkNotificationPermissions1() {
				// 申请通知权限
				plus.android.requestPermissions(['android.permission.POST_NOTIFICATIONS'], function(e) {
					console.log("哈哈哈哈哈", e)
					if (e.deniedAlways.length > 0) { //权限被永久拒绝
						uni.setStorageSync("tongzhi", "tongzhi1")
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
					}
					if (e.deniedPresent.length > 0) { //权限被临时拒绝
						// 弹出提示框解释为何需要定位权限，可再次调用plus.android.requestPermissions申请权限
					}
					if (e.granted.length > 0) { //权限被允许
						uni.setStorageSync("tongzhi", "tongzhi")
					}
				}, function(e) {});
			},

			// 定义一个函数来获取最新的血压和心率数据
			getLatestPressureAndHeartRate(data, slaveSn) {
				const filteredData = data.filter(item => item.slaveSn === slaveSn);
				return {
					lowPressure: this.getRegisterVal(filteredData, 'register', 'lowPressure'),
					highPressure: this.getRegisterVal(filteredData, 'register', 'highPressure'),
					pulse: this.getRegisterVal(filteredData, 'register', 'heartrate'),
					lowPressureTime: this.findValue(filteredData, "register", "lowPressure").updateTime,
					highPressureTime: this.findValue(filteredData, "register", "highPressure").updateTime,
					heartRateTime: this.findValue(filteredData, "register", "heartrate").updateTime
				};
			},
			// 定义一个通用的警报判断函数
			checkAlert(value, minThreshold, maxThreshold, alertProperty, alertShowProperty) {
				if (minThreshold !== "" && maxThreshold !== "") {
					if (parseInt(value) <= parseInt(minThreshold) || parseInt(maxThreshold) <= parseInt(value)) {
						this[alertProperty] = value;
						this[alertShowProperty] = true;
					} else {
						this[alertShowProperty] = false;
					}
				} else {
					this[alertShowProperty] = false;
				}
			},
			getRegisterVal(data, type, key) {
				const value = this.findValue(data, type, key);
				return value.registerVal !== null ? value.registerVal : "-/-";
			},
			findValue(arr, key, value) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] == value) {
						return arr[i]
					}
				}
				return null
			},
			//自己的警报开关
			switch1Change1(e) {
				if (e.detail.value === false) {
					this.swicth = false;
					this.resetAlarms();
					this.clearIntervalTimer();
				} else if (e.detail.value === true) {
					this.swicth = true;
					this.startIntervalTimer();
				}
				uni.setStorageSync("swichs", this.swicth);
			},
			// 别人共享的警报开关
			switch1Change(swicth, id) {
				const item = this.filterList[id];
				if (swicth === true) {
					item.swicth = false;
					item.jingbaoshow1 = false;
					item.jingbaoshow2 = false;
					item.jingbaoshow3 = false;
					item.jingbaoshow4 = false;
				} else {
					item.swicth = true;
					// 定义检查报警显示的通用函数
					const checkAlarmShow = (jingbao, min, max, jingbaoshow) => {
						return jingbao !== "" && min !== "" && max !== "";
					};
					item.jingbaoshow1 = checkAlarmShow(item.jingbao1, this.shuzhangya1, this.shuzhangya2);
					item.jingbaoshow2 = checkAlarmShow(item.jingbao2, this.shousuoya1, this.shousuoya2);
					item.jingbaoshow3 = checkAlarmShow(item.jingbao3, this.maibo1, this.maibo2);
					item.jingbaoshow4 = checkAlarmShow(item.jingbao4, this.xeuyang1, this.xeuyang2);
				}
				// 保存到本地存储
				uni.setStorageSync("switchList", this.filterList);
			},
			// 重置所有报警显示
			resetAlarms() {
				this.jingbaoshow1 = false;
				this.jingbaoshow2 = false;
				this.jingbaoshow3 = false;
				this.jingbaoshow4 = false;
			},
			// 清除定时器
			clearIntervalTimer() {
				if (this.letnewtimers) {
					clearInterval(this.letnewtimers);
					this.letnewtimers = null;
				}
			},
			// 启动定时器
			startIntervalTimer() {
				this.letnewtimers = setInterval(() => {
					this.list_recipe();
				}, 1000);
			},
			// 根据状态值返回不同的样式对象
			getStatusColor1(status) {
				return {
					color: status === 0 ? 'gray' : 'black'
				};
			},
			bindTimeChange(e) {
				this.index = e.detail.value
			},
			// 定义验证函数
			validateInput(value1, value2, messageKey) {
				if ((value1 !== "" && value2 === "") || (value1 === "" && value2 !== "")) {
					uni.showToast({
						title: this.$t(messageKey),
						icon: 'none'
					});
					return false;
				}
				return true;
			},
			//点击确认设置
			clickset() {
				let that = this;
				// 验证输入
				if (!that.validateInput(that.shuzhangya1, that.shuzhangya2, "舒张压有未录入")) return;
				if (!that.validateInput(that.shousuoya1, that.shousuoya2, "收缩压有未录入")) return;
				if (!that.validateInput(that.maibo1, that.maibo2, "脉搏有未录入")) return;
				if (!that.validateInput(that.xeuyang1, that.xeuyang2, "血氧有未录入")) return;
				// 验证血氧值是否超过100
				if (that.xeuyang1 > 100 || that.xeuyang2 > 100) {
					uni.showToast({
						title: that.$t("血氧最大值不能超过"),
						icon: 'none'
					});
					return;
				}
				// 保存到本地存储
				const storageKeys = [{
						key: "shuzhangyaId1",
						value: that.shuzhangya1
					},
					{
						key: "shuzhangyaId2",
						value: that.shuzhangya2
					},
					{
						key: "shousuoyaId1",
						value: that.shousuoya1
					},
					{
						key: "shousuoyaId2",
						value: that.shousuoya2
					},
					{
						key: "maiboId1",
						value: that.maibo1
					},
					{
						key: "maiboId2",
						value: that.maibo2
					},
					{
						key: "xeuyang1",
						value: that.xeuyang1
					},
					{
						key: "xeuyang2",
						value: that.xeuyang2
					}
				];
				storageKeys.forEach(item => {
					uni.setStorageSync(item.key, item.value);
				});
				// 重新从本地存储获取数据
				storageKeys.forEach(item => {
					that[item.key] = uni.getStorageSync(item.key);
				});
				// 提示设定成功
				uni.showToast({
					title: that.$t("设定成功"),
					icon: 'none'
				});
			},
			list_recipe() {
				const data = {
					userId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code == 200) {
						// 获取氧含量
						let oxygen = this.getRegisterVal(res.data, "register", "oxygen");
						// 获取两个设备的血压和心率数据
						const pressureData1 = this.getLatestPressureAndHeartRate(res.data, "2");
						const pressureData2 = this.getLatestPressureAndHeartRate(res.data, "3");
						// 初始化最终结果
						let lowPressure = "";
						let highPressure = "";
						let heartrate = "";
						// 根据时间戳选择最新的血压和心率数据
						if (pressureData1.lowPressureTime > pressureData2.lowPressureTime) {
							lowPressure = pressureData1.lowPressure;
							highPressure = pressureData1.highPressure;
						} else if (pressureData1.lowPressureTime < pressureData2.lowPressureTime) {
							lowPressure = pressureData2.lowPressure;
							highPressure = pressureData2.highPressure;
						}
						if (pressureData1.heartRateTime > pressureData2.heartRateTime) {
							heartrate = pressureData1.pulse;
						} else if (pressureData1.heartRateTime < pressureData2.heartRateTime) {
							heartrate = pressureData2.pulse;
						}
						if (this.swicth === true) {
							// 检查舒张压警报
							this.checkAlert(lowPressure, this.shuzhangya1, this.shuzhangya2, "jingbao1",
								"jingbaoshow1");
							if (this.jingbaoshow1) {
								this.jingbao1 += "mmHg"; // 如果有警报，添加百分号
							}
							// 检查收缩压警报
							this.checkAlert(highPressure, this.shousuoya1, this.shousuoya2, "jingbao2",
								"jingbaoshow2");
							if (this.jingbaoshow2) {
								this.jingbao2 += "mmHg"; // 如果有警报，添加百分号
							}
							// 检查心率警报
							this.checkAlert(heartrate, this.maibo1, this.maibo2, "jingbao3", "jingbaoshow3");
							if (this.jingbaoshow3) {
								this.jingbao3 += "BPM"; // 如果有警报，添加百分号
							}
							// 检查血氧警报
							this.checkAlert(oxygen, this.xeuyang1, this.xeuyang2, "jingbao4", "jingbaoshow4");
							if (this.jingbaoshow4) {
								this.jingbao4 += "%"; // 如果有警报，添加百分号
							}
						} else {
							this.clearIntervalTimer()
						}
					}
				})
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
							that.filterList = []
							const pendingdata = pending.data.data
							uni.getStorageInfo({
								success(res) {
									if (res.keys.includes("switchList")) {
										if (uni.getStorageSync("switchList").length === pendingdata
											.length) {
											let switchList = uni.getStorageSync("switchList");
											let updatedList = [];
											// 遍历 switchList
											switchList.forEach(item => {
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
												updatedList.push(item);
											});
											// 保存更新后的列表
											uni.setStorageSync("switchList", updatedList);
											// 更新 filterList
											that.filterList = uni.getStorageSync("switchList");
										} else {
											let array1 = uni.getStorageSync("switchList");
											let array2 = [];
											// 遍历 pendingdata
											pendingdata.forEach(item => {
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
											// 更新 filterList
											that.filterList = combinedArray

										}
									} else {
										// 遍历 pendingdata
										for (const item of pendingdata) {
											item.swicth = false;
											item.jingbaoshow1 = false;
											item.jingbao1 = "";
											item.jingbaoshow2 = false;
											item.jingbao2 = "";
											item.jingbaoshow3 = false;
											item.jingbao3 = "";
											item.jingbaoshow4 = false;
											item.jingbao4 = "";
											// 遍历 dataPoints
											for (const dataPoint of item.dataPoints) {
												let value = parseInt(dataPoint.registerVal);
												switch (dataPoint.register) {
													case "lowPressure":
														({
															jingbaoshow1: item.jingbaoshow1,
															jingbao1: item.jingbao1
														} = that.checkValue(
															value,
															that.shuzhangya1,
															that.shuzhangya2,
															item.swicth,
															item.jingbaoshow1,
															item.jingbao1
														));
														// 在 jingbao4 的值后面加上 %
														if (item.jingbao1 !== null && item.jingbao1 !==
															undefined) {
															item.jingbao1 = `${item.jingbao1}mmHg`;
														}
														break;
													case "highPressure":
														({
															jingbaoshow2: item.jingbaoshow2,
															jingbao2: item.jingbao2
														} = that.checkValue(
															value,
															that.shousuoya1,
															that.shousuoya2,
															item.swicth,
															item.jingbaoshow2,
															item.jingbao2
														));
														// 在 jingbao4 的值后面加上 %
														if (item.jingbao2 !== null && item.jingbao2 !==
															undefined) {
															item.jingbao2 = `${item.jingbao2}mmHg`;
														}
														break;
													case "heartrate":
														({
															jingbaoshow3: item.jingbaoshow3,
															jingbao3: item.jingbao3
														} = that.checkValue(
															value,
															that.maibo1,
															that.maibo2,
															item.swicth,
															item.jingbaoshow3,
															item.jingbao3
														));
														// 在 jingbao3 的值后面加上 BPM
														if (item.jingbao3 !== null && item.jingbao3 !==
															undefined) {
															item.jingbao3 = `${item.jingbao3}BPM`;
														}
														break;
													case "oxygen":
														({
															jingbaoshow4: item.jingbaoshow4,
															jingbao4: item.jingbao4
														} = that.checkValue(
															value,
															that.xeuyang1,
															that.xeuyang2,
															item.swicth,
															item.jingbaoshow4,
															item.jingbao4
														));
														// 在 jingbao4 的值后面加上 %
														if (item.jingbao4 !== null && item.jingbao4 !==
															undefined) {
															item.jingbao4 = `${item.jingbao4}%`;
														}
														break;
												}
											}
											that.filterList.push(item);
										}
									}
								}
							})
						} else {
							that.filterList = []
						}
					},
					fail(erro) {
						console.warn("查看别人分享给我的数据点列表失败", erro)
					}
				})
			},
			// 定义一个通用的检查函数
			checkValue(value, min, max, switchFlag, showFlag, result) {
				if (min >= 0 && max >= 0 && min !== "" && max !== "") {
					if (value <= max && value >= min) {
						showFlag = false;
						result = "";
					} else {
						if (switchFlag) {
							showFlag = true;
							result = value;
						} else {
							showFlag = false;
							result = "";
						}
					}
				}
				return {
					showFlag,
					result
				};
			},
			// 定义报警逻辑的通用函数
			checkAlarm(item, register, value, min, max, showKey, alarmKey, unit) {
				if (min !== "" && max !== "" && value !== "") {
					if ((value >= min && value <= max) || (value <= min && value >= max)) {
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
		}
	}
</script>

<style>
	.pagestyle {
		padding: 20px;
	}

	.pagestyle_1 {
		display: flex;
		justify-content: center;
		flex-direction: column;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.viewstyle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
	}

	.titlestyle {
		font-size: 17px;
		font-weight: 600;
		color: black;
	}

	.titlestyle_1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}

	.inputstyles {
		width: 80px;
		text-align: center;
	}

	.linestyle1 {
		background: black;
		height: 2px;
		width: 10px;
	}

	.linestyle {
		background: gainsboro;
		height: 1px;
	}

	.buttonstyle {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-weight: 600;
		height: 48px;
		margin-top: 40px;
		border-radius: 50px;
		background: #3298F7;
		color: white;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.container {
		color: red;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		/* 允许换行 */
		justify-content: flex-start;
		/* 子元素左对齐 */
		gap: 10px;
		/* 子元素之间的间距 */
		margin: 10px 20px 20px 20px;
	}
</style>