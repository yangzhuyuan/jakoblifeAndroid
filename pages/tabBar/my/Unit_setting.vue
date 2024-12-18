<template>
	<view style="padding: 20px;color: black; height: 100vh;">
		<view class="view_bg">
			<view style="display: flex; flex-direction: row; align-items: center;padding:10px">
				<text style="width: 50vw;font-weight: bold;font-size: 16px;">{{$t('shouye_item.title_1')}}</text>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange_Blood_pressure" :value="Blood_pressure_index"
						:range="Blood_pressure_array">
						<view class="uni-input" style="text-align: right;">
							{{Blood_pressure_array[Blood_pressure_index]}}
						</view>
					</picker>
				</view>
				<uni-icons type="bottom" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view style="display: flex; flex-direction: row; align-items: center;padding:10px">
				<text style="width: 50vw;font-weight: bold;font-size: 16px;">{{$t('zhuceitem.title_5')}}</text>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange_Height" :value="Height_index" :range="Height_array">
						<view class="uni-input" style="text-align: right;">{{Height_array[Height_index]}}</view>
					</picker>
				</view>
				<uni-icons type="bottom" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view style="display: flex; flex-direction: row; align-items: center;padding:10px">
				<text style="width: 50vw;font-weight: bold;font-size: 16px;">{{$t('zhuceitem.title_6')}}</text>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange_Width" :value="Width_index" :range="Width_array">
						<view class="uni-input" style="text-align: right;">{{Width_array[Width_index]}}</view>
					</picker>
				</view>
				<uni-icons type="bottom" size="16"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				Blood_pressure_array: ['mmHg', 'kPa'],
				Blood_pressure_index: 0,
				Height_array: ['cm', 'm'],
				Height_index: 0,
				Width_array: ['kg(公斤)', '斤'],
				Width_index: 0,


			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.dwss')
			})
		},

		methods: {
			bindPickerChange_Blood_pressure: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Blood_pressure_index = e.detail.value
			},
			bindPickerChange_Height: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Height_index = e.detail.value
			},
			bindPickerChange_Width: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.Width_index = e.detail.value
			},


		}
	}
</script>

<style>
	.view_bg {
		padding: 0 10px 0 10px;
		background: white;
		border-radius: 20px;
	}
</style>