# itch.io 页面文案（英文）

直接复制到 itch.io 的对应字段里。

---

## Title

```
Sing Your Song — Hum Arranger
```

## Short description / tagline（itch 会显示在卡片上，≤ 120 字符）

```
Hum a melody. Get an arrangement you can edit, mix and export. Runs entirely on your machine.
```

## Classification

- **Kind of project**: `Downloadable`
- **Release status**: `Released`
- **Pricing**: `$0 or donate`（建议价 `$6`）
- **Platforms**: `Windows`

## Tags（最多 10 个，按流量优先级）

```
music, audio, tool, game-development, visual-novel, chiptune, composition, sound
```

> `visual-novel` 和 `game-development` 是重点——那里才是会付费的受众。

---

## Description（粘贴到 Description 框，支持 HTML）

```html
<p><strong>Hum two bars. Get a song you can actually finish.</strong></p>

<p>Sing Your Song turns a hummed melody into a full arrangement — no keyboard skills, no DAW knowledge required.</p>

<h3>What it does</h3>
<ul>
  <li><strong>Hum it in.</strong> Hit Record, hum a tune, hit Stop. Pitch is extracted and quantised automatically.</li>
  <li><strong>Edit like a DAW.</strong> Drag notes to move, drag the right edge to resize, Alt+drag to change velocity. Multi-track piano roll.</li>
  <li><strong>Three notations.</strong> Piano roll, staff, or jianpu (numbered notation) — switch anytime.</li>
  <li><strong>14 timbres.</strong> 8 synthesised + 6 real instrument sample sets (piano, harp, ukulele, ocarina, pipe organ, tenor sax).</li>
  <li><strong>Chords &amp; drums.</strong> One click infers a chord progression; bass follows the roots. Six drum lanes.</li>
  <li><strong>Mix &amp; export.</strong> Per-track fader, pan, 3-band EQ and reverb send. Export WAV or standard MIDI.</li>
</ul>

<h3>Why it exists</h3>
<p>I build visual novels. Every project needs background music, and hiring a composer for a 30-second loop is overkill. So I made a tool that takes the one thing most people <em>can</em> do — hum — and turns it into something editable.</p>

<p>If you make games, trailers, jam entries or streams, the WAV and MIDI exports drop straight into your pipeline.</p>

<h3>Privacy</h3>
<p>No account. No server. Your recording never leaves your device. Works offline once loaded.</p>
<p><a href="https://zhu159666.github.io/Sing-Your-Song/privacy.html">Full privacy policy</a></p>

<h3>Windows notes</h3>
<ul>
  <li><strong>Unzip, then run <code>Sing Your Song.exe</code>.</strong></li>
  <li>First launch may show <em>“Windows protected your PC”</em> — click <strong>More info → Run anyway</strong>. The app is unsigned (a commercial code-signing certificate costs more than this project earns so far). SHA-256 below lets you verify the file.</li>
  <li>Microphone access: click Record once and allow it. If nothing is captured, check <em>Settings → Privacy → Microphone → Allow desktop apps</em>.</li>
</ul>

<h3>Requirements</h3>
<ul>
  <li>Windows 10/11, 64-bit</li>
  <li>~250 MB disk space after unzip</li>
  <li>A microphone (or import an audio file instead)</li>
</ul>

<h3>Also available in your browser</h3>
<p>Free web version, no install: <a href="https://zhu159666.github.io/Sing-Your-Song/">zhu159666.github.io/Sing-Your-Song</a></p>

<h3>Credits</h3>
<ul>
  <li>Salamander Grand Piano — Alexander Holm (CC-BY 3.0)</li>
  <li>Ukulele, harp, ocarina, pipe organ, tenor sax — FreePats / VCSL (CC0)</li>
  <li>Audio engine — Tone.js (MIT)</li>
  <li>Pitch detection — Basic Pitch (Apache-2.0), with built-in YIN fallback</li>
</ul>

<p>Music you create is yours, including commercial use.</p>
```

---

## 上传文件

```
SingYourSong-1.0.0-win-x64.zip   (103 MB)
```

- ✅ Platform: Windows
- ❌ “This file will be played in the browser”：**不勾**
- 上传后在 Settings 里把 **“This file is for Windows”** 确认一下

## 校验值（贴到描述末尾或单独一条 Devlog）

```
SHA-256:
f113b3d157382c451fa6eaf3f0dcb56d4af7a6cd2085d9770089ac2ee4b9a548
```

安装包里也有 `SingYourSong-1.0.0-win-x64.zip` 同级的 `SHA256SUMS.txt`。

---

## 封面图与截图

| 位置 | 用哪张 |
| --- | --- |
| Cover image | `store/icons/icon-1024.png`（itch 会裁成 630×500，建议另做一张横幅） |
| Screenshots | `store/screenshots/01-main-1366x768.png`、`02-timbres`、`03-staff`、`04-phone` |

> itch 的 cover 建议 630×500。现在的正方形图标会被裁切，最好用界面截图 + 标题文字合成一张横幅——要我生成吗？

---

## 发布后第一周做什么

1. 在 itch 的 **Devlog** 里发一条「怎么做出来的」——itch 的 Devlog 有真实曝光
2. 把链接发到 r/gamedev、r/visualnovels、r/MusicProduction（注意各版规矩）
3. 在 B 站/小红书发 30 秒演示（中文受众），文案里放网页版链接
4. 回复每一条评论——itch 的算法看互动

---

## 中文版页面（可选，同一项目加个语言切换）

如果以后要面向国内，可以再建一个 project，用 `store/README.md` 里的中文文案。
