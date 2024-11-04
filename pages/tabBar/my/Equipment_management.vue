<template>
	<view style="padding-top: 10px;padding-bottom: 160px;">
		<view class="list-container">
			<view class="list-item" @click="btn_add()">
				<view style="display: flex;flex-direction:column;" @click="check_click(index)">
					<image style="width: 100%; height: 200rpx;display: flex; justify-content: center;" :src="imageurl">
					</image>
					<view style="text-align: center; margin-top: 40rpx;">{{title}}</view>
				</view>
			</view>
			<view class="list-item" :style="getboeder(index)" v-for="(item, index) in list" :key="index">
				<view style="display: flex;flex-direction:column;" @click="check_click(index)">
					<image style="width: 100%; height: 200rpx;display: flex; justify-content: center;"
						:src="item.imageurl"></image>
					<view style="text-align: center; margin-top: 40rpx;">{{item.title}}</view>
				</view>
			</view>
		</view>
		<view
			style="background: white; width:100vw;height: 200rpx;  display: flex;position: fixed;bottom: 0; flex-direction: column; padding-top: 40rpx; padding-bottom: 50rpx;">
			<button class="button_bg_color" :style="getboeder1(act)" @tap="True">{{$t('wodelist.sbglitem.title_1')}}</button>
			<button
				style="display: flex; justify-content: center;align-items: center;margin-top: 40rpx; width: 80vw; background: #DBDBDB; color: white; border-radius: 50rpx;"
				@tap="Delete">{{$t('wodelist.sbglitem.title_2')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageurl: '../../../static/icons/add.png',
				title: this.$t('wodelist.sbglitem.title_0'),

				list: [{
						imageurl: '../../../static/image.png',
						title: '型号1'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号2'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号3'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号4'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号5'
					},
				],
				act: "未选择",

			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.sbgl')
			})
		},


		methods: {
			check_click(index) {
				this.act = index
				this.getboeder(index)
				this.getboeder1(index)
			},
			getboeder(index) {
				console.log("ccc", index)
				return {
					color: index == this.act ? "#3298F7" : "#000000",
					border: index == this.act ? "2px solid #3298F7" : ""
				}
			},
			getboeder1(index) {
				console.log("aaa", index)
				return {
					background: index == "未选择" || index == undefined ? "#DBDBDB" : "#3298F7"
				}
			},
			True() {
				console.log("dddd", this.act)
				if (this.act === "未选择" || this.act === "" || this.act === undefined) {
					uni.showToast({
						title: "请选择一个设备",
						icon: "error"
					})
					return
				} else {

				}
			},
			Delete() {
				if (this.act === "未选择" || this.act === "" || this.act === undefined) {
					uni.showToast({
						title: "请选择一个设备",
						icon: "error"
					})
					return
				} else {

				}
			}
		}
	}
</script>

<style>
	.list-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 5px;
		justify-content: space-between;
	}



	.list-item {
		/* 两列宽度分配比例 */
		/* 列表项间距 */
		background-color: #f3f3f3;
		background: white;
		border-radius: 10px;
		/* 背景色 */
		margin: 5px;
		padding: 5px;
		/* 内边距 */
		box-sizing: border-box;
		/* 盒模型 */
	}

	.button_bg_color {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80vw;
		background: #3298F7;
		color: white;
		border-radius: 50px;
	}
</style>