<template>
	<view style="display: flex; align-items: center; flex-direction: column;">
		<view style="display: inline-block;">
			<image class="imgas" mode="aspectFit"
				:src="show1?(item.receiverAvatar || '../../../static/icons/60x60.png'):(item.shareAvatar || '../../../static/icons/60x60.png')" />
		</view>
		<view style="font-weight: 600; font-size: 16px; margin-top: 10px; color: #1A1A1A;">
			{{show1? (item.receiverName || 'NA'):(item.shareName || 'NA') }}
		</view>
		<view style="margin-top: 10px; font-size: 16px; color: #999999; font-weight: 400;">
			{{show1? (item.receiverPhone || 'NA'):(item.receiverPhone || 'NA') }}
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