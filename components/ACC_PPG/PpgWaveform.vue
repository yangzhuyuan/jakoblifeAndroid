<template>
	<view class="waveform-container">
		<!-- 信息栏 -->
		<view class="info-bar">
			<view class="heart-rate">
				<text class="hr-value">{{ heartRateDisplay }}</text>
				<text class="hr-unit">BPM</text>
			</view>
			<view class="status-indicators">
				<view class="status-item" :class="{ active: isWearing }">
					<text class="status-dot"></text>
					<text>{{ wearingStatus }}</text>
				</view>
				<!-- 				<view class="status-item">
					<text>采样: {{ samplingRate }}Hz</text>
				</view>
				<view class="status-item" v-if="packetSeq > 0">
					<text>序列: #{{ packetSeq }}</text>
				</view> -->
			</view>
		</view>

		<!-- 波形画布 -->
		<canvas canvas-id="ppg-canvas" class="waveform-canvas"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" @tap="handleCanvasTap"></canvas>

		<!-- 控制栏 -->
		<!-- <view class="control-bar">
			<button class="control-btn" @click="togglePause" :class="{ paused: isPaused }"
				:disabled="ppgData.length === 0">
				{{ isPaused ? '▶ 继续' : '⏸ 暂停' }}
			</button>
			<button class="control-btn secondary" @click="clearData" :disabled="ppgData.length === 0">
				🗑 清空
			</button>
			<button class="control-btn secondary" @click="exportData" v-if="ppgData.length > 100">
				💾 导出
			</button>
		</view> -->

		<!-- 状态提示 -->
		<view class="status-tip" v-if="showTip">
			<text>{{ tipText }}</text>
		</view>

		<!-- 数据计数器 -->
		<!-- <view class="data-counter" v-if="ppgData.length > 0">
			<text>数据点: {{ ppgData.length }} | 心率: {{ heartRateDisplay }} BPM</text>
		</view> -->
	</view>
</template>

<script>
	import PpgDataService from '../../pages/api/servicesppg/PpgDataService.js';

	export default {
		name: 'PpgWaveform',

		data() {
			return {
				canvasWidth: 750,
				canvasHeight: 400,
				heartRate: 0,
				wearingStatus: this.$t('未佩戴'),
				samplingRate: 13,
				packetSeq: 0,
				ppgData: [],
				irData: [],
				isPaused: false,
				ctx: null,
				drawTimer: null,
				isDrawing: false,
				showTip: false,
				tipText: '',
				tipTimer: null,
				lastUpdateTime: 0,
				frameCount: 0,
				showDebugHR: true, // 调试用
				lastHeartRate: 0
			}
		},

		computed: {
			heartRateDisplay() {
				return this.heartRate > 0 ? this.heartRate : '--';
			},
			isWearing() {
				return this.wearingStatus === this.$t('已佩戴');
			}
		},

		mounted() {
			this.initCanvas();
			this.bindServiceEvents();
			this.startDrawing();
		},

		beforeDestroy() {
			this.stopDrawing();
			this.unbindServiceEvents();
			if (this.tipTimer) {
				clearTimeout(this.tipTimer);
			}
		},

		methods: {
			initCanvas() {
				try {
					const sysInfo = uni.getSystemInfoSync();
					this.canvasWidth = Math.round(750 * sysInfo.windowWidth / 750);
					// 创建Canvas上下文
					this.ctx = uni.createCanvasContext('ppg-canvas', this);
				} catch (error) {
					console.error('❌ Canvas初始化失败:', error);
				}
			},

			bindServiceEvents() {
				PpgDataService.on('data-update', this.handleDataUpdate);
				PpgDataService.on('data-cleared', this.handleDataCleared);
			},

			unbindServiceEvents() {
				PpgDataService.off('data-update', this.handleDataUpdate);
				PpgDataService.off('data-cleared', this.handleDataCleared);
			},

			handleDataUpdate(data) {
				if (this.isPaused) return;

				// 直接赋值，不经过中间变量
				this.ppgData = data.ppgData || [];
				this.irData = data.irData || [];
				this.heartRate = data.heartRate || 0;
				this.wearingStatus = data.wearingStatus || this.$t('未佩戴');
				this.samplingRate = data.samplingRate || 13;
				this.packetSeq = data.packetSeq || 0;

				// 检测心率变化
				if (this.heartRate !== this.lastHeartRate) {
					// console.log('❤️ 心率更新:', this.lastHeartRate, '→', this.heartRate, 'BPM');
					this.lastHeartRate = this.heartRate;
				}

				this.frameCount++;
				if (this.frameCount % 10 === 0) {
					// console.log('🎯 组件接收数据更新:', {
					// 	帧数: this.frameCount,
					// 	心率: this.heartRate,
					// 	PPG长度: this.ppgData.length
					// });
				}
			},
			startDrawing() {
				if (this.isDrawing) {
					console.warn('⚠️ 绘制循环已在运行');
					return;
				}

				this.isDrawing = true;
				let lastDrawTime = 0;

				const draw = () => {
					if (!this.isPaused && this.ppgData.length > 0) {
						const now = Date.now();
						// 限制绘制频率：最高30fps
						if (now - lastDrawTime > 33) {
							this.drawWaveform();
							lastDrawTime = now;
						}
					}
					// 继续下一次绘制
					if (this.isDrawing) {
						this.drawTimer = setTimeout(draw, 30);
					}
				};
				draw();
			},

			stopDrawing() {
				this.isDrawing = false;
				if (this.drawTimer) {
					clearTimeout(this.drawTimer);
					this.drawTimer = null;
				}
			},

			drawWaveform() {
				const ctx = this.ctx;
				if (!ctx) {
					console.error('❌ Canvas上下文为空');
					return;
				}

				const width = this.canvasWidth;
				const height = this.canvasHeight;

				// 清除画布
				ctx.clearRect(0, 0, width, height);

				// 绘制网格
				this.drawGrid(ctx, width, height);

				// 绘制PPG信号
				if (this.ppgData.length > 2) {
					this.drawSignal(ctx, this.ppgData, width, height * 0.4, '#00FF00', 'PPG', 0);
				}

				// 绘制IR信号
				if (this.irData.length > 2) {
					this.drawSignal(ctx, this.irData, width, height * 0.3, '#FF6B00', 'IR', height * 0.5);
				}

				// 执行绘制
				ctx.draw();

				// 绘制完成回调
				this.$emit('draw-complete', {
					dataPoints: this.ppgData.length,
					heartRate: this.heartRate
				});
			},

			drawGrid(ctx, width, height) {
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
				ctx.lineWidth = 1;

				// 水平网格线（10条）
				for (let i = 0; i <= 10; i++) {
					const y = (height / 10) * i;
					ctx.beginPath();
					ctx.moveTo(0, y);
					ctx.lineTo(width, y);
					ctx.stroke();
				}

				// 垂直网格线（每秒一条）
				const xStep = width / (this.samplingRate * this.displayTime);
				for (let i = 0; i * xStep < width; i++) {
					const x = i * xStep;
					ctx.beginPath();
					ctx.moveTo(x, 0);
					ctx.lineTo(x, height);
					ctx.stroke();
				}
			},

			drawSignal(ctx, data, width, height, color, label, offsetY = 0) {
				if (!data || data.length < 2) return;

				// 计算数据范围
				const maxVal = Math.max(...data);
				const minVal = Math.min(...data);
				const range = maxVal - minVal || 1;

				// 绘制信号线
				ctx.beginPath();
				ctx.strokeStyle = color;
				ctx.lineWidth = 2;

				const xStep = width / data.length;

				data.forEach((value, index) => {
					const x = index * xStep;
					const normalizedValue = ((value - minVal) / range * height * 0.8 + height * 0.1);
					const y = offsetY + height - normalizedValue;

					if (index === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				});

				ctx.stroke();

				// 绘制标签
				ctx.fillStyle = color;
				ctx.font = '12px Arial';
				ctx.fillText(`${label}`, 10, offsetY + 20)
				// ctx.fillText(`${label} (${data.length}点)`, 10, offsetY + 20);

				// 绘制数值范围
				// ctx.fillText(`${minVal.toFixed(0)} - ${maxVal.toFixed(0)}`, 10, offsetY + 35);
			},

			togglePause() {
				this.isPaused = !this.isPaused;

				if (!this.isPaused && this.ppgData.length > 0) {
					this.startDrawing();
				} else {
					this.stopDrawing();
				}

				this.showTipMessage(this.isPaused ? '已暂停数据更新' : '已恢复数据更新');
				console.log(this.isPaused ? '⏸️ 暂停绘制' : '▶️ 恢复绘制');
			},

			clearData() {
				PpgDataService.clear();
			},

			handleDataCleared() {
				this.ppgData = [];
				this.irData = [];
				this.heartRate = 0;
				this.wearingStatus = this.$t('未佩戴');
				this.packetSeq = 0;
				this.frameCount = 0;

				// 清空画布
				if (this.ctx) {
					this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
					this.ctx.draw();
				}

				// console.log('🗑️ 组件数据已清空');
			},

			exportData() {
				const data = {
					timestamp: new Date().toISOString(),
					ppgData: this.ppgData,
					irData: this.irData,
					heartRate: this.heartRate,
					samplingRate: this.samplingRate,
					wearingStatus: this.wearingStatus,
					exportTime: new Date().toLocaleString()
				};

				const filename = `PPG_DATA_${Date.now()}.json`;

				// #ifdef APP-PLUS
				this.saveFileApp(data, filename);
				// #endif

				// #ifdef MP-WEIXIN
				this.saveFileMP(data, filename);
				// #endif

				// #ifdef H5
				this.saveFileH5(data, filename);
				// #endif
			},

			saveFileApp(data, filename) {
				const path = `${plus.io.PUBLIC_DOCUMENTS}/${filename}`;
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
					fs.root.getFile(filename, {
						create: true
					}, (fileEntry) => {
						fileEntry.createWriter((writer) => {
							writer.onwrite = () => {
								this.showTipMessage(`数据已保存至文档`);
								console.log('💾 数据导出成功:', path);
							};
							writer.write(JSON.stringify(data, null, 2));
						});
					});
				});
			},

			saveFileMP(data, filename) {
				const fs = uni.getFileSystemManager();
				const filePath = `${wx.env.USER_DATA_PATH}/${filename}`;
				fs.writeFile({
					filePath,
					data: JSON.stringify(data, null, 2),
					success: () => {
						uni.saveFile({
							tempFilePath: filePath,
							success: (res) => {
								this.showTipMessage('数据已保存');
								console.log('💾 小程序数据导出成功:', res.savedFilePath);
							},
							fail: (err) => {
								console.error('小程序保存失败:', err);
							}
						});
					},
					fail: (err) => {
						console.error('小程序写入失败:', err);
					}
				});
			},

			saveFileH5(data, filename) {
				const blob = new Blob([JSON.stringify(data, null, 2)], {
					type: 'application/json'
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = filename;
				a.click();
				URL.revokeObjectURL(url);
				this.showTipMessage('数据已下载');
				console.log('💾 H5数据导出成功:', filename);
			},

			handleCanvasTap() {
				this.showTipMessage(this.$t("实时PPG波形"));
			},

			showWelcomeTip() {
				// setTimeout(() => {
				this.showTipMessage('PPG数据接收中，请稍候...');
				// }, 1000);
			},

			showTipMessage(text) {
				this.tipText = text;
				this.showTip = true;

				// if (this.tipTimer) {
				// 	clearTimeout(this.tipTimer);
				// }

				// this.tipTimer = setTimeout(() => {
				// 	this.showTip = false;
				// }, 3000);
			},
			showTipMessage1() {
				this.showTip = false;
			}

		}
	}
</script>

<style scoped>
	.waveform-container {
		background: #000;
		padding: 20rpx;
		min-height: 100vh;
		position: relative;
	}

	.info-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
	}

	.heart-rate {
		display: flex;
		align-items: baseline;
	}

	.hr-value {
		font-size: 72rpx;
		font-weight: bold;
		color: #FF4444;
		text-shadow: 0 0 10rpx rgba(255, 68, 68, 0.5);
	}

	.hr-unit {
		font-size: 28rpx;
		color: #aaa;
		margin-left: 8rpx;
	}

	.status-indicators {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		font-size: 24rpx;
		gap: 8rpx;
	}

	.status-item {
		display: flex;
		align-items: center;
		color: #666;
		transition: all 0.3s ease;
	}

	.status-item.active {
		color: #4CAF50;
		font-weight: bold;
	}

	.status-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background: currentColor;
		margin-right: 8rpx;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		50% {
			opacity: 0.6;
			transform: scale(1.2);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.waveform-canvas {
		background: #0a0a0a;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 255, 0, 0.1);
		width: 100%;
		display: block !important;
	}

	.control-bar {
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
		gap: 20rpx;
	}

	.control-btn {
		padding: 16rpx 40rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		font-weight: 500;
		transition: all 0.3s ease;
		min-width: 160rpx;
		background: linear-gradient(135deg, #00FF00, #00AA00);
		color: #000;
		border: none;
	}

	.control-btn.secondary {
		background: #1a1a1a;
		color: #00FF00;
		border: 2rpx solid #00FF00;
	}

	.control-btn.paused {
		background: linear-gradient(135deg, #FF4444, #CC0000);
	}

	.control-btn:active {
		transform: scale(0.95);
	}

	.control-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.status-tip {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.95);
		color: #00FF00;
		padding: 20rpx 40rpx;
		border-radius: 8rpx;
		border: 2rpx solid #00FF00;
		font-size: 28rpx;
		z-index: 999;
		animation: fadeInOut 3s ease;
		font-weight: bold;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.8);
		}

		20% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}

		80% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}

		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.8);
		}
	}

	.data-counter {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		font-size: 20rpx;
		color: #666;
		background: rgba(0, 0, 0, 0.7);
		padding: 8rpx 16rpx;
		border-radius: 4rpx;
	}
</style>