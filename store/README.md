# 商店素材与提交说明

这个目录是"拿去就能提交"的素材。三个渠道通用部分已经齐了。

## 目录

```
store/
├── icons/                       图标全套（由 icons/icon.html 渲染 1024 后缩放）
│   ├── icon-1024.png            微软 / Apple 必需
│   ├── icon-512.png   icon-512-maskable.png
│   ├── icon-256.png   icon-128.png   icon-64.png
│   └── icon-192.png   icon-192-maskable.png
├── screenshots/
│   ├── 01-main-1366x768.png     微软商店：桌面截图
│   ├── 02-timbres-1366x768.png
│   ├── 03-staff-1366x768.png
│   └── 04-phone-1080x1920.png   手机截图（实际渲染 540x960，2 倍图）
└── AppxManifest.template.xml    微软商店打包清单模板
```

## 各渠道要哪些

| 素材 | Microsoft Store | Google Play | itch.io |
| --- | --- | --- | --- |
| icon-1024 | ✅ | — | — |
| icon-512 + maskable | ✅ | ✅（512 为主图） | ✅ |
| 1366×768 截图 | ✅（1–10 张） | — | ✅ |
| 手机截图 | — | ✅（至少 2 张） | — |
| 隐私政策 URL | ✅ | ✅ | 建议 |
| 应用描述 | ✅ | ✅ | ✅ |

## 商店文案（可直接复制）

**短描述（80 字内）**

> 哼一段旋律，自动变成可编辑的编曲。多轨、混音、和弦、鼓点、导出 WAV / MIDI——全程在你的设备上处理，不上传。

**详细描述**

> **Sing Your Song** 把"随口哼两句"变成一首完整的编曲。
>
> 1. **哼唱即录入** — 点开始录音，哼一段旋律，自动提取音高并量化成音符。
> 2. **像 DAW 一样编辑** — 多轨钢琴卷帘，拖动能改音高和位置、拖右缘改长度、Alt 拖拽改力度。
> 3. **三种谱面** — 卷帘 / 五线谱 / 简谱，随时切换。
> 4. **14 种音色** — 8 种实时合成 + 6 组真实乐器采样（钢琴、竖琴、尤克里里、陶笛、管风琴、萨克斯）。
> 5. **和弦与鼓点** — 一键推断和弦进行，低音自动跟根音；6 条鼓泳道。
> 6. **混音与导出** — 每轨推子/声像/三段 EQ/混响，导出 WAV 或标准 MIDI。
>
> **隐私**：没有账号，没有服务器，录音不会离开你的设备。断网也能用。
>
> **授权**：合成音色无版权问题；钢琴采样为 CC-BY 3.0（Salamander），其余采样为 CC0。

**关键词**：哼唱, 编曲, 作曲, 音高提取, MIDI, 音乐制作, hum to song

## 隐私政策 URL

```
https://zhu159666.github.io/Sing-Your-Song/privacy.html
```

## Microsoft Store

1. 注册 [Partner Center](https://partner.microsoft.com/)（个人 $19 一次性）
2. **记下发布者名称**（形如 `CN=ABC1234-DEF5-...`）
3. 用发布者名重新生成签名证书：
   ```powershell
   cd D:\VN-Studio-0.1.0-x64\signing
   powershell -File new-windows-cert.ps1 -Publisher "CN=<发布者名>"
   ```
4. 用 [PWABuilder](https://www.pwabuilder.com/) 打包：填入站点 URL，
   把 `AppxManifest.template.xml` 里的占位符换成实际值（或直接用 PWABuilder 生成的）
5. 给 MSIX 签名：
   ```powershell
   powershell -File ..\signing\sign-windows.ps1 -Target "输出\SingYourSong.msix"
   ```
6. 上传 → 商店会用微软证书重签 → 审核

## Google Play

见 `android/README.md`。要点：

- 上传密钥已生成在 `signing/singyoursong-upload.jks`
- **必须开启 Play App Signing**
- 手机截图至少 2 张（当前只有 1 张，建议再截：录音中、导出成功）
