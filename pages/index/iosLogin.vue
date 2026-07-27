<template>
	<view>
		<view v-if="agreed === true" class="splash_bg">
			<view>
				<view style=" text-align: center;font-size: 26px;font-weight: bold;">{{$t("欢迎使用")}}</view>
				<view style=" text-align: center;margin-top: 20px;font-size: 26px;font-weight: bold;">JakobLife
				</view>
				<view style="display: flex; justify-content:center;">
					<image style="width: 180px;height: 180px;" :src="loginimg" />
				</view>
			</view>
		</view>
		<view v-else class="dialog">
			<view class="bg"></view>
			<view class="title">{{$t("服务协议和隐私政策")}}</view>
			<view class="content">
				{{$t("服务协议和隐私政策1")}}<br />
				<text style="height: auto;padding: 0 0 0 18px;text-indent: 1em;">{{$t("服务协议和隐私政策3")}}</text>
				<br />
				<text style="height: auto;padding: 0 0 0 18px;text-indent: 1em;">{{$t("你可阅读")}}</text>
				<text class="link" @click="linkClick(1)">{{$t("服务协议")}}</text>{{$t("和")}}
				<text class="link" @click="linkClick(2)">{{$t("隐私政策")}}</text>{{$t("服务协议和隐私政策2")}}
			</view>
			<view class="btn">
				<button class="buttonst" @click="agree()">{{$t("下一步")}}</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				agreed: uni.getStorageSync('userAgreed') || false, // 检查用户是否已经同意隐私政策
				loginimg: '/static/icons/14.png'
			}
		},
		onShow() {
			let that = this
			const lan = uni.getLocale()
			// 根据语言设置登录图片
			that.loginimg = (lan === 'zh-Hans' || lan === "zh-Hant") ? '/static/icons/14.png' :
				'/static/icons/loginssss.png';
			if (that.agreed === true) {
				that.checkToken()
			}
		},

		methods: {
			checkToken() {
				uni.getStorageInfo({
					success: (res) => {
						const hasToken = res.keys.includes("token");
						// 统一处理延迟跳转
						const delay = 1500; // 建议1.5秒，或根据需求调整
						setTimeout(() => {
							if (hasToken) { // 可选：进一步验证token有效性
								this.validateTokenAndRedirect();
							} else {
								uni.redirectTo({
									url: '../login/login_land'
								});
							}
						}, delay);
					},
					fail: (err) => {
						console.error('获取存储信息失败:', err);
						// 失败时默认跳转到登录页（安全降级）
						setTimeout(() => {
							uni.redirectTo({
								url: '../login/login_land'
							});
						}, 2000);
					}
				});
			},
			// 新增：验证token有效性（可选增强）
			validateTokenAndRedirect() {
				// 如果有后端验证需求，可以在这里调用接口
				// 示例：简单检查token格式
				const token = uni.getStorageSync('token');
				if (!token || token.length < 10) {
					// token格式异常，清除并跳转登录
					uni.removeStorageSync('token');
					uni.redirectTo({
						url: '../login/login_land'
					});
					return;
				}
				// 验证通过，进入主页
				uni.switchTab({
					url: "../tabBar/main/Main"
				});
			},
			linkClick(num) {
				if (num === 1) {
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
				uni.setStorageSync('userAgreed', true) // 设置缓存，下次进入应用不再弹出
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			disagree() {
				uni.clearStorageSync('userAgreed'); // 用户拒绝隐私政策
				const platform = uni.getSystemInfoSync().platform;
				if (platform === "android") {
					plus.runtime.quit()
				} else {
					// #ifdef APP-PLUS
					plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
					// #endif
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
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
		color: #000000;
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
		height: 100vh;
		padding-top: calc(15vh);
		// width: 80vw;
		// border-radius: 16px;
		background-color: #fff;

		.title {
			text-align: center;
			line-height: 40px;
			font-size: 18px;
			font-weight: 600;
		}

		.content {
			margin-top: 20px;
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
			margin-top: calc(15vh);
			width: 100%;

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

	.buttonst {
		width: 50vw;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 20px 20px 20px;
		border-radius: 50px;
		background: #3298F7;
		font-size: 16px;
		font-weight: 600;
		color: white;
	}
</style>