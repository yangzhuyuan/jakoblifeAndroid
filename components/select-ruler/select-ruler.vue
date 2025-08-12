<template>
	<view class="select-ruler">
		<!-- 遮罩层 -->
		<view class="tap-mask" v-if="disable"></view>
		<!-- 线 -->
		<view class="line"></view>
		<view class="row-line"></view>
		<!-- 左右渐变遮罩 -->
		<view class="mask mask-left"></view>
		<view class="mask mask-right"></view>
		<!-- 刻度尺 -->
		<scroll-view :scroll-x="true" @scroll="handleScroll" :scroll-left="scroll_left">
			<view class="ruler-item" v-for="(item, index) in rulerItems" :key="index">
				<view class="ruler-line" :class="{ 'ruler-line-major': index % 10 === 0 }"></view>
				<text v-if="index % 10 === 0"
					class="ruler-label">{{ (index + min) / multiple | fixedPoint(point) }}</text>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	export default {
		name: "select-ruler",
		data() {
			return {
				number: 0,
				scroll_left: 0,
				scroll: {
					detail: {},
				},
			};
		},
		props: {
			// 最小值
			min: {
				type: Number,
				default: 0,
			},
			// 最大值
			max: {
				type: Number,
				default: 500,
			},
			// 缩放比例
			multiple: {
				type: Number,
				default: 1,
			},
			// 默认值
			defaultValue: {
				type: Number,
				default: 1000,
			},
			// 是否禁用
			disable: {
				type: Boolean,
				default: false,
			},
			// 小数点后保留位数
			point: {
				type: Number,
				default: 0,
			},
		},
		computed: {
			rulerItems() {
				return Array.from({
					length: this.max - this.min + 1
				}, (_, i) => i + this.min);
			},
		},
		filters: {
			fixedPoint(value, point) {
				return value.toFixed(point);
			},
		},
		created() {
			this.setDefault(this.defaultValue);
		},
		methods: {
			// 刻度尺滚动监听
			handleScroll(e) {
				this.scroll = e;
				this.number = Math.round(e.detail.scrollLeft / Math.round((e.detail.scrollWidth) / this.max));
				this.$emit('change', ((this.number + this.min) / this.multiple).toFixed(this.point));
			},
			// 初始化刻度尺
			initScroll() {
				this.scroll_left = this.number * 5;
			},
			// 设置默认值
			setDefault(number) {
				if (number < this.min || number > this.max) {
					uni.showToast({
						title: `数值超出范围(${this.min / this.multiple}-${this.max / this.multiple})`,
						icon: 'none',
					});
				}
				number = Math.max(this.min, Math.min(number, this.max));
				this.number = number - this.min;
				this.initScroll();
			},
			// 增加
			plusValue(step) {
				this.setDefault(this.number + this.min + Math.floor(step));
			},
			// 减少
			reduceValue(step) {
				this.setDefault(this.number + this.min - Math.floor(step));
			},
		},
	};
</script>
<style scoped lang="scss">
	.select-ruler {
		position: relative;
		height: 80px; // 增加高度以容纳刻度值

		.tap-mask {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.5);
		}

		.line {
			width: 10px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 0;
			height: 100%;
			text-align: center;

			&:before {
				content: '';
				width: 2px;
				height: 25px;
				background: #3298F7;
				display: inline-block;
				vertical-align: text-top;
				position: absolute;
				top: 10px;
				transform: translateY(-50%);
			}
		}

		.row-line {
			width: 100%;
			height: 1px;
			background: rgba(#3A414B, .07);
			position: absolute;
			bottom: 0;
		}

		.mask {
			width: 50px;
			height: 100%;
			position: absolute;
			top: 0;
			z-index: 2;
			pointer-events: none;

			&.mask-left {
				left: 0;
				background-image: linear-gradient(to left, #fff, rgba(#fff, 0));
			}

			&.mask-right {
				right: 0;
				background-image: linear-gradient(to right, rgba(#fff, 0), #fff);
			}
		}

		scroll-view {
			width: 100%;
			height: 100%;
			white-space: nowrap;

			.ruler-item {
				width: 5px;
				text-align: center;
				display: inline-block;
				position: relative;

				//开始值
				&:first-child {
					margin-left: 50%;
				}

				//结束值
				&:last-child {
					margin-right: calc(50% - 2px);
				}

				.ruler-line {
					width: 1px;
					height: 20px; // 增加刻度线的高度
					background: rgba(#3A414B, .07);
					display: inline-block;
					vertical-align: text-top;

					&.ruler-line-major {
						height: 30px; // 主刻度线更高
					}
				}

				.ruler-label {
					position: absolute;
					top: 50px; // 调整刻度值的位置
					left: 50%;
					transform: translateX(-50%);
					color: #3D3D3D;
					font-size: 12px;
				}
			}
		}
	}
</style>