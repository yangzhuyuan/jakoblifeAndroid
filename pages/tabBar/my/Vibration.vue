<template>
	<view style="padding: 10px;color: black;height: 100vh;">
		<view style="background: white; padding: 10px;border-radius: 15px;">
			<view style="display: flex;flex-direction: row; padding:0 5px 5px 5px;" @click="open()">
				<view style="width: 90%; margin-left: 5px;">开</view>
				<uni-icons v-show="open_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
			<view style="background: gainsboro; width: 100%; height: 1px;"></view>
			<view style="display: flex;flex-direction: row; padding:5px 5px 0 5px;" @click="close()">
				<view style="width: 90%; margin-left: 5px;">关</view>
				<uni-icons v-show="close_show" type="checkmarkempty" size="16"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				open_show: true,
				close_show: false,
				Vibration: "开",
			}
		},
		
		onLoad(res) {
			if(res.data == "开"){
				this.open_show = true
				this.close_show = false
			}else{
				this.open_show = false
				this.close_show = true
			}
			
		},

		onBackPress() {
			if (this.open_show == true) {
				this.Vibration = "开"
			} else {
				this.Vibration = "关"
			}
			uni.$emit('Vibration', this.Vibration)
			delta: 1
		},

		methods: {
			open() {
				this.open_show = true
				this.close_show = false
			},
			close() {
				this.open_show = false
				this.close_show = true
			},

		}
	}
</script>

<style>

</style>