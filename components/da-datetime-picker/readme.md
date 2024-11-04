# da-datetime-picker

一个基于 Vue3 的日期时间选择器组件，好用就完事了。

组件一直在更新，遇到问题可在下方讨论。

### 关于使用

可在右侧的`使用 HBuilderX 导入插件`或`下载示例项目ZIP`，方便快速上手。

可通过下方的示例及文档说明，进一步了解使用组件相关细节参数。

插件地址：https://ext.dcloud.net.cn/plugin?id=12518

### 组件示例

```jsx
<template>
  <view class="picker-box">
    <button class="picker-btn" @click="handlePickerShow()">选择时间</button>
    <view class="picker-text">已选时间：{{ datePickerValue || '--' }}</view>
  </view>
  <DaDatetimePicker
    :visible="showDatePicker"
    :value="datePickerValue"
    @confirm="handleConfirm"
    @cancel="handleCancel"></DaDatetimePicker>
</template>
```

```js
import { defineComponent, ref } from 'vue'

import DaDatetimePicker from '@/components/da-datetime-picker/index.vue'
export default defineComponent({
  components: { DaDatetimePicker },
  setup() {
    const showDatePicker = ref(false)
    const datePickerValue = ref(null)
    function handlePickerShow() {
      showDatePicker.value = true
      console.log('handlePickerShow ==>')
    }
    function handleConfirm(v) {
      datePickerValue.value = v
      showDatePicker.value = false
      console.log('handleConfirm ==>', v)
    }
    function handleCancel() {
      showDatePicker.value = false
      console.log('handleCancel ==>')
    }

    return {
      showDatePicker,
      datePickerValue,
      handlePickerShow,
      handleConfirm,
      handleCancel,
    }
  },
})
```

### 组件参数

| 属性        | 类型                       | 默认值    | 必填 | 说明                                              |
| :---------- | :------------------------- | :-------- | :--- | :------------------------------------------------ |
| visible     | `Boolean`                  | `false`   | 是   | 是否显示弹窗                                      |
| value       | `Date`\|`String`\|`Number` | -         | 否   | 默认选中的时间                                    |
| valueFormat | `Boolean`                  | `true`    | 否   | 是否格式化回调的时间                              |
| themeColor  | `String`                   | `#007aff` | 否   | 主题色                                            |
| years       | `Array`                    | -         | 否   | 可选年份范围，默认为前后 30 年，格式`[2000,2020]` |

### 组件事件

| 事件名称 | 回调参数                | 说明           |
| :------- | :---------------------- | :------------- |
| confirm  | `(value: Date) => void` | 确定选择时回调 |
| cancel   | `() => void`            | 取消选择时回调 |

### 组件版本

v1.0.2

### 差异化

已通过测试

> - H5 页面
> - 微信小程序
> - 支付宝、钉钉小程序
> - 字节跳动、抖音、今日头条小程序
> - 百度小程序
> - 飞书小程序
> - QQ 小程序
> - 飞书小程序

未测试

> - 京东小程序、快手小程序由于非企业用户暂无演示
> - 快应用、360 小程序因 Vue3 支持的原因暂无演示
