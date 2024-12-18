<template>
	<view style="color: black;height: 100vh;background: #EFEFF4;">
		<view class="list-container">

			<view v-for="(item, index) in list" :key="index" @click="dianji(index, item.checkbox)">
				<view class="list-item">

					<view style="position: relative;top:-15px; left: 95%;">
						<image v-if="item.checkbox === true" src="../../../static/icons/check_true.png"
							style="height: 25px; width: 25px;"></image>
						<image v-else src="../../../static/icons/check_false.png" style="height: 25px; width: 25px;">
						</image>
					</view>

					<view class="data_item_bgsss">
						<view class="icon_bgsss">
							<image :src="item.image" class="img_stylesss" />
							<text class="icon_text_bgsss">{{item.title}}</text>
						</view>



						<view style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">

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
									<view v-else
										style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
										<view style="width: 10px; height:10px;background: #333333;border-radius: 50px;">
										</view>
									</view>
								</view>

								<text
									style="text-align: right;font-size: 16px;margin-left: 10px;">{{item.Step_number}}</text>
							</view>

							<text style="text-align: right;color: gray;font-size: 12px;">{{item.type_LX}}</text>
							<text style="text-align: right;font-size: 14px;">{{item.Step_count}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: auto;  display: flex;position: fixed;left: 10vw; bottom: 40px; flex-direction: column;">
			<button class="button_bg_color" @click="turess()">确认</button>
		</view>
		<!-- BMI普通弹窗 -->
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view style="border-radius: 20px;background:#fff;padding-bottom: 20px;width: 280px;text-align: center;">
					<view>
						<image style="width: 200px; height: 260px;" src="../../../static/image/4.png"></image>
					</view>
					<button @tap="knowe1()"
						style="margin: 10px 50px 20px 50px;border-radius: 20px;background: #3298F7;color: white;">{{$t('BDSBitem.title_8')}}</button>
				</view>
			</uni-popup>
		</view>


		<!-- 血氧 -->
		<view>
			<uni-popup ref="popup2" :mask-click="false">
				<view style="border-radius: 20px;background:#fff;padding-bottom: 20px;width: 280px;text-align: center;">
					<view>
						<view style="font-weight: bold;padding-top: 20px;font-size: 16px;">血氧分类</view>
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
							<view style="width: 80px;height: 10px;">偏低</view>
							<view style="width: 80px;height: 10px;">正常</view>
							<view style="width: 80px;height: 10px;">偏高</view>
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							1.检测注意：情绪激动、憋气或检测中的不规范处理均可能会导致动脉血氧饱和度结果不准确
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							2.偏高提示：动脉血氧饱和度>98%，提示若当机体摄入氧浓度过高，一般没有临床意义。在接受高浓度吸氧、高压氧治疗的人群，动脉血氧饱和度可接近100%。
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							3.偏低提示：动脉血氧饱和度&lt;90%，需考虑机体存在缺氧的可能，提示机体存在低氧血症。
						</view>
					</view>
					<button @tap="knowe2()"
						style="margin: 40px 50px 20px 50px;border-radius: 20px;background: #3298F7;color: white;">{{$t('BDSBitem.title_8')}}</button>
				</view>
			</uni-popup>
		</view>

	</view>



</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {

		computed: {
			...mapState(['info'])
		},

		data() {
			return {
				list: [{
						bmi_show: false,
						image: "../../../static/icons/1.png",
						Step_number: "-",
						title: this.$t('shouye_item.title_3'),
						type_LX: this.$t('shouye_item.title_4'),
						Step_count: "-",
						checkbox: false,

					}, {
						bmi_show: false,
						image: "../../../static/icons/2.png",
						Step_number: "-",
						title: this.$t('zhuceitem.title_5'),
						type_LX: "cm",
						Step_count: "-",
						checkbox: false,
					}, {
						bmi_show: false,
						image: "../../../static/icons/6.png",
						Step_number: "-",
						title: this.$t('zhuceitem.title_6'),
						type_LX: "kg",
						Step_count: "-",
						checkbox: false,
					}, {
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
						BMI_TF: 0,
						BMI_ys: "-",
						bmi_show: true,
						image: "../../../static/page_icon/10.png",
						Step_number: "-",
						title: '血氧',
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/3.png",
						Step_number: "-",
						title: "骨含BM",
						type_LX: "kg",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/7.png",
						Step_number: "-",
						title: "肌肉量",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/4.png",
						Step_number: "-",
						title: "蛋白率",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/5.jpg",
						Step_number: "-",
						title: "水分",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/8.png",
						Step_number: "-",
						title: "内脏脂肪指数",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/6.png",
						Step_number: "-",
						title: "脂肪率",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/1.png",
						Step_number: "-",
						title: "基础代谢率",
						type_LX: "KCAL",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/2.png",
						Step_number: "-",
						title: "皮下脂肪率",
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					},
					{
						bmi_show: false,
						image: "../../../static/page_icon/9.png",
						Step_number: "-",
						title: "身体年龄",
						type_LX: "岁",
						Step_count: "-",
						checkbox: false,
					}
				],
			}
		},
		onShow() {
			if (uni.getStorageSync('kapianlist2') != [] || uni.getStorageSync(
					'kapianlist2') != undefined || uni.getStorageSync(
					'kapianlist2') != null) {
				for (let i = 0; uni.getStorageSync('kapianlist2').length > i; i++) {
					var index0 = this.list.findIndex(item => {
						if (item.title == uni.getStorageSync('kapianlist2')[i].title) {
							return true
						}
					})
					this.list.splice(index0, 1)
				}
				this.list_recipe()
				this.queryDevices()
			} else {
				this.list_recipe()
				this.queryDevices()
			}
		},


		methods: {
			...mapMutations(['getInfo']),


			dianji(id, checkid) {
				if (checkid == true) {
					this.list[id].checkbox = false
				} else {
					this.list[id].checkbox = true
				}
			},


			turess() {
				let list1 = []
				let list2 = []
				list2 = uni.getStorageSync("kapianlist2")
				this.list.forEach((item, index) => {
					if (item.checkbox == true) {
						console.log("aasdafa", item)
						list1.push(item)
						console.log("aasdafa", this.list)
					}
				})
				let newarr = list2.concat(list1)
				uni.setStorageSync("kapianlist2", newarr)
				uni.navigateBack();
			},


			BMI_tap(title) {
				if (title == "血氧") {
					this.$refs.popup2.open("center")
				} else {
					this.$refs.popup1.open("center")
				}
			},

			knowe1() {
				this.$refs.popup1.close()
			},

			knowe2() {
				this.$refs.popup2.close()
			},


			// 查询用户的绑定设备
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
						console.log("查询用户的绑定设备", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.rows == null) {
									uni.showToast({
										title: '当前未绑定任何设备',
										icon: 'none'
									})
									that.main_type = true
								} else {
									for (let i = 0; res.data.rows.length > i; i++) {
										if (res.data.rows[i].deviceTypeId == 10) {
											that.get_device_data(res.data.rows[i].deviceSn)
										} else {
											that.get_device_data1(res.data.rows[i].deviceSn)
										}

									}
								}

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					}
				})
			},




			//获取体脂秤身体指数
			get_device_data(deviceSn) {
				let that = this
				console.log("获取体脂秤身体指数000000000", deviceSn)
				uni.request({
					url: that.$url_get_device_data,
					method: 'POST',
					data: {
						deviceSn: deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("获取体脂秤身体指数", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								for (let i = 0; that.list.length > i; i++) {
									if (that.list[i].title.includes("BMI")) {
										that.findValue(that.list, 'title', "BMI").Step_number = res.data.data
											.BMI
										that.findValue(that.list, 'title', "BMI").Step_count = "--/--"
										if (that.findValue(that.list, 'title', 'BMI').Step_number < 18.5) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 0
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "体重过轻"
										} else if (18.5 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number &&
											that
											.findValue(that.list, 'title', 'BMI').Step_number <= 24.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 1
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "正常体重"
										} else if (20.5 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number &&
											that
											.findValue(that.list, 'title', 'BMI').Step_number <= 29.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 2
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "超重"
										} else if (30 <= that.findValue(that.list2, 'title', 'BMI')
											.Step_number && that.findValue(that.list, 'title', 'BMI')
											.Step_number <= 34.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 3
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "一级肥胖"
										} else if (35.0 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number && that.findValue(that.list, 'title', 'BMI')
											.Step_number <= 39.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 4
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "二级肥胖"
										} else if (40 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 5
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "三级肥胖或病态肥胖"
										}
									}
									if (that.list[i].title.includes("血氧")) {
										that.findValue(that.list, 'title', "血氧").BMI_ys = "--"
										that.findValue(that.list, 'title', "血氧").Step_number = "--"
										that.findValue(that.list, 'title', "血氧").Step_count = "--/--"
									}
									if (that.list[i].title.includes("骨含BM")) {
										that.findValue(that.list, 'title', "骨含BM").Step_number = res.data.data
											.BM == "" ? "--" : res.data.data
											.BM
										that.findValue(that.list, 'title', "骨含BM").Step_count = "--/--"
									}
									if (that.list[i].title.includes("肌肉量")) {
										that.findValue(that.list, 'title', "肌肉量").Step_number = res.data.data
											.ROM == "" ? "--" : res.data.data
											.ROM
										that.findValue(that.list, 'title', "肌肉量").Step_count = "--/--"
									}
									if (that.list[i].title.includes("蛋白率")) {
										that.findValue(that.list, 'title', "蛋白率").Step_number = res.data.data
											.PP == "" ? "--" : res.data.data
											.PP
										that.findValue(that.list, 'title', "蛋白率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("水分")) {
										that.findValue(that.list, 'title', "水分").Step_number = res.data.data
											.MOI == "" ? "--" : res.data.data
											.MOI
										that.findValue(that.list, 'title', "水分").Step_count = "--/--"
									}
									if (that.list[i].title.includes("内脏脂肪指数")) {
										that.findValue(that.list, 'title', "内脏脂肪指数").Step_number = res.data
											.data
											.UVI == "" ? "--" : res.data.data
											.UVI
										that.findValue(that.list, 'title', "内脏脂肪指数").Step_count = "--/--"
									}
									if (that.list[i].title.includes("脂肪率")) {
										that.findValue(that.list, 'title', "脂肪率").Step_number = res.data.data
											.BFR == "" ? "--" : res.data.data
											.BFR
										that.findValue(that.list, 'title', "脂肪率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("基础代谢率")) {
										that.findValue(that.list, 'title', "基础代谢率").Step_number = res.data
											.data
											.BMR == "" ? "--" : res.data.data
											.BMR
										that.findValue(that.list, 'title', "基础代谢率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("皮下脂肪率")) {
										that.findValue(that.list, 'title', "皮下脂肪率").Step_number = res.data
											.data
											.SFR == "" ? "--" : res.data.data
											.SFR
										that.findValue(that.list, 'title', "皮下脂肪率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("身体年龄")) {
										that.findValue(that.list, 'title', "身体年龄").Step_number = res.data.data
											.PA == "" ? "--" : res.data.data
											.PA
										that.findValue(that.list, 'title', "身体年龄").Step_count = "--/--"
									}
								}

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					}
				})
			},
			//获取体脂秤身体指数
			get_device_data1(deviceSn) {
				let that = this
				console.log("获取体脂秤身体指数1111111111", deviceSn)
				uni.request({
					url: that.$url_get_device_data,
					method: 'POST',
					data: {
						deviceSn: deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("获取体脂秤身体指数", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								for (let i = 0; that.list.length > i; i++) {
									if (that.list[i].title.includes("BMI")) {
										that.findValue(that.list, 'title', "BMI").Step_number = res.data.data
											.BMI
										if (that.findValue(that.list, 'title', 'BMI').Step_number < 18.5) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 0
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "体重过轻"
										} else if (18.5 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number &&
											that
											.findValue(that.list, 'title', 'BMI').Step_number <= 24.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 1
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "正常体重"
										} else if (20.5 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number &&
											that
											.findValue(that.list, 'title', 'BMI').Step_number <= 29.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 2
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "超重"
										} else if (30 <= that.findValue(that.list2, 'title', 'BMI')
											.Step_number && that.findValue(that.list, 'title', 'BMI')
											.Step_number <= 34.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 3
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "一级肥胖"
										} else if (35.0 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number && that.findValue(that.list, 'title', 'BMI')
											.Step_number <= 39.9) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 4
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "二级肥胖"
										} else if (40 <= that.findValue(that.list, 'title', 'BMI')
											.Step_number) {
											that.findValue(that.list, 'title', 'BMI').BMI_TF = 5
											that.findValue(that.list, 'title', 'BMI').BMI_ys = "三级肥胖或病态肥胖"
										}
									}
									if (that.list[i].title.includes("血氧")) {
										that.findValue(that.list, 'title', "血氧").BMI_ys = "--"
										that.findValue(that.list, 'title', "血氧").Step_number = "--"
										that.findValue(that.list, 'title', "血氧").Step_count = "--/--"
									}
									if (that.list[i].title.includes("骨含BM")) {
										that.findValue(that.list, 'title', "骨含BM").Step_number = res.data.data
											.BM == "" ? "--" : res.data.data
											.BM
										that.findValue(that.list, 'title', "骨含BM").Step_count = "--/--"
									}
									if (that.list[i].title.includes("肌肉量")) {
										that.findValue(that.list, 'title', "肌肉量").Step_number = res.data.data
											.ROM == "" ? "--" : res.data.data
											.ROM
										that.findValue(that.list, 'title', "肌肉量").Step_count = "--/--"
									}
									if (that.list[i].title.includes("蛋白率")) {
										that.findValue(that.list, 'title', "蛋白率").Step_number = res.data.data
											.PP == "" ? "--" : res.data.data
											.PP
										that.findValue(that.list, 'title', "蛋白率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("水分")) {
										that.findValue(that.list, 'title', "水分").Step_number = res.data.data
											.MOI == "" ? "--" : res.data.data
											.MOI
										that.findValue(that.list, 'title', "水分").Step_count = "--/--"
									}
									if (that.list[i].title.includes("内脏脂肪指数")) {
										that.findValue(that.list, 'title', "内脏脂肪指数").Step_number = res.data
											.data
											.UVI == "" ? "--" : res.data.data
											.UVI
										that.findValue(that.list, 'title', "内脏脂肪指数").Step_count = "--/--"
									}
									if (that.list[i].title.includes("脂肪率")) {
										that.findValue(that.list, 'title', "脂肪率").Step_number = res.data.data
											.BFR == "" ? "--" : res.data.data
											.BFR
										that.findValue(that.list, 'title', "脂肪率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("基础代谢率")) {
										that.findValue(that.list, 'title', "基础代谢率").Step_number = res.data
											.data
											.BMR == "" ? "--" : res.data.data
											.BMR
										that.findValue(that.list, 'title', "基础代谢率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("皮下脂肪率")) {
										that.findValue(that.list, 'title', "皮下脂肪率").Step_number = res.data
											.data
											.SFR == "" ? "--" : res.data.data
											.SFR
										that.findValue(that.list, 'title', "皮下脂肪率").Step_count = "--/--"
									}
									if (that.list[i].title.includes("身体年龄")) {
										that.findValue(that.list, 'title', "身体年龄").Step_number = res.data.data
											.PA == "" ? "--" : res.data.data
											.PA
										that.findValue(that.list, 'title', "身体年龄").Step_count = "--/--"
									}

								}

							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
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

			//设备数据概览
			list_recipe() {
				let that = this
				console.log("userId", that.info.userId)
				uni.request({
					url: that.$url_list_recipe,
					method: 'POST',
					data: {
						userId: that.info.userId
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						console.log("设备数据概览", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								for (let i = 0; that.list.length > i; i++) {
									console.log("dsjkhdhada", that.list)
									if (that.list[i].title.includes("步数")) {
										that.findValue(that.list, 'title',
												"步数").Step_number = uni.getStorageSync("settept") == "" ?
											"--" :
											uni.getStorageSync("settept")
										that.findValue(that.list, 'title',
											"步数").Step_count = that.formatDate(new Date().getTime())
									}
									if (that.list[i].title.includes("身高")) {
										let height = that.findValue(res.data.data, 'register', 'height')
											.registerVal
										that.findValue(that.list, 'title', "身高").Step_number = height ==
											null ?
											'--' : height
										that.findValue(that.list, 'title', "身高").Step_count = that.formatDate(
											that.findValue(res.data.data, 'register', 'height').updateTime)
									}
									if (that.list[i].title.includes("体重")) {
										that.findValue(that.list, 'title',
											"体重").Step_number = that.findValue(res.data.data, 'register',
											'weight').registerVal
										that.findValue(that.list, 'title',
											that.$t('zhuceitem.title_6')).Step_count = that.formatDate(that
											.findValue(res.data.data, 'register', 'weight').updateTime)
									}
								}
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					}
				})
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

	}


	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.data_item_bgsss {
		height: 65px;
		line-height: 25px;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		padding: 0 10px 10px 10px;
	}

	.img_stylesss {
		width: 50px;
		height: 50px;
	}


	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		text-align: center;
		font-weight: bold;
	}

	.button_bg_color {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80vw;
		background: #3298F7;
		color: white;
		border-radius: 50px;
	}

	.list_item_bg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 160px;
	}

	.icon_bgsss {

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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