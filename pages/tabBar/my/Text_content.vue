<template>
	<view style="padding: 10px; display: flex;justify-content: center;">
		<text style="text-align: center;">{{text_contnt}}</text>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				titles: "关于&更新",
				text_contnt: "JakobLife Here is the content protocol shown"
			}
		},


		onLoad(res) {
			if (res.id == "1") {
				this.titles = this.$t('wodelist.gygxitem.title_2')
			} else if (res.id == "2") {
				this.titles = this.$t('wodelist.gygxitem.title_3')
			} else if (res.id == "3") {
				this.titles = this.$t('wodelist.gygxitem.title_4')
			} else if (res.id == "4") {
				this.titles = this.$t('wodelist.gygxitem.title_5')
			} else if (res.id == "5") {
				this.titles = this.$t('wodelist.gygxitem.title_6')
			} else if (res.id == "6") {
				this.titles = this.$t('wodelist.gygxitem.title_7')
			} else if (res.id == "7") {
				this.titles = this.$t('wodelist.gygxitem.title_8')
			} else if (res.id == "8") {
				this.titles = this.$t('wodelist.gygxitem.title_9')
			} else {
				this.titles = this.$t('wodelist.gygx')
			}
			uni.setNavigationBarTitle({
				title: this.titles
			})
		},




		methods: {

		}
	}
</script>

<style>

</style>