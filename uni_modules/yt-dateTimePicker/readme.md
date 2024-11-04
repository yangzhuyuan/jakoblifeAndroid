# uniApp 简单的日期时间选择器

uniApp 日期时间选择器, 可选择年, 月, 日, 时, 分, 秒.


## 示例链接

[计算你来到这个世界多少天了](https://tinyurl.com/yangtao-age)

## 演示效果图

<p>
  <img align=top src="https://7072-prod-4gapv4gl33a8a0ff-1305990777.tcb.qcloud.la/%E9%87%8D%E8%A6%81%E5%9B%BE%E7%89%87%E5%AD%98%E5%82%A8/uniappcj.png?sign=67f6bd2b9d1e5f5bbdecc5ffdf9b923d&t=1699237042" width="500px" height="auto">
</p>


## 用法

在 template 中：

```vue
<template>
  <view>
    <button type="default" @click="openDatetimePicker">时间选择</button>
    <yt-dateTimePicker
      ref="myPicker"
      @submit="handleSubmit"
      :start-year="2000"
      :end-year="2099"
      time-init="2023-5-20"
      :time-hide="[true, true, true, true, true, false]"
      :time-label="['年', '月', '日', '时', '分', '秒']"
    />
  </view>
</template>
```

在 script 中：

- 该插件遵循 easycom 规范, 不用显式导入就可以使用 `<yt-dateTimePicker />`
- 如需按需导入可以使用`import YtDateTimePicker from "uni_modules/yt-dateTimePicker/components/yt-dateTimePicker/yt-dateTimePicker.vue";`

```javascript
export default {
  data() {
    return {
      birthday: "",
    };
  },
  methods: {
    // 打开picker
    openDatetimePicker() {
      this.$refs.myPicker.show();
    },

    // 关闭picker
    closeDatetimePicker() {
      this.$refs.myPicker.hide();
    },

    handleSubmit(e) {
      this.birthday = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`;
    },
  },
};
```

> Note: 不要把组件放 swiper 里面或者 v-for 里面等, 最好放在页面根部. 通常情况下打开 picker 需要调用`this.$refs.refName.show()`, 在选择完毕后 picker 会自动隐藏，不需要调用`this.$refs.refName.hide()`来手动隐藏。

## 属性说明

| 属性		| 是否必填	|  值类型	| 默认值	| 说明			|
| --------- | -------- 	| -----: 	| --: 	| :------------:|
| start-year|	是  		| Number	|2000	| 选择开始年份	|
| end-year	|	是 		| Number	|2099	| 选择结束年份	|
| time-init	|	否 		| String	|2023-5-20| 自定义初始时间, 默认为当前时间	|
| time-hidden|	是 		| Array	|[true, true, true, true, true, true]| 自定义时间列显示，默认显示年月日日分 |
| time-label|	否 		| Array	|['年', '月', '日', '时', '分', '秒']	| 自定义各个时间单位	|
| @submit	|	否 		| Function	|Object	|  监听选择事件, 回调函数的第一个参数包含了选择时间的完整信息|

| `QQ交流群(906392632)`  |

|<p><img align=top src="https://7072-prod-4gapv4gl33a8a0ff-1305990777.tcb.qcloud.la/%E9%87%8D%E8%A6%81%E5%9B%BE%E7%89%87%E5%AD%98%E5%82%A8/Snipaste_2023-11-06_16-50-56.png?sign=ed27f09cfeabb33e24835fecdd4108db&t=1699260686" width="500px" height="auto"></p>|
| QQ群号：906392632      |

