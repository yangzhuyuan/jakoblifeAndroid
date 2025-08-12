<template>
	<view style="color: black;height: 100vh;">
		<view style="background: #3298F7;">
			<view style="display: flex;flex-direction: column;align-items: center;padding-top: 120px;">
				<view @click="touxiang" class="avatar-container">
					<image :src="avatar" class="avatar-image" mode="aspectFit"></image>
				</view>
				<view style="margin-top: 15px;color: white;font-size: 18px;font-weight: bold;">{{username}}</view>
			</view>
			<view class="bg" @click="Health_record()">
				<view class="context_btn">
					<view class="context_title">{{$t('我的健康档案')}}</view>
					<uni-icons type="forward" size="20"></uni-icons>
				</view>
			</view>
			<view style="background: #F5F5F5; padding-bottom: 80px;padding-top: 20px">
				<view class="context_btn1">
					<view v-for="(item, index) in menuItems" :key="index">
						<view class="context_btn2" @click="navigateToPage(item.url)">
							<view class="context_btn3">
								<image class="imagessai" v-show="item.title === '生成健康报告'"
									src="/static/page_icon/aipbg.jpg" mode="aspectFit">
								</image>
								<view class="context_title1">{{$t(item.title)}}</view>
							</view>
							<uni-icons type="forward" size="20"></uni-icons>
						</view>
						<view class="divider"></view>
					</view>
					<view class="context_btn2">
						<view class="context_title1">{{$t('推送开关')}}</view>
						<switch @change="switch1Change" style="transform:scale(0.8);" :checked="switchsdss"
							color="#0686CC" />
					</view>
				</view>
			</view>
			<view class="my_title_all">
				<view style="width: 25px;height: 25px;"></view>
				<view class="title">{{$t('我的')}}</view>
				<image :src="msg ? '../../../static/icons/19.png' : '../../../static/icons/20.png'" mode="aspectFit"
					style="width: 25px; height: 25px; padding-right: 30px;object-fit: contain;"
					@click="Historical_record">
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
			...mapState(['getpendinglenth'])
		},
		data() {
			return {
				timsdpad: null,
				avatar: '',
				msg: true,
				username: this.$t('未登录'),
				switchsdss: uni.getStorageSync("myswics") || false,
				// 菜单项数组
				menuItems: [{
						title: '单位设置',
						url: '/pages/tabBar/my/Unit_setting'
					},
					{
						title: '设备管理',
						url: '/pages/tabBar/my/Equipment_management1'
					},
					{
						title: '警报',
						url: '/pages/tabBar/my/Alarms'
					},
					{
						title: '生成健康报告',
						url: '/pages/tabBar/tendency/supplement'
					},
					// {
					// 	title: '自动血压监测设置',
					// 	url: '/pages/tabBar/my/Watch_measurement'
					// },
					// {
					// 	title: '提醒设置',
					// 	url: '/pages/tabBar/my/Reminder_setting'
					// },
					{
						title: '帮助中心',
						url: '/pages/tabBar/my/Help_center'
					},
					{
						title: '安全中心',
						url: '/pages/tabBar/my/Safety_center'
					},
					{
						title: '关于更新',
						url: '/pages/tabBar/my/About_Update'
					},
					{
						title: '反馈',
						url: '/pages/tabBar/my/fankui'
					}
				]
			}
		},
		onHide() {
			if (this.timsdpad) {
				clearInterval(this.timsdpad);
				this.timsdpad = null;
			}
		},
		onShow() {
			const token = uni.getStorageSync("token");
			if (!token) {
				uni.redirectTo({
					url: "/pages/login/login_land"
				});
				return;
			}
			this.getInfoUser()
		},
		methods: {
			...mapMutations(['getInfo']),
			// 发起请求获取用户信息
			getInfoUser() {
				this.$get(this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					switch (res.code) {
						case 200:
							this.handleUserInfo(res.data);
							break
						case 500:
							uni.showToast({
								title: this.$t("获取数据失败"),
								icon: 'none'
							});
							break
						case 401:
							uni.redirectTo({
								url: "/pages/login/login_land"
							});
							break
						default:
							return;
							break
					}
				})
			},
			// 处理用户信息
			handleUserInfo(data) {
				this.avatar = data.avatar || "../../../static/icons/40x40.png";
				this.username = data.nickName || data.userName || "未登录";
				this.getInfo(data);
				this.pending(data);
				this.timsdpad = setInterval(res => {
					this.pending(data);
				}, 8000)
			},
			//获取待处理分享请求列表
			pending(datainfo) {
				const data = {
					receiverId: datainfo.userId
				}
				this.$post(this.$url_pending, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
				}).then(pending => {
					switch (pending.code) {
						case 200:
							if (pending.data.length === 0) {
								this.msg = true;
							} else {
								this.msg = this.getpendinglenth >= pending.data.length;
							}
							break
					}
				})
			},
			//消息
			Historical_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/message"
				})
			},
			//点击头像
			touxiang() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Health_record"
				})
			},
			// 统一的页面跳转方法
			navigateToPage(url) {
				uni.navigateTo({
					url: url
				});
			},

			//我的健康档案
			Health_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Health_record"
				})
			},
			//反馈
			Feedback() {
				uni.navigateTo({
					url: "/pages/tabBar/my/fankui"
				})
			},
			//推送开关
			switch1Change(e) {
				let that = this
				that.switchsdss = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					uni.showModal({
						title: that.$t("提示"),
						content: that.$t("推送结果"),
						success: function(res) {
							if (res.confirm) {
								that.switchsdss = false
								uni.setStorageSync("myswics", false)
								uni.removeStorageSync("swichs")
								uni.removeStorageSync("switchList")
							} else if (res.cancel) {
								that.switchsdss = true
								uni.setStorageSync("myswics", true)
							}
							// 关键点：添加下一行确保视图更新
							that.$nextTick(() => that.$forceUpdate())
						}
					})
				} else if (e.detail.value === true) {
					that.switchsdss = true
					uni.setStorageSync("myswics", true)
					uni.navigateTo({
						url: "/pages/tabBar/my/Alarms"
					})
				}
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
		margin-top: 40px;
		background: #F5F5F5;
		padding-top: 20px;
		border-top-right-radius: 20px;
		border-top-left-radius: 20px;
	}

	.context_btn {
		width: auto;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background: white;
		margin-left: 20px;
		margin-top: 20px;
		margin-right: 20px;
		padding-right: 10px;
		height: 56px;
		border-radius: 20px;
		box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.15);
	}

	.context_btn1 {
		width: auto;
		display: flex;
		flex-direction: column;
		background: white;
		padding: 2px 10px 5px 10px;
		margin-left: 20px;
		margin-right: 20px;
		border-radius: 15px;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
	}

	.context_btn2 {
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
		height: 56px;
		padding-left: 10px;
	}

	.context_btn3 {
		flex-direction: row;
		display: flex;
		justify-content: space-between;
		width: 90%;
		align-items: center;
	}

	.imagessai {
		width: 25px;
		height: 25px;
		object-fit: contain;
		margin-bottom: 20px;
		border-radius: 25px;
		margin-right: 5px;
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
	}

	/* 提取公共样式 */
	.avatar-container {
		background: white;
		border-radius: 100px;
		display: flex;
		padding: 1px;
		align-items: center;
		cursor: pointer;
	}

	.avatar-image {
		border-radius: 100px;
		width: 85px;
		height: 85px;
		object-fit: contain;
	}

	.divider {
		width: 92%;
		height: 1px;
		background: gainsboro;
		margin-left: 10px;
	}
</style>