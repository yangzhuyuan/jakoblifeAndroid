<template>
	<scroll-view scroll-y :style="scrollStyle" :scroll-top="scrollTop" @scroll="handleScroll">
		<movable-area :style="areaStyle">
			<movable-view v-for="(item, index) in formattedList" :key="item.key" :animation="animation"
				:direction="direction" :damping="damping" :x="item.x" :y="item.y" :disabled="disabled"
				@longpress="toggleDrag" @touchstart="handleDragStart(index)" @change="handleMoving"
				@touchend="handleDragEnd" :style="viewStyle" class="drag-item-wrapper"
				:class="{ active: activeIndex === index }">
				<!-- 微信小程序专用视图 -->
				<view v-if="isWeixinMiniProgram" class="drag-item">
					{{ item[itemKey] }}
				</view>
				<!-- 其他平台使用插槽 -->
				<slot v-else name="item" :element="item" :index="index"></slot>
			</movable-view>
		</movable-area>
	</scroll-view>
</template>

<script>
	const DIRECTION_TYPES = ['all', 'vertical', 'horizontal', 'none'];

	export default {
		name: 'DragSortList',
		props: {
			column: {
				type: Number,
				default: 2,
				validator: value => value > 0
			},
			value: {
				type: Array,
				default: () => []
			},
			width: {
				type: String,
				default: '95%'
			},
			height: {
				type: String,
				default: 'auto'
			},
			itemKey: {
				type: String,
				required: true
			},
			itemHeight: {
				type: String,
				default: '200px'
			},
			direction: {
				type: String,
				default: 'all',
				validator: value => DIRECTION_TYPES.includes(value)
			},
			animation: {
				type: Boolean,
				default: true
			},
			damping: {
				type: Number,
				default: 20,
				validator: value => value >= 0
			},
			longpress: {
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				formattedList: [],
				activeIndex: -1,
				moveToIndex: -1,
				oldIndex: -1,
				tempDragInfo: {
					x: 0,
					y: 0
				},
				scrollTop: 0,
				windowWidth: 375, // 默认值，会在created中更新
				systemInfo: null
			};
		},
		computed: {
			isWeixinMiniProgram() {
				return process.env.VUE_APP_PLATFORM === 'mp-weixin';
			},

			scrollStyle() {
				return {
					width: this.computedWidth,
					height: this.height
				};
			},

			areaStyle() {
				const rowCount = Math.ceil(this.formattedList.length / this.column);
				return {
					width: this.computedWidth,
					height: `${rowCount * this.parsedItemHeight}px`
				};
			},

			viewStyle() {
				return {
					width: this.itemWidth,
					height: this.itemHeight
				};
			},

			computedWidth() {
				return this.parseWidth(this.width);
			},

			parsedItemHeight() {
				return parseFloat(this.itemHeight);
			},

			itemWidth() {
				const width = parseFloat(this.computedWidth);
				return `${(width / this.column).toFixed(2)}px`;
			}
		},
		created() {
			this.systemInfo = uni.getSystemInfoSync();
			this.windowWidth = this.systemInfo.windowWidth;

			// 在App中需要特殊处理一些样式
			if (this.systemInfo.platform === 'android' || this.systemInfo.platform === 'ios') {
				// 可以在这里添加App特有的初始化逻辑
			}
		},
		methods: {
			parseWidth(width) {
				if (width.includes('%')) {
					return `${this.windowWidth * (parseFloat(width) / 100)}px`;
				}
				return width;
			},

			initList(list = []) {
				this.formattedList = list.map((item, index) => ({
					...item,
					...this.getPosition(index),
					key: `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
				}));
			},

			toggleDrag() {
				if (this.longpress) {
					this.$emit('update:disabled', !this.disabled);
				}
			},

			handleDragStart(index) {
				this.activeIndex = index;
				this.oldIndex = index;
				this.$emit('drag-start', {
					index,
					item: this.formattedList[index]
				});
			},

			handleMoving(e) {
				if (e.detail.source !== 'touch' || this.disabled) return;

				const {
					x,
					y
				} = e.detail;
				this.tempDragInfo = {
					x,
					y
				};

				const currentX = Math.floor((x + parseFloat(this.itemWidth) / 2) / parseFloat(this.itemWidth));
				const currentY = Math.floor((y + this.parsedItemHeight / 2) / this.parsedItemHeight);
				this.moveToIndex = Math.min(currentY * this.column + currentX, this.formattedList.length - 1);

				if (this.oldIndex !== this.moveToIndex && this.oldIndex !== -1 && this.moveToIndex !== -1) {
					this.updateListPositions();
					this.oldIndex = this.moveToIndex;
					this.scrollIntoView();
				}

				this.$emit('dragging', {
					fromIndex: this.activeIndex,
					toIndex: this.moveToIndex,
					x,
					y
				});
			},

			updateListPositions() {
				const newList = [...this.formattedList];
				const [movedItem] = newList.splice(this.activeIndex, 1);
				newList.splice(this.moveToIndex, 0, movedItem);

				newList.forEach((item, index) => {
					const position = this.getPosition(index);
					item.x = position.x;
					item.y = position.y;
				});

				this.formattedList = newList;
			},

			getPosition(index) {
				const x = (index % this.column) * parseFloat(this.itemWidth);
				const y = Math.floor(index / this.column) * this.parsedItemHeight;
				return {
					x,
					y
				};
			},

			handleDragEnd() {
				if (this.disabled) return;

				const resultList = this.formattedList.map(item => {
					const {
						x,
						y,
						key,
						...rest
					} = item;
					return rest;
				});

				this.$emit('input', resultList);
				this.$emit('drag-end', {
					oldIndex: this.activeIndex,
					newIndex: this.moveToIndex,
					list: resultList
				});

				this.resetDragState();
			},

			scrollIntoView() {
				if (this.height === 'auto') return;

				const itemHeight = this.parsedItemHeight;
				const visibleHeight = parseFloat(this.height);
				const currentPosition = (this.moveToIndex + 1) * itemHeight;

				if (currentPosition >= this.scrollTop + visibleHeight) {
					this.scrollTop = Math.min(
						parseFloat(this.areaStyle.height),
						this.scrollTop + Math.ceil(this.moveToIndex / 2) * itemHeight
					);
				} else if ((this.moveToIndex - 1) * itemHeight <= this.scrollTop) {
					this.scrollTop = Math.max(
						0,
						this.scrollTop - Math.ceil(this.moveToIndex / 2) * itemHeight
					);
				}
			},

			resetDragState() {
				this.activeIndex = -1;
				this.oldIndex = -1;
				this.moveToIndex = -1;
				this.$emit('update:disabled', true);
			},

			handleScroll(e) {
				this.scrollTop = e.detail.scrollTop;
				this.$emit('scroll', e.detail);
			}
		},
		watch: {
			value: {
				handler(newVal) {
					this.initList(newVal);
				},
				immediate: true,
				deep: true
			}
		}
	};
</script>

<style lang="scss" scoped>
	.drag-item-wrapper {
		// transition: all 0.3s ease;
		// box-sizing: border-box;
		/* App中需要添加这些样式以确保拖动流畅 */
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;

		&.active {
			// opacity: 0.8;
			// z-index: 9999;
			// box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
			// transform: scale(1.02);

			// /* App中需要添加这个样式以防止拖动时闪烁 */
			// background-color: #ffffff;
		}

		.drag-item {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			pointer-events: none;
			/* 防止在App中拖动时触发子元素事件 */
		}
	}
</style>