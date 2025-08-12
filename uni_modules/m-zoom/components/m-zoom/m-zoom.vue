<template>
	<view class="m-wrapper">
		<slot></slot>
		<template v-if="direction">
			<view v-if="direction.length === 0 || direction.indexOf('up') !== -1" class="m-drag-up"
				@mousedown="mousedown($event, 'up')" />
			<view v-if="direction.length === 0 || direction.indexOf('down') !== -1" class="m-drag-down"
				@mousedown="mousedown($event, 'down')" />
			<view v-if="direction.length === 0 || direction.indexOf('left') !== -1" class="m-drag-left"
				@mousedown="mousedown($event, 'left')" />
			<view v-if="direction.length === 0 || direction.indexOf('right') !== -1" class="m-drag-right"
				@mousedown="mousedown($event, 'right')" />
		</template>
	</view>
</template>
<script>
	let isActive = false
	const mouseup = () => isActive = false
	export default {
		name: "drag",
		data() {
			return {
				clientX: 0,
				clientY: 0,
			};
		},
		props: {
			direction: {
				default: () => [],
				type: Array
			},
			precision: {
				type: Number,
				default: 1
			}
		},
		mounted() {
			if (!this.direction) return
			document.addEventListener('mouseup', mouseup)
			document.addEventListener('mousemove', this.mousemove)
		},
		beforeDestroy() {
			document.removeEventListener('mouseup', mouseup)
			document.removeEventListener('mousemove', this.mousemove)
		},
		methods: {
			mousedown({
				clientX,
				clientY
			}, type) {
				isActive = type
				this.clientX = clientX
				this.clientY = clientY
			},
			mousemove(e) {
				if (!isActive) return
				const type = isActive === 'left' || isActive === 'right' ? 'clientX' : 'clientY'
				const clientType = isActive === 'left' || isActive === 'right' ? 'clientWidth' : 'clientHeight'
				let diff = this[type] - e[type]
				if (diff < this.precision && diff > -this.precision) return
				this[type] = e[type]
				const wrapper = document.querySelector('.m-wrapper')
				const target = wrapper.children[0]
				const margin = wrapper[clientType] - target[clientType]
				if (isActive === 'left') {
					target.style.width = wrapper[clientType] - margin + diff + 'px'
				} else if (isActive === 'right') {
					target.style.width = wrapper[clientType] - margin - diff + 'px'
				} else if (isActive === 'up') {
					target.style.height = wrapper[clientType] - margin + diff + 'px'
				} else {
					target.style.height = wrapper[clientType] - margin - diff + 'px'
				}
			}
		}
	}
</script>
<style scoped>
	.m-wrapper {
		position: relative;
		display: inline-block;
	}

	.m-drag-up {
		position: absolute;
		width: 100%;
		height: 20px;
		top: 0;
		left: 0;
		cursor: n-resize
	}

	.m-drag-down {
		position: absolute;
		width: 100%;
		height: 20px;
		bottom: 0;
		left: 0;
		cursor: s-resize
	}

	.m-drag-left {
		position: absolute;
		width: 20px;
		height: 100%;
		top: 0;
		left: 0;
		cursor: w-resize
	}

	.m-drag-right {
		position: absolute;
		width: 20px;
		height: 100%;
		right: 0;
		top: 0;
		cursor: e-resize
	}
</style>
