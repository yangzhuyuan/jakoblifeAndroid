<template>
	<view style="padding: 20px;">
		<view class="titless">{{$t('XZGLLXitem.title_0')}}</view>
		<view class="title_1">{{$t('XZGLLXitem.title_1')}}</view>
		<view class="context_btn" @click="xueya_click()">
			<image class="img" src="../../static/icons/3.png" />
			<view class="context_title">{{$t('XZGLLXitem.button_0')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view class="context_btn" @click="tizhi_click()">
			<image class="img" src="../../static/icons/6.png" />
			<view class="context_title">{{$t('XZGLLXitem.button_1')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view style="width:100vw;position: fixed;bottom: 0;left: 0;">
			<button style="margin:0 15px 40px 15px; background: #3298F7; color: white; border-radius: 50rpx;"
				@tap="skile">{{$t('XZGLLXitem.button_2')}}</button>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="pupup_title" style="margin-top: 10px;">{{$t('XZGLLXitem.title_2')}}</view>
					<view class="pupup_title">{{$t('XZGLLXitem.title_3')}}</view>
					<view class="pupup_title">{{$t('XZGLLXitem.title_4')}}</view>
					<view style="margin-top: 20px;">{{$t('XZGLLXitem.title_5')}}</view>
					<view style="margin-top: 5px;">{{$t('XZGLLXitem.title_6')}}</view>
					<view style="margin-top: 5px;">{{$t('XZGLLXitem.title_7')}}</view>
					<view style="margin-top: 5px;">{{$t('XZGLLXitem.title_8')}}</view>
					<view class="btn">
						<button @tap="agree"
							style="width: 25vw;height: 50px; display: flex; justify-content: center; align-items: center; background: #3298F7; color: white;border-radius: 30px; font-weight: bold;">{{$t('login.text_4')}}</button>
						<button @tap="Turn_down"
							style="width: 25vw;line-height: 25px; height: 50px; display: flex; justify-content: center; align-items: center;background: lightgray; color: white;border-radius: 30px; font-weight: bold;">{{$t('XZGLLXitem.button_3')}}</button>
					</view>


				</view>
			</uni-popup>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				select_types: "",

			}
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('XZGLLX')
			})
		},

		methods: {
			xueya_click() {
				this.select_types = "xueya",
					this.$refs.popup.open('bottom')
			},
			tizhi_click() {
				this.select_types = "tizhi",
					this.$refs.popup.open('bottom')
			},
			skile() {
				uni.switchTab({
					url: "../tabBar/main/Main"
				})
			},
			agree() {
				uni.navigateTo({
					url: "../Bind/Bing_page/Bing_page?SELECT_TYPE=" + this.select_types
				})
			},
			Turn_down() {
				this.$refs.popup.close()
			},



		}
	}
</script>

<style>
	.titless {
		margin-top: 20px;
		font-size: 18px;
		font-weight: bold;
		color: black;
	}

	.title_1 {
		margin-top: 5px;
		font-size: 14px;
		color: gray;
	}

	.img {
		width: 25px;
		height: 25px;
	}

	.context_btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: white;
		padding: 15px;
		margin-top: 20px;
		border-radius: 30px;

	}

	.context_title {
		width: 70vw;
		font-size: 16px;
		color: black;
		font-weight: bold;
		margin-left: 10px;
	}

	.popup_bg {
		background: white;
		margin: 0 15px 40px 15px;
		border-radius: 50rpx;
		padding: 20px;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 18px;
		margin-top: 10rpx;
	}


	.btn {
		margin-top: 20px;
		margin-bottom: 20px;
		display: flex;
		flex-direction: row;

	}
</style>