<template>
	<view>
		<view style="background: #F7F7F7; padding-bottom: 20px;">
			<view style=" padding-top: 10px;">
				<view v-if="share_show"
					style="background: white; margin: 0 10px 0 10px; padding: 10px; border-radius: 20px;">
					<view style=" display: flex; justify-content: center; margin: 10px 0 10px 0;">
						<view class="swich_bg_0">
							<view @click="clicked1()">
								<view v-if="show1" class="swich_bg">{{$t('gongxiangitem.title_0')}}</view>
								<view v-else class="swich_bg_1">{{$t('gongxiangitem.title_0')}}</view>
							</view>
							<view @click="clicked2()">
								<view v-if="show2" class="swich_bg_1">{{$t('gongxiangitem.title_1')}}</view>
								<view v-else class="swich_bg">{{$t('gongxiangitem.title_1')}}</view>
							</view>
						</view>
					</view>
					<view v-if="show1">
						<view
							style="text-align: center; color: gray;margin-top: 30px;font-weight: bold; font-size: 16px;">
							{{$t('gongxiangitem.title_2')}}
						</view>
						<view
							style="text-align: center; color: black;margin-top: 30px;font-weight: bold; font-size: 18px;">
							{{$t('gongxiangitem.title_3')}}
						</view>
						<view
							style="display: flex; align-items: left; flex-direction: column; padding-left: 15px;margin-top: 20px;">
							<text
								style="margin-top: 10px;font-weight: bold; font-size: 16px;">{{$t('gongxiangitem.title_4')}}</text>
							<text style="font-size: 14px;">{{$t('gongxiangitem.title_5')}}</text>
							<text
								style="margin-top: 15px;font-weight: bold; font-size: 16px;">{{$t('gongxiangitem.title_6')}}</text>
							<text style="mfont-size: 14px;">{{$t('gongxiangitem.title_7')}}</text>
							<text
								style="margin-top: 10px;font-weight: bold; font-size: 16px;">{{$t('gongxiangitem.title_8')}}</text>
							<text style="font-size: 14px;">{{$t('gongxiangitem.title_9')}}</text>
							<view style="display:flex;flex-direction: column;align-items: left;margin-top: 30px;">
								<view>
									<image src="../../../static/icons/warning.png" style="width: 25px;height: 25px;">
									</image>
									<text
										style="margin-left: 5px; font-size: 14px;">{{$t('gongxiangitem.title_10')}}</text>
								</view>
							</view>
						</view>
						<button @tap="Share_with_others()"
							style="background: #3298F7;width: 200px; color: white;border-radius: 40px; margin-top: 40px; margin-bottom: 20px;">{{$t('gongxiangitem.title_0')}}</button>
					</view>
					<view v-else style="height: 72vh;">
						<view style="display: flex;flex-direction: column; align-items: center;margin-top: 30px;">
							<image src="../../../static/icons/60x60.png"
								style="width: 60px; height: 60px; border: 1px gainsboro solid;border-radius: 30px;" />
							<view style="margin-top: 20px;">-</view>
							<view style="margin-top: 20px;">-</view>
							<view
								style="text-align: center; margin-top: 20px;color: black;font-weight: bold;font-size: 16px;">
								{{$t('gongxiangitem.title_15')}}
							</view>
						</view>
					</view>
				</view>


				<view v-else style="background: white; margin: 0 10px 0 10px; padding: 10px; border-radius: 20px;">
					<view style=" display: flex; justify-content: center; margin: 10px 0 10px 0;">
						<view class="swich_bg_0">
							<view @click="clicked1()">
								<view v-if="show1" class="swich_bg">{{$t('gongxiangitem.title_0')}}</view>
								<view v-else class="swich_bg_1">{{$t('gongxiangitem.title_0')}}</view>
							</view>
							<view @click="clicked2()">
								<view v-if="show2" class="swich_bg_1">{{$t('gongxiangitem.title_1')}}</view>
								<view v-else class="swich_bg">{{$t('gongxiangitem.title_1')}}</view>
							</view>
						</view>
					</view>
					<swiper class="swiper" indicator-active-color='#3298F7' :indicator-dots="indicatorDots"
						:autoplay="autoplay">
						<swiper-item v-for="(item,index) in swiperlist" :key="index">
							<scroll-view scroll-y="true" class="scroll-Ys_1" @scrolltolower="lower">
								<view style="margin-top: 20px;">
									<view style="display: flex; align-items: center; flex-direction: column;">
										<view style="display: inline-block;">
											<image :src="item.avatar"
												style="display: flex;width: 80px; height: 80px;border-radius: 40px;border: 1px solid gainsboro;">
											</image>
										</view>
										<text
											style="font-weight: bold; font-size: 18px;margin-top: 10px;">{{item.name}}</text>
										<text style="margin-top: 10px;">{{item.phone}}</text>
									</view>
									<view
										style="display: flex; align-items: center; flex-direction: column; padding-left: 15px;margin-top: 20px;">
										<view v-if="show1 == true">
											<view
												style="margin-top: 10px;font-weight: bold; font-size: 16px;text-align: center;">
												{{$t('gongxiangitem.title_16')}}{{item.name}}{{$t('gongxiangitem.title_17')}}
											</view>
										</view>
										<view v-else>
											<view
												style="margin-top: 10px;font-weight: bold; font-size: 16px;color: black;text-align: center;">
												{{item.name}} {{$t('gongxiangitem.title_18')}}
											</view>
										</view>
										<view
											style="font-size: 12px;color: gray; margin-top: 5px; margin-bottom: 10px;">
											{{$t('gongxiangitem.title_19')}}
										</view>
									</view>

									<view style="display: flex;flex-direction: row; padding: 10px;">
										<view style="font-weight: bold;width: 65vw;font-size: 16px;">
											{{$t('gongxiangitem.title_23')}}
										</view>
										<view
											style="width: 20vw;color: gray; font-size: 16px;text-align: right;margin-right: 5px;">
											{{item.Diastolic_blood_pressure}}mmHg
										</view>
										<uni-icons type="right" size="16"></uni-icons>
									</view>
									<view style="background: gainsboro; height: 1px; width: 100vw;" />
									<view style="display: flex;flex-direction: row; padding: 10px;">
										<view style="font-weight: bold;width: 65vw;font-size: 16px;">
											{{$t('gongxiangitem.title_24')}}
										</view>
										<view style="width: 20vw;font-size: 16px;text-align: right;color: gray;">
											{{item.Systolic_blood_pressure}}mmHg
										</view>
										<uni-icons type="right" size="16"></uni-icons>
									</view>
									<view style="background: gainsboro; height: 1px; width: 100vw;" />
									<view style="display: flex;flex-direction: row; padding: 10px;">
										<view style="font-weight: bold;width: 65vw;font-size: 16px;">
											{{$t('gongxiangitem.title_25')}}
										</view>
										<view style="width: 20vw;font-size: 16px;text-align: right; color: gray;">
											{{item.Pulse_rate}}BMP
										</view>
										<uni-icons type="right" size="16"></uni-icons>
									</view>

									<!-- 				<scroll-view scroll-y="true" class="scroll-Ys" @scrolltolower="lower">
										<view
											style="display: flex;flex-direction: row;margin-top: 15px;margin-right: 15px;">
											<view style="width: 60%;font-weight: bold;">步数</view>
											<view style="width: 30%;font-size: 18px;text-align: right;">
												{{item.Step_number}}
											</view>
											<view style="width: 10%; text-align: right;color: gray;">步数</view>
										</view>
										<view style="background: gainsboro; height: 1px; width: 96%;margin-top: 5px;">
										</view>
										<view
											style="display: flex;flex-direction: row;margin-top: 15px; margin-right: 15px;">
											<view style="width: 60%;font-weight: bold;">睡眠</view>
											<view
												style="width:40%;display: flex;flex-direction: row;text-align: right;">
												<view style="width: 25%; font-size: 18px;text-align: right;">
													{{item.Sleep_Hour}}
												</view>
												<view style="width: 25%; color: gray;">小时</view>
												<view style="width: 25%; font-size: 18px; text-align: right;">
													{{item.Sleep_minute}}
												</view>
												<view style="width: 25%; color: gray;">分钟</view>
											</view>
										</view>
										<view style="background: gainsboro; height: 1px; width: 96%;margin-top: 5px;">
										</view>
										<view
											style="display: flex;flex-direction: row;margin-top: 15px; margin-right: 15px;">
											<view style="width: 15%;font-weight: bold;">血压</view>
											<view
												style="width: 85%; margin-left:20px; display: flex;flex-direction: row;justify-content: flex-end;">
												<view
													style="display: flex; flex-direction: column; align-items: center;">
													<view style="font-size: 10px;transform: scale(0.8);color: gray;">
														舒张压mmHg</view>
													<view style=" font-size: 18px;">
														{{item.Blood_pressure}}
													</view>
												</view>
												<view
													style="display: flex; flex-direction: column; align-items: center;">
													<text
														style="font-size: 10px;transform: scale(0.8);color: gray;">收缩压mmHg</text>
													<view style=" font-size: 18px;">
														{{item.Blood_pressure}}
													</view>
												</view>
												<view
													style="display: flex; flex-direction: column; align-items: center;">
													<view style="font-size: 10px;transform: scale(0.8);color: gray;">
														脉搏BMP</view>
													<view style="font-size: 18px;">
														{{item.Blood_pressure}}
													</view>
												</view>
											</view>
										</view>
										<view style="background: gainsboro; height: 1px; width: 96%;margin-top: 5px;">
										</view>
										<view
											style="display: flex;flex-direction: row;margin-top: 15px;margin-right: 15px;">
											<view style="width: 60%; font-weight: bold;">心率</view>
											<view style="width: 25%;font-size: 18px;text-align: right;">
												{{item.Heart_rate}}
											</view>
											<view style="width: 15%; text-align: right;color: gray;">次/分</view>
										</view>
										<view style="background: gainsboro; height: 1px; width: 96%;margin-top: 5px;">
										</view>
										<view
											style="display: flex;flex-direction: row;margin-top: 15px;margin-right: 15px;">
											<view style="width: 60%;font-weight: bold;">血氧</view>
											<view style="width: 35%;font-size: 18px;text-align: right;">
												{{item.Blood_oxygen}}
											</view>
											<view style="width: 5%; text-align: right; color: gray;">%</view>
										</view>
										<view style="background: gainsboro; height: 1px; width: 96%;margin-top: 5px;">
										</view>
									</scroll-view>
 -->

									<button @click="EDITOR(item.avatar, item.name,item.phone,)"
										style="background: #3298F7;color: white;width: 50vw; border-radius: 40px; margin-top: 50px; ">{{$t('gongxiangitem.title_31')}}</button>

								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				share_show: false,
				show1: true,
				show2: true,
				swiperlist: [{
						avatar: "../../../static/icons/60x60.png",
						name: "小明",
						phone: "1234",
						Step_number: "2000",
						Sleep_Hour: "5",
						Sleep_minute: "20",
						Blood_pressure: "120",
						Heart_rate: "72",
						Blood_oxygen: "92",

						Diastolic_blood_pressure: '100',
						Systolic_blood_pressure: '80',
						Pulse_rate: '70'
					},
					{
						avatar: "",
						name: "b",
						phone: "1234",
						Step_number: "3000",
						Sleep_Hour: "15",
						Sleep_minute: "36",
						Blood_pressure: "126",
						Heart_rate: "76",
						Blood_oxygen: "94",

						Diastolic_blood_pressure: '122',
						Systolic_blood_pressure: '90',
						Pulse_rate: '80'
					},
					{
						avatar: "",
						name: "c",
						phone: "1234",
						Step_number: "1500",
						Sleep_Hour: "12",
						Sleep_minute: "26",
						Blood_pressure: "118",
						Heart_rate: "78",
						Blood_oxygen: "98",

						Diastolic_blood_pressure: '118',
						Systolic_blood_pressure: '78',
						Pulse_rate: '86'
					}
				],
				indicatorDots: true,
				autoplay: false,
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('gongxiang')
			})
		},

		onNavigationBarButtonTap(res) {
			console.log(res)
			if (res.float === "left") {
				console.log("11111")
			} else {
				uni.navigateTo({
					url: '../share/Shared_list'
				})
				console.log("2222")
			}


		},

		methods: {
			Share_with_others() {
				uni.navigateTo({
					url: "./Share_with_3"
				})
			},

			//与他人共享
			clicked1() {
				this.show1 = true
				this.show2 = true
			},
			EDITOR(avatar, name, phone) {
				if (this.show1 == true) {
					console.log("这里是1")
					uni.navigateTo({
						url: "./Share_with_2?AVATAR=" + avatar + "&NAME=" + name + "&PHONE=" + phone + "&typeid=0"
					})
				} else {
					console.log("这里是2")
					uni.navigateTo({
						url: "./Share_with_2?AVATAR=" + avatar + "&NAME=" + name + "&PHONE=" + phone + "&typeid=1"
					})
				}


			},

			//他人与我共享
			clicked2() {
				this.show1 = false
				this.show2 = false
			},




		}
	};
</script>

<style>
	.swich_bg_0 {
		display: flex;
		flex-direction: row;
		height: 30px;
		padding: 3px;
		width: 280px;
		background: #3298F7;
		border-radius: 20px
	}

	.swich_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: black;
		width: 140px;
		line-height: 15px;
		height: 30px;
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
		height: 30px;
	}

	.popup_bg {
		height: 500px;
		background: white;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		padding: 10px;
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 50px;
	}

	.list {
		&>view {
			padding: 20rpx;

			&+view {
				border-top: #e5e5e5 solid 1px;
			}
		}
	}

	.scroll-Y {
		height: 400px;
	}


	.swiper {
		height: 72vh;
	}

	.scroll-Ys {
		height: 30vh;
	}

	.scroll-Ys_1 {
		height: 70vh;
	}
</style>