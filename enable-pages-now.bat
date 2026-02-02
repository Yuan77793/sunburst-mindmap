@echo off
echo ============================================
echo 启用GitHub Pages - 一键操作脚本
echo ============================================
echo.
echo 步骤1：打开GitHub仓库页面
echo.
start "" "https://github.com/Yuan77793/sunburst-mindmap"

echo.
echo 步骤2：打开GitHub Pages设置页面
echo.
start "" "https://github.com/Yuan77793/sunburst-mindmap/settings/pages"

echo.
echo 步骤3：配置GitHub Pages
echo.
echo 请在打开的页面中：
echo 1. 在"Source"部分，选择"Deploy from a branch"
echo 2. 在"Branch"部分，选择"main"分支
echo 3. 文件夹选择"/ (root)"
echo 4. 点击"Save"按钮
echo.
echo 步骤4：等待部署完成
echo.
echo 保存后，等待约1-2分钟。
echo 页面会显示："Your site is published at..."
echo.
echo 步骤5：访问您的网站
echo.
set site_url=https://yuan77793.github.io/sunburst-mindmap/
echo 您的网站URL：%site_url%
start "" "%site_url%"

echo.
echo 部署完成！
echo 如果遇到问题，请参考 enable-pages.md 文件。
echo.
pause
