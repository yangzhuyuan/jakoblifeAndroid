
<template>
	<view class="scroll-choose-all">
		<view class="middleLine"></view>
		<scroll-view class="scroll-choose" scroll-x="true" upper-threshold="5" lower-threshold="5"
			:scroll-left="scrollLeftInit" show-scrollbar="false" @scroll="scroll" @scrolltoupper="upper"
			@scrolltolower="lower" scroll-with-animation="true">
			<view class="scroll-con" :style="{ width: scrollWid }">
				<view class="topLine">
					<view class="allLine" :style="{ marginRight: maginL + 'px' }" :class="item.type"
						v-for="(item, index) in scrollList" :key="index"></view>
				</view>
				<view class="bottomNum" :style="{ paddingLeft: allNumLeft }">
					<text class="allNum" :style="{ width: (maginL + 2) * 10 + 'px', left: -((maginL + 2) * 5) + 'px' }"
						v-for="(item, index) in scrollNumList" :key="index">
						{{ item }}
					</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'x-calliper',
		props: {
			// 起始值和终止值差距不要过大，否则会影响页面性能(暂不支持设置小数)
			/**
			 * 初始值（注意：初始值应在起始值和终止值之间）
			 */
			scrollLeft: {
				type: [Number, String],
				default: 0
			},
			/**
			 * 滚动区域起始值（注意：起始值不能大于终止值）
			 */
			scrollStart: {
				type: Number,
				default: 0
			},
			/**
			 * 滚动区域终止值
			 */
			scrollEnd: {
				type: Number,
				default: 100
			},
			/**
			 * 线间距
			 */
			maginL: {
				type: Number,
				default: 5
			},
			// 是否开启整数模式
			isInt: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				scrollList: [],
				scrollNumList: [],
				scrollWid: '100vw',
				scrollLeftInit: 0,
				allNumLeft: ''
			};
		},
		mounted() {
			this.init();
		},
		computed: {},
		methods: {
			init() {
				if (this.isInt) {
					for (let i = this.scrollStart; i < this.scrollEnd + 1; i++) {
						const _line = {};
						if (i % 5 == 0) {
							if (i % 10 == 0) {
								this.scrollNumList.push(i);
								_line.type = 'LLine';
							} else {
								_line.type = 'MLine';
							}
						} else {
							_line.type = 'SLine';
						}
						this.scrollList.push(_line);
					}
				} else {
					const step = 0.1;
					for (let i = this.scrollStart; i < this.scrollEnd + step; i += step) {
						const _line = {};
						const value = i.toFixed(1);
						if (value % 1 !== 0) {
							if (value % 0.5 == 0) {
								_line.type = 'MLine'; // x.5
							} else {
								_line.type = 'SLine'; // x.1 ~ x.4 或 x.6 ~ x.9
							}
						} else {
							this.scrollNumList.push(parseInt(value));
							_line.type = 'LLine'; // 整数
						}
						this.scrollList.push(_line);
					}
				}

				console.log(this.scrollNumList);

				this.scrollWid =
					uni.upx2px(750) + (this.scrollEnd - this.scrollStart) * (this.maginL + 2) * (this.isInt ? 1 : 10) +
					'px';

				if (this.isInt) {
					if (this.scrollStart % 10 != 0) {
						if (this.scrollStart > 0) {
							this.allNumLeft = (10 - (this.scrollStart % 10)) * (this.maginL + 2) + uni.upx2px(372) + 'px';
						} else {
							this.allNumLeft = Math.abs(this.scrollStart % 10) * (this.maginL + 2) + uni.upx2px(372) + 'px';
						}
					}
				} else {
					if (!Number.isInteger(this.scrollStart)) {
						if (this.scrollStart < 1) {
							const decimalLines = Math.floor((1 - this.scrollStart % 1) / 0.1);
							this.allNumLeft = decimalLines * (this.maginL + 2) + uni.upx2px(372) + 'px';
						} else {
							const initLines = Math.floor(this.scrollStart);
							const decimalLines = Math.floor((1 - this.scrollStart % 1) / 0.1) + initLines;
							this.allNumLeft = decimalLines * (this.maginL + 2) + uni.upx2px(372) + 'px';
						}
					}
				}

				setTimeout(() => {
					this.setNowLeft();
				}, 100);
			},
			setNowLeft() {
				this.scrollLeftInit = (this.scrollLeft - this.scrollStart) * (this.isInt ? 1 : 10) * (this.maginL + 2);
			},
			upper: function(e) {
				setTimeout(() => {
					this.$emit('scroll', this.scrollStart);
				}, 50);
			},
			lower: function(e) {
				setTimeout(() => {
					this.$emit('scroll', this.scrollEnd);
				}, 50);
			},
			scroll: function(e) {
				const value = Math.round(e.detail.scrollLeft / (this.maginL + 2)) / (this.isInt ? 1 : 10) + this
					.scrollStart;
				// 如果是整数则显示整数，小数则保留一位小数
				this.$emit('scroll', Number.isInteger(value) ? value : value.toFixed(1));
			}
		}
	};
</script>

<style lang="scss">
	@charset "UTF-8";

	.scroll-choose-all {
		width: 750rpx;
		height: 70px;
		margin: 4rpx 0 20rpx 0;
		border-top: 4rpx solid #d7e3e2;
		position: relative;
		color: #a3abb3;
	}

	.middleLine {
		position: absolute;
		width: 4px;
		height: 40px;
		background: $uni-color-primary;
		left: 375rpx;
		margin-left: -2px;
		z-index: 1;
	}

	.scroll-choose {
		width: 750rpx;
		height: 70px;

		.scroll-con {
			height: 70px;
			overflow: hidden;

			.topLine {
				height: 30px;
				padding: 0 372rpx;
			}

			.bottomNum {
				height: 30px;
				padding: 20rpx 0 0 372rpx;
				width: 100%;

				// display: flex;
				// flex-wrap: nowrap;
				.allNum {
					display: inline-block;
					position: relative;
					// width: 70px;
					// left: -35px;
					text-align: center;
					color: #999;
				}
			}

			.allLine {
				display: inline-block;
				// margin-right: 5px;
				width: 2px;
				background: #a3abb3;
				position: relative;
			}

			.allLine:last-child {
				margin-right: 0px !important;
			}

			.LLine {
				height: 30px;
			}

			.MLine {
				height: 20px;
				top: -10px;
			}

			.SLine {
				height: 15px;
				top: -15px;
			}
		}
	}
</style>