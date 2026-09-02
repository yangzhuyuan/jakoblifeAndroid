<template>
	<view class="container">
		<!-- 头部信息 -->
		<view class="header">
			<view class="title">{{ $t('天监测报告7') }}</view>
			<!-- 基本信息组 -->
			<view class="info-group">
				<view class="group-title">{{ $t('基本信息') }}</view>
				<view class="info-grid">
					<view class="info-item">
						<text class="label">{{ $t('姓名') }}</text>
						<text class="value">{{ userInfo.name }}</text>
					</view>
					<view class="info-item">
						<text class="label">{{ $t('性别') }}</text>
						<text class="value">{{ getsex(userInfo.gender) }}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('年龄')}}</text>
						<text class="value">{{ userInfo.age }}{{$t('岁')}}</text>
					</view>
				</view>
			</view>

			<!-- 身体指标组 -->
			<view class="info-group">
				<view class="group-title">{{$t('身体指标')}}</view>
				<view class="info-grid">
					<view class="info-item">
						<text class="label">{{$t('身高')}}</text>
						<text class="value">{{ userInfo.height }}{{userInfo.heightunit}}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('体重')}}</text>
						<text class="value">{{ userInfo.weight }}{{userInfo.weightunit}}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('腰围')}}</text>
						<text class="value">{{ userInfo.waist }}{{userInfo.heightunit}}</text>
					</view>
					<view class="info-item">
						<text class="label">BMI</text>
						<text class="value" :class="getBmiClass(request.bmi)">{{ request.bmi }}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('腰围身高比')}}</text>
						<text class="value">{{ request.whtr }}</text>
					</view>
				</view>
			</view>

			<!-- 用药信息组 -->
			<view class="info-group" v-if="userInfo.takingMedicine">
				<view class="group-title">{{$t('用药信息')}}</view>
				<view class="info-grid">
					<view class="info-item wide">
						<text class="label">{{$t('是否服用高血压药物')}}</text>
						<text class="value">{{ userInfo.takingMedicine === true ? $t('是') : $t('否') }}</text>
					</view>
					<view class="info-item" v-if="userInfo.takingMedicine === true">
						<text class="label">{{$t('服药种类')}}</text>
						<text class="value">{{ userInfo.medicineType || '-' }}</text>
					</view>
					<view class="info-item" v-if="userInfo.takingMedicine === true">
						<text class="label">{{$t('每天服药时间')}}</text>
						<text class="value">{{ userInfo.medicineTime || '-' }}</text>
					</view>
					<view class="info-item">
						<text class="label">{{$t('高血压确诊时间')}}</text>
						<text class="value">{{ userInfo.diagnosisDate || '-' }}</text>
					</view>
				</view>
			</view>

			<!-- 睡眠数据组 -->
			<view class="info-group">
				<view class="group-title">{{$t('睡眠数据')}}</view>
				<view class="info-grid">
					<view class="info-item wide" v-if="hasSleepData">
						<text class="label">{{$t('睡眠时间')}}</text>
						<text class="value">{{ userInfo.sleepTime }}</text>
					</view>
					<view class="info-item wide" v-else>
						<text class="value sleep-tip">{{$t('此用户未佩戴手表测量睡眠数据')}}</text>
					</view>
				</view>
			</view>

			<!-- 监测时间 -->
			<view class="monitor-time">
				<text class="time-icon">🕐</text>
				<text>{{ $t('监测时间')}}：{{ monitorInfo.startTime }} {{ $t('至')}} {{ monitorInfo.endTime }}</text>
			</view>
		</view>

		<!-- 统计概览 -->
		<view class="stats-section">
			<view class="stats-title">{{ $t('天监测统计概览7')}}</view>
			<view class="stats-grid">
				<view class="stat-item">
					<text class="stat-label">{{ $t('天平均7')}}</text>
					<text class="stat-value">{{ stats.avg7d.systolic }}/{{ stats.avg7d.diastolic }}</text>
					<text class="stat-unit">mmHg</text>
				</view>
				<view class="stat-item">
					<text class="stat-label">{{ $t('总测量次数')}}</text>
					<text class="stat-value">{{ stats.totalCount }}</text>
					<text class="stat-unit">{{$t('次')}}</text>
				</view>
			</view>
		</view>

		<!-- 7天趋势图表 -->
		<view class="trend-section">
			<view class="trend-title">{{ $t('天血压趋势7')}}</view>
			<view class="trend-content">
				<view class="trend-chart">
					<view class="charts-box">
						<qiun-data-charts :canvas2d="true" type="line" canvas-id="10086" :opts="chartOptions"
							:chartData="chartData" />
					</view>
				</view>
				<view class="trend-summary">
					<view class="trend-item">
						<text class="trend-label">{{ $t('最高日均')}}</text>
						<text
							class="trend-value high">{{ stats.maxDayAvg.systolic }}/{{ stats.maxDayAvg.diastolic }}</text>
						<text class="trend-date" v-if="stats.maxDayAvg.date">{{ stats.maxDayAvg.date }}</text>
					</view>
					<view class="trend-item">
						<text class="trend-label">{{ $t('最低日均')}}</text>
						<text
							class="trend-value low">{{ stats.minDayAvg.systolic }}/{{ stats.minDayAvg.diastolic }}</text>
						<text class="trend-date" v-if="stats.minDayAvg.date">{{ stats.minDayAvg.date }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 详细比值分析 -->
		<view class="ratio-section">
			<view class="ratio-title">{{ $t('昼夜节律分析')}}</view>
			<view class="ratio-content">
				<view class="ratio-item">
					<text class="ratio-label">{{ $t('白天天比值7')}}</text>
					<view class="ratio-bar">
						<view class="ratio-progress" :style="{ width: dayRatio + '%' }"></view>
					</view>
					<text class="ratio-value">{{ dayRatio }}%</text>
				</view>
				<view class="ratio-item">
					<text class="ratio-label">{{ $t('夜间天比值7')}}</text>
					<view class="ratio-bar">
						<view class="ratio-progress night" :style="{ width: nightRatio + '%' }"></view>
					</view>
					<text class="ratio-value">{{ nightRatio }}%</text>
				</view>
			</view>
		</view>

		<!-- 极值记录 -->
		<view class="extreme-section">
			<view class="extreme-title">{{ $t('天血压极值记录7')}}</view>
			<view class="extreme-content">
				<view class="extreme-item high">
					<view class="extreme-label">
						<text class="label-icon">↑</text>
						<text>{{ $t('最高血压')}}</text>
					</view>
					<view class="extreme-value">
						<text class="bp-value">{{ stats.max.systolic }}/{{ stats.max.diastolic }}</text>
						<text class="bp-time" v-if="stats.max.time">{{ stats.max.time }}</text>
					</view>
				</view>
				<view class="extreme-item low">
					<view class="extreme-label">
						<text class="label-icon">↓</text>
						<text>{{ $t('最低血压')}}</text>
					</view>
					<view class="extreme-value">
						<text class="bp-value">{{ stats.min.systolic }}/{{ stats.min.diastolic }}</text>
						<text class="bp-time" v-if="stats.min.time">{{ stats.min.time }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 7天数据分布 -->
		<view class="distribution-section">
			<view class="distribution-title">{{$t('天数据分布7')}}</view>
			<view class="distribution-content">
				<view v-for="(day, index) in dailyStats" :key="index" class="distribution-item">
					<view class="day-header">
						<text class="day-date">{{ day.date }}</text>
						<text class="day-count">{{ day.count }}{{$t('次')}}</text>
					</view>
					<view class="day-stats">
						<text class="day-avg">{{ $t('均')}}: {{ day.avgSystolic }}/{{ day.avgDiastolic }}</text>
						<text :class="['day-range', getRangeClass(day.maxSystolic, day.minSystolic)]">
							{{ $t('范围')}}:
							{{ day.minSystolic }}-{{ day.maxSystolic }}/{{ day.minDiastolic }}-{{ day.maxDiastolic }}
						</text>
					</view>
					<view class="day-bar">
						<view class="day-progress" :style="{ width: (day.count / maxDayCount) * 100 + '%' }"></view>
					</view>
				</view>
			</view>
		</view>

		<!-- 监测设置说明 -->
		<view class="setting-section">
			<view class="setting-title">{{ $t('监测设置')}}</view>
			<view class="setting-content">
				<view class="setting-item">
					<text class="setting-label">{{ $t('监测时段')}}1</text>
					<text class="setting-value">08:00 - 15:00</text>
				</view>
				<view class="setting-item">
					<text class="setting-label">{{ $t('监测间隔')}}1</text>
					<text class="setting-value">360{{ $t('分钟次')}}</text>
				</view>
				<view class="setting-item">
					<text class="setting-label">{{ $t('监测时段')}}2</text>
					<text class="setting-value">18:00 - 21:00</text>
				</view>
				<view class="setting-item">
					<text class="setting-label">{{ $t('监测间隔')}}2</text>
					<text class="setting-value">180{{ $t('分钟次')}}</text>
				</view>
				<view class="setting-item wide">
					<text class="setting-label">{{ $t('监测周期')}}</text>
					<text class="setting-value">{{ $t('连续天7')}}</text>
				</view>
			</view>
		</view>

		<!-- 详细数据列表 -->
		<view class="detail-section">
			<view class="detail-header">
				<text class="detail-title">{{ $t('详细监测数据')}}</text>
				<view class="filter-tabs">
					<text :class="['tab', currentTab === 'all' ? 'active' : '']" @click="switchTab('all')">
						{{ $t('全部')}}({{ stats.totalCount }})
					</text>
					<text :class="['tab', currentTab === 'day' ? 'active' : '']" @click="switchTab('day')">
						{{ $t('白天')}}({{ dayCount }})
					</text>
					<text :class="['tab', currentTab === 'night' ? 'active' : '']" @click="switchTab('night')">
						{{ $t('夜间')}}({{ nightCount }})
					</text>
				</view>
			</view>

			<!-- 按日期分组显示 -->
			<view class="detail-list">
				<view v-for="(group, date) in groupedData" :key="date" class="date-group">
					<view class="date-header">
						<text class="date-text">{{ date }}</text>
						<text class="date-count">{{ group.length }}{{ $t('次测量')}}</text>
					</view>
					<view class="list-header">
						<text class="header-item time">{{ $t('时间')}}</text>
						<text class="header-item type">{{ $t('时段')}}</text>
						<text class="header-item value">{{ $t('血压值')}}</text>
						<text class="header-item status">{{ $t('状态')}}</text>
					</view>
					<view class="list-body">
						<view v-for="(item, idx) in group" :key="idx"
							:class="['data-row', item.period === 'night' ? 'night-row' : '']">
							<text class="row-item time">{{ item.time.split(' ')[1] }}</text>
							<text class="row-item type">
								<text :class="['period-tag', item.period]">{{ item.periodText }}</text>
							</text>
							<text class="row-item value">{{ formatRecordValue(item) }}</text>
							<text class="row-item status">
								<text :class="['status-tag', item.status]">{{ item.statusText }}</text>
							</text>
						</view>
					</view>
				</view>

				<!-- 无数据提示 -->
				<view v-if="filteredData.length === 0" class="empty-tip">
					<text>{{ $t('暂无数据')}}</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-btns">
			<button class="btn print" @click="printPDF">{{ $t('分享报告')}}</button>
			<button class="btn back" @click="goBack">{{ $t('返回')}}</button>
		</view>

		<!-- 分享弹窗 -->
		<view class="share-popup" v-if="showSharePopup" @click="closeSharePopup">
			<view class="share-content" @click.stop>
				<view class="share-title">{{ $t('导出报告')}}</view>
				<view class="share-options">
					<view class="share-item" @click="generatePDF">
						<view class="share-icon pdf">📄</view>
						<text class="share-text">{{ $t('生成PDF')}}</text>
					</view>
					<view class="share-item" @click="printPDF">
						<view class="share-icon print">🖨️</view>
						<text class="share-text">{{ $t('打印')}}</text>
					</view>
				</view>
				<view class="share-cancel" @click="closeSharePopup">{{ $t('取消')}}</view>
			</view>
		</view>

		<!-- PDF预览弹窗 -->
		<view class="pdf-popup" v-if="showPDFPreview" @click="closePDFPreview">
			<view class="pdf-content" @click.stop>
				<view class="pdf-header">
					<text class="pdf-title">{{ $t('PDF报告预览')}}</text>
					<text class="pdf-close" @click="closePDFPreview">✕</text>
				</view>

				<!-- 修改 pdf-popup 中的 pdf-body 部分 -->
				<scroll-view class="pdf-body" scroll-y="true" :scroll-top="scrollTop" @scroll="onScroll" enhanced="true"
					show-scrollbar="true" :style="{ height: '100%' }">
					<view class="pdf-image-wrapper" :style="{ minHeight: '100%' }">
						<image v-if="pdfImagePath" :src="pdfImagePath" mode="widthFix" class="pdf-image"
							@load="onImageLoad" @error="onImageError" :style="{ width: '100%' }" />
						<view v-else class="pdf-loading">{{ $t('正在生成PDF...')}}</view>
					</view>
					<view class="pdf-bottom-space" style="height: 100rpx;"></view>
				</scroll-view>
			</view>
		</view>

		<!-- 修改 print-popup 中的内容 -->
		<view class="print-popup" v-if="showPrintPreview" @click="closePrintPreview">
			<view class="print-content" @click.stop>
				<view class="print-header">
					<text class="print-title">{{ $t('分享预览')}}</text>
					<text class="print-close" @click="closePrintPreview">✕</text>
				</view>

				<scroll-view class="print-body" scroll-y="true">
					<view id="printable-area" class="printable-area">
						<!-- 打印内容区域 -->
						<view class="print-page">
							<view class="print-header-section">
								<text class="print-main-title">{{ $t('天监测报告7')}}</text>
								<view class="print-subtitle">
									<text>{{ $t('姓名')}}：{{ userInfo.name }} |
										{{ $t('性别')}}：{{ getsex(userInfo.gender) }} |
										{{ $t('年龄')}}：{{ userInfo.age }}{{ $t('岁')}}</text>
								</view>
								<view class="print-time">
									<text>{{ $t('监测时间')}}：{{ monitorInfo.startTime }} {{ $t('至')}}
										{{ monitorInfo.endTime }}</text>
								</view>
							</view>
							<view class="print-section"
								v-if="userInfo.height || userInfo.weight || request.bmi !== 'NA'">
								<view class="print-section-title">{{ $t('身体指标')}}</view>
								<view class="print-info-grid">
									<view class="print-info-item" v-if="userInfo.height">
										<text class="print-info-label">{{ $t('身高')}}</text>
										<text class="print-info-value">{{ formatBodyHeight(userInfo.height) }}</text>
									</view>
									<view class="print-info-item" v-if="userInfo.weight">
										<text class="print-info-label">{{ $t('体重')}}</text>
										<text class="print-info-value">{{ formatBodyWeight(userInfo.weight) }}</text>
									</view>
									<view class="print-info-item" v-if="userInfo.waist">
										<text class="print-info-label">{{ $t('腰围')}}</text>
										<text class="print-info-value">{{ formatBodyHeight(userInfo.waist) }}</text>
									</view>
									<view class="print-info-item" v-if="request.bmi && request.bmi !== 'NA'">
										<text class="print-info-label">BMI</text>
										<text class="print-info-value"
											:class="getBmiClass(request.bmi)">{{ request.bmi }}</text>
									</view>
									<view class="print-info-item" v-if="request.whtr && request.whtr !== 'NA'">
										<text class="print-info-label">{{ $t('腰围身高比')}}</text>
										<text class="print-info-value">{{ request.whtr }}</text>
									</view>
								</view>
							</view>

							<!-- 新增：用药信息 -->
							<view class="print-section" v-if="userInfo.takingMedicine">
								<view class="print-section-title">{{ $t('用药信息')}}</view>
								<view class="print-medicine-grid">
									<view class="print-medicine-item wide">
										<text class="print-medicine-label">{{ $t('是否服用高血压药物')}}</text>
										<text
											class="print-medicine-value">{{userInfo.takingMedicine === true ? $t('是') : $t('否')}}</text>
									</view>
									<view class="print-medicine-item"
										v-if="userInfo.takingMedicine === true && userInfo.medicineType">
										<text class="print-medicine-label">{{ $t('服药种类')}}</text>
										<text class="print-medicine-value">{{ userInfo.medicineType }}</text>
									</view>
									<view class="print-medicine-item"
										v-if="userInfo.takingMedicine === true && userInfo.medicineTime">
										<text class="print-medicine-label">{{ $t('服药时间')}}</text>
										<text class="print-medicine-value">{{ userInfo.medicineTime }}</text>
									</view>
									<view class="print-medicine-item wide"
										v-if="userInfo.takingMedicine === true && userInfo.diagnosisDate">
										<text class="print-medicine-label">{{ $t('确诊时间')}}</text>
										<text class="print-medicine-value">{{ userInfo.diagnosisDate }}</text>
									</view>
								</view>
							</view>

							<!-- 睡眠数据 -->
							<view class="print-section">
								<view class="print-section-title">{{ $t('睡眠数据')}}</view>
								<view class="print-medicine-grid">
									<view class="print-medicine-item wide" v-if="hasSleepData">
										<text class="print-medicine-label">{{ $t('睡眠时间')}}</text>
										<text class="print-medicine-value">{{ userInfo.sleepTime }}</text>
									</view>
									<view class="print-medicine-item wide" v-else>
										<text class="print-medicine-value">{{ $t('此用户未佩戴手表测量睡眠数据') }}</text>
									</view>
								</view>
							</view>

							<view class="print-section">
								<view class="print-section-title">{{ $t('统计概览')}}</view>
								<view class="print-stats-grid">
									<view class="print-stat-box">
										<text class="print-stat-label">{{ $t('天平均血压7')}}</text>
										<text
											class="print-stat-value">{{ stats.avg7d.systolic }}/{{ stats.avg7d.diastolic }}
											mmHg</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{ $t('总测量次数')}}</text>
										<text class="print-stat-value">{{ stats.totalCount }} {{ $t('次')}}</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{ $t('白天测量')}}</text>
										<text class="print-stat-value">{{ dayCount }}{{ $t('次')}}
											({{ dayRatio }}%)</text>
									</view>
									<view class="print-stat-box">
										<text class="print-stat-label">{{ $t('夜间测量')}}</text>
										<text class="print-stat-value">{{ nightCount }} {{ $t('次')}}
											({{ nightRatio }}%)</text>
									</view>
								</view>
							</view>

							<!-- 修复：极值记录 - 增大格子 -->
							<view class="print-section">
								<view class="print-section-title">{{ $t('极值记录')}}</view>
								<view class="print-extreme-grid large">
									<view class="print-extreme-box high">
										<text class="print-extreme-label">{{ $t('最高血压')}}</text>
										<text
											class="print-extreme-value large">{{ stats.max.systolic }}/{{ stats.max.diastolic }}</text>
										<text class="print-extreme-label">mmHg</text>
										<text class="print-extreme-time">{{ stats.max.time || '-' }}</text>
									</view>
									<view class="print-extreme-box low">
										<text class="print-extreme-label">{{ $t('最低血压')}}</text>
										<text
											class="print-extreme-value large">{{ stats.min.systolic }}/{{ stats.min.diastolic }}</text>
										<text class="print-extreme-label">mmHg</text>
										<text class="print-extreme-time">{{ stats.min.time || '-' }}</text>
									</view>
								</view>
							</view>

							<view class="print-section">
								<view class="print-section-title">{{ $t('天数据分布7')}}</view>
								<view class="print-table">
									<view class="print-table-header">
										<text class="print-th">{{ $t('日期')}}</text>
										<text class="print-th">{{ $t('测量次数')}}</text>
										<text class="print-th">{{ $t('平均收缩压')}}</text>
										<text class="print-th">{{ $t('平均舒张压')}}</text>
										<text class="print-th">{{ $t('收缩压范围')}}</text>
									</view>
									<view v-for="(day, index) in dailyStats" :key="index" class="print-table-row">
										<text class="print-td">{{ day.date }}</text>
										<text class="print-td">{{ day.count }}{{ $t('次')}}</text>
										<text class="print-td">{{ day.avgSystolic }}</text>
										<text class="print-td">{{ day.avgDiastolic }}</text>
										<text class="print-td">{{ day.minSystolic }}-{{ day.maxSystolic }}</text>
									</view>
								</view>
							</view>

							<view class="print-section">
								<view class="print-section-title">
									{{ $t('详细监测数据')}}（{{ $t('共')}}{{ monitorData.length }}{{ $t('条')}}）
								</view>
								<view class="print-table">
									<view class="print-table-header">
										<text class="print-th">{{ $t('时间')}}</text>
										<text class="print-th">{{ $t('时段')}}</text>
										<text class="print-th">{{ $t('血压值')}}</text>
										<text class="print-th">{{ $t('状态')}}</text>
									</view>
									<view v-for="(item, index) in printDataList" :key="index" class="print-table-row">
										<text class="print-td">{{ item.time }}</text>
										<text class="print-td">{{ item.periodText }}</text>
										<text class="print-td">{{ formatRecordValue(item) }}</text>
										<text class="print-td"
											:class="'status-' + item.status">{{ item.statusText }}</text>
									</view>
								</view>
							</view>

							<view class="print-footer-section">
								<text>{{ $t('报告生成时间')}}：{{ currentDateTime }}</text>
								<text>{{ $t('本报告仅供参考不作为医疗诊断依据')}}</text>
							</view>
						</view>
					</view>
					<view class="print-bottom-space"></view>
				</scroll-view>

				<view class="print-footer">
					<button class="print-btn cancel" @click="closePrintPreview">{{ $t('取消')}}</button>
					<button class="print-btn confirm" @click="executePrint">{{ $t('确认分享')}}</button>
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
		imageToPdf,
		savePdfToFile
	} from '../../../api/unitls/imageToPdf.js';
	import {
		getChinaTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'
	export default {
		data() {
			return {
				// 用户信息
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
					bmi: 'NA',
					whtr: 'NA'
				},
				monitorInfo: {
					startTime: '',
					endTime: ''
				},
				currentTab: 'all',
				stats: {
					avg7d: {
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
					},
					maxDayAvg: {
						systolic: '-',
						diastolic: '-',
						date: ''
					},
					minDayAvg: {
						systolic: '-',
						diastolic: '-',
						date: ''
					}
				},
				dailyStats: [],
				monitorData: [],
				dayCount: 0,
				nightCount: 0,
				pacitime: getChinaTimeAllJSON().YMD + ' 07:00:00',
				filterVarList: 'JLvFLGvJL01v1W',
				period: '1W',
				finlretVarList1: 'BPvSBPvCNTv7DvCNTv0002,BPvSBPvCNTv7DvCNTv0003,BPvSBPvCNTv7DvCNTv0004,BPvSBPvCNTv7DvCNTv0001,JLvRULEv7DvDATACHECKv0001,JLvRULEv7DvDATACHECKv0002,JLvRULEv7DvDATACHECKv0003,BPvSBPvAVGv7DvAVGv0002,BPvDBPvAVGv7DvAVGv0002,BPvHRvAVGv7DvAVGv0002,BPvSBPvAVGv7DvAVGv0003,BPvDBPvAVGv7DvAVGv0003,BPvHRvAVGv7DvAVGv0003,BPvSBPvAVGv7DvAVGv0004,BPvDBPvAVGv7DvAVGv0004,BPvHRvAVGv7DvAVGv0004,BPvSBPvAVGv7DvAVGv0001,BPvDBPvAVGv7DvAVGv0001,BPvHRvAVGv7DvAVGv0001,JLvRULEv7DvBPCHECKv0004,JLvRULEv7DvBPCHECKv0005,JLvRULEv7DvBPCHECKv0007,JLvRULEv7DvBPCHECKv0008,JLvRULEv7DvBPCHECKv0010,JLvRULEv7DvBPCHECKv0011,JLvRULEv7DvBPCHECKv0001,JLvRULEv7DvBPCHECKv0002,BPvSBPvSTDv7DvSTDv0002,BPvDBPvSTDv7DvSTDv0002,BPvHRvSTDv7DvSTDv0002,BPvSBPvSTDv7DvSTDv0003,BPvDBPvSTDv7DvSTDv0003,BPvHRvSTDv7DvSTDv0003,BPvSBPvSTDv7DvSTDv0004,BPvDBPvSTDv7DvSTDv0004,BPvHRvSTDv7DvSTDv0004,BPvSBPvSTDv7DvSTDv0001,BPvDBPvSTDv7DvSTDv0001,BPvHRvSTDv7DvSTDv0001,BPvSBPvMAXv7DvMAXv0002,BPvDBPvMAXv7DvMAXv0002,BPvHRvMAXv7DvMAXv0002,BPvSBPvMAXv7DvMAXv0003,BPvDBPvMAXv7DvMAXv0003,BPvHRvMAXv7DvMAXv0003,BPvSBPvMAXv7DvMAXv0004,BPvDBPvMAXv7DvMAXv0004,BPvHRvMAXv7DvMAXv0004,BPvSBPvMAXv7DvMAXv0001,BPvDBPvMAXv7DvMAXv0001,BPvHRvMAXv7DvMAXv0001,BPvSBPvMEDv7DvMEDv0002,BPvDBPvMEDv7DvMEDv0002,BPvHRvMEDv7DvMEDv0002,BPvSBPvMEDv7DvMEDv0003,BPvDBPvMEDv7DvMEDv0003,BPvHRvMEDv7DvMEDv0003,BPvSBPvMEDv7DvMEDv0004,BPvDBPvMEDv7DvMEDv0004,BPvHRvMEDv7DvMEDv0004,BPvSBPvMEDv7DvMEDv0001,BPvDBPvMEDv7DvMEDv0001,BPvHRvMEDv7DvMEDv0001,BPvSBPvMINv7DvMINv0002,BPvDBPvMINv7DvMINv0002,BPvHRvMINv7DvMINv0002,BPvSBPvMINv7DvMINv0003,BPvDBPvMINv7DvMINv0003,BPvHRvMINv7DvMINv0003,BPvSBPvMINv7DvMINv0004,BPvDBPvMINv7DvMINv0004,BPvHRvMINv7DvMINv0004,BPvSBPvMINv7DvMINv0001,BPvDBPvMINv7DvMINv0001,BPvHRvMINv7DvMINv0001,BPvSBPvLOADv7DvRATIOv0002,BPvDBPvLOADv7DvRATIOv0002,BPvSBPvLOADv7DvRATIOv0003,BPvDBPvLOADv7DvRATIOv0003,BPvSBPvLOADv7DvRATIOv0004,BPvDBPvLOADv7DvRATIOv0004,BPvSBPvLOADv7DvRATIOv0001,BPvDBPvLOADv7DvRATIOv0001,JLvRULEv7DvBPCHECKv0022,JLvRULEv7DvBPCHECKv0027,JLvRULEv7DvBPCHECKv0023,JLvRULEv7DvBPCHECKv0028,JLvRULEv7DvBPCHECKv0024,JLvRULEv7DvBPCHECKv0029,JLvRULEv7DvBPCHECKv0021,JLvRULEv7DvBPCHECKv0026,BPvSBPvNBRv7DvRATIOv0001,BPvDBPvNBRv7DvRATIOv0001,JLvRULEv7DvBPCHECKv0013,JLvRULEv7DvBPCHECKv0014,JLvRULEv7DvBPCHECKv0015,JLvRULEv7DvBPCHECKv0016,JLvRULEv7DvBPCHECKv0017,JLvRULEv7DvBPCHECKv0018, JLvRULEv7DvBPCHECKv0019, JLvRULEv7DvBPCHECKv0020,BPvSBPvMBSv7DvMINUSv0001,BPvDBPvMBSv7DvMINUSv0001,JLvRULEv7DvBPCHECKv0031,BPvSBPvCVv7DvRATIO2v0002,BPvDBPvCVv7DvRATIO2v0002,BPvHRvCVv7DvRATIO2v0002,BPvSBPvCVv7DvRATIO2v0003,BPvDBPvCVv7DvRATIO2v0003,BPvHRvCVv7DvRATIO2v0003,BPvSBPvCVv7DvRATIO2v0004,BPvDBPvCVv7DvRATIO2v0004,BPvHRvCVv7DvRATIO2v0004,BPvSBPvCVv7DvRATIO2v0001,BPvDBPvCVv7DvRATIO2v0001,BPvHRvCVv7DvRATIO2v0001,BPvAASIv7D,JLvRULEv7DvBPCHECKv0032',
				dayRatio: 0,
				nightRatio: 0,
				bloodUnit: uni.getStorageSync('Blood') === 0 || uni.getStorageSync('Blood') === '' ? 'mmHg' : 'kPa',
				chartData: {
					categories: [],
					series: [{
							name: this.$t('收缩压'),
							data: [],
							connectNulls: true,
							pointShape: 'circle',
							showSymbol: true
						},
						{
							name: this.$t('舒张压'),
							data: [],
							connectNulls: true,
							pointShape: 'circle',
							showSymbol: true
						}
					]
				},

				chartOptions: {
					color: ['#FC7F41', '#7AE545'],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					dataLabel: false, // 在根级别关闭所有数据标签
					xAxis: {
						disableGrid: true,
						gridType: 'dash',
						fontSize: 10,
						calibration: false,
						axisLine: false
					},
					yAxis: {
						splitNumber: 4,
						gridType: 'dash',
						data: [{
							min: 0,
							max: 200,
							position: 'left',
							fontSize: 10,
							textAlign: 'left',
							calibration: false,
							axisLine: true
						}]
					},
					extra: {
						line: {
							type: 'straight',
							width: 2,
							activeType: 'hollow'
						}
					}
				},
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
			};
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
				// 按日期倒序排列；同日内按测量时间正序
				return Object.keys(groups)
					.sort((a, b) => new Date(b) - new Date(a))
					.reduce((acc, key) => {
						acc[key] = groups[key].slice().sort((a, b) => itemTimeMs(a) - itemTimeMs(b));
						return acc;
					}, {});
			},
			maxDayCount() {
				return this.dailyStats.length ? Math.max(...this.dailyStats.map(d => d.count)) : 0;
			}
		},
		onLoad(options) {
			try {
				const request = JSON.parse(decodeURIComponent(options.request));
				const form = JSON.parse(decodeURIComponent(options.form));
				this.userInfo = {
					...this.userInfo,
					...form
				};
				this.request = request;
			} catch (e) {
				console.error('参数解析失败:', e);
			}
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("天监测报告7")
			})
			that.calculateTimeRange();
			that.get_retVarList();
			that.queryMonthAvg();
			that.get_trend_data();
			that.updateCurrentDateTime();
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
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
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
				const now = new Date();
				const endTime =
					`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} 21:05:00`;
				const startDate = new Date(now);
				startDate.setDate(startDate.getDate() - 6);
				const startTime =
					`${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} 08:00:00`;
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
				const isDay = timeInMinutes >= 6 * 60 && timeInMinutes < 21 * 60 + 30;
				return isDay ? {
					period: 'day',
					periodText: this.$t('白天')
				} : {
					period: 'night',
					periodText: this.$t('夜间')
				};
			},
			convertPressure(value) {
				if (this.bloodUnit === 'mmHg') return value;
				return (Number(value) * 0.133).toFixed(1);
			},
			getRangeClass(max, min) {
				const range = max - min;
				if (range > 30) return 'high-variation';
				if (range > 20) return 'medium-variation';
				return 'low-variation';
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
					if (!v || v === 'NA') return true;
					const n = Number(v);
					return !Number.isFinite(n) || n >= 999999990;
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
			calculateExtremesFromData(data) {
				if (!data.length) {
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

				for (const item of data) {
					if (item.heartRateOnly) continue;
					const sys = Number(item.systolic);
					const dia = Number(item.diastolic);
					const maxSys = Number(maxItem.systolic);
					const maxDia = Number(maxItem.diastolic);
					const minSys = Number(minItem.systolic);
					const minDia = Number(minItem.diastolic);

					if (sys > maxSys || (sys === maxSys && dia > maxDia)) maxItem = item;
					if (sys < minSys || (sys === minSys && dia < minDia)) minItem = item;
				}

				this.stats.max = {
					systolic: maxItem.systolic,
					diastolic: maxItem.diastolic,
					time: maxItem.fullTime || maxItem.time
				};
				this.stats.min = {
					systolic: minItem.systolic,
					diastolic: minItem.diastolic,
					time: minItem.fullTime || minItem.time
				};
			},
			updateStatistics(data) {
				if (!data.length) {
					this.stats.totalCount = 0;
					this.dayCount = 0;
					this.nightCount = 0;
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

				const calcAvg = (arr) => {
					if (!arr.length) return {
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

				if (this.stats.avg7d.systolic === '-' || this.stats.avg7d.systolic === 'NA') {
					this.stats.avg7d = calcAvg(bpData);
				}
				if (this.stats.dayAvg.systolic === '-' || this.stats.dayAvg.systolic === 'NA') {
					this.stats.dayAvg = calcAvg(bpDayData);
				}
				if (this.stats.nightAvg.systolic === '-' || this.stats.nightAvg.systolic === 'NA') {
					this.stats.nightAvg = calcAvg(bpNightData);
				}

				if (!this.dayRatio && this.dayRatio !== 0) {
					this.dayRatio = this.stats.totalCount ? Math.round((this.dayCount / this.stats.totalCount) * 100) : 0;
					this.nightRatio = this.stats.totalCount ? Math.round((this.nightCount / this.stats.totalCount) * 100) :
						0;
				}

				this.calculateExtremesFromData(bpData);
			},
			calculateDailyStats(data) {
				if (!data.length) {
					this.dailyStats = [];
					return;
				}
				const dayMap = {};
				for (const item of data) {
					if (item.heartRateOnly) continue;
					if (item.systolic == null || item.diastolic == null ||
						item.systolic === '' || item.diastolic === '' ||
						item.systolic === '-' || item.diastolic === '-' ||
						item.systolic === '--' || item.diastolic === '--') {
						continue;
					}
					const systolic = Number(item.systolic);
					const diastolic = Number(item.diastolic);
					if (Number.isNaN(systolic) || Number.isNaN(diastolic)) {
						continue;
					}

					const date = item.time.split(' ')[0];
					if (!dayMap[date]) {
						dayMap[date] = {
							date,
							count: 0,
							systolics: [],
							diastolics: [],
							maxSystolic: 0,
							minSystolic: 999,
							maxDiastolic: 0,
							minDiastolic: 999
						};
					}

					const day = dayMap[date];
					day.count++;
					day.systolics.push(systolic);
					day.diastolics.push(diastolic);
					day.maxSystolic = Math.max(day.maxSystolic, systolic);
					day.minSystolic = Math.min(day.minSystolic, systolic);
					day.maxDiastolic = Math.max(day.maxDiastolic, diastolic);
					day.minDiastolic = Math.min(day.minDiastolic, diastolic);
				}

				this.dailyStats = Object.values(dayMap).map(day => ({
					date: day.date,
					count: day.count,
					avgSystolic: Math.round(day.systolics.reduce((a, b) => a + b, 0) / day.systolics.length),
					avgDiastolic: Math.round(day.diastolics.reduce((a, b) => a + b, 0) / day.diastolics
						.length),
					maxSystolic: day.maxSystolic,
					minSystolic: day.minSystolic,
					maxDiastolic: day.maxDiastolic,
					minDiastolic: day.minDiastolic
				})).sort((a, b) => new Date(b.date) - new Date(a.date));

				if (this.dailyStats.length) {
					const maxDay = this.dailyStats.reduce((max, day) => day.avgSystolic > max.avgSystolic ? day : max);
					const minDay = this.dailyStats.reduce((min, day) => day.avgSystolic < min.avgSystolic ? day : min);
					this.stats.maxDayAvg = {
						systolic: maxDay.avgSystolic,
						diastolic: maxDay.avgDiastolic,
						date: maxDay.date
					};
					this.stats.minDayAvg = {
						systolic: minDay.avgSystolic,
						diastolic: minDay.avgDiastolic,
						date: minDay.date
					};
				}
			},
			setDefaultChartData() {
				this.chartData.categories = [];
				this.chartData.series[0].data = [];
				this.chartData.series[1].data = [];
			},

			// ==================== API 请求 ====================
			get_retVarList() {
				// 永远中国时间；当天凌晨 1 点前报告尚未就绪，用前一天
				const chinaNow = getChinaTimeAllJSON()
				const chinaHour = Number(chinaNow.YMDHMS.slice(11, 13))
				const profYmd = chinaHour < 1 ?
					getChinaTimeAllJSON(new Date(Date.now() - 24 * 60 * 60 * 1000)).YMD :
					chinaNow.YMD
				const data = {
					userId: uni.getStorageSync("userid"),
					profDate: profYmd + ' 00:00:00',
					filterVarList: this.filterVarList,
					retVarList: 'TIME_MEASURE,JLvOPRvJL01vSBP,JLvOPRvJL01vDBP,JLvOPRvJL01vHR'
				};
				this.$post(this.$url_APP_IP + '/prod-api/device_app/get_retVarList', data, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/x-www-form-urlencoded'
				}).then((res) => {
					if (res.code === 200 && res.data && res.data.retVarList) {
						this.monitorData = this.processRetVarList(res.data.retVarList);
						this.updateStatistics(this.monitorData);
						this.calculateDailyStats(this.monitorData);
						if (!this.monitorData.length) {
							console.warn('[day7] get_retVarList 无明细', this.monitorInfo.startTime,
								this.monitorInfo.endTime, res);
						}
					}
				}).catch((err) => {
					console.warn('[day7] get_retVarList', err);
				});
			},
			get_trend_data() {
				let data = {
					deviceSn: uni.getStorageSync("userid"),
					timeLevel: 0,
					slaveList: [{
							slaveSn: "3",
							register: "highPressure"
						},
						{
							slaveSn: "3",
							register: "lowPressure"
						},
						{
							slaveSn: "0",
							register: "weight"
						}
					],
					startTime: this.monitorInfo.startTime,
					endTime: this.monitorInfo.endTime,
					aggregateType: "average"
				}
				this.$post(this.$url_APP_IP + this.$url_get_trend_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						this.chartData.categories = []
						this.chartData.series[0].data = []
						this.chartData.series[1].data = []
						const timestampToDateStr = (timestamp) => {
							let date = new Date(parseInt(timestamp))
							let year = date.getFullYear()
							let month = (date.getMonth() + 1).toString().padStart(2, '0')
							let day = date.getDate().toString().padStart(2, '0')
							return `${year}-${month}-${day}`
						}

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

						let startDate = new Date(this.monitorInfo.startTime)
						let endDate = new Date(this.monitorInfo.endTime)
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

						dateList.forEach((item, index) => {
							let dayData = dataMap.get(item.dateStr)
							this.chartData.series[0].data.push(dayData && dayData.high !== null ? dayData
								.high : null)
							this.chartData.series[1].data.push(dayData && dayData.low !== null ? dayData
								.low : null)
						})

						let startLabel = `${dateList[0].month}/${dateList[0].day}`
						let endLabel =
							`${dateList[dateList.length - 1].month}/${dateList[dateList.length - 1].day}`
						dateList.forEach((item, index) => {
							if (index === 0) {
								this.chartData.categories.push(startLabel)
							} else if (index === dateList.length - 1) {
								this.chartData.categories.push(endLabel)
							} else {
								this.chartData.categories.push('')
							}
						})
					} else if (res.code == 500) {
						this.setDefaultData()
						return
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.setDefaultData()
						return
					}

					this.$nextTick(() => this.$forceUpdate())
				})
			},

			processTrendData(res) {
				const timestampToDateStr = (timestamp) => {
					const date = new Date(parseInt(timestamp));
					return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
				};

				const dataMap = new Map();
				if (res.data.highPressure) {
					res.data.highPressure.forEach(item => {
						const dateStr = timestampToDateStr(item[1]);
						if (!dataMap.has(dateStr)) dataMap.set(dateStr, {
							high: null,
							low: null
						});
						dataMap.get(dateStr).high = item[0] ? parseFloat(item[0]) : null;
					});
				}
				if (res.data.lowPressure) {
					res.data.lowPressure.forEach(item => {
						const dateStr = timestampToDateStr(item[1]);
						if (!dataMap.has(dateStr)) dataMap.set(dateStr, {
							high: null,
							low: null
						});
						dataMap.get(dateStr).low = item[0] ? parseFloat(item[0]) : null;
					});
				}

				const startDate = new Date(this.monitorInfo.startTime);
				const endDate = new Date(this.monitorInfo.endTime);
				const dateList = [];
				let currentDate = new Date(startDate);
				while (currentDate <= endDate) {
					const dateStr =
						`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
					dateList.push({
						dateStr,
						fullDate: new Date(currentDate)
					});
					currentDate.setDate(currentDate.getDate() + 1);
				}

				this.chartData.categories = [];
				this.chartData.series[0].data = [];
				this.chartData.series[1].data = [];

				dateList.forEach((item, index) => {
					const dayData = dataMap.get(item.dateStr);
					this.chartData.series[0].data.push(dayData?.high !== null ? dayData.high : null);
					this.chartData.series[1].data.push(dayData?.low !== null ? dayData.low : null);

					if (index === 0) {
						this.chartData.categories.push(
							`${dateList[0].fullDate.getMonth() + 1}/${dateList[0].fullDate.getDate()}`);
					} else if (index === dateList.length - 1) {
						this.chartData.categories.push(
							`${dateList[dateList.length - 1].fullDate.getMonth() + 1}/${dateList[dateList.length - 1].fullDate.getDate()}`
						);
					} else {
						this.chartData.categories.push('');
					}
				});
			},
			queryMonthAvg() {
				const data = {
					deviceSn: uni.getStorageSync('userid'),
					slaveList: [{
						slaveSn: '3',
						register: 'highPressure'
					}],
					startTime: this.monitorInfo.startTime,
					endTime: this.monitorInfo.endTime
				};

				this.$post(this.$url_APP_IP + this.$url_query_month_avg, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						this.stats.avg7d.systolic = this.convertPressure(res.data.avg.highPressure);
						this.stats.avg7d.diastolic = this.convertPressure(res.data.avg.lowPressure);
					} else if (res.code === 500) {
						this.stats.avg7d.systolic = '--';
						this.stats.avg7d.diastolic = '--';
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			},

			// ==================== 分享和PDF功能 ====================
			exportReport() {
				this.generateShareImage();
			},
			generateShareImage() {
				uni.showLoading({
					title: '生成报告中...'
				});

				// #ifdef APP-PLUS
				setTimeout(() => {
					const pages = getCurrentPages();
					const page = pages[pages.length - 1];
					this.shareImagePath = page.$getAppWebview().captureSnapshot();
					uni.hideLoading();
					this.showSharePopup = true;
				}, 500);
				// #endif

				// #ifdef MP-WEIXIN || MP-QQ
				this.drawReportCanvas();
				// #endif

				// #ifdef H5
				uni.hideLoading();
				this.showSharePopup = true;
				// #endif
			},
			drawReportCanvas() {
				const ctx = uni.createCanvasContext('shareCanvas', this);
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, 375, 600);
				ctx.fillStyle = '#667eea';
				ctx.font = 'bold 20px sans-serif';
				ctx.fillText(this.$t('天监测报告7'), 20, 40);
				ctx.fillStyle = '#333';
				ctx.font = '14px sans-serif';
				ctx.fillText(`${this.$t('姓名')}：${this.userInfo.name}`, 20, 80);
				ctx.fillText(
					`${this.$t('监测时间')}：${this.monitorInfo.startTime.split(' ')[0]} ${this.$t('至')} ${this.monitorInfo.endTime.split(' ')[0]}`,
					20,
					110);
				ctx.fillStyle = '#667eea';
				ctx.font = 'bold 16px sans-serif';
				ctx.fillText(`${this.$t('天平均7')}：${this.stats.avg7d.systolic}/${this.stats.avg7d.diastolic} mmHg`, 20,
					150);
				ctx.fillText(`${this.$t('总测量次数')}：${this.stats.totalCount} ${this.$t('次')}`, 20, 180);
				ctx.fillStyle = '#e74c3c';
				ctx.fillText(`${this.$t('最高')}：${this.stats.max.systolic}/${this.stats.max.diastolic}`, 20, 220);
				ctx.fillStyle = '#3498db';
				ctx.fillText(`${this.$t('最低')}：${this.stats.min.systolic}/${this.stats.min.diastolic}`, 20, 250);
				ctx.fillStyle = '#999';
				ctx.font = '12px sans-serif';
				ctx.fillText(this.$t('生成时间') + '：' + new Date().toLocaleString('zh-CN'), 20, 580);

				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: 'shareCanvas',
						success: (res) => {
							this.shareImagePath = res.tempFilePath;
							uni.hideLoading();
							this.showSharePopup = true;
						},
						fail: () => {
							uni.hideLoading();
							uni.showToast({
								title: '生成失败',
								icon: 'none'
							});
						}
					}, this);
				});
			},
			closeSharePopup() {
				this.showSharePopup = false;
			},

			// PDF生成 - 核心功能：将图片转为PDF
			async generatePDF() {
				this.closeSharePopup();
				uni.showLoading({
					title: '生成PDF中...',
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
						title: '生成PDF失败: ' + error.message,
						icon: 'none',
						duration: 3000
					});
				}
			},
			// 在 methods 中添加
			checkAndRegenerateImage() {
				if (!this.pdfImagePath) return;

				// 检查图片是否完整（通过获取图片信息）
				uni.getImageInfo({
					src: this.pdfImagePath,
					success: (res) => {
						console.log('生成图片尺寸:', res.width, 'x', res.height);

						// 如果高度明显不够，提示可能不完整
						const expectedMinHeight = this.calculateCanvasHeight() / 2; // destWidth是2倍
						if (res.height < expectedMinHeight * 0.8) {
							uni.showModal({
								title: '图片生成可能不完整',
								content: '检测到生成的图片高度异常，是否重新生成？',
								success: (modalRes) => {
									if (modalRes.confirm) {
										this.generatePDF();
									}
								}
							});
						}
					},
					fail: (err) => {
						console.error('获取图片信息失败:', err);
					}
				});
			},

			// H5端：使用html2canvas + jsPDF生成PDF
			// 修改 generatePDFH5 方法
			async generatePDFH5() {
				// 等待页面完全渲染
				await new Promise(resolve => setTimeout(resolve, 500));

				const element = document.querySelector('.container');
				if (!element) throw new Error('未找到页面内容');

				// 获取完整高度（包括滚动区域）
				const originalHeight = element.style.height;
				const originalOverflow = element.style.overflow;

				// 临时展开所有内容
				element.style.height = 'auto';
				element.style.overflow = 'visible';

				try {
					// 1. 将页面内容转为canvas图片
					const canvas = await html2canvas(element, {
						scale: 2,
						useCORS: true,
						allowTaint: true,
						backgroundColor: '#f5f7fa',
						height: element.scrollHeight, // 使用完整高度
						windowHeight: element.scrollHeight,
						logging: false,
						// 确保捕获整个页面
						y: 0,
						scrollY: 0
					});

					// 2. 获取图片的base64数据
					const imgData = canvas.toDataURL('image/png');
					this.pdfImagePath = imgData;

					// 3. 创建PDF并添加图片（支持多页）
					const pdf = new jsPDF('p', 'mm', 'a4');
					const imgWidth = 210; // A4宽度210mm
					const pageHeight = 297; // A4高度297mm
					const imgHeight = canvas.height * imgWidth / canvas.width;

					let heightLeft = imgHeight;
					let position = 0;

					// 添加第一页
					pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;

					// 如果内容超过一页，添加更多页面
					while (heightLeft > 0) {
						position = heightLeft - imgHeight;
						pdf.addPage();
						pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
						heightLeft -= pageHeight;
					}

					// 4. 保存PDF数据
					this.pdfBase64 = pdf.output('datauristring');
					this.pdfBlob = pdf.output('blob');

					console.log('PDF生成成功，总页数:', pdf.getNumberOfPages());

				} finally {
					// 恢复原始样式
					element.style.height = originalHeight;
					element.style.overflow = originalOverflow;
				}
			},
			// App端：使用原生能力生成PDF（图片转PDF）
			async generatePDFApp() {
				return new Promise((resolve, reject) => {
					// 1. 先绘制详细canvas获取图片
					this.drawDetailedCanvas().then(imagePath => {
						// 2. 读取图片文件转为base64
						plus.io.resolveLocalFileSystemURL(imagePath, (entry) => {
							entry.file((file) => {
								const reader = new plus.io.FileReader();
								reader.onloadend = (e) => {
									const base64Data = e.target.result;
									this.pdfImagePath = imagePath;
									this.pdfBase64 = base64Data;

									// App端使用原生PDF生成插件或上传服务器生成PDF
									// 这里我们保存图片base64，后续可以转为PDF
									resolve();
								};
								reader.onerror = (e) => {
									reject(new Error('读取文件失败: ' + e.message));
								};
								reader.readAsDataURL(file);
							});
						}, (e) => {
							reject(new Error('获取文件失败: ' + e.message));
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
									reject(new Error(data.msg || '生成PDF失败'));
								}
							} catch (e) {
								reject(new Error('解析响应失败'));
							}
						},
						fail: (err) => reject(new Error('上传失败: ' + err.errMsg))
					});
				});
			},

			// 替换 drawDetailedCanvas 方法
			drawDetailedCanvas() {
				return new Promise((resolve, reject) => {
					const ctx = uni.createCanvasContext('shareCanvas', this);
					const width = 750;

					// 先计算总高度（包含所有新增内容）
					let totalHeight = this.calculateCanvasHeight();
					totalHeight += 100;
					totalHeight = Math.max(totalHeight, 1200);

					this.canvasWidth = width;
					this.canvasHeight = totalHeight;

					let y = 40;

					// 白色背景
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, width, totalHeight);

					// 标题
					ctx.fillStyle = '#667eea';
					ctx.font = 'bold 40px sans-serif';
					ctx.fillText(this.$t('天监测报告7'), 40, y);
					y += 80;

					// 基本信息
					ctx.fillStyle = '#333';
					ctx.font = '28px sans-serif';
					ctx.fillText(`${this.$t('姓名')}：${this.userInfo.name}`, 40, y);
					y += 50;
					ctx.fillText(
						`${this.$t('性别')}：${this.getsex(this.userInfo.gender)} ${this.$t('年龄')}：${this.userInfo.age}${this.$t('岁')}`,
						40, y);
					y += 50;
					ctx.fillText(`${this.$t('监测时间')}：${this.monitorInfo.startTime} ${this.$t('至')}`, 40, y);
					y += 40;
					ctx.fillText(`${this.monitorInfo.endTime}`, 40, y);
					y += 70;

					// ========== 新增：身体指标 ==========
					if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
						ctx.fillStyle = '#9b59b6';
						ctx.font = 'bold 32px sans-serif';
						ctx.fillText(`【${this.$t("身体指标")}】`, 40, y);
						y += 60;
						ctx.fillStyle = '#333';
						ctx.font = '28px sans-serif';

						if (this.userInfo.height) {
							ctx.fillText(`${this.$t("身高")}：${this.formatBodyHeight(this.userInfo.height)}`, 40, y);
							y += 50;
						}
						if (this.userInfo.weight) {
							ctx.fillText(`${this.$t("体重")}：${this.formatBodyWeight(this.userInfo.weight)}`, 40, y);
							y += 50;
						}
						if (this.userInfo.waist) {
							ctx.fillText(`${this.$t("腰围")}：${this.formatBodyHeight(this.userInfo.waist)}`, 40, y);
							y += 50;
						}
						if (this.request.bmi && this.request.bmi !== 'NA') {
							ctx.fillText(`BMI：${this.request.bmi}`, 40, y);
							y += 50;
						}
						if (this.request.whtr && this.request.whtr !== 'NA') {
							ctx.fillText(`${this.$t("腰围身高比")}：${this.request.whtr}`, 40, y);
							y += 50;
						}
						y += 20;
					}

					// ========== 新增：用药信息 ==========
					if (this.userInfo.takingMedicine) {
						ctx.fillStyle = '#e67e22';
						ctx.font = 'bold 32px sans-serif';
						ctx.fillText(`【${this.$t("用药信息")}】`, 40, y);
						y += 60;
						ctx.fillStyle = '#333';
						ctx.font = '28px sans-serif';
						ctx.fillText(
							`${this.$t("服用高血压药物")}：${this.userInfo.takingMedicine === true ? this.$t("是") : this.$t("否")}`,
							40, y);
						y += 50;

						if (this.userInfo.takingMedicine === true) {
							if (this.userInfo.medicineType) {
								ctx.fillText(`${this.$t("服药种类")}：${this.userInfo.medicineType}`, 40, y);
								y += 50;
							}
							if (this.userInfo.medicineTime) {
								ctx.fillText(`${this.$t("服药时间")}：${this.userInfo.medicineTime}`, 40, y);
								y += 50;
							}
							if (this.userInfo.diagnosisDate) {
								ctx.fillText(`${this.$t("确诊时间")}：${this.userInfo.diagnosisDate}`, 40, y);
								y += 50;
							}
						}
						y += 20;
					}

					// ========== 睡眠数据 ==========
					ctx.fillStyle = '#3498db';
					ctx.font = 'bold 32px sans-serif';
					ctx.fillText(`【${this.$t("睡眠数据")}】`, 40, y);
					y += 60;
					ctx.fillStyle = '#333';
					ctx.font = '28px sans-serif';
					if (this.hasSleepData) {
						ctx.fillText(`${this.$t("睡眠时间")}：${this.userInfo.sleepTime}`, 40, y);
					} else {
						ctx.fillText(this.$t('此用户未佩戴手表测量睡眠数据'), 40, y);
					}
					y += 70;

					// 统计概览
					ctx.fillStyle = '#667eea';
					ctx.font = 'bold 32px sans-serif';
					ctx.fillText(`【${this.$t("统计概览")}】`, 40, y);
					y += 60;
					ctx.fillStyle = '#333';
					ctx.font = '28px sans-serif';
					ctx.fillText(
						`${this.$t("天平均血压7")}：${this.stats.avg7d.systolic}/${this.stats.avg7d.diastolic} mmHg`,
						40, y);
					y += 50;
					ctx.fillText(`${this.$t("总测量次数")}：${this.stats.totalCount}${this.$t("次")}`, 40, y);
					y += 50;
					ctx.fillText(
						`${this.$t("白天测量")}：${this.dayCount} ${this.$t("次")}  ${this.$t("夜间测量")}：${this.nightCount}${this.$t("次")}`,
						40, y);
					y += 70;

					// ========== 修复：极值记录 - 使用更大格子 ==========
					ctx.fillStyle = '#e74c3c';
					ctx.font = 'bold 32px sans-serif';
					ctx.fillText(`【${this.$t("极值记录")}】`, 40, y);
					y += 70;

					// 最高血压 - 增大格子高度和字体
					const boxHeight = 120; // 增大高度
					const boxWidth = (width - 90) / 2;

					ctx.setStrokeStyle('#ffcdd2');
					ctx.setLineWidth(2);
					ctx.setFillStyle('#fff5f5');
					ctx.fillRect(40, y - 20, boxWidth, boxHeight);
					ctx.strokeRect(40, y - 20, boxWidth, boxHeight);

					ctx.setFillStyle('#e74c3c');
					ctx.font = 'bold 24px sans-serif'; // 增大字体
					ctx.fillText(this.$t("最高血压"), 55, y + 15);
					ctx.font = 'bold 36px sans-serif'; // 更大字体显示数值
					ctx.fillText(`${this.stats.max.systolic}/${this.stats.max.diastolic}`, 55, y + 60);
					ctx.font = '20px sans-serif';
					ctx.fillText(this.stats.max.time || '-', 55, y + 20);

					// 最低血压
					const rightX = 50 + boxWidth;
					ctx.setStrokeStyle('#b3e0ff');
					ctx.setFillStyle('#f0f9ff');
					ctx.fillRect(rightX, y - 20, boxWidth, boxHeight);
					ctx.strokeRect(rightX, y - 20, boxWidth, boxHeight);

					ctx.setFillStyle('#3498db');
					ctx.font = 'bold 24px sans-serif';
					ctx.fillText(this.$t("最低血压"), rightX + 15, y + 15);
					ctx.font = 'bold 36px sans-serif';
					ctx.fillText(`${this.stats.min.systolic}/${this.stats.min.diastolic}`, rightX + 15, y + 60);
					ctx.font = '20px sans-serif';
					ctx.fillText(this.stats.min.time || '-', rightX + 15, y + 40);

					y += boxHeight + 40;

					// 7天数据分布
					ctx.fillStyle = '#1abc9c';
					ctx.font = 'bold 32px sans-serif';
					ctx.fillText(`【${this.$t("天数据分布7")}】`, 40, y);
					y += 60;
					ctx.fillStyle = '#333';
					ctx.font = '24px sans-serif';

					this.dailyStats.forEach(day => {
						ctx.fillText(
							`${day.date}  ${this.$t("平均")}：${day.avgSystolic}/${day.avgDiastolic}  ${this.$t("次数")}：${day.count}`,
							40, y);
						y += 45;
					});

					// 详细数据（显示全部）
					const displayData = this.monitorData;
					if (displayData.length > 0) {
						y += 30;
						ctx.fillStyle = '#f39c12';
						ctx.font = 'bold 32px sans-serif';
						ctx.fillText(`【${this.$t("详细监测数据")}】（${this.$t("共")}${displayData.length}${this.$t("条")}）`,
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
					ctx.fillText(`${this.$t("报告生成时间")}：${new Date().toLocaleString('zh-CN')}`, 40, y);
					y += 40;
					ctx.fillText(this.$t("本报告仅供参考不作为医疗诊断依据"), 40, y);

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

			// 替换 calculateCanvasHeight 方法
			calculateCanvasHeight() {
				let height = 200; // 顶部边距和标题

				// 基本信息区域
				height += 200;

				// 身体指标（新增）
				if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
					height += 100; // 标题
					if (this.userInfo.height) height += 50;
					if (this.userInfo.weight) height += 50;
					if (this.userInfo.waist) height += 50;
					if (this.request.bmi && this.request.bmi !== 'NA') height += 50;
					if (this.request.whtr && this.request.whtr !== 'NA') height += 50;
					height += 20;
				}

				// 用药信息（新增）
				if (this.userInfo.takingMedicine) {
					height += 100; // 标题+是否服药
					if (this.userInfo.takingMedicine === true) {
						if (this.userInfo.medicineType) height += 50;
						if (this.userInfo.medicineTime) height += 50;
						if (this.userInfo.diagnosisDate) height += 50;
					}
					height += 20;
				}

				// 睡眠数据
				height += 130;

				// 统计概览
				height += 250;

				// 极值记录（增大格子）
				height += 70 + 160 + 40; // 标题 + 增大后的格子高度 + 间距

				// 7天数据分布
				height += 100 + (this.dailyStats.length * 45);

				// 详细数据（显示全部）
				const dataCount = this.monitorData.length;
				if (dataCount > 0) {
					height += 150 + (dataCount * 45);
				}

				// 底部信息
				height += 150;

				return height;
			},
			onImageLoad(e) {
				this.imageHeight = e.detail.height;
				console.log('PDF图片加载完成，高度:', e.detail.height);

				// 如果图片高度异常，提示用户
				if (e.detail.height < 500) {
					uni.showToast({
						title: '图片生成可能不完整，请重试',
						icon: 'none'
					});
				}
			},
			onImageError(e) {
				console.error('图片加载失败', e);
				uni.showToast({
					title: '图片加载失败',
					icon: 'none'
				});
			},
			onScroll(e) {},
			closePDFPreview() {
				this.scrollTop = 0;
				this.showPDFPreview = false;
			},


			// 修改 printPDF 方法
			printPDF() {
				this.closeSharePopup();
				this.printDataList = this.monitorData;

				this.showPrintPreview = true;
			},

			closePrintPreview() {
				this.showPrintPreview = false;
			},
			// 执行打印（H5使用window.print，App使用原生打印）
			executePrint() {
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


			// App端打印实现
			printApp() {
				uni.showLoading({
					title: this.$t("准备分享"),
					mask: true
				});

				// 生成打印用的图片
				this.drawPrintCanvas().then(imagePath => {
					uni.hideLoading();

					// 使用plus.nativeObj.Bitmap加载图片并打印
					const bitmap = new plus.nativeObj.Bitmap('print_img');

					// 如果是base64
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
						// 如果是本地路径
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
				const tempPath = `_doc/${this.$t('天监测报告7')}${this.dundatetime()}.jpg`;

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
							`${this.$t('天监测报告7')}${this.dundatetime()}.pdf`);
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



			// 替换 drawPrintCanvas 方法
			drawPrintCanvas() {
				return new Promise((resolve, reject) => {
					const ctx = uni.createCanvasContext('shareCanvas', this);
					const width = 600;
					let contentHeight = this.calculatePrintHeight();
					const height = Math.max(contentHeight, 800);

					let y = 30;

					// 白色背景
					ctx.setFillStyle('#ffffff');
					ctx.fillRect(0, 0, width, height);

					// 标题
					ctx.setFillStyle('#333333');
					ctx.setFontSize(24);
					ctx.setTextAlign('center');
					ctx.fillText(this.$t("天监测报告7"), width / 2, y);
					y += 35;

					// 副标题
					ctx.setFontSize(12);
					ctx.fillText(
						`${this.$t("姓名")}：${this.userInfo.name} | ${this.$t("性别")}：${this.getsex(this.userInfo.gender)} | ${this.$t("年龄")}：${this.userInfo.age}${this.$t("岁")}`,
						width / 2, y);
					y += 20;

					ctx.setFontSize(10);
					ctx.setFillStyle('#666666');
					ctx.fillText(
						`${this.$t("监测时间")}：${this.monitorInfo.startTime} ${this.$t("至")} ${this.monitorInfo.endTime}`,
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

					// ========== 新增：身体指标 ==========
					if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
						ctx.setFillStyle('#9b59b6');
						ctx.setFontSize(14);
						ctx.setTextAlign('left');
						ctx.fillText(`【${this.$t("身体指标")}】`, 40, y);
						y += 25;
						ctx.setFillStyle('#333333');
						ctx.setFontSize(11);

						let infoX = 40;
						let infoCount = 0;
						const infoItems = [];
						if (this.userInfo.height) infoItems.push(
							`${this.$t("身高")}：${this.formatBodyHeight(this.userInfo.height)}`);
						if (this.userInfo.weight) infoItems.push(
							`${this.$t("体重")}：${this.formatBodyWeight(this.userInfo.weight)}`);
						if (this.userInfo.waist) infoItems.push(
							`${this.$t("腰围")}：${this.formatBodyHeight(this.userInfo.waist)}`);
						if (this.request.bmi && this.request.bmi !== 'NA') infoItems.push(
							`BMI：${this.request.bmi}`);
						// 每行显示2个
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

					// ========== 新增：用药信息 ==========
					if (this.userInfo.takingMedicine) {
						ctx.setFillStyle('#e67e22');
						ctx.setFontSize(14);
						ctx.fillText(`【${this.$t("用药信息")}】`, 40, y);
						y += 25;
						ctx.setFillStyle('#333333');
						ctx.setFontSize(11);
						ctx.fillText(
							`${this.$t("服用高血压药物")}：${this.userInfo.takingMedicine === true ? this.$t("是") : this.$t("否")}`,
							40, y);
						y += 20;

						if (this.userInfo.takingMedicine === true) {
							if (this.userInfo.medicineType) {
								ctx.fillText(`${this.$t("服药种类")}：${this.userInfo.medicineType}`, 40, y);
								y += 20;
							}
							if (this.userInfo.medicineTime) {
								ctx.fillText(`${this.$t("服药时间")}：${this.userInfo.medicineTime}`, 40, y);
								y += 20;
							}
							if (this.userInfo.diagnosisDate) {
								ctx.fillText(`${this.$t("确诊时间")}：${this.userInfo.diagnosisDate}`, 40, y);
								y += 20;
							}
						}
						y += 15;
					}

					// ========== 睡眠数据 ==========
					ctx.setFillStyle('#3498db');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t("睡眠数据")}】`, 40, y);
					y += 25;
					ctx.setFillStyle('#333333');
					ctx.setFontSize(11);
					if (this.hasSleepData) {
						ctx.fillText(`${this.$t("睡眠时间")}：${this.userInfo.sleepTime}`, 40, y);
					} else {
						ctx.fillText(this.$t('此用户未佩戴手表测量睡眠数据'), 40, y);
					}
					y += 30;

					// 统计概览标题
					ctx.setFillStyle('#667eea');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t("统计概览")}】`, 40, y);
					y += 25;

					// 统计数据网格
					ctx.setFillStyle('#333333');
					ctx.setFontSize(11);

					const stats = [{
							label: this.$t("天平均血压7"),
							value: `${this.stats.avg7d.systolic}/${this.stats.avg7d.diastolic} mmHg`
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
							label: this.$t("夜间测量"),
							value: `${this.nightCount} ${this.$t('次')} (${this.nightRatio}%)`
						}
					];

					const colWidth = (width - 80) / 2;
					const rowHeight = 45; // 增大高度

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
						ctx.setFontSize(13); // 增大数值字体
						ctx.fillText(stat.value, x + 5, sy + 18);
					});

					y += Math.ceil(stats.length / 2) * rowHeight + 20;

					// ========== 修复：极值记录 - 使用更大格子 ==========
					ctx.setFillStyle('#e74c3c');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t("极值记录")}】`, 40, y);
					y += 30;

					// 增大格子尺寸
					const extremeBoxHeight = 80; // 增大高度
					const extremeBoxWidth = (width - 90) / 2;

					// 最高血压
					ctx.setStrokeStyle('#ffcdd2');
					ctx.setLineWidth(2);
					ctx.setFillStyle('#fff5f5');
					ctx.fillRect(40, y - 20, extremeBoxWidth, extremeBoxHeight);
					ctx.strokeRect(40, y - 20, extremeBoxWidth, extremeBoxHeight);

					ctx.setFillStyle('#e74c3c');
					ctx.setFontSize(12);
					ctx.fillText(this.$t("最高血压"), 50, y);
					ctx.setFontSize(20); // 增大数值字体
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

					// 7天数据分布
					ctx.setFillStyle('#1abc9c');
					ctx.setFontSize(14);
					ctx.fillText(`【${this.$t("天数据分布7")}】`, 40, y);
					y += 20;

					// 表格头部
					ctx.setFillStyle('#f5f5f5');
					ctx.fillRect(40, y - 10, width - 80, 20);
					ctx.setStrokeStyle('#e0e0e0');
					ctx.strokeRect(40, y - 10, width - 80, 20);

					ctx.setFillStyle('#333333');
					ctx.setFontSize(9);
					const colWidths = [80, 60, 70, 70, 100];
					const headers = [this.$t("日期"), this.$t('次数'), this.$t('平均收缩压'), this.$t('平均舒张压'), this.$t(
						'收缩压范围')];
					let currentX = 45;

					headers.forEach((header, i) => {
						ctx.fillText(header, currentX, y + 3);
						currentX += colWidths[i];
					});

					y += 20;

					// 表格内容
					this.dailyStats.forEach((day, index) => {
						const rowY = y + index * 18;

						if (index % 2 === 1) {
							ctx.setFillStyle('#fafafa');
							ctx.fillRect(40, rowY - 8, width - 80, 18);
						}

						ctx.setStrokeStyle('#e0e0e0');
						ctx.strokeRect(40, rowY - 8, width - 80, 18);

						ctx.setFillStyle('#333333');
						ctx.setFontSize(9);

						let cellX = 45;
						const cells = [
							day.date,
							`${day.count}${this.$t('次')}`,
							String(day.avgSystolic),
							String(day.avgDiastolic),
							`${day.minSystolic}-${day.maxSystolic}`
						];

						cells.forEach((cell, i) => {
							ctx.fillText(cell, cellX, rowY + 3);
							cellX += colWidths[i];
						});
					});

					y += this.dailyStats.length * 18 + 20;

					// 详细数据（显示全部）
					if (this.monitorData.length > 0) {
						ctx.setFillStyle('#f39c12');
						ctx.setFontSize(14);
						ctx.fillText(
							`【${this.$t("详细监测数据")}】（${this.$t("共")}${this.monitorData.length}${this.$t("条")}）`,
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
					ctx.fillText(`${this.$t("报告生成时间")}：${this.currentDateTime}`, width / 2, y);
					y += 15;
					ctx.fillText(this.$t("本报告仅供参考不作为医疗诊断依据"), width / 2, y);

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

			// 替换 calculatePrintHeight 方法
			calculatePrintHeight() {
				let height = 200; // 头部区域

				// 身体指标（新增）
				if (this.userInfo.height || this.userInfo.weight || this.request.bmi !== 'NA') {
					height += 60;
					let infoCount = 0;
					if (this.userInfo.height) infoCount++;
					if (this.userInfo.weight) infoCount++;
					if (this.userInfo.waist) infoCount++;
					if (this.request.bmi && this.request.bmi !== 'NA') infoCount++;
					height += Math.ceil(infoCount / 2) * 25 + 30;
				}

				// 用药信息（新增）
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

				// 统计概览（增大格子）
				height += 30 + (2 * 45); // 2行，每行45高度

				// 极值记录（增大格子）
				height += 30 + 80 + 30; // 标题 + 增大后的80高度 + 间距

				// 7天数据分布表格
				height += 50 + (this.dailyStats.length * 18);

				// 详细数据表格（显示全部）
				const detailCount = this.monitorData.length;
				if (detailCount > 0) {
					height += 70 + (detailCount * 18);
				}

				// 底部边距
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
	};
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding-bottom: 40rpx;
	}

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

	.stats-section,
	.trend-section,
	.ratio-section,
	.extreme-section,
	.distribution-section,
	.setting-section,
	.detail-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.stats-title,
	.trend-title,
	.ratio-title,
	.extreme-title,
	.distribution-title,
	.setting-title,
	.detail-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 25rpx;
		padding-left: 20rpx;
		border-left: 8rpx solid #667eea;
	}

	.trend-title {
		border-left-color: #9b59b6;
	}

	.ratio-title {
		border-left-color: #764ba2;
	}

	.extreme-title {
		border-left-color: #e74c3c;
	}

	.distribution-title {
		border-left-color: #1abc9c;
	}

	.setting-title {
		border-left-color: #2ecc71;
	}

	.detail-title {
		border-left-color: #f39c12;
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

	.trend-content {
		.trend-chart {
			height: 400rpx;
			margin-bottom: 20rpx;

			.charts-box {
				width: 100%;
				height: 100%;
			}
		}

		.trend-summary {
			display: flex;
			gap: 20rpx;

			.trend-item {
				flex: 1;
				background: #f8f9fa;
				border-radius: 12rpx;
				padding: 20rpx;
				text-align: center;

				.trend-label {
					display: block;
					font-size: 24rpx;
					color: #666;
					margin-bottom: 10rpx;
				}

				.trend-value {
					display: block;
					font-size: 36rpx;
					font-weight: bold;
					margin-bottom: 5rpx;

					&.high {
						color: #e74c3c;
					}

					&.low {
						color: #3498db;
					}
				}

				.trend-date {
					display: block;
					font-size: 22rpx;
					color: #999;
				}
			}
		}
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

	.distribution-item {
		margin-bottom: 25rpx;
		padding-bottom: 25rpx;
		border-bottom: 1rpx solid #f0f0f0;

		&:last-child {
			margin-bottom: 0;
			padding-bottom: 0;
			border-bottom: none;
		}

		.day-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;

			.day-date {
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
			}

			.day-count {
				font-size: 24rpx;
				color: #667eea;
				background: #f0f0f0;
				padding: 4rpx 12rpx;
				border-radius: 20rpx;
			}
		}

		.day-stats {
			display: flex;
			gap: 20rpx;
			margin-bottom: 10rpx;

			.day-avg {
				font-size: 26rpx;
				color: #666;
			}

			.day-range {
				font-size: 24rpx;
				color: #999;

				&.high-variation {
					color: #e74c3c;
				}

				&.medium-variation {
					color: #f39c12;
				}

				&.low-variation {
					color: #2ecc71;
				}
			}
		}

		.day-bar {
			height: 12rpx;
			background: #e9ecef;
			border-radius: 6rpx;
			overflow: hidden;

			.day-progress {
				height: 100%;
				background: linear-gradient(90deg, #1abc9c, #16a085);
				border-radius: 6rpx;
				transition: width 0.5s ease;
			}
		}
	}

	.setting-content {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;

		.setting-item {
			background: #f8f9fa;
			border-radius: 10rpx;
			padding: 20rpx;

			&.wide {
				grid-column: span 2;
			}

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

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;

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

	.empty-tip {
		text-align: center;
		padding: 40rpx 0;
		color: #999;
		font-size: 28rpx;
	}

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

			&.export {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: #fff;
			}

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

	// 打印预览弹窗样式
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

				.print-stats-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 10px;
				}

				.print-stat-box {
					border: 1px solid #e0e0e0;
					padding: 10px;
					border-radius: 5px;
					text-align: center;

					.print-stat-label {
						font-size: 12px;
						color: #666;
						display: block;
					}

					.print-stat-value {
						font-size: 16px;
						font-weight: bold;
						color: #333;
						display: block;
						margin-top: 5px;
					}
				}

				.print-extreme-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 10px;
				}

				.print-extreme-box {
					border: 1px solid #e0e0e0;
					padding: 10px;
					border-radius: 5px;
					text-align: center;

					&.high {
						border-color: #ffcdd2;
						background: #fff5f5;
					}

					&.low {
						border-color: #b3e0ff;
						background: #f0f9ff;
					}

					.print-extreme-label {
						font-size: 12px;
						color: #666;
						display: block;
					}

					.print-extreme-value {
						font-size: 18px;
						font-weight: bold;
						display: block;
						margin: 5px 0;
					}

					&.high .print-extreme-value {
						color: #e74c3c;
					}

					&.low .print-extreme-value {
						color: #3498db;
					}

					.print-extreme-time {
						font-size: 11px;
						color: #999;
						display: block;
					}
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

		// 在 print-popup 样式中添加以下内容

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

		// 修复：增大的极值记录格子
		.print-extreme-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 15px;

			&.large {
				gap: 20px;
			}
		}

		.print-extreme-box {
			border: 2px solid #e0e0e0; // 增粗边框
			padding: 20px; // 增大内边距
			border-radius: 8px; // 增大圆角
			text-align: center;
			min-height: 120px; // 最小高度
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
				font-size: 14px; // 增大字体
				color: #666;
				display: block;
				margin-bottom: 10px;
				font-weight: bold;
			}

			.print-extreme-value {
				font-size: 28px; // 增大数值字体
				font-weight: bold;
				display: block;
				margin: 8px 0;

				&.large {
					font-size: 32px; // 更大字体
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
				font-size: 12px; // 增大字体
				color: #999;
				display: block;
				margin-top: 5px;
			}
		}

		// 统计概览格子增大
		.print-stats-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 15px;
		}

		.print-stat-box {
			border: 1px solid #e0e0e0;
			padding: 15px; // 增大内边距
			border-radius: 5px;
			text-align: center;
			min-height: 80px; // 最小高度
			display: flex;
			flex-direction: column;
			justify-content: center;

			.print-stat-label {
				font-size: 13px; // 增大字体
				color: #666;
				display: block;
				margin-bottom: 8px;
			}

			.print-stat-value {
				font-size: 18px; // 增大数值字体
				font-weight: bold;
				color: #333;
				display: block;
				margin-top: 5px;
			}
		}

	}

	// 修改 share-canvas 样式
	.share-canvas {
		position: fixed;
		left: -9999px;
		top: -9999px;
		width: 750px;
		// 移除固定高度，或者设置一个足够大的值
		min-height: 3000px; // 确保足够大以容纳所有内容
		// 或者使用动态高度
		height: auto;
	}
</style>