# 立即部署到GitHub Pages - 完整执行指南

## 请按照以下步骤操作：

### 第1步：创建GitHub仓库
1. 打开浏览器访问：https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `sunburst-mindmap-editor` (或您喜欢的名称)
   - **Description**: `基于ECharts的旭日图思维导图编辑器`
   - 选择 **Public** (公开)
   - **不要** 初始化README、.gitignore或许可证
3. 点击 **Create repository**

### 第2步：获取仓库URL
创建成功后，复制仓库URL，格式为：
```
https://github.com/您的用户名/sunburst-mindmap-editor.git
```

### 第3步：检查并修复Git配置（重要！）
**修复Git URL重写问题**：
如果您之前遇到"kgithub.com"错误，请先执行：
```bash
git config --global --unset url.https://kgithub.com/.insteadof
```

### 第4步：执行部署脚本
**Windows用户**：
1. 双击 `deploy-github.bat`（推荐）或 `init-git.bat`
2. 按照提示操作

**所有用户（命令行）**：
```bash
# 1. 打开命令提示符或终端
# 2. 进入项目目录
cd C:\Users\Limoc\Desktop\sunburst-mindmap

# 3. 执行以下命令（替换YOUR_USERNAME为您的GitHub用户名）
git init
git add .
git commit -m "部署旭日图思维导图编辑器"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sunburst-mindmap-editor.git
git push -u origin main
```

### 第4步：启用GitHub Pages
1. 访问您的仓库：`https://github.com/您的用户名/sunburst-mindmap-editor`
2. 点击 **Settings** (设置)
3. 左侧菜单选择 **Pages** (页面)
4. 在 **Source** (源) 部分：
   - 选择 **Deploy from a branch** (从分支部署)
   - 选择 **main** 分支
   - 选择 **/ (root)** 根目录
5. 点击 **Save** (保存)

### 第5步：等待并访问
1. 等待约1-2分钟让GitHub Pages部署完成
2. 刷新页面，看到绿色提示："Your site is published at..."
3. 访问您的网站：`https://您的用户名.github.io/sunburst-mindmap-editor/`

## 故障排除

### 如果第3步失败：
```bash
# 如果提示需要配置Git用户信息，先执行：
git config --global user.name "您的名字"
git config --global user.email "您的邮箱"

# 然后重试推送
git push -u origin main
```

### 如果第4步找不到Pages设置：
- 确保仓库是Public（公开）
- 等待几分钟后重试
- 可能需要刷新页面

### 如果网站显示404：
- 等待5-10分钟让GitHub完全部署
- 检查仓库根目录是否有index.html文件
- 确保GitHub Pages设置正确

## 验证部署成功

访问以下链接测试：
1. 主应用：`https://您的用户名.github.io/sunburst-mindmap-editor/index.html`
2. 启动页面：`https://您的用户名.github.io/sunburst-mindmap-editor/start.html`

应该看到：
- ✅ 完整的应用程序界面
- ✅ 暗金色主题
- ✅ 左侧工具栏
- ✅ 中央图表区域
- ✅ 右侧属性面板

## 部署完成后的操作

### 更新应用
```bash
# 修改文件后
git add .
git commit -m "更新描述"
git push origin main
# 自动重新部署
```

### 查看部署状态
访问：`https://github.com/您的用户名/sunburst-mindmap-editor/actions`

## 技术支持
如果遇到问题：
1. 检查浏览器控制台错误（F12）
2. 查看GitHub仓库的Actions标签页
3. 确保所有步骤正确执行

## 恭喜！
您的旭日图思维导图编辑器现已部署到GitHub Pages，全球用户都可以通过链接访问您的应用！
