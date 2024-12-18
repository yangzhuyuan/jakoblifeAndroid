<template>
	<view class="forget_password_bg">
		<view style="padding: 15px;">
			<view class="forget_password_back" @click="click_back()">
				<uni-icons type="back" size="21" style="color: white;"></uni-icons>
			</view>
			<view class="forget_password_border">
				<view class="forget_password_title">Verify your</view>
				<view class="forget_password_title_1">mailbox</view>
				<view class="forget_password_title_2">We Have Sent Code To Your mailbox</view>
				<view class="forget_password_title_3">{{email}}</view>
				<view class="code-input-wrap">
					<input class="code-input" v-model="codeNumber" type="number" :adjust-position="false" :auto-blur="true"
						maxlength="4" @input="handleInputClick" />
					<view class="code-list">
						<block v-for="(item, index) in 4" :key="index">
							<view :class="['code-list-item', codeNumber.length == index ? 'active-item' : '']">
								{{ codeNumber[index] }}
							</view>
						</block>
					</view>
				</view>
				<view class="resending" v-if="isSending">{{ '重新发送(' + counter + 's)' }}</view>
				<view class="normal" v-else @click="handleResend">重新发送</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				email: '',
				phoneNumber: '',
				codeNumber: '',
				isPhoneValid: false,
				isCodeValid: false,
				isSending: false, // 验证码是否在发送中
				// 计时器对象
				timer: null,
				// 倒数60秒
				counter: 60


			}
		},
		onLoad(opt) {
			this.email = opt.email
		},
		methods: {
			// 输入验证码
			handleInputClick(e) {
				let val = e.detail.value
				this.codeNumber = val
				if (val && val.length == 6) {
					this.isCodeValid = true
				} else {
					this.isCodeValid = false
				}
			},
			// 获取验证码
			sendSmsCode() {
				if (this.isPhoneValid) {
					// 判断手机号格式是否符合要求
					if (!/^1[3456789]\d{9}$/.test(this.phoneNumber)) {
						uni.showToast({
							title: '手机号格式不正确',
							icon: 'none'
						})
						return false
					}
					// 判断复选框
					if (!this.isChecked) {
						this.showTips = true
						return false
					}
					// 调用接口，此处代码省略······
				}
			},
			// 倒计时
			countDown() {
				this.counter = 60
				this.isSending = true
				this.timer = setInterval(() => {
					this.counter--
					if (this.counter < 0) {
						this.reset()
					}
				}, 1000)
			},
			// 重置倒计时
			reset() {
				this.isSending = false
				if (this.timer) {
					clearInterval(this.timer)
					this.counter = 60
					this.timer = null
				}
			},
			// 重新发送
			handleResend() {
				this.codeNumber = ''
				this.sendSmsCode()
			}

		}
	}
</script>

<style lang="scss" scoped>
	.forget_password_bg {
		width: 100vw;
		height: 100vh;
		background: #F7F7F7;
		color: black;
	}

	.forget_password_back {
		height: 21px;
		width: 21px;
		padding: 5px;
		background: #3298F7;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20px;
		margin: 40px 10px 10px 10px;
	}

	.forget_password_border {
		margin: 40px 10px 10px 10px;
		background: white;
		padding: 10px;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.1);

	}

	.forget_password_title {
		margin: 40px 20px 0 20px;
		font-weight: bold;
		font-size: 26px;
	}

	.forget_password_title_1 {
		margin: 20px;
		font-weight: bold;
		font-size: 26px;
	}

	.forget_password_title_2 {
		color: gray;
	}

	.forget_password_title_3 {
		color: gray;
		margin-top: 40px;
	}


	// 验证码输入
	.code-input-wrap {
		width: 100vw;
		margin: 20px 0;
		position: relative;
		
		height: 50px;

		.code-input {
			position: absolute;
			left: 0;
			top: 0;
			border: 1px solid black;
			height: 50px;
			width: 100%;
			opacity: 0;
			z-index: 99;
			outline: none;
		}

		.code-list {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 50px;
			display: flex;
			justify-content: center;

			.code-list-item {
				// flex: 1;
				width: 50px;
				height: 50px;
				background: #ffffff;
				border-radius: 16rpx;
				font-size: 18px;
				font-weight: bold;
				color: #adb3ba;
				border: 2px solid gray;
				line-height: 50px;
				text-align: center;
				margin-right: 15px;
				z-index: 5;
				box-sizing: border-box;
			}

			.code-list-item:last-child {
				margin-right: 0;
			}

			.active-item {
				border: 2px solid #ff466d;
			}
		}
	}

	.resending {
		width: 60vw;
		text-align: right;
		font-size: 14px;
		font-weight: bold;
		line-height: 18px;
		margin-bottom: 30px;
		color: #a6acb2;
	}

	.normal {
		width: 60vw;
		text-align: right;
		font-size: 16px;
		line-height: 18px;
		margin-bottom: 30px;
		color: #333;
	}
</style>