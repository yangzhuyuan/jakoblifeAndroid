<template>
	<view style="padding: 20px 0 80px; background: #EFEFF4;">
		<view class="gongxiang-container">
			<view class="user-info">
				<image class="avatar" :src="avatar || '../../../static/icons/60x60.png'"></image>
				<view class="user-details">
					<view class="name">{{ name }}</view>
					<view class="phone">{{ phone }}</view>
				</view>
			</view>
			<view class="sharing-title">
				{{$t('您正在与') + name + $t('共享以下健康数据')}}
			</view>
			<view class="data-list">
				<view v-for="(item, index) in healthData" :key="index" class="data-item" @click="toggleSelection(item)">
					<view class="data-name">{{ $t(item.name) }}</view>
					<uni-icons v-if="isSelected(item)" type="checkmarkempty" size="16"></uni-icons>
				</view>
			</view>
			<view class="check-all">
				<checkbox color="#ffffff" class="round" activeBorderColor="#D2D2D2" activeBackgroundColor="#3298F7"
					:checked="isAllSelected" @click="toggleAll()">
					{{$t('全选')}}
				</checkbox>
			</view>
		</view>
		<button @tap="cancelSharing" class="cancel-button">{{$t('取消共享')}}</button>
		<button @tap="confirmSharing" class="confirm-button">{{$t('确认')}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '',
				name: '小明',
				phone: '12',
				selectedData: [],
				healthData: [{
						name: '舒张压',
						key: 'lowPressure'
					},
					{
						name: '收缩压',
						key: 'highPressure'
					},
					{
						name: '脉搏',
						key: 'heartrate'
					},
					{
						name: '血氧',
						key: 'oxygen'
					},
					{
						name: '压力',
						key: 'pressure'
					},
					{
						name: '体温',
						key: 'temperature'
					},
					{
						name: '初始体重',
						key: 'start_weight'
					},
					{
						name: '目标体重',
						key: 'goal_weight'
					},
					{
						name: '体重',
						key: 'weight'
					},
					{
						name: '身高',
						key: 'height'
					},
					{
						name: '胸围',
						key: 'chest_circumference'
					},
					{
						name: '腰围',
						key: 'waistline'
					},
					{
						name: '臀围',
						key: 'hipline'
					},
					{
						name: '上臂围',
						key: 'biceps_circumference'
					},
					{
						name: '大腿围',
						key: 'thigh_circumference'
					},
					{
						name: '小腿围',
						key: 'calf_circumference'
					},
					{
						name: 'BMI',
						key: 'bmi'
					}
				],
				isAllSelected: false,
				id: ''
			}
		},
		onLoad(res) {
			this.avatar = res.AVATAR;
			this.name = res.NAME;
			this.phone = res.PHONE;
			this.id = res.ID;
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("与他人共享")
			});
		},
		methods: {
			isSelected(item) {
				return this.selectedData.includes(item.key);
			},
			toggleSelection(item) {
				const index = this.selectedData.indexOf(item.key);
				if (index === -1) {
					this.selectedData.push(item.key);
				} else {
					this.selectedData.splice(index, 1);
				}
				this.updateAllSelected();
			},
			updateAllSelected() {
				this.isAllSelected = this.selectedData.length === this.healthData.length;
			},
			toggleAll() {
				if (this.isAllSelected) {
					this.selectedData = [];
				} else {
					this.selectedData = this.healthData.map(item => item.key);
				}
				this.isAllSelected = !this.isAllSelected;
			},
			cancelSharing() {
				console.log("cancelSharing", this.id)
				uni.request({
					url: `https://jakoblife.jakob-techs.com/prod-api/share/data/${this.id}`,
					method: 'DELETE',
					header: {
						'Authorization': `Bearer ${uni.getStorageSync("token")}`,
						'content-type': 'application/json'
					},
					success: (res) => {
						console.log("res", res)
						if (res.data.code === 200) {
							uni.navigateBack();
						}
					},
				});
			},

			confirmSharing() {
				if (this.selectedData.length === 0) {
					uni.showToast({
						title: this.$t('请选择要共享的数据'),
						icon: 'none'
					});
					return;
				}
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/share/data/change",
					method: "POST",
					data: {
						id: this.id,
						dataPointIds: [this.selectedData.join(',')]
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync("token")}`,
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.navigateTo({
								url: `../share/Shared_success?NAME=${this.name}`
							});
						}
					},
				});
			}
		}
	}
</script>

<style>
	.gongxiang-container {
		background: white;
		width: auto;
		margin: 0 20px;
		border-radius: 20px;
		padding: 40px 20px 20px;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20px;
	}

	.avatar {
		width: 85px;
		height: 85px;
		border-radius: 50%;
		border: 1px solid gainsboro;
	}

	.user-details {
		margin-top: 20px;
		text-align: center;
	}

	.name {
		font-weight: 600;
		font-size: 16px;
		margin-bottom: 5px;
	}

	.phone {
		font-size: 16px;
		color: #999999;
	}

	.sharing-title {
		font-size: 16px;
		font-weight: 600;
		color: #1A1A1A;
		text-align: center;
		margin: 20px 0;
	}

	.data-list {
		border-radius: 15px;
		overflow: hidden;
	}

	.data-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		background: white;
		margin: 5px;
	}

	.data-name {
		width: 90%;
		font-size: 16px;
		font-weight: 400;
	}

	.data-item:not(:last-child) {
		border-bottom: 1px solid gainsboro;
	}

	.check-all {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.cancel-button {
		background: #F55A5A;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 58px;
		font-weight: 600;
		border-radius: 40px;
		padding: 12px 0;
		margin: 60px 20px 20px;
	}

	.confirm-button {
		background: #3298F7;
		color: white;
		font-weight: 600;
		border-radius: 40px;
		padding: 12px 0;
		margin: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 58px;
	}
</style>