# 提示词攻击防御系统 Demo

## 📋 项目简介

这是一个纯前端实现的提示词攻击防御机制演示系统，无需后端支持，可直接在浏览器中运行。系统通过基于规则的检测引擎，实时识别和拦截针对AI系统的各类提示词攻击。

### ✨ 核心特性

- 🛡️ **多类型攻击检测**：支持指令注入、角色冒充、分隔符攻击、编码绕过、信息提取、越狱攻击等6大类攻击模式
- 🎯 **实时风险评分**：动态计算输入内容的风险等级（0-100分），直观展示威胁程度
- 📊 **可视化展示**：使用Chart.js呈现风险评分仪表盘，清晰展示防御效果
- 💡 **智能建议**：根据检测结果提供针对性的防御建议
- 🌓 **深色模式**：支持浅色/深色主题切换，保护视力
- 📱 **响应式设计**：完美适配桌面端和移动端设备
- 🚀 **零依赖部署**：纯静态文件，可直接用浏览器打开

## 📁 项目结构

```
prompt-attack/
├── index.html          # 主页面（包含完整UI结构）
├── defense-engine.js   # 防御检测核心引擎
├── app.js             # 应用主逻辑（UI交互）
├── examples.js        # 攻击示例数据库
├── styles.css         # 自定义样式
└── README.md          # 项目说明文档
```

## 🚀 快速开始

### 方式一：本地直接打开

1. 下载或克隆本项目
2. 直接双击 `index.html` 文件
3. 浏览器会自动打开应用

### 方式二：使用本地服务器（推荐）

```bash
# 使用Python启动简单HTTP服务器
python -m http.server 8000

# 或使用Node.js的http-server
npx http-server -p 8000

# 然后在浏览器访问
# http://localhost:8000
```

### 方式三：使用Live Server（VS Code）

1. 安装 Live Server 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 📖 使用说明

### 基础操作

1. **选择攻击类型**
   - 点击左侧的攻击类型按钮（指令注入、角色冒充、分隔符攻击）
   - 系统会自动加载该类型的示例

2. **测试攻击检测**
   - 在文本输入框中输入或选择示例内容
   - 系统会在500ms后自动进行检测（防抖优化）
   - 右侧实时显示检测结果

3. **查看检测结果**
   - **风险评分**：0-100分的威胁评分
   - **风险等级**：安全/低风险/中风险/高风险/严重威胁
   - **匹配模式**：显示触发的具体攻击规则
   - **防御建议**：提供针对性的防御措施

4. **一键测试**
   - 点击右上角"一键测试所有攻击"按钮
   - 系统会自动循环测试各类攻击示例

### 高级功能

#### 主题切换
- 点击右上角的太阳/月亮图标切换深色/浅色模式
- 系统会记住你的偏好设置

#### 统计信息
- 页面底部显示实时统计数据：
  - 总检测次数
  - 拦截攻击数
  - 安全请求数
  - 拦截率

## 🔧 技术实现

### 核心架构

```
用户输入 → 防抖处理 → 防御引擎检测 → 结果展示 → 统计更新
```

### 防御引擎工作原理

```javascript
// 1. 规则匹配
for (const rule of rules) {
    for (const pattern of rule.patterns) {
        const matches = inputText.match(pattern);
        if (matches) {
            riskScore += rule.weight;
        }
    }
}

// 2. 风险评分
riskScore = Math.min(100, totalScore);

// 3. 等级判定
if (riskScore >= 70) level = 'critical';
else if (riskScore >= 50) level = 'high';
else if (riskScore >= 30) level = 'medium';
else if (riskScore > 0) level = 'low';
else level = 'safe';
```

### 检测规则配置

系统内置6大类防御规则：

| 规则ID | 规则名称 | 权重 | 说明 |
|--------|---------|------|------|
| injection | 指令注入检测 | 35 | 检测尝试覆盖原始指令的攻击 |
| roleplay | 角色冒充检测 | 35 | 检测伪装特殊角色的攻击 |
| delimiter | 分隔符攻击检测 | 30 | 检测伪造系统标签的攻击 |
| encoding | 编码绕过检测 | 25 | 检测编码混淆的攻击 |
| extraction | 信息提取检测 | 25 | 检测尝试提取系统信息的攻击 |
| jailbreak | 越狱攻击检测 | 40 | 检测常见越狱模式 |

### 关键技术点

#### 1. 防抖机制
```javascript
let debounceTimer;
function debounceDetection(text) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        performDetection(text);
    }, 500);
}
```

#### 2. 正则表达式匹配
```javascript
const patterns = [
    /忽略(之前|以前|上面|前面).*?指令/gi,
    /无视(之前|以前|上面|前面).*?(指令|规则)/gi,
    // ... 更多模式
];
```

#### 3. 高亮显示
```javascript
generateHighlightedText(text, matches) {
    // 标记匹配的危险文本
    // 使用不同颜色区分攻击类型
}
```

## 🎨 攻击示例说明

### 指令注入攻击（5个示例）
- 基础指令覆盖
- 英文指令注入
- 复杂指令替换
- 分段式注入
- 伪装成系统更新

### 角色冒充攻击（5个示例）
- 管理员权限冒充
- DAN越狱模式
- 开发者调试模式
- 授权用户声称
- 角色切换攻击

### 分隔符攻击（5个示例）
- 系统标签伪造
- 代码块包装
- 多层嵌套标签
- HTML注释注入
- 特殊符号分隔

### 安全输入示例（5个示例）
用于对比测试，验证系统不会误报正常内容。

## 🛠️ 自定义扩展

### 添加新的检测规则

在 `defense-engine.js` 中的 `initializeRules()` 方法添加：

```javascript
{
    id: 'custom-rule',
    name: '自定义规则',
    description: '检测特定类型的攻击',
    enabled: true,
    weight: 30,
    patterns: [
        /你的正则表达式/gi,
        /另一个模式/gi
    ],
    keywords: ['关键词1', '关键词2']
}
```

### 添加新的攻击示例

在 `examples.js` 中添加：

```javascript
attackExamples.yourType = [
    {
        id: 'your-type-1',
        title: '示例标题',
        text: '示例内容',
        description: '示例描述'
    }
];
```

### 修改风险评分阈值

在 `defense-engine.js` 的 `detectPromptAttack()` 方法中修改：

```javascript
if (riskScore >= 70) riskLevel = 'critical';      // 严重
else if (riskScore >= 50) riskLevel = 'high';     // 高危
else if (riskScore >= 30) riskLevel = 'medium';   // 中危
else if (riskScore > 0) riskLevel = 'low';        // 低危
```

## 📊 性能优化

- ✅ 输入防抖（500ms）减少不必要的检测
- ✅ Chart.js 无动画更新提升响应速度
- ✅ 事件委托减少事件监听器数量
- ✅ 合理的DOM更新策略避免重排
- ✅ 懒加载示例内容

## 🌐 浏览器兼容性

| 浏览器 | 版本要求 | 备注 |
|--------|---------|------|
| Chrome | ≥ 90 | 推荐使用 |
| Firefox | ≥ 88 | 完全支持 |
| Safari | ≥ 14 | 完全支持 |
| Edge | ≥ 90 | 完全支持 |

## 🔒 安全说明

**重要提示：** 本项目仅用于演示和教育目的。

- ⚠️ 这是一个前端演示系统，不应直接用于生产环境
- ⚠️ 真实的防御系统需要在后端实现，避免被绕过
- ⚠️ 建议结合多层防御策略（输入验证、输出过滤、权限控制等）
- ⚠️ 攻击者可能使用更复杂的混淆和编码技术绕过规则检测

## 📝 开发计划

- [ ] 添加更多攻击模式检测（如提示词泄露、上下文污染）
- [ ] 支持自定义规则导入/导出
- [ ] 添加机器学习模型检测
- [ ] 提供API接口供第三方集成
- [ ] 添加检测历史记录功能
- [ ] 支持批量测试和报告生成

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。

## 👥 作者

AI防御系统研究团队

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 现代化CSS框架
- [Chart.js](https://www.chartjs.org/) - 数据可视化库
- [MDN Web Docs](https://developer.mozilla.org/) - 技术文档参考

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 📧 Email: support@example.com
- 💬 Issue: 在GitHub上提交Issue
- 🌐 Website: https://example.com

---

**⚡ 提示：** 打开 `index.html` 即可开始使用！

**🎓 学习建议：** 
1. 先了解各类攻击类型的原理
2. 尝试修改示例文本观察检测效果
3. 查看浏览器控制台了解检测详情
4. 尝试自定义规则和示例

**🔍 调试技巧：**
- 打开浏览器开发者工具（F12）
- 查看Console标签页的检测结果日志
- 使用Network标签检查资源加载
- 修改代码后刷新页面查看效果

祝使用愉快！🎉

