// 把网页文件复制到 desktop/web/，再拼装成可运行的 Electron 目录
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.resolve(__dirname, '..');
const WEB = path.join(__dirname, 'web');
const OUT = path.join(__dirname, 'out');
const APP_NAME = 'Sing Your Song';

// ---------- 1. 复制网页资源 ----------
const INCLUDE = [
  'index.html',
  'privacy.html',
  'manifest.webmanifest',
  'sw.js',
];
const INCLUDE_DIRS = ['vendor', 'samples', 'icons', 'store/icons', 'store/screenshots', 'songs', 'tools'];

function copyFile(rel) {
  const from = path.join(SRC, rel);
  const to = path.join(WEB, rel);
  if (!fs.existsSync(from)) { console.warn('跳过（不存在）:', rel); return; }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(rel) {
  const from = path.join(SRC, rel);
  if (!fs.existsSync(from)) { console.warn('跳过目录（不存在）:', rel); return; }
  fs.cpSync(from, path.join(WEB, rel), { recursive: true });
}

fs.rmSync(WEB, { recursive: true, force: true });
console.log('复制网页资源…');
for (const rel of INCLUDE) copyFile(rel);
for (const rel of INCLUDE_DIRS) copyDir(rel);

// 桌面版里 Service Worker 没意义，去掉注册避免报错
const indexPath = path.join(WEB, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(
  /if \("serviceWorker" in navigator[\s\S]*?\n}\n/,
  '// 桌面版：跳过 Service Worker（app:// 协议下不需要离线缓存）\n'
);
fs.writeFileSync(indexPath, html);
console.log('  已移除桌面版里的 Service Worker 注册');

const webSize = execFileSync('du', ['-sh', WEB]).toString().split('\t')[0];
console.log('  web/ 体积:', webSize);

// ---------- 2. 找到 Electron 运行时 ----------
const electronDist = path.join(__dirname, 'node_modules', 'electron', 'dist');
if (!fs.existsSync(electronDist)) {
  console.error('没找到 Electron 运行时，先在 desktop/ 里执行 npm install');
  process.exit(1);
}

// ---------- 3. 拼装输出目录 ----------
const appDir = path.join(OUT, APP_NAME);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(appDir, { recursive: true });
console.log('拼装应用目录…');
fs.cpSync(electronDist, appDir, { recursive: true });

// 主程序改名
const exeSrc = path.join(appDir, 'electron.exe');
const exeDst = path.join(appDir, APP_NAME + '.exe');
if (fs.existsSync(exeSrc)) fs.renameSync(exeSrc, exeDst);

// 精简：只留中英文语言包，删掉默认 app
const locales = path.join(appDir, 'locales');
if (fs.existsSync(locales)) {
  for (const file of fs.readdirSync(locales)) {
    if (!/^(zh-CN|en-US)\.pak$/.test(file)) fs.rmSync(path.join(locales, file));
  }
}
for (const junk of ['resources/default_app.asar', 'LICENSES.chromium.html']) {
  const p = path.join(appDir, junk);
  if (fs.existsSync(p)) fs.rmSync(p);
}

// 应用本体放进 resources/app（目录形式，方便排查，不用 asar）
const appRes = path.join(appDir, 'resources', 'app');
fs.mkdirSync(appRes, { recursive: true });
fs.copyFileSync(path.join(__dirname, 'main.js'), path.join(appRes, 'main.js'));
fs.copyFileSync(path.join(__dirname, 'package.json'), path.join(appRes, 'package.json'));
fs.cpSync(WEB, path.join(appRes, 'web'), { recursive: true });
fs.writeFileSync(
  path.join(appRes, 'package.json'),
  JSON.stringify({
    name: 'sing-your-song',
    version: '1.0.0',
    main: 'main.js',
    description: 'Sing Your Song 桌面版',
  }, null, 2),
  'utf8'
);

// 说明文件
fs.writeFileSync(
  path.join(appDir, '怎么用.txt'),
  [
    'Sing Your Song · 哼唱编曲工作台',
    '',
    '双击「Sing Your Song.exe」启动。',
    '如果 Windows 提示「已保护你的电脑 / 未知发布者」：',
    '  点「更多信息」→ 点「仍要运行」。',
    '这是因为本程序没有购买商业代码签名证书，不影响功能。',
    '',
    '第一次点「开始录音」时，Windows 会弹出麦克风权限；',
    '如果没有声音，打开 设置 → 隐私和安全性 → 麦克风，',
    '确认「允许桌面应用访问麦克风」是开着的。',
    '',
    '所有录音和工程都保存在本机，不会上传。',
  ].join('\r\n'),
  'utf8'
);

let total = 0;
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) walk(abs);
    else total += stat.size;
  }
})(appDir);

console.log('完成:', appDir);
console.log('  体积:', (total / 1024 / 1024).toFixed(1), 'MB');
