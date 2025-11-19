<template>
	<uni-popup ref="popup" :mask-click="false">
		<view class="bmi-popup-content">
			<view class="popup-title">{{$t("BMI分类")}}</view>
			<view class="popup-subtitle">{{$t("根据世界卫生组织的最新BMI分类")}}</view>

			<view class="bmi-classification">
				<view class="classification-header">
					<text class="header-cell">{{$t("BMI范围")}}</text>
					<text class="header-cell">{{$t("分类")}}</text>
				</view>

				<view class="classification-row underweight">
					<text class="range-cell">&lt;18.5</text>
					<text class="category-cell">{{$t("体重过轻")}}</text>
				</view>

				<view class="classification-row normal">
					<text class="range-cell">18.5-24.9</text>
					<text class="category-cell">{{$t("正常体重")}}</text>
				</view>

				<view class="classification-row overweight">
					<text class="range-cell">25.0-29.9</text>
					<text class="category-cell">{{$t("超重")}}</text>
				</view>

				<view class="classification-row obese1">
					<text class="range-cell">30.0-34.9</text>
					<text class="category-cell">{{$t("一级肥胖")}}</text>
				</view>

				<view class="classification-row obese2">
					<text class="range-cell">35.0-39.9</text>
					<text class="category-cell">{{$t("二级肥胖")}}</text>
				</view>

				<view class="classification-row obese3">
					<text class="range-cell">≥40</text>
					<text class="category-cell">{{$t("三级肥胖或病态肥胖")}}</text>
				</view>
			</view>

			<button class="confirm-btn" @tap="close">{{$t('知道了')}}</button>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		name: 'BmiPopup',
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
	.bmi-popup-content {
		border-radius: 20px;
		background: #fff;
		padding: 20px;
		width: 300px;
		text-align: center;
	}

	.popup-title {
		font-size: 16px;
		font-weight: bold;
		padding-top: 10px;
		margin-bottom: 5px;
	}

	.popup-subtitle {
		color: gray;
		font-size: 12px;
		margin-bottom: 20px;
	}

	.bmi-classification {
		margin: 10px 0;
	}

	.classification-header {
		display: flex;
		flex-direction: row;
		padding: 5px;
		align-items: center;
		margin: 0 10px;
		font-weight: bold;
	}

	.header-cell {
		width: 50%;
		text-align: center;
		font-size: 14px;
	}

	.classification-row {
		padding: 8px 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 5px 10px;
		border-radius: 5px;
		color: white;
		font-weight: bold;
	}

	.range-cell,
	.category-cell {
		width: 50%;
		text-align: center;
		font-size: 12px;
	}

	.underweight {
		background: #FCCD41;
	}

	.normal {
		background: #58BF78;
	}

	.overweight {
		background: #FC7F41;
	}

	.obese1 {
		background: #F55A5A;
	}

	.obese2 {
		background: #7A0101;
	}

	.obese3 {
		background: #333333;
	}

	.confirm-btn {
		display: flex;
		margin: 20px 50px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
		justify-content: center;
		border: none;
		height: 48px;
		align-items: center;

	}
</style>