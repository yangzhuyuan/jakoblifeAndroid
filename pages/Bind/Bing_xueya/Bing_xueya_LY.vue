<template>
	<view style="display: flex; width: 100vw;height: 100vh;color: black;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<view style="width: auto;margin: 20px; background: white; border-radius: 10px;padding: 20px;">
				<image style="width: 100%; " :src="SELECT_TYPE === '0' ? imagess:imagess1"></image>
			</view>
			<view style="margin: 10px 20px 0 20px;">{{$t('BDSBitem.title_13')}}</view>
			<view style="margin: 0 20px 0 20px;">{{$t('BDSBitem.title_14')}}</view>
			<view style="flex-direction: row; display: flex; margin-top: 100px; justify-content: center;">
				<checkbox style="font-size: 28rpx; margin-right:10px;" color="#ffffff" class="round"
					activeBackgroundColor="#3298F7" active-border-color="#D5D5D5" :checked="cb" @click="checked">
					{{$t('BDSBitem.title_2')}}
				</checkbox>
			</view>
			<button class="btn" @click="btn_next()">{{$t('zhuceitem.btn_0')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,
				deviceId: '',
				serviceId: '',
				SELECT_TYPE: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png'
			}
		},
		
		onLoad(opt) {
			console.log("上个页面带过来的数据", opt.SELECT_TYPE)
		
			this.SELECT_TYPE = opt.SELECT_TYPE
		},
		
		
		
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})

			// let that = this
			// //初始化蓝牙模块
			// uni.openBluetoothAdapter({
			// 	success(res) {
			// 		console.log("初始化蓝牙模块", res)
			// 		uni.startBluetoothDevicesDiscovery({
			// 			allowDuplicatesKey: true,
			// 			success: function(res1) {
			// 				console.log("开始搜寻附近的蓝牙外围设备", res1);
			// 				uni.onBluetoothDeviceFound(function(devices) {
			// 					console.log('监听寻找到新设备的事件', devices)
			// 					if (devices.devices[0].name === "jakob_BLE") {
			// 						uni.stopBluetoothDevicesDiscovery({
			// 							success(res2) {
			// 								console.log("停止搜寻附近的蓝牙外围设备", res2);
			// 								that.createBLEConnection(devices.devices[0]
			// 									.deviceId)
			// 							},
			// 						});
			// 					} else {
			// 						console.log('未找到对应外围设备继续搜索', devices)
			// 					}
			// 				})
			// 			},
			// 		});
			// 	},
			// })
		},

		methods: {
			createBLEConnection(deviceId) {
				let that = this;
				uni.createBLEConnection({
					deviceId: deviceId,
					success: (res) => {
						console.log("连接低功耗蓝牙设备成功", res);
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
						console.log("连接低功耗蓝牙设备失败", res);
					}
				});
			},

			//获取蓝牙外围设备的服务
			getBLEDeviceServices(deviceId) {
				let that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						console.log("获取蓝牙外围设备的服务", res)
						that.getBLEDeviceCharacteristics(deviceId, res.services[2].uuid)
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

						// setTimeout(function() {
						// uni.notifyBLECharacteristicValueChange({
						// 	state: true, // 启用 notify 功能
						// 	// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						// 	deviceId: deviceId,
						// 	// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
						// 	serviceId: serviceId,
						// 	// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
						// 	characteristicId: res.characteristics[0].uuid,
						// 	success(res) {
						// 		console.log('notifyBLECharacteristicValueChange success',
						// 			res
						// 			.errMsg)

						// 	}
						// })
						// that.sendATCommand(deviceId, serviceId, res.characteristics[0].uuid,
						// 	'AT+QSTAAPINFODEF=yang,yangzhuyuan')
						// }, 2000);


						// for (let i = 0; i < res.characteristics.length; i++) {
						// 	let item = res.characteristics[i]
						// 	if (item.properties.read) {
						// 		uni.readBLECharacteristicValue({
						// 			deviceId: deviceId,
						// 			serviceId: serviceId,
						// 			characteristicId: item.uuid,
						// 			success(res_read) {
						// 				console.log('读取低功耗蓝牙设备的特征值的二进制数据值', res_read)
						// 				that.sendATCommand(deviceId, serviceId, item.uuid,
						// 					'AT+QSTAAPINFO=' + 'Jakob' + "," + 'CW08812023' +
						// 					"\0\r\n")
						// 			}
						// 		})
						// 	}
						// if (item.properties.write) {
						// 	// this.setData({
						// 	// 	canWrite: true
						// 	// })
						// 	this._deviceId = deviceId
						// 	this._serviceId = serviceId
						// 	this._characteristicId = item.uuid
						// }




						// }
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
				// that.datassss()
			},

			//通过蓝牙发送AT命令的接口
			sendATCommand(deviceId, serviceId, uuid, senddata) {
				// 向蓝牙设备发送一个0x00的16进制数据
				let buffer = new ArrayBuffer(senddata.length)
				let dataView = new DataView(buffer)
				console.log("senddatalength", senddata.length)
				for (var i = 0; i < senddata.length; i++) {
					dataView.setUint8(i, senddata.charAt(i).charCodeAt())
				}

				console.log("发送 _deviceId：" + deviceId)
				console.log("发送_serviceId：" + serviceId)
				console.log("发送_characteristicId：" + uuid)
				console.log("发送_value：" + this.ab2hex(buffer))
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					writeType: "writeNoResponse",
					success(res) {
						console.log('向低功耗蓝牙设备特征值中写入二进制数据', res)
					},
					fail: function(res) {
						console.log('失败', res)
					}
				})
			},



			checked() {
				if (this.cb == true) {
					this.cb = false
				} else {
					this.cb = true
				}
			},

			btn_next() {
				if (this.cb == false) {
					uni.showToast({
						title: "是否准备就绪",
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: '../Bing_xueya/lanyashebe'
				})
			},

		}
	}
</script>

<style>
	.btn {
		margin: 60rpx 40rpx 0 40rpx;
		border-radius: 50rpx;
		background: #3298F7;
		color: white;
	}

	.text {
		text-align: center;
		margin-top: 40rpx;
		color: deepskyblue;
		font-size: 28rpx;
	}

	.popup_bg {
		background: white;
		margin: 30rpx;
		border-radius: 50rpx;
		padding: 40rpx;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 38rpx;
		text-align: center;
		margin-top: 10rpx;
	}
</style>