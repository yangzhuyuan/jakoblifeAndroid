<template>
	<view style="color: #000000;width: 100vw;height: 100vh;">
		<view style="display: flex; flex-direction: column;">
			<view style="margin: 20px 0 0 20px; font-size: 12px; color: #969799">{{$t('请勿连接名称前有5G的WIFI')}}</view>
			<view class="shebeistyle">
				<image style="padding: 20px;" :src="SELECT_TYPE === '0' ? imagess:imagess1"></image>
			</view>
			<view style="margin: 20px 20px 0 20px;">
				<view class="input_style">
					<view style="font-weight: 400;font-size: 16px;color: #000000;">WIFI:</view>

					<view style="width: 80vw;" v-if="shouji">
						<uni-combox :border="false" :candidates="candidates" :placeholder="$t('请选择wifi')"
							v-model="wifi_name"></uni-combox>
					</view>
					<view v-else style="width: 80vw; margin-left: 20px;" @click="open()">
						{{wifi_name}}
					</view>
				</view>
			</view>
			<view style="margin: 20px 20px 0 20px;">
				<view class="input_style">
					<view style="font-weight: 400;font-size: 16px; color: #000000;">{{$t('WIFI密码')}}</view>
					<input type="password" style="margin-left: 10px;" v-model="wifi_password"
						:placeholder="$t('请输入wifi密码')" />
				</view>
			</view>
			<!-- <view style="position: fixed;bottom: 40px;width: 100vw;"> -->
			<button class="btn" @click="btn_start()">{{$t('开始连接')}}</button>
			<!-- </view> -->
			<!-- <scroll-view class="log" scroll-y>
				<view v-for="(l,i) in logs" :key="i" class="log-item">
					log：{{l}}
				</view>
			</scroll-view> -->

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logs: [],
				sn: '',
				SELECT_TYPE: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png',
				wifi_name: '',
				wifi_password: '',
				deviceId: '',
				serviceId: '',
				uuid: '',
				shouji: '',
				wifiArray: [], // 存储WiFi列表
				candidates: [],
				modelId: ''

			}
		},

		onLoad(res) {
			this.sn = res.sn
			this.SELECT_TYPE = res.SELECT_TYPE
			this.deviceId = res.deviceId
			this.serviceId = res.serviceId
			this.uuid = res.uuid
			this.modelId = res.modelId
			// console.log("res", JSON.stringify(res))
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('为设备连接WiFi')
			})
			this.wifi()

		},


		methods: {
			//日志
			log(...a) {
				this.logs.unshift(`[${new Date().toLocaleTimeString()}] ${a.map(v => JSON.stringify(v)).join(' ')}`);
			},

			//通过蓝牙发送AT命令的接口
			sendATCommand(deviceId, serviceId, uuid, senddata) {
				let that = this
				// 向蓝牙设备发送一个0x00的16进制数据
				let buffer = new ArrayBuffer(senddata.length)
				let dataView = new DataView(buffer)
				for (var i = 0; i < senddata.length; i++) {
					dataView.setUint8(i, senddata.charAt(i).charCodeAt())
				}
				console.log("发送 _deviceId：" + deviceId)
				console.log("发送_serviceId：" + serviceId)
				console.log("发送_characteristicId：" + uuid)
				console.log("发送_value：" + that.ab2hex(buffer))
				// that.log('发送 _deviceId', deviceId)
				// that.log('发送_serviceId', serviceId)
				// that.log('发送_characteristicId', uuid)
				// that.log('1发送_value', senddata)
				// that.log('2发送_value', that.ab2hex(buffer))
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					writeType: "writeNoResponse",
					success(res) {
						// that.log('向低功耗蓝牙设备成功', res)
						// that.getBLEDeviceCharacteristics(deviceId, serviceId,that.sn, deviceId, that.modelId)
						that.bind_device(that.sn, deviceId, that.modelId)
					},
					fail: function(errrore) {
						// that.log('向低功耗蓝牙设备失败', errrore)
						console.log('失败', errrore)
						uni.navigateTo({
							url: "../Bing_page/Bind_fail?bindcode=0"
						})
					}
				})
			},
			// //获取蓝牙外围设备的特征值
			// getBLEDeviceCharacteristics(deviceId, serviceId, sn, MACdeviceID, modelId) {
			// 	let that = this
			// 	uni.getBLEDeviceCharacteristics({
			// 		deviceId: deviceId,
			// 		serviceId: serviceId,
			// 		success: (res) => {
			// 			console.log('获取蓝牙设备某个服务中所有特征值(characteristic)', res.characteristics)
			// 			for (let i = 0; res.characteristics.length > i; i++) {
			// 				let item = res.characteristics[i]
			// 				//蓝牙消息通知
			// 				if (item.properties.notify) {
			// 					uni.notifyBLECharacteristicValueChange({
			// 						state: true, // 启用 notify 功能
			// 						deviceId: deviceId,
			// 						serviceId: serviceId,
			// 						characteristicId: item.uuid,
			// 						success: (notifyres) => {
			// 							that.onBLECharacteristicValueChange3(sn, MACdeviceID,
			// 								modelId);
			// 						},
			// 						fail: (notifyerr) => {}
			// 					})
			// 				}
			// 			}
			// 		},
			// 		fail(res) {
			// 			console.error('getBLEDeviceCharacteristics', res)
			// 		}
			// 	})
			// },
			// onBLECharacteristicValueChange3(sn, MACdeviceID, modelId) {
			// 	let that = this
			// 	uni.onBLECharacteristicValueChange((res) => {
			// 		console.log("蓝牙没收到的数据", that.ab2hex(res.value))
			// 		that.bind_device(sn, MACdeviceID, modelId)
			// 	})
			// },
			//设备绑定
			bind_device(sn, MACdeviceID, modelId) {
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				}
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(bind_device => {
					if (bind_device.code == 200) {
						uni.setStorageSync("deviceSn", sn)
						uni.navigateTo({
							url: "../Bing_page/Bind_success?modelId=" + modelId
						})
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail?bindcode=" + bind_device.code
						})
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
			wifi() {
				let that = this
				uni.startWifi({
					success(res) {
						console.log("res", res)
					}
				})
				if (uni.getSystemInfoSync().platform === "android") {
					that.shouji = true
					let aaa = that.getWiFiIP()
					let uniqueArr = aaa.filter((item, index, self) => {
						return self.findIndex(t => t.name === item.name) === index;
					});
					for (let a = 0; uniqueArr.length > a; a++) {
						that.candidates.push(uniqueArr[a].name)
					}
				} else {
					that.shouji = false
					// var UIApplication = plus.ios.import("UIApplication");  
					// var NSURL = plus.ios.import("NSURL");  
					// var setting = NSURL.URLWithString("app-settings:");  
					// var application = UIApplication.sharedApplication();  
					// application.openURL(setting);  
					// plus.ios.deleteObject(setting);  
					// plus.ios.deleteObject(application);
					uni.getConnectedWifi({
						success(resd) {
							console.log("获取已连接的Wi-Fi信息", resd)
							that.wifi_name = resd.wifi.SSID
						}
					})
				}
			},
			open() {
				plus.runtime.openURL("prefs:root=WIFI"); //打开wifi设置页面
			},
			getWiFiIP() {
				// MainActivity
				var MainActivity = plus.android.runtimeMainActivity()
				// Context
				var Context = plus.android.importClass('android.content.Context')
				// WiFi 相关包  
				plus.android.importClass("android.net.wifi.WifiManager")
				plus.android.importClass("android.net.wifi.WifiInfo")
				plus.android.importClass("android.net.wifi.ScanResult")
				plus.android.importClass("java.util.ArrayList")
				// WiFi 管理实例
				var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)
				// 开启 WiFi
				// wifiManager.setWifiEnabled(true)
				// 当前连接 WiFi 信息 
				var wifiInfo = wifiManager.getConnectionInfo()
				// console.log(wifiInfo.toString()) //打印当前连接 WiFi 的所有信息
				var wifirssi = wifiInfo.getRssi() // 获取当前链接 WiFi 的信号强度
				// console.log(wifirssi) //打印 WiFi 的信号强度
				var ssid = wifiInfo.getSSID() // 获取当前 WIFI 连接的 SSID (WIFI 名称)  
				ssid = ssid.replace(/(^\"*)|(\"*$)/g, "")
				// console.log(ssid) //打印 WIFI 名称
				// console.log(ssid + "," + "信号强度:" + wifirssi)
				//注意 getConnectionInfo() 与 getScanResults() 的区别
				var resultList = wifiManager.getScanResults(), //扫描得到的wifi信号集合
					len = resultList.size()
				var wifiScanResults = '' //定义wifiScanResults
				// console.log(resultList)
				//注:获取resultList中的场强信息用的是 level 而不是 RSSI
				for (var i = 0; i < len; i++) {
					// console.log(resultList.get(i).plusGetAttribute('SSID') + " 信号：" + resultList.get(i).plusGetAttribute(
					// 	'level'))
					//将每一个ssid与rssi 都添加到wifiArray数组中，用于绑定显示，根据个人业务取舍 wifiArray=[{name:WiFi的SSID}]
					let oneWiFi = {
						name: resultList.get(i).plusGetAttribute('SSID'),
						signal: resultList.get(i).plusGetAttribute('level')
					}
					this.wifiArray.push(oneWiFi);
					// wifiScanResults = wifiScanResults + ',' + this.wifiArray[i].name + ' 信号:' + this.wifiArray[i].signal +
					// 	"\n"; //打印内容
				}
				return this.wifiArray //返回
			},
			btn_start() {
				let that = this
				if (that.wifi_name == that.$t("请选择wifi") || that.wifi_name == "") {
					uni.showToast({
						title: that.$t("请选择或者输入一个wifi"),
						icon: 'none'
					})
					return
				} else if (that.wifi_password == "") {
					uni.showToast({
						title: that.$t("请输入wifi密码"),
						icon: 'none'
					})
					return
				} else {
					that.sendATCommand(that.deviceId, that.serviceId, that.uuid,
						'AT+QSTAAPINFODEF=' + that.wifi_name + ',' + that.wifi_password)
				}
			}
		}
	}
</script>

<style>
	.shebeistyle {
		display: flex;
		width: auto;
		margin: 40px 20px 20px 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
	}

	.input_style {
		padding: 10px;
		border-bottom: 1px solid gainsboro;
		margin-right: 20px;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.btn {
		width: auto;
		margin: 40px 20px 88px 20px;
		border-radius: 100px;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #3298F7;
		color: white;
	}

	.log {
		height: 300px;
		background: #f5f5f5;
		font-size: 24rpx;
	}
</style>