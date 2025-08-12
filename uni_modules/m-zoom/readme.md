# m-zoom
## 介绍
html元素缩放

## 使用示例
```
直接包裹目标元素即可
<m-zoom>
    <view></view>
</m-zoom>
```


## props
| 属性		 | 是否必填	 |  值类型	      | 默认值    | 说明			|
| --------- | ------ 	| ---------- 	| --------------	| ----------------|
| direction	|	否 		| Array 或 null	|['up','down','left','right']	    | 容器宽度,为null时禁用缩放		|
| precision	|	否 		| Number	    | 1	        | 拖拽精度(px值)		|


## 注意
- 目标元素不能设置绝对定位
