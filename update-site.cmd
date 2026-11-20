@echo off
chcp 65001 >nul
REM 把 pitch-prototype 里的网页文件同步到 Sing-Your-Song 仓库并推送
REM 用法：双击，或在命令行运行 update-site.cmd "提交说明"

set SRC=%~dp0
set REPO=%~dp0..\Sing-Your-Song
set MSG=%*
if "%MSG%"=="" set MSG=Update site

echo [1/4] 复制文件到仓库...
copy /Y "%SRC%index.html" "%REPO%\index.html" >nul
copy /Y "%SRC%sw.js" "%REPO%\sw.js" >nul
copy /Y "%SRC%manifest.webmanifest" "%REPO%\manifest.webmanifest" >nul
copy /Y "%SRC%README.md" "%REPO%\README.md" >nul
if exist "%SRC%vendor\Tone.js" copy /Y "%SRC%vendor\Tone.js" "%REPO%\vendor\Tone.js" >nul
if exist "%SRC%icons\icon-192.png" copy /Y "%SRC%icons\icon-192.png" "%REPO%\icons\icon-192.png" >nul
if exist "%SRC%icons\icon-512.png" copy /Y "%SRC%icons\icon-512.png" "%REPO%\icons\icon-512.png" >nul

echo [2/4] 提交...
cd /d "%REPO%"
git add -A
git commit -m "%MSG%" 2>nul
if errorlevel 1 echo （没有改动，跳过提交）

echo [3/4] 推送到 main...
git -c http.sslBackend=schannel -c http.schannelCheckRevoke=false -c http.version=HTTP/1.1 -c credential.helper=manager push origin main
if errorlevel 1 goto fail

echo [4/4] 同步 gh-pages（GitHub Pages 的发布分支）...
git -c http.sslBackend=schannel -c http.schannelCheckRevoke=false -c http.version=HTTP/1.1 -c credential.helper=manager push -f origin HEAD:gh-pages
if errorlevel 1 goto fail

echo.
echo 完成。等 30-60 秒后刷新：
echo   https://zhu159666.github.io/Sing-Your-Song/
goto :eof

:fail
echo.
echo 推送失败。常见原因：
echo   1. 凭据过期 —— 重新生成 Personal Access Token
echo   2. 网络代理 —— 已尝试 schannel，如仍失败把报错发我
pause
