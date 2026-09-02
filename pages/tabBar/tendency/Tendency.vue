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
						:chartData="chartData" :optsWatch="true" :reshow="bpChartReshow" />
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
						<text class="text_title_types_2">{{$t('最近7天平均体重')}}/{{ newweightKG }}</text>
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
						:chartData="chartData2" :optsWatch="true" :reshow="weightChartReshow" />
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
					<view class="popupsdind-header">
						<view class="popupsdind-header-side" @click="tz_closess()">
							<text class="popupsdind-close">✖</text>
						</view>
						<view class="popupsdind-header-center">
							<picker fields="day" mode="date" :value="birthday2" @change="bindDateChange2s"
								:end='endtimesss'>
								<view class="popupsdind-date">
									<text class="popupsdind-date-text">{{birthday2}}</text>
									<uni-icons type="bottom" size="16"></uni-icons>
								</view>
							</picker>
						</view>
						<view class="popupsdind-header-side"></view>
					</view>
					<view class="popupsdind-body">
						<view class="popupsdind_1">
							<input type="number" v-model="tizhong" :placeholder="$t('请输入体重')"
								class="popupsdind-input" />
							<text class="popupsdind-unit">kg</text>
						</view>
					</view>
					<button @tap="jitizhong_tc()" class="butonsd">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<view class="showTotal" v-show="fillOut">
			<view class="over">
				<view class="show">
					<view class="showTotal-header">
						<view class="showTotal-date">{{showTotal_date}}</view>
						<view class="showTotal-tip-row">
							<view class="showTotal-divider"></view>
							<view class="showTotal-tip">{{$t('确保每天摄入足够的水')}}</view>
						</view>
					</view>
					<view class="showTotal-actions">
						<view class="showTotal-action-item" @click="Keep()">
							<view class="showTotal-action-icon">
								<image lazy-load src="../../../static/icons/6.png" mode="aspectFit"
									class="showTotal-icon-img"></image>
							</view>
							<text class="showTotal-action-label">{{$t('记体重')}}</text>
						</view>
						<view class="showTotal-action-item" @click="Body_circumference()">
							<view class="showTotal-action-icon">
								<image lazy-load src="../../../static/icons/7.png" mode="aspectFit"
									class="showTotal-icon-img"></image>
							</view>
							<text class="showTotal-action-label">{{$t('记体围')}}</text>
						</view>
					</view>
					<view class="showTotal-close" @click="ddclosess()">
						<uni-icons size="24" type="closeempty" color="#3298F7"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="tihzi_popup_hd" :mask-click="false" @change="onTihziPopupHdChange">
				<view class="uni_popup_bg">
					<view class="popupsdind-header">
						<view class="popupsdind-header-side" @click="hd_closess()">
							<text class="popupsdind-close">✖</text>
						</view>
						<view class="popupsdind-header-center">
							<view class="popupsdind-date" @click="dataclick1()">
								<text class="popupsdind-date-text">{{birthday1}}</text>
								<uni-icons type="bottom" size="16"></uni-icons>
							</view>
						</view>
						<view class="popupsdind-header-side" style="justify-content: flex-end;" @click="sdsr()">
							<text class="popupsdind-link">{{$t('手动输入')}}</text>
						</view>
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
							<view style="width: 90vw;margin-top: 10px;" v-if="tihziRulerReady >= 1">
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
							<view style="width: 90vw;padding: 10px;" v-if="tihziRulerReady >= 2">
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
							<view style="width: 90vw;padding: 10px;" v-if="tihziRulerReady >= 3">
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
							<view style="width: 90vw;padding: 10px;" v-if="tihziRulerReady >= 4">
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
							<view style="width: 90vw;padding: 10px;" v-if="tihziRulerReady >= 5">
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
							<view style="width: 90vw;padding: 10px;" v-if="tihziRulerReady >= 6">
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
					<view class="popupsdind-header">
						<view class="popupsdind-header-side" @click="sd_closess()">
							<text class="popupsdind-close">✖</text>
						</view>
						<view class="popupsdind-header-center">
							<view class="popupsdind-date" @click="dataclick()">
								<text class="popupsdind-date-text">{{birthday111}}</text>
								<uni-icons type="bottom" size="16"></uni-icons>
							</view>
						</view>
						<view class="popupsdind-header-side" style="justify-content: flex-end;" @click="hdsr()">
							<text class="popupsdind-link">{{$t('滑动输入')}}</text>
						</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view style="padding-bottom: 10px;">
							<view style="padding: 10px;">
								<view class="popupsdind_1">
									<input type="number" v-model="xiongwei" :placeholder="$t('请输入胸围')"
										class="popupsdind-input" />
									<text class="popupsdind-unit">cm</text>
								</view>
								<view class="popupsdind_1" style="margin-top: 20px;">
									<input type="number" v-model="yaowei" :placeholder="$t('请输入腰围')"
										class="popupsdind-input" />
									<text class="popupsdind-unit">cm</text>
								</view>
								<view class="popupsdind_1" style="margin-top: 20px;">
									<input type="number" v-model="tunwei" :placeholder="$t('请输入臀围')"
										class="popupsdind-input" />
									<text class="popupsdind-unit">cm</text>
								</view>
								<view class="popupsdind_1" style="margin-top: 20px;">
									<input type="number" v-model="shangtunwei" :placeholder="$t('请输入上臂围')"
										class="popupsdind-input" />
									<text class="popupsdind-unit">cm</text>
								</view>
								<view class="popupsdind_1" style="margin-top: 20px;">
									<input type="number" v-model="datuiwei" :placeholder="$t('请输入大腿围')"
										class="popupsdind-input" />
									<text class="popupsdind-unit">cm</text>
								</view>
								<view class="popupsdind_1" style="margin-top: 20px;">
									<input type="number" v-model="xiaotuiwei" :placeholder="$t('请输入小腿围')"
										class="popupsdind-input" />
									<text class="popupsdind-unit">cm</text>
								</view>
							</view>
							<button @tap="popup_sd()" class="butonsd">{{$t('确认')}}</button>
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
	import WeightConverter from '../../api/unitls/weightConverter.js';
	const platformres = uni.getSystemInfoSync();
	// 获取本地日期时间
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	// 格式：yyyy/mm/dd
	const dateSlash = `${year}/${month}/${day}`;
	// 格式：yyyy/mm
	const monthSlash = `${year}/${month}`;
	// 格式：yyyy
	const yearSlash = `${year}`;
	// 格式：yyyy-mm-dd 23:59:59
	const dateTimeEnd = `${year}-${month}-${day} 23:59:59`;
	export default {
		computed: {
			...mapState(['info', 'bianhuadata', 'TenddeviceSn']),
		},
		onPullDownRefresh() {
			this.queryDevices()
		},
		data() {
			// 获取本地时间
			const now = new Date();
			const year = now.getFullYear();
			const month = (now.getMonth() + 1).toString().padStart(2, '0');
			const day = now.getDate().toString().padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const localDate =
				`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
			const dateSlash = `${year}/${month}/${day}`;
			const monthSlash = `${year}/${month}`;
			const yearSlash = `${year}`;
			const dateTimeEnd = `${year}-${month}-${day} 23:59:59`;
			return {
				types_index: uni.getStorageSync("types_index"),
				types_array: [this.$t("手表"), this.$t("血压计"), this.$t("体重")],
				endtimesss: localDate,
				datass: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
				showTotal_date: `${month}/${day}`,
				fillOut: false,
				tihziRulerReady: 0,
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
				date_0: dateSlash,
				date_1: monthSlash,
				date_2: yearSlash,
				date_00: dateTimeEnd,
				date_11: dateTimeEnd,
				date_22: dateTimeEnd,
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
						data: [0],
						connectNulls: true, // 不连接null值
						pointShape: 'circle',
						showSymbol: true // 显示数据点
					}, {
						legendShape: "#7AE545",
						name: this.$t("舒张压"),
						data: [0],
						connectNulls: true, // 不连接null值
						pointShape: 'circle',
						showSymbol: true // 显示数据点
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
				startTime: this.GetTime(7, localDate + ' 00:00:00'),
				endTime: localDate + ' 23:59:59',
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
				bloodUnitIndex: 0,
				weightUnitIndex: 0,
				bpMinMaxRaw: null,
				bpMonthAvgRaw: null,
				weightDayRaw: null,
				weightAvgRaw: null,
				trendRawCache: null,
				bpChartReshow: true,
				weightChartReshow: true,
			};
		},

		onLoad() {
			uni.$on('UNIT_SETTINGS_CHANGED', this.syncUnitSettings);
		},

		onUnload() {
			uni.$off('UNIT_SETTINGS_CHANGED', this.syncUnitSettings);
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
			this.syncUnitSettings()
			switch (this.types_index) {
				case 0:
					this.slaveSn = "3"
					this.tendentypes = true
					break
				case 1:
					this.slaveSn = "2"
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
				this.loact = location;
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

			normalizeUnitIndex(val) {
				if (val === '' || val == null) return 0;
				return Number(val) === 1 ? 1 : 0;
			},
			syncUnitSettings() {
				this.bloodUnitIndex = this.normalizeUnitIndex(uni.getStorageSync('Blood'));
				this.weightUnitIndex = this.normalizeUnitIndex(uni.getStorageSync('danwei2'));
				this.Blood = this.bloodUnitIndex === 0 ? 'mmHg' : 'kPa';
				this.newweightKG = this.weightUnitIndex === 1 ? this.$t('英镑') : this.$t('千克');
				this.xeuyaopts = Object.assign({}, this.xeuyaopts, {
					yAxis: Object.assign({}, this.xeuyaopts.yAxis, {
						data: [Object.assign({}, this.xeuyaopts.yAxis.data[0], {
							min: 0,
							max: this.Blood === 'kPa' ? 50 : 200
						})]
					})
				});
				this.tizhonngopts = Object.assign({}, this.tizhonngopts, {
					yAxis: Object.assign({}, this.tizhonngopts.yAxis, {
						data: [Object.assign({}, this.tizhonngopts.yAxis.data[0], {
							min: 0,
							max: this.isKgWeightUnit() ? 200 : 400
						})]
					})
				});
				this.applyUnitDisplay();
			},
			formatBpValue(val) {
				if (val == null || val === '') return '-';
				if (this.Blood === 'mmHg') return val;
				return (Number(val) * 0.133).toFixed(1);
			},
			formatBpChartValue(val) {
				if (val == null || val === '') return null;
				const display = this.formatBpValue(val);
				if (display === '-' || display == null || display === '') return null;
				const num = Number(display);
				return Number.isFinite(num) ? num : null;
			},
			formatWeightChartValue(kg) {
				if (kg == null || kg === '') return null;
				const display = this.formatWeightValue(kg);
				if (display == null || display === '' || display === '--') return null;
				const num = Number(display);
				return Number.isFinite(num) ? num : null;
			},
			isKgWeightUnit() {
				return this.weightUnitIndex === 0;
			},
			formatWeightValue(kg) {
				if (kg == null || kg === '' || kg === '--') return kg;
				const value = Number(kg);
				if (!Number.isFinite(value)) return kg;
				if (this.isKgWeightUnit()) {
					return Number(value.toFixed(1));
				}
				return WeightConverter.kgToLb(value, 1);
			},
			applyUnitDisplay() {
				if (this.bpMinMaxRaw) this.applyBpMinMaxDisplay(this.bpMinMaxRaw);
				if (this.bpMonthAvgRaw) this.applyBpMonthAvgDisplay(this.bpMonthAvgRaw);
				if (this.weightDayRaw) this.applyWeightDayDisplay(this.weightDayRaw);
				if (this.weightAvgRaw) this.applyWeightAvgDisplay(this.weightAvgRaw);
				if (this.trendRawCache) this.renderTrendCharts(this.trendRawCache);
			},
			applyBpMinMaxDisplay(data) {
				if (!data) return;
				this.lately_Blood_pressure = this.bgaaa(data.last.lowPressure, data.last.highPressure);
				this.lately_Systolic_blood_pressure = data.last.highPressure === null ? '-' :
					this.formatBpValue(data.last.highPressure);
				this.lately_Diastolic_blood_pressure = data.last.lowPressure === null ? '-' :
					this.formatBpValue(data.last.lowPressure);
				this.lately_pulse = data.last.heartrate === null ? '-' : data.last.heartrate;
				this.average_Blood_pressure = this.bgaaa(data.avg.lowPressure, data.avg.highPressure);
				this.average_Systolic_blood_pressure = this.formatBpValue(data.avg.highPressure);
				this.average_Diastolic_blood_pressure = this.formatBpValue(data.avg.lowPressure);
				this.average_pulse = data.avg.heartrate;
				this.Maximum_Blood_pressure = this.bgaaa(data.max.lowPressure, data.max.highPressure);
				this.Maximum_Systolic_blood_pressure = this.formatBpValue(data.max.highPressure);
				this.Maximum_Diastolic_blood_pressure = this.formatBpValue(data.max.lowPressure);
				this.Maximum_pulse = data.max.heartrate === null ? '-' : data.max.heartrate;
				this.Minimum_Blood_pressure = this.bgaaa(data.min.lowPressure, data.min.highPressure);
				this.Minimum_Systolic_blood_pressure = data.min.highPressure == null ? '-' :
					this.formatBpValue(data.min.highPressure);
				this.Minimum_Diastolic_blood_pressure = data.min.lowPressure == null ? '-' :
					this.formatBpValue(data.min.lowPressure);
				this.Minimum_pulse = data.min.heartrate == null ? '-' : data.min.heartrate;
			},
			applyBpMonthAvgDisplay(data) {
				if (!data || !data.avg) return;
				this.Systolic_blood_pressure = this.formatBpValue(data.avg.highPressure);
				this.Diastolic_blood_pressure = this.formatBpValue(data.avg.lowPressure);
			},
			applyWeightDayDisplay(data) {
				if (!data) return;
				this.level_weight = data.level;
				this.max_weight = this.formatWeightValue(data.max);
				this.min_weight = this.formatWeightValue(data.min);
				this.avg_weight = this.formatWeightValue(data.avg);
			},
			applyWeightAvgDisplay(data) {
				if (!data) return;
				this.Mean_value = this.formatWeightValue(data.avgWeight);
				this.bmi = data.bmi;
				this.weight_value = data.change;
			},
			mapToPlain(mapObj) {
				const plain = {};
				if (!mapObj || !mapObj.forEach) return plain;
				mapObj.forEach((value, key) => {
					plain[key] = value;
				});
				return plain;
			},
			plainToBpMap(plain) {
				const map = new Map();
				Object.keys(plain || {}).forEach((key) => {
					map.set(key, plain[key]);
				});
				return map;
			},
			plainToWeightMap(plain) {
				const map = new Map();
				Object.keys(plain || {}).forEach((key) => {
					map.set(key, plain[key]);
				});
				return map;
			},
			buildTrendCategories(dateList) {
				const categories = [];
				if (!dateList || !dateList.length) return categories;
				if (this.WEEK) {
					const startLabel = `${dateList[0].month}/${dateList[0].day}`;
					const endLabel = `${dateList[dateList.length - 1].month}/${dateList[dateList.length - 1].day}`;
					dateList.forEach((item, index) => {
						if (index === 0) categories.push(startLabel);
						else if (index === dateList.length - 1) categories.push(endLabel);
						else categories.push('');
					});
					return categories;
				}
				if (this.MON) {
					const startLabel = `${dateList[0].month}/${dateList[0].day}`;
					const today = new Date();
					const queryEndYear = dateList[dateList.length - 1].year;
					const queryEndMonth = dateList[dateList.length - 1].month;
					const queryEndDay = dateList[dateList.length - 1].day;
					let endLabel;
					if (queryEndYear === today.getFullYear() && queryEndMonth === (today.getMonth() + 1)) {
						endLabel = `${today.getMonth() + 1}/${today.getDate()}`;
					} else {
						endLabel = `${queryEndMonth}/${queryEndDay}`;
					}
					dateList.forEach((item, index) => {
						if (index === 0) categories.push(startLabel);
						else if (index === dateList.length - 1) categories.push(endLabel);
						else categories.push('');
					});
					return categories;
				}
				const startYear = dateList[0].year;
				const startMonth = dateList[0].month.toString().padStart(2, '0');
				const today = new Date();
				const queryEndYear = dateList[dateList.length - 1].year;
				const queryEndMonth = dateList[dateList.length - 1].month.toString().padStart(2, '0');
				let endLabel;
				if (queryEndYear === today.getFullYear() && queryEndYear === startYear) {
					endLabel = `${(today.getMonth() + 1).toString().padStart(2, '0')}`;
				} else {
					endLabel = `${queryEndMonth}`;
				}
				const startLabel = `${startYear}/${startMonth}`;
				dateList.forEach((item, index) => {
					if (index === 0) categories.push(startLabel);
					else if (index === dateList.length - 1) categories.push(endLabel);
					else categories.push('');
				});
				return categories;
			},
			updateTrendChartYAxis(highData, lowData, weightData) {
				const bpMin = 0;
				const bpMax = this.Blood === 'kPa' ? 50 : 200;
				this.xeuyaopts = Object.assign({}, this.xeuyaopts, {
					yAxis: Object.assign({}, this.xeuyaopts.yAxis, {
						data: [Object.assign({}, this.xeuyaopts.yAxis.data[0], {
							min: bpMin,
							max: bpMax
						})]
					})
				});
				const weightMin = 0;
				const weightMax = this.isKgWeightUnit() ? 200 : 400;
				this.tizhonngopts = Object.assign({}, this.tizhonngopts, {
					yAxis: Object.assign({}, this.tizhonngopts.yAxis, {
						data: [Object.assign({}, this.tizhonngopts.yAxis.data[0], {
							min: weightMin,
							max: weightMax
						})]
					})
				});
			},
			nudgeTrendCharts() {
				this.bpChartReshow = false;
				this.weightChartReshow = false;
				this.$nextTick(() => {
					this.bpChartReshow = true;
					this.weightChartReshow = true;
				});
			},
			renderTrendCharts(cache) {
				if (!cache || !cache.dateList) return;
				const dataMap = this.plainToBpMap(cache.dataMap);
				const weightMap = this.plainToWeightMap(cache.weightMap);
				const dateList = cache.dateList;
				const categories = this.buildTrendCategories(dateList);
				const highData = [];
				const lowData = [];
				const weightData = [];
				dateList.forEach((item) => {
					const dayData = dataMap.get(item.dateStr);
					highData.push(dayData && dayData.high !== null ? this.formatBpChartValue(dayData.high) : null);
					lowData.push(dayData && dayData.low !== null ? this.formatBpChartValue(dayData.low) : null);
					const weightKg = weightMap.get(item.dateStr);
					weightData.push(weightKg != null ? this.formatWeightChartValue(weightKg) : null);
				});
				this.chartData = {
					categories: categories.slice(),
					series: [{
						legendShape: '#FC7F41',
						name: this.$t('收缩压'),
						data: highData.slice(),
						connectNulls: true,
						pointShape: 'circle',
						showSymbol: true
					}, {
						legendShape: '#7AE545',
						name: this.$t('舒张压'),
						data: lowData.slice(),
						connectNulls: true,
						pointShape: 'circle',
						showSymbol: true
					}]
				};
				this.chartData2 = {
					categories: categories.slice(),
					series: [{
						legendShape: '#3298F7',
						name: this.$t('体重'),
						data: weightData.slice()
					}]
				};
				this.updateTrendChartYAxis(highData, lowData, weightData);
				this.nudgeTrendCharts();
			},
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
				this.$get(this.$url_APP_IP + this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code !== 200) return;
					if (!res.data.email && !res.data.phonenumber) {
						uni.reLaunch({
							url: "/pages/login/true_register_email"
						});
						return;
					}
					this.getInfo(res.data);
					this.queryDevices();
				});
			},

			types_change(e) {
				this.types_index = e.detail.value
				switch (this.types_index) {
					case 0:
						this.slaveSn = "3"
						this.tendentypes = true
						break
					case 1:
						this.slaveSn = "2"
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
				this.$nextTick(() => {
					this.$refs.tihzi_popup_hd.open("center")
				})
			},

			onTihziPopupHdChange(e) {
				if (this._tihziRulerTimer) {
					clearTimeout(this._tihziRulerTimer)
					this._tihziRulerTimer = null
				}
				if (e.show) {
					this.tihziRulerReady = 0
					const mountNext = () => {
						if (this.tihziRulerReady < 6) {
							this.tihziRulerReady++
							this._tihziRulerTimer = setTimeout(mountNext, 32)
						}
					}
					this._tihziRulerTimer = setTimeout(mountNext, 40)
				} else {
					this.tihziRulerReady = 0
				}
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
			// 六围手动输入
			sdsr() {
				this.$refs.tihzi_popup_hd.close()
				this.$refs.tihzi_popup_sd.open("center")
			},
			//六围滑动输入
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
				let that = this;
				const now = new Date();
				let timestamp = Math.floor(new Date(that.birthday2 == that.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` :
					that.birthday2).getTime() / 1000);
				let data = {
					deviceSn: uni.getStorageSync("deviceSn"),
					slaveSn: "0",
					slaveData: {
						weight: that.tizhong
					},
					time: timestamp
				}
				console.log("手动上报体重数据", data)
				that.$post(that.$url_APP_IP + that.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((res) => {
					console.log("手动上报体重数据", res)
					if (res.code === 200) {
						that.tizhong = ''
						that.birthday2 = that.$t('今天')
						uni.showToast({
							title: that.$t("成功"),
							icon: 'none'
						})
						that.$refs.tizhong_popup.close()
						let str = localDate + ' 00:00:00'
						let end = localDate + " 23:59:59"
						that.query_weight_day(str, end)
					} else {
						uni.showToast({
							title: that.$t("失败"),
							icon: 'none'
						})
					}
				})
			},
			//用户在app手动上报六围数据
			fat_scale() {
				let that = this;
				const now = new Date();
				let timestamp = Math.floor(new Date(that.birthday111 == that.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` :
					that.birthday111).getTime() / 1000);
				uni.request({
					url: that.$url_APP_IP + that.$url_fat_scale,
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
				let that = this;
				const now = new Date();
				let timestamp = Math.floor(new Date(that.birthday1 == that.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` :
					that.birthday1).getTime() / 1000);
				uni.request({
					url: that.$url_APP_IP + that.$url_fat_scale,
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
				this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						uni.stopPullDownRefresh(); // 停止下拉刷新动画
						if (!res.rows || res.rows.length === 0) {
							uni.getStorageInfo({
								success(types_index) {
									const typesIndex = types_index.keys.includes("types_index") ? uni
										.getStorageSync("types_index") : 0;
									this.tendentypes = typesIndex === 0 || typesIndex === 1;
									if (!types_index.keys.includes("types_index")) {
										uni.setStorageSync("types_index", 0);
									}
								}
							});
							switch (this.types_index) {
								case 0:
									this.get_trend_data(this.startTime, this.endTime)
									this.query_month_avg(this.startTime, this.endTime)
									this.query_minmax(this.startTime, this.endTime)
									break
								case 1:
									this.get_trend_data(this.startTime, this.endTime)
									this.query_month_avg(this.startTime, this.endTime)
									this.query_minmax(this.startTime, this.endTime)
									break
								case 2:
									this.get_trend_data(this.startTime, this.endTime)
									this.query_weight_avg(this.startTime, this.endTime)
									let str = localDate + ' 00:00:00'
									let end = localDate + " 23:59:59"
									this.query_weight_day(str, end)
									break
							}
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
										if (callback.data.weightStatus === 1 && callback.data.weight !== "0.00" &&
											callback.data.testStatus === 255) {
											this.jakoblife_fat_scale1(rows[i].deviceSn, rows[i].mac, callback
												.data, "")
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
						weight: parsedData.weightUnit === 2 ? WeightConverter.parseStoneString(parsedData.weight)
							.toFixed(2) : (parsedData.weightUnit === 6 || parsedData.weightUnit === 4 ? WeightConverter
								.lbToKg(parsedData.weight) : parsedData.weight),
						adc: parsedData.adc
					},
					time: parsedData.createTime
				}
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
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
				this.$post(this.$url_APP_IP + this.$url_get_device_info, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
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
									let str = localDate + ' 00:00:00'
									let end = localDate + " 23:59:59"
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
				let data = {
					deviceSn: uni.getStorageSync("userid"),
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
				// console.log("【get_trend_data】", data)
				this.$post(this.$url_APP_IP + this.$url_get_trend_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					// console.log("【get_trend_datares】", res)
					if (res.code == 200) {
						// 清空数据
						this.chartData.categories = []
						this.chartData.series[0].data = [] // 高压
						this.chartData.series[1].data = [] // 低压
						this.chartData2.categories = []
						this.chartData2.series[0].data = [] // 体重
						// ========== 辅助函数 ==========
						const timestampToDateStr = (timestamp) => {
							let date = new Date(parseInt(timestamp))
							let year = date.getFullYear()
							let month = (date.getMonth() + 1).toString().padStart(2, '0')
							let day = date.getDate().toString().padStart(2, '0')
							return `${year}-${month}-${day}`
						}
						// ========== 处理血压数据 ==========
						let dataMap = new Map()
						if (res.data.highPressure) {
							res.data.highPressure.forEach(item => {
								let dateStr = timestampToDateStr(item[1])
								if (!dataMap.has(dateStr)) {
									dataMap.set(dateStr, {
										high: null,
										low: null
									})
								}
								dataMap.get(dateStr).high = item[0] ? parseFloat(item[0]) : null
							})
						}

						if (res.data.lowPressure) {
							res.data.lowPressure.forEach(item => {
								let dateStr = timestampToDateStr(item[1])
								if (!dataMap.has(dateStr)) {
									dataMap.set(dateStr, {
										high: null,
										low: null
									})
								}
								dataMap.get(dateStr).low = item[0] ? parseFloat(item[0]) : null
							})
						}

						// 2. 解析查询的起止日期
						let startDate = new Date(startTime)
						let endDate = new Date(endTime)

						// 计算时间跨度（天数）
						let timeSpan = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
						// 3. 生成日期数组
						let dateList = []
						let currentDate = new Date(startDate)

						while (currentDate <= endDate) {
							let year = currentDate.getFullYear()
							let month = currentDate.getMonth() + 1
							let day = currentDate.getDate()
							let dateStr =
								`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

							dateList.push({
								dateStr: dateStr,
								year: year,
								month: month,
								day: day,
								fullDate: new Date(currentDate)
							})

							currentDate.setDate(currentDate.getDate() + 1)
						}

						let weightMap = new Map()
						if (res.data.weight && res.data.weight.length > 0) {
							res.data.weight.forEach(item => {
								let dateStr = timestampToDateStr(item[1])
								weightMap.set(dateStr, item[0] ? parseFloat(item[0]) : null)
							})
						}

						// 4. 缓存原始数据并按当前单位渲染
						this.trendRawCache = {
							dataMap: this.mapToPlain(dataMap),
							weightMap: this.mapToPlain(weightMap),
							dateList: dateList.slice()
						};
						this.renderTrendCharts(this.trendRawCache);
					} else if (res.code == 500) {
						this.trendRawCache = null
						this.setDefaultData()
						return
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.trendRawCache = null
						this.setDefaultData()
						return
					}
				})
			},

			setDefaultData() {
				this.trendRawCache = null
				this.chartData = {
					categories: ['0'],
					series: [{
						legendShape: '#FC7F41',
						name: this.$t('收缩压'),
						data: [null],
						connectNulls: true,
						pointShape: 'circle',
						showSymbol: true
					}, {
						legendShape: '#7AE545',
						name: this.$t('舒张压'),
						data: [null],
						connectNulls: true,
						pointShape: 'circle',
						showSymbol: true
					}]
				}
				this.chartData2 = {
					categories: ['0'],
					series: [{
						legendShape: '#3298F7',
						name: this.$t('体重'),
						data: [null]
					}]
				}
				this.nudgeTrendCharts()
			},



			//血压计统计每日平均值计算总最大最小值
			query_month_avg(startTime, endTime) {
				let data = {
					deviceSn: uni.getStorageSync("userid"),
					slaveList: [{
						slaveSn: this.slaveSn,
						register: "highPressure"
					}, ],
					startTime: startTime,
					endTime: endTime,
				}
				// console.log("【血压计统计每日平均值计算总最大最小值data】", data)
				this.$post(this.$url_APP_IP + this.$url_query_month_avg, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					// console.log("【血压计统计每日平均值计算总最大最小值res】", res)
					if (res.code == 200) {
						this.bpMonthAvgRaw = res.data
						this.applyBpMonthAvgDisplay(res.data)
					} else if (res.code == 500) {
						this.bpMonthAvgRaw = null
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
				let data = {
					deviceSn: uni.getStorageSync("userid"),
					dataType: "min",
					slaveList: [{
						slaveSn: this.slaveSn,
						register: "highPressure"
					}, ],
					startTime: startTime,
					endTime: endTime,
				}
				this.$post(this.$url_APP_IP + this.$url_query_minmax, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						this.bpMinMaxRaw = res.data
						this.applyBpMinMaxDisplay(res.data)
					} else if (res.code == 500) {
						this.bpMinMaxRaw = null
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
				let data = {
					deviceSn: uni.getStorageSync("userid"),
					startTime: startTime,
					endTime: endTime,
				}
				this.$post(this.$url_APP_IP + this.$url_query_weight_avg, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						this.weightAvgRaw = res.data
						this.applyWeightAvgDisplay(res.data)
					} else if (res.code == 500) {
						this.weightAvgRaw = null
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
				let data = {
					deviceSn: uni.getStorageSync("userid"),
					startTime: startTime,
					endTime: endTime,
				}
				this.$post(this.$url_APP_IP + this.$url_query_weight_day, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						this.weightDayRaw = res.data
						this.applyWeightDayDisplay(res.data)
					} else if (res.code == 500) {
						this.weightDayRaw = null
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
				this.fillOut = true
			},
			BMI_tap() {
				this.$refs.popup.open("center")
			},
			BMI_tap2() {
				this.$refs.popup1.open("center")
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
		width: 85vw;
		box-sizing: border-box;
	}

	.popupsdind-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 15px;
		width: 100%;
		box-sizing: border-box;
	}

	.popupsdind-header-side {
		min-width: 72px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-shrink: 0;
	}

	.popupsdind-header-side:last-child {
		justify-content: flex-end;
	}

	.popupsdind-header-center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
	}

	.popupsdind-close {
		font-size: 22px;
		line-height: 22px;
		color: #333;
	}

	.popupsdind-link {
		color: #3298F7;
		font-size: 14px;
		white-space: nowrap;
	}

	.popupsdind-date {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.popupsdind-date-text {
		font-size: 16px;
		color: #000;
		line-height: 22px;
		margin-right: 4px;
	}

	.popupsdind-body {
		padding: 20px;
		width: 100%;
		box-sizing: border-box;
	}

	.popupsdind_1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #F7F7F7;
		padding: 15px 20px;
		border-radius: 10px;
		width: 100%;
		box-sizing: border-box;
	}

	.popupsdind-input {
		flex: 1;
		min-width: 0;
		width: 0;
		text-align: center;
	}

	.popupsdind-unit {
		flex-shrink: 0;
		margin-left: 12px;
		min-width: 36px;
		text-align: right;
		white-space: nowrap;
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
		.over {
			width: 100%;
			height: 100%;
			background: linear-gradient(180deg, #dceefc 0%, #eef6fc 45%, #f4f7fb 100%);
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
		}

		.show {
			width: 100vw;
			height: 100vh;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			padding: 120px 32px 0;
			margin: auto;
			z-index: 10000;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: flex-start;
			box-sizing: border-box;
		}

		.showTotal-header {
			text-align: left;
			width: 100%;
		}

		.showTotal-date {
			color: #1a1a1a;
			font-size: 52px;
			font-weight: 700;
			letter-spacing: 1px;
			line-height: 1.2;
		}

		.showTotal-tip-row {
			display: flex;
			flex-direction: row;
			align-items: stretch;
			margin-top: 20px;
			width: 100%;
		}

		.showTotal-divider {
			width: 3px;
			flex-shrink: 0;
			margin-right: 14px;
			border-radius: 2px;
			background: linear-gradient(180deg, #2595D3, #3298F7);
		}

		.showTotal-tip {
			flex: 1;
			color: #2595D3;
			font-size: 15px;
			line-height: 1.6;
		}

		.showTotal-actions {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			margin-top: 32px;
			width: 100%;
		}

		.showTotal-action-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 24px 28px;
			border-radius: 20px;
			background: #f8fbff;
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		}

		.showTotal-action-item+.showTotal-action-item {
			margin-left: 32px;
		}

		.showTotal-action-item:active {
			opacity: 0.85;
			transform: scale(0.97);
		}

		.showTotal-action-icon {
			width: 68px;
			height: 68px;
			border-radius: 50%;
			background: linear-gradient(145deg, #eef6fc 0%, #ffffff 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4px 12px rgba(37, 149, 211, 0.12);
		}

		.showTotal-icon-img {
			width: 46px;
			height: 46px;
			border-radius: 50%;
			object-fit: contain;
		}

		.showTotal-action-label {
			margin-top: 12px;
			font-weight: 600;
			font-size: 14px;
			text-align: center;
			color: #333333;
			width: 80px;
		}

		.showTotal-close {
			display: flex;
			justify-content: center;
			align-items: center;
			align-self: center;
			margin-top: auto;
			margin-bottom: 80px;
			width: 52px;
			height: 52px;
			border-radius: 50%;
			background: #ffffff;
			box-shadow: 0 2px 10px rgba(50, 152, 247, 0.18);
		}

		.showTotal-close:active {
			background: #e8f0fe;
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