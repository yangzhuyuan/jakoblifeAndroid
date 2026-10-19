/**
 * YC UniApp SDK 文档常量
 * 注意：HealthDataType（历史查询）与 MeasureHealthDataType（一键测量）编号不同
 */

/** 3.1 queryDeviceHealthData / deleteDeviceHealthData */
export const HealthDataType = {
	step: 0,
	sleep: 1,
	heartRate: 2,
	bloodPressure: 3,
	combinedData: 4,
	invasiveComprehensiveData: 5,
	sportHistoryData: 6,
	bodyIndexData: 7
};

/** 9.28 / 9.29 采集数据类型 */
export const CollectDataType = {
	ecg: 0x00,
	ppg: 0x01,
	acc3: 0x02,
	sixAxis: 0x03,
	nineAxis: 0x04,
	magnetometer: 0x05,
	inflatableBp: 0x06
};

/** 10.4 一键测量 state */
export const MeasureState = {
	off: 0,
	single: 1,
	monitor: 2
};

/** 10.4 appControlMeasureHealthData dataType */
export const MeasureHealthDataType = {
	heartRate: 0,
	bloodPressure: 1,
	bloodOxygen: 2,
	respirationRate: 3,
	bodyTemperature: 4,
	bloodGlucose: 5,
	uricAcid: 6,
	bloodKetone: 7,
	eda: 8,
	bloodFat: 9,
	hrv: 10,
	ppg: 11,
	pressure: 12
};

/** 8.1 / 13 运动状态 */
export const DeviceSportState = {
	stop: 0,
	start: 1,
	pause: 2,
	continueSport: 3
};

/** 8.1 / 13 运动类型 */
export const DeviceSportType = {
	none: 0,
	run: 0x01,
	swimming: 0x02,
	riding: 0x03,
	fitness: 0x04,
	ropeskipping: 0x06,
	playball: 0x07,
	walk: 0x08,
	badminton: 0x09,
	football: 0x0A,
	mountaineering: 0x0B,
	pingPang: 0x0C,
	freeMode: 0x0D,
	indoorRunning: 0x0E,
	outdoorRunning: 0x0F,
	outdoorWalking: 0x10,
	indoorWalking: 0x11,
	runMode: 0x12,
	indoorRiding: 0x13,
	stepper: 0x14,
	rowingMachine: 0x15,
	realTimeMonitoring: 0x16,
	situps: 0x17,
	jumping: 0x18,
	weightTraining: 0x19,
	yoga: 0x1A,
	onfoot: 0x1B,
	volleyball: 0x1C,
	kayak: 0x1D,
	rollerSkating: 0x1E,
	tennis: 0x1F,
	golf: 0x20,
	ellipticalMachine: 0x21,
	dance: 0x22,
	rockClimbing: 0x23,
	aerobics: 0x24,
	otherSports: 0x25
};
