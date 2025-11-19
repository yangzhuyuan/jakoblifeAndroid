<template>
	<view style="padding:20px;color:#000;height:100vh">
		<view class="view_bg">
			<!-- 一条配置 = 一行组件 -->
			<unit-row v-for="(item,index) in rows" :key="index" :title="$t(item.title)" :array="item.array"
				:storage-key="item.key" />
		</view>
	</view>
</template>

<script>
	import unitRow from '@/components/unit-row.vue'
	export default {
		components: {
			unitRow
		},
		data() {
			return {
				rows: [{
						title: '血压',
						key: 'Blood',
						array: ['mmHg', 'kPa']
					},
					{
						title: '身高',
						key: 'danwei1',
						array: ['inch', 'cm']
					},
					{
						title: '体重',
						key: 'danwei2',
						array: ['kg', 'lb']
					},
					// ↓后续新增配置直接加
					// { title:'血糖', key:'BloodSugar', array:['mmol/L','mg/dL'] },
				]
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('单位设置')
			})
		}
	}
</script>

<style>
	.view_bg {
		padding: 0 20px;
		background: #fff;
		line-height: 48px;
		border-radius: 10px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}
</style>