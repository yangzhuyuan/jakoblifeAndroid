/**
 * 保活管理器 - 夜间防杀专用
 */
const keepAlive = uni.requireNativePlugin('KeepAliveModule');

class KeepAliveManager {
	constructor() {
		this.isRunning = false;
		this.nightMode = false;
		this.alarmInterval = 60; // 默认60秒
		this.checkTimer = null;
	}

	/**
	 * 初始化保活（入口方法）
	 */
	init() {
		console.log('[KeepAlive] 初始化保活管理器');

		// 1. 初始化模块
		keepAlive.init({}, (res) => {
			console.log('[KeepAlive] 初始化结果:', res);

			if (res.code === 0) {
				// 2. 检查电池优化白名单
				this.checkBatteryOptimization();

				// 3. 启动前台服务
				this.startService();

				// 4. 设置定时唤醒
				this.setAlarmTimer();

				// 5. 设置JobScheduler双保险
				this.setJobScheduler();

				// 6. 启动夜间模式检测
				this.startNightModeCheck();

				this.isRunning = true;
			}
		});

		// 监听原生唤醒事件
		uni.$on('onAlarmTrigger', (data) => {
			console.log('[KeepAlive] 收到唤醒事件:', data);

			// 收到唤醒后重新设置下一次闹钟（形成循环）
			this.setAlarmTimer();

			// 可以在这里执行你的后台任务
			this.onWakeUp(data);
		});
	}

	/**
	 * 启动前台服务
	 */
	startService() {
		const hour = new Date().getHours();
		const isNight = hour >= 23 || hour <= 6;
		const locale = uni.getLocale();
		console.log("locale", locale)
		if (locale === "zh-Hans" || locale === "zh-Hant") {
			keepAlive.startForegroundService({
				title: isNight ? '夜间保活中' : '应用运行中',
				content: isNight ? '后台服务夜间模式' : '后台服务正常运行',
				icon: 'static/icons/48x48.png' // 可选：自定义图标名称
			}, (res) => {
				console.log('[KeepAlive] 服务启动:', res);
			});
		} else {
			keepAlive.startForegroundService({
				title: isNight ? 'Nighttime survival mode' : 'Application running',
				content: isNight ? 'Background service nighttime mode' :
					'Background service running normally',
				icon: 'static/icons/48x48.png' // 可选：自定义图标名称
			}, (res) => {
				console.log('[KeepAlive] 服务启动:', res);
			});
		}
	}

	/**
	 * 设置定时唤醒闹钟
	 */
	setAlarmTimer() {
		const hour = new Date().getHours();
		const isNight = hour >= 23 || hour <= 6;

		// 夜间缩短间隔到15-20秒，白天60秒
		const interval = isNight ? 20 : 60;

		keepAlive.setAlarmTimer({
			interval: interval, // 唤醒间隔（秒）
			exact: true, // 精确唤醒（耗电但可靠）
			nightMode: isNight // 启用夜间激进模式
		}, (res) => {
			console.log('[KeepAlive] 定时器设置:', res);
			this.nightMode = isNight;
			this.alarmInterval = interval;
		});
	}

	/**
	 * 设置JobScheduler（Android 5.0+双保险）
	 */
	setJobScheduler() {
		keepAlive.setJobScheduler({}, (res) => {
			console.log('[KeepAlive] JobScheduler:', res);
		});
	}

	/**
	 * 检查并申请电池优化白名单
	 */
	checkBatteryOptimization() {
		keepAlive.isIgnoringBatteryOptimizations((res) => {
			console.log('[KeepAlive] 电池优化状态:', res);
			if (!res.data) {
				// 未加入白名单，提示用户
				// uni.showModal({
				// 	title: '需要电池优化白名单',
				// 	content: '为保证夜间正常运行，请将应用加入电池优化白名单',
				// 	success: (modalRes) => {
				// 		if (modalRes.confirm) {
				// 			// 跳转到系统设置
				keepAlive.requestIgnoreBatteryOptimizations((res) => {
					console.log('[KeepAlive] 已跳转设置');
				});
				// 		}
				// 	}
				// });
			}
		});
	}

	/**
	 * 启动夜间模式检测（每小时检查一次）
	 */
	startNightModeCheck() {
		// 立即检查一次
		this.checkNightModeTransition();

		// 每30分钟检查一次是否需要切换模式
		this.checkTimer = setInterval(() => {
			this.checkNightModeTransition();
		}, 30 * 60 * 1000); // 30分钟
	}

	/**
	 * 检查夜间模式切换
	 */
	checkNightModeTransition() {
		const hour = new Date().getHours();
		const isNight = hour >= 23 || hour <= 6;
		// 如果模式发生变化，重新设置
		if (isNight !== this.nightMode) {
			console.log('[KeepAlive] 切换模式:', isNight ? '夜间' : '白天');
			this.setAlarmTimer();
			this.updateNotification();
		}
	}

	/**
	 * 更新通知内容
	 */
	updateNotification() {
		const hour = new Date().getHours();
		const isNight = hour >= 23 || hour <= 6;
		const locale = uni.getLocale();
		console.log("locale", locale)
		if (locale === "zh-Hans" || locale === "zh-Hant") {
			// 通过启动服务更新通知
			keepAlive.startForegroundService({
				title: isNight ? '夜间保活中' : '应用运行中',
				content: isNight ? `后台服务夜间模式(${this.alarmInterval}秒唤醒)` : '后台服务正常运行'
			}, () => {});
		} else {
			// 通过启动服务更新通知
			keepAlive.startForegroundService({
				title: isNight ? 'Nighttime survival mode' : 'Application running',
				content: isNight ?
					`Background service nighttime mode(${this.alarmInterval}Instant wake-up)` :
					'Background service running normally'
			}, () => {});
		}
	}

	/**
	 * 唤醒回调 - 在这里执行你的后台任务
	 */
	onWakeUp(data) {
		console.log('[KeepAlive] 执行唤醒任务:', new Date().toLocaleString());

		// 示例：发送心跳请求
		this.sendHeartbeat();

		// 示例：检查是否有待处理任务
		this.checkPendingTasks();
	}

	/**
	 * 发送心跳（示例）
	 */
	sendHeartbeat() {
		// 你的业务逻辑
		console.log('[KeepAlive] 发送心跳...');
	}

	/**
	 * 检查待处理任务（示例）
	 */
	checkPendingTasks() {
		// 你的业务逻辑
	}

	/**
	 * 停止保活
	 */
	stop() {
		console.log('[KeepAlive] 停止保活');

		// 清除定时器
		if (this.checkTimer) {
			clearInterval(this.checkTimer);
			this.checkTimer = null;
		}

		// 取消监听
		uni.$off('onAlarmTrigger');

		// 停止服务
		keepAlive.stopForegroundService((res) => {
			console.log('[KeepAlive] 服务已停止:', res);
		});

		// 取消闹钟
		keepAlive.cancelAlarmTimer((res) => {
			console.log('[KeepAlive] 定时器已取消:', res);
		});

		this.isRunning = false;
	}

	/**
	 * 手动触发一次唤醒（测试用）
	 */
	testWakeUp() {
		this.setAlarmTimer();
		// uni.showToast({
		// 	title: '已设置20秒后唤醒',
		// 	icon: 'none'
		// });
	}
}

// 导出单例
export default new KeepAliveManager();