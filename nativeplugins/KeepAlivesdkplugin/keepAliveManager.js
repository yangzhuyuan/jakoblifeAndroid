/**
 * 保活管理器 - 夜间防杀专用（含无声音乐保活 + 白名单管理 + 通知权限 + 定位保活）
 */
const keepAlive = uni.requireNativePlugin('KeepAliveModule');

/** 情绪定时保活闹钟固定 15 秒（与 qxBleAlignedSchedule.QX_BLE_SLOT_ALARM_POLL_SEC 一致） */
const QX_BLE_SLOT_ALARM_POLL_SEC = 15

/** 与 qxBleAlignedSchedule 一致，避免原生模块与业务模块循环依赖 */
function getQxBleKeepAliveAlarmIntervalSecFromStorage() {
	const v = uni.getStorageSync('switchHER')
	const on = v === true || v === 'true' || v === 1 || v === '1'
	if (!on) return null
	return QX_BLE_SLOT_ALARM_POLL_SEC
}

const BLOOD_PRESSURE_TIMER_CONFIG_KEY = 'blood_pressure_timer_config'

function shouldKeepAliveForAppTimersFromStorage() {
	if (getQxBleKeepAliveAlarmIntervalSecFromStorage() != null) return true
	try {
		const saved = uni.getStorageSync(BLOOD_PRESSURE_TIMER_CONFIG_KEY)
		if (!saved || typeof saved !== 'object') return false
		if (saved.currentMode === '24h' || saved.currentMode === '7d') return true
		if (saved.is24HourMode === true || saved.is24HourMode === 'true') return true
		if (saved.is7DayMode === true || saved.is7DayMode === 'true') return true
		const items = saved.items
		if (!Array.isArray(items) || items.length === 0) return false
		return items.some((item) => item && item.enabled === true)
	} catch (e) {
		return false
	}
}

/** 解析原生 startKeepAlive / setAlarmTimer 使用的秒级间隔 */
function resolveKeepAliveAlarmIntervalSec(isNight) {
	const qxSec = getQxBleKeepAliveAlarmIntervalSecFromStorage()
	if (qxSec != null) return qxSec
	return isNight ? 30 : 90
}

/** 与 NightKeepAliveHelper 默认一致 */
const NATIVE_NIGHT_START_HOUR = 23
const NATIVE_NIGHT_END_HOUR = 6
const NATIVE_NIGHT_ALARM_INTERVAL_SEC = 15

function resolveNightKeepAliveAlarmIntervalSec() {
	const qxSec = getQxBleKeepAliveAlarmIntervalSecFromStorage()
	if (qxSec != null) return qxSec
	return NATIVE_NIGHT_ALARM_INTERVAL_SEC
}

/** 用户已对通知权限做过选择（允许/拒绝/稍后），之后不再自动弹窗、不再自动跳通知设置 */
const NOTIFICATION_USER_RESPONDED_KEY = 'keepAlive_notification_user_responded';

// ========== 新增：定位相关存储键 ==========
const LOCATION_KEEPALIVE_ENABLED_KEY = 'keepAlive_location_keepalive_enabled';
const LOCATION_UPDATE_INTERVAL_KEY = 'keepAlive_location_update_interval';
const LOCATION_LAST_KNOWN_KEY = 'keepAlive_location_last_known';
/** 用户曾在系统弹窗选「仅使用期间允许」：不再自动重复调起 ACCESS_BACKGROUND_LOCATION 系统申请 */
const BG_LOCATION_WHILE_IN_USE_ACK_KEY = 'keepAlive_bg_location_while_in_use_ack';

class KeepAliveManager {
	constructor() {
		this.isRunning = false;
		this.nightMode = false;
		this.alarmInterval = 30; // 默认30秒
		this.checkTimer = null;
		this.silentMusicEnabled = false; // 无声音乐暂时关闭
		this._initInProgress = false;
		this.whiteListStatus = {
			isInWhiteList: false,
			isIgnoringBattery: false,
			manufacturer: '',
			model: ''
		};
		this.notificationEnabled = false; // 通知权限状态
		/** 跳转厂商白名单/系统设置前已暂停前台服务，回到 App 后需恢复 */
		this._suspendedForWhitelistUi = false;
		this._alarmListenerBound = false;
		/** 由 qxBleAlignedSchedule 注册，避免动态 import 延迟导致熄屏唤醒漏检 */
		this._qxBleWakeHandler = null;
		this._qxBleHeartbeatFn = null;
		this._qxBleMeasuringFn = null;
		/** onAlarmTrigger 去重（uni.$on 与 plus.globalEvent 可能双发） */
		this._lastAlarmEventAt = 0;
		this._qxAlarmDebounceTimer = null;
		this._qxAlarmLastSetAt = 0;
		/** 原生 startNightKeepAlive 是否已启用（与日间 startKeepAlive 主链互斥） */
		this._nativeNightKeepAliveActive = false;

		// ========== 新增：定位保活相关属性 ==========
		this.locationKeepAliveEnabled = false; // 是否启用定位保活
		this.lastLocation = null; // 最后获取的位置
		this.locationUpdateInterval = 30000; // 定位更新间隔（毫秒），默认30秒
		this.locationTimer = null; // 定位定时器
		this.locationPermissionGranted = false; // 定位权限状态
		/** 防止「仅使用期间允许」说明弹窗叠多个 */
		this._bgWhileInUseModalShowing = false;
		/** 本次进入前台是否已展示过说明（onAppShow 会重置，以便重新打开 App 再提示） */
		this._bgWhileInUseGuideShownThisLaunch = false;
		this._locationCallbacks = new Map(); // 存储回调
		this._callbackIdCounter = 0;
		// ========================================

		// ========== 新增：加载保存的定位配置 ==========
		this._loadLocationConfig();
	}

	// ==================== 定位保活相关方法 ====================

	/**
	 * 加载保存的定位配置
	 */
	_loadLocationConfig() {
		try {
			const saved = uni.getStorageSync(LOCATION_KEEPALIVE_ENABLED_KEY);
			if (saved !== undefined && saved !== null && saved !== '') {
				this.locationKeepAliveEnabled = saved === true || saved === 'true';
			}

			const savedInterval = uni.getStorageSync(LOCATION_UPDATE_INTERVAL_KEY);
			if (savedInterval && typeof savedInterval === 'number') {
				this.locationUpdateInterval = savedInterval;
			}

			const savedLocation = uni.getStorageSync(LOCATION_LAST_KNOWN_KEY);
			if (savedLocation && typeof savedLocation === 'object') {
				this.lastLocation = savedLocation;
			}
		} catch (e) {
			console.log('[KeepAlive] 加载定位配置失败:', e);
		}
	}

	/**
	 * 保存定位配置
	 */
	_saveLocationConfig() {
		try {
			uni.setStorageSync(LOCATION_KEEPALIVE_ENABLED_KEY, this.locationKeepAliveEnabled);
			uni.setStorageSync(LOCATION_UPDATE_INTERVAL_KEY, this.locationUpdateInterval);
			if (this.lastLocation) {
				uni.setStorageSync(LOCATION_LAST_KNOWN_KEY, this.lastLocation);
			}
		} catch (e) {
			console.log('[KeepAlive] 保存定位配置失败:', e);
		}
	}

	/**
	 * 情绪定时（switchHER）或血压定时开启时，才需要为 App 定时任务拉起保活。
	 * 供 App.vue onHide/onShow 门闩使用，逻辑与 onAppHide 内部判断一致。
	 */
	shouldKeepAliveForAppTimers() {
		return shouldKeepAliveForAppTimersFromStorage();
	}

	/**
	 * 应用进入后台时调用（在 App.vue onHide 中调用）
	 */
	onAppHide() {
		if (shouldKeepAliveForAppTimersFromStorage()) {
			this.ensureAlarmListener();
			this.ensureRunningForAppTimers();
		} else if (this.isRunning && this._shouldUseNightKeepAliveNative()) {
			this.ensureAlarmListener();
			this._syncNativeKeepAliveMode();
		}

		// 如果启用了定位保活，确保后台持续运行
		if (this.locationKeepAliveEnabled) {
			// console.log('[KeepAlive] 定位保活已启用，确保后台服务运行');
			// 调用新的 ensureLocationRunning 方法
			this.ensureLocationRunning({
				interval: this.locationUpdateInterval || 30000
			}).then(result => {
				// console.log('[KeepAlive] 确保定位保活运行结果:', result);
			}).catch(err => {
				// console.log('[KeepAlive] 确保定位保活运行失败:', err);
			});
		}
	}

	/**
	 * 应用进入前台时调用（在 App.vue onShow 中调用）
	 */
	onAppShow() {
		this._bgWhileInUseGuideShownThisLaunch = false;
		setTimeout(() => {
			this._promptBackgroundLocationWhileInUseOnAppShow();
		}, 1200);
	}

	/** 重新进入 App 时：若仍为「仅使用期间允许」，再次提示并可跳转设置 */
	_promptBackgroundLocationWhileInUseOnAppShow() {
		this._clearBackgroundWhileInUseAckIfGranted();
		if (!this._isAndroidForegroundOnlyLocationState()) {
			return;
		}
		if (this._bgWhileInUseGuideShownThisLaunch) {
			return;
		}
		this._showBackgroundLocationWhileInUseModal();
	}

	_isNightHour() {
		const hour = new Date().getHours();
		return hour >= NATIVE_NIGHT_START_HOUR || hour <= NATIVE_NIGHT_END_HOUR;
	}

	/** 是否走原生夜间防杀链（23–6，与 NightKeepAliveHelper 一致） */
	_shouldUseNightKeepAliveNative() {
		return this._isNightHour();
	}

	/**
	 * 与原生 NightKeepAliveHelper.isNightTime 对齐（有 API 时优先，避免 JS 与原生时段不一致）
	 * @param {(isNight: boolean) => void} callback
	 */
	_queryIsNightHour(callback) {
		if (typeof callback !== 'function') {
			return;
		}
		if (keepAlive && typeof keepAlive.isNightTime === 'function') {
			keepAlive.isNightTime((res) => {
				const isNight = !!(res && res.code === 0 && res.isNightTime);
				callback(isNight);
			});
			return;
		}
		callback(this._isNightHour());
	}

	/** 从原生回调同步闹钟间隔 */
	_applyAlarmIntervalFromNativeRes(res, fallbackSec) {
		this.alarmInterval = (res && res.alarmInterval) ? res.alarmInterval : fallbackSec;
	}

	/**
	 * 是否处于定时/手表采集中（优先 qxBleAlignedSchedule 注册的会话判断，含 inFlight/抢占）
	 */
	_isQxBleMeasuringForNotification() {
		if (this._qxBleMeasuringFn) {
			try {
				if (this._qxBleMeasuringFn()) {
					return true;
				}
			} catch (e) {}
		}
		const sleepAlert = uni.getStorageSync('sleep_alertdisabled');
		if (sleepAlert === true || sleepAlert === 'true' || sleepAlert === 1 || sleepAlert === '1') {
			return true;
		}
		const sendwatch = uni.getStorageSync('sendwatch');
		if (sendwatch === 1 || sendwatch === '1') {
			return true;
		}
		const scheduled = uni.getStorageSync('qx_ble_scheduled_measure');
		if (scheduled === 1 || scheduled === '1') {
			return true;
		}
		return false;
	}

	_appendMeasuringHintIfNeeded(contentText, isZh) {
		if (!this._isQxBleMeasuringForNotification()) {
			return contentText;
		}
		if (contentText.indexOf('正在测量中') >= 0 || contentText.indexOf('Measuring in progress') >= 0) {
			return contentText;
		}
		return contentText + (isZh ? ' · 正在测量中' : ' · Measuring in progress');
	}

	/** 构建前台通知文案（startService / updateNotification 共用） */
	_buildKeepAliveNotificationPayload(forUpdate = false) {
		const isNight = this._isNightHour();
		const useNightNative = this._shouldUseNightKeepAliveNative();
		const isZh = this.getLocale();
		const alarmInterval = useNightNative ?
			resolveNightKeepAliveAlarmIntervalSec() :
			resolveKeepAliveAlarmIntervalSec(isNight);
		let contentText;
		if (forUpdate) {
			const intervalSec = this.alarmInterval > 0 ? this.alarmInterval : alarmInterval;
			contentText = isZh ?
				`无声音乐保活中` :
				`Silent music active`;
		} else if (useNightNative) {
			contentText = isZh ? '夜间防杀保护已开启' : 'Night anti-kill protection active';
		} else if (isZh) {
			contentText = isNight ? '后台服务夜间模式（无声音乐保活）' : '后台服务正常运行';
		} else {
			contentText = isNight ? 'Background service with silent music' : 'Background service running normally';
		}
		if (this.locationKeepAliveEnabled) {
			contentText += isZh ? ' · 后台保活增强（不采集位置）' : ' · Enhanced keep-alive (no location collection)';
		}
		contentText = this._appendMeasuringHintIfNeeded(contentText, isZh);
		return {
			isNight,
			isZh,
			useNightNative,
			title: (useNightNative || isNight) ?
				(isZh ? '夜间保活中' : 'Nighttime Keep-Alive') : (isZh ? 'JakobLife' : 'JakobLife'),
			content: contentText,
			icon: 'static/icons/48x48.png',
			alarmInterval
		};
	}

	/** 原生 startNightKeepAlive 参数 */
	_buildNightKeepAliveNativeOptions(payload) {
		return {
			title: payload.title,
			content: payload.content,
			icon: payload.icon,
			alarmInterval: payload.alarmInterval,
			startHour: NATIVE_NIGHT_START_HOUR,
			endHour: NATIVE_NIGHT_END_HOUR
		};
	}

	_startNativeDayKeepAlive(callback, enableJob = true) {
		const payload = this._buildKeepAliveNotificationPayload(false);
		keepAlive.startKeepAlive({
			title: payload.title,
			content: payload.content,
			icon: payload.icon,
			alarmInterval: payload.alarmInterval,
			enableJob: enableJob
		}, (res) => {
			this._nativeNightKeepAliveActive = false;
			this._applyAlarmIntervalFromNativeRes(res, payload.alarmInterval);
			this.nightMode = payload.isNight;
			if (typeof callback === 'function') {
				callback(res);
			}
		});
	}

	_startNativeNightKeepAlive(callback) {
		const payload = this._buildKeepAliveNotificationPayload(false);
		keepAlive.startNightKeepAlive(
			this._buildNightKeepAliveNativeOptions(payload),
			(res) => {
				this._nativeNightKeepAliveActive = !!(res && res.code === 0);
				this._applyAlarmIntervalFromNativeRes(res, payload.alarmInterval);
				this.nightMode = true;
				if (typeof callback === 'function') {
					callback(res);
				}
			}
		);
	}

	_stopNativeNightKeepAlive(callback) {
		keepAlive.stopNightKeepAlive((res) => {
			this._nativeNightKeepAliveActive = false;
			if (typeof callback === 'function') {
				callback(res);
			}
		});
	}

	/** 情绪槽位 / 日间闹钟：在原生主链就绪后调用（闹钟暂时关闭） */
	_scheduleAppTimerAlarms() {
		return;
		// if (getQxBleKeepAliveAlarmIntervalSecFromStorage() != null) {
		// 	this.scheduleQxBleAlarmFromStorage();
		// 	return;
		// }
		// if (!this._nativeNightKeepAliveActive) {
		// 	this.setAlarmTimer();
		// }
	}

	/**
	 * 按当前时段切换原生主链（夜间 startNightKeepAlive / 日间 startKeepAlive）
	 */
	_syncNativeKeepAliveMode(callback) {
		if (!this.isRunning) {
			if (typeof callback === 'function') {
				callback();
			}
			return;
		}
		const afterChain = (res) => {
			this._scheduleAppTimerAlarms();
			if (typeof callback === 'function') {
				callback(res);
			}
		};
		if (this._shouldUseNightKeepAliveNative()) {
			if (this._nativeNightKeepAliveActive) {
				const payload = this._buildKeepAliveNotificationPayload(false);
				keepAlive.startNightKeepAlive(
					this._buildNightKeepAliveNativeOptions(payload),
					(res) => {
						this._applyAlarmIntervalFromNativeRes(res, payload.alarmInterval);
						afterChain(res);
					}
				);
			} else {
				this._startNativeNightKeepAlive(afterChain);
			}
			return;
		}
		if (this._nativeNightKeepAliveActive) {
			this._stopNativeNightKeepAlive(() => {
				this._startNativeDayKeepAlive(afterChain, true);
			});
			return;
		}
		this._startNativeDayKeepAlive(afterChain, true);
	}

	/** 一键启动原生保活链（自动选择夜间/日间 API，闹钟由 _syncNativeKeepAliveMode 统一调度） */
	_startNativeKeepAlive(callback) {
		if (this._shouldUseNightKeepAliveNative()) {
			this._startNativeNightKeepAlive(callback);
			return;
		}
		this._startNativeDayKeepAlive(callback, true);
	}

	/**
	 * 获取最后已知位置（同步，快速返回）
	 * @returns {Object|null} 位置信息，如果没有则返回null
	 */
	getLastKnownLocation() {
		return this.lastLocation;
	}

	/**
	 * 同步获取最后已知位置（从原生层获取）
	 * @returns {Promise} 返回位置信息
	 */
	syncGetLastKnownLocation() {
		return new Promise((resolve) => {
			keepAlive.getLastKnownLocation((res) => {
				console.log('[KeepAlive] 同步获取最后已知位置:', res);

				if (res.code === 0 && res.data) {
					this.lastLocation = {
						latitude: res.data.latitude,
						longitude: res.data.longitude,
						accuracy: res.data.accuracy,
						provider: res.data.provider,
						time: res.data.time || Date.now()
					};
					this._saveLocationConfig();
					resolve({
						success: true,
						location: this.lastLocation,
						message: res.msg
					});
				} else {
					resolve({
						success: false,
						location: this.lastLocation,
						message: res.msg || '暂无位置信息'
					});
				}
			});
		});
	}

	/**
	 * 启动原生侧定位类保活渠道（应用层不轮询经纬度）
	 * @param {Object} options 配置选项
	 * @param {number} options.interval 定位更新间隔（毫秒），默认30000
	 * @returns {Promise}
	 */
	async startLocationKeepAlive(options = {}) {
		// console.log('[KeepAlive] ========== 开始启动定位保活 ==========');
		const interval = options.interval || this.locationUpdateInterval;

		// 先检查权限
		// console.log('[KeepAlive] 步骤1: 检查定位权限...');
		const permResult = await this.checkLocationPermission();
		// console.log('[KeepAlive] 权限检查结果:', JSON.stringify(permResult));

		if (!permResult.granted) {
			if (this._isAndroidForegroundOnlyLocationState()) {
				await this._handleAndroidForegroundOnlyLocationState(!options.silent);
				return {
					success: false,
					message: '请授予后台定位权限（始终允许）'
				};
			}
			const requestDelay = options.silent ? 2000 : 1200;
			const requestResult = await this._requestAndroidLocationPermissionsDeferred(requestDelay, {
				showForegroundPurpose: !options.silent
			});
			console.log('[KeepAlive] 权限请求结果:', JSON.stringify(requestResult));

			if (!requestResult.granted) {
				console.log('[KeepAlive] 定位权限被拒绝，启动失败');
				if (!options.silent) {
					this.showLocationPermissionGuide();
				}
				return {
					success: false,
					message: '定位权限未授予，请先授权'
				};
			}
		}

		// console.log('[KeepAlive] 步骤2: 调用原生层 startLocationKeepAlive...');

		return new Promise((resolve) => {
			// 调用原生层启动定位保活
			keepAlive.startLocationKeepAlive((res) => {
				// console.log('[KeepAlive] 原生层返回结果:', JSON.stringify(res));

				if (res.code === 0) {
					this.locationKeepAliveEnabled = true;
					this.locationUpdateInterval = interval;
					this._saveLocationConfig();

					// 仅保活：不在 JS 层定时 getCurrentLocation，由原生侧维持保活

					// 触发事件
					this._emitLocationEvent('locationKeepAliveStarted', {
						interval: interval
					});

					this.updateNotification();
					// console.log('【KeepAlive】定位保活启动成功 ✅');
					resolve({
						success: true,
						message: res.msg || '定位保活已启动'
					});
				} else {
					console.log('[KeepAlive] 定位保活启动失败 ❌, code:', res.code, 'msg:', res.msg);
					resolve({
						success: false,
						message: res.msg || '启动定位保活失败',
						code: res.code
					});
				}
			});
		});
	}

	/**
	 * 静默启动定位保活（App 启动时调用，不弹失败框/权限引导）
	 * @param {Object} options 同 startLocationKeepAlive
	 */
	async startLocationKeepAliveSilently(options = {}) {
		try {
			return await this.startLocationKeepAlive({
				...options,
				silent: true
			});
		} catch (error) {
			console.log('[KeepAlive] 静默启动定位保活异常:', error);
			return {
				success: false,
				message: error && error.message ? error.message : '启动定位保活失败'
			};
		}
	}

	/**
	 * 手动启动定位保活（带用户提示）
	 * @param {{ silent?: boolean }} options
	 */
	async manualStartLocationKeepAlive(options = {}) {
		const isZh = this.getLocale();
		const silent = !!options.silent;

		try {
			const result = await this.startLocationKeepAlive({
				interval: options.interval || 30000,
				silent: silent
			});

			if (result.success) {
				this.updateNotification();
			} else if (!silent) {
				uni.showModal({
					title: isZh ? '启动失败' : 'Start Failed',
					content: result.message,
					confirmText: isZh ? '去授权' : 'Grant',
					cancelText: isZh ? '取消' : 'Cancel',
					success: (modalRes) => {
						if (modalRes.confirm) {
							this.showLocationPermissionGuide();
						}
					}
				});
			} else {
				console.log('[KeepAlive] 静默启动定位保活未成功:', result.message);
			}
		} catch (error) {
			console.error('[KeepAlive] 启动定位保活异常:', error);
			if (!silent) {
				uni.showToast({
					title: isZh ? '启动失败: ' + (error.message || '未知错误') : 'Start failed: ' + (error
						.message ||
						'Unknown error'),
					icon: 'none'
				});
			}
		}
	}

	/**
	 * 测试定位功能（用于调试）
	 */
	async testLocation() {
		console.log('[KeepAlive] ========== 测试保活（不自动取点）==========');

		// 1. 检查权限
		console.log('[KeepAlive] 1. 检查定位权限...');
		const permResult = await this.checkLocationPermission();
		console.log('[KeepAlive] 权限状态:', permResult);

		if (!permResult.granted) {
			console.log('[KeepAlive] 权限未授予，尝试请求...');
			const requestResult = await this.requestLocationPermission();
			console.log('[KeepAlive] 请求结果:', requestResult);
		}

		// 2. 启动原生侧保活（应用层不读经纬度）
		console.log('[KeepAlive] 2. 尝试启动保活渠道...');
		const startResult = await this.startLocationKeepAlive({
			interval: 30000
		});
		console.log('[KeepAlive] 启动结果:', startResult);

		// 3. 查看最终状态
		console.log('[KeepAlive] 3. 最终状态:', this.getLocationKeepAliveStatus());

		return {
			permission: permResult,
			lastLocation: null,
			startResult: startResult,
			status: this.getLocationKeepAliveStatus()
		};
	}

	/**
	 * 停止定位保活
	 * @returns {Promise}
	 */
	stopLocationKeepAlive() {
		return new Promise((resolve) => {
			console.log('[KeepAlive] 停止定位保活');

			// 停止定时器
			this._stopLocationTimer();

			// 调用原生层停止定位保活
			keepAlive.stopLocationKeepAlive((res) => {
				console.log('[KeepAlive] 定位保活停止结果:', res);

				this.locationKeepAliveEnabled = false;
				this._saveLocationConfig();

				// 触发事件
				this._emitLocationEvent('locationKeepAliveStopped', {});

				resolve({
					success: true,
					message: res.msg || '定位保活已停止'
				});
			});
		});
	}


	/**
	 * 确保定位保活服务正在运行（智能启动，避免重复启动）
	 * @param {Object} options 配置选项
	 * @param {number} options.interval 定位更新间隔（毫秒）
	 * @returns {Promise}
	 */
	ensureLocationRunning(options = {}) {
		// console.log('[KeepAlive] 确保定位保活服务运行中...');

		return new Promise(async (resolve) => {
			// 如果已经在运行，直接返回
			if (this.locationKeepAliveEnabled) {
				// console.log('[KeepAlive] 定位保活已在运行中');

				// 但仍然检查一下权限和定时器状态
				const permResult = await this.checkLocationPermission();
				if (!permResult.granted) {
					if (this._isAndroidForegroundOnlyLocationState()) {
						await this._handleAndroidForegroundOnlyLocationState(false);
						resolve({
							success: false,
							message: '请授予后台定位权限（始终允许）',
							alreadyRunning: true
						});
						return;
					}
					console.log('[KeepAlive] 定位保活运行中但权限丢失，尝试重新获取');
					const requestResult = await this.requestLocationPermission();
					if (!requestResult.granted) {
						resolve({
							success: false,
							message: '定位权限已丢失',
							alreadyRunning: true
						});
						return;
					}
				}

				// 仅保活：不启动 JS 定时取点
				resolve({
					success: true,
					message: '定位保活已在运行中',
					alreadyRunning: true
				});
				return;
			}

			// 未运行，尝试启动
			console.log('[KeepAlive] 定位保活未运行，尝试启动...');

			const interval = options.interval || this.locationUpdateInterval;

			// 检查权限
			const permResult = await this.checkLocationPermission();
			if (!permResult.granted) {
				if (this._isAndroidForegroundOnlyLocationState()) {
					await this._handleAndroidForegroundOnlyLocationState(false);
					resolve({
						success: false,
						message: '请授予后台定位权限（始终允许）'
					});
					return;
				}
				console.log('[KeepAlive] 定位权限未授予，尝试请求...');
				const requestResult = await this.requestLocationPermission();
				if (!requestResult.granted) {
					resolve({
						success: false,
						message: '定位权限未授予，无法启动定位保活'
					});
					return;
				}
			}

			// 调用原生层启动
			keepAlive.startLocationKeepAlive((res) => {
				console.log('[KeepAlive] ensureLocationRunning 结果:', res);

				if (res.code === 0) {
					this.locationKeepAliveEnabled = true;
					this.locationUpdateInterval = interval;
					this._saveLocationConfig();

					// 触发事件
					this._emitLocationEvent('locationKeepAliveStarted', {
						interval: interval,
						source: 'ensureLocationRunning'
					});

					this.updateNotification();

					resolve({
						success: true,
						message: res.msg || '定位保活已启动',
						alreadyRunning: false
					});
				} else {
					resolve({
						success: false,
						message: res.msg || '启动定位保活失败',
						code: res.code
					});
				}
			});
		});
	}

	/**
	 * 获取当前位置（异步）
	 * @param {number} timeout 超时时间（毫秒），默认10000
	 * @returns {Promise} 返回位置信息
	 */
	getCurrentLocation(timeout = 10000) {
		console.log('[KeepAlive] 获取当前位置，超时:', timeout, 'ms');

		return new Promise((resolve, reject) => {
			const callbackId = this._generateCallbackId();

			// 设置超时
			const timeoutId = setTimeout(() => {
				this._locationCallbacks.delete(callbackId);
				reject({
					success: false,
					message: '获取位置超时'
				});
			}, timeout);

			// 存储回调
			this._locationCallbacks.set(callbackId, (result) => {
				clearTimeout(timeoutId);
				if (result.success) {
					// 更新本地缓存
					this.lastLocation = result.location;
					this._saveLocationConfig();
					resolve(result);
				} else {
					reject(result);
				}
			});

			// 调用原生层
			keepAlive.getCurrentLocation({
				timeout: timeout
			}, (res) => {
				const callback = this._locationCallbacks.get(callbackId);
				if (callback) {
					this._locationCallbacks.delete(callbackId);
					if (res.code === 0 && res.data) {
						callback({
							success: true,
							location: {
								latitude: res.data.latitude,
								longitude: res.data.longitude,
								accuracy: res.data.accuracy,
								provider: res.data.provider,
								time: res.data.time || Date.now()
							},
							message: res.msg
						});
					} else {
						callback({
							success: false,
							message: res.msg || '获取位置失败'
						});
					}
				}
			});
		});
	}

	/**
	 * 生成回调ID
	 * @private
	 */
	_generateCallbackId() {
		return `loc_${Date.now()}_${++this._callbackIdCounter}`;
	}

	/**
	 * 设置定位更新间隔
	 * @param {number} interval 间隔时间（毫秒）
	 */
	setLocationUpdateInterval(interval) {
		if (interval < 1000) {
			console.warn('[KeepAlive] 定位间隔不能小于1秒，已调整为1秒');
			interval = 1000;
		}

		this.locationUpdateInterval = interval;
		this._saveLocationConfig();

		// 如果正在运行，重启定时器
		if (this.locationKeepAliveEnabled && this.locationTimer) {
			this._startLocationTimer(interval);
			console.log('[KeepAlive] 定位更新间隔已更新为:', interval, 'ms');
		}

		return this.locationUpdateInterval;
	}

	/**
	 * 获取定位保活详细状态（增强版）
	 */
	getLocationKeepAliveStatus() {
		const now = Date.now();
		const locationAge = this.lastLocation ? now - (this.lastLocation.time || 0) : null;

		return {
			enabled: this.locationKeepAliveEnabled,
			interval: this.locationUpdateInterval,
			hasLocation: this.lastLocation !== null,
			lastLocation: this.lastLocation ? {
				latitude: this.lastLocation.latitude,
				longitude: this.lastLocation.longitude,
				accuracy: this.lastLocation.accuracy,
				provider: this.lastLocation.provider,
				time: this.lastLocation.time,
				age: locationAge,
				ageFormatted: locationAge ? this._formatDuration(locationAge) : null
			} : null,
			permissionGranted: this.locationPermissionGranted,
			timerRunning: this.locationTimer !== null,
			locationAgeMs: locationAge
		};
	}

	/**
	 * 格式化时长显示
	 * @private
	 */
	_formatDuration(ms) {
		if (ms < 60000) {
			return Math.floor(ms / 1000) + '秒前';
		} else if (ms < 3600000) {
			return Math.floor(ms / 60000) + '分钟前';
		} else {
			return Math.floor(ms / 3600000) + '小时前';
		}
	}

	/**
	 * 监听位置变化（通过事件）
	 * @param {Function} callback 位置变化回调
	 */
	onLocationChange(callback) {
		if (typeof callback !== 'function') {
			console.warn('[KeepAlive] onLocationChange 需要传入函数');
			return;
		}

		// 监听位置心跳事件
		uni.$on('location_locationHeartbeat', (data) => {
			if (data.location) {
				callback(data.location, data);
			}
		});

		// 也可以监听通用位置事件
		uni.$on('keepAliveLocationEvent', (data) => {
			if (data.type === 'locationHeartbeat' && data.data && data.data.location) {
				// 避免重复回调，上面的已经回调了
			}
		});

		console.log('[KeepAlive] 已注册位置变化监听');
	}

	/**
	 * 移除位置变化监听
	 */
	offLocationChange() {
		uni.$off('location_locationHeartbeat');
		console.log('[KeepAlive] 已移除位置变化监听');
	}

	/**
	 * 一次性获取当前位置（带超时和重试）
	 * @param {Object} options 配置项
	 * @param {number} options.timeout 超时时间（毫秒）
	 * @param {number} options.retryCount 重试次数
	 * @param {number} options.retryDelay 重试间隔（毫秒）
	 * @returns {Promise}
	 */
	async getCurrentLocationWithRetry(options = {}) {
		const timeout = options.timeout || 10000;
		const retryCount = options.retryCount || 2;
		const retryDelay = options.retryDelay || 1000;

		let lastError = null;

		for (let i = 0; i <= retryCount; i++) {
			try {
				console.log(`[KeepAlive] 获取位置尝试 ${i + 1}/${retryCount + 1}`);
				const location = await this.getCurrentLocation(timeout);
				return location;
			} catch (error) {
				lastError = error;
				console.log(`[KeepAlive] 获取位置失败 (尝试 ${i + 1}):`, error.message);

				if (i < retryCount) {
					await this._delay(retryDelay);
				}
			}
		}

		throw lastError || new Error('获取位置失败');
	}

	/**
	 * 延迟辅助函数
	 * @private
	 */
	_delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * 检查并请求位置权限（带用户引导）
	 * @returns {Promise<boolean>}
	 */
	async ensureLocationPermission() {
		const isZh = this.getLocale();

		// 检查权限
		const checkResult = await this.checkLocationPermission();
		if (checkResult.granted) {
			console.log('[KeepAlive] 位置权限已授予');
			return true;
		}

		// 检查是否已经显示过引导
		const guideShown = uni.getStorageSync('keepAlive_location_guide_shown');
		if (!guideShown) {
			// 显示引导说明
			return new Promise((resolve) => {
				uni.showModal({
					title: isZh ? '需要位置权限' : 'Location Permission Required',
					content: isZh ?
						'为了保持应用在后台稳定运行，需要获取位置权限。\n\n位置信息仅用于保活服务，不会在后台频繁上传。' :
						'To keep the app running stably in background, location permission is required.\n\nLocation is only used for keep-alive service, not uploaded frequently in background.',
					confirmText: isZh ? '去授权' : 'Grant',
					cancelText: isZh ? '取消' : 'Cancel',
					success: async (res) => {
						uni.setStorageSync('keepAlive_location_guide_shown', true);
						if (res.confirm) {
							const requestResult = await this.requestLocationPermission();
							resolve(requestResult.granted);
						} else {
							resolve(false);
						}
					}
				});
			});
		}

		// 直接请求权限
		const requestResult = await this.requestLocationPermission();
		return requestResult.granted;
	}



	/**
	 * 原用于 JS 层定时拉取位置；现改为仅保活，不再启动定时取点。
	 * @param {number} interval 保留参数以兼容旧调用
	 */
	_startLocationTimer(interval) {
		this._stopLocationTimer();
		console.log('[KeepAlive] 已跳过 JS 定时取点（仅保活，应用层不采集经纬度）');
	}

	/**
	 * 停止定位定时器
	 */
	_stopLocationTimer() {
		if (this.locationTimer) {
			clearInterval(this.locationTimer);
			this.locationTimer = null;
			console.log('[KeepAlive] 定位定时器已停止');
		}
	}

	/**
	 * 原用于定时拉取位置；现仅保活，不再调用 getCurrentLocation。
	 */
	_fetchLocationForKeepAlive() {
		// no-op：经纬度由业务侧按需调用 getCurrentLocation，不在此自动采集
	}

	/**
	 * Android 定位权限列表
	 * @param {boolean} includeBackground 是否包含后台定位（不可与前台同批 request，否则 Android10+ 可能不弹窗）
	 */
	_getAndroidLocationPermissions(includeBackground = false) {
		const permissions = [
			'android.permission.ACCESS_FINE_LOCATION',
			'android.permission.ACCESS_COARSE_LOCATION'
		];
		if (includeBackground) {
			const Build = plus.android.importClass('android.os.Build');
			if (Build.VERSION.SDK_INT >= 29) {
				permissions.push('android.permission.ACCESS_BACKGROUND_LOCATION');
			}
		}
		return permissions;
	}

	/** 是否已授予前台定位（精确或粗略） */
	_isAndroidLocationRequestGranted(e) {
		if (!e || !Array.isArray(e.granted) || e.granted.length === 0) {
			return false;
		}
		const g = e.granted;
		return g.indexOf('android.permission.ACCESS_FINE_LOCATION') >= 0 ||
			g.indexOf('android.permission.ACCESS_COARSE_LOCATION') >= 0;
	}

	_androidHasForegroundLocationGranted() {
		// #ifdef APP-PLUS
		try {
			const main = plus.android.runtimeMainActivity();
			const PackageManager = plus.android.importClass('android.content.pm.PackageManager');
			const perms = this._getAndroidLocationPermissions(false);
			for (let i = 0; i < perms.length; i++) {
				if (main.checkSelfPermission(perms[i]) === PackageManager.PERMISSION_GRANTED) {
					return true;
				}
			}
		} catch (err) {
			console.log('[KeepAlive] 读取前台定位权限失败:', err);
		}
		// #endif
		return false;
	}

	_androidNeedsBackgroundLocationPermission() {
		// #ifdef APP-PLUS
		try {
			const Build = plus.android.importClass('android.os.Build');
			return Build.VERSION.SDK_INT >= 29;
		} catch (e) {
			return false;
		}
		// #endif
		return false;
	}

	_androidHasBackgroundLocationGranted() {
		// #ifdef APP-PLUS
		if (!this._androidNeedsBackgroundLocationPermission()) {
			return true;
		}
		try {
			const main = plus.android.runtimeMainActivity();
			const PackageManager = plus.android.importClass('android.content.pm.PackageManager');
			return main.checkSelfPermission('android.permission.ACCESS_BACKGROUND_LOCATION') ===
				PackageManager.PERMISSION_GRANTED;
		} catch (err) {
			console.log('[KeepAlive] 读取后台定位权限失败:', err);
		}
		// #endif
		return false;
	}

	_isAndroidBackgroundLocationRequestGranted(e) {
		return !!(e && Array.isArray(e.granted) &&
			e.granted.indexOf('android.permission.ACCESS_BACKGROUND_LOCATION') >= 0);
	}

	/** 已授予前台定位，但 Android10+ 未授予后台定位（含用户选「仅使用期间允许」） */
	_isAndroidForegroundOnlyLocationState() {
		return this._androidHasForegroundLocationGranted() &&
			this._androidNeedsBackgroundLocationPermission() &&
			!this._androidHasBackgroundLocationGranted();
	}

	_hasAckedBackgroundWhileInUsePrompt() {
		return !!uni.getStorageSync(BG_LOCATION_WHILE_IN_USE_ACK_KEY);
	}

	_markBackgroundWhileInUseAcked() {
		uni.setStorageSync(BG_LOCATION_WHILE_IN_USE_ACK_KEY, true);
	}

	_clearBackgroundWhileInUseAckIfGranted() {
		if (this._androidHasBackgroundLocationGranted()) {
			uni.removeStorageSync(BG_LOCATION_WHILE_IN_USE_ACK_KEY);
		}
	}

	_shouldAutoRequestBackgroundLocation() {
		if (!this._isAndroidForegroundOnlyLocationState()) {
			return true;
		}
		return !this._hasAckedBackgroundWhileInUsePrompt();
	}

	_openAppLocationSettings() {
		// #ifdef APP-PLUS
		if (plus.os.name !== 'Android') {
			uni.openAppAuthorizeSetting({});
			return;
		}
		try {
			const main = plus.android.runtimeMainActivity();
			const Intent = plus.android.importClass('android.content.Intent');
			const Settings = plus.android.importClass('android.provider.Settings');
			const Uri = plus.android.importClass('android.net.Uri');
			const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
			intent.setData(Uri.parse('package:' + main.getPackageName()));
			main.startActivity(intent);
		} catch (e) {
			console.log('[KeepAlive] 打开应用定位设置失败，降级 openAppAuthorizeSetting:', e);
			uni.openAppAuthorizeSetting({});
		}
		// #endif
	}

	/**
	 * 用户已选「仅使用期间允许」：不循环系统权限申请；本次前台周期内提示去设置
	 * @param {boolean} allowOneBackgroundRequest 是否仍尝试一次后台权限申请（用户主动引导时）
	 */
	async _handleAndroidForegroundOnlyLocationState(allowOneBackgroundRequest = false) {
		this._clearBackgroundWhileInUseAckIfGranted();
		if (!this._isAndroidForegroundOnlyLocationState()) {
			return;
		}
		if (allowOneBackgroundRequest && this._shouldAutoRequestBackgroundLocation()) {
			const bgRes = await this._androidRequestBackgroundLocationPermission();
			this._clearBackgroundWhileInUseAckIfGranted();
			if (bgRes.granted) {
				return;
			}
		}
		if (!this._bgWhileInUseGuideShownThisLaunch) {
			await this._showBackgroundLocationWhileInUseModal();
		}
	}

	_showBackgroundLocationWhileInUseModal() {
		if (this._bgWhileInUseModalShowing || this._bgWhileInUseGuideShownThisLaunch) {
			return Promise.resolve(false);
		}
		const isZh = this.getLocale();
		const mfr = (this.whiteListStatus.manufacturer || '').toUpperCase();
		let oemTip = '';
		if (mfr.includes('OPPO') || mfr.includes('REALME') || mfr.includes('ONEPLUS')) {
			oemTip = isZh ?
				'\n\n【OPPO/真我】请在权限页将定位改为「始终允许」。' :
				'\n\n[OPPO/Realme] Set location to "Allow all the time".';
		} else if (mfr.includes('VIVO')) {
			oemTip = isZh ?
				'\n\n【vivo】请选择「始终允许」。' :
				'\n\n[vivo] Choose "Allow all the time".';
		}
		this._bgWhileInUseModalShowing = true;
		return new Promise((resolve) => {
			uni.showModal({
				title: isZh ? '需要「始终允许」定位' : 'Background location required',
				content: (isZh ?
						'检测到您选择了「仅使用期间允许」。后台保活需要「始终允许」（后台定位），否则可能无法稳定运行。\n\n请在应用权限中将定位改为「始终允许」。' :
						'You chose "Allow only while using the app". Keep-alive needs "Allow all the time" (background location).\n\nPlease change location permission to "Allow all the time" for this app.'
					) +
					oemTip,
				confirmText: isZh ? '去设置' : 'Settings',
				cancelText: isZh ? '稍后' : 'Later',
				success: (res) => {
					this._bgWhileInUseModalShowing = false;
					this._bgWhileInUseGuideShownThisLaunch = true;
					if (res.confirm) {
						this._openAppLocationSettings();
					}
					resolve(!!res.confirm);
				},
				fail: () => {
					this._bgWhileInUseModalShowing = false;
					this._bgWhileInUseGuideShownThisLaunch = true;
					resolve(false);
				}
			});
		});
	}

	/**
	 * 定位权限用途说明（phase: foreground | background）
	 */
	getLocationPermissionPurposeBlock(phase = 'foreground') {
		const isZh = this.getLocale();
		const mfr = (this.whiteListStatus.manufacturer || '').toUpperCase();
		let oemTip = '';
		if (mfr.includes('VIVO')) {
			oemTip = isZh ?
				'\n· vivo：请在系统页选择「始终允许」或允许后台定位。' :
				'\n· vivo: Choose Allow all the time or background location in settings.';
		} else if (mfr.includes('OPPO') || mfr.includes('REALME') || mfr.includes('ONEPLUS')) {
			oemTip = isZh ?
				'\n· OPPO/真我：请选择「始终允许」。' :
				'\n· OPPO/Realme: Choose Allow all the time.';
		}
		if (phase === 'background') {
			return isZh ?
				'【后台定位权限说明】\n' +
				'· 权限名称：后台定位 / 始终允许（ACCESS_BACKGROUND_LOCATION）；\n' +
				'· 作用：应用在后台时维持蓝牙连接与健康数据同步，减少被系统清理；\n' +
				'· 说明：不会在后台为业务目的读取、存储或上传您的经纬度坐标。' + oemTip :
				'[Background location]\n' +
				'· Permission: Allow all the time (ACCESS_BACKGROUND_LOCATION);\n' +
				'· Purpose: Keep BLE health device links alive in background;\n' +
				'· We do not collect or upload your GPS coordinates for keep-alive.' + oemTip;
		}
		return isZh ?
			'【定位权限说明】\n' +
			'· 权限名称：定位（精确位置 / 使用时允许）；\n' +
			'· 作用：满足系统对后台服务的合规要求，便于应用在后台保持运行；\n' +
			'· 说明：不会在后台为业务目的读取、存储或上传您的经纬度坐标。' + oemTip :
			'[Location permission]\n' +
			'· Permission: Precise location while using the app;\n' +
			'· Purpose: Meet system requirements so the app can run reliably in background;\n' +
			'· We do not collect or upload your GPS coordinates for keep-alive.' + oemTip;
	}

	/** 系统权限弹窗或设置跳转前的用途说明 */
	showLocationPermissionPurposeModal(phase, onContinue, onCancel) {
		const isZh = this.getLocale();
		const purpose = this.getLocationPermissionPurposeBlock(phase);
		const tail = phase === 'background' ?
			(isZh ?
				'\n\n接下来将申请系统权限「ACCESS_BACKGROUND_LOCATION」（后台定位 / 始终允许），请按提示选择允许。' :
				'\n\nNext the system will request ACCESS_BACKGROUND_LOCATION (Allow all the time).') :
			(isZh ?
				'\n\n接下来将弹出系统定位权限对话框，请选择「使用时允许」或「允许」。' :
				'\n\nNext the system location dialog will appear—please tap Allow or While using the app.');
		return new Promise((resolve) => {
			uni.showModal({
				title: phase === 'background' ?
					(isZh ? '后台定位权限说明' : 'Background location') : (isZh ? '定位权限说明' :
						'Location permission'),
				content: purpose + tail,
				confirmText: isZh ? '继续' : 'Continue',
				cancelText: isZh ? '稍后' : 'Later',
				success: (res) => {
					if (res.confirm) {
						if (typeof onContinue === 'function') {
							onContinue();
						}
						resolve(true);
					} else {
						if (typeof onCancel === 'function') {
							onCancel();
						}
						resolve(false);
					}
				}
			});
		});
	}

	/**
	 * 按厂商返回白名单/后台运行手动开启路径（与 showManualGuideDialog 一致）
	 */
	getWhiteListSetupGuideContent(manufacturer) {
		const isZh = this.getLocale();
		const m = String(manufacturer || this.whiteListStatus.manufacturer || '').toUpperCase();

		if (isZh) {
			if (m.includes('HUAWEI')) {
				return '请手动打开「手机管家」→「应用启动管理」→ 找到本应用 → 关闭「自动管理」→ 开启所有权限';
			}
			if (m.includes('XIAOMI')) {
				return '请手动打开「安全中心」→「授权管理」→「自启动管理」→ 开启本应用';
			}
			if (m.includes('OPPO') || m.includes('REALME') || m.includes('ONEPLUS')) {
				return '「设置」→「电池」→「应用耗电详情」→ 本应用 →\n\n1.「允许完全后台行为」开关打开\n\n2.「允许应用自启动」开关打开\n\n3.「允许应用关联启动」开关打开';
			}
			if (m.includes('VIVO')) {
				return '请手动打开「i管家」→「应用管理」→「自启动管理」→ 开启本应用\n\n然后进入「设置」→「电池」→「后台高耗电」→ 允许本应用';
			}
			if (m.includes('SAMSUNG')) {
				return '请手动打开「智能管理器」→「自动运行应用程序」→ 开启本应用\n\n然后进入「电池」→「不受限制的应用」→ 添加本应用';
			}
			return '请在系统「设置」中找到「电池优化」或「自启动管理」，将本应用加入白名单';
		}

		if (m.includes('HUAWEI')) {
			return 'Open "Phone Manager" → "App launch management" → Find this app → Turn off "Auto management" → Enable all permissions';
		}
		if (m.includes('XIAOMI')) {
			return 'Open "Security Center" → "Authorization management" → "Auto start management" → Enable this app';
		}
		if (m.includes('OPPO') || m.includes('REALME') || m.includes('ONEPLUS')) {
			return '"Settings" → "Battery" → "App power usage details" → This app →\n\n1. Turn on "Allow full background activity"\n\n2. Turn on "Allow auto-start"\n\n3. Turn on "Allow associated startup"';
		}
		if (m.includes('VIVO')) {
			return 'Open "i管家" → "App management" → "Auto start management" → Enable this app\n\nThen open "Settings" → "Battery" → "High background power consumption" → Allow this app';
		}
		if (m.includes('SAMSUNG')) {
			return 'Open "Device Care" → "Auto run apps" → Enable this app\n\nThen open "Battery" → "Unrestricted apps" → Add this app';
		}
		return 'Please find "Battery optimization" or "Auto start management" in system settings, add this app to whitelist';
	}

	getWhiteListPurposeBlock() {
		const isZh = this.getLocale();
		const manufacturer = this.whiteListStatus.manufacturer || '';
		const base = isZh ?
			'【后台运行 / 白名单说明】\n' +
			`· 适用机型：${manufacturer || '当前手机'}；\n` +
			'· 作用：允许应用自启动、后台运行，避免蓝牙设备断开与定时任务被系统杀掉；\n' +
			'· 说明：仅用于健康设备连接与数据同步，不会进行与功能无关的后台行为。' :
			'[Background / whitelist]\n' +
			`· Device: ${manufacturer || 'your phone'};\n` +
			'· Purpose: Auto-start and background run so BLE health links and scheduled tasks are not killed;\n' +
			'· Only used for device connection and health data sync.';
		const setupGuide = this.getWhiteListSetupGuideContent(manufacturer);
		const setupLabel = isZh ? '\n\n【开启方式】\n' : '\n\n[How to enable]\n';
		return base + setupLabel + setupGuide;
	}

	/** 跳转厂商白名单页面前的用途说明 */
	showWhiteListPurposeModalBeforeJump(onContinue, onCancel) {
		const isZh = this.getLocale();
		const tail = isZh ?
			'\n\n接下来将跳转到系统设置页面，请按提示开启自启动、后台运行或耗电管理白名单。' :
			'\n\nYou will be taken to system settings—enable auto-start, background run, or battery whitelist.';
		return new Promise((resolve) => {
			uni.showModal({
				title: isZh ? '后台运行设置说明' : 'Background settings',
				content: this.getWhiteListPurposeBlock() + tail,
				confirmText: isZh ? '继续' : 'Continue',
				cancelText: isZh ? '稍后' : 'Later',
				success: (res) => {
					if (res.confirm) {
						if (typeof onContinue === 'function') {
							onContinue();
						}
						resolve(true);
					} else {
						if (typeof onCancel === 'function') {
							onCancel();
						}
						resolve(false);
					}
				}
			});
		});
	}

	/**
	 * Android 10+：申请 ACCESS_BACKGROUND_LOCATION 前必先弹用途说明，再调系统权限
	 * @param {{ skipPurposeModal?: boolean }} options 仅内部复用时可跳过说明（默认不跳过）
	 */
	_androidRequestBackgroundLocationPermission(options = {}) {
		const mustShowPurposeBeforeRequest = options.skipPurposeModal !== true;
		return new Promise((resolve) => {
			if (!this._androidNeedsBackgroundLocationPermission()) {
				resolve({
					granted: true,
					message: '无需后台定位权限'
				});
				return;
			}
			if (!this._androidHasForegroundLocationGranted()) {
				resolve({
					granted: false,
					message: '请先授予前台定位权限'
				});
				return;
			}
			if (this._androidHasBackgroundLocationGranted()) {
				resolve({
					granted: true,
					message: '后台定位权限已授予'
				});
				return;
			}
			const runSystemRequest = () => {
				setTimeout(() => {
					plus.android.requestPermissions(
						['android.permission.ACCESS_BACKGROUND_LOCATION'],
						(e) => {
							console.log('[KeepAlive] 后台定位 requestPermissions 回调:', e);
							const granted = this._isAndroidBackgroundLocationRequestGranted(
								e);
							if (granted) {
								this._clearBackgroundWhileInUseAckIfGranted();
							} else if (this._androidHasForegroundLocationGranted()) {
								console.log('[KeepAlive] 后台定位未授予（可能为仅使用期间允许），停止重复申请');
								this._markBackgroundWhileInUseAcked();
								setTimeout(() => {
									this._showBackgroundLocationWhileInUseModal();
								}, 400);
							}
							resolve({
								granted: granted,
								message: granted ? '后台定位权限已授予' : '后台定位权限未授予'
							});
						},
						(err) => {
							console.log('[KeepAlive] 后台定位权限请求失败:', err);
							resolve({
								granted: false,
								message: '请求后台定位权限失败'
							});
						}
					);
				}, 350);
			};
			if (mustShowPurposeBeforeRequest) {
				console.log('[KeepAlive] 申请 ACCESS_BACKGROUND_LOCATION 前先展示用途说明');
				this.showLocationPermissionPurposeModal('background', runSystemRequest, () => resolve({
					granted: false,
					message: '用户取消后台定位授权说明'
				}));
			} else {
				runSystemRequest();
			}
		});
	}

	_resolveAndroidLocationPermissionResult(foregroundGranted, backgroundGranted) {
		const needBg = this._androidNeedsBackgroundLocationPermission();
		const granted = foregroundGranted && (!needBg || backgroundGranted);
		this.locationPermissionGranted = granted;
		let message = '定位权限已授予';
		if (!foregroundGranted) {
			message = '定位权限被拒绝';
		} else if (needBg && !backgroundGranted) {
			message = '请授予后台定位权限（始终允许）';
		}
		return {
			granted: granted,
			foregroundGranted: foregroundGranted,
			backgroundGranted: needBg ? backgroundGranted : true,
			message: message
		};
	}

	/**
	 * Android：先申请前台定位，再单独申请 ACCESS_BACKGROUND_LOCATION（API29+）
	 * @param {{ showForegroundPurpose?: boolean }} options 仅控制前台定位说明；后台定位说明始终先弹
	 */
	_androidRequestLocationPermissions(options = {}) {
		const showForegroundPurpose = options.showForegroundPurpose !== false;
		return new Promise((resolve) => {
			const requestBackgroundAfterForeground = (foregroundGranted) => {
				if (!foregroundGranted) {
					const result = this._resolveAndroidLocationPermissionResult(false, false);
					console.log('[KeepAlive] 定位权限请求结果:', result.granted);
					resolve(result);
					return;
				}
				if (!this._androidNeedsBackgroundLocationPermission()) {
					const result = this._resolveAndroidLocationPermissionResult(true, true);
					console.log('[KeepAlive] 定位权限请求结果:', result.granted);
					if (result.granted && this.locationKeepAliveEnabled) {
						this.startLocationKeepAlive({
							silent: true
						}).catch((err) => {
							console.log('[KeepAlive] 自动启动定位保活失败:', err);
						});
					}
					resolve(result);
					return;
				}
				if (this._androidHasBackgroundLocationGranted()) {
					const result = this._resolveAndroidLocationPermissionResult(true, true);
					console.log('[KeepAlive] 定位权限请求结果:', result.granted);
					if (result.granted && this.locationKeepAliveEnabled) {
						this.startLocationKeepAlive({
							silent: true
						}).catch((err) => {
							console.log('[KeepAlive] 自动启动定位保活失败:', err);
						});
					}
					resolve(result);
					return;
				}
				if (!this._shouldAutoRequestBackgroundLocation()) {
					const result = this._resolveAndroidLocationPermissionResult(true, false);
					console.log('[KeepAlive] 已为仅使用期间允许，跳过重复后台定位申请');
					resolve(result);
					return;
				}
				this._androidRequestBackgroundLocationPermission().then((bgRes) => {
					const result = this._resolveAndroidLocationPermissionResult(true, !!bgRes
						.granted);
					console.log('[KeepAlive] 定位权限请求结果(含后台):', result.granted, bgRes);
					if (result.granted && this.locationKeepAliveEnabled) {
						this.startLocationKeepAlive({
							silent: true
						}).catch((err) => {
							console.log('[KeepAlive] 自动启动定位保活失败:', err);
						});
					}
					resolve(result);
				});
			};

			if (this._androidHasForegroundLocationGranted()) {
				requestBackgroundAfterForeground(true);
				return;
			}

			const runForegroundRequest = () => {
				const permissions = this._getAndroidLocationPermissions(false);
				plus.android.requestPermissions(
					permissions,
					(e) => {
						console.log('[KeepAlive] 前台定位 requestPermissions 回调:', e);
						const foregroundGranted = this._isAndroidLocationRequestGranted(e);
						requestBackgroundAfterForeground(foregroundGranted);
					},
					(err) => {
						console.log('[KeepAlive] 前台定位权限请求失败:', err);
						resolve(this._resolveAndroidLocationPermissionResult(false, false));
					}
				);
			};
			if (showForegroundPurpose) {
				this.showLocationPermissionPurposeModal('foreground', runForegroundRequest, () => {
					resolve(this._resolveAndroidLocationPermissionResult(false, false));
				});
			} else {
				runForegroundRequest();
			}
		});
	}

	/** 延后申请定位，避免与通知/白名单弹窗抢系统对话框 */
	_requestAndroidLocationPermissionsDeferred(delayMs = 1500, options = {}) {
		return new Promise((resolve) => {
			setTimeout(() => {
				this._androidRequestLocationPermissions(options).then(resolve);
			}, delayMs);
		});
	}

	/**
	 * 检查定位权限
	 * @returns {Promise} 返回权限状态
	 */
	checkLocationPermission() {
		return new Promise((resolve) => {
			// #ifdef APP-PLUS
			if (plus.os.name === 'Android') {
				const finishCheck = (granted) => {
					this._clearBackgroundWhileInUseAckIfGranted();
					this.locationPermissionGranted = granted;
					// console.log('[KeepAlive] 定位权限检查结果:', granted);
					resolve({
						granted: granted,
						message: granted ? '定位权限已授予' : '定位权限未授予'
					});
				};
				const finishWithState = () => {
					const fg = this._androidHasForegroundLocationGranted();
					const bg = this._androidHasBackgroundLocationGranted();
					const granted = fg && bg;
					finishCheck(granted);
				};
				if (this._androidHasForegroundLocationGranted() &&
					this._androidHasBackgroundLocationGranted()) {
					finishCheck(true);
					return;
				}
				plus.android.checkPermission('android.permission.ACCESS_FINE_LOCATION', (permRes) => {
					const fg = permRes && permRes.checkResult === 0;
					if (!fg) {
						finishCheck(false);
						return;
					}
					if (!this._androidNeedsBackgroundLocationPermission()) {
						finishCheck(true);
						return;
					}
					plus.android.checkPermission(
						'android.permission.ACCESS_BACKGROUND_LOCATION',
						(bgRes) => {
							const bg = bgRes && bgRes.checkResult === 0;
							finishCheck(!!bg);
						},
						() => finishWithState()
					);
				}, () => finishCheck(false));
			} else if (plus.os.name === 'iOS') {
				// iOS 定位权限检查简化处理
				this.locationPermissionGranted = true; // iOS 需要单独处理
				resolve({
					granted: true,
					message: 'iOS定位权限需单独申请'
				});
			} else {
				resolve({
					granted: false,
					message: '非移动设备'
				});
			}
			// #endif
			// #ifndef APP-PLUS
			resolve({
				granted: false,
				message: '仅App端支持'
			});
			// #endif
		});
	}

	/**
	 * 请求定位权限
	 * @returns {Promise} 返回请求结果
	 */
	requestLocationPermission() {
		return new Promise((resolve) => {
			console.log('[KeepAlive] 请求定位权限');

			// #ifdef APP-PLUS
			if (plus.os.name === 'Android') {
				if (this._isAndroidForegroundOnlyLocationState() &&
					!this._shouldAutoRequestBackgroundLocation()) {
					this._handleAndroidForegroundOnlyLocationState(false).then(() => {
						resolve(this._resolveAndroidLocationPermissionResult(true, false));
					});
					return;
				}
				this._androidRequestLocationPermissions({
					showForegroundPurpose: true
				}).then(resolve);
				return;
			} else if (plus.os.name === 'iOS') {
				resolve({
					granted: true,
					message: '请手动在设置中开启定位权限'
				});
			} else {
				resolve({
					granted: false,
					message: '非移动设备'
				});
			}
			// #endif
			// #ifndef APP-PLUS
			resolve({
				granted: false,
				message: '仅App端支持'
			});
			// #endif
		});
	}

	/**
	 * 显示定位权限引导
	 */
	showLocationPermissionGuide() {
		const isZh = this.getLocale();
		const guideKey = 'keepAlive_location_guide_shown';
		const hasShown = uni.getStorageSync(guideKey);

		if (hasShown) {
			console.log('[KeepAlive] 定位权限引导已显示过，跳过');
			return;
		}

		const mfr = (this.whiteListStatus.manufacturer || '').toUpperCase();
		let oemTip = '';
		if (mfr.includes('VIVO')) {
			oemTip = isZh ?
				'\n\n【vivo】设置 → 应用与权限 → 权限 → 定位 → 本应用 → 允许。' :
				'\n\n[vivo] Settings → Apps → Permissions → Location → This app → Allow.';
		} else if (mfr.includes('OPPO') || mfr.includes('REALME') || mfr.includes('ONEPLUS')) {
			oemTip = isZh ?
				'\n\n【OPPO/真我】设置 → 应用 → 本应用 → 权限 → 位置信息 → 允许。' :
				'\n\n[OPPO/Realme] Settings → Apps → This app → Permissions → Location → Allow.';
		}
		const bgTip = isZh ?
			'\n\nAndroid 10 及以上会再申请「后台定位 / 始终允许」，用于后台保活，不会上传您的经纬度。' :
			'\n\nOn Android 10+, background location (Allow all the time) may be requested for keep-alive.';
		const purpose = isZh ?
			'【用途说明】\n' +
			'· 先授予「使用时允许」，再授予「始终允许」（后台定位）；\n' +
			'· 本应用不会在后台为业务目的读取、上传您的经纬度；\n' +
			'· 地图、天气等功能在使用时再获取位置。' + bgTip + oemTip :
			'Grant location while-in-use first, then allow all the time (background) if prompted.' +
			bgTip + oemTip;

		uni.showModal({
			title: isZh ? '需要定位权限' : 'Location Permission Required',
			content: purpose + (isZh ? '\n\n是否允许定位？' : '\n\nAllow location access?'),
			confirmText: isZh ? '去开启' : 'Enable',
			cancelText: isZh ? '稍后' : 'Later',
			success: (res) => {
				uni.setStorageSync(guideKey, true);
				if (res.confirm) {
					this._androidRequestLocationPermissions({
						showForegroundPurpose: false
					}).then((result) => {
						if (result.granted) {
							uni.showToast({
								title: isZh ? '定位权限已开启' : 'Location permission enabled',
								icon: 'success'
							});
						}
					});
				}
			}
		});
	}

	/**
	 * 触发位置相关事件
	 * @param {string} eventName 事件名称
	 * @param {Object} data 事件数据
	 */
	_emitLocationEvent(eventName, data) {
		// 发送给页面监听
		uni.$emit(`location_${eventName}`, {
			...data,
			timestamp: Date.now()
		});

		// 也触发通用事件
		uni.$emit('keepAliveLocationEvent', {
			type: eventName,
			data: data,
			timestamp: Date.now()
		});
	}

	// ==================== 原有方法（保持不变） ====================

	_isNotificationUserResponded() {
		return !!uni.getStorageSync(NOTIFICATION_USER_RESPONDED_KEY);
	}

	/** 标记通知权限相关自动引导已结束 */
	_markNotificationUserResponded() {
		uni.setStorageSync(NOTIFICATION_USER_RESPONDED_KEY, true);
		uni.setStorageSync('keepAlive_notification_guide_shown', true);
	}

	/**
	 * 仅同步系统通知状态，不弹窗
	 */
	_silentRefreshAndroidNotificationState() {
		// #ifdef APP-PLUS
		if (plus.os.name !== 'Android') {
			return;
		}
		const Build = plus.android.importClass('android.os.Build');
		if (Build.VERSION.SDK_INT < 33) {
			this.notificationEnabled = true;
			return;
		}
		try {
			const mainActivity = plus.android.runtimeMainActivity();
			const nm = this._androidGetNotificationManager(mainActivity);
			const enabled = this._androidAreNotificationsEnabled(nm);
			plus.android.checkPermission('android.permission.POST_NOTIFICATIONS', (permRes) => {
				const runtimeGranted = permRes && permRes.checkResult === 0;
				this.notificationEnabled = runtimeGranted && enabled;
			});
		} catch (e) {
			console.log('[KeepAlive] 静默刷新通知状态失败:', e);
		}
		// #endif
	}

	/**
	 * 获取当前语言
	 */
	getLocale() {
		const locale = uni.getLocale();
		return (locale === "zh-Hans" || locale === "zh-Hant");
	}

	/**
	 * 通知权限用途说明
	 */
	getNotificationPermissionPurposeBlock() {
		if (this.getLocale()) {
			return '【用途说明】\n' +
				'· 在通知栏展示前台保活服务状态，便于系统在后台保留本应用与健康设备连接；\n' +
				'· 用于测量数据同步、连接状态或重要提醒类消息（随您实际使用的功能而定）；\n' +
				'· 不会用于与功能无关的广告骚扰。';
		}
		return 'What we use notifications for:\n' +
			'· Foreground keep-alive status so the system can keep the app and health device links in the background;\n' +
			'· Measurement sync, connection status, or important reminders depending on features you use;\n' +
			'· Not used for unrelated promotional spam.';
	}

	/**
	 * Android 13+：在系统「允许通知」对话框前先说明用途
	 */
	showAndroidRuntimeNotificationPurposeModal(onContinue) {
		const isZh = this.getLocale();
		const purpose = this.getNotificationPermissionPurposeBlock();
		const tail = isZh ?
			'\n\n接下来将弹出系统权限对话框，请选择「允许」或「始终允许」。' :
			'\n\nNext, the system will ask for notification permission—please tap Allow (or Always allow).';
		uni.showModal({
			title: isZh ? '通知权限说明' : 'About notification permission',
			content: purpose + tail,
			confirmText: isZh ? '继续' : 'Continue',
			cancelText: isZh ? '稍后' : 'Later',
			success: (res) => {
				if (res.confirm && typeof onContinue === 'function') {
					onContinue();
				} else {
					this._markNotificationUserResponded();
				}
			}
		});
	}

	/**
	 * 初始化保活（入口方法）
	 */
	init() {

		// console.log('[KeepAlive] 初始化保活', keepAlive);

		if (this.isRunning || this._initInProgress) {
			// console.log('[KeepAlive] 已在运行或正在初始化，跳过');
			return;
		}
		this._initInProgress = true;
		// console.log('[KeepAlive] 初始化保活管理器');
		this.ensureAlarmListener();

		keepAlive.init({}, (res) => {
			// console.log('【KeepAlive】 初始化结果:', res);
			this._initInProgress = false;

			if (res.code !== 0) return;

			// 白名单引导暂时关闭
			// this.checkAndGuideWhiteList();
			this.checkAndGuideNotificationPermission();

			// 无声音乐暂时关闭
			// this.startSilentMusic();
			this.startNightModeCheck();
			// 前台服务 + 原生保活链（日间/夜间 API + 业务闹钟）
			this._syncNativeKeepAliveMode();
			if (this.locationKeepAliveEnabled) {
				setTimeout(() => {
					this.ensureLocationRunning({
						interval: this.locationUpdateInterval
					}).then((result) => {
						// console.log('[KeepAlive] 自动恢复定位保活结果:', result);
					}).catch((err) => {
						// console.log('[KeepAlive] 自动恢复定位保活失败:', err);
					});
				}, 5000);
			}
			this.isRunning = true;
		});
	}
	/**
	 * 绑定原生闹钟唤醒（plus.globalEvent + uni.$on，后台/熄屏依赖此回调执行 JS）
	 */
	registerQxBleWakeHandler(fn) {
		this._qxBleWakeHandler = typeof fn === 'function' ? fn : null;
	}

	registerQxBleHeartbeat(fn) {
		this._qxBleHeartbeatFn = typeof fn === 'function' ? fn : null;
	}

	registerQxBleMeasuringCheck(fn) {
		this._qxBleMeasuringFn = typeof fn === 'function' ? fn : null;
	}

	ensureAlarmListener() {
		if (this._alarmListenerBound) return;
		this._alarmListenerBound = true;
		const onAlarm = (data) => {
			const now = Date.now();
			if (now - this._lastAlarmEventAt < 1500) {
				console.log('[KeepAlive] onAlarmTrigger 去重跳过');
				return;
			}
			this._lastAlarmEventAt = now;
			// 闹钟暂时关闭，不链式重挂
			// if (getQxBleKeepAliveAlarmIntervalSecFromStorage() != null) {
			// 	this.scheduleQxBleAlarmFromStorage();
			// }
			this.onWakeUp(data);
		};
		uni.$on('onAlarmTrigger', onAlarm);
		// #ifdef APP-PLUS
		try {
			const ge = typeof plus !== 'undefined' ? plus.globalEvent : null;
			if (ge && typeof ge.addEventListener === 'function') {
				ge.addEventListener('onAlarmTrigger', onAlarm);
			}
		} catch (e) {
			console.warn('[KeepAlive] plus.globalEvent.onAlarmTrigger 注册失败', e);
		}
		// #endif
	}

	// ==================== 通知权限相关 ====================

	/**
	 * 检查并引导通知权限
	 */
	checkAndGuideNotificationPermission() {
		setTimeout(() => {
			this.checkNotificationPermission();
		}, 2000);
	}

	/**
	 * 检查通知权限状态
	 */
	checkNotificationPermission() {
		// #ifdef APP-PLUS
		if (plus.os.name === 'Android') {
			const Build = plus.android.importClass('android.os.Build');
			if (Build.VERSION.SDK_INT >= 33) {
				this.checkAndroidNotificationPermission();
			} else {
				this.notificationEnabled = true;
				// console.log('[KeepAlive] API < 33，无需 POST_NOTIFICATIONS 运行时授权');
			}
		} else if (plus.os.name === 'iOS') {
			this.checkIOSNotificationPermission();
		}
		// #endif
	}

	/**
	 * 获取 NotificationManager
	 */
	_androidGetNotificationManager(activity) {
		// #ifdef APP-PLUS
		return activity.getSystemService('notification');
		// #endif
	}

	/**
	 * 是否允许应用发通知
	 */
	_androidAreNotificationsEnabled(nm) {
		// #ifdef APP-PLUS
		if (!nm) {
			return false;
		}
		try {
			const ret = plus.android.invoke(nm, 'areNotificationsEnabled', []);
			return !!ret;
		} catch (e) {
			try {
				if (typeof nm.areNotificationsEnabled === 'function') {
					return !!nm.areNotificationsEnabled();
				}
			} catch (e2) {}
			console.log('[KeepAlive] areNotificationsEnabled 不可用:', e);
			return true;
		}
		// #endif
	}

	/**
	 * 从系统同步 Android 通知总开关状态
	 */
	_syncAndroidNotificationEnabled() {
		// #ifdef APP-PLUS
		try {
			if (plus.os.name !== 'Android') {
				return;
			}
			const mainActivity = plus.android.runtimeMainActivity();
			const nm = this._androidGetNotificationManager(mainActivity);
			this.notificationEnabled = this._androidAreNotificationsEnabled(nm);
		} catch (e) {
			console.log('[KeepAlive] 同步通知状态失败:', e);
		}
		// #endif
	}

	/**
	 * 检查 Android 通知权限
	 */
	checkAndroidNotificationPermission() {
		// #ifdef APP-PLUS
		const Build = plus.android.importClass('android.os.Build');
		if (Build.VERSION.SDK_INT < 33) {
			this.notificationEnabled = true;
			return;
		}

		try {
			if (this._isNotificationUserResponded()) {
				this._silentRefreshAndroidNotificationState();
				return;
			}

			const mainActivity = plus.android.runtimeMainActivity();
			const notificationManager = this._androidGetNotificationManager(mainActivity);
			const areNotificationsEnabled = this._androidAreNotificationsEnabled(notificationManager);

			this.createNotificationChannel();

			plus.android.checkPermission('android.permission.POST_NOTIFICATIONS', (permRes) => {
				const runtimeGranted = permRes && permRes.checkResult === 0;
				this.notificationEnabled = runtimeGranted && areNotificationsEnabled;
				console.log('[KeepAlive] POST_NOTIFICATIONS:', runtimeGranted,
					'areNotificationsEnabled:', areNotificationsEnabled);

				if (!runtimeGranted) {
					this.showAndroidRuntimeNotificationPurposeModal(() => {
						plus.android.requestPermissions(
							['android.permission.POST_NOTIFICATIONS'],
							(e) => {
								console.log('[KeepAlive] requestPermissions:', e);
								if (e.granted && e.granted.length > 0) {
									this.createNotificationChannel();
									this._syncAndroidNotificationEnabled();
									if (!this.notificationEnabled) {
										this.notificationEnabled = true;
									}
									console.log('[KeepAlive] POST_NOTIFICATIONS 已授予，不跳转设置');
									this._markNotificationUserResponded();
									return;
								}
								this._syncAndroidNotificationEnabled();
								this._markNotificationUserResponded();
							},
							(err) => {
								console.log('[KeepAlive] requestPermissions 错误:', err);
								this._markNotificationUserResponded();
							}
						);
					});
					return;
				}

				if (!areNotificationsEnabled) {
					if (!this._isNotificationUserResponded()) {
						this.showNotificationPermissionGuide();
					}
				} else {
					console.log('[KeepAlive] 通知权限已开启');
					this._markNotificationUserResponded();
				}
			});
		} catch (e) {
			console.log('[KeepAlive] 检查通知权限失败:', e);
		}
		// #endif
	}

	/**
	 * 检查 iOS 通知权限
	 */
	checkIOSNotificationPermission() {
		// #ifdef APP-PLUS
		const UIApplication = plus.ios.importClass('UIApplication');
		const app = UIApplication.sharedApplication();
		const currentSettings = app.currentUserNotificationSettings();
		const types = currentSettings.types();

		const isEnabled = types !== 0;
		this.notificationEnabled = isEnabled;
		console.log('[KeepAlive] iOS通知权限状态:', isEnabled);

		if (this._isNotificationUserResponded()) {
			return;
		}

		if (!isEnabled) {
			this.showNotificationPermissionGuide();
		} else {
			console.log('[KeepAlive] iOS通知权限已开启，无需重复引导');
			this._markNotificationUserResponded();
		}
		// #endif
	}

	/**
	 * 显示通知权限引导
	 */
	showNotificationPermissionGuide() {
		if (this._isNotificationUserResponded()) {
			console.log('[KeepAlive] 用户已处理过通知权限，不再弹窗');
			return;
		}
		const storageKey = 'keepAlive_notification_guide_shown'
		const hasShownGuide = uni.getStorageSync(storageKey);
		if (hasShownGuide) {
			console.log('[KeepAlive] 通知权限引导已显示过，跳过');
			return;
		}

		const isZh = this.getLocale();

		let title = '';
		let content = '';

		const purpose = this.getNotificationPermissionPurposeBlock();

		if (isZh) {
			title = '需要通知权限';
			content = purpose + '\n\n开启后，可在后台更稳定地运行并接收与设备、数据相关的必要提醒。\n\n是否现在去开启？';
		} else {
			title = 'Notification Permission Required';
			content = purpose +
				'\n\nAfter enabling, the app can run more reliably in the background and show necessary device/data alerts.\n\nGo to settings now?';
		}

		uni.showModal({
			title: title,
			content: content,
			confirmText: isZh ? '去开启' : 'Go Setting',
			cancelText: isZh ? '稍后' : 'Later',
			success: (res) => {
				if (res.confirm) {
					this.requestNotificationPermission();
				} else {
					this._markNotificationUserResponded();
				}
			}
		});
	}

	/**
	 * 主动请求通知权限
	 */
	requestNotificationPermission() {
		if (this.notificationEnabled) {
			console.log('[KeepAlive] 通知权限已存在，无需重复请求');
			const isZh = this.getLocale();
			uni.showToast({
				title: isZh ? '通知权限已开启' : 'Notification permission already enabled',
				icon: 'success'
			});
			return;
		}

		const isZh = this.getLocale();
		console.log('[KeepAlive] 主动请求通知权限');

		// #ifdef APP-PLUS
		if (plus.os.name === 'Android') {
			this.requestAndroidNotificationPermission();
		} else if (plus.os.name === 'iOS') {
			this.requestIOSNotificationPermission();
		}
		// #endif
	}

	/**
	 * 请求 Android 通知权限
	 */
	requestAndroidNotificationPermission() {
		// #ifdef APP-PLUS
		const isZh = this.getLocale();

		if (this._isNotificationUserResponded()) {
			this._silentRefreshAndroidNotificationState();
			return;
		}

		if (this.notificationEnabled) {
			uni.showToast({
				title: isZh ? '通知权限已开启' : 'Notification permission already enabled',
				icon: 'success'
			});
			return;
		}

		try {
			const mainActivity = plus.android.runtimeMainActivity();
			const Build = plus.android.importClass('android.os.Build');

			if (Build.VERSION.SDK_INT >= 33) {
				this.createNotificationChannel();
				const notificationManager = this._androidGetNotificationManager(mainActivity);
				const areNotificationsEnabled = this._androidAreNotificationsEnabled(notificationManager);

				plus.android.checkPermission('android.permission.POST_NOTIFICATIONS', (permRes) => {
					const runtimeGranted = permRes && permRes.checkResult === 0;

					if (!runtimeGranted) {
						plus.android.requestPermissions(
							['android.permission.POST_NOTIFICATIONS'],
							(e) => {
								if (e.granted && e.granted.length > 0) {
									this.createNotificationChannel();
									this._syncAndroidNotificationEnabled();
									if (!this.notificationEnabled) {
										this.notificationEnabled = true;
									}
									uni.showToast({
										title: isZh ? '通知权限已开启' :
											'Notification permission enabled',
										icon: 'success'
									});
									this._markNotificationUserResponded();
									return;
								}
								this._syncAndroidNotificationEnabled();
								this._markNotificationUserResponded();
							},
							() => {
								this._markNotificationUserResponded();
							}
						);
						return;
					}

					if (!areNotificationsEnabled) {
						if (!this._isNotificationUserResponded()) {
							this.goToNotificationSettings();
							this._markNotificationUserResponded();
						}
					} else {
						this.notificationEnabled = true;
						uni.showToast({
							title: isZh ? '通知权限已开启' : 'Notification permission already enabled',
							icon: 'success'
						});
						this._markNotificationUserResponded();
					}
				});
			} else {
				this.createNotificationChannel();
				uni.showToast({
					title: isZh ? '通知权限已配置' : 'Notification configured',
					icon: 'success'
				});
				this.notificationEnabled = true;
				this._markNotificationUserResponded();
			}
		} catch (e) {
			console.log('[KeepAlive] 请求通知权限失败:', e);
			this._markNotificationUserResponded();
		}
		// #endif
	}

	/**
	 * 创建通知渠道
	 */
	createNotificationChannel() {
		// #ifdef APP-PLUS
		try {
			const mainActivity = plus.android.runtimeMainActivity();
			const NotificationManager = plus.android.importClass('android.app.NotificationManager');
			const NotificationChannel = plus.android.importClass('android.app.NotificationChannel');

			if (NotificationManager && NotificationChannel) {
				const channelId = 'KeepAliveChannel';
				const channelName = '保活服务';
				const importance = NotificationManager.IMPORTANCE_LOW;

				const channel = new NotificationChannel(channelId, channelName, importance);
				channel.setDescription('用于显示应用保活状态');
				channel.setSound(null, null);
				channel.enableLights(false);
				channel.enableVibration(false);

				const notificationManager = mainActivity.getSystemService('notification');
				notificationManager.createNotificationChannel(channel);
				console.log('[KeepAlive] 通知渠道已创建');
			}
		} catch (e) {
			console.log('[KeepAlive] 创建通知渠道失败:', e);
		}
		// #endif
	}

	/**
	 * 请求 iOS 通知权限
	 */
	requestIOSNotificationPermission() {
		// #ifdef APP-PLUS
		const isZh = this.getLocale();

		if (this._isNotificationUserResponded()) {
			return;
		}

		if (this.notificationEnabled) {
			uni.showToast({
				title: isZh ? '通知权限已开启' : 'Notification permission already enabled',
				icon: 'success'
			});
			return;
		}

		try {
			const UIApplication = plus.ios.importClass('UIApplication');
			const UNUserNotificationCenter = plus.ios.importClass('UNUserNotificationCenter');

			const center = UNUserNotificationCenter.currentNotificationCenter();
			const authorizationOptions = plus.ios.NSUInteger(1 | 2 | 4);

			center.requestAuthorizationWithOptionsCompletionHandler(authorizationOptions, (granted, error) => {
				if (granted) {
					console.log('[KeepAlive] iOS通知权限已授予');
					this.notificationEnabled = true;
					uni.showToast({
						title: isZh ? '通知权限已开启' : 'Notification permission enabled',
						icon: 'success'
					});
					this._markNotificationUserResponded();
					UIApplication.sharedApplication().registerForRemoteNotifications();
				} else {
					console.log('[KeepAlive] iOS通知权限被拒绝');
					this.notificationEnabled = false;
					this._markNotificationUserResponded();
				}
			});
		} catch (e) {
			console.log('[KeepAlive] 请求iOS通知权限失败:', e);
			this._markNotificationUserResponded();
		}
		// #endif
	}

	/**
	 * 跳转到通知设置页面
	 */
	goToNotificationSettings() {
		const isZh = this.getLocale();

		// #ifdef APP-PLUS
		if (plus.os.name === 'Android') {
			try {
				const mainActivity = plus.android.runtimeMainActivity();
				const intent = plus.android.importClass('android.content.Intent');
				const Settings = plus.android.importClass('android.provider.Settings');

				const intentObj = new intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
				intentObj.putExtra(Settings.EXTRA_APP_PACKAGE, mainActivity.getPackageName());
				mainActivity.startActivity(intentObj);

				uni.showToast({
					title: isZh ? '请开启通知权限' : 'Please enable notification permission',
					icon: 'none'
				});
			} catch (e) {
				console.log('[KeepAlive] 跳转通知设置失败:', e);
				this.showNotificationManualGuide();
			}
		} else if (plus.os.name === 'iOS') {
			try {
				const UIApplication = plus.ios.importClass('UIApplication');
				const app = UIApplication.sharedApplication();
				const url = plus.ios.importClass('NSURL').URLWithString('app-settings:');
				app.openURL(url);
			} catch (e) {
				console.log('[KeepAlive] iOS跳转设置失败:', e);
				this.showNotificationManualGuide();
			}
		}
		// #endif
	}

	/**
	 * 显示通知权限手动指引
	 */
	showNotificationManualGuide() {
		const storageKey = 'keepAlive_notification_manual_guide_shown';
		const hasShownGuide = uni.getStorageSync(storageKey);
		if (hasShownGuide) {
			console.log('[KeepAlive] 通知权限手动指引已显示过，跳过');
			return;
		}

		const isZh = this.getLocale();
		const guideContent = isZh ?
			'请手动打开系统「设置」→「通知管理」或「应用通知」→ 找到本应用 → 开启「允许通知」' :
			'Please manually open System "Settings" → "Notifications" → Find this app → Enable "Allow Notifications"';

		uni.showModal({
			title: isZh ? '手动开启通知' : 'Enable Notifications Manually',
			content: guideContent,
			confirmText: isZh ? '复制指引' : 'Copy Guide',
			cancelText: isZh ? '关闭' : 'Close',
			success: (res) => {
				if (res.confirm) {
					uni.setClipboardData({
						data: guideContent,
						success: () => {
							uni.showToast({
								title: isZh ? '指引已复制' : 'Guide copied',
								icon: 'success'
							});
						}
					});
				}
				uni.setStorageSync(storageKey, true);
			}
		});
	}

	/**
	 * 发送测试通知
	 */
	sendTestNotification() {
		const isZh = this.getLocale();

		if (!this.notificationEnabled) {
			console.log('[KeepAlive] 通知权限未开启，无法发送测试通知');

			const guideShownKey = 'keepAlive_notification_test_guide_shown';
			const hasShownGuide = uni.getStorageSync(guideShownKey);

			if (!hasShownGuide) {
				const purpose = this.getNotificationPermissionPurposeBlock();
				const tail = isZh ? '\n\n请先开启通知权限，才能收到测试通知。' :
					'\n\nPlease enable notification permission first to receive test notifications.';
				uni.showModal({
					title: isZh ? '通知权限未开启' : 'Notification Permission Disabled',
					content: purpose + tail,
					confirmText: isZh ? '去开启' : 'Enable',
					cancelText: isZh ? '取消' : 'Cancel',
					success: (res) => {
						if (res.confirm) {
							this.requestNotificationPermission();
						}
						uni.setStorageSync(guideShownKey, true);
					}
				});
			} else {
				console.log('[KeepAlive] 通知权限未开启，测试通知已跳过');
			}
			return;
		}

		// #ifdef APP-PLUS
		try {
			plus.push.createMessage(
				isZh ? '保活服务运行正常' : 'Keep-alive service is running normally',
				'TEST_NOTIFICATION', {
					title: isZh ? '保活测试' : 'Keep-Alive Test',
					sound: '',
					cover: false
				}
			);

			console.log('[KeepAlive] 测试通知已发送');
			uni.showToast({
				title: isZh ? '已发送测试通知' : 'Test notification sent',
				icon: 'success',
				duration: 1500
			});
		} catch (e) {
			console.log('[KeepAlive] 发送测试通知失败:', e);
			uni.showToast({
				title: isZh ? '发送失败' : 'Send failed',
				icon: 'none'
			});
		}
		// #endif
	}

	/**
	 * 重新检查通知权限
	 */
	recheckNotificationPermission() {
		this.checkNotificationPermission();
		console.log('[KeepAlive] 重新检查通知权限结果:', this.notificationEnabled);
		return this.notificationEnabled;
	}

	/**
	 * 获取通知权限状态
	 */
	getNotificationStatus() {
		return this.notificationEnabled;
	}

	/**
	 * 请求发送通知权限的快捷方法
	 */
	ensureNotificationPermission() {
		if (this.notificationEnabled) {
			console.log('[KeepAlive] 通知权限已具备');
			return Promise.resolve(true);
		}

		if (this._isNotificationUserResponded()) {
			this.recheckNotificationPermission();
			return Promise.resolve(this.notificationEnabled);
		}

		console.log('[KeepAlive] 需要获取通知权限');

		return new Promise((resolve) => {
			const isZh = this.getLocale();

			const guideKey = 'keepAlive_notification_ensure_guide_shown';
			const hasShown = uni.getStorageSync(guideKey);

			if (!hasShown) {
				const purpose = this.getNotificationPermissionPurposeBlock();
				const tail = isZh ? '\n\n请授予通知权限后再试。' :
					'\n\nPlease grant notification permission and try again.';
				uni.showModal({
					title: isZh ? '需要通知权限' : 'Notification Permission Required',
					content: purpose + tail,
					confirmText: isZh ? '去开启' : 'Enable',
					cancelText: isZh ? '取消' : 'Cancel',
					success: (res) => {
						uni.setStorageSync(guideKey, true);
						if (res.confirm) {
							this.requestNotificationPermission();
							setTimeout(() => {
								this.recheckNotificationPermission();
								resolve(this.notificationEnabled);
							}, 500);
						} else {
							this._markNotificationUserResponded();
							resolve(false);
						}
					}
				});
			} else {
				resolve(false);
			}
		});
	}

	// ==================== 白名单相关 ====================

	/**
	 * 跳转系统白名单页面前暂停前台服务
	 */
	suspendForegroundForWhitelistJump(done) {
		const finish = typeof done === 'function' ? done : () => {};
		if (!this.isRunning) {
			finish();
			return;
		}
		// #ifdef APP-PLUS
		if (plus.os.name === 'Android') {
			this._suspendedForWhitelistUi = true;
			this.stopSilentMusic();
			keepAlive.stopForegroundService((res) => {
				console.log('[KeepAlive] 跳转白名单设置前暂停前台保活:', res);
				finish();
			});
			return;
		}
		// #endif
		finish();
	}

	/**
	 * 从系统设置返回 App 后恢复前台服务
	 */
	resumeForegroundIfSuspended() {
		if (!this._suspendedForWhitelistUi) {
			return;
		}
		this._suspendedForWhitelistUi = false;
		if (!this.isRunning) {
			return;
		}
		// #ifdef APP-PLUS
		if (plus.os.name === 'Android') {
			this._syncNativeKeepAliveMode();
			// 无声音乐暂时关闭
			// this.startSilentMusic();
			console.log('[KeepAlive] 已从白名单设置返回，恢复前台保活');
		}
		// #endif
	}

	/**
	 * 检查并引导白名单设置（暂时关闭，不弹窗、不跳转）
	 */
	checkAndGuideWhiteList() {
		return;
		// this.refreshWhiteListStatus();
	}

	/**
	 * 刷新白名单状态
	 */
	refreshWhiteListStatus() {
		keepAlive.checkWhiteListStatus((res) => {
			// console.log('[KeepAlive] 白名单状态:', res);
			if (res.code === 0) {
				this.whiteListStatus = {
					isInWhiteList: res.isInWhiteList,
					isIgnoringBattery: res.isIgnoringBatteryOptimizations,
					manufacturer: res.manufacturer,
					model: res.model
				};
				this.checkNeedGuide();
			}
		});
	}

	/**
	 * 检查是否需要引导用户设置白名单
	 */
	/**
	 * 华为/荣耀 isAppProtected 反射常失败；电池优化已开时不反复弹白名单引导
	 */
	_needsWhiteListGuide() {
		const s = this.whiteListStatus;
		if (!s.isIgnoringBattery) {
			return true;
		}
		const mfr = String(s.manufacturer || '').toUpperCase();
		if (mfr.includes('HUAWEI') || mfr.includes('HONOR')) {
			return false;
		}
		return !s.isInWhiteList;
	}

	checkNeedGuide() {
		return;
		// if (!this._needsWhiteListGuide()) {
		// 	return;
		// }
		// setTimeout(() => {
		// 	this.showWhiteListGuideDialog();
		// }, 3000);
	}

	/**
	 * 显示白名单引导对话框
	 */
	showWhiteListGuideDialog() {
		const storageKey = 'keepAlive_whiteList_guide_shown'
		const hasShownGuide = uni.getStorageSync(storageKey);
		if (hasShownGuide) {
			// console.log('[KeepAlive] 白名单引导已显示过，跳过');
			return;
		}

		const isZh = this.getLocale();
		const manufacturer = this.whiteListStatus.manufacturer;

		let title = '';
		let content = '';

		if (isZh) {
			title = `【${manufacturer}】保活设置`;
			content = this.getWhiteListPurposeBlock() +
				'\n\n是否现在前往系统设置？';
		} else {
			title = `【${manufacturer}】Keep-Alive Setup`;
			content = this.getWhiteListPurposeBlock() +
				'\n\nGo to system settings now?';
		}

		uni.showModal({
			title: title,
			content: content,
			confirmText: isZh ? '去设置' : 'Go Setting',
			cancelText: isZh ? '稍后' : 'Later',
			success: (res) => {
				if (res.confirm) {
					this.goToManufacturerWhiteList(true);
				}
				uni.setStorageSync(storageKey, true);
			}
		});
	}

	/**
	 * 直接跳转到厂商白名单设置页面
	 * @param {boolean} skipPurposeModal 为 true 时跳过跳转前说明（引导弹窗已说明过）
	 */
	goToManufacturerWhiteList(skipPurposeModal = false) {
		const manufacturer = this.whiteListStatus.manufacturer;
		console.log('[KeepAlive] 跳转白名单设置，厂商:', manufacturer);

		const doJump = () => {
			this.suspendForegroundForWhitelistJump(() => {
				keepAlive.goToWhiteListSetting({
					useActivityForResult: true
				}, (res) => {
					console.log('[KeepAlive] 原生跳转结果:', res);
					if (res.code !== 0) {
						this.goToWhiteListBackup();
					}
				});
			});
		};

		if (skipPurposeModal) {
			doJump();
			return;
		}
		this.showWhiteListPurposeModalBeforeJump(doJump);
	}

	/**
	 * 备用跳转方案
	 */
	goToWhiteListBackup() {
		const isZh = this.getLocale();
		const manufacturer = this.whiteListStatus.manufacturer;

		let settingUrl = '';

		if (manufacturer.includes('HUAWEI')) {
			settingUrl = 'huawei://com.huawei.systemmanager?target=appstartup';
		} else if (manufacturer.includes('XIAOMI')) {
			settingUrl = 'miui://com.miui.securitycenter?target=autostart';
		} else if (manufacturer.includes('OPPO') || manufacturer.includes('REALME')) {
			settingUrl = 'oppo://com.coloros.safecenter?target=startup';
		} else if (manufacturer.includes('VIVO')) {
			settingUrl = 'vivo://com.vivo.permissionmanager?target=autostart';
		} else if (manufacturer.includes('SAMSUNG')) {
			settingUrl = 'samsung://com.samsung.android.sm?target=autorun';
		}

		const openBackupUrl = () => {
			if (!settingUrl) {
				this.showManualGuideDialog();
				return;
			}
			this.suspendForegroundForWhitelistJump(() => {
				plus.runtime.openURL(settingUrl, (e) => {
					console.log('[KeepAlive] 备用跳转失败:', e);
					this.showManualGuideDialog();
				});
			});
		};
		this.showWhiteListPurposeModalBeforeJump(openBackupUrl);
	}

	/**
	 * 显示手动设置指引对话框
	 */
	showManualGuideDialog() {
		const isZh = this.getLocale();
		const manufacturer = this.whiteListStatus.manufacturer;
		const guideContent = this.getWhiteListSetupGuideContent(manufacturer);

		uni.showModal({
			title: isZh ? '手动设置指引' : 'Manual Setup Guide',
			content: guideContent,
			confirmText: isZh ? '复制指引' : 'Copy Guide',
			cancelText: isZh ? '关闭' : 'Close',
			success: (res) => {
				if (res.confirm) {
					uni.setClipboardData({
						data: guideContent,
						success: () => {
							uni.showToast({
								title: isZh ? '指引已复制' : 'Guide copied',
								icon: 'success'
							});
						}
					});
				}
			}
		});
	}

	/**
	 * 显示白名单状态（调试用）
	 */
	showWhiteListStatus() {
		const res = this.whiteListStatus;
		const isZh = this.getLocale();
		const statusMsg = isZh ?
			`厂商: ${res.manufacturer}
型号: ${res.model}
白名单状态: ${res.isInWhiteList ? '已加入 ✅' : '未加入 ❌'}
电池优化: ${res.isIgnoringBattery ? '已忽略 ✅' : '未忽略 ❌'}
通知权限: ${this.notificationEnabled ? '已开启 ✅' : '未开启 ❌'}
定位保活渠道: ${this.locationKeepAliveEnabled ? '已启用 ✅' : '未启用 ❌'}` :
			`Manufacturer: ${res.manufacturer}
Model: ${res.model}
Whitelist Status: ${res.isInWhiteList ? 'Added ✅' : 'Not Added ❌'}
Battery Optimization: ${res.isIgnoringBattery ? 'Ignored ✅' : 'Not Ignored ❌'}
Notification Permission: ${this.notificationEnabled ? 'Enabled ✅' : 'Disabled ❌'}
Keep-alive channel: ${this.locationKeepAliveEnabled ? 'Enabled ✅' : 'Disabled ❌'}`;

		uni.showModal({
			title: isZh ? '保活状态' : 'Keep-Alive Status',
			content: statusMsg,
			confirmText: isZh ? '去设置' : 'Go Setting',
			cancelText: isZh ? '关闭' : 'Close',
			success: (modalRes) => {
				if (modalRes.confirm) {
					this.goToManufacturerWhiteList();
				}
			}
		});
	}

	/**
	 * 检查白名单状态（主动调用）
	 */
	checkWhiteListStatus(callback) {
		keepAlive.checkWhiteListStatus((res) => {
			if (res.code === 0) {
				this.whiteListStatus = {
					isInWhiteList: res.isInWhiteList,
					isIgnoringBattery: res.isIgnoringBatteryOptimizations,
					manufacturer: res.manufacturer,
					model: res.model
				};
			}
			if (callback) {
				callback(res);
			}
		});
	}

	/**
	 * 获取白名单状态
	 */
	getWhiteListStatus() {
		return {
			...this.whiteListStatus
		};
	}

	/**
	 * 获取厂商信息
	 */
	getManufacturerInfo(callback) {
		keepAlive.getManufacturerInfo((res) => {
			console.log('[KeepAlive] 厂商信息:', res);
			if (callback) {
				callback(res);
			}
		});
	}

	/**
	 * 请求忽略电池优化
	 */
	requestIgnoreBatteryOptimization() {
		keepAlive.requestIgnoreBatteryOptimizationsWithDialog((res) => {
			console.log('[KeepAlive] 请求忽略电池优化:', res);
			const isZh = this.getLocale();
			if (res.code === 0) {
				uni.showToast({
					title: isZh ? '请在弹窗中选择"允许"' : 'Please select "Allow" in the popup',
					icon: 'none',
					duration: 3000
				});
			}
		});
	}

	/**
	 * 重置所有引导提示
	 */
	resetAllGuides() {
		uni.removeStorageSync('keepAlive_whiteList_guide_shown');
		uni.removeStorageSync('keepAlive_whiteList_guide_en_shown');
		uni.removeStorageSync('keepAlive_notification_guide_shown');
		uni.removeStorageSync('keepAlive_notification_guide_en_shown');
		uni.removeStorageSync('keepAlive_notification_manual_guide_shown');
		uni.removeStorageSync('keepAlive_notification_test_guide_shown');
		uni.removeStorageSync('keepAlive_notification_ensure_guide_shown');
		uni.removeStorageSync(NOTIFICATION_USER_RESPONDED_KEY);
		// ========== 新增：重置定位引导 ==========
		uni.removeStorageSync('keepAlive_location_guide_shown');
		// ====================================
		console.log('[KeepAlive] 所有引导提示已重置');
	}

	/**
	 * 重置白名单引导提示
	 */
	resetWhiteListGuide() {
		uni.removeStorageSync('keepAlive_whiteList_guide_shown');
		uni.removeStorageSync('keepAlive_whiteList_guide_en_shown');
		console.log('[KeepAlive] 白名单引导提示已重置');
	}

	/**
	 * 重置通知权限引导提示
	 */
	resetNotificationGuide() {
		uni.removeStorageSync('keepAlive_notification_guide_shown');
		uni.removeStorageSync('keepAlive_notification_guide_en_shown');
		uni.removeStorageSync('keepAlive_notification_manual_guide_shown');
		uni.removeStorageSync('keepAlive_notification_test_guide_shown');
		uni.removeStorageSync('keepAlive_notification_ensure_guide_shown');
		uni.removeStorageSync(NOTIFICATION_USER_RESPONDED_KEY);
		console.log('[KeepAlive] 通知权限引导提示已重置');
	}

	/**
	 * 重置定位引导提示
	 */
	resetLocationGuide() {
		uni.removeStorageSync('keepAlive_location_guide_shown');
		console.log('[KeepAlive] 定位权限引导提示已重置');
	}

	// ==================== 原有保活方法 ====================

	/**
	 * 启动前台服务（按时段走 startNightKeepAlive / startKeepAlive）
	 */
	startService() {
		this._syncNativeKeepAliveMode();
	}

	/**
	 * 启动无声音乐保活（暂时关闭）
	 */
	startSilentMusic() {
		return;
		// if (!this.silentMusicEnabled) {
		// 	console.log('[KeepAlive] 无声音乐保活未启用');
		// 	return;
		// }
		// keepAlive.startSilentMusic({
		// 	silent: true
		// }, (res) => {
		// 	// console.log('[KeepAlive] 无声音乐启动结果:', res);
		// });
	}

	/**
	 * 停止无声音乐保活
	 */
	stopSilentMusic() {
		if (!this.silentMusicEnabled) return;
		keepAlive.stopSilentMusic((res) => {
			console.log('[KeepAlive] 无声音乐停止结果:', res);
		});
	}

	/**
	 * 设置静音模式
	 */
	setSilentMode(silent) {
		keepAlive.setSilentMusicMode({
			silent: silent
		}, (res) => {
			console.log('[KeepAlive] 静音模式设置:', res);
		});
	}

	/**
	 * 设置定时唤醒闹钟（暂时关闭）
	 */
	setAlarmTimer() {
		return;
		// if (this._nativeNightKeepAliveActive) {
		// 	return;
		// }
		// this._queryIsNightHour((isNight) => {
		// 	const interval = resolveKeepAliveAlarmIntervalSec(isNight);
		// 	keepAlive.setAlarmTimer({
		// 		interval: interval,
		// 		exact: true,
		// 		nightMode: isNight
		// 	}, (res) => {
		// 		this.nightMode = isNight;
		// 		this.alarmInterval = interval;
		// 	});
		// });
	}

	/**
	 * 情绪定时：原生单次闹钟，每次 onAlarmTrigger 后须重挂；间隔 min(15秒, 距下一槽位秒数)
	 * @param {number} [nextAtMs] 下一对齐槽位时间戳（毫秒）
	 */
	/**
	 * 情绪定时：原生单次闹钟（暂时关闭）
	 * @param {number} [nextAtMs] 下一对齐槽位时间戳（毫秒）
	 */
	setAlarmForQxNextSlot(nextAtMs) {
		return;
		// const isNight = this._isNightHour();
		// const qxSec = getQxBleKeepAliveAlarmIntervalSecFromStorage();
		// if (qxSec == null) {
		// 	this.setAlarmTimer();
		// 	return;
		// }
		// let intervalSec = qxSec;
		// let nextAt = Number(nextAtMs);
		// if (!Number.isFinite(nextAt) || nextAt <= 0) {
		// 	nextAt = Number(uni.getStorageSync('qx_ble_next_fire_at'));
		// }
		// if (Number.isFinite(nextAt) && nextAt > 0) {
		// 	const secUntil = Math.ceil((nextAt - Date.now()) / 1000);
		// 	if (secUntil <= 0) {
		// 		intervalSec = 1;
		// 	} else if (secUntil <= 45) {
		// 		intervalSec = Math.max(1, Math.min(5, secUntil));
		// 	} else if (secUntil < qxSec) {
		// 		intervalSec = Math.max(1, secUntil);
		// 	}
		// }
		// keepAlive.setAlarmTimer({
		// 	interval: intervalSec,
		// 	exact: true,
		// 	nightMode: isNight
		// }, (res) => {
		// 	this.nightMode = isNight;
		// 	this.alarmInterval = intervalSec;
		// });
	}

	/** 读取本地下一槽位并设置精确闹钟（暂时关闭） */
	scheduleQxBleAlarmFromStorage() {
		return;
		// if (getQxBleKeepAliveAlarmIntervalSecFromStorage() == null) {
		// 	this.setAlarmTimer();
		// 	return;
		// }
		// const nextAt = Number(uni.getStorageSync('qx_ble_next_fire_at'));
		// const now = Date.now();
		// const apply = () => {
		// 	this._qxAlarmLastSetAt = Date.now();
		// 	this.setAlarmForQxNextSlot(nextAt);
		// };
		// if (!this._qxAlarmLastSetAt || now - this._qxAlarmLastSetAt > 2000) {
		// 	if (this._qxAlarmDebounceTimer) {
		// 		clearTimeout(this._qxAlarmDebounceTimer);
		// 		this._qxAlarmDebounceTimer = null;
		// 	}
		// 	apply();
		// 	return;
		// }
		// if (this._qxAlarmDebounceTimer) {
		// 	clearTimeout(this._qxAlarmDebounceTimer);
		// }
		// this._qxAlarmDebounceTimer = setTimeout(() => {
		// 	this._qxAlarmDebounceTimer = null;
		// 	apply();
		// }, 300);
	}

	/**
	 * 设置JobScheduler
	 */
	setJobScheduler() {
		keepAlive.setJobScheduler({}, (res) => {
			console.log('[KeepAlive] JobScheduler:', res);
		});
	}

	/**
	 * 检查电池优化
	 */
	checkBatteryOptimization() {
		keepAlive.isIgnoringBatteryOptimizations((res) => {
			console.log('[KeepAlive] 电池优化状态:', res);
			if (!res.data) {
				this.requestIgnoreBatteryOptimization();
			}
		});
	}

	/**
	 * 启动夜间模式检测
	 */
	startNightModeCheck() {
		this.checkNightModeTransition();
		this.checkTimer = setInterval(() => {
			this.checkNightModeTransition();
		}, 5 * 60 * 1000);
	}

	/**
	 * 检查夜间模式切换
	 */
	checkNightModeTransition() {
		const isNight = this._isNightHour();
		if (isNight === this.nightMode) {
			return;
		}
		console.log('[KeepAlive] 切换模式:', isNight ? '夜间' : '白天');
		this.nightMode = isNight;
		if (this.isRunning) {
			if (this._isQxBleMeasuringForNotification()) {
				this.updateNotification();
				return;
			}
			this._syncNativeKeepAliveMode(() => {
				this.updateNotification();
			});
			return;
		}
		this.updateNotification();
	}

	/**
	 * 更新通知内容
	 */
	updateNotification() {
		const payload = this._buildKeepAliveNotificationPayload(true);
		if (payload.useNightNative || this._nativeNightKeepAliveActive) {
			keepAlive.startNightKeepAlive(
				this._buildNightKeepAliveNativeOptions(payload),
				(res) => {
					if (res && res.code === 0) {
						this._nativeNightKeepAliveActive = true;
					}
					this._applyAlarmIntervalFromNativeRes(res, payload.alarmInterval);
				}
			);
			return;
		}
		keepAlive.startKeepAlive({
			title: payload.title,
			content: payload.content,
			icon: payload.icon,
			alarmInterval: payload.alarmInterval,
			enableJob: false
		}, (res) => {
			this._applyAlarmIntervalFromNativeRes(res, payload.alarmInterval);
		});
	}

	/**
	 * 唤醒回调
	 */
	onWakeUp(data) {
		// console.log('[KeepAlive] 执行唤醒任务:', new Date().toLocaleString());
		this.checkNightModeTransition();
		if (this._isQxBleMeasuringForNotification()) {
			this.updateNotification();
		}
		this.sendHeartbeat();
		this.checkPendingTasks();
		// 闹钟暂时关闭
		// if (getQxBleKeepAliveAlarmIntervalSecFromStorage() == null && !this._nativeNightKeepAliveActive) {
		// 	this.setAlarmTimer();
		// }
		// 白名单引导暂时关闭
		// if (Math.random() < 0.1) {
		// 	this.refreshWhiteListStatus();
		// }
	}

	/**
	 * 发送心跳
	 */
	sendHeartbeat() {
		// console.log('[KeepAlive] 发送心跳...');
		if (this._qxBleHeartbeatFn) {
			try {
				this._qxBleHeartbeatFn();
			} catch (e) {
				console.warn('[KeepAlive] qxBle heartbeat', e);
			}
		}
	}

	/**
	 * 检查待处理任务
	 */
	checkPendingTasks() {
		const run = () => {
			if (this._qxBleWakeHandler) {
				return Promise.resolve(this._qxBleWakeHandler());
			}
			return import('../../pages/api/qxBleAlignedSchedule.js').then((mod) => {
				if (typeof mod.handleQxBleKeepAliveWake === 'function') {
					return mod.handleQxBleKeepAliveWake();
				}
				return mod.runQxBleScheduleWakeTick('keepAlive-alarm');
			});
		};
		run().catch((e) => {
			console.warn('[KeepAlive] qxBle wake tick', e);
		});
	}

	/** 情绪/血压定时开启时：确保前台服务与闹钟监听已就绪（进后台前调用） */
	ensureRunningForAppTimers() {
		this.ensureAlarmListener();
		if (!this.isRunning) {
			this.init();
			return;
		}
		// 无声音乐暂时关闭
		// this.startSilentMusic();
		// 采集中勿整链 restartKeepAlive，否则通知会被「后台服务正常运行」盖掉
		if (this._isQxBleMeasuringForNotification()) {
			this.updateNotification();
			this._scheduleAppTimerAlarms();
			return;
		}
		this._syncNativeKeepAliveMode();
	}

	/**
	 * 停止保活
	 */
	stop() {
		console.log('[KeepAlive] 停止保活');
		if (this.checkTimer) {
			clearInterval(this.checkTimer);
			this.checkTimer = null;
		}
		uni.$off('onAlarmTrigger');
		// #ifdef APP-PLUS
		if (typeof plus !== 'undefined' && plus.globalEvent && typeof plus.globalEvent.removeEventListener ===
			'function') {
			try {
				plus.globalEvent.removeEventListener('onAlarmTrigger');
			} catch (e) {}
		}
		// #endif

		this.stopLocationKeepAlive();
		this.stopSilentMusic();

		keepAlive.stopKeepAlive((res) => {
			console.log('[KeepAlive] 保活已停止:', res);
			this._nativeNightKeepAliveActive = false;
		});

		this.isRunning = false;
	}

	/** 同步原生夜间防杀开关状态（可选调试） */
	syncNightKeepAliveState(callback) {
		if (!keepAlive.isNightKeepAliveEnabled) {
			if (typeof callback === 'function') {
				callback({
					code: -1,
					enabled: false
				});
			}
			return;
		}
		keepAlive.isNightKeepAliveEnabled((res) => {
			if (res && res.code === 0) {
				this._nativeNightKeepAliveActive = !!res.enabled;
			}
			if (typeof callback === 'function') {
				callback(res);
			}
		});
	}

	/**
	 * 手动触发唤醒
	 */
	testWakeUp() {
		// 闹钟暂时关闭
		// this.setAlarmTimer();
		const isZh = this.getLocale();
		uni.showToast({
			title: isZh ? '已设置20秒后唤醒' : 'Wakeup set after 20 seconds',
			icon: 'none'
		});
	}

	/**
	 * 获取完整保活状态
	 */
	getStatus() {
		return {
			isRunning: this.isRunning,
			nightMode: this.nightMode,
			nativeNightKeepAliveActive: this._nativeNightKeepAliveActive,
			alarmInterval: this.alarmInterval,
			silentMusicEnabled: this.silentMusicEnabled,
			whiteListStatus: {
				...this.whiteListStatus
			},
			notificationEnabled: this.notificationEnabled,
			// ========== 新增：定位状态 ==========
			location: {
				keepAliveEnabled: this.locationKeepAliveEnabled,
				updateInterval: this.locationUpdateInterval,
				hasLocation: this.lastLocation !== null,
				lastLocation: this.lastLocation ? {
					...this.lastLocation
				} : null,
				locationAge: this.lastLocation ? (Date.now() - (this.lastLocation.time || 0)) : null,
				permissionGranted: this.locationPermissionGranted
			}
			// ====================================
		};
	}
}

const keepAliveManagerInstance = new KeepAliveManager();
// #ifdef APP-PLUS
try {
	if (typeof uni !== 'undefined' && uni.getSystemInfoSync().platform === 'android') {
		keepAliveManagerInstance.ensureAlarmListener();
	}
} catch (e) {
	console.warn('[KeepAlive] 预注册闹钟监听失败', e);
}
// #endif
export default keepAliveManagerInstance;