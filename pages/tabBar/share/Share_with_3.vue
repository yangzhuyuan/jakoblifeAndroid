<template>
	<view style="display: flex;justify-content: center; background: #F7F7F7;height: 100vh;color: black;">
		<view style="width: 90vw; margin-top: 20px;">
			<uni-search-bar @input="set" v-model="searchValue" bgColor="#FBFBFB" radius="5"
				:placeholder="$t('gongxiangitem.title_12')" clearButton="always" cancelButton="none" @confirm="search" />
			<!-- <scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="lower"> -->
				<view class="list">
					<view v-for="(item,index) in filterList" :key="index" @click="Share_with(item.name,item.phone)">
						<view style="display: flex;align-items: center; padding: 10px;margin: 0 15px 0 15px;">
							<image :src="item.avatar"
								style="border-radius: 15px; width: 30px; height: 30px; border: 1px solid gainsboro;">
							</image>
							<view style="width: 70%; text-align: left;margin-left: 20px;">
								<view style="font-weight: bold;">{{item.name}}</view>
								<view style="color: gray;font-size: 14px;">{{item.phone}}</view>
							</view>
							<uni-icons type="right" size="16"></uni-icons>
						</view>
						<view style="margin-left: 20px; background: gainsboro; width: 85%; height: 1px;">
						</view>
					</view>
				</view>
			<!-- </scroll-view> -->
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				searchValue: "",
				filterList: [],
				list: [{
						avatar: "../../../static/icons/40x40.png",
						name: "JAKOB1",
						phone: "0568",
					},
					{
						avatar: "../../../static/icons/40x40.png",
						name: "AKOB3",
						phone: "123456",
					},
					{
						avatar: "../../../static/icons/40x40.png",
						name: "",
						phone: "123456",
					}
				]
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('gongxiangitem.title_11')
			})
		},

		methods: {
			set(value) {
				console.log(value)
				let values = value;
				if (!values) {
					this.filterList = "";
					this.searchValue = values
					return;
				}
				let filterArr = [];
				// 过滤出符合条件的值
				this.list.forEach((item, index) => {
					console.log(item, index)
					if (item.phone.includes(values) || item.name.includes(values)) {
						filterArr.push({
							avatar: item.avatar,
							name: item.name,
							phone: item.phone,
						});
					}
				});
				this.filterList = filterArr;
				console.log(this.filterList);
			},
			Share_with(name, phone) {
				uni.navigateTo({
					url: "../share/Share_with?NAME=" + name + "&PHONE=" + phone
				})
			},


		}
	}
</script>

<style>

</style>