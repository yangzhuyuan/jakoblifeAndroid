<template>
	<view>
		<view class="yi-loading-point" :style="'width: '+(size * 3)+'px;height: '+size+'px;'">
			<view :style="'width: '+size+'px;height: '+size+'px;background-color:'+color+';'"></view>
			<view :style="'width: '+size+'px;height: '+size+'px;background-color:'+color+';'"></view>
			<view :style="'width: '+size+'px;height: '+size+'px;background-color:'+color+';'"></view>
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
	.yi-loading-point {
	    display: flex;
	    justify-content: space-between;
		
	    view {
	        background-color: #1e9fff;
	        border-radius: 100%;
	        animation: YiLoadingPoint 1.4s infinite ease-in-out;
	        animation-fill-mode: both;
	        @keyframes YiLoadingPoint {
	            0%, 80%, 100% {
	                transform: scale(0.0);
	            } 40% {
	                  transform: scale(1.0);
	              }
	        }
			
			&:nth-child(2) {
			    animation-delay: -0.32s;
			}
			&:nth-child(3) {
			    animation-delay: -0.16s;
			}
	    }
		
	    
	
	}

</style>