<template>
	<view class="paginds">
		<view style="padding-bottom: 80px; color: black;">
			<view style="padding-top: 90px;">
				<view v-if="shareShow" class="shared-content">
					<SwitchComponent :show1="show1" :show2="show2" @click1="clicked1" @click2="clicked2" />
					<view v-if="show1" class="no-data-container">
						<view class="no-data-text">{{$t('暂无用户与您共享健康数据')}}</view>
						<view class="shared-title">{{$t('健康共享')}}</view>
						<view class="shared-details">
							<view class="textstyles">{{$t('掌握权在您手中')}}</view>
							<view class="textstyles_1">{{$t('安全共享您的健康数据')}}</view>
							<view class="textstyles">{{$t('图标汇总和通知')}}</view>
							<view class="textstyles_1">{{$t('您共享的数据将在其')}}</view>
							<view class="textstyles">{{$t('私密且安全')}}</view>
							<view class="textstyles_1">{{$t('仅分享每个主题的摘要')}}</view>
							<view class="shared-warning">
								<image src="../../../static/icons/warning.png" class="warning-icon" mode="aspectFit" />
								<view class="textstyles_1">{{$t('共享对象')}}</view>
							</view>
						</view>
						<button @tap="Share_with_others" class="buttonstyle">{{$t('共享')}}</button>
					</view>
					<view v-else class="no-data-container-empty">
						<image class="imgas" mode="aspectFit" src="../../../static/icons/60x60.png" />
						<view class="empty-text">-</view>
						<view class="empty-text">-</view>
						<view class="textstyles">{{$t('暂无用户与您共享健康数据')}}</view>
					</view>
				</view>
				<view v-else class="shared-content-active">
					<SwitchComponent :show1="show1" :show2="show2" @click1="clicked1" @click2="clicked2" />
					<swiper v-if="show1" class="swiper" indicator-active-color='#3298F7' :indicator-dots="indicatorDots"
						:autoplay="autoplay" @change="swipeIndex1" :current="currentIndex1">
						<swiper-item v-for="(item, index) in swiperlist" :key="index">
							<view style="margin-top: 20px;">
								<UserInfo :show1="true" :item="item" />
								<SharedData :show1="true" :item="item" :dataPoints="swiperlist[index].dataPoints" />
								<button class="buttonstylesss"
									@click="EDITOR(item.id, item.shareAvatar, item.receiverName, item.receiverPhone)">
									{{$t('编辑')}}
								</button>
							</view>
						</swiper-item>
					</swiper>
					<swiper v-else class="swiper" indicator-active-color='#3298F7' :indicator-dots="indicatorDots"
						:autoplay="autoplay" @change="swipeIndex2" :current="currentIndex2">
						<swiper-item v-for="(item, index) in swiperlist" :key="index">
							<view style="margin-top: 20px;">
								<UserInfo :item="item" />
								<SharedData :item="item" :dataPoints="swiperlist[index].dataPoints" />
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="header">
				<image @click="zengjia" src="../../../static/page_icon/zengjia.png" class="header-icon"
					mode="aspectFit" />
				<view class="header-title">{{$t('共享')}}</view>
				<image @click="caidan" src="../../../static/page_icon/caidan.png" class="header-icon_1"
					mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
	import SwitchComponent from "../../../components/sharevue/SwitchComponent.vue";
	import UserInfo from "../../../components/sharevue/UserInfo.vue";
	import SharedData from "../../../components/sharevue/SharedData.vue";
	const postheader = {
		'Authorization': 'Bearer ' + uni.getStorageSync("token"),
		'content-type': 'application/x-www-form-urlencoded;'
	}
	export default {
		components: {
			SwitchComponent,
			UserInfo,
			SharedData
		},
		data() {
			return {
				shareShow: false,
				show1: true,
				show2: false,
				swiperlist: [],
				indicatorDots: true,
				autoplay: false,
				lettimer: null,
				currentIndex1: 0,
				currentIndex2: 0,
			}
		},

		onHide() {
			this.clearTimer();
		},

		onShow() {
			this.startTimer();
		},

		methods: {
			clearTimer() {
				if (this.lettimer) {
					clearInterval(this.lettimer);
					this.lettimer = null;
				}
			},
			startTimer() {
				const timerLogic = () => {
					if (this.show1) {
						this.shareList();
					} else if (this.show2) {
						this.receiverList();
					}
				};
				this.lettimer = setInterval(timerLogic, 300);
			},
			swipeIndex1(e) {
				this.currentIndex1 = e.detail.current;
			},
			swipeIndex2(e) {
				this.currentIndex2 = e.detail.current;
			},
			shareList() {
				const data = {
					shareId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_share_list, data, postheader).then(pending => {
					if (pending.code === 200) {
						this.shareShow = !pending.data || pending.data.length === 0;
						if (pending.data && pending.data.length > 0) {
							this.swiperlist = pending.data;
						}
					}
				})
			},
			receiverList() {
				const data = {
					receiverId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_receiver_list, data, postheader).then(pending => {
					if (pending.code === 200) {
						this.shareShow = !pending.data || pending.data.length === 0;
						if (pending.data && pending.data.length > 0) {
							this.swiperlist = pending.data;
						}
					}
				})
			},
			clicked1() {
				this.show1 = true;
				this.show2 = false;
			},
			clicked2() {
				this.show1 = false;
				this.show2 = true;
			},
			Share_with_others() {
				uni.navigateTo({
					url: "./Share_with_3"
				});
			},
			zengjia() {
				this.Share_with_others();
			},
			caidan() {
				uni.navigateTo({
					url: '../share/Shared_list'
				});
			},
			EDITOR(id, avatar, name, phone) {
				uni.navigateTo({
					url: `./Share_with_2?AVATAR=${avatar}&NAME=${name}&PHONE=${phone}&ID=${id}`
				});
			},
		}
	};
</script>

<style>
	.paginds {
		color: black;
		height: 100vh;
	}

	.swich_bg_0 {
		display: flex;
		flex-direction: row;
		height: 40px;
		padding: 3px;
		width: 280px;
		background: #3298F7;
		border-radius: 100px;
	}

	.swich_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: black;
		width: 140px;
		line-height: 15px;
		height: 40px;
		font-size: 14px;
		font-weight: 600;
		background: white;
		border-radius: 20px;
	}

	.swich_bg_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		line-height: 15px;
		text-align: center;
		width: 140px;
		height: 40px;
		font-size: 14px;
		font-weight: 600;
	}

	.swiper {
		height: 100vh;
	}

	.imgas {
		object-fit: contain;
		display: flex;
		width: 85px;
		height: 85px;
		border-radius: 100px;
		border: 1px solid gainsboro;
	}

	.scroll-view {
		margin-top: 20px;
		height: 300px;
	}

	.textstyles {
		margin-top: 20px;
		font-weight: 600;
		font-size: 14px;
		color: #1A1A1A;
	}

	.textstyles_1 {
		font-size: 12px;
		font-weight: 400;
		color: #999999;
	}

	.buttonstyle {
		background: #3298F7;
		width: 154px;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: 600;
		border-radius: 40px;
		margin-top: 40px;
		margin-bottom: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.buttonstylesss {
		font-size: 16px;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #3298F7;
		color: white;
		width: 120px;
		border-radius: 100px;
		margin-top: 50px;
		height: 48px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.shared-content {
		background: white;
		margin: 20px;
		padding: 10px;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	}

	.shared-content-active {
		background: white;
		margin: 15px 20px 0 20px;
		padding: 10px;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	}

	.no-data-container {
		margin-top: 30px;
	}

	.no-data-container-empty {
		height: 72vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.no-data-text {
		text-align: center;
		color: #CCCCCC;
		margin-top: 30px;
		font-weight: 600;
		font-size: 16px;
	}

	.shared-title {
		text-align: center;
		color: #1A1A1A;
		margin-top: 30px;
		font-weight: 600;
		font-size: 16px;
	}

	.shared-details {
		display: flex;
		align-items: left;
		flex-direction: column;
		padding-left: 15px;
		margin-top: 10px;
	}

	.shared-warning {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
		align-items: center;
	}

	.warning-icon {
		width: 20px;
		height: 20px;
		object-fit: contain;
		margin-right: 10px;
	}

	.empty-text {
		margin-top: 20px;
	}

	.header {
		background: #F5F5F5;
		position: fixed;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 50px 10px 10px 10px;
		width: 95vw;
		z-index: 100;
	}

	.header-icon {
		width: 20px;
		height: 20px;
		margin-left: 10px;
		object-fit: contain;
	}

	.header-icon_1 {
		width: 20px;
		height: 20px;
		margin-right: 10px;
		object-fit: contain;
	}

	.header-title {
		font-size: 18px;
		font-weight: bold;
		width: 60vw;
		text-align: center;
	}
</style>