@echo off
echo 旭日图思维导图编辑器 - Git初始化脚本
echo =========================================
echo.

REM 检查是否在项目目录中
if not exist "index.html" (
    echo 错误：请在 sunburst-mindmap 目录中运行此脚本
    pause
    exit /b 1
)

REM 获取GitHub仓库URL
set /p GITHUB_URL="请输入GitHub仓库URL（例如：https://github.com/用户名/仓库名.git）："
if "%GITHUB_URL%"=="" (
    echo 错误：必须提供GitHub仓库URL
    pause
    exit /b 1
)

echo.
echo 正在初始化Git仓库...
echo.

REM 初始化Git
git init
if %errorlevel% neq 0 (
    echo 错误：Git初始化失败
    echo 请确保已安装Git：https://git-scm.com/
    pause
    exit /b 1
)

REM 添加所有文件
git add .
if %errorlevel% neq 0 (
    echo 错误：添加文件失败
    pause
    exit /b 1
)

REM 提交更改
git commit -m "初始提交：旭日图思维导图编辑器"
if %errorlevel% neq 0 (
    echo 错误：提交更改失败
    pause
    exit /b 1
)

REM 添加远程仓库
git remote add origin "%GITHUB_URL%"
if %errorlevel% neq 0 (
    echo 错误：添加远程仓库失败
    pause
    exit /b 1
)

REM 重命名分支并推送
git branch -M main
if %errorlevel% neq 0 (
    echo 错误：重命名分支失败
    pause
    exit /b 1
)

echo.
echo 正在推送到GitHub...
echo 这可能需要一些时间，请稍候...
echo.

git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo 错误：推送到GitHub失败
    echo 可能的原因：
    echo 1. GitHub仓库URL不正确
    echo 2. 没有权限推送到该仓库
    echo 3. 网络连接问题
    echo.
    echo 请手动运行以下命令：
    echo   git push -u origin main
    pause
    exit /b 1
)

echo.
echo =========================================
echo 恭喜！项目已成功推送到GitHub！
echo.
echo 下一步：
echo 1. 访问 https://github.com 查看您的仓库
echo 2. 按照 DEPLOY.md 中的说明启用GitHub Pages
echo 3. 等待几分钟后访问您的网站
echo.
echo 您的网站URL将是：
echo   https://您的用户名.github.io/仓库名/
echo =========================================
echo.

pause
