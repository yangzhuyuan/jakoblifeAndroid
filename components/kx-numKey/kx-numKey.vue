<template>
	<view name='kxNumKey'>
		<!-- <view @click="open" :class="!kxtext?'kxNumKey':'kxNumKey kxtext'">
			<block v-if="!kxtext">
				<text class="kxNumText" v-if="kxdata">{{kxdata}}</text>
				<text class="kxNumText" v-else>{{placeholder||def}}</text>
			</block>
		</view> -->
		<uni-popup ref="popup" type="bottom">
			<view class="kxbottom">
				<block v-if="!kxbut">
					<view class="kxbut">
						<text @click="close">取消</text>
						<text @click="ok">确定</text>
					</view>
					<view class="kxinput">
						<text>{{textS}}</text>
						<text v-if="data">{{data}}</text>
						<text class="default" v-else>{{placeholder||def}}</text>
						<text>{{textE}}</text>
					</view>
				</block>
				<view class="kxnumcon">
					<view class="kxbutitem" v-for="(item,index) in numberData" :key='index'>
						<block v-if="index==numberData.length-1">
							<button class="kxitemconwarn" hover-class='kxitemhover' @click="del">{{item}}</button>
						</block>
						<block v-else>
							<button class="kxitemcon" hover-class='kxitemhover' @click="add(item)">{{item}}</button>
						</block>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '../uni-popup/uni-popup.vue'
	export default {
		name: 'KXNumKey',
		components: {
			uniPopup
		},
		props: {
			kxdata: '',
			placeholder: '',
			textS: '',
			textE: '',
			kxbut: true,
			kxtext:true
		},
		data() {
			return {
				numberData: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '✖'],
				data: '',
				def: '请输入'
			};
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.data = '';
				this.$refs.popup.close()
			},
			add(e) {
				this.data += e
				//判断是否需要点击按钮
				if (this.kxbut) {
					this.$emit("rundata", this.data)
				}
			},
			del() {
				this.data = String(this.data).substring(0, String(this.data).length - 1)
				//判断是否需要点击按钮
				if (this.kxbut) {
					this.$emit("rundata", this.data)
				}
			},
			//返回数据
			ok() {
				this.$emit("rundata", Number(this.data))
				this.data = '';
				this.$refs.popup.close()
			}
		},
		watch: {
			kxdata(e) {
				this.data = e
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
		color: $uni-text-color;
	}

	.kxNumKey {
		display: inline-block;
		color: $uni-text-color;
		.kxNumText {
			color: $uni-text-color-grey;
		}
	}
	.kxtext{
		min-height: 100rpx;
		min-width: 100rpx;
		width: 100%;
	}
	.kxbottom {
		color: $uni-text-color;
		width: 100vw;
		height: auto;
		background: $uni-bg-color;
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;

		text {
			vertical-align: middle;
		}

		.kxbut {
			font-size: 40rpx;
			padding: 37rpx;
			display: flex;
			justify-content: space-between;

			text:last-child {
				color: $uni-color-primary;
			}
		}

		.kxinput {
			width: 100%;
			text-align: center;
			font-size: 38rpx;
			padding: 38rpx;

			text {
				display: inline-block;
				font-weight: bold;
			}

			text:nth-child(2) {
				font-weight: normal;
				margin: 0 28rpx;
				min-width: 33.333%;
				max-width: 64%;
				width: auto;
				height: auto;
				text-overflow: ellipsis;
				/*设置文字超出文本框的内容显示成...*/
				overflow: hidden;
				white-space: nowrap;
				text-align: center;
				padding-bottom: 5rpx;
				border-bottom: 1px solid $uni-text-color-grey;
			}

			.default {
				color: $uni-text-color-grey;
			}
		}

		.kxnumcon {
			width: 100%;
			border-top: 1px solid $uni-bg-color-hover;
			padding: 0 37rpx;
			text-align: center;
			line-height: 110rpx;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			color: $uni-text-color;
			.kxbutitem {
				width: 33.333333%;
				height: 110rpx;
				box-sizing: border-box;
				line-height: 110rpx;
				border-right: 1px solid $uni-bg-color-hover;
				border-bottom: 1px solid $uni-bg-color-hover;

				.kxitemcon {
					width: 100%;
					height: 100%;
					background: $uni-bg-color;
					color: $uni-text-color;
				}

				button:after {
					border: 0;
				}

				.kxitemconwarn {
					width: 100%;
					height: 100%;
					background: $uni-bg-color;
					color: $uni-color-error;
				}

				.kxitemhover {
					background: $uni-bg-color-hover;
				}

			}

			.kxbutitem:nth-child(3n) {
				border-right: 0;
			}

			.kxbutitem:nth-last-child(1),
			.kxbutitem:nth-last-child(2),
			.kxbutitem:nth-last-child(3) {
				border-bottom: 0;
			}
		}
	}
</style>
