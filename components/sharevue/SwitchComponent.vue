<template>
	<view style="display: flex; justify-content: center; margin: 10px 0;">
		<view class="swich_bg_0">
			<view @click="emitClick1">
				<view v-if="show1" class="swich_bg">{{$t('与他人共享')}}</view>
				<view v-else class="swich_bg_1">{{$t('与他人共享')}}</view>
			</view>
			<view @click="emitClick2">
				<view v-if="show2" class="swich_bg">{{$t('他人与我共享')}}</view>
				<view v-else class="swich_bg_1">{{$t('他人与我共享')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show1: Boolean,
			show2: Boolean
		},
		methods: {
			emitClick1() {
				this.$emit('click1');
			},
			emitClick2() {
				this.$emit('click2');
			}
		}
	}
</script>