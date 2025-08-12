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
						title: this.$t('臂式血压计的安装'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/OlvxABTsPhk?si=UcUSHIL5WQLeAS7e'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/i_hsH1h_aZM/ 04/28 a@n.QX IiP:/'
							}
						]
					},
					{
						title: this.$t('臂式血压计的测试方法'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/PfvazIqB-dY?si=WfqWz1dK_16d7rI_'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/3RqPiUbBAfk/ o@D.Uy 06/24 aAG:/'
							}
						]
					},
					{
						title: this.$t('设置臂式血压计的方法'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/-1y8wscKL3w?si=yNCrVHSdMDqVRWhw'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/94Qh_vr1IEc/ Fho:/ j@P.XZ 05/26'
							}
						]
					},
					{
						title: this.$t('臂式血压计如何和手机APP配对'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/ptCJFFL5doo?si=HeLEKSXDuo7lfnH5'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/h_r5LDLUlZI/ J@I.iP 06/11 Dus:/'
							}
						]
					},
					{
						title: this.$t('如何在血压计上切换用户'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/tm2MA8GuQLc?si=5mawjCpKbRLEIVTk'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/sqZdB2meL8s/ HIi:/ L@w.Fh 01/01'
							}
						]
					},
					{
						title: this.$t('如何查看血压计的历史数据'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/2OxaXqYZrOg?si=J1zY_rCPi-GihTSO'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/v9ndbdDIQcA/ gBT:/ 02/05 P@K.JV'
							}
						]
					}
				].filter(g => g.list.length), // 过滤空分组
			}
		},

		onLoad(opte) {
			uni.setNavigationBarTitle({
				title: this.$t('传统血压计使用指南')
			})
		},

		methods: {
			openUrl(url) {
				uni.navigateTo({
					url: "../../my/vidohelp/Webview2?id=" + url + "&name=" + this.$t('传统血压计使用指南')
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