<template>
	<view style="color: black;height: 100vh;">
		<view v-if="listdata" style="padding-top: 20px;">
			<view class="list_bg" v-for="(item,index) in list" :key="index" @click="itme_click(index,item.switch)">
				<view class="list_item">
					<view style="width: 65vw">
						<view class="TIME">{{item.times}}</view>
						<view class="Tips">{{item.tag}}</view>
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

		onShow() {
			let that = this
			uni.getStorageInfo({
				success(res) {
					if (res.keys.includes("tixing")) {
						let tiixnglist = uni.getStorageSync("tixing")
						that.list = []
						for (let i = 0; tiixnglist.length > i; i++) {
							if (tiixnglist[i].times.includes("AM")) {
								tiixnglist[i].times = tiixnglist[i].times.replace("AM", "")
							} else if (tiixnglist[i].times.includes("PM")) {
								if (tiixnglist[i].times.substring(0, 2) == "01") {
									tiixnglist[i].times = "13" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "02") {
									tiixnglist[i].times = "14" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "03") {
									tiixnglist[i].times = "15" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "04") {
									tiixnglist[i].times = "16" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "05") {
									tiixnglist[i].times = "17" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "06") {
									tiixnglist[i].times = "18" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "07") {
									tiixnglist[i].times = "19" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "08") {
									tiixnglist[i].times = "20" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "09") {
									tiixnglist[i].times = "21" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "10") {
									tiixnglist[i].times = "22" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "11") {
									tiixnglist[i].times = "23" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								} else if (tiixnglist[i].times.substring(0, 2) == "12") {
									tiixnglist[i].times = "00" + tiixnglist[i].times.substring(2, tiixnglist[i]
										.times.length).replace("PM", "")
								}
							}
							that.list.push(tiixnglist[i])
						}
						uni.setStorageSync("tixing1", that.list)
						console.log("dajhsdahd", that.list)
					} else {
						that.list = []
						uni.setStorageSync("tixing1", that.list)
						console.log("tixing不存在")
					}

				}
			})
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
			itme_click(id, sw) {
				if (sw == true) {
					this.list[id].switch = false
				} else {
					this.list[id].switch = true
				}
				console.log("dasdjkashdadak", this.list)
				uni.setStorageSync("tixing", this.list)

			},
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
		padding: 0 20px 20px 20px;
	}

	.list_item {
		height: 107px;
		background: white;
		border-radius: 20px;
		padding: 0 20px;
		align-items: center;
		display: flex;
		flex-direction: row;
	}

	.Tips {
		margin-top: 10px;
		color: black;
		font-size: 16px;
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
		font-weight: bold;
	}
</style>