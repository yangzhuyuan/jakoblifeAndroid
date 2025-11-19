<template>
	<uni-popup ref="popup" :mask-click="true">
		<view class="export-popup-content">
			<view class="popup-title">{{$t('导出设置')}}</view>

			<!-- 导出格式选择 -->
			<view class="setting-section">
				<view class="section-title">{{$t('导出格式')}}</view>
				<view class="format-options">
					<label class="format-option">
						<checkbox class="format-checkbox" color="#ffffff" activeBorderColor="#D2D2D2"
							activeBackgroundColor="#3298F7" :checked="exportFormat === 'pdf'"
							@click="setExportFormat('pdf')" />
						<text class="format-label">PDF</text>
					</label>

					<label class="format-option">
						<checkbox class="format-checkbox" color="#ffffff" activeBorderColor="#D2D2D2"
							activeBackgroundColor="#3298F7" :checked="exportFormat === 'excel'"
							@click="setExportFormat('excel')" />
						<text class="format-label">Excel</text>
					</label>
				</view>
			</view>

			<!-- 时间范围选择 -->
			<view class="setting-section">
				<view class="section-header">
					<view class="section-title">{{$t('测量时间')}}</view>
					<view class="time-note" :class="{ 'time-error': !isTimeValid }">
						{{$t('注1')}}
					</view>
				</view>

				<view class="time-picker">
					<view class="picker-item">
						<text class="picker-label">{{$t('开始日期')}}</text>
						<picker fields="day" mode="date" :value="startDate" :start="minDate" :end="maxDate"
							@change="onStartDateChange">
							<view class="picker-value">
								<text>{{ startDate }}</text>
								<uni-icons type="right" size="16"></uni-icons>
							</view>
						</picker>
					</view>

					<view class="picker-item">
						<text class="picker-label">{{$t('结束日期')}}</text>
						<picker fields="day" mode="date" :value="endDate" :start="minDate" :end="maxDate"
							@change="onEndDateChange">
							<view class="picker-value">
								<text>{{ endDate }}</text>
								<uni-icons type="right" size="16"></uni-icons>
							</view>
						</picker>
					</view>
				</view>
			</view>

			<!-- 导出按钮 -->
			<button class="export-btn" @click="handleExport">
				{{$t('仅导出测量数据')}}
			</button>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		name: 'ExportPopup',
		data() {
			const today = new Date();
			const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
			const minDate = this.formatDate(new Date(2020, 0, 1)); // 设置最小日期为2020-01-01
			const maxDate = this.formatDate(nextYear);

			return {
				exportFormat: 'pdf',
				startDate: today.toISOString().slice(0, 10),
				endDate: nextYear.toISOString().slice(0, 10),
				minDate: minDate,
				maxDate: maxDate
			}
		},

		computed: {
			isTimeValid() {
				const start = new Date(this.startDate);
				const end = new Date(this.endDate);
				const diffTime = Math.abs(end - start);
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

				return diffDays <= 365 && end >= start;
			}
		},

		methods: {
			// 格式化日期为 YYYY-MM-DD
			formatDate(date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},

			open() {
				this.$refs.popup.open('bottom');
				this.resetForm();
			},

			close() {
				this.$refs.popup.close();
			},

			resetForm() {
				const today = new Date();
				const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

				this.startDate = this.formatDate(today);
				this.endDate = this.formatDate(nextYear);
				this.exportFormat = 'pdf';
			},

			setExportFormat(format) {
				this.exportFormat = format;
			},

			onStartDateChange(e) {
				this.startDate = e.detail.value;
			},

			onEndDateChange(e) {
				this.endDate = e.detail.value;
			},

			handleExport() {
				if (!this.isTimeValid) {
					uni.showToast({
						title: this.$t("导出的数据时间不能超过一年"),
						icon: 'none'
					});
					return;
				}

				const exportConfig = {
					format: this.exportFormat,
					startDate: this.startDate + " 00:00:00",
					endDate: this.endDate + " 23:59:59"
				};

				this.$emit('export', exportConfig);
				this.close();
			}
		}
	}
</script>

<style scoped>
	.export-popup-content {
		border-radius: 17px 17px 0 0;
		background: #fff;
		margin: 0 20px;
		padding: 20px;
		padding-bottom: 40px;
	}

	.popup-title {
		font-size: 16px;
		font-weight: 600;
		color: #1A1A1A;
		text-align: center;
		margin-bottom: 20px;
	}

	.setting-section {
		margin-bottom: 25px;
	}

	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: #1A1A1A;
		margin-bottom: 15px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.time-note {
		color: gray;
		font-size: 10px;
		font-weight: 400;
		margin-bottom: 15px;
	}

	.time-error {
		color: red;
	}

	.format-options {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 40px;
	}

	.format-option {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.format-label {
		font-size: 14px;
	}

	.format-checkbox {
		transform: scale(0.9);
	}

	.time-picker {
		background: #f8f8f8;
		border-radius: 10px;
		padding: 15px;
	}

	.picker-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.picker-item:last-child {
		margin-bottom: 0;
	}

	.picker-label {
		font-size: 16px;
		font-weight: 400;
		color: #1A1A1A;
	}

	.picker-value {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
		color: #666;
		padding: 8px;
		border-radius: 6px;
		min-width: 100px;
		justify-content: space-between;
	}

	.export-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 48px;
		border-radius: 100px;
		background: #3298F7;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border: none;
		margin-top: 20px;
	}
</style>