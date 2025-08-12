<template>
	<view class="all">
		<swiper class="scroll-view-height" :style="{height: screenHeight + 'px'}" @change="swipeIndex"
			:current="currentIndex" acceleration="true" skip-hidden-item-layout="true"
			disable-programmatic-animation="true">
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs">{{$t("本页面显示均为最近测量数据")}}</view>
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
									itemHeight="130px">
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
											<view v-show="delate_icon" class="ponsdtdss">
												<uni-icons type="minus-filled" size="25px" color="red"
													@click="delate_icon_cl(element.title,element)" />
											</view>
										</view>
									</template>
								</basic-drag>
							</view>
							<view v-show="button_show" class="btnshow">
								<view class="tuodongsd">{{$t('拖动可调整数据卡片位置')}}</view>
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
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs">{{$t('本页面显示均为最近测量数据')}}</view>
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
									itemHeight="130px">
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
											<view v-show="delate_icon2" class="ponsdtdss">
												<uni-icons type="minus-filled" size="25px" color="red"
													@click="delate_icon_cl_2(element.title,element)" />
											</view>
										</view>
									</template>
								</basic-drag>
							</view>
							<view v-show="button_show2" class="btnshow">
								<view class="tuodongsd">{{$t('拖动可调整数据卡片位置')}}</view>
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
				<view style="background: #3298F7;">
					<view class="title_zs" style="margin-top: 20px;">{{$t("本页面显示均为最近测量数据")}}</view>
					<view class="data_bg">
						<view class="icon_bg" @click="xueyaclick()">
							<image lazy-load src="../../../static/icons/3.png" class="img_style" mode="aspectFit" />
							<text class="icon_text_bg">{{$t('压力')}}</text>
						</view>
						<view class="yalistyd">
							<view class="yalistyd_1">{{yali}}</view>
							<view class="yalistyd_2">--</view>
							<view class="yalistyd_3">{{yali_time}}</view>
						</view>
					</view>
					<view class="data_bg_A_1">
						<view class="yali1">
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
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view style="background: #3298F7;">
					<view class="title_zs" style="margin-top: 20px;">{{$t("本页面显示均为最近测量数据")}}</view>
					<view class="data_bg">
						<view class="icon_bg" @click="xueyaclick()">
							<image lazy-load src="../../../static/icons/1.png" class="img_style" mode="aspectFit" />
							<text class="icon_text_bg">{{$t('步数')}}</text>
						</view>
						<view class="yalistyd">
							<view class="yalistyd_1">{{bushu}}</view>
							<view class="yalistyd_2">{{$t('计步')}}</view>
							<view class="yalistyd_3">{{bushu_time}}</view>
						</view>
					</view>
					<view class="data_bg_A">
						<view class="charts-box">
							<qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
						</view>
					</view>
				</view>
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
		<view class="showTotal" v-show="fillOut">
			<view class="over">
				<view class="show">
					<view style="margin-top: 220px;">
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
					<view style="display: flex;justify-content: center;margin-top: 60px;" @click="closess()">
						<uni-icons size="30" type="closeempty"></uni-icons>
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
		isInChinaByIP
	} from '../../api/isInChinaByIP.js'; //获取定位
	import permision from "@/js_sdk/wa-permission/permission.js"
	const systemInfo = uni.getSystemInfoSync(); //获取手机信息
	const windowHeight = systemInfo.windowHeight;
	export default {
		components: {
			BasicDrag,
			ytDateTimePicker
		},
		computed: {
			...mapState(['info', 'getpendinglenth', 'acktypes', 'xueyehuilian']),
		},
		data() {
			return {
				stepsData: {}, // 用于存储每天步数的对象
				timer: null, // 定时器变量
				timertwslist: null,
				screenHeight: windowHeight,
				tabs: [this.$t("心血管"), this.$t("体重"), this.$t("情绪"), this.$t("运动")],
				currentIndex: 0, // swiper索引
				msg: true,
				connectedDevices: {}, // 存储已连接设备的信息
				deviceList: [], // 存储搜索到的设备列表
				bluetoothManager: new BluetoothManager(),
				endtimesss: new Date().toISOString().slice(0, 10),
				list: [{
					bmi_show: false,
					image: "../../../static/icons/1.png",
					Step_number: "-",
					title: this.$t('步数'),
					type_LX: this.$t('计步'),
					Step_count: "-"
				}, {
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
					image: "../../../static/page_icon/9.png",
					Step_number: "-",
					title: this.$t("压力"),
					type_LX: "--",
					Step_count: "-/-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/9.png",
					Step_number: "-",
					title: this.$t("体温"),
					type_LX: "℃",
					Step_count: "-",
					checkbox: false,
				}],
				list2: [{
					image: "../../../static/icons/1.png",
					Step_number: "-",
					title: this.$t('步数'),
					type_LX: this.$t('计步'),
					Step_count: "-"
				}, {
					bmi_show: false,
					image: "../../../static/icons/2.png",
					Step_number: "-",
					title: this.$t('身高'),
					type_LX: "cm",
					Step_count: "-",
					checkbox: false,
				}, {
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
				bushu: '--/--',
				bushu_time: '--/--',
				chartData: {
					categories: ["0"],
					series: [{
						legendShape: "circle",
						name: this.$t("步数"),
						data: ["0"]
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
				devicdsdmac1: []
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

		onShow() {
			let that = this
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
				console.log(token)
				if (!token) {
					uni.redirectTo({
						url: "/pages/login/login_land"
					});
					return;
				}
				that.deviceList = []
				that.getUserInfo();
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
				this.manageHeartbeatInterval(() => this.onBluetoothDeviceFound(), 1000);
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
			//搜索已绑定的蓝牙设备mac
			async onBluetoothDeviceFound() {
				let uniqueArr = this.deviceList.filter((item, index) => this.deviceList.indexOf(item) === index);
				let uniqueArr1 = this.devicdsdmac.filter((item, index) => this.devicdsdmac.indexOf(item) === index);
				let uniqueArr2 = this.devicdsdmac1.filter((item, index) => this.devicdsdmac1.indexOf(item) === index);
				// this.connectMultipleDevices(uniqueArr)
				// console.log("uniqueArr1", uniqueArr1)
				// console.log("uniqueArr2", uniqueArr2)
				if (uniqueArr1) {
					this.connectMultipleDevices(uniqueArr1)
				}
				setTimeout(() => {
					if (uniqueArr2) {
						this.connectMultipleDevices(uniqueArr2)
					}
				}, 3000)
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
				const currentDate = bushu_time;
				const steps = bushu;
				this.stepsData[currentDate] = steps;
				const dates = Object.keys(this.stepsData);
				if (dates.length > 7) {
					const earliestDate = dates.sort()[0];
					delete this.stepsData[earliestDate];
				}
				try {
					uni.setStorageSync("weeklySteps", JSON.stringify(this.stepsData));
					const sortedDates = Object.keys(this.stepsData).sort();
					const categories = sortedDates;
					const seriesData = sortedDates.map(date => this.stepsData[date]);
					this.chartData = {
						categories: categories,
						series: [{
							name: this.$t("步数"),
							data: seriesData
						}]
					};
				} catch (e) {}
			},
			swtichSwiper(index) {
				this.currentIndex = index
			},
			swipeIndex(index) {
				this.currentIndex = index.detail.current;
				this.resetStates();
				this.getUserInfo();
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
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics1(deviceId, serviceId, deviceSn) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						console.log("getBLEDeviceCharacteristics1", res)
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
						console.log("getBLEDeviceCharacteristics3", res)
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
					console.log('1配对结果:', res);
				});
				let that = this
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
				}, 1000)
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
				uni.onBLECharacteristicValueChange(async (res) => {
					try {
						let hexData = this.ab2hex(res.value)
						let asciiString = this.hexToAscii(hexData)
						if (asciiString === "error") {
							uni.closeBLEConnection({
								deviceId: deviceId,
								success() {},
								fail() {}
							})
							this.disconnectAll(deviceId)
							this.deviceList = []
							this.getUserInfo()
							return
						} else if (hexData.length === 388 &&
							!hexData.startsWith("0e") &&
							!hexData.startsWith("e0") &&
							this.xueyehuilian &&
							this.xeuyejisn !== "0" &&
							this.xeuyejimac !== "0") {
							let parsedData = this.parseQueryString(asciiString);
							this.jakoblife_fat_scale(deviceId, parsedData, deviceSn)
							this.resetDataState();
							return
						}
					} catch (error) {
						this.resetDataState();
					}
				})
			},
			resetDataState() {
				this.dataBuffer = [];
				this.quotient = 0;
				this.quotient1 = 0;
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
					if (asciiString === "error") {
						uni.closeBLEConnection({
							deviceId: deviceId,
							success() {},
							fail() {}
						})
						this.disconnectAll(deviceId)
						this.deviceList = []
						this.getUserInfo()
					} else if (hexData.length === 388 &&
						!hexData.startsWith("0e") &&
						!hexData.startsWith("e0") &&
						that.xueyehuilian &&
						that.xeuyejisn !== "0" &&
						that.xeuyejimac !== "0") {
						let aaa = that.ab2str(res.value)
						let hexString = that.ab2hex(res.value)
						let asciiString = that.hexToAscii(hexString)
						let parsedData = that.parseQueryString(asciiString);
						that.jakoblife_fat_scale(that.xeuyejimac, parsedData, that.xeuyejisn)
						that.resetDataState()
					} else {
						const ProtocolIdentifier = dataList.slice(0, 2); // 协议标识位 1个字节
						const CMD = dataList.slice(8, 10); // 协议标识位 1个字节
						if (ProtocolIdentifier === "e0" && CMD === "00") {
							that.sendack(dataList, deviceId, serviceId, that.writeuuid)
							that.resetDataState()
						} else if (ProtocolIdentifier === "e0" && CMD === "04") {
							that.sendack(dataList, deviceId, serviceId, that.writeuuid)
							const stepheart = dataList.slice(0, 18);
							const stepbody = dataList.slice(18, dataList.length);
							const step = stepbody.slice(0, 8)
							const juli = stepbody.slice(8, 16)
							const kaluli = stepbody.slice(16, stepbody.length)
							const settept1 = parseInt(step, 16);
							uni.setStorageSync("settept1", settept1)
							that.jakoblife_fat_scale3(that.shoubiaomac, settept1, that.shoubiaosn, "步数");
						} else if (ProtocolIdentifier === "0e") {
							that.resetDataState()
						} else if (ProtocolIdentifier === "e0" && CMD === "11") {
							that.resetDataState()
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
							const hexData1 = Covmamlueand1.slice(Covmamlueand1.length - 16,
								Covmamlueand1.length);
							const {
								diastolic: heartRate
							} = that.parseHeartRateData(hexData1);
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
				} else if ((lowPressure >= 91 && lowPressure <= 100) || (highPressure >= 141 && highPressure <= 160)) {
					uni.showModal({
						title: this.$t("提示"),
						content: this.$t("显示结果弹窗"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {}
						}
					});
				} else if ((lowPressure >= 101 && lowPressure <= 110) || (highPressure >= 161 && highPressure <= 180)) {
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
				console.log(deviceId)
				console.log(deviceSn)
				let aaa = {
					lowPressure: parsedData.dia.trim(),
					highPressure: parsedData.sys.trim(),
					heartrate: parsedData.pul.trim(),
				}
				console.log(aaa)
				let timess = this.datatime(this.dundatetime())
				const data = {
					deviceSn: deviceSn,
					deviceTypeId: "1",
					mac: deviceId,
					slaveData: aaa,
					time: timess
				}
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(resaa => {
					console.log("血压计", resaa)
					if (resaa.code === 200) {
						this.setbanhua(1)
						this.get_device_info(deviceSn)
						this.queryDevices()
						this.list_recipe()
						this.lowPressure = aaa.lowPressure;
						this.highPressure = aaa.highPressure;
						this.pulse = aaa.heartrate;
						this.bgaaa(aaa.lowPressure, aaa.highPressure)
						setTimeout(() => {
							this.StorageInfo(aaa)
						}, 1000)
						this.$nextTick(() => {
							this.lowPressure = aaa.lowPressure;
							this.highPressure = aaa.highPressure;
							this.pulse = aaa.heartrate;
						})
					}
				})
			},
			// 上报体脂秤数据
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
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					if (res.code === 500) {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
						return
					}
					if (parsedData.weightUnit === 0) {
						uni.setStorageSync("newweight", "KG")
					} else {
						uni.setStorageSync("newweight", "lb")
					}
					this.setbanhua(1)
					this.get_device_info(deviceSn)
					this.get_device_data(deviceSn)
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
						this.get_device_info(deviceSn)
						setTimeout(() => {
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
				this.$post(this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					console.log("上报数据手表", res)
					if (res.code === 500) {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
						return
					} else {
						this.setbanhua(1)
						this.bgaaa(aaa.lowPressure, aaa.highPressure)
						this.get_device_info(deviceSn)
						setTimeout(() => {
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
					this.get_device_info(deviceSn)
					setTimeout(() => {
						this.getStorageInfooy(aaa)
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
								that.checkAndNotify("shuzhangyaId1", "shuzhangyaId2", aaa.lowPressure, "舒张压",
									notify);
							}
							if (res.keys.includes("shousuoyaId1") || res.keys.includes("shousuoyaId2")) {
								that.checkAndNotify("shousuoyaId1", "shousuoyaId2", aaa.highPressure, "收缩压",
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
						if (this.currentIndex === 1) {
							this.chuhsikg = uni.getStorageSync("danwei2") === 1 ?
								"lb" : "kg";
							this.newweightKG = uni.getStorageSync("newweight") !==
								"" ? uni.getStorageSync("newweight") : 'KG';
							this.Initial_weight = UserInfo.data.weight;
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
				let that = this
				// 获取当前时间字符串
				let currentTime = new Date().toISOString().slice(0, 19); // 获取当前日期和时间到秒
				// 检查that.birthday1111是否等于"今天"
				let dateTime = that.birthday1111 === that.$t('今天') ? currentTime : that
					.birthday1111 + " " + currentTime
					.split('T')[1];
				// 计算时间戳
				let timestamp = Math.floor(new Date(dateTime).getTime() / 1000);
				uni.request({
					url: that.$url_pressure_data,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
						slaveSn: "0",
						slaveData: {
							lowPressure: that.shuzhangya,
							highPressure: that.shousuoya,
							heartrate: that.maibo
						},
						time: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},

					success(res) {
						if (res.data.code == 200) {
							that.$refs.qs_popup.close()
							that.birthday = that.$t('今天')
							that.shousuoya = ''
							that.shuzhangya = ''
							that.maibo = ''
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							})
							that.list_recipe()
						} else if (res.data.code == 500) {
							return
						} else {
							uni.showToast({
								title: that.$t("失败"),
								icon: 'none'
							})
						}
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
						switch (this.currentIndex) {
							case 0:
								this.handleStorage(this, 'kapianlist', 'list');
								break;
							case 1:
								this.handleStorage(this, 'kapianlist2', 'list2');
								break;
						}
						this.list_recipe();
						if (res.rows !== "") {
							let deviceslist1 = res.rows.filter(item => item.mac !== null && item.deviceTypeId !==
								"11").map(item => item.mac);
							this.deviceList = deviceslist1;
						}
						this.aaaa(res.rows);
					} else {
						return
					}
				})
			},
			aaaa(rows) {
				rows.forEach((row) => {
					if (row.deviceTypeId === "10") {
						if (this.xueyjitypesd === true) {
							this.handleDeviceType10And13(row);
						}
						this.devicdsdmac.push(row.mac)
					} else if (row.deviceTypeId === "13") {
						this.handleDeviceType10And13(row);
						this.devicdsdmac1.push(row.mac)
					} else if (row.deviceTypeId === "11") {
						this.handleDeviceType11(row);
					}
				});
				if (this.currentIndex === 3) {
					this.list_recipe();
				}
			},
			// 定义一个通用函数
			handleDeviceType10And13(row) {
				if (this.deviceList.length !== 0) {
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
						if (systemInfo.platform === "android" && data.weightStatus === 1 &&
							data.weight !==
							"0.00") {
							that.jakoblife_fat_scale1(row.deviceSn, row.mac, data, "");
						} else if (systemInfo.platform === "ios" && data.testStatus ===
							255) {
							that.arrrylist.push(data);
							if (data.weight !== "0.00") {
								that.jakoblife_fat_scale1(row.deviceSn, row.mac, data, that
									.arrrylist.length);
							}
						}
						return
					}
				});
				if (that.currentIndex === 1) {
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
							case 1:
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
							case 1:
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
				const stepKey = 'settept';
				const stepCacheKey = 'settept1';
				const now = new Date().getTime();
				that.getStorageInfo([stepKey, stepCacheKey], (hasAllKeys, res) => {
					const currentStep = uni.getStorageSync(stepKey);
					const cachedStep = uni.getStorageSync(stepCacheKey);
					const stepItem = that.findValue(that.list, 'title', name);
					if (hasAllKeys) {
						const stepDiff = currentStep - cachedStep;
						if (stepDiff > 0) {
							uni.setStorageSync(stepCacheKey, cachedStep + stepDiff);
						}
					} else {
						uni.setStorageSync(stepCacheKey, currentStep);
					}
					stepItem.Step_number = uni.getStorageSync(stepCacheKey);
					stepItem.Step_count = that.formatDate(now);
					stepItem.title = that.$t("步数");
					stepItem.type_LX = that.$t("计步");
					that.bushu = stepItem.Step_number;
					that.bushu_time = stepItem.Step_count;
					that.saveDailySteps(that.bushu, that.bushu_time);
				});
			},
			// 封装处理步数的逻辑
			processSteps2(item, name) {
				let that = this
				const stepKey = 'settept';
				const stepCacheKey = 'settept1';
				const now = new Date().getTime();
				this.getStorageInfo([stepKey, stepCacheKey], (hasAllKeys, res) => {
					const currentStep = uni.getStorageSync(stepKey);
					const cachedStep = uni.getStorageSync(stepCacheKey);
					const stepItem = that.findValue(that.list2, 'title', name);
					if (hasAllKeys) {
						const stepDiff = currentStep - cachedStep;
						if (stepDiff > 0) {
							uni.setStorageSync(stepCacheKey, cachedStep + stepDiff);
						}
					} else {
						uni.setStorageSync(stepCacheKey, currentStep);
					}
					stepItem.Step_number = uni.getStorageSync(stepCacheKey);
					stepItem.Step_count = that.formatDate(now);
					stepItem.title = that.$t("步数");
					stepItem.type_LX = that.$t("计步");
					that.bushu = stepItem.Step_number;
					that.bushu_time = stepItem.Step_count;
					that.saveDailySteps(that.bushu, that.bushu_time);
				});
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
				const item = that.findValue(that.list2, 'title', that.$t(titleKey));
				const data = that.findValue(itemdata, 'register', dataKey);
				item.Step_count = that.formatDate(data?.updateTime);
			},

			// 处理身高卡片
			processHeight(item, name) {
				let that = this
				const heightItem = that.findValue(that.list, 'title', name);
				const height = that.findValue(item, 'register', 'height')?.registerVal;
				const unit = uni.getStorageSync("danwei1") === 0 ? "inch" : "cm";
				heightItem.type_LX = unit;
				heightItem.title = that.$t("身高")
				heightItem.Step_number = height !== null ? height : '-/-';
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
						if (this.currentIndex === 0) {
							const slaveSn2Data = res.data.filter(item => item.slaveSn === "2");
							const slaveSn3Data = res.data.filter(item => item.slaveSn === "3");
							let lowPressuretime1 = this.findValue(slaveSn2Data, "register", "lowPressure")
								.updateTime
							let highPressureyime1 = this.findValue(slaveSn2Data, "register",
									"highPressure")
								.updateTime;
							let heartratetime1 = this.findValue(slaveSn2Data, "register", "heartrate")
								.updateTime;
							let lowPressure1 = this.getRegisterVal(slaveSn2Data, 'register', 'lowPressure')
							let highPressure1 = this.getRegisterVal(slaveSn2Data, 'register',
								'highPressure')
							let pulse1 = this.getRegisterVal(slaveSn2Data, 'register', 'heartrate');
							let lowPressuretime2 = this.findValue(slaveSn3Data, "register", "lowPressure")
								.updateTime
							let highPressureyime2 = this.findValue(slaveSn3Data, "register",
									"highPressure")
								.updateTime;
							let heartratetime2 = this.findValue(slaveSn3Data, "register", "heartrate")
								.updateTime;
							let lowPressure2 = this.getRegisterVal(slaveSn3Data, 'register', 'lowPressure')
							let highPressure2 = this.getRegisterVal(slaveSn3Data, 'register',
								'highPressure')
							let pulse2 = this.getRegisterVal(slaveSn3Data, 'register', 'heartrate');
							this.$nextTick(() => {
								if (lowPressuretime1 < lowPressuretime2) {
									this.lowPressure = lowPressure2;
									this.highPressure = highPressure2;
								} else if (lowPressuretime1 > lowPressuretime2) {
									this.lowPressure = lowPressure1;
									this.highPressure = highPressure1;
								}
								if (heartratetime1 < heartratetime2) {
									this.pulse = pulse2;
								} else if (heartratetime1 > heartratetime2) {
									this.pulse = pulse1;
								}
								// 判断血压等级, 在需要更新血压状态的地方调用此函数
								this.updateBloodPressureStatus(this.lowPressure, this.highPressure);
							})
							const kapianlist = uni.getStorageSync("kapianlist") || [];
							let itelistasd = []
							for (let i = 0; i < kapianlist.length; i++) {
								const item = kapianlist[i];
								if (item.title === "步数" || item.title === "Steps") {
									this.processSteps(res.data, item.title);
								} else if (item.title === "身高" || item.title === "Height") {
									this.processHeight(res.data, item.title);
								} else if (item.title === "体温" || item.title === "Body Temperature") {
									this.processTemperature(res.data, item.title);
								} else if (item.title === "血氧" || item.title === "SpO₂") {
									this.processBloodOxygen(res.data, item.title);
								} else if (item.title === "压力" || item.title === "Stress") {
									this.processyali(res.data, item.title);
								}
								itelistasd.push(item)
							}
							uni.setStorageSync("kapianlist", itelistasd)
						} else if (this.currentIndex === 1) {
							this.Latest_weight = this.getRegisterVal(res.data, 'register', 'weight');
							this.Latest_date = this.getUpdateTime(res.data, 'register', 'weight')
							this.Target_weight = this.getRegisterVal(res.data, 'register', 'goal_weight');
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
									this.processSteps2(res.data, item.title);
								} else if (item.title === "身高" || item.title === "Height") {
									this.processCommonData(res.data, item.title, 'height', 'danwei1',
										"cm");
								} else if (item.title === "BMI") {
									this.processGenericData(res.data, "BMI", "weight");
								} else if (item.title === this.$t("骨含量")) {
									this.processGenericData(res.data, "骨含量", "weight");
								} else if (item.title === this.$t("肌肉量")) {
									this.processGenericData(res.data, "肌肉量", "weight");
								} else if (item.title === this.$t("蛋白率")) {
									this.processGenericData(res.data, "蛋白率", "weight");
								} else if (item.title === this.$t("水分")) {
									this.processGenericData(res.data, "水分", "weight");
								} else if (item.title === this.$t("内脏脂肪指数")) {
									this.processGenericData(res.data, "内脏脂肪指数", "weight");
								} else if (item.title === this.$t("脂肪率")) {
									this.processGenericData(res.data, "脂肪率", "weight");
								} else if (item.title === this.$t("基础代谢率")) {
									this.processGenericData(res.data, "基础代谢率", "weight");
								} else if (item.title === this.$t("皮下脂肪率")) {
									this.processGenericData(res.data, "皮下脂肪率", "weight");
								} else if (item.title === this.$t("身体年龄")) {
									this.processGenericData(res.data, "身体年龄", "weight");
								}
							}
						} else if (this.currentIndex === 3) {
							uni.getStorageInfo({
								success: (ress) => {
									const currentStep = uni.getStorageSync("settept");
									const cachedStep = ress.keys.includes('settept1') ? uni
										.getStorageSync("settept1") : 0;
									if (cachedStep < currentStep) {
										const stepDiff = currentStep - cachedStep;
										uni.setStorageSync("settept1", cachedStep + stepDiff);
									}
									this.bushu = uni.getStorageSync("settept1");
									this.bushu_time = this.formatDate(new Date().getTime());
									this.saveDailySteps(this.bushu, this.bushu_time);
								},
							});
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
				this.disabledsaaa = false
			},
			tiaozhen2() {
				this.binaji2 = false
				this.animation2 = 'shake';
				this.button_show2 = true
				this.delate_icon2 = true
				this.disabledsaaa2 = false
			},
			add_bt_xy() {
				uni.navigateTo({
					url: "../main/card1"
				})
			},
			add_bt2() {
				uni.navigateTo({
					url: '../main/card'
				})
			},
			ture_bt() {
				this.binaji = true
				this.animation = '';
				this.button_show = false
				this.delate_icon = false
				this.disabledsaaa = true
				uni.setStorageSync("kapianlist", this.list)
			},
			ture_bt2() {
				this.binaji2 = true
				this.animation2 = '';
				this.button_show2 = false
				this.delate_icon2 = false
				this.disabledsaaa2 = true
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
						new Date()
						.getHours() + ":" + new Date().getMinutes() : this.birthday2).getTime() /
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
		padding: 40px;
		font-size: 16px;
		font-weight: 400;
		color: black;
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
</style>