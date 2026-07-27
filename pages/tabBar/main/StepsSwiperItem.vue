<template>
	<view>
		<view class="data_bg">
			<view class="icon_bg">
				<image src="../../../static/icons/1.png" class="img_style" mode="aspectFit"></image>
				<text class="icon_text_bg">{{$t('步数')}}</text>
			</view>
			<view style="flex: 1;display: flex;flex-direction: column;align-items: center;justify-content: center;">
				<view style="font-weight: bold;font-size: 16px;">{{bushu}}</view>
				<view style="color: #999999;font-size: 10px;font-weight: 400;">{{$t('计步')}}</view>
				<view style="text-align: right;font-size: 13px;">{{bushu_time}}</view>
			</view>
			<view style="flex: 1;display: flex;flex-direction: column;align-items: center;justify-content: center;">
				<view style="font-weight: bold;font-size: 20px;color: green;">{{today_Daily_Goal}}
				</view>
				<view style="color: #999999;font-size: 10px;font-weight: 400;">{{$t('每天目标')}}</view>
			</view>
		</view>
		<view class="data_bg_A">
			<view class="charts-box-2">
				<qiun-data-charts type="column" :opts="opts" :chartData="chartData" />
			</view>
			<view style="margin-bottom: 160px;">
				<view
					style="margin: 20px;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
					<input type="number" v-model="dailyGoalModel" :placeholder="$t('每天目标')"
						style="flex: 2; text-align: center;background: white;padding: 15px;border-radius: 10px;margin-right: 5px;" />
					<button @click="$emit('daily-goal-set')"
						style="flex: 1;margin-left: 5px;background: #3298F7; color: white;font-weight: bold;">{{$t("设置")}}</button>
				</view>
				<view v-if="parseInt(bushu)  >= parseInt(today_Daily_Goal)" class="icon_item_bg_toast">
					{{$t("今天达标了明天在加油")}}
					<uni-icons type="hand-up-filled" size="28" color="#3298F7"></uni-icons>
				</view>
				<view v-else-if="parseInt(bushu) < 5000 && xueya !== 0" class="icon_item_bg_toast_none">
					{{$t("你的血压有点高")}}<uni-icons type="fire-filled" size="28" color="red"></uni-icons>
				</view>
				<view v-else-if="parseInt(bushu) < parseInt(today_Daily_Goal)" class="icon_item_bg_toast_none">
					{{$t("今天没达标明天要多运动")}}
				</view>
				<view v-else class="icon_item_bg_toast">
					<!-- 其他情况 -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'StepsSwiperItem',
		props: {
			bushu: {
				type: [String, Number],
				default: '--/--'
			},
			bushu_time: {
				type: String,
				default: '--/--'
			},
			today_Daily_Goal: {
				type: [String, Number],
				default: '0'
			},
			dailyGoal: {
				type: [String, Number],
				default: ''
			},
			chartData: {
				type: Object,
				default: () => ({
					categories: [0],
					series: [{
						name: '',
						data: [0]
					}]
				})
			},
			opts: {
				type: Object,
				default: () => ({})
			},
			xueya: {
				type: Number,
				default: 0
			}
		},
		computed: {
			dailyGoalModel: {
				get() {
					return this.dailyGoal
				},
				set(val) {
					this.$emit('update:dailyGoal', val)
				}
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
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 0 40px 0;
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

	.charts-box-2 {
		margin-top: 20px;
		padding: 5px;
		background: white;
		border-radius: 20px;
		margin-left: 20px;
		margin-right: 20px;
		height: auto;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.icon_item_bg_toast {
		background: white;
		text-align: center;
		color: #3298F7;
		display: flex;
		padding: 10px;
		justify-content: center;
		align-items: center;
	}
	.icon_item_bg_toast_none {
		background: white;
		text-align: center;
		color: red;
		display: flex;
		padding: 10px;
		justify-content: center;
		align-items: center;
	}
</style>