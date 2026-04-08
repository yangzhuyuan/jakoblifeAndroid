<template>
	<view class="container">
		<view class="header">
			<text class="title">血压定时监测工具</text>
		</view>

		<!-- 蓝牙连接状态 -->
		<view class="section">
			<view class="section-title">蓝牙连接</view>
			<view class="status-row">
				<text>连接状态：</text>
				<text :class="connected ? 'status-connected' : 'status-disconnected'">
					{{ connected ? '已连接' : '未连接' }}
				</text>
			</view>
			<button :type="connected ? 'warn' : 'primary'" @click="toggleBluetooth" :disabled="scanning">
				{{ connected ? '断开连接' : (scanning ? '扫描中...' : '连接设备') }}
			</button>
		</view>

		<!-- 设备列表（扫描时显示） -->
		<view class="section" v-if="scanning && devices.length > 0">
			<view class="section-title">选择设备</view>
			<view class="device-item" v-for="device in devices" :key="device.deviceId" @click="connectDevice(device)">
				<text>{{ device.name || '未知设备' }}</text>
				<text class="device-id">{{ device.deviceId }}</text>
			</view>
		</view>

		<!-- 参数配置 -->
		<view class="section" v-if="connected">
			<view class="section-title">定时监测参数</view>

			<!-- 最大数量配置 -->
			<view class="param-row">
				<text>最大数量：</text>
				<input type="number" v-model.number="config.maxCount" class="param-input" min="1" max="15"
					@blur="validateMaxCount" />
				<text class="param-hint">(1-15)</text>
			</view>

			<!-- 定时项列表 -->
			<view v-for="(item, index) in config.items" :key="index" class="timer-item">
				<view class="item-header">
					<text>定时项 {{ index + 1 }}</text>
					<switch :checked="item.enabled" @change="e => toggleItem(index, e.detail.value)" />
				</view>

				<view class="item-content">
					<view class="time-row">
						<text>开始：</text>
						<picker mode="time" :value="item.startTime" @change="e => updateStartTime(index, e)">
							<view class="time-picker">{{ item.startTime }}</view>
						</picker>
					</view>

					<view class="time-row">
						<text>结束：</text>
						<picker mode="time" :value="item.endTime" @change="e => updateEndTime(index, e)">
							<view class="time-picker">{{ item.endTime }}</view>
						</picker>
					</view>

					<view class="time-row">
						<text>间隔：</text>
						<input type="number" v-model.number="item.interval" class="interval-input" min="1" max="3825"
							step="1" />
						<text>分钟 (15的倍数)</text>
					</view>

					<view class="time-row" v-if="item.interval % 15 !== 0">
						<text class="warning-text">间隔必须是15的倍数</text>
					</view>
				</view>
			</view>

			<!-- 添加/删除按钮 -->
			<view class="button-row">
				<button type="default" size="mini" @click="addTimerItem"
					:disabled="config.items.length >= config.maxCount">
					添加
				</button>
				<button type="default" size="mini" @click="removeTimerItem" :disabled="config.items.length <= 0">
					删除
				</button>
				<button type="default" size="mini" @click="resetToDefault" :disabled="config.items.length === 0">
					重置
				</button>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<button type="primary" @click="sendConfig" :disabled="sending || !validateConfig()">
					{{ sending ? '发送中...' : '下发配置' }}
				</button>
				<button type="default" @click="readConfig" :disabled="reading">
					{{ reading ? '读取中...' : '读取配置' }}
				</button>
			</view>
		</view>

		<!-- 解析结果显示 -->
		<view class="section" v-if="parsedResult">
			<view class="section-title">解析结果</view>
			<view class="result-content">
				<text>最大数量：{{ parsedResult.maxTimers }}</text>
				<text>当前数量：{{ parsedResult.currentCount }}</text>
				<view v-for="(item, index) in parsedResult.timers" :key="index" class="result-item">
					<view class="result-item-left">
						<text>项{{ index + 1 }} (索引{{ item.index }}): </text>
						<text>{{ item.startHour.toString().padStart(2, '0') }}:{{ item.startMinute.toString().padStart(2, '0') }}
							-
							{{ item.endHour.toString().padStart(2, '0') }}:{{ item.endMinute.toString().padStart(2, '0') }}</text>
						<text>，间隔{{ item.interval }}分钟</text>
					</view>
					<text :class="item.enabled ? 'enabled' : 'disabled'">
						{{ item.enabled ? '开启' : '关闭' }}
					</text>
				</view>
			</view>
		</view>

		<!-- 日志显示 -->
		<view class="section log-section">
			<view class="section-title">操作日志</view>
			<scroll-view scroll-y class="log-content">
				<view v-for="(log, index) in logs" :key="index" class="log-item">
					<text class="log-time">{{ log.time }}</text>
					<text :class="log.type">{{ log.message }}</text>
				</view>
			</scroll-view>
			<button type="default" size="mini" @click="clearLogs">清空日志</button>
		</view>
	</view>
</template>

<script>
	import {
		calculateChecksum,
		verifyChecksum,
		buildPacket,
		parsePacket,
		buildLengthField,
		extractLength
	} from '../../../api/unitls/bluetooth/checksum.js';

	import {
		buildBloodPressureTimerPacket,
		parseBloodPressureTimerResponse,
		buildBloodPressureTimerExtPacket
	} from '../../../api/unitls/bluetooth/bloodPressureTimer.js';

	export default {
		data() {
			return {
				connected: true,
				scanning: false,
				sending: false,
				reading: false,
				deviceId: '41:42:C8:77:08:9F',
				// 手表蓝牙服务UUID
				serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB', // 示例服务UUID，需要根据实际设备修改
				writeCharId: '0000FFE1-0000-1000-8000-00805F9B34FB', // 示例写特征UUID
				notifyCharId: '0000FFE1-0000-1000-8000-00805F9B34FB', // 示例通知特征UUID
				devices: [],
				config: {
					maxCount: 1, // 默认最大数量
					items: []
				},
				parsedResult: null,
				logs: []
			};
		},

		created() {
			// 初始化默认项
			this.resetToDefault();
		},

		methods: {
			// 添加日志
			addLog(message, type = 'info') {
				const now = new Date();
				const timeStr =
					`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
				this.logs.unshift({
					time: timeStr,
					message,
					type
				});

				// 限制日志数量
				if (this.logs.length > 100) {
					this.logs.pop();
				}
			},
			// 清空日志
			clearLogs() {
				this.logs = [];
			},
			// 重置为默认配置
			resetToDefault() {
				this.config.items = [{
					index: 0,
					enabled: true,
					startTime: '08:00',
					endTime: '22:00',
					interval: 30,
					startHour: 8,
					startMinute: 0,
					endHour: 12,
					endMinute: 0
				}, ];
				this.config.maxCount = 1;
			},

			// 验证最大数量
			validateMaxCount() {
				let value = this.config.maxCount;
				if (isNaN(value) || value < 1) value = 1;
				if (value > 15) value = 15;
				this.config.maxCount = value;

				// 如果当前项数超过新最大值，截断
				if (this.config.items.length > value) {
					this.config.items = this.config.items.slice(0, value);
					// 重新索引
					this.reindexItems();
				}
			},

			// 验证间隔时间
			validateInterval(index) {
				let value = this.config.items[index].interval;
				if (isNaN(value) || value < 15) value = 15;
				if (value > 3825) value = 3825;
				// 确保是15的倍数
				value = Math.round(value / 15) * 15;
				this.config.items[index].interval = value;
			},

			// 验证整个配置
			validateConfig() {
				// 检查是否有重叠时间段
				const timeRanges = [];
				for (const item of this.config.items) {
					if (!item.enabled) continue; // 只检查开启的项

					const startMinutes = item.startHour * 60 + item.startMinute;
					const endMinutes = item.endHour * 60 + item.endMinute;

					if (endMinutes <= startMinutes) {
						this.addLog(`项${item.index + 1}的结束时间必须大于开始时间`, 'error');
						return false;
					}

					timeRanges.push({
						index: item.index,
						start: startMinutes,
						end: endMinutes
					});
				}

				// 检查时间段重合
				for (let i = 0; i < timeRanges.length; i++) {
					for (let j = i + 1; j < timeRanges.length; j++) {
						const a = timeRanges[i];
						const b = timeRanges[j];

						if (Math.max(a.start, b.start) < Math.min(a.end, b.end)) {
							this.addLog(`时间段重合：项${a.index + 1}和项${b.index + 1}的时间段有重叠`, 'error');
							return false;
						}
					}
				}

				// 检查间隔是否是15的倍数
				for (const item of this.config.items) {
					if (item.interval % 15 !== 0) {
						this.addLog(`项${item.index + 1}的间隔必须是15的倍数`, 'error');
						return false;
					}
				}

				return true;
			},

			// 重新索引项
			reindexItems() {
				this.config.items.forEach((item, index) => {
					item.index = index;
				});
			},

			// 添加定时项
			addTimerItem() {
				if (this.config.items.length >= this.config.maxCount) {
					uni.showToast({
						title: '已达最大数量',
						icon: 'none'
					});
					return;
				}

				const newIndex = this.config.items.length;
				// 计算默认时间（基于上一个项的结束时间）
				const lastItem = this.config.items[newIndex - 1];
				let defaultStartHour = 8;
				let defaultStartMinute = 0;
				let defaultEndHour = 20;
				let defaultEndMinute = 0;

				if (lastItem) {
					// 设置为上一个项的结束时间 + 1小时
					let lastEndMinutes = lastItem.endHour * 60 + lastItem.endMinute + 60;
					if (lastEndMinutes >= 24 * 60) {
						lastEndMinutes = 8 * 60; // 如果超过24小时，重置到早上8点
					}
					defaultStartHour = Math.floor(lastEndMinutes / 60);
					defaultStartMinute = lastEndMinutes % 60;
					defaultEndHour = Math.min(defaultStartHour + 4, 23);
					defaultEndMinute = defaultStartMinute;
				}

				this.config.items.push({
					index: newIndex,
					enabled: true,
					startTime: `${defaultStartHour.toString().padStart(2, '0')}:${defaultStartMinute.toString().padStart(2, '0')}`,
					endTime: `${defaultEndHour.toString().padStart(2, '0')}:${defaultEndMinute.toString().padStart(2, '0')}`,
					interval: 30,
					startHour: defaultStartHour,
					startMinute: defaultStartMinute,
					endHour: defaultEndHour,
					endMinute: defaultEndMinute
				});

				console.log('添加定时项:', this.config.items[this.config.items.length - 1]);

			},

			// 删除定时项
			removeTimerItem() {
				if (this.config.items.length <= 0) return;
				this.config.items.pop();

				// 重新索引
				this.reindexItems();
			},

			// 切换开关
			toggleItem(index, value) {
				this.config.items[index].enabled = value;
			},

			// 更新开始时间
			updateStartTime(index, e) {
				const time = e.detail.value;
				this.config.items[index].startTime = time;
				const [hour, minute] = time.split(':').map(Number);
				this.config.items[index].startHour = hour;
				this.config.items[index].startMinute = minute;

				// 自动验证
				this.validateConfig();
			},

			// 更新结束时间
			updateEndTime(index, e) {
				const time = e.detail.value;
				this.config.items[index].endTime = time;
				const [hour, minute] = time.split(':').map(Number);
				this.config.items[index].endHour = hour;
				this.config.items[index].endMinute = minute;

				// 自动验证
				this.validateConfig();
			},

			// 切换蓝牙连接
			toggleBluetooth() {
				if (this.connected) {
					this.disconnectDevice();
				} else {
					this.startScan();
				}
			},

			// 开始扫描
			startScan() {
				this.scanning = true;
				this.devices = [];

				uni.openBluetoothAdapter({
					success: () => {
						this.addLog('蓝牙适配器初始化成功');
						this.startBluetoothDevicesDiscovery();
					},
					fail: (err) => {
						this.addLog(`蓝牙适配器初始化失败: ${JSON.stringify(err)}`, 'error');
						this.scanning = false;
					}
				});
			},

			// 开始发现设备
			startBluetoothDevicesDiscovery() {
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: false,
					success: () => {
						this.addLog('开始扫描设备');
						this.onBluetoothDeviceFound();
					},
					fail: (err) => {
						this.addLog(`开始扫描失败: ${JSON.stringify(err)}`, 'error');
						this.scanning = false;
					}
				});
			},

			// 监听设备发现
			onBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound((res) => {
					const devices = res.devices;
					for (let device of devices) {
						// 显示所有设备，让用户选择
						if (device.name && device.name.includes('WATCH')) { // 根据实际情况过滤
							if (!this.devices.find(d => d.deviceId === device.deviceId)) {
								this.devices.push(device);
								this.addLog(`发现设备: ${device.name || '未知'} - ${device.deviceId}`);
							}
						} else if (this.devices.length < 10) {
							// 如果没有找到匹配的设备，显示前10个设备供选择
							if (!this.devices.find(d => d.deviceId === device.deviceId)) {
								this.devices.push(device);
								this.addLog(`发现设备: ${device.name || '未知'} - ${device.deviceId}`);
							}
						}
					}
				});
			},

			// 连接设备
			connectDevice(device) {
				this.scanning = false;
				uni.stopBluetoothDevicesDiscovery({});

				uni.showLoading({
					title: '连接中...'
				});

				uni.createBLEConnection({
					deviceId: device.deviceId,
					success: () => {
						this.deviceId = device.deviceId;
						this.connected = true;
						this.addLog(`连接成功: ${device.name || device.deviceId}`);
						uni.hideLoading();
						this.getServices();
					},
					fail: (err) => {
						this.addLog(`连接失败: ${JSON.stringify(err)}`, 'error');
						uni.hideLoading();
						this.scanning = false;
					}
				});
			},

			// 获取服务
			getServices() {
				uni.getBLEDeviceServices({
					deviceId: this.deviceId,
					success: (res) => {
						this.addLog('获取服务成功');
						// 查找匹配的服务
						const services = res.services;
						for (let service of services) {
							if (service.uuid.toUpperCase().includes('FFE0')) {
								this.serviceId = service.uuid;
								this.addLog(`使用服务: ${this.serviceId}`);
								break;
							}
						}
						this.getCharacteristics();
					},
					fail: (err) => {
						this.addLog(`获取服务失败: ${JSON.stringify(err)}`, 'error');
					}
				});
			},

			// 获取特征值
			getCharacteristics() {
				uni.getBLEDeviceCharacteristics({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					success: (res) => {
						this.addLog('获取特征值成功');
						// 查找写特征和通知特征
						const characteristics = res.characteristics;
						for (let char of characteristics) {
							if (char.properties.write && !this.writeCharId) {
								this.writeCharId = char.uuid;
								this.addLog(`写特征: ${this.writeCharId}`);
							}
							if (char.properties.notify && !this.notifyCharId) {
								this.notifyCharId = char.uuid;
								this.addLog(`通知特征: ${this.notifyCharId}`);
							}
						}
						this.enableNotify();
					},
					fail: (err) => {
						this.addLog(`获取特征值失败: ${JSON.stringify(err)}`, 'error');
					}
				});
			},

			// 启用通知
			enableNotify() {
				uni.notifyBLECharacteristicValueChange({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.notifyCharId,
					state: true,
					success: () => {
						this.addLog('启用通知成功');
						this.onCharacteristicValueChange();
					},
					fail: (err) => {
						this.addLog(`启用通知失败: ${JSON.stringify(err)}`, 'error');
					}
				});
			},

			// 监听特征值变化
			onCharacteristicValueChange() {
				uni.onBLECharacteristicValueChange((res) => {
					if (res.characteristicId === this.notifyCharId) {
						this.handleReceivedData(res.value);
					}
				});
			},

			// 处理接收到的数据
			handleReceivedData(buffer) {
				const data = new Uint8Array(buffer);
				this.addLog(`收到数据: ${this.arrayToHex(data)}`);

				try {
					// 验证校验位
					if (!verifyChecksum(data)) {
						this.addLog('校验位验证失败', 'error');
						return;
					}

					// 解析协议包
					const parsed = parsePacket(data);
					this.addLog(`解析协议: CMD=0x${parsed.cmd.toString(16)}, KEY=0x${parsed.key.toString(16)}`);

					if (parsed.cmd === 0x03 && parsed.key === 0x21) {
						// 固件返回的血压定时监测数据
						const result = parseBloodPressureTimerResponse(parsed.keyValue);
						this.parsedResult = result;
						this.addLog(`解析成功: 最大${result.maxTimers}项, 当前${result.currentCount}项`);

						// 更新UI配置
						this.config.maxCount = result.maxTimers;
						// 这里可以根据需要更新items
					} else if (parsed.cmd === 0x03 && parsed.key === 0x22) {
						// 扩展指令响应
						this.addLog(`收到扩展指令响应: ${this.arrayToHex(parsed.keyValue)}`);
					}
				} catch (e) {
					this.addLog(`解析失败: ${e.message}`, 'error');
				}
			},

			// 发送配置
			sendConfig() {
				if (!this.validateConfig()) {
					uni.showToast({
						title: '配置验证失败',
						icon: 'none'
					});
					return;
				}

				try {
					// 构建定时监测项数组
					const timers = this.config.items.map(item => ({
						index: item.index,
						enabled: item.enabled,
						startHour: item.startHour,
						startMinute: item.startMinute,
						endHour: item.endHour,
						endMinute: item.endMinute,
						interval: 15
					}));

					// 构建协议包
					const packet = buildBloodPressureTimerPacket({
						maxTimers: this.config.maxCount,
						timers: timers
					});
					console.log('1发送数据包:', timers);
					console.log('发送数据包:', this.arrayToHex(packet));
					this.addLog(`构建数据: ${this.arrayToHex(packet)}`);
					this.sendData(packet);
				} catch (e) {
					this.addLog(`构建失败: ${e.message}`, 'error');
					uni.showToast({
						title: e.message,
						icon: 'none'
					});
				}
			},

			// 读取配置
			readConfig() {
				try {
					// 发送读取命令，KeyValue为空
					const packet = buildPacket(0x03, 0x22, new Uint8Array(0));
					this.addLog(`读取配置: ${this.arrayToHex(packet)}`);
					this.sendData(packet);
				} catch (e) {
					this.addLog(`读取失败: ${e.message}`, 'error');
				}
			},

			// 发送数据
			sendData(packet) {
				if (!this.deviceId) {
					this.addLog('设备未连接', 'error');
					return;
				}

				this.sending = true;
				this.addLog(`发送数据: ${this.arrayToHex(packet)}`);

				uni.writeBLECharacteristicValue({
					deviceId: "41:42:C8:77:08:9F",
					serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
					characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
					value: packet.buffer,
					success: () => {
						this.addLog('发送成功');
						this.sending = false;
					},
					fail: (err) => {
						this.addLog(`发送失败: ${JSON.stringify(err)}`, 'error');
						this.sending = false;
					}
				});
			},

			// 断开连接
			disconnectDevice() {
				if (!this.deviceId) return;

				uni.closeBLEConnection({
					deviceId: this.deviceId,
					success: () => {
						this.connected = false;
						this.deviceId = '';
						this.addLog('已断开连接');
					}
				});
			},

			// 数组转十六进制字符串
			arrayToHex(array) {
				return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
			}
		},

		beforeDestroy() {
			// 清理资源
			if (this.connected) {
				this.disconnectDevice();
			}
			uni.stopBluetoothDevicesDiscovery({});
			uni.closeBluetoothAdapter({});
		}
	};
</script>

<style>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.header {
		background-color: #007AFF;
		color: white;
		padding: 30rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
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

	.status-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.status-connected {
		color: #4CD964;
		font-weight: bold;
	}

	.status-disconnected {
		color: #FF3B30;
		font-weight: bold;
	}

	.device-item {
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
		display: flex;
		flex-direction: column;
		cursor: pointer;
	}

	.device-item:active {
		background-color: #f0f0f0;
	}

	.device-id {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.param-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
	}

	.param-input {
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		margin-left: 20rpx;
		width: 120rpx;
		text-align: center;
	}

	.param-hint {
		font-size: 24rpx;
		color: #999;
		margin-left: 20rpx;
	}

	.timer-item {
		border: 1rpx solid #eee;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		background-color: #fafafa;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
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

	.time-picker {
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		margin-left: 20rpx;
		min-width: 150rpx;
		text-align: center;
		background-color: white;
	}

	.interval-input {
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		margin: 0 20rpx;
		width: 100rpx;
		text-align: center;
		background-color: white;
	}

	.warning-text {
		color: #FF3B30;
		font-size: 24rpx;
		margin-left: 20rpx;
	}

	.button-row {
		display: flex;
		justify-content: space-around;
		margin: 30rpx 0;
	}

	.action-buttons {
		display: flex;
		justify-content: space-around;
		margin-top: 30rpx;
	}

	.result-content {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15rpx;
		background-color: #f8f8f8;
		border-radius: 8rpx;
		flex-wrap: wrap;
	}

	.result-item-left {
		flex: 1;
	}

	.enabled {
		color: #4CD964;
		font-weight: bold;
	}

	.disabled {
		color: #FF3B30;
		font-weight: bold;
	}

	.log-section {
		height: 400rpx;
		display: flex;
		flex-direction: column;
	}

	.log-content {
		flex: 1;
		margin-bottom: 20rpx;
		background-color: #f8f8f8;
		border-radius: 12rpx;
		padding: 20rpx;
	}

	.log-item {
		margin-bottom: 10rpx;
		font-size: 24rpx;
		display: flex;
		align-items: flex-start;
		word-break: break-all;
	}

	.log-time {
		color: #999;
		margin-right: 20rpx;
		min-width: 140rpx;
		flex-shrink: 0;
	}

	.log-item .info {
		color: #333;
	}

	.log-item .error {
		color: #FF3B30;
	}

	button {
		margin: 0 10rpx;
		font-size: 28rpx;
	}

	button[type="primary"] {
		background-color: #007AFF;
	}

	button[type="primary"][disabled] {
		background-color: #ccc;
	}
</style>