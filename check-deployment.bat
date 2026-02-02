@echo off
echo ============================================
echo  Sunburst MindMap Editor - 部署验证脚本
echo ============================================
echo.
echo 此脚本将帮助您验证GitHub Pages部署状态。
echo.

set /p github_user="请输入您的GitHub用户名: "
if "%github_user%"=="" (
    echo 错误：用户名不能为空。
    pause
    exit /b 1
)

echo.
echo 步骤1：检查GitHub仓库
echo.
echo 仓库URL：https://github.com/%github_user%/sunburst-mindmap-editor
start "" "https://github.com/%github_user%/sunburst-mindmap-editor"

echo.
echo 步骤2：检查GitHub Pages设置
echo.
echo Pages设置URL：https://github.com/%github_user%/sunburst-mindmap-editor/settings/pages
start "" "https://github.com/%github_user%/sunburst-mindmap-editor/settings/pages"

echo.
echo 步骤3：检查网站可访问性
echo.
set site_url=https://%github_user%.github.io/sunburst-mindmap-editor/
echo 网站URL：%site_url%
start "" "%site_url%"

echo.
echo 步骤4：检查关键文件
echo.
echo 检查index.html是否存在...
curl -s -o nul -w "%%{http_code}" "%site_url%index.html" 2>nul
if %errorlevel% equ 0 (
    echo ✓ index.html可访问
) else (
    echo ✗ index.html不可访问
)

echo.
echo 步骤5：验证应用程序功能
echo.
echo 请手动检查以下功能：
echo 1. 页面是否加载成功？
echo 2. 主题是否为暗金色？
echo 3. 左侧工具栏是否显示？
echo 4. 中央图表区域是否可见？
echo 5. 右侧属性面板是否正常？

echo.
echo 步骤6：检查控制台错误
echo.
echo 按F12打开浏览器开发者工具，检查Console标签页：
echo 1. 是否有红色错误信息？
echo 2. 是否有资源加载失败？
echo 3. 是否有CORS错误？

echo.
echo 部署状态总结：
echo.
echo [ ] 仓库存在且可访问
echo [ ] GitHub Pages已启用
echo [ ] 网站可访问（返回200状态码）
echo [ ] 应用程序界面正常显示
echo [ ] 控制台无错误
echo.
echo 请根据以上检查结果确认部署状态。
echo.
echo 如果所有检查通过，您的部署已成功！
echo 否则，请参考enable-pages.md中的故障排除指南。
echo.

pause
