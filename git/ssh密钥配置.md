# 为什么要配置 git 的 SSH 密钥

如果使用 https 协议，每次提交代码都需要输入用户名和密码，这是不安全的，所以我们需要配置 SSH 密钥。

# 如何配置 SSH 密钥

## widows

### 创建文件夹

- 1.打开 cmd 窗口，在 widows 中创建.ssh 文件夹
  mkdir %USERPROFILE%\.ssh
  2. 进入.ssh 文件夹：
  cd %USERPROFILE%\.ssh
  3. 生成 SSH 密钥：
  ssh-keygen -t ed25519 -C  "你的github邮箱"
  4. 生成的 SSH 密钥文件在.ssh 文件夹中，id_ed25519 是私钥，id_ed25519.pub 是公钥。
  查看 SSH 密钥：
  type id_ed25519.pub
  5. 将公钥复制到 github 中，在 github 中设置 SSH 密钥。
  6. 测试 SSH 密钥：
 



