'use strict';

// Sing Your Song · Electron 壳
// 关键点：用自定义安全协议 app:// 加载页面，而不是 file://
// —— file:// 不是安全上下文，getUserMedia（麦克风）会被直接拒绝。

const path = require('node:path');
const fs = require('node:fs');
const { app, BrowserWindow, protocol, session, shell } = require('electron');

// 启动日志：出问题时能知道卡在哪一步（用户也能发给你）
const LOG_FILE = require('node:path').join(require('node:os').tmpdir(), 'singyoursong-launch.log');
function launchLog(message) {
  try {
    require('node:fs').appendFileSync(LOG_FILE, new Date().toISOString() + ' ' + message + '\n');
  } catch (err) { /* 忽略 */ }
}
launchLog('--- start, version=' + (app.getVersion ? app.getVersion() : '?'));

const SCHEME = 'app';
const HOST = 'singyoursong';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: SCHEME,
    privileges: {
      standard: true,
      secure: true,       // ← 有这一条，麦克风才可用
      supportFetchAPI: true,
      stream: true,
      corsEnabled: true,
    },
  },
]);

const webRoot = path.join(__dirname, 'web');

function safeResolve(relative) {
  const abs = path.resolve(webRoot, relative);
  if (!abs.startsWith(webRoot)) return null;
  return abs;
}

function registerProtocol() {
  protocol.handle(SCHEME, async (request) => {
    try {
      const url = new URL(request.url);
      let rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      if (!rel) rel = 'index.html';

      const abs = safeResolve(rel);
      if (!abs) return new Response('forbidden', { status: 403 });
      if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
        return new Response('not found', { status: 404 });
      }

      const data = fs.readFileSync(abs);
      const ext = path.extname(abs).toLowerCase();
      return new Response(data, {
        headers: {
          'Content-Type': MIME[ext] || 'application/octet-stream',
          'Cache-Control': 'no-store',
        },
      });
    } catch (error) {
      console.warn('[protocol]', error.message);
      return new Response('error', { status: 500 });
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 620,
    show: false,
    backgroundColor: '#0a0e14',
    title: 'Sing Your Song',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  win.once('ready-to-show', () => win.show());

  // 外链用系统浏览器打开，不在应用内跳走
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('did-finish-load', () => launchLog('did-finish-load ok'));
  win.webContents.on('did-fail-load', (_e, code, desc) => {
    launchLog('did-fail-load ' + code + ' ' + desc);
    // fallback：自定义协议不可用时退回文件加载（麦克风可能不可用，但至少能看见界面）
    const fallback = require('node:path').join(__dirname, 'web', 'index.html');
    launchLog('fallback to file:// ' + fallback);
    win.loadFile(fallback);
  });
  win.webContents.on('render-process-gone', (_e, d) => launchLog('render-gone ' + JSON.stringify(d)));
  launchLog('window created');
  win.loadURL(`${SCHEME}://${HOST}/index.html`);
  return win;
}

app.whenReady().then(() => {
  launchLog('whenReady');
  // 麦克风 / 音频采集授权：Electron 默认会拒绝，必须显式放行
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowed = new Set(['media', 'audioCapture', 'videoCapture', 'display-capture', 'clipboard-read', 'clipboard-sanitized-write']);
    callback(allowed.has(permission));
  });

  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    return permission === 'media' || permission === 'audioCapture';
  });

  registerProtocol();
  launchLog('protocol registered');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
