<template>
	<view class="pagedsismj">
		<view class="pagedsismj_2">
			<view class="title_time">
				<view v-if="WEEK" class="button_time_1" @tap="button_WEEK">{{$t('周')}}</view>
				<view v-else class="button_time_2" @tap="button_WEEK">{{$t('周')}}</view>
				<view class="view_bor"></view>
				<view v-if="MON" class="button_time_1" @tap="button_MON">{{$t('月')}}</view>
				<view v-else class="button_time_2" @tap="button_MON">{{$t('月')}}</view>
				<view class="view_bor"></view>
				<view v-if="YEAR" class="button_time_1" @tap="button_YEAR">{{$t('年')}}</view>
				<view v-else class="button_time_2" @tap="button_YEAR">{{$t('年')}}</view>
			</view>
			<view class="pagedsismj_3">
				<view class="pagedsismj_4">
					<picker @change="types_change" :value="types_index" :range="types_array">
						<view class="pagedsismj_5">
							<view style="font-size: 14px;color: black;">{{types_array[types_index]}}</view>
							<uni-icons type="bottom" size="18"></uni-icons>
						</view>
					</picker>
				</view>
				<view v-if="data_type === 0" class="data_type_0">
					<picker fields="day" mode="date" @change="bindDateChange1">
						<view style="display: flex;flex-direction: row;">
							<view style="font-size: 18px;color: gray;">{{date_0}}</view>
							<uni-icons type="bottom" size="18"></uni-icons>
						</view>
					</picker>
				</view>
				<view v-else-if="data_type === 1" class="data_type_0">
					<picker fields="month" mode="date" @change="bindDateChange2">
						<view style="display: flex;flex-direction: row;">
							<view style="font-size: 18px;color: gray;">{{date_1}}</view>
							<uni-icons type="bottom" size="18"></uni-icons>
						</view>
					</picker>
				</view>
				<view v-else-if="data_type === 2" class="data_type_0">
					<picker fields="year" mode="date" @change="bindDateChange3">
						<view style="display: flex;flex-direction: row;">
							<view style="font-size: 18px;color: gray;">{{date_2}}</view>
							<uni-icons type="bottom" size="18"></uni-icons>
						</view>
					</picker>
				</view>
				<view class="pagedsismj_6">
					<view class="ziti" :style="getcolor(act)" @click="button_pingju()">{{$t('平均')}}</view>
					<view class="ziti_1" :style="getcolor1(act1)" @click="button_zuigao()">{{$t('最高')}}</view>
				</view>
			</view>
		</view>
		<view v-if="tendentypes" class="pagedsismj_1">
			<view class="table_bg">
				<view class="table_jjj_1">
					<view>
						<view class="pingjun">
							<view class="pingjun_1" />
							<view class="pingjun_3">{{$t('平均收缩压')}}/{{Blood}}</view>
						</view>
						<view class="table_item_text">{{Systolic_blood_pressure}}</view>
					</view>
					<view style="margin-left: 20px;">
						<view class="pingjun">
							<view class="pingjun_2" />
							<view class="pingjun_3">{{$t('平均舒张压')}}/{{Blood}}</view>
						</view>
						<view class="table_item_text">{{Diastolic_blood_pressure}}</view>
					</view>
				</view>
				<view class="charts-box">
					<qiun-data-charts :canvas2d="true" type="line" canvas-id="10086" :opts="xeuyaopts"
						:chartData="chartData" />
				</view>
			</view>
			<view class="icon_item_bgsdsadsa">
				<view class="icon_item_bg_1">
					<image lazy-load src="../../../static/icons/3.png" class="img_iocn_bg" mode="aspectFit" />
					<view class="xueyastylesss">{{$t('最近血压')}}</view>
				</view>
				<view class="typesstyle_title">
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(lately_Blood_pressure)" />
						<view class="title_font_bg">{{lately_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('收缩压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{lately_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('舒张压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{lately_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('脉搏')}}/BPM</view>
							<view class="text_item_bg_1">{{lately_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image lazy-load src="../../../static/icons/3.png" class="img_iocn_bg" mode="aspectFit" />
					<view class="xueyastylesss">{{$t('平均血压')}}</view>
				</view>
				<view class="typesstyle_title">
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(average_Blood_pressure)" />
						<view class="title_font_bg">{{average_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('收缩压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{average_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('舒张压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{average_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('脉搏')}}/BPM</view>
							<view class="text_item_bg_1">{{average_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image lazy-load src="../../../static/icons/3.png" class="img_iocn_bg" mode="aspectFit" />
					<view class="xueyastylesss">{{$t('最高血压')}}</view>
				</view>
				<view class="typesstyle_title">
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(Maximum_Blood_pressure)" />
						<view class="title_font_bg">{{Maximum_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('收缩压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{Maximum_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('舒张压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{Maximum_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('脉搏')}}/BPM</view>
							<view class="text_item_bg_1">{{Maximum_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image lazy-load src="../../../static/icons/3.png" class="img_iocn_bg" mode="aspectFit" />
					<view class="xueyastylesss">{{$t('最低血压')}}</view>
				</view>
				<view class="typesstyle_title">
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg(Minimum_Blood_pressure)" />
						<view class="title_font_bg">{{Minimum_Blood_pressure}}</view>
						<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('收缩压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{Minimum_Systolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('舒张压')}}/{{Blood}}</view>
							<view class="text_item_bg_1">{{Minimum_Diastolic_blood_pressure}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('脉搏')}}/BPM</view>
							<view class="text_item_bg_1">{{Minimum_pulse}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else style="padding-bottom: 40px;">
			<view class="table_bg">
				<view class="text_title_types_1">
					<view style="display: flex;flex-direction: column; align-items: center;">
						<text class="text_title_types_2">{{$t('最近7天平均体重')}}/kg</text>
						<view style="font-size: 16px; font-weight: 600; color: #1A1A1A; ">{{Mean_value}}</view>
					</view>
					<view style="display: flex;flex-direction: column; align-items: center;width: 33%;">
						<text class="text_title_types_2">BMI</text>
						<view style="font-size: 16px; font-weight: 600; color: #1A1A1A; ">{{bmi}}</view>

					</view>
					<view style="display: flex;flex-direction: column; align-items: center;width: 33%;">
						<text class="text_title_types_2">{{$t('变化速度')}}</text>
						<view style="font-size: 16px; font-weight: 600; color: #1A1A1A; ">{{weight_value}}</view>
					</view>
				</view>
				<view class="charts-box">
					<qiun-data-charts :canvas2d="true" type="line" canvas-id="10011" :opts="tizhonngopts"
						:chartData="chartData2" />
				</view>
			</view>
			<view class="icon_item_bg">
				<view class="icon_item_bg_1">
					<image lazy-load src="../../../static/icons/6.png" class="img_iocn_bg" mode="aspectFit" />
					<view class="xueyastylesss">{{$t('今日体重')}}</view>
				</view>
				<view class="typesstyle_title">
					<view class="title_type_bg">
						<view class="xueya_type" :style="bg1(level_weight)" />
						<view class="title_font_bg">{{level_weight}}</view>
						<uni-icons type="help" size="15" style="" @tap="BMI_tap2"></uni-icons>
					</view>
					<view class="border_bg" />
					<view class="title_all_bg">
						<view>
							<view class="text_item_bg">{{$t('最高体重')}}/{{newweightKG}}</view>
							<view class="text_item_bg_1">{{max_weight}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('最低体重')}}/{{newweightKG}}</view>
							<view class="text_item_bg_1">{{min_weight}}</view>
						</view>
						<view>
							<view class="text_item_bg">{{$t('平均体重')}}/{{newweightKG}}</view>
							<view class="text_item_bg_1">{{avg_weight}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="icon_item_bg_toast">{{Detection_result}}</view>
			<uni-fab ref="fab" :pattern="pattern1" horizontal="right" vertical="bottom" direction="horizontal"
				@fabClick="fabClick" />
		</view>
		<view>
			<uni-popup ref="tizhong_popup" :mask-click="false">
				<view class="popupsdind">
					<view style="display: flex;justify-content: space-between; padding: 15px;">
						<text @click="tz_closess()" style="font-size: 22px;">✖</text>
						<view style="display: flex; flex-direction: row;">
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
						<view class="popupsdind_1">
							<input type="number" v-model="tizhong" :placeholder="$t('请输入体重')"
								style="text-align: center;width: 80vw;" />
							<text>kg</text>
						</view>
					</view>
					<button @tap="jitizhong_tc()" class="butonsd">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<view class="showTotal" v-show="fillOut">
			<view class="over">
				<view class="show">
					<view style="margin-top: 140px;">
						<view style="color: black;font-size: 38px; font-weight: bold;">{{showTotal_date}}</view>
						<view style="background: black; width: 50%; height: 1px;margin-top: 20px;"></view>
						<view style="color: #2595D3;margin-top: 5px;">{{$t('确保每天摄入足够的水')}}</view>
					</view>
					<view style="display: flex; flex-direction: row;  margin-top: 180px;margin-left: 10px;">
						<view style="display: flex;flex-direction: column; align-items: center;" @click="Keep()">
							<image lazy-load src="../../../static/icons/6.png" mode="aspectFit"
								style="width: 50px; height: 50px;border-radius: 40px;object-fit: contain;">
							</image>
							<text
								style="margin-top: 5px;font-weight: bold;text-align:center;width: 80px;">{{$t('记体重')}}</text>
						</view>
						<view style="display: flex;flex-direction: column;  align-items: center;margin-left: 10px;"
							@click="Body_circumference()">
							<image lazy-load src="../../../static/icons/7.png" mode="aspectFit"
								style="width: 50px; height: 50px;border-radius: 40px;object-fit: contain;">
							</image>
							<text
								style="margin-top: 5px;font-weight: bold;text-align:center;width: 80px;">{{$t('记体围')}}</text>
						</view>
					</view>
					<view style="display: flex;justify-content: center;margin-top: 60px;" @click="ddclosess()">
						<uni-icons size="30" type="closeempty"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="tihzi_popup_hd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between;align-items: center; padding:15px;">
						<view @click="hd_closess()">✖</view>
						<view style=" margin-left: 50px;">
							<text @click="dataclick1()">{{birthday1}}</text>
							<uni-icons type="bottom" size="16"></uni-icons>
						</view>
						<view style="color: #3298F7;" @click="sdsr()">{{$t('手动输入')}}</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view>
							<view style="display: flex;justify-content: space-between;margin-top: 10px;">
								<view class="title_select_ruler">{{$t('胸围')}}</view>
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
								<view class="title_select_ruler">{{$t('腰围')}}</view>
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
								<view class="title_select_ruler">{{$t('臀围')}}</view>
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
								<view class="title_select_ruler">{{$t('上臂围')}}</view>
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
								<view class="title_select_ruler">{{$t('大腿围')}}</view>
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
								<view class="title_select_ruler">{{$t('小腿围')}}</view>
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
							style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
					</scroll-view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="tihzi_popup_sd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between; padding: 10px;">
						<text @click="sd_closess()">✖</text>
						<view style="display: flex; flex-direction: row; margin-left: 50px;">
							<text @click="dataclick()">{{birthday111}}</text>
							<uni-icons type="bottom" size="16"></uni-icons>
						</view>
						<view style="color: #3298F7;" @click="hdsr()">{{$t('滑动输入')}}</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view style="padding-bottom: 10px;align-items: center;">
							<view style="padding: 10px;">
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
									<input type="number" v-model="xiongwei" :placeholder="$t('请输入胸围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="yaowei" :placeholder="$t('请输入腰围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="tunwei" :placeholder="$t('请输入臀围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="shangtunwei" :placeholder="$t('请输入上臂围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="datuiwei" :placeholder="$t('请输入大腿围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="xiaotuiwei" :placeholder="$t('请输入小腿围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>

							</view>
							<button @tap="popup_sd()"
								style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
						</view>
					</scroll-view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view class="xueyastyle">
					<view style="font-size: 17px; font-weight: 600;">{{$t("血压分类")}}</view>
					<view style="font-size: 14px; font-weight: 400;margin-top: 10px;color: #999999;">
						{{$t("根据WHOISH的血压分类2020年修订版")}}
					</view>
					<view
						style="background:#222328; color: white;padding: 10px; margin:10px 10px 0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("血压类别")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("收缩压")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("和或")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("舒张压")}}</view>
					</view>
					<view
						style="background:#A6CE39; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("正常血压")}}</view>
						<view style="flex: 1;text-align: center;">91-120</view>
						<view style="flex: 1;text-align: center;">{{$t("和")}}</view>
						<view style="flex: 1;text-align: center;">61-80</view>
					</view>
					<view
						style="background:#FFEC01; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("正常高血压值")}}</view>
						<view style="flex: 1;text-align: center;">121-140</view>
						<view style="flex: 1;text-align: center;">{{$t("或")}}</view>
						<view style="flex: 1;text-align: center;">81-90</view>
					</view>
					<view
						style="background:#FFB602; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("一级高血压")}}</view>
						<view style="flex: 1;text-align: center;">141-160</view>
						<view style="flex: 1;text-align: center;">{{$t("或")}}</view>
						<view style="flex: 1;text-align: center;">91-100</view>
					</view>
					<view
						style="background:#BB3A01; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("二级高血压")}}</view>
						<view style="flex: 1;text-align: center;">161-180</view>
						<view style="flex: 1;text-align: center;">{{$t("或")}}</view>
						<view style="flex: 1;text-align: center;">101-110</view>
					</view>
					<button @tap="knowe()"
						style="width: 120px; height: 48px;  border-radius: 20px;background: #3298F7;color: white;margin-top: 20px">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view
					style="background: #FFFFFF; border-radius: 24px; width: 90vw; padding-bottom: 20px;  margin: 0 10vw 0 10vw;">
					<view style="padding: 20px; ">
						<view style="font-weight: 600;text-align: center; font-size: 16px;">{{$t("BMI分类")}}</view>
						<view style="color: #999999;font-size: 10px;margin-top: 20px;text-align: center;">
							{{$t("根据世界卫生组织的最新BMI分类")}}
						</view>
						<view
							style="display: flex; flex-direction: row; padding: 5px; align-items: center;margin-top: 20px; margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t("BMI范围")}}</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t("分类")}}</view>
						</view>
						<view
							style="padding: 5px;background: #FCCD41; width: 88%;margin-top: 10px; display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">&lt;18.5</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t("体重过轻")}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #58BF78; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">18.5-24.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t("正常体重")}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #FC7F41; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t("超重")}}</view>
						</view>
						<view
							style="padding: 5px;background: #F55A5A; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t("一级肥胖")}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #7A0101; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t("二级肥胖")}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #333333; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 40vw;font-size: 8px;color: white;">{{$t("三级肥胖或病态肥胖")}}
							</view>
						</view>
					</view>
					<button @tap="knowe1()"
						style="width: 120px; height: 48px; border-radius: 100px;background: #3298F7;color: white;display: flex;justify-content: center;align-items: center;">{{$t('知道了')}}</button>
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
							<input type="number" v-model="shousuoya" :placeholder="$t('请输入收缩压')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">{{Blood}}</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shuzhangya" :placeholder="$t('请输入舒张压')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">{{Blood}}</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="maibo" :placeholder="$t('请输入脉搏')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">BPM</text>
						</view>

					</view>
					<button @tap="truesss()"
						style="margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t("确认")}}</button>
				</view>
			</uni-popup>
		</view>
		<view>
			<yt-dateTimePicker ref="myPicker" @submit="handleSubmit" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('年'), $t('月'), $t('日'), $t('时'), $t('分'), $t('周')]" />
		</view>
		<view>
			<yt-dateTimePicker ref="myPicker1" @submit="handleSubmit1" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('年'), $t('月'), $t('日'), $t('时'), $t('分'), $t('周')]" />
		</view>

	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		isInChinaByIP
	} from '../../api/isInChinaByIP.js';
	const getheader = {
		'Authorization': 'Bearer ' + uni.getStorageSync("token"),
		'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
	}
	const postheader = {
		'Authorization': 'Bearer ' + uni.getStorageSync("token"),
		'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
	}
	const platformres = uni.getSystemInfoSync();

	export default {
		computed: {
			...mapState(['info', 'bianhuadata', 'TenddeviceSn']),
		},
		onPullDownRefresh() {
			this.queryDevices()
		},
		data() {
			return {
				types_index: uni.getStorageSync("types_index"),
				types_array: [this.$t("手表"), this.$t("血压计"), this.$t("体重")],
				endtimesss: new Date().toISOString().slice(0, 10),
				datass: new Date().toISOString(),
				fillOut: false,
				showTotal_date: new Date().toISOString().slice(5, 7) + "/" + new Date().toISOString().slice(8, 10),
				Blood: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa",
				tizhong: "",
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
				birthday111: this.$t('今天'),
				birthday1: this.$t('今天'),
				birthday2: this.$t('今天'),
				act: this.$t('平均'),
				act1: '',
				data_type: 0,
				tendentypes: true,
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
					categories: [0],
					series: [{
						legendShape: "#FC7F41",
						name: this.$t("收缩压"),
						data: [0]
					}, {
						legendShape: "#7AE545",
						name: this.$t("舒张压"),
						data: [0]
					}]
				},
				xeuyaopts: {
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
				lately_Blood_pressure: "--",
				lately_Systolic_blood_pressure: "--",
				lately_Diastolic_blood_pressure: "--",
				lately_pulse: "--",
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
				newweightKG: 'KG',
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
					categories: [0],
					series: [{
						legendShape: "#3298F7",
						name: this.$t("体重"),
						data: [0]
					}, ]
				},
				tizhonngopts: {
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
				weight: this.$t("增重速度"),
				Detection_result: this.$t("您的身体数据均为正常请继续保持"),
				birthday: this.$t('今天'),
				shousuoya: "",
				shuzhangya: "",
				maibo: "",
				aggregateType: 'average',
				timeLevel: 0,
				startTime: this.GetTime(7, new Date().toISOString().slice(0, 10) + ' 00:00:00'),
				endTime: new Date().toISOString().slice(0, 10) + ' 23:59:59',
				loact: '',
				arrrylist: [],
				tempBuffer: 0,
				quotient: 0,
				quotient1: 0,
				dataBuffer: [],
				Protocolsubcommand: '',
				writeuuid: '',
				tendtimer: null,
				slaveSn: '3',
			};
		},

		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: "../tendency/Historical_record"
			})
		},

		onHide() {
			this.clearTimer()
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('趋势')
			})
			this.Blood = uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa"
			switch (this.types_index) {
				case 0:
				case 1:
					this.tendentypes = true
					break
				case 2:
					this.tendentypes = false
					break
				default:
					this.tendentypes = true
					this.types_index = 0
					uni.setStorageSync("types_index", this.types_index)
					break
			}
			isInChinaByIP().then(isInChina => {
				const location = isInChina ? "境内" : "境外";
				const newweightKG = uni.getStorageSync("newweight") || 'KG';
				this.loact = location;
				this.newweightKG = newweightKG;
				this.messs()
				this.tendtimer = setInterval(res => {
					if (this.bianhuadata !== 0) {
						this.messs()
						this.setbanhua(0)
					}
				}, 2000)
			});
		},

		methods: {
			...mapMutations(['getInfo', 'setbanhua', 'setTenddeviceSn']),
			clearTimer() {
				if (this.tendtimer) {
					clearInterval(this.tendtimer);
					this.tendtimer = null;
				}
			},
			messs() {
				const token = uni.getStorageSync("token");
				if (!token) {
					uni.redirectTo({
						url: "/pages/login/login_land"
					});
					return;
				}
				this.$get(this.$url_getInfo, {}, getheader).then(res => {
					if (res.code !== 200) return;
					if (this.loact === "境内") {
						if (!res.data.phonenumber && !res.data.email) {
							uni.navigateTo({
								url: '../../login/Force_binding_phone'
							});
							return;
						}
					} else if (this.loact === "境外") {
						if (!res.data.email && !res.data.phonenumber) {
							uni.reLaunch({
								url: "/pages/login/true_register_email"
							});
							return;
						}
					}
					this.getInfo(res.data);
					this.queryDevices();
				});
			},

			types_change(e) {
				this.types_index = e.detail.value
				switch (this.types_index) {
					case 0:
					case 1:
						this.tendentypes = true
						break
					case 2:
						this.tendentypes = false
						break
				}
				uni.setStorageSync("types_index", this.types_index)
				this.queryDevices()
			},

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
				this.birthday2 = e.detail.value
			},

			sdsr() {
				this.$refs.tihzi_popup_hd.close()
				this.$refs.tihzi_popup_sd.open("center")
			},

			hdsr() {
				this.$refs.tihzi_popup_sd.close()
				this.$refs.tihzi_popup_hd.open("center")
			},

			xw_handleChange(e) {
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
			//血压普通弹窗关闭按钮
			knowe() {
				this.$refs.popup.close()
			},
			//BMI普通弹窗按钮
			knowe1() {
				this.$refs.popup1.close()
			},
			//手动输入体重确认按钮
			jitizhong_tc() {
				if (!this.tizhong) {
					uni.showToast({
						title: this.$t("请输入体重"),
						icon: 'none'
					});
					return;
				}
				this.fat_scale_tz();
			},

			select_ruler() {
				this.fat_scale_1()
			},
			//用户在app手动上报重量数据
			fat_scale_tz() {
				let that = this
				let timestamp = Math.floor(new Date(that.birthday2 == that.$t('今天') ?
					new Date().toISOString().slice(0, 10) + " " + new Date().getHours() + ":" + new Date()
					.getMinutes() : that.birthday2).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
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
						if (res.data.code == 200) {
							that.tizhong = ''
							that.birthday2 = that.$t('今天')
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.$refs.tizhong_popup.close()
							let str = new Date().toISOString().slice(0, 10) + ' 00:00:00'
							let end = new Date().toISOString().slice(0, 10) + " 23:59:59"
							that.query_weight_day(str, end)
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
				let timestamp = Math.floor(new Date(that.birthday111 == that.$t('今天') ?
					new Date()
					.toISOString().slice(0, 10) : that.birthday111).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
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
						if (res.data.code == 200) {
							that.birthday111 = that.$t('今天')
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
				let timestamp = Math.floor(new Date(that.birthday1 == that.$t('今天') ?
					new Date()
					.toISOString().slice(0, 10) : that.birthday1).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
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
			// 确认手动输入六围数据
			popup_sd() {
				const measurements = [{
						value: this.xiongwei,
						message: this.$t('请输入胸围')
					},
					{
						value: this.yaowei,
						message: this.$t('请输入腰围')
					},
					{
						value: this.tunwei,
						message: this.$t('请输入臀围')
					},
					{
						value: this.shangtunwei,
						message: this.$t('请输入上臂围')
					},
					{
						value: this.datuiwei,
						message: this.$t('请输入大腿围')
					},
					{
						value: this.xiaotuiwei,
						message: this.$t('请输入小腿围')
					}
				];
				for (const {
						value,
						message
					}
					of measurements) {
					if (!value) {
						uni.showToast({
							title: message,
							icon: 'none'
						});
						return;
					}
				}
				this.fat_scale();
			},
			//获取已绑定的设备
			queryDevices() {
				this.$post(this.$url_queryDevices, {}, getheader).then(res => {
					if (res.code === 200) {
						uni.stopPullDownRefresh(); // 停止下拉刷新动画
						if (!res.rows || res.rows.length === 0) {
							uni.getStorageInfo({
								success(types_index) {
									const typesIndex = types_index.keys.includes("types_index") ?
										uni.getStorageSync("types_index") : 0;
									this.tendentypes = typesIndex === 0 || typesIndex === 1;
									if (!types_index.keys.includes("types_index")) {
										uni.setStorageSync("types_index", 0);
									}
								}
							});
						} else {
							this.aaaa(res.rows);
						}
					}
				})
			},
			// 判断设备并对对应设备蓝牙连接
			aaaa(rows) {
				for (let i = 0; rows.length > i; i++) {
					switch (this.types_index) {
						case 0:
							this.tendentypes = true
							if (rows[i].deviceTypeId === "13") {
								this.slaveSn = "3"
								this.get_device_info(rows[i].deviceSn)
							} else {
								this.slaveSn = "3"
								this.setTenddeviceSn("")
								this.chartData.categories = []
								this.chartData.series[0].data = []
								this.chartData.series[1].data = []
								this.chartData2.categories = []
								this.chartData2.series[0].data = []
								this.Systolic_blood_pressure = "--"
								this.Diastolic_blood_pressure = "--"
								//最近
								this.lately_Blood_pressure = "--"
								this.lately_Systolic_blood_pressure = "--"
								this.lately_Diastolic_blood_pressure = "--"
								this.lately_pulse = "--"
								//平均
								this.average_Blood_pressure = "--"
								this.average_Systolic_blood_pressure = "--"
								this.average_Diastolic_blood_pressure = "--"
								this.average_pulse = "--"
								//最高
								this.Maximum_Blood_pressure = "--"
								this.Maximum_Systolic_blood_pressure = "--"
								this.Maximum_Diastolic_blood_pressure = "--"
								this.Maximum_pulse = "--"
								//最低
								this.Minimum_Blood_pressure = "--"
								this.Minimum_Systolic_blood_pressure = "--"
								this.Minimum_Diastolic_blood_pressure = "--"
								this.Minimum_pulse = "--"
							}
							break
						case 1:
							this.tendentypes = true
							if (rows[i].deviceTypeId === "10") {
								this.slaveSn = "2"
								this.get_device_info(rows[i].deviceSn)
							} else {
								this.setTenddeviceSn("")
								this.chartData.categories = []
								this.chartData.series[0].data = []
								this.chartData.series[1].data = []
								this.chartData2.categories = []
								this.chartData2.series[0].data = []
								this.Systolic_blood_pressure = "--"
								this.Diastolic_blood_pressure = "--"
								//最近
								this.lately_Blood_pressure = "--"
								this.lately_Systolic_blood_pressure = "--"
								this.lately_Diastolic_blood_pressure = "--"
								this.lately_pulse = "--"
								//平均
								this.average_Blood_pressure = "--"
								this.average_Systolic_blood_pressure = "--"
								this.average_Diastolic_blood_pressure = "--"
								this.average_pulse = "--"
								//最高
								this.Maximum_Blood_pressure = "--"
								this.Maximum_Systolic_blood_pressure = "--"
								this.Maximum_Diastolic_blood_pressure = "--"
								this.Maximum_pulse = "--"
								//最低
								this.Minimum_Blood_pressure = "--"
								this.Minimum_Systolic_blood_pressure = "--"
								this.Minimum_Diastolic_blood_pressure = "--"
								this.Minimum_pulse = "--"
							}
							break;
						case 2:
							this.tendentypes = false
							if (rows[i].deviceTypeId == "11") {
								this.get_device_info(rows[i].deviceSn)
								const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
								TestUniPlugin.startScan("", (callback) => {
									clearInterval(this.heartbeatInterval1)
									this.heartbeatInterval1 = null
									if (rows[i].mac === callback.data.mac) {
										if (callback.data.weightStatus === 1) {
											if (callback.data.weightUnit === 0) {
												uni.setStorageSync("newweight", "KG")
											} else {
												uni.setStorageSync("newweight", "lb")
											}
											if (callback.data.weight !== "0.00") {
												this.jakoblife_fat_scale1(rows[i].deviceSn, rows[i].mac, callback
													.data, "")
											}
										}
									}
								});
							}
							break;
					}
				}
			},
			jakoblife_fat_scale1(deviceSn, deviceId, parsedData, listleng) {
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "0",
					slaveData: {
						weight: parsedData.weight,
						adc: parsedData.adc
					},
					time: parsedData.createTime
				}
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 500) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						return
					}
					this.get_device_info(deviceSn)
				})
			},
			//平均按钮
			button_pingju() {
				this.act = this.$t("平均");
				this.act1 = "";
				this.aggregateType = 'average';
				const setPeriod = (start, end) => {
					this.startTime = start;
					this.endTime = end;
					this.get_trend_data(start, end);
					this.query_month_avg(start, end);
					this.query_minmax(start, end);
					this.query_weight_avg(start, end);
				};
				if (this.WEEK) {
					const weekStart = this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) + ' 00:00:00');
					const weekEnd = this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59';
					setPeriod(weekStart, weekEnd);
				} else if (this.MON) {
					const nowDate = new Date(this.date_11);
					const fullYear = nowDate.getFullYear();
					const month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
					const endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
					const monthStart = this.dateFormat(this.date_11).slice(0, 7) + '-01 00:00:00';
					const monthEnd = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59';
					setPeriod(monthStart, monthEnd);
				} else if (this.YEAR) {
					const yearStart = this.dateFormat(this.date_22).slice(0, 4) + '-01-01 00:00:00';
					const yearEnd = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59';
					setPeriod(yearStart, yearEnd);
				}
			},
			//最高按钮
			button_zuigao() {
				this.act = "";
				this.act1 = this.$t("最高");
				this.aggregateType = 'max';
				const setPeriod = (start, end) => {
					this.startTime = start;
					this.endTime = end;
					this.get_trend_data(start, end);
					this.query_month_avg(start, end);
					this.query_minmax(start, end);
					this.query_weight_avg(start, end);
				};
				if (this.WEEK) {
					const weekStart = this.GetTime(7, this.dateFormat(this.date_00).slice(0, 10) + ' 00:00:00');
					const weekEnd = this.dateFormat(this.date_00).slice(0, 10) + ' 23:59:59';
					setPeriod(weekStart, weekEnd);
				} else if (this.MON) {
					const nowDate = new Date(this.date_11);
					const fullYear = nowDate.getFullYear();
					const month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
					const endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
					const monthStart = this.dateFormat(this.date_11).slice(0, 7) + '-01 00:00:00';
					const monthEnd = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59';
					setPeriod(monthStart, monthEnd);
				} else if (this.YEAR) {
					const yearStart = this.dateFormat(this.date_22).slice(0, 4) + '-01-01 00:00:00';
					const yearEnd = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59';
					setPeriod(yearStart, yearEnd);
				}
			},
			getcolor(id) {
				return {
					color: id === this.$t("平均") ? "#3298F7" : "black"
				}
			},
			getcolor1(id) {
				return {
					color: id === this.$t("最高") ? "#3298F7" : "black"
				}
			},
			//获取设备基础信息
			get_device_info(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_get_device_info, data, postheader).then(res => {
					if (res.code == 200) {
						switch (this.types_index) {
							case 0:
								if (res.data.deviceTypeId === "13") {
									this.setTenddeviceSn(deviceSn)
									this.get_trend_data(this.startTime, this.endTime)
									this.query_month_avg(this.startTime, this.endTime)
									this.query_minmax(this.startTime, this.endTime)
								} else {
									this.setTenddeviceSn("")
									this.chartData.categories = []
									this.chartData.series[0].data = []
									this.chartData.series[1].data = []
									this.chartData2.categories = []
									this.chartData2.series[0].data = []
									this.Systolic_blood_pressure = "--"
									this.Diastolic_blood_pressure = "--"
									//最近
									this.lately_Blood_pressure = "--"
									this.lately_Systolic_blood_pressure = "--"
									this.lately_Diastolic_blood_pressure = "--"
									this.lately_pulse = "--"
									//平均
									this.average_Blood_pressure = "--"
									this.average_Systolic_blood_pressure = "--"
									this.average_Diastolic_blood_pressure = "--"
									this.average_pulse = "--"
									//最高
									this.Maximum_Blood_pressure = "--"
									this.Maximum_Systolic_blood_pressure = "--"
									this.Maximum_Diastolic_blood_pressure = "--"
									this.Maximum_pulse = "--"
									//最低
									this.Minimum_Blood_pressure = "--"
									this.Minimum_Systolic_blood_pressure = "--"
									this.Minimum_Diastolic_blood_pressure = "--"
									this.Minimum_pulse = "--"
								}
								break
							case 1:
								if (res.data.deviceTypeId === "10") {
									this.setTenddeviceSn(deviceSn)
									this.get_trend_data(this.startTime, this.endTime)
									this.query_month_avg(this.startTime, this.endTime)
									this.query_minmax(this.startTime, this.endTime)
								} else {
									this.setTenddeviceSn("")
									this.chartData.categories = []
									this.chartData.series[0].data = []
									this.chartData.series[1].data = []
									this.chartData2.categories = []
									this.chartData2.series[0].data = []
									this.Systolic_blood_pressure = "--"
									this.Diastolic_blood_pressure = "--"
									//最近
									this.lately_Blood_pressure = "--"
									this.lately_Systolic_blood_pressure = "--"
									this.lately_Diastolic_blood_pressure = "--"
									this.lately_pulse = "--"
									//平均
									this.average_Blood_pressure = "--"
									this.average_Systolic_blood_pressure = "--"
									this.average_Diastolic_blood_pressure = "--"
									this.average_pulse = "--"
									//最高
									this.Maximum_Blood_pressure = "--"
									this.Maximum_Systolic_blood_pressure = "--"
									this.Maximum_Diastolic_blood_pressure = "--"
									this.Maximum_pulse = "--"
									//最低
									this.Minimum_Blood_pressure = "--"
									this.Minimum_Systolic_blood_pressure = "--"
									this.Minimum_Diastolic_blood_pressure = "--"
									this.Minimum_pulse = "--"
								}
								break
							case 2:
								if (res.data.deviceTypeId === "11") {
									this.setTenddeviceSn(deviceSn)
									this.get_trend_data(this.startTime, this.endTime)
									this.query_weight_avg(this.startTime, this.endTime)
									let str = new Date().toISOString().slice(0, 10) + ' 00:00:00'
									let end = new Date().toISOString().slice(0, 10) + " 23:59:59"
									this.query_weight_day(str, end)
								} else {
									this.setTenddeviceSn("")
									this.chartData.categories = []
									this.chartData.series[0].data = []
									this.chartData.series[1].data = []
									this.chartData2.categories = []
									this.chartData2.series[0].data = []
									this.Mean_value = "--"
									this.bmi = "--"
									this.weight_value = "--"
									this.level_weight = "--"
									this.max_weight = "--"
									this.min_weight = "--"
									this.avg_weight = "--"
								}
								break
						}
					} else if (res.code == 500) {
						return
					} else {
						uni.setStorageSync("deviceSn", "")
						this.chartData.categories = [""]
						this.chartData.series[0].data = [""]
						this.chartData.series[1].data = [""]
						this.chartData2.categories = [""]
						this.chartData2.series[0].data = [""]
						this.Systolic_blood_pressure = "--"
						this.Diastolic_blood_pressure = "--"
						//最近
						this.lately_Blood_pressure = "--"
						this.lately_Systolic_blood_pressure = "--"
						this.lately_Diastolic_blood_pressure = "--"
						this.lately_pulse = "--"
						//平均
						this.average_Blood_pressure = "--"
						this.average_Systolic_blood_pressure = "--"
						this.average_Diastolic_blood_pressure = "--"
						this.average_pulse = "--"
						//最高
						this.Maximum_Blood_pressure = "--"
						this.Maximum_Systolic_blood_pressure = "--"
						this.Maximum_Diastolic_blood_pressure = "--"
						this.Maximum_pulse = "--"
						//最低
						this.Minimum_Blood_pressure = "--"
						this.Minimum_Systolic_blood_pressure = "--"
						this.Minimum_Diastolic_blood_pressure = "--"
						this.Minimum_pulse = "--"
					}
				})
			},
			//数据趋势
			get_trend_data(startTime, endTime) {
				const data = {
					deviceSn: this.TenddeviceSn,
					timeLevel: this.timeLevel,
					slaveList: [{
							slaveSn: this.slaveSn,
							register: "highPressure"
						},
						{
							slaveSn: this.slaveSn,
							register: "lowPressure"
						},
						{
							slaveSn: "0",
							register: "weight"
						}
					],
					startTime: startTime,
					endTime: endTime,
					aggregateType: this.aggregateType
				}
				this.$post(this.$url_get_trend_data, data, getheader).then(res => {
					if (res.code == 200) {
						this.chartData.categories = []
						this.chartData.series[0].data = []
						// 处理高压数据
						if (res.data.highPressure) {
							res.data.highPressure.forEach(item => {
								this.chartData.series[0].data.push(item[0]);
							});
						}
						this.chartData.series[1].data = []
						// 处理低压数据
						if (res.data.lowPressure) {
							res.data.lowPressure.forEach(item => {
								let time = this.formatDate(parseInt(item[1]));
								this.chartData.categories.push(time);
								this.chartData.series[1].data.push(item[0]);
							});
						}
						this.chartData2.series[0].data = []
						this.chartData2.categories = []
						// 处理体重数据
						if (res.data.weight) {
							res.data.weight.forEach(item => {
								let time = this.formatDate(parseInt(item[1]));
								this.chartData2.categories.push(time);
								this.chartData2.series[0].data.push(item[0]);
							});
						}
					} else if (res.code == 500) {
						this.chartData.categories = ["0"]
						this.chartData.series[0].data = ["0"]
						this.chartData.series[1].data = ["0"]
						this.chartData2.categories = ["0"]
						this.chartData2.series[0].data = ["0"]
						return
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.chartData.categories = ["0"]
						this.chartData.series[0].data = ["0"]
						this.chartData.series[1].data = ["0"]
						this.chartData2.categories = ["0"]
						this.chartData2.series[0].data = ["0"]
						return
					}
					// 关键点：添加下一行确保视图更新
					this.$nextTick(() => this.$forceUpdate())
				})
			},
			//血压计统计每日平均值计算总最大最小值
			query_month_avg(startTime, endTime) {
				const data = {
					deviceSn: this.TenddeviceSn,
					slaveList: [{
						slaveSn: "0",
						register: "highPressure"
					}, ],
					startTime: startTime,
					endTime: endTime,
				}
				this.$post(this.$url_query_month_avg, data, getheader).then(res => {
					if (res.code == 200) {
						this.Systolic_blood_pressure = this.Blood === "mmHg" ? res.data.high.min + "-" + res.data
							.high.max : (Number(res.data.high.min) * 0.133).toFixed(1) + "-" + (Number(res.data
								.high.max) * 0.133).toFixed(1)
						this.Diastolic_blood_pressure = this.Blood === "mmHg" ? res.data.low.min + "-" + res.data
							.low.max : (Number(res.data.low.min) * 0.133).toFixed(1) + "-" + (Number(res.data.low
								.max) * 0.133).toFixed(1)
					} else if (res.code == 500) {
						this.Systolic_blood_pressure = "--"
						this.Diastolic_blood_pressure = "--"
						return
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//血压计最高最低平均数值
			query_minmax(startTime, endTime) {
				const data = {
					deviceSn: this.TenddeviceSn,
					dataType: "min",
					slaveList: [{
						slaveSn: "0",
						register: "highPressure"
					}, ],
					startTime: startTime,
					endTime: endTime,
				}
				this.$post(this.$url_query_minmax, data, getheader).then(res => {
					if (res.code == 200) {
						//最近
						this.lately_Blood_pressure = this.bgaaa(res.data.last.lowPressure, res.data.last
							.highPressure)
						this.lately_Systolic_blood_pressure = this.Blood === "mmHg" ? res.data.last
							.highPressure === null ? "-" : res.data.last.highPressure : (Number(res.data.last
								.highPressure) * 0.133).toFixed(1)
						this.lately_Diastolic_blood_pressure = this.Blood === "mmHg" ? res.data.last
							.lowPressure === null ? "-" : res.data
							.last.lowPressure : (Number(res.data.last.lowPressure) * 0.133).toFixed(1)
						this.lately_pulse = res.data.last.heartrate === null ? "-" : res.data.last.heartrate
						//平均
						this.average_Blood_pressure = this.bgaaa(res.data.avg.lowPressure, res.data.avg
							.highPressure)
						this.average_Systolic_blood_pressure = this.Blood === "mmHg" ? res.data.avg.highPressure :
							(Number(res.data.avg.highPressure) * 0.133).toFixed(1)
						this.average_Diastolic_blood_pressure = this.Blood === "mmHg" ? res.data.avg.lowPressure :
							(Number(res.data.avg.lowPressure) * 0.133).toFixed(1)
						this.average_pulse = res.data.avg.heartrate
						//最高
						this.Maximum_Blood_pressure = this.bgaaa(res.data.max.lowPressure, res.data.max
							.highPressure)
						this.Maximum_Systolic_blood_pressure = this.Blood === "mmHg" ? res.data.max.highPressure :
							(Number(res.data.max.highPressure) * 0.133).toFixed(1)
						this.Maximum_Diastolic_blood_pressure = this.Blood === "mmHg" ? res.data.max.lowPressure :
							(Number(res.data.max.lowPressure) * 0.133).toFixed(1)
						this.Maximum_pulse = res.data.max.heartrate === null ? '-' : res.data.max.heartrate
						//最低
						this.Minimum_Blood_pressure = this.bgaaa(res.data.min.lowPressure, res.data.min
							.highPressure)
						this.Minimum_Systolic_blood_pressure = this.Blood === "mmHg" ? res.data.min.highPressure ==
							null ? "-" : res.data
							.min.highPressure :
							(Number(res.data.min.highPressure) * 0.133).toFixed(1)
						this.Minimum_Diastolic_blood_pressure = this.Blood === "mmHg" ? res.data.min.lowPressure ==
							null ? "-" : res.data
							.min.lowPressure :
							(Number(res.data.min.lowPressure) * 0.133).toFixed(1)
						this.Minimum_pulse = res.data.min.heartrate == null ? "-" : res.data.min.heartrate
					} else if (res.code == 500) {
						//最近
						this.lately_Blood_pressure = "--"
						this.lately_Systolic_blood_pressure = "--"
						this.lately_Diastolic_blood_pressure = "--"
						this.lately_pulse = "--"
						//平均
						this.average_Blood_pressure = "--"
						this.average_Systolic_blood_pressure = "--"
						this.average_Diastolic_blood_pressure = "--"
						this.average_pulse = "--"
						//最高
						this.Maximum_Blood_pressure = "--"
						this.Maximum_Systolic_blood_pressure = "--"
						this.Maximum_Diastolic_blood_pressure = "--"
						this.Maximum_pulse = "--"
						//最低
						this.Minimum_Blood_pressure = "--"
						this.Minimum_Systolic_blood_pressure = "--"
						this.Minimum_Diastolic_blood_pressure = "--"
						this.Minimum_pulse = "--"
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//体脂秤统计最近1周/月平均体重、bmi、变化速度
			query_weight_avg(startTime, endTime) {
				const data = {
					deviceSn: this.TenddeviceSn,
					startTime: startTime,
					endTime: endTime,
				}
				this.$post(this.$url_query_weight_avg, data, getheader).then(res => {
					if (res.code == 200) {
						this.Mean_value = res.data.avgWeight
						this.bmi = res.data.bmi
						this.weight_value = res.data.change
					} else if (res.code == 500) {
						this.Mean_value = "--"
						this.bmi = "--"
						this.weight_value = "--"
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//体脂秤计算当天最高/最低/平均体重和肥胖等级
			query_weight_day(startTime, endTime) {
				const data = {
					deviceSn: this.TenddeviceSn,
					startTime: startTime,
					endTime: endTime,
				}
				this.$post(this.$url_query_weight_day, data, getheader).then(res => {
					if (res.code == 200) {
						this.level_weight = res.data.level
						this.max_weight = res.data.max
						this.min_weight = res.data.min
						this.avg_weight = res.data.avg
					} else if (res.code == 500) {
						this.level_weight = "--"
						this.max_weight = "--"
						this.min_weight = "--"
						this.avg_weight = "--"
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
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
				let that = this;
				const validateInput = (value, message) => {
					if (!value) {
						uni.showToast({
							title: that.$t(message),
							icon: "none"
						});
						return false;
					}
					return true;
				};
				if (
					!validateInput(that.shuzhangya, '请输入收缩压') ||
					!validateInput(that.shousuoya, '请输入舒张压') ||
					!validateInput(that.maibo, '请输入脉搏')
				) {
					return;
				}
				that.pressure_data();
			},
			//用户在app手动上报血压数据
			pressure_data() {
				const timestamp = Math.floor(new Date(this.birthday == this.$t('今天') ? new Date()
					.toISOString().slice(0, 10) + " " + new Date().getHours() + ":" + new Date()
					.getMinutes() : this.birthday + " " + new Date().getHours() + ":" + new Date().getMinutes()
				).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
				const data = {
					deviceSn: this.TenddeviceSn,
					slaveSn: "0",
					slaveData: {
						lowPressure: this.shuzhangya,
						highPressure: this.shousuoya,
						heartrate: this.maibo
					},
					time: timestamp
				}
				this.$post(this.$url_pressure_data, data, getheader).then(res => {
					if (res.code == 200) {
						this.$refs.qs_popup.close()
						this.birthday = this.$t('今天')
						this.shousuoya = ''
						this.shuzhangya = ''
						this.maibo = ''
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.query_minmax(this.startTime, this.endTime)
					} else if (res.code == 500) {
						return
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			bg(bg) {
				const bloodPressureColors = {
					[this.$t("正常血压")]: "#58BF78",
					[this.$t("正常高血压值")]: "#FFEC01",
					[this.$t("一级高血压")]: "#FCCD41",
					[this.$t("二级高血压")]: "#F55A5A"
				};
				return {
					background: bloodPressureColors[bg] || '#FFFFFF'
				};
			},
			bgaaa(lowPressure, highPressure) {
				let that = this;
				const getBloodPressureLevel = (lowPressure, highPressure) => {
					if ((lowPressure >= 61 && lowPressure <= 80) && (highPressure >= 91 && highPressure <= 120)) {
						return that.$t("正常血压");
					} else if ((lowPressure >= 81 && lowPressure <= 90) || (highPressure >= 121 && highPressure <=
							140)) {
						return that.$t("正常高血压值");
					} else if ((lowPressure >= 91 && lowPressure <= 100) || (highPressure >= 141 && highPressure <=
							160)) {
						return that.$t("一级高血压");
					} else if ((lowPressure >= 101 && lowPressure <= 110) || (highPressure >= 161 && highPressure <=
							180)) {
						return that.$t("二级高血压");
					} else {
						return that.$t("未知");
					}
				};
				let leve = getBloodPressureLevel(lowPressure, highPressure);
				return leve;
			},
			bg1(bg) {
				const weightStatusColors = {
					[this.$t("体重过轻")]: "#FCCD41",
					[this.$t("正常体重")]: "#58BF78",
					[this.$t("超重")]: "#FC7F41",
					[this.$t("一级肥胖")]: "#F55A5A",
					[this.$t("二级肥胖")]: "#7A0101",
					[this.$t("三级肥胖或病态肥胖")]: "#333333"
				};
				return {
					background: weightStatusColors[bg] || '#FFFFFF'
				};
			},
			bindDateChange1(e) {
				this.date_0 = e.detail.value.replace(/-/g, "/");
				this.date_00 = e.detail.value;
				const formattedDate = this.dateFormat(this.date_00).slice(0, 10);
				const weekStart = this.GetTime(7, formattedDate + ' 00:00:00');
				const weekEnd = formattedDate + ' 23:59:59';
				this.startTime = weekStart;
				this.endTime = weekEnd;
				this.get_trend_data(weekStart, weekEnd);
				this.query_month_avg(weekStart, weekEnd);
				this.query_minmax(weekStart, weekEnd);
				this.query_weight_avg(weekStart, weekEnd);
			},
			bindDateChange2(e) {
				this.date_1 = e.detail.value.slice(0, 7).replace("-", "/");
				this.date_11 = e.detail.value;
				const nowDate = new Date(this.date_11);
				const fullYear = nowDate.getFullYear();
				const month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
				const endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
				const monthStart = this.dateFormat(this.date_11).slice(0, 7) + '-01 00:00:00';
				const monthEnd = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59';
				this.startTime = monthStart;
				this.endTime = monthEnd;
				this.get_trend_data(monthStart, monthEnd);
				this.query_month_avg(monthStart, monthEnd);
				this.query_minmax(monthStart, monthEnd);
				this.query_weight_avg(monthStart, monthEnd);
			},
			bindDateChange3(e) {
				this.date_2 = e.detail.value.slice(0, 4);
				this.date_22 = e.detail.value;
				const yearStart = this.dateFormat(this.date_22).slice(0, 4) + '-01-01 00:00:00';
				const yearEnd = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59';
				this.startTime = yearStart;
				this.endTime = yearEnd;
				this.get_trend_data(yearStart, yearEnd);
				this.query_month_avg(yearStart, yearEnd);
				this.query_minmax(yearStart, yearEnd);
				this.query_weight_avg(yearStart, yearEnd);
			},
			bindDateChange(e) {
				this.birthday = e.detail.value.replace(/-/g, "/");
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
			button_WEEK() {
				this.WEEK = true;
				this.MON = false;
				this.YEAR = false;
				this.data_type = 0;
				this.timeLevel = 0;
				const formattedDate = this.dateFormat(this.date_00).slice(0, 10);
				const weekStart = this.GetTime(7, formattedDate + ' 00:00:00');
				const weekEnd = formattedDate + ' 23:59:59';
				this.startTime = weekStart;
				this.endTime = weekEnd;
				this.get_trend_data(weekStart, weekEnd);
				this.query_month_avg(weekStart, weekEnd);
				this.query_minmax(weekStart, weekEnd);
				this.query_weight_avg(weekStart, weekEnd);
			},
			button_MON() {
				this.WEEK = false;
				this.MON = true;
				this.YEAR = false;
				this.data_type = 1;
				this.timeLevel = 0;
				const nowDate = new Date(this.date_11);
				const fullYear = nowDate.getFullYear();
				const month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
				const endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
				const monthStart = this.dateFormat(this.date_11).slice(0, 7) + '-01 00:00:00';
				const monthEnd = this.dateFormat(this.date_11).slice(0, 7) + '-' + endOfMonth + ' 23:59:59';
				this.startTime = monthStart;
				this.endTime = monthEnd;
				this.get_trend_data(monthStart, monthEnd);
				this.query_month_avg(monthStart, monthEnd);
				this.query_minmax(monthStart, monthEnd);
				this.query_weight_avg(monthStart, monthEnd);
			},
			button_YEAR() {
				this.WEEK = false;
				this.MON = false;
				this.YEAR = true;
				this.data_type = 2;
				this.timeLevel = 1;
				const yearStart = this.dateFormat(this.date_22).slice(0, 4) + '-01-01 00:00:00';
				const yearEnd = this.dateFormat(this.date_22).slice(0, 4) + '-12-31 23:59:59';
				this.startTime = yearStart;
				this.endTime = yearEnd;
				this.get_trend_data(yearStart, yearEnd);
				this.query_month_avg(yearStart, yearEnd);
				this.query_minmax(yearStart, yearEnd);
				this.query_weight_avg(yearStart, yearEnd);
			},
			//悬浮框点击按钮
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
			BMI_tap2() {
				this.$refs.popup1.open("center")
			},
			closess() {
				this.$refs.qs_popup.close()
			},
		}
	};
</script>

<style lang="scss" scoped>
	.pagedsismj {
		color: black;
		height: 100vh;
		background: #EFEFF4;
	}

	.pagedsismj_1 {
		background: #EFEFF4;
		padding-bottom: 120px;
	}

	.pagedsismj_2 {
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}


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


	.title_time {
		border-radius: 10px;
		background: #3298F7;
		display: flex;
		padding: 5px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.table_bg {
		width: auto;
		background: white;
		margin: 20px;
		padding: 20px 20px 0 15px;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.table_jjj_1 {
		display: flex;
		flex-direction: row;
	}

	.pingjun {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.pingjun_1 {
		background: #FC7F41;
		width: 10px;
		height: 10px;
		border-radius: 5px
	}

	.pingjun_2 {
		background: #7AE545;
		width: 10px;
		height: 10px;
		border-radius: 5px
	}

	.pingjun_3 {
		margin-left: 5px;
		color: #999999;
		font-size: 10px;
	}

	.table_item_text {
		font-size: 16px;
		font-weight: bold;
		margin-top: 5px;
		margin-left: 15px;
	}

	.img_iocn_bg {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.xueya_type {
		width: 14px;
		height: 14px;
		border-radius: 10px;
		background: #258C41;
		margin-left: 10px;
	}

	.title_font_bg {
		margin-left: 5px;
		font-size: 14px;
		font-weight: 400
	}

	.xueyastylesss {
		margin-top: 10px;
		text-align: center;
		line-height: 15px;
		width: 52px;
		font-size: 13px;
		font-weight: 400;
	}

	.typesstyle_title {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		margin-right: 10px;
		flex: 4;
	}

	.title_type_bg {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 5px;
	}

	.border_bg {
		width: auto;
		background: #CCCCCC;
		height: 1px;
		margin-top: 5px;
	}

	.title_all_bg {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 5px;
		align-items: center;
	}

	.text_item_bg {
		font-size: 10px;
		color: #999999;
		margin-top: 5px;
	}

	.text_item_bg_1 {
		font-weight: bold;
		margin-top: 10px;
		font-size: 16px;
	}

	.tizhongsds {
		width: 80vw;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
	}

	.icon_item_bg {
		width: auto;
		height: 116px;
		margin-top: 20px;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		justify-content: left;
		align-items: center;
		flex-direction: row;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.icon_item_bgsdsadsa {
		height: 116px;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		justify-content: left;
		align-items: center;
		flex-direction: row;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}


	.icon_item_bg_toast {
		text-align: center;
		margin: 20px;
		color: #3298F7;
		padding: 15px 0 15px 0;
		background: white;
		border-radius: 15px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.popupsdind {
		border-radius: 20px;
		background: #fff;
		margin-top: 60px;
		padding-bottom: 10px;
		align-items: center;
	}

	.popupsdind_1 {
		display: flex;
		flex-direction: row;
		background: #F7F7F7;
		padding: 15px;
		border-radius: 10px;
	}

	.butonsd {
		margin: 40px 50px 20px 50px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
	}



	.icon_item_bg_1 {
		flex: 1;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
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

	.pagedsismj_3 {
		width: 80vw;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
	}

	.pagedsismj_4 {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.pagedsismj_5 {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.data_type_0 {
		flex: 1.5;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.pagedsismj_6 {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.text_title_types_1 {
		width: auto;
		margin-left: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.text_title_types_2 {
		width: auto;
		margin-top: 15px;
		text-align: center;
		color: #999999;
		font-weight: 400;
		font-size: 10px;
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
		width: 100%;
		height: 300px;
	}

	.ziti {
		font-weight: 600;
		margin-right: 5px;
		margin-left: 10px;
	}

	.ziti_1 {
		font-weight: 600;
		margin-left: 5px;
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

	.xueyastyle {
		background: #FFFFFF;
		width: 85vw;
		margin-left: 8vw;
		margin-right: 8vw;
		border-radius: 24px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 20px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 40px;
	}
</style>