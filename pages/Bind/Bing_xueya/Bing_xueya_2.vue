<template>
	<view style="color: black;width: 100vw;height: 100vh;">
		<view style="display: flex; flex-direction: column;">
			<view style="margin: 15px 0 0 15px; font-size: 14px; color: gray;">{{$t('BDSBitem.title_18')}}</view>

			<view style="width: auto;margin: 20px; background: white; border-radius: 10px;padding: 20px;">
				<image style="width: 100%;" :src="imagess"></image>
			</view>
			<view style="margin: 15px 0 0 15px;">
				<view class="input_style">
					<view style="font-weight: bold;">WIFI:</view>

					<view style="width: 80vw;" v-if="shouji">
						<uni-combox :border="false" :candidates="candidates" placeholder="请选择wifi"
							v-model="wifi_name"></uni-combox>
					</view>
					<view v-else style="width: 80vw; margin-left: 20px;" @click="open()">
						{{wifi_name}}
					</view>
				</view>
			</view>
			<view style="margin: 15px 0 0 15px;">
				<view class="input_style">
					<view style="font-weight: bold;">{{$t('BDSBitem.title_19')}}</view>
					<input type="password" style="margin-left: 10px;" v-model="wifi_password"
						:placeholder="$t('BDSBitem.title_20')" />
				</view>
			</view>
			<view style="position: fixed;bottom: 40px;width: 100vw;">
				<button class="btn" @click="btn_start()">{{$t('BDSBitem.title_21')}}</button>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				candidates: []

			}
		},

		onLoad(res) {
			this.deviceId = res.deviceId
			this.serviceId = res.serviceId
			this.uuid = res.uuid
		},

		onShow() {

			uni.setNavigationBarTitle({
				title: this.$t('BDSBitem.title_17')
			})


			this.wifi()



		},


		methods: {


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
						uni.navigateTo({
							url: '../Bing_page/Bind_success'
						})

					},
					fail: function(res) {
						console.log('失败', res)
						uni.navigateTo({
							url: '../Bing_page/Bind_fail'
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
			
			open(){
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
				if (that.wifi_name == "请选择wifi" || that.wifi_name == "") {
					uni.showToast({
						title: "请选择或者输入一个wifi",
						icon: 'none'
					})
					return
				} else if (that.wifi_password == "") {
					uni.showToast({
						title: "请输入wifi密码",
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
	.input_style {
		padding: 10px;
		border-bottom: 1px solid gainsboro;
		margin-right: 20px;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.btn {
		margin: 60px 40px 0 40px;
		border-radius: 50rpx;
		background: #3298F7;
		color: white;
	}
</style>