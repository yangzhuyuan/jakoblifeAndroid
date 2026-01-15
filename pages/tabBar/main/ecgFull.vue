<template>
	<view class="full-ecg-container">
		<view class="top-bar">
			<text class="date-text">{{ currentDate }}</text>
		</view>
		<scroll-view class="wave-scroll" scroll-y :scroll-top="scrollTop" @scroll="onScroll">
			<view class="wave-box" :style="waveBoxStyle">
				<canvas canvas-id="ecg-canvas" :style="canvasStyle" class="ecg-canvas" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pxWidth: 0,
				pxHeight: 0,
				ctx: null,
				dataList: [], // 用于绘制（已放大）
				rawList: [], // 原始数据
				currentScale: 10, // mm/mV
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
				pixelsPerMm: 5, // 乐普标准：1mm = 5px
				secondsPerRow: 5, // 每5秒一组波形数据
				rowHeight: 180, // px (乐普标准高度)
				scrollTop: 0,
				totalRows: 0,
				amplifiedGroups: [], // 记录哪些组被放大
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
				this.rawList = arr;
				const pointsPerGroup = this.secondsPerRow * this.sampleRate;
				const groups = Math.ceil(arr.length / pointsPerGroup);
				const processed = [];
				this.amplifiedGroups = [];

				for (let i = 0; i < groups; i++) {
					const start = i * pointsPerGroup;
					const end = Math.min(start + pointsPerGroup, arr.length);
					const group = arr.slice(start, end);

					// 1. 过滤超过±0.02的异常数据
					const filteredGroup = this.filterOutliers(group);

					// 2. 将每组数据严格控制在三个大格子内
					const normalizedGroup = this.normalizeGroupTo3Grid(filteredGroup, i + 1);

					processed.push(...normalizedGroup);
				}
				this.dataList = processed;
				this.dpr = 1;
				this.$nextTick(() => this.initCanvas());
			},

			// 将每组数据严格控制在三个大格子内（±1.0 mV - 乐普标准）
			normalizeGroupTo3Grid(arr, groupIndex) {
				if (!arr || !arr.length) return [];

				const min = Math.min(...arr);
				const max = Math.max(...arr);
				const pp = max - min;
				const mid = (max + min) / 2;

				const targetHalfRange = 1.0; // 乐普标准：三个大格子对应±1.0 mV
				const currentHalfRange = pp / 2;

				if (pp < 0.0005) {
					const amp = targetHalfRange / Math.max(pp, 0.0001);
					const amplified = arr.map(v => (v - mid) * amp);

					const amplifiedMin = Math.min(...amplified);
					const amplifiedMax = Math.max(...amplified);
					const amplifiedPp = amplifiedMax - amplifiedMin;

					if (amplifiedPp > 2) {
						const scaleFactor = 2 / amplifiedPp;
						return amplified.map(v => v * scaleFactor);
					}

					this.amplifiedGroups.push(groupIndex);
					return amplified;
				}

				if (currentHalfRange > targetHalfRange) {
					const scaleFactor = targetHalfRange / currentHalfRange;
					return arr.map(v => (v - mid) * scaleFactor);
				} else {
					return arr.map(v => (v - mid) / currentHalfRange * targetHalfRange);
				}
			},

			// 过滤异常数据
			filterOutliers(arr) {
				if (!arr || !arr.length) return [];

				const threshold = 0.02;
				let filteredCount = 0;

				const result = [...arr];
				for (let i = 0; i < arr.length; i++) {
					if (Math.abs(arr[i]) > threshold) {
						filteredCount++;
						let validValues = [];
						if (i > 0 && Math.abs(arr[i - 1]) <= threshold) validValues.push(arr[i - 1]);
						if (i < arr.length - 1 && Math.abs(arr[i + 1]) <= threshold) validValues.push(arr[i + 1]);

						if (validValues.length > 0) {
							result[i] = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
						} else {
							result[i] = 0;
						}
					}
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
					this.ctx = uni.createCanvasContext('ecg-canvas', this);

					// 初始只绘制前几行
					this.visibleStartRow = 0;
					this.visibleEndRow = Math.min(this.maxVisibleRows, this.totalRows);
					this.drawVisibleRows();
				}).exec();
			},

			calculateCanvasHeight() {
				const pointsPerRow = this.secondsPerRow * this.sampleRate;
				this.totalRows = Math.ceil(this.dataList.length / pointsPerRow);
				const rowSpacing = 25;
				this.pxHeight = (this.rowHeight + rowSpacing) * this.totalRows;
			},

			// 滚动事件处理
			onScroll(event) {
				const scrollTop = event.detail.scrollTop;
				const rowHeight = this.rowHeight + 25;
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
				const visibleTop = Math.max(area.y, this.visibleStartRow * (this.rowHeight + 25));
				const visibleBottom = Math.min(bottomBound, this.visibleEndRow * (this.rowHeight + 25));

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

			// 绘制可见区域的波形 - 统一粗细
			drawVisibleWaveform(area) {
				const gain = 50; // 乐普标准增益
				const pointsPerRow = this.secondsPerRow * this.sampleRate;
				const rowTotalHeight = this.rowHeight + 25;

				// 统一波形颜色和粗细
				this.ctx.strokeStyle = '#000000'; // 黑色波形
				this.ctx.lineWidth = 1; // 统一粗细
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
					const sec = row * this.secondsPerRow;
					const startDate = new Date(this.createTime.replace(' ', 'T'));
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
						this.ctx.fillText('*信号增强*', area.x + 130, rowTop + 18);
						this.ctx.fillStyle = '#333333';
					}

					// 绘制波形 - 所有波形使用统一粗细
					this.ctx.beginPath();
					for (let i = 0; i < rowData.length; i++) {
						const x = area.x + (i / pointsPerRow) * area.w;
						const y = centerY - rowData[i] * gain;
						if (i === 0) {
							this.ctx.moveTo(x, y);
						} else {
							this.ctx.lineTo(x, y);
						}
					}
					this.ctx.stroke();

					// 绘制速度标尺 - 调整位置避免超出
					if (row === this.visibleStartRow) {
						const scaleX = Math.min(area.x + area.w - 60, area.x + area.w - 70);
						this.ctx.strokeStyle = '#000000';
						this.ctx.lineWidth = 1;
						this.ctx.beginPath();
						this.ctx.moveTo(scaleX, rowTop + 10);
						this.ctx.lineTo(scaleX + 50, rowTop + 10);
						this.ctx.stroke();
						this.ctx.fillStyle = '#000000';
						this.ctx.font = '11px Arial';
						this.ctx.fillText('25mm/s', scaleX + 5, rowTop + 25);
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