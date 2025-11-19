<template>
	<view>
		<!-- 当前区号展示区 -->
		<view class="picker-display" @click="open">
			<image v-if="currentSelectInfo.code" class="flag" :src="getFlagSrc(currentSelectInfo.code)"
				mode="widthFix" />
			<text class="code">+{{ currentSelectInfo.dial_code || "--" }}</text>
		</view>
		<!-- 遮罩和弹窗 -->
		<view v-show="mountedshow" class="popup-mask" @touchmove.stop.prevent @click="onMaskClick">
			<view class="popup-panel" :class="[`popup-panel--${position}`, { 'popup-panel--show': showPopup }]"
				:style="panelStyle" @transitionend="onAnimEnd" @click.stop>
				<!-- 顶部标题/取消 -->
				<view class="popup-header">
					<text class="title">{{ title }}</text>
					<text class="cancel" @click="close">{{ cancelText }}</text>
				</view>

				<!-- 搜索 -->
				<view class="popup-search">
					<input class="search-input" v-model="search" :placeholder="searchPlaceholder"
						@keyup.enter="clearSearch" />
				</view>

				<!-- 列表 -->
				<scroll-view scroll-y class="popup-list">
					<view v-for="item in filteredList" :key="item.code + item.dial_code" class="popup-item"
						@click="select(item)">
						<image class="flag" :src="getFlagSrc(item.code)" mode="widthFix"></image>
						<text>{{item.name }}</text>
						<text class="name">（{{ item.localName }}）</text>
						<text class="code">+{{ item.dial_code }}</text>
					</view>
					<view class="safe-area-bottom-height"></view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		countryListCN,
		countryListEN
	} from './country-data.js'
	/* 获取 IP 对应国家码（带超时） */
	function getCountryByIP() {
		return new Promise(resolve => {
			const timer = setTimeout(() => resolve(""), 4000);
			uni.request({
				url: "https://ip-api.com/json/?fields=status,countryCode",
				method: "GET",
				success: res => {
					clearTimeout(timer);
					if (res.data && res.data.status === "success") {
						resolve(res.data.countryCode);
					} else {
						resolve("");
					}
				},
				fail: () => {
					clearTimeout(timer);
					resolve("");
				}
			});
		});
	}

	/* ---------- 3. 返回对应语言包 ---------- */
	function getLocalePack() {
		const lan = uni.getLocale();
		switch (lan) {
			case 'en':
			case 'en-US':
				return countryListEN; // 网络失败默认中文
				break;
			case 'zh-Hans':
				return countryListCN; // 网络失败默认中文
				break;
		}
	}


	export default {
		name: "aure-country-picker",
		props: {
			modelValue: [String, Number],
			defaultCountryCode: {
				type: String,
				default: ""
			},
			cancelText: {
				type: String,
				default: "取消"
			},
			searchPlaceholder: {
				type: String,
				default: "搜索国家或地区"
			},
			title: {
				type: String,
				default: "选择国家/地区"
			},
			height: {
				type: String,
				default: "80vh"
			},
			width: {
				type: String,
				default: "80vw"
			},
			duration: {
				type: Number,
				default: 300
			},
			maskClosable: {
				type: Boolean,
				default: true
			},
			round: {
				type: Boolean,
				default: true
			},
			radius: {
				type: String,
				default: "24rpx"
			},
			position: {
				type: String,
				default: "bottom",
				validator: v => ["bottom", "top", "left", "right"].includes(v)
			},
		},
		data() {
			return {
				currentSelectInfo: {
					name: "",
					code: "",
					dial_code: "",
					localName: ""
				},
				mountedshow: false,
				showPopup: false,
				search: "",
				realCountryList: [] // 先空，等异步
			};
		},
		computed: {

			filteredList() {
				const key = this.search.trim().toLowerCase();
				if (!key) return this.realCountryList;
				return this.realCountryList.filter(
					item =>
					item.name.toLowerCase().includes(key) ||
					item.localName.toLowerCase().includes(key) ||
					item.code.toLowerCase().includes(key) ||
					item.dial_code.startsWith(key)
				);
			},
			panelStyle() {
				const style = {
					transition: `transform ${this.duration}ms cubic-bezier(.4,0,.2,1)`
				};
				if (this.position === "bottom" || this.position === "top") {
					style.width = "100vw";
					style.height = this.height;
				} else {
					style.width = this.width;
					style.height = "100vh";
				}
				if (this.round) {
					const r = this.radius;
					if (this.position === "bottom") style.borderRadius = `${r} ${r} 0 0`;
					if (this.position === "top") style.borderRadius = `0 0 ${r} ${r}`;
					if (this.position === "left") style.borderRadius = `0 ${r} ${r} 0`;
					if (this.position === "right") style.borderRadius = `${r} 0 0 ${r}`;
				}
				return style;
			}
		},
		methods: {
			async initDefault() {
				this.realCountryList = await getLocalePack(); // 关键
				if (this.modelValue) {
					this.setByDialCode(this.modelValue);
					return;
				}
				const code = await getCountryByIP();
				this.setByCountryCode(code || this.defaultCountryCode);
			},
			setByDialCode(dial) {
				const list = this.realCountryList.filter(
					i => String(i.dial_code) === String(dial)
				);
				if (list.length === 1) {
					this.currentSelectInfo = list[0];
				} else if (list.length > 1 && this.defaultCountryCode) {
					const one = list.find(i => i.code === this.defaultCountryCode.toUpperCase());
					this.currentSelectInfo = one || list[0];
				} else if (list.length) {
					this.currentSelectInfo = list[0];
				}
			},
			setByCountryCode(code) {
				const one = this.realCountryList.find(i => i.code === code.toUpperCase());
				if (one) this.currentSelectInfo = one;
			},
			open() {
				this.mountedshow = true;
				this.$nextTick(() => setTimeout(() => (this.showPopup = true), 20));
			},
			close() {
				this.showPopup = false;
			},
			onMaskClick() {
				if (this.maskClosable) this.close();
			},
			onAnimEnd() {
				if (!this.showPopup) {
					this.mountedshow = false;
					this.search = "";
				}
			},
			select(item) {
				this.$emit("update:modelValue", item.dial_code);
				this.$emit("change", item);
				this.currentSelectInfo = item;
				this.close();
			},
			getFlagSrc(code) {
				return `/uni_modules/aure-country-picker/static/flags/${code.toLowerCase()}.png`;
			},
			clearSearch() {
				this.search = "";
			}
		},
		mounted() {
			this.initDefault();
		}
	};
</script>
<style scoped>
	/* 选择显示区 */
	.picker-display {
		display: flex;
		align-items: center;
		padding: 20rpx 32rpx;
		border-radius: 12rpx;
		background: #fff;
		cursor: pointer;
	}

	.flag {
		width: 36rpx;
		margin-right: 12rpx;
	}

	.code {
		font-size: 28rpx;
	}

	.arrow {
		margin-left: auto;
		color: #bbb;
		font-size: 30rpx;
	}

	/* 遮罩层 */
	.popup-mask {
		position: fixed;
		z-index: 9999;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.45);
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	/* 弹窗内容：四方向动画（无三方依赖） */
	.popup-panel {
		background: #fff;
		box-shadow: 0 -8rpx 32rpx 0 rgba(0, 0, 0, 0.10);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		/* 默认底部弹窗初始状态 */
		transform: translateY(100%);
		opacity: 1;
	}

	.popup-panel--bottom {
		position: relative;
	}

	.popup-panel--bottom.popup-panel--show {
		transform: translateY(0);
	}

	.popup-panel--top {
		position: absolute;
		top: 0;
		left: 0;
		transform: translateY(-100%);
	}

	.popup-panel--top.popup-panel--show {
		transform: translateY(0);
	}

	.popup-panel--left {
		position: absolute;
		left: 0;
		top: 0;
		height: 100vh;
		width: 80vw;
		transform: translateX(-100%);
	}

	.popup-panel--left.popup-panel--show {
		transform: translateX(0);
	}

	.popup-panel--right {
		position: absolute;
		right: 0;
		top: 0;
		height: 100vh;
		width: 80vw;
		transform: translateX(100%);
	}

	.popup-panel--right.popup-panel--show {
		transform: translateX(0);
	}

	.popup-header {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
	}

	.title {
		font-size: 28rpx;
	}

	.cancel {
		color: #222222;
		font-size: 28rpx;
	}

	.popup-search {
		padding: 20rpx 32rpx;
		background: #fafafa;
	}

	.search-input {
		height: 68rpx;
		padding: 0 20rpx;
		border-radius: 12rpx;
		font-size: 28rpx;
		background: #eeeeee;
		border: none;
		outline: none;
	}

	.popup-list {
		flex: 1;
		min-height: 0;
		background: #fff;
	}

	.popup-item {
		display: flex;
		align-items: center;
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid #f4f4f4;
		font-size: 30rpx;
		cursor: pointer;
	}

	.safe-area-bottom-height {
		height: env(safe-area-inset-bottom);
	}

	.popup-item .flag {
		width: 48rpx;
		margin-right: 18rpx;
	}

	.popup-item .name {
		flex: 1;
		font-size: 28rpx;
		color: #222222;
	}

	.popup-item .code {
		color: #222222;
		font-size: 28rpx;
	}
</style>