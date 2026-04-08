<template>
	<view style="padding-top: 20px;padding-bottom: 80px;">
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

		<view class="context_btn2">
			<view class="context_title1">{{$t('定时测量')}}</view>
			<switch :checked="switchHER" @change="switch1ChangeHER" color="#4CD964" />
		</view>
		<button class="buttonstyle" @click="clickset()">{{$t("保存")}}</button>
		<view style="margin: 20px;color: red;">{{$t("注意如果选择每5分钟测一次")}}</view>
		<!-- <view class="context_btn2">
			<view class="context_title1">{{$t('抬手亮屏')}}</view>
			<switch @change="switch1Change" style="transform:scale(0.8);" :checked="switchRaise" color="#3298F7" />
		</view>
		<view class="context_btn2">
			<view class="context_title1">{{$t('时间制')}}</view>
			<view
				style="width: 40vw; display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
				<view class="select_bg" :style="getStatusColor(setwatchtime)" @click="select_click()">
					{{setwatchtime}}
				</view>
				<uni-icons type="bottom" size="20" style="margin-right: 20px;" @click="select_click()"></uni-icons>
			</view>
		</view>
		<view class="context_btn2">
			<view class="context_title1">{{$t('语言设置')}}</view>
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="Languagesindex" :range="array">
							<view class="uni-input">{{array[Languagesindex]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view> -->
		<!-- <button class="buttonstyle" @click="hypoxia()">低缺氧警报阈值</button> -->
		<!-- <button class="buttonstyle" @click="startheart(1)">启动心率测量</button> -->
		<!-- 	<button class="buttonstyle" @click="startheart(3)">启动血压测量</button>
		<button class="buttonstyle" @click="startheart(2)">启动血氧测量</button> -->
		<!-- 定时心率测量按钮 -->
		<!-- <button class="buttonstyle" @click="heartbtn(1)">{{$t("定时测量")}}</button> -->
		<!-- <button class="buttonstyle" @click="heartbtn(2)">定时血氧测量</button> -->
		<!-- 	<button class="buttonstyle_1" @click="aaaaaaa1(1)">关闭心率定时测量</button>
		<button class="buttonstyle_1" @click="aaaaaaa1(2)">关闭血氧定时测量</button> -->
		<view style="width: 100vw;">
			<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="select_text" @click="Time_system(12)">{{$t('小时12')}}</view>
					<view style="border-top: 1px solid gainsboro;"></view>
					<view class="select_text" @click="Time_system(24)">{{$t('小时24')}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				array: [this.$t("中文"), this.$t("英文")],
				Languagesindex: uni.getStorageSync("Languagesindex") !== "" ? uni.getStorageSync("Languagesindex") : 0,
				setwatchtime: uni.getStorageSync("setwatchtime") !== "" ? uni.getStorageSync("setwatchtime") : this.$t(
					'请选择'),
				switchRaise: uni.getStorageSync("switchRaise") || false,
				switchHER: uni.getStorageSync("switchHER") || false,
				time1: uni.getStorageSync("starttime") !== '' ? uni.getStorageSync("starttime") : this.getCurrentTime(),
				time2: uni.getStorageSync("endtime") !== '' ? uni.getStorageSync("endtime") : this
					.getCurrentTimePlusHour(),
				array1: [this.$t('分钟5'), this.$t('分钟60'), this.$t('分钟120'), this.$t('分钟240')],
				index1: uni.getStorageSync("Interval_time") !== "" ? uni.getStorageSync("Interval_time") : 0,
				deviceId: uni.getStorageSync("landeviceId"),
				serviceId: uni.getStorageSync("lanserviceId"),
				characteristicId: uni.getStorageSync("landcharacteristicId"),
			}
		},

		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('定时测量')
			})
		},
		methods: {

			// 获取当前时间（格式：HH:mm）
			getCurrentTime() {
				const now = new Date()
				const hours = now.getHours().toString().padStart(2, '0')
				const minutes = now.getMinutes().toString().padStart(2, '0')
				return `${hours}:${minutes}`
			},

			// 获取当前时间加60分钟
			getCurrentTimePlusHour() {
				const now = new Date()
				// 加60分钟
				now.setMinutes(now.getMinutes() + 60)
				const hours = now.getHours().toString().padStart(2, '0')
				const minutes = now.getMinutes().toString().padStart(2, '0')
				return `${hours}:${minutes}`
			},


			//语言设置
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Languagesindex = e.detail.value
				uni.setStorageSync("Languagesindex", this
					.Languagesindex)
				console.log(this.Languagesindex)
				this.Languagesetting(this.Languagesindex)
			},
			Languagesetting(Languagtype) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								const ackConfigByteset = new Uint8Array(9);
								ackConfigByteset[0] = 0xE0;
								ackConfigByteset[1] = 0x00;
								ackConfigByteset[2] = 0x06;
								ackConfigByteset[3] = 0x02;
								ackConfigByteset[4] = 0x01;
								ackConfigByteset[5] = 0x01;
								ackConfigByteset[6] = 0x00;
								ackConfigByteset[7] = 0x01;
								ackConfigByteset[8] = Languagtype === 0 ? 0x01 : 0x00; //0x00 小时12,0x01 小时24
								let ackConfigBytesum2 = 0;
								for (let i = 0; i < ackConfigByteset
									.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
									ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
								}
								ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
								// 创建新的数组，将校验和插入到第四个字节中
								const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
									1); // 第四个字节的插入，数组长度加1
								modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
								modifiedCommand2[3] = ackConfigBytesum2;
								modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
								const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
									.toString(16).padStart(2, '0')).join('');
								const buffer2 = that.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
								console.log(hexCommand2)
								console.log(that.deviceId)
								console.log(that.serviceId)
								console.log(item.uuid)
								setTimeout(() => {
									uni.writeBLECharacteristicValue({
										deviceId: that.deviceId,
										serviceId: that.serviceId,
										characteristicId: item.uuid,
										writeType: 'writeNoResponse',
										value: buffer2,
										success(res) {
											uni.showToast({
												title: "语言设置成功",
												icon: 'none'
											})
											console.log("hhhhh", hexCommand2)
											if (Languagtype === 0) {
												that.Languagesindex = 0
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											} else {
												that.Languagesindex = 1
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											}
										},
										fail(err) {
											console.error("2语言：", err)
										},
									})
								}, 3000)
							}
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
			select_click() {
				this.$refs.popup.open("center")

			},
			Time_system(TIME_TYPE) {
				this.$refs.popup.close()
				if (TIME_TYPE === 12) {
					this.setwatchtime = this.$t("小时12")
					uni.setStorageSync("setwatchtime", this
						.setwatchtime)
				} else {
					this.setwatchtime = this.$t("小时24")
					uni.setStorageSync("setwatchtime", this
						.setwatchtime)
				}
				this.timestr(TIME_TYPE)
			},
			//设置时间制
			timestr(TIME_TYPE) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								const ackConfigByteset = new Uint8Array(9);
								ackConfigByteset[0] = 0xE0;
								ackConfigByteset[1] = 0x00;
								ackConfigByteset[2] = 0x06;
								ackConfigByteset[3] = 0x02;
								ackConfigByteset[4] = 0x01;
								ackConfigByteset[5] = 0x0D;
								ackConfigByteset[6] = 0x00;
								ackConfigByteset[7] = 0x01;
								ackConfigByteset[8] = TIME_TYPE === 12 ? 0x00 : 0x01; //0x00 小时12,0x01 小时24
								let ackConfigBytesum2 = 0;
								for (let i = 0; i < ackConfigByteset
									.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
									ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
								}
								ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
								// 创建新的数组，将校验和插入到第四个字节中
								const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
									1); // 第四个字节的插入，数组长度加1
								modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
								modifiedCommand2[3] = ackConfigBytesum2;
								modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
								const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
									.toString(16).padStart(2, '0')).join('');
								const buffer2 = that.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
								console.log(hexCommand2)
								console.log(that.deviceId)
								console.log(that.serviceId)
								console.log(item.uuid)
								setTimeout(() => {
									uni.writeBLECharacteristicValue({
										deviceId: that.deviceId,
										serviceId: that.serviceId,
										characteristicId: item.uuid,
										writeType: 'writeNoResponse',
										value: buffer2,
										success(res) {
											uni.showToast({
												title: "时间制设置成功",
												icon: 'none'
											})
											console.log("hhhhh", hexCommand2)
											if (TIME_TYPE === 12) {
												that.setwatchtime = that.$t("小时12")
												uni.setStorageSync("setwatchtime", that
													.setwatchtime)
											} else {
												that.setwatchtime = that.$t("小时24")
												uni.setStorageSync("setwatchtime", that
													.setwatchtime)
											}
										},
										fail(err) {
											console.error("2时间制：", err)
										},
									})
								}, 3000)
							}
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

			startheart(type) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								that.sendstartheartwatch(item.uuid, type)
							}
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


			switch1ChangeHER(e) {
				let that = this
				that.switchHER = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					console.log("1that.switchHER", that.switchHER)
					// 关键点：添加下一行确保视图更新
					that.aaaaaaa1(1)
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					console.log("2that.switchHER", that.switchHER)
					that.heartbtn(1)
				}
			},

			clickset() {
				let that = this
				console.log("clickset", that.switchHER)
				if (that.switchHER === true) {
					that.getBLEDeviceCharacteristics2(1)
				} else {
					uni.getBLEDeviceCharacteristics({
						deviceId: that.deviceId,
						serviceId: that.serviceId,
						success: (res) => {
							for (let i = 0; res.characteristics.length > i; i++) {
								let item = res.characteristics[i]
								if (item.properties.write) {
									uni.showLoading({
										title: that.$t("设置中"),
										mask: true
									})
									that.sendwatch2(item.uuid, 1)
								}
							}
						},
						fail(res) {
							uni.showToast({
								title: that.$t("连接中稍后再试"),
								icon: 'none',
								duration: 1500
							})
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabBar/main/Main'
								})
							}, 1000)
						}
					})
				}
			},


			switch1Change(e) {
				let that = this
				that.switchRaise = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					console.log("1that.switchRaise", that.switchRaise)
					// 关键点：添加下一行确保视图更新
					that.Raise_your_hand(0)
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					console.log("2that.switchRaise", that.switchRaise)
					that.Raise_your_hand(1)
				}
			},
			//抬头显示
			Raise_your_hand(typesd) {
				uni.getBLEDeviceCharacteristics({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								const ackConfigByteset = new Uint8Array(9);
								ackConfigByteset[0] = 0xE0;
								ackConfigByteset[1] = 0x00;
								ackConfigByteset[2] = 0x06;
								ackConfigByteset[3] = 0x02;
								ackConfigByteset[4] = 0x01;
								ackConfigByteset[5] = 0x00;
								ackConfigByteset[6] = 0x00;
								ackConfigByteset[7] = 0x01;
								ackConfigByteset[8] = typesd === 0 ? 0x00 : 0x01; //0x00关闭,0x01是开启
								let ackConfigBytesum2 = 0;
								for (let i = 0; i < ackConfigByteset
									.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
									ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
								}
								ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
								// 创建新的数组，将校验和插入到第四个字节中
								const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
									1); // 第四个字节的插入，数组长度加1
								modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
								modifiedCommand2[3] = ackConfigBytesum2;
								modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
								const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
									.toString(16).padStart(2, '0')).join('');
								const buffer2 = this.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
								console.log(hexCommand2)
								console.log(this.deviceId)
								console.log(this.serviceId)
								console.log(item.uuid)
								setTimeout(() => {
									uni.writeBLECharacteristicValue({
										deviceId: this.deviceId,
										serviceId: this.serviceId,
										characteristicId: item.uuid,
										writeType: 'writeNoResponse',
										value: buffer2,
										success(res) {
											uni.showToast({
												title: "设置成功",
												icon: 'none'
											})
											if (typesd === 0) {
												this.switchRaise = false
												uni.setStorageSync("switchRaise", false)
											} else {
												this.switchRaise = true
												uni.setStorageSync("switchRaise", true)
											}

											console.log("1抬头：" + hexCommand2, res)
										},
										fail(err) {
											this.switchRaise = false
											uni.setStorageSync("switchRaise", false)
											console.error("2抬头：", err)
										},
									})
								}, 3000)
							}
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

			hypoxia() {
				uni.getBLEDeviceCharacteristics({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								const ackConfigByteset = new Uint8Array(10);
								ackConfigByteset[0] = 0xE0;
								ackConfigByteset[1] = 0x00;
								ackConfigByteset[2] = 0x07;
								ackConfigByteset[3] = 0x03;
								ackConfigByteset[4] = 0x01;
								ackConfigByteset[5] = 0x0D;
								ackConfigByteset[6] = 0x00;
								ackConfigByteset[7] = 0x01;
								ackConfigByteset[8] = 0x01; //0x00关闭,0x01是开启
								ackConfigByteset[9] = 0x63; //0x00关闭,0x01是开启
								let ackConfigBytesum2 = 0;
								for (let i = 0; i < ackConfigByteset
									.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
									ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
								}
								ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
								// 创建新的数组，将校验和插入到第四个字节中
								const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
									1); // 第四个字节的插入，数组长度加1
								modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
								modifiedCommand2[3] = ackConfigBytesum2;
								modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
								const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
									.toString(16).padStart(2, '0')).join('');
								const buffer2 = this.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
								console.log(hexCommand2)
								console.log(this.deviceId)
								console.log(this.serviceId)
								console.log(item.uuid)
								setTimeout(() => {
									uni.writeBLECharacteristicValue({
										deviceId: this.deviceId,
										serviceId: this.serviceId,
										characteristicId: item.uuid,
										writeType: 'writeNoResponse',
										value: buffer2,
										success(res) {
											uni.showToast({
												title: "低氧设置成功",
												icon: 'none'
											})
											console.log("1低氧：" + hexCommand2, res)
										},
										fail(err) {
											console.error("2低氧：", err)
										},
									})
								}, 3000)
							}
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


			heartbtn(type) {
				let that = this
				if (that.time1 === that.$t('请选择')) {
					uni.showToast({
						title: that.$t('开始时间'),
						icon: 'none'
					})
					return
				} else if (that.time2 === that.$t('请选择')) {
					uni.showToast({
						title: that.$t('结束时间'),
						icon: 'none'
					})
					return
				}
				that.getBLEDeviceCharacteristics1(type)
			},

			aaaaaaa1(type) {
				let that = this
				if (that.time1 === that.$t('请选择')) {
					uni.showToast({
						title: that.$t('开始时间'),
						icon: 'none'
					})
					return
				} else if (that.time2 === that.$t('请选择')) {
					uni.showToast({
						title: that.$t('结束时间'),
						icon: 'none'
					})
					return
				}
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								uni.showLoading({
									title: that.$t("设置中"),
									mask: true
								})
								that.sendwatch2(item.uuid, type)
							}
						}
					},
					fail(res) {
						uni.showToast({
							title: that.$t("连接中稍后再试"),
							icon: 'none',
							duration: 1500
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/main/Main'
							})
						}, 1000)
						setTimeout(() => {
							that.$forceUpdate()
							that.switchHER = true
							uni.setStorageSync("switchHER", true)
							that.$nextTick(() => that.$forceUpdate())
						}, 300)
					}
				})
			},



			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics1(type) {
				let that = this
				uni.showLoading({
					title: that.$t("设置中"),
					mask: true
				})
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								that.sendwatch(item.uuid, type)
							}
						}
					},
					fail(res) {
						uni.hideLoading()
						uni.showToast({
							title: that.$t("连接中稍后再试"),
							icon: 'none',
							duration: 1500
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/main/Main'
							})
						}, 1000)
						setTimeout(() => {
							that.$forceUpdate()
							that.switchHER = false
							uni.setStorageSync("switchHER", false)
							that.$nextTick(() => that.$forceUpdate())
						}, 300)
					}
				})
			},


			getBLEDeviceCharacteristics2(type) {
				let that = this
				uni.showLoading({
					title: that.$t("设置中"),
					mask: true
				})
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								that.sendwatch(item.uuid, type)
							}
						}
					},
					fail(res) {
						uni.hideLoading()
						uni.showToast({
							title: that.$t("连接中稍后再试"),
							icon: 'none',
							duration: 1500
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/main/Main'
							})
						}, 1000)
					}
				})
			},



			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			//血压实时测量命令：e0 00 06 F4 06 01 05 00 01 01
			sendstartheartwatch(writeuuid, type) {
				let buffer2
				if (type === 1) {
					buffer2 = this.toArrayBuffer("e00006F3060104000101") //心率
				} else if (type === 2) {
					buffer2 = this.toArrayBuffer("e00006F5060106000101") //血氧
				} else {
					buffer2 = this.toArrayBuffer("e00006F4060105000101") //血压
				}
				console.log(this.deviceId)
				console.log(this.serviceId)
				console.log(writeuuid)
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: this.deviceId,
						serviceId: this.serviceId,
						characteristicId: writeuuid,
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							if (type === 1 || type === 2) {
								console.log("1开始心率/血氧测量：" + (type === 1 ? "e00006F3060104000101" :
									"e00006F5060106000101"), res)
							} else {
								console.log("1开始血压测量：" + "e00006F4060105000101", res)
							}

							uni.showToast({
								title: type === 1 ? "心率命令发送成功" : "血氧命令发送成功",
								icon: 'none'
							})
						},
						fail(err) {
							console.error("2开始心率/血氧测量：", err)
						},
					})
				}, 3000)
			},

			sendwatch(writeuuid, type) {
				let that = this
				let jiangetime = 5
				if (that.index1 === 0) {
					jiangetime = 5
				} else if (that.index1 === 1) {
					jiangetime = 60
				} else if (that.index1 === 2) {
					jiangetime = 120
				} else if (that.index1 === 3) {
					jiangetime = 240
				}
				const ackConfigByteset = new Uint8Array(16);
				ackConfigByteset[0] = 0xE0;
				ackConfigByteset[1] = 0x00;
				ackConfigByteset[2] = 0x0d;
				ackConfigByteset[3] = 0x02;
				ackConfigByteset[4] = 0x01;
				ackConfigByteset[5] = type === 1 ? 0x0B : 0x1D; //0B是心率，1D血氧
				ackConfigByteset[6] = 0x00;
				ackConfigByteset[7] = 0x08;
				ackConfigByteset[8] = 0x01;
				ackConfigByteset[9] = 0x00;
				ackConfigByteset[10] = `${'0x'}${that.decimalToHex(jiangetime, 4).slice(0,2)}`;
				ackConfigByteset[11] = `${'0x'}${that.decimalToHex(jiangetime, 4).slice(2,4)}`;
				ackConfigByteset[12] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time1), 4).slice(0,2)}`;
				ackConfigByteset[13] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time1), 4).slice(2,4)}`;
				ackConfigByteset[14] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time2), 4).slice(0,2)}`;
				ackConfigByteset[15] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time2), 4).slice(2,4)}`;
				let ackConfigBytesum2 = 0;
				for (let i = 0; i < ackConfigByteset
					.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
					ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
				}
				ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
				// 创建新的数组，将校验和插入到第四个字节中
				const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
					1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
				modifiedCommand2[3] = ackConfigBytesum2;
				modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
				const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
					.toString(16).padStart(2, '0')).join('');
				const buffer2 = that.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
				console.log(hexCommand2)
				console.log(that.deviceId)
				console.log(that.serviceId)
				console.log(writeuuid)
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: that.serviceId,
						characteristicId: writeuuid,
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							uni.hideLoading()
							if (type === 1) {
								console.log("1开始心率定时测量：" + hexCommand2, res)
							} else {
								console.log("1开始血氧定时测量：" + hexCommand2, res)
							}
							that.switchHER = true
							uni.setStorageSync("switchHER", true)
							uni.setStorageSync("sendwatch", 1)
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							})
						},
						fail(err) {
							that.switchHER = false
							uni.setStorageSync("switchHER", false)
							uni.hideLoading()
							uni.showToast({
								title: that.$t("连接中稍后再试"),
								icon: 'none',
								duration: 1500
							})
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabBar/main/Main'
								})
							}, 1000)
							console.error("开始心率/血氧定时测量：", err)
						},
					})
				}, 3000)
			},
			sendwatch2(writeuuid, type) {
				let that = this
				let jiangetime = 5
				if (that.index1 === 0) {
					jiangetime = 5
				} else if (that.index1 === 1) {
					jiangetime = 60
				} else if (that.index1 === 2) {
					jiangetime = 120
				} else if (that.index1 === 3) {
					jiangetime = 240
				}
				const ackConfigByteset = new Uint8Array(16);
				ackConfigByteset[0] = 0xE0;
				ackConfigByteset[1] = 0x00;
				ackConfigByteset[2] = 0x0d;
				ackConfigByteset[3] = 0x02;
				ackConfigByteset[4] = 0x01;
				ackConfigByteset[5] = type === 1 ? 0x0B : 0x1D; //0B是心率，1D血氧
				ackConfigByteset[6] = 0x00;
				ackConfigByteset[7] = 0x08;
				ackConfigByteset[8] = 0x00;
				ackConfigByteset[9] = 0x00;
				ackConfigByteset[10] = `${'0x'}${that.decimalToHex(jiangetime, 4).slice(0,2)}`;
				ackConfigByteset[11] = `${'0x'}${that.decimalToHex(jiangetime, 4).slice(2,4)}`;
				ackConfigByteset[12] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time1), 4).slice(0,2)}`;
				ackConfigByteset[13] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time1), 4).slice(2,4)}`;
				ackConfigByteset[14] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time2), 4).slice(0,2)}`;
				ackConfigByteset[15] = `${'0x'}${that.decimalToHex(that.timeToMinutes(that.time2), 4).slice(2,4)}`;
				let ackConfigBytesum2 = 0;
				for (let i = 0; i < ackConfigByteset
					.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
					ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
				}
				ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
				// 创建新的数组，将校验和插入到第四个字节中
				const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
					1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
				modifiedCommand2[3] = ackConfigBytesum2;
				modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
				const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
					.toString(16).padStart(2, '0')).join('');
				const buffer2 = that.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
				console.log(hexCommand2)
				console.log(that.deviceId)
				console.log(that.serviceId)
				console.log(writeuuid)
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: that.serviceId,
						characteristicId: writeuuid,
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							uni.hideLoading()
							if (type === 1) {
								console.log("关闭心率自动测量：" + hexCommand2, res)
							} else {
								console.log("关闭血氧自动测量：" + hexCommand2, res)
							}
							that.switchHER = false
							uni.setStorageSync("switchHER", false)
							uni.removeStorageSync("sendwatch")
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							})
						},
						fail(err) {
							that.switchHER = true
							uni.setStorageSync("switchHER", true)
							uni.hideLoading()
							uni.showToast({
								title: that.$t("连接中稍后再试"),
								icon: 'none',
								duration: 1500
							})
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabBar/main/Main'
								})
							}, 1000)
							console.error("关闭血氧自动测量：：", err)
						},
					})
				}, 3000)
			},
			timeToMinutes(timeStr) {
				const [hours, minutes] = timeStr.split(':');
				return parseInt(hours) * 60 + parseInt(minutes);
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
							title: that.$t("连接中稍后再试"),
							icon: 'none',
							duration: 1500
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/main/Main'
							})
						}, 1000)
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
							title: that.$t("连接中稍后再试"),
							icon: 'none',
							duration: 1500
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/main/Main'
							})
						}, 1000)
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

			decimalToHex(decimal, length = 4) {
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
	.popup_bg {
		padding: 20px;
		width: 50vw;
		margin-left: 20px;
		margin-right: 20px;
		background: white;
		border-radius: 20px;
	}

	.select_text {
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.context_btn2 {
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
		height: 56px;
		margin: 30px 20px;
		padding: 0 20px;
		border-radius: 10px;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);

	}

	.context_title1 {
		width: 90%;
		font-size: 16px;
		color: black;
	}

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