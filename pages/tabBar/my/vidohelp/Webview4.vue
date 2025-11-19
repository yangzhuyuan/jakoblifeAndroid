<template>
	<view class="wrap">
		<!-- 标题栏已在 onReady 里动态设置 -->
		<button type="primary" @tap="downloadAndOpen">{{$t("下载并打开说明书")}}</button>
		<uni-popup ref="down_popup" :mask-click="false">
			<view style="width: 80vw; background:#fff; padding: 20px; border-radius: 10px; align-items: center;">
				<text style="text-align: center; font-weight: bold; margin-bottom: 20px;">{{$t("正在下载")}}</text>
				<progress :percent="progress" show-info activeColor="#10AEFF" stroke-width="3" />
				<view style="display: flex; justify-content: center; margin-top: 20px;">
					<button @click="cancelDownload"
						style="background: #10AEFF; color: white; width: 40%;">{{$t('取消下载')}}</button>
				</view>
			</view>
		</uni-popup>
		<!-- 如果你想继续用 web-view 在线预览，可保留下面注释段 -->

		<!-- <web-view :src="pdfUrl"></web-view> -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 干净 URL，不带任何 XML 标签
				pdfUrl: "",
				// 本地保存路径
				localPath: '',
				progress: 0, // 新增
				downloadTask: null, // 下载任务对象
				titlesd: '',
			}
		},
		onLoad(opt) {
			this.titlesd = opt.title
			// 1. 基本校验
			if (!opt || !opt.url) {
				uni.showToast({
					title: this.$t("链接无效"),
					icon: 'none'
				});
				return;
			}
			// 2. 赋值并设置标题
			this.WebViewId = decodeURIComponent(opt.url); // 防止 url 被 encode 两次
			this.pdfUrl = decodeURIComponent(opt.url); // 防止 url 被 encode 两次
			uni.setNavigationBarTitle({
				title: opt.title || this.$t("加载中")
			});
		},
		onUnload() {
			if (this.downloadTask) {
				this.downloadTask.abort();
				this.$refs.down_popup.close();
				this.progress = "0%"; // 新增
				uni.showToast({
					title: this.$t('下载已取消'),
					icon: 'none'
				});
			}
		},
		methods: {
			// 核心：下载 -> 保存 -> 打开
			downloadAndOpen() {
				this.progress = "0%";
				this.$refs.down_popup.open("center")
				// uni.showLoading({
				// 	title: '正在下载…'
				// });
				// 以时间戳命名，防冲突
				const fileName = this.titlesd + Date.now() + ".pdf";
				// #ifdef H5
				// H5 端直接新开标签页预览即可
				window.open(this.pdfUrl, '_blank');
				// uni.hideLoading();
				return;
				// #endif

				// App 端真机：先下载
				this.downloadTask = uni.downloadFile({
					url: this.pdfUrl,
					success: res => {
						if (res.statusCode === 200) {
							// 下载成功，再保存到应用沙盒
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								filePath: `${wx.env.USER_DATA_PATH}/` + fileName,
								success: save => {
									this.localPath = save.savedFilePath;
									uni.hideLoading();
									// 唤起系统 PDF 阅读器
									uni.openDocument({
										filePath: save.savedFilePath,
										fileType: 'pdf',
										showMenu: true, // 允许用户二次转发/保存
										fail: err => {
											this.$refs.down_popup.close();
											uni.showModal({
												content: this.$t("打开失败") +
													'：' + JSON.stringify(err),
												showCancel: false
											});
										}
									});
								},
								fail: err => {
									this.$refs.down_popup.close();
									uni.showModal({
										content: this.$t("保存失败") + '：' + JSON.stringify(
											err),
										showCancel: false
									});
								}
							});
						} else {
							this.$refs.down_popup.close();
							uni.showModal({
								content: this.$t("下载失败") + res.statusCode,
								showCancel: false
							});
						}
					},
					fail: err => {
						this.$refs.down_popup.close();
						uni.showModal({
							content: this.$t("下载失败请检查网络或链接是否有效"),
							showCancel: false
						});
					}
				});

				// 可选：监听下载进度
				this.downloadTask.onProgressUpdate(p => {
					this.progress = p.progress; // 新增
					console.log('下载进度', p.progress + '%');
				});
			},
			cancelDownload() {
				if (this.downloadTask) {
					this.downloadTask.abort();
					this.$refs.down_popup.close();
					this.progress = "0%"; // 新增
					uni.showToast({
						title: this.$t('下载已取消'),
						icon: 'none'
					});
				}
			},
		}
	};
</script>

<style>
	.wrap {
		padding: 40rpx;
	}

	button {
		width: 70%;
		margin: 0 auto;
	}
</style>