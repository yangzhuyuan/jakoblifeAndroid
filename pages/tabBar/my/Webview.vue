<template>
	<view>
		<web-view src="https://beian.miit.gov.cn"></web-view>
	</view>
</template>


<script>
	export default {
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('备案号1')
			})
		}
	}
</script>

<style>

</style>