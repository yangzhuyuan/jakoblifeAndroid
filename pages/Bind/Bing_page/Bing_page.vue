<template>
	<view class="backstye">
		<view class="typesstyles">
			{{ SELECT_TYPE === "0" ? $t('请选择血压计型号') : $t('请选择体脂秤型号') }}
		</view>
		<view class="list-container" v-if="listshow">
			<view class="list-item" :class="index == active ? 'active' : ''" v-for="(item, index) in list" :key="index">
				<view class="list_item_bg" @click="check_click(index, item.modelConnectType, item.name)">
					<image class="imagsest" mode="aspectFit" :src="item.modelPicturePath" />
					<view class="namstysle">{{item.name}}</view>
				</view>
			</view>
		</view>
		<view v-else class="nullstye">
			<view class="nullstye_1">
				{{ $t("暂无设备型号数据") }}
			</view>
		</view>
		<view v-if="SHEBEI === '0'" class="button_bg_view">
			<button class="button_bg" plain="true" :style="{background: active===$t('未选') ? '#DBDBDB' : '#3298F7'}"
				@tap="True()">{{ $t('确定') }}
			</button>
			<button class="button_bg_1" style="margin-top: 10px;" @tap="Unbind()">
				{{ $t('暂不绑定') }}
			</button>
		</view>
		<view v-else class="button_bg_view">
			<button class="button_bg" plain="true" :style="{background: active ===$t('未选') ? '#DBDBDB' : '#3298F7'}"
				@tap="True()">{{ $t('下一步') }}
			</button>
			<view class="viewstylesss" @click="NOclick()">
				{{ $t("不知道设备型号") }}
			</view>
		</view>
	</view>
</template>


<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const lan = uni.getLocale();
	// 定义图片路径映射表
	const modelIdToImagePath = {
		30000: "/static/image/shoubiao1.png", // 手表
		30001: "/static/image/shoubiao1.png", // 手表
		20000: "/static/image/tizhi1.jpg", // 体脂秤
		20001: "/static/image/tizhi1.jpg", // 体脂秤
		10000: "/static/image/xueya1.png", // 血压计
		10001: "/static/image/xueya1.png", // 血压计
		10002: "/static/image/xueya1.png", // 血压计
		10003: "/static/image/xueya1.png", // 血压计
		10004: "/static/image/xueya1.png", // 血压计
		10005: "/static/image/xueya1.png", // 血压计
		10006: "/static/image/xueya1.png", // 血压计
	};
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
				active: this.$t("未选"),
				modelConnectType: '',
				SELECT_TYPE: '',
				name: '',
				SHEBEI: '',
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('绑定设备')
			});
			this.per = 1;
			this.getlist();
		},

		/*下拉刷新*/
		onPullDownRefresh() {
			this.per = 1
			this.getlist()
		},
		/*上拉刷新*/
		onReachBottom() {
			this.per++
			this.getlist()
		},

		onLoad(opt) {
			this.SELECT_TYPE = opt.SELECT_TYPE
			this.SHEBEI = opt.SHEBEI
		},

		methods: {

			// 封装图片路径处理逻辑
			updateModelPicturePath(row, lan) {
				if (row.modelPicturePath) {
					if (lan === 'zh-Hans') {
						return this.$url_APP_IP + row.modelPicturePath;
					} else {
						return modelIdToImagePath[row.modelId];
					}
				} else {
					return modelIdToImagePath[row.modelId];
				}
			},
			check_click(index, modelConnectType, name) {
				this.active = index;
				this.modelConnectType = modelConnectType
				this.name = name
			},
			True() {
				if (this.active == this.$t("未选")) {
					uni.showToast({
						title: this.SELECT_TYPE === "0" ? this.$t('请选择血压计型号') : this.$t(
							'请选择体脂秤型号'),
						icon: "none"
					})
					return
				} else {
					uni.navigateTo({
						url: `../Bing_page/Bind_page_2?modelConnectType=${this.modelConnectType}&SELECT_TYPE=${this.SELECT_TYPE}&name=${this.name}`
					});
				}
			},
			Unbind() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			},
			NOclick() {
				const id = lan === 'zh-Hans' ? 1153 : 1154;
				uni.navigateTo({
					url: `../../Bind/Bing_page/helpcenterss?id=${id}`
				});
			},

			getlist() {
				const data = {
					pageNum: this.per,
					pageSize: 10,
					reasonable: false,
					modelType: this.SELECT_TYPE
				}
				this.$get(this.$url_list, data, {
					'Authorization': 'Bearer ' + (this.tokens === '0' ? uni.getStorageSync("token") : this
						.tokens),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					uni.stopPullDownRefresh();
					if (res.code == 200) {
						if (this.per == 1) {
							this.list = [];
						}
						res.rows.forEach((row) => {
							row.modelPicturePath = this.updateModelPicturePath(row, lan);
						});
						this.list.push(...res.rows);
						const filteredNames = lan === 'zh-Hans' ? ["BPW6"] : ["BPW6"];
						this.list = this.list.filter(item => !filteredNames.includes(item.name));
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})
			},
		}
	}
</script>

<style>
	.backstye {
		color: black;
		height: 100vh;
		background: #EFEFF4;
	}

	.typesstyles {
		padding: 20px;
		color: black;
		font-weight: 400;
		font-size: 16px;
	}

	.list-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 0 10px 160px 10px;
		justify-content: space-between;
	}

	.list-item {
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		background-color: #f3f3f3;
		background: white;
		border-radius: 20px;
		margin: 5px 5px 10px 5px;
		padding: 5px;
		box-sizing: border-box;
	}

	.list_item_bg {
		display: flex;
		flex-direction: column;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 180px;
	}

	.imagsest {
		width: 100%;
		object-fit: contain;
		margin-top: 10px;
	}

	.namstysle {
		text-align: center;
		margin-bottom: 10px;
		margin-top: 10px;
	}

	.nullstye {
		text-align: center;
	}

	.nullstye_1 {
		margin-top: 100px;
		font-weight: bold;
	}

	.active {
		border: 2px solid #3298F7;
		color: #3298F7;
	}

	.button_bg_view {
		background: #EFEFF4;
		width: 100vw;
		display: flex;
		position: fixed;
		bottom: 0;
		flex-direction: column;
		padding-top: 20px;
	}

	.button_bg {
		width: auto;
		height: 48px;
		font-size: 16px;
		margin-left: 20px;
		margin-bottom: 10px;
		margin-right: 20px;
		display: flex;
		font-weight: 600;
		justify-content: center;
		align-items: center;
		color: white !important;
		border: none !important;
		background: #DBDBDB;
		border-radius: 30px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.button_bg_1 {
		width: auto;
		height: 48px;
		font-size: 16px;
		margin: 20px 20px 48px 20px;
		display: flex;
		font-weight: 600;
		justify-content: center;
		align-items: center;
		color: white;
		background: #3298F7;
		border-radius: 30px;
	}

	.viewstylesss {
		text-align: center;
		margin-bottom: 20px;
		color: #3298F7;
		margin-top: 10px;
		font-size: 12px;
		font-weight: 400;
	}
</style>