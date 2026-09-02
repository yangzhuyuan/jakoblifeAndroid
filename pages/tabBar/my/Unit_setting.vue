<template>
	<view class="page">
		<view class="section">
			<view class="hs-header">
				<view class="empty-header">
					<text class="section-title-1">{{ $t('设置') }}</text>
					<view class="hint">
						<uni-icons type="info" size="16" color="#9AA8B8"></uni-icons>
						<text class="hint-text">{{ $t('您可以随时更改这些设置') }}</text>
					</view>
				</view>
				<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			</view>
			<text class="section-title">{{ $t('测量单位') }}</text>
			<view class="card">
				<unit-row v-for="(item, index) in rows" :key="index" :title="$t(item.title)" :array="item.array"
					:storage-key="item.key" :current-index="indexMap[item.key] || 0" :icon="item.icon"
					:hide-line="index === rows.length - 1" @unit-change="collectUnit" />
			</view>
		</view>
		<view class="section">
			<text class="section-title">{{ $t('测量偏好') }}</text>
			<view class="card">
				<view class="pref-row">
					<view class="pref-icon">
						<image class="pref-icon-img" src="/static/page_icon/danwei_1.png" mode="aspectFit" />
					</view>
					<view class="pref-text">
						<text class="pref-title">{{ $t('压力指数') }}</text>
						<text class="pref-desc">{{ $t('每次测量血压后自动计算压力指数') }}</text>
						<text class="pref-desc pref-desc-warn">{{ $t('这个功能必须打开才能使用无感血压测量它用于AI模型训练') }}</text>
					</view>
					<switch :checked="switchHER" @change="switch1ChangeHER" color="#4CD964" class="pref-switch" />
				</view>
			</view>
		</view>
		<view class="actions">
			<view class="btn-save" @tap="saveUnit">{{ $t('保存更改') }}</view>
			<view class="btn-cancel" @tap="cancelUnit">{{ $t('取消') }}</view>
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
						array: ['mmHg', 'kPa'],
						icon: '/static/page_icon/danwei_2.png'
					},
					{
						title: '身高',
						key: 'danwei1',
						array: [this.$t("英寸"), this.$t("厘米")],
						icon: '/static/page_icon/danwei_3.png'
					},
					{
						title: '体重',
						key: 'danwei2',
						array: [this.$t("千克"), this.$t("英镑")],
						icon: '/static/page_icon/danwei_4.png'
					}
				],
				unitMap: {}, // 保存单位值
				indexMap: {}, // 保存索引
				switchHER: uni.getStorageSync("yaliswitchHER") || true,
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('设置')
			})
			this.cardlist()
		},
		methods: {
			switch1ChangeHER(e) {
				let that = this
				that.switchHER = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					// console.log("1that.switchHER", that.switchHER)
					// 关键点：添加下一行确保视图更新
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					// console.log("2that.switchHER", that.switchHER)
				}
			},

			// 接口获取单位配置
			cardlist() {
				const data = {
					dataType: 'Unitdata'
				};
				this.$get(this.$url_APP_IP + '/prod-api/device/data/list', data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200 && res.rows.length > 0 && res.rows[0].data) {
						const parsed = this.robustParseData(res.rows[0].data);
						if (!parsed.length) return;
						const unitData = parsed[0];
						/* ① 字段映射：key ↔ 接口返回字段 */
						const keyMap = {
							Blood: 'bloodUnit',
							danwei1: 'heightUnit',
							danwei2: 'weightUnit',
							yaliswitchHER: 'switchHER'
						};
						/* ② 统一循环：值 → 索引 → 缓存 */
						Object.keys(keyMap).forEach(key => {
							// 处理开关
							if (key === 'yaliswitchHER') {
								const switchVal = unitData[keyMap[key]];
								if (switchVal !== undefined) {
									this.switchHER = switchVal === true || switchVal === 'true';
									uni.setStorageSync("yaliswitchHER", this.switchHER);
								}
								return;
							}
							const value = unitData[keyMap[key]];
							const row = this.rows.find(r => r.key === key);
							if (!row) return;
							// 单位中英文映射
							const unitAlias = {
								'cm': '厘米',
								'inch': '英寸',
								'kg': '千克',
								'lb': '英镑'
							};
							// 尝试查找原始值，如果找不到且存在别名，则用别名查找
							let idx = row.array.indexOf(value);
							if (idx === -1 && unitAlias[value]) {
								idx = row.array.indexOf(unitAlias[value]);
							}
							const safe = idx !== -1 ? idx : 0;
							this.$set(this.unitMap, key, value);
							this.$set(this.indexMap, key, safe);
							uni.setStorageSync(key, safe);
						});
						uni.$emit('UNIT_SETTINGS_CHANGED');
					}
				});
			},
			// 子组件变更
			collectUnit(e) {
				this.unitMap[e.key] = e.value
				this.$set(this.indexMap, e.key, e.index)
			},
			// 保存单位
			saveUnit() {
				const postData = {
					bloodUnit: this.unitMap.Blood,
					heightUnit: this.unitMap.danwei1,
					weightUnit: this.unitMap.danwei2,
					switchHER: this.switchHER
				}
				const editData = {
					dataType: 'Unitdata',
					data: this.formatDatacard([postData])
				}
				this.$post(this.$url_APP_IP + '/prod-api/device/data/editData', editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: this.$t('保存成功'),
							icon: 'none'
						})
						this.cardlist()
					}
				})
			},
			cancelUnit() {
				uni.navigateBack()
			},
			// 格式化数据为接口格式
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',')
			},
			// 解析接口返回的字符串
			robustParseData(dataStr) {
				try {
					const objects = dataStr.split('},{')
					const result = []
					for (let i = 0; i < objects.length; i++) {
						let objStr = objects[i]
						if (i === 0) objStr += '}'
						else if (i === objects.length - 1) objStr = '{' + objStr
						else objStr = '{' + objStr + '}'
						objStr = objStr.replace(/^{{/, '{').replace(/}}$/, '}')
						const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
							v = v.trim()
							if (v === 'true' || v === 'false') return `"${k}":${v}`
							if (!isNaN(v) && v !== '' && !v.includes('/')) return `"${k}":${v}`
							return `"${k}":"${v}"`
						})
						result.push(JSON.parse(fixed))
					}
					return result
				} catch (e) {
					console.error('解析失败:', e)
					return []
				}
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		padding: 20px 32rpx 80px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	.section {
		margin-bottom: 40rpx;
	}

	.hs-header {
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.empty-header {
		margin-top: 15px;
		margin-bottom: 32rpx;
	}

	.section-title {
		display: block;
		font-size: 16px;
		color: #6B7C93;
		margin-bottom: 16rpx;
		padding-left: 8px;
		font-weight: 600;
	}

	.section-title-1 {
		font-size: 44rpx;
		font-weight: 700;
		color: #1A1C1E;
		display: block;
		margin-bottom: 10rpx;
		line-height: 1.25;
	}

	.hs-subtitle {
		font-size: 24rpx;
		color: #8E8E93;
		line-height: 1.45;
		display: block;
	}

	.card {
		background: #fff;
		border-radius: 24rpx;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		overflow: hidden;
	}

	.pref-row {
		display: flex;
		align-items: center;
		padding: 44rpx 40rpx;
	}

	.pref-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #E8F3FE;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.pref-icon-img {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.pref-text {
		flex: 1;
		min-width: 0;
		padding: 0 15px;
	}

	.pref-title {
		display: block;
		font-size: 30rpx;
		font-weight: 600;
		color: #1C1C1E;
		line-height: 1.3;
	}

	.pref-desc {
		display: block;
		font-size: 24rpx;
		color: #8A94A6;
		line-height: 1.45;
		margin-top: 8rpx;
	}

	.pref-desc-warn {
		font-weight: 700;
		color: #E53935;
	}

	.pref-switch {
		transform: scale(0.84);
		transform-origin: center right;
		flex-shrink: 0;
	}

	.hint {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 8rpx;
	}

	.hint-text {
		font-size: 24rpx;
		color: #9AA8B8;
		margin-left: 10rpx;
		line-height: 1.4;
	}

	.actions {
		margin-top: auto;
		padding-top: 80rpx;
	}

	.btn-save {
		height: 96rpx;
		background: #3298F7;
		border-radius: 96rpx;
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.btn-cancel {
		margin-top: 28rpx;
		text-align: center;
		color: #3298F7;
		font-size: 30rpx;
		padding: 12rpx 0;
	}
</style>