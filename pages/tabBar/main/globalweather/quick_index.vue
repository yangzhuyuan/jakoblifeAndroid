<template>
	<view class="quick-container">
		<!-- 24小时监测卡片 -->
		<view class="mode-card mode-24h" :class="{'active': activeMode === '24h'}">
			<view class="card-header">
				<text class="mode-title">{{$t("监测报告24")}}</text>
				<switch :checked="activeMode === '24h'" @change="set24HourMode" color="#007AFF" />
			</view>
			<view class="card-desc">
				<text>{{$t("全天候血压监测覆盖睡眠与活动时段")}}</text>
			</view>
			<view v-if="activeMode === '24h'" class="report-info">
				<view class="time-range">
					<text>{{$t("白天监测时段")}}：06:00 - 21:30 ({{$t("每")}}30{{$t("分钟")}})</text>
				</view>
				<view class="time-range">
					<text>{{$t("夜间监测时段")}}：21:30 - 06:00 ({{$t("每")}}60{{$t("分钟")}})</text>
				</view>
			</view>
		</view>

		<!-- 7天监测卡片 -->
		<view class="mode-card mode-7d" :class="{'active': activeMode === '7d'}">
			<view class="card-header">
				<text class="mode-title">{{$t("监测报告7")}}</text>
				<switch :checked="activeMode === '7d'" @change="set7DayMode" color="#52C41A" />
			</view>
			<view class="card-desc">
				<text>{{$t("长期血压趋势监测适合健康追踪")}}</text>
			</view>
			<view v-if="activeMode === '7d'" class="report-info">
				<view class="time-range">
					<text>{{$t("时段")}}1：08:00 - 15:00 ({{$t("每")}}360{{$t("分钟")}})</text>
				</view>
				<view class="time-range">
					<text>{{$t("时段")}}2：18:00 - 21:00 ({{$t("每")}}180{{$t("分钟")}})</text>
				</view>
			</view>
		</view>

		<!-- 当前报告摘要 -->
		<view v-if="activeMode !== 'custom'" class="report-section">
			<view class="section-title">
				<view class="title-wrapper">
					<text>{{$t("当前监测模式")}}</text>
					<view v-if="sending" class="sending-status">
						<text class="sending-text">{{$t("配置中")}}</text>
						<text class="sending-icon-animate">⏳</text>
					</view>
				</view>
			</view>
			<view class="report-detail">
				<text class="mode-badge" :class="{'badge-24h': activeMode === '24h', 'badge-7d': activeMode === '7d'}">
					{{activeMode === '24h' ? $t('小时模式24') : $t('天模式7')}}
				</text>
				<view class="detail-list">
					<view v-for="(item, idx) in currentReportItems" :key="idx" class="detail-item">
						<text>{{$t("时段")}} {{idx + 1}}: {{item.startTime}} - {{item.endTime}} ({{$t("每")}}
							{{item.interval}} {{$t("分钟")}})</text>
					</view>
				</view>
			</view>
		</view>


		<!-- 快捷设置按钮 -->
		<button class="buttonstyle button-24h" @click="clickset(24)">{{$t("小时监测报告24")}}</button>
		<button class="buttonstyle button-7d" @click="clickset(7)">{{$t("天监测报告7")}}</button>
	</view>
</template>

<script>
	import {
		u16proBLE
	} from '../../../api/protocol/u16pro-ble-manager.js'
	const STORAGE_KEY = 'blood_pressure_timer_config';
	/** 设备验证成功后 otaBP 的合法取值 */
	const OTA_BP_VERIFY_OK_IDS = new Set([
		'69D616630656352E382E380741423536313043',
		'69E5814C0656352E382E390741423536313043',
		'69E587830656352E382E380741423536313043'
	]);

	export default {
		data() {
			return {
				sending: false,
				deviceId: uni.getStorageSync("deviceIdwatch"),
				BPW6deviceId: uni.getStorageSync("BPW6devicemac"),
				activeMode: 'custom', // 'custom', '24h', '7d'
				config: {
					maxCount: 3,
					items: []
				},
				// 保存发送前的状态，用于发送失败时恢复
				lastSentState: {
					activeMode: 'custom',
					items: []
				},
				devicetype: false,
			};
		},
		computed: {
			currentReportItems() {
				if (this.activeMode === '24h') {
					return [{
							startTime: '06:00',
							endTime: '21:30',
							interval: 30
						},
						{
							startTime: '21:30',
							endTime: '06:00',
							interval: 60
						}
					];
				} else if (this.activeMode === '7d') {
					return [{
							startTime: '08:00',
							endTime: '15:00',
							interval: 360
						},
						{
							startTime: '18:00',
							endTime: '21:00',
							interval: 180
						}
					];
				}
				return [];
			}
		},
		onLoad(options) {
			this.devicetype = options.devicetype
		},
		created() {
			this.loadCurrentMode();
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("定时监测")
			})
		},
		methods: {
			loadCurrentMode() {
				try {
					const saved = uni.getStorageSync(STORAGE_KEY);
					if (saved && saved.currentMode) {
						this.activeMode = saved.currentMode;
						this.config.items = saved.items || [];
					}
				} catch (e) {}
			},

			saveModeToStorage() {
				const configData = {
					maxCount: this.config.maxCount,
					items: this.config.items,
					is24HourMode: this.activeMode === '24h',
					is7DayMode: this.activeMode === '7d',
					currentMode: this.activeMode
				};
				uni.setStorageSync(STORAGE_KEY, configData);
				// 触发全局事件通知自定义页面刷新
				uni.$emit('modeChanged', {
					mode: this.activeMode,
					items: this.config.items
				});
			},
			clickset(type) {
				uni.navigateTo({
					url: "../../main/globalweather/Personal_Information?type=" + type
				});
			},
			// 保存发送前的状态
			saveStateBeforeSend() {
				this.lastSentState = {
					activeMode: this.activeMode,
					items: JSON.parse(JSON.stringify(this.config.items))
				};
			},

			// 发送失败时恢复状态
			restoreStateOnFailure() {
				this.activeMode = this.lastSentState.activeMode;
				this.config.items = this.lastSentState.items;
				this.$forceUpdate();
			},

			// 16进制字符串转ArrayBuffer
			toArrayBuffer(hexStr) {
				const buffer = new ArrayBuffer(hexStr.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < hexStr.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(hexStr.substr(i, 2), 16));
				}
				return buffer;
			},

			buildBloodPressureTimerPacket(data) {
				const {
					buildBloodPressureTimerPacket
				} = require('../../../api/unitls/bluetooth/bloodPressureTimer.js');
				return buildBloodPressureTimerPacket(data);
			},

			// 构建禁用所有定时器的配置包
			buildDisableAllTimersPacket() {
				// 获取当前配置的定时器列表，将所有 enabled 设置为 false
				const timers = this.config.items.map((item, idx) => ({
					index: idx,
					enabled: false, // 关键：设置为 false
					startHour: parseInt(item.startHour, 10),
					startMinute: parseInt(item.startMinute, 10),
					endHour: parseInt(item.endHour, 10),
					endMinute: parseInt(item.endMinute, 10),
					interval: parseInt(item.interval, 10)
				}));

				const packet = this.buildBloodPressureTimerPacket({
					maxTimers: this.config.maxCount,
					timers: timers
				});
				return packet;
			},

			// 与 Main ACK 撞写时偶发 10007，短暂重试；仅本页 BLE 写使用
			writeBleWithBusyRetry(value, success, fail, retryLeft = 6) {
				const that = this;
				const BUSY_RETRY_MS = 500;
				uni.writeBLECharacteristicValue({
					deviceId: that.deviceId,
					serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
					characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
					writeType: 'writeNoResponse',
					value,
					success,
					fail: (err) => {
						const code = err && (err.errCode != null ? err.errCode : err.code);
						if (code === 10007 && retryLeft > 0) {
							setTimeout(() => {
								that.writeBleWithBusyRetry(value, success, fail, retryLeft - 1);
							}, BUSY_RETRY_MS);
							return;
						}
						fail && fail(err);
					}
				});
			},

			// 发送数据到设备（与第一个文件保持一致的分包发送逻辑）
			sendData(packet, resolve, reject, showLoading = true) {
				let that = this;
				const MTU = 20;

				const onSuccess = () => {
					that.sending = false;
					if (showLoading) {
						uni.hideLoading();
					}
					uni.showToast({
						title: that.$t("配置成功"),
						icon: 'none'
					});
					that.saveModeToStorage();
					uni.removeStorageSync("otaBP");
					resolve();
				};

				const onFailure = (err) => {
					that.sending = false;
					// 发送失败，恢复原状态
					that.restoreStateOnFailure();
					if (showLoading) {
						uni.hideLoading();
					}
					uni.showToast({
						title: that.$t("配置失败"),
						icon: 'none'
					});
					uni.removeStorageSync("otaBP");
					reject(err);
				};

				if (packet.byteLength <= MTU) {
					that.writeBleWithBusyRetry(packet, onSuccess, onFailure);
					return;
				}

				// 分包发送
				const packetBytes = new Uint8Array(packet);
				const packets = [];
				for (let i = 0; i < packetBytes.length; i += MTU) {
					const end = Math.min(i + MTU, packetBytes.length);
					packets.push(packetBytes.slice(i, end));
				}

				let index = 0;
				const sendNextPacket = () => {
					if (index >= packets.length) {
						onSuccess();
						return;
					}
					const currentPacket = packets[index];
					that.writeBleWithBusyRetry(currentPacket.buffer, () => {
						index++;
						setTimeout(sendNextPacket, 100);
					}, onFailure);
				};
				sendNextPacket();
			},

			/**
			 * 等待设备信息校验通过。
			 * 优先等本次 OTA 回包写入的 otaBP；过早用 otadatares 兜底会在回包/ACK 未完成时立刻发配置，易与 Main sendack 撞写 10007。
			 * otadatares 仅作接近超时的兜底。
			 */
			waitOtaBpVerifyId(timeoutMs = 5000) {
				return new Promise((resolve) => {
					const started = Date.now();
					const OTA_RES_FALLBACK_MS = Math.min(2800, Math.max(0, timeoutMs - 800));
					const poll = () => {
						const otaBP = String(uni.getStorageSync("otaBP") || "");
						const otaRes = String(uni.getStorageSync("otadatares") || "");
						let candidate = "";
						if (OTA_BP_VERIFY_OK_IDS.has(otaBP)) {
							candidate = otaBP;
						} else if (Date.now() - started >= OTA_RES_FALLBACK_MS && OTA_BP_VERIFY_OK_IDS.has(
								otaRes)) {
							candidate = otaRes;
						}
						if (candidate) {
							resolve(candidate);
							return;
						}
						if (Date.now() - started >= timeoutMs) {
							resolve("");
							return;
						}
						setTimeout(poll, 200);
					};
					poll();
				});
			},

			/** Main 写完 otaBP 后会 enqueue ACK；等通道空闲再发定时器配置，降低 10007 */
			waitBleChannelSettle(preferFreshOtaBp = true, settleMs = 700, timeoutMs = 2500) {
				return new Promise((resolve) => {
					const started = Date.now();
					const finish = () => setTimeout(resolve, settleMs);
					const poll = () => {
						const otaBP = String(uni.getStorageSync("otaBP") || "");
						if (!preferFreshOtaBp || OTA_BP_VERIFY_OK_IDS.has(otaBP)) {
							finish();
							return;
						}
						if (Date.now() - started >= timeoutMs) {
							finish();
							return;
						}
						setTimeout(poll, 100);
					};
					poll();
				});
			},

			// OTA数据发送流程（用于开启监测模式）
			OTAdata(items, resolve, reject) {
				let that = this;
				uni.removeStorageSync("arguments00");
				// 获取设备信息的命令
				const buffer2 = that.toArrayBuffer("e0000609200101000100");
				const gen = (that._otaVerifyGen = (that._otaVerifyGen || 0) + 1);
				setTimeout(() => {
					// 清掉旧 otaBP，避免未收到本次回包就用脏数据通过
					uni.removeStorageSync("otaBP");
					that.writeBleWithBusyRetry(buffer2, () => {
						console.log("OTA：e0000609200101000100");
						that.waitOtaBpVerifyId(5000).then((verifiedId) => {
							if (gen !== that._otaVerifyGen) {
								return;
							}
							console.log("【BPW1】otaBP:", uni.getStorageSync("otaBP"),
								"verified:", verifiedId);
							if (!OTA_BP_VERIFY_OK_IDS.has(verifiedId)) {
								that.sending = false;
								that.restoreStateOnFailure();
								uni.showToast({
									title: that.$t("请检查手表设备"),
									icon: 'none',
									duration: 2000
								});
								uni.hideLoading();
								uni.removeStorageSync("otaBP");
								reject(new Error("设备验证失败"));
								return;
							}
							const usedCachedOtaRes = !OTA_BP_VERIFY_OK_IDS.has(
								String(uni.getStorageSync("otaBP") || "")
							);
							that.waitBleChannelSettle(usedCachedOtaRes, 700, 2500).then(() => {
								if (gen !== that._otaVerifyGen) {
									return;
								}
								try {
									const timers = items.map((item, idx) => ({
										index: idx,
										enabled: !!item.enabled,
										startHour: parseInt(item.startHour,
											10),
										startMinute: parseInt(item.startMinute,
											10),
										endHour: parseInt(item.endHour, 10),
										endMinute: parseInt(item.endMinute,
											10),
										interval: parseInt(item.interval, 10)
									}));
									const packet = that.buildBloodPressureTimerPacket({
										maxTimers: that.config.maxCount,
										timers: timers
									});
									that.sendData(packet, resolve, reject, true);
								} catch (e) {
									that.sending = false;
									that.restoreStateOnFailure();
									uni.showToast({
										title: that.$t("请检查手表设备"),
										icon: 'none'
									});
									uni.hideLoading();
									uni.removeStorageSync("otaBP");
									reject(e);
								}
							});
						});
					}, (err) => {
						if (gen !== that._otaVerifyGen) {
							return;
						}
						that.sending = false;
						that.restoreStateOnFailure();
						console.log("OTA失败：e0000609200101000100", err);
						uni.showToast({
							title: that.$t("请检查设备连接"),
							icon: 'none',
							duration: 2000
						});
						uni.hideLoading();
						reject(err);
					});
				}, 3000);
			},

			// 发送配置到设备（开启模式）
			async sendConfigToDevice(items) {
				let that = this;
				that.sending = true;
				return new Promise((resolve, reject) => {
					that.OTAdata(items, resolve, reject);
				});
			},

			// 发送禁用配置到设备（关闭所有监测）
			async sendDisableConfigToDevice() {
				let that = this;
				that.sending = true;
				uni.showLoading({
					title: that.$t("关闭中"),
					mask: true
				});

				return new Promise((resolve, reject) => {
					// 直接构建禁用包并发送，不需要验证设备型号
					const packet = that.buildDisableAllTimersPacket();

					// 直接发送，不走OTA验证流程
					that.sendData(packet, resolve, reject, true);
				});
			},

			// 设置24小时模式
			set24HourMode() {
				let that = this;
				const newMode = that.activeMode === '24h' ? 'custom' : '24h';

				if (newMode === 'custom') {
					// 关闭24h模式 - 发送禁用所有定时器的命令
					that.saveStateBeforeSend();
					if (that.devicetype === "true") {
						// 4.16 设置血压动态测量参数
						u16proBLE.setBPDynamicParams({
							enabled: 0, // 1打开 0关闭
							startHour: 6, // 06:00 开始
							dayInterval: 30, // 白天间隔（分钟）
							nightInterval: 60 // 晚上间隔（分钟）
						}, that.BPW6deviceId)
						// 4.17 读取血压动态测量参数
						//  u16proBLE.readBPDynamicParams(deviceId)
					} else {
						// 发送禁用配置
						that.sendDisableConfigToDevice();
					}
					// 成功后更新本地状态
					that.activeMode = 'custom';
					that.config.items = [];
					that.saveModeToStorage();
					uni.showToast({
						title: that.$t("已关闭小时监测24"),
						icon: 'none'
					});
					return;
				}
				// 保存当前状态用于回滚
				that.saveStateBeforeSend();
				// 乐观更新UI
				that.activeMode = '24h';
				uni.showModal({
					title: that.$t('确认开启'),
					content: that.$t('开启小时监测将覆盖当前配置并关闭天监测是否继续'),
					success: async (res) => {
						if (res.confirm) {
							// 24小时监测配置：与第一个文件保持一致
							const items = [{
								index: 0,
								enabled: true,
								startTime: '06:00',
								endTime: '21:30',
								interval: 30,
								startHour: 6,
								startMinute: 0,
								endHour: 21,
								endMinute: 30
							}, {
								index: 1,
								enabled: true,
								startTime: '21:30',
								endTime: '06:00',
								interval: 60,
								startHour: 21,
								startMinute: 30,
								endHour: 6,
								endMinute: 0
							}];

							that.config.items = items;
							that.config.maxCount = 3;
							try {
								if (that.devicetype === "true") {
									// 4.16 设置血压动态测量参数
									await u16proBLE.setBPDynamicParams({
										enabled: 1, // 1打开 0关闭
										startHour: 6, // 06:00 开始
										dayInterval: 30, // 白天间隔（分钟）
										nightInterval: 60 // 晚上间隔（分钟）
									}, that.BPW6deviceId)
									// 4.17 读取血压动态测量参数
									// await u16proBLE.readBPDynamicParams(deviceId)
								} else {
									await that.sendConfigToDevice(items);
								}
								that.saveModeToStorage();
							} catch (error) {
								that.restoreStateOnFailure();
								console.error('set24HourMode error:', error);
							}
						} else {
							// 用户取消，恢复状态
							that.restoreStateOnFailure();
						}
					},
					fail: () => {
						that.restoreStateOnFailure();
					}
				});
			},

			// 设置7天模式
			set7DayMode() {
				let that = this;
				const newMode = that.activeMode === '7d' ? 'custom' : '7d';

				if (newMode === 'custom') {
					// 关闭7天模式 - 发送禁用所有定时器的命令
					that.saveStateBeforeSend();
					if (that.devicetype === "true") {
						// 4.16 设置血压动态测量参数
						u16proBLE.setBPDynamicParams({
							enabled: 0, // 1打开 0关闭
							startHour: 8, // 08:00 开始
							dayInterval: 60, // 白天间隔（分钟）
							nightInterval: 80 // 晚上间隔（分钟）
						}, that.BPW6deviceId)
						// 4.17 读取血压动态测量参数
						//  u16proBLE.readBPDynamicParams(deviceId)
					} else {
						// 发送禁用配置
						that.sendDisableConfigToDevice();
					}
					// 成功后更新本地状态
					that.activeMode = 'custom';
					that.config.items = [];
					that.saveModeToStorage();
					uni.showToast({
						title: that.$t("已关闭天监测7"),
						icon: 'none'
					});

					return;
				}

				// 保存当前状态用于回滚
				that.saveStateBeforeSend();

				// 乐观更新UI
				that.activeMode = '7d';

				uni.showModal({
					title: that.$t('确认开启'),
					content: that.$t('开启天监测将覆盖当前配置并关闭小时监测是否继续'),
					success: async (res) => {
						if (res.confirm) {
							// 7天监测配置：与第一个文件保持一致
							const items = [{
								index: 0,
								enabled: true,
								startTime: '08:00',
								endTime: '15:00',
								interval: 360,
								startHour: 8,
								startMinute: 0,
								endHour: 15,
								endMinute: 0
							}, {
								index: 1,
								enabled: true,
								startTime: '18:00',
								endTime: '21:00',
								interval: 180,
								startHour: 18,
								startMinute: 0,
								endHour: 21,
								endMinute: 0
							}];

							that.config.items = items;
							that.config.maxCount = 3;

							try {
								if (that.devicetype === "true") {
									console.log("that.devicetype", that.devicetype)
									// 4.16 设置血压动态测量参数
									await u16proBLE.setBPDynamicParams({
										enabled: 1, // 1打开 0关闭
										startHour: 8, // 06:00 开始
										dayInterval: 60, // 白天间隔（分钟）
										nightInterval: 80 // 晚上间隔（分钟）
									}, that.BPW6deviceId)
									// 4.17 读取血压动态测量参数
									// await u16proBLE.readBPDynamicParams(deviceId)
								} else {
									await that.sendConfigToDevice(items);
								}
								that.saveModeToStorage();
							} catch (error) {
								that.restoreStateOnFailure();
								console.error('set7DayMode error:', error);
							}
						} else {
							that.restoreStateOnFailure();
						}
					},
					fail: () => {
						that.restoreStateOnFailure();
					}
				});
			}
		}
	};
</script>

<style scoped>
	.quick-container {
		padding: 30rpx;
		background-color: #f8f8f8;
		min-height: 100vh;
		padding-bottom: 60rpx;
	}

	.mode-card {
		background: white;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		border: 2rpx solid transparent;
		transition: all 0.3s;
	}

	.mode-24h.active {
		border-color: #007AFF;
		background: linear-gradient(145deg, #ffffff, #f0f8ff);
	}

	.mode-7d.active {
		border-color: #52C41A;
		background: linear-gradient(145deg, #ffffff, #f6ffed);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.mode-title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.mode-24h .mode-title {
		color: #007AFF;
	}

	.mode-7d .mode-title {
		color: #52C41A;
	}

	.card-desc {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 20rpx;
	}

	.report-info {
		background-color: #f9f9f9;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-top: 10rpx;
	}

	.time-range {
		font-size: 28rpx;
		color: #333;
		padding: 10rpx 0;
	}

	.report-section {
		background: white;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		color: #333;
		border-left: 8rpx solid #007AFF;
		padding-left: 20rpx;
	}

	.title-wrapper {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.sending-status {
		display: flex;
		align-items: center;
		margin-left: 16rpx;
		padding: 4rpx 16rpx;
		background: linear-gradient(135deg, #fff3e0 0%, #ffe6cc 100%);
		border-radius: 24rpx;
	}

	.sending-text {
		color: #ff6600;
		font-size: 24rpx;
		font-weight: 500;
		margin-right: 8rpx;
	}

	.sending-icon-animate {
		color: #ff6600;
		font-size: 28rpx;
		display: inline-block;
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.report-detail {
		background: #fafafa;
		border-radius: 16rpx;
		padding: 20rpx;
	}

	.mode-badge {
		display: inline-block;
		padding: 8rpx 24rpx;
		border-radius: 40rpx;
		font-size: 24rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.badge-24h {
		background: #e6f7ff;
		color: #007AFF;
	}

	.badge-7d {
		background: #f6ffed;
		color: #52C41A;
	}

	.detail-list {
		margin-top: 10rpx;
	}

	.detail-item {
		padding: 15rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
	}


	/* 快捷按钮统一样式 */
	.buttonstyle {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 96rpx;
		margin: 30px 20rpx;
		color: white;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 48rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		transition: all 0.3s;
	}

	.button-24h {
		background: linear-gradient(135deg, #007AFF 0%, #0056b3 100%);
	}

	.button-7d {
		background: linear-gradient(135deg, #52C41A 0%, #389e0d 100%);
	}
</style>