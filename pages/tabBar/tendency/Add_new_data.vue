<template>
	<view style="padding: 10px;">
		<view style="padding: 10px;border-radius: 20px;background: white;">
			<view style="font-weight: bold;margin-left: 10px;">日期和时间</view>
			<picker-view v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange"
				class="picker-view">
				<picker-view-column class="view-column second">
					<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in hours" :key="index">{{item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in minutes" :key="index">{{item}}分</view>
				</picker-view-column>
			</picker-view>
		</view>

		<view style="padding: 10px;border-radius: 20px;background: white; margin-top: 20px;">
			<view style="display: flex; flex-direction: row; margin-left: 10px;width: 100%;">
				<view>
					<view>收缩压</view>
					<view style="color: gray;font-size: 12px;">mmHg</view>
				</view>
				<view style="margin-left: 28%;">
					<view>收缩压</view>
					<view style="color: gray;font-size: 12px;">mmHg</view>
				</view>
				<view style="margin-left: 30%;">
					<view>收缩压</view>
					<view style="color: gray;font-size: 12px;text-align: center;">BMI</view>
				</view>
			</view>
			<picker-view v-if="visible1" :indicator-style="indicatorStyle1" :value="value1" @change="bindChange1"
				class="picker-view">
				<picker-view-column class="view-column second">
					<view class="item" v-for="(item,index) in years1" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in months1" :key="index">{{item}}月</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in days1" :key="index">{{item}}日</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in hours1" :key="index">{{item}}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in minutes1" :key="index">{{item}}分</view>
				</picker-view-column>
			</picker-view>



			<view style="margin-top: 10px; width: 100%; height: 1px; background: gainsboro;"></view>
			<view
				style="margin-top: 20px;display: flex;justify-content: center;flex-direction: row;align-items: center;">
				<view style="border-radius: 15px; height: 15px; width: 15px;background: #258C41;"></view>
				<view style="margin-left: 10px;font-size: 18px;font-weight: bold;">正常血压</view>
			</view>
			<view
				style="color: gray; margin-top: 5px;display: flex;justify-content: center;flex-direction: row;align-items: center;">
				收缩压130以下，舒张压85以下</view>
			<view style="display: flex;flex-direction: row;justify-content: center;">
				<view style="display: flex;align-items: center;flex-direction: column;">
					<image v-if="Blood_pressure_show_1" src="../../../static/dowm.png"
						style="height: 20px;width: 20px;"></image>
					<view v-else style="height: 20px;width: 20px;">
					</view>
					<view style="width: 50px;background: #258C41;height: 15px;border-radius: 5px;"></view>
				</view>
				<view style="display: flex;align-items: center;flex-direction: column; margin-left: 5px;">
					<image v-if="Blood_pressure_show_2" src="../../../static/dowm.png"
						style="height: 20px;width: 20px;"></image>
					<view v-else style="height: 20px;width: 20px;">
					</view>
					<view style="width: 50px;background: #5CA436;height: 15px;border-radius: 5px;"></view>
				</view>
				<view style="display: flex;align-items: center;flex-direction: column; margin-left: 5px;">
					<image v-if="Blood_pressure_show_3" src="../../../static/dowm.png"
						style="height: 20px;width: 20px;"></image>
					<view v-else style="height: 20px;width: 20px;">
					</view>
					<view style="width: 50px;background: #DBC92E;height: 15px;border-radius: 5px;"></view>
				</view>
				<view style="display: flex;align-items: center;flex-direction: column; margin-left: 5px;">
					<image v-if="Blood_pressure_show_4" src="../../../static/dowm.png"
						style="height: 20px;width: 20px;"></image>
					<view v-else style="height: 20px;width: 20px;">
					</view>
					<view style="width: 50px;background: #C91A1D;height: 15px;border-radius: 5px;"></view>
				</view>
			</view>
			<view style="text-align: center;margin-top: 10px; padding-bottom: 20px;">您的血压状态非常良好，请继续保持保持哦</view>
		</view>

		<button
			style=" margin-top: 80rpx; margin-left: 40rpx;margin-right: 40rpx;background:skyblue; color: white; border-radius: 50rpx;font-weight: bold;"
			@click="btn_save()">保存</button>


	</view>



</template>
<script>
	export default {
		data: function() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			const hours = []
			const hour = date.getHours()
			const minutes = []
			const minute = date.getMinutes()

			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			for (let i = 0; i <= 23; i++) {
				if (i < 10) {
					hours.push("0" + i)
				} else {
					hours.push(i)
				}
			}
			for (let i = 0; i <= 59; i++) {
				if (i < 10) {
					minutes.push("0" + i)
				} else {
					minutes.push(i)
				}
			}
			const date1 = new Date()
			const years1 = []
			const year1 = date.getFullYear()
			const months1 = []
			const month1 = date.getMonth() + 1
			const days1 = []
			const day1 = date.getDate()
			const hours1 = []
			const hour1 = date.getHours()
			const minutes1 = []
			const minute1 = date.getMinutes()

			for (let i = 1990; i <= date.getFullYear(); i++) {
				years1.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months1.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days1.push(i)
			}
			for (let i = 0; i <= 23; i++) {
				if (i < 10) {
					hours1.push("0" + i)
				} else {
					hours1.push(i)
				}

			}
			for (let i = 0; i <= 59; i++) {
				if (i < 10) {
					minutes1.push("0" + i)
				} else {
					minutes1.push(i)
				}

			}
			return {
				title: 'picker-view',
				years,
				year: '',
				months,
				month: '',
				days,
				day: '',
				hours,
				hour: '',
				minutes,
				minute: '',
				value: [9999, month, day, hour, minute],
				times: '',
				visible: true,
				indicatorStyle: "height: 50px; background-color: #82C2E5; z-index: 0;",
				years1,
				year1: '',
				months1,
				month1: '',
				days1,
				day1: '',
				hours1,
				hour1: '',
				minutes1,
				minute1: '',
				value1: [9999, month1 - 1, day1 - 1, hour1, minute1],
				times1: '',
				visible1: true,
				indicatorStyle1: "height: 50px; background-color: #82C2E5; z-index: 0;",

				Blood_pressure_show_1: true,
				Blood_pressure_show_2: false,
				Blood_pressure_show_3: false,
				Blood_pressure_show_4: false,
			}
		},
		methods: {
			bindChange: function(e) {
				const val = e.detail.value
				console.log(val)
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				this.day = this.days[val[2]]
				this.hour = this.hours[val[3]]

				this.minute = this.minutes[val[4]]

				this.times = this.year + "-" + this.month + "-" + this.day + "\t" + this.hour + ":" + this.minute
			},
			bindChange1: function(e) {
				const val = e.detail.value
				console.log(val)
				this.year1 = this.years1[val[0]]
				this.month1 = this.months1[val[1]]
				this.day1 = this.days1[val[2]]
				this.hour1 = this.hours1[val[3]]
				this.minute1 = this.minutes1[val[4]]
				this.times1 = this.year1 + "-" + this.month1 + "-" + this.day1 + "\t" + this.hour1 + ":" + this.minute1
			},
			btn_save() {
				uni.showToast({
					title: this.times + "\n" + this.times1,
					icon: 'none'
				})
			}
		}
	}
</script>



<style>
	.picker-view {
		width: 100%;
		height: 300rpx;
		border-radius: 20rpx;
		z-index: 0;
	}

	.item {
		line-height: 100rpx;
		text-align: center;
	}
</style>