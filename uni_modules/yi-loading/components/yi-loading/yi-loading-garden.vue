<template>
	<view>
		<view class="yi-loading-garden" :style="'width: '+size+'px;height: '+size+'px;border-top-color:'+color+';border-top-width:'+(size/10)+';border-right-width:'+(size/10)+';'"></view>
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
	.yi-loading-garden {
		box-sizing: border-box;
	    border-radius: 50%;
	    display: inline-block;
	    border-top: 6px solid #1e9fff;
	    border-right: 6px solid transparent;
	    animation: YiLoadingGarden 1s linear infinite;
	    @keyframes YiLoadingGarden {
	        0% {
	            transform: rotate(0deg);
	        }
	        100% {
	            transform: rotate(360deg);
	        }
	    }
	}
</style>