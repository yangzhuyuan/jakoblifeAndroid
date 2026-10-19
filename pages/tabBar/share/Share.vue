<template>
	<view class="paginds">
		<view class="page-body">
			<view class="content-area">
				<view v-if="shareShow" class="shared-content">
					<scroll-view scroll-y="true" class="empty-scroll" :show-scrollbar="false">
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
									<image src="../../../static/icons/warning.png" class="warning-icon"
										mode="aspectFit" />
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
					</scroll-view>
				</view>
				<view v-else class="shared-content-active">
					<swiper v-if="show1" class="swiper" :indicator-dots="false" :autoplay="autoplay"
						@change="swipeIndex1" :current="currentIndex1">
						<swiper-item v-for="(item, index) in swiperlist" :key="index">
							<scroll-view scroll-y="true" class="swiper-scroll" :show-scrollbar="false">
								<view class="swiper-item-inner">
									<UserInfo :show1="true" :item="item" />
									<SharedData :show1="true" :item="item" :dataPoints="swiperlist[index].dataPoints" />
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
					<swiper v-else class="swiper" :indicator-dots="false" :autoplay="autoplay" @change="swipeIndex2"
						:current="currentIndex2">
						<swiper-item v-for="(item, index) in swiperlist" :key="index">
							<scroll-view scroll-y="true" class="swiper-scroll" :show-scrollbar="false">
								<view class="swiper-item-inner">
									<UserInfo :item="item" />
									<SharedData :item="item" :dataPoints="swiperlist[index].dataPoints" />
								</view>
							</scroll-view>
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
			<view class="switch-fixed">
				<SwitchComponent :show1="show1" :show2="show2" @click1="clicked1" @click2="clicked2" />
			</view>
			<view class="bottom-action-bar" v-if="!shareShow && swiperlist.length">
				<view class="indicator-row">
					<view v-for="(item, index) in swiperlist" :key="index" class="indicator-dot"
						:class="{ 'indicator-dot-active': (show1 ? currentIndex1 : currentIndex2) === index }"></view>
				</view>
				<button v-if="show1" class="buttonstylesss"
					@click="EDITOR(swiperlist[currentIndex1].id, swiperlist[currentIndex1].shareAvatar, swiperlist[currentIndex1].receiverName, swiperlist[currentIndex1].receiverPhone)">
					{{$t('编辑')}}
				</button>
				<button v-else class="buttonstylesss_1" @click="CANEDITOR(swiperlist[currentIndex2].id)">
					{{$t('停止共享')}}
				</button>
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
				this.$post(this.$url_APP_IP + this.$url_share_list, data, postheader).then(pending => {
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
				this.$post(this.$url_APP_IP + this.$url_receiver_list, data, postheader).then(pending => {
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
			CANEDITOR(id) {
				uni.showModal({
					content: this.$t("是否取消此数据的共享"),
					confirmText: this.$t("是"),
					cancelText: this.$t("否"),
					success: (modalres) => {
						if (modalres.confirm) {
							uni.request({
								url: `${this.$url_APP_IP}/prod-api/share/data/${id}`,
								method: 'DELETE',
								header: {
									'Authorization': `Bearer ${uni.getStorageSync("token")}`,
									'content-type': 'application/json'
								},
								success: (res) => {
									console.log("res", res)
									if (res.data.code === 200) {
										uni.showToast({
											title: this.$t("成功"),
											icon: "none",
											duration: 1500,
										})
									}
								},
							});
						} else {
							uni.hideLoading();
						}
					}
				});
			},
		}
	};
</script>

<style>
	.paginds {
		color: #1A1A1A;
		min-height: 100vh;
		background: #F5F7FA;
	}

	.page-body {
		padding-bottom: 0;
		color: #1A1A1A;
		height: 100vh;
		overflow: hidden;
		box-sizing: border-box;
		background: #F5F7FA;
	}

	.content-area {
		padding-top: 168px;
		padding-bottom: calc(12px + var(--window-bottom));
		box-sizing: border-box;
		height: 100vh;
	}

	.switch-fixed {
		position: fixed;
		top: 96px;
		left: 0;
		right: 0;
		z-index: 99;
		background: #F5F7FA;
		padding: 10px 0 8px;
	}

	.shared-content {
		background: transparent;
		margin: 0 16px;
		padding: 0;
		border-radius: 0;
		box-shadow: none;
		height: calc(100vh - 168px - 12px - var(--window-bottom));
	}

	.empty-scroll {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}

	.shared-content-active {
		background: transparent;
		margin: 10px 16px 0 16px;
		padding: 0;
		border-radius: 0;
		box-shadow: none;
		height: calc(100vh - 168px - 88px - var(--window-bottom));
	}

	.swiper {
		height: 100%;
		width: 100%;
	}

	.swiper-scroll {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}

	.swiper-item-inner {
		margin-top: 0;
		padding: 0 0 12px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		box-sizing: border-box;
		background: transparent;
	}

	.bottom-action-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: var(--window-bottom);
		z-index: 99;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 6px 16px 10px;
		background: #F5F7FA;
		box-sizing: border-box;
	}

	.indicator-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 10px;
		min-height: 10px;
	}

	.indicator-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #C8CDD6;
		margin: 0 4px;
	}

	.indicator-dot-active {
		background: #3298F7;
		width: 16px;
		height: 6px;
		border-radius: 100px;
	}

	.buttonstylesss,
	.buttonstylesss_1 {
		font-size: 16px;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #3298F7;
		color: white;
		width: 78%;
		border-radius: 100px;
		margin: 0 auto;
		height: 48px;
		box-shadow: 0 4px 12px rgba(50, 152, 247, 0.28);
		border: none;
		flex-shrink: 0;
	}

	.imgas {
		object-fit: contain;
		display: flex;
		width: 85px;
		height: 85px;
		border-radius: 100px;
		border: 1px solid #E5E8EF;
	}

	.textstyles {
		margin-top: 16px;
		font-weight: 600;
		font-size: 14px;
		color: #1A1A1A;
	}

	.textstyles_1 {
		font-size: 12px;
		font-weight: 400;
		color: #999999;
		margin-top: 2px;
	}

	.buttonstyle {
		background: #3298F7;
		width: 70%;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: 600;
		border-radius: 40px;
		margin-top: 36px;
		margin-bottom: 12px;
		box-shadow: 0 4px 12px rgba(50, 152, 247, 0.28);
	}

	.shared-content {
		background: transparent;
		margin: 0 16px;
		padding: 0;
		border-radius: 0;
		box-shadow: none;
	}

	.no-data-container {
		margin-top: 12px;
		background: #FFFFFF;
		border-radius: 18px;
		padding: 20px 16px 24px;
		margin-left: 1px;
		margin-right: 1px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.no-data-container-empty {
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #FFFFFF;
		border-radius: 18px;
		padding: 40px 16px;
		margin-left: 1px;
		margin-right: 1px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		margin-top: 10px;
	}

	.no-data-text {
		text-align: center;
		color: #CCCCCC;
		margin-top: 10px;
		font-weight: 600;
		font-size: 15px;
	}

	.shared-title {
		text-align: center;
		color: #1A1A1A;
		margin-top: 24px;
		font-weight: 700;
		font-size: 16px;
	}

	.shared-details {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		padding-left: 8px;
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
		margin-top: 16px;
		color: #999999;
	}

	.header {
		background: #FFFFFF;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 50px 16px 12px;
		width: 100%;
		box-sizing: border-box;
		z-index: 100;
		border-bottom: 1px solid #F0F2F5;
	}

	.header-icon {
		width: 22px;
		height: 22px;
		object-fit: contain;
	}

	.header-icon_1 {
		width: 22px;
		height: 22px;
		object-fit: contain;
	}

	.header-title {
		font-size: 18px;
		font-weight: 700;
		flex: 1;
		text-align: center;
		color: #1A1A1A;
	}
</style>