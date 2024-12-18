<template>
	<view style="color: black;width: 100vw;height: 100vh;">
		<view style="background: #3298F7;">
			<view style="display: flex;flex-direction: column;align-items: center;padding-top: 120px;">
				<view>
					<image :src="avatar" style="border-radius: 50px; width: 80px;height: 80px;">
					</image>
				</view>
				<view style="margin-top: 15px;color: white;font-size: 18px;font-weight: bold;">{{username}}</view>
			</view>
			<view class="bg" @click="Health_record()">
				<view class="context_btn">
					<view class="context_title">{{$t('wodelist.wdjkda')}}</view>
					<uni-icons type="forward" size="20"></uni-icons>
				</view>
			</view>
			<view style="background: #F5F5F5; padding-bottom: 80px;">
				<view class="context_btn1">
					<view class="context_btn2" @click="Unit_setting()">
						<view class="context_title1">{{$t('wodelist.dwss')}}</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
					<view style="width: 92%; height: 1px; background: gainsboro; margin-left:10px;"></view>
					<view class="context_btn2" @click="Equipment_management()">
						<view class="context_title1">{{$t('wodelist.sbgl')}}</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
					<view style="width: 92%; height: 1px; background: gainsboro; margin-left:10px;"></view>
					<view class="context_btn2" @click="Reminder_setting()">
						<view class="context_title1">{{$t('wodelist.txsz')}}</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
					<view style="width: 92%; height: 1px; background: gainsboro; margin-left:10px;"></view>
					<view class="context_btn2" @click="Help_center()">
						<view class="context_title1">{{$t('wodelist.bzzx')}}</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
					<view style="width: 92%; height: 1px; background: gainsboro; margin-left:10px;"></view>
					<view class="context_btn2" @click="Safety_center()">
						<view class="context_title1">{{$t('wodelist.aqzx')}}</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
					<view style="width: 92%; height: 1px; background: gainsboro; margin-left:10px;"></view>
					<view class="context_btn2" @click="About_Update()">
						<view class="context_title1">{{$t('wodelist.gygx')}}</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
				</view>
			</view>
			<view class="my_title_all">
				<image @click="qiehuan()" src="../../../static/qiehuan.png" style="width: 25px; height: 25px;"></image>
				<view class="title">{{$t('wode')}}</view>
				<image v-if="msg" src="../../../static/icons/19.png"
					style="width: 25px; height: 25px; padding-right: 30px;" @click="Historical_record()">
				</image>
				<image v-else src="../../../static/icons/20.png" style="width: 25px; height: 25px;padding-right: 30px;"
					@click="Historical_record()">
				</image>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';


	export default {

		computed: {
			...mapState(['info'])
		},


		data() {
			return {
				avatar: '',
				msg: true,
				username: this.$t('wodelist.name'),
			}
		},

		onShow() {
			console.log("token:", uni.getStorageSync("token"))
			let that = this
			if (uni.getStorageSync("token") === "" || uni.getStorageSync("token") === undefined) {
				uni.redirectTo({
					url: "/pages/login/login_land"
				})
			} else {
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
								if (res.data.data.avatar === "" || res.data.data.avatar === undefined) {
									that.avatar = "../../../static/icons/40x40.png"
								} else {
									that.avatar = res.data.data.avatar
								}
								that.username = that.info.nickName
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
			}
		},



		methods: {


			//切换
			qiehuan() {
				uni.navigateTo({
							url: '../../../pages/Bind/cs_manage_1?typesss=my'
				})
			},

			//消息
			Historical_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/message"
				})
			},

			//我的健康档案
			Health_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Health_record"
				})
			},

			//单位设置
			Unit_setting() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Unit_setting"
				})
			},

			//设备管理
			Equipment_management() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Equipment_management"
				})
			},

			//提醒设置
			Reminder_setting() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Reminder_setting"
				})
			},

			//帮助中心
			Help_center() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Help_center"
				})
			},

			//安全中心
			Safety_center() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Safety_center"
				})
			},

			//关于&更新
			About_Update() {
				uni.navigateTo({
					url: "/pages/tabBar/my/About_Update"
				})
			},


		}
	}
</script>

<style>
	.my_title_all {
		height: 60px;
		padding: 30px 15px 10px 15px;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: fixed;
		width: 100vw;
		top: 0;
		background: #3298F7;
	}

	.title {
		color: white;
		text-align: center;
		width: 85%;
		font-weight: bold;
		font-size: 16px;
	}

	.bg {
		padding: 10px;
		background: #F5F5F5;
		margin-top: 20px;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
	}

	.context_btn {
		display: flex;
		flex-direction: row;
		background: white;
		padding: 15px;
		margin: 10px;
		border-radius: 15px;

	}

	.context_btn1 {
		display: flex;
		flex-direction: column;
		background: white;
		padding: 5px 10px 5px 10px;
		margin-left: 20px;
		margin-right: 20px;
		border-radius: 15px;


	}

	.context_btn2 {
		display: flex;
		flex-direction: row;
		background: white;
		padding: 15px;

	}

	.context_title {
		width: 85%;
		font-size: 16px;
		color: black;
		margin-left: 15px;
	}

	.context_title1 {
		width: 90%;
		font-size: 16px;
		color: black;
		margin-left: 5px;
	}
</style>