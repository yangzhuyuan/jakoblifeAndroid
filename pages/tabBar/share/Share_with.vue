<template>
	<view style="color: black;height: 100vh;width: 100vw;">
		<view style=" padding-top: 5px;padding-bottom: 60px; ">
			<view style="background: white; margin: 15px;  border-radius: 20px; padding:20px 0 20px 0;">
				<view style="display: flex; align-items: center;  flex-direction: column;">
					<image src="../../../static/icons/80x80.png"
						style="width: 80px; height: 80px;border-radius: 40px;border: 1px solid gainsboro;"></image>
					<text style="margin-top: 20px;font-weight: bold; font-size: 18px;">{{name}}</text>
					<text style="font-weight: bold; font-size: 12px;color: gray;">{{phone}}</text>
				</view>
				<view
					style="display: flex; align-items: left; flex-direction: column; padding-left: 15px;margin-top: 20px;">
					<view style="margin-top: 10px;font-weight: bold; font-size: 16px;text-align: center;">
						{{$t('gongxiangitem.title_21')}} {{name}} {{$t('gongxiangitem.title_17')}}。
					</view>
					<text style="font-size: 14px; margin-top: 10px;">{{$t('gongxiangitem.title_21')}}
						{{name}}（{{phone}}）{{$t('gongxiangitem.title_17')}}{{$t('gongxiangitem.title_22')}}</text>
				</view>
				<view style="padding: 10px;border-radius: 15px; margin-top: 20px;">
					<view style="display: flex;flex-direction: row; padding:5px; align-items: center;"
						@click="Step_number()">
						<view style="width: 90%; margin: 5px;">{{$t('gongxiangitem.title_23')}}</view>
						<uni-icons v-show="Step_number_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px; align-items: center;" @click="Sleep()">
						<view style="width: 90%; margin: 5px;">{{$t('gongxiangitem.title_24')}}</view>
						<uni-icons v-show="Sleep_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px;align-items: center;"
						@click="Blood_pressure()">
						<view style="width: 90%; margin: 5px;">{{$t('gongxiangitem.title_25')}}</view>
						<uni-icons v-show="Blood_pressure_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<!-- 	<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px;align-items: center;"
						@click="Heart_rate()">
						<view style="width: 90%; margin: 5px;">心率</view>
						<uni-icons v-show="Heart_rate_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px;align-items: center;"
						@click="Blood_oxygen()">
						<view style="width: 90%; margin: 5px;">血氧</view>
						<uni-icons v-show="Blood_oxygen_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px;align-items: center;" @click="Width()">
						<view style="width: 90%; margin: 5px;">体重</view>
						<uni-icons v-show="Width_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px;align-items: center;" @click="Height()">
						<view style="width: 90%; margin: 5px;">身高</view>
						<uni-icons v-show="Height_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px;align-items: center;" @click="Bmi()">
						<view style="width: 90%; margin: 5px;">BMI</view>
						<uni-icons v-show="Bmi_show" type="checkmarkempty" size="16"></uni-icons>
					</view>
					<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					<view style="display: flex;flex-direction: row; padding:5px;align-items: center;"
						@click="Body_circumference_data()">
						<view style="width: 90%; margin: 5px;">体围数据</view>
						<uni-icons v-show="Body_circumference_data_show" type="checkmarkempty" size="16"></uni-icons>
					</view>-->
				</view>
				<view :style="getbk1(action)" class="check_bg">
					<checkbox style="font-size: 16px; font-weight: bold;" color="#ffffff" class="round"
						activeBorderColor="#D2D2D2" activeBackgroundColor="#3298F7" :checked="cb" @click="checked()">{{$t('gongxiangitem.title_27')}}
					</checkbox>
				</view>
			</view>
			<button @tap="next()" class="btn_backgroud" :style="getbk(action)">{{$t('gongxiang')}}</button>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "小明",
				phone: "12",
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

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('gongxiangitem.title_11')
			})
		},

		onLoad(res) {
			this.name = res.NAME
			this.phone = res.PHONE
		},

		methods: {


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
					this.action.push("1")
				}
			},
			Blood_pressure() {
				if (this.Blood_pressure_show == true) {
					this.Blood_pressure_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Blood_pressure_show = true
					this.action.push("1")
				}
			},
			Heart_rate() {
				if (this.Heart_rate_show == true) {
					this.Heart_rate_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Heart_rate_show = true
					this.action.push("1")
				}
			},
			Blood_oxygen() {
				if (this.Blood_oxygen_show == true) {
					this.Blood_oxygen_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Blood_oxygen_show = true
					this.action.push("1")
				}
			},
			Width() {
				if (this.Width_show == true) {
					this.Width_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Width_show = true
					this.action.push("1")
				}
			},
			Height() {
				if (this.Height_show == true) {
					this.Height_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Height_show = true
					this.action.push("1")
				}
			},
			Bmi() {
				if (this.Bmi_show == true) {
					this.Bmi_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Bmi_show = true
					this.action.push("1")
				}
			},
			Body_circumference_data() {
				if (this.Body_circumference_data_show == true) {
					this.Body_circumference_data_show = false
					this.cb = false
					this.action.pop()
				} else {
					this.Body_circumference_data_show = true
					this.action.push("1")
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


			getbk(id) {
				console.log("xuanze", id.join())
				return {
					background: id.join() === '' || id.join() === '0' ? '#DBDBDB' : '#3298F7'
				}
			},

			getbk1(id) {
				if (id.join() === '0,1,1,1') {
					this.cb = true
				} else {
					this.cb = false
				}
			},

			next() {
				if (this.action.join() === '' || this.action.join() == '0') {
					uni.showToast({
						title: this.$t('gongxiangitem.title_20'),
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: "../share/Shared_success?NAME=" + this.name
					// url: "../share/Share_with_1?NAME=" + this.name + "&PHONE=" + this.phone +
					// 	"&Step_number_show=" + this.Step_number_show + "&Sleep_show=" + this.Sleep_show +
					// 	"&Blood_pressure_show=" + this.Blood_pressure_show + "&Heart_rate_show=" + this
					// 	.Heart_rate_show + "&Blood_oxygen_show=" + this.Blood_oxygen_show + "&Width_show=" + this
					// 	.Width_show + "&Height_show=" + this.Height_show + "&Bmi_show=" + this.Bmi_show +
					// 	"&Body_circumference_data_show=" + this.Body_circumference_data_show
				})
			},

		}
	}
</script>

<style>
	.btn_backgroud {
		background: #3298F7;
		color: white;
		border-radius: 40px;
		margin: 60px 20px 20px 20px
	}

	.check_bg {
		flex-direction: row;
		display: flex;
		justify-content: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}
</style>