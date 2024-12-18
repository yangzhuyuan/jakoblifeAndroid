<template>
	<view style="padding: 10px;color: black;height: 100vh;">
		<view style="background: white; padding: 0 10px 0 10px; border-radius: 10px;">

			<view class="check_week_bg" @click="ck_Every_Monday()">
				<view style="width: 90%;">{{$t('wodelist.txszitem.title_7')}}</view>
				<uni-icons v-show="Every_Monday" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="check_week_bg" @click="ck_Every_Tuesday()">
				<view style="width: 90%;">{{$t('wodelist.txszitem.title_8')}}</view>
				<uni-icons v-show="Every_Tuesday" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="check_week_bg" @click="ck_Every_Wednesday()">
				<view style="width: 90%;">{{$t('wodelist.txszitem.title_9')}}</view>
				<uni-icons v-show="Every_Wednesday" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="check_week_bg" @click="ck_Every_Thursday()">
				<view style="width: 90%;">{{$t('wodelist.txszitem.title_10')}}</view>
				<uni-icons v-show="Every_Thursday" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="check_week_bg" @click="ck_Every_Friday()">
				<view style="width: 90%;">{{$t('wodelist.txszitem.title_11')}}</view>
				<uni-icons v-show="Every_Friday" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="check_week_bg" @click="ck_Every_Saturday()">
				<view style="width: 90%;">{{$t('wodelist.txszitem.title_12')}}</view>
				<uni-icons v-show="Every_Saturday" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view class="check_week_bg" @click="ck_Every_Sunday()">
				<view style="width: 90%;">{{$t('wodelist.txszitem.title_13')}}</view>
				<uni-icons v-show="Every_Sunday" type="checkmarkempty" size="16"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Every_Sunday: false,
				Every_Monday: false,
				Every_Tuesday: false,
				Every_Wednesday: false,
				Every_Thursday: false,
				Every_Friday: false,
				Every_Saturday: false,
				Every_Sundays: "",
				Every_Mondays: "",
				Every_Tuesdays: "",
				Every_Wednesdays: "",
				Every_Thursdays: "",
				Every_Fridays: "",
				Every_Saturdays: "",
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('wodelist.txszitem.title_3')
			})

		},

		onLoad(res) {
			console.log(res.data)
			if (res.data == "永不") {
				this.Every_Sunday = false
				this.Every_Monday = false
				this.Every_Tuesday = false
				this.Every_Wednesday = false
				this.Every_Thursday = false
				this.Every_Friday = false
				this.Every_Saturday = false
			} else {
				if (res.data.includes(this.$t('wodelist.txszitem.title_13'))) {
					this.Every_Sunday = true
				}
				if (res.data.includes(this.$t('wodelist.txszitem.title_7'))) {
					this.Every_Monday = true
				}
				if (res.data.includes(this.$t('wodelist.txszitem.title_8'))) {
					this.Every_Tuesday = true
				}
				if (res.data.includes(this.$t('wodelist.txszitem.title_9'))) {
					this.Every_Wednesday = true
				}
				if (res.data.includes(this.$t('wodelist.txszitem.title_10'))) {
					this.Every_Thursday = true
				}
				if (res.data.includes(this.$t('wodelist.txszitem.title_11'))) {
					this.Every_Friday = true
				}
				if (res.data.includes(this.$t('wodelist.txszitem.title_12'))) {
					this.Every_Saturday = true
				}
			}
		},


		onBackPress() {


			if (this.Every_Sunday == true) {
				this.Every_Sundays = this.$t('wodelist.txszitem.title_13') + "、"
			} else {
				this.Every_Sundays = ""
			}

			if (this.Every_Monday == true) {
				this.Every_Mondays = this.$t('wodelist.txszitem.title_7') + "、"
			} else {
				this.Every_Mondays = ""
			}

			if (this.Every_Tuesday == true) {
				this.Every_Tuesdays = this.$t('wodelist.txszitem.title_8') + "、"
			} else {
				this.Every_Tuesdays = ""
			}

			if (this.Every_Wednesday == true) {
				this.Every_Wednesdays = this.$t('wodelist.txszitem.title_9') + "、"
			} else {
				this.Every_Wednesdays = ""
			}

			if (this.Every_Thursday == true) {
				this.Every_Thursdays = this.$t('wodelist.txszitem.title_10') + "、"
			} else {
				this.Every_Thursdays = ""
			}

			if (this.Every_Friday == true) {
				this.Every_Fridays = this.$t('wodelist.txszitem.title_11') + "、"
			} else {
				this.Every_Fridays = ""
			}

			if (this.Every_Saturday == true) {
				this.Every_Saturdays = this.$t('wodelist.txszitem.title_12') + "、"
			} else {
				this.Every_Saturdays = ""
			}
			uni.$emit('repeat', this.Every_Sundays + this.Every_Mondays + this.Every_Tuesdays + this.Every_Wednesdays +
				this.Every_Thursdays + this.Every_Fridays + this.Every_Saturdays)
			delta: 1
		},

		methods: {
			ck_Every_Sunday() {
				if (this.Every_Sunday == true) {
					this.Every_Sunday = false
				} else {
					this.Every_Sunday = true
				}
			},
			ck_Every_Monday() {
				if (this.Every_Monday == true) {
					this.Every_Monday = false
				} else {
					this.Every_Monday = true
				}
			},
			ck_Every_Tuesday() {
				if (this.Every_Tuesday == true) {
					this.Every_Tuesday = false
				} else {
					this.Every_Tuesday = true
				}
			},
			ck_Every_Wednesday() {
				if (this.Every_Wednesday == true) {
					this.Every_Wednesday = false
				} else {
					this.Every_Wednesday = true
				}
			},
			ck_Every_Thursday() {
				if (this.Every_Thursday == true) {
					this.Every_Thursday = false
				} else {
					this.Every_Thursday = true
				}
			},
			ck_Every_Friday() {
				if (this.Every_Friday == true) {
					this.Every_Friday = false
				} else {
					this.Every_Friday = true
				}
			},
			ck_Every_Saturday() {
				if (this.Every_Saturday == true) {
					this.Every_Saturday = false
				} else {
					this.Every_Saturday = true
				}
			},
		}
	}
</script>

<style>
	.check_week_bg {
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 10px 5px 10px 5px;
	}
</style>