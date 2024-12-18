<template>
	<view class="tablebody">
		<view style="padding-bottom: 50px;">
			<view style="padding: 15px;font-size: 16px;font-weight: bold;">已连接过的设备</view>
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
				<view>未连接过的设备</view>
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

		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff;width: 80vw;text-align: center; margin: 0 40px 60px 40px;">
					<view style="padding: 30px; 0 40px 0">
						<view style="font-size: 18px; font-weight: bold; margin-bottom: 40px;">正在配对</view>
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
						<view style="font-size: 18px; font-weight: bold; margin-bottom: 40px;">配对成功</view>
						<view>蓝牙已连接成功</view>
					</view>
					<button @tap="turesss()"
						style="margin: 10px 50px 20px 50px; border-radius: 20px;background: #3298F7;color: white;">确定</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		// onShow() {
		// 	this.initBluetooth()
		// },
		data() {
			return {
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
			}
		},


		onNavigationBarButtonTap(e) {
			console.log(e)
			if (e.text == "刷新") {
				this.bluetoothList = []
				this.initBluetooth()

			}

		},

		methods: {


			switch1Change(e) {
				console.log("大师罗杰斯打卡大数据", e.detail.value)
				if (e.detail.value == true) {
					this.checked = true
					this.initBluetooth()
				}else{
					this.checked = false
					this.bluetoothList = []
					uni.closeBluetoothAdapter({
					  success(res) {
					    console.log(res)
					  }
					})
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
				that.createBLEConnection(item.deviceId)

			},
			/*蓝牙初始化*/
			initBluetooth() {
				let that = this;
				uni.openBluetoothAdapter({
					success: res => {
						console.log('蓝牙初始化', res)
						// if (uni.getSystemInfoSync().platform == 'ios') {
						// 	that.enableBluetooth()
						// } else {
						// 	that.android()
						// }
						that.connectBluetooth()
					},
					fail: error => {
						uni.showToast({
							title: JSON.stringify(error.errorMessage)
						})
					},
				});
			},


			createBLEConnection(deviceId) {
				let that = this;
				that.$refs.popup.open("bottom")
				uni.createBLEConnection({
					deviceId: deviceId,
					success: (res) => {
						that.$refs.popup1.open("bottom")
						console.log("连接低功耗蓝牙设备成功", res);
						that.$refs.popup.close()
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
						uni.showToast({
							title: "连接失败",
							icon: 'none'
						})
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
						"&serviceId=" + that.serviceId + "&uuid=" + that.uuid
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


								// console.log("dasdkjagdadkakdj111111", uniqueArr)

								let uniqueArr1 = uniqueArr.filter((item, index, self) => {
									return self.findIndex(t => t.name === item.name) === index;
								});
								console.log("dasdkjagdadkakdj111111", uniqueArr1)
								that.bluetoothList = uniqueArr1
								console.log("dasdkjagdadkakdj", that.idList)
							}
							// 1秒后停止搜索释放系统资源
							let timer = setTimeout(() => {
								uni.stopBluetoothDevicesDiscovery()
								clearTimeout(timer)
							}, 5000);
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
</style>