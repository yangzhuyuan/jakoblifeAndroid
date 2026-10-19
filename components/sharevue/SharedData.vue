<template>
	<view class="share-data-card">
		<view class="share-data-title">{{$t('共享数据')}}</view>
		<view class="share-data-list">
			<view class="share-data-row" v-for="(dataPoint, index) in dataPoints" :key="index">
				<view class="share-data-left">
					<image class="share-data-icon" mode="aspectFit" :src="getRegisterIcon(dataPoint.register)"></image>
					<view class="share-data-label">{{ getRegisterName(dataPoint.register) }}</view>
				</view>
				<view class="share-data-right">
					<view class="share-data-value">
						{{ getRegisterValue(dataPoint.register, dataPoint.registerVal) }}
					</view>
					<view v-if="show1" class="share-data-arrow">
						<uni-icons type="right" size="16" color="#C0C4CC"></uni-icons>
					</view>
					<view v-else class="share-data-arrow">
						<view v-if="getRegisterValueICON(dataPoint.register, dataPoint.registerVal)">
							<image @click="viewHistory(getRegisterName(dataPoint.register),item.sharerId)"
								mode="aspectFit" class="share-history-icon"
								:src="getRegisterValueICON(dataPoint.register, dataPoint.registerVal)"></image>
						</view>
						<view v-else>
							<uni-icons type="right" size="16" color="#C0C4CC"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
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
					mood_index: this.$t("心情指数"),
					depression_risk_score: this.$t("抑郁风险评分"),
					stress_index: this.$t("压力指数"),
					fatigue_index: this.$t("疲劳指数"),
					recovery_index: this.$t("恢复指数"),
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
			getRegisterIcon(register) {
				const icons = {
					lowPressure: '/static/icons/3.png',
					highPressure: '/static/icons/3.png',
					heartrate: '/static/icons/5.png',
					oxygen: '/static/page_icon/10.png',
					height: '/static/icons/2.png',
					weight: '/static/icons/6.png',
					start_weight: '/static/page_icon/chushitizhong.png',
					goal_weight: '/static/page_icon/mubiao.png',
					bmi: '/static/icons/4.png',
					mood_index: '/static/icons/5.png',
					depression_risk_score: '/static/icons/5.png',
					stress_index: '/static/icons/5.png',
					fatigue_index: '/static/icons/5.png',
					recovery_index: '/static/icons/5.png',
					temperature: '/static/icons/3.png',
					pressure: '/static/icons/3.png',
					chest_circumference: '/static/icons/12.png',
					waistline: '/static/icons/12.png',
					hipline: '/static/icons/12.png',
					biceps_circumference: '/static/icons/9.png',
					thigh_circumference: '/static/icons/8.png',
					calf_circumference: '/static/icons/8.png'
				};
				return icons[register] || '/static/icons/3.png';
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
					pressure: 'kPa',
					mood_index: "/10",
					depression_risk_score: "/10",
					stress_index: "/10",
					fatigue_index: "/10",
					recovery_index: "/10",
				};
				return `${value}${units[register] || ''}`;
			},
			getRegisterValueICON(register, value) {
				const imageicon = {
					lowPressure: "/static/page_icon/share_chakan.png",
					highPressure: "/static/page_icon/share_chakan.png",
					heartrate: "/static/page_icon/share_chakan.png",
					mood_index: "/static/page_icon/share_chakan.png",
					depression_risk_score: "/static/page_icon/share_chakan.png",
					stress_index: "/static/page_icon/share_chakan.png",
					fatigue_index: "/static/page_icon/share_chakan.png",
					recovery_index: "/static/page_icon/share_chakan.png",
				};
				return `${imageicon[register] || ''}`;
			},
			viewHistory(register, shareid) {
				console.log("register", register)
				console.log("shareid", shareid)
				if (this.show1) return
				if (register === this.$t('舒张压') || register === this.$t('收缩压') || register === this.$t('脉搏')) {
					uni.navigateTo({
						url: `../share/share_history_BOOL?register=${register}&shareid=${shareid}`
					})
				} else {
					uni.navigateTo({
						url: `../share/share_history?register=${register}&shareid=${shareid}`
					})
				}
			},
		}
	}
</script>

<style scoped>
	.share-data-card {
		display: flex;
		align-items: stretch;
		flex-direction: column;
		background: #FFFFFF;
		border-radius: 18px;
		padding: 16px 14px 10px;
		margin-top: 15px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		box-sizing: border-box;
		margin-left: 1px;
		margin-right: 1px;
	}

	.share-data-title {
		font-weight: 700;
		font-size: 16px;
		color: #1A1A1A;
		padding: 0 2px 10px;
	}

	.share-data-list {
		width: 100%;
	}

	.share-data-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 16px 2px;
		border-bottom: 1px solid #F0F2F5;
		box-sizing: border-box;
	}

	.share-data-row:last-child {
		border-bottom: none;
	}

	.share-data-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex: 1;
		min-width: 0;
		padding-right: 12px;
	}

	.share-data-icon {
		width: 32px;
		height: 32px;
		margin-right: 10px;
		flex-shrink: 0;
		border-radius: 50%;
	}

	.share-data-label {
		flex: 1;
		min-width: 0;
		font-weight: 500;
		font-size: 15px;
		color: #1A1A1A;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.share-data-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
	}

	.share-data-value {
		color: #666666;
		font-weight: 500;
		font-size: 15px;
		text-align: right;
		margin-right: 6px;
		line-height: 1.3;
	}

	.share-data-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.share-history-icon {
		width: 22px;
		height: 22px;
		object-fit: contain;
	}
</style>