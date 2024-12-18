<template>
	<view style="color: black;height: 100vh;width: 100vw;">
		<view style=" display: flex; justify-content: center; padding: 40px 0 10px 0;">
			<view class="swich_bg_0">
				<view @click="clicked1()">
					<view v-if="show1" class="swich_bg">{{$t('gongxiangitem.title_0')}}</view>
					<view v-else class="swich_bg_1">{{$t('gongxiangitem.title_0')}}</view>
				</view>
				<view @click="clicked2()">
					<view v-if="show2" class="swich_bg_1">{{$t('gongxiangitem.title_1')}}</view>
					<view v-else class="swich_bg">{{$t('gongxiangitem.title_1')}}</view>
				</view>
			</view>
		</view>
		<view style="margin-top: 10px;">
			<view v-for="(item,index) in filterList" :key="index" @click="Share_with(item.name,item.phone)">
				<view style="display: flex;align-items: center; padding: 10px;margin: 0 15px 0 15px;">
					<image :src="item.avatar"
						style="border-radius: 20px; width: 40px; height: 40px; border: 1px solid gainsboro;">
					</image>
					<view style="width: 65vw; text-align: left;margin-left: 20px;">
						<view style="font-weight: bold;">{{item.name}}</view>
						<view style="color: gray;font-size: 14px;">{{item.phone}}</view>
					</view>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
				<view style="margin-left: 20px; background: gainsboro; width: 88vw; height: 1px;">
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				show1: true,
				show2: true,
				filterList: [{
						avatar: "../../../static/icons/40x40.png",
						name: "JAKOB1",
						phone: "0568",
					},
					{
						avatar: "../../../static/icons/40x40.png",
						name: "AKOB3",
						phone: "123456",
					},
					{
						avatar: "../../../static/icons/40x40.png",
						name: "测试",
						phone: "123456",
					}
				]
			}
		},
		
		onLoad() {
			uni.setNavigationBarTitle({
				title:this.$t('gongxiangitem.title_30')
			})
		},
		
		methods: {
			//与他人共享
			clicked1() {
				this.show1 = true
				this.show2 = true
			},
			//他人与我共享
			clicked2() {
				this.show1 = false
				this.show2 = false
			},
		}
	}
</script>

<style>
	.swich_bg_0 {
		display: flex;
		flex-direction: row;
		height: 30px;
		padding: 3px;
		width: 280px;
		background: #3298F7;
		border-radius: 20px
	}

	.swich_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: black;
		width: 140px;
		line-height: 15px;
		height: 30px;
		background: white;
		border-radius: 20px;
	}

	.swich_bg_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		line-height: 15px;
		text-align: center;
		width: 140px;
		height: 30px;
	}
</style>