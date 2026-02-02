# 启用GitHub Pages - 详细步骤

## 前提条件
- 代码已成功推送到GitHub仓库
- 仓库为Public（公开）

## 步骤1：访问仓库设置
1. 打开浏览器，访问您的GitHub仓库：
   ```
   https://github.com/您的用户名/sunburst-mindmap-editor
   ```

2. 点击顶部菜单的 **Settings**（设置）标签页

## 步骤2：找到Pages设置
1. 在左侧边栏中，找到并点击 **Pages**（页面）
   - 如果看不到Pages选项，请确保：
     - 仓库是Public（公开）
     - 您有管理员权限
     - 等待几分钟让仓库完全初始化

## 步骤3：配置Pages
1. 在 **Source**（源）部分：
   - 选择 **Deploy from a branch**（从分支部署）

2. 在 **Branch**（分支）部分：
   - 选择 **main** 分支
   - 选择 **/ (root)** 根目录

3. 点击 **Save**（保存）按钮

## 步骤4：等待部署
1. 保存后，页面会显示：
   ```
   Your site is ready to be published at https://您的用户名.github.io/sunburst-mindmap-editor/
   ```

2. 等待约1-2分钟，状态会变为：
   ```
   Your site is published at https://您的用户名.github.io/sunburst-mindmap-editor/
   ```
   并显示绿色勾选标记

## 步骤5：验证部署
1. 访问您的网站：
   ```
   https://您的用户名.github.io/sunburst-mindmap-editor/
   ```

2. 应该看到：
   - 完整的应用程序界面
   - 暗金色主题
   - 左侧工具栏
   - 中央图表区域
   - 右侧属性面板

## 故障排除

### 问题1：找不到Pages设置
**解决方案**：
- 确保仓库是Public（公开）
- 刷新页面
- 等待5-10分钟让GitHub完全处理仓库
- 检查仓库是否有index.html文件

### 问题2：部署失败
**解决方案**：
1. 检查Actions标签页：`https://github.com/您的用户名/sunburst-mindmap-editor/actions`
2. 查看部署日志
3. 常见问题：
   - index.html不在根目录
   - 文件路径错误
   - CORS问题

### 问题3：网站显示404
**解决方案**：
- 等待5-10分钟
- 检查URL是否正确
- 确保Pages设置正确
- 清除浏览器缓存

### 问题4：网站显示但功能异常
**解决方案**：
1. 按F12打开开发者工具
2. 查看Console（控制台）错误
3. 常见问题：
   - 模块加载错误：确保使用相对路径
   - CORS错误：GitHub Pages应该支持
   - 资源404：检查文件路径

## 自动检查脚本
运行以下命令检查部署状态：

```bash
# Windows (CMD)
curl -I https://您的用户名.github.io/sunburst-mindmap-editor/

# 或使用浏览器访问
start https://您的用户名.github.io/sunburst-mindmap-editor/
```

## 手动部署检查
1. 检查仓库文件结构：
   - 根目录必须有index.html
   - src/目录包含所有源代码
   - lib/目录包含ECharts等库

2. 检查GitHub Actions状态：
   - 访问：`https://github.com/您的用户名/sunburst-mindmap-editor/actions`
   - 应该看到"pages-build-deployment"工作流成功

## 成功标志
- ✅ GitHub Pages设置显示绿色勾选
- ✅ 网站可访问且功能正常
- ✅ 控制台无错误
- ✅ 所有资源加载成功

## 技术支持
如果遇到问题：
1. 查看GitHub文档：https://docs.github.com/pages
2. 检查项目README.md中的部署说明
3. 确保所有步骤正确执行

## 恭喜！
您的旭日图思维导图编辑器现已成功部署到GitHub Pages，全球用户都可以通过链接访问您的应用！
