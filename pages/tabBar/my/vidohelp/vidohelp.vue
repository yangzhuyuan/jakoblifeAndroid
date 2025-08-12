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
				/* 所有标题 & 链接集中维护，后续只改这里 */
				videoGroups: [{
						title: this.$t('血压计手表测量血压的方法'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/RlypmWN0MCY?si=5ASyo4BscHg6g5Si'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/I68e1F37MiY/ yTy:/ h@b.nQ 12/19'
							}
						]
					},
					{
						title: this.$t('血压手表使用指南'),
						list: [{
								platform: 'youtube',
								url: 'https://youtu.be/6KcstcyECQI?si=3sYP6C9zRTsS0DHe'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/oNYqVycgctI/ caA:/ r@e.oQ 01/25'
							}
						]
					},
					{
						title: this.$t('恢复血压计手表出厂设置'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/VdNT4cOe-34?si=AycDFP_us4Gcpzez'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/R6cEBciC-6U/ Rxf:/ 03/05 T@l.CU'
							}
						]
					},
					{
						title: this.$t('血压计手表如何和手机APP配对'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/sXAIE-AByp0?si=9ssx5R1Yt0EoUec9'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/1N4dAsQf39o/ 11/24 nqr:/ F@H.VL'
							}
						]
					},
					{
						title: this.$t('如何在血压计手表上设置自动血压测试'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/vgJafXCcDrM?si=uM08Ai85E_WdNR2s'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/kVaIUdKWvhQ/ 04/07 QxF:/ l@p.Qk'
							}
						]
					},
					{
						title: this.$t('如何在血压计手表主页上加应用'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/JnQS4z9_ZGg?si=zGtXwG8U2kw1UHAE'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/Caxr4dF4SJo/ QkC:/ j@C.hO 10/22'
							}
						]
					},
					{
						title: this.$t('如何设置血压计手表的语言'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/-WfFVAfCQ9w?si=xKeRTQuDAzjzEsr7'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/kWf-o0k22yk/ 04/02 Ljc:/ z@g.Ok'
							}
						]
					},
					{
						title: this.$t('用血压计手表测血压前要检测的两个要点'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/sap7fmxb250?si=4vVhV8mWRxUmGFKZ'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/pR3E39LYGzc/ SYm:/ 11/18 V@y.TL'
							}
						]
					},
					{
						title: this.$t('如何和其他用户共享数据和设置远程警告'),
						list: [{
								platform: 'youtube',
								url: 'https://youtu.be/2RRliUHgf54?si=WLru3u1PO_4fSE-_'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/QGMVWfjo9Pw/ x@s.eO LJV:/ 01/29'
							}
						]
					},
					{
						title: this.$t('如何在手表关闭经典蓝牙'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/yA8oWSjEA5M?si=3ZFczMb10pYmTPUz'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/A1fJ1_Ir61E/ jca:/ w@f.OX 03/23'
							}
						]
					},
					{
						title: this.$t('如何用手表上打电话'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/cVWe8oCR3nI?si=hsbwRbyddhjFIQN_'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/uotITErUuqw/ 10/25 EhB:/ c@n.Dh'
							}
						]
					},
					{
						title: this.$t('调整表带松紧度的简单方法'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/KjII3nS4ems?si=VlZ_KwIJJ7aUF2MQ'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/s-keXdpfhdc/ xse:/ 08/26 s@r.Rx'
							}
						]
					},
					{
						title: this.$t('如何把表带末端的扣取出和放入'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/BjxTAzoG4C4?si=z2JH1NkVlj4TjVDU'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/bmp-laaV8CI/ xse:/ q@E.HI 04/02'
							}
						]
					},
					{
						title: this.$t('手表如何监测睡眠情况'),
						list: [{
								platform: 'youtube',
								url: 'https://youtube.com/shorts/Ah7FnbcYb-o?si=b_1nUCmvYb2Iy1t4'
							},
							{
								platform: 'douyin',
								url: 'https://v.douyin.com/6NGprluBBDY/ 10/10 oQX:/ l@c.At'
							}
						]
					}
				].filter(g => g.list.length), // 过滤掉空分组
			}
		},

		onLoad(opte) {
			uni.setNavigationBarTitle({
				title: this.$t('血压手表使用指南')
			})
		},

		methods: {
			openUrl(id) {
				uni.navigateTo({
					url: "../../my/vidohelp/Webview2?id=" + id + "&name=" + this.$t('血压手表使用指南')
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
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	}

	.hover {
		opacity: 0.7;
		transform: scale(0.96);
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