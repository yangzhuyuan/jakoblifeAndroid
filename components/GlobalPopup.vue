<template>
	<view v-if="visible" class="mask" @tap="maskClose">
		<!-- 下载进度 -->
		<view v-if="mode==='download'" class="box down-box" @tap.stop>
			<text class="title">{{title||$t('正在下载更新')}}</text>
			<progress :percent="progress" show-info activeColor="#10AEFF" stroke-width="3" />
			<view class="down-info">
				<text>{{$t('已下载')}}: {{formattedDownloaded}}</text>
				<text>{{$t('总大小')}}: {{formattedTotalSize}}</text>
			</view>
			<!-- <button class="btn cancel" @tap="cancel">{{$t('取消下载')}}</button> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				mode: 'tips', // tips | download
				title: '',
				content: '',
				confirmText: '确定',
				cancelText: '取消',
				showCancel: true,
				resolve: null, // 外部 await 用

				/* 下载专用 */
				progress: 0,
				downloadedSize: 0,
				totalSize: 0
			}
		},
		computed: {
			formattedDownloaded() {
				return this.fmt(this.downloadedSize)
			},
			formattedTotalSize() {
				return this.fmt(this.totalSize)
			}
		},
		methods: {
			/* 外部唯一 API --------------------------------------------------*/
			show(opts = {}) {
				this.mode = opts.mode || 'tips'
				this.title = opts.title || ''
				this.content = opts.content || ''
				this.progress = opts.progress || 0
				this.downloadedSize = opts.downloadedSize || 0
				this.totalSize = opts.totalSize || 0

				if (opts.mode === 'download') {
					this.showCancel = false
				} else {
					this.confirmText = opts.confirmText || '确定'
					this.cancelText = opts.cancelText || '取消'
					this.showCancel = opts.showCancel !== false
				}

				this.visible = true
				if (opts.mode !== 'download') {
					return new Promise(r => this.resolve = r)
				}
			},

			/* 关闭 ----------------------------------------------------------*/
			close() {
				this.visible = false
				this.progress = 0
			},

			/* 下载进度实时更新 ----------------------------------------------*/
			onProgress(p) {
				this.progress = p.progress
				this.downloadedSize = p.totalBytesWritten
				this.totalSize = p.totalBytesExpectedToWrite
			},

			/* 按钮事件 ------------------------------------------------------*/
			confirm() {
				this.close()
				this.resolve && this.resolve(true)
			},
			cancel() {
				this.close()
				this.resolve && this.resolve(false)
				this.$emit('cancel') // 下载取消走这里
			},
			maskClose() {
				if (this.mode === 'download') return // 下载时禁止点击蒙层关闭
				this.cancel()
			},

			/* 工具 ---------------------------------------------------------*/
			fmt(bytes, dec = 2) {
				if (bytes === 0) return '0 Bytes'
				const k = 1024,
					dm = dec < 0 ? 0 : dec
				const sizes = ['Bytes', 'KB', 'MB', 'GB']
				const i = Math.floor(Math.log(bytes) / Math.log(k))
				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
			}
		}
	}
</script>

<style scoped>
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.box {
		width: 80%;
		background: #fff;
		border-radius: 12rpx;
		padding: 40rpx;
		text-align: center;
	}

	.down-box {
		padding: 30rpx 40rpx;
	}

	.title {
		font-size: 32rpx;
		font-weight: 700;
		margin-bottom: 20rpx;
		display: block;
	}

	.cnt {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 40rpx;
		display: block;
	}

	.down-info {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666;
		margin: 15rpx 0 30rpx;
	}

	.btn-bar {
		display: flex;
		justify-content: space-around;
	}

	button {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 35rpx;
		font-size: 30rpx;
	}

	button.cancel {
		background: #f2f2f2;
		color: #333;
	}

	button.confirm {
		background: #007aff;
		color: #fff;
	}
</style>