// BluetoothService.js
export default class BluetoothService {
	constructor(deviceId) {
		this.deviceId = deviceId;
		this.connected = false;
		this.services = [];
		this.characteristics = {};
	}


	// 初始化蓝牙适配器
	async initBluetooth() {
		return new Promise((resolve, reject) => {
			uni.openBluetoothAdapter({
				success: () => {
					console.log("蓝牙适配器初始化成功");
					resolve();
				},
				fail: (err) => {
					console.error("蓝牙适配器初始化失败", err);
					reject(err);
				},
			});
		});
	}

	// 连接设备
	async connect() {
		let that = this
		return new Promise((resolve, reject) => {
			uni.createBLEConnection({
				deviceId: that.deviceId,
				success: (res) => {
					console.log("连接成功", that.deviceId);
					that.connected = true;
					resolve(res)
				},
				fail: (err) => {
					if (err.errCode === -1) {
						that.connected = true; // 已连接
						resolve("设备已连接");
					} else {
						reject(err);
					}
				},
			});
		});
	}

	// 获取设备服务
	async getServices() {
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceServices({
				deviceId: this.deviceId,
				success: (res) => {
					// console.log("获取服务成功", res.services);
					this.services = res.services;
					resolve(res.services);
				},
				fail: (err) => {
					// console.error("获取服务失败", err);
					reject(err);
				},
			});
		});
	}

	// 获取特征值
	async getCharacteristics1(serviceId) {
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceCharacteristics({
				deviceId: this.deviceId,
				serviceId: serviceId,
				success: (res) => {
					// console.log("获取特征值成功", res.characteristics);
					this.characteristics[serviceId] = res.characteristics;
					resolve(res.characteristics);
				},
				fail: (err) => {
					console.error("获取特征值失败", err);
					reject(err);
				},
			});
		});
	}
	// 获取特征值
	async getCharacteristics3(serviceId) {
		let that = this
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceCharacteristics({
				deviceId: that.deviceId,
				serviceId: serviceId,
				success: (res) => {
					that.characteristics[serviceId] = res.characteristics;
					resolve(res.characteristics);
				},
				fail: (err) => {
					reject(err);
				},
			});
		});
	}

	// 启用通知
	async notifyCharacteristic(serviceId, characteristicId) {
		return new Promise((resolve, reject) => {
			uni.notifyBLECharacteristicValueChange({
				deviceId: this.deviceId,
				serviceId: serviceId,
				characteristicId: characteristicId,
				state: true,
				success: () => {
					console.log("通知开启成功");
					resolve();
				},
				fail: (err) => {
					console.error("通知开启失败", err);
					reject(err);
				},
			});
		});
	}

	// 断开连接
	async disconnect() {
		return new Promise((resolve, reject) => {
			uni.closeBLEConnection({
				deviceId: this.deviceId,
				success: () => {
					console.log("断开连接成功");
					this.connected = false;
					resolve();
				},
				fail: (err) => {
					console.error("断开连接失败", err);
					reject(err);
				},
			});
		});
	}

	// 延迟函数
	async delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}