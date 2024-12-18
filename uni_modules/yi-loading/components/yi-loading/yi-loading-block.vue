<template>
	<view>
		<view class="yi-loading-block" :style="'width: '+size+'px;height: '+size+'px;'">
			<view :style="'width: calc('+size+'px * 0.45);height: calc('+size+'px * 0.45);background-color:'+color+';'"></view>
			<view :style="'width: calc('+size+'px * 0.45);height: calc('+size+'px * 0.45);background-color:'+color+';'"></view>
			<view :style="'width: calc('+size+'px * 0.45);height: calc('+size+'px * 0.45);background-color:'+color+';'"></view>
			<view :style="'width: calc('+size+'px * 0.45);height: calc('+size+'px * 0.45);background-color:'+color+';'"></view>
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
	.yi-loading-block {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		
		view {
			background-color: #1e9fff;
			animation: YiLoadingBlock 1.2s infinite ease-in-out;

			@keyframes YiLoadingBlock {
				0%,40%,100%{
					opacity: 0.2;
				}
				20% {
					opacity: 1;
				}
			}

			&:nth-child(2) {
				animation-delay: -1000ms;
			}

			&:nth-child(3) {
				animation-delay: -800ms;
			}

			&:nth-child(4) {
				animation-delay: -900ms;
			}
		}
	}
</style>