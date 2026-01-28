<template>
	<view class="blood-pressure-list">
		<!-- 日历视图 -->
		<template v-if="viewType === 'calendar'">
			<view v-for="(item, index) in swipeData" :key="`calendar-${index}`" class="record-area">
				<!-- 主卡片滑动删除 -->
				<view class="swipe-container">
					<!-- 删除按钮 -->
					<view class="delete-btn" @tap.stop="handleDelete(item, index)">
						<uni-icons style="margin-left: 20px;" type="trash" size="28" color="#fff" />
						<text class="delete-text">{{ $t("删除") }}</text>
					</view>

					<!-- 可滑动内容 -->
					<view class="swipe-content" :style="{ transform: `translateX(${item.x}px)` }"
						@touchstart="onTouchStart($event, index, 'main')"
						@touchmove="onTouchMove($event, index, 'main')" @touchend="onTouchEnd($event, index, 'main')"
						@tap="onCardTap(index, 'main')">
						<view class="record-card">
							<view class="record-header">
								<view class="record-icon">
									<image src="@/static/icons/3.png" class="icon-img" mode="aspectFit" />
									<text class="icon-label">{{ $t("平均血压") }}</text>
								</view>
								<view class="record-main">
									<view class="title-bar">
										<view class="pressure-level">
											<view class="level-indicator"
												:style="{backgroundColor: getPressureColor(item.object.summary.xueyalist)}" />
											<text class="level-text">
												{{ item.object.summary.level }}
											</text>
											<uni-icons type="help" size="15" @tap="$emit('show-bmi-info')" />
										</view>
										<view class="device-name">{{ item.modelName }}</view>
									</view>
									<view class="divider"></view>
									<view class="data-display">
										<view class="data-item">
											<text class="data-label">{{ $t("收缩压") }}/{{ bloodUnit }}</text>
											<text class="data-value">
												{{ formatPressureValue(item.object.summary.highPressureAvg) }}
											</text>
										</view>
										<view class="data-item">
											<text class="data-label">{{ $t("舒张压") }}/{{ bloodUnit }}</text>
											<text class="data-value">
												{{ formatPressureValue(item.object.summary.lowPressureAvg) }}
											</text>
										</view>

										<view class="data-item">
											<text class="data-label">{{ $t("脉搏") }}/BPM</text>
											<text class="data-value">
												{{ item.object.summary.heartrateAvg }}
											</text>
										</view>

										<view class="expand-btn" @tap.stop="toggleExpand(index)">
											<uni-icons :type="item.object.summary.expanded ? 'top' : 'bottom'"
												size="22" />
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- ****** 纵向明细 ****** -->
				<view v-if="item.object.summary.expanded" class="detail-records">
					<view v-for="(detail, dIdx) in visibleDetails(item)" :key="`detail-${dIdx}`" class="detail-area">
						<!-- 明细卡片滑动删除 -->
						<view class="detail-swipe-container">
							<!-- 删除按钮 -->
							<view class="detail-delete-btn"
								@tap.stop="handleDeleteDetail(item, dIdx, detail.timestamp)">
								<uni-icons style="margin-left: 20px;" type="trash" size="20" color="#fff" />
								<text class="delete-text">{{ $t("删除") }}</text>
							</view>

							<!-- 可滑动内容 -->
							<view class="detail-swipe-content" :style="{ transform: `translateX(${detail.x}px)` }"
								@touchstart="onTouchStart($event, {parentIndex: index, detailIndex: dIdx}, 'detail')"
								@touchmove="onTouchMove($event, {parentIndex: index, detailIndex: dIdx}, 'detail')"
								@touchend="onTouchEnd($event, {parentIndex: index, detailIndex: dIdx}, 'detail')"
								@tap="onCardTap({parentIndex: index, detailIndex: dIdx}, 'detail')">
								<view class="detail-card">
									<view class="detail-header">
										<view class="detail-icon">
											<image src="@/static/icons/3.png" class="icon-img" mode="aspectFit" />
											<text class="icon-label">{{ detail.time }}</text>
										</view>

										<view class="detail-main">
											<view class="title-bar">
												<view class="pressure-level">
													<view class="level-indicator"
														:style="{ backgroundColor: getPressureColor(detail.xueyalist1) }" />
													<text class="level-text">{{ detail.level2 }}</text>
													<uni-icons type="help" size="15" @tap="$emit('show-bmi-info')" />
												</view>
												<text class="device-name">{{ item.modelName }}</text>
											</view>

											<view class="divider divider-detail" />

											<view class="data-display">
												<view class="data-item">
													<view class="data-label">{{ $t("收缩压") }}/{{ bloodUnit }}</view>
													<view class="data-value">
														{{ formatPressureValue(detail.highPressure) }}
													</view>
												</view>
												<view class="data-item">
													<view class="data-label">{{ $t("舒张压") }}/{{ bloodUnit }}</view>
													<view class="data-value">
														{{ formatPressureValue(detail.lowPressure) }}
													</view>
												</view>
												<view class="data-item">
													<view class="data-label">{{ $t("脉搏") }}/BPM</view>
													<view class="data-value">{{ detail.heartrate }}</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<!-- 加载更多 -->
					<view v-if="hasMore(item)" class="load-more" @tap="loadMoreDetail(item)">
						<text>{{$t("加载更多")}}</text>
					</view>
				</view>
			</view>
		</template>
		<!-- 列表视图 -->
		<template v-else>
			<view v-for="(item, index) in swipeData" :key="`list-${index}`" class="list-record-area">
				<!-- 列表视图的主卡片滑动删除 -->
				<view class="swipe-container">
					<!-- 删除按钮 -->
					<view class="delete-btn" @tap.stop="handleDelete(item, index)">
						<uni-icons style="margin-left: 20px;" type="trash" size="28" color="#fff" />
						<text class="delete-text">{{$t("删除")}}</text>
					</view>

					<!-- 可滑动内容 -->
					<view class="swipe-content" :style="{ transform: `translateX(${item.x}px)` }"
						@touchstart="onTouchStart($event, index, 'main')"
						@touchmove="onTouchMove($event, index, 'main')" @touchend="onTouchEnd($event, index, 'main')"
						@tap="onCardTap(index, 'main')">
						<view class="list-record-card" :class="{ 'expanded-card': item.object.summary.expanded }">
							<view class="list-record-header">
								<view class="list-record-icon">
									<image src="@/static/icons/3.png" class="icon-img" mode="aspectFit" />
									<text class="icon-label">{{ formatListDate(item.dateTime) }}</text>
								</view>
								<view class="list-record-main">
									<view class="list-title-bar">
										<view class="list-bmi-level">
											<view class="level-indicator"
												:style="{ backgroundColor: getPressureColor(item.object.summary.xueyalist) }">
											</view>
											<text class="level-text">{{ item.object.summary.level }}</text>
											<uni-icons type="help" size="15" @tap="$emit('show-bmi-info')"></uni-icons>
										</view>
										<text class="list-device-name">{{ item.modelName }}</text>
									</view>

									<view class="list-divider"></view>

									<view class="list-data-display">
										<view class="list-data-item">
											<text class="list-data-label">{{$t('收缩压')}}/{{ bloodUnit }}</text>
											<text
												class="list-data-value">{{ formatPressureValue(item.object.summary.highPressureAvg) }}</text>
										</view>
										<view class="list-data-item">
											<text class="list-data-label">{{$t('舒张压')}}/{{ bloodUnit }}</text>
											<text
												class="list-data-value">{{ formatPressureValue(item.object.summary.lowPressureAvg)}}</text>
										</view>
										<view class="list-data-item">
											<text class="list-data-label">{{$t('脉搏')}}/BPM</text>
											<text class="list-data-value">{{ item.object.summary.heartrateAvg }}</text>
										</view>
										<view class="list-expand-btn" @tap.stop="toggleExpand(index)">
											<uni-icons :type="item.object.summary.expanded ? 'top' : 'bottom'"
												size="22"></uni-icons>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 展开的数据表格 -->
				<view v-if="item.object.summary.expanded" class="expanded-table">
					<view v-for="(detail, detailIndex) in item.object.details" :key="`table-detail-${detailIndex}`"
						class="table-row">
						<text class="table-cell time-cell">{{ detail.time }}</text>
						<text class="table-cell">{{formatPressureValue( detail.highPressure )}}</text>
						<text class="table-cell">{{formatPressureValue( detail.lowPressure )}}</text>
						<text class="table-cell">{{ detail.heartrate }}</text>
						<text class="table-cell"></text>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: "BloodPressureList",
		props: {
			data: {
				type: Array,
				default: () => []
			},
			viewType: {
				type: String,
				default: "calendar"
			},
			bloodUnit: {
				type: String,
				default: "mmHg"
			}
		},
		data() {
			return {
				swipeData: [],
				loadedMap: {},
				touchStartX: 0,
				currentSwipeId: null, // 当前滑动的卡片ID {type: 'main'/'detail', index: number or {parentIndex, detailIndex}}
				isSwiping: false,
				lastSwipeId: null, // 上一次滑动的卡片ID
				startX: 0 // 记录开始滑动时的位置
			};
		},
		watch: {
			data: {
				immediate: true,
				handler(newData) {
					this.swipeData = newData.map((item) => ({
						...item,
						x: 0,
						object: {
							...item.object,
							summary: {
								...item.object.summary,
								expanded: !!item.object.summary.expanded
							},
							details: item.object.details.map((d) => ({
								...d,
								x: 0
							}))
						}
					}));
				}
			}
		},
		methods: {
			// 列表视图日期格式化
			formatListDate(dateString) {
				return dateString.slice(5, 10);
			},

			formatPressureValue(v) {
				return this.bloodUnit === "mmHg" ? v : (v * 0.133).toFixed(1);
			},

			getPressureColor(l) {
				const map = {
					0: "#58BF78",
					1: "#FFEC01",
					2: "#FCCD41",
					3: "#F55A5A",
					4: "#FFFFFF"
				};
				return map[l] || "#FFFFFF";
			},

			toggleExpand(index) {
				const s = this.swipeData[index].object.summary;
				this.$set(s, "expanded", !s.expanded);
				this.$emit("toggle-expand", index);

				// 展开时重置所有滑动位置
				this.resetAllSwipePositions();

				// 如果展开当前卡片，收起其他卡片
				if (s.expanded) {
					this.collapseOtherExpandedLists(index, 'main');
				}
			},

			// 统一的滑动事件处理
			onTouchStart(e, index, type) {
				// 阻止事件冒泡
				if (e && e.stopPropagation) {
					e.stopPropagation();
				}

				this.touchStartX = e.touches[0].clientX;
				this.isSwiping = false;

				// 记录开始滑动时的位置
				this.startX = this.getCardPosition(type, index);

				// 生成当前卡片ID
				const currentSwipeId = {
					type,
					index
				};

				// 如果当前滑动的是新卡片，且之前有卡片被滑动过，则恢复上一个卡片的位置
				if (this.lastSwipeId &&
					(this.lastSwipeId.type !== currentSwipeId.type ||
						JSON.stringify(this.lastSwipeId.index) !== JSON.stringify(currentSwipeId.index))) {
					this.resetLastSwipeCard();
				}

				this.currentSwipeId = currentSwipeId;
			},

			onTouchMove(e, index, type) {
				if (!this.currentSwipeId ||
					this.currentSwipeId.type !== type ||
					JSON.stringify(this.currentSwipeId.index) !== JSON.stringify(index)) return;

				const touchX = e.touches[0].clientX;
				const deltaX = touchX - this.touchStartX;

				// 检测到滑动时，收起其他已展开的明细列表
				if (Math.abs(deltaX) > 10 && !this.isSwiping) {
					this.collapseOtherExpandedLists(index, type);
					this.isSwiping = true;
				}

				// 计算新的位置（基于开始位置 + 偏移量）
				const newX = this.startX + deltaX;

				// 根据卡片类型设置不同的最大滑动距离
				const maxSwipeDistance = type === 'main' ? -80 : -60;
				const minSwipeDistance = 0; // 不能向右滑动超过0

				// 限制滑动范围
				const clampedX = Math.max(maxSwipeDistance, Math.min(minSwipeDistance, newX));

				this.setCardPosition(type, index, clampedX);
				// if (this.swipeData[index].object.summary.expanded) {
				// 	this.toggleExpand(index);
				// }
				// 只在主卡片滑动时才可能收起主卡片
				if (type === 'main' && this.swipeData[index].object.summary.expanded) {
					this.toggleExpand(index);
				}

				if (e && e.stopPropagation) {
					e.stopPropagation();
				}
			},

			onTouchEnd(e, index, type) {
				if (!this.currentSwipeId ||
					this.currentSwipeId.type !== type ||
					JSON.stringify(this.currentSwipeId.index) !== JSON.stringify(index)) return;

				const currentX = this.getCardPosition(type, index);
				const threshold = type === 'main' ? -50 : -40;
				const maxSwipeDistance = type === 'main' ? -80 : -60;

				// 只有真正滑动时才处理
				if (Math.abs(currentX - this.startX) > 5) {
					this.isSwiping = true;

					if (currentX < threshold) {
						this.setCardPosition(type, index, maxSwipeDistance);
						this.lastSwipeId = {
							type,
							index
						};
					} else {
						this.resetSwipeState(index, type);
					}
				} else {
					// 轻微移动视为点击，重置状态
					this.resetSwipeState(index, type);
				}

				this.currentSwipeId = null;
				if (e && e.stopPropagation) e.stopPropagation();
			},

			onCardTap(index, type) {
				// 增加延迟判断，避免滑动误触
				setTimeout(() => {
					if (this.isSwiping) {
						this.isSwiping = false;
						return;
					}

					const currentX = this.getCardPosition(type, index);
					if (currentX < 0) {
						this.resetSwipeState(index, type);
					}
				}, 50);
			},

			// 恢复上一个滑动卡片的位置
			resetLastSwipeCard() {
				if (!this.lastSwipeId) return;

				const {
					type,
					index
				} = this.lastSwipeId;
				this.setCardPosition(type, index, 0);
				this.lastSwipeId = null;
			},

			// 设置卡片位置
			setCardPosition(type, index, x) {
				if (type === 'main') {
					this.$set(this.swipeData[index], 'x', x);
				} else if (type === 'detail') {
					const {
						parentIndex,
						detailIndex
					} = index;
					if (this.swipeData[parentIndex] && this.swipeData[parentIndex].object.details[detailIndex]) {
						this.$set(this.swipeData[parentIndex].object.details[detailIndex], 'x', x);
					}
				}
			},

			// 获取卡片位置
			getCardPosition(type, index) {
				if (type === 'main') {
					return this.swipeData[index].x || 0;
				} else if (type === 'detail') {
					const {
						parentIndex,
						detailIndex
					} = index;
					if (this.swipeData[parentIndex] && this.swipeData[parentIndex].object.details[detailIndex]) {
						return this.swipeData[parentIndex].object.details[detailIndex].x || 0;
					}
				}
				return 0;
			},

			// 收起其他已展开的明细列表
			collapseOtherExpandedLists(currentIndex, currentType) {
				// 如果是主卡片滑动，检查是否需要收起其他展开的主卡片
				if (currentType === 'main') {
					this.swipeData.forEach((item, index) => {
						if (index !== currentIndex && item.object.summary.expanded) {
							this.$set(item.object.summary, "expanded", false);
							// 重置滑动位置
							this.$set(item, "x", 0);
						}
					});
				}
				// 如果是明细卡片滑动，检查是否需要收起其他父级卡片的展开状态
				else if (currentType === 'detail') {
					const {
						parentIndex
					} = currentIndex;
					this.swipeData.forEach((item, index) => {
						if (index !== parentIndex && item.object.summary.expanded) {
							this.$set(item.object.summary, "expanded", false);
							// 重置滑动位置
							this.$set(item, "x", 0);
						}
					});
				}

				// 重置其他卡片的滑动状态
				this.resetAllOtherSwipeStates(currentIndex, currentType);
			},

			// 重置其他卡片的滑动状态
			resetAllOtherSwipeStates(currentIndex, currentType) {
				// 重置主卡片滑动状态
				this.swipeData.forEach((item, index) => {
					if (currentType === 'main' && index !== currentIndex) {
						this.$set(item, "x", 0);
					} else if (currentType === 'detail') {
						const {
							parentIndex
						} = currentIndex;
						if (index !== parentIndex) {
							this.$set(item, "x", 0);
						}
					}
				});

				// 重置明细卡片滑动状态
				this.swipeData.forEach((item, index) => {
					if (item.object.details) {
						item.object.details.forEach((detail, dIdx) => {
							if (currentType === 'main') {
								// 主卡片滑动时，重置所有明细卡片
								this.$set(detail, "x", 0);
							} else if (currentType === 'detail') {
								const {
									parentIndex,
									detailIndex
								} = currentIndex;
								// 只重置非当前明细卡片
								if (index !== parentIndex || dIdx !== detailIndex) {
									this.$set(detail, "x", 0);
								}
							}
						});
					}
				});

				// 清除上一次的滑动记录
				this.lastSwipeId = null;
			},

			// 重置所有滑动位置
			resetAllSwipePositions() {
				// 重置主卡片滑动位置
				this.swipeData.forEach(item => {
					this.$set(item, "x", 0);
				});

				// 重置明细卡片滑动位置
				this.swipeData.forEach(item => {
					if (item.object.details) {
						item.object.details.forEach(detail => {
							this.$set(detail, "x", 0);
						});
					}
				});

				this.lastSwipeId = null;
				this.isSwiping = false;
			},

			// 重置滑动状态
			resetSwipeState(index, type) {
				this.setCardPosition(type, index, 0);

				// 清除滑动记录
				if (this.lastSwipeId &&
					this.lastSwipeId.type === type &&
					JSON.stringify(this.lastSwipeId.index) === JSON.stringify(index)) {
					this.lastSwipeId = null;
				}

				this.isSwiping = false;
			},

			handleDelete(item, idx) {
				// 先收起卡片，防止滑动状态干扰
				this.resetSwipeState(idx, 'main');

				uni.showModal({
					title: this.$t("确认删除"),
					content: this.$t("确定要删除这条记录吗"),
					success: (res) => {
						if (res.confirm) {
							// 如果当前卡片是展开状态，先收起
							if (this.swipeData[idx].object.summary.expanded) {
								this.toggleExpand(idx);
							}

							this.$emit("delete-record", {
								type: "summary",
								index: idx,
								deviceSn: item.deviceSn,
								timestamps: item.object.details.map((d) => +d.timestamp)
							});
						}
					}
				});
			},

			handleDeleteDetail(item, dIdx, ts) {
				// 找到父级索引
				const parentIndex = this.swipeData.findIndex(i =>
					i.deviceSn === item.deviceSn && i.dateTime === item.dateTime
				);

				if (parentIndex !== -1) {
					this.resetSwipeState({
						parentIndex,
						detailIndex: dIdx
					}, 'detail');
				}

				uni.showModal({
					title: this.$t("确认删除"),
					content: this.$t("确定要删除这条详细记录吗？"),
					success: (res) => {
						if (res.confirm) {
							this.$emit("delete-record", {
								type: "detail",
								index: dIdx,
								deviceSn: item.deviceSn,
								timestamps: [+ts]
							});
						}
					}
				});
			},

			loadedKey(item) {
				return `${item.deviceSn}_${item.dateTime}`;
			},

			visibleDetails(item) {
				const key = this.loadedKey(item);
				const loaded = this.loadedMap[key] || 5;
				return item.object.details.slice(0, loaded);
			},

			hasMore(item) {
				const key = this.loadedKey(item);
				const loaded = this.loadedMap[key] || 5;
				return loaded < item.object.details.length;
			},

			loadMoreDetail(item) {
				const key = this.loadedKey(item);
				const current = this.loadedMap[key] || 5;
				this.$set(this.loadedMap, key, current + 5);
			}
		}
	};
</script>

<style scoped>
	.blood-pressure-list {
		padding-bottom: 20px;
	}

	.record-area {
		width: 100%;
		margin-bottom: 15px;
		position: relative;
		overflow: hidden;
	}

	/* 主卡片滑动样式 */
	.swipe-container {
		position: relative;
		width: 100%;
		height: 135px;
		background: #f8f8f8;
		border-radius: 12px;
		overflow: hidden;
	}

	.delete-btn {
		position: absolute;
		right: 0;
		top: 0;
		width: 100px;
		height: 100%;
		background: #f55a5a;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 8;
		border-radius: 0 12px 12px 0;
	}

	.delete-text {
		color: #fff;
		font-size: 12px;
		margin-top: 5px;
		margin-left: 20px;
	}

	.swipe-content {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 10;
		transition: transform 0.2s ease;
	}

	.record-card {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 12px;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.record-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.record-icon {
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon-img {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.icon-label {
		margin-top: 8px;
		text-align: center;
		font-size: 12px;
		color: #666;
	}

	.record-main {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-right: 15px;
		padding-left: 5px;
	}

	.title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}

	.pressure-level {
		display: flex;
		align-items: center;
	}

	.level-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		margin-right: 5px;
	}

	.level-text {
		font-size: 14px;
		font-weight: bold;
		margin-right: 5px;
	}

	.device-name {
		color: #999;
		font-size: 12px;
	}

	.divider {
		width: calc(100% - 20px);
		margin: 8px 10px;
		background: #CCCCCC;
		height: 1px;
	}

	.data-display {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 10px;

	}

	.data-item {
		flex: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.data-label {
		color: #999;
		font-size: 11px;
		margin-bottom: 2px;
	}

	.data-value {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.expand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
	}

	/* ****** 纵向明细 ****** */
	.detail-records {
		margin-top: 20px;
		padding: 0 10px;
		margin-bottom: 20px;
	}

	.detail-area {
		margin-bottom: 15px;
		position: relative;
		overflow: hidden;
	}

	/* 明细卡片滑动样式 */
	.detail-swipe-container {
		position: relative;
		width: 100%;
		height: auto;
		background: #f8f8f8;
		border-radius: 12px;
		overflow: hidden;
	}

	.detail-delete-btn {
		position: absolute;
		right: 0;
		top: 0;
		width: 80px;
		height: 100%;
		background: #f55a5a;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 8;
		border-radius: 0 12px 12px 0;
	}

	.detail-swipe-content {
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 10;
		transition: transform 0.2s ease;
	}

	.detail-card {
		width: 100%;
		background: #fff;
		border-radius: 12px;
		padding: 10px;
		box-sizing: border-box;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.detail-header {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.detail-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 60px;
	}

	.detail-main {
		flex: 1;
		margin-left: 10px;
	}

	.divider-detail {
		width: 90%;
		margin: 4px auto;
	}

	.load-more {
		text-align: center;
		padding: 20px 20px 0 20px;
		font-size: 16px;
		color: #007aff;
	}


	/* 列表视图样式 */
	.list-record-card {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 12px;
		padding: 15px 0;
		box-sizing: border-box;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.list-record-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.list-record-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-width: 80px;
	}

	.list-record-main {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-right: 15px;
	}

	.list-title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}

	.list-bmi-level {
		display: flex;
		align-items: center;
	}

	.list-device-name {
		color: #999;
		font-size: 12px;
	}

	.list-record-area {
		width: 100%;
		margin-bottom: 15px;
		position: relative;
		overflow: hidden;
	}

	.list-divider {
		width: calc(100% - 20px);
		margin: 0 10px;
		background: #CCCCCC;
		height: 1px;
	}

	.list-data-display {
		display: flex;
		justify-content: space-between;
		align-items: center;

	}

	.list-data-item {
		flex: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.list-data-label {
		color: #999;
		font-size: 10px;
		margin-bottom: 2px;
	}

	.list-data-value {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.list-expand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
	}

	/* 体脂列表特有样式 */
	.date-item {
		min-width: 100px;
	}

	.date-value {
		font-size: 14px !important;
		color: #666 !important;
		margin-top: 20px !important;
	}

	.list-date-value {
		font-size: 14px !important;
		color: #666 !important;
		margin-top: 5px !important;
	}

	/* 展开表格样式 */
	.expanded-table {
		position: static;
		margin-top: -10px;
		background: #fff;
		border-radius: 0 0 8px 8px;
		padding: 10px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.table-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid #f0f0f0;
	}
</style>