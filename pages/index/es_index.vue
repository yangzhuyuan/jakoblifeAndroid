<template>
	<view class="spl_index">
		<image style="width: 180px;height: 180px; " src="../../static/icons/14.png"></image>
	</view>
</template>

<script>
	export default {
		onShow() {
			setTimeout(function() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			}, 3000);
		},
	}
</script>

<style>
	.spl_index {
		width: 100vw;
		height: 100vh;
		background: #3298F7;
		display: flex;
		justify-content: center;
		align-items: center;

	}
</style>