(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{739:function(t,a,s){"use strict";s.r(a);var e=s(3),i=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("blockquote",[s("p",[t._v("磨刀不误砍柴工")])]),t._v(" "),s("h2",{attrs:{id:"git-流程图"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-流程图"}},[t._v("#")]),t._v(" git 流程图")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/794f50db9b2f40f999ef162172061933~tplv-k3u1fbpfcp-zoom-1.image",alt:""}})]),t._v(" "),s("h2",{attrs:{id:"git-环境配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-环境配置"}},[t._v("#")]),t._v(" git 环境配置")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('git config --global user.email "1006762873@qq.com"\ngit config --global user.name "ljp1126"\n')])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br")])]),s("p",[t._v("由于你的本地Git仓库和GitHub仓库之间的传输是通过SSH加密的，所以我们需要配置验证信息：\n使用以下命令生成SSH Key：")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('ssh-keygen -t rsa -C "1006762873@qq.com"\n')])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("p",[t._v("使用默认的一路回车就行。成功的话会在~/下生成.ssh文件夹，进去，打开 id_rsa.pub，复制里面的 key。\n在github上的选择 SSH and GPG keys，然后点击 New SSH key 按钮,title 设置标题，可以随便填，粘贴在你电脑上生成的 key")]),t._v(" "),s("h2",{attrs:{id:"git-配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-配置"}},[t._v("#")]),t._v(" git 配置")]),t._v(" "),s("ul",[s("li",[t._v("查看本机配置")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git config --list\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("p",[s("img",{attrs:{src:"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e912f7fa4a2645ada6b05a2562d128a7~tplv-k3u1fbpfcp-zoom-1.image",alt:""}})]),t._v(" "),s("ul",[s("li",[t._v("alias 忽然发现的，感觉挺好用")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git commit -m 'feat: home page'\n==>\ngit cm 'feat: home page'\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br")])]),s("ul",[s("li",[t._v("配置用户名")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('git config --global user.name "your name"\n')])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("ul",[s("li",[t._v("配置用户邮箱")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('git config --global user.email "youremail@github.com"\n')])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("h2",{attrs:{id:"git-命令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-命令"}},[t._v("#")]),t._v(" git 命令")]),t._v(" "),s("ul",[s("li",[t._v("推送本地分支到远端")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git push --set-upstream origin 20200921_git_test\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("ul",[s("li",[t._v("删除远端分支")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git push origin -d '20200921_git_test'\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("ul",[s("li",[t._v("重命名分支")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git branch -m <oldbranch-name> <newbranch-name>\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("ul",[s("li",[t._v("存储工作区修改")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git stash save -a 'test: git stash'\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("ul",[s("li",[t._v("恢复工作区修改")])]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git stash apply (stash中还存在该记录)\ngit stash pop (stash中不存在该记录)\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br")])]),s("h2",{attrs:{id:"git-提交规范"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git-提交规范"}},[t._v("#")]),t._v(" git 提交规范")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("git commit -m 'feat: home page'\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br")])]),s("ul",[s("li",[t._v("type: commit 的类型")]),t._v(" "),s("li",[t._v("feat: 新特性")]),t._v(" "),s("li",[t._v("fix: 修改问题")]),t._v(" "),s("li",[t._v("refactor: 代码重构")]),t._v(" "),s("li",[t._v("docs: 文档修改")]),t._v(" "),s("li",[t._v("style: 代码格式修改, 注意不是 css 修改")]),t._v(" "),s("li",[t._v("test: 测试用例修改")]),t._v(" "),s("li",[t._v("chore: 其他修改, 比如构建流程, 依赖管理.")]),t._v(" "),s("li",[t._v("scope: commit 影响的范围, 比如: route, component, utils, build...")]),t._v(" "),s("li",[t._v("subject: commit 的概述, 建议符合  50/72 formatting")]),t._v(" "),s("li",[t._v("body: commit 具体修改内容, 可以分为多行, 建议符合 50/72 formatting")]),t._v(" "),s("li",[t._v("footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.")])]),t._v(" "),s("h3",{attrs:{id:"git命令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git命令"}},[t._v("#")]),t._v(" git命令")]),t._v(" "),s("ul",[s("li",[t._v("切换分支：git checkout name")]),t._v(" "),s("li",[t._v("撤销修改：git checkout -- file")]),t._v(" "),s("li",[t._v("删除文件：git rm file")]),t._v(" "),s("li",[t._v("查看状态：git status")]),t._v(" "),s("li",[t._v("添加记录：git add file 或 git add .")]),t._v(" "),s("li",[t._v('添加描述：git commit -m "miao shu nei rong"')]),t._v(" "),s("li",[t._v("同步数据：git pull")]),t._v(" "),s("li",[t._v("提交数据：git push")]),t._v(" "),s("li",[t._v("分支操作")]),t._v(" "),s("li",[t._v("查看分支：git branch")]),t._v(" "),s("li",[t._v("创建分支：git branch name")]),t._v(" "),s("li",[t._v("切换分支：git checkout name")]),t._v(" "),s("li",[t._v("创建+切换分支：git checkout -b name")]),t._v(" "),s("li",[t._v("合并某分支到当前分支：git merge name")]),t._v(" "),s("li",[t._v("删除分支：git branch -d name")]),t._v(" "),s("li",[t._v("删除远程分支：git push origin :name")])]),t._v(" "),s("h2",{attrs:{id:"git相关问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#git相关问题"}},[t._v("#")]),t._v(" git相关问题")]),t._v(" "),s("ul",[s("li",[t._v("git pull 和 fetch 的区别")])]),t._v(" "),s("p",[t._v("pull=fetch+merge，pull的话，下拉远程分支并与本地分支合并。fetch只是下拉远程分支，怎么合并，可以自己再做选择。")])])}),[],!1,null,null,null);a.default=i.exports}}]);