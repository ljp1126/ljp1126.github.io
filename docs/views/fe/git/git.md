---
title: git学习笔记
sidebar: 'auto'
date: 2020-06-18
tags:
 - git
categories:
 - 工具
---

> 磨刀不误砍柴工

<!-- more -->

## git 流程图
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/794f50db9b2f40f999ef162172061933~tplv-k3u1fbpfcp-zoom-1.image)

## git 环境配置

```
git config --global user.email "1006762873@qq.com"
git config --global user.name "ljp1126"
```


由于你的本地Git仓库和GitHub仓库之间的传输是通过SSH加密的，所以我们需要配置验证信息：
使用以下命令生成SSH Key：

```
ssh-keygen -t rsa -C "1006762873@qq.com"
```


使用默认的一路回车就行。成功的话会在~/下生成.ssh文件夹，进去，打开 id_rsa.pub，复制里面的 key。
在github上的选择 SSH and GPG keys，然后点击 New SSH key 按钮,title 设置标题，可以随便填，粘贴在你电脑上生成的 key

## git 配置
* 查看本机配置

```
git config --list
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e912f7fa4a2645ada6b05a2562d128a7~tplv-k3u1fbpfcp-zoom-1.image)

* alias 忽然发现的，感觉挺好用

```
git commit -m 'feat: home page'
==>
git cm 'feat: home page'
```
* 配置用户名

```
git config --global user.name "your name"
```
* 配置用户邮箱

```
git config --global user.email "youremail@github.com"
```
## git 命令

* 推送本地分支到远端

```
git push --set-upstream origin 20200921_git_test
```
* 删除远端分支

```
git push origin -d '20200921_git_test'
```
* 重命名分支

```
git branch -m <oldbranch-name> <newbranch-name>
```
* 存储工作区修改

```
git stash save -a 'test: git stash'
```
* 恢复工作区修改

```
git stash apply (stash中还存在该记录)
git stash pop (stash中不存在该记录)
```


## git 提交规范

```
git commit -m 'feat: home page'
```

- type: commit 的类型
- feat: 新特性
- fix: 修改问题
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理.
- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述, 建议符合  50/72 formatting
- body: commit 具体修改内容, 可以分为多行, 建议符合 50/72 formatting
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

### git命令
- 切换分支：git checkout name
- 撤销修改：git checkout -- file
- 删除文件：git rm file
- 查看状态：git status
- 添加记录：git add file 或 git add .
- 添加描述：git commit -m "miao shu nei rong"
- 同步数据：git pull
- 提交数据：git push
- 分支操作
- 查看分支：git branch
- 创建分支：git branch name
- 切换分支：git checkout name
- 创建+切换分支：git checkout -b name
- 合并某分支到当前分支：git merge name
- 删除分支：git branch -d name
- 删除远程分支：git push origin :name
## git相关问题

* git pull 和 fetch 的区别

pull=fetch+merge，pull的话，下拉远程分支并与本地分支合并。fetch只是下拉远程分支，怎么合并，可以自己再做选择。