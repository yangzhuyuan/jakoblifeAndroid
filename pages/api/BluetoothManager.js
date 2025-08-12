// BluetoothManager.js
import Bluetooth from './bluetoothService.js';

export default class BluetoothManager {
	constructor() {
		this.connectedDevices = {}; // 存储已连接设备的信息
	}

	isDeviceConnected(deviceId) {
		return new Promise((resolve, reject) => {
			uni.getConnectedBluetoothDevices({
				success: (res) => {
					const isConnected = res.devices.some((device) => device.deviceId ===
						deviceId);
					resolve(isConnected);
				},
				fail: (err) => {
					// console.error("检查设备连接状态失败", err);
					reject(err);
				},
			});
		});
	}


	async connectDevice(deviceId) {
		// 如果设备已连接，直接返回
		if (this.connectedDevices[deviceId]) {
			return this.connectedDevices[deviceId];
		}
		const bluetooth = new Bluetooth(deviceId);
		const isAlreadyConnected = await this.isDeviceConnected(deviceId);
		if (isAlreadyConnected) {
			await bluetooth.connect();
			await bluetooth.delay(3000);
			await bluetooth.getServices();
			// 根据服务数量处理不同的逻辑
			switch (bluetooth.services.length) {
				case 1:
					uni.setBLEMTU({
						deviceId: deviceId,
						mtu: 512,
					});
					await bluetooth.getCharacteristics1(bluetooth.services[0].uuid);
					break;
				case 2:
					await bluetooth.getCharacteristics1(bluetooth.services[1].uuid);
					break;
				case 3:
					if (bluetooth.services[1].uuid === "81EEA001-E735-49EC-8A11-7E32CAE1E14E") {
						await bluetooth.getCharacteristics3(bluetooth.services[1].uuid);
					}
					if (bluetooth.services[2].uuid === "0000FFF2-0000-1000-8000-00805F9B34FB") {
						uni.setBLEMTU({
							deviceId: deviceId,
							mtu: 512
						});
						await bluetooth.getCharacteristics1(bluetooth.services[2].uuid);
					}
					break;
				case 4:
					await bluetooth.getCharacteristics1(bluetooth.services[3].uuid);
					break;
			}
			this.connectedDevices[deviceId] = bluetooth;
			return this.connectedDevices[deviceId];
		}
		await bluetooth.connect();
		await bluetooth.delay(2000);
		await bluetooth.getServices();
		// 根据服务数量处理不同的逻辑
		switch (bluetooth.services.length) {
			case 1:
				uni.setBLEMTU({
					deviceId,
					mtu: 512,
				});
				await bluetooth.getCharacteristics1(bluetooth.services[0].uuid);
				break;
			case 2:
				await bluetooth.getCharacteristics1(bluetooth.services[1].uuid);
				break;
			case 3:
				if (bluetooth.services[1].uuid === "81EEA001-E735-49EC-8A11-7E32CAE1E14E") {
					await bluetooth.getCharacteristics3(bluetooth.services[1].uuid);
				}
				if (bluetooth.services[2].uuid === "0000FFF2-0000-1000-8000-00805F9B34FB") {
					uni.setBLEMTU({
						deviceId,
						mtu: 512
					});
					await bluetooth.getCharacteristics1(bluetooth.services[2].uuid);
				}
				break;
			case 4:
				await bluetooth.getCharacteristics1(bluetooth.services[3].uuid);
				break;
		}
		this.connectedDevices[deviceId] = bluetooth;
	}


	// 断开单个设备连接
	async disconnectDevice(deviceId) {
		if (!this.connectedDevices[deviceId]) {
			console.log(`设备 ${deviceId} 未连接`);
			return;
		}
		try {
			await this.connectedDevices[deviceId].disconnect();
			delete this.connectedDevices[deviceId];
			console.log(`设备 ${deviceId} 断开连接`);
		} catch (err) {
			console.error(`断开设备 ${deviceId} 连接失败`, err);
		}
	}

	// 断开所有设备连接
	async disconnectAll() {
		for (const deviceId in this.connectedDevices) {
			await this.disconnectDevice(deviceId);
		}
		this.connectedDevices = {};
		console.log('所有设备已断开连接');
	}
}