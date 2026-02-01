@echo off
echo 启动旭日图思维导图编辑器服务器...
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js
    echo 请从 https://nodejs.org/ 下载并安装Node.js
    pause
    exit /b 1
)

REM 检查server.js文件是否存在
if not exist "server.js" (
    echo 错误: 未找到server.js文件
    pause
    exit /b 1
)

echo 正在启动HTTP服务器...
echo 服务器将在 http://localhost:3000 运行
echo 按 Ctrl+C 停止服务器
echo.

node server.js

if %errorlevel% neq 0 (
    echo.
    echo 服务器启动失败
    pause
)