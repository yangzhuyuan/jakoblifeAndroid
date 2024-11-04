
<template>
  <view class="datetime-picker-box" v-show="visibleRef" :style="getPickerStyle">
    <view class="datetime-picker-container" :class="visibleAni ? 'is-show' : ''">
      <view class="datetime-picker-action">
        <text class="datetime-picker-action-cancel" @click="handleClose">取消</text>
        <text class="datetime-picker-action-confirm" @click="handleConfirm">确认</text>
      </view>
      <picker-view class="datetime-picker-popup" :value="pickerValue" @change="handleChange">
        <picker-view-column>
          <view v-for="(item,index) in dateObj.years" :key="index" class="datetime-picker-item">{{ item }}年</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in dateObj.months" :key="index" class="datetime-picker-item">{{ item }}月</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in dateObj.days" :key="index" class="datetime-picker-item">{{ item }}日</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in timeObj.hours" :key="index" class="datetime-picker-item">{{ item }}时</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in timeObj.minutes" :key="index" class="datetime-picker-item">{{ item }}分</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in timeObj.seconds" :key="index" class="datetime-picker-item">{{ item }}秒</view>
        </picker-view-column>
      </picker-view>
    </view>
    <view class="datetime-picker-mask" @click="handleClose"></view>
  </view>
</template>

<script>
import { defineComponent, ref, computed, watch, unref } from 'vue'

import { formatTime } from './util'

export default defineComponent({
  name: 'DaDatetimePicker',
  props: {
    /**
     * 是否显示弹窗
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 默认选中的时间
     */
    value: {
      type: [Date, String, Number],
      default: null,
    },
    /**
     * 是否格式化回调的时间
     */
    valueFormat: {
      type: Boolean,
      default: true,
    },
    /**
     * 主题色
     */
    themeColor: {
      type: String,
      default: '#007aff',
    },
    /**
     * 可选年份范围，默认为前后30年，格式[2000,2020]
     */
    years: {
      type: Array,
      default: null,
    },
  },
  emits: ['cancel', 'confirm'],
  setup(props, { emit }) {
    const nowDate = new Date()
    const visibleRef = ref(false)
    const visibleAni = ref(false)
    const pickerValue = ref([])

    const timeObj = {
      hours: rangeArr(0, 23),
      minutes: rangeArr(0, 59),
      seconds: rangeArr(0, 59),
    }

    const dateObj = computed(() => {
      return {
        years: geYears(),
        months: rangeArr(1, 12),
        days: geDays(),
      }
    })
    const getPickerStyle = computed(() => {
      return {
        '--picker-theme-color': props.themeColor,
      }
    })

    function handleInitValue() {
      const fmt = formatTime(props.value)
      let now = nowDate
      if (fmt) {
        now = new Date(fmt)
      }
      console.log('now', now, props.value, fmt)
      const y = now.getFullYear()
      const m = now.getMonth() + 1
      const d = now.getDate()
      const h = now.getHours()
      const i = now.getMinutes()
      const s = now.getSeconds()
      const yidx = geYears().findIndex(k => k === y)
      const midx = m - 1
      const didx = d - 1

      pickerValue.value = [yidx, midx, didx, h, i, s]
    }
    function geYears() {
      if (props.years && props.years[0] && props.years[1]) {
        let s = parseInt(props.years[0])
        if (s < 1900) {
          s = 1900
        }
        const e = parseInt(props.years[1])
        return rangeArr(s, e < s ? s + 1 : e)
      }
      return rangeArr(nowDate.getFullYear() - 30, nowDate.getFullYear() + 30)
    }
    function geDays() {
      const now = handlePickerValue() || nowDate
      const year = now.getFullYear()
      const month = now.getMonth()

      let end = 30
      // 2月特殊处理
      if (month === 1) {
        end = isLeapYear(year) ? 29 : 28
      }
      if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
        end = 31
      }
      return rangeArr(1, end)
    }
    function rangeArr(start, end) {
      const re = []
      for (let i = start; i <= end; i++) {
        re.push(i)
      }
      return re
    }
    function isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
    }
    function handlePickerValue() {
      let datetime = null
      if (pickerValue.value?.length) {
        const [year, month, day, hour, minute, second] = pickerValue.value
        const dt = dateObj.value
        const tm = timeObj
        datetime = new Date(`${dt.years[year]}/${dt.months[month]}/${dt.days[day]} ${tm.hours[hour]}:${tm.minutes[minute]}:${tm.seconds[second]}`)
      }

      return datetime
    }
    function handleChange(e) {
      const [year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0] = e.detail.value

      pickerValue.value = [year, month, day, hour, minute, second]
    }
    function handleOpen() {
      visibleRef.value = true
    }
    function handleConfirm() {
      visibleRef.value = false

      const pv = handlePickerValue()
      if (pv && props.valueFormat) {
        emit('confirm', formatTime(pv, 'y-m-d h:i:s'))
        return
      }
      emit('confirm', pv)
    }
    function handleClose() {
      visibleRef.value = false
      emit('cancel', null)
    }

    watch(() => props.visible,
      (v) => {
        visibleRef.value = v
      })

    watch(() => unref(visibleRef),
      (v) => {
        setTimeout(() => {
          visibleAni.value = v

          if (v) {
            handleInitValue()
          }
        }, 150)
      })

    return {
      visibleRef,
      visibleAni,
      dateObj,
      timeObj,
      getPickerStyle,
      pickerValue,
      handleChange,
      handleOpen,
      handleConfirm,
      handleClose,
      formatTime,
    }
  },
})
</script>

<style lang="scss" scoped>
.datetime-picker {
  &-box {
    position: relative;
    z-index: 990;
    line-height: 1;
  }

  &-mask {
    position: fixed;
    top: var(--window-top,0px);
    right: 0;
    bottom: var(--window-bottom,0px);
    left: 0;
    z-index: 990;
    background: rgba(0, 0, 0, 0.5);
  }

  &-container {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 991;
    height: 200px;
    padding-bottom: calc(12px + var(--window-bottom,0px));
    color: #333;
    background-color: #fff;
    transition: all 0.15s ease-in-out;
    transform: translateY(100%);

    &.is-show {
      transform: translateY(0);
    }
  }

  &-action {
    display: flex;
    justify-content: space-between;
    color: #555;
    border-bottom: 1px solid #eee;

    &-cancel,
    &-confirm {
      padding: 12px;
    }

    &-confirm {
      color: var(--picker-theme-color, #007aff);
    }
  }

  &-popup {
    width: 100%;
    height: 100%;
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
