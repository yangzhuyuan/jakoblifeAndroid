<template>
	<view class="page">
		<view class="ecg-container"><ecg-wave ref="wave" /></view>

		<view class="control-panel">
			<view class="status-row">
				<view class="status-indicator" :class="{ connected: connected }" />
				<text class="status-text">{{ connected ? '血压计已连接' : '血压计未连接' }}</text>
				<text class="data-source">{{ dataSource }}</text>
			</view>

			<view class="button-row">
				<button class="btn primary" @tap="toggleConnect" :loading="connecting" :disabled="connecting">
					{{ connected ? '断开' : '连接血压计并开始测量' }}
				</button>
				<button class="btn warn" @tap="sendStop" v-if="connected">停止测量</button>
				<button class="btn secondary" @tap="showFullWaveform" :disabled="!hasMeasurementData">完整波形</button>
				<button class="btn secondary" @tap="clearWave">清空波形</button>
				<button class="btn secondary" @tap="toggleStats">{{ statsVisible ? '隐藏' : '显示' }}信息</button>
			</view>

			<text class="tip">{{ tip }}</text>
		</view>

		<view class="stats-panel" v-if="statsVisible">
			<view class="stats-row">
				<text class="stats-label">实时数据点数:</text>
				<text class="stats-value">{{ dataCount.toLocaleString() }}</text>
			</view>
			<view class="stats-row">
				<text class="stats-label">完整数据点数:</text>
				<text class="stats-value">{{ fullDataCount.toLocaleString() }}</text>
			</view>
			<view class="stats-row">
				<text class="stats-label">队列长度:</text>
				<text class="stats-value">{{ queueLength }}</text>
			</view>
			<view class="stats-row" v-if="measurementStatus">
				<text class="stats-label">测量状态:</text>
				<text class="stats-value">{{ measurementStatus }}</text>
			</view>
		</view>
	</view>
</template>
<script>
	import ecgWave from "../../components/ecg-wave/ecg-wave.vue";

	const SERVICE_ID = '0000FF00-0000-1000-8000-00805F9B34FB'
	const NOTIFY_UUID = '0000FF02-0000-1000-8000-00805F9B34FB'
	const CMD_ECG_START = [0xA5, 0x12, 0x01, 0x13, 0x0A]
	const CMD_ECG_STOP = [0xA5, 0x16, 0x01, 0x17, 0x0A]

	export default {
		components: {
			ecgWave
		},
		data() {
			return {
				connected: false,
				connecting: false,
				tip: '点击"连接血压计"开始',
				dataCount: 0,
				fullDataCount: 0,
				statsVisible: true,
				dataSource: '未连接',
				queueLength: 0,
				deviceId: '',
				notifyCharacteristicId: '',
				writeCharacteristicId: '',
				buffer: '',
				sendCnt: 0,
				measurementStatus: '', // 测量状态
			}
		},
		onUnload() {
			this.disConnect()
		},
		computed: {
			// 计算是否有测量数据
			hasMeasurementData() {
				return this.fullDataCount > 0;
			}
		},
		methods: {
			/* ==================== 新增方法 ==================== */

			// 显示完整波形
			showFullWaveform() {
				if (this.hasMeasurementData) {
					this.$refs.wave.showFullWave();
					this.tip = '显示完整测量波形，可使用放大缩小功能查看细节';
				} else {
					uni.showToast({
						title: '暂无测量数据',
						icon: 'none'
					});
				}
			},

			// 清空波形数据
			clearWave() {
				this.$refs.wave.clear();
				this.dataCount = 0;
				this.fullDataCount = 0;
				this.queueLength = 0;
				this.measurementStatus = '';
				this.tip = '数据已清空';
			},
			/* ==================== 主流程 ==================== */
			async toggleConnect() {
				if (this.connected) {
					await this.disConnect();
					return
				}
				this.connecting = true;
				this.tip = '初始化适配器...'
				try {
					await this.openAdapter()
					await this.startDiscovery()
					const dev = await this.findDevice()
					await this.connectDevice(dev.deviceId)
					await this.openNotifyAndWrite() // 一次性搞定 notify + write
					// await this.sendEcgStart() // 发 3 帧
					this.tip = '等待血压计开始...';
					this.dataSource = '血压计'
				} catch (e) {
					this.tip = '失败：' + (e.errMsg || e.message);
					this.connected = false
				} finally {
					this.connecting = false
				}
			},

			/* -------------------- 蓝牙底层 -------------------- */
			openAdapter() {
				return new Promise((resolve, reject) =>
					uni.openBluetoothAdapter({
						success: resolve,
						fail: reject
					}))
			},
			startDiscovery() {
				return new Promise((resolve, reject) =>
					uni.startBluetoothDevicesDiscovery({
						services: [SERVICE_ID],
						success: () => setTimeout(resolve, 800),
						fail: reject
					}))
			},
			findDevice() {
				return new Promise((resolve, reject) =>
					uni.getBluetoothDevices({
						success: res => {
							const dev = res.devices.find(d => d.name === 'BP68W' || d.localName === 'BP68W')
							dev ? resolve(dev) : reject(new Error('未发现 BP68W'))
						},
						fail: reject
					}))
			},
			connectDevice(deviceId) {
				return new Promise((resolve, reject) =>
					uni.createBLEConnection({
						deviceId,
						success: () => {
							this.deviceId = deviceId;
							this.connected = true;
							resolve()
						},
						fail: reject
					}))
			},
			openNotifyAndWrite() {
				setTimeout(() => {
					this.getBLEDeviceServices(this.deviceId);
				}, 1000);
			},

			getBLEDeviceServices(deviceId) {
				let that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						console.log("res.services", res.services)
						switch (res.services.length) {
							case 3:
								that.getBLEDeviceCharacteristics1(deviceId, res.services[2].uuid)
								break
						}

					},
					fail(res) {}
				})
			},
			getBLEDeviceCharacteristics1(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						console.log(res)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知
							if (item.properties.write) {
								console.log("deviceId", deviceId)
								console.log("serviceId", serviceId)
								console.log("characteristicId", item.uuid)
								setTimeout(() => {
									this.sendCnt = 0
									that.send(deviceId, serviceId, item.uuid)
								}, 2000)

							}
							if (item.properties.notify) {
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										let rxBuf = ''; // 剩余未处理十六进制字符串
										uni.onBLECharacteristicValueChange((res) => {
											const dataList = that.ab2hex(res.value)
											console.log("蓝牙返回的的数据：", dataList)
											this.buffer += this.ab2hex(res.value)
											this.tryParse()
										})
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
			},
			send(deviceId, serviceId, writeCharId) {
				const hex = 'A51201130A';
				if (this.sendCnt >= 3) {
					this.sendCnt = 0; // 重置，方便下次再发
					return;
				}
				this.sendCnt++;

				uni.writeBLECharacteristicValue({
					deviceId,
					serviceId,
					characteristicId: writeCharId,
					writeType: 'writeNoResponse',
					value: this.toArrayBuffer(hex),
					success: () => {
						console.log(`第${this.sendCnt}次写入成功`);
						setTimeout(() => this.send(deviceId, serviceId, writeCharId), 50);
					},
					fail: e => console.error(`第${this.sendCnt}次写入失败`, e)
				});
			},
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
			sleep(ms) {
				return new Promise(resolve => setTimeout(resolve, ms))
			},

			ab2hex(buffer) {
				return Array.prototype.map.call(
					new Uint8Array(buffer),
					b => ('00' + b.toString(16)).slice(-2)
				).join('')
			},
			getServices(deviceId) {
				return new Promise((resolve, reject) =>
					uni.getBLEDeviceServices({
						deviceId,
						success: res => {
							console.log("res.services", res.services)
							resolve(res.services)
						},
						fail: reject
					}))
			},
			getCharacteristics(deviceId, serviceId) {
				return new Promise((resolve, reject) =>
					uni.getBLEDeviceCharacteristics({
						deviceId,
						serviceId,
						success: res => {
							console.log("res.characteristics", res.characteristics)
							resolve(res.characteristics)
						},
						fail: reject
					}))
			},
			enableNotify(deviceId, serviceId, characteristicId) {
				return new Promise((resolve, reject) =>
					uni.notifyBLECharacteristicValueChange({
						deviceId,
						serviceId,
						characteristicId,
						state: true,
						success: resolve,
						fail: reject
					}))
			},

			/* ==================== 协议层 ==================== */
			async sendEcgStart() {
				for (let i = 0; i < 3; i++) {
					if (i) await new Promise(r => setTimeout(r, 50))
					await this.writeCmd(CMD_ECG_START)
				}
			},
			sendStop() {
				this.writeCmd(CMD_ECG_STOP).then(() => this.tip = '已发送停止命令')
			},
			writeCmd(cmd) {
				return new Promise((resolve, reject) =>
					uni.writeBLECharacteristicValue({
						deviceId: this.deviceId,
						serviceId: SERVICE_ID,
						characteristicId: "0000FF01-0000-1000-8000-00805F9B34FB", // 动态拿到的
						value: new Uint8Array(cmd).buffer,
						writeType: 'writeNoResponse',
						success: resolve,
						fail: (e) => {
							console.error('write fail', e)
							reject(e)
						}
					}))
			},

			/* 分包拼接解析 */
			tryParse() {
				while (true) {
					const idx = this.buffer.indexOf('0a')
					if (idx === -1) break
					const frameHex = this.buffer.slice(0, idx + 2)
					this.buffer = this.buffer.slice(idx + 2)
					const frame = new Uint8Array(frameHex.match(/.{2}/g).map(b => parseInt(b, 16)))
					if (frame.length < 5) continue
					const head = frame[0]
					if (head === 0x23) this.parseWave(frame)
					else if (head === 0xA6) this.parseCmd(frame)
				}
			},
			parseWave(buf) {
				if (buf[buf.length - 1] !== 0x0A) return;
				const sumRx = buf[buf.length - 2];
				const sumCalc = buf.slice(1, -2).reduce((s, b) => s + b, 0) & 0xFF;
				if (sumRx !== sumCalc) return;
				const str = String.fromCharCode(...buf.slice(1, -2));
				const val = parseFloat(str);
				if (Number.isNaN(val)) return;

				this.$refs.wave.pushData([val]);
				this.dataCount++;
				this.fullDataCount = this.$refs.wave.getFullDataCount();
				this.queueLength = this.$refs.wave.getQueueLength();

			},
			parseCmd(buf) {
				if (buf[1] !== 0x15) return;
				const map = {
					0x00: '采集结束',
					0x01: '采集开始',
					0x02: '采集错误（未按键/提前结束）'
				};
				this.measurementStatus = map[buf[2]] || '未知状态';
				this.tip = this.measurementStatus;

				if (buf[2] === 0x00) {
					// 测量结束，提示用户可以查看完整波形
					setTimeout(() => {
						uni.showModal({
							title: '测量完成',
							content: `本次测量共采集 ${this.fullDataCount} 个数据点，是否查看完整波形？`,
							confirmText: '查看完整波形',
							cancelText: '暂不查看',
							success: (res) => {
								if (res.confirm) {
									this.showFullWaveform();
								}
							}
						});
					}, 500);
				} else if (buf[2] === 0x02) {
					uni.showToast({
						title: '用户未按开始键或已暂停',
						icon: 'none'
					});
				}
			},

			/* ==================== UI ==================== */

			toggleStats() {
				this.statsVisible = !this.statsVisible
			},
			disConnect() {
				if (!this.deviceId) return
				uni.closeBLEConnection({
					deviceId: this.deviceId
				})
				uni.closeBluetoothAdapter()
				this.connected = false
				this.deviceId = ''
				this.notifyCharacteristicId = ''
				this.writeCharacteristicId = ''
				this.dataSource = '未连接'
				this.tip = '已断开'
			}
		}
	}
</script>

<style scoped>
	/* 样式保持不变，只添加了完整波形按钮的禁用状态 */
	.btn:disabled {
		opacity: 0.5;
	}

	/* 核心样式，其余沿用你之前的即可 */
	.page {
		display: flex;
		flex-direction: column;
		/* height: 100vh; */
		padding-bottom: 100px;
		background: #e0e0e0;
	}

	.ecg-container {
		padding: 20px 10px;
		overflow: visible;
		/* 减去左右 margin */
		box-sizing: border-box;
	}


	.control-panel {
		background: #fff;
		border-radius: 16rpx;
		padding: 24px;
		margin-top: 240px;
		margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
	}

	.status-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		gap: 16rpx;
	}

	.status-indicator {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		background: #e0e0e0;
	}

	.status-indicator.connected {
		background: #07c160;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1
		}

		50% {
			opacity: .6
		}

		100% {
			opacity: 1
		}
	}

	.button-row {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.btn {
		flex: 1;
		min-width: 160rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		border: none;
	}

	.btn.primary {
		background: #007aff;
		color: #fff;
	}

	.btn.warn {
		background: #ff3b30;
		color: #fff;
	}

	.btn.secondary {
		background: #f0f0f0;
		color: #333;
	}

	.tip {
		font-size: 24rpx;
		color: #666;
		text-align: center;
	}

	.stats-panel {
		background: #fff;
		border-radius: 16rpx;
		padding: 24px;
		margin-bottom: 100px;
		margin-left: 10px;
		margin-right: 10px;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 0;
	}

	.stats-label {
		font-size: 26rpx;
		color: #666;
	}

	.stats-value {
		font-size: 26rpx;
		color: #333;
		font-family: monospace;
	}
</style>