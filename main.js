// Hum2Song 桌面壳
// 职责：开窗口、起本地静态服务、放行麦克风、接原生文件对话框。
// 业务逻辑全在 index.html，网页版和桌面版共用同一份。
const { app, BrowserWindow, session, dialog, ipcMain, shell, Menu } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { startServer } = require('./server');

// 关硬件加速：部分 Windows 机器（老显卡驱动 / 虚拟机 / 远程桌面）
// 会在 Chromium 初始化阶段直接访问违例崩溃，表现为"双击没反应"。
// 这个应用没有重 GPU 的绘制，关掉换兼容性是划算的。
app.disableHardwareAcceleration();

const SMOKE = process.argv.includes('--smoke');
const LOG_FILE = path.join(os.tmpdir(), 'hum2song-launch.log');

/** 启动日志：双击没反应时，让用户把这个文件发回来就能定位问题 */
function log(msg) {
  const line = new Date().toISOString() + '  ' + msg + '\n';
  try { fs.appendFileSync(LOG_FILE, line); } catch (err) { /* 日志失败不影响运行 */ }
  if (SMOKE) console.log(line.trim());
}

let win = null;
let server = null;

log('=== launch ===');
log('app=' + app.getVersion() + ' electron=' + process.versions.electron + ' node=' + process.versions.node);
log('exe=' + process.execPath);
log('__dirname=' + __dirname);

process.on('uncaughtException', (err) => {
  log('UNCAUGHT ' + (err && err.stack || err));
  try { dialog.showErrorBox('启动失败', String(err && err.message || err) + '\n\n日志：' + LOG_FILE); } catch (e) { /* 忽略 */ }
});
process.on('unhandledRejection', (err) => {
  log('UNHANDLED ' + (err && err.stack || err));
});

function createWindow(url) {
  win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#0a0e14',
    title: 'Hum2Song · 哼唱编曲工作台',
    autoHideMenuBar: true,
    show: !SMOKE,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    log('DID_FAIL_LOAD code=' + code + ' desc=' + desc + ' url=' + url);
    if (!SMOKE) dialog.showErrorBox('页面加载失败', desc + ' (' + code + ')\n\n日志：' + LOG_FILE);
  });

  win.webContents.on('render-process-gone', (_e, details) => {
    log('RENDER_GONE ' + JSON.stringify(details));
  });

  win.webContents.setWindowOpenHandler(({ url: target }) => {
    shell.openExternal(target);
    return { action: 'deny' };
  });

  log('loadURL ' + url);
  win.loadURL(url).catch((err) => log('LOAD_URL_ERR ' + err.message));

  if (SMOKE) {
    win.webContents.once('did-finish-load', async () => {
      log('SMOKE_OK loaded');
      try {
        const img = await win.webContents.capturePage();
        fs.writeFileSync(path.join(os.tmpdir(), 'hum2song-smoke.png'), img.toPNG());
        log('SMOKE_SHOT saved');
      } catch (err) {
        log('SMOKE_SHOT_FAIL ' + err.message);
      }
      setTimeout(() => app.quit(), 500);
    });
    setTimeout(() => { log('SMOKE_TIMEOUT'); app.exit(2); }, 20000);
  }
}

app.whenReady().then(async () => {
  log('whenReady');

  // Electron 默认拒绝麦克风，必须显式放行
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    const allowed = permission === 'media' || permission === 'audioCapture';
    log('permission ' + permission + ' -> ' + allowed);
    callback(allowed);
  });

  try {
    server = await startServer(__dirname);
    log('server ' + server.url);
  } catch (err) {
    log('SERVER_FAIL ' + err.message);
    dialog.showErrorBox('启动失败', '本地服务起不来：' + err.message + '\n\n日志：' + LOG_FILE);
    app.exit(1);
    return;
  }

  ipcMain.handle('project:save', async (_event, text) => {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: '导出工程',
      defaultPath: 'hum2song-project.json',
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (canceled || !filePath) return null;
    fs.writeFileSync(filePath, text, 'utf8');
    return filePath;
  });

  ipcMain.handle('project:open', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      title: '导入工程',
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (canceled || !filePaths || !filePaths.length) return null;
    return fs.readFileSync(filePaths[0], 'utf8');
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: '文件',
      submenu: [
        { label: '导入工程…', accelerator: 'CmdOrCtrl+O', click: () => win && win.webContents.send('menu:import') },
        { label: '导出工程…', accelerator: 'CmdOrCtrl+S', click: () => win && win.webContents.send('menu:export') },
        { type: 'separator' },
        { role: 'quit', label: '退出' },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
      ],
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' },
      ],
    },
  ]));

  createWindow(server.url);
  log('window created');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(server.url);
  });
}).catch((err) => {
  log('WHEN_READY_FAIL ' + (err && err.stack || err));
  try { dialog.showErrorBox('启动失败', String(err && err.message || err) + '\n\n日志：' + LOG_FILE); } catch (e) { /* 忽略 */ }
  app.exit(1);
});

app.on('window-all-closed', async () => {
  if (server) { try { await server.close(); } catch (err) { /* 忽略 */ } }
  if (process.platform !== 'darwin') app.quit();
});
