# uni-app 血压计图片识别接入手册

适用接入包：BP-App-Integration-1.0.0。适用项目：uni-app Vue 2 的 Android 和 iOS App。文档日期：2026-10-19。

本手册面向原生和 uni-app 开发人员，说明如何把血压计照片识别 SDK 封装为独立插件，并由页面完成拍照、候选读数确认、原图留档和正式记录保存。

**接入状态：Android 已提供识别 AAR；iOS 需要先在 Mac 上构建框架。`jakob-bp-reader`、`captureAndRecognize` 等是下文约定的待开发接口，当前资料不包含可直接运行的 uni-app 插件。完成封装并重新打包后才能使用调用示例。**

## 开发顺序速览

| 顺序 | 开发任务 | 完成条件 | 对应章节 |
| --- | --- | --- | --- |
| 1 | 核对系统版本、架构和构建工具 | 确认宿主与原生 SDK 的兼容范围 | 第一、二、八章 |
| 2 | 创建独立 UTS 插件 | 两端目录和统一接口已建立 | 第二、五章 |
| 3 | 接入 Android AAR | 原生拍照、后台识别、原图留档可用 | 第三章 |
| 4 | 构建并接入 iOS 框架 | Swift 调用、相机方向和留档可用 | 第四章 |
| 5 | 对接 uni-app 页面 | 按 captureId 接收结果，支持重试和取消 | 第五、六章 |
| 6 | 接入业务保存 | 人工确认且原图留档成功后保存记录 | 第六、七章 |
| 7 | 打包并验收 | 真机、发布包和现有设备流程回归通过 | 第九、十章 |

## 页面调用的入口

以下是插件实现后的导入方式，详细的参数、事件及完整页面脚本见第五、六章。

```javascript
// #ifdef APP-PLUS
import {
  captureAndRecognize,
  retryArchive,
  cancelCapture,
  releaseCapture
} from '@/uni_modules/jakob-bp-reader'
// #endif
```

一次拍摄的正常顺序为：原生拍照 → 后台识别 → 展示候选读数 → 原图留档 → 用户核对读数和单位 → 调用现有业务接口保存。用户核对与原图保存可以并行，正式记录必须等两者都完成。

页面只接收读数、状态和文件路径。原始 JPEG 与识别像素保持在原生端，不通过 JS 传输整张图片。接入采用独立入口，不需要改变当前蓝牙、Wi-Fi 配网和设备绑定的调用链。

## 一 SDK 能做什么

本 SDK 从血压计显示屏照片中提取三行数字，给出收缩压、舒张压和脉率候选值。识别在本机运行，不需要网络或密钥。它不负责 ZK872 的蓝牙连接、Wi-Fi 配网、设备绑定或设备上传数据。

目前适用三行竖排、整数、七段深色数字。其他布局、小数、反光和模糊画面需要重拍或手动录入。三行对应关系及单位都要由用户确认，不能将候选值直接写成正式健康记录。

| 内容 | Android | iOS |
| --- | --- | --- |
| 已提供的算法载体 | `bp-native-reader-1.0.0.aar` | C++、Objective-C++ 源码和构建脚本 |
| 识别入口 | `BpReader.recognize(...)` | `BPNativeReader.recognize(...)` |
| 留档工具 | AAR 内的 `PhotoArchive` | 单独的 `PhotoArchive.swift` |
| 流程参考 | `AndroidCaptureFlow.java` | `IOSCaptureFlow.swift` |
| 最低系统版本 | Android 8.0 / API 26 | 当前构建脚本为 iOS 15.0 |
| 架构 | arm64-v8a、armeabi-v7a、x86_64 | 构建目标为真机 arm64，模拟器 arm64 / x86_64 |
| 接入前工作 | 新增相机和 uni-app 桥接层 | 先在 Mac 构建，再新增相机和桥接层 |

SDK 随附说明标明两端尚未完成真机验收，iOS 还未完成 Apple 平台编译验收，不能据此承诺手机上的识别速度或准确率。

## 二 接入方案和目录

现有 Vue 2 页面可以调用 UTS 插件。采用 Kotlin / Swift 混编时，按 DCloud 要求使用 HBuilderX 4.25 及以上版本。无需把当前项目改成 uni-app x。[UTS 插件说明](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)、[UTS 原生混编](https://uniapp.dcloud.net.cn/plugin/uts-plugin-hybrid.html)。

建议在 HBuilderX 中创建 API 类型的 UTS 插件，保留工具生成的 `package.json` 基础配置，再按以下结构补充文件。以下为计划目录，本文没有创建这些代码文件。

```text
uni_modules/jakob-bp-reader/
  package.json
  utssdk/
    interface.uts
    app-android/
      index.uts
      CaptureBridge.kt
      CaptureActivity.kt
      AndroidManifest.xml
      config.json
      libs/
        bp-native-reader-1.0.0.aar
    app-ios/
      index.uts
      CaptureBridge.swift
      PhotoArchive.swift
      Info.plist
      config.json
      Frameworks/
        BPReader.xcframework
```

| 层次 | 责任 |
| --- | --- |
| Vue 页面 | 打开拍照、展示候选读数、允许修正、确认单位、触发现有保存流程 |
| `interface.uts` | 定义两端一致的参数、返回值和事件 |
| 两端 `index.uts` | 导出 API、转换原生结果、把事件送回 JS |
| `CaptureBridge` 和相机页面 | 权限、相机、任务状态、方向、后台队列、取消与资源回收 |
| 原生 SDK | 识别像素，保存原始 JPEG 和候选元数据 |
| 现有业务服务 | 校验登录身份、保存正式记录、上传照片、刷新页面数据 |

JS 入口使用 `import { captureAndRecognize } from '@/uni_modules/jakob-bp-reader'`。本方案不使用 `uni.requireNativePlugin` 加载 AAR 文件。

若团队采用现有 `nativeplugins` 方案，也可以单独开发注册好的原生模块，再由 `uni.requireNativePlugin('模块注册名')` 调用；仍然需要桥接代码和新的原生安装包，不能把 AAR 文件名当模块名。[原生语言插件说明](https://uniapp.dcloud.net.cn/plugin/native-plugin.html)。两种方案选一种，避免重复引入 SDK。

## 三 Android 封装

### 放置依赖和配置

将 AAR 放入 `utssdk/app-android/libs/`。AAR 已包含 `com.company.bpreadersdk.BpReader` 和 `PhotoArchive`，不要再次加入同名 Java 源码，不要改 JNI 类名。

`app-android/config.json` 的基础配置示例：

```json
{
  "minSdkVersion": 26,
  "abis": ["armeabi-v7a", "arm64-v8a", "x86_64"]
}
```

这些目录和字段遵循 [DCloud Android 原生配置](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html#android平台原生配置)。相机若采用 CameraX，另行添加与当前构建工具兼容的 CameraX 依赖；算法 AAR 本身不包含相机页面。

在插件的 Android 清单中声明内部相机 Activity，并与宿主合并相机权限。Activity 名称必须匹配实际类，内部页面无需导出给其他应用。现有项目已有 CAMERA 声明，仍要处理运行时授权、拒绝及返回页面。

### 原生识别调用

下面是接入包已有的 Java API，放在后台识别队列执行：

```java
import com.company.bpreadersdk.BpReader;
import com.company.bpreadersdk.PhotoArchive;
import java.io.File;

// bitmap、originalJpeg 必须来自同一次拍照。
String resultJson = BpReader.recognize(
    bitmap, rotationClockwise, mirrored);

// 先解析 status；只有 recognized 才走当前留档流程。
// 将候选结果通知页面后，在独立的串行存储队列调用：
File folder = PhotoArchive.saveJpeg(
    context, captureId, originalJpeg, resultJson);
```

参数要求：

- `bitmap` 是有效、未回收的软件 `Bitmap.Config.ARGB_8888`。硬件 Bitmap 需要先转成支持的像素格式。
- 如果只有 JPEG，可在原生内存解码一次；不要把 Base64 或整张 Bitmap 传给 JS。
- `rotationClockwise` 只用 0、90、180、270；已经旋正的像素传 0。`mirrored` 表示旋转之后水平翻转。
- 同步识别返回前不能修改或回收像素。输入不超过 2400 万像素，SDK 工作图最长边为 900。
- `originalJpeg` 保留同次曝光的原始 JPEG 字节，低于 30 MB，不能用识别缩略图替代。

如果已有原生 YUV 相机管线，可以使用下列入口，避免额外 Bitmap 转换：

```java
String resultJson = BpReader.recognizeLuma(
    yPlaneDirectBuffer, width, height, rowStride,
    rotationClockwise, mirrored);
```

要求 direct ByteBuffer、`pixelStride = 1`，position 位于有效数据起点，允许行尾填充；在关闭 Image / ImageProxy 前完成调用。视频亮度范围 16～235 使用 `recognizeLumaVideoRange`。JPEG 压缩字节不能传给此接口。

留档目录为 App 私有的 `filesDir/bp-captures/<captureId>/`，包含 `original.jpg` 和 `record.json`。保存失败抛异常，应回调 `stage = archive`，保留原 JPEG 供重试。

`AndroidCaptureFlow.java` 可以作为实现参考，但还要补齐相机、页面生命周期、取消、并发限制和重试逻辑。

## 四 iOS 封装

### 先构建框架

在 Mac 安装 Xcode 和 Command Line Tools 后，在接入包的 iOS 目录执行：

```bash
bash build_xcframework.sh
```

脚本正常输出 `dist/BPReader.xcframework`；如果目录已有产物，以脚本打印的新输出路径为准。将生成的框架放入插件 `app-ios/Frameworks/`，把 `PhotoArchive.swift` 单独加入混编源码。后者不包含在该框架内。

该产物由静态库组成。在原生 Xcode 工程中按静态依赖链接，选择 Do Not Embed；需要 Foundation、CoreVideo、CoreGraphics、libc++，必要时添加 `-ObjC`。相机层还会用到 AVFoundation / UIKit，留档工具使用 CryptoKit。

`app-ios/config.json` 的起始配置示例：

```json
{
  "deploymentTarget": "15.0",
  "frameworks": [
    "Foundation.framework",
    "CoreVideo.framework",
    "CoreGraphics.framework",
    "AVFoundation.framework",
    "UIKit.framework",
    "CryptoKit.framework",
    "libc++.tbd"
  ]
}
```

字段和框架目录见 [DCloud iOS 原生配置](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html#ios平台原生配置)。配置后仍需验证框架导入、链接和最终打包。相机用途说明使用 `NSCameraUsageDescription`，沿用项目已有的有效说明并处理拒绝授权。

### 原生识别调用

下面是接入包已有的 Swift API，放在后台队列执行：

```swift
import BPReader

let result = BPNativeReader.recognize(
    pixelBuffer: buffer,
    rotationClockwise: rotation,
    mirrored: mirrored
)
```

如果没有 pixelBuffer，使用同次拍摄 JPEG 解码后的 CGImage：

```swift
let result = BPNativeReader.recognize(
    cgImage: image,
    rotationClockwise: rotation,
    mirrored: mirrored
)
```

CGImage 不携带 UIImage 的显示方向，需要根据原始相机 / EXIF 信息计算旋转；已经旋正的像素不要再转一次。CVPixelBuffer 支持 BGRA 或 8-bit bi-planar YUV，调用期间必须存活且不被改写。

识别成功后，将结果字典序列化为 JSON 字符串发给 JS，再在独立串行存储队列保存：

```swift
let folder = try BPPhotoArchive.save(
    originalJPEG: jpegData,
    captureID: captureID,
    recognition: result,
    root: archiveRoot
)
```

`archiveRoot` 使用 App 私有 Application Support 子目录。相机应配置 JPEG 输出，保留 `fileDataRepresentation()` 原字节；不能把 HEIC 文件直接按 JPEG 命名保存。设备锁定时文件保护可能导致写入失败，需支持解锁后重试。

`IOSCaptureFlow.swift` 只演示调用时序。正式封装应使用自己的串行存储队列，并适配页面生命周期；Swift 6 严格并发工程还需按实际编译器调整 actor / 队列边界。

## 五 建议新增的统一调用接口

以下接口是桥接层的开发约定，两端必须实现相同语义。SDK 本身没有这些 uni-app 方法。

### 方法

| 方法 | 参数和返回 | 用途 |
| --- | --- | --- |
| `captureAndRecognize(options)` | 返回原生生成的 UUID 字符串 `captureId` | 建立任务、申请相机权限、拍照、识别并留档 |
| `retryArchive(captureId)` | 无返回值，通过原任务事件回调报告结果 | 使用保留的原 JPEG 重试留档，不重新识别 |
| `cancelCapture(captureId)` | 无返回值 | 关闭该任务相机并取消后续交付，不能强行释放仍在使用的像素 |
| `releaseCapture(captureId)` | 无返回值 | 解除该任务回调并释放临时资源；不删除已留档照片 |

任务 UUID 在启动时生成；实际拍照时再记录 `capturedAtUnixMs`。所有事件都必须异步发出，晚于 `captureAndRecognize` 返回，避免页面尚未记住 ID 就收到回调。

建议的 `interface.uts` 类型定义如下。字符串事件和错误码取值见后续表格；两端 `index.uts` 应导出同名函数并调用各自的原生桥接类。

```typescript
export type BpEvent = {
  type: string
  captureId: string
  ownerId: string
  sessionId: string
  capturedAtUnixMs: number
  resultJson: string
  photoPath: string
  stage: string
  code: string
  message: string
  retryable: boolean
}

export type CaptureOptions = {
  ownerId: string
  sessionId: string
  onEvent: (event: BpEvent) => void
}

export type CaptureAndRecognize =
  (options: CaptureOptions) => string
export type RetryArchive = (captureId: string) => void
export type CancelCapture = (captureId: string) => void
export type ReleaseCapture = (captureId: string) => void
```

`ownerId` 是当次所属用户；`sessionId` 是每次登录生成的会话标记，不传密码或 access token。任务启动时冻结身份，拍摄期间账号切换时由 App 取消任务。回调和正式保存时继续校验身份，不能把旧照片挂到新登录账号。

未使用的字符串字段返回空字符串；尚未拍照的时间返回 0。`resultJson` 透传 SDK JSON，保留其 null 和未知扩展字段。`photoPath` 是原图路径，不是文件夹路径；在原生端用留档目录拼接 `original.jpg`，并验证能被宿主图片预览 / 上传接口读取。

### 事件及顺序

| `type` | 何时发出 | 页面处理 |
| --- | --- | --- |
| `captured` | 已取得同次拍摄像素和 JPEG | 记住原生拍摄时间，显示正在识别 |
| `readings` | 识别调用返回，包括 `recognized` / `no_reading` / `error` | 解析 `resultJson`；只有 recognized 可展示候选表单 |
| `archived` | 原图及元数据提交到私有目录成功 | 记录 `photoPath`，将照片状态置为已保存 |
| `error` | 权限、相机、桥接解析、运行异常或留档失败 | 根据 stage 展示重拍、权限说明或留档重试 |
| `cancelled` | 用户取消或主动取消完成 | 结束加载，丢弃本次未确认结果 |

正常顺序：`captured → readings(recognized) → archived`。`readings(no_reading/error)` 后不自动留档；保存照片失败则为 `readings(recognized) → error(archive)`，读数仍然可供查看和修正。重试成功再发 `archived`。

原生桥接层需要实现：

1. 同时只允许一个在处理的拍摄任务；重复启动回调 `E_BUSY`，不能覆盖原任务。
2. 保存失败时保留原 JPEG 和识别结果。重拍会释放上一个未留档任务的重试资源，页面应先明确提示用户。
3. `retryArchive` 在同一任务有写入进行时不得重复写入；已有完整归档时返回同一归档结果，不能重复建立正式记录。
4. 取消和释放必须按 captureId 执行并保持幂等。正在运行的同步识别或磁盘提交应安全结束后再释放内存。
5. 取消之后屏蔽迟到的 readings / archived 回调。若取消时磁盘提交已经完成，保留该归档，交给后续恢复或清理流程处理。
6. 页面离开后不再更新已销毁 UI。已留档文件的删除由单独的业务保留策略决定，不能借 release 顺带删除。

建议桥接错误码：`E_PERMISSION`、`E_CAMERA`、`E_BUSY`、`E_RECOGNITION`、`E_ARCHIVE`、`E_ARCHIVE_EXPIRED`、`E_PARSE`、`E_UNSUPPORTED`。它们是新增的桥接错误码，不要与 SDK 数值 code 混用。只有原图仍被保留、且确实可重试的留档失败才设置 `retryable = true`。

## 六 uni-app 页面调用示例

下面是 Vue 2 页面脚本示例。模板需提供拍照、候选值编辑、单位选择、人工确认、重试留档和保存按钮。该示例依赖第五节插件实现，以及两个由项目接入的业务函数：

- `getCaptureIdentity()` 返回当前 `{ ownerId, sessionId }`，未登录返回 null。会话标记必须在退出 / 重登录时更新。
- `saveConfirmedBpRecord(payload)` 接入项目实际保存与上传逻辑；使用 captureId 保证幂等，并校验当前身份。Promise 仅在业务保存成功后 resolve。

`bpCaptureBusiness.js` 是示例中的待新增适配文件名，不是接入包自带接口。业务请求地址、鉴权和首页刷新逻辑应复用当前项目约定。

```javascript
// #ifdef APP-PLUS
import {
  captureAndRecognize, retryArchive,
  cancelCapture, releaseCapture
} from '@/uni_modules/jakob-bp-reader'
// #endif
import {
  getCaptureIdentity, saveConfirmedBpRecord
} from '@/pages/api/bpCaptureBusiness.js'

export default {
  data() {
    return {
      activeId: '', identity: null, busy: false,
      saving: false, result: null, photoPath: '',
      capturedAt: 0, archiveRetryable: false,
      statusText: '', confirmed: false,
      form: { systolic: '', diastolic: '', pulse: '', unit: '' }
    }
  },
  onUnload() {
    this.disposeCapture()
  },
  methods: {
    sameIdentity() {
      const now = getCaptureIdentity()
      return !!(now && this.identity &&
        now.ownerId === this.identity.ownerId &&
        now.sessionId === this.identity.sessionId)
    },
    disposeCapture() {
      const id = this.activeId
      this.activeId = '' // 先阻止迟到回调更新页面
      this.busy = false
      // #ifdef APP-PLUS
      if (id) {
        cancelCapture(id)
        releaseCapture(id)
      }
      // #endif
    },
    startCapture() {
      if (this.busy || this.saving) return
      const identity = getCaptureIdentity()
      if (!identity) return
      // 重拍前，UI 应确认用户愿意放弃上一条未保存结果。
      this.disposeCapture()
      this.identity = { ...identity }
      this.result = null
      this.photoPath = ''
      this.capturedAt = 0
      this.confirmed = false
      this.archiveRetryable = false
      this.form = { systolic: '', diastolic: '', pulse: '', unit: '' }
      // #ifdef APP-PLUS
      this.busy = true
      this.statusText = '请拍摄血压计显示屏'
      try {
        this.activeId = captureAndRecognize({
          ownerId: identity.ownerId,
          sessionId: identity.sessionId,
          onEvent: event => this.handleCaptureEvent(event)
        })
      } catch (error) {
        this.busy = false
        this.statusText = '拍照识别启动失败'
      }
      // #endif
      // #ifndef APP-PLUS
      this.statusText = '请在 Android 或 iOS App 中使用'
      // #endif
    },
    handleCaptureEvent(event) {
      if (event.captureId !== this.activeId) return
      if (!this.sameIdentity() ||
          event.ownerId !== this.identity.ownerId ||
          event.sessionId !== this.identity.sessionId) {
        this.disposeCapture()
        this.result = null
        this.photoPath = ''
        this.statusText = '账号已变化，请重新拍摄'
        return
      }
      if (event.type === 'captured') {
        this.capturedAt = event.capturedAtUnixMs
        this.statusText = '正在识别'
      } else if (event.type === 'readings') {
        try {
          this.result = JSON.parse(event.resultJson)
        } catch (error) {
          this.disposeCapture()
          this.result = null
          this.statusText = '识别结果解析失败，请重拍'
          return
        }
        if (!this.result || this.result.status !== 'recognized') {
          this.busy = false
          this.statusText = '未获得可靠读数，请重拍或手动录入'
          return
        }
        const r = this.result.readings || {}
        this.form.systolic = r.systolic == null ? '' : String(r.systolic)
        this.form.diastolic = r.diastolic == null ? '' : String(r.diastolic)
        this.form.pulse = r.pulse == null ? '' : String(r.pulse)
        this.form.unit = '' // 由用户选择，不假定单位
        this.statusText = '请核对读数，照片正在保存'
      } else if (event.type === 'archived') {
        this.photoPath = event.photoPath
        this.archiveRetryable = false
        this.busy = false
        this.statusText = '照片已保存，请确认读数和单位'
      } else if (event.type === 'error') {
        this.busy = false
        this.archiveRetryable = event.stage === 'archive' && event.retryable
        this.statusText = event.message || '处理失败，请重试'
      } else if (event.type === 'cancelled') {
        this.disposeCapture()
        this.result = null
        this.photoPath = ''
        this.statusText = '已取消'
      }
    },
    retryPhotoArchive() {
      if (!this.activeId || !this.archiveRetryable || this.busy) return
      if (!this.sameIdentity()) {
        this.disposeCapture()
        this.result = null
        this.photoPath = ''
        this.statusText = '账号已变化，请重新拍摄'
        return
      }
      // #ifdef APP-PLUS
      this.busy = true
      try {
        retryArchive(this.activeId)
      } catch (error) {
        this.busy = false
        this.statusText = '照片重试失败'
      }
      // #endif
    },
    async confirmAndSave() {
      if (this.saving || this.busy || !this.sameIdentity()) return
      if (!this.result || this.result.status !== 'recognized') return
      if (!this.photoPath || !this.confirmed || !this.capturedAt) return
      if (!['mmHg', 'kPa'].includes(this.form.unit)) return
      const systolic = Number(this.form.systolic)
      const diastolic = Number(this.form.diastolic)
      const pulse = Number(this.form.pulse)
      if (![systolic, diastolic, pulse].every(n => Number.isFinite(n) && n > 0)) return
      if (!Number.isInteger(pulse)) return
      const id = this.activeId
      this.saving = true
      try {
        await saveConfirmedBpRecord({
          captureId: id, ...this.identity,
          capturedAtUnixMs: this.capturedAt,
          readings: { systolic, diastolic, pulse },
          unit: this.form.unit, photoPath: this.photoPath,
          confirmed: true
        })
        if (id !== this.activeId || !this.sameIdentity()) return
        this.statusText = '记录已保存'
        this.disposeCapture()
        this.result = null
        this.photoPath = ''
      } catch (error) {
        if (id === this.activeId && this.sameIdentity()) {
          this.statusText = '记录保存失败，请重试'
        }
      } finally {
        this.saving = false
      }
    }
  }
}
```

`confirmed` 只能由用户明确操作设置为 true。读数、行顺序或单位再次被编辑时，将它重置为 false。这里只检查基础输入格式，具体业务范围及单位转换使用项目现有规则。SDK 不识别小数，不能把整数候选仅切换单位标签就当作完成了换算。

相机通常会使 uni-app 页面触发 onHide，不能一律在 onHide 立即取消相机。按实际原生页面和 App 生命周期处理；页面真正卸载、退出登录或切换账号时取消对应任务。业务保存如果已经发出，服务端也必须校验所属账号及幂等键。

## 七 返回数据与正式记录

SDK 成功返回示例：

```json
{
  "status": "recognized",
  "code": 0,
  "requiresConfirmation": true,
  "unit": null,
  "readings": { "systolic": 110, "diastolic": 70, "pulse": 80 },
  "sourceSize": { "width": 1024, "height": 1366 },
  "workingSize": { "width": 675, "height": 900 }
}
```

| SDK 字段 | 含义及处理 |
| --- | --- |
| `status` | recognized 为候选成功；no_reading / error 时不能把 null 当 0 |
| `code` | 0 成功；1 未可靠识别；-1 输入错误；-2 资源限制；-3 内部失败 |
| `requiresConfirmation` | 候选结果需人工确认 |
| `unit` | 当前始终为 null，不能默认 mmHg 或 kPa |
| `readings` | 按上、中、下三行推定 systolic / diastolic / pulse，需核对对应关系 |
| `error` | 非成功结果的错误信息，展示前可按业务需要转为易懂提示 |
| `regions` | 定位区域；坐标以旋正后的原图为基准，不能直接当屏幕像素 |

如果画识别框，`rows` 的 x、y、width、height 是 0～1 比例；乘实际显示图像尺寸后，再加 aspect-fit 留白偏移。存在校正时优先使用 rowPolygons。显示原 JPEG 时处理 EXIF 的规则要与识别方向一致。

原图及 SDK 的 `record.json` 只是留档，其中状态为 `pending_user_confirmation`。正式记录应同时满足：

- 当前身份仍匹配拍摄任务的账号和登录会话。
- 用户已确认并可修正读数、三行含义和压力单位。
- `archived` 已成功，原图路径及关联关系有效。
- 业务保存以 captureId 做幂等，并保留修正后的值与原始候选的区别。

拍摄时间、用户确认的测量时间和留档时间应区分。SDK 的 `archivedAtUnixMs` 是写入文件时间，不是血压测量时间；若拍摄历史读数，应由用户提供实际测量时间。

识别成功、影像留档成功、业务记录保存成功、云上传成功是不同状态。照片已保存不代表已上传；`.pending` 目录也不能被当作完整归档。进程被杀后如需继续恢复，由 App 实现任务索引和恢复策略。

## 八 当前项目集成前需要核对的配置

以下是当前项目静态配置与 SDK 条件的对照，不代表最终安装包已经满足要求。

| 项目项 | 当前代码情况 | 接入时处理 |
| --- | --- | --- |
| Vue | `vueVersion` 为 2 | 可保留，单独新增识别页面及插件 |
| Android 最低版本 | 主配置 minSdkVersion 26，自定义清单另含 23 | 查看最终合并清单，SDK 所在安装包至少 API 26 |
| Android target | 主配置 36，自定义清单另含 35 | 使用构建结果核对，不为接入识别随意降低 target |
| Android 架构 | abiFilters 含 x86 | 当前 AAR 没有 32 位 x86 库；排除该架构会改变兼容范围，或向 SDK 提供方补库 |
| iOS 最低版本 | 有 10.0 与 15.0 的不同配置 | 当前框架按 15.0 构建；提升宿主最低版本会影响旧系统用户 |
| 相机权限 | 项目已有相关声明 | 核对最终包用途说明及运行时拒绝处理 |
| 原生插件 | 已有设备及保活插件 | 新增独立识别模块，不复用同名类或覆盖现有依赖 |

如果必须继续支持 iOS 10～14，需让 SDK 提供兼容构建并完成验证，或单独设计可选加载方案；仅在 JS 里判断系统版本不能保证一个链接了 iOS 15 依赖的安装包兼容旧系统。

为保持现有设备功能，图片识别应从单独入口触发。设备绑定、蓝牙重连、ZK872 配网、Wi-Fi 上传和保活流程无需因为新增拍照识别而更改。正式记录保存后，再按现有数据刷新约定通知首页。

## 九 构建和联调步骤

1. 在独立开发分支或备份后新增插件，先完成 Android 单张照片的识别和留档，再接统一事件协议。
2. 在 Mac 构建 iOS XCFramework，确认 Swift 可以导入 BPReader，再完成 iOS 相机和同一事件协议。
3. 实现 uni-app 结果确认页和业务适配器，不将识别候选自动写入正式记录。
4. 重新制作包含原生依赖的自定义基座或完整安装包。新增 AAR / XCFramework 不能只通过 JS 热更新生效。
5. 使用真机验证 Debug 和 Release，正式发布另行生成正式包，不能把调试基座当发布包。

构建方式参考 [UTS 插件说明](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html) 和 [原生插件打包说明](https://uniapp.dcloud.net.cn/plugin/native-plugin.html)。当前包只覆盖 Android / iOS；H5、小程序及纯鸿蒙原生端需独立实现，示例通过条件编译避免在这些端调用本插件。

| 场景 | 验收结果 |
| --- | --- |
| 正常三行数字 | 读数候选先出现，照片保存状态独立更新 |
| 90 / 180 / 270 度及镜像 | 图片、读数和定位框方向一致 |
| 模糊、反光、非支持布局 | 可重拍或手动录入，不把缺失值写成 0 |
| 相机拒绝或用户取消 | 加载结束，原相机资源关闭，可再次进入 |
| 连续点击拍照 | 无并行相机 / 识别任务覆盖，无串图和串结果 |
| 磁盘满或锁屏写入失败 | 候选仍可查看，不显示记录已保存，可按条件重试 |
| 页面返回、前后台切换 | 无已销毁页面回调，无像素提前释放或相机泄漏 |
| 拍摄后切换账号 | 旧任务结果不能保存到新账号 |
| 保存按钮重复点击或请求重试 | captureId 保证同一正式记录不重复建立 |
| Release / R8 / 不同 ABI | JNI 可加载，识别与留档均成功 |
| iOS 真机及模拟器 | 框架切片匹配，Swift 导入、链接及方向处理通过 |
| 原有设备流程回归 | 蓝牙、Wi-Fi、绑定、数据刷新和保活行为与接入前一致 |

## 十 开发交付清单

- 两端可编译的 `jakob-bp-reader` 插件，以及明确的支持系统 / 架构列表。
- 第五节四个方法与事件协议的实现，包括权限、取消、保存失败重试和资源释放。
- 独立的 Vue 2 调用页面、人工确认表单，以及实际业务保存适配器。
- iOS 已编译框架、Android 依赖与混淆规则，及必要运行库 NOTICE。
- 两端真机结果、失败分支、Release 包及现有设备功能回归记录。

完成上述交付后，使用包含该插件的新安装包验证第六章的页面调用。仅复制调用脚本无法替代原生插件实现。

## 参考资料

SDK 原始资料为提供的 BP-App-Integration-1.0.0 目录内 `先读我.md`、`Android/接入说明.md`、`Android/AndroidCaptureFlow.java`、`iOS/接入说明.md`、`iOS/BPReader.h`、`iOS/IOSCaptureFlow.swift` 和 `iOS/PhotoArchive.swift`。

- [DCloud UTS 插件规范](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
- [DCloud UTS 原生混编](https://uniapp.dcloud.net.cn/plugin/uts-plugin-hybrid.html)
- [DCloud 原生语言插件调用与打包](https://uniapp.dcloud.net.cn/plugin/native-plugin.html)
