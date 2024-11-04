<template>
	<view>
		<view style="background: #0686CC; height: 120px;">
			<view style=" padding-top: 60px;padding-bottom: 60px; ">

				<view style="background: white; margin: 0 20px 0 20px; padding: 10px; border-radius: 20px;">
					<view style="display: flex;flex-direction: row;padding: 10px;" @click="back()">
						<uni-icons type="left" size="16"></uni-icons>
						<view style="font-size: 14px;margin-left: 5px;">共享给</view>
					</view>
					<view style="display: flex; align-items: center; flex-direction: column;">
						<image src="../../../static/icons/80x80.png"
							style="width: 80px; height: 80px;border-radius: 40px;border: 1px solid gainsboro;"></image>
						<text style="margin-top: 20px;font-weight: bold; font-size: 18px;">{{name}}</text>
						<text style="font-weight: bold; font-size: 12px;color: gray;">{{phone}}</text>
					</view>
					<view
						style="display: flex; align-items: left; flex-direction: column; padding-left: 15px;margin-top: 20px;">
						<view style="margin-top: 10px;font-weight: bold; font-size: 16px;">
							<text>您将与</text>
							<text style="color: blue;">{{name}}</text>
							<text>分享以下健康数据</text>
						</view>
						<text
							style="font-size: 14px;">您将与{{name}}（{{phone}}）分享以下数据，您始终可以更改共享或停止共享，若停止共享，您的数据将从其设备上移除。</text>
					</view>
					<view style="padding: 10px;border-radius: 15px; margin-top: 20px;">
						<view style="display: flex;flex-direction: row; padding:0 5px 5px 5px;">
							<view style="width: 90%; margin-left: 5px;">步数</view>
							<uni-icons v-show="Step_number_show" type="checkmarkempty" size="16"></uni-icons>
						</view>
						<view style="background: gainsboro; width: 100%; height: 1px;"></view>
						<view style="display: flex;flex-direction: row; padding:5px;">
							<view style="width: 90%; margin-left: 5px;">睡眠</view>
							<uni-icons v-show="Sleep_show" type="checkmarkempty" size="16"></uni-icons>
						</view>
						<view style="background: gainsboro; width: 100%; height: 1px;"></view>
						<view style="display: flex;flex-direction: row; padding:5px;">
							<view style="width: 90%; margin-left: 5px;">血压</view>
							<uni-icons v-show="Blood_pressure_show" type="checkmarkempty" size="16"></uni-icons>
						</view>
						<view style="background: gainsboro; width: 100%; height: 1px;"></view>
						<view style="display: flex;flex-direction: row; padding:5px;">
							<view style="width: 90%; margin-left: 5px;">心率</view>
							<uni-icons v-show="Heart_rate_show" type="checkmarkempty" size="16"></uni-icons>
						</view>
						<view style="background: gainsboro; width: 100%; height: 1px;"></view>
						<view style="display: flex;flex-direction: row; padding:5px;">
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
						<view style="display: flex;flex-direction: row; padding:5px;"
							@click="Body_circumference_data()">
							<view style="width: 90%; margin-left: 5px;">体围数据</view>
							<uni-icons v-show="Body_circumference_data_show" type="checkmarkempty"
								size="16"></uni-icons>
						</view>
						<view style="background: gainsboro; width: 100%; height: 1px;"></view>
					</view>

					<button @tap="Shared_success()"
						style="background: #82C2E5;color: white;border-radius: 40px; margin-top: 60px; margin-bottom: 20px;">共享</button>
				</view>
			</view>
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
			}
		},

		onLoad(res) {
			this.name = res.NAME
			this.phone = res.PHONE
			if (res.Step_number_show == "true") {
				this.Step_number_show = true
			} else {
				this.Step_number_show = false
			}

			if (res.Sleep_show == "true") {
				this.Sleep_show = true
			} else {
				this.Sleep_show = false
			}

			if (res.Blood_pressure_show == "true") {
				this.Blood_pressure_show = true
			} else {
				this.Blood_pressure_show = false
			}

			if (res.Heart_rate_show == "true") {
				this.Heart_rate_show = true
			} else {
				this.Heart_rate_show = false
			}

			if (res.Blood_oxygen_show == "true") {
				this.Blood_oxygen_show = true
			} else {
				this.Blood_oxygen_show = false
			}
			
			if (res.Width_show == "true") {
				this.Width_show = true
			} else {
				this.Width_show = false
			}
			if (res.Height_show == "true") {
				this.Height_show = true
			} else {
				this.Height_show = false
			}
			if (res.Bmi_show == "true") {
				this.Bmi_show = true
			} else {
				this.Bmi_show = false
			}
			if (res.Body_circumference_data_show == "true") {
				this.Body_circumference_data_show = true
			} else {
				this.Body_circumference_data_show = false
			}






			console.log(res)
		},

		methods: {
			back() {
				uni.navigateBack()
			},
			Shared_success() {
				uni.navigateTo({
					url: "../share/Shared_success?NAME=" + this.name
				})
			},

		}
	}
</script>

<style>

</style>