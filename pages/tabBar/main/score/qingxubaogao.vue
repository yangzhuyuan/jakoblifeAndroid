<template>
	<view>
		<view style="padding: 20px; margin-top: 20px; display: flex;justify-content: center;color: red;">
			{{$t("免责声明重要提示本报告结果由算法生成")}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("详细报告")
			})
		},
		methods: {

		}
	}
</script>

<style>

</style>