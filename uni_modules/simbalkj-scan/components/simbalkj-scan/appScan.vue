<template>
	<view class="scan-container">
		<view class="scan-view" :style="{ width: width, height: height }"></view>
	</view>
</template>

<script>
	export default {
		props: {
			width: {
				type: String,
				default: '90%'
			},
			height: {
				type: String,
				default: '300px'
			}
		},
		data() {
			return {
				barcode: null,
				flash: false,
				scanBarVew: null,
				tip: '将二维码放入框中，即可自动扫描',
			};
		},
		onShow() {
			// 重置状态
			this.resetState();
			// 页面展示时，重新启动扫描检测
			if (this.barcode) {
				console.log('onShow');
				this.barcode.start();
			}
		},
		beforeDestroy() {
			// 清理资源
			this.resetState();
		},
		async mounted() {
			try {
				this.initBarcode();
			} catch (error) {
				console.error("初始化失败", error);
			}
		},
		methods: {
			resetState() {
				if (this.barcode) {
					this.barcode.cancel();
					this.barcode.close();
					this.barcode = null;
				}
				if (this.scanBarVew) {
					this.scanBarVew.close();
					this.scanBarVew = null;
				}
			},
			initBarcode() {
				let currentWebview = this.$mp.page.$getAppWebview();
				this.createBarcode(currentWebview);
				this.createFlashBarView(currentWebview);
			},
			createBarcode(currentWebview) {
				if (!this.barcode) {
					this.barcode = plus.barcode.create(
						"barcode",
						[
							plus.barcode.QR,
							plus.barcode.CODABAR,
							plus.barcode.UPCA,
							plus.barcode.CODE39,
							plus.barcode.CODE93,
							plus.barcode.CODE128
						], {
							top: "30px",
							left: "20px",
							width: this.width,
							height: this.height,
							scanbarColor: "#87ceeb",
							frameColor: "#87ceeb",
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}
					);
					this.barcode.onmarked = this.onmarked;
					this.barcode.setFlash(this.flash);
					currentWebview.append(this.barcode);
				}
				this.barcode.start();
			},
			createFlashBarView(currentWebview) {
				const openImg = this.crtFlashImg();
				const closeImg = this.crtFlashImg2();
				this.scanBarVew = new plus.nativeObj.View("scanBarVew", {
					top: "28%",
					left: "40%",
					height: "16%",
					width: "20%"
				}, closeImg);
				this.scanBarVew.interceptTouchEvent(true);
				currentWebview.append(this.scanBarVew);
				this.scanBarVew.addEventListener("click", (e) => {
					this.flash = !this.flash;
					if (this.flash) {
						this.scanBarVew.draw(openImg);
					} else {
						this.scanBarVew.draw(closeImg);
					}
					if (this.barcode) {
						this.barcode.setFlash(this.flash);
					}
				}, false);
			},
			crtFlashImg() {
				return [{
						tag: "img",
						id: "scanBar",
						src: "static/shoudiantong2.png",
						position: {
							top: "60%",
							width: "30px",
							left: "30%",
							height: "20%"
						}
					},
					{
						tag: "font",
						id: "font",
						text: "关闭",
						textStyles: {
							size: "12px",
							color: "#ffffff"
						},
						position: {
							top: "50px",
							width: "80%",
							left: "10%"
						}
					}
				];
			},
			crtFlashImg2() {
				return [{
						tag: "img",
						id: "scanBar",
						src: "static/shoudiantong.png",
						position: {
							top: "60%",
							width: "30px",
							left: "30%",
							height: "20%"
						}
					},
					{
						tag: "font",
						id: "font",
						text: "打开",
						textStyles: {
							size: "12px",
							color: "#ffffff"
						},
						position: {
							top: "50px",
							width: "80%",
							left: "10%"
						}
					}
				];
			},
			removeFlashBarView() {
				if (this.scanBarVew) {
					this.scanBarVew.close();
					this.scanBarVew = null;
				}
			},
			onmarked(type, result) {
				this.barcode.cancel();
				this.barcode.close();
				this.scanBarVew.interceptTouchEvent(false);
				this.removeFlashBarView();
				this.$emit('getCode', result);
			}
		}
	};
</script>

<style scoped lang="scss">
	.scan-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.scan-view {
		background-color: #000;
	}
</style>