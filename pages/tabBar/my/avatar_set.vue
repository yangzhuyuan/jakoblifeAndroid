<template>
	<view style=" height: 100vh;background: #EFEFF4; color: black;padding: 20px;">
		<view class="avatar_bg" @click="choessimg()">
			<view style="width: 75vw;margin-left: 10px;">从手机相册选择</view>
			<uni-icons type="right" size="18"></uni-icons>
		</view>
		<view style="margin-top: 20px;font-weight: bold;">
			<view>选择头像</view>
			<view style="margin-top: 20px;">
				<image class="avatar_img_bg" :src="image_1" @click="click_avatar_1()" :style="getback('0')"></image>
				<image class="avatar_img_bg" :src="image_2" @click="click_avatar_2()" :style="getback('1')"></image>
				<image class="avatar_img_bg" :src="image_3" @click="click_avatar_3()" :style="getback('2')"></image>
				<image class="avatar_img_bg" :src="image_4" @click="click_avatar_4()" :style="getback('3')"></image>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				image_1: '../../../static/004.jpg',
				image_2: '../../../static/004.jpg',
				image_3: '../../../static/004.jpg',
				image_4: '../../../static/004.jpg',
				images: '',
				action: ''
			}
		},



		onBackPress(options) {
			console.log('from:' + options.from)
			let that = this
			if (options.from === 'backbutton') {
				that.get_url_avatar(that.images)
				delta: 1
			}
		},



		methods: {

			choessimg() {
				let that = this
				that.action = ""
				that.images = ""
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						that.images = res.tempFilePaths[0]
					}
				})
			},


			click_avatar_1() {
				this.action = "0"
				this.images = this.image_1
			},
			click_avatar_2() {
				this.action = "1"
				this.images = this.image_2
			},
			click_avatar_3() {
				this.action = "2"
				this.images = this.image_3
			},
			click_avatar_4() {
				this.action = "3"
				this.images = this.image_4
			},

			getback(id) {
				return {
					border: id == this.action ? '1px solid #3298F7' : ''
				}
			},


			//上传用户头像
			get_url_avatar(IMG) {
				let that = this
				uni.uploadFile({
					url: that.$url_avatar, // 你的接口地址
					filePath: IMG,
					name: 'avatarfile',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'multipart/form-data;' //自定义请求头信息
					},

					success: (uploadFileRes) => {
						console.log("上传用户头像", JSON.parse(uploadFileRes.data).imgUrl);
						if (JSON.parse(uploadFileRes.data).code == 200) {
							uni.$emit('uploadFileRes', JSON.parse(uploadFileRes.data).imgUrl)
						} else {

						}
					}
				})
			},


		}
	}
</script>

<style>
	.avatar_bg {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: white;
		padding: 15px;
		border-radius: 15px;
	}

	.avatar_img_bg {
		width: 60px;
		height: 60px;
		margin-left: 10px;
		border-radius: 30px;

	}
</style>