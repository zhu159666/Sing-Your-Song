# Android 上架（Google Play）

用 Capacitor 把网页打包成 APK/AAB。**这台机器没有 Android SDK**，所以下面是文件骨架 + 你要在某台装了 Android Studio 的电脑上执行的命令。

## 一、一次性准备

```bash
# 1. 装 Node 18+ 与 Android Studio（含 SDK 34）
# 2. 在项目根目录（pitch-prototype）执行：
npm init -y
npm i @capacitor/core@6 @capacitor/cli@6 @capacitor/android@6
npx cap init "Sing Your Song" "com.zhu159666.singyoursong" --web-dir=.
npx cap add android
```

`npx cap add android` 会生成 `android/` 目录（本目录里的文件是覆盖用的参考）。

## 二、把 web 资源指过来

`capacitor.config.json`（本目录已提供）里 `webDir` 指向仓库根目录，Capacitor 会整目录拷进 APK。

因为 `samples/` 有 3.2MB、`vendor/Tone.js` 345KB，包体大约 **8–10MB**，可以接受。

## 三、签名配置（关键）

1. 复制 `key.properties.example` → `android/key.properties`，填入口令
2. 在 `android/app/build.gradle` 里加上本目录 `build.gradle.snippet` 的内容
3. 出包：

```bash
cd android
./gradlew bundleRelease      # 产出 app/build/outputs/bundle/release/app-release.aab
```

⚠️ **密钥文件在 `D:\VN-Studio-0.1.0-x64\signing\singyoursong-upload.jks`**，已经生成好了，口令在 `.keystore-password.txt`。**务必备份**——丢了就无法再更新这个 App。

## 四、权限（必须）

录麦克风需要在 `android/app/src/main/AndroidManifest.xml` 里声明：

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

并在 `MainActivity` 里请求运行时权限（Capacitor 6 可用 `@capacitor/microphone` 或原生 requestPermissions）。

> WebView 里的 `getUserMedia` 需要 `setWebChromeClient` 的 `onPermissionRequest` 放行，
> Capacitor 默认已处理，如果录音没反应，检查这里。

## 五、Play Console 提交

1. 注册开发者账号（$25 一次性，需实名）
2. **启用 Play App Signing**（Google 保管应用签名密钥，你只上传 AAB）
3. 上传 `app-release.aab`
4. 填商店信息：
   - 应用名：Sing Your Song
   - 简短说明：哼一段旋律，自动编成一首歌
   - 图标：`store/icons/icon-512.png`
   - 截图：`store/screenshots/` 里的手机图（**至少 2 张**）
   - 隐私政策：`https://zhu159666.github.io/Sing-Your-Song/privacy.html`
   - 数据安全表单：**不收集任何数据**
   - 内容分级：全年龄
5. 内部测试 → 生产发布

## 六、已知风险

| 风险 | 说明 |
| --- | --- |
| WebView 音频延迟 | 安卓 WebView 的 Web Audio 延迟比 Chrome 高（约 20–50ms），编曲可以接受，实时演奏不行 |
| 录音权限 | 必须运行时申请，否则 `getUserMedia` 直接失败 |
| 包体 | 采样 3.2MB + 引擎，AAB 约 8–10MB |
| 后台播放 | 切后台音频会被挂起，需要在 MainActivity 里处理，首版可以先不做 |
