<template>
	<view class="container">
		<view class="header">
			<text class="title">{{$t("个人基本资料报告")}}</text>
			<text class="subtitle">{{$t("请如实填写以下信息")}}</text>
		</view>

		<!-- 基本信息 -->
		<view class="section">
			<view class="section-title">{{$t("基本信息")}}</view>
			<view class="form-item">
				<text class="label">{{$t("姓名")}}：</text>
				<input class="input" v-model="form.name" :placeholder="$t('请输入姓名')" />
			</view>
			<view class="form-item">
				<text class="label">{{$t("性别")}}：</text>
				<radio-group class="radio-group" @change="handleGenderChange">
					<label class="radio-item">
						<radio :value="$t('男')" :checked="getsex(form.gender) === $t('男')" color="#007AFF" />
						<text>{{$t("男")}}</text>
					</label>
					<label class="radio-item">
						<radio :value="$t('女')" :checked="getsex(form.gender) === $t('女')" color="#007AFF" />
						<text>{{$t("女")}}</text>
					</label>
				</radio-group>
			</view>
			<view class="form-item">
				<text class="label">{{$t("年龄")}}：</text>
				<input class="input" type="number" v-model="form.age" :placeholder="$t('请输入年龄')" />
				<text class="unit">{{$t('岁')}}</text>
			</view>
		</view>

		<!-- 身体数据 -->
		<view class="section">
			<view class="section-title">{{$t('身体数据')}}</view>
			<view class="form-item">
				<text class="label">{{$t('身高')}}：</text>
				<input class="input" type="digit" v-model="form.height" @blur="calculateMetrics"
					:placeholder="$t('请输入身高')" />
				<text class="unit">{{heightunit}}</text>
			</view>
			<view class="form-item">
				<text class="label">{{$t('体重')}}：</text>
				<input class="input" type="digit" v-model="form.weight" @blur="calculateMetrics"
					:placeholder="$t('请输入体重')" />
				<text class="unit">{{weightunit}}</text>
			</view>
			<view class="form-item">
				<text class="label">{{$t('腰围')}}：</text>
				<input class="input" type="digit" v-model="form.waist" @blur="calculateMetrics"
					:placeholder="$t('请输入腰围')" />
				<text class="unit">{{heightunit}}</text>
			</view>
		</view>

		<!-- 计算指标 -->
		<view class="section" v-if="showMetrics">
			<view class="section-title">{{$t('健康指标自动计算')}}</view>
			<view class="metrics-box">
				<view class="metric-item">
					<text class="metric-label">{{$t('BMI指数')}}</text>
					<text class="metric-value" :class="getBmiClass">{{ bmi }}</text>
					<text class="metric-status">{{ bmiStatus }}</text>
				</view>
				<view class="metric-item">
					<text class="metric-label">{{$t('腰围身高比')}}</text>
					<text class="metric-value" :class="getWhtrClass">{{ whtr }}</text>
					<text class="metric-status">{{ whtrStatus }}</text>
				</view>
			</view>
		</view>

		<!-- 高血压信息 -->
		<view class="section">
			<view class="section-title">{{$t('高血压用药情况')}}</view>
			<view class="form-item">
				<text class="label_1">{{$t('是否服用高血压药物')}}：</text>
				<switch :checked="form.takingMedicine" @change="handleMedicineChange" color="#007AFF" />
			</view>

			<block v-if="form.takingMedicine">
				<view class="form-item">
					<text class="label">{{$t('服药种类')}}：</text>
					<textarea class="textarea" v-model="form.medicineType" :placeholder="$t('请填写药物名称如氨氯地平缬沙坦等')"
						auto-height />
				</view>
				<view class="form-item">
					<text class="label">{{$t('每天服药时间')}}：</text>
					<picker fields="month" mode="time" :value="form.medicineTime" @change="handleTimeChange">
						<view class="picker">
							{{ form.medicineTime || $t('请选择服药时间') }}
						</view>
					</picker>
				</view>
			</block>
		</view>

		<!-- 确诊时间 -->
		<view class="section">
			<view class="section-title">{{$t('高血压确诊时间')}}</view>
			<view class="form-item">
				<text class="label">{{$t('确诊日期')}}：</text>
				<picker fields="day" mode="date" :value="form.diagnosisDate" @change="handleDateChange">
					<view class="picker">
						{{ form.diagnosisDate || $t('请选择确诊日期') }}
					</view>
				</picker>
			</view>
			<view class="form-item" v-if="form.diagnosisDate">
				<text class="label">{{$t('确诊时长')}}：</text>
				<text class="duration-text">{{ diagnosisDuration }}</text>
			</view>
		</view>

		<!-- 睡眠时间 -->
		<view class="section">
			<view class="section-title">{{$t('睡眠数据')}}</view>
			<view class="form-item" v-if="hasSleepData">
				<text class="label">{{$t('睡眠时间')}}：</text>
				<text class="duration-text">{{ form.sleepTime }}</text>
			</view>
			<view class="sleep-empty-tip" v-else>
				<text>{{$t('此用户未佩戴手表测量睡眠数据')}}</text>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="button-group">
			<button class="btn-submit" @click="submitForm">{{$t('提交并保存')}}</button>
			<button class="btn-reset" @click="resetForm">{{$t('重置')}}</button>
		</view>

		<!-- 数据预览 -->
		<view class="preview-section" v-if="showPreview">
			<view class="section-title">{{$t('报告预览')}}</view>
			<view class="preview-content">
				<text class="preview-text">{{ previewContent }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import WeightConverter from '../../../api/unitls/weightConverter.js';
	export default {
		data() {
			return {
				form: {
					name: '',
					gender: '',
					age: '',
					height: '',
					weight: '',
					waist: '',
					takingMedicine: false,
					medicineType: '',
					medicineTime: '',
					diagnosisDate: '',
					heightunit: '',
					weightunit: '',
					sleepTime: '',
				},
				heightunit: uni.getStorageSync("danwei1") === 0 ? this.$t("英寸") : this.$t("厘米"),
				weightunit: uni.getStorageSync("danwei2") === 1 ? this.$t("英镑") : this.$t("千克"),
				bmi: 0,
				whtr: 0,
				bmiStatus: '',
				whtrStatus: '',
				showMetrics: false,
				showPreview: false,
				storageKey: 'userHealthReport', // 本地存储的key
				type: "",
			}
		},
		onLoad(option) {
			console.log("onLoad", option)
			this.type = option.type
			// 页面加载时读取本地存储的数据
			this.loadFromStorage()
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("个人信息")
			})
			that.refreshDisplayUnits()
			that.loadSleepData()
			that.$get(that.$url_APP_IP + that.$url_getInfo, {}, {
				'Authorization': 'Bearer ' + uni.getStorageSync("token"),
				'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
			}).then(getInfo => {
				if (getInfo.code === 200) {
					if (!that.form.gender) {
						that.form.gender = getInfo.data.sex === '0' ? that.getsex(that.$t('男')) : that.getsex(that
							.$t('女'))
					}
					if (!that.form.height) {
						that.form.height = that.isImperialHeight() ?
							WeightConverter.cmToInch(getInfo.data.height) : getInfo.data.height
					}
					if (!that.form.weight) {
						that.form.weight = that.isImperialWeight() ?
							WeightConverter.kgToLb(getInfo.data.weight) : getInfo.data.weight
					}
					that.syncBodyValuesToCurrentUnits()
					if (!that.form.age) {
						const birth = new Date(getInfo.data.birthTime);
						const today = new Date();
						let age = today.getFullYear() - birth.getFullYear();
						const monthDiff = today.getMonth() - birth.getMonth();
						if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
							age--;
						}
						that.form.age = age;
					}
					that.calculateMetrics()
				} else {
					uni.showToast({
						title: getInfo.msg,
						icon: 'none'
					})
				}
			})
		},
		computed: {
			hasSleepData() {
				const sleepTime = this.form.sleepTime
				if (!sleepTime) return false
				const invalidValues = ['-/-', '--/--', '0H0M', '0h0m']
				return !invalidValues.includes(String(sleepTime).trim())
			},
			getBmiClass() {
				if (this.bmi < 18.5) return 'underweight'
				if (this.bmi < 24) return 'normal'
				if (this.bmi < 28) return 'overweight'
				return 'obese'
			},
			getWhtrClass() {
				const threshold = this.form.gender === this.$t('女') ? 0.5 : 0.5
				return this.whtr < threshold ? 'normal' : 'risk'
			},
			diagnosisDuration() {
				if (!this.form.diagnosisDate) return ''
				const diagnosis = new Date(this.form.diagnosisDate)
				const now = new Date()
				const diffTime = Math.abs(now - diagnosis)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
				const years = Math.floor(diffDays / 365)
				const months = Math.floor((diffDays % 365) / 30)

				if (years > 0) {
					return `${years}${this.$t('年')}${months}${this.$t('个月')}`
				} else if (months > 0) {
					return `${months}${this.$t('个月')}`
				} else {
					return `${diffDays}${this.$t('天')}`
				}
			},
			previewContent() {
				let content = `${this.$t('个人健康报告')}\n\n`
				content += `${this.$t('姓名')}：${this.form.name || this.$t('未填写')}\n`
				content +=
					`${this.$t('性别')}：${this.form.gender || this.$t('未填写')}  ${this.$t('年龄')}：${this.form.age || this.$t('未填写')}${this.$t('岁')}\n\n`
				content +=
					`${this.$t('身高')}：${this.form.height || this.$t('未填写')}${this.heightunit}  ${this.$t('体重')}：${this.form.weight || this.$t('未填写')}${this.weightunit}\n`
				content += `${this.$t('腰围')}：${this.form.waist || this.$t('未填写')}${this.heightunit}\n\n`

				if (this.showMetrics) {
					content += `BMI：${this.bmi}（${this.bmiStatus}）\n`
					content += `${this.$t('腰围身高比')}：${this.whtr}（${this.whtrStatus}）\n\n`
				}

				content += `${this.$t('高血压用药')}：${this.form.takingMedicine ? this.$t('是') : this.$t('否')}\n`
				if (this.form.takingMedicine) {
					content += `${this.$t('药物种类')}：${this.form.medicineType || this.$t('未填写')}\n`
					content += `${this.$t('服药时间')}：${this.form.medicineTime || this.$t('未填写')}\n`
				}
				content += `\n${this.$t("确诊时间")}：${this.form.diagnosisDate || this.$t('未填写')}`
				if (this.form.diagnosisDate) {
					content += `（${this.diagnosisDuration}）`
				}
				content += `\n${this.$t('睡眠时间')}：${this.hasSleepData ? this.form.sleepTime : this.$t('此用户未佩戴手表测量睡眠数据')}`

				return content
			}
		},
		methods: {

			getsex(sex) {
				if (sex === "男" || sex === "Male") {
					return this.$t("男")
				} else if (sex === "女" || sex === "Female") {
					return this.$t("女")
				}
			},
			findRegisterValue(arr, key, value) {
				if (!Array.isArray(arr)) return null
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] == value) {
						return arr[i]
					}
				}
				return null
			},
			loadSleepData() {
				const data = {
					userId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_APP_IP + this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code == 200) {
						const sleepEntry = this.findRegisterValue(res.data, 'register', 'sleep')
						const sleepVal = sleepEntry && sleepEntry.registerVal != null ? String(sleepEntry.registerVal).trim() : ''
						const invalidValues = ['', '-/-', '--/--', '0H0M', '0h0m']
						if (!sleepVal || invalidValues.includes(sleepVal)) {
							this.form.sleepTime = ''
						} else {
							this.form.sleepTime = sleepVal
						}
					} else {
						this.form.sleepTime = ''
					}
				}).catch(() => {
					this.form.sleepTime = ''
				})
			},
			isImperialHeight() {
				return uni.getStorageSync("danwei1") === 0
			},
			isImperialWeight() {
				return uni.getStorageSync("danwei2") === 1
			},
			isImperialHeightLabel(unitLabel) {
				if (unitLabel === 0 || unitLabel === '0') return true
				if (unitLabel === 1 || unitLabel === '1') return false
				const metricLabels = ['cm', '厘米', this.$t('厘米')]
				return !metricLabels.includes(unitLabel)
			},
			isImperialWeightLabel(unitLabel) {
				if (unitLabel === 1 || unitLabel === '1') return true
				if (unitLabel === 0 || unitLabel === '0') return false
				const metricLabels = ['kg', '千克', this.$t('千克')]
				return !metricLabels.includes(unitLabel)
			},
			refreshDisplayUnits() {
				this.heightunit = this.isImperialHeight() ? this.$t("英寸") : this.$t("厘米")
				this.weightunit = this.isImperialWeight() ? this.$t("英镑") : this.$t("千克")
			},
			convertBodyValueToCurrentUnit(field) {
				const value = parseFloat(this.form[field])
				if (!value || value <= 0) return false

				if (field === 'weight') {
					const savedIsImperial = this.isImperialWeightLabel(this.form.weightunit)
					const currentIsImperial = this.isImperialWeight()
					if (savedIsImperial === currentIsImperial) return false
					this.form[field] = savedIsImperial ?
						WeightConverter.lbToKg(value) :
						WeightConverter.kgToLb(value)
					this.form.weightunit = this.weightunit
					return true
				}

				const savedIsImperial = this.isImperialHeightLabel(this.form.heightunit)
				const currentIsImperial = this.isImperialHeight()
				if (savedIsImperial === currentIsImperial) return false
				this.form[field] = savedIsImperial ?
					WeightConverter.inchToCm(value) :
					WeightConverter.cmToInch(value)
				if (field === 'height') {
					this.form.heightunit = this.heightunit
				}
				return true
			},
			syncBodyValuesToCurrentUnits() {
				this.refreshDisplayUnits()
				this.convertBodyValueToCurrentUnit('height')
				this.convertBodyValueToCurrentUnit('weight')
				this.convertBodyValueToCurrentUnit('waist')
				this.form.heightunit = this.heightunit
				this.form.weightunit = this.weightunit
			},
			toMetricBodyValues() {
				let height = parseFloat(this.form.height)
				let weight = parseFloat(this.form.weight)
				let waist = parseFloat(this.form.waist)

				if (this.isImperialHeight() && height > 0) {
					height = WeightConverter.inchToCm(height)
				}
				if (this.isImperialWeight() && weight > 0) {
					weight = WeightConverter.lbToKg(weight)
				}
				if (this.isImperialHeight() && waist > 0) {
					waist = WeightConverter.inchToCm(waist)
				}

				return {
					height,
					weight,
					waist
				}
			},

			// 从本地存储加载数据
			loadFromStorage() {
				try {
					const savedData = uni.getStorageSync(this.storageKey)
					if (savedData) {
						// 合并保存的数据到form
						this.form = Object.assign({}, this.form, savedData)
						this.syncBodyValuesToCurrentUnits()

						// 如果有身高体重数据，自动计算指标
						if (this.form.height && this.form.weight) {
							this.calculateMetrics()
						}
					}
				} catch (e) {
					console.error('读取本地数据失败：', e)
				}
			},

			// 保存到本地存储
			saveToStorage() {
				try {
					uni.setStorageSync(this.storageKey, this.form)
					console.log('数据已保存到本地')
					return true
				} catch (e) {
					console.error('保存到本地失败：', e)
					uni.showToast({
						title: this.$t('保存失败'),
						icon: 'none'
					})
					return false
				}
			},

			// 清除本地存储
			clearStorage() {
				try {
					uni.removeStorageSync(this.storageKey)
					console.log('本地数据已清除')
				} catch (e) {
					console.error('清除本地数据失败：', e)
				}
			},

			handleGenderChange(e) {
				this.form.gender = e.detail.value
				this.calculateMetrics()
			},
			handleMedicineChange(e) {
				this.form.takingMedicine = e.detail.value
			},
			handleTimeChange(e) {
				this.form.medicineTime = e.detail.value
			},
			handleDateChange(e) {
				this.form.diagnosisDate = e.detail.value
			},

			calculateMetrics() {
				this.refreshDisplayUnits()
				const {
					height,
					weight,
					waist
				} = this.toMetricBodyValues()

				if (height > 0 && weight > 0) {
					// BMI = 体重(kg) / 身高(m)²
					const heightInM = height / 100
					this.bmi = (weight / (heightInM * heightInM)).toFixed(1)

					// 判断BMI状态（中国标准）
					if (this.bmi < 18.5) {
						this.bmiStatus = this.$t('体重过轻')
					} else if (this.bmi < 24) {
						this.bmiStatus = this.$t('正常范围')
					} else if (this.bmi < 28) {
						this.bmiStatus = this.$t('超重')
					} else {
						this.bmiStatus = this.$t('肥胖')
					}

					this.showMetrics = true
				} else {
					this.showMetrics = false
				}

				if (waist > 0 && height > 0) {
					// 腰围身高比 = 腰围(cm) / 身高(cm)
					this.whtr = (waist / height).toFixed(2)

					// 判断腰围身高比状态（亚洲标准：0.5为界限）
					if (this.whtr < 0.5) {
						this.whtrStatus = this.$t('正常范围')
					} else {
						this.whtrStatus = this.$t('代谢风险')
					}
				}
			},

			submitForm() {
				// 表单验证
				if (!this.form.name) {
					uni.showToast({
						title: this.$t('请输入姓名'),
						icon: 'none'
					})
					return
				}
				if (!this.form.gender) {
					uni.showToast({
						title: this.$t('请选择性别'),
						icon: 'none'
					})
					return
				}
				if (!this.form.age) {
					uni.showToast({
						title: this.$t('请输入年龄'),
						icon: 'none'
					})
					return
				}
				this.refreshDisplayUnits()
				this.form.heightunit = this.heightunit
				this.form.weightunit = this.weightunit
				// 保存到本地存储
				const saveSuccess = this.saveToStorage()

				if (saveSuccess) {
					// this.showPreview = true
					uni.showToast({
						title: this.$t('保存成功'),
						icon: 'none'
					})
				}

				// 控制台输出
				console.log('提交的数据：', this.form)
				console.log('计算指标：', {
					bmi: this.bmi,
					whtr: this.whtr
				})
				let request = {
					type: this.type,
					bmi: this.bmi,
					whtr: this.whtr
				}
				switch (this.type) {
					case "7":
						uni.navigateTo({
							url: `../../main/globalweather/day_monitoring_report_7?request=${JSON.stringify(request)}&form=${JSON.stringify(this.form)}`
						})
						break
					case "24":
						uni.navigateTo({
							url: `../../main/globalweather/hour_monitoring_report_24?request=${JSON.stringify(request)}&form=${JSON.stringify(this.form)}`
						})
						break
				}
			},

			resetForm() {
				uni.showModal({
					title: this.$t('确认重置'),
					content: this.$t('确定要清空所有数据吗这将同时删除本地保存的数据'),
					success: (res) => {
						if (res.confirm) {
							// 清除本地存储
							this.clearStorage()
							// 重置表单数据
							this.form = {
								name: '',
								gender: '',
								age: '',
								height: '',
								weight: '',
								waist: '',
								takingMedicine: false,
								medicineType: '',
								medicineTime: '',
								diagnosisDate: '',
								heightunit: "",
								weightunit: "",
								sleepTime: '',
							}
							this.bmi = 0
							this.whtr = 0
							this.showMetrics = false
							this.showPreview = false
							this.loadSleepData()
							uni.showToast({
								title: this.$t('已重置'),
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		padding: 40rpx 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
		display: block;
	}

	.subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-top: 10rpx;
		display: block;
	}

	.section {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
		padding-left: 20rpx;
		border-left: 8rpx solid #007AFF;
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		flex-wrap: wrap;
	}

	.form-item:last-child {
		margin-bottom: 0;
	}

	.label {
		font-size: 30rpx;
		color: #555;
		font-weight: 500;
	}

	.label_1 {
		width: 70vw;
		font-size: 30rpx;
		color: #555;
		font-weight: 500;
	}

	.input {
		flex: 1;
		height: 80rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 30rpx;
		margin-left: 10px;
		background-color: #fafafa;
		min-width: 200rpx;
	}

	.unit {
		margin-left: 15rpx;
		font-size: 28rpx;
		color: #666;
		width: 80rpx;
	}

	.radio-group {
		display: flex;
		flex: 1;
	}

	.radio-item {
		display: flex;
		align-items: center;
		margin-right: 40rpx;
		font-size: 30rpx;
		color: #333;
	}

	.radio-item radio {
		transform: scale(0.8);
		margin-right: 10rpx;
	}

	.textarea {
		flex: 1;
		min-height: 120rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 12rpx;
		padding: 20rpx;
		font-size: 30rpx;
		background-color: #fafafa;
		width: 100%;
		margin-top: 15rpx;
	}

	.picker {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 30rpx;
		color: #333;
		background-color: #fafafa;
	}

	.duration-text {
		flex: 1;
		margin-left: 20px;
		font-size: 30rpx;
		color: #007AFF;
		font-weight: bold;
	}

	.sleep-empty-tip {
		background-color: #fff7e6;
		border: 2rpx solid #ffd591;
		border-radius: 12rpx;
		padding: 24rpx;
		font-size: 28rpx;
		color: #d48806;
		line-height: 1.6;
	}

	.metrics-box {
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
	}

	.metric-item {
		flex: 1;
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 30rpx;
		text-align: center;
		border: 2rpx solid #e9ecef;
	}

	.metric-label {
		font-size: 28rpx;
		color: #666;
		display: block;
		margin-bottom: 15rpx;
	}

	.metric-value {
		font-size: 48rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}

	.metric-status {
		font-size: 26rpx;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
		display: inline-block;
	}

	/* BMI状态颜色 */
	.underweight {
		color: #3498db;
	}

	.normal {
		color: #27ae60;
	}

	.overweight {
		color: #f39c12;
	}

	.obese {
		color: #e74c3c;
	}

	.risk {
		color: #e74c3c;
	}

	.underweight+.metric-status {
		background-color: #ebf5fb;
		color: #3498db;
	}

	.normal+.metric-status {
		background-color: #eafaf1;
		color: #27ae60;
	}

	.overweight+.metric-status {
		background-color: #fef5e7;
		color: #f39c12;
	}

	.obese+.metric-status {
		background-color: #fdedec;
		color: #e74c3c;
	}

	.risk+.metric-status {
		background-color: #fdedec;
		color: #e74c3c;
	}

	.button-group {
		display: flex;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.btn-submit {
		flex: 2;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 12rpx;
		font-size: 32rpx;
		height: 90rpx;
		line-height: 90rpx;
		border: none;
	}

	.btn-reset {
		flex: 1;
		background-color: #95a5a6;
		color: white;
		border-radius: 12rpx;
		font-size: 32rpx;
		height: 90rpx;
		line-height: 90rpx;
		border: none;
	}

	.preview-section {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 50rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.preview-content {
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 30rpx;
		border: 2rpx dashed #dee2e6;
	}

	.preview-text {
		font-size: 28rpx;
		color: #495057;
		line-height: 1.8;
		white-space: pre-wrap;
		font-family: monospace;
	}

	/* 响应式调整 */
	@media (max-width: 375px) {
		.label {
			width: 180rpx;
			font-size: 28rpx;
		}

		.input,
		.picker {
			height: 70rpx;
			font-size: 28rpx;
		}
	}
</style>