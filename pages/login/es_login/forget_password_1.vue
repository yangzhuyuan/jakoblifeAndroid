<template>
	<view class="forget_password_bg">
		<view style="padding: 15px;">
			<view class="forget_password_back" @click="click_back()">
				<uni-icons type="back" size="21" style="color: white;"></uni-icons>
			</view>
			<view class="forget_password_title">Verify your</view>
			<view class="forget_password_title_1">mailbox</view>
			<view class="sign_in_input">
				<view class="sign_in_input_1">
					<image style="width: 26px; height: 26px;margin-left: 10px;" src="../../../static/emails.png">
					</image>
					<input class="sign_in_input_2" type="text" placeholder="Enter Your Email" v-model="email" />
				</view>
			</view>
		</view>
		<view class="forget_password_btn_1">
			<button class="forget_password_btn_2" @click="click_Verification()">Verification</button>
			<button class="forget_password_btn_3" @click="click_Later()">Later</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				email: ''
			}
		},
		methods: {
			click_back() {
				uni.navigateBack({
					delta: 1
				})
			},
			click_Verification() {
				if (this.email === "" || this.email === undefined) {
					uni.showToast({
						title: 'Please enter email',
						icon: 'none'
					})
					return
				} else {
					uni.navigateTo({
						url: '../../login/es_login/forget_password_2?email=' + this.email
					})
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
		margin: 20px 20px 40px 20px;
		font-weight: bold;
		font-size: 26px;
	}

	.sign_in_input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

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
		box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.1);
	}

	.sign_in_input_2 {
		margin-left: 10px;
		width: 55vw;

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

	.forget_password_btn_1 {
		display: flex;
		flex-direction: column;
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

	.forget_password_btn_3 {
		width: 80vw;
		margin-top: 20px;
		border-radius: 40px;
		background: #DBDBDB;
		color: white;
	}
</style>