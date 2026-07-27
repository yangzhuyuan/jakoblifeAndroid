<template>
	<view>
		<view style="display: flex;flex-direction: row;margin-top: 5px;">
			<!-- 最新体重 -->
			<view @click="$emit('new-latest')"
				style="background: white; border-radius: 20px;padding: 10px; width: 45vw;margin-left: 20px;box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);">
				<view style="display: flex;align-items: center;">
					<image src="../../../static/icons/6.png" style="width: 25px; height: 25px;"></image>
					<text style="font-size: 18px;margin-left: 10px;">{{$t('最新体重')}}</text>
				</view>
				<view
					style="margin-top: 30px; display: flex;flex-direction: row;justify-content: center; align-items: center;">
					<text style="font-size: 44px;font-weight: bold;">{{Latest_weight}}</text>
					<text style="margin-top: 15px; margin-left: 10px;">{{newweightKG}}</text>
				</view>
				<view style="text-align: right;margin-top: 20px; font-size: 18px;">{{Latest_date}}
				</view>
			</view>
			<view
				style=" margin-left: 20px; margin-right: 20px; width: 40vw;background: white; border-radius: 20px;box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);">
				<!-- 初始体重 -->
				<view @click="$emit('initial')">
					<view style="display: flex;align-items: center;padding: 10px;">
						<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;">
						</image>
						<text style="margin-left: 5px;">{{$t('初始体重')}}</text>
					</view>
					<view class="tizhong_item_2">
						<text
							style="font-size: 18px;font-weight: bold;color: black;">{{Initial_weight}}</text>
						<text style="margin-left: 5px; color: gray;">{{chuhsikg}}</text>
					</view>
				</view>
				<view style="margin:5px 0 5px 8px; background: gainsboro; width: 33vw; height: 1px;">
				</view>
				<!-- 目标体重 -->
				<view @click="$emit('target')">
					<view style="display: flex;align-items: center;padding: 10px;">
						<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;">
						</image>
						<text style="margin-left: 5px;">{{$t('目标体重')}}</text>
					</view>
					<view class="tizhong_item_2">
						<text style="font-size: 18px;font-weight: bold;">{{Target_weight}}</text>
						<text style="margin-left: 5px;color: gray;">{{chuhsikg}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="data_bg_A">
			<view class="title_zs1">{{$t('体脂秤注意事项')}}</view>
			<view class="tzkpsx" v-show="binaji2" @click="$emit('tiaozhen2')">{{$t("编辑数据卡片")}}</view>
			<view class="drag-containersss">
				<basic-drag v-model="list2Model" :disabled="disabledsaaa2" itemKey="title" :column="2"
					itemHeight="130px" @update:disabled="$emit('update:disabled', $event)">
					<template #item="{element}">
						<view class="data_item_bgsss" :class="'animation2-' + animation2">
							<view class="icon_bgsss">
								<image :src="element.image" class="img_style" mode="aspectFit" />
								<text class="icon_text_bgsss">{{element.title}}</text>
							</view>
							<view
								style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
								<view v-if="element.bmi_show">
									<view
										style="display: flex; flex-direction: row;align-items: center;">
										<text
											style="margin-left: 5px; color: black;font-size: 10px;white-space: nowrap;text-overflow: ellipsis;overflow: auto;width: 45px;text-align: right;">{{element.BMI_ys}}</text>
										<uni-icons type="help" size="15"
											@tap="$emit('bmi-tap', element.title)"></uni-icons>
									</view>
								</view>
								<view
									style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end;">
									<view v-if="element.bmi_show">
										<view v-if="element.BMI_TF == 0">
											<view
												style="width: 10px; height:10px;background: #FCCD41;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==1"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==2"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #FC7F41;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==3"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #F55A5A;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==4"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #7A0101;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==10"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
											</view>
										</view>
										<view v-else
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #333333;border-radius: 50px;">
											</view>
										</view>
									</view>
									<text
										style="text-align: right;font-size: 16px;margin-left: 10px;">{{element.Step_number}}</text>
								</view>
								<text
									style="text-align: right;color: gray;font-size: 10px;">{{element.type_LX}}</text>
								<text
									style="text-align: right;font-size: 13px;">{{element.Step_count}}</text>
							</view>
							<view v-show="delate_icon2" class="delete-button"
								@touchstart.stop.prevent="$emit('delete-card', element.title, element)">
								<image src="/static/icons/minus_filled.png" class="delete-icon"
									mode="aspectFit" />
							</view>
						</view>
					</template>
				</basic-drag>
			</view>
			<view v-show="button_show2" style="display: flex;flex-direction: column;">
				<view style="display: flex;justify-content: center;color: gray;">{{$t('长按拖动可调整数据卡片位置')}}
				</view>
				<view
					style="display: flex;flex-direction: row;justify-content: space-between; align-items: center; margin-top: 20px;">
					<view @click="$emit('confirm-cards')" class="cardstyle_1">{{$t('确认')}}
					</view>
					<view @tap.stop="$emit('add-card')" class="cardstyle_2">
						{{$t('添加数据卡片')}}
					</view>
				</view>
			</view>
			<view style="padding: 20px 20px 220px 20px;" @click="$emit('body-measure-click')">
				<view
					style="background: white; border-radius: 20px;padding: 10px;box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);">
					<view class="tiwei_bg">
						<view style="font-weight: bold;">{{$t('体围数据')}}</view>
						<view style="color: gray;">{{$t('单位')}}</view>
					</view>
					<view class="tiwei_bg">
						<view class="tiwei_item_bg">
							<text class="text_title_bg">{{$t('胸围')}}</text>
							<text class="tiwei_item_item_bg">{{Chest_circumference}}</text>
						</view>
						<view class="tiwei_item_bg">
							<text class="text_title_bg">{{$t('腰围')}}</text>
							<text class="tiwei_item_item_bg">{{waistline}}</text>
						</view>
						<view class="tiwei_item_bg">
							<text class="text_title_bg">{{$t('臀围')}}</text>
							<text class="tiwei_item_item_bg">{{Hip_circumference}}</text>
						</view>
						<view class="tiwei_item_bg">
							<text class="text_title_bg">{{$t('上臂围')}}</text>
							<text class="tiwei_item_item_bg">{{Upper_Chest_circumference}}</text>
						</view>
						<view class="tiwei_item_bg">
							<text class="text_title_bg">{{$t('大腿围')}}</text>
							<text class="tiwei_item_item_bg">{{Thigh_circumference}}</text>
						</view>
						<view class="tiwei_item_bg">
							<text class="text_title_bg">{{$t('小腿围')}}</text>
							<text class="tiwei_item_item_bg">{{Calf_circumference}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import BasicDrag from '@/components/basic-drag/index.vue';

	export default {
		name: 'BodyFatSwiperItem',
		components: {
			BasicDrag
		},
		props: {
			Latest_weight: {
				type: [String, Number],
				default: '--/--'
			},
			newweightKG: {
				type: String,
				default: ''
			},
			Latest_date: {
				type: String,
				default: '--/--'
			},
			Initial_weight: {
				type: [String, Number],
				default: '--/--'
			},
			chuhsikg: {
				type: String,
				default: ''
			},
			Target_weight: {
				type: [String, Number],
				default: '--/--'
			},
			list2: {
				type: Array,
				default: () => []
			},
			binaji2: {
				type: Boolean,
				default: true
			},
			disabledsaaa2: {
				type: Boolean,
				default: true
			},
			animation2: {
				type: String,
				default: ''
			},
			delate_icon2: {
				type: Boolean,
				default: false
			},
			button_show2: {
				type: Boolean,
				default: false
			},
			Chest_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			waistline: {
				type: [String, Number],
				default: '--/--'
			},
			Hip_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Upper_Chest_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Thigh_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Calf_circumference: {
				type: [String, Number],
				default: '--/--'
			}
		},
		computed: {
			list2Model: {
				get() {
					return this.list2
				},
				set(val) {
					this.$emit('update:list2', val)
				}
			}
		}
	}
</script>

<style scoped>
	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 0 40px 0;
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

	.tizhong_item_2 {
		margin: 5px 0 10px 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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

	.animation2-shake {
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

	.tiwei_bg {
		padding: 5px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.tiwei_item_bg {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tiwei_item_item_bg {
		font-size: 16px;
		font-weight: bold;
		margin-top: 10px;
	}

	.text_title_bg {
		margin-top: 10px;
		width: 45px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: auto;
		color: gray;
		text-align: center;
	}
</style>
