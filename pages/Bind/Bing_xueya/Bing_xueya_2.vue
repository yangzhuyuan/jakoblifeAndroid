<template>
	<view>
		<view style="display: flex; flex-direction: column;">
			<view style="margin: 15px 0 0 15px; font-size: 14px; color: gray;">请勿连接名称前有“5G”的WIFI</view>

			<image style="width: 90%;margin: 20px;" src="../../../static/image.png"></image>

			<view style="margin: 15px 0 0 15px;">
				<view class="input_style">
					<view style="font-weight: bold;">WIFI:</view>
				</view>
			</view>
			<view style="margin: 15px 0 0 15px;">
				<view class="input_style">
					<view style="font-weight: bold;">WIFI密码:</view>
					<input type="password" style="margin-left: 10px;" v-model="wifi_password" placeholder="请输入wifi密码" />
				</view>
			</view>

			<button class="btn" @click="btn_start()">开始连接</button>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},

		onShow() {
			uni.getNetworkType({
				success: function(res) {
					console.log(res.networkType);
					if (res.networkType != "wifi") {
						uni.showToast({
							icon: 'none',
							duration: 2000,
							title: "未连接WIFI",
						})
					} else {
						//判断获取的WiFi是否为机型WiFi
						// 主窗体  
						var MainActivity = plus.android.runtimeMainActivity()
						// 上下文  
						var Context = plus.android.importClass('android.content.Context')
						// 导入WIFI管理 和 WIFI 信息 的class  
						plus.android.importClass("android.net.wifi.WifiManager")
						plus.android.importClass("android.net.wifi.WifiInfo")
						plus.android.importClass("android.net.wifi.ScanResult")
						plus.android.importClass("java.util.ArrayList")
						// 获取 WIFI 管理实例  
						var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)

						// 获取当前连接WIFI的信息  
						var info = wifiManager.getConnectionInfo()

						// 获取当前 WIFI 连接的 SSID (WIFI 名称)  
						var ssid = info.getSSID()
						// 这里的 获取到的名称 是 带 双引号的 如 "cmcc"    
						// 所以我们这里处理一下  
						ssid = ssid.replace(/(^\"*)|(\"*$)/g, "")
						console.log("info", ssid)
						var resultList = wifiManager.getScanResults(),
							len = resultList.size()

						for (var i = 0; i < len; i++) {
							console.log(resultList.get(i).plusGetAttribute('SSID'))
						}
					}
				}
			})
		},


		methods: {
			btn_start() {
				uni.navigateTo({
					url: '../Bing_page/Bind_pg'
				})
			}

		}
	}
</script>

<style>
	.input_style {
		padding: 10px;
		border-bottom: 1px solid gainsboro;
		margin-right: 20px;
		display: flex;
		flex-direction: row;
	}

	.btn {
		margin: 60rpx 40rpx 0 40rpx;
		border-radius: 50rpx;
		background: skyblue;
		color: white;
	}
</style>