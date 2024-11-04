<template>
	<view>
		<view style="padding-bottom: 160px;">
			<view style="padding:20px;color: black;font-weight: bold;">
				{{SELECT_TYPE==="xueya" ? $t('XZGLLXitem.title_9') : $t('XZGLLXitem.title_10')}}
			</view>
			<view class="list-container">
				<view class="list-item" :class="index == active ? 'active' : ''" v-for="(item, index) in list"
					:key="index">
					<view class="list_item_bg" @click="check_click(index)">
						<image style="width: 100%; height: 100px;" :src="item.imageurl" />
						<view style="text-align: center; margin-top: 10px;">{{item.title}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="button_bg_view">
			<button class="button_bg" :style="getbutton(active)" @tap="True()">{{$t('login.text_13')}}</button>
			<button class="button_bg" style="margin-top: 10px;" @tap="Unbind()">{{$t('XZGLLXitem.button_4')}}</button>
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
				active: "未选",
			}
		},


		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('BDSB')
			})
		},

		onLoad(opt) {
			console.log("上个页面带过来的数据", opt)
			this.SELECT_TYPE = opt.SELECT_TYPE
		},

		methods: {
			check_click(index) {
				this.active = index;
			},

			getbutton(bg) {
				return {
					background: bg == "未选" ? "#DBDBDB" : "#3298F7"
				}
			},

			True() {
				if (this.active == "未选") {
					uni.showToast({
						title: this.SELECT_TYPE === "xueya" ? this.$t('XZGLLXitem.title_9') : this.$t(
							'XZGLLXitem.title_10'),
						icon: "none"
					})
					return
				}
				uni.navigateTo({
					url: "../Bing_page/Bing_page_1"
				})
			},
			Unbind() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			}
		}
	}
</script>

<style>
	.list-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, calc((100vw - 40px) / 2));
		padding: 0 15px 0 15px;
		justify-content: space-between;
	}

	.list-item {
		/* 两列宽度分配比例 */
		margin-bottom: 10px;
		/* 列表项间距 */
		background: white;
		border-radius: 30px;
		/* 背景色 */
		padding: 15px;
		/* 内边距 */
		box-sizing: border-box;
		/* 盒模型 */
	}


	.list_item_bg {
		display: flex;
		flex-direction: column;
	}

	.active {
		border: 2px solid #3298F7;
		color: #3298F7;
	}

	.button_bg_view {
		background: white;
		width: 100vw;
		height: 100px;
		display: flex;
		position: fixed;
		bottom: 0;
		flex-direction: column;
		padding-top: 20px;
		padding-bottom: 25px;
	}

	.button_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80vw;
		color: white;
		background: #DBDBDB;
		border-radius: 30px;
	}
</style>