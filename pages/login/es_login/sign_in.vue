<template>
	<view class="sign_in_bg">
		<view style="padding: 15px;">
			<view class="sign_in_back">
				<uni-icons type="back" size="21" style="color: white;"></uni-icons>
			</view>
			<view class="sign_in_input">
				<view class="sign_in_input_title">Sign In</view>
				<view class="sign_in_input_1">
					<image style="width: 26px; height: 26px;margin-left: 10px;" src="../../../static/emails.png">
					</image>
					<input class="sign_in_input_2" type="text" placeholder="Enter Your Email" />
				</view>
				<view class="sign_in_input_1">
					<image style="width: 26px; height: 26px;margin-left: 10px;" src="../../../static/icons/16.png">
					</image>
					<input class="sign_in_input_2" type="text" :password=isPassword placeholder="Password" />
					<image class="img_style" :src="isPassword ? urlicon1 : urlicon2" @click="img_mima()" />
				</view>
			</view>

			<button class="sign_in_btn" @click="Sign_in()">Sign In</button>

			<view class="sign_in_input_title_1">
				<view>Create New Account？</view>
				<view style="color: #3298F7;" @click="Sign_up()">Sign up</view>
			</view>
		</view>
		<view class="sign_in_with_other">
			<view class="sign_in_with">
				<view class="sign_in_with_border"></view>
				<view style="margin-left: 10px;margin-right: 10px;">sign in with</view>
				<view class="sign_in_with_border"></view>
			</view>
			<view class="sign_in_with_1">
				<image class="img_dsf_1" src="../../../static/icons/facebook.png" />
				<image class="img_dsf_2" src="../../../static/icons/guge.png" />
				<image class="img_dsf_1" src="../../../static/icons/pinguo.png" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isPassword: true,
				urlicon1: "../../../static/icons/mima_1.png", //密码可见iocn
				urlicon2: "../../../static/icons/mima_2.png", //密码不可见icon
			}
		},
		methods: {
			//判断点击密码是否可见
			img_mima() {
				if (this.isPassword == true) {
					this.isPassword = false
				} else {
					this.isPassword = true
				}
			},
			Sign_in() {

			},
			Sign_up() {

			}
		}
	}
</script>

<style>
	.sign_in_bg {
		width: 100vw;
		height: 100vh;
		background: #F7F7F7;
		color: black;
	}

	.sign_in_back {
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

	.sign_in_input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.sign_in_input_title {
		width: 100%;
		text-align: left;
		margin: 40px 0 20px 20px;
		font-weight: bold;
		font-size: 24px;
	}

	.sign_in_input_1 {
		margin-top: 20px;
		width: 80vw;
		border-radius: 40px;
		padding: 10px;
		display: flex;
		justify-content: left;
		align-items: center;
		background: white;
	}

	.sign_in_input_2 {
		margin-left: 10px;
		width: 55vw;
	}

	.img_style {
		margin-left: 20px;
		width: 22px;
		height: 22px;
	}

	.sign_in_btn {
		color: white;
		border-radius: 40px;
		width: 85vw;
		background: #3298F7;
		margin-top: 40px;
	}

	.sign_in_input_title_1 {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.sign_in_with_other {
		width: 100vw;
		position: fixed;
		bottom: 60px;
	}

	.sign_in_with {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.sign_in_with_1 {
		margin-top: 30px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.sign_in_with_border {
		width: 80px;
		height: 1px;
		background: gainsboro;
	}

	.img_dsf_1 {
		border-radius: 20px;
		height: 40px;
		width: 40px;
	}

	.img_dsf_2 {
		border-radius: 20px;
		height: 40px;
		width: 40px;
		margin-left: 30px;
		margin-right: 30px;
	}
</style>