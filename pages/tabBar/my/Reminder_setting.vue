<template>
	<view style="color: black;">
		<view v-if="listdata">
			<view class="list_bg" v-for="(item,index) in list" :key="index">
				<view class="list_item">
					<view style="width: 65vw">
						<view class="TIME">{{item.time}}</view>
						<view class="Tips">{{item.tips}}</view>
					</view>
					<switch style="transform:scale(0.8);" :checked="item.switch" color="#0686CC" />
				</view>
			</view>
		</view>
		<view v-else class="aa">
			<text>-</text>
			<text>{{$t('qushiitem.title_16')}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listdata: true,
				list: [{
						tips: "测试",
						time: "08:00",
						switch: true,

					},
					{
						tips: "吃药",
						time: "08:00",
						switch: false,

					}
				]

			}
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.txsz')
			})

		},

		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "/pages/tabBar/my/Reminder_setting_1"
			})
		},


		methods: {

		}
	}
</script>

<style>
	.aa {
		display: flex;
		align-items: center;
		padding-top: 80px;
		flex-direction: column;
	}

	.list_bg {
		padding: 15px 20px 0 20px;
	}

	.list_item {
		background: white;
		border-radius: 20px;
		padding: 20px;
		align-items: center;
		display: flex;
		flex-direction: row;
	}

	.Tips {
		margin-top: 10px;
		color: black;
		font-weight: bold;
	}

	.list_item_1 {
		padding: 15px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.TIME {
		font-size: 22px;
		width: 80vw;
	}
</style>