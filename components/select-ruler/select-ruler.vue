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
			<span class="ruler-item span-item" v-for="(item, index) in (max - min + 1)">
				<span>{{((index + min)/multiple).toFixed(point)}}</span>
			</span>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "select-ruler",
		data() {
			return {
				number: 0,
				scroll_left: 1,
				scroll: {
					detail: {},
				},
			};
		},
		props: {
			// 最小值
			min: {
				type: Number,
				default: 0
			},
			// 最大值
			max: {
				type: Number,
				default: 500
			},
			// 缩放比例
			multiple: {
				type: Number,
				default: 1
			},
			// 默认值
			defaultValue: {
				type: Number,
				default: 1000
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
			}
		},
		created() {
			// 等待滚动条初始化完成
			setTimeout(() => {
				this.setDefault(this.defaultValue);
			}, 500);
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
				console.log("默认值1：", this.number)
				console.log("默认值1：", Math.round((this.scroll.detail.scrollWidth) / this.max))
				this.scroll_left = this.number * 5;
			},
			// 设置默认值
			setDefault(number) {
				console.log("默认值：", number)
				console.log("最小值：", this.min)
				console.log("最大值：", this.max)
				if (number < this.min || number > this.max) {
					uni.showToast({
						title: `数值超出范围(${this.min/this.multiple}-${this.max/this.multiple})`,
						icon: 'none'
					});
				}
				if (number < this.min) number = this.min;
				if (number > this.max) number = this.max;
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
		}
	}
</script>

<style scoped lang="scss">
	.select-ruler {
		// width: 100vw;
		// height: 30px;
		position: relative;

		.tap-mask {
			width: 90vw;
			height: 20px;
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
		}

		.line {
			width: 10px;
			position: absolute;
			left: 180px;
			text-align: center;

			&:before {
				content: '';
				width: 2px;
				height: 25px;
				background: #3298F7;
				display: inline-block;
				vertical-align: text-top;
			}
		}

		.row-line {
			width: 90vw;
			height: 1px;
			// background: rgba(#3A414B, .07);
			left: 0;
			position: absolute;
		}

		.mask {
			width: 50px;
			height: 20px;
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
			height: 80px;
			white-space: nowrap;

			.ruler-item {
				width: 5px;
				text-align: center;
				display: inline-block;
				position: relative;


				//开始值
				&:first-child {
					margin-left: 56%;
				}

				//结束值
				&:last-child {
					margin-right: 43%;
				}

				//子线
				&:before {
					content: '';
					width: 1px;
					height: 10px;
					background: rgba(#3A414B, .07);
					display: inline-block;
					vertical-align: text-top;
				}

				span {
					position: absolute;
					top: 20;
					left: 50%;
					transform: translateX(-50%);
					color: #3D3D3D;
					font-size: 12px;
					display: none;
				}


				//值的线
				&:nth-child(10n+1) {
					&::before {
						width: 1px;
						height: 20px;
					}

					span {
						display: block;
					}
				}

			}
		}
	}
</style>