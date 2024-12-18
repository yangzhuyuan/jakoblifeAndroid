<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		version
	} from './package.json'
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';

	export default {

		data() {
			return {
				stepCount: 0, //步数
				stepCount1: 0,
				lastTime: 0, //上次更新时河
				lastx: 0, // 上次x轴加速
				lasty: 0, // 上次r釉加速度
				lastz: 0, // 上次z釉细速度
			}
		},

		onLaunch: function() {


			//ios隐私政策
			// #ifdef APP-PLUS
			const platform = uni.getSystemInfoSync().osName
			// 判断是不是ios，并且是否同意了隐私政策
			let agree = uni.getStorageSync('agree')
			if (platform === 'android') {
				// plus.navigator.closeSplashscreen() // 关闭启动页
				// if (agree) {
				// 	uni.reLaunch({
				// 		url: "/pages/index/index",
				// 		success() {
				// 			plus.navigator.closeSplashscreen()
				// 		}
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: "pages/index/iosLogin",
				// 		success() {
				// 			plus.navigator.closeSplashscreen()
				// 		}
				// 	})
				// }
			} else {
				if (agree) {
					uni.reLaunch({
						url: "/pages/index/index",
						success() {
							plus.navigator.closeSplashscreen()
						}
					})
				} else {
					console.log('ios第一次启动需要同意隐私政策');
					// ios单独进行隐私政策验证
					uni.navigateTo({
						url: "pages/index/iosLogin",
						success() {
							plus.navigator.closeSplashscreen()
						}
					})
				}
			}
			// #endif





			let that = this


			that.accelerometerStart()











			const lan = uni.getLocale();
			console.log("语言ss", lan)
			if (lan == 'en') {
				this._i18n.locale = "en-US";
				console.log("1语言", lan)
			}
			if (lan == 'en-US') {
				this._i18n.locale = "en-US";
				console.log("2语言", lan)
			}
			if (lan == 'zh-Hans') {
				this._i18n.locale = "zh-CN";
				// this._i18n.locale = "en-US";
				console.log("3语言", lan)
			}


			// App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=4542
			// if (plus.runtime.appid !== 'HBuilder') { // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
			// 	checkUpdate()
			// }
		},
		onShow: function() {



			this.setTabBarItems()



			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		globalData: {
			test: ''
		},
		methods: {
			...mapMutations(['setUniverifyErrorMsg', 'setUniverifyLogin']),



			// 加速计
			accelerometerStart() {
				let that = this
				uni.onAccelerometerChange((res) => {
					const {
						x,
						y,
						z
					} = res;
					const xxx = x - that.lastx;
					const yyy = y - that.lasty;
					const zzz = z - that.lastz;
					that.lastx = x;
					that.lasty = y;
					that.lastz = z;

					const dele = Math.sqrt(xxx * xxx + yyy * yyy + zzz * zzz)
					if (dele > 1.5) {
						// 获跟当前时间
						const currentTime = new Date().getTime();
						// 判断是否是连续的两走，时间间隔小于秒
						if (currentTime - that.lastTime > 1000) {
							that.stepCount++; // 华数加1
							that.lastTime = currentTime; // 更每上次更新时间
						}
					}
					uni.setStorageSync("settept", that.stepCount)
					uni.getStorageInfo({
						success(ress) {
							if (ress.keys.includes("settept1")) {
								if (that.formatDate(new Date().getTime()) === "23:59:59" || that
									.formatDate(
										new Date()
										.getTime()) === "0:0:0") {
									uni.removeStorageSync("settept1")
								}
							}
						}
					})

				})
			},




			//时间戳转时间
			formatDate(value) {
				const data = new Date(value);
				const month = data.getMonth();
				const day = data.getDate();
				const year = data.getFullYear();
				const hours = data.getHours();
				const minutes = data.getMinutes();
				const seconds = data.getSeconds();
				const formattedTime = `${hours}:${minutes}:${seconds}`;
				return formattedTime;
			},

			// 修改底部导航
			setTabBarItems() {
				// 修改底部导航
				uni.setTabBarItem({
					index: 0,
					text: this.$t('shouye')
				});
				uni.setTabBarItem({
					index: 1,
					text: this.$t('qushi')
				});
				uni.setTabBarItem({
					index: 2,
					text: this.$t('gongxiang')
				});
				uni.setTabBarItem({
					index: 3,
					text: this.$t('wode')
				});
			}


		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import '@/static/customicons.css';



	//设置圆角
	checkbox.round .wx-checkbox-input,
	checkbox.round .uni-checkbox-input {
		border-radius: 100rpx;
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}


	checkbox.round1 .wx-checkbox-input,
	checkbox.round1 .uni-checkbox-input {
		border-radius: 50px;
		width: 20px;
		height: 20px;
	}

	//设置背景色(例如我这里是黄色的checkbox,我就设置一个checkbox.yellow)
	checkbox.yellow[checked] .wx-checkbox-input,
	checkbox.yellow.checked .uni-checkbox-input {
		background-color: #ffca28 !important;
		border-color: #ffca28 !important;
		color: #ffffff !important;
	}





	//设置背景色
	checkbox.red[checked] .wx-checkbox-input,
	checkbox.red.checked .uni-checkbox-input {
		background-color: #e54d42 !important;
		border-color: #e54d42 !important;
		color: #ffffff !important;
	}

	//元素使用的时候就是使用 round 和 red



	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body {
			overflow-y: scroll;
		}
	}

	/* 顶栏通栏样式 */
	/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

	uni-page-body {
		background-color: #F5F5F5 !important;
		min-height: 100% !important;
		height: auto !important;
	}




	.uni-top-window uni-tabbar .uni-tabbar {
		background-color: #fff !important;
	}

	.uni-app--showleftwindow .hideOnPc {
		display: none !important;
	}

	/* #endif */

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #efeff4;
		height: 100%;
		font-size: 28rpx;
		/* line-height: 1.8; */
	}

	.fix-pc-padding {
		padding: 0 50px;
	}

	.uni-header-logo {
		padding: 30rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.uni-header-image {
		width: 100px;
		height: 100px;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300rpx;
		background: #FFF;
		padding: 50rpx;
		margin-top: 10px;
		font-size: 38rpx;
		color: #808080;
	}

	/* #endif*/
</style>