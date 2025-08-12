<template>
	<view class="tablebody">
		<view class="tablebody_1">
			<view class="pagestylkes_1">{{$t("如果出现超时")}}</view>
			<view class="pagestylkes_3">{{$t("已连接过的设备")}}</view>
			<view class="tableitem" v-for="(item, index) in bluetoothList1" :key="index" @click="selectBluetooth(item)">
				<view class="listback">
					<view class="listbackitem">
						<image :src="getDeviceImage(item.name)" class="imagestyii" mode="aspectFit" />
						<view class="liststylesd">
							<view class="ellipsis-container">name:{{item.name}}</view>
							<view style="text-align: left">deviceId:{{item.deviceId}}</view>
						</view>
						<image :src="getRSSIIcon(item.RSSI)" class="imagestyii_1" mode="aspectFit" />
					</view>
				</view>
			</view>
		</view>
		<view style="padding-bottom: 50px;">
			<view class="pagestylkes_2">
				<view>{{$t("未连接过的设备")}}</view>
				<switch :disabled="false" :checked="checked" @change="switch1Change" style="transform: scale(0.7)" />
			</view>
			<view class="tableitem" v-for="(item, index) in bluetoothList" :key="item.deviceId"
				@click="selectBluetooth1(item)">
				<view class="listback">
					<view class="listbackitem">
						<image :src="getDeviceImage(item.name)" class="imagestyii" mode="aspectFit" />
						<view class="liststylesd">
							<view class="ellipsis-container">name:{{item.name}}</view>
							<view style="text-align: left">deviceId:{{item.deviceId}}</view>
							<view style="text-align: left" v-if="Adverti(item.advertisData) === '无数据'">mac:NA</view>
							<view v-else style="text-align: left">mac:{{Adverti(item.advertisData)}}</view>
						</view>
						<image :src="getRSSIIcon(item.RSSI)" class="imagestyii_1" mode="aspectFit" />
					</view>
				</view>
			</view>
		</view>
		<view class="titlesdsdsa">
			<view class="titlestyle">
				<uni-icons style="margin-top: 30px;" @click="back()" type="left" size="24" color="black"></uni-icons>
				<view class="lanysty">{{$t('蓝牙搜索页面')}}</view>
				<view @click="batch_del()" class="shauxins">{{$t('刷新')}}</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view class="popupstusdsd">
					<view style="padding: 30px 0 40px 0">
						<view class="popupstusdsditem">{{$t("正在配对")}}</view>
						<yi-loading center></yi-loading>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="popup1" :mask-click="true">
				<view class="popupstusdsd_2">
					<view style="padding: 10px 0 40px 0">
						<view class="popupstusdsditem">{{$t("配对成功")}}</view>
						<view class="popupstusdsditem_1">{{$t("蓝牙已连接成功")}}</view>
						<!-- <view v-show="deviceNamexueya === true">{{$t("标准蓝牙提示1")}}</view> -->
						<view v-show="deviceNameshoubiao === true">{{$t("标准蓝牙提示")}}</view>
					</view>
					<button @tap="turesss()" class="butonstsd">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="popup_fail" :mask-click="true">
				<view class="popupstusdsd_2">
					<view style="padding: 10px 0 40px 0">
						<view class="popupstusdsditem">{{$t("连接超时")}}</view>
						<view class="popupstusdsditem_1">{{$t("连接失败")}}</view>
					</view>
					<button @tap="turesss_faile()" class="butonstsd">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>
<script>
	import {
		mapMutations
	} from 'vuex'
	const platform = uni.getSystemInfoSync().platform;
	export default {

		onLoad(opt) {
			this.sn = opt.sn
			this.modelId = opt.modelId
			this.SELECT_TYPE = opt.SELECT_TYPE === "0" ? "1" : "0"
		},

		onShow() {
			uni.getStorageInfo({
				success: (res) => {
					if (res.keys.includes("listdadsa")) {
						this.bluetoothList1 = uni.getStorageSync("listdadsa").filter((item, index, self) => {
							return self.findIndex(t => t.name === item.name) === index;
						});
					} else {
						this.bluetoothList1 = [];
					}
				}
			});
			uni.openBluetoothAdapter()
		},

		data() {
			return {
				checked: false,
				show: false,
				msg: '',
				pendingShow: false,
				successShow: false,
				timer: null,
				bluetoothList: [],
				bluetoothList1: [],
				deviceMap: new Map(), // 用于存储和快速查找设备
				lastUpdateTime: 0, // 最后更新时间戳
				updateInterval: 500, // UI更新间隔(ms)
				isFirstLoad: true, // 是否首次加载
				idList: [],
				rssiTimer: '',
				serviceId: '',
				uuid: '',
				notifyUuid: '',
				sn: '',
				heartbeatInterval: null,
				heartbeatTimeout: 1000,
				isSumZero: false,
				MACdeviceID: '',
				arrrylist: [],
				modelId: '',
				tempBuffer: 0,
				quotient: 0,
				quotient1: 0,
				dataBuffer: [],
				Protocolsubcommand: '',
				writeuuid: '',
				deviceNameshoubiao: false,
				deviceNamexueya: false
			};
		},

		// 组件销毁时清理
		beforeDestroy() {
			// uni.offBluetoothDeviceFound();
			uni.stopBluetoothDevicesDiscovery(); // 停止搜索
			uni.stopBluetoothDevicesDiscovery();
			clearInterval(this.heartbeatInterval);
			clearTimeout(this.updateTimer);
			this.deviceMap.clear(); // 释放 Map
		},

		methods: {
			...mapMutations(['setlanyaId', 'setacktypes']),

			// 判断是否是新设备（最近10秒内发现的）
			isNewDevice(item) {
				return item.discoveryTime && (Date.now() - item.discoveryTime < 10000);
			},
			//返回按钮
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			turesss_faile() {
				this.$refs.popup_fail.close()
			},
			//获取蓝牙广播解析mac
			Adverti(advertisData) {
				if (advertisData === "" || advertisData === undefined) {
					return '无数据'
				} else {
					const str = this.ab2hex(advertisData).slice(4, this.ab2hex(advertisData).length - 4)
					const formattedStr = str.replace(/(.{2})(?=.)/g, '$1:').toUpperCase().slice(0, 20)
					return formattedStr;
				}
			},
			//获取蓝牙设备设置图标
			getDeviceImage(deviceName) {
				if (deviceName === 'BPW1') return '/static/page_icon/shoubiao.png';
				if (deviceName === 'EL2') return '/static/page_icon/lanya.png';
				return '/static/page_icon/lanya.png';
			},
			//获取蓝牙设备设置信号图标
			getRSSIIcon(RSSI) {
				if (RSSI <= -80) return '../../../static/page_icon/lanya_iocn_1.png';
				if (RSSI < -60 && RSSI > -80) return '../../../static/page_icon/lanya_iocn_2.png';
				return '../../../static/page_icon/lanya_iocn_3.png';
			},
			//确认按钮
			turesss() {
				this.$refs.popup1.close();
				uni.reLaunch({
					url: "../../Bind/Bing_page/Bind_success?modelId=" + this.modelId
				})
			},
			// 优化后的刷新方法
			async batch_del() {
				if (this.isRefreshing) return;
				this.isRefreshing = true;
				try {
					uni.showLoading({
						title: this.$t("刷新中"),
						mask: true
					});
					// 先停止所有蓝牙操作
					await this.stopDiscovery();
					await this.closeBluetoothAdapterAsync();
					// 清空列表但保留已连接设备
					this.bluetoothList = [];
					this.deviceMap = new Map();
					if (this.checked) {
						await this.initBluetoothAsync();
					}
				} catch (err) {
					console.error('刷新失败:', err);
					uni.showToast({
						title: this.$t('刷新失败'),
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
					this.isRefreshing = false;
				}
			},
			// 新增停止发现方法
			async stopDiscovery() {
				return new Promise((resolve) => {
					uni.stopBluetoothDevicesDiscovery({
						success: resolve,
						fail: resolve // 即使失败也继续
					});
				});
			},
			// ➕ 关闭蓝牙适配器（Promise 封装）
			async closeBluetoothAdapterAsync() {
				return new Promise((resolve, reject) => {
					uni.closeBluetoothAdapter({
						success: resolve,
						fail: reject,
					});
				});
			},
			// 初始化蓝牙优化版
			async initBluetoothAsync() {
				try {
					await new Promise((resolve, reject) => {
						uni.openBluetoothAdapter({
							success: resolve,
							fail: reject,
						});
					});
					// 初始化设备Map
					this.deviceMap = new Map();
					this.connectBluetooth();
				} catch (err) {
					if (err.errCode === 10001) {
						await this.showBluetoothAlert();
					}
					throw err;
				}
			},

			// 显示蓝牙提示框
			async showBluetoothAlert() {
				return new Promise((resolve) => {
					uni.showModal({
						content: this.$t("当前蓝牙未开启是否去设置打开"),
						showCancel: false,
						success: (modalres) => {
							if (modalres.confirm) {
								this.openBLE();
							}
							resolve();
						}
					});
				});
			},
			//蓝牙搜索开关
			switch1Change(e) {
				if (e.target.value) {
					this.checked = true;
					this.initBluetooth();
				} else {
					this.checked = false;
					this.bluetoothList = [];
				}
			},
			//已经连接过的蓝牙点击蓝牙
			selectBluetooth(item) {
				if (this.SELECT_TYPE === "0") {
					this.handleAndroidBluetoothConnection(item, true);
				} else if (this.SELECT_TYPE === "1") {
					this.handleBLEConnection(item.deviceId, item);
				}
			},
			/*选中蓝牙*/
			selectBluetooth1(item) {
				if (this.SELECT_TYPE === "0") {
					this.handleAndroidBluetoothConnection(item, false);
				} else if (this.SELECT_TYPE === "1") {
					this.handleBLEConnection(item.deviceId, item);
				}
			},
			handleAndroidBluetoothConnection(item, isConnected) {
				this.$refs.popup.open("bottom");
				const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
				let codetime = 10;
				let timer = setInterval(() => {
					codetime--;
					if (codetime < 1) {
						uni.showToast({
							title: this.$t("连接超时"),
							icon: "none"
						});
						this.$refs.popup.close();
						clearInterval(timer);
					} else {
						TestUniPlugin.startScan("", (callback) => {
							if (isConnected ? item.deviceId === callback.data.mac : item.name === "EL2") {
								this.MACdeviceID = callback.data.mac;
								clearInterval(timer);
								this.$refs.popup.close();
								this.$refs.popup1.open("bottom");
								this.updateBluetoothList(item);

								if (callback.data.weightStatus === 1) {
									this.handleWeightData(callback.data);
								}
							}
						});
						this.bind_devicetz(this.sn, this.MACdeviceID)
					}
				}, 1000);
			},
			handleIOSBluetoothConnection(item, isConnected) {
				this.$refs.popup.open("bottom");
				const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
				let codetime = 10;
				let timer = setInterval(() => {
					codetime--;
					if (codetime < 1) {
						uni.showToast({
							title: this.$t("连接超时"),
							icon: "none"
						});
						this.$refs.popup.close();
						clearInterval(timer);
					} else {
						TestUniPlugin.startScan("options", (callback) => {
							if (isConnected ? item.deviceId === callback.data.mac : item.name === "EL2") {
								this.$refs.popup.close();
								const parsedData = JSON.parse(callback.data);
								this.MACdeviceID = parsedData.mac;
								clearInterval(timer);
								this.$refs.popup1.open("bottom");
								this.updateBluetoothList(item);
								if (parsedData.testStatus === 255) {
									this.handleIOSWeightData(parsedData);
								}
							}
						});
						this.bind_devicetz(this.sn, this.MACdeviceID)
					}
				}, 1000);
			},
			bind_devicetz(sn, MACdeviceID) {
				const url = this.$url_bind_device;
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				};
				const header = this.getRequestHeader();
				this.$post(url, data, header).then(res => {
					console.log(res)
					if (res.code === 200) {
						uni.setStorageSync("deviceSn", this.sn);
					} else if (res.code === 401) {
						uni.showToast({
							title: this.$t("此设备已被其他账号绑定"),
							icon: 'none'
						})
						return
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail"
						});
					}
				}).catch(erro => {
					uni.reLaunch({
						url: "../Bing_page/Bind_fail"
					});
				})
			},
			// 优化后的更新已连接设备列表
			updateBluetoothList(item) {
				if (!item.discoveryTime) {
					item.discoveryTime = Date.now();
				}
				// 过滤重复设备并保持最新在最前
				this.bluetoothList1 = [
					item,
					...this.bluetoothList1.filter(t => t.deviceId !== item.deviceId)
				];
				uni.setStorageSync("listdadsa", this.bluetoothList1);
			},
			handleWeightData(data) {
				if (data.weightUnit === 0) {
					uni.setStorageSync("newweight", "KG");
				} else {
					uni.setStorageSync("newweight", "lb");
				}
				if (data.weight !== "0.00") {
					this.jakoblife_fat_scale1(this.MACdeviceID, data, "");
				}
			},
			handleIOSWeightData(data) {
				this.arrrylist.push(data);
				if (data.weightUnit === 0) {
					uni.setStorageSync("newweight", "KG");
				} else {
					uni.setStorageSync("newweight", "lb");
				}
				if (data.weight !== "0.00") {
					this.jakoblife_fat_scale1(this.MACdeviceID, data, this.arrrylist.length);
				}
			},
			handleBLEConnection(deviceId, item) {
				uni.openBluetoothAdapter({
					success: (res) => {
						//绑定
						this.bind_device(this.sn, deviceId, this.modelId, item);
					},
					fail: (err) => {
						if (err.errCode === 10001) {
							uni.showModal({
								content: this.$t("当前蓝牙未开启是否去设置打开"),
								showCancel: false,
								success: (modalres) => {
									if (modalres.confirm) {
										this.openBLE();
									}
								}
							});
						}
					}
				});
			},
			openBLE() {
				this.checked = false
				if (platform === "android") {
					const main = plus.android.runtimeMainActivity();
					const Intent = plus.android.importClass("android.content.Intent");
					const mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
					main.startActivity(mIntent);
				} else if (platform === "ios") {
					plus.runtime.launchApplication({
						action: 'App-Prefs:root=BLE'
					}, function(e) {});
				}
			},
			/*蓝牙初始化*/
			// 优化后的初始化蓝牙方法
			initBluetooth() {
				this.isFirstLoad = true;
				uni.openBluetoothAdapter({
					success: (res) => {
						this.connectBluetooth();
						// 首次加载完成后设置标志
						setTimeout(() => {
							this.isFirstLoad = false;
						}, 1000);
					},
					fail: (err) => {
						if (err.errCode === 10001) {
							uni.showModal({
								content: this.$t("当前蓝牙未开启是否去设置打开"),
								showCancel: false,
								success: (modalres) => {
									if (modalres.confirm) {
										this.openBLE();
									}
								}
							});
						}
					}
				});
			},
			//连接低功耗蓝牙
			connectBluetooth() {
				this.idList = [];
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: false,
					success: (startBluetoothDevicesDiscovery) => {
						if (this.isOPPO()) {
							this.updateInterval = 800; // OPPO 延长节流
							this.OPPOonBluetoothDeviceFound();
						} else {
							this.updateInterval = 500;
							this.onBluetoothDeviceFound();
						}
					}
				});
			},
			isOPPO() {
				return (uni.getSystemInfoSync().brand || '').toLowerCase() === 'oppo';
			},
			// 优化后的蓝牙设备发现回调
			OPPOonBluetoothDeviceFound() {
				let timer = null;
				let renderIndex = 0;
				const batchSize = 10; // OPPO 分批数量

				uni.onBluetoothDeviceFound((res) => {
					res.devices.forEach(item => {
						if (item.name && !this.deviceMap.has(item.deviceId)) {
							item.discoveryTime = Date.now();
							this.deviceMap.set(item.deviceId, item);
						}
					});

					clearTimeout(timer);
					timer = setTimeout(() => {
						const list = Array.from(this.deviceMap.values())
							.sort((a, b) => b.discoveryTime - a.discoveryTime);

						// 分批渲染，避免一次性 setData
						this.bluetoothList.splice(0, this.bluetoothList.length, ...list.slice(0,
							batchSize));
						renderIndex = batchSize;
					}, 500);
				});
			},

			onBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound((res) => {
					const currentTime = Date.now();
					let hasNewDevice = false;
					res.devices.forEach(item => {
						if (item.name && !this.deviceMap.has(item.deviceId)) {
							// 新设备添加时间戳
							item.discoveryTime = currentTime;
							this.deviceMap.set(item.deviceId, item);
							hasNewDevice = true;
							// 新设备立即置顶（不等待节流）
							if (this.isFirstLoad) {
								this.bluetoothList.unshift(item);
							}
						}
					});
					// 节流更新（非首次加载时）
					if (!this.isFirstLoad && hasNewDevice) {
						if (currentTime - this.lastUpdateTime > this.updateInterval) {
							this.updateDeviceList();
							this.lastUpdateTime = currentTime;
						}
					}
				});
			},
			// 更新设备列表（按时间倒序排序）
			updateDeviceList() {
				const sortedDevices = Array.from(this.deviceMap.values())
					.sort((a, b) => b.discoveryTime - a.discoveryTime);
				// 使用splice确保响应式更新
				this.bluetoothList.splice(0, this.bluetoothList.length, ...sortedDevices);
			},
			// 设备绑定
			bind_device(sn, MACdeviceID, modelId, item) {
				const url = this.$url_bind_device;
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				};
				const header = this.getRequestHeader();
				this.$post(url, data, header).then(res => {
					console.log(res)
					if (res.code === 200) {
						uni.setStorageSync("appQX", "1")
						uni.setStorageSync("deviceSn", this.sn);
						if (item.name === "BPW1") {
							this.deviceNameshoubiao = true
							// this.deviceNamexueya = false
						} else {
							this.deviceNamexueya = true
							// this.deviceNameshoubiao = false
						}
						this.createBLEConnection(MACdeviceID, item);
					} else if (res.code === 401) {
						uni.showToast({
							title: this.$t("此设备已被其他账号绑定"),
							icon: 'none'
						})
						return
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail"
						});
					}
				}).catch(erro => {
					uni.reLaunch({
						url: "../Bing_page/Bind_fail"
					});
				})
			},
			// 获取请求头
			getRequestHeader() {
				return {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;' // 自定义请求头信息
				};
			},
			// ArrayBuffer转16进度字符串示例
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			createBLEConnection(deviceId, item) {
				const that = this;
				that.$refs.popup.open("bottom");
				uni.createBLEConnection({
					deviceId: deviceId,
					timeout: 8000,
					success(res) {
						that.$refs.popup.close();
						that.$refs.popup1.open("bottom");
						that.MACdeviceID = deviceId;
						that.updateBluetoothList(item);
						setTimeout(() => {
							that.getBLEDeviceServices(deviceId);
						}, 2000);
					},
					fail(erro) {
						console.log("BLE连接失败：", JSON.stringify(erro));
						if (erro.errCode === 10002) {
							that.$nextTick(() => {
								if (that.$refs.popup && that.$refs.popup.close) {
									that.$refs.popup.close();
									that.$refs.popup_fail.open("bottom")
								}
							});
							that.getunbind(that.sn)
							uni.closeBLEConnection({
								deviceId: deviceId
							})
							uni.closeBluetoothAdapter()
							uni.openBluetoothAdapter()
							return
						} else {
							console.log("BLE连接失败：", JSON.stringify(erro));
							setTimeout(() => {
								uni.createBLEConnection({
									deviceId: deviceId,
									timeout: 4000,
									success(res) {
										that.$refs.popup.close();
										that.$refs.popup1.open("bottom");
										that.MACdeviceID = deviceId;
										that.updateBluetoothList(item);
										setTimeout(() => {
											that.getBLEDeviceServices(deviceId);
										}, 2000);
									},
									fail(erro) {
										that.$nextTick(() => {
											if (that.$refs.popup && that.$refs.popup
												.close) {
												that.$refs.popup.close();
												that.$refs.popup_fail.open("bottom")
											}
										});
										that.getunbind(that.sn)
										uni.closeBLEConnection({
											deviceId: deviceId
										})
										uni.closeBluetoothAdapter()
										uni.openBluetoothAdapter()
									}
								});
							}, 1000)
						}
					}
				});
			},

			getunbind(deviceSn) {
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
				});
			},
			//获取蓝牙外围设备的服务
			getBLEDeviceServices(deviceId) {
				let that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						switch (res.services.length) {
							case 3:
								if (res.services[1].uuid === "81EEA001-E735-49EC-8A11-7E32CAE1E14E") {
									that.getBLEDeviceCharacteristics3(deviceId, res.services[1].uuid)
								} else if (res.services[2].uuid === "0000FFF2-0000-1000-8000-00805F9B34FB") {
									uni.setBLEMTU({
										deviceId,
										mtu: 512
									});
									that.getBLEDeviceCharacteristics1(deviceId, res.services[2].uuid)
								}
								break
							case 4:
								that.getBLEDeviceCharacteristics2(deviceId, res.services[3].uuid)
								break
							case 2:
								that.getBLEDeviceCharacteristics2(deviceId, res.services[1].uuid)
								break
							case 1:
								uni.setBLEMTU({
									deviceId: deviceId,
									mtu: 512,
								})
								that.getBLEDeviceCharacteristics1(deviceId, res.services[0].uuid)
								break
						}
					},
					fail(res) {}
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics1(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知
							if (item.properties.notify) {
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {},
									fail: (notifyerr) => {},
								})
							}
						}
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics2(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.notify) {
								uni.setStorageSync("landeviceId", deviceId)
								uni.setStorageSync("lanserviceId", serviceId)
								uni.setStorageSync("landcharacteristicId", item.uuid)
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {},
									fail: (notifyerr) => {}
								})
							}
							if (item.properties.write) {
								// 启动心跳机制
								that.heartbeatInterval = setInterval(() => {
									// 当前时间
									const now = new Date();
									const year = now.getFullYear().toString();
									const month = now.getMonth() + 1; // 月份从0开始
									const day = now.getDate();
									const hour = now.getHours();
									const minute = now.getMinutes();
									const second = now.getSeconds();
									that.sendLargeData(deviceId, serviceId, item.uuid, year, month,
										day, hour, minute, second);
								}, that.heartbeatTimeout);
							}
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败222', res)
					}
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics3(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								const buffer = that.toArrayBuffer("e00006e8000000000101");
								uni.writeBLECharacteristicValue({
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									writeType: "writeNoResponse",
									value: buffer,
									success: (writeres) => {
										that.writeuuid = item.uuid
										if (platform === "android") {
											that.calculateChecksumsss2(deviceId, serviceId, that
												.writeuuid)
										}
									},
									fail: (writeerr) => {
										that.writeuuid = item.uuid
									}
								});
								that.setacktypes(1)
							}
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败222', res)
					}
				})
			},
			// 定义一个函数来计算校验和
			calculateChecksumsss2(deviceId, serviceId, writeuuid) {
				const ACK_HEADER = 0xe0; // 常量-头部
				const BleDeviceConfig = {
					PROTOCOL_VERSION: 0x00 // 协议版本号
				};
				const plugin = uni.requireNativePlugin(
					'ThirdSdkPlugin-ThirdSdkModule');
				console.log(plugin)

				plugin.pairDevice({
					mac: deviceId
				}, (res) => {
					console.log('配对结果:', res);
				});
				// 2. 启用通话音频
				plugin.enableBluetoothAudio({}, res => {
					console.log('1配对结果:', res);
				});
				// setTimeout(() => {
				// 	const peiduibuffer = this.toArrayBuffer("e00006e8000000000101");
				// 	uni.writeBLECharacteristicValue({
				// 		deviceId: deviceId,
				// 		serviceId: serviceId,
				// 		characteristicId: writeuuid,
				// 		writeType: "writeNoResponse",
				// 		value: peiduibuffer,
				// 		success: (writeres) => {
				// 			console.log("配对弹窗命令成功")
				// 		},
				// 		fail: (writeerr) => {
				// 			console.log("配对弹窗命令失败")
				// 		}
				// 	});
				// }, 1000)
				const bindcommandId = 0x08; // CMD-协议命令
				const bindcommandKey = 0x00; // key-协议子命令
				const bindbtys = new Uint8Array([
					parseInt(this.sn.slice(0, 2), 16),
					parseInt(this.sn.slice(2, 4), 16),
					parseInt(this.sn.slice(4, 6), 16),
					parseInt(this.sn.slice(6, 8), 16),
					parseInt(this.sn.slice(8, 10), 16),
					parseInt(this.sn.slice(10, 12), 16),
					parseInt(this.sn.slice(12, 14), 16),
					parseInt(this.sn.slice(14, 16), 16)
				]);
				const binddataLen = bindbtys.length;
				const bindcommand = new Uint8Array(binddataLen + 8);
				bindcommand[0] = ACK_HEADER;
				bindcommand[1] = ((5 + binddataLen) >> 8) & 0xFF;
				bindcommand[2] = (5 + binddataLen) & 0xFF;
				bindcommand[3] = bindcommandId;
				bindcommand[4] = BleDeviceConfig.PROTOCOL_VERSION;
				bindcommand[5] = bindcommandKey;
				bindcommand[6] = (binddataLen >> 8) & 0xFF;
				bindcommand[7] = binddataLen & 0xFF;
				bindcommand.set(bindbtys, 8);
				setTimeout(() => {
					this.writeBLECommand(deviceId, serviceId, writeuuid, bindcommand, platform ===
						"android" ? 'writeNoResponse' : 'write',
						(res) => console.log("绑定设备成功：", res),
						(err) => console.log("绑定设备失败：", err)
					);
				}, 2000);
				const commandId = 0x02; // CMD-协议命令
				const commandKey = 0x08; // key-协议子命令
				const now = new Date();
				const bytes1 = new Uint8Array([
					(((now.getFullYear() - 2000) << 2) + ((now.getMonth() + 1) >> 2)) & 0xFF,
					(((now.getMonth() + 1) & 0x03) << 6) + (now.getDate() << 1) + (now.getHours() >> 4),
					(((now.getHours() & 0x0F) << 4) + (now.getMinutes() >> 2)) & 0xFF,
					(((now.getMinutes() & 0x03) << 6) + now.getSeconds()) & 0xFF
				]);
				const dataLen = bytes1.length;
				const command = new Uint8Array(dataLen + 8);
				command[0] = ACK_HEADER;
				command[1] = ((5 + dataLen) >> 8) & 0xFF;
				command[2] = (5 + dataLen) & 0xFF;
				command[3] = commandId;
				command[4] = BleDeviceConfig.PROTOCOL_VERSION;
				command[5] = commandKey;
				command[6] = (dataLen >> 8) & 0xFF;
				command[7] = dataLen & 0xFF;
				command.set(bytes1, 8);
				setTimeout(() => {
					this.writeBLECommand(deviceId, serviceId, writeuuid, command, "writeNoResponse",
						(res) => {
							console.log("时间命令数据回复成功：", res);
						},
						(err) => {
							console.log("时间命令数据回复失败：", res);
						}
					);
				}, 3000);
			},

			// 定义一个函数来计算校验和
			calculateChecksumsss(hexString, deviceId, serviceId, writeuuid) {
				const bytes = [];
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16));
				}
				const protocolMarker = bytes[0]; // 协议标识位
				const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
				const protocolChecksum = bytes[3]; // 协议校准位
				const protocolCommand = bytes[4]; // 协议命令
				const protocolVersion = bytes[5]; // 协议版本号
				const protocolSubcommand = bytes[6]; // 协议子命令
				const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
				const commandValue = bytes.slice(9); // 命令指令值
				let sumBytes = 0;
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) { // 跳过校准位
						sumBytes += bytes[i];
					}
				}
				const calculatedChecksum = sumBytes % 256; // 取低8位
				const ACK_HEADER = 0xe0 // 常量-头部
				const bindcommandId = 0x08 // CMD-协议命令
				const bindcommandKey = 0x00 // key-协议子命令
				const BleDeviceConfig = {
					PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 协议版本号
				};
				const bindbtys = new Uint8Array(8);
				bindbtys[0] = `0x${this.sn.slice(0,2)}`;
				bindbtys[1] = `0x${this.sn.slice(2,4)}`;
				bindbtys[2] = `0x${this.sn.slice(4,6)}`;
				bindbtys[3] = `0x${this.sn.slice(6,8)}`;
				bindbtys[4] = `0x${this.sn.slice(8,10)}`;
				bindbtys[5] = `0x${this.sn.slice(10,12)}`;
				bindbtys[6] = `0x${this.sn.slice(12,14)}`;
				bindbtys[7] = `0x${this.sn.slice(14,16)}`;
				const binddataLen = bindbtys.length;
				const bindcommand = new Uint8Array(binddataLen + 8);
				bindcommand[0] = ACK_HEADER;
				bindcommand[1] = ((5 + binddataLen) >> 8) & 0xFF;
				bindcommand[2] = (5 + binddataLen) & 0xFF;
				bindcommand[3] = bindcommandId;
				bindcommand[4] = BleDeviceConfig.PROTOCOL_VERSION;
				bindcommand[5] = bindcommandKey;
				bindcommand[6] = (binddataLen >> 8) & 0xFF;
				bindcommand[7] = binddataLen & 0xFF;
				bindcommand.set(bindbtys, 8);
				const hexCommand1 = Array.from(bindcommand).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const bytesnew = new Uint8Array(hexCommand1.match(/../g).map(byte => parseInt(byte, 16)));
				const formattedBytes = Array.from(bytesnew).map(byte => `0x${byte.toString(16).padStart(2, '0')}`);
				const bytes333 = formattedBytes.map(byte => parseInt(byte, 16));
				let sum = 0;
				for (let i = 0; i < bytes333.length; i++) {
					sum += bytes333[i];
				}
				sum = sum % 256;
				const modifiedCommand = new Uint8Array(bindcommand.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand.set(bindcommand.subarray(0, 3), 0);
				modifiedCommand[3] = sum;
				modifiedCommand.set(bindcommand.subarray(3), 4);
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const bindbuffer = this.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: this.writeuuid,
					writeType: "writeNoResponse",
					value: bindbuffer,
					complete(completebind) {
						//ios发送命令给低功耗蓝牙，不管命令是否发送成功，都触发，绑定设备
						// console.log("completebind绑定设备", completebind)
					}
				})
				const commandId = 0x02 // CMD-协议命令
				const commandKey = 0x08 // key-协议子命令
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1; // getMonth() 返回的是 0-11，需要加 1
				const day = now.getDate();
				const hour = now.getHours();
				const minutes = now.getMinutes();
				const seconds = now.getSeconds();
				const bytes1 = new Uint8Array(4);
				bytes1[0] = (((year - 2000) << 2) + ((month & 0xFF) >> 2)) & 0xFF;
				bytes1[1] = (((month & 0x03) << 6) + (day << 1) + (hour >> 4)) & 0xFF;
				bytes1[2] = (((hour & 0x0F) << 4) + (minutes >> 2)) & 0xFF;
				bytes1[3] = (((minutes & 0x03) << 6) + seconds) & 0xFF;
				const dataLen = bytes1.length;
				const command = new Uint8Array(dataLen + 8);
				command[0] = ACK_HEADER;
				command[1] = ((5 + dataLen) >> 8) & 0xFF;
				command[2] = (5 + dataLen) & 0xFF;
				command[3] = commandId;
				command[4] = BleDeviceConfig.PROTOCOL_VERSION;
				command[5] = commandKey;
				command[6] = (dataLen >> 8) & 0xFF;
				command[7] = dataLen & 0xFF;
				command.set(bytes1, 8);
				const hexCommand2 = Array.from(command).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const bytesnew2 = new Uint8Array(hexCommand2.match(/../g).map(byte => parseInt(byte, 16)));
				const formattedBytes2 = Array.from(bytesnew2).map(byte => `0x${byte.toString(16).padStart(2, '0')}`);
				const bytes3332 = formattedBytes2.map(byte => parseInt(byte, 16));
				let sum2 = 0;
				for (let i = 0; i < bytes3332.length; i++) {
					sum2 += bytes3332[i];
				}
				sum2 = sum2 % 256;
				const modifiedCommand2 = new Uint8Array(command.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(command.subarray(0, 3), 0);
				modifiedCommand2[3] = sum2;
				modifiedCommand2.set(command.subarray(3), 4);
				const hexCommand22 = Array.from(modifiedCommand2).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const buffer = this.toArrayBuffer(hexCommand22); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: this.writeuuid,
					writeType: "writeNoResponse",
					value: buffer,
					complete(completetime) {
						//ios发送命令给低功耗蓝牙，不管命令是否发送成功，都触发同步时间
						// console.log("completetime同步时间", completetime)
					}
				})
			},

			onBLECharacteristicValueChange3(deviceId, serviceId) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					const dataList = that.ab2hex(res.value) //将蓝牙发送过来的数据转16进制
					that.dataBuffer.push(dataList) //组合16进制数据包
					//第一次绑定发送写入绑定命令返回的数据
					if (that.dataBuffer.length === 2 && that.dataBuffer[1].slice(0, 2) === "0e") {
						const hexString = that.dataBuffer[0]
						// 将十六进制字符串转换为字节数组
						const bytes = [];
						for (let i = 0; i < hexString.length; i += 2) {
							bytes.push(parseInt(hexString.substring(i, i + 2), 16));
						}
						// 协议格式解析
						const protocolMarker = bytes[0]; // 协议标识位
						const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
						const protocolChecksum = bytes[3]; // 协议校准位
						const protocolCommand = bytes[4]; // 协议命令
						const protocolVersion = bytes[5]; // 协议版本号
						const protocolSubcommand = bytes[6]; // 协议子命令
						const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
						const commandValue = bytes.slice(9); // 命令指令值
						// 计算字节和（除去协议校准位）
						let sumBytes = 0;
						for (let i = 0; i < bytes.length; i++) {
							if (i !== 3) { // 跳过校准位
								sumBytes += bytes[i];
							}
						}
						const calculatedChecksum = sumBytes % 256; // 取低8位	
						if (calculatedChecksum === protocolChecksum) {
							// 假设以下变量已经定义
							const ACK_RESPONSE_HEADER = 0x0E; // 示例值
							const commandId = `0x${protocolCommand.toString(16).padStart(2, '0')}`; // 示例值
							const commandKey = `0x${protocolSubcommand.toString(16).padStart(2, '0')}`; // 示例值
							const BleDeviceConfig = {
								PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 示例协议版本
							};
							const code = 0x00; // 示例 code 值
							const ackConfigByte = new Uint8Array(9);
							ackConfigByte[0] = ACK_RESPONSE_HEADER;
							ackConfigByte[1] = 0x00;
							ackConfigByte[2] = 0x06;
							ackConfigByte[3] = commandId;
							ackConfigByte[4] = BleDeviceConfig.PROTOCOL_VERSION;
							ackConfigByte[5] = commandKey;
							ackConfigByte[6] = 0x00;
							ackConfigByte[7] = 0x01;
							ackConfigByte[8] = code;
							let ackConfigBytesum = 0;
							for (let i = 0; i < ackConfigByte.length -
								1; i++) { // 遍历 command 数组的前 command.length - 1 个元素
								ackConfigBytesum += ackConfigByte[i]; // 累加每个元素的值
							}
							ackConfigBytesum = ackConfigBytesum % 256; // 取模 256，得到低 8 位的和
							// console.log("ackConfigBytesum:", ackConfigBytesum); // 输出求和结果
							// 创建新的数组，将校验和插入到第四个字节中
							const modifiedCommand = new Uint8Array(ackConfigByte.length + 1); // 第四个字节的插入，数组长度加1
							modifiedCommand.set(ackConfigByte.subarray(0, 3), 0);
							modifiedCommand[3] = ackConfigBytesum;
							modifiedCommand.set(ackConfigByte.subarray(3), 4);
							const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(
								2, '0')).join('');
							const buffer = this.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
							uni.writeBLECharacteristicValue({
								deviceId: deviceId,
								serviceId: serviceId,
								characteristicId: that.writeuuid,
								writeType: "writeNoResponse",
								value: buffer,
								complete(complete) {
									that.dataBuffer = []
									that.calculateChecksumsss(hexString, deviceId, serviceId, that
										.writeuuid)
								}
							})
						}
					}
				})
			},

			sendLargeData(deviceId, serviceId, uuid, year, month, day, hour, minute, second) {
				let that = this
				const timeSyncData = that.createTimeSyncData(year, month, day, hour, minute, second); // 构造时间同步数据
				const buffer = that.toArrayBuffer(timeSyncData); // 转换为 ArrayBuffer
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					success: () => {
						clearInterval(that.heartbeatInterval)
					},
					fail: (err) => {
						clearInterval(that.heartbeatInterval)
					}
				});
			},

			calculateChecksum(data) {
				let sum = 0;
				for (let i = 0; i < data.length; i += 2) {
					sum += parseInt(data.substr(i, 2), 16);
				}
				return (sum & 0xFF).toString(16).padStart(2, '0');
			},

			calculateChecksum11(bytes) {
				let sum = 0;
				bytes.forEach(byte => sum += byte);
				return sum % 256;
			},
			// 构建命令并写入 BLE 特征值
			writeBLECommand(deviceId, serviceId, writeuuid, command, writeType, successCallback, failCallback) {
				const checksum = this.calculateChecksum11(command);
				const modifiedCommand = new Uint8Array(command.length + 1);
				modifiedCommand.set(command.subarray(0, 3), 0);
				modifiedCommand[3] = checksum;
				modifiedCommand.set(command.subarray(3), 4);
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const buffer = this.toArrayBuffer(hexCommand);
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: writeuuid,
					writeType: writeType,
					value: buffer,
					success: successCallback,
					fail: failCallback
				});
			},

			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},

			createTimeSyncData(year, month, day, hour, minute, second) {
				let that = this
				const timeData =
					`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}${second.toString().padStart(2, '0')}`;
				const header = "4259"; // 协议头
				const length = "01"; // 数据长度
				const totalPackets = "0001"; // 总包数
				const currentPacket = "0001"; // 当前分包序号
				const flag = "09"; // 标志
				const rawData = `${header}${length}${totalPackets}${currentPacket}${flag}${timeData}`;
				// const checksum = that.calculateChecksum(rawData); // 计算和校验
				const checksum = "0f"; // 计算和校验
				const finalData = `${rawData}${checksum}`; // 添加和校验
				return finalData;
			},

			jakoblife_fat_scale1(deviceId, parsedData, listleng) {
				const data = {
					deviceSn: this.sn,
					mac: deviceId,
					deviceTypeId: this.SELECT_TYPE,
					slaveData: {
						weight: parsedData.weight,
						adc: parsedData.adc
					},
					time: parsedData.createTime
				}
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {})
			},
		},
	}
</script>

<style>
	/* .new-badge {
		position: absolute;
		right: 10px;
		top: 10px;
		background-color: #ff4757;
		color: white;
		padding: 2px 6px;
		border-radius: 10px;
		font-size: 12px;
	} */

	/* .tableitem {
		position: relative;
	} */


	.tablebody {
		height: 100vh;
		color: black;
	}

	.tablebody_1 {
		padding-bottom: 50px;
		padding-top: 108px;
	}

	.pagestylkes_1 {
		margin: 20px 20px 10px 20px;
		color: gray;
		font-size: 12px;
		font-weight: 400;
	}

	.pagestylkes_3 {
		padding: 15px;
		font-size: 16px;
		font-weight: bold;
	}

	.pagestylkes_2 {
		padding: 15px;
		font-size: 16px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tableitem {
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.listback {
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		text-align: center;
		margin-left: 20px;
		margin-right: 20px;
		line-height: 25px;
		background: white;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.listbackitem {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.imagestyii {
		height: 60px;
		width: 60px;
		object-fit: contain;
	}

	.imagestyii_1 {
		height: 30px;
		width: 30px;
		object-fit: contain;
	}

	.ellipsis-container {
		width: 200px;
		/* 设置容器宽度 */
		overflow: hidden;
		/* 隐藏超出部分 */
		white-space: nowrap;
		/* 文字不换行 */
		text-overflow: ellipsis;
		/* 超出部分显示省略号 */
		text-align: left
	}


	.liststylesd {
		width: 60vw;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		margin-left: 10px;
	}

	.liststitletylesd {
		width: 150px;
		text-align: left;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: auto;
	}

	.titlesdsdsa {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.titlestyle {
		background: #F5F5F5;
		width: auto;
		height: 108px;
		padding-left: 20px;
		padding-right: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.lanysty {
		font-size: 16px;
		font-weight: 600;
		margin-top: 30px;
	}

	.shauxins {
		margin-top: 30px;
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
	}

	.popupstusdsd_2 {
		border-radius: 20px;
		background: #fff;
		text-align: center;
		padding: 20px;
		margin: 60px 20px 60px 20px;
		z-index: 999999;
	}

	.popupstusdsd {
		border-radius: 20px;
		background: #fff;
		width: 80vw;
		text-align: center;
		margin: 0 40px 60px 40px;
	}


	.popupstusdsditem {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.popupstusdsditem_1 {
		font-size: 18px;
		font-weight: bold;
	}


	.butonstsd {
		margin: 10px 50px 20px 50px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}
</style>