<template>
	<view class="wave-box">
		<canvas canvas-id="ecg-canvas" :style="canvasStyle" class="ecg-canvas" />
		<!-- 完整波形显示按钮 -->
		<view class="full-wave-control" v-if="showFullWaveControls">
			<button class="mini-btn" @tap="zoomIn">{{$t("放大")}}</button>
			<button class="mini-btn" @tap="zoomOut">{{$t("缩小")}}</button>
			<button class="mini-btn" @tap="autoGain">{{$t("自动")}}</button>
			<button class="mini-btn" @tap="hideFullWave">{{$t("返回实时")}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			canvasStyle() {
				const dpr = uni.getSystemInfoSync().pixelRatio;
				return {
					width: this.pxWidth + 'px',
					height: this.pxHeight + 'px'
				};
			}
		},

		data() {
			return {
				ctx: null,
				dataList: [],
				fullDataList: [], // 存储完整的测量数据
				maxPoints: 500,
				pxWidth: 0,
				pxHeight: 0,
				gain: 50,
				dataRange: 1,
				margin: {
					top: 30, // 增加上边距显示电压轴
					right: 50, // 增加右边距显示时间轴
					bottom: 30, // 增加下边距显示时间轴标签
					left: 50 // 增加左边距显示电压轴标签
				},
				showFullWaveMode: false, // 是否显示完整波形模式
				showFullWaveControls: false, // 是否显示完整波形控制按钮
				originalDataList: [], // 保存原始数据用于返回实时模式
				drawTimer: null, // 绘制定时器
				isDrawing: false, // 防止重复绘制
				sampleRate: 250, // 采样率，单位Hz，可根据实际情况调整
				gridSize: {
					x: 50, // 时间网格大小（像素）
					y: 25 // 电压网格大小（像素）
				},
				startTime: 0, // 记录开始时间
				currentTimeOffset: 0, // 当前时间偏移量
				totalDataPoints: 0, // 总数据点数
				fullWaveDuration: 60, // 完整波形显示时长，60秒
				fullWaveZoom: 1.0, // 完整波形缩放因子（同时影响时间和电压）
				baseFullWaveGain: 50 // 完整波形基础增益
			};
		},
		mounted() {
			this.$nextTick(() => {
				this.initCanvas();
			});
			// 降低实时模式的绘制频率
			this.timer = setInterval(() => {
				if (!this.showFullWaveMode && !this.isDrawing) {
					this.draw();
				}
			}, 50); // 改为50ms，20fps

			// 初始化开始时间
			this.startTime = Date.now();
		},
		methods: {
			pushData(arr) {
				this.dataList.push(...arr);

				// 同时保存到完整数据列表
				this.fullDataList.push(...arr);
				this.totalDataPoints += arr.length;

				// 更新数据范围统计
				if (arr.length > 0) {
					const newMin = Math.min(...arr);
					const newMax = Math.max(...arr);
					const currentRange = Math.max(Math.abs(newMin), Math.abs(newMax));

					if (currentRange > this.dataRange) {
						this.dataRange = currentRange;
					} else {
						this.dataRange = this.dataRange * 0.999 + currentRange * 0.001;
					}

					this.dataRange = Math.max(0.1, Math.max(...this.dataList.map(Math.abs)));
					this.calculateGain();
				}

				if (this.dataList.length > this.maxPoints) {
					this.dataList = this.dataList.slice(-this.maxPoints);
				}

				// 更新时间偏移量（基于总数据点数和采样率）
				this.currentTimeOffset = this.totalDataPoints / this.sampleRate;
			},

			// 在 showFullWave 方法中添加渐进式加载
			showFullWave() {
				if (this.fullDataList.length === 0) {
					uni.showToast({
						title: this.$t("暂无测量数据"),
						icon: 'none'
					});
					return;
				}

				this.showFullWaveMode = true;
				this.showFullWaveControls = true;
				this.originalDataList = [...this.dataList];
				this.fullWaveZoom = 1.0; // 重置缩放

				// 获取完整60秒范围的数据（包含空白区域）
				const dataForFullWave = this.getDataForFullWave();
				this.dataList = this.sampleDataForFullWave(dataForFullWave);
				this.calculateGainForFullData();
				this.forceDraw();

				// 如果数据量很大，提示用户
				if (this.fullDataList.length > 5000) {
					uni.showToast({
						title: this.$t("数据量较大已自动优化显示"),
						icon: 'none',
						duration: 2000
					});
				}
			},

			// 获取完整60秒范围的数据（包含空白区域）
			getDataForFullWave() {
				const targetPoints = this.fullWaveDuration * this.sampleRate;

				if (this.fullDataList.length >= targetPoints) {
					// 如果数据超过60秒，只取最后60秒的数据
					return this.fullDataList.slice(-targetPoints);
				} else {
					// 如果数据不足60秒，在前面补0，确保显示完整的60秒范围
					const missingPoints = targetPoints - this.fullDataList.length;
					const padding = new Array(missingPoints).fill(0);
					return [...padding, ...this.fullDataList];
				}
			},

			// 数据采样，减少完整波形模式下的数据点数
			sampleDataForFullWave(data) {
				if (data.length <= 2000) {
					return [...data]; // 数据量不大，直接返回
				}

				// 数据量很大时进行采样
				const targetPoints = 2000; // 目标点数
				const sampleInterval = Math.ceil(data.length / targetPoints);
				const sampledData = [];

				for (let i = 0; i < data.length; i += sampleInterval) {
					sampledData.push(data[i]);
				}

				console.log(`数据采样: ${data.length} -> ${sampledData.length} 点`);
				return sampledData;
			},

			// 隐藏完整波形，返回实时显示
			hideFullWave() {
				this.showFullWaveMode = false;
				this.showFullWaveControls = false;
				this.fullWaveZoom = 1.0; // 重置缩放

				// 恢复实时数据显示
				if (this.originalDataList.length > 0) {
					this.dataList = [...this.originalDataList];
				} else {
					// 如果没有保存的原始数据，就显示最近的数据
					if (this.fullDataList.length > this.maxPoints) {
						this.dataList = this.fullDataList.slice(-this.maxPoints);
					}
				}

				// 重新计算增益
				this.calculateGain();
				console.log('返回实时模式，数据点数:', this.dataList.length, '增益:', this.gain);
				this.forceDraw();
			},

			// 强制绘制（防抖）
			forceDraw() {
				if (this.isDrawing) return;

				this.isDrawing = true;
				if (this.drawTimer) {
					clearTimeout(this.drawTimer);
				}

				this.drawTimer = setTimeout(() => {
					this.draw();
					this.isDrawing = false;
				}, 16); // 约60fps
			},

			// 为完整数据计算增益
			calculateGainForFullData() {
				if (this.fullDataList.length === 0) return;

				const h = this.pxHeight - this.margin.top - this.margin.bottom;
				const dataRange = Math.max(0.1, Math.max(...this.fullDataList.map(Math.abs)));

				if (dataRange > 0) {
					this.baseFullWaveGain = (h * 0.4) / dataRange; // 完整波形使用稍小的增益
				}

				const minGain = h * 0.05;
				const maxGain = h * 3;
				this.baseFullWaveGain = Math.max(minGain, Math.min(this.baseFullWaveGain, maxGain));

				console.log('完整波形基础增益计算:', {
					dataRange,
					baseFullWaveGain: this.baseFullWaveGain,
					height: h
				});
			},

			// 计算当前完整波形增益（考虑缩放）
			getCurrentFullWaveGain() {
				return this.baseFullWaveGain * this.fullWaveZoom;
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

				this.ctx.clearRect(0, 0, w, h);
				this.ctx.fillStyle = '#000';
				this.ctx.fillRect(0, 0, w, h);

				// 绘制坐标轴
				this.drawAxes(area);

				// 网格
				this.drawGrid(area);

				// 波形
				if (this.dataList.length >= 2) {
					if (this.showFullWaveMode) {
						this.drawFullWaveform(area);
					} else {
						this.drawWaveform(area);
					}
				}

				this.ctx.draw(true);
			},

			// 绘制坐标轴
			drawAxes(area) {
				const m = this.margin;
				const w = this.pxWidth;
				const h = this.pxHeight;

				// 设置坐标轴样式
				this.ctx.strokeStyle = '#00FF00';
				this.ctx.lineWidth = 2;
				this.ctx.fillStyle = '#00FF00';
				this.ctx.font = '12px Arial';
				this.ctx.textAlign = 'center';
				this.ctx.textBaseline = 'middle';

				// 绘制电压轴（Y轴）
				this.ctx.beginPath();
				this.ctx.moveTo(m.left, m.top);
				this.ctx.lineTo(m.left, h - m.bottom);
				this.ctx.stroke();

				// 绘制时间轴（X轴）
				this.ctx.beginPath();
				this.ctx.moveTo(m.left, h - m.bottom);
				this.ctx.lineTo(w - m.right, h - m.bottom);
				this.ctx.stroke();

				// 绘制电压轴标签和刻度
				this.drawVoltageAxis(area);

				// 绘制时间轴标签和刻度
				this.drawTimeAxis(area);

				// 绘制轴标题
				this.drawAxisTitles(area);
			},

			// 绘制电压轴
			drawVoltageAxis(area) {
				const m = this.margin;
				const midY = area.y + area.h / 2;

				// 根据当前模式选择增益
				let currentGain;
				if (this.showFullWaveMode) {
					currentGain = this.getCurrentFullWaveGain(); // 完整波形使用缩放后的增益
				} else {
					currentGain = this.gain;
				}

				const voltageStep = this.calculateVoltageStep(currentGain, area.h);

				// 计算显示的电压值范围
				const maxVoltage = (area.h / 2) / currentGain;

				// 使用Set来避免重复的电压值
				const drawnVoltages = new Set();

				for (let voltage = -maxVoltage; voltage <= maxVoltage; voltage += voltageStep) {
					if (voltage === 0) continue; // 跳过0点，因为已经在中心线

					const y = midY - voltage * currentGain;
					if (y >= area.y && y <= area.y + area.h) {
						// 检查是否已经绘制过这个电压值
						const voltageKey = voltage.toFixed(1);
						if (!drawnVoltages.has(voltageKey)) {
							drawnVoltages.add(voltageKey);

							// 绘制刻度线
							this.ctx.beginPath();
							this.ctx.moveTo(m.left - 5, y);
							this.ctx.lineTo(m.left, y);
							this.ctx.stroke();

							// 绘制标签
							this.ctx.textAlign = 'right';
							this.ctx.fillText(voltage.toFixed(1) + 'V', m.left - 8, y);
						}
					}
				}
			},

			// 计算合适的电压步长
			calculateVoltageStep(currentGain, areaHeight) {
				const pixelsPerVolt = currentGain;
				const targetPixelsPerStep = 40; // 每40像素一个刻度

				// 使用标准电压步长值
				const standardSteps = [0.1, 0.2, 0.5, 1, 2, 5];

				// 找到最合适的步长
				for (let i = 0; i < standardSteps.length; i++) {
					if (pixelsPerVolt * standardSteps[i] >= targetPixelsPerStep) {
						return standardSteps[i];
					}
				}

				// 如果所有步长都太小，使用最大值
				return standardSteps[standardSteps.length - 1];
			},

			// 绘制时间轴
			drawTimeAxis(area) {
				const m = this.margin;
				const w = this.pxWidth;
				const h = this.pxHeight;

				if (this.showFullWaveMode) {
					// 完整波形模式：显示从0到60秒的时间
					const totalDisplayTime = this.fullWaveDuration * this.fullWaveZoom; // 根据缩放调整显示的时间范围
					const startTime = 0;
					const endTime = totalDisplayTime;

					// 计算合适的时间步长
					const timeStep = this.calculateFullWaveTimeStep(totalDisplayTime, area.w);

					console.log('完整波形时间轴:', {
						totalDisplayTime,
						timeStep,
						areaWidth: area.w,
						zoom: this.fullWaveZoom
					});

					// 绘制时间刻度和标签
					for (let time = 0; time <= endTime; time += timeStep) {
						const progress = (time - startTime) / totalDisplayTime;
						const x = m.left + progress * area.w;

						// 确保x坐标在有效范围内
						if (x < m.left || x > w - m.right) continue;

						// 绘制刻度线
						this.ctx.beginPath();
						this.ctx.moveTo(x, h - m.bottom);
						this.ctx.lineTo(x, h - m.bottom + 5);
						this.ctx.stroke();

						// 绘制标签
						this.ctx.textAlign = 'center';
						this.ctx.fillText(time + 's', x, h - m.bottom + 15);
					}

					// 确保显示最后一个刻度
					const lastX = m.left + area.w;
					if (lastX <= w - m.right) {
						this.ctx.beginPath();
						this.ctx.moveTo(lastX, h - m.bottom);
						this.ctx.lineTo(lastX, h - m.bottom + 5);
						this.ctx.stroke();
						this.ctx.textAlign = 'center';
						this.ctx.fillText(endTime + 's', lastX, h - m.bottom + 15);
					}

				} else {
					// 实时模式：时间轴从0开始，跟随波形移动
					const timeStep = this.calculateTimeStep();
					const displayDuration = this.maxPoints / this.sampleRate; // 显示窗口时长
					const currentTime = this.currentTimeOffset;

					// 计算显示的时间范围：从 max(0, currentTime - displayDuration) 到 currentTime
					const startTime = Math.max(0, currentTime - displayDuration);
					const endTime = currentTime;

					// 计算第一个刻度位置
					const firstTick = Math.ceil(startTime / timeStep) * timeStep;

					for (let time = firstTick; time <= endTime; time += timeStep) {
						const progress = (time - startTime) / displayDuration;
						const x = m.left + progress * area.w;

						if (x >= m.left && x <= w - m.right) {
							// 绘制刻度线
							this.ctx.beginPath();
							this.ctx.moveTo(x, h - m.bottom);
							this.ctx.lineTo(x, h - m.bottom + 5);
							this.ctx.stroke();

							// 绘制标签
							this.ctx.textAlign = 'center';
							this.ctx.fillText(time.toFixed(1) + 's', x, h - m.bottom + 15);
						}
					}

					// 在右上角显示当前时间
					this.ctx.textAlign = 'right';
					this.ctx.fillText(this.$t('当前') + `: ${currentTime.toFixed(1)}s`, w - m.right, m.top + 15);

					// 在左上角显示开始时间
					this.ctx.textAlign = 'left';
					this.ctx.fillText(this.$t('开始') + `: 0.0s`, m.left, m.top + 15);
				}
			},

			// 计算完整波形模式下的时间步长
			calculateFullWaveTimeStep(totalTime, areaWidth) {
				const pixelsPerSecond = areaWidth / totalTime;

				// 根据像素密度选择合适的步长
				if (pixelsPerSecond * 10 >= 50) {
					return 10; // 每10秒一个刻度
				} else if (pixelsPerSecond * 5 >= 50) {
					return 5; // 每5秒一个刻度
				} else if (pixelsPerSecond * 2 >= 50) {
					return 2; // 每2秒一个刻度
				} else {
					return 1; // 每1秒一个刻度
				}
			},

			// 绘制轴标题
			drawAxisTitles(area) {
				const m = this.margin;
				const h = this.pxHeight;
				const midY = area.y + area.h / 2;

				// 电压轴标题
				this.ctx.save();
				this.ctx.translate(m.left - 25, midY);
				this.ctx.rotate(-Math.PI / 2);
				this.ctx.textAlign = 'center';
				this.ctx.fillText('', 0, 0);
				this.ctx.restore();

				// 时间轴标题
				this.ctx.textAlign = 'center';
				this.ctx.fillText('(s)', m.left + area.w / 2, h - 10);
			},

			// 计算合适的时间步长
			calculateTimeStep() {
				const areaW = this.pxWidth - this.margin.left - this.margin.right;
				const displayDuration = this.maxPoints / this.sampleRate;
				const pixelsPerSecond = areaW / displayDuration;
				const targetPixelsPerStep = 80; // 每80像素一个刻度

				let step = 1; // 从1秒开始
				const possibleSteps = [1, 2, 5, 10, 15, 20, 30, 60];

				// 找到最合适的步长
				for (let i = 0; i < possibleSteps.length; i++) {
					if (pixelsPerSecond * possibleSteps[i] >= targetPixelsPerStep) {
						step = possibleSteps[i];
						break;
					}
				}

				// 如果所有步长都太小，使用最大值
				if (pixelsPerSecond * step < targetPixelsPerStep) {
					step = possibleSteps[possibleSteps.length - 1];
				}

				return step;
			},

			// 绘制完整波形（优化版本）
			drawFullWaveform(area) {
				if (this.dataList.length < 2) return;

				const totalDisplayTime = this.fullWaveDuration * this.fullWaveZoom;
				const step = area.w / this.dataList.length;
				const mid = area.y + area.h / 2;
				const top = area.y;
				const bottom = area.y + area.h;

				this.ctx.strokeStyle = '#00FF00';
				this.ctx.lineWidth = 1; // 完整波形线宽更细
				this.ctx.beginPath();

				for (let i = 0; i < this.dataList.length; i++) {
					const v = this.dataList[i];
					const x = area.x + i * step;
					let y = mid - v * this.getCurrentFullWaveGain(); // 使用缩放后的增益
					y = Math.max(top, Math.min(bottom, y));

					if (i === 0) {
						this.ctx.moveTo(x, y);
					} else {
						this.ctx.lineTo(x, y);
					}
				}

				this.ctx.stroke();

				// 在完整波形模式下显示信息
				this.ctx.fillStyle = '#00FF00';
				this.ctx.font = '12px Arial';
				this.ctx.textAlign = 'left';
				const actualDuration = this.fullDataList.length / this.sampleRate;
				this.ctx.fillText(
					`显示: 0-${totalDisplayTime.toFixed(1)}s | 实际数据: 0-${actualDuration.toFixed(1)}s | 缩放: ${this.fullWaveZoom.toFixed(1)}x`,
					area.x + 10, area.y + 20);
			},

			// 原有的绘制方法
			drawWaveform(area) {
				const step = area.w / this.maxPoints;
				const mid = area.y + area.h / 2;
				const top = area.y;
				const bottom = area.y + area.h;

				this.ctx.strokeStyle = '#00FF00';
				this.ctx.lineWidth = 2;
				this.ctx.beginPath();

				// 计算数据在画布上的起始位置（让波形从右向左移动）
				const dataStartIndex = Math.max(0, this.dataList.length - this.maxPoints);
				const visibleData = this.dataList.slice(dataStartIndex);

				for (let i = 0; i < visibleData.length; i++) {
					const v = visibleData[i];
					const x = area.x + i * step;
					let y = mid - v * this.gain;

					if (y < top) y = top;
					if (y > bottom) y = bottom;

					if (i === 0) {
						this.ctx.moveTo(x, y);
					} else {
						this.ctx.lineTo(x, y);
					}
				}
				this.ctx.stroke();

				// 在实时模式下显示信息
				this.ctx.fillStyle = '#00FF00';
				this.ctx.font = '12px Arial';
				this.ctx.textAlign = 'left';
				this.ctx.fillText(`实时模式 | 增益: ${this.gain.toFixed(1)}`, area.x + 10, area.y + 20);
			},

			// 清空数据
			clear() {
				this.dataList = [];
				this.fullDataList = [];
				this.originalDataList = [];
				this.totalDataPoints = 0;
				this.currentTimeOffset = 0;
				this.dataRange = 1;
				this.startTime = Date.now();
				this.calculateGain();
				this.forceDraw();
			},

			// 获取数据队列长度
			getQueueLength() {
				return this.dataList.length;
			},

			// 获取完整数据点数
			getFullDataCount() {
				return this.fullDataList.length;
			},

			// 放大
			zoomIn() {
				if (this.showFullWaveMode) {
					this.fullWaveZoom *= 1.5; // 完整波形模式下同时缩放时间和电压
					console.log('完整波形放大，缩放:', this.fullWaveZoom);
				} else {
					this.gain *= 1.5;
					console.log('实时模式放大，新增益:', this.gain);
				}
				this.forceDraw();
			},

			// 缩小
			zoomOut() {
				if (this.showFullWaveMode) {
					this.fullWaveZoom /= 1.5; // 完整波形模式下同时缩放时间和电压
					console.log('完整波形缩小，缩放:', this.fullWaveZoom);
				} else {
					this.gain /= 1.5;
					console.log('实时模式缩小，新增益:', this.gain);
				}
				this.forceDraw();
			},

			// 自动调整
			autoGain() {
				if (this.showFullWaveMode) {
					this.fullWaveZoom = 1.0; // 重置缩放
					this.calculateGainForFullData(); // 重新计算基础增益
					console.log('完整波形自动调整，缩放重置为1.0');
				} else {
					this.calculateGain();
					console.log('实时模式自动调整增益:', this.gain);
				}
				this.forceDraw();
			},

			calculateGain() {
				const h = this.pxHeight - this.margin.top - this.margin.bottom;
				if (this.dataRange > 0) {
					this.gain = (h * 0.3) / this.dataRange;
				}
				const minGain = h * 0.1;
				const maxGain = h * 5;
				this.gain = Math.max(minGain, Math.min(this.gain, maxGain));
			},

			setGain(gainValue) {
				this.gain = gainValue;
				this.forceDraw();
			},

			// 设置采样率
			setSampleRate(rate) {
				this.sampleRate = rate;
				this.forceDraw();
			},

			// 设置完整波形时长
			setFullWaveDuration(duration) {
				this.fullWaveDuration = duration;
				if (this.showFullWaveMode) {
					this.forceDraw();
				}
			},

			async initCanvas() {
				return new Promise((resolve) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.wave-box').boundingClientRect(rect => {
						if (!rect || rect.width === 0 || rect.height === 0) {
							setTimeout(() => this.initCanvas(), 50);
							return;
						}
						const dpr = uni.getSystemInfoSync().pixelRatio;
						this.pxWidth = Math.floor(rect.width * dpr);
						this.pxHeight = Math.floor(rect.height * dpr);

						this.ctx = uni.createCanvasContext('ecg-canvas', this);
						this.ctx.width = this.pxWidth;
						this.ctx.height = this.pxHeight;
						this.calculateGain();
						this.draw();
						resolve();
					}).exec();
				});
			},

			drawGrid(area) {
				const dpr = uni.getSystemInfoSync().pixelRatio;
				// 完整波形模式下简化网格
				const grid = this.showFullWaveMode ? 20 * dpr : 10 * dpr;
				this.ctx.strokeStyle = '#003300';
				this.ctx.lineWidth = 0.5;

				// 垂直线 - 完整波形模式下减少网格线
				const xStep = this.showFullWaveMode ? grid * 2 : grid;
				for (let x = area.x; x <= area.x + area.w; x += xStep) {
					this.ctx.beginPath();
					this.ctx.moveTo(x, area.y);
					this.ctx.lineTo(x, area.y + area.h);
					this.ctx.stroke();
				}
				// 水平线
				for (let y = area.y; y <= area.y + area.h; y += grid) {
					this.ctx.beginPath();
					this.ctx.moveTo(area.x, y);
					this.ctx.lineTo(area.x + area.w, y);
					this.ctx.stroke();
				}
				// 中心线
				// this.ctx.strokeStyle = '#008800';
				// this.ctx.lineWidth = 1;
				this.ctx.beginPath();
				this.ctx.moveTo(area.x, area.y + area.h / 2);
				this.ctx.lineTo(area.x + area.w, area.y + area.h / 2);
				this.ctx.stroke();
			},

			reinitCanvas() {
				this.initCanvas();
			}
		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer);
			}
			if (this.drawTimer) {
				clearTimeout(this.drawTimer);
			}
		},
	};
</script>

<style scoped>
	.wave-box {
		width: 100%;
		height: 120px;
		/* 增加高度以容纳坐标轴 */
		position: relative;
		overflow: visible;
		background: #000;
	}

	.ecg-canvas {
		width: 100%;
		height: 100%;
		pointer-events: none;
		max-width: 100%;
	}

	.full-wave-control {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		display: flex;
		gap: 8rpx;
		wrap: wrap;
		justify-content: flex-end;
		z-index: 10;
	}

	.mini-btn {
		padding: 6rpx 16rpx;
		font-size: 22rpx;
		background: rgba(0, 0, 0, 0.8);
		color: #00FF00;
		border: 1rpx solid #00FF00;
		border-radius: 8rpx;
		line-height: 1.2;
	}

	.mini-btn:active {
		background: rgba(0, 255, 0, 0.3);
	}
</style>