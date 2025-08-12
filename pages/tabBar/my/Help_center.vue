<template>
	<view class="help-page">
		<view class="panel">
			<view v-for="(item, idx) in menuList" :key="idx" class="menu-item" hover-class="hover"
				@click="goPage(item.url)">
				<text class="title">{{ item.title }}</text>
				<uni-icons type="right" size="16" color="#C0C4CC" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 所有菜单集中维护，后续只改这里
				menuList: [{
						title: this.$t('血压手表使用指南'),
						url: '/pages/tabBar/my/vidohelp/vidohelp'
					},
					{
						title: this.$t('血压手表问题解答'),
						url: '../my/Text_content?id=1156'
					},
					{
						title: this.$t('传统血压计使用指南'),
						url: '/pages/tabBar/my/vidohelp/vidohelp2'
					},
					{
						title: this.$t('传统血压计问题解答'),
						url: '../my/Text_content?id=1158'
					},
					{
						title: this.$t('体脂秤使用指南'),
						url: '/pages/tabBar/my/Body_fat_scale_binding_problem'
					},
					{
						title: this.$t('体脂秤问题解答'),
						url: '../my/Text_content?id=1160'
					}
				]
			};
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('帮助中心')
			});
		},

		methods: {
			goPage(url) {
				uni.navigateTo({
					url
				});
			}
		}
	};
</script>

<style scoped>
	.help-page {
		padding: 20px 16px;
		background: #F5F5F5;
		min-height: 100vh;
	}

	.panel {
		background: #fff;
		border-radius: 20px;
		overflow: hidden;
		margin-left: 5px;
		margin-right: 5px;
		margin-top: 10px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}

	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;
		height: 56px;
		font-size: 16px;
		color: #1A1A1A;
		position: relative;
		transition: background 0.2s;
	}

	.menu-item::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 32rpx;
		right: 32rpx;
		height: 1rpx;
		background: #E5E5E5;
	}

	.menu-item:last-child::after {
		display: none;
	}

	.hover {
		background: #F2F2F2;
	}

	.title {
		font-weight: 400;
	}
</style>