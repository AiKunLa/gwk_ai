# package 进行项目功能迁移


所谓的Package项目迁移，核心在于将原本散落在项目各处、强依赖特定路径和全局状态的零散代码，通过“依赖注入”重构为独立且边界清晰的软件包。
它彻底改变了“复制粘贴+挨个改路径”的原始搬运模式，取而代之的是利用`npm link`或Workspace进行本地化调试的“即插即用”模式——旧项目只需提供功能实现，新项目则通过传入配置、回调或Props来适配自身环境。这套机制将混乱的代码耦合转化为清晰的协议对接，让迁移从痛苦的“文件搬运”变成优雅的“插件安装”，从此告别牵一发而动全身的困境。


既然你说“依赖文件很乱”，大概率最头疼的就是那个到处被引用的 **`utils` 工具函数文件夹**（比如时间格式化、加密、校验等）。

我们就拿它开刀，把它打成第一个包。这套流程我称为 **“外科手术式打包法”**，保证你花 1 小时做完，以后项目B、项目C都能直接用。

---

### 场景代入：你要搬走的是 `utils/request.js`（网络请求）

在项目A里，这个文件可能是“万恶之源”，因为它引用了项目A的 **全局状态（store）** 和 **错误提示框（Message）**：

```javascript
// 项目A 原来的 request.js (极度混乱)
import axios from 'axios';
import { useUserStore } from '@/stores/user'; // 强依赖项目A的状态
import { ElMessage } from 'element-plus'; // 强依赖项目A的UI库

// 直接写死了项目A的后台地址
const baseURL = 'https://api.project-a.com'; 

// 拦截器里直接调用了项目A特有的弹窗报错
axios.interceptors.response.use(null, (error) => {
  ElMessage.error(error.message); 
});
```

如果直接复制这个文件到项目B，B项目没有 `@/stores/user` 和 `ElMessage`，直接原地爆炸。

---

### 第一步：物理隔离（新建一个空包）

在你的电脑任意位置（不要在项目A里），新建一个文件夹，比如叫 `@utils-pkg`。

```bash
mkdir my-request-pkg
cd my-request-pkg
npm init -y
```

这时候生成了一个 `package.json`，改一下名字，比如：

```json
{
  "name": "@my/request",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module"
}
```

---

### 第二步：手术式清除（砍掉“手”）

把项目A的 `request.js` 复制到这个新文件夹里，然后**开始删代码**：

1. **删掉写死的 `baseURL`**。
2. **删掉 `import { useUserStore }`**（这个不该工具包管）。
3. **删掉 `import { ElMessage }`**（UI报错不该写死在网络层里）。

删完之后，原本的代码变成了一个“光杆司令”。接下来，我们要给它开两个“外接插口”（依赖注入）。

**改造后的新包代码 `index.js`：**

```javascript
import axios from 'axios';

// 1. 把写死的 URL 改成“可配置的”，由外部传入
export const createRequest = (config) => {
  const instance = axios.create({
    baseURL: config.baseURL, // 现在由项目B传入
    timeout: 10000,
  });

  // 2. 拦截器里的“弹窗报错”和“token获取”，全部改成调用外部传入的回调函数
  instance.interceptors.request.use((req) => {
    // 不再写死 useUserStore，而是调用外部传进来的 getToken 方法
    const token = config.getToken ? config.getToken() : null;
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  });

  instance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      // 不再写死 ElMessage，而是调用外部传进来的 onError 方法
      if (config.onError) {
        config.onError(error.response?.status, error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
```

**你会发现**：这个包里现在 **没有任何 `@/` 路径**，也没有引用任何 UI 框架，干干净净。

---

### 第三步：把“依赖”写进说明书（package.json）

刚才代码里用了 `axios`，但项目B可能已经有 `axios` 了，为了避免装两遍，我们在 `package.json` 里把它写成“伙伴依赖（peerDependency）”：

```json
{
  "name": "@my/request",
  "version": "1.0.0",
  "main": "index.js",
  "peerDependencies": {
    "axios": "^1.0.0" // 告诉项目B：你只要装了axios，就能用我这个包
  }
}
```

---

### 第四步：如何在混乱的项目B里“试跑”？（不用发布到npm）

你现在不需要注册 npm 账号，直接用 **`npm link`（本地链接）** 模拟包已安装。

1. 在 `my-request-pkg` 文件夹下打开终端，运行：
   ```bash
   npm link
   ```
2. 切换到你的 **项目B** 根目录，运行：
   ```bash
   npm link @my/request
   ```

这时候，项目B的 `node_modules` 里就会出现一个叫 `@my/request` 的快捷方式，指向你刚才写的文件夹。**你在包文件夹里改代码，项目B立刻生效，不用反复复制粘贴！**

---

### 第五步：项目B怎么用这个干净的包？

项目B不需要关心项目A的 store 和 UI 怎么写的，它只需要**适配**这个包：

```javascript
// 在项目B的 main.js 或某个初始化文件里

// 1. 项目B用自己的 UI 库（比如 Ant Design 的 message）
import { message } from 'antd'; 
// 2. 项目B用自己的状态管理（比如 Zustand）
import { useStore } from '@/stores/index'; 
// 3. 引入我们刚刚写的包
import { createRequest } from '@my/request';

// 4. 把项目B特有的东西，通过配置传进去！
const request = createRequest({
  baseURL: 'https://api.project-b.com', // 项目B的地址
  getToken: () => useStore.getState().token, // 项目B拿token的方法
  onError: (status, msg) => {
    message.error(`请求出错：${msg}`); // 项目B喜欢用Ant Design弹窗
  }
});

// 导出给项目B的页面使用
export default request;
```

---

### 如果你想把 `utils` 里所有零散函数一起打包（进阶技巧）

如果你的 `utils` 里有一堆 `formatDate`、`validatePhone` 这种纯函数，它们没有任何外部依赖，那更简单。

把它们的文件夹结构改成这样：

```
my-utils-pkg/
├── package.json
├── src/
│   ├── time.js
│   ├── string.js
│   └── validate.js
└── index.js
```

在 `index.js` 里集中导出：

```javascript
export * from './src/time';
export * from './src/string';
export * from './src/validate';
```

在 `package.json` 里开启 **`exports` 字段**（支持按需引入，不会把没用的代码打包进项目B）：

```json
{
  "exports": {
    ".": "./index.js",
    "./time": "./src/time.js",
    "./string": "./src/string.js"
  }
}
```

项目B就可以这么用，省流量且优雅：

```javascript
// 只引入时间函数，不会包含字符串函数的代码
import { formatDate } from '@my/utils/time'; 
```

---

### 给你一颗定心丸

你现在的感觉乱，是因为代码**没有边界**。当你把 `request` 和 `纯函数` 这两个最难缠的钉子户先打成包之后，你会发现：

1. 项目A剩下的代码变轻了。
2. 项目B不再需要复制那一大堆垃圾文件夹了。
3. 后续迁移UI组件（如头像裁剪），思路和这个**完全一样**——把用到的 store 和 API 全部改成 `props` 或 `config` 传进去。

**建议今天先拿 `utils/request.js` 或者 `utils/time.js` 练手**。只要你把这个包在项目B里跑通，发出第一个成功的 API 请求，你就彻底掌握这个方法论了。

如果运行 `npm link` 时报权限错误，或者项目B用的是 Vite 需要额外配置，随时告诉我，我帮你解决报错。💪