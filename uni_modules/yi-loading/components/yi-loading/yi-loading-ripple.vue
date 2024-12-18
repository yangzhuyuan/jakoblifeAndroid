<template>
	<view>
		<view class="yi-loading-ripple" :style="'border-color:'+ color +';width: '+size+'px;height: '+size+'px;'">
			<view class="yi-loading-ripple-after" :style="'border-color:'+ color +';width: '+size+'px;height: '+size+'px;border-width: '+(size/10)+'px;'"></view>
			<view class="yi-loading-ripple-before" :style="'border-color:'+ color +';width: '+size+'px;height: '+size+'px;border-width: '+(size/10)+'px;'"></view>
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
	.yi-loading-ripple {
		position: relative;

		.yi-loading-ripple-after,
		.yi-loading-ripple-before {
			content: "";
			border-radius: 50%;
			border-style: solid;
			border-width: 5px;
			position: absolute;
			left: 0;
			top: 0;
			animation: YiLoadingRipple 2s linear infinite;
			opacity: 0;
			box-sizing: border-box;

			@keyframes YiLoadingRipple {
				0% {
					transform: scale(0.1);
					opacity: 1;
				}

				70% {
					transform: scale(0.8);
					opacity: 0.8;
				}

				100% {
					transform: scale(1);
					opacity: 0;
				}
			}
		}

		.yi-loading-ripple-after {
			animation-delay: 1000ms;
		}
	}
</style>