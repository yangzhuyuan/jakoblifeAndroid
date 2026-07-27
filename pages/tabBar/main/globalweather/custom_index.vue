<template>
	<view class="custom-container">
		<!-- 模式状态提示 -->
		<view v-if="isQuickModeActive" class="mode-warning"
			:class="{'warning-24h': parentMode === '24h', 'warning-7d': parentMode === '7d'}">
			<text>{{modeWarningText}}</text>
			<button size="mini" type="primary" @click="disableQuickMode" :disabled="sending">
				{{ sending ? $t("关闭中") : $t("关闭快捷模式") }}
			</button>
		</view>

		<!-- 定时项列表 -->
		<view class="section">
			<view class="section-title">
				<view class="title-wrapper">
					<text>{{$t("自定义时段")}}</text>
					<view v-if="sending" class="sending-status">
						<text class="sending-text">{{$t("配置中")}}</text>
						<text class="sending-icon-animate">⏳</text>
					</view>
				</view>
			</view>

			<view v-for="(item, index) in config.items" :key="index" class="timer-item"
				:class="{'disabled-item': isQuickModeActive}">
				<view class="item-header">
					<text>{{$t("时段")}} {{index + 1}}</text>
					<switch :checked="item.enabled" @change="e => toggleItem(index, e.detail.value)"
						:disabled="isQuickModeActive" />
				</view>
				<view class="item-content">
					<view class="time-row">
						<text>{{$t("开始时间")}}：</text>
						<picker fields="month" mode="time" :value="item.startTime"
							@change="e => updateStartTime(index, e)" :disabled="isQuickModeActive">
							<view class="time-picker">{{ item.startTime }}</view>
						</picker>
					</view>
					<view class="time-row">
						<text>{{$t("结束时间")}}：</text>
						<picker fields="month" mode="time" :value="item.endTime" @change="e => updateEndTime(index, e)"
							:disabled="isQuickModeActive">
							<view class="time-picker">{{ item.endTime }}</view>
						</picker>
					</view>
					<view class="time-row">
						<text>{{$t("间隔时间")}}：</text>
						<picker :value="item.intervalIndex" :range="intervalOptions"
							@change="e => updateInterval(index, e)" :disabled="isQuickModeActive">
							<view class="interval-picker">{{ intervalOptions[item.intervalIndex] }}</view>
						</picker>
					</view>
				</view>
			</view>

			<!-- 添加/删除按钮 -->
			<view class="button-row">
				<button style="box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);" type="default" size="mini"
					@click="addTimerItem" :disabled="isQuickModeActive || config.items.length >= config.maxCount">
					{{$t("添加")}}
				</button>
				<button style="box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);" type="default" size="mini"
					@click="removeTimerItem" :disabled="isQuickModeActive || config.items.length <= 0">
					{{$t("删除")}}
				</button>
				<button style="box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);" type="default" size="mini"
					@click="resetToDefault" :disabled="isQuickModeActive">
					{{$t("重置")}}
				</button>
			</view>
		</view>
		<!-- 保存按钮 -->
		<button class="action-buttons" type="primary" @click="showSaveConfirm" :disabled="sending || !validateConfig()">
			{{ sending ? $t("发送中") : $t("保存配置") }}
		</button>
	</view>
</template>

<script>
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
				config: {
					maxCount: 3,
					items: []
				},
				intervalOptions: [],
				parentMode: 'custom',
				isQuickModeActive: false
			};
		},
		computed: {
			modeWarningText() {
				if (this.parentMode === '24h') return this.$t("当前处于24小时监测模式自定义配置已禁用");
				if (this.parentMode === '7d') return this.$t("当前处于7天监测模式自定义配置已禁用");
				return "";
			}
		},
		created() {
			this.generateIntervalOptions();
			this.loadConfig();
			this.listenForModeChanges();
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("定时监测")
			})
			that.loadConfig();
		},
		beforeDestroy() {
			uni.$off('modeChanged');
		},
		methods: {

			forceRefreshConfig() {
				const newItems = this.config.items.map(item => ({
					...item
				}));
				this.config.items = [];
				this.$nextTick(() => {
					this.config.items = newItems;
					this.$forceUpdate();
				});
			},

			generateIntervalOptions() {
				const options = [];
				for (let i = 15; i <= 480; i += 15) {
					options.push(`${i} ${this.$t("分钟")}`);
				}
				this.intervalOptions = options;
			},

			getIntervalIndex(interval) {
				let value = parseInt(interval, 10);
				if (isNaN(value) || value < 15) value = 15;
				if (value > 480) value = 480;
				value = Math.round(value / 15) * 15;
				return (value / 15) - 1;
			},

			getIntervalValue(index) {
				return (index + 1) * 15;
			},

			loadConfig() {
				try {
					const saved = uni.getStorageSync(STORAGE_KEY);
					if (saved) {
						this.parentMode = saved.currentMode || 'custom';
						this.isQuickModeActive = (this.parentMode === '24h' || this.parentMode === '7d');

						if (saved.items && saved.items.length > 0 && !this.isQuickModeActive) {
							this.config.items = saved.items.map(item => ({
								...item,
								intervalIndex: item.intervalIndex !== undefined ? item.intervalIndex : this
									.getIntervalIndex(item.interval || 30)
							}));
						} else if (!this.isQuickModeActive) {
							this.resetToDefault();
						} else {
							this.config.items = [];
						}
						this.config.maxCount = saved.maxCount || 3;
					} else {
						this.resetToDefault();
					}
				} catch (e) {
					this.resetToDefault();
				}
			},

			listenForModeChanges() {
				uni.$on('modeChanged', (data) => {
					this.parentMode = data.mode;
					this.isQuickModeActive = (data.mode === '24h' || data.mode === '7d');
					if (this.isQuickModeActive) {
						this.config.items = [];
					} else {
						this.loadConfig();
					}
				});
			},

			// 构建禁用所有定时器的配置包
			buildDisableAllTimersPacket() {
				// 如果没有配置项，创建一个默认的空配置
				let timers = [];
				if (this.config.items && this.config.items.length > 0) {
					timers = this.config.items.map((item, idx) => ({
						index: idx,
						enabled: false, // 设置为 false 禁用
						startHour: parseInt(item.startHour, 10) || 0,
						startMinute: parseInt(item.startMinute, 10) || 0,
						endHour: parseInt(item.endHour, 10) || 0,
						endMinute: parseInt(item.endMinute, 10) || 0,
						interval: parseInt(item.interval, 10) || 30
					}));
				} else {
					// 默认创建一个禁用的定时器
					timers = [{
						index: 0,
						enabled: false,
						startHour: 6,
						startMinute: 0,
						endHour: 21,
						endMinute: 30,
						interval: 30
					}];
				}

				const packet = this.buildBloodPressureTimerPacket({
					maxTimers: this.config.maxCount,
					timers: timers
				});
				return packet;
			},

			// 发送禁用配置到设备
			async sendDisableConfigToDevice() {
				let that = this;
				return new Promise((resolve, reject) => {
					// 先验证设备
					uni.removeStorageSync("arguments00");
					const buffer2 = that.toArrayBuffer("e0000609200101000100");

					setTimeout(() => {
						uni.writeBLECharacteristicValue({
							deviceId: that.deviceId,
							serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
							characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
							writeType: 'writeNoResponse',
							value: buffer2,
							success(res) {
								setTimeout(() => {
									const otaBP = uni.getStorageSync("otaBP");
									if (OTA_BP_VERIFY_OK_IDS.has(otaBP)) {
										try {
											const packet = that
												.buildDisableAllTimersPacket();
											that.sendData(packet, resolve, reject);
										} catch (e) {
											uni.removeStorageSync("otaBP");
											reject(e);
										}
									} else {
										uni.removeStorageSync("otaBP");
										reject(new Error("设备验证失败"));
									}
								}, 3000);
							},
							fail(err) {
								uni.removeStorageSync("otaBP");
								reject(err);
							},
						});
					}, 3000);
				});
			},

			// 关闭快捷模式（带发送命令）
			async disableQuickMode() {
				let that = this;

				// 如果正在发送中，不允许重复点击
				if (that.sending) {
					uni.showToast({
						title: that.$t("正在处理中请稍后"),
						icon: 'none'
					});
					return;
				}

				uni.showModal({
					title: that.$t('确认关闭'),
					content: that.$t('关闭快捷模式将停止设备上的定时监测是否继续'),
					success: async (res) => {
						if (res.confirm) {
							that.sending = true;
							uni.showLoading({
								title: that.$t("关闭中"),
								mask: true
							});

							try {
								// 发送禁用命令到设备
								await that.sendDisableConfigToDevice();

								// 成功后更新本地状态
								that.parentMode = 'custom';
								that.isQuickModeActive = false;

								const configData = {
									maxCount: that.config.maxCount,
									items: that.config.items,
									is24HourMode: false,
									is7DayMode: false,
									currentMode: 'custom'
								};
								uni.setStorageSync(STORAGE_KEY, configData);
								uni.$emit('modeChanged', {
									mode: 'custom',
									items: that.config.items
								});

								that.loadConfig();

								uni.showToast({
									title: that.$t("已切换到自定义模式"),
									icon: 'none'
								});
							} catch (error) {
								console.error('关闭快捷模式失败:', error);
								uni.showToast({
									title: that.$t("请检查设备连接"),
									icon: 'none'
								});
							} finally {
								that.sending = false;
								uni.hideLoading();
							}
						}
					}
				});
			},

			resetToDefault() {
				const defaultInterval = 30;
				const defaultIndex = this.getIntervalIndex(defaultInterval);
				this.config.items = [{
					index: 0,
					enabled: false,
					startTime: '06:00',
					endTime: '21:30',
					interval: defaultInterval,
					intervalIndex: defaultIndex,
					startHour: 6,
					startMinute: 0,
					endHour: 21,
					endMinute: 30
				}];
				this.config.maxCount = 3;
			},

			addTimerItem() {
				if (this.isQuickModeActive) {
					uni.showToast({
						title: this.$t("请先关闭快捷监测模式"),
						icon: 'none'
					});
					return;
				}
				if (this.config.items.length >= this.config.maxCount) {
					uni.showToast({
						title: this.$t("已达最大时段数量"),
						icon: 'none'
					});
					return;
				}

				const newIndex = this.config.items.length;
				const lastItem = this.config.items[newIndex - 1];
				let defaultStartHour = 8,
					defaultStartMinute = 0;
				let defaultEndHour = 20,
					defaultEndMinute = 0;

				if (lastItem) {
					let lastEndMinutes = lastItem.endHour * 60 + lastItem.endMinute + 60;
					if (lastEndMinutes >= 24 * 60) lastEndMinutes = 8 * 60;
					defaultStartHour = Math.floor(lastEndMinutes / 60);
					defaultStartMinute = lastEndMinutes % 60;
					defaultEndHour = Math.min(defaultStartHour + 4, 23);
				}

				const defaultInterval = 30;
				this.config.items.push({
					index: newIndex,
					enabled: false,
					startTime: `${defaultStartHour.toString().padStart(2, '0')}:${defaultStartMinute.toString().padStart(2, '0')}`,
					endTime: `${defaultEndHour.toString().padStart(2, '0')}:${defaultEndMinute.toString().padStart(2, '0')}`,
					interval: defaultInterval,
					intervalIndex: this.getIntervalIndex(defaultInterval),
					startHour: defaultStartHour,
					startMinute: defaultStartMinute,
					endHour: defaultEndHour,
					endMinute: defaultEndMinute
				});
			},

			removeTimerItem() {
				if (this.isQuickModeActive) {
					uni.showToast({
						title: this.$t("请先关闭快捷监测模式"),
						icon: 'none'
					});
					return;
				}
				if (this.config.items.length <= 0) return;
				this.config.items.pop();
				this.reindexItems();
			},

			reindexItems() {
				this.config.items.forEach((item, idx) => {
					item.index = idx;
				});
			},

			toggleItem(index, value) {
				if (this.isQuickModeActive) return;
				if (this.sending) {
					uni.showToast({
						title: this.$t("正在发送配置，请稍后再试"),
						icon: 'none'
					});
					return;
				}
				this.$set(this.config.items[index], 'enabled', value);
			},

			updateStartTime(index, e) {
				if (this.isQuickModeActive) return;
				const time = e.detail.value;
				this.config.items[index].startTime = time;
				const [hour, minute] = time.split(':').map(Number);
				this.config.items[index].startHour = hour;
				this.config.items[index].startMinute = minute;
			},

			updateEndTime(index, e) {
				if (this.isQuickModeActive) return;
				const time = e.detail.value;
				this.config.items[index].endTime = time;
				const [hour, minute] = time.split(':').map(Number);
				this.config.items[index].endHour = hour;
				this.config.items[index].endMinute = minute;
			},

			updateInterval(index, e) {
				if (this.isQuickModeActive) return;
				const selectedIndex = e.detail.value;
				this.config.items[index].intervalIndex = selectedIndex;
				this.config.items[index].interval = this.getIntervalValue(selectedIndex);
			},

			validateConfig() {
				const timeRanges = [];
				for (const item of this.config.items) {
					if (!item.enabled) continue;
					let startMinutes = item.startHour * 60 + item.startMinute;
					let endMinutes = item.endHour * 60 + item.endMinute;
					if (endMinutes <= startMinutes) endMinutes += 24 * 60;
					timeRanges.push({
						start: startMinutes,
						end: endMinutes
					});
				}
				for (let i = 0; i < timeRanges.length; i++) {
					for (let j = i + 1; j < timeRanges.length; j++) {
						if (Math.max(timeRanges[i].start, timeRanges[j].start) < Math.min(timeRanges[i].end, timeRanges[j]
								.end)) {
							return false;
						}
					}
				}
				return true;
			},

			saveConfigToStorage() {
				const configData = {
					maxCount: this.config.maxCount,
					items: this.config.items,
					is24HourMode: false,
					is7DayMode: false,
					currentMode: 'custom'
				};
				uni.setStorageSync(STORAGE_KEY, configData);
				uni.$emit('modeChanged', {
					mode: 'custom',
					items: this.config.items
				});
			},

			// 显示保存确认弹窗
			showSaveConfirm() {
				let that = this;
				if (that.isQuickModeActive) {
					uni.showToast({
						title: that.$t("请先关闭快捷监测模式"),
						icon: 'none'
					});
					return;
				}
				uni.showModal({
					title: that.$t('确认保存'),
					content: that.$t('确定要保存当前血压定时配置吗'),
					confirmText: that.$t('确定'),
					cancelText: that.$t('取消'),
					success: (res) => {
						if (res.confirm) {
							that.sendConfig();
						}
					}
				});
			},

			// ==================== 蓝牙发送相关方法 ====================
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},

			buildBloodPressureTimerPacket(data) {
				const {
					buildBloodPressureTimerPacket
				} = require('../../../api/unitls/bluetooth/bloodPressureTimer.js');
				return buildBloodPressureTimerPacket(data);
			},

			sendData(packet, resolve, reject) {
				let that = this;
				const MTU = 20;

				const onSuccess = () => {
					uni.removeStorageSync("otaBP");
					resolve();
				};

				const onFailure = (err) => {
					uni.removeStorageSync("otaBP");
					reject(err);
				};

				if (packet.byteLength <= MTU) {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
						characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
						value: packet,
						success: onSuccess,
						fail: onFailure
					});
					return;
				}

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
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
						characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
						value: currentPacket.buffer,
						success: () => {
							index++;
							setTimeout(sendNextPacket, 100);
						},
						fail: onFailure
					});
				};
				sendNextPacket();
			},

			OTAdata(resolve, reject) {
				let that = this;
				uni.removeStorageSync("arguments00");
				const buffer2 = that.toArrayBuffer("e0000609200101000100");
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
						characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							setTimeout(() => {
								const otaBP = uni.getStorageSync("otaBP");
								if (OTA_BP_VERIFY_OK_IDS.has(otaBP)) {
									try {
										const timers = that.config.items.map((item, idx) => ({
											index: idx,
											enabled: !!item.enabled,
											startHour: parseInt(item.startHour, 10),
											startMinute: parseInt(item.startMinute,
												10),
											endHour: parseInt(item.endHour, 10),
											endMinute: parseInt(item.endMinute, 10),
											interval: parseInt(item.interval, 10)
										}));
										const packet = that.buildBloodPressureTimerPacket({
											maxTimers: parseInt(that.config.maxCount, 10),
											timers: timers
										});
										that.sendData(packet, resolve, reject);
									} catch (e) {
										// uni.showToast({
										// 	title: that.$t("请检查手表设备"),
										// 	icon: 'none',
										// 	duration: 2000
										// });
										uni.removeStorageSync("otaBP");
										reject(e);
									}
								} else {
									// uni.showToast({
									// 	title: that.$t("请检查手表设备"),
									// 	icon: 'none',
									// 	duration: 2000
									// });
									uni.removeStorageSync("otaBP");
									reject(new Error("设备验证失败"));
								}
							}, 3000);
						},
						fail(err) {
							uni.removeStorageSync("otaBP");
							reject(err);
						},
					});
				}, 3000);
			},

			async sendConfig() {
				if (!this.validateConfig()) {
					uni.showToast({
						title: this.$t("配置验证失败（时间重叠或无效）"),
						icon: 'none'
					});
					return;
				}

				this.sending = true;
				uni.showLoading({
					title: this.$t("设置中"),
					mask: true
				});

				try {
					await new Promise((resolve, reject) => {
						this.OTAdata(resolve, reject);
					});
					this.saveConfigToStorage();
					uni.showToast({
						title: this.$t("配置成功"),
						icon: 'none'
					});
				} catch (err) {
					console.error("发送失败:", err);
					this.loadConfig();
					uni.showToast({
						title: "1." + this.$t("请检查设备连接") + "\n2." + this.$t("请检查手表设备"),
						duration: 2000,
						icon: 'none'
					});
				} finally {
					this.sending = false;
					uni.hideLoading();
				}
			},
		}
	};
</script>

<style scoped>
	.custom-container {
		padding: 30rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 60rpx;
	}

	.mode-warning {
		background-color: #fff7e6;
		border: 2rpx solid #ffc53d;
		border-radius: 16rpx;
		padding: 20rpx 30rpx;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.warning-24h {
		background-color: #e6f7ff;
		border-color: #007AFF;
	}

	.warning-7d {
		background-color: #f6ffed;
		border-color: #52C41A;
	}

	.section {
		background: white;
		border-radius: 24rpx;
		padding: 30rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.section-title {
		font-size: 34rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
		padding-left: 20rpx;
		border-left: 8rpx solid #007AFF;
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

	.timer-item {
		border: 1rpx solid #eee;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 20px;
		background-color: #fafafa;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.disabled-item {
		opacity: 0.6;
		background-color: #f0f0f0;
		pointer-events: none;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		font-size: 30rpx;
		font-weight: bold;
	}

	.item-content {
		padding-left: 10rpx;
	}

	.time-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.time-picker,
	.interval-picker {
		border: 1rpx solid #ddd;
		border-radius: 12rpx;
		padding: 12rpx 24rpx;
		margin-left: 20rpx;
		min-width: 180rpx;
		text-align: center;
		background: white;
	}

	.button-row {
		display: flex;
		justify-content: space-around;
		margin: 40rpx 0 30rpx;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-top: 40px;
		background: #3298F7;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

	}

	button[type="primary"] {
		background-color: #007AFF;
		width: 80%;
		border-radius: 60rpx;
	}

	button[type="primary"][disabled] {
		background-color: #ccc;
	}
</style>