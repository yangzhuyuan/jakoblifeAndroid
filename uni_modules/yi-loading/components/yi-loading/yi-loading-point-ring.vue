<template>
	<view class="yi-loading-point-ring" :style="'width:'+size+'px;height: '+size+'px;'">
		<view class="yi-loading-point-ring-ring" :style="'border-bottom-color:'+ color +';border-top-color:'+ color +';width: '+size+'px;height: '+size+'px;border-width: calc('+size+'px / 10);'"></view>
		<view class="yi-loading-point-ring-point" :style="'background:'+color+';width:'+size+'px;height: '+size+'px;'"></view>
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
	.yi-loading-point-ring{
		box-sizing: border-box;
		position: relative;
		
		.yi-loading-point-ring-ring {
		    border: 5px solid rgba(0, 0, 0, 0);
		    animation: YiLoadingPointRingRing 2s linear 0s infinite;
		    border-radius: 100%;
			box-sizing: border-box;
			transform-origin: center;
			position: absolute;
			left: 0;
			top: 0;
			
			@keyframes YiLoadingPointRingRing {
			    0% {
			        transform: rotate(0deg);
					
			    }
			    100% {
			        transform: rotate(360deg);
			    }
			}
		}
		
		.yi-loading-point-ring-point{
			border-radius: 100%;
			animation: YiLoadingPointRingPoint 1s infinite ease-in-out;
			animation-fill-mode: both;
			transform-origin: center;
			position: absolute;
			left: 0;
			top: 0;
			
			@keyframes YiLoadingPointRingPoint {
			    0%, 80%, 100% {
			        transform: scale(0);
			    } 
				40% {
			        transform: scale(0.8);
			    }
			}
		}
	}
	
</style>