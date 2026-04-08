<template>
	<view class="float-button" :class="{ 'float-button-hide': !visible }" :style="buttonStyle">

		<!-- 遮罩层，点击关闭菜单 -->
		<view v-if="menuOpen" class="menu-mask" @tap.stop="closeMenu" @touchmove.prevent="() => false"></view>

		<!-- 整体容器 -->
		<view class="button-container" :class="{ 'container-open': menuOpen }">

			<!-- 子菜单 -->
			<view v-if="pattern.menuItems && pattern.menuItems.length > 0" class="sub-menu"
				:class="{ 'sub-menu-open': menuOpen }">

				<view class="sub-menu-grid">
					<view v-for="(item, index) in pattern.menuItems" :key="index" class="sub-button"
						:style="getSubButtonStyle(index)" @tap="handleSubButtonClick(item)">

						<image class="sub-button-icon" :src="item.icon" mode="aspectFit" />
						<text class="sub-button-label">{{ item.text }}</text>
					</view>
				</view>
			</view>

			<!-- 主按钮 -->
			<view class="main-button" :style="mainButtonStyle" @tap="handleMainClick">
				<image class="button-icon" src="/static/page_icon/aipbg.jpg" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "FloatButton",
		props: {
			visible: {
				type: Boolean,
				default: true
			},
			position: {
				type: String,
				default: 'bottom-right'
			},
			pattern: {
				type: Object,
				default: () => ({
					theme: 'primary',
					icon: '+',
					menuItems: []
				})
			}
		},
		data() {
			return {
				menuOpen: false
			}
		},
		computed: {
			buttonStyle() {
				return this.getPositionStyle()
			},
			mainButtonStyle() {
				const theme = this.getThemeConfig()
				return {
					background: theme.background,
					boxShadow: theme.shadow
				}
			}
		},
		methods: {
			getPositionStyle() {
				const positions = {
					'bottom-right': {
						right: '30rpx',
						bottom: '80px'
					},
					'bottom-left': {
						left: '30rpx',
						bottom: '80px'
					}
				}
				return positions[this.position] || positions['bottom-right']
			},

			getThemeConfig() {
				const themes = {
					primary: {
						background: '#007AFF',
						shadow: '0 4rpx 12rpx rgba(0, 122, 255, 0.3)'
					},
					success: {
						background: '#34C759',
						shadow: '0 4rpx 12rpx rgba(52, 199, 89, 0.3)'
					},
					warning: {
						background: '#FF9500',
						shadow: '0 4rpx 12rpx rgba(255, 149, 0, 0.3)'
					},
					danger: {
						background: '#FF3B30',
						shadow: '0 4rpx 12rpx rgba(255, 59, 48, 0.3)'
					}
				}
				return themes[this.pattern.theme] || themes.primary
			},

			getSubButtonStyle(index) {
				const theme = this.getThemeConfig()
				return {
					background: theme.background,
					animationDelay: `${index * 0.1}s`
				}
			},

			handleMainClick() {
				// console.log('🔘 主按钮点击')
				if (this.pattern.menuItems?.length > 0) {
					this.toggleMenu()
				} else {
					this.$emit('click')
				}
			},

			handleSubButtonClick(item) {
				this.closeMenu()
				this.$emit('subButtonClick', item)
				if (typeof item.handler === 'function') {
					item.handler()
				}
			},

			toggleMenu() {
				this.menuOpen ? this.closeMenu() : this.openMenu()
			},

			openMenu() {
				if (this.menuOpen) return
				this.menuOpen = true
				this.$emit('menuOpen')
				this.$emit('menuToggle', true)
			},

			closeMenu() {
				if (!this.menuOpen) return
				this.menuOpen = false
				this.$emit('menuClose')
				this.$emit('menuToggle', false)
			},

			showMenu() {
				this.openMenu()
			},

			hideMenu() {
				this.closeMenu()
			}
		}
	}
</script>

<style scoped>
	.float-button {
		position: fixed;
		z-index: 9999;
	}

	.float-button-hide {
		display: none;
	}

	/* 遮罩层 */
	.menu-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.1);
		z-index: 9998;
	}

	/* 整体容器 */
	.button-container {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		position: relative;
		z-index: 10000;
	}

	.container-open {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 50rpx;
		padding: 10rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(10px);
	}

	/* 主按钮 */
	.main-button {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.button-icon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
	}

	/* 子菜单 */
	.sub-menu {
		margin-right: 10px;
		opacity: 0;
		transform: scale(0.8);
		transform-origin: right center;
		transition: all 0.3s ease;
		pointer-events: none;
		width: 0;
		/* 新增 */
		height: 0;
		/* 新增 */
		overflow: hidden;
	}

	.sub-menu-open {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
		width: auto;
		/* 展开时恢复 */
		height: auto;
	}

	/* 子菜单网格 */
	.sub-menu-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		max-width: 200px;
		max-height: 200px;
		padding: 5px;
	}

	/* 子按钮 */
	.sub-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		margin: 5px;
		border-radius: 10px;
		animation: subButtonAppear 0.3s ease forwards;
		opacity: 0;
	}

	@keyframes subButtonAppear {
		to {
			opacity: 1;
		}
	}

	.sub-button-icon {
		width: 25px;
		height: 25px;
		border-radius: 6px;
		object-fit: contain;
	}

	.sub-button-label {
		font-size: 10px;
		color: white;
		text-align: center;
		margin-top: 2px;
		font-weight: 500;
	}
</style>