<template>
	<view style="display: flex; align-items: center; flex-direction: column; padding-left: 15px; margin-top: 20px;">
		<view style="margin-top: 10px; font-weight: 600; font-size: 16px; color: black; text-align: center;">
			{{ show1 ? $t('您正在与') + " "+item.receiverName + " "+ $t('共享') : " "+item.shareName + " "+ $t('正在与您共享以下健康数据') }}
		</view>
		<view style="font-size: 12px; color: #999999; margin: 5px 0 10px; text-align: center;">
			{{$t('注本页面显示均为最近测量数据')}}
		</view>
		<scroll-view scroll-y="true" class="scroll-view">
			<view style="margin-top: 20px;" v-for="(dataPoint, index) in dataPoints" :key="index">
				<view style="display: flex; flex-direction: row; padding: 15px; align-items: center;">
					<view style="font-weight: 400; width: 65vw; font-size: 16px; color: #1A1A1A;">
						{{ getRegisterName(dataPoint.register) }}
					</view>
					<view
						style="width: 20vw; color: #999999; font-weight: 400; font-size: 16px; text-align: right; margin-right: 15px;">
						{{ getRegisterValue(dataPoint.register, dataPoint.registerVal) }}
					</view>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
				<view style="background: gainsboro; height: 1px; width: 100vw;"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			dataPoints: Array,
			show1: Boolean
		},
		methods: {
			getRegisterName(register) {
				const names = {
					lowPressure: this.$t('舒张压'),
					highPressure: this.$t('收缩压'),
					heartrate: this.$t('脉搏'),
					oxygen: this.$t('血氧'),
					temperature: this.$t('体温'),
					pressure: this.$t('压力'),
					start_weight: this.$t('初始体重'),
					goal_weight: this.$t('目标体重'),
					weight: this.$t('体重'),
					height: this.$t('身高'),
					chest_circumference: this.$t('胸围'),
					waistline: this.$t('腰围'),
					hipline: this.$t('臀围'),
					biceps_circumference: this.$t('上臂围'),
					thigh_circumference: this.$t('大腿围'),
					calf_circumference: this.$t('小腿围'),
					bmi: 'BMI'
				};
				return names[register] || register;
			},
			getRegisterValue(register, value) {
				const units = {
					heartrate: 'BPM',
					lowPressure: 'mmHg',
					highPressure: 'mmHg',
					start_weight: 'kg',
					goal_weight: 'kg',
					weight: 'kg',
					bmi: 'kg/m²',
					oxygen: '%',
					temperature: '℃',
					pressure: 'kPa'
				};
				return `${value}${units[register] || ''}`;
			}
		}
	}
</script>