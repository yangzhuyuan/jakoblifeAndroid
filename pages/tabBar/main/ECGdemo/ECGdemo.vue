<template>
	<scroll-view scroll-y="true" :style="{ height: screenHeight + 'px' }" class="scroll-view">
		<view style="background: white;">
			<view class="title_zs_ECG">注：本页面仅用于ECG调测</view>
			<!-- 蓝牙连接 -->
			<view class="ble-panel">
				<!-- 蓝牙搜索列表 -->
				<view class="ble-scan-section">
					<view class="ble-scan-header">
						<text class="ble-scan-title">设备搜索</text>
						<text class="ble-scan-count">{{ bleDeviceList.length }} 台</text>
					</view>
					<view class="ble-scan-actions">
						<button class="btn scan-btn" :disabled="scanning" @tap="startBleScan">
							{{ scanning ? '搜索中...' : '搜索设备' }}
						</button>
						<button class="btn scan-btn secondary" :disabled="!scanning" @tap="stopBleScan">停止搜索</button>
					</view>
					<scroll-view scroll-y class="ble-device-list">
						<view v-for="item in bleDeviceList" :key="item.deviceId" class="ble-device-item"
							:class="{ selected: selectedDeviceId === item.deviceId }" @tap="selectBleDevice(item)">
							<view class="ble-device-main">
								<text class="ble-device-name">{{ item.name || '未知设备' }}</text>
								<text class="ble-device-rssi" v-if="item.RSSI">{{ item.RSSI }} dBm</text>
							</view>
							<text class="ble-device-id">{{ item.deviceId }}</text>
						</view>
						<view v-if="bleDeviceList.length === 0" class="ble-device-empty">
							{{ scanning ? '正在搜索附近设备...' : '点击「搜索设备」扫描蓝牙' }}
						</view>
					</scroll-view>
					<view class="ble-selected" v-if="selectedDeviceId">
						<text>已选: {{ selectedDeviceName || selectedDeviceId }}</text>
					</view>
				</view>
				<view class="ble-row">
					<text class="ble-label">蓝牙状态</text>
					<text class="ble-value" :class="{ connected: connected }">{{ bleStatusText }}</text>
				</view>
				<view class="ble-row" v-if="deviceIdECG">
					<text class="ble-label">设备ID</text>
					<text class="ble-value ble-mono">{{ deviceIdECG }}</text>
				</view>
				<view class="ble-row" v-if="measurementStatus">
					<text class="ble-label">测量状态</text>
					<text class="ble-value">{{ measurementStatus }}</text>
				</view>
				<view class="ble-actions">
					<button class="btn primary" :disabled="connecting || connected" @tap="connectBLE">连接蓝牙</button>
					<button class="btn secondary" :disabled="!connected" @tap="disconnectBLE">断开连接</button>
				</view>


			</view>

			<!-- 日志 -->
			<view class="log-panel">
				<view class="log-header">
					<text class="log-title">调试日志</text>
					<view class="log-actions">
						<text class="log-action" @tap="copyLogs">一键复制</text>
						<text class="log-action" @tap="clearLogs">清空</text>
					</view>
				</view>
				<scroll-view scroll-y class="log-scroll" :scroll-top="logScrollTop">
					<view v-for="(item, index) in logs" :key="index" class="log-line">
						<text class="log-time">{{ item.time }}</text>
						<text class="log-tag">[{{ item.tag }}]</text>
						<text class="log-msg">{{ item.msg }}</text>
					</view>
					<view v-if="logs.length === 0" class="log-empty">暂无日志</view>
				</scroll-view>
			</view>

			<EcgSwiperItem ref="ecgSwiperItem" :statsVisible="statsVisible"
				:baseFeaturesExtracted="baseFeaturesExtracted" :derivedFeaturesExtracted="derivedFeaturesExtracted"
				:qualityScore="qualityScore" :modelScore="modelScore" :ecgdatarows="ecgdatarows"
				@start-measure="startbtn" @ecg-detail="ecgbtn" />

			<!-- 本地模拟测试 -->
			<view class="test-section">
				<text class="test-title">本地模拟测试</text>
				<view class="rhythm-list">
					<view v-for="item in rhythmOptions" :key="item.type" class="rhythm-item"
						:class="{ selected: selectedType === item.type }" @tap="selectedType = item.type">
						<text class="rhythm-name">{{ item.name }}</text>
					</view>
				</view>
				<view class="test-actions">
					<button class="btn primary" :disabled="isMockTesting" @tap="startMockTest">开始模拟</button>
					<button class="btn danger" :disabled="!isMockTesting" @tap="stopMockTest()">停止模拟</button>
				</view>
				<view class="test-actions" style="margin-top: 10px;">
					<button class="btn secondary" :disabled="isMockTesting" @tap="loadBleFullWave">加载BLE全波形</button>
				</view>
				<text class="test-hint">BLE测试数据：{{ bleDataPointCount }} 点（250hz_40s.txt）</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import EcgSwiperItem from '../EcgSwiperItem.vue';
	import {
		getLocalTimeAllJSON
	} from '../../../api/unitls/timezone.js';
	import {
		jakobLifeDebugFileLog
	} from '../../../api/jakobLifeDebugFileLog.js';
	import {
		bleTestEcgData
	} from './ble-test-data.js';

	const systemInfo = uni.getSystemInfoSync();
	const windowHeight = systemInfo.windowHeight;

	const SERVICE_ID = '0000FFF0-0000-1000-8000-00805F9B34FB';
	const WRITE_UUID = '0000FFF6-0000-1000-8000-00805F9B34FB';
	const NOTIFY_UUID = '0000FFF6-0000-1000-8000-00805F9B34FB';
	const ECG_MODEL_ID = '10006';
	const BLE_TEST_TYPE = 'ble';
	/** 相邻采样最大步进（低于 ecg-wave baselineJumpThreshold 400） */
	const BLE_MAX_STEP = 350;
	/** 显示缩放：越大波形越小；波峰需明显故适中 */
	const BLE_DISPLAY_SCALE = 40;
	/** 实时垂直增益：突出最高波峰 */
	const BLE_MEASURE_GAIN = 3.5;
	/** 结束后全图垂直增益：明显缩小（全图用 measureAmplifyFactor） */
	const BLE_FULL_WAVE_GAIN = 0.36;
	/**
	 * 设备帧近乎正负交替，差分后有效率约 125Hz。
	 * 必须用 125 绘制：若误用 250，时间轴被压扁，全波形会特别紧凑。
	 */
	const BLE_DRAW_SAMPLE_RATE = 250;
	/**
	 * 一屏目标可见波峰数（约 5～6 个）。
	 * 注意：screenDuration 越长，一屏波峰越多、越挤。
	 */
	const BLE_TARGET_PEAKS = 5.5;
	/** 一屏秒数兜底；可见峰约 0.2s 一个，约 1.2s 对应 5～6 个 */
	const BLE_SCREEN_SECONDS = 1.2;
	/** 每次蓝牙测量固定时长（秒）——录多少秒，不是一屏画多少秒 */
	const BLE_MEASURE_SECONDS = 60;
	/**
	 * 全图一屏时间窗（秒）。
	 * 必须短：一屏画满 40s/整段数据会挤成一条毛刺带；用滑条看其余时段。
	 */
	const BLE_FULL_WAVE_SECONDS = 2.5;
	/** 测量最大点数（按绘制采样率） */
	const BLE_MEASURE_MAX_POINTS = BLE_MEASURE_SECONDS * BLE_DRAW_SAMPLE_RATE;

	/**
	 * 按「画面上能看见的波峰」间距估算一屏时长（不是稀疏 R 峰）。
	 * 当前 BLE 差分波形可见峰大约 0.2s 一个，3s+ 一屏会画出十几个。
	 */
	function estimateBleScreenSeconds(samples, sampleRate = BLE_DRAW_SAMPLE_RATE, targetPeaks = BLE_TARGET_PEAKS) {
		const fallback = BLE_SCREEN_SECONDS;
		if (!samples || samples.length < 80 || !sampleRate) return fallback;
		const n = samples.length;
		let sum = 0;
		for (let i = 0; i < n; i++) sum += samples[i];
		const mean = sum / n;
		let s2 = 0;
		for (let i = 0; i < n; i++) {
			const d = samples[i] - mean;
			s2 += d * d;
		}
		const std = Math.sqrt(s2 / n) || 1;
		// 略高于均值即可，对齐肉眼看到的尖峰（不是只取最高 R）
		const thr = mean + 0.35 * std;
		// ~0.18s：按可见峰密度，而不是 0.45s 生理 RR
		const minDist = Math.max(18, Math.floor(sampleRate * 0.18));
		const peaks = [];
		for (let i = 2; i < n - 2; i++) {
			const v = samples[i];
			if (v < thr) continue;
			if (v >= samples[i - 1] && v >= samples[i + 1] && v >= samples[i - 2] && v >= samples[i + 2]) {
				if (!peaks.length || i - peaks[peaks.length - 1] >= minDist) {
					peaks.push(i);
				}
			}
		}
		if (peaks.length < 4) return fallback;
		const rrs = [];
		for (let i = 1; i < peaks.length; i++) rrs.push(peaks[i] - peaks[i - 1]);
		rrs.sort((a, b) => a - b);
		const medRr = rrs[Math.floor(rrs.length / 2)] || Math.round(sampleRate * 0.22);
		const sec = ((Math.max(5, targetPeaks) - 1) * medRr) / sampleRate;
		// 一屏约 5～6 个可见峰
		return Math.max(1.0, Math.min(1.5, sec));
	}

	/** 设备差分编码的「轨」幅值（约 ±1650） */
	const BLE_RAIL_ABS = 1650;
	const BLE_RAIL_TOL = 120;

	function isBleRail(v) {
		return Number.isFinite(v) && Math.abs(Math.abs(v) - BLE_RAIL_ABS) < BLE_RAIL_TOL;
	}

	/** 是否应按交替差分解码（含轨点或正负大幅交替） */
	function isBleAlternatingPair(a, b) {
		if (isBleRail(a) || isBleRail(b)) return true;
		return a * b < 0 && Math.abs(a - b) > 80;
	}

	function slewBleValue(v, last) {
		if (last != null && Number.isFinite(last)) {
			const delta = v - last;
			if (Math.abs(delta) > BLE_MAX_STEP) {
				return last + Math.sign(delta) * BLE_MAX_STEP;
			}
		}
		return v;
	}

	function createBleStreamState() {
		return {
			pending: null,
			lastRaw: null
		};
	}

	/**
	 * 与模拟同源的实时/离线解码：
	 * 1) 连续同号 ±1650 轨合并，避免配对错位
	 * 2) 交替对 → (b-a)/2 去载波（极性与设备一致）
	 * 3) 连续小信号 → -(a+b)/2，避免差分抹平真实波形
	 * 4) 限幅 + 显示缩放；每对输出 1 点（125Hz）
	 */
	function processBleStreamSample(state, rawVal) {
		if (!state || !Number.isFinite(rawVal)) return [];
		if (state.pending != null && isBleRail(state.pending) && isBleRail(rawVal)) {
			const sa = Math.sign(state.pending) || 1;
			const sb = Math.sign(rawVal) || 1;
			if (sa === sb) {
				state.pending = rawVal;
				return [];
			}
		}
		if (state.pending == null) {
			state.pending = rawVal;
			return [];
		}
		const a = state.pending;
		const b = rawVal;
		state.pending = null;
		// 取反极性：此前 (a-b)/2 会把 R 峰画反
		let v = isBleAlternatingPair(a, b) ? (b - a) / 2 : -(a + b) / 2;
		v = slewBleValue(v, state.lastRaw);
		state.lastRaw = v;
		return [v / BLE_DISPLAY_SCALE];
	}

	/**
	 * 离线整段：与实时同一套 processBleStreamSample。不改 ecg-wave。
	 */
	function prepareBleContinuousWave(raw) {
		if (!raw || !raw.length) return [];
		const state = createBleStreamState();
		const out = [];
		for (let i = 0; i < raw.length; i++) {
			const samples = processBleStreamSample(state, raw[i]);
			for (let j = 0; j < samples.length; j++) {
				out.push(samples[j]);
			}
		}
		return out;
	}


	const bleContinuousWaveData = prepareBleContinuousWave(bleTestEcgData);
	/** 按主峰 RR 估出的一屏秒数（约 4～5 个最高波峰） */
	const BLE_ESTIMATED_SCREEN_SECONDS = estimateBleScreenSeconds(bleContinuousWaveData);
	/** 缩放后的显示量程 */
	const BLE_VOLTAGE_RANGE = (() => {
		let maxAbs = 0;
		for (let i = 0; i < bleContinuousWaveData.length; i++) {
			const a = Math.abs(bleContinuousWaveData[i]);
			if (a > maxAbs) maxAbs = a;
		}
		return Math.max(20, Math.ceil(maxAbs * 1.5));
	})();

	export default {
		components: {
			EcgSwiperItem
		},
		data() {
			return {
				screenHeight: windowHeight,
				connected: false,
				connecting: false,
				bleActive: false,
				tip: '',
				dataCount: 0,
				fullDataCount: 0,
				statsVisible: true,
				queueLength: 0,
				deviceIdECG: '',
				serviceIdECG: SERVICE_ID,
				uuidECG: WRITE_UUID,
				notifyUuidECG: NOTIFY_UUID,
				ecgdatarows: [],
				baseFeaturesExtracted: '',
				derivedFeaturesExtracted: '',
				qualityScore: '',
				modelScore: '',
				buffer: '',
				sendCnt: 0,
				measurementStatus: '',
				logs: [],
				logScrollTop: 0,
				isMockTesting: false,
				selectedType: BLE_TEST_TYPE,
				rhythmOptions: [],
				bleDataPointCount: bleContinuousWaveData.length,
				bleHandler: null,
				scanning: false,
				bleDeviceList: [],
				selectedDeviceId: '',
				selectedDeviceName: '',
				deviceMap: null,
				scanStopTimer: null,
				/** 实时 BLE：成对差分用的挂起样点 */
				bleStreamPending: null,
				bleStreamLastRaw: null,
				bleMeasureTimer: null,
				bleMeasureStartedAt: 0,
				/** 已点开始测量、等待设备出数 */
				bleMeasureArmed: false
			};
		},
		computed: {
			bleStatusText() {
				if (this.connecting) return '连接中...';
				return this.connected ? '已连接' : '未连接';
			}
		},
		onReady() {
			this.initRhythmOptions();
			this.ecgdatalist();
		},
		onShow() {
			// 从后台回来后恢复收数，避免蓝牙已连但波形不画
			if (this.connected && this.deviceIdECG) {
				this.bleActive = true;
			}
		},
		onHide() {
			// 不把 bleActive 置 false：系统弹窗/切后台会触发 onHide，否则后续蓝牙帧全被丢掉
			this.stopBleScan();
			this.stopMockTest(false);
		},
		onUnload() {
			this.bleActive = false;
			this.bleMeasureArmed = false;
			this.clearBleMeasureTimer();
			this.stopBleScan();
			this.stopMockTest(false);
		},
		methods: {
			getTimeAllJSON() {
				return getLocalTimeAllJSON();
			},
			UTCdatatime() {
				return {
					timestampMs: Date.now(),
					timestampSec: Math.floor(Date.now() / 1000)
				};
			},
			getEcgWaveRef() {
				const item = this.$refs.ecgSwiperItem;
				return item && item.$refs && item.$refs.wave;
			},
			getWaveRef() {
				return this.getEcgWaveRef();
			},
			addLog(tag, msg) {
				const time = new Date().toLocaleTimeString('zh-CN', {
					hour12: false
				});
				const text = typeof msg === 'object' ? JSON.stringify(msg) : String(msg);
				this.logs.push({
					time,
					tag,
					msg: text
				});
				if (this.logs.length > 200) {
					this.logs.shift();
				}
				this.logScrollTop = this.logs.length * 40;
			},
			clearLogs() {
				this.logs = [];
				this.logScrollTop = 0;
			},
			copyLogs() {
				if (!this.logs.length) {
					uni.showToast({
						title: '暂无日志可复制',
						icon: 'none'
					});
					return;
				}
				const content = this.logs
					.map(item => `${item.time} [${item.tag}] ${item.msg}`)
					.join('\n');
				uni.setClipboardData({
					data: content,
					success: () => {
						uni.showToast({
							title: '日志已复制',
							icon: 'none'
						});
					},
					fail: (err) => {
						const msg = (err && err.errMsg) || '复制失败';
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}
				});
			},
			initRhythmOptions() {
				const wave = this.getWaveRef();
				const options = [{
					type: BLE_TEST_TYPE,
					name: `BLE测试数据(${bleContinuousWaveData.length}点)`
				}];
				if (wave && typeof wave.getTestRhythmTypes === 'function') {
					const types = wave.getTestRhythmTypes();
					Object.keys(types).forEach(type => {
						options.push({
							type,
							name: types[type].name
						});
					});
				}
				this.rhythmOptions = options;
			},
			applyBleWaveRange(wave, forFullWave = false) {
				if (!wave) return;
				const liveBusy = !!(wave.isMeasuring && (wave.lepuSampleCount > 0 || wave.fullDataList && wave
					.fullDataList.length > 0));
				// 测量中途只改参数，避免 setSampleRate/setScreenDuration 清空已画缓冲
				if (liveBusy && !forFullWave) {
					wave.sampleRate = BLE_DRAW_SAMPLE_RATE;
					wave.screenDuration = BLE_ESTIMATED_SCREEN_SECONDS;
					wave.scrollStartDuration = BLE_ESTIMATED_SCREEN_SECONDS;
					wave.measureAmplifyFactor = BLE_MEASURE_GAIN;
					wave.amplifyFactor = BLE_MEASURE_GAIN;
					wave.apiDataAmplifyFactor = 1;
					if (typeof wave.setSignalGridRange === 'function') {
						wave.setSignalGridRange(Math.max(BLE_VOLTAGE_RANGE, 50));
					}
					return;
				}
				if (typeof wave.setSampleRate === 'function') {
					wave.setSampleRate(BLE_DRAW_SAMPLE_RATE);
				} else {
					wave.sampleRate = BLE_DRAW_SAMPLE_RATE;
				}
				if (typeof wave.setSignalGridRange === 'function') {
					wave.setSignalGridRange(Math.max(BLE_VOLTAGE_RANGE, 50));
				}
				if (typeof wave.setNormalVoltageRange === 'function') {
					wave.setNormalVoltageRange(Math.max(BLE_VOLTAGE_RANGE, 50));
				}
				if (!forFullWave && typeof wave.setScreenDuration === 'function') {
					wave.setScreenDuration(BLE_ESTIMATED_SCREEN_SECONDS);
				}
				const gain = forFullWave ? BLE_FULL_WAVE_GAIN : BLE_MEASURE_GAIN;
				wave.measureAmplifyFactor = gain;
				wave.amplifyFactor = gain;
				wave.apiDataAmplifyFactor = 1;
				if (!forFullWave) {
					if (typeof wave.setMeasureAmplifyFactor === 'function' && gain >= 0.5) {
						wave.setMeasureAmplifyFactor(gain);
					}
					if (typeof wave.setAmplifyFactor === 'function' && gain >= 0.5) {
						wave.setAmplifyFactor(gain);
					}
				}
			},
			/** 确保已进入测量态（与模拟相同的 rate/时长/增益） */
			ensureBleMeasuring(wave, reason = '') {
				if (!wave) return false;
				if (!wave.isMeasuring) {
					if (wave.showFullWaveMode) {
						wave.showFullWaveMode = false;
						wave.showFullWaveControls = false;
					}
					this.applyBleWaveRange(wave);
					wave.startMeasurement();
					this.applyBleWaveRange(wave);
					if (reason) this.addLog('测量', `自动进入测量: ${reason}`);
				} else {
					this.applyBleWaveRange(wave);
				}
				return !!wave.isMeasuring;
			},
			/** 全波形：短窗口不挤在一起；测量仍可录满 40s，滑条翻看 */
			showBleProcessedFullWave(wave) {
				if (!wave || typeof wave.showFullWave !== 'function') return;
				this.applyBleWaveRange(wave, true);
				wave.showFullWave();
				const total = typeof wave.fullWaveTotalDuration === 'number' ?
					wave.fullWaveTotalDuration :
					((wave.fullDataList && wave.fullDataList.length) || (wave.apiDataList && wave.apiDataList.length) ||
						0) /
					(wave.sampleRate || 250);
				// 一屏固定短窗口，禁止把整段 40s/全部点塞进画布
				const win = Math.min(BLE_FULL_WAVE_SECONDS, Math.max(0.5, total));
				// 优先从有信号的靠后位置起看（避开开头基线）
				const start = total > win + 3 ? Math.min(3, total - win) : 0;
				wave.fullWaveStartTime = start;
				wave.fullWaveDuration = win;
				wave.fullWaveEndTime = Math.min(total, start + win);
				if (typeof wave.updateFullWaveData === 'function') {
					wave.updateFullWaveData();
				}
				// showFullWave 之后再钉一次小增益，避免被组件默认放大顶满画布
				this.applyBleWaveRange(wave, true);
				if (typeof wave.forceDraw === 'function') {
					wave.forceDraw();
				}
				this.addLog('全波形', `增益=${BLE_FULL_WAVE_GAIN}, 一屏=${win.toFixed(1)}s(不挤) / 总${total.toFixed(1)}s`);
			},
			clearBleMeasureTimer() {
				if (this.bleMeasureTimer) {
					clearTimeout(this.bleMeasureTimer);
					this.bleMeasureTimer = null;
				}
			},
			/** 每次蓝牙测量固定 40s：到点自动结束并出全图 */
			startBleMeasureTimer(reason = '开始计时', force = false) {
				if (this.bleMeasureTimer && !force) return;
				this.clearBleMeasureTimer();
				this.bleMeasureStartedAt = Date.now();
				this.addLog('测量', `${reason}，固定 ${BLE_MEASURE_SECONDS}s`);
				this.bleMeasureTimer = setTimeout(() => {
					this.bleMeasureTimer = null;
					this.finishBleMeasureByTimeout();
				}, BLE_MEASURE_SECONDS * 1000);
			},
			finishBleMeasureByTimeout() {
				const wave = this.getWaveRef();
				if (!wave || !wave.isMeasuring) return;
				if (this._bleMeasureFinishing) return;
				this._bleMeasureFinishing = true;
				this.clearBleMeasureTimer();
				this.addLog('测量', `已满 ${BLE_MEASURE_SECONDS}s，自动结束`);
				this.measurementStatus = '采集结束(40s)';
				this.tip = this.measurementStatus;
				this.bleMeasureArmed = false;
				if (typeof wave.stopMeasurement === 'function') {
					wave.stopMeasurement();
				}
				const finalData = typeof wave.getFullDataList === 'function' ? wave.getFullDataList() : [];
				if (finalData && finalData.length) {
					this.saveFinalData(finalData);
				}
				setTimeout(() => {
					this.showBleProcessedFullWave(wave);
					this.baseFeaturesExtracted = this.$t('未完成');
					this.derivedFeaturesExtracted = this.$t('未完成');
					this.qualityScore = this.$t('云端数据计算中');
					this.modelScore = this.$t('云端数据计算中');
					this._bleMeasureFinishing = false;
				}, 300);
			},
			/**
			 * 实时：与模拟同一套 processBleStreamSample（轨合并 / 差分 / 小信号均值）
			 */
			processLiveBleSample(rawVal) {
				if (!this._bleStreamState) {
					this._bleStreamState = createBleStreamState();
				}
				return processBleStreamSample(this._bleStreamState, rawVal);
			},
			resetBleStreamState() {
				this._bleStreamState = createBleStreamState();
				this.bleStreamPending = null;
				this.bleStreamLastRaw = null;
				this._bleDropLogged = false;
			},
			getBleWavePayload() {
				return bleContinuousWaveData.slice();
			},
			startMockTest() {
				const wave = this.getWaveRef();
				if (!wave || typeof wave.startTestWaveform !== 'function') {
					uni.showToast({
						title: '波形组件未就绪',
						icon: 'none'
					});
					return;
				}
				if (this.selectedType === BLE_TEST_TYPE) {
					const payload = this.getBleWavePayload();
					this.applyBleWaveRange(wave);
					wave.startTestWaveform('preset', payload);
					// startTestWaveform/startMeasurement 后可能重算缓冲，再钉一次一屏时长
					this.applyBleWaveRange(wave);
					this.isMockTesting = true;
					this.addLog(
						'模拟测试',
						`开始BLE回放: ${payload.length}点, screen=${BLE_ESTIMATED_SCREEN_SECONDS.toFixed(2)}s(~${BLE_TARGET_PEAKS}峰), range=${BLE_VOLTAGE_RANGE}`
					);
					return;
				}
				wave.startTestWaveform(this.selectedType);
				this.isMockTesting = true;
				this.addLog('模拟测试', `开始: ${this.selectedType}`);
			},
			stopMockTest(showBleFull = true) {
				const wave = this.getWaveRef();
				const wasBle = this.selectedType === BLE_TEST_TYPE && this.isMockTesting;
				if (wave && typeof wave.stopTestWaveform === 'function') {
					wave.stopTestWaveform();
				}
				this.isMockTesting = false;
				if (showBleFull && wasBle && wave && typeof wave.showFullWave === 'function') {
					setTimeout(() => {
						if (wave.getFullDataCount && wave.getFullDataCount() > 0) {
							this.showBleProcessedFullWave(wave);
						}
					}, 50);
				}
				this.addLog('模拟测试', '已停止');
			},
			loadBleFullWave() {
				const wave = this.getWaveRef();
				if (!wave || typeof wave.generateApiData !== 'function') {
					uni.showToast({
						title: '波形组件未就绪',
						icon: 'none'
					});
					return;
				}
				const payload = this.getBleWavePayload();
				this.stopMockTest(false);
				this.clearWave();
				// 先钉采样率/增益，再灌数据，避免按 250Hz 把时间轴压扁
				this.applyBleWaveRange(wave, true);
				wave.generateApiData(payload, Math.max(BLE_VOLTAGE_RANGE, 50));
				this.showBleProcessedFullWave(wave);
				this.selectedType = BLE_TEST_TYPE;
				this.addLog(
					'BLE波形',
					`已加载连续波形 ${payload.length} 点, rate=${BLE_DRAW_SAMPLE_RATE}, 窗口=${BLE_FULL_WAVE_SECONDS}s, voltageRange=${BLE_VOLTAGE_RANGE}`
				);
				uni.showToast({
					title: `已加载 ${payload.length} 点`,
					icon: 'none'
				});
			},
			/* ==================== 蓝牙连接 ==================== */
			openBluetoothAdapter() {
				return new Promise((resolve, reject) => {
					uni.openBluetoothAdapter({
						success: resolve,
						fail: reject
					});
				});
			},
			findECGDevice() {
				return new Promise((resolve) => {
					const storedMac = this.getStoredEcgMac();
					if (storedMac) {
						this.addLog('蓝牙', `使用已绑定设备: ${storedMac}`);
						resolve(storedMac);
						return;
					}
					uni.getConnectedBluetoothDevices({
						services: [SERVICE_ID],
						success: (res) => {
							if (res.devices && res.devices.length > 0) {
								const id = res.devices[0].deviceId;
								this.addLog('蓝牙', `发现已连接设备: ${id}`);
								resolve(id);
							} else {
								resolve('');
							}
						},
						fail: () => resolve('')
					});
				});
			},
			getStoredEcgMac() {
				const list = uni.getStorageSync('lixianlist') || [];
				const ecg = list.find(item => String(item.deviceModelId) === ECG_MODEL_ID);
				if (ecg && ecg.mac) {
					uni.setStorageSync('ECGdeviceSn', ecg.deviceSn);
					uni.setStorageSync('deviceModelName', ecg.deviceModelName || '');
					return ecg.mac;
				}
				const macs = uni.getStorageSync('devicdsdmac') || [];
				return macs.length > 0 ? macs[0] : '';
			},
			createBLEConnection(deviceId, deviceName) {
				uni.createBLEConnection({
					deviceId,
					timeout: 10000,
					success: (createBLEConnection) => {
						this.addLog("连接成功之后准备获取蓝牙服务值", createBLEConnection)
						this.deviceIdECG = deviceId;
						this.connecting = false;
						this.connected = true;
						this.bleActive = true;
						this.selectedDeviceId = deviceId;
						this.selectedDeviceName = deviceName;
						setTimeout(() => {
							this.addLog("开始获取蓝牙服务值")
							this.getBLEDeviceServices(deviceId)
						}, 2000)
					},
					fail: (err) => {
						this.addLog("连接失败或已连接", err)
					}
				});
			},
			getBLEDeviceServices(deviceId) {
				uni.getBLEDeviceServices({
					deviceId,
					success: (res) => {
						this.addLog("获取到的蓝牙服务值", res)
						switch (res.services.length) {
							case 1:
								this.addLog("当前服务值只有一条时", res.services[0].uuid)
								this.serviceIdECG = res.services[0].uuid;
								this.getBLEDeviceCharacteristicsECG(deviceId, res.services[0].uuid);
								break
							default:
								this.addLog("当前服务值有多条时", res)
								break
						}
					},
					fail: (failerro) => {
						this.addLog("获取蓝牙服失败：", failerro)
					}
				});
			},
			getBLEDeviceCharacteristicsECG(deviceId, serviceId) {
				this.addLog('开始获取读/写/通知特征值', deviceId, serviceId);
				if (!deviceId || !serviceId) {
					this.addLog('getBLEDeviceCharacteristics 参数无效: deviceId/serviceId 为空');
					return;
				}
				uni.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success: (res) => {
						this.addLog('获取到的蓝牙对应值', res);
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								this.uuidECG = item.uuid
								this.addLog('获取到的蓝牙写的值', this.uuidECG);
							}
							if (item.properties.notify) {
								this.notifyUuid = item.uuid
								this.addLog('获取到的蓝牙通知的值', this.notifyUuid);
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										this.onBLECharacteristicValueChangeECG();
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(failres) {
						console.error('获取蓝牙设备某个服务中所有特征值失败11', failres)
					}
				});
			},
			onBLECharacteristicValueChangeECG() {
				if (this.bleHandler) return;
				this.bleHandler = (res) => {
					const hex = this.ab2hex(res.value);
					this.addLog('蓝牙返回的数据', hex);
					// 已连接即可解析；不依赖 bleActive（onHide 曾误关导致不画波形）
					if (!this.connected && !this.deviceIdECG) return;
					if (this.deviceIdECG && res.deviceId !== this.deviceIdECG) return;
					const sid = (res.serviceId || '').toUpperCase();
					if (sid && sid !== SERVICE_ID.toUpperCase()) return;
					this.buffer += hex;
					this.tryParse();
				};
				uni.onBLECharacteristicValueChange(this.bleHandler);
			},
			delay(ms) {
				return new Promise((resolve) => setTimeout(resolve, ms));
			},
			updateBleDeviceList() {
				if (!this.deviceMap) return;
				const list = Array.from(this.deviceMap.values())
					.sort((a, b) => (b.RSSI || -100) - (a.RSSI || -100));
				this.bleDeviceList = list;
			},
			onBleDeviceFound(res) {
				if (!this.scanning || !res.devices) return;
				let changed = false;
				res.devices.forEach((item) => {
					if (!item.deviceId) return;
					const prev = this.deviceMap.get(item.deviceId);
					const merged = {
						deviceId: item.deviceId,
						name: item.name || item.localName || (prev && prev.name) || '',
						RSSI: item.RSSI != null ? item.RSSI : (prev && prev.RSSI),
						discoveryTime: Date.now()
					};
					if (!prev || prev.RSSI !== merged.RSSI || prev.name !== merged.name) {
						this.deviceMap.set(item.deviceId, merged);
						changed = true;
					}
				});
				if (changed) {
					this.updateBleDeviceList();
				}
			},
			async startBleScan() {
				if (this.scanning) return;
				try {
					await this.openBluetoothAdapter();
				} catch (err) {
					const msg = (err && err.errMsg) || '蓝牙适配器打开失败';
					this.addLog('搜索错误', msg);
					uni.showToast({
						title: msg,
						icon: 'none'
					});
					return;
				}
				this.stopBleScan(false);
				this.deviceMap = new Map();
				this.bleDeviceList = [];
				this.scanning = true;
				this.addLog('搜索', '开始扫描蓝牙设备');
				uni.onBluetoothDeviceFound(this.onBleDeviceFound);
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: true,
					success: () => {
						this.addLog('搜索', '扫描已启动');
					},
					fail: (err) => {
						this.scanning = false;
						const msg = (err && err.errMsg) || '搜索启动失败';
						this.addLog('搜索错误', msg);
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}
				});
				if (this.scanStopTimer) clearTimeout(this.scanStopTimer);
				this.scanStopTimer = setTimeout(() => {
					if (this.scanning) {
						this.stopBleScan();
						this.addLog('搜索', '扫描超时自动停止');
					}
				}, 15000);
			},
			stopBleScan(log = true) {
				if (this.scanStopTimer) {
					clearTimeout(this.scanStopTimer);
					this.scanStopTimer = null;
				}
				if (!this.scanning) return;
				this.scanning = false;
				uni.stopBluetoothDevicesDiscovery({
					complete: () => {
						if (log) this.addLog('搜索', `扫描停止，共 ${this.bleDeviceList.length} 台设备`);
					}
				});
			},
			selectBleDevice(item) {
				this.selectedDeviceId = item.deviceId;
				this.selectedDeviceName = item.name || item.localName || '';
				this.addLog('选择设备', `${this.selectedDeviceName || '未知设备'} (${item.deviceId})`);
			},
			async connectToDevice(deviceId, deviceName = '') {
				if (this.connecting || this.connected) return false;
				this.connecting = true;
				this.stopBleScan();
				this.addLog('蓝牙', `正在连接: ${deviceName || deviceId}`);
				try {
					await this.openBluetoothAdapter();
					this.createBLEConnection(deviceId, deviceName);
					return true;
				} catch (err) {
					const msg = (err && err.errMsg) || (err && err.message) || String(err);
					this.addLog('蓝牙错误', msg);
					this.connected = false;
					this.bleActive = false;
					uni.showToast({
						title: msg,
						icon: 'none'
					});
					return false;
				} finally {
					this.connecting = false;
				}
			},
			async connectBLE() {
				if (this.connecting || this.connected) return;
				if (this.selectedDeviceId) {
					const selected = this.bleDeviceList.find(d => d.deviceId === this.selectedDeviceId);
					await this.connectToDevice(this.selectedDeviceId, selected ? selected.name : this
						.selectedDeviceName);
					return;
				}
				this.addLog('蓝牙', '开始连接...');
				try {
					await this.openBluetoothAdapter();
					const deviceId = await this.findECGDevice();
					if (!deviceId) {
						uni.showToast({
							title: '请先搜索并选择设备',
							icon: 'none'
						});
						this.addLog('蓝牙', '未找到设备，请搜索并选择');
						return;
					}
					await this.connectToDevice(deviceId);
				} catch (err) {
					const msg = (err && err.errMsg) || (err && err.message) || String(err);
					this.addLog('蓝牙错误', msg);
					uni.showToast({
						title: msg,
						icon: 'none'
					});
				}
			},
			disconnectBLE() {
				if (!this.deviceIdECG) return;
				this.bleActive = false;
				uni.closeBLEConnection({
					deviceId: this.deviceIdECG,
					complete: () => {
						this.connected = false;
						this.deviceIdECG = '';
						this.buffer = '';
						this.addLog('蓝牙', '已断开连接');
					}
				});
			},
			/* ==================== ECG测量 ==================== */
			startbtn() {
				this.addLog('测量', '点击发送ECG测量命令', this.deviceIdECG);
				this.doStartMeasure();
			},
			doStartMeasure() {
				const wave = this.getWaveRef();
				if (!wave) return;
				this.addLog('测量', '开始测量前状态: ' + JSON.stringify({
					isMeasuring: wave.isMeasuring,
					showFullWave: wave.showFullWaveMode,
					dataLength: wave.dataList ? wave.dataList.length : 0
				}));
				this.clearWave();
				this.sendCnt = 0;
				this.bleMeasureArmed = true;
				this._bleMeasureFinishing = false;
				this.buffer = '';
				wave.clear();
				wave.stopMeasurement();
				wave.hideFullWave();
				this.resetBleStreamState();
				this.clearBleMeasureTimer();
				this.applyBleWaveRange(wave);
				setTimeout(() => {
					this.ensureBleMeasuring(wave, '发送测量命令');
					this.send(this.deviceIdECG, this.serviceIdECG, this.uuidECG);
					this.addLog('测量',
						`已发送开始测量命令, 固定${BLE_MEASURE_SECONDS}s(出数后计时), screen=${BLE_ESTIMATED_SCREEN_SECONDS.toFixed(2)}s, rate=${BLE_DRAW_SAMPLE_RATE}`
					);
				}, 50);
			},
			send(deviceId, serviceId, writeCharId) {
				const hex = 'A51201130AA51201130AA51201130A';
				uni.writeBLECharacteristicValue({
					deviceId,
					serviceId: serviceId,
					characteristicId: writeCharId,
					writeType: 'writeNoResponse',
					value: this.toArrayBuffer(hex),
					success: () => {
						this.addLog(hex, "写入设备必须要要做数据处理" + this.toArrayBuffer(hex));
						uni.showToast({
							title: "请点击设备开始测量",
							icon: 'none',
							duration: 1500
						});
					},
					fail: (e) => {
						this.addLog('BLE写入失败', e);
						const wave = this.getWaveRef();
						if (wave) wave.hideFullWave();
					}
				});
			},
			ecgbtn(createTime, startTime, id, rawData, voltageRange) {
				this.addLog('心电图', `查看详情 recordId=${id}`);
				uni.navigateTo({
					url: '/pages/tabBar/main/ecgFull',
					success: (res) => {
						const mvArr = this.unpackInt16ECG(
							this.toArrayBuffer(rawData),
							voltageRange || 500
						);
						res.eventChannel.emit('sendData', mvArr);
						res.eventChannel.emit('startTime', startTime);
						res.eventChannel.emit('createTime', createTime);
						uni.setStorageSync('sendData', mvArr);
					}
				});
			},
			tryParse() {
				// 按字节边界拆帧：不能用 indexOf('0a')，否则数据/校验和为 0x0A 时会误切
				// 从帧头起，在每个候选帧尾 0x0A 处用校验和确认，通过才消费该帧
				const odd = this.buffer.length % 2;
				const hexComplete = odd ? this.buffer.slice(0, -odd) : this.buffer;
				const oddNibble = odd ? this.buffer.slice(-1) : '';
				if (hexComplete.length < 10) return;

				const arr = new Uint8Array(hexComplete.match(/.{2}/g).map(b => parseInt(b, 16)));
				const MAX_FRAME = 64;
				let i = 0;
				let consumed = 0;

				while (i < arr.length) {
					const head = arr[i];
					if (head !== 0x23 && head !== 0xA6 && head !== 0xA5) {
						i++;
						consumed = i;
						continue;
					}
					const limit = Math.min(arr.length - 1, i + MAX_FRAME - 1);
					let accepted = false;
					for (let end = i + 4; end <= limit; end++) {
						if (arr[end] !== 0x0A) continue;
						const frame = arr.slice(i, end + 1);
						if (head === 0x23) {
							if (!this.isRxChecksumOk(frame)) continue;
							this.parseWave(frame);
						} else {
							if (!this.isRxChecksumOk(frame)) continue;
							this.parseCmd(frame);
						}
						i = end + 1;
						consumed = i;
						accepted = true;
						break;
					}
					if (!accepted) {
						if (arr.length - i >= MAX_FRAME) {
							i++;
							consumed = i;
							continue;
						}
						// 帧不完整，保留从帧头起的数据等待后续分包
						break;
					}
				}

				const keep = Array.from(arr.subarray(consumed))
					.map(b => b.toString(16).padStart(2, '0'))
					.join('');
				this.buffer = keep + oddNibble;
			},
			/** 接收帧校验：设备实际为 (载荷和 & 0xFF)；兼容旧版 (sum ^ 0x0A) */
			isRxChecksumOk(buf) {
				if (buf.length < 5 || buf[buf.length - 1] !== 0x0A) return false;
				const sumRx = buf[buf.length - 2];
				const sumCalc = buf.slice(1, -2).reduce((s, b) => s + b, 0) & 0xFF;
				return sumCalc === sumRx || ((sumCalc ^ 0x0A) === sumRx);
			},
			parseWave(buf) {
				if (!this.isRxChecksumOk(buf)) return;
				const str = String.fromCharCode(...buf.slice(1, -2));
				const val = parseFloat(str);
				if (Number.isNaN(val)) return;
				const wave = this.getWaveRef();
				if (!wave) return;
				// 已发测量命令或设备已开始采集时，自动进入测量并按模拟同款处理
				if (!wave.isMeasuring) {
					if (this.bleMeasureArmed || this.measurementStatus === '采集开始') {
						this.ensureBleMeasuring(wave, '收到波形帧');
					} else {
						if (!this._bleDropLogged) {
							this._bleDropLogged = true;
							this.addLog('波形', '收到 # 波形帧但未在测量中，已忽略（请先点开始测量）');
						}
						return;
					}
				}
				if (!wave.isMeasuring) return;
				const samples = this.processLiveBleSample(val);
				if (!samples.length) return;
				// 首包波形到达时重置 40s 计时，保证从真实出数起算
				if (this.dataCount === 0) {
					this.startBleMeasureTimer('首包波形到达', false);
					this.applyBleWaveRange(wave);
				}
				if (this.dataCount >= BLE_MEASURE_MAX_POINTS) {
					return;
				}
				const remain = BLE_MEASURE_MAX_POINTS - this.dataCount;
				const toPush = samples.length > remain ? samples.slice(0, remain) : samples;
				if (!toPush.length) return;
				wave.pushData(toPush);
				this.dataCount += toPush.length;
				this.fullDataCount = wave.getFullDataCount ? wave.getFullDataCount() : this.dataCount;
				this.queueLength = wave.getQueueLength ? wave.getQueueLength() : 0;
				if (this.dataCount === 1 || this.dataCount % 50 === 0) {
					this.addLog('波形', `已接收 ${this.dataCount} 点, 最近原始=${val}, 显示=${toPush[0].toFixed(3)}`);
				}
				if (this.dataCount >= BLE_MEASURE_MAX_POINTS) {
					this.clearBleMeasureTimer();
					this.finishBleMeasureByTimeout();
				}
			},
			parseCmd(buf) {
				if (!this.isRxChecksumOk(buf)) {
					const sumRx = buf[buf.length - 2];
					const sumCalc = buf.slice(1, -2).reduce((s, b) => s + b, 0) & 0xFF;
					this.addLog('协议',
						`命令帧校验失败 calc=0x${sumCalc.toString(16)} xor=0x${(sumCalc ^ 0x0A).toString(16)} rx=0x${sumRx.toString(16)}`
					);
					return;
				}
				if (buf[1] !== 0x15) return;
				const map = {
					0x00: '采集结束',
					0x01: '采集开始',
					0x02: '采集错误（未按键/提前结束）'
				};
				this.measurementStatus = map[buf[2]] || '未知状态';
				this.tip = this.measurementStatus;
				this.addLog('协议', this.measurementStatus);
				const wave = this.getWaveRef();
				if (!wave) return;
				if (buf[2] === 0x01) {
					this.bleMeasureArmed = true;
					this.ensureBleMeasuring(wave, '设备采集开始');
					this.startBleMeasureTimer('设备采集开始', true);
					return;
				}
				if (buf[2] === 0x00) {
					this.bleMeasureArmed = false;
					this.clearBleMeasureTimer();
					if (typeof wave.stopMeasurement === 'function') {
						wave.stopMeasurement();
					}
					const finalData = typeof wave.getFullDataList === 'function' ? wave.getFullDataList() : [];
					const rate = (typeof wave.getsampleRate === 'function' ? wave.getsampleRate() : wave.sampleRate) ||
						BLE_DRAW_SAMPLE_RATE;
					const duration = finalData.length / rate;
					this.addLog('采集结束', {
						totalPoints: finalData.length,
						duration: duration.toFixed(2) + 's',
						fixedWindow: BLE_MEASURE_SECONDS + 's'
					});
					if (finalData.length) {
						this.saveFinalData(finalData);
					}
					setTimeout(() => {
						this.showBleProcessedFullWave(wave);
						this.baseFeaturesExtracted = this.$t('未完成');
						this.derivedFeaturesExtracted = this.$t('未完成');
						this.qualityScore = this.$t('云端数据计算中');
						this.modelScore = this.$t('云端数据计算中');
					}, 300);
				} else if (buf[2] === 0x02) {
					this.bleMeasureArmed = false;
					this.clearBleMeasureTimer();
					if (typeof wave.stopMeasurement === 'function') {
						wave.stopMeasurement();
					}
					uni.showToast({
						title: this.$t('用户未按开始键或已暂停'),
						icon: 'none'
					});
				}
			},
			packInt16ECG(arr) {
				const n = arr.length;
				const ab = new ArrayBuffer(n * 2);
				const view = new DataView(ab);
				let maxVal = Math.max(...arr);
				let minVal = Math.min(...arr);
				let range = Math.max(Math.abs(maxVal), Math.abs(minVal)) * 1.2;
				const voltageRange = Math.max(range, 1);
				const scale = 32767 / voltageRange;
				for (let i = 0; i < n; i++) {
					let v = Math.max(-voltageRange, Math.min(voltageRange, arr[i]));
					view.setInt16(i * 2, Math.round(v * scale), true);
				}
				return {
					buffer: ab,
					voltageRange
				};
			},
			unpackInt16ECG(ab, voltageRange = 500) {
				if (!ab || !(ab instanceof ArrayBuffer)) return [];
				const n = ab.byteLength / 2;
				const view = new DataView(ab);
				const arr = new Array(n);
				const scale = 32767 / voltageRange;
				for (let i = 0; i < n; i++) {
					arr[i] = parseFloat((view.getInt16(i * 2, true) / scale).toFixed(6));
				}
				return arr;
			},
			saveFinalData(data) {
				const wave = this.getWaveRef();
				if (!wave) return;
				const packed = this.packInt16ECG(data);
				const ecgdata = {
					patientId: uni.getStorageSync('userid'),
					deviceSn: "11111111111",
					deviceModel: "客户测试ECG",
					samplingRate: wave.getsampleRate(),
					startTime: this.getTimeAllJSON().YMDHMS,
					dataFormat: 'INT16',
					voltageRange: packed.voltageRange,
					rawData: this.ab2hex(packed.buffer),
					dataLength: this.fullDataCount,
					baseFeaturesExtracted: '',
					derivedFeaturesExtracted: '',
					qualityScore: '',
					modelScore: '',
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS
				};
				this.addLog('上传', `数据点数: ${this.fullDataCount}`);
				this.$post(this.$url_APP_IP + '/prod-api/device/ecgdata', ecgdata, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				}).then((res) => {
					this.buffer = '';
					if (res.code === 200) {
						this.addLog('上传', '数据上传成功');
						uni.showLoading({
							title: this.$t('正在云端计算中请稍后'),
							mask: true
						});
						this.ecgdatalist();
					} else {
						this.addLog('上传失败', res);
					}
				}).catch((err) => {
					this.buffer = '';
					this.addLog('上传异常', err);
				});
			},
			ecgdatalist() {
				const ecgdata = {
					patientId: uni.getStorageSync('userid'),
					startTime: this.getTimeAllJSON().YMDHMS
				};
				this.addLog('云端', '拉取ECG列表');
				this.$get(this.$url_APP_IP + '/prod-api/device/ecgdata/list', ecgdata, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				}).then((res) => {
					if (res.code === 200 && res.total > 0) {
						if (res.rows[res.total - 1].baseFeaturesExtracted !== 1) {
							setTimeout(() => this.ecgdatalist(), 3000);
						} else {
							uni.hideLoading();
						}
						this.ecgdatarows = res.rows.slice().reverse();
						const latestRow = res.rows[res.total - 1];
						const wave = this.getWaveRef();
						if (wave) {
							const newData = this.unpackInt16ECG(
								this.toArrayBuffer(latestRow.rawData),
								latestRow.voltageRange || 500
							);
							wave.generateApiData(newData, latestRow.voltageRange);
						}
						this.baseFeaturesExtracted = latestRow.baseFeaturesExtracted === 1 ?
							this.$t('完成') : this.$t('未完成');
						this.derivedFeaturesExtracted = latestRow.derivedFeaturesExtracted === 1 ?
							this.$t('完成') : this.$t('未完成');
						this.qualityScore = latestRow.baseFeaturesExtracted === 1 ?
							latestRow.qualityScore : this.$t('云端数据计算中');
						this.modelScore = latestRow.baseFeaturesExtracted === 1 ?
							(latestRow.modelScore == null ? this.$t('ECG房颤数据质量偏低提示') : latestRow.modelScore) :
							this.$t('云端数据计算中');
						this.addLog('云端', `获取 ${res.total} 条记录`);
					} else {
						uni.hideLoading();
						this.baseFeaturesExtracted = '-/-';
						this.derivedFeaturesExtracted = '-/-';
						this.qualityScore = '-/-';
						this.modelScore = '-/-';
						const wave = this.getWaveRef();
						if (wave) wave.generateApiData([0]);
						this.addLog('云端', '当天暂无数据');
					}
				}).catch((err) => {
					uni.hideLoading();
					this.addLog('云端错误', err);
				});
			},
			clearWave() {
				const wave = this.getWaveRef();
				if (wave) wave.clear();
				this.dataCount = 0;
				this.fullDataCount = 0;
				this.queueLength = 0;
				this.measurementStatus = '';
				this._bleMeasureFinishing = false;
				this.clearBleMeasureTimer();
				this.resetBleStreamState();
			},
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
			ab2hex(buffer) {
				return Array.prototype.map.call(
					new Uint8Array(buffer),
					bit => ('00' + bit.toString(16)).slice(-2)
				).join('');
			}
		}
	};
</script>

<style scoped>
	.scroll-view {
		background: white;
	}

	.title_zs_ECG {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 20px;
		color: red;
		padding-bottom: 5px;
		margin-top: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.ble-panel {
		margin: 0 20px 16px;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 12px;
		border: 1px solid #e8e8e8;
	}

	.ble-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 0;
	}

	.ble-label {
		font-size: 26rpx;
		color: #666;
	}

	.ble-value {
		font-size: 26rpx;
		color: #333;
	}

	.ble-value.connected {
		color: #10bb13;
		font-weight: 600;
	}

	.ble-mono {
		font-family: monospace;
		font-size: 22rpx;
		max-width: 60%;
		word-break: break-all;
		text-align: right;
	}

	.ble-actions {
		display: flex;
		gap: 12px;
		margin-top: 12px;
	}

	.ble-scan-section {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #e8e8e8;
	}

	.ble-scan-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.ble-scan-title {
		font-size: 28rpx;
		color: #333;
		font-weight: 600;
	}

	.ble-scan-count {
		font-size: 24rpx;
		color: #888;
	}

	.ble-scan-actions {
		display: flex;
		gap: 10px;
		margin-bottom: 10px;
	}

	.scan-btn {
		flex: 1;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 24rpx;
		background: #1432f4;
		color: #fff;
	}

	.scan-btn.secondary {
		background: #f0f0f0;
		color: #333;
	}

	.ble-device-list {
		max-height: 240px;
		background: #fff;
		border: 1px solid #e8e8e8;
		border-radius: 8px;
	}

	.ble-device-item {
		padding: 12px 14px;
		border-bottom: 1px solid #f0f0f0;
	}

	.ble-device-item:last-child {
		border-bottom: none;
	}

	.ble-device-item.selected {
		background: #f0f4ff;
		border-left: 4px solid #1432f4;
	}

	.ble-device-main {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.ble-device-name {
		font-size: 28rpx;
		color: #222;
		font-weight: 500;
	}

	.ble-device-rssi {
		font-size: 22rpx;
		color: #888;
	}

	.ble-device-id {
		display: block;
		margin-top: 4px;
		font-size: 22rpx;
		color: #999;
		font-family: monospace;
		word-break: break-all;
	}

	.ble-device-empty {
		padding: 24px 14px;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}

	.ble-selected {
		margin-top: 10px;
		padding: 8px 12px;
		background: #e8f5e9;
		border-radius: 6px;
		font-size: 24rpx;
		color: #2e7d32;
		word-break: break-all;
	}

	.log-panel {
		margin: 0 20px 16px;
		padding: 12px;
		background: #1a1a2e;
		border-radius: 12px;
	}

	.log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.log-title {
		font-size: 26rpx;
		color: #a0a0b0;
		font-weight: 600;
	}

	.log-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.log-action {
		font-size: 24rpx;
		color: #6c8cff;
	}

	.log-scroll {
		height: 200px;
	}

	.log-line {
		display: flex;
		flex-wrap: wrap;
		padding: 4px 0;
		font-size: 22rpx;
		line-height: 1.5;
	}

	.log-time {
		color: #666;
		margin-right: 6px;
		flex-shrink: 0;
	}

	.log-tag {
		color: #6c8cff;
		margin-right: 6px;
		flex-shrink: 0;
	}

	.log-msg {
		color: #d0d0e0;
		word-break: break-all;
	}

	.log-empty {
		color: #666;
		font-size: 24rpx;
		text-align: center;
		padding: 20px 0;
	}

	.test-section {
		margin: 16px 20px 40px;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 12px;
		border: 1px dashed #d0d0d0;
	}

	.test-title {
		display: block;
		font-size: 28rpx;
		color: #333;
		font-weight: 600;
		margin-bottom: 12px;
	}

	.rhythm-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 12px;
	}

	.rhythm-item {
		padding: 8px 16px;
		border: 1px solid #e0e0e0;
		border-radius: 20px;
		background: #fff;
		font-size: 24rpx;
	}

	.rhythm-item.selected {
		border-color: #1432f4;
		background: #f0f4ff;
		color: #1432f4;
	}

	.rhythm-name {
		font-size: 24rpx;
	}

	.test-hint {
		display: block;
		margin-top: 10px;
		font-size: 22rpx;
		color: #888;
	}

	.test-actions {
		display: flex;
		gap: 12px;
	}

	.btn {
		flex: 1;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		border: none;
	}

	.btn.primary {
		background: #1432f4;
		color: #fff;
	}

	.btn.danger {
		background: #ff4d4f;
		color: #fff;
	}

	.btn.secondary {
		background: #f0f0f0;
		color: #333;
	}

	.btn[disabled] {
		opacity: 0.45;
	}
</style>