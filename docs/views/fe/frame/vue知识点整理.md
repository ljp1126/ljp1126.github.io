---
title: vue知识点整理
sidebar: 'auto'
date: 2020-10-31
tags:
 - Vue
categories:
 - framework
---

> 知其然知其所以然，方能知己知彼

## 1. 如何理解MVVM原理
  MVVM是Model-View-ViewModel缩写，也就是把MVC中的Controller演变成ViewModel。Model层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据

  * view:视图模型。其实就是一个增强版的html，可以支持变量，一些程序的要素。
  * model:数据模型。其实就是一个保存所有页面所需的变量的对象一data-/..}
  * viewmodel :就是将视图模型和数据模型给绑定起来，以后只要数据模型中的数据改变了，页面中也会改变

## 2. 响应式数据原理是什么

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/093f4b1708024e8498dd89eaa6f7147e~tplv-k3u1fbpfcp-watermark.image)

Vue底层对于响应式数据的核心是object.defineProperty，Vue在初始化数据时，会给data中的属性使用object.defineProperty重新定义属性（劫持属性的getter和setter），当页面使用对应属性时，会通过Dep类进行依赖收集（收集当前组件的watcher）,如果属性发生变化，会通知相关依赖调用其update方法进行更新操作

多层对象是通过递归来实现劫持

  * Observer : 它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新
  * Dep : 用于收集当前响应式对象的依赖关系,每个响应式对象包括子对象都拥有一个 Dep 实例（里面 subs 是 Watcher 实例数组）,当数据有变更时,会通过 dep.notify()通知各个 watcher。
  * Watcher : 观察者对象 , 实例分为渲染 watcher (render watcher),计算属性 watcher (computed watcher),侦听器 watcher（user watcher）三种

补充回答:
内部依赖收集是怎样做到的,每个属性都拥有自己的dep属性,存放他所依赖的watcher ,当属性变化后会通知自己对应的watcher去更新(其实后面会讲到每个对象类型自己本身也拥有一个dep属性,这个在
$set面试题中在进行讲解)
这里可以引出性能优化相关的内容

  * (1)对象层级过深,性能就会差
  * (2)不需要响应数据的内容不要放到data中
  * (3) object.freeze()可以冻结数据

> https://juejin.cn/post/6871801521429250061

Vue3.x改用Proxy替代Object.defineProperty。因为Proxy可以直接监听对象和数组的变化，并且有多达13种拦截方法。并且作为新标准将受到浏览器厂商重点持续的性能优化。

Proxy只会代理对象的第一层，那么Vue3又是怎样处理这个问题的呢？
判断当前Reflect.get的返回值是否为Object，如果是则再通过reactive方法做代理， 这样就实现了深度观测。

监测数组的时候可能触发多次get/set，那么如何防止触发多次呢？
我们可以判断key是否为当前被代理对象target自身属性，也可以判断旧值与新值是否相等，只有满足以上两个条件之一时，才有可能执行trigger。

## 3. vue中如何检测数组变化

数组考虑性能原因没有用defineProperty对数组的每一项进行拦截，而是选择重写数组
(push,shift，pop，splice，unshift，sort，reverse)方法进行重写。
补充回答:
在Vue中修改数组的索引和长度是无法监控到的。需要通过以上7种变异方法修改数组才会触发数组对应的watcher进行更新。数组中如果是对象数据类型也会进行递归劫持。
那如果想更改索引更新数据怎么办?
可以通过Vue.$set()来进行处理 -> 核心内部用的是splice方法

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/584f22393bb94fa688be8910b068af5a~tplv-k3u1fbpfcp-watermark.image)

> https://juejin.cn/post/6871801521429250061#heading-25

## 4. 为何vue采用异步渲染

我们可以从用户和性能两个角度来探讨这个问题。
从用户体验角度，从上面例子里便也可以看出，实际上我们的页面只需要展示第二次的值变化，第一次只是一个中间值，如果渲染后给用户展示，页面会有闪烁效果，反而会造成不好的用户体验。
从性能角度，例子里最终的需要展示的数据其实就是第二次给val赋的值，如果第一次赋值也需要页面渲染则意味着在第二次最终的结果渲染之前页面还需要渲染一次无用的渲染，无疑增加了性能的消耗。
对于浏览器来说，在数据变化下，无论是引起的重绘渲染还是重排渲染，都有可能会在性能消耗之下造成低效的页面性能，甚至造成加载卡顿问题。
异步渲染和熟悉的节流函数最终目的是一致的，将多次数据变化所引起的响应变化收集后合并成一次页面渲染，从而更合理的利用机器资源，提升性能与用户体验。
能不能同步渲染

 1. Vue.config.async = false

``` javascript
function queueWatcher (watcher) {
  ...
  // 在全局队列里存储将要响应的变化update函数
  queue.push(watcher);
  ...
  // 当async配置是false的时候，页面更新是同步的
  if (!config.async) {
    flushSchedulerQueue();
    return
  }
  // 将页面更新函数放进异步API里执行，同步代码执行完开始执行更新页面函数
  nextTick(flushSchedulerQueue);
}
```

当config里的async的值为为false的情况下，并没有将flushSchedulerQueue加到nextTick里，而是直接执行了flushSchedulerQueue，就相当于把本次data里的值变化时，页面做了同步渲染

  2. this._watcher.sync = true

在Watch的update方法执行源码里，可以看到当this.sync为true时，这时候的渲染也是同步的

``` javascript
Watcher.prototype.update = function update () {
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
```

## 5. nextTick实现原理

nextTick中的回调是在下次DOM更新循环结束之后执行的延迟回调。在修改数据之后立即使用这个方
法,获取更新后的DOM。原理就是异步方法(promise,mutationObserver,setImmediate,setTimeout)经常与事件环一起来问(宏任务和微任务)
补充回答:
vue多次更新数据,最终会进行批处理更新。内部调用的就是nextTick实现了 延迟更新,用户自定义的
nextTick中的回调会被延迟到更新完成后调用,从而可以获取更新后的DOM。

``` javascript
let cbs = [];
let pendings = false;
function flushCallbacks() {
  cbs.forEach(fn=>fn());
  pendings = false;
}

function nextTick(fn) {
  cbs.push(fn);
  if(!pendings) {
    pendings = true
    Promise.resolve().then(flushCallbacks)
  }
}
function render() {
  console.log('渲染')
}

nextTick(render);
nextTick(render);
nextTick(render);
```

## 6. vue组件的生命周期

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b03cfd66eaa4fdf856f89d35c57c2db~tplv-k3u1fbpfcp-watermark.image)

https://juejin.cn/post/6844904117400240136#heading-1

怎样实现的：
Vue的生命周期钩子就是回调函数而已,当创建组件实例的过程中会调用对应的钩子方法

#补充回答:
内部主要是使用calHook方法来调用对应的方法。核心是一个发布订阅模式,将钩子订阅好(内部采用数
组的方式存储) , 在对应的阶段进行发布!

## 7. AJAX放在哪个生命周期中

Ajax请求应该放在created钩子函数是最好的，这时候数据模型data已经初始化好了。如果放在beforeCreate函数里，这时候data还没有初始化，无法将获取到的数据赋值给数据模型。如果放在mounted里，这时候页面结构已经完成，如果获取的数据与页面结构无联系的话，这个阶段是略微有点迟的

## 8. 何时需要使用beforeDestory

实际对于销毁的场景大部分使用的destroy就足够了，而beforeDestroy何时使用呢？看看它俩的区别，beforeDestroy执行的时候页面DOM还是存在未被销毁的，而Destroy执行的时候，页面已经重新渲染完了，所以我们可以在beforeDestroy里执行一些组件销毁前对页面的特殊操作

## 9. Vue父子组件生命周期调用顺序

  * 组件的调用顺序都是先父后子,渲染完成的顺序是先子后父。
  * 组件的销毁操作是先父后子，销毁完成的顺序是先子后父。


> 父组件挂载完成必须是等到子组件都挂载完成之后，才算父组件挂载完，所以父组件的mounted肯定是在子组件mounted之后

So：「父」beforeCreate → 「父」created → 「父」beforeMount → 「子」beforeCreate → 「子」created → 「子」beforeMount → 「子」mounted → 「父」mounted

  * 子组件更新过程（取决于对父组件是否有影响）

  影响到父组件： 「父」beforeUpdate → 「子」beforeUpdate → 「子」updated → 「父」updated
  不影响父组件： 「子」beforeUpdate → 「子」updated


  * 父组件更新过程（取决于对子组件是否有影响）

  影响到子组件： 「父」beforeUpdate → 「子」beforeUpdate → 「子」updated → 「父」updated
  不影响子组件： 「父」beforeUpdate → 「父」updated


  * 销毁过程

  「父」beforeDestroy → 「子」beforeDestroy → 「子」destroyed → 「父」destroyed



## 10. Vue中computed特点

computed 本质是一个惰性求值的观察者。

computed 内部实现了一个惰性的 watcher,也就是 computed watcher,computed watcher 不会立刻求值,同时持有一个 dep 实例。

其内部通过 this.dirty 属性标记计算属性是否需要重新求值。

当 computed 的依赖状态发生改变时,就会通知这个惰性的 watcher，computed watcher 通过 this.dep.subs.length 判断有没有订阅者，有的话，会重新计算,然后对比新旧值，如果变化了，会重新渲染。 (Vue 想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化时才会触发渲染 watcher 重新渲染，本质上是一种优化。)

没有的话,仅仅把 this.dirty = true。 (当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，即具备 lazy（懒计算）特性。)

与监听器区别

计算属性computed更多是作为缓存功能的观察者，它可以将一个或者多个data的属性进行复杂的计算生成一个新的值，提供给渲染函数使用，当依赖的属性变化时，computed不会立即重新计算生成新的值，而是先标记为脏数据，当下次computed被获取时候，才会进行重新计算并返回。
而监听器watch并不具备缓存性，监听器watch提供一个监听函数，当监听的属性发生变化时，会立即执行该函数

11. watch中的deep: true如何实现

``` javascript
function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

这里我们先判断 val 的类型，如果它不是Array和object，或者已经被冻结，那么直接返回，什么都不干。
然后拿到 val 的dep.id，用这个id来保证不会重复收集依赖。

  * 如果是数组，则循环数组，将数组中的每一项递归调用_traverse。
  * 如果是Object类型的数据，则循环Object中的所有key，然后执行一次读取操作，再递归子值∶

`wihle(l--)_traverse(val[keys[1],seen)`

其中val[keys[i]]会触发 getter，也就是说会触发收集依赖的操作，这时window.target 还没有被清空，会将当前的 watcher收集进去。这也是前面我强调的一定要在window.target=undefined 这个语句之前触发收集依赖的原因。
而_traverse 函数其实是一个递归操作，所以这个value的子值也会触发同样的逻辑，这样就可以实现通过 deep 参数来监听所有子值的变化。
当用户指定了watch中的deep属性为true时，如果当前监控的值是数组类型，会对对象中的每一项进行求值，此时会将当前watcher存入到对应属性的依赖中，这样数组中的对象发生变化时也会通知数据更新。
不光是数组类型，对象类型也会对深层属性进行依赖收集，比如deep watch了 obj，那么对 obj.a.b.c = 5 这样深层次的修改也一样会触发 watch 的回调函数。本质上是因为 Vue 内部对需要 deep watch 的属性会进行递归的访问，而在此过程中也会不断发生依赖收集。（只要此属性也是响应式属性）

在回答这道题的时候，同样也要考虑到 递归收集依赖 对性能上的损耗和权衡，这样才是一份合格的回答。

## 12. vue中事件绑定的原理

Vue中通过v-on或其语法糖@指令来给元素绑定事件并且提供了事件修饰符，基本流程是进行模板编译生成AST，生成render函数后并执行得到VNode，VNode生成真实DOM节点或者组件时候使用addEventListener方法进行事件绑定

## 13.vue中v-html会导致哪些问题

V-html更新的是元素的 innerHTML 。内容按普通 HTML 插入， 不会作为 Vue 模板进行编译 。但是有的时候我们需要渲染的html片段中有插值表达式，或者按照Vue模板语法给dom元素绑定了事件；
使用v-html需要注意的第二个问题是：在单文件组件里，scoped 的样式不会应用在 v-html 内部，因为那部分 HTML 没有被 Vue 的模板编译器处理。如果你希望针对 v-html 的内容设置带作用域的 CSS，你可以替换为 CSS Modules 或用一个额外的全局
可能会导致 xss 攻击

第一种解决方案，照样使用scoped，但是我们可以使用深度选择器（>>>），示例如下

``` javascript
.a {
/deep/ .b{/* ... */}
}
```

第二种解决方案，单文件组件的style标签可以使用多次，可以一个stlye标签带scoped属性针对当前组件，另外一个style标签针对全局生效，但是内部我们采用特殊的命名规则即可，例如BEM规则

## 14. vue中v-if和v-show的区别


v-if在编译过程中会被转化成三元表达式，条件不满足时不渲染此节点。


v-show会被编译成指令,条件不满足时控制样式将对应节点隐藏(内部其他指令依旧会继续执行)


v-if不是真正的指令，它在编译时就被转化了，v-if控制该dom是否渲染


v-show控制样式，先获取原来的block属性：例如block/inline-block...,保存起来，然后获取值是true/false,true就赋值原来的样式属性，false就改为none


v-if不满足就不会渲染，v-show不满足也会渲染，只是样式设置为了none


## 15. 为什么v-for和v-if不能连用

v-for和v-if不要在同一一个标签中使用,因为解析时先解析v-for在解析v-if。如果连用会把v-if给v-for遍历出来的每一个元素都添加一下，容易造成性能浪费。如果遇到需要同时使用时可以考虑写成计算属性的方式。
v-for通过循环生成每一个列表

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16201083e0dd43b1923d49dbb490d4b9~tplv-k3u1fbpfcp-watermark.image)

## 16、v-model中的实现原理及如何自定义v-model?

v-model只是一个语法糖，等于:value+@input，真正的实现靠的还是： ﻿v-bind:绑定响应式数据，触发 input 事件并传递数据 (核心和重点)

``` javascript
<input v-model="something">
```

相当于：

``` javascript
<input :value="something"  @:input="something = $event.target.value">
```

## 17、组件中的data为什么是一个函数?

每次使用组件时都会对组件进行实例化操作,并且调用data函数返回一个对象作为组件的数据源。这样可
以保证多个组件间数据互不影响
一个组件被复用多次的话，也就会创建多个实例。本质上，这些实例用的都是同一个构造函数。如果data是对象的话，对象属于引用类型，会影响到所有的实例。所以为了保证组件不同的实例之间data不冲突，data必须是一个函数。

## 18、Vue组件如何通信?

  1. props和Semit父组件向子组件传递数据是通过prop传递的,子组件传递数据给父组件是通过Semit触发事件来做到的

  2. $parent,$children获取当前组件的父组件和当前组件的子组件

  3. $attrs 和$listeners A->B->C。 Vue 2.4开始提供了attrs和attrs 和attrs和listeners 来解决这个问题

  4. 父组件中通过provide来提供变量,然后在子组件中通过inject 来注入变量。

  5. $refs 获取实例

  6. envetBus 平级组件数据传递这种情况下可以使用中央事件总线的方式

  7. vuex状态管理

实现：
### 1. `props/$emit`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4222e733411e46ddbd6f755d5305eac9~tplv-k3u1fbpfcp-watermark.image)

  * propsOptions: 组件内定义的props属性
  * propsData:传入的要接收的props值

如果不是根组件，就不设置为响应式数据，因为父组件传入的值本来就是响应式的 把props代理到了组件实例上(同把data代理到实例上)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04cfc7bcf74e4baaa64f5bf3cec9cf27~tplv-k3u1fbpfcp-watermark.image)

其实就是$on,$emit，发布订阅模式把on相关的都定义到listeners上

### 2. `$parents/$children`

$parents 先渲染父组件，后渲染子组件，所以子组件可以拿到父组件实例

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0509a185fb543618e61e91d08bbd9b5~tplv-k3u1fbpfcp-watermark.image)

### 3. provide/inject

provide/inject本身不支持响应式，但是如果传入的是一个响应式数据，那么也支持
在实例上挂载一个_provided, 传入provide，如果是函数，获取函数返回值，赋值到_provided上

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5c1a58c22a44ed6a4715ef6d77fe91b~tplv-k3u1fbpfcp-watermark.image)

子组件循环查找provide，找到后直接定义到组件上，因为父组件中数据是响应式的，所以子组件中不需要再响应

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e69dd461946544a8a2aa3b0fbc7d4d89~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a30981b4400d46b399663fb8f83cc62b~tplv-k3u1fbpfcp-watermark.image)

provide/inject尽量在组件库用，不在业务中用，因为找不到数据来源

### 4. $attrs/$listeners

使用：v-bind="$attrs" v-on="$listeners"将所有属性与事件都传给下一个组件
注意: 是保存没有定义的属性
原理： 将所有数据存到attrs，所有方法存到attrs，所有方法存到attrs，所有方法存到listeners，并且是响应式的

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e148a0244e04808869d08e0cdbd4d69~tplv-k3u1fbpfcp-watermark.image)

### 5. $ref

如果在组件上就是组件实例，否则是真实dom,在v-for中就是一个数组

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7f0c5496be94fdfbc22319a63106a13~tplv-k3u1fbpfcp-watermark.image)

扩展：$attrs是为了解决什么问题。应用场景有哪些，provide/inject不能解决它解决的问题嘛
核心答案:
$attrs主要的作用就是实现批量传递数据。provide/inject更适合应用在插件中 ,主要是实现跨级数据传递

## 19、什么是作用域插槽?

单个插槽当子组件模板只有一个没有属性的插槽时，父组件传入的整个内容片段将插入到插槽所在的 DOM 位置， 并替换掉插槽标签本身
普通插槽(模板传入到组件中,数据采用父组件数据)和作用域插槽(在父组件中访问子组件数据)
普通插槽，父组件中渲染，因为拿的父组件数据渲染，可以实现父子间通信 作用域插槽，子组件中渲染

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2153301f3bcb48e586007b68ad96dec6~tplv-k3u1fbpfcp-watermark.image)

作用域插槽：父组件生成一个函数，子组件调用这个函数

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fea8a5fee124e74afa18b7d37fbc2d3~tplv-k3u1fbpfcp-watermark.image)

## 20、为什么要用虚拟dom?用vnode来描述一个DOM结构?

核心答案:

  * Virtual DOM就是用js对象来描述真实DOM ,是对真实DOM的抽象,
  * js层的操作效率高,可以将DOM操作转化成对象操作,最终通过diff算法比对差异进行更新DOM (减少了对真实DOM的操作)。
  * 虚拟DOM不依赖真实平台环境从而也可以实现跨平台。

补充回答:
虚拟DOM的实现就是普通对象包含tag、data、 children等属性对真实节 点的描述。( 本质上就是在JS和DOM之间的一个缓存)

``` javascript
{
    children:[VNode,VNode], 
    context:{..}, 
    data:{...},
    tag:"p",
    ...
}
```

## 21、diff算法的时间复杂度?

两个数的完全的diff算法是一个时间复杂度为o(n3)， Vue进行了优化O(n3)复杂度的问题转换成O(n)复杂度的问题(只比较同级不考虑跨级问题)在前端当中，你很少会跨级层级地移动Dom元素，所以Virtual Dom只会对同一个层级地元素进行对比

## 22、简述Vue中diff算法原理?

Vue的diff算法是平级比较,不考虑跨级比较的情况。内部采用深度递归雨方式+双指针的方式进行比
较。两个开头指针，两个结束指针，主要比较key和标签名
简单来说，diff算法有以下过程
同级比较，再比较子节点
先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
比较都有子节点的情况(核心diff)
递归比较子节点
正常Diff两个树的时间复杂度是O(n^3)，但实际情况下我们很少会进行跨层级的移动DOM，所以Vue将Diff进行了优化，从O(n^3) -> O(n)，只有当新旧children都为多个子节点时才需要用核心的Diff算法进行同层级比较。
Vue2的核心Diff算法采用了双端比较的算法，同时从新旧children的两端开始进行比较，借助key值找到可复用的节点，再进行相关操作。相比React的Diff算法，同样情况下可以减少移动节点次数，减少不必要的性能损耗，更加的优雅。
Vue3.x借鉴了ivi算法和 inferno算法
在创建VNode时就确定其类型，以及在mount/patch的过程中采用位运算来判断一个VNode的类型，在这个基础之上再配合核心的Diff算法，使得性能上较Vue2.x有了提升。(实际的实现可以结合Vue3.x源码看。)
该算法中还运用了动态规划的思想求解最长递归子序列。

## 23、v-for中为什么要用key ?

key是为每个vnode指定唯一的id，在同级vnode的Diff过程中，可以根据key快速的进行对比，来判断是否为相同节点，并利用key的唯一性生成map来更快的获取相应的节点，另外指定key后，可以保证渲染的准确性

## 24、描述组件渲染和更新过程?


  * 1.父子组件渲染的先后顺序


  * 2.组件是如何渲染到页面上的


  * ①在渲染父组件时会创建父组件的虚拟节点其中可能包含子组件的标签


  * ②在创建虚拟节点时,获取组件的定义使用Vue. extend生成组件的构造函数。


  * ③将虚拟节点转化成真实节点时,会创建组件的实例并且调用组件的$mount方法。


  * ④所以组件的创建过程是先父后子


子组件调vue.extend().$mount,然后塞到父组件中

### 25、Vue中模板编译原理?

简单说，Vue的编译过程就是将template转化为render函数的过程。会经历以下阶段：

  * 1.将template模板转换成ast语法树- parserHTML
  * 2.对静态语法做静态标记- markUp
  * 3.重新生成代码- codeGen

首先解析模版，生成AST语法树(一种用JavaScript对象的形式来描述整个模板)。使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理。
Vue的数据是响应式的，但其实模板中并不是所有的数据都是响应式的。有一些数据首次渲染后就不会再变化，对应的DOM也不会变化。那么优化过程就是深度遍历AST树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以跳过对它们的比对，对运行时的模板起到很大的优化作用。
编译的最后一步是将优化后的AST树转换为可执行的代码。
补充回答:
模板引擎的实现原理就是new Function + with来进行实现的
如何将template转换成render函数(这里要注意的是我们在开发时尽量不要使用template ,因为将template转化成render方法需要在运行时进行编译操作会有性能损耗,同时引用用带有compiler包的vue体积也会变大。默认.vue文件中的template处理是通过vue-loader来进行处理的并不是通过运行时的编译-后面我们会说到默认vue项目中引入的vue.js是不带有compiler模块的)。

> https://juejin.cn/post/6887904223468617735/

## 26、Vue中常见性能优化?

  * 编码阶段

    * 尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher
    * v-if和v-for不能连用
    * 如果需要使用v-for给每项元素绑定事件时使用事件代理
    * SPA 页面采用keep-alive缓存组件
    * 在更多的情况下，使用v-if替代v-show
    * key保证唯一
    * 使用路由懒加载、异步组件
    * 防抖、节流
    * 第三方模块按需导入
    * 长列表滚动到可视区域动态加载
    * 图片懒加载
    * SEO优化
    * 预渲染
    * 服务端渲染SSR

  * 打包优化

    * 压缩代码
    * Tree Shaking/Scope Hoisting
    * 使用cdn加载第三方模块
    * 多线程打包happypack
    * splitChunks抽离公共文件
    * sourceMap优化

  * 用户体验
    * 骨架屏
    * PWA

  * 还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。

(优化是个大工程，会涉及很多方面，这里申请另开一个专栏)

## 27、Vue中相同逻辑如何抽离?

使用Vue.mixin方法（混入），其提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。说白了就是给每个生命周期，函数等等中间加入一些公共逻辑。

## 28、为什么要使用异步组件?

如果组件功能多打包出的结果会变大，我可以采用异步的方式来加载组件。主要依赖 import() 这个语法，可以实现文件的分割加载

## 29、谈谈你对keep-alive的了解?

keep-alive主要是缓存，采用的是LRU算法。最近最久未使用法。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97832ea762974f31b3ac9a6f383e070d~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69424cbd2e2f4d4d96295ac530ba6d3e~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b840c03deac64f51a0444f2c472750a0~tplv-k3u1fbpfcp-watermark.image)

用watch监听

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2a092a7460a4083a05ebc4ef8ecf167~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5031672ed9fa498c93ef761fb5402448~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0294a2ebc265447e993125da797c97b8~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10aa86c53880441eb0af7360261fd174~tplv-k3u1fbpfcp-watermark.image)


> https://juejin.cn/post/6844904031983239181#heading-20

keep-alive可以实现组件缓存，当组件切换时不会对当前组件进行卸载。
常用的两个属性include/exclude，允许组件有条件的进行缓存。
两个生命周期activated/deactivated，用来得知当前组件是否处于活跃状态。
keep-alive的中还运用了LRU(Least Recently Used)算法。
（又是数据结构与算法，原来算法在前端有这么多的应用）
包裹在`<keep-alive>`里组件，在切换时会保存其组件的状态，使其不被销毁，防止多次渲染

一般结合路由和动态组件一起使用，用于缓存组件
keep-alive拥有两个独立的生命周期（activated | deactivated），使keep-alive包裹的组件在切换时不被销毁，而是缓存到内存中并执行deactivated钩子，切换回组件时会获取内存，渲染后执行activated钩子
提供include和exclude属性，两者都支持字符串或正则表达式

  * include 表示只有名称匹配的组件才会被缓存
  * exclude 表示任何名称匹配的组件都不会被缓存
  * exclude优先级高于include

## 30、实现hash路由和history路由

> https://juejin.cn/post/6844903749421367303#heading-6

## 31、Vue-Router中导航守卫有哪些?

  * 「全局前置钩子」
    * beforeEach:
    * beforeResolve: 同时在所有组件内守卫和异步路由组件被解析之后
    * afterEach
  * 「路由独享守卫」
    * beforeEnter
  * 「组件内部守卫」
    * beforeRouteEnter: 组件实例还没被创建,不能获取组件this
    * beforeRouteUpdate: 在当前路由改变，但是该组件被复用时调用,如/foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
    * beforeRouteLeave： 导航离开该组件的对应路由时调用，可以访问组件实例 this

完整的导航解析流程:

  1. 导航被触发。
  2. 在失活的组件里调用离开守卫beforeRouteLeave。
  3. 调用全局的 beforeEach 守卫。
  4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
  5. 在路由配置里调用 beforeEnter。
  6. 解析异步路由组件。
  7. 在被激活的组件里调用 beforeRouteEnter。
  8. 调用全局的 beforeResolve 守卫 (2.5+)。
  9. 导航被确认。
  10. 调用全局的 afterEach 钩子。
  11. 触发 DOM 更新。
  12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

像koa一样，洋葱圈
扩展： 怎样做权限菜单，路由动态加载
传参方式：

  * 通过params

    * 只能用name，不能用path
    * 参数不会显示在url上
    * 浏览器强制刷新会清空参数

  * 通过query

    * 只能用path，不能用name
    * name可以使用path路径
    * 参数会显示在url上
    * 浏览器刷新不清空参数

## 32、action和mutation区别

mutation是同步更新数据(内部会进行是否为异步方式更新数据的检测)
内部并不能检测到是否异步更新，而是实例上有一个开关变量 _committing，
只有在 mutation 执行之前才会把开关打开，允许修改 state 上的属性。
并且在 mutation 同步执行完成后立刻关闭。
异步更新的话由于已经出了 mutation 的调用栈，此时的开关已经是关上的，自然能检测到对 state 的修改并报错。具体可以查看源码中的 withCommit 函数。这是一种很经典对于 js单线程机制 的利用。

``` javascript
Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};
```

## 33、简述Vuex工作原理

vuex中所有的状态更新的唯一方式都是提交mutation，异步操作需要通过action来提交mutation（dispatch）。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地使用vuex
每个mutation执行完后都会对应得到一个新的状态变更，这样devtools就可以打个快照存下来，然后就可以实现time-travel了。
如果mutation支持异步操作，就没有办法知道状态是何时更新，无法很好的进行状态追踪，影响调试效率

## 34. 为什么在 Vue3.0 采用了 Proxy,抛弃了 Object.defineProperty

> Object.defineProperty 本身有一定的监控到数组下标变化的能力,但是在 Vue 中,从性能/体验的性价比考虑,尤大大就弃用了这个特性(Vue 为什么不能检测数组变动 )。为了解决这个问题,经过 vue 内部处理后可以使用以下几种方法来监听数组

``` javascript
  push();
  pop();
  shift();
  unshift();
  splice();
  sort();
  reverse();
```

由于只针对了以上 7 种方法进行了 hack 处理,所以其他数组的属性也是检测不到的,还是具有一定的局限性。

> Object.defineProperty 只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历。Vue 2.x 里,是通过 递归 + 遍历 data 对象来实现对数据的监控的,如果属性值也是对象那么需要深度遍历,显然如果能劫持一个完整的对象是才是更好的选择。

Proxy 可以劫持整个对象,并返回一个新的对象。Proxy 不仅可以代理对象,还可以代理数组。还可以代理动态增加的属性。

## 35. Vue 中的 key 到底有什么用？

key 是给每一个 vnode 的唯一 id,依靠 key,我们的 diff 操作可以更准确、更快速 (对于简单列表页渲染来说 diff 节点也更快,但会产生一些隐藏的副作用,比如可能不会产生过渡效果,或者在某些节点有绑定数据（表单）状态，会出现状态错位。)
diff 算法的过程中,先会进行新旧节点的首尾交叉对比,当无法匹配的时候会用新节点的 key 与旧节点进行比对,从而找到相应旧节点.
更准确 : 因为带 key 就不是就地复用了,在 sameNode 函数  a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确,如果不加 key,会导致之前节点的状态被保留下来,会产生一系列的 bug。
更快速 : key 的唯一性可以被 Map 数据结构充分利用,相比于遍历查找的时间复杂度 O(n),Map 的时间复杂度仅仅为 O(1),源码如下:

``` javascript
function createKeyToOldIdx(children, beginIdx, endIdx) {  
  let i, key;  
  const map = {};  
  for (i = beginIdx; i <= endIdx; ++i) {    
    key = children[i].key;    
    if (isDef(key)) map[key] = i;  
  }  
  return map;
}
```

由于在浏览器中操作DOM是很昂贵的。频繁的操作DOM，会产生一定的性能问题。这就是虚拟Dom的产生原因。
Vue2的Virtual DOM借鉴了开源库snabbdom的实现。
Virtual DOM本质就是用一个原生的JS对象去描述一个DOM节点。是对真实DOM的一层抽象。(也就是源码中的VNode类，它定义在src/core/vdom/vnode.js中。)
VirtualDOM映射到真实DOM要经历VNode的create、diff、patch等阶段。
「key的作用是尽可能的复用 DOM 元素。」
新旧 children 中的节点只有顺序是不同的时候，最佳的操作应该是通过移动元素的位置来达到更新的目的。
需要在新旧 children 的节点中保存映射关系，以便能够在旧 children 的节点中找到可复用的节点。key也就是children中节点的唯一标识

## 36. 谈谈 Vue 事件机制,手写on,on,on,off,emit,emit,emit,once

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1d149378ae94044bb28f4d02191d315~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20c7ef96a7cc43bab07239cedc22d88f~tplv-k3u1fbpfcp-watermark.image)

## 37. 说说 Vue 的渲染过程

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7882a30be2342eca66f3f423e7277d4~tplv-k3u1fbpfcp-watermark.image)

  * 调用 compile 函数,生成 render 函数字符串 ,编译过程如下:
  * parse 函数解析 template,生成 ast(抽象语法树)
  * optimize 函数优化静态节点 (标记不需要每次都更新的内容,diff 算法会直接跳过静态节点,从而减少比较的过程,优化了 patch 的性能)
  * generate 函数生成 render 函数字符串
  * 调用 new Watcher 函数,监听数据的变化,当数据发生变化时，Render 函数执行生成 vnode 对象
  * 调用 patch 方法,对比新旧 vnode 对象,通过 DOM diff 算法,添加、修改、删除真正的 DOM 元素

## 38. vue.set

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f37b8db39c44709b9c5d15ac8261556~tplv-k3u1fbpfcp-watermark.image)

  * 如果目标是数组,使用 vue 实现的变异方法 splice 实现响应式
  * 如果目标是对象,判断属性存在,即为响应式,直接赋值
  * 如果 target 本身就不是响应式,直接赋值
  * 如果属性不是响应式,则调用 defineReactive 方法进行响应式处理

## 39. vue.mixin的使用场景和原理

Vue.mixin的作用就是抽离公共的业务逻辑,原理类似”对象的继承" ,当组件初始化时会调用
mergeOptions方法进行合并,采用策略模式针对不同的属性进行合并。如果混入的数据和本身组件中的
数据冲突，会采用就近原则以组件的数据为准。
补充回答:
mixin中有很多缺陷“命名冲突问题”、“依赖问题"、 “数据来源问题"，这里强调一下mixin的数据是不会被共享的!

## 40. vue.use是做什么的，原理是什么

Vue use()是用来使用插件的,我们可以在插件中扩展全局组件、指令、原型方法等。
插件不依赖于vue本身，直接把vue当作参数传进去即可

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddeb4de7c3714363a97fe94990e11bf1~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2896e04121cc42098b64db5ac3d5ff2c~tplv-k3u1fbpfcp-watermark.image)


## 41. 组件中的name选项有哪些好处及作用

  - 可以通过名字找到对应的组件 (递归组件)
  - 可用通过name属性实现缓存功能(keep-alive)
  - 可以通过name来识别组件(跨级组件通信时非常重要)

``` javascript
Vue.extend = function(){
  if (name) {
    Sub.options.components[name] = Sub
  }
}
```

## 42. vue事件修饰符有哪些？其实现原理

事件修饰符有: .capture、.once、 .passive. .stop. .self、 .prevent.

1. 编译时在函数名前加一个标记

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/815ef7f308db42a993ba247523e36727~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d264025d97c04c2bb20fc4bf7719770b~tplv-k3u1fbpfcp-watermark.image)

包到一个函数中

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/989af67631484212bd44171849d53cbb~tplv-k3u1fbpfcp-watermark.image)

## 43. vue.directive

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c139281c54ab431bad592931492ff895~tplv-k3u1fbpfcp-watermark.image)

## 44. 如何理解自定义指令

指令的实现原理,可以从编译原理= >代码生成=>指令钩子实现进行概述

  * 1.在生成ast 语法树时,遇到指令会给当前元素添加directives属性
  * 2.通过genDirectives生成指令代码
  * 3.在patch前将指令的钩子提取到cbs中在patch过程中调用对应的钩子
  * 4.当执行指令对应钩子函数时,调用对应指令定义的方法

ast上有directive数组，里面有好几个指令对象

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73b4fe898c06428faecc3830786c82a4~tplv-k3u1fbpfcp-watermark.image)

渲染时有指令就调用指令的钩子方法

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75743ac2d4334b9795f4ab422c95fe8c~tplv-k3u1fbpfcp-watermark.image)

## 45. vuex

vuex是专门为vue提供的全局状态管理系统,用于多个组件中数据共享、数据缓存等。( 无法持久化、
内部核心原理是通过创造一一个全局实例 new Vue )

  * ● 衍生的问题action和mutation 的区别
  * ● 核心方法: replaceState 、 subscribe、registerModule、namespace( modules )

new一个Vue,所有组件都可以拿到vue上的state
action异步逻辑。mutation更新状态

## 46. vue使用了哪些设计模式

* 工厂模式-传入参数即可创建实例(createElement)

  * 根据传入的参数不同返回不同的实例

* 单例模式

  * 单例模式就是整个程序有且仅有一个实例。

* 发布-订阅模式
* 订阅者把自己想订阅的事件注册到调度中心,当该事件触发时候,发布者发布该事件到调度中心,由调度中心统一调度订阅者注册到调度中心的处理代码。

* 观察者模式: watcher & dep 的关系
  * 代理模式(防抖和节流) =>返回替代(例如: Vue3 中的proxy)

* 代理模式给某- 个对象提供一个代理对象 并由代理对象控制对原对象的引用。

* 装饰模式: @装饰器的用法
* 中介者模式=> vuex

  * 中介者是一个行为设计模式通过提供一个统- 的接口让系统的不同部分进行通信。

* 策略模式策略模式指对象有某个行为但是在不同的场景中该行为有不同的实现高案。

``` javascript
// 策略模式
function mergeField (key) {
  const strat = strats[key] || defaultStrat
  options[key] = strat(parent[key], child[key], vm, key)
}
```

## 47. vue3和vue2区别

  * 对TypeScript 支持不友好(所有属性都放在了this对象上,难以推倒组件的数据类型)
  * 大量的API挂载在Vue对象的原型上,难以实现TreeShaking。
  * 架构层面对跨平台dom渲染开发支持不友好
  * CompositionAPI 。受ReactHook启发
  * 对虚拟DOM进行了重写、对模板的编译进行了优化操作...

## 48. 怎样理解单项数据流

  * 在vue中，父组件可以通过prop将数据传递给子组件，但这个prop只能由父组件来修改，子组件修改的话会抛出错误
  * 如果是子组件想要修改数据，只能通过$emit由子组件派发事件，并由父组件接收事件进行修改

为什么子组件不可以修改父组件传递的Prop？
这是为了防止意外的改变父组件的状态，使得应用的数据流变得难以理解。如果破坏了单项数据流，当应用复杂时，debug的成本将会非常高

原文：[掘金zxhnext](https://juejin.cn/post/6888288504162451463)