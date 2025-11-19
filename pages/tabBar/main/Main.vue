<template>
	<view class="all">
		<swiper class="scroll-view-height" :style="{height: screenHeight + 'px'}" @change="swipeIndex"
			:current="currentIndex" acceleration="true" skip-hidden-item-layout="true"
			disable-programmatic-animation="true" :disable-touch="disabletouch">
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<view class="data_bg">
							<view class="icon_bg" @click="xueyaclick()">
								<image lazy-load src="../../../static/icons/3.png" class="img_style" mode="aspectFit" />
								<text class="icon_text_bg">{{$t('血压')}}</text>
							</view>
							<view class="xueya_all">
								<view v-if="xueya == 0" class="xueya_item">
									<view class="xueya_bg"></view>
									<view class="common-style">
										<view class="common-text">{{title_name}}</view>
										<uni-icons type="help" size="15" @tap="xueya_tap"></uni-icons>
									</view>
								</view>
								<view v-else-if="xueya == 1" class="xueya_item">
									<view class="xueya_bg_1"></view>
									<view class="common-style">
										<view class="common-text">{{title_name}}</view>
										<uni-icons type="help" size="15" @tap="xueya_tap"></uni-icons>
									</view>
								</view>
								<view v-else-if="xueya == 2" class="xueya_item">
									<view class="xueya_bg_2"></view>
									<view class="common-style">
										<view class="common-text">{{title_name}}</view>
										<uni-icons type="help" size="15" @tap="xueya_tap"></uni-icons>
									</view>
								</view>
								<view v-else-if="xueya == 3" class="xueya_item">
									<view class="xueya_bg_3"></view>
									<view class="common-style">
										<view class="common-text">{{title_name}}</view>
										<uni-icons type="help" size="15" @tap="xueya_tap"></uni-icons>
									</view>
								</view>
								<view v-else-if="xueya == 4" class="xueya_item">
									<view class="xueya_bg_4"></view>
									<view class="common-style">
										<view class="common-text">{{title_name}}</view>
										<uni-icons type="help" size="15" @tap="xueya_tap"></uni-icons>
									</view>
								</view>
								<view class="borstysdl"></view>
								<view @click="xueyaclick()" class="yalisdsty">
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
										<view class="yalisdjjj2">{{pulse}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="data_bg_A">
							<view class="title_zs1">{{$t('血压计注意事项')}}</view>
							<view v-show="binaji" class="tzkpsx" @click="tiaozhen()">{{$t("编辑数据卡片")}}</view>
							<view class="drag-containersss">
								<basic-drag v-model="list" :disabled="disabledsaaa" itemKey="title" :column="2"
									itemHeight="130px" @update:disabled="handleUpdateDisabled1">
									<template #item="{element}">
										<view class="data_item_bgsss" :class="'animation-' + animation">
											<view class="icon_bgsss">
												<image lazy-load :src="element.image" class="img_style"
													mode="aspectFit" />
												<text class="icon_text_bgsss">{{element.title}}</text>
											</view>
											<view class="elementsduu">
												<view v-if="element.bmi_show">
													<view class="xueya_item">
														<text class="tesdtsdsdk">{{element.BMI_ys}}</text>
														<uni-icons type="help" size="15"
															@tap="BMI_tap(element.title)" />
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
												@touchstart.stop.prevent="delate_icon_cl(element.title, element)"
												hover-class="del-hover">
												<image src="/static/icons/minus_filled.png" class="delete-icon"
													mode="aspectFit" />
											</view>
										</view>
									</template>
								</basic-drag>
							</view>
							<view v-show="button_show" class="btnshow">
								<view class="tuodongsd">{{$t('长按拖动可调整数据卡片位置')}}</view>
								<view class="quernsda">
									<view @click="ture_bt()" class="cardstyle_1">{{$t('确认')}}</view>
									<view @click="add_bt_xy()" class="cardstyle_2">{{$t('添加数据卡片')}}</view>
								</view>
							</view>
							<view>
								<image class="imashtylkkk" lazy-load src="/static/image/yundomng.png"
									mode="aspectFit" />
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- ECG start-->
			<!-- 	<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view"
					:scroll-anchoring="true" enhanced bounces>
					<view style="background: white;">
						<view class="title_zs_ECG">{{$t("本页面显示均为最近测量数据")}}</view>
						<view class="page">
							<view class="ecg-container"><ecg-wave ref="wave" /></view>

							<view class="control-panel">
								<view class="status-row">
									<view class="status-indicator" :class="{ connected: connected }" />
									<text class="status-text">{{ connected ? '血压计已连接' : '血压计未连接' }}</text>
									<text class="data-source">{{ dataSource }}</text>
								</view>

								<view class="button-row">
									<button class="btn primary" @tap="toggleConnect" :loading="connecting"
										:disabled="connecting">
										{{ connected ? '断开' : '连接血压计测量' }}
									</button>
									<button class="btn secondary" @tap="showFullWaveform"
										:disabled="!hasMeasurementData">完整波形</button>
									<button class="btn secondary" @tap="clearWave">清空波形</button>
									<button class="btn secondary"
										@tap="toggleStats">{{ statsVisible ? '隐藏' : '显示' }}信息</button>
									<button class="btn secondary" @tap="startbtn">发送命令测量</button>
								</view>

								<text class="tip">{{ tip }}</text>
							</view>

							<view class="stats-panel" v-if="statsVisible">
								<view class="stats-row">
									<text class="stats-label">实时数据点数:</text>
									<text class="stats-value">{{ dataCount.toLocaleString() }}</text>
								</view>
								<view class="stats-row">
									<text class="stats-label">完整数据点数:</text>
									<text class="stats-value">{{ fullDataCount.toLocaleString() }}</text>
								</view>
								<view class="stats-row">
									<text class="stats-label">队列长度:</text>
									<text class="stats-value">{{ queueLength }}</text>
								</view>
								<view class="stats-row" v-if="measurementStatus">
									<text class="stats-label">测量状态:</text>
									<text class="stats-value">{{ measurementStatus }}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item> -->
			<!-- ECG end-->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class=" title_zs_1">{{$t('本页面显示均为最近测量数据')}}</view>
						<view class="yemiance">
							<view @click="new_latest()" class="tzsdjk">
								<view class="displayst">
									<image class="imghhhh" lazy-load src="../../../static/icons/6.png"
										mode="aspectFit" />
									<text class="zuixintz">{{$t('最新体重')}}</text>
								</view>
								<view class="zuixintz_1">
									<text class="zuixintz_2">{{Latest_weight}}</text>
									<text class="zuixintz_3">{{newweightKG}}</text>
								</view>
								<view class="zuixintz_4">{{Latest_date}}</view>
							</view>
							<view class="zuixintz_5">
								<view @click="Initial()">
									<view class="Initialsty">
										<image class="imgaaa1" lazy-load src="../../../static/icons/6.png"
											mode="aspectFit" />
										<text style="margin-left: 5px;">{{$t('初始体重')}}</text>
									</view>
									<view class="tizhong_item_2">
										<text class="Initialsty_1">{{Initial_weight}}</text>
										<text class="Initialsty_2">{{chuhsikg}}</text>
									</view>
								</view>
								<view class="bgview" />
								<view @click="Target()">
									<view class="Initialsty">
										<image class="imgaaa1" lazy-load src="../../../static/icons/6.png"
											mode="aspectFit" />
										<text style="margin-left: 5px;">{{$t('目标体重')}}</text>
									</view>
									<view class="tizhong_item_2">
										<text class="Initialsty_1">{{Target_weight}}</text>
										<text class="Initialsty_2">{{chuhsikg}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="data_bg_A">
							<view class="title_zs1">{{$t('体脂秤注意事项')}}</view>
							<view class="tzkpsx" v-show="binaji2" @click="tiaozhen2()">{{$t("编辑数据卡片")}}</view>
							<view class="drag-containersss">
								<basic-drag v-model="list2" :disabled="disabledsaaa2" itemKey="title" :column="2"
									itemHeight="130px" @update:disabled="handleUpdateDisabled">
									<template #item="{element}">
										<view class="data_item_bgsss" :class="'animation2-' + animation2">
											<view class="icon_bgsss">
												<image lazy-load :src="element.image" class="img_style"
													mode="aspectFit" />
												<text class="icon_text_bgsss">{{element.title}}</text>
											</view>
											<view class="elementsduu">
												<view v-if="element.bmi_show">
													<view class="xueya_item">
														<text class="tesdtsdsdk">{{element.BMI_ys}}</text>
														<uni-icons type="help" size="15"
															@tap="BMI_tap(element.title)" />
													</view>
												</view>
												<view class="enlkij">
													<view v-if="element.bmi_show">
														<view v-if="element.BMI_TF == 0">
															<view class="BMI_TF_0" />
														</view>
														<view v-else-if="element.BMI_TF ==1">
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
											<view v-show="delate_icon2" class="delete-button"
												@touchstart.stop.prevent="delate_icon_cl_2(element.title, element)"
												hover-class="del-hover">
												<image src="/static/icons/minus_filled.png" class="delete-icon"
													mode="aspectFit" />
											</view>
										</view>
									</template>
								</basic-drag>
							</view>

							<view v-show="button_show2" class="btnshow">
								<view class="tuodongsd">{{$t('长按拖动可调整数据卡片位置')}}</view>
								<view class="quernsda">
									<view @click="ture_bt2()" class="cardstyle_1">{{$t('确认')}}</view>
									<view @click="add_bt2()" class="cardstyle_2">{{$t('添加数据卡片')}}</view>
								</view>
							</view>
							<view style="padding: 20px 20px 220px 20px;" @click="tizhiclick()">
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
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view"
					:scroll-anchoring="true" enhanced bounces>
					<view style="background: #3298F7">
						<view class=" title_zs_1" style="padding-top: 80px;">{{$t("本页面显示均为最近测量数据")}}</view>
						<!-- <view class="data_bg">
						<view class="icon_bg">
							<image lazy-load src="../../../static/icons/3.png" class="img_style" mode="aspectFit" />
							<text class="icon_text_bg">{{$t('压力')}}</text>
						</view>
						<view class="yalistyd">
							<view class="yalistyd_1">{{yali}}</view>
							<view class="yalistyd_2">kPa</view>
							<view class="yalistyd_3">{{yali_time}}</view>
						</view>
					</view> -->
						<view class="data_bg">
							<view class="icon_bg">
								<image lazy-load src="../../../static/icons/3.png" class="img_style" mode="aspectFit" />
								<text class="icon_text_bg">{{$t('睡眠')}}</text>
							</view>
							<view class="yalistyds">
								<view class="yalistyd_1">{{sleep}}</view>
								<view class="yalistyd_2">Time</view>
								<view class="yalistyd_3">{{sleep_time}}</view>
							</view>
							<view class="yalistyds">
								<view class="yalistyd_2">Light:{{totalLight}}</view>
								<view class="yalistyd_2">Deep:{{totalDeep}}</view>
								<view class="yalistyd_2">REM:{{totalRem}}</view>
							</view>
						</view>
						<view class="data_bg_A_1">
							<view
								style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
								<view
									style="margin-right: 5px; flex: 1; display: flex;justify-content: center; align-items: center; background: white;color: white;padding: 15px;font-weight: bold;font-size: 14px;border-radius: 10px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4); color: #222328;">
									{{$t("评分")}}：<text v-if="sleep_point>=80 "
										style="font-size: 22px;color: #58BF78;">{{sleep_point}}</text>
									<text v-else-if="sleep_point<80&&sleep_point>=60 "
										style="font-size: 22px;color: #FFEC01;">{{sleep_point}}</text>
									<text v-else-if="sleep_point<60 "
										style="font-size: 22px;color:  #F55A5A;">{{sleep_point}}</text>
								</view>
								<view class="context_btn2" style="box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);">
									<view class="context_title1">
										{{$t('是否服用药物')}}
									</view>
									<switch @change="switch1Change" style="transform:scale(0.8);" :checked="medication"
										color="#3298F7" />
								</view>
							</view>
							<view
								style="margin-bottom: 80px; padding: 15px; background: white;margin-top: 20px;border-radius: 20px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);">
								<view v-if="sleepTip && sleep_point<85" class="sleep-card">
									<view class="sleep-title">{{ $t('睡眠血压交叉分析') }}:</view>
									<view v-for="(line, idx) in sleepTip" :key="idx" class="sleep-line">
										<text>{{ $t(line) }}</text>
									</view>
								</view>
								<view v-else class="icon_item_bg_toast">{{$t("睡眠良好")}}</view>
							</view>
							<!-- <view class="yali1">
							<view>0～25:</view>
							<view>{{$t("容易")}}</view>
						</view>
						<view class="yali2" />
						<view class="yali1">
							<view>26～50:</view>
							<view>{{$t("低压")}}</view>
						</view>
						<view class="yali2" />
						<view class="yali1">
							<view>51～75:</view>
							<view>{{$t("适度的压力")}}</view>
						</view>
						<view class="yali2" />
						<view class="yali1">
							<view>76～100:</view>
							<view>{{$t("高度的压力")}}</view>
						</view> -->
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view"
					:scroll-anchoring="true" enhanced bounces>
					<view style="background: #3298F7;">
						<view class="title_zs_1" style="padding-top: 80px;">{{$t("本页面显示均为最近测量数据")}}</view>
						<view class="data_bg">
							<view class="icon_bg">
								<image lazy-load src="../../../static/icons/1.png" class="img_style" mode="aspectFit" />
								<text class="icon_text_bg">{{$t('步数')}}</text>
							</view>
							<view class="yalistyd">
								<view class="yalistyd_1">{{bushu}}</view>
								<view class="yalistyd_2">{{$t('计步')}}</view>
								<view class="yalistyd_3">{{bushu_time}}</view>
							</view>
							<view class="yalistyd">
								<view style="font-weight: bold;font-size: 20px;color: green;">{{today_Daily_Goal}}
								</view>
								<view class="yalistyd_2">{{$t('每天目标')}}</view>
							</view>
						</view>
						<view class="data_bg_A_set">
							<view class="charts-box">
								<qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
							</view>
							<view style="margin-bottom: 160px;">
								<view
									style="margin: 20px;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
									<input type="number" v-model="Daily_Goal" :placeholder="$t('每天目标')"
										style="flex: 2; text-align: center;background: white;padding: 15px;border-radius: 10px;margin-right: 5px;" />
									<button @click="Daily_Goal_set()"
										style="flex: 1;margin-left: 5px;background: #3298F7; color: white;font-weight: bold;">设置</button>
								</view>
								<!-- <view style="margin: 20px;font-size: 16px;display: flex;align-items: center;">
									{{$t('已设置的目标')}}:<text
										style="font-size: 28px;font-weight: bold;color: green;margin-left: 10px;">{{today_Daily_Goal}}</text>
								</view> -->
								<view v-if="parseInt(bushu)  >= parseInt(today_Daily_Goal)" class="icon_item_bg_toast">
									{{$t("今天达标了明天在加油")}}
									<uni-icons type="hand-up-filled" size="28" color="#3298F7"></uni-icons>
								</view>
								<view v-else-if="parseInt(bushu) < 5000 && xueya !== 0" class="icon_item_bg_toast">
									{{$t("你的血压有点高")}}<uni-icons type="fire-filled" size="28" color="red"></uni-icons>
								</view>
								<view v-else-if="parseInt(bushu) < parseInt(today_Daily_Goal)"
									class="icon_item_bg_toast">
									{{$t("今天没达标明天要多运动")}}

								</view>
								<view v-else class="icon_item_bg_toast">
									<!-- 其他情况 -->
								</view>
							</view>
						</view>
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
							{{$t('血氧1')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧2')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧3')}}
						</view>
					</view>
					<button @tap="knowe2()"
						style="width: 120px; height:48px; display: flex;justify-content: center;align-items: center; border-radius: 100px;background: #3298F7;color: white;">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
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
							<text>kg</text>
						</view>
					</view>
					<button @tap="jitizhong_tc()"
						style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
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
							<text>kg</text>
						</view>
					</view>
					<button @tap="mubiao_weight()"
						style="margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
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
		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="lnaypopup" :mask-click="true">
				<text class="popup-content">{{$t("权限说明")}}</text>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'; //全局挂载
	import BasicDrag from '@/components/basic-drag/index.vue'; //卡片
	import BluetoothManager from '../../api/BluetoothManager.js'; //低功耗蓝牙连接
	import ytDateTimePicker from '@/uni_modules/yt-dateTimePicker/components/yt-dateTimePicker/yt-dateTimePicker.vue';
	import {
		clearDailyGoalData
	} from '../../api/unitls/dailyClear.js';
	import {
		isInChinaByIP
	} from '../../api/isInChinaByIP.js'; //获取定位
	import permision from "@/js_sdk/wa-permission/permission.js"
	import {
		hexStringToBytes
	} from '../../api/unitls/bleUtils.js';
	import {
		receive5610SleepData
	} from '../../api/unitls/sleepParser.js';
	import WeightConverter from '../../api/unitls/weightConverter.js';
	import {
		checkNotificationPermissions
	} from "../../api/unitls/permission.js";
	import FloatButton from '../../components/float-button.vue'
	const systemInfo = uni.getSystemInfoSync(); //获取手机信息
	const windowHeight = systemInfo.windowHeight;

	// ECG start
	// import ecgWave from "../../components/ecg-wave/ecg-wave.vue";
	// const SERVICE_ID = '0000FF00-0000-1000-8000-00805F9B34FB'
	// const NOTIFY_UUID = '0000FF02-0000-1000-8000-00805F9B34FB'
	// const CMD_ECG_START = [0xA5, 0x12, 0x01, 0x13, 0x0A]
	// const CMD_ECG_STOP = [0xA6, 0x15, 0x01, 0x17, 0x0A]
	// ECG end


	export default {
		components: {
			BasicDrag,
			ytDateTimePicker,
			FloatButton,
			// ecgWave, // ECG
		},
		computed: {
			...mapState(['info', 'getpendinglenth', 'acktypes', 'xueyehuilian']),
			sleepTip() {
				// 1. 先拼出 key 后缀
				const idx = this.xueya; // 0-3
				const med = this.medication === true ? 1 : 2; // 1=用药 2=未用药
				const idsd = [1, 2, 3, 4, 5, 6, 7, 8][idx * 2 + (med - 1)]; // 0-7 → 1-8
				// 2. 返回固定顺序的 key 数组
				return [
					'睡眠质量',
					`用药情况${med}`,
					`健康建议${idsd}`, // 0-3 → 1-8
					`原因${idsd}`,
					`药物与睡眠解释${idsd}`,
					`生活方式建议${idsd}`
				];
			},
			// // 计算是否有测量数据ECG
			// hasMeasurementData() {
			// 	return this.fullDataCount > 0;
			// }
		},
		data() {
			return {
				//ECG start
				// connected: false,
				// connecting: false,
				// tip: '点击"连接血压计"开始',
				// dataCount: 0,
				// fullDataCount: 0,
				// statsVisible: true,
				// dataSource: '未连接',
				// queueLength: 0,
				// deviceId: '',
				// notifyCharacteristicId: '',
				// writeCharacteristicId: '',
				// buffer: '',
				// sendCnt: 0,
				// measurementStatus: '', // 测量状态
				// deviceIdECG: '',
				// serviceIdECG: '',
				// uuidECG: '',
				//ECG end
				hasSynced: false,
				Daily_Goal: '',
				today_Daily_Goal: uni.getStorageSync("today_Daily_Goal") || "--/--",
				medication: uni.getStorageSync("medication") || false,
				buttonVisible: true,
				buttonPattern: {
					theme: 'primary',
					icon: '/static/page_icon/aipbg.jpg',
					menuItems: [{
							icon: '/static/page_icon/aipbg.jpg',
							text: this.$t("报告"),
							handler: () => {
								console.log('AI按钮被点击')
								uni.navigateTo({
									url: "/pages/tabBar/tendency/supplement"
								})
							}
						},
						{
							icon: '/static/page_icon/jinggaotishijingbaoyujing.png',
							text: this.$t("警报"),
							handler: () => {
								console.log('警报按钮被点击')
								uni.navigateTo({
									url: "/pages/tabBar/my/Alarms"
								})
							}
						}
					],
				},
				stepsData: {}, // 用于存储每天步数的对象
				timer: null, // 定时器变量
				timertwslist: null,
				screenHeight: windowHeight,
				tabs: [this.$t("心血管"), this.$t("体重"), this.$t("情绪"), this.$t("运动")],
				currentIndex: 0, // swiper索引
				disabletouch: false,
				msg: true,
				connectedDevices: {}, // 存储已连接设备的信息
				deviceList: [], // 存储搜索到的设备列表
				bluetoothManager: new BluetoothManager(),
				endtimesss: new Date().toISOString().slice(0, 10),
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
						type_LX: "BMP",
						Step_count: "-"
					},
					// {
					// 	bmi_show: false,
					// 	image: "../../../static/page_icon/9.png",
					// 	Step_number: "-",
					// 	title: this.$t("压力"),
					// 	type_LX: "--",
					// 	Step_count: "-/-",
					// 	checkbox: false,
					// },
					// {
					// 	bmi_show: false,
					// 	image: "../../../static/page_icon/9.png",
					// 	Step_number: "-",
					// 	title: this.$t("体温"),
					// 	type_LX: "℃",
					// 	Step_count: "-",
					// 	checkbox: false,
					// }
				],
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
				showTotal_date: new Date().toISOString().slice(5, 7) + "/" + new Date().toISOString().slice(8, 10),
				birthday: this.$t('今天'),
				birthday1: this.$t('今天'),
				birthday2: this.$t('今天'),
				datass: new Date().toISOString(),
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
				yali_time: '--/--',
				sleep: '--/--',
				sleep_time: '--/--',
				sleep_point: '--/--',
				totalLight: 'NA',
				totalDeep: 'NA',
				totalRem: 'NA',
				bushu: '--/--',
				bushu_time: '--/--',
				chartData: {
					categories: [0, 0],
					series: [{
						legendShape: "circle",
						name: this.$t("步数"),
						data: [0, 0]
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
				quotient: 0,
				quotient1: 0,
				quotient2: 0,
				dataBuffer: [],
				Protocolsubcommand: '',
				writeuuid: '',
				xeuyejisn: "0",
				xeuyejimac: "0",
				shoubiaosn: '0',
				shoubiaomac: '0',
				characteristicsCache: new Set(), // 用于记录已获取特征值的设备ID
				timsdpad: null,
				notifyTriggered: false, // 初始化通知标志
				devicdsdmac: [],
				devicdsdmac1: [],
				queryDevicesDone: false, // 标志位：是否已执行过
				lastWeightbishi: "",
				xueyabiaoshi: '',
			}
		},
		mounted() {
			this.loadStepsFromStorage();
			this.timer = setInterval(this.saveDailySteps, 24 * 60 * 60 * 1000); // 每24小时触发一次
		},
		beforeDestroy() {
			clearInterval(this.timer);
		},
		onHide() {
			this.sethuilian(false);
			this.getUserInfo()
			if (this.timsdpad) {
				clearInterval(this.timsdpad);
				this.timsdpad = null;
			}
		},

		onUnload() {
			this.disConnect()
		},
		onShow() {
			let that = this
			if (uni.getStorageSync("dingwei") === 1) {
				checkNotificationPermissions();
			}
			that.chuhsikg = uni.getStorageSync("danwei2") === 1 ?
				"lb" : "kg";
			that.newweightKG = uni.getStorageSync("danwei2") === 1 ?
				"lb" : "KG";
			that.sethuilian(true)
			that.Blood = uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa"
			if (!uni.getStorageSync("appQX")) {
				that.$nextTick(() => {
					if (that.$refs.lnaypopup) {
						that.$refs.lnaypopup.open('top');
					} else {
						console.error("lnaypopup 引用未找到");
					}
				});
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
				that.queryDevicesDone = false // 立刻上锁
				that.getUserInfo()
			});
			// 在数据操作前检查清除
			clearDailyGoalData();
			that.today_Daily_Goal = uni.getStorageSync("today_Daily_Goal") || "0"
			setTimeout(() => {
				const now = new Date();
				const today7AM = new Date();
				today7AM.setHours(7, 0, 0, 0); // 设置今天早上7点
				if (that.sleep_time === `${now.getMonth() + 1}/${now.getDate()}` || now < today7AM) {
					that.hasSynced = true;
					// console.log("睡眠时间到")
				} else {
					that.hasSynced = false;
				}
			}, 3000)
			uni.getNetworkType({
				success: function(res) {
					if (res.networkType === 'none') {
						// console.log('无网络连接');
						that.Latest_weight = that.newweightKG === "KG" ? uni.getStorageSync("weightkg") : uni
							.getStorageSync("weightlb")
						that.lowPressure = that.Blood === "mmHg" ? uni.getStorageSync("lowPressure") : (Number(
							uni.getStorageSync("lowPressure")) * 0.133).toFixed(1);
						that.highPressure = that.Blood === "mmHg" ? uni.getStorageSync("highPressure") : (
							Number(uni.getStorageSync("lowPressure")) * 0.133).toFixed(1);
						that.pulse = uni.getStorageSync("pulse")
						that.updateBloodPressureStatus(uni.getStorageSync("lowPressure"), uni.getStorageSync(
							"highPressure"));
						that.sethuilian(true)
						that.aaaa(uni.getStorageSync("lixianlist"))
					} else {
						if (uni.getStorageSync("xueyadatatype") && uni.getStorageSync("xueyadata")) {
							if (uni.getStorageSync("xueyadatatype") === "1") {
								that.$post(that.$url_jakoblife_fat_scale, uni.getStorageSync("xueyadata"), {
									'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
								}).then(res => {
									// console.log("上报数据手表", res)
									if (res.code === 200) {
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
								}).catch(errro => {
									console.log("errro", errro)
								})
							} else if (uni.getStorageSync("xueyadatatype") === "0") {
								that.$post(that.$url_jakoblife_fat_scale, uni.getStorageSync("xueyadata"), {
									'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
								}).then(resaa => {
									console.log("血压计", resaa)
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
							that.$post(that.$url_jakoblife_fat_scale, uni.getStorageSync("tizhidata"), {
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
									let deviceSntzlx = uni.getStorageSync("tizhidata").deviceSn
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
			...mapMutations(['getInfo', 'setacktypes', 'setbanhua', 'sethuilian']),
			// 调用蓝牙连接js
			async initBluetooth() {
				this.bluetoothManager = new BluetoothManager();
				this.openBluetoothAdapter()
			},

			//初始化蓝牙
			openBluetoothAdapter() {
				uni.openBluetoothAdapter({
					success: this.onBluetoothAdapterSuccess,
					fail: this.onBluetoothAdapterFail
				});
			},
			onBluetoothAdapterSuccess() {
				this.manageHeartbeatInterval(() => this.onBluetoothDeviceFound(), 2000);
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
			onBluetoothAdapterFail(err) {
				if (err.errCode === 10001) {
					this.handleBluetoothOff();
				} else {
					uni.showToast({
						title: this.$t("蓝牙初始化失败"),
						icon: 'none'
					});
				}
			},
			manageHeartbeatInterval(callback, interval) {
				if (Vue.prototype.$globalTimers.heartbeatInterval) {
					clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
					Vue.prototype.$globalTimers.heartbeatInterval = null;
				}
				Vue.prototype.$globalTimers.heartbeatInterval = setInterval(callback, interval)
			},
			handleBluetoothOff() {
				this.onBluetoothAdapterSuccess()
				// this.showBluetoothSettingsModal();
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

			async onBluetoothDeviceFound() {
				let that = this
				uni.getNetworkType({
					success: function(res) {
						// networkType 可能的值：wifi、2g、3g、4g、5g、ethernet、unknown、none:cite[3]
						if (res.networkType === 'none') {
							console.log('无网络连接');
							let uniqueArr = uni.getStorageSync("deviceList").filter((item, index) => uni
								.getStorageSync("deviceList").indexOf(item) ===
								index);
							let uniqueArr1 = uni.getStorageSync("devicdsdmac").filter((item, index) => uni
								.getStorageSync("devicdsdmac")
								.indexOf(item) ===
								index);
							let uniqueArr2 = uni.getStorageSync("devicdsdmac1").filter((item, index) => uni
								.getStorageSync("devicdsdmac1")
								.indexOf(item) ===
								index);
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
								uniqueArr = uni.getStorageSync("deviceList").filter((item, index) =>
									uni
									.getStorageSync("deviceList").indexOf(item) ===
									index);
							} else {
								uniqueArr = that.deviceList.filter((item, index) => that.deviceList
									.indexOf(item) ===
									index);
							}
							if (that.devicdsdmac === undefined) {
								uniqueArr1 = uni.getStorageSync("devicdsdmac").filter((item, index) =>
									uni
									.getStorageSync("devicdsdmac").indexOf(item) ===
									index);
							} else {
								uniqueArr1 = that.devicdsdmac.filter((item, index) => that.devicdsdmac
									.indexOf(item) ===
									index);
							}
							if (that.devicdsdmac1 === undefined) {
								uniqueArr2 = uni.getStorageSync("devicdsdmac1").filter((item, index) =>
									uni
									.getStorageSync("devicdsdmac1").indexOf(item) ===
									index);
							} else {
								uniqueArr2 = that.devicdsdmac1.filter((item, index) => that
									.devicdsdmac1
									.indexOf(item) ===
									index);
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
				const deviceIds = uniqueArr;
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
			loadStepsFromStorage() {
				try {
					const storedData = uni.getStorageSync("weeklySteps");
					if (storedData) {
						this.stepsData = JSON.parse(storedData);
					}
				} catch (e) {}
			},
			saveDailySteps(bushu, bushu_time) {
				const currentDate = bushu_time; // "10/15"
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
					delete weekly[dates[0]]; // 删掉最早的一天
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
						if (res.networkType === 'none') {
							console.log('无网络连接');
						} else {
							// console.log(uni.getStorageSync("xueyadatatype"))
							// console.log(uni.getStorageSync("xueyadata"))
							// console.log(uni.getStorageSync("tizhidata"))
							if (uni.getStorageSync("xueyadatatype") && uni.getStorageSync("xueyadata")) {
								if (uni.getStorageSync("xueyadatatype") === "1") {
									that.$post(that.$url_jakoblife_fat_scale, uni.getStorageSync(
										"xueyadata"), {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(res => {
										console.log("上报数据手表", res)
										if (res.code === 200) {
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
									}).catch(errro => {
										console.log("errro", errro)
									})
								} else if (uni.getStorageSync("xueyadatatype") === "0") {
									that.$post(that.$url_jakoblife_fat_scale, uni.getStorageSync(
										"xueyadata"), {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(resaa => {
										console.log("血压计", resaa)
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
								that.$post(that.$url_jakoblife_fat_scale, uni.getStorageSync("tizhidata"), {
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
										let deviceSntzlx = uni.getStorageSync("tizhidata").deviceSn
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
				this.$post(this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						for (let rowIndex = 0; rowIndex < res.rows.length; rowIndex++) {
							const row = res.rows[rowIndex];
							for (let deviceIndex = 0; deviceIndex < devicesArray.length; deviceIndex++) {
								const device = devicesArray[deviceIndex];
								if (device.deviceId !== row.mac) continue;
								if (device.services.length === 1) {
									uni.setBLEMTU({
										deviceId: device.deviceId,
										mtu: 512,
									});
								}
								if (row.deviceModelId === "10005") {
									this.xeuyejisn = row.deviceSn
									this.xeuyejimac = device.deviceId
								}
								if (row.deviceModelId === "30000") {
									this.shoubiaosn = row.deviceSn
									this.shoubiaomac = device.deviceId
								}
								switch (device.services.length) {
									// case 1:
									// 	if (this.xueyjitypesd == true) {
									// 		this.getBLEDeviceCharacteristics1(device.deviceId, device.services[0]
									// 			.uuid, row.deviceSn);
									// 		this.xeuyejisn = row.deviceSn
									// 		this.xeuyejimac = device.deviceId
									// 	}
									// 	break;
									case 2:
										this.getBLEDeviceCharacteristics2(device.deviceId, device.services[1].uuid,
											row.deviceSn);
										break;
									case 3:
										if (row.deviceModelId === "30000") {
											this.getBLEDeviceCharacteristics3(device.deviceId, device.services[1]
												.uuid, row.deviceSn
											);
											this.shoubiaosn = row.deviceSn
											this.shoubiaomac = device.deviceId
										}
										if (row.deviceModelId === "10005") {
											uni.setBLEMTU({
												deviceId: device.deviceId,
												mtu: 512,
											});
											this.getBLEDeviceCharacteristics1(device.deviceId, device
												.services[2].uuid, row.deviceSn);
											this.xeuyejisn = row.deviceSn
											this.xeuyejimac = device.deviceId
										}
										break;
									case 4:
										this.getBLEDeviceCharacteristics2(device.deviceId, device.services[3].uuid,
											row.deviceSn);
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
					const res = uni.getStorageSync("lixianlist");
					for (let rowIndex = 0; rowIndex < res.length; rowIndex++) {
						const row = res[rowIndex];
						for (let deviceIndex = 0; deviceIndex < devicesArray.length; deviceIndex++) {
							const device = devicesArray[deviceIndex];
							if (device.deviceId !== row.mac) continue;
							if (device.services.length === 1) {
								uni.setBLEMTU({
									deviceId: device.deviceId,
									mtu: 512,
								});
							}
							if (row.deviceModelId === "10005") {
								this.xeuyejisn = row.deviceSn
								this.xeuyejimac = device.deviceId
							}
							if (row.deviceModelId === "30000") {
								this.shoubiaosn = row.deviceSn
								this.shoubiaomac = device.deviceId
							}
							switch (device.services.length) {
								case 2:
									this.getBLEDeviceCharacteristics2(device.deviceId, device.services[1].uuid,
										row.deviceSn);
									break;
								case 3:
									if (row.deviceModelId === "30000") {
										this.getBLEDeviceCharacteristics3(device.deviceId, device.services[1]
											.uuid, row.deviceSn
										);
										this.shoubiaosn = row.deviceSn
										this.shoubiaomac = device.deviceId
									}
									if (row.deviceModelId === "10005") {
										uni.setBLEMTU({
											deviceId: device.deviceId,
											mtu: 512,
										});
										this.getBLEDeviceCharacteristics1(device.deviceId, device
											.services[2].uuid, row.deviceSn);
										this.xeuyejisn = row.deviceSn
										this.xeuyejimac = device.deviceId
									}
									break;
								case 4:
									this.getBLEDeviceCharacteristics2(device.deviceId, device.services[3].uuid,
										row.deviceSn);
									break;
								default:
									// 可以添加默认处理或日志
									break;
							}
							// 找到匹配的设备后可以跳出内层循环
							break;
						}
					}
					let that = this
					uni.getNetworkType({
						success: function(res) {

							if (res.networkType === 'none') {
								that.sethuilian(true)
							} else {
								if (uni.getStorageSync("dingwei") === 1) {
									checkNotificationPermissions();
								}
								that.sethuilian(true)
								that.Blood = uni.getStorageSync("Blood") === 0 || uni.getStorageSync(
									"Blood") === "" ? "mmHg" : "kPa"
								if (!uni.getStorageSync("appQX")) {
									that.$nextTick(() => {
										if (that.$refs.lnaypopup) {
											that.$refs.lnaypopup.open('top');
										} else {
											console.error("lnaypopup 引用未找到");
										}
									});
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
									that.xueyabiaoshi = ""
									that.deviceList = []
									that.queryDevicesDone = false // 立刻上锁
									that.getUserInfo()
								});
								// 在数据操作前检查清除
								clearDailyGoalData();
								that.today_Daily_Goal = uni.getStorageSync("today_Daily_Goal") || "0"
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
						// console.log("getBLEDeviceCharacteristics1", res)
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
										that.onBLECharacteristicValueChange1(deviceId, serviceId,
											deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败111', res)
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.disconnectAll(deviceId)
						that.deviceList = []
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
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败111', res)
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
									console.log('蓝牙设备已断开');
									if (that.characteristicsCache.has(deviceId)) {
										console.log(`清除设备 ${deviceId} 的特征值缓存`);
										that.characteristicsCache.delete(deviceId);
									}
									that.deviceList = [];
									that.setacktypes(0)
									that.queryDevices()
									// 在这里处理设备断开后的逻辑，例如尝试重新连接等
								}
							});
							if (!that.hasSynced) { // 确保只执行一次
								const now = new Date();
								const today7AM = new Date();
								today7AM.setHours(7, 0, 0, 0); // 设置今天早上7点
								if (that.sleep_time === `${now.getMonth() + 1}/${now.getDate()}` || now <
									today7AM) {
									console.log("睡眠时间到！", that.sleep_time);
									that.hasSynced = true
								} else {
									that.hasSynced = true; // 标记已同步
									uni.writeBLECharacteristicValue({
										deviceId: deviceId,
										serviceId: serviceId,
										characteristicId: that.writeuuid,
										writeType: 'writeNoResponse',
										value: that.toArrayBuffer('e00006ea010100000101'),
										complete(complete) {
											console.log("发送同步所有数据命令：e00006ea010100000101")
										}
									})
								}
							}
						},
						fail: (err) => {
							console.error('蓝牙适配器初始化失败', err);
							if (that.characteristicsCache.has(deviceId)) {
								console.log(`清除设备 ${deviceId} 的特征值缓存`);
								that.characteristicsCache.delete(deviceId);
							}
							that.deviceList = [];
							that.setacktypes(0)
							that.queryDevices()
						}
					});
					return;
				}
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						// console.log("getBLEDeviceCharacteristics3", res)
						that.characteristicsCache.add(deviceId); // 缓存设备ID，
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (that.acktypes === 0) {
								if (item.properties.write) {
									const buffer = that.toArrayBuffer("e00006e8000000000101");
									uni.writeBLECharacteristicValue({
										deviceId: deviceId,
										serviceId: serviceId,
										characteristicId: item.uuid,
										writeType: "writeNoResponse",
										value: buffer,
										success: (writeres) => {
											console.log("发送命令成功", writeres);
											that.writeuuid = item.uuid
											that.calculateChecksumsss2(deviceId, serviceId, item
												.uuid, deviceSn)
										},
										fail: (writeerr) => {
											that.writeuuid = item.uuid
											that.calculateChecksumsss2(deviceId, serviceId, item
												.uuid, deviceSn)
										}
									});
									that.setacktypes(1)
								}
							}
							setTimeout(() => {
								if (item.properties.notify) {
									uni.setStorageSync("landeviceId", deviceId)
									uni.setStorageSync("lanserviceId",
										serviceId)
									uni.setStorageSync("landcharacteristicId",
										item.uuid)
									that.notifyUuid = res.characteristics[i]
										.uuid
									uni.notifyBLECharacteristicValueChange({
										state: true, // 启用 notify 功能
										deviceId: deviceId,
										serviceId: serviceId,
										characteristicId: item.uuid,
										success: (notifyres) => {
											that.onBLECharacteristicValueChange3(
												deviceId,
												serviceId,
												deviceSn);
										},
										fail: (notifyerr) => {}
									})
								}
							}, 500)
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败222', res)
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.disconnectAll(deviceId)
						that.setacktypes(0)
						that.deviceList = [];
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
					}
				})
			},
			// 16进制转2进制
			hexToBinary(hexString) {
				let binaryString = '';
				for (let i = 0; i < hexString.length; i++) {
					// 将每个16进制字符转换为4位二进制
					const binaryChar = parseInt(hexString[i], 16).toString(2).padStart(4, '0');
					binaryString += binaryChar;
				}
				return binaryString;
			},
			// 定义一个函数来计算校验和
			calculateChecksumsss2(deviceId, serviceId, writeuuid, deviceSn) {
				// 转换为 ArrayBuffer获取设备信息
				let that = this
				const plugin = uni.requireNativePlugin('ThirdSdkPlugin-ThirdSdkModule');
				console.log(plugin)
				// 1. 配对
				plugin.pairDevice({
					mac: deviceId
				}, (res) => {
					console.log('配对结果:', res);
				});
				// 2. 启用通话音频
				plugin.enableBluetoothAudio({}, res => {
					// console.log('1配对结果:', res);
				});
				const ACK_HEADER = 0xe0 // 常量-头部
				const BleDeviceConfig = {
					PROTOCOL_VERSION: 0x00 // 协议版本号
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
					.padStart(2, '0')).join(
					'');
				const buffer = that.toArrayBuffer(hexCommand22); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: writeuuid,
					writeType: 'writeNoResponse',
					value: buffer,
					success(res) {
						console.log("时间命令数据回复成功：", res)
						that.getsetp(deviceId, serviceId, writeuuid, BleDeviceConfig
							.PROTOCOL_VERSION)
					},
					fail(err) {
						console.log("时间命令数据回复失败：", err)
						that.getsetp(deviceId, serviceId, writeuuid, BleDeviceConfig
							.PROTOCOL_VERSION)
					}
				})
			},

			sendack(dataList, deviceId, serviceId, writeuuid) {
				let that = this
				that.dataBuffer = [];
				that.quotient = 0;
				that.quotient1 = 0;
				that.quotient2 = 0;
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
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						value: buffer,
						success(res) {
							console.log("回复ack数据成功")
						},
						fail(err) {
							console.log("回复ack数据失败")
						},
					})
				}
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
				const month = parseInt(binaryTime.slice(7, 11), 2);
				const day = parseInt(binaryTime.slice(11), 2);
				return {
					year,
					month,
					day
				};
			},

			// 提取时间格式化函数
			formatTime(seconds) {
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const secs = seconds % 60;
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
					time: this.formatTime(seconds),
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
			// 运动命令
			getsetp(deviceId, serviceId, writeuuid, PROTOCOL_VERSION) {
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
				for (let i = 0; i < ackConfigByteset
					.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
					ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
				}
				ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
				// 创建新的数组，将校验和插入到第四个字节中
				const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
					1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
				modifiedCommand2[3] = ackConfigBytesum2;
				modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
				const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
					.toString(16).padStart(2, '0')).join('');
				const buffer2 = this.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'writeNoResponse',
						value: buffer2,
						success(res) {
							console.log("运动数据回复成功：")
							this.dataBuffer = []
						},
						fail(err) {
							console.log("运动数据回复失败：")
							this.dataBuffer = []
						},
					})
				}, 6000)

				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'writeNoResponse',
						value: this.toArrayBuffer('e00006ea010100000101'),
						complete(complete) {
							console.log("发送同步所有数据命令：e00006ea010100000101")
							// this.dataBuffer = []
						}
					})
				}, 8000)

			},
			// ArrayBuffer转16进度字符串示例
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			ab2str(buf) {
				return String.fromCharCode.apply(null, new Uint8Array(buf));
			},
			onBLECharacteristicValueChange1(deviceId, serviceId, deviceSn) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					// try {
					let hexData = that.ab2hex(res.value)
					let asciiString = that.hexToAscii(hexData)
					if (asciiString === "error") {
						uni.closeBLEConnection({
							deviceId: deviceId,
							success() {},
							fail() {}
						})
						that.disconnectAll(deviceId)
						that.deviceList = []
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
						return
					} else if (hexData.length === 388 &&
						!hexData.startsWith("0e") &&
						!hexData.startsWith("e0") &&
						that.xueyehuilian &&
						that.xeuyejisn !== "0" &&
						that.xeuyejimac !== "0") {
						let parsedData = that.parseQueryString(asciiString);
						that.lowPressure = that.Blood === "mmHg" ? parsedData.dia.trim() : (Number(parsedData.dia
							.trim()) * 0.133).toFixed(1);
						that.highPressure = that.Blood === "mmHg" ? parsedData.sys.trim() : (Number(parsedData.sys
							.trim()) * 0.133).toFixed(1);
						that.pulse = parsedData.pul.trim();
						uni.setStorageSync("lowPressure", parsedData.dia.trim())
						uni.setStorageSync("highPressure", parsedData.sys.trim())
						uni.setStorageSync("pulse", parsedData.pul.trim())
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {
									that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
									that.updateBloodPressureStatus(parsedData.dia.trim(), parsedData
										.sys.trim());
								} else {
									that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
									that.updateBloodPressureStatus(parsedData.dia.trim(), parsedData
										.sys.trim());
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						that.xueyabiaoshi = "1"
						that.jakoblife_fat_scale(deviceId, parsedData, deviceSn)
						that.resetDataState();
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
				})
			},
			resetDataState() {
				this.dataBuffer = [];
				this.quotient = 0;
				this.quotient1 = 0;
				this.quotient2 = 0;
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
						//01表示心率数据，02表示血压数据，03表示血氧数据,04表示步数和千卡数据，07表示体温 08表示压力
						switch (restype) {
							case "01":
								const xinlv = decimalArray[0]
								that.jakoblife_fat_scale2(deviceId, "", "", xinlv,
									deviceSn)
								break
							case "02":
								const shousuoye = decimalArray[0]
								const shuzhangya = decimalArray[1]
								const length = decimalArray.length - 2
								const maibo = decimalArray[length]
								that.jakoblife_fat_scale2(deviceId, shousuoye, shuzhangya,
									maibo,
									deviceSn)
								break
							case "03":
								const xueyang = decimalArray[0]
								const xueyangtimes = decimalArray[3] + "/" + decimalArray[
									4]
								uni.setStorageSync("xueyang", xueyang)
								uni.setStorageSync("xueyangtimes", xueyangtimes)
								that.list_recipe()
								break
							case "05":
								const settept1 = decimalArray[1]
								uni.setStorageSync("settept1", settept1)
								that.list_recipe()
								break
							case "07":
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
							case "08":

								break
							case "22":
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
										shuzhangya, maibo,
										deviceSn)
								}
								break
							default:
								// console.log("血压手表其他数据类型", restype)
						}
					}
				})
			},
			onBLECharacteristicValueChange3(deviceId, serviceId, deviceSn) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					let hexData = that.ab2hex(res.value)
					let asciiString = that.hexToAscii(hexData)
					const dataList = that.ab2hex(res.value)
					that.dataBuffer.push(dataList)
					console.log("获取蓝牙的包数据", dataList)
					if (asciiString === "error") {
						uni.closeBLEConnection({
							deviceId: deviceId,
							success() {},
							fail() {}
						})
						that.disconnectAll(deviceId)
						that.deviceList = []
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
					} else if (hexData.length === 388 &&
						!hexData.startsWith("0e") &&
						!hexData.startsWith("e0") &&
						that.xueyehuilian &&
						that.xeuyejisn !== "0" &&
						that.xeuyejimac !== "0") {
						let parsedData = that.parseQueryString(asciiString);
						that.lowPressure = that.Blood === "mmHg" ? parsedData.dia.trim() : (Number(parsedData.dia
							.trim()) * 0.133).toFixed(1);
						that.highPressure = that.Blood === "mmHg" ? parsedData.sys.trim() : (Number(parsedData.sys
							.trim()) * 0.133).toFixed(1);
						that.pulse = parsedData.pul.trim();
						uni.setStorageSync("lowPressure", parsedData.dia.trim())
						uni.setStorageSync("highPressure", parsedData.sys.trim())
						uni.setStorageSync("pulse", parsedData.pul.trim())
						that.updateBloodPressureStatus(parsedData.dia.trim(), parsedData.sys.trim());
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {
									that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
									that.updateBloodPressureStatus(parsedData.dia.trim(), parsedData
										.sys.trim());
								} else {
									that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
									that.updateBloodPressureStatus(parsedData.dia.trim(), parsedData
										.sys.trim());
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						that.xueyabiaoshi = "1"
						that.jakoblife_fat_scale(that.xeuyejimac, parsedData, that.xeuyejisn)
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
					} else {
						const ProtocolIdentifier = dataList.slice(0, 2); // 协议标识位 1个字节
						const CMD = dataList.slice(8, 10); // 协议标识位 1个字节
						if (ProtocolIdentifier === "e0" && CMD === "00") {
							that.sendack(dataList, deviceId, serviceId, that.writeuuid)
							that.resetDataState()
						} else if (ProtocolIdentifier === "e0" && CMD === "04") {
							switch (dataList.slice(12, 14)) {
								case "01":
									that.sendack(dataList, deviceId, serviceId, that.writeuuid)
									that.resetDataState()
									break
								case "00":
									that.sendack(dataList, deviceId, serviceId, that.writeuuid)
									const stepheart = dataList.slice(0, 18);
									const stepbody = dataList.slice(18, dataList.length);
									const step = stepbody.slice(0, 8)
									const juli = stepbody.slice(8, 16)
									const kaluli = stepbody.slice(16, stepbody.length)
									const settept1 = parseInt(step, 16);
									that.jakoblife_fat_scale3(that.shoubiaomac, settept1, that.shoubiaosn, "步数");
									break
								case "10":
									if (dataList.length < 160 && dataList.length > 40) {
										const bytes = hexStringToBytes(dataList.slice(18, dataList.length));
										const sleepObj = receive5610SleepData(bytes);
										// console.log('5610SleepData 解析结果：', JSON.stringify(sleepObj, null, 2));
										const stats = that.calcSleepMinutes(sleepObj);
										console.log('正式睡眠：', stats.formalReadable); // 5h 1min
										console.log('totalLight：', stats.totalLight); // 6h 18min
										console.log('totalDeep：', stats.totalDeep); // 5h 1min
										console.log('totalRem：', stats.totalRem); // 6h 18min
										uni.setStorageSync("sleep", stats.totalReadable)
										uni.setStorageSync("totalLight", stats.totalLight)
										uni.setStorageSync("totalDeep", stats.totalDeep)
										uni.setStorageSync("totalRem", stats.totalRem)
										uni.setStorageSync("sleep_time", sleepObj.date.slice(6, sleepObj.date
											.length).replace("-", "/"))

										that.sleep = stats.totalReadable
										that.totalLight = stats.totalLight
										that.totalDeep = stats.totalDeep
										that.totalRem = stats.totalRem
										// 1. 总睡眠小时数（ 保留 1 位小数）
										const totalAll = that.timeStrToMinutes(that.sleep); // 436
										const totalH = (totalAll / 60).toFixed(1)
										const deepMin = (that.timeStrToMinutes(that.totalDeep) / 60).toFixed(1);
										const remMin = (that.timeStrToMinutes(that.totalRem) / 60).toFixed(1);
										const lightMin = (that.timeStrToMinutes(that.totalLight) / 60).toFixed(1)
										that.sleep_point = that.overallSleepScore(totalAll, totalH, deepMin,
											remMin, lightMin)


										that.jakoblife_fat_scale3(that.shoubiaomac, stats.totalReadable, that
											.shoubiaosn,
											"睡眠");
										that.resetDataState()
									} else {
										that.ProtocolSubcommand = dataList.slice(12, 14); // 协议子命令 1个字节
										const ProtocolLength = dataList.slice(2, 6); // 协议长度 2个字节
										const ProtocolLength2 = ProtocolLength.slice(2, 4);
										that.tempBuffer = parseInt(ProtocolLength2, 16) + 4;
										if (dataList.length <= 40) {
											that.quotient2 = that.calculateQuotient(that
												.tempBuffer, 20);
										} else {
											that.quotient2 = that.calculateQuotient(that
												.tempBuffer, 80);
										}
									}
									break
								default:
									console.log("default睡眠数据", dataList)
									that.resetDataState()
									break
							}
						} else if (ProtocolIdentifier === "0e") {
							that.resetDataState()
						} else if (ProtocolIdentifier === "e0" && CMD === "11") {
							that.resetDataState()
						} else if (ProtocolIdentifier === "e0" && CMD === "01") {
							switch (hexData.slice(12, 14)) {
								case "00":
								case "02":
								case "03":
									that.sendack(hexData, deviceId, serviceId, that.writeuuid);
									that.resetDataState();
									break
							}
						} else if (ProtocolIdentifier === "e0" && CMD === "02") {
							that.resetDataState()
						} else if (ProtocolIdentifier === "e0" && CMD === "03") {
							that.ProtocolSubcommand = dataList.slice(12, 14); // 协议子命令 1个字节
							const ProtocolLength = dataList.slice(2, 6); // 协议长度 2个字节
							const ProtocolLength2 = ProtocolLength.slice(2, 4);
							that.tempBuffer = parseInt(ProtocolLength2, 16) + 4;
							// 根据协议子命令处理不同逻辑
							switch (that.ProtocolSubcommand) {
								case "01": // 血压
									if (dataList.length <= 40) {
										that.quotient = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.quotient = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break;
								case "00":
								case "02": // 心率 & 血氧
									if (dataList.length <= 40) {
										that.quotient1 = that.calculateQuotient(that
											.tempBuffer, 20);
									} else {
										that.quotient1 = that.calculateQuotient(that
											.tempBuffer, 80);
									}
									break;
								default:
									console.warn("未知的协议子命令:", that.ProtocolSubcommand);
							}
						}

						if (that.formatData(that.dataBuffer).slice(12, 14) === "01" && that.formatData(that
								.dataBuffer).slice(8, 10) === "04") {
							that.resetDataState()
						}
						// if (that.formatData(that.dataBuffer).slice(12, 14) === "" && that.formatData(that
						// 		.dataBuffer).slice(8, 10) === "") {
						// 	that.resetDataState()
						// }
						if (that.formatData(that.dataBuffer).startsWith("0000") || that.formatData(that
								.dataBuffer).endsWith("0000")) {
							that.resetDataState()
						}
						if (that.formatData(that.dataBuffer).startsWith("4e")) {
							that.resetDataState()
						}

						if (that.quotient2 !== 0 && that.quotient2 === that.dataBuffer.length) {
							const bytes = hexStringToBytes(that.formatData(that.dataBuffer).slice(18, that
								.formatData(that.dataBuffer).length));
							const sleepObj = receive5610SleepData(bytes);
							// console.log('5610SleepData 解析结果：', JSON.stringify(sleepObj, null, 2));
							const stats = that.calcSleepMinutes(sleepObj);
							console.log('正式睡眠：', stats.formalReadable); // 5h 1min
							console.log('totalLight：', stats.totalLight); // 6h 18min
							console.log('totalDeep：', stats.totalDeep); // 5h 1min
							console.log('totalRem：', stats.totalRem); // 6h 18min
							uni.setStorageSync("sleep", stats.totalReadable)
							uni.setStorageSync("totalLight", stats.totalLight)
							uni.setStorageSync("totalDeep", stats.totalDeep)
							uni.setStorageSync("totalRem", stats.totalRem)
							that.sleep = stats.totalReadable
							that.totalLight = stats.totalLight
							that.totalDeep = stats.totalDeep
							that.totalRem = stats.totalRem
							// 1. 总睡眠小时数（ 保留 1 位小数）
							const totalAll = that.timeStrToMinutes(that.sleep); // 436
							const totalH = (totalAll / 60).toFixed(1)
							const deepMin = (that.timeStrToMinutes(that.totalDeep) / 60).toFixed(1);
							const remMin = (that.timeStrToMinutes(that.totalRem) / 60).toFixed(1);
							const lightMin = (that.timeStrToMinutes(that.totalLight) / 60).toFixed(1)
							that.sleep_point = that.overallSleepScore(totalAll, totalH, deepMin,
								remMin, lightMin)
							uni.setStorageSync("sleep_time", sleepObj.date.slice(6, sleepObj.date
								.length).replace("-", "/"))
							that.jakoblife_fat_scale3(that.shoubiaomac, stats.totalReadable, that
								.shoubiaosn,
								"睡眠");
							that.resetDataState()
						}

						if (that.quotient !== 0 && that.quotient1 !== 0 && (that.quotient +
								that.quotient1) === that.dataBuffer.length) {
							let firstArray = [];
							let secondArray = [];
							let currentArray = firstArray;
							that.dataBuffer.forEach((data) => {
								if (data.startsWith('e0')) {
									currentArray = currentArray === firstArray ?
										secondArray :
										firstArray;
								}
								currentArray.push(data);
							});
							const formattedFirstArray = that.formatData(firstArray);
							const formattedSecondArray = that.formatData(secondArray);
							// console.log('第一组数据血压数据:', formattedSecondArray);
							// console.log('第二组数据心率数据:', formattedFirstArray);
							// 解析血压数据
							const Covmamlueand = formattedSecondArray.slice(18,
								formattedSecondArray
								.length);
							const heartTime = Covmamlueand.slice(0, 4);
							const {
								year,
								month,
								day
							} = that.parseBinaryTime(heartTime);
							const hexData = Covmamlueand.slice(Covmamlueand.length - 16,
								Covmamlueand
								.length);
							const {
								systolic,
								diastolic
							} = that.parseBloodPressureData(hexData);
							// 解析心率数据
							const Covmamlueand1 = formattedFirstArray.slice(18,
								formattedFirstArray
								.length);
							const heartTime1 = Covmamlueand1.slice(0, 4);
							const {
								year: year1,
								month: month1,
								day: day1
							} = that.parseBinaryTime(heartTime1, that);
							const sec = parseInt('0000d670', 16); // 54896
							const t = new Date(sec * 1000).toISOString().substr(11, 8); // "15:14:56"
							const hexData1 = Covmamlueand1.slice(Covmamlueand1.length - 16,
								Covmamlueand1.length);
							const {
								diastolic: heartRate
							} = that.parseHeartRateData(hexData1);
							that.lowPressure = that.Blood === "mmHg" ? diastolic : (Number(diastolic) * 0.133)
								.toFixed(1);
							that.highPressure = that.Blood === "mmHg" ? systolic : (Number(systolic) * 0.133)
								.toFixed(1);
							that.pulse = heartRate;
							uni.setStorageSync("lowPressure", diastolic)
							uni.setStorageSync("highPressure", systolic)
							uni.setStorageSync("pulse", heartRate)
							that.updateBloodPressureStatus(diastolic, systolic);
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										that.bgaaa(diastolic, systolic)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							that.xueyabiaoshi = "1"
							that.jakoblife_fat_scale22(that.shoubiaomac, systolic, diastolic,
								heartRate, that.shoubiaosn);
							that.dataBuffer = [];
							that.quotient = 0;
							that.quotient1 = 0;
						} else if (that.quotient === 0 && that.quotient1 !== 0 && that
							.quotient1 ===
							that.dataBuffer.length && that.dataBuffer[0].startsWith("e0")
						) {
							// 合并数据
							const AlltypeArray = that.dataBuffer;
							const alltypearray = that.formatData(AlltypeArray);
							// 解析协议数据
							const protocolData = that.parseProtocolData(alltypearray);
							// 提取心率数据
							const heart = protocolData.Covmamlueand.slice(0, 8); // 头部4个字节
							const heartTime = heart.slice(0, 4); // 时间部分（2个字节）
							const {
								year,
								month,
								day
							} = that.parseBinaryTime(heartTime);
							// 提取心率数据
							const hexData = protocolData.Covmamlueand.slice(protocolData
								.Covmamlueand
								.length - 16, protocolData.Covmamlueand.length); // 最后8个字节
							const heartRateData = that.parseHeartRateData(hexData);
							// 根据协议子命令处理数据
							switch (protocolData.Protocolsubcommand) {
								case "00":
									that.pulse = heartRateData.diastolic
									that.xueyabiaoshi = "1"

									that.jakoblife_fat_scale22(that.shoubiaomac, "", "",
										heartRateData.diastolic, that.shoubiaosn);

									// 清空数据缓冲区
									that.resetDataState()
									break;
								case "02":
									// 清空数据缓冲区
									that.resetDataState()
									const xueyang = heartRateData.diastolic;
									const xueyangtimes = `${month}/${day}`;
									uni.setStorageSync("xueyang", xueyang);
									uni.setStorageSync("xueyangtimes", xueyangtimes);
									that.jakoblife_fat_scale3(thta.shoubiaomac, heartRateData
										.diastolic, that.shoubiaosn,
										"血氧");
									break;
								default:
									that.resetDataState()
							}
							that.resetDataState()
						}
					}
				})
			},

			timeStrToMinutes(str = '') {
				const upper = str.toUpperCase();
				let h = 0,
					m = 0;
				// 匹配 7H 或 7 H
				const hMatch = upper.match(/(\d+)\s*H/);
				if (hMatch) h = Number(hMatch[1]);
				// 匹配 16M 或 16 M
				const mMatch = upper.match(/(\d+)\s*M/);
				if (mMatch) m = Number(mMatch[1]);
				return h * 60 + m;
			},
			/**
			 * 综合睡眠评分
			 * @param {number} totalH   总睡眠时长（小时，已保留 1 位小数）
			 * @param {number} deepMin  深睡分钟
			 * @param {number} remMin   REM 分钟
			 * @param {number} lightMin 浅睡分钟
			 * @returns {number} 0~100 分
			 */
			overallSleepScore(totalAll, totalH, deepMin, remMin, lightMin) {
				/* 1. 睡眠时长得分 0~100（权重 30%） */
				let durationScore;
				if (totalH >= 7) durationScore = 100;
				else if (totalH >= 6) durationScore = 80;
				else if (totalH >= 5) durationScore = 60;
				else durationScore = 30;
				/* 2. 睡眠结构得分 0~100（权重 35%） */
				const pct = (min) => (min / totalAll) * 100;
				const d = pct(deepMin);
				const r = pct(remMin);
				const l = pct(lightMin);
				let structScore = 100;
				// 深睡 20-25%
				if (d < 20) structScore -= Math.ceil((20 - d) / 5) * 10;
				else if (d > 25) structScore -= Math.ceil((d - 25) / 5) * 10;
				// REM 20-25%
				if (r < 20) structScore -= Math.ceil((20 - r) / 5) * 10;
				else if (r > 25) structScore -= Math.ceil((r - 25) / 5) * 10;
				// 浅睡 <55%
				if (l > 55) structScore -= Math.ceil((l - 55) / 5) * 5;
				structScore = Math.max(0, structScore);

				const efficiencyScore = 80; // TODO：睡眠连续性
				const latencyScore = 80; // TODO：睡眠效率
				/* 3. 加权求和（其余 35% 可先留空或继续扩展） */
				const finalScore =
					durationScore * 0.30 +
					structScore * 0.35 +
					efficiencyScore * 0.20 +
					latencyScore * 0.15;
				return Math.round(finalScore);
			},


			calcSleepMinutes(sleepObj) {
				// 正式睡眠：浅睡 + 深睡 + 眼动
				const formalMinutes = sleepObj.totalLight + sleepObj.totalDeep + sleepObj.totalRem;
				console.log("Light", sleepObj.totalLight)
				console.log("totalDeep", sleepObj.totalDeep)
				console.log("totalRem", sleepObj.totalRem)
				const Light = sleepObj.totalLight
				const Deep = sleepObj.totalDeep
				const Rem = sleepObj.totalRem
				// 小睡总时长（把 type=10000 的段累加即可）
				const napMinutes = sleepObj.partList
					.filter(p => p.type === 10000)
					.reduce((sum, p) => sum + p.time, 0);
				// 含小睡
				const totalWithNap = formalMinutes + napMinutes;
				return {
					formalMinutes, // 301
					formalReadable: `${Math.floor(formalMinutes / 60)}${"H"}${formalMinutes % 60}${"M"}`,
					napMinutes, // 77
					napReadable: `${Math.floor(napMinutes / 60)}${"H"}${napMinutes % 60}${"M"}`,
					totalWithNap, // 378
					totalReadable: `${Math.floor(totalWithNap / 60)}${"H"}${totalWithNap % 60}${"M"}`,
					Light,
					totalLight: `${Math.floor(Light / 60)}${"H"}${Light % 60}${"M"}`,
					Deep,
					totalDeep: `${Math.floor(Deep / 60)}${"H"}${Deep % 60}${"M"}`,
					Rem,
					totalRem: `${Math.floor(Rem / 60)}${"H"}${Rem % 60}${"M"}`,
				};
			},

			hexToAscii(hexString) {
				let str = '';
				for (let i = 0; i < hexString.length; i += 2) {
					let hex = hexString.substr(i, 2);
					str += String.fromCharCode(parseInt(hex, 16));
				}
				return str;
			},
			parseQueryString(queryString) {
				let params = queryString.split('&');
				let result = {};
				params.forEach(param => {
					let [key, value] = param.split('=');
					result[key] = value;
				});
				return result;
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
			Notificationss(name) {
				this.createNotification(this.$t("通知标题"), name,
					'/pages/tabBar/my/Alarms')
			},
			bgaaa(lowPressure, highPressure) {
				if ((lowPressure >= 81 && lowPressure <= 90) || (highPressure >= 121 && highPressure <= 140)) {
					uni.showModal({
						title: this.$t("提示"),
						content: this.$t("显示结果弹窗"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {}
						}
					});
				} else if ((lowPressure >= 91 && lowPressure <= 100) || (highPressure >= 141 && highPressure <=
						160)) {
					uni.showModal({
						title: this.$t("提示"),
						content: this.$t("显示结果弹窗"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {}
						}
					});
				} else if ((lowPressure >= 101 && lowPressure <= 110) || (highPressure >= 161 && highPressure <=
						180)) {
					uni.showModal({
						title: this.$t("提示"),
						content: this.$t("显示结果弹窗"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {}
						}
					});
				}
			},
			//上报血压计血压数据
			jakoblife_fat_scale(deviceId, parsedData, deviceSn) {
				let timess = this.datatime(this.dundatetime())
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
					time: timess
				}
				uni.setStorageSync("xueyadatatype", "0")
				uni.setStorageSync("xueyadata", data)
				console.log("哈哈哈哈哈哈", uni.getStorageSync("xueyadata"))
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(resaa => {
					console.log("血压计", resaa)
					if (resaa.code === 200) {
						uni.removeStorageSync("xueyadatatype")
						uni.removeStorageSync("xueyadata")
						this.setbanhua(1)
						// this.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.StorageInfo(aaa)
						}, 1000)
					}
				})
			},
			// 上报体脂秤数据
			jakoblife_fat_scale1(deviceSn, deviceId, parsedData) {

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
				console.log("tizhong", data)
				uni.setStorageSync("tizhidata", data)
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
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
						}, 1000)
					}

				})
			},
			//上报mC手表血压计数据
			jakoblife_fat_scale2(deviceId, shousuoye, shuzhangya, maibo, deviceSn) {
				let timess = this.datatime(this.dundatetime())
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
					time: timess
				}
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(reslk => {
					if (reslk.code === 500) {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
						return
					} else {
						this.setbanhua(1)
						this.bgaaa(aaa.lowPressure, aaa.highPressure)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.StorageInfo(aaa)
						}, 1000)
					}
				})
			},
			// 上报金亿帝手表血压数据
			jakoblife_fat_scale22(deviceId, shousuoye, shuzhangya, maibo, deviceSn) {
				console.log(deviceId)
				console.log(shousuoye)
				console.log(shuzhangya)
				console.log(maibo)
				console.log(deviceSn)
				let aaa = {
					heartrate: maibo,
				};
				if (shousuoye !== "" && shuzhangya !== "") {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				let timess = this.datatime(this.dundatetime())
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: timess
				}

				uni.setStorageSync("xueyadatatype", "1")
				uni.setStorageSync("xueyadata", data)

				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					console.log("上报数据手表", res)
					if (res.code === 200) {
						uni.removeStorageSync("xueyadatatype")
						uni.removeStorageSync("xueyadata")
						this.setbanhua(1)
						this.bgaaa(aaa.lowPressure, aaa.highPressure)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.StorageInfo(aaa)
						}, 1000)
					}
				}).catch(errro => {
					console.log("errro", errro)
				})
			},
			// 上报金亿帝手表单独测量数据
			jakoblife_fat_scale3(deviceId, datapar, deviceSn, type) {
				const aaa = this.buildReportData(type, datapar);
				const timess = this.datatime(this.dundatetime())
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: timess
				}
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(resdb => {
					if (resdb.code === 500) {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
						return
					}
					this.setbanhua(1)
					this.bgaaa(aaa.lowPressure, aaa.highPressure)
					setTimeout(() => {
						this.getStorageInfooy(aaa)
						this.get_device_info(deviceSn)
					}, 1000)
				})
			},
			getStorageInfooy(aaa) {
				let that = this
				uni.getStorageInfo({
					success(res) {
						if (res.keys.includes("swichs") && uni.getStorageSync("swichs") === true) {
							const notify = {
								triggered: false
							};
							if (res.keys.includes("xeuyang1") || res.keys.includes("xeuyang2")) {
								that.checkAndNotify("xeuyang1", "xeuyang2", aaa.oxygen, "血氧", notify);
							}
						}
					},
				})
			},
			StorageInfo(aaa) {
				let that = this
				uni.getStorageInfo({
					success(res) {
						if (res.keys.includes("swichs") && uni.getStorageSync("swichs") === true) {
							const notify = {
								triggered: false
							};
							if (res.keys.includes("shuzhangyaId1") || res.keys.includes("shuzhangyaId2")) {
								that.checkAndNotify("shuzhangyaId1", "shuzhangyaId2", aaa.lowPressure,
									"舒张压",
									notify);
							}
							if (res.keys.includes("shousuoyaId1") || res.keys.includes("shousuoyaId2")) {
								that.checkAndNotify("shousuoyaId1", "shousuoyaId2", aaa.highPressure,
									"收缩压",
									notify);
							}
							if (res.keys.includes("maiboId1") || res.keys.includes("maiboId2")) {
								that.checkAndNotify("maiboId1", "maiboId2", aaa.heartrate, "脉搏", notify);
							}
						}
					},
				})
			},

			// 封装检查和通知的逻辑
			checkAndNotify() {
				let that = this
				if (that.notifyTriggered) {
					uni.getPushClientId({
						success(res) {
							that.sendPushMessage(res.cid);
							that.notifyTriggered = false;
						},
						fail(err) {
							that.notifyTriggered = false;
						}
					});
				}
			},

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


			dundatetime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now
					.getMonth() + 1;
				const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
				const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
				const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
				const timesssaa = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
				return timesssaa
			},

			dundatetime1() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now
					.getMonth() + 1;
				const day = now.getDate();
				const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
				const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
				const timesssaa = `${month}/${day} `
				return timesssaa
			},

			datatime(dateStr) {
				let date = new Date(dateStr);
				let timestamp = date.getTime();
				let timestampInSeconds = Math.floor(timestamp / 1000);
				return timestampInSeconds
			},

			sendLargeData(deviceId, serviceId, uuid, year, month, day, hour, minute, second) {
				let that = this
				const timeSyncData = that.createTimeSyncData(year, month, day, hour, minute,
					second); // 构造时间同步数据
				const buffer = that.toArrayBuffer(timeSyncData); // 转换为 ArrayBuffer
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					success: (res) => {},
					fail: (err) => {}
				});
			},

			//消息
			Historical_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/message"
				})
			},

			calculateChecksum(data) {
				let sum = 0;
				for (let i = 0; i < data.length; i += 2) {
					sum += parseInt(data.substr(i, 2), 16);
				}
				return (sum & 0xFF).toString(16).padStart(2, '0');
			},

			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},

			decimalToHex(decimal, length = 2) {
				// 转换为十六进制字符串
				const hex = decimal.toString(16).toUpperCase();
				// 使用 padStart 补齐零，确保固定长度
				return hex.padStart(length, '0');
			},
			//同步手表时间命令
			createTimeSyncData(year, month, day, hour, minute, second) {
				let that = this
				const timeData =
					`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}${second.toString().padStart(2, '0')}`;
				const header = "4259"; // 协议头
				const length = "01"; // 数据长度
				const totalPackets = "0001"; // 总包数
				const currentPacket = "0001"; // 当前分包序号
				const flag = "09"; // 标志
				const rawData =
					`${header}${length}${totalPackets}${currentPacket}${flag}${timeData}`;
				// const checksum = that.calculateChecksum(rawData); // 计算和校验
				const checksum = "0f"; // 计算和校验
				const finalData = `${rawData}${checksum}`; // 添加和校验
				return finalData;
			},
			getUserInfo() {
				this.$get(this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(UserInfo => {
					if (UserInfo.code == 200) {
						uni.setStorageSync("userid", UserInfo.data.userId);
						// 没有ECG的时候currentIndex要改成1
						if (this.currentIndex === 1) {
							this.chuhsikg = uni.getStorageSync("danwei2") === 1 ?
								"lb" : "kg";
							this.newweightKG = uni.getStorageSync("danwei2") === 1 ?
								"lb" : "KG";
							this.Initial_weight = this.chuhsikg === "kg" ? UserInfo.data.weight : WeightConverter
								.kgToLb(UserInfo.data.weight);
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
				if (this.loact === "境内") {
					this.handleUserInfoForChina(userData);
				} else if (this.loact === "境外") {
					this.handleUserInfoForOverseas(userData);
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
			// 子按钮点击事件处理
			onSubButtonClick(item) {
				console.log('📱 页面接收到子按钮点击:', item.text)
			},

			// 菜单打开事件
			onMenuOpen() {},
			processUserInfo(userData) {
				this.getInfo(userData);
				uni.setStorageSync("userid", userData.userId);
				this.pending(userData.userId);
				this.queryDevices();
				this.timsdpad = setInterval(res => {
					this.pending(userData.userId);
				}, 8000)
			},

			//最新体重点击事件
			new_latest() {
				uni.navigateTo({
					url: '../tendency/Historical_record'
				})
			},
			//初始体重点击事件
			Initial() {
				uni.navigateTo({
					url: '../my/Health_record'
				})
			},
			//目标体重点击事件
			Target() {
				this.$refs.mubiao_popup.open("center")
			},
			//目标体重弹窗关闭按钮点击事件
			mb_closess() {
				this.$refs.mubiao_popup.close()
			},
			//目标体重弹窗确定按钮点击事件
			mubiao_weight() {
				if (this.mubiao === "") {
					uni.showToast({
						title: this.$t("请输入目标体重"),
						icon: 'none'
					})
					return
				} else {
					this.fat_scale_tz1()
				}
			},
			bindDateChange(e) {
				this.birthday1111 = e.detail.value
			},
			bindDateChange2(e) {
				this.birthday2 = e.detail.value
			},

			// 定义一个函数来检查输入字段
			checkInput(value, message) {
				if (value === "" || value === undefined) {
					uni.showToast({
						title: message,
						icon: "none"
					});
					return false;
				}
				return true;
			},
			truesss() {
				// 检查所有输入字段
				if (!this.checkInput(this.shuzhangya, this.$t('请输入收缩压')) ||
					!this.checkInput(this.shousuoya, this.$t('请输入舒张压')) ||
					!this.checkInput(this.maibo, this.$t('请输入脉搏'))) {
					return;
				}
				this.pressure_data()
			},

			//用户在app手动上报血压数据
			pressure_data() {
				// 获取当前时间字符串
				let now = new Date(); // 获取当前时间
				let formattedTime = this.birthday1111 === this.$t('今天') ?
					now.toISOString().slice(0, 10) + " " + now.getHours() + ":" + now.getMinutes().toString().padStart(2,
						'0') : this.birthday1111 + " " + now.getHours() + ":" + now.getMinutes().toString().padStart(2,
						'0');
				let timestamp = Math.floor(new Date(formattedTime).getTime() / 1000); // 转换成时间戳（秒）
				let data = {
					deviceSn: uni.getStorageSync('deviceSn'),
					slaveSn: "0",
					slaveData: {
						lowPressure: this.shuzhangya,
						highPressure: this.shousuoya,
						heartrate: this.maibo
					},
					time: timestamp
				}
				console.log("pressure_data——data", data)
				this.$post(this.$url_pressure_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((res) => {
					console.log("pressure_data", res)
					if (res.code === 200) {
						this.$refs.qs_popup.close()
						this.birthday1111 = this.$t('今天')
						this.shousuoya = ''
						this.shuzhangya = ''
						this.maibo = ''
						uni.showToast({
							title: this.$t("成功"),
							icon: 'none'
						})
						this.list_recipe()
					} else {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
					}
				})
			},

			delate_icon_cl(name, item) {
				for (let i = 0; this.list.length > i; i++) {
					if (this.list[i].title == name) {
						this.list.splice(i, 1)
						let kapianlist = []
						kapianlist = this.list
						uni.setStorageSync("kapianlist", kapianlist)
					}
				}
			},

			delate_icon_cl_2(name, item) {
				for (let i = 0; this.list2.length > i; i++) {
					if (this.list2[i].title == name) {
						this.list2.splice(i, 1)
						let kapianlist2 = []
						kapianlist2 = this.list2
						uni.setStorageSync("kapianlist2", kapianlist2)
					}
				}
			},
			// 定义一个通用函数
			handleStorage(that, listKey, list) {
				uni.getStorageInfo({
					success: (ress) => {
						// 判断缓存是否存在
						if (ress.keys.includes(listKey)) {
							that[list] = uni.getStorageSync(listKey);
						} else {
							uni.setStorageSync(listKey, that[list]);
						}
					}
				});
			},
			// 查询用户的绑定设备
			queryDevices() {
				this.$post(this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						if (!this.queryDevicesDone) {
							switch (this.currentIndex) {
								case 0:
									this.handleStorage(this, 'kapianlist', 'list');
									break;
								case 1: // 没有ECG的时候currentIndex要改成1
									this.handleStorage(this, 'kapianlist2', 'list2');
									break;
							}
							this.queryDevicesDone = true; // 立刻上锁
							this.list_recipe();
						}
						if (res.rows !== "") {
							let deviceslist1 = res.rows.filter(item => item.mac !== null && item
								.deviceTypeId !==
								"11").map(item => item.mac);
							this.deviceList = deviceslist1;
							uni.setStorageSync("deviceList", deviceslist1)

						}
						if (uni.getStorageSync("appQX") === "1") {
							// console.log("获取到权限")
							this.aaaa(res.rows);
							uni.setStorageSync("lixianlist", res.rows)
						}
					} else {
						return
					}
				})
			},
			aaaa(rows) {
				rows.forEach((row) => {
					if (row.deviceTypeId === "10") {
						this.handleDeviceType10And13(row);
						this.devicdsdmac.push(row.mac)
						uni.setStorageSync("devicdsdmac", this.devicdsdmac)
					} else if (row.deviceTypeId === "13") {
						this.handleDeviceType10And13(row);
						this.devicdsdmac1.push(row.mac)
						uni.setStorageSync("devicdsdmac1", this.devicdsdmac1)
					} else if (row.deviceTypeId === "11") {
						this.handleDeviceType11(row);
					}
				});
				if (this.currentIndex === 3) { // 没有ECG的时候currentIndex要改成3
					this.list_recipe();
				}
			},
			// 定义一个通用函数
			handleDeviceType10And13(row) {
				if (this.deviceList.length !== 0 || uni.getStorageSync("deviceList").length !== 0) {
					this.initBluetooth();
				}
				uni.setStorageSync("deviceSn", row.deviceSn);
			},

			// 定义一个通用函数
			handleDeviceType11(row) {
				let that = this
				const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
				const options = systemInfo.platform === "android" ? "" : "options";
				TestUniPlugin.startScan(options, (callback) => {
					const data = systemInfo.platform === "android" ? callback.data : JSON
						.parse(callback.data);
					if (row.mac === data.mac) {
						console.log("data", data)
						if (systemInfo.platform === "android" && data.weightStatus === 1 &&
							data.weight !== "0.00" && data.testStatus === 255) {
							if ((data.weightUnit === 6 || data.weightUnit === 4) && that.newweightKG === "lb") {
								that.Latest_weight = data.weight
								that.lastWeightbishi = "0"
								uni.setStorageSync("weightlb", data.weight)
								uni.setStorageSync("weightkg", WeightConverter.lbToKg(data.weight))
							} else if (data.weightUnit === 0 && that.newweightKG === "KG") {
								that.Latest_weight = data.weight
								that.lastWeightbishi = ""
								uni.setStorageSync("weightlb", WeightConverter.kgToLb(data.weight))
								uni.setStorageSync("weightkg", data.weight)
							} else {
								if (that.newweightKG === "KG") {
									if (data.weightUnit === 0) {
										that.Latest_weight = data.weight
										that.lastWeightbishi = ""
										uni.setStorageSync("weightlb", WeightConverter.kgToLb(data.weight))
										uni.setStorageSync("weightkg", data.weight)
									} else {
										that.Latest_weight = WeightConverter.lbToKg(data.weight)
										that.lastWeightbishi = ""
										uni.setStorageSync("weightlb", data.weight)
										uni.setStorageSync("weightkg", WeightConverter.lbToKg(data.weight))
									}
								} else {
									if (data.weightUnit === 0) {
										that.Latest_weight = WeightConverter.kgToLb(data.weight)
										that.lastWeightbishi = ""
										uni.setStorageSync("weightlb", WeightConverter.kgToLb(data.weight))
										uni.setStorageSync("weightkg", data.weight)
									} else {
										that.Latest_weight = data.weight
										that.lastWeightbishi = "0"
										uni.setStorageSync("weightlb", data.weight)
										uni.setStorageSync("weightkg", WeightConverter.lbToKg(data.weight))
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
				if (that.currentIndex === 1) { // 没有ECG的时候currentIndex要改成1
					uni.setStorageSync("deviceSn", row.deviceSn);
					that.get_device_data(row.deviceSn);
					return
				}
			},


			//获取设备基础信息
			get_device_info(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_get_device_info, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code == 200) {
						switch (this.currentIndex) {
							case 0:
								if (res.data.deviceTypeId === "10" || res.data.deviceTypeId === "13") {
									uni.setStorageSync("deviceSn", deviceSn)
								}
								this.handleStorage(this, 'kapianlist', 'list');
								break;
							case 1: // 没有ECG的时候currentIndex要改成1
								if (res.data.deviceTypeId === "11") {
									uni.setStorageSync("deviceSn", deviceSn)
								}
								this.handleStorage(this, 'kapianlist2', 'list2');
								break;
						}
						this.list_recipe()
					} else {
						switch (this.currentIndex) {
							case 0:
								this.handleStorage(this, 'kapianlist', 'list');
								break;
							case 1: // 没有ECG的时候currentIndex要改成1
								this.handleStorage(this, 'kapianlist2', 'list2');
								break;
						}
					}
				})
			},
			pending(datainfo) {
				const data = {
					receiverId: datainfo
				}
				this.$post(this.$url_pending, data, {
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

			//时间戳转时间
			formatDate(value) {
				const data = new Date(value);
				const month = data.getMonth() + 1;
				const day = data.getDate();
				const year = data.getFullYear();
				const hours = data.getHours();
				const minutes = data.getMinutes();
				const seconds = data.getSeconds();
				const formattedTime = `${month}/${day}`;
				return formattedTime;
			},


			getRegisterVal(data, type, key) {
				const value = this.findValue(data, type, key);
				return value.registerVal !== null ? value.registerVal : "-/-";
			},

			getUpdateTime(data, type, key) {
				const value = this.findValue(data, type, key);
				return value ? this.formatDate(value.updateTime) : "-/-";
			},

			// 封装获取存储信息的通用函数
			getStorageInfo(keys, callback) {
				uni.getStorageInfo({
					success: (res) => {
						const hasAllKeys = keys.every(key => res.keys.includes(
							key));
						callback(hasAllKeys, res);
					}
				});
			},
			// 处理步数卡片
			processSteps(item, name) {
				let that = this
				const now = new Date().getTime();
				const stepItem = that.findValue(that.list, 'title', name);
				stepItem.Step_number = that.getRegisterVal(item, 'register', "steps")
				stepItem.Step_count = that.formatDate(now);
				stepItem.title = that.$t("步数");
				stepItem.type_LX = that.$t("计步");
				that.bushu = stepItem.Step_number
				that.bushu_time = stepItem.Step_count;
				that.saveDailySteps(that.bushu, that.bushu_time);
			},
			// 封装处理步数的逻辑
			processSteps2(item, name) {
				let that = this
				const now = new Date().getTime();
				const stepItem = that.findValue(that.list2, 'title', name);
				stepItem.Step_number = that.getRegisterVal(item, 'register', "steps")
				stepItem.Step_count = that.formatDate(now);
				stepItem.title = that.$t("步数");
				stepItem.type_LX = that.$t("计步");
				that.bushu = stepItem.Step_number
				that.bushu_time = stepItem.Step_count;
				// that.saveDailySteps(that.bushu, that.bushu_time);
			},

			// 封装处理身高、体重等通用逻辑
			processCommonData(itemdata, titleKey, dataKey, typeKey, unitKey) {
				let that = this
				const item = that.findValue(that.list2, 'title', titleKey);
				const data = that.findValue(itemdata, 'register', dataKey);
				const unit = uni.getStorageSync(unitKey) === 0 ? "inch" : "cm";
				item.type_LX = unit;
				item.Step_number = data?.registerVal || '--';
				item.Step_count = that.formatDate(data?.updateTime);
				item.title = that.$t("身高")
			},

			// 定义一个通用的处理函数
			updateCard(data, titleKey, dataKey, name) {
				let that = this
				const item = that.findValue(that.list2, 'title', titleKey);
				item.title = name
				item.Step_number = data[dataKey] || '-/-';
			},


			// 定义BMI分类逻辑
			updateBMI(data) {
				let that = this
				const bmiItem = that.findValue(that.list2, 'title', "BMI");
				const bmiValue = data.BMI || 0;
				bmiItem.Step_number = bmiValue;
				if (bmiValue < 18.5) {
					bmiItem.BMI_TF = 0;
					bmiItem.BMI_ys = that.$t("体重过轻");
				} else if (bmiValue <= 24.9) {
					bmiItem.BMI_TF = 1;
					bmiItem.BMI_ys = that.$t("正常体重");
				} else if (bmiValue <= 29.9) {
					bmiItem.BMI_TF = 2;
					bmiItem.BMI_ys = that.$t("超重");
				} else if (bmiValue <= 34.9) {
					bmiItem.BMI_TF = 3;
					bmiItem.BMI_ys = that.$t("一级肥胖");
				} else if (bmiValue <= 39.9) {
					bmiItem.BMI_TF = 4;
					bmiItem.BMI_ys = that.$t("二级肥胖");
				} else {
					bmiItem.BMI_TF = 5;
					bmiItem.BMI_ys = that.$t("三级肥胖或病态肥胖");
				}
			},

			// 封装处理BMI和其他通用逻辑
			processGenericData(itemdata, titleKey, dataKey) {
				let that = this
				const item = that.findValue(that.list2, 'title', titleKey);
				const data = that.findValue(itemdata, 'register', dataKey);
				item.Step_count = that.formatDate(data?.updateTime);
				item.title = that.$t(titleKey)
			},

			// 处理身高卡片
			processHeight(item, name) {
				let that = this
				const heightItem = that.findValue(that.list, 'title', name);
				const height = that.findValue(item, 'register', 'height')?.registerVal;
				const unit = uni.getStorageSync("danwei1") === 0 ? "inch" : "cm";
				heightItem.type_LX = unit;
				heightItem.title = that.$t("身高")
				heightItem.Step_number = height !== null ? (unit === "inch" ? WeightConverter.cmToInch(height) :
					height) : '-/-';
				heightItem.Step_count = that.formatDate(that.findValue(item, 'register',
					'height')?.updateTime);
			},
			// 处理体温卡片
			processTemperature(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("体温")
				temperatureItem.Step_number = uni.getStorageSync("tiwen") || "0";
				temperatureItem.Step_count = uni.getStorageSync("tiwentimes") || "--/--";
			},
			// 处理血氧卡片
			processBloodOxygen(item, name) {
				let that = this
				uni.getStorageInfo({
					success: (xueyangres) => {
						const bloodOxygenItem = that.findValue(that.list, 'title',
							name);
						if (xueyangres.keys.includes("xueyang")) {
							const xueyang = uni.getStorageSync("xueyang");
							bloodOxygenItem.Step_number = xueyang !== null ?
								xueyang : "0"
							if (xueyang <= 95) {
								bloodOxygenItem.BMI_ys = that.$t('偏低');
								bloodOxygenItem.BMI_TF = 0;
							} else if (xueyang < 98) {
								bloodOxygenItem.BMI_ys = that.$t('正常');
								bloodOxygenItem.BMI_TF = 1;
							} else if (parseInt(xueyang) >= 98) {
								bloodOxygenItem.BMI_ys = that.$t('偏高');
								bloodOxygenItem.BMI_TF = 10;
							}
						} else {
							const xueyang = that.findValue(item, 'register',
									'oxygen')
								?.registerVal;
							bloodOxygenItem.Step_number = xueyang
							if (parseInt(xueyang) <= 95) {
								bloodOxygenItem.BMI_ys = that.$t('偏低');
								bloodOxygenItem.BMI_TF = 0;
							} else if (parseInt(xueyang) < 98) {
								bloodOxygenItem.BMI_ys = that.$t('正常');
								bloodOxygenItem.BMI_TF = 1;
							} else if (parseInt(xueyang) >= 98) {
								bloodOxygenItem.BMI_ys = that.$t('偏高');
								bloodOxygenItem.BMI_TF = 10;
							}
						}
						if (xueyangres.keys.includes("xueyangtimes")) {
							bloodOxygenItem.Step_count = !uni.getStorageSync(
									"xueyangtimes") ? "-/-" : uni
								.getStorageSync("xueyangtimes");
						} else {
							const xueyangtime = that.formatDate(that.findValue(
									item, 'register', 'oxygen')
								?.updateTime);
							bloodOxygenItem.Step_count = !xueyangtime ? "-/-" :
								xueyangtime;
						}
						bloodOxygenItem.title = that.$t("血氧");
					}
				});
			},
			// 处理压力卡片
			processyali(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("压力");
				temperatureItem.Step_number = uni.getStorageSync("yali") || "0";
				temperatureItem.Step_count = uni.getStorageSync("yalitimes") || "--/--";
			},
			// 处理心率卡片
			processxiblv(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("心率");
				temperatureItem.Step_number = that.pulse;
				temperatureItem.Step_count = that.pulsetime
			},
			// 定义一个函数来封装血压等级判断逻辑
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
					// 正常高血压值
					{
						lowMin: 81,
						lowMax: 90,
						highMin: 121,
						highMax: 140,
						level: 1,
						name: this.$t("正常高血压值")
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

			//设备数据概览
			list_recipe() {
				const data = {
					userId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code == 200) {
						this.sleep_time = this.getUpdateTime(res.data, 'register', 'sleep')
						if (this.currentIndex === 0) {
							const slaveSn2Data = res.data.filter(item => item.slaveSn === "2");
							const slaveSn3Data = res.data.filter(item => item.slaveSn === "3");
							// 获取各项数据
							const getLatestData = (data1, data2, type) => {
								const time1 = this.findValue(data1, "register", type)?.updateTime || 0;
								const time2 = this.findValue(data2, "register", type)?.updateTime || 0;
								const val1 = this.getRegisterVal(data1, 'register', type);
								const val2 = this.getRegisterVal(data2, 'register', type);
								return time1 > time2 ? {
									value: val1,
									time: time1
								} : {
									value: val2,
									time: time2
								};
							}
							if (this.xueyabiaoshi === "" && !uni.getStorageSync('xueyadata')) {
								// 血压数据
								const highPressureData = getLatestData(slaveSn2Data, slaveSn3Data,
									"highPressure");
								const lowPressureData = getLatestData(slaveSn2Data, slaveSn3Data,
									"lowPressure");
								const pulseData = getLatestData(slaveSn2Data, slaveSn3Data, "heartrate");
								// 响应式更新血压数据
								this.$set(this, 'lowPressure', this.Blood === "mmHg" ?
									lowPressureData.value :
									(Number(lowPressureData.value) * 0.133).toFixed(1));
								this.$set(this, 'highPressure', this.Blood === "mmHg" ?
									highPressureData.value :
									(Number(highPressureData.value) * 0.133).toFixed(1));
								this.$set(this, 'pulse', pulseData.value);
								this.$set(this, 'pulsetime', this.formatDate(pulseData.time));
								// 更新血压状态
								this.updateBloodPressureStatus(lowPressureData.value, highPressureData
									.value);
							}
							const pulseData = getLatestData(slaveSn2Data, slaveSn3Data, "heartrate");
							this.$set(this, 'pulsetime', this.formatDate(pulseData.time));
							const kapianlist = uni.getStorageSync("kapianlist") || [];
							let itelistasd = []
							for (let i = 0; i < kapianlist.length; i++) {
								const item = kapianlist[i];
								if (item.title === "步数" || item.title === "Steps") {
									// this.processSteps(res.data, item.title);
								} else if (item.title === "身高" || item.title === "Height") {
									this.processHeight(res.data, item.title);
								} else if (item.title === "体温" || item.title === "Body Temperature") {
									this.processTemperature(res.data, item.title);
								} else if (item.title === "血氧" || item.title === "SpO₂") {
									this.processBloodOxygen(res.data, item.title);
								} else if (item.title === "压力" || item.title === "Stress") {
									this.processyali(res.data, item.title);
								} else if (item.title === "心率" || item.title === "Heart") {
									this.processxiblv(res.data, item.title);
								}
								itelistasd.push(item)
							}
							uni.setStorageSync("kapianlist", itelistasd)
							this.$nextTick(() => {
								this.$forceUpdate();
							});
						} else if (this.currentIndex === 1) { // 没有ECG的时候currentIndex要改成1
							if (this.lastWeightbishi === "" && !uni.getStorageSync("tizhidata")) {
								this.Latest_weight = this.newweightKG === "KG" ? this.getRegisterVal(res
									.data,
									'register', 'weight') : WeightConverter.kgToLb(this.getRegisterVal(
									res
									.data, 'register', 'weight'));
							}
							this.Latest_date = this.getUpdateTime(res.data, 'register', 'weight')
							this.Target_weight = this.chuhsikg === "kg" ? this.getRegisterVal(res.data,
								'register',
								'goal_weight') : WeightConverter.kgToLb(this.getRegisterVal(res.data,
								'register', 'goal_weight'));
							this.Chest_circumference = this.getRegisterVal(res.data, 'register',
								'chest_circumference');
							this.waistline = this.getRegisterVal(res.data, 'register', 'waistline');
							this.Hip_circumference = this.getRegisterVal(res.data, 'register', 'hipline');
							this.Upper_Chest_circumference = this.getRegisterVal(res.data, 'register',
								'biceps_circumference');
							this.Thigh_circumference = this.getRegisterVal(res.data, 'register',
								'thigh_circumference');
							this.Calf_circumference = this.getRegisterVal(res.data, 'register',
								'calf_circumference');
							const kapianlist2 = uni.getStorageSync("kapianlist2") || [];
							for (let i = 0; i < kapianlist2.length; i++) {
								const item = kapianlist2[i];
								if (item.title === "步数" || item.title === "Steps") {
									// this.processSteps2(res.data, item.title);
								} else if (item.title === "身高" || item.title === "Height") {
									// this.processCommonData(res.data, item.title, 'height', 'danwei1',
									// 	"cm");
								} else if (item.title === "BMI") {
									this.processGenericData(res.data, "BMI", "weight");
								} else if (item.title === "骨含量" || item.title === "Bone Mass") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "肌肉量" || item.title === "Muscle Mass") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "蛋白率" || item.title === "Protein%") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "水分" || item.title === "Water%") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "内脏脂肪指数" || item.title === "VFI") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "脂肪率" || item.title === "Fat%") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "基础代谢率" || item.title === "BMR") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "皮下脂肪率" || item.title === "SubQ Fat%") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (item.title === "身体年龄" || item.title === "Body Age") {
									this.processGenericData(res.data, item.title, "weight");
								}
							}
						} else if (this.currentIndex === 2) { // 没有ECG的时候currentIndex要改成2
							uni.getStorageInfo({
								success: (ress) => {
									this.yali = uni.getStorageSync("yali") || "0";
									this.yali_time = uni.getStorageSync("yalitimes") ||
										"--/--";
								},
							});

							this.sleep = this.getRegisterVal(res.data, 'register', 'sleep');
							this.sleep_time = this.getUpdateTime(res.data, 'register', 'sleep')
							if (this.getRegisterVal(res.data, 'register', 'sleep') === null || this
								.getRegisterVal(
									res.data, 'register', 'sleep') === "-/-") {
								this.totalLight = "--/--"
								this.totalDeep = "--/--"
								this.totalRem = "--/--"
								this.sleep_point = "--/--"
								this.sleep = "--/--"
								this.sleep_time = "--/--"
							} else if (this.getRegisterVal(res.data, 'register', 'sleep') === '0H0M') {
								this.totalLight = "0H0M"
								this.totalDeep = "0H0M"
								this.totalRem = "0H0M"
								this.sleep_point = "--/--"
								this.sleep = "0H0M"
								this.sleep_time = this.getUpdateTime(res.data, 'register', 'sleep')
							} else {
								this.totalLight = uni.getStorageSync("totalLight")
								this.totalDeep = uni.getStorageSync("totalDeep")
								this.totalRem = uni.getStorageSync("totalRem")
								// 1. 总睡眠小时数（ 保留 1 位小数）
								const totalAll = this.timeStrToMinutes(this.sleep); // 436
								const totalH = (totalAll / 60).toFixed(1)
								const deepMin = (this.timeStrToMinutes(this.totalDeep) / 60).toFixed(1);
								const remMin = (this.timeStrToMinutes(this.totalRem) / 60).toFixed(1);
								const lightMin = (this.timeStrToMinutes(this.totalLight) / 60).toFixed(1)
								this.sleep_point = this.overallSleepScore(totalAll, totalH, deepMin,
									remMin,
									lightMin)
								uni.setStorageSync("sleep_point", this.sleep_point)
							}
						} else if (this.currentIndex === 3) { // 没有ECG的时候currentIndex要改成3
							this.bushu = this.getRegisterVal(res.data, 'register', 'steps');
							this.bushu_time = this.getUpdateTime(res.data, 'register', 'steps')
							this.saveDailySteps(this.bushu, this.bushu_time);
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
			//获取体脂秤身体指数
			get_device_data(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_get_device_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code == 200) {
						const kapianlist2 = uni.getStorageSync("kapianlist2") || [];
						let itelistasd2 = []
						const data = res.data;
						for (let i = 0; i < kapianlist2.length; i++) {
							const item = kapianlist2[i];
							if (item.title === "BMI") {
								this.updateBMI(data);
							} else if (item.title === "骨含量" || item.title === "Bone Mass") {
								this.updateCard(data, item.title, "BM", this.$t("骨含量"));
							} else if (item.title === "肌肉量" || item.title === "Muscle Mass") {
								this.updateCard(data, item.title, "ROM", this.$t("肌肉量"));
							} else if (item.title === "蛋白率" || item.title === "Protein%") {
								this.updateCard(data, item.title, "PP", this.$t("蛋白率"));
							} else if (item.title === "水分" || item.title === "Water%") {
								this.updateCard(data, item.title, "MOI", this.$t("水分"));
							} else if (item.title === "内脏脂肪指数" || item.title === "VFI") {
								this.updateCard(data, item.title, "UVI", this.$t("内脏脂肪指数"));
							} else if (item.title === "脂肪率" || item.title === "Fat%") {
								this.updateCard(data, item.title, "BFR", this.$t("脂肪率"));
							} else if (item.title === "基础代谢率" || item.title === "BMR") {
								this.updateCard(data, item.title, "BMR", this.$t("基础代谢率"));
							} else if (item.title === "皮下脂肪率" || item.title === "SubQ Fat%") {
								this.updateCard(data, item.title, "SFR", this.$t("皮下脂肪率"));
							} else if (item.title === "身体年龄" || item.title === "Body Age") {
								this.updateCard(data, item.title, "PA", this.$t("身体年龄"));
							}
							itelistasd2.push(item)
						}
						uni.setStorageSync("kapianlist2", itelistasd2)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			tiaozhen() {
				this.binaji = false
				this.animation = 'shake';
				this.button_show = true
				this.delate_icon = true
				this.disabledsaaa = true
				this.disabletouch = true
			},
			tiaozhen2() {
				this.binaji2 = false
				this.animation2 = 'shake';
				this.button_show2 = true
				this.delate_icon2 = true
				this.disabledsaaa2 = true
				this.disabletouch = true
			},
			add_bt_xy() {
				uni.navigateTo({
					url: "../main/card1"
				})
				setTimeout(() => {
					this.queryDevicesDone = false
				}, 1000)
			},
			add_bt2() {
				uni.navigateTo({
					url: '../main/card'
				})
				setTimeout(() => {
					this.queryDevicesDone = false
				}, 1000)
			},
			ture_bt() {
				this.binaji = true
				this.animation = '';
				this.button_show = false
				this.delate_icon = false
				this.disabledsaaa = true
				this.queryDevicesDone = false; // 立刻上锁
				this.disabletouch = false
				uni.setStorageSync("kapianlist", this.list)
			},
			ture_bt2() {
				this.binaji2 = true
				this.animation2 = '';
				this.button_show2 = false
				this.delate_icon2 = false
				this.disabledsaaa2 = true
				this.queryDevicesDone = false; // 立刻上锁
				this.disabletouch = false
				uni.setStorageSync("kapianlist2", this.list2)
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
			xueya_tap() {
				this.$refs.popup.open("center")
			},
			BMI_tap(id) {
				if (id == this.$t("血氧")) {
					this.$refs.popup2.open("center")
				} else {
					this.$refs.popup1.open("center")
				}
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
						title: this.$t('请输入体重'),
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
			validateAndProceed() {
				const validations = [{
						key: 'xiongwei',
						message: this.$t('请输入胸围'),
						validator: value => value !== "" && value !== undefined
					},
					{
						key: 'yaowei',
						message: this.$t('请输入腰围'),
						validator: value => value !== "" && value !== undefined
					},
					{
						key: 'tunwei',
						message: this.$t('请输入臀围'),
						validator: value => value !== "" && value !== undefined
					},
					{
						key: 'shangtunwei',
						message: this.$t('请输入上臂围'),
						validator: value => value !== "" && value !== undefined
					},
					{
						key: 'datuiwei',
						message: this.$t('请输入大腿围'),
						validator: value => value !== "" && value !== undefined
					},
					{
						key: 'xiaotuiwei',
						message: this.$t('请输入小腿围'),
						validator: value => value !== "" && value !== undefined
					}
				];
				for (let i = 0; i < validations.length; i++) {
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
			popup_sd() {
				this.validateAndProceed();
			},
			xueyaclick() {
				this.$refs.qs_popup.open("center")
			},
			tizhiclick() {
				this.fillOut = true
			},
			closess() {
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
			Keep() {
				this.fillOut = false
				this.$refs.tizhong_popup.open("center")
			},
			dataclick() {
				this.$refs.myPicker.show();
			},
			handleSubmit(e) {
				this.birthday = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			handleSubmit1(e) {
				this.birthday1 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			dataclick1() {
				this.$refs.myPicker1.show();
			},

			sdsr() {
				this.$refs.tihzi_popup_hd.close()
				this.$refs.tihzi_popup_sd.open("center")
			},
			hdsr() {
				this.$refs.tihzi_popup_sd.close()
				this.$refs.tihzi_popup_hd.open("center")
			},
			Body_circumference() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.open("center")
			},
			//用户在app手动上报重量数据
			fat_scale_tz() {
				const timestamp = Math.floor(new Date(this.birthday2 == this.$t('今天') ? this.endtimesss + " " +
						new Date().getHours() + ":" + new Date().getMinutes() : this.birthday2).getTime() /
					1000); // 将时间转换成时间戳（以秒为单位）
				const data = {
					deviceSn: uni.getStorageSync("deviceSn"),
					slaveSn: "0",
					slaveData: {
						weight: this.tizhong
					},
					time: timestamp
				}
				this.$post(this.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						this.tizhong = ''
						this.birthday2 = this.$t('今天')
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.list_recipe()
						this.$refs.tizhong_popup.close()
					}
				})
			},
			//用户在app手动上报重量数据
			fat_scale_tz1() {
				const timestamp = new Date(this.endtimesss + " " + new Date().getHours() + ":" +
					new Date().getMinutes()).getTime() / 1000; // 将时间转换成时间戳（以秒为单位）
				const data = {
					deviceSn: uni.getStorageSync("deviceSn"),
					slaveSn: "1",
					slaveData: {
						goal_weight: this.mubiao,
					},
					time: timestamp
				}
				this.$post(this.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						this.mubiao = ""
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.$refs.mubiao_popup.close()
						this.list_recipe()
					}
				})
			},
			//用户在app手动上报六围数据
			fat_scale() {
				const timestamp = Math.floor(new Date(this.birthday == this.$t('今天') ? this
					.endtimesss : this.birthday).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
				const data = {
					slaveSn: "1",
					slaveData: {
						start_weight: '',
						goal_weight: '',
						chest_circumference: this.xiongwei,
						waistline: this.yaowei,
						hipline: this.tunwei,
						biceps_circumference: this.shangtunwei,
						thigh_circumference: this.datuiwei,
						calf_circumference: this.xiaotuiwei,
					},
					time: timestamp
				}
				this.$post(this.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						this.mubiao = ""
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.$refs.mubiao_popup.close()
						this.list_recipe()
					}
				})
			},
			//用户在app手动上报六围数据
			fat_scale_1() {
				const timestamp = Math.floor(new Date(this.birthday1 == this.$t('今天') ? this
					.endtimesss : this.birthday1).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
				const data = {
					slaveSn: "1",
					slaveData: {
						start_weight: '',
						goal_weight: '',
						chest_circumference: this.xw_value,
						waistline: this.yw_value,
						hipline: this.tw_value,
						biceps_circumference: this.stw_value,
						thigh_circumference: this.dtw_value,
						calf_circumference: this.xtw_value,
					},
					time: timestamp
				}
				this.$post(this.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: this.$t("成功"),
							icon: 'none'
						})
						this.list_recipe()
						this.$refs.tihzi_popup_hd.close()
					}
				})
			},

			/* ==================== 新增ECG方法 start ==================== */
			// 显示完整波形
			showFullWaveform() {
				if (this.hasMeasurementData) {
					this.$refs.wave.showFullWave();
					this.tip = '显示完整测量波形，可使用放大缩小功能查看细节';
				} else {
					uni.showToast({
						title: '暂无测量数据',
						icon: 'none'
					});
				}
			},

			// 清空波形数据
			clearWave() {
				this.$refs.wave.clear();
				this.dataCount = 0;
				this.fullDataCount = 0;
				this.queueLength = 0;
				this.measurementStatus = '';
				this.tip = '数据已清空';
			},
			/* ==================== 主流程 ==================== */
			async toggleConnect() {
				if (this.connected) {
					await this.disConnect();
					return
				}
				this.connecting = true;
				this.tip = '初始化适配器...'
				try {
					await this.openAdapter()
					await this.startDiscovery()
					const dev = await this.findDevice()
					await this.connectDevice(dev.deviceId)
					await this.openNotifyAndWrite() // 一次性搞定 notify + write
					// await this.sendEcgStart() // 发 3 帧
					this.tip = '等待血压计开始...';
					this.dataSource = '血压计'
				} catch (e) {
					this.tip = '失败：' + (e.errMsg || e.message);
					this.connected = false
				} finally {
					this.connecting = false
				}
			},

			/* -------------------- 蓝牙底层 -------------------- */
			openAdapter() {
				return new Promise((resolve, reject) =>
					uni.openBluetoothAdapter({
						success: resolve,
						fail: reject
					}))
			},
			startDiscovery() {
				return new Promise((resolve, reject) =>
					uni.startBluetoothDevicesDiscovery({
						services: [SERVICE_ID],
						success: () => setTimeout(resolve, 800),
						fail: reject
					}))
			},
			findDevice() {
				return new Promise((resolve, reject) =>
					uni.getBluetoothDevices({
						success: res => {
							const dev = res.devices.find(d => d.name === 'BP68W' || d.localName ===
								'BP68W')
							dev ? resolve(dev) : reject(new Error('未发现 BP68W'))
						},
						fail: reject
					}))
			},
			connectDevice(deviceId) {
				return new Promise((resolve, reject) =>
					uni.createBLEConnection({
						deviceId,
						success: () => {
							this.deviceId = deviceId;
							this.connected = true;
							resolve()
						},
						fail: reject
					}))
			},
			openNotifyAndWrite() {
				setTimeout(() => {
					this.getBLEDeviceServices(this.deviceId);
				}, 1000);
			},

			getBLEDeviceServices(deviceId) {
				let that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						console.log("res.services", res.services)
						switch (res.services.length) {
							case 3:
								that.getBLEDeviceCharacteristicsECG(deviceId, res.services[2].uuid)
								break
						}

					},
					fail(res) {}
				})
			},
			getBLEDeviceCharacteristicsECG(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						console.log(res)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知
							if (item.properties.write) {
								console.log("deviceId", deviceId)
								console.log("serviceId", serviceId)
								console.log("characteristicId", item.uuid)
								that.deviceIdECG = deviceId
								that.serviceIdECG = serviceId
								that.uuidECG = item.uuid
								// setTimeout(() => {
								// 	that.sendCnt = 0
								// 	that.send(deviceId, serviceId, item.uuid)
								// }, 2000)

							}
							if (item.properties.notify) {
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										let rxBuf = ''; // 剩余未处理十六进制字符串
										uni.onBLECharacteristicValueChange((res) => {
											const dataList = that.ab2hex(res
												.value)
											console.log("蓝牙返回的的数据：", dataList)
											this.buffer += this.ab2hex(res
												.value)
											this.tryParse()
										})
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
			},

			startbtn() {
				this.sendCnt = 0
				this.send(this.deviceIdECG, this.serviceIdECG, this.uuidECG)
				setTimeout(() => {
					uni.showToast({
						title: '请在30S内将双手手指放在ECG设备上，点击设备上开始按钮进行测量',
						icon: 'none',
						duration: 3000
					})
				}, 2000)
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
					serviceId,
					characteristicId: writeCharId,
					writeType: 'writeNoResponse',
					value: this.toArrayBuffer(hex),
					success: () => {
						console.log(`第${this.sendCnt}次写入成功`);
						setTimeout(() => this.send(deviceId, serviceId, writeCharId), 50);
					},
					fail: e => {
						console.error(`第${this.sendCnt}次写入失败`, e)
						uni.showToast({
							title: `第${this.sendCnt}次写入失败`,
							icon: 'none',
							duration: 1500
						})
					}
				});
			},
			getServices(deviceId) {
				return new Promise((resolve, reject) =>
					uni.getBLEDeviceServices({
						deviceId,
						success: res => {
							console.log("res.services", res.services)
							resolve(res.services)
						},
						fail: reject
					}))
			},
			getCharacteristics(deviceId, serviceId) {
				return new Promise((resolve, reject) =>
					uni.getBLEDeviceCharacteristics({
						deviceId,
						serviceId,
						success: res => {
							console.log("res.characteristics", res.characteristics)
							resolve(res.characteristics)
						},
						fail: reject
					}))
			},
			enableNotify(deviceId, serviceId, characteristicId) {
				return new Promise((resolve, reject) =>
					uni.notifyBLECharacteristicValueChange({
						deviceId,
						serviceId,
						characteristicId,
						state: true,
						success: resolve,
						fail: reject
					}))
			},

			/* ==================== 协议层 ==================== */
			async sendEcgStart() {
				for (let i = 0; i < 3; i++) {
					if (i) await new Promise(r => setTimeout(r, 50))
					await this.writeCmd(CMD_ECG_START)
				}
			},
			sendStop() {
				this.writeCmd(CMD_ECG_STOP).then(() => this.tip = '已发送停止命令')
			},
			writeCmd(cmd) {
				return new Promise((resolve, reject) =>
					uni.writeBLECharacteristicValue({
						deviceId: this.deviceIdECG,
						serviceId: this.serviceIdECG,
						characteristicId: this.uuidECG, // 动态拿到的
						value: this.toArrayBuffer("A61500150A"),
						writeType: 'writeNoResponse',
						success: (e) => {
							console.error('write fail', e)
							resolve
						},
						fail: (e) => {
							console.error('write fail', e)
							reject(e)
						}
					}))
			},

			/* 分包拼接解析 */
			tryParse() {
				while (true) {
					const idx = this.buffer.indexOf('0a')
					if (idx === -1) break
					const frameHex = this.buffer.slice(0, idx + 2)
					this.buffer = this.buffer.slice(idx + 2)
					const frame = new Uint8Array(frameHex.match(/.{2}/g).map(b => parseInt(b, 16)))
					if (frame.length < 5) continue
					const head = frame[0]
					if (head === 0x23) this.parseWave(frame)
					else if (head === 0xA6) this.parseCmd(frame)
				}
			},
			parseWave(buf) {
				if (buf[buf.length - 1] !== 0x0A) return;
				const sumRx = buf[buf.length - 2];
				const sumCalc = buf.slice(1, -2).reduce((s, b) => s + b, 0) & 0xFF;
				if (sumRx !== sumCalc) return;
				const str = String.fromCharCode(...buf.slice(1, -2));
				const val = parseFloat(str);
				if (Number.isNaN(val)) return;

				this.$refs.wave.pushData([val]);
				this.dataCount++;
				this.fullDataCount = this.$refs.wave.getFullDataCount();
				this.queueLength = this.$refs.wave.getQueueLength();

			},
			parseCmd(buf) {
				if (buf[1] !== 0x15) return;
				const map = {
					0x00: '采集结束',
					0x01: '采集开始',
					0x02: '采集错误（未按键/提前结束）'
				};
				this.measurementStatus = map[buf[2]] || '未知状态';
				this.tip = this.measurementStatus;

				if (buf[2] === 0x00) {
					// 测量结束，提示用户可以查看完整波形
					setTimeout(() => {
						uni.showModal({
							title: '测量完成',
							content: `本次测量共采集 ${this.fullDataCount} 个数据点，是否查看完整波形？`,
							confirmText: '查看完整波形',
							cancelText: '暂不查看',
							success: (res) => {
								if (res.confirm) {
									this.showFullWaveform();
								}
							}
						});
					}, 500);
				} else if (buf[2] === 0x02) {
					uni.showToast({
						title: '用户未按开始键或已暂停',
						icon: 'none'
					});
				}
			},

			/* ==================== UI ==================== */

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
			/* ==================== 新增ECG方法 end ==================== */
		},
	}
</script>

<style scoped lang="scss">
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
			opacity: 0.9; //属性指定了一个元素的不透明度。换言之，opacity 属性指定了一个元素后面的背景的被覆盖程度。
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999; //这一步很重要
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

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
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


	/* 横向滚动容器 */
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

	/* 导航项容器 - 用于水平排列 */
	.nav-container {
		display: inline-flex;

	}

	/* 每个导航项 */
	.item {
		width: 100%;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 0 20px;
		position: relative;
	}

	/* 导航文字 */
	.tab-text {
		color: white;
		font-size: 16px;
		padding: 5px 0;
		font-weight: 400;
		transition: color 0.3s;
	}

	/* 选中状态的文字 */
	.tab-text.active {
		color: greenyellow;
		font-size: 16px;
		font-weight: 400;
	}

	/* 下划线 */
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

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
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
		/* 关键：扩大点击区域 */
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


	//ECG
	/* 样式保持不变，只添加了完整波形按钮的禁用状态 */
	.btn:disabled {
		opacity: 0.5;
	}

	/* 核心样式，其余沿用你之前的即可 */
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
		background: #fff;
		border-radius: 16rpx;
		padding: 24px;
		margin-top: 240px;
		margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
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
		margin-bottom: 100px;
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
</style>