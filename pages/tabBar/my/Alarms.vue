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
		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" :mask-click="true">
				<view class="popup-content">
					{{$t("通知权限")}}
				</view>
			</uni-popup>
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
				qunxisnds: uni.getStorageSync("pushAuth"),
			}
		},
		onLoad() {
			// console.log(uni.getStorageSync("appQX"))
			if (uni.getStorageSync("appQX") === "1") {
				if (this.qunxisnds === "") {
					this.checkNotificationPermissions1()
					plus.android.checkPermission("android.permission.POST_NOTIFICATIONS", (granted) => {
						if (granted.checkResult !== 0) {
							this.$refs.popup.open('top');
						} else {
							setTimeout(() => {
								this.$refs.popup?.close(); // 可选链，防止再次报错
							}, 3000);
						}
					});
				}
				if (this.qunxisnds !== "") {
					// #ifdef APP-PLUS
					this.openNotificationSettingsAndroid();
					// #endif
				}
			} else {
				uni.showToast({
					title: this.$t('附近设备权限'),
					icon: 'none',
					duration: 5000,
				})
				// #ifdef APP-PLUS
				setTimeout(() => {
					uni.navigateBack()
					setTimeout(() => {
						// #ifdef APP-PLUS
						this.gotoAppPermissionSetting();
						// #endif
					}, 1000)
				}, 1000)
				// #endif
			}
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("警报")
			})
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
					if (that.qunxisnds === 1) {
						if (that.swicth === true) {
							that.startIntervalTimer();
						}
						that.listletnewtimers = setInterval(() => {
							that.receiver_list();
						}, 5000);
					}
				}
			});
			// that.get_user_alarm_list()
		},

		onHide() {
			console.log("onHide")
		},

		onUnload() {
			console.log("onUnload")
			this.clearIntervalTimer()
			if (this.listletnewtimers) {
				clearInterval(this.listletnewtimers);
				this.listletnewtimers = null;
			}
		},
		beforeDestroy() {
			console.log("beforeDestroy")
			this.clearIntervalTimer()
			if (this.listletnewtimers) {
				clearInterval(this.listletnewtimers);
				this.listletnewtimers = null;
			}
		},

		methods: {
			// 根据当前用户查询告警规则列表
			get_user_alarm_list() {
				this.$get(this.$url_APP_IP + "/prod-api/user/trigger/get_user_alarm_list", {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then(get_user_alarm_listres => {
					console.log("get_user_alarm_listres", get_user_alarm_listres)
					if (get_user_alarm_listres.code === 200) {
						if (get_user_alarm_listres.total > 0) {
							for (let i = 0; get_user_alarm_listres.rows.length > i; i++) {
								switch (get_user_alarm_listres.rows[i].register) {
									case "lowPressure":
										this.shousuoya1 = get_user_alarm_listres.rows[i].inputMin
										this.shousuoya2 = get_user_alarm_listres.rows[i].inputMax
										break
									case "highPressure":
										this.shuzhangya1 = get_user_alarm_listres.rows[i].inputMin
										this.shuzhangya2 = get_user_alarm_listres.rows[i].inputMax
										break
									case "heartrate":
										this.maibo1 = get_user_alarm_listres.rows[i].inputMin
										this.maibo2 = get_user_alarm_listres.rows[i].inputMax
										break
									case "oxygen":
										this.xeuyang1 = get_user_alarm_listres.rows[i].inputMin
										this.xeuyang2 = get_user_alarm_listres.rows[i].inputMax
										break
								}
							}
						}
					}
				})
			},

			gotoAppPermissionSetting() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform === 'android') {
					const main = plus.android.runtimeMainActivity();
					const Intent = plus.android.importClass('android.content.Intent');
					const Settings = plus.android.importClass('android.provider.Settings');
					const Uri = plus.android.importClass('android.net.Uri');
					const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
					const uri = Uri.fromParts('package', main.getPackageName(), null);
					intent.setData(uri);
					main.startActivity(intent);
				}
				// #endif
			},
			// #ifdef APP-PLUS
			/**
			 * 检测并申请通知权限（仅 Android 端）
			 * 若未开启则弹出 modal，点击“去开启”后跳转到系统通知设置页
			 */
			openNotificationSettingsAndroid() {
				const system = uni.getSystemInfoSync();
				if (system.platform !== 'android') return; // 非安卓直接退出
				/* 1. 判断通知权限是否已开启 */
				const main = plus.android.runtimeMainActivity();
				const Context = plus.android.importClass('android.content.Context');
				const NotificationManagerCompat = plus.android.importClass(
					'androidx.core.app.NotificationManagerCompat'
				) || plus.android.importClass(
					'android.support.v4.app.NotificationManagerCompat'
				);
				const manager = NotificationManagerCompat.from(main);
				const granted = plus.android.invoke(manager, 'areNotificationsEnabled');
				if (granted) {
					// 已经获取权限
					uni.setStorageSync('pushAuth', 1);
					return;
				}
				/* 2. 未获取，弹框引导用户跳转 */
				uni.showModal({
					title: this.$t('提示'),
					content: this.$t('通知权限'),
					confirmText: this.$t('去开启'),
					cancelText: this.$t('暂不开启'),
					success: (res) => {
						if (res.confirm) {
							/* 3. 跳到系统通知设置页 */
							const Intent = plus.android.importClass('android.content.Intent');
							const Settings = plus.android.importClass('android.provider.Settings');
							const Uri = plus.android.importClass('android.net.Uri');
							const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
							const uri = Uri.fromParts('package', main.getPackageName(), null);
							intent.setData(uri);
							main.startActivity(intent);
							uni.setStorageSync('pushAuth', 0);
						} else {
							uni.setStorageSync('pushAuth', 0);
							// 这里可按需返回上一页或其他逻辑
							uni.navigateBack();
						}
					}
				});
			},
			// #endif
			checkNotificationPermissions1() {
				// 申请通知权限
				plus.android.requestPermissions(['android.permission.POST_NOTIFICATIONS'], function(e) {
					if (e.deniedAlways.length > 0) { //权限被永久拒绝
						uni.setStorageSync('pushAuth', 0);
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
						uni.setStorageSync('pushAuth', 0);
						return
						// 弹出提示框解释为何需要定位权限，可再次调用plus.android.requestPermissions申请权限
					}
					if (e.granted.length > 0) { //权限被允许
						uni.setStorageSync('pushAuth', 1);
						return
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
				}, 5000);
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
			// 重新定义：同时完成
			// 1. 成对互斥
			// 2. value1 ≥ key1
			// 3. value2 ≤ key2
			// 4. value1 ≤ value2
			validateInput(value1, value2, messageKey, key1, key2, eroomsg) {
				// 空值互斥
				const empty1 = value1 === '' || value1 == null;
				const empty2 = value2 === '' || value2 == null;
				if ((empty1 && !empty2) || (!empty1 && empty2)) {
					uni.showToast({
						title: this.$t(messageKey) + '/' + this.$t(eroomsg),
						icon: 'none'
					});
					return false;
				}
				// 都空——认为这组跳过，返回 true（后面可改）
				if (empty1 && empty2) return true;
				// 数值校验
				const v1 = Number(value1);
				const v2 = Number(value2);
				if (v1 < key1) {
					uni.showToast({
						title: this.$t(eroomsg) + "：" + this.$t("最小") + "：" + key1,
						icon: 'none'
					});
					return false;
				} else if (v2 > key2) {
					uni.showToast({
						title: this.$t(eroomsg) + "：" + this.$t("最大") + "：" + key2,
						icon: 'none'
					});
					return false;
				} else if (v1 > v2) {
					uni.showToast({
						title: this.$t(eroomsg) + "：" + this.$t("需要小于"),
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
				if (!that.validateInput(that.shuzhangya1, that.shuzhangya2, "舒张压有未录入", 30, 195, "舒张压输入值超出范围")) return;
				if (!that.validateInput(that.shousuoya1, that.shousuoya2, "收缩压有未录入", 60, 255, "收缩压输入值超出范围")) return;
				if (!that.validateInput(that.maibo1, that.maibo2, "脉搏有未录入", 30, 200, "脉搏输入值超出范围")) return;
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
				// that.usertrigger()
				// 提示设定成功
				uni.showToast({
					title: that.$t("设定成功"),
					icon: 'none'
				});
			},
			//新增用户告警规则
			usertrigger() {
				let data = [{
						userId: uni.getStorageSync("userid"),
						register: "lowPressure",
						inputMin: this.shousuoya1,
						inputMax: this.shousuoya2
					},
					{
						userId: uni.getStorageSync("userid"),
						register: "highPressure",
						inputMin: this.shuzhangya1,
						inputMax: this.shuzhangya2
					},
					{
						userId: uni.getStorageSync("userid"),
						register: "heartrate",
						inputMin: this.maibo1,
						inputMax: this.maibo2
					},
					{
						userId: uni.getStorageSync("userid"),
						register: "oxygen",
						inputMin: this.xeuyang1,
						inputMax: this.xeuyang2
					}
				]
				console.log("usertrigger", data)
				this.$post(this.$url_APP_IP + "/prod-api/user/trigger", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then(usertriggerres => {
					console.log("usertriggerres", usertriggerres)
				})
			},
			list_recipe() {
				const data = {
					userId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_APP_IP + this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					console.log("list_recipe", res)
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
					url: that.$url_APP_IP + that.$url_receiver_list,
					method: 'POST',
					data: {
						receiverId: uni.getStorageSync("userid")
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						console.log("pending", pending)
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

	/* 弹窗内容样式 */
	.popup-content {
		background: #fff;
		border-radius: 20px;
		padding: 20px;
		margin: 20px;
		text-align: center;
		box-sizing: border-box;
	}
</style>