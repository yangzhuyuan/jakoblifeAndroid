<template>
	<view>
		<web-view src="http://jakob-techs.com/contact-us/"></web-view>
	</view>
</template>


<script>
	export default {
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('联系客服')
			})
		}
	}
</script>

<style>

</style>