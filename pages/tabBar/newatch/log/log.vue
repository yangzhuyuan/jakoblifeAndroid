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
				title: 'Ota',
				message: "",
				settingList: [{
						text: "获取AppSdk的日志路径"
					},
					{
						text: "获取杰理设备的日志路径"
					},
					{
						text: "获取设备的日志内容"
					}
				]
			};
		},

		methods: {
			onLoad() {
				_this = this;
			},
			settingItemClick(index) {

				uni.showLoading({
					title: '加载中'
				});
				switch (index) {
					case 0:
						ble.getLogFilePath("", (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 1:
						ble.getLogFilePath("", (res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 2:
						ble.getLogFilePath("", (res) => {
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