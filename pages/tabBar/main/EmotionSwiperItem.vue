<template>
	<view>
		<view style="padding: 0 20px 20px 20px;">
			<button class="btnstyle" @click="$emit('setting')" :disabled="sleep_alertdisabled">{{$t("定时测量")}}</button>
			<button class="btnstyle" @click="$emit('sleep-alert')" :disabled="sleep_alertdisabled">{{$t("立即测量")}}</button>
			<view style="margin-top: 20px; display: flex;justify-content: center;color: red;">
				{{$t("重要提示本报告结果由算法生成")}}
			</view>
		</view>
		<view class="data_bg_ppg_set">
			<view style="margin:20px 20px 180px 20px;background: white;border-radius: 20px; padding: 20px;">
				<view v-show="ppgnewpoint" style="font-size: 14px;font-weight: 600;color: black;">
					😊 {{$t("心情状态评估")}}：<text
						style="font-size: 14px; font-weight: 600;color: black;">{{mood_Description}}</text>
					<view
						style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
						{{$t("心情指数")}}：
					</view>
					<view
						style=" font-size: 16px;padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
						{{ppgnewpoint}}
					</view>
					<view
						style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
						{{$t("心情等级")}}：
					</view>
					<view
						style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
						{{mood_level}}
					</view>
				</view>
				<view v-show="depression_risk_score" style="font-size: 14px;font-weight: 600;color: black;">🧠
					{{$t("心理健康评估")}}：
					<view
						style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
						{{$t("抑郁风险评分")}}：
					</view>
					<view
						style="font-size: 18px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
						{{depression_risk_score}}
					</view>
					<view
						style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
						{{$t("抑郁风险等级")}}：<button class="btnstyle" @click="$emit('xiangxibaogo')"
							style="margin: 0;  width: 120px; height: 30px; font-size: 10px; display: flex; justify-content: center;align-items: center;"
							:disabled="baoggaodisabled">{{$t("详细报告")}}</button>
					</view>
					<view
						style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
						{{depression_risk_level}}.
					</view>
					<view v-if="!finalResult"
						style="font-size: 16px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
						({{$t("需要两周以上测试数据进行评估")}})
					</view>
					<view v-else
						style="font-size: 16px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
						<button @click="$emit('pingfentiaozhuan')"
							style="margin: 0; width: 100%; background: #3298F7; color: white;  height: 30px; font-size: 10px; display: flex; justify-content: center;align-items: center;">{{$t("进行进一步风险评估")}}</button>
					</view>
				</view>
				<view v-show="stress_Index||fatigue_index||recovery_index"
					style="font-size: 14px;font-weight: 600;color: black;">
					<view style="display: flex;flex-direction: row;align-items: center;">🏥
						{{$t("综合健康指标")}}：<view @click="$emit('health-explanation')"><uni-icons type="help"
								size="18"></uni-icons></view>
					</view>
					<view
						style="padding: 0 20px 0 30px; color: #e60012;display: flex;flex-direction: row;align-items: center;">
						{{$t("压力指数")}}：
					</view>
					<view
						style="font-size: 18px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
						{{stress_Index}}/10
					</view>
					<view v-show="stress_Index>=5&&sleep_point<70&&sleep_point!=='--/--'"
						style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
						<text>{{$t("高压力睡眠碎片化")}}</text>
					</view>
					<view
						style="padding: 0 20px 0 30px; color: #e60012;display: flex;flex-direction: row;align-items: center;">
						{{$t("疲劳指数")}}：
					</view>
					<view
						style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
						{{fatigue_index}}/10
					</view>
					<view v-if="fatigue_index>=5&&sleep_point<60&&sleep_point!=='--/--'"
						style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
						<text>{{$t("高疲劳睡眠时长不足")}}</text>
					</view>
					<view v-else-if="fatigue_index<5&&(sleep_point<80&&sleep_point>60)&&sleep_point!=='--/--'"
						style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
						<text>{{$t("高疲劳深睡比例异常")}}</text>
					</view>
					<view v-else
						style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
					</view>
					<view
						style="padding: 0 20px 0 30px; color: #e60012;display: flex;flex-direction: row;align-items: center;">
						{{$t("恢复指数")}}：
					</view>
					<view
						style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
						{{recovery_index}}
					</view>
				</view>
				<view v-show="fenxi" style="font-size: 14px;font-weight: 600;color: #3298F7;">
					{{$t("建议")}}
					<view
						style="padding: 0 20px 20px 20px; color: #040000;display: flex;flex-direction: row;align-items: center;">
						{{fenxi}}
					</view>
				</view>
				<view v-show="fenxi||ppgnewpoint" style="width: 100%;height: 1px; background: gray;">
				</view>
				<view class="pagedsismj_4">
					<picker style="flex: 2;" @change="$emit('types-change', $event)" :value="types_index"
						:range="types_array">
						<view style="font-size: 14px;color: white;">
							{{types_array[types_index]}}
						</view>
					</picker>
					<picker @change="$emit('types-change', $event)" :value="types_index" :range="types_array">
						<uni-icons style="flex: 1;" type="bottom" size="18" color="white"></uni-icons>
					</picker>
				</view>
				<view
					style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
					{{$t('当天')}}：
				</view>
				<view class="charts-box-ppg">
					<qiun-data-charts type="line" :opts="optsPPG" :chartData="chartDataPPG" />
				</view>
				<view
					style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
					{{$t('两周')}}：{{$t('平均')}}
				</view>
				<view class="charts-box-ppg">
					<qiun-data-charts type="line" :opts="optsPPG2" :chartData="chartDataPPG2" />
				</view>
				<view style="margin-top: 20px; width: 100%;height: 1px; background: gray;">
				</view>
				<view class="page-transparent">
					<view style="font-size:17px;font-weight:600;display:flex;justify-content:center;">
						{{$t("指标阈值表")}}
					</view>
					<view class="table-box">
						<view class="thead">
							<text class="th2">{{$t("指标名称")}}</text>
							<text class="th2">{{$t("阈值")}}</text>
							<text class="th2">{{$t("对应描述")}}</text>
						</view>
						<view class="tbody" v-for="(row,i) in Indicatorlist" :key="i">
							<text class="td2">{{row.zh}}</text>
							<text class="td2">
								<text :class="row.red?'red':''">{{row.val}}</text>
							</text>
							<text class="td2">
								<text :class="row.red?'red':''">{{row.desc}}</text>
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'EmotionSwiperItem',
		props: {
			sleep_alertdisabled: {
				type: Boolean,
				default: false
			},
			ppgnewpoint: {
				type: [String, Number],
				default: ''
			},
			mood_Description: {
				type: String,
				default: ''
			},
			mood_level: {
				type: String,
				default: ''
			},
			depression_risk_score: {
				type: [String, Number],
				default: ''
			},
			depression_risk_level: {
				type: String,
				default: ''
			},
			finalResult: {
				type: Boolean,
				default: false
			},
			baoggaodisabled: {
				type: Boolean,
				default: false
			},
			stress_Index: {
				type: [String, Number],
				default: 0
			},
			fatigue_index: {
				type: [String, Number],
				default: 0
			},
			recovery_index: {
				type: [String, Number],
				default: 0
			},
			sleep_point: {
				type: [String, Number],
				default: '--/--'
			},
			fenxi: {
				type: String,
				default: ''
			},
			types_index: {
				type: Number,
				default: 0
			},
			types_array: {
				type: Array,
				default: () => []
			},
			optsPPG: {
				type: Object,
				default: () => ({})
			},
			chartDataPPG: {
				type: Object,
				default: () => ({
					categories: [],
					series: []
				})
			},
			optsPPG2: {
				type: Object,
				default: () => ({})
			},
			chartDataPPG2: {
				type: Object,
				default: () => ({
					categories: [],
					series: []
				})
			},
			Indicatorlist: {
				type: Array,
				default: () => []
			}
		}
	}
</script>

<style scoped>
	.btnstyle {
		margin-top: 20px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}

	.data_bg_ppg_set {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		padding: 20px 0 20px 0;
	}

	.charts-box-ppg {
		padding: 5px;
		background: white;
		border-radius: 20px;
		height: auto;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.pagedsismj_4 {
		background: #3298F7;
		margin: 20px 0;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		padding: 15px;
		border-radius: 20px;
	}

	.page-transparent {
		background: transparent;
		padding: 20rpx;
	}

	.table-box {
		display: flex;
		flex-direction: column;
		border: 1rpx solid rgba(0, 0, 0, 0.15);
		border-radius: 8rpx;
		overflow: hidden;
	}

	.thead {
		display: flex;
		background: rgba(0, 0, 0, 0.03);
	}

	.th2 {
		flex: 1;
		padding: 14rpx 10rpx;
		font-size: 26rpx;
		color: #333;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.th2:last-child {
		border-right: 0;
	}

	.tbody {
		display: flex;
		border-top: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td2 {
		flex: 1;
		padding: 12rpx 10rpx;
		font-size: 26rpx;
		color: #444;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td2:last-child {
		border-right: 0;
	}

	.red {
		color: #e60012;
		font-weight: 500;
	}
</style>
