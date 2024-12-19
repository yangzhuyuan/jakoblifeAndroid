<template>
	<view class="all">
		<view style="background: #3298F7;height: 300px;">
			<view v-if="main_type" style="padding-top: 100px;">
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
								<view style="width: 20px; height:20px;background: #7AE545;border-radius: 50px;"></view>
								<view style="margin-left: 10px;">{{title_name}}</view>
								<uni-icons type="help" size="15" style="margin-left: 5px;" @tap="xueya_tap"></uni-icons>
							</view>
							<view v-else-if="xueya == 2" style="display: flex;flex-direction: row;">
								<view style="width: 20px; height:20px;background: #FCCD41;border-radius: 50px;"></view>
								<view style="margin-left: 10px;">{{title_name}}</view>
								<uni-icons type="help" size="15" style="margin-left: 5px;" @tap="xueya_tap"></uni-icons>
							</view>
							<view v-else-if="xueya == 3" style="display: flex;flex-direction: row;">
								<view style="width: 20px; height:20px;background: #F55A5A;border-radius: 50px;"></view>
								<view style="margin-left: 10px;">{{title_name}}</view>
								<uni-icons type="help" size="15" style="margin-left: 5px;" @tap="xueya_tap"></uni-icons>
							</view>
							<view v-else style="display: flex;flex-direction: row;">
								<view style="width: 20px; height:20px;background: #FFFFFF;border-radius: 50px;"></view>
								<view style="margin-left: 10px;">{{title_name}}</view>
								<uni-icons type="help" size="15" style="margin-left: 5px;" @tap="xueya_tap"></uni-icons>
							</view>
							<view style="border-top: 1px solid gainsboro;width: 65vw;margin-top: 5px;"></view>
							<view style="display: flex;flex-direction: row;margin-top: 5px;">
								<view>
									<view style="color: gray;font-size: 12px;">{{$t('gongxiangitem.title_23')}}mmHg
									</view>
									<view style="font-weight: bold;margin-top: 10px;font-size: 18px;">{{lowPressure}}
									</view>
								</view>
								<view style="margin-left: 20px;">
									<view style="color: gray;font-size: 12px;">{{$t('gongxiangitem.title_24')}}mmHg
									</view>
									<view style="font-weight: bold;margin-top: 10px;font-size: 18px;">{{highPressure}}
									</view>
								</view>
								<view style="margin-left: 20px;">
									<view style="color: gray;font-size: 12px;">{{$t('gongxiangitem.title_25')}}BMP
									</view>
									<view style="font-weight: bold;margin-top: 10px;font-size: 18px;">{{pulse}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="data_bg_A">
					<view v-show="binaji" class="tzkpsx" @click="tiaozhen()">编辑数据卡片</view>
					<view class="drag-containersss">
						<basic-drag v-model="list" :disableds="aaa" itemKey="title" :column="2" itemHeight="120px">

							<template #item="{element}">

								<view class="data_item_bgsss" :class="'animation-' + animation">
									<view class="icon_bgsss">
										<image :src="element.image" class="img_stylesss" />
										<text class="icon_text_bgsss">{{element.title}}</text>
									</view>
									<view
										style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
										<view v-if="element.bmi_show">
											<view style="display: flex; flex-direction: row;align-items: center;">
												<text
													style="margin-left: 5px; color: black;font-size: 12px;white-space: nowrap;text-overflow: ellipsis;overflow: auto;width: 45px;text-align: right;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15"
													@tap="BMI_tap(element.title)"></uni-icons>
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
											style="text-align: right;color: gray;font-size: 12px;">{{element.type_LX}}</text>
										<text style="text-align: right;font-size: 14px;">{{element.Step_count}}</text>
									</view>
									<view v-show="delate_icon" style="position: fixed; left: 0; top: 0;">
										<uni-icons type="minus-filled" size="18px" color="red"
											@click="delate_icon_cl(element.title,element)"></uni-icons>
									</view>
								</view>
							</template>
						</basic-drag>
					</view>
					<view v-show="button_show" style="display: flex;flex-direction: column;margin-top: 20px;">
						<view style="display: flex;justify-content: center;color: gray;">拖动可调整数据卡片位置</view>
						<view
							style="display: flex;flex-direction: row;justify-content: space-between; align-items: center; margin-top: 20px;">
							<view @click="ture_bt()"
								style="background: white;color: #3298F7;width: 120px;border-radius: 10px; padding: 10px;text-align: center;margin-right: 10px;margin-left: 10vw;">
								确认</view>
							<view @click="add_bt_xy()"
								style="background: white;color: #3298F7;width: 120px;border-radius: 10px; padding: 10px;text-align: center;margin-left: 10px;margin-right: 10vw;">
								添加数据卡片</view>
						</view>
					</view>
					<view style="background: #F7F7F7;">
						<image src="../../../static/image-active.png"
							style="width: 88vw;height: 200px; margin: 20px 20px 120px 20px;border-radius: 20px;">
						</image>
					</view>
				</view>
			</view>

			<view v-else style="margin-top: 95px;">
				<view class="title_zs">{{$t('shouye_item.title_0')}}</view>
				<view style="display: flex;flex-direction: row;margin-top: 20px;">

					<!-- 最新体重 -->
					<view @click="new_latest()"
						style="background: white; border-radius: 20px;padding: 10px; width: 45vw;margin-left: 20px;">
						<view style="display: flex;align-items: center;">
							<image src="../../../static/icons/6.png" style="width: 25px; height: 25px;"></image>
							<text style="font-size: 18px;margin-left: 10px;">最新体重</text>
						</view>
						<view
							style="margin-top: 30px; display: flex;flex-direction: row;justify-content: center; align-items: center;">
							<text style="font-size: 44px;font-weight: bold;">{{Latest_weight}}</text>
							<text style="margin-top: 15px; margin-left: 10px;">KG</text>
						</view>
						<view style="text-align: right;margin-top: 20px; font-size: 18px;">{{Latest_date}}</view>
					</view>
					<view
						style=" margin-left: 20px; margin-right: 20px; width: 40vw;background: white; border-radius: 20px;">
						<!-- 初始体重 -->
						<view @click="Initial()">
							<view style="display: flex;align-items: center;padding: 10px;">
								<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;"></image>
								<text style="margin-left: 5px;">初始体重</text>
							</view>
							<view class="tizhong_item_2">
								<text style="font-size: 18px;font-weight: bold;color: black;">{{Initial_weight}}</text>
								<text style="margin-left: 5px; color: gray;">kg</text>
							</view>
						</view>
						<view style="margin:5px 0 5px 8px; background: gainsboro; width: 33vw; height: 1px;"></view>
						<!-- 目标体重 -->
						<view @click="Target()">
							<view style="display: flex;align-items: center;padding: 10px;">
								<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;"></image>
								<text style="margin-left: 5px;">目标体重</text>
							</view>
							<view class="tizhong_item_2">
								<text style="font-size: 18px;font-weight: bold;">{{Target_weight}}</text>
								<text style="margin-left: 5px;color: gray;">kg</text>
							</view>
						</view>
					</view>
				</view>


				<view class="data_bg_A">
					<view class="tzkpsx" v-show="binaji2" @click="tiaozhen2()">编辑数据卡片</view>
					<view class="drag-containersss">
						<basic-drag v-model="list2" :disableds="aaa2" itemKey="title" :column="2" itemHeight="120px">

							<template #item="{element}">

								<view class="data_item_bgsss" :class="'animation-' + animation">
									<view class="icon_bgsss">
										<image :src="element.image" class="img_stylesss" />
										<text class="icon_text_bgsss">{{element.title}}</text>
									</view>
									<view
										style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
										<view v-if="element.bmi_show">
											<view style="display: flex; flex-direction: row;align-items: center;">
												<text
													style="margin-left: 5px; color: black;font-size: 12px;white-space: nowrap;text-overflow: ellipsis;overflow: auto;width: 60px;text-align: right;">{{element.BMI_ys}}</text>
												<uni-icons type="help" size="15"
													@tap="BMI_tap(element.title)"></uni-icons>
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
											style="text-align: right;color: gray;font-size: 12px;">{{element.type_LX}}</text>
										<text style="text-align: right;font-size: 14px;">{{element.Step_count}}</text>
									</view>
									<view v-show="delate_icon" style="position: fixed; left: 0; top: 0;">
										<uni-icons type="minus-filled" size="18px" color="red"
											@click="delate_icon_cl_2(element.title,element)"></uni-icons>
									</view>
								</view>
							</template>
						</basic-drag>
					</view>
					<view v-show="button_show2" style="display: flex;flex-direction: column;margin-top: 20px;">
						<view style="display: flex;justify-content: center;color: gray;">拖动可调整数据卡片位置</view>
						<view
							style="display: flex;flex-direction: row;justify-content: space-between; align-items: center; margin-top: 20px;">
							<view @click="ture_bt2()"
								style="background: white;color: #3298F7;width: 120px;border-radius: 10px; padding: 10px;text-align: center;margin-right: 10px;margin-left: 10vw;">
								确认</view>
							<view @click="add_bt2()"
								style="background: white;color: #3298F7;width: 120px;border-radius: 10px; padding: 10px;text-align: center;margin-left: 10px;margin-right: 10vw;">
								添加数据卡片</view>
						</view>
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
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
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


		<!-- 血氧 -->
		<view>
			<uni-popup ref="popup2" :mask-click="false">
				<view style="border-radius: 20px;background:#fff;padding-bottom: 20px;width: 280px;text-align: center;">
					<view>
						<view style="font-weight: bold;padding-top: 20px;font-size: 16px;">血氧分类</view>
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
							<view style="width: 80px;height: 10px;">偏低</view>
							<view style="width: 80px;height: 10px;">正常</view>
							<view style="width: 80px;height: 10px;">偏高</view>
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							1.检测注意：情绪激动、憋气或检测中的不规范处理均可能会导致动脉血氧饱和度结果不准确
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							2.偏高提示：动脉血氧饱和度>98%，提示若当机体摄入氧浓度过高，一般没有临床意义。在接受高浓度吸氧、高压氧治疗的人群，动脉血氧饱和度可接近100%。
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							3.偏低提示：动脉血氧饱和度&lt;90%，需考虑机体存在缺氧的可能，提示机体存在低氧血症。
						</view>
					</view>
					<button @tap="knowe2()"
						style="margin: 40px 50px 20px 50px;border-radius: 20px;background: #3298F7;color: white;">{{$t('BDSBitem.title_8')}}</button>
				</view>
			</uni-popup>
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


		<!-- 体脂秤首页手动 -->
		<view>
			<uni-popup ref="tihzi_popup_sd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between; padding: 10px;">
						<text @click="sd_closess()">✖</text>
						<view style="display: flex; flex-direction: row; margin-left: 50px;">
							<text @click="dataclick()">{{birthday}}</text>
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

		<!-- 记体重popup -->
		<view>
			<uni-popup ref="tizhong_popup" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff; margin-top: 60px; padding-bottom: 10px;align-items: center;">
					<view style="display: flex; justify-content: space-between; padding: 15px;">
						<text @click="tz_closess()" style="font-size: 22px;">✖</text>
						<view style="display: flex; flex-direction: row; ">
							<!-- <text @click="dataclick2()">{{birthday2}}</text>
							<uni-icons type="bottom" size="16"></uni-icons> -->
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
							<input type="number" v-model="mubiao" placeholder="请输入目标体重"
								style="text-align: center;width: 80vw;" />
							<text>kg</text>
						</view>
					</view>
					<button @tap="mubiao_weight()"
						style="margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('gongxiangitem.title_29')}}</button>
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
		<!-- <view>
			<yt-dateTimePicker ref="myPicker2" @submit="handleSubmit2" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('shouye_item.title_30'), $t('shouye_item.title_31'), $t('shouye_item.title_32'), $t('shouye_item.title_33'), $t('shouye_item.title_34'), $t('shouye_item.title_35')]" />
		</view> -->

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

				endtimesss: new Date().toISOString().slice(0, 10),


				list: [{
					bmi_show: false,
					image: "../../../static/icons/1.png",
					Step_number: "-",
					title: "步数",
					type_LX: "计步",
					Step_count: "-"
				}, {
					bmi_show: false,
					image: "../../../static/icons/2.png",
					Step_number: "-",
					title: "身高",
					type_LX: "cm",
					Step_count: "-"
				}],

				list2: [{
						image: "../../../static/icons/1.png",
						Step_number: "-",
						title: "步数",
						type_LX: "计步",
						Step_count: "-"
					}, {
						bmi_show: false,
						image: "../../../static/page_icon/3.png",
						Step_number: "-",
						title: "骨含BM",
						type_LX: "kg",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/7.png",
						Step_number: "-",
						title: "肌肉量",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/4.png",
						Step_number: "-",
						title: "蛋白率",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/5.jpg",
						Step_number: "-",
						title: "水分",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/8.png",
						Step_number: "-",
						title: "内脏脂肪指数",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/6.png",
						Step_number: "-",
						title: "脂肪率",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/1.png",
						Step_number: "-",
						title: "基础代谢率",
						type_LX: "KCAL",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/2.png",
						Step_number: "-",
						title: "皮下脂肪率",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/9.png",
						Step_number: "-",
						title: "身体年龄",
						type_LX: "岁",
						Step_count: "-",
						checkbox: false,
					}
				],

				show: true,
				main_type: '',
				fillOut: false,
				Latest_weight: "-",
				Latest_date: "-",
				Initial_weight: "--",
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
				lowPressure: "-",
				highPressure: "-",
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

				showTotal_date: new Date().toISOString().slice(5, 7) + "/" + new Date().toISOString().slice(8, 10),
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
				mubiao: '',
				xiongwei: "",
				yaowei: "",
				tunwei: "",
				shangtunwei: "",
				datuiwei: "",
				xiaotuiwei: "",
				aaa: true,
				aaa2: true,
				binaji: true,
				binaji2: true,
				animation: '', // 动画样式
				button_show: false,
				button_show2: false,

				stepCount: 0, //步数
				lastTime: 0, //上次更新时间
				lastx: 0, //上次X轴细速度
				lasty: 0, // 上杀r轴加速更
				lastl: 0, // 上称Z釉加速度

				delate_icon: false,

				shousuoya: "",
				shuzhangya: "",
				maibo: "",
				birthday1111: this.$t('shouye_item.title_21'),
				localData: uni.getStorageSync("settept"),



			}
		},





		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},


		onShow() {
			console.log("token:", uni.getStorageSync("token"))
			let that = this
			if (uni.getStorageSync("token") === "" || uni.getStorageSync("token") === undefined) {
				uni.redirectTo({
					url: "/pages/login/login_land"
				})
			} else {
				that.getUserInfo()
			}
		},



		methods: {
			...mapMutations(['getInfo']),



			getUserInfo() {
				let that = this
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
								that.Initial_weight = res.data.data.weight
								if (res.data.data.phonenumber === null || res.data.data.phonenumber === "") {
									uni.reLaunch({
										url: '../../login/Force_binding_phone'
									})
								} else {
									that.getInfo(res.data.data)
									that.queryDevices()
									that.getUserInfo1()
								}

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
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
			},

			getUserInfo1() {
				let that = this
				uni.request({
					url: that.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: function(res) {
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								that.Initial_weight = res.data.data.weight
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
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
				let that = this
				if (that.mubiao === "") {
					uni.showToast({
						title: '请输入目标体重',
						icon: 'none'
					})
					return
				} else {
					that.fat_scale_tz1()
				}
			},



			bindDateChange(e) {
				console.log("dsakjhdsas", e.detail.value)
				this.birthday1111 = e.detail.value
			},

			bindDateChange2(e) {
				console.log("dsakjhdsas", e.detail.value)
				this.birthday2 = e.detail.value
			},


			truesss() {
				if (this.shuzhangya === "" || this.shuzhangya === undefined) {
					uni.showToast({
						title: this.$t('qushiitem.title_4'),
						icon: "none"
					})
					return
				} else if (this.shousuoya === "" || this.shousuoya === undefined) {
					uni.showToast({
						title: this.$t('qushiitem.title_5'),
						icon: "none"
					})
					return
				} else if (this.maibo === "" || this.maibo === undefined) {
					uni.showToast({
						title: this.$t('qushiitem.title_6'),
						icon: "none"
					})
					return
				} else {
					this.pressure_data()
				}
			},


			//用户在app手动上报血压数据
			pressure_data() {

				let that = this
				let timestamp = Math.floor(new Date(that.birthday1111 == that.$t('shouye_item.title_21') ? new Date()
						.toISOString().slice(0, 10) + " " + new Date().getHours() + ":" + new Date().getMinutes() :
						that.birthday1111 + " " + new Date().getHours() + ":" + new Date().getMinutes()).getTime() /
					1000); // 将时间转换成时间戳（以秒为单位）
				// 将时间转换成时间戳（以秒为单位）
				console.log("time", timestamp)
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
							that.birthday = that.$t('shouye_item.title_21')
							that.shousuoya = ''
							that.shuzhangya = ''
							that.maibo = ''
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.list_recipe()
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



			delate_icon_cl(name, item) {
				for (let i = 0; this.list.length > i; i++) {
					if (this.list[i].title == name) {
						console.log("dakhdas", i)
						this.list.splice(i, 1)
						console.log("jjshjaadha", this.list)
						let kapianlist = []
						kapianlist = this.list
						uni.setStorageSync("kapianlist", kapianlist)
					}
				}
			},

			delate_icon_cl_2(name, item) {
				for (let i = 0; this.list2.length > i; i++) {
					if (this.list2[i].title == name) {
						console.log("dakhdas", i)
						this.list2.splice(i, 1)
						console.log("jjshjaadha", this.list2)
						let kapianlist2 = []
						kapianlist2 = this.list2
						uni.setStorageSync("kapianlist2", kapianlist2)
					}
				}
			},


			// 查询用户的绑定设备
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
								if (res.data.rows == "") {
									// uni.showToast({
									// 	title: '当前未绑定任何设备',
									// 	icon: 'none'
									// })
									that.main_type = true
								} else {
									uni.getStorageInfo({
										success(ress) {
											if (ress.keys.includes('deviceSn')) {
												for (let i = 0; res.data.rows.length > i; i++) {
													if (uni.getStorageSync("deviceSn") == res.data.rows[i]
														.deviceSn) {

														if (res.data.rows[i].deviceTypeId == "10") {
															that.get_device_info(res.data.rows[i].deviceSn)
															that.get_device_data(res.data.rows[i]
																.deviceSn)
															that.main_type = true
														} else if (res.data.rows[i].deviceTypeId ==
															"11") {
															that.get_device_info(res.data.rows[i].deviceSn)
															that.get_device_data1(res.data.rows[i]
																.deviceSn)
															that.main_type = false
														} else {
															that.main_type = true
														}
													} else {
														if (res.data.rows[i].deviceTypeId == "10") {
															that.get_device_data(res.data.rows[i]
																.deviceSn)
														} else if (res.data.rows[i].deviceTypeId ==
															"11") {
															that.get_device_data1(res.data.rows[i]
																.deviceSn)
														} else {
															that.main_type = true
														}
													}
												}
											} else {
												for (let i = 0; res.data.rows.length > i; i++) {
													if (res.data.rows[i].deviceTypeId == "10") {
														that.get_device_info(res.data.rows[i]
															.deviceSn)
														that.get_device_data(res.data.rows[i]
															.deviceSn)
													} else if (res.data.rows[i].deviceTypeId ==
														"11") {
														that.get_device_info(res.data.rows[i]
															.deviceSn)
														that.get_device_data1(res.data.rows[i]
															.deviceSn)
													} else {
														that.main_type = true
													}
												}
											}
										}
									})
								}
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

			//获取设备基础信息
			get_device_info(deviceSn) {
				let that = this
				console.log("token", uni.getStorageSync("token"))
				console.log("deviceSn", deviceSn)
				console.log("deviceSn11", uni.getStorageSync("deviceSn"))
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
									uni.setStorageSync("deviceSn", deviceSn)
									uni.getStorageInfo({
										success: function(ress) {
											// 判断缓存是否存在
											if (ress.keys.includes('kapianlist')) {
												console.log("dakhdas11111", "kapianlist存在")
												//存在
												that.list = uni.getStorageSync('kapianlist')
											} else {
												//不存在
												console.log("dakhdas", "kapianlist不存在")
												uni.setStorageSync("kapianlist", that.list)
											}
										}
									});
									that.list_recipe()
								} else if (res.data.data.deviceTypeId === "11") {
									uni.setStorageSync("deviceSn", deviceSn)
									uni.getStorageInfo({
										success: function(ress) {
											// 判断缓存是否存在
											if (ress.keys.includes('kapianlist2')) {
												console.log("dakhdas11111", "kapianlist2存在")
												//存在
												that.list2 = uni.getStorageSync('kapianlist2')
											} else {
												//不存在
												console.log("dakhdas", "kapianlist2不存在")
												uni.setStorageSync("kapianlist2", that.list2)
											}
										}
									});
									that.list_recipe()


								}
							} else {


								uni.getStorageInfo({
									success: function(ress) {
										// 判断缓存是否存在
										if (ress.keys.includes('kapianlist')) {
											console.log("dakhdas11111", "kapianlist存在")
											//存在
											that.list = uni.getStorageSync('kapianlist')
										} else {
											//不存在
											console.log("dakhdas", "kapianlist不存在")
											uni.setStorageSync("kapianlist", that.list)
										}
									}
								});


								uni.getStorageInfo({
									success: function(ress) {
										// 判断缓存是否存在
										if (ress.keys.includes('kapianlist2')) {
											console.log("dakhdas11111", "kapianlist2存在")
											//存在
											that.list2 = uni.getStorageSync('kapianlist2')
										} else {
											//不存在
											console.log("dakhdas", "kapianlist2不存在")
											uni.setStorageSync("kapianlist2", that.list2)
										}
									}
								});




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


			//设备数据概览
			list_recipe() {
				let that = this
				console.log("userId", that.info.userId)
				uni.request({
					url: that.$url_list_recipe,
					method: 'POST',
					data: {
						userId: that.info.userId
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("设备数据概览", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {

								that.Latest_weight = that.findValue(res.data.data, 'register', 'weight')
									.registerVal
								that.Latest_date = that.formatDate(that.findValue(res.data.data,
										'register',
										'weight')
									.updateTime)

								that.Target_weight = that.findValue(res.data.data, 'register',
										'goal_weight')
									.registerVal
								that.Chest_circumference = that.findValue(res.data.data, 'register',
										'chest_circumference')
									.registerVal
								that.waistline = that.findValue(res.data.data, 'register', 'waistline')
									.registerVal
								that.Hip_circumference = that.findValue(res.data.data, 'register',
										'hipline')
									.registerVal
								that.Upper_Chest_circumference = that.findValue(res.data.data, 'register',
										'biceps_circumference')
									.registerVal
								that.Thigh_circumference = that.findValue(res.data.data, 'register',
										'thigh_circumference')
									.registerVal
								that.Calf_circumference = that.findValue(res.data.data, 'register',
										'calf_circumference')
									.registerVal
								that.lowPressure = that.findValue(res.data.data, 'register',
										'lowPressure')
									.registerVal
								that.highPressure = that.findValue(res.data.data, 'register',
										'highPressure')
									.registerVal
								that.pulse = that.findValue(res.data.data, 'register',
										'heartrate')
									.registerVal
								if (that.lowPressure < 85 && that.highPressure <
									130) {
									that.xueya = 0
									that.title_name = "正常血压"
								} else if ((85 <= that.lowPressure && that
										.lowPressure <=
										89) && (130 <= that.highPressure && that
										.highPressure <= 139)) {
									that.xueya = 1
									that.title_name = "正常高血压值"
								} else if ((90 <= that.lowPressure && that
										.lowPressure <=
										99) && (140 <= that.highPressure && that
										.highPressure <= 159)) {
									that.xueya = 2
									that.title_name = "一级高血压"
								} else if (100 <= that.lowPressure && 160 <= that
									.highPressure) {
									that.xueya = 3
									that.title_name = "二级高血压"
								} else {
									that.title_name = "未知"
								}
								if (that.main_type == true) {
									for (let i = 0; uni.getStorageSync("kapianlist").length > i; i++) {
										if (uni.getStorageSync("kapianlist")[i].title.includes("步数")) {

											uni.getStorageInfo({
												success: function(ress) {
													// 判断缓存是否存在
													if (ress.keys.includes('settept1')) {
														let aa = that.localData
														if (aa != uni.getStorageSync("settept") && aa <
															uni.getStorageSync("settept")) {
															let bb = uni.getStorageSync("settept") - aa
															let aaa = uni.getStorageSync(
																"settept1") + bb
															uni.setStorageSync("settept1", aaa)
														}
														that.localData = uni.getStorageSync("settept")
														that.findValue(that.list, 'title',
															"步数").Step_number = uni.getStorageSync(
															"settept1")
														that.findValue(that.list, 'title',
															"步数").Step_count = that.formatDate(
															new Date().getTime())


													} else {
														//不存在
														that.findValue(that.list, 'title',
															"步数").Step_number = uni.getStorageSync(
															"settept")
														uni.setStorageSync("settept1", that.findValue(
															that.list, 'title',
															"步数").Step_number)
														that.findValue(that.list, 'title',
															"步数").Step_count = that.formatDate(
															new Date().getTime())
													}
												}
											});

										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("身高")) {
											let height = that.findValue(res.data.data, 'register', 'height')
												.registerVal
											that.findValue(that.list, 'title', "身高").Step_number = height == null ?
												'--' : height
											that.findValue(that.list, 'title', "身高").Step_count = that.formatDate(
												that.findValue(res.data.data, 'register', 'height').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("体重")) {
											that.findValue(that.list, 'title',
												"体重").Step_number = that.findValue(res.data.data, 'register',
												'weight').registerVal
											that.findValue(that.list, 'title',
												that.$t('zhuceitem.title_6')).Step_count = that.formatDate(that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}


										if (uni.getStorageSync("kapianlist")[i].title.includes("BMI")) {

											that.findValue(that.list, 'title', "BMI").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)

										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("血氧")) {

											that.findValue(that.list, 'title', "血氧").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("骨含BM")) {

											that.findValue(that.list, 'title', "骨含BM").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("肌肉量")) {

											that.findValue(that.list, 'title', "肌肉量").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("蛋白率")) {

											that.findValue(that.list, 'title', "蛋白率").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("水分")) {

											that.findValue(that.list, 'title', "水分").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("内脏脂肪指数")) {

											that.findValue(that.list, 'title', "内脏脂肪指数").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("脂肪率")) {

											that.findValue(that.list, 'title', "脂肪率").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("基础代谢率")) {

											that.findValue(that.list, 'title', "基础代谢率").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("皮下脂肪率")) {

											that.findValue(that.list, 'title', "皮下脂肪率").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("身体年龄")) {

											that.findValue(that.list, 'title', "身体年龄").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}

									}
								} else {
									for (let i = 0; uni.getStorageSync("kapianlist2").length > i; i++) {
										if (uni.getStorageSync("kapianlist2")[i].title.includes("步数")) {

											uni.getStorageInfo({
												success: function(ress) {

													if (ress.keys.includes('settept1')) {
														let aa = that.localData
														if (aa != uni.getStorageSync("settept") && aa <
															uni.getStorageSync("settept")) {
															let bb = uni.getStorageSync("settept") - aa
															let aaa = uni.getStorageSync(
																"settept1") + bb
															uni.setStorageSync("settept1", aaa)
														}
														that.localData = uni.getStorageSync("settept")
														that.findValue(that.list2, 'title',
															"步数").Step_number = uni.getStorageSync(
															"settept1")


														that.findValue(that.list2, 'title',
															"步数").Step_count = that.formatDate(
															new Date().getTime())
													} else {

														//不存在
														that.findValue(that.list2, 'title',
															"步数").Step_number = uni.getStorageSync(
															"settept")
														uni.setStorageSync("settept1", that.findValue(
															that.list2, 'title',
															"步数").Step_number)
														that.findValue(that.list2, 'title',
															"步数").Step_count = that.formatDate(
															new Date().getTime())
													}
												}
											});


										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("身高")) {
											let height = that.findValue(res.data.data, 'register', 'height')
												.registerVal
											that.findValue(that.list2, 'title', "身高").Step_number = height ==
												null ?
												'--' : height
											that.findValue(that.list2, 'title', "身高").Step_count = that.formatDate(
												that.findValue(res.data.data, 'register', 'height').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("体重")) {
											that.findValue(that.list2, 'title',
												"体重").Step_number = that.findValue(res.data.data, 'register',
												'weight').registerVal
											that.findValue(that.list2, 'title',
												that.$t('zhuceitem.title_6')).Step_count = that.formatDate(that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("BMI")) {

											that.findValue(that.list2, 'title', "BMI").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)

										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("血氧")) {

											that.findValue(that.list2, 'title', "血氧").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("骨含BM")) {

											that.findValue(that.list2, 'title', "骨含BM").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("肌肉量")) {

											that.findValue(that.list2, 'title', "肌肉量").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("蛋白率")) {

											that.findValue(that.list2, 'title', "蛋白率").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("水分")) {

											that.findValue(that.list2, 'title', "水分").Step_count = that.formatDate(
												that
												.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("内脏脂肪指数")) {

											that.findValue(that.list2, 'title', "内脏脂肪指数").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("脂肪率")) {

											that.findValue(that.list2, 'title', "脂肪率").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("基础代谢率")) {

											that.findValue(that.list2, 'title', "基础代谢率").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("皮下脂肪率")) {

											that.findValue(that.list2, 'title', "皮下脂肪率").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("身体年龄")) {

											that.findValue(that.list2, 'title', "身体年龄").Step_count = that
												.formatDate(that
													.findValue(res.data.data, 'register', 'weight').updateTime)
										}
									}
								}
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
				let that = this
				console.log("获取体脂秤身体指数1", deviceSn)
				uni.request({
					url: that.$url_get_device_data,
					method: 'POST',
					data: {
						deviceSn: deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("获取体脂秤身体指数", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (that.main_type == true) {
									for (let i = 0; uni.getStorageSync("kapianlist").length > i; i++) {
										if (uni.getStorageSync("kapianlist")[i].title.includes("BMI")) {
											that.findValue(that.list, 'title', "BMI").Step_number = res.data.data
												.BMI
											that.findValue(that.list, 'title', "BMI").Step_count = "--/--"
											if (that.findValue(that.list, 'title', 'BMI').Step_number < 18.5) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 0
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "体重过轻"
											} else if (18.5 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number &&
												that
												.findValue(that.list, 'title', 'BMI').Step_number <= 24.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 1
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "正常体重"
											} else if (20.5 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number &&
												that
												.findValue(that.list, 'title', 'BMI').Step_number <= 29.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 2
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "超重"
											} else if (30 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number && that.findValue(that.list, 'title', 'BMI')
												.Step_number <= 34.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 3
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "一级肥胖"
											} else if (35.0 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number && that.findValue(that.list, 'title', 'BMI')
												.Step_number <= 39.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 4
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "二级肥胖"
											} else if (40 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 5
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "三级肥胖或病态肥胖"
											}
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("血氧")) {
											that.findValue(that.list, 'title', "血氧").BMI_ys = "--"
											that.findValue(that.list, 'title', "血氧").Step_number = "--"
											that.findValue(that.list, 'title', "血氧").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("骨含BM")) {
											that.findValue(that.list, 'title', "骨含BM").Step_number = res.data.data
												.BM == "" ? "--" : res.data.data
												.BM
											that.findValue(that.list, 'title', "骨含BM").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("肌肉量")) {
											that.findValue(that.list, 'title', "肌肉量").Step_number = res.data.data
												.ROM == "" ? "--" : res.data.data
												.ROM
											that.findValue(that.list, 'title', "肌肉量").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("蛋白率")) {
											that.findValue(that.list, 'title', "蛋白率").Step_number = res.data.data
												.PP == "" ? "--" : res.data.data
												.PP
											that.findValue(that.list, 'title', "蛋白率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("水分")) {
											that.findValue(that.list, 'title', "水分").Step_number = res.data.data
												.MOI == "" ? "--" : res.data.data
												.MOI
											that.findValue(that.list, 'title', "水分").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("内脏脂肪指数")) {
											that.findValue(that.list, 'title', "内脏脂肪指数").Step_number = res.data
												.data
												.UVI == "" ? "--" : res.data.data
												.UVI
											that.findValue(that.list, 'title', "内脏脂肪指数").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("脂肪率")) {
											that.findValue(that.list, 'title', "脂肪率").Step_number = res.data.data
												.BFR == "" ? "--" : res.data.data
												.BFR
											that.findValue(that.list, 'title', "脂肪率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("基础代谢率")) {
											that.findValue(that.list, 'title', "基础代谢率").Step_number = res.data
												.data
												.BMR == "" ? "--" : res.data.data
												.BMR
											that.findValue(that.list, 'title', "基础代谢率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("皮下脂肪率")) {
											that.findValue(that.list, 'title', "皮下脂肪率").Step_number = res.data
												.data
												.SFR == "" ? "--" : res.data.data
												.SFR
											that.findValue(that.list, 'title', "皮下脂肪率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("身体年龄")) {
											that.findValue(that.list, 'title', "身体年龄").Step_number = res.data.data
												.PA == "" ? "--" : res.data.data
												.PA
											that.findValue(that.list, 'title', "身体年龄").Step_count = "--/--"
										}
									}
								} else {
									for (let i = 0; uni.getStorageSync("kapianlist2").length > i; i++) {
										if (uni.getStorageSync("kapianlist2")[i].title.includes("BMI")) {
											that.findValue(that.list2, 'title', "BMI").Step_number = res
												.data
												.data
												.BMI
											that.findValue(that.list2, 'title', "BMI").Step_count = "--/--"
											if (that.findValue(that.list2, 'title', 'BMI').Step_number <
												18.5) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 0
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "体重过轻"
											} else if (18.5 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number &&
												that
												.findValue(that.list2, 'title', 'BMI').Step_number <= 24.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 1
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "正常体重"
											} else if (20.5 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number &&
												that
												.findValue(that.list2, 'title', 'BMI').Step_number <= 29.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 2
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "超重"
											} else if (30 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number && that
												.findValue(that.list2, 'title', 'BMI').Step_number <= 34.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 3
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "一级肥胖"
											} else if (35.0 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number &&
												that
												.findValue(that.list2, 'title', 'BMI').Step_number <= 39.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 4
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "二级肥胖"
											} else if (40 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 5
												that.findValue(that.list2, 'title', 'BMI').BMI_ys =
													"三级肥胖或病态肥胖"
											}
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("血氧")) {
											that.findValue(that.list2, 'title', "血氧").BMI_ys = "--"
											that.findValue(that.list2, 'title', "血氧").Step_number = "--"
											that.findValue(that.list2, 'title', "血氧").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("骨含BM")) {
											that.findValue(that.list2, 'title', "骨含BM").Step_number = res.data.data
												.BM == "" ? "--" : res.data.data
												.BM
											that.findValue(that.list2, 'title', "骨含BM").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("肌肉量")) {
											that.findValue(that.list2, 'title', "肌肉量").Step_number = res.data.data
												.ROM == "" ? "--" : res.data.data
												.ROM
											that.findValue(that.list2, 'title', "肌肉量").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("蛋白率")) {
											that.findValue(that.list2, 'title', "蛋白率").Step_number = res.data.data
												.PP == "" ? "--" : res.data.data
												.PP
											that.findValue(that.list2, 'title', "蛋白率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("水分")) {
											that.findValue(that.list2, 'title', "水分").Step_number = res.data.data
												.MOI == "" ? "--" : res.data.data
												.MOI
											that.findValue(that.list2, 'title', "水分").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("内脏脂肪指数")) {
											that.findValue(that.list2, 'title', "内脏脂肪指数").Step_number = res.data
												.data
												.UVI == "" ? "--" : res.data.data
												.UVI
											that.findValue(that.list2, 'title', "内脏脂肪指数").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("脂肪率")) {
											that.findValue(that.list2, 'title', "脂肪率").Step_number = res.data.data
												.BFR == "" ? "--" : res.data.data
												.BFR
											that.findValue(that.list2, 'title', "脂肪率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("基础代谢率")) {
											that.findValue(that.list2, 'title', "基础代谢率").Step_number = res.data
												.data
												.BMR == "" ? "--" : res.data.data
												.BMR
											that.findValue(that.list2, 'title', "基础代谢率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("皮下脂肪率")) {
											that.findValue(that.list2, 'title', "皮下脂肪率").Step_number = res.data
												.data
												.SFR == "" ? "--" : res.data.data
												.SFR
											that.findValue(that.list2, 'title', "皮下脂肪率").Step_count = "--/--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("身体年龄")) {
											that.findValue(that.list2, 'title', "身体年龄").Step_number = res.data.data
												.PA == "" ? "--" : res.data.data
												.PA
											that.findValue(that.list2, 'title', "身体年龄").Step_count = "--/--"
										}
									}
								}


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
			//获取体脂秤身体指数
			get_device_data1(deviceSn) {
				let that = this
				console.log("获取体脂秤身体指数1", deviceSn)
				uni.request({
					url: that.$url_get_device_data,
					method: 'POST',
					data: {
						deviceSn: deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("获取体脂秤身体指数", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (that.main_type == true) {
									for (let i = 0; uni.getStorageSync("kapianlist").length > i; i++) {
										if (uni.getStorageSync("kapianlist")[i].title.includes("BMI")) {
											that.findValue(that.list, 'title', "BMI").Step_number = res.data.data
												.BMI
											if (that.findValue(that.list, 'title', 'BMI').Step_number < 18.5) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 0
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "体重过轻"
											} else if (18.5 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number &&
												that
												.findValue(that.list, 'title', 'BMI').Step_number <= 24.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 1
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "正常体重"
											} else if (20.5 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number &&
												that
												.findValue(that.list, 'title', 'BMI').Step_number <= 29.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 2
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "超重"
											} else if (30 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number && that.findValue(that.list, 'title', 'BMI')
												.Step_number <= 34.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 3
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "一级肥胖"
											} else if (35.0 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number && that.findValue(that.list, 'title', 'BMI')
												.Step_number <= 39.9) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 4
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "二级肥胖"
											} else if (40 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number) {
												that.findValue(that.list, 'title', 'BMI').BMI_TF = 5
												that.findValue(that.list, 'title', 'BMI').BMI_ys = "三级肥胖或病态肥胖"
											}
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("血氧")) {
											that.findValue(that.list, 'title', "血氧").BMI_ys = "--"
											that.findValue(that.list, 'title', "血氧").Step_number = "--"
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("骨含BM")) {
											that.findValue(that.list, 'title', "骨含BM").Step_number = res.data.data
												.BM == "" ? "--" : res.data.data.BM
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("肌肉量")) {
											that.findValue(that.list, 'title', "肌肉量").Step_number = res.data.data
												.ROM == "" ? "--" : res.data.data.ROM

										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("蛋白率")) {
											that.findValue(that.list, 'title', "蛋白率").Step_number = res.data.data
												.PP == "" ? "--" : res.data.data.PP
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("水分")) {
											that.findValue(that.list, 'title', "水分").Step_number = res.data.data
												.MOI == "" ? "--" : res.data.data.MOI
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("内脏脂肪指数")) {
											that.findValue(that.list, 'title', "内脏脂肪指数").Step_number = res.data
												.data.UVI == "" ? "--" : res.data.data.UVI
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("脂肪率")) {
											that.findValue(that.list, 'title', "脂肪率").Step_number = res.data.data
												.BFR == "" ? "--" : res.data.data.BFR
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("基础代谢率")) {
											that.findValue(that.list, 'title', "基础代谢率").Step_number = res.data
												.data.BMR == "" ? "--" : res.data.data.BMR
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("皮下脂肪率")) {
											that.findValue(that.list, 'title', "皮下脂肪率").Step_number = res.data
												.data.SFR == "" ? "--" : res.data.data.SFR
										}
										if (uni.getStorageSync("kapianlist")[i].title.includes("身体年龄")) {
											that.findValue(that.list, 'title', "身体年龄").Step_number = res.data.data
												.PA == "" ? "--" : res.data.data.PA
										}
									}
								} else {
									for (let i = 0; uni.getStorageSync("kapianlist2").length > i; i++) {
										if (uni.getStorageSync("kapianlist2")[i].title.includes("BMI")) {
											that.findValue(that.list2, 'title', "BMI").Step_number = res
												.data.data.BMI
											if (that.findValue(that.list2, 'title', 'BMI').Step_number <
												18.5) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 0
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "体重过轻"
											} else if (18.5 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number && that.findValue(that.list2, 'title', 'BMI')
												.Step_number <= 24.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 1
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "正常体重"
											} else if (20.5 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number && that.findValue(that.list2, 'title', 'BMI')
												.Step_number <= 29.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 2
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "超重"
											} else if (30 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number && that.findValue(that.list2, 'title', 'BMI')
												.Step_number <= 34.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 3
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "一级肥胖"
											} else if (35.0 <= that.findValue(that.list2, 'title', 'BMI')
												.Step_number && that.findValue(that.list2, 'title', 'BMI')
												.Step_number <= 39.9
											) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 4
												that.findValue(that.list2, 'title', 'BMI').BMI_ys = "二级肥胖"
											} else if (40 <= that.findValue(that.list, 'title', 'BMI')
												.Step_number) {
												that.findValue(that.list2, 'title', 'BMI').BMI_TF = 5
												that.findValue(that.list2, 'title', 'BMI').BMI_ys =
													"三级肥胖或病态肥胖"
											}
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("血氧")) {
											that.findValue(that.list2, 'title', "血氧").BMI_ys = "--"
											that.findValue(that.list2, 'title', "血氧").Step_number = "--"
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("骨含BM")) {
											that.findValue(that.list2, 'title', "骨含BM").Step_number = res.data.data
												.BM == "" ? "--" : res.data.data.BM
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("肌肉量")) {
											that.findValue(that.list2, 'title', "肌肉量").Step_number = res.data.data
												.ROM == "" ? "--" : res.data.data.ROM

										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("蛋白率")) {
											that.findValue(that.list2, 'title', "蛋白率").Step_number = res.data.data
												.PP == "" ? "--" : res.data.data.PP
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("水分")) {
											that.findValue(that.list2, 'title', "水分").Step_number = res.data.data
												.MOI == "" ? "--" : res.data.data.MOI
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("内脏脂肪指数")) {
											that.findValue(that.list2, 'title', "内脏脂肪指数").Step_number = res.data
												.data.UVI == "" ? "--" : res.data.data.UVI
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("脂肪率")) {
											that.findValue(that.list2, 'title', "脂肪率").Step_number = res.data.data
												.BFR == "" ? "--" : res.data.data.BFR
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("基础代谢率")) {
											that.findValue(that.list2, 'title', "基础代谢率").Step_number = res.data
												.data.BMR == "" ? "--" : res.data.data.BMR
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("皮下脂肪率")) {
											that.findValue(that.list2, 'title', "皮下脂肪率").Step_number = res.data
												.data.SFR == "" ? "--" : res.data.data.SFR
										}
										if (uni.getStorageSync("kapianlist2")[i].title.includes("身体年龄")) {
											that.findValue(that.list2, 'title', "身体年龄").Step_number = res.data.data
												.PA == "" ? "--" : res.data.data.PA
										}
									}
								}
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


			tiaozhen() {
				this.binaji = false
				this.animation = 'shake';
				this.button_show = true
				this.delate_icon = true
				this.aaa = false
			},
			tiaozhen2() {
				this.binaji2 = false
				this.animation = 'shake';
				this.button_show2 = true
				this.delate_icon = true
				this.aaa2 = false
			},

			qiehuan() {
				this.binaji = true
				this.animation = '';
				this.button_show = false
				this.delate_icon = false
				this.aaa = true
				uni.setStorageSync("kapianlist", this.list)
				this.binaji2 = true
				this.animation = '';
				this.button_show2 = false
				this.delate_icon = false
				this.aaa2 = true
				uni.setStorageSync("kapianlist2", this.list2)
				uni.navigateTo({
					url: '../../../pages/Bind/cs_manage_1?typesss=main'
				})
			},

			add_bt_xy() {
				console.log("dsakhjdas", "sdasdsdsadsasda")
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
				console.log("dsakhdas", "kdsakldkadhashd")
				this.binaji = true
				this.animation = '';
				this.button_show = false
				this.delate_icon = false
				this.aaa = true
				uni.setStorageSync("kapianlist", this.list)
			},



			ture_bt2() {
				console.log("dsakhdasaaaaaa", "kdsakldkadhashd")
				this.binaji2 = true
				this.animation = '';
				this.button_show2 = false
				this.delate_icon = false
				this.aaa2 = true
				uni.setStorageSync("kapianlist2", this.list2)
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
			xueya_tap() {
				this.$refs.popup.open("center")
			},
			BMI_tap(id) {
				console.log("dsahdahdas", id)
				if (id == "血氧") {
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
						title: this.$t('zhuceitem.toast_9'),
						icon: 'none'
					})
					return
				} else {
					this.fat_scale_tz()
					// this.fat_scale_tz1()
				}
			},
			select_ruler() {
				this.fat_scale_1()
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
				if (this.main_type == true) {
					this.$refs.qs_popup.open("center")
				} else {
					this.fillOut = true
				}
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
			dataclick1() {
				this.$refs.myPicker1.show();
			},
			handleSubmit1(e) {
				this.birthday1 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
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

			Body_circumference() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.open("center")
			},

			//用户在app手动上报重量数据
			fat_scale_tz() {
				let that = this
				let timestamp = Math.floor(new Date(that.birthday2 == that.$t('shouye_item.title_21') ?
					new Date()
					.toISOString().slice(0, 10) + " " + new Date().getHours() + ":" + new Date().getMinutes() :
					that.birthday2).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
				console.log("time", new Date()
					.toISOString().slice(0, 10))
				console.log("time", timestamp)
				console.log("uni1111", uni.getStorageSync("deviceSn"))
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
							that.list_recipe()
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
			//用户在app手动上报重量数据
			fat_scale_tz1() {
				let that = this
				let timestamp = new Date(new Date().toISOString().slice(0, 10) + " " + new Date().getHours() +
					":" + new Date().getMinutes()).getTime() / 1000; // 将时间转换成时间戳（以秒为单位）
				console.log("time", timestamp)
				console.log("uni3333", uni.getStorageSync("deviceSn"))
				uni.request({
					url: that.$url_fat_scale,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync("deviceSn"),
						slaveSn: "1",
						slaveData: {
							goal_weight: that.mubiao,
						},
						time: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success: function(res) {
						console.log("用户在app手动上报重量数据2", res)
						if (res.data.code == 200) {
							that.mubiao = ""
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.$refs.mubiao_popup.close()
							that.list_recipe()
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
				let timestamp = Math.floor(new Date(that.birthday == that.$t('shouye_item.title_21') ?
					new Date()
					.toISOString().slice(0, 10) : that.birthday).getTime() / 1000); // 将时间转换成时间戳（以秒为单位）
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
							that.birthday = that.$t('shouye_item.title_21')
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
							that.list_recipe()
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
							that.list_recipe()
							that.$refs.tihzi_popup_hd.close()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})

			}


		}
	}
</script>

<style lang="scss" scoped>
	.title_zs {
		display: flex;
		justify-content: flex-end;
		margin-right: 25px;
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
		background: #58BF78;
		border-radius: 15px;
	}

	.data_bg {
		display: flex;
		justify-content: center;
		margin: 10px 20px 0 20px;
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
		margin-top: 20px;
		padding: 20px 0 0 0;
	}

	.tzkpsx {
		display: flex;
		justify-content: center;
		background: white;
		margin: 10px 20px 20px 20px;
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
		margin-top: 10px;
		width: 50px;
		text-align: center;
		font-weight: bold;
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



	.data_item_bgsss {
		height: 90px;
		line-height: 20px;
		width: 36vw;
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
		padding-left: 20px;
		// padding-right: 20px;
	}

	.all {
		color: black;
		width: 100vw;
		height: 100vh;
		background: #F7F7F7;

		.animation-shake {
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
</style>