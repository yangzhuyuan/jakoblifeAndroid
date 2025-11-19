<template>
	<uni-popup ref="popup" :mask-click="false">
		<view class="popup-content">
			<view class="popup-title">{{$t("血压分类")}}</view>
			<view class="popup-subtitle">{{$t("根据WHOISH的血压分类2020年修订版")}}</view>

			<view class="classification-table">
				<view class="table-header">
					<text class="header-cell">{{$t("血压类别")}}</text>
					<text class="header-cell">{{$t("收缩压")}}</text>
					<text class="header-cell">{{$t("和或")}}</text>
					<text class="header-cell">{{$t("舒张压")}}</text>
				</view>

				<view class="table-row normal">
					<text class="cell">{{$t("正常血压")}}</text>
					<text class="cell">91-120</text>
					<text class="cell">{{$t("和")}}</text>
					<text class="cell">61-80</text>
				</view>

				<view class="table-row high-normal">
					<text class="cell">{{$t("正常高血压值")}}</text>
					<text class="cell">121-140</text>
					<text class="cell">{{$t("或")}}</text>
					<text class="cell">81-90</text>
				</view>

				<view class="table-row stage1">
					<text class="cell">{{$t("一级高血压")}}</text>
					<text class="cell">141-160</text>
					<text class="cell">{{$t("或")}}</text>
					<text class="cell">91-100</text>
				</view>

				<view class="table-row stage2">
					<text class="cell">{{$t("二级高血压")}}</text>
					<text class="cell">161-180</text>
					<text class="cell">{{$t("或")}}</text>
					<text class="cell">101-110</text>
				</view>
			</view>

			<button class="confirm-btn" @tap="close">{{$t('知道了')}}</button>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		name: 'BloodPressurePopup',
		methods: {
			open() {
				this.$refs.popup.open('center');
			},
			close() {
				this.$refs.popup.close();
			}
		}
	}
</script>

<style scoped>
	.popup-content {
		border-radius: 20px;
		background: #fff;
		padding: 20px;
		width: 280px;
		text-align: center;
	}

	.popup-title {
		font-size: 17px;
		font-weight: 600;
		margin-bottom: 10px;
	}

	.popup-subtitle {
		font-size: 14px;
		font-weight: 400;
		color: #999999;
		margin-bottom: 20px;
	}

	.classification-table {
		margin-bottom: 20px;
	}

	.table-header {
		background: #222328;
		color: white;
		padding: 10px;
		display: flex;
		border-radius: 5px 5px 0 0;
	}

	.header-cell {
		flex: 1;
		text-align: center;
		font-size: 12px;
	}

	.table-row {
		padding: 10px;
		display: flex;
		align-items: center;
	}

	.table-row.normal {
		background: #A6CE39;
	}

	.table-row.high-normal {
		background: #FFEC01;
	}

	.table-row.stage1 {
		background: #FFB602;
	}

	.table-row.stage2 {
		background: #BB3A01;
	}

	.cell {
		flex: 1;
		text-align: center;
		font-size: 12px;
	}

	.confirm-btn {
		width: 120px;
		height: 48px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
		border: none;
	}
</style>