# 旭日图思维导图编辑器 - 快速启动指南

## 问题诊断
您遇到的CORS错误是由于现代浏览器的安全策略导致的。当直接从文件系统打开HTML文件时，浏览器会阻止加载本地JavaScript模块。

## 解决方案

### 方案1：使用提供的HTTP服务器（最简单）

#### Windows用户：
1. 双击 `start-server.bat` 文件
2. 等待命令行窗口显示"服务器已启动"
3. 打开浏览器访问：`http://localhost:3000`
4. 点击"启动应用程序"按钮

#### 所有用户（命令行）：
```bash
cd sunburst-mindmap
node server.js
```
然后访问 `http://localhost:3000`

### 方案2：使用Python服务器
```bash
cd sunburst-mindmap
python start-server.py
```
然后访问 `http://localhost:8000`

### 方案3：配置浏览器（仅开发测试）

#### Chrome/Edge浏览器：
1. 关闭所有浏览器窗口
2. 使用以下命令启动浏览器：
   ```bash
   # Windows
   chrome.exe --allow-file-access-from-files --disable-web-security --user-data-dir="C:/Temp/ChromeDev"
   
   # macOS
   open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
   ```
3. 在浏览器中打开 `index.html` 文件

## 验证应用是否正常工作

成功启动后，您应该看到：

1. **暗金色主题界面** - 豪华的黑色和金色设计
2. **左侧工具栏** - 包含添加、编辑、删除等按钮
3. **中央图表区域** - 显示旭日图（初始为空）
4. **右侧属性面板** - 显示节点属性
5. **底部状态栏** - 显示应用状态

## 快速测试功能

1. **点击"创建示例数据"** - 生成一个示例思维导图
2. **点击图表中的节点** - 查看右侧属性面板更新
3. **使用工具栏按钮** - 添加、编辑、删除节点
4. **点击右上角"主题"按钮** - 切换暗金色/亮蓝色主题
5. **右键点击节点** - 显示上下文菜单

## 故障排除

### 服务器无法启动
- 确保Node.js已安装：运行 `node --version`
- 检查端口是否被占用：尝试更改 `server.js` 中的端口号

### 模块加载错误
- 确保所有JavaScript文件都在 `src/` 目录中
- 检查浏览器控制台是否有具体错误信息

### 样式不显示
- 检查CSS文件路径是否正确
- 确保服务器正确设置了Content-Type头

## 项目文件结构

```
sunburst-mindmap/
├── index.html          # 主应用程序
├── start.html          # 启动页面
├── server.js           # Node.js HTTP服务器
├── start-server.bat    # Windows启动脚本
├── start-server.py     # Python服务器脚本
├── package.json        # 项目配置
├── README.md           # 完整文档
└── src/                # 源代码
    ├── core/           # 核心模块
    ├── styles/         # 样式文件
    └── ...
```

## 技术支持

如果问题仍然存在，请：
1. 检查浏览器控制台的具体错误信息
2. 确保所有文件完整无缺失
3. 尝试使用不同的浏览器（Chrome/Firefox/Edge）
4. 使用开发者工具检查网络请求

## 下一步
应用正常运行后，您可以：
- 创建自己的思维导图
- 导入/导出JSON数据
- 导出PNG图片
- 探索所有高级功能

祝您使用愉快！