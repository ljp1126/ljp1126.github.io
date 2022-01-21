---
title: 常用js库
sidebar: 'auto'
date: 2022-01-21
tags:
 - 方法
categories:
 - 前端
---
> 收集的一些常用js库，项目中要多尝试 🤔🤔🤔

前端需要学习哪些 js 库, 主流框架应该学 vue 还是 react 或者 angular

首先我觉得在学习任何知识之前必须要有一个明确的学习目标, 知道自己为什么要学它, 而不是看网上说的一股脑的给你灌输各种知识, 让你学习各种库, 从而不断的制造大家的焦虑感.

前端由于入行门槛低, 更新换代很快, 每年都会有大量新的框架和库出现, 也有大量库被淘汰(比如 JQuery, 但是学习它的设计思想很有必要). 所以我们大可不必担心, 保持自己的学习步伐, 按需学习即可. 

比如说你对移动端比较感兴趣, 工作中也刚好涉及到一些技术的应用,那么我可以专门研究移动端相关的技术和框架, 又或者你对企业后台/中台产品感兴趣, 比较喜欢开发PC端项目, 那么我们可以专门研究这种类型的js库或者框架, 接下来笔者也是按照不同前端业务的需求, 来整理一份能快速应用到工作中的js库, 以提高大家的开发效率.


## js常用工具类

1. lodash 一个一致性、模块化、高性能的 JavaScript 实用工具库。

2. ramda 一个很重要的库，提供了许多有用的方法，每个 JavaScript 程序员都应该掌握这个工具

3. day.js 一个轻量的处理时间和日期的 JavaScript 库，和 Moment.js 的 API 设计保持完全一样, 体积只有2kb

4. big.js 一个小型，快速的JavaScript库，用于任意精度的十进制算术运算

5. qs 一个 url参数转化 (parse和stringify)的轻量级js库

## dom库

1. JQuery 封装了各种dom/事件操作, 设计思想值得研究借鉴

2. zepto jquery的轻量级版本, 适合移动端操作

3. fastclick 一个简单易用的库，它消除了移动端浏览器上的物理点击和触发一个 click 事件之间的 300ms 的延迟。目的就是在不干扰你目前的逻辑的同时，让你的应用感觉不到延迟，反应更加灵敏。

## 文件处理

1. file-saver 一个在客户端保存文件的解决方案，非常适合在客户端上生成文件的Web应用程序

2. js-xlsx 一个强大的解析和编写excel文件的库

## 网络请求

1. Axios 一个基于 Promise 的 HTTP 库，可用在 Node.js 和浏览器上发起 HTTP 请求，支持所有现代浏览器，甚至包括 IE8+

2. Superagent 基于Ajax的优化, 可以与 Node.js HTTP 客户端搭配使用

3. fly.js 一个基于promise的http请求库, 可以用在node.js, Weex, 微信小程序, 浏览器, React Native中


## 动画库

1. Anime.js 一个JavaScript动画库，可以处理CSS属性，单个CSS转换，SVG或任何DOM属性以及JavaScript对象

2. Velocity 一个高效的 Javascript 动画引擎，与jQuery的 $.animate() 有相同的API, 同时还支持彩色动画、转换、循环、画架、SVG支持和滚动等效果

3. Vivus 一个零依赖的JavaScript动画库，可以让我们用SVG制作动画，使其具有被绘制的外观

4. GreenSock JS 一个JavaScript动画库，用于创建高性能、零依赖、跨浏览器动画，已在超过400万个网站上使用, 并且可以在React、Vue、Angular项目中使用

5. Scroll Reveal 零依赖，为 web 和移动浏览器提供了简单的滚动动画，以动画的方式显示滚动中的内容

6. Kute.js 一个强大高性能且可扩展的原生JavaScript动画引擎，具有跨浏览器动画的基本功能

7. Typed.js 一个轻松实现打字效果的js插件

8. fullPage.js 一个可轻易创建全屏滚动网站的js滚动动画库, 兼容性无可替代

9. iscroll 移动端使用的一款轻量级滚动插件

10. better-scroll 移动端使用的一款轻量级滚动插件

## 鼠标/键盘相关

1. KeyboardJS 一个在浏览器中使用的库（与node.js兼容）.它使开发人员可以轻松设置键绑定和使用组合键来设置复杂的绑定.

2. SortableJS 功能强大的JavaScript 拖拽库

## 图形/图像处理库

1. html2canvas 一个强大的使用js开发的浏览器网页截图工具

2. dom-to-image 一个可以将任意DOM节点转换为用JavaScript编写的矢量（SVG）或光栅（PNG或JPEG）图像的库

3. pica 一个在浏览器中调整图像大小，而不会出现像素失真，处理速度非常快的图片处理库

4. Lena.js 一个轻量级的可以给你图像加各种滤镜的js库

5. Compressor.js 一个使用本地canvas.toBlob API进行图像有损压缩的js库

6. Fabric.js 一个易于使用的基于HTML5 canvas元素的图片编辑器

7. merge-images 一个将多张图片合并成一张图的js插件

8. cropperjs 一款强大的图片裁切库, 支持灵活的图片裁切方式

9. Grade 一个基于图像中的前2种主要颜色生成互补渐变背景的库

以上这些js库不必每一样都去了解和深究, 技术都是为业务服务的, 所以我们按需使用和学习即可. 至于像react或者vue这种框架的相关生态, 这里就不一一介绍了, 官网文档上都有非常详细的生态集, 感兴趣的朋友自行了解即可. 