<template>
	<view>
		<view v-if="agreeid == 1" class="splash_bg">
			<view>
				<view style=" text-align: center;font-size: 26px;font-weight: bold;">欢迎使用</view>
				<view style=" text-align: center;margin-top: 20px;font-size: 26px;font-weight: bold;">JakobLife
				</view>
				<view style="display: flex; justify-content:center;">
					<image style="width: 180px;height: 180px;" src="../../static/icons/14.png" />
				</view>
				<!-- <view class="warp">
					<view class="view_circle1"></view>
					<view class="view_circle2"></view>
					<view class="view_circle3"></view>
				</view> -->
			</view>
		</view>
		<view v-else class="dialog">
			<view class="bg"></view>
			<view class="title">服务协议和隐私政策</view>
			<view class="content">
				1.请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。<br /><text style="height: auto;
			padding: 0 0 0 18px;text-indent: 1em;">
					2.你可阅读</text>
				<text class="link" @click="linkClick(1)">《服务协议》</text>和
				<text class="link" @click="linkClick(2)">《隐私政策》</text>
				了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。
			</view>
			<view class="btn">
				<button style="margin-top: 20px; width: 40vw;border-radius: 50px;background: #3298F7;color: white;"
					@click="agree">同意并接受</button>
				<button style="margin:20px 0; width: 40vw;border-radius: 50px;background: #F55A5A;color: white;"
					@click="disagree">暂时同意</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				refCode: '',
				agreeid: uni.getStorageSync("agree")
			}
		},
		onLoad(option) {
			if (option.refCode) {
				this.refCode = option.refCode;
				uni.setStorageSync('refCode', option.refCode);
			}
		},


		onShow() {
			if (this.agreeid == 1) {
				uni.getStorageInfo({
					success(res) {
						if (res.keys.includes("token")) {
							setTimeout(function() {
								uni.switchTab({
									url: "../tabBar/main/Main"
								})
							}, 1000);
						} else {
							setTimeout(function() {
								uni.redirectTo({
									url: "../login/login_land"
								})
							}, 1000);
						}

					}
				})
			}
		},

		methods: {
			linkClick(num) {
				if (num == 1) {
					uni.navigateTo({
						url: '../service/Usage_agreement?id=1'
					})
				} else {
					uni.navigateTo({
						url: '../service/Usage_agreement?id=1130'
					})
				}
			},
			agree() {
				uni.setStorageSync('agree', 1) // 设置缓存，下次进入应用不再弹出
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			disagree() {
				uni.navigateBack()
				// // #ifdef APP-PLUS
				// plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
				// // #endif
			}
		}
	}
</script>

<style lang="scss">
	page {
		// background: url('../../static/1.png')no-repeat left top #fff;
		background-size: 750rpx 1334rpx;
		position: relative;
		z-index: 2;

		.bg {
			position: fixed;
			left: 0;
			top: 0;
			z-index: -1;
			background: rgba(0, 0, 0, .5);
			width: 750rpx;
			height: 100vh;
		}
	}

	.splash_bg {
		width: 100vw;
		height: 100vh;
		color: black;
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	// 弹窗样式
	.dialog {
		margin: 0 auto;
		padding: 10px;
		margin-top: calc(30vh);
		width: 80vw;
		border-radius: 16px;
		background-color: #fff;

		.title {
			text-align: center;
			line-height: 40px;
			font-size: 18px;
			font-weight: 600;
		}

		.content {
			height: auto;
			font-size: 14px;
			color: #999999;
			padding: 0 18px;
			text-indent: 1em;

			.link {
				color: #3298F7;
			}
		}

		.btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 80vw;

		}
	}

	.warp {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.view_circle1 {
		height: 10px;
		width: 10px;
		background-color: blue;
		border-radius: 10px;
		animation-name: donghua;
		animation: donghua 0.5s linear 0.7s infinite alternate;
	}

	.view_circle2 {
		height: 10px;
		width: 10px;
		margin-left: 20px;
		background-color: blue;
		border-radius: 10px;
		animation-name: donghua;
		animation: donghua 0.5s linear 0.8s infinite alternate-reverse;
	}

	.view_circle3 {
		height: 10px;
		width: 10px;
		margin-left: 20px;
		background-color: blue;
		border-radius: 10px;
		animation-name: donghua;
		animation: donghua 0.5s linear 0.9s infinite alternate;
	}

	@keyframes donghua {
		from {
			margin-top: 0px
		}

		to {
			margin-top: 10px
		}
	}
</style>