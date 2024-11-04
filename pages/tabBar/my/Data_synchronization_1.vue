<template>
	<view style="padding: 20px;">
		<view style="font-weight: bold;">{{title}}</view>
		<view style="font-weight: bold;">{{content}}</view>
		<view class="bt_bg">
			<view style="display: flex; flex-direction: column; ">
				<button class="bt_Accept" @click="Accept()">{{$t('wodelist.bzzxitem.title_7')}}</button>
				<button class="bt_Turn_down" @click="Turn_down()">{{$t('wodelist.bzzxitem.title_8')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "数据同步失败",
				content: "------------------------------"

			}
		},


		onLoad(res) {
			if (res.ID == "1") {
				uni.setNavigationBarTitle({
					title: this.$t('wodelist.bzzxitem.title_13')
				})
			} else if (res.ID == "2") {
				uni.setNavigationBarTitle({
					title: this.$t('wodelist.bzzxitem.title_14')
				})
			}
		},


		methods: {

		}
	}
</script>

<style>
	.bt_bg {
		background: #F5F5F5;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
	}

	.bt_Accept {
		margin-top: 20px;
		background: #3298F7;
		border-radius: 40px;
		width: 90vw;
		color: white;
	}

	.bt_Turn_down {
		margin-top: 20px;
		margin-bottom: 20px;
		background: #DBDBDB;
		border-radius: 40px;
		width: 90vw;
		color: white;
	}
</style>