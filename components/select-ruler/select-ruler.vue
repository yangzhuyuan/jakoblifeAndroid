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
		<!-- 刻度尺：外观/精度与原先一致，仅渲染可视区刻度 -->
		<scroll-view :scroll-x="true" @scroll="handleScroll" :scroll-left="scroll_left"
			:show-scrollbar="false">
			<view class="ruler-track" :style="{ width: trackWidth + 'px' }">
				<view class="ruler-window" :style="{ left: windowLeft + 'px' }">
					<view class="ruler-item" v-for="index in visibleIndexes" :key="index">
						<view class="ruler-line" :class="{ 'ruler-line-major': index % 10 === 0 }"></view>
						<text v-if="index % 10 === 0"
							class="ruler-label">{{ (index + min) / multiple | fixedPoint(point) }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	const ITEM_WIDTH = 5;
	const BUFFER = 30;

	export default {
		name: "select-ruler",
		data() {
			return {
				number: 0,
				scroll_left: 0,
				scrollPos: 0,
				viewWidth: 375,
				scroll: {
					detail: {},
				},
			};
		},
		props: {
			min: {
				type: Number,
				default: 0,
			},
			max: {
				type: Number,
				default: 500,
			},
			multiple: {
				type: Number,
				default: 1,
			},
			defaultValue: {
				type: Number,
				default: 1000,
			},
			disable: {
				type: Boolean,
				default: false,
			},
			point: {
				type: Number,
				default: 0,
			},
		},
		computed: {
			rulerCount() {
				return this.max - this.min + 1;
			},
			// 与原先 first margin-left:50% / last margin-right:50% 等效
			trackWidth() {
				return this.viewWidth + this.rulerCount * ITEM_WIDTH;
			},
			startIndex() {
				const raw = Math.floor(this.scrollPos / ITEM_WIDTH) - BUFFER;
				return Math.max(0, raw);
			},
			endIndex() {
				const visible = Math.ceil(this.viewWidth / ITEM_WIDTH) + BUFFER * 2;
				return Math.min(this.rulerCount - 1, this.startIndex + visible);
			},
			visibleIndexes() {
				const list = [];
				for (let i = this.startIndex; i <= this.endIndex; i++) {
					list.push(i);
				}
				return list;
			},
			windowLeft() {
				return this.viewWidth / 2 + this.startIndex * ITEM_WIDTH;
			},
		},
		filters: {
			fixedPoint(value, point) {
				return value.toFixed(point);
			},
		},
		created() {
			try {
				const info = uni.getSystemInfoSync();
				this.viewWidth = info.windowWidth || 375;
			} catch (e) {}
			this.setDefault(this.defaultValue);
		},
		methods: {
			handleScroll(e) {
				this.scroll = e;
				const scrollLeft = e.detail.scrollLeft || 0;
				this.scrollPos = scrollLeft;
				const index = Math.round(scrollLeft / ITEM_WIDTH);
				this.number = Math.max(0, Math.min(this.max - this.min, index));
				this.$emit('change', ((this.number + this.min) / this.multiple).toFixed(this.point));
			},
			initScroll() {
				this.scroll_left = this.number * ITEM_WIDTH;
				this.scrollPos = this.scroll_left;
			},
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
			plusValue(step) {
				this.setDefault(this.number + this.min + Math.floor(step));
			},
			reduceValue(step) {
				this.setDefault(this.number + this.min - Math.floor(step));
			},
		},
	};
</script>
<style scoped lang="scss">
	.select-ruler {
		position: relative;
		height: 80px;

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

			.ruler-track {
				height: 80px;
				position: relative;
				display: inline-block;
			}

			.ruler-window {
				position: absolute;
				top: 0;
				height: 100%;
				white-space: nowrap;
			}

			.ruler-item {
				width: 5px;
				text-align: center;
				display: inline-block;
				position: relative;

				.ruler-line {
					width: 1px;
					height: 20px;
					background: rgba(#3A414B, .07);
					display: inline-block;
					vertical-align: text-top;

					&.ruler-line-major {
						height: 30px;
					}
				}

				.ruler-label {
					position: absolute;
					top: 50px;
					left: 50%;
					transform: translateX(-50%);
					color: #3D3D3D;
					font-size: 12px;
					white-space: nowrap;
				}
			}
		}
	}
</style>
