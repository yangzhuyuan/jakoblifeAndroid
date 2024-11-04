<template>
	<view class="container" v-if="isShow">
		<view class="modal">
			<view style="background: white;  margin-left: 20rpx;margin-right: 20rpx;border-radius: 20rpx;">
				<view style="text-align: center; color: black; font-weight: bold;padding: 20rpx;">请填写图形验证码</view>
				<view class="modal-content">
					<input type="text" placeholder="请输入图形验证码"
						style="margin-left: 15rpx;  padding: 15rpx; border-radius: 20rpx;margin-right: 20rpx;  background: gainsboro;"
						v-model="yzm" />
					<view>
						<view class="canvas-img-code">
							<canvas :style="{width:width+'px',height:height+'px'}" canvas-id="imgcanvas"></canvas>
						</view>
						<view style="text-align: center; color: dodgerblue;margin-top: 10rpx;" @click="clickCode">
							看不清？换一张
						</view>
					</view>
				</view>
				<view style="display: flex; flex-direction: row; height: 60rpx; border-top: 1rpx solid gray;">
					<view style="height: 35rpx; width: 50%; text-align: center; margin-top: 10rpx;"
						@click="closeModal_cancle">取消</view>
					<view style="border-left: 1rpx solid gray;"></view>
					<view style="height: 35rpx; width: 50%; text-align: center; margin-top: 10rpx; color: dodgerblue"
						@click="closeModal">确定</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "verify",
		props: {
			isShow: {
				type: Boolean,
				default: '',
			},
		},
		data() {
			return {
				yzm: '', //验证码
				width: 100,
				height: 35,
			}
		},

		
		mounted() {
			let that = this
			setTimeout(function(){
				that.initCode()
			},500)
		},




		methods: {
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
				// var pool = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "I", "M", "N", "O", "P",
				// 		"Q",
				// 		"R", "S",
				// 		"T", "U", "V", "W", "S", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
				// 	],
				var pool = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
					str = '';
				for (var i = 0; i < 4; i++) {
					var c = pool[this.rn(0, pool.length - 1)];
					var deg = this.rn(-30, 30);
					context.setFontSize(32);
					context.setTextBaseline("top");
					context.setFillStyle('black') //文字颜色：默认黑色
					// context.setFillStyle(this.rc(80, 150));
					context.save();
					context.translate(25 * i + 15, parseInt(h / 1.5));
					context.rotate(deg * Math.PI / 180);
					context.fillText(c, -15 + 5, -15);
					context.restore();
					str += c;
				}
				//生成的验证码在此写入缓存
				console.log('验证码：', str);

				uni.setStorageSync("imgcode", str)
				// uni.setStorage({
				// 	key: 'imgcode',
				// 	data: str,
				// });
				for (var i = 0; i < 40; i++) {
					context.beginPath();
					// context.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
					context.closePath();
					context.setFillStyle(this.rc(100, 150));
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
				this.initCode();
				this.$emit("closeModal_cancle", "false")
			},

			closeModal() {
				// .toLowerCase() //转成小写
				console.log('验证码', uni.getStorageSync('imgcode'));
				console.log('验证码', this.yzm);
				if (this.yzm != uni.getStorageSync('imgcode')) {
					uni.showToast({
						icon: 'none',
						title: '验证码错误',
					})
					return;
				} else {
					uni.showToast({
						icon: 'none',
						title: '验证码验证成功',
					})
					this.initCode();
					this.$emit("closeModal", "false")
				}

			}

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
</style>