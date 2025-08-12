<template>
	<view style="color: black;height: 100vh;background: #EFEFF4;">
		<view class="list-container">
			<view v-for="(item, index) in list" :key="index" @click="dianji(index, item.checkbox)">
				<view class="list-item">
					<view style="position: relative;top:-15px; left: 95%;">
						<image v-if="item.checkbox === true" src="../../../static/icons/check_true.png"
							class="img_style" />
						<image v-else src="../../../static/icons/check_false.png" class="img_style" />
					</view>
					<view class="data_item_bgsss">
						<view class="icon_bgsss">
							<image :src="item.image" class="img_stylesss" mode="aspectFit" />
							<text class="icon_text_bgsss">{{item.title}}</text>
						</view>
						<view
							style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;flex: 2;">
							<view v-if="item.bmi_show">
								<view
									style="display: flex; flex-direction: row;align-items: center; justify-content: flex-end;">
									<view
										style="color: black;font-size: 12px;white-space: nowrap;text-overflow: ellipsis;overflow: auto;">
										{{item.BMI_ys}}
									</view>
									<uni-icons type="help" size="15" @tap="BMI_tap(item.title)"></uni-icons>
								</view>
							</view>
							<view
								style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end;">
								<view v-if="item.bmi_show">
									<view v-if="item.BMI_TF == 0">
										<view style="width: 10px; height:10px;background: #FCCD41;border-radius: 50px;">
										</view>
									</view>
									<view v-else-if="item.BMI_TF ==1"
										style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
										<view style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
										</view>
									</view>
									<view v-else-if="item.BMI_TF ==2"
										style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
										<view style="width: 10px; height:10px;background: #FC7F41;border-radius: 50px;">
										</view>
									</view>
									<view v-else-if="item.BMI_TF ==3"
										style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
										<view style="width: 10px; height:10px;background: #F55A5A;border-radius: 50px;">
										</view>
									</view>
									<view v-else-if="item.BMI_TF ==4"
										style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
										<view style="width: 10px; height:10px;background: #7A0101;border-radius: 50px;">
										</view>
									</view>
									<view v-else-if="item.BMI_TF ==10"
										style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
										<view style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
										</view>
									</view>
									<view v-else
										style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
										<view style="width: 10px; height:10px;background: #333333;border-radius: 50px;">
										</view>
									</view>
								</view>
								<text
									style="text-align: right;font-size: 16px;margin-left: 10px;">{{item.Step_number}}</text>
							</view>
							<text style="text-align: right;color: gray;font-size: 10px;">{{item.type_LX}}</text>
							<text style="text-align: right;font-size: 13px;">{{item.Step_count}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="position: fixed;bottom: 0; width: 100vw;">
			<button class="button_bg_color" @click="turess()">{{$t('确认')}}</button>
		</view>
		<!-- 血氧 -->
		<view>
			<uni-popup ref="popup2" :mask-click="false">
				<view
					style="background: #FFFFFF; border-radius: 24px; width: 90vw; padding-bottom: 20px;  margin: 0 10vw 0 10vw;">
					<view style="padding: 20px; ">
						<view style="font-weight: bold;padding-top: 20px;font-size: 16px; text-align: center;">
							{{$t('血氧分类')}}
						</view>
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
							<view style="width: 80px;height: 10px;">{{$t('偏低')}}</view>
							<view style="width: 80px;height: 10px;">{{$t('正常')}}</view>
							<view style="width: 80px;height: 10px;">{{$t('偏高')}}</view>
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧1')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧2')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧3')}}
						</view>
					</view>
					<button @tap="knowe2()"
						style="width: 120px; height:48px; display: flex;justify-content: center;align-items: center; border-radius: 100px;background: #3298F7;color: white;">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						bmi_show: false,
						image: "../../../static/icons/1.png",
						Step_number: "-",
						title: this.$t('步数'),
						type_LX: this.$t('计步'),
						Step_count: "-",
						checkbox: false,

					}, {
						bmi_show: false,
						image: "../../../static/icons/2.png",
						Step_number: "-",
						title: this.$t('身高'),
						type_LX: "cm",
						Step_count: "-",
						checkbox: false,
					},
					{
						BMI_TF: 0,
						BMI_ys: "-",
						bmi_show: true,
						image: "../../../static/page_icon/10.png",
						Step_number: "-",
						title: this.$t('血氧'),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/9.png",
						Step_number: "-",
						title: this.$t("体温"),
						type_LX: "℃",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/9.png",
						Step_number: "-",
						title: this.$t("压力"),
						type_LX: "--",
						Step_count: "-",
						checkbox: false,
					}
				],
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("编辑数据卡片")
			})
			// 获取存储的卡片列表
			const kapianlist = uni.getStorageSync('kapianlist');
			if (kapianlist && kapianlist.length > 0) {
				// 遍历存储的卡片列表
				kapianlist.forEach(item => {
					// 找到匹配的卡片并移除
					const index = this.list.findIndex(listItem => listItem.title === item.title);
					if (index !== -1) {
						this.list.splice(index, 1);
					}
				});
			}
			// 调用相关方法
			this.list_recipe();
		},


		methods: {
			//点击选择卡片
			dianji(id, checkid) {
				if (checkid == true) {
					this.list[id].checkbox = false
				} else {
					this.list[id].checkbox = true
				}
			},
			//确认卡片
			turess() {
				// 获取本地存储的卡片列表
				let list2 = uni.getStorageSync("kapianlist") || [];
				// 筛选出当前列表中选中的项
				let list1 = this.list.filter(item => item.checkbox);
				// 合并两个列表
				let newarr = list2.concat(list1);
				// 更新本地存储
				uni.setStorageSync("kapianlist", newarr);
				// 返回上一页
				uni.navigateBack();
			},
			//血氧弹窗点击按钮
			BMI_tap(title) {
				this.$refs.popup2.open("center")
			},
			//关闭血氧弹窗按钮
			knowe2() {
				this.$refs.popup2.close()
			},
			//设备数据概览
			list_recipe() {
				const data = {
					userId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						for (let i = 0; i < this.list.length; i++) {
							const item = this.list[i];
							if (item.title === this.$t('步数')) {
								this.processSteps(res.data);
							} else if (item.title === this.$t('身高')) {
								this.processHeight(res.data);
							} else if (item.title === this.$t('体温')) {
								this.processTemperature(res.data);
							} else if (item.title === this.$t('血氧')) {
								this.processBloodOxygen(res.data);
							} else if (item.title === this.$t('压力')) {
								this.processyali(res.data);
							}
						}
					}
				})
			},
			// 处理步数卡片
			processSteps(item) {
				let that = this
				const stepKey = 'settept';
				const stepCacheKey = 'settept1';
				const now = new Date().getTime();
				that.getStorageInfo([stepKey, stepCacheKey], (hasAllKeys, res) => {
					const currentStep = uni.getStorageSync(stepKey);
					const cachedStep = uni.getStorageSync(stepCacheKey);
					const stepItem = that.findValue(that.list, 'title', that.$t('步数'));
					if (hasAllKeys) {
						const stepDiff = currentStep - cachedStep;
						if (stepDiff > 0) {
							uni.setStorageSync(stepCacheKey, cachedStep + stepDiff);
						}
					} else {
						uni.setStorageSync(stepCacheKey, currentStep);
					}
					stepItem.Step_number = uni.getStorageSync(stepCacheKey);
					stepItem.Step_count = that.formatDate(now);
					that.bushu = stepItem.Step_number;
					that.bushu_time = stepItem.Step_count;
				});
			},
			// 处理身高卡片
			processHeight(item) {
				let that = this
				const heightItem = that.findValue(that.list, 'title', that.$t('身高'));
				const height = that.findValue(item, 'register', 'height')?.registerVal;
				const unit = uni.getStorageSync("danwei1") === 0 ? "inch" : "cm";
				heightItem.type_LX = unit;
				heightItem.Step_number = height !== null ? height : '-/-';
				heightItem.Step_count = that.formatDate(that.findValue(item, 'register', 'height')?.updateTime);
			},
			// 处理体温卡片
			processTemperature(item) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', that.$t('体温'));
				temperatureItem.Step_number = uni.getStorageSync("tiwen") || "0";
				temperatureItem.Step_count = uni.getStorageSync("tiwentimes") || "--/--";
			},
			// 处理压力卡片
			processyali(item) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', that.$t('压力'));
				temperatureItem.Step_number = uni.getStorageSync("yali") || "0";
				temperatureItem.Step_count = uni.getStorageSync("yalitimes") || "--/--";
			},
			// 处理血氧卡片
			processBloodOxygen(item) {
				let that = this
				uni.getStorageInfo({
					success: (xueyangres) => {
						const bloodOxygenItem = that.findValue(that.list, 'title', that.$t('血氧'));
						if (xueyangres.keys.includes("xueyang")) {
							const xueyang = uni.getStorageSync("xueyang");
							bloodOxygenItem.Step_number = xueyang !== null ? xueyang : "0"
							if (xueyang <= 95) {
								bloodOxygenItem.BMI_ys = that.$t('偏低');
								bloodOxygenItem.BMI_TF = 0;
							} else if (xueyang < 98) {
								bloodOxygenItem.BMI_ys = that.$t('正常');
								bloodOxygenItem.BMI_TF = 1;
							} else if (parseInt(xueyang) >= 98) {
								bloodOxygenItem.BMI_ys = that.$t('偏高');
								bloodOxygenItem.BMI_TF = 10;
							}
						} else {
							const xueyang = that.findValue(item, 'register', 'oxygen')
								?.registerVal;
							bloodOxygenItem.Step_number = xueyang !== null ? xueyang : "0"
							if (parseInt(xueyang) <= 95) {
								bloodOxygenItem.BMI_ys = that.$t('偏低');
								bloodOxygenItem.BMI_TF = 0;
							} else if (parseInt(xueyang) < 98) {
								bloodOxygenItem.BMI_ys = that.$t('正常');
								bloodOxygenItem.BMI_TF = 1;
							} else if (parseInt(xueyang) >= 98) {
								bloodOxygenItem.BMI_ys = that.$t('偏高');
								bloodOxygenItem.BMI_TF = 10;
							}
						}
						if (xueyangres.keys.includes("xueyangtimes")) {
							bloodOxygenItem.Step_count = !uni.getStorageSync("xueyangtimes") ? "-/-" : uni
								.getStorageSync("xueyangtimes");
						} else {
							const xueyangtime = that.formatDate(that.findValue(item, 'register', 'oxygen')
								?.updateTime);
							bloodOxygenItem.Step_count = !xueyangtime ? "-/-" : xueyangtime;
						}
					}
				});
			},

			findValue(arr, key, value) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] == value) {
						return arr[i]
					}
				}
				return null
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
			// 定义一个函数来更新特定字段
			updateField(list, titleKey, fieldKey, value, countValue) {
				const item = this.findValue(list, 'title', titleKey);
				if (item) {
					item[fieldKey] = value;
					item.Step_count = countValue;
				}
			},
			// 封装获取存储信息的通用函数
			getStorageInfo(keys, callback) {
				uni.getStorageInfo({
					success: (res) => {
						const hasAllKeys = keys.every(key => res.keys.includes(key));
						callback(hasAllKeys, res);
					}
				});
			},
		}
	}
</script>

<style>
	.list-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, calc((100vw - 40px) / 2));
		padding: 10px 15px 160px 15px;
		justify-content: space-between;
		padding-bottom: 160px;
	}

	.list-item {

		/* 两列宽度分配比例 */
		margin: 5px 5px 10px 5px;
		/* 列表项间距 */
		background: white;
		border-radius: 15px;
		/* 背景色 */
		padding: 10px;
		/* 内边距 */
		box-sizing: border-box;
		/* 盒模型 */
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}


	.icon_bgsss {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.data_item_bgsss {
		height: 60px;
		line-height: 25px;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: left;
		align-items: center;
		border-radius: 10px;
		padding-bottom: 15px;
	}

	.img_stylesss {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.img_style {
		width: 25px;
		height: 25px;
	}


	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
	}

	.button_bg_color {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-left: 20px;
		margin-right: 20px;
		margin-bottom: 68px;
		background: #3298F7;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.list_item_bg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 160px;
	}

	.button_bg_view {
		background: #EFEFF4;
		width: 100vw;
		height: 100px;
		display: flex;
		position: fixed;
		bottom: 0;
		flex-direction: column;
		padding-top: 20px;
		padding-bottom: 25px;
	}

	.button_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80vw;
		color: white;
		background: #DBDBDB;
		border-radius: 30px;
	}
</style>