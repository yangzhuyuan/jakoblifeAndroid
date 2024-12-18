<template>
	<view class="forget_password_bg">
		<view style="padding: 15px;">
			<view class="forget_password_back">
				<uni-icons type="back" size="21" style="color: white;"></uni-icons>
			</view>
			<view class="forget_password_title">Forget Password</view>
			<view class="forget_password_title_1">Select which contact details should we use to reset your password
			</view>
			<view class="forget_password_btn" :style="getborder(btn)" @click="click_email()">
				<view class="forget_password_img_btn">
					<image class="forget_password_img" src="../../../static/page_icon/emails.png">
					</image>
				</view>
				<view>
					<view style="font-size: 20px;font-weight: bold;">Email</view>
					<view style="margin-top: 5px;color: gray;">Code Send to your email</view>
				</view>
			</view>
			<view class="forget_password_btn" :style="getborder1(btn1)" @click="click_phone()">
				<view class=" forget_password_img_btn">
					<image class="forget_password_img" src="../../../static/page_icon/phones.png">
					</image>
				</view>
				<view>
					<view style="font-size: 20px;font-weight: bold;">Phone</view>
					<view style="margin-top: 5px;color: gray;">Code Send to your phone</view>
				</view>
			</view>
		</view>
		<view class="forget_password_btn_1">
			<button class="forget_password_btn_2" :style="getborder3()" @click="click_next()">Next</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				btn: '0',
				btn1: '0'
			}
		},
		methods: {
			click_email() {
				this.btn = "1"
				this.btn1 = "0"
			},
			click_phone() {
				this.btn = "0"
				this.btn1 = "1"
			},
			getborder(id) {
				return {
					border: id === "0" ? '' : '2px solid #65B1F9'
				}
			},
			getborder1(id) {
				return {
					border: id === "0" ? '' : '2px solid #65B1F9'
				}
			},
			getborder3() {
				return {
					background: this.btn === "0" && this.btn1 === "0" ? '#DBDBDB' : '#3298F7'
				}
			},
			click_next() {
				if (this.btn === "0" && this.btn1 === "0") {
					uni.showToast({
						title: "Please select a reset mode",
						icon: 'none'
					})
					return
				} else if (this.btn === "1") {
					uni.navigateTo({
						url:'../../login/es_login/forget_password_1'
					})
				} else if (this.btn1 === "1") {

				}
			}
		}
	}
</script>

<style>
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

	.forget_password_title {
		margin: 40px 20px 0 20px;
		font-weight: bold;
		font-size: 26px;
	}

	.forget_password_title_1 {
		margin: 15px 20px 40px 20px;
		color: gray;
	}

	.forget_password_btn {
		margin: 20px 15px 0 15px;
		padding: 10px;
		border-radius: 10px;
		background: white;
		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;
		box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.1);
	}


	.forget_password_img_btn {
		width: 48px;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 48px;
		background: #DBDBDB;
		padding: 5px;
		margin-right: 15px;
	}

	.forget_password_img {
		width: 32px;
		height: 32px;
	}


	.forget_password_btn_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 100vw;
		bottom: 40px;
	}

	.forget_password_btn_2 {
		width: 80vw;
		border-radius: 40px;
		background: #3298F7;
		color: white;
	}
</style>