<template>
	<view style="color: black;height: 100vh;background: #EFEFF4;">
		<view style=" padding-top: 20px;padding-bottom: 60px; ">
			<view class="gongxiangstyle">
				<view style="display: flex; align-items: center;  flex-direction: column;">
					<image :src="avatar"
						style="width: 85px; height: 85px;border-radius: 100px;border: 1px solid gainsboro;"></image>
					<view style="margin-top: 10px;font-weight: 600; font-size: 16px;">{{name}}</view>
					<view style="font-weight: 400; font-size: 16px;color: #999999;margin-top: 10px;">{{phone}}</view>
				</view>
				<view
					style="display: flex; align-items: left; flex-direction: column; padding-left: 15px;margin-top: 20px;">
					<view style="margin-top: 10px;font-weight: 600; font-size: 16px;text-align: center;color: #1A1A1A;">
						{{$t('您将与')}} {{name}} {{$t('共享以下健康数据')}}
					</view>
					<view style="font-size: 13px; margin-top: 10px; font-weight: 400; color: #999999;">
						{{$t('您将与')}}
						{{name}}（{{phone}}）{{$t('共享以下健康数据')}}{{$t('您始终可以更改共享或停止共享')}}
					</view>
				</view>
				<view style="border-radius: 15px; margin-top: 20px;">
					<view style="display: flex;flex-direction: row; align-items: center;height: 56px;"
						@click="lowPressure()">
						<view style="width: 90%; margin: 10px; font-size: 16px;font-weight: 400;">
							{{$t('舒张压')}}
						</view>
						<uni-icons v-show="lowPressure_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center;height: 56px;"
						@click="highPressure()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('收缩压')}}
						</view>
						<uni-icons v-show="highPressure_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="heartrate()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('脉搏')}}
						</view>
						<uni-icons v-show="heartrate_show" type="checkmarkempty" size="16"></uni-icons>
					</view>

					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="xueyang()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('血氧')}}
						</view>
						<uni-icons v-show="xueyang_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;" @click="yali()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('压力')}}
						</view>
						<uni-icons v-show="yali_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="tiwen()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('体温')}}
						</view>
						<uni-icons v-show="tiwen_show" type="checkmarkempty" size="16"></uni-icons>
					</view>


					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="start_weight()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('初始体重')}}
						</view>
						<uni-icons v-show="start_weight_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="goal_weight()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('目标体重')}}
						</view>
						<uni-icons v-show="goal_weight_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="Width()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('体重')}}
						</view>
						<uni-icons v-show="Width_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="Height()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('身高')}}
						</view>
						<uni-icons v-show="Height_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="chest_circumference()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('胸围')}}
						</view>
						<uni-icons v-show="chest_circumference_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>

					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="waistline()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('腰围')}}
						</view>
						<uni-icons v-show="waistline_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="hipline()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('臀围')}}
						</view>
						<uni-icons v-show="hipline_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="biceps_circumference()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('上臂围')}}
						</view>
						<uni-icons v-show="biceps_circumference_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="thigh_circumference()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('大腿围')}}
						</view>
						<uni-icons v-show="thigh_circumference_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;"
						@click="calf_circumference()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							{{$t('小腿围')}}
						</view>
						<uni-icons v-show="calf_circumference_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; align-items: center; height: 56px;" @click="BMI()">
						<view style="width: 90%; margin: 10px;font-size: 16px;font-weight: 400;">
							BMI
						</view>
						<uni-icons v-show="BMI_show" type="checkmarkempty" size="16"></uni-icons>
					</view>

				</view>
				<view :style="getbk1(action)" class="check_bg">
					<checkbox style="font-size: 12px; font-weight: 400;" color="#ffffff" class="round"
						activeBorderColor="#D2D2D2" activeBackgroundColor="#3298F7" :checked="cb" @click="checked()">
						{{$t('全选')}}
					</checkbox>
				</view>
			</view>
			<button plain="true" @tap="next()" class="btn_backgroud" :style="getbk(action)">{{$t('共享')}}</button>

		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: {
			...mapState(['info']),
		},
		data() {
			return {
				avatar: '../../../static/icons/80x80.png',
				name: "小明",
				phone: "12",
				lowPressure_show: false,
				highPressure_show: false,
				heartrate_show: false,

				xueyang_show: false,
				yali_show: false,
				tiwen_show: false,

				start_weight_show: false,
				goal_weight_show: false,
				Width_show: false,
				Height_show: false,
				chest_circumference_show: false,
				waistline_show: false,
				hipline_show: false,
				biceps_circumference_show: false,
				thigh_circumference_show: false,
				calf_circumference_show: false,
				BMI_show: false,
				cb: false,
				action: ['0'],
				receiverId: ''
			}
		},

		onLoad(res) {
			this.name = res.NAME
			this.phone = res.PHONE
			this.avatar = res.AVATAR
			this.receiverId = res.receiverId
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("共享给")
			})
		},

		methods: {
			lowPressure() {
				if (this.lowPressure_show == true) {
					this.lowPressure_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.lowPressure_show = true
					this.action.push('lowPressure')
				}
			},
			highPressure() {
				if (this.highPressure_show == true) {
					this.highPressure_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.highPressure_show = true
					this.action.push("highPressure")
				}
			},
			heartrate() {
				if (this.heartrate_show == true) {
					this.heartrate_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.heartrate_show = true
					this.action.push("heartrate")
				}
			},

			xueyang() {
				if (this.xueyang_show == true) {
					this.xueyang_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.xueyang_show = true
					this.action.push("oxygen")
				}
			},
			yali() {
				if (this.yali_show == true) {
					this.yali_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.yali_show = true
					this.action.push("pressure")
				}
			},
			tiwen() {
				if (this.tiwen_show == true) {
					this.tiwen_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.tiwen_show = true
					this.action.push("temperature")
				}
			},


			start_weight() {
				if (this.start_weight_show == true) {
					this.start_weight_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.start_weight_show = true
					this.action.push("start_weight")
				}
			},
			Width() {
				if (this.Width_show == true) {
					this.Width_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Width_show = true
					this.action.push("weight")
				}
			},
			goal_weight() {
				if (this.goal_weight_show == true) {
					this.goal_weight_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.goal_weight_show = true
					this.action.push("goal_weight")
				}
			},
			Height() {
				if (this.Height_show == true) {
					this.Height_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Height_show = true
					this.action.push("height")
				}
			},
			chest_circumference() {
				if (this.chest_circumference_show == true) {
					this.chest_circumference_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.chest_circumference_show = true
					this.action.push("chest_circumference")
				}
			},
			waistline() {
				if (this.waistline_show == true) {
					this.waistline_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.waistline_show = true
					this.action.push("waistline")
				}
			},
			hipline() {
				if (this.hipline_show == true) {
					this.hipline_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.hipline_show = true
					this.action.push("hipline")
				}
			},
			biceps_circumference() {
				if (this.biceps_circumference_show == true) {
					this.biceps_circumference_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.biceps_circumference_show = true
					this.action.push("biceps_circumference")
				}
			},
			thigh_circumference() {
				if (this.thigh_circumference_show == true) {
					this.thigh_circumference_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.thigh_circumference_show = true
					this.action.push("thigh_circumference")
				}
			},
			calf_circumference() {
				if (this.calf_circumference_show == true) {
					this.calf_circumference_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.calf_circumference_show = true
					this.action.push("calf_circumference")
				}
			},
			BMI() {
				if (this.BMI_show == true) {
					this.BMI_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.BMI_show = true
					this.action.push("bmi")
				}
			},

			checked() {
				let that = this
				if (that.cb == true) {
					that.cb = false
					that.lowPressure_show = false
					that.highPressure_show = false
					that.heartrate_show = false

					that.xueyang_show = false
					that.yali_show = false
					that.tiwen_show = false

					that.start_weight_show = false
					that.Width_show = false
					that.goal_weight_show = false
					that.Height_show = false
					that.chest_circumference_show = false
					that.waistline_show = false
					that.hipline_show = false
					that.biceps_circumference_show = false
					that.thigh_circumference_show = false
					that.calf_circumference_show = false
					that.BMI_show = false
					that.action = ['0']
				} else {
					that.cb = true
					that.lowPressure_show = true
					that.highPressure_show = true
					that.heartrate_show = true
					that.xueyang_show = true
					that.yali_show = true
					that.tiwen_show = true
					that.start_weight_show = true
					that.goal_weight_show = true
					that.Width_show = true
					that.Height_show = true
					that.chest_circumference_show = true
					that.waistline_show = true
					that.hipline_show = true
					that.biceps_circumference_show = true
					that.thigh_circumference_show = true
					that.calf_circumference_show = true
					that.BMI_show = true
					that.action = ['0', 'lowPressure', 'highPressure', 'heartrate', 'start_weight', 'goal_weight',
						'weight ', 'height ', 'chest_circumference', 'waistline_show', 'hipline',
						'biceps_circumference', 'thigh_circumference', 'calf_circumference', 'bmi', 'oxygen',
						'pressure', 'temperature'
					]

				}
			},


			getbk(id) {
				return {
					background: id.join() === '' || id.join() === '0' ? '#DBDBDB' : '#3298F7'
				}
			},

			getbk1(id) {
				if (id.length === 15) {
					this.cb = true
				}
			},

			next() {
				if (this.action.join() === '' || this.action.join() == '0') {
					uni.showToast({
						title: this.$t('请选择要共享的数据'),
						icon: 'none'
					})
					return
				}
				this.req(this.action.join().replace('0,', ''))
			},
			//发起数据分享请求
			req(dataPointIds) {
				let that = this
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/share/data/req",
					method: "POST",
					data: {
						sharerId: that.info.userId,
						receiverId: that.receiverId,
						dataPointIds: [dataPointIds]
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(req) {
						uni.navigateTo({
							url: "../share/Shared_success?NAME=" + that.name
						})
					}
				})
			}
		}
	}
</script>

<style>
	.btn_backgroud {
		width: auto;
		background: #3298F7;
		color: white !important;
		border-radius: 40px;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		font-weight: 600;
		border: none !important;
		margin: 60px 20px 20px 20px
	}

	.check_bg {
		flex-direction: row;
		display: flex;
		justify-content: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.gongxiangstyle {
		background: white;
		width: auto;
		margin-left: 20px;
		margin-right: 20px;
		border-radius: 20px;
		padding: 40px 20px 20px 20px;
	}
</style>