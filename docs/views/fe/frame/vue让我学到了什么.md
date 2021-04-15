---
title: vue让我学到了什么
sidebar: 'auto'
date: 2020-11-26
tags:
 - Vue
categories:
 - framework
---

> 知其然知其所以然，方能知己知彼


  框架设计远没有大家想的那么简单，并不是说只把功能开发完成，能用就算完事儿了，这里面还是有很多学问的。比如说，我们的框架应该给用户提供哪些构建产物？产物的模块格式如何？当用户没有以预期的方式使用框架时是否应该打印合适的警告信息从而提升更好的开发体验，让用户快速定位问题？开发版本的构建和生产版本的构建有何区别？热跟新（HMR：Hot Module Replacement）需要框架层面的支持才行，我们是否也应该考虑？再有就是当你的框架提供了多个功能，如果用户只需要其中几个功能，那么用户是否可以选择关闭其他功能从而减少资源的打包体积？所有以上这些问题我们都会在本节内容进行讨论。

  本节内容需要大家对常用的模块打包工具有一定的使用经验，尤其是 rollup.js 以及 webpack。如果你只用过或了解过其中一个也没关系，因为它们很多概念其实是类似的。如果你没有使用任何模块打包工具那么需要你自行去了解一下，至少有了初步认识之后再来看本节内容会更好一些。

## 提升用户的开发体验
  衡量一个框架是否足够优秀的指标之一就是看它的开发体验如何，我们拿 Vue3 举个例子

> createApp(App).mount('#not-exist')
 当我们创建一个 Vue 应用并试图将其挂载到一个不存在的 DOM 节点时就会得到一个警告信息：

![image.png](https://img-blog.csdnimg.cn/20210101122225479.png)

  从这条信息中我们得知挂载失败了，并说明了失败的原因：Vue 根据我们提供的选择器无法找到相应的 DOM 元素（返回 null），正式因为这条信息的存在使得我们能够清晰且快速的了解并定位问题，可以试想一下如果 Vue 内部不做任何处理，那么很可能得到的是一个 JS 层面的错误信息，例如：Uncaught TypeError: Cannot read property 'xxx' of null，但是根据此信息我们很难知道问题出在哪里。

  所以在框架设计和开发的过程中，提供友好的警告信息是至关重要的，如果这一点做得不好那么很可能经常收到用户的抱怨。始终提供友好的警告信息不仅能够快速帮助用户定位问题，节省用户的时间，还能够为框架收获良好的口碑，让用户认为你是非常专业的。

在 Vue 的源码中，你经常能够看到 warn() 函数的调用，例如上面图片中的信息就是由这句 warn() 函数调用打印的：

``` javascript
warn(
  `Failed to mount app: mount target selector "${container}" returned null.`
)
```
对于 warn() 函数来说，由于它需要尽可能的提供有用的信息，因此它需要收集当前发生错误的组件的组件栈信息，所以如果你去看源码你会发现有些复杂，但其实最终就是调用了 console.warn() 函数。

对于开发体验来说，除了提供必要的警告信息，还有很多其他方面可以作为切入口，可以进一步提升用户的开发体验。例如在 Vue3 中当我们在控制台打印一个 Ref 数据时：

``` javascript
const count = ref(0)
console.log(count)
```
打开控制台查看输出，如下图所示：

![image.png](https://img-blog.csdnimg.cn/2021010112345581.png)

没有任何处理的输出

可以发现非常的不直观，当然我们可以直接打印 `count.value` ，这样就只会输出 0，但是有没有办法在打印 `count` 的时候让输出的信息更有好呢？当然可以，浏览允许我们编写自定义的 `formatter`，从而自定义输出的形式。在 Vue 的源码中你可以搜索到名为 `initCustomFormatter` 的函数，这个函数就是用来在开发环境下初始化自定义 `formatter` 的，以 chrome 为例我们可以打开 devtool 的设置，然后勾选 `Console -> Enable custom formatters：`

![image.png](https://img-blog.csdnimg.cn/20210101123748437.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2VsaWppcA==,size_16,color_FFFFFF,t_70)

然后刷新浏览器后查看控制台，会发现输出的内容变得非常直观：

控制框架代码的体积
框架的大小也是衡量框架的标准之一，在实现同样功能的情况下当然是用越少的代码越好，这样体积就会越小，最后浏览器加载资源的时间也就越少。这时我们不禁会想，提供越完善的警告信息就意味着我们要编写更多的代码，这不是与控制代码体积相驳吗？没错，所以我们要想办法解决这个问题。

如果我们去看 Vue 的源码会发现，每一个 warn() 函数的调用都会配合 __DEV__ 常量的检查，例如：

``` javascript
if (__DEV__ && !res) {
  warn(
    `Failed to mount app: mount target selector "${container}" returned null.`
  )
}
```

可以看到，打印警告信息的前提是：__DEV__ 这个常量一定要为真，这里的 __DEV__ 常量就是达到目的的关键。

Vue 使用的是 rollup.js 对项目进行构建的，这里的 __DEV__ 常量实际上是通过 rollup 的配置来预定义的，其功能类似于 webpack 中的 DefinePlugin 插件。

Vue 在输出资源的时候，会输出两个版本的资源，其中一个资源用于开发环境，如 vue.global.js ；另一个与其对应的用于生产环境，如：vue.global.prod.js ，通过文件名称我们也能够区分。

当 Vue 构建用于开发环境的资源时，会把 __DEV__ 常量设置为 true，这时上面那段输出警告信息的代码就等价于：

``` javascript
if (true && !res) {
  warn(
    `Failed to mount app: mount target selector "${container}" returned null.`
  )
}
```
可以看到这里的 `__DEV__` 被替换成了字面量 true ，所以这段代码在开发环境是肯定存在的。

当 Vue 构建用于生产环境的资源时，会把 `__DEV__` 常量设置为 false，这时上面那段输出警告信息的代码就等价于：
``` javascript
if (false && !res) {
  warn(
    `Failed to mount app: mount target selector "${container}" returned null.`
  )
}
```
可以看到 `__DEV__` 常量被替换为字面量 false ，这时我们发现这段分支代码永远都不会执行，因为判断条件始终为假，这段永远不会执行的代码被称为 Dead Code，它不会出现在最终的产物中，在构建资源的时候就会被移除，因此在 vue.global.prod.js 中是不会存在这段代码的。

这样我们就做到了在开发环境为用户提供友好的警告信息的同时，还不会增加生产环境代码的体积。

## 框架要做到良好的 Tree-Shaking

上文中我们提到通过构建工具设置预定义的常量 `__DEV__` ，就能够做到在生产环境使得框架不包含打印警告信息的代码，从而使得框架自身的代码量变少。但是从用户的角度来看，这么做仍然不够，还是拿 Vue 来举个例子，我们知道 Vue 提供了内置的组件例如 `<Transition>` ，如果我们的项目中根本就没有使用到该组件，那么 `<Transition>` 组件的代码需要包含在我们项目最终的构建资源中吗？答案是当然不需要，那如何做到这一点呢？这就不得不提到本节的主角 Tree-Shaking。

那什么是 Tree-Shaking 呢？在前端领域这个概念因 rollup 而普及，简单的说所谓 **Tree-Shaking **指的就是消除哪些永远不会执行的代码，也就是排除 dead-code，现在无论是 rollup 还是 webpack 都支持 Tree-Shaking。

想要实现 Tree-Shaking 必须满足一个条件，即模块必须是 ES Module，因为 Tree-Shaking 依赖 ESM 的静态结构。我们使用 rollup 通过一个简单的例子看看 Tree-Shaking 如何工作，我们 demo 的目录结构如下：

``` javascript
├── demo
│   └── package.json
│   └── input.js
│   └── utils.js
```
首先安装 rollup：

> yarn add rollup -D # 或者 npm install rollup -D

下面是 input.js 和 utils.js 文件的内容：

``` javascript
// input.js
import { foo } from './utils.js'
foo()
```

``` javascript
// utils.js
export function foo(obj) {
  obj && obj.foo
}
export function bar(obj) {
  obj && obj.bar
}
```

代码很简单，我们在 utils.js 文件中定义并导出了两个函数，分别是 foo 和 bar，然后在 input.js 中导入了 foo 函数并执行，注意我们并没有导入 bar 函数。

接着我们执行如下命令使用 rollup 构建：

> npx rollup input.js -f esm -o bundle.js
这句命令的意思是以 input.js 文件问入口，输出 ESM 模块，输出的文件名叫做 bundle.js。命令执行成功后，我们打开 bundle.js 来查看一下它的内容：

``` javascript
// bundle.js
function foo(obj) {
  obj && obj.foo
}
foo();
```

可以看到，其中并不包含 bar 函数，这说明 `Tree-Shaking` 起了作用，由于我们并没有使用 `bar` 函数，因此它作为 `dead-code` 被删除了。但是如果我们仔细观察会发现，`foo` 函数的执行也没啥意义呀，就是读取了对象的值，所以它执行还是不执行也没有本质的区别呀，所以即使把这段代码删了，也对我们的应用没啥影响，那为什么 `rollup` 不把这段代码也作为 `dead-code` 移除呢？

这就涉及到 `Tree-Shaking` 中的第二个关键点，即副作用。如果一个函数调用会产生副作用，那么就不能将其移除。什么是副作用？简单地说副作用的意思是当调用函数的时候，会对外部产生影响，例如修改了全局变量。这时你可能会说，上面的代码明显是读取对象的值怎么会产生副作用呢？其实是有可能的，想想一下如果 obj 对象是一个通过 Proxy 创建的代理对象那么当我们读取对象属性时就会触发 Getter ，在 Getter 中是可能产生副作用的，例如我们在 Getter 中修改了某个全局变量。而到底会不会产生副作用，这个只有代码真正运行的时候才能知道， JS 本身是动态语言，想要静态的分析哪些代码是 dead-code 是一件很有难度的事儿，上面只是举了一个简单的例子。

正因为静态分析 JS 代码很困难，所以诸如 rollup 等这类工具都会给我提供一个机制，让我们有能力明确的告诉 `rollup` ：”放心吧，这段代码不会产生副作用，你可以放心移除它“，那具体怎么做呢？如下代码所示，我们修改 input.js 文件：

``` javascript
import {foo} from './utils'

/*#__PURE__*/ foo()
```

注意这段注释代码 `/*#__PURE_*_/`，该注释的作用就是用来告诉 `rollup` 对于 `foo()` 函数的调用不会产生副作用，你可以放心的对其进行 `Tree-Shaking`，此时再次执行构建命令并查看 bundle.js 文件你会发现它的内容是空的，这说明 `Tree-Shaking` 生效了。

基于这个案例大家应该明白的是，在编写框架的时候我们需要合理的使用 `/*#__PURE_*_/` 注释，如果你去搜索 Vue 的源码会发现它大量的使用了该注释，例如下面这句：

> export const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS)
也许你会觉得这会不会对编写代码带来很大的心智负担？其实不会，这是因为通常产生副作用的代码都是模块内函数的顶级调用，什么是顶级调用呢？如下代码所示：

``` javascript
foo() // 顶级调用

function bar() {
  foo() // 函数内调用
}
```

可以看到对于顶级调用来说是可能产生副作用的，但对于函数内调用来说只要函数 `bar` 没有被调用，那么 `foo` 函数的调用当然不会产生副作用。因此你会发现在 Vue 的源码中，基本都是在一些顶级调用的函数上使用 `/*#__PURE__*/` 注释的。当然该注释不仅仅作用与函数，它可以使用在任何语句上，这个注释也不是只有 `rollup` 才能识别，`webpack` 以及压缩工具如 terser 都能识别它。



## 框架应该输出怎样的构建产物
上文中我们提到 Vue 会为开发环境和生产环境输出不同的包，例如 vue.global.js 用于开发环境，它包含了必要的警告信息，而 vue.global.prod.js 用于生产环境，不包含警告信息。实际上 Vue 的构建产物除了有环境上的区分之外，还会根据使用场景的不同而输出其他形式的产物，这一节我们将讨论这些产物的用途以及在构建阶段如何输出这些产物。

不同类型的产物一定是有对应的需求背景的，因此我们从需求讲起。首先我们希望用户可以直接在 html 页面中使用 `<script> 标签引入框架并使用：`

``` javascript
<body>
  <script src="/path/to/vue.js"></script>
  <script>
  const { createApp } = Vue
  // ...
  </script>
</body>
```
为了能够实现这个需求，我们就需要输出一种叫做 IIFE 格式的资源，IIFE 的全称是 `Immediately Invoked Function Expression` ，即”立即调用的函数表达式“，可以很容易的用 JS 来表达：

``` javascript
(function () {
  // ...
}())
```
如上代码所示，这就是一个立即执行的函数表达式。实际上 vue.globale.js 文件就是 IIFE形式的资源，大家可以看一下它的代码结构：

``` javascript
var Vue = (function(exports){
  // ...
 exports.createApp = createApp;
  // ...
  return exports
}({}))
```

这样当我们使用 `<script> 标签直接引入 vue.global.js 文件后`，那么全局变量 `Vue` 就是可用的了。

在 rollup 中我们可以通过配置 format: 'iife' 来实现输出这种形式的资源：

``` javascript
// rollup.config.js
const config = {
  input: 'input.js',
  output: {
    file: 'output.js',
    format: 'iife' // 指定模块形式
  }
}
```

> export default config

不过随着技术的发展和浏览器的支持，现在主流浏览器对原生 ESM 模块的支持都不错，所以用户除了能够使用 `<script>` 标签引用 `IIFE` 格式的资源外，还可以直接引如 ESM 格式的资源，例如 Vue3 会输出 `vue.esm-browser.js` 文件，用户可以直接用 `<script>` 标签引入：

> `<script type="module" src="/path/to/vue.esm-browser.js"></script>`

为了输出 ESM 格式的资源就需要我们配置 rollup 的输出格式为：format: 'esm'。

你可能已经注意到了，为什么 `vue.esm-browser.js` 文件中会有 `-browser` 字样，其实对于 ESM 格式的资源来说，Vue 还会输出一个 vue.esm-bundler.js 文件，其中 -browser 变成了 -bundler。为什么这么做呢？我们知道无论是 rollup 还是 webpack 在寻找资源时，如果 package.json 中存在 module 字段，那么会优先使用 module 字段指向的资源来代替 main 字段所指向的资源。我们可以打开 Vue 源码中的 packages/vue/package.json 文件看一下：

``` javascript
{
 "main": "index.js",
  "module": "dist/vue.runtime.esm-bundler.js",
}
```

其中 module 字段指向的是 vue.runtime.esm-bundler.js 文件，意思就是说如果你的项目是使用 webpack 构建的，那你使用的 Vue 资源就是 vue.runtime.esm-bundler.js ，也就是说带有 -bundler 字样的 ESM 资源是给 rollup 或 webpack 等打包工具使用的，而带有 -browser字样的 ESM 资源是直接给 `<script type="module">` 去使用的。

那他们之间的区别是什么呢？那这就不得不提到上文中的 `__DEV__` 常量，当构建用于 `<script>` 标签的 ESM 资源时，如果是用于开发环境，那么 `__DEV__` 会设置为 true；如果是用于生产环境，那么 `__DEV__` 常量会被设置为 false ，从而被 Tree-Shaking 移除。但是当我们构建提供给打包工具的 ESM 格式的资源时，我们不能直接把 `__DEV__` 设置为 true 或false，而是使用 `(process.env.NODE_ENV !== 'production')` 替换掉 `__DEV__` 常量。例如下面的源码：

``` javascript
if (__DEV__) {
 warn(`useCssModule() is not supported in the global build.`)
}
```

在带有 -bundler 字样的资源中会变成：

``` javascript
if ((process.env.NODE_ENV !== 'production')) {
  warn(`useCssModule() is not supported in the global build.`)
}
```

这样用户侧的 webpack 配置可以自己决定构建资源的目标环境，但是最终的效果其实是一样的，这段代码也只会出现在开发环境。

用户除了可以直接使用 `<script>` 标签引入资源，我们还希望用户可以在 Node.js 中通过 require 语句引用资源，例如：

``` javascript
const Vue = require('vue')
```

为什么会有这种需求呢？答案是服务端渲染，当服务端渲染时 Vue 的代码是运行在 Node.js环境的，而非浏览器环境，在 Node.js 环境下资源的模块格式应该是 CommonJS ，简称cjs。为了能够输出 cjs 模块的资源，我们可以修改 rollup 的配置：format: 'cjs' 来实现：

``` javascript
// rollup.config.js
const config = {
  input: 'input.js',
  output: {
    file: 'output.js',
    format: 'cjs' // 指定模块形式
  }
}

export default config
```
## 特性开关
在设计框架时，框架会提供诸多特性（或功能）给用户，例如我们提供 A、B、C 三个特性给用户，同时呢我们还提供了 a、b、c 三个对应的特性开关，用户可以通过设置 a、b、c 为true 和 false 来代表开启和关闭，那么将会带来很多收益：

对于用户关闭的特性，我们可以利用 Tree-Shaking 机制让其不包含在最终的资源中。

该机制为框架设计带来了灵活性，可以通过特性开关任意为框架添加新的特性而不用担心用不到这些特性的用户侧资源体积变大，同时当框架升级时，我们也可以通过特性开关来支持遗留的 API，这样新的用户可以选择不适用遗留的 API，从而做到用户侧资源最小化。

那怎么实现特性开关呢？其实很简单，原理和上文提到的 __DEV__ 常量一样，本质是利用 rollup 的预定义常量插件来实现，那一段 Vue3 的 rollup 配置来看：
``` javascript
{
 __FEATURE_OPTIONS_API__: isBundlerESMBuild ? `__VUE_OPTIONS_API__` : true,
}
```

其中 __FEATURE_OPTIONS_API__ 类似于 __DEV__，我们可以在 Vue3 的源码中搜索，可以找到很多类似如下代码这样的判断分支：

``` javascript
// support for 2.x options
if (__FEATURE_OPTIONS_API__) {
  currentInstance = instance
  pauseTracking()
  applyOptions(instance, Component)
  resetTracking()
  currentInstance = null
}
```
当 Vue 构建资源时，如果构建的资源是用于给打包工具使用的话（即带有 -bundler 字样的资源），那么上面代码在资源中会变成：

``` javascript
// support for 2.x options
if (__VUE_OPTIONS_API__) { // 这一这里
  currentInstance = instance
  pauseTracking()
  applyOptions(instance, Component)
  resetTracking()
  currentInstance = null
}
```

其中 __VUE_OPTIONS_API__ 就是一个特性开关，用户侧就可以通过设置__VUE_OPTIONS_API__ 来控制是否包含这段代码。通常用户可以使用 webpack.DefinePlugin插件实现：

``` javascript
// webpack.DefinePlugin 插件配置
new webpack.DefinePlugin({
  __VUE_OPTIONS_API__: JSON.stringify(true) // 开启特性
})
```
最后再来详细解释一下 __VUE_OPTIONS_API__ 开关是干嘛用的，在 Vue2 中我们编写的组件叫做组件选项 API：

``` javascript
export default {
 data() {}, // data 选项
  computed: {}, // computed 选项
 //  其他选项...
}
```
但是在 Vue3 中，更推荐使用 Composition API 来编写代码，例如：

``` javascript
export default {
 setup() {
  const count = ref(0)
    const doubleCount = computed(() => count.value * 2) // 相当于 Vue2 中的 computed 选项
 }
}
```
但是在 Vue3 中，更推荐使用 Composition API 来编写代码，例如：

``` javascript
export default {
 setup() {
  const count = ref(0)
    const doubleCount = computed(() => count.value * 2) // 相当于 Vue2 中的 computed 选项
 }
}
```

但是为了兼容 Vue2，在 Vue3 中仍然可以使用选项 API 的方式编写代码，但是对于明确知道自己不会使用选项 API 的用户来说，它们就可以选择使用 __VUE_OPTIONS_API__ 开关来关闭该特性，这样在打包的时候 Vue 的这部分代码就不会包含在最终的资源中，从而减小资源体积。

## 错误处理
错误处理是开发框架的过程中非常重要的环节，框架的错误处理做的好坏能够直接决定用户应用程序的健壮性，同时还决定了用户开发应用时处理错误的心智负担。

为了让大家对错误处理的重要性有更加直观的感受，我们从一个小例子说起。假设我们开发了一个工具模块，代码如下：

``` javascript
// utils.js
export default {
  foo(fn) {
    fn && fn()
  }
}
```
该模块导出一个对象，其中 foo 属性是一个函数，接收一个回调函数作为参数，调用 foo函数时会执行回调函数，在用户侧使用时：

``` javascript
import utils from 'utils.js'
utils.foo(() => {
  // ...
})
```
大家思考一下如果用户提供的回调函数在执行的时候出错了怎么办？此时有两个办法，其一是让用户自行处理，这需要用户自己去 try...catch：
``` javascript
import utils from 'utils.js'
utils.foo(() => {
  try {
   // ...
  } catch (e) {
   // ...
 }
})
```
但是这对用户来说是增加了负担，试想一下如果 utils.js 不是仅仅提供了一个 foo 函数，而是提供了几十上百个类似的函数，那么用户在使用的时候就需要逐一添加错误处理程序。

第二种办法是我们代替用户统一处理错误，如下代码所示：

``` javascript
// utils.js
export default {
  foo(fn) {
    try {
      fn && fn() 
    } catch(e) {/* ... */}
  },
  bar(fn) {
    try {
      fn && fn() 
    } catch(e) {/* ... */}
  },
}
```

这中办法其实就是我们代替用户编写错误处理程序，实际上我们可以进一步封装错误处理程序为一个函数，假设叫它 callWithErrorHandling：

``` javascript
// utils.js
export default {
  foo(fn) {
    callWithErrorHandling(fn)
  },
  bar(fn) {
    callWithErrorHandling(fn)
  },
}
function callWithErrorHandling(fn) {
  try {
    fn && fn()
  } catch (e) {
    console.log(e)
  }
}
```
可以看到代码变得简洁多了，但简洁不是目的，这么做真正的好处是，我们有机会为用户提供统一的错误处理接口，如下代码所示：

``` javascript
// utils.js
let handleError = null
export default {
  foo(fn) {
    callWithErrorHandling(fn)
  },
  // 用户可以调用该函数注册统一的错误处理函数
  resigterErrorHandler(fn) {
    handleError = fn
  }
}
function callWithErrorHandling(fn) {
  try {
    fn && fn()
  } catch (e) {
    // 捕获到的错误传递给用户的错误处理程序
    handleError(e)
  }
}
```
我们提供了 resigterErrorHandler 函数，用户可以使用它注册错误处理程序，然后在 callWithErrorHandling 函数内部捕获到错误时，把错误对象传递给用户注册的错误处理程序。

这样在用户侧的代码就会非常简洁且健壮：

``` javascript
import utils from 'utils.js'
// 注册错误处理程序
utils.resigterErrorHandler((e) => {
  console.log(e)
})
utils.foo(() => {/*...*/})
utils.bar(() => {/*...*/})
```
这时错误处理的能力完全由用户控制，用户既可以选择忽略错误，也可以调用上报程序将错误上报到监控系统。

实际上这就是 Vue 错误处理的原理，你可以在源码中搜索到 callWithErrorHandling 函数，另外在 Vue 中我们也可以注册统一的错误处理函数：

``` javascript
import App from 'App.vue'
const app = createApp(App)
app.config.errorHandler = () => {
  // 错误处理程序
}
```
## 良好的 Typescript 类型支持
Typescript 是微软开源的编程语言，简称 TS，它是 JS 的超集能够为 JS 提供类型支持。现在越来越多的人和团队在他们的项目中使用 TS 语言，使用 TS 的好处很多，如代码即文档、编辑器的自动提示、一定程度上能够避免低级 bug、让代码的可维护性更强等等。因此对 TS 类型支持的是否完善也成为评价一个框架的重要指标。

那如何衡量一个框架对 TS 类型支持的好坏呢？这里有一个常见的误区，很多同学以为只要是使用 TS 编写就是对 TS 类型支持的友好，其实使用 TS 编写框架和框架对 TS 类型支持的友好是两件关系不大的事儿。考虑到有的同学可能没有接触过 TS，所以这里不会做深入讨论，我们只举一个简单的例子，如下是使用 TS 编写的函数：
``` javascript
function foo(val: any) {
  return val
}
```

这个函数很简单，它接受一个参数 val 并且参数可以是任意类型（any），该函数直接将参数作为返回值，这说明返回值的类型是由参数决定的，参数如果是 number 类型那么返回值也是 number 类型，然后我们可以尝试使用一下这个函数，如下图所示：

在调用 foo 函数时我们传递了一个字符串类型的参数 'str'，按照之前的分析，我们得到的结果 res 的类型应该也是字符串类型，然而当我们把鼠标 hover 到 res 常量上时可以看到其类型是 any，这并不是我们想要的结果，为了达到理想状态我们只需要对 foo 函数做简单的修改即可：

``` javascript
function foo<T extends any>(val: T): T {
  return val
}
```
可以看到 res 的类型是字符字面量 'str' 而不是 any 了，这说明我们的代码生效了。

通过这个简单的例子我们认识到，使用 TS 编写代码与对 TS 类型支持友好是两件事，在编写大型框架时想要做到完美的 TS 类型支持是一件很不容易的事情，大家可以查看 Vue 源码中的 runtime-core/src/apiDefineComponent.ts 文件，整个文件里真正会在浏览器运行的代码其实只有 3 行，但是当你打开这个文件的时候你会发现它整整有接近 200 行的代码，其实这些代码都是在做类型支持方面的事情，由此可见框架想要做到完善的类型支持是需要付出相当大的努力的。

除了要花大力气做类型推导，从而做到更好的类型支持外，还要考虑对 TSX 的支持。

以上来源 `前端森林`
