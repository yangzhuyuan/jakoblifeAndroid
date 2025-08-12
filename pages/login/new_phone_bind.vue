<template>
	<view style="padding: 20px;color: black; background: #F7F7F7; height: 100vh;">
		<view style="flex-direction: column; display: flex;padding-top: 108px; align-items: center; ">
			<image src="../../static/icons/success.png" style="width: 68px; height: 68px;"></image>
			<view style="font-size: 16px; margin-top: 20px;font-weight: 600;text-align: center;">
				{{$t('新号码已绑定成功')}}
			</view>
		</view>
		<view style="position: fixed; bottom: 0;left: 0; width: 100vw;">
			<button class="button_back" @click="back()">{{$t('确定')}}</button>
		</view>
	</view>
</template>
<script>
	export default {
		onLoad(res) {
			uni.setNavigationBarTitle({
				title: this.$t('新手机号绑定')
			})
		},

		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 3
				})
			}
		}
	}
</script>

<style>
	.button_back {
		width: auto;
		margin: 20px 20px 108px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
	}
</style>