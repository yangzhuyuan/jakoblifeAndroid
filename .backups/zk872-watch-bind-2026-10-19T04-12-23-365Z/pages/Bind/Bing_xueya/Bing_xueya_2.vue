<template>
	<view style="color: #000000;width: 100vw;height: 100vh;">
		<!-- <view class="bp-log-panel">
			<view class="bp-log-header">
				<text class="bp-log-title">调试日志(历史/实时/qxBle)</text>
				<view class="bp-log-header-actions">
					<text class="bp-log-copy-btn" @click.stop="copyBpLogs">一键复制</text>
					<text class="bp-log-clear-btn" @click.stop="clearBpLogs">一键清除</text>
				</view>
			</view>
			<scroll-view scroll-y class="bp-log-content" @click="copyBpLogs">
				<text class="bp-log-text">{{ bpLogText || '暂无日志' }}</text>
			</scroll-view>
		</view> -->
		<view style="display: flex; flex-direction: column;">
			<view style="margin: 20px 0 0 20px; font-size: 12px; color: #EE0A24">{{$t('请勿连接名称前有5G的WIFI')}}</view>
			<view style="margin: 6px 20px 0 20px; font-size: 12px; color: #EE0A24">{{$t('只支持24GWiFi请连接')}}</view>
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
			<button class="btn" :disabled="wifiConnecting" @click="btn_start()">{{wifiButtonText}}</button>
		</view>
		<uni-popup ref="wifiPopup" type="center" :mask-click="true">
			<view class="wifi-popup">
				<view class="wifi-popup-header">
					<view class="wifi-popup-title">{{$t('请选择wifi')}}</view>
					<button class="wifi-popup-refresh" :disabled="wifiListRefreshing" @click.stop="refreshWifiList">
						{{wifiListRefreshing ? wifiListRefreshSeconds + 's' : $t('刷新')}}
					</button>
				</view>
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
				wifiListRefreshing: false,
				wifiListRefreshSeconds: 0,
				wifiListRefreshCancel: null,
				modelId: '',
				WIFITYPE: false,
				wifiConnecting: false,
				wifiAttemptId: 0,
				wifiAtSent: false,
				wifiCommand: '',
				// 已完成配网后，绑定接口重试无需再发 AT。
				configuredWifiCommand: '',
				configuredWifiDeviceId: '',
				wifiFlowTimer: null,
				timeSyncTimer: null,
				bindTimer: null,
				bindRequestTask: null,
				bleNotifyResumeTimer: null,
				bleValueHandler: null,
				bleNotifyTimer: null,
				bleDisconnectWaiting: false,
				bleValueListening: false,
				/** 已收到连接成功或失败，不再处理后续上报 */
				bleValueHandled: false,
				/** 设备管理页重设 WiFi：失败不解绑、成功不走绑定页 */
				fromManage: false,
				/** Android 默认无响应写入，iOS 默认有响应写入 */
				preferredWriteType: '',
				/** 写 AT 超时定时器 */
				bleWriteTimer: null,
				bpDebugLogs: [], //页面日志
			}
		},


		onLoad(res) {
			this.sn = res.sn ? decodeURIComponent(res.sn) : ''
			this.SELECT_TYPE = res.SELECT_TYPE
			this.deviceId = res.deviceId ? decodeURIComponent(res.deviceId) : ''
			this.serviceId = res.serviceId ? decodeURIComponent(res.serviceId) : ''
			this.notifyuuid = res.notifyuuid ? decodeURIComponent(res.notifyuuid) : ''
			this.uuid = res.uuid ? decodeURIComponent(res.uuid) : ''
			this.preferredWriteType = this.getPlatformWriteType()
			if (this.preferredWriteType === 'write' && res.writeTypeHint === 'writeNoResponse') {
				this.preferredWriteType = 'writeNoResponse'
			}
			this.modelId = res.modelId ? decodeURIComponent(res.modelId) : ''
			this.fromManage = res.fromManage === '1' || res.fromManage === 1 || res.fromManage === true
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('为设备连接WiFi')
			})
			this.wifi()
		},

		computed: {
			wifiButtonText() {
				if (this.wifiConnecting) {
					return this.$t(this.WIFITYPE && !this.fromManage ? '绑定设备' : '连接中')
				}
				const retryBinding = !this.fromManage && this.configuredWifiDeviceId === this.deviceId &&
					this.configuredWifiCommand === this.buildWifiAtCommand()
				return this.$t(retryBinding ? '重新绑定' : '开始连接')
			},
			bpLogText() {
				return this.bpDebugLogs.map(log => `[${log.time}] ${log.text}`).join('\n');
			},
		},

		onUnload() {
			if (this.wifiListRefreshCancel) this.wifiListRefreshCancel()
			this.wifiAttemptId += 1
			this.wifiConnecting = false
			this.WIFITYPE = true
			this.bleValueHandled = true
			this.clearWifiTimers()
			this.stopBleValueListener()
			if (this.bindRequestTask) this.bindRequestTask.abort()
			this.bindRequestTask = null
			uni.hideLoading()
		},


		methods: {
			isWifiAttemptActive(attemptId) {
				return this.wifiConnecting && this.wifiAttemptId === attemptId
			},
			isWaitingForWifi(attemptId) {
				return this.isWifiAttemptActive(attemptId) && !this.WIFITYPE && !this.bleValueHandled
			},
			clearWifiTimers() {
				this.clearBleWriteTimer()
				this.clearBleNotifyTimer()
				this.clearBleNotifyResumeTimer()
				for (const key of ['wifiFlowTimer', 'timeSyncTimer', 'bindTimer']) {
					if (this[key]) clearTimeout(this[key])
					this[key] = null
				}
			},
			stopBleValueListener() {
				if (this.bleValueHandler && typeof uni.offBLECharacteristicValueChange === 'function') {
					uni.offBLECharacteristicValueChange(this.bleValueHandler)
				}
				this.bleValueHandler = null
				this.bleValueListening = false
			},

			formatLogMsg(value) {
				if (value === undefined) return '';
				if (value === null) return 'null';
				if (typeof value === 'object') {
					try {
						return JSON.stringify(value);
					} catch (e) {
						return String(value);
					}
				}
				return String(value);
			},
			addlog(...args) {
				const text = args.map(p => this.formatLogMsg(p)).join(' ');
				const time = new Date().toLocaleTimeString();
				this.bpDebugLogs.push({
					time,
					text
				});
				const maxLogs = 300;
				if (this.bpDebugLogs.length > maxLogs) {
					this.bpDebugLogs.splice(0, this.bpDebugLogs.length - maxLogs);
				}
				console.log(...args);
			},

			copyBpLogs() {
				const text = this.bpLogText;
				if (!text) {
					uni.showToast({
						title: '暂无日志',
						icon: 'none'
					});
					return;
				}
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					},
					fail: () => {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						});
					}
				});
			},
			clearBpLogs() {
				if (!this.bpDebugLogs.length) {
					uni.showToast({
						title: '暂无日志',
						icon: 'none'
					});
					return;
				}
				this.bpDebugLogs = [];
				uni.showToast({
					title: '已清除',
					icon: 'success'
				});
			},

			buildWifiAtCommand() {
				const ssid = String(this.wifi_name || '').trim()
				const pwd = String(this.wifi_password || '')
				// 保留当前命令格式：有密码时以 CR/LF 结束。
				if (!pwd) {
					return 'AT+QSTAAPINFODEF=' + ssid.trim()
				} else {
					return 'AT+QSTAAPINFODEF=' + ssid.trim() + ',' + pwd.trim()
				}
			},
			clearBleWriteTimer() {
				if (this.bleWriteTimer) {
					clearTimeout(this.bleWriteTimer)
					this.bleWriteTimer = null
				}
			},
			armBleWriteTimer(onTimeout) {
				this.clearBleWriteTimer()
				this.bleWriteTimer = setTimeout(() => {
					this.bleWriteTimer = null
					console.log('发送AT命令超时')
					if (typeof onTimeout === 'function') onTimeout()
				}, 15000)
			},
			getPlatformWriteType() {
				return uni.getSystemInfoSync().platform === 'android' ? 'writeNoResponse' : 'write'
			},
			getBleWriteTypes() {
				return [this.preferredWriteType || this.getPlatformWriteType()]
			},
			//通过蓝牙发送AT命令的接口
			sendATCommand(deviceId, serviceId, uuid, senddata, notifyuuid) {
				let that = this
				const attemptId = that.wifiAttemptId
				if (!that.isWaitingForWifi(attemptId)) return
				that.addlog('发送AT命令所有服务值和数据:', deviceId, serviceId, uuid, senddata, notifyuuid)
				// 向蓝牙设备发送一个0x00的16进制数据
				let buffer = new ArrayBuffer(senddata.length)
				let dataView = new DataView(buffer)
				for (var i = 0; i < senddata.length; i++) {
					dataView.setUint8(i, senddata.charAt(i).charCodeAt())
				}
				that.addlog('发送AT命令16进制:', that.ab2hex(buffer))
				const finishWriteFail = () => {
					if (!that.isWaitingForWifi(attemptId)) return
					that.clearBleWriteTimer()
					that.handleWifiSetFail()
				}
				// App 的 properties 不一定提供 writeNoResponse；不能把缺失字段当成不支持。
				const types = that.getBleWriteTypes()
				const maxWriteTimes = types.length
				let typeIndex = 0
				const tryWrite = () => {
					if (!that.isWaitingForWifi(attemptId)) return
					if (typeIndex >= maxWriteTimes) {
						finishWriteFail()
						return
					}
					const writeType = types[typeIndex++]
					const options = {
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: uuid,
						value: buffer,
						success(res) {
							if (!that.isWifiAttemptActive(attemptId) || that.WIFITYPE) return
							that.preferredWriteType = writeType
							if (!that.isWaitingForWifi(attemptId)) return
							that.clearBleWriteTimer()
							that.addlog("1发送AT命令成功", res, 'writeType', writeType || '(auto)')
							that.addlog('写入接口已完成，等待设备通过notify返回AT应答')
							that.addlog("2发送AT命令成功", senddata)
						},
						fail: function(errrore) {
							if (!that.isWaitingForWifi(attemptId)) return
							that.addlog('1发送AT命令失败', errrore)
							that.addlog("2发送AT命令失败", senddata)
							const code = errrore && (errrore.errCode != null ? errrore.errCode : errrore.code)
							if (Number(code) === 10007 && typeIndex < maxWriteTimes) {
								that.addlog('当前写入模式不支持，切换重试', writeType || '(auto)', '->', types[typeIndex] ||
									'(auto)')
								tryWrite()
								return
							}
							finishWriteFail()
						}
					}
					if (writeType) {
						options.writeType = writeType
					}
					that.wifiAtSent = true
					that.addlog('尝试发送AT命令', 'writeType', writeType || '(auto)', '字节数', buffer.byteLength)
					uni.writeBLECharacteristicValue(options)
				}
				const startWrite = () => {
					if (!that.isWaitingForWifi(attemptId)) return
					that.armBleWriteTimer(finishWriteFail)
					that.armBleNotifyTimer()
					tryWrite()
				}
				// 两个入口都先准备接收回包；fromManage 只决定后续绑定或返回管理页。
				that.addlog('配网入口:', that.fromManage ? '设备管理重配' : '首次绑定', '先开启蓝牙通知，监听就绪后再发送AT')
				that.notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid, startWrite)
			},
			normalizeBleId(id) {
				return String(id || '').trim().toUpperCase()
			},
			isVendorWifiService(uuid) {
				return this.normalizeBleId(uuid).indexOf('0000FFFF') === 0
			},
			/** 与绑定页 lanya_wifi 一致：最后一个可写特征、最后一个通知特征 */
			pickCharsFromList(characteristics) {
				let uuid = ''
				let notifyuuid = ''
				let writeTypeHint = this.getPlatformWriteType()
				const list = characteristics || []
				for (let i = 0; i < list.length; i++) {
					const c = list[i]
					const props = c.properties || {}
					this.addlog('ble char原始属性', c.uuid, props)
					if (props.write || props.writeNoResponse) {
						uuid = c.uuid
						writeTypeHint = this.getPlatformWriteType() === 'writeNoResponse' || !props.write ?
							'writeNoResponse' : 'write'
					}
					if (props.notify || props.indicate) {
						notifyuuid = c.uuid
					}
				}
				return {
					uuid,
					notifyuuid,
					writeTypeHint
				}
			},
			ensureBleSession(deviceId) {
				const that = this
				return new Promise((resolve) => {
					uni.createBLEConnection({
						deviceId,
						timeout: 8000,
						complete: () => resolve()
					})
				})
			},
			getCharacteristicsAsync(deviceId, serviceId) {
				return new Promise((resolve) => {
					uni.getBLEDeviceCharacteristics({
						deviceId,
						serviceId,
						success: (res) => resolve((res && res.characteristics) || []),
						fail: () => resolve([])
					})
				})
			},
			getServicesAsync(deviceId) {
				return new Promise((resolve) => {
					uni.getBLEDeviceServices({
						deviceId,
						success: (res) => resolve((res && res.services) || []),
						fail: () => resolve([])
					})
				})
			},
			/**
			 * 与绑定页一致：只写厂商服务 0000FFFF（也就是 services[2]）。
			 * 00001801/00002B29 是标准 GATT 特征，不能用来发 AT。
			 */
			async resolveBleWriteTarget(deviceId) {
				const services = await this.getServicesAsync(deviceId)
				let serviceId = ''
				for (let i = 0; i < services.length; i++) {
					const uuid = services[i] && services[i].uuid
					if (this.isVendorWifiService(uuid)) {
						serviceId = uuid
						break
					}
				}
				if (!serviceId && services[2] && services[2].uuid && !this.normalizeBleId(services[2].uuid)
					.startsWith('000018')) {
					serviceId = services[2].uuid
				}
				if (!serviceId) {
					console.log('resolveBleWriteTarget 未找到厂商服务', services.map(s => s && s.uuid))
					return null
				}
				const chars = await this.getCharacteristicsAsync(deviceId, serviceId)
				const picked = this.pickCharsFromList(chars)
				console.log('resolveBleWriteTarget', serviceId, picked)
				if (!picked.uuid) return null
				return {
					serviceId,
					uuid: picked.uuid,
					notifyuuid: picked.notifyuuid || picked.uuid,
					writeTypeHint: picked.writeTypeHint
				}
			},
			/**
			 * 不设置 MTU 时默认载荷只有 20 字节。
			 * 长数据按 20 字节顺序写入，沿用配网时选出的写入方式。
			 */
			writeBleCharacteristicValue(deviceId, serviceId, characteristicId, value, callbacks) {
				const CHUNK = 20
				const bytes = value ? new Uint8Array(value) : new Uint8Array(0)
				const chunks = []
				for (let i = 0; i < bytes.length; i += CHUNK) {
					const slice = bytes.subarray(i, Math.min(i + CHUNK, bytes.length))
					const buf = new ArrayBuffer(slice.length)
					new Uint8Array(buf).set(slice)
					chunks.push(buf)
				}
				if (!chunks.length) {
					if (callbacks && callbacks.success) callbacks.success({})
					return
				}
				const that = this
				const types = that.getBleWriteTypes()
				const isActive = () => !callbacks || !callbacks.isActive || callbacks.isActive()
				let chunkIndex = 0
				let typeIndex = 0
				let settledType = null
				const tryWrite = () => {
					if (!isActive()) return
					if (chunkIndex >= chunks.length) {
						if (callbacks && callbacks.success) {
							callbacks.success({
								errMsg: 'writeBLECharacteristicValue:ok'
							})
						}
						return
					}
					const writeType = settledType != null ? settledType : types[typeIndex]
					const options = {
						deviceId,
						serviceId,
						characteristicId,
						value: chunks[chunkIndex],
						success() {
							if (!isActive()) return
							that.preferredWriteType = writeType
							if (settledType == null) settledType = writeType
							chunkIndex += 1
							typeIndex = 0
							if (chunkIndex >= chunks.length) {
								if (callbacks && callbacks.success) {
									callbacks.success({
										errMsg: 'writeBLECharacteristicValue:ok'
									})
								}
								return
							}
							setTimeout(tryWrite, 30)
						},
						fail(err) {
							if (!isActive()) return
							const code = err && (err.errCode != null ? err.errCode : err.code)
							const is10007 = code === 10007 || code === '10007'
							that.addlog('writeBLE尝试失败', writeType || '(auto)', (chunkIndex + 1) + '/' + chunks
								.length, err)
							if (settledType == null && is10007 && typeIndex + 1 < types.length) {
								typeIndex += 1
								tryWrite()
								return
							}
							if (callbacks && callbacks.fail) callbacks.fail(err)
						}
					}
					if (writeType) {
						options.writeType = writeType
					}
					that.addlog('尝试蓝牙写入', 'writeType', writeType || '(auto)', '字节数', chunks[chunkIndex].byteLength)
					uni.writeBLECharacteristicValue(options)
				}
				console.log('writeBLE分包', chunks.length, '总字节', bytes.length, characteristicId)
				tryWrite()
			},
			handleWifiSetFail() {
				if (this.WIFITYPE || !this.wifiConnecting) return
				this.WIFITYPE = true
				this.bleValueHandled = true
				this.clearWifiTimers()
				this.stopBleValueListener()
				this.addlog('WiFi设置失败，关闭加载提示')
				uni.hideLoading()
				// 设备管理页重设 WiFi：失败进入结果页，保留已有绑定。
				if (this.fromManage) {
					uni.navigateTo({
						url: '../Bing_page/Bind_fail?bindcode=0&fromManage=1',
						complete: () => {
							this.wifiConnecting = false
						}
					})
					return
				}
				this.getunbind(this.sn)
				this.bleNotifyResumeTimer = setTimeout(() => {
					this.bleNotifyResumeTimer = null
					uni.navigateTo({
						url: "../Bing_page/Bind_fail?bindcode=0",
						complete: () => {
							this.wifiConnecting = false
						}
					})
				}, 1000)
			},
			handleWifiSetSuccess(deviceId) {
				if (this.WIFITYPE || !this.wifiConnecting) return
				this.WIFITYPE = true
				this.bleValueHandled = true
				this.clearWifiTimers()
				this.stopBleValueListener()
				this.configuredWifiCommand = this.wifiCommand
				this.configuredWifiDeviceId = deviceId
				this.addlog('WiFi设置成功，关闭加载提示', this.fromManage ? '返回设备管理' : '开始绑定设备')
				uni.hideLoading()
				if (this.fromManage) {
					this.bleNotifyResumeTimer = setTimeout(() => {
						this.bleNotifyResumeTimer = null
						// 跳过准备页和可能存在的蓝牙列表，返回本次配网的设备管理入口。
						const pages = getCurrentPages()
						const manageRoutes = ['pages/tabBar/device/Equipment_management',
							'pages/tabBar/my/Equipment_management1'
						]
						let delta = 1
						for (let i = pages.length - 2; i >= 0; i--) {
							if (manageRoutes.includes(pages[i].route)) {
								delta = pages.length - 1 - i
								break
							}
						}
						uni.navigateBack({
							delta,
							complete: () => {
								this.wifiConnecting = false
							}
						})
					}, 800)
					return
				}
				this.bind_device(this.sn, deviceId, this.modelId)
			},
			asciiToBuffer(text) {
				const str = String(text || '')
				const buffer = new ArrayBuffer(str.length)
				const dataView = new DataView(buffer)
				for (let i = 0; i < str.length; i++) {
					dataView.setUint8(i, str.charCodeAt(i))
				}
				return buffer
			},
			/** 设备 GOT_IP 后再对时；对时失败不影响 WiFi 已成功 */
			sendTimeThenFinish(deviceId, serviceId, uuid) {
				const that = this
				const attemptId = that.wifiAttemptId
				if (!that.isWifiAttemptActive(attemptId) || that.WIFITYPE) return
				const finish = () => {
					if (!that.isWifiAttemptActive(attemptId) || that.WIFITYPE) return
					that.handleWifiSetSuccess(deviceId)
				}
				// 部分手机不回调无响应写入，对时最多等待 3 秒。
				that.timeSyncTimer = setTimeout(() => {
					that.addlog('对时回调超时，WiFi已获得IP，继续完成流程')
					finish()
				}, 3000)
				// 时间字段按每两位十六进制转为一个字节。
				let buffertime = that.toArrayBuffer("74696d6540" + that.getTimeAllJSON().YMDHMSWIFI)
				that.addlog('4发送的时间数据(十六进制):', that.ab2hex(buffertime))
				that.writeBleCharacteristicValue(deviceId, serviceId, uuid, buffertime, {
					isActive: () => that.isWifiAttemptActive(attemptId) && !that.WIFITYPE,
					success(res) {
						if (!that.isWifiAttemptActive(attemptId) || that.WIFITYPE) return
						that.addlog('5发送的时间数据成功:', res)
						finish()
					},
					fail(errrore) {
						if (!that.isWifiAttemptActive(attemptId) || that.WIFITYPE) return
						that.addlog('6发送的时间数据失败:', errrore)
						finish()
					}
				})
			},
			clearBleNotifyTimer() {
				this.bleDisconnectWaiting = false;
				if (this.bleNotifyTimer) {
					clearTimeout(this.bleNotifyTimer)
					this.bleNotifyTimer = null
				}
			},
			armBleDisconnectTimer() {
				const attemptId = this.wifiAttemptId
				if (!this.isWaitingForWifi(attemptId)) return
				if (this.bleDisconnectWaiting) return;
				this.clearBleNotifyTimer();
				this.bleDisconnectWaiting = true;
				this.bleNotifyTimer = setTimeout(() => {
					this.bleNotifyTimer = null;
					this.bleDisconnectWaiting = false;
					if (!this.isWaitingForWifi(attemptId)) return;
					this.addlog("WLAN_DISCONNECTED后30秒未收到GOT_IP，WiFi设置失败");
					this.handleWifiSetFail();
				}, 30000);
			},
			armBleNotifyTimer() {
				if (this.bleDisconnectWaiting) return;
				const that = this
				const attemptId = that.wifiAttemptId
				if (!that.isWaitingForWifi(attemptId)) return
				that.clearBleNotifyTimer()
				// OK 只是受理命令；超时明确结束，不重发相同配置重新开始等待。
				that.bleNotifyTimer = setTimeout(() => {
					that.bleNotifyTimer = null
					if (!that.isWaitingForWifi(attemptId)) return
					that.addlog('45秒未收到GOT_IP，结束配网等待')
					that.handleWifiSetFail()
				}, 45000)
			},
			notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid, onReady) {
				let that = this
				const attemptId = that.wifiAttemptId
				let settled = false
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: notifyuuid,
					success: (notifyres) => {
						if (settled || !that.isWaitingForWifi(attemptId)) return
						settled = true
						console.log('notifyBLECharacteristicValueChange success', notifyres)
						that.addlog('蓝牙通知已开启，注册监听后等待300毫秒发送AT')
						that.onBLEValue(deviceId, serviceId, uuid, notifyuuid)
						// 安卓部分机型不能在通知开启回调内立即写入，留出操作间隔。
						that.clearBleNotifyResumeTimer()
						that.bleNotifyResumeTimer = setTimeout(() => {
							that.bleNotifyResumeTimer = null
							if (that.isWaitingForWifi(attemptId)) onReady()
						}, 300)
					},
					fail: (notifyerr) => {
						if (settled || !that.isWaitingForWifi(attemptId)) return
						settled = true
						that.addlog('开启蓝牙通知失败，未发送WiFi配置', notifyerr)
						that.handleWifiSetFail()
					}
				})
			},
			clearBleNotifyResumeTimer() {
				if (this.bleNotifyResumeTimer) {
					clearTimeout(this.bleNotifyResumeTimer)
					this.bleNotifyResumeTimer = null
				}
			},
			onBLEValue(deviceId, serviceId, uuid, notifyuuid) {
				let that = this
				const attemptId = that.wifiAttemptId
				if (that.bleValueListening) {
					return
				}
				that.bleValueListening = true
				that.bleValueHandler = (res) => {
					that.addlog('蓝牙特征值变化事件:', that.ab2hex(res.value))
					if (!that.isWaitingForWifi(attemptId) || !that.wifiAtSent) return
					if (that.normalizeBleId(res.deviceId) !== that.normalizeBleId(deviceId) ||
						that.normalizeBleId(res.characteristicId) !== that.normalizeBleId(notifyuuid) ||
						(res.serviceId && that.normalizeBleId(res.serviceId) !== that.normalizeBleId(serviceId)))
						return
					let hexData = that.ab2hex(res.value)
					let asciiString = that.hexToAscii(hexData)
					that.addlog('接收到蓝牙数据:', asciiString)
					const isTimeEcho = /time@/i.test(asciiString)
					const hasGotIp = asciiString.includes('GOT_IP')
					const hasConnected = asciiString.includes('WLAN_CONNECTED')
					const hasDisconnected = asciiString.includes('WLAN_DISCONNECTED') && !hasConnected
					// 同一通知可能包含多条状态，GOT_IP 优先于之前的 DISCONNECTED。
					if (hasGotIp) {
						that.bleValueHandled = true
						that.clearWifiTimers()
						uni.hideLoading()
						that.addlog('3接收到蓝牙数据:', asciiString)
						that.addlog('已获得IP，立即关闭连接加载提示')
						that.bleNotifyResumeTimer = setTimeout(() => {
							that.bleNotifyResumeTimer = null
							if (that.isWifiAttemptActive(attemptId)) that.sendTimeThenFinish(deviceId,
								serviceId, uuid)
						}, 500)
						return
					}
					// 换 AP 时先 DISCONNECTED 再 CONNECTED，最后 GOT_IP 才算连上。
					// time@ 的 ERROR、以及连上过程中的 AT ERROR 都不能当 WiFi 失败。
					if (asciiString.includes('SCAN_NO_AP') ||
						(/\bERROR\b/i.test(asciiString) && !isTimeEcho && !hasGotIp && !hasConnected)) {
						that.addlog('2接收到蓝牙数据:', asciiString)
						that.handleWifiSetFail()
						return
					}
					if (hasDisconnected) {
						that.armBleDisconnectTimer();
						return;
					}
					if (hasConnected && !hasGotIp) {
						that.addlog('收到WLAN_CONNECTED，等待GOT_IP')
						that.armBleDisconnectTimer();
						return
					}
					// OK 只表示 AT 受理成功，要以 GOT_IP 为准
					if (/\bOK\b/i.test(asciiString)) {
						that.addlog('收到OK，继续等待GOT_IP')
					}
				}
				uni.onBLECharacteristicValueChange(that.bleValueHandler)
				that.addlog('蓝牙回包监听已注册')
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
				const attemptId = this.wifiAttemptId
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				}
				let settled = false
				const finish = () => {
					if (settled || !this.isWifiAttemptActive(attemptId)) return false
					settled = true
					clearTimeout(this.bindTimer)
					this.bindTimer = null
					this.bindRequestTask = null
					uni.hideLoading()
					return true
				}
				const fail = (err) => {
					if (!finish()) return
					this.wifiConnecting = false
					this.addlog('WiFi已连接，绑定请求失败，可点击重试绑定', err)
					uni.showToast({
						title: this.$t('网络连接失败'),
						icon: 'none'
					})
				}
				// 此接口单独设置超时，避免通用 $post 的 20 分钟等待。
				this.addlog('开始请求设备绑定接口')
				this.bindTimer = setTimeout(() => {
					const task = this.bindRequestTask
					fail({
						errMsg: '设备绑定请求超时（15秒）'
					})
					if (task) task.abort()
				}, 15000)
				try {
					this.bindRequestTask = uni.request({
						url: this.$url_APP_IP + this.$url_bind_device,
						method: 'POST',
						data,
						timeout: 15000,
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync('token'),
							'content-type': 'application/x-www-form-urlencoded;'
						},
						success: (res) => {
							if (res.statusCode !== 200 || !res.data || res.data.code == null) {
								fail({
									statusCode: res.statusCode,
									errMsg: '绑定接口返回异常'
								})
								return
							}
							if (!finish()) return
							this.addlog('设备绑定接口返回', res.data.code)
							const complete = () => {
								this.wifiConnecting = false
							}
							if (res.data.code == 200) {
								uni.setStorageSync('deviceSn', sn)
								uni.redirectTo({
									url: '../Bing_page/Bind_success?modelId=' + encodeURIComponent(
										modelId),
									fail: (err) => this.addlog('打开绑定成功页失败', err),
									complete
								})
							} else {
								uni.reLaunch({
									url: '../Bing_page/Bind_fail?bindcode=' + encodeURIComponent(res
										.data.code),
									complete
								})
							}
						},
						fail
					})
				} catch (err) {
					fail(err)
				}
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
					success(res) {}
				})
				if (uni.getSystemInfoSync().platform === "android") {
					that.shouji = true
					that.updateWifiList(that.getWiFiIP())
				} else {
					that.shouji = false
					uni.getConnectedWifi({
						success(resd) {
							that.wifi_name = resd.wifi.SSID
						}
					})
				}
			},
			updateWifiList(list) {
				this.wifiArray = list
				this.candidates = [...new Set(list.map(item => item.name).filter(name => name && String(name).trim()))]
			},
			refreshWifiList() {
				if (this.wifiListRefreshing) return
				this.wifiListRefreshing = true
				this.wifiListRefreshSeconds = 10
				const deadline = Date.now() + 10000
				let countdownTimer = null
				let settled = false
				let listening = false
				let stopAndroidScanListener = null
				const stopScan = () => {
					if (settled) return
					settled = true
					if (stopAndroidScanListener) stopAndroidScanListener()
					if (listening) uni.offGetWifiList(onList)
				}
				const finish = () => {
					stopScan()
					clearTimeout(countdownTimer)
					this.wifiListRefreshSeconds = 0
					this.wifiListRefreshing = false
					this.wifiListRefreshCancel = null
				}
				const applyList = (list) => {
					if (settled) return
					this.updateWifiList(list)
					console.log('[WiFi列表刷新] 列表已更新，网络数', this.candidates.length)
					stopScan()
				}
				const onList = (res) => {
					if (settled) return
					applyList((res.wifiList || []).map(item => ({
						name: item.SSID,
						signal: item.signalStrength
					})))
				}
				const fail = (err) => {
					if (settled) return
					stopScan()
					console.log('刷新WiFi列表失败', err)
					uni.showToast({
						title: this.$t('刷新失败'),
						icon: 'none'
					})
				}
				// 扫描结果可提前更新，按钮固定倒计时 10 秒后才允许再次刷新。
				const tick = () => {
					this.wifiListRefreshSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
					if (this.wifiListRefreshSeconds === 0) {
						if (!settled) fail({
							errMsg: 'WiFi scan timeout'
						})
						finish()
						return
					}
					countdownTimer = setTimeout(tick, 1000)
				}
				this.wifiListRefreshCancel = finish
				tick()
				try {
					uni.startWifi({
						success: () => {
							if (settled) return
							try {
								// 本页 Android 直接确认扫描结果，避免 uni-wifi 将未更新的缓存当作成功结果。
								if (uni.getSystemInfoSync().platform === 'android' && typeof plus !==
									'undefined') {
									const main = plus.android.runtimeMainActivity()
									const Context = plus.android.importClass('android.content.Context')
									const WifiManager = plus.android.importClass(
										'android.net.wifi.WifiManager')
									const IntentFilter = plus.android.importClass(
										'android.content.IntentFilter')
									const manager = main.getSystemService(Context.WIFI_SERVICE)
									const receiver = plus.android.implements(
										'io.dcloud.android.content.BroadcastReceiver', {
											onReceive: (context, intent) => {
												if (settled) return
												try {
													const updated = plus.android.invoke(intent,
														'getBooleanExtra', WifiManager
														.EXTRA_RESULTS_UPDATED, false)
													console.log('[WiFi列表刷新] 扫描广播，结果是否更新', updated)
													// 失败广播可能来自之前的扫描，继续等本次成功结果或超时。
													if (updated) applyList(this.getWiFiIP())
												} catch (err) {
													fail(err)
												}
											}
										})
									main.registerReceiver(receiver, new IntentFilter(WifiManager
										.SCAN_RESULTS_AVAILABLE_ACTION))
									stopAndroidScanListener = () => {
										try {
											main.unregisterReceiver(receiver)
										} catch (err) {
											console.log('[WiFi列表刷新] 移除扫描监听失败', err)
										}
									}
									const started = manager.startScan()
									console.log('[WiFi列表刷新] 请求系统扫描', started)
									if (!started) fail({
										errMsg: 'Android startScan 返回 false，扫描未启动，请检查扫描频率、定位权限和定位开关'
									})
									return
								}
								uni.onGetWifiList(onList)
								listening = true
								uni.getWifiList({
									fail
								})
							} catch (err) {
								fail(err)
							}
						},
						fail
					})
				} catch (err) {
					fail(err)
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
				plus.android.importClass("android.net.wifi.ScanResult")
				plus.android.importClass("java.util.ArrayList")
				// WiFi 管理实例
				var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)
				// 读取扫描列表不依赖手机已连接某个 WiFi。
				var resultList = wifiManager.getScanResults(), //扫描得到的wifi信号集合
					len = resultList.size()
				const wifiArray = []
				//注:获取resultList中的场强信息用的是 level 而不是 RSSI
				for (var i = 0; i < len; i++) {
					//将每一个ssid与rssi 都添加到wifiArray数组中，用于绑定显示，根据个人业务取舍 wifiArray=[{name:WiFi的SSID}]
					let oneWiFi = {
						name: resultList.get(i).plusGetAttribute('SSID'),
						signal: resultList.get(i).plusGetAttribute('level')
					}
					wifiArray.push(oneWiFi);
				}
				return wifiArray //返回本次结果，避免刷新时累积旧网络
			},
			btn_start() {
				let that = this
				if (that.wifiConnecting) return
				if (that.wifi_name == that.$t("请选择wifi") || that.wifi_name == "") {
					uni.showToast({
						title: that.$t("请选择或者输入一个wifi"),
						icon: 'none'
					})
					return
					// } else if (!that.wifi_password) {
					// 	uni.showToast({
					// 		title: that.$t("请输入wifi密码"),
					// 		icon: 'none'
					// 	})
					// 	return
				} else {
					that.wifiConnecting = true
					const attemptId = ++that.wifiAttemptId
					that.wifiAtSent = false
					that.WIFITYPE = false
					that.bleValueHandled = false
					that.clearWifiTimers()
					that.stopBleValueListener()
					const senddata = that.buildWifiAtCommand()
					that.wifiCommand = senddata
					if (!that.fromManage && that.configuredWifiCommand === senddata &&
						that.configuredWifiDeviceId === that.deviceId) {
						that.WIFITYPE = true
						that.bleValueHandled = true
						that.addlog('本次页面会话已配网成功，仅重试设备绑定')
						that.bind_device(that.sn, that.deviceId, that.modelId)
						return
					}
					that.configuredWifiCommand = ''
					that.configuredWifiDeviceId = ''
					uni.showLoading({
						title: that.$t('连接中'),
						mask: true
					})
					// 从点击开始计时，服务发现/通知开启没有回调时也能结束加载。
					that.wifiFlowTimer = setTimeout(() => {
						if (!that.isWaitingForWifi(attemptId)) return
						that.addlog('配网总等待超过45秒，关闭加载提示')
						that.handleWifiSetFail()
					}, 45000)
					const doSend = () => {
						that.sendATCommand(that.deviceId, that.serviceId, that.uuid, senddata, that.notifyuuid)
					}
					if (that.fromManage && !(that.serviceId && that.uuid)) {
						that.ensureBleSession(that.deviceId).then(() => {
							if (!that.isWaitingForWifi(attemptId)) return null
							return that.resolveBleWriteTarget(that.deviceId)
						}).then((target) => {
							if (!that.isWaitingForWifi(attemptId)) return
							if (!target || !target.uuid || !target.serviceId) {
								console.log('resolveBleWriteTarget 未找到可写特征值', target)
								that.handleWifiSetFail()
								return
							}
							that.serviceId = target.serviceId
							that.uuid = target.uuid
							that.notifyuuid = target.notifyuuid || that.notifyuuid || uni.getStorageSync(
								'landcharacteristicId') || ''
							that.preferredWriteType = target.writeTypeHint
							that.sendATCommand(that.deviceId, that.serviceId, that.uuid, senddata, that.notifyuuid)
						}).catch((err) => {
							if (!that.isWaitingForWifi(attemptId)) return
							console.log('resolveBleWriteTarget error', err)
							uni.hideLoading()
							that.handleWifiSetFail()
						})
						return
					}
					doSend()
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

	.wifi-popup-header {
		position: relative;
		padding: 16px 90px;
		border-bottom: 1px solid #eee;
	}

	.wifi-popup-title {
		font-size: 16px;
		font-weight: 500;
		text-align: center;
		color: #000;
	}

	.wifi-popup-refresh {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		margin: 0;
		padding: 8px 4px;
		font-size: 14px;
		line-height: 20px;
		color: #3298F7;
		background: transparent;
	}

	.wifi-popup-refresh::after {
		border: none;
	}

	.wifi-popup-refresh[disabled] {
		color: #999;
		background: transparent;
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

	.bp-log-panel {
		margin: 10px 10px 20px;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 8px;
		overflow: hidden;
	}

	.bp-log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		border-bottom: 1px solid #eee;
	}

	.bp-log-title {
		font-size: 12px;
		color: #333;
		font-weight: 500;
	}

	.bp-log-header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.bp-log-copy-btn {
		font-size: 12px;
		color: #3298F7;
	}

	.bp-log-clear-btn {
		font-size: 12px;
		color: #F55A5A;
	}

	.bp-log-content {
		max-height: 280px;
	}

	.bp-log-text {
		font-size: 10px;
		color: #666;
		line-height: 2.0;
		word-break: break-all;
		white-space: pre-wrap;
	}
</style>