<template>
	<view style="color: black;height: 100vh;">
		<view style="padding-top: 120px;padding-left: 10px; padding-right: 10px;">
			<liu-goods-swiper :goodsList="goodsList" @clickItem="chooseItem"></liu-goods-swiper>
		</view>
		<view style="margin: 10px; 5px 5px 5px">
			<week-fold-calendar v-if="date_list" @change="change" allow-future default-view-type="week" />
			<view v-else style="display: flex;justify-content: center; align-items: center; flex-direction: row;">
				<view style="position: absolute;left: 20px;font-weight: bold;font-size: 14px;">{{$t("帮助")}}</view>
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<view @click="jianshao()">
						<uni-icons type="left" size="25"></uni-icons>
					</view>

					<view style=" font-size: 20px;margin-left: 40px;margin-right: 40px;">{{ dateLabel }}</view>
					<view @click="zengjia()">
						<uni-icons type="right" size="25"></uni-icons>
					</view>
				</view>
				<view style="position: absolute;right: 20px;font-weight: bold;font-size: 14px;" @click="daochu()">
					{{$t('导出')}}
				</view>
			</view>
		</view>
		<view v-if="listdat" style="padding-bottom: 80px;">
			<view v-if="chooseItem_name == $t('血压')">
				<view v-if="act == true">
					<movable-area style="width: 90vw;height: auto; margin-top: 20px;" v-for="(item,index) in swipeList"
						:key="index">
						<view>
							<view class="icon_item_bg_1s">
								<text @tap="tap($event, index,item.deviceSn,item.object.details)"
									style="width: 15px;line-height: 18px; display: flex;flex-direction: row;writing-mode: vertical-lr;text-orientation: upright;margin-right: 5px;">
									{{$t("删除记录")}}
								</text>
							</view>
							<movable-view :x="item.object.summary.ss" :y="item.y" @change="onChange($event,index)"
								:animation='false' style=" width: 100vw;height: auto;" direction="horizontal">
								<view class="icon_item_bg_ssss">
									<view class="icon_item_bg">
										<view class="icon_item_bg_1">
											<image src="../../../static/icons/3.png" class="img_iocn_bg" />
											<view
												style="margin-top: 10px;text-align: center; width: 60px; font-size: 13px; font-weight: 400;">
												{{$t("平均血压")}}
											</view>
										</view>
										<view style="margin-left: 10px;">
											<view
												style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
												<view class="title_type_bg">
													<view v-if="item.object.summary.xueyalist == 0" class="xueya_type"
														style="background: #58BF78;"></view>
													<view v-else-if="item.object.summary.xueyalist == 1"
														class="xueya_type" style="background: #FFEC01"></view>
													<view v-else-if="item.object.summary.xueyalist == 2"
														class="xueya_type" style="background: #FCCD41;"></view>
													<view v-else-if="item.object.summary.xueyalist == 3"
														class="xueya_type" style="background: #F55A5A;"></view>
													<view v-else-if="item.object.summary.xueyalist == 4"
														class="xueya_type" style="background: white;"></view>

													<view class="title_font_bg">{{item.object.summary.level}}</view>
													<uni-icons type="help" size="15" style=""
														@tap="BMI_tap"></uni-icons>
												</view>
												<view
													style="margin-right: 10px; color: #999999; font-size: 14px; font-weight: 400;">
													{{item.modelName}}
												</view>
											</view>
											<view class="border_bg" />
											<view style="display: flex; flex-direction: row;">
												<view style="text-align: center;">
													<view class="text_item_bg">{{$t('收缩压')}}/{{Blood}}</view>
													<view class="text_item_bg_1">{{item.object.summary.highPressureAvg}}
													</view>
												</view>
												<view style="text-align: center;">
													<view class="text_item_bg">{{$t('舒张压')}}/{{Blood}}
													</view>
													<view class="text_item_bg_1">{{item.object.summary.lowPressureAvg}}
													</view>
												</view>
												<view style="text-align: center;">
													<view class="text_item_bgqqq">{{$t('脉搏')}}/BPM
													</view>
													<view class="text_item_bg_1">{{item.object.summary.heartrateAvg}}
													</view>
												</view>
												<view style="margin-top: 20px; margin-left: 20px;"
													@click="zhankai_cl(index)">
													<view v-if="item.object.summary.ss == true">
														<uni-icons type="top" size="22"></uni-icons>
													</view>
													<view v-else>
														<uni-icons type="bottom" size="22"></uni-icons>
													</view>
												</view>
											</view>

										</view>
									</view>
								</view>
							</movable-view>
						</view>
						<view v-if="item.object.summary.ss == true">
							<movable-area style="width: 90vw;height: auto; margin-top: 20px;"
								v-for="(item1,index1) in item.object.details" :key="index1">
								<view>
									<view class="icon_item_bg_1s">
										<text @tap="tap1($event,index, index1,item.deviceSn,item1.timestamp)"
											style="width: 15px;line-height: 18px; display: flex;flex-direction: row;writing-mode: vertical-lr;text-orientation: upright;margin-right: 5px;">
											{{$t("删除记录")}}
										</text>
									</view>
									<movable-view :x="item1.ss" :y="item1.y" @change="onChange1($event,index,index1)"
										:animation='false' style=" width: 100vw;height: auto;" direction="horizontal">
										<view class="icon_item_bg_ssss">
											<view class="icon_item_bg">
												<view class="icon_item_bg_1">
													<image src="../../../static/icons/3.png" class="img_iocn_bg" />
													<view
														style="margin-top: 10px;text-align: center; font-size: 13px; font-weight: 400;">
														{{item1.time}}
													</view>
												</view>
												<view style="margin-left: 10px;">
													<view
														style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
														<view class="title_type_bg">
															<view v-if="item1.xueyalist1 == 0" class="xueya_type"
																style="background: #58BF78;"></view>
															<view v-else-if="item1.xueyalist1 == 1" class="xueya_type"
																style="background: #FFEC01;"></view>
															<view v-else-if="item1.xueyalist1 == 2" class="xueya_type"
																style="background: #FCCD41;"></view>
															<view v-else-if="item1.xueyalist1 == 3" class="xueya_type"
																style="background: #F55A5A;"></view>
															<view v-else-if="item1.xueyalist1 == 4" class="xueya_type"
																style="background: white;"></view>

															<view class="title_font_bg">{{item1.level2}}</view>

															<uni-icons type="help" size="15" style=""
																@tap="BMI_tap"></uni-icons>
														</view>
														<view style="margin-right: 10px; color: gray;">
															{{item.modelName}}
														</view>
													</view>
													<view class="border_bg1" />
													<view style="display: flex; flex-direction: row; ">
														<view style="text-align: center;">
															<view class="text_item_bg">{{$t("收缩压")}}/{{Blood}}</view>
															<view class="text_item_bg_1">{{item1.highPressure}}</view>
														</view>
														<view style="text-align: center;">
															<view class="text_item_bg">{{$t("舒张压")}}/{{Blood}}</view>
															<view class="text_item_bg_1">{{item1.lowPressure}}</view>
														</view>
														<view style="text-align: center;">
															<view class="text_item_bg">{{$t('脉搏')}}/BPM</view>
															<view class="text_item_bg_1">{{item1.heartrate}}</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</movable-view>
								</view>
							</movable-area>
						</view>
						<view v-else></view>
					</movable-area>
				</view>
				<view v-else-if="act1 == true">
					<movable-area style="width: 90vw;height: auto; margin-top: 20px; " v-for="(item,index) in swipeList"
						:key="index">
						<view>
							<view class="icon_item_bg_1s">
								<text @tap="tap($event, index,item.deviceSn,item.object.details)"
									style="width: 15px;display: flex;flex-direction: row;writing-mode: vertical-lr;text-orientation: upright;margin-right: 5px;">
									{{$t("删除记录")}}
								</text>
							</view>
							<view style="margin-left: 10px;border-radius: 0 0 20px 20px;">
								<view>
									<view v-if="item.object.summary.ss == true" class="icon_item_bg_3s">
										<view v-for="(item1,index1) in item.object.details" :key="index1">
											<view style="display: flex;flex-direction: row; padding-bottom: 10px;">
												<view style="margin-top: 10px;width: 25vw;margin-left: 10px;">
													{{item1.time}}
												</view>
												<view style="margin-top: 10px;width: 20vw;">{{item1.highPressure}}
												</view>
												<view style="margin-top: 10px;width: 20vw;">{{item1.lowPressure}}
												</view>
												<view style="margin-top: 10px;">{{item1.heartrate}}</view>
											</view>
										</view>
									</view>
									<view v-else></view>
								</view>
								<view v-if="item.object.summary.ss == true">
									<movable-view :x="item.object.summary.ss" :y="item.y"
										@change="onChange($event,index)" :animation='false'
										style=" width: 100vw;height: 116px;" direction="horizontal">
										<view class="icon_item_bg_ssss_1">
											<view class="icon_item_bg">
												<view class="icon_item_bg_1">
													<image src="../../../static/icons/3.png" class="img_iocn_bg" />
													<view
														style="margin-top: 10px;text-align: center;font-size: 13px; font-weight: 400; ">
														{{item.dateTime}}
													</view>
												</view>
												<view>
													<view
														style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
														<view class="title_type_bg">
															<view v-if="item.object.summary.xueyalist == 0"
																class="xueya_type" style="background: #58BF78;"></view>
															<view v-else-if="item.object.summary.xueyalist == 1"
																class="xueya_type" style="background: #FFEC01"></view>
															<view v-else-if="item.object.summary.xueyalist == 2"
																class="xueya_type" style="background: #FCCD41;"></view>
															<view v-else-if="item.object.summary.xueyalist == 3"
																class="xueya_type" style="background: #F55A5A;"></view>
															<view v-else-if="item.object.summary.xueyalist == 4"
																class="xueya_type" style="background: white;"></view>
															<view class="title_font_bg">{{item.object.summary.level}}
															</view>
															<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
														</view>
														<view
															style="margin-right: 20px; color: #999999; font-size: 10px; font-weight: 400;">
															{{item.modelName}}
														</view>
													</view>
													<view class="border_bg" />
													<view style="display: flex; flex-direction: row; ">
														<view style="text-align: center;">
															<view class="text_item_bg">
																{{$t('收缩压')}}/{{Blood}}
															</view>
															<view class="text_item_bg_1">
																{{item.object.summary.highPressureAvg}}
															</view>
														</view>
														<view style="text-align: center;">
															<view class="text_item_bg">
																{{$t('舒张压')}}/{{Blood}}
															</view>
															<view class="text_item_bg_1">
																{{item.object.summary.lowPressureAvg}}
															</view>
														</view>
														<view style="text-align: center;">
															<view class="text_item_bgqqq">
																{{$t('脉搏')}}/BPM
															</view>
															<view class="text_item_bg_1">
																{{item.object.summary.heartrateAvg}}
															</view>
														</view>
														<view style="margin-top: 20px;margin-left: 20px;"
															@click="zhankai_cl1(index,item.dateTime)">
															<uni-icons type="top" size="22"></uni-icons>
														</view>
													</view>
												</view>
											</view>
										</view>
									</movable-view>
								</view>
								<!-- 列表 -->
								<view v-else>
									<movable-view :x="item.object.summary.ss" :y="item.y"
										@change="onChange($event,index)" :animation='false'
										style=" width: 100vw;height: 116px;" direction="horizontal">
										<view class="icon_item_bg_ssss">
											<view class="icon_item_bg">
												<view class="icon_item_bg_1">
													<image src="../../../static/icons/3.png" class="img_iocn_bg" />
													<view
														style="margin-top: 10px;text-align: center;font-size: 13px; font-weight: 400;">
														{{item.dateTime}}
													</view>
												</view>
												<view style="margin-left: 10px;">
													<view
														style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
														<view class="title_type_bg">
															<view v-if="item.object.summary.xueyalist == 0"
																class="xueya_type" style="background: #58BF78;"></view>
															<view v-else-if="item.object.summary.xueyalist == 1"
																class="xueya_type" style="background: #FFEC01"></view>
															<view v-else-if="item.object.summary.xueyalist == 2"
																class="xueya_type" style="background: #FCCD41;"></view>
															<view v-else-if="item.object.summary.xueyalist == 3"
																class="xueya_type" style="background: #F55A5A;"></view>
															<view v-else-if="item.object.summary.xueyalist == 4"
																class="xueya_type" style="background: white;"></view>
															<view class="title_font_bg">{{item.object.summary.level}}
															</view>
															<uni-icons type="help" size="15" @tap="BMI_tap"></uni-icons>
														</view>
														<view
															style="margin-right: 20px; color: #999999; font-size: 14px; font-weight: 400;">
															{{item.modelName}}
														</view>
													</view>
													<view class="border_bg" />
													<view style="display: flex; flex-direction: row; ">
														<view style="text-align: center;">
															<view class="text_item_bg">
																{{$t('收缩压')}}/{{Blood}}
															</view>
															<view class="text_item_bg_1">
																{{item.object.summary.highPressureAvg}}
															</view>
														</view>
														<view style="text-align: center;">
															<view class="text_item_bg">
																{{$t('舒张压')}}/{{Blood}}
															</view>
															<view class="text_item_bg_1">
																{{item.object.summary.lowPressureAvg}}
															</view>
														</view>

														<view style="text-align: center;">
															<view class="text_item_bgqqq">
																{{$t('脉搏')}}/BPM
															</view>
															<view class="text_item_bg_1">
																{{item.object.summary.heartrateAvg}}
															</view>
														</view>
														<view style="margin-top: 20px;margin-left: 20px;"
															@click="zhankai_cl1(index,item.dateTime)">
															<view v-if="item.object.summary.ss == true">
																<uni-icons type="top" size="22"></uni-icons>
															</view>
															<view v-else><uni-icons type="bottom" size="22"></uni-icons>
															</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</movable-view>
								</view>
							</view>
						</view>
					</movable-area>
				</view>
			</view>
			<view v-else-if="chooseItem_name == $t('体脂')">
				<view v-if="act == true">
					<movable-area style="width: 90vw;height: auto; margin-top: 20px;" v-for="(item,index) in swipeList"
						:key="index">
						<view>
							<view class="icon_item_bg_1s">
								<text @tap="tap($event, index,item.deviceSn,item.object.details)"
									style="width: 15px;line-height: 18px; display: flex;flex-direction: row;writing-mode: vertical-lr;text-orientation: upright;margin-right: 5px;">
									{{$t("删除记录")}}
								</text>
							</view>
							<movable-view :x="item.object.summary.ss" :y="item.y" @change="onChange($event,index)"
								:animation='false' style=" width: 100vw;height: auto;" direction="horizontal">
								<view class="icon_item_bg_ssss">
									<view class="icon_item_bg">
										<view class="icon_item_bg_1">
											<image src="../../../static/icons/6.png" class="img_iocn_bg" />
											<view style="margin-top: 10px;text-align: center;width: 60px;">
												{{$t("平均体重")}}
											</view>
										</view>
										<view style="padding-left: 10px;">
											<view
												style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
												<view class="title_type_bg">
													<view v-if="item.object.summary.tizhilists == 0" class="xueya_type"
														style="background: #FCCD41" />
													<view v-else-if="item.object.summary.tizhilists == 1"
														class="xueya_type" style="background: #58BF78" />
													<view v-else-if="item.object.summary.tizhilists == 2"
														class="xueya_type" style="background: #FC7F41" />
													<view v-else-if="item.object.summary.tizhilists == 3"
														class="xueya_type" style="background: #F55A5A" />
													<view v-else-if="item.object.summary.tizhilists == 4"
														class="xueya_type" style="background: #7A0101" />
													<view v-else-if="item.object.summary.tizhilists == 5"
														class="xueya_type" style="background: #333333" />
													<view v-else class="xueya_type" style="background: white;" />
													<view class="title_font_bg">{{item.object.summary.level}}</view>
													<uni-icons type="help" size="15" style=""
														@tap="BMI_tap1"></uni-icons>
												</view>
												<view style="margin-right: 10px; color: gray;">{{item.modelName}}</view>
											</view>
											<view class="border_bg" />
											<view style="display: flex; flex-direction: row; ">
												<view>
													<view class="text_item_bg">{{$t('体重')}}/kg
													</view>
													<view class="text_item_bg_1" style="padding-left: 5px;">
														{{item.object.summary.weightAvg}}
													</view>
												</view>
												<view style="margin-left: 25px;">
													<view class="text_item_bgqqq">BMI</view>
													<view class="text_item_bg_1" style="padding-left: 5px;">
														{{item.object.summary.bmiAvg}}
													</view>
												</view>
												<view style="padding-left: 30px;">
													<view class="text_item_bgqqq"></view>
													<view class="text_item_bg_2qqq">{{item.dateTime}}</view>
												</view>
												<view style="margin-top: 20px; margin-left: 10px;"
													@click="zhankai_cl(index)">
													<view v-if="item.object.summary.ss == true">
														<uni-icons type="top" size="22"></uni-icons>
													</view>
													<view v-else>
														<uni-icons type="bottom" size="22"></uni-icons>
													</view>
												</view>
											</view>

										</view>
									</view>
								</view>
							</movable-view>
						</view>
						<view v-if="item.object.summary.ss == true">
							<movable-area style="width: 90vw;height: auto; margin-top: 20px;"
								v-for="(item1,index1) in item.object.details" :key="index1">
								<view>
									<view class="icon_item_bg_1s">
										<text @tap="tap1($event,index, index1,item.deviceSn,item1.timestamp)"
											style="width: 15px;line-height: 18px; display: flex;flex-direction: row;writing-mode: vertical-lr;text-orientation: upright;margin-right: 5px;">
											{{$t("删除记录")}}
										</text>
									</view>
									<movable-view :x="item1.ss" :y="item1.y" @change="onChange1($event,index,index1)"
										:animation='false' style=" width: 100vw;height: auto;" direction="horizontal">
										<view class="icon_item_bg_ssss">
											<view class="icon_item_bg">
												<view class="icon_item_bg_1">
													<image src="../../../static/icons/6.png" class="img_iocn_bg" />
													<view style="margin-top: 10px;text-align: center;">
														{{item1.time}}
													</view>
												</view>
												<view style="padding-left: 10px;">
													<view
														style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
														<view class="title_type_bg">
															<view v-if="item1.tizhilists1 == 0" class="xueya_type"
																style="background: #FCCD41" />
															<view v-else-if="item1.tizhilists1 == 1" class="xueya_type"
																style="background: #58BF78" />
															<view v-else-if="item1.tizhilists1 == 2" class="xueya_type"
																style="background: #FC7F41" />
															<view v-else-if="item1.tizhilists1 == 3" class="xueya_type"
																style="background: #F55A5A" />
															<view v-else-if="item1.tizhilists1 == 4" class="xueya_type"
																style="background: #7A0101" />
															<view v-else-if="item1.tizhilists1 == 5" class="xueya_type"
																style="background: #333333" />
															<view v-else class="xueya_type"
																style="background: white;" />
															<view class="title_font_bg">{{item1.level1}}</view>
															<uni-icons type="help" size="15" style=""
																@tap="BMI_tap1"></uni-icons>
														</view>
														<view style="margin-right: 10px; color: gray;">
															{{item.modelName}}
														</view>
													</view>
													<view class="border_bg1" />
													<view style="display: flex; flex-direction: row; ">
														<view>
															<view class="text_item_bg">{{$t('体重')}}/kg
															</view>
															<view class="text_item_bg_1" style="padding-left: 5px;">
																{{item1.weight}}
															</view>
														</view>
														<view style="padding-left: 25px;">
															<view class="text_item_bgqqq">BMI</view>
															<view class="text_item_bg_1">{{item1.bmi}}
															</view>
														</view>
														<view style="margin-left: 20px;">
															<view class="text_item_bg"></view>
															<view class="text_item_bg_2">{{item.dateTime}}</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</movable-view>
								</view>
							</movable-area>
						</view>
						<view v-else></view>
					</movable-area>
				</view>
				<view v-else-if="act1 == true">
					<movable-area style="width: 90vw;height: auto; margin-top: 20px;" v-for="(item,index) in swipeList"
						:key="index">
						<view>
							<view class="icon_item_bg_1s">
								<text @tap="tap($event, index,item.deviceSn,item.object.details)"
									style="width: 15px;line-height: 18px; display: flex;flex-direction: row;writing-mode: vertical-lr;text-orientation: upright;margin-right: 5px;">
									{{$t("删除记录")}}
								</text>
							</view>
							<view>
								<view style="margin-left: 11px;">
									<view v-if="item.object.summary.ss == true" class="icon_item_bg_3s">
										<view v-for="(item1,index1) in item.object.details" :key="index1">
											<view style="display: flex;flex-direction: row; padding-bottom: 10px;">
												<view style="margin-top: 10px;width: 25vw;margin-left: 10px;">
													{{item1.time}}
												</view>
												<view style="margin-top: 10px;width: 20vw;">{{item1.weight}}
												</view>
												<view style="margin-top: 10px;width: 20vw;">{{item1.bmi}}
												</view>
												<view style="margin-top: 10px;">{{item.dateTime1}}</view>
											</view>
										</view>
									</view>
									<view v-else></view>
								</view>
								<view v-if="item.object.summary.ss == true">
									<movable-view :x="item.object.summary.ss" :y="item.y"
										@change="onChange($event,index)" :animation='false'
										style=" width: 100vw;height: auto;" direction="horizontal">
										<view class="icon_item_bg_ssss_1">
											<view class="icon_item_bg">
												<view class="icon_item_bg_1">
													<image src="../../../static/icons/6.png" class="img_iocn_bg" />
													<view style="margin-top: 10px;text-align: center;">{{item.dateTime}}
													</view>
												</view>
												<view>
													<view
														style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
														<view class="title_type_bg">
															<view v-if="item.object.summary.tizhilists == 0"
																class="xueya_type" style="background: #FCCD41" />
															<view v-else-if="item.object.summary.tizhilists == 1"
																class="xueya_type" style="background: #58BF78" />
															<view v-else-if="item.object.summary.tizhilists == 2"
																class="xueya_type" style="background: #FC7F41" />
															<view v-else-if="item.object.summary.tizhilists == 3"
																class="xueya_type" style="background: #F55A5A" />
															<view v-else-if="item.object.summary.tizhilists == 4"
																class="xueya_type" style="background: #7A0101" />
															<view v-else-if="item.object.summary.tizhilists == 5"
																class="xueya_type" style="background: #333333" />
															<view v-else class="xueya_type"
																style="background: white;" />
															<view class="title_font_bg">{{item.object.summary.level}}
															</view>
															<uni-icons type="help" size="15" style=""
																@tap="BMI_tap1"></uni-icons>
														</view>
														<view style="margin-right: 10px; color: gray;">
															{{item.modelName}}
														</view>
													</view>
													<view class="border_bg" />
													<view style="display: flex; flex-direction: row; ">
														<view>
															<view class="text_item_bg">{{$t('体重')}}/kg
															</view>
															<view class="text_item_bg_1" style="padding-left: 5px;">
																{{item.object.summary.weightAvg}}
															</view>
														</view>
														<view style="padding-left: 25px;">
															<view class="text_item_bg">BMI</view>
															<view class="text_item_bg_1">{{item.object.summary.bmiAvg}}
															</view>
														</view>
														<view style="margin-left: 20px;">
															<view class="text_item_bg"></view>
															<view class="text_item_bg_2">{{item.dateTime1}}</view>
														</view>
														<view style="margin-top: 20px;margin-left: 10px;"
															@click="zhankai_cl1(index,item.dateTime)">
															<uni-icons type="top" size="22"></uni-icons>
														</view>
													</view>
												</view>
											</view>
										</view>
									</movable-view>
								</view>

								<view v-else>
									<movable-view :x="item.object.summary.ss" :y="item.y"
										@change="onChange($event,index)" :animation='false'
										style=" width: 100vw;height: auto;" direction="horizontal">
										<view class="icon_item_bg_ssss">
											<view class="icon_item_bg">
												<view class="icon_item_bg_1">
													<image src="../../../static/icons/6.png" class="img_iocn_bg" />
													<view style="margin-top: 10px;text-align: center;">{{item.dateTime}}
													</view>
												</view>
												<view style="margin-left: 10px;">
													<view
														style="display: flex;flex-direction: row;justify-content: space-between; align-items: center;">
														<view class="title_type_bg">
															<view v-if="item.object.summary.tizhilists == 0"
																class="xueya_type" style="background: #FCCD41" />
															<view v-else-if="item.object.summary.tizhilists == 1"
																class="xueya_type" style="background: #58BF78" />
															<view v-else-if="item.object.summary.tizhilists == 2"
																class="xueya_type" style="background: #FC7F41" />
															<view v-else-if="item.object.summary.tizhilists == 3"
																class="xueya_type" style="background: #F55A5A" />
															<view v-else-if="item.object.summary.tizhilists == 4"
																class="xueya_type" style="background: #7A0101" />
															<view v-else-if="item.object.summary.tizhilists == 5"
																class="xueya_type" style="background: #333333" />
															<view v-else class="xueya_type"
																style="background: white;" />
															<view class="title_font_bg">{{item.object.summary.level}}
															</view>
															<uni-icons type="help" size="15" style=""
																@tap="BMI_tap1"></uni-icons>
														</view>
														<view style="margin-right: 10px; color: gray;">
															{{item.modelName}}
														</view>
													</view>
													<view class="border_bg" />
													<view style="display: flex; flex-direction: row; ">
														<view>
															<view class="text_item_bg">{{$t('体重')}}/kg
															</view>
															<view class="text_item_bg_1" style="padding-left: 5px;">
																{{item.object.summary.weightAvg}}
															</view>
														</view>
														<view style="padding-left: 25px;">
															<view class="text_item_bg">BMI</view>
															<view class="text_item_bg_1">{{item.object.summary.bmiAvg}}
															</view>
														</view>
														<view style="margin-left: 20px;">
															<view class="text_item_bg"></view>
															<view class="text_item_bg_2">{{item.dateTime1}}</view>
														</view>
														<view style="margin-top: 20px;margin-left: 10px;"
															@click="zhankai_cl1(index,item.dateTime)">
															<view v-if="item.object.summary.ss == true">
																<uni-icons type="top" size="22"></uni-icons>
															</view>
															<view v-else><uni-icons type="bottom" size="22"></uni-icons>
															</view>
														</view>
													</view>
												</view>
											</view>
										</view>
									</movable-view>
								</view>
							</view>
						</view>
					</movable-area>
				</view>
			</view>
		</view>
		<view v-else style="display: flex;justify-content: center;padding-top: 50px;">
			{{$t('暂无数据')}}
		</view>

		<view
			style="background: #F7F7F7; position: fixed; top: 0; left: 0; right: 0; display: flex; justify-content: space-between;height: auto;padding: 60px 10px 10px 10px;">
			<view @click="back()" style="width: 20vw;text-align: left">
				<uni-icons type="left" size="24" color="black"></uni-icons>
			</view>
			<view style="font-size: 18px; font-weight: bold;text-align: center;">{{$t('历史记录')}}</view>
			<view style="display: flex;flex-direction: row;text-align: right;">
				<view @click="clivk_id_1()" class="title_right1" :style="getcolor(act)">{{$t('日历')}}</view>
				<view @click="clivk_id_2()" class="title_right" :style="getcolor1(act1)">{{$t('列表')}}</view>
			</view>
		</view>

		<!-- 血压普通弹窗 -->
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
		<!-- 导出 -->
		<view>
			<uni-popup ref="popup_daochu" :mask-click="true">
				<view class="unipopupstyle">
					<view style="font-size: 16px; font-weight: 600;color: #1A1A1A;">{{$t('导出设置')}}</view>
					<view
						style="display: flex;justify-content: flex-start;font-size: 16px; font-weight: 600;margin-top: 20px;color: #1A1A1A;">
						{{$t('导出格式')}}
					</view>
					<view style="margin-top: 20px;display: flex;flex-direction: row;align-items: center;">
						<checkbox class="round" color="#ffffff" activeBorderColor="#D2D2D2"
							activeBackgroundColor="#3298F7" :checked="ckech_act" style="font-size: 12px;"
							@click="ckech_act_cl()">PDF</checkbox>
						<checkbox class="round" color="#ffffff" activeBorderColor="#D2D2D2"
							activeBackgroundColor="#3298F7" :checked="ckech_act_1"
							style="margin-left: 40px;font-size: 12px;" @click="ckech_act_cl_1()">Excel
						</checkbox>
					</view>
					<view
						style="display: flex;justify-content: space-between;align-items: center; font-size: 18px;margin-top: 20px;">
						<view style="font-size: 16px; font-weight: 600;color: #1A1A1A;">{{$t('测量时间')}}</view>
						<view v-if="shijian" style="color: gray; font-size: 10px; font-weight: 400;">{{$t('注1')}}
						</view>
						<view v-else style="color: red; font-size: 10px;">{{$t('注1')}}
						</view>
					</view>
					<view
						style="display: flex;justify-content: space-between;align-items: center; font-size: 18px; margin-top: 20px;">
						<view style="font-size: 16px; font-weight: 400;">{{$t('开始日期')}}</view>
						<view style="display: flex;flex-direction: row;align-items: center;">
							<picker fields="day" mode="date" :value="date" @change="bindDateChange">
								<view class="uni-input">{{date}}</view>
							</picker>
							<uni-icons type="right" size="16"></uni-icons>
						</view>
					</view>
					<view style="display: flex;justify-content: space-between;align-items: center; font-size: 18px;">
						<view style="font-size: 16px; font-weight: 400;">{{$t('结束日期')}}</view>
						<view style="display: flex;flex-direction: row;align-items: center;">
							<picker fields="day" mode="date" :value="date1" @change="bindDateChange1">
								<view class="uni-input">{{date1}}</view>
							</picker>
							<uni-icons type="right" size="16"></uni-icons>
						</view>
					</view>
					<view v-if="ckech_act == true">
						<button @click="daochu_pdf()" class="buttonstyless1">{{$t('仅导出测量数据')}}</button>
					</view>
					<view v-else>
						<button @click="daochu_pdf1()" class="buttonstyless1">{{$t('仅导出测量数据')}}</button>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- BMI普通弹窗 -->
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view style="border-radius: 20px;background:#fff;padding-bottom: 20px;width: 280px;text-align: center;">
					<view>
						<view style="font-weight: bold;padding-top: 20px;font-size: 16px;">{{$t("BMI分类")}}</view>
						<view style="color: gray;font-size: 12px;margin-top: 10px;">{{$t("根据世界卫生组织的最新BMI分类")}}</view>
						<view
							style="display: flex; flex-direction: row; padding: 5px; align-items: center;margin-top: 20px; margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw">{{$t("BMI范围")}}</view>
							<view style="font-weight: bold;width: 20vw">{{$t("分类")}}</view>
						</view>
						<view
							style="padding: 5px;background: #FCCD41; width: 88%;margin-top: 10px; display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">&lt;18.5</view>
							<view style="font-weight: bold;width: 20vw;color: white;">{{$t("体重过轻")}}</view>
						</view>
						<view
							style="padding: 5px;background: #58BF78; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">18.5-24.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">{{$t("正常体重")}}</view>
						</view>
						<view
							style="padding: 5px;background: #FC7F41; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">{{$t("超重")}}</view>
						</view>
						<view
							style="padding: 5px;background: #F55A5A; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">{{$t("一级肥胖")}}</view>
						</view>
						<view
							style="padding: 5px;background: #7A0101; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 20vw;color: white;">{{$t("二级肥胖")}}</view>
						</view>
						<view
							style="padding: 5px;background: #333333; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: bold;width: 20vw;color: white;">25.0-29.9</view>
							<view style="font-weight: bold;width: 40vw;color: white;">{{$t("三级肥胖或病态肥胖")}}</view>
						</view>
					</view>
					<button @tap="knowe1()"
						style="margin: 40px 50px 20px 50px;border-radius: 20px;background: #3298F7;color: white;">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			let datassss = new Date(new Date().toISOString().slice(0, 10));
			let nowDate = new Date(new Date().toISOString().slice(0, 7));
			let fullYear = nowDate.getFullYear();
			let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
			let endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
			return {
				xueyalist: '',
				xueyalist1: '',
				tizhilists: '',
				tizhilists1: '',
				level: '',
				level1: '',
				level2: '',
				Blood: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa",
				chooseItem_name: this.$t('血压'),
				date: new Date().toISOString().slice(0, 10),
				date1: (datassss.getFullYear() + 1) + '-' + datassss.getMonth() + '-' + (datassss.getDate() < 10 ? "0" +
					datassss.getDate() : datassss.getDate()),
				deviceSn: [],
				//列表数据
				goodsList: [{
						name: this.$t('血压'),
					}, {
						name: this.$t('血氧'),
					}, {
						name: this.$t('心电'),
					}, {
						name: this.$t('体脂'),
					},
					{
						name: this.$t('血糖'),
					},
				],
				ckech_act: true,
				ckech_act_1: false,
				date_list: true,
				dateLabel: new Date().toISOString().slice(0, 7),
				startTime: new Date().toISOString().slice(0, 10) + ' 00:00:00',
				endTime: new Date().toISOString().slice(0, 10) + ' 23:59:59',
				list_date1: fullYear + '-' + month + "-01 00:00:00",
				list_date2: fullYear + '-' + month + "-" + endOfMonth + " 23:59:59",
				act: true,
				act1: false,
				listdat: false,
				xinghao: '',
				swipeList: [],
				swipeList1: [],
				swipeList2: [],
				zhankai: false,
				shijian: true,
				swipeList1111: [],
			}
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t('历史记录')
			})
			that.Blood = uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa"
			that.queryDevices()
			if (that.swipeList == "" || that.swipeList == undefined) {
				that.listdat = false
			} else {
				that.listdat = true
			}

		},

		methods: {
			getdata(data, data1) {
				return {
					background: data === data1 ? "#3298F7" : "#DBDBDB"
				}
			},

			//查询用户的绑定设备
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
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.rows == null) {
									uni.showToast({
										title: that.$t('当前未绑定任何设备'),
										icon: 'none'
									})
								} else {
									if (that.chooseItem_name == that.$t('血压')) {
										that.deviceSn = []
										for (let i = 0; res.data.rows.length > i; i++) {
											that.deviceSn.push(res.data.rows[i].deviceSn)
										}
										that.query_log_v2(that.deviceSn, that.startTime, that
											.endTime)
									} else if (that.chooseItem_name == that.$t('体脂')) {
										that.deviceSn = []
										for (let i = 0; res.data.rows.length > i; i++) {
											that.deviceSn.push(res.data.rows[i].deviceSn)
										}
										that.query_log_v22(that.deviceSn, that.startTime, that
											.endTime)
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

			uuid() {
				return 'xxx-xxx-xxx'.replace(/[xy]/g, c => {
					var r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8)
					return v.toString(16)
				})
			},
			daochu_pdf1() {
				if (this.shijian == true) {
					if (this.chooseItem_name == this.$t('血压')) {
						this.query_log_v2s(this.deviceSn, this.date + " 00:00:00", this.date1 + " 23:59:59")
					} else if (this.chooseItem_name == this.$t('体脂')) {
						this.query_log_v22s(this.deviceSn, this.date + " 00:00:00", this.date1 + " 23:59:59")
					}
				} else {
					uni.showToast({
						title: this.$t("导出的数据时间不能超过一年"),
						icon: 'none'
					})
				}

			},

			// 导出文件到手机 fileData:要写入到文件的数据，返回参数为文档路径
			appExportFile(fileData, documentName = '项目Excel文件') {
				// PUBLIC_DOCUMENTS: 程序公用文档目录常量
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, fs => {
					let rootObj = fs.root,
						fullPath = rootObj.fullPath
					console.log('开始导出数据********')
					// 创建文件夹
					rootObj.getDirectory(documentName, {
						create: true
					}, dirEntry => {
						// 创建文件,防止重名
						let fileName = 'excel' + this.uuid() + '.xlsx'
						dirEntry.getFile(fileName, {
							create: true
						}, fileEntry => {
							fileEntry.createWriter(writer => {
								writer.onwritestart = res => console.log('正在导出')
								//  /storage/emulated/0指的就是系统路径
								let pathStr = fullPath.replace('/storage/emulated/0', '')
								// 成功导出数据
								writer.onwrite = res => {
									// 文件路径
									let filePath = res.target.fileName
									uni.hideLoading()
									setTimeout(() => {
										console.log('成功导出')
										this.successTip = `文件位置：${filePath}`

										uni.openDocument({
											filePath,
											success: res => console
												.log('打开文档成功'),
											fail: err => console.log(
												err)
										})
									}, 500)
								}
								// 写入内容
								writer.write(fileData)
							}, err => console.log(err.message))
						})
					})
				})
			},

			wxExportFile(template, documentName = '项目Excel文件') {
				const fs = wx.getFileSystemManager()
				// 创建文件名字, 防止重名
				let filePath = wx.env.USER_DATA_PATH + '/' + (documentName + this.uuid()) + '.xls'
				fs.writeFile({
					filePath,
					data: template,
					encoding: 'utf8',
					success: res => {

						wx.openDocument({
							filePath,
							showMenu: true, //是否显示右上角菜单
							success: res => console.log('打开文档成功。文件位置', filePath),
							fail: err => console.log(err)
						})
					},
					fail: err => console.info(err)
				})
			},
			daochu_pdf() {
				if (this.shijian == true) {
					this.$refs.popup_daochu.close()
					let items = encodeURIComponent(JSON.stringify(this.deviceSn));
					uni.navigateTo({
						url: '../tendency/yulan?chooseItem_name=' + this.chooseItem_name + "&starttime=" + this
							.date + " 00:00:00&endtime=" + this.date1 + " 23:59:59&deviceSn=" + items
					})
				} else {
					uni.showToast({
						title: this.$t("导出的数据时间不能超过一年"),
						icon: 'none'
					})
				}
			},
			zhankai_cl(id) {
				let that = this
				if (that.swipeList[id].object.summary.ss == '') {
					for (let i = 0; that.swipeList.length > i; i++) {
						if (i == id) {
							that.swipeList[id].object.summary.ss = true
						} else {
							that.swipeList[i].object.summary.ss = false
						}
					}
				} else {
					if (that.swipeList[id].object.summary.ss == true) {
						that.swipeList[id].object.summary.ss = false
					} else {
						that.swipeList[id].object.summary.ss = true
					}
				}
			},
			zhankai_cl1(id, time) {
				let that = this
				if (that.swipeList[id].object.summary.ss == '') {
					for (let i = 0; that.swipeList.length > i; i++) {
						if (i == id) {
							that.swipeList[id].object.summary.ss = true
						} else {
							that.swipeList[i].object.summary.ss = false
						}
					}
				} else {
					if (that.swipeList[id].object.summary.ss == true) {
						that.swipeList[id].object.summary.ss = false
					} else {
						that.swipeList[id].object.summary.ss = true
					}
				}
			},
			bindDateChange(e) {
				this.date = e.detail.value
				if (this.date.slice(0, 4) == this.date1.slice(0, 4)) {
					if (this.date1.slice(5, 7) == this.date.slice(5, 7)) {
						if (this.date1.slice(8, 10) - this.date.slice(8, 10) >= 0) {
							this.shijian = true
						} else {
							this.shijian = false
						}
					} else {
						if (this.date1.slice(5, 7) - this.date.slice(5, 7) < 12 && this.date1.slice(5, 7) -
							this.date.slice(5, 7) >= 0) {
							this.shijian = true
						} else {
							this.shijian = false
						}
					}
				} else {
					if (this.date1.slice(0, 4) - this.date.slice(0, 4) == 1) {
						if (this.date.slice(5, 7) - this.date1.slice(5, 7) >= 1) {
							if (this.date.slice(8, 10) - this.date1.slice(8, 10) >= 0) {
								this.shijian = true
							} else {
								this.shijian = false
							}
						} else {
							this.shijian = false
						}
					} else if (this.date1.slice(0, 4) - this.date.slice(0, 4) > 1) {
						this.shijian = false
					} else {
						this.shijian = false
					}
				}
			},
			bindDateChange1(e) {
				this.date1 = e.detail.value
				if (this.date.slice(0, 4) == this.date1.slice(0, 4)) {
					if (this.date1.slice(5, 7) == this.date.slice(5, 7)) {
						console.log("同月")
						if (this.date1.slice(8, 10) - this.date.slice(8, 10) >= 0) {
							this.shijian = true
						} else {
							this.shijian = false
						}
					} else {
						if (this.date1.slice(5, 7) - this.date.slice(5, 7) < 12 && this.date1.slice(5, 7) -
							this.date.slice(5, 7) >= 0) {
							this.shijian = true
						} else {
							this.shijian = false
						}
					}
				} else {
					if (this.date1.slice(0, 4) - this.date.slice(0, 4) == 1) {
						if (this.date.slice(5, 7) - this.date1.slice(5, 7) >= 1) {
							if (this.date.slice(8, 10) - this.date1.slice(8, 10) >= 0) {
								this.shijian = true
							} else {
								this.shijian = false
							}
						} else {
							this.shijian = false
						}
					} else if (this.date1.slice(0, 4) - this.date.slice(0, 4) > 1) {
						this.shijian = false
					} else {
						this.shijian = false
					}
				}
			},


			ckech_act_cl() {
				this.ckech_act = true
				this.ckech_act_1 = false

			},
			ckech_act_cl_1() {
				this.ckech_act = false
				this.ckech_act_1 = true
			},

			daochu() {
				this.$refs.popup_daochu.open('bottom')
			},

			chooseItem(e) {
				console.log("chooseItem", e.name)
				if (e.name == this.$t('血压')) {
					this.chooseItem_name = this.$t('血压')
					if (this.act1 == true) {
						let nowDate = new Date(new Date().toISOString().slice(0, 7));
						let fullYear = nowDate.getFullYear();
						let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
						let endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
						this.query_log_v2(this.deviceSn, this.dateLabel.slice(0, 7) + "-01 00:00:00", this
							.dateLabel.slice(0, 7) + "-" + endOfMonth + " 23:59:59")
					} else {
						this.queryDevices()
					}
				} else if (e.name == this.$t('体脂')) {
					this.chooseItem_name = this.$t('体脂')
					if (this.act1 == true) {
						let nowDate = new Date(new Date().toISOString().slice(0, 7));
						let fullYear = nowDate.getFullYear();
						let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
						let endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
						this.query_log_v22(this.deviceSn, this.dateLabel.slice(0, 7) + "-01 00:00:00", this
							.dateLabel.slice(0, 7) + "-" + endOfMonth + " 23:59:59")
					} else {
						this.queryDevices()
					}
				} else if (e.name == this.$t('血氧')) {
					this.listdat = false

				} else if (e.name == this.$t('心电')) {
					this.listdat = false
				} else if (e.name == this.$t('血糖')) {
					this.listdat = false
				}
			},

			jianshao() {
				let data = new Date(this.dateLabel)
				let fullYear = data.getFullYear();
				let month = data.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
				let month1 = month - 1
				if (month1 == 0) {
					this.dateLabel = (fullYear - 1) + '-' + 12
				} else {
					this.dateLabel = fullYear + '-' + (month1 < 10 ? "0" + month1 : month1)
				}
				let endOfMonth = new Date(fullYear, month1, 0).getDate(); // 获取本月最后一天
				this.list_date1 = fullYear + '-' + month1 + "-01 00:00:00"
				this.list_date2 = fullYear + '-' + month1 + "-" + endOfMonth + " 23:59:59"
				if (this.chooseItem_name == this.$t('血压')) {
					this.query_log_v2(this.deviceSn, this.list_date1, this.list_date2)
				} else if (this.chooseItem_name == this.$t('体脂')) {
					this.query_log_v22(this.deviceSn, this.list_date1, this.list_date2)
				}
			},

			zengjia() {
				let data = new Date(this.dateLabel)
				let fullYear = data.getFullYear();
				let month = data.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
				let month1 = month + 1
				if (month1 == 13) {
					this.dateLabel = (fullYear + 1) + '-01'
				} else {
					this.dateLabel = fullYear + '-' + (month1 < 10 ? "0" + month1 : month1)
				}
				let endOfMonth = new Date(fullYear, month1, 0).getDate(); // 获取本月最后一天
				this.list_date1 = fullYear + '-' + month1 + "-01 00:00:00"
				this.list_date2 = fullYear + '-' + month1 + "-" + endOfMonth + " 23:59:59"
				if (this.chooseItem_name == this.$t('血压')) {
					this.query_log_v2(this.deviceSn, this.list_date1, this.list_date2)
				} else if (this.chooseItem_name == this.$t('体脂')) {
					this.query_log_v22(this.deviceSn, this.list_date1, this.list_date2)
				}
			},
			change(e) {
				let that = this
				console.log(e.date)
				that.startTime = e.date + " 00:00:00"
				that.endTime = e.date + " 23:59:59"
				if (that.chooseItem_name == that.$t('血压')) {
					that.query_log_v2(that.deviceSn, that.startTime, that.endTime)
				} else if (that.chooseItem_name == that.$t('体脂')) {
					that.query_log_v22(that.deviceSn, that.startTime, that.endTime)
				}
			},
			//历史记录
			get_trend_data222(startTime, endTime) {
				let that = this
				console.log('deviceSn', uni.getStorageSync('deviceSn'))
				console.log('startTime', startTime)
				console.log('endTime', endTime)
				uni.request({
					url: that.$url_query_log,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
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
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList1111 = res.data.data.dataList
							that.xinghao = res.data.data.model
							that.swipeList1111.forEach((item, index) => {
								console.log(item)
								that.swipeList1111[index].time = that.formatDate2(parseInt(item
									.time))
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			//历史记录V2 - 血压
			query_log_v2(deviceSn, startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
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
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							if (res.data.data == "") {
								that.listdat = false
							} else {
								that.listdat = true
								that.swipeList = []
								res.data.data.forEach((item, index) => {
									let lowPressureAvg = res.data.data[index].object.summary.lowPressureAvg
									let highPressureAvg = res.data.data[index].object.summary
										.highPressureAvg
									if ((lowPressureAvg >= 61 && lowPressureAvg <= 80) && (
											highPressureAvg >= 91 && highPressureAvg <= 120)) {
										res.data.data[index].object.summary.level = that.$t("正常血压")
										res.data.data[index].object.summary.xueyalist = 0
									} else if ((lowPressureAvg >= 81 && lowPressureAvg <= 90) || (
											highPressureAvg >= 121 && highPressureAvg <= 140)) {
										res.data.data[index].object.summary.level = that.$t("正常高血压值")
										res.data.data[index].object.summary.xueyalist = 1
									} else if ((lowPressureAvg >= 91 && lowPressureAvg <= 100) || (
											highPressureAvg >= 141 && highPressureAvg <= 160)) {
										res.data.data[index].object.summary.level = that.$t("一级高血压")
										res.data.data[index].object.summary.xueyalist = 2
									} else if ((lowPressureAvg >= 101 && lowPressureAvg <= 110) || (
											highPressureAvg >= 161 && highPressureAvg <= 180)) {
										res.data.data[index].object.summary.level = that.$t("二级高血压")
										res.data.data[index].object.summary.xueyalist = 3
									} else {
										res.data.data[index].object.summary.xueyalist = 4
										res.data.data[index].object.summary.level = that.$t("未知")
									}
									res.data.data[index].object.summary.ss = ''
									res.data.data[index].object.details.forEach((item1, index1) => {
										res.data.data[index].object.details[index1].ss = ''
										let lowPressure = res.data.data[index].object.details[
											index1].lowPressure
										let highPressure = res.data.data[index].object
											.details[index1].highPressure
										if ((lowPressure >= 61 && lowPressure <= 80) && (
												highPressure >= 91 && highPressure <= 120)) {
											res.data.data[index].object.details[index1].level2 =
												that.$t("正常血压")
											res.data.data[index].object.details[index1]
												.xueyalist1 = 0
										} else if ((lowPressure >= 81 && lowPressure <=
												90) || (
												highPressure >= 121 && highPressure <= 140)) {
											res.data.data[index].object.details[index1].level2 =
												that.$t("正常高血压值")
											res.data.data[index].object.details[index1]
												.xueyalist1 = 1
										} else if ((lowPressure >= 91 && lowPressure <=
												100) || (
												highPressure >= 141 && highPressure <= 160)) {
											res.data.data[index].object.details[index1].level2 =
												that.$t("一级高血压")
											res.data.data[index].object.details[index1]
												.xueyalist1 = 2
										} else if ((lowPressure >= 101 && lowPressure <=
												110) || (
												highPressure >= 161 && highPressure <= 180)) {
											res.data.data[index].object.details[index1].level2 =
												that.$t("二级高血压")
											res.data.data[index].object.details[index1]
												.xueyalist1 = 3
										} else {
											res.data.data[index].object.details[index1]
												.xueyalist1 = 4
											res.data.data[index].object.details[index1].level2 =
												that.$t("未知")
										}
									})
									that.swipeList.push(res.data.data[index])
									if (that.act1 == true) {
										res.data.data[index].dateTime = res.data.data[index].dateTime
											.slice(5, 10).replace('-', '.').replace('-', '.')
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
				})
			},
			//历史记录V2 - 体脂
			query_log_v22(deviceSn, startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						dataType: "weight",
						slaveList: [{
							slaveSn: "0",
							register: "weight"
						}],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							if (res.data.data == "") {
								that.listdat = false
							} else {
								that.listdat = true
								that.swipeList = []
								res.data.data.forEach((item, index) => {
									res.data.data[index].dateTime = res.data.data[index].dateTime
										.replace(
											"-", ".").replace("-", ".")
									res.data.data[index].object.summary.ss = ''
									if (res.data.data[index].object.summary.bmiAvg < 18.5) {
										res.data.data[index].object.summary.level = that.$t("体重过轻")
										res.data.data[index].object.summary.tizhilists = 0
									} else if (res.data.data[index].object.summary.bmiAvg >= 18.5 && res
										.data.data[index].object.summary.bmiAvg <= 24.9) {
										res.data.data[index].object.summary.level = that.$t("正常体重")
										res.data.data[index].object.summary.tizhilists = 1
									} else if (res.data.data[index].object.summary.bmiAvg >=
										25.0 && res
										.data.data[index].object.summary.bmiAvg <= 29.9) {
										res.data.data[index].object.summary.level = that.$t("超重")
										res.data.data[index].object.summary.tizhilists = 2
									} else if (res.data.data[index].object.summary.bmiAvg >=
										30.0 && res
										.data.data[index].object.summary.bmiAvg <= 34.9) {
										res.data.data[index].object.summary.level = that.$t("一级肥胖")
										res.data.data[index].object.summary.tizhilists = 3
									} else if (res.data.data[index].object.summary.bmiAvg >=
										35.0 && res
										.data.data[index].object.summary.bmiAvg <= 39.9) {
										res.data.data[index].object.summary.level = that.$t("二级肥胖")
										res.data.data[index].object.summary.tizhilists = 4
									} else if (res.data.data[index].object.summary.bmiAvg >=
										40) {
										res.data.data[index].object.summary.level = that.$t("三级肥胖或病态肥胖")
										res.data.data[index].object.summary.tizhilists = 5
									} else {
										res.data.data[index].object.summary.level = that.$t("未知")
										res.data.data[index].object.summary.tizhilists = 6
									}
									res.data.data[index].object.details.forEach((item1,
										index1) => {
										res.data.data[index].object.details[index1].ss = ''
										if (res.data.data[index].object.details[index1].bmi <
											18.5) {
											res.data.data[index].object.details[index1].level1 =
												that.$t("体重过轻")
											res.data.data[index].object.details[index1]
												.tizhilists1 = 0
										} else if (res.data.data[index].object.details[index1]
											.bmi >= 18.5 && res.data.data[index].object.details[
												index1].bmi <= 24.9) {
											res.data.data[index].object.details[index1].level1 =
												that.$t("正常体重")
											res.data.data[index].object.details[index1]
												.tizhilists1 = 1
										} else if (res.data.data[index].object.details[index1]
											.bmi >= 25.0 && res.data.data[index].object.details[
												index1].bmi <= 29.9) {
											res.data.data[index].object.details[index1].level1 =
												that.$t("超重")
											res.data.data[index].object.details[index1]
												.tizhilists1 = 2
										} else if (res.data.data[index].object.details[index1]
											.bmi >= 30.0 && res.data.data[index].object.details[
												index1].bmi <= 34.9) {
											res.data.data[index].object.details[index1].level1 =
												that.$t("一级肥胖")
											res.data.data[index].object.details[index1]
												.tizhilists1 = 3
										} else if (res.data.data[index].object.details[index1]
											.bmi >= 35.0 && res.data.data[index].object.details[
												index1].bmi1 <= 39.9) {
											res.data.data[index].object.details[index1].level1 =
												that.$t("二级肥胖")
											res.data.data[index].object.details[index1]
												.tizhilists1 = 4
										} else if (res.data.data[index].object.details[index1]
											.bmi >= 40) {
											res.data.data[index].object.details[index1].level1 =
												that.$t("三级肥胖或病态肥胖")
											res.data.data[index].object.details[index1]
												.tizhilists1 = 5
										} else {
											res.data.data[index].object.details[index1].level1 =
												that.$t("未知")
											res.data.data[index].object.details[index1]
												.tizhilists1 = 6
										}
									})
									console.log("dsahdas", res.data.data[index])
									that.swipeList.push(res.data.data[index])
									if (that.act1 == true) {
										let timss = res.data.data[index].dateTime
										res.data.data[index].dateTime = res.data.data[index]
											.dateTime.slice(5, 10)
										res.data.data[index].dateTime1 = timss
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
				})
			},

			//历史记录V2 - 血压
			query_log_v2s(deviceSn, startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
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
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList1111 = []
							res.data.data.forEach((item, index) => {
								res.data.data[index].object.details.forEach((item1, index1) => {
									res.data.data[index]
										.object.details[index1].dateTime = res.data
										.data[index].dateTime
									res.data.data[index]
										.object.details[index1].modelName = res.data
										.data[index].modelName
									res.data.data[index]
										.object.details[index1].deviceSn = res.data
										.data[index].deviceSn
									res.data.data[index]
										.object.details[index1].highPressureAvg = res.data
										.data[index].object
										.summary.highPressureAvg
									res.data.data[index]
										.object.details[index1].lowPressureAvg = res
										.data.data[index].object
										.summary.lowPressureAvg
									res.data.data[index]
										.object.details[index1].heartrateAvg = res.data
										.data[
											index].object
										.summary.heartrateAvg
									res.data.data[index].object
										.details[index1].time1 = res.data.data[index]
										.object
										.details[index1].time
									res.data.data[index]
										.object.details[index1].highPressure1 = res.data
										.data[
											index]
										.object.details[index1].highPressure
									res.data.data[index]
										.object.details[index1].lowPressure1 = res.data
										.data[
											index]
										.object.details[index1].lowPressure
									res.data.data[index]
										.object.details[index1].heartrate1 = res.data.data[
											index]
										.object.details[index1].heartrate

									that.$delete(res.data.data[index].object.details[
											index1],
										"lowPressure")
									that.$delete(res.data.data[index].object.details[
											index1],
										"heartrate")
									that.$delete(res.data.data[index].object.details[
											index1],
										"time")
									that.$delete(res.data.data[index].object.details[
											index1],
										"highPressure")

									that.swipeList1111.push(res.data.data[index]
										.object.details[index1])
								})
							})
							// 要导出的json数据
							const jsonData = that.swipeList1111
							// 列标题
							let worksheet = 'sht1'
							let str =
								'<tr><td style="text-align: center">日期</td><td style="text-align: center">设备型号</td><td style="text-align: center">设备sn</td><td style="text-align: center">平均收缩压/mmHg</td><td style="text-align: center">平均舒张压/mmHg</td><td style="text-align: center">平均脉搏/BPM</td><td style="text-align: center">时间</td><td style="text-align: center">收缩压/mmHg</td><td style="text-align: center">舒张压/mmHg</td><td style="text-align: center">脉搏/BPM</td></tr>'
							// 循环遍历，每行加入tr标签，每个单元格加td标签
							for (let i = 0; i < jsonData.length; i++) {
								str += '<tr>'
								for (let item in jsonData[i]) {
									// 增加\t为了不让表格显示科学计数法或者其他格式
									str += `<td>${jsonData[i][item] + '\t'}</td>`
								}
								str += '</tr>'
							}
							that.$refs.popup_daochu.close()
							// 下载的表格模板数据
							let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
															    xmlns:x="urn:schemas-microsoft-com:office:excel" 
															    xmlns="http://www.w3.org/TR/REC-html40">
															    <head><!--[if gte mso 9]><xml encoding="UTF-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
															    <x:Name>${worksheet}</x:Name>
															    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
															    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
															    </head><body><table>${str}</table></body></html>`
							// 下载模板
							// #ifdef APP-PLUS
							that.appExportFile(template)
							// #endif
							// 下载模板
							// #ifdef MP-WEIXIN
							that.wxExportFile(template)
							// #endif
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//历史记录V2 - 体脂
			query_log_v22s(deviceSn, startTime, endTime) {
				let that = this
				console.log('deviceSndadadasdada', deviceSn)
				console.log('startTimedadadadada', startTime)
				console.log('endTimedadadadadada', endTime)
				uni.request({
					url: that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						dataType: "weight",
						slaveList: [{
							slaveSn: "0",
							register: "weight"
						}],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList1111 = []
							res.data.data.forEach((item, index) => {
								res.data.data[index].object.details.forEach((item1, index1) => {
									res.data.data[index]
										.object.details[index1].dateTime = res.data.data[
											index]
										.dateTime
									res.data.data[index]
										.object.details[index1].modelName = res.data.data[
											index].modelName
									res.data.data[index]
										.object.details[index1].deviceSn = res.data.data[
											index]
										.deviceSn
									res.data.data[index]
										.object.details[index1].weightAvg = res.data.data[
											index].object.summary
										.weightAvg
									res.data.data[index]
										.object.details[index1].bmiAvg = res.data.data[
											index]
										.object.summary.bmiAvg

									res.data.data[index]
										.object.details[index1].time1 = res.data.data[
											index]
										.object.details[index1].time
									res.data.data[index]
										.object.details[index1].weight1 = res.data.data[
											index]
										.object.details[index1].weight
									res.data.data[index]
										.object.details[index1].bmi1 = res.data.data[index]
										.object.details[index1].bmi

									that.$delete(res.data.data[index].object.details[
											index1],
										"weight")
									that.$delete(res.data.data[index].object.details[
											index1],
										"time")
									that.$delete(res.data.data[index].object.details[
											index1],
										"bmi")

									that.swipeList1111.push(res.data.data[index]
										.object.details[index1])
								})

								console.log("dsajkhsahdas体重", that.swipeList1111)
							})
							// 要导出的json数据
							const jsonData = that.swipeList1111
							// 列标题
							let worksheet = 'sht1'
							let str =
								'<tr><td style="text-align: center">日期</td><td style="text-align: center">型号</td><td style="text-align: center">设备sn</td><td style="text-align: center">平均体重/kg</td><td style="text-align: center">平均BMI</td><td style="text-align: center">时间</td><td style="text-align: center">体重/kg</td><td style="text-align: center">BMI</td></tr>'
							for (let i = 0; i < jsonData.length; i++) {
								str += '<tr>'
								for (let item in jsonData[i]) {
									// 增加\t为了不让表格显示科学计数法或者其他格式
									str += `<td>${jsonData[i][item] + '\t'}</td>`
								}
								str += '</tr>'
							}
							that.$refs.popup_daochu.close()
							// 下载的表格模板数据
							let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
															    xmlns:x="urn:schemas-microsoft-com:office:excel" 
															    xmlns="http://www.w3.org/TR/REC-html40">
															    <head><!--[if gte mso 9]><xml encoding="UTF-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
															    <x:Name>${worksheet}</x:Name>
															    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
															    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
															    </head><body><table>${str}</table></body></html>`
							// 下载模板
							// #ifdef APP-PLUS
							that.appExportFile(template)
							// #endif
							// 下载模板
							// #ifdef MP-WEIXIN
							that.wxExportFile(template)
							// #endif
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			//历史记录
			get_trend_data(startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_query_log,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
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
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							if (res.data.data.dataList == "") {
								that.listdat = false
							} else {
								that.listdat = true
								that.swipeList = res.data.data.dataList
								that.xinghao = res.data.data.model
								that.swipeList.forEach((item, index) => {
									console.log(item)
									if (that.chooseItem_name == that.$t('血压')) {
										that.swipeList[index].time = that.formatDate(parseInt(item
											.time))
										if (that.act1 == true) {
											that.get_trend_data2(that.dateLabel.slice(0, 4) + "-" +
												that
												.swipeList[index].time.replace("月", "-")
												.replace("日", "") +
												" 00:00:00", that.dateLabel.slice(0, 4) + "-" +
												that
												.swipeList[index].time.replace("月", "-")
												.replace("日", "") +
												" 23:59:59")
										}
									} else if (that.chooseItem_name == that.$t('体脂')) {
										let times = that.formatDate_tz(parseInt(item.time)).slice(
											0, 10).replace("年", ".").replace("月", ".").replace(
											"日", "")
										that.swipeList[index].time = that.formatDate(parseInt(
											item.time))
										that.swipeList[index].times = times
										if (that.act1 == true) {
											that.get_trend_data2(that.dateLabel.slice(0, 4) + "-" +
												that
												.swipeList[index].time.replace("月", "-")
												.replace("日", "") +
												" 00:00:00", that.dateLabel.slice(0, 4) + "-" +
												that
												.swipeList[index].time.replace("月", "-")
												.replace("日", "") +
												" 23:59:59")
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
				})
			},

			//历史记录
			get_trend_data1(startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_query_log,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
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
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList1 = res.data.data.dataList
							that.swipeList1.forEach((item, index) => {
								console.log(item)
								if (that.chooseItem_name == that.$t('血压')) {
									that.swipeList1[index].time = that.formatDate(parseInt(item
										.time))
								} else if (that.chooseItem_name == that.$t('体脂')) {
									let times = that.formatDate_tz(parseInt(item.time)).slice(
										0, 10)
									that.swipeList1[index].time = that.formatDate_tz(parseInt(
										item
										.time)).slice(
										10)
									that.swipeList1[index].times = times
								}
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			get_trend_data2(startTime, endTime) {
				let that = this
				uni.request({
					url: that.$url_query_log,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync('deviceSn'),
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
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList2 = []
							that.swipeList2 = res.data.data.dataList
							that.swipeList2.forEach((item, index) => {
								console.log(item)
								if (that.chooseItem_name == that.$t('血压')) {
									that.swipeList2[index].time = that.formatDate1(parseInt(item.time))
								} else if (that.chooseItem_name == that.$t('体脂')) {
									let times = that.formatDate_tz(parseInt(item.time)).slice(0, 10)
										.replace("年", ".").replace("月", ".").replace("日", "")
									that.swipeList2[index].time = that.formatDate1(parseInt(item.time))
									that.swipeList2[index].times = times
								}
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			formatDate_tz(value) {
				console.log(value)
				let date = new Date(value * 1000);
				//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM; //月补0
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d; //天补0
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h; //小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m; //分钟补0
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s; //秒补0
				console.log(y + "|" + MM + "|" + d + "|" + h)
				let formattedTime
				if (this.act == true) {
					formattedTime = `${y}.${MM}.${d} ${h}:${m}`;
				} else {
					formattedTime = `${y}年${MM}月${d}日`;
				}
				return formattedTime;
			},

			//时间戳转时间
			formatDate(value) {
				const data = new Date(value * 1000);
				const year = data.getFullYear();
				const month = (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
				const day = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
				const hours = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
				const minutes = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
				const seconds = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
				let formattedTime
				if (this.act == true) {
					formattedTime = `${hours}:${minutes}`;
				} else {
					formattedTime = `${month}月${day}日`;
				}
				return formattedTime;
			},
			formatDate1(value) {
				const data = new Date(value * 1000);
				const year = data.getFullYear();
				const month = (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
				const day = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
				const hours = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
				const minutes = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
				const seconds = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
				let formattedTime = `${hours}:${minutes}`
				return formattedTime;
			},

			formatDate2(value) {
				const data = new Date(value * 1000);
				const year = data.getFullYear();
				const month = (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
				const day = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
				const hours = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
				const minutes = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
				const seconds = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
				let formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`
				return formattedTime;
			},


			//返回
			back() {
				uni.navigateBack()
			},

			clivk_id_1() {
				let that = this
				that.act = true
				that.act1 = false
				that.date_list = true
				if (that.chooseItem_name == that.$t('血压')) {
					that.query_log_v2(that.deviceSn, that.startTime, that.endTime)
				} else if (that.chooseItem_name == that.$t('体脂')) {
					that.query_log_v22(that.deviceSn, that.startTime, that.endTime)
				}
			},
			clivk_id_2() {
				let that = this
				that.act = false
				that.act1 = true
				that.date_list = false
				if (that.chooseItem_name == that.$t('血压')) {
					that.query_log_v2(that.deviceSn, that.list_date1, that.list_date2)
				} else if (that.chooseItem_name == that.$t('体脂')) {
					that.query_log_v22(that.deviceSn, that.list_date1, that.list_date2)
				}
			},

			getcolor(id) {
				return {
					color: id === true ? '#3298F7' : 'black'
				}
			},
			getcolor1(id) {
				return {
					color: id === true ? '#3298F7' : 'black'
				}
			},

			tap(e, index, deviceSn, details) {
				let timestamp = []
				for (let i = 0; details.length > i; i++) {
					timestamp.push(parseInt(details[i].timestamp))
				}
				this.batch_del_data_log2(index, deviceSn, timestamp)
			},

			tap1(e, index, index1, deviceSn, timestamp) {
				this.batch_del_data_log(index, index1, deviceSn, timestamp)
			},


			//删除历史记录
			batch_del_data_log(index, index1, deviceSn, timestamp) {
				let that = this
				uni.request({
					url: that.$url_batch_del_data_log,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						timeList: [timestamp]
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList[index].object.details.splice(index1, 1)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			//删除大的历史记录
			batch_del_data_log2(index, deviceSn, timestamp) {
				let that = this
				uni.request({
					url: that.$url_batch_del_data_log,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						timeList: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							that.swipeList.splice(index, 1)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			onChange(e, index) {
				this.swipeList.forEach((item, index) => {
					this.swipeList[index].object.summary.ss = 0
				})
				this.swipeList[index].object.summary.ss = e.detail.x

			},
			onChange1(e, index, index1) {
				console.log("aaa", e)
				console.log("aa1a", index)
				this.swipeList[index].object.details.forEach((item11, index11) => {
					this.swipeList[index].object.details[index11].ss = 0
				})
				this.swipeList[index].object.details[index1].ss = e.detail.x
			},
			BMI_tap() {
				this.$refs.popup.open("center")
			},

			knowe() {
				this.$refs.popup.close()
			},

			BMI_tap1() {
				this.$refs.popup1.open("center")
			},

			knowe1() {
				this.$refs.popup1.close()
			},

			bg(lowPressureAvg, highPressureAvg) {
				let that = this
				if ((lowPressureAvg >= 61 && lowPressureAvg <= 80) && (highPressureAvg >= 91 && highPressureAvg <= 120)) {
					that.level = that.$t("正常血压")
					return {
						background: "#58BF78"
					}
				} else if ((lowPressureAvg >= 81 && lowPressureAvg <= 90) || (highPressureAvg >= 121 && highPressureAvg <=
						140)) {
					that.level = that.$t("正常高血压值")
					return {
						background: "#FFEC01"
					}
				} else if ((lowPressureAvg >= 91 && lowPressureAvg <= 100) || (highPressureAvg >= 141 && highPressureAvg <=
						160)) {
					that.level = that.$t("一级高血压")
					return {
						background: "#FCCD41"
					}
				} else if ((lowPressureAvg >= 101 && lowPressureAvg <= 110) || (highPressureAvg >= 161 &&
						highPressureAvg <= 180)) {
					that.level = that.$t("二级高血压")
					return {
						background: "#F55A5A"
					}
				} else {
					that.level = that.$t("未知")
					return {
						background: '#FFFFFF'
					}
				}
			},
			bg_tizhi(bg) {
				if (bg < 18.5) {
					this.level = that.$t("体重过轻")
					return {
						background: "#FCCD41"
					}
				} else if (bg >= 18.5 && bg <= 24.9) {
					this.level = that.$t("正常体重")
					return {
						background: "#58BF78"
					}
				} else if (bg >= 25.0 && bg <= 29.9) {
					this.level = that.$t("超重")
					return {
						background: "#FC7F41"
					}
				} else if (bg >= 30.0 && bg <= 34.9) {
					this.level = that.$t("一级肥胖")
					return {
						background: "#F55A5A"
					}
				} else if (bg >= 35.0 && bg <= 39.9) {
					this.level = that.$t("二级肥胖")
					return {
						background: "#7A0101"
					}
				} else if (bg >= 40) {
					this.level = that.$t("三级肥胖或病态肥胖")
					return {
						background: "#333333"
					}
				} else {
					this.level = that.$t("未知")
					return {
						background: '#FFFFFF'
					}
				}
			},

		}
	}
</script>



<style>
	.scroll-view_H {
		padding-top: 60px;
		white-space: nowrap;
		width: 100vw;
	}

	.icon_item_bg_1s {
		width: 90vw;
		height: 116px;
		border: 1px solid white;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-direction: row;
		margin: 0 10px 0 10px;
		padding: 10px 10px 5px 5px;
		border-radius: 20px;
		background: red;
		color: white;
	}

	.icon_item_bg_3s {
		width: 91vw;
		flex-direction: column;
		padding: 0 10px 6px 6px;
		border-radius: 0 0 20px 20px;
		background: white;
		color: black;
	}

	.time_text {
		background: #0686CC;
		width: 60px;
		text-align: center;
		padding: 5px;
		color: white;
		border-top-left-radius: 25px;
		border-bottom-right-radius: 25px;
	}

	.text_item_bg {
		font-size: 10px;
		font-weight: 400;
		margin-left: 5px;
		margin-right: 5px;
		color: #999999;
		margin-top: 5px;
	}

	.text_item_bgqqq {
		font-size: 10px;
		margin-left: 5px;
		margin-right: 5px;
		color: #999999;
		font-weight: 400;
		margin-top: 5px;
	}

	.text_item_bg_1 {
		font-size: 16px;
		text-align: left;
		font-weight: 400;
		margin-top: 10px;
		margin-left: 5px;
		color: #1A1A1A;
	}

	.icon_item_bg_ssss {
		height: 115px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 0 10px 0 10px;
		padding: 10px 5px 10px 5px;
		background: white;
		border-radius: 20px;
	}

	.icon_item_bg_ssss_1 {
		width: auto;
		height: 116px;
		display: flex;
		flex-direction: column;
		margin: 0 10px 0 10px;
		padding: 10px 5px 20px 5px;
		background: white;
		border-radius: 20px 20px 0 0;
	}


	.icon_item_bg {
		height: 116px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}


	.text_item_bg_2 {
		font-size: 16px;
		margin-left: 10px;
		color: gray;
		margin-top: 20px;
	}

	.text_item_bg_2qqq {
		font-size: 16px;
		/* margin-left: 10px; */
		color: gray;
		margin-top: 20px;
	}

	.icon_item_bg_1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
	}

	.img_iocn_bg {
		width: 48px;
		height: 48px;
	}

	.title_type_bg {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.xueya_type {
		width: 14px;
		height: 14px;
		border-radius: 10px;
		background: #258C41;
		margin-left: 10px;
	}

	.border_bg {
		margin: 5px 10px 0 5px;
		background: gainsboro;
		width: 70vw;
		height: 1px;
	}

	.border_bg1 {
		margin: 5px 10px 0 5px;
		background: gainsboro;
		width: 70vw;
		height: 1px;
	}

	.title_font_bg {
		margin-left: 5px;
		font-size: 14px;
		font-weight: 400
	}

	.title_right {
		margin-left: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.title_right1 {
		font-size: 16px;
		font-weight: bold;
	}


	/*横向滚动操作*/
	.lxy-content {
		width: 100%;
		height: 100rpx;
		box-sizing: border-box;
		position: fixed;
		top: 445rpx;

		.content-scroll {
			height: 100rpx;
			white-space: nowrap;

			.scroll-item {
				height: 64rpx;
				line-height: 62rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
				display: inline-block;
				text-align: center;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #666666;
				margin-left: 28rpx;
				padding: 0 24rpx;

				&.active {
					background: #2851F3;
					color: #FFFFFF;
				}
			}

			.scroll-item:last-child {
				margin-right: 28rpx;
			}
		}
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.buttonstyless1 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin: 20px 20px 0 20px;
		border-radius: 100px;
		background: #3298F7;
		color: white;
		font-size: 16px;
		font-weight: 600;
	}

	.buttonstyless2 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin: 20px 20px 20px 20px;
		border-radius: 100px;
		background: #3298F7;
		color: white !important;
		border: none !important;
		font-size: 16px;
		font-weight: 600;
	}

	.unipopupstyle {
		width: auto;
		border-radius: 17px;
		background: #fff;
		margin: 0 20px 60px 20px;
		padding: 20px;
		text-align: center;
		padding-bottom: 20px;
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