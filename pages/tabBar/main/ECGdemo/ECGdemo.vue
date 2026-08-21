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
				<text class="test-hint">BLE测试数据：原始 {{ bleDataPointCount }} 点 @{{ bleTestFs }}Hz
					≈{{ bleTestSec }}s（已是mV；clean±300后INT16；云端滤波）</text>

				<!-- <view class="txt-import-section">
					<text class="test-title">客户 hex TXT 解析上报</text>
					<view class="test-actions">
						<button class="btn primary" :disabled="customerTxtBusy || isMockTesting"
							@tap="pickCustomerTxtFile">选择TXT上报</button>
						<button class="btn secondary" :disabled="customerTxtBusy || isMockTesting"
							@tap="parseAndUploadBuiltinTxt">内置250hz上报</button>
					</view>
					<text class="test-hint" v-if="customerTxtInfo">{{ customerTxtInfo }}</text>
					<text class="test-hint" v-else>内置上报：ble-test-data(uV)→mV 后按原 INT16（2字节/点）上报</text>
				</view> -->
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
		bleTestEcgData,
		bleTestEcgFs,
		bleTestEcgSeconds,
		bleTestEcgNeedUvToMv
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
	 * 绘制采样率固定 250Hz（与 TXT/上报一致）。
	 * 显示：差分配对后 hold×2 对齐原始点数（10000@250Hz=40s）；上报仍用原始 mV，不走显示缓冲。
	 */
	const BLE_DRAW_SAMPLE_RATE = 250;
	/**
	 * 实时一屏目标可见波峰数（约 3～4 个）。仅本页 applyBleWaveRange 测量态使用。
	 * 注意：screenDuration 越长，一屏波峰越多、越挤；全波形窗口仍用 BLE_FULL_WAVE_SECONDS。
	 */
	const BLE_TARGET_PEAKS = 3.5;
	/** 实时一屏秒数：PC 建议最近 3～10 秒 mV 波形 */
	const BLE_SCREEN_SECONDS = 3.0;
	const BLE_SCREEN_SECONDS_MIN = 3;
	const BLE_SCREEN_SECONDS_MAX = 10;
	/** 每次蓝牙测量固定时长（秒）；模拟以 TXT 播完为准 */
	const BLE_MEASURE_SECONDS = 40;
	/**
	 * 全图一屏时间窗（秒）。
	 * 必须短：一屏画满 40s/整段数据会挤成一条毛刺带；用滑条看其余时段。
	 */
	const BLE_FULL_WAVE_SECONDS = 3.0;
	/** 测量最大点数（按绘制采样率） */
	const BLE_MEASURE_MAX_POINTS = BLE_MEASURE_SECONDS * BLE_DRAW_SAMPLE_RATE;
	/**
	 * 按可见波峰间距估算实时一屏时长（仅本页测量绘制，不影响全波形/云端/其他页）。
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
		// 偏高阈值，贴近肉眼主波峰（R 峰），减少小毛刺计入
		const thr = mean + 0.55 * std;
		// ~0.35s：按心率量级的主峰间距
		const minDist = Math.max(40, Math.floor(sampleRate * 0.35));
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
		if (peaks.length < 3) return fallback;
		const rrs = [];
		for (let i = 1; i < peaks.length; i++) rrs.push(peaks[i] - peaks[i - 1]);
		rrs.sort((a, b) => a - b);
		const medRr = rrs[Math.floor(rrs.length / 2)] || Math.round(sampleRate * 0.7);
		const sec = ((Math.max(2, targetPeaks) - 1) * medRr) / sampleRate;
		// PC：实时窗口建议最近 3～10 秒 mV 波形（250Hz×3s≈750 点）
		return Math.max(BLE_SCREEN_SECONDS_MIN, Math.min(BLE_SCREEN_SECONDS_MAX, sec || fallback));
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

	/** 本设备差分后显示极性：正值向上为 R 峰。若仍朝下，只改这一处为 1 或 -1 */
	const BLE_ECG_POLARITY = -1;

	/**
	 * 仅显示用（不上报）：
	 * 1) 连续同号 ±1650 轨合并，避免配对错位
	 * 2) 交替对 → (a-b)/2 去载波
	 * 3) 连续小信号 → (a+b)/2
	 * 4) * BLE_ECG_POLARITY；每对输出 1 点（离线再拉回原始点数）
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
		let v = isBleAlternatingPair(a, b) ? (a - b) / 2 : (a + b) / 2;
		v = slewBleValue(v, state.lastRaw);
		state.lastRaw = v;
		return [(v * BLE_ECG_POLARITY) / BLE_DISPLAY_SCALE];
	}

	/**
	 * 差分后点数约减半；逐点 hold×2 拉回 250Hz 时间轴，最终对齐 rawLen（通常 10000=40s）。
	 * 禁止不封顶 hold 出 20000（那才会被画成 80s）。
	 */
	function expandDisplayToRawLength(samples, rawLen) {
		if (!samples || !samples.length) return [];
		const target = Math.max(1, rawLen | 0);
		let src = samples;
		if (samples.length * 2 <= target + 2 || samples.length < target) {
			const held = new Array(samples.length * 2);
			for (let i = 0; i < samples.length; i++) {
				held[i * 2] = samples[i];
				held[i * 2 + 1] = samples[i];
			}
			src = held;
		}
		if (src.length === target) return src.slice();
		if (src.length > target) return src.slice(0, target);
		const out = src.slice();
		const last = out[out.length - 1];
		while (out.length < target) out.push(last);
		return out;
	}

	/**
	 * 仅显示用离线整段：与实时同一套 processBleStreamSample，再 hold×2 对齐原始点数。不上报。
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
		return expandDisplayToRawLength(out, raw.length);
	}

	/* ==================== 客户 hex TXT（对齐 ecg_main.py 导入流程，仅本页） ==================== */
	/** 对齐 PC：文件名无 Nhz 时默认 250Hz */
	const CUSTOMER_TXT_DEFAULT_FS = 250;
	const CUSTOMER_TXT_CTRL_START = 'A6 15 01 16';
	const CUSTOMER_TXT_CTRL_END = 'A6 15 00 15';
	const CUSTOMER_TXT_MIN_KEEP_SEC = 10;
	/** 上报固定：250Hz × 40s = 10000 点（与 TXT/BLE 一致）；对齐 DEFAULT_ECG_STORAGE_VOLTAGE_RANGE_MV=500 */
	const CUSTOMER_UPLOAD_FS = 250;
	const CUSTOMER_UPLOAD_SECONDS = 40;
	const CUSTOMER_UPLOAD_POINTS = CUSTOMER_UPLOAD_FS * CUSTOMER_UPLOAD_SECONDS; // 10000
	/** 对齐 ecg_main.DEFAULT_ECG_STORAGE_VOLTAGE_RANGE_MV */
	const CUSTOMER_STORAGE_VOLTAGE_RANGE_MV = 500;
	/** 对齐 ecg_main.CUSTOMER_HEX_TXT_ABS_LIMIT_MV：|x|>300 视为接触异常并插值 */
	const CUSTOMER_HEX_TXT_ABS_LIMIT_MV = 300;
	/** 对齐 ecg_main metadata.customer_lowpass_hz（云端特征用；本页入库 raw 不做滤波） */
	const CUSTOMER_HEX_TXT_LOWPASS_HZ = 12;

	/**
	 * 仅本页上报用：把采样压成 10000 点 @250Hz，去掉 hold×2 / 成对多采导致的 20000。
	 * 不影响显示、不影响其他文件。
	 */
	function normalizeEcgUploadSamples(samples, expectPoints = CUSTOMER_UPLOAD_POINTS) {
		const src = (samples || []).filter(v => Number.isFinite(v));
		if (!src.length) return {
			signal: [],
			corrected: false,
			from: 0
		};
		if (src.length === expectPoints) {
			return {
				signal: src.slice(),
				corrected: false,
				from: src.length
			};
		}
		// 典型：hold 重复或设备成对上报 → 约 2 倍，隔点抽取
		if (src.length === expectPoints * 2) {
			const out = new Array(expectPoints);
			for (let i = 0; i < expectPoints; i++) out[i] = src[i * 2];
			return {
				signal: out,
				corrected: true,
				from: src.length
			};
		}
		if (src.length > expectPoints) {
			// 均匀抽稀到 10000，保持约 40s 覆盖
			const out = new Array(expectPoints);
			const last = src.length - 1;
			for (let i = 0; i < expectPoints; i++) {
				out[i] = src[Math.round((i * last) / (expectPoints - 1))];
			}
			return {
				signal: out,
				corrected: true,
				from: src.length
			};
		}
		return {
			signal: src.slice(),
			corrected: false,
			from: src.length
		};
	}

	function customerPercentile(arr, p) {
		if (!arr || !arr.length) return 0;
		const sorted = arr.slice().sort((a, b) => a - b);
		const idx = (p / 100) * (sorted.length - 1);
		const lo = Math.floor(idx);
		const hi = Math.ceil(idx);
		if (lo === hi) return sorted[lo];
		const t = idx - lo;
		return sorted[lo] * (1 - t) + sorted[hi] * t;
	}

	/**
	 * 固定极性由 BLE_ECG_POLARITY 处理；此处不再按能量自动翻转（会与肉眼 R 峰冲突并二次取反）。
	 */
	function orientCustomerEcgUpright(signal) {
		return {
			signal: signal ? signal.slice() : [],
			flipped: false
		};
	}

	/**
	 * 仅本页实时/全波形显示：mV 转回显示量级后差分成连续波（不上报）。
	 * 上报严格按 PC store_data：customer 已是 mV 的 cleaned raw，不做差分解码。
	 */
	function customerMvToDisplayWave(mvSignal) {
		if (!mvSignal || !mvSignal.length) return [];
		let maxAbs = 0;
		for (let i = 0; i < mvSignal.length; i++) {
			const a = Math.abs(Number(mvSignal[i]));
			if (Number.isFinite(a) && a > maxAbs) maxAbs = a;
		}
		const rawLike = maxAbs > 0 && maxAbs < 20 ?
			mvSignal.map((v) => (Number.isFinite(v) ? v * 1000 : 0)) :
			mvSignal.slice();
		return prepareBleContinuousWave(rawLike);
	}

	function inferFsFromFileName(fileName) {
		if (!fileName) return 0;
		const m = String(fileName).match(/(\d+)\s*(?:hz|Hz|HZ)/);
		return m ? parseInt(m[1], 10) : 0;
	}

	function splitBytesBy0A(bytes) {
		const lines = [];
		let cur = [];
		for (let i = 0; i < bytes.length; i++) {
			if (bytes[i] === 0x0a) {
				lines.push(cur);
				cur = [];
			} else {
				cur.push(bytes[i]);
			}
		}
		if (cur.length) lines.push(cur);
		return lines;
	}

	function decodeAsciiOrLatin1(lineBytes) {
		let s = '';
		for (let i = 0; i < lineBytes.length; i++) {
			s += String.fromCharCode(lineBytes[i] & 0xff);
		}
		return s;
	}

	function lineBytesToHex(lineBytes) {
		return lineBytes
			.map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase())
			.join(' ');
	}

	/**
	 * 对齐 read_customer_ecg_hex_txt：hex 文本 → bytes → 按 0A 分行 → 控制帧 / #采样。
	 * 一个数据点 = 一整帧，例如：
	 *   23 31 36 31 37 2E 37 37 6B 0A
	 *   #  1  6  1  7  .  7  7  CS LF
	 * → 原始值按已是 mV 保留（禁止 ÷1000）→ clean±300 → INT16 小端上报（2字节/点）
	 * （末尾校验字节与 0A 帧尾不计入采样值；滤波由云端 processed_data 做）
	 */
	function parseCustomerHexTxt(txtContent) {
		const hexList = String(txtContent || '').match(/[0-9A-Fa-f]{2}/g) || [];
		const bytes = hexList.map(h => parseInt(h, 16));
		const lines = splitBytesBy0A(bytes);
		const ecgValues = [];
		const controlFrames = [];

		for (let i = 0; i < lines.length; i++) {
			const lineBytes = lines[i];
			if (!lineBytes.length) continue;
			const hexLine = lineBytesToHex(lineBytes);
			if (hexLine === CUSTOMER_TXT_CTRL_START || hexLine === CUSTOMER_TXT_CTRL_END) {
				controlFrames.push(hexLine);
				continue;
			}
			// 按 0A 切出的一行 = 1 个数据点；只取 # 后数值，忽略校验字节
			const lineText = decodeAsciiOrLatin1(lineBytes).trim();
			if (!lineText.startsWith('#')) continue;
			const match = lineText.match(/#\s*([-+]?\d+(?:\.\d+)?)/);
			if (match) {
				ecgValues.push(parseFloat(match[1]));
			}
		}
		return {
			ecgValues,
			controlFrames
		};
	}

	/** 数值最多保留小数点后 6 位 */
	function roundMv6(v) {
		const n = Number(v);
		if (!Number.isFinite(n)) return 0;
		return parseFloat(n.toFixed(6));
	}

	/**
	 * 对齐 ecg_main.clean_customer_hex_txt_ecg：
	 * 客户确认 hex/# 采样已是 ADC→mV（250Hz），不做 µV→mV。
	 * |x| > 300 视为接触异常，线性插值替换。
	 */
	function cleanCustomerHexTxtEcg(values, absLimitMv = CUSTOMER_HEX_TXT_ABS_LIMIT_MV) {
		const signal = [];
		for (let i = 0; i < (values || []).length; i++) {
			const v = Number(values[i]);
			signal.push(Number.isFinite(v) ? v : NaN);
		}
		const info = {
			unitMode: 'customer_adc_mV',
			outlierAbsLimitMv: Number(absLimitMv) || CUSTOMER_HEX_TXT_ABS_LIMIT_MV,
			outlierCount: 0,
			outlierRatio: 0
		};
		if (!signal.length) {
			return {
				signal: [],
				info
			};
		}
		const limit = info.outlierAbsLimitMv;
		const invalid = new Array(signal.length);
		let invalidCount = 0;
		for (let i = 0; i < signal.length; i++) {
			const bad = !Number.isFinite(signal[i]) || Math.abs(signal[i]) > limit;
			invalid[i] = bad;
			if (bad) invalidCount++;
		}
		info.outlierCount = invalidCount;
		info.outlierRatio = invalidCount / signal.length;
		if (!invalidCount) {
			return {
				signal: signal.map(roundMv6),
				info
			};
		}
		const validIdx = [];
		const validVal = [];
		for (let i = 0; i < signal.length; i++) {
			if (!invalid[i]) {
				validIdx.push(i);
				validVal.push(signal[i]);
			}
		}
		if (validIdx.length < 2) {
			return {
				signal: signal.map(() => 0),
				info
			};
		}
		const cleaned = signal.slice();
		for (let i = 0; i < cleaned.length; i++) {
			if (!invalid[i]) continue;
			// 线性插值（对齐 np.interp）
			let lo = 0;
			let hi = validIdx.length - 1;
			if (i <= validIdx[0]) {
				cleaned[i] = validVal[0];
				continue;
			}
			if (i >= validIdx[hi]) {
				cleaned[i] = validVal[hi];
				continue;
			}
			while (hi - lo > 1) {
				const mid = (lo + hi) >> 1;
				if (validIdx[mid] <= i) lo = mid;
				else hi = mid;
			}
			const x0 = validIdx[lo];
			const x1 = validIdx[hi];
			const y0 = validVal[lo];
			const y1 = validVal[hi];
			const t = (i - x0) / (x1 - x0);
			cleaned[i] = y0 + (y1 - y0) * t;
		}
		return {
			signal: cleaned.map(roundMv6),
			info
		};
	}

	/**
	 * 对齐 ecg_main.normalize_imported_ecg_units（仅非客户 hex 文本数值用）：
	 * 绝对值 99 分位 > 20 → 视为 uV，除以 1000 转 mV。
	 * 客户 hex/# 请用 cleanCustomerHexTxtEcg，不要走这里。
	 */
	function convertCustomerEcgToMv(ecgValues) {
		const values = (ecgValues || []).filter(v => Number.isFinite(v));
		if (!values.length) {
			return {
				signal: [],
				unitWasUv: false,
				unitMode: 'unknown',
				p99Abs: 0
			};
		}
		const p99Abs = customerPercentile(values.map(Math.abs), 99);
		const unitWasUv = p99Abs > 20;
		const signal = (unitWasUv ? values.map(v => v / 1000) : values.slice()).map(roundMv6);
		return {
			signal,
			unitWasUv,
			unitMode: unitWasUv ? 'uV_to_mV' : 'mV',
			p99Abs
		};
	}

	/**
	 * 上报前强制得到 mV 波形：原始 #/ADC 若是 uV（p99Abs>20）则 ÷1000。
	 * 禁止把 uV 直接送去量化打包。转换后最多 6 位小数。
	 */
	function ensureUploadMvSignal(rawValues) {
		const raw = [];
		for (let i = 0; i < (rawValues || []).length; i++) {
			const v = Number(rawValues[i]);
			if (Number.isFinite(v)) raw.push(v);
		}
		const converted = convertCustomerEcgToMv(raw);
		const mv = converted.signal;
		const p99Mv = mv.length ? customerPercentile(mv.map(Math.abs), 99) : 0;
		// 转换后仍像 uV：再强制 ÷1000（防上游已标 mV 但数值未除）
		if (p99Mv > 20) {
			const forced = mv.map(v => roundMv6(v / 1000));
			return {
				raw,
				signal: forced,
				unitWasUv: true,
				unitMode: 'uV_to_mV_forced',
				p99AbsRaw: converted.p99Abs,
				p99AbsMv: customerPercentile(forced.map(Math.abs), 99)
			};
		}
		return {
			raw,
			signal: mv.map(roundMv6),
			unitWasUv: converted.unitWasUv,
			unitMode: converted.unitMode,
			p99AbsRaw: converted.p99Abs,
			p99AbsMv: p99Mv
		};
	}

	function isCustomerWindowGood(windowSamples) {
		if (!windowSamples || windowSamples.length < 8) return false;
		const finite = [];
		for (let i = 0; i < windowSamples.length; i++) {
			const v = windowSamples[i];
			if (Number.isFinite(v)) finite.push(v);
		}
		const validRatio = finite.length / windowSamples.length;
		if (validRatio < 0.95) return false;
		if (finite.length < 8) return false;

		const p5 = customerPercentile(finite, 5);
		const p95 = customerPercentile(finite, 95);
		const robustRange = p95 - p5;
		if (robustRange < 0.03 || robustRange > 15.0) return false;

		const p99Abs = customerPercentile(finite.map(Math.abs), 99);
		if (p99Abs > 20.0) return false;

		const uniq = {};
		let uniqCount = 0;
		for (let i = 0; i < finite.length; i++) {
			const key = finite[i].toFixed(6);
			if (!uniq[key]) {
				uniq[key] = 1;
				uniqCount++;
			}
		}
		if (uniqCount / finite.length <= 0.02) return false;

		const diffs = [];
		for (let i = 1; i < finite.length; i++) {
			diffs.push(Math.abs(finite[i] - finite[i - 1]));
		}
		const diffScale = customerPercentile(diffs, 95);
		if (diffScale > Math.max(5.0, robustRange * 8.0)) return false;
		return true;
	}

	/**
	 * 首尾质量裁剪：2s 窗、1s 步；只裁首尾；裁后不足 10s 则不裁。
	 */
	function trimLowQualityEdges(signal, fs) {
		const info = {
			trim_start_sec: 0,
			trim_end_sec: 0,
			trim_applied: false
		};
		if (!signal || !signal.length || !fs || fs <= 0) {
			return {
				signal: signal || [],
				info
			};
		}
		const winSec = 2;
		const stepSec = 1;
		const win = Math.max(1, Math.round(fs * winSec));
		const step = Math.max(1, Math.round(fs * stepSec));
		if (signal.length < win) {
			return {
				signal: signal.slice(),
				info
			};
		}

		const goodStarts = [];
		for (let start = 0; start + win <= signal.length; start += step) {
			const slice = signal.slice(start, start + win);
			if (isCustomerWindowGood(slice)) goodStarts.push(start);
		}
		if (!goodStarts.length) {
			return {
				signal: signal.slice(),
				info
			};
		}

		const firstGood = goodStarts[0];
		const lastGoodEnd = goodStarts[goodStarts.length - 1] + win;
		const trimmed = signal.slice(firstGood, lastGoodEnd);
		const keepSec = trimmed.length / fs;
		if (keepSec < CUSTOMER_TXT_MIN_KEEP_SEC) {
			return {
				signal: signal.slice(),
				info
			};
		}

		info.trim_start_sec = firstGood / fs;
		info.trim_end_sec = (signal.length - lastGoodEnd) / fs;
		info.trim_applied = info.trim_start_sec > 0 || info.trim_end_sec > 0;
		return {
			signal: trimmed,
			info
		};
	}

	/**
	 * 对齐 ecg_main 客户 hex TXT：
	 * - clean_customer_hex_txt_ecg（已是 mV，|x|>300 插值）
	 * - store_data 入库：cleaned raw INT16，不做 µV→mV，不做 baseline/lp/notch
	 * - 首尾质量裁剪只用于本地 trimInfo，不改写入 rawData 的波形
	 * 滤波（baseline/lp12/notch）由云端对 processed_data 做，与 PC save_processed_signal 一致。
	 */
	function applyPcVoltagePipeline(rawValues, fileName) {
		const rawUv = [];
		for (let i = 0; i < (rawValues || []).length; i++) {
			const v = Number(rawValues[i]);
			if (Number.isFinite(v)) rawUv.push(v);
		}
		const cleaned = cleanCustomerHexTxtEcg(rawUv);
		const fs = inferFsFromFileName(fileName) || CUSTOMER_TXT_DEFAULT_FS;
		const trimResult = trimLowQualityEdges(cleaned.signal, fs);
		const p99Abs = cleaned.signal.length ?
			customerPercentile(cleaned.signal.map(Math.abs), 99) :
			0;
		return {
			rawUv,
			samplingRate: fs,
			/** 与 PC store_data 一致：cleaned raw（未滤波），用于 INT16 上报 */
			ecgData: cleaned.signal.slice(),
			/** 同 ecgData（显式命名，避免误用裁剪结果） */
			ecgDataFull: cleaned.signal.slice(),
			/** 仅本地/元数据：裁剪后波形，不上报 */
			ecgDataTrimmed: trimResult.signal.slice(),
			trimInfo: trimResult.info,
			unit: 'mV',
			unitWasUv: false,
			unitMode: cleaned.info.unitMode,
			p99AbsRaw: p99Abs,
			rawPointCount: rawUv.length,
			customerCleanInfo: cleaned.info,
			customerLowpassHz: CUSTOMER_HEX_TXT_LOWPASS_HZ,
			skipForceUvConvert: true
		};
	}

	/**
	 * 对齐 PC「导入客户 hex TXT ECG」：
	 * ① hex/# → 原始采样（已是 mV）
	 * ② clean ±300 → store_data INT16
	 * ③ 云端再做 baseline/lp/notch（本页不上报前滤波）
	 */
	function parseCustomerTxt(txtContent, fileName, preParsedValues) {
		let ecgValues = [];
		let controlFrames = [];
		if (preParsedValues && preParsedValues.length) {
			ecgValues = preParsedValues.filter(v => Number.isFinite(v));
		} else {
			const parsed = parseCustomerHexTxt(txtContent);
			ecgValues = parsed.ecgValues;
			controlFrames = parsed.controlFrames;
			if (!(ecgValues.length >= 100 && controlFrames.length)) {
				throw new Error('非客户 hex TXT（需控制帧且采样≥100）');
			}
		}
		const pipe = applyPcVoltagePipeline(ecgValues, fileName);
		const oriented = orientCustomerEcgUpright(pipe.ecgData);
		return {
			...pipe,
			controlFrames,
			ecgDataDisplay: oriented.signal,
			trimInfo: {
				...pipe.trimInfo,
				polarityFlipped: oriented.flipped
			},
			raw_format: 'customer_hex_txt'
		};
	}

	/**
	 * ble-test-data.js：60s 已是 mV（对齐 PC customer_adc_mV）。
	 * 显示：差分连续波；上报：clean±300 → INT16 raw（云端再滤波）。
	 */
	const bleContinuousWaveData = prepareBleContinuousWave(bleTestEcgData);
	/** 按主峰 RR 估出的一屏秒数（钳制在 3～10s） */
	const BLE_ESTIMATED_SCREEN_SECONDS = estimateBleScreenSeconds(bleContinuousWaveData);
	/** 缩放后的显示量程（差分后仍为显示缓冲量级） */
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
				/** BLE 模拟回放定时器（播完即停，不循环） */
				bleMockTimer: null,
				selectedType: BLE_TEST_TYPE,
				rhythmOptions: [],
				bleDataPointCount: bleTestEcgData.length,
				bleTestFs: bleTestEcgFs,
				bleTestSec: bleTestEcgSeconds,
				/** 模拟结束后保持 BLE 全波形，云端列表只更新评分不覆盖波形 */
				keepBleFullWaveDisplay: false,
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
				bleMeasureArmed: false,
				/** 蓝牙原始 # 采样（未做差分显示处理），用于 mV 换算上报 */
				bleRawEcgValues: [],
				/** 客户 TXT 解析上报进行中 */
				customerTxtBusy: false,
				customerTxtInfo: ''
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
					name: `BLE测试数据(${bleTestEcgData.length}点)`
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
			/**
			 * 仅本页全波形/云端数据显示用：按峰值把高度压到约半屏 25%，避免顶满画布。
			 * 不改 ecg-wave 默认逻辑，也不影响实时测量增益（BLE_MEASURE_GAIN）。
			 * generateApiData 在 voltageRange<=10 时会把 apiDataAmplifyFactor 设为 25，必须在其后覆盖。
			 */
			fitEcgDemoWaveGain(wave, data, fillRatio = 0.25) {
				if (!wave || !data || !data.length) return 0;
				const absList = [];
				let maxAbs = 0;
				for (let i = 0; i < data.length; i++) {
					const a = Math.abs(Number(data[i]));
					if (!Number.isFinite(a)) continue;
					absList.push(a);
					if (a > maxAbs) maxAbs = a;
				}
				if (!absList.length) return 0;
				absList.sort((a, b) => a - b);
				const p95 = absList[Math.min(absList.length - 1, Math.floor(absList.length * 0.95))] || maxAbs;
				const p99 = absList[Math.min(absList.length - 1, Math.floor(absList.length * 0.99))] || maxAbs;
				// 用更大 scaleAbs（贴近 maxAbs），降低 amp，避免尖峰顶边、整体显大
				const scaleAbs = Math.max(p95 * 1.15, p99 * 1.05, maxAbs * 0.75, 0.001);
				const fixedGain = wave.fixedGain || 50;
				const marginTB = (wave.margin && (wave.margin.top + wave.margin.bottom)) || 40;
				const halfH = Math.max(60, ((wave.pxHeight || 280) - marginTB) / 2);
				const amp = (halfH * fillRatio) / (scaleAbs * fixedGain);
				wave.apiDataAmplifyFactor = 1;
				wave.measureAmplifyFactor = amp;
				wave.amplifyFactor = amp;
				if (typeof wave.forceDraw === 'function') {
					wave.forceDraw();
				}
				this.addLog('波形缩放',
					`maxAbs=${maxAbs.toFixed(3)}, p95=${p95.toFixed(3)}, p99=${p99.toFixed(3)}, scale=${scaleAbs.toFixed(3)}, amp=${amp.toFixed(4)}, fill=${fillRatio}`
				);
				return amp;
			},
			/** 全波形：短窗口不挤在一起；垂直增益按峰值自适应，避免顶出画布 */
			showBleProcessedFullWave(wave) {
				if (!wave || typeof wave.showFullWave !== 'function') return;
				this.applyBleWaveRange(wave, true);
				wave.showFullWave();
				const total = typeof wave.fullWaveTotalDuration === 'number' ?
					wave.fullWaveTotalDuration :
					((wave.fullDataList && wave.fullDataList.length) || (wave.apiDataList && wave.apiDataList
							.length) ||
						0) /
					(wave.sampleRate || 250);
				// 一屏 3～10s（250Hz×3s≈750 点），禁止把整段 40s 塞进画布
				const win = Math.min(
					BLE_FULL_WAVE_SECONDS,
					Math.max(BLE_SCREEN_SECONDS_MIN, Math.min(BLE_SCREEN_SECONDS_MAX, total ||
						BLE_SCREEN_SECONDS))
				);
				// 优先从有信号的靠后位置起看（避开开头接触不稳定段）
				const start = total > win + 3 ? Math.min(3, total - win) : 0;
				wave.fullWaveStartTime = start;
				wave.fullWaveDuration = win;
				wave.fullWaveEndTime = Math.min(total, start + win);
				if (typeof wave.updateFullWaveData === 'function') {
					wave.updateFullWaveData();
				}
				const src = (wave.fullDataList && wave.fullDataList.length) ?
					wave.fullDataList :
					(wave.apiDataList || []);
				const amp = this.fitEcgDemoWaveGain(wave, src, 0.25);
				this.addLog(
					'全波形',
					`自适应增益=${(amp || 0).toFixed(4)}, 一屏=${win.toFixed(1)}s / 总${total.toFixed(1)}s, 极性=${BLE_ECG_POLARITY}`
				);
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
			 * 实时显示：与离线 BLE 全波形同一套差分解码（不上报）。
			 */
			processLiveBleSample(rawVal) {
				if (!Number.isFinite(rawVal)) return [];
				if (!this._bleStreamState) this._bleStreamState = createBleStreamState();
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
			clearBleMockTimer() {
				if (this.bleMockTimer) {
					clearInterval(this.bleMockTimer);
					this.bleMockTimer = null;
				}
			},
			/**
			 * BLE 模拟：本地按采样率推送，播完自动停止，不循环。
			 * 不走 ecg-wave.startTestWaveform（其内部会把 index 置 0 重复播放）。
			 */
			startBleMockPlayback(wave, payload) {
				this.clearBleMockTimer();
				if (wave && typeof wave.stopTestWaveform === 'function') {
					wave.stopTestWaveform();
				}
				if (wave && typeof wave.clear === 'function') {
					wave.clear();
				}
				this._bleMockData = payload || [];
				this._bleMockIndex = 0;
				this.applyBleWaveRange(wave);
				if (typeof wave.startMeasurement === 'function') {
					wave.startMeasurement();
				}
				this.applyBleWaveRange(wave);
				const batchesPerSecond = 10;
				const batchSize = Math.max(1, Math.round(BLE_DRAW_SAMPLE_RATE / batchesPerSecond));
				const interval = Math.round(1000 / batchesPerSecond);
				this.isMockTesting = true;
				this.bleMockTimer = setInterval(() => {
					if (!this.isMockTesting) {
						this.clearBleMockTimer();
						return;
					}
					const data = this._bleMockData || [];
					if (this._bleMockIndex >= data.length) {
						this.clearBleMockTimer();
						this.addLog('模拟测试', `数据播放完毕(${data.length}点)，自动停止`);
						this.stopMockTest(true);
						return;
					}
					const end = Math.min(this._bleMockIndex + batchSize, data.length);
					const batch = data.slice(this._bleMockIndex, end);
					this._bleMockIndex = end;
					if (batch.length && typeof wave.pushData === 'function') {
						wave.pushData(batch);
					}
				}, interval);
			},
			startMockTest() {
				const wave = this.getWaveRef();
				if (!wave) {
					uni.showToast({
						title: '波形组件未就绪',
						icon: 'none'
					});
					return;
				}
				this.keepBleFullWaveDisplay = false;
				if (this.selectedType === BLE_TEST_TYPE) {
					const payload = this.getBleWavePayload();
					if (!payload.length) {
						uni.showToast({
							title: '无模拟数据',
							icon: 'none'
						});
						return;
					}
					this.startBleMockPlayback(wave, payload);
					this.addLog(
						'模拟测试',
						`开始BLE回放(播完即停): ${payload.length}点, screen=${BLE_ESTIMATED_SCREEN_SECONDS.toFixed(2)}s(~${BLE_TARGET_PEAKS}峰), range=${BLE_VOLTAGE_RANGE}`
					);
					return;
				}
				if (typeof wave.startTestWaveform !== 'function') {
					uni.showToast({
						title: '波形组件未就绪',
						icon: 'none'
					});
					return;
				}
				wave.startTestWaveform(this.selectedType);
				this.isMockTesting = true;
				this.addLog('模拟测试', `开始: ${this.selectedType}`);
			},
			stopMockTest(showBleFull = true) {
				const wave = this.getWaveRef();
				const wasBle = this.selectedType === BLE_TEST_TYPE && this.isMockTesting;
				this.clearBleMockTimer();
				// 先标记，避免 stopMeasurement / 定时器误走 saveFinalData 把显示点当成上报
				if (showBleFull && wasBle) {
					this.keepBleFullWaveDisplay = true;
				}
				if (wave && typeof wave.stopTestWaveform === 'function') {
					wave.stopTestWaveform();
				}
				// 自定义 BLE 回放未走 isTestMode，需显式结束测量
				if (wasBle && wave && wave.isMeasuring && typeof wave.stopMeasurement === 'function') {
					wave.stopMeasurement();
				}
				this.isMockTesting = false;
				this._bleMockData = null;
				this._bleMockIndex = 0;
				if (showBleFull && wasBle) {
					// 内置 ble-test-data：对齐 PC 客户 hex（已是 mV + ±300 清洁 → INT16）
					this.uploadMockBleCustomerEcg();
					setTimeout(() => this.renderBleFullWaveFromPayload('模拟完成'), 50);
				}
				this.addLog('模拟测试', '已停止');
			},
			/**
			 * 对齐 PC 客户 hex/#：已是 mV → clean±300 → INT16（store_data raw）。
			 * 不做 µV→mV；滤波由云端 processed_data 完成。
			 */
			uploadRawUvCustomerEcg(rawUvValues, options = {}) {
				const raw = (rawUvValues || []).filter(v => Number.isFinite(Number(v))).map(Number);
				const logTag = options.logTag || '解析上报';
				const errTag = options.errTag || '上报异常';
				const fileName = options.fileName || '250hz_40s.txt';
				const rawFormat = options.raw_format || 'customer_ble_raw';
				if (!raw.length) {
					this.addLog(logTag, '无原始采样');
					return;
				}
				const result = parseCustomerTxt('', fileName, raw);
				result.raw_format = rawFormat;
				result.fileName = fileName;
				result.skipForceUvConvert = true;
				const cleanInfo = result.customerCleanInfo || {};
				const tip =
					`①原始 ${result.rawPointCount}点 → ②clean±${CUSTOMER_HEX_TXT_ABS_LIMIT_MV} ${result.ecgData.length}点(已是mV,无uV→mV), ` +
					`fs=${result.samplingRate}Hz, unit=${result.unitMode}, outliers=${cleanInfo.outlierCount || 0}, ` +
					`本地裁剪参考=${result.trimInfo.trim_applied ? `首${result.trimInfo.trim_start_sec.toFixed(1)}s/尾${result.trimInfo.trim_end_sec.toFixed(1)}s` : '无'}`;
				this.addLog(logTag, tip);
				this.addLog(logTag, {
					step1_raw_head: (result.rawUv || raw).slice(0, 5),
					step2_store_head: (result.ecgData || []).slice(0, 5),
					sampling_rate: result.samplingRate,
					unit: result.unit,
					unit_mode: result.unitMode,
					raw_format: result.raw_format,
					customer_clean: cleanInfo,
					trim_info_local: result.trimInfo,
					upload_points: result.ecgData.length
				});
				this.fullDataCount = result.ecgData.length;
				this.uploadCustomerTxtEcg(result).catch((err) => {
					this.addLog(errTag, err);
				});
			},
			/**
			 * 已是 mV 采样（模拟 ble-test-data / 实时 # 帧解析后）：
			 * 与 PC clean_customer_hex_txt_ecg 同路径 → clean±300 → INT16。
			 */
			uploadAlreadyMvCustomerEcg(mvValues, options = {}) {
				const raw = (mvValues || []).filter(v => Number.isFinite(Number(v))).map(Number);
				const logTag = options.logTag || '解析上报';
				const errTag = options.errTag || '上报异常';
				const fs = options.fs || bleTestEcgFs || CUSTOMER_UPLOAD_FS;
				const sec = options.seconds || bleTestEcgSeconds || 60;
				const fileName = options.fileName || `${fs}hz_${sec}s.txt`;
				const rawFormat = options.raw_format || 'customer_ble_mock';
				if (!raw.length) {
					this.addLog(logTag, '无已是 mV 采样');
					return;
				}
				const cleaned = cleanCustomerHexTxtEcg(raw);
				const signal = cleaned.signal;
				const p99Abs = signal.length ? customerPercentile(signal.map(Math.abs), 99) : 0;
				const result = {
					rawUv: raw.slice(),
					ecgData: signal.slice(),
					ecgDataFull: signal.slice(),
					ecgDataDisplay: signal.slice(),
					samplingRate: fs,
					unit: 'mV',
					unitWasUv: false,
					unitMode: cleaned.info.unitMode,
					skipForceUvConvert: true,
					p99AbsRaw: p99Abs,
					rawPointCount: raw.length,
					fileName,
					raw_format: rawFormat,
					customerCleanInfo: cleaned.info,
					customerLowpassHz: CUSTOMER_HEX_TXT_LOWPASS_HZ,
					trimInfo: {
						trim_applied: false,
						trim_start_sec: 0,
						trim_end_sec: 0,
						polarityFlipped: false
					}
				};
				const tip =
					`①已是mV ${result.rawPointCount}点 → ②clean±${CUSTOMER_HEX_TXT_ABS_LIMIT_MV} ${result.ecgData.length}点, ` +
					`fs=${fs}Hz≈${sec}s, unit=${result.unitMode}, outliers=${cleaned.info.outlierCount}`;
				this.addLog(logTag, tip);
				this.addLog(logTag, {
					step1_raw_head: raw.slice(0, 5),
					step2_store_head: signal.slice(0, 5),
					sampling_rate: fs,
					unit: result.unit,
					unit_mode: result.unitMode,
					raw_format: result.raw_format,
					customer_clean: cleaned.info,
					upload_points: result.ecgData.length,
					p99Abs
				});
				this.fullDataCount = result.ecgData.length;
				this.uploadCustomerTxtEcg(result).catch((err) => {
					this.addLog(errTag, err);
				});
			},
			/** 模拟：内置 ble-test-data 一律走客户 hex mV 清洁路径 */
			uploadMockBleCustomerEcg() {
				if (!bleTestEcgData || !bleTestEcgData.length) {
					this.addLog('模拟上报', '无 bleTestEcgData');
					return;
				}
				this.uploadAlreadyMvCustomerEcg(bleTestEcgData, {
					raw_format: 'customer_ble_mock',
					logTag: '模拟解析上报',
					errTag: '模拟上报异常',
					fs: bleTestEcgFs,
					seconds: bleTestEcgSeconds,
					fileName: `${bleTestEcgFs}hz_${bleTestEcgSeconds}s.txt`
				});
			},
			/** 与「加载BLE全波形」共用：始终用 bleContinuousWaveData（与 TXT 同点数） */
			renderBleFullWaveFromPayload(reason = '加载') {
				const wave = this.getWaveRef();
				if (!wave || typeof wave.generateApiData !== 'function') {
					uni.showToast({
						title: '波形组件未就绪',
						icon: 'none'
					});
					return;
				}
				const payload = this.getBleWavePayload();
				if (!payload.length) {
					uni.showToast({
						title: '无模拟数据',
						icon: 'none'
					});
					return;
				}
				if (typeof this.clearWave === 'function') this.clearWave();
				this.applyBleWaveRange(wave, true);
				wave.generateApiData(payload, Math.max(BLE_VOLTAGE_RANGE, 50));
				this.showBleProcessedFullWave(wave);
				this.selectedType = BLE_TEST_TYPE;
				this.fullDataCount = payload.length;
				this.addLog(
					'BLE波形',
					`${reason}: 显示${payload.length}点 @${BLE_DRAW_SAMPLE_RATE}Hz≈${(payload.length / BLE_DRAW_SAMPLE_RATE).toFixed(1)}s（TXT原始${bleTestEcgData.length}点）`
				);
			},
			loadBleFullWave() {
				this.stopMockTest(false);
				this.keepBleFullWaveDisplay = true;
				this.renderBleFullWaveFromPayload('加载BLE全波形');
				uni.showToast({
					title: `已加载 ${bleTestEcgData.length} 点`,
					icon: 'none'
				});
			},
			/* ==================== 客户 hex TXT 解析上报（不影响 BLE 实时/模拟） ==================== */
			showCustomerMvWave(mvSignal, fs) {
				const wave = this.getWaveRef();
				if (!wave || typeof wave.generateApiData !== 'function' || !mvSignal || !mvSignal.length) return;
				// 显示：差分连续波；上报另走 ensureUploadMvSignal → INT16
				const display = customerMvToDisplayWave(mvSignal);
				if (!display.length) return;
				const displayFs = fs || CUSTOMER_TXT_DEFAULT_FS || 250;
				let maxAbs = 0;
				for (let i = 0; i < display.length; i++) {
					const a = Math.abs(display[i]);
					if (a > maxAbs) maxAbs = a;
				}
				// 传较大 voltageRange，避免 generateApiData 走 apiAmp=25 的小量程分支
				const voltageRange = Math.max(50, Math.ceil(maxAbs * 1.5 * 10) / 10);
				this.stopMockTest(false);
				if (typeof this.clearWave === 'function') this.clearWave();
				if (typeof wave.setSampleRate === 'function') {
					wave.setSampleRate(displayFs);
				} else {
					wave.sampleRate = displayFs;
				}
				wave.generateApiData(display, voltageRange);
				this.showBleProcessedFullWave(wave);
				this.addLog('极性',
					`客户 TXT 显示差分波形 ${display.length} 点 / ${(display.length / displayFs).toFixed(1)}s @${displayFs}Hz（原 ${mvSignal.length} 点）`
				);
			},
			readLocalTxtFile(filePath) {
				return new Promise((resolve, reject) => {
					// #ifdef APP-PLUS
					if (typeof plus !== 'undefined' && plus.io) {
						plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
							entry.file((file) => {
								const reader = new plus.io.FileReader();
								reader.onloadend = (e) => resolve(e.target.result || '');
								reader.onerror = (err) => reject(err || new Error(
									'读文件失败'));
								reader.readAsText(file, 'utf-8');
							}, reject);
						}, reject);
						return;
					}
					// #endif
					uni.getFileSystemManager().readFile({
						filePath,
						encoding: 'utf-8',
						success: (res) => resolve(res.data || ''),
						fail: reject
					});
				});
			},
			pickCustomerTxtFile() {
				if (this.customerTxtBusy) return;
				this.keepBleFullWaveDisplay = false;
				const onPicked = async (path, name) => {
					try {
						this.customerTxtBusy = true;
						this.customerTxtInfo = '正在读取并解析...';
						const content = await this.readLocalTxtFile(path);
						const fileName = name || path.split(/[/\\]/).pop() || 'import.txt';
						await this.runCustomerTxtParseAndUpload(content, fileName, null);
					} catch (err) {
						this.addLog('TXT导入', err);
						this.customerTxtInfo = '导入失败: ' + ((err && err.message) || err);
						uni.showToast({
							title: '导入失败',
							icon: 'none'
						});
					} finally {
						this.customerTxtBusy = false;
					}
				};
				// #ifdef APP-PLUS
				if (typeof plus !== 'undefined' && plus.io && typeof plus.io.chooseFile === 'function') {
					plus.io.chooseFile({
						title: '选择 ECG TXT',
						filter: '.txt',
						multiple: false,
						success: (e) => {
							const files = e.files || [];
							if (!files.length) return;
							const f = files[0];
							const path = typeof f === 'string' ? f : (f.path || f);
							onPicked(path, (typeof f === 'object' && f.name) || '');
						},
						fail: (err) => {
							this.addLog('TXT导入', err || '取消选择');
						}
					});
					return;
				}
				// #endif
				if (typeof uni.chooseFile === 'function') {
					uni.chooseFile({
						count: 1,
						extension: ['.txt'],
						success: (res) => {
							const path = (res.tempFilePaths && res.tempFilePaths[0]) ||
								(res.tempFiles && res.tempFiles[0] && (res.tempFiles[0].path || res
									.tempFiles[
										0]
									.name));
							const name = (res.tempFiles && res.tempFiles[0] && res.tempFiles[0]
								.name) || '';
							if (path) onPicked(path, name);
						},
						fail: (err) => this.addLog('TXT导入', err || '取消选择')
					});
					return;
				}
				uni.showToast({
					title: '当前环境不支持选文件，请用内置解析',
					icon: 'none'
				});
			},
			async parseAndUploadBuiltinTxt() {
				if (this.customerTxtBusy) return;
				// 显示与「加载BLE全波形」同一套；上报仍走下方 INT16，勿改
				this.keepBleFullWaveDisplay = true;
				this.customerTxtBusy = true;
				this.customerTxtInfo = bleTestEcgNeedUvToMv ?
					'正在：ble-test-data(uV)→mV→原INT16上报...' :
					`正在：ble-test-data(已是幅值 ${bleTestEcgSeconds}s)→原INT16上报...`;
				try {
					if (!bleTestEcgData || !bleTestEcgData.length) {
						throw new Error('无 bleTestEcgData');
					}
					if (bleTestEcgNeedUvToMv) {
						await this.runCustomerTxtParseAndUpload(
							'',
							'250hz_40s.txt',
							bleTestEcgData, {
								displayMode: 'bleFull'
							}
						);
					} else {
						this.renderBleFullWaveFromPayload('内置250hz上报');
						await new Promise((resolve, reject) => {
							const raw = bleTestEcgData.filter(v => Number.isFinite(Number(v))).map(
								Number);
							const signal = raw.map(roundMv6);
							const p99Abs = customerPercentile(signal.map(Math.abs), 99);
							this.uploadCustomerTxtEcg({
								rawUv: raw.slice(),
								ecgData: signal.slice(),
								ecgDataFull: signal.slice(),
								samplingRate: bleTestEcgFs,
								unit: 'mV',
								unitWasUv: false,
								unitMode: 'mV_as_is',
								skipForceUvConvert: true,
								p99AbsRaw: p99Abs,
								rawPointCount: raw.length,
								fileName: `${bleTestEcgFs}hz_${bleTestEcgSeconds}s.txt`,
								raw_format: 'customer_ble_mock',
								trimInfo: {
									trim_applied: false,
									trim_start_sec: 0,
									trim_end_sec: 0
								}
							}).then(resolve).catch(reject);
						});
					}
				} catch (err) {
					this.addLog('TXT上报', err);
					this.customerTxtInfo = '解析上报失败: ' + ((err && err.message) || err);
					uni.showToast({
						title: '解析上报失败',
						icon: 'none'
					});
				} finally {
					this.customerTxtBusy = false;
				}
			},
			async runCustomerTxtParseAndUpload(txtContent, fileName, preParsedValues, options = {}) {
				const result = parseCustomerTxt(txtContent, fileName, preParsedValues);
				result.fileName = fileName || 'customer.txt';
				if (!result.ecgData || !result.ecgData.length) {
					throw new Error('未解析到 ECG 采样点');
				}
				const tip =
					`①原始uV ${result.rawPointCount}点 → ②入库mV ${result.ecgData.length}点(未裁剪,对齐PC), ` +
					`fs=${result.samplingRate}Hz, unit=${result.unitMode}, ` +
					`本地裁剪参考=${result.trimInfo.trim_applied ? `首${result.trimInfo.trim_start_sec.toFixed(1)}s/尾${result.trimInfo.trim_end_sec.toFixed(1)}s` : '无'}`;
				this.customerTxtInfo = tip;
				this.addLog('TXT解析', tip);
				this.addLog('TXT解析', {
					step1_rawUv_head: (result.rawUv || []).slice(0, 5),
					step2_storeMv_head: (result.ecgData || []).slice(0, 5),
					sampling_rate: result.samplingRate,
					unit: result.unit,
					trim_info_local: result.trimInfo
				});
				// 内置250hz：显示对齐「加载BLE全波形」；选文件走差分连续波预览
				if (options && options.displayMode === 'bleFull') {
					this.renderBleFullWaveFromPayload('内置250hz上报');
				} else {
					this.showCustomerMvWave(result.ecgDataDisplay || result.ecgData, result.samplingRate);
				}
				await this.uploadCustomerTxtEcg(result);
			},
			uploadCustomerTxtEcg(result) {
				return new Promise((resolve, reject) => {
					// ① 原始采样（优先 rawUv）
					// ② 客户 hex：skipForceUvConvert → clean 后 mV as-is（对齐 PC store_data）
					// ③ INT16 小端 2 字节/点，voltageRange=500
					const FORCE_VR = CUSTOMER_STORAGE_VOLTAGE_RANGE_MV;
					const fileName = (result && result.fileName) ||
						`upload_${CUSTOMER_UPLOAD_FS}hz.txt`;
					const rawSrc = (result && result.rawUv && result.rawUv.length) ?
						result.rawUv :
						((result && result.ecgDataFull && result.ecgDataFull.length) ?
							result.ecgDataFull :
							((result && result.ecgData) ? result.ecgData : []));
					let ensured;
					if (result && result.skipForceUvConvert) {
						const signalAsIs = ((result.ecgData && result.ecgData.length) ?
							result.ecgData :
							rawSrc).map(roundMv6);
						const p99Mv = signalAsIs.length ?
							customerPercentile(signalAsIs.map(Math.abs), 99) :
							0;
						ensured = {
							raw: rawSrc.slice ? rawSrc.slice() : [].concat(rawSrc),
							signal: signalAsIs,
							unitWasUv: false,
							unitMode: result.unitMode || 'mV_as_is',
							p99AbsRaw: result.p99AbsRaw != null ? result.p99AbsRaw : p99Mv,
							p99AbsMv: p99Mv
						};
					} else {
						ensured = ensureUploadMvSignal(rawSrc);
					}
					const signal = ensured.signal;
					if (!signal.length) {
						reject(new Error('无可上报 ECG 采样'));
						return;
					}
					// 仅旧 uV 路径校验转换后须 <20；as-is 幅值可大于 20
					if (!(result && result.skipForceUvConvert) && ensured.p99AbsMv > 20) {
						reject(new Error(
							`上报前仍非 mV(p99Abs=${ensured.p99AbsMv.toFixed(2)})，原始需 uV→mV`
						));
						return;
					}
					const fs = (result && result.samplingRate) ||
						inferFsFromFileName(fileName) || CUSTOMER_UPLOAD_FS;
					this.addLog('电压两步(原始→mV上报)', {
						step1_raw_head: (ensured.raw || []).slice(0, 5),
						step2_mv_head: signal.slice(0, 5).map((v) => +Number(v).toFixed(5)),
						unitMode: ensured.unitMode,
						unitWasUv: ensured.unitWasUv,
						p99AbsRaw: ensured.p99AbsRaw,
						p99AbsMv: ensured.p99AbsMv,
						points: signal.length,
						skipForceUvConvert: !!(result && result.skipForceUvConvert)
					});
					const packed = this.packInt16ECGFixed(signal, FORCE_VR);
					const view = new DataView(packed.buffer);
					const i0 = view.getInt16(0, true);
					const i1 = signal.length > 1 ? view.getInt16(2, true) : 0;
					if (!(result && result.skipForceUvConvert) && (Math.abs(i0) >= 30000 || Math.abs(i1) >=
							30000)) {
						reject(new Error(`量化疑似满幅饱和(head=${i0},${i1})，uV→mV 未生效`));
						return;
					}
					// rawData = 库显串（与 display_preview 同一规则，全量上传，非 hex）：
					// 0x00→空格；控制符/ASCII 原样；0x80-0xFE→?；普通 0xFF 跳过；ffff→??
					// 例：6a0061009effb2ff… → j a ??c …
					const rawHex = this.ab2hex(packed.buffer);
					const byteLen = packed.buffer.byteLength;
					const dataLength = signal.length;
					if (byteLen !== dataLength * 2 || rawHex.length !== dataLength * 4) {
						reject(new Error(
							`INT16打包长度异常: samples=${dataLength}, bytes=${byteLen}, hex=${rawHex.length}`
						));
						return;
					}
					const bytes = new Uint8Array(packed.buffer);
					let rawDisplay = '';
					for (let i = 0; i + 1 < bytes.length; i += 2) {
						const lo = bytes[i];
						const hi = bytes[i + 1];
						if (lo === 0xff && hi === 0xff) {
							rawDisplay += '??';
							continue;
						}
						for (let k = 0; k < 2; k++) {
							const n = bytes[i + k];
							if (n === 0) rawDisplay += ' ';
							else if (n === 0xff) continue;
							else if (n > 126) rawDisplay += '?';
							else rawDisplay += String.fromCharCode(n);
						}
					}
					// 日志用安全预览（控制符→·），实际上传仍是 rawDisplay 全量
					const display_preview = Array.from(rawDisplay.slice(0, 48)).map((ch) => {
						const c = ch.charCodeAt(0);
						if (c < 32) return '·';
						return ch;
					}).join('');
					this.fullDataCount = dataLength;
					const tag = (result && result.raw_format === 'customer_ble_raw') ? 'BLE上报' :
						((result && result.raw_format === 'customer_ble_mock') ? '模拟上报' : 'TXT上报');
					const ecgdata = {
						patientId: uni.getStorageSync('userid'),
						deviceSn: '11111111111',
						deviceModel: '客户测试ECG',
						samplingRate: fs,
						startTime: this.getTimeAllJSON().YMDHMS,
						dataFormat: 'INT16',
						voltageRange: FORCE_VR,
						rawData: rawHex,
						dataLength: dataLength,
						baseFeaturesExtracted: '',
						derivedFeaturesExtracted: '',
						qualityScore: '',
						modelScore: '',
						measurementTs: this.UTCdatatime().timestampSec,
						measurementTimezone: this.getTimeAllJSON().YMDHMS
					};
					console.log('ecgdata(upload-DISPLAY)', {
						upload_mode: 'DISPLAY_PREVIEW_FULL',
						patientId: ecgdata.patientId,
						samplingRate: ecgdata.samplingRate,
						dataLength: ecgdata.dataLength,
						rawData_len: rawDisplay.length,
						display_preview: display_preview,
						rawData_hex_head: rawHex.slice(0, 40),
						codes_head: Array.from(bytes.slice(0, 10)),
						step1_raw_head: (ensured.raw || []).slice(0, 5),
						step2_mv_head: signal.slice(0, 5),
						coded_head: [i0, i1],
						rawData: ecgdata.rawData
					});
					this.addLog('编码预览(DISPLAY)', {
						uploadMode: 'DISPLAY_PREVIEW_FULL',
						rawDataLen: rawDisplay.length,
						displayPreview: display_preview,
						hexHead: rawHex.slice(0, 40)
					});
					this.$post(this.$url_APP_IP + '/prod-api/device/ecgdata', ecgdata, {
						'Authorization': 'Bearer ' + uni.getStorageSync('token'),
						'content-type': 'application/json;charset=UTF-8'
					}).then((res) => {
						this.buffer = '';
						if (res.code === 200) {
							this.addLog(tag,
								`上传成功 DISPLAY len=${rawDisplay.length} 头 ${display_preview}`
							);
							this.customerTxtInfo =
								`上传成功 DISPLAY(${rawDisplay.length})→${display_preview}`;
							uni.showLoading({
								title: this.$t('正在云端计算中请稍后'),
								mask: true
							});
							this.ecgdatalist();
							resolve(res);
						} else {
							this.addLog(tag + '失败', res);
							reject(res);
						}
					}).catch((err) => {
						this.buffer = '';
						this.addLog(tag + '异常', err);
						reject(err);
					});
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
				this.keepBleFullWaveDisplay = false;
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
					// 恢复原 ecgFull；显示差分连续波，与「加载BLE全波形」一致（不上报）
					url: '/pages/tabBar/main/ecgFull',
					success: (res) => {
						const mvArr = this.unpackInt16ECG(
							this.toArrayBuffer(rawData),
							voltageRange || 500
						);
						const displayArr = customerMvToDisplayWave(mvArr);
						const payload = (displayArr && displayArr.length) ? displayArr : mvArr;
						res.eventChannel.emit('sendData', payload);
						res.eventChannel.emit('startTime', startTime);
						res.eventChannel.emit('createTime', createTime);
						uni.setStorageSync('sendData', payload);
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
				// 缓存原始 # 采样（非 TXT）：对齐 PC 客户 hex（已是 mV）
				if (!this.bleRawEcgValues) this.bleRawEcgValues = [];
				const rawMax = BLE_MEASURE_SECONDS * CUSTOMER_TXT_DEFAULT_FS;
				if (this.bleRawEcgValues.length < rawMax) {
					this.bleRawEcgValues.push(val);
				}
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
				// 每对原始点只解出 1 个显示值，再 hold 成 2 点，保持 250Hz 时间轴（封顶 10000，不造 20000）
				const held = [];
				for (let i = 0; i < samples.length; i++) {
					held.push(samples[i], samples[i]);
				}
				const remain = BLE_MEASURE_MAX_POINTS - this.dataCount;
				const toPush = held.length > remain ? held.slice(0, remain) : held;
				if (!toPush.length) return;
				wave.pushData(toPush);
				this.dataCount += toPush.length;
				this.fullDataCount = wave.getFullDataCount ? wave.getFullDataCount() : this.dataCount;
				this.queueLength = wave.getQueueLength ? wave.getQueueLength() : 0;
				if (this.dataCount === 1 || this.dataCount % 50 === 0) {
					this.addLog('波形',
						`已接收显示${this.dataCount}点/原始${this.bleRawEcgValues.length}点, 最近原始=${val}, 显示=${toPush[0].toFixed(3)}`
					);
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
					const rate = (typeof wave.getsampleRate === 'function' ? wave.getsampleRate() : wave
							.sampleRate) ||
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
				const src = arr || [];
				const n = src.length;
				const ab = new ArrayBuffer(n * 2);
				const view = new DataView(ab);
				if (!n) {
					return {
						buffer: ab,
						voltageRange: 500
					};
				}
				let maxAbs = 0;
				for (let i = 0; i < n; i++) {
					const a = Math.abs(Number(src[i]));
					if (Number.isFinite(a) && a > maxAbs) maxAbs = a;
				}
				// 客户 mV（常见 <20）固定 500；否则动态量程
				const voltageRange = (maxAbs > 0 && maxAbs <= 20) ?
					500 :
					Math.max(maxAbs * 1.2, 1);
				const scale = 32767 / voltageRange;
				for (let i = 0; i < n; i++) {
					const raw = Number(src[i]);
					const v = Number.isFinite(raw) ?
						Math.max(-voltageRange, Math.min(voltageRange, raw)) :
						0;
					// 对齐 numpy (x*scale).astype(np.int16)：向零截断，不用 Math.round
					let iv = Math.trunc(v * scale);
					if (iv > 32767) iv = 32767;
					if (iv < -32768) iv = -32768;
					view.setInt16(i * 2, iv, true);
				}
				return {
					buffer: ab,
					voltageRange
				};
			},
			/**
			 * 对齐 ecg_main.store_data 量化：
			 * scale=32767/vr; clip; (v*scale).astype(np.int16) → 向零截断；小端 struct.pack（2字节/点）
			 */
			packInt16ECGFixed(arr, voltageRange = CUSTOMER_STORAGE_VOLTAGE_RANGE_MV) {
				const n = (arr || []).length;
				const ab = new ArrayBuffer(n * 2);
				const view = new DataView(ab);
				const vr = Math.max(1, Number(voltageRange) || 500);
				const scale = 32767 / vr;
				for (let i = 0; i < n; i++) {
					const raw = Number(arr[i]);
					const v = Number.isFinite(raw) ? Math.max(-vr, Math.min(vr, raw)) : 0;
					let iv = Math.trunc(v * scale);
					if (iv > 32767) iv = 32767;
					if (iv < -32768) iv = -32768;
					view.setInt16(i * 2, iv, true);
				}
				return {
					buffer: ab,
					voltageRange: vr
				};
			},
			/** 逆变换：int16 / (32767/vr) → mV */
			unpackInt16ECG(ab, voltageRange = 500) {
				if (!ab || !(ab instanceof ArrayBuffer)) return [];
				const n = ab.byteLength / 2;
				const view = new DataView(ab);
				const arr = new Array(n);
				const vr = Math.max(1, Number(voltageRange) || 500);
				const scale = 32767 / vr;
				for (let i = 0; i < n; i++) {
					arr[i] = parseFloat((view.getInt16(i * 2, true) / scale).toFixed(6));
				}
				return arr;
			},
			/** 兼容历史 1 字节/点记录解包：INT8 量程为 ±127，不是 ±32767 */
			unpackInt8ECG(ab, voltageRange = 500) {
				if (!ab || !(ab instanceof ArrayBuffer)) return [];
				const n = ab.byteLength;
				const view = new DataView(ab);
				const arr = new Array(n);
				const vr = Math.max(1, Number(voltageRange) || 500);
				const scale = 127 / vr;
				for (let i = 0; i < n; i++) {
					arr[i] = parseFloat((view.getInt8(i) / scale).toFixed(6));
				}
				return arr;
			},
			/** 按 dataFormat / 字节长度自动解包：优先 INT16 2字节；兼容旧 1字节/点 */
			unpackEcgRaw(ab, voltageRange = 500, dataFormat, dataLength) {
				const fmt = String(dataFormat || '').toUpperCase();
				const bytes = (ab && ab.byteLength) || 0;
				const n = Number(dataLength) || 0;
				// 奇数长度只能是 INT8
				if (bytes > 0 && bytes % 2 !== 0) {
					return this.unpackInt8ECG(ab, voltageRange);
				}
				// 显式 INT16 / 未标注：按 2 字节/点（勿把 rawByteLength 误当 dataLength→INT8→点数翻倍成 80s）
				if (fmt === 'INT16' || !fmt) {
					return this.unpackInt16ECG(ab, voltageRange);
				}
				// 显式 INT8，或点数==字节数的历史 1 字节/点
				if (fmt === 'INT8' || (n > 0 && bytes === n)) {
					return this.unpackInt8ECG(ab, voltageRange);
				}
				return this.unpackInt16ECG(ab, voltageRange);
			},
			saveFinalData(data) {
				const wave = this.getWaveRef();
				if (!wave) return;
				// 模拟上报已走 uploadMockBleCustomerEcg，禁止再用显示缓冲二次上报
				if (this.keepBleFullWaveDisplay || this.isMockTesting) {
					this.addLog('上传', '已跳过：模拟/BLE全波形模式不走 saveFinalData');
					return;
				}
				const raw = this.bleRawEcgValues;
				// 实时仅多一步 hex/# 解析；拿到 mV 后与「开始模拟」同一套 uploadAlreadyMvCustomerEcg
				if (raw && raw.length) {
					const fs = CUSTOMER_TXT_DEFAULT_FS || CUSTOMER_UPLOAD_FS || 250;
					const sec = Math.max(1, Math.round(raw.length / fs)) || BLE_MEASURE_SECONDS;
					this.uploadAlreadyMvCustomerEcg(raw.slice(), {
						raw_format: 'customer_ble_raw',
						logTag: 'BLE解析上报',
						errTag: 'BLE上报异常',
						fs,
						seconds: sec,
						fileName: `${fs}hz_${sec}s.txt`
					});
					return;
				}
				// 无原始缓存时禁止用差分显示缓冲上报（会与 PC/模拟不一致）
				this.addLog('上传', '无 bleRawEcgValues，跳过（避免把显示差分波形当上报）');
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
						if (wave && !this.keepBleFullWaveDisplay) {
							// 只用采样点数 dataLength，禁止 fallback rawByteLength（20000字节误判成 20000 点≈80s）
							const unpacked = this.unpackEcgRaw(
								this.toArrayBuffer(latestRow.rawData),
								latestRow.voltageRange || 500,
								latestRow.dataFormat || 'INT16',
								latestRow.dataLength
							);
							// 云端存的是 PC 流程 mV；本页显示再差分成连续波（与「加载BLE全波形」一致）
							const newData = customerMvToDisplayWave(unpacked);
							const displayFs = latestRow.samplingRate || CUSTOMER_TXT_DEFAULT_FS || 250;
							this.addLog('极性',
								`云端显示差分波形 ${newData.length} 点 / ${(newData.length / displayFs).toFixed(1)}s @${displayFs}Hz（原 ${unpacked.length} 点）`
							);
							const vr = Math.max(50, Number(latestRow.voltageRange) || 50);
							if (typeof wave.setSampleRate === 'function') {
								wave.setSampleRate(displayFs);
							} else {
								wave.sampleRate = displayFs;
							}
							wave.generateApiData(newData, vr);
							this.showBleProcessedFullWave(wave);
						} else if (this.keepBleFullWaveDisplay) {
							this.addLog('云端', '已保留 BLE 全波形显示，仅更新评分/列表');
						}
						this.baseFeaturesExtracted = latestRow.baseFeaturesExtracted === 1 ?
							this.$t('完成') : this.$t('未完成');
						this.derivedFeaturesExtracted = latestRow.derivedFeaturesExtracted === 1 ?
							this.$t('完成') : this.$t('未完成');
						this.qualityScore = latestRow.baseFeaturesExtracted === 1 ?
							latestRow.qualityScore : this.$t('云端数据计算中');
						this.modelScore = latestRow.baseFeaturesExtracted === 1 ?
							(latestRow.modelScore == null ? this.$t('ECG房颤数据质量偏低提示') : latestRow
								.modelScore) :
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
				this.bleRawEcgValues = [];
				this.clearBleMeasureTimer();
				this.resetBleStreamState();
			},
			/**
			 * rawData → ArrayBuffer。
			 * 兼容：1) hex  2) base64  3) INT16 小端二进制字符串（PC/库展示）
			 */
			toArrayBuffer(data) {
				if (!data) return new ArrayBuffer(0);
				if (data instanceof ArrayBuffer) return data;
				const s = String(data);
				// 纯 hex（偶数长度）
				if (/^[0-9a-fA-F]+$/.test(s) && (s.length % 2) === 0 && s.length >= 4) {
					const buffer = new ArrayBuffer(s.length / 2);
					const dataView = new DataView(buffer);
					for (let i = 0; i < s.length; i += 2) {
						dataView.setUint8(i / 2, parseInt(s.substr(i, 2), 16));
					}
					return buffer;
				}
				// base64（含 +/ 或尾部 =）
				if (/^[A-Za-z0-9+/]+=*$/.test(s) && s.length >= 8 && (s.length % 4) === 0) {
					try {
						if (typeof uni !== 'undefined' && typeof uni.base64ToArrayBuffer === 'function') {
							return uni.base64ToArrayBuffer(s);
						}
					} catch (e) {
						/* fallthrough */
					}
				}
				// 二进制字符串：每个 char → 1 byte
				const n = s.length;
				const buffer = new ArrayBuffer(n);
				const view = new Uint8Array(buffer);
				for (let i = 0; i < n; i++) {
					view[i] = s.charCodeAt(i) & 0xff;
				}
				return buffer;
			},
			ab2hex(buffer) {
				return Array.prototype.map.call(
					new Uint8Array(buffer),
					bit => ('00' + bit.toString(16)).slice(-2)
				).join('');
			},
			/** ArrayBuffer → Base64（JSON 安全传 INT16 字节） */
			ab2base64(buffer) {
				if (typeof uni !== 'undefined' && typeof uni.arrayBufferToBase64 === 'function') {
					return uni.arrayBufferToBase64(buffer || new ArrayBuffer(0));
				}
				const bytes = new Uint8Array(buffer || new ArrayBuffer(0));
				let bin = '';
				const chunk = 0x8000;
				for (let i = 0; i < bytes.length; i += chunk) {
					bin += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunk, bytes.length)));
				}
				if (typeof btoa === 'function') return btoa(bin);
				return bin;
			},
			/** ArrayBuffer → 二进制字符串（库里显示为 j/a/?? 那种） */
			ab2binStr(buffer) {
				const bytes = new Uint8Array(buffer || new ArrayBuffer(0));
				const chunk = 0x8000;
				if (bytes.length <= chunk) {
					return String.fromCharCode.apply(null, bytes);
				}
				let out = '';
				for (let i = 0; i < bytes.length; i += chunk) {
					const sub = bytes.subarray(i, Math.min(i + chunk, bytes.length));
					out += String.fromCharCode.apply(null, sub);
				}
				return out;
			},
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

	.txt-import-section {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #e8e8e8;
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