<template>
	<view class="full-ecg-container">
		<view class="top-bar">
			<text class="date-text">{{ currentDate }}</text>
		</view>
		<scroll-view class="wave-scroll" scroll-y :scroll-top="scrollTop" @scroll="onScroll">
			<view class="wave-box" :style="waveBoxStyle">
				<canvas canvas-id="ecg-canvas-upright" :style="canvasStyle" class="ecg-canvas" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { flipEcgDisplayPolarity } from './ecg-display-fix.js';

	/**
	 * 心电图详情（R 峰朝上）。基于 ecgFull 独立副本，不改原页。
	 */
	export default {
		data() {
			return {
				pxWidth: 0,
				pxHeight: 0,
				ctx: null,
				dataList: [], // 用于绘制（已放大）
				rawList: [], // 原始数据
				currentScale: 500, // mm/mV
				speed: 25, // mm/s (乐普标准速度)
				margin: {
					top: 15,
					bottom: 25,
					left: 10, // 进一步减少左边距
					right: 10 // 减少右边距
				},
				currentDate: '',
				createTime: '',
				dpr: 1,
				sampleRate: 250,
				pixelsPerMm: 1, // 乐普标准：1mm = 5px
				secondsPerRow: 3, // 每行显示3秒波形
				baselineWindowSize: 64,
				baselineInitSamples: 8,
				signalGridRange: 500,
				deviceToMvScale: 1,
				millivoltsPerSmallGrid: 1,
				leadOnThreshold: 0.001,
				baselineJumpThreshold: 400,
				rawFlatLineThresholdMv: 0.05,
				outlierThresholdMv: 500,
				rowHeight: 180, // px (乐普标准高度)
				rowSpacing: 45, // 波形行之间的间隔
				scrollTop: 0,
				totalRows: 0,
				amplifiedGroups: [], // 记录哪些组被放大
				consecutiveSameMinRun: 100, // 连续相同值达到该数量才做 ±1 交替偏移
				waveColor: '#050505',
				waveLineWidth: 1, //波形宽度
				centerLineColor: '#10BB13',
				visibleStartRow: 0,
				visibleEndRow: 0,
				maxVisibleRows: 8 // 最多同时绘制的行数
			};
		},
		computed: {
			canvasStyle() {
				return {
					width: this.pxWidth + 'px',
					height: this.pxHeight + 'px'
				};
			},
			waveBoxStyle() {
				return {
					height: this.pxHeight / this.dpr + 'px'
				};
			}
		},
		onLoad() {
			const channel = this.getOpenerEventChannel && this.getOpenerEventChannel();
			if (channel) {
				channel.once('sendData', arr => {
					if (arr && arr.length) this.processData(arr);
					console.log(arr)
				});
				channel.once('startTime', str => {
					this.currentDate = str;
				});
				channel.once('createTime', str => {
					this.createTime = str;
				});
			}

			setTimeout(() => {
				if (!this.dataList.length) {
					const cache = uni.getStorageSync('sendData');
					if (cache && cache.length) this.processData(cache);
				}
			}, 300);
		},
		onShow() {
			if (!this.dataList.length) {
				const cache = uni.getStorageSync('sendData');
				if (cache && cache.length) this.processData(cache);
			}
		},
		methods: {
			processData(arr) {
				if (!arr || !arr.length) return;
				// 仅本页：显示前取反，纠正 R 峰朝下（不影响上传/原 ecgFull）
				const flipped = flipEcgDisplayPolarity(arr);
				this.rawList = flipped;
				// unpackInt16ECG 输出已是 mV，与 ecg-wave 相同流程做基线去除
				const mvData = this.processEcgDataArray(flipped);
				const pointsPerGroup = this.secondsPerRow * this.sampleRate;
				const groups = Math.ceil(mvData.length / pointsPerGroup);
				const processed = [];
				this.amplifiedGroups = [];
				this.rowTimeOffsets = [];
				let displayRowIndex = 0;
				for (let i = 0; i < groups; i++) {
					const start = i * pointsPerGroup;
					const end = Math.min(start + pointsPerGroup, mvData.length);
					const group = mvData.slice(start, end);
					const filteredGroup = this.filterOutliers(group);
					const rawGroup = flipped.slice(start, end);

					if (this.isFlatLineWaveform(filteredGroup, rawGroup)) {
						continue;
					}

					displayRowIndex++;
					const adjustedGroup = this.offsetConsecutiveSameValues(filteredGroup);
					const normalizedGroup = this.normalizeGroupTo3Grid(adjustedGroup, displayRowIndex);
					processed.push(...normalizedGroup);
					this.rowTimeOffsets.push(i * this.secondsPerRow);
				}
				this.dataList = processed;
				this.dpr = 1;
				this.$nextTick(() => this.initCanvas());
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

			isInvalidRawSample(value) {
				return !Number.isFinite(value) || Math.abs(value) < this.leadOnThreshold;
			},

			getMaxDisplayMv() {
				return this.signalGridRange * this.millivoltsPerSmallGrid;
			},

			clampDisplayMv(mv) {
				const maxMv = this.getMaxDisplayMv();
				return Math.max(-maxMv, Math.min(maxMv, mv));
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

			getGroupPeakToPeak(arr) {
				if (!arr || !arr.length) return 0;
				let min = Infinity;
				let max = -Infinity;
				for (let i = 0; i < arr.length; i++) {
					const v = arr[i];
					if (v == null || !Number.isFinite(v)) continue;
					if (v < min) min = v;
					if (v > max) max = v;
				}
				return min === Infinity ? 0 : max - min;
			},

			getMaxConsecutiveSameCount(arr) {
				if (!arr || arr.length < 2) return arr ? arr.length : 0;
				let maxRun = 1;
				let run = 1;
				for (let i = 1; i < arr.length; i++) {
					if (arr[i] === arr[i - 1]) {
						run++;
						if (run > maxRun) maxRun = run;
					} else {
						run = 1;
					}
				}
				return maxRun;
			},

			// 连续相同值达到10个以上时，隔一个在 [-1, 1] 内随机偏移，其余数据不变
			offsetConsecutiveSameValues(arr) {
				if (!arr || !arr.length) return [];
				const minRun = this.consecutiveSameMinRun;
				const result = arr.slice();
				let i = 0;
				while (i < result.length) {
					let j = i + 1;
					while (j < result.length && result[j] === result[i]) j++;
					if (j - i >= minRun) {
						const baseVal = result[i];
						for (let k = i + 1; k < j; k++) {
							if ((k - i) % 2 === 1) {
								result[k] = baseVal + (Math.random() * 2 - 1);
							}
						}
					}
					i = j;
				}
				return result;
			},

			isFlatLineWaveform(mvGroup, rawGroup) {
				const pointsPerRow = this.secondsPerRow * this.sampleRate;
				const longRunThreshold = Math.floor(pointsPerRow * 0.8);
				if (this.getMaxConsecutiveSameCount(mvGroup) >= longRunThreshold) {
					return true;
				}
				if (this.getMaxConsecutiveSameCount(rawGroup) >= longRunThreshold) {
					return true;
				}
				if (this.getGroupPeakToPeak(mvGroup) >= this.rawFlatLineThresholdMv) {
					return false;
				}
				return this.getGroupPeakToPeak(rawGroup) < this.rawFlatLineThresholdMv;
			},

			// 将每组数据严格控制在三个大格子内（±1.0 mV - 乐普标准）
			normalizeGroupTo3Grid(arr, groupIndex) {
				if (!arr || !arr.length) return [];

				const valid = arr.filter(v => v != null && Number.isFinite(v));
				if (!valid.length) return arr.map(() => null);

				const min = Math.min(...valid);
				const max = Math.max(...valid);
				const pp = max - min;
				const mid = (max + min) / 2;

				const targetHalfRange = 1.0; // 乐普标准：三个大格子对应±1.0 mV
				const currentHalfRange = pp / 2;

				const mapValue = v => {
					if (v == null || !Number.isFinite(v)) return null;
					return (v - mid) / Math.max(currentHalfRange, 1e-6) * targetHalfRange;
				};

				if (pp < 0.0005) {
					const amp = targetHalfRange / Math.max(pp, 0.0001);
					const amplified = arr.map(v => {
						if (v == null || !Number.isFinite(v)) return null;
						return (v - mid) * amp;
					});

					const amplifiedValid = amplified.filter(v => v != null && Number.isFinite(v));
					if (!amplifiedValid.length) return amplified;

					const amplifiedMin = Math.min(...amplifiedValid);
					const amplifiedMax = Math.max(...amplifiedValid);
					const amplifiedPp = amplifiedMax - amplifiedMin;

					if (amplifiedPp > 2) {
						const scaleFactor = 2 / amplifiedPp;
						return amplified.map(v => v == null ? null : v * scaleFactor);
					}

					this.amplifiedGroups.push(groupIndex);
					return amplified;
				}

				if (currentHalfRange > targetHalfRange) {
					const scaleFactor = targetHalfRange / currentHalfRange;
					return arr.map(v => {
						if (v == null || !Number.isFinite(v)) return null;
						return (v - mid) * scaleFactor;
					});
				}

				return arr.map(mapValue);
			},

			// 过滤超出 ±500 mV 显示范围的尖峰
			filterOutliers(arr) {
				if (!arr || !arr.length) return [];

				const threshold = this.outlierThresholdMv;
				const result = [...arr];
				for (let i = 0; i < arr.length; i++) {
					if (!Number.isFinite(arr[i]) || Math.abs(arr[i]) <= threshold) continue;

					const validValues = [];
					if (i > 0 && Number.isFinite(arr[i - 1]) && Math.abs(arr[i - 1]) <= threshold) {
						validValues.push(arr[i - 1]);
					}
					if (i < arr.length - 1 && Number.isFinite(arr[i + 1]) && Math.abs(arr[i + 1]) <= threshold) {
						validValues.push(arr[i + 1]);
					}
					result[i] = validValues.length ?
						validValues.reduce((sum, val) => sum + val, 0) / validValues.length :
						0;
				}
				return result;
			},

			initCanvas() {
				if (!this.dataList.length) return;
				const query = uni.createSelectorQuery().in(this);
				query.select('.wave-scroll').boundingClientRect(rect => {
					if (!rect || rect.width === 0) {
						setTimeout(() => this.initCanvas(), 50);
						return;
					}
					this.pxWidth = Math.floor(rect.width);
					this.calculateCanvasHeight();
					this.ctx = uni.createCanvasContext('ecg-canvas-upright', this);

					// 初始只绘制前几行
					this.visibleStartRow = 0;
					this.visibleEndRow = Math.min(this.maxVisibleRows, this.totalRows);
					this.drawVisibleRows();
				}).exec();
			},

			getRowTotalHeight() {
				return this.rowHeight + this.rowSpacing;
			},

			calculateCanvasHeight() {
				const pointsPerRow = this.secondsPerRow * this.sampleRate;
				this.totalRows = Math.ceil(this.dataList.length / pointsPerRow);
				this.pxHeight = this.getRowTotalHeight() * this.totalRows;
			},

			// 滚动事件处理
			onScroll(event) {
				const scrollTop = event.detail.scrollTop;
				const rowHeight = this.getRowTotalHeight();
				const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
				const endRow = Math.min(this.totalRows, startRow + this.maxVisibleRows + 2);

				if (startRow !== this.visibleStartRow || endRow !== this.visibleEndRow) {
					this.visibleStartRow = startRow;
					this.visibleEndRow = endRow;
					this.drawVisibleRows();
				}
			},

			// 只绘制可见区域的行
			drawVisibleRows() {
				if (!this.ctx || this.pxWidth === 0 || !this.dataList.length) return;

				const w = this.pxWidth;
				const h = this.pxHeight;
				const m = this.margin;
				const area = {
					x: m.left,
					y: m.top,
					w: w - (m.left + m.right),
					h: h - (m.top + m.bottom)
				};

				// 清除画布
				this.ctx.clearRect(0, 0, w, h);
				this.ctx.fillStyle = '#fff';
				this.ctx.fillRect(0, 0, w, h);

				// 只绘制可见区域的网格和波形
				this.drawVisibleGrid(area);
				this.drawVisibleWaveform(area);

				this.ctx.draw(false);
			},

			// 绘制可见区域的网格 - 红色网格线
			drawVisibleGrid(area) {
				// 乐普标准格子尺寸：小格子1mm，大格子5mm
				const small = 5, // 1mm = 5px
					large = 25; // 5mm = 25px

				// 正确定义边界变量
				const rightBound = area.x + area.w;
				const bottomBound = area.y + area.h;

				// 只绘制可见区域的网格
				const visibleTop = Math.max(area.y, this.visibleStartRow * this.getRowTotalHeight());
				const visibleBottom = Math.min(bottomBound, this.visibleEndRow * this.getRowTotalHeight());

				// 小格子 - 浅红色
				this.ctx.strokeStyle = '#ffcccc';
				this.ctx.lineWidth = 0.5;
				for (let x = area.x; x <= rightBound; x += small) {
					this.ctx.beginPath();
					this.ctx.moveTo(x, visibleTop);
					this.ctx.lineTo(x, visibleBottom);
					this.ctx.stroke();
				}
				for (let y = visibleTop; y <= visibleBottom; y += small) {
					this.ctx.beginPath();
					this.ctx.moveTo(area.x, y);
					this.ctx.lineTo(rightBound, y);
					this.ctx.stroke();
				}

				// 大格子 - 红色
				this.ctx.strokeStyle = '#ff6666';
				this.ctx.lineWidth = 1.0;
				for (let x = area.x; x <= rightBound; x += large) {
					this.ctx.beginPath();
					this.ctx.moveTo(x, visibleTop);
					this.ctx.lineTo(x, visibleBottom);
					this.ctx.stroke();
				}
				for (let y = visibleTop; y <= visibleBottom; y += large) {
					this.ctx.beginPath();
					this.ctx.moveTo(area.x, y);
					this.ctx.lineTo(rightBound, y);
					this.ctx.stroke();
				}
			},

			applyWaveStrokeStyle() {
				this.ctx.strokeStyle = this.waveColor;
				this.ctx.lineWidth = this.waveLineWidth;
				this.ctx.lineCap = 'round';
				this.ctx.lineJoin = 'round';
			},

			drawRowCenterLine(area, centerY) {
				this.ctx.strokeStyle = this.centerLineColor;
				this.ctx.lineWidth = 0.8;
				this.ctx.beginPath();
				this.ctx.moveTo(area.x, centerY);
				this.ctx.lineTo(area.x + area.w, centerY);
				this.ctx.stroke();
			},

			// 绘制可见区域的波形
			drawVisibleWaveform(area) {
				const gain = 50; // 乐普标准增益
				const pointsPerRow = this.secondsPerRow * this.sampleRate;
				const rowTotalHeight = this.getRowTotalHeight();

				this.ctx.fillStyle = '#333333';
				this.ctx.font = `14px Arial`;
				this.ctx.textAlign = 'left';

				for (let row = this.visibleStartRow; row < this.visibleEndRow; row++) {
					const start = row * pointsPerRow;
					const end = Math.min(start + pointsPerRow, this.dataList.length);
					const rowData = this.dataList.slice(start, end);
					if (rowData.length === 0) continue;

					const rowTop = area.y + row * rowTotalHeight;
					const centerY = rowTop + this.rowHeight / 2;
					const rowBottom = rowTop + this.rowHeight;
					const yMin = rowTop + 22;
					const yMax = rowBottom - 2;
					const sec = this.rowTimeOffsets[row] != null ?
						this.rowTimeOffsets[row] :
						row * this.secondsPerRow;
					const timeBase = this.createTime ?
						new Date(this.createTime.replace(' ', 'T')) :
						new Date();
					const startDate = Number.isNaN(timeBase.getTime()) ? new Date() : timeBase;
					const t = startDate.getTime() + sec * 1000;
					const dt = new Date(t);
					const h = String(dt.getHours()).padStart(2, '0');
					const m = String(dt.getMinutes()).padStart(2, '0');
					const s = String(dt.getSeconds()).padStart(2, '0');
					const timeStr = `${h}:${m}:${s}`;

					// 绘制时间标签
					this.ctx.fillStyle = '#000000';
					this.ctx.font = `bold 13px Arial`;
					this.ctx.fillText(timeStr, area.x + 5, rowTop + 18);
					this.ctx.fillStyle = '#333333';

					// 绘制导联信息
					this.ctx.font = `12px Arial`;
					this.ctx.fillText('导联 II', area.x + 80, rowTop + 18);

					// 绘制放大标记
					if (this.amplifiedGroups.includes(row + 1)) {
						this.ctx.fillStyle = '#ff0000';
						this.ctx.font = `bold 11px Arial`;
						this.ctx.fillText('*需信号增强*', area.x + 130, rowTop + 18);
						this.ctx.fillStyle = '#333333';
					}

					this.drawRowCenterLine(area, centerY);

					// 绘制波形
					this.applyWaveStrokeStyle();
					this.ctx.beginPath();
					let hasPoint = false;
					for (let i = 0; i < rowData.length; i++) {
						const val = rowData[i];
						if (!Number.isFinite(val)) continue;
						const x = area.x + (i / pointsPerRow) * area.w;
						const y = Math.max(yMin, Math.min(yMax, centerY - val * gain));
						if (!hasPoint) {
							this.ctx.moveTo(x, y);
							hasPoint = true;
						} else {
							this.ctx.lineTo(x, y);
						}
					}
					if (hasPoint) {
						this.ctx.stroke();
					}

					// 绘制速度标尺 - 调整位置避免超出
					if (row === this.visibleStartRow) {
						const scaleX = Math.min(area.x + area.w - 60, area.x + area.w - 70);
						this.ctx.strokeStyle = '#000000';
						this.ctx.lineWidth = 1;
						this.ctx.beginPath();
						this.ctx.moveTo(scaleX, rowTop + 10);
						this.ctx.lineTo(scaleX + 50, rowTop + 10);
						// this.ctx.stroke();
						// this.ctx.fillStyle = '#000000';
						// this.ctx.font = '11px Arial';
						// this.ctx.fillText('25mm/s', scaleX + 5, rowTop + 25);
					}
				}
			}
		}
	};
</script>

<style scoped>
	.full-ecg-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #fff;
		color: #000;
		font-family: 'Arial', 'Microsoft YaHei', sans-serif;
	}

	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background: linear-gradient(135deg, #0066cc, #0099ff);
		color: white;
		flex-shrink: 0;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.date-text {
		font-size: 36rpx;
		font-weight: 600;
	}

	.wave-scroll {
		flex: 1;
		width: 100%;
		background: #fafafa;
		overflow-x: hidden;
	}

	.wave-box {
		width: 100%;
		background: #fff;
		box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.05);
	}

	.ecg-canvas {
		width: 100%;
		background: #fff;
		display: block;
	}
</style>