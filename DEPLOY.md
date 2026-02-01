# GitHub Pages 部署指南

## 概述
本指南将帮助您将旭日图思维导图编辑器部署到GitHub Pages，使任何人都可以通过链接访问您的Web应用。

## 部署步骤

### 步骤1：创建GitHub仓库
1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 输入仓库名称（例如：`sunburst-mindmap-editor`）
4. 选择 "Public"（公开）
5. 不要初始化README、.gitignore或许可证（项目已包含）
6. 点击 "Create repository"

### 步骤2：初始化本地Git仓库
```bash
# 进入项目目录
cd sunburst-mindmap

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交：旭日图思维导图编辑器"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤3：启用GitHub Pages
1. 访问您的GitHub仓库页面
2. 点击 "Settings"（设置）
3. 在左侧菜单选择 "Pages"（页面）
4. 在 "Source"（源）部分：
   - 选择 "Deploy from a branch"（从分支部署）
   - 选择 "main" 分支
   - 选择 "/ (root)" 根目录
5. 点击 "Save"（保存）

### 步骤4：等待部署完成
- GitHub Pages 部署通常需要1-2分钟
- 刷新页面查看状态，当显示 "Your site is published at..." 时表示部署成功
- 访问链接：`https://你的用户名.github.io/仓库名/`

## 自动部署（使用GitHub Actions）
项目已配置自动部署工作流：
- 当推送到 `main` 分支时自动部署
- 部署状态可在仓库的 "Actions" 标签页查看

## 自定义域名（可选）
如需使用自定义域名：
1. 在仓库设置 → Pages → Custom domain
2. 输入您的域名
3. 按照提示配置DNS记录

## 验证部署
部署成功后，访问以下URL测试功能：
1. 主应用：`https://你的用户名.github.io/仓库名/index.html`
2. 启动页面：`https://你的用户名.github.io/仓库名/start.html`

## 故障排除

### 问题1：页面显示404
- 等待几分钟让GitHub Pages完成部署
- 检查仓库设置中的Pages配置
- 确保 `index.html` 文件在根目录

### 问题2：JavaScript模块加载失败
- GitHub Pages通过HTTPS提供服务，不会遇到CORS问题
- 检查浏览器控制台是否有其他错误
- 确保所有文件路径正确（使用相对路径）

### 问题3：样式不显示
- 检查CSS文件路径
- 确保GitHub Pages已正确处理静态文件

### 问题4：ECharts或html2canvas加载失败
- 这些库通过CDN加载，需要网络连接
- 检查控制台网络请求

## 更新部署
要更新已部署的应用：
```bash
# 在项目目录中
git add .
git commit -m "更新描述"
git push origin main
```
推送后，GitHub Actions会自动重新部署。

## 部署后检查清单
- [ ] 主应用可访问
- [ ] 所有JavaScript功能正常工作
- [ ] 样式正确显示
- [ ] 主题切换功能正常
- [ ] 节点操作（添加、编辑、删除）正常
- [ ] 导入/导出功能正常
- [ ] 响应式设计在不同设备上正常

## 技术支持
如果部署遇到问题：
1. 检查GitHub仓库的 "Actions" 标签页查看部署日志
2. 查看浏览器开发者工具控制台错误
3. 确保所有文件已正确提交到仓库

## 示例URL
成功部署后，您的应用将通过以下URL访问：
```
https://你的用户名.github.io/sunburst-mindmap-editor/
```

祝您部署顺利！
