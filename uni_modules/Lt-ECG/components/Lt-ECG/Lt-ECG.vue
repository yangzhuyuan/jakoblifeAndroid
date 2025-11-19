<template>
	<view>
		<canvas type="2d" id="canvas" style="width:375px;height:1250px"></canvas>
	</view>
</template>
<script>
	import EGC from "./EGC.js"
	export default {
		props: {
			ecgArr: {
				type: Array,
				default: []
			},
			pageNum: {
				type: Number,
				default: 0
			}
		},
		watch: {
			ecgArr(val, oldVal) {
				if (val.length > 0) {
					setTimeout(() => {
						// #ifdef H5
						this.ecg.curveChart(val, this.dpx);
						// #endif
						// #ifdef MP
						this.ecg.curveChart(val);
						// #endif
					}, 500)
				}
			}
		},
		data() {
			return {
				ecg: null,
				dpx: 2
			}
		},
		mounted() {
			let query = this.createSelectorQuery(); // 存一个 SelectorQuery 对象实例
			query.select('#canvas') // 在当前页面下选择 canvas 的节点，返回一个 NodesRef 对象实例，可以用于获取节点信息。
				.fields({ // 获取节点的相关信息
					node: true, // 是否返回节点对应的 Node 实例
					size: true // 是否返回节点尺寸
				})

			// #ifdef H5
			query = document.getElementById("canvas");
			// #endif
			uni.showLoading({
				title: '加载数据中',
			})
			/**
			 * 功能：实例化 ECG 类
			 * @author LOVEtwelve
			 * @date 2023-03-09
			 * @param {Object} 
			 * @argument {SelectorQuery} query Canvas的DOM对象
			 * @argument {Number} bigGridX 最大号格子在X轴方向上的个数
			 * @argument {Number} bigGridY 最大号格子在Y轴方向上的个数
			 * @argument {Number} dpx H5中需除以2
			 * @argument {String} direction 心电图方向 x为横向 y为竖向
			 * @argument {Number} index 若 index 为 0 则会绘制标注图案
			 */

			this.ecg = new EGC(query, 3, 10, 2, "y", this.pageNum);
		}
	}
</script>
<style>
</style>
