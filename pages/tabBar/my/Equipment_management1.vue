<template>
	<view class="pagsin">
		<view class="list-container">
			<view class="list-item">
				<view class="item-content" @click="btn_add">
					<image lazy-load style="width: 68px; height: 68px;" :src="imageurl"></image>
				</view>
			</view>
			<view class="list-item" v-for="(item, index) in list" :key="index" :class="{ active: act === index }"
				@click="checkClick(index, item)">
				<view class="item-content">
					<image lazy-load class="imagesd" mode="aspectFit" :src="getDeviceImage(item.deviceModelId)"></image>
					<view class="xinghao">{{$t('型号') + (item.name==="BPW6"?"U19M":item.name)}}</view>
					<view style="font-size: 10px; padding-bottom: 5px; text-align: center;">SN:{{item.deviceSn}}</view>
					<view v-if="item.name==='JL-S260'||item.name==='JL-S100'"></view>
					<view v-else class="device-ble-status-badge"
						:class="isDeviceBleConnected(item.mac) ? 'is-on' : 'is-off'">
						{{ isDeviceBleConnected(item.mac) ? $t('设备已连接') : $t('设备未连接') }}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<button plain="true" class="button_bg_color" :style="{ background: act === -1 ? '#DBDBDB' : '#3298F7' }"
				@tap="deleteDevice()">{{$t('删除该设备')}}
			</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import BluetoothManager from '../../api/BluetoothManager.js';
	export default {
		data() {
			return {
				imageurl: '../../../static/icons/add.png',
				list: [],
				act: -1,
				deviceSn: '',
				mac: '',
				deviceModelConnectType: '',
				deviceModelId: '',
				bluetoothManager: new BluetoothManager(),
				/** 当前系统 BLE 已连接设备的 deviceId（与列表项 mac 一致） */
				connectedBleMacSet: {},
				/** 蓝牙连接状态监听（与 register 使用同一引用以便 off） */
				bleConnectionStateHandler: null,
				/** App 端部分运行时无 offBLEConnectionStateChange，用开关避免离页后仍刷新 */
				bleListenPageActive: false,
				/** 页面可见时轮询 BLE 连接态（App 端 onBLEConnectionStateChange 不可靠） */
				bleStatusPollTimer: null
			};
		},
		onShow() {
			this.act = -1
			this.queryDevices();
			this.refreshBleConnectionState();
			this.registerBleConnectionListener();
			uni.setNavigationBarTitle({
				title: this.$t('设备管理')
			});
			Vue.prototype.$globalTimers.isUnbinding = null

		},
		onHide() {
			this.unregisterBleConnectionListener();
		},
		onUnload() {
			this.unregisterBleConnectionListener();
		},
		methods: {
			...mapMutations(['setacktypes', 'setacktypes6']),

			normalizeBleDeviceId(id) {
				if (!id) return '';
				return String(id).trim().toUpperCase();
			},
			buildConnectedBleMacSet(devices) {
				const set = {};
				(devices || []).forEach((d) => {
					const key = this.normalizeBleDeviceId(d && d.deviceId);
					if (key) set[key] = true;
				});
				return set;
			},
			setConnectedBleMacSet(set) {
				this.connectedBleMacSet = set;
			},
			applyBleConnectionChange(change) {
				if (!change || !change.deviceId) return;
				const key = this.normalizeBleDeviceId(change.deviceId);
				if (!key) return;
				const next = {
					...this.connectedBleMacSet
				};
				if (change.connected) {
					next[key] = true;
				} else {
					delete next[key];
				}
				this.setConnectedBleMacSet(next);
			},
			startBleStatusPoll() {
				this.stopBleStatusPoll();
				this.bleStatusPollTimer = setInterval(() => {
					if (!this.bleListenPageActive) return;
					this.refreshBleConnectionState();
				}, 2000);
			},
			stopBleStatusPoll() {
				if (this.bleStatusPollTimer) {
					clearInterval(this.bleStatusPollTimer);
					this.bleStatusPollTimer = null;
				}
			},
			registerBleConnectionListener() {
				const canOff = typeof uni.offBLEConnectionStateChange === 'function';
				if (canOff) {
					this.unregisterBleConnectionListener();
				}
				this.bleListenPageActive = true;
				this.startBleStatusPoll();
				if (this.bleConnectionStateHandler) {
					return;
				}
				const self = this;
				this.bleConnectionStateHandler = function equipmentMgmt1BleStateChange(change) {
					if (!self.bleListenPageActive) return;
					self.applyBleConnectionChange(change);
					self.refreshBleConnectionState();
				};
				if (typeof uni.onBLEConnectionStateChange === 'function') {
					uni.onBLEConnectionStateChange(this.bleConnectionStateHandler);
				}
			},
			unregisterBleConnectionListener() {
				this.bleListenPageActive = false;
				this.stopBleStatusPoll();
				if (!this.bleConnectionStateHandler) return;
				if (typeof uni.offBLEConnectionStateChange === 'function') {
					try {
						uni.offBLEConnectionStateChange(this.bleConnectionStateHandler);
					} catch (e) {
						console.log('[Equipment1] offBLEConnectionStateChange', e);
					}
					this.bleConnectionStateHandler = null;
				}
			},
			refreshBleConnectionState() {
				const queryConnected = () => {
					uni.getConnectedBluetoothDevices({
						success: (res) => {
							this.setConnectedBleMacSet(this.buildConnectedBleMacSet(res.devices));
						},
						fail: () => {
							this.setConnectedBleMacSet({});
						}
					});
				};
				uni.openBluetoothAdapter({
					success: queryConnected,
					fail: (err) => {
						if (err && (err.errCode === 10001 || err.errCode === -1)) {
							queryConnected();
							return;
						}
						queryConnected();
					}
				});
			},
			isDeviceBleConnected(mac) {
				const key = this.normalizeBleDeviceId(mac);
				return !!(key && this.connectedBleMacSet[key]);
			},
			async disconnectAll(mac) {
				this.bluetoothManager = new BluetoothManager();
				this.bluetoothManager.disconnectDevice(mac);
			},
			btn_add() {
				this.act = -1;
				uni.navigateTo({
					url: '../../Bind/cs_manage?SHEBEI=1'
				});
				this.clearHeartbeatInterval();
			},
			checkClick(index, item) {
				this.act = index;
				this.deviceModelConnectType = item.deviceModelConnectType;
				this.deviceSn = item.deviceSn;
				this.mac = item.mac;
				this.deviceModelId = item.deviceModelId;
				this.clearHeartbeatInterval();
				Vue.prototype.$globalTimers.isUnbinding = this.mac
				this.refreshBleConnectionState();
			},
			getDeviceImage(deviceModelId) {
				const devicePictures = {
					'30000': this.getLocaleImage('BPW1', '/static/image/BPW1.png', '/static/image/shoubiao1.png'),
					'30001': this.getLocaleImage('BPW6', '/static/image/BPW6.jpg', '/static/image/BPW6.jpg'),
					'20000': this.getLocaleImage('JL-S260', '/static/image/jls260.png', '/static/image/tizhi1.jpg'),
					'20001': this.getLocaleImage('JL-S100', '/static/image/jls260.png', '/static/image/tizhi1.jpg'),
					'10000': this.getLocaleImage('TSB-617B-T', '/static/image/617.png', '/static/image/xueya1.png'),
					'10001': this.getLocaleImage('JL-BP68W', '/static/image/BP68.png', '/static/image/xueya1.png'),
					'10002': this.getLocaleImage('JL-BP67W', '/static/image/xueya1.png', '/static/image/xueya1.png'),
					'10003': this.getLocaleImage('JL-BP68G', '/static/image/68G.png', '/static/image/xueya1.png'),
					'10004': this.getLocaleImage('JL-BP67G', '/static/image/xueya1.png', '/static/image/xueya1.png'),
					'10005': this.getLocaleImage('ZK-B872B', '/static/image/68G.png', '/static/image/xueya1.png'),
				};
				return devicePictures[deviceModelId] || '/static/image/xueya1.png';
			},
			getLocaleImage(defaultName, zhImage, enImage) {
				const lan = uni.getLocale();
				return lan === 'zh-Hans' ? zhImage : enImage;
			},
			deleteDevice() {
				if (this.act === -1) {
					uni.showToast({
						title: this.$t('请选择一个设备'),
						icon: 'none'
					});
					return;
				}
				this.showDeleteConfirm();
			},
			showDeleteConfirm() {
				uni.showModal({
					title: this.$t('提示'),
					content: (this.deviceModelId === '10005' || this.deviceModelId === '10001' || this
							.deviceModelId === '10006' || this.deviceModelId === '20001' || this
							.deviceModelId === '20000') ?
						`${this.$t('确认移除此设备')};\n${this.$t('确认移除此设备2')}` : this.$t('确认移除此设备'),
					success: this.handleDeleteConfirm
				});
			},
			handleDeleteConfirm(showModalRes) {
				if (showModalRes.confirm) {
					this.clearHeartbeatInterval();
					this.showSecondDeleteConfirm();
				}
			},
			showSecondDeleteConfirm() {
				uni.showModal({
					title: this.$t('确认移除此设备'),
					content: (this.deviceModelId === '10005' || this.deviceModelId === '10001' || this
							.deviceModelId === '10006' || this.deviceModelId === '20001' || this
							.deviceModelId === '20000') ?
						`${this.$t('确认移除此设备1')};\n${this.$t('确认移除此设备2')}` : this.$t('确认移除此设备1'),
					confirmText: this.$t('去设置'),
					cancelText: this.$t('删除'),
					success: this.handleSecondDeleteConfirm
				});
			},

			handleSecondDeleteConfirm(showModalRes) {
				if (showModalRes.confirm) {
					this.openBluetoothSettings();
				}
				this.unbindDevice();
			},
			openBluetoothSettings() {
				if (plus.os.name === 'Android') {
					const main = plus.android.runtimeMainActivity();
					const Intent = plus.android.importClass('android.content.Intent');
					const Settings = plus.android.importClass('android.provider.Settings');
					const intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
					main.startActivity(intent);
				} else {
					plus.runtime.launchApplication({
						action: 'APP-Prefs:root=BLE'
					}, (e) => {
						console.log(e);
					});
				}
			},
			unbindDevice() {
				if (this.deviceModelId === '30000') {
					this.setacktypes(0)
					this.calculateChecksumsss(this.mac);
					uni.removeStorageSync('deviceIdwatch');
					uni.removeStorageSync('serviceIdwatch');
					uni.removeStorageSync('writeuuid');
				}
				if (this.deviceModelId === '30001') {
					console.log('正在解绑设备，型号：30001');
					// this.calculateChecksumsss1(this.mac);
					setTimeout(() => {
						this.setacktypes6(0);
						uni.removeStorageSync('BPW6devicemac');
						uni.removeStorageSync('BPW6deviceId');
						uni.removeStorageSync('BPW6deviceSn');
						uni.$emit('BPW6_DEVICE_UNBIND', this.mac);
						this.applyBleConnectionChange({
							deviceId: this.mac,
							connected: false
						});
						this.refreshBleConnectionState();
					}, 400);
				}
				setTimeout(() => {
					this.getunbind(this.deviceSn, this.mac, this.deviceModelId);
				}, 1000)

			},
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
			queryDevices() {
				uni.request({
					url: this.$url_APP_IP + this.$url_queryDevices,
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token'),
						'content-type': 'application/json;charset=UTF-8'
					},
					success: this.handleQueryDevicesSuccess,
					fail: this.handleQueryDevicesFail
				});
			},
			handleQueryDevicesSuccess(res) {
				if (res.data.code === 200) {
					this.list = this.formatDeviceList(res.data.rows);
					this.removeDuplicateDeviceNames();
					this.refreshBleConnectionState();
				} else if (res.data.code === 401) {
					uni.redirectTo({
						url: "/pages/login/login_land"
					});
					return
				} else {
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
				}
			},
			handleQueryDevicesFail() {
				uni.showToast({
					title: this.$t('请求失败'),
					icon: 'none'
				});
			},
			formatDeviceList(rows) {
				return rows.map(item => {
					switch (item.deviceModelId) {
						case '30000':
							return {
								...item, name: 'BPW1'
							};
						case '30001':
							return {
								...item, name: 'BPW6'
							};
						case '20000':
							return {
								...item, name: 'JL-S260'
							};
						case '20001':
							return {
								...item, name: 'JL-S100'
							};
						case '10000':
							return {
								...item, name: 'TSB-617B-T'
							};
						case '10001':
							return {
								...item, name: 'JL-BP68W'
							};
						case '10002':
							return {
								...item, name: 'JL-BP67W'
							};
						case '10003':
							return {
								...item, name: 'JL-BP68G'
							};
						case '10004':
							return {
								...item, name: 'JL-BP67G'
							};
						case '10005':
							return {
								...item, name: 'ZK-B872B'
							};
						default:
							return item;
					}
				});
			},
			removeDuplicateDeviceNames() {
				this.list = [...new Map(this.list.map(item => [item.name, item])).values()];
			},
			clearHeartbeatInterval() {
				// if (this.deviceModelId === '30001') {
				// 	return;
				// }
				if (Vue.prototype.$globalTimers.heartbeatInterval) {
					clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
					Vue.prototype.$globalTimers.heartbeatInterval = null;
				}
			},
			getunbind(deviceSn, mac, deviceModelId) {
				uni.request({
					url: this.$url_APP_IP + this.$url_getunbind,
					method: 'POST',
					data: {
						deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token'),
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: this.handleUnbindSuccess(deviceModelId, mac),
					fail: this.handleUnbindFail
				});
			},
			handleUnbindSuccess(deviceModelId, mac) {
				return (res) => {
					if (res.data.code === 200) {
						this.queryDevices();
						if (deviceModelId !== '30001') {
							this.clearHeartbeatInterval();
						}
						this.showUnbindSuccessToast();
						this.removeDeviceFromStorageSync(deviceModelId, mac);
						// this.disconnectAll(mac);
						if (deviceModelId !== '30001') {
							setTimeout(() => {
								this.closeBLEConnection(mac);
							}, 2000);
						} else if (Vue.prototype.$globalTimers) {
							Vue.prototype.$globalTimers.isUnbinding = null;
						}
					} else {
						this.showUnbindFailToast();
					}
				};
			},
			showUnbindSuccessToast() {
				uni.showToast({
					title: this.$t('设备已解绑'),
					icon: 'none'
				});
			},
			showUnbindFailToast() {
				uni.showToast({
					title: this.$t('解绑失败'),
					icon: 'none'
				});
			},
			removeDeviceFromStorageSync(deviceModelId, mac) {
				uni.getStorageInfo({
					success: ({
						keys
					}) => {
						if (!keys.includes('listdadsa')) return;
						const uniqueArr = uni.getStorageSync('listdadsa');
						const isWeightScale = deviceModelId === '20000' || deviceModelId === '20001';
						const deviceIndex = isWeightScale ?
							uniqueArr.findIndex(item => item.name === 'EL2' || item.deviceId === mac) :
							uniqueArr.findIndex(item => item.deviceId === mac);
						if (deviceIndex !== -1) uniqueArr.splice(deviceIndex, 1);
						if (uniqueArr.length === 0) {
							uni.removeStorageSync('listdadsa');
						} else {
							uni.setStorageSync('listdadsa', uniqueArr);
						}
					}
				});
			},
			isBleAlreadyDisconnectedError(err) {
				if (!err) return false;
				const code = err.errCode != null ? err.errCode : err.code;
				if (code === 10004 || code === 10006) return true;
				const msg = err.errMsg ? String(err.errMsg) : '';
				return msg.indexOf('no connection') !== -1 || msg.indexOf('未连接') !== -1;
			},
			onBleConnectionClosedUi(mac) {
				this.applyBleConnectionChange({
					deviceId: mac,
					connected: false
				});
				this.refreshBleConnectionState();
				if (Vue.prototype.$globalTimers) {
					Vue.prototype.$globalTimers.isUnbinding = null;
				}
			},
			closeBLEConnection(mac) {
				const self = this;
				uni.closeBLEConnection({
					deviceId: mac,
					success(res) {
						console.log('[Equipment1] closeBLEConnection ok', mac, res);
						self.onBleConnectionClosedUi(mac);
					},
					fail(erro) {
						if (self.isBleAlreadyDisconnectedError(erro)) {
							console.log('[Equipment1] closeBLEConnection 已无连接(视为成功)', mac);
							self.onBleConnectionClosedUi(mac);
							return;
						}
						console.log('[Equipment1] closeBLEConnection fail', mac, erro);
						self.onBleConnectionClosedUi(mac);
						// uni.closeBluetoothAdapter();
					}
				});
			},
			handleUnbindFail() {
				uni.showToast({
					title: this.$t('解绑失败'),
					icon: 'none'
				});
			},
			calculateChecksumsss(mac) {
				const bindcommand = new Uint8Array(9);
				bindcommand[0] = 0xE0;
				bindcommand[1] = 0x00;
				bindcommand[2] = 0x06;
				bindcommand[3] = 0x08;
				bindcommand[4] = 0x01;
				bindcommand[5] = 0x01;
				bindcommand[6] = 0x00;
				bindcommand[7] = 0x01;
				bindcommand[8] = 0x01;
				const bindhexCommand = Array.from(bindcommand).map(byte => byte.toString(16).padStart(2, '0')).join(
					'');
				const bindbytesnew = new Uint8Array(bindhexCommand.match(/../g).map(byte => parseInt(byte, 16)));
				const bindformattedBytes = Array.from(bindbytesnew).map(byte =>
					`0x${byte.toString(16).padStart(2, '0')}`);
				const bindbytes333 = bindformattedBytes.map(byte => parseInt(byte, 16));
				let bindsum = 0;
				for (let i = 0; i < bindbytes333.length; i++) {
					bindsum += bindbytes333[i];
				}
				bindsum = bindsum % 256;
				const bindmodifiedCommand = new Uint8Array(bindcommand.length + 1); // 第四个字节的插入，数组长度加1
				bindmodifiedCommand.set(bindcommand.subarray(0, 3), 0);
				bindmodifiedCommand[3] = bindsum;
				bindmodifiedCommand.set(bindcommand.subarray(3), 4);
				const bindhexCommand2 = Array.from(bindmodifiedCommand).map(byte => byte.toString(16).padStart(2, '0'))
					.join('');
				const bindbuffer = this.toArrayBuffer(bindhexCommand2); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: mac,
					serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
					characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
					value: bindbuffer,
					success(res) {
						console.log("0解绑设备：", res)
						uni.removeStorageSync("otadatares")
					},
					fail(err) {
						uni.removeStorageSync("otadatares")
						console.log("1解绑设备：", err)
					}
				})
			},
			calculateChecksumsss1(mac) {
				let that = this
				//优瑞恩手表重启命令：08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 08
				//优瑞恩手表重恢复出厂设置命令：FF 66 66 00 00 00 00 00 00 00 00 00 00 00 00 CC
				const bindbuffer = this.toArrayBuffer("08000000000000000000000000000008"); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: mac,
					serviceId: "6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E",
					characteristicId: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
					value: bindbuffer,
					success(res) {
						console.log("BPW6解绑设备：", res)
					},
					fail(err) {
						console.log("BPW6解绑设备：", err)
					}
				})
			},
		},
	};
</script>

<style>
	.pagsin {
		padding-top: 10px;
		background: #EFEFF4;
		color: black;
		height: 100vh;
	}

	.list-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 0 10px 160px 10px;
		justify-content: space-between;
	}

	.list-item {
		background-color: white;
		border-radius: 20px;
		margin: 5px;
		padding: 5px;
		box-sizing: border-box;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.list-item.active {
		border: 2px solid #3298F7;
	}

	.item-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200px;
	}

	.imagesd {
		width: 100%;
		object-fit: contain;
		margin-top: 10px;
	}

	.xinghao {
		text-align: center;
		margin-top: 10px;
	}

	.device-ble-status-badge {
		margin-top: 6px;
		padding: 4px 10px;
		font-size: 11px;
		border-radius: 999px;
		text-align: center;
	}

	.device-ble-status-badge.is-on {
		color: #0a7;
		background: #e6f7f0;
	}

	.device-ble-status-badge.is-off {
		color: #888;
		background: #f0f0f0;
	}

	.bottom-bar {
		width: 100vw;
		height: 100px;
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: column;
		padding: 40rpx 0 20px;
	}

	.button_bg_color {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		margin: 0 20px;
		height: 48px;
		font-size: 16px;
		font-weight: 600;
		color: white !important;
		border-radius: 100px;
		border: none !important;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}
</style>