<template>
	<view>
		<view v-if="lisdata_show">
			<view v-for="(item,index) in list" :key="index" style="padding-top: 20px;">
				<view style="background: white;margin: 0 20px 0 20px;padding: 15px;border-radius: 10px"
					@click="listclick(item.name,item.avatar)">
					<view style="display: flex;flex-direction: row; justify-content: space-between; ">
						<view style="font-weight: bold;margin:0 0 5px 10px;">{{item.type}}</view>
						<view style="margin-right: 10px;">{{item.time}}</view>
					</view>
					<view style="width: 78vw; background: gainsboro;height: 1px; margin-left: 10px;"></view>
					<view style="margin: 10px 0 0 10px; display: flex;flex-direction: row; align-items: center;">
						<image :src="item.avatar" style="width: 45px; height: 45px;border-radius: 50px;">
						</image>
						<view style="margin-left: 20px; width: 55vw;">
							<view style="font-size: 16px;font-weight: bold;">{{item.name}}</view>
							<view style="color: gray;">{{item.content}}</view>
						</view>
						<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
					</view>
				</view>
			</view>

		</view>
		<view v-else class="aa">
			<text>-</text>
			<text>{{$t('wodelist.xiaoxiitem.title_0')}}</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				lisdata_show: false,
				list: [{
						type: "邀请",
						time: "10:20",
						avatar: "../../../static/icons/40x40.png",
						name: "小明",
						content: "想与您共享健康数据"
					},
					{
						type: "邀请",
						time: "10:20",
						avatar: "../../../static/shuijiao.jpg",
						name: "小红",
						content: "想与您共享健康数据"
					},
				],
			}
		},

		onReady() {
			document.querySelector('.uni-page-head-ft .uni-page-head-btn .uni-btn-icon').innerHTML = this.$t(
				"wodelist.xiaoxiitem.button_0");
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("wodelist.xiaoxi")
			})
		},
		onLoad() {
			if (this.list == "" || this.list == undefined) {
				this.lisdata_show = false
			} else {
				this.lisdata_show = true
			}
		},


		methods: {
			listclick(name, avatar) {
				uni.navigateTo({
					url: "../my/Invite?NAME=" + name + "&AVATAR=" + avatar
				})

			}


		}
	}
</script>

<style>
	.aa {
		display: flex;
		align-items: center;
		padding-top: 50px;
		flex-direction: column;
	}
</style>