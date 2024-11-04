<template>
	<view style="padding: 15px;">
		<view style="background: white; padding: 15px;border-radius: 10px">
			<input type="text" :placeholder="$t('wodelist.txszitem.tx_title0')" v-model="input_tag" />
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
				title:this.$t('wodelist.txszitem.tx_title1')
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