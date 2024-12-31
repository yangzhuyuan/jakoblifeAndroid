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
		onShow() {
			
			// const sdk = uni.requireNativePlugin("livefitsdk")
			// console.log("dsdsasda",sdk)


			

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
				notifyUuid: '',
				advertisData: '',
			}
		},

		onNavigationBarButtonTap(e) {
			console.log(e)
			if (e.text == "刷新") {
				if (this.checked == true) {
					this.bluetoothList = []
					this.initBluetooth()
				} else {
					this.bluetoothList = []
					uni.closeBluetoothAdapter({
						success(res) {
							console.log(res)
						}
					})
				}

			}
		},

		methods: {
			switch1Change(e) {
				if (e.detail.value == true) {
					this.checked = true
					this.initBluetooth()
				} else {
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
				uni.openBluetoothAdapter({
					success: res => {
						that.createBLEConnection(item.deviceId, "")
					}
				})
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
						uni.showToast({
							title: "连接失败或设备已经连接",
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
						for (let i = 0; i < res.services.length; i++) {
							// if (res.services[i].isPrimary) {
							console.log("dskhsjkdha", res.services[i].uuid)
							that.getBLEDeviceCharacteristics(deviceId, res.services[2].uuid)
							// 	return
							// }
						}
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
						console.log("dsajhkjhsdka走这里", deviceId)
						console.log("dsajhkjhsdka走这里", serviceId)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							// console.log("特征值服务", item)
							// if (item.properties.write) {
							// 	that.uuid = item.uuid
							// 	console.log("dsajhkjhsdka走这里22222", item.uuid)
							uni.getBluetoothDevices({
								success(ressss) {
									console.log(ressss)
									for (let a = 0; ressss.devices.length > a; a++) {
										if (ressss.devices[a].name == "BPW1") {
											console.log("Dsakhdas", ressss.devices[a]
												.advertisData)
											const hexString = that.ab2hex(ressss.devices[a]
												.advertisData);
											console.log('ManufacturerData:', hexString);
											// 根据需要解析hexString
											that.parseManufacturerData(hexString);
											// 				that.advertisData = ressss.devices[a].advertisData
											// 				let arrayBuffer = ressss.devices[a].advertisData; // ArrayBuffer对象

											// 				// 创建一个Uint8Array视图
											// 				// let uint8Array = new Uint8Array(arrayBuffer);

											// 				// // 创建TextDecoder实例，指定编码格式（例如'utf-8'）
											// 				// let decoder = new TextDecoder();

											// 				// // 使用decode方法将Uint8Array转换为字符串
											// 				// let str = decoder.decode(uint8Array);

											// 				// console.log(str); // 输出转换后的字符串
											// 				// let res = that.ab2hex(ressss.devices[a].advertisData)
											// 				// console.log("dsajhkjhsdka走这里11111", that.hexToBinary(
											// 				// 	res))
										}
									}
								}
							})
							// }

							// if (item.properties.notify) {
							// 	that.notifyUuid = item.uuid
							// 	console.log("dsajhkjhsdka走这里11111", item.uuid)
							// 	that.updateNotify(deviceId, serviceId, item.uuid)

							// }



							// if (res.characteristics[i].properties.read === true) {
							// 	console.log("dsajhkjhsdka走这里11111")
							// 	uni.readBLECharacteristicValue({
							// 		// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
							// 		deviceId: deviceId,
							// 		// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
							// 		serviceId: serviceId,
							// 		// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
							// 		characteristicId: res.characteristics[i].uuid,
							// 		success(res1111) {
							// 			console.log('readBLECharacteristicValue:', res1111)
							// 		}
							// 	})
							// } else 
							// if (res.characteristics[i].properties.notify == true) {
							// console.log("dsajhkjhsdka走这里", res.characteristics[2].uuid)
							// console.log("dsajhkjhsdka走这里", deviceId)
							// console.log("dsajhkjhsdka走这里", serviceId)

							// that.updateNotify(deviceId, serviceId, res.characteristics[2].uuid)


							// 	// } else {
							// 	// 	console.log("dsajhkjhsdk2222a走这里")
							// 	// 	that.deviceId = deviceId
							// 	// 	that.serviceId = serviceId
							// 	// 	that.uuid = res.characteristics[0].uuid
							// }
						}


					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})

			},



			updateNotify(deviceId, serviceId, uuid) {
				console.log("aaaaaaaaaa", deviceId)
				console.log("bbbbbbbbbb", serviceId)
				console.log("cccccccccc", uuid)
				var _this = this;
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					success: (res) => {
						console.log("notify链接成功!");
						uni.showToast({
							title: "链接成功",
							icon: "success"
						})

						uni.readBLECharacteristicValue({
							success(resqqq) {
								console.log("sdadasda", resqqq)
							}
						})

						_this.onBLECharacteristicValueChange();
					},

					fail: (res) => {
						console.log('启用 notify 功能失败', res)
						uni.showToast({
							icon: 'none',
							title: '设备暂不支持接收数据',
							duration: 3000
						})
					}
				})
			},

			onBLECharacteristicValueChange() {
				console.log("开始监听")
				uni.onBLECharacteristicValueChange((res) => {
					console.log("特征变化", res);
					console.log(this.ab2hex(res.value))
					// let result = this.hexCharCodeToStr(this.ab2hex(res.value))
					// console.log(result)
					// this.resdata = this.ab2hex(res.value);
				})
			},


			sendATCommand(deviceId, serviceId, uuid, senddata) {
				let that = this
				console.log("发送 _deviceId：" + deviceId)
				console.log("发送_serviceId：" + serviceId)
				console.log("发送_characteristicId：" + uuid)
				console.log("发送senddata：" + senddata)
				console.log("16进制数据：" + that.ab2hex(senddata))
				// console.log("最后将16进制转换为ascii码，就能看到对应的结果" + this.hexCharCodeToStr(this.ab2hex(senddata)))
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: senddata,
					writeType: "writeNoResponse",
					success(res) {
						console.log('向低功耗蓝牙设备特征值中写入二进制数据', res)
						that.updateNotify(deviceId, serviceId, that.notifyUuid)
						// that.onBLECharacteristicValueChange()
						// uni.navigateTo({
						// 	url: "../Bing_page/Bind_pg?sn=" + this.sn
						// })
					},
					fail: function(res) {
						console.log('失败', res)
						// uni.navigateTo({
						// 	url: '../Bing_page/Bind_fail'
						// })
					}
				})
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

			// 解析ManufacturerData函数
			parseManufacturerData(hexString) {
				// 根据具体的蓝牙设备文档和制造商数据格式进行解析
				// 例如，如果知道MAC地址在ManufacturerData的特定位置，可以提取出来
				// 这里只是一个示例，具体实现需要根据实际情况
				const macAddress1 = hexString.slice(0, 4);
				const macAddress2 = hexString.slice(4, 8);
				const macAddress3 = hexString.slice(8, 12);
				const macAddress4 = hexString.slice(12, 14);
				const macAddress5 = hexString.slice(14, 26);
				const macAddress6 = hexString.slice(26, 28);
				const macAddress7 = hexString.slice(28, 30);
				const macAddress8 = hexString.slice(30, 34); // 假设MAC地址是前17个字符
				console.log('厂商ID:', macAddress1);
				console.log('VID:', macAddress2);
				console.log('PID:', macAddress3);
				console.log('APP手表类型等信息:', macAddress4);
				console.log('MAC地址:', macAddress5);
				console.log(':', macAddress6);
				console.log(':', macAddress7);
				console.log('即”MD”的ASCII码:', macAddress8);
			},



			turesss() {
				let that = this
				that.$refs.popup1.close()

				console.log("dsajkhdksahkda", that.advertisData)

				that.sendATCommand(that.deviceId, that.serviceId, that.uuid, that.advertisData)

				// uni.onBLECharacteristicValueChange((resd) => {
				// 	console.log("发送过来的数据---------", resd);
				// 	// 结果里有个value值，该值为 ArrayBuffer 类型，所以在控制台无法用肉眼观察到，必须将该值转换为16进制
				// 	let resHex = that.ab2hex(resd.value)
				// 	console.log(resHex);
				// 	// 最后将16进制转换为ascii码，就能看到对应的结果
				// 	let result = that.hexCharCodeToStr(resHex)
				// 	console.log(result)
				// })
				// uni.switchTab({
				// 	url: '/pages/tabBar/main/Main'
				// })
				// uni.navigateTo({
				// 	url: '../../Bind/Bing_xueya/Bing_xueya_2?deviceId=' + that.deviceId +
				// 		"&serviceId=" + that.serviceId + "&uuid=" + that.uuid
				// })

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
									return self.findIndex(t => t.deviceId === item
										.deviceId) === index;
								});
								let uniqueArr1 = uniqueArr.filter((item, index, self) => {
									return self.findIndex(t => t.name === item.name) ===
										index;
								});
								that.bluetoothList = uniqueArr1
							}
							// 1秒后停止搜索释放系统资源
							let timer = setTimeout(() => {
								uni.stopBluetoothDevicesDiscovery()
								clearTimeout(timer)
							}, 5000);
						})
					}
				})
			},
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