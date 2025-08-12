<template>
	<view class="index">
		<sp-html2pdf-render domId="render-dom" ref="renderRef" :pdfFileName="$t('动态血压监测报告')"
			@beforeSavePDF="beforeSavePDF" @successSavePDF="successSavePDF"
			@renderOver="renderOver"></sp-html2pdf-render>
		<!-- 主渲染内容 -->
		<view class="render-main">
			<view id="render-dom" class="render-content">
				<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 20px;">
					<image :src="appicon" style="width: 95px; height: 35px;"></image>
					<view style="color: #040000;font-size: 20px; font-weight: 500;">{{$t("动态血压监测报告")}}</view>
					<view style="font-size: 14px; font-weight: 400; color: black;">{{pacitime}}</view>
				</view>
				<view style="margin-top: 10px; text-align: center; font-size:11.5px; font-weight: 600; color:#3298F7; ">
					{{$t("请注意")}}
				</view>
				<view style="background: black; height: 2px; width: auto;margin-top: 20px;"></view>
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
							<!-- <text>{{fenxi4}}</text> -->
							<view v-show="fenxi4!==''"
								style="color: #040000;display: flex;flex-direction: row;align-items: center;">
								{{fenxi4}}
								<view class="toggle-button" @click="toggleExpand">
									{{isExpanded ? $t("收起") : $t("展开更多")}}
								</view>
							</view>
							<text class="text-content" :class="{'expanded': isExpanded}" space="pre-wrap"
								selectable="true">
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
						style="padding:10px;font-size: 14px;font-weight: 600;color: #3298F7;">
						{{$t("提示")}}
					</view>
					<view v-else-if="idsss !== '1'&&idsss !== '2'&& shebei===1&&gaoya===0"
						style="padding: 0 10px;font-size: 14px;font-weight: 600;color: #3298F7;">
						{{$t("提示")}}
					</view>
					<view style="padding:0 10px;color: #040000;font-weight: 600;font-size: 10px;"
						v-if="idsss !== '1'&&idsss !== '2'&& shebei===0&&gaoya===0">
						{{$t("提示检测到血压偏高")}}
					</view>
					<view style="padding: 10px;color: #040000;font-weight: 600;font-size: 10px;"
						v-else-if="idsss !== '1'&&idsss !== '2'&&shebei===1&&gaoya===0">
						{{$t("提示检测到血压偏高1")}}
					</view>
				</view>
				<view style="background: black; height: 2px; width: auto;margin-top: 20px;"></view>
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
					<view class="texttitle">
						<view class="text1style">{{$t("检测设备")}}:</view>
						<view class="text2style">{{Testing_equipment}}</view>
					</view>
				</view>
				<view style="background: #969799; height: 1px; width: auto;margin-top: 10px;"></view>
				<view class="txtetitlestyle">
					<view class="texttitle">
						<view class="text1style">{{$t("起床时间")}}:</view>
						<view class="text2style">{{Wake_up_time}}</view>
					</view>
					<view class="texttitle">
						<view class="text1style">{{$t("就寝时间")}}:</view>
						<view class="text2style">{{bedtime}}</view>
					</view>
					<view class="texttitle">
						<view class="text1style">{{$t("是否午休")}}:</view>
						<view class="text2style">{{Whether_to_take}}</view>
					</view>
					<view class="texttitle">
						<view class="text1style">{{$t("午休时长")}}:</view>
						<view class="text2style">{{Lunch_break}}</view>
					</view>
				</view>
				<view style="background: #969799; height: 1px; width: auto;margin-top: 10px;"></view>
				<view class="txtetitlestyle">
					<view class="texttitle">
						<view class="text1style">{{$t("是否服用药物")}}:</view>
						<view class="text2style">{{medication}}</view>
					</view>
					<view class="texttitle">
						<view class="text1style">{{$t("工作是否倒班")}}:</view>
						<view class="text2style">{{Whether_the_work}}</view>
					</view>
					<view class="texttitle">
					</view>
				</view>
				<view style="background: black; height: 2px; width: auto;margin-top: 10px;"></view>
				<view class="txtetitlestyle" style="padding-top: 40px;">
					<view style="font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("动态血压趋势图")}}</view>
					<view style="display: flex;justify-content: center;align-items: center;flex-direction: row;">
						<image :src="maibo" style="height: 13px;width: 20px;margin-right: 2px;">
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
					<view style="font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("")}}</view>
				</view>
				<view class="txtetitlestyle_1">
					<view style="font-size: 10px; display: flex; align-items: center;flex-direction: row;">
						<view style="width: 12%;text-align: center;"></view>
						<view style="width: 22%;text-align: center;border-left: 1px solid black;">
							{{$t("白天清醒时段")}}</br>(06:00-21:30)
						</view>
						<view style="width: 22%;text-align: center;border-left: 1px solid black;">
							{{$t("夜间睡眠时段")}}</br>(21:30-06:00)
						</view>
						<view
							style="width: 22%;text-align: center;border-left: 1px solid black;border-right: 1px solid black;">
							{{$t("起床后清晨时段")}}</br>(06:00-08:00)
						</view>
						<view style="width: 22%;text-align: center;">
							24h
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;"></view>
						<view class="listitemall_2">
							<view class="itemall">{{$t("舒张压")}}</view>
							<view class="itemall_1">{{$t("收缩压")}}</view>
							<view class="itemall_1">{{$t("脉搏")}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{$t("舒张压")}}</view>
							<view class="itemall_1">{{$t("收缩压")}}</view>
							<view class="itemall_1">{{$t("脉搏")}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{$t("舒张压")}}</view>
							<view class="itemall_1">{{$t("收缩压")}}</view>
							<view class="itemall_1">{{$t("脉搏")}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{$t("舒张压")}}</view>
							<view class="itemall_1">{{$t("收缩压")}}</view>
							<view class="itemall_1">{{$t("脉搏")}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("有效数据个数")}}</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(youxiao_1)">{{youxiao_SZY_b}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(youxiao_2)">{{youxiao_SZY_Y}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{youxiao_SZY_Q}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(youxiao_3)">{{youxiao_SZY_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("均值")}}</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(junzhi_1)">{{junzhi_SZY_b}}</view>
							<view class="itemall_1" :style="getblackgroud(junzhi_2)">{{junzhi_SSY_b}}</view>
							<view class="itemall_1">{{junzhi_pulse_b}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(junzhi_3)">{{junzhi_SZY_Y}}</view>
							<view class="itemall_1" :style="getblackgroud(junzhi_4)">{{junzhi_SSY_Y}}</view>
							<view class="itemall_1">{{junzhi_pulse_Y}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(junzhi_5)">{{junzhi_SZY_Q}}</view>
							<view class="itemall_1" :style="getblackgroud(junzhi_6)">{{junzhi_SSY_Q}}</view>
							<view class="itemall_1">{{junzhi_pulse_Q}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(junzhi_7)">{{junzhi_SZY_H}}</view>
							<view class="itemall_1" :style="getblackgroud(junzhi_8)">{{junzhi_SSY_H}}</view>
							<view class="itemall_1">{{junzhi_pulse_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("标准差")}}</view>
						<view class="listitemall_2">
							<view class="itemall">{{biaozhun_SZY_b}}</view>
							<view class="itemall_1">{{biaozhun_SSY_b}}</view>
							<view class="itemall_1">{{biaozhun_pulse_b}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{biaozhun_SZY_Y}}</view>
							<view class="itemall_1">{{biaozhun_SSY_Y}}</view>
							<view class="itemall_1">{{biaozhun_pulse_Y}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{biaozhun_SZY_Q}}</view>
							<view class="itemall_1">{{biaozhun_SSY_Q}}</view>
							<view class="itemall_1">{{biaozhun_pulse_Q}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{biaozhun_SZY_H}}</view>
							<view class="itemall_1">{{biaozhun_SSY_H}}</view>
							<view class="itemall_1">{{biaozhun_pulse_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("最大值")}}</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuida_SZY_b}}</view>
							<view class="itemall_1">{{zuida_SSY_b}}</view>
							<view class="itemall_1">{{zuida_pulse_b}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuida_SZY_Y}}</view>
							<view class="itemall_1">{{zuida_SSY_Y}}</view>
							<view class="itemall_1">{{zuida_pulse_Y}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuida_SZY_Q}}</view>
							<view class="itemall_1">{{zuida_SSY_Q}}</view>
							<view class="itemall_1">{{zuida_pulse_Q}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuida_SZY_H}}</view>
							<view class="itemall_1">{{zuida_SSY_H}}</view>
							<view class="itemall_1">{{zuida_pulse_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("中位数")}}</view>
						<view class="listitemall_2">
							<view class="itemall">{{zhongweishu_SSY_b}}</view>
							<view class="itemall_1">{{zhongweishu_SSY_b}}</view>
							<view class="itemall_1">{{zhongweishu_pulse_b}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zhongweishu_SZY_Y}}</view>
							<view class="itemall_1">{{zhongweishu_SSY_Y}}</view>
							<view class="itemall_1">{{zhongweishu_pulse_Y}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zhongweishu_SZY_Q}}</view>
							<view class="itemall_1">{{zhongweishu_SSY_Q}}</view>
							<view class="itemall_1">{{zhongweishu_pulse_Q}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zhongweishu_SZY_H}}</view>
							<view class="itemall_1">{{zhongweishu_SSY_H}}</view>
							<view class="itemall_1">{{zhongweishu_pulse_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("最小值")}}</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuixiaozhi_SZY_b}}</view>
							<view class="itemall_1">{{zuixiaozhi_SSY_b}}</view>
							<view class="itemall_1">{{zuixiaozhi_pulse_b}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuixiaozhi_SZY_Y}}</view>
							<view class="itemall_1">{{zuixiaozhi_SSY_Y}}</view>
							<view class="itemall_1">{{zuixiaozhi_pulse_Y}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuixiaozhi_SZY_Q}}</view>
							<view class="itemall_1">{{zuixiaozhi_SSY_Q}}</view>
							<view class="itemall_1">{{zuixiaozhi_pulse_Q}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{zuixiaozhi_SZY_H}}</view>
							<view class="itemall_1">{{zuixiaozhi_SSY_H}}</view>
							<view class="itemall_1">{{zuixiaozhi_pulse_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("血压负荷")}}</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(xeuyafuhe_1)">{{xeuyafuhe_SZY_b}}</view>
							<view class="itemall_1" :style="getblackgroud(xeuyafuhe_2)">{{xeuyafuhe_SSY_b}}</view>
							<view class="itemall_1" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(xeuyafuhe_3)">{{xeuyafuhe_SZY_Y}}</view>
							<view class="itemall_1" :style="getblackgroud(xeuyafuhe_4)">{{xeuyafuhe_SSY_Y}}</view>
							<view class="itemall_1" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(xeuyafuhe_5)">{{xeuyafuhe_SZY_Q}}</view>
							<view class="itemall_1" :style="getblackgroud(xeuyafuhe_6)">{{xeuyafuhe_SSY_Q}}</view>
							<view class="itemall_1" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(xeuyafuhe_7)">{{xeuyafuhe_SZY_H}}</view>
							<view class="itemall_1" :style="getblackgroud(xeuyafuhe_8)">{{xeuyafuhe_SSY_H}}</view>
							<view class="itemall_1" style="background: #808080;"></view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("夜间血压下降率")}}</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(yejian_1)">{{yejian_SZY_H}}</view>
							<view class="itemall_1" :style="getblackgroud(yejian_2)">{{yejian_SSY_H}}</view>
							<view class="itemall_1" style="background: #808080;"></view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("血压晨峰")}}</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(xycf_1)">{{xycf_SZY_H}}</view>
							<view class="itemall_1">{{xycf_SSY_H}}</view>
							<view class="itemall_1" style="background: #808080;"></view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("变异系数")}}</view>
						<view class="listitemall_2">
							<view class="itemall">{{byxs_SZY_b}}</view>
							<view class="itemall_1">{{byxs_SSY_b}}</view>
							<view class="itemall_1">{{byxs_pulse_b}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{byxs_SZY_Y}}</view>
							<view class="itemall_1">{{byxs_SSY_Y}}</view>
							<view class="itemall_1">{{byxs_pulse_Y}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{byxs_SZY_Q}}</view>
							<view class="itemall_1">{{byxs_SSY_Q}}</view>
							<view class="itemall_1">{{byxs_pulse_Q}}</view>
						</view>
						<view class="listitemall_2">
							<view class="itemall">{{byxs_SZY_H}}</view>
							<view class="itemall_1">{{byxs_SSY_H}}</view>
							<view class="itemall_1">{{byxs_pulse_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("动脉硬化指数")}}</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" style="background: #808080;"></view>
						</view>
						<view class="listitemall_2">
							<view class="itemall" :style="getblackgroud(dmyhzs)">{{dmyhzs_SSY_H}}</view>
						</view>
					</view>
					<view class="listitemall">
						<view style="width: 12%;text-align: center;">{{$t("盐敏感可能性")}}</view>
						<view class="listitemall_3">{{yanminggan}}</view>
					</view>
				</view>
				<view class="txtetitlestyle" style="margin-top: 40px;">
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
					<view
						style="color: black; padding-left: 10px;padding-right: 10px; font-size: 10px;padding-top: 10px;">
						{{$t("告知1")}}
					</view>
					<view style="padding:10px; font-size: 10px;color: black; ">
						{{$t("告知2")}}
					</view>
				</view>
				<view class="txtetitlestyle">
					<view style="font-size: 14px;font-weight: 600;color: #3298F7;">{{$t("动态血压监测数据统计")}}</view>
					<view style="display: flex;flex-direction: row; justify-content: center;align-items: center;">
						<view class="dtsdstyle">
							<image :src="soudong" style="width:11px; height: 11px;margin-right: 5px;">
							</image>{{$t("手动输入数据")}}
						</view>
						<view class="dtsdstyle">
							<image :src="wuxiao" style="width:11px; height: 11px;margin-right: 5px;">
							</image>{{$t("无效数据")}}
						</view>
						<view class="dtsdstyle">
							<view style="width: 18px; height: 10px; background: #D9D9D9;margin-right: 5px;"></view>
							{{$t("睡眠时段测量数据")}}
						</view>
					</view>
				</view>
				<view class="txtetitlestyle">

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
										:src="item.type=='0'? soudong:wuxiao">
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
		</view>
		<view class="titlestyle">
			<uni-icons @click="back()" type="left" size="20"
				style="color: white;margin-left: 20px;margin-top: 30px;"></uni-icons>
			<view class="titlestyle_1">{{$t('动态血压监测报告预览')}}</view>
			<uni-icons @click="generatePDF()" type="arrow-down" size="20"
				style="color: white;margin-right: 20px;margin-top: 30px;"></uni-icons>
		</view>
	</view>
</template>

<script>
	import {
		urlToBase64
	} from '@/uni_modules/sp-html2pdf-render/utils/index.js'
	export default {
		data() {
			return {
				appicon: '',
				maibo: '',
				dtx: '',
				soudong: '',
				wuxiao: '',
				pacitime: "2025-03-17",
				name: "-",
				sex: '-',
				age: '-',
				Testing_equipment: '-',
				Wake_up_time: '-',
				bedtime: '-',
				Whether_to_take: '-',
				Lunch_break: '-',
				medication: '-',
				Current_medication: '-',
				Whether_the_work: '-',
				chartData: {
					categories: ["0", "1", "2"],
					series: [{
						legendShape: "none",
						name: "",
						data: []
					}, {
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
				isExpanded: false, // 控制是否展开
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
			this.pacitime = res.profDate //报告日期
			this.Whether_to_take = res.select //是否午休
			this.Lunch_break = res.index
			this.medication = res.select2 //是否用药
			// this.Current_medication = res.select3 //当前药物
			this.Wake_up_time = res.time //起床时间
			this.bedtime = res.time1 //就寝时间
			this.Whether_the_work = res.select4 //工作是否倒班
			this.filterVarList = res.index1
			this.idsss = res.idsss
			this.period = res.period
			this.finlretVarList1 = res.finlretVarList1
		},

		onShow() {
			this.getUserInfo()
			this.queryDevices()
		},

		created() {
			this.handleImage()
		},
		methods: {
			toggleExpand() {
				this.isExpanded = !this.isExpanded;
			},
			handleImage() {
				/**
				 * 使用urlToBase64将图片转换为base64格式，
				 * 若图片不支持跨域则可能会报toDataURL on HTMLCanvasElement的错
				 * 在hbuilderx内置浏览器中可能不会跨域，因为内置浏览器解除了跨域限制
				 * 终极大法是将网络图片通过工具转换为base64保存至文件中再放入image标签里
				 */
				const lan = uni.getLocale();
				if (lan == 'zh-Hans') {
					urlToBase64('/static/splsh.png').then((res) => {
						this.appicon = res
					})
				} else {
					urlToBase64('/static/icons/loginssss.png').then((res) => {
						this.appicon = res
					})
				}

				urlToBase64('/static/image/mb.png').then((res) => {
					this.maibo = res
				})
				urlToBase64('/static/image/dtx.png').then((res) => {
					this.dtx = res
				})
				urlToBase64('/static/icons/soudong.png').then((res) => {
					this.soudong = res
				})
				urlToBase64('/static/icons/wuxiao.png').then((res) => {
					this.wuxiao = res
				})
			},

			back() {
				uni.navigateBack()
			},

			getblackgroud(data) {
				return {
					background: data === "0" ? "#FFFFFF" : "#FF0000"
				}
			},

			renderOver(e) {
				// e为导出的图片（base64）
				// console.log('==== renderOver :', e)
			},
			beforeSavePDF(e) {
				// e为导出的pdf（base64）
				// console.log('==== beforeSavePDF :', e)
			},
			successSavePDF(path) {
				// e为打开的pdf（临时路径）
				// console.log('==== successSavePDF :', path)
			},
			generatePDF() {
				this.$refs.renderRef.h2pRenderDom()
			},
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
						if (res.data.code == 200) {
							that.name = res.data.data.nickName === null ? res.data.data.userName : res.data
								.data.nickName
							if (res.data.data.sex === "0") {
								that.sex = that.$t("男")
							} else {
								that.sex = that.$t("女")
							}
						} else if (res.data.code == 401) {

						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.error(err)
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
									title: "当前未绑定任何血压计设备",
									icon: 'none'
								})
								return
							} else {
								// 使用 every() 方法
								const allElementsNot3000 = res.data.rows.every((item) => item.deviceModelId !==
									"30000");
								if (allElementsNot3000) {
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
	.index {
		padding: 20px;
		color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}

	.render-main {
		margin-top: 88px;
		overflow: auto;
	}

	.render-content {
		width: 800px;
		height: auto;
		background-color: white;
		padding: 20px;
		box-sizing: border-box;
		color: #ffffff;
	}

	.exp-btn {
		position: fixed;
		bottom: 0;
		line-height: unset;
		padding: 12rpx;
	}

	.txtetitlestyle {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
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

	.popup_bg {
		padding: 20px;
		background: white;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
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

	.txtetitlestyless1 {
		margin-top: 40px;
		display: flex;
		width: auto;
		flex-direction: column;
		justify-content: center;
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
		margin-top: 20px;
		display: flex;
		width: auto;
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
		color: black;
		font-size: 6.5px;
		font-weight: 600;
	}

	.text2style {
		color: black;
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
		color: black;
		margin-top: 10px;
		border: 1px solid black;
	}

	.row {
		font-size: 10px;
		height: 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cell {
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		flex: 1;
		text-align: center;
	}

	.listitemall {
		border-top: 1px solid black;
		font-size: 10px;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.listitemall_1 {
		height: 45px;
		width: 22%;
		border-left: 1px solid black;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
	}

	.listitemall_2 {
		height: 30px;
		width: 22%;
		border-left: 1px solid black;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
	}

	.listitemall_3 {
		height: 30px;
		border-left: 1px solid black;
		width: 88%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.itemall {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.itemall_3s {
		flex: 3;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.itemall_1 {
		flex: 1;
		border-left: 1px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dtsdstyle {
		display: flex;
		justify-items: center;
		align-items: center;
		font-size: 10px;
		font-weight: 400;
		color: #999999;
		margin-left: 20px;
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