<template>
	<view class="page">
		<view v-for="(group, idx) in videoGroups" :key="idx" class="group">
			<view class="group-title">{{ group.title }}</view>
			<view v-for="item in group.list" :key="item.url" class="link-row" hover-class="hover"
				@click="openUrl(item.url)">
				<image class="icon" :src="`/static/image/${item.platform}.png`" mode="aspectFit" />
				<text class="link-text">{{ item.url }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/* 维护这一份数组即可 */
				videoGroups: [{
						title: this.$t('如何把体脂秤和手机APP配对和进行数据同步'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/2C-OynQtFfc?si=sgfSBfERD8k_0mLz'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/3j7Jy70AuWw/ i@p.DU 04/20 QkP:/ '
							}
						]
					},
					{
						title: this.$t('如何使用体脂秤'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/_pLn_zkkt4Q?si=GPTQIJ5pDd3EhZBD'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/wi4aTQblE1c/ N@J.ic TyT:/ 02/14'
							}
						]
					},
					{
						title: this.$t('如何切换体脂秤的测量单位'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/QEPKJSXAAuQ?si=oz0GgQJoMAHNqYL6'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/CBWLYc75y8w/ g@O.xF CUy:/ 05/19'
							}
						]
					},
				].filter(g => g.list.length), // 过滤空分组
			}
		},

		onLoad(opte) {
			uni.setNavigationBarTitle({
				title: this.$t('体脂秤使用指南')
			})
		},

		methods: {
			openUrl(url) {
				uni.navigateTo({
					url: "../../my/vidohelp/Webview2?id=" + url + "&name=" + this.$t('体脂秤使用指南')
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		padding: 20rpx 32rpx 120rpx;
	}

	.group-title {
		margin: 40rpx 0 16rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #000;
	}

	.link-row {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 20rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.hover {
		opacity: 0.7;
		/* 点击时颜色 */
		transform: scale(0.96);
		/* 可选：微缩放增强反馈 */
	}

	.icon {
		width: 28px;
		height: 28px;
		margin-right: 12px;
		flex-shrink: 0;
	}

	.link-text {
		flex: 1;
		font-size: 14px;
		color: #3298F7;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>