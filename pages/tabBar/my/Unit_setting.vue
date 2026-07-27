<template>
	<view style="padding:20px;color:#000;height:100vh">
		<view class="view_bg">
			<unit-row v-for="(item, index) in rows" :key="index" :title="$t(item.title)" :array="item.array"
				:storage-key="item.key" :current-index="indexMap[item.key] || 0" @unit-change="collectUnit" />
		</view>
		<view class="context_btn2">
			<view class="context_title1">{{$t('压力开关')}}</view>
			<switch :checked="switchHER" @change="switch1ChangeHER" color="#4CD964" />
		</view>
		<button type="primary" style="margin:50px 20px 0 20px;border-radius: 100px;" @tap="saveUnit">
			{{ $t("保存") }}
		</button>
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
						array: [this.$t("英寸"), this.$t("厘米")]
					},
					{
						title: '体重',
						key: 'danwei2',
						array: [this.$t("千克"), this.$t("英镑")]
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
					console.log("获取单位配置", res)
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

							console.log(key, value);
							console.log(row.array);

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

							console.log(idx);

							const safe = idx !== -1 ? idx : 0;
							this.$set(this.unitMap, key, value);
							this.$set(this.indexMap, key, safe);
							uni.setStorageSync(key, safe);
						});
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
				console.log("editData", editData)
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

<style>
	.view_bg {
		padding: 0 20px;
		background: #fff;
		line-height: 48px;
		border-radius: 10px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.context_btn2 {
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
		height: auto;
		/* 改为自动高度，支持多行 */
		min-height: 56px;
		/* 最小高度保持原样 */
		margin: 30px 0;
		padding: 12px 20px;
		/* 增加上下内边距 */
		border-radius: 10px;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
	}

	.context_title1 {
		flex: 1;
		/* 占据剩余空间 */
		font-size: 16px;
		color: black;
		line-height: 1.4;
		/* 设置合适的行高 */
		word-break: break-word;
		/* 允许断行 */
		padding-right: 12px;
		/* 与switch保持间距 */
	}
</style>