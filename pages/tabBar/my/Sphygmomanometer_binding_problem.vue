<template>
	<view style="padding: 20px;color: black;height: 100vh;">
		<view style="background: white;border-radius: 10px;padding: 10px;">
			<view style="padding: 10px;">
				<view @click="binding_Tutorials_4G()" style="display: flex; flex-direction: row; align-items: center; ">
					<text
						style="width: 90%; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_3')}}</text>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
				<text style="font-size: 12px; color: gray;margin-left: 10px;">TSB-617B-T、JL-BP67G、JL-BP68G为4G网络连接</text>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="binding_problem_4G()"
				style="display: flex; flex-direction: row; align-items: center;padding: 10px;">
				<text style="width: 90%; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_4')}}</text>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view style="padding: 10px;">
				<view @click="binding_Tutorials_wifi()"
					style="display: flex; flex-direction: row; align-items: center; ">
					<text style="width: 90%; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_5')}}</text>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
				<text style="font-size: 12px; color: gray;margin-left: 10px;">JL-BP67W、JL-BP68W为WIFI网络连接</text>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="binding_problem_wifi()"
				style="display: flex; flex-direction: row; align-items: center;padding: 10px;">
				<text style="width: 90%; margin-left: 10px;font-weight: bold;">{{$t('wodelist.bzzxitem.title_6')}}</text>
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

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.bzzxitem.title_0')
			})
		},

		methods: {
			binding_Tutorials_4G() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Sphygmomanometer_binding_problem_1?id=1"
				})
			},
			binding_problem_4G() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Sphygmomanometer_binding_problem_1?id=2"
				})
			},
			binding_Tutorials_wifi() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Sphygmomanometer_binding_problem_1?id=3"
				})
			},
			binding_problem_wifi() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Sphygmomanometer_binding_problem_1?id=4"
				})
			},

		}
	}
</script>

<style>

</style>