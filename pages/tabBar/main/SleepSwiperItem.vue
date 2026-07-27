<template>
	<view>
		<view class="data_bg">
			<view class="icon_bg">
				<image lazy-load src="../../../static/icons/3.png" class="img_style" mode="aspectFit" />
				<text class="icon_text_bg">{{$t('睡眠')}}</text>
			</view>
			<view class="yalistyds">
				<view class="yalistyd_1">{{sleep}}</view>
				<view class="yalistyd_2">Time</view>
				<view class="yalistyd_3">{{sleep_time}}</view>
			</view>
			<view class="yalistyds">
				<view class="yalistyd_2">Light:{{totalLight}}</view>
				<view class="yalistyd_2">Deep:{{totalDeep}}</view>
				<view class="yalistyd_2">REM:{{totalRem}}</view>
			</view>
		</view>
		<view class="data_bg_A_1">
			<view
				style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
				<view
					style="margin-right: 5px; flex: 1; display: flex;justify-content: center; align-items: center; background: white;color: white;padding: 15px;font-weight: bold;font-size: 14px;border-radius: 10px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4); color: #222328;">
					{{$t("评分")}}：<text v-if="sleep_point>=80 "
						style="font-size: 22px;color: #58BF78;">{{sleep_point}}</text>
					<text v-else-if="sleep_point<80&&sleep_point>=60 "
						style="font-size: 22px;color: #FFEC01;">{{sleep_point}}</text>
					<text v-else-if="sleep_point<60 "
						style="font-size: 22px;color:  #F55A5A;">{{sleep_point}}</text>
					<text v-else style="font-size: 22px;color: black;">{{sleep_point}}</text>
				</view>
				<view class="context_btn2" style="box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);">
					<view class="context_title1">
						{{$t('是否服用药物')}}
					</view>
					<switch @change="$emit('medication-change', $event)" style="transform:scale(0.8);"
						:checked="medication" color="#3298F7" />
				</view>
			</view>
			<view v-show="sleep_point!=='--/--'"
				style="margin-bottom: 80px; padding: 15px; background: white;margin-top: 20px;border-radius: 20px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);">
				<view v-if="sleepTip && sleep_point<85" class="sleep-card">
					<view class="sleep-title">{{ $t('睡眠血压交叉分析') }}:</view>
					<view v-for="(line, idx) in sleepTip" :key="idx" class="sleep-line">
						<text>{{ $t(line) }}</text>
					</view>
				</view>
				<view v-else class="icon_item_bg_toast">{{$t("睡眠良好")}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'SleepSwiperItem',
		props: {
			sleep: {
				type: String,
				default: '--/--'
			},
			sleep_time: {
				type: String,
				default: '--/--'
			},
			totalLight: {
				type: String,
				default: 'NA'
			},
			totalDeep: {
				type: String,
				default: 'NA'
			},
			totalRem: {
				type: String,
				default: 'NA'
			},
			sleep_point: {
				type: [String, Number],
				default: '--/--'
			},
			medication: {
				type: Boolean,
				default: false
			},
			sleepTip: {
				type: Array,
				default: () => []
			}
		}
	}
</script>

<style scoped>
	.data_bg {
		height: 116px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 5px 20px 0 20px;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.data_bg_A_1 {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 20px 80px 20px;
		font-size: 16px;
		font-weight: 400;
	}

	.icon_bg {
		flex: 1;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bg {
		margin-top: 10px;
		width: 26px;
		height: 18px;
		font-size: 13px;
		text-align: center;
		font-weight: bold;
	}

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.yalistyds {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.yalistyd_1 {
		font-weight: bold;
		font-size: 16px;
	}

	.yalistyd_2 {
		color: #999999;
		font-size: 10px;
		font-weight: 400;
	}

	.yalistyd_3 {
		text-align: right;
		font-size: 13px;
	}

	.context_btn2 {
		display: flex;
		margin-left: 5px;
		flex-direction: row;
		background: white;
		align-items: center;
		border-radius: 100px;
		padding: 15px;
	}

	.context_title1 {
		width: 90%;
		font-size: 14px;
		color: black;
	}

	.sleep-card {
		font-size: 14px;
		font-weight: 600;
		color: #3298f7;
	}

	.sleep-title {
		margin-bottom: 6px;
		font-size: 16px;
	}

	.sleep-line {
		color: #040000;
		font-weight: 600;
		font-size: 14px;
		margin-top: 4px;
	}

	.icon_item_bg_toast {
		background: white;
		text-align: center;
		color: #3298F7;
		display: flex;
		padding: 15px;
		justify-content: center;
		align-items: center;
	}
</style>
