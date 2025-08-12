<template>
	<view>
		<web-view :src="WebViewId"></web-view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				WebViewId: '',
			}
		},
		onLoad(optid) {
			this.WebViewId = optid.id
			uni.setNavigationBarTitle({
				title: optid.name
			})
		},
	}
</script>

<style>

</style>