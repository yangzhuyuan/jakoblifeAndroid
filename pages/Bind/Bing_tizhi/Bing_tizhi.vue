<template>
	<view>
		<view style="margin-bottom: 280rpx;">
			<view style="padding:20px 20px 0 20px;color: black;font-weight: bold;">请选择血压计型号</view>
			<view class="list-container">
				<view class="list-item" :style="getboeder(index)" v-for="(item, index) in list" :key="index">
					<view style="display: flex;flex-direction:column;" @click="check_click(index)">
						<image style="width: 100%; height: 200rpx;display: flex; justify-content: center;"
							:src="item.imageurl"></image>
						<view style="text-align: center; margin-top: 40rpx;">{{item.title}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pos_buton_bg">
			<button class="pos_buton_bg_1" :style="getboeder1(act)" @click="bangding()">{{$t('login.text_13')}}</button>
			<button class="pos_buton_bg_2" @click="nobingding()">{{$t('XZGLLXitem.button_4')}}</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
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
						title: '型号3'
					},
					{
						imageurl: '../../../static/image.png',
						title: '型号3'
					},
				],
				act: "未选择",
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})
		},

		methods: {
			getboeder(index) {
				console.log("ccc", index)
				return {
					color: index == this.act ? "#3298F7" : "#000000",
					border: index == this.act ? "1px solid #3298F7" : ""
				}
			},
			getboeder1(index) {
				console.log("aaa", index)
				return {
					background: index == "未选择" || index == undefined ? "#DBDBDB" : "#3298F7"
				}
			},
			check_click(index) {
				this.act = index
				this.getboeder(index)
				this.getboeder1(index)
				console.log("dsajgdsa", index)
			},


			bangding() {
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
		padding: 10px;
		/* 内边距 */
		box-sizing: border-box;
		/* 盒模型 */
	}

	.even {
		margin-left: 4%;
		/* 偶数列表项左边距 */
	}

	.pos_buton_bg {
		background: white;
		width: 100vw;
		height: auto;
		display: flex;
		position: fixed;
		bottom: 0;
		flex-direction: column;
		padding-top: 20px;
		padding-bottom: 25px;
	}

	.pos_buton_bg_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80vw;
		background: #3298F7;
		color: white;
		border-radius: 25px;
	}

	.pos_buton_bg_2 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80vw;
		margin-top: 20px;
		background: #DBDBDB;
		color: white;
		border-radius: 25px;
	}
</style>