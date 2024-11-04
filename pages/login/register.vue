<template>
	<view>
		<view style="justify-content: center;display:flex;padding-top: 40rpx;">中国移动提供认证服务</view>
		<view style="justify-content: center;display:flex;padding-top: 60rpx;font-size: 58rpx;font-weight: bold;">
			{{phone_number}}
		</view>

		<view style="flex-direction: row; display: flex; margin-top: 500rpx; margin-left: 100rpx;align-items: center;">
			<checkbox style="font-size: 28rpx;" color="#ffffff" class="round" activeBorderColor="#D2D2D2"
				activeBackgroundColor="blue" :checked="cb" @click="cb_tiaokuan">已阅读并同意
			</checkbox>
			<view style="color: cornflowerblue;font-size: 28rpx;" @tap="Service_Agreement">《中国移动认证服务条款》
			</view>
		</view>

		<button v-if="cb"
			style=" margin-top: 80rpx;margin-left: 40rpx;margin-right: 40rpx;background:skyblue; color: white; border-radius: 50rpx;font-weight: bold;"
			@click="True_Register1()">确定注册</button>
		<button v-else
			style=" margin-top: 80rpx;margin-left: 40rpx;margin-right: 40rpx;background:gainsboro; color: white; border-radius: 50rpx;font-weight: bold;"
			@click="True_Register2()">确定注册</button>

		<button
			style=" font-weight: bold; margin-top: 40rpx;margin-left: 40rpx;margin-right: 40rpx; color: black;font-weight: bold;background-color: white;border: 4rpx solid gray; border-radius: 50rpx;">其他方式登录</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone_number: "111****22",
				cb: false,


			}
		},

		onLoad() {
			plus.android.importClass('android.telephony.TelephonyManager')
			let context = plus.android.importClass('android.content.Context');
			let TelephonyManager = plus.android.runtimeMainActivity().getSystemService(context.TELEPHONY_SERVICE);
			let phoneNumber = TelephonyManager.getLine1Number();
			this.phone_number = phoneNumber.replace(/^\+86/, '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			console.log(`手机号:${phoneNumber}`);
		},

		methods: {
			True_Register1() {
				// uni.navigateTo({
				// 	url: '/pages/login/true_register?phone=' + this.phone_number
				// })
		
			},
			True_Register2() {
				uni.showToast({
					title: "请您阅读并同意以上条款",
					icon: 'none'
				})
				return
				

			},


		

			cb_tiaokuan() {
				if (this.cb == true) {
					this.cb = false
				} else {
					this.cb = true
				}
			},
		}
	}
</script>

<style>

</style>