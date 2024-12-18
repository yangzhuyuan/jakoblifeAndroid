<template>
	<view>
		<!-- 扫码页面 -->
		<view style="width: 90%;height: 300px;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				barcode: null,
				flash: false,
				scanBarVew: null,
				tip: '将二维码放入框中，即可自动扫描',
			}
		},
		onShow() {
			// 页面展示时，重新启动扫描检测
			if (this.barcode) {
				console.log('onShow')
				this.barcode.start()
			}
		},
		async mounted() {
			try {
				// plus.navigator.setFullscreen(true); //全屏
				// 创建相机
				let currentWebview = this.$mp.page.$getAppWebview();
				this.createBarcode(currentWebview)
				// this.createTipInfoView(currentWebview)
				this.createFlashBarView(currentWebview)

			} catch (error) {
				console.log(error)
			}
		},
		methods: {
			/**
			 * 创建二维码
			 * @param {Object} currentWebview
			 */
			createBarcode(currentWebview) {
				if (!this.barcode) {
					//条码类型常量数组，默认情况支持QR、EAN13、EAN8类型。 通过此参数可设置扫码识别支持的条码类型（注意：设置支持的条码类型越多，扫描识别速度可能将会降低）
					this.barcode = plus.barcode.create('barcode', [plus.barcode.QR, plus.barcode.CODABAR, plus.barcode
						.UPCA, plus.barcode.CODE39, plus.barcode.CODE93, plus.barcode.CODE128
					], {
						top: '90px',
						left: '20px',
						width: '90%',
						height: '300px',
						scanbarColor: '#87ceeb',
						frameColor: '#87ceeb',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					});
					this.barcode.onmarked = this.onmarked;
					this.barcode.setFlash(this.flash);
					//此处未演示扫码成功回调的地址设置，实际请参考HTML5Plus API自行处理
					//注意扫码区域需为正方形，否则影响扫码识别率
					currentWebview.append(this.barcode);
				}
				this.barcode.start()
			},

			/**
			 * 创建提示信息
			 * @param {Object} currentWebview
			 */
			createTipInfoView(currentWebview) {
				const content = new plus.nativeObj.View('content', {
						top: '0px',
						left: '0px',
						height: '100%',
						width: '100%'
					},
					[{
						tag: 'font',
						id: 'scanTips',
						text: this.tip,
						textStyles: {
							size: '14px',
							color: '#ffffff',
							whiteSpace: 'normal'
						},
						position: {
							top: '90px',
							left: '10%',
							width: '80%',
							height: 'wrap_content'
						}
					}]);
				currentWebview.append(content);

			},
			// 创建 开关灯按钮
			createFlashBarView(currentWebview) {
				const openImg = this.crtFlashImg()
				const closeImg = this.crtFlashImg2()
				this.scanBarVew = new plus.nativeObj.View('scanBarVew', {
						top: '28%',
						left: '40%',
						height: '16%',
						width: '20%',
					},
					closeImg);
				this.scanBarVew.interceptTouchEvent(true);
				currentWebview.append(this.scanBarVew);
				this.scanBarVew.addEventListener("click", (e) => { //点亮手电筒
					this.flash = !this.flash;
					if (this.flash) {
						this.scanBarVew.draw(openImg);
					} else {
						this.scanBarVew.draw(closeImg)
					}
					if (this.barcode) {
						this.barcode.setFlash(this.flash);
					}
				}, false)


			},


			crtFlashImg() {
				return [{
						tag: 'img',
						id: 'scanBar',
						src: 'static/shoudiantong2.png',
						position: {
							top: '60%',
							width: '30px',
							left: '30%',
							height: '20%',
						}
					},
					{
						tag: 'font',
						id: 'font',
						text: '关闭',
						textStyles: {
							size: '12px',
							color: '#ffffff'
						},
						position: {
							top: '50px',
							width: '80%',
							left: '10%'
						}
					}
				]
			},
			crtFlashImg2() {
				return [{
						tag: 'img',
						id: 'scanBar',
						src: 'static/shoudiantong.png',
						position: {
							top: '60%',
							width: '30px',
							left: '30%',
							height: '20%',
						}
					},
					{
						tag: 'font',
						id: 'font',
						text: '打开',
						textStyles: {
							size: '12px',
							color: '#ffffff'
						},
						position: {
							top: '50px',
							width: '80%',
							left: '10%'
						}
					}
				]
			},
			crtFlashImg3() {
				return [{
						tag: 'img',
						id: 'scanBar',
						position: {
							top: '50%',
							width: '20px',
							left: '30%',
							height: '20%',
						}
					},
					{
						tag: 'font',
						id: 'font',
						textStyles: {
							size: '12px',
							color: '#ffffff'
						},
						position: {
							top: '20px',
							width: '80%',
							left: '10%'
						}
					}
				]
			},
			// 扫码成功回调
			onmarked(type, result) {
				// this.barcode.cancel()
				this.barcode.close()
				this.scanBarVew.interceptTouchEvent(false);
				this.scanBarVew.draw(this.crtFlashImg3())
				this.$emit('getCode', result)
				// 3秒后再次执行扫码

			}
		},

	}
</script>

<style scoped lang="scss">

</style>