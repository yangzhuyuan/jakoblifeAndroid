<template>
	<view>
		<view style="padding-top: 40px;">
			<text style="margin-left: 40px;color: gray;">请输入您的想新绑定的手机号码</text>
			<view class="bg">
				<image class="login-logo" style="margin-left: 10px;  width: 20px ; height: 20px; "
					src="../../../static/icons/phone.png">
				</image>
				<input type="number" placeholder="请输入手机号" style="width: 80%;margin-left: 15rpx; " maxlength="11"
					v-model="unername_phone" />
			</view>
			<view class="bg">
				<image class="login-logo" style="margin-left: 10px;  width: 20px ; height: 20px; "
					src="../../../static/icons/yanzhengma.png">
				</image>
				<input type="text" placeholder="请输入验证码" style="margin-left: 15rpx;" maxlength="8"
					v-model="yanzhengma" />

				<button v-if="phone_YZ" :disabled="dis"
					style="font-size: 22rpx;text-align: center;width: 40%; border-radius: 30rpx; background: skyblue; color: white;"
					@tap="huoqu">{{yanzheng?'获取验证码': codetime+msg}}</button>
				<button v-else :disabled="dis"
					style="font-size: 22rpx;text-align: center;width: 40%; border-radius: 30rpx; background: gainsboro; color: white;"
					@tap="huoqu">{{yanzheng?'获取验证码': codetime+msg}}</button>
			</view>


			<button
				style=" margin-top: 80rpx;margin-left: 40rpx;margin-right: 40rpx;background:skyblue; color: white; border-radius: 50rpx;font-weight: bold;"
				@tap="btn_next">确定</button>
		</view>

		<view class="container" v-show="tanchuang">
			<view class="modal">
				<view style="background: white;  margin-left: 20rpx;margin-right: 20rpx;border-radius: 20rpx;">
					<view style="text-align: center; color: black; font-weight: bold;padding: 20rpx;">请填写图形验证码</view>
					<view class="modal-content">
						<input type="text" placeholder="请输入图形验证码"
							style="margin-left: 15rpx;  padding: 15rpx; border-radius: 20rpx;margin-right: 20rpx;  background: gainsboro;"
							v-model="yzm" />
						<view>
							<view>
								<canvas :style="{width:width+'px',height:height+'px'}" canvas-id="imgcanvas"></canvas>
							</view>
							<view style="text-align: center; color: dodgerblue;margin-top: 10rpx;" @click="clickCode">
								看不清？换一张
							</view>
						</view>
					</view>
					<view style="display: flex; flex-direction: row; 
					 border-top: 1rpx solid gainsboro;">
						<view style="height: 35rpx; width: 50%; text-align: center; padding: 20rpx;"
							@click="closeModal_cancle">取消</view>
						<view style="border-left: 1rpx solid gainsboro;"></view>
						<view style="height: 35rpx; width: 50%; text-align: center; padding: 20rpx; color: dodgerblue"
							@click="closeModal">确定</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				phone_YZ: true,
				msg: 's后可重发',
				dis: false,
				unername_phone: '',
				yanzheng: 1,
				codetime: 0,
				tanchuang: false,
				width: 100,
				height: 35,
				yzm: '',
			}
		},



		onShow() {
			let that = this;
			setTimeout(function() {
				that.initCode();
			}, 500)
		},



		methods: {
			huoqu() {
				if (this.unername_phone == "" || this.unername_phone == undefined) {
					uni.showToast({
						title: '请输入会员或绑定的手机号',
						icon: 'none'
					})
					return
				}
				this.tanchuang = true
				let that = this;
				setTimeout(function() {
					that.initCode();
				}, 500)
			},

			// 初始化验证码
			initCode() {
				console.log('start');
				var context = uni.createCanvasContext('imgcanvas', this),
					w = this.width,
					h = this.height;
				context.setFillStyle("white");
				context.font = "bold 20rpx Arial";
				context.setLineWidth(5);
				context.fillRect(0, 0, w, h);
				var pool = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
					str = '';
				for (var i = 0; i < 4; i++) {
					var c = pool[this.rn(0, pool.length - 1)];
					var deg = this.rn(-30, 30);
					context.setFontSize(32);
					context.setTextBaseline("top");
					// context.setFillStyle(this.rc(80, 150));
					context.setFillStyle('black') //文字颜色：默认黑色
					context.save();
					context.translate(25 * i + 15, parseInt(h / 1.5));
					context.rotate(deg * Math.PI / 180);
					context.fillText(c, -15 + 5, -15);
					context.restore();
					str += c;
				}
				//生成的验证码在此写入缓存
				console.log('验证码：', str);
				uni.setStorage({
					key: 'imgcode',
					data: str,
				});
				for (var i = 0; i < 40; i++) {
					context.beginPath();
					// context.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
					context.closePath();
					context.setFillStyle(this.rc(150, 200));
					context.fill();
				}
				context.draw();
				console.log('end');
			},
			rc(min, max) {
				var r = this.rn(min, max);
				var g = this.rn(min, max);
				var b = this.rn(min, max);
				return "rgb(" + r + "," + g + "," + b + ")";
			},
			rn(max, min) {
				return parseInt(Math.random() * (max - min)) + min;
			},

			//点击验证码，切换
			clickCode() {
				this.initCode();
			},

			closeModal_cancle() {
				this.tanchuang = false
				this.initCode();

			},


			closeModal() {
				if (this.yzm != uni.getStorageSync('imgcode')) {
					uni.showToast({
						icon: 'none',
						title: '验证码错误',
					})
					return;
				} else {
					this.initCode();
					this.tanchuang = false
					this.mm_yzm = false
					this.yanzheng = 0
					if (this.codetime > 0) {
						uni.showToast({
							title: '不能重复获取',
							icon: "none"
						})
						return
					} else {
						this.phone_YZ = false;
						this.dis = true
						this.codetime = 60
						let timer = setInterval(() => {
							this.codetime-- + this.meg;
							if (this.codetime < 1) {
								clearInterval(timer);
								this.meg = ''
								this.codetime = "重新获取"
								this.dis = false
								this.phone_YZ = true;
							}
						}, 1000)
					}
				}
			},

			btn_next() {
				uni.navigateTo({
					url: '/pages/tabBar/my/New_number_binding_1'
				})
			},

			verify() {

			},

		}
	}
</script>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: #fff;
		padding: 20px;
		display: flex;
		flex-direction: row;
		border-radius: 8px;
	}

	.bg {
		align-items: center;
		height: 35px;
		background-color: white;
		border-radius: 50px;
		margin: 20px 30px 0 30px;
		padding: 5px;
		flex-direction: row;
		display: flex;
	}
</style>