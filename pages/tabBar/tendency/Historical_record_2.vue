<template>
	<view>
		<view v-if="listdat">
			<movable-area style="width: 90vw;height: 100px; padding-top: 20px;" v-for="(item,index) in list"
				:key="index">
				<view class="icon_item_bg_1s">
					<text @tap="tap($event, index)"
						style="width: 15px;line-height: 18px; display: flex;flex-direction: row;writing-mode: vertical-lr;text-orientation: upright;margin-right: 10px;">
						{{$t('qushiitem.title_18')}}
					</text>
				</view>
				<movable-view :x="item.x" :y="item.y" @change="onChange($event,index)" :animation='false'
					style=" width: 100vw;height: auto;padding-top: 20px;" direction="horizontal">
					<view class="icon_item_bg">
						<view class="icon_item_bg_1">
							<image src="../../../static/icons/6.png" class="img_iocn_bg" />
							<view style="margin-top: 10px;text-align: center;line-height: 15px;">
								{{item.date_time}}
							</view>
						</view>
						<view>
							<view
								style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
								<view class="title_type_bg">
									<view class="xueya_type" :style="bg(item.Normalweight)" />
									<view class="title_font_bg">{{item.Normalweight}}</view>
									<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
								</view>
								<view style="margin-right: 10px; color: gray;">{{item.xinghao}}</view>

							</view>
							<view class="border_bg" />
							<view class="title_all_bg">
								<view>
									<view class="text_item_bg">{{$t('zhuceitem.title_6')}}/kg</view>
									<view class="text_item_bg_1">{{item.weight}}</view>
								</view>
								<view>
									<view class="text_item_bg">IBM</view>
									<view class="text_item_bg_1">{{item.ibm}}</view>
								</view>
								<view>
									<view class="text_item_bg"></view>
									<view class="text_item_bg_2">{{item.date_date}}</view>
								</view>
							</view>
						</view>
					</view>
				</movable-view>

			</movable-area>
		</view>
		<view v-else style="display: flex; flex-direction: column; align-items: center;padding-top: 80px;">
			<text>-</text>
			<text>{{$t('qushiitem.title_16')}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listdat: false,
				total: null, //总共多少条数据
				formData: {
					pageSize: 10, //每页10条数据
					page: 1, //第几页
				},
				list: [{
					x: 0,
					xinghao: 'JL-BP67G',
					date_time: '-',
					Normalweight: '-',
					weight: '-',
					ibm: '-',
					date_date: '-'
				}, {
					x: 0,
					xinghao: 'JL-BP67G2',
					date_time: '-',
					weight: '-',
					ibm: '-',
					lately_Systolic_blood_pressure: '-',
					date_date: '-'
				}, {
					x: 0,
					xinghao: 'JL-BP67G',
					date_time: '-',
					Normalweight: '-',
					weight: '-',
					ibm: '-',
					date_date: '-'
				}, {
					x: 0,
					xinghao: 'JL-BP67G',
					date_time: '-',
					Normalweight: '-',
					weight: '100',
					ibm: '100',
					date_date: '2024.9.24'
				}]

			}
		},
		onReachBottom() {
			let allTotal = this.formData.page * this.formData.pageSize
			if (allTotal < this.total) {
				//当前条数小于总条数 则增加请求页数
				this.page++;
				this.getData() //调用加载数据方法
			} else {
				// console.log('已加载全部数据')
			}
		},

		onPullDownRefresh() {
			this.list = []
			//调用获取数据方法
			this.getData()
			setTimeout(() => {
				//结束下拉刷新
				uni.stopPullDownRefresh();
			}, 1000);
		},


		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('qushiitem.title_17')
			})
			if (this.list == "" || this.list == undefined) {
				this.listdat = false
			} else {
				this.listdat = true
			}

			//没次回到页面都会调用下拉刷新
			// uni.startPullDownRefresh()
		},
		onLoad() { //页面最开始调用
			// uni.startPullDownRefresh()
		},

		methods: {
			tap(e, index) {
				uni.showModal({
					title: this.$t('qushiitem.title_19'),
					content: this.$t('qushiitem.title_20'),
					success: res => {
						if (res.confirm) {
							this.list.splice(index, 1)
							this.list[index].x = e.detail.x
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			onChange(e, index) {
				console.log("aaa", e)
				console.log("aa1a", index)
				this.list.forEach((item, index) => {
					this.list[index].x = 0
				})
				this.list[index].x = e.detail.x
			},


			bg(bg) {
				if (bg === this.$t('qushiitem.title_7')) {
					return {
						background: "#58BF78"
					}
				} else if (bg === this.$t('qushiitem.title_8')) {
					return {
						background: "#FCCD41"
					}
				} else if (bg === this.$t('qushiitem.title_9')) {
					return {
						background: "#F55A5A"
					}
				}
			},
		}
	}
</script>

<style>
	.icon_item_bg_1s {
		width: 90vw;
		height: 90px;
		border: 1px solid white;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-direction: row;
		margin: 0 10px 0 10px;
		padding: 10px 10px 5px 5px;
		border-radius: 20px;
		background: red;
		color: white;
	}

	.icon_item_bg {
		display: flex;
		height: 87px;
		flex-direction: row;
		margin: 0 10px 0 10px;
		padding: 10px 5px 10px 5px;
		background: white;
		border-radius: 20px;
	}

	.icon_item_bg_toast {
		text-align: center;
		margin: 20px 10px 10px 10px;
		color: #3298F7;
		padding: 15px 0 15px 0;
		background: white;
		border-radius: 15px;
	}

	.icon_item_bg_1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 5px;
	}

	.title_type_bg {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 15px;
	}

	.border_bg {
		margin: 5px 10px 0 20px;
		background: gainsboro;
		width: 65vw;
		height: 1px;
	}

	.img_iocn_bg {
		width: 40px;
		height: 40px;
	}

	.xueya_type {
		width: 15px;
		height: 15px;
		border-radius: 10px;
		background: #258C41;
		margin-left: 10px;
	}

	.title_font_bg {
		margin-left: 5px;
		font-weight: bold
	}

	.text_item_bg {
		font-size: 12px;
		margin-left: 10px;
		margin-right: 10px;
		color: gray;
		width: 60px;
		margin-top: 5px;
		white-space: nowrap;
		overflow: auto;

	}

	.text_item_bg_1 {
		font-size: 16px;
		margin-left: 10px;
	}

	.text_item_bg_2 {
		font-size: 16px;
		margin-left: 10px;
		color: gray;
		margin-top: 20px;
	}


	.title_all_bg {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 10px;
		margin-right: 10px;
	}
</style>