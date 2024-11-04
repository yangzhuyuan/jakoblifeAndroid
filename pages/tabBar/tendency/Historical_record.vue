<template>
	<view>
		<view v-if="listdat">
			<movable-area style="width: 90vw;height: 100px; padding-top: 20px;" v-for="(item,index) in swipeList"
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
							<image src="../../../static/icons/3.png" class="img_iocn_bg" />
							<view style="margin-top: 10px;">{{item.time}}</view>
						</view>
						<view>
							<view
								style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
								<view class="title_type_bg">
									<view class="xueya_type" :style="bg(item.lately_Blood_pressure)" />
									<view class="title_font_bg">{{item.lately_Blood_pressure}}</view>
									<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
								</view>
								<view style="margin-right: 10px; color: gray;">{{item.xinghao}}</view>

							</view>
							<view class="border_bg" />
							<view style="display: flex; flex-direction: row;">
								<view style="text-align: center;">
									<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
									<view class="text_item_bg_1">{{item.lately_Diastolic_blood_pressure}}</view>
								</view>
								<view style="text-align: center;">
									<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
									<view class="text_item_bg_1">{{item.lately_Systolic_blood_pressure}}</view>
								</view>
								<view style="text-align: center;">
									<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
									<view class="text_item_bg_1">{{item.lately_pulse}}</view>
								</view>
							</view>
						</view>
					</view>
				</movable-view>
			</movable-area>
		</view>
		<view v-else style="display: flex;justify-content: center;padding-top: 50px;">
			{{$t('qushiitem.title_16')}}
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
				swipeList: [{
					x: '',
					id: 0,
					time: "10:20",
					xinghao: 'JL-BP67G',
					xueya: 0,
					lately_Blood_pressure: "正常血压",
					lately_Systolic_blood_pressure: "220",
					lately_Diastolic_blood_pressure: "230",
					lately_pulse: "80",
				}, {
					x: '',
					id: 1,
					time: "11:20",
					xueya: 1,
					xinghao: 'JL-BP67G',
					lately_Blood_pressure: "一级高压",
					lately_Systolic_blood_pressure: "220",
					lately_Diastolic_blood_pressure: "230",
					lately_pulse: "80",
				}, {
					x: '',
					id: 2,
					time: "13:20",
					xueya: 3,
					xinghao: 'JL-BP67G',
					lately_Blood_pressure: "二级高压",
					lately_Systolic_blood_pressure: "220",
					lately_Diastolic_blood_pressure: "230",
					lately_pulse: "80",
				}, {
					x: '',
					id: 3,
					time: "13:25",
					xueya: 3,
					xinghao: 'JL-BP67G',
					lately_Blood_pressure: "二级高压",
					lately_Systolic_blood_pressure: "220",
					lately_Diastolic_blood_pressure: "230",
					lately_pulse: "80",
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
			this.swipeList = []
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

			if (this.swipeList == "" || this.swipeList == undefined) {
				this.listdat = false
			} else {
				this.listdat = true
			}

			//没次回到页面都会调用下拉刷新
			// uni.startPullDownRefresh()
		},
		onLoad() { //页面最开始调用
			this.bg()
			// uni.startPullDownRefresh()
		},



		methods: {

			tap(e, index) {
				uni.showModal({
					title: this.$t('qushiitem.title_19'),
					content: this.$t('qushiitem.title_20'),
					success: res => {
						if (res.confirm) {
							this.swipeList.splice(index, 1)
							this.swipeList[index].x = e.detail.x
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			onChange(e, index) {
				console.log("aaa", e)
				console.log("aa1a", index)
				this.swipeList.forEach((item, index) => {
					this.swipeList[index].x = 0
				})
				this.swipeList[index].x = e.detail.x

			},


			bg(bg) {
				if (bg == "正常血压") {
					return {
						background: "#58BF78"
					}
				} else if (bg == "一级高血压") {
					return {
						background: "#FCCD41"
					}
				} else {
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

	.time_text {
		background: #0686CC;
		width: 60px;
		text-align: center;
		padding: 5px;
		color: white;
		border-top-left-radius: 25px;
		border-bottom-right-radius: 25px;
	}

	.text_item_bg {
		font-size: 12px;
		margin-left: 20px;
		margin-right: 1px;
		color: gray;
		width: 70px;
		margin-top: 5px;
		white-space: nowrap;
		overflow: auto;
	}

	.text_item_bg_1 {
		font-size: 16px;
		margin-left: 20px;
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

	.icon_item_bg_1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 5px;
	}

	.img_iocn_bg {
		width: 40px;
		height: 40px;
	}

	.title_type_bg {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 15px;
	}

	.xueya_type {
		width: 15px;
		height: 15px;
		border-radius: 10px;
		background: #258C41;
		margin-left: 10px;
	}

	.border_bg {
		margin: 5px 10px 0 20px;
		background: gainsboro;
		width: 65vw;
		height: 1px;
	}

	.title_font_bg {
		margin-left: 5px;
		font-weight: bold
	}
</style>