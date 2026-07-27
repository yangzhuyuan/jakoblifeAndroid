<template>
	<view class="blood-oxygen-list">
		<template v-if="viewType === 'calendar'">
			<view v-for="(item, index) in swipeData" :key="`calendar-${index}`" class="record-area">
				<view class="swipe-container">
					<view class="delete-btn" @tap.stop="handleDelete(item, index)">
						<uni-icons style="margin-left: 20px;" type="trash" size="28" color="#fff" />
						<text class="delete-text">{{ $t("删除") }}</text>
					</view>
					<view class="swipe-content" :style="{ transform: `translateX(${item.x}px)` }"
						@touchstart="onTouchStart($event, index, 'main')"
						@touchmove="onTouchMove($event, index, 'main')" @touchend="onTouchEnd($event, index, 'main')"
						@tap="onCardTap(index, 'main')">
						<view class="record-card">
							<view class="record-header">
								<view class="record-icon">
									<image src="@/static/page_icon/10.png" class="icon-img" mode="aspectFit" />
									<text class="icon-label">{{ $t("血氧") }}</text>
								</view>
								<view class="record-main">
									<view class="title-bar">
										<view class="level-wrap">
											<view class="level-indicator"
												:style="{ backgroundColor: getOxygenColor(item.object.summary.oxygenlist) }" />
											<text class="level-text">{{ item.object.summary.level }}</text>
											<uni-icons type="help" size="15" @tap="$emit('show-bmi-info')" />
										</view>
										<text class="device-name">{{ item.modelName }}</text>
									</view>
									<view class="divider"></view>
									<view class="data-display">
										<view class="data-item">
											<text class="data-label">{{ $t("血氧") }}/%</text>
											<text class="data-value">{{ item.object.summary.oxygenAvg }}</text>
										</view>
										<view class="data-item date-item">
											<text class="data-label"></text>
											<text class="date-value">{{ item.dateTime }}</text>
										</view>
										<view class="expand-btn" @tap.stop="toggleExpand(index)">
											<uni-icons :type="item.object.summary.expanded ? 'top' : 'bottom'" size="22" />
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="item.object.summary.expanded" class="detail-records">
					<view v-for="(detail, detailIndex) in visibleDetails(item)" :key="`detail-${detailIndex}`"
						class="detail-area">
						<view class="detail-swipe-container">
							<view class="detail-delete-btn"
								@tap.stop="handleDeleteDetail(item, detailIndex, detail.timestamp)">
								<uni-icons style="margin-left: 20px;" type="trash" size="20" color="#fff" />
								<text class="delete-text">{{ $t("删除") }}</text>
							</view>
							<view class="detail-swipe-content" :style="{ transform: `translateX(${detail.x}px)` }"
								@touchstart="onTouchStart($event, {parentIndex: index, detailIndex: detailIndex}, 'detail')"
								@touchmove="onTouchMove($event, {parentIndex: index, detailIndex: detailIndex}, 'detail')"
								@touchend="onTouchEnd($event, {parentIndex: index, detailIndex: detailIndex}, 'detail')"
								@tap="onCardTap({parentIndex: index, detailIndex: detailIndex}, 'detail')">
								<view class="detail-card">
									<view class="detail-header">
										<view class="detail-icon">
											<image src="@/static/page_icon/10.png" class="icon-img" mode="aspectFit" />
											<text class="icon-label">{{ detail.time }}</text>
										</view>
										<view class="detail-main">
											<view class="title-bar">
												<view class="level-wrap">
													<view class="level-indicator"
														:style="{ backgroundColor: getOxygenColor(detail.oxygenlist1) }" />
													<text class="level-text">{{ detail.level2 }}</text>
													<uni-icons type="help" size="15" @tap="$emit('show-bmi-info')" />
												</view>
												<text class="device-name">{{ item.modelName }}</text>
											</view>
											<view class="divider divider-detail"></view>
											<view class="data-display">
												<view class="data-item">
													<text class="data-label">{{ $t("血氧") }}/%</text>
													<text class="data-value">{{ detail.oxygen }}</text>
												</view>
												<view class="data-item date-item">
													<text class="data-label"></text>
													<text class="date-value">{{ item.dateTime }}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="hasMore(item)" class="load-more" @tap="loadMoreDetail(item)">
						<text>{{ $t("加载更多") }}</text>
					</view>
				</view>
			</view>
		</template>
		<template v-else>
			<view v-for="(item, index) in swipeData" :key="`list-${index}`" class="list-record-area">
				<view class="swipe-container">
					<view class="delete-btn" @tap="handleDelete(item, index)">
						<uni-icons style="margin-left: 20px;" type="trash" size="28" color="#fff" />
						<text class="delete-text">{{ $t("删除记录") }}</text>
					</view>
					<view class="swipe-content" :style="{ transform: `translateX(${item.x}px)` }"
						@touchstart="onTouchStart($event, index, 'main')"
						@touchmove="onTouchMove($event, index, 'main')" @touchend="onTouchEnd($event, index, 'main')"
						@tap="onCardTap(index, 'main')">
						<view class="list-record-card" :class="{ 'expanded-card': item.object.summary.expanded }">
							<view class="list-record-header">
								<view class="list-record-icon">
									<image src="@/static/page_icon/10.png" class="icon-img" mode="aspectFit" />
									<text class="icon-label">{{ formatListDate(item.dateTime) }}</text>
								</view>
								<view class="list-record-main">
									<view class="list-title-bar">
										<view class="level-wrap">
											<view class="level-indicator"
												:style="{ backgroundColor: getOxygenColor(item.object.summary.oxygenlist) }" />
											<text class="level-text">{{ item.object.summary.level }}</text>
											<uni-icons type="help" size="15" @tap="$emit('show-bmi-info')" />
										</view>
										<text class="list-device-name">{{ item.modelName }}</text>
									</view>
									<view class="list-divider"></view>
									<view class="list-data-display">
										<view class="list-data-item">
											<text class="list-data-label">{{ $t("血氧") }}/%</text>
											<text class="list-data-value">{{ item.object.summary.oxygenAvg }}</text>
										</view>
										<view class="list-data-item date-item">
											<text class="list-data-label"></text>
											<text class="list-date-value">{{ item.dateTime }}</text>
										</view>
										<view class="list-expand-btn" @tap.stop="toggleExpand(index)">
											<uni-icons :type="item.object.summary.expanded ? 'top' : 'bottom'" size="22" />
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="item.object.summary.expanded" class="expanded-table">
					<view v-for="(detail, detailIndex) in item.object.details" :key="`table-detail-${detailIndex}`"
						class="table-row">
						<text class="table-cell time-cell">{{ detail.time }}</text>
						<text class="table-cell">{{ detail.oxygen }}</text>
						<text class="table-cell">{{ item.dateTime }}</text>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'BloodOxygenList',
		props: {
			data: {
				type: Array,
				default: () => []
			},
			viewType: {
				type: String,
				default: 'calendar'
			}
		},
		data() {
			return {
				swipeData: [],
				touchStartX: 0,
				currentSwipeId: null,
				loadedMap: {},
				isSwiping: false,
				lastSwipeId: null,
				startX: 0
			}
		},
		watch: {
			data: {
				immediate: true,
				handler(newData) {
					this.swipeData = (newData || []).map(item => ({
						...item,
						x: 0,
						object: {
							...item.object,
							summary: {
								...item.object.summary,
								expanded: item.object.summary.expanded || false
							},
							details: (item.object.details || []).map(detail => ({
								...detail,
								x: 0
							}))
						}
					}));
				}
			}
		},
		methods: {
			formatListDate(dateString) {
				return dateString.slice(5, 10);
			},
			getOxygenColor(level) {
				const colorMap = {
					0: '#FCCD41',
					1: '#58BF78',
					2: '#58BF78',
					3: '#FFFFFF'
				};
				return colorMap[level] || '#FFFFFF';
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
			},
			visibleDetails(item) {
				const key = this.loadedKey(item);
				const loaded = this.loadedMap[key] || 5;
				return item.object.details.slice(0, loaded);
			},
			loadedKey(item) {
				return `${item.deviceSn}_${item.dateTime}`;
			},
			onTouchStart(e, index, type) {
				if (e && e.stopPropagation) e.stopPropagation();
				this.touchStartX = e.touches[0].clientX;
				this.isSwiping = false;
				this.startX = this.getCardPosition(type, index);
				const currentSwipeId = { type, index };
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
				const newX = this.startX + deltaX;
				const maxSwipeDistance = type === 'main' ? -80 : -60;
				const clampedX = Math.max(maxSwipeDistance, Math.min(0, newX));
				this.isSwiping = true;
				this.setCardPosition(type, index, clampedX);
				if (e && e.stopPropagation) e.stopPropagation();
			},
			onTouchEnd(e, index, type) {
				if (!this.currentSwipeId ||
					this.currentSwipeId.type !== type ||
					JSON.stringify(this.currentSwipeId.index) !== JSON.stringify(index) ||
					!this.isSwiping) return;
				const threshold = type === 'main' ? -50 : -40;
				const maxSwipeDistance = type === 'main' ? -80 : -60;
				const currentX = this.getCardPosition(type, index);
				if (currentX < threshold) {
					this.setCardPosition(type, index, maxSwipeDistance);
					this.lastSwipeId = { type, index };
				} else {
					this.setCardPosition(type, index, 0);
					if (this.lastSwipeId &&
						this.lastSwipeId.type === type &&
						JSON.stringify(this.lastSwipeId.index) === JSON.stringify(index)) {
						this.lastSwipeId = null;
					}
				}
				this.isSwiping = false;
				if (type === 'main' && this.swipeData[index].object.summary.expanded) {
					this.toggleExpand(index);
				}
				if (e && e.stopPropagation) e.stopPropagation();
			},
			onCardTap(index, type) {
				if (this.isSwiping) {
					this.isSwiping = false;
					return;
				}
				const currentX = this.getCardPosition(type, index);
				if (currentX < 0) {
					this.setCardPosition(type, index, 0);
					if (this.lastSwipeId &&
						this.lastSwipeId.type === type &&
						JSON.stringify(this.lastSwipeId.index) === JSON.stringify(index)) {
						this.lastSwipeId = null;
					}
				}
			},
			resetLastSwipeCard() {
				if (!this.lastSwipeId) return;
				const { type, index } = this.lastSwipeId;
				this.setCardPosition(type, index, 0);
				this.lastSwipeId = null;
			},
			setCardPosition(type, index, x) {
				if (type === 'main') {
					this.$set(this.swipeData[index], 'x', x);
				} else if (type === 'detail') {
					const { parentIndex, detailIndex } = index;
					if (this.swipeData[parentIndex] && this.swipeData[parentIndex].object.details[detailIndex]) {
						this.$set(this.swipeData[parentIndex].object.details[detailIndex], 'x', x);
					}
				}
			},
			getCardPosition(type, index) {
				if (type === 'main') return this.swipeData[index].x || 0;
				if (type === 'detail') {
					const { parentIndex, detailIndex } = index;
					if (this.swipeData[parentIndex] && this.swipeData[parentIndex].object.details[detailIndex]) {
						return this.swipeData[parentIndex].object.details[detailIndex].x || 0;
					}
				}
				return 0;
			},
			toggleExpand(index) {
				const currentState = this.swipeData[index].object.summary.expanded;
				this.$set(this.swipeData[index].object.summary, 'expanded', !currentState);
				this.$emit('toggle-expand', index);
			},
			handleDelete(item, index) {
				uni.showModal({
					title: this.$t('确认删除'),
					content: this.$t('确定要删除这条记录吗'),
					success: (res) => {
						if (res.confirm) {
							this.$emit('delete-record', {
								type: 'summary',
								index,
								deviceSn: item.deviceSn,
								timestamps: item.object.details.map(detail => parseInt(detail.timestamp))
							});
						}
						this.$set(this.swipeData[index], 'x', 0);
					}
				});
			},
			handleDeleteDetail(item, detailIndex, timestamp) {
				uni.showModal({
					title: this.$t('确认删除'),
					content: this.$t('确定要删除这条详细记录吗'),
					success: (res) => {
						if (res.confirm) {
							this.$emit('delete-record', {
								type: 'detail',
								index: detailIndex,
								deviceSn: item.deviceSn,
								timestamps: [parseInt(timestamp)]
							});
						}
						this.$set(item.object.details[detailIndex], 'x', 0);
					}
				});
			}
		}
	}
</script>

<style scoped>
	.blood-oxygen-list {
		padding-bottom: 20px;
	}

	.record-area,
	.list-record-area {
		width: 100%;
		margin-bottom: 15px;
		position: relative;
		overflow: hidden;
	}

	.swipe-container {
		position: relative;
		width: 100%;
		height: 135px;
		background: #f8f8f8;
		border-radius: 12px;
		overflow: hidden;
	}

	.delete-btn,
	.detail-delete-btn {
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

	.swipe-content,
	.detail-swipe-content {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 10;
		transition: transform 0.2s ease;
	}

	.detail-swipe-content {
		position: relative;
	}

	.load-more {
		text-align: center;
		padding: 20px 20px 0;
		font-size: 16px;
		color: #007aff;
	}

	.record-card,
	.list-record-card {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 12px;
		padding: 15px 0;
		box-sizing: border-box;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.record-header,
	.list-record-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.record-icon,
	.list-record-icon,
	.detail-icon {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-width: 80px;
	}

	.detail-icon {
		min-width: 60px;
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

	.record-main,
	.list-record-main,
	.detail-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-right: 15px;
	}

	.title-bar,
	.list-title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}

	.level-wrap {
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

	.device-name,
	.list-device-name {
		color: #999;
		font-size: 12px;
	}

	.divider,
	.list-divider {
		width: calc(100% - 20px);
		margin: 8px 10px;
		background: #CCCCCC;
		height: 1px;
	}

	.data-display,
	.list-data-display {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}

	.data-item,
	.list-data-item {
		flex: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.data-label,
	.list-data-label {
		color: #999;
		font-size: 11px;
		margin-bottom: 2px;
	}

	.data-value,
	.list-data-value,
	.date-value,
	.list-date-value {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.expand-btn,
	.list-expand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
	}

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

	.detail-swipe-container {
		position: relative;
		width: 100%;
		background: #f8f8f8;
		border-radius: 12px;
		overflow: hidden;
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

	.expanded-table {
		margin-top: 10px;
		background: #fff;
		border-radius: 12px;
		overflow: hidden;
	}

	.table-row {
		display: flex;
		padding: 12px 15px;
		border-bottom: 1px solid #f0f0f0;
	}

	.table-cell {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #333;
	}

	.time-cell {
		text-align: left;
	}
</style>
