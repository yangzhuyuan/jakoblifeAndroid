<template>
	<view style="padding-top: 80rpx;">
		<view style="font-size: 22rpx; color: darkblue; padding-top: 180rpx; padding-left: 80rpx;">用户名（注：用户名即登陆APP的账号）
		</view>

		<view
			style="align-items: center; height: 50rpx; background-color: white; border-radius: 50rpx;margin-left: 80rpx; margin-right: 80rpx;margin-top: 20rpx; padding: 20rpx;flex-direction: row; display: flex;">
			<image class="login-logo" style="  width: 40rpx ; height: 40rpx; " src="../../static/icons/17.png"></image>
			<input type="text" :password=isPassword placeholder="您的手机号" style="margin-left: 15rpx;"
				v-model="phone" />
		</view>
		<view
			style="align-items: center; height: 50rpx; background-color: white; border-radius: 50rpx;margin-left: 80rpx; margin-right: 80rpx;margin-top: 40rpx;padding: 20rpx;flex-direction: row; display: flex;">
			<image class="login-logo" style="  width: 40rpx ; height: 40rpx; " src="../../static/icons/16.png"></image>
			<input type="text" placeholder="请输入验证码" style="margin-left: 15rpx;" maxlength="8" v-model="yanzhengma" />
			<button :disabled='disables'
				style="font-size: 22rpx;text-align: center;width: 40%; border-radius: 30rpx; background: skyblue; color: white;"
				@tap='doGetCode'>{{yanzheng?'获取验证码': djtime}}</button>
		</view>
		<button
			style=" margin-top: 120rpx;margin-left: 40rpx;margin-right: 40rpx;background:skyblue; color: white; border-radius: 50rpx;font-weight: bold;"
			@click="True_Register()">确定注册</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone:"",
				yanzheng: "0",
				disables:false,
			}
		},

		methods: {
			doGetCode: function() {
				var that = this;
				this.disables = true;
				var phone = this.phone;
				var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
				var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
				var phone = that.data.phone;
				var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
				var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
				wx.request({
					url: '', //后端判断是否已被注册， 已被注册返回1 ，未被注册返回0
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						that.setData({
							state: res.data
						})
						if (phone == '') {
							warn = "号码不能为空";
						} else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
							warn = "手机号格式不正确";
						} //手机号已被注册提示信息
						else if (that.data.state == 1) { //判断是否被注册
							warn = "手机号已被注册";

						} else {
							wx.request({
								url: '', //填写发送验证码接口
								method: "POST",
								data: {
									coachid: that.data.phone
								},
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								success: function(res) {
									console.log(res.data)
									that.VerificationCode = res.data.verifycode
									//当手机号正确的时候提示用户短信验证码已经发送
									wx.showToast({
										title: '短信验证码已发送',
										icon: 'none',
										duration: 2000
									});
									//设置一分钟的倒计时
									var interval = setInterval(function() {
										currentTime--; //每执行一次让倒计时秒数减一
										that.setData({
											text: currentTime +
												's', //按钮文字变成倒计时对应秒数

										})
										//如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
										if (currentTime <= 0) {
											clearInterval(interval)
											that.setData({
												text: '重新发送',
												currentTime: 61,
												disabled: false,
												color: '#33FF99'
											})
										}
									}, 100);
								}
							})
						};
						//判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
						if (warn != null) {
							wx.showModal({
								title: '提示',
								content: warn
							})
							that.setData({
								disabled: false,
								color: '#33FF99'
							})
							return;
						}
					}

				})
			},

		}
	}
</script>

<style>
</style>