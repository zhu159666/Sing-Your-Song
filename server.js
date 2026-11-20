// 应用内本地静态服务器：把 index.html / vendor / 图标从 asar 里读出来。
// 为什么不用 file:// 或 app://：
//   - file:// 不是安全上下文，getUserMedia 直接不可用
//   - 自定义协议要处理 MIME、fetch、跨域，容易在打包后悄悄失败
//   - http://127.0.0.1 天然是安全上下文，且和网页版行为一致
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm',
};

/**
 * 起一个只监听 127.0.0.1 的静态服务器。
 * @param {string} rootDir 静态根目录（打包后就是 asar 内部路径）
 * @returns {Promise<{url: string, port: number, close: () => Promise<void>}>}
 */
function startServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let pathname = '/';
      try {
        pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      } catch (err) {
        res.writeHead(400).end('bad request');
        return;
      }

      const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const target = path.join(rootDir, rel);

      // 目录穿越保护
      if (!target.startsWith(rootDir)) {
        res.writeHead(403).end('forbidden');
        return;
      }

      fs.readFile(target, (err, data) => {
        if (err) {
          res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found: ' + rel);
          return;
        }
        res.writeHead(200, {
          'content-type': MIME[path.extname(target).toLowerCase()] || 'application/octet-stream',
          'cache-control': 'no-store',
        });
        res.end(data);
      });
    });

    server.on('error', reject);

    // 端口 0 = 让系统分配一个空闲端口，避免和别的软件撞车
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        url: 'http://127.0.0.1:' + port + '/index.html',
        port,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}

module.exports = { startServer };

// 允许单独测试：node server.js --selftest
if (require.main === module && process.argv.includes('--selftest')) {
  startServer(__dirname)
    .then(async (s) => {
      const res = await fetch(s.url);
      const text = await res.text();
      console.log('SELFTEST status=' + res.status, 'bytes=' + text.length,
        'hasTitle=' + /哼唱编曲工作台/.test(text));
      await s.close();
      process.exit(res.status === 200 && text.length > 1000 ? 0 : 1);
    })
    .catch((err) => {
      console.error('SELFTEST_FAIL', err && err.message);
      process.exit(1);
    });
}
