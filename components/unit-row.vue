<template>
	<view>
		<view class="row">
			<text class="title">{{ title }}</text>
			<view class="right">
				<view class="text">{{ array[index] }}</view>
				<view class="icon-wrapper">
					<uni-icons type="bottom" size="16" />
					<picker :range="array" :value="index" @change="onChange" class="picker-mask" />
				</view>
			</view>
		</view>
		<view class="line" />
	</view>
</template>

<script>
	export default {
		name: 'unit-row',
		props: {
			title: String,
			array: Array,
			storageKey: String,
			currentIndex: Number
		},
		data() {
			return {
				index: this.currentIndex || 0
			}
		},
		watch: {
			currentIndex(newVal) {
				this.index = newVal
			}
		},
		methods: {
			onChange(e) {
				this.index = e.detail.value
				this.$emit('unit-change', {
					key: this.storageKey,
					value: this.array[this.index],
					index: this.index
				})
			}
		}
	}
</script>

<style scoped>
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.title {
		width: 40%;
		font-weight: bold;
		font-size: 32rpx;
	}

	.right {
		display: flex;
		align-items: center;
	}

	.text {
		margin-right: 20rpx;
	}

	.icon-wrapper {
		position: relative;
	}

	.picker-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.line {
		height: 1rpx;
		background: #e5e5e5;
	}
</style>