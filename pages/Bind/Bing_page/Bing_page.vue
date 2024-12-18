<template>
	<view style="color: black;height: 100vh;background: #EFEFF4;width: 100vw;">
		<view style="">
			<view style="padding:20px;color: black;font-weight: bold;">
				{{SELECT_TYPE==="0" ? $t('XZGLLXitem.title_9') : $t('XZGLLXitem.title_10')}}
			</view>
			<view class="list-container" v-if="listshow">
				<view class="list-item" :class="index == active ? 'active' : ''" v-for="(item, index) in list"
					:key="index">
					<view class="list_item_bg" @click="check_click(index,item.modelConnectType,item.name)">
						<image style="width: 80px; height: 80px;" :src="item.modelPicturePath" />
						<view style="text-align: center; margin-top: 20px;">{{item.name}}</view>
					</view>
				</view>
			</view>

			<view style="text-align: center;" v-else>
				<view style="margin-top: 100px;font-weight: bold;">
					暂无设备型号数据
				</view>
			</view>
		</view>
		<view class="button_bg_view">
			<button class="button_bg" :style="getbutton(active)" @tap="True()">{{$t('login.text_13')}}</button>
			<button class="button_bg" style="margin-top: 10px;" @tap="Unbind()">{{$t('XZGLLXitem.button_4')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {

		computed: {
			...mapState(['tokens'])
		},

		data() {
			return {
				per: 0,
				listshow: true,
				PageSize: '0',
				list: [],
				picture: '../../../static/image.png',
				active: "未选",
				modelConnectType: '',
				name: '',
			}
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t('BDSB')
			})
			that.per = 1
			that.getlist()
		},

		/*下拉刷新*/
		onPullDownRefresh() {
			this.per = 1
			this.getlist()
		},
		/*上拉刷新*/
		onReachBottom() {
			console.log("ssss")
			this.per++
			this.getlist()
		},

		onLoad(opt) {
			console.log("上个页面带过来的数据", opt.SELECT_TYPE)

			this.SELECT_TYPE = opt.SELECT_TYPE
		},

		methods: {
			check_click(index, modelConnectType, name) {
				this.active = index;
				this.modelConnectType = modelConnectType
				this.name = name
			},

			getbutton(bg) {
				return {
					background: bg == "未选" ? "#DBDBDB" : "#3298F7"
				}
			},

			True() {
				if (this.active == "未选") {
					uni.showToast({
						title: this.SELECT_TYPE === "0" ? this.$t('XZGLLXitem.title_9') : this.$t(
							'XZGLLXitem.title_10'),
						icon: "none"
					})
					return
				} else {
					console.log(this.modelConnectType)
					if (this.name == "BP68W") {
						uni.navigateTo({
							url: '../../Bind/Bing_xueya/Bing_xueya?SELECT_TYPE=' + this.SELECT_TYPE
						})
					} else {
						//0-扫码  1-蓝牙 2-WiFi
						if (this.modelConnectType == 0) {
							console.log("aaa")
							uni.navigateTo({
								url: '../../Bind/Bing_page/Bing_page_1?SELECT_TYPE=' + this.SELECT_TYPE
							})
						} else if (this.modelConnectType == 1) {
							uni.navigateTo({
								url: '../../Bind/Bing_xueya/Bing_xueya_LY?SELECT_TYPE=' + this.SELECT_TYPE
							})
						} else if (this.modelConnectType == 2) {
							uni.navigateTo({
								url: '../../Bind/Bing_xueya/Bing_xueya?SELECT_TYPE=' + this.SELECT_TYPE
							})
						}
					}
				}
			},
			Unbind() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			},

			//获取设备型号列表
			getlist() {
				let that = this
				console.log(uni.getStorageSync("token"))
				uni.request({
					url: that.$url_list,
					method: 'GET',
					data: {
						pageNum: that.per,
						pageSize: 10,
						reasonable: false,
						modelType: that.SELECT_TYPE
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("获取设备型号列表", res)
						uni.stopPullDownRefresh()
						if (res.data.code == 200) {
							if (that.per == 1) {
								that.list = []
							}
							for (let i = 0; res.data.rows.length > i; i++) {
								that.list.push(res.data.rows[i])
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			}

		}
	}
</script>

<style>
	.list-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, calc((100vw - 40px) / 2));
		padding: 0 15px 0 15px;
		justify-content: space-between;
		padding-bottom: 160px;
	}

	.list-item {
		/* 两列宽度分配比例 */
		margin-bottom: 10px;
		/* 列表项间距 */
		background: white;
		border-radius: 30px;
		/* 背景色 */
		padding: 15px;
		/* 内边距 */
		box-sizing: border-box;
		/* 盒模型 */

	}


	.list_item_bg {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 160px;
	}

	.active {
		border: 2px solid #3298F7;
		color: #3298F7;
	}

	.button_bg_view {
		background: #EFEFF4;
		width: 100vw;
		height: 100px;
		display: flex;
		position: fixed;
		bottom: 0;
		flex-direction: column;
		padding-top: 20px;
		padding-bottom: 25px;
	}

	.button_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80vw;
		color: white;
		background: #DBDBDB;
		border-radius: 30px;
	}
</style>