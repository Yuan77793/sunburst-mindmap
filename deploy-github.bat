@echo off
echo ============================================
echo  Sunburst MindMap Editor - GitHub部署脚本
echo ============================================
echo.
echo 此脚本将帮助您将项目部署到GitHub Pages。
echo 请确保您已经：
echo 1. 拥有GitHub账号
echo 2. 已在GitHub上创建了仓库
echo.
echo 步骤1：检查Git配置
echo.
git --version
if %errorlevel% neq 0 (
    echo 错误：Git未安装。请先安装Git。
    pause
    exit /b 1
)

echo.
echo 步骤2：设置Git用户信息（如果尚未设置）
echo.
set /p git_name="请输入Git用户名（默认为Limoc）: "
if "%git_name%"=="" set git_name=Limoc
set /p git_email="请输入Git邮箱（默认为1325991089@qq.com）: "
if "%git_email%"=="" set git_email=1325991089@qq.com

git config --global user.name "%git_name%"
git config --global user.email "%git_email%"

echo.
echo 步骤3：检查并修复Git URL重写配置
echo.
git config --global --unset url.https://kgithub.com/.insteadof 2>nul
if %errorlevel% equ 0 (
    echo 已修复Git URL重写配置（kgithub.com -> github.com）
)

echo.
echo 步骤4：设置GitHub仓库URL
echo.
echo 请选择GitHub用户名：
echo 1. Limoc（一个c）
echo 2. Limoccc（三个c）
echo 3. 自定义用户名
echo.
set /p choice="请选择（1/2/3）: "

if "%choice%"=="1" (
    set github_user=Limoc
) else if "%choice%"=="2" (
    set github_user=Limoccc
) else (
    set /p github_user="请输入您的GitHub用户名: "
)

set repo_url=https://github.com/%github_user%/sunburst-mindmap-editor.git
echo 使用的仓库URL: %repo_url%

echo.
echo 步骤5：检查仓库是否存在
echo.
git ls-remote %repo_url% 2>nul
if %errorlevel% equ 0 (
    echo 仓库已存在，准备推送代码...
) else (
    echo 仓库不存在或无法访问。
    echo 请在GitHub上创建仓库：https://github.com/new
    echo 仓库名称：sunburst-mindmap-editor
    echo 描述：Sunburst MindMap Editor - 可视化思维导图工具
    echo 选择：Public（公开）
    echo 不要初始化README、.gitignore或license
    echo.
    set /p continue="创建完成后按Enter继续..."
)

echo.
echo 步骤6：添加远程仓库并推送
echo.
cd /d "%~dp0"
git remote remove origin 2>nul
git remote add origin %repo_url%
git branch -M main
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ✓ 代码推送成功！
    echo.
    echo 步骤7：启用GitHub Pages
    echo.
    echo 请访问：https://github.com/%github_user%/sunburst-mindmap-editor/settings/pages
    echo 设置如下：
    echo 1. Source: Deploy from a branch
    echo 2. Branch: main
    echo 3. Folder: / (root)
    echo 4. 点击Save
    echo.
    echo 等待1-2分钟后，您的应用将在以下地址可用：
    echo https://%github_user%.github.io/sunburst-mindmap-editor/
    echo.
    echo 部署完成！
) else (
    echo.
    echo ✗ 推送失败。请检查：
    echo 1. 网络连接
    echo 2. GitHub仓库权限
    echo 3. 仓库是否存在
)

pause
