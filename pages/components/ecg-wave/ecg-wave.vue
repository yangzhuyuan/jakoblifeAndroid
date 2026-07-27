<template>
	<view class="wave-box">
		<canvas canvas-id="ecg-canvas" :style="canvasStyle" class="ecg-canvas" />
		<view class="full-wave-controls" v-if="showFullWaveControls">
			<view class="control-row">
				<text class="control-label">{{$t("时间范围")}}:</text>
				<slider :value="fullWaveStartTime" :min="0" :max="fullWaveTotalDuration" step="1"
					@change="onStartTimeChange" class="time-slider" />
				<text class="time-value">{{ formatTime(fullWaveStartTime) }} - {{ formatTime(fullWaveEndTime) }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ecgGen,
		rhythmTypes
	} from './mock-ecg.js';
	import {
		presetTestEcgData
	} from './test-ecg-data.js';

	export default {
		computed: {
			canvasStyle() {
				return {
					width: this.pxWidth + 'px',
					height: this.pxHeight + 'px'
				};
			},
			fullWaveTotalDuration() {
				if (this.fullDataList.length > 0) {
					return this.fullDataList.length / this.sampleRate;
				} else if (this.apiDataList.length > 0) {
					return this.apiDataList.length / this.sampleRate;
				}
				return 0;
			},
			currentGain() {
				const amp = this.isMeasuring ? this.measureAmplifyFactor : this.amplifyFactor;
				return this.fixedGain * amp;
			},
			currentDisplayAmplify() {
				return this.isMeasuring ? this.measureAmplifyFactor : this.amplifyFactor;
			}
		},
		data() {
			return {
				ctx: null,
				dataList: [],
				fullDataList: [],
				apiDataList: [],
				maxTotalDataPoints: 40000, // 一次测量约30000+数据点
				filteredRollingBuffer: [],
				pxWidth: 0,
				pxHeight: 0,
				gain: 50,
				dataRange: 1,
				margin: {
					top: 10,
					right: 10,
					bottom: 10,
					left: 10
				},
				showFullWaveMode: false,
				showFullWaveControls: false,
				originalDataList: [],
				drawTimer: null,
				isDrawing: false,
				sampleRate: 250,
				screenDuration: 2, // 一屏显示5秒波形，250Hz × 5s = 1250 点
				gridSize: {
					x: 50,
					y: 25
				},
				startTime: 0,
				currentTimeOffset: 0,
				totalDataPoints: 0,
				fullWaveDuration: 5,
				fullWaveZoom: 50,
				baseFullWaveGain: 50,
				pixelsPerMm: 5, //格子大小
				dataSourceTip: '',
				isMeasuring: false,
				apiDataTimer: null,
				fullWaveStartTime: 25,
				fullWaveEndTime: 35,
				autoShowFullWave: false,
				realTimeDrawIndex: 0,
				realTimeDataBuffer: [],
				canvasWidthPoints: 0,
				realTimeWaveformData: [],
				realTimeDrawPosition: 0,
				normalVoltageRange: 500,
				realTimeDisplayData: [],
				realTimeDataIndex: 0,
				displayDataLength: 1250,
				waveOffset: 0,
				lastDrawTime: 0,
				waveSpeed: 1,
				currentSegmentData: [],
				segmentStartTime: 0,
				segmentDuration: 2.4, // 对应600个数据点
				segmentDataPoints: 1000,
				isNewSegment: true,
				fixedGain: 50,
				maxWaveHeight: 0,
				scrollData: [],
				currentWavePosition: 0,
				continuousWaveData: [],
				waveDataBuffer: [],
				peakSampleInterval: 1.8,
				gridColor: '#d0d0d0',
				smallGridColor: '#f0f0f0',
				centerLineColor: '#10BB13',
				peaksPerGroup: 4,
				realTimeStartPosition: 0,
				waveColor: '#1432F4',
				waveLineWidth: 1.5,
				drawInterval: 80,
				drawStep: 1,
				currentDrawIndex: 0,
				lastDrawData: [],
				dataFillSpeed: 0.2, // 提高数据填充速度
				lastDataPushTime: 0,
				dataPushInterval: 50,
				realTimeDataQueue: [],
				animationTimer: null,
				waveScrollPosition: 0,
				waveScrollSpeed: 2,
				lastFrameTime: 0,
				fps: 0,
				frameCount: 0,
				lastFpsUpdate: 0,
				rafId: null,
				lastProcessTime: 0,
				processInterval: 20, // 减少处理间隔
				millivoltsPerSmallGrid: 1,
				millivoltsPerLargeGrid: 5,
				millimetersPerSmallGrid: 1,
				millimetersPerLargeGrid: 5,
				secondsPerSmallGrid: 1,
				secondsPerLargeGrid: 5,
				standardSensitivity: 10,
				amplifyFactor: 5.0,
				minAmplifyFactor: 0.5,
				maxAmplifyFactor: 20.0,
				amplifyStep: 0.5,
				realTimeAmplifyFactor: 50,
				measureAmplifyFactor: 3, //设置波形大小
				apiDataAmplifyFactor: 3, // generateApiData 云端波形额外放大
				// 垂直显示范围 ±500 小格，每小格 1 单位
				signalGridRange: 500,
				signalState: null,
				baselineWindowSize: 64,
				baselineInitSamples: 8,
				leadOnThreshold: 0.001,
				baselineJumpThreshold: 400,
				deviceToMvScale: 1,
				// 新增：波形绘制控制参数
				waveDrawComplete: false, // 波形是否绘制完成
				waveRestartPosition: 0, // 波形重新开始位置
				lastDataCount: 0, // 上次数据计数
				isTestMode: false,
				testWaveTimer: null,
				testEcgGenerator: null,
				testWaveType: 'preset',
				testWaveIndex: 0,
				testWaveData: null,
				// 乐普APP风格实时波形
				useLepuStyle: true,
				lepuBufferSize: 1000,
				lepuDrawInterval: 32,
				lepuWavePosition: 0,
				lepuWriteIndex: 0,
				lepuSampleCount: 0,
				lepuHasWrapped: false,
				lepuDisplayBuffer: [],
				lepuSegmentMvBuffer: [],
				lepuTargetHalfRange: 1.0,
				lepuSweepStartTime: 0, // 第一组扫屏起始墙钟，首个有效采样写入时记录
				scrollStartDuration: 3, // 与 screenDuration 一致，250Hz × 5s = 1250 点
			};
		},
		mounted() {
			this.$nextTick(() => {
				this.initCanvas();
			});
			this.startAnimation();
			this.initTimestamps();
			this.updateDisplayDataLength();
			this.initDataArrays();
			this.calculateStandardGain();
		},
		methods: {
			// 初始化时间戳
			initTimestamps() {
				const now = Date.now();
				this.startTime = now;
				this.lastDrawTime = now;
				this.lastDataPushTime = now;
				this.lastFrameTime = now;
				this.lastFpsUpdate = now;
				this.lastProcessTime = now;
			},
			// 初始化数据数组
			initDataArrays() {
				this.realTimeDisplayData = new Array(this.displayDataLength).fill(0);
				this.scrollData = new Array(this.displayDataLength).fill(0);
				this.currentSegmentData = [];
				this.continuousWaveData = new Array(this.displayDataLength).fill(0);
				this.lastDrawData = new Array(this.displayDataLength).fill(0);
				this.realTimeDataQueue = [];
				this.filteredRollingBuffer = [];
				this.resetSignalState();
				this.resetLepuBuffer();
			},
			resetLepuBuffer() {
				this.lepuBufferSize = this.getLepuScreenPointCount();
				this.lepuDisplayBuffer = new Array(this.lepuBufferSize).fill(null);
				this.lepuWavePosition = 0;
				this.lepuWriteIndex = 0;
				this.lepuSampleCount = 0;
				this.lepuHasWrapped = false;
				this.lepuSegmentMvBuffer = [];
				this.lepuSweepStartTime = 0;
			},
			ensureLepuSweepStartTime() {
				if (!this.lepuSweepStartTime) {
					this.lepuSweepStartTime = Date.now();
				}
			},
			getLepuSweepElapsedSec() {
				if (!this.lepuSweepStartTime) return 0;
				return Math.max(0, (Date.now() - this.lepuSweepStartTime) / 1000);
			},
			getLepuSweepProgress() {
				if (!this.lepuSweepStartTime || this.lepuHasWrapped) return 0;
				const elapsedSec = this.getLepuSweepElapsedSec();
				return Math.min(1, elapsedSec / this.screenDuration);
			},
			normalizeLepuAmplitude(mv) {
				this.lepuSegmentMvBuffer.push(mv);
				if (this.lepuSegmentMvBuffer.length > this.segmentDataPoints) {
					this.lepuSegmentMvBuffer.shift();
				}
				const arr = this.lepuSegmentMvBuffer;
				if (arr.length < 2) {
					return mv;
				}
				const min = Math.min(...arr);
				const max = Math.max(...arr);
				const pp = max - min;
				const mid = (max + min) / 2;
				const targetHalfRange = this.lepuTargetHalfRange;
				if (pp < 0.0005) {
					const amp = targetHalfRange / Math.max(pp, 0.0001);
					const scaled = (mv - mid) * amp;
					return Math.max(-targetHalfRange * 2, Math.min(targetHalfRange * 2, scaled));
				}
				const currentHalfRange = pp / 2;
				if (currentHalfRange > targetHalfRange) {
					return (mv - mid) * (targetHalfRange / currentHalfRange);
				}
				return (mv - mid) / currentHalfRange * targetHalfRange;
			},
			appendLepuSample(value) {
				const displayMv = this.normalizeLepuAmplitude(value);
				const bufsize = this.lepuBufferSize;
				if (!this.lepuHasWrapped) {
					this.ensureLepuSweepStartTime();
					if (this.lepuWriteIndex >= bufsize) {
						if (this.getLepuSweepElapsedSec() >= this.screenDuration) {
							this.tryStartLepuSecondPass();
						}
						if (!this.lepuHasWrapped) {
							return;
						}
					} else {
						this.lepuDisplayBuffer[this.lepuWriteIndex] = displayMv;
						this.lepuWriteIndex += 1;
						this.lepuWavePosition = this.lepuWriteIndex;
						this.lepuSampleCount += 1;
						return;
					}
				}
				this.lepuDisplayBuffer[this.lepuWriteIndex] = displayMv;
				this.lepuWriteIndex = (this.lepuWriteIndex + 1) % bufsize;
				this.lepuWavePosition = this.lepuWriteIndex;
				this.lepuSampleCount += 1;
			},
			tryStartLepuSecondPass() {
				if (this.lepuHasWrapped || !this.lepuSweepStartTime) return;
				if (this.getLepuSweepElapsedSec() >= this.screenDuration) {
					this.lepuHasWrapped = true;
					this.lepuWriteIndex = 0;
					this.lepuWavePosition = 0;
				}
			},
			getLepuScreenPointCount() {
				return Math.max(2, Math.floor(this.sampleRate * this.screenDuration));
			},
			getLepuScrollWindowSamples() {
				return this.getLepuScreenPointCount();
			},
			getLepuPointWidth(area) {
				const screenPoints = this.getLepuScreenPointCount();
				return area.w / Math.max(1, screenPoints);
			},
			// 样本 i 的横坐标：i 对应第 i/采样率 秒，5 秒铺满一屏
			getLepuSampleX(area, sampleIndex) {
				const screenPoints = this.getLepuScreenPointCount();
				return area.x + (sampleIndex / screenPoints) * area.w;
			},
			// 扫屏头横坐标：严格按墙钟 0~5 秒映射到画布宽度
			getLepuSweepHeadX(area) {
				if (this.lepuHasWrapped) {
					return area.x + area.w;
				}
				if (!this.lepuSweepStartTime) {
					return area.x;
				}
				const progress = Math.min(1, this.getLepuSweepElapsedSec() / this.screenDuration);
				return area.x + progress * area.w;
			},
			// 第一屏：扫屏头按墙钟 5 秒走完，横向位置与 maxByTime 使用同一 screenPoints
			getLepuFirstPassDrawCount() {
				if (!this.lepuSweepStartTime) return 0;
				const screenPoints = this.getLepuScreenPointCount();
				const maxByTime = Math.min(
					screenPoints,
					Math.floor(this.getLepuSweepElapsedSec() * this.sampleRate)
				);
				return Math.min(this.lepuWriteIndex, maxByTime);
			},
			getLepuFirstPassHeadIndex() {
				const drawCount = this.getLepuFirstPassDrawCount();
				return drawCount > 0 ? drawCount - 1 : -1;
			},
			shouldUseLepuRingScroll() {
				return this.lepuSampleCount >= this.getLepuScrollWindowSamples();
			},
			getLepuBufferIndex(offset) {
				const bufsize = this.lepuBufferSize;
				return ((offset % bufsize) + bufsize) % bufsize;
			},
			getSmallGridPixels() {
				const dpr = uni.getSystemInfoSync().pixelRatio;
				return this.pixelsPerMm * dpr;
			},
			getLargeGridPixels() {
				return this.getSmallGridPixels() * (this.secondsPerLargeGrid / this.secondsPerSmallGrid);
			},
			getDisplayPointWidth(area) {
				return this.getLepuPointWidth(area);
			},
			updateDisplayDataLength() {
				this.scrollStartDuration = this.screenDuration;
				this.displayDataLength = this.getLepuScreenPointCount();
				this.lepuBufferSize = this.displayDataLength;
				if (this.filteredRollingBuffer.length > this.displayDataLength) {
					this.filteredRollingBuffer = this.filteredRollingBuffer.slice(-this.displayDataLength);
				}
				if (this.lepuDisplayBuffer.length !== this.lepuBufferSize) {
					this.resetLepuBuffer();
				}
				if (this.filteredRollingBuffer.length > 0) {
					this.syncRealTimeDisplayData();
				}
			},
			syncRealTimeDisplayData() {
				const len = this.displayDataLength;
				const buffer = this.filteredRollingBuffer;
				this.realTimeDisplayData = new Array(len).fill(0);
				const count = Math.min(len, buffer.length);
				for (let i = 0; i < count; i++) {
					this.realTimeDisplayData[i] = buffer[i];
				}
				this.realTimeStartPosition = count;
			},
			calculateStandardGain() {
				const smallGridPixels = this.getSmallGridPixels();
				this.fixedGain = smallGridPixels / this.millivoltsPerSmallGrid;
			},
			createSignalState() {
				return {
					baselineWindow: [],
					lastRaw: null
				};
			},
			resetBaselineWindow(state, rawValue) {
				state.baselineWindow = [rawValue];
				state.lastRaw = rawValue;
			},
			shouldResetBaseline(rawValue, state) {
				if (state.lastRaw !== null &&
					Math.abs(rawValue - state.lastRaw) > this.baselineJumpThreshold) {
					return true;
				}
				if (state.baselineWindow.length >= this.baselineInitSamples) {
					const baseline = this.calcBaselineFromWindow(state.baselineWindow);
					if (Math.abs(rawValue - baseline) > this.baselineJumpThreshold * 2) {
						return true;
					}
				}
				return false;
			},
			resetSignalState() {
				this.signalState = this.createSignalState();
			},
			getMaxDisplayMv() {
				return this.signalGridRange * this.millivoltsPerSmallGrid;
			},
			clampDisplayMv(mv) {
				const maxMv = this.getMaxDisplayMv();
				return Math.max(-maxMv, Math.min(maxMv, mv));
			},
			// 原始采样为 ±signalGridRange 设备单位（与 unpackInt16ECG 一致）
			clampRawEcgValue(value) {
				if (!Number.isFinite(value)) {
					return null;
				}
				return Math.max(-this.signalGridRange, Math.min(this.signalGridRange, value));
			},
			isInvalidRawSample(value) {
				return !Number.isFinite(value) || Math.abs(value) < this.leadOnThreshold;
			},
			calcBaselineFromWindow(window) {
				let sum = 0;
				for (let i = 0; i < window.length; i++) {
					sum += window[i];
				}
				return sum / window.length;
			},
			transformEcgSampleWithState(rawValue, state) {
				if (this.isInvalidRawSample(rawValue)) {
					return null;
				}
				if (this.shouldResetBaseline(rawValue, state)) {
					this.resetBaselineWindow(state, rawValue);
					if (state === this.signalState) {
						this.filteredRollingBuffer = [];
						this.syncRealTimeDisplayData();
					}
					return null;
				}
				state.baselineWindow.push(rawValue);
				state.lastRaw = rawValue;
				if (state.baselineWindow.length > this.baselineWindowSize) {
					state.baselineWindow.shift();
				}
				if (state.baselineWindow.length < this.baselineInitSamples) {
					return null;
				}
				const baseline = this.calcBaselineFromWindow(state.baselineWindow);
				let ac = rawValue - baseline;
				ac = Math.max(-this.signalGridRange, Math.min(this.signalGridRange, ac));
				const mv = ac * this.deviceToMvScale;
				return this.clampDisplayMv(mv);
			},
			transformEcgSample(rawValue) {
				if (!this.signalState) {
					this.resetSignalState();
				}
				return this.transformEcgSampleWithState(rawValue, this.signalState);
			},
			appendProcessedSample(value) {
				if (this.isMeasuring && this.useLepuStyle) {
					this.appendLepuSample(value);
				}
				this.filteredRollingBuffer.push(value);
				const len = this.displayDataLength;
				if (this.filteredRollingBuffer.length > len) {
					this.filteredRollingBuffer = this.filteredRollingBuffer.slice(-len);
				}
				this.syncRealTimeDisplayData();
			},
			getGainForProcessedData(data) {
				const apiAmp = this.isShowingApiData() ? this.apiDataAmplifyFactor : 1;
				return this.fixedGain * this.amplifyFactor * apiAmp;
			},
			isShowingApiData() {
				return !this.isMeasuring &&
					this.apiDataList.length > 0 &&
					this.fullDataList.length === 0;
			},
			setMeasureAmplifyFactor(factor) {
				const newFactor = parseFloat(factor);
				if (newFactor >= this.minAmplifyFactor && newFactor <= this.maxAmplifyFactor) {
					this.measureAmplifyFactor = newFactor;
					this.forceDraw();
				}
			},
			processEcgDataArray(arr) {
				if (!arr || arr.length === 0) return [];
				const state = this.createSignalState();
				const processed = [];
				for (let i = 0; i < arr.length; i++) {
					const value = this.transformEcgSampleWithState(arr[i], state);
					processed.push(value === null ? 0 : value);
				}
				return processed;
			},
			setAmplifyFactor(factor) {
				const newFactor = parseFloat(factor);
				if (newFactor >= this.minAmplifyFactor && newFactor <= this.maxAmplifyFactor) {
					if (this.isMeasuring) {
						this.measureAmplifyFactor = newFactor;
					} else {
						this.amplifyFactor = newFactor;
					}
					this.forceDraw();
				}
			},
			startAnimation() {
				const animate = () => {
					if (!this.showFullWaveMode && this.isMeasuring && !this.isDrawing) {
						this.drawLepuRealtimeWaveform(Date.now());
					} else if (!this.isDrawing) {
						this.draw();
					}
					this.animationTimer = setTimeout(() => {
						animate();
					}, this.isMeasuring ? this.lepuDrawInterval : 32);
				};
				this.stopAnimation();
				animate();
			},
			stopAnimation() {
				if (this.rafId) {
					cancelAnimationFrame(this.rafId);
					this.rafId = null;
				}
				if (this.animationTimer) {
					clearTimeout(this.animationTimer);
					this.animationTimer = null;
				}
			},
			// 乐普APP风格的实时波形绘制
			drawLepuRealtimeWaveform(timestamp) {
				if (!this.ctx || !this.isMeasuring) return;
				const now = timestamp || Date.now();
				const elapsed = now - this.lastDrawTime;
				if (elapsed < this.drawInterval) return;
				this.lastDrawTime = now;
				this.isDrawing = true;
				const w = this.pxWidth;
				const h = this.pxHeight;
				if (w <= 0 || h <= 0) {
					this.isDrawing = false;
					return;
				}
				const m = this.margin;
				const area = {
					x: m.left,
					y: m.top,
					w: w - m.left - m.right,
					h: h - m.top - m.bottom
				};
				this.clearCanvas(w, h);
				this.drawStandardECGGrid(area);
				this.drawLepuSweepWaveform(area);
				this.drawCenterLine(area);
				this.drawMovingReferenceLine(area);
				this.drawDataSourceTip(area);
				this.ctx.draw(true);
				this.isDrawing = false;
			},
			// 新增：连续波形绘制方法
			drawContinuousWaveform(area) {
				if (this.realTimeDisplayData.length < 2) return;
				const centerY = this.getCenterY(area);
				const pointWidth = this.getDisplayPointWidth(area);
				const currentGain = this.currentGain;
				this.ctx.strokeStyle = this.waveColor;
				this.ctx.lineWidth = this.waveLineWidth;
				this.ctx.beginPath();
				let hasData = false;
				let moveToCalled = false;
				// 检查是否需要重新开始绘制
				const currentDataCount = this.realTimeDisplayData.filter(v => v !== 0).length;
				if (currentDataCount > this.lastDataCount + 100) {
					// 数据量显著增加，重新开始绘制
					this.waveDrawComplete = false;
					this.waveRestartPosition = 0;
				}
				this.lastDataCount = currentDataCount;
				// 如果波形已经绘制完成，从右侧重新开始
				if (this.waveDrawComplete) {
					this.waveRestartPosition = (this.waveRestartPosition + 1) % this.displayDataLength;
				}
				// 绘制波形
				for (let i = 0; i < this.displayDataLength; i++) {
					const drawIndex = (this.waveRestartPosition + i) % this.displayDataLength;
					const v = this.realTimeDisplayData[drawIndex];
					const x = area.x + i * pointWidth;
					let y = centerY - v * currentGain;
					y = Math.max(area.y, Math.min(area.y + area.h, y));
					if (!moveToCalled) {
						this.ctx.moveTo(x, y);
						moveToCalled = true;
					} else {
						this.ctx.lineTo(x, y);
					}
					if (v !== 0) hasData = true;
					// 检查是否到达画布边界
					if (x >= area.x + area.w - pointWidth) {
						this.waveDrawComplete = true;
						break;
					}
				}
				this.ctx.stroke();
			},
			// 乐普扫屏：第一页从左向右；满屏后扫屏头逐点覆盖擦除旧波形（不滚动）
			drawLepuSweepWaveform(area) {
				const useLepuBuffer = this.isMeasuring &&
					this.useLepuStyle &&
					this.lepuDisplayBuffer &&
					this.lepuDisplayBuffer.length >= 2;
				if (useLepuBuffer) {
					if (this.lepuSampleCount < 2) return;
					this.tryStartLepuSecondPass();
					const centerY = this.getCenterY(area);
					const currentGain = this.currentGain;
					const writeIdx = this.lepuWriteIndex;
					const bufsize = this.lepuBufferSize;
					const drawCount = this.lepuHasWrapped ? bufsize : this.getLepuFirstPassDrawCount();
					const headX = this.getLepuSweepHeadX(area);
					this.ctx.strokeStyle = this.waveColor;
					this.ctx.lineWidth = this.waveLineWidth;
					this.ctx.beginPath();
					let moveToCalled = false;
					for (let i = 0; i < drawCount; i++) {
						if (this.lepuHasWrapped && i === writeIdx) {
							moveToCalled = false;
							continue;
						}
						const v = this.lepuDisplayBuffer[i];
						if (v === null) {
							moveToCalled = false;
							continue;
						}
						const x = this.lepuHasWrapped ?
							area.x + i * this.getLepuPointWidth(area) :
							this.getLepuSampleX(area, i);
						if (!this.lepuHasWrapped && x > headX) {
							break;
						}
						let y = centerY - v * currentGain;
						y = Math.max(area.y, Math.min(area.y + area.h, y));
						if (!moveToCalled) {
							this.ctx.moveTo(x, y);
							moveToCalled = true;
						} else {
							this.ctx.lineTo(x, y);
						}
					}
					this.ctx.stroke();
					return;
				}
				if (this.isMeasuring) {
					return;
				}
				this.drawStaticWaveform(area);
			},
			// 静态波形绘制（非乐普模式）
			drawStaticWaveform(area) {
				const centerY = this.getCenterY(area);
				const pointWidth = this.getDisplayPointWidth(area);
				const currentGain = this.currentGain;
				if (this.filteredRollingBuffer.length < 2) {
					return;
				}
				const count = Math.min(this.displayDataLength, this.filteredRollingBuffer.length);
				if (count < 2) return;
				this.ctx.strokeStyle = this.waveColor;
				this.ctx.lineWidth = this.waveLineWidth;
				this.ctx.beginPath();
				for (let i = 0; i < count; i++) {
					const v = this.realTimeDisplayData[i];
					const x = area.x + i * pointWidth;
					let y = centerY - v * currentGain;
					y = Math.max(area.y, Math.min(area.y + area.h, y));
					if (i === 0) {
						this.ctx.moveTo(x, y);
					} else {
						this.ctx.lineTo(x, y);
					}
				}
				this.ctx.stroke();
			},
			// 乐普风格的波形绘制
			drawLepuStyleWaveform(area) {
				if (this.realTimeDisplayData.length < 2) return;
				const centerY = this.getCenterY(area);
				const pointWidth = this.getLepuPointWidth(area);
				const currentGain = this.currentGain;
				this.ctx.strokeStyle = this.waveColor;
				this.ctx.lineWidth = this.waveLineWidth;
				this.ctx.beginPath();
				// 计算显示的数据范围
				const startIndex = Math.floor(this.lepuWavePosition);
				const visibleLength = Math.min(this.lepuBufferSize, this.lepuBufferSize - startIndex);
				let hasData = false;
				let lastX = 0;
				let lastY = centerY;
				// 绘制第一部分：从当前位置到缓冲区末尾
				for (let i = 0; i < visibleLength; i++) {
					const bufferIndex = (startIndex + i) % this.lepuBufferSize;
					const dataIndex = Math.min(bufferIndex, this.realTimeDisplayData.length - 1);
					const v = this.realTimeDisplayData[dataIndex] || 0;
					const x = area.x + i * pointWidth;
					let y = centerY - v * currentGain;
					y = Math.max(area.y, Math.min(area.y + area.h, y));
					if (i === 0) {
						this.ctx.moveTo(x, y);
						lastX = x;
						lastY = y;
					} else {
						// 使用平滑插值
						this.ctx.lineTo(x, y);
					}
					if (v !== 0) hasData = true;
				}
				// 绘制第二部分：从缓冲区开头到当前位置（形成连续效果）
				if (startIndex > 0) {
					const remainingPoints = this.lepuBufferSize - visibleLength;
					for (let i = 0; i < remainingPoints; i++) {
						const dataIndex = Math.min(i, this.realTimeDisplayData.length - 1);
						const v = this.realTimeDisplayData[dataIndex] || 0;
						const x = area.x + (visibleLength + i) * pointWidth;
						let y = centerY - v * currentGain;
						y = Math.max(area.y, Math.min(area.y + area.h, y));
						this.ctx.lineTo(x, y);
						if (v !== 0) hasData = true;
					}
				}
				this.ctx.stroke();
			},
			clearCanvas(width, height) {
				this.ctx.clearRect(0, 0, width, height);
				this.ctx.fillStyle = '#fff';
				this.ctx.fillRect(0, 0, width, height);
			},
			drawStandardECGGrid(area) {
				const smallGridSize = this.getSmallGridPixels();
				const largeGridSize = this.getLargeGridPixels();
				// 绘制小网格
				this.ctx.strokeStyle = this.smallGridColor;
				this.ctx.lineWidth = 0.5;
				this.drawGridLines(area, smallGridSize, 'vertical');
				this.drawGridLines(area, smallGridSize, 'horizontal');
				// 绘制大网格
				this.ctx.strokeStyle = this.gridColor;
				this.ctx.lineWidth = 1;
				this.drawGridLines(area, largeGridSize, 'vertical');
				this.drawGridLines(area, largeGridSize, 'horizontal');
			},
			getCenterY(area) {
				return area.y + area.h / 2;
			},
			drawCenterLine(area) {
				const centerY = this.getCenterY(area);
				this.ctx.strokeStyle = this.centerLineColor;
				this.ctx.lineWidth = 1;
				this.ctx.beginPath();
				this.ctx.moveTo(area.x, centerY);
				this.ctx.lineTo(area.x + area.w, centerY);
				this.ctx.stroke();
			},
			// 绘制最新采样点标记（绿点 + 光晕）
			drawMovingReferenceLine(area) {
				if (this.lepuSampleCount < 1) return;
				this.tryStartLepuSecondPass();
				const writeIdx = this.lepuWriteIndex;
				const bufsize = this.lepuBufferSize;
				let latestIdx;
				if (this.lepuHasWrapped) {
					latestIdx = (writeIdx - 1 + bufsize) % bufsize;
				} else {
					const headIndex = this.getLepuFirstPassHeadIndex();
					if (headIndex < 0) return;
					latestIdx = headIndex;
				}
				const v = this.lepuDisplayBuffer[latestIdx];
				if (v === null) return;
				const centerY = this.getCenterY(area);
				const currentGain = this.currentGain;
				const x = this.lepuHasWrapped ?
					area.x + latestIdx * this.getLepuPointWidth(area) :
					this.getLepuSweepHeadX(area);
				let y = centerY - v * currentGain;
				y = Math.max(area.y, Math.min(area.y + area.h, y));
				const coreRadius = 6;
				const glowRadius = 18;
				const gradient = this.ctx.createCircularGradient(x, y, glowRadius);
				gradient.addColorStop(0, 'rgba(16, 187, 19, 0.95)');
				gradient.addColorStop(0.35, 'rgba(16, 187, 19, 0.45)');
				gradient.addColorStop(0.65, 'rgba(16, 187, 19, 0.15)');
				gradient.addColorStop(1, 'rgba(16, 187, 19, 0)');
				this.ctx.fillStyle = gradient;
				this.ctx.beginPath();
				this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
				this.ctx.fill();
				this.ctx.fillStyle = this.centerLineColor;
				this.ctx.beginPath();
				this.ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
				this.ctx.fill();
				this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				this.ctx.beginPath();
				this.ctx.arc(x, y, coreRadius * 0.4, 0, Math.PI * 2);
				this.ctx.fill();
			},
			drawGridLines(area, gridSize, direction) {
				const centerY = direction === 'horizontal' ? this.getCenterY(area) : null;
				this.ctx.beginPath();
				if (direction === 'vertical') {
					for (let x = area.x; x <= area.x + area.w; x += gridSize) {
						this.ctx.moveTo(x, area.y);
						this.ctx.lineTo(x, area.y + area.h);
					}
				} else {
					for (let y = area.y; y <= area.y + area.h; y += gridSize) {
						// 中心位置留给绿色中心线，不绘制灰色网格线
						if (Math.abs(y - centerY) < 1) continue;
						this.ctx.moveTo(area.x, y);
						this.ctx.lineTo(area.x + area.w, y);
					}
				}
				this.ctx.stroke();
			},
			// 保留原有的平滑绘制方法（用于非实时测量模式）
			drawSmoothWaveform(area) {
				if (this.realTimeDisplayData.length < 2) return;
				const centerY = this.getCenterY(area);
				const pointWidth = area.w / this.realTimeDisplayData.length;
				const currentGain = this.currentGain;
				this.ctx.strokeStyle = this.waveColor;
				this.ctx.lineWidth = this.waveLineWidth;
				this.ctx.beginPath();
				// 直接绘制所有数据点，不进行滑动
				let hasData = false;
				let moveToCalled = false;
				for (let i = 0; i < this.realTimeDisplayData.length; i++) {
					const v = this.realTimeDisplayData[i];
					const x = area.x + i * pointWidth;
					let y = centerY - v * currentGain;
					y = Math.max(area.y, Math.min(area.y + area.h, y));
					if (!moveToCalled) {
						this.ctx.moveTo(x, y);
						moveToCalled = true;
					} else {
						this.ctx.lineTo(x, y);
					}
					if (v !== 0) hasData = true;
				}
				this.ctx.stroke();
			},
			processDataQueue() {
				if (this.realTimeDataQueue.length === 0) return;
				const maxProcessCount = Math.min(this.realTimeDataQueue.length, 200);
				const processData = this.realTimeDataQueue.splice(0, maxProcessCount);
				for (let i = 0; i < processData.length; i++) {
					const processed = this.transformEcgSample(processData[i]);
					if (processed !== null) {
						this.appendProcessedSample(processed);
					}
				}
				this.lastProcessTime = Date.now();
			},
			processRealTimeWaveData(newData) {
				if (!newData || newData.length === 0) return;
				for (let i = 0; i < newData.length; i++) {
					this.appendProcessedSample(newData[i]);
				}
			},
			fillDataToArray(targetArray, sourceData, startIndex) {
				for (let i = 0; i < sourceData.length; i++) {
					targetArray[startIndex + i] = sourceData[i];
				}
			},
			formatTime(seconds) {
				const mins = Math.floor(seconds / 60);
				const secs = Math.floor(seconds % 60);
				return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
			},
			onStartTimeChange(e) {
				const startTime = parseFloat(e.detail.value);
				this.fullWaveStartTime = startTime;
				this.fullWaveEndTime = startTime + this.fullWaveDuration;
				this.updateFullWaveData();
			},
			updateFullWaveData() {
				let sourceData = [];
				if (this.fullDataList.length > 0) {
					sourceData = this.processEcgDataArray(this.fullDataList);
				} else if (this.apiDataList.length > 0) {
					sourceData = this.processEcgDataArray(this.apiDataList);
				} else {
					return;
				}
				this.dataList = this.prepareFullWaveData(sourceData);
				this.calculateGainForFullData(sourceData);
				this.forceDraw();
			},
			filterNormalVoltageDataArray(arr) {
				if (!arr || arr.length === 0) return arr;
				return this.processEcgDataArray(arr);
			},
			generateApiData(data, voltageRange) {
				if (voltageRange > 10) {
					this.apiDataAmplifyFactor = 2
				} else {
					this.apiDataAmplifyFactor = 25
				}
				this.pushApiData(data);
			},
			pushApiData(arr) {
				if (!arr || arr.length === 0) return;
				if (this.isMeasuring) return;
				this.apiDataList = arr.slice();
				const processed = this.processEcgDataArray(this.apiDataList);
				if (this.dataList.length === 0) {
					this.updateDataRange(processed);
				}
				this.dataSourceTip = this.$t("云端数据");
				this.autoShowFullWaveForApiData();
			},
			autoShowFullWaveForApiData() {
				if (this.apiDataList.length === 0) return;
				if (this.isMeasuring) return;
				this.showFullWaveMode = true;
				this.showFullWaveControls = true;
				this.originalDataList = [...this.dataList];
				this.fullWaveZoom = 50;
				const totalDataPoints = this.apiDataList.length;
				const totalDuration = totalDataPoints / this.sampleRate;
				this.fullWaveStartTime = Math.max(0, Math.min(25, totalDuration - 5));
				this.fullWaveEndTime = Math.min(totalDuration, this.fullWaveStartTime + 5);
				const processed = this.processEcgDataArray(this.apiDataList);
				this.dataList = this.prepareFullWaveData(processed);
				this.calculateGainForFullData(processed);
				this.dataSourceTip = this.$t('云端数据');
				this.forceDraw();
			},
			startMeasurement() {
				this.resetMeasurementState();
				this.isMeasuring = true;
				this.dataSourceTip = this.$t("实时测量中");
				this.calculateStandardGain();
				this.updateDisplayDataLength();
				this.resetLepuBuffer();
				this.startAnimation();
				this.forceDraw();
				console.log('开始实时测量，乐普APP风格波形显示');
			},
			resetMeasurementState() {
				this.showFullWaveMode = false;
				this.showFullWaveControls = false;
				this.isMeasuring = false;
				this.dataList = [];
				this.fullDataList = [];
				this.apiDataList = [];
				this.realTimeDataBuffer = [];
				this.realTimeWaveformData = [];
				this.realTimeDrawIndex = 0;
				this.realTimeDrawPosition = 0;
				this.realTimeDataIndex = 0;
				this.waveOffset = 0;
				this.totalDataPoints = 0;
				this.currentTimeOffset = 0;
				this.currentSegmentData = [];
				this.segmentStartTime = Date.now();
				this.isNewSegment = true;
				this.currentDrawIndex = 0;
				this.waveScrollPosition = 0;
				this.realTimeStartPosition = 0;
				this.initDataArrays();
			},
			stopMeasurement() {
				this.clearTestWaveTimer();
				this.isTestMode = false;
				this.isMeasuring = false;
				this.stopAnimation();
				this.dataSourceTip = this.dataList.length === 0 ? this.$t("云端数据") : this.$t("测量数据");
				console.log('停止测量，数据点数:', this.fullDataList.length);
				console.log('返回正常显示模式，放大倍数:', this.amplifyFactor);
			},
			clearTestWaveTimer() {
				if (this.testWaveTimer) {
					clearInterval(this.testWaveTimer);
					this.testWaveTimer = null;
				}
				this.testEcgGenerator = null;
				this.testWaveData = null;
				this.testWaveIndex = 0;
			},
			convertMockToDeviceValue(mockValue) {
				const ac = mockValue - 2048;
				const scaled = Math.round(ac * (this.signalGridRange / 450));
				return this.clampRawEcgValue(scaled);
			},
			getTestRhythmTypes() {
				return {
					preset: {
						name: '预设测试数据',
						description: '真实设备采样数据，共 ' + presetTestEcgData.length + ' 点'
					},
					...rhythmTypes
				};
			},
			startTestWaveform(type = 'preset', customData = null) {
				this.stopTestWaveform();
				this.testWaveType = type;
				this.testWaveIndex = 0;
				let tipName = '';
				if (type === 'preset') {
					this.testWaveData = (customData && customData.length) ? customData : presetTestEcgData;
					this.testEcgGenerator = null;
					tipName = '预设测试数据';
				} else if (rhythmTypes[type]) {
					this.testWaveData = null;
					this.testEcgGenerator = ecgGen(type);
					tipName = rhythmTypes[type].name;
				} else if (customData && customData.length) {
					this.testWaveType = 'preset';
					this.testWaveData = customData;
					this.testEcgGenerator = null;
					tipName = '自定义测试数据';
				} else {
					console.warn(`未知测试波形类型: ${type}，使用预设测试数据`);
					this.testWaveType = 'preset';
					this.testWaveData = presetTestEcgData;
					this.testEcgGenerator = null;
					tipName = '预设测试数据';
				}
				if (this.testWaveData && this.testWaveData.length > 0) {
					this.screenDuration = this.scrollStartDuration;
					this.updateDisplayDataLength();
				}
				this.startMeasurement();
				this.isTestMode = true;
				this.dataSourceTip = `测试波形: ${tipName}`;
				const batchesPerSecond = 10;
				const batchSize = Math.max(1, Math.round(this.sampleRate / batchesPerSecond));
				const interval = Math.round(1000 / batchesPerSecond);
				this.testWaveTimer = setInterval(() => {
					if (!this.isTestMode || !this.isMeasuring) {
						this.stopTestWaveform();
						return;
					}
					const batch = this.nextTestWaveBatch(batchSize);
					if (batch.length > 0) {
						this.pushData(batch);
					}
				}, interval);
				console.log(`开始测试波形: ${tipName}`);
			},
			nextTestWaveBatch(batchSize) {
				const batch = [];
				if (this.testWaveData && this.testWaveData.length > 0) {
					for (let i = 0; i < batchSize; i++) {
						if (this.testWaveIndex >= this.testWaveData.length) {
							this.testWaveIndex = 0;
						}
						const value = this.testWaveData[this.testWaveIndex++];
						if (Number.isFinite(value)) {
							batch.push(value);
						}
					}
					return batch;
				}
				if (!this.testEcgGenerator) {
					return batch;
				}
				for (let i = 0; i < batchSize; i++) {
					const result = this.testEcgGenerator.next();
					if (result.done) {
						this.testEcgGenerator = ecgGen(this.testWaveType);
						continue;
					}
					const deviceValue = this.convertMockToDeviceValue(result.value);
					if (deviceValue !== null) {
						batch.push(deviceValue);
					}
				}
				return batch;
			},
			stopTestWaveform() {
				const wasTestMode = this.isTestMode;
				this.clearTestWaveTimer();
				this.isTestMode = false;
				if (wasTestMode && this.isMeasuring) {
					this.stopMeasurement();
				}
			},
			pushData(arr) {
				if (!this.isMeasuring || !arr || arr.length === 0) return;
				if (this.fullDataList.length + arr.length > this.maxTotalDataPoints) {
					console.warn(`数据点超过上限 ${this.maxTotalDataPoints}，后续数据将被忽略`);
					return;
				}
				const clamped = [];
				for (let i = 0; i < arr.length; i++) {
					const raw = this.clampRawEcgValue(arr[i]);
					if (raw !== null) {
						clamped.push(raw);
					}
				}
				if (clamped.length === 0) return;
				this.fullDataList.push(...clamped);
				this.totalDataPoints += clamped.length;
				for (let i = 0; i < clamped.length; i++) {
					const processed = this.transformEcgSample(clamped[i]);
					if (processed !== null) {
						this.appendProcessedSample(processed);
					}
				}
				this.processSegmentData(clamped);
				this.currentTimeOffset = this.totalDataPoints / this.sampleRate;
				if (!this.isTestMode) {
					this.dataSourceTip = this.$t("实时测量中");
				}
				if (this.showFullWaveMode) {
					this.showFullWaveMode = false;
					this.showFullWaveControls = false;
				}
			},
			processSegmentData(newData) {
				if (!newData || newData.length === 0) return;
				this.currentSegmentData.push(...newData);
				if (this.currentSegmentData.length >= this.segmentDataPoints) {
					const overflow = this.currentSegmentData.length - this.segmentDataPoints;
					this.currentSegmentData = overflow > 0 ?
						this.currentSegmentData.slice(-overflow) : [];
					this.segmentStartTime = Date.now();
				}
			},
			updateDataRange(arr) {
				if (!this.isMeasuring && arr.length > 0) {
					const newMin = Math.min(...arr);
					const newMax = Math.max(...arr);
					const currentRange = Math.max(Math.abs(newMin), Math.abs(newMax));
					if (currentRange > this.dataRange) {
						this.dataRange = currentRange;
					}
					this.dataRange = Math.max(0.001, this.dataRange);
				}
			},
			showFullWave() {
				let sourceData = [];
				let dataSource = '';
				if (this.fullDataList.length > 0) {
					sourceData = this.processEcgDataArray(this.fullDataList);
					dataSource = this.$t("测量数据");
				} else if (this.apiDataList.length > 0) {
					sourceData = this.processEcgDataArray(this.apiDataList);
					dataSource = this.$t("云端数据");
				} else {
					uni.showToast({
						title: this.$t("暂无数据"),
						icon: 'none'
					});
					return;
				}
				this.showFullWaveMode = true;
				this.showFullWaveControls = true;
				this.originalDataList = [...this.dataList];
				this.fullWaveZoom = 50;
				const totalDataPoints = sourceData.length;
				const totalDuration = totalDataPoints / this.sampleRate;
				this.fullWaveStartTime = Math.max(0, Math.min(25, totalDuration - 10));
				this.fullWaveEndTime = Math.min(totalDuration, this.fullWaveStartTime + 10);
				this.dataList = this.prepareFullWaveData(sourceData);
				this.calculateGainForFullData(sourceData);
				this.dataSourceTip = dataSource;
				this.forceDraw();
			},
			prepareFullWaveData(sourceData) {
				const totalDataPoints = sourceData.length;
				const totalDuration = totalDataPoints / this.sampleRate;
				const startIndex = Math.floor(this.fullWaveStartTime * this.sampleRate);
				const endIndex = Math.floor(this.fullWaveEndTime * this.sampleRate);
				const validStartIndex = Math.max(0, Math.min(startIndex, totalDataPoints - 1));
				const validEndIndex = Math.max(validStartIndex + 1, Math.min(endIndex, totalDataPoints));
				let displayData = sourceData.slice(validStartIndex, validEndIndex);
				const targetPoints = Math.min(2000, displayData.length);
				if (displayData.length > targetPoints) {
					displayData = this.peakSampling(displayData, targetPoints);
				}
				return displayData;
			},
			peakSampling(data, targetPoints) {
				if (data.length <= targetPoints) return data;
				const sampledData = [];
				const groupSize = Math.ceil(data.length / targetPoints);
				const peaksPerGroup = 4;
				for (let i = 0; i < data.length; i += groupSize) {
					const group = data.slice(i, i + groupSize);
					if (group.length <= peaksPerGroup) {
						sampledData.push(...group);
					} else {
						const groupWithIndex = group.map((value, index) => ({
							value,
							index,
							absValue: Math.abs(value)
						}));
						groupWithIndex.sort((a, b) => b.absValue - a.absValue);
						const topPeaks = groupWithIndex.slice(0, peaksPerGroup);
						topPeaks.sort((a, b) => a.index - b.index);
						sampledData.push(...topPeaks.map(item => item.value));
					}
				}
				return sampledData;
			},
			getLatestScreenData(sourceData) {
				if (!sourceData || sourceData.length === 0) return [];
				if (sourceData.length <= this.displayDataLength) {
					return [...sourceData];
				}
				return sourceData.slice(-this.displayDataLength);
			},
			hideFullWave() {
				this.showFullWaveMode = false;
				this.showFullWaveControls = false;
				this.fullWaveZoom = 50;
				if (this.originalDataList.length > 0) {
					this.dataList = [...this.originalDataList];
				} else {
					if (this.fullDataList.length > 0) {
						this.dataList = this.getLatestScreenData(this.processEcgDataArray(this.fullDataList));
						this.dataSourceTip = this.$t("测量数据");
					} else if (this.apiDataList.length > 0) {
						this.dataList = this.getLatestScreenData(this.processEcgDataArray(this.apiDataList));
						this.dataSourceTip = this.$t("云端数据");
					}
				}
				this.forceDraw();
			},
			forceDraw() {
				if (this.isDrawing) return;
				this.isDrawing = true;
				if (this.drawTimer) {
					clearTimeout(this.drawTimer);
				}
				this.drawTimer = setTimeout(() => {
					this.draw();
					this.isDrawing = false;
				}, 16);
			},
			calculateGainForFullData(sourceData) {
				if (!sourceData || sourceData.length === 0) return;
				this.baseFullWaveGain = this.fixedGain;
			},
			getCurrentFullWaveGain() {
				const apiAmp = this.isShowingApiData() ? this.apiDataAmplifyFactor : 1;
				return this.fixedGain * this.measureAmplifyFactor * apiAmp;
			},
			draw() {
				if (!this.ctx) return;
				const w = this.pxWidth;
				const h = this.pxHeight;
				if (w <= 0 || h <= 0) return;
				const m = this.margin;
				const area = {
					x: m.left,
					y: m.top,
					w: w - m.left - m.right,
					h: h - m.top - m.bottom
				};
				this.clearCanvas(w, h);
				this.drawStandardECGGrid(area);
				const displayData = this.getDisplayData();
				if (displayData.length >= 2) {
					if (this.showFullWaveMode) {
						this.drawFullWaveform(area);
					} else {
						this.drawWaveform(area, displayData);
					}
				}
				this.drawCenterLine(area);
				this.drawDataSourceTip(area);
				this.ctx.draw(true);
			},
			getDisplayData() {
				if (this.showFullWaveMode) {
					return this.dataList;
				} else {
					if (this.isMeasuring) {
						return this.realTimeDisplayData;
					} else if (this.dataList.length > 0) {
						return this.dataList;
					} else {
						return this.processEcgDataArray(this.apiDataList);
					}
				}
			},
			drawDataSourceTip(area) {
				if (!this.dataSourceTip) return;
				this.ctx.fillStyle = '#666';
				this.ctx.font = '12px Arial';
				this.ctx.textAlign = 'left';
				this.ctx.fillText(this.dataSourceTip, area.x + 10, area.y + 20);
				if (this.isMeasuring) {
					const segmentProgress = this.currentSegmentData.length / this.segmentDataPoints;
					const percentage = (segmentProgress * 100).toFixed(1);
					const totalTime = this.totalDataPoints / this.sampleRate;
					this.ctx.fillStyle = '#666';
					this.ctx.fillText(`数据填充: ${percentage}%`, area.x + 10, area.y + 40);
					this.ctx.fillText(`总时长: ${totalTime.toFixed(1)}秒`, area.x + 10, area.y + 60);
					this.ctx.fillText(`总数据: ${this.fullDataList.length}点`, area.x + 10, area.y + 80);
				}
			},
			drawFullWaveform(area) {
				if (this.dataList.length < 2) return;
				const pointWidth = area.w / this.dataList.length;
				const mid = this.getCenterY(area);
				this.ctx.strokeStyle = this.waveColor;
				this.ctx.lineWidth = this.waveLineWidth;
				this.ctx.beginPath();
				const currentGain = this.getCurrentFullWaveGain();
				for (let i = 0; i < this.dataList.length; i++) {
					const v = this.dataList[i];
					const x = area.x + i * pointWidth;
					let y = mid - v * currentGain;
					y = Math.max(area.y, Math.min(area.y + area.h, y));
					if (i === 0) {
						this.ctx.moveTo(x, y);
					} else {
						this.ctx.lineTo(x, y);
					}
				}
				this.ctx.stroke();
			},
			drawWaveform(area, displayData = null) {
				const dataToDraw = displayData || this.getDisplayData();
				if (dataToDraw.length < 2) return;
				const mid = this.getCenterY(area);
				this.ctx.strokeStyle = this.waveColor;
				this.ctx.lineWidth = this.waveLineWidth;
				this.ctx.beginPath();
				const pointWidth = area.w / dataToDraw.length;
				const currentGain = this.isMeasuring ?
					this.currentGain :
					this.getGainForProcessedData(dataToDraw);
				for (let i = 0; i < dataToDraw.length; i++) {
					const v = dataToDraw[i];
					const x = area.x + i * pointWidth;
					let y = mid - v * currentGain;
					y = Math.max(area.y, Math.min(area.y + area.h, y));
					if (i === 0) {
						this.ctx.moveTo(x, y);
					} else {
						this.ctx.lineTo(x, y);
					}
				}
				this.ctx.stroke();
			},
			clear() {
				this.clearTestWaveTimer();
				this.isTestMode = false;
				this.resetMeasurementState();
				this.dataRange = 1;
				this.amplifyFactor = 5.0;
				this.dataSourceTip = this.$t("准备测量");
				this.stopAnimation();
				this.forceDraw();
			},
			getQueueLength() {
				return this.dataList.length;
			},
			getFullDataCount() {
				return this.fullDataList.length;
			},
			getFullDataList() {
				return this.fullDataList;
			},
			getApiDataList() {
				return this.apiDataList;
			},
			getsampleRate() {
				return this.sampleRate;
			},
			calculateGain() {
				if (!this.isMeasuring) {
					const h = this.pxHeight - this.margin.top - this.margin.bottom;
					if (this.dataRange > 0) {
						this.gain = (h * 0.3) / this.dataRange;
					}
					const minGain = h * 0.1;
					const maxGain = h * 5;
					this.gain = Math.max(minGain, Math.min(this.gain, maxGain));
				}
			},
			setGain(gainValue) {
				if (this.showFullWaveMode) {
					this.gain = gainValue;
				} else {
					this.fixedGain = gainValue;
				}
				this.forceDraw();
			},
			setSampleRate(rate) {
				this.sampleRate = rate;
				this.segmentDataPoints = this.sampleRate * this.segmentDuration;
				this.updateDisplayDataLength();
				this.initDataArrays();
				this.forceDraw();
			},
			setFullWaveDuration(duration) {
				this.fullWaveDuration = duration;
				this.fullWaveEndTime = this.fullWaveStartTime + duration;
				if (this.showFullWaveMode) {
					this.updateFullWaveData();
				}
			},
			setNormalVoltageRange(range) {
				this.normalVoltageRange = range;
				if (range > 0) {
					this.signalGridRange = range;
				}
			},
			setSignalGridRange(range) {
				this.signalGridRange = range;
			},
			setMillivoltsPerSmallGrid(value) {
				this.millivoltsPerSmallGrid = value;
				this.millivoltsPerLargeGrid = value * (this.millimetersPerLargeGrid / this.millimetersPerSmallGrid);
				this.calculateStandardGain();
				this.forceDraw();
			},
			setSecondsPerSmallGrid(value) {
				this.secondsPerSmallGrid = value;
				this.secondsPerLargeGrid = value * (this.millimetersPerLargeGrid / this.millimetersPerSmallGrid);
				this.forceDraw();
			},
			setPixelsPerMm(value) {
				this.pixelsPerMm = value;
				this.calculateStandardGain();
				this.forceDraw();
			},
			setSegmentDuration(duration) {
				this.segmentDuration = duration;
				this.segmentDataPoints = this.sampleRate * duration;
				this.initDataArrays();
				this.forceDraw();
			},
			setScreenDuration(duration) {
				this.screenDuration = duration;
				this.scrollStartDuration = duration;
				this.updateDisplayDataLength();
				this.initDataArrays();
				this.forceDraw();
			},
			setFixedGain(gainValue) {
				this.fixedGain = gainValue;
				this.forceDraw();
			},
			setWaveColor(color) {
				this.waveColor = color;
				this.forceDraw();
			},
			setWaveLineWidth(width) {
				this.waveLineWidth = width;
				this.forceDraw();
			},
			setDrawSpeed(interval) {
				this.drawInterval = Math.max(80, interval);
				this.stopAnimation();
				this.startAnimation();
			},
			setDataFillSpeed(speed) {
				this.dataFillSpeed = Math.max(0.01, Math.min(0.1, speed));
			},
			setDataPushInterval(interval) {
				this.dataPushInterval = Math.max(80, interval);
			},
			async initCanvas() {
				return new Promise((resolve) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.wave-box').boundingClientRect(rect => {
						if (!rect || rect.width === 0 || rect.height === 0) {
							setTimeout(() => this.initCanvas(), 50);
							return;
						}
						const dpr = uni.getSystemInfoSync().pixelRatio || 1;
						// 宽度用逻辑像素，保证 5 秒扫屏与可见区域一致
						this.pxWidth = Math.floor(rect.width);
						// 高度保持原来的 dpr 缩放，与改前显示高度一致
						this.pxHeight = Math.floor(rect.height * dpr);
						this.ctx = uni.createCanvasContext('ecg-canvas', this);
						this.ctx.width = this.pxWidth;
						this.ctx.height = this.pxHeight;
						this.calculateStandardGain();
						this.draw();
						resolve();
					}).exec();
				});
			},
			reinitCanvas() {
				this.initCanvas();
			}
		},
		beforeDestroy() {
			this.clearTestWaveTimer();
			this.stopAnimation();
			if (this.timer) clearInterval(this.timer);
			if (this.drawTimer) clearTimeout(this.drawTimer);
			if (this.apiDataTimer) clearInterval(this.apiDataTimer);
		},
	};
</script>

<style scoped>
	.wave-box {
		width: 100%;
		height: 120px;
		position: relative;
		overflow: visible;
		background: #fafafa;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
	}

	.ecg-canvas {
		width: 100%;
		height: 100%;
		pointer-events: none;
		max-width: 100%;
		background: #fff;
	}

	/* 完整波形控制面板 - 放在第二根红色线下面 */
	.full-wave-controls {
		position: absolute;
		bottom: -260px;
		left: 12px;
		right: 8rpx;
		background: rgba(255, 255, 255, 0.95);
		padding: 12rpx;
		border-radius: 6rpx;
		border: 1px solid #e0e0e0;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.control-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.control-label {
		font-size: 24rpx;
		color: #333;
		width: 140rpx;
		flex-shrink: 0;
	}

	.time-slider {
		flex: 1;
		margin: 0 20rpx;
	}

	.time-value {
		font-size: 22rpx;
		color: #666;
		width: 180rpx;
		text-align: right;
		flex-shrink: 0;
	}
</style>