<template>
	<view>
		<view class="yi-loading-ring-double" :style="'border-bottom-color:'+ color +';border-top-color:'+ color +';width: '+size+'px;height: '+size+'px;border-width: '+(size/10)+'px;'"></view>
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
	.yi-loading-ring-double {
	    border: 5px solid #ccc;
	    animation: YiLoadingRingDouble 2s linear 0s infinite;
	    border-radius: 100%;
		box-sizing: border-box;
		
		@keyframes YiLoadingRingDouble {
		    0% {
		        transform: rotate(0deg);
		    }
		    100% {
		        transform: rotate(360deg);
		    }
		}
	}
</style>