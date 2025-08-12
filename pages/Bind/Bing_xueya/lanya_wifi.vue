<template>
	<view class="tablebody">
		<view style="padding-bottom: 50px;padding-top: 108px;">
			<view style="margin: 0 20px 10px 20px; color: gray;font-size: 12px; font-weight: 400;">{{$t("如果出现超时")}}
			</view>
			<view style="padding: 15px;font-size: 16px;font-weight: bold;">{{$t("已连接过的设备")}}</view>
			<view class="tableitem" v-for="(item,index) in bluetoothList1" :key="index" @click="selectBluetooth(item)">
				<view class="listback">
					<view style="display: flex;flex-direction: row;align-items: center;">
						<image src="../../../static/page_icon/lanya.png" style="height: 60px;width: 60px;"></image>
						<view
							style="width: 60vw;display: flex;justify-content: flex-start;flex-direction: column;margin-left: 10px;">
							<view style="text-align: left">name:{{item.name}}</view>
							<view style="text-align: left">deviceId:{{item.deviceId}}</view>
						</view>
						<view>
							<image v-if="item.RSSI< -80" src="../../../static/page_icon/lanya_iocn_1.png"
								style="height: 30px;width: 30px;">
							</image>
							<image v-else-if="item.RSSI< -60&&item.RSSI> -80"
								src="../../../static/page_icon/lanya_iocn_2.png" style="height: 30px;width: 30px;">
							</image>
							<image v-else-if="item.RSSI > -60" src="../../../static/page_icon/lanya_iocn_3.png"
								style="height: 30px;width: 30px;"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding-bottom: 50px;">
			<view
				style="padding: 15px;font-size: 16px;font-weight: bold;display: flex;align-items: center; justify-content: space-between;">
				<view>{{$t("未连接过的设备")}}</view>
				<switch :checked="checked" @change="switch1Change" style="transform:scale(0.7)" />
			</view>
			<view class="tableitem" v-for="(item,index) in bluetoothList" :key="index" @click="selectBluetooth1(item)">
				<view class="listback">
					<view style="display: flex;flex-direction: row;align-items: center;">
						<image src="../../../static/page_icon/lanya.png" style="height: 60px;width: 60px;"></image>
						<view
							style="width: 60vw; display: flex;justify-content: flex-start;flex-direction: column;margin-left: 10px;">
							<view
								style="width: 150px; text-align: left;white-space: nowrap;text-overflow: ellipsis;overflow: auto;">
								name:{{item.name}}</view>
							<view style="text-align: left">deviceId:{{item.deviceId}}</view>
						</view>

						<view>
							<image v-if="item.RSSI<= -80" src="../../../static/page_icon/lanya_iocn_1.png"
								style="height: 30px;width: 30px;">
							</image>
							<image v-else-if="item.RSSI< -60&&item.RSSI> -80"
								src="../../../static/page_icon/lanya_iocn_2.png" style="height: 30px;width: 30px;">
							</image>
							<image v-else-if="item.RSSI >= -60" src="../../../static/page_icon/lanya_iocn_3.png"
								style="height: 30px;width: 30px;"></image>
						</view>

					</view>
				</view>
			</view>
		</view>
		<view style="position: fixed;top: 0;left: 0; right: 0;">
			<view class="titlestyle">
				<uni-icons style="margin-top: 30px;" @click="back()" type="left" size="24" color="black"></uni-icons>
				<view style="font-size: 16px; font-weight: 600;margin-top: 30px;">{{$t('蓝牙搜索页面')}}</view>
				<view @click="batch_del()" style="margin-top: 30px;">{{$t('刷新')}}</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff;width: 80vw;text-align: center; margin: 0 40px 60px 40px;">
					<view style="padding: 30px; 0 40px 0">
						<view style="font-size: 18px; font-weight: bold; margin-bottom: 40px;">{{$t("正在配对")}}</view>
						<yi-loading center></yi-loading>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff;width: 80vw;text-align: center; margin: 0 40px 60px 40px; padding-bottom: 20px;">
					<view style="padding: 30px; 0 40px 0">
						<view style="font-size: 18px; font-weight: bold; margin-bottom: 40px;">{{$t("配对成功")}}</view>
						<view>{{$t("蓝牙已连接成功")}}</view>
					</view>
					<button @tap="turesss()"
						style="margin: 10px 50px 20px 50px; border-radius: 20px;background: #3298F7;color: white;">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			let that = this
			uni.getStorageInfo({
				success(res) {
					if (res.keys.includes("listdadsa")) {
						// 假设我们要根据 'id' 属性去重
						let uniqueArr = uni.getStorageSync("listdadsa").filter((item, index, self) => {
							return self.findIndex(t => t.name === item.name) === index;
						});
						that.bluetoothList1 = uniqueArr
					} else {
						that.bluetoothList1 = []
					}
				}
			})
		},

		onLoad(res) {
			this.sn = res.sn
			this.SELECT_TYPE = res.SELECT_TYPE
			this.modelId = res.modelId

		},

		data() {
			return {
				sn: '',
				SELECT_TYPE: '',
				checked: false,
				tipShow: false,
				show: false,
				msg: '',
				pendingShow: false,
				successShow: false,
				timer: null,
				count: 3,
				bluetoothList: [],
				bluetoothList1: [],
				idList: [], //存放设备deviceId数组 去重
				rssiTimer: '',
				deviceId: '',
				serviceId: '',
				uuid: '',
				modelId: '',
			}
		},

		//刷新按钮
		onNavigationBarButtonTap(e) {
			console.log(e)
			if (e.text == "刷新") {
				if (this.checked == true) {
					this.bluetoothList = []
					this.initBluetooth()
				} else {
					uni.stopBluetoothDevicesDiscovery()
					uni.closeBluetoothAdapter({
						success(res) {
							console.log("关闭蓝牙模块")
						}
					})
					this.bluetoothList = []
				}
			}
		},

		methods: {


			switch1Change(e) {
				console.log("大师罗杰斯打卡大数据", e.detail.value)
				if (e.detail.value == true) {
					this.checked = true
					this.initBluetooth()
				} else {
					this.checked = false
					this.bluetoothList = []
				}
			},



			goService() {
				this.tipShow = true;
			},
			move() {
				uni.stopPullDownRefresh()
				// uni.offBluetoothDeviceFound();
				uni.stopBluetoothDevicesDiscovery();
			},
			/*选中蓝牙*/
			selectBluetooth1(item) {
				let that = this
				console.log("选中蓝牙", item)
				that.createBLEConnection(item.deviceId, item)
			},
			selectBluetooth(item) {
				let that = this
				uni.closeBluetoothAdapter({
					success(res) {
						console.log(res)
						uni.openBluetoothAdapter({
							success: res => {
								that.createBLEConnection(item.deviceId, "")
							},
							fail: function(err) {
								console.log('蓝牙模块初始化失败', err);
								// 处理蓝牙模块初始化失败的情况，例如提示用户打开蓝牙
								if (err.errCode === 10001) {
									uni.showModal({
										content: that.$t("当前蓝牙未开启"),
										showCancel: false,
										success: modalres => {
											if (modalres.confirm) {
												if (plus.os.name === 'Android') {
													var main = plus.android
														.runtimeMainActivity();
													var BluetoothAdapter = plus.android
														.importClass(
															"android.bluetooth.BluetoothAdapter"
														);
													var BAdapter = new BluetoothAdapter
														.getDefaultAdapter();
													if (!BAdapter.isEnabled()) {
														BAdapter.enable();
													}
												} else {
													var UIApplication = plus.ios.import(
														"UIApplication");
													var application2 = UIApplication
														.sharedApplication();
													var NSURL2 = plus.ios.import("NSURL");
													var setting2 = NSURL2.URLWithString(
														"app-settings:");
													application2.openURL(setting2);
													plus.ios.deleteObject(setting2);
													plus.ios.deleteObject(NSURL2);
													plus.ios.deleteObject(application2);
												}
											}
										}
									});
								}
							}

						})
					}
				})
			},
			/*蓝牙初始化*/
			initBluetooth() {
				let that = this;
				uni.openBluetoothAdapter({
					success: res => {
						console.log('蓝牙初始化', res)
						that.connectBluetooth()
					},
					fail: function(err) {
						console.log('蓝牙模块初始化失败', err);
						// 处理蓝牙模块初始化失败的情况，例如提示用户打开蓝牙
						if (err.errCode === 10001) {
							uni.showModal({
								content: that.$t("当前蓝牙未开启"),
								showCancel: false,
								success: modalres => {
									if (modalres.confirm) {
										if (plus.os.name === 'Android') {
											var main = plus.android
												.runtimeMainActivity();
											var BluetoothAdapter = plus.android
												.importClass(
													"android.bluetooth.BluetoothAdapter"
												);
											var BAdapter = new BluetoothAdapter
												.getDefaultAdapter();
											if (!BAdapter.isEnabled()) {
												BAdapter.enable();
											}
										} else {
											var UIApplication = plus.ios.import(
												"UIApplication");
											var application2 = UIApplication
												.sharedApplication();
											var NSURL2 = plus.ios.import("NSURL");
											var setting2 = NSURL2.URLWithString(
												"app-settings:");
											application2.openURL(setting2);
											plus.ios.deleteObject(setting2);
											plus.ios.deleteObject(NSURL2);
											plus.ios.deleteObject(application2);
										}
									}
								}
							});
						}
					}

				});
			},

			createBLEConnection(deviceId, item) {
				let that = this;
				that.$refs.popup.open("bottom")
				uni.createBLEConnection({
					deviceId: deviceId,
					success: (res) => {
						that.$refs.popup1.open("bottom")
						console.log("连接低功耗蓝牙设备成功", res);
						that.$refs.popup.close()
						if (item != "") {
							that.bluetoothList1.push(item)
							uni.setStorageSync("listdadsa", that.bluetoothList1)
						}
						//需延时连接，不然会报错
						setTimeout(function() {
							that.getBLEDeviceServices(deviceId)
							//设置MTU
							uni.setBLEMTU({
								deviceId: deviceId,
								mtu: 512,
								success(resMTU) {
									console.log("设置蓝牙最大传输单元", resMTU);
								}
							})
						}, 1000);
					},
					fail(erro) {
						that.$refs.popup.close()
						// uni.showToast({
						// 	title: "连接失败或设备已经连接",
						// 	icon: 'none'
						// })
						console.log("连接低功耗蓝牙设备失败", erro);
					}
				});
			},


			//获取蓝牙外围设备的服务
			getBLEDeviceServices(deviceId) {
				let that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						console.log("获取蓝牙外围设备的服务成功", res)
						that.getBLEDeviceCharacteristics(deviceId, res.services[2].uuid)
					},
					fail(res) {
						console.log("获取蓝牙外围设备的服务失败", res)
					}
				})

			},

			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						console.log('获取蓝牙设备某个服务中所有特征值(characteristic)', res.characteristics)

						that.deviceId = deviceId
						that.serviceId = serviceId
						that.uuid = res.characteristics[0].uuid

					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
			},


			turesss() {
				let that = this
				that.$refs.popup1.close()
				uni.navigateTo({
					url: '../../Bind/Bing_xueya/Bing_xueya_2?deviceId=' + that.deviceId +
						"&serviceId=" + that.serviceId + "&uuid=" + that.uuid + "&sn=" + that.sn +
						"&SELECT_TYPE=" + that.SELECT_TYPE + "&modelId=" + that.modelId
				})

			},



			android() {

				var main = plus.android.runtimeMainActivity();
				var Context = plus.android.importClass("android.content.Context");
				var BManager = main.getSystemService(Context.BLUETOOTH_SERVICE);
				plus.android.importClass(BManager); //引入相关的method函数
				var BAdapter = BManager.getAdapter();
				plus.android.importClass(BAdapter); //引入相关的method函数，这样之后才会有isEna
				var lists = BAdapter.getBondedDevices();
				plus.android.importClass(lists);
				// var resultDiv = document.getElementById('bluetooth_list');
				var iterator = lists.iterator();
				plus.android.importClass(iterator);

				while (iterator.hasNext()) {
					var d = iterator.next();
					plus.android.importClass(d);
					console.log("名称：" + d.getName() + "，地址：" + d.getAddress());
				}
			},



			enableBluetooth() {
				return new Promise((resolve, reject) => {
					plus.bluetooth.enableBluetooth(function() {
						console.log("蓝牙已启用");
						resolve(true);
					}, function(err) {
						console.log("蓝牙启用失败：" + err);
						reject(err);
					});
				});
			},


			getPairedDevices() {
				plus.bluetooth.getPairedDevices(function(devices) {
					if (devices.length > 0) {
						console.log("已配对设备列表:");
						devices.forEach(device => {
							console.log(`设备名称: ${device.name}, 设备地址: ${device.address}`);
							that.bluetoothList1 = device
						});
					} else {
						console.log("没有已配对的设备");
					}
				}, function(err) {
					console.log("获取已配对设备失败：" + err);
				});
			},


			/*搜索连接蓝牙*/
			connectBluetooth() {
				console.log('开始搜索蓝牙')
				let that = this;
				uni.startBluetoothDevicesDiscovery({
					success() {
						uni.onBluetoothDeviceFound(res => {
							var deviceArray = res.devices;
							for (let item of deviceArray) {
								that.idList.push(item)
								let uniqueArr = that.idList.filter((item, index, self) => {
									return self.findIndex(t => t.deviceId === item.deviceId) ===
										index;
								});
								let uniqueArr1 = uniqueArr.filter((item, index, self) => {
									return self.findIndex(t => t.name === item.name) === index;
								});
								that.bluetoothList = uniqueArr1
							}
							if (that.checked == true) {
								// 5秒后停止搜索释放系统资源
								let timer = setTimeout(() => {
									uni.stopBluetoothDevicesDiscovery()
									clearTimeout(timer)
								}, 5000);
							} else {
								uni.stopBluetoothDevicesDiscovery({
									success(res) {
										console.log("停止搜寻附近的蓝牙外围设备")
										that.bluetoothList = []
									}
								})
							}
						})
					}
				})
			}
		},
	}
</script>

<style>
	.tablebody {
		height: 100vh;
		width: 100vw;
		color: black;
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
		width: 80vw;
		line-height: 25px;
		background: white;
	}

	.titlestyle {
		background: #F5F5F5;
		width: auto;
		height: 88px;
		padding-left: 20px;
		padding-right: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>