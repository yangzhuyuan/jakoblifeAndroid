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
	var ble;
	var systemInfo;
	var _this;
	export default {
		data() {
			return {
				title: 'Setting',
				message: "",
				settingList: [{
						text: "1.Basic info"
					},
					{
						text: "2.Mac Address"
					},
					{
						text: "3.Device model"
					},
					{
						text: "4.Mcu"
					}
				]
			};
		},

		methods: {
			onLoad() {
				_this = this;
				//判断是安卓还是ios系统
				_this.isAndroidOrIOS();
				//加载不同的插件
				if (systemInfo == "android") {
					ble = uni.requireNativePlugin('bluetooth-ycSdkPlugin');
				} else {
					ble = uni.requireNativePlugin('DCTestUniPlugin');
				}
			},
			isAndroidOrIOS() {
				let type = uni.getSystemInfoSync().platform
				switch (type) {
					case 'android':
						systemInfo = "android";
						break;
					case 'ios':
						systemInfo = "ios";
						break;
					default:
						systemInfo = "other";
						break;
				}
			},
			settingItemClick(index) {
				console.log("点击index:" + index + ",text:" + _this.settingList[index].text);
				uni.showLoading({
					title: '加载中'
				});
				switch (index) {
					case 0:
					//查询设备基本信息
						ble.queryDeviceBasicInfo((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 1:
						//查询设备mac地址
						ble.queryDeviceMacAddress((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 2:
						//查询设备型号
						ble.queryDeviceModel((res) => {
							uni.hideLoading();
							console.log(res.data);
							_this.message = res.data;
						});
						break;
					case 3:
						//查询设备主控平台
						ble.queryDeviceMCU((res) => {
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