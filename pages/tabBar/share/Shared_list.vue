<template>
	<view style="color: black;height: 100vh;width: 100vw;background: #F5F5F5;">
		<view style=" display: flex; justify-content: center; padding: 40px 0 10px 0;">
			<view class="swich_bg_0">
				<view @click="clicked1()">
					<view v-if="show1" class="swich_bg">{{$t('与他人共享')}}</view>
					<view v-else class="swich_bg_1">{{$t('与他人共享')}}</view>
				</view>
				<view @click="clicked2()">
					<view v-if="show2" class="swich_bg_1">{{$t('他人与我共享')}}</view>
					<view v-else class="swich_bg">{{$t('他人与我共享')}}</view>
				</view>
			</view>
		</view>
		<view style="margin-top: 10px;" v-if="show1">
			<view v-for="(item,index) in filterList" :key="index"
				@click="Share_with(item.id,item.receiverAvatar,item.receiverName,item.receiverPhone)">
				<view style="display: flex;align-items: center; padding: 10px;margin: 0 15px 0 15px;">
					<image :src="item.receiverAvatar === ''?'../../../static/icons/60x60.png':item.receiverAvatar"
						style="border-radius: 20px; width: 40px; height: 40px; border: 1px solid gainsboro;">
					</image>
					<view style="width: 65vw; text-align: left;margin-left: 20px;">
						<view style="font-weight: bold;">{{item.receiverName}}</view>
						<view style="color: gray;font-size: 14px;">{{item.receiverPhone}}</view>
					</view>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
				<view style="margin-left: 20px; background: gainsboro; width: 88vw; height: 1px;">
				</view>
			</view>
		</view>
		<view style="margin-top: 10px;" v-else>
			<view v-for="(item,index) in filterList" :key="index">
				<view style="display: flex;align-items: center; padding: 10px;margin: 0 15px 0 15px;">
					<image :src="item.shareAvatar"
						style="border-radius: 20px; width: 40px; height: 40px; border: 1px solid gainsboro;">
					</image>
					<view style="width: 65vw; text-align: left;margin-left: 20px;">
						<view style="font-weight: bold;">{{item.shareName}}</view>
						<view style="color: gray;font-size: 14px;">{{item.sharePhone}}</view>
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
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: {
			...mapState(['info']),
		},
		data() {
			return {
				show1: true,
				show2: true,
				filterList: [],
			}
		},


		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("共享列表")
			})

			this.share_list()
		},

		methods: {
			//与他人共享
			clicked1() {
				this.show1 = true
				this.show2 = true
				this.share_list()
			},
			//他人与我共享
			clicked2() {
				this.show1 = false
				this.show2 = false
				this.receiver_list()
			},

			Share_with(id, shareAvatar, shareName, sharePhone, item) {
				uni.navigateTo({
					url: "./Share_with_2?AVATAR=" + shareAvatar + "&NAME=" + shareName + "&PHONE=" + sharePhone +
						"&ID=" + id
				})
			},

			//查看我分享给别人的数据点列表
			share_list() {
				let that = this
				uni.request({
					url: that.$url_share_list,
					method: 'POST',
					data: {
						shareId: uni.getStorageSync("userid")
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						if (pending.data.code == 200) {
							that.filterList = pending.data.data
						}
					},
				})
			},
			//查看别人分享给我的数据点列表
			receiver_list() {
				let that = this
				uni.request({
					url: that.$url_receiver_list,
					method: 'POST',
					data: {
						receiverId: uni.getStorageSync("userid")
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						if (pending.data.code == 200) {
							that.filterList = pending.data.data
						}
					},
				})
			},

		}
	}
</script>

<style>
	.swich_bg_0 {
		display: flex;
		flex-direction: row;
		height: 44px;
		padding: 3px;
		width: 280px;
		background: #3298F7;
		border-radius: 100px
	}

	.swich_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: black;
		width: 140px;
		line-height: 15px;
		height: 44px;
		font-size: 14px;
		font-weight: 600;
		background: white;
		border-radius: 100px;
	}

	.swich_bg_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		line-height: 15px;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
		width: 140px;
		height: 44px;
	}
</style>