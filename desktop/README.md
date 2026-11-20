# 桌面版（Electron）· itch.io 发布包

## 产物

```
desktop/out/
├── Sing Your Song/                    解压后可直接运行（双击 exe）
│   ├── Sing Your Song.exe             主程序
│   ├── resources/app/main.js          壳逻辑（自定义 app:// 安全协议）
│   ├── resources/app/web/             网页本体（4.8MB）
│   └── 怎么用.txt                     给用户的说明
├── SingYourSong-1.0.0-win-x64.zip     上传 itch.io 用这个（103MB）
└── SHA256SUMS.txt                     校验值
```

## 关键设计

| 问题 | 处理 |
| --- | --- |
| 麦克风在 `file://` 下不可用 | 注册 `app://` 协议并标记 `secure`，页面走 `app://singyoursong/index.html` |
| Electron 默认拒绝麦克风 | `setPermissionRequestHandler` 放行 `media` / `audioCapture` |
| 页面加载失败时白屏 | `did-fail-load` 时自动回退到 `file://`（麦克风可能失效，但界面可见） |
| 出问题无法排查 | 启动日志写到 `%TEMP%\singyoursong-launch.log` |

## 打包命令

```bash
cd pitch-prototype/desktop
node prepare.cjs          # 复制网页资源 + 拼装 out/Sing Your Song
```

Electron 运行时来自 `node_modules/electron/dist`（33.4.11）。
如果重装依赖后没有 `dist/`，手动下载并解压：

```bash
curl -L -o electron.zip https://github.com/electron/electron/releases/download/v33.4.11/electron-v33.4.11-win32-x64.zip
mkdir -p node_modules/electron/dist && tar -xf electron.zip -C node_modules/electron/dist
echo -n electron.exe > node_modules/electron/path.txt
```

## 上传 itch.io

1. 注册 <https://itch.io>，Create new project
2. **Kind of project** 选 `Downloadable`，价格填 0 或"donation"
3. **Uploads**：把 `SingYourSong-1.0.0-win-x64.zip` 拖进去
   - 勾选 **This file will be played in the browser** = 否
   - Platform 选 **Windows**
4. **Details**：从 `store/README.md` 复制文案
5. 页面里加一段（降低流失）：

   > 首次运行如果 Windows 提示「已保护你的电脑」：
   > 点「更多信息」→「仍要运行」。本程序未购买商业代码签名证书，不影响功能。
   >
   > SHA-256：`<从 SHA256SUMS.txt 复制>`

6. 保存并发布

### 命令行上传（可选，比网页快）

```bash
# 1. 安装 butler（itch.io 官方工具）
#    https://itch.io/docs/butler/installing.html
# 2. 首次登录
butler login
# 3. 上传（把 用户名/游戏名 换成你自己的）
butler push "desktop/out/SingYourSong-1.0.0-win-x64.zip" 用户名/sing-your-song:windows --userversion 1.0.0
```

## 已知限制

- **包体 103MB**：Electron 就是这个量级。想要 5MB 级别得用 Tauri（需要 Rust 工具链，本机没有）
- **未在本机实测启动**：这台机器没有可交互桌面会话，Electron 进程起不来（同样的原因之前 Hum2Song 桌面版也验证不了）。代码层面：协议注册、权限放行、失败回退、启动日志都已就位
- **未签名**：用户首次运行会有 SmartScreen 提示，按上面的文案引导即可

## 如果启动失败怎么排查

1. 看 `%TEMP%\singyoursong-launch.log`，正常应该有：

   ```
   --- start, version=1.0.0
   whenReady
   protocol registered
   window created
   did-finish-load ok
   ```

2. 如果只有 `--- start` 就没了 → 卡在 Chromium 初始化（显卡/远程桌面相关）
   加 `--disable-gpu` 参数再试
3. 如果日志里有 `fallback to file://` → 自定义协议没起来，界面能看见但**麦克风会失效**，把日志发我
