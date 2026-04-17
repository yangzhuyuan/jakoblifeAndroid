<template>
	<view class="container">
		<!-- 参数配置 -->
		<view class="section">
			<view class="section-title">{{$t("血压定时监测配置")}}</view>
			<!-- 24小时监测开关 -->
			<view class="mode-switch-row" :class="{'active': is24HourMode}">
				<text class="mode-label">{{$t("监测报告24")}}</text>
				<switch :checked="is24HourMode" @change="handle24HourSwitchChange" color="#007AFF" />
			</view>
			<text v-if="is24HourMode" class="mode-hint mode-hint-24h">{{$t("小时监测已开启自定义配置已禁用24")}}</text>
			<!-- 7天监测开关 -->
			<view class="mode-switch-row mode-switch-7d" :class="{'active': is7DayMode}">
				<text class="mode-label">{{$t("监测报告7")}}</text>
				<switch :checked="is7DayMode" @change="handle7DaySwitchChange" color="#52C41A" />
			</view>
			<text v-if="is7DayMode" class="mode-hint mode-hint-7d">{{$t("天监测已开启自定义配置已禁用7")}}</text>

			<!-- 定时项列表 -->
			<view v-for="(item, index) in config.items" :key="index" class="timer-item"
				:class="{'disabled-item': is24HourMode || is7DayMode}">
				<view class="item-header">
					<text>{{$t("血压定时测量开关")}} {{index + 1}}</text>
					<switch :checked="item.enabled" @change="e => toggleItem(index, e.detail.value)"
						:disabled="is24HourMode || is7DayMode" />
				</view>
				<view class="item-content">
					<view class="time-row">
						<text>{{$t("开始时间")}}：</text>
						<picker fields="month" mode="time" :value="item.startTime"
							@change="e => updateStartTime(index, e)" :disabled="is24HourMode || is7DayMode">
							<view class="time-picker" :class="{'picker-disabled': is24HourMode || is7DayMode}">
								{{ item.startTime }}
							</view>
						</picker>
					</view>
					<view class="time-row">
						<text>{{$t("结束时间")}}：</text>
						<picker fields="month" mode="time" :value="item.endTime" @change="e => updateEndTime(index, e)"
							:disabled="is24HourMode || is7DayMode">
							<view class="time-picker" :class="{'picker-disabled': is24HourMode || is7DayMode}">
								{{ item.endTime }}
							</view>
						</picker>
					</view>
					<view class="time-row">
						<text>{{$t("间隔时间")}}：</text>
						<picker :value="item.intervalIndex" :range="intervalOptions"
							@change="e => updateInterval(index, e)" :disabled="is24HourMode || is7DayMode">
							<view class="interval-picker" :class="{'picker-disabled': is24HourMode || is7DayMode}">
								{{ intervalOptions[item.intervalIndex || 0] }}
							</view>
						</picker>
					</view>
				</view>
			</view>

			<!-- 添加/删除按钮 -->
			<view class="button-row">
				<button type="default" size="mini" @click="addTimerItem"
					:disabled="config.items.length >= config.maxCount || is24HourMode || is7DayMode">
					{{$t("添加")}}
				</button>
				<button type="default" size="mini" @click="removeTimerItem"
					:disabled="config.items.length <= 0 || is24HourMode || is7DayMode">
					{{$t("删除")}}
				</button>
				<button type="default" size="mini" @click="resetToDefault"
					:disabled="config.items.length === 0 || is24HourMode || is7DayMode">
					{{$t("重置")}}
				</button>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<button type="primary" @click="sendConfig" :disabled="sending || !validateConfig()">
					{{ sending ? $t("发送中") : $t("保存配置")}}
				</button>
			</view>
		</view>

		<!-- 当前模式显示 -->
		<view v-if="currentMode !== 'custom'" class="section mode-info"
			:class="{'mode-24h': currentMode === '24h', 'mode-7d': currentMode === '7d'}">
			<view class="section-title">{{$t("当前监测模式")}}</view>
			<text class="mode-text">{{currentModeText}}</text>
			<view v-for="(item, index) in config.items" :key="index" class="mode-item">
				<text>{{$t("时段")}} {{index + 1}}: {{item.startTime}} - {{item.endTime}} ({{$t("每")}} {{item.interval}}
					{{$t("分钟")}})</text>
			</view>
		</view>

		<!-- 快捷设置按钮 -->
		<button class="buttonstyle button-24h" @click="clickset(24)">{{$t("小时监测报告24")}}</button>
		<button class="buttonstyle button-7d" @click="clickset(7)">{{$t("天监测报告7")}}</button>

	</view>
</template>

<script>
	// 本地存储键名
	const STORAGE_KEY = 'blood_pressure_timer_config';
	export default {
		data() {
			return {
				sending: false,
				deviceId: uni.getStorageSync("landeviceId"),
				config: {
					maxCount: 3,
					items: []
				},
				parsedResult: null,
				intervalOptions: [],
				is24HourMode: false,
				is7DayMode: false,
				currentMode: 'custom',
				// 保存发送前的状态，用于发送失败时恢复
				lastSentState: {
					is24HourMode: false,
					is7DayMode: false,
					currentMode: 'custom',
					items: []
				},

				isboolon: "0"

			};
		},
		computed: {
			currentModeText() {
				const texts = {
					'custom': this.$t("自定义监测"),
					'24h': this.$t("监测报告24"),
					'7d': this.$t("监测报告7")
				};
				return texts[this.currentMode] || texts['custom'];
			}
		},

		created() {
			this.generateIntervalOptions();
			this.loadConfigFromStorage();
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("定时监测")
			})
		},

		methods: {
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
			// 处理24小时开关点击
			handle24HourSwitchChange(e) {
				let that = this
				that.is24HourMode = e.detail.value;
				that.$forceUpdate()
				if (that.is24HourMode) {
					setTimeout(() => {
						if (!uni.getStorageSync("jiance")) {
							uni.showToast({
								title: that.$t("请检查设备连接"),
								icon: 'none',
								duration: 2000
							})
							that.is24HourMode = false; // 取消操作，恢复开关状态
							that.$nextTick(() => that.$forceUpdate())
							return;
						}
						uni.showModal({
							title: that.$t('确认开启'),
							content: that.$t('开启小时监测将覆盖当前配置并关闭天监测是否继续'),
							success: (res) => {
								if (res.confirm) {
									that.is7DayMode = false;
									that.set24HourMonitoring();
								} else {
									that.is24HourMode = false; // 取消操作，恢复开关状态
									that.$nextTick(() => that.$forceUpdate())
								}
							}
						});
					}, 300);
				} else {
					setTimeout(() => {
						if (!uni.getStorageSync("jiance")) {
							uni.showToast({
								title: that.$t("请检查设备连接"),
								icon: 'none',
								duration: 2000
							})
							that.is24HourMode = true; // 取消操作，恢复开关状态
							that.$nextTick(() => that.$forceUpdate())
							return;
						}
						// 尝试关闭24小时模式
						uni.showModal({
							title: that.$t('确认关闭'),
							content: that.$t('关闭小时监测将启用自定义配置是否继续'),
							success: (res) => {
								if (res.confirm) {
									// 确认关闭
									that.is24HourMode = false;
									that.currentMode = 'custom';
									that.resetToDefault();
									that.saveConfigToStorage();
								} else {
									that.is24HourMode = true; // 取消操作，恢复开关状态
									that.$nextTick(() => that.$forceUpdate())
								}
							}
						});
					}, 300);
				}
			},

			// 处理7天开关点击 - 替代原来的toggle7DayMode
			handle7DaySwitchChange(e) {
				let that = this
				that.is7DayMode = e.detail.value;
				that.$forceUpdate()
				if (that.is7DayMode) {
					setTimeout(() => {
						if (!uni.getStorageSync("jiance")) {
							uni.showToast({
								title: that.$t("请检查设备连接"),
								icon: 'none',
								duration: 2000
							})
							that.is7DayMode = false; // 取消操作，恢复开关状态
							that.$nextTick(() => that.$forceUpdate())
							return;
						}
						// 尝试开启7天模式
						uni.showModal({
							title: that.$t('确认开启'),
							content: that.$t('开启天监测将覆盖当前配置并关闭小时监测是否继续'),
							success: (res) => {
								if (res.confirm) {
									// 确认开启
									that.is24HourMode = false;
									that.set7DayMonitoring();
								} else {
									that.is7DayMode = false; // 取消操作，恢复开关状态
									that.$nextTick(() => that.$forceUpdate())
								}
							}
						});
					}, 300);
				} else {
					setTimeout(() => {
						if (!uni.getStorageSync("jiance")) {
							uni.showToast({
								title: that.$t("请检查设备连接"),
								icon: 'none',
								duration: 2000
							})
							that.is7DayMode = true; // 取消操作，恢复开关状态
							that.$nextTick(() => that.$forceUpdate())
							return;
						}
						// 尝试关闭7天模式
						uni.showModal({
							title: that.$t('确认关闭'),
							content: that.$t('关闭天监测将启用自定义配置是否继续'),
							success: (res) => {
								if (res.confirm) {
									// 确认关闭
									this.is7DayMode = false;
									this.currentMode = 'custom';
									this.resetToDefault();
									this.saveConfigToStorage();
								} else {
									that.is7DayMode = true; // 取消操作，恢复开关状态
									that.$nextTick(() => that.$forceUpdate())
								}
							}
						});
					}, 300);
				}
			},

			set24HourMonitoring() {
				const items = [];
				items.push({
					index: 0,
					enabled: true,
					startTime: '06:00',
					endTime: '21:30',
					interval: 30,
					intervalIndex: this.getIntervalIndex(30),
					startHour: 6,
					startMinute: 0,
					endHour: 21,
					endMinute: 30
				});

				items.push({
					index: 1,
					enabled: true,
					startTime: '21:30',
					endTime: '06:00',
					interval: 60,
					intervalIndex: this.getIntervalIndex(60),
					startHour: 21,
					startMinute: 30,
					endHour: 6,
					endMinute: 0
				});

				this.config.items = items;
				this.config.maxCount = Math.max(this.config.maxCount, 2);
				this.is24HourMode = true;
				this.currentMode = '24h';
				this.saveConfigToStorage();
			},

			clickset(type) {
				uni.navigateTo({
					url: "../../main/globalweather/Personal_Information?type=" + type
				});
			},

			set7DayMonitoring() {
				const items = [];
				items.push({
					index: 0,
					enabled: true,
					startTime: '08:00',
					endTime: '22:00',
					interval: 210,
					intervalIndex: this.getIntervalIndex(210),
					startHour: 8,
					startMinute: 0,
					endHour: 22,
					endMinute: 0
				});

				this.config.items = items;
				this.config.maxCount = Math.max(this.config.maxCount, 1);
				this.is7DayMode = true;
				this.currentMode = '7d';
				this.saveConfigToStorage();
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
				this.currentMode = 'custom';
			},

			validateMaxCount() {
				let value = parseInt(this.config.maxCount, 10);
				if (isNaN(value) || value < 1) value = 1;
				if (value > 15) value = 15;
				this.config.maxCount = value;

				if (this.config.items.length > value) {
					this.config.items = this.config.items.slice(0, value);
					this.reindexItems();
				}
			},

			updateInterval(index, e) {
				if (this.is24HourMode || this.is7DayMode) return;
				const selectedIndex = e.detail.value;
				const intervalValue = this.getIntervalValue(selectedIndex);
				this.config.items[index].intervalIndex = selectedIndex;
				this.config.items[index].interval = intervalValue;
			},

			validateInterval(index) {
				const item = this.config.items[index];
				if (item.intervalIndex === undefined) {
					item.intervalIndex = this.getIntervalIndex(item.interval);
				}
			},

			validateConfig() {
				const timeRanges = [];
				for (const item of this.config.items) {
					if (!item.enabled) continue;

					let startMinutes = item.startHour * 60 + item.startMinute;
					let endMinutes = item.endHour * 60 + item.endMinute;

					if (endMinutes <= startMinutes) {
						endMinutes += 24 * 60;
					}

					timeRanges.push({
						index: item.index,
						start: startMinutes,
						end: endMinutes
					});
				}

				for (let i = 0; i < timeRanges.length; i++) {
					for (let j = i + 1; j < timeRanges.length; j++) {
						const a = timeRanges[i],
							b = timeRanges[j];
						if (Math.max(a.start, b.start) < Math.min(a.end, b.end)) {
							return false;
						}
					}
				}

				for (const item of this.config.items) {
					if (item.interval % 15 !== 0) {
						return false;
					}
				}

				return true;
			},

			reindexItems() {
				this.config.items.forEach((item, index) => {
					item.index = index;
				});
			},

			addTimerItem() {
				let that = this
				if (that.is24HourMode || that.is7DayMode) {
					uni.showToast({
						title: that.$t("请先关闭监测模式"),
						icon: 'none'
					});
					return;
				}
				if (that.config.items.length >= that.config.maxCount) {
					uni.showToast({
						title: that.$t("已达最大数量"),
						icon: 'none'
					});
					return;
				}

				const newIndex = that.config.items.length;
				const lastItem = that.config.items[newIndex - 1];
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
					defaultEndMinute = defaultStartMinute;
				}

				const defaultInterval = 30;
				const defaultIntervalIndex = that.getIntervalIndex(defaultInterval);

				that.config.items.push({
					index: newIndex,
					enabled: false,
					startTime: `${defaultStartHour.toString().padStart(2, '0')}:${defaultStartMinute.toString().padStart(2, '0')}`,
					endTime: `${defaultEndHour.toString().padStart(2, '0')}:${defaultEndMinute.toString().padStart(2, '0')}`,
					interval: defaultInterval,
					intervalIndex: defaultIntervalIndex,
					startHour: defaultStartHour,
					startMinute: defaultStartMinute,
					endHour: defaultEndHour,
					endMinute: defaultEndMinute
				});
				that.currentMode = 'custom';
			},

			removeTimerItem() {
				if (this.is24HourMode || this.is7DayMode) {
					uni.showToast({
						title: that.$t("请先关闭监测模式"),
						icon: 'none'
					});
					return;
				}
				if (this.config.items.length <= 0) return;
				this.config.items.pop();
				this.reindexItems();
			},

			toggleItem(index, value) {
				if (this.is24HourMode || this.is7DayMode) return;
				this.config.items[index].enabled = value;
				this.$forceUpdate()
				setTimeout(() => {
					if (!uni.getStorageSync("jiance")) {
						uni.showToast({
							title: this.$t("请检查设备连接"),
							icon: 'none',
							duration: 2000
						})
						if (this.config.items[index].enabled) {
							this.config.items[index].enabled = false;
						} else {
							this.config.items[index].enabled = true;
						}
						this.$forceUpdate();
						this.$nextTick(() => {
							this.$forceUpdate();
						});
					}
				}, 300);
			},

			updateStartTime(index, e) {
				if (this.is24HourMode || this.is7DayMode) return;
				const time = e.detail.value;
				this.config.items[index].startTime = time;
				const [hour, minute] = time.split(':').map(Number);
				this.config.items[index].startHour = hour;
				this.config.items[index].startMinute = minute;
				this.validateConfig();
			},

			updateEndTime(index, e) {
				if (this.is24HourMode || this.is7DayMode) return;
				const time = e.detail.value;
				this.config.items[index].endTime = time;
				const [hour, minute] = time.split(':').map(Number);
				this.config.items[index].endHour = hour;
				this.config.items[index].endMinute = minute;
				this.validateConfig();
			},

			sendConfig() {
				if (!this.validateConfig()) {
					uni.showToast({
						title: this.$t("配置验证失败"),
						icon: 'none'
					});
					return;
				}

				// 保存发送前的状态，用于失败时恢复
				this.saveStateBeforeSend();

				try {
					const timers = this.config.items.map(item => ({
						index: parseInt(item.index, 10),
						enabled: !!item.enabled,
						startHour: parseInt(item.startHour, 10),
						startMinute: parseInt(item.startMinute, 10),
						endHour: parseInt(item.endHour, 10),
						endMinute: parseInt(item.endMinute, 10),
						interval: parseInt(item.interval, 10)
					}));

					const packet = this.buildBloodPressureTimerPacket({
						maxTimers: parseInt(this.config.maxCount, 10),
						timers: timers
					});
					this.sendData(packet);
				} catch (e) {
					// 发生异常，恢复状态
					this.restoreStateOnFailure();
					uni.showToast({
						title: e.message,
						icon: 'none'
					});
				}
			},

			// 保存发送前的状态
			saveStateBeforeSend() {
				this.lastSentState = {
					is24HourMode: this.is24HourMode,
					is7DayMode: this.is7DayMode,
					currentMode: this.currentMode,
					items: JSON.parse(JSON.stringify(this.config.items)),
					maxCount: this.config.maxCount
				};
			},

			// 发送失败时恢复状态
			restoreStateOnFailure() {
				const lastState = this.lastSentState;
				// 恢复开关状态
				this.is24HourMode = lastState.is24HourMode;
				this.is7DayMode = lastState.is7DayMode;
				this.currentMode = lastState.currentMode;
				// 恢复配置数据
				this.config.items = lastState.items;
				this.config.maxCount = lastState.maxCount;
				// 强制刷新UI
				this.$forceUpdate();
				this.$nextTick(() => {
					this.$forceUpdate();
				});
			},

			buildBloodPressureTimerPacket(data) {
				const {
					buildBloodPressureTimerPacket
				} = require('../../../api/unitls/bluetooth/bloodPressureTimer.js');
				return buildBloodPressureTimerPacket(data);
			},

			saveConfigToStorage() {
				try {
					const configData = {
						maxCount: this.config.maxCount,
						items: this.config.items,
						is24HourMode: this.is24HourMode,
						is7DayMode: this.is7DayMode,
						currentMode: this.currentMode
					};
					uni.setStorageSync(STORAGE_KEY, configData);
				} catch (e) {
					console.log('保存配置失败:', e);
				}
			},

			loadConfigFromStorage() {
				try {
					const configData = uni.getStorageSync(STORAGE_KEY);
					if (configData) {
						this.config.maxCount = configData.maxCount || 3;
						this.is24HourMode = configData.is24HourMode || false;
						this.is7DayMode = configData.is7DayMode || false;
						this.currentMode = configData.currentMode || 'custom';

						if (configData.items && configData.items.length > 0) {
							this.config.items = configData.items.map(item => ({
								...item,
								intervalIndex: item.intervalIndex !== undefined ? item.intervalIndex : this
									.getIntervalIndex(item.interval)
							}));
						} else {
							this.resetToDefault();
						}
					} else {
						this.resetToDefault();
					}
				} catch (e) {
					this.resetToDefault();
				}
			},

			sendData(packet) {
				let that = this;
				that.sending = true;
				const MTU = 20;
				if (packet.length <= MTU) {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
						characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
						value: packet.buffer || packet,
						success: (succ) => {
							that.sending = false;
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							});
							that.saveConfigToStorage();
						},
						fail: (err) => {
							that.sending = false;
							// 发送失败，恢复原状态
							that.restoreStateOnFailure();
							uni.showToast({
								title: that.$t("失败"),
								icon: 'none'
							});
						}
					});
					return;
				}
				// 分包发送逻辑...
				const packets = [];
				for (let i = 0; i < packet.length; i += MTU) {
					const end = Math.min(i + MTU, packet.length);
					packets.push(packet.slice(i, end));
				}
				let index = 0;
				const sendNextPacket = () => {
					if (index >= packets.length) {
						that.sending = false;
						uni.showToast({
							title: that.$t("成功"),
							icon: 'none'
						});
						that.saveConfigToStorage();
						return;
					}
					const currentPacket = packets[index];
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
						characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
						value: currentPacket.buffer || currentPacket,
						success: () => {
							index++;
							setTimeout(sendNextPacket, 100);
						},
						fail: (err) => {
							that.sending = false;
							// 发送失败，恢复原状态
							that.restoreStateOnFailure();
							uni.showToast({
								title: that.$t("失败"),
								icon: 'none'
							});
						}
					});
				};
				sendNextPacket();
			},
		},
	};
</script>

<style>
	.container {
		padding: 20px 20px 100px 20px;
		background-color: #f5f5f5;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.section {
		background-color: white;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		color: #333;
		border-left: 8rpx solid #007AFF;
		padding-left: 20rpx;
	}

	/* 模式开关统一样式 */
	.mode-switch-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 25rpx 20rpx;
		border-radius: 12rpx;
		margin-bottom: 15rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s;
	}

	/* 24小时监测样式 - 蓝色主题 */
	.mode-switch-row:not(.mode-switch-7d) {
		background-color: #f0f8ff;
		border-color: #007AFF;
	}

	.mode-switch-row:not(.mode-switch-7d).active {
		background-color: #e6f7ff;
		border-color: #0056b3;
		box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
	}

	/* 7天监测样式 - 绿色主题 */
	.mode-switch-7d {
		background-color: #f6ffed;
		border-color: #52C41A;
	}

	.mode-switch-7d.active {
		background-color: #d9f7be;
		border-color: #389e0d;
		box-shadow: 0 4rpx 12rpx rgba(82, 196, 26, 0.3);
	}

	.mode-label {
		font-size: 32rpx;
		font-weight: bold;
	}

	.mode-switch-row:not(.mode-switch-7d) .mode-label {
		color: #007AFF;
	}

	.mode-switch-7d .mode-label {
		color: #52C41A;
	}

	.mode-hint {
		font-size: 24rpx;
		margin-bottom: 20rpx;
		display: block;
		text-align: center;
		font-weight: 500;
	}

	.mode-hint-24h {
		color: #007AFF;
	}

	.mode-hint-7d {
		color: #52C41A;
	}

	/* 禁用状态样式 */
	.disabled-item {
		opacity: 0.5;
		background-color: #f5f5f5;
		pointer-events: none;
	}

	.picker-disabled {
		background-color: #e0e0e0;
		color: #999;
	}

	.timer-item {
		border: 1rpx solid #eee;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-top: 10px;
		margin-bottom: 20rpx;
		background-color: #fafafa;
		transition: all 0.3s;
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
		padding-left: 20rpx;
	}

	.time-row {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
		flex-wrap: wrap;
	}

	.time-picker,
	.interval-picker {
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		margin-left: 20rpx;
		min-width: 200rpx;
		text-align: center;
		background-color: white;
		font-size: 28rpx;
	}

	.button-row {
		display: flex;
		justify-content: space-around;
		margin: 30rpx 0;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		margin-top: 30px;
	}

	button {
		margin: 0 10rpx;
		font-size: 28rpx;
	}

	button[type="primary"] {
		background-color: #007AFF;
		width: 80%;
	}

	button[type="primary"][disabled] {
		background-color: #ccc;
	}

	/* 快捷按钮统一样式 */
	.buttonstyle {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 96rpx;
		margin: 30rpx 20rpx;
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

	.buttonstyle[disabled] {
		background: #cccccc;
		box-shadow: none;
	}

	/* 当前模式信息展示 */
	.mode-info {
		border: 2rpx solid;
	}

	.mode-24h {
		background-color: #e6f7ff;
		border-color: #91d5ff;
	}

	.mode-24h .section-title {
		border-left-color: #007AFF;
	}

	.mode-7d {
		background-color: #f6ffed;
		border-color: #b7eb8f;
	}

	.mode-7d .section-title {
		border-left-color: #52C41A;
	}

	.mode-text {
		font-size: 32rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 15rpx;
	}

	.mode-24h .mode-text {
		color: #007AFF;
	}

	.mode-7d .mode-text {
		color: #52C41A;
	}

	.mode-item {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
		padding: 15rpx;
		background-color: white;
		border-radius: 8rpx;
		border-left: 4rpx solid #ddd;
	}

	.mode-24h .mode-item {
		border-left-color: #007AFF;
	}

	.mode-7d .mode-item {
		border-left-color: #52C41A;
	}
</style>