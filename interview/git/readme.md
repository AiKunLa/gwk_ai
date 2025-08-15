# git
git 是一个开源的分布式版本管理软件

- 入职后 git clone 克隆项目
    - git config -global user.name ""
        git config -global user.email ""
    - 主分支 main/master
        main是所有人都在用的，线上分支
    - 开一个新分支
        git checkout -b xxx
- 常用命令
    git pull origin main 每天上班前的动作、同步远程代码、命令会从远程仓库（origin）拉取最新的代码并合并到当前分支（main）
    git status 当前git状态
    git log --oneline 查看提交记录
    git add 提交到暂存区
    git commit -m 'interview'  提交到本地仓库
    git push origin main 提交到远程仓库

- 公司会发放一个git 账号，这是一个私有项目
    在开始工作之前创建一个自己的任务分支 git checkout -b
    git branch 检查分支情况
    git checkout -b "" 创建一个新的分支
    git checkout main   切换到主分支上

    在
    git merge "分支名"

## git日常使用
- 场景题目
    
