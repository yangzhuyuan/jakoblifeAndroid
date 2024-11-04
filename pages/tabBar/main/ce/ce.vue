<template>
	<view class="drag-container">
		<basic-drag v-model="list" :disableds="false" itemKey="title" :column="2" itemHeight="115px">
			<template #item="{element}">
				<view class="data_item_bg">
					<view class="icon_bg">
						<image :src="element.image" class="img_style" />
						<text class="icon_text_bg">{{element.title}}</text>
					</view>
					<view style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
						<text style="text-align: right;font-size: 16px;">{{element.Step_number}}</text>
						<text style="text-align: right;color: gray;font-size: 12px;">计步</text>
						<text style="text-align: right;font-size: 14px;">{{element.Step_count}}</text>
					</view>
				</view>
			</template>
		</basic-drag>
		

	</view>
</template>

<script>
	import BasicDrag from '@/components/basic-drag/index.vue';
	export default {
		components: {
			BasicDrag
		},
		data() {
			return {
				
				list: [{
					image: "../../../../static/icons/1.png",
					Step_number: "10",
					title: '学习',
					Step_count: "20"
				}, {
					image: "../../../../static/icons/2.png",
					Step_number: "10",
					title: '学习1',
					Step_count: "20"
				}, {
					image: "../../../../static/icons/4.png",
					Step_number: "10",
					title: '学习2',
					Step_count: "20"
				}, {
					image: "../../../../static/icons/6.png",
					Step_number: "10",
					title: '学习3',
					Step_count: "20"
				}],
			};
		},

		onShow() {
			// console.log(this.list[0].title)
			// this.list[0].title = "aaa"
			// this.list[1].title = "ccc"
		}


	};
</script>
<style>
	.data_item_bg {
		width: 40vw;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		padding: 10px;
	}

	.icon_text_bg {
		margin-top: 10px;
		width: 60px;
		text-align: center;
		margin-left: 5px;
		font-weight: bold;
	}

	.icon_bg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.img_style1 {
		width: 50px;
		height: 50px;
	}

	.drag-container {
		padding: 10px;
	}
</style>