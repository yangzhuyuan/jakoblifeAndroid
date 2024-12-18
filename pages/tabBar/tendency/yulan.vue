<template>
	<view style="height: 100vh; color: black;">
		<view v-if="chooseItem_name == '血压'" style="text-align: center; padding: 10px 10px 80px 10px;">
			<view id="content">
				<view
					style="display: flex;justify-content: center;font-size: 18px; font-weight: bold;margin-top: 20px;">
					{{starttime.slice(0,10)}}至{{endtime.slice(0,10)}}PDF数据预览
				</view>
				<view style="border: 1px solid black; margin-top: 20px; ">
					<view style="display: flex;flex-direction: row;width: 98%;padding: 10px;">
						<view style="display: flex;flex-direction: row;width: 98%;">
							<view style="width: 15%;">时间</view>
							<view style="width: 20%">设备</view>
							<view style="width: 20%">收缩压</view>
							<view style="width: 20%;">舒张压</view>
							<view style="width: 20%;padding: 2px;">脉搏</view>
							<view style="width: 13%;padding: 2px;">平均</view>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in swipeList2222" :key="index">
					<view style="border: 1px solid black;">
						<view style="display: flex;flex-direction: row;padding: 10px;background: wheat;">
							<view style="display: flex;flex-direction: row;width: 98%;">
								<view style="width: 15%;">{{item.dateTime}}</view>
								<view style="width: 20%">{{item.modelName}}</view>
								<view style="width: 20%">{{item.object.summary.highPressureAvg}}</view>
								<view style="width: 20%;">{{item.object.summary.lowPressureAvg}}</view>
								<view style="width: 20%;padding: 2px;">{{item.object.summary.heartrateAvg}}</view>
								<view style="width: 13%;padding: 2px;">是</view>
							</view>
						</view>
						<view v-for="(item1,index1) in item.object.details" :key="index"
							style="border-top: 1px solid black;">
							<view style="display: flex;flex-direction: row;border-top: 1px solid black;padding: 10px;">
								<view style="display: flex;flex-direction: row;width: 98%;">
									<view style="width: 15%;">{{item1.time}}</view>
									<view style="width: 20%">{{item.modelName}}</view>
									<view style="width: 20%">{{item1.highPressure}}</view>
									<view style="width: 20%;">{{item1.lowPressure}}</view>
									<view style="width: 20%;padding: 2px;">{{item1.heartrate}}</view>
									<view style="width: 13%;padding: 2px;">否</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else-if="chooseItem_name == '体脂'" style="text-align: center; padding: 10px 10px 80px 10px;">
			<view id="content">
				<view
					style="display: flex;justify-content: center;font-size: 18px; font-weight: bold;margin-top: 20px;">
					{{starttime.slice(0,10)}}至{{endtime.slice(0,10)}}PDF数据预览
				</view>
				<view style="border: 1px solid black; margin-top: 20px; ">
					<view style="display: flex;flex-direction: row;width: 98%;padding: 10px;">
						<view style="display: flex;flex-direction: row;width: 98%;">
							<view style="width: 15%;">时间</view>
							<view style="width: 20%">设备</view>
							<view style="width: 20%">体重</view>
							<view style="width: 20%;">BMI</view>
							<view style="width: 13%;padding: 2px;">平均</view>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in swipeList2222" :key="index">
					<view style="border: 1px solid black;">
						<view style="display: flex;flex-direction: row;padding: 10px;background: wheat;">
							<view style="display: flex;flex-direction: row;width: 98%;">
								<view style="width: 15%;">{{item.dateTime}}</view>
								<view style="width: 20%">{{item.modelName}}</view>
								<view style="width: 20%">{{item.object.summary.weightAvg}}</view>
								<view style="width: 20%;">{{item.object.summary.bmiAvg}}</view>
								<view style="width: 13%;padding: 2px;">是</view>
							</view>
						</view>
						<view v-for="(item1,index1) in item.object.details" :key="index"
							style="border-top: 1px solid black;">
							<view style="display: flex;flex-direction: row;border-top: 1px solid black;padding: 10px;">
								<view style="display: flex;flex-direction: row;width: 98%;">
									<view style="width: 15%;">{{item1.time}}</view>
									<view style="width: 20%">{{item.modelName}}</view>
									<view style="width: 20%">{{item1.weight}}</view>
									<view style="width: 20%;">{{item1.bmi}}</view>
									<view style="width: 13%;padding: 2px;">否</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view
			style="width:100vw;height: 80px;  display: flex;position: fixed;bottom: 0; flex-direction: column; padding-top: 40rpx; padding-bottom: 50rpx;">
			<button class="button_bg_color" @click="canvasImage.save">打印</button>
		</view>
	</view>
</template>

<script>
	import {
		base64ToPath
	} from '../../../common/imageTool.js';

	export default {

		onLoad(res) {
			console.log("dsahdsada", res)
			this.chooseItem_name = res.chooseItem_name
			this.starttime = res.starttime
			this.endtime = res.endtime
			let obj = res.deviceSn.replace("\"([^\"]*)\"", "$1");
			this.deviceSn = JSON.parse(obj)




		},

		data() {
			return {
				chooseItem_name: '',
				starttime: '',
				endtime: '',
				deviceSn: [],
				swipeList1111: [],
				swipeList2222: []
			}
		},

		onShow() {
			if (this.chooseItem_name == "血压") {
				this.query_log_v2ss(this.deviceSn, this.starttime, this.endtime)
			} else if (this.chooseItem_name == "体脂") {
				this.query_log_v22ss(this.deviceSn, this.starttime, this.endtime)
			}

		},

		methods: {


			receiveRenderData(url) {
				this.loadBase64Url(url)
			},
			/* 将base64 位的图片路径转换为 临时路径 */
			loadBase64Url(url) {
				const imageStr = url;

				// console.log("走势世界很大", imageStr)

				base64ToPath(imageStr)
					.then(path => {
						console.log(path, 'path')
						this.saveImage(path);
					})
					.catch(error => {
						console.error('临时路径转换出错了：', error);
					});
			},
			saveImage(url) {
				uni.saveFile({
					tempFilePath: url,
					async success(res) {
						uni.openDocument({
							filePath: res.savedFilePath,
							success: function(FileRes) {
								console.log('打开成功');
							}
						});
					},
					complete(res) {
						console.log(res, 'res123')
					}
				})
			},


			//历史记录V2 - 血压
			query_log_v2ss(deviceSn, startTime, endTime) {
				let that = this
				console.log('deviceSndadadasdada', deviceSn)
				console.log('startTimedadadadada', startTime)
				console.log('endTimedadadadadada', endTime)
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
						console.log('历史记录V2 - 血压', res)
						if (res.data.code == 200) {

							that.swipeList2222 = []
							that.swipeList2222 = res.data.data


						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//历史记录V2 - 体脂
			query_log_v22ss(deviceSn, startTime, endTime) {
				let that = this
				console.log('deviceSndadadasdada', deviceSn)
				console.log('startTimedadadadada', startTime)
				console.log('endTimedadadadadada', endTime)
				uni.request({
					url: that.$url_query_log_v2,
					method: 'POST',
					data: {
						deviceSn: deviceSn,
						dataType: "weight",
						slaveList: [{
							slaveSn: "0",
							register: "weight"
						}],
						startTime: startTime,
						endTime: endTime,
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						console.log('历史记录V2 - 体重', res)
						if (res.data.code == 200) {


							that.swipeList2222 = []
							that.swipeList2222 = res.data.data


						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},


		}
	}
</script>


<script lang="renderjs" module="canvasImage">
	// 引入库
	import html2Canvas from 'html2canvas'
	import jsPDF from 'jspdf'
	export default {
		methods: {
			// 生成图片需要调用的方法
			generateImage(e, ownerFun) {
				return new Promise((resolve, reject) => {
					var shareContent = document.getElementById('content');
					var width = shareContent.offsetWidth / 4;
					var height = shareContent.offsetHeight / 4;
					html2Canvas(document.getElementById('content'), {
						dpi: 900,
						scrolly: 0,
						// width:eleW,//生成后的宽度
						// height:eleH,//生成后的高度
						scrollx: -10,
						useCORS: true, //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。

						// backgroundColor: null //避免图片有白色边框
					}).then((canvas) => {
						setTimeout(() => {
							var context = canvas.getContext('2d');
							context.mozImageSmoothingEnabled = false;
							context.webkitImageSmoothingEnabled = false;
							context.msImageSmoothingEnabled = false;
							context.imageSmoothingEnabled = false;
							var pageData = canvas.toDataURL('image/jpeg', 1.0);
							// resolve(pageData)
							var img = new Image();
							img.src = pageData
							img.onload = () => {
								// 获取dom高度、宽度
								img.width = img.width * 2;
								img.height = img.height * 2;
								console.log(img.width, '------ img.width');
								console.log(img.height, '------img.height');
								img.style.transform = 'scale(0.5)';
								if (width > height) {
									// 此可以根据打印的大小进行自动调节
									// eslint-disable-next-line
									var pdf = new jsPDF('l', 'mm', [width, height]);
								} else {
									// eslint-disable-next-line
									var pdf = new jsPDF('p', 'mm', [width, height]);
								}
								pdf.addImage(pageData, 'jpeg', 0, 0, width, height);
								var url = pdf.output("datauristring");
								resolve(url)
							};
						}, 500);

					}).catch((r) => {
						console.log(r);
					})
				})
			},
			async save(e, ownerFun) {
				console.log("esdadadadaqdadsad")
				console.log("esdadadadaqdadsad111111", ownerFun)
				console.log("aaa", "asdasdgadgasd、111")
				let img = await this.generateImage().then()
				ownerFun.callMethod('receiveRenderData', img)
			},
		}
	}
</script>





<style>
	.button_bg_color {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		width: 80vw;
		background: #3298F7;
		color: white;
		border-radius: 50rpx;
	}
</style>