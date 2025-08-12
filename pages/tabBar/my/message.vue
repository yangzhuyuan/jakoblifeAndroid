<template>
	<view style="color: black; height: 100vh; background: #EFEFF4;">
		<view v-if="lisdata_show === true" style="padding-bottom: 80px; padding-top: 100px;">
			<view v-for="(item, index) in list" :key="index" style="padding-top: 20px;">
				<view style="background: white; margin: 0 20px 0 20px; padding: 15px; border-radius: 10px"
					@click="listclick(item.shareName, item.shareAvatar, item.sharePhone, item.id)">
					<view style="display: flex; flex-direction: row; justify-content: space-between;">
						<view style="font-weight: bold; margin: 0 0 5px 10px;">{{ $t("邀请") }}</view>
						<view style="margin-right: 10px;">{{ item.shareTime }}</view>
					</view>
					<view style="width: 78vw; background: gainsboro; height: 1px; margin-left: 10px;"></view>
					<view style="margin: 10px 0 0 10px; display: flex; flex-direction: row; align-items: center;">
						<image :src="item.shareAvatar === '' ? '/static/icons/40x40.png' : item.shareAvatar"
							style="width: 45px; height: 45px; border-radius: 50px;"></image>
						<view style="margin-left: 20px; width: 55vw;">
							<view style="font-size: 16px; font-weight: bold;">
								{{ item.shareName === null ? item.sharePhone : item.shareName }}
							</view>
							<view
								style="width: 50vw; color: gray; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
								{{ $t("想与您共享健康数据") }}
							</view>
						</view>
						<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="empty-message">
			<text style="display: flex; flex-direction: row;font-size: 16px;font-weight: 600;">{{ $t('暂无消息') }}</text>
		</view>
		<view style="position: fixed; top: 0; left: 0; right: 0;">
			<view class="title-container">
				<uni-icons @click="back()" type="left" size="28" color="black"></uni-icons>
				<view style="font-size: 18px; font-weight: 600;">{{ $t('消息') }}</view>
				<view @click="batch_del()"
					style="display: flex; flex-direction: row;font-size: 16px;font-weight: 400;color: red;">
					{{ $t('清除') }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				lisdata_show: false,
				list: [],
			}
		},
		onShow() {
			this.pending()
		},
		methods: {
			...mapMutations(['setpendinglenth']),

			back() {
				uni.navigateBack()
			},
			listclick(name, avatar, sharePhone, id) {
				uni.navigateTo({
					url: `../my/Invite?NAME=${name}&AVATAR=${avatar}&sharePhone=${sharePhone}&ID=${id}`
				});
			},
			//获取待处理分享请求列表
			pending() {
				this.$post(this.$url_pending, {
					receiverId: uni.getStorageSync("userid")
				}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
				}).then((pending) => {
					if (pending.code === 200) {
						if (pending.data !== "" && pending.data.length === 0) {
							this.lisdata_show = false;
							this.setpendinglenth("0");
						} else {
							this.lisdata_show = true;
							this.list = pending.data;
							this.setpendinglenth(pending.data.length);
						}
					}
				})
			},
			//批量删除待处理请求
			batch_del() {
				this.$post("https://jakoblife.jakob-techs.com/prod-api/share/data/batch_del", {
					receiverId: uni.getStorageSync("userid")
				}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
				}).then((pending) => {
					if (pending.code === 200) {
						this.pending()
					}
				})
			}
		}
	}
</script>

<style>
	.empty-message {
		display: flex;
		align-items: center;
		padding-top: 120px;
		justify-content: center;
		flex-direction: column;
	}

	.title-container {
		background: #EFEFF4;
		width: auto;
		height: 88px;
		display: flex;
		margin-top: 20px;
		justify-content: space-between;
		align-items: center;
		margin-left: 20px;
		margin-right: 20px;
	}
</style>