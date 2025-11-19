// 模拟ECG数据生成器 - 增强版，支持房颤数据
export function ecgGen(type = 'normal') {
	if (type === 'afib') {
		return generateAfibData();
	} else if (type === 'tachycardia') {
		return generateTachycardiaData();
	} else if (type === 'bradycardia') {
		return generateBradycardiaData();
	} else {
		return generateNormalData();
	}
}

// 正常心律
function* generateNormalData() {
	let phase = 0;
	let noisePhase = 0;
	let heartbeatPhase = 0;
	let lastValue = 2048;

	while (true) {
		phase += 0.1;

		let heartbeat = 0;
		heartbeatPhase += 0.3; // 正常心率约60-100bpm

		if (heartbeatPhase < Math.PI * 2) {
			// P波
			if (heartbeatPhase < 0.5) {
				heartbeat = Math.sin(heartbeatPhase * 6) * 50;
			}
			// QRS复合波
			else if (heartbeatPhase < 1.5) {
				heartbeat = Math.sin(heartbeatPhase * 10) * 300;
			}
			// T波
			else if (heartbeatPhase < 2.5) {
				heartbeat = Math.sin(heartbeatPhase * 4) * 100;
			}
		} else {
			heartbeatPhase = 0;
		}

		const breathing = Math.sin(phase * 0.05) * 20;
		noisePhase += 0.5;
		const noise = (Math.random() - 0.5) * 40 +
			Math.sin(noisePhase) * 10 +
			Math.sin(noisePhase * 2.3) * 5;

		let value = 2048 + heartbeat + breathing + noise;
		value = lastValue * 0.1 + value * 0.9;
		lastValue = value;

		yield Math.round(value);
	}
}

// 房颤数据
function* generateAfibData() {
	let phase = 0;
	let noisePhase = 0;
	let lastValue = 2048;
	let nextBeatTime = 0;
	let beatVariability = 0;
	let afWavePhase = 0;

	while (true) {
		phase += 0.1;

		let heartbeat = 0;

		// 房颤特征：不规则的f波（心房颤动波）
		afWavePhase += 0.8; // 快速的心房活动 350-600bpm
		const afWave = Math.sin(afWavePhase * 8) * 30 +
			Math.sin(afWavePhase * 12 + 1) * 20 +
			Math.sin(afWavePhase * 16 + 2) * 10;

		// 不规则的心室反应
		if (phase >= nextBeatTime) {
			// 房颤的QRS波 - 形态正常但节律不规则
			const qrsDuration = 0.3 + Math.random() * 0.2;
			const qrsPhase = (phase - nextBeatTime) / qrsDuration;

			if (qrsPhase < 1) {
				// 快速上升和下降模拟QRS波
				heartbeat = Math.sin(qrsPhase * Math.PI) * 400;
				// 添加一些变异使QRS更真实
				heartbeat += Math.sin(qrsPhase * Math.PI * 3) * 50;
			}

			// 设置下一次心跳时间 - 高度不规则
			beatVariability = 0.5 + Math.random() * 1.0; // 很大的变异性
			nextBeatTime = phase + beatVariability;
		}

		const breathing = Math.sin(phase * 0.03) * 15;
		noisePhase += 0.5;
		const noise = (Math.random() - 0.5) * 60 +
			Math.sin(noisePhase) * 15 +
			Math.sin(noisePhase * 2.3) * 8;

		// 组合信号：基础线 + f波 + QRS波 + 呼吸 + 噪声
		let value = 2048 + afWave + heartbeat + breathing + noise;
		value = lastValue * 0.05 + value * 0.95; // 更少的平滑以显示f波
		lastValue = value;

		yield Math.round(value);
	}
}

// 心动过速
function* generateTachycardiaData() {
	let phase = 0;
	let noisePhase = 0;
	let heartbeatPhase = 0;
	let lastValue = 2048;

	while (true) {
		phase += 0.1;

		let heartbeat = 0;
		heartbeatPhase += 0.5; // 快速心率 >100bpm

		if (heartbeatPhase < Math.PI * 2) {
			if (heartbeatPhase < 0.4) {
				heartbeat = Math.sin(heartbeatPhase * 7) * 40;
			} else if (heartbeatPhase < 1.2) {
				heartbeat = Math.sin(heartbeatPhase * 12) * 350;
			} else if (heartbeatPhase < 2.0) {
				heartbeat = Math.sin(heartbeatPhase * 5) * 80;
			}
		} else {
			heartbeatPhase = 0;
		}

		const breathing = Math.sin(phase * 0.08) * 25;
		noisePhase += 0.5;
		const noise = (Math.random() - 0.5) * 35;

		let value = 2048 + heartbeat + breathing + noise;
		value = lastValue * 0.1 + value * 0.9;
		lastValue = value;

		yield Math.round(value);
	}
}

// 心动过缓
function* generateBradycardiaData() {
	let phase = 0;
	let noisePhase = 0;
	let heartbeatPhase = 0;
	let lastValue = 2048;

	while (true) {
		phase += 0.1;

		let heartbeat = 0;
		heartbeatPhase += 0.2; // 慢心率 <60bpm

		if (heartbeatPhase < Math.PI * 2) {
			if (heartbeatPhase < 0.6) {
				heartbeat = Math.sin(heartbeatPhase * 5) * 60;
			} else if (heartbeatPhase < 1.8) {
				heartbeat = Math.sin(heartbeatPhase * 8) * 280;
			} else if (heartbeatPhase < 3.0) {
				heartbeat = Math.sin(heartbeatPhase * 3) * 120;
			}
		} else {
			heartbeatPhase = 0;
		}

		const breathing = Math.sin(phase * 0.03) * 10;
		noisePhase += 0.5;
		const noise = (Math.random() - 0.5) * 25;

		let value = 2048 + heartbeat + breathing + noise;
		value = lastValue * 0.1 + value * 0.9;
		lastValue = value;

		yield Math.round(value);
	}
}

// 早搏数据
function* generatePrematureBeatData() {
	let phase = 0;
	let noisePhase = 0;
	let heartbeatPhase = 0;
	let lastValue = 2048;
	let beatCount = 0;

	while (true) {
		phase += 0.1;

		let heartbeat = 0;
		heartbeatPhase += 0.3;

		// 每5-8次心跳出现一次早搏
		if (beatCount > 4 + Math.random() * 3) {
			// 早搏：提前的心跳，形态异常
			const prematurePhase = heartbeatPhase * 1.5; // 更快的相位
			if (prematurePhase < Math.PI * 2) {
				if (prematurePhase < 0.3) {
					// 异常的P波或缺如
					heartbeat = Math.sin(prematurePhase * 8) * 20;
				} else if (prematurePhase < 1.0) {
					// 宽大畸形的QRS波
					heartbeat = Math.sin(prematurePhase * 6) * 450;
					heartbeat += Math.sin(prematurePhase * 18) * 80;
				} else if (prematurePhase < 1.8) {
					// 异常的T波
					heartbeat = Math.sin(prematurePhase * 4) * 150;
				}
			}
			beatCount = 0;
			heartbeatPhase = -0.5; // 重置相位，制造代偿间隙
		} else if (heartbeatPhase < Math.PI * 2) {
			// 正常心跳
			if (heartbeatPhase < 0.5) {
				heartbeat = Math.sin(heartbeatPhase * 6) * 50;
			} else if (heartbeatPhase < 1.5) {
				heartbeat = Math.sin(heartbeatPhase * 10) * 300;
			} else if (heartbeatPhase < 2.5) {
				heartbeat = Math.sin(heartbeatPhase * 4) * 100;
			}
		} else {
			heartbeatPhase = 0;
			beatCount++;
		}

		const breathing = Math.sin(phase * 0.05) * 20;
		noisePhase += 0.5;
		const noise = (Math.random() - 0.5) * 40;

		let value = 2048 + heartbeat + breathing + noise;
		value = lastValue * 0.1 + value * 0.9;
		lastValue = value;

		yield Math.round(value);
	}
}

// 生成测试数据
export function generateTestData(type = 'normal', length = 1000) {
	const generator = ecgGen(type);
	const data = [];
	for (let i = 0; i < length; i++) {
		data.push(generator.next().value);
	}
	return data;
}

// 心律类型描述
export const rhythmTypes = {
	normal: {
		name: '正常心律',
		description: '规律窦性心律，心率60-100bpm'
	},
	afib: {
		name: '心房颤动',
		description: '心律绝对不齐，无P波，可见f波'
	},
	tachycardia: {
		name: '窦性心动过速',
		description: '规律心律，心率>100bpm'
	},
	bradycardia: {
		name: '窦性心动过缓',
		description: '规律心律，心率<60bpm'
	},
	premature: {
		name: '室性早搏',
		description: '正常心律中穿插宽大畸形QRS波'
	}
};