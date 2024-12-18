<script setup>
import { onMounted, ref, computed, watch, useSlots } from 'vue'
	import { isTrue, Int, addUnit } from './util.js'
	const props = defineProps({
		modelValue: { type: Boolean, default: false },
	id: String,
	text: { type: [String, Number] },
		// 自定义加载图标类名
	spinner: String,
	background: String ,
	// 显示模式(vertical / horizontal)
		mode: { type: String, default: 'vertical' },
	size: { type: [Number, String], default: 24 },
		// 自定义样式
	loadingStyle: String,shade: { type: [Boolean, String], default: true },
		// 点击遮罩层关闭
	shadeClose: Boolean,opacity: { type: [Number, String] },
		// 是否全屏
	fullscreen: { type: [Boolean, String], default: true },
	time: { type: [Number, String], default: 0 },
zIndex: { type: [Number, String], default: 202212 }
	})
	const emit = defineEmits([
	'update:modelValue','open','close','remove'
	])
const slots = useSlots()
	const visible = ref(false)
const closed = ref(false)
	const stopTimer = ref(null)
const mIndex = ref(props.zIndex)
	const uuid = computed(() => 've__loading' + Math.floor(Math.random() * 10000))
const isSlotOnly = computed(() => slots.default?.())
	const open = () => {
	if(visible.value) return
	visible.value = true
	emit('open')
	startTimer()
	}
	const close = () => {
		if(!visible.value) return
	closed.value = true
		emit('close')
	setTimeout(() => {
		closed.value = false
		visible.value = false
emit('update:modelValue', false)
		emit('remove')
	}, 250)
	}
const startTimer = () => {
	if(props.time) {
		clearTimer()
	stopTimer.value = setTimeout(() => {
	close()
	}, Int(props.time)*1000)
		}
	}
const clearTimer = () => {
	if(!stopTimer.value) return
	clearTimeout(stopTimer.value)
	stopTimer.value = null
	}
const shadeClicked = () => {
if(isTrue(props.shadeClose)) {
close()
	}
	}
onMounted(() => {
if(props.modelValue) {
	open()
		}
	})
watch(() => props.modelValue, (val) => {
if(val) {
	open()
		}else {
close()
		}
	})
	
defineExpose({
	close
	})
</script>

<template>
<div class="ve__loading-container">
	<slot />
	<div
	v-if="visible"
			class="ve__loading"
	:class="[
		{'is-slotparcel': isSlotOnly},{'is-unfullscreen': !isSlotOnly && !isTrue(fullscreen)},{'is-closed': closed}
	]"
		:id="id || uuid"
	:style="{'z-index': mIndex}"
		>	
	<div v-if="isTrue(shade)" class="ve__loading-overlay" :style="{opacity, background}" @click="shadeClicked"></div>
		<div class="ve__loading-wrap" :class="[mode]" :style="[loadingStyle]">
	<template v-if="$slots.spinner || spinner">
			<slot name="spinner" />
		<div v-if="!$slots.spinner" class="ve__loading-icon" :style="{'font-size': addUnit(size)}"><i class="iconfont" :class="[spinner]"></i></div>
				</template>
		<template v-else>
			<span class="ve__loading-spin" :style="{'font-size': addUnit(size)}">
	<em></em><em></em><em></em><em></em>
		</span>
			</template>
		<template v-if="$slots.text || text">
		<div v-if="$slots.text" class="ve__loading-wrap__content">
			<slot name="text" />
			</div>
		<div v-else class="ve__loading-wrap__content" v-html="text"></div>
	</template>
		</div>
</div>
</div>
</template>

<style lang="scss" scoped>
.ve__loading-container {position: relative;}
	.ve__loading {position: fixed;}
.ve__loading *{font-style: normal; list-style: none;}
.ve__loading-overlay {
	  background: white;opacity: .9;pointer-events: auto;height: 100%;width: 100%; position: fixed;left: 0;top: 0;z-index: inherit;animation: anim-mask .2s;
	}
.ve__loading-wrap{
	   display: flex;align-items: center;justify-content: center;
	 color: #409eff;font-size: 14px;font-family: "PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;pointer-events: auto;position: fixed;left: 50%;top: 50%;transform: translate(-50%, -50%);
	    z-index: inherit;animation: anim-fadeIn .5s;
	}
.ve__loading-wrap__content{padding: 0 10px; text-align: center; line-height: 1.3; word-wrap: break-word; word-break: break-all;}
	.ve__loading-wrap.vertical {flex-direction: column;}
	.ve__loading-wrap.vertical .ve__loading-wrap__content {padding-top: 10px;}
.ve__loading-icon {
display: flex;justify-content: center;color: inherit;font-size: 40px;animation: anim-loading 1s linear infinite;
	}
	.ve__loading-icon i {animation: none;}
	.ve__loading-spin {
display: inline-block;font-size: 20px;height: 1em;width: 1em;position: relative;
	    animation: anim-loading 1s linear infinite;
	}
.ve__loading-spin em {
	   background-color: #409eff;
	  border-radius: 100%;display: block;opacity: .3;height: .5em;width: .5em;position: absolute;
	 transform: scale(.75); transform-origin: 50% 50%;
	  animation: anim-spin 1s linear infinite alternate;
	}
	.ve__loading-spin em:nth-child(1) {top: 0; left: 0;}
.ve__loading-spin em:nth-child(2) {top: 0; right: 0; animation-delay: .4s;}
	.ve__loading-spin em:nth-child(3) {right: 0; bottom: 0; animation-delay: .8s;}
.ve__loading-spin em:nth-child(4) {left: 0; bottom: 0; animation-delay: 1.2s;}
.ve__loading.is-slotparcel {position: unset;}
	.ve__loading.is-slotparcel .ve__loading-overlay {position: absolute;}
.ve__loading.is-slotparcel .ve__loading-wrap {position: absolute;}
	.ve__loading.is-unfullscreen {position: unset;}
.ve__loading.is-unfullscreen .ve__loading-overlay {display: none;}
.ve__loading.is-unfullscreen .ve__loading-wrap {position: relative; left: auto; top: auto; transform: none;}
.ve__loading.is-closed .ve__loading-overlay{animation: anim-fadeOut .3s;}
.ve__loading.is-closed .ve__loading-wrap{animation: anim-fadeOut .3s;}
	@keyframes anim-mask {0% {opacity: 0;}}
	@keyframes anim-loading {
	  0% {transform: rotate(0deg)}
	to {transform: rotate(1turn)}
	}
	@keyframes anim-spin {
	 to {opacity: 1;}
	}
@keyframes anim-fadeIn {
	 0% {opacity: 0;}
	  100% {opacity: 1;}
	}
@keyframes anim-fadeOut {
	 100% {opacity: 0;}
	}
</style>

