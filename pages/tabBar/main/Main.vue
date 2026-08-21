<template>
	<view class="all">
		<swiper class="scroll-view-height" :style="{height: screenHeight + 'px'}" @change="swipeIndex"
			:current="currentIndex" acceleration="true" skip-hidden-item-layout="true"
			disable-programmatic-animation="true" :disable-touch="disabletouch">
			<!-- 血压计 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<BloodPressureSwiperItem :Languageceliang="Languageceliang" :xueya="xueya"
							:title_name="title_name" :Blood="Blood" :highPressure="highPressure"
							:lowPressure="lowPressure" :pulse="pulse" :list="list" @update:list="list = $event"
							:binaji="binaji" :disabledsaaa="disabledsaaa" :animation="animation"
							:delate_icon="delate_icon" :button_show="button_show" @measure-link="xueyaclicklink"
							@xueya-tap="xueya_tap" @xueya-click="xueyaclick" @edit-cards="tiaozhen"
							@update:disabled="handleUpdateDisabled1" @card-click="listclisck" @bmi-tap="BMI_tap"
							@delete-card="delate_icon_cl" @confirm-cards="ture_bt" @add-card="add_bt_xy" />
					</view>
				</scroll-view>
			</swiper-item>
			<!-- ECG start-->
			<!-- <swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: white;">
						<view class="title_zs_ECG">{{$t("本页面显示均为最近测量数据")}}</view>
						<EcgSwiperItem ref="ecgSwiperItem" :statsVisible="statsVisible"
							:baseFeaturesExtracted="baseFeaturesExtracted"
							:derivedFeaturesExtracted="derivedFeaturesExtracted" :qualityScore="qualityScore"
							:modelScore="modelScore" :ecgdatarows="ecgdatarows" @start-measure="startbtn"
							@ecg-detail="ecgbtn" />
					</view>
				</scroll-view>
			</swiper-item> -->
			<!-- ECG end-->
			<!-- 情绪（首页固定显示情绪页；绑 BPW6 时可点立即测量做 PPG） -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: white;">
						<view class="title_zs_ppg">{{$t("本页面显示均为最近测量数据")}}</view>
						<EmotionSwiperItem :sleep_alertdisabled="sleep_alertdisabled" :ppgnewpoint="ppgnewpoint"
							:mood_Description="mood_Description" :mood_level="mood_level"
							:depression_risk_score="depression_risk_score"
							:depression_risk_level="depression_risk_level" :finalResult="finalResult"
							:baoggaodisabled="baoggaodisabled" :stress_Index="stress_Index"
							:fatigue_index="fatigue_index" :recovery_index="recovery_index" :sleep_point="sleep_point"
							:fenxi="fenxi" :types_index="types_index" :types_array="types_array" :optsPPG="optsPPG"
							:chartDataPPG="chartDataPPG" :optsPPG2="optsPPG2" :chartDataPPG2="chartDataPPG2"
							:Indicatorlist="Indicatorlist" @setting="setting" @sleep-alert="sleep_alert"
							@xiangxibaogo="xiangxibaogo" @pingfentiaozhuan="pingfentiaozhuan"
							@health-explanation="health_Explanation" @types-change="types_change" />
					</view>
				</scroll-view>
			</swiper-item>
			<!--体重 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<BodyFatSwiperItem :Latest_weight="Latest_weight" :newweightKG="newweightKG"
							:Latest_date="Latest_date" :Initial_weight="Initial_weight" :chuhsikg="chuhsikg"
							:Target_weight="Target_weight" :list2="list2" @update:list2="list2 = $event"
							:binaji2="binaji2" :disabledsaaa2="disabledsaaa2" :animation2="animation2"
							:delate_icon2="delate_icon2" :button_show2="button_show2"
							:Chest_circumference="Chest_circumference" :waistline="waistline"
							:Hip_circumference="Hip_circumference"
							:Upper_Chest_circumference="Upper_Chest_circumference"
							:Thigh_circumference="Thigh_circumference" :Calf_circumference="Calf_circumference"
							@new-latest="new_latest" @initial="Initial" @target="Target" @tiaozhen2="tiaozhen2"
							@update:disabled="handleUpdateDisabled" @bmi-tap="BMI_tap" @delete-card="delate_icon_cl_2"
							@confirm-cards="ture_bt2" @add-card="add_bt2" @body-measure-click="tizhiclick" />
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 睡眠 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class=" title_zs_1" style="padding-top: 80px;">{{$t("本页面显示均为最近测量数据")}}</view>
						<SleepSwiperItem :sleep="sleep" :sleep_time="sleep_time" :totalLight="totalLight"
							:totalDeep="totalDeep" :totalRem="totalRem" :sleep_point="sleep_point"
							:medication="medication" :sleepTip="sleepTip" @medication-change="switch1Change" />
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 运动 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<StepsSwiperItem :bushu="bushu" :bushu_time="bushu_time" :today_Daily_Goal="today_Daily_Goal"
							:dailyGoal="Daily_Goal" @update:dailyGoal="Daily_Goal = $event" :chartData="chartData"
							:opts="opts" :xueya="xueya" @daily-goal-set="Daily_Goal_set" />
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="title_all">
			<view class="title_all_1">
				<image :src="msg ? '../../../static/icons/19.png' : '../../../static/icons/20.png'" mode="aspectFit"
					style="width: 25px; height: 25px; padding-left: 20px;object-fit: contain;"
					@click="Historical_record()">
				</image>
				<view class="title">{{$t('首页')}}</view>
				<view class="bangsust" @click="helperclick()">{{$t("帮助")}}</view>
			</view>
			<scroll-view scroll-x class="navscroll">
				<view class="nav-container">
					<view class="item" v-for="(item, index) in tabs" :key="index">
						<view @click="swtichSwiper(index)" class="tab-text" :class="{ active: currentIndex === index }">
							{{ item }}
						</view>
						<view class="underline" v-if="currentIndex === index"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 悬浮按钮 -->
		<float-button ref="floatButton" :visible="buttonVisible" :pattern="buttonPattern"
			@subButtonClick="onSubButtonClick" @menuOpen="onMenuOpen" />
		<view class="showTotal" v-show="fillOut">
			<view class="over">
				<view class="show">
					<view style="display: flex;justify-content: right;margin-top: 60px;margin-right: 40px;"
						@click="closess()">
						<uni-icons size="30" type="closeempty"></uni-icons>
					</view>
					<view style="margin-top: 220px;margin-left: 20px;">
						<view style="color: black;font-size: 38px; font-weight: bold;">{{showTotal_date}}</view>
						<view style="background: black; width: 50%; height: 1px;margin-top: 20px;"></view>
						<view style="color: #2595D3;margin-top: 5px;">{{$t('确保每天摄入足够的水')}}</view>
					</view>
					<view style="display: flex; flex-direction: row;  margin-top: 40px;margin-left: 10px;">
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
				</view>
			</view>
		</view>
		<!-- 血压分类弹窗 -->
		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view class="xueyastyle">
					<view style="font-size: 17px; font-weight: 600;">{{$t("血压分类")}}</view>
					<view style="font-size: 14px; font-weight: 400;margin-top: 10px;color: #999999;">
						{{$t("根据WHOISH的血压分类2020年修订版")}}
					</view>
					<view class="xueyastyle_aa">
						<view style="flex: 1;text-align: center;">{{$t("血压类别")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("收缩压")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("和或")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("舒张压")}}</view>
					</view>
					<view class="xueyastyle_bb">
						<view style="flex: 1;text-align: center;">{{$t("正常血压")}}</view>
						<view style="flex: 1;text-align: center;">91-120</view>
						<view style="flex: 1;text-align: center;">{{$t("和")}}</view>
						<view style="flex: 1;text-align: center;">61-80</view>
					</view>
					<view class="xueyastyle_cc"
						style="background:#FFEC01; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("正常高血压值")}}</view>
						<view style="flex: 1;text-align: center;">121-140</view>
						<view style="flex: 1;text-align: center;">{{$t("或")}}</view>
						<view style="flex: 1;text-align: center;">81-90</view>
					</view>
					<view class="xueyastyle_dd"
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
		<!-- BMI分类弹窗 -->
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view
					style="background: #FFFFFF; border-radius: 24px; width: 90vw; padding-bottom: 20px;  margin: 0 10vw 0 10vw;">
					<view style="padding: 20px; ">
						<view style="font-weight: 600;text-align: center; font-size: 16px;">{{$t('BMI分类')}}</view>
						<view style="color: #999999;font-size: 10px;margin-top: 20px;text-align: center;">
							{{$t('根据世界卫生组织的最新BMI分类')}}
						</view>
						<view
							style="display: flex; flex-direction: row; padding: 5px; align-items: center;margin-top: 20px; margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t('BMI范围')}}</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t('分类')}}</view>
						</view>
						<view
							style="padding: 5px;background: #FCCD41; width: 88%;margin-top: 10px; display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">&lt;18.5</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('体重过轻')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #58BF78; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">18.5-24.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('正常体重')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #FC7F41; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('超重')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #F55A5A; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('一级肥胖')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #7A0101; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('二级肥胖')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #333333; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 40vw;font-size: 8px;color: white;">
								{{$t('三级肥胖或病态肥胖')}}
							</view>
						</view>
					</view>
					<button @tap="knowe1()"
						style="width: 120px; height: 48px; border-radius: 100px;background: #3298F7;color: white;display: flex;justify-content: center;align-items: center;">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 血氧分类弹窗 -->
		<view>
			<uni-popup ref="popup2" :mask-click="false">
				<view
					style="background: #FFFFFF; border-radius: 24px; width: 90vw; padding-bottom: 20px;  margin: 0 10vw 0 10vw;">
					<view style="padding: 20px; ">
						<view style="font-weight: bold;padding-top: 20px;font-size: 16px; text-align: center;">
							{{$t('血氧分类')}}
						</view>
						<view
							style="color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							<view style="width: 90px;display: flex;justify-content: flex-end;">95%</view>
							<view style="width: 60px;"></view>
							<view style="width: 90px;display: flex;justify-content: flex-start;">98%</view>
						</view>
						<view
							style="color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							<view style="background: #FCCD41; width: 80px;height: 10px;"></view>
							<view style="background: #7AE545;width: 80px;height: 10px;"></view>
							<view style="background: #58BF78;width: 80px;height: 10px;"></view>
						</view>
						<view
							style="color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							<view style="width: 80px;height: 10px;">{{$t('偏低')}}</view>
							<view style="width: 80px;height: 10px;">{{$t('正常')}}</view>
							<view style="width: 80px;height: 10px;">{{$t('偏高')}}</view>
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧2')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧3')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧1')}}
						</view>
					</view>
					<button @tap="knowe2()"
						style="width: 120px; height:48px; display: flex;justify-content: center;align-items: center; border-radius: 100px;background: #3298F7;color: white;">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 体围录入弹窗（滑动） -->
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
		<!-- 手动输入血压弹窗 -->
		<view>
			<uni-popup ref="qs_popup" :mask-click="true">
				<view style="border-radius: 20px;background:#fff; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: center; padding: 10px;">
						<picker fields="day" mode="date" :value="birthday1111" @change="bindDateChange"
							:end='endtimesss'>
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 16px;color: black;">{{birthday1111}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="padding: 10px;width: 80vw;">
						<view
							style="margin:0 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shousuoya" :placeholder="$t('请输入收缩压')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">mmHg</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shuzhangya" :placeholder="$t('请输入舒张压')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">mmHg</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="maibo" :placeholder="$t('请输入脉搏')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">BPM</text>
						</view>
					</view>
					<button class="buttonstylesds" @tap="truesss()">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 体围录入弹窗（手动输入） -->
		<view>
			<uni-popup ref="tihzi_popup_sd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between; padding: 10px;">
						<text @click="sd_closess()">✖</text>
						<view style="display: flex; flex-direction: row; margin-left: 50px;">
							<text @click="dataclick()">{{birthday}}</text>
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
		<!-- 体重录入弹窗 -->
		<view>
			<uni-popup ref="tizhong_popup" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff; margin-top: 60px; padding-bottom: 10px;align-items: center;">
					<view style="display: flex; justify-content: space-between; padding: 15px;">
						<text @click="tz_closess()" style="font-size: 22px;">✖</text>
						<view style="display: flex; flex-direction: row; ">
							<view style="display: flex;justify-content: center;">
								<picker fields="day" mode="date" :value="birthday2" @change="bindDateChange2"
									:end='endtimesss'>
									<view style="display: flex;flex-direction: row;">
										<view style="font-size: 16px;color: black;">{{birthday2}}</view>
										<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
									</view>
								</picker>
							</view>
						</view>
						<view style="color: #3298F7;"></view>
					</view>
					<view style="padding: 20px;width: 75vw;">
						<view
							style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="tizhong" :placeholder="$t('请输入体重')"
								style="text-align: center;width: 80vw;" />
							<text>{{$t("千克")}}</text>
						</view>
					</view>
					<button @tap="jitizhong_tc()"
						style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 目标体重弹窗 -->
		<view>
			<uni-popup ref="mubiao_popup" :mask-click="false">
				<view style="border-radius: 20px;background:#fff; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: space-between; padding: 20px;">
						<text @click="mb_closess()" style="font-size: 22px;">✖</text>
					</view>
					<view style="padding: 20px;width: 75vw;">
						<view
							style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="mubiao" :placeholder="$t('请输入目标体重')"
								style="text-align: center;width: 80vw;" />
							<text>{{$t("千克")}}</text>
						</view>
					</view>
					<button @tap="mubiao_weight()"
						style="margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 时间选择器 -->
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
		<!-- 权限说明弹窗 -->
		<view>
			<uni-popup ref="lnaypopup" :mask-click="true" @change="onPermissionTipChange">
				<text class="popup-content">{{$t("权限说明")}}</text>
			</uni-popup>
		</view>
		<!-- 综合健康指数说明弹窗 -->
		<view>
			<uni-popup ref="health_Explanationpopu" :mask-click="false">
				<view class="xueyastyle">
					<view style="font-size: 17px; font-weight: 600;display: flex;justify-content: center;">
						{{$t("综合健康指数说明")}}
					</view>
					<!-- 表格 -->
					<view class="table">
						<!-- 表头 -->
						<view class="tr head">
							<view class="th">{{$t("健康指数")}}</view>
							<view class="th">{{$t("它主要衡量什么")}}</view>
							<view class="th">{{$t("指数越大")}}</view>
						</view>
						<!-- 数据行 -->
						<view class="tr" v-for="(row, i) in healthlist" :key="i">
							<view class="td">{{ row.name }}</view>
							<view class="td">{{ row.desc }}</view>
							<view class="td">{{ row.mean }}</view>
						</view>
					</view>
					<button @tap="health_Explanationpopuclose()"
						style="width: 120px; height: 48px;  border-radius: 20px;background: #3298F7;color: white;margin-top: 20px">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
		<GlobalPopup ref="globalPopup" />
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'; //全局挂载
	import CryptoJS from 'crypto-js';
	import BasicDrag from '@/components/basic-drag/index.vue'; //卡片
	import BluetoothManager from '../../api/BluetoothManager.js'; //低功耗蓝牙连接
	import ytDateTimePicker from '@/uni_modules/yt-dateTimePicker/components/yt-dateTimePicker/yt-dateTimePicker.vue';
	import {
		clearDailyGoalData
	} from '../../api/unitls/dailyClear.js';
	import {
		isInChinaByIP,
		ISgetUserInfoUS,
		ISgetUserInfoChina,
	} from '../../api/isInChinaByIP.js'; //获取定位
	import {
		hexStringToBytes
	} from '../../api/unitls/bleUtils.js';
	import {
		receive5610SleepData
	} from '../../api/unitls/sleepParser.js';
	import WeightConverter from '../../api/unitls/weightConverter.js';
	import {
		checkNotificationPermissions,
		isDingweiEnabled
	} from "../../api/unitls/permission.js";
	import {
		getLocalTimeAllJSON,
		checkTimezoneChanged,
		startTimezoneWatch,
		stopTimezoneWatch
	} from '../../api/unitls/timezone.js';
	import FloatButton from '../../components/float-button.vue'
	const systemInfo = uni.getSystemInfoSync(); //获取手机信息
	const windowHeight = systemInfo.windowHeight;
	/** 手表 OTA 校验写入 otadatares 后，用于心率测量命令分支的合法值 */
	const OTA_DATA_RES_WATCH_CMD_IDS = new Set([
		'6986AF9F0656352E382E350741423536313043',
		'69C0EB890656352E382E370741423536313043',
		'69D616630656352E382E380741423536313043',
		'69E5814C0656352E382E390741423536313043',
		'69E587830656352E382E380741423536313043'
	]);
	const Language = uni.getLocale();
	import AccDataParser from '../../api/unitls/accDataParser.js';
	import PPGParser from '../../api/unitls/PPGParser.js'
	import PpgDataService from "../../api/servicesppg/PpgDataService.js";
	import PpgWaveform from "../../../components/ACC_PPG/PpgWaveform.vue";
	import StepsSwiperItem from './StepsSwiperItem.vue'; //运动页面
	import SleepSwiperItem from './SleepSwiperItem.vue'; //睡眠页面
	import BodyFatSwiperItem from './BodyFatSwiperItem.vue'; //体重页面
	import BloodPressureSwiperItem from './BloodPressureSwiperItem.vue'; //血压计页面
	import EmotionSwiperItem from './EmotionSwiperItem.vue'; //情绪页面
	import EcgSwiperItem from './EcgSwiperItem.vue'; //ECG页面
	import BandReplyParser from "../../api/BandReplyParser.js";
	import {
		u16proBLE
	} from '../../api/protocol/u16pro-ble-manager.js'
	import {
		U16ProProtocol
	} from '../../api/protocol/u16pro-protocol.js'
	import {
		BC_BLE_UUID,
		BC_PACKET,
		DATA_TYPE
	} from '../../api/protocol/u16pro-constants.js'
	// 导入天气所需的函数
	import {
		getGlobalLocalWeather,
		searchCityWeather,
		getMinutelyRain,
		searchCity // 新增：导入城市搜索函数
	} from "../../api/unitls/qweather.js";
	import protocolHelper from '../../api/unitls/protocolHelper.js';
	import {
		onQxBleWatchCollectionEnded,
		refreshQxBleKeepAliveNotification,
		isQxBpw6EmotionMode,
		notifyQxBleWatchConnectionState,
		markQxBleBpw6AdapterDown,
		isQxBleAppInForeground,
		hasQxBleLiveMeasureRuntime,
		ensureQxBleKeepAliveForBackground,
		markQxPpgXferBusy,
		touchQxPpgXferBusy
	} from '../../api/qxBleAlignedSchedule.js';
	import keepAliveManager from '@/nativeplugins/KeepAlivesdkplugin/keepAliveManager.js'
	import {
		HealthDataParser
	} from '../../api/unitls/HealthDataParser.js';
	const Healthparser = new HealthDataParser();
	/** 进程内仅做一次「死会话」强清，避免每次 onShow/切后台误清定时/血压后 sendwatch */
	let emotionDeadBusyColdStartResetDone = false;
	import {
		WeatherForecastEncoder,
		WeatherForecastDecoder
	} from '../../api/unitls/weatherProtocol.js';
	// 获取本地时间
	const now = new Date();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	// 格式：mm/dd
	const yali_time = `${month}/${day}`; // 02/27 (洛杉矶) 或 02/28 (北京)
	// 本地日期时间 ISO 格式（但使用本地时间）
	const localISO =
		`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}.${String(now.getMilliseconds()).padStart(3,'0')}`;
	//BPW1低功耗蓝牙服务值
	const BPW1serviceId = "81EEA001-E735-49EC-8A11-7E32CAE1E14E";
	const BPW1write = "81EEA003-E735-49EC-8A11-7E32CAE1E14E";
	const BPW1notify = "81EEA002-E735-49EC-8A11-7E32CAE1E14E";
	//优瑞恩手表低功耗蓝牙服务值
	const BPW6SERVICE = '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E';
	const BPW6WRITE = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
	const BPW6NOTIFY = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
	// BPW6 PPG自定义蓝牙服务（0xBC协议）
	const BPW6BC_SERVICE = 'DE5BF728-D711-4E47-AF26-65E3012A5DC7';
	// ECG start
	const SERVICE_ID = '0000FF00-0000-1000-8000-00805F9B34FB'
	const WRITE_UUID = '0000FF02-0000-1000-8000-00805F9B34FB'
	const NOTIFY_UUID = '0000FF01-0000-1000-8000-00805F9B34FB'
	const CMD_ECG_START = [0xA5, 0x12, 0x01, 0x13, 0x0A]
	const CMD_ECG_STOP = [0xA6, 0x15, 0x01, 0x17, 0x0A]
	// ECG end
	export default {
		components: {
			BasicDrag,
			ytDateTimePicker,
			FloatButton,
			PpgWaveform,
			StepsSwiperItem,
			SleepSwiperItem,
			BodyFatSwiperItem,
			BloodPressureSwiperItem,
			EmotionSwiperItem,
			EcgSwiperItem,
		},
		computed: {
			...mapState(['info', 'getpendinglenth', 'acktypes', 'acktypes6', 'BLE_CHANGE']),
			sleepTip() {
				// 1. 先拼出 key 后缀
				const idx = this.xueya; // 0-3
				const med = this.medication === true ? 1 : 2; // 1=用药 2=未用药
				const idsd = [1, 2, 3, 4, 5, 6, 7, 8][idx * 2 + (med - 1)]; // 0-7 → 1-8
				if (idsd) {
					// 2. 返回固定顺序的 key 数组
					return [
						'睡眠质量',
						`用药情况${med}`,
						`健康建议${idsd}`, // 0-3 → 1-8
						`原因${idsd}`,
						`药物与睡眠解释${idsd}`,
						`生活方式建议${idsd}`
					];
				}
				return []
			},
			tabs() {
				return [this.$t('心血管'), this.$t('情绪'), this.$t('体重'), this.$t('睡眠'), this.$t('运动')]
			},
			buttonPattern() {
				const menuItems = [{
					icon: '/static/page_icon/aipbg.jpg',
					text: this.$t("报告"),
					handler: () => {
						uni.navigateTo({
							url: '/pages/tabBar/main/report_all_type/report_all_type'
						})
					}
				}, {
					icon: '/static/page_icon/jinggaotishijingbaoyujing.png',
					text: this.$t("警报"),
					handler: () => {
						uni.navigateTo({
							url: "/pages/tabBar/my/Alarms"
						})
					}
				}, {
					icon: '/static/page_icon/dingshiBP.png',
					text: this.$t("监测"),
					handler: () => {
						uni.navigateTo({
							url: "/pages/tabBar/main/globalweather/Monitoring?devicetype=" + this
								.devicetype + "&devicetypelist=" + this.devicetypelist.length
						})
					}
				}, ]
				return {
					theme: 'primary',
					icon: '/static/page_icon/aipbg.jpg',
					menuItems
				}
			},
			// 计算是否为有测量数据ECG
			hasMeasurementData() {
				return this.fullDataCount > 0;
			}
		},
		data() {
			// 获取本地时间
			const now = new Date();
			const year = now.getFullYear();
			const month = (now.getMonth() + 1).toString().padStart(2, '0');
			const day = now.getDate().toString().padStart(2, '0');
			const boolhistoday = `${year}-${month}-${day}`; // 本地日期，不是UTC
			// 格式：mm/dd
			const yali_time = `${month}/${day}`; // 02/27 (洛杉矶) 或 02/28 (北京)
			return {
				//ECG start
				connected: false,
				connecting: false,
				tip: '点击"连接血压计"开始',
				dataCount: 0,
				fullDataCount: 0,
				statsVisible: true,
				dataSource: '未连接',
				queueLength: 0,
				deviceId: '',
				notifyCharacteristicId: '',
				writeCharacteristicId: '',
				buffer: '',
				sendCnt: 0,
				measurementStatus: '', // 测量状态
				deviceIdECG: '',
				serviceIdECG: '',
				uuidECG: '',
				ecgdatarows: [],
				baseFeaturesExtracted: '',
				derivedFeaturesExtracted: '',
				qualityScore: '',
				modelScore: '',
				ecgtimsdpad: null,
				characteristicsCacheECG: new Set(), // 用于记录已获取特征值的设备ID
				//ECG end
				Languageceliang: uni.getLocale(),
				showDebug: false,
				debugInfo: 'PPG数据接收初始化...\n',
				isConnected: false,
				connectionStatus: '蓝牙未连接',
				bufferPPG: [],
				healthlist: [{
					name: this.$t("压力指数"),
					desc: this.$t("神经系统"),
					mean: this.$t("身体正处于更强烈的应激状态中")
				}, {
					name: this.$t("疲劳指数"),
					desc: this.$t("身体和心理的消耗程度"),
					mean: this.$t("身体和精神的疲劳感更重")
				}, {
					name: this.$t("恢复指数"),
					desc: this.$t("身体从应激和疲劳状态中恢复过来的能力和速度"),
					mean: this.$t("身体的恢复能力更强")
				}],
				Indicatorlist: [{
					zh: this.$t("心情状态"),
					val: '>=8',
					desc: this.$t("积极愉悦2"),
					red: false
				}, {
					zh: '',
					val: '>=6',
					desc: this.$t("平静稳定2"),
					red: false
				}, {
					zh: '',
					val: '>=4',
					desc: this.$t("轻微压力2"),
					red: false
				}, {
					zh: '',
					val: '<4',
					desc: this.$t("明显压力2"),
					red: true
				}, {
					zh: this.$t("抑郁风险评分"),
					val: '>=8',
					desc: this.$t("较高风险2"),
					red: true
				}, {
					zh: '',
					val: '>=5',
					desc: this.$t("中等风险2"),
					red: false
				}, {
					zh: '',
					val: '<5',
					desc: this.$t("较低风险2"),
					red: false
				}, {
					zh: this.$t("压力指数"),
					val: '>=5',
					desc: this.$t("压力大2"),
					red: true
				}, {
					zh: '',
					val: '<5',
					desc: this.$t("压力小2"),
					red: false
				}, {
					zh: this.$t("疲劳指数"),
					val: '>=5',
					desc: this.$t("疲劳度高2"),
					red: true
				}, {
					zh: '',
					val: '<5',
					desc: this.$t("疲劳度低2"),
					red: false
				}, {
					zh: this.$t("恢复指数"),
					val: '>=5',
					desc: this.$t("恢复快2"),
					red: false
				}, {
					zh: "",
					val: '<5',
					desc: this.$t("恢复慢2"),
					red: true
				}],
				Daily_Goal: '',
				today_Daily_Goal: uni.getStorageSync("today_Daily_Goal") || "--/--",
				medication: uni.getStorageSync("medication") || false,
				buttonVisible: true,
				stepsData: {}, // 用于存储每天步数的对象
				timer: null, // 定时器变量
				timertwslist: null,
				screenHeight: windowHeight,
				currentIndex: 0, // swiper索引
				disabletouch: false,
				msg: true,
				connectedDevices: {}, // 存储已连接设备的信息
				deviceList: [], // 存储搜索到的设备列表
				bluetoothManager: new BluetoothManager(),
				endtimesss: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
				list: [{
					bmi_show: false,
					image: "../../../static/icons/2.png",
					Step_number: "-",
					title: this.$t('身高'),
					type_LX: "cm",
					Step_count: "-"
				}, {
					BMI_TF: 0,
					BMI_ys: "-",
					bmi_show: true,
					image: "../../../static/page_icon/10.png",
					Step_number: "-",
					title: this.$t('血氧'),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/icons/5.png",
					Step_number: "-",
					title: this.$t('心率'),
					type_LX: "BPM",
					Step_count: "-"
				}],
				list2: [{
					BMI_TF: 0,
					BMI_ys: "-",
					bmi_show: true,
					image: "../../../static/icons/4.png",
					Step_number: "-",
					title: 'BMI',
					type_LX: "kg/m²",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/3.png",
					Step_number: "-",
					title: this.$t("骨含量"),
					type_LX: "kg",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/7.png",
					Step_number: "-",
					title: this.$t("肌肉量"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/4.png",
					Step_number: "-",
					title: this.$t("蛋白率"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/5.jpg",
					Step_number: "-",
					title: this.$t("水分"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/8.png",
					Step_number: "-",
					title: this.$t("内脏脂肪指数"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/6.png",
					Step_number: "-",
					title: this.$t("脂肪率"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/1.png",
					Step_number: "-",
					title: this.$t("基础代谢率"),
					type_LX: "KCAL",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/2.png",
					Step_number: "-",
					title: this.$t("皮下脂肪率"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/9.png",
					Step_number: "-",
					title: this.$t("身体年龄"),
					type_LX: this.$t("岁"),
					Step_count: "-",
					checkbox: false,
				}],
				fillOut: false,
				Latest_weight: "-",
				newweightKG: "KG",
				Latest_date: "-",
				Initial_weight: "--",
				Target_weight: "-",
				chuhsikg: "kg",
				Chest_circumference: "-",
				waistline: "-",
				Hip_circumference: "-",
				Upper_Chest_circumference: "-",
				Thigh_circumference: "-",
				Calf_circumference: "-",
				xueya: 0,
				title_name: "-",
				lowPressure: "-",
				highPressure: "-",
				Blood: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa",
				pulse: "-",
				pulsetime: '-/-',
				showTotal_date: `${month}/${day}`,
				birthday: this.$t('今天'),
				birthday1: this.$t('今天'),
				birthday2: this.$t('今天'),
				datass: localISO,
				xw_value: "",
				yw_value: "",
				tw_value: "",
				stw_value: "",
				dtw_value: "",
				xtw_value: "",
				tizhong: "",
				mubiao: '',
				xiongwei: "",
				yaowei: "",
				tunwei: "",
				shangtunwei: "",
				datuiwei: "",
				xiaotuiwei: "",
				disabledsaaa: true,
				disabledsaaa2: true,
				binaji: true,
				binaji2: true,
				animation: '', // 动画样式
				animation2: '', // 动画样式
				button_show: false,
				button_show2: false,
				delate_icon: false,
				delate_icon2: false,
				shousuoya: "",
				shuzhangya: "",
				maibo: "",
				birthday1111: this.$t('今天'),
				loact: '',
				arrrylist: [],
				yali: '--/--',
				yali_time: `${month}/${day}`, // "02/27"
				sleep: '--/--',
				sleep_time: '--/--',
				sleep_point: '--/--',
				totalLight: 'NA',
				totalDeep: 'NA',
				totalRem: 'NA',
				bushu: '--/--',
				bushu_time: '--/--',
				chartDataPPG: {
					categories: [""],
					series: [{
						legendShape: "none",
						name: "",
						data: [null]
					}, {
						legendShape: "none",
						name: "",
						data: [null]
					}, {
						legendShape: "none",
						name: "",
						data: [null],
					}, {
						legendShape: "none",
						name: "",
						data: [null],
					}, {
						legendShape: "none",
						name: "",
						data: [null],
					}]
				},
				optsPPG: {
					color: ["#3298F7", "#3298F7", "#3298F7", "#3298F7", "#3298F7"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					xAxis: {
						disableGrid: true,
						gridType: "solid"
					},
					yAxis: {
						splitNumber: 10,
						data: [{
							min: 0,
							max: 10,
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						},
						markLine: {
							type: "dash",
							data: [{
								value: 8,
								lineColor: "#FF6B6B",
								showLabel: true,
								labelText: this.$t("积极愉悦2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 145,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
								borderWidth: 0,
								borderColor: "transparent",
								borderRadius: 4,
								padding: [4, 8, 4, 8]
							}, {
								value: 6,
								lineColor: "#3298F7",
								showLabel: true,
								labelText: this.$t("平静稳定2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 115,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
							}, {
								value: 4,
								lineColor: "#EE6666",
								showLabel: true,
								labelText: this.$t("轻微压力2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 83,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
							}, {
								value: 0,
								lineColor: "#D8D8D6",
								showLabel: true,
								labelText: this.$t("明显压力2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 122,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
							}]
						}
					}
				},
				chartDataPPG2: {
					categories: [""],
					series: [{
						legendShape: "none",
						name: "",
						data: [null]
					}, {
						legendShape: "none",
						name: "",
						data: [null]
					}, {
						legendShape: "none",
						name: "",
						data: [null],
					}, {
						legendShape: "none",
						name: "",
						data: [null],
					}, {
						legendShape: "none",
						name: "",
						data: [null],
					}]
				},
				optsPPG2: {
					color: ["#3298F7", "#3298F7", "#3298F7", "#3298F7", "#3298F7"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						splitNumber: 10,
						data: [{
							min: 0,
							max: 10,
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						},
						markLine: {
							type: "dash",
							data: [{
								value: 8,
								lineColor: "#FF6B6B",
								showLabel: true,
								labelText: this.$t("积极愉悦2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 145,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
								borderWidth: 0,
								borderColor: "transparent",
								borderRadius: 4,
								padding: [4, 8, 4, 8]

							}, {
								value: 6,
								lineColor: "#3298F7",
								showLabel: true,
								labelText: this.$t("平静稳定2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 115,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
							}, {
								value: 4,
								lineColor: "#EE6666",
								showLabel: true,
								labelText: this.$t("轻微压力2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 83,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
							}, {
								value: 0,
								lineColor: "#D8D8D6",
								showLabel: true,
								labelText: this.$t("明显压力2"),
								labelAlign: "left",
								labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 122,
								labelFontColor: "#D8D8D6",
								labelOffsetY: -15,
								labelBgOpacity: -0.8,
							}]
						}
					}
				},
				chartData: {
					categories: [0],
					series: [{
						legendShape: "circle",
						name: this.$t("步数"),
						data: [0]
					}, ]
				},
				opts: {
					color: ["#EE6666"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						splitNumber: 5,
						data: [{
							min: 0,
							max: 10000,
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					}
				},
				tempBuffer: 0,
				xueyapack: 0,
				xinlvpack: 0,
				xueyangpack: 0,
				sleeppack: 0,
				synchronizationpack: 0,
				Equipmentquery: 0,
				quotientACC: 0,
				quotientota: 0,
				quotientPPG: 0,
				dataBuffer: [],
				Protocolsubcommand: '',
				writeuuid: '',
				deviceIdwatch: '',
				deviceIdwatch6: '',
				serviceIdwatch: '',
				xeuyejisn: "0",
				xeuyejimac: "0",
				shoubiaosn: '0',
				shoubiaomac: '0',
				xueyehuilian: true,
				characteristicsCache: new Set(), // 用于记录已获取特征值的设备ID
				timsdpad: null,
				notifyTriggered: false, // 初始化通知标志
				devicdsdmac: [],
				devicdsdmac1: [],
				queryDevicesDone: false, // 标志位：是否已执行过
				lastWeightbishi: "",
				xueyabiaoshi: '',
				PPGdataarray: 0x05,
				ppgnewpoint: '',
				fenxi: '',
				isExpanded2: false, // 控制是否展开
				signal_quality_level: '',
				mood_level: "",
				mood_Description: '',
				signal_quality_score: '-', //信号质量评分(0-1)
				depression_risk_level: "", //心理健康评估抑郁风险评分
				depression_risk_score: '', //心理健康评估抑郁风险等级
				depression_recommendation: '', //心理健康评估专业建议
				baoggaodisabled: true, //报告按钮
				finalResult: false, //最终同时满足两个条件
				finalResultids: false, //最终同时满足两个条件
				stress_Index: '',
				fatigue_index: '',
				recovery_index: '',
				data_sufficiency: '',
				watchtimer: null,
				watchtimer2: null,
				watchtimer3: null,
				/** BPW1 立即测量：防重复启动 / 等待同步定时器 */
				bpw1ImmediatePpgLaunchLock: false,
				bpw1ImmediateCmdStarted: false,
				bpw1ImmediateSyncDelayTimer: null,
				bpw1ImmediateAfterSyncTimer: null,
				/** BPW1 情绪测量：已发 OTA 查询、等待设备信息后再下发测量命令 */
				bpw1PendingEmotionMeasure: null,
				bpw1EmotionMeasureWaitTimer: null,
				bpw1OtaReadyFlushTimer: null,
				/** BPW1 PPG 正在收数传输（Status01~02），切前后台禁止重连打断 */
				bpw1PpgTransferActive: false,
				/** BPW1 PPG 最近收包墙钟 / 传输超时截止（收包续期，等 Status02） */
				bpw1PpgLastPacketAt: 0,
				bpw1PpgTransferDeadline: 0,
				types_index: Number(uni.getStorageSync("types_index") || 0),
				types_array: [this.$t("心情指数"), this.$t("抑郁风险评分"), this.$t("压力指数"), this.$t("疲劳指数"), this.$t("恢复指数")],
				sleep_alertdisabled: true,
				sleep_alertid: 0,
				immediateEmotionMeasure: false,
				hasSynced: false,
				hasSynced6: false,
				MoodDays: "",
				StressFatigueDays: "",
				blewatch_id: "1",
				blewatch_id2: "1",

				// 当天天气
				searchQuery: '',
				searchResults: [],
				weatherData: null,
				minutelyRain: null,
				fromCache: false,
				weatherDataID: "",
				weatherDataID7: "",
				// 三天内白天均值
				junzhi_SZY_b: 'NA',
				junzhi_SSY_b: 'NA',
				junzhi_pulse_b: 'NA',
				finlretVarList1: 'BPvSBPvCNTv3DvCNTv0002,BPvSBPvCNTv3DvCNTv0003,BPvSBPvCNTv3DvCNTv0004,BPvSBPvCNTv3DvCNTv0001,JLvRULEv3DvDATACHECKv0001,JLvRULEv3DvDATACHECKv0002,JLvRULEv3DvDATACHECKv0003,BPvSBPvAVGv3DvAVGv0002,BPvDBPvAVGv3DvAVGv0002,BPvHRvAVGv3DvAVGv0002,BPvSBPvAVGv3DvAVGv0003,BPvDBPvAVGv3DvAVGv0003,BPvHRvAVGv3DvAVGv0003,BPvSBPvAVGv3DvAVGv0004,BPvDBPvAVGv3DvAVGv0004,BPvHRvAVGv3DvAVGv0004,BPvSBPvAVGv3DvAVGv0001,BPvDBPvAVGv3DvAVGv0001,BPvHRvAVGv3DvAVGv0001,JLvRULEv3DvBPCHECKv0004,JLvRULEv3DvBPCHECKv0005,JLvRULEv3DvBPCHECKv0007,JLvRULEv3DvBPCHECKv0008,JLvRULEv3DvBPCHECKv0010,JLvRULEv3DvBPCHECKv0011,JLvRULEv3DvBPCHECKv0001,JLvRULEv3DvBPCHECKv0002,BPvSBPvSTDv3DvSTDv0002,BPvDBPvSTDv3DvSTDv0002,BPvHRvSTDv3DvSTDv0002,BPvSBPvSTDv3DvSTDv0003,BPvDBPvSTDv3DvSTDv0003,BPvHRvSTDv3DvSTDv0003,BPvSBPvSTDv3DvSTDv0004,BPvDBPvSTDv3DvSTDv0004,BPvHRvSTDv3DvSTDv0004,BPvSBPvSTDv3DvSTDv0001,BPvDBPvSTDv3DvSTDv0001,BPvHRvSTDv3DvSTDv0001,BPvSBPvMAXv3DvMAXv0002,BPvDBPvMAXv3DvMAXv0002,BPvHRvMAXv3DvMAXv0002,BPvSBPvMAXv3DvMAXv0003,BPvDBPvMAXv3DvMAXv0003,BPvHRvMAXv3DvMAXv0003,BPvSBPvMAXv3DvMAXv0004,BPvDBPvMAXv3DvMAXv0004,BPvHRvMAXv3DvMAXv0004,BPvSBPvMAXv3DvMAXv0001,BPvDBPvMAXv3DvMAXv0001,BPvHRvMAXv3DvMAXv0001,BPvSBPvMEDv3DvMEDv0002,BPvDBPvMEDv3DvMEDv0002,BPvHRvMEDv3DvMEDv0002,BPvSBPvMEDv3DvMEDv0003,BPvDBPvMEDv3DvMEDv0003,BPvHRvMEDv3DvMEDv0003,BPvSBPvMEDv3DvMEDv0004,BPvDBPvMEDv3DvMEDv0004,BPvHRvMEDv3DvMEDv0004,BPvSBPvMEDv3DvMEDv0001,BPvDBPvMEDv3DvMEDv0001,BPvHRvMEDv3DvMEDv0001,BPvSBPvMINv3DvMINv0002,BPvDBPvMINv3DvMINv0002,BPvHRvMINv3DvMINv0002,BPvSBPvMINv3DvMINv0003,BPvDBPvMINv3DvMINv0003,BPvHRvMINv3DvMINv0003,BPvSBPvMINv3DvMINv0004,BPvDBPvMINv3DvMINv0004,BPvHRvMINv3DvMINv0004,BPvSBPvMINv3DvMINv0001,BPvDBPvMINv3DvMINv0001,BPvHRvMINv3DvMINv0001,BPvSBPvLOADv3DvRATIOv0002,BPvDBPvLOADv3DvRATIOv0002,BPvSBPvLOADv3DvRATIOv0003,BPvDBPvLOADv3DvRATIOv0003,BPvSBPvLOADv3DvRATIOv0004,BPvDBPvLOADv3DvRATIOv0004,BPvSBPvLOADv3DvRATIOv0001,BPvDBPvLOADv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0022,JLvRULEv3DvBPCHECKv0027,JLvRULEv3DvBPCHECKv0023,JLvRULEv3DvBPCHECKv0028,JLvRULEv3DvBPCHECKv0024,JLvRULEv3DvBPCHECKv0029,JLvRULEv3DvBPCHECKv0021,JLvRULEv3DvBPCHECKv0026,BPvSBPvNBRv3DvRATIOv0001,BPvDBPvNBRv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0013,JLvRULEv3DvBPCHECKv0014,JLvRULEv3DvBPCHECKv0015,JLvRULEv3DvBPCHECKv0016,JLvRULEv3DvBPCHECKv0017,JLvRULEv3DvBPCHECKv0018, JLvRULEv3DvBPCHECKv0019, JLvRULEv3DvBPCHECKv0020,BPvSBPvMBSv3DvMINUSv0001,BPvDBPvMBSv3DvMINUSv0001,JLvRULEv3DvBPCHECKv0031,BPvSBPvCVv3DvRATIO2v0002,BPvDBPvCVv3DvRATIO2v0002,BPvHRvCVv3DvRATIO2v0002,BPvSBPvCVv3DvRATIO2v0003,BPvDBPvCVv3DvRATIO2v0003,BPvHRvCVv3DvRATIO2v0003,BPvSBPvCVv3DvRATIO2v0004,BPvDBPvCVv3DvRATIO2v0004,BPvHRvCVv3DvRATIO2v0004,BPvSBPvCVv3DvRATIO2v0001,BPvDBPvCVv3DvRATIO2v0001,BPvHRvCVv3DvRATIO2v0001,BPvAASIv3D,JLvRULEv3DvBPCHECKv0032',
				yalixueyatype: false,
				xueya_xinlv: false,
				hrResult: [],
				bpResult: [],
				/** BPW1 实时血压/心率分包配对（时间差约1秒，统一用血压时间上报） */
				bpw1PendingLiveBp: null,
				bpw1PendingBpCompanionHr: null,
				bpw1LiveBpHrFlushTimer: null,
				bpw1HrConsumedByBpKeys: null,
				/** 最近一次实时心率（用于心率先到、血压后到时回捞配对） */
				bpw1RecentLiveHr: null,
				/** 血压测量进行中：期间心率只缓存配对，不单独上报（避免 xueya_xinlv 被首包清掉后重报） */
				bpw1AwaitingBpHrPair: false,
				/** 首页卡片主动测心率：只用心率命令，不走 PPG/情绪，也不进入血压配对 */
				bpw1CardHrOnly: false,
				/** BPW1 历史同步进行中（比 blewatch_id 更稳，避免中途被睡眠包清掉后误弹窗） */
				bpw1HistorySyncActive: false,
				bpw1HistorySyncEndTimer: null,
				/** 历史同步结束后再下发天气，避免抢通道 */
				bpw1PendingWeatherAfterHistory: null,
				/** 历史同步结束后再配对/开音频，避免与运动回复/同步写撞 10007 */
				bpw1PendingPairAudio: null,
				/** 历史同步结束后再恢复定时调度，避免调度写抢通道 */
				bpw1PendingResumeSchedule: false,
				/** 连接初始化链（保留字段，当前用固定定时调度） */
				bpw1InitChain: null,
				bpw1InitChainTimer: null,
				/** BPW1 连接初始化定时器（重连必须清掉，否则旧运动/同步会撞新一轮） */
				bpw1TimeDelayTimer: null,
				bpw1SportTimer: null,
				bpw1SyncTimer: null,
				bpw1SetupGen: 0,
				/** 查询→校时→运动→同步命令阶段：暂停 ACK 写出，避免与初始化命令撞写 10007 */
				bpw1SetupCmdBusy: false,
				/** BPW1 本会话已上报过的心率时间键（防接口回填前重复上报） */
				bpw1UploadedHrKeys: null,
				deviceSnuserID: [],
				currentDatehis: boolhistoday,
				boolserverData: null,
				boolserverOxygenData: null,
				bpw6BpBuffer: [],
				bpw6BpSyncing: false,
				/** BPW6 心率：同槽位已上报新值，防止 get_device_info 用旧接口值把卡片打回 */
				bpw6PendingHrUi: null,
				/** BPW6 心率：本会话已上报的 槽位→值（防接口未回填前同值重复报） */
				bpw6UploadedHrSlotValue: null,
				bpw6HrSyncing: false,
				/** BPW6 血氧：连接后历史同步中（历史不上报；实时测量仍上报） */
				bpw6SpO2Syncing: false,
				/** BPW6 血氧：已处理的实时读序号（防同一次读重复上报） */
				bpw6LastSpO2RealtimeSeq: 0,
				bpw6PendingPpgAfterBp: false,
				bpw6PendingPpgTimer: null,
				bpw6PpgStartInProgress: false,
				/** 连接后主链路初始化截止时间（校时/电量/自动测量开关/历史同步窗口），立即 PPG 需等过此点 */
				bpw6PostConnectSetupUntil: 0,
				bpw6HrBuffer: [],
				/** BPW6 血氧：本会话已上报的 槽位→值（手机本地时间上报，不能靠接口时间比新旧去重） */
				bpw6UploadedSpO2SlotValue: null,
				bpw6SpO2Buffer: [],
				bpDynamicParams: uni.getStorageSync('bpw6_bp_dynamic_params') || null,
				bpw6PpgRawBuffer: [],
				bpw6PpgDataSize: 0,
				bpw6PpgMeasuring: false,
				bpw6PpgLoadingActive: false,
				/** 当前已展示的 loading 文案 key，同 key 不重复 showLoading，避免闪烁 */
				bpw6PpgLoadingTitleKey: '',
				bpw6PpgTransferStarted: false,
				/** PPG 完成回调后读数/上传中，回前台勿误判为空闲 */
				bpw6PpgFinishing: false,
				/**
				 * 立即测量 UI 阶段：measuring=测量中；transferring=云端数据计算中。
				 * 切前后台只按此阶段刷新文案，禁止用 loadingActive 误判成传输。
				 */
				bpw6EmotionPpgPhase: '',
				/** 立即测量进入云端等待的墙钟时间（用于忽略当日旧 ANALYZED 记录） */
				bpw6CloudWaitStartedAt: 0,
				/** BPW6 情绪立即测量会话（用于超时与按钮恢复） */
				bpw6EmotionPpgActive: false,
				bpw6EmotionPpgTimer: null,
				/** 立即测量开始墙钟时间（熄屏后 setTimeout 会暂停，回前台用墙钟纠偏） */
				bpw6EmotionPpgStartedAt: 0,
				/** 后台曾结束测量但 hideLoading 可能未生效，回前台再清一次 */
				bpw6NeedClearLoadingOnShow: false,
				ppgUploadInProgress: false,
				isInitDone: false,
				isProcessed: uni.getStorageSync("isProcessed") || false, // 标志位
				hasWriten: false,
				Taking_pulse: [],
				BPW6intervalTimer: null,
				/** BPW6：App 端 onBLEConnectionStateChange 不可靠，配合轮询与适配器状态 */
				bpw6BleMonitorActive: false,
				bpw6BleMonitorBound: false,
				bpw6BleLastConnected: false,
				bpw6BleConnectionHandler: null,
				bpw6BleAdapterStateHandler: null,
				bpw6BleStatusPollTimer: null,
				bpw6BleConnectTimer: null,
				bpw6BleCharacteristicsTimer: null,
				bpw6BleNotifyListenerRegistered: false,
				/** 前台系统已连接列表连续未命中次数（用于避免偶发空列表误断） */
				bpw6BleMissCount: 0,
				/** 防止 createBLEConnection 并发风暴 */
				bpw6BleConnecting: false,
				bpw6BleLastConnectAt: 0,
				/** 仅：App 后台 + 超距断开后回到范围的独立回连定时器（不影响其它回连） */
				bpw6BgOutOfRangeReconnectTimer: null,
				bpw6BgOutOfRangeReconnectBusy: false,
				/** 后台关蓝牙后，等 available:true 再静默回连（不走前台断开清理） */
				bpw6BgNeedReconnectAfterAdapterOn: false,
				/** 本轮由后台开蓝牙触发的回连（假 already 时要强制断开重连） */
				bpw6BgFromBtToggleReconnect: false,
				/** 后台开蓝牙后假 already 强制断开重试次数 */
				bpw6BgFakeAlreadyRetries: 0,
				/** 后台静默回连启动时间（卡住时 watchdog 可重启） */
				bpw6BgReconnectArmedAt: 0,
				/** 前台蓝牙关闭后，等 available:true 再直连回连 */
				bpw6FgNeedReconnectAfterAdapterOn: false,
				bpw6BgBtToggleStartTimer: null,
				QX_FAIL: false,
				QX_HIDE: true,
				devicetype: 30000,
				devicetypelist: [],
			}
		},
		mounted() {
			this.loadStepsFromStorage();
			this.timer = setInterval(this.saveDailySteps, 24 * 60 * 60 * 1000); // 每24小时触发一次
		},
		beforeDestroy() {
			clearInterval(this.timer);
			this.xueyehuilian = false
		},
		onHide() {
			this.xueyehuilian = false
			this.QX_HIDE = false
			// 仅真实测量/传输/云端/定时会话才保灰；孤儿标记先清掉，避免下次回前台误置灰
			this.clearOrphanBpw6EmotionBusyMarks('切后台')
			const liveImmediate = this.hasLiveBpw6EmotionSession()
			const liveBpw1 = this.hasLiveBpw1EmotionSession()
			const silentBusy = this.isEmotionMeasureBusySession() || this.hasSilentBpw6PpgWork()
			if (liveImmediate) {
				// 真实 BPW6 立即测量会话：后台保持置灰与阶段
				this.markBpw6PpgSessionBusy('BPW6切后台保持置灰')
				const phaseBusy = this.bpw6EmotionPpgPhase === 'measuring' ||
					this.bpw6EmotionPpgPhase === 'transferring'
				if (phaseBusy || this.bpw6PpgTransferStarted) {
					try {
						uni.setStorageSync('bpw6_emotion_ppg_phase', this.bpw6EmotionPpgPhase ||
							(this.bpw6PpgTransferStarted ? 'transferring' : 'measuring'))
					} catch (e2) {}
				}
			} else if (liveBpw1 || silentBusy) {
				// BPW1 立即测量（含同步等待）/ 定时 / 血压后：只保灰，不关 loading、不弹 BPW6 窗
				this.setEmotionMeasureBusy(true, '切后台非BPW6立即测量保持置灰')
			} else {
				this.bpw6NeedClearLoadingOnShow = true
				try {
					uni.hideLoading()
				} catch (e) {}
				this.hideBpw6PpgLoading(true)
			}
			// PPG 采集/传输中禁止 getUserInfo→queryDevices→重连，否则会打断手表传数
			if (!this.shouldDeferBleReconnectForPpg()) {
				this.getUserInfo()
			} else {
				console.log('【BPW1】PPG进行中，切后台跳过getUserInfo重连')
			}
			stopTimezoneWatch()
			if (this.timsdpad) {
				clearInterval(this.timsdpad);
				this.timsdpad = null;
			}
		},
		onLoad() {
			// 监听全局事件
			uni.$on('SHOW_GLOBAL_POPUP', opts => {
				this.$refs.noticePopup.show(opts)
			})
			/* 接收 App.vue 发来的指令 */
			uni.$on('APP_WANT_POPUP', opts => {
				this.$popup(opts)
			})
			uni.$on('BPW6_DEVICE_UNBIND', this.onBpw6DeviceUnbind)
			uni.$on('DEVICE_BLE_UNBIND', this.onDeviceBleUnbind)
			uni.$on('DEVICE_BIND_PAGE_ACTIVE', this.onDeviceBindPageActive)
			uni.$on('DEVICE_BIND_PAGE_INACTIVE', this.onDeviceBindPageInactive)
			uni.$on('EMOTION_MEASURE_BUSY', this.onEmotionMeasureBusy)
			uni.$on('BPW6_ENSURE_RECONNECT', this.onBpw6EnsureReconnect)
		},
		onUnload() {
			this.stopBpw6BgOutOfRangeReconnect()
			this.unregisterBpw6BleConnectionMonitor()
			this.disConnect()
			stopTimezoneWatch()
			// 页面销毁时记得解绑
			uni.$off('APP_WANT_POPUP')
			uni.$off('SHOW_GLOBAL_POPUP')
			uni.$off('BPW6_DEVICE_UNBIND', this.onBpw6DeviceUnbind)
			uni.$off('DEVICE_BLE_UNBIND', this.onDeviceBleUnbind)
			uni.$off('DEVICE_BIND_PAGE_ACTIVE', this.onDeviceBindPageActive)
			uni.$off('DEVICE_BIND_PAGE_INACTIVE', this.onDeviceBindPageInactive)
			uni.$off('EMOTION_MEASURE_BUSY', this.onEmotionMeasureBusy)
			uni.$off('BPW6_ENSURE_RECONNECT', this.onBpw6EnsureReconnect)
			this.xueyehuilian = false
		},
		onShow() {
			let that = this
			// 回前台：停止后台静默回连，交还现有前台回连逻辑
			that.markBpw6BgNeedBtReconnect(false)
			that.bpw6BgFromBtToggleReconnect = false
			that.bpw6BgFakeAlreadyRetries = 0
			that.bpw6FgNeedReconnectAfterAdapterOn = false
			that.stopBpw6BgOutOfRangeReconnect()
			that.stopBpw6BgBtOnWatchdog()
			uni.removeStorageSync("jiance")
			uni.setStorageSync("last_app_version", systemInfo.appVersion)
			that.initPage();
			if (that.isPermissionTipShown() || uni.getStorageSync("appQX")) {
				that.tryRequestAppPermissions();
			}
			that.refreshOnTimezoneChange()
			startTimezoneWatch(() => {
				that.refreshOnTimezoneChange()
			})
			// 在数据操作前检查清除
			clearDailyGoalData();
			that.today_Daily_Goal = uni.getStorageSync("today_Daily_Goal") || "0"
			if (that.acktypes === 0) {
				that.hasSynced = true;
			} else {
				// 已连接：勿每次回前台强制 hasSynced=false，避免缓存路径重复全量历史同步
				that.blewatch_id2 = "1";
			}
			if (that.acktypes6 === 0) {
				that.hasSynced6 = true;
			} else {
				that.hasSynced6 = false;
			}
			if (uni.getStorageSync('BPW6devicemac')) {
				that.registerBpw6BleConnectionMonitor();
			}
			that.QX_HIDE = true
			that.reconcileBpw6PpgUiAfterForeground()
			uni.getNetworkType({
				success: function(res) {
					if (res.networkType === 'none') {
						that.Latest_weight = (that.newweightKG === "KG" || that.newweightKG === "千克") ? uni
							.getStorageSync("weightkg") : uni.getStorageSync("weightlb")
						that.lowPressure = that.Blood === "mmHg" ? uni.getStorageSync("lowPressure") :
							(Number(uni.getStorageSync("lowPressure")) * 0.133).toFixed(1);
						that.highPressure = that.Blood === "mmHg" ? uni.getStorageSync("highPressure") : (
							Number(uni.getStorageSync("lowPressure")) * 0.133).toFixed(1);
						that.pulse = uni.getStorageSync("pulse")
						that.updateBloodPressureStatus(uni.getStorageSync("lowPressure"), uni
							.getStorageSync("highPressure"));
						that.xueyehuilian = true
						that.aaaa(uni.getStorageSync("lixianlist"))
					} else {
						let xueyadatavalue = uni.getStorageSync("xueyadata")
						let xueyadatatypeid = uni.getStorageSync("xueyadatatype")
						let tizhidatavalue = uni.getStorageSync("tizhidata")
						if (xueyadatatypeid && xueyadatavalue) {
							if (xueyadatatypeid === "1") {
								that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, xueyadatavalue, {
									'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
								}).then(res => {
									if (res.code === 200) {
										that.setbanhua(1)
										let deviceSnlixin = xueyadatavalue.deviceSn
										let slaveDatalixian = xueyadatavalue.slaveData
										uni.removeStorageSync("xueyadatatype")
										uni.removeStorageSync("xueyadata")
										setTimeout(() => {
											that.get_device_info(deviceSnlixin)
											that.StorageInfo(slaveDatalixian)
										}, 1000)
									}
								}).catch(errro => {
									console.log("errro", errro)
								})
							} else if (xueyadatatypeid === "0") {
								that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, xueyadatavalue, {
									'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
								}).then(resaa => {
									if (resaa.code === 200) {
										that.setbanhua(1)
										let deviceSnlixin = xueyadatavalue.deviceSn
										let slaveDatalixian = xueyadatavalue.slaveData
										uni.removeStorageSync("xueyadatatype")
										uni.removeStorageSync("xueyadata")
										setTimeout(() => {
											that.get_device_info(deviceSnlixin)
											that.StorageInfo(slaveDatalixian)
										}, 1000)
									}
								})
							}
						}
						if (tizhidatavalue) {
							that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, tizhidatavalue, {
								'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
							}).then(res => {
								if (res.code === 500) {
									uni.showToast({
										title: that.$t("失败"),
										icon: 'none'
									})
									return
								} else if (res.code === 200) {
									that.setbanhua(1)
									let deviceSntzlx = tizhidatavalue.deviceSn
									uni.removeStorageSync("tizhidata")
									setTimeout(() => {
										that.get_device_info(deviceSntzlx)
										that.get_device_data(deviceSntzlx)
									}, 1000)
								}
							})
						}
					}
				},
				fail: function(err) {
					console.error('获取网络类型失败：', err);
				}
			});
		},
		methods: {
			...mapMutations(['getInfo', 'setacktypes', 'setbanhua', 'setacktypes6']),
			/** 定时测量：手表采集结束或异常结束时通知调度器恢复待命 */
			notifyQxScheduledMeasureEnd(reason) {
				try {
					this.restoreEmotionPageButtons(reason || '定时测量结束')
					onQxBleWatchCollectionEnded(reason)
				} catch (e) {
					console.warn('notifyQxScheduledMeasureEnd', e)
				}
			},
			/** 情绪页测量按钮置灰/恢复（立即测量、血压后PPG、定时PPG 共用） */
			setEmotionMeasureBusy(busy, reason) {
				const next = !!busy
				this.sleep_alertdisabled = next
				try {
					uni.setStorageSync('sleep_alertdisabled', next)
				} catch (e) {}
			},
			/**
			 * 情绪「立即测量」按钮是否应保持置灰（含后台/storage 会话）。
			 * 覆盖：立即测量、定时 PPG、血压后 PPG、数据传输中。
			 * 注意：单独残留的 bpw6_ppg_busy / phase 不算忙碌（避免未测量却置灰）。
			 */
			isEmotionMeasureBusySession() {
				try {
					const sendwatch = uni.getStorageSync('sendwatch')
					const scheduled = uni.getStorageSync('qx_ble_scheduled_measure')
					const afterBp = uni.getStorageSync('bpw6_after_bp_ppg')
					if (sendwatch === 1 || sendwatch === '1') return true
					if (scheduled === 1 || scheduled === '1') return true
					if (afterBp === 1 || afterBp === '1') return true
				} catch (e) {}
				const bpw1AfterBpPending = !!(this.bpw1PendingLiveBp && this.bpw1PendingLiveBp.startPpgAfterBp)
				const bpw1AfterBpLaunch = !!this._bpw1AfterBpPpgTimer || this._bpw1AfterBpLaunching === true || this
					.yalixueyatype === true || !!(this._bpw1AfterBpCmdAt && Date.now() - this._bpw1AfterBpCmdAt < 120000)
				return !!(this.bpw6PendingPpgAfterBp || this.bpw6PpgMeasuring || this.bpw6PpgFinishing ||
					this.ppgUploadInProgress || this.bpw6EmotionPpgActive || this.immediateEmotionMeasure ||
					this.sleep_alertid === 1 || this.bpw6PpgStartInProgress || !!this.watchtimer2 ||
					// BPW1 立即测量：历史同步等待中尚未置 sleep_alertid，也算忙碌
					this.bpw1ImmediatePpgLaunchLock || this.bpw1ImmediateCmdStarted || !!this
					.bpw1PendingEmotionMeasure || this.bpw1PpgTransferActive ||
					// BPW1 血压后 PPG：等合并 / 延迟启动 / 命令已发
					bpw1AfterBpPending || bpw1AfterBpLaunch ||
					// 传输/阶段仅在立即测量会话仍存活时算忙碌
					((this.bpw6PpgTransferStarted || this.bpw6EmotionPpgPhase === 'measuring' || this
						.bpw6EmotionPpgPhase === 'transferring' || this.bpw6PpgLoadingActive) && (this
						.bpw6EmotionPpgActive || this.immediateEmotionMeasure || this.sleep_alertid === 1)))
			},
			/** 是否存在真实进行中的 BPW6「立即测量」会话（严格：仅 bpw6EmotionPpgActive，避免误伤 BPW1） */
			hasLiveBpw6EmotionSession() {
				return this.bpw6EmotionPpgActive === true
			},
			/** 定时 PPG / 血压后 PPG / 设备侧传输是否进行中（静默，不弹立即测量 loading） */
			hasSilentBpw6PpgWork() {
				return !!(this.bpw6PendingPpgAfterBp || this.bpw6PpgMeasuring || this.bpw6PpgFinishing ||
					this.ppgUploadInProgress || this.bpw6PpgStartInProgress)
			},
			/** BPW1 情绪立即测量/传输会话（与 BPW6 立即测量互斥） */
			hasLiveBpw1EmotionSession() {
				if (this.bpw6EmotionPpgActive) return false
				return !!(this.immediateEmotionMeasure || this.sleep_alertid === 1 ||
					this.bpw1ImmediatePpgLaunchLock || this.bpw1ImmediateCmdStarted ||
					this.bpw1PendingEmotionMeasure || this.yalixueyatype || this.bpw1PpgTransferActive || !!this
					.watchtimer2 || !!this._bpw1AfterBpPpgTimer || this._bpw1AfterBpLaunching === true ||
					!!(this.bpw1PendingLiveBp && this.bpw1PendingLiveBp.startPpgAfterBp) ||
					!!(this._bpw1AfterBpCmdAt && Date.now() - this._bpw1AfterBpCmdAt < 120000) ||
					!!(this._bpw1ImmediateCmdAt && Date.now() - this._bpw1ImmediateCmdAt < 120000) ||
					uni.getStorageSync('sendwatch') === 1)
			},
			/**
			 * BPW1 PPG 测量失败/中断：统一恢复「立即测量」按钮。
			 * 仅清 BPW1 会话；不碰 BPW6 立即测量 loading/会话。
			 */
			notifyBpw1PpgFailOrInterrupt(reason, options = {}) {
				const silent = options.silent === true
				const toastKey = options.toastKey
				const inSession = this.isBpw1ActivePpgSession() || this.hasLiveBpw1EmotionSession() ||
					this.yalixueyatype === true || this.bpw1ImmediatePpgLaunchLock === true ||
					!!this.bpw1PendingEmotionMeasure
				if (!inSession) {
					return false
				}
				console.warn('【BPW1】PPG测量失败或中断，恢复按钮', reason || '')
				try {
					uni.hideLoading()
				} catch (e) {}
				if (this.watchtimer) {
					clearInterval(this.watchtimer)
					this.watchtimer = null
				}
				this.clearBpw1PpgTransferWatchdog(reason || 'failOrInterrupt')
				this.bpw1PpgTransferActive = false
				this._bpw1AfterBpCmdAt = 0
				if (this._bpw1AfterBpPpgTimer) {
					clearTimeout(this._bpw1AfterBpPpgTimer)
					this._bpw1AfterBpPpgTimer = null
				}
				const wasScheduled = uni.getStorageSync('sendwatch') === 1
				if (wasScheduled) {
					try {
						uni.removeStorageSync('sendwatch')
					} catch (e2) {}
					this.notifyQxScheduledMeasureEnd(reason || 'BPW1 PPG失败或中断')
				} else {
					this.restoreEmotionPageButtons(reason || 'BPW1 PPG失败或中断')
				}
				if (!silent && toastKey) {
					uni.showToast({
						title: this.$t(toastKey),
						icon: 'none',
						duration: 2000
					})
				}
				return true
			},
			/**
			 * 清理未在测量却残留的忙态标记，避免回前台/杀进程重开后「立即测量」永久置灰。
			 * - 软清（切前后台）：仅清 BPW6 立即测量孤儿 phase/busy，不动 sendwatch/定时/血压后
			 * - 强清（进程冷启动一次）：无内存会话时清掉 storage 死标记，恢复可点
			 */
			clearOrphanBpw6EmotionBusyMarks(reason) {
				if (this.hasLiveBpw6EmotionSession() || this.hasSilentBpw6PpgWork() ||
					this.hasLiveBpw1EmotionSession()) {
					return false
				}
				let qxLive = false
				try {
					qxLive = !!hasQxBleLiveMeasureRuntime()
				} catch (e) {}
				// 同进程定时采集仍在：绝不碰调度/sendwatch
				if (qxLive) {
					return false
				}
				const aggressive = !emotionDeadBusyColdStartResetDone
				let hadOrphan = false
				try {
					const busy = uni.getStorageSync('bpw6_ppg_busy')
					const phase = uni.getStorageSync('bpw6_emotion_ppg_phase')
					if (busy === 1 || busy === '1' || busy === true) hadOrphan = true
					if (phase === 'measuring' || phase === 'transferring') hadOrphan = true
					if (aggressive) {
						const afterBp = uni.getStorageSync('bpw6_after_bp_ppg')
						const sendwatch = uni.getStorageSync('sendwatch')
						const scheduled = uni.getStorageSync('qx_ble_scheduled_measure')
						const sleepDis = uni.getStorageSync('sleep_alertdisabled')
						if (afterBp === 1 || afterBp === '1') hadOrphan = true
						if (sendwatch === 1 || sendwatch === '1') hadOrphan = true
						if (scheduled === 1 || scheduled === '1') hadOrphan = true
						if (sleepDis === true || sleepDis === 'true' || sleepDis === 1 || sleepDis === '1') {
							hadOrphan = true
						}
					}
				} catch (e2) {}
				if (!hadOrphan && !(this.bpw6PpgTransferStarted || this.bpw6PpgLoadingActive ||
						this.bpw6EmotionPpgPhase === 'measuring' ||
						this.bpw6EmotionPpgPhase === 'transferring')) {
					if (aggressive) {
						emotionDeadBusyColdStartResetDone = true
					}
					return false
				}
				// 软清：只丢立即测量残留 UI/phase
				this.clearBpw6PpgSessionBusyMark()
				this.bpw6PpgTransferStarted = false
				this.bpw6PpgFinishing = false
				this.bpw6PpgLoadingActive = false
				this.bpw6PpgLoadingTitleKey = ''
				this.bpw6CloudWaitStartedAt = 0
				this.bpw6EmotionPpgPhase = ''
				try {
					uni.removeStorageSync('bpw6_emotion_ppg_phase')
				} catch (e3) {}
				try {
					uni.hideLoading()
				} catch (e6) {}
				this.hideBpw6PpgLoading(true)
				if (aggressive) {
					emotionDeadBusyColdStartResetDone = true
					this.clearBpw6AfterBpPpgBusyMark()
					this.bpw6EmotionPpgActive = false
					this.bpw6EmotionPpgStartedAt = 0
					try {
						uni.removeStorageSync('sendwatch')
					} catch (e4) {}
					try {
						uni.removeStorageSync('qx_ble_scheduled_measure')
					} catch (e5) {}
					this.applyEmotionButtonIdleByBind(reason || '冷启动清理残留灰态')
				}
				return true
			},
			/** 标记 BPW6 PPG 全流程忙碌（测量+传输），切后台不丢 */
			markBpw6PpgSessionBusy(reason) {
				try {
					uni.setStorageSync('bpw6_ppg_busy', 1)
				} catch (e) {}
				this.setEmotionMeasureBusy(true, reason || 'BPW6 PPG会话')
			},
			clearBpw6PpgSessionBusyMark() {
				try {
					uni.removeStorageSync('bpw6_ppg_busy')
				} catch (e) {}
			},
			/** 是否已绑定 BPW1(30000) 或 BPW6(30001) */
			hasBoundBpw1OrBpw6() {
				if (this.deviceIdwatch || this.deviceIdwatch6) {
					return true
				}
				try {
					if (uni.getStorageSync('deviceIdwatch') || uni.getStorageSync('BPW6devicemac')) {
						return true
					}
					const list = uni.getStorageSync('lixianlist')
					if (Array.isArray(list) && list.some((row) => {
							const id = String(row && row.deviceModelId)
							return id === '30000' || id === '30001'
						})) {
						return true
					}
				} catch (e) {}
				return false
			},
			/**
			 * 空闲态按钮：未绑定 BPW1/BPW6 必须置灰；
			 * 已绑定且非测量/传输中才可点。测量中不改灰态。
			 */
			applyEmotionButtonIdleByBind(reason) {
				if (this.isEmotionMeasureBusySession()) {
					this.syncEmotionMeasureBusyFromStorage()
					return
				}
				if (!this.hasBoundBpw1OrBpw6()) {
					this.sleep_alertdisabled = true
					try {
						uni.setStorageSync('sleep_alertdisabled', true)
					} catch (e) {}
					return
				}
				this.sleep_alertdisabled = false
				try {
					uni.setStorageSync('sleep_alertdisabled', false)
				} catch (e2) {}
			},
			/** 标记血压后 PPG 会话（storage，切后台可恢复灰态） */
			markBpw6AfterBpPpgBusy(reason) {
				try {
					uni.setStorageSync('bpw6_after_bp_ppg', 1)
				} catch (e) {}
				this.markBpw6PpgSessionBusy(reason || 'BPW6血压后PPG')
			},
			clearBpw6AfterBpPpgBusyMark() {
				try {
					uni.removeStorageSync('bpw6_after_bp_ppg')
				} catch (e) {}
			},
			/** 定时调度写 storage 后同步页面按钮灰态（不弹窗） */
			onEmotionMeasureBusy(busy) {
				if (busy) {
					this.markBpw6PpgSessionBusy('EMOTION_MEASURE_BUSY')
					this.syncEmotionMeasureBusyFromStorage()
				} else if (!this.isEmotionMeasureBusySession()) {
					// 调度结束：有绑定才可点，无绑定仍灰
					this.applyEmotionButtonIdleByBind('EMOTION_MEASURE_BUSY结束')
				} else {
					// 仍有测量/传输会话：保持灰，勿被调度结束事件误清
					this.syncEmotionMeasureBusyFromStorage()
				}
			},
			/** 从 storage 同步按钮灰态（定时/血压后/传输只写 storage 时需拉回页面） */
			syncEmotionMeasureBusyFromStorage() {
				try {
					if (this.isEmotionMeasureBusySession()) {
						this.sleep_alertdisabled = true
						uni.setStorageSync('sleep_alertdisabled', true)
						return
					}
					// 无真实会话时，不再把孤立的 sleep_alertdisabled 同步回页面
					// （杀进程/传输中断后该标记常残留，会导致永久置灰）
				} catch (e) {}
			},
			/** 恢复情绪页「立即测量/定时测量」可点（仅成功/失败/中断显式调用） */
			restoreEmotionPageButtons(reason) {
				if (this.bpw6EmotionPpgTimer) {
					clearTimeout(this.bpw6EmotionPpgTimer)
					this.bpw6EmotionPpgTimer = null
				}
				if (this._bpw1CloudLoadingTimer) {
					clearTimeout(this._bpw1CloudLoadingTimer)
					this._bpw1CloudLoadingTimer = null
				}
				this.clearBpw1PpgTransferWatchdog(reason || 'restoreEmotion')
				if (typeof this.clearBpw1ImmediateStartWait === 'function') {
					this.clearBpw1ImmediateStartWait(reason || 'restoreEmotion')
				}
				this.bpw6EmotionPpgActive = false
				this.bpw6EmotionPpgStartedAt = 0
				this.bpw6PpgFinishing = false
				this.bpw6PpgTransferStarted = false
				this.bpw6CloudWaitStartedAt = 0
				this.setBpw6EmotionPpgPhase('')
				this.yalixueyatype = false
				this.immediateEmotionMeasure = false
				this.sleep_alertid = 0
				this.bpw1ImmediatePpgLaunchLock = false
				this.bpw1ImmediateCmdStarted = false
				this.bpw1PpgTransferActive = false
				this._bpw1AfterBpCmdAt = 0
				this._bpw1ImmediateCmdAt = 0
				this._bpw1AfterBpLaunching = false
				// 立即测量结束时清掉未完成的血压配对等待，避免残留 30s 超时抢跑血压后 PPG
				if (this.bpw1LiveBpHrFlushTimer) {
					clearTimeout(this.bpw1LiveBpHrFlushTimer)
					this.bpw1LiveBpHrFlushTimer = null
				}
				if (this._bpw1AfterBpPpgTimer) {
					clearTimeout(this._bpw1AfterBpPpgTimer)
					this._bpw1AfterBpPpgTimer = null
				}
				this.bpw1PendingLiveBp = null
				this.bpw1PendingBpCompanionHr = null
				this.bpw1AwaitingBpHrPair = false
				this.clearBpw6AfterBpPpgBusyMark()
				this.clearBpw6PpgSessionBusyMark()
				// 清测量态后：无 BPW 绑定仍保持灰，有绑定才可点
				this.applyEmotionButtonIdleByBind(reason || 'restoreEmotion')
				try {
					this.hideBpw6PpgLoading(true)
				} catch (e) {}
				try {
					uni.hideLoading()
				} catch (e2) {}
				// 熄屏/后台时 hideLoading 常无效，回前台再清
				this.bpw6NeedClearLoadingOnShow = true
			},
			/** 清除 BPW1 PPG 传输超时定时器（防止旧会话超时打断新会话） */
			clearBpw1PpgTransferWatchdog(reason) {
				if (this.watchtimer2) {
					clearInterval(this.watchtimer2)
					this.watchtimer2 = null
				}
				this._bpw1PpgTransferGen = (this._bpw1PpgTransferGen || 0) + 1
			},
			/** 是否处于 BPW1 情绪/压力/定时 PPG 会话（不含卡片测心率） */
			isBpw1ActivePpgSession() {
				if (this.sleep_alertid === 1 ||
					uni.getStorageSync('sendwatch') === 1 ||
					this.yalixueyatype === true ||
					this.immediateEmotionMeasure === true ||
					this.bpw1PpgTransferActive === true ||
					!!this.watchtimer2 ||
					!!this._bpw1AfterBpPpgTimer ||
					this._bpw1AfterBpLaunching === true) {
					return true
				}
				// 立即测量命令已发出但标记被误清：宽限期内仍视为会话，避免 Status01 被忽略不 ACK
				if (this.bpw1ImmediateCmdStarted || this.bpw1ImmediatePpgLaunchLock) {
					return true
				}
				const immediateAt = this._bpw1ImmediateCmdAt || 0
				if (immediateAt > 0 && Date.now() - immediateAt < 120000) {
					return true
				}
				// 血压后 PPG 命令已发 / 延迟启动中
				const afterBpAt = this._bpw1AfterBpCmdAt || 0
				if (afterBpAt > 0 && Date.now() - afterBpAt < 120000) {
					return true
				}
				return false
			},
			/**
			 * 清理「发了血压后/情绪命令但未真正传数」的残留标记。
			 * 避免 yalixueyatype/sleep_alertid/tooSoon 误挡下一次血压后 PPG。
			 * 注意：命令刚下发、尚未收到 Status01 的宽限期内不清理，避免重复下发。
			 */
			clearStaleBpw1PpgSessionMarks(reason) {
				const realTransfer = !!(this.immediateEmotionMeasure || this.bpw1PpgTransferActive ||
					this.bpw1ImmediatePpgLaunchLock || this.bpw1ImmediateCmdStarted || !!this.watchtimer2 ||
					!!this._bpw1AfterBpPpgTimer || this._bpw1AfterBpLaunching === true ||
					uni.getStorageSync('sendwatch') === 1 ||
					(this._bpw1ImmediateCmdAt && Date.now() - this._bpw1ImmediateCmdAt < 120000) ||
					(this._bpw1AfterBpCmdAt && Date.now() - this._bpw1AfterBpCmdAt < 120000))
				if (realTransfer) {
					return false
				}
				const cmdAt = this._bpw1AfterBpCmdAt || this._bpw1LastPpgAfterBpAt || 0
				// 下发后约 90 秒内视为测量窗口（含手表侧采集），不当事残留清掉
				if ((this.yalixueyatype || this.sleep_alertid === 1) && cmdAt > 0 &&
					Date.now() - cmdAt < 90000) {
					return false
				}
				let cleared = false
				if (this.yalixueyatype) {
					this.yalixueyatype = false
					cleared = true
				}
				if (this.sleep_alertid === 1) {
					this.sleep_alertid = 0
					cleared = true
				}
				// 防抖时间戳仅在过期后清掉，保留 tooSoon 防止短时间内重复下发
				if (this._bpw1LastPpgAfterBpAt && Date.now() - this._bpw1LastPpgAfterBpAt >= 120000) {
					this._bpw1LastPpgAfterBpAt = 0
					cleared = true
				}
				if (this._bpw1AfterBpCmdAt && Date.now() - this._bpw1AfterBpCmdAt >= 90000) {
					this._bpw1AfterBpCmdAt = 0
					cleared = true
				}
				return cleared
			},
			/**
			 * 实时血压后启 PPG（历史同步不启）。
			 * 合并成功或等心率超时后均可启；置灰用 launching 标记，勿提前置 yalixueyatype（否则 sendstartheartwatch 会误跳过下发）。
			 * 延迟 25 秒再下发 PPG 命令，避免与血压伴生心率窗口重叠错配。
			 */
			tryStartBpw1PpgAfterBp(reason, requireBlewatchIdForYali = true) {
				const that = this
				if (that.isBpw1HistorySyncing()) {
					console.log('【BPW1】历史同步中，不启血压后PPG', reason || '')
					return false
				}
				const yaliEnabled = uni.getStorageSync('yaliswitchHER') === true ||
					uni.getStorageSync('yaliswitchHER') === 'true'
				if (!yaliEnabled) {
					console.log('【BPW1】压力开关未开，不启血压后PPG', reason || '')
					return false
				}
				if (requireBlewatchIdForYali && that.isBpw1HistorySyncing()) {
					return false
				}
				that.clearStaleBpw1PpgSessionMarks('血压后PPG-' + (reason || ''))
				const alreadyPpg = that.immediateEmotionMeasure === true ||
					that.bpw1PpgTransferActive === true ||
					that.yalixueyatype === true ||
					that._bpw1AfterBpLaunching === true ||
					!!that._bpw1AfterBpPpgTimer ||
					!!that.watchtimer2 ||
					uni.getStorageSync('sendwatch') === 1
				const nowTs = Date.now()
				const tooSoon = that._bpw1LastPpgAfterBpAt &&
					(nowTs - that._bpw1LastPpgAfterBpAt < 120000)
				if (alreadyPpg || tooSoon) {
					console.log('【BPW1】跳过血压后PPG', {
						reason: reason || '',
						alreadyPpg,
						tooSoon,
						yalixueyatype: that.yalixueyatype,
						launching: that._bpw1AfterBpLaunching,
						bpw1PpgTransferActive: that.bpw1PpgTransferActive
					})
					return false
				}
				// 立刻置灰+启动中标记，避免延迟窗口被前后台误恢复；勿提前置 yalixueyatype
				that._bpw1AfterBpLaunching = true
				that.sleep_alertid = 1
				that.setEmotionMeasureBusy(true, 'BPW1血压后PPG-' + (reason || ''))
				that._bpw1AfterBpPpgTimer = setTimeout(() => {
					that._bpw1AfterBpPpgTimer = null
					if (that.isBpw1HistorySyncing()) {
						console.log('【BPW1】延迟启动前仍在历史同步，取消血压后PPG')
						that._bpw1AfterBpLaunching = false
						that.sleep_alertid = 0
						that.applyEmotionButtonIdleByBind('血压后PPG取消-历史同步')
						return
					}
					if (that.immediateEmotionMeasure || that.bpw1PpgTransferActive ||
						!!that.watchtimer2 || uni.getStorageSync('sendwatch') === 1) {
						console.log('【BPW1】延迟启动前已有真实PPG会话，取消')
						that._bpw1AfterBpLaunching = false
						return
					}
					that.bpw1CardHrOnly = false
					that._bpw1LastPpgAfterBpAt = Date.now()
					that._bpw1AfterBpCmdAt = Date.now()
					that.sendstartheartwatch(that.writeuuid, 1, 'after_bp')
					that.yalixueyatype = true
					that.sleep_alertid = 1
					that._bpw1AfterBpLaunching = false
					console.log('【BPW1】启动血压后PPG', reason || '')
				}, 25000)
				return true
			},
			/** PPG 进行中：禁止前后台触发 BLE 扫描重连（会中断传数/ACK） */
			shouldDeferBleReconnectForPpg() {
				// 含定时槽位已占位（sendwatch）但尚未 bpw6PpgMeasuring：勿 create/close 抢 GATT
				return !!(this.isBpw1ActivePpgSession() || this.hasLiveBpw1EmotionSession() ||
					this.bpw1ImmediatePpgLaunchLock ||
					this.hasLiveBpw6EmotionSession() || this.hasSilentBpw6PpgWork() ||
					this.bpw6PpgStartInProgress ||
					this.isEmotionMeasureBusySession())
			},
			/** 定时测量已占槽/下发中：首页回连仍可开 notify，但不要写绑定/校时/运动/历史 */
			shouldSkipBpw1InitWritesForScheduledMeasure() {
				try {
					if (hasQxBleLiveMeasureRuntime()) {
						return true
					}
					const sendwatch = uni.getStorageSync('sendwatch')
					if (sendwatch === 1 || sendwatch === '1') {
						return true
					}
					const scheduled = uni.getStorageSync('qx_ble_scheduled_measure')
					if (scheduled === 1 || scheduled === '1') {
						return true
					}
				} catch (e) {}
				return false
			},
			/**
			 * 回前台纠偏 BPW6「测量中」：
			 * 熄屏后定时器暂停、完成回调可能丢失、后台 hideLoading 可能无效。
			 * 立即测量文案严格按阶段：measuring→测量中；transferring→云端数据计算中。
			 * 切前后台不得跳阶段；仅成功/失败/中断才恢复按钮。
			 */
			reconcileBpw6PpgUiAfterForeground() {
				// 先清孤儿标记：未点立即测量却残留 bpw6_ppg_busy/phase 会导致误置灰
				this.clearOrphanBpw6EmotionBusyMarks('回前台')
				this.syncBpw6EmotionPpgPhaseFromStorage()
				this.syncEmotionMeasureBusyFromStorage()
				const emotionBusy = this.bpw6EmotionPpgActive || this.immediateEmotionMeasure ||
					this.sleep_alertid === 1
				const liveImmediate = this.hasLiveBpw6EmotionSession()
				const silentBusy = this.isEmotionMeasureBusySession() || this.hasSilentBpw6PpgWork()
				const deviceMeasuring = !!(u16proBLE && u16proBLE.state && u16proBLE.state.ppgMeasuring)
				const appMeasuring = !!this.bpw6PpgMeasuring
				const uploading = !!this.ppgUploadInProgress
				const finishing = !!this.bpw6PpgFinishing
				const transferring = !!this.bpw6PpgTransferStarted || finishing || uploading ||
					this.bpw6EmotionPpgPhase === 'transferring'
				const readingPpg = !!(u16proBLE && u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead()) ||
					!!(u16proBLE && u16proBLE.isPpgOperationInProgress && u16proBLE.isPpgOperationInProgress())
				const pendingAfterBp = !!this.bpw6PendingPpgAfterBp || !!this.bpw6PpgStartInProgress
				const phaseBusy = liveImmediate && (this.bpw6EmotionPpgPhase === 'measuring' ||
					this.bpw6EmotionPpgPhase === 'transferring')
				const stillWorking = deviceMeasuring || appMeasuring || uploading || finishing ||
					readingPpg || pendingAfterBp || (transferring && liveImmediate)
				const startedAt = this.bpw6EmotionPpgStartedAt || 0
				const elapsed = startedAt > 0 ? (Date.now() - startedAt) : 0
				const maxMs = 5 * 60 * 1000
				if (this.bpw6NeedClearLoadingOnShow && !emotionBusy && !stillWorking && !silentBusy &&
					!phaseBusy) {
					this.bpw6NeedClearLoadingOnShow = false
					try {
						uni.hideLoading()
					} catch (e) {}
					this.hideBpw6PpgLoading(true)
					return
				}
				// 真实立即测量会话：回前台保灰并重弹 loading
				if (liveImmediate && (emotionBusy || stillWorking || phaseBusy)) {
					this.markBpw6PpgSessionBusy('BPW6回前台保持置灰')
					const titleKey = this.getBpw6EmotionImmediateLoadingTitleKey({
						transferring: transferring && liveImmediate,
						finishing,
						uploading
					})
					this.refreshBpw6EmotionImmediateLoading(titleKey, 'reconcile')
					if (emotionBusy && startedAt > 0 && elapsed >= maxMs) {
						this.bpw6PpgFinishing = false
						this.restoreEmotionPageButtons('BPW6回前台墙钟超时恢复')
					}
					return
				}
				// 定时/血压后/BPW1：只保灰，绝不弹 BPW6「测量中/云端计算中」
				if ((silentBusy || this.hasLiveBpw1EmotionSession()) && !liveImmediate) {
					this.setEmotionMeasureBusy(true, '回前台非BPW6立即测量保持置灰')
					return
				}
				// 空闲：按绑定恢复可点
				this.applyEmotionButtonIdleByBind('回前台空闲')
			},
			/** 立即测量 loading 文案：仅真实进入传输/上传/云端计算后才显示「云端数据计算中」 */
			getBpw6EmotionImmediateLoadingTitleKey(flags = {}) {
				const transferring = !!flags.transferring || !!this.bpw6PpgTransferStarted ||
					!!flags.finishing || !!flags.uploading ||
					this.bpw6EmotionPpgPhase === 'transferring'
				return transferring ? '云端数据计算中' : '测量中'
			},
			/** BPW6：定时调度发起的 PPG 结束；立即情绪测量/血压后PPG 结束时也清 UI */
			endBpw6QxScheduledMeasureIfNeeded(reason) {
				const scheduled = uni.getStorageSync('qx_ble_scheduled_measure')
				const isScheduled = scheduled === 1 || scheduled === '1'
				if (isScheduled) {
					if (!uni.getStorageSync('BPW6devicemac')) {
						return
					}
					this.notifyQxScheduledMeasureEnd(reason || 'BPW6定时测量结束')
					return
				}
				// 仅 BPW6 立即测量会话；勿用 immediateEmotionMeasure/sleep_alertid（BPW1 共用）误清 BPW1
				if (this.bpw6EmotionPpgActive) {
					this.restoreEmotionPageButtons(reason || 'BPW6立即情绪测量结束')
					return
				}
				// 血压后 PPG：无弹窗，但需恢复按钮灰态（仅 BPW6 血压后标记/测量中）
				if (this.bpw6PpgMeasuring || this.bpw6PpgFinishing || this.bpw6PendingPpgAfterBp) {
					this.restoreEmotionPageButtons(reason || 'BPW6血压后PPG结束')
					return
				}
				try {
					const afterBp = uni.getStorageSync('bpw6_after_bp_ppg')
					if (afterBp === 1 || afterBp === '1') {
						this.restoreEmotionPageButtons(reason || 'BPW6血压后PPG结束')
					}
				} catch (e) {}
			},
			isPermissionTipShown() {
				const v = uni.getStorageSync("appQXTipShown")
				return v === 1 || v === '1' || v === true
			},
			shouldShowPermissionTip() {
				if (uni.getStorageSync("appQX") === "1") {
					return false
				}
				if (this.isPermissionTipShown()) {
					return false
				}
				return !uni.getStorageSync("appQX")
			},
			tryShowPermissionTip() {
				if (!this.shouldShowPermissionTip()) {
					return
				}
				this.$nextTick(() => {
					if (this.$refs.lnaypopup) {
						this.$refs.lnaypopup.open('top');
					} else {
						console.error("lnaypopup 引用未找到");
					}
				});
			},
			onPermissionTipChange(e) {
				if (!e || e.show !== false) {
					return
				}
				uni.setStorageSync("appQXTipShown", "1")
				this.tryRequestAppPermissions()
			},
			tryRequestAppPermissions() {
				if (!isDingweiEnabled()) {
					return
				}
				checkNotificationPermissions()
			},
			initPage() {
				let that = this
				// 先清孤儿 BPW6 会话标记，再按绑定/真实测量决定灰态
				that.clearOrphanBpw6EmotionBusyMarks('initPage')
				that.syncEmotionMeasureBusyFromStorage()
				if (!that.isEmotionMeasureBusySession()) {
					that.restoreEmotionPageButtons('initPage空闲恢复')
				} else {
					that.syncEmotionMeasureBusyFromStorage()
				}
				//获取保存的单位数据
				that.Unitlist()
				that.chuhsikg = uni.getStorageSync("danwei2") === 1 ? that.$t("英镑") : that.$t("千克");
				that.newweightKG = uni.getStorageSync("danwei2") === 1 ? that.$t("英镑") : that.$t("千克1");
				that.xueyehuilian = true
				that.Blood = uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa"
				that.tryShowPermissionTip()
				// PPG 传数中：禁止重置 queryDevicesDone / 拉设备列表重连，避免打断 BLE
				if (that.shouldDeferBleReconnectForPpg()) {
					return
				}
				isInChinaByIP().then(isInChina => {
					that.loact = isInChina ? "境内" : "境外";
					const token = uni.getStorageSync("token");
					if (!token) {
						uni.redirectTo({
							url: "/pages/login/login_land"
						});
						return;
					}
					that.lastWeightbishi = ""
					that.xueyabiaoshi = ""
					that.deviceList = []
					that.applyCachedCardList()
					that.queryDevicesDone = false // 立刻上锁
					that.getUserInfo()
				});
			},

			// 获取本地天气
			async getLocalWeather(deviceId, serviceId, writeuuid) {
				try {
					const result = await getGlobalLocalWeather();
					if (result.success) {
						this.weatherData = result.data;
						this.fromCache = result.fromCache || false;
						// 尝试获取分钟级降水
						if (this.weatherData && this.weatherData.location) {
							const {
								lat,
								lon
							} = this.weatherData.location;
							try {
								const rainData = await getMinutelyRain(lat, lon);
								this.minutelyRain = rainData;
							} catch (rainError) {
								console.log('分钟级降水获取失败', rainError);
							}
						}
						//7天天气
						const encoder = new WeatherForecastEncoder();
						const protocolData = encoder.encodeFromWeatherData(this.weatherData, {
							cmd: 0x05,
							version: 0x01,
							key: 0x01
						});
						//当天天气
						this.weatherDataID7 = encoder.getHexString()
						const buffer = protocolHelper.buildCurrentWeatherCommand(
							this.weatherData,
							this.weatherData.location
						);
						if (buffer) {
							const bytes = new Uint8Array(buffer);
							this.weatherDataID = protocolHelper.bytesToHex(bytes)
							setTimeout(() => {
								this.weather(deviceId, serviceId, writeuuid)
							}, 1000)
						} else {
							console.error('❌ 测试生成失败');
						}
					}
				} catch (e) {
					console.error('本地天气错误:', e);
				} finally {}
			},
			// 调用蓝牙连接js
			async initBluetooth(row) {
				this.bluetoothManager = new BluetoothManager();
				this.openBluetoothAdapter(row)
			},
			isDeviceBindingPageActive() {
				const gt = Vue.prototype.$globalTimers;
				if (gt && gt.deviceBindingActive) return true;
				return !!uni.getStorageSync('deviceBindingInProgress');
			},
			onDeviceBindPageActive() {
				this.clearBpw6ReconnectTimersOnly();
				this.stopBpw6BleStatusPoll();
				if (this.bpw6BleConnectTimer) {
					clearTimeout(this.bpw6BleConnectTimer);
					this.bpw6BleConnectTimer = null;
				}
				const gt = Vue.prototype.$globalTimers;
				if (gt && gt.heartbeatInterval) {
					clearInterval(gt.heartbeatInterval);
					gt.heartbeatInterval = null;
				}
			},
			onDeviceBindPageInactive() {
				if (this.bpw6BleMonitorActive && uni.getStorageSync('BPW6devicemac') &&
					!this.isDeviceBindingPageActive()) {
					this.startBpw6BleStatusPoll();
				}
			},
			//初始化并搜索蓝牙
			isBpw6ReconnectBlocked(mac) {
				if (!mac) return false;
				if (this.isDeviceBindingPageActive()) return true;
				if (this.isBpw6Unbinding(mac)) return true;
				const norm = this.normalizeBpw6BleDeviceId(mac);
				const unboundMac = uni.getStorageSync('BPW6unboundMac');
				if (unboundMac && this.normalizeBpw6BleDeviceId(unboundMac) === norm) {
					return true;
				}
				const gt = Vue.prototype.$globalTimers;
				if (!gt || !gt.bpw6UnbindBlockedMac) return false;
				if (this.normalizeBpw6BleDeviceId(gt.bpw6UnbindBlockedMac) !== norm) {
					return false;
				}
				return Date.now() < (gt.bpw6UnbindBlockedUntil || 0);
			},
			sendBpw6WatchUnbindCommand(mac) {
				return new Promise((resolve) => {
					if (!mac) {
						resolve();
						return;
					}
					uni.writeBLECharacteristicValue({
						deviceId: mac,
						serviceId: BPW6SERVICE,
						characteristicId: BPW6WRITE,
						writeType: 'writeNoResponse',
						value: this.toArrayBuffer('ff66660000000000000000000000000000cb'),
						success(res) {},
						fail(err) {},
						complete: () => resolve()
					});
				});
			},
			disableBpw6BleNotify(mac) {
				return new Promise((resolve) => {
					if (!mac) {
						resolve();
						return;
					}
					uni.notifyBLECharacteristicValueChange({
						deviceId: mac,
						serviceId: BPW6SERVICE,
						characteristicId: BPW6NOTIFY,
						state: false,
						complete: () => resolve()
					});
				});
			},
			removeMacFromStoredDeviceList(mac) {
				const norm = this.normalizeBpw6BleDeviceId(mac);
				if (!norm) return;
				const list = uni.getStorageSync('deviceList');
				if (!Array.isArray(list)) return;
				const next = list.filter((item) => this.normalizeBpw6BleDeviceId(item) !== norm);
				if (next.length === 0) {
					uni.removeStorageSync('deviceList');
				} else {
					uni.setStorageSync('deviceList', next);
				}
			},
			resetU16ProBleSession(mac) {
				if (!u16proBLE) return;
				const norm = this.normalizeBpw6BleDeviceId(mac);
				if (u16proBLE.deviceId && this.normalizeBpw6BleDeviceId(u16proBLE.deviceId) === norm) {
					u16proBLE.isConnected = false;
					u16proBLE.isNotifying = false;
					u16proBLE.deviceId = '';
				}
				u16proBLE.resetBcServiceState();
			},
			async teardownBpw6BleOnUnbind(mac) {
				if (!mac) return;
				// await this.sendBpw6WatchUnbindCommand(mac);
				await new Promise((resolve) => setTimeout(resolve, 300));
				await this.disableBpw6BleNotify(mac);
				this.resetU16ProBleSession(mac);
				try {
					await this.disconnectAll(mac);
				} catch (e) {}
				// #ifdef APP-PLUS
				await new Promise((resolve) => {
					try {
						const plugin = uni.requireNativePlugin('ThirdSdkPlugin-ThirdSdkModule');
						if (plugin && typeof plugin.disconnectBle === 'function') {
							plugin.disconnectBle({
								mac
							}, (res) => {
								resolve();
							});
							return;
						}
					} catch (e) {}
					resolve();
				});
				// #endif
				await new Promise((resolve) => {
					uni.closeBLEConnection({
						deviceId: mac,
						complete: () => {
							resolve();
						}
					});
				});
			},
			clearBpw6ReconnectTimersOnly() {
				if (this.BPW6intervalTimer) {
					clearInterval(this.BPW6intervalTimer);
					this.BPW6intervalTimer = null;
				}
				const gt = Vue.prototype.$globalTimers;
				if (gt && gt.BPW6intervalTimer) {
					clearInterval(gt.BPW6intervalTimer);
					gt.BPW6intervalTimer = null;
				}
				this.stopBpw6BgOutOfRangeReconnect();
				this.cancelBpw6BlePendingWork();
			},
			clearAllReconnectTimers() {
				const gt = Vue.prototype.$globalTimers;
				if (gt && gt.heartbeatInterval) {
					clearInterval(gt.heartbeatInterval);
					gt.heartbeatInterval = null;
				}
				if (this.BPW6intervalTimer) {
					clearInterval(this.BPW6intervalTimer);
					this.BPW6intervalTimer = null;
				}
				if (gt && gt.BPW6intervalTimer) {
					clearInterval(gt.BPW6intervalTimer);
					gt.BPW6intervalTimer = null;
				}
				this.stopBpw6BgOutOfRangeReconnect();
				this.cancelBpw6BlePendingWork();
			},
			setBpw6ReconnectTimer(timer) {
				if (this.BPW6intervalTimer) {
					clearInterval(this.BPW6intervalTimer);
				}
				if (Vue.prototype.$globalTimers && Vue.prototype.$globalTimers.BPW6intervalTimer) {
					clearInterval(Vue.prototype.$globalTimers.BPW6intervalTimer);
				}
				this.BPW6intervalTimer = timer;
				if (Vue.prototype.$globalTimers) {
					Vue.prototype.$globalTimers.BPW6intervalTimer = timer;
				}
			},
			/** 停止「仅后台超距」独立回连（不影响 BPW6intervalTimer / 前台回连） */
			stopBpw6BgOutOfRangeReconnect() {
				this._bpw6BgNativeLoopActive = false;
				this.clearBpw6NativeDelayed('reconnectLoop');
				this.clearBpw6NativeDelayed('btToggleStart');
				this.clearBpw6NativeDelayed('btToggleAfterClose');
				this.clearBpw6NativeDelayed('btToggleCloseFallback');
				this.clearBpw6NativeDelayed('alreadyRetry');
				this.clearBpw6NativeDelayed('alreadyRetryFallback');
				this.clearBpw6NativeDelayed('fgAdapterOnReconnect');
				this.clearBpw6NativeDelayed('reconnectQuick');
				const t = this.bpw6BgOutOfRangeReconnectTimer;
				if (t != null && typeof t === 'number') {
					clearInterval(t);
				}
				this.bpw6BgOutOfRangeReconnectTimer = null;
				this.bpw6BgOutOfRangeReconnectBusy = false;
				this.bpw6BgReconnectArmedAt = 0;
				if (this.bpw6BgBtToggleStartTimer) {
					clearTimeout(this.bpw6BgBtToggleStartTimer);
					this.bpw6BgBtToggleStartTimer = null;
				}
			},
			/** 后台 JS setTimeout/setInterval 常被冻结，延迟任务改走 Android Handler */
			postBpw6NativeDelayed(key, fn, delayMs) {
				this.clearBpw6NativeDelayed(key);
				const run = () => {
					// 执行后清掉句柄，避免 isBpw6BgReconnectArmed 一直为 true 卡住
					try {
						const map = this._bpw6NativeDelayed;
						if (map && map[key]) delete map[key];
					} catch (e0) {}
					try {
						fn && fn();
					} catch (e) {}
				};
				// #ifdef APP-PLUS
				try {
					if (uni.getSystemInfoSync().platform === 'android') {
						const Handler = plus.android.importClass('android.os.Handler');
						const Looper = plus.android.importClass('android.os.Looper');
						const handler = new Handler(Looper.getMainLooper());
						const runnable = plus.android.implements('java.lang.Runnable', {
							run: run
						});
						handler.postDelayed(runnable, Math.max(0, delayMs || 0));
						if (!this._bpw6NativeDelayed) this._bpw6NativeDelayed = {};
						this._bpw6NativeDelayed[key] = {
							handler,
							runnable,
							jsTimer: null
						};
						return;
					}
				} catch (e) {}
				// #endif
				const jsTimer = setTimeout(run, Math.max(0, delayMs || 0));
				if (!this._bpw6NativeDelayed) this._bpw6NativeDelayed = {};
				this._bpw6NativeDelayed[key] = {
					handler: null,
					runnable: null,
					jsTimer
				};
			},
			clearBpw6NativeDelayed(key) {
				const map = this._bpw6NativeDelayed;
				if (!map || !map[key]) return;
				const item = map[key];
				try {
					if (item.handler && item.runnable) {
						item.handler.removeCallbacks(item.runnable);
					}
				} catch (e) {}
				if (item.jsTimer) {
					clearTimeout(item.jsTimer);
				}
				delete map[key];
			},
			stopBpw6BgBtOnWatchdog() {
				this._bpw6BgBtOnWatchdogActive = false;
				this.clearBpw6NativeDelayed('btOnWatchdog');
			},
			/** 等蓝牙再开：用原生 Handler 轮询，不依赖后台 JS 定时器 */
			armBpw6BgBtOnWatchdog() {
				if (isQxBleAppInForeground()) return;
				if (!this.hasBpw6BgNeedBtReconnect()) return;
				// 每次标记都重新武装，避免上一轮 tick 丢失后永远不巡检
				this.stopBpw6BgBtOnWatchdog();
				this._bpw6BgBtOnWatchdogActive = true;
				const tick = () => {
					if (!this._bpw6BgBtOnWatchdogActive) return;
					if (isQxBleAppInForeground() || !this.hasBpw6BgNeedBtReconnect()) {
						this.stopBpw6BgBtOnWatchdog();
						return;
					}
					this.acquireBpw6BgReconnectWakeLock();
					this.triggerBpw6BgBtReconnectIfNeeded('native-watchdog');
					if (!this._bpw6BgBtOnWatchdogActive) return;
					if (!this.hasBpw6BgNeedBtReconnect()) {
						this.stopBpw6BgBtOnWatchdog();
						return;
					}
					this.postBpw6NativeDelayed('btOnWatchdog', tick, 2000);
				};
				this.postBpw6NativeDelayed('btOnWatchdog', tick, 800);
			},
			acquireBpw6BgReconnectWakeLock() {
				// #ifdef APP-PLUS
				try {
					const plugin = uni.requireNativePlugin('ThirdSdkPlugin-ThirdSdkModule');
					if (plugin && typeof plugin.acquireWakeLock === 'function') {
						plugin.acquireWakeLock({}, () => {});
					}
				} catch (e) {}
				try {
					ensureQxBleKeepAliveForBackground();
				} catch (e2) {}
				// #endif
			},
			markBpw6BgNeedBtReconnect(on) {
				this.bpw6BgNeedReconnectAfterAdapterOn = !!on;
				try {
					if (on) {
						uni.setStorageSync('bpw6_bg_need_bt_reconnect', 1);
					} else {
						uni.removeStorageSync('bpw6_bg_need_bt_reconnect');
					}
				} catch (e) {}
				if (on) {
					this.acquireBpw6BgReconnectWakeLock();
					this.armBpw6BgBtOnWatchdog();
					// 后台 Handler/广播常冻：挂原生闹钟唤醒探测蓝牙是否已开
					try {
						keepAliveManager.setBpw6BgBtReconnectAlarm(5);
					} catch (e2) {}
				} else {
					this.stopBpw6BgBtOnWatchdog();
					try {
						keepAliveManager.clearBpw6BgBtReconnectAlarm();
					} catch (e3) {}
				}
			},
			hasBpw6BgNeedBtReconnect() {
				if (this.bpw6BgNeedReconnectAfterAdapterOn) return true;
				try {
					const v = uni.getStorageSync('bpw6_bg_need_bt_reconnect');
					return v === 1 || v === '1' || v === true;
				} catch (e) {
					return false;
				}
			},
			isBpw6BgReconnectArmed() {
				return !!(this._bpw6BgNativeLoopActive || this.bpw6BgOutOfRangeReconnectTimer ||
					(this._bpw6NativeDelayed && (this._bpw6NativeDelayed.btToggleStart || this
						._bpw6NativeDelayed.btToggleAfterClose || this._bpw6NativeDelayed
						.btToggleCloseFallback)));
			},
			/** 回连准备卡住（close 不回调等）时允许 watchdog 重启 */
			resetBpw6BgReconnectIfStalled(maxMs) {
				if (!this.isBpw6BgReconnectArmed()) return false;
				const armedAt = this.bpw6BgReconnectArmedAt || 0;
				if (!armedAt || Date.now() - armedAt < (maxMs || 6000)) return false;
				this.stopBpw6BgOutOfRangeReconnect();
				return true;
			},
			/** Android 原生：蓝牙是否已开启（比 openBluetoothAdapter 更准） */
			isAndroidBluetoothEnabled() {
				// #ifdef APP-PLUS
				try {
					if (uni.getSystemInfoSync().platform !== 'android') return null;
					const BluetoothAdapter = plus.android.importClass('android.bluetooth.BluetoothAdapter');
					const adapter = BluetoothAdapter.getDefaultAdapter();
					if (!adapter) return false;
					return !!adapter.isEnabled();
				} catch (e) {
					return null;
				}
				// #endif
				return null;
			},
			/**
			 * 后台收不到 uni available:true 时，靠原生蓝牙开关广播唤醒回连。
			 * 仅 BPW6 使用，不影响其它设备。
			 */
			registerBpw6NativeBtReceiver() {
				// #ifdef APP-PLUS
				if (this._bpw6NativeBtReceiver) return;
				try {
					if (uni.getSystemInfoSync().platform !== 'android') return;
					const main = plus.android.runtimeMainActivity();
					const IntentFilter = plus.android.importClass('android.content.IntentFilter');
					const filter = new IntentFilter('android.bluetooth.adapter.action.STATE_CHANGED');
					const self = this;
					const receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
						onReceive: function(context, intent) {
							try {
								plus.android.importClass(intent);
								const action = intent.getAction();
								if (action !== 'android.bluetooth.adapter.action.STATE_CHANGED') return;
								const state = intent.getIntExtra('android.bluetooth.adapter.extra.STATE', -1);
								// 10 OFF, 11 TURNING_ON, 12 ON, 13 TURNING_OFF
								// 禁止 setTimeout：后台 JS 定时器常冻，广播里必须同步驱动
								if (state === 10 || state === 13) {
									self.onBpw6NativeBtStateChanged(false);
								} else if (state === 12) {
									self.onBpw6NativeBtStateChanged(true);
								}
							} catch (e) {}
						}
					});
					try {
						// Android 13+：RECEIVER_EXPORTED=2
						main.registerReceiver(receiver, filter, 2);
					} catch (e2) {
						main.registerReceiver(receiver, filter);
					}
					this._bpw6NativeBtReceiver = receiver;
				} catch (e) {}
				// #endif
			},
			unregisterBpw6NativeBtReceiver() {
				// #ifdef APP-PLUS
				if (!this._bpw6NativeBtReceiver) return;
				try {
					const main = plus.android.runtimeMainActivity();
					main.unregisterReceiver(this._bpw6NativeBtReceiver);
				} catch (e) {}
				this._bpw6NativeBtReceiver = null;
				// #endif
			},
			onBpw6NativeBtStateChanged(enabled) {
				if (!uni.getStorageSync('BPW6devicemac')) return;
				if (!enabled) {
					if (isQxBleAppInForeground()) return;
					// 广播偶发假关闭：再核一次原生开关
					if (this.isAndroidBluetoothEnabled() !== false) {
						return;
					}
					this.stopBpw6BgOutOfRangeReconnect();
					this.markBpw6BgNeedBtReconnect(true);
					this.bpw6BleLastConnected = false;
					this.bpw6BgFromBtToggleReconnect = false;
					this.bpw6BgFakeAlreadyRetries = 0;
					this.cancelBpw6BlePendingWork();
					try {
						markQxBleBpw6AdapterDown();
					} catch (e) {}
					if (this.BPW6intervalTimer) {
						clearInterval(this.BPW6intervalTimer);
						this.BPW6intervalTimer = null;
					}
					return;
				}
				// 蓝牙打开
				if (!this.hasBpw6BgNeedBtReconnect() && !this.isBpw6BgReconnectArmed()) {
					return;
				}
				if (isQxBleAppInForeground()) {
					// 回前台交还前台回连；待回连标记留给 onShow 清理
					return;
				}
				if (this.shouldDeferBleReconnectForPpg()) {
					return;
				}
				this.acquireBpw6BgReconnectWakeLock();
				// 成功前保留待回连标记，避免 close 不回调导致彻底停摆
				this.startBpw6BgOutOfRangeReconnect('adapter-on-bt-toggle');
			},
			triggerBpw6BgBtReconnectIfNeeded(source) {
				if (isQxBleAppInForeground()) return false;
				if (!this.hasBpw6BgNeedBtReconnect()) return false;
				if (!uni.getStorageSync('BPW6devicemac')) return false;
				if (this.shouldDeferBleReconnectForPpg()) return false;
				if (this.isBpw6BgReconnectArmed()) {
					this.resetBpw6BgReconnectIfStalled(6000);
					if (this.isBpw6BgReconnectArmed()) return true;
				}
				const enabled = this.isAndroidBluetoothEnabled();
				if (enabled === false) return false;
				if (enabled === true) {
					this.acquireBpw6BgReconnectWakeLock();
					this.startBpw6BgOutOfRangeReconnect('adapter-on-bt-toggle');
					return true;
				}
				// 无法读原生状态时再试 openBluetoothAdapter
				if (typeof uni.openBluetoothAdapter === 'function') {
					uni.openBluetoothAdapter({
						success: () => {
							if (isQxBleAppInForeground()) return;
							if (!this.hasBpw6BgNeedBtReconnect()) return;
							this.acquireBpw6BgReconnectWakeLock();
							this.startBpw6BgOutOfRangeReconnect('adapter-on-bt-toggle');
						},
						fail: () => {}
					});
				}
				return false;
			},
			/** 仅 GATT 断连 / 后台蓝牙开关恢复 / 后台列表漏报探测 才启后台静默回连 */
			shouldStartBpw6BgOutOfRangeReconnect(reason) {
				const r = String(reason || '');
				if (!r) return false;
				if (r.indexOf('openBluetoothAdapter') >= 0) return false;
				if (r.indexOf('adapter-off') >= 0) return false;
				if (r.indexOf('adapter-unavailable') >= 0) return false;
				// getConnected*  alone 不可信；改由 bg-poll-miss 显式触发
				if (r.indexOf('getConnected') >= 0) return false;
				if (r.indexOf('adapter-on-bt-toggle') >= 0) return true;
				if (r.indexOf('bg-poll-miss') >= 0) return true;
				return r.indexOf('onBLEConnectionStateChange') >= 0 || r.indexOf('bg-disconnect') >= 0;
			},
			/**
			 * qxBle / 保活发出的回连请求：已绑定则前后台都直连 MAC，不走 HTTP queryDevices。
			 * PPG 进行中跳过，避免打断定时/立即测量。
			 */
			onBpw6EnsureReconnect(payload) {
				const mac = (payload && payload.deviceId) || uni.getStorageSync('BPW6devicemac') || '';
				if (!mac || !uni.getStorageSync('BPW6devicemac')) return;
				if (this.isDeviceBindingPageActive() || this.isBpw6Unbinding(mac)) return;
				if (this.shouldDeferBleReconnectForPpg()) {
					return;
				}
				const reason = (payload && payload.reason) || 'BPW6_ENSURE_RECONNECT';
				if (isQxBleAppInForeground()) {
					this.startBpw6ForegroundDirectReconnect(reason);
				} else {
					this.acquireBpw6BgReconnectWakeLock();
					this.startBpw6BgOutOfRangeReconnect(
						reason.indexOf('adapter-on') >= 0 ? reason : 'bg-disconnect');
				}
			},
			/**
			 * 前台快速回连：直连已绑定 MAC，跳过 queryDevices 网络往返。
			 */
			startBpw6ForegroundDirectReconnect(reason) {
				if (!isQxBleAppInForeground()) return;
				const mac = uni.getStorageSync('BPW6devicemac');
				if (!mac) return;
				if (this.isDeviceBindingPageActive() || this.isBpw6Unbinding(mac)) return;
				if (this.shouldDeferBleReconnectForPpg()) return;
				// 蓝牙仍关着时不要狂打 create
				const r = String(reason || '');
				if (r.indexOf('adapter-off') >= 0 || r.indexOf('adapter-unavailable') >= 0) {
					this.bpw6FgNeedReconnectAfterAdapterOn = true;
					return;
				}
				if (this.isAndroidBluetoothEnabled() === false) {
					this.bpw6FgNeedReconnectAfterAdapterOn = true;
					return;
				}
				this.bpw6FgNeedReconnectAfterAdapterOn = false;
				// adapter 刚恢复：允许立刻 create，不受上一轮节流挡住
				if (r.indexOf('adapter-on') >= 0) {
					this.bpw6BleConnecting = false;
					this.bpw6BleLastConnectAt = 0;
				}
				const tick = () => {
					if (!isQxBleAppInForeground()) return;
					if (this.shouldDeferBleReconnectForPpg()) return;
					if (this.isAndroidBluetoothEnabled() === false) return;
					const m = uni.getStorageSync('BPW6devicemac');
					if (!m) {
						this.clearBpw6ReconnectTimersOnly();
						return;
					}
					if (this.bpw6BleLastConnected && this.acktypes6 === 1) {
						this.clearBpw6ReconnectTimersOnly();
						return;
					}
					this.BLEConnection(m, uni.getStorageSync('BPW6deviceSn') || '');
				};
				tick();
				if (!this.BPW6intervalTimer) {
					this.setBpw6ReconnectTimer(setInterval(tick, 1000));
				}
			},
			/** 原生 Handler 循环重试（后台 JS setInterval 不可靠） */
			armBpw6BgReconnectNativeLoop() {
				if (isQxBleAppInForeground()) return;
				this._bpw6BgNativeLoopActive = true;
				this.bpw6BgReconnectArmedAt = Date.now();
				// 兼容旧判断：非空表示「回连中」（勿用数字 interval id，避免 clearInterval 误伤）
				if (!this.bpw6BgOutOfRangeReconnectTimer) {
					this.bpw6BgOutOfRangeReconnectTimer = 'native-loop';
				}
				const tick = () => {
					if (!this._bpw6BgNativeLoopActive) return;
					if (isQxBleAppInForeground()) {
						this.stopBpw6BgOutOfRangeReconnect();
						return;
					}
					this.tryBpw6BgOutOfRangeReconnectOnce();
					if (!this._bpw6BgNativeLoopActive) return;
					this.postBpw6NativeDelayed('reconnectLoop', tick, 800);
				};
				this.tryBpw6BgOutOfRangeReconnectOnce();
				this.postBpw6NativeDelayed('reconnectLoop', tick, 800);
			},
			/**
			 * 仅处理：App 在后台时 GATT 超距断开，或后台关蓝牙再开后的静默回连。
			 * 不改展示态、不走 queryDevices/前台断开清理。
			 */
			startBpw6BgOutOfRangeReconnect(reason) {
				if (isQxBleAppInForeground()) return;
				const mac = uni.getStorageSync('BPW6devicemac');
				if (!mac) return;
				if (this.isDeviceBindingPageActive() || this.isBpw6Unbinding(mac)) return;
				if (this.shouldDeferBleReconnectForPpg()) return;
				// 蓝牙关着时不要 create（必 10001/10012，拖慢真正恢复后的回连）
				if (this.isAndroidBluetoothEnabled() === false &&
					String(reason || '').indexOf('adapter-on') < 0) {
					return;
				}
				const r = String(reason || '');
				const isAdapterResume = r.indexOf('adapter-on') >= 0;
				const fromBtToggle = r.indexOf('adapter-on-bt-toggle') >= 0;
				// 已在回连中
				if (this.isBpw6BgReconnectArmed()) {
					if (isAdapterResume) {
						// 蓝牙刚开：丢掉 close 等待，立刻进入 create
						this.clearBpw6NativeDelayed('btToggleStart');
						this.clearBpw6NativeDelayed('btToggleAfterClose');
						this.clearBpw6NativeDelayed('btToggleCloseFallback');
						this.bpw6BgFromBtToggleReconnect = true;
						this.bpw6BgFakeAlreadyRetries = 0;
						this.bpw6BgReconnectArmedAt = Date.now();
						this.bpw6BgOutOfRangeReconnectBusy = false;
						if (!this._bpw6BgNativeLoopActive) {
							this.armBpw6BgReconnectNativeLoop();
						} else {
							this.tryBpw6BgOutOfRangeReconnectOnce();
						}
						return;
					}
					if (this.resetBpw6BgReconnectIfStalled(6000)) {
						// fall through 重新启动
					} else {
						return;
					}
				}
				if (!this.shouldStartBpw6BgOutOfRangeReconnect(reason)) {
					return;
				}
				this.acquireBpw6BgReconnectWakeLock();
				this.bpw6BgReconnectArmedAt = Date.now();
				const armTimer = () => {
					if (isQxBleAppInForeground()) return;
					if (this._bpw6BgNativeLoopActive) {
						this.tryBpw6BgOutOfRangeReconnectOnce();
						return;
					}
					this.armBpw6BgReconnectNativeLoop();
				};
				// 后台开蓝牙：短等协议栈后直接 create（先 close 易导致 10012 空等 8s）
				if (fromBtToggle) {
					this.bpw6BgFromBtToggleReconnect = true;
					this.bpw6BgFakeAlreadyRetries = 0;
					this.postBpw6NativeDelayed('btToggleStart', armTimer, 150);
					return;
				}
				armTimer();
			},
			tryBpw6BgOutOfRangeReconnectOnce() {
				if (isQxBleAppInForeground()) {
					this.stopBpw6BgOutOfRangeReconnect();
					return;
				}
				const mac = uni.getStorageSync('BPW6devicemac');
				if (!mac) {
					this.stopBpw6BgOutOfRangeReconnect();
					return;
				}
				if (this.isDeviceBindingPageActive() || this.isBpw6Unbinding(mac)) return;
				if (this.shouldDeferBleReconnectForPpg()) return;
				if (this.isAndroidBluetoothEnabled() === false) {
					return;
				}
				if (this.bpw6BgOutOfRangeReconnectBusy) return;
				const that = this;
				const sn = uni.getStorageSync('BPW6deviceSn') || '';
				const finishBusy = () => {
					that.bpw6BgOutOfRangeReconnectBusy = false;
				};
				const doCreate = () => {
					if (typeof uni.createBLEConnection !== 'function') {
						finishBusy();
						return;
					}
					// 刷新活跃时间，避免成功前被 stall 误重置
					that.bpw6BgReconnectArmedAt = Date.now();
					uni.createBLEConnection({
						deviceId: mac,
						timeout: 8000,
						success: () => {
							finishBusy();
							that.bpw6BleLastConnected = true;
							that.markBpw6BgNeedBtReconnect(false);
							that.bpw6BgFromBtToggleReconnect = false;
							that.bpw6BgFakeAlreadyRetries = 0;
							that.registerBpw6BleConnectionMonitor();
							try {
								notifyQxBleWatchConnectionState(true, mac);
							} catch (e) {}
							that.stopBpw6BgOutOfRangeReconnect();
							// 已完成过连接后初始化：勿再拉特征值（后台空列表误触发回连时会刷屏同步）
							if (that.acktypes6 === 1) {
								return;
							}
							that.bpw6PostConnectSetupUntil = Math.max(that.bpw6PostConnectSetupUntil || 0,
								Date.now() + 14000);
							that.scheduleBpw6GetCharacteristics(mac, sn, 800);
						},
						fail: (err) => {
							finishBusy();
							const msg = String((err && err.errMsg) || '');
							const code = err && (err.errCode != null ? err.errCode : err.code);
							const already = code === -1 || msg.indexOf('already') >= 0;
							if (already) {
								// 关蓝牙后再开常见假 already：强制断开后继续探测
								if (that.bpw6BgFromBtToggleReconnect) {
									that.bpw6BgFakeAlreadyRetries = (that.bpw6BgFakeAlreadyRetries || 0) +
										1;
									if (that.bpw6BgFakeAlreadyRetries <= 4) {
										let done = false;
										const retry = () => {
											if (done) return;
											done = true;
											that.clearBpw6NativeDelayed('alreadyRetryFallback');
											that.postBpw6NativeDelayed('alreadyRetry', () => {
												that.tryBpw6BgOutOfRangeReconnectOnce();
											}, 300);
										};
										if (typeof uni.closeBLEConnection === 'function') {
											uni.closeBLEConnection({
												deviceId: mac,
												complete: retry
											});
											that.postBpw6NativeDelayed('alreadyRetryFallback', retry,
												500);
										} else {
											retry();
										}
										return;
									}
									that.bpw6BgFakeAlreadyRetries = 0;
									return;
								}
								that.bpw6BleLastConnected = true;
								that.markBpw6BgNeedBtReconnect(false);
								try {
									notifyQxBleWatchConnectionState(true, mac);
								} catch (e2) {}
								that.stopBpw6BgOutOfRangeReconnect();
								if (that.acktypes6 !== 1 && !that.shouldDeferBleReconnectForPpg()) {
									that.bpw6PostConnectSetupUntil = Math.max(
										that.bpw6PostConnectSetupUntil || 0, Date.now() + 14000);
									that.scheduleBpw6GetCharacteristics(mac, sn, 800);
								}
								return;
							}
							// 超时后尽快再试，不要空等整轮 loop
							if (code === 10012 || code === 10001) {
								that.postBpw6NativeDelayed('reconnectQuick', () => {
									if (!that._bpw6BgNativeLoopActive) return;
									that.tryBpw6BgOutOfRangeReconnectOnce();
								}, 400);
							}
						}
					});
				};
				this.bpw6BgOutOfRangeReconnectBusy = true;
				if (typeof uni.openBluetoothAdapter === 'function') {
					uni.openBluetoothAdapter({
						success: doCreate,
						fail: (err) => {
							finishBusy();
							const code = err && (err.errCode != null ? err.errCode : err.code);
							if (code === 10001) {
								// 适配器不可用时停掉空转，等 available:true / watchdog
								that.stopBpw6BgOutOfRangeReconnect();
							}
						}
					});
				} else {
					doCreate();
				}
			},
			cancelBpw6BlePendingWork() {
				if (this.bpw6BleConnectTimer) {
					clearTimeout(this.bpw6BleConnectTimer);
					clearInterval(this.bpw6BleConnectTimer);
					this.bpw6BleConnectTimer = null;
				}
				if (this.bpw6BleCharacteristicsTimer) {
					clearTimeout(this.bpw6BleCharacteristicsTimer);
					this.bpw6BleCharacteristicsTimer = null;
				}
				this.clearBpw6NativeDelayed('getCharacteristics');
				this.bpw6BleConnecting = false;
			},
			isBleAlreadyDisconnectedError(err) {
				if (!err) return false;
				const code = err.errCode != null ? err.errCode : err.code;
				if (code === 10004 || code === 10006) return true;
				const msg = err.errMsg ? String(err.errMsg) : '';
				return msg.indexOf('no connection') !== -1 || msg.indexOf('未连接') !== -1;
			},
			closeBpw6BleConnection(mac) {
				if (!mac) return;
				const that = this;
				uni.closeBLEConnection({
					deviceId: mac,
					success() {},
					fail(err) {
						if (that.isBleAlreadyDisconnectedError(err)) {
							return;
						}
					}
				});
			},
			scheduleBpw6GetCharacteristics(deviceId, deviceSn, delayMs) {
				const that = this;
				if (that.bpw6BleCharacteristicsTimer) {
					clearTimeout(that.bpw6BleCharacteristicsTimer);
					that.bpw6BleCharacteristicsTimer = null;
				}
				that.clearBpw6NativeDelayed('getCharacteristics');
				const run = () => {
					that.bpw6BleCharacteristicsTimer = null;
					// 立即测量启动/测量中勿反复 getCharacteristics/重连，否则主链路抢占导致 PPG status=0
					if ((u16proBLE.isPpgOperationInProgress && u16proBLE.isPpgOperationInProgress()) ||
						that.bpw6PpgStartInProgress || that.bpw6EmotionPpgActive) {
						that.scheduleBpw6GetCharacteristics(deviceId, deviceSn, 3000)
						return
					}
					that.getBLEDeviceCharacteristics6(deviceId, BPW6SERVICE, deviceSn);
				};
				// 后台 setTimeout 常冻：静默回连后必须用原生 Handler 拉特征值
				if (!isQxBleAppInForeground()) {
					that.postBpw6NativeDelayed('getCharacteristics', run, delayMs);
					return;
				}
				that.bpw6BleCharacteristicsTimer = setTimeout(run, delayMs);
			},
			async openBluetoothAdapter(row) {
				let that = this
				if (row.deviceModelId === "30001" && that.isDeviceBindingPageActive()) {
					return;
				}
				uni.openBluetoothAdapter({
					success(openBluetoothAdapter) {
						// 定时搜索BLE蓝牙设备
						if (row.deviceModelId === "30001") {
							uni.setStorageSync("BPW6deviceSn", row.deviceSn)
							uni.setStorageSync("BPW6devicemac", row.mac)
							that.deviceIdwatch6 = row.mac
							// 必须 setTimeout 单次连接；setInterval 会丢失句柄并叠加狂打 createBLEConnection
							if (that.bpw6BleConnectTimer) {
								clearTimeout(that.bpw6BleConnectTimer);
								clearInterval(that.bpw6BleConnectTimer);
								that.bpw6BleConnectTimer = null;
							}
							that.bpw6BleConnectTimer = setTimeout(() => {
								that.bpw6BleConnectTimer = null;
								that.BLEConnection(row.mac, row.deviceSn)
							}, 500)
						} else {
							// BPW1：PPG 进行中不要重启 500ms 扫描心跳，避免反复 connect 打断传数
							if (that.shouldDeferBleReconnectForPpg()) {
								return
							}
							if (Vue.prototype.$globalTimers.heartbeatInterval) {
								clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
								Vue.prototype.$globalTimers.heartbeatInterval = null;
							}
							Vue.prototype.$globalTimers.heartbeatInterval = setInterval(() => {
								if (that.shouldDeferBleReconnectForPpg()) {
									return
								}
								that.onBluetoothDeviceFound(row.deviceModelId)
							}, 500);
						}

					},
					fail: function(err) {
						if (row.deviceModelId === "30001") {
							uni.setStorageSync("BPW6deviceSn", row.deviceSn)
							uni.setStorageSync("BPW6devicemac", row.mac)
							that.deviceIdwatch6 = row.mac
							// 适配器不可用(10001)：勿排队连接，否则会狂打
							const code = err && (err.errCode != null ? err.errCode : err.code);
							if (that.bpw6BleConnectTimer) {
								clearTimeout(that.bpw6BleConnectTimer);
								clearInterval(that.bpw6BleConnectTimer);
								that.bpw6BleConnectTimer = null;
							}
							if (code === 10001) {
								return;
							}
							that.bpw6BleConnectTimer = setTimeout(() => {
								that.bpw6BleConnectTimer = null;
								that.BLEConnection(row.mac, row.deviceSn)
							}, 500)
						} else {
							if (that.shouldDeferBleReconnectForPpg()) {
								return
							}
							if (Vue.prototype.$globalTimers.heartbeatInterval) {
								clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
								Vue.prototype.$globalTimers.heartbeatInterval = null;
							}
							Vue.prototype.$globalTimers.heartbeatInterval = setInterval(() => {
								if (that.shouldDeferBleReconnectForPpg()) {
									return
								}
								that.onBluetoothDeviceFound(row.deviceModelId)
							}, 500);
						}
					}
				})
			},
			//BPW6设备BLE连接
			async BLEConnection(deviceId, deviceSn) {
				let that = this
				if (that.isDeviceBindingPageActive()) {
					return;
				}
				if (that.shouldDeferBleReconnectForPpg()) {
					return;
				}
				// 已连且已初始化：勿再 create（already 刷屏 + 误拉特征值会打断定时 PPG）
				if (that.bpw6BleLastConnected && that.acktypes6 === 1 &&
					that.isAndroidBluetoothEnabled() !== false) {
					try {
						notifyQxBleWatchConnectionState(true, deviceId);
					} catch (e) {}
					if (that.BPW6intervalTimer) {
						clearInterval(that.BPW6intervalTimer);
						that.BPW6intervalTimer = null;
					}
					return;
				}
				// 防止并发 createBLEConnection 风暴（10012 / already connect 刷屏）
				const now = Date.now();
				if (that.bpw6BleConnecting) {
					return;
				}
				if (that.bpw6BleLastConnectAt && now - that.bpw6BleLastConnectAt < 800) {
					return;
				}
				that.bpw6BleConnecting = true;
				that.bpw6BleLastConnectAt = now;
				// 无 timeout 时部分机型 create 可挂起 20s+，期间 connecting 锁死无法重试
				const clearConnectingLock = () => {
					that.bpw6BleConnecting = false;
					if (that._bpw6ConnectGuardTimer) {
						clearTimeout(that._bpw6ConnectGuardTimer);
						that._bpw6ConnectGuardTimer = null;
					}
				};
				that._bpw6ConnectGuardTimer = setTimeout(() => {
					if (that.bpw6BleConnecting) {
						that.bpw6BleConnecting = false;
					}
					that._bpw6ConnectGuardTimer = null;
				}, 5500);
				uni.createBLEConnection({
					deviceId: deviceId,
					timeout: 5000,
					success: (res) => {
						clearConnectingLock();
						that.bpw6BleLastConnected = true;
						that.registerBpw6BleConnectionMonitor();
						try {
							notifyQxBleWatchConnectionState(true, deviceId);
						} catch (e) {}
						if (that.bpw6BleConnectTimer) {
							clearTimeout(that.bpw6BleConnectTimer);
							clearInterval(that.bpw6BleConnectTimer);
							that.bpw6BleConnectTimer = null;
						}
						if (that.BPW6intervalTimer) {
							clearInterval(that.BPW6intervalTimer)
							that.BPW6intervalTimer = null
						}
						// 即将拉特征值并做连接后初始化，提前占住窗口，避免用户抢先点 PPG
						// 已初始化完成的回连：不要反复延长 14s，否则 waitBpw6MainSyncIdleForPpg 会卡住
						if (that.acktypes6 !== 1) {
							that.bpw6PostConnectSetupUntil = Math.max(that.bpw6PostConnectSetupUntil || 0,
								Date.now() + 14000)
							that.scheduleBpw6GetCharacteristics(deviceId, deviceSn, 800);
						} else {
							// 关开蓝牙后 notify 可能丢，补拉一次通道（不延长 14s 窗口）
							that.scheduleBpw6GetCharacteristics(deviceId, deviceSn, 500);
						}
					},
					fail: (err) => {
						clearConnectingLock();
						if (err.errCode === -1) {
							// 仅蓝牙确实关闭时才把 already 当假成功；否则清待回连并按已连接处理
							if (!isQxBleAppInForeground() && that.hasBpw6BgNeedBtReconnect() &&
								that.isAndroidBluetoothEnabled() === false) {
								if (that.bpw6BleConnectTimer) {
									clearTimeout(that.bpw6BleConnectTimer);
									clearInterval(that.bpw6BleConnectTimer);
									that.bpw6BleConnectTimer = null;
								}
								return;
							}
							if (that.bpw6BleConnectTimer) {
								clearTimeout(that.bpw6BleConnectTimer);
								clearInterval(that.bpw6BleConnectTimer);
								that.bpw6BleConnectTimer = null;
							}
							if (that.BPW6intervalTimer) {
								clearInterval(that.BPW6intervalTimer)
								that.BPW6intervalTimer = null
							}
							that.bpw6BleLastConnected = true;
							that.markBpw6BgNeedBtReconnect(false);
							that.registerBpw6BleConnectionMonitor();
							try {
								notifyQxBleWatchConnectionState(true, deviceId);
							} catch (e) {}
							// already connect：PPG 启动/测量中勿立刻拉主特征值（会抢占→status=0）
							if (that.shouldDeferBleReconnectForPpg()) {
								return
							}
							// 已初始化：仅确认连接，不重开 14s 初始化窗口
							if (that.acktypes6 === 1) {
								return
							}
							that.bpw6PostConnectSetupUntil = Math.max(that.bpw6PostConnectSetupUntil || 0,
								Date.now() + 14000)
							that.scheduleBpw6GetCharacteristics(deviceId, deviceSn, 800);
						} else if (err.errCode === 10012) {
							// 超时：前台直连重试，不走 HTTP queryDevices
							if (isQxBleAppInForeground()) {
								that.startBpw6ForegroundDirectReconnect('10012');
							} else if (!that.isBpw6BgReconnectArmed()) {
								that.startBpw6BgOutOfRangeReconnect('bg-disconnect');
							}
						} else {
							if (isQxBleAppInForeground() && uni.getStorageSync('BPW6devicemac') &&
								!that.shouldDeferBleReconnectForPpg()) {
								that.startBpw6ForegroundDirectReconnect('create-fail');
							}
						}
					},
				});
			},

			handleUpdateDisabled(val) {
				if (this.delate_icon2 === true) {
					this.disabledsaaa2 = val;
				}
			},
			handleUpdateDisabled1(val) {
				if (this.delate_icon === true) {
					this.disabledsaaa = val;
				}
			},
			questionnairelist() {
				let data = {
					patientId: uni.getStorageSync("userid"), //患者唯一标识
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/questionnaire/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((questionnairelist) => {
					if (questionnairelist.code === 200 && questionnairelist.total > 0) {
						this.baoggaodisabled = false //报告按钮
					} else {
						this.baoggaodisabled = true //报告按钮
					}
				})
			},
			// 获取保存的单位数据
			Unitlist() {
				const data = {
					dataType: 'Unitdata'
				};
				this.$get(this.$url_APP_IP + '/prod-api/device/data/list', data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200 && res.rows.length > 0 && res.rows[0].data) {
						const parsed = this.robustParseData(res.rows[0].data);
						if (!parsed.length) return;
						const unitData = parsed[0];
						/* ① 字段映射：key → 接口返回字段 */
						const keyMap = {
							Blood: 'bloodUnit',
							danwei1: 'heightUnit',
							danwei2: 'weightUnit',
							// 压力开关（测血压后自动测压力）独立存储，勿与情绪定时 switchHER 混用
							yaliswitchHER: 'switchHER',
						};
						/* ② 统一循环：值→索引→缓存 */
						Object.keys(keyMap).forEach(key => {
							const value = unitData[keyMap[key]];
							switch (key) {
								case 'yaliswitchHER':
									// 必须能同步 false；仅 truthy 写入会导致开关关不掉、血压后 PPG 过频
									if (value !== undefined && value !== null && value !== '') {
										uni.setStorageSync(key, value === true || value === 'true');
									}
									break;
								case 'Blood':
								case 'danwei1':
								case 'danwei2':
									if (value) {
										const matchRules = {
											Blood: (v) => v === "mmHg",
											danwei1: (v) => v === "inch" || v === "英寸",
											danwei2: (v) => v === "kg" || v === "千克"
										};
										const idx = matchRules[key](value) ? 0 : 1;
										uni.setStorageSync(key, idx);
									}
									break;
							}
						});
					}
				});
			},
			showBluetoothSettingsModal() {
				uni.showModal({
					content: this.$t("当前蓝牙未开启是否去设置打开"),
					success: (modalres) => {
						if (modalres.confirm) {
							this.openBLE();
							uni.hideLoading();
						} else {
							uni.hideLoading();
						}
					}
				});
			},
			async onBluetoothDeviceFound(deviceModelId) {
				let that = this
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							// 检查 deviceList 是否为数组
							const deviceList = uni.getStorageSync("deviceList");
							let uniqueArr = Array.isArray(deviceList) ? deviceList.filter((item,
								index) => deviceList.indexOf(item) === index) : [];
							// 检查 devicdsdmac 是否为数组
							const devicdsdmac = uni.getStorageSync("devicdsdmac");
							let uniqueArr1 = Array.isArray(devicdsdmac) ? devicdsdmac.filter((
								item, index) => devicdsdmac.indexOf(item) === index) : [];
							// 检查 devicdsdmac1 是否为数组
							const devicdsdmac1 = uni.getStorageSync("devicdsdmac1");
							let uniqueArr2 = Array.isArray(devicdsdmac1) ? devicdsdmac1.filter(
								(item, index) => devicdsdmac1.indexOf(item) === index) : [];
							if (uniqueArr1) {
								that.connectMultipleDevices(uniqueArr1)
							}
							setTimeout(() => {
								if (uniqueArr2) {
									that.connectMultipleDevices(uniqueArr2)
								}
							}, 2000)
						} else {
							let uniqueArr
							let uniqueArr1
							let uniqueArr2
							if (that.deviceList === undefined) {
								uniqueArr = uni.getStorageSync("deviceList").filter((item,
										index) => uni.getStorageSync("deviceList").indexOf(item) ===
									index);
							} else {
								uniqueArr = that.deviceList.filter((item, index) => that
									.deviceList
									.indexOf(item) === index);
							}
							if (that.devicdsdmac === undefined) {
								uniqueArr1 = uni.getStorageSync("devicdsdmac").filter((item,
										index) => uni
									.getStorageSync("devicdsdmac").indexOf(item) === index);
							} else {
								uniqueArr1 = that.devicdsdmac.filter((item, index) => that
									.devicdsdmac
									.indexOf(item) === index);
							}
							if (that.devicdsdmac1 === undefined) {
								uniqueArr2 = uni.getStorageSync("devicdsdmac1").filter((item,
										index) => uni
									.getStorageSync("devicdsdmac1").indexOf(item) === index
								);
							} else {
								uniqueArr2 = that.devicdsdmac1.filter((item, index) => that
									.devicdsdmac1.indexOf(item) === index);
							}
							if (uniqueArr1) {
								that.connectMultipleDevices(uniqueArr1)
							}
							setTimeout(() => {
								if (uniqueArr2) {
									that.connectMultipleDevices(uniqueArr2)
								}
							}, 2000)
						}
					},
					fail: function(err) {
						console.error('获取网络类型失败：', err);
					}
				});
			},
			async connectMultipleDevices(uniqueArr) {
				// PPG 传数中禁止扫描重连，否则会打断 notify/ACK
				if (this.shouldDeferBleReconnectForPpg()) {
					return
				}
				let deviceIds = (uniqueArr || []).filter((deviceId) => !this.isBleReconnectBlocked(deviceId));
				for (const deviceId of deviceIds) {
					try {
						this.bluetoothManager.connectDevice(deviceId);
					} catch (error) {
						continue
					}
				}
				this.connectedDevices = this.bluetoothManager.connectedDevices;
				const devicesArray = Object.values(this.connectedDevices);
				this.geturl_queryDevices(devicesArray)
			},
			async disconnectAll(mac) {
				this.bluetoothManager = new BluetoothManager();
				this.bluetoothManager.disconnectDevice(mac)
			},
			normalizeBleMac(id) {
				if (!id) return '';
				return String(id).trim().toUpperCase();
			},
			isBleReconnectBlocked(mac) {
				if (!mac) return false;
				if (this.isDeviceBindingPageActive()) return true;
				const norm = this.normalizeBleMac(mac);
				const gt = Vue.prototype.$globalTimers;
				if (!gt) return false;
				const unbinding = gt.isUnbinding;
				if (unbinding && this.normalizeBleMac(unbinding) === norm) return true;
				if (!gt.bleUnbindBlockedMac) return false;
				if (this.normalizeBleMac(gt.bleUnbindBlockedMac) !== norm) return false;
				return Date.now() < (gt.bleUnbindBlockedUntil || 0);
			},
			onDeviceBleUnbind(payload) {
				const mac = typeof payload === 'string' ? payload : (payload && payload.mac);
				const deviceModelId = payload && payload.deviceModelId;
				const reason = payload && payload.reason;
				this.finishGenericBleUnbindCleanup(mac, deviceModelId, reason);
			},
			finishGenericBleUnbindCleanup(mac, deviceModelId, reason) {
				const norm = this.normalizeBleMac(mac);
				if (!norm) return;
				const gt = Vue.prototype.$globalTimers || (Vue.prototype.$globalTimers = {});
				gt.bleUnbindBlockedMac = norm;
				gt.bleUnbindBlockedUntil = Date.now() + 30000;
				this.clearAllReconnectTimers();
				uni.closeBLEConnection({
					deviceId: mac
				});
				const filterMac = (item) => this.normalizeBleMac(item) !== norm;
				this.deviceList = (this.deviceList || []).filter(filterMac);
				this.devicdsdmac = (this.devicdsdmac || []).filter(filterMac);
				this.devicdsdmac1 = (this.devicdsdmac1 || []).filter(filterMac);
				['devicdsdmac', 'devicdsdmac1', 'deviceList'].forEach((key) => {
					const list = uni.getStorageSync(key);
					if (!Array.isArray(list)) return;
					const next = list.filter(filterMac);
					if (next.length === 0) {
						uni.removeStorageSync(key);
					} else {
						uni.setStorageSync(key, next);
					}
				});
				if (deviceModelId === '30000') {
					this.setacktypes(0);
					this.resetBpw1HistorySyncOnDisconnect('unbind');
					if (this.normalizeBleMac(this.deviceIdwatch) === norm) {
						this.deviceIdwatch = '';
					}
					const storedWatch = uni.getStorageSync('deviceIdwatch');
					if (this.normalizeBleMac(storedWatch) === norm) {
						uni.removeStorageSync('deviceIdwatch');
					}
				}
				if (deviceModelId === '30001') {
					uni.removeStorageSync('BPW6deviceId');
					uni.removeStorageSync('BPW6deviceSn');
					uni.removeStorageSync('BPW6devicemac');
					if (this.normalizeBpw6BleDeviceId(this.deviceIdwatch6) === norm) {
						this.deviceIdwatch6 = '';
					}
				}
				this.disconnectAll(mac);
				this.applyEmotionButtonIdleByBind('设备解绑');
			},
			onBpw6DeviceUnbind(mac) {
				this.finishBpw6BleUnbindCleanup(mac, 'BPW6_DEVICE_UNBIND');
			},
			normalizeBpw6BleDeviceId(id) {
				if (!id) return '';
				return String(id).trim().toUpperCase();
			},
			isSameBleUuid(uuidA, uuidB) {
				return (uuidA || '').toUpperCase() === (uuidB || '').toUpperCase();
			},
			isBpw6MainNotifyChannel(serviceId, characteristicId) {
				return this.isSameBleUuid(serviceId, BPW6SERVICE) &&
					this.isSameBleUuid(characteristicId, BPW6NOTIFY);
			},
			enableBleCharacteristicNotify({
				deviceId,
				serviceId,
				characteristicId,
				deviceSn
			}) {
				const that = this;
				const isBpw6Main = that.isBpw6MainNotifyChannel(serviceId, characteristicId);
				that.registerBpw6BleNotifyListener(deviceId, deviceSn);
				uni.notifyBLECharacteristicValueChange({
					state: true,
					deviceId,
					serviceId,
					characteristicId,
					success: async () => {
						if (!isBpw6Main) {
							return;
						}
						if (u16proBLE.isPpgOperationInProgress && u16proBLE.isPpgOperationInProgress()) {
							return;
						}
						try {
							await u16proBLE.ensureBcServiceReady(deviceId);
						} catch (err) {
							console.warn('【BPW6】PPG自定义服务notify启用失败', err);
						}
					},
					fail: (notifyerr) => {
						console.warn('蓝牙notify启用失败', serviceId, characteristicId, notifyerr);
					}
				});
			},
			getBpw6MonitorDeviceId() {
				return uni.getStorageSync('BPW6devicemac') || '';
			},
			isBpw6Unbinding(mac) {
				const unbinding = Vue.prototype.$globalTimers && Vue.prototype.$globalTimers.isUnbinding;
				if (!unbinding || !mac) return false;
				return this.normalizeBpw6BleDeviceId(unbinding) === this.normalizeBpw6BleDeviceId(mac);
			},
			finishBpw6BleUnbindCleanup(mac, reason) {
				const norm = this.normalizeBpw6BleDeviceId(mac);
				const gt = Vue.prototype.$globalTimers || (Vue.prototype.$globalTimers = {});
				gt.bpw6UnbindBlockedMac = norm;
				gt.bpw6UnbindBlockedUntil = Date.now() + 300000;
				if (norm) {
					uni.setStorageSync('BPW6unboundMac', norm);
				}
				this.clearBpw6ReconnectTimersOnly();
				this.unregisterBpw6BleConnectionMonitor();
				this.clearBpw6CharacteristicsCacheForDevice(mac);
				this.removeMacFromStoredDeviceList(mac);
				this.deviceList = (this.deviceList || []).filter((item) =>
					this.normalizeBpw6BleDeviceId(item) !== norm
				);
				this.devicdsdmac1 = (this.devicdsdmac1 || []).filter((item) =>
					this.normalizeBpw6BleDeviceId(item) !== norm
				);
				['devicdsdmac1', 'deviceList'].forEach((key) => {
					const list = uni.getStorageSync(key);
					if (!Array.isArray(list)) return;
					const next = list.filter((item) => this.normalizeBpw6BleDeviceId(item) !== norm);
					if (next.length === 0) {
						uni.removeStorageSync(key);
					} else {
						uni.setStorageSync(key, next);
					}
				});
				this.setacktypes6(0);
				this.bpw6BleLastConnected = false;
				this.hasSynced6 = false;
				this.hasWriten = false;
				uni.removeStorageSync('BPW6deviceId');
				uni.removeStorageSync('BPW6deviceSn');
				uni.removeStorageSync('BPW6devicemac');
				this.deviceIdwatch6 = '';
				if (Vue.prototype.$globalTimers) {
					Vue.prototype.$globalTimers.isUnbinding = null;
				}
				this.teardownBpw6BleOnUnbind(mac);
				// 解绑后释放全局 BLE notify 占用，避免随后绑定 BPW1 时数据包仍走 BPW6/u16pro 链路
				this.releaseBpw6BleNotifyOwnership('BPW6解绑');
				this.applyEmotionButtonIdleByBind('BPW6解绑');
			},
			/**
			 * 释放 BPW6 对 uni.onBLECharacteristicValueChange 的占用。
			 * 仅清路由状态；若本地仍有 BPW1，立即把监听交回 BPW1。
			 */
			releaseBpw6BleNotifyOwnership(reason = '') {
				this.bpw6BleNotifyListenerRegistered = false
				this._legacyBleNotifyDispatch = null
				try {
					if (u16proBLE && typeof u16proBLE.clearForwardNotifyRouting === 'function') {
						u16proBLE.clearForwardNotifyRouting()
					} else if (u16proBLE && typeof u16proBLE.setForwardNotifyHandler === 'function') {
						u16proBLE.setForwardNotifyHandler(null)
					}
				} catch (e) {}
				const bpw1Mac = this.deviceIdwatch || uni.getStorageSync('deviceIdwatch')
				if (bpw1Mac && this.acktypes === 1) {
					this.onBLECharacteristicValueChange3(
						bpw1Mac,
						BPW1serviceId,
						uni.getStorageSync('deviceSn') || this.shoubiaosn
					)
				}
			},
			clearBpw6CharacteristicsCacheForDevice(deviceId) {
				const norm = this.normalizeBpw6BleDeviceId(deviceId);
				if (!norm) return;
				const toDelete = [];
				this.characteristicsCache.forEach((id) => {
					if (this.normalizeBpw6BleDeviceId(id) === norm) {
						toDelete.push(id);
					}
				});
				toDelete.forEach((id) => this.characteristicsCache.delete(id));
			},
			handleBpw6BleDisconnected(deviceId, reason) {
				const mac = deviceId || this.getBpw6MonitorDeviceId();
				if (!mac) return;
				// 后台勿走断开清理：系统列表/假回调会导致误断，心跳会显示未连接
				if (!isQxBleAppInForeground()) {
					try {
						notifyQxBleWatchConnectionState(true, mac);
					} catch (e) {}
					this.bpw6BleLastConnected = true;
					// 仅 GATT 超距断连 / 显式 bg 原因才启独立回连；openBluetoothAdapter-fail(10001) 不启
					if (this.shouldStartBpw6BgOutOfRangeReconnect(reason)) {
						this.startBpw6BgOutOfRangeReconnect(reason || 'bg-disconnect');
					} else if (String(reason || '').indexOf('getConnected') >= 0 ||
						String(reason || '').indexOf('adapter-unavailable') >= 0) {
						// 后台空列表不可信：保持展示，同时悄悄探测回连
						this.startBpw6BgOutOfRangeReconnect('bg-poll-miss');
					}
					return;
				}
				try {
					notifyQxBleWatchConnectionState(false, mac);
				} catch (e) {}
				if (u16proBLE && typeof u16proBLE.resetBcServiceState === 'function') {
					u16proBLE.resetBcServiceState();
				}
				if (this.isBpw6Unbinding(mac)) {
					this.finishBpw6BleUnbindCleanup(mac, reason);
					return;
				}
				if (this.isDeviceBindingPageActive()) {
					return;
				}
				if (!uni.getStorageSync('BPW6devicemac')) {
					return;
				}
				this.clearBpw6CharacteristicsCacheForDevice(mac);
				const norm = this.normalizeBpw6BleDeviceId(mac);
				this.deviceList = (this.deviceList || []).filter((item) =>
					this.normalizeBpw6BleDeviceId(item) !== norm
				);
				this.setacktypes6(0);
				this.bpw6BleLastConnected = false;
				this.bpw6BleNotifyListenerRegistered = false;
				if (this.BPW6intervalTimer) {
					clearInterval(this.BPW6intervalTimer);
					this.BPW6intervalTimer = null;
				}
				const r = String(reason || '');
				// 蓝牙关着时 create 必失败：只清态/记标记，等 available:true 再回连
				if (r.indexOf('adapter-off') >= 0 || r.indexOf('adapter-unavailable') >= 0) {
					this.bpw6FgNeedReconnectAfterAdapterOn = true;
					this.cancelBpw6BlePendingWork();
					return;
				}
				// PPG 进行中不抢连；否则前台直连 MAC（跳过 HTTP queryDevices）
				if (!this.shouldDeferBleReconnectForPpg()) {
					this.startBpw6ForegroundDirectReconnect(reason || 'fg-disconnect');
				}
			},
			startBpw6BleStatusPoll() {
				this.stopBpw6BleStatusPoll();
				this.bpw6BleStatusPollTimer = setInterval(() => {
					if (!this.bpw6BleMonitorActive) return;
					this.refreshBpw6BleConnectionState('poll');
				}, 2500);
			},
			stopBpw6BleStatusPoll() {
				if (this.bpw6BleStatusPollTimer) {
					clearInterval(this.bpw6BleStatusPollTimer);
					this.bpw6BleStatusPollTimer = null;
				}
			},
			refreshBpw6BleConnectionState(reason) {
				const that = this;
				if (that.isDeviceBindingPageActive()) return;
				const mac = that.getBpw6MonitorDeviceId();
				if (!mac) {
					if (that.bpw6BleMonitorActive) {
						that.unregisterBpw6BleConnectionMonitor();
					}
					return;
				}
				if (!that.bpw6BleMonitorActive) return;
				if (that.isBpw6Unbinding(mac)) return;
				const normMac = that.normalizeBpw6BleDeviceId(mac);
				// 以 App 前后台为准（勿用页面 QX_HIDE，切页也会 hide）
				const inBackground = !isQxBleAppInForeground();
				const recentlyConnected = !!(that.bpw6PostConnectSetupUntil && Date.now() < that
					.bpw6PostConnectSetupUntil) || !!(that.bpw6BleLastConnectAt && Date.now() - that
					.bpw6BleLastConnectAt < 12000);
				const keepConnectedOnMiss = () => {
					if (inBackground) {
						// 待蓝牙恢复：只探测是否已开，不假报已连接、不在关蓝牙时 create
						if (that.hasBpw6BgNeedBtReconnect()) {
							that.triggerBpw6BgBtReconnectIfNeeded('poll');
							return true;
						}
						if (that.isAndroidBluetoothEnabled() === false) {
							return true;
						}
						if (!that.bpw6BleLastConnected) {
							that.bpw6BleLastConnected = true;
						}
						try {
							notifyQxBleWatchConnectionState(true, mac);
						} catch (e) {}
						// 已连且已初始化：空列表不可信，勿再 create/拉特征（会打断链路并误报未连接）
						if (that.bpw6BleLastConnected && that.acktypes6 === 1) {
							return true;
						}
						if (!that.shouldDeferBleReconnectForPpg() && !that.isBpw6BgReconnectArmed()) {
							const now = Date.now();
							if (!that._bpw6BgPollMissReconnectAt || now - that._bpw6BgPollMissReconnectAt >
								8000) {
								that._bpw6BgPollMissReconnectAt = now;
								that.startBpw6BgOutOfRangeReconnect('bg-poll-miss');
							}
						}
						return true;
					}
					return false;
				};
				const queryConnected = () => {
					if (typeof uni.getConnectedBluetoothDevices !== 'function') {
						return;
					}
					uni.getConnectedBluetoothDevices({
						success: (res) => {
							const list = res.devices || [];
							const connected = list.some((d) =>
								that.normalizeBpw6BleDeviceId(d && d.deviceId) === normMac
							);
							if (connected) {
								that.bpw6BleMissCount = 0;
								if (!that.bpw6BleLastConnected) {
									try {
										notifyQxBleWatchConnectionState(true, mac);
									} catch (e) {}
								}
								that.bpw6BleLastConnected = true;
								return;
							}
							if (keepConnectedOnMiss()) {
								return;
							}
							// 前台：连续 3 次未命中再断开，避免偶发空列表导致「连着却显示未连接」
							that.bpw6BleMissCount = (that.bpw6BleMissCount || 0) + 1;
							if (that.bpw6BleLastConnected && that.bpw6BleMissCount < 3) {
								return;
							}
							if (that.bpw6BleLastConnected) {
								that.handleBpw6BleDisconnected(mac, reason ||
									'getConnectedBluetoothDevices');
							}
							that.bpw6BleLastConnected = false;
							that.bpw6BleMissCount = 0;
						},
						fail: (err) => {
							if (keepConnectedOnMiss()) {
								return;
							}
							if (recentlyConnected) {
								return;
							}
							if (that.bpw6BleLastConnected) {
								that.bpw6BleMissCount = (that.bpw6BleMissCount || 0) + 1;
								if (that.bpw6BleMissCount < 3) {
									return;
								}
								that.handleBpw6BleDisconnected(mac, reason || 'getConnected-fail');
							} else {
								that.bpw6BleLastConnected = false;
							}
							that.bpw6BleMissCount = 0;
						}
					});
				};
				uni.openBluetoothAdapter({
					success: queryConnected,
					fail: (err) => {
						if (keepConnectedOnMiss()) {
							return;
						}
						if (that.bpw6BleLastConnected) {
							that.handleBpw6BleDisconnected(mac, reason || 'adapter-unavailable');
						} else {
							that.bpw6BleLastConnected = false;
						}
					}
				});
			},
			registerBpw6BleConnectionMonitor() {
				const mac = this.getBpw6MonitorDeviceId();
				if (!mac) {
					this.unregisterBpw6BleConnectionMonitor();
					return;
				}
				this.bpw6BleMonitorActive = true;
				this.startBpw6BleStatusPoll();
				this.registerBpw6NativeBtReceiver();
				try {
					keepAliveManager.registerBpw6BgBtReconnectCheck(() => {
						this.triggerBpw6BgBtReconnectIfNeeded('keepalive-alarm');
					});
				} catch (e) {}
				if (!this.bpw6BleMonitorBound) {
					this.bpw6BleMonitorBound = true;
					const self = this;
					if (typeof uni.onBLEConnectionStateChange === 'function') {
						this.bpw6BleConnectionHandler = function bpw6BleConnectionStateChange(change) {
							if (!self.bpw6BleMonitorActive || !change) return;
							const target = self.normalizeBpw6BleDeviceId(self.getBpw6MonitorDeviceId());
							if (!target) return;
							const changeId = self.normalizeBpw6BleDeviceId(change.deviceId);
							if (changeId !== target) return;
							if (change.connected) {
								self.bpw6BleMissCount = 0;
								self.bpw6BleLastConnected = true;
								try {
									notifyQxBleWatchConnectionState(true, change.deviceId);
								} catch (e) {}
							} else {
								// 后台假断开回调很常见：不立刻清连接态；超距真断则启动独立后台回连
								if (!isQxBleAppInForeground()) {
									self.startBpw6BgOutOfRangeReconnect('onBLEConnectionStateChange-bg');
									return;
								}
								self.handleBpw6BleDisconnected(change.deviceId, 'onBLEConnectionStateChange');
							}
						};
						uni.onBLEConnectionStateChange(this.bpw6BleConnectionHandler);
					}
					if (typeof uni.onBluetoothAdapterStateChange === 'function') {
						this.bpw6BleAdapterStateHandler = function bpw6BluetoothAdapterStateChange(res) {
							if (!self.bpw6BleMonitorActive || !res) return;
							if (!res.available) {
								// 华为等机型切后台常误报 available:false；仅原生确认蓝牙关闭才当真关
								if (self.isAndroidBluetoothEnabled() !== false) {
									return;
								}
								if (!isQxBleAppInForeground()) {
									// 后台关蓝牙：标记待回连；连接态置为未连接（实时），不空转 create
									self.stopBpw6BgOutOfRangeReconnect();
									self.markBpw6BgNeedBtReconnect(true);
									self.bpw6BleLastConnected = false;
									self.bpw6BgFromBtToggleReconnect = false;
									self.bpw6BgFakeAlreadyRetries = 0;
									self.cancelBpw6BlePendingWork();
									try {
										markQxBleBpw6AdapterDown();
									} catch (e) {}
									if (self.BPW6intervalTimer) {
										clearInterval(self.BPW6intervalTimer);
										self.BPW6intervalTimer = null;
									}
									const gt = Vue.prototype.$globalTimers;
									if (gt && gt.BPW6intervalTimer) {
										clearInterval(gt.BPW6intervalTimer);
										gt.BPW6intervalTimer = null;
									}
									return;
								}
								// 前台关蓝牙：清连接态，但不立刻 create（等 available:true）
								self.handleBpw6BleDisconnected(self.getBpw6MonitorDeviceId(), 'adapter-off');
							} else {
								self.refreshBpw6BleConnectionState('adapter-on');
								if (!isQxBleAppInForeground()) {
									if (self.hasBpw6BgNeedBtReconnect() || self.isBpw6BgReconnectArmed()) {
										self.acquireBpw6BgReconnectWakeLock();
										// 成功前保留待回连标记；由 create 成功再清
										self.startBpw6BgOutOfRangeReconnect('adapter-on-bt-toggle');
									}
								} else if (self.bpw6FgNeedReconnectAfterAdapterOn) {
									// 前台蓝牙刚恢复：尽快直连
									self.bpw6FgNeedReconnectAfterAdapterOn = false;
									self.cancelBpw6BlePendingWork();
									self.bpw6BleConnecting = false;
									self.bpw6BleLastConnectAt = 0;
									if (!self.shouldDeferBleReconnectForPpg()) {
										self.postBpw6NativeDelayed('fgAdapterOnReconnect', () => {
											if (!isQxBleAppInForeground()) return;
											if (self.shouldDeferBleReconnectForPpg()) return;
											if (self.bpw6BleLastConnected && self.acktypes6 === 1) return;
											self.startBpw6ForegroundDirectReconnect('adapter-on');
										}, 80);
									}
								}
							}
						};
						uni.onBluetoothAdapterStateChange(this.bpw6BleAdapterStateHandler);
					}
				}
				this.refreshBpw6BleConnectionState('register');
			},
			unregisterBpw6BleConnectionMonitor() {
				this.bpw6BleMonitorActive = false;
				this.stopBpw6BleStatusPoll();
				this.stopBpw6BgBtOnWatchdog();
				this.unregisterBpw6NativeBtReceiver();
				if (this.bpw6BleConnectionHandler && typeof uni.offBLEConnectionStateChange === 'function') {
					try {
						uni.offBLEConnectionStateChange(this.bpw6BleConnectionHandler);
					} catch (e) {}
					this.bpw6BleConnectionHandler = null;
				}
				if (this.bpw6BleAdapterStateHandler && typeof uni.offBluetoothAdapterStateChange ===
					'function') {
					try {
						uni.offBluetoothAdapterStateChange(this.bpw6BleAdapterStateHandler);
					} catch (e) {}
					this.bpw6BleAdapterStateHandler = null;
				}
				this.bpw6BleMonitorBound = false;
			},
			loadStepsFromStorage() {
				try {
					const storedData = uni.getStorageSync("weeklySteps");
					if (storedData) {
						this.stepsData = JSON.parse(storedData);
					}
				} catch (e) {}
			},
			saveDailySteps(bushu, bushu_time) {
				const currentDate = bushu_time;
				const steps = Number(bushu) || 0;
				/* 1. 先把缓存里的 7 天读出来（如果有） */
				let weekly = {};
				try {
					const old = uni.getStorageSync("weeklySteps");
					if (old) weekly = JSON.parse(old);
				} catch (e) {}
				/* 2. 合并今天的数据 */
				weekly[currentDate] = steps;
				/* 3. 只保留最近 7 天（按自然日期排序） */
				const dates = Object.keys(weekly).sort((a, b) => new Date(a) - new Date(b));
				if (dates.length > 7) {
					delete weekly[dates[0]]; // 删除最早的
				}
				/* 4. 写回缓存 & 刷新图表 */
				try {
					uni.setStorageSync("weeklySteps", JSON.stringify(weekly));
					this.stepsData = weekly; // 关键：让组件里的数据也同步
					const sortedDates = Object.keys(weekly).sort((a, b) => new Date(a) - new Date(b));
					this.chartData = {
						categories: sortedDates,
						series: [{
							name: this.$t("步数"),
							data: sortedDates.map(d => weekly[d])
						}]
					};
				} catch (e) {
					console.error("保存步数失败", e);
				}
			},
			toggleExpand2() {
				this.isExpanded2 = !this.isExpanded2;
			},
			Daily_Goal_set() {
				if (!this.Daily_Goal) {
					uni.showToast({
						title: this.$t("设置的目标值不能为空"),
						icon: 'none',
						duration: 1500
					})
					return
				} else {
					uni.showToast({
						title: this.$t("设定成功"),
						icon: 'none',
						duration: 1500
					})
					this.today_Daily_Goal = this.Daily_Goal
					uni.setStorageSync("today_Daily_Goal", this.today_Daily_Goal)
					setTimeout(() => {
						this.Daily_Goal = ""
					}, 500)
				}
			},
			//用药开关
			switch1Change(e) {
				let that = this
				that.medication = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					that.medication = false
					uni.setStorageSync("medication", false)
					// 关键点：添加下一行确保视图更新
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					that.medication = true
					uni.setStorageSync("medication", true)
				}
			},
			swtichSwiper(index) {
				this.currentIndex = index
				this.queryDevicesDone = false; // 立刻上锁
				// 在数据操作前检查清除
				clearDailyGoalData();
			},
			//心率定时测量（情绪页：仅情绪定时）
			setting() {
				const isBpw6 = this.shouldUseBpw6ForEmotionImmediate()
				uni.navigateTo({
					url: '/pages/tabBar/main/sleep_report/Reports_Alerts_new?mode=emotion&devicetype=' + isBpw6
				})
			},
			// 问答按钮
			pingfentiaozhuan() {
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
			//详细报告
			xiangxibaogo() {
				if (!this.finalResult && this.baoggaodisabled) {
					uni.showModal({
						content: this.$t("需要两周以上测试数据进行评估"),
						confirmText: this.$t('确定'),
						showCancel: false,
						success(modal) {
							if (modal.confirm) {}
						}
					})
				} else {
					uni.navigateTo({
						url: "/pages/tabBar/main/score/qingxubaogao?MoodDays=" + this
							.MoodDays +
							"&StressFatigueDays=" + this.StressFatigueDays
					})
				}
			},
			//情绪立即测量：BPW1 走手表情绪命令；BPW6 走 PPG 测量
			sleep_alert() {
				let that = this
				that.yalixueyatype = false
				if (!that.hasBoundBpw1OrBpw6()) {
					that.applyEmotionButtonIdleByBind('sleep_alert无绑定')
					uni.showToast({
						title: that.$t('请检查设备连接'),
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (that.shouldUseBpw6ForEmotionImmediate()) {
					// 已在立即测量/启动中：按当前阶段补弹，禁止重复下发
					if (that.bpw6EmotionPpgActive || that.bpw6PpgStartInProgress) {
						const titleKey = that.getBpw6EmotionImmediateLoadingTitleKey()
						that.showBpw6PpgLoading(titleKey, {
							force: true
						})
						return
					}
					if (that.sleep_alertdisabled && that.isEmotionMeasureBusySession()) {
						return
					}
					that.startBpw6EmotionImmediateMeasure()
					return
				}
				// 定时失败残留 sleep_alertdisabled 时，无真实会话则先恢复，避免立即测量点不动
				if (that.sleep_alertdisabled && !that.isEmotionMeasureBusySession() &&
					!that.hasLiveBpw1EmotionSession() && !that.bpw1PpgTransferActive &&
					!that.bpw1PendingEmotionMeasure) {
					that.restoreEmotionPageButtons('sleep_alert清残留灰态')
				}
				// 防重复点击 / 防 watchtimer3 泄漏导致每秒重复启动 PPG
				if (that.immediateEmotionMeasure || that.sleep_alertid === 1 ||
					that.bpw1ImmediatePpgLaunchLock || that.bpw1PendingEmotionMeasure ||
					that.bpw1ImmediateCmdStarted || that.bpw1PpgTransferActive ||
					(that.sleep_alertdisabled && that.isEmotionMeasureBusySession())) {
					return
				}
				that.clearBpw1ImmediateStartWait('sleep_alert_restart')
				that.bpw1ImmediatePpgLaunchLock = true
				that.sleep_alertdisabled = true
				uni.setStorageSync('sleep_alertdisabled', true)
				const startImmediatePpgOnce = () => {
					if (that.immediateEmotionMeasure || that.sleep_alertid === 1 ||
						that.bpw1ImmediateCmdStarted || that.bpw1PendingEmotionMeasure) {
						return
					}
					uni.showLoading({
						title: that.$t("设置中"),
						mask: true
					})
					// 会话标记等写入成功后再置；过早置位会导致 OTA 设备信息回包被误跳过 ACK
					that.sendstartheartwatch(that.writeuuid, 1, 'immediate')
				}

				// 仅历史同步中(blewatch_id===1)需要等待；已空闲则只启动一次
				if (that.blewatch_id === "1") {
					uni.showLoading({
						title: that.$t("数据同步中请稍后"),
						mask: true,
					})
					that.bpw1ImmediateSyncDelayTimer = setTimeout(() => {
						that.bpw1ImmediateSyncDelayTimer = null
						let aaawatchetime = 0
						const timerId = setInterval(() => {
							aaawatchetime++
							if (that.blewatch_id === "0") {
								uni.hideLoading()
								clearInterval(timerId)
								if (that.watchtimer3 === timerId) {
									that.watchtimer3 = null
								}
								that.bpw1ImmediateAfterSyncTimer = setTimeout(() => {
									that.bpw1ImmediateAfterSyncTimer = null
									startImmediatePpgOnce()
								}, 1500)
							} else if (aaawatchetime >= 15) {
								uni.hideLoading()
								clearInterval(timerId)
								if (that.watchtimer3 === timerId) {
									that.watchtimer3 = null
								}
								that.notifyBpw1PpgFailOrInterrupt('BPW1立即测量等待同步超时', {
									toastKey: '请检查设备连接'
								})
							}
						}, 1000)
						that.watchtimer3 = timerId
					}, 2000)
				} else {
					startImmediatePpgOnce()
				}
			},
			/** 清理 BPW1 立即测量等待定时器，避免泄漏后重复启动 */
			clearBpw1ImmediateStartWait(reason = '') {
				if (this.watchtimer3) {
					clearInterval(this.watchtimer3)
					this.watchtimer3 = null
				}
				if (this.bpw1ImmediateSyncDelayTimer) {
					clearTimeout(this.bpw1ImmediateSyncDelayTimer)
					this.bpw1ImmediateSyncDelayTimer = null
				}
				if (this.bpw1ImmediateAfterSyncTimer) {
					clearTimeout(this.bpw1ImmediateAfterSyncTimer)
					this.bpw1ImmediateAfterSyncTimer = null
				}
				this.clearBpw1EmotionMeasureWait(reason || 'immediate_start_wait')
			},
			/** 立即测量是否走 BPW6 PPG：已绑 BPW6 即走 BPW6（仅绑 BPW1 时仍走 BPW1） */
			shouldUseBpw6ForEmotionImmediate() {
				const hasBpw6 = !!(this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac'))
				if (!hasBpw6) {
					return false
				}
				const hasBpw1 = !!(this.deviceIdwatch || uni.getStorageSync('deviceIdwatch'))
				// 仅 BPW6，或双设备且当前情绪模式/机型为 BPW6
				if (!hasBpw1) {
					return true
				}
				return isQxBpw6EmotionMode() || this.devicetype === 30001
			},
			/** 是否 BPW6「情绪立即测量」会话（不含血压后PPG、定时PPG） */
			isBpw6EmotionImmediateUi() {
				return this.bpw6EmotionPpgActive === true
			},
			/** 是否 BPW6「血压后 PPG」静默会话（无任何 loading/toast，结束只恢复按钮） */
			isBpw6AfterBpPpgSession() {
				// 立即测量优先：残留血压后标记不得劫持立即测量/兼容机云端 UI
				if (this.bpw6EmotionPpgActive || this.immediateEmotionMeasure) {
					return false
				}
				if (this.bpw6PendingPpgAfterBp) {
					return true
				}
				try {
					const afterBp = uni.getStorageSync('bpw6_after_bp_ppg')
					if (afterBp === 1 || afterBp === '1') {
						return true
					}
				} catch (e) {}
				return false
			},
			/** BPW6 是否已连接（立即测量前校验） */
			isBpw6EmotionDeviceConnected() {
				const mac = this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				if (!mac) {
					return false
				}
				if (this.acktypes6 === 1) {
					return true
				}
				try {
					const flag = uni.getStorageSync('qx_bpw6_ble_connected')
					if (flag === true || flag === 'true' || flag === 1 || flag === '1') {
						return true
					}
				} catch (e) {}
				if (u16proBLE && u16proBLE.isConnected) {
					if (!u16proBLE.deviceId ||
						this.normalizeBpw6BleDeviceId(u16proBLE.deviceId) ===
						this.normalizeBpw6BleDeviceId(mac)) {
						return true
					}
				}
				return false
			},
			/** BPW6 立即测量：失败提示并清 loading（后台也标记回前台再清） */
			notifyBpw6EmotionImmediateFail(toastKey, reason) {
				this._bpw6PpgCompleteWatchArmed = false
				try {
					uni.hideLoading()
				} catch (e) {}
				this.hideBpw6PpgLoading(true)
				this.bpw6NeedClearLoadingOnShow = true
				if (toastKey) {
					uni.showToast({
						title: this.$t(toastKey),
						icon: 'none',
						duration: 2500
					})
				}
				this.restoreEmotionPageButtons(reason || 'BPW6立即测量失败')
			},
			async startBpw6EmotionImmediateMeasure() {
				const deviceId = this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				if (!deviceId || !this.isBpw6EmotionDeviceConnected()) {
					uni.showToast({
						title: this.$t('请检查设备连接'),
						icon: 'none',
						duration: 2000
					})
					return
				}
				// 防重入：已在会话中则只保证当前阶段 loading 可见
				if (this.bpw6EmotionPpgActive || this.bpw6PpgStartInProgress) {
					this.showBpw6PpgLoading(this.getBpw6EmotionImmediateLoadingTitleKey(), {
						force: true
					})
					return
				}
				// 取消重连触发的 getCharacteristics，避免与立即 PPG 抢通道
				this.cancelBpw6BlePendingWork()
				// 清残留血压后标记，避免静默逻辑误伤立即测量/兼容机云端 UI
				this.clearBpw6AfterBpPpgBusyMark()
				this.bpw6PendingPpgAfterBp = false
				this.immediateEmotionMeasure = true
				this.sleep_alertid = 1
				this.bpw6EmotionPpgActive = true
				this.bpw6EmotionPpgStartedAt = Date.now()
				this.bpw6NeedClearLoadingOnShow = false
				this.bpw6PpgFinishing = false
				this.bpw6PpgTransferStarted = false
				this.setBpw6EmotionPpgPhase('measuring')
				this.markBpw6PpgSessionBusy('BPW6立即情绪测量')
				if (this.bpw6EmotionPpgTimer) {
					clearTimeout(this.bpw6EmotionPpgTimer)
				}
				// BPW6 PPG 较长；熄屏后定时器会暂停，回前台靠墙钟纠偏。此处 5 分钟兜底。
				this.bpw6EmotionPpgTimer = setTimeout(() => {
					this.bpw6EmotionPpgTimer = null
					if (this.bpw6EmotionPpgActive || this.immediateEmotionMeasure) {
						this.notifyBpw6EmotionImmediateFail('请检查设备连接', 'BPW6立即情绪测量超时5分钟')
					}
				}, 5 * 60 * 1000)
				// 立即测量：先清残留 loading 状态再强制弹「测量中」（避免 flag 残留导致不弹窗）
				this.bpw6PpgLoadingActive = false
				this.bpw6PpgLoadingTitleKey = ''
				try {
					uni.hideLoading()
				} catch (e) {}
				this.showBpw6PpgLoading('测量中', {
					force: true
				})
				// 部分机型同帧 showLoading 无效：短延迟补一次，仍在启动/测量阶段才补
				if (this._bpw6ImmediateLoadingKickTimer) {
					clearTimeout(this._bpw6ImmediateLoadingKickTimer)
					this._bpw6ImmediateLoadingKickTimer = null
				}
				this._bpw6ImmediateLoadingKickTimer = setTimeout(() => {
					this._bpw6ImmediateLoadingKickTimer = null
					if (!this.bpw6EmotionPpgActive || this.bpw6EmotionPpgPhase === 'transferring') {
						return
					}
					this.showBpw6PpgLoading('测量中', {
						force: true
					})
				}, 120)
				const ok = await this.startBpw6PpgMeasurementCore(deviceId, {
					skipBpWait: true,
					fromEmotionImmediate: true
				})
				if (!ok) {
					this.notifyBpw6EmotionImmediateFail('请检查设备连接', 'BPW6立即情绪测量启动失败')
				} else if (this.bpw6EmotionPpgActive && this.bpw6EmotionPpgPhase !== 'transferring') {
					// 启动成功后再次确保「测量中」可见（启动过程中系统可能吞掉 loading）
					this.showBpw6PpgLoading('测量中', {
						force: true
					})
				}
			},
			//血压实时测量命令 / 情绪PPG：仅允许 immediate | after_bp | scheduled
			// PPG 相关 loading/toast 仅 immediate；after_bp / scheduled 静默启动
			sendstartheartwatch(writeuuid, type, source = '') {
				let that = this
				const allowed = source === 'immediate' || source === 'after_bp' || source === 'scheduled'
				if (!allowed) {
					console.warn('【BPW1】拦截未授权PPG启动', source || '(empty)')
					return
				}
				if (source === 'after_bp') {
					if (that.isBpw1HistorySyncing()) {
						return
					}
					const yaliOn = uni.getStorageSync('yaliswitchHER') === true ||
						uni.getStorageSync('yaliswitchHER') === 'true'
					if (!yaliOn) {
						return
					}
					// 仅真实进行中的其它 PPG 才跳过；勿因本路径即将置位的 yalixueyatype 误跳过下发
					that.clearStaleBpw1PpgSessionMarks('after_bp启动前')
					if (that.immediateEmotionMeasure || that.bpw1PpgTransferActive ||
						!!that.watchtimer2 || uni.getStorageSync('sendwatch') === 1) {
						return
					}
				}
				if (source === 'immediate') {
					if (that.bpw1ImmediateCmdStarted || that.bpw1PendingEmotionMeasure) {
						return
					}
				}
				// 清掉上次卡片测心率/未完成PPG留下的传输超时，避免误杀本次血压后PPG
				that.clearBpw1PpgTransferWatchdog('启动PPG-' + source)
				// 新会话启动前清残留缓存，避免误判传数中/污染本次上报
				that.bpw1PpgTransferActive = false
				that.bpw1PpgLastPacketAt = 0
				that.bpw1PpgTransferDeadline = 0
				that.bufferPPG = []
				// PPG 会话心率禁止并入血压：清掉可回捞的实时心率缓存
				that.bpw1RecentLiveHr = null
				if (!that.bpw1PendingLiveBp) {
					that.bpw1PendingBpCompanionHr = null
				}
				const deviceId = that.deviceIdwatch ? that.deviceIdwatch : uni.getStorageSync("deviceIdwatch")
				that.clearBpw1EmotionMeasureWait('restart-' + source)
				const otaBefore = String(uni.getStorageSync('otadatares') || '')
				that.bpw1PendingEmotionMeasure = {
					source,
					otaBefore,
					startedAt: Date.now()
				}
				// 先查设备信息（固件分支命令依赖 otadatares），回包 ACK 后再发测量命令
				that.OTAdata(deviceId, BPW1serviceId, BPW1write, {
					delayMs: 300
				})
				// 兜底：OTA 回包过慢时仍用缓存 otadatares 下发，避免一直停在「设置中」
				that.bpw1EmotionMeasureWaitTimer = setTimeout(() => {
					that.bpw1EmotionMeasureWaitTimer = null
					that.flushBpw1PendingEmotionMeasure('ota_wait_timeout')
				}, 4500)
			},
			/** 清理 BPW1 情绪测量等待 OTA 回包的定时器/标记 */
			clearBpw1EmotionMeasureWait(reason = '') {
				if (this.bpw1EmotionMeasureWaitTimer) {
					clearTimeout(this.bpw1EmotionMeasureWaitTimer)
					this.bpw1EmotionMeasureWaitTimer = null
				}
				if (this.bpw1OtaReadyFlushTimer) {
					clearTimeout(this.bpw1OtaReadyFlushTimer)
					this.bpw1OtaReadyFlushTimer = null
				}
				if (reason && this.bpw1PendingEmotionMeasure) {
					console.log('【BPW1】清理情绪测量等待', reason)
				}
				this.bpw1PendingEmotionMeasure = null
			},
			/** OTA 设备信息已写入 otadatares：若正在等测量则立即下发 */
			notifyBpw1OtaInfoReady(reason = '') {
				if (!this.bpw1PendingEmotionMeasure) {
					return
				}
				const pending = this.bpw1PendingEmotionMeasure
				const otaNow = String(uni.getStorageSync('otadatares') || '')
				if (!otaNow) {
					return
				}
				// 有更新，或已有缓存可用：短延迟让 ACK 先发出去再写测量命令
				const updated = otaNow !== pending.otaBefore
				if (this.bpw1OtaReadyFlushTimer) {
					clearTimeout(this.bpw1OtaReadyFlushTimer)
				}
				this.bpw1OtaReadyFlushTimer = setTimeout(() => {
					this.bpw1OtaReadyFlushTimer = null
					this.flushBpw1PendingEmotionMeasure(reason || 'ota_ready')
				}, 400)
			},
			flushBpw1PendingEmotionMeasure(reason = '') {
				const pending = this.bpw1PendingEmotionMeasure
				if (!pending) {
					return
				}
				if (this.bpw1EmotionMeasureWaitTimer) {
					clearTimeout(this.bpw1EmotionMeasureWaitTimer)
					this.bpw1EmotionMeasureWaitTimer = null
				}
				if (this.bpw1OtaReadyFlushTimer) {
					clearTimeout(this.bpw1OtaReadyFlushTimer)
					this.bpw1OtaReadyFlushTimer = null
				}
				this.bpw1PendingEmotionMeasure = null
				this.writeBpw1EmotionMeasureCmd(pending.source)
			},
			writeBpw1EmotionMeasureCmd(source) {
				const that = this
				if (source === 'immediate') {
					if (that.bpw1ImmediateCmdStarted && that.immediateEmotionMeasure) {
						return
					}
				}
				let buffer2 = that.toArrayBuffer("e00006F3060104000101")
				const otaDataRes = uni.getStorageSync("otadatares");
				if (OTA_DATA_RES_WATCH_CMD_IDS.has(otaDataRes)) {
					buffer2 = that.toArrayBuffer("e0000611030125000101") //5.8.5||5.8.7的版本情绪测量命令
					console.log('【BPW1】使用新固件情绪命令 e0000611...', String(otaDataRes).slice(0, 20))
				} else {
					buffer2 = that.toArrayBuffer("e00006F3060104000101")
					console.log('【BPW1】使用旧固件情绪命令 e00006F3...', String(otaDataRes || '').slice(0, 20))
				}
				uni.writeBLECharacteristicValue({
					deviceId: that.deviceIdwatch ? that.deviceIdwatch : uni
						.getStorageSync("deviceIdwatch"),
					serviceId: BPW1serviceId,
					characteristicId: BPW1write,
					writeType: 'writeNoResponse',
					value: buffer2,
					success(res) {
						console.log('【BPW1】情绪测量命令写入成功', source, res)
						that.sleep_alertdisabled = true
						uni.setStorageSync("sleep_alertdisabled", true)
						refreshQxBleKeepAliveNotification()
						if (source === 'after_bp') {
							that._bpw1AfterBpCmdAt = Date.now()
							that._bpw1LastPpgAfterBpAt = that._bpw1LastPpgAfterBpAt || Date.now()
							// 写入成功后再钉一次会话，避免 ACK25 前标记被误清导致后续 Status01 被忽略
							that.yalixueyatype = true
							that.sleep_alertid = 1
							that.sleep_alertdisabled = true
							uni.setStorageSync('sleep_alertdisabled', true)
							console.log('【BPW1】血压后PPG命令已下发，等待手表采集后回Status01')
						}
						// 仅「立即测量」展示 PPG 测量提示；血压后/定时静默
						if (source === 'immediate') {
							that._bpw1ImmediateCmdAt = Date.now()
							that.immediateEmotionMeasure = true
							that.sleep_alertid = 1
							that.bpw1ImmediateCmdStarted = true
							uni.hideLoading()
							uni.showLoading({
								title: that.$t("开始测量"),
								mask: true
							})
						}
					},
					fail(err) {
						console.warn('【BPW1】情绪测量命令写入失败', source, err)
						if (source === 'immediate') {
							uni.hideLoading()
							that.notifyBpw1PpgFailOrInterrupt('BPW1立即测量写入失败', {
								toastKey: '请检查设备连接'
							})
						} else {
							console.log('【BPW1】PPG启动写入失败(静默)', source, err)
							if (source === 'after_bp') {
								that.notifyBpw1PpgFailOrInterrupt('BPW1血压后PPG写入失败', {
									silent: true
								})
							} else if (source === 'scheduled') {
								that.notifyBpw1PpgFailOrInterrupt('BPW1定时PPG写入失败', {
									silent: true
								})
							}
						}
					},
				})
			},
			swipeIndex(index) {
				let that = this
				that.currentIndex = index.detail.current;
				that.queryDevicesDone = false; // 立刻上锁
				that.resetStates();
				that.getUserInfo();
				// 在数据操作前检查清除
				clearDailyGoalData();
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {} else {
							if (uni.getStorageSync("xueyadatatype") && uni
								.getStorageSync(
									"xueyadata")) {
								if (uni.getStorageSync("xueyadatatype") === "1") {
									that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, uni
										.getStorageSync("xueyadata"), {
											'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
										}).then(res => {
										if (res.code === 200) {
											that.setbanhua(1)
											let deviceSnlixin = uni
												.getStorageSync(
													"xueyadata")
												.deviceSn
											let slaveDatalixian = uni
												.getStorageSync("xueyadata")
												.slaveData
											uni.removeStorageSync(
												"xueyadatatype")
											uni.removeStorageSync("xueyadata")
											setTimeout(() => {
												that.get_device_info(
													deviceSnlixin)
												that.StorageInfo(
													slaveDatalixian
												)
											}, 1000)
										}
									}).catch(errro => {})
								} else if (uni.getStorageSync("xueyadatatype") === "0") {
									that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale,
										uni.getStorageSync("xueyadata"), {
											'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
										}).then(resaa => {
										if (resaa.code === 200) {
											that.setbanhua(1)
											let deviceSnlixin = uni.getStorageSync("xueyadata")
												.deviceSn
											let slaveDatalixian = uni.getStorageSync("xueyadata")
												.slaveData
											uni.removeStorageSync("xueyadatatype")
											uni.removeStorageSync("xueyadata")
											setTimeout(() => {
												that.get_device_info(deviceSnlixin)
												that.StorageInfo(slaveDatalixian)
											}, 1000)
										}
									})
								}
							}
							if (uni.getStorageSync("tizhidata")) {
								that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale,
									uni.getStorageSync("tizhidata"), {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(res => {
									if (res.code === 500) {
										uni.showToast({
											title: that.$t("失败"),
											icon: 'none'
										})
										return
									} else if (res.code === 200) {
										that.setbanhua(1)
										let deviceSntzlx = uni.getStorageSync("tizhidata")
											.deviceSn
										uni.removeStorageSync("tizhidata")
										setTimeout(() => {
											that.get_device_info(deviceSntzlx)
											that.get_device_data(deviceSntzlx)
										}, 1000)
									}
								})
							}
						}
					},
					fail: function(err) {
						console.error('获取网络类型失败：', err);
					}
				});
				const BleDeviceConfig = {
					PROTOCOL_VERSION: 0x01 // 协议版本号
				};
				if (that.currentIndex === 1) {
					that.finalResultids = false
				}
				if (that.acktypes === 1 && that.currentIndex === 4) {
					that.getsetpsin(that.deviceIdwatch, BPW1serviceId, BPW1write, BleDeviceConfig.PROTOCOL_VERSION)
				}
				// if (that.acktypes === 1 && that.currentIndex === 3) {
				// 	that.Sync_historical_data(that.deviceIdwatch)
				// }
			},

			resetStates() {
				this.binaji = true;
				this.animation = '';
				this.button_show = false;
				this.delate_icon = false;
				this.disabledsaaa = true;
				this.binaji2 = true;
				this.animation2 = '';
				this.button_show2 = false;
				this.delate_icon2 = false;
				this.disabledsaaa2 = true;
			},
			//帮助
			helperclick() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Help_center"
				})
			},
			//跳转系统设置
			openBLE() {
				if (systemInfo.platform === "android") {
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass("android.content.Intent");
					var mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
					main.startActivity(mIntent);
				} else if (systemInfo.platform === "ios") {
					plus.runtime.launchApplication({
						action: 'App-Prefs:root=BLE'
					}, function(e) {});
				}
			},

			geturl_queryDevices(devicesArray) {
				let that = this
				that.$post(that.$url_APP_IP + that.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						for (let rowIndex = 0; rowIndex < res.rows.length; rowIndex++) {
							const row = res.rows[rowIndex];
							for (let deviceIndex = 0; deviceIndex < devicesArray
								.length; deviceIndex++) {
								const device = devicesArray[deviceIndex];
								if (device.deviceId !== row.mac) continue;
								if (device.services.length === 1) {
									uni.setBLEMTU({
										deviceId: device.deviceId,
										mtu: 512,
									});
								}
								// if (row.deviceModelId === "10005" || row.deviceModelId === "10001" || row
								// 	.deviceModelId === "10002") {
								if (row.deviceModelId === "10005") {
									that.xeuyejisn = row.deviceSn
									that.xeuyejimac = device.deviceId
								}
								if (row.deviceModelId === "30000") {
									that.shoubiaosn = row.deviceSn
									that.shoubiaomac = device.deviceId
								}
								switch (device.services.length) {
									case 2:
										that.getBLEDeviceCharacteristics2(device.deviceId,
											device.services[1].uuid,
											row.deviceSn);
										break;
									case 3:
										if (row.deviceModelId === "30000") {
											that.getBLEDeviceCharacteristics3(
												device.deviceId,
												device.services[1].uuid, row.deviceSn
											);
											that.shoubiaosn = row.deviceSn
											that.shoubiaomac = device.deviceId
										}
										// if (row.deviceModelId === "10005" || row.deviceModelId === "10001" || row
										// 	.deviceModelId === "10002") {
										if (row.deviceModelId === "10005") {
											uni.setBLEMTU({
												deviceId: device.deviceId,
												mtu: 512,
											});
											that.getBLEDeviceCharacteristics1(device.deviceId,
												device.services[2].uuid, row.deviceSn);
											that.xeuyejisn = row.deviceSn
											that.xeuyejimac = device.deviceId
										}
										if (row.deviceModelId === "10006") {
											uni.setStorageSync("ECGdeviceSn", row.deviceSn)
											that.deviceIdECG = device.deviceId
											that.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID,
												row
												.deviceSn)
										}
										break;
									case 4:
										if (row.deviceModelId === "10006") {
											uni.setStorageSync("ECGdeviceSn", row.deviceSn)
											that.deviceIdECG = device.deviceId
											that.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID,
												row
												.deviceSn)
										}
										// that.getBLEDeviceCharacteristics2(device.deviceId, device.services[3].uuid,
										// 	row.deviceSn);
										break;
									default:
										// 可以添加默认处理或日志
										break;
								}
								// 找到匹配的设备后可以跳出内层循环
								break;
							}
						}
					}
				}).catch(err => {
					const reslits = uni.getStorageSync("lixianlist");
					for (let rowIndex = 0; rowIndex < reslits.length; rowIndex++) {
						const row = reslits[rowIndex];
						for (let deviceIndex = 0; deviceIndex < devicesArray
							.length; deviceIndex++) {
							const device = devicesArray[deviceIndex];
							if (device.deviceId !== row.mac) continue;
							if (device.services.length === 1) {
								uni.setBLEMTU({
									deviceId: device.deviceId,
									mtu: 512,
								});
							}
							// if (row.deviceModelId === "10005" || row.deviceModelId === "10001" || row
							// 	.deviceModelId === "10002") {
							if (row.deviceModelId === "10005") {
								that.xeuyejisn = row.deviceSn
								that.xeuyejimac = device.deviceId
							}
							if (row.deviceModelId === "30000") {
								that.shoubiaosn = row.deviceSn
								that.shoubiaomac = device.deviceId
							}
							switch (device.services.length) {
								case 2:
									that.getBLEDeviceCharacteristics2(device.deviceId,
										device.services[1].uuid, row.deviceSn);
									break;
								case 3:
									if (row.deviceModelId === "30000") {
										that.getBLEDeviceCharacteristics3(device.deviceId,
											device.services[1].uuid,
											row.deviceSn
										);
										that.shoubiaosn = row.deviceSn
										that.shoubiaomac = device.deviceId
									}
									// if (row.deviceModelId === "10005" || row.deviceModelId === "10001" || row
									// 	.deviceModelId === "10002") {
									if (row.deviceModelId === "10005") {
										uni.setBLEMTU({
											deviceId: device.deviceId,
											mtu: 512,
										});
										that.getBLEDeviceCharacteristics1(device.deviceId,
											device.services[2].uuid, row.deviceSn);
										that.xeuyejisn = row.deviceSn
										that.xeuyejimac = device.deviceId
									}
									if (row.deviceModelId === "10006") {
										that.deviceIdECG = device.deviceId
										uni.setStorageSync("ECGdeviceSn", row.deviceSn)
										that.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID, row
											.deviceSn)
									}
									break;
								case 4:
									if (row.deviceModelId === "10006") {
										that.deviceIdECG = device.deviceId
										uni.setStorageSync("ECGdeviceSn", row.deviceSn)
										that.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID, row
											.deviceSn)
									}
									// that.getBLEDeviceCharacteristics2(device.deviceId,
									// 	device.services[3].uuid, row
									// 	.deviceSn);
									break;
								default:
									// 可以添加默认处理或日志
									break;
							}
							// 找到匹配的设备后可以跳出内层循环
							break;
						}
					}
					uni.getNetworkType({
						success: function(getNetworkTyperes) {
							if (getNetworkTyperes.networkType === 'none') {
								// that.xueyehuilian = true
							} else {
								that.tryRequestAppPermissions();
								// that.xueyehuilian = true
								that.Blood = uni.getStorageSync("Blood") ===
									0 ||
									uni.getStorageSync(
										"Blood") === "" ? "mmHg" : "kPa"
								that.tryShowPermissionTip();
								isInChinaByIP().then(isInChina => {
									that.loact = isInChina ? "境内" :
										"境外";
									const token = uni.getStorageSync(
										"token");
									if (!token) {
										uni.redirectTo({
											url: "/pages/login/login_land"
										});
										return;
									}
									that.xueyabiaoshi = ""
									that.deviceList = []
									that.queryDevicesDone =
										false // 立刻上锁
									that.getUserInfo()
								});
								// 在数据操作前检查清除
								clearDailyGoalData();
								that.today_Daily_Goal = uni.getStorageSync(
									"today_Daily_Goal") || "0"
							}
						},
						fail: function(err) {
							console.error('获取网络类型失败：', err);
						}
					});
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics1(deviceId, serviceId, deviceSn) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知
							if (item.properties.notify) {
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.onBLECharacteristicValueChange1(
											deviceId,
											serviceId,
											deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(failres) {
						console.error('获取蓝牙设备某个服务中所有特征值失败11', failres)
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.disconnectAll(deviceId)
						that.deviceList = []
						that.getUserInfo()
						uni.getNetworkType({
							success: function(getNetworkTyperes) {
								if (getNetworkTyperes.networkType === 'none') {
									that.aaaa(uni.getStorageSync("lixianlist"))
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
					}
				})
			},
			getBLEDeviceCharacteristics2(deviceId, serviceId, deviceSn) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.notify) {
								uni.setStorageSync("landeviceId", deviceId)
								uni.setStorageSync("lanserviceId", serviceId)
								uni.setStorageSync("landcharacteristicId", item.uuid)
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.onBLECharacteristicValueChange2(
											deviceId, serviceId,
											deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
							setTimeout(() => {
								if (item.properties.write) {
									// 当前时间
									const now = new Date();
									const year = now.getFullYear().toString();
									const month = now.getMonth() + 1; // 月份从0开始
									const day = now.getDate();
									const hour = now.getHours();
									const minute = now.getMinutes();
									const second = now.getSeconds();
									that.sendLargeData(deviceId, serviceId,
										item.uuid, year, month, day, hour,
										minute, second);
								}
							}, 1000)
						}
					},
					fail(failres) {
						console.error('获取蓝牙设备某个服务中所有特征值失败11', failres)
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.deviceList = []
						that.disconnectAll(deviceId)
						that.getUserInfo()
					}
				})
			},
			getBLEDeviceCharacteristics3(deviceId, serviceId, deviceSn) {
				let that = this
				// 检查是否已经获取过该设备的特征值
				if (that.characteristicsCache.has(deviceId)) {
					uni.openBluetoothAdapter({
						success: () => {
							uni.onBLEConnectionStateChange(function(change) {
								if (!change.connected) {
									if (change.deviceId === deviceId) {
										console.log('蓝牙设备已断开');
										if (that.characteristicsCache.has(deviceId)) {
											that.characteristicsCache.delete(deviceId);
										}
										that.deviceList = that.deviceList.filter(item =>
											item !==
											deviceId);
										that.setacktypes(0)
										that.resetBpw1HistorySyncOnDisconnect('ble_disconnect')
										// 前台断开且 PPG 会话中：视为测量中断，恢复按钮（后台假断不处理，避免误恢复）
										if (isQxBleAppInForeground() &&
											(that.isBpw1ActivePpgSession() || that
												.hasLiveBpw1EmotionSession())) {
											that.notifyBpw1PpgFailOrInterrupt('蓝牙断开中断', {
												silent: true
											})
										}
										that.queryDevices()
									} else if (change.deviceId !== deviceId) {
										const otherId = change.deviceId;
										const otherNorm = that.normalizeBpw6BleDeviceId(
											otherId);
										if (that.isBpw6Unbinding(otherId)) {
											return;
										}
										const unboundMac = uni.getStorageSync(
											'BPW6unboundMac');
										if (unboundMac && otherNorm === that
											.normalizeBpw6BleDeviceId(
												unboundMac)) {
											return;
										}
										const bpw6Mac = uni.getStorageSync('BPW6devicemac');
										if (bpw6Mac) {
											if (otherNorm !== that.normalizeBpw6BleDeviceId(
													bpw6Mac)) {
												return;
											}
										} else {
											return;
										}
										that.setacktypes6(0);
										that.queryDevices();
									}
								}
							});
							// 缓存命中时也要夺回全局 notify（BPW6 解绑后短时内可能仍被 u16pro 占用）
							if (that.acktypes === 1) {
								uni.notifyBLECharacteristicValueChange({
									state: true,
									deviceId: deviceId,
									serviceId: BPW1serviceId,
									characteristicId: BPW1notify,
									success: (notifyres) => {
										that.onBLECharacteristicValueChange3(
											that.shoubiaomac || deviceId,
											BPW1serviceId,
											that.shoubiaosn || deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
							if (!that.hasSynced) { // 历史同步只执行一次
								that.hasSynced = true;
								if (that.acktypes === 1 && that.blewatch_id2 === "1") {
									setTimeout(() => {
										// 初始化链（查询/校时/运动）进行中时勿抢先同步，否则与 ACK/命令撞写时好时坏
										if (that.bpw1SetupCmdBusy || that.bpw1SportTimer ||
											that.bpw1SyncTimer || that.bpw1TimeDelayTimer) {
											return
										}
										that.Sync_historical_data(deviceId)
									}, 1000)
								}
							}
						},
						fail: (err) => {
							if (that.characteristicsCache.has(deviceId)) {
								console.log(`清除设备 ${deviceId} 的特征值缓存`);
								that.characteristicsCache.delete(deviceId);
							}
							that.deviceList = that.deviceList.filter(item =>
								item !== deviceId);
							that.setacktypes(0)
							that.resetBpw1HistorySyncOnDisconnect('adapter_fail')
							that.queryDevices()

						}
					});
					return;
				}
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: BPW1serviceId,
					success: (res) => {
						that.characteristicsCache.add(deviceId); // 缓存设备ID
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (that.acktypes === 0) {
								if (item.properties.write) {
									let {
										brand
									} = uni.getSystemInfoSync()
									const writeCharId = item.uuid || BPW1write
									const buffer = brand === "xiaomi" || brand === "oneplus" ? that
										.toArrayBuffer("e00006e8000000000101") : that
										.toArrayBuffer("e00006e7000000000100")
									uni.writeBLECharacteristicValue({
										deviceId: deviceId,
										serviceId: BPW1serviceId,
										characteristicId: writeCharId,
										writeType: "writeNoResponse",
										value: buffer,
										success: (writeres) => {
											console.log(
												"【BPW1】发送初始化命令成功：e00006e7000000000100");
											that.deviceIdwatch = deviceId
											that.serviceIdwatch = BPW1serviceId
											that.writeuuid = writeCharId
											uni.setStorageSync("deviceIdwatch", deviceId)
											uni.setStorageSync("serviceIdwatch",
												BPW1serviceId)
											uni.setStorageSync("writeuuid", writeCharId)
											// 调度延后到历史同步命令之后，避免与运动/同步写撞车
											that.bpw1PendingResumeSchedule = true
											// 对齐参考工程：查询成功后立刻校时（勿再等 2.5s，易撞 notify/ACK）
											that.clearBpw1SetupTimers()
											that.bpw1SetupCmdBusy = true
											const setupGen = that.bpw1SetupGen
											that.calculateChecksumsss2(
												deviceId, BPW1serviceId, writeCharId,
												deviceSn,
												setupGen)
										},
										fail: (writeerr) => {
											console.log("【BPW1】发送命令失败：", writeerr);
											that.writeuuid = writeCharId
											uni.setStorageSync("deviceIdwatch", deviceId)
											uni.setStorageSync("serviceIdwatch",
												BPW1serviceId)
											uni.setStorageSync("writeuuid", writeCharId)
											that.bpw1PendingResumeSchedule = true
											that.clearBpw1SetupTimers()
											that.bpw1SetupCmdBusy = true
											const setupGen = that.bpw1SetupGen
											that.calculateChecksumsss2(
												deviceId, BPW1serviceId, writeCharId,
												deviceSn,
												setupGen)
										}
									});
									that.setacktypes(1)
								}
							}
							setTimeout(() => {
								if (item.properties.notify) {
									uni.setStorageSync("deviceIdwatch", deviceId)
									uni.setStorageSync("serviceIdwatch", BPW1serviceId)
									that.bpw1PendingResumeSchedule = true
									uni.setStorageSync("landcharacteristicId", item.uuid)
									that.notifyUuid = res.characteristics[i].uuid
									uni.notifyBLECharacteristicValueChange({
										state: true, // 启用 notify 功能
										deviceId: deviceId,
										serviceId: BPW1serviceId,
										characteristicId: BPW1notify,
										success: (notifyres) => {
											that.onBLECharacteristicValueChange3(
												deviceId,
												BPW1serviceId,
												deviceSn);
										},
										fail: (notifyerr) => {}
									})
								}
							}, 500)
						}
					},
					fail(failres) {
						console.error('【获取蓝牙设备某个服务中所有特征值失败22】', failres)
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.disconnectAll(deviceId)
						that.setacktypes(0)
						that.resetBpw1HistorySyncOnDisconnect('characteristics_fail')
						that.deviceList = that.deviceList.filter(item => item !== deviceId);
						that.getUserInfo()
						uni.getNetworkType({
							success: function(getNetworkTyperes) {
								if (getNetworkTyperes.networkType === 'none') {
									that.aaaa(uni.getStorageSync("lixianlist"))
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
					}
				})
			},
			getBLEDeviceCharacteristics6(deviceId, serviceId, deviceSn) {
				let that = this;
				that.registerBpw6BleConnectionMonitor();
				if (that.characteristicsCache.has(deviceId)) {
					if (!that.hasSynced6) {
						that.hasSynced6 = true;
					}
					that.registerBpw6BleNotifyListener(deviceId, deviceSn)
					uni.openBluetoothAdapter({
						success: async () => {
							that.bpw6BleLastConnected = true;
							try {
								notifyQxBleWatchConnectionState(true, deviceId);
							} catch (e) {}
							that.refreshBpw6BleConnectionState('characteristics-cache');
							try {
								await u16proBLE.ensureBcServiceReady(deviceId, {
									force: true
								})
							} catch (err) {
								console.warn('【BPW6】PPG自定义服务notify启用失败', err)
							}
						},
						fail: (err) => {
							console.error('蓝牙适配器初始化失败', err);
							that.handleBpw6BleDisconnected(deviceId, 'openBluetoothAdapter-fail');
							that.queryDevices();
						}
					});
					return;
				}
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: BPW6SERVICE,
					success: (res) => {
						that.characteristicsCache.add(deviceId); // 缓存设备ID
						that.bpw6BleLastConnected = true;
						that.registerBpw6BleConnectionMonitor();
						that.deviceIdwatch6 = deviceId
						uni.setStorageSync("BPW6devicemac", deviceId)
						try {
							notifyQxBleWatchConnectionState(true, deviceId);
						} catch (e) {}
						for (let i = 0; i < res.characteristics.length; i++) {
							const item = res.characteristics[i];
							if (that.acktypes6 === 0) {
								// 处理可写入的特征值（只执行一次）
								if (item.properties.write) {
									try {
										if (!that.hasWriten) {
											that.hasWriten = true;
											// 连接后主链路约 4s 内会连续写校时/电量/开关，外加历史同步；立即 PPG 需等过此窗口
											that.bpw6PostConnectSetupUntil = Date.now() + 12000
											// 连接成功后同步时间
											// if (that.loact === "境内") {
											u16proBLE.setTime(new Date(), 0, deviceId) // 同步时间0=中文
											// } else {
											// 	u16proBLE.setTime(new Date(), 1, deviceId) // 同步时间1=英文
											// }
											setTimeout(async () => {
												if (that.shouldDeferBleReconnectForPpg())
													return
												u16proBLE.readBattery(deviceId); //读取手表电量
											}, 1000);
											setTimeout(() => {
												if (that.shouldDeferBleReconnectForPpg())
													return
												u16proBLE.setHRAuto(false, deviceId) //开关心率自动测量
											}, 2000);
											setTimeout(() => {
												if (that.shouldDeferBleReconnectForPpg())
													return
												u16proBLE.setSpO2Auto(false,
													deviceId) //开关血氧自动测量
											}, 3000);
										}
										setTimeout(async () => {
											// 立即测量/PPG 启动中：推迟连接后历史同步，避免主链路抢占导致 PPG status=0
											const deferStart = Date.now()
											while ((that.bpw6PpgStartInProgress || that
													.bpw6EmotionPpgActive ||
													(u16proBLE.isPpgOperationInProgress &&
														u16proBLE
														.isPpgOperationInProgress())) &&
												Date.now() - deferStart < 90000) {
												await new Promise(r => setTimeout(r, 2000))
											}
											that.bpw6BpBuffer = []
											that.bpw6HrBuffer = []
											that.bpw6SpO2Buffer = []
											await that.ensureBpw6ServerHistoryLoaded(
												deviceSn)
											await u16proBLE.readDailyInfo(0,
												deviceId) //读取运动/睡眠信息
											that.bpw6BpSyncing = true
											that.bpw6HrSyncing = true
											that.bpw6SpO2Syncing = true
											try {
												await u16proBLE.readLatestBPHistory(50,
													deviceId)
											} catch (bpSyncErr) {
												that.bpw6BpSyncing = false
												console.error('【BPW6】血压历史同步失败', bpSyncErr)
											}
											await u16proBLE.readLatestHRHistory(deviceId)
											try {
												await u16proBLE.readLatestSpO2History(
													deviceId)
											} catch (spo2SyncErr) {
												that.bpw6SpO2Syncing = false
												console.error('【BPW6】血氧历史同步失败',
													spo2SyncErr)
											}
											// // 4.17 读取血压动态测量参数
											// await u16proBLE.readBPDynamicParams(deviceId)
										}, 4000);
									} catch (err) {
										console.error('同步失败:', err);
									}
								}
								that.setacktypes6(1)
							}
							if ((that.devicetype === 30001 && that.devicetypelist
									.length === 1)) {
								const bpTimerConfig = uni.getStorageSync(
									'blood_pressure_timer_config') || {}
								const activeMode = bpTimerConfig.currentMode ||
									'custom'
								const now = new Date()
								const todayKey =
									`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
								const currentHour = now.getHours()
								const targetHour = activeMode === '7d' ? 8 : 6
								const lastSend = uni.getStorageSync(
									'bpw6_bp_dynamic_params_daily_send') || {}
								const alreadySentToday = lastSend.date ===
									todayKey && lastSend.hour === targetHour

								if (currentHour === targetHour && !
									alreadySentToday) {
									if (activeMode === '24h') {
										u16proBLE.setBPDynamicParams({
											enabled: 1,
											startHour: 6,
											dayInterval: 30,
											nightInterval: 60
										}, deviceId)
									} else if (activeMode === '7d') {
										u16proBLE.setBPDynamicParams({
											enabled: 1,
											startHour: 8,
											dayInterval: 30,
											nightInterval: 60
										}, deviceId)
									} else {
										u16proBLE.setBPDynamicParams({
											enabled: 0,
											startHour: 6,
											dayInterval: 30,
											nightInterval: 60
										}, deviceId)
									}
									uni.setStorageSync(
										'bpw6_bp_dynamic_params_daily_send', {
											date: todayKey,
											hour: targetHour
										})
								}
							}
							// 蓝牙消息通知：先注册监听，再按实际特征值启用 notify（兼容不同设备/特征 UUID）
							if (item.properties.notify) {
								that.enableBleCharacteristicNotify({
									deviceId,
									serviceId,
									characteristicId: item.uuid,
									deviceSn
								});
							}
						}

					},
					fail: (failres) => {
						console.error('getBLEDeviceCharacteristics6 失败:', failres);
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.disconnectAll(deviceId)
						that.handleBpw6BleDisconnected(deviceId, 'getBLEDeviceCharacteristics-fail');
						that.getUserInfo()
						uni.getNetworkType({
							success: function(getNetworkTyperes) {
								if (getNetworkTyperes.networkType === 'none') {
									that.aaaa(uni.getStorageSync("lixianlist"))
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
					}
				})
			},

			handleBPDynamicParams(data, source = 'read') {
				const params = {
					enabled: !!data.enabled,
					startHour: data.startHour ?? 0,
					startTime: data.startTime || `${String(data.startHour ?? 0).padStart(2, '0')}:00`,
					dayInterval: data.dayInterval ?? 0,
					nightInterval: data.nightInterval ?? 0,
					rawStartHour: data.rawStartHour,
					updatedAt: Date.now(),
					source
				}
				this.bpDynamicParams = params
				uni.setStorageSync('bpw6_bp_dynamic_params', params)
				uni.$emit('BPW6_BP_DYNAMIC_PARAMS', params)
			},

			/**
			 * BPW6 立即测量 loading。
			 * @param {string} titleKey 文案 key
			 * @param {{ force?: boolean }} [opts] force=true 用于回前台重弹（系统可能已关掉原生框）
			 */
			showBpw6PpgLoading(titleKey = '测量中', opts = {}) {
				// 仅 BPW6「立即测量」弹窗；血压后/定时 PPG 绝不走这里弹窗
				if (!this.hasLiveBpw6EmotionSession() || this.isBpw6AfterBpPpgSession()) {
					return
				}
				const force = !!(opts && opts.force)
				const key = titleKey || '测量中'
				// 同文案已在展示：即使 force 也不 hide/show，避免「云端计算中」连闪
				// 回前台 refresh 会先清 flag 再调，仍可强制重弹
				if (this.bpw6PpgLoadingActive && this.bpw6PpgLoadingTitleKey === key) {
					return
				}
				this.bpw6PpgLoadingActive = true
				this.bpw6PpgLoadingTitleKey = key
				this.bpw6NeedClearLoadingOnShow = false
				try {
					// 仅文案切换或明确 force 时先 hide，再 show（同文案已在上方直接 return）
					if (force) {
						try {
							uni.hideLoading()
						} catch (e0) {}
					}
					uni.showLoading({
						title: this.$t(key),
						mask: true
					})
				} catch (e) {
					console.warn('【BPW6】showLoading失败', e)
				}
			},

			/** 回前台重弹 loading：仅强制一次，避免连弹闪烁 */
			refreshBpw6EmotionImmediateLoading(titleKey, reason = '') {
				const key = titleKey || this.getBpw6EmotionImmediateLoadingTitleKey()
				// 先同步标为未展示，再 force 弹一次（系统切后台常已关掉原生框，但本地 flag 仍为 true）
				this.bpw6PpgLoadingActive = false
				this.bpw6PpgLoadingTitleKey = ''
				this.showBpw6PpgLoading(key, {
					force: true
				})
				if (this._bpw6LoadingRefreshTimer) {
					clearTimeout(this._bpw6LoadingRefreshTimer)
					this._bpw6LoadingRefreshTimer = null
				}
				// 部分机型 onShow 同步弹窗无效：延迟补一次，且仅当仍同阶段且未展示成功时
				this._bpw6LoadingRefreshTimer = setTimeout(() => {
					this._bpw6LoadingRefreshTimer = null
					const still = this.bpw6EmotionPpgPhase === 'measuring' ||
						this.bpw6EmotionPpgPhase === 'transferring' ||
						this.bpw6EmotionPpgActive || this.immediateEmotionMeasure
					if (!still) return
					if (this.bpw6PpgLoadingActive && this.bpw6PpgLoadingTitleKey === key) {
						return
					}
					this.showBpw6PpgLoading(key, {
						force: true
					})
				}, 120)
			},

			setBpw6EmotionPpgPhase(phase) {
				this.bpw6EmotionPpgPhase = phase || ''
				try {
					if (phase === 'measuring' || phase === 'transferring') {
						uni.setStorageSync('bpw6_emotion_ppg_phase', phase)
					} else {
						uni.removeStorageSync('bpw6_emotion_ppg_phase')
					}
				} catch (e) {}
			},

			syncBpw6EmotionPpgPhaseFromStorage() {
				try {
					// 无真实立即测量会话时，不把孤儿 phase 同步回内存
					if (!this.hasLiveBpw6EmotionSession()) {
						const phase = uni.getStorageSync('bpw6_emotion_ppg_phase')
						if (phase === 'measuring' || phase === 'transferring') {
							uni.removeStorageSync('bpw6_emotion_ppg_phase')
						}
						return
					}
					const phase = uni.getStorageSync('bpw6_emotion_ppg_phase')
					if ((phase === 'measuring' || phase === 'transferring') && !this.bpw6EmotionPpgPhase) {
						this.bpw6EmotionPpgPhase = phase
					}
					if (phase === 'transferring') {
						this.bpw6PpgTransferStarted = true
					}
				} catch (e) {}
			},

			beginBpw6PpgTransferLoading() {
				const liveImmediate = this.hasLiveBpw6EmotionSession()
				if (this.bpw6PpgTransferStarted) {
					// 已在传输：只保会话标记；立即测量才维护 phase/弹窗（勿 force，防分块连闪）
					if (liveImmediate) {
						this.setBpw6EmotionPpgPhase('transferring')
						this.markBpw6PpgSessionBusy('BPW6 PPG传输中')
						this.showBpw6PpgLoading('云端数据计算中')
					} else {
						this.setEmotionMeasureBusy(true, 'BPW6 PPG传输中-静默')
					}
					return
				}
				this.bpw6PpgTransferStarted = true
				if (liveImmediate) {
					this.setBpw6EmotionPpgPhase('transferring')
					this.markBpw6PpgSessionBusy('BPW6 PPG传输开始')
					// 首次从「测量中」切到云端：允许 force 一次以更新文案
					this.showBpw6PpgLoading('云端数据计算中', {
						force: true
					})
					return
				}
				// 血压后/定时：静默置灰，不写立即测量 phase、不弹窗
				this.setEmotionMeasureBusy(true, 'BPW6 PPG传输开始-静默')
			},

			hideBpw6PpgLoading(force = false) {
				if (!force && !this.bpw6PpgLoadingActive) {
					return
				}
				if (this._bpw6LoadingRefreshTimer) {
					clearTimeout(this._bpw6LoadingRefreshTimer)
					this._bpw6LoadingRefreshTimer = null
				}
				if (this._bpw6ImmediateLoadingKickTimer) {
					clearTimeout(this._bpw6ImmediateLoadingKickTimer)
					this._bpw6ImmediateLoadingKickTimer = null
				}
				this.bpw6PpgLoadingActive = false
				this.bpw6PpgLoadingTitleKey = ''
				// 非强制：不清除传输中标记，避免切后台 hideLoading 后回前台误判空闲
				if (force) {
					this.bpw6PpgTransferStarted = false
					if (!this.bpw6EmotionPpgActive && !this.immediateEmotionMeasure) {
						this.setBpw6EmotionPpgPhase('')
					}
				}
				try {
					uni.hideLoading()
				} catch (e) {}
			},

			waitBpw6BpHistoryReadDone(maxMs = 12000) {
				return new Promise(async (resolve) => {
					const start = Date.now()
					while (
						u16proBLE.readingState &&
						u16proBLE.readingState.isReadingBPHistory &&
						Date.now() - start < maxMs
					) {
						await new Promise(r => setTimeout(r, 200))
					}
					resolve()
				})
			},
			/**
			 * 血压测量完成后拉最新1条（仅 BPW6）。
			 * 解决：DATA_CHANGED 时大批量历史读卡住 → 不读 BPdata → 不上报。
			 */
			pullBpw6LatestBpAfterMeasure(deviceId) {
				const that = this
				const mac = deviceId || uni.getStorageSync('BPW6devicemac')
				if (!mac || that.bpw6BpSyncing) {
					return
				}
				const now = Date.now()
				if (that._bpw6PullBpAfterMeasureAt && now - that._bpw6PullBpAfterMeasureAt < 1500) {
					return
				}
				that._bpw6PullBpAfterMeasureAt = now
				try {
					const rs = u16proBLE.readingState
					if (rs && rs.isReadingBPHistory) {
						// 已在读最新1条：不打断
						if (rs.expectedBPCount === 1) {
							return
						}
						console.warn('【BPW6】测量后拉血压：打断未完成的历史读')
						rs.isReadingBPHistory = false
						rs.bpBuffer = []
						rs.expectedBPCount = 0
					}
				} catch (e) {}
				u16proBLE.readLatestBPHistory(1, mac).catch(err => {
					console.warn('【BPW6】测量后拉最新血压失败', err)
				})
			},

			/**
			 * 立即测量前等主链路空闲：连接后初始化窗口 + 历史同步，避免抢通道导致 PPG status=0
			 */
			waitBpw6MainSyncIdleForPpg(maxMs = 25000) {
				return new Promise(async (resolve) => {
					const start = Date.now()
					const isBusy = () => {
						const rs = u16proBLE.readingState || {}
						const setupBusy = !!(this.bpw6PostConnectSetupUntil &&
							Date.now() < this.bpw6PostConnectSetupUntil)
						return !!(setupBusy || this.bpw6BpSyncing || this.bpw6HrSyncing || this
							.bpw6SpO2Syncing ||
							rs.isReadingBPHistory || rs.isReadingHRHistory || rs
							.isReadingSpO2History)
					}
					if (isBusy()) {
						console.log('【BPW6】立即测量等待主链路空闲', {
							setupLeftMs: Math.max(0, (this.bpw6PostConnectSetupUntil || 0) -
								Date
								.now()),
							bp: !!this.bpw6BpSyncing,
							hr: !!this.bpw6HrSyncing,
							spo2: !!this.bpw6SpO2Syncing
						})
					}
					while (isBusy() && Date.now() - start < maxMs) {
						await new Promise(r => setTimeout(r, 250))
					}
					if (isBusy()) {
						console.warn('【BPW6】等待历史同步空闲超时，继续尝试PPG')
					} else {
						// 短暂沉降，避免尾包仍在路上
						await new Promise(r => setTimeout(r, 800))
					}
					resolve()
				})
			},

			scheduleBpw6PpgAfterBp(deviceId) {
				// 血压完成后等待 PPG 期间即置灰，避免可点「立即测量」
				// 与 BPW1 一致：延迟 25 秒再启动 PPG
				this.markBpw6AfterBpPpgBusy('BPW6血压后等待PPG')
				if (this.bpw6PendingPpgTimer) {
					clearTimeout(this.bpw6PendingPpgTimer)
				}
				this.bpw6PendingPpgTimer = setTimeout(() => {
					this.bpw6PendingPpgTimer = null
					if (this.bpw6PendingPpgAfterBp && !this.bpw6BpSyncing) {
						this.bpw6PendingPpgAfterBp = false
						this.startBpw6PpgAfterBpMeasurement(deviceId)
					}
				}, 25000)
			},

			tryStartBpw6PpgAfterBp(deviceId) {
				if (!this.bpw6PendingPpgAfterBp || this.bpw6BpSyncing) {
					return
				}
				// 25s 延迟未到：勿提前启动，等 scheduleBpw6PpgAfterBp 到期
				if (this.bpw6PendingPpgTimer) {
					return
				}
				this.bpw6PendingPpgAfterBp = false
				this.startBpw6PpgAfterBpMeasurement(deviceId)
			},

			async startBpw6PpgAfterBpMeasurement(deviceId) {
				// 血压后 PPG：不弹窗，但按钮置灰直到结束
				this.markBpw6AfterBpPpgBusy('BPW6血压后PPG')
				const ok = await this.startBpw6PpgMeasurementCore(deviceId, {
					skipBpWait: false,
					fromEmotionImmediate: false
				})
				if (!ok && !this.bpw6PpgMeasuring && !this.bpw6EmotionPpgActive) {
					this.restoreEmotionPageButtons('BPW6血压后PPG启动失败')
				}
				return ok
			},

			/**
			 * BPW6 启动 PPG 测量核心。
			 * @param {string} deviceId
			 * @param {{ skipBpWait?: boolean, fromEmotionImmediate?: boolean }} options
			 * @returns {Promise<boolean>} 是否启动成功
			 */
			async startBpw6PpgMeasurementCore(deviceId, options = {}) {
				const skipBpWait = options.skipBpWait === true
				const fromEmotionImmediate = options.fromEmotionImmediate === true
				const targetDeviceId = deviceId || uni.getStorageSync('BPW6devicemac')
				if (!targetDeviceId) {
					return false
				}
				if (!skipBpWait && this.bpw6BpSyncing) {
					return false
				}
				// 立即测量：若上一次启动锁未释放，短等而非直接判失败（避免误关「测量中」）
				if (this.bpw6PpgStartInProgress) {
					if (!fromEmotionImmediate) {
						return false
					}
					const waitStart = Date.now()
					while (this.bpw6PpgStartInProgress && Date.now() - waitStart < 8000) {
						await new Promise(r => setTimeout(r, 200))
					}
					if (this.bpw6PpgStartInProgress) {
						console.warn('【BPW6】立即测量等待启动锁超时')
						return false
					}
				}
				this.bpw6PpgStartInProgress = true
				let started = false
				try {
					if (fromEmotionImmediate) {
						// 首次绑定常见：连接后初始化/历史同步与 PPG 并发 → 设备 status=0
						await this.waitBpw6MainSyncIdleForPpg(25000)
						await new Promise(resolve => setTimeout(resolve, 800))
					} else if (!skipBpWait) {
						await this.waitBpw6BpHistoryReadDone()
						await new Promise(resolve => setTimeout(resolve, 3000))
					} else {
						await new Promise(resolve => setTimeout(resolve, 300))
					}
					// 立即测量：有缓存 UUID 则勿反复 force rediscover（会打断主链路/加剧 status=0）
					try {
						const bcReady = !!(u16proBLE.bcServiceId && u16proBLE.bcWriteCharId &&
							u16proBLE.isBcNotifying)
						const needForce = fromEmotionImmediate && !bcReady
						await u16proBLE.ensureBcServiceReady(targetDeviceId, {
							force: needForce
						})
					} catch (bcErr) {
						console.warn('【BPW6】PPG通道准备失败', bcErr)
						if (fromEmotionImmediate) {
							try {
								await new Promise(r => setTimeout(r, 400))
								await u16proBLE.ensureBcServiceReady(targetDeviceId, {
									force: true
								})
							} catch (bcErr2) {
								console.warn('【BPW6】PPG通道二次准备失败', bcErr2)
							}
						}
					}
					// 首次绑定/尚未收到过 BC notify：多等一会再发 PPG，降低设备拒绝(status=0)
					const neverBc = !u16proBLE._lastBcNotifyTime
					await new Promise(resolve => setTimeout(resolve, neverBc ? 2800 : 400))
					if (fromEmotionImmediate && neverBc) {
						// 再等主链路一轮，避免首次绑定历史同步尾包与 0x4A 打架
						await this.waitBpw6MainSyncIdleForPpg(15000)
						await new Promise(resolve => setTimeout(resolve, 600))
					}

					const maxAttempts = fromEmotionImmediate ? 4 : 3
					let lastResult = null
					for (let attempt = 1; attempt <= maxAttempts; attempt++) {
						if (fromEmotionImmediate && this.bpw6EmotionPpgActive) {
							this.showBpw6PpgLoading('测量中', {
								force: attempt === 1
							})
						}
						if (u16proBLE.isPpgOperationInProgress && u16proBLE.isPpgOperationInProgress()) {
							await new Promise(r => setTimeout(r, 1500))
						}
						// 重试前再等主链路空闲（历史同步可能刚插入）
						if (fromEmotionImmediate && attempt > 1) {
							await this.waitBpw6MainSyncIdleForPpg(12000)
							await new Promise(r => setTimeout(r, 800 * attempt))
						}
						try {
							// 按机型档案跳过 0x49；两机档案互不覆盖
							if (u16proBLE.ensurePpgPreferForDevice) {
								u16proBLE.ensurePpgPreferForDevice(targetDeviceId)
							}
							const profile = u16proBLE.getPpgDeviceProfile ?
								u16proBLE.getPpgDeviceProfile(targetDeviceId) :
								''
							const skip49Now = profile === 'standard' || profile === 'compat' ||
								!!u16proBLE._ppgPrefer4AStart ||
								(fromEmotionImmediate && attempt > 1 && !!profile)
							const notifyReady = !!(u16proBLE.isBcNotifying && u16proBLE.bcWriteCharId)
							lastResult = await u16proBLE.startPPGMeasurementWithDuration(60,
								targetDeviceId, true, {
									// 仅通道未就绪时 force；已就绪勿 rediscover（日志里「BC notify 需要启用」会加剧 status=0）
									forceNotify: fromEmotionImmediate && attempt === 1 && !notifyReady,
									skip49: skip49Now,
									// 立即测量：缩短内部空等，失败由本层快速重试；勿动血压后/定时默认长等待
									immediateMode: fromEmotionImmediate
								})
							if (lastResult && lastResult.success) {
								started = true
								// 启动成功即标记测量中（勿只靠 notify 回调，否则测完 0x4B 可能判不到 inMeasuring）
								this.bpw6PpgMeasuring = true
								if (fromEmotionImmediate) {
									// 迟到启动成功时，可能已因 0x58 进入传数/云端：绝打回「测量中」
									if (this.bpw6EmotionPpgPhase === 'transferring' ||
										this.bpw6PpgTransferStarted || this.bpw6PpgFinishing) {
										this.setBpw6EmotionPpgPhase('transferring')
										this.showBpw6PpgLoading('云端数据计算中')
									} else {
										this.setBpw6EmotionPpgPhase('measuring')
										this.showBpw6PpgLoading('测量中', {
											force: true
										})
									}
									// 挂起等 0x58：不依赖 notify 转发，保证能进「云端数据计算中」
									this.armBpw6PpgCompleteWatch(targetDeviceId)
								}
								// 血压后/定时：静默，不 toast、不 loading
								return true
							}
							// 重试间隙：0x58 可能已到并进入云端，视为启动成功
							if (fromEmotionImmediate && (this.bpw6EmotionPpgPhase === 'transferring' ||
									this.bpw6PpgTransferStarted || this.bpw6PpgFinishing)) {
								return true
							}
						} catch (ppgErr) {
							console.error(`【BPW6】PPG测量启动失败(第${attempt}次)`, ppgErr)
							lastResult = null
						}
						if (attempt < maxAttempts) {
							// 已在云端则不再空转重试启动
							if (fromEmotionImmediate && (this.bpw6EmotionPpgPhase === 'transferring' ||
									this.bpw6PpgTransferStarted || this.bpw6PpgFinishing)) {
								return true
							}
							const retryWait = fromEmotionImmediate ? (2500 * attempt) : (2000 * attempt)
							await new Promise(r => setTimeout(r, retryWait))
						}
					}
					// 最后仍失败：若 0x58 已拉起传数，仍算成功（勿走 fail 清会话）
					if (fromEmotionImmediate && (this.bpw6EmotionPpgPhase === 'transferring' ||
							this.bpw6PpgTransferStarted || this.bpw6PpgFinishing)) {
						return true
					}
					// 非立即测量启动失败：静默（不 toast）
					// 立即测量：保留 loading，由外层 notifyBpw6EmotionImmediateFail 统一关闭
					return false
				} finally {
					this.bpw6PpgStartInProgress = false
					// 立即测量失败由外层 notifyBpw6EmotionImmediateFail 统一清 loading
				}
			},

			handleBPW6PPGCommand(data, deviceId, deviceSn) {
				const cmd = data && data.cmd
				const phase = this.bpw6EmotionPpgPhase
				const inTransfer = phase === 'transferring' || this.bpw6PpgTransferStarted ||
					this.ppgUploadInProgress || this.bpw6PpgFinishing
				const inMeasuring = phase === 'measuring' || !!this.bpw6PpgMeasuring
				const emotionImmediate = this.isBpw6EmotionImmediateUi()
				const ppgStartBusy = !!(this.bpw6PpgStartInProgress ||
					(u16proBLE.isPpgOperationInProgress && u16proBLE.isPpgOperationInProgress()))
				const keepCloudUi = () => {
					// 血压后 PPG：绝不弹云端提示
					if (this.isBpw6AfterBpPpgSession()) {
						return
					}
					if (emotionImmediate || this.immediateEmotionMeasure || this
						.bpw6EmotionPpgActive) {
						this.setBpw6EmotionPpgPhase('transferring')
						this.bpw6PpgTransferStarted = true
						this.markBpw6PpgSessionBusy('BPW6停止应答-保持云端计算')
						// 已在云端文案则不再 force，避免连闪
						this.showBpw6PpgLoading('云端数据计算中')
					}
				}
				/** 测量已开始后的 0x4B（成功或失败）都按「测量结束」拉数，兼容无 0x58 固件 */
				const treatStopAsComplete = () => {
					console.log('【BPW6】0x4B视为测量完成(兼容无0x58)，拉取PPG数据', {
						success: !!(data && data.success),
						status: data && data.status,
						phase,
						afterBp: this.isBpw6AfterBpPpgSession(),
						emotionImmediate
					})
					// 仅「立即测量」才复活会话并弹「云端数据计算中」；血压后/定时绝不可劫持成立即测量
					if (emotionImmediate || this.bpw6EmotionPpgActive) {
						const wasMeasuring = !!this.bpw6PpgMeasuring || phase === 'measuring' ||
							phase === 'transferring'
						const startedAt = this.bpw6EmotionPpgStartedAt || 0
						const recentStart = startedAt > 0 && (Date.now() - startedAt < 10 * 60 * 1000)
						if (wasMeasuring || this.immediateEmotionMeasure ||
							this.sleep_alertid === 1 || this.bpw6PpgLoadingActive || recentStart) {
							this.bpw6EmotionPpgActive = true
							this.immediateEmotionMeasure = true
							this.sleep_alertid = 1
							this.setBpw6EmotionPpgPhase('transferring')
							this.bpw6PpgTransferStarted = true
							this.bpw6CloudWaitStartedAt = Date.now()
							this.markBpw6PpgSessionBusy('BPW6兼容0x4B完成-云端计算')
							this.showBpw6PpgLoading('云端数据计算中', {
								force: true
							})
						}
					}
					this.bpw6PpgMeasuring = false
					this.handleBPW6PPGComplete(data, deviceId, deviceSn)
				}

				if (data.success) {
					// 0x58 完成通知：必须进拉数/云端计算（勿当普通启停命令丢掉）
					if (cmd === 0x58 || data.completed === true || data.type ===
						'ppg_measurement_complete') {
						this.handleBPW6PPGComplete(data, deviceId, deviceSn)
						return
					}
					if (cmd === 0x4B) {
						// 启动/降级过程中的停止应答绝不当「测完」（否则会拉空数据并结束会话）
						if (ppgStartBusy) {
							console.warn('【BPW6】启动流程中忽略0x4B成功应答', data)
							return
						}
						// 仅静默预停止守卫窗内忽略；勿用「启动后8秒」误吞真正测完的 0x4B
						const silentGuardUntil = u16proBLE._ppgSilentStopGuardUntil || 0
						if (silentGuardUntil && Date.now() < silentGuardUntil) {
							console.warn('【BPW6】忽略启动预停止迟到的0x4B(保持测量中)', {
								guardLeftMs: Math.max(0, silentGuardUntil - Date.now()),
								phase
							})
							return
						}
						this.bpw6PpgMeasuring = false
						if (inTransfer) {
							keepCloudUi()
							return
						}
						// 测量中 / 立即测量会话中：无 0x58 时只靠 0x4B 结束
						if (inMeasuring || this.bpw6EmotionPpgActive || this.immediateEmotionMeasure ||
							this.sleep_alertid === 1 || this.bpw6PpgLoadingActive) {
							treatStopAsComplete()
							return
						}
						this.hideBpw6PpgLoading()
						this.endBpw6QxScheduledMeasureIfNeeded('BPW6 PPG停止命令')
					} else if (cmd === 0x4A || cmd === 0x49) {
						// 已在传数/云端：迟到的启动应答不得把「云端计算中」打回「测量中」
						if (inTransfer || phase === 'transferring') {
							console.log('【BPW6】忽略传输中迟到的启动应答，保持云端计算中', {
								cmd,
								phase
							})
							keepCloudUi()
							return
						}
						this.bpw6PpgMeasuring = true
						this.bpw6PpgRawBuffer = []
						this.bpw6PpgDataSize = 0
						// 三种路径都置灰；传输结束前 storage 会话标记不丢
						this.markBpw6PpgSessionBusy('BPW6 PPG测量开始')
						// 立即测量才弹「测量中」；血压后/定时仅置灰、无任何提示
						if (emotionImmediate) {
							this.setBpw6EmotionPpgPhase('measuring')
							this.showBpw6PpgLoading('测量中')
						}
					}
				} else {
					console.warn('【BPW6】PPG测量命令失败', data)
					// 启动重试进行中：失败由 startBpw6PpgMeasurementCore 统一处理
					if (this.bpw6PpgStartInProgress) {
						this.bpw6PpgMeasuring = false
						return
					}
					// 协议层启动锁中：勿清会话 / 勿把 0x4B 当测完
					if ((cmd === 0x49 || cmd === 0x4A || cmd === 0x4B) &&
						u16proBLE.isPpgOperationInProgress && u16proBLE.isPpgOperationInProgress()) {
						console.warn('【BPW6】PPG启动流程中忽略失败应答', data)
						return
					}
					// 已在传数/云端：停止失败帧只保「云端计算中」，勿清会话
					if (cmd === 0x4B && inTransfer) {
						keepCloudUi()
						return
					}
					// 测量已进行中 / 立即测量会话中的 0x4B（部分固件结束帧 success=false）：仍按完成拉数
					if (cmd === 0x4B && (inMeasuring || this.bpw6EmotionPpgActive ||
							(emotionImmediate && phase === 'measuring'))) {
						const silentGuardUntil2 = u16proBLE._ppgSilentStopGuardUntil || 0
						if (silentGuardUntil2 && Date.now() < silentGuardUntil2) {
							console.warn('【BPW6】忽略启动预停止迟到的0x4B失败帧(保持测量中)', data)
							return
						}
						treatStopAsComplete()
						return
					}
					// 定时测量后台「不等应答」：0x49/0x4A 失败应答可能迟到，且协议层会降级 0x4A；
					// 勿因此清会话（立即测量仍走下方失败路径）
					{
						const isStartCmd = cmd === 0x49 || cmd === 0x4A
						let isScheduled = false
						try {
							const scheduled = uni.getStorageSync('qx_ble_scheduled_measure')
							isScheduled = scheduled === 1 || scheduled === '1'
						} catch (e) {}
						if (isStartCmd && isScheduled && !emotionImmediate) {
							console.warn('【BPW6】定时测量忽略启动失败应答(可降级0x4A)', data)
							return
						}
						// 立即测量：启动失败帧一律交由 startBpw6PpgMeasurementCore；
						// 勿在应答回调里清会话（易与 0x4A 降级/重试竞态，表现为「一点就失败」）
						if (isStartCmd && emotionImmediate) {
							console.warn('【BPW6】立即测量忽略启动失败应答(交由启动流程)', data)
							return
						}
					}
					this.bpw6PpgMeasuring = false
					// 仅启动后很短窗口内的迟到失败应答交给启动流程；勿把「测完后的停止帧」吞掉导致卡在测量中
					const startedAt = this.bpw6EmotionPpgStartedAt || 0
					const inStartWindow = startedAt > 0 && (Date.now() - startedAt < 15000)
					if (emotionImmediate && this.bpw6EmotionPpgActive &&
						phase !== 'transferring' && phase !== 'measuring' && inStartWindow) {
						console.warn('【BPW6】立即测量启动阶段失败应答，交由启动流程处理')
						return
					}
					if (emotionImmediate) {
						this.notifyBpw6EmotionImmediateFail('请检查设备连接', 'BPW6 PPG命令失败')
					} else {
						this.hideBpw6PpgLoading()
						this.endBpw6QxScheduledMeasureIfNeeded('BPW6 PPG命令失败')
					}
				}
			},

			/**
			 * 立即测量启动成功后挂起等 0x58（仅补「云端计算中」入口，不改启动协议）
			 */
			armBpw6PpgCompleteWatch(deviceId) {
				if (this._bpw6PpgCompleteWatchArmed) {
					return
				}
				const targetDeviceId = deviceId || uni.getStorageSync('BPW6devicemac')
				const deviceSn = uni.getStorageSync('BPW6deviceSn')
				if (!targetDeviceId || !u16proBLE.watchPpgMeasurementComplete) {
					return
				}
				this._bpw6PpgCompleteWatchArmed = true
				console.log('【BPW6】已挂起等待完成通知(0x58/兼容0x4B)→云端计算中')
				u16proBLE.watchPpgMeasurementComplete(5 * 60 * 1000).then((payload) => {
					this._bpw6PpgCompleteWatchArmed = false
					// phase 为空时仍须进完成（兼容机常见）；勿因标记不全一直停在「测量中」
					const canComplete = !!(this.bpw6EmotionPpgActive || this
						.immediateEmotionMeasure ||
						this.bpw6PpgMeasuring || this.bpw6PpgLoadingActive ||
						this.bpw6EmotionPpgPhase === 'measuring' ||
						this.bpw6EmotionPpgPhase === 'transferring' ||
						this.sleep_alertid === 1 ||
						(this.bpw6EmotionPpgStartedAt > 0 &&
							Date.now() - this.bpw6EmotionPpgStartedAt < 10 * 60 * 1000))
					if (!canComplete) {
						console.warn('【BPW6】watch完成但会话已结束，忽略', payload)
						return
					}
					console.log('【BPW6】watch等到完成帧，进入云端计算/拉数', payload)
					this.handleBPW6PPGComplete(payload || {
						success: true,
						cmd: 0x58,
						completed: true,
						type: 'ppg_measurement_complete'
					}, targetDeviceId, deviceSn)
				}).catch((err) => {
					this._bpw6PpgCompleteWatchArmed = false
					const msg = err && err.message ? err.message : String(err || '')
					if (msg.indexOf('已由0x4B完成') >= 0) {
						return
					}
					console.warn('【BPW6】等待完成通知结束', msg)
				})
			},

			async handleBPW6PPGComplete(data, deviceId, deviceSn) {
				// 兼容 0x4B 完成时取消仍在等的 0x58 watch（日志 pendingKeys:["88"]）
				this._bpw6PpgCompleteWatchArmed = false
				if (u16proBLE.cancelPpgMeasurementCompleteWatch) {
					u16proBLE.cancelPpgMeasurementCompleteWatch()
				}
				const isAfterBp = this.isBpw6AfterBpPpgSession()
				// 定时会话：绝不可因 bpw6PpgMeasuring 等标志劫持成立即测量（否则不调 end 会话，调度会假「测量进行中」约5分钟）
				let isScheduledMeasure = false
				try {
					const scheduled = uni.getStorageSync('qx_ble_scheduled_measure')
					isScheduledMeasure = scheduled === 1 || scheduled === '1'
				} catch (eSched) {}
				// 测完弹「云端数据计算中」：仅真正立即测量；血压后/定时静默（对齐 0x4B treatStopAsComplete）
				const alreadyImmediate = !!(this.bpw6EmotionPpgActive || this.immediateEmotionMeasure)
				const startedAt = this.bpw6EmotionPpgStartedAt || 0
				const recentImmediate = !isAfterBp && !isScheduledMeasure && startedAt > 0 &&
					(Date.now() - startedAt < 10 * 60 * 1000)
				const phaseBusy = this.bpw6EmotionPpgPhase === 'measuring' ||
					this.bpw6EmotionPpgPhase === 'transferring'
				const shouldCloud = !isAfterBp && !isScheduledMeasure && alreadyImmediate && !!(
					this.bpw6EmotionPpgActive || this.immediateEmotionMeasure ||
					this.sleep_alertid === 1 || recentImmediate ||
					phaseBusy || this.bpw6PpgLoadingActive || this.bpw6PpgTransferStarted ||
					this.bpw6PpgMeasuring)
				if (shouldCloud) {
					this.bpw6EmotionPpgActive = true
					this.immediateEmotionMeasure = true
					if (!this.sleep_alertid) {
						this.sleep_alertid = 1
					}
				}
				const showCloudUi = () => {
					this.setBpw6EmotionPpgPhase('transferring')
					this.bpw6PpgTransferStarted = true
					this.markBpw6PpgSessionBusy('BPW6 PPG进入云端计算')
					this.showBpw6PpgLoading('云端数据计算中', {
						force: true
					})
				}
				// 0x58 与兼容路径 0x4B 可能连续触发，避免重复拉数；但必须保住「云端计算中」UI
				if (this.bpw6PpgFinishing || (u16proBLE.isPpgManagedRead && u16proBLE
						.isPpgManagedRead())) {
					console.log('【BPW6】PPG完成拉取进行中，跳过重复触发')
					if (shouldCloud) {
						showCloudUi()
					}
					return
				}
				console.log('【BPW6】PPG测量完成', data)
				this.bpw6PpgMeasuring = false
				this.bpw6PpgFinishing = true
				// 进入云端阶段：清掉启动期补弹「测量中」的定时器，避免盖住云端文案
				if (this._bpw6ImmediateLoadingKickTimer) {
					clearTimeout(this._bpw6ImmediateLoadingKickTimer)
					this._bpw6ImmediateLoadingKickTimer = null
				}
				// 先切阶段再 await，避免切页 onShow 仍按 measuring 弹「测量中」
				if (shouldCloud) {
					this.bpw6CloudWaitStartedAt = Date.now()
					showCloudUi()
				}
				this.beginBpw6PpgTransferLoading()
				this.markBpw6PpgSessionBusy('BPW6 PPG测量完成进入传输')
				try {
					const result = await u16proBLE.readAllPPGData(deviceId)
					if (result && result.ppgData && result.ppgData.length) {
						if (shouldCloud || this.bpw6EmotionPpgActive) {
							showCloudUi()
						}
						this.handleBPW6PPGData({
							type: 'ppg_data',
							ppgData: result.ppgData,
							completed: true
						}, deviceId, deviceSn)
					} else {
						console.log('【BPW6】PPG数据为空', result)
						this.bpw6PpgFinishing = false
						if (!isAfterBp && (this.isBpw6EmotionImmediateUi() || recentImmediate ||
								shouldCloud)) {
							this.notifyBpw6EmotionImmediateFail('数据解析失败请重新测量', 'BPW6 PPG数据为空')
						} else {
							this.hideBpw6PpgLoading(true)
							this.endBpw6QxScheduledMeasureIfNeeded('BPW6 PPG数据为空')
						}
					}
				} catch (err) {
					console.error('【BPW6】PPG数据读取失败', err)
					this.bpw6PpgFinishing = false
					if (!isAfterBp && (this.isBpw6EmotionImmediateUi() || recentImmediate ||
							shouldCloud)) {
						this.notifyBpw6EmotionImmediateFail('数据解析失败请重新测量', 'BPW6 PPG读取失败')
					} else {
						this.hideBpw6PpgLoading(true)
						this.endBpw6QxScheduledMeasureIfNeeded('BPW6 PPG读取失败')
					}
				}
			},

			handleBPW6PPGSize(data) {
				if (u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead()) {
					return
				}
				this.bpw6PpgRawBuffer = []
				this.bpw6PpgDataSize = data.size || 0
				console.log('【BPW6】PPG数据大小:', this.bpw6PpgDataSize, 'bytes')
			},

			handleBPW6PPGChunk(data, deviceId, deviceSn) {
				// 托管拉数路径：完成回调已切到「云端计算中」，分块勿反复刷 loading
				if (u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead()) {
					return
				}
				this.beginBpw6PpgTransferLoading()
				if (data.ppgData && data.ppgData.length) {
					this.bpw6PpgRawBuffer.push(...data.ppgData)
				}
				console.log('【BPW6】PPG数据块 偏移:', data.offset,
					'块大小:', data.chunkSize,
					'累计:', this.bpw6PpgRawBuffer.length, '/', this.bpw6PpgDataSize)
				if (this.bpw6PpgDataSize > 0 &&
					this.bpw6PpgRawBuffer.length >= this.bpw6PpgDataSize) {
					this.uploadBPW6PPGRawData(deviceId, deviceSn)
				}
			},

			handleBPW6PPGData(data, deviceId, deviceSn) {
				if (u16proBLE.isPpgManagedRead && u16proBLE.isPpgManagedRead()) {
					return
				}
				if (data.ppgData && data.ppgData.length) {
					this.bpw6PpgRawBuffer = [...data.ppgData]
				}
				console.log('【BPW6】PPG原始数据接收完成, 大小:', data)
				console.log('【BPW6】PPG原始数据接收完成, 大小:', this.bpw6PpgRawBuffer.length)
				this.uploadBPW6PPGRawData(deviceId, deviceSn)
			},

			uploadBPW6PPGRawData(deviceId, deviceSn) {
				if (!this.bpw6PpgRawBuffer.length) {
					this.bpw6PpgFinishing = false
					if (this.isBpw6EmotionImmediateUi()) {
						this.notifyBpw6EmotionImmediateFail('数据解析失败请重新测量', 'BPW6 PPG无数据可上传')
						return
					}
					if (this.bpw6PpgTransferStarted || this.bpw6PpgLoadingActive) {
						this.hideBpw6PpgLoading(true)
					}
					this.endBpw6QxScheduledMeasureIfNeeded('BPW6 PPG无数据可上传')
					return
				}
				if (this.ppgUploadInProgress) {
					console.log('【BPW6】PPG上传进行中，跳过重复上传（保持会话/云端计算中）')
					// 切勿 end/restore：重复触发常见于分块完成与 complete 双路径，误恢复会关掉「云端计算中」
					this.markBpw6PpgSessionBusy('BPW6 PPG上传中-跳过重复')
					if (this.bpw6EmotionPpgActive || this.immediateEmotionMeasure) {
						this.setBpw6EmotionPpgPhase('transferring')
						this.showBpw6PpgLoading('云端数据计算中')
					}
					return
				}
				this.ppgUploadInProgress = true
				this.markBpw6PpgSessionBusy('BPW6 PPG上传中')
				const rawBytes = [...this.bpw6PpgRawBuffer]
				console.log('【BPW6】PPG原始数据长度:', rawBytes.length)
				// 长包协议：PPG 为小端 32 位 ADC（200Hz）；仍按 INT16 上传以兼容现有云端接口
				const samples = U16ProProtocol.parsePpgAdcSamples(rawBytes).samples || []
				if (!samples.length) {
					console.warn('【BPW6】PPG字节无法组成Int32采样，跳过上传', rawBytes.length)
					this.ppgUploadInProgress = false
					this.bpw6PpgFinishing = false
					if (this.isBpw6EmotionImmediateUi()) {
						this.notifyBpw6EmotionImmediateFail('数据解析失败请重新测量', 'BPW6 PPG字节无法组成Int32采样')
						return
					}
					if (this.bpw6PpgTransferStarted || this.bpw6PpgLoadingActive) {
						this.hideBpw6PpgLoading(true)
					}
					this.endBpw6QxScheduledMeasureIfNeeded('BPW6 PPG字节无法组成Int32采样')
					return
				}
				const binary = this.packInt16(rawBytes)
				// const binary = this.packBpw6PpgInt32(rawBytes)
				console.log('【BPW6】上传PPG原始数据, bytes:', rawBytes.length, 'samples:', samples.length,
					'rate:', BC_PACKET
					.PPG_SAMPLE_RATE_HZ)
				this.bpw6PpgRawData(binary, deviceSn, deviceId)
				this.bpw6PpgRawBuffer = []
				this.bpw6PpgDataSize = 0
				this.bpw6PpgMeasuring = false
			},

			bpw6PpgRawData(rawData, deviceSn, deviceId) {
				const isImmediate = this.isBpw6EmotionImmediateUi()
				const data = {
					patientId: uni.getStorageSync("userid"),
					deviceSn: deviceSn,
					deviceModel: "U19M",
					samplingRate: 200,
					startTime: this.getTimeAllJSON().YMDHMS,
					dataFormat: "INT32",
					signalRange: 0,
					rawData: rawData,
					dataLength: "",
					signalType: "GREEN",
					ledCurrent: 0,
					ambientLight: 0,
					motionLevel: 0,
					qualityScore: 0,
					qualityVersion: 0,
					processingStatus: "RAW",
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("【BPW6】PPG上传", data, rawData.length)
				// 立即测量：上传阶段显示「云端数据计算中」
				if (isImmediate) {
					this.bpw6PpgTransferStarted = true
					this.setBpw6EmotionPpgPhase('transferring')
					this.bpw6CloudWaitStartedAt = Date.now()
					this.showBpw6PpgLoading('云端数据计算中')
				}
				this.$post(this.$url_APP_IP + "/prod-api/device/ppgdata", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ppgdatares) => {
					console.log("【BPW6】PPG上传结果", ppgdatares)
					if (ppgdatares.code === 200) {
						if (isImmediate) {
							// 上传成功：继续云端计算 loading（勿标 NeedClear，否则回前台会被清掉）
							this.setBpw6EmotionPpgPhase('transferring')
							this.bpw6PpgTransferStarted = true
							this.bpw6CloudWaitStartedAt = this.bpw6CloudWaitStartedAt || Date
								.now()
							this.bpw6NeedClearLoadingOnShow = false
							this.markBpw6PpgSessionBusy('BPW6云端计算中')
							this.showBpw6PpgLoading('云端数据计算中')
							this.deviceppgdatalist(deviceSn, deviceId)
						} else {
							this.bpw6PpgFinishing = false
							this.hideBpw6PpgLoading(true)
							this.deviceppgdatalist(deviceSn, deviceId)
						}
					} else if (isImmediate) {
						this.notifyBpw6EmotionImmediateFail('数据传输失败', 'BPW6 PPG上传业务失败')
					} else {
						this.bpw6PpgFinishing = false
						this.hideBpw6PpgLoading(true)
					}
				}).catch((err) => {
					console.error('【BPW6】PPG上传失败', err)
					if (isImmediate) {
						this.notifyBpw6EmotionImmediateFail('数据传输失败', 'BPW6 PPG上传失败')
					} else {
						this.bpw6PpgFinishing = false
						this.hideBpw6PpgLoading(true)
					}
				}).finally(() => {
					this.ppgUploadInProgress = false
					// 定时标记仍在：上传结束后必须结束调度会话（防止被误标立即测量后一直「测量进行中」）
					let stillScheduled = false
					try {
						const scheduled = uni.getStorageSync('qx_ble_scheduled_measure')
						stillScheduled = scheduled === 1 || scheduled === '1'
					} catch (eSched2) {}
					if (stillScheduled || !isImmediate) {
						this.bpw6PpgFinishing = false
						this.endBpw6QxScheduledMeasureIfNeeded('BPW6定时PPG完成')
						return
					}
					// 立即测量成功后等 deviceppgdatalist 结束会话；失败已在上面 restore
					if (!this.bpw6EmotionPpgActive && !this.immediateEmotionMeasure) {
						// 失败路径已清会话：后台再强制清一次 loading
						this.bpw6NeedClearLoadingOnShow = true
						try {
							uni.hideLoading()
						} catch (e) {}
					} else {
						// 上传请求结束但云端仍在算：保持 transferring
						this.setBpw6EmotionPpgPhase('transferring')
						this.markBpw6PpgSessionBusy('BPW6云端计算中')
						this.showBpw6PpgLoading('云端数据计算中')
					}
				})
			},

			BPW6paredata(data, deviceId, deviceSn) {
				let that = this
				// 备注版协议：测完常见粘包 BC 58 + BC 4B；有 0x58 时只走完成通知拉数
				if (Array.isArray(data)) {
					const hasMeasurementComplete = data.some(
						item => item && (item.type === 'ppg_measurement_complete' ||
							item.cmd === 0x58 || item.completed === true)
					)
					// 先处理 0x58，再处理其余，避免同包 0x4B 抢先
					const ordered = hasMeasurementComplete ? [
						...data.filter(item => item && (item.type === 'ppg_measurement_complete' ||
							item.cmd === 0x58 || item.completed === true)),
						...data.filter(item => item && !(item.type ===
							'ppg_measurement_complete' ||
							item.cmd === 0x58 || item.completed === true))
					] : data
					ordered.forEach(item => {
						if (!item) {
							return
						}
						if (hasMeasurementComplete &&
							item.type === 'ppg_command' &&
							item.cmd === 0x4B) {
							console.log('【BPW6】跳过同包内 0x4B 通知，已由 0x58 触发拉取')
							return
						}
						that.BPW6paredata(item, deviceId, deviceSn)
					})
					return
				}
				if (!data || !data.type) {
					// type 缺失时仍识别 0x58，避免测完丢「云端计算中」
					if (data && (data.cmd === 0x58 || data.completed === true)) {
						that.handleBPW6PPGComplete(data, deviceId, deviceSn)
					}
					return;
				}
				// 0x58 优先：即使被标成 ppg_command 也走完成拉数
				if (data.cmd === 0x58 || data.completed === true || data.type ===
					'ppg_measurement_complete') {
					that.handleBPW6PPGComplete(data, deviceId, deviceSn)
					return
				}
				// console.log('【BPW6】paredata接收到数据:', data.type || "数据统计中");
				// console.log("【BPW6】" + deviceId, deviceSn)
				uni.setStorageSync("BPW6devicemac", deviceId)
				switch (data.type) {
					case 'heartRate': {
						console.log('【BPW6】心率数据:', data.type);
						if (!data.allList || data.allList.length === 0) {
							break;
						}
						const latestHr = [...data.allList].sort((a, b) => b.timestamp - a.timestamp)[
							0];
						if (that.bpw6HrSyncing) {
							that.bpw6HrBuffer = data.allList.map(item => ({
								dateTimeKey: that.formatTimestampKey(item.timestamp),
								heartRate: item.value,
								timestamp: item.timestamp
							}));
						} else {
							that.bpw6HrBuffer = [{
								dateTimeKey: that.formatTimestampKey(latestHr.timestamp),
								heartRate: latestHr.value,
								timestamp: latestHr.timestamp
							}];
						}
						console.log('【BPW6】心率数据:', latestHr.value);
						const latestHrTimeKey = that.formatTimestampKey(latestHr.timestamp);
						console.log('【BPW6】心率数据时间:', latestHrTimeKey);
						let heartRateDatatime = that.datatime(latestHrTimeKey)
						console.log('【BPW6】心率数据时间:', heartRateDatatime);
						console.log('【BPW6】心率数据时间:', uni.getStorageSync("heartRateDatatime"));
						// progressive：仅提前刷卡，不上报（避免读完 finalize 再报一遍）
						// 实时 skipUpload（待重读等）：不上报；连接后历史同步仍上报
						const skipHrUpload = !!(data.progressive) ||
							(!that.bpw6HrSyncing && data.skipUpload === true);
						// 先查服务器再决定刷卡/上报；同槽不同值可更新；避免接口旧值把卡片打回上一条
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {
									return;
								}
								that.syncBpw6HeartRateHomeUi(deviceId, deviceSn, latestHr,
										heartRateDatatime, {
											skipUpload: skipHrUpload
										})
									.finally(() => {
										if (that.bpw6HrSyncing && !data.progressive) {
											that.bpw6HrSyncing = false
										}
									});
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						break;
					}
					case 'BP_MEASUREMENT':
						console.log('点击测量血压');
						break;
					case 'BP_SUCCES':
						console.log('【BPW6】手环完成血压测量，待血压数据同步后启动PPG')
						if (that.bpw6BpSyncing) {
							console.log('【BPW6】血压历史同步中，跳过PPG测量')
							break
						}
						that.bpw6PendingPpgAfterBp = true
						that.markBpw6AfterBpPpgBusy('BPW6血压测量后待PPG')
						that.scheduleBpw6PpgAfterBp(deviceId)
						// DATA_CHANGED 可能因历史读卡住未拉到数据；测量完成后再强制拉最新1条上报
						that.pullBpw6LatestBpAfterMeasure(deviceId)
						break;
					case 'dataupdate':
						// dataType=2 血压：兜底拉最新（与 BLE 内 _handleDataChanged 互补）
						if (Number(data.dataType) === 2) {
							that.pullBpw6LatestBpAfterMeasure(deviceId)
						}
						break;
					case 'HR_history_empty':
						that.bpw6HrSyncing = false
						break;
					case 'bp_dynamic_params':
						that.handleBPDynamicParams(data, 'read')
						break;
					case 'bp_dynamic_params_changed':
						that.handleBPDynamicParams(data, 'notify')
						break;
					case 'ppg_command':
						that.handleBPW6PPGCommand(data, deviceId, deviceSn)
						break;
					case 'ppg_measurement_complete':
						that.handleBPW6PPGComplete(data, deviceId, deviceSn)
						break;
					case 'ppg_size':
						that.handleBPW6PPGSize(data)
						break;
					case 'ppg_chunk':
						that.handleBPW6PPGChunk(data, deviceId, deviceSn)
						break;
					case 'ppg_chunk_error':
						console.warn('【BPW6】PPG数据传输中断', data)
						that.hideBpw6PpgLoading()
						that.endBpw6QxScheduledMeasureIfNeeded('BPW6 PPG传输中断')
						break;
					case 'ppg_data':
						that.handleBPW6PPGData(data, deviceId, deviceSn)
						break;
					case 'BPdata': {
						// console.log("BPW6设备，血压数据", data)
						// 展示/去重键与上报 time 均以设备 timestamp 为准（东八区格式化）
						// 勿用 date.formatted：本地时区墙钟会与 timestamp 不一致
						const bpTs = that.normalizeUnixTimestamp(data.timestamp);
						const recordTimeKey = bpTs != null ?
							that.formatTimestampKey(bpTs) :
							(data.date && data.date.formatted ?
								data.date.formatted : that.getTimeAllJSON().YMDHMS);
						const isNewestRecord = that.bpw6BpBuffer.length === 0;
						// 实时测量：丢掉历史残留，保证本条能刷卡/上报（避免 isNewestRecord=false 丢上报）
						if (!that.bpw6BpSyncing) {
							that.bpw6BpBuffer = [];
						}
						that.bpw6BpBuffer.push({
							dateTimeKey: recordTimeKey,
							timestamp: bpTs,
							highPressure: data.systolic,
							lowPressure: data.diastolic,
							heartRate: data.pulse
						});
						const shouldRefreshAndUpload = isNewestRecord || !that.bpw6BpSyncing;
						// console.log('isNewestRecord:', data);
						// 设备按新→旧推送，首页只展示最新一条；须比接口新且有网才刷新
						if (shouldRefreshAndUpload) {
							let BPW6hexDataupdatewatchtime = bpTs != null ?
								bpTs : that.datatime(recordTimeKey);
							that.runHomeVitalRefreshIfAllowed(BPW6hexDataupdatewatchtime,
								'parseBloodDatatime',
								() => {
									uni.setStorageSync("parseBloodDatatime",
										BPW6hexDataupdatewatchtime)
									that.lowPressure = that.Blood === "mmHg" ? data.diastolic : (
										Number(data
											.diastolic) * 0.133).toFixed(1);
									that.highPressure = that.Blood === "mmHg" ? data.systolic : (
										Number(data
											.systolic) * 0.133).toFixed(1);
									that.pulse = data.pulse
									uni.setStorageSync("lowPressure", data.diastolic)
									uni.setStorageSync("highPressure", data.systolic)
									uni.setStorageSync("pulse", data.pulse)
									that.updateBloodPressureStatus(data.diastolic, data.systolic);
								});
							// 实时血压：查服务该槽位没有则上报（不要求比首页基线更新）
							// 去重按 timestamp 派生的东八区键；勿再传 timestamp 做分钟槽（易误伤）
							if (!that.bpw6BpSyncing) {
								uni.getNetworkType({
									success: function(netRes) {
										if (netRes.networkType === 'none') {
											return;
										}
										that.ensureBpw6ServerHistoryLoaded(deviceSn).then(
											() => {
												const existingTimes = that
													.getExistingBloodPressureTimeSet();
												if (that.isBpw6SlotInServerSet(
														existingTimes,
														recordTimeKey,
														null)) {
													console.log(
														'【BPW6】实时血压槽位已存在，跳过单条上报',
														recordTimeKey);
													return;
												}
												that.jakoblife_fat_scale22(
													deviceId,
													data.systolic,
													data.diastolic,
													data.pulse,
													deviceSn,
													BPW6hexDataupdatewatchtime);
											}).catch(() => {
											that.jakoblife_fat_scale22(
												deviceId,
												data.systolic,
												data.diastolic,
												data.pulse,
												deviceSn,
												BPW6hexDataupdatewatchtime);
										});
									}
								});
							}
						}
						break;
					}
					case 'BP_history_empty': {
						const wasSyncing = that.bpw6BpSyncing
						that.bpw6BpSyncing = false
						if (!wasSyncing) {
							that.tryStartBpw6PpgAfterBp(deviceId)
						}
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType !== 'none') {
									that.ensureBpw6ServerHistoryLoaded(deviceSn).then(
										() => {
											that.uploadBPW6BpHistoryWithDeduplication(
												deviceId, deviceSn);
										}).catch(() => {
										that.uploadBPW6BpHistoryWithDeduplication(
											deviceId, deviceSn);
									});
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						break;
					}
					case 'oxygen': {
						if (!data.dataarray || !Array.isArray(data.dataarray) || data.dataarray
							.length === 0) {
							if (that.bpw6SpO2Syncing) {
								that.bpw6SpO2Syncing = false
							}
							break;
						}
						const latestSpO2 = [...data.dataarray].sort((a, b) => b.timestamp - a
							.timestamp)[0];
						that.bpw6SpO2Buffer = data.dataarray.map(item => ({
							dateTimeKey: that.buildOxygenTimeKey(item.timestamp),
							timestamp: item.timestamp,
							spO2: item.spO2
						}));
						console.log('血氧数据:', latestSpO2.spO2);
						console.log('血氧数据:', latestSpO2.timestamp);
						const oxygenTs = that.normalizeUnixTimestamp(latestSpO2.timestamp);
						const xueyang = latestSpO2.spO2;
						const xueyangtimes = oxygenTs != null ?
							that.formatDate(oxygenTs * 1000) :
							'--/--';
						that.runHomeVitalRefreshIfAllowed(oxygenTs, 'oxygenDatatime', () => {
							uni.setStorageSync("oxygenDatatime", oxygenTs)
							uni.setStorageSync("xueyang", xueyang);
							uni.setStorageSync("xueyangtimes", xueyangtimes);
							that.updateLocalBloodOxygenCard(xueyang, xueyangtimes);
							setTimeout(() => {
								that.cardeditData(that.list, "bloodData")
							}, 1000)
						});
						// 仅 DATA_CHANGED 触发的实时读上报；连接后历史同步不上报
						const isRealtimeSpO2 = data.realtime === true
						if (that.bpw6SpO2Syncing) {
							that.bpw6SpO2Syncing = false
						}
						if (!isRealtimeSpO2) {
							console.log('【BPW6】血氧历史同步，跳过上报')
							that.bpw6SpO2Buffer = []
							break
						}
						const realtimeSeq = Number(data.realtimeSeq) || 0
						if (realtimeSeq > 0 && that.bpw6LastSpO2RealtimeSeq === realtimeSeq) {
							console.log('【BPW6】血氧同一次实时读已上报，跳过', realtimeSeq)
							that.bpw6SpO2Buffer = []
							break
						}
						if (realtimeSeq > 0) {
							that.bpw6LastSpO2RealtimeSeq = realtimeSeq
						}
						// 每次实时测量上报最新一条（手机本地时间）；同序防抖即可，不去掉「新一次测量」
						uni.getNetworkType({
							success: async function(res) {
								if (res.networkType === 'none') {
									that.bpw6SpO2Buffer = []
									return
								}
								that.bpw6SpO2Buffer = [{
									dateTimeKey: that.buildOxygenTimeKey(latestSpO2
										.timestamp),
									timestamp: latestSpO2.timestamp,
									spO2: latestSpO2.spO2
								}]
								await that.uploadBPW6RealtimeSpO2(deviceId, deviceSn)
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err)
								that.bpw6SpO2Buffer = []
							}
						})
						break;
					}
					case 'SpO2_history_empty':
						that.bpw6SpO2Syncing = false
						that.bpw6SpO2Buffer = []
						break;
					case 'activity':
						that.bushu = data.steps
						that.bushu_time = `${month}/${day}`;
						that.saveDailySteps(that.bushu, that.bushu_time);
						that.jakoblife_fat_scale3(deviceId, data.steps, deviceSn, "步数", "");
						break;
					case 'pulse_data':
						console.log('3BPW6paredata接收到数据:', data || "数据统计中");
						break;
					case 'pulse_data_his':
						that.Taking_pulse.push(data)
						if (that.Taking_pulse.length === 1000) {
							uni.setStorageSync("Taking_pulse", uni.getStorageSync("Taking_pulse"))
							setTimeout(() => {
								console.log('已经有1000条脉诊数据:', that.Taking_pulse);
								that.Taking_pulse = []
								// uni.navigateTo({
								// 	url: "/pages/tabBar/main/Pulsediagnosis"
								// })
								if (that.$refs.pulseDiagnosisRef) {
									that.$refs.pulseDiagnosisRef.loadRealData()
								}
							}, 1000)

						}
						break;
					case 'pulse_empty':
						uni.setStorageSync("Taking_pulse", that.Taking_pulse)
						setTimeout(() => {
							console.log('无脉诊数据或完毕:', uni.getStorageSync("Taking_pulse"));
							that.Taking_pulse = []
							if (that.$refs.pulseDiagnosisRef) {
								that.$refs.pulseDiagnosisRef.loadRealData()
							}
						}, 1000)
						break;
					case 'sleep':
						const BPW6totalAll =
							`${Math.floor(data.sleepTotal / 60)}${"H"}${data.sleepTotal % 60}${"M"}`
						const BPW6sleepLight =
							`${Math.floor(data.sleepLight / 60)}${"H"}${data.sleepLight % 60}${"M"}`
						const BPW6sleepDeep =
							`${Math.floor(data.sleepDeep / 60)}${"H"}${data.sleepDeep % 60}${"M"}`
						uni.setStorageSync("sleep", BPW6totalAll)
						uni.setStorageSync("totalLight", BPW6sleepLight)
						uni.setStorageSync("totalDeep", BPW6sleepDeep)
						uni.setStorageSync("totalRem", "--/--")
						uni.setStorageSync("sleep_time", data.date)
						that.sleep = BPW6totalAll //总睡眠
						that.totalLight = BPW6sleepLight //浅睡眠
						that.totalDeep = BPW6sleepDeep //深度睡眠
						that.totalRem = "--/--" //REM睡眠
						const BPW6totalH = (that.timeStrToMinutes(totalAll) / 60).toFixed(1)
						const BPW6deepMin = (that.timeStrToMinutes(sleepDeep) / 60).toFixed(1);
						const BPW6remMin = 0;
						const BPW6lightMin = (that.timeStrToMinutes(BPW6sleepLight) / 60).toFixed(1)
						that.sleep_point = that.overallSleepScore(BPW6totalAll, BPW6totalH,
							BPW6deepMin, BPW6remMin,
							BPW6lightMin)
						if (BPW6totalAll === uni.getStorageSync("totalAll2") &&
							BPW6totalH === uni.getStorageSync("totalH2") &&
							BPW6deepMin === uni.getStorageSync("deepMin2") &&
							BPW6remMin === uni.getStorageSync("remMin2") &&
							BPW6lightMin === uni.getStorageSync("lightMin2")) {
							if (uni.getStorageSync("sleep_time") && that.getTimeAllJSON().MD !== that
								.sleep_time) {
								that.jakoblife_fat_scale3(deviceId, BPW6totalAll, deviceSn, "睡眠", "");
							}
						} else {
							uni.setStorageSync("totalAll2", BPW6totalAll)
							uni.setStorageSync("totalH2", BPW6totalH)
							uni.setStorageSync("deepMin2", BPW6deepMin)
							uni.setStorageSync("remMin2", BPW6remMin)
							uni.setStorageSync("lightMin2", BPW6lightMin)
							that.jakoblife_fat_scale3(deviceId, BPW6totalAll, deviceSn, "睡眠", "");
						}
						break;
					case 'battery':
						console.log('【BPW6】手表电量:', data.value);
						try {
							const mac = uni.getStorageSync('BPW6devicemac') || ''
							if (mac) notifyQxBleWatchConnectionState(true, mac);
						} catch (eBat) {}
						break;
					case 'hrAutoInfo':
						console.log('【BPW6】手表心率自动测量开关:', data.hrAutoEnabled);
						break;
					case 'spO2AutoInfo':
						console.log('【BPW6】手表血氧自动测量开关:', data.spO2AutoEnabled);
						break;
					case 'SET_TIME':
						console.log('【BPW6】时间同步成功');
						break;
					default:
						console.log('【BPW6】未知数据类型:', data);
						break;
				}
			},

			// 16进制转二进制
			hexToBinary(hexString) {
				let binaryString = '';
				for (let i = 0; i < hexString.length; i++) {
					// 将每个16进制字符转换为4位二进制
					const binaryChar = parseInt(hexString[i], 16).toString(2).padStart(4, '0');
					binaryString += binaryChar;
				}
				return binaryString;
			},
			waitBpw1SetupDeviceReply(key, timeoutMs = 2500) {
				const that = this
				if (!that._bpw1SetupSeenReply) {
					that._bpw1SetupSeenReply = {}
				}
				if (!that._bpw1SetupWaiters) {
					that._bpw1SetupWaiters = {}
				}
				return new Promise((resolve) => {
					if (that._bpw1SetupSeenReply[key]) {
						delete that._bpw1SetupSeenReply[key]
						resolve('reply')
						return
					}
					const timer = setTimeout(() => {
						if (that._bpw1SetupWaiters[key]) {
							delete that._bpw1SetupWaiters[key]
							resolve('timeout')
						}
					}, timeoutMs)
					that._bpw1SetupWaiters[key] = (reason) => {
						clearTimeout(timer)
						delete that._bpw1SetupWaiters[key]
						resolve(reason || 'reply')
					}
				})
			},
			notifyBpw1SetupDeviceReply(key) {
				if (!this._bpw1SetupSeenReply) {
					this._bpw1SetupSeenReply = {}
				}
				this._bpw1SetupSeenReply[key] = true
				const finish = this._bpw1SetupWaiters && this._bpw1SetupWaiters[key]
				if (typeof finish === 'function') {
					// 勿在 notify 同步栈里立刻写下一条
					setTimeout(() => finish('reply'), 80)
				}
			},
			/** BPW1：经典蓝牙配对 + 音频配置（连接后初始化写完成再调） */
			startBpw1PairAudio(deviceId) {
				if (!deviceId) {
					return
				}
				try {
					const plugin = uni.requireNativePlugin('ThirdSdkPlugin-ThirdSdkModule');
					const {
						brand
					} = uni.getSystemInfoSync()
					if (brand === "xiaomi" || brand === "oneplus") {
						plugin.pairDevice({
							mac: deviceId
						}, () => {
							plugin.enableBluetoothAudio({}, (connectAudioProfiles) => {
								console.log('connectAudioProfiles:',
									connectAudioProfiles);
							});
						})
					} else {
						const result = `0x${deviceId.slice(15, deviceId.length)}` ^ 0x55;
						const mac = deviceId.slice(0, 15) + result.toString(16).toUpperCase()
						plugin.pairDevice({
							mac
						}, (pairDeviceres) => {
							if (pairDeviceres && pairDeviceres.success === true) {
								plugin.enableBluetoothAudio({}, (connectAudioProfiles) => {
									console.log('connectAudioProfiles:',
										connectAudioProfiles);
								});
								return
							}
							plugin.pairDevice({
								mac
							}, (pairDeviceres1) => {
								console.log('pairDeviceres1：', pairDeviceres1)
								if (pairDeviceres1 && pairDeviceres1.success ===
									true) {
									plugin.enableBluetoothAudio({}, (
										connectAudioProfiles) => {
										console.log('3connectAudioProfiles:',
											connectAudioProfiles);
									});
								}
							})
						})
					}
				} catch (e) {
					console.warn('【BPW1】配对/音频启动失败', e)
				}
			},
			/**
			 * BPW1同步历史数据并发送天气命令
			 * @param {Object} deviceId
			 * 请求同步所有数据：e00006ea010100000101
			 * 请求同步当天所有数据命令：e00006eb010101000101
			 */
			Sync_historical_data(deviceId, retryLeft = 1) {
				let that = this
				if (that.shouldSkipBpw1InitWritesForScheduledMeasure()) {
					console.log('【BPW1】定时测量进行中，跳过历史同步')
					return
				}
				if (that.isBpw1HistorySyncing()) {
					console.log('【BPW1】历史同步进行中，跳过重复同步请求')
					return
				}
				const doSyncWrite = () => {
					// 运动成功后 GATT 常仍忙；短等再写，降低首发 10007（不影响其它命令）
					setTimeout(() => {
						uni.writeBLECharacteristicValue({
							deviceId: deviceId,
							serviceId: BPW1serviceId,
							characteristicId: BPW1write,
							writeType: 'writeNoResponse',
							value: that.toArrayBuffer('e00006ea010100000101'),
							success() {
								// 初始化阶段积压的查询/运动 ACK 已过期，丢弃勿倒灌
								that.bpw1SetupCmdBusy = false
								that._bpw1AckQueue = []
								that._bpw1AckFlushing = false
								that.blewatch_id = "1"
								that.blewatch_id2 = "0"
								that.hasSynced = true
								that.beginBpw1HistorySync()
								console.log("请求同步所有数据成功：e00006ea010100000101")
								// 天气/定时调度放到历史同步结束（endBpw1HistorySync），勿在收历史包时抢写
								that.bpw1PendingWeatherAfterHistory = {
									deviceId,
									serviceId: BPW1serviceId,
									writeuuid: BPW1write
								}
							},
							fail(err) {
								console.log("请求同步所有数据失败：e00006ea010100000101", err)
								if (retryLeft > 0) {
									console.log('【BPW1】同步命令2s后重试')
									setTimeout(() => {
										that.Sync_historical_data(deviceId,
											retryLeft - 1)
									}, 2000)
									return
								}
								that.bpw1SetupCmdBusy = false
								that._bpw1AckQueue = []
								that._bpw1AckFlushing = false
								that.blewatch_id = "0"
								that.bpw1PendingWeatherAfterHistory = {
									deviceId,
									serviceId: BPW1serviceId,
									writeuuid: BPW1write
								}
								// end 内会恢复调度与补发天气
								that.endBpw1HistorySync('sync_cmd_fail')
							}
						})
					}, 800)
				}
				// 等 ACK 队列空闲再发同步，降低与设备查询 ACK 撞写概率
				that.whenBpw1AckIdle(doSyncWrite, 8)
			},
			/** 等 BPW1 ACK 队列空闲后再写命令 */
			whenBpw1AckIdle(cb, retryLeft = 6) {
				// 初始化阶段 ACK 被有意暂存，不应阻塞同步/运动命令
				if (this.bpw1SetupCmdBusy) {
					cb()
					return
				}
				const busy = this._bpw1AckFlushing ||
					(this._bpw1AckQueue && this._bpw1AckQueue.length > 0)
				if (!busy) {
					cb()
					return
				}
				if (retryLeft <= 0) {
					cb()
					return
				}
				setTimeout(() => {
					this.whenBpw1AckIdle(cb, retryLeft - 1)
				}, 200)
			},
			/** 连接初期暂缓的定时调度，在同步命令结束后再开 */
			flushBpw1PendingResumeSchedule(delayMs = 1500) {
				if (!this.bpw1PendingResumeSchedule) {
					return
				}
				this.bpw1PendingResumeSchedule = false
				setTimeout(() => {
					import('@/pages/api/qxBleAlignedSchedule.js').then((m) => {
						m.resumeQxBleScheduleIfEnabled().catch(() => {})
					}).catch(() => {})
				}, delayMs)
			},
			/**
			 * 发送绑定命令（对齐 Bind_page_2：CMD 0x08 / KEY 0x00 + SN）
			 * @param {number} delayMs 延迟；初始化链已等过查询 ACK 时传 0
			 */
			sendBindCommand(deviceId, serviceId, charId, sn, delayMs = 0) {
				const snRaw = String(sn || this.shoubiaosn || uni.getStorageSync('deviceSn') || '')
					.replace(/^SN:/i, '')
					.trim()
				if (!snRaw || snRaw.length < 16) {
					console.warn('【BPW1】绑定命令跳过，SN无效', snRaw)
					return
				}
				const snBytes = this.snToBytes(snRaw)
				const command = this.buildBpw1Command(0x08, 0x00, snBytes, 0x00)
				const run = () => {
					this.writeBpw1Command(deviceId, serviceId || BPW1serviceId, charId ||
						BPW1write, command)
				}
				if (delayMs > 0) {
					setTimeout(run, delayMs)
				} else {
					run()
				}
			},
			/**
			 * 连接初始化串行：等查询回包 → 绑定 → 间隔 → 校时 → 运动/同步。
			 * 禁止绑定与校时并行，避免互相抢写导致 10007。
			 */
			scheduleBpw1BindAndTime(deviceId, serviceId, writeuuid, deviceSn, extraDelay = 0) {
				this.clearBpw1InitChainTimer()
				const gen = (this._bpw1InitGen = (this._bpw1InitGen || 0) + 1)
				this.bpw1InitChain = {
					deviceId,
					serviceId,
					writeuuid,
					deviceSn,
					stage: 'waitQuery',
					gen
				}
				if (!this._bpw1SetupSeenReply) {
					this._bpw1SetupSeenReply = {}
				}
				delete this._bpw1SetupSeenReply.queryAck00
				console.log('【BPW1】初始化串行启动', {
					extraDelay,
					gen
				})
				this.runBpw1InitSerial(gen, extraDelay).catch((e) => {
					console.log('【BPW1】初始化串行异常', e)
				})
			},
			async runBpw1InitSerial(gen, extraDelay = 0) {
				const that = this
				const alive = () => that.bpw1InitChain && that.bpw1InitChain.gen === gen
				const chain = that.bpw1InitChain
				if (!chain) {
					return
				}
				const {
					deviceId,
					serviceId,
					writeuuid,
					deviceSn
				} = chain
				try {
					if (extraDelay > 0) {
						await that.bpw1InitDelay(extraDelay)
					}
					if (!alive()) {
						return
					}
					// 冷启动查询 ACK 可能较晚，最多等 5s；到了也继续，避免卡死
					const queryReply = await that.waitBpw1SetupDeviceReply('queryAck00', 5000)
					console.log('【BPW1】查询回包', queryReply)
					if (!alive()) {
						return
					}
					// 回包/超时后再空闲一会，再发绑定（勿与查询 ACK 处理撞写）
					await that.bpw1InitDelay(1500)
					if (!alive()) {
						return
					}
					if (that.shouldSkipBpw1InitWritesForScheduledMeasure()) {
						console.log('【BPW1】定时测量进行中，跳过绑定/校时/同步')
						that.bpw1SetupCmdBusy = false
						that.bpw1PendingResumeSchedule = false
						return
					}

					// 1) 绑定（可失败，失败也继续校时）
					chain.stage = 'binding'
					const snRaw = String(deviceSn || that.shoubiaosn || uni.getStorageSync(
							'deviceSn') || '')
						.replace(/^SN:/i, '')
						.trim()
					if (snRaw && snRaw.length >= 16) {
						const snBytes = that.snToBytes(snRaw)
						const bindCmd = that.buildBpw1Command(0x08, 0x00, snBytes, 0x00)
						let sum = 0
						for (let i = 0; i < bindCmd.length; i++) {
							sum += bindCmd[i]
						}
						const checksum = sum % 256
						const finalBind = new Uint8Array(bindCmd.length + 1)
						finalBind.set(bindCmd.subarray(0, 3), 0)
						finalBind[3] = checksum
						finalBind.set(bindCmd.subarray(3), 4)
						const bindHex = Array.from(finalBind).map(b => b.toString(16).padStart(2,
							'0')).join('')
						const bindOk = await that.writeBpw1InitOnce(
							deviceId, serviceId, writeuuid, that.toArrayBuffer(bindHex),
							'绑定命令', 1)
						console.log('【BPW1】绑定结束', bindOk ? 'ok' : 'fail')
					} else {
						console.warn('【BPW1】绑定跳过，SN无效', snRaw)
					}
					if (!alive()) {
						return
					}
					// 绑定写完后再校时，互不并行
					await that.bpw1InitDelay(2000)
					if (!alive()) {
						return
					}

					// 2) 校时 → 内部再进运动/同步
					chain.stage = 'timing'
					that.calculateChecksumsss2(deviceId, serviceId, writeuuid, deviceSn)
				} catch (e) {
					console.log('【BPW1】初始化串行失败，直接校时', e)
					if (alive()) {
						that.calculateChecksumsss2(deviceId, serviceId, writeuuid, deviceSn)
					}
				}
			},
			/** 清掉 BPW1 连接初始化相关定时器（重连/重发前必须调） */
			clearBpw1SetupTimers() {
				this.bpw1SetupGen = (this.bpw1SetupGen || 0) + 1
				if (this.bpw1TimeDelayTimer) {
					clearTimeout(this.bpw1TimeDelayTimer)
					this.bpw1TimeDelayTimer = null
				}
				if (this.bpw1SportTimer) {
					clearTimeout(this.bpw1SportTimer)
					this.bpw1SportTimer = null
				}
				if (this.bpw1SyncTimer) {
					clearTimeout(this.bpw1SyncTimer)
					this.bpw1SyncTimer = null
				}
				this.clearBpw1InitChainTimer()
				this.bpw1InitChain = null
				this._bpw1AckQueue = []
				this._bpw1AckFlushing = false
				this.bpw1SetupCmdBusy = false
				this._bpw1LastAckAt = 0
			},
			bpw1InitDelay(ms) {
				return new Promise((resolve) => setTimeout(resolve, ms))
			},
			/** 清理连接初始化定时器 */
			clearBpw1InitChainTimer() {
				if (this.bpw1InitChainTimer) {
					clearTimeout(this.bpw1InitChainTimer)
					this.bpw1InitChainTimer = null
				}
			},
			/** 初始化写：失败 2s 后重试 1 次 */
			writeBpw1InitOnce(deviceId, serviceId, charId, buffer, label, retryLeft = 1) {
				const that = this
				return new Promise((resolve) => {
					uni.writeBLECharacteristicValue({
						deviceId,
						serviceId: serviceId || BPW1serviceId,
						characteristicId: charId || BPW1write,
						writeType: 'writeNoResponse',
						value: buffer,
						success: () => {
							console.log(`【BPW1】${label}发送成功`)
							resolve(true)
						},
						fail: async (err) => {
							console.log(`【BPW1】${label}发送失败`, err)
							if (retryLeft > 0) {
								console.log(`【BPW1】${label}2s后重试`)
								await that.bpw1InitDelay(2000)
								const ok = await that.writeBpw1InitOnce(
									deviceId, serviceId, charId, buffer,
									label, retryLeft - 1)
								resolve(ok)
								return
							}
							resolve(false)
						}
					})
				})
			},
			/** SN 转 8 字节（取前 16 个 hex 字符） */
			snToBytes(sn) {
				const hex = String(sn).replace(/[^0-9a-fA-F]/g, '')
				return new Uint8Array([
					parseInt(hex.slice(0, 2), 16) || 0,
					parseInt(hex.slice(2, 4), 16) || 0,
					parseInt(hex.slice(4, 6), 16) || 0,
					parseInt(hex.slice(6, 8), 16) || 0,
					parseInt(hex.slice(8, 10), 16) || 0,
					parseInt(hex.slice(10, 12), 16) || 0,
					parseInt(hex.slice(12, 14), 16) || 0,
					parseInt(hex.slice(14, 16), 16) || 0
				])
			},
			/** 构建 BPW1 协议帧（不含校验位） */
			buildBpw1Command(cmd, key, data, protocolVersion = 0x00) {
				const len = data.length
				const cmdLen = len + 5
				const command = new Uint8Array(len + 8)
				command[0] = 0xe0
				command[1] = (cmdLen >> 8) & 0xFF
				command[2] = cmdLen & 0xFF
				command[3] = cmd
				command[4] = protocolVersion
				command[5] = key
				command[6] = (len >> 8) & 0xFF
				command[7] = len & 0xFF
				command.set(data, 8)
				return command
			},
			/** 写入带校验和的 BPW1 命令（失败自动重试 1 次） */
			writeBpw1Command(deviceId, serviceId, charId, command) {
				let sum = 0
				for (let i = 0; i < command.length; i++) {
					sum += command[i]
				}
				const checksum = sum % 256
				const finalCmd = new Uint8Array(command.length + 1)
				finalCmd.set(command.subarray(0, 3), 0)
				finalCmd[3] = checksum
				finalCmd.set(command.subarray(3), 4)
				const hexStr = Array.from(finalCmd).map(b => b.toString(16).padStart(2, '0')).join(
					'')
				return this.writeBpw1InitOnce(
					deviceId, serviceId, charId, this.toArrayBuffer(hexStr), '绑定命令', 0)
			},
			// 定义一个函数来计算校验和（先校时；配对延后，避免与运动/同步写撞 10007）
			calculateChecksumsss2(deviceId, serviceId, writeuuid, deviceSn, setupGen) {
				let that = this
				const gen = setupGen != null ? setupGen : that.bpw1SetupGen
				if (that.shouldSkipBpw1InitWritesForScheduledMeasure()) {
					console.log('【BPW1】定时测量进行中，跳过校时/运动/历史同步')
					that.bpw1SetupCmdBusy = false
					that.bpw1PendingResumeSchedule = false
					return
				}
				// 配对/音频放到同步命令之后，连接初期不要抢 GATT
				that.bpw1PendingPairAudio = {
					deviceId
				}

				const ACK_HEADER = 0xe0 // 常量-头部
				const BleDeviceConfig = {
					PROTOCOL_VERSION: 0x01 // 协议版本号
				};
				const commandId = 0x02 // CMD-协议命令
				const commandKey = 0x08 // key-协议子命令
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1; // getMonth() 返回的是 0-11，需要加 1
				const day = now.getDate();
				const hour = now.getHours();
				const minutes = now.getMinutes();
				const seconds = now.getSeconds();
				const bytes1 = new Uint8Array(4);
				bytes1[0] = (((year - 2000) << 2) + ((month & 0xFF) >> 2)) & 0xFF;
				bytes1[1] = (((month & 0x03) << 6) + (day << 1) + (hour >> 4)) & 0xFF;
				bytes1[2] = (((hour & 0x0F) << 4) + (minutes >> 2)) & 0xFF;
				bytes1[3] = (((minutes & 0x03) << 6) + seconds) & 0xFF;
				const dataLen = bytes1.length;
				const command = new Uint8Array(dataLen + 8);
				command[0] = ACK_HEADER;
				command[1] = ((5 + dataLen) >> 8) & 0xFF;
				command[2] = (5 + dataLen) & 0xFF;
				command[3] = commandId;
				command[4] = BleDeviceConfig.PROTOCOL_VERSION;
				command[5] = commandKey;
				command[6] = (dataLen >> 8) & 0xFF;
				command[7] = dataLen & 0xFF;
				command.set(bytes1, 8);
				const hexCommand2 = Array.from(command).map(byte => byte.toString(16).padStart(2,
					'0')).join('');
				const bytesnew2 = new Uint8Array(hexCommand2.match(/../g).map(byte => parseInt(
					byte, 16)));
				const formattedBytes2 = Array.from(bytesnew2).map(byte =>
					`0x${byte.toString(16).padStart(2, '0')}`);
				const bytes3332 = formattedBytes2.map(byte => parseInt(byte, 16));
				let sum2 = 0;
				for (let i = 0; i < bytes3332.length; i++) {
					sum2 += bytes3332[i];
				}
				sum2 = sum2 % 256;
				const modifiedCommand2 = new Uint8Array(command.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(command.subarray(0, 3), 0);
				modifiedCommand2[3] = sum2;
				modifiedCommand2.set(command.subarray(3), 4);
				const hexCommand22 = Array.from(modifiedCommand2).map(byte => byte.toString(16)
					.padStart(2, '0')).join('');
				const buffer = that.toArrayBuffer(hexCommand22); // 转换为 ArrayBuffer获取设备信息
				if (that.bpw1SetupGen !== gen) {
					return
				}
				const writeTimeOnce = (retryLeft) => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'writeNoResponse',
						value: buffer,
						success(res) {
							console.log("【BPW1】时间命令数据回复成功：" + hexCommand22)
							if (that.bpw1SetupGen !== gen) {
								return
							}
							const startSportChain = () => {
								if (that.bpw1SetupGen !== gen) {
									return
								}
								if (that
									.shouldSkipBpw1InitWritesForScheduledMeasure()
								) {
									console.log('【BPW1】定时测量进行中，跳过运动/历史同步')
									that.bpw1SetupCmdBusy = false
									that.bpw1PendingResumeSchedule = false
									return
								}
								that.getsetp(deviceId, serviceId, writeuuid,
									BleDeviceConfig
									.PROTOCOL_VERSION, gen)
							}
							// 等校时 ACK 再进运动：ACK 晚到时按写成功固定 6s 会撞忙通道
							that.waitBpw1SetupDeviceReply('timeAck08', 5000).then((
								reason) => {
								if (that.bpw1SetupGen !== gen) {
									return
								}
								that.bpw1TimeDelayTimer = setTimeout(() => {
									that.bpw1TimeDelayTimer = null
									startSportChain()
								}, 2000)
							})
						},
						fail(err) {
							console.log("【BPW1】时间命令数据回复失败：", err)
							if (that.bpw1SetupGen !== gen) {
								return
							}
							if (retryLeft > 0) {
								console.log('【BPW1】时间命令2s后重试')
								that.bpw1TimeDelayTimer = setTimeout(() => {
									that.bpw1TimeDelayTimer = null
									if (that.bpw1SetupGen !== gen) {
										return
									}
									writeTimeOnce(retryLeft - 1)
								}, 2000)
								return
							}
							that.getsetp(deviceId, serviceId, writeuuid,
								BleDeviceConfig.PROTOCOL_VERSION, gen)
						}
					})
				}
				if (!that._bpw1SetupSeenReply) {
					that._bpw1SetupSeenReply = {}
				}
				delete that._bpw1SetupSeenReply.timeAck08
				writeTimeOnce(1)
			},

			sendack(dataList, deviceId, serviceId, writeuuid) {
				// console.log("发送ACK命令：", dataList, deviceId, serviceId, writeuuid)
				// 仅对 e0 业务包回 ACK；设备侧 0e 状态/ACK 包不回，避免误写与撞写
				if (String(dataList || '').slice(0, 2).toLowerCase() !== 'e0') {
					return
				}
				let that = this
				that.dataBuffer = [];
				that.xueyapack = 0;
				that.xinlvpack = 0;
				that.xueyangpack = 0;
				that.sleeppack = 0;
				that.synchronizationpack = 0;
				that.Equipmentquery = 0;
				that.quotientACC = 0;
				that.quotientota = 0;
				that.quotientPPG = 0;
				const hexString = dataList
				// 将十六进制字符串转换为字节数组
				const bytes = [];
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16));
				}
				// 协议格式解析
				const protocolMarker = bytes[0]; // 协议标识位
				const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
				const protocolChecksum = bytes[3]; // 协议校准位
				const protocolCommand = bytes[4]; // 协议命令
				const protocolVersion = bytes[5]; // 协议版本号
				const protocolSubcommand = bytes[6]; // 协议子命令
				const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
				const commandValue = bytes.slice(9); // 命令指令值
				// 计算字节和（除去协议校准位）
				let sumBytes = 0;
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) { // 跳过校准位
						sumBytes += bytes[i];
					}
				}
				const calculatedChecksum = sumBytes % 256; // 取低8位
				if (calculatedChecksum === protocolChecksum) {
					// 假设以下变量已经定义
					const ACK_RESPONSE_HEADER = 0x0E; // 示例值
					const commandId = `0x${protocolCommand.toString(16).padStart(2, '0')}`; // 示例值
					const commandKey =
						`0x${protocolSubcommand.toString(16).padStart(2, '0')}`; // 示例值
					const BleDeviceConfig = {
						PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 示例协议版本
					};
					const code = 0x00; // 示例 code 值
					const ackConfigByte = new Uint8Array(9);
					ackConfigByte[0] = ACK_RESPONSE_HEADER;
					ackConfigByte[1] = 0x00;
					ackConfigByte[2] = 0x06;
					ackConfigByte[3] = commandId;
					ackConfigByte[4] = BleDeviceConfig.PROTOCOL_VERSION;
					ackConfigByte[5] = commandKey;
					ackConfigByte[6] = 0x00;
					ackConfigByte[7] = 0x01;
					ackConfigByte[8] = code;
					let ackConfigBytesum = 0;
					for (let i = 0; i < ackConfigByte.length -
						1; i++) { // 遍历 command 数组的前 command.length - 1 个元素
						ackConfigBytesum += ackConfigByte[i]; // 累加每个元素的值
					}
					ackConfigBytesum = ackConfigBytesum % 256; // 取模 256，得到低 8 位的和
					// 创建新的数组，将校验和插入到第四个字节中
					const modifiedCommand = new Uint8Array(ackConfigByte.length +
						1); // 第四个字节的插入，数组长度加1
					modifiedCommand.set(ackConfigByte.subarray(0, 3), 0);
					modifiedCommand[3] = ackConfigBytesum;
					modifiedCommand.set(ackConfigByte.subarray(3), 4);
					const hexCommand = Array.from(modifiedCommand).map(byte => byte
						.toString(16).padStart(2, '0')).join('');
					const buffer = that.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
					// 与 sendack2 共用串行队列，避免历史同步密集包时直写撞 10007
					that.enqueueBpw1AckWrite(buffer, hexCommand)
				}
			},
			sendack2(dataList, deviceId, serviceId, writeuuid) {
				// 仅对 e0 业务包回 ACK；设备侧 0e 状态/ACK 包不回，避免误写与撞写
				if (String(dataList || '').slice(0, 2).toLowerCase() !== 'e0') {
					return
				}
				let that = this
				const hexString = dataList
				// 将十六进制字符串转换为字节数组
				const bytes = [];
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16));
				}
				// 协议格式解析
				const protocolMarker = bytes[0]; // 协议标识位
				const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
				const protocolChecksum = bytes[3]; // 协议校准位
				const protocolCommand = bytes[4]; // 协议命令
				const protocolVersion = bytes[5]; // 协议版本号
				const protocolSubcommand = bytes[6]; // 协议子命令
				const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
				const commandValue = bytes.slice(9); // 命令指令值
				// 计算字节和（除去协议校准位）
				let sumBytes = 0;
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) { // 跳过校准位
						sumBytes += bytes[i];
					}
				}
				const calculatedChecksum = sumBytes % 256; // 取低8位
				if (calculatedChecksum === protocolChecksum) {
					// 假设以下变量已经定义
					const ACK_RESPONSE_HEADER = 0x0E; // 示例值
					const commandId = `0x${protocolCommand.toString(16).padStart(2, '0')}`; // 示例值
					const commandKey =
						`0x${protocolSubcommand.toString(16).padStart(2, '0')}`; // 示例值
					const BleDeviceConfig = {
						PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 示例协议版本
					};
					const code = 0x00; // 示例 code 值
					const ackConfigByte = new Uint8Array(9);
					ackConfigByte[0] = ACK_RESPONSE_HEADER;
					ackConfigByte[1] = 0x00;
					ackConfigByte[2] = 0x06;
					ackConfigByte[3] = commandId;
					ackConfigByte[4] = BleDeviceConfig.PROTOCOL_VERSION;
					ackConfigByte[5] = commandKey;
					ackConfigByte[6] = 0x00;
					ackConfigByte[7] = 0x01;
					ackConfigByte[8] = code;
					let ackConfigBytesum = 0;
					for (let i = 0; i < ackConfigByte.length -
						1; i++) { // 遍历 command 数组的前 command.length - 1 个元素
						ackConfigBytesum += ackConfigByte[i]; // 累加每个元素的值
					}
					ackConfigBytesum = ackConfigBytesum % 256; // 取模 256，得到低 8 位的和
					// 创建新的数组，将校验和插入到第四个字节中
					const modifiedCommand = new Uint8Array(ackConfigByte.length +
						1); // 第四个字节的插入，数组长度加1
					modifiedCommand.set(ackConfigByte.subarray(0, 3), 0);
					modifiedCommand[3] = ackConfigBytesum;
					modifiedCommand.set(ackConfigByte.subarray(3), 4);
					const hexCommand = Array.from(modifiedCommand).map(byte => byte
						.toString(16).padStart(2, '0')).join('');
					const buffer = that.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
					// 运动数据与紧随的 0e 状态包会连续触发 ACK，并行写易 10007；排队串行写出
					that.enqueueBpw1AckWrite(buffer, hexCommand)
				}
			},
			/** BPW1 ACK 串行写：离开 notify 栈，且相邻 ACK 间隔开 */
			enqueueBpw1AckWrite(buffer, hexCommand) {
				// 初始化命令阶段不回 ACK（手表已继续后续流程），避免同步后倒灌撞历史包
				if (this.bpw1SetupCmdBusy) {
					return
				}
				if (!this._bpw1AckQueue) {
					this._bpw1AckQueue = []
				}
				const ppgXfer = !!(this.bpw1PpgTransferActive || this.watchtimer2)
				// PPG 传数：按包入队（10ms 间隔），勿合并丢掉 ACK，否则手表传数变慢
				// 历史同步等：只保留最新 ACK，避免队列堆积连写撞 10007
				if (!ppgXfer && this._bpw1AckQueue.length >= 1) {
					this._bpw1AckQueue = [{
						buffer,
						hexCommand
					}]
				} else {
					this._bpw1AckQueue.push({
						buffer,
						hexCommand
					})
				}
				this.flushBpw1AckQueue()
			},
			flushBpw1AckQueue() {
				const that = this
				if (that._bpw1AckFlushing) {
					return
				}
				if (!that._bpw1AckQueue || that._bpw1AckQueue.length === 0) {
					return
				}
				if (that.bpw1SetupCmdBusy) {
					return
				}
				const next = that._bpw1AckQueue.shift()
				that._bpw1AckFlushing = true
				const ppgXfer = !!(that.bpw1PpgTransferActive || that.watchtimer2)
				// PPG 传数仍 10ms；历史同步略加大间隔，降低 notify 洪峰下 ACK 10007
				const minGapMs = ppgXfer ? 10 : (that.bpw1HistorySyncActive ? 2000 : 500)
				const sinceLast = Date.now() - (that._bpw1LastAckAt || 0)
				const deferMs = ppgXfer ?
					Math.max(0, minGapMs - sinceLast) :
					Math.max(80, minGapMs - sinceLast)
				const writeOnce = (isRetry) => {
					// writeNoResponse 更快释放通道；仍串行+最小间隔
					uni.writeBLECharacteristicValue({
						deviceId: uni.getStorageSync("deviceIdwatch"),
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: "writeNoResponse",
						value: next.buffer,
						success() {
							that._bpw1LastAckAt = Date.now()
							// console.log("回复ack数据成功2")
							that._bpw1AckFlushing = false
							setTimeout(() => {
								that.flushBpw1AckQueue()
							}, minGapMs)
						},
						fail(err) {
							if (!isRetry) {
								// 失败退避加长，仅重试路径；成功路径不变
								setTimeout(() => {
									writeOnce(true)
								}, that.bpw1HistorySyncActive ? 1500 : 1000)
							} else {
								console.log("回复ack数据重试失败", next.hexCommand, err)
								that._bpw1LastAckAt = Date.now()
								that._bpw1AckFlushing = false
								setTimeout(() => {
									that.flushBpw1AckQueue()
								}, minGapMs)
							}
						}
					})
				}
				setTimeout(() => {
					writeOnce(false)
				}, deferMs)
			},

			calculateQuotient(bufferSize, chunkSize) {
				return Math.ceil(bufferSize / chunkSize);
			},
			// 提取数据格式化函数
			formatData(dataArray) {
				return dataArray.map(item => item.replace(/[""]/g, "")).join("");
			},
			// 提取二进制时间解析函数
			parseBinaryTime(hexTime) {
				const binaryTime = this.hexToBinary(hexTime);
				const year = parseInt(binaryTime.slice(1, 7), 2) + 2000;
				const month = String(parseInt(binaryTime.slice(7, 11), 2)).padStart(2, '0');
				const day = String(parseInt(binaryTime.slice(11), 2)).padStart(2, '0');
				const datealltime = `${year}-${month}-${day}`
				return {
					year,
					month,
					day,
					datealltime
				};
			},
			// 提取时间格式化函数
			formatTime(seconds) {
				const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
				const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
				const secs = String(seconds % 60).padStart(2, '0');
				return `${hours}:${minutes}:${secs}`;
			},

			// 提取血压数据解析函数
			parseBloodPressureData(data) {
				const secondsHex = data.substring(0, 8); // 秒（4 字节）
				const bloodPressureTypeHex = data.substring(8, 10); // 血压类型（1 字节）
				const reservedHex = data.substring(10, 12); // 预留（1 字节）
				const systolicHex = data.substring(12, 14); // 高压值（1 字节）
				const diastolicHex = data.substring(14, 16); // 低压值（1 字节）
				const seconds = parseInt(secondsHex, 16);
				const bloodPressureType = parseInt(bloodPressureTypeHex, 16);
				const reserved = parseInt(reservedHex, 16);
				const systolic = parseInt(systolicHex, 16);
				const diastolic = parseInt(diastolicHex, 16);
				const time = this.formatTime(seconds);
				return {
					systolic,
					diastolic
				};
			},

			// 提取心率数据解析函数
			parseHeartRateData(hexData) {
				let that = this
				const secondsHex = hexData.substring(0, 8); // 秒（4 字节）
				const bloodPressureTypeHex = hexData.substring(8, 10); // 心率值类型（1 字节）
				const reservedHex = hexData.substring(10, 12); // 预留（1 字节）
				const systolicHex = hexData.substring(12, 14); // 预留（1 字节）
				const diastolicHex = hexData.substring(14, 16); // 心率值（1 字节）
				const seconds = parseInt(secondsHex, 16);
				const bloodPressureType = parseInt(bloodPressureTypeHex, 16);
				const reserved = parseInt(reservedHex, 16);
				const systolic = parseInt(systolicHex, 16);
				const diastolic = parseInt(diastolicHex, 16);
				return {
					time: that.formatTime(seconds),
					bloodPressureType,
					reserved,
					systolic,
					diastolic
				};
			},

			// 提取协议解析函数
			parseProtocolData(alltypearray) {
				const Protocollength = alltypearray.slice(2, 6); // 协议长度 2个byte
				const Protocolcalibrationposition = alltypearray.slice(6, 8);
				const Protocolcommand = alltypearray.slice(8, 10); // 协议命令 1个byte
				const Versionprotocol = alltypearray.slice(10, 12); // 协议版本号 1个byte
				const Protocolsubcommand = alltypearray.slice(12, 14); // 协议子命令 1个byte
				const Commandlinelength = alltypearray.slice(14, 18); // 命令指令长度 2个byte
				const Covmamlueand = alltypearray.slice(18, alltypearray
					.length); // 命令指令值 1~503Byte
				return {
					Protocollength,
					Protocolcalibrationposition,
					Protocolcommand,
					Versionprotocol,
					Protocolsubcommand,
					Commandlinelength,
					Covmamlueand
				};
			},
			// 运动命令（校时后 6s 运动、8s 同步；定时器可取消，避免重连旧任务撞车）
			getsetp(deviceId, serviceId, writeuuid, PROTOCOL_VERSION, setupGen) {
				let that = this
				const gen = setupGen != null ? setupGen : that.bpw1SetupGen
				if (that.shouldSkipBpw1InitWritesForScheduledMeasure()) {
					console.log('【BPW1】定时测量进行中，跳过运动/历史同步')
					that.bpw1SetupCmdBusy = false
					that.bpw1PendingResumeSchedule = false
					return
				}
				if (that.bpw1SportTimer) {
					clearTimeout(that.bpw1SportTimer)
					that.bpw1SportTimer = null
				}
				if (that.bpw1SyncTimer) {
					clearTimeout(that.bpw1SyncTimer)
					that.bpw1SyncTimer = null
				}
				const ackConfigByteset = new Uint8Array(9);
				ackConfigByteset[0] = 0xE0;
				ackConfigByteset[1] = 0x00;
				ackConfigByteset[2] = 0x06;
				ackConfigByteset[3] = 0x02;
				ackConfigByteset[4] = PROTOCOL_VERSION;
				ackConfigByteset[5] = 0x02;
				ackConfigByteset[6] = 0x00;
				ackConfigByteset[7] = 0x01;
				ackConfigByteset[8] = 0x01;
				let ackConfigBytesum2 = 0;
				for (let i = 0; i < ackConfigByteset.length; i++) {
					ackConfigBytesum2 += ackConfigByteset[i];
				}
				ackConfigBytesum2 = ackConfigBytesum2 % 256;
				const modifiedCommand2 = new Uint8Array(ackConfigByteset.length + 1);
				modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
				modifiedCommand2[3] = ackConfigBytesum2;
				modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
				const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
					.toString(16).padStart(2, '0')).join('');
				const buffer2 = that.toArrayBuffer(hexCommand2);
				const writeCharId = writeuuid || BPW1write
				const scheduleSync = () => {
					if (that.bpw1SyncTimer) {
						clearTimeout(that.bpw1SyncTimer)
					}
					// 运动写成功后通道未完全空闲，5s 再同步，降低首发 10007
					that.bpw1SyncTimer = setTimeout(() => {
						that.bpw1SyncTimer = null
						if (that.bpw1SetupGen !== gen) {
							return
						}
						if (that.shouldSkipBpw1InitWritesForScheduledMeasure()) {
							console.log('【BPW1】定时测量进行中，跳过历史同步')
							that.bpw1SetupCmdBusy = false
							that.bpw1PendingResumeSchedule = false
							return
						}
						that.Sync_historical_data(deviceId)
					}, 5000)
				}
				const writeSportOnce = (retryLeft) => {
					if (that.bpw1SetupGen !== gen) {
						return
					}
					uni.writeBLECharacteristicValue({
						deviceId: uni.getStorageSync("deviceIdwatch"),
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: "writeNoResponse",
						value: buffer2,
						success(res) {
							console.log("【BPW1运动数据回复成功】" + hexCommand2, uni
								.getStorageSync("deviceIdwatch"))
							scheduleSync()
						},
						fail(err) {
							if (retryLeft > 0 && that.bpw1SetupGen === gen) {
								console.log('【BPW1】运动命令2s后重试', hexCommand2)
								that.bpw1SportTimer = setTimeout(() => {
									that.bpw1SportTimer = null
									writeSportOnce(retryLeft - 1)
								}, 2000)
								return
							}
							// 运动最终失败也继续同步
							scheduleSync()
						},
					})
				}
				// 校时 ACK 后再进入本方法；此处再隔 4s 发运动，运动结束再隔 5s 同步
				that.bpw1SportTimer = setTimeout(() => {
					that.bpw1SportTimer = null
					writeSportOnce(1)
				}, 3000)
			},
			weather(deviceId, serviceId, writeuuid) {
				let that = this;
				const fullData = that.weatherDataID;
				// 检查是否需要分包（超过20字节）
				if (fullData.length <= 40) { // 40个hex字符 = 20字节
					// 不需要分包，直接发送
					const buffer = that.toArrayBuffer(fullData);
					setTimeout(() => {
						uni.writeBLECharacteristicValue({
							deviceId: deviceId,
							serviceId: BPW1serviceId,
							characteristicId: BPW1write,
							writeType: 'writeNoResponse',
							value: buffer,
							success(res) {
								console.log("当天气命令（单包）：", fullData);
								that.weather7(deviceId, serviceId, writeuuid);
							},
							fail(err) {
								console.log("当天气命令失败：", fullData, err);
								that.weather7(deviceId, serviceId, writeuuid);
							},
						});
					}, 3000);
					return;
				}
				// 转换为字节数组
				const bytes = that.hexToBytes(fullData);
				// 分包：每包20字节
				const packetSize = 20;
				const packets = [];
				for (let i = 0; i < bytes.length; i += packetSize) {
					packets.push(bytes.slice(i, i + packetSize));
				}
				// 顺序发送每个包
				let index = 0;
				const sendNextPacket = () => {
					if (index >= packets.length) {
						console.log(`【BPW1】当天天气所有包发送完成`);
						that.weather7(deviceId, serviceId, writeuuid);
						return;
					}
					const packet = packets[index];
					const buffer = that.arrayToArrayBuffer(packet);
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'writeNoResponse',
						value: buffer,
						success(res) {
							index++;
							setTimeout(sendNextPacket, 100);
						},
						fail(err) {
							index++;
							setTimeout(sendNextPacket, 100);
						}
					});
				};
				// 3秒后开始发送
				setTimeout(sendNextPacket, 2000);
			},
			// 辅助方法：十六进制字符串转字节数组
			hexToBytes(hex) {
				const bytes = [];
				for (let i = 0; i < hex.length; i += 2) {
					bytes.push(parseInt(hex.substr(i, 2), 16));
				}
				return bytes;
			},
			// 辅助方法：字节数组转十六进制字符串
			bytesToHex(bytes) {
				return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
			},
			// 辅助方法：字节数组转ArrayBuffer
			arrayToArrayBuffer(array) {
				const buffer = new ArrayBuffer(array.length);
				const dataView = new DataView(buffer);
				for (let i = 0; i < array.length; i++) {
					dataView.setUint8(i, array[i]);
				}
				return buffer;
			},
			weather7(deviceId, serviceId, writeuuid) {
				let that = this;
				const fullData = that.weatherDataID7; // 获取7天天气数据
				// 检查是否需要分包（超过20字节）
				if (fullData.length <= 40) { // 40个hex字符 = 20字节
					// 不需要分包，直接发送
					const buffer = that.toArrayBuffer(fullData);
					setTimeout(() => {
						uni.writeBLECharacteristicValue({
							deviceId: deviceId,
							serviceId: BPW1serviceId,
							characteristicId: BPW1write,
							writeType: 'writeNoResponse',
							value: buffer,
							success(res) {
								console.log("7天天气命令（单包）：", fullData);
							},
							fail(err) {
								console.log("7天天气命令失败：", fullData, err);
							},
						});
					}, 3000);
					return;
				}
				// 需要分包处理
				const bytes = that.hexToBytes(fullData);
				const packetSize = 20;
				const packets = [];
				for (let i = 0; i < bytes.length; i += packetSize) {
					packets.push(bytes.slice(i, i + packetSize));
				}
				let index = 0;
				const sendNextPacket = () => {
					if (index >= packets.length) {
						console.log("【BPW1】7天天气所有包发送完成");
						return;
					}
					const packet = packets[index];
					const buffer = that.arrayToArrayBuffer(packet);
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'writeNoResponse',
						value: buffer,
						success(res) {
							index++;
							setTimeout(sendNextPacket, 100); // 包间间隔100ms
						},
						fail(err) {
							index++;
							setTimeout(sendNextPacket, 100);
						}
					});
				};
				setTimeout(sendNextPacket, 2000);
			},
			OTAdata(deviceId, serviceId, writeuuid, options = {}) {
				let that = this
				const delayMs = typeof options.delayMs === 'number' ? options.delayMs : 3000
				const buffer2 = that.toArrayBuffer(
					"e0000609200101000100"); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							console.log("OTA：e0000609200101000100")
						},
						fail(err) {
							console.log("OTA失败：e0000609200101000100", err)
							// 查询失败时仍尝试用缓存固件信息下发测量，避免卡死
							if (that.bpw1PendingEmotionMeasure) {
								that.flushBpw1PendingEmotionMeasure(
									'ota_write_fail')
							}
						},
					})
				}, delayMs)
			},

			getsetpsin(deviceId, serviceId, writeuuid, PROTOCOL_VERSION) {
				const ackConfigByteset = new Uint8Array(9);
				ackConfigByteset[0] = 0xE0;
				ackConfigByteset[1] = 0x00;
				ackConfigByteset[2] = 0x06;
				ackConfigByteset[3] = 0x02;
				ackConfigByteset[4] = PROTOCOL_VERSION;
				ackConfigByteset[5] = 0x02;
				ackConfigByteset[6] = 0x00;
				ackConfigByteset[7] = 0x01;
				ackConfigByteset[8] = 0x01;
				let ackConfigBytesum2 = 0;
				for (let i = 0; i < ackConfigByteset.length; i++) {
					ackConfigBytesum2 += ackConfigByteset[i];
				}
				ackConfigBytesum2 = ackConfigBytesum2 % 256;
				// 创建新的数组，将校验和插入到第四个字节中
				const modifiedCommand2 = new Uint8Array(ackConfigByteset.length + 1);
				modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
				modifiedCommand2[3] = ackConfigBytesum2;
				modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
				const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte.toString(16)
					.padStart(2, '0')).join('');
				const buffer2 = this.toArrayBuffer(hexCommand2);
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							console.log("运动数据回复成功")
							this.dataBuffer = []
						},
						fail(err) {
							console.log("运动数据回复失败")
							this.dataBuffer = []
						},
					})
				}, 3000)
			},
			// 十六进制字符串转ArrayBuffer
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
			// ArrayBuffer转16进度字符串示例
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(bit) {
					return ('00' + bit.toString(16)).slice(-2)
				})
				return hexArr.join('');
			},
			ab2str(buf) {
				return String.fromCharCode.apply(null, new Uint8Array(buf));
			},
			onBLECharacteristicValueChange1(deviceId, serviceId, deviceSn) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					setTimeout(() => {
						let hexData = that.ab2hex(res.value)
						let asciiString = that.hexToAscii(hexData)
						console.log("【臂式血压计】收到蓝牙数据：", asciiString)
						if (asciiString === "error") {
							uni.closeBLEConnection({
								deviceId: deviceId,
								success() {},
								fail() {}
							})
							that.disconnectAll(deviceId)
							that.deviceList = that.deviceList.filter(item => item
								.mac !== deviceId);
							that.getUserInfo()
							uni.getNetworkType({
								success: function(getNetworkTyperes) {
									if (getNetworkTyperes
										.networkType === 'none') {
										that.aaaa(uni.getStorageSync(
											"lixianlist"))
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							return
						} else if (hexData.length === 388 &&
							!hexData.startsWith("0e") &&
							!hexData.startsWith("e0") &&
							that.xueyehuilian &&
							that.xeuyejisn !== "0" &&
							that.xeuyejimac !== "0") {
							let parsedData = that.parseQueryString(asciiString);
							const measureTs = that.resolveUploadTime(parsedData &&
								(parsedData.time ||
									parsedData.tim || parsedData.date));
							that.runHomeVitalRefreshIfAllowed(measureTs,
								'parseBloodDatatime', () => {
									that.lowPressure = that.Blood === "mmHg" ?
										parsedData.dia.trim() :
										(Number(parsedData.dia.trim()) * 0.133)
										.toFixed(1);
									that.highPressure = that.Blood === "mmHg" ?
										parsedData.sys.trim() :
										(Number(parsedData.sys.trim()) * 0.133)
										.toFixed(1);
									that.pulse = parsedData.pul.trim();
									uni.setStorageSync("lowPressure",
										parsedData.dia.trim())
									uni.setStorageSync("highPressure",
										parsedData.sys.trim())
									uni.setStorageSync("pulse", parsedData.pul
										.trim())
									uni.setStorageSync("parseBloodDatatime",
										measureTs)
									if (that.QX_HIDE) {
										that.bgaaa(parsedData.dia.trim(),
											parsedData.sys.trim())
									}
									that.updateBloodPressureStatus(parsedData
										.dia.trim(), parsedData
										.sys.trim());
								});
							that.jakoblife_fat_scale(deviceId, parsedData, deviceSn) //app上报臂式血压计数据
							// that.PCjakoblife(parsedData, deviceSn) //上报到PC显示
							that.resetDataState();
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log('无网络连接');
										that.aaaa(uni.getStorageSync(
											"lixianlist"))
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
						}
					}, 1000)
				})
			},
			resetDataState() {
				this.dataBuffer = [];
				this.xueyapack = 0;
				this.quotientota = 0;
				this.xinlvpack = 0;
				this.xueyangpack = 0;
				this.sleeppack = 0;
				this.synchronizationpack = 0;
				this.Equipmentquery = 0;
				this.quotientACC = 0;
				this.quotientPPG = 0;
			},
			/** BPW1 BLE睡眠数据解析*/
			handleSleepProtocol10(dataList, BPW1DeviceId, BPW1serviceId, BPW1write, options = {}) {
				const that = this
				const logLabel = options.logLabel || "【BPW1】睡眠数据"
				uni.setStorageSync("jiance", true)
				if (dataList.length < 160 && dataList.length > 40) {
					const bytes = hexStringToBytes(dataList.slice(18, dataList.length));
					const sleepObj = receive5610SleepData(bytes);
					const stats = that.calcSleepMinutes(sleepObj);
					console.log(logLabel, stats)
					uni.setStorageSync("sleep", stats.formalReadable)
					uni.setStorageSync("totalLight", stats.totalLight)
					uni.setStorageSync("totalDeep", stats.totalDeep)
					uni.setStorageSync("totalRem", stats.totalRem)
					uni.setStorageSync("sleep_time", sleepObj.date.slice(5, sleepObj.date.length)
						.replace("-", "/"))
					that.sleep = stats.formalReadable
					that.totalLight = stats.totalLight
					that.totalDeep = stats.totalDeep
					that.totalRem = stats.totalRem
					// 1. 总睡眠小时数（保留 1 位小数）
					const totalAll = that.timeStrToMinutes(that.sleep); // 436
					const totalH = (totalAll / 60).toFixed(1)
					const deepMin = (that.timeStrToMinutes(that.totalDeep) / 60).toFixed(1);
					const remMin = (that.timeStrToMinutes(that.totalRem) / 60).toFixed(1);
					const lightMin = (that.timeStrToMinutes(that.totalLight) / 60).toFixed(1)
					that.sleep_point = that.overallSleepScore(totalAll, totalH, deepMin, remMin,
						lightMin)
					if (totalAll === uni.getStorageSync("totalAll2") &&
						totalH === uni.getStorageSync("totalH2") &&
						deepMin === uni.getStorageSync("deepMin2") &&
						remMin === uni.getStorageSync("remMin2") &&
						lightMin === uni.getStorageSync("lightMin2")) {
						if (uni.getStorageSync("sleep_time") === "00/00" && that.getTimeAllJSON()
							.MD !== that
							.sleep_time) {
							that.jakoblife_fat_scale3(that.shoubiaomac, stats.formalReadable, that
								.shoubiaosn,
								"睡眠", "");
						}
					} else {
						uni.setStorageSync("totalAll2", totalAll)
						uni.setStorageSync("totalH2", totalH)
						uni.setStorageSync("deepMin2", deepMin)
						uni.setStorageSync("remMin2", remMin)
						uni.setStorageSync("lightMin2", lightMin)
						that.jakoblife_fat_scale3(that.shoubiaomac, stats.formalReadable, that
							.shoubiaosn, "睡眠",
							"");
					}
					that.sendack2(dataList, BPW1DeviceId, BPW1serviceId, BPW1write)
					// 历史同步中勿提前结束标记，否则后续血压包会走实时路径弹窗
					if (!that.isBpw1HistorySyncing()) {
						that.blewatch_id = "0"
						that.blewatch_id2 = "1"
					}
					that.resetDataState()
				} else {
					that.ProtocolSubcommand = dataList.slice(12, 14); // 协议子命令1个字节
					const ProtocolLength = dataList.slice(2, 6); // 协议长度 2个字节
					that.tempBuffer = parseInt(ProtocolLength, 16) + 4;
					if (dataList.length <= 40) {
						that.sleeppack = that.calculateQuotient(that.tempBuffer, 20);
					} else {
						that.sleeppack = that.calculateQuotient(that.tempBuffer, 80);
					}
				}
			},
			/**BPW1 BLE运动数据解析
			 * @param {Object} dataList
			 * @param {Object} BPW1DeviceId
			 * @param {Object} BPW1serviceId
			 * @param {Object} BPW1write
			 */
			handleSportProtocol00(dataList, BPW1DeviceId, BPW1serviceId, BPW1write) {
				const that = this
				// 通知连接后初始化链：运动回包已到，可发下一条（历史同步）
				that.notifyBpw1SetupDeviceReply('sportData')
				const stepheart = dataList.slice(0, 18);
				const stepbody = dataList.slice(18, dataList.length);
				const step = stepbody.slice(0, 8)
				const juli = stepbody.slice(8, 16)
				const kaluli = stepbody.slice(16, stepbody.length)
				// console.log("运动数据卡路里", kaluli)
				// console.log("步数值", parseInt(step, 16))
				// console.log("距离", parseInt(juli, 16))
				// console.log("卡路里", parseInt(kaluli, 16))
				const settept1 = parseInt(step, 16);
				that.jakoblife_fat_scale3(that.shoubiaomac, settept1, that.shoubiaosn, "步数", "");
				that.sendack2(dataList, BPW1DeviceId, BPW1serviceId, BPW1write)
				that.resetDataState()
			},
			handleProtocol0e(dataList, CMD, ProtocolIdentifierppg, options = {}) {
				const that = this
				const refreshKeepAlive = options.refreshKeepAlive !== false
				const useQxHide = options.useQxHide !== false
				let qingxukey = dataList.slice(12, 14)
				console.log("【BPW1】" + qingxukey, dataList)
				// 设备查询 ACK：仅放行初始化串行，不在此处写命令
				if (qingxukey === '00' && CMD === '00') {
					that.notifyBpw1SetupDeviceReply('queryAck00')
				}
				// 绑定 ACK(CMD 08)
				if (CMD === '08') {
					that.notifyBpw1SetupDeviceReply('bindAck08')
				}
				// 校时 ACK(key 08 / CMD 02)
				if (qingxukey === '08' && CMD === '02') {
					that.notifyBpw1SetupDeviceReply('timeAck08')
				}
				if (CMD === "06" || (CMD === "03" && qingxukey === "25")) {
					that.xueya_xinlv = true
					const isEmotionPpgCmd = (CMD === "03" && qingxukey === "25")
					const isCardHr = that.bpw1CardHrOnly === true
					// 情绪命令 ACK：若立即测量/血压后标记被误清，按已发命令恢复会话，避免后续 Status01 被忽略
					if (isEmotionPpgCmd && !isCardHr) {
						if (that.bpw1ImmediateCmdStarted || that.bpw1ImmediatePpgLaunchLock ||
							(that._bpw1ImmediateCmdAt && Date.now() - that._bpw1ImmediateCmdAt <
								120000)) {
							that.immediateEmotionMeasure = true
							that.sleep_alertid = 1
							that.sleep_alertdisabled = true
							uni.setStorageSync('sleep_alertdisabled', true)
						} else if (that.yalixueyatype ||
							(that._bpw1AfterBpCmdAt && Date.now() - that._bpw1AfterBpCmdAt <
								120000) ||
							!!that._bpw1AfterBpPpgTimer) {
							that.yalixueyatype = true
							that.sleep_alertid = 1
							that.sleep_alertdisabled = true
							uni.setStorageSync('sleep_alertdisabled', true)
						}
					}
					const isPpgSession = that.yalixueyatype === true ||
						that.immediateEmotionMeasure === true ||
						that.sleep_alertid === 1 ||
						that.bpw1ImmediateCmdStarted === true ||
						uni.getStorageSync("sendwatch") === 1
					// PPG/情绪/卡片心率：不进入血压-心率配对；普通血压测量才配对
					// 若仍有待合并的实时血压，保留伴生心率缓存，避免血压后 PPG 把配对冲掉只报心率
					if (isEmotionPpgCmd || that.yalixueyatype || that.immediateEmotionMeasure ||
						isCardHr) {
						if (!that.bpw1PendingLiveBp) {
							that.bpw1AwaitingBpHrPair = false
							that.bpw1PendingBpCompanionHr = null
						}
					} else {
						that.bpw1AwaitingBpHrPair = true
						// 手表开始测血压：结束历史同步标记，避免实时包误走历史上报只报心率
						if (that.isBpw1HistorySyncing()) {
							that.endBpw1HistorySync('live_bp_measure_start')
						}
					}
					// 仅情绪/PPG/定时采集期间置灰「立即测量」；普通血压、首页卡片测心率不置灰，避免测完一直灰
					if ((isEmotionPpgCmd || isPpgSession) && !isCardHr) {
						that.sleep_alertdisabled = true
						uni.setStorageSync("sleep_alertdisabled", true)
					}
					if (refreshKeepAlive) {
						refreshQxBleKeepAliveNotification()
					}
					if (that.sleep_alertid === 1 || uni.getStorageSync("sendwatch") === 1) {
						if (that.watchtimer) {
							clearInterval(that.watchtimer);
							that.watchtimer = null;
						}
						// 墙钟超时：血压后/压力 PPG 手表侧采集常超过 60s，放宽到 90s
						const waitMs = (that.yalixueyatype || (that._bpw1AfterBpCmdAt && Date.now() - that
								._bpw1AfterBpCmdAt < 120000)) ?
							90 * 1000 : 60 * 1000
						const waitDeadline = Date.now() + waitMs
						if (isEmotionPpgCmd) {
							console.log('【BPW1】收到情绪/PPG ACK25，等待Status01传数', {
								yalixueyatype: that.yalixueyatype,
								immediate: that.immediateEmotionMeasure,
								afterBpAt: that._bpw1AfterBpCmdAt || 0,
								waitMs
							})
						}
						that.watchtimer = setInterval(() => {
							if (Date.now() < waitDeadline) {
								return
							}
							clearInterval(that.watchtimer);
							that.watchtimer = null
							uni.hideLoading()
							that.releaseBpw1AwaitingBpHrPair(true)
							that.resetDataState();
							if (uni.getStorageSync("sendwatch") === 1) {
								that.notifyQxScheduledMeasureEnd('采集等待超时60秒')
								uni.removeStorageSync("sendwatch")
							} else if (that.yalixueyatype) {
								console.warn('【BPW1】血压后/压力PPG等待Status01超时', waitMs)
								that.notifyBpw1PpgFailOrInterrupt('BPW1压力PPG等待超时', {
									silent: true
								})
							} else {
								const showCloudComputingLoading = that.QX_HIDE && that
									.immediateEmotionMeasure
								if (showCloudComputingLoading) {
									that.immediateEmotionMeasure = false
									that.sleep_alertid = 0
									uni.showModal({
										content: that.$t("这个功能需要手表软件版本在"),
										confirmText: that.$t('确定'),
										showCancel: false,
										success(modal) {
											if (modal.confirm) {
												that.restoreEmotionPageButtons(
													'BPW1超时弹窗确认')
											}
										}
									})
								} else {
									that.notifyBpw1PpgFailOrInterrupt('BPW1采集等待超时60秒', {
										silent: true
									})
								}
							}
						}, 1000)
					}
				}
				if (ProtocolIdentifierppg === "0e00" && dataList.length < 40) {
					that.resetDataState();
				}
			},
			handleProtocolE0Cmd20(dataList, BPW1DeviceId, BPW1serviceId, BPW1write) {
				const that = this
				console.log("11dataList", dataList)
				switch (dataList.slice(18, dataList.length)) {
					case "01":
						console.log("手表电量不足")
						uni.showModal({
							content: that.$t("手表电量不足"),
							confirmText: that.$t('确定'),
							showCancel: false,
							success(modal) {
								if (modal.confirm) {}
							}
						});
						that.sendack(dataList, BPW1DeviceId, BPW1serviceId, BPW1write);
						// 电量不足会中断测量：若 PPG 会话中，恢复按钮
						that.notifyBpw1PpgFailOrInterrupt('手表电量不足', {
							silent: true
						})
						that.resetDataState()
						break
					case "00":
					case "02":
						that.sendack(dataList, BPW1DeviceId, BPW1serviceId, BPW1write);
						that.resetDataState()
						break
					case "03":
						that.sendack(dataList, BPW1DeviceId, BPW1serviceId, BPW1write);
						that.resetDataState()
						break
					case "04":
						that.sendack(dataList, BPW1DeviceId, BPW1serviceId, BPW1write);
						that.resetDataState()
						break
				}
			},
			handleSleepBufferData(BPW1DeviceId, BPW1serviceId, BPW1write) {
				const that = this
				const formattedData = that.formatData(that.dataBuffer)
				const bytes = hexStringToBytes(formattedData.slice(18, formattedData.length));
				const sleepObj = receive5610SleepData(bytes);
				const stats = that.calcSleepMinutes(sleepObj);
				console.log("【BPW1】睡眠数据", stats)
				uni.setStorageSync("sleep", stats.formalReadable)
				uni.setStorageSync("totalLight", stats.totalLight)
				uni.setStorageSync("totalDeep", stats.totalDeep)
				uni.setStorageSync("totalRem", stats.totalRem)
				that.sleep = stats.formalReadable
				that.totalLight = stats.totalLight
				that.totalDeep = stats.totalDeep
				that.totalRem = stats.totalRem
				// 1. 总睡眠小时数（保留 1 位小数）
				const totalAll = that.timeStrToMinutes(that.sleep); // 436
				const totalH = (totalAll / 60).toFixed(1)
				const deepMin = (that.timeStrToMinutes(that.totalDeep) / 60).toFixed(1);
				const remMin = (that.timeStrToMinutes(that.totalRem) / 60).toFixed(1);
				const lightMin = (that.timeStrToMinutes(that.totalLight) / 60).toFixed(1)
				that.sleep_point = that.overallSleepScore(totalAll, totalH, deepMin, remMin,
					lightMin)
				uni.setStorageSync("sleep_time", sleepObj.date.slice(5, sleepObj.date.length)
					.replace("-", "/"))
				if (totalAll === uni.getStorageSync("totalAll2") &&
					totalH === uni.getStorageSync("totalH2") &&
					deepMin === uni.getStorageSync("deepMin2") &&
					remMin === uni.getStorageSync("remMin2") &&
					lightMin === uni.getStorageSync("lightMin2")) {
					if (uni.getStorageSync("sleep_time") === "00/00" && that.getTimeAllJSON()
						.MD !== that
						.sleep_time) {
						that.jakoblife_fat_scale3(that.shoubiaomac, stats.formalReadable, that
							.shoubiaosn, "睡眠",
							"");
					}
					// console.log("0当天手表上相同的睡眠数据已经上传过", that.getTimeAllJSON().MD + "|" + that.sleep_time)
				} else {
					uni.setStorageSync("totalAll2", totalAll)
					uni.setStorageSync("totalH2", totalH)
					uni.setStorageSync("deepMin2", deepMin)
					uni.setStorageSync("remMin2", remMin)
					uni.setStorageSync("lightMin2", lightMin)
					that.jakoblife_fat_scale3(that.shoubiaomac, stats.formalReadable, that
						.shoubiaosn, "睡眠", "");
				}
				that.sendack2(formattedData, BPW1DeviceId, BPW1serviceId, BPW1write);
				// 历史同步中勿提前结束标记
				if (!that.isBpw1HistorySyncing()) {
					that.blewatch_id = "0"
					that.blewatch_id2 = "1"
				}
				that.resetDataState()
			},
			handleOtaBufferData(BPW1DeviceId, BPW1serviceId, BPW1write) {
				const that = this
				const formattedData = that.formatData(that.dataBuffer)
				const bytes = formattedData.slice(18, formattedData.length);
				console.log("手环信息更新", bytes)
				uni.setStorageSync("otadatares", bytes.toUpperCase())
				uni.setStorageSync("otaBP", bytes.toUpperCase())
				// 立即测量待启动：必须 ACK，否则后续情绪命令发不出去
				if (that.bpw1PendingEmotionMeasure) {
					that.sendack(formattedData, BPW1DeviceId, BPW1serviceId, BPW1write);
					that.resetDataState()
					console.log('【BPW1】待测会话中跳过OTA升级检查，已ACK设备信息')
					that.notifyBpw1OtaInfoReady('ota_buffer')
					return
				}
				// 已进入测量会话/传数：勿 ACK 设备信息，避免写特征打断 Status01/02
				if (that.bpw1PpgTransferActive || that.isBpw1ActivePpgSession()) {
					console.log('【BPW1】测量会话中跳过设备信息ACK，仅更新otadatares')
					that.resetDataState()
					return
				}
				that.sendack(formattedData, BPW1DeviceId, BPW1serviceId, BPW1write);
				that.resetDataState()
				that.loadFiles(bytes.toUpperCase(), BPW1DeviceId, BPW1serviceId)
			},
			/** 心率数据解析*/
			handleXinlvBufferData(BPW1DeviceId, BPW1serviceId, BPW1write, options = {}) {
				const that = this
				const logHeartRateDatatime = options.logHeartRateDatatime !== false
				that.blewatch_id2 = "1"
				const AlltypeArray = that.dataBuffer;
				const alltypearray = that.formatData(AlltypeArray);
				const protocolData = that.parseProtocolData(alltypearray);
				// 历史同步：血压/心率分包到达，保留未配对缓存，避免后包清空导致漏报
				const keepHistoryHr = that.isBpw1HistorySyncing() ? [...(that.hrResult || [])] : [];
				that.hrResult = []
				const hrResultdata = Healthparser.parseProtocolData(protocolData);
				const hrRecords = (hrResultdata && hrResultdata.data && hrResultdata.data
						.records) ?
					hrResultdata.data.records : [];
				for (let i = 0; i < hrRecords.length; i++) {
					that.hrResult.push(hrRecords[i])
				}
				if (keepHistoryHr.length > 0) {
					keepHistoryHr.forEach(hr => {
						const key = that.normalizeDateTimeKey(`${hr.date} ${hr.time}`)
						if (!key) return
						const exists = that.hrResult.some(item =>
							that.normalizeDateTimeKey(`${item.date} ${item.time}`) ===
							key)
						if (!exists) {
							that.hrResult.push(hr)
						}
					})
				}
				const heart = protocolData.Covmamlueand.slice(0, 8);
				const heartTime = heart.slice(0, 4);
				const {
					year,
					month,
					day,
					datealltime
				} = that.parseBinaryTime(heartTime);
				const hexData = protocolData.Covmamlueand.slice(protocolData.Covmamlueand.length -
					16,
					protocolData.Covmamlueand.length);
				const heartRateData = that.parseHeartRateData(hexData);
				let heartRateDatatime = that.datatime(datealltime + " " + heartRateData.time)
				const hrSub = protocolData.Protocolsubcommand
				if (hrSub === '19') {
					console.log('【BPW1】血压数据(19)：', {
						date: datealltime,
						time: heartRateData.time,
						highPressure: heartRateData.systolic,
						lowPressure: heartRateData.diastolic,
						pulse: heartRateData.bloodPressureType,
						records: (that.hrResult || []).length
					})
				} else {
					console.log('【BPW1】心率数据：', {
						date: datealltime,
						time: heartRateData.time,
						heartRate: heartRateData.diastolic,
						records: (that.hrResult || []).length
					})
					if (that.isBpw1HistorySyncing() && that.hrResult && that.hrResult.length > 0) {
						// console.log('【BPW1】心率历史记录：', that.hrResult.map(hr => ({
						// 	date: hr.date,
						// 	time: hr.time,
						// 	heartRate: hr.heartRate
						// })))
					}
				}
				switch (protocolData.Protocolsubcommand) {
					case "00":
						// 首页展示：有网且比接口更新时才刷新
						that.runHomeVitalRefreshIfAllowed(heartRateDatatime, 'heartRateDatatime',
							() => {
								const pulsetimes =
									`${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
								that.pulse = heartRateData.diastolic
								that.pulsetime = pulsetimes
								uni.setStorageSync("heartRateDatatime", heartRateDatatime)
								uni.setStorageSync("pulse", heartRateData.diastolic)
								uni.setStorageSync("pulsetimes", pulsetimes)
								that.updateLocalHeartRateCard(heartRateData.diastolic,
									pulsetimes);
								setTimeout(() => {
									that.cardeditData(that.list, "bloodData")
								}, 1000)
							});
						// 上报：历史同步只缓冲；血压伴生心率合并用血压时间；PPG/卡片心率单独上报且禁止并入血压
						{
							const hrRecord = {
								date: datealltime,
								time: heartRateData.time,
								heartRate: heartRateData.diastolic
							};
							const isPpgOrCardHr = that.yalixueyatype === true ||
								that.immediateEmotionMeasure === true ||
								that.bpw1CardHrOnly === true ||
								that.bpw1PpgTransferActive === true ||
								uni.getStorageSync('sendwatch') === 1;
							// PPG/卡片心率不进伴生回捞缓存，避免测完后被并进血压
							if (!isPpgOrCardHr && that.isValidBpw1HeartRate(hrRecord.heartRate) &&
								(!that.isBpw1HistorySyncing() ||
									that.isBpw1LikelyLiveVitalTs(heartRateDatatime))) {
								that.bpw1RecentLiveHr = {
									...hrRecord,
									ts: heartRateDatatime,
									at: Date.now()
								};
							}
							// PPG/卡片心率永不进入血压配对；有待合并血压时仅近时心率进入配对分支
							// 历史同步中：勿仅凭 xueya_xinlv 把任意心率当伴生并提前结束同步（否则旧血压会抢跑 PPG）
							const nearPendingBp = that.shouldHoldBpw1HrForBpPair(
								heartRateDatatime);
							const holdForLiveBp = !isPpgOrCardHr && (
								nearPendingBp ||
								(!that.bpw1PendingLiveBp && !that.isBpw1HistorySyncing() &&
									(that.xueya_xinlv || that.bpw1AwaitingBpHrPair))
							);
							if (holdForLiveBp && that.isBpw1HistorySyncing() && nearPendingBp) {
								that.endBpw1HistorySync('live_hr_for_bp')
							}
							if (that.isBpw1HistorySyncing() && !holdForLiveBp) {
								// 历史同步：只缓冲，合并上报去抖，避免每包都查库/写通道加重 ACK 10007
								if ((that.bpResult && that.bpResult.length > 0) ||
									(that.hrResult && that.hrResult.length > 0)) {
									that.scheduleBpw1HistoryMergeUpload()
								}
							} else if (holdForLiveBp) {
								const pendingBp = that.bpw1PendingLiveBp;
								const existingCompanion = that.bpw1PendingBpCompanionHr;
								const newSkew = (pendingBp && heartRateDatatime != null) ?
									Math.abs(Number(heartRateDatatime) - Number(pendingBp.ts)) : 0;
								const oldSkew = (existingCompanion && pendingBp &&
										existingCompanion.ts != null) ?
									Math.abs(Number(existingCompanion.ts) - Number(pendingBp.ts)) :
									Infinity;
								if (!pendingBp) {
									// 心率先到：先缓存，等血压
									that.bpw1PendingBpCompanionHr = {
										...hrRecord,
										ts: heartRateDatatime
									};
								} else if (newSkew <= 5 && (!existingCompanion || newSkew <=
										oldSkew)) {
									// 仅时间差 ≤5 秒才作伴生，避免旧心率/单独测/PPG 误配
									that.bpw1PendingBpCompanionHr = {
										...hrRecord,
										ts: heartRateDatatime
									};
									that.tryFlushBpw1LiveBpHrUpload(false);
								} else {
									// 与待合并血压时间差过大：单独上报心率，不阻塞血压
									uni.getNetworkType({
										success: function(res) {
											if (res.networkType === 'none') {
												return;
											}
											that.uploadBpw1HeartRateMissingInDb(
												that.shoubiaomac,
												that.shoubiaosn, [hrRecord]
											);
										}
									});
									that.tryFlushBpw1LiveBpHrUpload(false);
								}
							} else {
								uni.getNetworkType({
									success: function(res) {
										if (res.networkType === 'none') {
											return;
										}
										const rawList = that.hrResult.length > 0 ? that
											.hrResult : [
												hrRecord
											];
										const uploadList = rawList.filter(hr => !that
											.isBpw1HrCoveredByBpPair(hr));
										if (uploadList.length === 0) {
											console.log('【BPW1】心率已随血压合并，跳过单独上报');
											return;
										}
										that.uploadBpw1HeartRateMissingInDb(
											that.shoubiaomac,
											that.shoubiaosn,
											uploadList
										);
									},
									fail: function(err) {
										console.error('获取网络类型失败：', err);
									}
								});
							}
							if (that.bpw1CardHrOnly) {
								that.bpw1CardHrOnly = false
							}
						}
						that.xueya_xinlv = false
						that.sendack2(alltypearray, BPW1DeviceId, BPW1serviceId, BPW1write);
						that.resetDataState()
						break;
					case "19": {
						const canUpload19 = that.isDeviceNewerThanApiBaseline(heartRateDatatime,
								'parseBloodDatatime') ||
							that.isDeviceNewerThanApiBaseline(heartRateDatatime,
								'heartRateDatatime');
						that.runHomeVitalRefreshIfAllowed(heartRateDatatime, 'parseBloodDatatime',
							() => {
								that.lowPressure = that.Blood === "mmHg" ? heartRateData
									.diastolic : (Number(
										heartRateData.diastolic) * 0.133).toFixed(1);
								that.highPressure = that.Blood === "mmHg" ? heartRateData
									.systolic : (Number(
										heartRateData.systolic) * 0.133).toFixed(1);
								that.pulse = heartRateData.bloodPressureType;
								uni.setStorageSync("lowPressure", heartRateData.diastolic)
								uni.setStorageSync("highPressure", heartRateData.systolic)
								uni.setStorageSync("pulse", heartRateData.bloodPressureType)
								uni.setStorageSync("parseBloodDatatime", heartRateDatatime)
								if (that.isDeviceNewerThanApiBaseline(heartRateDatatime,
										'heartRateDatatime')) {
									uni.setStorageSync("heartRateDatatime", heartRateDatatime)
								}
								that.updateBloodPressureStatus(heartRateData.diastolic,
									heartRateData.systolic);
							});
						const isHistorySync19 = that.isBpw1HistorySyncing();
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {
									// 历史同步离线不弹血压高提示
									if (!isHistorySync19 && uni.getStorageSync(
											"time19") !== heartRateData
										.time) {
										if (that.QX_HIDE) {
											that.bgaaa(heartRateData.diastolic,
												heartRateData.systolic)
										}
									}
									return;
								}
								if (canUpload19) {
									if (isHistorySync19) {
										// 历史上报：无弹窗、不启 PPG
										that.Watch_Historical_data(
											that.shoubiaomac,
											heartRateData.systolic,
											heartRateData.diastolic,
											heartRateData.bloodPressureType,
											that.shoubiaosn,
											heartRateDatatime
										);
									} else {
										that.jakoblife_fat_scale22(that.shoubiaomac,
											heartRateData.systolic,
											heartRateData.diastolic, heartRateData
											.bloodPressureType, that
											.shoubiaosn,
											heartRateDatatime);
										// 实时血压(19)后启 PPG；仅定时/实时血压/立即测量可启 PPG
										if (that.isBpw1BpPacketEligibleForLiveMeasure(
												heartRateDatatime)) {
											that.tryStartBpw1PpgAfterBp('实时血压19',
												true);
										}
									}
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
					}
					that.sendack2(alltypearray, BPW1DeviceId, BPW1serviceId, BPW1write);
					that.resetDataState()
					break
					default:
						console.warn("未知的协议子命令:", that.ProtocolSubcommand);
				}
			},
			/**解析血压数据
			 * @param {string} hexData - 十六进制字符串
			 * @returns {Object} - 包含血压数据的对象
			 */
			handleXueyaBufferData(BPW1DeviceId, BPW1serviceId, BPW1write, options = {}) {
				const that = this
				const logBloodDatatime = options.logBloodDatatime !== false
				const logBloodUntimestamped = options.logBloodUntimestamped !== false
				const requireBlewatchIdForYali = options.requireBlewatchIdForYali !== false
				that.blewatch_id2 = "1"
				const AlltypeArray = that.dataBuffer;
				const alltypearray = that.formatData(AlltypeArray);
				const protocolData = that.parseProtocolData(alltypearray);
				const Covmamlueand = alltypearray.slice(18, alltypearray.length);
				const bpResultdata = Healthparser.parseProtocolData(protocolData);
				// 历史同步：血压/心率分包到达，保留未配对缓存，避免后包清空导致漏报
				const keepHistoryBp = that.isBpw1HistorySyncing() ? [...(that.bpResult || [])] : [];
				that.bpResult = []
				const bpRecords = (bpResultdata && bpResultdata.data && bpResultdata.data
						.records) ?
					bpResultdata.data.records : [];
				// 必须包含全部记录（含最后一条）。原先 length-1 会在单条实时血压时让 bpResult 为空，历史上报只剩心率
				for (let i = 0; i < bpRecords.length; i++) {
					that.bpResult.push(bpRecords[i])
				}
				if (keepHistoryBp.length > 0) {
					keepHistoryBp.forEach(bp => {
						const key = that.normalizeDateTimeKey(`${bp.date} ${bp.time}`)
						if (!key) return
						const exists = that.bpResult.some(item =>
							that.normalizeDateTimeKey(`${item.date} ${item.time}`) ===
							key)
						if (!exists) {
							that.bpResult.push(bp)
						}
					})
				}
				const heartTime = Covmamlueand.slice(0, 4);
				const {
					year,
					month,
					day,
					datealltime
				} = that.parseBinaryTime(heartTime);
				const hexData = Covmamlueand.slice(Covmamlueand.length - 16, Covmamlueand.length);
				const parseBloodData = that.parseHeartRateData(hexData);
				let hexDataupdatewatchtime = that.datatime(datealltime + " " + parseBloodData.time)
				console.log('【BPW1】血压数据：', {
					date: datealltime,
					time: parseBloodData.time,
					highPressure: parseBloodData.systolic,
					lowPressure: parseBloodData.diastolic,
					bpTypeOrPulse: parseBloodData.bloodPressureType,
					records: (that.bpResult || []).length
				})
				if (that.isBpw1HistorySyncing() && that.bpResult && that.bpResult.length > 0) {}
				// 兜底：把当前包血压写入 bpResult，保证历史合并能拿到本条
				if (parseBloodData && parseBloodData.systolic > 0 && parseBloodData.diastolic >
					0) {
					const curKey = that.normalizeDateTimeKey(
						`${datealltime} ${parseBloodData.time}`)
					const exists = that.bpResult.some(bp =>
						that.normalizeDateTimeKey(`${bp.date} ${bp.time}`) === curKey)
					if (!exists) {
						that.bpResult.push({
							date: datealltime,
							time: parseBloodData.time,
							highPressure: parseBloodData.systolic,
							lowPressure: parseBloodData.diastolic
						})
					}
				}
				switch (protocolData.Protocolsubcommand) {
					case "01": {
						// 正在测血压（用户实时会话）才强制走实时；历史同步中勿仅凭「时间接近现在」打断同步去弹窗/启 PPG
						// App 发令后：额外要求设备时间不早于发令时刻，避免同步旧血压抢跑 after_bp PPG
						const sessionWantsLiveBp = !!(that.xueya_xinlv || that
							.bpw1AwaitingBpHrPair ||
							that.bpw1PendingLiveBp)
						const packetOkForLive = that.isBpw1BpPacketEligibleForLiveMeasure(
							hexDataupdatewatchtime)
						const forceLiveBpBySession = sessionWantsLiveBp && packetOkForLive
						const forceLiveBpByTime = !that.isBpw1HistorySyncing() && packetOkForLive
						const forceLiveBp = forceLiveBpBySession || forceLiveBpByTime
						if (forceLiveBpBySession && that.isBpw1HistorySyncing()) {
							that.endBpw1HistorySync('live_bp_packet')
						}
						const isHistorySync = that.isBpw1HistorySyncing() && !forceLiveBp;
						const canRefreshBp = that.isDeviceNewerThanApiBaseline(
							hexDataupdatewatchtime,
							'parseBloodDatatime');
						// 首页展示：历史/实时都可按时间门禁刷新最新值（不弹窗、不启 PPG）
						that.runHomeVitalRefreshIfAllowed(hexDataupdatewatchtime,
							'parseBloodDatatime', () => {
								uni.setStorageSync("parseBloodDatatime",
									hexDataupdatewatchtime)
								that.lowPressure = that.Blood === "mmHg" ? parseBloodData
									.diastolic : (Number(
										parseBloodData.diastolic) * 0.133).toFixed(1);
								that.highPressure = that.Blood === "mmHg" ? parseBloodData
									.systolic : (Number(
										parseBloodData.systolic) * 0.133).toFixed(1);
								uni.setStorageSync("lowPressure", parseBloodData.diastolic)
								uni.setStorageSync("highPressure", parseBloodData.systolic)
								that.updateBloodPressureStatus(parseBloodData.diastolic,
									parseBloodData.systolic);
							});
						// 历史同步：只走合并上报；不弹血压高提示、不启动 PPG、不进入实时配对
						if (isHistorySync) {
							that.sendack2(that.formatData(that.dataBuffer), BPW1DeviceId,
								BPW1serviceId, BPW1write);
							that.resetDataState()
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										return;
									}
									that.scheduleBpw1HistoryMergeUpload()
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							break;
						}
						// 同步已结束后的旧历史包：合并去重上报，勿当实时血压（避免断开/提前结束后持续实时上报）
						if (!forceLiveBp && !packetOkForLive) {
							that.sendack2(that.formatData(that.dataBuffer), BPW1DeviceId,
								BPW1serviceId, BPW1write);
							that.resetDataState()
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										return;
									}
									that.scheduleBpw1HistoryMergeUpload()
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							break;
						}
						// 实时血压：与伴生心率配对后一次上报（先到血压或先到心率都可；心率必填）
						// allowUpload 固定 true：首页基线(canRefreshBp)只影响 UI/PPG，不能把合并上报拆成「只报心率」
						// 仅清理「孤立残留」的抢跑 after_bp；命令已发/延迟启动中绝不取消
						if (that.yalixueyatype && !that.immediateEmotionMeasure &&
							!that.bpw1ImmediateCmdStarted && !that.bpw1ImmediatePpgLaunchLock &&
							!that.bpw1PpgTransferActive && !that.watchtimer2 &&
							!that._bpw1AfterBpPpgTimer &&
							!(that._bpw1AfterBpCmdAt && Date.now() - that._bpw1AfterBpCmdAt <
								90000) &&
							uni.getStorageSync('sendwatch') !== 1) {
							that.yalixueyatype = false
							that.sleep_alertid = 0
							that._bpw1AfterBpCmdAt = 0
							that._bpw1LastPpgAfterBpAt = 0
							console.log('【BPW1】清理孤立血压后PPG残留，等待本次合并后再启')
						}
						that.bpw1AwaitingBpHrPair = true
						that.bpw1PendingLiveBp = {
							systolic: parseBloodData.systolic,
							diastolic: parseBloodData.diastolic,
							date: datealltime,
							time: parseBloodData.time,
							ts: hexDataupdatewatchtime,
							allowUpload: true,
							waitStartedAt: Date.now(),
							// App 发令后仅合格实时包启 PPG；无发令（手表自发）时 packetOkForLive≈原 likelyLive，行为不变
							startPpgAfterBp: packetOkForLive,
							requireBlewatchIdForYali: requireBlewatchIdForYali
						};
						const inPpgSessionForBp = that.yalixueyatype === true ||
							that.immediateEmotionMeasure === true ||
							that.bpw1PpgTransferActive === true ||
							uni.getStorageSync('sendwatch') === 1;
						// 丢弃与本条血压时间差过大的旧伴生，避免错配后干等
						if (that.bpw1PendingBpCompanionHr) {
							const stale = that.bpw1PendingBpCompanionHr;
							const staleSkew = (stale.ts != null) ?
								Math.abs(Number(stale.ts) - Number(hexDataupdatewatchtime)) :
								Infinity;
							if (staleSkew > 5) {
								console.log('【BPW1】清除过旧伴生心率，不绑定本条血压', {
									hrTime: `${stale.date} ${stale.time}`,
									skewSec: staleSkew
								});
								that.bpw1PendingBpCompanionHr = null;
							}
						}
						// byte8 仅在生理脉搏范围时当脉搏（协议上多为 bpType）；有则立刻合并上报
						if (that.isLikelyBpw1BpPacketPulse(parseBloodData.bloodPressureType)) {
							that.bpw1PendingBpCompanionHr = {
								date: datealltime,
								time: parseBloodData.time,
								heartRate: parseBloodData.bloodPressureType,
								ts: hexDataupdatewatchtime
							};
							console.log('【BPW1】血压包含脉搏，立即合并上报', parseBloodData.bloodPressureType);
						} else if (!that.bpw1PendingBpCompanionHr) {
							const buffered = that.findBpw1BufferedCompanionHr(
								hexDataupdatewatchtime, datealltime, parseBloodData.time);
							if (buffered) {
								that.bpw1PendingBpCompanionHr = buffered;
							} else if (!inPpgSessionForBp && that.bpw1RecentLiveHr) {
								// 心率先到时：从最近实时心率回捞伴生包（非 PPG，且时间差 ≤5 秒）
								const recent = that.bpw1RecentLiveHr;
								const recentAge = Date.now() - (recent.at || 0);
								const recentSkew = (recent.ts != null) ?
									Math.abs(Number(recent.ts) - Number(hexDataupdatewatchtime)) :
									Infinity;
								if (recentAge <= 30000 && recentSkew <= 5 &&
									that.isValidBpw1HeartRate(recent.heartRate)) {
									that.bpw1PendingBpCompanionHr = {
										date: recent.date,
										time: recent.time,
										heartRate: recent.heartRate,
										ts: recent.ts
									};
								}
							}
						}
						that.tryFlushBpw1LiveBpHrUpload(false);
						// 未配对成功则轮询等待伴生心率，绝不单独上报血压
						if (that.bpw1PendingLiveBp) {
							that.scheduleBpw1LiveBpHrRetry();
						}
						that.sendack2(that.formatData(that.dataBuffer), BPW1DeviceId,
							BPW1serviceId, BPW1write);
						that.resetDataState()
						break;
					}
					default:
						console.warn("未知的协议子命令:", that.ProtocolSubcommand);
				}
			},
			/**血氧数据解析 */
			handleXueyangBufferData(BPW1DeviceId, BPW1serviceId, BPW1write, options = {}) {
				const that = this
				const logOxygenDatatime = options.logOxygenDatatime !== false
				that.blewatch_id2 = "1"
				const AlltypeArray = that.dataBuffer;
				const alltypearray = that.formatData(AlltypeArray);
				const protocolData = that.parseProtocolData(alltypearray);
				const heart = protocolData.Covmamlueand.slice(0, 8);
				const heartTime = heart.slice(0, 4);
				const {
					year,
					month,
					day,
					datealltime
				} = that.parseBinaryTime(heartTime);
				const hexData = protocolData.Covmamlueand.slice(protocolData.Covmamlueand.length -
					16,
					protocolData.Covmamlueand.length);
				const oxygenRateData = that.parseHeartRateData(hexData);
				let oxygenupdatewatchtime = that.datatime(datealltime + " " + oxygenRateData.time)
				console.log("【BPW1】血氧数据", oxygenRateData)
				switch (protocolData.Protocolsubcommand) {
					case "02":
						that.runHomeVitalRefreshIfAllowed(oxygenupdatewatchtime, 'oxygenDatatime',
							() => {
								uni.setStorageSync("oxygenDatatime", oxygenupdatewatchtime)
								const xueyang = oxygenRateData.diastolic;
								const xueyangtimes =
									`${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
								uni.setStorageSync("xueyang", xueyang);
								uni.setStorageSync("xueyangtimes", xueyangtimes);
								that.updateLocalBloodOxygenCard(xueyang, xueyangtimes);
								that.jakoblife_fat_scale3(that.shoubiaomac, oxygenRateData
									.diastolic, that.shoubiaosn,
									"血氧", oxygenupdatewatchtime);
								setTimeout(() => {
									that.cardeditData(that.list, "bloodData")
								}, 1000)
							});
						that.sendack2(alltypearray, BPW1DeviceId, BPW1serviceId, BPW1write);
						that.resetDataState()
						break;
					default:
						console.warn("未知的协议子命令:", that.ProtocolSubcommand);
				}
			},
			/**设备查询解析
			 * @param {Object} BPW1DeviceId
			 * @param {Object} BPW1serviceId
			 * @param {Object} BPW1write
			 */
			handleEquipmentQueryBufferData(BPW1DeviceId, BPW1serviceId, BPW1write) {
				const that = this
				const formattedData = that.formatData(that.dataBuffer)
				const hardcodedData = formattedData.slice(18, formattedData.length)
				const parser = new BandReplyParser();
				const result = parser.parse(hardcodedData);
				// console.log('硬编码数据解析成功', JSON.stringify(result, null, 2));
				setTimeout(() => {
					that.sendack2(formattedData, BPW1DeviceId, BPW1serviceId, BPW1write)
					that.resetDataState()
				}, 500)
			},

			/**
			 * ACC数据解析
			 */
			handleAccBufferData(BPW1DeviceId, BPW1serviceId, BPW1write, options = {}) {
				const that = this
				const handleParseError = options.handleParseError === true
				clearInterval(that.watchtimer);
				const allDataACC = that.formatData(that.dataBuffer);
				const ACCdata = allDataACC.slice(18, allDataACC.length)
				// console.log("ACC蓝牙数据包：" + allDataACC)
				const result = AccDataParser.debugParseExample(ACCdata);
				if (result.success) {
					const xData = result.data.map(item => item.x);
					const yData = result.data.map(item => item.y);
					const zData = result.data.map(item => item.z);
				} else if (handleParseError) {
					if (!that.QX_FAIL) {
						that.QX_FAIL = true
						console.error('解析失败:', result.error);
					}
				}
				setTimeout(() => {
					that.resetDataState();
					that.sendack(allDataACC, BPW1DeviceId, BPW1serviceId, BPW1write);
				}, 10)
			},
			/**
			 * PPG数据解析
			 */
			handlePpgBufferData(BPW1DeviceId, BPW1serviceId, BPW1write, options = {}) {
				const that = this
				const handleParseError = options.handleParseError === true
				const allDataPPG = that.formatData(that.dataBuffer);
				const PPGdata = allDataPPG.slice(18, allDataPPG.length)
				// console.log("PPG蓝牙数据包：" + allDataPPG)
				const result = PPGParser.parsePPGData(PPGdata, `0x${that.PPGdataarray}`);
				if (result.success) {
					for (let i = 0; i < result.data.length; i++) {
						let jsonppglist = {
							greenValue: result.data[i].greenValue,
							irValue: result.data[i].irValue,
							greenValueirValue: `${that.intToHex(result.data[i].greenValue, true, 4)}${that.intToHex(result.data[i].irValue, true, 4)}`,
							greenValue16: that.intToHex(result.data[i].greenValue, true, 4)
						}
						// console.log("PPG解析之后的数据：", JSON.stringify(jsonppglist.greenValue))
						that.bufferPPG.push(result.data[i].greenValue)
					}
					// 收包续期：避免定时 PPG 超过固定超时后未等 Status02 就清会话
					that.bpw1PpgLastPacketAt = Date.now()
					if (that.bpw1PpgTransferActive || uni.getStorageSync('sendwatch') === 1) {
						that.bpw1PpgTransferDeadline = Date.now() + 120 * 1000
						try {
							touchQxPpgXferBusy()
						} catch (eTouch) {}
					}
				} else if (handleParseError) {
					if (!that.QX_FAIL) {
						that.QX_FAIL = true
						console.error('解析失败:', result.error);
					}
				}
				// console.log("PPG解析之后的数据包：" + JSON.stringify(result))
				setTimeout(() => {
					that.resetDataState();
					that.sendack(allDataPPG, BPW1DeviceId, BPW1serviceId, BPW1write);
				}, 10)
			},
			onBLECharacteristicValueChange2(deviceId, serviceId, deviceSn) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					const dataList = that.ab2hex(res.value)
					if (dataList.length === 10) {} else if (dataList.length > 200) {
						let aaa = that.ab2str(res.value)
						let hexString = that.ab2hex(res.value)
						let asciiString = that.hexToAscii(hexString)
						let parsedData = that.parseQueryString(asciiString);
						that.jakoblife_fat_scale(deviceId, parsedData, deviceSn)
					} else {
						const resheart = dataList.slice(0, 4);
						const reslength = dataList.slice(4, 6);
						const respackage = dataList.slice(6, 10);
						const respackage1 = dataList.slice(10, 14);
						const restype = dataList.slice(14, 16);
						const otherData = dataList.slice(16, dataList.length - 2);
						const otherDatatiwen1 = dataList.slice(16, 20);
						const otherDatatiwen2 = dataList.slice(20, dataList.length - 2);
						const otherData1 = dataList.slice(16, 24);
						const otherData2 = dataList.slice(24, 28);
						const otherData3 = dataList.slice(28, dataList.length - 2);
						const otherall = dataList.slice(dataList.length - 2, dataList
							.length);
						const hexBytes = [];
						for (let i = 0; i < otherData.length; i += 2) {
							hexBytes.push(otherData.substring(i, i + 2));
						}
						const decimalArray = hexBytes.map(hexByte => {
							return parseInt(hexByte, 16);
						});
						//01表示心率数据，02表示血压数据，03表示血氧数据，04表示步数和千卡数据，07表示体温 08表示压力
						switch (restype) {
							case "01": //心率
								const xinlv = decimalArray[0]
								that.jakoblife_fat_scale2(deviceId, "", "", xinlv,
									deviceSn)
								break
							case "02": //血压和心率
								const shousuoye = decimalArray[0]
								const shuzhangya = decimalArray[1]
								const length = decimalArray.length - 2
								const maibo = decimalArray[length]
								that.jakoblife_fat_scale2(deviceId, shousuoye, shuzhangya,
									maibo, deviceSn)
								break
							case "03": //血氧
							{
								const xueyang = decimalArray[0]
								const xueyangtimes = decimalArray[3] + "/" + decimalArray[
									4]
								const measureTs = that.datatime(that.getTimeAllJSON()
									.YMDHMS)
								that.runHomeVitalRefreshIfAllowed(measureTs,
									'oxygenDatatime', () => {
										uni.setStorageSync("oxygenDatatime", measureTs)
										uni.setStorageSync("xueyang", xueyang)
										uni.setStorageSync("xueyangtimes",
											xueyangtimes)
										that.updateLocalBloodOxygenCard(xueyang,
											xueyangtimes)
										that.cardeditData(that.list, "bloodData")
									});
								that.list_recipe()
							}
							break
							case "05": //步数
								const settept1 = decimalArray[1]
								uni.setStorageSync("settept1", settept1)
								that.list_recipe()
								break
							case "07": //体温
								let tiwen = parseInt(otherDatatiwen1, 16) /
									10 // 第二个参数16表示输入是16进制
								let parts = otherDatatiwen2.match(/.{1,2}/g);
								let tiwentimes = parts.map(p => parseInt(p, 16))[2] + "/" +
									parts.map(p =>
										parseInt(p, 16))[3]
								uni.setStorageSync("tiwen", tiwen)
								uni.setStorageSync("tiwentimes", tiwentimes)
								that.list_recipe()
								break
							case "08": //压力
								break
							case "22": //血压和心率
								const sum = decimalArray.reduce((acc, curr) => acc + curr,
									0);
								that.isSumZero = sum === 0;
								if (that.isSumZero === false) {
									const shousuoye = decimalArray[1]
									const shuzhangya = decimalArray[2]
									const length = decimalArray.length - 1
									const maibo = decimalArray[3]
									const year = that.hexToDecimal(otherData2)
									that.jakoblife_fat_scale2(deviceId, shousuoye,
										shuzhangya, maibo, deviceSn)
								}
								break
							default:
								console.log("血压手表其他数据类型", restype)
						}
					}
				})
			},
			buildLegacyBleNotifyDispatch(deviceSn, fallbackDeviceId) {
				let that = this
				return (res) => {
					// console.log("res.serviceId ", res.serviceId)
					const bytes = [...new Uint8Array(res.value)]
					if (bytes.length && bytes[0] === 0xBC) {
						const BPW6DeviceId = res.deviceId
						let BPW6deviceSn = uni.getStorageSync("BPW6deviceSn")
						that.BPW6paredata(u16proBLE._handleBcDataReceived(bytes, BPW6DeviceId),
							BPW6DeviceId,
							BPW6deviceSn)
						// return
					}
					if (res.serviceId === BPW6SERVICE) {
						let BPW6DeviceId = res.deviceId
						let BPW6deviceSn = uni.getStorageSync("BPW6deviceSn")
						that.BPW6paredata(u16proBLE._handleDataReceived(res, BPW6DeviceId),
							BPW6DeviceId,
							BPW6deviceSn)
					} else if ((res.serviceId || '').toUpperCase() === BPW6BC_SERVICE
						.toUpperCase()) {
						let BPW6DeviceId = res.deviceId
						let BPW6deviceSn = uni.getStorageSync("BPW6deviceSn")
						const bytes = [...new Uint8Array(res.value)]
						that.BPW6paredata(u16proBLE._handleBcDataReceived(bytes, BPW6DeviceId),
							BPW6DeviceId,
							BPW6deviceSn)
					} else if (res.serviceId === BPW1serviceId) {
						let BPW1DeviceId = res.deviceId
						let hexData = that.ab2hex(res.value)
						let dataList = that.ab2hex(res.value)
						that.dataBuffer.push(dataList)
						// console.log('BPW1手表获取蓝牙的包数据', res.serviceId, BPW1serviceId, BPW1DeviceId, dataList);
						const ProtocolIdentifier = dataList.slice(0, 2); // 协议标识位1个字节
						const ProtocolIdentifierppg = dataList.slice(0, 4); // 协议标识位1个字节
						const CMD = dataList.slice(8, 10); // 协议标识位1个字节
						if (ProtocolIdentifier === "e0" && CMD === "00") {
							const ProtocolLength = dataList.slice(2, 6); // 协议长度 2个字节
							that.tempBuffer = parseInt(ProtocolLength, 16) + 4;
							if (dataList.length <= 40) {
								that.Equipmentquery = that.calculateQuotient(that.tempBuffer,
									20);
							} else {
								that.Equipmentquery = that.calculateQuotient(that.tempBuffer,
									80);
							}
						} else if (ProtocolIdentifier === "e0" && CMD === "04") {
							switch (dataList.slice(12, 14)) {
								case "01":
									// 历史同步进行中勿清 blewatch_id，否则后续血压包会误走实时弹窗
									if (!that.isBpw1HistorySyncing()) {
										that.blewatch_id = "0"
										that.blewatch_id2 = "0"
									}
									that.ProtocolSubcommand = dataList.slice(12,
										14); // 协议子命令1个字节
									const ProtocolLength = dataList.slice(2, 6); // 协议长度 2个字节
									that.tempBuffer = parseInt(ProtocolLength, 16) + 4;
									if (dataList.length <= 40) {
										that.synchronizationpack = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.synchronizationpack = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break
								case "00":
									that.handleSportProtocol00(dataList, BPW1DeviceId,
										BPW1serviceId, BPW1write)
									break
								case "10":
									that.handleSleepProtocol10(dataList, BPW1DeviceId,
										BPW1serviceId, BPW1write)
									break
								default:
									console.log("default睡眠数据", dataList)
									that.resetDataState()
									break
							}
						} else if (ProtocolIdentifier === "0e") {
							that.handleProtocol0e(dataList, CMD, ProtocolIdentifierppg)
						} else if (ProtocolIdentifier === "e0" && CMD === "11") {
							that.sendack(hexData, BPW1DeviceId, BPW1serviceId, BPW1write);
							that.resetDataState();
						} else if (ProtocolIdentifier === "e0" && CMD === "01") {
							switch (hexData.slice(12, 14)) {
								case "00":
								case "02":
									that.sendack2(hexData, BPW1DeviceId, BPW1serviceId,
										BPW1write);
									that.resetDataState();
									break
								case "03":
									setTimeout(() => {
										that.endBpw1HistorySync('device_sync_done')
										that.blewatch_id = "0"
										that.blewatch_id2 = "1"
										that.sendack2(hexData, BPW1DeviceId,
											BPW1serviceId, BPW1write);
										that.resetDataState();
									}, 500)
									break
							}
						} else if (ProtocolIdentifier === "e0" && CMD === "02") {
							that.sendack(hexData, BPW1DeviceId, BPW1serviceId, BPW1write);
							that.resetDataState()
						} else if (ProtocolIdentifier === "e0" && CMD === "03") {
							that.blewatch_id2 = "0"
							that.ProtocolSubcommand = dataList.slice(12, 14); // 协议子命令1个字节
							const ProtocolLength = dataList.slice(2, 6); // 协议长度 2个字节
							that.tempBuffer = parseInt(ProtocolLength, 16) + 4;
							// 根据协议子命令处理不同逻辑
							switch (that.ProtocolSubcommand) {
								case "19": //血压
								case "00": //心率
									if (dataList.length <= 40) {
										that.xinlvpack = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.xinlvpack = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break;
								case "01": // 血压
									if (dataList.length <= 40) {
										that.xueyapack = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.xueyapack = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break;
								case "02": //  血氧
									if (dataList.length <= 40) {
										that.xueyangpack = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.xueyangpack = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break;
								case "1d": //ACC和PPG数据处理
									clearInterval(that.watchtimer);
									that.watchtimer = null
									const ACCPPG = hexData.slice(hexData.length - 12, hexData
										.length)
									const heartTime = ACCPPG.slice(0, 4); // 时间部分（4个字节）
									const {
										year,
										month,
										day,
										datealltime
									} = that.parseBinaryTime(heartTime);
									that.PPGdataarray = ACCPPG.slice(4, 6)
									const ACCdataarrayall = ACCPPG.slice(6, 8)
									const PPGdataarrayall = ACCPPG.slice(8, 10)
									const Status = ACCPPG.slice(10, ACCPPG.length)
									const parsePPGConfigdata = that.parsePPGConfigDescOrder(
										that.PPGdataarray)
									// const dataall = {
									// 	hexData: hexData,
									// 	ACCPPG: ACCPPG,
									// 	date: datealltime,
									// 	PPGdataarray: 'PPG数据项目定义' + that.PPGdataarray,
									// 	ACCdataarrayall: 'ACC数据总组数' + ACCdataarrayall,
									// 	PPGdataarrayall: 'PPG数据总组数' + PPGdataarrayall,
									// 	Status: '传输状态' + Status,
									// 	parsePPGConfigdata: '解析PPG数据配置字节:' + JSON.stringify(
									// 		parsePPGConfigdata)
									// }
									// console.log("蓝牙acc/ppg收到的命令：", JSON.stringify(dataall))
									// Status01 前再认一次会话，防止标记被误清后不 ACK
									if (!that.isBpw1ActivePpgSession()) {
										if (that.bpw1ImmediateCmdStarted || that
											.bpw1ImmediatePpgLaunchLock ||
											(that._bpw1ImmediateCmdAt && Date.now() - that
												._bpw1ImmediateCmdAt <
												120000)) {
											that.immediateEmotionMeasure = true
											that.sleep_alertid = 1
										} else if ((that._bpw1AfterBpCmdAt && Date.now() - that
												._bpw1AfterBpCmdAt <
												120000) || !!that._bpw1AfterBpPpgTimer) {
											that.yalixueyatype = true
											that.sleep_alertid = 1
										} else if (uni.getStorageSync('sendwatch') === 1) {
											console.log('【BPW1】Status包前按定时sendwatch恢复会话')
										}
									}
									const isActivePpgSession = that.isBpw1ActivePpgSession()
									// 仅 Status01 启动传输超时；Status02/其它状态勿重置 80s 计时，避免误杀传数
									if (Status === '01' && isActivePpgSession) {
										if (that.watchtimer2) {
											clearInterval(that.watchtimer2);
											that.watchtimer2 = null;
										}
										that._bpw1PpgTransferGen = (that._bpw1PpgTransferGen ||
											0) + 1
										const transferGen = that._bpw1PpgTransferGen
										// 无数据约 80s 恢复；真在传数时由收包续期（+120s）/下方仍在收则再续 60s
										that.bpw1PpgTransferDeadline = Date.now() + 80 * 1000
										that.watchtimer2 = setInterval(() => {
											const deadline = that
												.bpw1PpgTransferDeadline || 0
											if (Date.now() < deadline) {
												return
											}
											// 仍在收 PPG：再续 60s，勿在 Status02 前清会话/不上报
											const lastPkt = that.bpw1PpgLastPacketAt ||
												0
											const hasBuf = Array.isArray(that
													.bufferPPG) && that.bufferPPG
												.length > 0
											if (hasBuf && lastPkt > 0 && Date.now() -
												lastPkt < 25000) {
												that.bpw1PpgTransferDeadline = Date
													.now() + 60 * 1000
												console.log('【BPW1】PPG仍在收数，延长传输等待',
													that.bufferPPG.length)
												return
											}
											clearInterval(that.watchtimer2);
											that.watchtimer2 = null;
											if (transferGen !== that
												._bpw1PpgTransferGen) {
												console.log('【BPW1】忽略过期PPG传输超时')
												return
											}
											uni.hideLoading();
											that.bpw1PpgTransferActive = false
											console.warn(
												'【BPW1】PPG传输超时(未收到Status02)', {
													samples: hasBuf ? that
														.bufferPPG.length : 0,
													lastPktAgoMs: lastPkt ? (Date
														.now() - lastPkt) : -1
												})
											if (uni.getStorageSync("sendwatch") ===
												1) {
												that.notifyQxScheduledMeasureEnd(
													'PPG传输超时未收到02')
												uni.removeStorageSync("sendwatch")
											} else if (that.isBpw1ActivePpgSession() ||
												that
												.yalixueyatype ||
												that.immediateEmotionMeasure) {
												that.notifyBpw1PpgFailOrInterrupt(
													'BPW1 PPG传输超时未收到02', {
														silent: true
													})
											} else {
												console.log('【BPW1】PPG传输超时但会话已结束，仅清状态')
												that.resetDataState();
											}
										}, 1000)
									} else if (that.watchtimer2 && (Status === '02' || !
											isActivePpgSession)) {
										// Status02 由下方 case 清定时器；非会话包不另起超时
									}
									that.blewatch_id2 = "1"
									switch (Status) {
										case "01": //开始采集ACC/PPG数据
											// 仅首次开始清空；传数中重复01勿清 buffer，否则 Status02 时空包无法上报
											if (!that.bpw1PpgTransferActive) {
												that.bufferPPG = []
											} else {
												console.log('【BPW1】传数中忽略重复Status01清缓存', that
													.bufferPPG
													.length)
											}
											clearInterval(that.watchtimer);
											that.watchtimer = null
											if (isActivePpgSession) {
												that.bpw1PpgTransferActive = true
												that.bpw1PpgLastPacketAt = Date.now()
												that.sleep_alertdisabled = true
												uni.setStorageSync("sleep_alertdisabled", true)
												console.log('【BPW1】收到Status01开始传数', {
													yalixueyatype: that.yalixueyatype,
													immediate: that
														.immediateEmotionMeasure,
													sendwatch: uni.getStorageSync(
														'sendwatch')
												})
												if (uni.getStorageSync('sendwatch') === 1) {
													try {
														markQxPpgXferBusy()
													} catch (eMark) {}
												}
												// 含血压后压力PPG(yalixueyatype)：必须 ACK，否则手表不传 PPG 数据
												setTimeout(() => {
													that.sendack(hexData, BPW1DeviceId,
														BPW1serviceId,
														BPW1write);
												}, 3000)
											} else {
												console.log(
													'【BPW1】非PPG会话忽略ACC/PPG开始包(不ACK/不超时)')
											}
											// 采集已开始：清 sleep_alertid，避免误挡后续「血压后 PPG」；
											// 传数会话靠 bpw1PpgTransferActive / yalixueyatype / immediateEmotionMeasure
											that.sleep_alertid = 0
											that.resetDataState();
											break
										case "02": //结束采集ACC/PPG数据
											console.log('【BPW1】收到Status02传输结束', {
												samples: Array.isArray(that
														.bufferPPG) ? that.bufferPPG
													.length : 0,
												sendwatch: uni.getStorageSync(
													'sendwatch')
											})
											that.QX_FAIL = false
											uni.hideLoading();
											clearInterval(that.watchtimer);
											that.watchtimer = null
											clearInterval(that.watchtimer2);
											that.watchtimer2 = null
											that._bpw1PpgTransferGen = (that
												._bpw1PpgTransferGen || 0) + 1
											that.bpw1PpgTransferActive = false
											that.bpw1PpgLastPacketAt = 0
											that.bpw1PpgTransferDeadline = 0
											const ppgSamples = Array.isArray(that.bufferPPG) ?
												that.bufferPPG.slice() : []
											const binary = that.packInt16(ppgSamples)
											that.bufferPPG = []
											const emptyPpg = ppgSamples.length === 0
											if (uni.getStorageSync("sendwatch") === 1) {
												that.notifyQxScheduledMeasureEnd('采集结束02')
											} else {
												try {
													onQxBleWatchCollectionEnded('采集结束02')
												} catch (e) {}
											}
											uni.removeStorageSync("sendwatch")
											setTimeout(() => {
												that.sendack(hexData, BPW1DeviceId,
													BPW1serviceId,
													BPW1write);
											}, 3000)
											that.resetDataState();
											// 空包/失败结束：立刻恢复按钮，勿上传空波形导致云端一直分析、按钮卡灰
											if (emptyPpg) {
												console.warn('【BPW1】Status02但PPG缓存为空，跳过上报')
												that.restoreEmotionPageButtons('BPW1 PPG空数据结束')
												uni.showToast({
													title: that.$t('测试质量不够好'),
													icon: 'none',
													duration: 2500
												})
												break
											}
											// 采集结束先清会话并恢复按钮（上传/分析失败也不得一直灰）
											that.restoreEmotionPageButtons('BPW1采集结束02')
											that.ppgdata(binary, deviceSn, fallbackDeviceId)
											break
										default:
											// 非 01/02：测量失败或中断，恢复按钮（不影响非 PPG 会话）
											if (isActivePpgSession) {
												clearInterval(that.watchtimer);
												that.watchtimer = null
												clearInterval(that.watchtimer2);
												that.watchtimer2 = null
												that._bpw1PpgTransferGen = (that
													._bpw1PpgTransferGen || 0) + 1
												uni.hideLoading();
												setTimeout(() => {
													that.sendack(hexData, BPW1DeviceId,
														BPW1serviceId,
														BPW1write);
												}, 3000)
												that.resetDataState();
												that.notifyBpw1PpgFailOrInterrupt('PPG状态异常' +
													Status, {
														silent: true
													})
											} else {
												console.log('【BPW1】非PPG会话忽略ACC/PPG状态包', Status)
											}
											break
									}
									break
								case "1e": //ACC
									if (dataList.length <= 40) {
										that.quotientACC = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.quotientACC = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break
								case "1f": //PPG
									if (dataList.length <= 40) {
										that.quotientPPG = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.quotientPPG = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break
								default:
									console.warn("未知的协议子命令:", that.ProtocolSubcommand);
							}
						} else if (ProtocolIdentifier === "e0" && CMD === "20" && dataList
							.length === 20) {
							that.handleProtocolE0Cmd20(dataList, BPW1DeviceId, BPW1serviceId,
								BPW1write)
						} else if (ProtocolIdentifier === "e0" && CMD === "20" && dataList
							.length > 20) {
							if (dataList.length === 40) {
								that.ProtocolSubcommand = dataList.slice(12, 14); // 协议子命令1个字节
								const ProtocolLength = dataList.slice(2, 6); // 协议长度 2个字节
								that.tempBuffer = parseInt(ProtocolLength, 16) + 4;
								if (dataList.length <= 40) {
									that.quotientota = that.calculateQuotient(that.tempBuffer,
										20);
								} else {
									that.quotientota = that.calculateQuotient(that.tempBuffer,
										80);
								}
							} else {
								console.log(dataList.slice(18, dataList.length).toUpperCase())
								uni.setStorageSync("otadatares", dataList.slice(18, dataList
										.length)
									.toUpperCase())
								uni.setStorageSync("otaBP", dataList.slice(18, dataList.length)
									.toUpperCase())
								// 立即测量待启动：必须 ACK
								if (that.bpw1PendingEmotionMeasure) {
									that.sendack(dataList, BPW1DeviceId, BPW1serviceId,
										BPW1write);
									that.resetDataState()
									that.notifyBpw1OtaInfoReady('ota_inline')
									return
								}
								// 已进入测量会话/传数：勿 ACK，避免打断 Status01/02
								if (that.bpw1PpgTransferActive || that
									.isBpw1ActivePpgSession()) {
									console.log('【BPW1】测量会话中跳过设备信息ACK，仅更新otadatares')
									that.resetDataState()
									return
								}
								that.sendack(dataList, BPW1DeviceId, BPW1serviceId, BPW1write);
								that.resetDataState()
								that.loadFiles(dataList.slice(18, dataList.length)
									.toUpperCase(),
									BPW1DeviceId, BPW1serviceId)
							}
						}
						//手表升级数据
						if (that.quotientota !== 0 && that.quotientota === that.dataBuffer
							.length) {
							that.handleOtaBufferData(BPW1DeviceId, BPW1serviceId, BPW1write)
						}
						//睡眠数据
						if (that.sleeppack !== 0 && that.sleeppack === that.dataBuffer
							.length) {
							that.handleSleepBufferData(BPW1DeviceId, BPW1serviceId, BPW1write)
						}
						//心率
						if (that.xinlvpack > 0 && that.dataBuffer.length === that.xinlvpack) {
							that.handleXinlvBufferData(BPW1DeviceId, BPW1serviceId, BPW1write)
						}
						//血压
						if (that.xueyapack > 0 && that.xueyapack === that.dataBuffer.length) {
							that.handleXueyaBufferData(BPW1DeviceId, BPW1serviceId, BPW1write)
						}
						//血氧
						if (that.xueyangpack > 0 && that.dataBuffer.length === that
							.xueyangpack) {
							that.handleXueyangBufferData(BPW1DeviceId, BPW1serviceId,
								BPW1write)
						}
						//同步数据
						if (that.synchronizationpack > 0 && that.dataBuffer.length === that
							.synchronizationpack) {
							setTimeout(() => {
								that.sendack2(that.formatData(that.dataBuffer),
									BPW1DeviceId,
									BPW1serviceId, BPW1write);
								that.resetDataState()
							}, 500)
						}
						//设备查询
						if (that.Equipmentquery > 0 && that.dataBuffer.length === that
							.Equipmentquery) {
							that.handleEquipmentQueryBufferData(BPW1DeviceId, BPW1serviceId,
								BPW1write)
						}
						//ACC数据
						if (that.quotientACC > 0 && that.dataBuffer.length === that
							.quotientACC) {
							// console.log("acc数据", that.dataBuffer)
							that.handleAccBufferData(BPW1DeviceId, BPW1serviceId, BPW1write)
						}
						//PPG数据
						if (that.quotientPPG > 0 && that.dataBuffer.length === that
							.quotientPPG) {
							that.handlePpgBufferData(BPW1DeviceId, BPW1serviceId, BPW1write)
							// 勿整包打印 dataBuffer，控制台序列化会严重拖慢后台收数
							// console.log("PPG数据", that.bufferPPG.length)
						}
						// } else if (res.serviceId === SERVICE_ID) {
						// 	that.buffer += that.ab2hex(res.value)
						// 	that.tryParse()
					} else {
						let BPDeviceId = res.deviceId
						let BPhexData = that.ab2hex(res.value)
						let asciiString = that.hexToAscii(BPhexData)
						console.log('血压计获取蓝牙的包数据', res.serviceId, BPDeviceId);
						if (asciiString === "error") {
							uni.closeBLEConnection({
								deviceId: fallbackDeviceId,
								success() {},
								fail() {}
							})
							that.disconnectAll(fallbackDeviceId)
							that.deviceList = that.deviceList.filter(item => item.mac !==
								fallbackDeviceId);
							that.getUserInfo()
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log('无网络连接');
										that.aaaa(uni.getStorageSync("lixianlist"))
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
						} else if (BPhexData.length === 388 &&
							!BPhexData.startsWith("0e") &&
							!BPhexData.startsWith("e0") &&
							that.xueyehuilian &&
							that.xeuyejisn !== "0" &&
							that.xeuyejimac !== "0") {
							let parsedData = that.parseQueryString(asciiString);
							const measureTs = that.resolveUploadTime(
								parsedData && (parsedData.time || parsedData.tim ||
									parsedData.date));
							that.runHomeVitalRefreshIfAllowed(measureTs, 'parseBloodDatatime',
								() => {
									that.lowPressure = that.Blood === "mmHg" ? parsedData
										.dia.trim() : (Number(
											parsedData.dia.trim()) * 0.133).toFixed(1);
									that.highPressure = that.Blood === "mmHg" ? parsedData
										.sys.trim() : (Number(
											parsedData.sys.trim()) * 0.133).toFixed(1);
									that.pulse = parsedData.pul.trim();
									uni.setStorageSync("lowPressure", parsedData.dia
										.trim())
									uni.setStorageSync("highPressure", parsedData.sys
										.trim())
									uni.setStorageSync("pulse", parsedData.pul.trim())
									uni.setStorageSync("parseBloodDatatime", measureTs)
									if (that.QX_HIDE) {
										that.bgaaa(parsedData.dia.trim(), parsedData.sys
											.trim())
									}
									that.updateBloodPressureStatus(parsedData.dia.trim(),
										parsedData.sys.trim());
								});
							that.jakoblife_fat_scale(that.xeuyejimac, parsedData, that
								.xeuyejisn)
							that.resetDataState()
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log('无网络连接');
										that.aaaa(uni.getStorageSync("lixianlist"))
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
						}
					}
				}
			},
			onBLECharacteristicValueChange3(deviceId, serviceId, deviceSn) {
				// BPW1 接管全局监听：清掉 BPW6/u16pro 转发残留，避免短时内包被 BPW6 链路吞掉
				this.bpw6BleNotifyListenerRegistered = false
				try {
					if (u16proBLE && typeof u16proBLE.clearForwardNotifyRouting === 'function') {
						u16proBLE.clearForwardNotifyRouting()
					} else if (u16proBLE && typeof u16proBLE.setForwardNotifyHandler ===
						'function') {
						u16proBLE.setForwardNotifyHandler(null)
					}
				} catch (e) {}
				this._legacyBleNotifyDispatch = this.buildLegacyBleNotifyDispatch(deviceSn,
					deviceId)
				uni.onBLECharacteristicValueChange(this._legacyBleNotifyDispatch)
			},

			getUserInfo() {
				this.$get(this.$url_APP_IP + this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(UserInfo => {
					// console.log("获取用户信息", UserInfo)
					if (UserInfo.code == 200) {
						uni.setStorageSync("userid", UserInfo.data.userId);
						if (this.currentIndex === 2) {
							this.chuhsikg = uni.getStorageSync("danwei2") === 1 ?
								this.$t('英镑') : this.$t('千克');
							this.newweightKG = uni.getStorageSync("danwei2") === 1 ?
								this.$t('英镑') : this.$t('千克1');
							this.Initial_weight = (this.chuhsikg === "kg" || this
									.chuhsikg === "千克") ?
								UserInfo.data.weight : WeightConverter.kgToLb(UserInfo.data
									.weight);
						}
						this.handleUserInformation(UserInfo.data);
					} else if (UserInfo.code == 401) {
						uni.redirectTo({
							url: "/pages/login/login_land"
						});
						return
					}
				}).catch(err => {
					uni.showToast({
						title: this.$t("网络连接异常"),
						icon: 'none'
					})
				})
			},
			handleUserInformation(userData) {
				if (userData.phonenumber && !userData.email) {
					this.handleUserInfoForChina(userData);
				} else if (!userData.phonenumber && userData.email) {
					this.handleUserInfoForOverseas(userData);
				} else {
					if (this.loact === "境内") {
						this.handleUserInfoForChina(userData);
					} else if (this.loact === "境外") {
						this.handleUserInfoForOverseas(userData);
					}
				}
			},
			handleUserInfoForChina(userData) {
				if (!userData.phonenumber && !userData.email) {
					uni.navigateTo({
						url: '../../login/Force_binding_phone'
					});
				} else {
					this.processUserInfo(userData);
				}
			},
			handleUserInfoForOverseas(userData) {
				if (!userData.email && !userData.phonenumber) {
					uni.navigateTo({
						url: '../../login/bind_youxiang'
					});
				} else {
					this.processUserInfo(userData);
				}
			},
			processUserInfo(userData) {
				this.getInfo(userData);
				uni.setStorageSync("userid", userData.userId);
				this.pending(userData.userId);
				this.queryDevices();
				this.questionnairelist()
				this.timsdpad = setInterval(res => {
					this.pending(userData.userId);
					if (this.currentIndex === 0) {
						this.list_recipe()
					}
				}, 8000)
			},
			pending(datainfo) {
				const data = {
					receiverId: datainfo
				}
				this.$post(this.$url_APP_IP + this.$url_pending, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
				}).then(pending => {
					switch (pending.code) {
						case 200:
							if (pending.data.length === 0) {
								this.msg = true;
							} else {
								this.msg = this.getpendinglenth >= pending.data.length;
							}
							break
					}
				})
			},
			queryDevices() {
				this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						if (!this.queryDevicesDone) {
							this.queryDevicesDone = true; // 立刻上锁，避免重复拉布局/概览造成闪烁
							this.applyCachedCardList()
							switch (this.currentIndex) {
								case 0:
									this.cardlist1("bloodData").finally(() => {
										this.list_recipe();
									})
									break;
								case 2:
									this.cardlist2("WeightData")
									this.list_recipe();
									break;
								default:
									this.list_recipe();
									break;
							}
						}
						if (res.rows.length > 0) {
							let deviceslist1 = res.rows.filter(item => item.mac !== null &&
								item.deviceTypeId !== "11").map(item => item.mac);
							this.deviceList = deviceslist1;
							uni.setStorageSync("deviceList", deviceslist1)
							const hasBpw1 = res.rows.some((item) => String(item
									.deviceModelId) ===
								"30000");
							const hasBpw6 = res.rows.some((item) => String(item
									.deviceModelId) ===
								"30001");
							try {
								uni.setStorageSync('qx_emotion_bind_snapshot', {
									hasBpw1: !!hasBpw1,
									hasBpw6: !!hasBpw6,
									at: Date.now()
								})
							} catch (eSnap) {}
							// 服务端未绑 BPW1：清本地残留 deviceIdwatch，避免情绪定时误走 BPW1
							if (!hasBpw1) {
								try {
									if (uni.getStorageSync('deviceIdwatch')) {
										console.log('[BLE] 清残留BPW1 deviceIdwatch（服务端未绑定）',
											uni.getStorageSync('deviceIdwatch'))
										uni.removeStorageSync('deviceIdwatch')
									}
									this.deviceIdwatch = ''
									if (hasBpw6) {
										uni.setStorageSync('qx_emotion_bpw6', true)
									}
								} catch (eClr) {}
							}
							if (!hasBpw1 && !hasBpw6) {
								// 既无 BPW1 也无 BPW6：立即测量必须灰（测量中除外）
								if (!this.isEmotionMeasureBusySession()) {
									this.sleep_alertdisabled = true
									uni.setStorageSync("sleep_alertdisabled", true)
								}
							} else {
								// 有 BPW1 或 BPW6：非采集会话中可点
								this.syncEmotionMeasureBusyFromStorage()
								if (!this.isEmotionMeasureBusySession()) {
									this.sleep_alertdisabled = false
									uni.setStorageSync("sleep_alertdisabled", false)
								}
							}
						} else {
							// 设备列表为空：未绑定任何设备，立即测量置灰
							if (!this.isEmotionMeasureBusySession()) {
								this.sleep_alertdisabled = true
								uni.setStorageSync("sleep_alertdisabled", true)
							}
						}
						if (uni.getStorageSync("appQX") === "1") {
							this.aaaa(res.rows);
							// console.log("设备列表", res.rows);
							this.deviceSnuserID = [];
							//该用户绑定的所有设备deviceSn查询历史数据
							for (let i = 0; res.rows.length > i; i++) {
								this.deviceSnuserID.push(res.rows[i].deviceSn)
							}
							this.queryBloodPressureData(this.deviceSnuserID)
							uni.setStorageSync("lixianlist", res.rows)
						}
					} else {
						return
					}
				})
			},
			aaaa(rows) {
				let that = this;
				// 清空数组
				that.devicdsdmac = [];
				that.devicdsdmac1 = [];
				that.devicetypelist = [];
				rows.forEach((row) => {
					if (that.isBleReconnectBlocked(row.mac)) {
						return;
					}
					if (row.deviceTypeId === "10") {
						that.handleDeviceType10And13(row);
						that.devicdsdmac.push(row.mac);
						if (row.deviceModelId === "10006") {
							uni.setStorageSync("deviceModelName", row.deviceModelName)
							uni.setStorageSync("ECGdeviceSn", row.deviceSn)
							that.deviceIdECG = row.mac
						}
						if (row.deviceModelId === "10001") {
							that.devicetype = 10001
						}
					} else if (row.deviceTypeId === "13" && row.deviceModelId ===
						"30000") {
						that.devicetype = 30000
						that.handleDeviceType10And13(row);
						that.devicdsdmac1.push(row.mac);
					} else if (row.deviceTypeId === "13" && row.deviceModelId ===
						"30001") {
						that.devicetype = 30001
						if (that.isDeviceBindingPageActive()) {
							return;
						}
						that.bluetoothManager = new BluetoothManager();
						that.openBluetoothAdapter(row)
					} else if (row.deviceTypeId === "11") {
						that.handleDeviceType11(row);
					}
					that.devicetypelist.push(that.devicetype)
				});
				const newList = that.devicetypelist.filter(item => item !== that.devicetype);
				newList.push(that.devicetype);
				that.devicetypelist = newList;
				// 在循环外统一存储，避免多次写入
				if (that.devicdsdmac.length > 0) {
					uni.setStorageSync("devicdsdmac", that.devicdsdmac);
				}
				if (that.devicdsdmac1.length > 0) {
					uni.setStorageSync("devicdsdmac1", that.devicdsdmac1);
				}
				if (that.currentIndex === 4) {
					that.list_recipe();
				}
			},
			handleDeviceType10And13(row) {
				if (this.deviceList.length !== 0 || uni.getStorageSync("deviceList").length !==
					0) {
					this.initBluetooth(row);
				}
				uni.setStorageSync("deviceSn", row.deviceSn);
			},
			handleDeviceType11(row) {
				let that = this
				const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
				const options = systemInfo.platform === "android" ? "" : "options";
				TestUniPlugin.startScan(options, (callback) => {
					const data = systemInfo.platform === "android" ? callback.data : JSON
						.parse(callback.data);
					if (row.mac === data.mac) {
						if (systemInfo.platform === "android" && data.weightStatus === 1 &&
							data.weight !== "0.00" && data.testStatus === 255) {
							if ((data.weightUnit === 6 || data.weightUnit === 4) && (that
									.newweightKG === "lb" || that
									.newweightKG === "英镑")) {
								that.Latest_weight = data.weight
								that.lastWeightbishi = "0"
								uni.setStorageSync("weightlb", data.weight)
								uni.setStorageSync("weightkg", WeightConverter.lbToKg(data
									.weight))
							} else if (data.weightUnit === 0 && (that.newweightKG ===
									"KG" || that.newweightKG === "千克")) {
								that.Latest_weight = data.weight
								that.lastWeightbishi = ""
								uni.setStorageSync("weightlb", WeightConverter.kgToLb(data
									.weight))
								uni.setStorageSync("weightkg", data.weight)
							} else {
								if (that.newweightKG === "KG" || that.newweightKG ===
									"千克") {
									if (data.weightUnit === 0) {
										that.Latest_weight = data.weight
										that.lastWeightbishi = ""
										uni.setStorageSync("weightlb", WeightConverter
											.kgToLb(data.weight))
										uni.setStorageSync("weightkg", data.weight)
									} else {
										that.Latest_weight = WeightConverter.lbToKg(data
											.weight)
										that.lastWeightbishi = ""
										uni.setStorageSync("weightlb", data.weight)
										uni.setStorageSync("weightkg", WeightConverter
											.lbToKg(data.weight))
									}
								} else {
									if (data.weightUnit === 0) {
										that.Latest_weight = WeightConverter.kgToLb(data
											.weight)
										that.lastWeightbishi = ""
										uni.setStorageSync("weightlb", WeightConverter
											.kgToLb(data.weight))
										uni.setStorageSync("weightkg", data.weight)
									} else {
										that.Latest_weight = data.weight
										that.lastWeightbishi = "0"
										uni.setStorageSync("weightlb", data.weight)
										uni.setStorageSync("weightkg", WeightConverter
											.lbToKg(data.weight))
									}
								}

							}
							that.jakoblife_fat_scale1(row.deviceSn, row.mac, data);
						} else if (systemInfo.platform === "ios" && data.testStatus ===
							255) {
							that.arrrylist.push(data);
							if (data.weight !== "0.00") {
								that.jakoblife_fat_scale1(row.deviceSn, row.mac, data);
							}
						}
						return
					}
				});
				if (that.currentIndex === 2) {
					uni.setStorageSync("deviceSn", row.deviceSn);
					that.get_device_data(row.deviceSn);
					return
				}
			},
			// 查询用户缓存数据列表 - 血压卡片（只同步布局，不覆盖当前体征数值/日期，避免闪烁）
			cardlist1(bloodData) {
				let data = {
					dataType: bloodData,
				}
				return this.$get(this.$url_APP_IP + "/prod-api/device/data/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((listres) => {
					if (listres.code === 200) {
						if (listres.total === 0) {
							uni.setStorageSync("kapianlist", this.list)
						} else {
							let dataArray = this.robustParseData(listres.rows[0].data);
							this.list = this.applyBloodCardLayout(dataArray)
							uni.setStorageSync("kapianlist", this.list)
						}
					} else {
						uni.setStorageSync("kapianlist", this.list)
					}
					return listres
				}).catch((err) => {
					console.error('cardlist1失败', err)
					return null
				})
			},
			isHeartRateCardTitle(title) {
				const t = String(title || '');
				return t === this.$t('心率') || t === '心率' || t === 'Heart';
			},
			isBloodOxygenCardTitle(title) {
				const t = String(title || '');
				return t === this.$t('血氧') || t === '血氧' || t === 'SpO2' || t === 'SpO₂';
			},
			/**
			 * 卡片布局以服务端为准，但心率/血氧的数值和日期保留当前页已展示的
			 *（或本地 storage），避免 cardlist1 用旧布局把 list_recipe 的新值打回去造成闪烁。
			 */
			applyBloodCardLayout(layoutList) {
				if (!layoutList || !layoutList.length) {
					return this.list;
				}
				const prevList = Array.isArray(this.list) ? this.list : [];
				const findPrev = (cardTitle) => {
					const direct = this.findValue(prevList, 'title', cardTitle);
					if (direct) {
						return direct;
					}
					if (this.isHeartRateCardTitle(cardTitle)) {
						for (let i = 0; i < prevList.length; i++) {
							if (this.isHeartRateCardTitle(prevList[i].title)) {
								return prevList[i];
							}
						}
					}
					if (this.isBloodOxygenCardTitle(cardTitle)) {
						for (let i = 0; i < prevList.length; i++) {
							if (this.isBloodOxygenCardTitle(prevList[i].title)) {
								return prevList[i];
							}
						}
					}
					return null;
				};
				const hasDisplayVal = (val) => val != null && val !== '' && val !== '-' && val !==
					'-/-';
				return layoutList.map((card) => {
					const next = Object.assign({}, card);
					const prev = findPrev(card.title);
					if (this.isHeartRateCardTitle(card.title)) {
						if (prev && hasDisplayVal(prev.Step_number)) {
							next.Step_number = prev.Step_number;
							next.Step_count = prev.Step_count || '-/-';
						} else {
							const pulse = uni.getStorageSync('pulse');
							const pulsetimes = uni.getStorageSync('pulsetimes');
							if (hasDisplayVal(pulse)) {
								next.Step_number = pulse;
								next.Step_count = pulsetimes || '-/-';
							}
						}
					} else if (this.isBloodOxygenCardTitle(card.title)) {
						if (prev && hasDisplayVal(prev.Step_number)) {
							next.Step_number = prev.Step_number;
							next.Step_count = prev.Step_count || '-/-';
							if (prev.BMI_ys != null) {
								next.BMI_ys = prev.BMI_ys;
							}
							if (prev.BMI_TF != null) {
								next.BMI_TF = prev.BMI_TF;
							}
						} else {
							const xueyang = uni.getStorageSync('xueyang');
							const xueyangtimes = uni.getStorageSync('xueyangtimes');
							if (hasDisplayVal(xueyang)) {
								next.Step_number = xueyang;
								next.Step_count = xueyangtimes || '-/-';
							}
						}
					}
					return next;
				});
			},
			// 查询用户缓存数据列表 - 体重卡片
			cardlist2(WeightData) {
				let data = {
					dataType: WeightData,
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/data/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((listres) => {
					if (listres.code === 200) {
						if (listres.total === 0) {
							uni.setStorageSync("kapianlist2", this.list2)
						} else {
							let dataArray = this.robustParseData(listres.rows[0].data);
							this.list2 = dataArray
							uni.setStorageSync("kapianlist2", this.list2)
						}
					} else {
						uni.setStorageSync("kapianlist2", this.list2)
					}
				})
			},
			robustParseData(dataStr) {
				if (dataStr === "bloodData") {
					uni.setStorageSync("kapianlist", "")
					return
				}
				if (dataStr === "WeightData") {
					uni.setStorageSync("kapianlist2", "")
					return
				}
				try {
					// 分割每个对象
					const objects = dataStr.split('},{');
					const result = [];
					for (let i = 0; i < objects.length; i++) {
						// 修复首尾对象的花括号
						let objStr = objects[i];
						if (i === 0) objStr = objStr + '}';
						else if (i === objects.length - 1) objStr = '{' + objStr;
						else objStr = '{' + objStr + '}';
						// 移除可能的多余花括号
						objStr = objStr.replace(/^{{/, '{').replace(/}}$/, '}');
						// 修复键值对
						const fixedObjStr = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (
							match, key, value) => {
							value = value.trim();
							// 处理布尔值
							if (value === 'true' || value === 'false') {
								return `"${key}":${value}`;
							}
							// 处理数字
							if (!isNaN(value) && value !== '' && !value.includes('/')) {
								return `"${key}":${value}`;
							}
							// 处理字符串
							return `"${key}":"${value}"`;
						});
						try {
							const obj = JSON.parse(fixedObjStr);
							result.push(obj);
						} catch (e) {
							console.warn('解析单个对象失败:', fixedObjStr, e);
						}
					}
					return result;
				} catch (error) {
					console.error('解析失败:', error);
					return [];
				}
			},
			applyCachedCardList() {
				const bloodCards = uni.getStorageSync('kapianlist')
				if (bloodCards && bloodCards.length) {
					this.list = bloodCards
				}
				const weightCards = uni.getStorageSync('kapianlist2')
				if (weightCards && weightCards.length) {
					this.list2 = weightCards
				}
			},
			//获取设备基础信息
			get_device_info(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_info, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code == 200) {
						switch (this.currentIndex) {
							case 0:
								if (res.data.deviceTypeId === "10" || res.data
									.deviceTypeId === "13") {
									uni.setStorageSync("deviceSn", deviceSn)
								}
								// 先加载卡片布局，再拉接口填数值/日期，避免布局回包冲掉接口日期
								this.cardlist1("bloodData").finally(() => {
									this.list_recipe()
								})
								return;
							case 2:
								if (res.data.deviceTypeId === "11") {
									uni.setStorageSync("deviceSn", deviceSn)
								}
								// this.cardlist2("WeightData")
								break;
						}
						this.list_recipe()
					} else {
						switch (this.currentIndex) {
							case 0:
								this.cardlist1("bloodData").finally(() => {
									this.list_recipe()
								})
								return;
							case 2:
								this.cardlist2("WeightData")
								break;
						}
					}
				})
			},
			//获取体脂秤身体指数
			get_device_data(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code === 200) {
						const kapianlist2 = uni.getStorageSync("kapianlist2") || [];
						let itelistasd2 = []
						const data = res.data;
						for (let i = 0; i < kapianlist2.length; i++) {
							const item = kapianlist2[i];
							if (item.title === "BMI") {
								this.updateBMI(data);
							} else if (item.title === "骨含量" || item.title ===
								"Bone Mass") {
								this.updateCard(data, item.title, "BM", this.$t("骨含量"));
							} else if (item.title === "肌肉量" || item.title ===
								"Muscle Mass") {
								this.updateCard(data, item.title, "ROM", this.$t("肌肉量"));
							} else if (item.title === "蛋白率" || item.title === "Protein%") {
								this.updateCard(data, item.title, "PP", this.$t("蛋白率"));
							} else if (item.title === "水分" || item.title === "Water%") {
								this.updateCard(data, item.title, "MOI", this.$t("水分"));
							} else if (item.title === "内脏脂肪指数" || item.title === "VFI") {
								this.updateCard(data, item.title, "UVI", this.$t(
									"内脏脂肪指数"));
							} else if (item.title === "脂肪率" || item.title === "Fat%") {
								this.updateCard(data, item.title, "BFR", this.$t("脂肪率"));
							} else if (item.title === "基础代谢率" || item.title === "BMR") {
								this.updateCard(data, item.title, "BMR", this.$t("基础代谢率"));
							} else if (item.title === "皮下脂肪率" || item.title ===
								"SubQ Fat%") {
								this.updateCard(data, item.title, "SFR", this.$t("皮下脂肪率"));
							} else if (item.title === "身体年龄" || item.title ===
								"Body Age") {
								this.updateCard(data, item.title, "PA", this.$t("身体年龄"));
							}
							itelistasd2.push(item)
						}
						this.cardeditData(this.list2, "WeightData")
					}
				})
			},
			cardeditData(list, cardeditData) {
				let editData = {
					dataType: cardeditData,
					data: this.formatDatacard(list) === "" ? cardeditData : this
						.formatDatacard(list)
				}
				// console.log("editData", editData)
				this.$post(this.$url_APP_IP + "/prod-api/device/data/editData", editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((reseditData) => {
					if (reseditData.code === 200) {
						if (cardeditData === "WeightData") {
							uni.setStorageSync("kapianlist2", list)
							this.cardlist2("WeightData")
						} else {
							uni.setStorageSync("kapianlist", list)
							this.cardlist1("bloodData")
						}
					}
				})
			},
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',');
			},
			//设备数据概览
			list_recipe() {
				const reqId = (this._listRecipeReqId = (this._listRecipeReqId || 0) + 1);
				let data = {
					userId: uni.getStorageSync("userid")
				}
				// console.log("list_recipe" + this.$url_APP_IP, data)
				this.$post(this.$url_APP_IP + this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {

					// 忽略过期回包，避免并发 list_recipe 旧数据后到把新值盖回去闪烁
					if (reqId !== this._listRecipeReqId) {
						return;
					}
					if (res.code == 200) {
						// console.log("list_recipe：", res)
						this.sleep_time = this.getUpdateTime(res.data, 'register', 'sleep')
						uni.setStorageSync("temperature", this.getRegisterVal(res.data,
							'register',
							'temperature')); //根据体温判断是否显示无感报告的提示，超过100则显示
						if (this.currentIndex === 0) {
							// 血压卡片数据处理
							this.processBloodPressureData(res.data)
						} else if (this.currentIndex === 1) {
							// 情绪数据处理
							this.ppgresultslist(this.types_index)
							this.ppgresultslist2(this.types_index)
							this.ppgresultslist3(this.types_index)
						} else if (this.currentIndex === 2) {
							// 体重数据处理
							this.processWeightData(res.data)
						} else if (this.currentIndex === 3) {
							// 睡眠数据处理
							this.processSleepData(res.data)
						} else if (this.currentIndex === 4) {
							// 运动数据处理
							this.processStepsData(res.data)
						}
					}
				})
			},
			findValue(arr, key, value) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] == value) {
						return arr[i]
					}
				}
				return null
			},

			isValidRegisterVal(val) {
				return val != null && val !== '' && val !== '-/-';
			},

			/**
			 * 接口同一指标可能有多条（如 slaveSn=2 血压计、slaveSn=3 手表），按 updateTime 取最新。
			 */
			getLatestRegisterFromList(list, register) {
				if (!list || !list.length) {
					return null;
				}
				let best = null;
				for (let i = 0; i < list.length; i++) {
					const row = list[i];
					if (!row || row.register !== register) {
						continue;
					}
					if (!this.isValidRegisterVal(row.registerVal) && !(row.updateTime > 0)) {
						continue;
					}
					if (!best) {
						best = row;
						continue;
					}
					const tNew = Number(row.updateTime) || 0;
					const tOld = Number(best.updateTime) || 0;
					if (tNew > tOld) {
						best = row;
					} else if (tNew === tOld && this.isValidRegisterVal(row.registerVal) &&
						!this.isValidRegisterVal(best.registerVal)) {
						best = row;
					}
				}
				return best;
			},

			/** 两路数据按 updateTime 取最新一条（含 value/time） */
			getLatestRegisterEntry(data1, data2, type) {
				const merged = [];
				if (data1 && data1.length) {
					merged.push(...data1);
				}
				if (data2 && data2.length) {
					merged.push(...data2);
				}
				const best = this.getLatestRegisterFromList(merged, type);
				if (!best) {
					return {
						value: '-/-',
						time: 0
					};
				}
				return {
					value: this.isValidRegisterVal(best.registerVal) ? best.registerVal : '-/-',
					time: Number(best.updateTime) || 0
				};
			},

			/**
			 * 血压高低压成对取时间更新的那一路，避免高低压来自不同设备时间。
			 */
			getLatestBloodPressurePair(data1, data2) {
				const pickSide = (sideData) => {
					const high = this.findValue(sideData, 'register', 'highPressure');
					const low = this.findValue(sideData, 'register', 'lowPressure');
					const time = Math.max(Number(high?.updateTime) || 0, Number(low
						?.updateTime) || 0);
					const hasVal = this.isValidRegisterVal(high?.registerVal) || this
						.isValidRegisterVal(low
							?.registerVal);
					return {
						high: high?.registerVal,
						low: low?.registerVal,
						time,
						hasVal
					};
				};
				const a = pickSide(data1 || []);
				const b = pickSide(data2 || []);
				if (a.hasVal && b.hasVal) {
					return a.time >= b.time ? a : b;
				}
				if (a.hasVal) {
					return a;
				}
				if (b.hasVal) {
					return b;
				}
				return a.time >= b.time ? a : b;
			},

			getRegisterVal(data, type, key) {
				const value = this.findValue(data, type, key);
				return value.registerVal !== null ? value.registerVal : "-/-";
			},

			getUpdateTime(data, type, key) {
				const value = this.findValue(data, type, key);
				return value ? this.formatDate(value.updateTime) : "-/-";
			},

			// 时间戳转卡片日期 MM/DD（与 formatTimestampKey / datatime 一致，统一东八区，避免凌晨跨日显示成前一天）
			formatDate(value) {
				if (value === '' || value == null || value === undefined) {
					return '-/-';
				}
				if (typeof value === 'string') {
					const trimmed = value.trim();
					const m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
					if (m) {
						return `${m[2]}/${m[3]}`;
					}
				}
				let tsMs = Number(value);
				if (Number.isNaN(tsMs) || tsMs <= 0) {
					const parsed = new Date(value).getTime();
					if (Number.isNaN(parsed) || parsed <= 0) {
						return '-/-';
					}
					tsMs = parsed;
				} else if (tsMs < 9999999999) {
					tsMs = tsMs * 1000;
				}
				const beijingDate = new Date(tsMs + 8 * 3600000);
				const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
				const day = String(beijingDate.getUTCDate()).padStart(2, '0');
				return `${month}/${day}`;
			},
			/** 首页体征时间统一为秒级时间戳 */
			normalizeHomeVitalTs(ts) {
				if (ts === '' || ts == null || ts === undefined) {
					return 0;
				}
				const num = Number(ts);
				if (Number.isNaN(num) || num <= 0) {
					return 0;
				}
				return num > 9999999999 ? Math.floor(num / 1000) : Math.floor(num);
			},
			/**
			 * 设备时间是否严格新于接口基线。
			 * BPW6 心率按槽位上报：同槽时间相等时返回 false，避免用设备值抢刷新，等接口回填。
			 */
			isDeviceNewerThanApiBaseline(deviceTs, storageKey) {
				const device = this.normalizeHomeVitalTs(deviceTs);
				if (!device) {
					return false;
				}
				const baseline = this.normalizeHomeVitalTs(uni.getStorageSync(storageKey));
				return !baseline || device > baseline;
			},
			/** BPW6 心率首页 UI：写入 pulse/卡片（仅 BPW6 路径调用） */
			applyBpw6HrHomeUi(hrVal, deviceTimestamp, heartRateDatatime) {
				const hrTs = this.normalizeUnixTimestamp(deviceTimestamp);
				const pulsetimes = hrTs != null ?
					this.formatDate(hrTs * 1000) :
					this.formatDate(Number(heartRateDatatime) * 1000);
				this.pulse = hrVal;
				this.pulsetime = pulsetimes;
				uni.setStorageSync('pulse', hrVal);
				uni.setStorageSync('pulsetimes', pulsetimes);
				uni.setStorageSync('heartRateDatatime', heartRateDatatime);
				this.updateLocalHeartRateCard(hrVal, pulsetimes);
				this.cardeditData(this.list, 'bloodData');
			},
			/**
			 * BPW6：先查服务器，手表更新或同槽不同值才刷卡并上报；
			 * 上报后拉接口时用 pending 挡住旧值回写，避免「先变旧再变新」。
			 * options.skipUpload：progressive / 实时待重读 — 只刷卡不上报，避免同一次测量报两遍。
			 */
			async syncBpw6HeartRateHomeUi(deviceId, deviceSn, latestHr, heartRateDatatime,
				options = {}) {
				const that = this;
				const skipUpload = !!(options && options.skipUpload);
				const latestHrTimeKey = that.formatTimestampKey(latestHr.timestamp);
				const deviceTs = that.normalizeHomeVitalTs(heartRateDatatime);
				const hrVal = latestHr.value;
				try {
					await that.ensureBpw6ServerHistoryLoaded(deviceSn);
				} catch (e) {
					console.warn('【BPW6】心率刷新前拉服务器失败', e);
				}
				const existingHrMap = that.getExistingHeartRateMap();
				const hrRec = {
					dateTimeKey: latestHrTimeKey,
					timestamp: latestHr.timestamp,
					heartRate: hrVal
				};
				const serverHr = that.findExistingBpw6HrAtSlot(existingHrMap, hrRec);
				const baseline = that.normalizeHomeVitalTs(uni.getStorageSync(
					'heartRateDatatime'));
				const timeNewer = !baseline || (deviceTs != null && deviceTs > baseline);
				const sameSlotValueDiff = serverHr !== undefined && String(serverHr) !==
					String(hrVal);
				const missingOnServer = serverHr === undefined;
				// 先服务器：手表时间更新，或同槽值变化，或无基线且服务器无此槽 → 才用手表刷卡
				const shouldApplyWatchUi = timeNewer || sameSlotValueDiff || (
					missingOnServer && !baseline);
				if (shouldApplyWatchUi) {
					that.applyBpw6HrHomeUi(hrVal, latestHr.timestamp, heartRateDatatime);
					that.bpw6PendingHrUi = {
						value: hrVal,
						ts: deviceTs,
						at: Date.now()
					};
					console.log('【BPW6】心率刷卡', {
						hrVal,
						timeNewer,
						sameSlotValueDiff,
						missingOnServer,
						serverHr: serverHr !== undefined ? serverHr : null,
						skipUpload
					});
				} else {
					console.log('【BPW6】服务器已是更新/同值，跳过手表刷卡', {
						hrVal,
						serverHr,
						baseline,
						deviceTs
					});
				}
				if (skipUpload) {
					console.log('【BPW6】心率跳过上报(progressive/待重读)');
					return;
				}
				try {
					await that.uploadBPW6HrHistoryWithDeduplication(deviceId, deviceSn);
				} catch (e) {
					console.warn('【BPW6】心率上报失败', e);
				}
				that.get_device_info(deviceSn);
			},
			/**
			 * BPW6：接口回填时若同槽仍是旧值，保留刚上报的 pending，避免卡片闪回上一条。
			 * @returns {boolean} true 表示应跳过用该接口心率覆盖 UI
			 */
			shouldKeepBpw6PendingHrAgainstServer(serverHrValue, serverTimeMsOrSec) {
				const pending = this.bpw6PendingHrUi;
				if (!pending) {
					return false;
				}
				if (Date.now() - (pending.at || 0) > 90000) {
					this.bpw6PendingHrUi = null;
					return false;
				}
				if (serverHrValue != null && String(serverHrValue) === String(pending.value)) {
					this.bpw6PendingHrUi = null;
					return false;
				}
				let serverTs = null;
				if (serverTimeMsOrSec != null && serverTimeMsOrSec !== '') {
					const n = Number(serverTimeMsOrSec);
					if (!Number.isNaN(n) && n > 0) {
						serverTs = this.normalizeHomeVitalTs(n > 9999999999 ? n / 1000 : n);
					}
				}
				if (serverTs && pending.ts) {
					if (serverTs > pending.ts + 60) {
						// 接口已有更新槽位，以服务器为准
						this.bpw6PendingHrUi = null;
						return false;
					}
					const slotP = Math.floor(Number(pending.ts) / 60) * 60;
					const slotS = Math.floor(Number(serverTs) / 60) * 60;
					if (slotP === slotS && String(serverHrValue) !== String(pending.value)) {
						console.log('【BPW6】同槽接口仍为旧心率，保留 pending', pending.value, 'vs',
							serverHrValue);
						return true;
					}
				}
				// 接口尚未跟上时保留 pending
				if (serverHrValue != null && String(serverHrValue) !== String(pending.value)) {
					return true;
				}
				return false;
			},
			/**
			 * 有网且设备时间严格新于接口时，才刷新首页血压/心率/血氧数据与卡片。
			 * options.skipNetworkCheck：调用方已确认在线时跳过二次网络判断。
			 */
			runHomeVitalRefreshIfAllowed(deviceTs, storageKey, applyFn, options = {}) {
				if (typeof applyFn !== 'function') {
					return;
				}
				if (!this.isDeviceNewerThanApiBaseline(deviceTs, storageKey)) {
					// console.log('【首页】设备时间未新于接口，跳过刷新', storageKey, deviceTs,
					// 	uni.getStorageSync(storageKey));
					return;
				}
				const doApply = () => {
					try {
						applyFn();
					} catch (e) {
						console.error('【首页】刷新卡片失败', e);
					}
				};
				if (options.skipNetworkCheck) {
					doApply();
					return;
				}
				uni.getNetworkType({
					success: (res) => {
						if (res.networkType === 'none') {
							console.log('【首页】无网络，跳过刷新卡片', storageKey);
							return;
						}
						doApply();
					},
					fail: () => {
						console.log('【首页】网络状态未知，跳过刷新卡片', storageKey);
					}
				});
			},
			// 处理血压数据
			processBloodPressureData(data) {
				const slaveSn2Data = data.filter(item => item.slaveSn === "2");
				const slaveSn3Data = data.filter(item => item.slaveSn === "3");
				const latestBp = this.getLatestBloodPressurePair(slaveSn2Data, slaveSn3Data);
				const latestHr = this.getLatestRegisterEntry(slaveSn2Data, slaveSn3Data,
					"heartrate");
				const latestO2 = this.getLatestRegisterEntry(slaveSn2Data, slaveSn3Data,
					"oxygen");
				const apiBpTs = this.normalizeHomeVitalTs(latestBp.time)
				const localBpTs = this.normalizeHomeVitalTs(uni.getStorageSync(
					"parseBloodDatatime"))
				const keepLocalBp = localBpTs > 0 && (!apiBpTs || localBpTs > apiBpTs)
				// 设备刷新基线：两路里取时间更新的那个；本地已更新则勿用更旧接口时间把门禁打回去
				if (latestBp.time && !keepLocalBp) {
					uni.setStorageSync("parseBloodDatatime", latestBp.time / 1000)
				}
				if (latestO2.time) {
					uni.setStorageSync("oxygenDatatime", latestO2.time / 1000)
				}
				const keepBpw6PendingHr = this.shouldKeepBpw6PendingHrAgainstServer(
					latestHr && latestHr.value, latestHr && latestHr.time);
				if (latestHr.time && !keepBpw6PendingHr) {
					uni.setStorageSync("heartRateDatatime", latestHr.time / 1000)
				}
				// 首页主数据以接口为准（仅保留离线待报缓存时不覆盖）
				if (!uni.getStorageSync('xueyadata')) {
					const highPressureData = {
						value: latestBp.high,
						time: latestBp.time
					};
					const lowPressureData = {
						value: latestBp.low,
						time: latestBp.time
					};
					const pulseData = keepBpw6PendingHr && this.bpw6PendingHrUi ? {
						value: this.bpw6PendingHrUi.value,
						time: (this.bpw6PendingHrUi.ts != null) ?
							(Number(this.bpw6PendingHrUi.ts) * 1000) : latestHr.time
					} : latestHr;
					if (!keepLocalBp) {
						this.lowPressure = this.Blood === "mmHg" ? lowPressureData.value : (
							Number(lowPressureData.value) * 0.133).toFixed(1);
						this.highPressure = this.Blood === "mmHg" ? highPressureData.value : (
							Number(highPressureData.value) * 0.133).toFixed(1);
						if (this.isValidRegisterVal(lowPressureData.value)) {
							uni.setStorageSync("lowPressure", lowPressureData.value)
						}
						if (this.isValidRegisterVal(highPressureData.value)) {
							uni.setStorageSync("highPressure", highPressureData.value)
						}
						this.updateBloodPressureStatus(lowPressureData.value, highPressureData
							.value);
					}
					this.pulse = pulseData.value;
					this.pulsetime = this.formatDate(pulseData.time);
					if (this.isValidRegisterVal(pulseData.value)) {
						uni.setStorageSync("pulse", pulseData.value)
						uni.setStorageSync("pulsetimes", this.pulsetime)
					}
				}
				if (!(keepBpw6PendingHr && this.bpw6PendingHrUi)) {
					this.pulsetime = this.formatDate(latestHr.time);
				}
				// 更新卡片列表（在 this.list 上写接口数值/日期，再回写缓存）
				const kapianlist = (this.list && this.list.length) ? this.list : (uni
					.getStorageSync(
						"kapianlist") || []);
				if ((!this.list || !this.list.length) && kapianlist.length) {
					this.list = kapianlist
				}
				for (let i = 0; i < kapianlist.length; i++) {
					const item = kapianlist[i];
					if (item.title === "身高" || item.title === "Height") {
						this.processHeight(data, item.title);
					} else if (item.title === "体温" || item.title === "Body Temperature") {
						this.processTemperature(data, item.title);
					} else if (item.title === "血氧" || item.title === "SpO2") {
						this.processBloodOxygen(data, item.title);
					} else if (item.title === "压力" || item.title === "Stress") {
						this.processyali(data, item.title);
					} else if (item.title === "心率" || item.title === "Heart") {
						this.processxiblv(data, item.title);
					}
				}
				uni.setStorageSync("kapianlist", this.list)
			},

			// 处理体重数据
			processWeightData(data) {
				if (this.lastWeightbishi === "" && !uni.getStorageSync("tizhidata")) {
					this.Latest_weight = (this.newweightKG === "KG" || this.newweightKG ===
							"千克") ?
						this.getRegisterVal(data, 'register', 'weight') : WeightConverter
						.kgToLb(this.getRegisterVal(data,
							'register', 'weight'));
				}
				this.Latest_date = this.getUpdateTime(data, 'register', 'weight')
				this.Target_weight = (this.chuhsikg === "kg" || this.chuhsikg === "千克") ?
					this.getRegisterVal(data, 'register', 'goal_weight') : WeightConverter
					.kgToLb(this.getRegisterVal(data,
						'register', 'goal_weight'));
				this.Chest_circumference = this.getRegisterVal(data, 'register',
					'chest_circumference');
				this.waistline = this.getRegisterVal(data, 'register', 'waistline');
				this.Hip_circumference = this.getRegisterVal(data, 'register', 'hipline');
				this.Upper_Chest_circumference = this.getRegisterVal(data, 'register',
					'biceps_circumference');
				this.Thigh_circumference = this.getRegisterVal(data, 'register',
					'thigh_circumference');
				this.Calf_circumference = this.getRegisterVal(data, 'register',
					'calf_circumference');

				const kapianlist2 = uni.getStorageSync("kapianlist2") || [];
				for (let i = 0; i < kapianlist2.length; i++) {
					const item = kapianlist2[i];
					if (item.title === "BMI") {
						this.processGenericData(data, "BMI", "weight");
					} else if (item.title === "骨含量" || item.title === "Bone Mass") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "肌肉量" || item.title === "Muscle Mass") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "蛋白率" || item.title === "Protein%") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "水分" || item.title === "Water%") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "内脏脂肪指数" || item.title === "VFI") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "脂肪率" || item.title === "Fat%") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "基础代谢率" || item.title === "BMR") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "皮下脂肪率" || item.title === "SubQ Fat%") {
						this.processGenericData(data, item.title, "weight");
					} else if (item.title === "身体年龄" || item.title === "Body Age") {
						this.processGenericData(data, item.title, "weight");
					}
				}
			},

			// 处理睡眠数据
			processSleepData(data) {
				uni.getStorageInfo({
					success: (ress) => {
						this.yali = uni.getStorageSync("yali") || "0";
						this.yali_time = uni.getStorageSync("yalitimes") ||
							"--/--";
					},
				});
				this.sleep = this.getRegisterVal(data, 'register', 'sleep');
				this.sleep_time = this.getUpdateTime(data, 'register', 'sleep')
				if (this.getRegisterVal(data, 'register', 'sleep') === null || this
					.getRegisterVal(data, 'register',
						'sleep') === "-/-") {
					this.totalLight = "--/--"
					this.totalDeep = "--/--"
					this.totalRem = "--/--"
					this.sleep_point = "--/--"
					this.sleep = "--/--"
					this.sleep_time = "--/--"
				} else if (this.getRegisterVal(data, 'register', 'sleep') === '0H0M') {
					this.totalLight = "0H0M"
					this.totalDeep = "0H0M"
					this.totalRem = "0H0M"
					this.sleep_point = "--/--"
					this.sleep = "0H0M"
					this.sleep_time = this.getUpdateTime(data, 'register', 'sleep')
				} else {
					this.totalLight = uni.getStorageSync("totalLight")
					this.totalDeep = uni.getStorageSync("totalDeep")
					this.totalRem = uni.getStorageSync("totalRem")
					const totalAll = this.timeStrToMinutes(this.sleep);
					const totalH = (totalAll / 60).toFixed(1)
					const deepMin = (this.timeStrToMinutes(this.totalDeep) / 60).toFixed(1);
					const remMin = (this.timeStrToMinutes(this.totalRem) / 60).toFixed(1);
					const lightMin = (this.timeStrToMinutes(this.totalLight) / 60).toFixed(1)
					this.sleep_point = this.overallSleepScore(totalAll, totalH, deepMin,
						remMin, lightMin)
					uni.setStorageSync("sleep_point", this.sleep_point)
				}
			},

			// 处理运动数据
			processStepsData(data) {
				this.bushu = this.getRegisterVal(data, 'register', 'steps');
				this.bushu_time = this.getUpdateTime(data, 'register', 'steps')
				this.saveDailySteps(this.bushu, this.bushu_time);
			},
			// 处理身高卡片
			processHeight(item, name) {
				const heightItem = this.findValue(this.list, 'title', name);
				const height = this.findValue(item, 'register', 'height')?.registerVal;
				const unit = uni.getStorageSync("danwei1") === 0 ? this.$t("英寸") : this.$t(
					"厘米");
				heightItem.type_LX = unit;
				heightItem.title = this.$t("身高")
				heightItem.Step_number = height !== null ? ((unit === "英寸" || unit ===
					"inch") ? WeightConverter.cmToInch(
					height) : height) : '-/-';
				heightItem.Step_count = this.formatDate(this.findValue(item, 'register',
					'height')?.updateTime);
			},

			// 处理体温卡片
			processTemperature(item, name) {
				const temperatureItem = this.findValue(this.list, 'title', name);
				temperatureItem.title = this.$t("体温")
				temperatureItem.Step_number = uni.getStorageSync("tiwen") || "0";
				temperatureItem.Step_count = uni.getStorageSync("tiwentimes") || "--/--";
			},

			// 处理压力卡片
			processyali(item, name) {
				const temperatureItem = this.findValue(this.list, 'title', name);
				temperatureItem.title = this.$t("压力");
				temperatureItem.Step_number = uni.getStorageSync("yali") || "0";
				temperatureItem.Step_count = uni.getStorageSync("yalitimes") || "--/--";
			},

			// 处理心率卡片（数值+日期均以接口最新一条为准；BPW6 同槽 pending 防旧值闪回）
			processxiblv(item, name) {
				const hrItem = this.getLatestRegisterFromList(item, 'heartrate');
				const serverPulse = hrItem && this.isValidRegisterVal(hrItem.registerVal) ?
					hrItem.registerVal : null;
				const keepPending = this.shouldKeepBpw6PendingHrAgainstServer(
					serverPulse, hrItem && hrItem.updateTime);
				let pulse;
				let pulsetime;
				if (keepPending && this.bpw6PendingHrUi) {
					pulse = this.bpw6PendingHrUi.value;
					pulsetime = this.bpw6PendingHrUi.ts != null ?
						this.formatDate(Number(this.bpw6PendingHrUi.ts) * 1000) :
						(this.pulsetime || '-/-');
				} else {
					pulse = serverPulse != null ? serverPulse :
						(this.pulse != null && this.pulse !== '' ? this.pulse : '0');
					pulsetime = hrItem?.updateTime ?
						this.formatDate(hrItem.updateTime) :
						(this.pulsetime || '-/-');
				}
				this.pulsetime = pulsetime;
				if (this.isValidRegisterVal(pulse)) {
					uni.setStorageSync("pulse", pulse);
					uni.setStorageSync("pulsetimes", pulsetime);
				}
				this.updateLocalHeartRateCard(pulse, pulsetime, name);
			},

			findHeartRateCardItem(preferTitle) {
				if (preferTitle) {
					const preferred = this.findValue(this.list, 'title', preferTitle);
					if (preferred) return preferred;
				}
				const titles = [this.$t('心率'), '心率', 'Heart'];
				for (let i = 0; i < titles.length; i++) {
					const item = this.findValue(this.list, 'title', titles[i]);
					if (item) return item;
				}
				return null;
			},

			updateLocalHeartRateCard(pulse, pulsetime, preferTitle) {
				const heartRateItem = this.findHeartRateCardItem(preferTitle);
				if (!heartRateItem) return;
				heartRateItem.title = this.$t("心率");
				heartRateItem.Step_number = pulse != null && pulse !== '' ? pulse : "0";
				heartRateItem.Step_count = pulsetime || "-/-";
				uni.setStorageSync("kapianlist", this.list)
			},

			findBloodOxygenCardItem(preferTitle) {
				if (preferTitle) {
					const preferred = this.findValue(this.list, 'title', preferTitle);
					if (preferred) return preferred;
				}
				const titles = [this.$t('血氧'), '血氧', 'SpO2', 'SpO₂'];
				for (let i = 0; i < titles.length; i++) {
					const item = this.findValue(this.list, 'title', titles[i]);
					if (item) return item;
				}
				return null;
			},

			applyBloodOxygenStatus(bloodOxygenItem, xueyang) {
				const val = parseInt(xueyang);
				if (isNaN(val)) return;
				if (val <= 95) {
					bloodOxygenItem.BMI_ys = this.$t('偏低');
					bloodOxygenItem.BMI_TF = 0;
				} else if (val < 98) {
					bloodOxygenItem.BMI_ys = this.$t('正常');
					bloodOxygenItem.BMI_TF = 1;
				} else if (val >= 98) {
					bloodOxygenItem.BMI_ys = this.$t('偏高');
					bloodOxygenItem.BMI_TF = 10;
				}
			},

			updateLocalBloodOxygenCard(xueyang, xueyangtimes, preferTitle) {
				const bloodOxygenItem = this.findBloodOxygenCardItem(preferTitle);
				if (!bloodOxygenItem) return;
				bloodOxygenItem.title = this.$t("血氧");
				bloodOxygenItem.Step_number = xueyang != null && xueyang !== '' ? xueyang :
					"0";
				bloodOxygenItem.Step_count = xueyangtimes || "-/-";
				this.applyBloodOxygenStatus(bloodOxygenItem, xueyang);
				uni.setStorageSync("kapianlist", this.list)
			},

			// 处理血氧卡片（数值+日期均以接口最新一条为准）
			processBloodOxygen(item, name) {
				const o2Item = this.getLatestRegisterFromList(item, 'oxygen');
				const xueyang = o2Item && this.isValidRegisterVal(o2Item.registerVal) ?
					o2Item.registerVal :
					uni.getStorageSync("xueyang");
				const xueyangtimes = o2Item?.updateTime ?
					this.formatDate(o2Item.updateTime) :
					(uni.getStorageSync("xueyangtimes") || '-/-');
				if (this.isValidRegisterVal(xueyang)) {
					uni.setStorageSync("xueyang", xueyang);
					uni.setStorageSync("xueyangtimes", xueyangtimes);
				}
				this.updateLocalBloodOxygenCard(xueyang, xueyangtimes, name);
			},

			// 定义BMI分类逻辑
			updateBMI(data) {
				const bmiItem = this.findValue(this.list2, 'title', "BMI");
				const bmiValue = data.BMI || 0;
				bmiItem.Step_number = bmiValue;
				if (bmiValue < 18.5) {
					bmiItem.BMI_TF = 0;
					bmiItem.BMI_ys = this.$t("体重过轻");
				} else if (bmiValue <= 24.9) {
					bmiItem.BMI_TF = 1;
					bmiItem.BMI_ys = this.$t("正常体重");
				} else if (bmiValue <= 29.9) {
					bmiItem.BMI_TF = 2;
					bmiItem.BMI_ys = this.$t("超重");
				} else if (bmiValue <= 34.9) {
					bmiItem.BMI_TF = 3;
					bmiItem.BMI_ys = this.$t("一级肥胖");
				} else if (bmiValue <= 39.9) {
					bmiItem.BMI_TF = 4;
					bmiItem.BMI_ys = this.$t("二级肥胖");
				} else {
					bmiItem.BMI_TF = 5;
					bmiItem.BMI_ys = this.$t("三级肥胖或病态肥胖");
				}
			},

			// 通用数据处理
			processGenericData(itemdata, titleKey, dataKey) {
				const item = this.findValue(this.list2, 'title', titleKey);
				const data = this.findValue(itemdata, 'register', dataKey);
				item.Step_count = this.formatDate(data?.updateTime);
				item.title = this.$t(titleKey)
			},

			// 更新卡片数据
			updateCard(data, titleKey, dataKey, name) {
				const item = this.findValue(this.list2, 'title', titleKey);
				item.title = name
				item.Step_number = data[dataKey] || '-/-';
			},
			// 定义血压等级判断逻辑
			updateBloodPressureStatus(lowPressure, highPressure) {
				this.xueya = -1; // 初始化为未知状态
				this.title_name = this.$t("未知");
				const pressureRanges = [
					// 正常血压
					{
						lowMin: 61,
						lowMax: 80,
						highMin: 91,
						highMax: 120,
						level: 0,
						name: this.$t("正常血压")
					},
					// 正常高值
					{
						lowMin: 81,
						lowMax: 90,
						highMin: 121,
						highMax: 140,
						level: 1,
						name: this.$t("正常高值")
					},
					// 一级高血压
					{
						lowMin: 91,
						lowMax: 100,
						highMin: 141,
						highMax: 160,
						level: 2,
						name: this.$t("一级高血压")
					},
					// 二级高血压
					{
						lowMin: 101,
						lowMax: 110,
						highMin: 161,
						highMax: 180,
						level: 3,
						name: this.$t("二级高血压")
					}
				];
				for (const range of pressureRanges) {
					if ((lowPressure >= range.lowMin && lowPressure <= range.lowMax) ||
						(highPressure >= range.highMin && highPressure <= range.highMax)) {
						this.xueya = range.level;
						this.title_name = range.name;
						break;
					}
				}
			},
			registerBpw6BleNotifyListener(deviceId, deviceSn) {
				// 已解绑 BPW6 时禁止再挂转发，避免抢占 BPW1 的全局 notify
				if (!uni.getStorageSync('BPW6devicemac') && !this.deviceIdwatch6) {
					return
				}
				if (this.bpw6BleNotifyListenerRegistered) {
					return
				}
				const that = this
				u16proBLE.setForwardNotifyHandler((res, bytes, handledResult) => {
					const hexPreview = bytes.length ? bytes.slice(0, 8).map(b => b
							.toString(16).padStart(2, '0'))
						.join(
							'') : ''
					if (bytes.length && bytes[0] === 0xBC) {
						// console.log('【BPW6】BC notify', res.serviceId, hexPreview, bytes.length)
					} else if ((res.serviceId || '').toUpperCase() === BPW6BC_SERVICE
						.toUpperCase()) {
						console.log('【BPW6】PPG服务notify', res.serviceId, hexPreview,
							bytes.length)
					}
					const BPW6DeviceId = res.deviceId
					if (handledResult !== undefined && handledResult !== null) {
						that.BPW6paredata(handledResult, BPW6DeviceId, deviceSn)
						return
					}
					// 兼容 BPW1、血压计等其他设备的蓝牙 notify 数据
					that.forwardOtherDeviceBleNotify(res, deviceSn)
				})
				this.bpw6BleNotifyListenerRegistered = true
			},
			forwardOtherDeviceBleNotify(res, deviceSn) {
				this.routeOtherDeviceBleNotify(res, deviceSn)
			},
			routeOtherDeviceBleNotify(res, deviceSn) {
				if (!this._legacyBleNotifyDispatch) {
					this._legacyBleNotifyDispatch = this.buildLegacyBleNotifyDispatch(deviceSn,
						res.deviceId)
				}
				const serviceUpper = (res.serviceId || '').toUpperCase()
				if (serviceUpper === BPW6SERVICE.toUpperCase() ||
					serviceUpper === BPW6BC_SERVICE.toUpperCase()) {
					return
				}
				this._legacyBleNotifyDispatch(res)
			},
			// 从服务器血压数据中提取已有时间集合（仅含真实血压点）
			getExistingBloodPressureTimeSet() {
				const existingTimes = new Set();
				const serverData = this.boolserverData;
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								const hasBp = (detail.highPressure != null &&
										detail.highPressure !==
										'') ||
									(detail.lowPressure != null && detail
										.lowPressure !== '');
								if (!hasBp) {
									return;
								}
								if (item.dateTime && detail.time) {
									const nk = this.normalizeDateTimeKey(
										`${item.dateTime} ${detail.time}`);
									if (nk) {
										existingTimes.add(nk);
										existingTimes.add(String(this.datatime(
											nk)));
									}
								}
								if (detail.timestamp != null && detail
									.timestamp !== '') {
									const tsNum = this.normalizeUnixTimestamp(
										detail.timestamp);
									if (tsNum != null) {
										existingTimes.add(String(tsNum));
										existingTimes.add(this
											.formatTimestampKey(tsNum));
										const slotTs = Math.floor(tsNum / 60) *
											60;
										existingTimes.add(String(slotTs));
										existingTimes.add(this
											.formatTimestampKey(slotTs));
									}
								}
							});
						}
					});
				}
				return existingTimes;
			},
			getExistingHeartRateMap() {
				const existingMap = new Map();
				const serverData = this.boolserverData;
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								if (detail.heartrate == null || detail
									.heartrate === '') {
									return;
								}
								const hrVal = detail.heartrate;
								const setHr = (mapKey) => {
									if (mapKey != null && mapKey !== '') {
										existingMap.set(String(mapKey),
											hrVal);
									}
								};
								if (item.dateTime && detail.time) {
									const nk = this.normalizeDateTimeKey(
										`${item.dateTime} ${detail.time}`);
									setHr(nk);
									if (nk) {
										setHr(String(this.datatime(nk)));
									}
								}
								if (detail.timestamp != null && detail
									.timestamp !== '') {
									const tsNum = this.normalizeUnixTimestamp(
										detail.timestamp);
									if (tsNum != null) {
										setHr(String(tsNum));
										setHr(this.formatTimestampKey(tsNum));
										// BPW6 按分钟槽位对齐
										const slotTs = Math.floor(tsNum / 60) *
											60;
										setHr(String(slotTs));
										setHr(this.formatTimestampKey(slotTs));
									}
								}
							});
						}
					});
				}
				return existingMap;
			},
			getExistingHeartRateTimeSet() {
				return new Set(this.getExistingHeartRateMap().keys())
			},
			/** BPW6 槽位时间匹配键（多格式 + 分钟对齐，避免误判已存在/不存在） */
			getBpw6SlotMatchKeys(dateTimeKey, timestamp) {
				const keys = [];
				const push = (k) => {
					if (k != null && k !== '') {
						keys.push(String(k));
					}
				};
				const normalized = this.normalizeDateTimeKey(dateTimeKey);
				if (normalized) {
					push(normalized);
					push(String(this.datatime(normalized)));
					const parts = normalized.split(' ');
					if (parts.length === 2) {
						const hm = parts[1].split(':');
						if (hm.length >= 2) {
							push(
								`${parts[0]} ${hm[0].padStart(2, '0')}:${hm[1].padStart(2, '0')}:00`
							);
						}
					}
				}
				const tsNum = this.normalizeUnixTimestamp(timestamp);
				if (tsNum != null) {
					push(String(tsNum));
					push(this.formatTimestampKey(tsNum));
					const slotTs = Math.floor(tsNum / 60) * 60;
					push(String(slotTs));
					push(this.formatTimestampKey(slotTs));
				}
				return [...new Set(keys)];
			},
			findExistingBpw6HrAtSlot(existingHrMap, hr) {
				if (!existingHrMap || !hr) {
					return undefined;
				}
				for (const key of this.getBpw6SlotMatchKeys(hr.dateTimeKey, hr.timestamp)) {
					if (existingHrMap.has(key)) {
						return existingHrMap.get(key);
					}
				}
				return undefined;
			},
			isBpw6SlotInServerSet(existingSet, dateTimeKey, timestamp) {
				if (!existingSet) {
					return false;
				}
				for (const key of this.getBpw6SlotMatchKeys(dateTimeKey, timestamp)) {
					if (existingSet.has(key)) {
						return true;
					}
				}
				return false;
			},
			/** BPW1 心率值是否可用于血压合并上报（不可为空） */
			isValidBpw1HeartRate(value) {
				if (value == null || value === '' || value === '-' || value === '--') {
					return false;
				}
				const num = Number(value);
				return !Number.isNaN(num) && num > 0;
			},
			/**
			 * 血压包 byte8 在协议里是 bpType，但部分固件/19 包会把脉搏放这里。
			 * 仅当数值落在生理脉搏范围时才当脉搏，避免把类型枚举(0/1/2)当成心率。
			 */
			isLikelyBpw1BpPacketPulse(value) {
				const num = Number(value);
				return !Number.isNaN(num) && num >= 40 && num <= 220;
			},
			/** BPW1：是否已有待上报血压，且与该心率时间差 ≤5 秒（分包配对） */
			shouldHoldBpw1HrForBpPair(hrTs) {
				const pending = this.bpw1PendingLiveBp;
				if (!pending || pending.ts == null || hrTs == null) {
					return false;
				}
				return Math.abs(Number(hrTs) - Number(pending.ts)) <= 5;
			},
			/** 从已缓冲心率里找与血压时间差 ≤5 秒的最近一条，作伴生 */
			findBpw1BufferedCompanionHr(bpTs, bpDate, bpTime) {
				if (bpTs == null) {
					return null;
				}
				let best = null;
				let bestSkew = Infinity;
				const consider = (hr) => {
					if (!hr || !this.isValidBpw1HeartRate(hr.heartRate)) {
						return;
					}
					let ts = hr.ts;
					if (ts == null && hr.date && hr.time) {
						ts = this.datatime(`${hr.date} ${hr.time}`);
					}
					if (ts == null) {
						return;
					}
					const skew = Math.abs(Number(ts) - Number(bpTs));
					if (skew > 5 || skew >= bestSkew) {
						return;
					}
					bestSkew = skew;
					best = {
						date: hr.date || bpDate,
						time: hr.time || bpTime,
						heartRate: hr.heartRate,
						ts: Number(ts)
					};
				};
				(this.hrResult || []).forEach(consider);
				if (this.bpw1RecentLiveHr) {
					consider(this.bpw1RecentLiveHr);
				}
				if (this.bpw1PendingBpCompanionHr) {
					consider(this.bpw1PendingBpCompanionHr);
				}
				return best;
			},
			/** 等待伴生心率：未配对成功时每秒重试，配对成功或缓存清空后停止 */
			scheduleBpw1LiveBpHrRetry() {
				if (this.bpw1LiveBpHrFlushTimer) {
					clearTimeout(this.bpw1LiveBpHrFlushTimer);
				}
				this.bpw1LiveBpHrFlushTimer = setTimeout(() => {
					this.bpw1LiveBpHrFlushTimer = null;
					const pending = this.bpw1PendingLiveBp;
					const started = (pending && pending.waitStartedAt) || 0;
					const waitedMs = started ? (Date.now() - started) : 0;
					// 仅精确配对（≤5 秒）；不再放宽到 30 秒以免错配旧心率后干等
					if (pending && !this.bpw1PendingBpCompanionHr) {
						const buffered = this.findBpw1BufferedCompanionHr(pending.ts,
							pending.date, pending.time);
						if (buffered) {
							this.bpw1PendingBpCompanionHr = buffered;
						}
					}
					this.tryFlushBpw1LiveBpHrUpload(false);
					if (this.bpw1PendingLiveBp) {
						// 最多等 15 秒近时伴生（≤5s）；有脉搏/近时心率会立刻 flush，不会再干等 30s
						if (!started || waitedMs < 15000) {
							this.scheduleBpw1LiveBpHrRetry();
						} else {
							const companion = this.bpw1PendingBpCompanionHr;
							const wantPpg = !!(pending && pending.startPpgAfterBp);
							const requireBlewatchIdForYali = !pending || pending
								.requireBlewatchIdForYali !==
								false;
							const companionSkew = (companion && companion.ts != null &&
									pending && pending.ts !=
									null) ?
								Math.abs(Number(companion.ts) - Number(pending.ts)) :
								Infinity;
							// 超时仍只接受 ≤5 秒伴生；过旧心率绝不强制绑到本条血压
							if (pending && companion && this.isValidBpw1HeartRate(
									companion.heartRate) &&
								companionSkew <= 5) {
								console.warn('【BPW1】等待伴生心率超过15秒，合并上报血压+心率');
								this.bpw1PendingLiveBp = null;
								this.bpw1AwaitingBpHrPair = false;
								this.bpw1PendingBpCompanionHr = null;
								this.rememberBpw1BpHrPairUpload(pending.ts, companion);
								this.clearBpw1LiveBpMeasureGate('等心率超时强制合并');
								const that = this;
								uni.getNetworkType({
									success: function(res) {
										if (res.networkType !== 'none') {
											that.jakoblife_fat_scale22(
												that.shoubiaomac,
												pending.systolic,
												pending.diastolic,
												companion.heartRate,
												that.shoubiaosn,
												pending.ts
											);
										}
										if (wantPpg) {
											const ok = that
												.tryStartBpw1PpgAfterBp(
													'等心率超时强制合并',
													requireBlewatchIdForYali
												);
											if (!ok && !that
												.isBpw1ActivePpgSession() &&
												!that
												.yalixueyatype &&
												!that
												._bpw1AfterBpPpgTimer && !
												that
												._bpw1AfterBpLaunching) {
												that.applyEmotionButtonIdleByBind(
													'等心率超时后PPG未启动')
											}
										}
									},
									fail: function() {
										if (wantPpg) {
											const ok = that
												.tryStartBpw1PpgAfterBp(
													'等心率超时强制合并-网络失败',
													requireBlewatchIdForYali
												);
											if (!ok && !that
												.isBpw1ActivePpgSession() &&
												!that
												.yalixueyatype &&
												!that
												._bpw1AfterBpPpgTimer && !
												that
												._bpw1AfterBpLaunching) {
												that.applyEmotionButtonIdleByBind(
													'等心率超时后PPG未启动')
											}
										}
									}
								});
							} else {
								console.warn('【BPW1】等待伴生心率超过15秒，放弃本次血压合并（无有效近时伴生心率）');
								this.bpw1PendingLiveBp = null;
								this.bpw1AwaitingBpHrPair = false;
								this.bpw1PendingBpCompanionHr = null;
								this.clearBpw1LiveBpMeasureGate('等心率超时放弃合并');
								// 实时血压已结束：仍启血压后 PPG；后续单独心率仍可按库缺失补报
								if (wantPpg) {
									const ok = this.tryStartBpw1PpgAfterBp('等心率超时后',
										requireBlewatchIdForYali);
									if (!ok && !this.isBpw1ActivePpgSession() && !this
										.yalixueyatype &&
										!this._bpw1AfterBpPpgTimer && !this
										._bpw1AfterBpLaunching) {
										this.applyEmotionButtonIdleByBind(
											'等心率超时后PPG未启动')
									}
								} else if (!this.isBpw1ActivePpgSession() && !this
									.yalixueyatype &&
									!this._bpw1AfterBpPpgTimer && !this
									._bpw1AfterBpLaunching) {
									this.applyEmotionButtonIdleByBind('等心率超时放弃合并')
								}
							}
						}
					}
				}, 1000);
			},
			markBpw1HrConsumedByBp(hr) {
				if (!hr) {
					return;
				}
				if (!this.bpw1HrConsumedByBpKeys) {
					this.bpw1HrConsumedByBpKeys = new Set();
				}
				const key = this.normalizeDateTimeKey(`${hr.date} ${hr.time}`);
				if (key) {
					this.bpw1HrConsumedByBpKeys.add(key);
					let ts = hr.ts != null ? Number(hr.ts) : this.datatime(key);
					if (ts != null && !Number.isNaN(Number(ts))) {
						ts = Number(ts);
						this.bpw1HrConsumedByBpKeys.add(String(ts));
						try {
							const fk = this.formatTimestampKey(ts);
							if (fk) {
								this.bpw1HrConsumedByBpKeys.add(fk);
							}
						} catch (e) {}
					}
				}
			},
			/** 血压+心率合并上报后，把血压/心率时间及 ±5 秒记为已覆盖，避免心率再单独上报 */
			rememberBpw1BpHrPairUpload(bpTs, hr) {
				if (!this.bpw1HrConsumedByBpKeys) {
					this.bpw1HrConsumedByBpKeys = new Set();
				}
				if (hr) {
					this.markBpw1HrConsumedByBp(hr);
					const hrKey = this.normalizeDateTimeKey(`${hr.date} ${hr.time}`);
					let hrTs = hr.ts != null ? Number(hr.ts) : null;
					if ((hrTs == null || Number.isNaN(hrTs)) && hrKey) {
						try {
							hrTs = Number(this.datatime(hrKey));
						} catch (e) {
							hrTs = null;
						}
					}
					this.rememberBpw1HrUploadKey(hrKey, hrTs);
				}
				const base = Number(bpTs);
				if (bpTs == null || Number.isNaN(base)) {
					return;
				}
				// 与实时配对窗（≤5s）对齐，避免已合并心率按邻近时间再报
				for (let d = -5; d <= 5; d++) {
					const t = base + d;
					this.bpw1HrConsumedByBpKeys.add(String(t));
					try {
						const fk = this.formatTimestampKey(t);
						if (fk) {
							this.bpw1HrConsumedByBpKeys.add(fk);
						}
					} catch (e) {}
				}
				this.rememberBpw1HrUploadKey(null, base);
			},
			isBpw1HrConsumedByBp(hrOrKey) {
				if (!this.bpw1HrConsumedByBpKeys || !hrOrKey) {
					return false;
				}
				const key = typeof hrOrKey === 'string' ?
					this.normalizeDateTimeKey(hrOrKey) :
					this.normalizeDateTimeKey(`${hrOrKey.date} ${hrOrKey.time}`);
				return !!(key && this.bpw1HrConsumedByBpKeys.has(key));
			},
			/** 心率是否已随血压合并（含时间差 5 秒的键） */
			isBpw1HrCoveredByBpPair(hrOrKey) {
				if (!hrOrKey) {
					return false;
				}
				const key = typeof hrOrKey === 'string' ?
					this.normalizeDateTimeKey(hrOrKey) :
					this.normalizeDateTimeKey(`${hrOrKey.date} ${hrOrKey.time}`);
				if (!key) {
					return false;
				}
				if (this.isBpw1HrConsumedByBp(key)) {
					return true;
				}
				if (!this.bpw1HrConsumedByBpKeys) {
					return false;
				}
				let hrTs;
				try {
					hrTs = this.datatime(key);
				} catch (e) {
					return false;
				}
				if (hrTs == null || Number.isNaN(Number(hrTs))) {
					return false;
				}
				const base = Number(hrTs);
				for (let d = -5; d <= 5; d++) {
					const t = base + d;
					if (this.bpw1HrConsumedByBpKeys.has(String(t))) {
						return true;
					}
					try {
						const fk = this.formatTimestampKey(t);
						if (fk && this.bpw1HrConsumedByBpKeys.has(fk)) {
							return true;
						}
					} catch (e) {}
				}
				return false;
			},
			/** 结束血压测量配对窗口；两侧都在则合并上报；仅心率则库缺失才补报；有血压无心率不空心率上报 */
			releaseBpw1AwaitingBpHrPair(uploadLeftoverHr) {
				const that = this;
				that.tryFlushBpw1LiveBpHrUpload(false);
				that.bpw1AwaitingBpHrPair = false;
				const leftover = that.bpw1PendingBpCompanionHr;
				const pendingBp = that.bpw1PendingLiveBp;
				if (that.bpw1LiveBpHrFlushTimer) {
					clearTimeout(that.bpw1LiveBpHrFlushTimer);
					that.bpw1LiveBpHrFlushTimer = null;
				}
				that.bpw1PendingLiveBp = null;
				that.bpw1PendingBpCompanionHr = null;
				that.clearBpw1LiveBpMeasureGate('释放血压心率配对窗口');
				if (pendingBp && leftover && that.isValidBpw1HeartRate(leftover.heartRate)) {
					// 血压测量后必有心率：释放时两侧都在则合并上报（不因时间窗丢弃）
					that.rememberBpw1BpHrPairUpload(pendingBp.ts, leftover);
					uni.getNetworkType({
						success: function(res) {
							if (res.networkType === 'none') {
								return;
							}
							that.jakoblife_fat_scale22(
								that.shoubiaomac,
								pendingBp.systolic,
								pendingBp.diastolic,
								leftover.heartRate,
								that.shoubiaosn,
								pendingBp.ts
							);
						}
					});
					return;
				}
				// 有血压无心率：不空心率上报血压
				if (pendingBp) {
					return;
				}
				if (!uploadLeftoverHr || !leftover || that.isBpw1HrCoveredByBpPair(leftover)) {
					return;
				}
				// 测心率/PPG 等仅有心率：库中没有才补报（无血压）
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							return;
						}
						that.uploadBpw1HeartRateMissingInDb(
							that.shoubiaomac,
							that.shoubiaosn, [leftover]
						);
					}
				});
			},
			/** 在 maxSkew 秒内为血压找最近有效心率；返回 { hr, key } 或 null */
			findNearestBpw1HrWithinOneSec(localHrRecords, bpTs, maxSkew = 2) {
				let best = null;
				let bestDiff = Infinity;
				let bestKey = '';
				const skewLimit = maxSkew == null ? 2 : Number(maxSkew);
				(localHrRecords || []).forEach(hr => {
					if (!hr || !this.isValidBpw1HeartRate(hr.heartRate)) {
						return;
					}
					const key = this.normalizeDateTimeKey(`${hr.date} ${hr.time}`);
					if (!key) {
						return;
					}
					const hrTs = this.datatime(key);
					const diff = Math.abs(Number(hrTs) - Number(bpTs));
					if (diff <= skewLimit && diff < bestDiff) {
						bestDiff = diff;
						best = hr;
						bestKey = key;
					}
				});
				return best ? {
					hr: best,
					key: bestKey
				} : null;
			},
			/**
			 * BPW1 实时血压+伴生心率合并上报：两侧到齐才上报一次；心率不可为空；已配对心率不再单独上报。
			 * 禁止在有血压缓存时退化为「只报心率」。
			 */
			tryFlushBpw1LiveBpHrUpload(force) {
				const that = this;
				const pending = that.bpw1PendingLiveBp;
				if (!pending) {
					return;
				}
				const companion = that.bpw1PendingBpCompanionHr;
				const hasValidHr = !!(companion && that.isValidBpw1HeartRate(companion
					.heartRate));
				const skew = (hasValidHr && companion.ts != null) ?
					Math.abs(Number(companion.ts) - Number(pending.ts)) : Infinity;
				const sameDeviceTime = !!(hasValidHr && pending.date && pending.time &&
					that.normalizeDateTimeKey(`${companion.date} ${companion.time}`) ===
					that.normalizeDateTimeKey(`${pending.date} ${pending.time}`));
				// 仅设备时间相同或差 ≤5 秒才合并；禁止放宽到 30 秒（会把旧心率错绑后干等）
				const canPair = !!(hasValidHr && (sameDeviceTime || skew <= 5));
				if (!canPair) {
					return;
				}
				if (that.bpw1LiveBpHrFlushTimer) {
					clearTimeout(that.bpw1LiveBpHrFlushTimer);
					that.bpw1LiveBpHrFlushTimer = null;
				}
				const wantPpg = pending.startPpgAfterBp === true;
				const requireBlewatchIdForYali = pending.requireBlewatchIdForYali !== false;
				that.bpw1PendingLiveBp = null;
				that.bpw1AwaitingBpHrPair = false;
				const hrValue = companion.heartRate;
				const pairedHr = companion;
				that.bpw1PendingBpCompanionHr = null;
				that.rememberBpw1BpHrPairUpload(pending.ts, pairedHr);
				// 已合并的伴生心率从缓存剔除，避免后续再走单独心率上报
				if (pairedHr) {
					const pairedKey = that.normalizeDateTimeKey(
						`${pairedHr.date} ${pairedHr.time}`);
					if (pairedKey) {
						that.hrResult = (that.hrResult || []).filter(item =>
							that.normalizeDateTimeKey(`${item.date} ${item.time}`) !==
							pairedKey
						);
					}
				}
				if (wantPpg || pending.startPpgAfterBp) {
					that.clearBpw1LiveBpMeasureGate('实时血压合并完成');
				} else if (that._bpw1LiveBpCmdAt) {
					that.clearBpw1LiveBpMeasureGate('实时血压合并完成(无PPG)');
				}
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							// 无网也启 PPG：手表侧血压已完成
							if (wantPpg) {
								const ok = that.tryStartBpw1PpgAfterBp('合并成功无网',
									requireBlewatchIdForYali);
								if (!ok) {
									that.applyEmotionButtonIdleByBind(
										'血压后PPG未启动-无网')
								}
							}
							return;
						}
						console.log('【BPW1】实时血压+心率合并上报', pending.ts, {
							bp: `${pending.systolic}/${pending.diastolic}`,
							hr: hrValue
						});
						that.jakoblife_fat_scale22(
							that.shoubiaomac,
							pending.systolic,
							pending.diastolic,
							hrValue,
							that.shoubiaosn,
							pending.ts
						);
						if (wantPpg) {
							const ok = that.tryStartBpw1PpgAfterBp('血压心率合并成功',
								requireBlewatchIdForYali);
							if (!ok) {
								that.applyEmotionButtonIdleByBind('血压后PPG未启动-合并成功')
							}
						}
					},
					fail: function(err) {
						console.error('获取网络类型失败：', err);
						if (wantPpg) {
							const ok = that.tryStartBpw1PpgAfterBp('合并成功网络失败',
								requireBlewatchIdForYali);
							if (!ok) {
								that.applyEmotionButtonIdleByBind('血压后PPG未启动-网络失败')
							}
						}
					}
				});
			},
			/** BPW1：记录本会话已上报心率，避免接口未回填前重复上报 */
			rememberBpw1HrUploadKey(key, hrTs) {
				if (!this.bpw1UploadedHrKeys) {
					this.bpw1UploadedHrKeys = new Set();
				}
				if (key) {
					this.bpw1UploadedHrKeys.add(String(key));
				}
				if (hrTs != null && hrTs !== '') {
					const tsNum = Number(hrTs);
					if (!Number.isNaN(tsNum)) {
						this.bpw1UploadedHrKeys.add(String(tsNum));
						try {
							const fk = this.formatTimestampKey(tsNum);
							if (fk) {
								this.bpw1UploadedHrKeys.add(fk);
							}
						} catch (e) {}
					}
				}
			},
			/** BPW1：本会话或服务端是否已有该心率 */
			isBpw1HrAlreadyKnown(key, hrTs, existingHrMap) {
				if (key && this.bpw1UploadedHrKeys && this.bpw1UploadedHrKeys.has(String(
						key))) {
					return true;
				}
				if (existingHrMap && key && existingHrMap.has(key)) {
					return true;
				}
				if (hrTs == null) {
					return false;
				}
				const tsNum = Number(hrTs);
				if (Number.isNaN(tsNum)) {
					return false;
				}
				for (const t of [tsNum - 2, tsNum - 1, tsNum, tsNum + 1, tsNum + 2]) {
					const tsKey = String(t);
					if (this.bpw1UploadedHrKeys && this.bpw1UploadedHrKeys.has(tsKey)) {
						return true;
					}
					if (existingHrMap && existingHrMap.has(tsKey)) {
						return true;
					}
					try {
						const fk = this.formatTimestampKey(t);
						if (fk) {
							if (this.bpw1UploadedHrKeys && this.bpw1UploadedHrKeys.has(fk)) {
								return true;
							}
							if (existingHrMap && existingHrMap.has(fk)) {
								return true;
							}
						}
					} catch (e) {}
				}
				return false;
			},
			/** BPW1：库中没有的心率全部上报（按测量时间去重；已并入血压的跳过） */
			async uploadBpw1HeartRateMissingInDb(deviceId, deviceSn, hrRecords, options = {}) {
				const that = this;
				if (!deviceSn || !Array.isArray(hrRecords) || hrRecords.length === 0) {
					return;
				}
				try {
					const snList = (that.deviceSnuserID && that.deviceSnuserID.length) ?
						that.deviceSnuserID : [deviceSn];
					await that.queryBloodPressureData(snList);
				} catch (e) {
					console.warn('【BPW1】拉取心率去重数据失败，仍尝试按已有缓存上报', e);
				}
				const existingHrMap = that.getExistingHeartRateMap();
				const uploadedKeys = new Set();
				// 历史上报正序：旧→新
				const list = [...hrRecords].sort((a, b) =>
					that.datatime(`${a.date} ${a.time}`) - that.datatime(
						`${b.date} ${b.time}`)
				);
				for (const hr of list) {
					if (!hr || !that.isValidBpw1HeartRate(hr.heartRate)) {
						continue;
					}
					const key = that.normalizeDateTimeKey(`${hr.date} ${hr.time}`);
					if (!key || uploadedKeys.has(key)) {
						continue;
					}
					// 已随血压合并上报的心率不再单独上传
					if (that.isBpw1HrCoveredByBpPair(key) || that.isBpw1HrConsumedByBp(
							key)) {
						console.log('【BPW1】心率已随血压合并上报，跳过', key, hr.heartRate);
						continue;
					}
					let hrTs;
					try {
						hrTs = that.datatime(key);
					} catch (e) {
						hrTs = null;
					}
					if (that.isBpw1HrAlreadyKnown(key, hrTs, existingHrMap)) {
						// console.log('【BPW1】心率已存在(接口/本会话)，跳过', key, hr.heartRate);
						continue;
					}
					uploadedKeys.add(key);
					existingHrMap.set(key, hr.heartRate);
					that.rememberBpw1HrUploadKey(key, hrTs);
					console.log('【BPW1】上报库中缺失心率', key, hr.heartRate);
					await that.Watch_Historical_data(
						deviceId,
						'',
						'',
						hr.heartRate,
						deviceSn,
						hrTs != null ? hrTs : that.datatime(key)
					);
					await new Promise(r => setTimeout(r, 10));
				}
			},
			ensureBpw6ServerHistoryLoaded(deviceSn) {
				if (!deviceSn) {
					return Promise.resolve(false)
				}
				return this.queryBloodPressureData([deviceSn]).then((res) => {
					return !!(res && res.code === 200)
				}).catch(() => false)
			},
			async uploadBPW6BpHistoryWithDeduplication(deviceId, deviceSn) {
				const that = this;
				try {
					await that.ensureBpw6ServerHistoryLoaded(deviceSn);
				} catch (e) {
					console.warn('【BPW6】拉取血压去重数据失败，仍尝试按已有缓存上报', e);
				}
				const existingTimes = that.getExistingBloodPressureTimeSet();
				// 正序上报：旧→新（如 18:00 再 18:03）
				const localBpRecords = [...that.bpw6BpBuffer].sort((a, b) => {
					const ta = a.timestamp != null ? Number(a.timestamp) : that
						.datatime(a.dateTimeKey);
					const tb = b.timestamp != null ? Number(b.timestamp) : that
						.datatime(b.dateTimeKey);
					return ta - tb;
				});
				const uploadedKeys = new Set();

				for (const bp of localBpRecords) {
					const key = that.normalizeDateTimeKey(bp.dateTimeKey);
					if (!key || uploadedKeys.has(key)) {
						continue;
					}
					// 去重只按 date.formatted，勿用 timestamp 分钟槽（易与 measurementTs 冲突导致测完不上报）
					if (that.isBpw6SlotInServerSet(existingTimes, bp.dateTimeKey,
							null)) {
						// console.log('【BPW6】血压槽位已存在，跳过', key);
						continue;
					}
					uploadedKeys.add(key);
					const uploadTs = that.normalizeUnixTimestamp(bp.timestamp);
					console.log('【BPW6】上传BPW6血压(库中无此槽位)', key, {
						bp: `${bp.highPressure}/${bp.lowPressure}`,
						hr: bp.heartRate,
						time: uploadTs != null ? uploadTs : that.datatime(key)
					});
					// 上报 time 优先用设备 timestamp
					await that.Watch_Historical_data(
						deviceId,
						bp.highPressure,
						bp.lowPressure,
						bp.heartRate,
						deviceSn,
						uploadTs != null ? uploadTs : that.datatime(key)
					);
					await new Promise(r => setTimeout(r, 10));
					that.getBpw6SlotMatchKeys(bp.dateTimeKey, null).forEach(k =>
						existingTimes.add(k));
				}
				that.bpw6BpBuffer = [];
			},
			/** BPW6 心率槽位键（按分钟对齐） */
			getBpw6HrSlotKey(dateTimeKey, timestamp) {
				const tsNum = this.normalizeUnixTimestamp(timestamp);
				if (tsNum != null) {
					return String(Math.floor(tsNum / 60) * 60);
				}
				const nk = this.normalizeDateTimeKey(dateTimeKey);
				if (!nk) {
					return '';
				}
				try {
					const t = Number(this.datatime(nk));
					if (!Number.isNaN(t) && t > 0) {
						return String(Math.floor(t / 60) * 60);
					}
				} catch (e) {}
				return nk;
			},
			/**
			 * BPW6 心率按槽位上报：每次先查服务器；
			 * - 同槽位 + 同值（服务器或本会话已报）→ 跳过，不重复上报
			 * - 同槽位 + 不同值 → 必须上报
			 * - 服务器无此槽 → 上报
			 * 不影响 BPW1 / 其它设备。
			 */
			async uploadBPW6HrHistoryWithDeduplication(deviceId, deviceSn) {
				const that = this;
				try {
					await that.ensureBpw6ServerHistoryLoaded(deviceSn);
				} catch (e) {
					console.warn('【BPW6】拉取心率去重数据失败，仍尝试按已有缓存上报', e);
				}
				const existingHrMap = that.getExistingHeartRateMap();
				if (!that.bpw6UploadedHrSlotValue) {
					that.bpw6UploadedHrSlotValue = new Map();
				}
				const localHrRecords = [...that.bpw6HrBuffer].sort((a, b) => {
					const ta = a.timestamp != null ? Number(a.timestamp) :
						that.datatime(a.dateTimeKey);
					const tb = b.timestamp != null ? Number(b.timestamp) :
						that.datatime(b.dateTimeKey);
					return ta - tb;
				});
				const localHrMap = new Map();
				localHrRecords.forEach(hr => {
					const normalizedKey = that.normalizeDateTimeKey(hr
						.dateTimeKey);
					if (normalizedKey) {
						localHrMap.set(normalizedKey, hr);
					}
				});
				// 历史上报正序：旧→新（建 Map 仍正序，同键保留较新）
				const sortedKeys = [...localHrMap.keys()].sort((a, b) =>
					that.datatime(a) - that.datatime(b)
				);
				const uploadedKeys = new Set();

				for (const key of sortedKeys) {
					const hr = localHrMap.get(key);
					if (!hr || hr.heartRate == null || hr.heartRate === '') {
						continue;
					}
					if (uploadedKeys.has(key)) {
						continue;
					}
					const slotKey = that.getBpw6HrSlotKey(hr.dateTimeKey, hr
						.timestamp) || key;
					const serverHr = that.findExistingBpw6HrAtSlot(existingHrMap,
						hr);
					const sessionHr = that.bpw6UploadedHrSlotValue.get(slotKey);
					// 同槽同值：服务器已有 或 本会话刚报过 → 不重复上报
					if (serverHr !== undefined && String(serverHr) === String(hr
							.heartRate)) {
						that.bpw6UploadedHrSlotValue.set(slotKey, hr.heartRate);
						continue;
					}
					if (sessionHr !== undefined && String(sessionHr) === String(hr
							.heartRate)) {
						continue;
					}
					// 同槽不同值，或服务器无此槽 → 上报
					// 先占位会话槽，避免 progressive/finalize 并发时同值打两遍
					that.bpw6UploadedHrSlotValue.set(slotKey, hr.heartRate);
					uploadedKeys.add(key);
					console.log('【BPW6】上传BPW6心率(无槽位/同槽值变化):', key, {
						hr: hr.heartRate,
						serverHr: serverHr !== undefined ? serverHr : null,
						sessionHr: sessionHr !== undefined ? sessionHr : null
					});
					try {
						await that.Watch_Historical_data(
							deviceId,
							'',
							'',
							hr.heartRate,
							deviceSn,
							that.datatime(key)
						);
						that.getBpw6SlotMatchKeys(hr.dateTimeKey, hr.timestamp)
							.forEach(k => {
								existingHrMap.set(k, hr.heartRate);
							});
						await new Promise(r => setTimeout(r, 10));
					} catch (uploadErr) {
						that.bpw6UploadedHrSlotValue.delete(slotKey);
						uploadedKeys.delete(key);
						throw uploadErr;
					}
				}
				that.bpw6HrBuffer = [];
			},
			// 从服务器血氧数据中提取已有时间集合
			getExistingOxygenTimeSet() {
				const existingTimes = new Set();
				const serverData = this.boolserverOxygenData;
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								existingTimes.add(
									`${item.dateTime} ${detail.time}`
								);
							});
						}
					});
				}
				return existingTimes;
			},
			// 血氧数据查询
			queryOxygenData(deviceSn) {
				let endTime = this.getTimeAllJSON().YMD + " 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() - 30)
				let startTime = minusOneWeek.toISOString().replace('T', ' ')
					.substring(0, 10) + " 00:00:00"
				let data = {
					deviceSn,
					dataType: "pressure",
					slaveList: [{
						slaveSn: "0",
						register: "oxygen"
					}],
					startTime: startTime,
					endTime: endTime,
				};
				return this.$post(this.$url_APP_IP + this.$url_query_log_v2,
					data, {
						'Authorization': 'Bearer ' + uni.getStorageSync(
							"token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((queryOxygenDatares) => {
					if (queryOxygenDatares.code === 200 &&
						queryOxygenDatares.data &&
						Array.isArray(queryOxygenDatares.data) &&
						queryOxygenDatares.data.length > 0) {
						this.boolserverOxygenData = queryOxygenDatares
					}
					return queryOxygenDatares
				})
			},
			normalizeUnixTimestamp(timestamp) {
				if (timestamp == null || timestamp === '') {
					return null;
				}
				const tsNum = Number(timestamp);
				if (Number.isNaN(tsNum)) {
					return null;
				}
				return tsNum > 9999999999 ? Math.floor(tsNum / 1000) : Math.floor(
					tsNum);
			},
			buildOxygenTimeKey(timestamp) {
				return this.formatTimestampKey(timestamp);
			},
			getSpO2OxygenValue(detail) {
				if (!detail) {
					return null;
				}
				const oxygenVal = detail.oxygen ?? detail.Oxygen ?? detail.spo2 ??
					detail.SpO2;
				if (oxygenVal == null || oxygenVal === '') {
					return null;
				}
				return oxygenVal;
			},
			getOxygenMatchKeys(item) {
				const keys = [];
				const normalizedKey = this.normalizeDateTimeKey(item.dateTimeKey);
				if (normalizedKey) {
					keys.push(normalizedKey);
					keys.push(String(this.datatime(normalizedKey)));
				}
				const tsNum = this.normalizeUnixTimestamp(item.timestamp);
				if (tsNum != null) {
					keys.push(String(tsNum));
					keys.push(this.formatTimestampKey(tsNum));
				}
				return keys;
			},
			addOxygenToMap(existingOxygenMap, mapKey, oxygenVal) {
				if (mapKey != null && mapKey !== '') {
					existingOxygenMap.set(String(mapKey), oxygenVal);
				}
			},
			normalizeDateTimeKey(dateTimeKey) {
				if (!dateTimeKey) {
					return '';
				}
				if (dateTimeKey instanceof Date) {
					return this.formatTimestampKey(Math.floor(dateTimeKey
						.getTime() / 1000));
				}
				const trimmed = String(dateTimeKey).trim();
				if (/^[A-Za-z]{3}\s/.test(trimmed)) {
					const ts = Math.floor(new Date(trimmed).getTime() / 1000);
					if (!Number.isNaN(ts)) {
						return this.formatTimestampKey(ts);
					}
				}
				const spaceIdx = trimmed.indexOf(' ');
				if (spaceIdx === -1) {
					return trimmed;
				}
				const datePart = trimmed.slice(0, spaceIdx);
				const timePart = trimmed.slice(spaceIdx + 1);
				const segments = timePart.split(':');
				const h = (segments[0] || '00').padStart(2, '0');
				const m = (segments[1] || '00').padStart(2, '0');
				const s = (segments[2] || '00').padStart(2, '0');
				return `${datePart} ${h}:${m}:${s}`;
			},
			getExistingOxygenMap() {
				const existingOxygenMap = new Map();
				const serverData = this.boolserverOxygenData;
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								if (detail.oxygen == null || detail
									.oxygen === '') {
									return;
								}
								const setOxygen = (mapKey) => {
									if (mapKey) {
										existingOxygenMap.set(
											mapKey, detail
											.oxygen);
									}
								};
								if (detail.timestamp != null &&
									detail.timestamp !== '') {
									const tsNum = Number(detail
										.timestamp);
									if (!Number.isNaN(tsNum)) {
										setOxygen(String(tsNum));
										setOxygen(this
											.buildOxygenTimeKey(
												tsNum));
									}
								}
								if (item.dateTime && detail.time) {
									setOxygen(this
										.normalizeDateTimeKey(
											`${item.dateTime} ${detail.time}`
										));
								}
							});
						}
					});
				}
				return existingOxygenMap;
			},
			shouldSkipOxygenUpload(item, existingOxygenMap) {
				for (const key of this.getOxygenMatchKeys(item)) {
					const serverO2 = existingOxygenMap.get(String(key));
					if (serverO2 !== undefined && String(serverO2) === String(item
							.spO2)) {
						return true;
					}
				}
				return false;
			},
			/** BPW6 血氧：仅按设备槽位键匹配服务器同值（不用上报用的手机本地时间比新旧） */
			shouldSkipBpw6SpO2BySlot(item, existingOxygenMap) {
				if (!item || !existingOxygenMap) {
					return false;
				}
				for (const key of this.getBpw6SlotMatchKeys(item.dateTimeKey, item
						.timestamp)) {
					const serverO2 = existingOxygenMap.get(String(key));
					if (serverO2 !== undefined && String(serverO2) === String(item
							.spO2)) {
						return true;
					}
				}
				return this.shouldSkipOxygenUpload(item, existingOxygenMap);
			},
			async fetchExistingOxygenMap(deviceSn) {
				const existingOxygenMap = new Map();
				const mergeMap = (sourceMap) => {
					sourceMap.forEach((value, key) => {
						existingOxygenMap.set(key, value);
					});
				};
				await this.queryOxygenData([deviceSn]);
				mergeMap(this.getExistingOxygenMap());
				if (this.deviceSnuserID && this.deviceSnuserID.length > 0) {
					await this.queryOxygenData(this.deviceSnuserID);
					mergeMap(this.getExistingOxygenMap());
				}
				return existingOxygenMap;
			},
			/**
			 * BPW6 血氧实时测量上报：每次实时读只报最新一条，time 用手机本地时间。
			 * 同一次读的防重复由 realtimeSeq 处理；不做服务器同槽同值跳过（保证每次测量都能报）。
			 */
			async uploadBPW6RealtimeSpO2(deviceId, deviceSn) {
				const that = this;
				const item = (that.bpw6SpO2Buffer && that.bpw6SpO2Buffer[
					0]) || null;
				that.bpw6SpO2Buffer = [];
				if (!item || item.spO2 == null || item.spO2 === '') {
					return;
				}
				console.log('【BPW6】实时血氧上报，手机本地时间', {
					spO2: item.spO2,
					slot: item.dateTimeKey || item.timestamp
				});
				await that.jakoblife_fat_scale3(
					deviceId,
					item.spO2,
					deviceSn,
					'血氧',
					''
				);
				if (!that.bpw6UploadedSpO2SlotValue) {
					that.bpw6UploadedSpO2SlotValue = new Map();
				}
				const slotKey = that.getBpw6HrSlotKey(item.dateTimeKey,
						item.timestamp) ||
					that.normalizeDateTimeKey(item.dateTimeKey) ||
					that.formatTimestampKey(item.timestamp);
				if (slotKey) {
					that.bpw6UploadedSpO2SlotValue.set(slotKey, item.spO2);
				}
			},
			/**
			 * BPW6 血氧按设备槽位上报（兼容保留；实时路径改用 uploadBPW6RealtimeSpO2）：
			 * - 上报 time 固定手机本地时间
			 * - 先查服务器；同槽同值（服务器或本会话）跳过，不重复报
			 * - 同槽不同值 / 新槽位 → 上报（不因接口本地时间“更新”而误跳过）
			 */
			async uploadBPW6SpO2WithSlotDedup(deviceId, deviceSn) {
				const that = this;
				try {
					const snList = (that.deviceSnuserID && that
							.deviceSnuserID.length) ?
						that.deviceSnuserID : [deviceSn];
					await that.queryOxygenData(snList);
				} catch (e) {
					console.warn('【BPW6】拉取血氧去重数据失败，仍按本会话去重上报', e);
				}
				const existingOxygenMap = that.getExistingOxygenMap();
				if (!that.bpw6UploadedSpO2SlotValue) {
					that.bpw6UploadedSpO2SlotValue = new Map();
				}
				const localSpO2Records = [...that.bpw6SpO2Buffer].sort(
					(a, b) => {
						const ta = a.timestamp != null ? Number(a
							.timestamp) : that.datatime(a
							.dateTimeKey);
						const tb = b.timestamp != null ? Number(b
							.timestamp) : that.datatime(b
							.dateTimeKey);
						return ta - tb;
					});
				// 同设备槽位只保留最后一条（最新值）
				const slotItemMap = new Map();
				localSpO2Records.forEach(item => {
					const slotKey = that.getBpw6HrSlotKey(item
							.dateTimeKey, item.timestamp) ||
						that.normalizeDateTimeKey(item
							.dateTimeKey) ||
						that.formatTimestampKey(item
							.timestamp);
					if (!slotKey) {
						return;
					}
					slotItemMap.set(slotKey, item);
				});
				// 历史上报正序：旧槽位→新槽位（建 Map 仍正序，同槽保留较新）
				const sortedSlots = [...slotItemMap.keys()].sort((a,
					b) => Number(a) - Number(b));
				for (const slotKey of sortedSlots) {
					const item = slotItemMap.get(slotKey);
					if (!item || item.spO2 == null || item.spO2 ===
						'') {
						continue;
					}
					const sessionVal = that.bpw6UploadedSpO2SlotValue
						.get(slotKey);
					if (sessionVal !== undefined && String(
							sessionVal) === String(item.spO2)) {
						console.log('【BPW6】血氧本会话同槽同值已上报，跳过', slotKey,
							item.spO2);
						continue;
					}
					if (that.shouldSkipBpw6SpO2BySlot(item,
							existingOxygenMap)) {
						console.log('【BPW6】血氧服务器同槽同值，跳过', slotKey, item
							.spO2);
						that.bpw6UploadedSpO2SlotValue.set(slotKey,
							item.spO2);
						continue;
					}
					console.log('【BPW6】上传血氧(新槽/同槽值变)，手机本地时间',
						slotKey, {
							spO2: item.spO2,
							sessionVal: sessionVal !== undefined ?
								sessionVal : null
						});
					await that.jakoblife_fat_scale3(
						deviceId,
						item.spO2,
						deviceSn,
						'血氧',
						''
					);
					that.bpw6UploadedSpO2SlotValue.set(slotKey, item
						.spO2);
					that.getBpw6SlotMatchKeys(item.dateTimeKey, item
						.timestamp).forEach(k => {
						existingOxygenMap.set(String(k), item
							.spO2);
					});
				}
				that.bpw6SpO2Buffer = [];
			},
			// 保留旧名调用兼容（内部转槽位去重 + 本地时间）
			async uploadBPW6SpO2HistoryWithDeduplication(deviceId,
				deviceSn) {
				return this.uploadBPW6SpO2WithSlotDedup(deviceId,
					deviceSn);
			},
			/**
			 * BPW1 历史：N 条血压必有 N 条可匹配心率；多出的心率来自单独测心率/PPG。
			 * 先精确时间配对，再按时间差全局贪心唯一配对；剩余心率交给单独补报。
			 * 仅用于历史合并，不影响实时血压配对。
			 */
			pairBpw1HistoryBpWithHr(localBpRecords, localHrRecords,
				maxSkew = 30) {
				const that = this;
				const skewLimit = maxSkew == null ? 30 : Number(
					maxSkew);
				const bpItems = [];
				(localBpRecords || []).forEach(bp => {
					const key = that.normalizeDateTimeKey(
						`${bp.date} ${bp.time}`);
					if (!key) return;
					const ts = that.datatime(key);
					if (ts == null || Number.isNaN(Number(
							ts))) return;
					bpItems.push({
						bp,
						key,
						ts: Number(ts)
					});
				});
				const hrItems = [];
				const hrUsed = new Set();
				(localHrRecords || []).forEach(hr => {
					if (!hr || !that.isValidBpw1HeartRate(
							hr.heartRate)) return;
					const key = that.normalizeDateTimeKey(
						`${hr.date} ${hr.time}`);
					if (!key) return;
					const ts = that.datatime(key);
					if (ts == null || Number.isNaN(Number(
							ts))) return;
					hrItems.push({
						hr,
						key,
						ts: Number(ts)
					});
				});
				const pairs = [];
				const bpUsed = new Set();
				// 1) 精确同一测量时间优先（血压伴生心率）
				bpItems.forEach(bi => {
					if (bpUsed.has(bi.key)) return;
					const exact = hrItems.find(hi => !
						hrUsed.has(hi.key) && hi
						.key === bi.key);
					if (!exact) return;
					bpUsed.add(bi.key);
					hrUsed.add(exact.key);
					pairs.push({
						bp: bi.bp,
						bpKey: bi.key,
						bpTs: bi.ts,
						hr: exact.hr,
						hrKey: exact.key,
						skew: 0
					});
				});
				// 2) 剩余血压：全局按时间差最小唯一配对（避免一条心率被多条血压抢走）
				const candidates = [];
				bpItems.forEach(bi => {
					if (bpUsed.has(bi.key)) return;
					hrItems.forEach(hi => {
						if (hrUsed.has(hi.key))
							return;
						const skew = Math.abs(hi
							.ts - bi.ts);
						if (skew <= skewLimit) {
							candidates.push({
								bi,
								hi,
								skew
							});
						}
					});
				});
				candidates.sort((a, b) => a.skew - b.skew || a.bi
					.ts - b.bi.ts);
				candidates.forEach(c => {
					if (bpUsed.has(c.bi.key) || hrUsed.has(
							c.hi.key)) return;
					bpUsed.add(c.bi.key);
					hrUsed.add(c.hi.key);
					pairs.push({
						bp: c.bi.bp,
						bpKey: c.bi.key,
						bpTs: c.bi.ts,
						hr: c.hi.hr,
						hrKey: c.hi.key,
						skew: c.skew
					});
				});
				const leftoverHr = hrItems.filter(hi => !hrUsed
					.has(hi.key)).map(hi => hi.hr);
				const unmatchedBp = bpItems.filter(bi => !bpUsed
					.has(bi.key));
				return {
					pairs,
					leftoverHr,
					unmatchedBp
				};
			},
			async mergeAndUploadWithDeduplication(localHrRecords,
				localBpRecords) {
				const that = this;
				try {
					const needQuery = !that
						._bpw1HistoryDedupQueriedAt ||
						(Date.now() - that
							._bpw1HistoryDedupQueriedAt > 60000
						);
					if (needQuery) {
						const snList = (that.deviceSnuserID &&
								that.deviceSnuserID.length) ?
							that.deviceSnuserID :
							(that.shoubiaosn ? [that
								.shoubiaosn
							] : []);
						if (snList.length > 0) {
							await that.queryBloodPressureData(
								snList);
							that._bpw1HistoryDedupQueriedAt =
								Date.now();
						}
					}
				} catch (e) {
					console.warn(
						'【BPW1】历史合并前拉取去重数据失败，仍按已有缓存上报', e);
				}
				const existingTimes = that
					.getExistingBloodPressureTimeSet();
				const bpList = [...(localBpRecords || [])];
				const hrList = [...(localHrRecords || [])];
				const matchedHrKeys = new Set();
				const uploadedBpKeys = new Set();
				const skippedBpKeys = new Set();
				// 先过滤服务端/本轮已有血压，再做 N:N 唯一配对（多出的心率留给单独测/PPG）
				const pendingBp = bpList.filter(bp => {
					const key = that
						.normalizeDateTimeKey(
							`${bp.date} ${bp.time}`);
					if (!key) return false;
					const bpTs = that.datatime(key);
					if (existingTimes.has(key) ||
						uploadedBpKeys.has(key) ||
						(that.bpw1HrConsumedByBpKeys &&
							(
								that
								.bpw1HrConsumedByBpKeys
								.has(key) ||
								that
								.bpw1HrConsumedByBpKeys
								.has(String(bpTs))
							))) {
						skippedBpKeys.add(key);
						return false;
					}
					return true;
				});
				const {
					pairs,
					leftoverHr,
					unmatchedBp
				} = that.pairBpw1HistoryBpWithHr(pendingBp,
					hrList, 30);
				// 历史上报正序：旧→新（仅改上报顺序，不影响配对结果）
				const uploadPairs = [...(pairs || [])].sort((a,
						b) =>
					Number(a.bpTs) - Number(b.bpTs)
				);
				for (const p of uploadPairs) {
					matchedHrKeys.add(p.hrKey);
					uploadedBpKeys.add(p.bpKey);
					that.rememberBpw1BpHrPairUpload(p.bpTs, p
						.hr);
					console.log('【BPW1】上传血压+心率:', p.bpKey, {
						bp: `${p.bp.highPressure}/${p.bp.lowPressure}`,
						hr: p.hr.heartRate,
						hrKey: p.hrKey,
						skew: p.skew
					});
					await that.Watch_Historical_data(
						that.shoubiaomac,
						p.bp.highPressure,
						p.bp.lowPressure,
						p.hr.heartRate,
						that.shoubiaosn,
						p.bpTs
					);
					await new Promise(r => setTimeout(r, 10));
				}
				(unmatchedBp || []).forEach(bi => {
					// console.warn('【BPW1】历史血压无匹配心率，跳过（避免分报/空心率）:', bi.key);
				});
				// 同步清理：已上报 / 服务端已有。未配对血压保留，供后续心率包再配对；结束同步时统一清空
				if (uploadedBpKeys.size > 0 || matchedHrKeys
					.size > 0 || skippedBpKeys.size > 0) {
					that.bpResult = (that.bpResult || [])
						.filter(item => {
							const key = that
								.normalizeDateTimeKey(
									`${item.date} ${item.time}`
								);
							return !(key && (uploadedBpKeys
								.has(key) ||
								skippedBpKeys.has(
									key)));
						});
					that.hrResult = (that.hrResult || [])
						.filter(item =>
							!matchedHrKeys.has(that
								.normalizeDateTimeKey(
									`${item.date} ${item.time}`
								))
						);
				}

				// 多出的心率（单独测心率/PPG）：仅跳过已精确并入血压的，库中没有才补报
				const extraHr = (leftoverHr || []).filter(
					hr => {
						const key = that
							.normalizeDateTimeKey(
								`${hr.date} ${hr.time}`);
						return !!(key && !matchedHrKeys
							.has(key) && !that
							.isBpw1HrConsumedByBp(key));
					});
				if (extraHr.length > 0) {
					that.uploadBpw1HeartRateMissingInDb(
						that.shoubiaomac,
						that.shoubiaosn,
						extraHr
					);
				}
			},
			// 血压数据查询
			queryBloodPressureData(deviceSn) {
				let endTime = this.getTimeAllJSON().YMD +
					" 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() -
					30) // 两周
				let startTime = minusOneWeek.toISOString()
					.replace('T', ' ').substring(0, 10) +
					" 00:00:00"
				let data = {
					deviceSn,
					dataType: "pressure",
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
							register: "heartrate"
						}
					],
					startTime: startTime,
					endTime: endTime,
				};
				return this.$post(this.$url_APP_IP + this
					.$url_query_log_v2, data, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((
					queryBloodPressureDatares) => {
					if (queryBloodPressureDatares
						.code === 200) {
						this.boolserverData =
							queryBloodPressureDatares
					}
					return queryBloodPressureDatares
				})
			},
			//通用时间（跟随设备时区，改时区后实时生效）
			getTimeAllJSON() {
				return getLocalTimeAllJSON()
			},
			/** UTC 时间戳（上报 measurementTs 用） */
			UTCdatatime() {
				return {
					timestampMs: Date.now(),
					timestampSec: Math.floor(Date.now() / 1000)
				};
			},
			/** 系统时区变更后刷新依赖日期的数据 */
			refreshOnTimezoneChange() {
				if (!checkTimezoneChanged()) {
					return
				}
				clearDailyGoalData()
				this.today_Daily_Goal = uni.getStorageSync(
					"today_Daily_Goal") || "0"
				if (uni.getStorageSync("token")) {
					this.getUserInfo()
				}
			},
			// BPW1PPG原始波形数据存储 
			ppgdata(rawData, deviceSn, deviceId) {
				// Status02 已恢复按钮；此处仅负责上传与拉分析结果，勿再把按钮置灰
				const wasImmediate = this
					.immediateEmotionMeasure === true
				const showCloudComputingLoading = this
					.QX_HIDE && wasImmediate
				this.immediateEmotionMeasure = false
				this.yalixueyatype = false
				this.bpw1PpgTransferActive = false
				this.sleep_alertid = 0
				let data = {
					patientId: uni.getStorageSync(
						"userid"), //患者ID
					deviceSn: deviceSn, //设备sn
					deviceModel: "BPW1", //设备型号
					samplingRate: 100, //采样率(Hz)手表5.8.5版本改成100hz，手表5.8.2是25hz
					startTime: this.getTimeAllJSON()
						.YMDHMS, // payload.duration, 采集开始时间(微秒精度)
					dataFormat: "INT16", //数据编码格式
					signalRange: 0, //信号强度范围
					rawData: rawData, //二进制PPG波形数据
					dataLength: "", //自动计算采样点数
					signalType: "GREEN", //PPG信号类型
					ledCurrent: 0, //LED驱动电流(mA)
					ambientLight: 0, //环境光强度
					motionLevel: 0,
					qualityScore: 0,
					qualityVersion: 0,
					processingStatus: "RAW",
					measurementTs: this.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				// console.log("data", data)
				this.$post(this.$url_APP_IP +
					"/prod-api/device/ppgdata", data, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgdatares) => {
					// console.log("ppgdatares", ppgdatares)
					if (ppgdatares.code === 200) {
						if (
							showCloudComputingLoading
						) {
							uni.showLoading({
								title: this.$t(
									"云端数据计算中"
								),
								mask: true
							})
							if (this
								._bpw1CloudLoadingTimer
							) {
								clearTimeout(this
									._bpw1CloudLoadingTimer
								)
							}
							this._bpw1CloudLoadingTimer =
								setTimeout(() => {
									this._bpw1CloudLoadingTimer =
										null
									try {
										uni.hideLoading()
									} catch (e) {}
									// 仅清 loading；按钮在采集结束时已恢复
									this.applyEmotionButtonIdleByBind(
										'BPW1云端计算等待结束'
									)
								}, 60 * 1000)
						}
						this.deviceppgdatalist(
							deviceSn, deviceId, {
								bpw1Poll: true,
								startedAt: Date
									.now()
							})
					} else {
						try {
							uni.hideLoading()
						} catch (e2) {}
						this.restoreEmotionPageButtons(
							'BPW1 PPG上传业务失败')
					}
				}).catch((err) => {
					console.error('BPW1 PPG上传失败', err)
					try {
						uni.hideLoading()
					} catch (e3) {}
					this.restoreEmotionPageButtons(
						'BPW1 PPG上传失败')
				})
			},
			//查询PPG原始波形数据存储列表
			deviceppgdatalist(deviceSn, deviceId,
				pollOpts = {}) {
				let that = this
				// 仅 BPW6 立即测量才保灰/弹云端 loading；BPW1 不得走 markBpw6 否则会卡灰
				const keepImmediateForCloud = that
					.isBpw6EmotionImmediateUi() ||
					(that.bpw6EmotionPpgActive === true && that
						.bpw6EmotionPpgPhase === 'transferring'
					)
				const bpw1Poll = pollOpts.bpw1Poll === true ||
					(!keepImmediateForCloud && !that
						.isBpw6EmotionImmediateUi())
				const pollStartedAt = pollOpts.startedAt ||
					Date.now()
				const pollAttempt = pollOpts.attempt || 0
				const BPW1_POLL_MAX = 45
				const BPW1_POLL_MAX_MS = 90 * 1000
				let dataparin = {
					patientId: uni.getStorageSync(
						"userid"), //患者ID
					startTime: that.getTimeAllJSON().YMD +
						" 00:00:00",
					endTime: that.getTimeAllJSON().YMD +
						" 23:59:59",
				}
				that.$get(that.$url_APP_IP +
					"/prod-api/device/ppgdata/list",
					dataparin, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((deviceppgdatalist) => {
					// console.log("deviceppgdatalist", deviceppgdatalist)
					// BPW6 立即测量：后台也提示失败弹窗；其他仍仅前台提示（不改 BPW1/定时/血压后）
					const showCloudComputingLoading =
						keepImmediateForCloud && (
							that
							.isBpw6EmotionImmediateUi() ||
							that
							.bpw6EmotionPpgPhase ===
							'transferring' ||
							that.QX_HIDE
						)
					const rows = (deviceppgdatalist &&
						deviceppgdatalist.rows) || []
					const scheduleBpw1Retry = () => {
						if (!bpw1Poll) {
							setTimeout(() => {
								that.deviceppgdatalist(
									deviceSn,
									deviceId,
									pollOpts
								)
							}, 1000)
							return
						}
						if (pollAttempt + 1 >=
							BPW1_POLL_MAX || Date
							.now() -
							pollStartedAt >=
							BPW1_POLL_MAX_MS) {
							console.warn(
								'【BPW1】PPG分析结果轮询超时，恢复按钮'
							)
							try {
								uni.hideLoading()
							} catch (e) {}
							if (that
								._bpw1CloudLoadingTimer
							) {
								clearTimeout(that
									._bpw1CloudLoadingTimer
								)
								that._bpw1CloudLoadingTimer =
									null
							}
							that.restoreEmotionPageButtons(
								'BPW1 PPG分析超时')
							return
						}
						setTimeout(() => {
							that.deviceppgdatalist(
								deviceSn,
								deviceId, {
									bpw1Poll: true,
									startedAt: pollStartedAt,
									attempt: pollAttempt +
										1
								})
						}, 2000)
					}
					if (deviceppgdatalist.code ===
						200 && rows.length > 0) {
						// 用 rows 末条，勿用 total-1（分页时会越界抛错 → catch 误恢复按钮）
						let latestRow = rows[rows
							.length - 1]
						if ((keepImmediateForCloud ||
								bpw1Poll) &&
							deviceSn) {
							const matched = [...rows]
								.reverse().find((r) =>
									r &&
									String(r
										.deviceSn || ''
									) === String(
										deviceSn))
							if (matched) latestRow =
								matched
						}
						const status = latestRow &&
							latestRow.processingStatus
						// 立即测量云端等待：忽略本次上传前的旧 ANALYZED，避免秒关「云端计算中」
						if (keepImmediateForCloud &&
							that
							.bpw6CloudWaitStartedAt >
							0 && latestRow) {
							const rowTs = that
								.parsePpgRowTimeMs(
									latestRow)
							if (rowTs > 0 && rowTs <
								that
								.bpw6CloudWaitStartedAt -
								5000) {
								that.setBpw6EmotionPpgPhase(
									'transferring')
								that.markBpw6PpgSessionBusy(
									'BPW6云端计算等待新记录'
								)
								that.showBpw6PpgLoading(
									'云端数据计算中')
								setTimeout(() => {
									that.deviceppgdatalist(
										deviceSn,
										deviceId,
										pollOpts
									)
								}, 1000)
								return
							}
						}
						switch (status) {
							case "ANALYZED":
								uni.hideLoading();
								if (that
									._bpw1CloudLoadingTimer
								) {
									clearTimeout(that
										._bpw1CloudLoadingTimer
									)
									that._bpw1CloudLoadingTimer =
										null
								}
								that.bpw6NeedClearLoadingOnShow =
									true
								that.restoreEmotionPageButtons(
									'PPG分析结果ANALYZED'
								)
								that.ppgdatalist(
									deviceSn,
									deviceId)
								break;
							case "LOW_QUALITY":
								uni.hideLoading();
								if (that
									._bpw1CloudLoadingTimer
								) {
									clearTimeout(that
										._bpw1CloudLoadingTimer
									)
									that._bpw1CloudLoadingTimer =
										null
								}
								that.immediateEmotionMeasure =
									false
								if (
									showCloudComputingLoading
								) {
									uni.showModal({
										content: that
											.$t(
												"波形质量不足峰值无法可靠分析"
											),
										confirmText: that
											.$t(
												'确定'
											),
										showCancel: false,
										success(
											modal
										) {
											if (modal
												.confirm
											) {
												that.restoreEmotionPageButtons(
													'PPG LOW_QUALITY确认'
												)
											}
										}
									})
								} else {
									that.restoreEmotionPageButtons(
										'PPG LOW_QUALITY'
									)
								}
								console.log(
									"PPG 波形质量不足、峰值/RR 间期不足，无法可靠分析"
								)
								break;
							case "INVALID_DATA":
								uni.hideLoading();
								if (that
									._bpw1CloudLoadingTimer
								) {
									clearTimeout(that
										._bpw1CloudLoadingTimer
									)
									that._bpw1CloudLoadingTimer =
										null
								}
								that.immediateEmotionMeasure =
									false
								if (
									showCloudComputingLoading
								) {
									uni.showModal({
										content: that
											.$t(
												"原始为空或解析失败"
											),
										confirmText: that
											.$t(
												'确定'
											),
										showCancel: false,
										success(
											modal
										) {
											if (modal
												.confirm
											) {
												that.restoreEmotionPageButtons(
													'PPG INVALID_DATA确认'
												)
											}
										}
									})
								} else {
									that.restoreEmotionPageButtons(
										'PPG INVALID_DATA'
									)
								}
								console.log(
									"PPG 波形质量不足、峰值/RR 间期不足，无法可靠分析"
								)
								break;
							case "ERROR":
								uni.hideLoading();
								if (that
									._bpw1CloudLoadingTimer
								) {
									clearTimeout(that
										._bpw1CloudLoadingTimer
									)
									that._bpw1CloudLoadingTimer =
										null
								}
								that.immediateEmotionMeasure =
									false
								if (
									showCloudComputingLoading
								) {
									console.log(
										"数据处理有误")
									uni.showModal({
										content: that
											.$t(
												"测试质量不够好"
											),
										confirmText: that
											.$t(
												'确定'
											),
										showCancel: false,
										success(
											modal
										) {
											if (modal
												.confirm
											) {
												that.restoreEmotionPageButtons(
													'PPG ERROR确认'
												)
											}
										}
									})
								} else {
									that.restoreEmotionPageButtons(
										'PPG ERROR'
									)
								}
								break;
							default:
								// RAW / 分析中
								if (
									keepImmediateForCloud
								) {
									that.setBpw6EmotionPpgPhase(
										'transferring'
									)
									that.bpw6PpgTransferStarted =
										true
									that.bpw6NeedClearLoadingOnShow =
										false
									that.markBpw6PpgSessionBusy(
										'BPW6云端计算中'
									)
									that.showBpw6PpgLoading(
										'云端数据计算中')
									setTimeout(() => {
										that.deviceppgdatalist(
											deviceSn,
											deviceId,
											pollOpts
										)
									}, 1000)
								} else {
									console.log(
										"PPG 波形正在分析中，请稍后..."
									)
									scheduleBpw1Retry()
								}
								break
						}
					} else {
						if (keepImmediateForCloud) {
							that.setBpw6EmotionPpgPhase(
								'transferring')
							that.markBpw6PpgSessionBusy(
								'BPW6云端计算中')
							that.showBpw6PpgLoading(
								'云端数据计算中')
							setTimeout(() => {
								that.deviceppgdatalist(
									deviceSn,
									deviceId,
									pollOpts
								)
							}, 1000)
						} else {
							scheduleBpw1Retry()
						}
					}
				}).catch((err) => {
					console.error(
						'deviceppgdatalist失败', err)
					// 立即测量云端等待中：网络抖动只重试，勿恢复按钮/关 loading
					if (keepImmediateForCloud || that
						.bpw6EmotionPpgPhase ===
						'transferring') {
						that.setBpw6EmotionPpgPhase(
							'transferring')
						that.markBpw6PpgSessionBusy(
							'BPW6云端计算重试')
						that.showBpw6PpgLoading(
							'云端数据计算中')
						setTimeout(() => {
							that.deviceppgdatalist(
								deviceSn,
								deviceId,
								pollOpts)
						}, 1500)
						return
					}
					if (bpw1Poll && pollAttempt + 1 <
						BPW1_POLL_MAX && Date.now() -
						pollStartedAt <
						BPW1_POLL_MAX_MS) {
						scheduleBpw1Retry()
						return
					}
					that.bpw6NeedClearLoadingOnShow =
						true
					try {
						uni.hideLoading()
					} catch (e) {}
					that.restoreEmotionPageButtons(
						'PPG列表查询失败')
				})
			},
			/** 解析 PPG 列表行时间（ms），用于过滤旧记录 */
			parsePpgRowTimeMs(row) {
				if (!row) return 0
				const raw = row.measurementTs || row
					.startTime || row.createTime || row
					.measurementTimezone
				if (raw == null || raw === '') return 0
				if (typeof raw === 'number') {
					return raw < 1e12 ? raw * 1000 : raw
				}
				const t = Date.parse(String(raw).replace(/-/g,
					'/'))
				return Number.isFinite(t) ? t : 0
			},
			//根据患者ID查询PPG信号最新分析结果
			ppgdatalist(deviceSn, deviceId) {
				let that = this
				let ppgdata = {
					patientId: uni.getStorageSync(
						"userid"),
					// startTime: that.getTimeAllJSON().YMDHMS
				}
				that.$get(that.$url_APP_IP +
					"/prod-api/device/ppgresults/get_result_by_patient_id",
					ppgdata, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgdatalist) => {
					// console.log("ppgdatalist", ppgdatalist)
					if (ppgdatalist.code === 200) {
						uni.hideLoading();
						let aaa = {
							mood_index: ppgdatalist
								.data
								.moodIndex, //心情指数
							depression_risk_score: ppgdatalist
								.data
								.depressionRiskScore, //抑郁风险评分
							stress_index: ppgdatalist
								.data
								.stressIndex, //压力指数
							fatigue_index: ppgdatalist
								.data
								.fatigueIndex, //疲劳指数
							recovery_index: ppgdatalist
								.data
								.recoveryIndex, //恢复指数
						}
						that.ppgresultslist(that
							.types_index)
						that.ppgresultslist2(that
							.types_index)
						that.ppgresultslist3(that
							.types_index)
						that.ppgresultslist4()
						that.share_data_fat_scale(
							deviceSn, deviceId,
							that.getTimeAllJSON()
							.YMDHMS, aaa)
						// 计算信号质量
						switch (ppgdatalist.data
							.signalQualityLevel) {
							case "EXCELLENT":
								that.signal_quality_level =
									that.$t("信号质量极佳")
								break
							case "GOOD":
								that.signal_quality_level =
									that.$t("信号质量良好")
								break
							case "FAIR":
								that.signal_quality_level =
									that.$t("信号质量一般")
								break
							case "POOR":
								that.signal_quality_level =
									that.$t("信号质量较差")
								break
						}
					} else {
						console.log("哈哈哈哈")
						uni.hideLoading();
					}
				})
			},
			//情绪数据上报
			share_data_fat_scale(deviceSn, deviceId, fattimes,
				aaa) {
				let data = {
					deviceSn: !deviceSn ? uni
						.getStorageSync("deviceSn") : deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: this.resolveUploadTime(fattimes),
					measurementTs: this.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				// console.log("[BPW1]情绪数据上报接口的传参：", data)
				this.$post(this.$url_APP_IP + this
					.$url_jakoblife_fat_scale, data, {
						'content-type': 'application/json;charset=UTF-8'
					}).then(sharedatafatscaleres => {
					console.log("[BPW1]情绪数据上报结果：",
						sharedatafatscaleres)
				}).catch(sharedatafatscaleerrro => {
					console.log(
						"sharedatafatscaleerrro",
						sharedatafatscaleerrro)
				})
			},
			// 情绪图无数据时的默认结构（保留坐标轴 + 阈值线）
			getEmptyPpgChartData() {
				return {
					categories: [""],
					series: [{
						legendShape: "none",
						name: "",
						data: [null],
						color: '#3298F7'
					}, {
						legendShape: "none",
						name: "",
						data: [null],
						color: '#3298F7'
					}, {
						legendShape: "none",
						name: "",
						data: [null],
						color: '#3298F7'
					}, {
						legendShape: "none",
						name: "",
						data: [null],
						color: '#3298F7'
					}, {
						legendShape: "none",
						name: "",
						data: [null],
						color: '#3298F7'
					}]
				}
			},
			//获取当天情绪数据图表数据
			ppgresultslist(recordId) {
				recordId = Number(recordId) || 0
				let ppgdata = {
					patientId: uni.getStorageSync(
						"userid"),
					startTime: this.getTimeAllJSON().YMD +
						" 00:00:00",
					endTime: this.getTimeAllJSON().YMD +
						" 23:59:59",
				}
				this.$get(this.$url_APP_IP + this
					.$get_result_list_by_patient_id,
					ppgdata, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					if (ppgresultslist.code === 200 &&
						ppgresultslist.data.length > 0
					) {
						this.chartDataPPG
							.categories = []
						this.chartDataPPG.series = [{
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7'
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7'
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7'
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7'
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7'
						}]
						for (let p = ppgresultslist
								.data.length - 1; p >=
							0; p--) {
							this.chartDataPPG
								.categories.push(
									ppgresultslist.data
									.length - p);
							if (recordId === 0) {
								this.chartDataPPG
									.series[0].data
									.push(
										ppgresultslist
										.data[p]
										.moodIndex);
								this.optsPPG.extra
									.markLine.data[0]
									.value = 8
								this.optsPPG.extra
									.markLine.data[0]
									.lineColor =
									"#41EB08"
								this.optsPPG.extra
									.markLine.data[0]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[0]
									.labelText = this
									.$t("积极愉悦2")
								this.optsPPG.extra
									.markLine.data[0]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 :
									145
								this.optsPPG.extra
									.markLine.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[0]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[0]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[0]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[0]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[1]
									.value = 6
								this.optsPPG.extra
									.markLine.data[1]
									.lineColor =
									"#3298F7"
								this.optsPPG.extra
									.markLine.data[1]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[1]
									.labelText = this
									.$t("平静稳定2")
								this.optsPPG.extra
									.markLine.data[1]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 :
									115
								this.optsPPG.extra
									.markLine.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[1]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[1]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[1]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[1]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[2]
									.value = 4
								this.optsPPG.extra
									.markLine.data[2]
									.lineColor =
									"#FF6B6B"
								this.optsPPG.extra
									.markLine.data[2]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[2]
									.labelText = this
									.$t("轻微压力2")
								this.optsPPG.extra
									.markLine.data[2]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 83
								this.optsPPG.extra
									.markLine.data[2]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[2]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[2]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[2]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[2]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[3]
									.value = 0
								this.optsPPG.extra
									.markLine.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[3]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[3]
									.labelText = this
									.$t("明显压力2")
								this.optsPPG.extra
									.markLine.data[3]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 :
									122
								this.optsPPG.extra
									.markLine.data[3]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[3]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[3]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[3]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[3]
									.padding = [4, 8,
										4, 8
									]
							} else if (recordId ===
								1) {
								this.chartDataPPG
									.series[1].data
									.push(
										ppgresultslist
										.data[p]
										.depressionRiskScore
									);
								this.optsPPG.extra
									.markLine.data[0]
									.value = 8
								this.optsPPG.extra
									.markLine.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG.extra
									.markLine.data[0]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[0]
									.labelText = this
									.$t("较高风险2")
								this.optsPPG.extra
									.markLine.data[0]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 70
								this.optsPPG.extra
									.markLine.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[0]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[0]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[0]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[0]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[1]
									.value = 5
								this.optsPPG.extra
									.markLine.data[1]
									.lineColor =
									"#3298F7"
								this.optsPPG.extra
									.markLine.data[1]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[1]
									.labelText = this
									.$t("中等风险2")
								this.optsPPG.extra
									.markLine.data[1]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 90
								this.optsPPG.extra
									.markLine.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[1]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[1]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[1]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[1]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[2]
									.value = 0
								this.optsPPG.extra
									.markLine.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[2]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[2]
									.labelText = this
									.$t("较低风险2")
								this.optsPPG.extra
									.markLine.data[2]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 70
								this.optsPPG.extra
									.markLine.data[2]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[2]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[2]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[2]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[2]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[3]
									.value = 0
								this.optsPPG.extra
									.markLine.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[3]
									.showLabel = false
								this.optsPPG.extra
									.markLine.data[3]
									.labelText = ""
								this.optsPPG.extra
									.markLine.data[3]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetX = 60
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[3]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[3]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[3]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[3]
									.padding = [4, 8,
										4, 8
									]
							} else if (recordId ===
								2) {
								this.chartDataPPG
									.series[2].data
									.push(
										ppgresultslist
										.data[p]
										.stressIndex);
								this.optsPPG.extra
									.markLine.data[0]
									.value = 5
								this.optsPPG.extra
									.markLine.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG.extra
									.markLine.data[0]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[0]
									.labelText = this
									.$t("压力大2")
								this.optsPPG.extra
									.markLine.data[0]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 85
								this.optsPPG.extra
									.markLine.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[0]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[0]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[0]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[0]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[1]
									.value = 0
								this.optsPPG.extra
									.markLine.data[1]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[1]
									.labelText = this
									.$t("压力小2")
								this.optsPPG.extra
									.markLine.data[1]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 85
								this.optsPPG.extra
									.markLine.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[1]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[1]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[1]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[1]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[2]
									.value = 0
								this.optsPPG.extra
									.markLine.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[2]
									.showLabel = false
								this.optsPPG.extra
									.markLine.data[2]
									.labelText = ""
								this.optsPPG.extra
									.markLine.data[2]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetX = 60
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[2]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[2]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[2]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[2]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[3]
									.value = 0
								this.optsPPG.extra
									.markLine.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[3]
									.showLabel = false
								this.optsPPG.extra
									.markLine.data[3]
									.labelText = ""
								this.optsPPG.extra
									.markLine.data[3]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetX = 60
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[3]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[3]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[3]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[3]
									.padding = [4, 8,
										4, 8
									]
							} else if (recordId ===
								3) {
								this.chartDataPPG
									.series[3].data
									.push(
										ppgresultslist
										.data[p]
										.fatigueIndex);
								this.optsPPG.extra
									.markLine.data[0]
									.value = 5
								this.optsPPG.extra
									.markLine.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG.extra
									.markLine.data[0]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[0]
									.labelText = this
									.$t("疲劳度高2")
								this.optsPPG.extra
									.markLine.data[0]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 :
									125
								this.optsPPG.extra
									.markLine.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[0]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[0]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[0]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[0]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[1]
									.value = 0
								this.optsPPG.extra
									.markLine.data[1]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[1]
									.labelText = this
									.$t("疲劳度低2")
								this.optsPPG.extra
									.markLine.data[1]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 :
									120
								this.optsPPG.extra
									.markLine.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[1]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[1]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[1]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[1]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[2]
									.value = 0
								this.optsPPG.extra
									.markLine.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[2]
									.showLabel = false
								this.optsPPG.extra
									.markLine.data[2]
									.labelText = ""
								this.optsPPG.extra
									.markLine.data[2]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetX = 60
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[2]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[2]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[2]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[2]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[3]
									.value = 0
								this.optsPPG.extra
									.markLine.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[3]
									.showLabel = false
								this.optsPPG.extra
									.markLine.data[3]
									.labelText = ""
								this.optsPPG.extra
									.markLine.data[3]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetX = 60
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[3]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[3]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[3]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[3]
									.padding = [4, 8,
										4, 8
									]
							} else if (recordId ===
								4) {
								this.chartDataPPG
									.series[4].data
									.push(
										ppgresultslist
										.data[p]
										.recoveryIndex
									);
								this.optsPPG.extra
									.markLine.data[0]
									.value = 5
								this.optsPPG.extra
									.markLine.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG.extra
									.markLine.data[0]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[0]
									.labelText = this
									.$t("恢复快2")
								this.optsPPG.extra
									.markLine.data[0]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 :
									100
								this.optsPPG.extra
									.markLine.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[0]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[0]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[0]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[0]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[0]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[1]
									.value = 0
								this.optsPPG.extra
									.markLine.data[1]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.showLabel = true
								this.optsPPG.extra
									.markLine.data[1]
									.labelText = this
									.$t("恢复慢2")
								this.optsPPG.extra
									.markLine.data[1]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 :
									100
								this.optsPPG.extra
									.markLine.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[1]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[1]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[1]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[1]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[1]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[2]
									.value = 0
								this.optsPPG.extra
									.markLine.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[2]
									.showLabel = false
								this.optsPPG.extra
									.markLine.data[2]
									.labelText = ""
								this.optsPPG.extra
									.markLine.data[2]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetX = 60
								this.optsPPG.extra
									.markLine.data[2]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[2]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[2]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[2]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[2]
									.padding = [4, 8,
										4, 8
									]
								this.optsPPG.extra
									.markLine.data[3]
									.value = 0
								this.optsPPG.extra
									.markLine.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG.extra
									.markLine.data[3]
									.showLabel = false
								this.optsPPG.extra
									.markLine.data[3]
									.labelText = ""
								this.optsPPG.extra
									.markLine.data[3]
									.labelAlign =
									"left"
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetX = 60
								this.optsPPG.extra
									.markLine.data[3]
									.labelOffsetY = -15
								this.optsPPG.extra
									.markLine.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG.extra
									.markLine.data[3]
									.borderWidth = 0
								this.optsPPG.extra
									.markLine.data[3]
									.borderColor =
									"transparent"
								this.optsPPG.extra
									.markLine.data[3]
									.borderRadius = 4
								this.optsPPG.extra
									.markLine.data[3]
									.padding = [4, 8,
										4, 8
									]
							}
						}
					} else {
						// 无数据时显示默认空图表（坐标轴 + 阈值线），避免白屏
						this.chartDataPPG = this
							.getEmptyPpgChartData()
						if (recordId === 0) {
							this.optsPPG.extra.markLine
								.data[0].value = 8
							this.optsPPG.extra.markLine
								.data[0].lineColor =
								"#41EB08"
							this.optsPPG.extra.markLine
								.data[0].showLabel =
								true
							this.optsPPG.extra.markLine
								.data[0].labelText =
								this.$t("积极愉悦2")
							this.optsPPG.extra.markLine
								.data[0].labelAlign =
								"left"
							this.optsPPG.extra.markLine
								.data[0].labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 145
							this.optsPPG.extra.markLine
								.data[0]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG.extra.markLine
								.data[0]
								.labelOffsetY = -15
							this.optsPPG.extra.markLine
								.data[0]
								.labelBgOpacity = -0.8
							this.optsPPG.extra.markLine
								.data[0].borderWidth =
								0
							this.optsPPG.extra.markLine
								.data[0].borderColor =
								"transparent"
							this.optsPPG.extra.markLine
								.data[0].borderRadius =
								4
							this.optsPPG.extra.markLine
								.data[0].padding = [4,
									8, 4, 8
								]
							this.optsPPG.extra.markLine
								.data[1].value = 6
							this.optsPPG.extra.markLine
								.data[1].lineColor =
								"#3298F7"
							this.optsPPG.extra.markLine
								.data[1].showLabel =
								true
							this.optsPPG.extra.markLine
								.data[1].labelText =
								this.$t("平静稳定2")
							this.optsPPG.extra.markLine
								.data[1].labelAlign =
								"left"
							this.optsPPG.extra.markLine
								.data[1].labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 115
							this.optsPPG.extra.markLine
								.data[1]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG.extra.markLine
								.data[1]
								.labelOffsetY = -15
							this.optsPPG.extra.markLine
								.data[1]
								.labelBgOpacity = -0.8
							this.optsPPG.extra.markLine
								.data[1].borderWidth =
								0
							this.optsPPG.extra.markLine
								.data[1].borderColor =
								"transparent"
							this.optsPPG.extra.markLine
								.data[1].borderRadius =
								4
							this.optsPPG.extra.markLine
								.data[1].padding = [4,
									8, 4, 8
								]
							this.optsPPG.extra.markLine
								.data[2].value = 4
							this.optsPPG.extra.markLine
								.data[2].lineColor =
								"#FF6B6B"
							this.optsPPG.extra.markLine
								.data[2].showLabel =
								true
							this.optsPPG.extra.markLine
								.data[2].labelText =
								this.$t("轻微压力2")
							this.optsPPG.extra.markLine
								.data[2].labelAlign =
								"left"
							this.optsPPG.extra.markLine
								.data[2].labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 83
							this.optsPPG.extra.markLine
								.data[2]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG.extra.markLine
								.data[2]
								.labelOffsetY = -15
							this.optsPPG.extra.markLine
								.data[2]
								.labelBgOpacity = -0.8
							this.optsPPG.extra.markLine
								.data[2].borderWidth =
								0
							this.optsPPG.extra.markLine
								.data[2].borderColor =
								"transparent"
							this.optsPPG.extra.markLine
								.data[2].borderRadius =
								4
							this.optsPPG.extra.markLine
								.data[2].padding = [4,
									8, 4, 8
								]
							this.optsPPG.extra.markLine
								.data[3].value = 0
							this.optsPPG.extra.markLine
								.data[3].lineColor =
								"#D8D8D6"
							this.optsPPG.extra.markLine
								.data[3].showLabel =
								true
							this.optsPPG.extra.markLine
								.data[3].labelText =
								this.$t("明显压力2")
							this.optsPPG.extra.markLine
								.data[3].labelAlign =
								"left"
							this.optsPPG.extra.markLine
								.data[3].labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 122
							this.optsPPG.extra.markLine
								.data[3]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG.extra.markLine
								.data[3]
								.labelOffsetY = -15
							this.optsPPG.extra.markLine
								.data[3]
								.labelBgOpacity = -0.8
							this.optsPPG.extra.markLine
								.data[3].borderWidth =
								0
							this.optsPPG.extra.markLine
								.data[3].borderColor =
								"transparent"
							this.optsPPG.extra.markLine
								.data[3].borderRadius =
								4
							this.optsPPG.extra.markLine
								.data[3].padding = [4,
									8, 4, 8
								]
						} else if (recordId === 1) {
							// 抑郁风险空数据处理...
						} else if (recordId === 2) {
							// 压力指数空数据处理...
						} else if (recordId === 3) {
							// 疲劳指数空数据处理...
						} else if (recordId === 4) {
							// 恢复指数空数据处理...
						}
					}
				})
			},

			//获取两周平均分
			ppgresultslist2(recordId) {
				recordId = Number(recordId) || 0
				let endTime = this.getTimeAllJSON().YMD +
					" 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() -
					13) // 两周
				let startTime = minusOneWeek.toISOString()
					.replace('T', ' ').substring(0, 10) +
					" 00:00:00"
				let ppgdata = {
					patientId: uni.getStorageSync(
						"userid"),
					startTime: startTime,
					endTime: endTime,
				}
				this.$get(this.$url_APP_IP + this
					.$get_result_list_by_patient_id,
					ppgdata, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					if (ppgresultslist.code === 200 &&
						ppgresultslist.data.length > 0
					) {
						// 1. 按日期分组计算每日平均分
						const dailyData = {};
						ppgresultslist.data.forEach(
							item => {
								const date = item
									.analysisTime
									.split(' ')[
										0
									]; // 获取日期部分，如 "2026-01-08"
								if (!dailyData[
										date]) {
									dailyData[
										date
									] = {
										sumMoodIndex: 0, //心情评估
										sumDepressionRisk: 0, //心理指数
										sumstressIndex: 0, //压力指数
										sumfatigueIndex: 0, //疲劳指数
										sumrecoveryIndex: 0, //恢复指数
										count: 0,
										date: date
									};
								}
								dailyData[date]
									.sumMoodIndex +=
									item.moodIndex;
								dailyData[date]
									.sumDepressionRisk +=
									item
									.depressionRiskScore ||
									0;
								dailyData[date]
									.sumstressIndex +=
									item
									.stressIndex ||
									0;
								dailyData[date]
									.sumfatigueIndex +=
									item
									.fatigueIndex ||
									0;
								dailyData[date]
									.sumrecoveryIndex +=
									item
									.recoveryIndex ||
									0;
								dailyData[date]
									.count++;
							});

						// 2. 计算每日平均值并转换为数组
						const dailyAverages = Object
							.values(dailyData).map(
								item => {
									return {
										date: item
											.date,
										averageMoodIndex: item
											.sumMoodIndex /
											item.count,
										averageDepressionRisk: item
											.sumDepressionRisk /
											item.count,
										averagestressIndex: item
											.sumstressIndex /
											item.count,
										averagesumfatigueIndex: item
											.sumfatigueIndex /
											item.count,
										averagesumrecoveryIndex: item
											.sumrecoveryIndex /
											item.count
									};
								});

						// 3. 按日期排序（从早到晚）
						dailyAverages.sort((a, b) =>
							new Date(a.date) -
							new Date(b.date));

						// 4. 初始化图表数据
						this.chartDataPPG2
							.categories = []
						this.chartDataPPG2.series = [{
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7' // 蓝色表示心情指数
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7' // 红色表示抑郁风险
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7' // 红色表示抑郁风险
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7' // 红色表示抑郁风险
						}, {
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7' // 红色表示抑郁风险
						}]
						// 5. 填充图表数据
						let dayCount = 1;
						dailyAverages.forEach(item => {
							const datesfd =
								item.date
								.slice(8);
							this.chartDataPPG2
								.categories
								.push(datesfd);
							if (recordId ===
								0) {
								// 心情指数数据
								const
									avgMoodScore =
									item
									.averageMoodIndex
									.toFixed(
										1);
								this.chartDataPPG2
									.series[0]
									.data.push(
										avgMoodScore
									);
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.value = 8
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.lineColor =
									"#41EB08"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelText =
									this.$t(
										"积极愉悦2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 145
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.value = 6
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.lineColor =
									"#3298F7"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelText =
									this.$t(
										"平静稳定2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 115
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.value = 4
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.lineColor =
									"#FF6B6B"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelText =
									this.$t(
										"轻微压力2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 83
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelText =
									this.$t(
										"明显压力2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 122
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.padding = [
										4, 8,
										4, 8
									]
							} else if (
								recordId === 1
							) {
								// 抑郁风险数据
								const
									avgRiskScore =
									item
									.averageDepressionRisk
									.toFixed(
										1);
								this.chartDataPPG2
									.series[1]
									.data.push(
										avgRiskScore
									);
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.value = 8
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelText =
									this.$t(
										"较高风险2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 70
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.value = 5
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.lineColor =
									"#3298F7"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelText =
									this.$t(
										"中等风险2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 90
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelText =
									this.$t(
										"较低风险2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 70
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.showLabel =
									false
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelText =
									""
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetX =
									60
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.padding = [
										4, 8,
										4, 8
									]
							} else if (
								recordId === 2
							) {
								// 压力指数
								const
									avgRiskScore =
									item
									.averagestressIndex
									.toFixed(
										1);
								this.chartDataPPG2
									.series[2]
									.data.push(
										avgRiskScore
									);
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.value = 5
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelText =
									this.$t(
										"压力大2")
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 85
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelText =
									this.$t(
										"压力小2")
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 85
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.showLabel =
									false
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelText =
									""
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetX =
									60
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.showLabel =
									false
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelText =
									""
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetX =
									60
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.padding = [
										4, 8,
										4, 8
									]
							} else if (
								recordId === 3
							) {
								// 疲劳指数
								const
									avgRiskScore =
									item
									.averagesumfatigueIndex
									.toFixed(
										1);
								this.chartDataPPG2
									.series[3]
									.data.push(
										avgRiskScore
									);
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.value = 5
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelText =
									this.$t(
										"疲劳度高2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 125
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelText =
									this.$t(
										"疲劳度低2"
									)
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 120
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.showLabel =
									false
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelText =
									""
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetX =
									60
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.showLabel =
									false
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelText =
									""
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetX =
									60
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.padding = [
										4, 8,
										4, 8
									]
							} else if (
								recordId === 4
							) {
								// 恢复指数
								const
									avgRiskScore =
									item
									.averagesumrecoveryIndex
									.toFixed(
										1);
								this.chartDataPPG2
									.series[4]
									.data.push(
										avgRiskScore
									);
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.value = 5
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.lineColor =
									"#FF6B6B"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelText =
									this.$t(
										"恢复快2")
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 100
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[0]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.showLabel =
									true
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelText =
									this.$t(
										"恢复慢2")
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetX =
									Language ==
									'zh-Hans' ||
									Language ==
									'zh-Hant' ?
									60 : 100
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelFontColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[1]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.showLabel =
									false
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelText =
									""
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetX =
									60
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[2]
									.padding = [
										4, 8,
										4, 8
									]
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.value = 0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.lineColor =
									"#D8D8D6"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.showLabel =
									false
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelText =
									""
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelAlign =
									"left"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetX =
									60
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelOffsetY = -
									15
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.labelBgOpacity = -
									0.8
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderWidth =
									0
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderColor =
									"transparent"
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.borderRadius =
									4
								this.optsPPG2
									.extra
									.markLine
									.data[3]
									.padding = [
										4, 8,
										4, 8
									]
							}
							dayCount++;
						});
						// 6. 处理最新一条记录的详细信息
						const latestRecord =
							ppgresultslist.data[0];

						let calculateDailyStatsvalue =
							this.calculateDailyStats(
								dailyAverages)
						this.MoodDays =
							calculateDailyStatsvalue
							.lowMoodDays
						this.StressFatigueDays =
							calculateDailyStatsvalue
							.highStressFatigueDays
						const isMoodLowFrequently =
							dailyAverages.filter(d => d
								.averageMoodIndex < 6)
							.length >= 10;
						const lowMoodDays =
							dailyAverages.filter(d => d
								.averageMoodIndex < 6);
						const
							hasHighFatigueOrStressInLowMoodDays =
							lowMoodDays.some(
								d => d
								.averagesumfatigueIndex >
								0.5 || d
								.averagestressIndex >
								0.5
							);
						this.finalResult =
							isMoodLowFrequently &&
							hasHighFatigueOrStressInLowMoodDays;
						if (this.finalResult && this
							.baoggaodisabled && !this
							.finalResultids) {
							this.finalResultids = true
							uni.showModal({
								content: this
									.$t(
										"为了更准确地了解您的情绪状态"
									),
								confirmText: this
									.$t('确定'),
								cancelText: this
									.$t('取消'),
								success(
									modal) {
									if (modal
										.confirm
									) {
										uni.navigateTo({
											url: '/pages/tabBar/main/score/score'
										})
									}
								}
							})
						}
					} else {
						// 无数据时显示默认空图表（坐标轴 + 阈值线），避免白屏
						this.chartDataPPG2 = this
							.getEmptyPpgChartData()
						if (recordId === 0) {
							this.optsPPG2.extra
								.markLine.data[0]
								.value = 8
							this.optsPPG2.extra
								.markLine.data[0]
								.lineColor = "#41EB08"
							this.optsPPG2.extra
								.markLine.data[0]
								.showLabel = true
							this.optsPPG2.extra
								.markLine.data[0]
								.labelText = this.$t(
									"积极愉悦2")
							this.optsPPG2.extra
								.markLine.data[0]
								.labelAlign = "left"
							this.optsPPG2.extra
								.markLine.data[0]
								.labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 145
							this.optsPPG2.extra
								.markLine.data[0]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG2.extra
								.markLine.data[0]
								.labelOffsetY = -15
							this.optsPPG2.extra
								.markLine.data[0]
								.labelBgOpacity = -0.8
							this.optsPPG2.extra
								.markLine.data[0]
								.borderWidth = 0
							this.optsPPG2.extra
								.markLine.data[0]
								.borderColor =
								"transparent"
							this.optsPPG2.extra
								.markLine.data[0]
								.borderRadius = 4
							this.optsPPG2.extra
								.markLine.data[0]
								.padding = [4, 8, 4, 8]
							this.optsPPG2.extra
								.markLine.data[1]
								.value = 6
							this.optsPPG2.extra
								.markLine.data[1]
								.lineColor = "#3298F7"
							this.optsPPG2.extra
								.markLine.data[1]
								.showLabel = true
							this.optsPPG2.extra
								.markLine.data[1]
								.labelText = this.$t(
									"平静稳定2")
							this.optsPPG2.extra
								.markLine.data[1]
								.labelAlign = "left"
							this.optsPPG2.extra
								.markLine.data[1]
								.labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 115
							this.optsPPG2.extra
								.markLine.data[1]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG2.extra
								.markLine.data[1]
								.labelOffsetY = -15
							this.optsPPG2.extra
								.markLine.data[1]
								.labelBgOpacity = -0.8
							this.optsPPG2.extra
								.markLine.data[1]
								.borderWidth = 0
							this.optsPPG2.extra
								.markLine.data[1]
								.borderColor =
								"transparent"
							this.optsPPG2.extra
								.markLine.data[1]
								.borderRadius = 4
							this.optsPPG2.extra
								.markLine.data[1]
								.padding = [4, 8, 4, 8]
							this.optsPPG2.extra
								.markLine.data[2]
								.value = 4
							this.optsPPG2.extra
								.markLine.data[2]
								.lineColor = "#FF6B6B"
							this.optsPPG2.extra
								.markLine.data[2]
								.showLabel = true
							this.optsPPG2.extra
								.markLine.data[2]
								.labelText = this.$t(
									"轻微压力2")
							this.optsPPG2.extra
								.markLine.data[2]
								.labelAlign = "left"
							this.optsPPG2.extra
								.markLine.data[2]
								.labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 83
							this.optsPPG2.extra
								.markLine.data[2]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG2.extra
								.markLine.data[2]
								.labelOffsetY = -15
							this.optsPPG2.extra
								.markLine.data[2]
								.labelBgOpacity = -0.8
							this.optsPPG2.extra
								.markLine.data[2]
								.borderWidth = 0
							this.optsPPG2.extra
								.markLine.data[2]
								.borderColor =
								"transparent"
							this.optsPPG2.extra
								.markLine.data[2]
								.borderRadius = 4
							this.optsPPG2.extra
								.markLine.data[2]
								.padding = [4, 8, 4, 8]
							this.optsPPG2.extra
								.markLine.data[3]
								.value = 0
							this.optsPPG2.extra
								.markLine.data[3]
								.lineColor = "#D8D8D6"
							this.optsPPG2.extra
								.markLine.data[3]
								.showLabel = true
							this.optsPPG2.extra
								.markLine.data[3]
								.labelText = this.$t(
									"明显压力2")
							this.optsPPG2.extra
								.markLine.data[3]
								.labelAlign = "left"
							this.optsPPG2.extra
								.markLine.data[3]
								.labelOffsetX =
								Language ==
								'zh-Hans' ||
								Language ==
								'zh-Hant' ? 60 : 122
							this.optsPPG2.extra
								.markLine.data[3]
								.labelFontColor =
								"#D8D8D6"
							this.optsPPG2.extra
								.markLine.data[3]
								.labelOffsetY = -15
							this.optsPPG2.extra
								.markLine.data[3]
								.labelBgOpacity = -0.8
							this.optsPPG2.extra
								.markLine.data[3]
								.borderWidth = 0
							this.optsPPG2.extra
								.markLine.data[3]
								.borderColor =
								"transparent"
							this.optsPPG2.extra
								.markLine.data[3]
								.borderRadius = 4
							this.optsPPG2.extra
								.markLine.data[3]
								.padding = [4, 8, 4, 8]
						}
					}
				})
			},

			//获取两周内最新一条情绪数据
			ppgresultslist3(recordId) {
				let endTime = this.getTimeAllJSON().YMD +
					" 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() -
					13)
				let startTime = minusOneWeek.toISOString()
					.replace('T', ' ').substring(0, 10) +
					" 00:00:00"
				let ppgdata = {
					patientId: uni.getStorageSync(
						"userid"),
					startTime: startTime,
					endTime: endTime,
				}
				this.$get(this.$url_APP_IP + this
					.$get_result_list_by_patient_id,
					ppgdata, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					if (ppgresultslist.code === 200 &&
						ppgresultslist.data.length > 0
					) {
						for (let p = ppgresultslist
								.data.length - 1; p >=
							0; p--) {
							this.signal_quality_score =
								ppgresultslist.data[p]
								.analysisConfidence
							this.ppgnewpoint =
								ppgresultslist.data[p]
								.moodIndex + "/10";
							this.depression_risk_score =
								ppgresultslist.data[p]
								.depressionRiskScore +
								"/10"; //综合指数
							this.stress_Index =
								ppgresultslist.data[p]
								.stressIndex; //压力指数
							this.fatigue_index =
								ppgresultslist.data[p]
								.fatigueIndex; //疲劳指数
							this.recovery_index =
								ppgresultslist.data[p]
								.recoveryIndex +
								"/10"; //恢复指数
						}
						// 计算信号质量
						switch (ppgresultslist.data[0]
							.signalQualityLevel) {
							case "EXCELLENT":
								this.signal_quality_level =
									this.$t("信号质量极佳")
								break
							case "GOOD":
								this.signal_quality_level =
									this.$t("信号质量良好")
								break
							case "FAIR":
								this.signal_quality_level =
									this.$t("信号质量一般")
								break
							case "POOR":
								this.signal_quality_level =
									this.$t("信号质量较差")
								break
						}
						switch (ppgresultslist.data[0]
							.moodDescription) {
							case "积极愉悦":
								this.mood_Description =
									this.$t("积极愉悦1")
								break
							case "平静稳定":
								this.mood_Description =
									this.$t("平静稳定1")
								break
							case "轻微压力":
								this.mood_Description =
									this.$t("轻微压力1")
								break
							case "明显压力":
								this.mood_Description =
									this.$t("明显压力1")
								break
						}
						//心情等级
						switch (ppgresultslist.data[0]
							.moodLevel) {
							case "VERY_POSITIVE":
								this.mood_level = this
									.$t("非常积极")
								break
							case "POSITIVE":
								this.mood_level = this
									.$t("积极")
								break
							case "NEUTRAL":
								this.mood_level = this
									.$t("平静稳定")
								break
							case "NEGATIVE":
								this.mood_level = this
									.$t("负面")
								break
							case "VERY_NEGATIVE":
								this.mood_level = this
									.$t("非常负面")
								break
						}
						switch (ppgresultslist.data[0]
							.depressionRecommendation
						) {
							case "🟢 **低风险**: 保持健康生活方式，定期监测":
								this.depression_recommendation =
									this.$t(
										"保持良好的生活习惯")
								break
							case "🟡 **中等风险**: 建议定期监测并考虑专业咨询。可尝试心理自助方法和压力管理":
								this.depression_recommendation =
									this.$t("建议增加放松活动")
								break
							case "🔴 **高风险**: 强烈建议尽快咨询精神科医生或心理医生。建议进行专业心理评估和临床访谈":
								this.depression_recommendation =
									this.$t(
										"强烈建议咨询心理健康专业人士进行详细评估"
									)
								break
							case "保持良好的生活习惯，定期监测心率变异性":
								this.depression_recommendation =
									this.$t(
										"保持良好的生活习惯")
								break
							case "建议增加放松活动，如冥想、深呼吸练习，考虑咨询专业人士":
								this.depression_recommendation =
									this.$t("建议增加放松活动")
								break
						}
						//抑郁风险等级
						switch (ppgresultslist.data[0]
							.depressionRiskLevel) {
							case "LOW_RISK":
								this.depression_risk_level =
									this.$t("较低风险")
								break
							case "MEDIUM_RISK":
								this.depression_risk_level =
									this.$t("中等风险")
								break
							case "HIGH_RISK":
								this.depression_risk_level =
									this.$t("较高风险")
								break
						}
						//数据充足性
						switch (ppgresultslist.data[0]
							.dataSufficiency) {
							case "SUFFICIENT":
								this.data_sufficiency =
									this.$t("充足")
								break
							case "MODERATE":
								this.data_sufficiency =
									this.$t("适中")
								break
							case "INSUFFICIENT":
								this.data_sufficiency =
									this.$t("不足")
								break
						}
					}
				})
			},

			ppgresultslist4() {
				let ppgdata = {
					patientId: uni.getStorageSync(
						"userid"),
					startTime: this.getTimeAllJSON().YMD +
						" 00:00:00",
					endTime: this.getTimeAllJSON().YMD +
						" 23:59:59",
				}
				this.$get(this.$url_APP_IP + this
					.$get_result_list_by_patient_id,
					ppgdata, {
						'Authorization': 'Bearer ' + uni
							.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					if (ppgresultslist.code === 200 &&
						ppgresultslist.data.length > 0
					) {
						let stress_Indexone
						for (let p = ppgresultslist
								.data.length - 1; p >=
							0; p--) {
							stress_Indexone =
								ppgresultslist.data[p]
								.stressIndex; //压力指数
						}
						if (stress_Indexone >= 5 &&
							this
							.immediateEmotionMeasure) {
							uni.showModal({
								title: this.$t(
									"提示"),
								content: this
									.$t(
										"您的血压比平时高但您的心情指数显示拿您可能有点紧张"
									),
								showCancel: false,
								success: function(
									res) {
									if (res
										.confirm
									) {
										this.yalixueyatype =
											false
									}
								}
							});
						}
					}
				})
			},

			// 在你的方法中计算统计数据
			calculateDailyStats(dailyAverages) {
				// 1. 计算averageMoodIndex低于5的天数
				const lowMoodDays = dailyAverages.filter(
						item => item.averageMoodIndex < 5)
					.length;
				// 2. 计算同时满足averagestressIndex≥5和averagesumfatigueIndex≥5的天数
				const highStressFatigueDays = dailyAverages
					.filter(item => item.averagestressIndex >=
						5 || item
						.averagesumfatigueIndex >= 5).length;
				return {
					lowMoodDays,
					highStressFatigueDays
				};
			},


			/* ==================== 协议层 ==================== */
			async sendEcgStart() {
				for (let i = 0; i < 3; i++) {
					if (i) await new Promise(r =>
						setTimeout(r, 50))
					await this.writeCmd(CMD_ECG_START)
				}
			},
			sendStop() {
				this.writeCmd(CMD_ECG_STOP).then(() => this
					.tip = '已发送停止命令')
			},
			writeCmd(cmd) {
				return new Promise((resolve, reject) =>
					uni.writeBLECharacteristicValue({
						deviceId: this.deviceIdECG,
						serviceId: this
							.serviceIdECG,
						characteristicId: this
							.uuidECG, // 动态拿到的
						value: this.toArrayBuffer(
							"A61500150A"),
						writeType: 'writeNoResponse',
						success: (e) => {
							console.error(
								'write fail',
								e)
							resolve
						},
						fail: (e) => {
							console.error(
								'write fail',
								e)
							reject(e)
						}
					}))
			},

			/* 分包拼接解析 */
			tryParse() {
				while (true) {
					const idx = this.buffer.indexOf('0a')
					if (idx === -1) break
					const frameHex = this.buffer.slice(0,
						idx + 2)
					this.buffer = this.buffer.slice(idx +
						2)
					const frame = new Uint8Array(frameHex
						.match(/.{2}/g).map(b =>
							parseInt(b, 16)))
					if (frame.length < 5) continue
					const head = frame[0]
					if (head === 0x23) this.parseWave(
						frame)
					else if (head === 0xA6) this.parseCmd(
						frame)
				}
			},
			parseWave(buf) {
				if (buf[buf.length - 1] !== 0x0A) return;
				const sumRx = buf[buf.length - 2];
				const sumCalc = buf.slice(1, -2).reduce((s,
					b) => s + b, 0) & 0xFF;
				if (sumRx !== sumCalc) return;
				const str = String.fromCharCode(...buf
					.slice(1, -2));
				const val = parseFloat(str);
				if (Number.isNaN(val)) return;
				this.getWaveRef().pushData([val]);
				this.dataCount++;
				this.fullDataCount = this.getWaveRef()
					.getFullDataCount();
				this.queueLength = this.getWaveRef()
					.getQueueLength();
			},
			parseCmd(buf) {
				if (buf[1] !== 0x15) return;
				const map = {
					0x00: '采集结束',
					0x01: '采集开始',
					0x02: '采集错误（未按键/提前结束）'
				};
				this.measurementStatus = map[buf[2]] ||
					'未知状态';
				this.tip = this.measurementStatus;

				if (buf[2] === 0x00) {
					// 测量结束，提示用户可以查看完整波形
					setTimeout(() => {
						this.getWaveRef()
							.showFullWave();
						this.baseFeaturesExtracted =
							this.$t("未完成")
						this.derivedFeaturesExtracted =
							this.$t("未完成")
						this.qualityScore = this
							.$t("云端数据计算中")
						this.modelScore = this.$t(
							"云端数据计算中")
					}, 500);
					// ✅ 采集结束，获取最终数据
					const finalData = this.getWaveRef()
						.getFullDataList(); // ✅ 拿到子组件数据
					const duration = finalData.length /
						this.getWaveRef().getsampleRate();
					const minVal = Math.min(...finalData);
					const maxVal = Math.max(...finalData);
					const diff = maxVal -
						minVal; // 就是 max-min
					const avgVal = finalData.reduce((a,
							b) => a + b, 0) / finalData
						.length;

					console.log('✅ 采集结束，最终数据:', {
						totalPoints: finalData
							.length,
						duration: duration.toFixed(
							2) + 's',
						min: minVal.toFixed(3),
						max: maxVal.toFixed(3),
						avg: avgVal.toFixed(3),
						data: finalData // 你可以在这里上传或保存
					});
					// ✅ 可选：上传或保存
					this.saveFinalData(finalData, diff);

				} else if (buf[2] === 0x02) {
					uni.showToast({
						title: this.$t(
							"用户未按开始键或已暂停"),
						icon: 'none'
					});
				}
			},
			compressFloatArray(arr) {
				// 1. 转4字节小端浮点
				const bytes = new ArrayBuffer(arr.length *
					4);
				const view = new DataView(bytes);
				arr.forEach((v, i) => view.setFloat32(i *
					4, v, true)); // true=小端
				// 2. gzip 压缩
				const compressed = pako.gzip(
					new Uint8Array(bytes));
				// 3. 转base64（方便JSON传输）
				return uni.arrayBufferToBase64(compressed);
			},
			computeEcgVoltageRange(arr) {
				if (!arr || arr.length === 0) return 500;
				const signalMin = Math.min(...arr);
				const signalMax = Math.max(...arr);
				return Math.max(Math.abs(signalMin), Math
					.abs(signalMax)) * 1.2;
			},
			// 根据数据实际范围动态计算 voltageRange
			packInt16ECG(arr) {
				const n = arr.length;
				const ab = new ArrayBuffer(n * 2);
				const view = new DataView(ab);

				// 找到数据实际范围
				let maxVal = Math.max(...arr);
				let minVal = Math.min(...arr);
				// 加一些余量
				let range = Math.max(Math.abs(maxVal), Math
					.abs(minVal)) * 1.2;
				// 至少为1，避免除零
				const voltageRange = Math.max(range, 1);

				const scale = 32767 / voltageRange;
				for (let i = 0; i < n; i++) {
					let v = Math.max(-voltageRange, Math
						.min(voltageRange, arr[i]));
					let int16 = Math.round(v * scale);
					view.setInt16(i * 2, int16, true);
				}
				return {
					buffer: ab,
					voltageRange: voltageRange
				};
			},

			unpackInt16ECG(ab, voltageRange = 500) {
				if (!ab || !(ab instanceof ArrayBuffer)) {
					console.error(
						'Invalid input: Expected ArrayBuffer, got:',
						ab);
					return [];
				}
				const n = ab.byteLength / 2;
				const view = new DataView(ab);
				const arr = new Array(n);
				const scale = 32767 / voltageRange;
				for (let i = 0; i < n; i++) {
					const int16 = view.getInt16(i * 2,
						true);
					arr[i] = parseFloat((int16 / scale)
						.toFixed(6));
				}
				return arr;
			},
			saveFinalData(data, diff) {
				console.log("数据", data)
				const packed = this.packInt16ECG(data);
				const payload = {
					deviceId: this.deviceId,
					sampleRate: this.getWaveRef()
						.getsampleRate(),
					duration: data.length / this
						.getWaveRef().getsampleRate(),
					data: this.ab2hex(packed.buffer),
					voltageRange: packed.voltageRange,
				}
				console.log("payload", payload)
				let ecgdata = {
					patientId: uni.getStorageSync(
						"userid"), //患者ID
					deviceSn: uni.getStorageSync(
						"ECGdeviceSn"), //设备sn
					deviceModel: uni.getStorageSync(
						"deviceModelName"), //设备型号
					samplingRate: payload
						.sampleRate, //采样率(Hz)
					startTime: this.getTimeAllJSON()
						.YMDHMS, // payload.duration, 采集开始时间(微秒精度)
					dataFormat: 'INT16', //数据编码格式
					voltageRange: payload
						.voltageRange, //电压范围(mV)
					rawData: payload.data, //二进制波形数据
					dataLength: this
						.fullDataCount, //自动计算采样点数
					baseFeaturesExtracted: '',
					derivedFeaturesExtracted: '',
					qualityScore: '',
					modelScore: '',
					measurementTs: this.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				console.log("ecgdata", ecgdata)
				this.$post(this.$url_APP_IP +
					'/prod-api/device/ecgdata',
					ecgdata, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ecgdatares) => {
					this.buffer = ""
					if (ecgdatares.code === 200) {
						console.log('✅ 数据上传成功',
							ecgdatares);
						uni.showLoading({
							title: this.$t(
								"正在云端计算中请稍后"
							),
							mask: true
						})
						this.ecgdatalist()
					} else {
						console.error('❌ 数据上传失败',
							ecgdatares);
					}
				}).catch((err) => {
					this.buffer = ""
					console.error('❌ 数据上传异常', err);
				})
			},

			ecgdatalist() {
				let ecgdata = {
					patientId: uni.getStorageSync(
						"userid"),
					startTime: this.getTimeAllJSON()
						.YMDHMS
					// startTime: "2026-06-25 10:00:00"
				}
				console.log('✅ ecgdatalist 传参', ecgdata);
				this.$get(this.$url_APP_IP +
					'/prod-api/device/ecgdata/list',
					ecgdata, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ecgdatares) => {
					console.log('✅ 返回数据成功',
						ecgdatares);
					if (ecgdatares.code === 200 &&
						ecgdatares.total > 0) {
						if (ecgdatares.rows[
								ecgdatares.total -
								1]
							.baseFeaturesExtracted !==
							1) {
							setTimeout(() => {
								this.ecgdatalist()
							}, 3000)
						} else {
							uni.hideLoading();
						}
						this.ecgdatarows = []
						this.ecgdatarows =
							ecgdatares.rows.slice()
							.reverse()
						const latestRow =
							ecgdatares.rows[
								ecgdatares.total -
								1];
						const newData = this
							.unpackInt16ECG(
								this.toArrayBuffer(
									latestRow
									.rawData),
								latestRow
								.voltageRange ||
								500
							);
						this.getWaveRef()
							.generateApiData(
								newData, latestRow
								.voltageRange);
						this.baseFeaturesExtracted =
							ecgdatares.rows[
								ecgdatares.total -
								1]
							.baseFeaturesExtracted ===
							1 ? this.$t("完成") :
							this.$t("未完成")
						this.derivedFeaturesExtracted =
							ecgdatares.rows[
								ecgdatares.total -
								1]
							.derivedFeaturesExtracted ===
							1 ? this.$t("完成") :
							this.$t("未完成")
						this.qualityScore =
							latestRow
							.baseFeaturesExtracted ===
							1 ? latestRow
							.qualityScore : this
							.$t("云端数据计算中")
						if (latestRow
							.baseFeaturesExtracted ===
							1) {
							this.modelScore =
								latestRow
								.modelScore ==
								null ? this.$t(
									"ECG房颤数据质量偏低提示"
								) : latestRow
								.modelScore
						} else {
							this.modelScore = this
								.$t("云端数据计算中")
						}
					} else {
						uni.hideLoading();
						this.baseFeaturesExtracted =
							"-/-"
						this.derivedFeaturesExtracted =
							"-/-"
						this.qualityScore = "-/-"
						this.modelScore = "-/-"
						let newdatanull = [0]
						this.getWaveRef()
							.generateApiData(
								newdatanull);
						// uni.showToast({
						// 	title: this.$t("当天云端暂无最新数据"),
						// 	icon: 'none'
						// })
					}
				})
			},
			/* ==================== UI ==================== */
			//ECG测量按钮
			startbtn() {
				console.log('开始测量前状态:', {
					isMeasuring: this
						.getEcgWaveRef()
						.isMeasuring,
					showFullWave: this
						.getEcgWaveRef()
						.showFullWaveMode,
					dataLength: this
						.getEcgWaveRef().dataList
						.length
				});
				this.clearWave();
				this.sendCnt = 0;
				// 先重置波形组件状态，确保在实时测量模式
				this.getEcgWaveRef().clear();
				this.getEcgWaveRef().stopMeasurement();
				this.getEcgWaveRef().hideFullWave();
				// 延迟一小段时间确保状态重置完成
				setTimeout(() => {
					// 再次确认状态
					if (this.getEcgWaveRef()
						.showFullWaveMode) {
						console.warn(
							'警告：开始测量时仍处于完整波形模式，强制重置'
						);
						this.getEcgWaveRef()
							.showFullWaveMode =
							false;
						this.getEcgWaveRef()
							.showFullWaveControls =
							false;
					}
					this.getEcgWaveRef()
						.startMeasurement();
					this.send(this.deviceIdECG,
						this.serviceIdECG, this
						.uuidECG);
					console.log('开始测量后状态:', {
						isMeasuring: this
							.getEcgWaveRef()
							.isMeasuring,
						showFullWave: this
							.getEcgWaveRef()
							.showFullWaveMode
					});
				}, 50);
			},
			send(deviceId, serviceId, writeCharId) {
				const hex = 'A51201130A';
				if (this.sendCnt >= 3) {
					this.sendCnt = 0; // 重置，方便下次再发
					return;
				}
				this.sendCnt++;
				uni.writeBLECharacteristicValue({
					deviceId,
					serviceId: SERVICE_ID,
					characteristicId: WRITE_UUID,
					writeType: 'writeNoResponse',
					value: this.toArrayBuffer(hex),
					success: () => {
						console.log(
							`第${this.sendCnt}次写入成功`
						);
						setTimeout(() => this
							.send(deviceId,
								SERVICE_ID,
								WRITE_UUID
							), 50);
						if (this.sendCnt ===
							3) {
							uni.showToast({
								title: this
									.$t(
										"请开始测量"
									),
								icon: 'none',
								duration: 1500
							})
						}
					},
					fail: e => {
						console.error(
							`第${this.sendCnt}次写入失败`,
							e)
						uni.showToast({
							title: this
								.$t(
									"ECG设备连接中"
								),
							icon: 'none',
							duration: 1500
						})
						this.getEcgWaveRef()
							.hideFullWave();
					}
				});
			},
			ecgbtn(createTime, startTime, id, rawData) {
				uni.navigateTo({
					url: '/pages/tabBar/main/ecgFull',
					success: (res) => {
						console.log("ecgbtn",
							res)
						const mvArr = this
							.ECGunpackInt16(
								this
								.toArrayBuffer(
									rawData));
						res.eventChannel.emit(
							'sendData',
							mvArr);
						res.eventChannel.emit(
							'startTime',
							startTime);
						res.eventChannel.emit(
							'createTime',
							createTime);
						uni.setStorageSync(
							'sendData',
							mvArr);
					}
				});
			},
			/* ==================== 协议层 ==================== */
			toggleStats() {
				this.statsVisible = !this.statsVisible
			},
			disConnect() {
				if (!this.deviceId) return
				uni.closeBLEConnection({
					deviceId: this.deviceId
				})
				uni.closeBluetoothAdapter()
				this.connected = false
				this.deviceId = ''
				this.notifyCharacteristicId = ''
				this.writeCharacteristicId = ''
				this.dataSource = '未连接'
				this.tip = '已断开'
			},
			/* ==================== ECG方法 end ==================== */
			async loadFiles(bytes, deviceId, serviceId) {
				let that = this
				try {
					const filePath =
						'static/OTA/unique_code.txt';
					const buf = await that.readFile(
						filePath);
					// 2. 统一成字符串
					let rawText;
					if (typeof buf === 'string') {
						rawText = buf; // H5 环境
					} else {
						rawText = [].map.call(
							new Uint8Array(buf),
							b => String
							.fromCharCode(b)).join(
							''); // App 环境
					}
					// 3. 提取唯一码
					const uniqueCode = rawText.match(
						/unique_code:([0-9A-Fa-f]+)/
					)?.[1];
					if (uniqueCode) {
						if (bytes === uniqueCode
							.trim()) {
							uni.hideLoading()
							that.resetDataState()
							if (uni.getStorageSync(
									"arguments00") !==
								1) return
							uni.showModal({
								content: that
									.$t(
										"手表固件已经是最新版本"
									),
								confirmText: that
									.$t('确定'),
								showCancel: false,
								success(
									modal) {
									if (modal
										.confirm
									) {
										uni.removeStorageSync(
											"arguments00"
										)
									}
								}
							});
							return
						} else {
							console.log('uniqueCode',
								uniqueCode)
							uni.removeStorageSync(
								"otadatares")
							if (uni.getStorageSync(
									"arguments00") !==
								1) return
							const ackConfigByteset =
								new Uint8Array(9);
							ackConfigByteset[0] = 0xE0;
							ackConfigByteset[1] = 0x00;
							ackConfigByteset[2] = 0x06;
							ackConfigByteset[3] = 0x20;
							ackConfigByteset[4] = 0x01;
							ackConfigByteset[5] = 0x02;
							ackConfigByteset[6] = 0x00;
							ackConfigByteset[7] = 0x01;
							ackConfigByteset[8] =
								0x01; //0x01是OTA升级，0x02是升级狗
							let ackConfigBytesum2 = 0;
							for (let i = 0; i <
								ackConfigByteset
								.length; i++) {
								ackConfigBytesum2 +=
									ackConfigByteset[
										i];
							}
							ackConfigBytesum2 =
								ackConfigBytesum2 %
								256;
							const modifiedCommand2 =
								new Uint8Array(
									ackConfigByteset
									.length + 1);
							modifiedCommand2.set(
								ackConfigByteset
								.subarray(0, 3), 0);
							modifiedCommand2[3] =
								ackConfigBytesum2;
							modifiedCommand2.set(
								ackConfigByteset
								.subarray(3), 4);
							const hexCommand2 = Array
								.from(modifiedCommand2)
								.map(
									byte =>
									byte.toString(
										16).padStart(2,
										'0')).join('');
							const buffer2 = that
								.toArrayBuffer(
									hexCommand2);
							setTimeout(() => {
								uni.removeStorageSync(
									"arguments00"
								)
								uni.$emit(
									'updateIdChanged',
									1)
								that.resetDataState()
								uni.writeBLECharacteristicValue({
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: that
										.writeuuid,
									writeType: 'writeNoResponse',
									value: buffer2,
									success(
										res
									) {
										uni.hideLoading()
										that.resetDataState()
										uni.$emit(
											'updateIdChanged',
											1
										)
									},
									fail(
										err
									) {
										uni.hideLoading()
										uni.showToast({
											title: that
												.$t(
													"下发升级指令失败"
												),
											icon: 'none'
										})
										that.resetDataState()
									},
								})
							}, 3000)
						}
					} else {
						that.resetDataState()
						console.log("设备唯一码文件为空")
					}
				} catch (e) {
					that.resetDataState()
					if (e.message && e.message
						.includes('不存在')) {
						console.log("设备唯一码文件不存在")
					} else {
						console.log("读取设备唯一码文件失败", e)
					}
				}
			},
			readFile(filePath) {
				return new Promise((resolve,
					reject) => {
					// uni-app H5+方式
					if (typeof plus !==
						'undefined') {
						plus.io
							.resolveLocalFileSystemURL(
								`_www/${filePath}`,
								(
									entry) => {
									entry.file(
										(
											file
										) => {
											const
												reader =
												new plus
												.io
												.FileReader();
											reader
												.onloadend =
												(
													e
												) => {
													resolve
														(e.target
															.result
														);
												};
											reader
												.readAsText(
													file
												);
										},
										reject
									);
								}, reject);
					} else {
						// 如果是H5环境，使用uni.request
						uni.request({
							url: filePath,
							success: (
									res
								) =>
								resolve(
									res
									.data
								),
							fail: reject
						});
					}
				});
			},
			// 血压分类说明弹窗
			xueya_tap() {
				this.$refs.popup.open("center")
			},

			// 血压手动录入
			xueyaclick() {
				this.$refs.qs_popup.open("center")
			},

			// 血压测量链接（点击心率/血氧卡片触发测量）
			xueyaclicklink(type) {
				const that = this
				if (that.devicetype === 10001 && that
					.devicetypelist.length === 1) {
					uni.showToast({
						title: that.$t(
							'遥控测试功能只支持在手表上使用，请确认手表已连接'
						),
						icon: 'none',
						duration: 2000,
					})
					return
				}
				let buffer2 = that.devicetype ===
					30001 ? that.toArrayBuffer(
						"32000000000000000000000000000032"
					) :
					that.toArrayBuffer(
						"e00006f4060105000101") //血压
				if (type === 0) {
					// 首页卡片测心率：固定发心率命令，绝不走 PPG/情绪测量命令
					that.clearBpw1PpgTransferWatchdog(
						'卡片测心率')
					that.bpw1CardHrOnly = true
					that.bpw1AwaitingBpHrPair = false
					that.bpw1PendingBpCompanionHr =
						null
					that.yalixueyatype = false
					that.immediateEmotionMeasure =
						false
					buffer2 = that.devicetype ===
						30001 ? that.toArrayBuffer(
							"38000000000000000000000000000038"
						) :
						that.toArrayBuffer(
							"e00006F3060104000101"
						) //心率（非PPG）
				} else if (type === 1) {
					that.bpw1CardHrOnly = false
					// 主动测血压：进入配对窗口，心率先到也先缓存，两侧到齐再一次上报
					if (that.devicetype === 30000) {
						that.bpw1AwaitingBpHrPair =
							true
						that.xueya_xinlv = true
					}
					buffer2 = that.devicetype ===
						30001 ? that.toArrayBuffer(
							"32000000000000000000000000000032"
						) :
						that.toArrayBuffer(
							"e00006f4060105000101"
						) //血压
				} else if (type === 2) {
					that.bpw1CardHrOnly = false
					buffer2 = that.devicetype ===
						30001 ? that.toArrayBuffer(
							"39000000000000000000000000000039"
						) :
						that.toArrayBuffer(
							"e00006F5060106000101"
						) //血氧
				}

				uni.showModal({
					content: type === 1 ? this
						.$t(
							"测量时请保持安静手表与心脏同高五指张开不要压迫胸口"
						) : this.$t(
							"发送ECG测量命令"),
					confirmText: this.$t('确定'),
					cancelText: this.$t('取消'),
					success(modal) {
						if (modal.confirm) {
							uni.writeBLECharacteristicValue({
								deviceId: that
									.devicetype ===
									30001 ?
									(that
										.deviceIdwatch6 ?
										that
										.deviceIdwatch6 :
										uni
										.getStorageSync(
											"BPW6devicemac"
										)
									) : (that
										.deviceIdwatch ?
										that
										.deviceIdwatch :
										uni
										.getStorageSync(
											"deviceIdwatch"
										)
									),
								serviceId: that
									.devicetype ===
									30001 ?
									BPW6SERVICE : BPW1serviceId,
								characteristicId: that
									.devicetype ===
									30001 ?
									BPW6WRITE : BPW1write,
								writeType: 'writeNoResponse',
								value: buffer2,
								success(
									res
								) {
									uni.showToast({
										title: that
											.$t(
												'开始测量'
											),
										icon: 'none',
										duration: 2000,
									})
									// 仅 BPW1 主动测血压：记录发令时刻，拒绝随后历史同步旧包抢跑 PPG
									if (type ===
										1 &&
										that
										.devicetype ===
										30000
									) {
										that.markBpw1LiveBpMeasureStarted()
									}
								},
								fail(
									err
								) {
									uni.showToast({
										title: that
											.$t(
												'测量发送失败请检查设备'
											),
										icon: 'none',
										duration: 2000,
									})
								},
							})
						}
					}
				})
			},

			// 血压手动录入确认
			truesss() {
				// 检查所有输入字段
				if (!this.checkInput(this.shuzhangya,
						this.$t('请输入收缩压')) ||
					!this.checkInput(this.shousuoya,
						this.$t('请输入舒张压')) ||
					!this.checkInput(this.maibo, this
						.$t('请输入脉搏'))) {
					return;
				}
				this.pressure_data()
			},

			// 用户在app手动上报血压数据
			pressure_data() {
				let now = new Date();
				// 本地日期 yyyy-mm-dd
				const localDate =
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
				// 本地时间 hh:mm
				const localTime =
					`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
				let formattedTime = this
					.birthday1111 === this.$t('今天') ?
					`${localDate} ${localTime}` :
					`${this.birthday1111} ${localTime}`;
				let timestamp = Math.floor(new Date(
						formattedTime).getTime() /
					1000);
				let data = {
					deviceSn: uni.getStorageSync(
						'deviceSn'),
					slaveSn: "0",
					slaveData: {
						lowPressure: this
							.shuzhangya,
						highPressure: this
							.shousuoya,
						heartrate: this.maibo
					},
					time: timestamp,
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				this.$post(this.$url_APP_IP + this
					.$url_pressure_data, data, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json'
					}).then((res) => {
					if (res.code === 200) {
						this.$refs.qs_popup
							.close()
						this.birthday1111 =
							this.$t('今天')
						this.shousuoya = ''
						this.shuzhangya = ''
						this.maibo = ''
						uni.showToast({
							title: this
								.$t(
									"成功"
								),
							icon: 'none'
						})
						this.list_recipe()
					} else {
						uni.showToast({
							title: this
								.$t(
									"失败"
								),
							icon: 'none'
						})
					}
				})
			},
			// BMI分类弹窗
			BMI_tap(id) {
				if (id == this.$t("血氧")) {
					this.$refs.popup2.open("center")
				} else {
					this.$refs.popup1.open("center")
				}
			},
			// 关闭弹窗
			knowe() {
				this.$refs.popup.close()
			},
			knowe1() {
				this.$refs.popup1.close()
			},
			knowe2() {
				this.$refs.popup2.close()
			},
			// 最新体重点击
			new_latest() {
				uni.navigateTo({
					url: '../tendency/Historical_record'
				})
			},

			// 初始体重点击
			Initial() {
				uni.navigateTo({
					url: '../my/Health_record'
				})
			},

			// 目标体重点击
			Target() {
				this.$refs.mubiao_popup.open("center")
			},

			// 目标体重弹窗关闭
			mb_closess() {
				this.$refs.mubiao_popup.close()
			},

			// 目标体重确认
			mubiao_weight() {
				if (this.mubiao === "") {
					uni.showToast({
						title: this.$t(
							"请输入目标体重"),
						icon: 'none'
					})
					return
				} else {
					this.fat_scale_tz1()
				}
			},

			// 体围录入
			tizhiclick() {
				this.fillOut = true
			},

			// 关闭体围录入
			closess() {
				this.fillOut = false
			},

			// 记体重
			Keep() {
				this.fillOut = false
				this.$refs.tizhong_popup.open("center")
			},

			// 记体围
			Body_circumference() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.open(
					"center")
			},

			// 体重确认
			jitizhong_tc() {
				if (this.tizhong === "" || this
					.tizhong === undefined) {
					uni.showToast({
						title: this.$t(
							'请输入体重'),
						icon: 'none'
					})
					return
				} else {
					this.fat_scale_tz()
				}
			},

			// 体围确认（滑动输入）
			select_ruler() {
				this.fat_scale_1()
			},

			// 体围确认（手动输入）
			popup_sd() {
				this.validateAndProceed();
			},

			// 关闭体围弹窗
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

			// 手动输入切换
			sdsr() {
				this.$refs.tihzi_popup_hd.close()
				this.$refs.tihzi_popup_sd.open(
					"center")
			},
			hdsr() {
				this.$refs.tihzi_popup_sd.close()
				this.$refs.tihzi_popup_hd.open(
					"center")
			},
			// 用户在app手动上报体重数据
			fat_scale_tz() {
				const now = new Date();
				const dateStr = this.birthday2 == this
					.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` :
					this.birthday2;
				let timestamp = Math.floor(new Date(
					dateStr).getTime() / 1000);

				const data = {
					deviceSn: uni.getStorageSync(
						"deviceSn"),
					slaveSn: "0",
					slaveData: {
						weight: this.tizhong
					},
					time: timestamp,
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				this.$post(this.$url_APP_IP + this
					.$url_fat_scale, data, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => {
					if (res.code == 200) {
						this.tizhong = ''
						this.birthday2 = this
							.$t('今天')
						uni.showToast({
							title: res
								.msg,
							icon: 'none'
						})
						this.list_recipe()
						this.$refs
							.tizhong_popup
							.close()
					}
				})
			},

			// 用户在app手动上报目标体重
			fat_scale_tz1() {
				const timestamp = new Date(this
						.endtimesss + " " + new Date()
						.getHours() + ":" + new Date()
						.getMinutes())
					.getTime() / 1000;
				const data = {
					deviceSn: uni.getStorageSync(
						"deviceSn"),
					slaveSn: "1",
					slaveData: {
						goal_weight: this.mubiao,
					},
					time: timestamp,
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				this.$post(this.$url_APP_IP + this
					.$url_fat_scale, data, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => {
					if (res.code == 200) {
						this.mubiao = ""
						uni.showToast({
							title: res
								.msg,
							icon: 'none'
						})
						this.$refs.mubiao_popup
							.close()
						this.list_recipe()
					}
				})
			},

			// 用户在app手动上报六围数据（滑动输入）
			fat_scale_1() {
				const now = new Date();
				let timestamp = Math.floor(new Date(
						this.birthday1 == this.$t(
							'今天') ?
						`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` :
						this.birthday1).getTime() /
					1000);
				const data = {
					slaveSn: "1",
					slaveData: {
						start_weight: '',
						goal_weight: '',
						chest_circumference: this
							.xw_value,
						waistline: this.yw_value,
						hipline: this.tw_value,
						biceps_circumference: this
							.stw_value,
						thigh_circumference: this
							.dtw_value,
						calf_circumference: this
							.xtw_value,
					},
					time: timestamp,
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				this.$post(this.$url_APP_IP + this
					.$url_fat_scale, data, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: this
								.$t(
									"成功"
								),
							icon: 'none'
						})
						this.list_recipe()
						this.$refs
							.tihzi_popup_hd
							.close()
					}
				})
			},

			// 用户在app手动上报六围数据（手动输入）
			fat_scale() {
				const now = new Date();
				let timestamp = Math.floor(new Date(
						this.birthday == this.$t(
							'今天') ?
						`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` :
						this.birthday).getTime() /
					1000);
				const data = {
					slaveSn: "1",
					slaveData: {
						start_weight: '',
						goal_weight: '',
						chest_circumference: this
							.xiongwei,
						waistline: this.yaowei,
						hipline: this.tunwei,
						biceps_circumference: this
							.shangtunwei,
						thigh_circumference: this
							.datuiwei,
						calf_circumference: this
							.xiaotuiwei,
					},
					time: timestamp,
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				this.$post(this.$url_APP_IP + this
					.$url_fat_scale, data, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: res
								.msg,
							icon: 'none'
						})
						this.list_recipe()
						this.$refs.mubiao_popup
							.close()
					}
				})
			},
			// 编辑血压卡片
			tiaozhen() {
				this.binaji = false
				this.animation = 'shake';
				this.button_show = true
				this.delate_icon = true
				this.disabledsaaa = true
				this.disabletouch = true
				uni.preloadPage({
					url: '/pages/tabBar/main/card1'
				})
			},

			// 编辑体重卡片
			tiaozhen2() {
				this.binaji2 = false
				this.animation2 = 'shake';
				this.button_show2 = true
				this.delate_icon2 = true
				this.disabledsaaa2 = true
				this.disabletouch = true
				uni.preloadPage({
					url: '/pages/tabBar/main/card'
				})
			},

			// 确认血压卡片编辑
			ture_bt() {
				this.binaji = true
				this.animation = '';
				this.button_show = false
				this.delate_icon = false
				this.disabledsaaa = true
				this.queryDevicesDone = false;
				this.disabletouch = false
				this.cardeditData(this.list,
					"bloodData")
			},

			// 确认体重卡片编辑
			ture_bt2() {
				this.binaji2 = true
				this.animation2 = '';
				this.button_show2 = false
				this.delate_icon2 = false
				this.disabledsaaa2 = true
				this.queryDevicesDone = false;
				this.disabletouch = false
				this.cardeditData(this.list2,
					"WeightData")
			},

			// 添加血压卡片
			add_bt_xy() {
				uni.setStorageSync('kapianlist', this
					.list)
				this.queryDevicesDone = false
				uni.navigateTo({
					url: "../main/card1"
				})
				setTimeout(() => {
					this.cardeditData(this
						.list, "bloodData")
				}, 0)
			},

			// 添加体重卡片
			add_bt2() {
				uni.setStorageSync('kapianlist2', this
					.list2)
				this.queryDevicesDone = false
				uni.navigateTo({
					url: '../main/card'
				})
				setTimeout(() => {
					this.cardeditData(this
						.list2,
						"WeightData")
				}, 0)
			},

			// 删除血压卡片
			delate_icon_cl(name, item) {
				for (let i = 0; this.list.length >
					i; i++) {
					if (this.list[i].title == name) {
						this.list.splice(i, 1)
						let kapianlist = []
						kapianlist = this.list
						this.cardeditData(kapianlist,
							"bloodData")
					}
				}
			},

			// 删除体重卡片
			delate_icon_cl_2(name, item) {
				for (let i = 0; this.list2.length >
					i; i++) {
					if (this.list2[i].title == name) {
						this.list2.splice(i, 1)
						let kapianlist2 = []
						kapianlist2 = this.list2
						this.cardeditData(kapianlist2,
							"WeightData")
					}
				}
			},

			// 卡片点击
			listclisck(item) {
				if (!this.binaji || !item) {
					return;
				}
				console.log("点击了列表", item);
				if (item.title === "心率" || item
					.title === "Heart") {
					console.log("点击了列表心率数据");
					this.xueyaclicklink(0);
				} else if (item.title === "血氧" || item
					.title === "SpO2") {
					console.log("点击了列表血氧数据");
					this.xueyaclicklink(2);
				} else {
					console.log("点击了列表其他数据");
				}
			},
			// 体围滑条值变化
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
			// 时间选择器
			dataclick() {
				this.$refs.myPicker.show();
			},
			dataclick1() {
				this.$refs.myPicker1.show();
			},

			handleSubmit(e) {
				this.birthday =
					`${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},

			handleSubmit1(e) {
				this.birthday1 =
					`${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},

			bindDateChange(e) {
				this.birthday1111 = e.detail.value
			},

			bindDateChange2(e) {
				this.birthday2 = e.detail.value
			},
			// 消息历史
			Historical_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/message"
				})
			},
			// 情绪类型切换
			types_change(e) {
				this.types_index = Number(e.detail
					.value) || 0
				this.ppgresultslist(this.types_index)
				this.ppgresultslist2(this.types_index)
				this.ppgresultslist3(this.types_index)
				uni.setStorageSync("types_index", this
					.types_index)
			},
			// 综合健康指数说明
			health_Explanation() {
				this.$refs.health_Explanationpopu.open(
					"center")
			},
			health_Explanationpopuclose() {
				this.$refs.health_Explanationpopu
					.close()
			},
			// 创建通知
			createNotification(title, content, url) {
				const payload = {
					url: url
				};
				uni.createPushMessage({
					title: title,
					content: content,
					payload: payload,
					options: {
						cover: false, // 是否覆盖上次通知
						when: new Date(), // 通知时间
						// icon: '/static/logo.png', // 通知图标
						// sound: 'system' // 通知声音
					}
				});
			},

			// 发送通知
			Notificationss(name) {
				this.createNotification(this.$t(
						"通知标题"), name,
					'/pages/tabBar/my/Alarms')
			},

			// 检查并通知
			checkAndNotify(key1, key2, value,
				messageKey) {
				const storedValue1 = uni
					.getStorageSync(key1);
				const storedValue2 = uni
					.getStorageSync(key2);
				if ((storedValue1 && value <
						storedValue1) ||
					(storedValue2 && value >
						storedValue2)) {
					if (!uni.getStorageSync(
							"isProcessed")) {
						this.Notificationss(this.$t(
							"测量通知"));
						uni.setStorageSync(
							"isProcessed", true)
						setTimeout(() => {
							uni.removeStorageSync(
								"isProcessed"
							)
						}, 5000)
					}
				}
			},

			// 存储信息检查
			StorageInfo(aaa) {
				let that = this
				if (uni.getStorageSync("swichs")) {
					if (uni.getStorageSync(
							"shuzhangyaId1") || uni
						.getStorageSync(
							"shuzhangyaId2")) {
						that.checkAndNotify(
							"shuzhangyaId1",
							"shuzhangyaId2", aaa
							.lowPressure, "舒张压");
					}
					if (uni.getStorageSync(
							"shousuoyaId1") || uni
						.getStorageSync("shousuoyaId2")
					) {
						that.checkAndNotify(
							"shousuoyaId1",
							"shousuoyaId2", aaa
							.highPressure, "收缩压");
					}
					if (uni.getStorageSync(
							"maiboId1") || uni
						.getStorageSync("maiboId2")) {
						that.checkAndNotify("maiboId1",
							"maiboId2", aaa
							.heartrate, "脉搏");
					}
				}
			},

			// 血氧存储信息检查
			getStorageInfooy(aaa) {
				let that = this
				if (uni.getStorageSync("swichs")) {
					if (uni.getStorageSync(
							"xeuyang1") || uni
						.getStorageSync("xeuyang2")) {
						that.checkAndNotify("xeuyang1",
							"xeuyang2", aaa.oxygen,
							"血氧");
					}
				}
			},

			// 弹窗提醒（历史同步期间一律不弹，避免同步血压高值刷屏）
			bgaaa(lowPressure, highPressure) {
				if (this.isBpw1HistorySyncing()) {
					console.log('【BPW1】历史同步中跳过血压提示弹窗')
					return
				}
				const shouldShowModal = (lowPressure >=
						81 && lowPressure <= 110) ||
					(highPressure >= 121 &&
						highPressure <= 180)
				if (shouldShowModal) {
					uni.showModal({
						title: this.$t("提示"),
						content: this.$t(
							"显示结果弹窗"),
						showCancel: false,
						success: function(
							res) {
							if (res
								.confirm
							) {}
						}
					})
				}
			},
			/** BPW1 是否处于历史同步（用独立标记，不依赖易被中途清掉的 blewatch_id） */
			isBpw1HistorySyncing() {
				return this.bpw1HistorySyncActive ===
					true;
			},
			/** 设备测量时间是否接近手机当前时间（判定为实时测量，而非历史包） */
			isBpw1LikelyLiveVitalTs(deviceTs) {
				const t = Number(deviceTs);
				if (!t || Number.isNaN(t)) {
					return false;
				}
				let now;
				try {
					now = Number(this.datatime(this
						.getTimeAllJSON()
						.YMDHMS));
				} catch (e) {
					now = Math.floor(Date.now() /
						1000);
				}
				if (!now || Number.isNaN(now)) {
					return false;
				}
				return Math.abs(t - now) <= 180;
			},
			/** App 下发血压测量成功时打点，用于拒绝同步中的旧血压抢跑 after_bp PPG */
			markBpw1LiveBpMeasureStarted() {
				this._bpw1LiveBpCmdAt = Date.now();
				try {
					this._bpw1LiveBpCmdDeviceTs =
						Number(this.datatime(this
							.getTimeAllJSON()
							.YMDHMS));
				} catch (e) {
					this._bpw1LiveBpCmdDeviceTs = Math
						.floor(Date.now() / 1000);
				}
			},
			clearBpw1LiveBpMeasureGate(reason) {
				if (!this._bpw1LiveBpCmdAt && !this
					._bpw1LiveBpCmdDeviceTs) {
					return;
				}
				this._bpw1LiveBpCmdAt = 0;
				this._bpw1LiveBpCmdDeviceTs = 0;
			},
			/**
			 * 当前血压包是否允许走「实时合并 / 血压后 PPG」。
			 * - 未由 App 发起测量：保持原 isBpw1LikelyLiveVitalTs（手表侧自发测量不受影响）
			 * - App 已发测量令：设备时间不得早于发令时刻（允许 30s 钟差），避免历史同步旧包抢跑
			 */
			isBpw1BpPacketEligibleForLiveMeasure(
				deviceTs) {
				if (!this.isBpw1LikelyLiveVitalTs(
						deviceTs)) {
					return false;
				}
				const cmdAt = this._bpw1LiveBpCmdAt ||
					0;
				if (!cmdAt) {
					return true;
				}
				// 发令超过 10 分钟视为过期，回退为普通实时判定
				if (Date.now() - cmdAt > 600000) {
					return true;
				}
				const t = Number(deviceTs);
				const cmdTs = Number(this
					._bpw1LiveBpCmdDeviceTs) || 0;
				if (!t || Number.isNaN(t) || !cmdTs) {
					return true;
				}
				// 旧历史包（发令前）拒绝；钟差允许 30 秒
				if (t < cmdTs - 30) {
					console.log(
						'【BPW1】拒绝发令前血压包走实时/PPG', {
							deviceTs: t,
							cmdTs,
							skew: cmdTs - t
						});
					return false;
				}
				return true;
			},
			beginBpw1HistorySync() {
				this.bpw1HistorySyncActive = true;
				this.blewatch_id = "1";
				this._bpw1HistoryDedupQueriedAt = 0;
				if (this._bpw1HistoryMergeTimer) {
					clearTimeout(this
						._bpw1HistoryMergeTimer);
					this._bpw1HistoryMergeTimer = null;
				}
				if (this.bpw1HistorySyncEndTimer) {
					clearTimeout(this
						.bpw1HistorySyncEndTimer);
					this.bpw1HistorySyncEndTimer =
						null;
				}
				// 兜底：设备未回完成包时最长 2 分钟后结束，避免一直抑制实时弹窗
				this.bpw1HistorySyncEndTimer =
					setTimeout(() => {
						this.endBpw1HistorySync(
							'timeout');
					}, 2 * 60 * 1000);
			},
			/**
			 * 历史包合并上报去抖：避免每个心率/血压包都立刻查库+上报，抢 BLE ACK 通道导致 10007。
			 */
			scheduleBpw1HistoryMergeUpload() {
				const that = this;
				if (that._bpw1HistoryMergeTimer) {
					clearTimeout(that
						._bpw1HistoryMergeTimer);
				}
				that._bpw1HistoryMergeTimer =
					setTimeout(() => {
						that._bpw1HistoryMergeTimer =
							null;
						const hrLeft = that
							.hrResult || [];
						const bpLeft = that
							.bpResult || [];
						if (hrLeft.length === 0 &&
							bpLeft.length === 0) {
							return;
						}
						that.mergeAndUploadWithDeduplication(
							hrLeft, bpLeft);
					}, 800);
			},
			/**
			 * 断开/解绑时结束历史同步态：清定时器与缓存，允许下次连接再同步。
			 * 不走 endBpw1HistorySync 的天气/调度写，避免断链后抢写。
			 */
			resetBpw1HistorySyncOnDisconnect(reason) {
				if (this.bpw1HistorySyncEndTimer) {
					clearTimeout(this
						.bpw1HistorySyncEndTimer);
					this.bpw1HistorySyncEndTimer =
						null;
				}
				if (this.bpw1SyncTimer) {
					clearTimeout(this.bpw1SyncTimer);
					this.bpw1SyncTimer = null;
				}
				if (this._bpw1HistoryMergeTimer) {
					clearTimeout(this
						._bpw1HistoryMergeTimer);
					this._bpw1HistoryMergeTimer = null;
				}
				this._bpw1HistoryDedupQueriedAt = 0;
				const wasActive = this
					.bpw1HistorySyncActive === true;
				this.bpw1HistorySyncActive = false;
				this.blewatch_id = "0";
				this.bpResult = [];
				this.hrResult = [];
				this.hasSynced = false;
				if (wasActive) {
					console.log('【BPW1】断开结束历史同步',
						reason || '');
				}
			},
			endBpw1HistorySync(reason) {
				if (this.bpw1HistorySyncEndTimer) {
					clearTimeout(this
						.bpw1HistorySyncEndTimer);
					this.bpw1HistorySyncEndTimer =
						null;
				}
				if (this._bpw1HistoryMergeTimer) {
					clearTimeout(this
						._bpw1HistoryMergeTimer);
					this._bpw1HistoryMergeTimer = null;
				}
				if (this.bpw1HistorySyncActive) {
					console.log('【BPW1】结束历史同步',
						reason || '');
					// 结束前再合并一次：分包先后到达时补报库中缺失的血压/心率；不启 PPG
					const hrLeft = this.hrResult || [];
					const bpLeft = this.bpResult || [];
					if (hrLeft.length > 0 || bpLeft
						.length > 0) {
						try {
							this.mergeAndUploadWithDeduplication(
								hrLeft, bpLeft);
						} catch (e) {
							console.warn(
								'【BPW1】历史同步结束合并失败',
								e);
						}
					}
					// 结束后清空，避免残留未配对血压在后续 merge 中反复尝试
					this.bpResult = [];
					this.hrResult = [];
				}
				this.bpw1HistorySyncActive = false;
				this.blewatch_id = "0";
				this._bpw1HistoryDedupQueriedAt = 0;
				// 历史同步结束后再发天气，避免与历史收包抢通道
				const pendingWeather = this
					.bpw1PendingWeatherAfterHistory
				if (pendingWeather && pendingWeather
					.deviceId) {
					this.bpw1PendingWeatherAfterHistory =
						null
					uni.getNetworkType({
						success: (res) => {
							if (res
								.networkType ===
								'none') {
								console
									.error(
										"当前无网络，无法同步天气"
									);
								return
							}
							setTimeout(
								() => {
									this.getLocalWeather(
										pendingWeather
										.deviceId,
										pendingWeather
										.serviceId ||
										BPW1serviceId,
										pendingWeather
										.writeuuid ||
										BPW1write
									)
								}, 800)
						},
						fail: (err) => {
							console.error(
								'获取网络类型失败：',
								err);
						}
					})
				}
				// 同步命令失败等路径可能未冲配对：结束时再补一次
				const pendingPair = this
					.bpw1PendingPairAudio
				if (pendingPair && pendingPair
					.deviceId) {
					this.bpw1PendingPairAudio = null
					setTimeout(() => {
						this.startBpw1PairAudio(
							pendingPair
							.deviceId)
					}, 1200)
				}
				// 定时调度放到同步结束后，避免连接初期/收历史时抢写
				if (this.bpw1PendingResumeSchedule) {
					this.bpw1PendingResumeSchedule =
						false
					setTimeout(() => {
						import(
								'@/pages/api/qxBleAlignedSchedule.js'
							)
							.then((m) => {
								m.resumeQxBleScheduleIfEnabled()
									.catch(
										() => {}
									)
							}).catch(() => {})
					}, 2000)
				}
			},
			onSubButtonClick(item) {
				// console.log('📱 页面接收到子按钮点击:', item.text)
			},
			// 菜单打开事件
			onMenuOpen() {},
			// 上报数据构建
			buildReportData(type, data) {
				const reportData = {};
				switch (type) {
					case "血氧":
						reportData.oxygen = data;
						break;
					case "步数":
						reportData.steps = data;
						break;
					case "压力":
						reportData.pressure = data;
						break;
					case "体温":
						reportData.temperature = data;
						break;
					case "睡眠":
						reportData.sleep = data;
						break;
					default:
						console.warn("未知类型:", type);
				}
				return reportData;
			},
			/** 上报 time：优先设备测量时间，没有则用手机本地时间 */
			resolveUploadTime(deviceTime) {
				if (deviceTime !== '' && deviceTime !=
					null && deviceTime !== undefined) {
					const num = Number(deviceTime);
					if (!Number.isNaN(num) && num >
						0) {
						return num > 9999999999 ? Math
							.floor(num / 1000) : Math
							.floor(num);
					}
					if (typeof deviceTime ===
						'string' && deviceTime.trim()
					) {
						const parsed = this.datatime(
							deviceTime.trim());
						if (parsed && !Number.isNaN(
								parsed) && parsed >
							0) {
							return parsed;
						}
					}
				}
				return this.datatime(this
					.getTimeAllJSON().YMDHMS);
			},
			// 手表历史数据上报（time 一律用设备传来的测量时间；血压必须带有效心率）
			Watch_Historical_data(deviceId, shousuoye,
				shuzhangya, maibo, deviceSn,
				updatewatchtime) {
				const resolvedTime = this
					.resolveUploadTime(
						updatewatchtime);
				const hasBp = shousuoye !== "" &&
					shousuoye != null && shuzhangya !==
					"" && shuzhangya != null;
				if (hasBp && !this
					.isValidBpw1HeartRate(maibo)) {
					return Promise.resolve({
						code: -1,
						msg: 'missing heartrate'
					});
				}
				let aaa = {
					heartrate: maibo,
				};
				if (hasBp) {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: resolvedTime,
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				console.log("【Watch_Historical_data】",
					data)
				return this.$post(this.$url_APP_IP +
					this.$url_jakoblife_fat_scale,
					data, {
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => {
					console.log(
						"【Watch_Historical_data】上报数据手表",
						res)
					if (res.code === 200 &&
						hasBp && deviceSn) {
						this.scheduleHomeRefreshAfterHistoryUpload(
							deviceSn)
					}
					return res
				}).catch(errro => {
					console.log("errro", errro)
					throw errro
				})
			},
			/** 历史上报成功后去抖拉一次首页，避免每条历史都打 get_device_info */
			scheduleHomeRefreshAfterHistoryUpload(
				deviceSn) {
				if (!deviceSn) {
					return
				}
				if (this
					._bpw1HistoryHomeRefreshTimer) {
					clearTimeout(this
						._bpw1HistoryHomeRefreshTimer
					)
				}
				this._bpw1HistoryHomeRefreshTimer =
					setTimeout(() => {
						this._bpw1HistoryHomeRefreshTimer =
							null
						this.get_device_info(
							deviceSn)
					}, 1000)
			},
			encryptIMEI(imei) {
				const key = CryptoJS.enc.Utf8.parse(
					'a8ac327b09cb4065bdada8949ae8e628'
				);
				const plaintext = CryptoJS.enc.Utf8
					.parse(imei);
				const encrypted = CryptoJS.AES.encrypt(
					plaintext, key, {
						mode: CryptoJS.mode.ECB,
						padding: CryptoJS.pad.Pkcs7
					});
				return encrypted.ciphertext.toString(
					CryptoJS.enc.Base64);
			},
			// 上报血压计数据到PC
			PCjakoblife(parsedData, deviceSn) {
				console.log("parsedData", parsedData)
				console.log(this.encryptIMEI(deviceSn));
				const deviceMeasureTime = parsedData && (parsedData.time || parsedData.tim || parsedData.date);
				let timess = this.resolveUploadTime(deviceMeasureTime)
				let data = {
					customer: parsedData.customer,
					device_type: deviceSn === "1000203200000019" ? "JL-BP67W" : "JL-BP68W",
					device_model: parsedData.device_model,
					imei: deviceSn,
					device_id: this.encryptIMEI(deviceSn),
					startTime: this.getTimeAllJSON().YMDHMSWIFI,
					endTime: this.getTimeAllJSON().YMDHMSWIFI,
					user: parsedData.user,
					sys: parsedData.sys.trim(),
					dia: parsedData.dia.trim(),
					pul: parsedData.pul.trim(),
					thirdType: parsedData.thirdType,
					time: timess,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("上报血压计血压数据", data)
				this.$post("http://jakoblife.jakob-techs.com/prod-api/jakoblife/device_data?", data, {
					'content-type': 'application/x-www-form-urlencoded'
				}).then(resaa => {
					console.log("上报血压计血压数据", resaa)
					if (resaa.code === 200) {
						this.lowPressure = this.Blood === "mmHg" ? parsedData.dia.trim() : (Number(parsedData.dia
							.trim()) * 0.133).toFixed(1);
						this.highPressure = this.Blood === "mmHg" ? parsedData.sys.trim() : (Number(parsedData.sys
							.trim()) * 0.133).toFixed(1);
						this.pulse = parsedData.pul.trim();
						uni.setStorageSync("lowPressure", parsedData.dia.trim())
						uni.setStorageSync("highPressure", parsedData.sys.trim())
						uni.setStorageSync("pulse", parsedData.pul.trim())
					}
				})
			},
			// 上报血压计数据
			jakoblife_fat_scale(deviceId, parsedData,
				deviceSn) {
				const deviceMeasureTime = parsedData && (parsedData.time || parsedData.tim || parsedData.date);
				let timess = this.resolveUploadTime(deviceMeasureTime)
				let aaa = {
					lowPressure: parsedData.dia.trim(),
					highPressure: parsedData.sys.trim(),
					heartrate: parsedData.pul.trim(),
				}
				let data = {
					deviceSn: deviceSn,
					deviceTypeId: "1",
					mac: deviceId,
					slaveData: {
						lowPressure: parsedData.dia.trim(),
						highPressure: parsedData.sys.trim(),
						heartrate: parsedData.pul.trim()
					},
					time: timess,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("上报血压计血压数据", data)
				uni.setStorageSync("xueyadatatype", "0")
				uni.setStorageSync("xueyadata", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8'
				}).then(resaa => {
					if (resaa.code === 200) {
						uni.removeStorageSync("xueyadatatype")
						uni.removeStorageSync("xueyadata")
						this.setbanhua(1)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.StorageInfo(aaa)
						}, 1000)
					}
				})
			},
			// 上报体脂秤数据
			jakoblife_fat_scale1(deviceSn, deviceId,
				parsedData) {
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
					time: this.resolveUploadTime(parsedData.createTime),
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				uni.setStorageSync("tizhidata", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 500) {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
						return
					} else if (res.code === 200) {
						uni.removeStorageSync("tizhidata")
						this.setbanhua(1)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.get_device_data(deviceSn)
						}, 500)
					}
				})
			},
			// 上报手表单次测量数据（无设备测量时间时用手机本地时间）
			jakoblife_fat_scale2(deviceId, shousuoye,
				shuzhangya, maibo, deviceSn) {
				let timess = this.resolveUploadTime('')
				let aaa = {
					heartrate: maibo,
				};
				if (shousuoye !== "" && shuzhangya !== "") {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "1",
					slaveData: aaa,
					time: timess,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8'
				}).then(reslk => {
					if (reslk.code === 500) {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
						return
					} else {
						this.setbanhua(1)
						if (this.QX_HIDE) {
							this.bgaaa(aaa.lowPressure, aaa.highPressure)
						}
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.StorageInfo(aaa)
						}, 1000)
					}
				})
			},
			// 上报手表血压数据（优先设备测量时间；血压+心率合并时统一用血压时间；血压场景心率不可为空）
			// options.showBpAlert === false 时不上报后弹血压高提示（历史同步用）
			jakoblife_fat_scale22(deviceId, shousuoye,
				shuzhangya, maibo, deviceSn,
				updatewatchtime, options = {}) {
				const resolvedTime = this.resolveUploadTime(updatewatchtime);
				const showBpAlert = options.showBpAlert !== false && !this.isBpw1HistorySyncing();
				const hasBp = shousuoye !== "" && shousuoye != null && shuzhangya !== "" && shuzhangya != null;
				if (hasBp && !this.isValidBpw1HeartRate(maibo)) {
					console.log('【BPW1】血压上报缺少有效心率，取消本次上报', {
						highPressure: shousuoye,
						lowPressure: shuzhangya,
						heartrate: maibo
					});
					return;
				}
				let aaa = {
					heartrate: maibo,
				};
				if (hasBp) {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: resolvedTime,
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				uni.setStorageSync("xueyadatatype",
					"1")
				uni.setStorageSync("xueyadata", data)
				console.log("【上报手表血压数据】", data)
				this.$post(this.$url_APP_IP + this
					.$url_jakoblife_fat_scale,
					data, {
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => {
					console.log("【上报数据手表】" +
						data, res)
					if (res.code === 200) {
						uni.removeStorageSync(
							"xueyadatatype"
						)
						uni.removeStorageSync(
							"xueyadata")
						this.setbanhua(1)
						setTimeout(() => {
							if (this
								.QX_HIDE &&
								showBpAlert
							) {
								this.bgaaa(
									aaa
									.lowPressure,
									aaa
									.highPressure
								)
							}
							this.get_device_info(
								deviceSn
							)
							this.StorageInfo(
								aaa
							)
						}, 1000)
					}
				}).catch(errro => {
					console.log("errro", errro)
				})
			},
			// 上报手表数据（通用；time 优先设备测量时间，无则手机本地时间）
			jakoblife_fat_scale3(deviceId, datapar,
				deviceSn, type, timess) {
				const aaa = this.buildReportData(type,
					datapar);
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: this.resolveUploadTime(
						timess),
					measurementTs: this
						.UTCdatatime()
						.timestampSec,
					measurementTimezone: this
						.getTimeAllJSON().YMDHMS,
				}
				console.log(`【${type}】`, data)
				return this.$post(this.$url_APP_IP +
					this.$url_jakoblife_fat_scale,
					data, {
						'content-type': 'application/json;charset=UTF-8'
					}).then(resdb => {
					console.log("【上报手表数据】" +
						type + "：" +
						deviceSn, resdb)
					if (resdb.code === 500) {
						uni.showToast({
							title: this
								.$t(
									"失败"),
							icon: 'none'
						})
						return resdb
					}
					this.setbanhua(1)
					setTimeout(() => {
						this.getStorageInfooy(
							aaa)
						this.get_device_info(
							deviceSn
						)
					}, 1000)
					return resdb
				})
			},
			// 检查输入字段
			checkInput(value, message) {
				if (value === "" || value ===
					undefined) {
					uni.showToast({
						title: message,
						icon: "none"
					});
					return false;
				}
				return true;
			},

			// 验证并继续
			validateAndProceed() {
				const validations = [{
					key: 'xiongwei',
					message: this.$t('请输入胸围'),
					validator: value =>
						value !== "" &&
						value !== undefined
				}, {
					key: 'yaowei',
					message: this.$t('请输入腰围'),
					validator: value =>
						value !== "" &&
						value !== undefined
				}, {
					key: 'tunwei',
					message: this.$t('请输入臀围'),
					validator: value =>
						value !== "" &&
						value !== undefined
				}, {
					key: 'shangtunwei',
					message: this.$t('请输入上臂围'),
					validator: value =>
						value !== "" &&
						value !== undefined
				}, {
					key: 'datuiwei',
					message: this.$t('请输入大腿围'),
					validator: value =>
						value !== "" &&
						value !== undefined
				}, {
					key: 'xiaotuiwei',
					message: this.$t('请输入小腿围'),
					validator: value =>
						value !== "" &&
						value !== undefined
				}];
				for (let i = 0; i < validations
					.length; i++) {
					const {
						key,
						message,
						validator
					} = validations[i];
					if (!validator(this[key])) {
						uni.showToast({
							title: message,
							icon: 'none'
						});
						return;
					}
				}
				this.fat_scale();
			},
			// 判断是否为生命体征卡片图标
			isVitalCardIcon(title) {
				if (!title) return false
				const t = String(title)
				return t === this.$t('心率') || t ===
					this.$t('血氧') || t === 'Heart' ||
					t === 'SpO2'
			},
			// 获取心电图波形引用
			getWaveRef() {
				return this.$refs.ecgSwiperItem && this
					.$refs.ecgSwiperItem.$refs.wave;
			},
			// 显示完整波形
			showFullWaveform() {
				if (this.hasMeasurementData) {
					this.getWaveRef().showFullWave();
					this.tip =
						'显示完整测量波形，可使用放大缩小功能查看细节';
				} else {
					uni.showToast({
						title: '暂无测量数据',
						icon: 'none'
					});
				}
			},
			// 清空波形数据
			clearWave() {
				this.getWaveRef().clear();
				this.dataCount = 0;
				this.fullDataCount = 0;
				this.queueLength = 0;
				this.measurementStatus = '';
				this.tip = '数据已清空';
			},
			// 切换调试面板
			toggleDebug() {
				this.showDebug = !this.showDebug;
			},
			// 16进制转ASCII
			hexToAscii(hexString) {
				let str = '';
				for (let i = 0; i < hexString
					.length; i += 2) {
					let hex = hexString.substr(i, 2);
					str += String.fromCharCode(
						parseInt(hex, 16));
				}
				return str;
			},
			// 解析查询字符串
			parseQueryString(queryString) {
				let params = queryString.split('&');
				let result = {};
				params.forEach(param => {
					let [key, value] = param
						.split('=');
					result[key] = value;
				});
				return result;
			},

			// 计算校验和
			calculateChecksum(data) {
				let sum = 0;
				for (let i = 0; i < data.length; i +=
					2) {
					sum += parseInt(data.substr(i, 2),
						16);
				}
				return (sum & 0xFF).toString(16)
					.padStart(2, '0');
			},
			// 十进制转十六进制
			decimalToHex(decimal, length = 2) {
				const hex = decimal.toString(16)
					.toUpperCase();
				return hex.padStart(length, '0');
			},
			// 十六进制转十进制
			hexToDecimal(hexString) {
				return parseInt(hexString, 16);
			},
			// 时间字符串转分钟
			timeStrToMinutes(str = '') {
				const upper = str.toUpperCase();
				let h = 0,
					m = 0;
				const hMatch = upper.match(
					/(\d+)\s*H/);
				if (hMatch) h = Number(hMatch[1]);
				const mMatch = upper.match(
					/(\d+)\s*M/);
				if (mMatch) m = Number(mMatch[1]);
				return h * 60 + m;
			},
			// 时间戳格式化
			formatTimestampKey(timestamp) {
				const ts = this.normalizeUnixTimestamp(
					timestamp);
				if (ts == null) {
					return '';
				}
				const beijingDate = new Date(ts *
					1000 + 8 * 3600000);
				const year = beijingDate
					.getUTCFullYear();
				const month = String(beijingDate
					.getUTCMonth() + 1).padStart(2,
					'0');
				const day = String(beijingDate
					.getUTCDate()).padStart(2, '0');
				const hours = String(beijingDate
					.getUTCHours()).padStart(2,
					'0');
				const minutes = String(beijingDate
					.getUTCMinutes()).padStart(2,
					'0');
				const seconds = String(beijingDate
					.getUTCSeconds()).padStart(2,
					'0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			// 时间转时间戳
			datatime(dateStr) {
				let isoStr = dateStr.replace(' ',
					'T') + '+08:00';
				let timestamp = new Date(isoStr)
					.getTime();
				let timestampInSeconds = Math.floor(
					timestamp / 1000);
				return timestampInSeconds
			},
			// int转hex
			intToHex(num, prefix = false, padLength =
				0) {
				let hex = num.toString(16)
					.toUpperCase();
				if (padLength > 0) {
					hex = hex.padStart(padLength, '');
				}
				return prefix ? hex : hex;
			},
			// PPG配置字节解析
			parsePPGConfigDescOrder(configByte) {
				const byte = Number(configByte);
				const binaryStr = byte.toString(2)
					.padStart(8, '0');
				const bits = binaryStr.split('').map(
					b => parseInt(b));
				return {
					reservedBits: binaryStr.slice(0,
						4),
					hasAmbientLight: bits[4],
					hasInfraredLight: bits[5],
					hasRedLight: bits[6],
					hasGreenLight: bits[7],
					rawByte: byte,
					hexString: '0x' + byte.toString(16)
						.padStart(2, '0')
						.toUpperCase(),
					binaryString: binaryStr,
					bitArray: bits
				};
			},
			// 打包Int16数组
			packInt16(arr) {
				let signalMin = Math.min(...arr);
				let signalMax = Math.max(...arr);
				let voltageRange = Math.max(Math.abs(
					signalMin), Math.abs(
					signalMax)) * 1.2;
				const scale = 32767 / voltageRange;
				const n = arr.length;
				const ab = new ArrayBuffer(n * 2);
				const view = new DataView(ab);
				let int_data = [];
				for (let i = 0; i < n; i++) {
					let original = arr[i];
					let scaled = original * scale;
					let int16 = Math.round(scaled);
					view.setInt16(i * 2, int16, true);
					int_data.push(int16);
				}
				let base64 = uni.arrayBufferToBase64(
					ab);
				return base64;
			},
			/**
			 * BPW6 PPG：设备侧已是小端 32 位 ADC 字节流，按 INT32 原样打包为 base64（不做 Int16 缩放）
			 * @param {number[]} bytesOrSamples - 原始字节(0~255)或已解析的 Int32 采样点
			 */
			packBpw6PpgInt32(bytesOrSamples) {
				const list = Array.isArray(
						bytesOrSamples) ?
					bytesOrSamples : []
				if (!list.length) {
					return uni.arrayBufferToBase64(
						new ArrayBuffer(0))
				}
				// 输入已是原始字节流：对齐到 4 字节后原样上传
				const looksLikeBytes = list.every((
						v) => Number.isInteger(v) &&
					v >= 0 && v <= 255)
				if (looksLikeBytes) {
					const usable = list.length - (list
						.length % 4)
					const ab = new ArrayBuffer(usable)
					const view = new Uint8Array(ab)
					for (let i = 0; i < usable; i++) {
						view[i] = list[i] & 0xFF
					}
					return uni.arrayBufferToBase64(ab)
				}
				// 输入已是 Int32 采样点：小端写入
				const n = list.length
				const ab = new ArrayBuffer(n * 4)
				const view = new DataView(ab)
				for (let i = 0; i < n; i++) {
					view.setInt32(i * 4, list[i] | 0,
						true)
				}
				return uni.arrayBufferToBase64(ab)
			},
			// 解包Int16数组
			unpackInt16(base64Str,
				originalVoltageRange) {
				const binaryString = atob(base64Str);
				const bytes = new Uint8Array(
					binaryString.length);
				for (let i = 0; i < binaryString
					.length; i++) {
					bytes[i] = binaryString.charCodeAt(
						i);
				}
				const ab = bytes.buffer;
				const int16Array = new Int16Array(ab);
				const n = int16Array.length;
				let voltageRange =
					originalVoltageRange || 0;
				if (voltageRange === 0) {
					const maxAbs = Math.max(...
						int16Array.map(v => Math
							.abs(v)));
					voltageRange = (maxAbs / 32767) *
						1.2;
				}
				const scale = 32767 / voltageRange;
				const floatData = [];
				for (let i = 0; i < n; i++) {
					const int16Val = int16Array[i];
					const originalVal = int16Val /
						scale;
					floatData.push(originalVal);
				}
				return floatData;
			},
			// 综合睡眠评分
			overallSleepScore(totalAll, totalH,
				deepMin, remMin, lightMin) {
				if (totalAll === 0) return "--/--"
				// 1. 睡眠时长得分 0~100（权重30%）
				let durationScore;
				if (totalH >= 7) durationScore = 100;
				else if (totalH >= 6) durationScore =
					80;
				else if (totalH >= 5) durationScore =
					60;
				else durationScore = 30;
				// 2. 睡眠结构得分 0~100（权重35%）
				const pct = (min) => (min / totalAll) *
					100;
				const d = pct(deepMin);
				const r = pct(remMin);
				const l = pct(lightMin);
				let structScore = 100;
				if (d < 20) structScore -= Math.ceil((
					20 - d) / 5) * 10;
				else if (d > 25) structScore -= Math
					.ceil((d - 25) / 5) * 10;
				if (r < 20) structScore -= Math.ceil((
					20 - r) / 5) * 10;
				else if (r > 25) structScore -= Math
					.ceil((r - 25) / 5) * 10;
				if (l > 55) structScore -= Math.ceil((
					l - 55) / 5) * 5;
				structScore = Math.max(0, structScore);
				const efficiencyScore = 80;
				const latencyScore = 80;
				// 3. 加权求和
				const finalScore = durationScore *
					0.30 + structScore * 0.35 +
					efficiencyScore * 0.20 +
					latencyScore *
					0.15;
				return Math.round(finalScore);
			},
			// 计算睡眠分钟数
			calcSleepMinutes(sleepObj) {
				const formalMinutes = sleepObj
					.totalLight + sleepObj.totalDeep +
					sleepObj.totalRem;
				const Light = sleepObj.totalLight
				const Deep = sleepObj.totalDeep
				const Rem = sleepObj.totalRem
				const napMinutes = sleepObj.partList
					.filter(p => p.type === 10000)
					.reduce((sum, p) => sum + p.time,
						0);
				const totalWithNap = formalMinutes +
					napMinutes;
				return {
					formalMinutes,
					formalReadable: `${Math.floor(formalMinutes / 60)}${"H"}${formalMinutes % 60}${"M"}`,
					napMinutes,
					napReadable: `${Math.floor(napMinutes / 60)}${"H"}${napMinutes % 60}${"M"}`,
					totalWithNap,
					totalReadable: `${Math.floor(totalWithNap / 60)}${"H"}${totalWithNap % 60}${"M"}`,
					Light,
					totalLight: `${Math.floor(Light / 60)}${"H"}${Light % 60}${"M"}`,
					Deep,
					totalDeep: `${Math.floor(Deep / 60)}${"H"}${Deep % 60}${"M"}`,
					Rem,
					totalRem: `${Math.floor(Rem / 60)}${"H"}${Rem % 60}${"M"}`,
				};
			},
		},
	}
</script>

<style scoped lang="scss">
	.debug-panel {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 500rpx;
		background: rgba(0, 0, 0, 0.95);
		border-top: 2rpx solid #00FF00;
		z-index: 999;
	}

	.debug-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background: #1a1a1a;
		color: #00FF00;
		font-weight: bold;
		border-bottom: 1rpx solid #333;
	}

	.debug-toggle {
		color: #FF4444;
		cursor: pointer;
		padding: 10rpx;
	}

	.debug-content {
		height: 430rpx;
		padding: 20rpx;
	}

	.debug-text {
		font-family: monospace;
		font-size: 20rpx;
		color: #00FF00;
		white-space: pre-wrap;
		word-break: break-all;
		line-height: 1.4;
	}

	.debug-float-btn {
		position: fixed;
		bottom: 40rpx;
		right: 40rpx;
		width: 120rpx;
		height: 120rpx;
		background: linear-gradient(135deg, #00FF00, #00AA00);
		color: #000;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		box-shadow: 0 4rpx 20rpx rgba(0, 255, 0, 0.3);
		z-index: 998;
		font-size: 28rpx;
	}

	.connection-status {
		position: fixed;
		top: 40rpx;
		right: 40rpx;
		padding: 10rpx 20rpx;
		background: rgba(255, 68, 68, 0.8);
		color: #000;
		border-radius: 4rpx;
		font-size: 24rpx;
		font-weight: bold;
		z-index: 997;
	}

	.connection-status.connected {
		background: rgba(76, 175, 80, 0.8);
		color: #000;
	}

	.title_zs {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		color: white;
		padding-top: 70px;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_zs_1 {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: white;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_zs_ZM {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: #667eea;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_zs_ppg {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: black;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.pulse-diagnosis-tab {
		background: linear-gradient(135deg, #e0f2e9 0%, #b9dfcc 100%);
		padding-bottom: 80px;
		min-height: 100%;
	}

	.scroll-view-pulse {
		background: linear-gradient(135deg, #e0f2e9 0%, #b9dfcc 100%);
	}

	.title_zs_ppg_2 {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		color: black;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}


	.btnstyle {
		margin-top: 20px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}

	.title_zs_ECG {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: red;
		padding-bottom: 5px;
		margin-top: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.yemiance {
		display: flex;
		flex-direction: row;
		margin-top: 5px;
	}

	.tzsdjk {
		background: white;
		border-radius: 20px;
		padding: 10px;
		width: 45vw;
		margin-left: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.displayst {
		display: flex;
		align-items: center;
	}

	.imghhhh {
		width: 25px;
		height: 25px;
		object-fit: contain;
	}

	.zuixintz {
		font-size: 18px;
		margin-left: 10px;
	}

	.zuixintz_1 {
		margin-top: 30px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.zuixintz_2 {
		font-size: 44px;
		font-weight: bold;
	}

	.zuixintz_3 {
		margin-top: 15px;
		margin-left: 10px;
	}

	.zuixintz_4 {
		text-align: right;
		margin-top: 20px;
		font-size: 18px;
	}

	.zuixintz_5 {
		margin-left: 20px;
		margin-right: 20px;
		width: 40vw;
		background: white;
		border-radius: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.Initialsty {
		display: flex;
		align-items: center;
		padding: 10px;
	}

	.imgaaa1 {
		width: 20px;
		height: 20px;
		object-fit: contain;
	}

	.title_zs_is {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		color: #3298F7;
		padding-top: 70px;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
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
			opacity: 0.9; //灞炴ф寚定了涓涓厓素的涓嶉忔槑搴︺傛崲瑷֮，opacity 灞炴ф寚定了涓涓厓素后面的背景的踲盖程度】
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999; //这һ步很閲嶈
		}
	}

	.title_all {
		background: #3298F7;
		border-bottom: 1px solid white;
		width: 100%;
		padding-top: 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.title_all_1 {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
	}

	.imagehsd_1 {
		width: 25px;
		height: 25px;
		padding-left: 20px;
		object-fit: contain;
	}

	.title {
		color: white;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
	}

	.bangsust {
		padding-right: 20px;
		color: white;
		font-size: 16px;
	}

	.title1 {
		color: white;
		display: flex;
		width: 100%;
		justify-content: flex-start;
		align-items: left;
		text-align: left;
		flex-direction: column;
		font-weight: 400;
		font-size: 13px;
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

	.data_bg_A_set {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 0 80px 0;
	}

	.data_bg_ppg_set {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		padding: 20px 0 20px 0;
	}

	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 0 0 0;
	}

	.data_bg_A_1 {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 20px 80px 20px;
		font-size: 16px;
		font-weight: 400;
	}

	.yali1 {
		display: flex;
		justify-content: space-between;
	}

	.yali2 {
		background: gainsboro;
		width: auto;
		height: 1px;
		margin-top: 10px;
		margin-bottom: 5px;
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

	.icon_text_bg {
		margin-top: 10px;
		width: 26px;
		height: 18px;
		font-size: 13px;
		text-align: center;
		font-weight: bold;
	}

	.yalistyd {
		flex: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.yalistyds {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.yalistyd_1 {
		font-weight: bold;
		font-size: 16px;
	}

	.yalistyd_2 {
		color: #999999;
		font-size: 10px;
		font-weight: 400;
	}

	.yalistyd_3 {
		text-align: right;
		font-size: 13px;
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

	.ponsdtdss {
		position: fixed;
		left: 0;
		top: 0;
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

	.buttonstylesds {
		margin: 20px 50px 20px 50px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
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

	.title_select_ruler {
		padding-left: 10px;
		font-weight: bold;
		width: 50px;
		white-space: nowrap;
		overflow: auto;
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

	.card-vital-icon-halo {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		border: 2px solid rgba(50, 152, 247, 0.4);
		box-shadow: 0 0 8px rgba(50, 152, 247, 0.45);
		animation: cardVitalHaloPulse 1.6s ease-in-out infinite;
	}

	.card-vital-icon-img {
		position: relative;
		z-index: 1;
		width: 44px;
		height: 44px;
		object-fit: contain;
	}

	@keyframes cardVitalHaloPulse {

		0%,
		100% {
			opacity: 0.75;
		}

		50% {
			opacity: 1;
		}
	}

	.bp-measure-btn {
		padding: 6px 0;
		min-width: 56px;
	}

	.bp-measure-icon-wrap {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: rgba(50, 152, 247, 0.14);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(50, 152, 247, 0.18);
	}

	.img_style_celiang {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: contain;
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

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.bp-measure-icon-anim {
		animation: bpMeasurePulse 1.4s ease-in-out infinite;
	}

	@keyframes bpMeasurePulse {

		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}

		25% {
			transform: scale(1.1);
			opacity: 0.94;
		}

		50% {
			transform: scale(1);
			opacity: 1;
		}

		75% {
			transform: scale(1.05);
			opacity: 0.97;
		}
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

	.tiwei_bg {
		padding: 5px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.tizhong_item_2 {
		margin: 5px 0 10px 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.Initialsty_1 {
		font-size: 18px;
		font-weight: bold;
		color: black;
	}

	.Initialsty_2 {
		margin-left: 5px;
		color: gray;
	}

	.bgview {
		margin: 5px 0 5px 8px;
		background: gainsboro;
		width: 33vw;
		height: 1px;
	}

	.data_item_bg {
		display: flex;
		flex-direction: row;
		background: white;
		width: 45vw;
		margin-left: 10px;
		margin-right: 5px;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		padding: 10px;
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




	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
	}

	.elementsduu {
		display: flex;
		flex-direction: column;
		font-weight: bold;
		margin-right: 5px;
	}



	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.drag-containersss {
		display: flex;
		justify-content: center;
		padding-left: 20px;
	}

	.all {
		background: #EFEFF4;

		.animation-shake {
			animation: shake 1s infinite;
		}

		.animation2-shake {
			animation: shake 1s infinite;
		}
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

	.xueyastyleppgs {
		width: 100%;
		border-radius: 24px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.xueyastyle_aa {
		background: #222328;
		color: white;
		padding: 10px;
		margin: 10px 10px 0 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
	}

	.xueyastyle_aa_PPG {
		color: black;
		padding: 10px;
		margin: 10px 10px 0 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
	}

	.xueyastyle_bb {
		background: #A6CE39;
		color: black;
		padding: 10px;
		margin: 0 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
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


	/* 妯悜滚动容器 */
	.navscroll {
		width: 100%;
		white-space: nowrap;
		padding: 10px 5px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		text-align: center;

		::-webkit-scrollbar {
			width: 4px !important;
			height: 1px !important;
			overflow: auto !important;
			background: transparent !important;
			-webkit-appearance: auto !important;
			display: block;
		}
	}

	/* 导航椤瑰鍣?- 用于水平排列 */
	.nav-container {
		display: inline-flex;

	}

	/* 姣忎釜瀵艰埅椤?*/
	.item {
		width: 100%;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 0 20px;
		position: relative;
	}

	/* 瀵艰埅鏂囧瓧 */
	.tab-text {
		color: white;
		font-size: 16px;
		padding: 5px 0;
		font-weight: 400;
		transition: color 0.3s;
	}

	/* 閫変腑鐘舵€佺殑鏂囧瓧 */
	.tab-text.active {
		color: greenyellow;
		font-size: 16px;
		font-weight: 400;
	}

	/* 下划绾?*/
	.underline {
		width: 100%;
		height: 2px;
		background-color: greenyellow;
		border-radius: 10px;
	}

	.scroll-view-height {
		padding-top: 80px;
	}

	.scroll-view {
		margin-top: 20px;
	}

	/* 请根鎹疄际需求修改父Ԫ素尺壬组件自动ʶ鍒楂?*/
	.charts-box {
		height: 300px;
		margin-top: 20px;
		padding: 30px 0 20px 0;
		background: white;
		border-radius: 20px;
		margin-left: 15px;
		margin-right: 15px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	}

	/* 定义通用样式 */
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

	.common-input {
		text-align: center;
		width: 80vw;
	}

	.common-button {
		margin: 40px 50px 20px 50px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
	}

	.popup-content {
		display: flex;
		text-align: left;
		align-items: center;
		justify-content: center;
		border-radius: 20px;
		padding: 15px;
		margin: 20px;
		margin-top: 80px;
		background-color: #fff;
	}

	.delete-button {
		position: absolute;
		top: 0;
		left: 0;
		/* 关键：扩大点击区鍩?*/
		background: rgba(0, 0, 0, 0.01);
		/* iOS 必须有点东西才能响应 */
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

	.context_btn2 {
		display: flex;
		margin-left: 5px;
		flex-direction: row;
		background: white;
		align-items: center;
		border-radius: 100px;
		padding: 15px;
	}

	.context_title1 {
		width: 90%;
		font-size: 14px;
		color: black;
	}

	.sleep-card {
		font-size: 14px;
		font-weight: 600;
		color: #3298f7;
	}

	.sleep-title {
		margin-bottom: 6px;
		font-size: 16px;
	}

	.sleep-line {
		color: #040000;
		font-weight: 600;
		font-size: 14px;
		margin-top: 4px;
	}

	.icon_item_bg_toast {
		background: white;
		text-align: center;
		color: #3298F7;
		display: flex;
		padding: 15px;
		justify-content: center;
		align-items: center;
	}

	.ecgdatarows_sty {
		margin: 20px 20px 0 20px;
	}


	//ECGs
	/* 样式保持不变，只添加了完整波形按閽殑禁用鐘舵?*/
	.btn:disabled {
		opacity: 0.5;
	}

	/* 核心样式，其余沿用你之前的即鍙?*/
	.page {
		display: flex;
		flex-direction: column;
		/* height: 100vh; */
		padding-bottom: 100px;
		background: white;
	}

	.ecg-container {
		padding: 10px;
		overflow: visible;
		/* 减去左右 margin */
		box-sizing: border-box;
	}


	.control-panel {
		// background: #fff;
		// border-radius: 16rpx;
		padding: 24px;
		margin-top: 240px;
		// margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		// box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
	}

	.status-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		gap: 16rpx;
	}

	.status-indicator {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		background: #e0e0e0;
	}

	.status-indicator.connected {
		background: #07c160;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1
		}

		50% {
			opacity: .6
		}

		100% {
			opacity: 1
		}
	}

	.button-row {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.btn {
		flex: 1;
		min-width: 160rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		border: none;
	}

	.btn.primary {
		background: #007aff;
		color: #fff;
	}

	.btn.warn {
		background: #ff3b30;
		color: #fff;
	}

	.btn.secondary {
		background: #f0f0f0;
		color: #333;
	}

	.tip {
		font-size: 24rpx;
		color: #666;
		text-align: center;
	}

	.stats-panel {
		background: #fff;
		border-radius: 16rpx;
		padding: 24px;
		// margin-bottom: 100px;
		margin-left: 10px;
		margin-right: 10px;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 0;
	}

	.stats-label {
		font-size: 26rpx;
		color: #666;
	}

	.stats-value {
		font-size: 26rpx;
		color: #333;
		font-family: monospace;
	}

	.toggle-button1 {
		font-size: 10px;
		color: #007aff;
		margin-left: 5px;
		text-align: left;
	}

	.text-content {
		font-size: 10px;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		/* 榛樿显ʾ3琛?*/
		-webkit-box-orient: vertical;
	}

	.text-content.expanded {
		-webkit-line-clamp: unset;
		padding: 0 20px 80px 20px;
		/* 展开时显示全部内瀹?*/
	}

	.log {
		height: 300px;
		background: #f5f5f5;
		font-size: 24rpx;
	}

	.charts-box-2 {
		padding: 5px;
		background: white;
		border-radius: 20px;
		height: auto;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
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

	/* 琛?*/
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

	/* 绾㈣壊楂樹寒 */
	.red {
		color: #e60012;
		font-weight: 500;
	}

	.log {
		height: 500px;
		background: #f5f5f5;
		font-size: 24rpx;
		padding: 20px;
		box-sizing: border-box;
	}

	.log-item {
		line-height: 1.5;
		margin-bottom: 10rpx;
		word-break: break-all;
		white-space: pre-wrap;
	}
</style>