<template>
	<view class="page-wrap">
		<HealthSummaryPanel ref="panel" :embedded="false" />
	</view>
</template>

<script>
	import HealthSummaryPanel from './Health_Summary_Panel.vue'

	export default {
		components: {
			HealthSummaryPanel
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('健康摘要')
			});
			this.$nextTick(() => {
				if (this.$refs.panel && this.$refs.panel.refreshData) {
					this.$refs.panel.refreshData()
				}
			})
		}
	}
</script>

<style scoped>
	.page-wrap {
		min-height: 100vh;
		background: #F8F9FB;
	}
</style>
