<template>
	<view class="page-wrap">
		<AICardiovascularGuardianPanel ref="panel" :embedded="false" />
	</view>
</template>

<script>
	import AICardiovascularGuardianPanel from './AI_Cardiovascular_Guardian_Panel.vue'

	export default {
		components: {
			AICardiovascularGuardianPanel
		},
		onShow() {
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
		background: #F4F5F7;
	}
</style>
