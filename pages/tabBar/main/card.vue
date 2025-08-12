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
							style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px; flex: 2;">
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
		<view style="position: fixed;bottom: 0; width: 100vw;"><button class="button_bg_color"
				@click="turess()">{{$t('确认')}}</button>
		</view>
		<!-- BMI普通弹窗 -->
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view
					style="background: #FFFFFF; border-radius: 24px; width: 90vw; padding-bottom: 20px;  margin: 0 10vw 0 10vw;">
					<view style="padding: 20px; ">
						<view style="font-weight: 600;text-align: center; font-size: 16px;">{{$t('BMI分类')}}</view>
						<view style="color: #999999;font-size: 10px;margin-top: 20px;text-align: center;">
							{{$t('根据世界卫生组织的最新BMI分类')}}
						</view>
						<view
							style="display: flex; flex-direction: row; padding: 5px; align-items: center;margin-top: 20px; margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t('BMI范围')}}</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t('分类')}}</view>
						</view>
						<view
							style="padding: 5px;background: #FCCD41; width: 88%;margin-top: 10px; display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">&lt;18.5</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('体重过轻')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #58BF78; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">18.5-24.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('正常体重')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #FC7F41; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('超重')}}</view>
						</view>
						<view
							style="padding: 5px;background: #F55A5A; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('一级肥胖')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #7A0101; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('二级肥胖')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #333333; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 40vw;font-size: 8px;color: white;">{{$t('三级肥胖或病态肥胖')}}
							</view>
						</view>
					</view>
					<button @tap="knowe1()"
						style="width: 120px; height: 48px; border-radius: 100px;background: #3298F7;color: white;display: flex;justify-content: center;align-items: center;">{{$t('知道了')}}</button>
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
						image: "../../../static/icons/4.png",
						Step_number: "-",
						title: 'BMI',
						type_LX: "kg/m²",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/3.png",
						Step_number: "-",
						title: this.$t("骨含量"),
						type_LX: "kg",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/7.png",
						Step_number: "-",
						title: this.$t("肌肉量"),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/4.png",
						Step_number: "-",
						title: this.$t("蛋白率"),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/5.jpg",
						Step_number: "-",
						title: this.$t("水分"),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/8.png",
						Step_number: "-",
						title: this.$t("内脏脂肪指数"),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/6.png",
						Step_number: "-",
						title: this.$t("脂肪率"),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/1.png",
						Step_number: "-",
						title: this.$t("基础代谢率"),
						type_LX: "KCAL",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/2.png",
						Step_number: "0",
						title: this.$t("皮下脂肪率"),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/9.png",
						Step_number: "-",
						title: this.$t("身体年龄"),
						type_LX: this.$t("岁"),
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
			const kapianlist = uni.getStorageSync('kapianlist2');
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
			// // 调用相关方法
			this.list_recipe();
			this.queryDevices()
		},


		methods: {
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
				let list2 = uni.getStorageSync("kapianlist2") || [];
				// 筛选出当前列表中选中的项
				let list1 = this.list.filter(item => item.checkbox);
				// 合并两个列表
				let newarr = list2.concat(list1);
				// 更新本地存储
				uni.setStorageSync("kapianlist2", newarr);
				// 返回上一页
				uni.navigateBack();
			},
			BMI_tap(title) {
				this.$refs.popup1.open("center")
			},
			knowe1() {
				this.$refs.popup1.close()
			},
			// 查询用户的绑定设备
			queryDevices() {
				this.$post(this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						if (res.rows !== "") {
							for (let i = 0; res.rows.length > i; i++) {
								if (res.rows[i].deviceTypeId === "11") {
									this.get_device_data(res.rows[i].deviceSn)
								}
							}
						}
					}
				})
			},

			get_device_data(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_get_device_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
				}).then(res => {
					if (res.code == 200) {
						const data = res.data;
						for (let i = 0; i < this.list.length; i++) {
							const item = this.list[i];
							if (item.title === "BMI") {
								this.updateBMI(data);
							} else if (item.title === this.$t("骨含量")) {
								this.updateCard(data, this.$t("骨含量"), "BM");
							} else if (item.title === this.$t("肌肉量")) {
								this.updateCard(data, this.$t("肌肉量"), "ROM");
							} else if (item.title === this.$t("蛋白率")) {
								this.updateCard(data, this.$t("蛋白率"), "PP");
							} else if (item.title === this.$t("水分")) {
								this.updateCard(data, this.$t("水分"), "MOI");
							} else if (item.title === this.$t("内脏脂肪指数")) {
								this.updateCard(data, this.$t("内脏脂肪指数"), "UVI");
							} else if (item.title === this.$t("脂肪率")) {
								this.updateCard(data, this.$t("脂肪率"), "BFR");
							} else if (item.title === this.$t("基础代谢率")) {
								this.updateCard(data, this.$t("基础代谢率"), "BMR");
							} else if (item.title === this.$t("皮下脂肪率")) {
								this.updateCard(data, this.$t("皮下脂肪率"), "SFR");
							} else if (item.title === this.$t("身体年龄")) {
								this.updateCard(data, this.$t("身体年龄"), "PA");
							}
						}
					}
				})
			},
			findValue(arr, key, value) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] == value) {
						return arr[i]
					}
				}
				return null
			},
			// 定义BMI分类逻辑
			updateBMI(data) {
				const bmiItem = this.findValue(this.list, 'title', "BMI");
				const bmiValue = data.BMI || 0;
				bmiItem.Step_number = bmiValue;
				if (bmiValue < 18.5) {
					bmiItem.BMI_TF = 0;
					bmiItem.BMI_ys = this.$t("体重过轻");
				} else if (bmiValue <= 24.9) {
					bmiItem.BMI_TF = 1;
					bmiItem.BMI_ys = this.$t("正常体重");
				} else if (bmiValue <= 29.9) {
					bmiItem.BMI_TF = 2;
					bmiItem.BMI_ys = this.$t("超重");
				} else if (bmiValue <= 34.9) {
					bmiItem.BMI_TF = 3;
					bmiItem.BMI_ys = this.$t("一级肥胖");
				} else if (bmiValue <= 39.9) {
					bmiItem.BMI_TF = 4;
					bmiItem.BMI_ys = this.$t("二级肥胖");
				} else {
					bmiItem.BMI_TF = 5;
					bmiItem.BMI_ys = this.$t("三级肥胖或病态肥胖");
				}
			},

			// 定义一个通用的处理函数
			updateCard(data, titleKey, dataKey) {
				const item = this.findValue(this.list, 'title', titleKey);
				item.Step_number = data[dataKey] || '-/-';
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
			//时间戳转时间
			formatDate(value) {
				const data = new Date(value);
				const month = data.getMonth() + 1;
				const day = data.getDate();
				const year = data.getFullYear();
				const hours = data.getHours();
				const minutes = data.getMinutes();
				const seconds = data.getSeconds();
				return `${month}/${day}`;
			},

			//设备数据概览
			list_recipe() {
				const data = {
					userId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code == 200) {
						this.list.forEach(item => {
							if (item.title === this.$t('步数')) {
								this.processSteps(res.data);
							} else if (item.title === this.$t('身高')) {
								this.processHeight(res.data);
							} else if (item.title === "BMI") {
								this.processGenericData(res.data, "BMI", "weight");
							} else if (item.title === this.$t("骨含量")) {
								this.processGenericData(res.data, "骨含量", "weight");
							} else if (item.title === this.$t("肌肉量")) {
								this.processGenericData(res.data, "肌肉量", "weight");
							} else if (item.title === this.$t("蛋白率")) {
								this.processGenericData(res.data, "蛋白率", "weight");
							} else if (item.title === this.$t("水分")) {
								this.processGenericData(res.data, "水分", "weight");
							} else if (item.title === this.$t("内脏脂肪指数")) {
								this.processGenericData(res.data, "内脏脂肪指数", "weight");
							} else if (item.title === this.$t("脂肪率")) {
								this.processGenericData(res.data, "脂肪率", "weight");
							} else if (item.title === this.$t("基础代谢率")) {
								this.processGenericData(res.data, "基础代谢率", "weight");
							} else if (item.title === this.$t("皮下脂肪率")) {
								this.processGenericData(res.data, "皮下脂肪率", "weight");
							} else if (item.title === this.$t("身体年龄")) {
								this.processGenericData(res.data, "身体年龄", "weight");
							}
						});
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
			// 封装处理BMI和其他通用逻辑
			processGenericData(itemdata, titleKey, dataKey) {
				let that = this
				const item = that.findValue(that.list, "title", that.$t(titleKey));
				const data = that.findValue(itemdata, "register", dataKey);
				item.Step_count = that.formatDate(data?.updateTime);
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