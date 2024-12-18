<template>
	<view style="padding-top: 10px;background: #EFEFF4; color: black;height: 100vh;">
		<view class="list-container">
			<view class="list-item" @click="btn_add()">
				<view
					style="display: flex;flex-direction:column;justify-content: center;align-items: center; height: 160px;"
					@click="check_click(index)">
					<image style="width: 80px; height: 80px;" :src="imageurl">
					</image>
					<view style="text-align: center; margin-top: 20px;">{{title}}</view>
				</view>
			</view>
			<view class="list-item" :style="getboeder(index)" v-for="(item, index) in list" :key="index">
				<view
					style="display: flex;flex-direction:column;display: flex; justify-content: center;align-items: center;height: 160px;"
					@click="check_click(index,item.deviceModelConnectType,item.deviceSn)">
					<image style="width: 80px; height: 80px;" :src="item.picture"></image>
					<view style="text-align: center; margin-top: 20px;">{{item.deviceModelName}}</view>
				</view>
			</view>

		</view>
		<view
			style="background: #EFEFF4; width:100vw;height: 100px;  display: flex;position: fixed;bottom: 0; flex-direction: column; padding-top: 40rpx; padding-bottom: 50rpx;">
			<!-- <button class="button_bg_color" :style="getboeder1(act)"
				@tap="True">{{$t('wodelist.sbglitem.title_1')}}</button> -->
			<button class="button_bg_color" :style="getboeder1(act)"
				@tap="Delete">{{$t('wodelist.sbglitem.title_2')}}</button>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageurl: '../../../static/icons/add.png',
				title: this.$t('wodelist.sbglitem.title_0'),
				list: [],
				act: "未选择",
				deviceSn: '',
				deviceModelConnectType: '',

			}
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.sbgl')
			})
			that.queryDevices()



		},


		methods: {





			btn_add() {
				uni.navigateTo({
					url: '../../Bind/cs_manage'
				})
			},

			check_click(index, deviceModelConnectType, deviceSn) {
				this.act = index
				this.deviceModelConnectType = deviceModelConnectType
				this.deviceSn = deviceSn
				this.getboeder(index)
				this.getboeder1(index)
			},
			getboeder(index) {
				console.log("ccc", index)
				return {
					color: index == this.act ? "#3298F7" : "#000000",
					border: index == this.act ? "2px solid #3298F7" : ""
				}
			},
			getboeder1(index) {
				console.log("aaa", index)
				return {
					background: index == "未选择" || index == undefined ? "#DBDBDB" : "#3298F7"
				}
			},
			True() {
				console.log("dddd", this.act)
				if (this.act === "未选择" || this.act === "" || this.act === undefined) {
					uni.showToast({
						title: "请选择一个设备",
						icon: "none"
					})
					return
				} else {
					if (uni.getStorageSync('deviceSn') === this.deviceSn) {
						uni.showToast({
							title: '当前已经绑定该设备',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '绑定成功',
							icon: 'none'
						})
						uni.setStorageSync("deviceSn", this.deviceSn)
						setTimeout(function() {
							uni.navigateBack()
						}, 500)

						// 	//0-扫码  1-蓝牙 2-WiFi
						// 	if (this.deviceModelConnectType === 0) {
						// 		console.log("aaa")
						// 		uni.navigateTo({
						// 			url: '../../Bind/Bing_page/Bing_page_1'
						// 		})
						// 	} else if (this.deviceModelConnectType === 1) {
						// 		uni.navigateTo({
						// 			url: '../../Bind/Bing_xueya/Bing_xueya_LY'
						// 		})
						// 	} else if (this.deviceModelConnectType === 2) {
						// 		uni.navigateTo({
						// 			url: '../../Bind/Bing_xueya/Bing_xueya'
						// 		})
						// 	}
					}
				}
			},
			Delete() {
				if (this.act === "未选择" || this.act === "" || this.act === undefined) {
					uni.showToast({
						title: "请选择一个设备",
						icon: "none"
					})
					return
				} else {
					this.getunbind()
				}
			},
			//查询用户的绑定设备
			queryDevices() {
				let that = this
				uni.request({
					url: that.$url_queryDevices,
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("查询用户的绑定设备", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								that.list = res.data.rows
								console.log(that.list)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					}
				})
			},
			//解除绑定记录
			getunbind() {
				let that = this
				console.log(that.deviceSn)
				uni.request({
					url: that.$url_getunbind,
					method: 'POST',
					data: {
						deviceSn: that.deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("解除绑定记录", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								if (that.deviceSn == uni.getStorageSync("deviceSn")) {
									uni.removeStorageSync("deviceSn")
								}
								that.queryDevices()
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					}
				})
			}

		}
	}
</script>

<style>
	.list-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 5px 10px 160px 10px;
		justify-content: space-between;

	}



	.list-item {
		/* 两列宽度分配比例 */
		/* 列表项间距 */
		background-color: #f3f3f3;
		background: white;
		border-radius: 10px;
		/* 背景色 */
		margin: 5px 5px 10px 5px;
		padding: 5px;
		/* 内边距 */
		box-sizing: border-box;
		/* 盒模型 */
	}

	.button_bg_color {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		width: 80vw;
		background: #DBDBDB;
		color: white;
		border-radius: 50rpx;
	}
</style>