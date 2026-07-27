// protocol/u16pro-constants.js
export const BLE_UUID = {
	SERVICE: '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E',
	WRITE: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
	NOTIFY: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'
}

export const CMD = {
	SET_TIME: 0x01, //4.1 设置手环时间/语言
	READ_BATTERY: 0x03, //4.2 读取设备电量
	READ_DAILY_INFO: 0x07, //4.3 读取某天运动/睡眠信息
	READ_SETTINGS: 0x0A, //4.4 设置时间格式/公英制/用户参数
	READ_BP_HISTORY: 0x14, //4.5 读取血压测量数据
	READ_HR_HISTORY: 0x15, //4.6 读取自动心率测量数据
	TOGGLE_HR_AUTO: 0x16, //4.7 开关自动心率测量功能
	SET_SCREEN_OFF: 0x1F, //4.8 设置手环自动息屏时间
	SET_GOALS: 0x21, //4.9 设置目标参数
	TOGGLE_SPO2_AUTO: 0x2C, //4.10 开关自动血氧测量功能
	READ_SPO2_HISTORY: 0x2D, //4.11 读取自动血氧测量数据
	BP_MEASUREMENT: 0x32, //4.12 手机发起血压测量
	SpO2_MEASUREMENT: 0x39, //4.12 手机发起血氧测量
	HR_MEASUREMENT: 0x38, //4.12 手机发起心率测量
	BP_SUCCES: 0x33, //4.13 手环完成血压测量
	READ_PULSE_DIAGNOSIS: 0x34, // 4.14 读取脉诊测量数据
	SET_BP_DYNAMIC_PARAMS: 0x35, // 4.16 APP设置血压动态测量参数
	READ_BP_DYNAMIC_PARAMS: 0x36, // 4.17 APP读取血压动态测量参数
	BP_DYNAMIC_PARAMS_CHANGED: 0x37, // 4.18 手环血压动态测量参数主动变更（通知）
	FIND_DEVICE: 0x50, //4.15 查找手环
	DATA_CHANGED: 0x73, //4.16 手环通知 app 有新的数据改变
	FACTORY_RESET: 0xFF, //4.17 恢复出厂设置命令
	RESTART: 0x08, //4.4重启手环

	// PPG测量（0xBC自定义蓝牙服务）
	PPG_START_WITH_DURATION: 0x49, // 开启PPG测量(带时长)
	PPG_START: 0x4A, // 开启PPG测量
	PPG_STOP: 0x4B, // 停止PPG测量
	PPG_GET_SIZE: 0x4C, // 请求PPG数据大小
	PPG_GET_DATA: 0x4D, // 请求PPG数据
	PPG_MEASUREMENT_COMPLETE: 0x58, // PPG测量完成通知
}

export const BC_BLE_UUID = {
	SERVICE: 'DE5BF728-D711-4E47-AF26-65E3012A5DC7',
	NOTIFY: 'DE5BF729-D711-4E47-AF26-65E3012A5DC7',
	WRITE: 'DE5BF72A-D711-4E47-AF26-65E3012A5DC7'
}

export const BC_PACKET = {
	HEADER: 0xBC,
	EMPTY_DATA_CRC: 0xFFFF,
	SUCCESS_DATA: 0x01,
	FAIL_DATA: 0x00,
	PPG_STATUS_BUSY: 0x02, // 设备侧已开始/进行中（串口实测）
	PPG_DURATION_MIN: 10,
	PPG_DURATION_MAX: 60,
	PPG_CHUNK_SIZE: 128,
	PPG_READ_INTERVAL_MS: 120,
	BC_NOTIFY_STALE_MS: 20000,
}

export const DATA_TYPE = {
	HEART_RATE: 0x01, //心率
	BLOOD_PRESSURE: 0x02, //血压
	BLOOD_OXYGEN: 0x03, //血氧
	STEPS: 0x04, //计步
	TEMPERATURE: 0x05, //脉诊
	SLEEP: 0x06, //睡眠(暂未使用)
	SPORT: 0x07, //运动记录
	ALARM: 0x08, //闹钟(暂未使用)
	DISTURB: 0x09, //勿扰设置
	RECORD: 0x0A, //RRI 数据更新(心血管糖尿病健康预警数据)
	TIME_FORMAT: 0x0B, //12/24 小时制(暂未使用)
	BATTERY: 0x0C //电量变化
}