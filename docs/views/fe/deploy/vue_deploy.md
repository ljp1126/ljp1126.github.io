---
title: VuePress + Travis CI + Github Pages搭建个人博客
date: 2020-04-24
tags:
 - 持续集成
categories:
 - 持续集成
sidebar: false
---

::: tip
* vuepress 简洁易用
* Github Pages配合github好管理
* travis-ci足够自动化
:::


# 创建github工程
### 创建一个 username.github.io  的仓库，username是你github的名称

使用mater分支当做build后静态资源存放的分支，代码分支放到别处去。
参考[拯救懒癌文档君 - VuePress + Travis CI + Github Pages 自动线上生成文档](https://juejin.im/post/5d0715f6f265da1ba56b1e01)

# 根据vuepress-theme-reco创建出vuepress工程（qiuzhongrun老哥的教程）
1. 下载空github工程
``` sh

# 进入工程
cd blog
```
2. 初始化vuepress工程
在主题的[Github地址](https://github.com/vuepress-reco/vuepress-theme-reco)有很清晰的初始化方式，下面贴出我的。
``` sh
# 添加theme-cli工具
yarn global add @vuepress-reco/theme-cli

# 请注意这里的 . 意思是当前blog目录下
theme-cli init .

# install 
yarn install

# run
yarn dev

# build
yarn build
```
在theme-cli工具init一个工程的时候，会让你选style，我选了afternoon-grocery，会带来很多已存在的文章，但是也给了很多我参考，后续删除即可。
``` sh
? What's the title of your project? blog
? What's the description of your project? 个人博客
? What's the author's name? Qiu Zhongrun
? What style do you want your home page to be?(Select afternoon-grocery, if you want to download alexwjj's '午后南杂')
  blog
  doc
❯ afternoon-grocery
```
3. 修正偏差
①添加base
②修改title
③修正dest目标路径为docs/.vuepress/dist
``` javascript
module.exports = {
  base: '/blog/', # ①添加base, 为了后面访问的时候有上下文，没有这玩意儿，如果博客地址非一级目录，在这里配置二级目录
  title: "欢迎你，这是我的博客！",
  description: 'Enjoy when you can, and endure when you must.',
  dest: 'docs/.vuepress/dist', # ③修正dest目标路径为docs/.vuepress/dist，这个必须和稍后的自动部署的local_dir保持一致
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig,
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/medium-zoom', 'flowchart'] 
} 
```
# github page部署及自动化部署

 1. 项目名称为 username.github.io username可以和github名称一样，我的项目和github名称不同，在base配置地址的时候加上二级目录，否则会静态文件404
 2. 配置deploy key，是git ssh
 3. 配置secrets token  token获取 参考（https://blog.csdn.net/u014175572/article/details/55510825）
 4. 配置deploy.yml文件  .github\workflows\deploy.yml 如下为我自己博客项目自动化构建配置，自己项目配置请相应做修改名称
  ``` javascript
    name: Build and Deploy
    on: [push]
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
        - name: Checkout
          uses: actions/checkout@master

        - name: Build and Deploy
          uses: jenkey2011/vuepress-deploy@1.0.1
          env:
            ACCESS_TOKEN: ${{ secrets.TOKEN }}
            TARGET_REPO: ljp1126/ljp1126.github.io
            TARGET_BRANCH: master
            BUILD_SCRIPT: yarn && yarn build
            BUILD_DIR: docs/.vuepress/dist/
  ```

5. 静态文件配置为master，也可重新指定
6. 代码分支为其他分支，这样提交代码就会自动触发actions构建
7. 构建完成，就生成了自己的博客

到此，只要push一次代码，就会触发action自动build，推送到指定分支(master)，然后你就可以访问到了。

# 后记
后续使用的时候，发现一些问题，这里也记录下来以供参考。

### 热部署Hot Reload
没错，vuepress 1.x这个功能是有问题的，在这个[#issue](https://github.com/vuejs/vuepress/issues/1283)里有讲，至今未见关闭。
解决办法也有多人提出多种方案，我采用[pepsifan](https://github.com/pepsifan)提出的nodemon解决方案，亲测有效。
下面是[pepsifan](https://github.com/pepsifan)的方案：
1. 安装nodemon
``` sh
npm i -D nodemon
```
2. 修改package.json，增加命令
``` javascript
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "vuepress dev docs",
    "build": "vuepress build docs",
    "start": "nodemon --ext md,vue --watch .vuepress --watch . --exec vuepress dev docs" # 新增的启动命令
  },
```
3. start启动
``` sh
yarn start
```
这个方案监控了.vue和.md文件的变动，会触发vuepress工程reload，浏览器刷新可见新内容。

## 参考文章

- [拯救懒癌文档君 - VuePress + Travis CI + Github Pages 自动线上生成文档](https://juejin.im/post/6844903869558816781)
- [GitHub Pages自定义域名](https://juejin.im/post/6844903558106578957)
