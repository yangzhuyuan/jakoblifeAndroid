<template>
	<view class="page">

		<view style="margin-left: 20px;margin-right: 20px;">
			<text style="word-break: break-all;">{{ message }}</text>
		</view>
		<scroll-view class="border list" scroll-y="true">
			<view v-for="(item,index) in settingList" :key="index" class="list-item" @click="settingItemClick(index)">
				<text class="text">{{item.text}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	const ble = uni.requireNativePlugin('bluetooth-ycSdkPlugin');
	var _this;
	export default {
		data() {
			return {
				title: 'Watch Face',
				message: "",
				settingList: [{
						text: "1.YC Query"
					},
					{
						text: "2.YC Change"
					},
					{
						text: "3.YC Delete"
					},
					{
						text: "4.YC Download"
					},
					{
						text: "5.YC Custom dial"
					},
					{
						text: "6.JL Query"
					},
					{
						text: "7.JL Change"
					},
					{
						text: "8.JL Delete"
					},
					{
						text: "9.JL Download"
					},
					{
						text: "10.JL Custom dial"
					}
				]
			};
		},

		methods: {
			onLoad() {
				_this = this;
			},
			settingItemClick(index) {
				// console.log("点击index:" + index + ",text:" + _this.settingList[index].text);
				uni.showLoading({
					title: '加载中'
				});
				switch (index) {
					case 0:
						ble.queryWatchFaceInfo((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 1:
						ble.changeWatchFace(185, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 2:
						ble.deleteWatchFace(306, (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 3:
						ble.installWatchFace([true, 306, 0, 0, ""], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 4:
						ble.queryDeviceCustomWatchFaceInfo("assets/files/customE88E.bin", (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 5:
						ble.queryWatchFaceInfo((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 6:
						ble.changeJieLiWatchFace("WATCH1", (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 7:
						ble.deleteJieLiWatchFace("watch28", (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 8:
						ble.installJieLiWatchFace(["watch28", "assets/files/watch28"], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 9:
						ble.installJieLiCustomWatchFace(["watch900", "", "", "", ""], (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.page {
		padding-top: 20px;
		padding-bottom: 20px;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-content: flex-start;
		align-items: flex-start;

	}

	.list {
		margin-top: 100px;
		margin-bottom: 100px;

		.list-item {
			background-color: #f8f8f8;

			.text {
				height: 50px;
				line-height: 50px;
				margin-left: 20px;
				color: #003366;
			}
		}
	}

	.log {
		width: 87vw;
		font-size: 13px;
		color: #003366;

		.log-bottom {
			height: 10vw;
		}
	}
</style>