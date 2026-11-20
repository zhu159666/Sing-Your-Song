# 音色来源与授权

本项目的采样音色全部来自**公开授权**的真实乐器录音，不是抓取或破解的商业音源。
合计 6 组、68 个音、3.2MB。

| 音色 | 来源 | 授权 | 音数 | 体积 |
| --- | --- | --- | --- | --- |
| 钢琴·采样 | Salamander Grand Piano（Alexander Holm） | **CC-BY 3.0** | 22 | 1.5MB |
| 尤克里里·采样 | FreePats Ukulele 1 | **CC0 1.0** | 13 | 288KB |
| 竖琴·采样 | VCSL Concert Harp（small） | **CC0 1.0** | 11 | 352KB |
| 陶笛·采样 | FreePats Ocarina 1 | **CC0 1.0** | 7 | 284KB |
| 管风琴·采样 | FreePats Church Organ Emulation | **CC0 1.0** | 6 | 364KB |
| 萨克斯·采样 | FreePats Tenor Saxophone | **CC0 1.0** | 9 | 496KB |

## 授权说明

- **CC0 1.0**（公有领域）：无需署名，可商用。本项目仍在此列出，方便溯源。
- **CC-BY 3.0**（钢琴）：**必须署名**。已写在应用内「问题说明」页底部，以及本文件。
  如果你二次分发本项目，请保留这段署名。

## 处理方式

- 原始格式为 WAV / FLAC（FreePats 与 VCSL 官方包），统一转成**单声道 44.1kHz mp3（q4）**，
  文件名里的 `#` 改写为 `s`（避免 URL 转义问题）。
- 去掉了力度层、释放音、噪声采样（body-tap / chuck 等），只保留按音高命名的单音采样。
- 演奏时由 Tone.js 的 `Tone.Sampler` 在相邻采样之间变调，所以不需要每个半音都录。

## 合成音色

其余 8 种（电钢琴、吉他、长笛、电子合成器、弦乐、指弹贝斯、钟琴等）
由 Tone.js 振荡器 + 包络实时合成，**不含任何采样**。

## 来源链接

- Salamander Grand Piano — <https://sfzinstruments.github.io/pianos/salamander/>
- FreePats（CC0 乐器库）— <https://freepats.zenvoid.org/>
- VCSL（Versilian Community Sample Library）— <https://github.com/sgossner/VCSL>
