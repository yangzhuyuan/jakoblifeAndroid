<template>
	<view style="padding: 20px;">
		<view style="background: white;border-radius: 10px;padding: 10px;">
			<view @click="Sphygmomanometer_binding_problem()"
				style="display: flex; flex-direction: row; align-items: center; padding: 10px;">
				<text
					style="width: 90vw; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_0')}}</text>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="Body_fat_scale_binding_problem()"
				style="display: flex; flex-direction: row; align-items: center;padding: 10px;">
				<text
					style="width: 90vw; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_1')}}</text>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="Data_synchronization()"
				style="display: flex; flex-direction: row; align-items: center;padding: 10px;">
				<text
					style="width: 90vw; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_2')}}</text>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.bzzx')
			})
		},



		methods: {
			//血压计绑定问题
			Sphygmomanometer_binding_problem() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Sphygmomanometer_binding_problem"
				})

			},
			//体脂秤绑定问题
			Body_fat_scale_binding_problem() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Body_fat_scale_binding_problem"
				})
			},
			//数据同步
			Data_synchronization() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Data_synchronization"
				})
			}

		}
	}
</script>

<style>

</style>