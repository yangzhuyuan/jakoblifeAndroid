<template>
	<uni-popup ref="popup" :mask-click="false">
		<view class="popup-content">
			<view class="popup-title">{{$t('血氧分类')}}</view>
			<view class="scale-labels">
				<text>95%</text>
				<text></text>
				<text>98%</text>
			</view>
			<view class="scale-bars">
				<view class="bar low"></view>
				<view class="bar normal"></view>
				<view class="bar high"></view>
			</view>
			<view class="scale-names">
				<text>{{$t('偏低')}}</text>
				<text>{{$t('正常')}}</text>
				<text>{{$t('偏高')}}</text>
			</view>
			<view class="desc">{{$t('血氧3')}}</view>
			<view class="desc">{{$t('血氧2')}}</view>
			<view class="desc">{{$t('血氧1')}}</view>
			<button class="confirm-btn" @tap="close">{{$t('知道了')}}</button>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		name: 'BloodOxygenPopup',
		methods: {
			open() {
				this.$refs.popup.open('center');
			},
			close() {
				this.$refs.popup.close();
			}
		}
	}
</script>

<style scoped>
	.popup-content {
		border-radius: 20px;
		background: #fff;
		padding: 20px;
		width: 280px;
		text-align: center;
	}

	.popup-title {
		font-size: 17px;
		font-weight: 600;
		margin-bottom: 10px;
	}

	.scale-labels,
	.scale-names {
		display: flex;
		justify-content: space-between;
		color: gray;
		font-size: 12px;
		margin-top: 10px;
		padding: 0 10px;
	}

	.scale-bars {
		display: flex;
		justify-content: center;
		margin-top: 10px;
	}

	.bar {
		width: 80px;
		height: 10px;
	}

	.bar.low {
		background: #FCCD41;
	}

	.bar.normal {
		background: #7AE545;
	}

	.bar.high {
		background: #58BF78;
	}

	.desc {
		padding: 10px;
		color: gray;
		font-size: 12px;
	}

	.confirm-btn {
		width: 120px;
		height: 48px;
		line-height: 48px;
		border-radius: 100px;
		background: #3298F7;
		color: white;
		font-size: 14px;
		margin-top: 10px;
	}
</style>
