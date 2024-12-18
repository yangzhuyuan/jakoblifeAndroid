<template>
	<view>
		<view class="yi-loading-audio" :style="'width: '+size+'px;height: '+size+'px;'">
			<view :style="'width: calc('+size+'px / 10);height: '+size+'px;background-color:'+color+';'"></view>
			<view :style="'width: calc('+size+'px / 10);height: '+size+'px;background-color:'+color+';'"></view>
			<view :style="'width: calc('+size+'px / 10);height: '+size+'px;background-color:'+color+';'"></view>
			<view :style="'width: calc('+size+'px / 10);height: '+size+'px;background-color:'+color+';'"></view>
			<view :style="'width: calc('+size+'px / 10);height: '+size+'px;background-color:'+color+';'"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			color: {
				type: String,
				default: "#1e9fff"
			},
			size: {
				type: Number,
				require: true
			}
		}
	}
</script>

<style lang="scss">
	.yi-loading-audio {
		display: flex;
		justify-content: space-between;

		view {
			background-color: #1e9fff;
			animation: YiLoadingAudio 1.2s infinite ease-in-out;

			@keyframes YiLoadingAudio {
				0%,40%,100% {
					transform: scaleY(0.4);
				}

				20% {
					transform: scaleY(1.0);
				}
			}

			&:nth-child(2) {
				animation-delay: -1100ms;
			}

			&:nth-child(3) {
				animation-delay: -1000ms;
			}

			&:nth-child(4) {
				animation-delay: -900ms;
			}

			&:nth-child(5) {
				animation-delay: -800ms;
			}
		}
	}
</style>