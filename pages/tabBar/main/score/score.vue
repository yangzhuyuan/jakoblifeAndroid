<template>
	<view class="wrap">
		<!-- 1. 选项分值对照 -->
		<view class="header">PHQ-9{{$t("问卷与评分标准")}}</view>
		<view class="table-box">
			<!-- 表格体 -->
			<view class="tbody" v-for="(row, i) in optionslist" :key="i">
				<text class="td">{{ row.val1 }}</text>
				<text class="td">
					<text>{{ row.val2 }}</text>
				</text>
				<text class="td">
					<text>{{ row.val3 }}</text>
				</text>
				<text class="td">
					<text>{{ row.val4 }}</text>
				</text>
			</view>
		</view>
		<!-- 进度条 -->
		<view class="progress-box">
			<progress :percent="percent" stroke-width="6" border-radius="6" activeColor="#409eff"
				backgroundColor="#ebeef5" show-info />
		</view>

		<!-- 题目列表 -->
		<view class="card" v-for="(item, index) in questions" :key="index">
			<view class="q">{{ index + 1 }}. {{$t(item.q)}}</view>
			<radio-group @change="radioChange($event, index)" class="radio-group">
				<label class="radio-item" v-for="(opt, oIdx) in options" :key="oIdx">
					<radio :value="oIdx + ''" :checked="item.value == oIdx" />
					<text>{{ opt }}</text>
				</label>
			</radio-group>
		</view>

		<!-- 结果区 -->
		<view class="footer">
			<button type="primary" @click="submit">{{$t("提交查看结果")}}</button>
		</view>

		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="score_popup" :mask-click="true">
				<view class="popup-content">
					<view class="score">{{$t("总分")}}：<text :style="{ color: levelColor }">{{ total }}</text></view>
					<!-- <text class="level" :style="{ color: levelColor }">{{ level }}</text> -->
					<text class="level">{{$t("返回情绪页面点击报告查看详细报告")}}</text>
					<button @tap="score_close()"
						style="width: 100%; margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				optionslist: [{
						val1: this.$t("没有"),
						val2: this.$t("有几天"),
						val3: this.$t("一半以上时间"),
						val4: this.$t("几乎每天"),
					},
					{
						val1: "0",
						val2: '1',
						val3: "2",
						val4: "3"
					},
				],
				options: [this.$t("没有"), this.$t("有几天"), this.$t("一半以上时间"), this.$t("几乎每天")],
				questions: [{
						q: "PHQ_9_1",
						value: null
					},
					{
						q: "PHQ_9_2",
						value: null
					},
					{
						q: "PHQ_9_3",
						value: null
					},
					{
						q: "PHQ_9_4",
						value: null
					},
					{
						q: "PHQ_9_5",
						value: null
					},
					{
						q: "PHQ_9_6",
						value: null
					},
					{
						q: "PHQ_9_7",
						value: null
					},
					{
						q: "PHQ_9_8",
						value: null
					},
					{
						q: "PHQ_9_9",
						value: null
					}
				],
				total: null,
				level: "",
				levelColor: ""
			};
		},
		computed: {
			percent() {
				const done = this.questions.filter(q => q.value !== null).length;
				return Math.round((done / this.questions.length) * 100);
			}
		},
		onLoad() {
			// 读取本地缓存
			const cache = uni.getStorageSync("PHQ9_LAST");
			if (cache) {
				this.questions = cache.questions;
				this.total = cache.total;
				this.level = cache.level;
				this.levelColor = cache.levelColor;
			}
		},

		onShow() {
			// uni.removeStorageSync("PHQ9_LAST")
			uni.setNavigationBarTitle({
				title: this.$t("患者健康问卷")
			})
		},
		methods: {
			radioChange(e, index) {
				this.$set(this.questions[index], "value", parseInt(e.detail.value));
			},
			submit() {
				const undone = this.questions.find(q => q.value === null);
				if (undone) {
					uni.showToast({
						title: this.$t("请完成所有题目"),
						icon: "none"
					});
					return;
				}
				const sum = this.questions.reduce((s, q) => s + q.value, 0);
				this.total = sum;
				if (sum <= 4) {
					this.level = this.$t("没有抑郁");
					this.levelColor = "#67c23a";
				} else if (sum <= 9) {
					this.level = this.$t("轻度抑郁");
					this.levelColor = "#e6a23c";
				} else if (sum <= 14) {
					this.level = this.$t("中度抑郁");
					this.levelColor = "#f56c6c";
				} else if (sum <= 19) {
					this.level = this.$t("中重度抑郁");
					this.levelColor = "#ff4d4f";
				} else {
					this.level = this.$t("重度抑郁");
					this.levelColor = "#cf1322";
				}
				// 本地缓存
				uni.setStorageSync("PHQ9_LAST", {
					questions: this.questions,
					total: this.total,
					level: this.level,
					levelColor: this.levelColor
				});
				console.log(uni.getStorageSync("PHQ9_LAST"))
				this.$refs.score_popup.open("center")
			},
			score_close() {
				this.$refs.score_popup.close()
				uni.navigateBack()
			}
		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 30px;
		background-color: #f5f7fa;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		margin-bottom: 30rpx;

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #303133;
		}

		.sub {
			display: block;
			font-size: 28rpx;
			color: #909399;
			margin-top: 8rpx;
		}
	}

	.progress-box {
		margin-top: 15px;
		margin-bottom: 15px;
	}

	.card {
		background: #fff;
		border-radius: 12rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

		.q {
			font-size: 30rpx;
			color: #606266;
			margin-bottom: 20rpx;
		}

		.radio-group {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}

		.radio-item {
			width: 48%;
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;
			font-size: 28rpx;
			color: #606266;

			radio {
				transform: scale(0.8);
				margin-right: 8rpx;
			}
		}
	}

	.footer {
		margin-top: 40rpx;

		button {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			border-radius: 12rpx;
		}

		.result {
			margin-top: 30rpx;
			text-align: center;

			.score {
				font-size: 34rpx;
				font-weight: bold;
				color: #303133;
				margin-right: 20rpx;
			}

			.level {
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}

	.score {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 20px;
	}

	.level {
		font-size: 32rpx;
		font-weight: bold;
	}

	.popup-content {
		width: 60vw;
		display: flex;
		text-align: left;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border-radius: 20px;
		padding: 40px 20px 0 20px;
		background-color: #fff;
	}


	.page {
		background-color: #ffffff;
		min-height: 100vh;
	}



	.table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		border: 2rpx solid #e0e0e0;
	}

	.tr {
		display: table-row;
	}

	.head {
		background-color: #f5f5f5;
	}

	.th,
	.td {
		display: table-cell;
		padding: 16rpx 12rpx;
		border: 2rpx solid #e0e0e0;
		font-size: 28rpx;
		line-height: 1.4;
		vertical-align: middle;
	}

	.th {
		font-weight: bold;
		text-align: center;
	}

	.td:first-child {
		text-align: center;
		font-weight: 500;
	}


	/* 整个页面透明 */
	.page-transparent {
		background: transparent;
		padding: 20rpx;
	}

	/* 表格容器 */
	.table-box {
		display: flex;
		flex-direction: column;
		border: 1rpx solid rgba(0, 0, 0, 0.15);
		border-radius: 8rpx;
		overflow: hidden;
	}

	/* 表头 */
	.thead {
		display: flex;
		background: rgba(0, 0, 0, 0.03);
	}

	.th {
		flex: 1;
		padding: 14rpx 10rpx;
		font-size: 26rpx;
		color: #333;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.th:last-child {
		border-right: 0;
	}

	/* 行 */
	.tbody {
		display: flex;
		border-top: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td {
		flex: 1;
		padding: 12rpx 10rpx;
		font-size: 26rpx;
		color: #444;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td:last-child {
		border-right: 0;
	}

	/* 红色高亮 */
	.red {
		color: #e60012;
		font-weight: 500;
	}
</style>