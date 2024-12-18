<template>
	<view class="login_bg">
		<view class="login_title_1">Welcome To</view>
		<view class="login_title_2">JakobLife</view>
		<view class="login_btn">
			<button class="login_btn_1" @click="login()">Login</button>
			<button class="login_btn_2" @click="sign_up()">Sign up</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			login() {

			},
			sign_up() {

			}
		}
	}
</script>

<style>
	.login_bg {
		color: black;
		background: #F7F7F7;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.login_title_1 {
		font-size: 28px;
		font-weight: bold;
	}

	.login_title_2 {
		margin-top: 20px;
		font-size: 28px;
		font-weight: bold;
		margin-bottom: 80px;
	}

	.login_btn {
		position: fixed;
		bottom: 40px;
		width: 80vw;
		padding: 15px;
	}

	.login_btn_1 {
		border-radius: 40px;
		background: #3298F7;
		color: white;
	}

	.login_btn_2 {
		margin-top: 20px;
		border-radius: 40px;
		background: #DBDBDB;
		color: white;
	}
</style>