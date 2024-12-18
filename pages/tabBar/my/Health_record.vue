<template>
	<view style="padding:10px 10px 0 10px;background: #F7F7F7; color: black;width: 100vw;height: 100vh;">
		<view style="background: white; border-radius: 20px;">
			<view class="context_btn" @click="btn_avatar()">
				<view class="context_title">{{$t('wodelist.wdjkdaitem.title_0')}}</view>
				<view style="width: 35vw; display: flex;justify-content: flex-end;">
					<image :src="avatar"
						style="border: 1px solid gainsboro; width: 30px; height: 30px;border-radius: 20px;">
					</image>
				</view>
				<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
			</view>
			<view style="width: 80vw; height: 1px; background: gainsboro; margin-left:25px;"></view>
			<view class="context_btn" @click="member()">
				<view class="context_title">{{$t('wodelist.wdjkdaitem.title_1')}}</view>
				<view style="width: 35vw; display: flex;justify-content: flex-end;">{{username}}</view>
				<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
			</view>
		</view>

		<view style="margin: 20px 0 20px 15px; color: gray;">{{$t('wodelist.wdjkdaitem.title_2')}}</view>

		<view style="background: white; border-radius: 20px; margin-top: 10px;">
			<view class="bt_BG">
				<view class="text">{{$t('zhuceitem.title_3')}}</view>
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
				<view class="text">{{$t('zhuceitem.title_4')}}</view>
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
				<view class="text">{{$t('zhuceitem.title_5')}}</view>
				<view
					style="width: 40vw; justify-content: flex-end; display: flex;flex-direction: row; align-items: center;">
					<input type="number" :placeholder="$t('zhuceitem.title_8')" v-model="height"
						style="color: black;  width: 50vw;margin-right: 5px; text-align: right; font-size: 14px;"
						maxlength="5" />
					<view>CM</view>
				</view>
			</view>
			<view style="width: 85%; height: 1px; background: gainsboro; margin-left:25px;"></view>
			<view class="bt_BG">
				<view class="text">{{$t('zhuceitem.title_6')}}</view>
				<view style="width: 40vw; justify-content: flex-end;display: flex;flex-direction: row;">
					<input type="number" :placeholder="$t('zhuceitem.title_8')" v-model="width"
						style="color: black; text-align: right;width: 50vw;margin-right: 5px; font-size: 14px;"
						maxlength="5" />
					<view>KG</view>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="true">
				<view class="popup_bg">
					<view class="select_text" @click="sex_nan()">{{$t('zhuceitem.select_0')}}</view>
					<view style="border-top: 1px solid gainsboro;"></view>
					<view class="select_text" @click="sex_nv()">{{$t('zhuceitem.select_1')}}</view>
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
				username: this.$t('wodelist.name'),
				select: this.$t('zhuceitem.title_8'),
				height: '',
				width: '',
				date: this.$t('zhuceitem.title_8'),
				phone: '',
			}
		},

		onBackPress(options) {
			console.log('from:' + options.from)
			if (options.from === 'backbutton') {
				this.update_info()
			}
		},




		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('wodelist.wdjkdaitem.title_3')
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
					console.log("获取用户信息成功1111:", res)
					if (res.statusCode == 200) {
						if (res.data.code == 200) {
							if (res.data.data.avatar === "" || res.data.data.avatar === undefined) {
								that.avatar = "../../../static/icons/40x40.png"
							} else {
								that.avatar = res.data.data.avatar
							}
							that.username = res.data.data.nickName
							that.select = res.data.data.sex === '0' ? that.$t('zhuceitem.select_0') : that.$t(
								'zhuceitem.select_1')
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
			//更新个人信息
			update_info() {
				let that = this
				uni.request({
					url: that.$url_update_info,
					method: 'POST',
					data: {
						nickName: that.username,
						sex: that.select === that.$t('zhuceitem.select_0') ? "0" : "1",
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
							if (res.data.code == 200) {} else {
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
				this.select = this.$t('zhuceitem.select_0')
				this.$refs.popup.close()
			},
			sex_nv() {

				this.select = this.$t('zhuceitem.select_1')
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
					color: id == this.$t('zhuceitem.title_8') ? "gray" : "black"
				}
			},

		}
	}
</script>

<style>
	.context_btn {
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;
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
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.bt_BG {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;

	}

	.text {
		width: 40vw;
		font-size: 16px;
		margin-left: 15px;
	}
</style>