<template>
	<view style="padding: 10px 10px 108px 10px;background: #F7F7F7; color: black;height: 100vh;">
		<view style="display:flex;flex-direction: column;align-items: center;">
			<image style="width: 180px;height: 180px; " :src="loginimg"></image>
			<text style=" font-size: 16px; font-weight: bold;">{{$t('注销JakobLife账号')}}</text>
			<text
				style="margin-top: 5px; font-size: 16px; font-weight: bold;text-align: center;">{{$t('您将放弃以下资产或权益')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: left;margin-left:10px;">
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('该账号所有的数据将被清空')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('所有设备会与您当前登录的账号解除绑定')}}</text>
			<text style="margin-top: 20px; font-size: 16px; font-weight: bold;">{{$t('在手机中')}}</text>
			<text style="margin-top: 5px; font-size: 14px; ">{{$t('同时')}}</text>
		</view>
		<view style="background: gainsboro; width: 90%; height: 1px;margin: 50px 10px 10px 10px;"></view>
		<view style="display:flex;flex-direction: column;align-items: center; margin-top: 40px;">
			<checkbox style="font-size: 28rpx;" color="#ffffff" class="round" activeBorderColor="#D2D2D2"
				activeBackgroundColor="#3298F7" :checked="cb" @click="checked">{{$t('本人已阅读并同意注销协议')}}
			</checkbox>
		</view>
		<button @click="Think_again()" class="button_back">{{$t('再想想')}}</button>


		<button @click="Definitive_cancellation()" class="button_back" :style="getback(cb)">{{$t('确认注销')}}</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,
				loginimg: '',
				connectedDevices: [],
				bpwsn: '',
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('注销账号')
			})
			const lan = uni.getLocale();
			if (lan == 'zh-Hans' || lan === 'zh-Hant') {
				this.loginimg = "../../../static/icons/14.png"
			} else {
				this.loginimg = "../../../static/icons/loginssss.png"
			}
			this.queryDevices()
			if (Vue.prototype.$globalTimers.heartbeatInterval) {
				clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
				Vue.prototype.$globalTimers.heartbeatInterval = null;
			}
		},
		methods: {
			queryDevices() {
				this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				}).then(queryDevices => {
					if (queryDevices.code === 200) {
						for (let i = 0; queryDevices.rows.length > i; i++) {
							if (queryDevices.rows[i].mac !== "" || queryDevices.rows[i].mac !== null) {
								this.connectedDevices.push(queryDevices.rows[i].mac)
								if (queryDevices.rows[i].deviceModelName === "BPW1") {
									this.bpwsn = queryDevices.rows[i].mac
								}
							}
						}
					}
				})
			},

			//删除所有设备
			disconnectAllBluetoothDevices() {
				this.connectedDevices.forEach(deviceId => {
					uni.closeBLEConnection({
						deviceId: deviceId,
						success: () => {
							console.log(`已断开设备: ${deviceId}`);
						},
						fail: (err) => {
							console.error(`断开设备失败: ${deviceId}`, err);
						}
					});
				});
			},
			getback(id) {
				return {
					background: id === false ? "#DBDBDB" : "#3298F7"
				}
			},


			checked() {
				if (this.cb == true) {
					this.cb = false
				} else {
					this.cb = true
				}
			},


			Think_again() {
				uni.navigateBack();
			},
			Definitive_cancellation() {
				let that = this
				if (that.cb == false) {
					uni.showToast({
						title: that.$t("请您阅读并同意注销协议"),
						icon: "none"
					})
					return
				} else {
					uni.showModal({
						title: that.$t('注销提示'),
						content: that.$t('请确认是否注销JakobLife账号'),
						success: function(res) {
							if (res.confirm) {
								if (Vue.prototype.$globalTimers.heartbeatInterval) {
									clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
									Vue.prototype.$globalTimers.heartbeatInterval = null;
								}
								that.delete_self()
							} else if (res.cancel) {}
						}
					});
				}
			},
			//注销用户
			delete_self() {
				let that = this
				console.log("注销用户" + that.$url_APP_IP, uni.getStorageSync("token"))
				that.$post(that.$url_APP_IP + that.$url_delete_self, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					console.log("注销用户", res)
					if (res.code == 200) {
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						this.calculateChecksumsss(this.bpwsn)
						uni.clearStorageSync()
						that.disconnectAllBluetoothDevices()
						uni.closeBluetoothAdapter()
						// 清空列表
						that.connectedDevices = [];
						uni.showModal({
							title: that.$t("注销成功"),
							content: that.$t("确认移除此设备注销"),
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									that.openBluetoothSettings();
								}
							}
						});
						setTimeout(function() {
							uni.reLaunch({
								url: "/pages/login/login_land"
							})
						}, 1000)
					}
				})
			},
			openBluetoothSettings() {
				if (plus.os.name === 'Android') {
					const main = plus.android.runtimeMainActivity();
					const Intent = plus.android.importClass('android.content.Intent');
					const Settings = plus.android.importClass('android.provider.Settings');
					const intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
					main.startActivity(intent);
				} else {
					plus.runtime.launchApplication({
						action: 'APP-Prefs:root=BLE'
					}, (e) => {
						console.log(e);
					});
				}
			},
			calculateChecksumsss(mac) {
				const bindcommand = new Uint8Array(9);
				bindcommand[0] = 0xE0;
				bindcommand[1] = 0x00;
				bindcommand[2] = 0x06;
				bindcommand[3] = 0x08;
				bindcommand[4] = 0x01;
				bindcommand[5] = 0x01;
				bindcommand[6] = 0x00;
				bindcommand[7] = 0x01;
				bindcommand[8] = 0x01;
				const bindhexCommand = Array.from(bindcommand).map(byte => byte.toString(16).padStart(2, '0')).join(
					'');
				const bindbytesnew = new Uint8Array(bindhexCommand.match(/../g).map(byte => parseInt(byte, 16)));
				const bindformattedBytes = Array.from(bindbytesnew).map(byte =>
					`0x${byte.toString(16).padStart(2, '0')}`);
				const bindbytes333 = bindformattedBytes.map(byte => parseInt(byte, 16));
				let bindsum = 0;
				for (let i = 0; i < bindbytes333.length; i++) {
					bindsum += bindbytes333[i];
				}
				bindsum = bindsum % 256;
				const bindmodifiedCommand = new Uint8Array(bindcommand.length + 1); // 第四个字节的插入，数组长度加1
				bindmodifiedCommand.set(bindcommand.subarray(0, 3), 0);
				bindmodifiedCommand[3] = bindsum;
				bindmodifiedCommand.set(bindcommand.subarray(3), 4);
				const bindhexCommand2 = Array.from(bindmodifiedCommand).map(byte => byte.toString(16).padStart(2, '0'))
					.join('');
				const bindbuffer = this.toArrayBuffer(bindhexCommand2); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: mac,
					serviceId: "81EEA001-E735-49EC-8A11-7E32CAE1E14E",
					characteristicId: "81EEA003-E735-49EC-8A11-7E32CAE1E14E",
					value: bindbuffer,
					success(res) {
						console.log("0解绑设备：", res)
					},
					fail(err) {
						console.log("1解绑设备：", err)
					}
				})
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
	.button_back {
		margin: 30px 20px 20px 20px;
		background: #3298F7;
		color: white;
		border-radius: 40px;
	}
</style>