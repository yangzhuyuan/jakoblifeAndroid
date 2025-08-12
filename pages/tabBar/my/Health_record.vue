<template>
	<view class="health_page">
		<view class="health_avatr">
			<view class="context_btn" @click="btn_avatar()">
				<view class="context_title">{{$t('头像')}}</view>
				<view style="width: 35vw; display: flex;justify-content: flex-end;">
					<image :src="avatar"
						style="border: 1px solid gainsboro; width: 30px; height: 30px;border-radius: 20px;">
					</image>
				</view>
				<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
			</view>
			<!-- <view style="width: 80vw; height: 1px; background: gainsboro; margin-left:25px;"></view> -->
			<!-- <view class="context_btn" @click="member()">
				<view class="context_title">{{$t('会员名')}}</view>
				<view style="width: 35vw; display: flex;justify-content: flex-end;">{{username}}</view>
				<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
			</view> -->
		</view>

		<view style="margin: 20px 0 20px 15px; color: black;">{{$t('身体基础信息')}}：</view>

		<view class="health_avatr">
			<view class="bt_BG">
				<view class="text">{{$t('性别')}}</view>
				<view
					style="width: 40vw; justify-content: flex-end; display: flex;flex-direction: row;align-items: center;">
					<view class="color_bg" :style="getcolor(select)" @click="select_click()">
						{{select}}
					</view>
					<uni-icons type="forward" size="20" style="margin-left: 5px;" @click="select_click()"></uni-icons>
				</view>
			</view>
			<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
			<view class="bt_BG">
				<view class="text">{{$t('出生日期')}}</view>
				<view style="width: 40vw; justify-content: flex-end; display: flex;flex-direction: row;">
					<picker fields="day" mode="date" :value="date" @change="bindDateChange">
						<view style="display: flex;flex-direction: row;align-items: center;">
							<view class="color_bg_1" :style="getcolor(date)">{{date}}</view>
							<uni-icons type="forward" size="20" style="margin-left: 10px;"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
			<view class="bt_BG">
				<view class="text">{{$t('身高')}}</view>
				<view style="justify-content: flex-end; display: flex;flex-direction: row; align-items: center;">
					<input type="number" :placeholder="$t('请输入')" v-model="height"
						style="color: black; text-align: right; font-size: 14px;" maxlength="5" />
					<view style="margin-right: 10px;width: 80px;">
						<picker @change="bindPickerChange_Height" :value="Height_index" :range="Height_array">
							<view class="uni-input" style="text-align: right;">{{Height_array[Height_index]}}</view>
						</picker>
					</view>
				</view>
			</view>
			<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
			<view class="bt_BG">
				<view class="text">{{$t('体重')}}</view>
				<view style="justify-content: flex-end;display: flex;flex-direction: row;align-items: center;">
					<input type="number" :placeholder="$t('请输入')" v-model="width"
						style="color: black; text-align: right; font-size: 14px;" maxlength="5" />
					<view style="margin-right: 10px;width: 80px;">
						<picker @change="bindPickerChange_Width" :value="Width_index" :range="Width_array">
							<view class="uni-input" style="text-align: right;background: none;">
								{{Width_array[Width_index]}}
							</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="true">
				<view class="popup_bg">
					<view class="select_text" @click="sex_nan()">{{$t('男')}}</view>
					<view style="border-top: 1px solid gainsboro;"></view>
					<view class="select_text" @click="sex_nv()">{{$t('女')}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: "../../../static/icons/40x40.png",
				username: this.$t('未登录'),
				select: this.$t('请选择'),
				height: '',
				width: '',
				date: this.$t('请选择'),
				phone: '',
				Height_array: ["inch", 'cm'],
				Height_index: uni.getStorageSync("danwei1") !== "" ? uni.getStorageSync("danwei1") : 0,
				Width_array: ["kg", "lb"],
				Width_index: uni.getStorageSync("danwei2") !== "" ? uni.getStorageSync("danwei2") : 0,
			}
		},

		onBackPress(options) {
			if (options.from === 'backbutton') {
				this.update_info()
			}
		},




		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('健康档案')
			})

			//头像返回的数据
			uni.$once('uploadFileRes', function(data) {
				console.log(data)
				that.avatar = data
			})

			uni.request({
				url: that.$url_getInfo,
				method: 'GET',
				header: {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				},
				success: function(res) {
					if (res.statusCode == 200) {
						if (res.data.code == 200) {
							if (res.data.data.avatar === "" || res.data.data.avatar === undefined) {
								that.avatar = "../../../static/icons/40x40.png"
							} else {
								that.avatar = res.data.data.avatar
							}
							that.username = res.data.data.nickName === null ? res.data.data.userName : res.data
								.data.nickName
							that.select = res.data.data.sex === '0' ? that.$t('男') : that.$t('女')
							that.date = res.data.data.birthTime
							that.height = res.data.data.height
							that.width = res.data.data.weight
							that.phone = res.data.data.phonenumber
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					} else {
						console.log("获取数据错误")
					}
				},
				fail(err) {
					console.log(err)
				}
			})

		},

		methods: {

			bindPickerChange_Height: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Height_index = e.detail.value
			},
			bindPickerChange_Width: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Width_index = e.detail.value
			},

			//更新个人信息
			update_info() {
				let that = this
				uni.request({
					url: that.$url_update_info,
					method: 'POST',
					data: {
						nickName: that.username,
						sex: that.select === that.$t('男') ? "0" : "1",
						birthTime: that.date,
						height: that.height,
						weight: that.width
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},

					success(res) {
						console.log("更新个人信息", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								uni.setStorageSync("danwei1", that.Height_index)
								uni.setStorageSync("danwei2", that.Width_index)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					},
					fail(err) {
						console.log(err)
					}
				})
			},


			select_click() {
				this.$refs.popup.open("bottom")
			},
			sex_nan() {
				this.select = this.$t('男')
				this.$refs.popup.close()
			},
			sex_nv() {

				this.select = this.$t('女')
				this.$refs.popup.close()
			},
			bindDateChange(e) {
				this.date = e.detail.value
			},

			//更换头像
			btn_avatar() {
				uni.navigateTo({
					url: '/pages/tabBar/my/avatar_set'
				})
			},
			member() {
				uni.navigateTo({
					url: '../../tabBar/my/Member_name_modification?PHONE=' + this.phone
				})
			},
			getcolor(id) {
				return {
					color: id == this.$t('请输入') ? "gray" : "black"
				}
			},

		}
	}
</script>

<style>
	.health_page {
		padding: 10px 10px 0 10px;
		color: black;
		height: 100vh;
	}

	.health_avatr {
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		background: white;
		border-radius: 20px;
		margin-left: 10px;
		margin-right: 10px;
	}

	.context_btn {
		height: 48px;
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;
		padding-right: 10px;
		border-radius: 50px;
	}

	.context_title {
		width: 40vw;
		font-size: 16px;
		color: black;
		margin-left: 15px;
	}

	.color_bg {
		color: black;
		text-align: center;
		font-size: 14px;
		margin-right: 5px;
	}

	.color_bg_1 {
		color: gray;
		text-align: center;
		font-size: 14px;
	}

	.popup_bg {
		background: white;
		border-radius: 20px;
		margin-left: 20px;
		margin-right: 20px;
		margin-bottom: 10px;
	}

	.select_text {
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.bt_BG {
		display: flex;
		height: 48px;
		flex-direction: row;
		align-items: center;
		padding-top: 10px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 10px;

	}

	.text {
		width: 40vw;
		font-size: 16px;
		margin-left: 15px;
	}
</style>