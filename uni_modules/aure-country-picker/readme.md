# aure-country-picker 国际区号选择组件

## 组件参数说明

### 基本用法

```vue
<template>
  <aure-country-picker
    v-model="selectedDialCode"
    :title="'选择国家/地区'"
    :height="'70%'"
    :width="'60vw'"
    :duration="350"
    :position="'bottom'"
    :round="true"
    :radius="'24rpx'"
    :mask-closable="true"
  ></aure-country-picker>
</template>
<script setup>
import { ref } from 'vue'
const selectedDialCode = ref('86')  // 默认中国区号
</script>
```

### Props 参数

| 参数名               | 类型           | 默认值               | 说明                                                                                                   | 可选值/示例                              |
|----------------------|---------------|----------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------|
| `v-model`            | String/Number | 无                   | 当前选中的国际区号，仅支持区号字符串（如 `'1'`、`'86'`），用于双向绑定                                  | `'86'`、`'1'`                        |
| `defaultCountryCode` | String        | 无                   | 默认国家/地区代码（如 `'US'` 或 `'CA'`），用于区号重复时辅助精准定位，只在组件初始化时生效               | `'US'`、`'CA'`                       |
| `title`              | String        | `'选择国家/地区'`    | 弹窗顶部标题文字                                                                                       | `'选择国家/地区'`                         |
| `cancelText`         | String        | `'取消'`             | 弹窗右上角“取消”按钮文案，支持自定义和多语言                                                          | `'取消'`、`'Close'`                    |
| `searchPlaceholder`  | String        | `'搜索国家/地区'`    | 搜索框占位符文案，自定义提示内容                                                                       | `'搜索'`、`'搜索国家/地区'`、`'请输入...'`       |
| `height`             | String        | `'80%'`              | 弹窗高度，仅 `position=bottom/top` 有效                                                                | `'70%'`、`'480rpx'`、`'80vh'`         |
| `width`              | String        | `'80%'`              | 弹窗宽度，仅 `position=left/right` 有效                                                                | `'70%'`、`'480rpx'`、`'80vw'`         |
| `duration`           | Number        | `300`                | 弹窗动画时长（ms）                                                                                     | `200`、`400`                         |
| `position`           | String        | `'bottom'`           | 弹窗出现方向                                                                                           | `'bottom'`、`'top'`、`'left'`、`'right'` |
| `round`              | Boolean       | `true`               | 弹窗是否带圆角                                                                                        | `true`、`false`                      |
| `radius`             | String        | `'24rpx'`            | 圆角半径，带单位                                                                                       | `'16rpx'`、`'20px'`                  |
| `maskClosable`       | Boolean       | `true`               | 点击遮罩是否允许关闭弹窗                                                                               | `true`、`false`                      |
| `countryList`        | Array         | 内置国家/地区数据    | 自定义数据源，数组结构同 `/country-data.js`，一般无需设置                                               | `[]`                                |


### 事件

| 事件名               | 说明                              | 参数                                            |
|----------------------|-----------------------------------|-------------------------------------------------|
| `v-model`  | 选中区号发生变化时触发            | 区号字符串（如 `'86'`、`'1'`）                   |
| `change`             | 选中国家/地区对象变化时触发            | 完整国家/地区对象 `{ code, name, localName, dial_code }` |

### 数据源结构

每条数据结构如下（一般不用自定义）：

```js
{
  name: "China",
  localName: "中国",
  dial_code: "86",
  code: "CN"
}
```
> 内置所有国际主流国家/地区，无需自定义，特殊需要时可传 `:country-list="自定义数据"`。

### 插槽

暂无自定义插槽（如需扩展可按实际需求自行 PR）。

### 典型用法场景

- 手机号输入注册登录，选择区号
- 绑定海外手机号
- 表单注册/认证场景的国际化

---

**Tips：**

- 组件根据 `v-model`（区号，如 `'1'`）自动选中对应国家/地区；若同一区号对应多个国家/地区（如加拿大 🇨🇦 和美国 🇺🇸 都是 `+1`），则会优先选中国家/地区列表中的第一个，或者根据传入的 `defaultCountryCode` 精确选中。
- 支持通过中文名、英文名、国际区号（如 `+86`）、ISO 国家码（如 `US`、`CN`）进行搜索。

---