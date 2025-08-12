<template>
	<view style="padding: 15px;color: black;height: 100vh;">
		<view style="background: white; padding: 15px;border-radius: 10px">
			<input type="text" :placeholder="$t('标签')" v-model="input_tag" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				input_tag: '',

			}
		},
		
		onShow() {
			uni.setNavigationBarTitle({
				title:this.$t('标签')
			})
		},

		onBackPress() {
			uni.$emit('input_tag', this.input_tag)
			delta: 1
		},

		methods: {

		}
	}
</script>

<style>

</style>