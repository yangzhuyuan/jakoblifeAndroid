/**
 * 将 SDK 文档方法名映射到当前 bluetooth-ycSdkPlugin 实际导出方法。
 * res.code: 0 成功，1 失败。
 *
 * 文档有、插件无、且无法安全转发的方法会回传 code=1 + message。
 */

function unsupported(name) {
	return function(...args) {
		const callback = args.find((a) => typeof a === 'function');
		const res = {
			code: 1,
			message: name + ' not supported by current bluetooth-ycSdkPlugin',
			data: null
		};
		console.warn(res.message);
		if (typeof callback === 'function') callback(res);
		return res;
	};
}

function hasOwnData(res) {
	return res && Object.prototype.hasOwnProperty.call(res, 'data');
}

/**
 * @param {object} ble requireNativePlugin 结果
 * @returns {object} 带文档别名的 ble
 */
export function patchYcBleAliases(ble) {
	if (!ble) return ble;

	const aliases = {};

	// —— 7 ECG ——
	if (typeof ble.startECGMeasurement === 'function') {
		aliases.appEcgTestStart = function(callback) {
			return ble.startECGMeasurement(callback);
		};
	}
	if (typeof ble.stopECGMeasurement === 'function') {
		aliases.appEcgTestEnd = function(callback) {
			return ble.stopECGMeasurement(callback);
		};
	}
	if (typeof ble.getECGResult === 'function') {
		aliases.getAIDiagnosisResult = function(callback) {
			return ble.getECGResult(0, callback);
		};
	}
	if (typeof ble.queryCollectDataBasicInfo === 'function') {
		aliases.collectEcgList = function(callback) {
			const out = {
				ecg: null,
				ppg: null
			};
			let left = 2;
			const finish = () => {
				left -= 1;
				if (left > 0) return;
				if (typeof callback === 'function') {
					callback({
						code: 0,
						data: out
					});
				}
			};
			ble.queryCollectDataBasicInfo(0, (res) => {
				out.ecg = hasOwnData(res) ? res.data : res;
				finish();
			});
			ble.queryCollectDataBasicInfo(1, (res) => {
				out.ppg = hasOwnData(res) ? res.data : res;
				finish();
			});
		};
	}
	if (typeof ble.queryCollectDataInfo === 'function') {
		aliases.collectEcgDataWithIndex = function(indexes, callback) {
			let args = indexes;
			if (Array.isArray(indexes) && indexes.length === 1) {
				args = [0x00, indexes[0]];
			}
			return ble.queryCollectDataInfo(args, callback);
		};
	}
	if (typeof ble.deleteCollectData === 'function') {
		// 7.5 文档名 deleteHistoryListData([type, index])
		aliases.deleteHistoryListData = function(args, callback) {
			return ble.deleteCollectData(args, callback);
		};
	}

	// —— 10.4 血压测量：文档/demo 的 appStartBloodMeasurement([state]) ——
	if (typeof ble.appControlMeasureHealthData === 'function') {
		aliases.appStartBloodMeasurement = function(stateOrArr, callback) {
			let state = 1;
			if (Array.isArray(stateOrArr)) {
				state = stateOrArr[0];
			} else if (typeof stateOrArr === 'number' || typeof stateOrArr === 'boolean') {
				state = stateOrArr ? 1 : 0;
			} else if (typeof stateOrArr === 'function') {
				callback = stateOrArr;
			}
			// dataType=1 血压（MeasureHealthDataType.bloodPressure）
			return ble.appControlMeasureHealthData([state, 1], callback);
		};
	}

	// —— 7.1 穿戴位置（文档 settingHandWear 无参；实际需 position）——
	if (typeof ble.setDeviceWearingPosition === 'function') {
		aliases.settingHandWear = function(positionOrCb, maybeCb) {
			if (typeof positionOrCb === 'function') {
				return ble.setDeviceWearingPosition(0, positionOrCb);
			}
			return ble.setDeviceWearingPosition(positionOrCb, maybeCb);
		};
	}

	// —— 1.6 回连：文档无参，插件需要 boolean ——
	if (typeof ble.setReconnectEnabled === 'function') {
		aliases.setReconnectEnabled = function(enabledOrCb, maybeCb) {
			if (typeof enabledOrCb === 'function') {
				return ble.setReconnectEnabled(true, enabledOrCb);
			}
			return ble.setReconnectEnabled(!!enabledOrCb, maybeCb);
		};
	}

	// —— 6.3 实时上传：文档 realTimeDataUpload(true, cb)；插件要数组 ——
	if (typeof ble.realTimeDataUpload === 'function') {
		aliases.realTimeDataUpload = function(stateOrArr, maybeCb) {
			if (typeof stateOrArr === 'boolean' || typeof stateOrArr === 'number') {
				return ble.realTimeDataUpload([stateOrArr, 0], maybeCb);
			}
			return ble.realTimeDataUpload(stateOrArr, maybeCb);
		};
	}

	// —— 4.5 自定义表盘文档名 ——
	if (typeof ble.installCustomWatchFace === 'function') {
		aliases.downloadCustomDial = function(args, callback) {
			if (typeof args === 'function') {
				return ble.installCustomWatchFace([], args);
			}
			return ble.installCustomWatchFace(args, callback);
		};
	}
	if (typeof ble.installJieLiCustomWatchFace === 'function') {
		aliases.downloadCustomJieLiDial = function(args, callback) {
			if (typeof args === 'function') {
				return ble.installJieLiCustomWatchFace(['', '', '', '', ''], args);
			}
			return ble.installJieLiCustomWatchFace(args, callback);
		};
	}

	// —— 文档有、当前 AAR 无原生实现 ——
	const missing = [
		'clearQueue',
		'setupBlutetoothState', // 文档拼写
		'setupBluetoothState',
		'deviceToApp',
		'appPushContacts',
		'appNewPushContacts',
		'setupDeviceControlObserver'
	];
	missing.forEach((name) => {
		if (typeof ble[name] !== 'function') {
			aliases[name] = unsupported(name);
		}
	});

	try {
		Object.keys(aliases).forEach((name) => {
			if (aliases[name] && typeof ble[name] !== 'function') {
				ble[name] = aliases[name];
			} else if (aliases[name] && (name === 'setReconnectEnabled' || name === 'realTimeDataUpload')) {
				// 覆盖签名兼容包装
				ble[name] = aliases[name];
			}
		});
		if (typeof ble.appEcgTestStart === 'function' && typeof ble.getAIDiagnosisResult === 'function') {
			return ble;
		}
	} catch (e) {
		console.log('patchYcBleAliases assign failed', e);
	}

	return new Proxy(ble, {
		get(target, prop) {
			if (aliases[prop]) return aliases[prop];
			const value = target[prop];
			return typeof value === 'function' ? value.bind(target) : value;
		}
	});
}

/** 统一获取已打补丁的 YC 蓝牙插件 */
export function requireYcBle() {
	const platform = uni.getSystemInfoSync().platform;
	const raw = platform === 'ios'
		? uni.requireNativePlugin('DCTestUniPlugin')
		: uni.requireNativePlugin('bluetooth-ycSdkPlugin');
	return patchYcBleAliases(raw);
}
