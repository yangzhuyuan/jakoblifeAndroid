<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		version
	} from './package.json'
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';

	export default {
		onLaunch: function() {

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
				// this._i18n.locale = "zh-CN";
				this._i18n.locale = "en-US";
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
		margin-right: 10px;
	}

	//设置背景色
	checkbox.red[checked] .wx-checkbox-input,
	checkbox.red.checked .uni-checkbox-input {
		// background-color: #e54d42 !important;
		// border-color: #e54d42 !important;
		// color: #ffffff !important;
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