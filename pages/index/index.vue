<template>
	<view style="position: absolute;width: 100vw; top: 120px;">
		<view style="text-align: center;font-size: 26px;font-weight: bold;">{{$t('hysy')}}</view>
		<view style="text-align: center;margin-top: 20px;font-size: 26px;font-weight: bold;">JakobLife</view>
		<view style="display: flex; justify-content:center;">
			<image style="width: 180px;height: 180px;" src="../../static/icons/14.png" />
		</view>
		<view class="warp">
			<view class="view_circle1"></view>
			<view class="view_circle2"></view>
			<view class="view_circle3"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				animationData: {}

			}
		},
		onShow() {
			setTimeout(function() {
				uni.switchTab({
					url: "../tabBar/main/Main"
				})
			}, 2000);
		},

		methods: {

		}

	}
</script>

<style>
	.warp {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;

	}

	.view_circle1 {
		height: 10px;
		width: 10px;
		background-color: blue;
		border-radius: 100px;
		animation-name: donghua;
		animation: donghua 0.5s linear 0.7s infinite alternate;
	}

	.view_circle2 {
		height: 10px;
		width: 10px;
		margin-left: 20px;
		background-color: blue;
		border-radius: 100px;
		animation-name: donghua;
		animation: donghua 0.5s linear 0.8s infinite alternate-reverse;
	}


	.view_circle3 {
		height: 10px;
		width: 10px;
		margin-left: 20px;
		background-color: blue;
		border-radius: 100px;
		animation-name: donghua;
		animation: donghua 0.5s linear 0.9s infinite alternate;
	}

	@keyframes donghua {
		from {
			margin-top: 0px
		}

		to {
			margin-top: 10px
		}
	}
</style>