# 贡献指南

感谢您对旭日图思维导图编辑器的兴趣！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🎨 设计优化

## 开发环境设置

### 1. 克隆仓库
```bash
git clone https://github.com/yourusername/sunburst-mindmap.git
cd sunburst-mindmap
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 运行测试
```bash
npm test
```

## 开发流程

### 1. 创建分支
从 `main` 分支创建功能分支：
```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/issue-number-description
```

### 2. 编写代码
- 遵循项目代码规范
- 添加必要的测试
- 更新相关文档

### 3. 提交代码
使用规范的提交信息：
```bash
git add .
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复某个问题"
git commit -m "docs: 更新文档"
git commit -m "style: 代码格式调整"
git commit -m "refactor: 代码重构"
git commit -m "test: 添加测试"
git commit -m "chore: 构建过程或辅助工具变动"
```

### 4. 推送分支
```bash
git push origin feature/your-feature-name
```

### 5. 创建Pull Request
在GitHub上创建Pull Request，并确保：
- 描述清楚变更内容
- 关联相关Issue（如果有）
- 通过所有CI检查
- 代码审查通过

## 代码规范

### JavaScript规范
- 使用ES6+语法
- 使用单引号
- 末尾分号
- 2个空格缩进
- 函数和类使用JSDoc注释

### CSS规范
- 使用CSS自定义属性（变量）
- BEM命名约定（可选）
- 按功能模块组织样式
- 响应式设计优先

### 文件命名
- 使用小写字母和连字符
- 描述性名称
- 统一扩展名（.js, .css, .html）

## 测试要求

### 测试覆盖率
- 核心模块：≥80%
- 工具函数：≥90%
- UI组件：≥70%

### 测试类型
1. **单元测试**：测试独立函数和类
2. **集成测试**：测试模块间交互
3. **E2E测试**：测试完整用户流程

## 文档要求

### 代码注释
- 公共API必须使用JSDoc
- 复杂算法需要解释性注释
- TODO和FIXME注释需要关联Issue

### 用户文档
- 更新README.md中的相关部分
- 添加功能使用示例
- 更新CHANGELOG.md

## Issue报告

### Bug报告
请提供以下信息：
1. Bug描述
2. 重现步骤
3. 预期行为
4. 实际行为
5. 环境信息（浏览器、操作系统等）
6. 截图或录屏（如果有）

### 功能建议
请提供以下信息：
1. 功能描述
2. 使用场景
3. 预期效果
4. 可能的实现方案

## 代码审查标准

### 必须满足
- 代码符合项目规范
- 通过所有测试
- 没有引入安全漏洞
- 文档更新完整

### 建议满足
- 代码简洁易读
- 性能考虑充分
- 向后兼容性
- 错误处理完善

## 发布流程

### 版本号规则
遵循[语义化版本](https://semver.org/lang/zh-CN/)：
- **主版本号**：不兼容的API修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

### 发布步骤
1. 更新版本号（package.json）
2. 更新CHANGELOG.md
3. 创建发布分支
4. 运行完整测试套件
5. 构建生产版本
6. 创建GitHub Release
7. 部署到生产环境

## 沟通渠道

- **问题讨论**：GitHub Issues
- **功能规划**：GitHub Discussions
- **实时交流**：Discord/Slack（如有）
- **邮件列表**：待定

## 行为准则

我们遵守[贡献者公约](https://www.contributor-covenant.org/zh-cn/version/2/0/code_of_conduct/)，请确保：
- 使用友好和尊重的语言
- 尊重不同的观点和经验
- 建设性接受批评
- 关注社区整体利益

## 致谢

所有贡献者将被列在项目的贡献者列表中。感谢您的付出！

---

如有任何问题，请随时在Issue中提问或联系维护者。