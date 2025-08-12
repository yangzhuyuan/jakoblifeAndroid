<template>
	<view style="display: flex;justify-content: center;background: #EFEFF4; height: 100vh;color: black;">
		<view style="width: 90vw; margin-top: 20px;">
			<view style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
				<uni-search-bar style="width: 70vw;" v-model="searchValue" bgColor="#FBFBFB" radius="5"
					:placeholder="$t('请搜索会员名或手机号')" clearButton="always" cancelButton="none">
				</uni-search-bar>
				<view @click="search()">{{$t("搜索")}}</view>
			</view>
			<view class="listback">
				<view v-for="(item,index) in filterList" :key="index"
					@click="Share_with(item.userName,item.phonenumber,item.avatar,item.userId,item.nickName)">
					<view style="display: flex;align-items: center; padding: 10px;margin: 0 15px 0 15px;">
						<image :src="item.avatar"
							style="border-radius: 20px; width: 40px; height: 40px; border: 1px solid gainsboro;">
						</image>
						<view style="width: 70%; text-align: left;margin-left: 20px;">
							<view
								style="font-weight: 400;font-size: 16px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
								{{item.userName.length>20||!item.userName?item.nickName:item.userName}}
							</view>
							<view style="color: #1A1A1A;font-size: 14px; font-weight: 400; margin-top: 10px;">
								{{item.phonenumber}}
							</view>
						</view>
						<uni-icons type="right" size="16"></uni-icons>
					</view>
					<view style="margin-left: 20px; background: gainsboro; width: 85%; height: 1px;">
					</view>
				</view>
			</view>
		</view>

	</view>

</template>

<script>
	export default {

		data() {
			return {
				searchValue: "",
				filterList: [],
				list: [],
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("共享给")
			})
		},

		methods: {
			//根据手机号查询用户
			listsss() {
				const data = {
					userType: "01",
					searchValue: this.searchValue
				}
				this.$get("https://jakoblife.jakob-techs.com/prod-api/system/user/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;'
				}).then(res => {
					console.log("res", res)
					if (res.code === 200) {
						this.filterList = res.rows;
					} else {
						uni.showToast({
							title: this.$t("此用户不存在"),
							icon: 'none'
						})
					}
				})
			},

			search() {
				let that = this
				that.listsss()
			},

			Share_with(name, phone, avatar, receiverId, nickename) {
				uni.navigateTo({
					url: "../share/Share_with?NAME=" + (name.length > 20 || !name ? nickename : name) + "&PHONE=" +
						phone + "&AVATAR=" + avatar + "&receiverId=" + receiverId
				})
			},


		}
	}
</script>

<style>
	.listback {
		padding-top: 20px;
		padding-bottom: 40px;
	}

	.confirm-button {
		margin-left: 10px;
		padding: 5px 10px;
		color: black;
		border: none !important;
		border-radius: 5px;
	}
</style>