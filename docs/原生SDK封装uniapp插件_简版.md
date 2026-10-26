# 原生血压计 SDK 封装为 uni-app 插件

现有 Android、iOS 文件是原生 SDK。要让 uni-app 调用，需要增加一层 **uni-app 原生模块**，然后编译成插件包。本说明采用当前项目已有的 `nativeplugins` 接入方式。

调用关系：`uni-app 页面 → 新增原生模块 → 现有血压识别 SDK → 回调结果给页面`。

## 一 现有文件怎么处理

| 平台 | 已有文件 | 需要补的工作 | 最终交付格式 |
| --- | --- | --- | --- |
| Android | `bp-native-reader-1.0.0.aar`、`AndroidCaptureFlow.java` | 新增 uni-app 模块，在模块内调用现有 AAR | 新模块 `.aar` + 原 SDK `.aar` |
| iOS | `bp_reader.cpp/.h`、`BPReader.mm/.h`、Swift 文件 | 新增 uni-app 模块，在 Xcode 中编译模块和算法代码 | `.framework`，也可以是 `.a` 加头文件 |
| 插件说明 | 目前没有 uni-app 注册配置 | 声明模块名称、原生类名和依赖 | `package.json` |

**不是改一下文件后缀，也不是只写 package.json；必须新增模块代码并编译。**

## 二 Android 怎么做

1. 用 Android Studio 和 DCloud 的原生插件开发工程创建模块。
2. 新增例如 `BpReaderModule.java`，继承 `UniModule`。
3. 给供 JS 调用的方法加 `@UniJSMethod`，例如 `captureAndRecognize`。
4. 方法内部完成拍照、后台调用 `BpReader.recognize(...)`，再通过 `UniJSCallback` 返回结果。已有 `AndroidCaptureFlow.java` 可作为流程参考，按插件工程调整。
5. 编译输出例如 `jakob-bp-plugin.aar`。与原来的 `bp-native-reader-1.0.0.aar` 一起交付。

这里按两个 AAR 分开交付：新 AAR 包含桥接模块，原 AAR 提供算法；不要重复打包相同 SDK 类。当前 SDK 最低 Android API 26。

开发依据：[DCloud Android 原生模块教程](https://nativesupport.dcloud.net.cn/NativePlugin/course/android.html)。

## 三 iOS 怎么做

1. 使用 Mac、Xcode 和 DCloud 的 iOS 原生插件开发工程。
2. 新增例如 `BPReaderModule.h/.mm`，继承 `DCUniModule`。
3. 用 `UNI_EXPORT_METHOD` 导出供 JS 调用的方法，例如 `captureAndRecognize`。
4. 模块内部调用现有 `BPNativeReader`，通过回调返回结果。拍照与留档可参考 `IOSCaptureFlow.swift`、`PhotoArchive.swift`，按工程调整。
5. 将新增模块、算法源码和所需辅助代码编译为例如 `JakobBPPlugin.framework`。本文目录示例按静态 framework 交付，算法与桥接代码都包含其中。

原包的 `build_xcframework.sh` 可以生成 `BPReader.xcframework`，但那只是算法库，仍然没有 uni-app 模块。若采用该编译路线，还要将它作为依赖接入插件工程，并按所用打包工具支持的格式整理依赖；不能直接把 `.xcframework` 改名为 `.framework`。

当前提供的 iOS 构建目标是 iOS 15+。使用 Swift 辅助代码时，还需配置插件的 Swift 支持和对应系统依赖。

开发依据：[DCloud iOS 原生模块教程](https://nativesupport.dcloud.net.cn/NativePlugin/course/ios.html)。

## 四 最终给 uni-app 的文件夹

以下名称是示例，需要开发完成后生成对应文件。

```text
nativeplugins/
  Jakob-BPReader/
    package.json
    android/
      jakob-bp-plugin.aar
      bp-native-reader-1.0.0.aar
    ios/
      JakobBPPlugin.framework/
```

`package.json` 的关键配置：

| 配置 | 作用 |
| --- | --- |
| `id` | 插件标识，例如 `Jakob-BPReader` |
| `_dp_type` | 设置为 `nativeplugin` |
| `_dp_nativeplugin.android` / `ios` | 分别声明两端配置 |
| 两端 `plugins[].type` | 设置为 `module` |
| 两端 `plugins[].name` | 使用同一个注册名，例如 `Jakob-BPReader` |
| 两端 `plugins[].class` | Android 填实际完整类名，iOS 填实际模块类名 |
| 两端 `integrateType` | Android 为 `aar`；本例 iOS 为 `framework` |

此外由原生开发人员补齐最低系统版本、依赖、架构、相机权限和混淆配置。静态 framework 不按动态 framework 嵌入。文件夹可压缩为 ZIP 交付，ZIP 内保留 `Jakob-BPReader` 这一层；`android`、`ios` 目录使用小写。[DCloud 插件包格式](https://nativesupport.dcloud.net.cn/NativePlugin/course/package.html)。

## 五 uni-app 怎么接入和调用

1. 把上面的 `Jakob-BPReader` 文件夹放入项目的 `nativeplugins`。
2. 在 HBuilderX 的 `manifest.json → App 原生插件配置` 中选择该本地插件。
3. 重新制作自定义基座或完整安装包，不能仅通过 JS 热更新加入原生库。
4. 在 App 页面调用：

```javascript
// 插件已开发、注册并打包后使用。
// captureAndRecognize 是约定新增的方法，不是原 SDK 已有的 JS API。
// #ifdef APP-PLUS
const bpPlugin = uni.requireNativePlugin('Jakob-BPReader')

bpPlugin.captureAndRecognize({}, (res) => {
  console.log('血压识别结果', res)
})
// #endif
```

两端对外的方法名、参数和返回格式保持一致。建议返回拍摄编号、识别状态、候选读数和照片保存状态；血压值及单位由用户确认后，再使用现有业务接口保存。

因此，需要原生开发人员交付的是：**Android 桥接 AAR、iOS 插件 framework、它们依赖的算法库，以及完整的 package.json 和调用说明。** 原有 SDK 已提供算法部分，缺的是 uni-app 模块封装和打包。
