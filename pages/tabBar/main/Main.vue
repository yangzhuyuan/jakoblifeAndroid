<template>
	<view>
		<view style="background: #3298F7;height: 300px;">
			<view v-if="type" style="padding-top: 100px;">
				<view class="title_zs">{{$t('shouye_item.title_0')}}</view>
				<view class="data_bg">
					<view style="display: flex; flex-direction: row;">
						<view class="icon_bg">
							<image src="../../../static/icons/3.png" class="img_style"></image>
							<text class="icon_text_bg">{{$t('shouye_item.title_1')}}</text>
						</view>
						<view style="display: flex;flex-direction: column; margin-left: 10px;margin-top: 10px;">
							<view v-if="xueya == 0" style="display: flex;flex-direction: row; align-items: center;">
								<view class="xueya_bg"></view>
								<view style="margin-left: 6px;">{{title_name}}</view>
								<uni-icons type="help" size="15" style="margin-left: 5px;" @tap="xueya_tap"></uni-icons>
							</view>
							<view v-else-if="xueya == 1" style="display: flex;flex-direction: row;">
								<view style="width: 20px; height:20px;background: #E7D430;border-radius: 50px;"></view>
								<view style="margin-left: 10px;">{{title_name}}</view>
								<uni-icons type="help" size="15" style="margin-left: 5px;" @tap="xueya_tap"></uni-icons>
							</view>
							<view v-else style="display: flex;flex-direction: row;">
								<view style="width: 20px; height:20px;background: #C91A1D;border-radius: 50px;"></view>
								<view style="margin-left: 10px;">{{title_name}}</view>
								<uni-icons type="help" size="15" style="margin-left: 5px;" @tap="xueya_tap"></uni-icons>
							</view>
							<view style="border-top: 1px solid gainsboro;width: 65vw;margin-top: 5px;"></view>
							<view style="display: flex;flex-direction: row;margin-top: 5px;">
								<view>
									<view style="color: gray;font-size: 12px;">{{$t('gongxiangitem.title_23')}}mmHg
									</view>
									<view style="font-weight: bold;">{{Diastolic_blood_pressure}}</view>
								</view>
								<view style="margin-left: 20px;">
									<view style="color: gray;font-size: 12px;">{{$t('gongxiangitem.title_24')}}mmHg
									</view>
									<view style="font-weight: bold;">{{Systolic_blood_pressure}}</view>
								</view>
								<view style="margin-left: 20px;">
									<view style="color: gray;font-size: 12px;">{{$t('gongxiangitem.title_25')}}BMP
									</view>
									<view style="font-weight: bold;">{{pulse}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="data_bg_A">
					<view class="tzkpsx" @click="tiaozhen()">{{$t('shouye_item.title_2')}}</view>
					<view class="drag-containersss">
						<basic-drag v-model="list" :disableds="aaa" itemKey="title" :column="2" itemHeight="120px">
							<template #item="{element}">
								<view class="data_item_bgsss">
									<view class="icon_bgsss">
										<image :src="element.image" class="img_stylesss" />
										<text class="icon_text_bgsss">{{element.title}}</text>
									</view>
									<view
										style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
										<view v-if="element.bmi_show">
											<view v-if="element.BMI_TF == 0"
												style="display: flex; flex-direction: row;align-items: center;">
												<view
													style="width: 10px; height:10px;background: #258C41;border-radius: 50px;">
												</view>
												<text
													style="margin-left: 5px; color: black;font-size: 12px;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
											</view>
											<view v-else-if="element.BMI_TF ==1"
												style="display: flex; flex-direction: row;align-items: center;">
												<view
													style="width: 10px; height:10px;background: #E7D430;border-radius: 50px;">
												</view>
												<text
													style="margin-left: 5px; color: black;font-size: 12px;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
											</view>
											<view v-else
												style="display: flex; flex-direction: row;align-items: center;">
												<view
													style="width: 10px; height:10px;background: #C91A1D;border-radius: 50px;">
												</view>
												<text
													style="margin-left: 5px; color: black;font-size: 12px;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
											</view>
										</view>
										<text style="text-align: right;font-size: 16px;">{{element.Step_number}}</text>
										<text
											style="text-align: right;color: gray;font-size: 12px;">{{element.type_LX}}</text>
										<text style="text-align: right;font-size: 14px;">{{element.Step_count}}</text>
									</view>
								</view>
							</template>
						</basic-drag>
					</view>

					<view style="background: #F7F7F7;">
						<image src="../../../static/image-active.png"
							style="width: 90vw;height: 200px; margin: 20px 10px 120px 12px;border-radius: 20px;">
						</image>
					</view>
				</view>
			</view>

			<view v-else style="margin-top: 95px;">
				<view class="title_zs">{{$t('shouye_item.title_0')}}</view>
				<view style="display: flex;flex-direction: row;margin-top: 10px;">
					<view style="background: white; border-radius: 20px;padding: 10px; width: 50vw;margin-left: 10px;">
						<view style="display: flex;align-items: center;">
							<image src="../../../static/icons/6.png" style="width: 25px; height: 25px;"></image>
							<text style="font-size: 18px;margin-left: 5px;">{{$t('shouye_item.title_5')}}</text>
						</view>
						<view
							style="margin-top: 30px; display: flex;flex-direction: row;justify-content: center; align-items: center;">
							<text style="font-size: 44px;font-weight: bold;">{{Latest_weight}}</text>
							<text style="margin-top: 15px; margin-left: 10px;">KG</text>
						</view>
						<view style="text-align: right;margin-top: 20px; font-size: 18px;">{{Latest_date}}</view>
					</view>
					<view
						style=" margin-left: 10px; margin-right: 10px; width: 40vw;background: white; border-radius: 20px;">
						<view>
							<view style="display: flex;align-items: center;padding: 10px;">
								<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;"></image>
								<text style="margin-left: 5px;">{{$t('shouye_item.title_6')}}</text>
							</view>
							<view class="tizhong_item_2">
								<text style="font-size: 18px;font-weight: bold;">{{Initial_weight}}</text>
								<text style="margin-left: 5px; color: gray;">kg</text>
							</view>
						</view>
						<view style="margin:5px 0 5px 8px; background: gainsboro; width: 33vw; height: 1px;"></view>
						<view>
							<view style="display: flex;align-items: center;padding: 10px;">
								<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;"></image>
								<text style="margin-left: 5px;">{{$t('shouye_item.title_7')}}</text>
							</view>
							<view class="tizhong_item_2">
								<text style="font-size: 18px;font-weight: bold;">{{Target_weight}}</text>
								<text style="margin-left: 5px;color: gray;">kg</text>
							</view>

						</view>
					</view>
				</view>


				<view class="data_bg_A">
					<view class="tzkpsx" @click="tiaozhen2()">{{$t('shouye_item.title_2')}}</view>

					<view class="drag-containersss">
						<basic-drag v-model="list2" :disableds="aaa2" itemKey="title" :column="2" itemHeight="120px">
							<template #item="{element}">
								<view class="data_item_bgsss">
									<view class="icon_bgsss">
										<image :src="element.image" class="img_stylesss" />
										<text class="icon_text_bgsss">{{element.title}}</text>
									</view>
									<view
										style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">

										<view v-if="element.bmi_show">
											<view v-if="element.BMI_TF == 0"
												style="display: flex; flex-direction: row;align-items: center;">
												<view
													style="width: 10px; height:10px;background: #258C41;border-radius: 50px;">
												</view>
												<text
													style="margin-left: 5px; color: black;font-size: 12px;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
											</view>
											<view v-else-if="element.BMI_TF ==1"
												style="display: flex; flex-direction: row;align-items: center;">
												<view
													style="width: 10px; height:10px;background: #E7D430;border-radius: 50px;">
												</view>
												<text
													style="margin-left: 5px; color: black;font-size: 12px;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
											</view>
											<view v-else
												style="display: flex; flex-direction: row;align-items: center;">
												<view
													style="width: 10px; height:10px;background: #C91A1D;border-radius: 50px;">
												</view>
												<text
													style="margin-left: 5px; color: black;font-size: 12px;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15" style="" @tap="BMI_tap"></uni-icons>
											</view>
										</view>
										<text style="text-align: right;font-size: 16px;">{{element.Step_number}}</text>
										<text
											style="text-align: right;color: gray;font-size: 12px;">{{element.type_LX}}</text>
										<text style="text-align: right;font-size: 14px;">{{element.Step_count}}</text>
									</view>
								</view>
							</template>
						</basic-drag>
					</view>

					<view style="background: #F7F7F7; padding: 15px 10px 220px 10px;">
						<view style="background: white; border-radius: 20px;padding: 10px;">
							<view class="tiwei_bg">
								<view style="font-weight: bold;">{{$t('shouye_item.title_10')}}</view>
								<view style="color: gray;">{{$t('shouye_item.title_11')}}</view>
							</view>
							<view class="tiwei_bg">
								<view class="tiwei_item_bg">
									<text class="text_title_bg">{{$t('shouye_item.title_12')}}</text>
									<text class="tiwei_item_item_bg">{{Chest_circumference}}</text>
								</view>
								<view class="tiwei_item_bg">
									<text class="text_title_bg">{{$t('shouye_item.title_13')}}</text>
									<text class="tiwei_item_item_bg">{{waistline}}</text>
								</view>
								<view class="tiwei_item_bg">
									<text class="text_title_bg">{{$t('shouye_item.title_14')}}</text>
									<text class="tiwei_item_item_bg">{{Hip_circumference}}</text>
								</view>
								<view class="tiwei_item_bg">
									<text class="text_title_bg">{{$t('shouye_item.title_15')}}</text>
									<text class="tiwei_item_item_bg">{{Upper_Chest_circumference}}</text>
								</view>
								<view class="tiwei_item_bg">
									<text class="text_title_bg">{{$t('shouye_item.title_16')}}</text>
									<text class="tiwei_item_item_bg">{{Thigh_circumference}}</text>
								</view>
								<view class="tiwei_item_bg">
									<text class="text_title_bg">{{$t('shouye_item.title_17')}}</text>
									<text class="tiwei_item_item_bg">{{Calf_circumference}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="bottom"
				:direction="direction" @trigger="trigger" @fabClick="fabClick" />

			<view class="title_all">
				<image @click="qiehuan()" src="../../../static/qiehuan.png" style="width: 25px; height: 25px;"></image>
				<view class="title">{{$t('shouye')}}</view>
			</view>
		</view>


		<!-- 悬浮弹窗 -->
		<view class="showTotal" v-show="fillOut">
			<view class="over">
				<view class="show">
					<view style="margin-top: 220px;">
						<view style="color: black;font-size: 38px; font-weight: bold;">{{showTotal_date}}</view>
						<view style="background: black; width: 50%; height: 1px;margin-top: 20px;"></view>
						<view style="color: #2595D3;margin-top: 5px;">{{$t('shouye_item.title_18')}}</view>
					</view>
					<view style="display: flex; flex-direction: row;  margin-top: 180px;margin-left: 10px;">
						<view style="display: flex;flex-direction: column; align-items: center;" @click="Keep()">
							<image src="../../../static/icons/6.png"
								style="width: 50px; height: 50px;border-radius: 40px;"></image>
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
					<view style="display: flex;justify-content: center;margin-top: 60px;" @click="closess()">
						<uni-icons size="30" type="closeempty"></uni-icons>
					</view>
				</view>
			</view>
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
						<image style="width: 200px; height: 260px;" src="../../../static/image/4.png"></image>
					</view>
					<button @tap="knowe1()"
						style="margin: 10px 50px 20px 50px;border-radius: 20px;background: #3298F7;color: white;">{{$t('BDSBitem.title_8')}}</button>
				</view>
			</uni-popup>
		</view>
		<!--体脂秤首页滑动-->
		<view>
			<uni-popup ref="tihzi_popup_hd" :mask-click="false">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view
						style="border-radius: 20px;background:#fff;margin-top: 20px; padding-bottom: 10px;align-items: center;">
						<view style="display: flex;justify-content: space-between; padding: 10px;">
							<text @click="closess()">✖</text>
							<view style="margin-left: 50px;">
								<text @click="dataclick1()">{{birthday1}}</text>
								<uni-icons type="bottom" size="16"></uni-icons>
							</view>
							<view style="color: #3298F7;" @click="sdsr()">{{$t('shouye_item.title_22')}}</view>
						</view>
						<view>
							<view style="display: flex;justify-content: space-between;margin-top: 10px;">
								<view class="title_select_ruler">{{$t('shouye_item.title_12')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{xw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
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
					</view>
				</scroll-view>
			</uni-popup>
		</view>
		<!-- 体脂秤首页手动 -->
		<view>
			<uni-popup ref="tihzi_popup_sd" :mask-click="false">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view
						style="border-radius: 20px;background:#fff; margin-top: 60px; padding-bottom: 10px;align-items: center;">
						<view style="display: flex;justify-content: space-between; padding: 10px;">
							<text @click="closess()">✖</text>
							<view style="display: flex; flex-direction: row; margin-left: 50px;">

								<text @click="dataclick()">{{birthday}}</text>

								<uni-icons type="bottom" size="16"></uni-icons>

							</view>
							<view style="color: #3298F7;" @click="hdsr()">{{$t('shouye_item.title_23')}}</view>
						</view>
						<view style="padding: 10px;width: 90vw;">
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
			</uni-popup>
		</view>

		<!-- 记体重popup -->
		<view>
			<uni-popup ref="tizhong_popup" @change="TIZHONG()" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff; margin-top: 60px; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: space-between; padding: 10px;">
						<text @click="closess()">✖</text>
						<view style="display: flex; flex-direction: row;">

							<text @click="dataclick2()">{{birthday2}}</text>

							<uni-icons type="bottom" size="16"></uni-icons>

						</view>
						<view style="color: #3298F7;"></view>
					</view>
					<view style="padding: 10px;width: 90vw;">
						<view
							style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="tizhong" :placeholder="$t('zhuceitem.toast_9')"
								style="text-align: center;width: 80vw;" />
							<text>kg</text>
						</view>

					</view>
					<button @tap="jitizhong_tc()"
						style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('gongxiangitem.title_29')}}</button>
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
		<view>
			<yt-dateTimePicker ref="myPicker2" @submit="handleSubmit2" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('shouye_item.title_30'), $t('shouye_item.title_31'), $t('shouye_item.title_32'), $t('shouye_item.title_33'), $t('shouye_item.title_34'), $t('shouye_item.title_35')]" />
		</view>

	</view>
</template>
<script>
	import BasicDrag from '@/components/basic-drag/index.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			BasicDrag
		},

		computed: {
			...mapState(['info']),
		},

		data() {
			return {
				list: [{
					image: "../../../static/icons/1.png",
					Step_number: "-",
					title: this.$t('shouye_item.title_3'),
					type_LX: this.$t('shouye_item.title_4'),
					Step_count: "-"
				}, {
					image: "../../../static/icons/2.png",
					Step_number: "-",
					title: this.$t('zhuceitem.title_5'),
					type_LX: "cm",
					Step_count: "-"
				}, {

					image: "../../../static/icons/6.png",
					Step_number: "-",
					title: this.$t('zhuceitem.title_6'),
					type_LX: "kg",
					Step_count: "-"
				}, {
					BMI_TF: 0,
					BMI_ys: "-",
					bmi_show: true,
					image: "../../../static/icons/4.png",
					Step_number: "-",
					title: 'BMI',
					type_LX: "kg/m²",
					Step_count: "-"
				}],

				list2: [{
					image: "../../../static/icons/1.png",
					Step_number: "-",
					title: this.$t('shouye_item.title_3'),
					type_LX: this.$t('shouye_item.title_4'),
					Step_count: "-"
				}, {
					image: "../../../static/icons/2.png",
					Step_number: "-",
					title: this.$t('shouye_item.title_8'),
					type_LX: this.$t('shouye_item.title_9'),
					Step_count: "-"
				}, {
					BMI_TF: 0,
					BMI_ys: "-",
					bmi_show: true,
					image: "../../../static/icons/4.png",
					Step_number: "-",
					title: 'BMI',
					type_LX: "kg/m²",
					Step_count: "-"
				}, {
					image: "../../../static/icons/6.png",
					Step_number: "-",
					title: this.$t('zhuceitem.title_5'),
					type_LX: "cm",
					Step_count: "-"
				}],

				show: true,
				type: false,
				fillOut: false,
				Latest_weight: "-",
				Latest_date: "-",
				Initial_weight: "-",
				Target_weight: "-",
				Step_number_1: "-",
				Step_count_1: "-",
				heat: "-",
				heat_date: "-",
				Height_1: '-',
				Step_Height_1: "-",
				BMI_ys_1: "正常",
				BMI_1: "-",
				Step_bmi_1: "-",
				BMI_TF_1: 0,
				Chest_circumference: "-",
				waistline: "-",
				Hip_circumference: "-",
				Upper_Chest_circumference: "-",
				Thigh_circumference: "-",
				Calf_circumference: "-",
				xueya: 0,
				title_name: "-",
				Diastolic_blood_pressure: "-",
				Systolic_blood_pressure: "-",
				pulse: "-",
				Step_number: "20000",
				Step_count: "06/23",
				Height: '173',
				Step_height: "05/24",
				Width: "73",
				Step_width: "05/24",
				bmi_show: true,
				BMI_ys: "-",
				BMI: "19.6",
				Step_bmi: "05/24",
				BMI_TF: 0,
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					// color: '#7A7E83',
					color: "#000",
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff',
				},
				is_color_type: false,
				content: [
					// {
					// iconPath: '/static/image.png',
					// selectedIconPath: '/static/image-active.png',
					// text: '相册',
					// active: false
					// },
					// {
					// 	iconPath: '/static/home.png',
					// 	selectedIconPath: '/static/home-active.png',
					// 	text: '首页',
					// 	active: false
					// },
					// {
					// 	iconPath: '/static/star.png',
					// 	selectedIconPath: '/static/star-active.png',
					// 	text: '收藏',
					// 	active: false
					// }
				],

				showTotal_date: '08/31',
				birthday: this.$t('shouye_item.title_21'),
				birthday1: this.$t('shouye_item.title_21'),
				birthday2: this.$t('shouye_item.title_21'),
				datass: new Date().toISOString(),


				xw_value: "",
				yw_value: "",
				tw_value: "",
				stw_value: "",
				dtw_value: "",
				xtw_value: "",
				tizhong: "",
				xiongwei: "",
				yaowei: "",
				tunwei: "",
				shangtunwei: "",
				datuiwei: "",
				xiaotuiwei: "",
				aaa: true,
				aaa2: true


			}
		},

		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},


		onLaunch() {

		},

		onReady() {

		},


		onShow() {
			let that = this
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
								console.log(res.data.data.phonenumber)
								if (res.data.data.phonenumber === null || res.data.data.phonenumber === "") {
									uni.reLaunch({
										url: '../../login/Force_binding_phone'
									})
								} else {
									that.getInfo(res.data.data)
								}
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'error'
								})
							}
						} else {
							console.log("获取数据错误")
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		},


		onLoad() {

		},




		methods: {
			...mapMutations(['getInfo']),

			tiaozhen() {
				this.aaa = false
			},
			tiaozhen2() {
				this.aaa2 = false
			},

			qiehuan() {
				if (this.type == true) {
					this.type = false
				} else {
					this.type = true
				}
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
			BMI_tap() {
				this.$refs.popup1.open("center")
			},
			knowe() {
				this.$refs.popup.close()
			},
			knowe1() {
				this.$refs.popup1.close()
			},
			jitizhong_tc() {
				if (this.tizhong === "" || this.tizhong === undefined) {
					uni.showToast({
						title: this.$t('zhuceitem.toast_9'),
						icon: 'none'
					})
					return
				} else {
					this.$refs.tizhong_popup.close()
				}
			},
			select_ruler() {
				this.$refs.tihzi_popup_hd.close()
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
					this.$refs.tihzi_popup_sd.close()
				}
			},


			knowe3() {
				this.$refs.popup3.close()
			},

			trigger(e) {
				this.content[e.index].active = !e.item.active
				uni.showModal({
					title: '提示',
					content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			fabClick(e) {
				if (this.type == true) {

				} else {
					this.fillOut = true
				}
			},



			closess() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.close()
				this.$refs.tihzi_popup_sd.close()
				this.$refs.tizhong_popup.close()
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
			dataclick1() {
				this.$refs.myPicker1.show();
			},
			handleSubmit1(e) {
				this.birthday1 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			dataclick2() {
				this.$refs.myPicker2.show();
			},
			handleSubmit2(e) {
				this.birthday2 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
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

			/**
			 * 滑动时触发
			 */
			scroll(val) {
				this.scrollLeftNow = val;
			},

		}
	}
</script>

<style lang="scss" scoped>
	.title_zs {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		text-align: right;
		color: white;
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
		width: 100vw;
		height: 55px;
		padding: 30px 10px 10px 15px;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: fixed;
		top: 0;
	}

	.title {
		color: white;
		text-align: center;
		width: 80%;
		font-weight: bold;
		font-size: 16px;
	}


	.xueya_bg {
		width: 12px;
		height: 12px;
		background: #258C41;
		border-radius: 15px;
	}

	.data_bg {
		display: flex;
		justify-content: center;
		margin: 5px 10px 0 10px;
		padding: 10px;
		background: white;
		border-radius: 10px;
	}

	.data_bg_2 {
		display: flex;
		flex-direction: row;
	}

	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #F7F7F7;
		margin-top: 15px;
		padding: 15px 5px 0 6px;
	}

	.tzkpsx {
		display: flex;
		justify-content: center;
		background: white;
		margin: 15px;
		padding: 10px;
		border-radius: 10px;
		color: #3298F7;
	}

	.data_bg_3 {
		background: #F7F7F7;
		display: flex;
		margin-top: 15px;
		flex-direction: row;
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

	.data_item_bg1 {
		display: flex;
		flex-direction: row;
		background: white;
		width: 45vw;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		padding: 5px;
		margin-left: 10px;
		margin-right: 10px;
	}

	.icon_bg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bg {
		margin-top: 1px;
		width: 60px;
		text-align: center;
		margin-left: 5px;
		font-weight: bold;
	}

	.scroll-Y {
		height: 100vh;
	}

	.item_box_bg {
		display: flex;
		flex-direction: column;
		margin-left: 20px;
		padding-right: 10px;
		font-weight: bold;
	}

	.title_select_ruler {
		padding-left: 10px;
		font-weight: bold;
		width: 50px;
		white-space: nowrap;
		// text-overflow: ellipsis;
		overflow: auto;
	}

	.img_style {
		width: 50px;
		height: 50px;
	}

	.tiwei_item_bg {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tiwei_item_item_bg {
		font-size: 16px;
		font-weight: bold;
		margin-top: 5px;
	}

	.text_title_bg {
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



	.data_item_bgsss {
		height: 90px;
		line-height: 20px;
		width: 40vw;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		padding: 10px;
	}

	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		text-align: center;
		margin-left: 5px;
		font-weight: bold;
	}

	.icon_bgsss {

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.img_stylesss {
		width: 50px;
		height: 50px;
	}

	.drag-containersss {

		display: flex;
		justify-content: center;
		padding-left: 5px;
	}
</style>