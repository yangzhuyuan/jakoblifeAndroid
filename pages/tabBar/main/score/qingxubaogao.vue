<template>
	<view style="background: white;padding-bottom: 80px;">
		<view style="padding: 20px; display: flex;justify-content: center;color: red;">
			{{$t("免责声明重要提示本报告结果由算法生成")}}
		</view>
		<view style="width: 100%;height: 1px; background: gray;"></view>
		<view class="score" style="padding: 20px;font-size: 16px;">
			<text :style="{ color: levelColor }">{{$t("总分")}}：{{ total }}</text>
			<text :style="{ color: levelColor }">{{$t(level)}}</text>
			<text :style="{ color: levelColor }">{{$t("分层行动建议")}}:{{$t(Hierarchical)}}</text>
			<text style="color: #3298F7;">{{$t("心理健康周报")}}：</text>
			<text style="font-size: 14px;padding-left: 15px;">{{$t("周期")}}：{{startTime}}{{$t("至")}}{{endTime}}</text>
			<text style="font-size: 14px;padding-left: 15px;">{{$t("定期评估警示")}}</text>
			<view v-show="lowMoodDays>=10||highStressFatigueDays>=10" style="display: flex;flex-direction: column;">
				<text style="color: #3298F7;">{{$t("监测周期说明")}}：</text>
				<text style="font-size: 14px;padding-left: 15px;">{{$t("本次健康评估采用连续14天的生态瞬时监测")}}</text>
			</view>
			<text style="color: #3298F7;">{{$t("核心发现")}}：</text>
			<text style="font-size: 14px; padding-left: 15px;">{{$t("在过去的14天里")}}</text>
			<text style="font-size: 14px; padding-left: 25px;">{{$t("心情指数偏低天数")}}：<text
					style="color: #3298F7;font-size: 18px;">{{lowMoodDays}}</text>/14{{$t("达标")}}</text>
			<text style="font-size: 14px; padding-left: 25px;">{{$t("伴随高疲劳压力天数")}}：<text
					style="color: #3298F7;font-size: 18px;">{{highStressFatigueDays}}</text>/14{{$t("达标")}}</text>
			<text style="font-size: 14px; padding-left: 25px;">{{$t("心率变异性分析")}}</text>
			<text style="color: #3298F7;">{{$t("请注意此趋势")}}</text>
		</view>
		<button @click="scorebtn()"
			style="margin: 20px; border-radius: 30px;background: #3298F7;color: white;">{{$t("患者健康问卷")}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				questions: "",
				total: "",
				level: "",
				levelColor: "",
				Hierarchical: '',
				startTime: '',
				endTime: '',
				lowMoodDays: '',
				highStressFatigueDays: '',

			}
		},

		onLoad(optionts) {
			// console.log(JSON.stringify(optionts))
			this.lowMoodDays = optionts.MoodDays
			this.highStressFatigueDays = optionts.StressFatigueDays

		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("详细报告")
			})

			const cache = uni.getStorageSync("PHQ9_LAST");
			// console.log(cache)
			// if (cache) {
			// this.questions = cache.questions;
			// this.total = cache.total;
			// this.level = cache.level;
			// this.levelColor = cache.levelColor;
			// }

			this.questionnairelist()
			this.endTime = this.getCurrentTimePPG()
			let initialDate = new Date(this.endTime)
			let minusOneWeek = new Date(initialDate)
			minusOneWeek.setDate(minusOneWeek.getDate() - 13) // 两周
			this.startTime = minusOneWeek.toISOString().replace('T', ' ').substring(0, 10)


		},
		methods: {


			getCurrentTimePPG() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(
					2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2,
					'0');
				const minutes = String(now.getMinutes()).padStart(
					2, '0');
				const seconds = String(now.getSeconds()).padStart(
					2, '0');
				return `${year}-${month}-${day}`;
			},

			questionnairelist() {
				let data = {
					patientId: uni.getStorageSync("userid"), //患者唯一标识
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/questionnaire/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((questionnairelist) => {
					console.log("questionnairelist", questionnairelist)
					if (questionnairelist.code === 200) {
						this.total = questionnairelist.rows[questionnairelist.total - 1].totalScore;
						switch (questionnairelist.rows[questionnairelist.total - 1].severityLevel) {
							case "none":
								this.level = "没有抑郁";
								this.levelColor = "#67c23a";
								this.Hierarchical = "分层行动建议2"
								break
							case "mild":
								this.level = "轻度抑郁";
								this.levelColor = "#e6a23c";
								this.Hierarchical = "分层行动建议1"
								break
							case "moderate":
								this.level = "中度抑郁";
								this.levelColor = "#f56c6c";
								this.Hierarchical = "分层行动建议1"
								break
							case "moderately_severe":
								this.level = "中重度抑郁";
								this.levelColor = "#ff4d4f";
								this.Hierarchical = "分层行动建议1"
								break
							case "severe":
								this.level = "重度抑郁";
								this.levelColor = "#cf1322";
								this.Hierarchical = "分层行动建议1"
								break
						}
					}
				})
			},

			scorebtn() {
				uni.showModal({
					content: this.$t("为了更准确地了解您的情绪状态"),
					confirmText: this.$t('确定'),
					cancelText: this.$t('取消'),
					success(modal) {
						if (modal.confirm) {
							uni.navigateTo({
								url: '/pages/tabBar/main/score/score'
							})
						}
					}
				})
			},

		}
	}
</script>

<style>
	.score {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
	}
</style>