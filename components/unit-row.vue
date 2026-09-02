<template>
	<view class="unit-row">
		<picker :range="array" :value="index" @change="onChange">
			<view class="row">
				<view class="left">
					<image v-if="icon" class="row-icon" :src="icon" mode="aspectFit" />
					<text class="title">{{ title }}</text>
				</view>
				<view class="right">
					<text class="value">{{ array[index] }}</text>
					<uni-icons type="right" size="14" color="#B7C3D4" />
				</view>
			</view>
		</picker>
		<view v-if="!hideLine" class="line" />
	</view>
</template>

<script>
	export default {
		name: 'unit-row',
		props: {
			title: String,
			array: Array,
			storageKey: String,
			currentIndex: Number,
			icon: String,
			hideLine: Boolean
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
	.line {
		height: 1rpx;
		background: #EEF1F5;
		margin-left: 88rpx;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 28rpx;
	}

	.left {
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 0;
	}

	.row-icon {
		width: 48px;
		height: 48px;
		margin-right: 20rpx;
		flex-shrink: 0;
		object-fit: contain;
	}

	.title {
		font-weight: 600;
		font-size: 30rpx;
		color: #1C1C1E;
	}

	.right {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		margin-left: 16rpx;
	}

	.value {
		margin-right: 8rpx;
		font-size: 28rpx;
		color: #3298F7;
	}
</style>