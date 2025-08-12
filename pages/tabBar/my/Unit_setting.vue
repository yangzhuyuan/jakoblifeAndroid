<template>
	<view style="padding: 20px;color: black; height: 100vh;">
		<view class="view_bg">
			<view
				style="display: flex; flex-direction: row; align-items: center;padding:10px;justify-content: space-between;">
				<text style="width: 40vw;font-weight: bold;font-size: 16px;">{{$t('血压')}}</text>
				<view style="display: flex; flex-direction: row;align-items: center;">
					<picker @change="bindPickerChange_Blood_pressure" :value="Blood_pressure_index"
						:range="Blood_pressure_array">
						<view class="uni-input" style="text-align: right;">
							{{Blood_pressure_array[Blood_pressure_index]}}
						</view>
					</picker>
					<uni-icons style="margin-left: 10px;" type="bottom" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view
				style="display: flex; flex-direction: row; align-items: center;padding:10px;justify-content: space-between;">
				<text style="width: 40vw;font-weight: bold;font-size: 16px;">{{$t('身高')}}</text>
				<view style="display: flex; flex-direction: row;align-items: center;">
					<picker @change="bindPickerChange_Height" :value="Height_index" :range="Height_array">
						<view class="uni-input" style="text-align: right;">{{Height_array[Height_index]}}</view>
					</picker>
					<uni-icons style="margin-left: 10px;" type="bottom" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view
				style="display: flex; flex-direction: row; align-items: center;padding:10px;justify-content: space-between;">
				<text style="width: 40vw;font-weight: bold;font-size: 16px;">{{$t('体重')}}</text>
				<view style="display: flex; flex-direction: row;align-items: center;">
					<picker @change="bindPickerChange_Width" :value="Width_index" :range="Width_array">
						<view class="uni-input" style="text-align: right;">{{Width_array[Width_index]}}</view>
					</picker>
					<uni-icons style="margin-left: 10px;" type="bottom" size="16"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				Blood_pressure_array: ['mmHg', 'kPa'],
				Blood_pressure_index: uni.getStorageSync("Blood") !== "" ? uni.getStorageSync("Blood") : 0,
				Height_array: ["inch", 'cm'],
				Height_index: uni.getStorageSync("danwei1") !== "" ? uni.getStorageSync("danwei1") : 1,
				Width_array: ["kg", "lb"],
				Width_index: uni.getStorageSync("danwei2") !== "" ? uni.getStorageSync("danwei2") : 0,

			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('单位设置')
			})
		},

		methods: {
			bindPickerChange_Blood_pressure: function(e) {
				this.Blood_pressure_index = e.detail.value
				uni.setStorageSync("Blood", this.Blood_pressure_index)

			},
			bindPickerChange_Height: function(e) {
				this.Height_index = e.detail.value
				uni.setStorageSync("danwei1", this.Height_index)

			},
			bindPickerChange_Width: function(e) {
				this.Width_index = e.detail.value
				uni.setStorageSync("danwei2", this.Width_index)
			},
		}
	}
</script>

<style>
	.view_bg {
		padding: 0 10px 0 10px;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}
</style>