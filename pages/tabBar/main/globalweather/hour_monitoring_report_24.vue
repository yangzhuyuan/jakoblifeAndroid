<template>
	<view class="container">
		<!-- 头部信息 -->
		<view class="header">
			<view class="title">{{$t('小时监测报告24')}}</view>
			<!-- 基本信息组 -->
			<view class="info-group">
				<view class="group-title">{{$t('基本信息')}}</view>
				<view class="info-grid">
					<view class="info-item">
						<text class="label">{{$t('姓名')}}</text>
						<text class="value">{{userInfo.name}}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('性别')}}</text>
						<text class="value">{{getsex(userInfo.gender)}}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('年龄')}}</text>
						<text class="value">{{userInfo.age}}{{$t('岁')}}</text>
					</view>
				</view>
			</view>

			<!-- 身体指标组 -->
			<view class="info-group">
				<view class="group-title">{{$t('身体指标')}}</view>
				<view class="info-grid">
					<view class="info-item">
						<text class="label">{{$t('身高')}}</text>
						<text class="value">{{userInfo.height}}{{userInfo.heightunit}}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('体重')}}</text>
						<text class="value">{{userInfo.weight}}{{userInfo.weightunit}}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('腰围')}}</text>
						<text class="value">{{userInfo.waist}}{{userInfo.heightunit}}</text>
					</view>
					<view class="info-item">
						<text class="label">BMI</text>
						<text class="value" :class="getBmiClass(request.bmi)">{{request.bmi}}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('腰围身高比')}}</text>
						<text class="value">{{request.whtr}}</text>
					</view>
				</view>
			</view>

			<!-- 用药信息组 -->
			<view class="info-group" v-if="userInfo.takingMedicine">
				<view class="group-title">{{$t('用药信息')}}</view>
				<view class="info-grid">
					<view class="info-item wide">
						<text class="label">{{$t('是否服用高血压药物')}}</text>
						<text class="value">{{userInfo.takingMedicine === true ? $t('是') : $t('否')}}</text>
					</view>
					<view class="info-item" v-if="userInfo.takingMedicine === true">
						<text class="label">{{$t('服药种类')}}</text>
						<text class="value">{{userInfo.medicineType || '-'}}</text>
					</view>
					<view class="info-item" v-if="userInfo.takingMedicine === true">
						<text class="label">{{$t('每天服药时间')}}</text>
						<text class="value">{{userInfo.medicineTime || '-'}}</text>
					</view>
					<view class="info-item" v-if="userInfo.takingMedicine === true">
						<text class="label">{{$t('高血压确诊时间')}}</text>
						<text class="value">{{userInfo.diagnosisDate || '-'}}</text>
					</view>
				</view>
			</view>

			<!-- 睡眠数据组 -->
			<view class="info-group">
				<view class="group-title">{{$t('睡眠数据')}}</view>
				<view class="info-grid">
					<view class="info-item wide" v-if="hasSleepData">
						<text class="label">{{$t('睡眠时间')}}</text>
						<text class="value">{{userInfo.sleepTime}}</text>
					</view>
					<view class="info-item wide" v-else>
						<text class="value sleep-tip">{{$t('此用户未佩戴手表测量睡眠数据')}}</text>
					</view>
				</view>
			</view>

			<!-- 监测时间 -->
			<view class="monitor-time">
				<text class="time-icon">🕐</text>
				<text>{{$t('监测时间')}}：{{monitorInfo.startTime}} {{$t('至')}} {{monitorInfo.endTime}}</text>
			</view>

		</view>

		<!-- 统计概览 -->
		<view class="stats-section">
			<view class="stats-title">{{$t('监测统计概览')}}</view>
			<view class="stats-grid">
				<view class="stat-item">
					<text class="stat-label">{{$t('小时平均24')}}</text>
					<text class="stat-value">{{stats.avg24h.systolic}}/{{stats.avg24h.diastolic}}</text>
					<text class="stat-unit">mmHg</text>
				</view>
				<view class="stat-item">
					<text class="stat-label">{{$t('白天平均')}}</text>
					<text class="stat-value">{{stats.dayAvg.systolic}}/{{stats.dayAvg.diastolic}}</text>
					<text class="stat-unit">mmHg</text>
				</view>
				<view class="stat-item">
					<text class="stat-label">{{$t('夜间平均')}}</text>
					<text class="stat-value">{{stats.nightAvg.systolic}}/{{stats.nightAvg.diastolic}}</text>
					<text class="stat-unit">mmHg</text>
				</view>
				<view class="stat-item">
					<text class="stat-label">{{$t('总测量次数')}}</text>
					<text class="stat-value">{{stats.totalCount}}</text>
					<text class="stat-unit">{{$t('次')}}</text>
				</view>
			</view>
		</view>

		<!-- 详细比值分析 -->
		<view class="ratio-section">
			<view class="ratio-title">{{$t('昼夜节律分析')}}</view>
			<view class="ratio-content">
				<view class="ratio-item">
					<text class="ratio-label">{{$t('白天比值')}}</text>
					<view class="ratio-bar">
						<view class="ratio-progress" :style="{width: dayRatio + '%'}"></view>
					</view>
					<text class="ratio-value">{{dayRatio}}%</text>
				</view>
				<view class="ratio-item">
					<text class="ratio-label">{{$t('夜间比值')}}</text>
					<view class="ratio-bar">
						<view class="ratio-progress night" :style="{width: nightRatio + '%'}"></view>
					</view>
					<text class="ratio-value">{{nightRatio}}%</text>
				</view>
			</view>
		</view>

		<!-- 极值记录 -->
		<view class="extreme-section">
			<view class="extreme-title">{{$t('血压极值记录')}}</view>
			<view class="extreme-content">
				<view class="extreme-item high">
					<view class="extreme-label">
						<text class="label-icon">↑</text>
						<text>{{$t('最高血压')}}</text>
					</view>
					<view class="extreme-value">
						<text class="bp-value">{{stats.max.systolic}}/{{stats.max.diastolic}}</text>
						<text class="bp-time" v-if="stats.max.time">{{stats.max.time}}</text>
					</view>
				</view>
				<view class="extreme-item low">
					<view class="extreme-label">
						<text class="label-icon">↓</text>
						<text>{{$t('最低血压')}}</text>
					</view>
					<view class="extreme-value">
						<text class="bp-value">{{stats.min.systolic}}/{{stats.min.diastolic}}</text>
						<text class="bp-time" v-if="stats.min.time">{{stats.min.time}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 监测设置说明 -->
		<view class="setting-section">
			<view class="setting-title">{{$t('监测设置')}}</view>
			<view class="setting-content">
				<view class="setting-item">
					<text class="setting-label">{{$t('白天监测时段')}}</text>
					<text class="setting-value">06:00 - 21:30</text>
				</view>
				<view class="setting-item">
					<text class="setting-label">{{$t('白天监测间隔')}}</text>
					<text class="setting-value">30{{$t('分钟次')}}</text>
				</view>
				<view class="setting-item">
					<text class="setting-label">{{$t('夜间监测时段')}}</text>
					<text class="setting-value">21:30 - 06:00</text>
				</view>
				<view class="setting-item">
					<text class="setting-label">{{$t('夜间监测间隔')}}</text>
					<text class="setting-value">60{{$t('分钟次')}}</text>
				</view>
			</view>
		</view>

		<!-- 详细数据列表 -->
		<view class="detail-section">
			<view class="detail-header">
				<text class="detail-title">{{$t('详细监测数据')}}</text>
				<view class="filter-tabs">
					<text :class="['tab', currentTab === 'all' ? 'active' : '']"
						@click="switchTab('all')">{{$t('全部')}}({{stats.totalCount}})</text>
					<text :class="['tab', currentTab === 'day' ? 'active' : '']"
						@click="switchTab('day')">{{$t('白天')}}({{dayCount}})</text>
					<text :class="['tab', currentTab === 'night' ? 'active' : '']"
						@click="switchTab('night')">{{$t('夜间')}}({{nightCount}})</text>
				</view>
			</view>

			<!-- 按日期分组显示 -->
			<view class="detail-list">
				<view v-for="(group, date) in groupedData" :key="date" class="date-group">
					<view class="date-header">
						<text class="date-text">{{date}}</text>
						<text class="date-count">{{group.length}}{{$t('次测量')}}</text>
					</view>
					<view class="list-header">
						<text class="header-item time">{{$t('时间')}}</text>
						<text class="header-item type">{{$t('时段')}}</text>
						<text class="header-item value">{{$t('血压值')}}</text>
						<text class="header-item status">{{$t('状态')}}</text>
					</view>
					<view class="list-body">
						<view v-for="(item, idx) in group" :key="idx"
							:class="['data-row', item.period === 'night' ? 'night-row' : '']">
							<text class="row-item time">{{item.time.split(' ')[1]}}</text>
							<text class="row-item type">
								<text :class="['period-tag', item.period]">{{item.periodText}}</text>
							</text>
							<text class="row-item value">{{formatRecordValue(item)}}</text>
							<text class="row-item status">
								<text :class="['status-tag', item.status]">{{item.statusText}}</text>
							</text>
						</view>
					</view>
				</view>

				<!-- 无数据提示 -->
				<view v-if="filteredData.length === 0" class="empty-tip">
					<text>{{$t('暂无数据')}}</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-btns">
			<button class="btn print" @click="printPDF">{{$t('分享报告')}}</button>
			<button class="btn back" @click="goBack">{{$t('返回')}}</button>
		</view>

		<!-- 分享弹窗 -->
		<view class="share-popup" v-if="showSharePopup" @click="closeSharePopup">
			<view class="share-content" @click.stop>
				<view class="share-title">{{$t('导出报告')}}</view>
				<view class="share-options">
					<view class="share-item" @click="generatePDF">
						<view class="share-icon pdf">📄</view>
						<text class="share-text">{{$t('生成PDF')}}</text>
					</view>
					<view class="share-item" @click="printPDF">
						<view class="share-icon print">🖨️</view>
						<text class="share-text">{{$t('打印')}}</text>
					</view>
				</view>
				<view class="share-cancel" @click="closeSharePopup">{{$t('取消')}}</view>
			</view>
		</view>

		<!-- PDF预览弹窗 -->
		<view class="pdf-popup" v-if="showPDFPreview" @click="closePDFPreview">
			<view class="pdf-content" @click.stop>
				<view class="pdf-header">
					<text class="pdf-title">{{$t('PDF报告预览')}}</text>
					<text class="pdf-close" @click="closePDFPreview">✕</text>
				</view>

				<scroll-view class="pdf-body" scroll-y="true" :scroll-top="scrollTop" @scroll="onScroll" enhanced="true"
					show-scrollbar="true" :style="{height: '100%'}">
					<view class="pdf-image-wrapper" :style="{minHeight: '100%'}">
						<image v-if="pdfImagePath" :src="pdfImagePath" mode="widthFix" class="pdf-image"
							@load="onImageLoad" @error="onImageError" :style="{width: '100%'}" />
						<view v-else class="pdf-loading">{{$t('正在生成PDF...')}}</view>
					</view>
					<view class="pdf-bottom-space" style="height: 100rpx;"></view>
				</scroll-view>

				<view class="pdf-footer">
					<button class="pdf-btn save" @click="savePDF">{{$t('保存到本地')}}</button>
					<button class="pdf-btn print" @click="doPrint">{{$t('打印')}}</button>
					<button class="pdf-btn share" @click="sharePDF">{{$t('分享PDF')}}</button>
				</view>
			</view>
		</view>

		<!-- 打印预览弹窗 -->
		<view class="print-popup" v-if="showPrintPreview" @click="closePrintPreview">
			<view class="print-content" @click.stop>
				<view class="print-header">
					<text class="print-title">{{$t('分享预览')}}</text>
					<text class="print-close" @click="closePrintPreview">✕</text>
				</view>

				<scroll-view class="print-body" scroll-y="true">
					<view id="printable-area" class="printable-area">
						<!-- 打印内容区域 -->
						<view class="print-page">
							<view class="print-header-section">
								<text class="print-main-title">{{$t('小时监测报告24')}}</text>
								<view class="print-subtitle">
									<text>{{$t('姓名')}}：{{userInfo.name}} | {{$t('性别')}}：{{getsex(userInfo.gender)}} |
										{{$t('年龄')}}：{{userInfo.age}}{{$t('岁')}}</text>
								</view>
								<view class="print-time">
									<text>{{$t('监测时间')}}：{{monitorInfo.startTime}} {{$t('至')}}
										{{monitorInfo.endTime}}</text>
								</view>
							</view>

							<!-- 身体指标 -->
							<view class="print-section"
								v-if="userInfo.height || userInfo.weight || request.bmi !== 'NA'">
								<view class="print-section-title">{{$t('身体指标')}}</view>
								<view class="print-info-grid">
									<view class="print-info-item" v-if="userInfo.height">
										<text class="print-info-label">{{$t('身高')}}</text>
										<text class="print-info-value">{{formatBodyHeight(userInfo.height)}}</text>
									</view>
									<view class="print-info-item" v-if="userInfo.weight">
										<text class="print-info-label">{{$t('体重')}}</text>
										<text class="print-info-value">{{formatBodyWeight(userInfo.weight)}}</text>
									</view>
									<view class="print-info-item" v-if="userInfo.waist">
										<text class="print-info-label">{{$t('腰围')}}</text>
										<text class="print-info-value">{{formatBodyHeight(userInfo.waist)}}</text>
									</view>
									<view class="print-info-item" v-if="request.bmi && request.bmi !== 'NA'">
										<text class="print-info-label">BMI</text>
										<text class="print-info-value"
											:class="getBmiClass(request.bmi)">{{request.bmi}}</text>
									</view>
									<view class="print-info-item" v-if="request.whtr && request.whtr !== 'NA'">
										<text class="print-info-label">{{$t('腰围身高比')}}</text>
										<text class="print-info-value">{{request.whtr}}</text>
									</view>
								</view>
							</view>

							<!-- 用药信息 -->
							<view class="print-section" v-if="userInfo.takingMedicine">
								<view class="print-section-title">{{$t('用药信息')}}</view>
								<view class="print-medicine-grid">
									<view class="print-medicine-item wide">
										<text class="print-medicine-label">{{$t('是否服用高血压药物')}}</text>
										<text
											class="print-medicine-value">{{userInfo.takingMedicine === true ? $t('是') : $t('否')}}</text>
									</view>
									<view class="print-medicine-item"
										v-if="userInfo.takingMedicine === true && userInfo.medicineType">
										<text class="print-medicine-label">{{$t('服药种类')}}</text>
										<text class="print-medicine-value">{{userInfo.medicineType}}</text>
									</view>
									<view class="print-medicine-item"
										v-if="userInfo.takingMedicine === true && userInfo.medicineTime">
										<text class="print-medicine-label">{{$t('服药时间')}}</text>
										<text class="print-medicine-value">{{userInfo.medicineTime}}</text>
									</view>
									<view class="print-medicine-item wide"
										v-if="userInfo.takingMedicine ===true && userInfo.diagnosisDate">
										<text class="print-medicine-label">{{$t('确诊时间')}}</text>
										<text class="print-medicine-value">{{userInfo.diagnosisDate}}</text>
									</view>
								</view>
							</view>

							<!-- 睡眠数据 -->
							<view class="print-section">
								<view class="print-section-title">{{$t('睡眠数据')}}</view>
								<view class="print-medicine-grid">
									<view class="print-medicine-item wide" v-if="hasSleepData">
										<text class="print-medicine-label">{{$t('睡眠时间')}}</text>
										<text class="print-medicine-value">{{userInfo.sleepTime}}</text>
									</view>
									<view class="print-medicine-item wide" v-else>
										<text class="print-medicine-value">{{$t('此用户未佩戴手表测量睡眠数据')}}</text>
									</view>
								</view>
							</view>

							<view class="print-section">
								<view class="print-section-title">{{$t('统计概览')}}</view>
								<view class="print-stats-grid">
									<view class="print-stat-box">
										<text class="print-stat-label">{{$t('小时平均血压24')}}</text>
										<text
											class="print-stat-value">{{stats.avg24h.systolic}}/{{stats.avg24h.diastolic}}
											mmHg</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{$t('白天平均')}}</text>
										<text
											class="print-stat-value">{{stats.dayAvg.systolic}}/{{stats.dayAvg.diastolic}}
											mmHg</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{$t('夜间平均')}}</text>
										<text
											class="print-stat-value">{{stats.nightAvg.systolic}}/{{stats.nightAvg.diastolic}}
											mmHg</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{$t('总测量次数')}}</text>
										<text class="print-stat-value">{{stats.totalCount}} {{$t('次')}}</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{$t('白天测量')}}</text>
										<text class="print-stat-value">{{dayCount}} {{$t('次')}} ({{dayRatio}}%)</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{$t('夜间测量')}}</text>
										<text class="print-stat-value">{{nightCount}} {{$t('次')}}
											({{nightRatio}}%)</text>
									</view>
								</view>
							</view>

							<!-- 极值记录 -->
							<view class="print-section">
								<view class="print-section-title">{{$t('极值记录')}}</view>
								<view class="print-extreme-grid large">
									<view class="print-extreme-box high">
										<text class="print-extreme-label">{{$t('最高血压')}}</text>
										<text
											class="print-extreme-value large">{{stats.max.systolic}}/{{stats.max.diastolic}}</text>
										<text class="print-extreme-label">mmHg</text>
										<text class="print-extreme-time">{{stats.max.time || '-'}}</text>
									</view>
									<view class="print-extreme-box low">
										<text class="print-extreme-label">{{$t('最低血压')}}</text>
										<text
											class="print-extreme-value large">{{stats.min.systolic}}/{{stats.min.diastolic}}</text>
										<text class="print-extreme-label">mmHg</text>
										<text class="print-extreme-time">{{stats.min.time || '-'}}</text>
									</view>
								</view>
							</view>

							<!-- 监测设置 -->
							<view class="print-section">
								<view class="print-section-title">{{$t('监测设置')}}</view>
								<view class="print-setting-grid">
									<view class="print-setting-item">
										<text class="print-setting-label">{{$t('白天监测时段')}}</text>
										<text class="print-setting-value">06:00 - 21:30</text>
									</view>
									<view class="print-setting-item">
										<text class="print-setting-label">{{$t('白天监测间隔')}}</text>
										<text class="print-setting-value">30{{$t('分钟次')}}</text>
									</view>
									<view class="print-setting-item">
										<text class="print-setting-label">{{$t('夜间监测时段')}}</text>
										<text class="print-setting-value">21:30 - 06:00</text>
									</view>
									<view class="print-setting-item">
										<text class="print-setting-label">{{$t('夜间监测间隔')}}</text>
										<text class="print-setting-value">60{{$t('分钟次')}}</text>
									</view>
								</view>
							</view>

							<view class="print-section">
								<view class="print-section-title">
									{{$t('详细监测数据')}}（{{$t('共')}}{{monitorData.length}}{{$t('条')}}）
								</view>
								<view class="print-table">
									<view class="print-table-header">
										<text class="print-th">{{$t('时间')}}</text>
										<text class="print-th">{{$t('时段')}}</text>
										<text class="print-th">{{$t('血压值')}}</text>
										<text class="print-th">{{$t('状态')}}</text>
									</view>
									<view v-for="(item, index) in printDataList" :key="index" class="print-table-row">
										<text class="print-td">{{item.time}}</text>
										<text class="print-td">{{item.periodText}}</text>
										<text class="print-td">{{formatRecordValue(item)}}</text>
										<text class="print-td"
											:class="'status-' + item.status">{{item.statusText}}</text>
									</view>
								</view>
							</view>

							<view class="print-footer-section">
								<text>{{$t('报告生成时间')}}：{{currentDateTime}}</text>
								<text>{{$t('本报告仅供参考不作为医疗诊断依据')}}</text>
							</view>
						</view>
					</view>
					<view class="print-bottom-space"></view>
				</scroll-view>

				<view class="print-footer">
					<button class="print-btn cancel" @click="closePrintPreview">{{$t('取消')}}</button>
					<button class="print-btn confirm" @click="executePrint">{{$t('确认分享')}}</button>
				</view>
			</view>
		</view>

		<!-- 隐藏canvas用于生成分享图片 -->
		<canvas canvas-id="shareCanvas" id="shareCanvas" class="share-canvas"></canvas>
	</view>
</template>

<script>
	// #ifdef H5
	import html2canvas from 'html2canvas';
	import jsPDF from 'jspdf';
	// #endif
	import {
		getChinaTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'
	import {
		imageToPdf,
		savePdfToFile
	} from '../../../api/unitls/imageToPdf.js';

	export default {
		data() {
			return {
				userInfo: {
					name: '张三',
					gender: '男',
					age: 45,
					height: '',
					weight: '',
					waist: '',
					takingMedicine: false,
					medicineType: '',
					medicineTime: '',
					diagnosisDate: '',
					heightunit: '',
					weightunit: '',
					sleepTime: ''
				},
				request: {
					bmi: "NA",
					whtr: "NA"
				},
				monitorInfo: {
					startTime: "",
					endTime: ""
				},
				currentTab: 'all',
				stats: {
					avg24h: {
						systolic: '-',
						diastolic: '-'
					},
					dayAvg: {
						systolic: '-',
						diastolic: '-'
					},
					nightAvg: {
						systolic: '-',
						diastolic: '-'
					},
					totalCount: 0,
					max: {
						systolic: '-',
						diastolic: '-',
						time: ''
					},
					min: {
						systolic: '-',
						diastolic: '-',
						time: ''
					}
				},
				monitorData: [],
				dayCount: 0,
				nightCount: 0,
				pacitime: getChinaTimeAllJSON().YMD + ' 07:00:00',
				filterVarList: "JLvFLGvJL01v2D",
				period: "2D",
				finlretVarList1: 'BPvSBPvCNTv2DvCNTv0002,BPvSBPvCNTv2DvCNTv0003,BPvSBPvCNTv2DvCNTv0004,BPvSBPvCNTv2DvCNTv0001,JLvRULEv2DvDATACHECKv0001,JLvRULEv2DvDATACHECKv0002,JLvRULEv2DvDATACHECKv0003,BPvSBPvAVGv2DvAVGv0002,BPvDBPvAVGv2DvAVGv0002,BPvHRvAVGv2DvAVGv0002,BPvSBPvAVGv2DvAVGv0003,BPvDBPvAVGv2DvAVGv0003,BPvHRvAVGv2DvAVGv0003,BPvSBPvAVGv2DvAVGv0004,BPvDBPvAVGv2DvAVGv0004,BPvHRvAVGv2DvAVGv0004,BPvSBPvAVGv2DvAVGv0001,BPvDBPvAVGv2DvAVGv0001,BPvHRvAVGv2DvAVGv0001,JLvRULEv2DvBPCHECKv0004,JLvRULEv2DvBPCHECKv0005,JLvRULEv2DvBPCHECKv0007,JLvRULEv2DvBPCHECKv0008,JLvRULEv2DvBPCHECKv0010,JLvRULEv2DvBPCHECKv0011,JLvRULEv2DvBPCHECKv0001,JLvRULEv2DvBPCHECKv0002,BPvSBPvSTDv2DvSTDv0002,BPvDBPvSTDv2DvSTDv0002,BPvHRvSTDv2DvSTDv0002,BPvSBPvSTDv2DvSTDv0003,BPvDBPvSTDv2DvSTDv0003,BPvHRvSTDv2DvSTDv0003,BPvSBPvSTDv2DvSTDv0004,BPvDBPvSTDv2DvSTDv0004,BPvHRvSTDv2DvSTDv0004,BPvSBPvSTDv2DvSTDv0001,BPvDBPvSTDv2DvSTDv0001,BPvHRvSTDv2DvSTDv0001,BPvSBPvMAXv2DvMAXv0002,BPvDBPvMAXv2DvMAXv0002,BPvHRvMAXv2DvMAXv0002,BPvSBPvMAXv2DvMAXv0003,BPvDBPvMAXv2DvMAXv0003,BPvHRvMAXv2DvMAXv0003,BPvSBPvMAXv2DvMAXv0004,BPvDBPvMAXv2DvMAXv0004,BPvHRvMAXv2DvMAXv0004,BPvSBPvMAXv2DvMAXv0001,BPvDBPvMAXv2DvMAXv0001,BPvHRvMAXv2DvMAXv0001,BPvSBPvMEDv2DvMEDv0002,BPvDBPvMEDv2DvMEDv0002,BPvHRvMEDv2DvMEDv0002,BPvSBPvMEDv2DvMEDv0003,BPvDBPvMEDv2DvMEDv0003,BPvHRvMEDv2DvMEDv0003,BPvSBPvMEDv2DvMEDv0004,BPvDBPvMEDv2DvMEDv0004,BPvHRvMEDv2DvMEDv0004,BPvSBPvMEDv2DvMEDv0001,BPvDBPvMEDv2DvMEDv0001,BPvHRvMEDv2DvMEDv0001,BPvSBPvMINv2DvMINv0002,BPvDBPvMINv2DvMINv0002,BPvHRvMINv2DvMINv0002,BPvSBPvMINv2DvMINv0003,BPvDBPvMINv2DvMINv0003,BPvHRvMINv2DvMINv0003,BPvSBPvMINv2DvMINv0004,BPvDBPvMINv2DvMINv0004,BPvHRvMINv2DvMINv0004,BPvSBPvMINv2DvMINv0001,BPvDBPvMINv2DvMINv0001,BPvHRvMINv2DvMINv0001,BPvSBPvLOADv2DvRATIOv0002,BPvDBPvLOADv2DvRATIOv0002,BPvSBPvLOADv2DvRATIOv0003,BPvDBPvLOADv2DvRATIOv0003,BPvSBPvLOADv2DvRATIOv0004,BPvDBPvLOADv2DvRATIOv0004,BPvSBPvLOADv2DvRATIOv0001,BPvDBPvLOADv2DvRATIOv0001,JLvRULEv2DvBPCHECKv0022,JLvRULEv2DvBPCHECKv0027,JLvRULEv2DvBPCHECKv0023,JLvRULEv2DvBPCHECKv0028,JLvRULEv2DvBPCHECKv0024,JLvRULEv2DvBPCHECKv0029,JLvRULEv2DvBPCHECKv0021,JLvRULEv2DvBPCHECKv0026,BPvSBPvNBRv2DvRATIOv0001,BPvDBPvNBRv2DvRATIOv0001,JLvRULEv2DvBPCHECKv0013,JLvRULEv2DvBPCHECKv0014,JLvRULEv2DvBPCHECKv0015,JLvRULEv2DvBPCHECKv0016,JLvRULEv2DvBPCHECKv0017,JLvRULEv2DvBPCHECKv0018, JLvRULEv2DvBPCHECKv0019, JLvRULEv2DvBPCHECKv0020,BPvSBPvMBSv2DvMINUSv0001,BPvDBPvMBSv2DvMINUSv0001,JLvRULEv2DvBPCHECKv0031,BPvSBPvCVv2DvRATIO2v0002,BPvDBPvCVv2DvRATIO2v0002,BPvHRvCVv2DvRATIO2v0002,BPvSBPvCVv2DvRATIO2v0003,BPvDBPvCVv2DvRATIO2v0003,BPvHRvCVv2DvRATIO2v0003,BPvSBPvCVv2DvRATIO2v0004,BPvDBPvCVv2DvRATIO2v0004,BPvHRvCVv2DvRATIO2v0004,BPvSBPvCVv2DvRATIO2v0001,BPvDBPvCVv2DvRATIO2v0001,BPvHRvCVv2DvRATIO2v0001,BPvAASIv2D,JLvRULEv2DvBPCHECKv0032',
				dayRatio: 0,
				nightRatio: 0,
				Blood: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa",
				showSharePopup: false,
				showPDFPreview: false,
				showPrintPreview: false,
				shareImagePath: '',
				pdfPath: '',
				pdfImagePath: '',
				pdfBase64: '',
				pdfBlob: null,
				scrollTop: 0,
				imageHeight: 0,
				printDataList: [],
				currentDateTime: '',
				canvasWidth: 750,
				canvasHeight: 2000,
			}
		},
		computed: {
			hasSleepData() {
				const sleepTime = this.userInfo && this.userInfo.sleepTime
				if (!sleepTime) return false
				const invalidValues = ['-/-', '--/--', '0H0M', '0h0m']
				return !invalidValues.includes(String(sleepTime).trim())
			},
			filteredData() {
				return this.currentTab === 'all' ?
					this.monitorData :
					this.monitorData.filter(item => item.period === this.currentTab);
			},
			groupedData() {
				const groups = {};
				this.filteredData.forEach(item => {
					const date = item.time.split(' ')[0];
					if (!groups[date]) groups[date] = [];
					groups[date].push(item);
				});
				const itemTimeMs = (item) => {
					const ts = Number(item && item.timestamp);
					if (ts && !Number.isNaN(ts)) return ts;
					const raw = String((item && (item.fullTime || item.time)) || '').replace(/-/g, '/');
					const parsed = new Date(raw).getTime();
					return Number.isNaN(parsed) ? 0 : parsed;
				};
				return Object.keys(groups)
					.sort((a, b) => new Date(b) - new Date(a))
					.reduce((acc, key) => {
						// 日期已倒序；同日内按测量时间正序，避免明细时间乱序
						acc[key] = groups[key].slice().sort((a, b) => itemTimeMs(a) - itemTimeMs(b));
						return acc;
					}, {});
			}
		},
		onLoad(options) {
			try {
				const request = JSON.parse(decodeURIComponent(options.request));
				const form = JSON.parse(decodeURIComponent(options.form));
				console.log("request:", request);
				console.log("form:", form);
				this.userInfo = {
					...this.userInfo,
					...form
				};
				this.request = request;
			} catch (e) {
				console.error("参数解析失败:", e);
			}
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("小时监测报告24")
			})
			that.calculateTimeRange();
			that.updateCurrentDateTime();
			that.get_finalRetVarList();
			that.get_retVarList();
		},
		methods: {
			// ==================== 工具方法 ====================
			getsex(sex) {
				if (sex === "男" || sex === "Male") {
					return this.$t("男")
				} else if (sex === "女" || sex === "Female") {
					return this.$t("女")
				}
			},


			updateCurrentDateTime() {
				const now = new Date();
				this.currentDateTime = now.toLocaleString('zh-CN');
			},
			getCurrentTime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, "0");
				const day = String(now.getDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			},
			dundatetime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, "0");
				const day = String(now.getDate()).padStart(2, "0");
				const hours = String(now.getHours()).padStart(2, "0");
				const minutes = String(now.getMinutes()).padStart(2, "0");
				const seconds = String(now.getSeconds()).padStart(2, "0");
				const timesssaa = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
				return timesssaa
			},
			calculateTimeRange() {
				const pad = (n) => String(n).padStart(2, '0');
				const now = new Date();
				const y = now.getFullYear();
				const m = pad(now.getMonth() + 1);
				const d = pad(now.getDate());
				// 24 小时动态血压：前一日 06:00 → 当日 06:00（含夜间 21:30–06:00）
				const endTime = `${y}-${m}-${d} 07:00:00`;
				const startDate = new Date(`${y}/${m}/${d} 07:00:00`);
				startDate.setDate(startDate.getDate() - 1);
				const sy = startDate.getFullYear();
				const sm = pad(startDate.getMonth() + 1);
				const sd = pad(startDate.getDate());
				const startTime = `${sy}-${sm}-${sd} 07:00:00`;
				this.monitorInfo.startTime = startTime;
				this.monitorInfo.endTime = endTime;
			},
			getBmiClass(bmi) {
				if (!bmi || bmi === 'NA') return '';
				const val = parseFloat(bmi);
				if (isNaN(val)) return '';
				if (val < 18.5) return 'underweight';
				if (val < 24) return 'normal';
				if (val < 28) return 'overweight';
				return 'obese';
			},
			getBodyHeightUnit() {
				return this.userInfo.heightunit || this.$t('厘米');
			},
			getBodyWeightUnit() {
				return this.userInfo.weightunit || this.$t('千克');
			},
			formatBodyHeight(value) {
				if (value == null || value === '') return '';
				return `${value}${this.getBodyHeightUnit()}`;
			},
			formatBodyWeight(value) {
				if (value == null || value === '') return '';
				return `${value}${this.getBodyWeightUnit()}`;
			},

			getStatus(sys, dia) {

				if (!sys || !dia) return {
					code: '',
					text: "/"
				};

				if (sys >= 140 || dia >= 90) return {
					code: 'high',
					text: this.$t('偏高')
				};
				if (sys <= 90 || dia <= 60) return {
					code: 'low',
					text: this.$t('偏低')
				};
				if (sys >= 120 || dia >= 80) return {
					code: 'warning',
					text: this.$t('正常高值')
				};
				return {
					code: 'normal',
					text: this.$t('正常')
				};
			},
			isValidPressureValue(value) {
				if (value == null || value === '' || value === '-' || value === '--') return false;
				const num = Number(value);
				return !Number.isNaN(num) && num > 0;
			},
			hasValidBloodPressure(highPressure, lowPressure) {
				return this.isValidPressureValue(highPressure) && this.isValidPressureValue(lowPressure);
			},
			hasValidHeartRate(heartrate) {
				if (heartrate == null || heartrate === '' || heartrate === '-' || heartrate === '--') return false;
				const num = Number(heartrate);
				return !Number.isNaN(num) && num > 0;
			},
			formatRecordValue(item) {
				if (item.heartRateOnly) {
					return String(item.heartRate ?? '-');
				}
				return `${item.systolic}/${item.diastolic}`;
			},
			formatPrintSystolic(item) {
				return item.heartRateOnly ? String(item.heartRate ?? '-') : String(item.systolic);
			},
			formatPrintDiastolic(item) {
				return item.heartRateOnly ? '-' : String(item.diastolic);
			},
			getPeriod(timeStr) {
				const hour = parseInt(timeStr.split(':')[0]);
				const minute = parseInt(timeStr.split(':')[1]);
				const timeInMinutes = hour * 60 + minute;
				const dayStart = 6 * 60;
				const dayEnd = 21 * 60 + 30;
				if (timeInMinutes >= dayStart && timeInMinutes < dayEnd) {
					return {
						period: 'day',
						periodText: this.$t('白天')
					};
				} else {
					return {
						period: 'night',
						periodText: this.$t('夜间')
					};
				}
			},
			convertPressure(value) {
				if (this.Blood === 'mmHg') return value;
				return (Number(value) * 0.133).toFixed(1);
			},
			switchTab(tab) {
				this.currentTab = tab;
			},
			goBack() {
				uni.navigateBack();
			},

			// ==================== 数据处理 ====================
			processRetVarList(retVarListStr) {
				const processedData = [];
				if (!retVarListStr) return processedData;
				const isInvalid = (value) => {
					const v = String(value == null ? '' : value).trim();
					return !v || v >= '999999990.00' || v === 'NA';
				};
				const seen = new Set();
				const rows = retVarListStr.split(';').filter(Boolean);
				for (const row of rows) {
					const parts = row.split(',').map(item => item.trim());
					if (parts.length < 4) continue;
					const fullTime = parts[0];
					if (seen.has(fullTime)) continue;
					const hasBp = !isInvalid(parts[1]) && !isInvalid(parts[2]);
					const hasHr = !isInvalid(parts[3]);
					if (!hasBp && !hasHr) continue;
					const timeSegments = fullTime.split(' ');
					const date = timeSegments[0] || fullTime;
					const timeStr = timeSegments[1] || '';
					if (!hasBp && hasHr) continue;
					seen.add(fullTime);
					const periodInfo = this.getPeriod(timeStr);
					const timestamp = new Date(fullTime.replace(/-/g, '/')).getTime();
					const status = this.getStatus(parts[1], parts[2]);
					processedData.push({
						fullTime: `${date} ${timeStr}`,
						time: `${date} ${timeStr.substring(0, 5)}`,
						period: periodInfo.period,
						periodText: periodInfo.periodText,
						systolic: this.convertPressure(parts[1]),
						diastolic: this.convertPressure(parts[2]),
						heartRate: parts[3],
						heartRateOnly: false,
						timestamp,
						status: status.code,
						statusText: status.text
					});
				}
				return processedData.sort((a, b) => a.timestamp - b.timestamp);
			},
			filterByMonitorTimeRange(data) {
				if (!data || !data.length) return [];
				const startTs = new Date(this.monitorInfo.startTime.replace(/-/g, '/')).getTime();
				const endTs = new Date(this.monitorInfo.endTime.replace(/-/g, '/')).getTime();
				if (Number.isNaN(startTs) || Number.isNaN(endTs)) return data;
				return data.filter(item => {
					const ts = item.timestamp ?? new Date(String(item.fullTime).replace(/-/g, '/')).getTime();
					return !Number.isNaN(ts) && ts >= startTs && ts <= endTs;
				});
			},
			updateStatistics(data) {
				if (!data || data.length === 0) {
					this.stats.totalCount = 0;
					this.dayCount = 0;
					this.nightCount = 0;
					// 清空极值
					this.stats.max = {
						systolic: '-',
						diastolic: '-',
						time: ''
					};
					this.stats.min = {
						systolic: '-',
						diastolic: '-',
						time: ''
					};
					return;
				}

				const dayData = data.filter(d => d.period === 'day');
				const nightData = data.filter(d => d.period === 'night');
				const bpData = data.filter(d => !d.heartRateOnly);
				const bpDayData = bpData.filter(d => d.period === 'day');
				const bpNightData = bpData.filter(d => d.period === 'night');
				this.dayCount = dayData.length;
				this.nightCount = nightData.length;
				this.stats.totalCount = data.length;

				// 计算平均值
				const avg = (arr) => {
					if (arr.length === 0) return {
						systolic: '-',
						diastolic: '-'
					};
					const sysSum = arr.reduce((a, b) => a + Number(b.systolic), 0);
					const diaSum = arr.reduce((a, b) => a + Number(b.diastolic), 0);
					return {
						systolic: Math.round(sysSum / arr.length),
						diastolic: Math.round(diaSum / arr.length)
					};
				};

				// 只有在API没有返回数据时，才用列表数据计算平均值
				if (this.stats.avg24h.systolic === '-' || this.stats.avg24h.systolic === 'NA') {
					this.stats.avg24h = avg(bpData);
				}
				if (this.stats.dayAvg.systolic === '-' || this.stats.dayAvg.systolic === 'NA') {
					this.stats.dayAvg = avg(bpDayData);
				}
				if (this.stats.nightAvg.systolic === '-' || this.stats.nightAvg.systolic === 'NA') {
					this.stats.nightAvg = avg(bpNightData);
				}

				// 计算昼夜比值
				if (!this.dayRatio || this.dayRatio === 0) {
					this.dayRatio = this.stats.totalCount > 0 ? Math.round((this.dayCount / this.stats.totalCount) * 100) :
						0;
					this.nightRatio = this.stats.totalCount > 0 ? Math.round((this.nightCount / this.stats.totalCount) *
						100) : 0;
				}

				// ==================== 新增：计算最高血压和最低血压 ====================
				this.calculateExtremes(bpData);
			},

			// 新增方法：计算血压极值
			calculateExtremes(data) {
				if (!data || data.length === 0) {
					this.stats.max = {
						systolic: '-',
						diastolic: '-',
						time: ''
					};
					this.stats.min = {
						systolic: '-',
						diastolic: '-',
						time: ''
					};
					return;
				}

				let maxItem = data[0];
				let minItem = data[0];

				// 遍历所有数据找出最高和最低
				for (const item of data) {
					const sys = Number(item.systolic);
					const dia = Number(item.diastolic);
					const maxSys = Number(maxItem.systolic);
					const maxDia = Number(maxItem.diastolic);
					const minSys = Number(minItem.systolic);
					const minDia = Number(minItem.diastolic);

					// 判断最高血压：先比较收缩压，收缩压相同则比较舒张压
					if (sys > maxSys || (sys === maxSys && dia > maxDia)) {
						maxItem = item;
					}

					// 判断最低血压：先比较收缩压，收缩压相同则比较舒张压
					if (sys < minSys || (sys === minSys && dia < minDia)) {
						minItem = item;
					}
				}

				// 更新最高血压数据
				this.stats.max = {
					systolic: maxItem.systolic,
					diastolic: maxItem.diastolic,
					time: maxItem.fullTime || maxItem.time
				};

				// 更新最低血压数据
				this.stats.min = {
					systolic: minItem.systolic,
					diastolic: minItem.diastolic,
					time: minItem.fullTime || minItem.time
				};
			},
			// ==================== API 请求 ====================
			get_finalRetVarList() {
				let that = this;
				let data = {
					userId: uni.getStorageSync("userid"),
					profDate: that.pacitime,
					period: that.period,
					retVarList: that.finlretVarList1.toLowerCase()
				};
				console.log("get_finalRetVarList", data)
				that.$post(that.$url_APP_IP + "/prod-api/device_app/get_finalRetVarList", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then((get_finalRetVarList) => {
					console.log("get_finalRetVarList", get_finalRetVarList)
					if (get_finalRetVarList.code === 200) {
						if (get_finalRetVarList.data.retVarList !== "") {
							let resultArray = get_finalRetVarList.data.retVarList.split(";");
							const checkAndAssign = (value) => {
								return value >= "999999990.00" ? "NA" : value;
							};
							for (let i = 0; i < resultArray.length; i++) {
								let resultArray1 = resultArray[i].split(",");
								that.dayRatio = checkAndAssign(resultArray1[0]) === "NA" ? 0 : parseFloat(
									checkAndAssign(resultArray1[0]));
								that.nightRatio = checkAndAssign(resultArray1[1]) === "NA" ? 0 : parseFloat(
									checkAndAssign(resultArray1[1]));
								that.stats.dayAvg.systolic = checkAndAssign(resultArray1[7]);
								that.stats.dayAvg.diastolic = checkAndAssign(resultArray1[8]);
								that.stats.nightAvg.systolic = checkAndAssign(resultArray1[10]);
								that.stats.nightAvg.diastolic = checkAndAssign(resultArray1[11]);
								that.stats.avg24h.systolic = checkAndAssign(resultArray1[16]);
								that.stats.avg24h.diastolic = checkAndAssign(resultArray1[17]);
							}
						}
					}
				});
			},


			get_retVarList() {
				let that = this
				let data = {
					userId: uni.getStorageSync("userid"),
					profDate: getChinaTimeAllJSON().YMD + ' 07:00:00',
					filterVarList: that.filterVarList,
					retVarList: 'TIME_MEASURE,JLvOPRvJL01vSBP,JLvOPRvJL01vDBP,JLvOPRvJL01vHR'
				}
				console.log("get_retVarLisdata参数：", data)
				that.$post(that.$url_APP_IP + "/prod-api/device_app/get_retVarList", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then((get_retVarList) => {
					console.log("get_retVarLis：", get_retVarList)
					if (get_retVarList.code === 200 && get_retVarList.data && get_retVarList.data.retVarList) {
						const processedData = that.filterByMonitorTimeRange(
							that.processRetVarList(get_retVarList.data.retVarList)
						);
						that.monitorData = processedData;
						that.updateStatistics(processedData);
						if (!processedData.length) {
							console.warn('[hour24] get_retVarList 无明细', that.monitorInfo.startTime,
								that.monitorInfo.endTime, get_retVarList);
						}
					}
				}).catch((err) => {
					console.warn('[hour24] get_retVarList', err);
				});
			},

			// ==================== 分享和PDF功能 ====================
			exportReport() {
				this.generateShareImage();
			},
			generateShareImage() {
				uni.showLoading({
					title: this.$t('生成报告中...')
				});
				setTimeout(() => {
					const pages = getCurrentPages();
					const page = pages[pages.length - 1];
					this.shareImagePath = page.$getAppWebview().captureSnapshot();
					uni.hideLoading();
					this.showSharePopup = true;
				}, 500);
			},
			closeSharePopup() {
				this.showSharePopup = false;
			},

			// PDF生成
			async generatePDF() {
				this.closeSharePopup();
				uni.showLoading({
					title: this.$t('生成PDF中...'),
					mask: true
				});
				try {
					// #ifdef H5
					await this.generatePDFH5();
					// #endif
					// #ifdef APP-PLUS
					await this.generatePDFApp();
					// #endif
					// #ifdef MP-WEIXIN || MP-QQ
					await this.generatePDFMP();
					// #endif
					uni.hideLoading();
					this.showPDFPreview = true;
				} catch (error) {
					console.error('生成PDF失败:', error);
					uni.hideLoading();
					uni.showToast({
						title: this.$t('生成PDF失败') + ': ' + error.message,
						icon: 'none',
						duration: 3000
					});
				}
			},

			// H5端：使用html2canvas + jsPDF生成PDF
			async generatePDFH5() {
				await new Promise(resolve => setTimeout(resolve, 500));
				const element = document.querySelector('.container');
				if (!element) throw new Error(this.$t('未找到页面内容'));

				const originalHeight = element.style.height;
				const originalOverflow = element.style.overflow;
				element.style.height = 'auto';
				element.style.overflow = 'visible';

				try {
					const canvas = await html2canvas(element, {
						scale: 2,
						useCORS: true,
						allowTaint: true,
						backgroundColor: '#f5f7fa',
						height: element.scrollHeight,
						windowHeight: element.scrollHeight,
						logging: false,
						y: 0,
						scrollY: 0
					});

					const imgData = canvas.toDataURL('image/png');
					this.pdfImagePath = imgData;

					const pdf = new jsPDF('p', 'mm', 'a4');
					const imgWidth = 210;
					const pageHeight = 297;
					const imgHeight = canvas.height * imgWidth / canvas.width;
					let heightLeft = imgHeight;
					let position = 0;

					pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;

					while (heightLeft > 0) {
						position = heightLeft - imgHeight;
						pdf.addPage();
						pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
						heightLeft -= pageHeight;
					}

					this.pdfBase64 = pdf.output('datauristring');
					this.pdfBlob = pdf.output('blob');
				} finally {
					element.style.height = originalHeight;
					element.style.overflow = originalOverflow;
				}
			},

			// App端：使用原生能力生成PDF
			async generatePDFApp() {
				return new Promise((resolve, reject) => {
					this.drawDetailedCanvas().then(imagePath => {
						plus.io.resolveLocalFileSystemURL(imagePath, (entry) => {
							entry.file((file) => {
								const reader = new plus.io.FileReader();
								reader.onloadend = (e) => {
									const base64Data = e.target.result;
									this.pdfImagePath = imagePath;
									this.pdfBase64 = base64Data;
									resolve();
								};
								reader.onerror = (e) => {
									reject(new Error(this.$t('读取文件失败') + ': ' + e
										.message));
								};
								reader.readAsDataURL(file);
							});
						}, (e) => {
							reject(new Error(this.$t('获取文件失败') + ': ' + e.message));
						});
					}).catch(reject);
				});
			},

			// 小程序端：上传图片到服务器生成PDF
			async generatePDFMP() {
				await this.drawDetailedCanvas();
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.$url_APP_IP + '/api/report/generatePDF',
						filePath: this.pdfImagePath,
						name: 'image',
						formData: {
							userInfo: JSON.stringify(this.userInfo),
							stats: JSON.stringify(this.stats),
							monitorInfo: JSON.stringify(this.monitorInfo)
						},
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync('token')
						},
						success: (res) => {
							try {
								const data = JSON.parse(res.data);
								if (data.code === 200) {
									this.pdfPath = data.data.pdfUrl;
									this.pdfBase64 = data.data.pdfBase64;
									if (data.data.previewImage) this.pdfImagePath = data.data
										.previewImage;
									resolve();
								} else {
									reject(new Error(data.msg || this.$t('生成PDF失败')));
								}
							} catch (e) {
								reject(new Error(this.$t('解析响应失败')));
							}
						},
						fail: (err) => reject(new Error(this.$t('上传失败') + ': ' + err.errMsg))
					});
				});
			},

			// 绘制详细Canvas
			drawDetailedCanvas() {
				return new Promise((resolve, reject) => {
					const ctx = uni.createCanvasContext('shareCanvas', this);
					const width = 750;
					let totalHeight = this.calculateCanvasHeight();
					totalHeight += 100;
					totalHeight = Math.max(totalHeight, 1200);

					this.canvasWidth = width;
					this.canvasHeight = totalHeight;

					let y = 40;
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, width, totalHeight);

					// 标题
					ctx.fillStyle = '#667eea';
					ctx.font = 'bold 40px sans-serif';
					ctx.fillText(this.$t('24小时血压监测报告'), 40, y);
					y += 80;

					// 基本信息
					ctx.fillStyle = '#333';
					ctx.font = '28px sans-serif';
					ctx.fillText(`${this.$t('姓名')}：${this.userInfo.name}`, 40, y);
					y += 50;
					ctx.fillText(
						`${this.$t('性别')}：${this.getsex(this.userInfo.gender)}  ${this.$t('年龄')}：${this.userInfo.age}${this.$t('岁')}`,
						40, y);
					y += 50;
					ctx.fillText(`${this.$t('监测时间')}：${this.monitorInfo.startTime} ${this.$t('至')}`, 40, y);
					y += 40;
					ctx.fillText(`${this.monitorInfo.endTime}`, 40, y);
					y += 70;

					// 身体指标
					if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
						ctx.fillStyle = '#9b59b6';
						ctx.font = 'bold 32px sans-serif';
						ctx.fillText(`【${this.$t('身体指标')}】`, 40, y);
						y += 60;
						ctx.fillStyle = '#333';
						ctx.font = '28px sans-serif';

						if (this.userInfo.height) {
							ctx.fillText(`${this.$t('身高')}：${this.formatBodyHeight(this.userInfo.height)}`, 40, y);
							y += 50;
						}
						if (this.userInfo.weight) {
							ctx.fillText(`${this.$t('体重')}：${this.formatBodyWeight(this.userInfo.weight)}`, 40, y);
							y += 50;
						}
						if (this.userInfo.waist) {
							ctx.fillText(`${this.$t('腰围')}：${this.formatBodyHeight(this.userInfo.waist)}`, 40, y);
							y += 50;
						}
						if (this.request.bmi && this.request.bmi !== 'NA') {
							ctx.fillText(`BMI：${this.request.bmi}`, 40, y);
							y += 50;
						}
						if (this.request.whtr && this.request.whtr !== 'NA') {
							ctx.fillText(`${this.$t('腰围身高比')}：${this.request.whtr}`, 40, y);
							y += 50;
						}
						y += 20;
					}

					// 用药信息
					if (this.userInfo.takingMedicine) {
						ctx.fillStyle = '#e67e22';
						ctx.font = 'bold 32px sans-serif';
						ctx.fillText(`【${this.$t('用药信息')}】`, 40, y);
						y += 60;
						ctx.fillStyle = '#333';
						ctx.font = '28px sans-serif';
						ctx.fillText(
							`${this.$t('服用高血压药物')}：${this.userInfo.takingMedicine === true ? this.$t('是') : this.$t('否')}`,
							40, y);
						y += 50;

						if (this.userInfo.takingMedicine === true) {
							if (this.userInfo.medicineType) {
								ctx.fillText(`${this.$t('服药种类')}：${this.userInfo.medicineType}`, 40, y);
								y += 50;
							}
							if (this.userInfo.medicineTime) {
								ctx.fillText(`${this.$t('服药时间')}：${this.userInfo.medicineTime}`, 40, y);
								y += 50;
							}
							if (this.userInfo.diagnosisDate) {
								ctx.fillText(`${this.$t('确诊时间')}：${this.userInfo.diagnosisDate}`, 40, y);
								y += 50;
							}
						}
						y += 20;
					}

					// 睡眠数据
					ctx.fillStyle = '#3498db';
					ctx.font = 'bold 32px sans-serif';
					ctx.fillText(`【${this.$t('睡眠数据')}】`, 40, y);
					y += 60;
					ctx.fillStyle = '#333';
					ctx.font = '28px sans-serif';
					if (this.hasSleepData) {
						ctx.fillText(`${this.$t('睡眠时间')}：${this.userInfo.sleepTime}`, 40, y);
					} else {
						ctx.fillText(this.$t('此用户未佩戴手表测量睡眠数据'), 40, y);
					}
					y += 70;

					// 统计概览
					ctx.fillStyle = '#667eea';
					ctx.font = 'bold 32px sans-serif';
					ctx.fillText(`【${this.$t('统计概览')}】`, 40, y);
					y += 60;
					ctx.fillStyle = '#333';
					ctx.font = '28px sans-serif';
					ctx.fillText(
						`${this.$t('24小时平均血压')}：${this.stats.avg24h.systolic}/${this.stats.avg24h.diastolic} mmHg`,
						40, y);
					y += 50;
					ctx.fillText(
						`${this.$t('白天平均')}：${this.stats.dayAvg.systolic}/${this.stats.dayAvg.diastolic} mmHg`,
						40, y);
					y += 50;
					ctx.fillText(
						`${this.$t('夜间平均')}：${this.stats.nightAvg.systolic}/${this.stats.nightAvg.diastolic} mmHg`,
						40, y);
					y += 50;
					ctx.fillText(`${this.$t('总测量次数')}：${this.stats.totalCount} ${this.$t('次')}`, 40, y);
					y += 50;
					ctx.fillText(
						`${this.$t('白天测量')}：${this.dayCount} ${this.$t('次')}  ${this.$t('夜间测量')}：${this.nightCount} ${this.$t('次')}`,
						40, y);
					y += 70;

					// 极值记录
					ctx.fillStyle = '#e74c3c';
					ctx.font = 'bold 32px sans-serif';
					ctx.fillText(`【${this.$t('极值记录')}】`, 40, y);
					y += 70;

					const boxHeight = 120;
					const boxWidth = (width - 90) / 2;

					ctx.setStrokeStyle('#ffcdd2');
					ctx.setLineWidth(2);
					ctx.setFillStyle('#fff5f5');
					ctx.fillRect(40, y - 20, boxWidth, boxHeight);
					ctx.strokeRect(40, y - 20, boxWidth, boxHeight);

					ctx.setFillStyle('#e74c3c');
					ctx.font = 'bold 24px sans-serif';
					ctx.fillText(this.$t('最高血压'), 55, y + 15);
					ctx.font = 'bold 36px sans-serif';
					ctx.fillText(`${this.stats.max.systolic}/${this.stats.max.diastolic}`, 55, y + 60);
					ctx.font = '20px sans-serif';
					ctx.fillText(this.stats.max.time || '-', 55, y + 20);

					const rightX = 50 + boxWidth;
					ctx.setStrokeStyle('#b3e0ff');
					ctx.setFillStyle('#f0f9ff');
					ctx.fillRect(rightX, y - 20, boxWidth, boxHeight);
					ctx.strokeRect(rightX, y - 20, boxWidth, boxHeight);

					ctx.setFillStyle('#3498db');
					ctx.font = 'bold 24px sans-serif';
					ctx.fillText(this.$t('最低血压'), rightX + 15, y + 15);
					ctx.font = 'bold 36px sans-serif';
					ctx.fillText(`${this.stats.min.systolic}/${this.stats.min.diastolic}`, rightX + 15, y + 60);
					ctx.font = '20px sans-serif';
					ctx.fillText(this.stats.min.time || '-', rightX + 15, y + 40);

					y += boxHeight + 40;

					// 详细数据
					const displayData = this.monitorData;
					if (displayData.length > 0) {
						y += 30;
						ctx.fillStyle = '#f39c12';
						ctx.font = 'bold 32px sans-serif';
						ctx.fillText(`【${this.$t('详细监测数据')}】（${this.$t('共')}${displayData.length}${this.$t('条')}）`,
							40, y);
						y += 60;

						ctx.fillStyle = '#333';
						ctx.font = '24px sans-serif';

						displayData.forEach((item, index) => {
							const statusColor = {
								'high': '#e74c3c',
								'low': '#3498db',
								'warning': '#f39c12',
								'normal': '#2ecc71',
								'heartrate': '#9c27b0'
							} [item.status] || '#333';

							ctx.fillStyle = statusColor;
							ctx.fillText(
								`${item.time}  ${item.periodText}  ${this.formatRecordValue(item)}  ${item.statusText}`,
								40, y);
							y += 45;
						});
					}

					// 底部信息
					y += 40;
					ctx.fillStyle = '#999';
					ctx.font = '24px sans-serif';
					ctx.fillText(`${this.$t('报告生成时间')}：${new Date().toLocaleString('zh-CN')}`, 40, y);
					y += 40;
					ctx.fillText(this.$t('本报告仅供参考不作为医疗诊断依据'), 40, y);

					// 生成图片
					ctx.draw(false, () => {
						setTimeout(() => {
							uni.canvasToTempFilePath({
								canvasId: 'shareCanvas',
								x: 0,
								y: 0,
								width: width,
								height: totalHeight,
								destWidth: width * 2,
								destHeight: totalHeight * 2,
								fileType: 'png',
								quality: 1,
								success: (res) => {
									this.pdfImagePath = res.tempFilePath;
									resolve(res.tempFilePath);
								},
								fail: (err) => {
									console.error('Canvas转图片失败:', err);
									reject(err);
								}
							}, this);
						}, 800);
					});
				});
			},

			calculateCanvasHeight() {
				let height = 200;
				height += 200;

				if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
					height += 100;
					if (this.userInfo.height) height += 50;
					if (this.userInfo.weight) height += 50;
					if (this.userInfo.waist) height += 50;
					if (this.request.bmi && this.request.bmi !== 'NA') height += 50;
					if (this.request.whtr && this.request.whtr !== 'NA') height += 50;
					height += 20;
				}

				if (this.userInfo.takingMedicine) {
					height += 100;
					if (this.userInfo.takingMedicine === true) {
						if (this.userInfo.medicineType) height += 50;
						if (this.userInfo.medicineTime) height += 50;
						if (this.userInfo.diagnosisDate) height += 50;
					}
					height += 20;
				}

				// 睡眠数据
				height += 130;

				height += 350;
				height += 70 + 160 + 40;
				const dataCount = this.monitorData.length;
				if (dataCount > 0) {
					height += 150 + (dataCount * 45);
				}
				height += 150;

				return height;
			},

			onImageLoad(e) {
				this.imageHeight = e.detail.height;
				if (e.detail.height < 500) {
					uni.showToast({
						title: this.$t('图片生成可能不完整，请重试'),
						icon: 'none'
					});
				}
			},
			onImageError(e) {
				console.error('图片加载失败', e);
				uni.showToast({
					title: this.$t('图片加载失败'),
					icon: 'none'
				});
			},
			onScroll(e) {},
			closePDFPreview() {
				this.scrollTop = 0;
				this.showPDFPreview = false;
			},

			// 保存PDF到本地
			savePDF() {
				// #ifdef H5
				if (this.pdfBlob) {
					const link = document.createElement('a');
					link.href = URL.createObjectURL(this.pdfBlob);
					link.download = `${this.$t('血压报告')}_${new Date().getTime()}.pdf`;
					link.click();
					uni.showToast({
						title: this.$t('开始下载')
					});
				} else if (this.pdfBase64) {
					const link = document.createElement('a');
					link.href = this.pdfBase64;
					link.download = `${this.$t('血压报告')}_${new Date().getTime()}.pdf`;
					link.click();
					uni.showToast({
						title: this.$t('开始下载')
					});
				}
				// #endif

				// #ifdef APP-PLUS
				if (this.pdfBase64) {
					uni.showLoading({
						title: this.$t('保存中...'),
						mask: true
					});
					const bitmap = new plus.nativeObj.Bitmap('save_img');
					bitmap.loadBase64Data(this.pdfBase64, () => {
						const fileName = `${this.$t('血压报告')}_${new Date().getTime()}.png`;
						const filePath = `_doc/${fileName}`;
						bitmap.save(filePath, {
							overwrite: true
						}, (e) => {
							bitmap.clear();
							plus.gallery.save(e.target, () => {
								uni.hideLoading();
								uni.showToast({
									title: this.$t('已保存到相册')
								});
							}, (e) => {
								uni.hideLoading();
								uni.showToast({
									title: this.$t('保存到相册失败'),
									icon: 'none'
								});
							});
						}, (e) => {
							uni.hideLoading();
							bitmap.clear();
							uni.showToast({
								title: this.$t('保存失败'),
								icon: 'none'
							});
						});
					}, (e) => {
						uni.hideLoading();
						uni.showToast({
							title: this.$t('图片处理失败'),
							icon: 'none'
						});
					});
				} else if (this.pdfImagePath) {
					uni.showLoading({
						title: this.$t('保存中...')
					});
					plus.gallery.save(this.pdfImagePath, () => {
						uni.hideLoading();
						uni.showToast({
							title: this.$t('已保存到相册')
						});
					}, (e) => {
						uni.hideLoading();
						uni.showToast({
							title: this.$t('保存失败'),
							icon: 'none'
						});
					});
				}
				// #endif

				// #ifdef MP-WEIXIN || MP-QQ
				if (this.pdfPath) {
					uni.downloadFile({
						url: this.pdfPath,
						success: (res) => {
							if (res.statusCode === 200) {
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: () => uni.showToast({
										title: this.$t('保存成功'),
										icon: 'none'
									}),
									fail: () => uni.showToast({
										title: this.$t('保存失败'),
										icon: 'none'
									})
								});
							}
						}
					});
				} else if (this.pdfImagePath) {
					uni.saveImageToPhotosAlbum({
						filePath: this.pdfImagePath,
						success: () => uni.showToast({
							title: this.$t('图片已保存')
						}),
						fail: () => uni.showToast({
							title: this.$t('保存失败'),
							icon: 'none'
						})
					});
				}
				// #endif
			},

			// 分享PDF
			sharePDF() {
				// #ifdef APP-PLUS
				this.sharePDFApp();
				// #endif
				// #ifdef H5
				uni.showToast({
					title: this.$t('H5端请使用下载功能保存PDF'),
					icon: 'none'
				});
				// #endif
				// #ifdef MP-WEIXIN || MP-QQ
				this.sharePDFMP();
				// #endif
			},

			// App端分享PDF
			sharePDFApp() {
				if (this.pdfBase64) {
					uni.showLoading({
						title: this.$t('准备分享...'),
						mask: true
					});
					const bitmap = new plus.nativeObj.Bitmap('share_img');
					bitmap.loadBase64Data(this.pdfBase64, () => {
						const fileName = `血压报告_${new Date().getTime()}.png`;
						const filePath = `_doc/${fileName}`;

						bitmap.save(filePath, {
							overwrite: true
						}, (e) => {
							bitmap.clear();
							const absolutePath = plus.io.convertLocalFileSystemURL(e.target);
							uni.hideLoading();
							setTimeout(() => {
								uni.shareWithSystem({
									type: 'image',
									imageUrl: absolutePath,
									title: '血压监测报告',
									summary: `${this.userInfo.name}的24小时血压监测报告`,
									success: () => {
										uni.showToast({
											title: '分享成功'
										});
									},
									fail: (err) => {
										console.error('分享失败:', err);
										uni.showToast({
											title: '分享失败',
											icon: 'none'
										});
									}
								});
							}, 100);
						}, (e) => {
							uni.hideLoading();
							bitmap.clear();
							uni.showToast({
								title: '图片处理失败',
								icon: 'none'
							});
						});
					}, (e) => {
						uni.hideLoading();
						uni.showToast({
							title: '图片加载失败',
							icon: 'none'
						});
					});
				} else if (this.pdfImagePath) {
					const absolutePath = this.pdfImagePath.startsWith('_doc/') || this.pdfImagePath.startsWith('_www/') ?
						plus.io.convertLocalFileSystemURL(this.pdfImagePath) :
						this.pdfImagePath;

					uni.shareWithSystem({
						type: 'image',
						imageUrl: absolutePath,
						title: '血压监测报告',
						success: () => uni.showToast({
							title: '分享成功'
						}),
						fail: (err) => {
							console.error('分享失败:', err);
							uni.showToast({
								title: '分享失败',
								icon: 'none'
							});
						}
					});
				} else {
					uni.showToast({
						title: '暂无文件可分享',
						icon: 'none'
					});
				}
			},

			// 微信小程序/QQ分享PDF
			sharePDFMP() {
				if (this.pdfPath) {
					uni.showLoading({
						title: '准备分享...'
					});
					uni.downloadFile({
						url: this.pdfPath,
						success: (res) => {
							if (res.statusCode === 200) {
								const tempFilePath = res.tempFilePath;
								// #ifdef MP-WEIXIN
								wx.shareFileMessage({
									filePath: tempFilePath,
									fileName: `${this.userInfo.name}的血压报告.pdf`,
									success: () => {
										uni.hideLoading();
										uni.showToast({
											title: '分享成功'
										});
									},
									fail: (err) => {
										uni.hideLoading();
										console.error('分享失败:', err);
										uni.openDocument({
											filePath: tempFilePath,
											fileType: 'pdf',
											showMenu: true,
											success: () => {
												uni.showToast({
													title: '请点击右上角分享',
													icon: 'none'
												});
											}
										});
									}
								});
								// #endif
								// #ifdef MP-QQ
								uni.shareFileMessage({
									filePath: tempFilePath,
									fileName: `${this.userInfo.name}的血压报告.pdf`,
									success: () => {
										uni.hideLoading();
										uni.showToast({
											title: '分享成功'
										});
									},
									fail: () => {
										uni.hideLoading();
										uni.showToast({
											title: '分享失败',
											icon: 'none'
										});
									}
								});
								// #endif
							}
						},
						fail: () => {
							uni.hideLoading();
							uni.showToast({
								title: '文件下载失败',
								icon: 'none'
							});
						}
					});
				} else if (this.pdfImagePath) {
					uni.shareAppMessage({
						title: '血压监测报告',
						imageUrl: this.pdfImagePath,
						path: '/pages/report/report'
					});
				} else {
					uni.showToast({
						title: '暂无文件可分享',
						icon: 'none'
					});
				}
			},

			// ==================== 打印功能 ====================
			// 打开打印预览
			printPDF() {
				this.closeSharePopup();
				// 准备打印数据（显示全部）
				this.printDataList = this.monitorData;
				this.showPrintPreview = true;
			},

			closePrintPreview() {
				this.showPrintPreview = false;
			},

			// 执行打印
			executePrint() {
				// #ifdef H5
				this.printH5();
				// #endif
				// #ifdef APP-PLUS
				this.printApp();
				// #endif
				// #ifdef MP-WEIXIN || MP-QQ
				uni.showToast({
					title: '小程序请使用导出PDF功能',
					icon: 'none'
				});
				// #endif
			},

			// H5端打印实现
			printH5() {
				const printStyles = `
										<style>
											@media print {
												body * {
													visibility: hidden;
												}
												#printable-area, #printable-area * {
													visibility: visible;
												}
												#printable-area {
													position: absolute;
													left: 0;
													top: 0;
													width: 100%;
												}
											}
											
											.print-page {
												font-family: 'SimSun', 'Microsoft YaHei', sans-serif;
												padding: 20px;
												background: white;
											}
											
											.print-header-section {
												text-align: center;
												border-bottom: 2px solid #667eea;
												padding-bottom: 15px;
												margin-bottom: 20px;
											}
											
											.print-main-title {
												font-size: 24px;
												font-weight: bold;
												color: #333;
												display: block;
												margin-bottom: 10px;
											}
											
											.print-subtitle, .print-time {
												font-size: 12px;
												color: #666;
												display: block;
												margin: 5px 0;
											}
											
											.print-section {
												margin-bottom: 20px;
											}
											
											.print-section-title {
												font-size: 16px;
												font-weight: bold;
												color: #667eea;
												border-left: 4px solid #667eea;
												padding-left: 10px;
												margin-bottom: 10px;
											}
											
											.print-info-grid {
												display: grid;
												grid-template-columns: repeat(2, 1fr);
												gap: 10px;
												margin-bottom: 15px;
											}
											
											.print-info-item {
												border: 1px solid #e0e0e0;
												padding: 12px;
												border-radius: 5px;
												text-align: center;
												background: #fafafa;
											}
											
											.print-info-label {
												font-size: 12px;
												color: #666;
												display: block;
												margin-bottom: 5px;
											}
											
											.print-info-value {
												font-size: 16px;
												font-weight: bold;
												color: #333;
												display: block;
											}
											
											.print-info-value.normal { color: #2ecc71; }
											.print-info-value.overweight { color: #f39c12; }
											.print-info-value.obese { color: #e74c3c; }
											.print-info-value.underweight { color: #3498db; }
											
											.print-medicine-grid {
												display: grid;
												grid-template-columns: repeat(2, 1fr);
												gap: 10px;
												margin-bottom: 15px;
											}
											
											.print-medicine-item {
												border: 1px solid #ffd8b2;
												padding: 12px;
												border-radius: 5px;
												text-align: center;
												background: #fff8f0;
											}
											
											.print-medicine-item.wide {
												grid-column: span 2;
											}
											
											.print-medicine-label {
												font-size: 12px;
												color: #666;
												display: block;
												margin-bottom: 5px;
											}
											
											.print-medicine-value {
												font-size: 16px;
												font-weight: bold;
												color: #e67e22;
												display: block;
											}
											
											.print-stats-grid {
												display: grid;
												grid-template-columns: repeat(2, 1fr);
												gap: 15px;
											}
											
											.print-stat-box {
												border: 1px solid #e0e0e0;
												padding: 15px;
												border-radius: 5px;
												text-align: center;
												min-height: 80px;
												display: flex;
												flex-direction: column;
												justify-content: center;
											}
											
											.print-stat-label {
												font-size: 13px;
												color: #666;
												display: block;
												margin-bottom: 8px;
											}
											
											.print-stat-value {
												font-size: 18px;
												font-weight: bold;
												color: #333;
												display: block;
												margin-top: 5px;
											}
											
											.print-extreme-grid {
												display: grid;
												grid-template-columns: repeat(2, 1fr);
												gap: 20px;
											}
											
											.print-extreme-grid.large {
												gap: 20px;
											}
											
											.print-extreme-box {
												border: 2px solid #e0e0e0;
												padding: 20px;
												border-radius: 8px;
												text-align: center;
												min-height: 120px;
												display: flex;
												flex-direction: column;
												justify-content: center;
												align-items: center;
											}
											
											.print-extreme-box.high {
												border-color: #e74c3c;
												background: #fff5f5;
											}
											
											.print-extreme-box.low {
												border-color: #3498db;
												background: #f0f9ff;
											}
											
											.print-extreme-label {
												font-size: 14px;
												color: #666;
												display: block;
												margin-bottom: 10px;
												font-weight: bold;
											}
											
											.print-extreme-value {
												font-size: 28px;
												font-weight: bold;
												display: block;
												margin: 8px 0;
											}
											
											.print-extreme-value.large {
												font-size: 32px;
											}
											
											.print-extreme-box.high .print-extreme-value {
												color: #e74c3c;
											}
											
											.print-extreme-box.low .print-extreme-value {
												color: #3498db;
											}
											
											.print-extreme-unit {
												font-size: 12px;
												color: #999;
												display: block;
												margin-bottom: 5px;
											}
											
											.print-extreme-time {
												font-size: 12px;
												color: #999;
												display: block;
												margin-top: 5px;
											}
											
											.print-setting-grid {
												display: grid;
												grid-template-columns: repeat(2, 1fr);
												gap: 10px;
											}
											
											.print-setting-item {
												border: 1px solid #e0e0e0;
												padding: 10px;
												border-radius: 5px;
												text-align: center;
												background: #f8fff8;
												border-color: #c8e6c9;
											}
											
											.print-setting-label {
												font-size: 12px;
												color: #666;
												display: block;
												margin-bottom: 5px;
											}
											
											.print-setting-value {
												font-size: 14px;
												font-weight: bold;
												color: #2ecc71;
												display: block;
											}
											
											.print-table {
												width: 100%;
												border-collapse: collapse;
												font-size: 11px;
											}
											
											.print-table-header, .print-table-row {
												display: grid;
												grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
												border-bottom: 1px solid #e0e0e0;
											}
											
											.print-table-header {
												background: #f5f5f5;
												font-weight: bold;
											}
											
											.print-th, .print-td {
												padding: 8px 5px;
												text-align: center;
											}
											
											.print-td.status-high { color: #e74c3c; }
											.print-td.status-low { color: #3498db; }
											.print-td.status-warning { color: #f39c12; }
											.print-td.status-normal { color: #2ecc71; }
											.print-td.status-heartrate { color: #9c27b0; }
											
											.print-footer-section {
												margin-top: 30px;
												padding-top: 15px;
												border-top: 1px solid #e0e0e0;
												text-align: center;
												font-size: 10px;
												color: #999;
											}
											
											.print-footer-section text {
												display: block;
												margin: 3px 0;
											}
										</style>
									`;

				const styleElement = document.createElement('div');
				styleElement.innerHTML = printStyles;
				document.head.appendChild(styleElement);

				setTimeout(() => {
					window.print();
				}, 100);
			},

			// App端打印实现
			printApp() {
				uni.showLoading({
					title: this.$t("准备分享"),
					mask: true
				});
				this.drawPrintCanvas().then(imagePath => {
					uni.hideLoading();
					const bitmap = new plus.nativeObj.Bitmap('print_img');
					if (imagePath.startsWith('data:')) {
						bitmap.loadBase64Data(imagePath, () => {
							this.doAppPrint(bitmap);
						}, (e) => {
							console.error('加载图片失败:', e);
							uni.showToast({
								title: '打印准备失败',
								icon: 'none'
							});
						});
					} else {
						bitmap.load(imagePath, () => {
							this.doAppPrint(bitmap);
						}, (e) => {
							console.error('加载图片失败:', e);
							uni.showToast({
								title: '打印准备失败',
								icon: 'none'
							});
						});
					}
				}).catch(err => {
					uni.hideLoading();
					console.error('生成打印图片失败:', err);
					uni.showToast({
						title: '打印准备失败',
						icon: 'none'
					});
				});
			},

			// 执行App端打印
			doAppPrint(bitmap) {
				// 使用JPEG格式
				const tempPath = `_doc/${this.$t('小时监测报告24')}${this.dundatetime()}.jpg`;

				bitmap.save(tempPath, {
					overwrite: true,
					quality: 90,
					format: 'jpg'
				}, async (e) => {
					const absolutePath = plus.io.convertLocalFileSystemURL(e.target);
					console.log('图片保存路径:', absolutePath);

					// 验证图片文件是否存在且有效
					plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
						entry.file((file) => {
							console.log('图片文件大小:', file.size, 'bytes');
							if (file.size === 0) {
								console.error('图片文件为空');
								uni.showToast({
									title: '图片保存失败',
									icon: 'none'
								});
								return;
							}
						});
					});

					try {
						const {
							imageToPdfAndSave
						} = await import('@/pages/api/unitls/imageToPdf.js');
						const pdfPath = await imageToPdfAndSave(absolutePath,
							`${this.$t('小时监测报告24')}${this.dundatetime()}.pdf`);
						console.log("PDF保存路径:", pdfPath);

						// 验证PDF文件
						plus.io.resolveLocalFileSystemURL(pdfPath, (entry) => {
							entry.file((file) => {
								console.log('PDF文件大小:', file.size, 'bytes');
								if (file.size < 1000) {
									console.error('PDF文件过小，可能损坏');
									uni.showToast({
										title: 'PDF生成异常',
										icon: 'none'
									});
									return;
								}

								// 打开文档
								uni.openDocument({
									filePath: pdfPath,
									showMenu: true,
									success: (success) => {
										console.log('打开文档成功:', success);
									},
									fail: (err) => {
										console.error('打开文档失败:', err);
									}
								});
							});
						});

						// 清理临时图片
						plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
							entry.remove(() => console.log('临时图片已清理'));
						});

					} catch (err) {
						console.error('PDF生成失败:', err);
					}

					bitmap.clear();
				});
			},

			// 绘制打印Canvas
			drawPrintCanvas() {
				return new Promise((resolve, reject) => {
					const ctx = uni.createCanvasContext('shareCanvas', this);
					const width = 600;
					let contentHeight = this.calculatePrintHeight();
					const height = Math.max(contentHeight, 800);

					let y = 30;

					ctx.setFillStyle('#ffffff');
					ctx.fillRect(0, 0, width, height);

					// 标题
					ctx.setFillStyle('#333333');
					ctx.setFontSize(24);
					ctx.setTextAlign('center');
					ctx.fillText(this.$t('小时监测报告24'), width / 2, y);
					y += 35;

					// 副标题
					ctx.setFontSize(12);
					ctx.fillText(
						`${this.$t('姓名')}：${this.userInfo.name} | ${this.$t('性别')}：${this.getsex(this.userInfo.gender)} | ${this.$t('年龄')}：${this.userInfo.age}${this.$t('岁')}`,
						width / 2, y);
					y += 20;

					ctx.setFontSize(10);
					ctx.setFillStyle('#666666');
					ctx.fillText(
						`${this.$t('监测时间')}：${this.monitorInfo.startTime} ${this.$t('至')} ${this.monitorInfo.endTime}`,
						width / 2, y);
					y += 30;

					// 分隔线
					ctx.beginPath();
					ctx.setStrokeStyle('#667eea');
					ctx.setLineWidth(2);
					ctx.moveTo(40, y);
					ctx.lineTo(width - 40, y);
					ctx.stroke();
					y += 25;

					// 身体指标
					if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
						ctx.setFillStyle('#9b59b6');
						ctx.setFontSize(14);
						ctx.setTextAlign('left');
						ctx.fillText(`【${this.$t('身体指标')}】`, 40, y);
						y += 25;
						ctx.setFillStyle('#333333');
						ctx.setFontSize(11);

						let infoX = 40;
						let infoCount = 0;
						const infoItems = [];
						if (this.userInfo.height) infoItems.push(
							`${this.$t('身高')}：${this.formatBodyHeight(this.userInfo.height)}`);
						if (this.userInfo.weight) infoItems.push(
							`${this.$t('体重')}：${this.formatBodyWeight(this.userInfo.weight)}`);
						if (this.userInfo.waist) infoItems.push(
							`${this.$t('腰围')}：${this.formatBodyHeight(this.userInfo.waist)}`);
						if (this.request.bmi && this.request.bmi !== 'NA') infoItems.push(
							`BMI：${this.request.bmi}`);

						infoItems.forEach((item, index) => {
							if (index % 2 === 0 && index > 0) {
								y += 25;
								infoX = 40;
							}
							ctx.fillText(item, infoX, y);
							infoX += 180;
						});
						y += 30;
					}

					// 用药信息
					if (this.userInfo.takingMedicine) {
						ctx.setFillStyle('#e67e22');
						ctx.setFontSize(14);
						ctx.fillText(`【${this.$t('用药信息')}】`, 40, y);
						y += 25;
						ctx.setFillStyle('#333333');
						ctx.setFontSize(11);
						ctx.fillText(
							`${this.$t('服用高血压药物')}：${this.userInfo.takingMedicine === true ? this.$t('是') : this.$t('否')}`,
							40, y);
						y += 20;

						if (this.userInfo.takingMedicine === true) {
							if (this.userInfo.medicineType) {
								ctx.fillText(`${this.$t('服药种类')}：${this.userInfo.medicineType}`, 40, y);
								y += 20;
							}
							if (this.userInfo.medicineTime) {
								ctx.fillText(`${this.$t('服药时间')}：${this.userInfo.medicineTime}`, 40, y);
								y += 20;
							}
							if (this.userInfo.diagnosisDate) {
								ctx.fillText(`${this.$t('确诊时间')}：${this.userInfo.diagnosisDate}`, 40, y);
								y += 20;
							}
						}
						y += 15;
					}

					// 睡眠数据
					ctx.setFillStyle('#3498db');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t('睡眠数据')}】`, 40, y);
					y += 25;
					ctx.setFillStyle('#333333');
					ctx.setFontSize(11);
					if (this.hasSleepData) {
						ctx.fillText(`${this.$t('睡眠时间')}：${this.userInfo.sleepTime}`, 40, y);
					} else {
						ctx.fillText(this.$t('此用户未佩戴手表测量睡眠数据'), 40, y);
					}
					y += 30;

					// 统计概览标题
					ctx.setFillStyle('#667eea');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t('统计概览')}】`, 40, y);
					y += 25;

					// 统计数据网格
					ctx.setFillStyle('#333333');
					ctx.setFontSize(11);

					const stats = [{
							label: this.$t('小时平均血压24'),
							value: `${this.stats.avg24h.systolic}/${this.stats.avg24h.diastolic} mmHg`
						},
						{
							label: this.$t('白天平均'),
							value: `${this.stats.dayAvg.systolic}/${this.stats.dayAvg.diastolic} mmHg`
						},
						{
							label: this.$t('夜间平均'),
							value: `${this.stats.nightAvg.systolic}/${this.stats.nightAvg.diastolic} mmHg`
						},
						{
							label: this.$t('总测量次数'),
							value: `${this.stats.totalCount} ${this.$t('次')}`
						},
						{
							label: this.$t('白天测量'),
							value: `${this.dayCount} ${this.$t('次')} (${this.dayRatio}%)`
						},
						{
							label: this.$t('夜间测量'),
							value: `${this.nightCount} ${this.$t('次')} (${this.nightRatio}%)`
						}
					];

					const colWidth = (width - 80) / 2;
					const rowHeight = 45;

					stats.forEach((stat, index) => {
						const col = index % 2;
						const row = Math.floor(index / 2);
						const x = 40 + col * colWidth;
						const sy = y + row * rowHeight;

						ctx.setStrokeStyle('#e0e0e0');
						ctx.setLineWidth(1);
						ctx.strokeRect(x, sy - 15, colWidth - 10, rowHeight);

						ctx.setFillStyle('#666666');
						ctx.setFontSize(9);
						ctx.fillText(stat.label, x + 5, sy - 2);

						ctx.setFillStyle('#333333');
						ctx.setFontSize(13);
						ctx.fillText(stat.value, x + 5, sy + 18);
					});

					y += Math.ceil(stats.length / 2) * rowHeight + 20;

					// 极值记录
					ctx.setFillStyle('#e74c3c');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t('极值记录')}】`, 40, y);
					y += 30;

					const extremeBoxHeight = 80;
					const extremeBoxWidth = (width - 90) / 2;

					// 最高血压
					ctx.setStrokeStyle('#ffcdd2');
					ctx.setLineWidth(2);
					ctx.setFillStyle('#fff5f5');
					ctx.fillRect(40, y - 20, extremeBoxWidth, extremeBoxHeight);
					ctx.strokeRect(40, y - 20, extremeBoxWidth, extremeBoxHeight);

					ctx.setFillStyle('#e74c3c');
					ctx.setFontSize(12);
					ctx.fillText(this.$t('最高血压'), 50, y);
					ctx.setFontSize(20);
					ctx.fillText(`${this.stats.max.systolic}/${this.stats.max.diastolic}`, 50, y + 30);
					ctx.setFontSize(10);
					ctx.fillText(this.stats.max.time || '-', 50, y + 50);

					// 最低血压
					const rightX = 50 + extremeBoxWidth;
					ctx.setStrokeStyle('#b3e0ff');
					ctx.setFillStyle('#f0f9ff');
					ctx.fillRect(rightX, y - 20, extremeBoxWidth, extremeBoxHeight);
					ctx.strokeRect(rightX, y - 20, extremeBoxWidth, extremeBoxHeight);

					ctx.setFillStyle('#3498db');
					ctx.setFontSize(12);
					ctx.fillText(this.$t('最低血压'), rightX + 10, y);
					ctx.setFontSize(20);
					ctx.fillText(`${this.stats.min.systolic}/${this.stats.min.diastolic}`, rightX + 10, y + 30);
					ctx.setFontSize(10);
					ctx.fillText(this.stats.min.time || '-', rightX + 10, y + 50);

					y += extremeBoxHeight + 30;

					// 监测设置
					ctx.setFillStyle('#2ecc71');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t('监测设置')}】`, 40, y);
					y += 25;

					const settings = [{
							label: this.$t('白天监测时段'),
							value: '06:00 - 21:30'
						},
						{
							label: this.$t('白天监测间隔'),
							value: '30' + this.$t("分钟次")
						},
						{
							label: this.$t('夜间监测时段'),
							value: '21:30 - 06:00'
						},
						{
							label: this.$t('夜间监测间隔'),
							value: '60' + this.$t("分钟次")
						}
					];

					settings.forEach((setting, index) => {
						const col = index % 2;
						const row = Math.floor(index / 2);
						const x = 40 + col * colWidth;
						const sy = y + row * rowHeight;

						ctx.setStrokeStyle('#c8e6c9');
						ctx.setFillStyle('#f8fff8');
						ctx.fillRect(x, sy - 15, colWidth - 10, rowHeight);
						ctx.strokeRect(x, sy - 15, colWidth - 10, rowHeight);

						ctx.setFillStyle('#666666');
						ctx.setFontSize(9);
						ctx.fillText(setting.label, x + 5, sy - 2);

						ctx.setFillStyle('#2ecc71');
						ctx.setFontSize(12);
						ctx.fillText(setting.value, x + 5, sy + 18);
					});

					y += Math.ceil(settings.length / 2) * rowHeight + 20;

					// 详细数据
					if (this.monitorData.length > 0) {
						ctx.setFillStyle('#f39c12');
						ctx.setFontSize(14);
						ctx.fillText(
							`【${this.$t('详细监测数据')}】（${this.$t('共')}${this.monitorData.length}${this.$t('条')}）`,
							40, y);
						y += 20;

						// 表格头部
						ctx.setFillStyle('#f5f5f5');
						ctx.fillRect(40, y - 10, width - 80, 20);
						ctx.strokeRect(40, y - 10, width - 80, 20);

						ctx.setFillStyle('#333333');
						ctx.setFontSize(9);
						const detailHeaders = [this.$t('时间'), this.$t('时段'), this.$t('血压值'), this.$t('状态')];
						const detailColWidths = [100, 60, 120, 100];
						let detailX = 45;

						detailHeaders.forEach((header, i) => {
							ctx.fillText(header, detailX, y + 3);
							detailX += detailColWidths[i];
						});

						y += 20;

						// 表格内容
						this.monitorData.forEach((item, index) => {
							const rowY = y + index * 18;

							if (index % 2 === 1) {
								ctx.setFillStyle('#fafafa');
								ctx.fillRect(40, rowY - 8, width - 80, 18);
							}

							ctx.strokeRect(40, rowY - 8, width - 80, 18);

							const statusColors = {
								'high': '#e74c3c',
								'low': '#3498db',
								'warning': '#f39c12',
								'normal': '#2ecc71',
								'heartrate': '#9c27b0'
							};

							ctx.setFillStyle(statusColors[item.status] || '#333333');
							ctx.setFontSize(9);

							let cellX = 45;
							const cells = [
								item.time.split(' ')[1] || item.time,
								item.periodText,
								this.formatRecordValue(item),
								item.statusText
							];

							cells.forEach((cell, i) => {
								ctx.fillText(cell, cellX, rowY + 3);
								cellX += detailColWidths[i];
							});
						});

						y += this.monitorData.length * 18 + 20;
					}

					// 底部信息
					ctx.setFillStyle('#999999');
					ctx.setFontSize(9);
					ctx.setTextAlign('center');
					ctx.fillText(`${this.$t('报告生成时间')}：${this.currentDateTime}`, width / 2, y);
					y += 15;
					ctx.fillText(this.$t('本报告仅供参考不作为医疗诊断依据'), width / 2, y);

					// 生成图片
					ctx.draw(false, () => {
						setTimeout(() => {
							uni.canvasToTempFilePath({
								canvasId: 'shareCanvas',
								x: 0,
								y: 0,
								width: width,
								height: height,
								destWidth: width * 2,
								destHeight: height * 2,
								fileType: 'png',
								quality: 1,
								success: (res) => {
									resolve(res.tempFilePath);
								},
								fail: (err) => {
									console.error('打印Canvas生成失败:', err);
									reject(err);
								}
							}, this);
						}, 800);
					});
				});
			},

			calculatePrintHeight() {
				let height = 200;

				if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
					height += 60;
					let infoCount = 0;
					if (this.userInfo.height) infoCount++;
					if (this.userInfo.weight) infoCount++;
					if (this.userInfo.waist) infoCount++;
					if (this.request.bmi && this.request.bmi !== 'NA') infoCount++;
					height += Math.ceil(infoCount / 2) * 25 + 30;
				}

				if (this.userInfo.takingMedicine) {
					height += 60;
					if (this.userInfo.takingMedicine === true) {
						if (this.userInfo.medicineType) height += 20;
						if (this.userInfo.medicineTime) height += 20;
						if (this.userInfo.diagnosisDate) height += 20;
					}
					height += 15;
				}

				// 睡眠数据
				height += 55;

				height += 30 + (3 * 45);
				height += 30 + 80 + 30;
				height += 30 + (2 * 45) + 20;

				const detailCount = this.monitorData.length;
				if (detailCount > 0) {
					height += 70 + (detailCount * 18);
				}

				height += 100;

				return height;
			},

			// PDF预览中的打印按钮
			doPrint() {
				this.closePDFPreview();
				setTimeout(() => {
					this.printPDF();
				}, 300);
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding-bottom: 40rpx;
	}

	/* 头部样式 */
	.header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 40rpx 30rpx;
		color: #fff;

		.title {
			font-size: 36rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 30rpx;
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
		}

		/* 信息分组 */
		.info-group {
			background: rgba(255, 255, 255, 0.1);
			border-radius: 16rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			backdrop-filter: blur(10rpx);

			.group-title {
				font-size: 26rpx;
				font-weight: bold;
				margin-bottom: 15rpx;
				padding-left: 15rpx;
				border-left: 6rpx solid #fff;
				opacity: 0.9;
			}

			.info-grid {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 15rpx;

				.info-item {
					background: rgba(255, 255, 255, 0.15);
					border-radius: 12rpx;
					padding: 15rpx;
					text-align: center;

					&.wide {
						grid-column: span 3;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 15rpx 25rpx;

						.label {
							margin-bottom: 0;
						}
					}

					.label {
						display: block;
						font-size: 22rpx;
						opacity: 0.8;
						margin-bottom: 8rpx;
					}

					.value {
						display: block;
						font-size: 28rpx;
						font-weight: bold;

						&.sleep-tip {
							font-size: 24rpx;
							font-weight: normal;
							color: #f39c12;
							line-height: 1.5;
						}

						&.normal {
							color: #2ecc71;
						}

						&.overweight {
							color: #f39c12;
						}

						&.obese {
							color: #e74c3c;
						}

						&.underweight {
							color: #3498db;
						}
					}
				}
			}
		}

		/* 监测时间 */
		.monitor-time {
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(0, 0, 0, 0.2);
			border-radius: 30rpx;
			padding: 15rpx 30rpx;
			margin-top: 10rpx;

			.time-icon {
				margin-right: 10rpx;
				font-size: 28rpx;
			}

			text {
				font-size: 24rpx;
				opacity: 0.9;
			}
		}


	}

	/* 统计概览 */
	.stats-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

		.stats-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 25rpx;
			padding-left: 20rpx;
			border-left: 8rpx solid #667eea;
		}

		.stats-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
		}

		.stat-item {
			background: #f8f9fa;
			border-radius: 12rpx;
			padding: 25rpx;
			text-align: center;

			.stat-label {
				display: block;
				font-size: 24rpx;
				color: #666;
				margin-bottom: 10rpx;
			}

			.stat-value {
				display: block;
				font-size: 40rpx;
				font-weight: bold;
				color: #667eea;
			}

			.stat-unit {
				display: block;
				font-size: 22rpx;
				color: #999;
				margin-top: 5rpx;
			}
		}
	}

	/* 比值分析 */
	.ratio-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

		.ratio-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 25rpx;
			padding-left: 20rpx;
			border-left: 8rpx solid #764ba2;
		}

		.ratio-item {
			display: flex;
			align-items: center;
			margin-bottom: 25rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.ratio-label {
				width: 160rpx;
				font-size: 26rpx;
				color: #666;
			}

			.ratio-bar {
				flex: 1;
				height: 20rpx;
				background: #e9ecef;
				border-radius: 10rpx;
				overflow: hidden;
				margin: 0 20rpx;

				.ratio-progress {
					height: 100%;
					background: linear-gradient(90deg, #667eea, #764ba2);
					border-radius: 10rpx;
					transition: width 0.5s ease;

					&.night {
						background: linear-gradient(90deg, #4facfe, #00f2fe);
					}
				}
			}

			.ratio-value {
				width: 80rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				text-align: right;
			}
		}
	}

	/* 极值记录 */
	.extreme-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

		.extreme-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 25rpx;
			padding-left: 20rpx;
			border-left: 8rpx solid #e74c3c;
		}

		.extreme-content {
			display: flex;
			gap: 20rpx;
		}

		.extreme-item {
			flex: 1;
			border-radius: 12rpx;
			padding: 25rpx;

			&.high {
				background: #fff5f5;
				border: 1rpx solid #ffcdd2;
			}

			&.low {
				background: #f0f9ff;
				border: 1rpx solid #b3e0ff;
			}

			.extreme-label {
				display: flex;
				align-items: center;
				margin-bottom: 15rpx;

				.label-icon {
					font-size: 36rpx;
					margin-right: 10rpx;

					.high & {
						color: #e74c3c;
					}

					.low & {
						color: #3498db;
					}
				}

				text:last-child {
					font-size: 26rpx;
					color: #666;
				}
			}

			.extreme-value {
				.bp-value {
					display: block;
					font-size: 44rpx;
					font-weight: bold;

					.high & {
						color: #e74c3c;
					}

					.low & {
						color: #3498db;
					}
				}

				.bp-time {
					display: block;
					font-size: 22rpx;
					color: #999;
					margin-top: 8rpx;
				}
			}
		}
	}

	/* 监测设置 */
	.setting-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

		.setting-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 25rpx;
			padding-left: 20rpx;
			border-left: 8rpx solid #2ecc71;
		}

		.setting-content {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
		}

		.setting-item {
			background: #f8f9fa;
			border-radius: 10rpx;
			padding: 20rpx;

			.setting-label {
				display: block;
				font-size: 24rpx;
				color: #666;
				margin-bottom: 8rpx;
			}

			.setting-value {
				display: block;
				font-size: 28rpx;
				font-weight: bold;
				color: #2ecc71;
			}
		}
	}

	/* 详细数据 */
	.detail-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

		.detail-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 25rpx;

			.detail-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				padding-left: 20rpx;
				border-left: 8rpx solid #f39c12;
			}

			.filter-tabs {
				display: flex;
				background: #f0f0f0;
				border-radius: 8rpx;
				padding: 4rpx;

				.tab {
					padding: 10rpx 20rpx;
					font-size: 24rpx;
					color: #666;
					border-radius: 6rpx;
					white-space: nowrap;

					&.active {
						background: #fff;
						color: #f39c12;
						font-weight: bold;
						box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
					}
				}
			}
		}

		.detail-list {
			.date-group {
				margin-bottom: 30rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.date-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: #f8f9fa;
					padding: 15rpx 20rpx;
					border-radius: 8rpx;
					margin-bottom: 15rpx;

					.date-text {
						font-size: 28rpx;
						font-weight: bold;
						color: #667eea;
					}

					.date-count {
						font-size: 24rpx;
						color: #999;
					}
				}
			}

			.list-header {
				display: flex;
				background: #f8f9fa;
				padding: 20rpx 0;
				border-radius: 8rpx;
				margin-bottom: 10rpx;

				.header-item {
					flex: 1;
					text-align: center;
					font-size: 24rpx;
					font-weight: bold;
					color: #666;

					&.time {
						flex: 2;
					}

					&.type {
						flex: 1;
					}

					&.value {
						flex: 1.5;
					}

					&.status {
						flex: 1;
					}
				}
			}

			.list-body {
				.data-row {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #f0f0f0;

					&:last-child {
						border-bottom: none;
					}

					&.night-row {
						background: #f8fbff;
					}

					.row-item {
						flex: 1;
						text-align: center;
						font-size: 24rpx;
						color: #333;

						&.time {
							flex: 2;
						}

						&.type {
							flex: 1;
						}

						&.value {
							flex: 1.5;
							font-weight: bold;
						}

						&.status {
							flex: 1;
						}

						.period-tag {
							display: inline-block;
							padding: 4rpx 12rpx;
							border-radius: 6rpx;
							font-size: 22rpx;

							&.day {
								background: #fff3e0;
								color: #f39c12;
							}

							&.night {
								background: #e3f2fd;
								color: #2196f3;
							}
						}

						.status-tag {
							display: inline-block;
							padding: 4rpx 12rpx;
							border-radius: 6rpx;
							font-size: 22rpx;

							&.normal {
								background: #e8f5e9;
								color: #4caf50;
							}

							&.warning {
								background: #fff3e0;
								color: #ff9800;
							}

							&.high {
								background: #ffebee;
								color: #f44336;
							}

							&.low {
								background: #e3f2fd;
								color: #2196f3;
							}

							&.heartrate {
								background: #f3e5f5;
								color: #9c27b0;
							}
						}
					}
				}
			}

			.empty-tip {
				text-align: center;
				padding: 40rpx 0;
				color: #999;
				font-size: 28rpx;
			}
		}
	}

	/* 底部按钮 */
	.footer-btns {
		display: flex;
		gap: 20rpx;
		padding: 30rpx;
		margin-top: 20rpx;

		.btn {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			font-size: 30rpx;
			border: none;

			&.print {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: #fff;
			}

			&.back {
				background: red;
				color: #f0f0f0;
			}

			&:active {
				opacity: 0.8;
			}
		}
	}

	/* 分享弹窗 */
	.share-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1000;
		display: flex;
		align-items: flex-end;

		.share-content {
			width: 100%;
			background: #fff;
			border-radius: 30rpx 30rpx 0 0;
			padding: 40rpx 30rpx;

			.share-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				text-align: center;
				margin-bottom: 40rpx;
			}

			.share-options {
				display: flex;
				justify-content: space-around;
				margin-bottom: 40rpx;

				.share-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 20rpx;

					&:active {
						opacity: 0.7;
					}

					.share-icon {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 60rpx;
						margin-bottom: 16rpx;

						&.pdf {
							background: #ffebee;
							color: #e74c3c;
						}

						&.print {
							background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
							color: #fff;
						}
					}

					.share-text {
						font-size: 26rpx;
						color: #666;
					}
				}
			}

			.share-cancel {
				text-align: center;
				padding: 30rpx;
				font-size: 30rpx;
				color: #999;
				border-top: 1rpx solid #f0f0f0;

				&:active {
					background: #f5f5f5;
				}
			}
		}
	}

	/* PDF预览弹窗 */
	.pdf-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.85);
		z-index: 1002;
		display: flex;
		align-items: center;
		justify-content: center;

		.pdf-content {
			width: 90%;
			height: 85%;
			background: #fff;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			overflow: hidden;

			.pdf-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				border-bottom: 1rpx solid #f0f0f0;
				background: #fafafa;
				flex-shrink: 0;

				.pdf-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}

				.pdf-close {
					font-size: 40rpx;
					color: #999;
					padding: 10rpx;

					&:active {
						color: #666;
					}
				}
			}

			.pdf-body {
				flex: 1;
				height: 0;
				overflow: hidden;
				background: #f5f5f5;

				.pdf-image-wrapper {
					width: 100%;
					min-height: 100%;
					padding: 20rpx;
					box-sizing: border-box;

					.pdf-image {
						padding-top: 20px;
						width: 100%;
						display: block;
						border-radius: 10rpx;
						box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
						background: #fff;
					}
				}

				.pdf-loading {
					text-align: center;
					padding: 200rpx 0;
					color: #999;
					font-size: 28rpx;
				}

				.pdf-bottom-space {
					height: 40rpx;
				}
			}

			.pdf-footer {
				display: flex;
				gap: 15rpx;
				padding: 30rpx;
				border-top: 1rpx solid #f0f0f0;
				background: #fafafa;
				flex-shrink: 0;

				.pdf-btn {
					flex: 1;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 40rpx;
					font-size: 28rpx;
					border: none;
					text-align: center;

					&.save {
						background: #667eea;
						color: #f0f0f0;
					}

					&.print {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						color: #fff;
					}

					&.share {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						color: #fff;
					}

					&:active {
						opacity: 0.8;
					}
				}
			}
		}
	}

	/* 打印预览弹窗样式 */
	.print-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.85);
		z-index: 1003;
		display: flex;
		align-items: center;
		justify-content: center;

		.print-content {
			width: 92%;
			height: 90%;
			background: #fff;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			overflow: hidden;

			.print-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				border-bottom: 1rpx solid #f0f0f0;
				background: #fafafa;
				flex-shrink: 0;

				.print-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
				}

				.print-close {
					font-size: 40rpx;
					color: #999;
					padding: 10rpx;

					&:active {
						color: #666;
					}
				}
			}

			.print-body {
				flex: 1;
				height: 0;
				overflow-y: auto;
				background: #f5f5f5;

				.printable-area {
					background: white;
					min-height: 100%;
					padding: 20px;
					box-sizing: border-box;
				}

				.print-page {
					font-family: 'SimSun', 'Microsoft YaHei', sans-serif;
				}

				.print-header-section {
					text-align: center;
					border-bottom: 2px solid #667eea;
					padding-bottom: 15px;
					margin-bottom: 20px;

					.print-main-title {
						font-size: 24px;
						font-weight: bold;
						color: #333;
						display: block;
						margin-bottom: 10px;
					}

					.print-subtitle,
					.print-time {
						font-size: 12px;
						color: #666;
						display: block;
						margin: 5px 0;
					}
				}

				.print-section {
					margin-bottom: 20px;
				}

				.print-section-title {
					font-size: 16px;
					font-weight: bold;
					color: #667eea;
					border-left: 4px solid #667eea;
					padding-left: 10px;
					margin-bottom: 10px;
				}

				.print-info-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 10px;
					margin-bottom: 15px;
				}

				.print-info-item {
					border: 1px solid #e0e0e0;
					padding: 12px;
					border-radius: 5px;
					text-align: center;
					background: #fafafa;
				}

				.print-info-label {
					font-size: 12px;
					color: #666;
					display: block;
					margin-bottom: 5px;
				}

				.print-info-value {
					font-size: 16px;
					font-weight: bold;
					color: #333;
					display: block;

					&.normal {
						color: #2ecc71;
					}

					&.overweight {
						color: #f39c12;
					}

					&.obese {
						color: #e74c3c;
					}

					&.underweight {
						color: #3498db;
					}
				}

				.print-medicine-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 10px;
					margin-bottom: 15px;
				}

				.print-medicine-item {
					border: 1px solid #e0e0e0;
					padding: 12px;
					border-radius: 5px;
					text-align: center;
					background: #fff8f0;
					border-color: #ffd8b2;

					&.wide {
						grid-column: span 2;
					}
				}

				.print-medicine-label {
					font-size: 12px;
					color: #666;
					display: block;
					margin-bottom: 5px;
				}

				.print-medicine-value {
					font-size: 16px;
					font-weight: bold;
					color: #e67e22;
					display: block;
				}

				.print-stats-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 15px;
				}

				.print-stat-box {
					border: 1px solid #e0e0e0;
					padding: 15px;
					border-radius: 5px;
					text-align: center;
					min-height: 80px;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}

				.print-stat-label {
					font-size: 13px;
					color: #666;
					display: block;
					margin-bottom: 8px;
				}

				.print-stat-value {
					font-size: 18px;
					font-weight: bold;
					color: #333;
					display: block;
					margin-top: 5px;
				}

				.print-extreme-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 15px;

					&.large {
						gap: 20px;
					}
				}

				.print-extreme-box {
					border: 2px solid #e0e0e0;
					padding: 20px;
					border-radius: 8px;
					text-align: center;
					min-height: 120px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					&.high {
						border-color: #e74c3c;
						background: #fff5f5;
					}

					&.low {
						border-color: #3498db;
						background: #f0f9ff;
					}

					.print-extreme-label {
						font-size: 14px;
						color: #666;
						display: block;
						margin-bottom: 10px;
						font-weight: bold;
					}

					.print-extreme-value {
						font-size: 28px;
						font-weight: bold;
						display: block;
						margin: 8px 0;

						&.large {
							font-size: 32px;
						}
					}

					&.high .print-extreme-value {
						color: #e74c3c;
					}

					&.low .print-extreme-value {
						color: #3498db;
					}

					.print-extreme-unit {
						font-size: 12px;
						color: #999;
						display: block;
						margin-bottom: 5px;
					}

					.print-extreme-time {
						font-size: 12px;
						color: #999;
						display: block;
						margin-top: 5px;
					}
				}

				.print-setting-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 10px;
				}

				.print-setting-item {
					border: 1px solid #e0e0e0;
					padding: 10px;
					border-radius: 5px;
					text-align: center;
					background: #f8fff8;
					border-color: #c8e6c9;
				}

				.print-setting-label {
					font-size: 12px;
					color: #666;
					display: block;
					margin-bottom: 5px;
				}

				.print-setting-value {
					font-size: 14px;
					font-weight: bold;
					color: #2ecc71;
					display: block;
				}

				.print-table {
					width: 100%;
					border-collapse: collapse;
					font-size: 11px;

					.print-table-header,
					.print-table-row {
						display: grid;
						grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
						border-bottom: 1px solid #e0e0e0;
					}

					.print-table-header {
						background: #f5f5f5;
						font-weight: bold;
					}

					.print-th,
					.print-td {
						padding: 8px 5px;
						text-align: center;
					}

					.print-td {
						&.status-high {
							color: #e74c3c;
						}

						&.status-low {
							color: #3498db;
						}

						&.status-warning {
							color: #f39c12;
						}

						&.status-normal {
							color: #2ecc71;
						}

						&.status-heartrate {
							color: #9c27b0;
						}
					}
				}

				.print-footer-section {
					margin-top: 30px;
					padding-top: 15px;
					border-top: 1px solid #e0e0e0;
					text-align: center;
					font-size: 10px;
					color: #999;

					text {
						display: block;
						margin: 3px 0;
					}
				}

				.print-bottom-space {
					height: 40rpx;
				}
			}

			.print-footer {
				display: flex;
				gap: 20rpx;
				padding: 30rpx;
				border-top: 1rpx solid #f0f0f0;
				background: #fafafa;
				flex-shrink: 0;

				.print-btn {
					flex: 1;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 40rpx;
					font-size: 28rpx;
					border: none;
					text-align: center;

					&.cancel {
						background: red;
						color: white;
					}

					&.confirm {
						background: #3298F7;
						color: white;
					}

					&:active {
						opacity: 0.8;
					}
				}
			}
		}
	}

	/* 隐藏canvas */
	.share-canvas {
		position: fixed;
		left: -9999px;
		top: -9999px;
		width: 750px;
		min-height: 3000px;
		height: auto;
	}
</style>