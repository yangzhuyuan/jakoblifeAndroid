<template>
	<view style="padding-top: 83px;padding-bottom: 108px;background: white;">
		<view class="pagecontext">
			<view style=" font-size: 6.5px; font-weight: 600; color:red; ">{{$t("请注意")}}</view>
			<view style="background: black; height: 2px; width: auto;margin-top: 10px;"></view>
			<view class="txtetitlestyle">
				<view style="font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("血压分析和建议")}}</view>
			</view>
			<view style="border: 1px solid black;margin-top: 20px; padding: 10px;"
				v-if="gaoya!==0&&fenxi===''&&fenxi1===''&&fenxi2===''&&fenxi3===''&&fenxi4===''&&fenxi5===''&&fenxi6===''&&fenxi7===''&&fenxi8===''&&fenxi9===''&&fenxi10===''&&fenxi11===''&&fenxi12===''&&fenxi13===''&&fenxi14===''&&fenxi15===''">
				{{$t("您的身体健康暂无分析数据")}}
			</view>
			<view v-else style="border: 1px solid black;margin-top: 20px;">
				<view style="padding:10px;font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("分析")}}</view>
				<view style="padding-left: 10px;padding-right: 10px; font-size: 10px; color: #040000;">
					<view class="analysis-container">
						<text>{{fenxi}}</text>
						<text>{{fenxi1}}</text>
						<text>{{fenxi2}}</text>
						<text>{{fenxi3}}</text>
						<view v-show="fenxi4!==''"
							style="color: #040000;display: flex;flex-direction: row;align-items: center;">
							{{fenxi4}}
							<view class="toggle-button" @click="toggleExpand">
								{{isExpanded ? $t("收起") : $t("展开更多")}}
							</view>
						</view>
						<text class="text-content" :class="{'expanded': isExpanded}" space="pre-wrap" selectable="true">
							{{isExpanded ?  $t("分析777"): ""}}
						</text>
						<text>{{fenxi5}}</text>
						<text>{{fenxi6}}</text>
						<text>{{fenxi7}}</text>
						<text>{{fenxi8}}</text>
						<text>{{fenxi9}}</text>
						<text>{{fenxi10}}</text>
						<text>{{fenxi11}}</text>
						<text>{{fenxi12}}</text>
						<text>{{fenxi13}}</text>
						<text>{{fenxi14}}</text>
						<text>{{fenxi15}}</text>
					</view>
				</view>
				<view style="padding:10px;font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("建议")}}</view>
				<view style="padding:0 10px 10px 10px; font-size: 10px; color: #040000;">
					<view v-if="jianyi === jianyi1">
						<text>{{jianyi}}</text>
						<view v-show="jianyi2!==''" style="color: #040000;font-weight: 600;">{{$t("血压负荷")}}:</view>
						<text>{{jianyi2}}</text>
						<view v-show="jianyi3!==''" style="color: #040000;font-weight: 600;">{{$t("血压负荷")}}:</view>
						<text>{{jianyi3}}</text>
						<view v-show="jianyi4!==''" style="color: #040000;font-weight: 600;">{{$t("动脉硬化指数")}}:
						</view>
						<text>{{jianyi4}}</text>
						<view v-show="jianyi5!==''" style="color: #040000;font-weight: 600;">{{$t("均值")}}:</view>
						<text>{{jianyi5}}</text>
						<view v-show="jianyi6!==''" style="color: #040000;font-weight: 600;">24h:{{$t("有效测量次数")}}:
						</view>
						<text>{{jianyi6}}</text>
						<view v-show="jianyi7!==''" style="color: #040000;font-weight: 600;">
							{{$t("白天清醒时段")}}{{$t("有效测量次数")}}:
						</view>
						<text>{{jianyi7}}</text>
						<view v-show="jianyi8!==''" style="color: #040000;font-weight: 600;">
							{{$t("夜间睡眠时段")}}{{$t("有效测量次数")}}:
						</view>
						<text>{{jianyi8}}</text>
					</view>
					<view v-else>
						<view v-show="jianyi!==''" style="color: #040000;font-weight: 600;">
							{{$t("收缩压")}}{{$t("夜间血压下降率")}}:
						</view>
						<text>{{jianyi}}</text>
						<view v-show="jianyi1!==''" style="color: #040000;font-weight: 600;">
							{{$t("舒张压")}}{{$t("夜间血压下降率")}}:
						</view>
						<text>{{jianyi1}}</text>
						<view v-show="jianyi2!==''" style="color: #040000;font-weight: 600;">{{$t("血压负荷")}}:</view>
						<text>{{jianyi2}}</text>
						<view v-show="jianyi3!==''" style="color: #040000;font-weight: 600;">{{$t("血压晨峰")}}:</view>
						<text>{{jianyi3}}</text>
						<view v-show="jianyi4!==''" style="color: #040000;font-weight: 600;">{{$t("动脉硬化指数")}}:
						</view>
						<text>{{jianyi4}}</text>
						<view v-show="jianyi5!==''" style="color: #040000;font-weight: 600;">{{$t("均值")}}:</view>
						<text>{{jianyi5}}</text>
						<view v-show="jianyi6!==''" style="color: #040000;font-weight: 600;">24h:{{$t("有效测量次数")}}:
						</view>
						<text>{{jianyi6}}</text>
						<view v-show="jianyi7!==''" style="color: #040000;font-weight: 600;">
							{{$t("白天清醒时段")}}{{$t("有效测量次数")}}:
						</view>
						<text>{{jianyi7}}</text>
						<view v-show="jianyi8!==''" style="color: #040000;font-weight: 600;">
							{{$t("夜间睡眠时段")}}{{$t("有效测量次数")}}:
						</view>
						<text>{{jianyi8}}</text>
					</view>
				</view>
				<view v-if="idsss !== '1'&&idsss !== '2'&& shebei===0&&gaoya===0"
					style="padding:0 10px;font-size: 14px;font-weight: 600;color: #3298F7;">
					{{$t("提示")}}
				</view>
				<view v-else-if="idsss !== '1'&&idsss !== '2'&& shebei===1&&gaoya===0"
					style="padding:0 10px;font-size: 14px;font-weight: 600;color: #3298F7;">
					{{$t("提示")}}
				</view>
				<view style="padding: 10px;color: #040000;font-weight: 600;font-size: 10px;"
					v-if="idsss !== '1'&&idsss !== '2'&& shebei===0&&gaoya===0">
					{{$t("提示检测到血压偏高")}}
				</view>
				<view style="padding: 10px;color: #040000;font-weight: 600;font-size: 10px;"
					v-else-if="idsss !== '1'&&idsss !== '2'&&shebei===1&&gaoya===0">
					{{$t("提示检测到血压偏高1")}}
				</view>
			</view>
			<view style="background: black; height: 2px; width: auto;margin-top: 10px;"></view>
			<view class="txtetitlestyle">
				<view class="texttitle">
					<view class="text1style">{{$t('姓名')}}:</view>
					<view class="text2style">{{name}}</view>
				</view>
				<view class="texttitle">
					<view class="text1style">{{$t('性别')}}:</view>
					<view class="text2style">{{sex}}</view>
				</view>
				<view class="texttitle">
					<view class="text1style">{{$t('年龄')}}:</view>
					<view class="text2style">{{age}}</view>
				</view>
			</view>
			<view style="background: #969799; height: 1px; width: auto;margin-top: 10px;"></view>
			<view class="txtetitlestyle">
				<view class="texttitle">
					<view class="text1style">{{$t('日期')}}:</view>
					<view class="text2style">{{pacitime}}</view>
				</view>
				<view class="texttitle">
					<view class="text1style">{{$t('检测设备')}}:</view>
					<view class="text2style">{{Testing_equipment}}</view>
				</view>
				<view class="texttitle">
					<view class="text1style">{{$t('是否午休')}}:</view>
					<view class="text2style">{{Whether_to_take}}</view>
				</view>
			</view>
			<view style="background: #969799; height: 1px; width: auto;margin-top: 10px;"></view>
			<view class="txtetitlestyle">
				<view class="texttitle">
					<view class="text1style">{{$t('午休时长')}}:</view>
					<view class="text2style">{{Lunch_break}}</view>
				</view>
				<view class="texttitle">
					<view class="text1style">{{$t('是否服用药物')}}:</view>
					<view class="text2style">{{medication}}</view>
				</view>
				<view class="texttitle">
					<!-- <view class="text1style">{{$t('当前用药')}}:</view>
					<view class="text2style">{{Current_medication}}</view> -->
				</view>
			</view>
			<view style="background: #969799; height: 1px; width: auto;margin-top: 10px;"></view>
			<view class="txtetitlestyle">
				<view class="texttitle">
					<view class="text1style">{{$t('起床时间')}}:</view>
					<view class="text2style">{{Wake_up_time}}</view>
				</view>
				<view class="texttitle">
					<view class="text1style">{{$t('就寝时间')}}:</view>
					<view class="text2style">{{bedtime}}</view>
				</view>
				<view class="texttitle">
					<view class="text1style">{{$t('工作是否倒班')}}:</view>
					<view class="text2style">{{Whether_the_work}}</view>
				</view>
			</view>
			<view style="background: black; height: 2px; width: auto;margin-top: 10px;"></view>
			<view class="txtetitlestyle">
				<view style="font-size: 12px;font-weight: 600;color: #3298F7;">{{$t("动态血压趋势图")}}</view>
			</view>
			<view class="txtetitlestyle">
				<view style="display: flex;justify-content: center;align-items: center;flex-direction: row;">
					<image src="/static/image/mb.png" style="height: 13px;width: 20px;margin-right: 2px;">
					</image>
					<view style="font-size: 6.5px; font-weight: 400px;color: #999999;">{{$t("脉搏")}}({{$t("次")}}/min)
					</view>
					<view
						style="width: 10px; height: 10px;background: #F8B593;border-radius: 10px;margin-left:10px; margin-right: 10px;">
					</view>
					<view style="font-size: 6.5px;font-weight: 400px;color: #999999;">{{$t("收缩压")}}(mmHg)</view>
					<view
						style="width: 10px; height: 10px;background: #8ABAE8;border-radius: 10px;margin-left: 10px; margin-right:10px;">
					</view>
					<view style="font-size: 6.5px;font-weight: 400px;color: #999999;">{{$t("舒张压")}}(mmHg)</view>
				</view>
			</view>
			<view class="charts-box">
				<qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
			</view>
			<view class="txtetitlestyle">
				<view style="font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("动态血压监测统计表")}}</view>
			</view>
			<view class="txtetitlestyle">
				<view style="font-size: 10px; font-weight: 400; color: #999999;">{{$t("收缩压")}}(mmHg)</view>
				<view style="font-size: 10px; font-weight: 400; color: #999999;">{{$t("舒张压")}}(mmHg)</view>
				<view style="font-size: 10px; font-weight: 400; color: #999999;">{{$t("脉搏")}}({{$t("次")}}/min)</view>
				<view style="font-size: 10px; font-weight: 400; color: #999999;"></view>
			</view>
			<view class="txtetitlestyle_1">
				<view class="view_bg_0">
					<view style="width: 20vw;text-align: center;"></view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{$t("白天清醒时段")}}</br>(06:00-21:30)</view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{$t("夜间睡眠时段")}}</br>(21:30-06:00)</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;"></view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{$t("舒张压")}}</view>
						<view class="xxuey_bg">{{$t("收缩压")}}</view>
						<view class="xxuey_bg">{{$t("脉搏")}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{$t("舒张压")}}</view>
						<view class="xxuey_bg">{{$t("收缩压")}}</view>
						<view class="xxuey_bg">{{$t("脉搏")}}</view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("有效数据个数")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" :style="getblackgroud(youxiao_1)">{{youxiao_SZY_b}}</view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" :style="getblackgroud(youxiao_2)">{{youxiao_SZY_Y}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("均值")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(junzhi_1)">{{junzhi_SZY_b}}</view>
						<view class="xxuey_bg" :style="getblackgroud(junzhi_2)">{{junzhi_SSY_b}}</view>
						<view class="xxuey_bg">{{junzhi_pulse_b}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(junzhi_3)">{{junzhi_SZY_Y}}</view>
						<view class="xxuey_bg" :style="getblackgroud(junzhi_4)">{{junzhi_SSY_Y}}</view>
						<view class="xxuey_bg">{{junzhi_pulse_Y}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("标准差")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{biaozhun_SZY_b}}</view>
						<view class="xxuey_bg">{{biaozhun_SSY_b}}</view>
						<view class="xxuey_bg">{{biaozhun_pulse_b}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{biaozhun_SZY_Y}}</view>
						<view class="xxuey_bg">{{biaozhun_SSY_Y}}</view>
						<view class="xxuey_bg">{{biaozhun_pulse_Y}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("最大值")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuida_SZY_b}}</view>
						<view class="xxuey_bg">{{zuida_SSY_b}}</view>
						<view class="xxuey_bg">{{zuida_pulse_b}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuida_SZY_Y}}</view>
						<view class="xxuey_bg">{{zuida_SSY_Y}}</view>
						<view class="xxuey_bg">{{zuida_pulse_Y}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("中位数")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zhongweishu_SZY_b}}</view>
						<view class="xxuey_bg">{{zhongweishu_SSY_b}}</view>
						<view class="xxuey_bg">{{zhongweishu_pulse_b}}
						</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zhongweishu_SZY_Y}}</view>
						<view class="xxuey_bg">{{zhongweishu_SSY_Y}}</view>
						<view class="xxuey_bg">{{zhongweishu_pulse_Y}}
						</view>
					</view>
				</view>
				<view class=" allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("最小值")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuixiaozhi_SZY_b}}
						</view>
						<view class="xxuey_bg">{{zuixiaozhi_SSY_b}}
						</view>
						<view class="xxuey_bg">{{zuixiaozhi_pulse_b}}
						</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuixiaozhi_SZY_Y}}
						</view>
						<view class="xxuey_bg">{{zuixiaozhi_SSY_Y}}
						</view>
						<view class="xxuey_bg">{{zuixiaozhi_pulse_Y}}
						</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("血压负荷")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_1)">{{xeuyafuhe_SZY_b}}
						</view>
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_2)">{{xeuyafuhe_SSY_b}}
						</view>
						<view class="xxuey_bg_1"></view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_3)">{{xeuyafuhe_SZY_Y}}
						</view>
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_4)">{{xeuyafuhe_SSY_Y}}
						</view>
						<view class="xxuey_bg_1"></view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("夜间血压下降率")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" style="background: #808080;"></view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" style="background: #808080;"></view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("血压晨峰")}}</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1" style="background: #808080;"></view>
					</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1" style="background: #808080;"></view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("变异系数")}}</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1">{{byxs_SZY_b}}</view>
						<view class="youxiao_bg_1">{{byxs_SSY_b}}</view>
						<view class="youxiao_bg_1">{{byxs_pulse_b}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1">{{byxs_SZY_Y}}</view>
						<view class="youxiao_bg_1">{{byxs_SSY_Y}}</view>
						<view class="youxiao_bg_1">{{byxs_pulse_Y}}</view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("动脉硬化指数")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" style="background: #808080;"></view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" style="background: #808080;"></view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("盐敏感可能性")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{yanminggan}}</view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{yanminggan}}</view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;"></view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{$t("起床后清晨时段")}}</br>(06:00-08:00)</view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg">24h</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;"></view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{$t("舒张压")}}</view>
						<view class="xxuey_bg">{{$t("收缩压")}}</view>
						<view class="xxuey_bg">{{$t("脉搏")}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{$t("舒张压")}}</view>
						<view class="xxuey_bg">{{$t("收缩压")}}</view>
						<view class="xxuey_bg">{{$t("脉搏")}}</view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("有效数据个数")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{youxiao_SZY_Q}}</view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" :style="getblackgroud(youxiao_3)">{{youxiao_SZY_H}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("均值")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(junzhi_5)">{{junzhi_SZY_Q}}</view>
						<view class="xxuey_bg" :style="getblackgroud(junzhi_6)">{{junzhi_SSY_Q}}</view>
						<view class="xxuey_bg">{{junzhi_pulse_Q}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(junzhi_7)">{{junzhi_SZY_H}}</view>
						<view class="xxuey_bg" :style="getblackgroud(junzhi_8)">{{junzhi_SSY_H}}</view>
						<view class="xxuey_bg">{{junzhi_pulse_H}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("标准差")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{biaozhun_SZY_Q}}</view>
						<view class="xxuey_bg">{{biaozhun_SSY_Q}}</view>
						<view class="xxuey_bg">{{biaozhun_pulse_Q}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{biaozhun_SZY_H}}</view>
						<view class="xxuey_bg">{{biaozhun_SSY_H}}</view>
						<view class="xxuey_bg">{{biaozhun_pulse_H}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("最大值")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuida_SZY_Q}}</view>
						<view class="xxuey_bg">{{zuida_SSY_Q}}</view>
						<view class="xxuey_bg">{{zuida_pulse_Q}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuida_SZY_H}}</view>
						<view class="xxuey_bg">{{zuida_SSY_H}}</view>
						<view class="xxuey_bg">{{zuida_pulse_H}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("中位数")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zhongweishu_SZY_Q}}</view>
						<view class="xxuey_bg">{{zhongweishu_SSY_Q}}</view>
						<view class="xxuey_bg">{{zhongweishu_pulse_Q}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zhongweishu_SZY_H}}</view>
						<view class="xxuey_bg">{{zhongweishu_SSY_H}}</view>
						<view class="xxuey_bg">{{zhongweishu_pulse_H}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("最小值")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuixiaozhi_SZY_Q}}</view>
						<view class="xxuey_bg">{{zuixiaozhi_SSY_Q}}</view>
						<view class="xxuey_bg">{{zuixiaozhi_pulse_Q}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg">{{zuixiaozhi_SZY_H}}</view>
						<view class="xxuey_bg">{{zuixiaozhi_SSY_H}}</view>
						<view class="xxuey_bg">{{zuixiaozhi_pulse_H}}</view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("血压负荷")}}</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_5)">{{xeuyafuhe_SZY_Q}}
						</view>
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_6)">{{xeuyafuhe_SSY_Q}}
						</view>
						<view class="xxuey_bg" style="background: #808080;"></view>
					</view>
					<view class="szy_bg_all">
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_7)">{{xeuyafuhe_SZY_H}}
						</view>
						<view class="xxuey_bg" :style="getblackgroud(xeuyafuhe_8)">{{xeuyafuhe_SSY_H}}
						</view>
						<view class="xxuey_bg" style="background: #808080;"></view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("夜间血压下降率")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" style="background: #808080;"></view>
					</view>
					<view class="view_bg_2">
						<view class="xxuey_bg_2" :style="getblackgroud(yejian_1)">{{yejian_SZY_H}}</view>
						<view class="xxuey_bg_2" :style="getblackgroud(yejian_2)">{{yejian_SSY_H}}</view>
						<view class="xxuey_bg_2" style="background: #808080;"></view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("血压晨峰")}}</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1" style="background: #808080;"></view>
					</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1" :style="getblackgroud(xycf_1)">{{xycf_SZY_H}}</view>
						<view class="youxiao_bg_1">{{xycf_SSY_H}}</view>
						<view class="youxiao_bg_1" style="background: #808080;"></view>
					</view>
				</view>
				<view class="allback_1">
					<view style="width: 20vw;text-align: center;">{{$t("变异系数")}}</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1">{{byxs_SZY_Q}}</view>
						<view class="youxiao_bg_1">{{byxs_SSY_Q}}</view>
						<view class="youxiao_bg_1">{{byxs_pulse_Q}}</view>
					</view>
					<view class="szy_bg_all">
						<view class="youxiao_bg_1">{{byxs_SZY_H}}</view>
						<view class="youxiao_bg_1">{{byxs_SSY_H}}</view>
						<view class="youxiao_bg_1">{{byxs_pulse_H}}</view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("动脉硬化指数")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" style="background: #808080;"></view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg" :style="getblackgroud(dmyhzs)">{{dmyhzs_SSY_H}}</view>
					</view>
				</view>
				<view class="view_bg_1">
					<view style="width: 20vw;text-align: center;">{{$t("盐敏感可能性")}}</view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{yanminggan}}</view>
					</view>
					<view class="view_bg_2">
						<view class="youxiao_bg">{{yanminggan}}</view>
					</view>
				</view>
			</view>
			<view class="txtetitlestyle">
				<view style="font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("动态血压监测相关图")}}</view>
			</view>
			<view class="txtetitlestyless1">
				<view style="padding: 10px;display: flex;justify-content: center;align-items: center;width: 90%;">
					<view style="flex: 1;text-align: center;color: #040000">{{$t('舒张压')}}（mmHg）</view>
					<view style="flex: 1;text-align: center;color: #040000">{{$t('收缩压')}}（mmHg）</view>
					<view style="flex: 1;text-align: center;color: #040000">{{$t('血压类别')}}</view>
				</view>
				<view
					style="padding: 10px;background: #7DCDCA; display: flex;justify-content: center;align-items: center;width: 90%;">
					<view style="flex: 1;text-align: center;">40-60</view>
					<view style="flex: 1;text-align: center;">60-90</view>
					<view style="flex: 1;text-align: center;">{{$t('血压水平偏低')}}</view>
				</view>
				<view
					style="padding: 10px; background: #D5E9C9; display: flex;justify-content: center;align-items: center;width: 90%;">
					<view style="flex: 1;text-align: center;">61-80</view>
					<view style="flex: 1;text-align: center;">91-120</view>
					<view style="flex: 1;text-align: center;">{{$t('血压水平正常')}}</view>
				</view>
				<view
					style="padding: 10px;background: #EDEAAB; display: flex;justify-content: center;align-items: center;width: 90%;">
					<view style="flex: 1;text-align: center;">81-90</view>
					<view style="flex: 1;text-align: center;">121-140</view>
					<view style="flex: 1;text-align: center;">{{$t('血压水平偏高')}}</view>
				</view>
				<view
					style="padding: 10px;background: #EAC37A; display: flex;justify-content: center;align-items: center;width: 90%;">
					<view style="flex: 1;text-align: center;">91-100</view>
					<view style="flex: 1;text-align: center;">141-160</view>
					<view style="flex: 1;text-align: center;">{{$t('一级高血压')}}</view>
				</view>
				<view
					style="padding: 10px;background: #E27839; display: flex;justify-content: center;align-items: center;width: 90%;">
					<view style="flex: 1;text-align: center;">101-110</view>
					<view style="flex: 1;text-align: center;">161-180</view>
					<view style="flex: 1;text-align: center;">{{$t('二级高血压')}}</view>
				</view>
				<view
					style="padding: 10px;background: #DD5128; display: flex;justify-content: center;align-items: center;width: 90%;">
					<view style="flex: 1;text-align: center;">111-150</view>
					<view style="flex: 1;text-align: center;">181-250</view>
					<view style="flex: 1;text-align: center;">{{$t('三级高血压')}}</view>
				</view>
			</view>
			<view style="border: 1px solid black;margin-top: 20px;">
				<view class="txtetitlestyle1sd">
					<view class="texttitle">
						<view class="text1style">{{$t("有效测量次数")}}:</view>
						<view class="text2style">{{name}}</view>
					</view>
					<view class="texttitle">
						<view class="text1style">{{$t("总计监测时间")}}:</view>
						<view class="text2style">{{sex}}</view>
					</view>
					<view class="texttitle">
						<view class="text1style">{{$t("有效监测时间")}}:</view>
						<view class="text2style">{{age}}</view>
					</view>
				</view>
				<view style="padding-left: 10px;padding-right: 10px; font-size: 10px;padding-top: 10px;">
					{{$t("告知1")}}
				</view>
				<view style="padding:10px; font-size: 10px;">
					{{$t("告知2")}}
				</view>
			</view>
			<view class="txtetitlestyle">
				<view style="font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("动态血压监测数据统计")}}</view>
			</view>
			<view class="txtetitlestyle">
				<view style="font-size: 10px; font-weight: 400; color: #999999;display: flex;align-items: center;">
					<image src="/static/icons/soudong.png" style="width:11px; height: 11px;margin-right: 5px;">
					</image>{{$t("手动输入数据")}}
				</view>
				<view style="font-size: 10px; font-weight: 400; color: #999999;">
					<image src="/static/icons/wuxiao.png" style="width:11px; height: 11px;margin-right: 5px;">
					</image>{{$t("无效数据")}}
				</view>
				<view
					style="font-size: 10px; font-weight: 400; color: #999999;display: flex;flex-direction: row;align-items: center;">
					<view style="width: 18px; height: 10px; background: #D9D9D9;margin-right: 5px;"></view>
					{{$t("睡眠时段测量数据")}}
				</view>
			</view>
			<view class="txtetitlestyle">
				<view style="width: 100%; height: 2px; background: #040000;"></view>
			</view>
			<view class="txtetitlestyle">
				<view style="display: flex;flex-direction: column;width: 100%;">
					<view class="row">
						<view v-for="header in headers" :key="header" class="cell">{{header}}</view>
					</view>
					<view style="background: #969799;height: 1px; width: auto;"></view>
					<view v-for="(item, index) in listall" :key="index">
						<view class="row">
							<view class="cell">
								<image style="width: 10px;height: 10px;margin-right: 3px"
									:src="item.type=='0'?'/static/icons/soudong.png':'/static/icons/wuxiao.png'">
								</image>{{index}}
							</view>
							<view class="cell">{{item.date}}</view>
							<view class="cell">{{item.time}}</view>
							<view class="cell">{{item.highPressure}}</view>
							<view class="cell">{{item.lowPressure}}</view>
							<view class="cell">{{item.heartrate}}</view>
							<view class="cell">{{item.modelName}}</view>
						</view>
						<view style="background: #969799;height: 1px; width: 100%;"></view>
					</view>
				</view>
			</view>
			<view style="width: 100%; height: 2px; background: #040000;"></view>

		</view>
		<view class="titlestyle">
			<uni-icons @click="back()" type="left" size="20"
				style="color: white;margin-left: 20px;margin-top: 30px;"></uni-icons>
			<view class="titlestyle_1">{{$t('动态血压监测报告')}}</view>
			<uni-icons @click="generatePDF()" type="arrow-down" size="20"
				style="color: white;margin-right: 20px;margin-top: 30px;"></uni-icons>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="false">
				<view class="popup_bg">
					<view class="select_text">{{$t("是否下载动态血压监测报告")}}</view>
					<view style="border-top: 1px solid gainsboro;"></view>
					<view class="select_text" style="color: #3298F7;" @click="sex_yes()">{{$t('是')}}</view>
					<view style="border-top: 1px solid gainsboro;"></view>
					<view class="select_text" @click="sex_no()">{{$t('否')}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		base64ToPath
	} from '../../../common/imageTool.js';

	export default {
		data() {
			return {
				isExpanded: false, // 控制是否展开
				pacitime: "2025-03-17",
				name: "yang",
				sex: '男',
				age: '38',
				Testing_equipment: 'J860000015352460',
				Wake_up_time: '-',
				bedtime: '-',
				Whether_to_take: '-',
				Lunch_break: '-',
				medication: '-',
				Current_medication: '-',
				Whether_the_work: '-',
				chartData: {
					categories: ["6:12", "8:00", "12:30",
						"15:00", "17:00", "19:00", "21:30", "23:00"
					],
					series: [{
						legendShape: "none",
						name: "",
						data: ["145", "122", "132", "142", "150", "101", "120", "124"]
					}, {
						legendShape: "none",
						name: "",
						data: ["80", 90, 78, 88, 89, 100, 79, 68]
					}, {
						legendShape: "none",
						name: "",
						data: [120, 100, 98, 96, 110, 80, 99, 86]
					}]
				},
				opts: {
					color: ["#F8B593", "#8ABAE8", "#000000"],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: false,
						gridType: "dash",
						dashLength: 10
					},
					yAxis: {
						gridType: "dash",
						dashLength: 8,
						data: [{
							min: 30,
							max: 180,
							position: "left",
							fontSize: 10,
							textAlign: "left",
							calibration: false,
							axisLine: true,
						}, {
							min: 30,
							max: 180,
							position: "right",
							fontSize: 10,
							textAlign: "right",
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
				headers: [this.$t("序号"), this.$t("日期"), this.$t("时间"), this.$t("收缩压"), this.$t("舒张压"), this.$t("脉搏"), this
					.$t("型号")
				],
				listall: [],

				//有效值
				youxiao_SZY_b: 'NA',
				youxiao_SZY_Y: 'NA',
				youxiao_SZY_Q: 'NA',
				youxiao_SZY_H: 'NA',
				youxiao_1: '',
				youxiao_2: '',
				youxiao_3: '',
				// 均值
				junzhi_SZY_b: 'NA',
				junzhi_SSY_b: 'NA',
				junzhi_pulse_b: 'NA',
				junzhi_SZY_Y: 'NA',
				junzhi_SSY_Y: 'NA',
				junzhi_pulse_Y: 'NA',
				junzhi_SZY_Q: 'NA',
				junzhi_SSY_Q: 'NA',
				junzhi_pulse_Q: 'NA',
				junzhi_SZY_H: 'NA',
				junzhi_SSY_H: 'NA',
				junzhi_pulse_H: 'NA',
				junzhi_1: '',
				junzhi_2: '',
				junzhi_3: '',
				junzhi_4: '',
				junzhi_5: '',
				junzhi_6: '',
				junzhi_7: '',
				junzhi_8: '',
				// 标准差
				biaozhun_SZY_b: 'NA',
				biaozhun_SSY_b: 'NA',
				biaozhun_pulse_b: 'NA',
				biaozhun_SZY_Y: 'NA',
				biaozhun_SSY_Y: 'NA',
				biaozhun_pulse_Y: 'NA',
				biaozhun_SZY_Q: 'NA',
				biaozhun_SSY_Q: 'NA',
				biaozhun_pulse_Q: 'NA',
				biaozhun_SZY_H: 'NA',
				biaozhun_SSY_H: 'NA',
				biaozhun_pulse_H: 'NA',
				//最大值
				zuida_SZY_b: 'NA',
				zuida_SSY_b: 'NA',
				zuida_pulse_b: 'NA',
				zuida_SZY_Y: 'NA',
				zuida_SSY_Y: 'NA',
				zuida_pulse_Y: 'NA',
				zuida_SZY_Q: 'NA',
				zuida_SSY_Q: 'NA',
				zuida_pulse_Q: 'NA',
				zuida_SZY_H: 'NA',
				zuida_SSY_H: 'NA',
				zuida_pulse_H: 'NA',
				//中位数
				zhongweishu_SZY_b: 'NA',
				zhongweishu_SSY_b: 'NA',
				zhongweishu_pulse_b: 'NA',
				zhongweishu_SZY_Y: 'NA',
				zhongweishu_SSY_Y: 'NA',
				zhongweishu_pulse_Y: 'NA',
				zhongweishu_SZY_Q: 'NA',
				zhongweishu_SSY_Q: 'NA',
				zhongweishu_pulse_Q: 'NA',
				zhongweishu_SZY_H: 'NA',
				zhongweishu_SSY_H: 'NA',
				zhongweishu_pulse_H: 'NA',
				// 最小值
				zuixiaozhi_SZY_b: 'NA',
				zuixiaozhi_SSY_b: 'NA',
				zuixiaozhi_pulse_b: 'NA',
				zuixiaozhi_SZY_Y: 'NA',
				zuixiaozhi_SSY_Y: 'NA',
				zuixiaozhi_pulse_Y: 'NA',
				zuixiaozhi_SZY_Q: 'NA',
				zuixiaozhi_SSY_Q: 'NA',
				zuixiaozhi_pulse_Q: 'NA',
				zuixiaozhi_SZY_H: 'NA',
				zuixiaozhi_SSY_H: 'NA',
				zuixiaozhi_pulse_H: 'NA',
				// 血压负荷
				xeuyafuhe_SZY_b: 'NA',
				xeuyafuhe_SSY_b: 'NA',
				xeuyafuhe_SZY_Y: 'NA',
				xeuyafuhe_SSY_Y: 'NA',
				xeuyafuhe_SZY_Q: 'NA',
				xeuyafuhe_SSY_Q: 'NA',
				xeuyafuhe_SZY_H: 'NA',
				xeuyafuhe_SSY_H: 'NA',
				xeuyafuhe_1: '',
				xeuyafuhe_2: '',
				xeuyafuhe_3: '',
				xeuyafuhe_4: '',
				xeuyafuhe_5: '',
				xeuyafuhe_6: '',
				xeuyafuhe_7: '',
				xeuyafuhe_8: '',
				// 夜间血压下降率
				yejian_SZY_H: 'NA',
				yejian_SSY_H: 'NA',
				yejian_1: '',
				yejian_2: '',
				//血压晨峰
				xycf_SZY_H: 'NA',
				xycf_SSY_H: 'NA',
				xycf_1: '',
				// 变异系数
				byxs_SZY_b: 'NA',
				byxs_SSY_b: 'NA',
				byxs_pulse_b: 'NA',
				byxs_SZY_Y: 'NA',
				byxs_SSY_Y: 'NA',
				byxs_pulse_Y: 'NA',
				byxs_SZY_Q: 'NA',
				byxs_SSY_Q: 'NA',
				byxs_pulse_Q: 'NA',
				byxs_SZY_H: 'NA',
				byxs_SSY_H: 'NA',
				byxs_pulse_H: 'NA',
				//动脉硬化指数
				dmyhzs_SSY_H: 'NA',
				dmyhzs: '',
				// 盐敏感可能性
				yanminggan: 'NA',
				jianyi: '',
				jianyi1: '',
				jianyi2: '',
				jianyi3: '',
				jianyi4: '',
				jianyi5: '',
				jianyi6: '',
				jianyi7: '',
				jianyi8: '',
				fenxi: '',
				fenxi1: '',
				fenxi2: '',
				fenxi3: '',
				fenxi4: '',
				fenxi5: '',
				fenxi6: '',
				fenxi7: '',
				fenxi8: '',
				fenxi9: '',
				fenxi10: '',
				fenxi11: '',
				fenxi12: '',
				fenxi13: '',
				fenxi14: '',
				fenxi15: '',
				filterVarList: '',
				period: '',
				idsss: '',
				finlretVarList1: "",
				shebei: 0,
				gaoya: 1,



			}
		},

		onLoad(res) {
			// // 创建一个 Date 对象，表示 2025-06-01
			// let date = new Date(new Date().toISOString().slice(0, 10));
			// // 减去一天
			// date.setDate(date.getDate() - 1);
			// // 转换为 ISO 字符串格式
			// let isoString = date.toISOString().slice(0, 10);
			// if (res.profDate === undefined) {
			// 	this.pacitime = new Date().toISOString().slice(0, 10) + " 00:00:00" //报告日期
			// } else {
			// 	this.pacitime = res.profDate === new Date().toISOString().slice(0, 10) ? isoString + " 00:00:00" : res
			// 		.profDate + " 00:00:00" //报告日期
			// }
			this.pacitime = res.profDate + " 00:00:00"
			this.Whether_to_take = res.select //是否午休
			if (res.index == "1") {
				this.Lunch_break = this.$t('分钟30')
			} else if (res.index == "2") {
				this.Lunch_break = this.$t('分钟60')
			} else if (res.index == "3") {
				this.Lunch_break = this.$t('分钟90')
			} else if (res.index == "4") {
				this.Lunch_break = this.$t('分钟120')
			} else if (res.index == "5") {
				this.Lunch_break = this.$t('小时以上2')
			}
			this.medication = res.select2 //是否用药
			// this.Current_medication = res.select3 //当前药物
			this.Wake_up_time = res.time //起床时间
			this.bedtime = res.time1 //就寝时间
			this.Whether_the_work = res.select4 //工作是否倒班
			this.idsss = res.index1
			if (res.index1 == "1") {
				this.filterVarList = "JLvFLGvJL01v1D"
				this.period = "1D"
				this.finlretVarList1 =
					'BPvSBPvCNTv1DvCNTv0002,BPvSBPvCNTv1DvCNTv0003,BPvSBPvCNTv1DvCNTv0004,BPvSBPvCNTv1DvCNTv0001,JLvRULEv1DvDATACHECKv0001,JLvRULEv1DvDATACHECKv0002,JLvRULEv1DvDATACHECKv0003,BPvSBPvAVGv1DvAVGv0002,BPvDBPvAVGv1DvAVGv0002,BPvHRvAVGv1DvAVGv0002,BPvSBPvAVGv1DvAVGv0003,BPvDBPvAVGv1DvAVGv0003,BPvHRvAVGv1DvAVGv0003,BPvSBPvAVGv1DvAVGv0004,BPvDBPvAVGv1DvAVGv0004,BPvHRvAVGv1DvAVGv0004,BPvSBPvAVGv1DvAVGv0001,BPvDBPvAVGv1DvAVGv0001,BPvHRvAVGv1DvAVGv0001,JLvRULEv1DvBPCHECKv0004,JLvRULEv1DvBPCHECKv0005,JLvRULEv1DvBPCHECKv0007,JLvRULEv1DvBPCHECKv0008,JLvRULEv1DvBPCHECKv0010,JLvRULEv1DvBPCHECKv0011,JLvRULEv1DvBPCHECKv0001,JLvRULEv1DvBPCHECKv0002,BPvSBPvSTDv1DvSTDv0002,BPvDBPvSTDv1DvSTDv0002,BPvHRvSTDv1DvSTDv0002,BPvSBPvSTDv1DvSTDv0003,BPvDBPvSTDv1DvSTDv0003,BPvHRvSTDv1DvSTDv0003,BPvSBPvSTDv1DvSTDv0004,BPvDBPvSTDv1DvSTDv0004,BPvHRvSTDv1DvSTDv0004,BPvSBPvSTDv1DvSTDv0001,BPvDBPvSTDv1DvSTDv0001,BPvHRvSTDv1DvSTDv0001,BPvSBPvMAXv1DvMAXv0002,BPvDBPvMAXv1DvMAXv0002,BPvHRvMAXv1DvMAXv0002,BPvSBPvMAXv1DvMAXv0003,BPvDBPvMAXv1DvMAXv0003,BPvHRvMAXv1DvMAXv0003,BPvSBPvMAXv1DvMAXv0004,BPvDBPvMAXv1DvMAXv0004,BPvHRvMAXv1DvMAXv0004,BPvSBPvMAXv1DvMAXv0001,BPvDBPvMAXv1DvMAXv0001,BPvHRvMAXv1DvMAXv0001,BPvSBPvMEDv1DvMEDv0002,BPvDBPvMEDv1DvMEDv0002,BPvHRvMEDv1DvMEDv0002,BPvSBPvMEDv1DvMEDv0003,BPvDBPvMEDv1DvMEDv0003,BPvHRvMEDv1DvMEDv0003,BPvSBPvMEDv1DvMEDv0004,BPvDBPvMEDv1DvMEDv0004,BPvHRvMEDv1DvMEDv0004,BPvSBPvMEDv1DvMEDv0001,BPvDBPvMEDv1DvMEDv0001,BPvHRvMEDv1DvMEDv0001,BPvSBPvMINv1DvMINv0002,BPvDBPvMINv1DvMINv0002,BPvHRvMINv1DvMINv0002,BPvSBPvMINv1DvMINv0003,BPvDBPvMINv1DvMINv0003,BPvHRvMINv1DvMINv0003,BPvSBPvMINv1DvMINv0004,BPvDBPvMINv1DvMINv0004,BPvHRvMINv1DvMINv0004,BPvSBPvMINv1DvMINv0001,BPvDBPvMINv1DvMINv0001,BPvHRvMINv1DvMINv0001,BPvSBPvLOADv1DvRATIOv0002,BPvDBPvLOADv1DvRATIOv0002,BPvSBPvLOADv1DvRATIOv0003,BPvDBPvLOADv1DvRATIOv0003,BPvSBPvLOADv1DvRATIOv0004,BPvDBPvLOADv1DvRATIOv0004,BPvSBPvLOADv1DvRATIOv0001,BPvDBPvLOADv1DvRATIOv0001,JLvRULEv1DvBPCHECKv0022,JLvRULEv1DvBPCHECKv0027,JLvRULEv1DvBPCHECKv0023,JLvRULEv1DvBPCHECKv0028,JLvRULEv1DvBPCHECKv0024,JLvRULEv1DvBPCHECKv0029,JLvRULEv1DvBPCHECKv0021,JLvRULEv1DvBPCHECKv0026,BPvSBPvNBRv1DvRATIOv0001,BPvDBPvNBRv1DvRATIOv0001,JLvRULEv1DvBPCHECKv0013,JLvRULEv1DvBPCHECKv0014,JLvRULEv1DvBPCHECKv0015,JLvRULEv1DvBPCHECKv0016,JLvRULEv1DvBPCHECKv0017,JLvRULEv1DvBPCHECKv0018, JLvRULEv1DvBPCHECKv0019, JLvRULEv1DvBPCHECKv0020,BPvSBPvMBSv1DvMINUSv0001,BPvDBPvMBSv1DvMINUSv0001,JLvRULEv1DvBPCHECKv0031,BPvSBPvCVv1DvRATIO2v0002,BPvDBPvCVv1DvRATIO2v0002,BPvHRvCVv1DvRATIO2v0002,BPvSBPvCVv1DvRATIO2v0003,BPvDBPvCVv1DvRATIO2v0003,BPvHRvCVv1DvRATIO2v0003,BPvSBPvCVv1DvRATIO2v0004,BPvDBPvCVv1DvRATIO2v0004,BPvHRvCVv1DvRATIO2v0004,BPvSBPvCVv1DvRATIO2v0001,BPvDBPvCVv1DvRATIO2v0001,BPvHRvCVv1DvRATIO2v0001,BPvAASIv1D,JLvRULEv1DvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "2") {
				this.filterVarList = "JLvFLGvJL01v2D"
				this.period = "2D"
				this.finlretVarList1 =
					'BPvSBPvCNTv2DvCNTv0002,BPvSBPvCNTv2DvCNTv0003,BPvSBPvCNTv2DvCNTv0004,BPvSBPvCNTv2DvCNTv0001,JLvRULEv2DvDATACHECKv0001,JLvRULEv2DvDATACHECKv0002,JLvRULEv2DvDATACHECKv0003,BPvSBPvAVGv2DvAVGv0002,BPvDBPvAVGv2DvAVGv0002,BPvHRvAVGv2DvAVGv0002,BPvSBPvAVGv2DvAVGv0003,BPvDBPvAVGv2DvAVGv0003,BPvHRvAVGv2DvAVGv0003,BPvSBPvAVGv2DvAVGv0004,BPvDBPvAVGv2DvAVGv0004,BPvHRvAVGv2DvAVGv0004,BPvSBPvAVGv2DvAVGv0001,BPvDBPvAVGv2DvAVGv0001,BPvHRvAVGv2DvAVGv0001,JLvRULEv2DvBPCHECKv0004,JLvRULEv2DvBPCHECKv0005,JLvRULEv2DvBPCHECKv0007,JLvRULEv2DvBPCHECKv0008,JLvRULEv2DvBPCHECKv0010,JLvRULEv2DvBPCHECKv0011,JLvRULEv2DvBPCHECKv0001,JLvRULEv2DvBPCHECKv0002,BPvSBPvSTDv2DvSTDv0002,BPvDBPvSTDv2DvSTDv0002,BPvHRvSTDv2DvSTDv0002,BPvSBPvSTDv2DvSTDv0003,BPvDBPvSTDv2DvSTDv0003,BPvHRvSTDv2DvSTDv0003,BPvSBPvSTDv2DvSTDv0004,BPvDBPvSTDv2DvSTDv0004,BPvHRvSTDv2DvSTDv0004,BPvSBPvSTDv2DvSTDv0001,BPvDBPvSTDv2DvSTDv0001,BPvHRvSTDv2DvSTDv0001,BPvSBPvMAXv2DvMAXv0002,BPvDBPvMAXv2DvMAXv0002,BPvHRvMAXv2DvMAXv0002,BPvSBPvMAXv2DvMAXv0003,BPvDBPvMAXv2DvMAXv0003,BPvHRvMAXv2DvMAXv0003,BPvSBPvMAXv2DvMAXv0004,BPvDBPvMAXv2DvMAXv0004,BPvHRvMAXv2DvMAXv0004,BPvSBPvMAXv2DvMAXv0001,BPvDBPvMAXv2DvMAXv0001,BPvHRvMAXv2DvMAXv0001,BPvSBPvMEDv2DvMEDv0002,BPvDBPvMEDv2DvMEDv0002,BPvHRvMEDv2DvMEDv0002,BPvSBPvMEDv2DvMEDv0003,BPvDBPvMEDv2DvMEDv0003,BPvHRvMEDv2DvMEDv0003,BPvSBPvMEDv2DvMEDv0004,BPvDBPvMEDv2DvMEDv0004,BPvHRvMEDv2DvMEDv0004,BPvSBPvMEDv2DvMEDv0001,BPvDBPvMEDv2DvMEDv0001,BPvHRvMEDv2DvMEDv0001,BPvSBPvMINv2DvMINv0002,BPvDBPvMINv2DvMINv0002,BPvHRvMINv2DvMINv0002,BPvSBPvMINv2DvMINv0003,BPvDBPvMINv2DvMINv0003,BPvHRvMINv2DvMINv0003,BPvSBPvMINv2DvMINv0004,BPvDBPvMINv2DvMINv0004,BPvHRvMINv2DvMINv0004,BPvSBPvMINv2DvMINv0001,BPvDBPvMINv2DvMINv0001,BPvHRvMINv2DvMINv0001,BPvSBPvLOADv2DvRATIOv0002,BPvDBPvLOADv2DvRATIOv0002,BPvSBPvLOADv2DvRATIOv0003,BPvDBPvLOADv2DvRATIOv0003,BPvSBPvLOADv2DvRATIOv0004,BPvDBPvLOADv2DvRATIOv0004,BPvSBPvLOADv2DvRATIOv0001,BPvDBPvLOADv2DvRATIOv0001,JLvRULEv2DvBPCHECKv0022,JLvRULEv2DvBPCHECKv0027,JLvRULEv2DvBPCHECKv0023,JLvRULEv2DvBPCHECKv0028,JLvRULEv2DvBPCHECKv0024,JLvRULEv2DvBPCHECKv0029,JLvRULEv2DvBPCHECKv0021,JLvRULEv2DvBPCHECKv0026,BPvSBPvNBRv2DvRATIOv0001,BPvDBPvNBRv2DvRATIOv0001,JLvRULEv2DvBPCHECKv0013,JLvRULEv2DvBPCHECKv0014,JLvRULEv2DvBPCHECKv0015,JLvRULEv2DvBPCHECKv0016,JLvRULEv2DvBPCHECKv0017,JLvRULEv2DvBPCHECKv0018, JLvRULEv2DvBPCHECKv0019, JLvRULEv2DvBPCHECKv0020,BPvSBPvMBSv2DvMINUSv0001,BPvDBPvMBSv2DvMINUSv0001,JLvRULEv2DvBPCHECKv0031,BPvSBPvCVv2DvRATIO2v0002,BPvDBPvCVv2DvRATIO2v0002,BPvHRvCVv2DvRATIO2v0002,BPvSBPvCVv2DvRATIO2v0003,BPvDBPvCVv2DvRATIO2v0003,BPvHRvCVv2DvRATIO2v0003,BPvSBPvCVv2DvRATIO2v0004,BPvDBPvCVv2DvRATIO2v0004,BPvHRvCVv2DvRATIO2v0004,BPvSBPvCVv2DvRATIO2v0001,BPvDBPvCVv2DvRATIO2v0001,BPvHRvCVv2DvRATIO2v0001,BPvAASIv2D,JLvRULEv2DvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "3") {
				this.filterVarList = "JLvFLGvJL01v3D"
				this.period = "3D"
				this.finlretVarList1 =
					'BPvSBPvCNTv3DvCNTv0002,BPvSBPvCNTv3DvCNTv0003,BPvSBPvCNTv3DvCNTv0004,BPvSBPvCNTv3DvCNTv0001,JLvRULEv3DvDATACHECKv0001,JLvRULEv3DvDATACHECKv0002,JLvRULEv3DvDATACHECKv0003,BPvSBPvAVGv3DvAVGv0002,BPvDBPvAVGv3DvAVGv0002,BPvHRvAVGv3DvAVGv0002,BPvSBPvAVGv3DvAVGv0003,BPvDBPvAVGv3DvAVGv0003,BPvHRvAVGv3DvAVGv0003,BPvSBPvAVGv3DvAVGv0004,BPvDBPvAVGv3DvAVGv0004,BPvHRvAVGv3DvAVGv0004,BPvSBPvAVGv3DvAVGv0001,BPvDBPvAVGv3DvAVGv0001,BPvHRvAVGv3DvAVGv0001,JLvRULEv3DvBPCHECKv0004,JLvRULEv3DvBPCHECKv0005,JLvRULEv3DvBPCHECKv0007,JLvRULEv3DvBPCHECKv0008,JLvRULEv3DvBPCHECKv0010,JLvRULEv3DvBPCHECKv0011,JLvRULEv3DvBPCHECKv0001,JLvRULEv3DvBPCHECKv0002,BPvSBPvSTDv3DvSTDv0002,BPvDBPvSTDv3DvSTDv0002,BPvHRvSTDv3DvSTDv0002,BPvSBPvSTDv3DvSTDv0003,BPvDBPvSTDv3DvSTDv0003,BPvHRvSTDv3DvSTDv0003,BPvSBPvSTDv3DvSTDv0004,BPvDBPvSTDv3DvSTDv0004,BPvHRvSTDv3DvSTDv0004,BPvSBPvSTDv3DvSTDv0001,BPvDBPvSTDv3DvSTDv0001,BPvHRvSTDv3DvSTDv0001,BPvSBPvMAXv3DvMAXv0002,BPvDBPvMAXv3DvMAXv0002,BPvHRvMAXv3DvMAXv0002,BPvSBPvMAXv3DvMAXv0003,BPvDBPvMAXv3DvMAXv0003,BPvHRvMAXv3DvMAXv0003,BPvSBPvMAXv3DvMAXv0004,BPvDBPvMAXv3DvMAXv0004,BPvHRvMAXv3DvMAXv0004,BPvSBPvMAXv3DvMAXv0001,BPvDBPvMAXv3DvMAXv0001,BPvHRvMAXv3DvMAXv0001,BPvSBPvMEDv3DvMEDv0002,BPvDBPvMEDv3DvMEDv0002,BPvHRvMEDv3DvMEDv0002,BPvSBPvMEDv3DvMEDv0003,BPvDBPvMEDv3DvMEDv0003,BPvHRvMEDv3DvMEDv0003,BPvSBPvMEDv3DvMEDv0004,BPvDBPvMEDv3DvMEDv0004,BPvHRvMEDv3DvMEDv0004,BPvSBPvMEDv3DvMEDv0001,BPvDBPvMEDv3DvMEDv0001,BPvHRvMEDv3DvMEDv0001,BPvSBPvMINv3DvMINv0002,BPvDBPvMINv3DvMINv0002,BPvHRvMINv3DvMINv0002,BPvSBPvMINv3DvMINv0003,BPvDBPvMINv3DvMINv0003,BPvHRvMINv3DvMINv0003,BPvSBPvMINv3DvMINv0004,BPvDBPvMINv3DvMINv0004,BPvHRvMINv3DvMINv0004,BPvSBPvMINv3DvMINv0001,BPvDBPvMINv3DvMINv0001,BPvHRvMINv3DvMINv0001,BPvSBPvLOADv3DvRATIOv0002,BPvDBPvLOADv3DvRATIOv0002,BPvSBPvLOADv3DvRATIOv0003,BPvDBPvLOADv3DvRATIOv0003,BPvSBPvLOADv3DvRATIOv0004,BPvDBPvLOADv3DvRATIOv0004,BPvSBPvLOADv3DvRATIOv0001,BPvDBPvLOADv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0022,JLvRULEv3DvBPCHECKv0027,JLvRULEv3DvBPCHECKv0023,JLvRULEv3DvBPCHECKv0028,JLvRULEv3DvBPCHECKv0024,JLvRULEv3DvBPCHECKv0029,JLvRULEv3DvBPCHECKv0021,JLvRULEv3DvBPCHECKv0026,BPvSBPvNBRv3DvRATIOv0001,BPvDBPvNBRv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0013,JLvRULEv3DvBPCHECKv0014,JLvRULEv3DvBPCHECKv0015,JLvRULEv3DvBPCHECKv0016,JLvRULEv3DvBPCHECKv0017,JLvRULEv3DvBPCHECKv0018, JLvRULEv3DvBPCHECKv0019, JLvRULEv3DvBPCHECKv0020,BPvSBPvMBSv3DvMINUSv0001,BPvDBPvMBSv3DvMINUSv0001,JLvRULEv3DvBPCHECKv0031,BPvSBPvCVv3DvRATIO2v0002,BPvDBPvCVv3DvRATIO2v0002,BPvHRvCVv3DvRATIO2v0002,BPvSBPvCVv3DvRATIO2v0003,BPvDBPvCVv3DvRATIO2v0003,BPvHRvCVv3DvRATIO2v0003,BPvSBPvCVv3DvRATIO2v0004,BPvDBPvCVv3DvRATIO2v0004,BPvHRvCVv3DvRATIO2v0004,BPvSBPvCVv3DvRATIO2v0001,BPvDBPvCVv3DvRATIO2v0001,BPvHRvCVv3DvRATIO2v0001,BPvAASIv3D,JLvRULEv3DvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "4") {
				this.filterVarList = "JLvFLGvJL01v4D"
				this.period = "4D"
				this.finlretVarList1 =
					'BPvSBPvCNTv4DvCNTv0002,BPvSBPvCNTv4DvCNTv0003,BPvSBPvCNTv4DvCNTv0004,BPvSBPvCNTv4DvCNTv0001,JLvRULEv4DvDATACHECKv0001,JLvRULEv4DvDATACHECKv0002,JLvRULEv4DvDATACHECKv0003,BPvSBPvAVGv4DvAVGv0002,BPvDBPvAVGv4DvAVGv0002,BPvHRvAVGv4DvAVGv0002,BPvSBPvAVGv4DvAVGv0003,BPvDBPvAVGv4DvAVGv0003,BPvHRvAVGv4DvAVGv0003,BPvSBPvAVGv4DvAVGv0004,BPvDBPvAVGv4DvAVGv0004,BPvHRvAVGv4DvAVGv0004,BPvSBPvAVGv4DvAVGv0001,BPvDBPvAVGv4DvAVGv0001,BPvHRvAVGv4DvAVGv0001,JLvRULEv4DvBPCHECKv0004,JLvRULEv4DvBPCHECKv0005,JLvRULEv4DvBPCHECKv0007,JLvRULEv4DvBPCHECKv0008,JLvRULEv4DvBPCHECKv0010,JLvRULEv4DvBPCHECKv0011,JLvRULEv4DvBPCHECKv0001,JLvRULEv4DvBPCHECKv0002,BPvSBPvSTDv4DvSTDv0002,BPvDBPvSTDv4DvSTDv0002,BPvHRvSTDv4DvSTDv0002,BPvSBPvSTDv4DvSTDv0003,BPvDBPvSTDv4DvSTDv0003,BPvHRvSTDv4DvSTDv0003,BPvSBPvSTDv4DvSTDv0004,BPvDBPvSTDv4DvSTDv0004,BPvHRvSTDv4DvSTDv0004,BPvSBPvSTDv4DvSTDv0001,BPvDBPvSTDv4DvSTDv0001,BPvHRvSTDv4DvSTDv0001,BPvSBPvMAXv4DvMAXv0002,BPvDBPvMAXv4DvMAXv0002,BPvHRvMAXv4DvMAXv0002,BPvSBPvMAXv4DvMAXv0003,BPvDBPvMAXv4DvMAXv0003,BPvHRvMAXv4DvMAXv0003,BPvSBPvMAXv4DvMAXv0004,BPvDBPvMAXv4DvMAXv0004,BPvHRvMAXv4DvMAXv0004,BPvSBPvMAXv4DvMAXv0001,BPvDBPvMAXv4DvMAXv0001,BPvHRvMAXv4DvMAXv0001,BPvSBPvMEDv4DvMEDv0002,BPvDBPvMEDv4DvMEDv0002,BPvHRvMEDv4DvMEDv0002,BPvSBPvMEDv4DvMEDv0003,BPvDBPvMEDv4DvMEDv0003,BPvHRvMEDv4DvMEDv0003,BPvSBPvMEDv4DvMEDv0004,BPvDBPvMEDv4DvMEDv0004,BPvHRvMEDv4DvMEDv0004,BPvSBPvMEDv4DvMEDv0001,BPvDBPvMEDv4DvMEDv0001,BPvHRvMEDv4DvMEDv0001,BPvSBPvMINv4DvMINv0002,BPvDBPvMINv4DvMINv0002,BPvHRvMINv4DvMINv0002,BPvSBPvMINv4DvMINv0003,BPvDBPvMINv4DvMINv0003,BPvHRvMINv4DvMINv0003,BPvSBPvMINv4DvMINv0004,BPvDBPvMINv4DvMINv0004,BPvHRvMINv4DvMINv0004,BPvSBPvMINv4DvMINv0001,BPvDBPvMINv4DvMINv0001,BPvHRvMINv4DvMINv0001,BPvSBPvLOADv4DvRATIOv0002,BPvDBPvLOADv4DvRATIOv0002,BPvSBPvLOADv4DvRATIOv0003,BPvDBPvLOADv4DvRATIOv0003,BPvSBPvLOADv4DvRATIOv0004,BPvDBPvLOADv4DvRATIOv0004,BPvSBPvLOADv4DvRATIOv0001,BPvDBPvLOADv4DvRATIOv0001,JLvRULEv4DvBPCHECKv0022,JLvRULEv4DvBPCHECKv0027,JLvRULEv4DvBPCHECKv0023,JLvRULEv4DvBPCHECKv0028,JLvRULEv4DvBPCHECKv0024,JLvRULEv4DvBPCHECKv0029,JLvRULEv4DvBPCHECKv0021,JLvRULEv4DvBPCHECKv0026,BPvSBPvNBRv4DvRATIOv0001,BPvDBPvNBRv4DvRATIOv0001,JLvRULEv4DvBPCHECKv0013,JLvRULEv4DvBPCHECKv0014,JLvRULEv4DvBPCHECKv0015,JLvRULEv4DvBPCHECKv0016,JLvRULEv4DvBPCHECKv0017,JLvRULEv4DvBPCHECKv0018, JLvRULEv4DvBPCHECKv0019, JLvRULEv4DvBPCHECKv0020,BPvSBPvMBSv4DvMINUSv0001,BPvDBPvMBSv4DvMINUSv0001,JLvRULEv4DvBPCHECKv0031,BPvSBPvCVv4DvRATIO2v0002,BPvDBPvCVv4DvRATIO2v0002,BPvHRvCVv4DvRATIO2v0002,BPvSBPvCVv4DvRATIO2v0003,BPvDBPvCVv4DvRATIO2v0003,BPvHRvCVv4DvRATIO2v0003,BPvSBPvCVv4DvRATIO2v0004,BPvDBPvCVv4DvRATIO2v0004,BPvHRvCVv4DvRATIO2v0004,BPvSBPvCVv4DvRATIO2v0001,BPvDBPvCVv4DvRATIO2v0001,BPvHRvCVv4DvRATIO2v0001,BPvAASIv4D,JLvRULEv4DvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "5") {
				this.filterVarList = "JLvFLGvJL01v5D"
				this.period = "5D"
				this.finlretVarList1 =
					'BPvSBPvCNTv5DvCNTv0002,BPvSBPvCNTv5DvCNTv0003,BPvSBPvCNTv5DvCNTv0004,BPvSBPvCNTv5DvCNTv0001,JLvRULEv5DvDATACHECKv0001,JLvRULEv5DvDATACHECKv0002,JLvRULEv5DvDATACHECKv0003,BPvSBPvAVGv5DvAVGv0002,BPvDBPvAVGv5DvAVGv0002,BPvHRvAVGv5DvAVGv0002,BPvSBPvAVGv5DvAVGv0003,BPvDBPvAVGv5DvAVGv0003,BPvHRvAVGv5DvAVGv0003,BPvSBPvAVGv5DvAVGv0004,BPvDBPvAVGv5DvAVGv0004,BPvHRvAVGv5DvAVGv0004,BPvSBPvAVGv5DvAVGv0001,BPvDBPvAVGv5DvAVGv0001,BPvHRvAVGv5DvAVGv0001,JLvRULEv5DvBPCHECKv0004,JLvRULEv5DvBPCHECKv0005,JLvRULEv5DvBPCHECKv0007,JLvRULEv5DvBPCHECKv0008,JLvRULEv5DvBPCHECKv0010,JLvRULEv5DvBPCHECKv0011,JLvRULEv5DvBPCHECKv0001,JLvRULEv5DvBPCHECKv0002,BPvSBPvSTDv5DvSTDv0002,BPvDBPvSTDv5DvSTDv0002,BPvHRvSTDv5DvSTDv0002,BPvSBPvSTDv5DvSTDv0003,BPvDBPvSTDv5DvSTDv0003,BPvHRvSTDv5DvSTDv0003,BPvSBPvSTDv5DvSTDv0004,BPvDBPvSTDv5DvSTDv0004,BPvHRvSTDv5DvSTDv0004,BPvSBPvSTDv5DvSTDv0001,BPvDBPvSTDv5DvSTDv0001,BPvHRvSTDv5DvSTDv0001,BPvSBPvMAXv5DvMAXv0002,BPvDBPvMAXv5DvMAXv0002,BPvHRvMAXv5DvMAXv0002,BPvSBPvMAXv5DvMAXv0003,BPvDBPvMAXv5DvMAXv0003,BPvHRvMAXv5DvMAXv0003,BPvSBPvMAXv5DvMAXv0004,BPvDBPvMAXv5DvMAXv0004,BPvHRvMAXv5DvMAXv0004,BPvSBPvMAXv5DvMAXv0001,BPvDBPvMAXv5DvMAXv0001,BPvHRvMAXv5DvMAXv0001,BPvSBPvMEDv5DvMEDv0002,BPvDBPvMEDv5DvMEDv0002,BPvHRvMEDv5DvMEDv0002,BPvSBPvMEDv5DvMEDv0003,BPvDBPvMEDv5DvMEDv0003,BPvHRvMEDv5DvMEDv0003,BPvSBPvMEDv5DvMEDv0004,BPvDBPvMEDv5DvMEDv0004,BPvHRvMEDv5DvMEDv0004,BPvSBPvMEDv5DvMEDv0001,BPvDBPvMEDv5DvMEDv0001,BPvHRvMEDv5DvMEDv0001,BPvSBPvMINv5DvMINv0002,BPvDBPvMINv5DvMINv0002,BPvHRvMINv5DvMINv0002,BPvSBPvMINv5DvMINv0003,BPvDBPvMINv5DvMINv0003,BPvHRvMINv5DvMINv0003,BPvSBPvMINv5DvMINv0004,BPvDBPvMINv5DvMINv0004,BPvHRvMINv5DvMINv0004,BPvSBPvMINv5DvMINv0001,BPvDBPvMINv5DvMINv0001,BPvHRvMINv5DvMINv0001,BPvSBPvLOADv5DvRATIOv0002,BPvDBPvLOADv5DvRATIOv0002,BPvSBPvLOADv5DvRATIOv0003,BPvDBPvLOADv5DvRATIOv0003,BPvSBPvLOADv5DvRATIOv0004,BPvDBPvLOADv5DvRATIOv0004,BPvSBPvLOADv5DvRATIOv0001,BPvDBPvLOADv5DvRATIOv0001,JLvRULEv5DvBPCHECKv0022,JLvRULEv5DvBPCHECKv0027,JLvRULEv5DvBPCHECKv0023,JLvRULEv5DvBPCHECKv0028,JLvRULEv5DvBPCHECKv0024,JLvRULEv5DvBPCHECKv0029,JLvRULEv5DvBPCHECKv0021,JLvRULEv5DvBPCHECKv0026,BPvSBPvNBRv5DvRATIOv0001,BPvDBPvNBRv5DvRATIOv0001,JLvRULEv5DvBPCHECKv0013,JLvRULEv5DvBPCHECKv0014,JLvRULEv5DvBPCHECKv0015,JLvRULEv5DvBPCHECKv0016,JLvRULEv5DvBPCHECKv0017,JLvRULEv5DvBPCHECKv0018, JLvRULEv5DvBPCHECKv0019, JLvRULEv5DvBPCHECKv0020,BPvSBPvMBSv5DvMINUSv0001,BPvDBPvMBSv5DvMINUSv0001,JLvRULEv5DvBPCHECKv0031,BPvSBPvCVv5DvRATIO2v0002,BPvDBPvCVv5DvRATIO2v0002,BPvHRvCVv5DvRATIO2v0002,BPvSBPvCVv5DvRATIO2v0003,BPvDBPvCVv5DvRATIO2v0003,BPvHRvCVv5DvRATIO2v0003,BPvSBPvCVv5DvRATIO2v0004,BPvDBPvCVv5DvRATIO2v0004,BPvHRvCVv5DvRATIO2v0004,BPvSBPvCVv5DvRATIO2v0001,BPvDBPvCVv5DvRATIO2v0001,BPvHRvCVv5DvRATIO2v0001,BPvAASIv5D,JLvRULEv5DvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "6") {
				this.filterVarList = "JLvFLGvJL01v6D"
				this.period = "6D"
				this.finlretVarList1 =
					'BPvSBPvCNTv6DvCNTv0002,BPvSBPvCNTv6DvCNTv0003,BPvSBPvCNTv6DvCNTv0004,BPvSBPvCNTv6DvCNTv0001,JLvRULEv6DvDATACHECKv0001,JLvRULEv6DvDATACHECKv0002,JLvRULEv6DvDATACHECKv0003,BPvSBPvAVGv6DvAVGv0002,BPvDBPvAVGv6DvAVGv0002,BPvHRvAVGv6DvAVGv0002,BPvSBPvAVGv6DvAVGv0003,BPvDBPvAVGv6DvAVGv0003,BPvHRvAVGv6DvAVGv0003,BPvSBPvAVGv6DvAVGv0004,BPvDBPvAVGv6DvAVGv0004,BPvHRvAVGv6DvAVGv0004,BPvSBPvAVGv6DvAVGv0001,BPvDBPvAVGv6DvAVGv0001,BPvHRvAVGv6DvAVGv0001,JLvRULEv6DvBPCHECKv0004,JLvRULEv6DvBPCHECKv0005,JLvRULEv6DvBPCHECKv0007,JLvRULEv6DvBPCHECKv0008,JLvRULEv6DvBPCHECKv0010,JLvRULEv6DvBPCHECKv0011,JLvRULEv6DvBPCHECKv0001,JLvRULEv6DvBPCHECKv0002,BPvSBPvSTDv6DvSTDv0002,BPvDBPvSTDv6DvSTDv0002,BPvHRvSTDv6DvSTDv0002,BPvSBPvSTDv6DvSTDv0003,BPvDBPvSTDv6DvSTDv0003,BPvHRvSTDv6DvSTDv0003,BPvSBPvSTDv6DvSTDv0004,BPvDBPvSTDv6DvSTDv0004,BPvHRvSTDv6DvSTDv0004,BPvSBPvSTDv6DvSTDv0001,BPvDBPvSTDv6DvSTDv0001,BPvHRvSTDv6DvSTDv0001,BPvSBPvMAXv6DvMAXv0002,BPvDBPvMAXv6DvMAXv0002,BPvHRvMAXv6DvMAXv0002,BPvSBPvMAXv6DvMAXv0003,BPvDBPvMAXv6DvMAXv0003,BPvHRvMAXv6DvMAXv0003,BPvSBPvMAXv6DvMAXv0004,BPvDBPvMAXv6DvMAXv0004,BPvHRvMAXv6DvMAXv0004,BPvSBPvMAXv6DvMAXv0001,BPvDBPvMAXv6DvMAXv0001,BPvHRvMAXv6DvMAXv0001,BPvSBPvMEDv6DvMEDv0002,BPvDBPvMEDv6DvMEDv0002,BPvHRvMEDv6DvMEDv0002,BPvSBPvMEDv6DvMEDv0003,BPvDBPvMEDv6DvMEDv0003,BPvHRvMEDv6DvMEDv0003,BPvSBPvMEDv6DvMEDv0004,BPvDBPvMEDv6DvMEDv0004,BPvHRvMEDv6DvMEDv0004,BPvSBPvMEDv6DvMEDv0001,BPvDBPvMEDv6DvMEDv0001,BPvHRvMEDv6DvMEDv0001,BPvSBPvMINv6DvMINv0002,BPvDBPvMINv6DvMINv0002,BPvHRvMINv6DvMINv0002,BPvSBPvMINv6DvMINv0003,BPvDBPvMINv6DvMINv0003,BPvHRvMINv6DvMINv0003,BPvSBPvMINv6DvMINv0004,BPvDBPvMINv6DvMINv0004,BPvHRvMINv6DvMINv0004,BPvSBPvMINv6DvMINv0001,BPvDBPvMINv6DvMINv0001,BPvHRvMINv6DvMINv0001,BPvSBPvLOADv6DvRATIOv0002,BPvDBPvLOADv6DvRATIOv0002,BPvSBPvLOADv6DvRATIOv0003,BPvDBPvLOADv6DvRATIOv0003,BPvSBPvLOADv6DvRATIOv0004,BPvDBPvLOADv6DvRATIOv0004,BPvSBPvLOADv6DvRATIOv0001,BPvDBPvLOADv6DvRATIOv0001,JLvRULEv6DvBPCHECKv0022,JLvRULEv6DvBPCHECKv0027,JLvRULEv6DvBPCHECKv0023,JLvRULEv6DvBPCHECKv0028,JLvRULEv6DvBPCHECKv0024,JLvRULEv6DvBPCHECKv0029,JLvRULEv6DvBPCHECKv0021,JLvRULEv6DvBPCHECKv0026,BPvSBPvNBRv6DvRATIOv0001,BPvDBPvNBRv6DvRATIOv0001,JLvRULEv6DvBPCHECKv0013,JLvRULEv6DvBPCHECKv0014,JLvRULEv6DvBPCHECKv0015,JLvRULEv6DvBPCHECKv0016,JLvRULEv6DvBPCHECKv0017,JLvRULEv6DvBPCHECKv0018, JLvRULEv6DvBPCHECKv0019, JLvRULEv6DvBPCHECKv0020,BPvSBPvMBSv6DvMINUSv0001,BPvDBPvMBSv6DvMINUSv0001,JLvRULEv6DvBPCHECKv0031,BPvSBPvCVv6DvRATIO2v0002,BPvDBPvCVv6DvRATIO2v0002,BPvHRvCVv6DvRATIO2v0002,BPvSBPvCVv6DvRATIO2v0003,BPvDBPvCVv6DvRATIO2v0003,BPvHRvCVv6DvRATIO2v0003,BPvSBPvCVv6DvRATIO2v0004,BPvDBPvCVv6DvRATIO2v0004,BPvHRvCVv6DvRATIO2v0004,BPvSBPvCVv6DvRATIO2v0001,BPvDBPvCVv6DvRATIO2v0001,BPvHRvCVv6DvRATIO2v0001,BPvAASIv6D,JLvRULEv6DvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "7") {
				this.filterVarList = "JLvFLGvJL01v1W"
				this.period = "1W"
				this.finlretVarList1 =
					'BPvSBPvCNTv1WvCNTv0002,BPvSBPvCNTv1WvCNTv0003,BPvSBPvCNTv1WvCNTv0004,BPvSBPvCNTv1WvCNTv0001,JLvRULEv1WvDATACHECKv0001,JLvRULEv1WvDATACHECKv0002,JLvRULEv1WvDATACHECKv0003,BPvSBPvAVGv1WvAVGv0002,BPvDBPvAVGv1WvAVGv0002,BPvHRvAVGv1WvAVGv0002,BPvSBPvAVGv1WvAVGv0003,BPvDBPvAVGv1WvAVGv0003,BPvHRvAVGv1WvAVGv0003,BPvSBPvAVGv1WvAVGv0004,BPvDBPvAVGv1WvAVGv0004,BPvHRvAVGv1WvAVGv0004,BPvSBPvAVGv1WvAVGv0001,BPvDBPvAVGv1WvAVGv0001,BPvHRvAVGv1WvAVGv0001,JLvRULEv1WvBPCHECKv0004,JLvRULEv1WvBPCHECKv0005,JLvRULEv1WvBPCHECKv0007,JLvRULEv1WvBPCHECKv0008,JLvRULEv1WvBPCHECKv0010,JLvRULEv1WvBPCHECKv0011,JLvRULEv1WvBPCHECKv0001,JLvRULEv1WvBPCHECKv0002,BPvSBPvSTDv1WvSTDv0002,BPvDBPvSTDv1WvSTDv0002,BPvHRvSTDv1WvSTDv0002,BPvSBPvSTDv1WvSTDv0003,BPvDBPvSTDv1WvSTDv0003,BPvHRvSTDv1WvSTDv0003,BPvSBPvSTDv1WvSTDv0004,BPvDBPvSTDv1WvSTDv0004,BPvHRvSTDv1WvSTDv0004,BPvSBPvSTDv1WvSTDv0001,BPvDBPvSTDv1WvSTDv0001,BPvHRvSTDv1WvSTDv0001,BPvSBPvMAXv1WvMAXv0002,BPvDBPvMAXv1WvMAXv0002,BPvHRvMAXv1WvMAXv0002,BPvSBPvMAXv1WvMAXv0003,BPvDBPvMAXv1WvMAXv0003,BPvHRvMAXv1WvMAXv0003,BPvSBPvMAXv1WvMAXv0004,BPvDBPvMAXv1WvMAXv0004,BPvHRvMAXv1WvMAXv0004,BPvSBPvMAXv1WvMAXv0001,BPvDBPvMAXv1WvMAXv0001,BPvHRvMAXv1WvMAXv0001,BPvSBPvMEDv1WvMEDv0002,BPvDBPvMEDv1WvMEDv0002,BPvHRvMEDv1WvMEDv0002,BPvSBPvMEDv1WvMEDv0003,BPvDBPvMEDv1WvMEDv0003,BPvHRvMEDv1WvMEDv0003,BPvSBPvMEDv1WvMEDv0004,BPvDBPvMEDv1WvMEDv0004,BPvHRvMEDv1WvMEDv0004,BPvSBPvMEDv1WvMEDv0001,BPvDBPvMEDv1WvMEDv0001,BPvHRvMEDv1WvMEDv0001,BPvSBPvMINv1WvMINv0002,BPvDBPvMINv1WvMINv0002,BPvHRvMINv1WvMINv0002,BPvSBPvMINv1WvMINv0003,BPvDBPvMINv1WvMINv0003,BPvHRvMINv1WvMINv0003,BPvSBPvMINv1WvMINv0004,BPvDBPvMINv1WvMINv0004,BPvHRvMINv1WvMINv0004,BPvSBPvMINv1WvMINv0001,BPvDBPvMINv1WvMINv0001,BPvHRvMINv1WvMINv0001,BPvSBPvLOADv1WvRATIOv0002,BPvDBPvLOADv1WvRATIOv0002,BPvSBPvLOADv1WvRATIOv0003,BPvDBPvLOADv1WvRATIOv0003,BPvSBPvLOADv1WvRATIOv0004,BPvDBPvLOADv1WvRATIOv0004,BPvSBPvLOADv1WvRATIOv0001,BPvDBPvLOADv1WvRATIOv0001,JLvRULEv1WvBPCHECKv0022,JLvRULEv1WvBPCHECKv0027,JLvRULEv1WvBPCHECKv0023,JLvRULEv1WvBPCHECKv0028,JLvRULEv1WvBPCHECKv0024,JLvRULEv1WvBPCHECKv0029,JLvRULEv1WvBPCHECKv0021,JLvRULEv1WvBPCHECKv0026,BPvSBPvNBRv1WvRATIOv0001,BPvDBPvNBRv1WvRATIOv0001,JLvRULEv1WvBPCHECKv0013,JLvRULEv1WvBPCHECKv0014,JLvRULEv1WvBPCHECKv0015,JLvRULEv1WvBPCHECKv0016,JLvRULEv1WvBPCHECKv0017,JLvRULEv1WvBPCHECKv0018, JLvRULEv1WvBPCHECKv0019, JLvRULEv1WvBPCHECKv0020,BPvSBPvMBSv1WvMINUSv0001,BPvDBPvMBSv1WvMINUSv0001,JLvRULEv1WvBPCHECKv0031,BPvSBPvCVv1WvRATIO2v0002,BPvDBPvCVv1WvRATIO2v0002,BPvHRvCVv1WvRATIO2v0002,BPvSBPvCVv1WvRATIO2v0003,BPvDBPvCVv1WvRATIO2v0003,BPvHRvCVv1WvRATIO2v0003,BPvSBPvCVv1WvRATIO2v0004,BPvDBPvCVv1WvRATIO2v0004,BPvHRvCVv1WvRATIO2v0004,BPvSBPvCVv1WvRATIO2v0001,BPvDBPvCVv1WvRATIO2v0001,BPvHRvCVv1WvRATIO2v0001,BPvAASIv1W,JLvRULEv1WvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "8") {
				this.filterVarList = "JLvFLGvJL01v2W"
				this.period = "2W"
				this.finlretVarList1 =
					'BPvSBPvCNTv2WvCNTv0002,BPvSBPvCNTv2WvCNTv0003,BPvSBPvCNTv2WvCNTv0004,BPvSBPvCNTv2WvCNTv0001,JLvRULEv2WvDATACHECKv0001,JLvRULEv2WvDATACHECKv0002,JLvRULEv2WvDATACHECKv0003,BPvSBPvAVGv2WvAVGv0002,BPvDBPvAVGv2WvAVGv0002,BPvHRvAVGv2WvAVGv0002,BPvSBPvAVGv2WvAVGv0003,BPvDBPvAVGv2WvAVGv0003,BPvHRvAVGv2WvAVGv0003,BPvSBPvAVGv2WvAVGv0004,BPvDBPvAVGv2WvAVGv0004,BPvHRvAVGv2WvAVGv0004,BPvSBPvAVGv2WvAVGv0001,BPvDBPvAVGv2WvAVGv0001,BPvHRvAVGv2WvAVGv0001,JLvRULEv2WvBPCHECKv0004,JLvRULEv2WvBPCHECKv0005,JLvRULEv2WvBPCHECKv0007,JLvRULEv2WvBPCHECKv0008,JLvRULEv2WvBPCHECKv0010,JLvRULEv2WvBPCHECKv0011,JLvRULEv2WvBPCHECKv0001,JLvRULEv2WvBPCHECKv0002,BPvSBPvSTDv2WvSTDv0002,BPvDBPvSTDv2WvSTDv0002,BPvHRvSTDv2WvSTDv0002,BPvSBPvSTDv2WvSTDv0003,BPvDBPvSTDv2WvSTDv0003,BPvHRvSTDv2WvSTDv0003,BPvSBPvSTDv2WvSTDv0004,BPvDBPvSTDv2WvSTDv0004,BPvHRvSTDv2WvSTDv0004,BPvSBPvSTDv2WvSTDv0001,BPvDBPvSTDv2WvSTDv0001,BPvHRvSTDv2WvSTDv0001,BPvSBPvMAXv2WvMAXv0002,BPvDBPvMAXv2WvMAXv0002,BPvHRvMAXv2WvMAXv0002,BPvSBPvMAXv2WvMAXv0003,BPvDBPvMAXv2WvMAXv0003,BPvHRvMAXv2WvMAXv0003,BPvSBPvMAXv2WvMAXv0004,BPvDBPvMAXv2WvMAXv0004,BPvHRvMAXv2WvMAXv0004,BPvSBPvMAXv2WvMAXv0001,BPvDBPvMAXv2WvMAXv0001,BPvHRvMAXv2WvMAXv0001,BPvSBPvMEDv2WvMEDv0002,BPvDBPvMEDv2WvMEDv0002,BPvHRvMEDv2WvMEDv0002,BPvSBPvMEDv2WvMEDv0003,BPvDBPvMEDv2WvMEDv0003,BPvHRvMEDv2WvMEDv0003,BPvSBPvMEDv2WvMEDv0004,BPvDBPvMEDv2WvMEDv0004,BPvHRvMEDv2WvMEDv0004,BPvSBPvMEDv2WvMEDv0001,BPvDBPvMEDv2WvMEDv0001,BPvHRvMEDv2WvMEDv0001,BPvSBPvMINv2WvMINv0002,BPvDBPvMINv2WvMINv0002,BPvHRvMINv2WvMINv0002,BPvSBPvMINv2WvMINv0003,BPvDBPvMINv2WvMINv0003,BPvHRvMINv2WvMINv0003,BPvSBPvMINv2WvMINv0004,BPvDBPvMINv2WvMINv0004,BPvHRvMINv2WvMINv0004,BPvSBPvMINv2WvMINv0001,BPvDBPvMINv2WvMINv0001,BPvHRvMINv2WvMINv0001,BPvSBPvLOADv2WvRATIOv0002,BPvDBPvLOADv2WvRATIOv0002,BPvSBPvLOADv2WvRATIOv0003,BPvDBPvLOADv2WvRATIOv0003,BPvSBPvLOADv2WvRATIOv0004,BPvDBPvLOADv2WvRATIOv0004,BPvSBPvLOADv2WvRATIOv0001,BPvDBPvLOADv2WvRATIOv0001,JLvRULEv2WvBPCHECKv0022,JLvRULEv2WvBPCHECKv0027,JLvRULEv2WvBPCHECKv0023,JLvRULEv2WvBPCHECKv0028,JLvRULEv2WvBPCHECKv0024,JLvRULEv2WvBPCHECKv0029,JLvRULEv2WvBPCHECKv0021,JLvRULEv2WvBPCHECKv0026,BPvSBPvNBRv2WvRATIOv0001,BPvDBPvNBRv2WvRATIOv0001,JLvRULEv2WvBPCHECKv0013,JLvRULEv2WvBPCHECKv0014,JLvRULEv2WvBPCHECKv0015,JLvRULEv2WvBPCHECKv0016,JLvRULEv2WvBPCHECKv0017,JLvRULEv2WvBPCHECKv0018, JLvRULEv2WvBPCHECKv0019, JLvRULEv2WvBPCHECKv0020,BPvSBPvMBSv2WvMINUSv0001,BPvDBPvMBSv2WvMINUSv0001,JLvRULEv2WvBPCHECKv0031,BPvSBPvCVv2WvRATIO2v0002,BPvDBPvCVv2WvRATIO2v0002,BPvHRvCVv2WvRATIO2v0002,BPvSBPvCVv2WvRATIO2v0003,BPvDBPvCVv2WvRATIO2v0003,BPvHRvCVv2WvRATIO2v0003,BPvSBPvCVv2WvRATIO2v0004,BPvDBPvCVv2WvRATIO2v0004,BPvHRvCVv2WvRATIO2v0004,BPvSBPvCVv2WvRATIO2v0001,BPvDBPvCVv2WvRATIO2v0001,BPvHRvCVv2WvRATIO2v0001,BPvAASIv2W,JLvRULEv2WvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "9") {
				this.filterVarList = "JLvFLGvJL01v3W"
				this.period = "3W"
				this.finlretVarList1 =
					'BPvSBPvCNTv3WvCNTv0002,BPvSBPvCNTv3WvCNTv0003,BPvSBPvCNTv3WvCNTv0004,BPvSBPvCNTv3WvCNTv0001,JLvRULEv3WvDATACHECKv0001,JLvRULEv3WvDATACHECKv0002,JLvRULEv3WvDATACHECKv0003,BPvSBPvAVGv3WvAVGv0002,BPvDBPvAVGv3WvAVGv0002,BPvHRvAVGv3WvAVGv0002,BPvSBPvAVGv3WvAVGv0003,BPvDBPvAVGv3WvAVGv0003,BPvHRvAVGv3WvAVGv0003,BPvSBPvAVGv3WvAVGv0004,BPvDBPvAVGv3WvAVGv0004,BPvHRvAVGv3WvAVGv0004,BPvSBPvAVGv3WvAVGv0001,BPvDBPvAVGv3WvAVGv0001,BPvHRvAVGv3WvAVGv0001,JLvRULEv3WvBPCHECKv0004,JLvRULEv3WvBPCHECKv0005,JLvRULEv3WvBPCHECKv0007,JLvRULEv3WvBPCHECKv0008,JLvRULEv3WvBPCHECKv0010,JLvRULEv3WvBPCHECKv0011,JLvRULEv3WvBPCHECKv0001,JLvRULEv3WvBPCHECKv0002,BPvSBPvSTDv3WvSTDv0002,BPvDBPvSTDv3WvSTDv0002,BPvHRvSTDv3WvSTDv0002,BPvSBPvSTDv3WvSTDv0003,BPvDBPvSTDv3WvSTDv0003,BPvHRvSTDv3WvSTDv0003,BPvSBPvSTDv3WvSTDv0004,BPvDBPvSTDv3WvSTDv0004,BPvHRvSTDv3WvSTDv0004,BPvSBPvSTDv3WvSTDv0001,BPvDBPvSTDv3WvSTDv0001,BPvHRvSTDv3WvSTDv0001,BPvSBPvMAXv3WvMAXv0002,BPvDBPvMAXv3WvMAXv0002,BPvHRvMAXv3WvMAXv0002,BPvSBPvMAXv3WvMAXv0003,BPvDBPvMAXv3WvMAXv0003,BPvHRvMAXv3WvMAXv0003,BPvSBPvMAXv3WvMAXv0004,BPvDBPvMAXv3WvMAXv0004,BPvHRvMAXv3WvMAXv0004,BPvSBPvMAXv3WvMAXv0001,BPvDBPvMAXv3WvMAXv0001,BPvHRvMAXv3WvMAXv0001,BPvSBPvMEDv3WvMEDv0002,BPvDBPvMEDv3WvMEDv0002,BPvHRvMEDv3WvMEDv0002,BPvSBPvMEDv3WvMEDv0003,BPvDBPvMEDv3WvMEDv0003,BPvHRvMEDv3WvMEDv0003,BPvSBPvMEDv3WvMEDv0004,BPvDBPvMEDv3WvMEDv0004,BPvHRvMEDv3WvMEDv0004,BPvSBPvMEDv3WvMEDv0001,BPvDBPvMEDv3WvMEDv0001,BPvHRvMEDv3WvMEDv0001,BPvSBPvMINv3WvMINv0002,BPvDBPvMINv3WvMINv0002,BPvHRvMINv3WvMINv0002,BPvSBPvMINv3WvMINv0003,BPvDBPvMINv3WvMINv0003,BPvHRvMINv3WvMINv0003,BPvSBPvMINv3WvMINv0004,BPvDBPvMINv3WvMINv0004,BPvHRvMINv3WvMINv0004,BPvSBPvMINv3WvMINv0001,BPvDBPvMINv3WvMINv0001,BPvHRvMINv3WvMINv0001,BPvSBPvLOADv3WvRATIOv0002,BPvDBPvLOADv3WvRATIOv0002,BPvSBPvLOADv3WvRATIOv0003,BPvDBPvLOADv3WvRATIOv0003,BPvSBPvLOADv3WvRATIOv0004,BPvDBPvLOADv3WvRATIOv0004,BPvSBPvLOADv3WvRATIOv0001,BPvDBPvLOADv3WvRATIOv0001,JLvRULEv3WvBPCHECKv0022,JLvRULEv3WvBPCHECKv0027,JLvRULEv3WvBPCHECKv0023,JLvRULEv3WvBPCHECKv0028,JLvRULEv3WvBPCHECKv0024,JLvRULEv3WvBPCHECKv0029,JLvRULEv3WvBPCHECKv0021,JLvRULEv3WvBPCHECKv0026,BPvSBPvNBRv3WvRATIOv0001,BPvDBPvNBRv3WvRATIOv0001,JLvRULEv3WvBPCHECKv0013,JLvRULEv3WvBPCHECKv0014,JLvRULEv3WvBPCHECKv0015,JLvRULEv3WvBPCHECKv0016,JLvRULEv3WvBPCHECKv0017,JLvRULEv3WvBPCHECKv0018, JLvRULEv3WvBPCHECKv0019, JLvRULEv3WvBPCHECKv0020,BPvSBPvMBSv3WvMINUSv0001,BPvDBPvMBSv3WvMINUSv0001,JLvRULEv3WvBPCHECKv0031,BPvSBPvCVv3WvRATIO2v0002,BPvDBPvCVv3WvRATIO2v0002,BPvHRvCVv3WvRATIO2v0002,BPvSBPvCVv3WvRATIO2v0003,BPvDBPvCVv3WvRATIO2v0003,BPvHRvCVv3WvRATIO2v0003,BPvSBPvCVv3WvRATIO2v0004,BPvDBPvCVv3WvRATIO2v0004,BPvHRvCVv3WvRATIO2v0004,BPvSBPvCVv3WvRATIO2v0001,BPvDBPvCVv3WvRATIO2v0001,BPvHRvCVv3WvRATIO2v0001,BPvAASIv3W,JLvRULEv3WvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "10") {
				this.filterVarList = "JLvFLGvJL01v1M"
				this.period = "1M"
				this.finlretVarList1 =
					'BPvSBPvCNTv1MvCNTv0002,BPvSBPvCNTv1MvCNTv0003,BPvSBPvCNTv1MvCNTv0004,BPvSBPvCNTv1MvCNTv0001,JLvRULEv1MvDATACHECKv0001,JLvRULEv1MvDATACHECKv0002,JLvRULEv1MvDATACHECKv0003,BPvSBPvAVGv1MvAVGv0002,BPvDBPvAVGv1MvAVGv0002,BPvHRvAVGv1MvAVGv0002,BPvSBPvAVGv1MvAVGv0003,BPvDBPvAVGv1MvAVGv0003,BPvHRvAVGv1MvAVGv0003,BPvSBPvAVGv1MvAVGv0004,BPvDBPvAVGv1MvAVGv0004,BPvHRvAVGv1MvAVGv0004,BPvSBPvAVGv1MvAVGv0001,BPvDBPvAVGv1MvAVGv0001,BPvHRvAVGv1MvAVGv0001,JLvRULEv1MvBPCHECKv0004,JLvRULEv1MvBPCHECKv0005,JLvRULEv1MvBPCHECKv0007,JLvRULEv1MvBPCHECKv0008,JLvRULEv1MvBPCHECKv0010,JLvRULEv1MvBPCHECKv0011,JLvRULEv1MvBPCHECKv0001,JLvRULEv1MvBPCHECKv0002,BPvSBPvSTDv1MvSTDv0002,BPvDBPvSTDv1MvSTDv0002,BPvHRvSTDv1MvSTDv0002,BPvSBPvSTDv1MvSTDv0003,BPvDBPvSTDv1MvSTDv0003,BPvHRvSTDv1MvSTDv0003,BPvSBPvSTDv1MvSTDv0004,BPvDBPvSTDv1MvSTDv0004,BPvHRvSTDv1MvSTDv0004,BPvSBPvSTDv1MvSTDv0001,BPvDBPvSTDv1MvSTDv0001,BPvHRvSTDv1MvSTDv0001,BPvSBPvMAXv1MvMAXv0002,BPvDBPvMAXv1MvMAXv0002,BPvHRvMAXv1MvMAXv0002,BPvSBPvMAXv1MvMAXv0003,BPvDBPvMAXv1MvMAXv0003,BPvHRvMAXv1MvMAXv0003,BPvSBPvMAXv1MvMAXv0004,BPvDBPvMAXv1MvMAXv0004,BPvHRvMAXv1MvMAXv0004,BPvSBPvMAXv1MvMAXv0001,BPvDBPvMAXv1MvMAXv0001,BPvHRvMAXv1MvMAXv0001,BPvSBPvMEDv1MvMEDv0002,BPvDBPvMEDv1MvMEDv0002,BPvHRvMEDv1MvMEDv0002,BPvSBPvMEDv1MvMEDv0003,BPvDBPvMEDv1MvMEDv0003,BPvHRvMEDv1MvMEDv0003,BPvSBPvMEDv1MvMEDv0004,BPvDBPvMEDv1MvMEDv0004,BPvHRvMEDv1MvMEDv0004,BPvSBPvMEDv1MvMEDv0001,BPvDBPvMEDv1MvMEDv0001,BPvHRvMEDv1MvMEDv0001,BPvSBPvMINv1MvMINv0002,BPvDBPvMINv1MvMINv0002,BPvHRvMINv1MvMINv0002,BPvSBPvMINv1MvMINv0003,BPvDBPvMINv1MvMINv0003,BPvHRvMINv1MvMINv0003,BPvSBPvMINv1MvMINv0004,BPvDBPvMINv1MvMINv0004,BPvHRvMINv1MvMINv0004,BPvSBPvMINv1MvMINv0001,BPvDBPvMINv1MvMINv0001,BPvHRvMINv1MvMINv0001,BPvSBPvLOADv1MvRATIOv0002,BPvDBPvLOADv1MvRATIOv0002,BPvSBPvLOADv1MvRATIOv0003,BPvDBPvLOADv1MvRATIOv0003,BPvSBPvLOADv1MvRATIOv0004,BPvDBPvLOADv1MvRATIOv0004,BPvSBPvLOADv1MvRATIOv0001,BPvDBPvLOADv1MvRATIOv0001,JLvRULEv1MvBPCHECKv0022,JLvRULEv1MvBPCHECKv0027,JLvRULEv1MvBPCHECKv0023,JLvRULEv1MvBPCHECKv0028,JLvRULEv1MvBPCHECKv0024,JLvRULEv1MvBPCHECKv0029,JLvRULEv1MvBPCHECKv0021,JLvRULEv1MvBPCHECKv0026,BPvSBPvNBRv1MvRATIOv0001,BPvDBPvNBRv1MvRATIOv0001,JLvRULEv1MvBPCHECKv0013,JLvRULEv1MvBPCHECKv0014,JLvRULEv1MvBPCHECKv0015,JLvRULEv1MvBPCHECKv0016,JLvRULEv1MvBPCHECKv0017,JLvRULEv1MvBPCHECKv0018, JLvRULEv1MvBPCHECKv0019, JLvRULEv1MvBPCHECKv0020,BPvSBPvMBSv1MvMINUSv0001,BPvDBPvMBSv1MvMINUSv0001,JLvRULEv1MvBPCHECKv0031,BPvSBPvCVv1MvRATIO2v0002,BPvDBPvCVv1MvRATIO2v0002,BPvHRvCVv1MvRATIO2v0002,BPvSBPvCVv1MvRATIO2v0003,BPvDBPvCVv1MvRATIO2v0003,BPvHRvCVv1MvRATIO2v0003,BPvSBPvCVv1MvRATIO2v0004,BPvDBPvCVv1MvRATIO2v0004,BPvHRvCVv1MvRATIO2v0004,BPvSBPvCVv1MvRATIO2v0001,BPvDBPvCVv1MvRATIO2v0001,BPvHRvCVv1MvRATIO2v0001,BPvAASIv1M,JLvRULEv1MvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "11") {
				this.filterVarList = "JLvFLGvJL01v2M"
				this.period = "2M"
				this.finlretVarList1 =
					'BPvSBPvCNTv2MvCNTv0002,BPvSBPvCNTv2MvCNTv0003,BPvSBPvCNTv2MvCNTv0004,BPvSBPvCNTv2MvCNTv0001,JLvRULEv2MvDATACHECKv0001,JLvRULEv2MvDATACHECKv0002,JLvRULEv2MvDATACHECKv0003,BPvSBPvAVGv2MvAVGv0002,BPvDBPvAVGv2MvAVGv0002,BPvHRvAVGv2MvAVGv0002,BPvSBPvAVGv2MvAVGv0003,BPvDBPvAVGv2MvAVGv0003,BPvHRvAVGv2MvAVGv0003,BPvSBPvAVGv2MvAVGv0004,BPvDBPvAVGv2MvAVGv0004,BPvHRvAVGv2MvAVGv0004,BPvSBPvAVGv2MvAVGv0001,BPvDBPvAVGv2MvAVGv0001,BPvHRvAVGv2MvAVGv0001,JLvRULEv2MvBPCHECKv0004,JLvRULEv2MvBPCHECKv0005,JLvRULEv2MvBPCHECKv0007,JLvRULEv2MvBPCHECKv0008,JLvRULEv2MvBPCHECKv0010,JLvRULEv2MvBPCHECKv0011,JLvRULEv2MvBPCHECKv0001,JLvRULEv2MvBPCHECKv0002,BPvSBPvSTDv2MvSTDv0002,BPvDBPvSTDv2MvSTDv0002,BPvHRvSTDv2MvSTDv0002,BPvSBPvSTDv2MvSTDv0003,BPvDBPvSTDv2MvSTDv0003,BPvHRvSTDv2MvSTDv0003,BPvSBPvSTDv2MvSTDv0004,BPvDBPvSTDv2MvSTDv0004,BPvHRvSTDv2MvSTDv0004,BPvSBPvSTDv2MvSTDv0001,BPvDBPvSTDv2MvSTDv0001,BPvHRvSTDv2MvSTDv0001,BPvSBPvMAXv2MvMAXv0002,BPvDBPvMAXv2MvMAXv0002,BPvHRvMAXv2MvMAXv0002,BPvSBPvMAXv2MvMAXv0003,BPvDBPvMAXv2MvMAXv0003,BPvHRvMAXv2MvMAXv0003,BPvSBPvMAXv2MvMAXv0004,BPvDBPvMAXv2MvMAXv0004,BPvHRvMAXv2MvMAXv0004,BPvSBPvMAXv2MvMAXv0001,BPvDBPvMAXv2MvMAXv0001,BPvHRvMAXv2MvMAXv0001,BPvSBPvMEDv2MvMEDv0002,BPvDBPvMEDv2MvMEDv0002,BPvHRvMEDv2MvMEDv0002,BPvSBPvMEDv2MvMEDv0003,BPvDBPvMEDv2MvMEDv0003,BPvHRvMEDv2MvMEDv0003,BPvSBPvMEDv2MvMEDv0004,BPvDBPvMEDv2MvMEDv0004,BPvHRvMEDv2MvMEDv0004,BPvSBPvMEDv2MvMEDv0001,BPvDBPvMEDv2MvMEDv0001,BPvHRvMEDv2MvMEDv0001,BPvSBPvMINv2MvMINv0002,BPvDBPvMINv2MvMINv0002,BPvHRvMINv2MvMINv0002,BPvSBPvMINv2MvMINv0003,BPvDBPvMINv2MvMINv0003,BPvHRvMINv2MvMINv0003,BPvSBPvMINv2MvMINv0004,BPvDBPvMINv2MvMINv0004,BPvHRvMINv2MvMINv0004,BPvSBPvMINv2MvMINv0001,BPvDBPvMINv2MvMINv0001,BPvHRvMINv2MvMINv0001,BPvSBPvLOADv2MvRATIOv0002,BPvDBPvLOADv2MvRATIOv0002,BPvSBPvLOADv2MvRATIOv0003,BPvDBPvLOADv2MvRATIOv0003,BPvSBPvLOADv2MvRATIOv0004,BPvDBPvLOADv2MvRATIOv0004,BPvSBPvLOADv2MvRATIOv0001,BPvDBPvLOADv2MvRATIOv0001,JLvRULEv2MvBPCHECKv0022,JLvRULEv2MvBPCHECKv0027,JLvRULEv2MvBPCHECKv0023,JLvRULEv2MvBPCHECKv0028,JLvRULEv2MvBPCHECKv0024,JLvRULEv2MvBPCHECKv0029,JLvRULEv2MvBPCHECKv0021,JLvRULEv2MvBPCHECKv0026,BPvSBPvNBRv2MvRATIOv0001,BPvDBPvNBRv2MvRATIOv0001,JLvRULEv2MvBPCHECKv0013,JLvRULEv2MvBPCHECKv0014,JLvRULEv2MvBPCHECKv0015,JLvRULEv2MvBPCHECKv0016,JLvRULEv2MvBPCHECKv0017,JLvRULEv2MvBPCHECKv0018, JLvRULEv2MvBPCHECKv0019, JLvRULEv2MvBPCHECKv0020,BPvSBPvMBSv2MvMINUSv0001,BPvDBPvMBSv2MvMINUSv0001,JLvRULEv2MvBPCHECKv0031,BPvSBPvCVv2MvRATIO2v0002,BPvDBPvCVv2MvRATIO2v0002,BPvHRvCVv2MvRATIO2v0002,BPvSBPvCVv2MvRATIO2v0003,BPvDBPvCVv2MvRATIO2v0003,BPvHRvCVv2MvRATIO2v0003,BPvSBPvCVv2MvRATIO2v0004,BPvDBPvCVv2MvRATIO2v0004,BPvHRvCVv2MvRATIO2v0004,BPvSBPvCVv2MvRATIO2v0001,BPvDBPvCVv2MvRATIO2v0001,BPvHRvCVv2MvRATIO2v0001,BPvAASIv2M,JLvRULEv2MvBPCHECKv0032'
					.toLowerCase()
			} else if (res.index1 == "12") {
				this.filterVarList = "JLvFLGvJL01v3M"
				this.period = "3M"
				this.finlretVarList1 =
					'BPvSBPvCNTv3MvCNTv0002,BPvSBPvCNTv3MvCNTv0003,BPvSBPvCNTv3MvCNTv0004,BPvSBPvCNTv3MvCNTv0001,JLvRULEv3MvDATACHECKv0001,JLvRULEv3MvDATACHECKv0002,JLvRULEv3MvDATACHECKv0003,BPvSBPvAVGv3MvAVGv0002,BPvDBPvAVGv3MvAVGv0002,BPvHRvAVGv3MvAVGv0002,BPvSBPvAVGv3MvAVGv0003,BPvDBPvAVGv3MvAVGv0003,BPvHRvAVGv3MvAVGv0003,BPvSBPvAVGv3MvAVGv0004,BPvDBPvAVGv3MvAVGv0004,BPvHRvAVGv3MvAVGv0004,BPvSBPvAVGv3MvAVGv0001,BPvDBPvAVGv3MvAVGv0001,BPvHRvAVGv3MvAVGv0001,JLvRULEv3MvBPCHECKv0004,JLvRULEv3MvBPCHECKv0005,JLvRULEv3MvBPCHECKv0007,JLvRULEv3MvBPCHECKv0008,JLvRULEv3MvBPCHECKv0010,JLvRULEv3MvBPCHECKv0011,JLvRULEv3MvBPCHECKv0001,JLvRULEv3MvBPCHECKv0002,BPvSBPvSTDv3MvSTDv0002,BPvDBPvSTDv3MvSTDv0002,BPvHRvSTDv3MvSTDv0002,BPvSBPvSTDv3MvSTDv0003,BPvDBPvSTDv3MvSTDv0003,BPvHRvSTDv3MvSTDv0003,BPvSBPvSTDv3MvSTDv0004,BPvDBPvSTDv3MvSTDv0004,BPvHRvSTDv3MvSTDv0004,BPvSBPvSTDv3MvSTDv0001,BPvDBPvSTDv3MvSTDv0001,BPvHRvSTDv3MvSTDv0001,BPvSBPvMAXv3MvMAXv0002,BPvDBPvMAXv3MvMAXv0002,BPvHRvMAXv3MvMAXv0002,BPvSBPvMAXv3MvMAXv0003,BPvDBPvMAXv3MvMAXv0003,BPvHRvMAXv3MvMAXv0003,BPvSBPvMAXv3MvMAXv0004,BPvDBPvMAXv3MvMAXv0004,BPvHRvMAXv3MvMAXv0004,BPvSBPvMAXv3MvMAXv0001,BPvDBPvMAXv3MvMAXv0001,BPvHRvMAXv3MvMAXv0001,BPvSBPvMEDv3MvMEDv0002,BPvDBPvMEDv3MvMEDv0002,BPvHRvMEDv3MvMEDv0002,BPvSBPvMEDv3MvMEDv0003,BPvDBPvMEDv3MvMEDv0003,BPvHRvMEDv3MvMEDv0003,BPvSBPvMEDv3MvMEDv0004,BPvDBPvMEDv3MvMEDv0004,BPvHRvMEDv3MvMEDv0004,BPvSBPvMEDv3MvMEDv0001,BPvDBPvMEDv3MvMEDv0001,BPvHRvMEDv3MvMEDv0001,BPvSBPvMINv3MvMINv0002,BPvDBPvMINv3MvMINv0002,BPvHRvMINv3MvMINv0002,BPvSBPvMINv3MvMINv0003,BPvDBPvMINv3MvMINv0003,BPvHRvMINv3MvMINv0003,BPvSBPvMINv3MvMINv0004,BPvDBPvMINv3MvMINv0004,BPvHRvMINv3MvMINv0004,BPvSBPvMINv3MvMINv0001,BPvDBPvMINv3MvMINv0001,BPvHRvMINv3MvMINv0001,BPvSBPvLOADv3MvRATIOv0002,BPvDBPvLOADv3MvRATIOv0002,BPvSBPvLOADv3MvRATIOv0003,BPvDBPvLOADv3MvRATIOv0003,BPvSBPvLOADv3MvRATIOv0004,BPvDBPvLOADv3MvRATIOv0004,BPvSBPvLOADv3MvRATIOv0001,BPvDBPvLOADv3MvRATIOv0001,JLvRULEv3MvBPCHECKv0022,JLvRULEv3MvBPCHECKv0027,JLvRULEv3MvBPCHECKv0023,JLvRULEv3MvBPCHECKv0028,JLvRULEv3MvBPCHECKv0024,JLvRULEv3MvBPCHECKv0029,JLvRULEv3MvBPCHECKv0021,JLvRULEv3MvBPCHECKv0026,BPvSBPvNBRv3MvRATIOv0001,BPvDBPvNBRv3MvRATIOv0001,JLvRULEv3MvBPCHECKv0013,JLvRULEv3MvBPCHECKv0014,JLvRULEv3MvBPCHECKv0015,JLvRULEv3MvBPCHECKv0016,JLvRULEv3MvBPCHECKv0017,JLvRULEv3MvBPCHECKv0018, JLvRULEv3MvBPCHECKv0019, JLvRULEv3MvBPCHECKv0020,BPvSBPvMBSv3MvMINUSv0001,BPvDBPvMBSv3MvMINUSv0001,JLvRULEv3MvBPCHECKv0031,BPvSBPvCVv3MvRATIO2v0002,BPvDBPvCVv3MvRATIO2v0002,BPvHRvCVv3MvRATIO2v0002,BPvSBPvCVv3MvRATIO2v0003,BPvDBPvCVv3MvRATIO2v0003,BPvHRvCVv3MvRATIO2v0003,BPvSBPvCVv3MvRATIO2v0004,BPvDBPvCVv3MvRATIO2v0004,BPvHRvCVv3MvRATIO2v0004,BPvSBPvCVv3MvRATIO2v0001,BPvDBPvCVv3MvRATIO2v0001,BPvHRvCVv3MvRATIO2v0001,BPvAASIv3M,JLvRULEv3MvBPCHECKv0032'
					.toLowerCase()
			}
		},
		onShow() {
			this.getUserInfo()
			this.queryDevices()
		},
		methods: {

			toggleExpand() {
				this.isExpanded = !this.isExpanded;
			},

			back() {
				uni.navigateBack()
			},
			getblackgroud(data) {
				return {
					background: data === "0" ? "#FFFFFF" : "#FF0000"
				}
			},
			generatePDF() {
				this.$refs.popup.open("buttom")
			},

			sex_yes() {
				this.$refs.popup.close()
				uni.navigateTo({
					url: "../../tabBar/tendency/dtyulanya?profDate=" + this.pacitime + "&time=" + this
						.Wake_up_time +
						"&time1=" + this.bedtime + "&select=" + this.Whether_to_take + "&index=" + this
						.Lunch_break + "&select2=" + this.medication + "&select4=" + this.Whether_the_work +
						"&index1=" + this.filterVarList + "&idsss=" + this.idsss + "&period=" + this.period +
						"&finlretVarList1=" + this.finlretVarList1
				})
			},

			sex_no() {
				this.$refs.popup.close()
			},

			getUserInfo() {
				this.$get(this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						this.name = res.data.nickName === null ? res.data.userName : res.data.nickName
						if (res.data.sex === "0") {
							this.sex = this.$t("男")
						} else {
							this.sex = this.$t("女")
						}
					}
				})
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
						if (res.data.code == 200) {
							if (res.data.rows == "") {
								uni.showToast({
									title: that.$t("此账号还未绑定血压计设备"),
									icon: 'none'
								})
								return
							} else {
								// 使用 every() 方法
								const allElementsNot3000 = res.data.rows.every((item) => item.deviceModelId !==
									"30000");
								if (allElementsNot3000) {
									// console.log("数组中没有任何元素等于 3000");
									for (let i = 0; res.data.rows.length > i; i++) {
										if (res.data.rows[i].deviceModelId === "10005") {
											let deviceSnlist = []
											deviceSnlist.push(res.data.rows[i].deviceSn)
											that.Testing_equipment = res.data.rows[i].name
											that.get_retVarList(res.data.rows[i].deviceSn)
											that.get_finalRetVarList(res.data.rows[i].deviceSn)
											that.query_log_v2(deviceSnlist)
										}
									}
									that.shebei = 0
								} else {
									for (let i = 0; res.data.rows.length > i; i++) {
										if (res.data.rows[i].deviceModelId === "30000") {
											let deviceSnlist = []
											deviceSnlist.push(res.data.rows[i].deviceSn)
											that.Testing_equipment = res.data.rows[i].name
											that.get_retVarList(res.data.rows[i].deviceSn)
											that.get_finalRetVarList(res.data.rows[i].deviceSn)
											that.query_log_v2(deviceSnlist)
										}
									}
									that.shebei = 1
								}
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

			get_retVarList(deviceSn) {
				let that = this
				console.log("get_retVarList", that.pacitime)
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/device_app/get_retVarList",
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						profDate: that.pacitime,
						filterVarList: that.filterVarList,
						retVarList: 'TIME_MEASURE,JLvOPRvJL01vSBP,JLvOPRvJL01vDBP,JLvOPRvJL01vHR'
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(get_retVarList) {
						if (get_retVarList.data.code === 200) {
							let resultArray = get_retVarList.data.data.retVarList.split(";");
							that.chartData.categories = []
							for (let i = 0; resultArray.length > i; i++) {
								let resultArray1 = resultArray[i].split(",");
								if (that.idsss === "1") {
									that.chartData.categories.push(resultArray1[0].trim().slice(10, 13) + that.$t(
										"时"))
								} else {
									that.chartData.categories.push(resultArray1[0].trim().slice(8, 10) + that.$t(
										"日"))
								}
								that.chartData.series[0].data.push(resultArray1[1])
								that.chartData.series[1].data.push(resultArray1[2])
								that.chartData.series[2].data.push(resultArray1[3])
							}
						} else {
							that.chartData.categories = []
							that.chartData.series[0].data = []
							that.chartData.series[1].data = []
							that.chartData.series[2].data = []
						}
					}
				})
			},

			//血压指标最终表查询
			get_finalRetVarList(deviceSn) {
				let that = this
				console.log("get_finalRetVarList", that.pacitime)
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/device_app/get_finalRetVarList",
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						profDate: that.pacitime,
						period: that.period,
						retVarList: that.finlretVarList1
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(get_finalRetVarList) {
						if (get_finalRetVarList.data.code === 200) {
							if (get_finalRetVarList.data.data.retVarList !== "") {
								let resultArray = get_finalRetVarList.data.data.retVarList.split(";");
								const checkAndAssign = (value) => {
									return value === "999999998.00" || value === "999999999.00" ? "NA" : value;
								};
								for (let i = 0; i < resultArray.length; i++) {
									let resultArray1 = resultArray[i].split(",");
									// 有效数据个数百分比
									that.youxiao_SZY_b = checkAndAssign(resultArray1[0]);
									that.youxiao_SZY_Y = checkAndAssign(resultArray1[1]);
									that.youxiao_SZY_Q = checkAndAssign(resultArray1[2]);
									that.youxiao_SZY_H = checkAndAssign(resultArray1[3]);
									that.youxiao_1 = resultArray1[4]
									that.youxiao_2 = resultArray1[5]
									that.youxiao_3 = resultArray1[6]
									if (that.youxiao_3 === "0") {
										that.jianyi6 = ""
										that.fenxi11 = ""
									} else {
										that.jianyi6 = that.$t("建议9")
										that.fenxi11 = that.$t("分析9")
									}
									// 均值
									that.junzhi_SZY_b = checkAndAssign(resultArray1[7]);
									that.junzhi_SSY_b = checkAndAssign(resultArray1[8]);
									that.junzhi_pulse_b = checkAndAssign(resultArray1[9]);
									that.junzhi_SZY_Y = checkAndAssign(resultArray1[10]);
									that.junzhi_SSY_Y = checkAndAssign(resultArray1[11]);
									that.junzhi_pulse_Y = checkAndAssign(resultArray1[12]);
									that.junzhi_SZY_Q = checkAndAssign(resultArray1[13]);
									that.junzhi_SSY_Q = checkAndAssign(resultArray1[14]);
									that.junzhi_pulse_Q = checkAndAssign(resultArray1[15]);
									that.junzhi_SZY_H = checkAndAssign(resultArray1[16]);
									that.junzhi_SSY_H = checkAndAssign(resultArray1[17]);
									that.junzhi_pulse_H = checkAndAssign(resultArray1[18]);
									that.junzhi_1 = resultArray1[19];
									that.junzhi_2 = resultArray1[20];
									that.junzhi_3 = resultArray1[21];
									that.junzhi_4 = resultArray1[22];
									that.junzhi_5 = resultArray1[23];
									that.junzhi_6 = resultArray1[24];
									that.junzhi_7 = resultArray1[25];
									that.junzhi_8 = resultArray1[26];
									if (that.junzhi_1 === "0" && that.junzhi_2 === "0" && that.junzhi_3 === "0" &&
										that.junzhi_4 === "0" && that.junzhi_5 === "0" && that.junzhi_6 === "0") {
										that.jianyi5 = ""
										that.fenxi5 = ""
										that.fenxi6 = ""
										that.fenxi7 = ""
										that.fenxi8 = ""
										that.fenxi9 = ""
										that.fenxi10 = ""
									} else {
										that.jianyi5 = that.$t("建议8")
										if (that.junzhi_1 === "1") {
											that.fenxi5 = that.$t("分析8")
										} else if (that.junzhi_2 === "1") {
											that.fenxi6 = that.$t("分析81")
										} else if (that.junzhi_3 === "1") {
											that.fenxi7 = that.$t("分析83")
										} else if (that.junzhi_4 === "1") {
											that.fenxi8 = that.$t("分析84")
										} else if (that.junzhi_5 === "1") {
											that.fenxi9 = that.$t("分析86")
										} else if (that.junzhi_6 === "1") {
											that.fenxi10 = that.$t("分析87")
										}
									}
									if (that.youxiao_1 === "0" && that.junzhi_7 == "0") {
										that.jianyi7 = ""
										that.fenxi12 = ""
										that.fenxi13 = ""
									} else {
										that.jianyi7 = that.$t("建议10")
										if (that.youxiao_1 === "1") {
											that.fenxi12 = that.$t("分析10")
										} else if (that.junzhi_7 == "1") {
											that.fenxi13 = that.$t("分析101")
										}
									}

									if (that.youxiao_2 === "0" && that.junzhi_8 === "0") {
										that.jianyi8 = ""
										that.fenxi14 = ""
										that.fenxi15 = ""
									} else {
										that.jianyi8 = that.$t("建议11")
										if (that.youxiao_2 === "1") {
											that.fenxi14 = that.$t("分析a")
										} else if (that.junzhi_8 == "1") {
											that.fenxi15 = that.$t("分析aa")
										}
									}
									// 标准差
									that.biaozhun_SZY_b = checkAndAssign(resultArray1[27]);
									that.biaozhun_SSY_b = checkAndAssign(resultArray1[28]);
									that.biaozhun_pulse_b = checkAndAssign(resultArray1[29]);
									that.biaozhun_SZY_Y = checkAndAssign(resultArray1[30]);
									that.biaozhun_SSY_Y = checkAndAssign(resultArray1[31]);
									that.biaozhun_pulse_Y = checkAndAssign(resultArray1[32]);
									that.biaozhun_SZY_Q = checkAndAssign(resultArray1[33]);
									that.biaozhun_SSY_Q = checkAndAssign(resultArray1[34]);
									that.biaozhun_pulse_Q = checkAndAssign(resultArray1[35]);
									that.biaozhun_SZY_H = checkAndAssign(resultArray1[36]);
									that.biaozhun_SSY_H = checkAndAssign(resultArray1[37]);
									that.biaozhun_pulse_H = checkAndAssign(resultArray1[38]);
									// 最大值
									that.zuida_SZY_b = checkAndAssign(resultArray1[39]);
									that.zuida_SSY_b = checkAndAssign(resultArray1[40]);
									that.zuida_pulse_b = checkAndAssign(resultArray1[41]);
									that.zuida_SZY_Y = checkAndAssign(resultArray1[42]);
									that.zuida_SSY_Y = checkAndAssign(resultArray1[43]);
									that.zuida_pulse_Y = checkAndAssign(resultArray1[44]);
									that.zuida_SZY_Q = checkAndAssign(resultArray1[45]);
									that.zuida_SSY_Q = checkAndAssign(resultArray1[46]);
									that.zuida_pulse_Q = checkAndAssign(resultArray1[47]);
									that.zuida_SZY_H = checkAndAssign(resultArray1[48]);
									that.zuida_SSY_H = checkAndAssign(resultArray1[49]);
									that.zuida_pulse_H = checkAndAssign(resultArray1[50]);
									// 中位数
									that.zhongweishu_SZY_b = checkAndAssign(resultArray1[51]);
									that.zhongweishu_SSY_b = checkAndAssign(resultArray1[52]);
									that.zhongweishu_pulse_b = checkAndAssign(resultArray1[53]);
									that.zhongweishu_SZY_Y = checkAndAssign(resultArray1[54]);
									that.zhongweishu_SSY_Y = checkAndAssign(resultArray1[55]);
									that.zhongweishu_pulse_Y = checkAndAssign(resultArray1[56]);
									that.zhongweishu_SZY_Q = checkAndAssign(resultArray1[57]);
									that.zhongweishu_SSY_Q = checkAndAssign(resultArray1[58]);
									that.zhongweishu_pulse_Q = checkAndAssign(resultArray1[59]);
									that.zhongweishu_SZY_H = checkAndAssign(resultArray1[60]);
									that.zhongweishu_SSY_H = checkAndAssign(resultArray1[61]);
									that.zhongweishu_pulse_H = checkAndAssign(resultArray1[62]);
									// 最小值
									that.zuixiaozhi_SZY_b = checkAndAssign(resultArray1[63]);
									that.zuixiaozhi_SSY_b = checkAndAssign(resultArray1[64]);
									that.zuixiaozhi_pulse_b = checkAndAssign(resultArray1[65]);
									that.zuixiaozhi_SZY_Y = checkAndAssign(resultArray1[66]);
									that.zuixiaozhi_SSY_Y = checkAndAssign(resultArray1[67]);
									that.zuixiaozhi_pulse_Y = checkAndAssign(resultArray1[68]);
									that.zuixiaozhi_SZY_Q = checkAndAssign(resultArray1[69]);
									that.zuixiaozhi_SSY_Q = checkAndAssign(resultArray1[70]);
									that.zuixiaozhi_pulse_Q = checkAndAssign(resultArray1[71]);
									that.zuixiaozhi_SZY_H = checkAndAssign(resultArray1[72]);
									that.zuixiaozhi_SSY_H = checkAndAssign(resultArray1[73]);
									that.zuixiaozhi_pulse_H = checkAndAssign(resultArray1[74]);
									// 血压负荷
									that.xeuyafuhe_SZY_b = checkAndAssign(resultArray1[75]);
									that.xeuyafuhe_SSY_b = checkAndAssign(resultArray1[76]);
									that.xeuyafuhe_SZY_Y = checkAndAssign(resultArray1[77]);
									that.xeuyafuhe_SSY_Y = checkAndAssign(resultArray1[78]);
									that.xeuyafuhe_SZY_Q = checkAndAssign(resultArray1[79]);
									that.xeuyafuhe_SSY_Q = checkAndAssign(resultArray1[80]);
									that.xeuyafuhe_SZY_H = checkAndAssign(resultArray1[81]);
									that.xeuyafuhe_SSY_H = checkAndAssign(resultArray1[82]);
									that.xeuyafuhe_1 = resultArray1[83];
									that.xeuyafuhe_2 = resultArray1[84];
									that.xeuyafuhe_3 = resultArray1[85];
									that.xeuyafuhe_4 = resultArray1[86];
									that.xeuyafuhe_5 = resultArray1[87];
									that.xeuyafuhe_6 = resultArray1[88];
									that.xeuyafuhe_7 = resultArray1[89];
									that.xeuyafuhe_8 = resultArray1[90];
									if (that.xeuyafuhe_1 === "0" && that.xeuyafuhe_2 === "0" && that
										.xeuyafuhe_3 === "0" && that.xeuyafuhe_4 === "0" && that.xeuyafuhe_5 ===
										"0" && that.xeuyafuhe_6 === "0" && that.xeuyafuhe_7 === "0" && that
										.xeuyafuhe_8 === "0") {
										that.jianyi2 = ""
										that.fenxi2 = ""
									} else {
										that.jianyi2 = that.$t("建议5")
										if (that.xeuyafuhe_1 === "1") {
											that.fenxi2 = that.$t("分析5")
										} else if (that.xeuyafuhe_2 === "1") {
											that.fenxi2 = that.$t("分析52")
										} else if (that.xeuyafuhe_3 === "1") {
											that.fenxi2 = that.$t("分析53")
										} else if (that.xeuyafuhe_4 === "1") {
											that.fenxi2 = that.$t("分析54")
										} else if (that.xeuyafuhe_5 === "1") {
											that.fenxi2 = that.$t("分析55")
										} else if (that.xeuyafuhe_6 === "1") {
											that.fenxi2 = that.$t("分析56")
										} else if (that.xeuyafuhe_7 === "1") {
											that.fenxi2 = that.$t("分析57")
										} else if (that.xeuyafuhe_8 === "1") {
											that.fenxi2 = that.$t("分析58")
										} else {
											that.fenxi2 = ""
										}
									}
									// 夜间血压下降率
									if (resultArray1[93] === "1") {
										that.yejian_1 = "1"
										that.yejian_SZY_H = checkAndAssign(resultArray1[91]) + "反杓型";
										that.jianyi = that.$t("建议1")
										that.fenxi = that.$t("分析1")
									} else if (resultArray1[94] === "1") {
										that.yejian_1 = "1"
										that.yejian_SZY_H = checkAndAssign(resultArray1[91]) + "非杓型";
										that.jianyi = that.$t("建议2")
										that.fenxi = that.$t("分析2")
									} else if (resultArray1[95] === "1") {
										that.yejian_1 = "0"
										that.yejian_SZY_H = checkAndAssign(resultArray1[91]) + "杓型";
										that.jianyi = that.$t("建议4")
										that.fenxi = that.$t("分析4")
									} else if (resultArray1[96] === "1") {
										that.yejian_1 = "1"
										that.yejian_SZY_H = checkAndAssign(resultArray1[91]) + "超杓型";
										that.jianyi = that.$t("建议3")
										that.fenxi = that.$t("分析3")
									} else {
										that.yejian_1 = "0"
										that.jianyi = ""
										that.fenxi = ""
									}
									if (resultArray1[93] === "1") {
										that.yejian_2 = "1"
										that.yejian_SSY_H = checkAndAssign(resultArray1[92]) + "反杓型";
										that.jianyi1 = that.$t("建议1")
										that.fenxi1 = that.$t("分析11")
									} else if (resultArray1[94] === "1") {
										that.yejian_2 = "1"
										that.yejian_SSY_H = checkAndAssign(resultArray1[92]) + "非杓型";
										that.jianyi1 = that.$t("建议2")
										that.fenxi1 = that.$t("分析22")
									} else if (resultArray1[95] === "1") {
										that.yejian_2 = "0"
										that.yejian_SSY_H = checkAndAssign(resultArray1[92]) + "杓型";
										that.jianyi1 = that.$t("建议4")
										that.fenxi1 = that.$t("分析44")
									} else if (resultArray1[96] === "1") {
										that.yejian_2 = "1"
										that.yejian_SSY_H = checkAndAssign(resultArray1[92]) + "超杓型";
										that.jianyi1 = that.$t("建议3")
										that.fenxi1 = that.$t("分析33")
									} else {
										that.yejian_2 = "0"
										that.jianyi1 = ""
										that.fenxi1 = ""
									}
									// 血压晨峰
									that.xycf_SZY_H = checkAndAssign(resultArray1[101]);
									that.xycf_SSY_H = checkAndAssign(resultArray1[102]);
									that.xycf_1 = resultArray1[103]

									if (that.xycf_1 === "0") {
										that.jianyi3 = ""
										that.fenxi3 = ""
									} else {
										that.jianyi3 = that.$t("建议6")
										that.fenxi3 = that.$t("分析6")
									}
									// 变异系数
									that.byxs_SZY_b = checkAndAssign(resultArray1[104]);
									that.byxs_SSY_b = checkAndAssign(resultArray1[105]);
									that.byxs_pulse_b = checkAndAssign(resultArray1[106]);
									that.byxs_SZY_Y = checkAndAssign(resultArray1[107]);
									that.byxs_SSY_Y = checkAndAssign(resultArray1[108]);
									that.byxs_pulse_Y = checkAndAssign(resultArray1[109]);
									that.byxs_SZY_Q = checkAndAssign(resultArray1[110]);
									that.byxs_SSY_Q = checkAndAssign(resultArray1[111]);
									that.byxs_pulse_Q = checkAndAssign(resultArray1[112]);
									that.byxs_SZY_H = checkAndAssign(resultArray1[113]);
									that.byxs_SSY_H = checkAndAssign(resultArray1[114]);
									that.byxs_pulse_H = checkAndAssign(resultArray1[115]);
									// // 动脉硬化指数
									that.dmyhzs_SSY_H = checkAndAssign(resultArray1[116]);
									that.dmyhzs = resultArray1[117]
									if (that.dmyhzs === "0") {
										that.jianyi4 = ""
										that.fenxi4 = ""
									} else {
										that.jianyi4 = that.$t("建议7")
										that.fenxi4 = that.$t("分析7")
									}
								}
							}
						}
					}
				})
			},
			//历史记录V2 - 血压
			query_log_v2(deviceSn) {
				let that = this
				let endTime = that.pacitime.slice(0, 10) + " 23:59:59"
				const initialDate = new Date(endTime);
				let startTime = ""
				if (that.period === "1D") {
					// 减去一天
					const minusOneDay = new Date(initialDate);
					minusOneDay.setDate(minusOneDay.getDate() - 1); // setDate 方法会自动处理日期的增减
					startTime = minusOneDay.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "2D") {
					const minusOneDay = new Date(initialDate);
					minusOneDay.setDate(minusOneDay.getDate() - 2); // setDate 方法会自动处理日期的增减
					startTime = minusOneDay.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "3D") {
					const minusOneDay = new Date(initialDate);
					minusOneDay.setDate(minusOneDay.getDate() - 3); // setDate 方法会自动处理日期的增减
					startTime = minusOneDay.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "4D") {
					const minusOneDay = new Date(initialDate);
					minusOneDay.setDate(minusOneDay.getDate() - 4); // setDate 方法会自动处理日期的增减
					startTime = minusOneDay.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "5D") {
					const minusOneDay = new Date(initialDate);
					minusOneDay.setDate(minusOneDay.getDate() - 5); // setDate 方法会自动处理日期的增减
					startTime = minusOneDay.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "6D") {
					const minusOneDay = new Date(initialDate);
					minusOneDay.setDate(minusOneDay.getDate() - 6); // setDate 方法会自动处理日期的增减
					startTime = minusOneDay.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "1W") {
					// 减去一周（7天）
					const minusOneWeek = new Date(initialDate);
					minusOneWeek.setDate(minusOneWeek.getDate() - 7); // 减去一周
					startTime = minusOneWeek.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "2W") {
					// 减去一周（7天）
					const minusOneWeek = new Date(initialDate);
					minusOneWeek.setDate(minusOneWeek.getDate() - 14); // 减去一周
					startTime = minusOneWeek.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "3W") {
					// 减去一周（7天）
					const minusOneWeek = new Date(initialDate);
					minusOneWeek.setDate(minusOneWeek.getDate() - 21); // 减去一周
					endTime = minusOneWeek.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "1M") {
					// 减去一个月
					const minusOneMonth = new Date(initialDate);
					minusOneMonth.setMonth(minusOneMonth.getMonth() - 1); // 减去一个月
					startTime = minusOneMonth.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "2M") {
					const minusOneMonth = new Date(initialDate);
					minusOneMonth.setMonth(minusOneMonth.getMonth() - 2); // 减去一个月
					startTime = minusOneMonth.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				} else if (that.period === "3M") {
					const minusOneMonth = new Date(initialDate);
					minusOneMonth.setMonth(minusOneMonth.getMonth() - 3); // 减去一个月
					startTime = minusOneMonth.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				}
				console.log("startTime", startTime)
				console.log("endTime", endTime)
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
							if (res.data.data !== "") {
								that.listall = []
								for (let i = 0; res.data.data.length > i; i++) {
									res.data.data[i].object.details.forEach((item1, index1) => {
										item1.date = res.data.data[i].dateTime
										item1.modelName = res.data.data[i].modelName
										if ((item1.lowPressure >= 81 && item1.lowPressure <= 90) || (item1
												.highPressure >= 121 && item1.highPressure <= 140)) {
											that.gaoya = 0
										} else if ((item1.lowPressure >= 91 && item1.lowPressure <= 100) ||
											(item1.highPressure >= 141 && item1.highPressure <= 160)) {
											that.gaoya = 0
										} else if ((item1.lowPressure >= 101 && item1.lowPressure <=
												110) || (item1.highPressure >= 161 && item1.highPressure <=
												180)) {
											that.gaoya = 0
										}
										that.listall.push(item1)
									});
								}
							}
						}
					}
				})
			},
		}
	}
</script>
<style>
	.popup_bg {
		padding: 20px;
		background: white;
		border-radius: 20px;
	}

	.select_text {
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: 400;
	}



	.titlestyle {
		position: fixed;
		top: 0;
		width: 100vw;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #3298F7;
		height: 83px;
	}

	.titlestyle_1 {
		text-align: center;
		margin-top: 30px;
		color: white;
		font-size: 17px;
		font-weight: 500;
	}

	.pagecontext {
		padding: 20px;
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.txtetitlestyle {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.txtetitlestyle1sd {
		padding-top: 10px;
		padding-left: 10px;
		padding-right: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.txtetitlestyless {
		margin-top: 40px;
		display: flex;
		width: auto;
		justify-content: center;
		align-items: center;
	}

	.txtetitlestyless1 {
		margin-top: 40px;
		display: flex;
		width: auto;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.texttitle {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.text1style {
		font-size: 6.5px;
		font-weight: 600;
	}

	.text2style {
		font-size: 6.5px;
		font-weight: 600;
	}

	.charts-box {
		margin-top: 20px;
		width: 100%;
		display: flex;
		justify-content: center;
		height: auto;
	}

	.txtetitlestyles {
		font-size: 6.5px;
		margin-top: 5px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.txtetitlestyle_1 {
		margin-top: 10px;
		border: 1px solid black;
	}

	.row {
		font-size: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cell {
		flex: 1;
		text-align: center;
	}

	.allback_1 {
		height: 30px;
		font-size: 10px;
		border-top: 1px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.szy_bg_all {
		height: 30px;
		width: 40vw;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}

	.xxuey_bg {
		width: 33%;
		border-left: 1px solid black;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.xxuey_bg_1 {
		background-color: #808080;
		width: 33%;
		border-left: 1px solid black;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.view_bg_0 {
		height: 60px;
		font-size: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.view_bg_1 {
		height: 60px;
		font-size: 10px;
		border-top: 1px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.view_bg_2 {
		height: 60px;
		width: 40vw;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}

	.xxuey_bg_2 {
		background: #808080;
		width: 33%;
		border-left: 1px solid black;
		height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.xxuey_bg_3 {
		background: #808080;
		width: 33%;
		border-left: 1px solid black;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.youxiao_bg {
		width: 100%;
		border-left: 1px solid black;
		height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.youxiao_bg_1 {
		width: 100%;
		border-left: 1px solid black;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.analysis-container text {
		display: block;
		margin-bottom: 0px;
		/* 可选的行间距 */
	}

	.text-content {
		font-size: 10px;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		/* 默认显示3行 */
		-webkit-box-orient: vertical;
	}

	.text-content.expanded {
		-webkit-line-clamp: unset;
		/* 展开时显示全部内容 */
	}

	.toggle-button {
		font-size: 10px;
		color: #007aff;
		text-align: center;
		padding: 10px;
	}
</style>