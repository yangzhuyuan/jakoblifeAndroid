/**
 * @description PPG数据管理单例服务
 * 负责数据缓存、滤波、心率计算和事件分发
 */
class PpgDataService {
	constructor() {
		this.ppgBuffer = [];
		this.irBuffer = [];
		this.timestampBuffer = [];
		this.rrIntervals = [];
		this.samplingRate = 13;
		this.displayTime = 5;
		this.maxBufferSize = this.samplingRate * this.displayTime;
		this.heartRate = 0;
		this.lastPeakTime = 0;
		this.wearingStatus = '未佩戴';
		this.listeners = new Map();
		this.filterCache = new Map();
		this.cacheMaxSize = 10;
	}

	// ==================== 核心方法 ====================

	// 数据归一化
	normalizeData(data) {
		const mean = data.reduce((a, b) => a + b) / data.length;
		const normalized = data.map(val => (val - mean) / 1000);
		// console.log('📐 归一化: 均值', mean.toFixed(0), '→ 范围',
		// 	Math.min(...normalized).toFixed(2), '到', Math.max(...normalized).toFixed(2));
		return normalized;
	}

	onDataReceived(parsedPacket, pulse) {
		if (!parsedPacket.success || !parsedPacket.data || parsedPacket.data.length === 0) {
			console.warn('⚠️ 无效的数据包');
			return;
		}

		// console.log('📥 接收数据包 #', parsedPacket.seqNumber,
		// 	'数据条数:', parsedPacket.actualCount);

		// 提取原始数据
		const rawGreen = parsedPacket.data.map(item => {
			const val = -item.greenValue;
			return isNaN(val) ? 0 : val;
		});
		const rawIR = parsedPacket.data.map(item => item.irValue);

		// 立即归一化（关键修复）
		const normalizedGreen = this.normalizeData(rawGreen);
		const normalizedIR = this.normalizeData(rawIR);

		// 存入缓冲区（现在存的是归一化数据）
		this.ppgBuffer.push(...normalizedGreen);
		this.irBuffer.push(...normalizedIR);

		// 裁剪旧数据
		if (this.ppgBuffer.length > this.maxBufferSize) {
			const excess = this.ppgBuffer.length - this.maxBufferSize;
			this.ppgBuffer.splice(0, excess);
			this.irBuffer.splice(0, excess);
		}

		// 佩戴状态
		const wearingCount = parsedPacket.data.filter(item => item.wearingCode === 1).length;
		this.wearingStatus = wearingCount === parsedPacket.data.length ? '已佩戴' : '未佩戴';

		// 心率计算
		if (this.ppgBuffer.length >= this.samplingRate * 3) {
			this.calculateHeartRate(pulse);
		}
		// console.log('🔥 事件触发前 - 心率:', this.heartRate);
		// 触发更新
		this.emit('data-update', {
			ppgData: [...this.ppgBuffer], // 发送归一化数据
			irData: [...this.irBuffer],
			heartRate: pulse,
			wearingStatus: this.wearingStatus,
			timestamp: parsedPacket.data[0].seconds,
			packetSeq: parsedPacket.seqNumber
		});
		// console.log('🔥 事件已触发 - 心率:', this.heartRate);
	}

	// 替换整个 calculateHeartRate 方法
	calculateHeartRate(pulse) {
		try {
			// console.log('❤️ 开始心率计算，数据长度:', this.ppgBuffer.length);

			// 使用带通滤波提取心跳频率（0.8-3.5Hz对应48-210BPM）
			const filtered = this.bandPassFilter(this.ppgBuffer, 0.8, 3.5);
			const peaks = this.detectPeaks(filtered);

			// console.log('❤️ 峰值检测完成:', peaks.length, '个峰值');

			if (peaks.length >= 2) {
				// 计算所有RR间期
				const intervals = [];
				for (let i = 1; i < peaks.length; i++) {
					const interval = (peaks[i] - peaks[i - 1]) / this.samplingRate * 1000;
					if (interval >= 300 && interval <= 1500) { // 40-200BPM
						intervals.push(interval);
						// console.log(`✅ RR间期${i}: ${interval.toFixed(1)}ms (${Math.round(60000/interval)} BPM)`);
					}
				}

				// console.log('📊 有效间期总数:', intervals.length);

				// 累积RR间期（保留最近15个）
				if (intervals.length > 0) {
					// 取中位数（排除异常值）
					const sortedIntervals = [...intervals].sort((a, b) => a - b);
					const medianRR = sortedIntervals[Math.floor(sortedIntervals.length / 2)];

					this.rrIntervals.push(medianRR);
					if (this.rrIntervals.length > 15) {
						this.rrIntervals.shift();
					}

					// console.log('📊 RR间期队列:', this.rrIntervals.map(v => v.toFixed(1) + 'ms'));

					// 使用中位数计算心率
					if (this.rrIntervals.length >= 3) {
						const rrSorted = [...this.rrIntervals].sort((a, b) => a - b);
						const rrMedian = rrSorted[Math.floor(rrSorted.length / 2)];

						// 计算瞬时心率
						const instantHR = Math.round(60000 / rrMedian);

						// 心率平滑（大幅降低权重，响应更快）
						// if (Math.abs(instantHR - this.heartRate) > 15) {
						// 	this.heartRate = instantHR; // 大幅变化直接更新
						// } else {
						// 	this.heartRate = Math.round(this.heartRate * 0.85 + instantHR * 0.15);
						// }
						this.heartRate = pulse
						// console.log(`❤️ ✅ 心率计算成功: ${this.heartRate} BPM (RR: ${rrMedian.toFixed(1)}ms)`);
					}
				}
			} else {
				// console.warn('⚠️ 峰值不足，无法计算心率');
				this.heartRate = pulse;
			}
		} catch (error) {
			console.error('❤️ 心率计算失败:', error);
			this.heartRate = pulse;
		}
	}

	// 修改 detectPeaks - 降低阈值
	detectPeaks(data) {
		const peaks = [];
		const windowSize = Math.floor(this.samplingRate * 0.35); // 增大窗口
		const threshold = this.calculateAdaptiveThreshold(data);

		console.log('📈 峰值检测 - 阈值:', threshold.toFixed(2), '窗口:', windowSize);

		for (let i = windowSize; i < data.length - windowSize; i++) {
			if (data[i] > threshold && this.isLocalMaximum(data, i)) {
				// 确保峰值间隔合理
				if (peaks.length === 0 || (i - peaks[peaks.length - 1]) > windowSize) {
					peaks.push(i);
					console.log(`📍 峰值索引:${i} 值:${data[i].toFixed(2)}`);
				}
			}
		}
		return peaks;
	}

	// 新增自适应阈值计算
	calculateAdaptiveThreshold(data) {
		const cleanData = data.filter(val => !isNaN(val) && isFinite(val));
		if (cleanData.length === 0) return 0;

		const sorted = [...cleanData].sort((a, b) => a - b);
		const p90 = sorted[Math.floor(sorted.length * 0.9)];
		const p50 = sorted[Math.floor(sorted.length * 0.5)];

		// 降低阈值系数
		const threshold = p50 + 0.25 * (p90 - p50);

		console.log('📊 自适应阈值:', threshold.toFixed(2),
			`(中位数:${p50.toFixed(2)}, 90分位:${p90.toFixed(2)})`);

		return threshold;
	}

	// 修改 calculateThreshold - 降低阈值确保检测到更多峰值
	calculateThreshold(data) {
		const cleanData = data.filter(val => !isNaN(val) && isFinite(val));
		if (cleanData.length === 0) return 0;

		const mean = cleanData.reduce((a, b) => a + b) / cleanData.length;
		const variance = cleanData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / cleanData.length;
		const std = Math.sqrt(variance);
		const maxVal = Math.max(...cleanData);

		// 关键修复：降低阈值，确保能检测到峰值
		const threshold = Math.min(mean + 0.5 * std, maxVal * 0.6);

		console.log('📊 阈值计算结果:', threshold.toFixed(2));
		return threshold;
	}

	// ==================== 信号处理 ====================

	bandPassFilter(data, lowCut, highCut) {
		const cacheKey = `${lowCut}-${highCut}-${data.length}`;
		if (this.filterCache.has(cacheKey)) {
			return this.filterCache.get(cacheKey);
		}

		const hpFiltered = this.highPassFilter(data, lowCut);
		const result = this.lowPassFilter(hpFiltered, highCut);

		this.filterCache.set(cacheKey, result);
		if (this.filterCache.size > this.cacheMaxSize) {
			const firstKey = this.filterCache.keys().next().value;
			this.filterCache.delete(firstKey);
		}

		return result;
	}

	highPassFilter(data, cutoff) {
		const RC = 1 / (2 * Math.PI * cutoff);
		const dt = 1 / this.samplingRate;
		const alpha = RC / (RC + dt);

		const filtered = [data[0]];
		for (let i = 1; i < data.length; i++) {
			filtered[i] = alpha * (filtered[i - 1] + data[i] - data[i - 1]);
		}
		return filtered;
	}

	lowPassFilter(data, cutoff) {
		const RC = 1 / (2 * Math.PI * cutoff);
		const dt = 1 / this.samplingRate;
		const alpha = dt / (RC + dt);

		const filtered = [data[0]];
		for (let i = 1; i < data.length; i++) {
			filtered[i] = filtered[i - 1] + alpha * (data[i] - filtered[i - 1]);
		}
		return filtered;
	}

	detectPeaks(data) {
		const peaks = [];
		const windowSize = Math.floor(this.samplingRate * 0.5);
		const threshold = this.calculateThreshold(data);

		// console.log('📈 峰值检测 - 阈值:', threshold.toFixed(2), '窗口:', windowSize);

		for (let i = windowSize; i < data.length - windowSize; i++) {
			if (data[i] > threshold && this.isLocalMaximum(data, i)) {
				if (peaks.length === 0 || (i - peaks[peaks.length - 1]) > windowSize) {
					peaks.push(i);
					// console.log('📍 峰值索引:', i, '值:', data[i].toFixed(2));
				}
			}
		}
		return peaks;
	}

	calculateThreshold(data) {
		const cleanData = data.filter(val => !isNaN(val) && isFinite(val));
		if (cleanData.length === 0) return 0;

		const mean = cleanData.reduce((a, b) => a + b) / cleanData.length;
		const variance = cleanData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / cleanData.length;
		const std = Math.sqrt(variance);

		let threshold = mean + 0.8 * std;
		const maxVal = Math.max(...cleanData);

		// 确保阈值不会过大
		if (threshold > maxVal * 0.8) {
			threshold = maxVal * 0.5;
		}

		// console.log('📊 阈值计算:', {
		// 	均值: mean.toFixed(2),
		// 	标准差: std.toFixed(2),
		// 	计算阈值: threshold.toFixed(2),
		// 	数据最大值: maxVal.toFixed(2),
		// 	最终阈值: threshold.toFixed(2)
		// });

		return threshold;
	}

	isLocalMaximum(data, index) {
		return data[index] > data[index - 1] && data[index] > data[index + 1];
	}

	// ==================== 事件管理 ====================

	on(event, callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event).add(callback);
	}

	off(event, callback) {
		if (this.listeners.has(event)) {
			this.listeners.get(event).delete(callback);
		}
	}

	emit(event, data) {
		if (this.listeners.has(event)) {
			this.listeners.get(event).forEach(callback => {
				try {
					callback(data);
				} catch (error) {
					console.error(`事件回调失败 [${event}]:`, error);
				}
			});
		}
	}

	clear() {
		// console.log('🗑️ 清空所有数据');
		this.ppgBuffer = [];
		this.irBuffer = [];
		this.timestampBuffer = [];
		this.rrIntervals = [];
		this.heartRate = 0;
		this.wearingStatus = '未佩戴';
		this.filterCache.clear();
		this.emit('data-cleared');
	}
}

export default new PpgDataService();