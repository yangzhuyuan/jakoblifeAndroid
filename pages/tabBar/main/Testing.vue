<template>
	<view style="padding-top: 20px;padding-bottom: 80px;">
		<view class="context_btn2">
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
			<view class="context_title1" style="flex: 1;">{{$t('语言设置')}}</view>
			<view style="flex: 2;display: flex;justify-content: flex-end; flex-direction: row;align-items: center;">
				<view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="Languagesindex" :range="array">
							<view class="uni-input">{{array[Languagesindex]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
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
				array: [this.$t("中文"), this.$t("英文"), this.$t("西班牙语"), this.$t("日语"), this.$t("韩语"), this.$t("阿拉伯语")],
				Languagesindex: uni.getStorageSync("Languagesindex") !== "" ? uni.getStorageSync("Languagesindex") : 0,
				setwatchtime: uni.getStorageSync("setwatchtime") !== "" ? uni.getStorageSync("setwatchtime") : this.$t(
					'请选择'),
				switchRaise: uni.getStorageSync("switchRaise") || false,
				deviceId: uni.getStorageSync("landeviceId"),
				serviceId: uni.getStorageSync("lanserviceId"),
				characteristicId: uni.getStorageSync("landcharacteristicId"),
			}
		},

		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('手表设置')
			})
		},
		methods: {

			select_click() {
				this.$refs.popup.open("center")
			},
			//时间按钮
			Time_system(TIME_TYPE) {
				this.$refs.popup.close()
				if (TIME_TYPE === 12) {
					this.setwatchtime = this.$t("小时12")
				} else {
					this.setwatchtime = this.$t("小时24")
				}
				this.timestr(TIME_TYPE)
			},
			//设置时间制
			timestr(TIME_TYPE) {
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
											uni.hideLoading()
											uni.showToast({
												title: that.$t("成功"),
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
											uni.hideLoading()
											uni.showToast({
												title: that.$t("失败"),
												icon: 'none'
											})
											console.error("2时间制：", err)
										},
									})
								}, 3000)
							}
						}
					},
					fail(res) {
						that.setwatchtime = uni.getStorageSync("setwatchtime")
						uni.hideLoading()
						uni.showToast({
							title: that.$t("请检查设备连接"),
							icon: 'none'
						})
					}
				})
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
			//抬头显示switch按钮
			switch1Change(e) {
				let that = this
				that.switchRaise = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					// 关键点：添加下一行确保视图更新
					that.Raise_your_hand(0)
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					that.Raise_your_hand(1)
				}
			},
			//抬头显示
			Raise_your_hand(typesd) {
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
											uni.hideLoading()
											uni.showToast({
												title: that.$t("成功"),
												icon: 'none'
											})
											if (typesd === 0) {
												that.switchRaise = false
												uni.setStorageSync("switchRaise", false)
											} else {
												that.switchRaise = true
												uni.setStorageSync("switchRaise", true)
											}
										},
										fail(err) {
											uni.hideLoading()
											uni.showToast({
												title: that.$t("失败"),
												icon: 'none'
											})
											that.switchRaise = false
											uni.setStorageSync("switchRaise", false)
										},
									})
								}, 3000)
							}
						}
					},
					fail(res) {
						that.switchRaise = uni.getStorageSync("switchRaise")
						uni.hideLoading()
						uni.showToast({
							title: that.$t("请检查设备连接"),
							icon: 'none'
						})
					}
				})
			},
			//语言设置
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Languagesindex = e.detail.value
				console.log(this.Languagesindex)
				let Languagtype = 0
				if (this.Languagesindex === 0) {
					Languagtype = 0x01 //中文
				} else if (this.Languagesindex === 1) {
					Languagtype = 0x00 //英语
				} else if (this.Languagesindex === 2) {
					Languagtype = 0x04 //西班牙语
				} else if (this.Languagesindex === 3) {
					Languagtype = 0x19 //日语
				} else if (this.Languagesindex === 4) {
					Languagtype = 0x18 //韩语
				} else if (this.Languagesindex === 5) {
					Languagtype = 0x10 //阿拉伯语
				}
				this.Languagesetting(Languagtype, this.Languagesindex)
			},
			Languagesetting(Languagtype, Languagesindex) {
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
								const ackConfigByteset = new Uint8Array(9);
								ackConfigByteset[0] = 0xE0;
								ackConfigByteset[1] = 0x00;
								ackConfigByteset[2] = 0x06;
								ackConfigByteset[3] = 0x02;
								ackConfigByteset[4] = 0x01;
								ackConfigByteset[5] = 0x01;
								ackConfigByteset[6] = 0x00;
								ackConfigByteset[7] = 0x01;
								ackConfigByteset[8] = Languagtype; //0x00 小时12,0x01 小时24
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
											uni.hideLoading()
											uni.showToast({
												title: that.$t("成功"),
												icon: 'none'
											})
											console.log("hhhhh", hexCommand2)
											if (Languagesindex === 0) {
												that.Languagesindex = 0
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											} else if (Languagesindex === 1) {
												that.Languagesindex = 1
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											} else if (Languagesindex === 2) {
												that.Languagesindex = 2
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											} else if (Languagesindex === 3) {
												that.Languagesindex = 3
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											} else if (Languagesindex === 4) {
												that.Languagesindex = 4
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											} else if (Languagesindex === 5) {
												that.Languagesindex = 5
												uni.setStorageSync("Languagesindex", that
													.Languagesindex)
											}
										},
										fail(err) {
											uni.hideLoading()
											uni.showToast({
												title: that.$t("失败"),
												icon: 'none'
											})
											console.error("2语言：", err)
										},
									})
								}, 3000)
							}
						}
					},
					fail(res) {
						that.Languagesindex = uni.getStorageSync("Languagesindex")
						uni.hideLoading()
						uni.showToast({
							title: that.$t("请检查设备连接"),
							icon: 'none'
						})
					}
				})
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