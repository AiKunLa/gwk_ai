# git

开源的分布式版本控制工具

- 代码的安全
- 代码多人协作、共享 pull
- 版本回退
- 分支管理
- github gitee 等仓库中（main）

## repository 仓库

- 仓库
- creat a new repository 新建仓库

git -v 查看版本号
git config --global user.name "AiKunLa" // 配置用户名
git config --global user.eamil "" // 配置邮箱
git init // 初始化仓库
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/AiKunLa/gwk_ai.git
git push -u origin main

/node_modules/ 不提交到仓库中
.gitignore 忽略文件

git status // 查看状态
git diff // 查看修改内容
git log // 查看提交记录
git reset --hard HEAD^ // 回退到上一个版本
git reset --hard 版本号 // 回退到指定版本
git reflog // 查看历史记录
git checkout -- 文件名 // 撤销修改


## gitignore 忽略文件
- 声明那些文件不需要提交到仓库中 如敏感信息 依赖文件 视频等大文件
- eg: node_modules/ 不提交到仓库中  因为太大了



##### 强制推送（仅个人仓库使用）
如果确定要覆盖远程仓库（不推荐多人协作场景）：
```bash
git push -f origin main