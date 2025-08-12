<template>
	<view>
		<web-view src="http://jakob-techs.com/contact-us/"></web-view>
	</view>
</template>


<script>
	export default {
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('反馈')
			})
		}
	}
</script>

<style>

</style>