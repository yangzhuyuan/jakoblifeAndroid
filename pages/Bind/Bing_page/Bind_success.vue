<template>
	<view style="color: black; height: 100vh; background: #F7F7F7;">
		<view style="display: flex; justify-content: center;">
			<image class="img" src="../../../static/icons/success.png"></image>
		</view>
		<view style="margin: 40px 20px 0 20px; text-align: center; font-size: 16px; font-weight: 600;">
			{{$t('设备绑定成功')}}
		</view>
		<view v-if="modelIdtype === '体脂秤'" class="notice-text">
			{{$t('体脂秤注意事项')}}
		</view>
		<view v-else-if="modelIdtype === '血压计'" class="notice-text">
			{{$t('血压计注意事项')}}
			<button class="settings-button" @click="gotosetting">{{$t("去设置")}}</button>
		</view>
		<view class="btn">
			<button class="btn_BG" @click="btn_click">{{$t('确定')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				modelIdtype: ""
			};
		},

		onLoad(opt) {
			const modelIdMap = {
				"20000": "体脂秤",
				"20001": "体脂秤",
				"30000": "手表",
				"30001": "手表"
			};
			this.modelIdtype = modelIdMap[opt.modelId] || "血压计";
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('绑定设备')
			});
		},

		methods: {
			...mapMutations(['register_unername']),

			btn_click() {
				this.user();
			},

			gotosetting() {
				this.openBluetoothSettings();
			},

			openBluetoothSettings() {
				this.openNativeBluetoothSettings();
			},

			user() {
				this.getUserInfo();
			},

			openNativeBluetoothSettings() {
				if (plus.os.name === 'Android') {
					const main = plus.android.runtimeMainActivity();
					const Intent = plus.android.importClass("android.content.Intent");
					const Settings = plus.android.importClass("android.provider.Settings");
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

			getUserInfo() {
				uni.request({
					url: this.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					},
					success: (res) => {
						this.handleUserResponse(res);
					},
					fail: (err) => {
						this.handleRequestFailure(err);
					}
				});
			},

			handleUserResponse(res) {
				if (res.data.code === 200) {
					this.handleUserSuccess(res.data.data);
				} else {
					this.handleUserFailure(res.data.msg);
				}
			},

			handleUserSuccess(data) {
				if (!data.weight) {
					this.register_unername(data.nickName);
					uni.reLaunch({
						url: '../../login/Register_success2'
					});
				} else {
					uni.switchTab({
						url: '../../tabBar/main/Main'
					});
				}
			},

			handleUserFailure(msg) {
				uni.showToast({
					title: msg,
					icon: 'none'
				});
			},

			handleRequestFailure(err) {
				console.log(err);
			}
		}
	};
</script>

<style>
	.img {
		margin-top: 138px;
		width: 68px;
		height: 68px;
	}

	.notice-text {
		color: black;
		margin: 10px 20px 0 20px;
		font-size: 14px;
		font-weight: 600;
	}

	.settings-button {
		margin: 40px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
	}

	.btn {
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.btn_BG {
		width: auto;
		margin: 20px 20px 48px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
	}
</style>