<template>
	<view class="container">
		<view class="bluetooth-bg"></view>



		<view class="button-group">
			<!-- <button :class="['btn', 'btn-primary']" hover-class="btn-hover" @click="PPGliji">APP发起PPG测量</button>
			<button :class="['btn', 'btn-primary']" hover-class="btn-hover"
				@click="PPGlijitime">APP发起PPG测量并设置测量时长</button>
 -->
			<button :class="['btn', 'btn-primary']" hover-class="btn-hover" @click="goToReport">
				<text class="btn-text">{{$t('小时监测报告724')}}</text>
				<view class="btn-arrow">›</view>
			</button>
			<button :class="['btn', 'btn-warning' ]" style="margin-top: 20px ;" hover-class="btn-hover"
				@click="goToTest">
				<text class="btn-text">{{$t('无压血压测试')}}</text>
				<view class="btn-arrow">›</view>
			</button>
			<button v-if="isChinese" :class="['btn', 'btn-primary']" style="margin-top: 20px ;" hover-class="btn-hover"
				@click="goToPulse">
				<text class="btn-text">{{$t('脉诊健康管理')}}</text>
				<view class="btn-arrow">›</view>
			</button>
			<!-- <view v-show="devicetype" style="margin-top: 20px;color: red;font-size: 16px; font-weight: bold;">
				{{$t('当前手表不支持该功能')}}（U19M）
			</view> -->
			<button v-show="!devicetype" :class="['btn', 'btn-success']" style="margin-top: 20px ;"
				hover-class="btn-hover" @click="goToTimer">
				<text class="btn-text">{{$t('血压定时测量开关')}}</text>
				<view class="btn-arrow">›</view>
			</button>
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
			}
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("定时监测")
			})
		},
		onLoad(options) {
			// 只要不包含 BPW1，就禁止「血压定时测量开关」
			let hasBpw1 = false
			if (options.hasBpw1 !== undefined && options.hasBpw1 !== null && options.hasBpw1 !== '') {
				hasBpw1 = options.hasBpw1 === '1' || options.hasBpw1 === 1 ||
					options.hasBpw1 === true || options.hasBpw1 === 'true'
			} else {
				hasBpw1 = !!uni.getStorageSync('deviceIdwatch')
			}
			this.devicetype = !hasBpw1
			if (this.devicetype) {
				console.log("无BPW1设备，禁止血压定时测量")
			}
		},

		methods: {
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
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* 垂直居中 */
		align-items: center;
		position: relative;
	}

	/* 亮色背景 - 清新的浅色渐变 */
	.bluetooth-bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		background: linear-gradient(135deg, #e8f4f8 0%, #d4eaf0 100%);
	}

	/* 保留静态装饰 */
	.bluetooth-bg::after {
		content: '🫧';
		position: absolute;
		font-size: 60px;
		opacity: 0.12;
		bottom: 10%;
		right: 10%;
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0% {
			transform: translateY(0px) rotate(0deg);
		}

		50% {
			transform: translateY(-20px) rotate(180deg);
		}

		100% {
			transform: translateY(0px) rotate(360deg);
		}
	}

	.button-group {
		width: 80%;
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		/* 苹果风格更紧凑的间距 */
		z-index: 1;
	}

	/* 苹果透明按钮样式 */
	.btn {
		width: 100%;
		padding: 32rpx 40rpx;
		border-radius: 28rpx;
		font-size: 34rpx;
		font-weight: 500;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		border: none;
		position: relative;
		overflow: hidden;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* 苹果毛玻璃效果 */
		background: rgba(255, 255, 255, 0.75);
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04), 0 4rpx 8rpx rgba(0, 0, 0, 0.02);
	}

	/* 按钮文字 */
	.btn-text {
		display: inline-block;
		font-size: 34rpx;
		font-weight: 500;
		letter-spacing: -0.3rpx;
		line-height: 1.4;
	}

	/* 右箭头 - 苹果风格 */
	.btn-arrow {
		font-size: 48rpx;
		font-weight: 300;
		margin-left: 20rpx;
		transition: transform 0.2s ease;
		opacity: 0.7;
	}

	/* 按钮点击效果 */
	.btn-hover {
		transform: scale(0.98);
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(24rpx);
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	}

	.btn-hover .btn-arrow {
		transform: translateX(6rpx);
		opacity: 1;
	}

	/* 按钮颜色变体 - 文字颜色区分功能，背景保持透明统一 */
	.btn-primary .btn-text {
		color: #007aff;
	}

	.btn-primary .btn-arrow {
		color: #007aff;
	}

	.btn-success .btn-text {
		color: #34c759;
	}

	.btn-success .btn-arrow {
		color: #34c759;
	}

	.btn-warning .btn-text {
		color: #ff9500;
	}

	.btn-warning .btn-arrow {
		color: #ff9500;
	}

	/* 可选：增加轻微边框增强玻璃质感 */
	.btn {
		border: 0.5rpx solid rgba(255, 255, 255, 0.6);
	}

	/* 蓝牙状态指示器 - 苹果风格的胶囊 */
	.button-group {
		position: relative;
	}

	/* .button-group::before {
		content: '🫧 蓝牙已连接';
		position: absolute;
		top: -100rpx;
		left: 50%;
		transform: translateX(-50%);
		color: #007aff;
		font-size: 26rpx;
		font-weight: 500;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20rpx);
		padding: 12rpx 28rpx;
		border-radius: 60rpx;
		white-space: nowrap;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
		letter-spacing: -0.2rpx;
	} */

	/* 响应式调整 */
	@media (max-width: 750px) {
		.button-group {
			width: 85%;
			gap: 20rpx;
		}

		.btn {
			padding: 28rpx 36rpx;
		}

		.btn-text {
			font-size: 32rpx;
		}

		.btn-arrow {
			font-size: 44rpx;
		}

		.button-group::before {
			font-size: 24rpx;
			padding: 10rpx 24rpx;
			top: -90rpx;
		}
	}

	/* 去掉button默认边框 */
	button::after {
		border: none;
	}

	.btn-disabled {
		opacity: 0.6;
		background-color: #a0a0a0 !important;
		color: #e0e0e0 !important;
	}
</style>