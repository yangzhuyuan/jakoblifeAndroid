<template>
	<view style="color: black;height: 100vh;background: #F7F7F7;">
		<view v-if="types" style="background: #F7F7F7; padding-bottom: 50px;">
			<view style="padding-top: 20px;display: flex;flex-direction: column;align-items: center;">
				<view class="title_time">
					<view v-if="WEEK" class="button_time_1" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view v-else class="button_time_2" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view class="view_bor"></view>
					<view v-if="MON" class="button_time_1" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view v-else class="button_time_2" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view class="view_bor"></view>
					<view v-if="YEAR" class="button_time_1" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
					<view v-else class="button_time_2" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
				</view>
				<view style="display: flex;justify-content: center;margin-top: 20px;">
					<view v-if="data_type === 0" style="width: 70vw;display: flex; justify-content: flex-end;">
						<picker fields="day" mode="date" @change="bindDateChange1">
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 18px;color: gray;">{{date_0}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 10px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view v-else-if="data_type === 1" style="width: 60vw;display: flex; justify-content: flex-end;">
						<picker fields="month" mode="date" @change="bindDateChange2">
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 18px;color: gray;">{{date_1}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 10px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view v-else-if="data_type === 2" style="width: 50vw;display: flex; justify-content: flex-end;">
						<picker fields="year" mode="date" @change="bindDateChange3">
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 18px;color: gray;">{{date_2}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 10px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="width: 30vw; display: flex;justify-content: space-evenly;margin-right: 15px;">
						<view class="ziti" :style="getcolor(act)" @click="button_pingju()">平均</view>
						<view class="ziti" :style="getcolor1(act1)" @click="button_zuigao()">最高</view>
					</view>
				</view>
				<view class="table_bg">
					<view style="display: flex; flex-direction: row;">
						<view>
							<view style="display: flex; flex-direction: row;align-items: center;">
								<view style="background: #FC7F41;width: 10px; height: 10px;border-radius: 5px" />
								<view style="margin-left: 5px;color: gray;">平均收缩压/mmHg</view>
							</view>
							<view class="table_item_text">{{Systolic_blood_pressure}}</view>
						</view>
						<view style="margin-left: 20px;">
							<view style="display: flex; flex-direction: row;align-items: center;">
								<view style="background: #7AE545;width: 10px; height: 10px;border-radius: 5px"></view>
								<view style="margin-left: 5px;color: gray;">平均舒张压/mmHg</view>
							</view>
							<view class="table_item_text">{{Diastolic_blood_pressure}}</view>
						</view>
					</view>
					<view class="charts-box">
						<qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
					</view>
				</view>
			</view>
			<view class="icon_item_bgsdsadsa">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_0')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(lately_Blood_pressure)" />
						<view class="title_font_bg">{{lately_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{lately_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{lately_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{lately_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_1')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(average_Blood_pressure)" />
						<view class="title_font_bg">{{average_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{average_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{average_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{average_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_2')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(Maximum_Blood_pressure)" />
						<view class="title_font_bg">{{Maximum_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{Maximum_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{Maximum_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{Maximum_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/3.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_3')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(Minimum_Blood_pressure)" />
						<view class="title_font_bg">{{Minimum_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_23')}}/mmHg</view>
							<view class="text_item_bg_1">{{Minimum_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_24')}}/mmHg</view>
							<view class="text_item_bg_1">{{Minimum_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('gongxiangitem.title_25')}}/BMP</view>
							<view class="text_item_bg_1">{{Minimum_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<uni-fab ref="fab" :pattern="pattern" horizontal="right" vertical="bottom" :direction="direction"
				@trigger="trigger" @fabClick="fabClick" />
		</view>
		<view v-else style="padding-bottom: 20px;">
			<view style="padding-top: 20px;display: flex;flex-direction: column;align-items: center;">
				<view class="title_time">
					<view v-if="WEEK" class="button_time_1" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view v-else class="button_time_2" @tap="button_WEEK">{{$t('shouye_item.title_35')}}</view>
					<view class="view_bor"></view>
					<view v-if="MON" class="button_time_1" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view v-else class="button_time_2" @tap="button_MON">{{$t('shouye_item.title_31')}}</view>
					<view class="view_bor"></view>
					<view v-if="YEAR" class="button_time_1" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
					<view v-else class="button_time_2" @tap="button_YEAR">{{$t('shouye_item.title_30')}}</view>
				</view>
				<view style="display: flex;justify-content: center;align-items: center; margin-top: 20px;">
					<view v-if="data_type === 0" style="width: 70vw;display: flex; justify-content: flex-end;">
						<picker fields="day" mode="date" @change="bindDateChange1">
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 18px;color: gray;">{{date_0}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 10px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view v-else-if="data_type === 1" style="width: 60vw;display: flex; justify-content: flex-end;">
						<picker fields="month" mode="date" @change="bindDateChange2">
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 18px;color: gray;">{{date_1}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 10px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view v-else-if="data_type === 2" style="width: 50vw;display: flex; justify-content: flex-end;">
						<picker fields="year" mode="date" @change="bindDateChange3">
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 18px;color: gray;">{{date_2}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 10px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="width: 30vw; display: flex;justify-content: space-evenly;margin-right: 15px;">
						<view class="ziti" :style="getcolor(act)" @click="button_pingju()">平均</view>
						<view class="ziti" :style="getcolor1(act1)" @click="button_zuigao()">最高</view>
					</view>
				</view>

				<view class="charts-box-2">
					<view class="text_title_types_1">
						<view style="display: flex;flex-direction: column; align-items: center;">
							<text class="text_title_types_2">{{$t('qushiitem.title_10')}}</text>
							<view style="font-size: 18px; font-weight: bold;">{{Mean_value}}</view>
						</view>
						<view style="display: flex;flex-direction: column; align-items: center;width: 33%;">
							<text class="text_title_types_2">BMI</text>
							<view style="font-size: 18px; font-weight: bold;">{{bmi}}</view>

						</view>
						<view style="display: flex;flex-direction: column; align-items: center;width: 33%;">
							<text class="text_title_types_2">{{$t('qushiitem.title_11')}}</text>
							<view style="font-size: 18px; font-weight: bold;">{{weight_value}}</view>
						</view>
					</view>
					<qiun-data-charts type="line" :opts="opts2" :chartData="chartData2" />
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image src="../../../static/icons/6.png" class="img_iocn_bg" />
					<view style="margin-top: 10px;text-align: center;line-height: 15px;">{{$t('qushiitem.title_12')}}
					</view>
				</view>
				<view>
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg1(level_weight)" />
						<view class="title_font_bg">{{level_weight}}</view>
						<uni-icons type="help" size="15" style="" @tap="BMI_tap2"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('qushiitem.title_13')}}</view>
							<view class="text_item_bg_1">{{max_weight}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('qushiitem.title_14')}}</view>
							<view class="text_item_bg_1">{{min_weight}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('qushiitem.title_15')}}</view>
							<view class="text_item_bg_1">{{avg_weight}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg_toast">{{Detection_result}}</view>

			<uni-fab ref="fab" :pattern="pattern1" horizontal="right" vertical="bottom" direction="horizontal"
				@trigger="trigger" @fabClick="fabClick" />

		</view>


		<!-- 记体重popup -->
		<view>
			<uni-popup ref="tizhong_popup" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff; margin-top: 60px; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: space-between; padding: 15px;">
						<text @click="tz_closess()" style="font-size: 22px;">✖</text>
						<view style="display: flex; flex-direction: row;">
							<!-- <text @click="dataclick2()">{{birthday2}}</text>
							<uni-icons type="bottom" size="16"></uni-icons> -->
							<picker fields="day" mode="date" :value="birthday2" @change="bindDateChange2s"
								:end='endtimesss'>
								<view style="display: flex;flex-direction: row;">
									<view style="font-size: 16px;color: black;">{{birthday2}}</view>
									<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
								</view>
							</picker>
						</view>
						<view style="color: #3298F7;"></view>
					</view>
					<view style="padding: 20px;width: 75vw;">
						<view
							style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="tizhong" placeholder="请输入体重"
								style="text-align: center;width: 80vw;" />
							<text>kg</text>
						</view>
					</view>
					<button @tap="jitizhong_tc()"
						style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('gongxiangitem.title_29')}}</button>
				</view>
			</uni-popup>
		</view>


		<!-- 悬浮弹窗 -->
		<view class="showTotal" v-show="fillOut">
			<view class="over">
				<view class="show">
					<view style="margin-top: 140px;">
						<view style="color: black;font-size: 38px; font-weight: bold;">{{showTotal_date}}</view>
						<view style="background: black; width: 50%; height: 1px;margin-top: 20px;"></view>
						<view style="color: #2595D3;margin-top: 5px;">{{$t('shouye_item.title_18')}}</view>
					</view>
					<view style="display: flex; flex-direction: row;  margin-top: 180px;margin-left: 10px;">
						<view style="display: flex;flex-direction: column; align-items: center;" @click="Keep()">
							<image src="../../../static/icons/6.png"
								style="width: 50px; height: 50px;border-radius: 40px;">
							</image>
							<text
								style="margin-top: 5px;font-weight: bold;text-align:center;width: 80px;">{{$t('shouye_item.title_19')}}</text>
						</view>
						<view style="display: flex;flex-direction: column;  align-items: center;margin-left: 10px;"
							@click="Body_circumference()">
							<image src="../../../static/icons/7.png"
								style="width: 50px; height: 50px;border-radius: 40px;">
							</image>
							<text
								style="margin-top: 5px;font-weight: bold;text-align:center;width: 80px;">{{$t('shouye_item.title_20')}}</text>
						</view>
					</view>
					<view style="display: flex;justify-content: center;margin-top: 60px;" @click="ddclosess()">
						<uni-icons size="30" type="closeempty"></uni-icons>
					</view>
				</view>
			</view>
		</view>


		<!--体脂秤首页滑动-->
		<view>
			<uni-popup ref="tihzi_popup_hd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between;align-items: center; padding:15px;">
						<view @click="hd_closess()">✖</view>
						<view style=" margin-left: 50px;">
							<text @click="dataclick1()">{{birthday1}}</text>
							<uni-icons type="bottom" size="16"></uni-icons>
						</view>
						<view style="color: #3298F7;" @click="sdsr()">{{$t('shouye_item.title_22')}}</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view>
							<view style="display: flex;justify-content: space-between;margin-top: 10px;">
								<view class="title_select_ruler">{{$t('shouye_item.title_12')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{xw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;margin-top: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="xw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('shouye_item.title_13')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{yw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="yw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('shouye_item.title_14')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{tw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="tw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('shouye_item.title_15')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{stw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="stw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('shouye_item.title_16')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{dtw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="dtw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('shouye_item.title_17')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{xtw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="xtw_handleChange"></select-ruler>
							</view>
						</view>
						<button @tap="select_ruler()"
							style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('gongxiangitem.title_29')}}</button>
					</scroll-view>
				</view>
			</uni-popup>
		</view>

		<!-- 体脂秤首页手动 -->
		<view>
			<uni-popup ref="tihzi_popup_sd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between; padding: 10px;">
						<text @click="sd_closess()">✖</text>
						<view style="display: flex; flex-direction: row; margin-left: 50px;">
							<text @click="dataclick()">{{birthday111}}</text>
							<uni-icons type="bottom" size="16"></uni-icons>
						</view>
						<view style="color: #3298F7;" @click="hdsr()">{{$t('shouye_item.title_23')}}</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view style="padding-bottom: 10px;align-items: center;">
							<view style="padding: 10px;">
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
									<input type="number" v-model="xiongwei" :placeholder="$t('shouye_item.title_24')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="yaowei" :placeholder="$t('shouye_item.title_25')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="tunwei" :placeholder="$t('shouye_item.title_26')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="shangtunwei" :placeholder="$t('shouye_item.title_27')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="datuiwei" :placeholder="$t('shouye_item.title_28')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="xiaotuiwei" :placeholder="$t('shouye_item.title_29')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>

							</view>
							<button @tap="popup_sd()"
								style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('gongxiangitem.title_29')}}</button>
						</view>
					</scroll-view>
				</view>
			</uni-popup>
		</view>


		<!-- 血压普通弹窗 -->
		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff;width: 280px;text-align: center; padding-bottom: 20px;">
					<view>
						<image style="width: 200px; height: 300px;" src="../../../static/image/3.png"></image>
					</view>
					<button @tap="knowe()"
						style="margin: 0 50px 20px 50px; border-radius: 20px;background: #3298F7;color: white;">{{$t('BDSBitem.title_8')}}</button>
				</view>
			</uni-popup>
		</view>

		<!-- BMI普通弹窗 -->
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view style="border-radius: 20px;background:#fff;padding-bottom: 20px;width: 280px;text-align: center;">
					<view>
						<view style="font-weight: bold;padding-top: 20px;font-size: 16px;">BMI分类</view>
						<view style="color: gray;font-size: 12px;margin-top: 10px;">根据世界卫生组织（WHO)的最新BMI分类</view>
						<view
							style="display: flex; flex-direction: row; padding: 5px; align-items: center;margin-top: 20px; margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw">BMI范围</view>
							<view style="font-weight: bold;width: 20vw">分类</view>
						</view>
						<view
							style="padding: 5px;background: #FCCD41; width: 88%;margin-top: 10px; display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">&lt;18.5</view>
							<view style="font-weight: bold;width: 20vw;color: white;">体重过轻</view>
						</view>
						<view
							style="padding: 5px;background: #58BF78; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">18.5-24.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">正常体重</view>
						</view>
						<view
							style="padding: 5px;background: #FC7F41; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">超重</view>
						</view>
						<view
							style="padding: 5px;background: #F55A5A; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">一级肥胖</view>
						</view>
						<view
							style="padding: 5px;background: #7A0101; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">二级肥胖</view>
						</view>
						<view
							style="padding: 5px;background: #333333; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 40vw;color: white;">三级肥胖或病态肥胖</view>
						</view>
					</view>
					<button @tap="knowe1()"
						style="margin: 40px 50px 20px 50px;border-radius: 20px;background: #3298F7;color: white;">{{$t('BDSBitem.title_8')}}</button>
				</view>
			</uni-popup>
		</view>


		<view>
			<uni-popup ref="qs_popup" :mask-click="true">
				<view style="border-radius: 20px;background:#fff; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: center; padding: 10px;">
						<picker fields="day" mode="date" @change="bindDateChange" :end='endtimesss'>
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 16px;color: black;">{{birthday}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="padding: 10px;width: 80vw;">
						<view
							style="margin:0 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shuzhangya" :placeholder="$t('qushiitem.title_5')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">mmHg</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shousuoya" :placeholder="$t('qushiitem.title_4')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">mmHg</text>
						</view>

						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="maibo" :placeholder="$t('qushiitem.title_6')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">BMP</text>
						</view>

					</view>
					<button @tap="truesss()"
						style="margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">确
						认</button>
				</view>
			</uni-popup>
		</view>

		<view>
			<yt-dateTimePicker ref="myPicker" @submit="handleSubmit" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('shouye_item.title_30'), $t('shouye_item.title_31'), $t('shouye_item.title_32'), $t('shouye_item.title_33'), $t('shouye_item.title_34'), $t('shouye_item.title_35')]" />
		</view>
		<view>
			<yt-dateTimePicker ref="myPicker1" @submit="handleSubmit1" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('shouye_item.title_30'), $t('shouye_item.title_31'), $t('shouye_item.title_32'), $t('shouye_item.title_33'), $t('shouye_item.title_34'), $t('shouye_item.title_35')]" />
		</view>
	<!-- 	<view>
			<yt-dateTimePicker ref="myPicker2" @submit="handleSubmit2" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('shouye_item.title_30'), $t('shouye_item.title_31'), $t('shouye_item.title_32'), $t('shouye_item.title_33'), $t('shouye_item.title_34'), $t('shouye_item.title_35')]" />
		</view> -->

	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		computed: {
			...mapState(['info']),
		},
		data() {
			return {
				endtimesss: new Date().toISOString().slice(0, 10),
				datass: new Date().toISOString(),
				fillOut: false,
				showTotal_date: new Date().toISOString().slice(5, 7) + "/" + new Date().toISOString().slice(8, 10),
				tizhong: "",
				mubiao: '',
				xiongwei: "",
				yaowei: "",
				tunwei: "",
				shangtunwei: "",
				datuiwei: "",
				xiaotuiwei: "",
				xw_value: "",
				yw_value: "",
				tw_value: "",
				stw_value: "",
				dtw_value: "",
				xtw_value: "",
				birthday111: this.$t('shouye_item.title_21'),
				birthday1: this.$t('shouye_item.title_21'),
				birthday2: this.$t('shouye_item.title_21'),

				act: '平均',
				act1: '',
				data_type: 0,
				types: true,
				date_0: new Date().toISOString().slice(0, 10).replace("-", "/").replace("-", "/"),
				date_1: new Date().toISOString().slice(0, 7).replace("-", "/").replace("-", "/"),
				date_2: new Date().toISOString().slice(0, 4).replace("-", "/").replace("-", "/"),
				date_00: new Date().toISOString().slice(0, 10) + ' 23:59:59',
				date_11: new Date().toISOString().slice(0, 10) + ' 23:59:59',
				date_22: new Date().toISOString().slice(0, 10) + ' 23:59:59',
				WEEK: true,
				MON: false,
				YEAR: false,
				Systolic_blood_pressure: "--",
				Diastolic_blood_pressure: "--",

				chartData: {
					categories: [],
					series: [{
						legendShape: "none",
						name: "",
						data: []
					}, {
						legendShape: "none",
						name: "",
						data: []
					}]
				},

				opts: {
					color: ["#FC7F41", "#7AE545"],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					xAxis: {
						disableGrid: true,
						gridType: "dash",
						fontSize: 10,
						calibration: false,
						axisLine: false,
					},
					yAxis: {
						splitNumber: 4,
						gridType: "dash",
						data: [{
							min: 0,
							max: 200,
							position: "left",
							fontSize: 10,
							textAlign: "left",
							calibration: false,
							axisLine: true,
						}],
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				lately_Blood_pressure: "-",
				lately_Systolic_blood_pressure: "-",
				lately_Diastolic_blood_pressure: "-",
				lately_pulse: "-",

				average_Blood_pressure: "-",
				average_Systolic_blood_pressure: "--",
				average_Diastolic_blood_pressure: "--",
				average_pulse: "--",

				Maximum_Blood_pressure: "-",
				Maximum_Systolic_blood_pressure: "--",
				Maximum_Diastolic_blood_pressure: "--",
				Maximum_pulse: "--",

				Minimum_Blood_pressure: "-",
				Minimum_Systolic_blood_pressure: "--",
				Minimum_Diastolic_blood_pressure: "--",
				Minimum_pulse: "--",

				level_weight: '--',
				max_weight: '--',
				min_weight: '--',
				avg_weight: '--',


				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				pattern1: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				is_color_type: false,
				chartData2: {
					categories: [],
					series: [{
						legendShape: "none",
						name: "",
						data: []
					}, ]
				},
				opts2: {
					color: ["#3298F7"],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true,
						gridType: "dash",
						fontSize: 10,
						calibration: false,
						axisLine: false,
					},
					yAxis: {
						splitNumber: 5,
						gridType: "dash",
						data: [{
							min: 5,
							max: 150,
							position: "left",
							fontSize: 10,
							textAlign: "left",
							calibration: false,
							axisLine: true,
						}],
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				Mean_value: "-",
				bmi: "-",
				weight_value: "-",
				weight: "增重速度",
				Detection_result: "您的身体数据均为正常,请继续保持",
				min_width: "--",
				max_width: "--",
				birthday: this.$t('shouye_item.title_21'),
				shousuoya: "",
				shuzhangya: "",
				maibo: "",
				aggregateType: 'average',
				timeLevel: 0,
				startTime: this.GetTime(7, new Date().toISOString().slice(0, 10) + ' 00:00:00'),
				endTime: new Date().toISOString().slice(0, 10) + ' 23:59:59'

			};
		},



		onNavigationBarButtonTap(e) {
			console.log(e)
			if (e.float === "left") {

				uni.navigateTo({
					url: '../../../pages/Bind/cs_manage_1?typesss=qushi'
				})

			} else {
				if (this.types === true) {
					uni.navigateTo({
						url: "../tendency/Historical_record"
					})
				} else {
					uni.navigateTo({
						url: "../tendency/Historical_record"
					})
				}

			}
		},


		onShow() {
			console.log("token:", uni.getStorageSync("token"))
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t('qushi')
			})
			if (uni.getStorageSync("token") === "" || uni.getStorageSync("token") === undefined) {
				uni.redirectTo({
					url: "/pages/login/login_land"
				})
			} else {
				uni.request({
					url: that.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: function(res) {
						console.log("获取用户信息成功:", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.data.phonenumber === null || res.data.data.phonenumber === "") {
									uni.reLaunch({
										url: '../../login/Force_binding_phone'
									})
								} else {
									that.getInfo(res.data.data)
									that.queryDevices()

								}
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						} else if (res.data.code == 500) {

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		},


		methods: {
			...mapMutations(['getInfo']),

			Body_circumference() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.open("center")
			},

			Keep() {
				this.fillOut = false
				this.$refs.tizhong_popup.open("center")
			},
			dataclick() {
				this.$refs.myPicker.show();
			},
			handleSubmit(e) {
				this.birthday111 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			dataclick1() {
				this.$refs.myPicker1.show();
			},
			handleSubmit1(e) {
				this.birthday1 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			
			bindDateChange2s(e) {
				console.log("dsakjhdsas", e.detail.value)
				this.birthday2 = e.detail.value
			},
			
			// dataclick2() {
			// 	this.$refs.myPicker2.show();
			// },
			// handleSubmit2(e) {
			// 	this.birthday2 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			// },
			sdsr() {
				this.$refs.tihzi_popup_hd.close()
				this.$refs.tihzi_popup_sd.open("center")
			},
			hdsr() {
				this.$refs.tihzi_popup_sd.close()
				this.$refs.tihzi_popup_hd.open("center")
			},

			xw_handleChange(e) {
				console.log("胸围：", e)
				this.xw_value = e;
			},
			yw_handleChange(e) {
				this.yw_value = e;
			},
			tw_handleChange(e) {
				this.tw_value = e;
			},
			stw_handleChange(e) {
				this.stw_value = e;
			},
			dtw_handleChange(e) {
				this.dtw_value = e;
			},
			xtw_handleChange(e) {
				this.xtw_value = e;
			},

			ddclosess() {
				this.fillOut = false
			},

			sd_closess() {
				this.fillOut = false
				this.$refs.tihzi_popup_sd.close()
			},

			tz_closess() {
				this.fillOut = false
				this.$refs.tizhong_popup.close()
			},

			hd_closess() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.close()
			},
			knowe() {
				this.$refs.popup.close()
			},
			knowe1() {
				this.$refs.popup1.close()
			},
			knowe2() {
				this.$refs.popup2.close()
			},
			jitizhong_tc() {
				if (this.tizhong === "" || this.tizhong === undefined) {
					uni.showToast({
						title: "请输入体重",
						icon: 'none'
					})
					return
				} else {
					this.fat_scale_tz()
				}
			},
			select_ruler() {
				this.fat_scale_1()
			},

			//用户在app手动上报重量数据
			fat_scale_tz() {
				let that = this
				let timestamp = Math.floor(new Date(that.birthday2 == that.$t('shouye_item.title_21') ?
					new Date()
					.toISOString().slice(0, 10)+ " " + new Date().getHours() + ":" + new Date().getMinutes() : that.birthday2).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
				console.log("time222", timestamp)
				uni.request({
					url: that.$url_fat_scale,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync("deviceSn"),
						slaveSn: "0",
						slaveData: {
							weight: that.tizhong
						},
						time: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success: function(res) {
						console.log("用户在app手动上报重量数据", res)
						if (res.data.code == 200) {
							that.tizhong = ''
							that.birthday2 = that.$t('shouye_item.title_21')
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.$refs.tizhong_popup.close()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//用户在app手动上报六围数据
			fat_scale() {
				let that = this
				let timestamp = Math.floor(new Date(that.birthday111 == that.$t('shouye_item.title_21') ?
					new Date()
					.toISOString().slice(0, 10) : that.birthday111).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
				console.log("time", timestamp)
				uni.request({
					url: that.$url_fat_scale,
					method: 'POST',
					data: {
						slaveSn: "1",
						slaveData: {
							//初始体重
							start_weight: '',
							//目标体重 
							goal_weight: '',
							//胸围    
							chest_circumference: that.xiongwei,
							//腰围   
							waistline: that.yaowei,
							//臀围   
							hipline: that.tunwei,
							//上臂围   
							biceps_circumference: that.shangtunwei,
							//大腿围  
							thigh_circumference: that.datuiwei,
							//小腿围   
							calf_circumference: that.xiaotuiwei,
						},
						time: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success: function(res) {
						console.log("用户在app手动上报六围数据", res)
						if (res.data.code == 200) {
							that.birthday111 = that.$t('shouye_item.title_21')
							that.xiongwei = ''
							//腰围   
							that.yaowei = ''
							//臀围   
							that.tunwei = ''
							//上臂围   
							that.shangtunwei = ''
							//大腿围 
							that.datuiwei = ''
							//小腿围   
							that.xiaotuiwei = ''

							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.$refs.tihzi_popup_sd.close()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			//用户在app手动上报六围数据
			fat_scale_1() {
				let that = this
				let timestamp = Math.floor(new Date(that.birthday1 == that.$t('shouye_item.title_21') ?
					new Date()
					.toISOString().slice(0, 10) : that.birthday1).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
				console.log("time", timestamp)
				console.log("time", that.xw_value)
				uni.request({
					url: that.$url_fat_scale,
					method: 'POST',
					data: {
						slaveSn: "1",
						slaveData: {
							//初始体重
							start_weight: '',
							//目标体重 
							goal_weight: '',
							//胸围    
							chest_circumference: that.xw_value,
							//腰围   
							waistline: that.yw_value,
							//臀围   
							hipline: that.tw_value,
							//上臂围   
							biceps_circumference: that.stw_value,
							//大腿围  
							thigh_circumference: that.dtw_value,
							//小腿围   
							calf_circumference: that.xtw_value,
						},
						time: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success: function(res) {
						console.log("用户在app手动上报六围数据", res)
						if (res.data.code == 200) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.$refs.tihzi_popup_hd.close()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})

			},




			popup_sd() {
				if (this.xiongwei === "" || this.xiongwei === undefined) {
					uni.showToast({
						title: this.$t('shouye_item.title_24'),
						icon: 'none'
					})
					return
				} else if (this.yaowei === "" || this.yaowei === undefined) {
					uni.showToast({
						title: this.$t('shouye_item.title_25'),
						icon: 'none'
					})
					return
				} else if (this.tunwei === "" || this.tunwei === undefined) {
					uni.showToast({
						title: this.$t('shouye_item.title_26'),
						icon: 'none'
					})
					return
				} else if (this.shangtunwei === "" || this.shangtunwei === undefined) {
					uni.showToast({
						title: this.$t('shouye_item.title_27'),
						icon: 'none'
					})
					return
				} else if (this.datuiwei === "" || this.datuiwei === undefined) {
					uni.showToast({
						title: this.$t('shouye_item.title_28'),
						icon: 'none'
					})
					return
				} else if (this.xiaotuiwei === "" || this.xiaotuiwei === undefined) {
					uni.showToast({
						title: this.$t('shouye_item.title_29'),
						icon: 'none'
					})
					return
				} else {
					this.fat_scale()
				}
			},


			knowe3() {
				this.$refs.popup3.close()
			},


			queryDevices() {
				let that = this
				uni.request({
					url: that.$url_queryDevices,
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("查询用户的绑定设备", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.rows == null) {
									// uni.showToast({
									// 	title: '当前未绑定任何设备',
									// 	icon: 'none'
									// })
									that.types = true
								} else {

									uni.getStorageInfo({
										success(ress) {
											if (ress.keys.includes("deviceSn")) {
												for (let i = 0; res.data.rows.length > i; i++) {
													if (uni.getStorageSync("deviceSn") == res.data.rows[i]
														.deviceSn) {
														if (res.data.rows[i].deviceTypeId == "10") {
															that.get_device_info(res.data.rows[i].deviceSn)
														} else if (res.data.rows[i].deviceTypeId == "11") {
															that.get_device_info(res.data.rows[i].deviceSn)
														}
													}
												}
											} else {
												for (let i = 0; res.data.rows.length > i; i++) {
													if (res.data.rows[i].deviceTypeId == "10") {
														that.get_device_info(res.data.rows[i].deviceSn)
													} else if (res.data.rows[i].deviceTypeId == "11") {
														that.get_device_info(res.data.rows[i].deviceSn)
													}
												}
											}
										}
									})
								}
							} else if (res.data.code == 500) {

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					}
				})
			},



			button_pingju() {
				this.act = "平均"
				this.act1 = ""
				this.aggregateType = 'average'
				if (this.WEEK == true) {
					this.startTime = this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00')
					this.endTime = this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59'
					this.get_trend_data(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
					this.query_month_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
					this.query_minmax(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
					this.query_weight_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				} else if (this.MON == true) {
					let nowDate = new Date(this.date_11);
					let fullYear = nowDate.getFullYear();
					let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
					let endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
					this.startTime = this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00'
					this.endTime = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59'
					this.get_trend_data(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')
					this.query_month_avg(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')
					this.query_minmax(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')
					this.query_weight_avg(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')
				} else if (this.YEAR == true) {
					this.startTime = this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00'
					this.endTime = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59'
					this.get_trend_data(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
					this.query_month_avg(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
					this.query_minmax(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
					this.query_weight_avg(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
				}
			},
			button_zuigao() {
				this.act = ""
				this.act1 = "最高"
				this.aggregateType = 'max'
				if (this.WEEK == true) {
					this.startTime = this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00')
					this.endTime = this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59'
					this.get_trend_data(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
					this.query_month_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
					this.query_minmax(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
					this.query_weight_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
						' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				} else if (this.MON == true) {
					let nowDate = new Date(this.date_11);
					let fullYear = nowDate.getFullYear();
					let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
					let endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
					this.startTime = this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00'
					this.endTime = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59'
					this.get_trend_data(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')
					this.query_month_avg(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')
					this.query_minmax(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')
					this.query_weight_avg(this.dateFormat(this.date_11).slice(0, 7) +
						'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
						' 23:59:59')

				} else if (this.YEAR == true) {
					this.startTime = this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00'
					this.endTime = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59'
					this.get_trend_data(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
					this.query_month_avg(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
					this.query_minmax(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
					this.query_weight_avg(this.dateFormat(this.date_22).slice(0, 4) +
						'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')

				}
			},

			getcolor(id) {
				return {
					color: id === "平均" ? "#3298F7" : "black"

				}
			},
			getcolor1(id) {
				return {
					color: id === "最高" ? "#3298F7" : "black"
				}
			},


			//获取设备基础信息
			get_device_info(deviceSn) {
				let that = this
				console.log("token", uni.getStorageSync("token"))
				uni.request({
					url: that.$url_get_device_info,
					method: 'POST',
					data: {
						deviceSn: deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("获取设备基础信息", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.data.deviceTypeId === "10") {
									that.types = true
									uni.setStorageSync("deviceSn", deviceSn)
									that.get_trend_data(that.startTime, that.endTime)
									that.query_month_avg(that.startTime, that.endTime)
									that.query_minmax(that.startTime, that.endTime)
								} else if (res.data.data.deviceTypeId === "11") {
									that.types = false
									uni.setStorageSync("deviceSn", deviceSn)
									that.get_trend_data(that.startTime, that.endTime)
									that.query_weight_avg(that.startTime, that.endTime)
									let str = new Date().toISOString().slice(0, 10) + ' 00:00:00'
									let end = new Date().toISOString().slice(0, 10) + " 23:59:59"
									console.log("dsakhdsadasdadad", str)
									console.log("dsakhdsadasdadad", end)
									that.query_weight_day(str, end)
								}
							} else if (res.data.code == 500) {

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						} else {
							console.log("设备绑定失败", res)
						}
					}
				})
			},

			//数据趋势
			get_trend_data(startTime, endTime) {
				let that = this
				console.log('deviceSn', uni.getStorageSync('deviceSn'))
				console.log('timeLevel', that.timeLevel)
				console.log('startTime', startTime)
				console.log('endTime', endTime)
				console.log('aggregateType', that.aggregateType)
				uni.request({
					url: that.$url_get_trend_data,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
						timeLevel: that.timeLevel,
						slaveList: [{
								slaveSn: "0",
								register: "highPressure"
							},
							{
								slaveSn: "0",
								register: "lowPressure"
							},
							{
								slaveSn: "0",
								register: "weight"
							}
						],
						startTime: startTime,
						endTime: endTime,
						aggregateType: that.aggregateType
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						console.log('数据趋势', res)
						if (res.data.code == 200) {
							that.chartData.categories = []
							that.chartData.series[0].data = []
							if (res.data.data.highPressure == '') {
								that.chartData.categories = []
								that.chartData.series[0].data = []
							} else {
								for (let i = 0; i < res.data.data.highPressure.length; i++) {
									that.chartData.series[0].data.push(res.data.data.highPressure[i][0])
								}
							}

							that.chartData.series[1].data = []
							if (res.data.data.lowPressure == '') {
								that.chartData.categories = []
								that.chartData.series[1].data = []
							} else {
								for (let i = 0; i < res.data.data.lowPressure.length; i++) {
									let timessss = res.data.data.lowPressure[i][1]
									that.chartData.categories.push(that.formatDate(parseInt(timessss)))
									that.chartData.series[1].data.push(res.data.data.lowPressure[i][0])
								}
							}

							that.chartData2.categories = []
							that.chartData2.series[0].data = []
							if (res.data.data.weight == '') {
								that.chartData2.categories = []
								that.chartData2.series[0].data = []
							} else {
								for (let i = 0; i < res.data.data.weight.length; i++) {
									let timessss = res.data.data.weight[i][1]
									that.chartData2.categories.push(that.formatDate(parseInt(timessss)))
									that.chartData2.series[0].data.push(res.data.data.weight[i][0])
								}
							}

						} else if (res.data.code == 500) {
							that.chartData.categories = []
							that.chartData.series[0].data = []
							that.chartData.series[1].data = []
							that.chartData2.categories = []
							that.chartData2.series[0].data = []
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			//血压计统计每日平均值计算总最大最小值
			query_month_avg(startTime, endTime) {
				let that = this
				console.log('deviceSndsadsadas', uni.getStorageSync('deviceSn'))
				console.log('startTime1111111', startTime)
				console.log('endTime2222222', endTime)
				uni.request({
					url: that.$url_query_month_avg,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
						slaveList: [{
							slaveSn: "0",
							register: "highPressure"
						}, ],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						console.log('血压计统计每日平均值计算总最大最小值', res)
						if (res.data.code == 200) {
							that.Systolic_blood_pressure = res.data.data.high.min + "-" + res.data.data.high.max
							that.Diastolic_blood_pressure = res.data.data.low.min + "-" + res.data.data.low.max
						} else if (res.data.code == 500) {
							that.Systolic_blood_pressure = "--"
							that.Diastolic_blood_pressure = "--"
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},


			//血压计最高最低平均数值
			query_minmax(startTime, endTime) {
				let that = this
				console.log('deviceSn', uni.getStorageSync('deviceSn'))
				console.log('startTime', startTime)
				console.log('endTime', endTime)
				uni.request({
					url: that.$url_query_minmax,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
						dataType: "min",
						slaveList: [{
							slaveSn: "0",
							register: "highPressure"
						}, ],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						console.log('血压计最高最低平均数值', res)
						if (res.data.code == 200) {

							//最近
							that.lately_Blood_pressure = res.data.data.last.level
							that.lately_Systolic_blood_pressure = res.data.data.last.highPressure
							that.lately_Diastolic_blood_pressure = res.data.data.last.lowPressure
							that.lately_pulse = res.data.data.last.heartrate
							//平均
							that.average_Blood_pressure = res.data.data.avg.level
							that.average_Systolic_blood_pressure = res.data.data.avg.highPressure
							that.average_Diastolic_blood_pressure = res.data.data.avg.lowPressure
							that.average_pulse = res.data.data.avg.heartrate
							//最高
							that.Maximum_Blood_pressure = res.data.data.max.level
							that.Maximum_Systolic_blood_pressure = res.data.data.max.highPressure
							that.Maximum_Diastolic_blood_pressure = res.data.data.max.lowPressure
							that.Maximum_pulse = res.data.data.max.heartrate
							//最低
							that.Minimum_Blood_pressure = res.data.data.min.level
							that.Minimum_Systolic_blood_pressure = res.data.data.min.highPressure
							that.Minimum_Diastolic_blood_pressure = res.data.data.min.lowPressure
							that.Minimum_pulse = res.data.data.min.heartrate

						} else if (res.data.code == 500) {
							//最近
							that.lately_Blood_pressure = "--"
							that.lately_Systolic_blood_pressure = "--"
							that.lately_Diastolic_blood_pressure = "--"
							that.lately_pulse = "--"
							//平均
							that.average_Blood_pressure = "--"
							that.average_Systolic_blood_pressure = "--"
							that.average_Diastolic_blood_pressure = "--"
							that.average_pulse = "--"
							//最高
							that.Maximum_Blood_pressure = "--"
							that.Maximum_Systolic_blood_pressure = "--"
							that.Maximum_Diastolic_blood_pressure = "--"
							that.Maximum_pulse = "--"
							//最低
							that.Minimum_Blood_pressure = "--"
							that.Minimum_Systolic_blood_pressure = "--"
							that.Minimum_Diastolic_blood_pressure = "--"
							that.Minimum_pulse = "--"
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},


			//体脂秤统计最近1周/月平均体重、bmi、变化速度
			query_weight_avg(startTime, endTime) {
				let that = this
				console.log('deviceSn', uni.getStorageSync('deviceSn'))
				console.log('startTime', startTime)
				console.log('endTime', endTime)
				uni.request({
					url: that.$url_query_weight_avg,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						console.log('体脂秤统计最近1周/月平均体重、bmi、变化速度', res)
						if (res.data.code == 200) {

							that.Mean_value = res.data.data.avgWeight
							that.bmi = res.data.data.bmi
							that.weight_value = res.data.data.change

						} else if (res.data.code == 500) {
							that.Mean_value = "--"
							that.bmi = "--"
							that.weight_value = "--"
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//体脂秤计算当天最高/最低/平均体重和肥胖等级
			query_weight_day(startTime, endTime) {
				let that = this
				console.log('deviceSn', uni.getStorageSync('deviceSn'))
				console.log('startTime', startTime)
				console.log('endTime', endTime)
				uni.request({
					url: that.$url_query_weight_day,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						console.log('体脂秤计算当天最高/最低/平均体重和肥胖等级', res)
						if (res.data.code == 200) {
							that.level_weight = res.data.data.level
							that.max_weight = res.data.data.max
							that.min_weight = res.data.data.min
							that.avg_weight = res.data.data.avg
						} else if (res.data.code == 500) {
							that.level_weight = "--"
							that.max_weight = "--"
							that.min_weight = "--"
							that.avg_weight = "--"
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},



			//时间戳转时间
			formatDate(value) {
				const data = new Date(value);
				const month = data.getMonth() + 1;
				const day = data.getDate();
				const year = data.getFullYear();
				const hours = data.getHours();
				const minutes = data.getMinutes();
				const seconds = data.getSeconds();
				let formattedTime
				if (this.WEEK == true) {
					formattedTime = `${month}.${day}`;
				} else if (this.MON == true) {
					formattedTime = `${day}`;
				} else if (this.YEAR == true) {
					formattedTime = `${month}`;
				}
				return formattedTime;
			},






			//弹窗数据提交按钮
			truesss() {
				let that = this
				if (that.shuzhangya === "" || that.shuzhangya === undefined) {
					uni.showToast({
						title: that.$t('qushiitem.title_4'),
						icon: "none"
					})
					return
				} else if (that.shousuoya === "" || that.shousuoya === undefined) {
					uni.showToast({
						title: that.$t('qushiitem.title_5'),
						icon: "none"
					})
					return
				} else if (that.maibo === "" || that.maibo === undefined) {
					uni.showToast({
						title: that.$t('qushiitem.title_6'),
						icon: "none"
					})
					return
				} else {
					that.pressure_data()
				}
			},


			//用户在app手动上报血压数据
			pressure_data() {
				let timestamp = Math.floor(new Date(this.birthday == this.$t('shouye_item.title_21') ? new Date()
						.toISOString().slice(0, 10) + " " + new Date().getHours() + ":" + new Date().getMinutes() :
						this.birthday + " " + new Date().getHours() + ":" + new Date().getMinutes()).getTime() /
					1000); // 将时间转换成时间戳（以秒为单位）
				console.log("time", timestamp)
				let that = this
				uni.request({
					url: that.$url_pressure_data,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
						slaveSn: "0",
						slaveData: {
							lowPressure: that.shousuoya,
							highPressure: that.shuzhangya,
							heartrate: that.maibo
						},
						time: timestamp

					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},

					success(res) {
						console.log("用户在app手动上报血压数据", res)

						if (res.data.code == 200) {
							that.$refs.qs_popup.close()
							that.birthday = that.$t('shouye_item.title_21')
							that.shousuoya = ''
							that.shuzhangya = ''
							that.maibo = ''
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						} else if (res.data.code == 500) {

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			bg(bg) {
				if (bg == "正常血压") {
					return {
						background: "#58BF78"
					}
				} else if (bg == "正常高值血压") {
					return {
						background: "#7AE545"
					}
				} else if (bg == "一级高血压") {
					return {
						background: "#FCCD41"
					}
				} else if (bg == "二级高血压") {
					return {
						background: "#F55A5A"
					}
				} else {
					return {
						background: '#FFFFFF'
					}
				}
			},

			bg1(bg) {
				if (bg === "体重过轻") {
					return {
						background: "#FCCD41"
					}
				} else if (bg === "正常体重") {
					return {
						background: "#58BF78"
					}
				} else if (bg === "超重") {
					return {
						background: "#FC7F41"
					}
				} else if (bg === "一级肥胖") {
					return {
						background: "#F55A5A"
					}
				} else if (bg === "二级肥胖") {
					return {
						background: "#7A0101"
					}
				} else if (bg === "三级肥胖或病态肥胖") {
					return {
						background: "#333333"
					}
				} else {
					return {
						background: '#FFFFFF'
					}
				}
			},

			bindDateChange1(e) {
				this.date_0 = e.detail.value.replace("-", "/").replace("-", "/")
				this.date_00 = e.detail.value
				this.startTime = this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00')
				this.endTime = this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59'
				this.get_trend_data(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				this.query_month_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				this.query_minmax(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				this.query_weight_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
			},
			bindDateChange2(e) {
				console.log(e)
				this.date_1 = e.detail.value.slice(0, 7).replace("-", "/")
				this.date_11 = e.detail.value
				let nowDate = new Date(this.date_11);
				let fullYear = nowDate.getFullYear();
				let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
				let endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
				this.startTime = this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00'
				this.endTime = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59'
				this.get_trend_data(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')
				this.query_month_avg(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')
				this.query_minmax(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')
				this.query_weight_avg(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')

			},
			bindDateChange3(e) {
				this.date_2 = e.detail.value.slice(0, 4)
				this.date_22 = e.detail.value
				this.startTime = this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00'
				this.endTime = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59'
				this.get_trend_data(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
				this.query_month_avg(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
				this.query_minmax(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
				this.query_weight_avg(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')

			},
			bindDateChange(e) {
				this.birthday = e.detail.value.replace("-", "/").replace("-", "/")
			},
			button_WEEK() {
				this.WEEK = true
				this.MON = false
				this.YEAR = false
				this.data_type = 0
				this.timeLevel = 0
				this.startTime = this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00')
				this.endTime = this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59'
				this.get_trend_data(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				this.query_month_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				this.query_minmax(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
				this.query_weight_avg(this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) +
					' 00:00:00'), this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59')
			},

			//当前时间
			dateFormat(time) {
				let date = new Date(time);
				let year = date.getFullYear();
				// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// 拼接
				return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
			},

			//七天前的时间
			GetTime(day_ID, date_riqi) {
				var date = new Date(date_riqi);
				var base = Date.parse(date); // 转换为时间戳
				var year = date.getFullYear(); //获取当前年份
				var mon = date.getMonth() + 1; //获取当前月份
				var day = date.getDate(); //获取当前日
				var oneDay = 24 * 3600 * 1000
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

				var daytimeArr = []
				for (var i = 1; i < day_ID; i++) { //前七天的时间
					var now = new Date(base -= oneDay);
					var myear = now.getFullYear();
					var month = now.getMonth() + 1;
					var mday = now.getDate()
					daytimeArr.push([myear, month >= 10 ? month : '0' + month, mday >= 10 ? mday : '0' + mday]
						.join('-'))
				}
				return daytimeArr[day_ID - 2] + " " + hours + ":" + minutes + ":" + seconds
			},

			button_MON() {
				this.WEEK = false
				this.MON = true
				this.YEAR = false
				this.data_type = 1
				this.timeLevel = 0
				let nowDate = new Date(this.date_11);
				let fullYear = nowDate.getFullYear();
				let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
				let endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
				this.startTime = this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00'
				this.endTime = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59'
				this.get_trend_data(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')
				this.query_month_avg(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')
				this.query_minmax(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')
				this.query_weight_avg(this.dateFormat(this.date_11).slice(0, 7) +
					'-01 00:00:00', this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth +
					' 23:59:59')
			},

			button_YEAR() {
				this.WEEK = false
				this.MON = false
				this.YEAR = true
				this.data_type = 2
				this.timeLevel = 1
				this.startTime = this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00'
				this.endTime = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59'
				this.get_trend_data(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
				this.query_month_avg(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
				this.query_minmax(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')
				this.query_weight_avg(this.dateFormat(this.date_22).slice(0, 4) +
					'-01-01 00:00:00', this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59')


			},


			fabClick() {
				if (this.types == true) {
					this.$refs.qs_popup.open("center")
				} else {
					this.fillOut = true
				}
			},


			BMI_tap() {
				this.$refs.popup.open("center")
			},

			knowe() {
				this.$refs.popup.close()
			},

			BMI_tap2() {
				this.$refs.popup1.open("center")
			},

			knowe1() {
				this.$refs.popup1.close()
			},


			closess() {
				this.$refs.qs_popup.close()
			},
			trigger() {

			},


		}
	};
</script>

<style lang="scss" scoped>
	.title_all {
		height: 60px;
		padding: 30px 10px 10px 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: fixed;
		width: 100vw;
		top: 0;
		background: #F7F7F7;
	}



	.title {
		color: black;
		text-align: center;
		width: 85%;
		font-weight: bold;
		font-size: 16px;
	}

	.title2 {
		color: black;
		text-align: center;
		width: 85%;
		font-weight: bold;
		font-size: 16px;
	}

	.title_time {
		border-radius: 10px;
		background: #3298F7;
		display: flex;
		padding: 5px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.table_bg {
		background: white;
		margin: 20px;
		padding: 10px 15px 0 15px;
		border-radius: 20px;
	}

	.table_item_text {
		font-size: 18px;
		font-weight: bold;
		margin-top: 5px;
		margin-left: 15px;
	}

	.img_iocn_bg {
		width: 40px;
		height: 40px;
	}

	.xueya_type {
		width: 15px;
		height: 15px;
		border-radius: 10px;
		background: #258C41;
		margin-left: 10px;
	}

	.title_font_bg {
		margin-left: 5px;
		font-weight: bold
	}

	.title_type_bg {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 15px;
	}

	.border_bg {
		margin: 5px 10px 0 20px;
		background: gainsboro;
		width: 65vw;
		height: 1px;
	}

	.title_all_bg {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 10px;
		margin-right: 10px;
	}

	.text_item_bg {
		font-size: 12px;
		margin-left: 10px;
		margin-right: 10px;
		color: gray;
		width: 60px;
		margin-top: 5px;
		white-space: nowrap;
		overflow: auto;

	}




	.text_item_bg_1 {
		font-size: 16px;
		margin-left: 10px;
	}

	.icon_item_bg {
		display: flex;
		flex-direction: row;
		margin: 20px;
		padding: 10px 5px 10px 5px;
		background: white;
		border-radius: 20px;
	}

	.icon_item_bgsdsadsa {
		display: flex;
		flex-direction: row;
		margin: 0 20px 20px 20px;
		padding: 10px 5px 10px 5px;
		background: white;
		border-radius: 20px;
	}


	.icon_item_bg_toast {
		text-align: center;
		margin: 20px;
		color: #3298F7;
		padding: 15px 0 15px 0;
		background: white;
		border-radius: 15px;
	}

	.icon_item_bg_1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 2px;
	}

	.button_time_1 {
		width: 18vw;
		height: 30px;
		font-size: 14px;
		color: black;
		display: flex;
		background: white;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
	}

	.button_time_2 {
		width: 18vw;
		height: 30px;
		font-size: 14px;
		display: flex;
		background: none;
		justify-content: center;
		border: none;
		color: white;
		align-items: center;
	}

	.text_title_types_1 {
		margin-left: 10px;
		margin-right: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.text_title_types_2 {
		width: 100px;
		margin-top: 15px;
		text-align: center;
		font-size: 12px;
		white-space: nowrap;
		overflow: auto;
	}

	.view_bor {
		height: 30px;
		background: white;
		width: 1px;
		margin-left: 4px;
		margin-right: 4px;
	}

	.charts-box {
		margin-top: 20px;
		padding: 5px;
		background: white;
		border-radius: 20px;
		width: 78vw;
		height: auto;
	}

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box-2 {
		margin-top: 20px;
		padding: 5px;
		background: white;
		border-radius: 20px;
		width: 85vw;
		height: auto;
	}


	.ziti {
		font-weight: bold;
	}


	.tite_icon {
		background: #0686CC;
		width: 80px;
		text-align: center;
		color: white;
		border-top-left-radius: 20px;
		border-bottom-right-radius: 20px;
	}

	.showTotal {
		.show {
			width: 100vw;
			height: 100vh;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			padding-top: 120px;
			padding-left: 10px;
			margin: auto;
			z-index: 10000;
		}


		.over {
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;
			opacity: 0.9;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
		}
	}

	.uni_popup_bg {
		width: 85vw;
		height: 80vh;
		padding: 10px;
		margin: 15px;
		border-radius: 20px;
		background: white;
	}

	.scroll-Y {
		height: 70vh;
	}
</style>