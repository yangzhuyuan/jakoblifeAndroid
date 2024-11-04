<template>
	<view style="padding: 20px;">
		<view style="background: white; padding: 10px; border-radius: 20px;">
			<view>
				<view class="bt_BG" @click="Member_name_modification()">
					<view class="textsss">{{$t('wodelist.wdjkdaitem.title_1')}}</view>
					<view
						style=" width: 40vw;justify-content: flex-end; display: flex;flex-direction: row;  align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{vip_name}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; margin-top: 10px;  height: 1px;"></view>
			<view>
				<view class="bt_BG" @click="Change_number()">
					<view class="textsss">{{$t('zhuceitem.title_0')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{vip_phone}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%;margin-top: 10px;  height: 1px;"></view>
			<view>
				<view class="bt_BG" @click="Password_setting()">
					<view class="textsss">{{$t('wodelist.aqzxitem.title_1')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;"></view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;margin-top: 10px;"></view>
			<view style="padding-bottom: 5px;" @click="Cancel_account()">
				<view class="bt_BG">
					<view class="textsss">{{$t('wodelist.zx_title0')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;  display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;"></view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view style="margin: 20px 0 10px 15px; font-weight: bold;">{{$t('wodelist.aqzxitem.title_2')}}</view>
		<view style="background: white; padding: 10px; border-radius: 20px;">
			<view>
				<view class="bt_BG">
					<view class="textsss">{{$t('wodelist.aqzxitem.title_3')}}</view>
					<view
						style="width: 40vw;justify-content: flex-end;display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{wx_phone}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;margin-top: 10px;"></view>
			<view>
				<view class="bt_BG">
					<view class="textsss">QQ</view>
					<view
						style="width: 40vw;justify-content: flex-end;display: flex;flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{qq_ID}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px; margin-top: 10px;"></view>
			<view>
				<view class="bt_BG">
					<view class="textsss">APPLE ID</view>
					<view
						style="width: 40vw;justify-content: flex-end; display: flex;margin-bottom: 10px; flex-direction: row; align-items: center;">
						<view style="color: gray; text-align: right; font-size: 14px;">{{apple_ID}}</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view style="display: flex;justify-content: center;">
			<button @click="logout()"
				style="position: fixed; bottom: 40px; border-radius: 30px; background: #3298F7; color: white; width: 80vw;">{{$t('wodelist.aqzxitem.title_12')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vip_name: this.$t('wodelist.aqzxitem.title_0'),
				vip_phone: this.$t('wodelist.aqzxitem.title_13'),
				wx_phone: this.$t('wodelist.aqzxitem.title_13'),
				qq_ID: this.$t('wodelist.aqzxitem.title_13'),
				apple_ID: this.$t('wodelist.aqzxitem.title_13')
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.aqzx')
			})
			let that = this;
			uni.request({
				url: that.$url_getInfo,
				method: 'GET',
				header: {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				},
				success: function(res) {
					console.log("获取用户信息成功:", res)
					if (res.statusCode == 200) {
						if (res.data.code == 200) {
							that.vip_name = res.data.data.userName
							if (res.data.data.phonenumber === "" || res.data.data.phonenumber === null) {
								that.vip_phone = this.$t('wodelist.aqzxitem.title_13')
							} else {
								that.vip_phone = res.data.data.phonenumber.substring(0, 3) + '****' + res.data.data.phonenumber.substring(7)
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'error'
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
			//会员名
			Member_name_modification() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Member_name_modification"
				})
			},
			//绑定手机号
			Change_number() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Change_number"
				})
			},
			//设置登录密码
			Password_setting() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Password_setting"
				})

			},
			//注销账号
			Cancel_account() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Cancel_account"
				})
			},
			//退出登录
			logout() {
				uni.removeStorageSync("token")
				uni.reLaunch({
					url: '/pages/login/login_land'
				})
			},
		}
	}
</script>

<style>
	.bt_BG {
		display: flex;
		flex-direction: row;
		padding-top: 10px;
		padding-left: 10px;
		align-items: center;

	}

	.textsss {
		width: 50vw;
		font-size: 16px;
		font-weight: bold;
		text-align: left;
	}
</style>