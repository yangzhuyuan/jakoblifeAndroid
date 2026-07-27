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
					<view style="width: 80vw;" v-if="shouji" @click="openWifiPopup()">
						<text v-if="wifi_name" class="wifi-select-text">{{formatWifiName(wifi_name)}}</text>
						<text v-else class="wifi-select-placeholder">{{$t('请选择wifi')}}</text>
					</view>
					<view v-else style="width: 80vw; margin-left: 20px;" @click="open()">
						{{formatWifiName(wifi_name)}}
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
			<button class="btn" @click="btn_start()">{{$t('开始连接')}}</button>
		</view>
		<uni-popup ref="wifiPopup" type="center" :mask-click="true">
			<view class="wifi-popup">
				<view class="wifi-popup-title">{{$t('请选择wifi')}}</view>
				<scroll-view scroll-y class="wifi-popup-list">
					<view v-for="(item, index) in candidates" :key="index" class="wifi-popup-item"
						@click="selectWifi(item)">
						{{formatWifiName(item)}}
					</view>
					<view v-if="candidates.length === 0" class="wifi-popup-empty">{{$t('请选择wifi')}}</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getLocalTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'
	export default {
		data() {
			return {
				sn: '',
				SELECT_TYPE: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png',
				wifi_name: '',
				wifi_password: '',
				deviceId: '',
				serviceId: '',
				notifyuuid: '',
				uuid: '',
				shouji: '',
				wifiArray: [], // 存储WiFi列表
				candidates: [],
				modelId: '',
				WIFITYPE: false,
			}
		},

		onLoad(res) {
			this.sn = res.sn
			this.SELECT_TYPE = res.SELECT_TYPE
			this.deviceId = res.deviceId
			this.serviceId = res.serviceId
			this.notifyuuid = res.notifyuuid
			this.uuid = res.uuid
			this.modelId = res.modelId
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('为设备连接WiFi')
			})
			this.wifi()
		},


		methods: {
			//通过蓝牙发送AT命令的接口
			sendATCommand(deviceId, serviceId, uuid, senddata, notifyuuid) {
				let that = this
				// 向蓝牙设备发送一个0x00的16进制数据
				let buffer = new ArrayBuffer(senddata.length)
				let dataView = new DataView(buffer)
				for (var i = 0; i < senddata.length; i++) {
					dataView.setUint8(i, senddata.charAt(i).charCodeAt())
				}
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					writeType: "writeNoResponse",
					success(res) {
						setTimeout(() => {
							that.notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid)
						}, 1000)
					},
					fail: function(errrore) {
						console.log('失败', errrore)
						if (!that.WIFITYPE) {
							that.WIFITYPE = true
							that.getunbind(that.sn)
							setTimeout(() => {
								uni.navigateTo({
									url: "../Bing_page/Bind_fail?bindcode=0"
								})
							}, 1000)
						}
					},
				})
			},


			notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid) {
				let that = this
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: notifyuuid,
					success: (notifyres) => {
						that.onBLEValue(deviceId, serviceId, uuid, notifyuuid)
					},
					fail: (notifyerr) => {}
				})
			},
			onBLEValue(deviceId, serviceId, uuid, notifyuuid) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					let hexData = that.ab2hex(res.value)
					let asciiString = that.hexToAscii(hexData)
					if (asciiString === "+QSTASTAT:WLAN_DISCONNECTED\r\n" || asciiString.includes(
							"WLAN_DISCONNECTED")) {
						if (!that.WIFITYPE) {
							that.WIFITYPE = true
							that.getunbind(that.sn)
							setTimeout(() => {
								uni.navigateTo({
									url: "../Bing_page/Bind_fail?bindcode=0"
								})
							}, 1000)
						}
					} else if (asciiString === "+QSTASTAT:WLAN_CONNECTED\r\n" || asciiString.includes(
							"WLAN_CONNECTED")) {
						let buffertime = that.toArrayBuffer("74696d6540" + that.getTimeAllJSON().YMDHMSWIFI)
						uni.writeBLECharacteristicValue({
							deviceId: deviceId,
							serviceId: serviceId,
							characteristicId: uuid,
							value: buffertime,
							writeType: "writeNoResponse",
							success(res) {
								that.bind_device(that.sn, deviceId, that.modelId)
							},
							fail: function(errrore) {
								if (!that.WIFITYPE) {
									that.WIFITYPE = true
									that.getunbind(that.sn)
									setTimeout(() => {
										uni.navigateTo({
											url: "../Bing_page/Bind_fail?bindcode=0"
										})
									}, 1000)
								}
							}
						})
					}
				})
			},
			getunbind(deviceSn) {
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
			hexToAscii(hexString) {
				let str = '';
				for (let i = 0; i < hexString.length; i += 2) {
					let hex = hexString.substr(i, 2);
					str += String.fromCharCode(parseInt(hex, 16));
				}
				return str;
			},
			//通用时间（跟随设备时区）
			getTimeAllJSON() {
				return getLocalTimeAllJSON()
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
						return item.name && String(item.name).trim() &&
							self.findIndex(t => t.name === item.name) === index;
					});
					for (let a = 0; uniqueArr.length > a; a++) {
						that.candidates.push(uniqueArr[a].name)
					}
				} else {
					that.shouji = false
					uni.getConnectedWifi({
						success(resd) {
							that.wifi_name = resd.wifi.SSID
						}
					})
				}
			},
			open() {
				plus.runtime.openURL("prefs:root=WIFI"); //打开wifi设置页面
			},
			openWifiPopup() {
				this.$refs.wifiPopup.open('center')
			},
			formatWifiName(name) {
				if (!name || !String(name).trim()) {
					return this.$t('未知网络')
				}
				return name
			},
			selectWifi(name) {
				this.wifi_name = name
				this.$refs.wifiPopup.close()
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
				var wifirssi = wifiInfo.getRssi() // 获取当前链接 WiFi 的信号强度
				var ssid = wifiInfo.getSSID() // 获取当前 WIFI 连接的 SSID (WIFI 名称)  
				ssid = ssid.replace(/(^\"*)|(\"*$)/g, "")
				//注意 getConnectionInfo() 与 getScanResults() 的区别
				var resultList = wifiManager.getScanResults(), //扫描得到的wifi信号集合
					len = resultList.size()
				var wifiScanResults = '' //定义wifiScanResults
				//注:获取resultList中的场强信息用的是 level 而不是 RSSI
				for (var i = 0; i < len; i++) {
					//将每一个ssid与rssi 都添加到wifiArray数组中，用于绑定显示，根据个人业务取舍 wifiArray=[{name:WiFi的SSID}]
					let oneWiFi = {
						name: resultList.get(i).plusGetAttribute('SSID'),
						signal: resultList.get(i).plusGetAttribute('level')
					}
					this.wifiArray.push(oneWiFi);
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
						'AT+QSTAAPINFODEF=' + that.wifi_name + ',' + that.wifi_password, that.notifyuuid)
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


	.wifi-select-text {
		margin-left: 10px;
		font-size: 14px;
		color: #333;
	}

	.wifi-select-placeholder {
		font-size: 14px;
		font-weight: 600;
		margin-left: 10px;
		color: #999;
	}

	.wifi-popup {
		margin: 15px;
		width: calc(100vw - 30px);
		box-sizing: border-box;
		background: #fff;
		border-radius: 12px;
		overflow: hidden;
	}

	.wifi-popup-title {
		padding: 16px;
		font-size: 16px;
		font-weight: 500;
		text-align: center;
		color: #000;
		border-bottom: 1px solid #eee;
	}

	.wifi-popup-list {
		max-height: 50vh;
	}

	.wifi-popup-item {
		padding: 14px 16px;
		font-size: 15px;
		color: #333;
		border-bottom: 1px solid #f0f0f0;
	}

	.wifi-popup-item:last-child {
		border-bottom: none;
	}

	.wifi-popup-empty {
		padding: 20px 16px;
		text-align: center;
		font-size: 14px;
		color: #999;
	}
</style>