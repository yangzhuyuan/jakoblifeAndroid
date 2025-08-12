<template>
	<view style="padding:40px 20px 0 20px; black; background: #F5F5F5 ; height: 100vh;font-size: 16px;">
		<view style="background: white;border-radius: 20px;width: auto;">
			<view @click="failure()" class="title_btn_bg">
				<view class="textstyles">{{$t('数据同步失败')}}</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px;margin-left: 15px;"></view>
			<view @click="takes_a_long_time()" class="title_btn_bg">
				<view class="textstyles">{{$t('数据同步等待时间长')}}</view>
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
				title: this.$t('数据同步')
			})
		},
		methods: {
			failure() {
				uni.navigateTo({
					url: "../my/Data_synchronization_1?ID=1"
				})

			},
			takes_a_long_time() {
				uni.navigateTo({
					url: "../my/Data_synchronization_1?ID=2"
				})
			}
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