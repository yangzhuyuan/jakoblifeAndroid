<template>
	<view style="display: flex; color: #000000;height: 100vh;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
			<view class="shebeistyle">
				<image style="width: 280px;" :src="SELECT_TYPE === '0' ? imagess:imagess1" />
			</view>
			<view style="margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">
				{{SELECT_TYPE === '0' ? $t('将血压计开机'):$t('将体脂秤开机')}}
			</view>
			<view style="width: auto; margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">{{$t('在待机状态下')}}
			</view>
			<view style="flex-direction: row; display: flex; margin-top: 100rpx; justify-content: center;">
				<checkbox style="font-size: 28rpx; margin-right:10px;" color="#ffffff" class="round"
					activeBackgroundColor="#3298F7" active-border-color="#D5D5D5" :checked="cb" @click="checked">
					{{$t('准备就绪')}}
				</checkbox>
			</view>
			<button class="btn" plain="true" :style="getback(cb)" :disabled="zkConnecting"
				@click="btn_next()">{{$t(zkConnecting ? '连接中' : '下一步')}}</button>
		</view>
	</view>
</template>

<script>
	import { createZk872WifiConnector, isZk872WifiModel } from '@/pages/api/zk872WifiConnection.js'

	export default {
		data() {
			return {
				cb: false,
				SELECT_TYPE: '',
				sn: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png',
				modelId: '',
				fromManage: false,
				deviceId: '',
				modelname: '',
				zkConnecting: false,
				zkOpeningWifi: false,
				zkConnector: null,
			}
		},

		onLoad(opt) {
			this.sn = opt.sn
			this.modelId = opt.modelId
			this.SELECT_TYPE = opt.SELECT_TYPE
			this.fromManage = opt.fromManage === '1' || opt.fromManage === 1 || opt.fromManage === true
			this.deviceId = opt.deviceId ? decodeURIComponent(opt.deviceId) : ''
			this.modelname = opt.modelname ? decodeURIComponent(opt.modelname) : ''
		},

		onShow() {
			this.zkOpeningWifi = false
			uni.setNavigationBarTitle({
				title: this.$t(this.fromManage ? '设置wifi' : '绑定设备')
			})
		},
		onHide() {
			if (!this.zkOpeningWifi) this.cancelZkConnection()
		},
		onUnload() {
			this.cancelZkConnection()
		},


		methods: {
			setZkBindingActive(active) {
				if (this.$globalTimers) this.$globalTimers.deviceBindingActive = active
				uni.$emit(active ? 'DEVICE_BIND_PAGE_ACTIVE' : 'DEVICE_BIND_PAGE_INACTIVE')
			},
			cancelZkConnection() {
				if (!this.zkConnector) return
				this.zkConnector.cancel()
				this.zkConnector = null
				if (this.zkConnecting) {
					this.zkConnecting = false
					uni.hideLoading()
					this.setZkBindingActive(false)
				}
			},
			async connectZkWifiDevice() {
				if (this.zkConnecting) return
				this.zkConnecting = true
				this.setZkBindingActive(true)
				// 首次绑定按名称主动扫描，旧接口地址（可能来自 iOS）不能作为本次目标。
				if (!this.fromManage) this.deviceId = ''
				const connector = createZk872WifiConnector({
					api: uni,
					deviceId: this.deviceId,
					usePassedDeviceId: this.fromManage,
					allowNameFallback: !this.fromManage,
					onAttempt: (attempt) => {
						uni.showLoading({ title: this.$t(attempt === 1 ? '连接中' : 'ZK872正在重试连接'), mask: true })
					},
					onLog: (...args) => console.log('[ZK872自动配网连接]', ...args)
				})
				this.zkConnector = connector
				try {
					const target = await connector.connect()
					if (this.zkConnector !== connector || !this.zkConnecting) return
					this.deviceId = target.deviceId
					console.log('[ZK872自动配网连接] 当前已连接设备', target.name, target.deviceId)
					// 延续手动连接成功后保存“已连接过的设备”的行为。
					try {
						const stored = uni.getStorageSync('listdadsa')
						const devices = Array.isArray(stored) ? stored.slice() : []
						if (!devices.some(item => item && String(item.deviceId).toUpperCase() === target.deviceId.toUpperCase())) {
							devices.push({ deviceId: target.deviceId, name: target.name })
							uni.setStorageSync('listdadsa', devices)
						}
					} catch (err) {
						console.log('[ZK872自动配网连接] 保存设备记录失败', err)
					}
					const params = {
						sn: this.sn, SELECT_TYPE: this.SELECT_TYPE, modelId: this.modelId,
						deviceId: target.deviceId, serviceId: target.serviceId, uuid: target.uuid,
						notifyuuid: target.notifyuuid, writeTypeHint: target.writeTypeHint
					}
					if (this.fromManage) params.fromManage = '1'
					const query = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key] || '')).join('&')
					this.zkOpeningWifi = true
					uni.hideLoading()
					await new Promise((resolve, reject) => {
						uni.navigateTo({
							url: '../Bing_xueya/Bing_xueya_2?' + query,
							success: () => {
								connector.keepConnection()
								resolve()
							},
							fail: (err) => reject(Object.assign({}, err, { code: 'NAVIGATE_FAILED' }))
						})
					})
				} catch (err) {
					if (this.zkConnector !== connector || err.code === 'CANCELLED') return
					connector.cancel()
					this.zkOpeningWifi = false
					uni.hideLoading()
					if (err.code === 'NAVIGATE_FAILED') {
						uni.showToast({ title: this.$t('失败'), icon: 'none' })
					} else {
						const multipleTip = err.code === 'MULTIPLE_DEVICES' ? this.$t('ZK872附近多台设备提示') + '\n\n' : ''
						uni.showModal({
							title: this.$t('ZK872蓝牙连接失败标题'),
							content: multipleTip + this.$t('ZK872蓝牙连接失败提示'),
							showCancel: false,
							confirmText: this.$t('确定')
						})
					}
				} finally {
					if (this.zkConnector === connector) {
						this.zkConnecting = false
						this.setZkBindingActive(false)
					}
				}
			},
			getback(id) {
				return {
					background: id === false ? "#DBDBDB" : "#3298F7"
				}
			},


			checked() {
				if (this.cb == true) {
					this.cb = false
				} else {
					this.cb = true
				}
			},

			btn_next() {
				if (this.zkConnecting) return
				if (this.cb == false) {
					uni.showToast({
						title: this.$t("是否准备就绪"),
						icon: 'none'
					})
					return
				}
				if (isZk872WifiModel(this.modelId, this.modelname)) {
					return this.connectZkWifiDevice()
				}
				let url = '../Bing_xueya/lanya_wifi?sn=' + this.sn + "&SELECT_TYPE=" + this.SELECT_TYPE +
					"&modelId=" + this.modelId
				if (this.fromManage) {
					url += '&fromManage=1'
					if (this.deviceId) {
						url += '&deviceId=' + encodeURIComponent(this.deviceId)
					}
				}
				uni.navigateTo({
					url
				})
			},
		}
	}
</script>

<style>
	.shebeistyle {
		display: flex;
		width: auto;
		height: 301px;
		margin: 20px 20px 20px 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
	}

	.btn {
		width: auto;
		height: 48px;
		font-size: 16px;
		font-weight: 400;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 20px 0 20px;
		border-radius: 30px;
		background: #3298F7;
		color: white !important;
		border: none !important;
	}

	.text {
		text-align: center;
		margin-top: 40rpx;
		color: #3298F7;
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
