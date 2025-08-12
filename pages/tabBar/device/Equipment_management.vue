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
					<view class="xinghao">{{$t('型号') + item.name}}</view>
					<view style="font-size: 10px; padding-bottom: 5px; text-align: center;">sn:{{item.deviceSn}}</view>
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
			};
		},
		onShow() {
			this.act = -1
			// this.clearHeartbeatInterval();
			this.queryDevices();
			uni.setNavigationBarTitle({
				title: this.$t('设备管理')
			});
		},
		methods: {
			...mapMutations(['setacktypes']),
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
			},
			getDeviceImage(deviceModelId) {
				const devicePictures = {
					'30000': this.getLocaleImage('BPW1', '/static/image/BPW1.png', '/static/image/shoubiao1.png'),
					'30001': this.getLocaleImage('BPW6', '/static/image/BPW1.png', '/static/image/shoubiao1.png'),
					'20000': this.getLocaleImage('JL-S260', '/static/image/jls260.png',
						'/static/image/tizhi1.jpg'),
					'20001': this.getLocaleImage('JL-S100', '/static/image/jls260.png',
						'/static/image/tizhi1.jpg'),
					'10000': this.getLocaleImage('TSB-617B-T', '/static/image/617.png',
						'/static/image/xueya1.png'),
					'10001': this.getLocaleImage('JL-BP68W', '/static/image/xueya1.png',
						'/static/image/xueya1.png'),
					'10002': this.getLocaleImage('JL-BP67W', '/static/image/xueya1.png',
						'/static/image/xueya1.png'),
					'10003': this.getLocaleImage('JL-BP68G', '/static/image/68G.png', '/static/image/xueya1.png'),
					'10004': this.getLocaleImage('JL-BP67G', '/static/image/xueya1.png',
						'/static/image/xueya1.png'),
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
					content: this.deviceModelId === '10005' ?
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
					content: this.deviceModelId === '10005' ?
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
				this.setacktypes(0);
				if (this.deviceModelId === '30000') {
					this.calculateChecksumsss(this.mac);
				}
				this.getunbind(this.deviceSn, this.mac, this.deviceModelId);
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
					url: this.$url_queryDevices,
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
				if (Vue.prototype.$globalTimers.heartbeatInterval) {
					clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
					Vue.prototype.$globalTimers.heartbeatInterval = null;
				}
			},
			getunbind(deviceSn, mac, deviceModelId) {
				uni.request({
					url: this.$url_getunbind,
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
						this.clearHeartbeatInterval();
						this.showUnbindSuccessToast();
						this.removeDeviceFromStorageSync(deviceModelId, mac);
						this.closeBLEConnection(mac);
						this.queryDevices();
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
			closeBLEConnection(mac) {
				uni.closeBLEConnection({
					deviceId: mac,
					success: () => {}
				});
				this.disconnectAll(mac);
				uni.closeBluetoothAdapter();
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
					},
					fail(err) {
						console.log("1解绑设备：", err)
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
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
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
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}
</style>