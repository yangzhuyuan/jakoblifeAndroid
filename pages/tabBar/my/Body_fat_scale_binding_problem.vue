<template>
	<view style="padding:40px 20px 0 20px; black; background: #F5F5F5 ; height: 100vh;font-size: 16px;">
		<view style="background: white;border-radius: 20px;width: auto;">
			<view class="title_btn_bg">
				<view @click="binding_Tutorials_4G()" style="display: flex; flex-direction: column; align-items: left;">
					<view class="textstyles">{{$t('款体脂秤绑定教程')}}</view>
					<view
						style="font-size: 10px; color: #999999; font-weight: 400;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						{{$t('网络连接')}}
					</view>
				</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="binding_problem_4G()" class="title_btn_bg">
				<view class="textstyles">{{$t('款体脂秤绑定不了')}}</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view class="title_btn_bg">
				<view @click="binding_Tutorials_wifi()"
					style="display: flex; flex-direction: column; align-items: left;">
					<view class="textstyles">{{$t('WIFI款体脂秤绑定教程')}}
					</view>
					<view style="font-size: 10px; color: #999999; font-weight: 400;">{{$t('网络连接1')}}</view>
				</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="binding_problem_wifi()" class="title_btn_bg">
				<view class="textstyles">{{$t('WIFI款体脂秤绑定不了')}}</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
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
				title: this.$t('体脂秤使用指南')
			})
		},
		methods: {
			binding_Tutorials_4G() {
				uni.navigateTo({
					url: "../../tabBar/my/Body_fat_scale_binding_problem_1?id=1"
				})
			},
			binding_problem_4G() {
				uni.navigateTo({
					url: "../../tabBar/my/Body_fat_scale_binding_problem_1?id=2"
				})
			},
			binding_Tutorials_wifi() {
				uni.navigateTo({
					url: "../../tabBar/my/Body_fat_scale_binding_problem_1?id=3"
				})
			},
			binding_problem_wifi() {
				uni.navigateTo({
					url: "../../tabBar/my/Body_fat_scale_binding_problem_1?id=4"
				})
			},

		}
	}
</script>

<style>
	.title_btn_bg {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 56px;
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 5px;
		align-items: center;
	}

	.textstyles {
		font-size: 16px;
		color: #1A1A1A;
		font-weight: 400;
	}
</style>