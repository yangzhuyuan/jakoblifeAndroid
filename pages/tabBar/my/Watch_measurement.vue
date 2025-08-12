<template>
	<view style="padding-top: 20px;">
		<view class="bt_BG">
			<view class="text">{{$t('开始时间')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker fields="month" mode="time" :value="time1" @change="bindTimeChange_1">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor(time1)">{{time1}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('结束时间')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker fields="month" mode="time" :value="time2" @change="bindTimeChange_2">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg" :style="getStatusColor(time2)">{{time2}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="bt_BG">
			<view class="text">{{$t('间隔时间')}}</view>
			<view class="uni-list-cell-db"
				style="width: 60vw; display: flex;justify-content: flex-end; flex-direction: row;margin-left: 15px;">
				<picker :value="index1" @change="Interval_time" :range="array1">
					<view style="display: flex; flex-direction: row;align-items: center;">
						<view class="date_bg">{{array1[index1]}}</view>
						<uni-icons type="bottom" size="20" style="margin-left: 15px; margin-right: 20px;"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<button class="buttonstyle" @click="aaaaaaa()">{{$t("设置自动血压监测")}}</button>
		<button class="buttonstyle_1" @click="aaaaaaa1()">{{$t("关闭自动监控")}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time1: uni.getStorageSync("starttime") !== '' ? uni.getStorageSync("starttime") : this.$t(
					'请选择'),
				time2: uni.getStorageSync("endtime") !== '' ? uni.getStorageSync("endtime") : this.$t(
					'请选择'),
				array1: [this.$t('分钟30'), this.$t('分钟60'), this.$t('分钟90'), this.$t('分钟120'), this.$t('分钟240')],
				index1: uni.getStorageSync("Interval_time") !== "" ? uni.getStorageSync("Interval_time") : 0,
				deviceId: uni.getStorageSync("landeviceId"),
				serviceId: uni.getStorageSync("lanserviceId"),
				characteristicId: uni.getStorageSync("landcharacteristicId"),
			}
		},

		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('自动血压监测设置')
			})
		},
		methods: {
			bindTimeChange_1(e) {
				this.time1 = e.detail.value
				uni.setStorageSync("starttime", this.time1)
			},
			bindTimeChange_2(e) {
				this.time2 = e.detail.value
				uni.setStorageSync("endtime", this.time2)
			},
			Interval_time(e) {
				this.index1 = e.detail.value
				uni.setStorageSync("Interval_time", this.index1)
			},

			getStatusColor(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === this.$t('请选择') ? 'gray' : 'black'
				};
			},

			aaaaaaa() {
				if (this.time1 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('开始时间'),
						icon: 'none'
					})
					return
				} else if (this.time2 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('结束时间'),
						icon: 'none'
					})
					return
				}
				this.getBLEDeviceCharacteristics1()
			},
			aaaaaaa1() {
				this.getBLEDeviceCharacteristics2()
			},



			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics1() {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						console.log('获取蓝牙设备某个服务中所有特征值(characteristic)2', res.characteristics)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.notify) {
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: that.deviceId,
									serviceId: that.serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {},
									fail: (notifyerr) => {}
								})
							}
							setTimeout(() => {
								if (item.properties.write) {
									that.sendLargeData1()
								}
							}, 2000)
						}
					},
					fail(res) {
						uni.showToast({
							title: res.errCode + ":" + res.errMsg,
							icon: 'none'
						})
					}
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics2() {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						console.log('获取蓝牙设备某个服务中所有特征值(characteristic)2', res.characteristics)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.notify) {
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: that.deviceId,
									serviceId: that.serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {},
									fail: (notifyerr) => {}
								})
							}
							setTimeout(() => {
								if (item.properties.write) {
									that.sendLargeData2()
								}
							}, 2000)
						}
					},
					fail(res) {
						uni.showToast({
							title: res.errCode + ":" + res.errMsg,
							icon: 'none'
						})
					}
				})
			},



			sendLargeData1() {
				let jiangetime = 30
				if (this.index1 === 0) {
					jiangetime = 30
				} else if (this.index1 === 1) {
					jiangetime = 60
				} else if (this.index1 === 2) {
					jiangetime = 90
				} else if (this.index1 === 3) {
					jiangetime = 120
				} else if (this.index1 === 4) {
					jiangetime = 240
				}

				let starttimes1 = this.time1.slice(0, 2)
				let starttimes2 = this.time1.slice(3, 5)
				let endtimes1 = this.time2.slice(0, 2)
				let endtimes2 = this.time2.slice(3, 5)
				let that = this
				const timeSyncData = that.createTimeSyncData(parseInt(starttimes1), parseInt(starttimes2), parseInt(
					endtimes1), parseInt(endtimes2), parseInt(jiangetime)); // 构造时间同步数据
				console.log(timeSyncData.toLowerCase())
				const buffer = that.toArrayBuffer(timeSyncData.toLowerCase()); // 转换为 ArrayBuffer
				console.log(buffer)
				uni.writeBLECharacteristicValue({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					characteristicId: that.characteristicId,
					value: buffer,
					success: () => {
						console.log("血压定时测量协议发送成功");
						uni.showToast({
							title: that.$t("设定成功"),
							icon: 'none'
						})
					},
					fail: (err) => {
						// clearInterval(that.heartbeatInterval1)
						console.error("血压定时测量协议发送失败", err);
						uni.showToast({
							title: err.errCode + ":" + err.errMsg,
							icon: 'none'
						})
					}
				});
			},
			sendLargeData2() {
				let that = this
				const timeSyncData = that.createTimeSyncData2(); // 构造时间同步数据
				console.log(timeSyncData.toLowerCase())
				const buffer = that.toArrayBuffer(timeSyncData.toLowerCase()); // 转换为 ArrayBuffer
				console.log(buffer)
				uni.writeBLECharacteristicValue({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					characteristicId: that.characteristicId,
					value: buffer,
					success: () => {
						console.log("关闭血压定时测量协议发送成功");
						uni.showToast({
							title: that.$t("关闭成功"),
							icon: 'none'
						})
					},
					fail: (err) => {
						// clearInterval(that.heartbeatInterval1)
						console.error("关闭血压定时测量协议发送失败", err);
						uni.showToast({
							title: err.errCode + ":" + err.errMsg,
							icon: 'none'
						})
					}
				});
			},

			//手表定时测量命令
			createTimeSyncData(starttimes1, starttimes2, endtimes1, endtimes2, jiangetime) {
				let that = this
				const header = "4259"; // 协议头
				const length = "01"; // 数据长度
				const totalPackets = "0001"; // 总包数
				const currentPacket = "000118"; // 当前分包序号
				const flag = "42"; // 标志
				const timesize = "01"; // 01代表一个时间段，02代表两个时间段
				const week1 = "01" //总开关
				const week2 = "7f" //每周
				const time1 = that.decimalToHex(starttimes1, 2) //第一个时间段
				const time11 = that.decimalToHex(starttimes2, 2) //第一个时间段
				const time111 = that.decimalToHex(endtimes1, 2) //第一个时间段
				const time1111 = that.decimalToHex(endtimes2, 2) //第一个时间段
				const time11111 = that.decimalToHex(jiangetime, 2) //第一个时间段
				// const center = "00"
				// const week2 = "01" //周一
				// const time2 = that.decimalToHex(14, 2) //第二个时间段
				// const time22 = that.decimalToHex(0, 2) //第二个时间段
				// const time222 = that.decimalToHex(22, 2) //第二个时间段
				// const time2222 = that.decimalToHex(0, 2) //第二个时间段
				// const time22222 = that.decimalToHex(1, 2) //第二个时间段
				const rawData =
					`${header}${length}${totalPackets}${currentPacket}${flag}${timesize}${week1}${week2}${time1}${time11}${time111}${time1111}${time11111}`;
				// const checksum = that.calculateChecksum(rawData); // 计算和校验
				const checksum = "0f"; // 计算和校验
				const finalData = `${rawData}${checksum}`; // 添加和校验
				return finalData;
			},
			createTimeSyncData2() {
				let that = this
				const header = "4259"; // 协议头
				const length = "01"; // 数据长度
				const totalPackets = "0001"; // 总包数
				const currentPacket = "000118"; // 当前分包序号
				const flag = "42"; // 标志
				const timesize = "01"; // 01代表一个时间段，02代表两个时间段
				const week1 = "00" //总开关
				const week2 = "7f" //每周
				const time1 = that.decimalToHex(0, 2) //第一个时间段
				const time11 = that.decimalToHex(0, 2) //第一个时间段
				const time111 = that.decimalToHex(23, 2) //第一个时间段
				const time1111 = that.decimalToHex(59, 2) //第一个时间段
				const time11111 = that.decimalToHex(0, 2) //第一个时间段
				const rawData =
					`${header}${length}${totalPackets}${currentPacket}${flag}${timesize}${week1}${week2}${time1}${time11}${time111}${time1111}${time11111}`;
				const checksum = "0f"; // 计算和校验
				const finalData = `${rawData}${checksum}`; // 添加和校验
				return finalData;
			},

			decimalToHex(decimal, length = 2) {
				// 转换为十六进制字符串
				const hex = decimal.toString(16).toUpperCase();
				// 使用 padStart 补齐零，确保固定长度
				return hex.padStart(length, '0');
			},
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},

		}
	}
</script>

<style>
	.bt_BG {
		width: auto;
		height: 54px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		margin-left: 20px;
		margin-right: 20px;
		margin-top: 20px;
		background: white;
		border-radius: 50px;
	}

	.text {
		width: 40vw;
		font-size: 16px;
		margin-left: 20px;
		font-weight: 400;
	}

	.buttonstyle {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-top: 40px;
		margin-left: 20px;
		margin-right: 20px;
		background: #3298F7;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
	}

	.buttonstyle_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-top: 40px;
		margin-left: 20px;
		margin-right: 20px;
		background: red;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
	}
</style>