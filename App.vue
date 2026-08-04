<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		checkNotificationPermissions,
		checkNotificationAgain
	} from "pages/api/unitls/permission.js";
	import {
		isInChinaByIP,
		ISgetUserInfoUS,
		ISgetUserInfoChina,
	} from './pages/api/isInChinaByIP.js'; //获取定位
	import {
		refreshActiveAppBaseUrl
	} from '@/pages/api/appBaseHosts.js';

	import keepAliveManager from "@/nativeplugins/KeepAlivesdkplugin/keepAliveManager.js";
	import {
		resumeQxBleScheduleIfEnabled,
		onQxBleAppBackground,
		onQxBleAppForeground,
		setQxBleAppForegroundState,
		ensureQxBleKeepAliveForBackground,
		replanQxBleScheduleOnTimezoneChange,
		requestBpw6SilentReconnect
	} from '@/pages/api/qxBleAlignedSchedule.js';
	import {
		startTimezoneWatch,
		syncTimezoneSignature
	} from '@/pages/api/unitls/timezone.js';
	const systemInfo = uni.getSystemInfoSync()
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
				notifySending: false, // 推送请求进行中，防止重复调用
				intervalId: null, // 用于存储定时器的 ID
				locationChecked: false, // 标记位
				isMandatory: false, // 是否为强制更新
				updateprog: false, // 是否需要更新

			}
		},
		//当uni-app 初始化完成时触发（全局只触发一次），参数为应用启动参数，同 uni.getLaunchOptionsSync 的返回值
		onLaunch: function() {
			let that = this
			uni.removeStorageSync('deviceBindingInProgress')
			// 根据手机系统设置app语言
			const lan = uni.getLocale();
			let locale = "zh-CN"; // 默认语言设置为中文
			switch (lan) {
				case 'en':
				case 'en-US':
					locale = "en-US";
					break;
				case 'zh-Hans':
				case 'zh-Hant':
					locale = "zh-CN";
					break;
				default:
					locale = "en-US";
					break
			}
			that._i18n.locale = locale;
			//关闭启动图
			// #ifdef APP-PLUS
			setTimeout(() => {
				plus.navigator.closeSplashscreen()
			}, 1000)
			// #endif
			const activeUrl = refreshActiveAppBaseUrl(Vue)
			// console.log('【API根地址(已同步appBaseHosts)】', activeUrl)
			syncTimezoneSignature()
			startTimezoneWatch(() => {
				replanQxBleScheduleOnTimezoneChange()
			})
		},

		onHide() {
			setQxBleAppForegroundState(false)
			this.stopInterval();
			this.startInterval();
			uni.removeStorageSync("dingwei")
			// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform === 'android') {
				// this.maybeInitKeepAliveForTimers()

				if (keepAliveManager.shouldKeepAliveForAppTimers()) {
					this.maybeInitKeepAliveForTimers()
					keepAliveManager.ensureRunningForAppTimers();
				}

				const plugin = uni.requireNativePlugin('ThirdSdkPlugin-ThirdSdkModule');
				plugin.acquireWakeLock({}, res => {
					// console.log('【App.vue】休眠/后台保留运行', res)' '
				})
				// keepAliveManager.ensureRunningForAppTimers();
				keepAliveManager.onAppHide();
				onQxBleAppBackground();
			}
			// #endif
		},

		mounted() {
			this.notifyTriggered = false; // 确保初始值为 false
		},

		onShow() {
			let that = this
			setQxBleAppForegroundState(true)
			// 配置域名
			that.getBaseUrl();
			// #ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform === 'android') {
				keepAliveManager.resumeForegroundIfSuspended();
				// ensureQxBleKeepAliveForBackground();
				if (keepAliveManager.shouldKeepAliveForAppTimers()) {
					ensureQxBleKeepAliveForBackground();
					setTimeout(() => {
						that.maybeInitKeepAliveForTimers()
					}, 1500)
				}
				onQxBleAppForeground();
				// setTimeout(() => {
				// 	that.maybeInitKeepAliveForTimers()
				// }, 1500)
			}
			that.openLocationServiceAndroid();
			keepAliveManager.onAppShow();
			setTimeout(() => {
				that.tryResumeQxBleSchedule()
			}, 2600)
			// BPW6 回前台强制补一次静默重连（与 onQxBleAppForeground 去重节流）
			try {
				const bpw6 = uni.getStorageSync('BPW6devicemac')
				if (bpw6) {
					requestBpw6SilentReconnect(bpw6, 'App.onShow')
				}
			} catch (e) {}
			// #endif
			let timesder = setInterval(() => {
				if (uni.getStorageSync("token")) {
					clearInterval(timesder)
					if (uni.getStorageSync("dingwei") === 1) {
						checkNotificationPermissions();
					}
				}
			}, 2000)
			// #ifdef APP-PLUS
			plus.runtime.setBadgeNumber(0);
			// #endif
			that.stopInterval();
			that.startInterval();
			that.setTabBarItems();
			// that.accelerometerStart();//手机传感步数
			// uni.getPushClientId({
			// 	success(res) {
			// 		that.sendPushMessage(res.cid);
			// 	},
			// });
		},
		globalData: {
			test: ''
		},

		methods: {
			...mapMutations(['setUniverifyErrorMsg', 'setUniverifyLogin', 'setlanyaId']),
			/** 登录后恢复情绪定时测量（不依赖 dingwei 定位标记） */
			tryResumeQxBleSchedule() {
				if (!uni.getStorageSync('token')) return
				resumeQxBleScheduleIfEnabled().catch((e) => {
					console.warn('resumeQxBleScheduleIfEnabled', e)
				})
			},
			/** Android 保活初始化（Monitoring 相关开关任一开启时） */
			maybeInitKeepAliveForTimers() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform !== 'android') return
				keepAliveManager.init()
				if (!this._keepAliveTimerLifecycleBound) {
					this._keepAliveTimerLifecycleBound = true
					setTimeout(() => {
						keepAliveManager.startLocationKeepAliveSilently({
							interval: 30000
						})
					}, 12000)
				}
				// #endif
			},


			// 测试定位功能
			async testLocation() {
				console.log('开始测试定位...');

				// 显示加载中
				// uni.showLoading({
				// 	title: '测试定位中...'
				// });

				try {
					// 调用测试方法
					const result = await keepAliveManager.testLocation();
					console.log('测试结果:', result);

					uni.hideLoading();

					// 显示测试结果
					let content = `权限状态: ${result.permission.granted ? '已授予 ✅' : '未授予 ❌'}\n`;
					content += `定位保活: ${result.status.enabled ? '已启动 ✅' : '未启动 ❌'}\n`;
					content += `有位置信息: ${result.status.hasLocation ? '是 ✅' : '否 ❌'}\n`;
					if (result.lastLocation.success && result.lastLocation.location) {
						content +=
							`最后位置: ${result.lastLocation.location.latitude}, ${result.lastLocation.location.longitude}\n`;
					}
					content += `启动结果: ${result.startResult.success ? '成功 ✅' : '失败 ❌'}`;

					// uni.showModal({
					// 	title: '定位测试结果',
					// 	content: content,
					// 	confirmText: '知道了'
					// });
				} catch (error) {
					uni.hideLoading();
					console.error('测试失败:', error);
					uni.showToast({
						title: '测试失败: ' + (error.message || '未知错误'),
						icon: 'none'
					});
				}
			},

			// 手动启动定位保活（带失败提示）
			async startLocationKeepAlive() {
				await keepAliveManager.manualStartLocationKeepAlive({
					silent: false
				});
			},

			// 手动获取位置
			async getLocation() {
				// uni.showLoading({
				// 	title: '获取位置中...'
				// });
				try {
					const result = await keepAliveManager.getCurrentLocation(8000);
					uni.hideLoading();

					// uni.showModal({
					// 	title: '当前位置',
					// 	content: `纬度: ${result.location.latitude}\n经度: ${result.location.longitude}\n精度: ${result.location.accuracy}m`,
					// 	confirmText: '确定'
					// });
				} catch (error) {
					uni.hideLoading();
					uni.showToast({
						title: error.message || '获取位置失败',
						icon: 'none'
					});
				}
			},

			// 查看保活状态
			showStatus() {
				const status = keepAliveManager.getStatus();
				const locationStatus = keepAliveManager.getLocationKeepAliveStatus();

				let content = `保活运行: ${status.isRunning ? '是 ✅' : '否 ❌'}\n`;
				content += `定位保活: ${locationStatus.enabled ? '已启动 ✅' : '未启动 ❌'}\n`;
				content += `定位权限: ${locationStatus.permissionGranted ? '已授予 ✅' : '未授予 ❌'}\n`;
				content += `有位置: ${locationStatus.hasLocation ? '是 ✅' : '否 ❌'}\n`;
				content += `白名单: ${status.whiteListStatus.isInWhiteList ? '已加入 ✅' : '未加入 ❌'}\n`;
				content += `通知权限: ${status.notificationEnabled ? '已开启 ✅' : '未开启 ❌'}`;

				if (locationStatus.lastLocation) {
					content +=
						`\n\n最后位置:\n经度: ${locationStatus.lastLocation.longitude}\n纬度: ${locationStatus.lastLocation.latitude}`;
				}

				uni.showModal({
					title: '保活状态',
					content: content,
					confirmText: '刷新',
					success: (res) => {
						if (res.confirm) {
							this.showStatus();
						}
					}
				});
			},



			/**
			 * 获取基础URL地址
			 * 优先使用本地存储的URL，否则使用默认国内地址
			 */
			getBaseUrl() {
				// 执行版本检查和登出验证
				this.checkVersionAndLogout()
				refreshActiveAppBaseUrl(Vue)
				// 如果正在更新中，直接返回，避免重复检查
				if (this.updateprog) return
				// 检查新版本（强制更新）
				this.check_new_version("com.work.jakob", "0")
			},

			// #ifdef APP-PLUS
			openLocationServiceAndroid() {
				let system = uni.getSystemInfoSync();
				// 导入Android原生类
				var Context = plus.android.importClass("android.content.Context");
				var LocationManager = plus.android.importClass("android.location.LocationManager");
				var Intent = plus.android.importClass("android.content.Intent");
				var Settings = plus.android.importClass("android.provider.Settings");
				// 获取主Activity和定位服务
				var mainActivity = plus.android.runtimeMainActivity();
				var locationService = mainActivity.getSystemService(Context.LOCATION_SERVICE);
				// 检查GPS是否开启
				if (!locationService.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
					this.locationChecked = false;
					uni.showModal({
						title: this.$t("提示"),
						content: this.$t("您的手机定位服务未开启"),
						confirmText: this.$t("去开启"),
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								// 跳转到系统定位服务设置页面
								var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
								mainActivity.startActivity(intent);
								uni.setStorageSync("dingwei", 1)
							}
						}
					});
				} else {
					uni.setStorageSync("dingwei", 1)
				}
			},

			// #endif
			// 发送推送消息
			sendPushMessage(pushClientId) {
				const now = new Date(); // 获取当前时间
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const houres = now.getHours() < 10 ? "0" + now.getHours() : now.getHours()
				const Minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()
				const Seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()
				const timestamp = year + "/" + month + "/" + day + " " + houres + ":" + Minutes + ":" + Seconds;
				console.log("pushClientId", pushClientId)
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
						console.log("推送发送成功:", dataRes);
					})
					.catch((err) => {
						console.log("推送发送成功:", err);
						uni.showToast({
							title: err.errMsg,
							icon: "none"
						})
					})
			},
			compareVersion(v1, v2) {
				const arr1 = v1.split('.').map(Number)
				const arr2 = v2.split('.').map(Number)
				const maxLen = Math.max(arr1.length, arr2.length)

				for (let i = 0; i < maxLen; i++) {
					const num1 = arr1[i] || 0
					const num2 = arr2[i] || 0
					if (num1 > num2) return 1
					if (num1 < num2) return -1
				}
				return 0
			},
			async checkVersionAndLogout() {
				try {
					// 1. 获取当前原生版本（热更新不算）
					const currentVersion = systemInfo.appVersion
					// 2. 读取本地存储的上一版本
					const lastVersion = uni.getStorageSync('last_app_version') || '3.2.0'
					// 3. 版本变化 → 强制登出
					if (this.compareVersion(currentVersion, lastVersion) !== 0) {
						// 清除所有登录态（token、用户信息等）
						uni.removeStorageSync("token")
						uni.removeStorageSync("URL_APP_IP")
						// 保存新版本号
						uni.setStorageSync('last_app_version', currentVersion)
					}
				} catch (e) {
					console.error('版本检测失败', e)
				}
			},
			/* 检查新版本 —— 仅改动了弹窗触发方式 */
			check_new_version(pkgName, type) {
				let that = this;
				let data = {
					pkgName,
					type,
					versionName: systemInfo.appVersion
				}
				// console.log("检查新版本传参" + that.$url_APP_IP, data)
				that.$post(`${that.$url_APP_IP}/prod-api/system/version/check_new_version`, data, {
					'content-type': 'application/x-www-form-urlencoded'
				}).then((res) => {
					// console.log("版本检查结果", res)
					if (res.code === 4003) {
						//已经是最新版本
						return;
					}
					let remarkParts = res.data.remark === null ? "" : res.data.remark.split("&&&");
					// 初始化中英文变量
					let englishPart = '';
					let chinesePart = '';
					// 安全地获取分割后的部分
					if (remarkParts.length > 0) {
						englishPart = remarkParts[0];
					}
					if (remarkParts.length > 1) {
						chinesePart = remarkParts[1];
					}
					let lan = uni.getLocale();
					let today = res.data.versionName;
					if (res.data.updateForce === 0) {
						// console.log("不需要强制更新")
						if (uni.getStorageSync("aboutupdate") === today) {
							// console.log("不需要强制更新，按钮取消")
							return
						}
						uni.showModal({
							content: `${that.$t('版本更新1')}${res.data.versionName}${that.$t('版本更新2')}\n${lan == 'zh-Hans' || lan == 'zh-Hant' ? chinesePart : englishPart}`,
							confirmText: that.$t('安装'),
							cancelText: that.$t('稍后安装'),
							success(modal) {
								if (modal.confirm) {
									/* ① 打开 GlobalPopup 下载弹窗 */
									uni.$emit('APP_WANT_POPUP', {
										mode: 'download',
										title: that.$t('正在下载更新'),
										progress: 0
									});
									/* ② 开始下载 */
									that.checkUpdate(res.data.path);
								} else {
									uni.setStorageSync("aboutupdate", today)
								}
							}
						});
					} else {
						console.log("需要强制更新")
						uni.showModal({
							content: `${that.$t('版本更新1')}${res.data.versionName}${that.$t('版本更新2')}\n${lan == 'zh-Hans' || lan == 'zh-Hant' ? chinesePart : englishPart}`,
							confirmText: that.$t('安装'),
							showCancel: false,
							success(modal) {
								if (modal.confirm) {
									/* ① 打开 GlobalPopup 下载弹窗 */
									uni.$emit('APP_WANT_POPUP', {
										mode: 'download',
										title: that.$t('正在下载更新'),
										progress: 0
									});
									/* ② 开始下载 */
									that.checkUpdate(res.data.path);
								}
							}
						});
					}
				}).catch((err) => {
					console.log(err);
					uni.showToast({
						title: that.$t('检查更新失败'),
						icon: 'none'
					});
				})
			},
			/* 执行更新 —— 只改“进度通知”和“关闭弹窗”方式 */
			checkUpdate(path) {
				this.downloadTask = null;
				this.isDownloading = true;
				this.downloadTask = uni.downloadFile({
					url: path,
					success: res => {
						if (res.statusCode !== 200) {
							uni.$emit('CLOSE_GLOBAL_POPUP'); // 关闭弹窗
							uni.showModal({
								title: this.$t('下载失败'),
								content: this.$t('服务器返回状态码') + res.statusCode,
								showCancel: false
							});
							return;
						}
						/* 安装 APK */
						plus.runtime.install(
							res.tempFilePath, {
								force: false
							},
							() => {
								uni.$emit('CLOSE_GLOBAL_POPUP'); // 关闭弹窗
								if (this.isMandatory) {
									plus.runtime.restart();
								} else {
									uni.showModal({
										title: this.$t('安装成功'),
										content: this.$t('需要重启应用生效'),
										success: r => r.confirm && plus.runtime
											.restart()
									});
								}
							},
							err => {
								uni.$emit('CLOSE_GLOBAL_POPUP');
								uni.showModal({
									title: this.$t('安装失败'),
									content: err.message || this.$t('未知错误'),
									showCancel: false
								});
							}
						);
					},
					fail: err => {
						uni.$emit('CLOSE_GLOBAL_POPUP');
						uni.showModal({
							title: this.$t('下载失败'),
							content: err.errMsg || this.$t('网络连接失败'),
							showCancel: false
						});
					}
				});

				/* 实时进度 → GlobalPopup */
				this.downloadTask.onProgressUpdate(res => {
					// 把进度推给当前页面的 GlobalPopup
					this.$popupProgress({
						progress: res.progress,
						totalBytesWritten: res.totalBytesWritten,
						totalBytesExpectedToWrite: res.totalBytesExpectedToWrite
					});

					/* 下载完成提示 */
					if (res.progress >= 100) {
						uni.showToast({
							title: this.$t('下载完成'),
							icon: 'none',
							duration: 2000
						});
						this.updateprog = false;
					} else {
						this.updateprog = true;
					}
				});
			},
			/* 取消下载（按钮在 GlobalPopup 里） */
			cancelDownload() {
				if (this.downloadTask) {
					this.downloadTask.abort();
					uni.$emit('CLOSE_GLOBAL_POPUP');
					uni.showToast({
						title: this.$t('下载已取消'),
						icon: 'none'
					});
				}
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
											if (uni.getSystemInfoSync().platform ===
												"android") {
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
						// console.log("receiver_list", pending.data)
						if (pending.data.code === 200 && pending.data.data && pending.data.data
							.length > 0) {
							let pendingDevices = pending.data.data;
							that.notifyTriggered = false
							uni.getStorageInfo({
								success(res) {
									if (res.keys.includes("switchList")) {
										if (uni.getStorageSync("switchList").length ===
											pendingDevices
											.length) {
											const shuzhangya1 = uni.getStorageSync(
												"shuzhangyaId1")
											const shuzhangya2 = uni.getStorageSync(
												"shuzhangyaId2")
											const shousuoya1 = uni.getStorageSync(
												"shousuoyaId1")
											const shousuoya2 = uni.getStorageSync(
												"shousuoyaId2")
											const maibo1 = uni.getStorageSync(
												"maiboId1")
											const maibo2 = uni.getStorageSync(
												"maiboId2")
											const xeuyang1 = uni.getStorageSync(
												"xeuyang1")
											const xeuyang2 = uni.getStorageSync(
												"xeuyang2")
											// 判断设备数量是否一致
											const storedDevices = uni.getStorageSync(
												"switchList") || [];
											if (storedDevices.length === pendingDevices
												.length) {
												// 创建快速查找映射
												const pendingMap = new Map(
													pendingDevices.map(d => [d
														.sharerId, d
													]));
												// 更新 storedDevices 中的 registerVal 值
												const updatedDevices = storedDevices
													.map(storedDevice => {
														const pendingDevice =
															pendingMap.get(
																storedDevice
																.sharerId);
														if (!pendingDevice)
															return storedDevice;
														const updatedDataPoints =
															storedDevice
															.dataPoints.flatMap(
																dp => {
																	const
																		pendingDataPoints =
																		pendingDevice
																		.dataPoints
																		.filter(
																			pdp =>
																			pdp
																			.register ===
																			dp
																			.register
																		);
																	if (pendingDataPoints
																		.length > 0
																	) {
																		// 为每个匹配的 pendingDataPoint 创建一个新的 dp 对象
																		return pendingDataPoints
																			.map(
																				pendingDataPoint =>
																				({
																					...
																					dp,
																					registerVal: pendingDataPoint
																						.registerVal
																				})
																			);
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
												uni.setStorageSync("switchList",
													updatedDevices);
												// 保存原始副本
												const originalData = JSON.parse(JSON
													.stringify(
														storedDevices));
												// 检查数据是否发生变化
												let hasDataChanged = false;
												for (let i = 0; i < updatedDevices
													.length; i++) {
													if (updatedDevices[i].swicth ===
														true) {
														// 找到原始数据中对应的设备
														const originalDevice =
															originalData.find(device =>
																device.sharerId ===
																updatedDevices[i]
																.sharerId);
														if (!originalDevice) {
															// 如果原始数据中没有找到对应的设备，说明数据发生了变化
															hasDataChanged = true;
															break;
														}
														// 比较 dataPoints 是否发生变化
														const originalDataPoints =
															originalDevice
															.dataPoints;
														const updatedDataPoints =
															updatedDevices[i]
															.dataPoints;

														if (originalDataPoints
															.length !==
															updatedDataPoints
															.length) {
															// 如果 dataPoints 数组长度不同，说明数据发生了变化
															hasDataChanged = true;
															break;
														}
														for (let j = 0; j <
															originalDataPoints
															.length; j++) {
															const originalPoint =
																originalDataPoints[j];
															const updatedPoint =
																updatedDataPoints.find(
																	point => point
																	.register ===
																	originalPoint
																	.register);
															if (!updatedPoint) {
																// 如果更新后的 dataPoints 中没有找到对应的字段，说明数据发生了变化
																hasDataChanged = true;
																break;
															}
															if (originalPoint
																.registerVal !==
																updatedPoint
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
													let aaa = uni.getStorageSync(
														"switchList")
													let bbb = []
													// 保存更新后的数据到本地存储
													for (let i = 0; aaa.length >
														i; i++) {
														for (let aa = 0; aaa[i]
															.dataPoints.length >
															aa; aa++) {
															if (aaa[i].dataPoints[aa]
																.register ===
																"lowPressure") {
																const lowPressure =
																	parseInt(aaa[i]
																		.dataPoints[aa]
																		.registerVal);
																if (shuzhangya1 <=
																	lowPressure &&
																	shuzhangya2 >=
																	lowPressure) {
																	aaa[i]
																		.jingbaoshow1 =
																		false
																	aaa[i].jingbao1 =
																		lowPressure +
																		"mmHg"
																} else {
																	aaa[i]
																		.jingbaoshow1 =
																		true
																	aaa[i].jingbao1 =
																		lowPressure +
																		"mmHg"
																	that.notifyTriggered =
																		true
																}
															}
															if (aaa[i].dataPoints[aa]
																.register ===
																"highPressure") {
																const highPressure =
																	parseInt(aaa[i]
																		.dataPoints[aa]
																		.registerVal);
																if (shousuoya1 <=
																	highPressure &&
																	shousuoya2 >=
																	highPressure) {
																	aaa[i]
																		.jingbaoshow2 =
																		false
																	aaa[i].jingbao2 =
																		highPressure +
																		"mmHg"
																} else {
																	aaa[i]
																		.jingbaoshow2 =
																		true
																	aaa[i].jingbao2 =
																		highPressure +
																		"mmHg"
																	that.notifyTriggered =
																		true
																}
															}
															if (aaa[i].dataPoints[aa]
																.register ===
																"heartrate") {
																const heartrate =
																	parseInt(aaa[i]
																		.dataPoints[aa]
																		.registerVal);
																if (maibo1 <=
																	heartrate &&
																	maibo2 >=
																	heartrate) {
																	aaa[i]
																		.jingbaoshow3 =
																		false
																	aaa[i].jingbao3 =
																		heartrate +
																		"BPM"
																} else {
																	aaa[i]
																		.jingbaoshow3 =
																		true
																	aaa[i].jingbao3 =
																		heartrate +
																		"BPM"
																	that.notifyTriggered =
																		true
																}
															}
															if (aaa[i].dataPoints[aa]
																.register ===
																"oxygen") {
																const oxygen =
																	parseInt(aaa[i]
																		.dataPoints[
																			aa]
																		.registerVal);
																if (xeuyang1 <=
																	oxygen &&
																	xeuyang2 >=
																	oxygen) {
																	aaa[i]
																		.jingbaoshow4 =
																		false
																	aaa[i].jingbao4 =
																		oxygen + "%"
																} else {
																	aaa[i]
																		.jingbaoshow4 =
																		true
																	aaa[i].jingbao4 =
																		oxygen + "%"
																	that.notifyTriggered =
																		true

																}
															}
														}
														bbb.push(aaa[i])
														uni.setStorageSync(
															"switchList", bbb)
													}
													that.checkAndNotify();
												}
											}
										} else {
											let array1 = uni.getStorageSync(
												"switchList");
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
												item.dataPoints.forEach(
													dataPoint => {
														let value =
															parseInt(
																dataPoint
																.registerVal
															);
														switch (dataPoint
															.register) {
															case "lowPressure":
																that.checkAlarm(
																	item,
																	dataPoint
																	.register,
																	value,
																	that
																	.shuzhangya1,
																	that
																	.shuzhangya2,
																	"jingbaoshow1",
																	"jingbao1",
																	"mmHg"
																);
																break;
															case "highPressure":
																that.checkAlarm(
																	item,
																	dataPoint
																	.register,
																	value,
																	that
																	.shousuoya1,
																	that
																	.shousuoya2,
																	"jingbaoshow2",
																	"jingbao2",
																	"mmHg"
																);
																break;
															case "heartrate":
																that.checkAlarm(
																	item,
																	dataPoint
																	.register,
																	value,
																	that
																	.maibo1,
																	that
																	.maibo2,
																	"jingbaoshow3",
																	"jingbao3",
																	"BPM"
																);
																break;
															case "oxygen":
																that.checkAlarm(
																	item,
																	dataPoint
																	.register,
																	value,
																	that
																	.xeuyang1,
																	that
																	.xeuyang2,
																	"jingbaoshow4",
																	"jingbao4",
																	"%"
																);
																break;
														}
													});
												array2.push(item);
											});
											let combinedArray = array2.concat(
												array1.filter(item => !array2.some(
													longItem => longItem.id ===
													item.id))
											);
											// 更新
											uni.setStorageSync("switchList",
												combinedArray)
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
				if (min && max) {
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
			// 封装检查和通知的逻辑（同一轮告警只推送一次）
			checkAndNotify() {
				const that = this
				if (!that.notifyTriggered || that.notifySending || uni.getStorageSync('isProcessed')) {
					return
				}
				that.notifySending = true
				that.notifyTriggered = false
				uni.getPushClientId({
					success(res) {
						uni.setStorageSync('isProcessed', true)
						that.sendPushMessage(res.cid)
						setTimeout(() => {
							uni.removeStorageSync('isProcessed')
						}, 5000)
						that.notifySending = false
					},
					fail() {
						that.notifySending = false
					}
				})
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