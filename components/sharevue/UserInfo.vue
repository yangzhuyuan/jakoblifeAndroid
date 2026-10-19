<template>
	<view class="userinfo-card">
		<view class="userinfo-avatar-wrap">
			<image class="imgas" mode="aspectFit"
				:src="show1?(item.receiverAvatar || '../../../static/icons/60x60.png'):(item.shareAvatar || '../../../static/icons/60x60.png')" />
		</view>
		<view class="userinfo-name">
			{{show1? (item.receiverName || 'NA'):(item.shareName || 'NA') }}
		</view>
		<view class="userinfo-status">
			{{ show1 ? $t('您正在与') + " "+item.receiverName + " "+ $t('共享') : " "+item.shareName + " "+ $t('正在与您共享以下健康数据') }}
		</view>
		<view class="userinfo-subtitle">
			{{$t('注本页面显示均为最近测量数据')}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			show1: Boolean
		}
	}
</script>

<style scoped>
	.userinfo-card {
		display: flex;
		align-items: center;
		flex-direction: column;
		background: #FFFFFF;
		border-radius: 18px;
		padding: 20px 16px 16px;
		margin-left: 1px;
		margin-right: 1px;
		margin-top: 1px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		box-sizing: border-box;
	}

	.userinfo-avatar-wrap {
		display: inline-block;
	}

	.imgas {
		object-fit: contain;
		display: block;
		width: 80px;
		height: 80px;
		border-radius: 100px;
		border: 1px solid #E5E8EF;
		background: #FFFFFF;
	}

	.userinfo-name {
		font-weight: 700;
		font-size: 17px;
		margin-top: 12px;
		color: #1A1A1A;
	}

	.userinfo-status {
		margin-top: 8px;
		font-weight: 500;
		font-size: 14px;
		color: #333333;
		text-align: center;
		line-height: 1.4;
		padding: 0 8px;
	}

	.userinfo-subtitle {
		font-size: 12px;
		color: #999999;
		margin-top: 6px;
		text-align: center;
		font-weight: 400;
	}
</style>