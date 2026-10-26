<template>
	<view class="page">
		<view class="wave"></view>
		<view class="content">
			<view class="hs-header">
				<view class="header">
					<text class="page-title">{{ $t('监测与定时设置') }}</text>
					<text class="page-subtitle">{{ $t('监测与定时设置副标题') }}</text>
				</view>
				<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			</view>
			<view class="card" hover-class="card-hover" @click="goToReport">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/jiance_2.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('小时监测报告724标题') }}</text>
					<text class="card-desc">{{ $t('小时监测报告724描述') }}</text>
				</view>
				<view class="card-right">
					<view class="status-pill status-pill-active">
						<text class="status-pill-text status-pill-text-active">{{ $t('查看') }}</text>
					</view>
					<text class="card-chevron">›</text>
				</view>
			</view>

			<view class="card" :class="{ 'card-disabled': !wuganModelReady }"
				:hover-class="wuganModelReady ? 'card-hover' : ''" @click="goToTest">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/jiance_1.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('无气囊充气血压设置标题') }}</text>
					<text class="card-desc">{{ $t('无气囊充气血压设置描述') }}</text>
				</view>
				<view class="card-right">
					<view class="status-pill">
						<text class="status-pill-text status-pill-text-active">{{ $t('查看') }}</text>
					</view>
					<text class="card-chevron">›</text>
				</view>
			</view>
			<view v-if="!wuganModelReady" class="wugan-gate-tip">{{ $t('您的无感血压AI模型正在建立中大概需要2周时间定时测量') }}</view>

			<view v-if="isChinese" class="card" hover-class="card-hover" @click="goToPulse">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/jiance_6.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('脉诊健康管理') }}</text>
					<text class="card-desc">{{ $t('中医脉诊数字化分析体质健康监测') }}</text>
				</view>
				<view class="card-right">
					<view class="status-pill status-pill-active">
						<text class="status-pill-text status-pill-text-active">{{ $t('查看') }}</text>
					</view>
					<text class="card-chevron">›</text>
				</view>
			</view>

			<view v-show="!devicetype" class="card" hover-class="card-hover" @click="goToTimer">
				<view class="card-icon">
					<image class="card-icon-img" src="/static/page_icon/jiance_3.png" mode="aspectFit" />
				</view>
				<view class="card-text">
					<text class="card-title">{{ $t('自动血压测量计划标题') }}</text>
					<text class="card-desc">{{ $t('自动血压测量计划描述') }}</text>
				</view>
				<view class="card-right">
					<view class="status-pill">
						<text class="status-pill-text status-pill-text-active">{{ $t('查看') }}</text>
					</view>
					<text class="card-chevron">›</text>
				</view>
			</view>

			<view class="tip-card">
				<view class="tip-main">
					<view class="tip-icon-wrap">
						<text class="tip-icon-text">i</text>
					</view>
					<view class="tip-text">
						<text class="tip-title">{{ $t('开始前请注意') }}</text>
						<text class="tip-desc">{{ $t('开始前请注意描述') }}</text>
					</view>
				</view>
				<view class="tip-device">
					<view class="tip-device-body">
						<image src="/static/page_icon/jiance_4.png" class="monitor-tip-img" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="manage-btn" hover-class="manage-btn-hover" @click="goToDevices">
			<view class="manage-btn-center">
				<view class="manage-btn-icon">
					<view class="manage-btn-phone"></view>
					<view class="manage-btn-watch"></view>
				</view>
				<text class="manage-btn-text">{{ $t('管理设备') }}</text>
			</view>
			<text class="manage-btn-arrow">›</text>
		</view>
	</view>
	</view>
</template>

<script>
	import {
		u16proBLE
	} from '../../../api/protocol/u16pro-ble-manager.js'
	export default {
		data() {
			const lan = uni.getLocale()
			return {
				devicetype: true,
				BPW6deviceId: uni.getStorageSync("BPW6devicemac"),
				isChinese: lan === 'zh-Hans' || lan === 'zh-Hant',
				skipNextShowGate: false,
				wuganModelReady: false,
			}
		},
		onShow() {
			let that = this
			that.wuganModelReady = that.isWuganModelReady()
			uni.setNavigationBarTitle({
				title: that.$t("定时监测")
			})
			// 首次 onLoad 后紧跟的 onShow 跳过，避免覆盖路由参数；从子页返回再按本地重判
			if (that.skipNextShowGate) {
				that.skipNextShowGate = false
				return
			}
			that.applyBpw1Gate()
		},
		onLoad(options) {
			this.wuganModelReady = this.isWuganModelReady()
			this.applyBpw1Gate(options || {})
			this.skipNextShowGate = true
		},

		methods: {
			/** 与无感血压报告一致：体温有效且 >= 500 才视为无感模型已建立 */
			isWuganModelReady() {
				const modeltipsbool = uni.getStorageSync('temperature')
				return !!(modeltipsbool && modeltipsbool !== '-/-' && Number(modeltipsbool) >= 500)
			},
			parseRouteFlag(val) {
				return val === '1' || val === 1 || val === true || val === 'true'
			},
			/**
			 * 是否已绑定 BPW1：与 Main.hasBoundBpw1Device 对齐。
			 * 不能只看 deviceIdwatch——该值多在 BLE 连上后才写入，服务端已绑但未连时会误判。
			 * @param {object} [options] 仅 onLoad 传入路由参数；onShow 不传则只看本地绑定。
			 */
			resolveHasBpw1(options) {
				if (options && options.hasBpw1 !== undefined && options.hasBpw1 !== null && options.hasBpw1 !== '') {
					return this.parseRouteFlag(options.hasBpw1)
				}
				if (uni.getStorageSync('deviceIdwatch')) {
					return true
				}
				// 首页跳转参数：当前机型为 BPW1(30000)
				if (options && String(options.devicetype) === '30000') {
					return true
				}
				try {
					const list = uni.getStorageSync('lixianlist')
					if (Array.isArray(list) && list.some((row) => String(row && row.deviceModelId) === '30000')) {
						return true
					}
				} catch (e) {}
				try {
					const snap = uni.getStorageSync('qx_emotion_bind_snapshot')
					if (snap && (snap.hasBpw1 === true || snap.hasBpw1 === 'true')) {
						return true
					}
				} catch (e) {}
				try {
					const macs = uni.getStorageSync('devicdsdmac1')
					if (Array.isArray(macs) && macs.length > 0) {
						return true
					}
				} catch (e) {}
				return false
			},
			/** 是否已绑定任意手表（BPW1/BPW6）；未绑定时入口仍要展示 */
			resolveHasAnyWatch(options) {
				if (options && options.hasAny !== undefined && options.hasAny !== null && options.hasAny !== '') {
					return this.parseRouteFlag(options.hasAny)
				}
				if (options && options.devicetypelist !== undefined && options.devicetypelist !== null &&
					options.devicetypelist !== '') {
					const n = Number(options.devicetypelist)
					if (!Number.isNaN(n)) {
						return n > 0
					}
				}
				if (uni.getStorageSync('deviceIdwatch') || uni.getStorageSync('BPW6devicemac')) {
					return true
				}
				try {
					const list = uni.getStorageSync('lixianlist')
					if (Array.isArray(list) && list.some((row) => {
							const id = String(row && row.deviceModelId)
							return id === '30000' || id === '30001'
						})) {
						return true
					}
				} catch (e) {}
				try {
					const snap = uni.getStorageSync('qx_emotion_bind_snapshot')
					if (snap && (snap.hasBpw1 === true || snap.hasBpw1 === 'true' ||
							snap.hasBpw6 === true || snap.hasBpw6 === 'true')) {
						return true
					}
				} catch (e) {}
				try {
					const macs1 = uni.getStorageSync('devicdsdmac1')
					if (Array.isArray(macs1) && macs1.length > 0) {
						return true
					}
				} catch (e) {}
				return false
			},
			applyBpw1Gate(options) {
				const hasBpw1 = this.resolveHasBpw1(options)
				const hasAny = this.resolveHasAnyWatch(options)
				// 未绑定任何设备、或已绑 BPW1：显示「血压定时」；仅绑非 BPW1（如只有 BPW6）时隐藏
				const showBpTimer = hasBpw1 || !hasAny
				// devicetype=true 表示隐藏入口（兼容模板 v-show="!devicetype"）
				this.devicetype = !showBpTimer
				if (this.devicetype) {
					console.log("无BPW1设备，禁止血压定时测量")
				}
			},
			// 跳转到监测报告页面
			goToReport() {
				uni.navigateTo({
					url: '../../main/globalweather/quick_index?devicetype=' + this.devicetype
				})
			},
			// 跳转到定时测量开关页面
			goToTimer() {
				uni.navigateTo({
					url: '/pages/tabBar/main/globalweather/custom_index'
				})
			},
			// 跳转到无压测试页面（仅无感定时）
			goToTest() {
				if (!this.isWuganModelReady()) {
					this.wuganModelReady = false
					return
				}
				uni.navigateTo({
					url: '../../main/sleep_report/Reports_Alerts_new?mode=wugan&devicetype=' + this.devicetype
				})
			},
			// 跳转到脉诊健康管理（仅中文展示）
			goToPulse() {
				uni.navigateTo({
					url: '/pages/tabBar/main/Pulsediagnosis'
				})
			},
			// 跳转到设备管理
			goToDevices() {
				uni.navigateTo({
					url: '../../../tabBar/my/Equipment_management1'
				})
			},
			async PPGliji() {
				await new Promise(resolve => setTimeout(resolve, 300))
				try {
					const result = await u16proBLE.startPPGMeasurement(this.BPW6deviceId)
					console.log('【BPW6】PPG测量启动结果', result)
					if (!result || !result.success) {
						uni.showToast({
							title: u16proBLE.getPpgStartHint(result),
							icon: 'none',
							duration: 3000
						})
					} else {
						uni.showToast({
							title: this.$t('PPG测量已开启'),
							icon: 'success'
						})
					}
				} catch (ppgErr) {
					console.error('【BPW6】PPG测量启动失败', ppgErr)
					uni.showToast({
						title: ppgErr.message || this.$t('PPG通信失败'),
						icon: 'none'
					})
				}
			},
			async PPGlijitime() {
				await new Promise(resolve => setTimeout(resolve, 300))
				try {
					const result = await u16proBLE.startPPGMeasurementWithDuration(60, this.BPW6deviceId)
					console.log('【BPW6】PPG测量启动结果', result)
					if (!result || !result.success) {
						uni.showToast({
							title: u16proBLE.getPpgStartHint(result),
							icon: 'none',
							duration: 3000
						})
					} else {
						uni.showToast({
							title: this.$t('PPG测量已开启'),
							icon: 'success'
						})
					}
				} catch (ppgErr) {
					console.error('【BPW6】PPG测量启动失败', ppgErr)
					uni.showToast({
						title: ppgErr.message || this.$t('PPG通信失败'),
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #eef6fc 40%, #f4f7fb 100%);
		box-sizing: border-box;
		position: relative;
		padding-bottom: 50px;
	}

	.wave {
		position: absolute;
		top: -180rpx;
		left: -120rpx;
		width: 560rpx;
		height: 420rpx;
		background: radial-gradient(ellipse at center, #FFFFFF 0%, rgba(255, 255, 255, 0.55) 46%, rgba(240, 247, 255, 0) 72%);
		pointer-events: none;
		z-index: 0;
	}

	.content {
		position: relative;
		z-index: 1;
		padding: 32rpx 40rpx 56rpx;
		box-sizing: border-box;
	}

	.hs-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 28rpx;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.empty-header {
		margin-top: 15px;
		margin-bottom: 32rpx;
	}

	.header {
		margin-top: 10px;
		margin-bottom: 36rpx;
		padding: 8rpx 8rpx 0;
	}

	.page-title {
		display: block;
		font-size: 48rpx;
		font-weight: 700;
		color: #1A2B4A;
		line-height: 1.3;
	}

	.page-subtitle {
		display: block;
		margin-top: 12rpx;
		font-size: 26rpx;
		color: #8A97AB;
		line-height: 1.5;
	}

	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		border-radius: 32rpx;
		padding: 28rpx 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.card-hover {
		opacity: 0.9;
	}

	.card-disabled {
		opacity: 0.45;
	}

	.wugan-gate-tip {
		margin: -4rpx 0 24rpx;
		padding: 24rpx 28rpx;
		background: #FFF6E0;
		border-radius: 24rpx;
		font-size: 26rpx;
		line-height: 1.6;
		color: #E8A317;
	}

	.card-icon {
		width: 48px;
		height: 48px;
		border-radius: 20%;
		background: #EAF2FF;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
		border: 1px solid #EAF2FF;
	}

	.card-icon-img {
		width: 48px;
		height: 48px;
	}

	.card-text {
		flex: 1;
		min-width: 0;
		padding: 0 20rpx;
	}

	.card-title {
		display: block;
		font-size: 30rpx;
		font-weight: 700;
		color: #1A2B4A;
		line-height: 1.35;
	}

	.card-desc {
		display: block;
		margin-top: 8rpx;
		font-size: 22rpx;
		color: #8A94A6;
		line-height: 1.45;
	}

	.card-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
	}

	.status-pill {
		padding: 8rpx 18rpx;
		border-radius: 999rpx;
		background: #EEF1F5;
	}

	.status-pill-active {
		background: #E3EEFF;
	}

	.status-pill-text {
		font-size: 22rpx;
		color: #7A8699;
		line-height: 1.2;
	}

	.status-pill-text-active {
		color: #2F6BFF;
	}

	.card-chevron {
		margin-left: 10rpx;
		font-size: 36rpx;
		color: #B7C1D0;
		font-weight: 300;
		line-height: 1;
	}

	.tip-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #EAF2FF;
		border-radius: 28rpx;
		padding: 28rpx 24rpx;
		margin-top: 8rpx;
		margin-bottom: 36rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.tip-main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.tip-icon-wrap {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		border: 2rpx solid #4A78C6;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 4rpx;
	}

	.tip-icon-text {
		font-size: 22rpx;
		color: #4A78C6;
		font-weight: 700;
		line-height: 1;
	}

	.tip-text {
		flex: 1;
		min-width: 0;
		margin-left: 14rpx;
		padding-right: 12rpx;
	}

	.tip-title {
		display: block;
		font-size: 28rpx;
		font-weight: 700;
		color: #1A2B4A;
		line-height: 1.35;
	}

	.tip-desc {
		display: block;
		margin-top: 8rpx;
		font-size: 22rpx;
		color: #7A8699;
		line-height: 1.5;
	}

	.tip-device {
		width: 96rpx;
		height: 96rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tip-device-body {
		width: 72rpx;
		height: 88rpx;
		border-radius: 18rpx;
		background: linear-gradient(160deg, #5B8CFF 0%, #2F6BFF 100%);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tip-device-heart {
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 1;
	}

	.tip-device-wave {
		width: 36rpx;
		height: 10rpx;
		margin-top: 8rpx;
		border-radius: 999rpx;
		background: rgba(255, 255, 255, 0.85);
		position: relative;
	}

	.tip-device-wave::before,
	.tip-device-wave::after {
		content: '';
		position: absolute;
		top: -6rpx;
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.85);
	}

	.tip-device-wave::before {
		left: 8rpx;
	}

	.tip-device-wave::after {
		right: 8rpx;
	}

	.manage-btn {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: #2F6BFF;
		border-radius: 24rpx;
		height: 48px;
		padding: 30rpx 36rpx;
		margin-left: 20px;
		margin-right: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.manage-btn-hover {
		opacity: 0.92;
	}

	.manage-btn-center {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.manage-btn-icon {
		width: 40rpx;
		height: 40rpx;
		position: relative;
		margin-right: 16rpx;
	}

	.manage-btn-phone {
		position: absolute;
		left: 0;
		top: 4rpx;
		width: 22rpx;
		height: 32rpx;
		border: 3rpx solid #FFFFFF;
		border-radius: 6rpx;
		box-sizing: border-box;
	}

	.manage-btn-watch {
		position: absolute;
		right: 0;
		bottom: 2rpx;
		width: 20rpx;
		height: 20rpx;
		border: 3rpx solid #FFFFFF;
		border-radius: 6rpx;
		background: #2F6BFF;
		box-sizing: border-box;
	}

	.manage-btn-text {
		font-size: 30rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 1.2;
	}

	.manage-btn-arrow {
		position: absolute;
		right: 36rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 40rpx;
		color: #FFFFFF;
		font-weight: 300;
		line-height: 1;
	}
</style>