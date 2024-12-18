<template>
	<view style="padding: 20px;color: black;height: 100vh;">
		<view style=" margin-top: 10px; padding: 20px 10px 40px 10px; background: white; border-radius: 10px;">
			<view style="display: flex; align-items: center; flex-direction: column;margin-top: 15px;">
				<view style="display: inline-block;">
					<image :src="avatar"
						style="display: flex;width: 80px; height: 80px;border-radius: 40px;border: 1px solid gainsboro;">
					</image>
				</view>
				<text style="margin-top: 20px;font-weight: bold; font-size: 18px;">{{name}}</text>
				<text style="font-weight: bold; font-size: 12px;color: gray;">{{phone}}</text>
			</view>
			<view
				style="display: flex; align-items: left; flex-direction: column; padding-left: 15px;margin-top: 20px;">
				<view style="margin-top: 10px;font-weight: bold; font-size: 16px;text-align: center;">
					{{typeid === '0' ? $t('gongxiangitem.title_16') + name +$t('gongxiangitem.title_17'): name + $t('gongxiangitem.title_18')}}
				</view>
			</view>
			<view style="padding: 10px;border-radius: 15px; margin-top: 20px;">


				<view style="display: flex;flex-direction: row; padding:10px 5px 10px 5px;" @click="Step_number()">
					<view style="width: 90%; margin-left: 5px;">{{$t('gongxiangitem.title_23')}}</view>
					<uni-icons v-show="Step_number_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:10px 5px 10px 5px;" @click="Sleep()">
					<view style="width: 90%; margin-left: 5px;">{{$t('gongxiangitem.title_24')}}</view>
					<uni-icons v-show="Sleep_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:10px 5px 10px 5px;" @click="Blood_pressure()">
					<view style="width: 90%; margin-left: 5px;">{{$t('gongxiangitem.title_25')}}</view>
					<uni-icons v-show="Blood_pressure_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<!--<view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:5px;" @click="Heart_rate()">
					<view style="width: 90%; margin-left: 5px;">心率</view>
					<uni-icons v-show="Heart_rate_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:5px;" @click="Blood_oxygen()">
					<view style="width: 90%; margin-left: 5px;">血氧</view>
					<uni-icons v-show="Blood_oxygen_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:5px;" @click="Width()">
					<view style="width: 90%; margin-left: 5px;">体重</view>
					<uni-icons v-show="Width_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:5px;" @click="Height()">
					<view style="width: 90%; margin-left: 5px;">身高</view>
					<uni-icons v-show="Height_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:5px;" @click="Bmi()">
					<view style="width: 90%; margin-left: 5px;">BMI</view>
					<uni-icons v-show="Bmi_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				 <view style="background: gainsboro; width: 100%; height: 1px;"></view>
				<view style="display: flex;flex-direction: row; padding:5px;" @click="Body_circumference_data()">
					<view style="width: 90%; margin-left: 5px;">体围数据</view>
					<uni-icons v-show="Body_circumference_data_show" type="checkmarkempty" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			 -->
			</view>
			<view :style="getbk1(action)" class="check_bg">
				<checkbox style="font-size: 16px; font-weight: bold;" color="#ffffff" class="round"
					activeBorderColor="#D2D2D2" activeBackgroundColor="#3298F7" :checked="cb" @click="checked()">
					{{$t('gongxiangitem.title_27')}}
				</checkbox>
			</view>
		</view>
		<button @tap="zanbugongxiang()"
			style="background: #F55A5A;color: white;border-radius: 40px; margin:60px 0 20px 0">{{$t('gongxiangitem.title_28')}}</button>
		<button @tap="complete()"
			style="background: #3298F7;color: white;border-radius: 40px; margin:30px 0 20px 0">{{$t('gongxiangitem.title_29')}}</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '',
				name: "小明",
				phone: "12",
				typeid: '',
				Step_number_show: false,
				Sleep_show: false,
				Blood_pressure_show: false,
				Heart_rate_show: false,
				Blood_oxygen_show: false,
				Width_show: false,
				Height_show: false,
				Bmi_show: false,
				Body_circumference_data_show: false,
				cb: false,
				action: ['0']
			}
		},

		onLoad(res) {
			this.avatar = res.AVATAR
			this.name = res.NAME
			this.phone = res.PHONE
			this.typeid = res.typeid

			uni.setNavigationBarTitle({
				title: this.$t("gongxiangitem.title_26")
			})

		},

		methods: {

			getbk1(id) {
				if (id.join() === '0,1,1,1') {
					this.cb = true
				} else {
					this.cb = false
				}
			},

			zanbugongxiang() {
				uni.showToast({
					title: this.$t('gongxiangitem.title_32'),
					icon: 'none'
				})
				setTimeout(function() {
					uni.navigateBack()
				}, 300)
			},
			// back() {
			// 	uni.navigateBack()
			// },
			Step_number() {
				if (this.Step_number_show == true) {
					this.Step_number_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Step_number_show = true
					this.action.push('1')
				}
			},
			Sleep() {
				if (this.Sleep_show == true) {
					this.Sleep_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Sleep_show = true
					this.action.push('1')
				}
			},
			Blood_pressure() {
				if (this.Blood_pressure_show == true) {
					this.Blood_pressure_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Blood_pressure_show = true
					this.action.push('1')
				}
			},
			Heart_rate() {
				if (this.Heart_rate_show == true) {
					this.Heart_rate_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Heart_rate_show = true
					this.action.push('1')
				}
			},
			Blood_oxygen() {
				if (this.Blood_oxygen_show == true) {
					this.Blood_oxygen_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Blood_oxygen_show = true
					this.action.push('1')
				}
			},
			Width() {
				if (this.Width_show == true) {
					this.Width_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Width_show = true
					this.action.push('1')
				}
			},
			Height() {
				if (this.Height_show == true) {
					this.Height_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Height_show = true
					this.action.push('1')
				}
			},
			Bmi() {
				if (this.Bmi_show == true) {
					this.Bmi_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Bmi_show = true
					this.action.push('1')
				}
			},
			Body_circumference_data() {
				if (this.Body_circumference_data_show == true) {
					this.Body_circumference_data_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Body_circumference_data_show = true
					this.action.push('1')
				}
			},
			checked() {
				if (this.cb == true) {
					this.Step_number_show = false
					this.Sleep_show = false
					this.Blood_pressure_show = false
					this.Heart_rate_show = false
					this.Blood_oxygen_show = false
					this.Width_show = false
					this.Height_show = false
					this.Bmi_show = false
					this.Body_circumference_data_show = false
					this.cb = false
					this.action = ['0']
				} else {
					this.Step_number_show = true
					this.Sleep_show = true
					this.Blood_pressure_show = true
					this.Heart_rate_show = true
					this.Blood_oxygen_show = true
					this.Width_show = true
					this.Height_show = true
					this.Bmi_show = true
					this.Body_circumference_data_show = true
					this.cb = true
					// this.action = ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1']
					this.action = ['0', '1', '1', '1']
				}
			},
			complete() {
				if (this.action.join() === '' || this.action.join() === '0') {
					uni.showToast({
						title: this.$t('gongxiangitem.title_20'),
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: '../share/Shared_success'
				})
				// uni.navigateTo({
				// 	url: "../share/Share_with_1?NAME=" + this.name + "&PHONE=" + this.phone +
				// 		"&Step_number_show=" + this.Step_number_show + "&Sleep_show=" + this.Sleep_show +
				// 		"&Blood_pressure_show=" + this.Blood_pressure_show + "&Heart_rate_show=" + this
				// 		.Heart_rate_show + "&Blood_oxygen_show=" + this.Blood_oxygen_show + "&Width_show=" + this
				// 		.Width_show + "&Height_show=" + this.Height_show + "&Bmi_show=" + this.Bmi_show +
				// 		"&Body_circumference_data_show=" + this.Body_circumference_data_show
				// })
			},

		}
	}
</script>

<style>
	.check_bg {
		flex-direction: row;
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
</style>