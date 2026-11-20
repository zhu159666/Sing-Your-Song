# 音色来源与授权

本项目的采样音色全部来自**公开授权**的真实乐器录音，不是抓取或破解的商业音源。

## 1. 钢琴（CC-BY 3.0）

- **Salamander Grand Piano** — Alexander Holm
- 授权：[CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/)
- 来源：<https://sfzinstruments.github.io/pianos/salamander/>
- 本项目使用：经由 Tone.js 示例音频镜像 `tonejs.github.io/audio/salamander/` 获取，
  截取 22 个音（A1–C7，每 3 个半音一个），原样保留 mp3
- 使用条件：**必须署名**（本页 + 应用内「问题说明」页底部）

## 2. 尤克里里（CC0 1.0）

- **FreePats Ukulele 1**
- 授权：**CC0 1.0（公有领域）** — 无需署名即可商用
- 来源：<https://freepats.zenvoid.org/GuitarFamily/ukulele.html>
- 本项目使用：13 个音（C4–C6），原 WAV 转成单声道 mp3（共 288KB）
- 保留原包 `LICENSE.txt` 的 CC0 声明于本目录

## 3. 合成音色

其余 8 种（电钢琴、吉他、长笛、电子合成器、弦乐、指弹贝斯、钟琴等）
由 Tone.js 振荡器 + 包络实时合成，**不含任何采样**，无版权问题。

---

## 想再加音色？

FreePats 上有大量 CC0 乐器（竖琴、管风琴、萨克斯、陶笛……），
下载对应 `SFZ+WAV` 包后放进 `samples/<乐器名>/`，再在 `index.html` 的
`SAMPLE_TIMBRES` 里加一条映射即可。
