<template>
	<view class="custom-modal" v-if="visible">
		<view class="modal-content">
			<text>{{ message }}</text>
			<button @click="closeModal">关闭</button>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			visible: Boolean,
			message: String
		},
		methods: {
			closeModal() {
				this.$emit('update:visible', false);
			}
		}
	};
</script>

<style scoped>
	.custom-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: white;
		padding: 20px;
		border-radius: 10px;
	}
</style>