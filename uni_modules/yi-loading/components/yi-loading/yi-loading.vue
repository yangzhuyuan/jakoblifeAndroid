<template>
	<view :class="center ? 'yi-loading' : ''" :style="(mask && center) ? 'background: '+maskColor+';' : ''">
		<Ripple v-if="type === 'ripple'" :size="size" :color="color"></Ripple>
		<Ring v-if="type === 'ring'" :size="size" :color="color"></Ring>
		<RingDouble v-if="type === 'ring-double'" :size="size" :color="color"></RingDouble>
		<Point v-if="type === 'point'" :size="size" :color="color"></Point>
		<Garden v-if="type === 'graden'" :size="size" :color="color"></Garden>
		<Audio v-if="type === 'audio'" :size="size" :color="color"></Audio>
		<PointRing v-if="type === 'point-ring'" :size="size" :color="color"></PointRing>
		<LoadingBlock v-if="type === 'block'" :size="size" :color="color"></LoadingBlock>
	</view>
</template>

<script>
	import Ripple from "./yi-loading-ripple.vue";
	import Ring from "./yi-loading-ring.vue";
	import RingDouble from "./yi-loading-ring-double.vue";
	import Point from "./yi-loading-point.vue";
	import Garden from "./yi-loading-garden.vue";
	import Audio from "./yi-loading-audio.vue";
	import PointRing from "./yi-loading-point-ring.vue";
	import LoadingBlock from "./yi-loading-block.vue";
	
	export default {
		components:{
			Ripple,
			Ring,
			RingDouble,
			Point,
			Garden,
			Audio,
			PointRing,
			LoadingBlock
		},
		props: {
			type: {
				type: String,
				default: 'ring',
			},
			color: {
				type: String,
				default: "#1e9fff"
			},
			size: {
				type: Number,
				default: 45
			},
			mask: { // center为true时才会生效
				type: Boolean,
				default: false
			},
			maskColor: {
				type: String,
				default: 'rgba(0, 0, 0, .2)'
			},
			center: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss">
	.yi-loading{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>