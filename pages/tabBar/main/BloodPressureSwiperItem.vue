<template>
	<view class="home-bp-page">
		<HealthSummaryPanel ref="panel" :embedded="true" :tabActive="tabActive" :syncHighPressure="highPressure"
			:syncArmCuffBp="armCuffHomeBp"
			:syncLowPressure="lowPressure" :syncPulse="pulse" :syncPulseTime="pulsetime" :syncSpo2="xueyang"
			:syncSpo2Time="xueyangtimes" :syncList="list" @measure-link="$emit('measure-link', $event)"
			@xueya-tap="$emit('xueya-tap')" @bmi-tap="$emit('bmi-tap', $event)" />
	</view>
</template>

<script>
	import BasicDrag from '@/components/basic-drag/index.vue';
	import HealthSummaryPanel from './Health_Summary_Panel.vue'

	export default {
		name: 'BloodPressureSwiperItem',
		components: {
			BasicDrag,
			HealthSummaryPanel
		},
		props: {
			armCuffHomeBp: {
				type: Object,
				default: null
			},
			Languageceliang: {
				type: String,
				default: ''
			},
			xueya: {
				type: Number,
				default: 0
			},
			title_name: {
				type: String,
				default: ''
			},
			Blood: {
				type: String,
				default: ''
			},
			highPressure: {
				type: [String, Number],
				default: '--/--'
			},
			lowPressure: {
				type: [String, Number],
				default: '--/--'
			},
			pulse: {
				type: [String, Number],
				default: '--/--'
			},
			pulsetime: {
				type: [String, Number],
				default: ''
			},
			xueyang: {
				type: [String, Number],
				default: ''
			},
			xueyangtimes: {
				type: [String, Number],
				default: ''
			},
			binaji: {
				type: Boolean,
				default: false
			},
			list: {
				type: Array,
				default: () => []
			},
			disabledsaaa: {
				type: Boolean,
				default: true
			},
			animation: {
				type: String,
				default: ''
			},
			delate_icon: {
				type: Boolean,
				default: false
			},
			button_show: {
				type: Boolean,
				default: false
			},
			tabActive: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			listModel: {
				get() {
					return this.list
				},
				set(val) {
					this.$emit('update:list', val)
				}
			}
		},
		watch: {
			Blood() {
				this.syncPanelUnits();
			},
			highPressure() {
				this.syncPanelFromHome();
			},
			lowPressure() {
				this.syncPanelFromHome();
			},
			pulse() {
				this.syncPanelFromHome();
			},
			pulsetime() {
				this.syncPanelFromHome();
			},
			xueyang() {
				this.syncPanelFromHome();
			},
			xueyangtimes() {
				this.syncPanelFromHome();
			},
			list: {
				deep: true,
				handler() {
					this.syncPanelFromHome();
				}
			},
			tabActive(val) {
				if (val) {
					this.syncPanelUnits();
					this.refreshPanel();
				}
			}
		},
		methods: {
			syncPanelUnits() {
				if (this.$refs.panel && this.$refs.panel.syncUnitSettings) {
					this.$refs.panel.syncUnitSettings();
				}
			},
			syncPanelFromHome() {
				if (this.$refs.panel && this.$refs.panel.applyHomeSync) {
					this.$refs.panel.applyHomeSync();
				}
			},
			refreshPanel() {
				if (this.$refs.panel && this.$refs.panel.refreshData) {
					this.$refs.panel.refreshData();
				}
			},
			isVitalCardIcon(title) {
				if (!title) return false
				const t = String(title)
				return t === this.$t('心率') || t === this.$t('血氧') || t === 'Heart' || t === 'SpO₂'
			}
		}
	}
</script>

<style scoped>
	.home-bp-page {
		background: #F8F9FB;
		padding-bottom: 40px;
	}

	.home-cards-bottom {
		padding-top: 8px;
	}

	.data_bg {
		min-height: 116px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 8px 16px 0 16px;
		background: #FFFFFF;
		border-radius: 16px;
		padding: 12px 8px;
		box-shadow: 0 4px 14px rgba(16, 24, 40, 0.04);
		border: 1px solid rgba(16, 24, 40, 0.03);
	}

	.data_bg_A {
		background: #F8F9FB;
		margin-top: 12px;
		padding: 8px 0 0 0;
	}

	.title_zs1 {
		display: flex;
		margin-right: 20px;
		margin-left: 20px;
		margin-bottom: 20px;
		color: #8E8E93;
		font-weight: 600;
		font-size: 12px;
	}

	.tzkpsx {
		height: 38px;
		width: auto;
		display: flex;
		justify-content: center;
		background: #FFFFFF;
		align-items: center;
		margin: 10px 16px 16px 16px;
		padding: 10px;
		font-size: 13px;
		font-weight: 500;
		border-radius: 16px;
		color: #007AFF;
		box-shadow: 0 4px 14px rgba(16, 24, 40, 0.04);
		border: 1px solid rgba(16, 24, 40, 0.03);
	}

	.icon_bg {
		flex: 1;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.card-vital-icon-wrap {
		position: relative;
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.img_style_celiang {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: contain;
	}

	.bp-measure-btn {
		padding: 6px 0;
		min-width: 56px;
	}

	.bp-measure-action {
		margin-top: 6px;
		font-size: 11px;
		line-height: 14px;
		color: #3298F7;
		font-weight: 500;
		text-align: center;
	}

	.bp-measure-label {
		margin-top: 2px;
		font-size: 13px;
		line-height: 18px;
		font-weight: bold;
		color: #8E8E93;
		text-align: center;
	}

	.xueya_all {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		margin-right: 20px;
		flex: 4;
	}

	.xueya_item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.xueya_bg {
		width: 10px;
		height: 10px;
		background: #34C759;
		border-radius: 15px;
	}

	.xueya_bg_1 {
		width: 10px;
		height: 10px;
		background: #FF9500;
		border-radius: 50px;
	}

	.xueya_bg_2 {
		width: 10px;
		height: 10px;
		background: #FF9500;
		border-radius: 50px;
	}

	.xueya_bg_3 {
		width: 10px;
		height: 10px;
		background: #FF3B30;
		border-radius: 50px;
	}

	.xueya_bg_4 {
		width: 10px;
		height: 10px;
		background: #FFF176;
		border-radius: 50px;
	}

	.common-style {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.common-text {
		margin-left: 5px;
		font-size: 14px;
		font-weight: 400;
		color: #8E8E93;
	}

	.borstysdl {
		width: auto;
		background: #F2F2F7;
		height: 1px;
		margin-top: 5px;
	}

	.yalisdsty {
		display: flex;
		flex-direction: row;
		margin-top: 5px;
		align-items: center;
		justify-content: space-between;
	}

	.yalisdjjj {
		color: #8E8E93;
		font-size: 10px;
		font-weight: 400;
	}

	.yalisdjjj2 {
		font-weight: 700;
		margin-top: 8px;
		font-size: 18px;
		color: #007AFF;
	}

	.drag-containersss {
		display: flex;
		justify-content: center;
		padding-left: 16px;
	}

	.data_item_bgsss {
		height: 90px;
		line-height: 20px;
		width: 36vw;
		display: flex;
		flex-direction: row;
		background: #FFFFFF;
		justify-content: space-between;
		align-items: center;
		border-radius: 16px;
		padding: 10px;
		position: relative;
		box-shadow: 0 4px 14px rgba(16, 24, 40, 0.04);
		border: 1px solid rgba(16, 24, 40, 0.03);
	}

	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bgsss {
		margin-top: 8px;
		line-height: 15px;
		width: 60px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
		color: #8E8E93;
	}

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.elementsduu {
		display: flex;
		flex-direction: column;
		font-weight: bold;
		margin-right: 5px;
	}

	.tesdtsdsdk {
		margin-left: 5px;
		color: #8E8E93;
		font-size: 10px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: auto;
		width: 45px;
		text-align: right;
	}

	.enlkij {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.BMI_TF_0 {
		width: 10px;
		height: 10px;
		background: #FF9500;
		border-radius: 50px;
	}

	.BMI_TF_1 {
		width: 10px;
		height: 10px;
		background: #34C759;
		border-radius: 50px;
	}

	.BMI_TF_2 {
		width: 10px;
		height: 10px;
		background: #FF9500;
		border-radius: 50px;
	}

	.BMI_TF_3 {
		width: 10px;
		height: 10px;
		background: #FF3B30;
		border-radius: 50px;
	}

	.BMI_TF_4 {
		width: 10px;
		height: 10px;
		background: #7A0101;
		border-radius: 50px;
	}

	.BMI_TF_10 {
		width: 10px;
		height: 10px;
		background: #34C759;
		border-radius: 50px;
	}

	.BMI_TF_5 {
		width: 10px;
		height: 10px;
		background: #C7C7CC;
		border-radius: 50px;
	}

	.teststuld {
		text-align: right;
		font-size: 16px;
		margin-left: 10px;
		color: #007AFF;
		font-weight: 700;
	}

	.teststuld_1 {
		text-align: right;
		color: #8E8E93;
		font-size: 10px;
	}

	.teststuld_2 {
		text-align: right;
		font-size: 13px;
		color: #3A3A3C;
	}

	.animation-shake {
		animation: shake 1s infinite;
	}

	@keyframes shake {
		0% {
			transform: translateX(0) rotate(-2deg)
		}

		50% {
			transform: translateX(5px) rotate(2deg)
		}

		100% {
			transform: translateX(0) rotate(-2deg)
		}
	}

	.btnshow {
		display: flex;
		flex-direction: column;
		margin: 20px 0;
	}

	.tuodongsd {
		display: flex;
		justify-content: center;
		color: #8E8E93;
	}

	.quernsda {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
	}

	.cardstyle_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #FFFFFF;
		color: #007AFF;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 16px;
		padding: 10px;
		text-align: center;
		margin-right: 10px;
		margin-left: 10vw;
		box-shadow: 0 4px 14px rgba(16, 24, 40, 0.04);
		border: 1px solid rgba(16, 24, 40, 0.03);
	}

	.cardstyle_2 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #FFFFFF;
		color: #007AFF;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 16px;
		padding: 10px;
		text-align: center;
		margin-left: 10px;
		margin-right: 10vw;
		box-shadow: 0 4px 14px rgba(16, 24, 40, 0.04);
		border: 1px solid rgba(16, 24, 40, 0.03);
	}

	.imashtylkkk {
		width: 88vw;
		height: 220px;
		margin: 0 20px 120px 20px;
		border-radius: 16px;
		object-fit: contain;
	}

	.delete-button {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.01);
		z-index: 10;
	}

	.delete-icon {
		width: 25px;
		height: 25px;
		pointer-events: none;
	}

	.del-hover {
		opacity: 0.7;
		transform: scale(0.95);
		transition: all 0.1s;
	}
</style>
