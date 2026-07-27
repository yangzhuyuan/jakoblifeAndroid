<template>
	<view>
		<view class="data_bg">
			<view class="icon_bg bp-measure-btn" @click="$emit('measure-link', 1)">
				<view class="card-vital-icon-wrap">
					<image lazy-load
						:src="Languageceliang == 'zh-Hans' || Languageceliang == 'zh-Hant' ? '../../../static/icons/3.png' : '../../../static/icons/3.png'"
						class="img_style_celiang" mode="aspectFit" />
				</view>
				<text class="bp-measure-action">{{$t('测量')}}</text>
				<text class="bp-measure-label">{{$t('血压')}}</text>
			</view>
			<view class="xueya_all">
				<view v-if="xueya == 0" class="xueya_item">
					<view class="xueya_bg"></view>
					<view class="common-style">
						<view class="common-text">{{title_name}}</view>
						<uni-icons type="help" size="15" @tap="$emit('xueya-tap')"></uni-icons>
					</view>
				</view>
				<view v-else-if="xueya == 1" class="xueya_item">
					<view class="xueya_bg_1"></view>
					<view class="common-style">
						<view class="common-text">{{title_name}}</view>
						<uni-icons type="help" size="15" @tap="$emit('xueya-tap')"></uni-icons>
					</view>
				</view>
				<view v-else-if="xueya == 2" class="xueya_item">
					<view class="xueya_bg_2"></view>
					<view class="common-style">
						<view class="common-text">{{title_name}}</view>
						<uni-icons type="help" size="15" @tap="$emit('xueya-tap')"></uni-icons>
					</view>
				</view>
				<view v-else-if="xueya == 3" class="xueya_item">
					<view class="xueya_bg_3"></view>
					<view class="common-style">
						<view class="common-text">{{title_name}}</view>
						<uni-icons type="help" size="15" @tap="$emit('xueya-tap')"></uni-icons>
					</view>
				</view>
				<view v-else-if="xueya == 4" class="xueya_item">
					<view class="xueya_bg_4"></view>
					<view class="common-style">
						<view class="common-text">{{title_name}}</view>
						<uni-icons type="help" size="15" @tap="$emit('xueya-tap')"></uni-icons>
					</view>
				</view>
				<view class="borstysdl"></view>
				<view @click="$emit('xueya-click')" class="yalisdsty">
					<view>
						<view class="yalisdjjj">{{$t('收缩压')}}/{{Blood}}</view>
						<view class="yalisdjjj2">{{highPressure}}</view>
					</view>
					<view>
						<view class="yalisdjjj">{{$t('舒张压')}}/{{Blood}}</view>
						<view class="yalisdjjj2">{{lowPressure}}</view>
					</view>
					<view style="margin-left: 10px;">
						<view class="yalisdjjj">{{$t('脉搏')}}/BPM</view>
						<view class="yalisdjjj2" :key="'pulse-' + pulse">{{pulse}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="data_bg_A">
			<view class="title_zs1">{{$t('血压计注意事项')}}</view>
			<view v-show="binaji" class="tzkpsx" @click="$emit('edit-cards')">{{$t("编辑数据卡片")}}</view>
			<view class="drag-containersss">
				<basic-drag v-model="listModel" :disabled="disabledsaaa" itemKey="title" :column="2"
					itemHeight="130px" @update:disabled="$emit('update:disabled', $event)">
					<template #item="{element}">
						<view class="data_item_bgsss" :class="'animation-' + animation"
							@click="$emit('card-click', element)">
							<view class="icon_bgsss">
								<view v-if="isVitalCardIcon(element.title)" class="card-vital-icon-wrap">
									<image :src="element.image" class="img_style_celiang "
										mode="aspectFit" />
								</view>
								<image v-else :src="element.image" class="img_style" mode="aspectFit" />
								<text v-if="isVitalCardIcon(element.title)"
									class="bp-measure-action">{{$t('测量')}}</text>
								<text class="icon_text_bgsss">{{element.title}}</text>
							</view>
							<view class="elementsduu">
								<view v-if="element.bmi_show">
									<view class="xueya_item">
										<text class="tesdtsdsdk">{{element.BMI_ys}}</text>
										<uni-icons type="help" size="15" @tap="$emit('bmi-tap', element.title)" />
									</view>
								</view>
								<view class="enlkij">
									<view v-if="element.bmi_show">
										<view v-if="element.BMI_TF === 0">
											<view class="BMI_TF_0" />
										</view>
										<view v-else-if="element.BMI_TF === 1">
											<view class="BMI_TF_1" />
										</view>
										<view v-else-if="element.BMI_TF ==2">
											<view class="BMI_TF_2" />
										</view>
										<view v-else-if="element.BMI_TF ==3">
											<view class="BMI_TF_3" />
										</view>
										<view v-else-if="element.BMI_TF ==4">
											<view class="BMI_TF_4" />
										</view>
										<view v-else-if="element.BMI_TF ==10">
											<view class="BMI_TF_10" />
										</view>
										<view v-else>
											<view class="BMI_TF_5" />
										</view>
									</view>
									<text class="teststuld">{{element.Step_number}}</text>
								</view>
								<text class="teststuld_1">{{element.type_LX}}</text>
								<text class="teststuld_2">{{element.Step_count}}</text>
							</view>
							<view v-show="delate_icon" class="delete-button"
								@touchstart.stop.prevent="$emit('delete-card', element.title, element)"
								hover-class="del-hover">
								<image src="/static/icons/minus_filled.png" class="delete-icon" mode="aspectFit" />
							</view>
						</view>
					</template>
				</basic-drag>
			</view>
			<view v-show="button_show" class="btnshow">
				<view class="tuodongsd">{{$t('长按拖动可调整数据卡片位置')}}</view>
				<view class="quernsda">
					<view @click="$emit('confirm-cards')" class="cardstyle_1">{{$t('确认')}}</view>
					<view @tap.stop="$emit('add-card')" class="cardstyle_2">{{$t('添加数据卡片')}}</view>
				</view>
			</view>
			<view>
				<image class="imashtylkkk" lazy-load src="/static/image/yundomng2.png" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
	import BasicDrag from '@/components/basic-drag/index.vue';

	export default {
		name: 'BloodPressureSwiperItem',
		components: {
			BasicDrag
		},
		props: {
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
		methods: {
			isVitalCardIcon(title) {
				if (!title) return false
				const t = String(title)
				return t === this.$t('心率') || t === this.$t('血氧') || t === 'Heart' || t === 'SpO₂'
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

	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 0 0 0;
	}

	.title_zs1 {
		display: flex;
		margin-right: 20px;
		margin-left: 20px;
		margin-bottom: 20px;
		color: black;
		font-weight: 600;
		font-size: 12px;
	}

	.tzkpsx {
		height: 38px;
		width: auto;
		display: flex;
		justify-content: center;
		background: white;
		align-items: center;
		margin: 10px 20px 20px 20px;
		padding: 10px;
		font-size: 13px;
		font-weight: 400;
		border-radius: 10px;
		color: #3298F7;
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
		color: #222328;
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
		width: 14px;
		height: 14px;
		background: #58BF78;
		border-radius: 15px;
	}

	.xueya_bg_1 {
		width: 14px;
		height: 14px;
		background: #FFEC01;
		border-radius: 50px;
	}

	.xueya_bg_2 {
		width: 14px;
		height: 14px;
		background: #FCCD41;
		border-radius: 50px;
	}

	.xueya_bg_3 {
		width: 14px;
		height: 14px;
		background: #F55A5A;
		border-radius: 50px;
	}

	.xueya_bg_4 {
		width: 14px;
		height: 14px;
		background: #FFFFFF;
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
	}

	.borstysdl {
		width: auto;
		background: #CCCCCC;
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
		color: #999999;
		font-size: 10px;
		font-weight: 400;
	}

	.yalisdjjj2 {
		font-weight: bold;
		margin-top: 10px;
		font-size: 16px;
	}

	.drag-containersss {
		display: flex;
		justify-content: center;
		padding-left: 20px;
	}

	.data_item_bgsss {
		height: 90px;
		line-height: 20px;
		width: 36vw;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: space-between;
		align-items: center;
		border-radius: 20px;
		padding: 10px;
		position: relative;
	}

	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
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
		color: black;
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
		background: #FCCD41;
		border-radius: 50px;
	}

	.BMI_TF_1 {
		width: 10px;
		height: 10px;
		background: #58BF78;
		border-radius: 50px;
	}

	.BMI_TF_2 {
		width: 10px;
		height: 10px;
		background: #FC7F41;
		border-radius: 50px;
	}

	.BMI_TF_3 {
		width: 10px;
		height: 10px;
		background: #F55A5A;
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
		background: #58BF78;
		border-radius: 50px;
	}

	.BMI_TF_5 {
		width: 10px;
		height: 10px;
		background: #333333;
		border-radius: 50px;
	}

	.teststuld {
		text-align: right;
		font-size: 16px;
		margin-left: 10px;
	}

	.teststuld_1 {
		text-align: right;
		color: gray;
		font-size: 10px;
	}

	.teststuld_2 {
		text-align: right;
		font-size: 13px;
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
		color: gray;
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
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-right: 10px;
		margin-left: 10vw;
	}

	.cardstyle_2 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-left: 10px;
		margin-right: 10vw;
	}

	.imashtylkkk {
		width: 88vw;
		height: 220px;
		margin: 0 20px 120px 20px;
		border-radius: 20px;
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
