<template>
	<view style="padding: 20px; background: #F7F7F7; color: black;height: 100vh;background: #EFEFF4;">
		<view style="display: flex;align-items: center; flex-direction: column; margin-top: 40px;">
			<image src="../../../static/icons/96x96.png" style="width: 80px; height: 80px;"></image>
			<text style="margin-top: 20px;font-size: 18px; font-weight: bold;">JakobLife</text>
			<text style="margin-top: 10px;font-size: 12px; color: gray;">{{version}}</text>
			<text style="font-size: 12px; color: gray;" @click="beiandianji()">{{Record_number}}</text>
		</view>
		<view class="bg">
			<!-- 保留原有导航项 -->
			<view class="bt_BG" @click="Text_content2()">
				<view class="text">{{$t('JakobLife软件移动客户端用户使用规范1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content3()">
				<view class="text">{{$t('JakobLife隐私政策1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content9()">
				<view class="text">{{$t('软件更新')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 下载进度弹窗 -->
		<uni-popup ref="down_popup" :mask-click="false">
			<view style="width: 80vw; background:#fff; padding: 20px; border-radius: 10px; align-items: center;">
				<view style="text-align: center; font-weight: bold; margin-bottom: 15px;">{{$t("正在下载更新")}}</view>
				<progress :percent="progress" show-info activeColor="#10AEFF" stroke-width="3" />
				<view
					style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #666;">
					<view>{{$t('已下载')}}: {{formattedDownloaded}}</view>
					<view>{{$t('总大小')}}: {{formattedTotalSize}}</view>
				</view>
				<view style="display: flex; justify-content: center; margin-top: 20px;">
					<button @click="cancelDownload"
						style="background: #10AEFF; color: white; width: 40%;">{{$t('取消下载')}}</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const systemInfo = uni.getSystemInfoSync()
	export default {
		data() {
			return {
				version: this.$t('当前版本') + systemInfo.appVersion,
				Record_number: this.$t('备案号'),
				progress: 0, // 进度百分比
				downloadedSize: 0, // 已下载字节数
				totalSize: 0, // 总字节数
				downloadTask: null, // 下载任务对象
				isMandatory: false, // 是否为强制更新
			}
		},

		computed: {
			// 格式化已下载大小
			formattedDownloaded() {
				return this.formatBytes(this.downloadedSize);
			},
			// 格式化总大小
			formattedTotalSize() {
				return this.formatBytes(this.totalSize);
			}
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('关于更新')
			})
		},

		methods: {
			// 格式化字节数为易读格式
			formatBytes(bytes, decimals = 2) {
				if (bytes === 0) return '0 Bytes';
				const k = 1024;
				const dm = decimals < 0 ? 0 : decimals;
				const sizes = ['Bytes', 'KB', 'MB', 'GB'];
				const i = Math.floor(Math.log(bytes) / Math.log(k));
				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
			},

			// 取消下载
			cancelDownload() {
				if (this.downloadTask) {
					this.downloadTask.abort();
					this.$refs.down_popup.close();
					uni.showToast({
						title: this.$t('下载已取消'),
						icon: 'none'
					});
				}
			},

			beiandianji() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Webview"
				})
			},

			// 保留原有的导航方法
			Text_content2() {
				uni.navigateTo({
					url: "../my/Text_content?id=1"
				})
			},
			Text_content3() {
				uni.navigateTo({
					url: "../my/Text_content?id=1130"
				})
			},

			Text_content9() { //软件更新
				if (uni.getSystemInfoSync().platform === 'android') {
					this.check_new_version("com.work.jakob", "0")
				} else {
					this.check_new_version("io.dcloud.jakob", "1")
				}
			},

			// 检查新版本
			check_new_version(pkgName, type) {
				let that = this;
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/system/version/check_new_version",
					method: 'POST',
					data: {
						pkgName: pkgName,
						type: type,
						versionName: systemInfo.appVersion,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded;'
					},
					success(version) {
						if (version.data.code === 4003) {
							uni.showModal({
								content: that.$t('已经是最新版本1') + systemInfo.appVersion + "\n" + that.$t(
									'已经是最新版本2'),
								showCancel: false
							});
						} else {
							// 保存是否为强制更新
							that.isMandatory = version.data.data.isMandatory || false;

							const title = that.isMandatory ? that.$t('强制更新提示') : that.$t('发现新版本');
							const content = that.$t('版本更新1') + version.data.data.versionName + that.$t('版本更新2');

							uni.showModal({
								title: title,
								content: content,
								confirmText: that.$t('立即更新'),
								cancelText: that.isMandatory ? '' : that.$t('稍后再说'),
								showCancel: !that.isMandatory,
								success: function(res) {
									if (res.confirm) {
										that.$refs.down_popup.open("center")
										that.checkUpdate(version.data.data.path)
									} else if (that.isMandatory) {
										// 强制更新不允许取消
										that.check_new_version(pkgName, type);
									}
								}
							});
						}
					},
					fail(err) {
						uni.showToast({
							title: that.$t('检查更新失败'),
							icon: 'none'
						});
					}
				})
			},

			// 执行更新
			checkUpdate(path) {
				// 重置进度
				this.progress = 0;
				this.downloadedSize = 0;
				this.totalSize = 0;

				// 下载APK
				this.downloadTask = uni.downloadFile({
					url: path,
					success: res => {
						if (res.statusCode !== 200) {
							this.$refs.down_popup?.close();
							uni.showModal({
								title: this.$t('下载失败'),
								content: this.$t('服务器返回状态码') + res.statusCode,
								showCancel: false
							});
							return;
						}

						// 安装APK
						plus.runtime.install(
							res.tempFilePath, {
								force: false
							},
							() => {
								this.$refs.down_popup?.close();
								if (this.isMandatory) {
									// 强制更新直接重启
									plus.runtime.restart();
								} else {
									// 普通更新询问用户
									uni.showModal({
										title: this.$t('安装成功'),
										content: this.$t('需要重启应用生效'),
										success: res => {
											if (res.confirm) plus.runtime.restart();
										}
									});
								}
							},
							err => {
								this.$refs.down_popup?.close();
								uni.showModal({
									title: this.$t('安装失败'),
									content: err.message || this.$t('未知错误'),
									showCancel: false
								});
							}
						);
					},
					fail: err => {
						this.$refs.down_popup?.close();
						uni.showModal({
							title: this.$t('下载失败'),
							content: err.errMsg || this.$t('网络连接失败'),
							showCancel: false
						});
					}
				});

				// 监听下载进度
				this.downloadTask.onProgressUpdate(res => {
					this.progress = res.progress;
					this.downloadedSize = res.totalBytesWritten;
					this.totalSize = res.totalBytesExpectedToWrite;

					// 下载完成时显示安装提示
					if (res.progress >= 100) {
						uni.showToast({
							title: this.$t('下载完成'),
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
		}
	}
</script>

<style>
	.bg {
		display: flex;
		flex-direction: column;
		margin-top: 40px;
		background: white;
		border-radius: 10px;
		padding-bottom: 10px;
		margin-bottom: 50px;
	}

	.bt_BG {
		display: flex;
		flex-direction: row;
		padding: 15px 10px 5px 15px;
		align-items: center;
	}

	.text {
		width: 90%;
		font-size: 14px;
		margin-left: 10px;
	}

	/* 进度条样式 */
	uni-progress {
		width: 100%;
	}

	/* 按钮样式 */
	button {
		border-radius: 20px;
		font-size: 14px;
		padding: 5px 15px;
	}
</style>