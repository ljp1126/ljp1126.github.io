---
title: 剑指offer算法刷题
sidebar: 'auto'
date: 2021-03-10
tags:
 - 剑指offer
categories:
 - 算法
---

> 当身边不断在变化，学习的重要性就更突出


## 第一题 二维数组中的查找

:::tip
在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
[
  [1,2,8,9],
  [2,4,9,12],
  [4,7,10,13],
  [6,8,11,15]
]
给定 target = 7，返回 true。

给定 target = 3，返回 false。
:::

#### 题解

> 遍历数组中的所有元素，找到是否存在。

#### 解法

1. some解法

``` js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 * 
 * @param target int整型 
 * @param array int整型二维数组 
 * @return bool布尔型
 */
export function Find(target: number, array: number[][]): boolean {
    return array.some(arr => arr.includes(target))
}
```

2. while 解法

``` js
export function Find(target: number, array: number[][]): boolean {
  const row = array.length
  const colunm = array[0].length
  let i = row - 1
  let j = 0
  while(j < colunm && i >= 0) {
    if(target === array[i][j]) return true
    if(target > array[i][j]) j++
    if(target < array[i][j]) i--
  }
  return false
}
```

3. foreach 解法

``` js
export function Find(target: number, array: number[][]): boolean {
  let result = false
  array.forEach((n) => {
    n.forEach(s => {
      if (s === target) result = true
    })
  })
  return result
}
```

4. 暴力解法

```js
export function Find(target: number, array: number[][]): boolean {
    // write code here
    const n = array.length;
    let w = n, h = n;
    for(let i = 0; i<h; i+=1){
        for(let j = 0; j<w; j+=1){
            let cur = array[i][j];
            if (cur === target){
                return true;
            }
            if (cur > target){
                w = j;
            }
        }
    }
    return false;
}
```


## 第二题 替换空格

:::tip
请实现一个函数，将一个字符串中的每个空格替换成“%20”。例如，当字符串为We Are Happy.则经过替换之后的字符串为We%20Are%20Happy。

输入："We Are Happy"
返回值："We%20Are%20Happy"
:::

#### 题解

> 遍历数组中的所有元素，找到空格，对应做替换。

#### 解法

1. replace正则解法

``` js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 
 * @param s string字符串 
 * @return string字符串
 */
function replaceSpace( s ) {
  // write code here
  return s.replace(/ /g, '%20')
}
module.exports = {
  replaceSpace : replaceSpace
};
```

2. split join解法

``` js
function replaceSpace( s ) {
  return s.split(" ").join("%20")
}
module.exports = {
  replaceSpace : replaceSpace
};
```

## 第三题 从尾到头打印链表

:::tip
输入一个链表，按链表从尾到头的顺序返回一个ArrayList。

输入：{67,0,24,58}
返回值：[58,24,0,67]
:::

#### 题解

> 遍历链表，重新将元素放入数组，从尾到头排序

#### 解法

1. while unshift 解法

``` js
/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
function printListFromTailToHead(head)
{
    // write code here
    let list = []
    while(head) {
        list.unshift(head.val)
        head = head.next
    }
    return list
}
module.exports = {
    printListFromTailToHead : printListFromTailToHead
};
```

## 第四题 重建二叉树

:::tip
输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回。

输入：[1,2,3,4,5,6,7],[3,2,4,1,6,5,7]
返回值：{1,2,5,3,4,6,7}
:::


## 第五题 用两个栈实现队列

:::tip
用两个栈来实现一个队列，完成队列的Push和Pop操作。 队列中的元素为int类型。
:::

#### 题解

> 实现队列的Push和Pop操作

#### 解法

1. 解法

``` js
let arrList = []
function push(node)
{
    // write code here
    arrList.push(node)
    return arrList;
}
function pop()
{
    // write code here
    return arrList.shift()
}
module.exports = {
    push : push,
    pop : pop
};
```


## 第六题 旋转数组的最小数字

:::tip
把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
输入一个非递减排序的数组的一个旋转，输出旋转数组的最小元素。
NOTE：给出的所有元素都大于0，若数组大小为0，请返回0。

输入：[3,4,5,1,2]
返回值：1
:::

#### 题解

> 旋转数组，查找最小数据

#### 解法

1. sort 解法

``` js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 * 
 * @param rotateArray int整型一维数组 
 * @return int整型
 */
export function minNumberInRotateArray(rotateArray: number[]): number {
    // write code here
    let result = 0
    if (rotateArray.length > 0) {
        let list = rotateArray.sort(function(a,b){return a>b?1:-1})
        result = list[0]
    }
    return result
}
```

2. while 解法

``` js
export function minNumberInRotateArray(rotateArray: number[]): number {
    if (!rotateArray.length) {
    return 0
  }

  let i = 0
  let j = rotateArray.length - 1
  while (i < j) {
    if (rotateArray[i] < rotateArray[j]) {
      return rotateArray[i]
    }
    let k = Math.floor((i + j) / 2)
    if (rotateArray[k] > rotateArray[i]) {
      i = k + 1
    }
    else if (rotateArray[k] < rotateArray[j]) {
      j = k
    }
    else {
      i++
    }
  }
  return rotateArray[i]
}
```

## 第七题 斐波那契数列

:::tip
大家都知道斐波那契数列，现在要求输入一个整数n，请你输出斐波那契数列的第n项（从0开始，第0项为0，第1项是1）

输入：4
返回值：3
:::

#### 题解

> 数组从第三个数开始，下一个数是前两个数的和

#### 解法

1. for 解法

``` js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 * 
 * @param n int整型 
 * @return int整型
 */
export function Fibonacci(n: number): number {
    // write code here
    if(n === 0 || n === 1) {
        return n
    }
    let a:number = 0
    let b:number = 1
    let c:number = 0
    for (let i = 2; i <= n; i++) {
        c = a + b
        a = b
        b = c
    }
    return c
}
```

## 第八题 跳台阶

:::tip
一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法（先后次序不同算不同的结果）。

输入：5
返回值：8
:::

#### 题解

> 思路：跳n级台阶相当于n-1和n-2级台阶的和原因：n级台阶就相当于n-1级再跳一次一阶的和n-2级再跳一次2阶的 语言：javascript： function jumpFloor(number) { //这里写的越高递归的时候调用栈就越小，但是越多的话，多写的那部分效果就越打折扣。好比是消除

> 本题解法和斐波那契数列一样，当前数据是前两个数据之和

#### 解法

1. for 解法

``` js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 * 
 * @param number int整型 
 * @return int整型
 */
export function jumpFloor(number: number): number {
    // write code here
    let jump:any = []
    jump[0] = 1
    jump[1] = 1
    for (let i = 2; i <= number; i++) {
        jump[i] = jump[i -1] + jump[i - 2]
    }
    return jump[number]
}
```

2. while解法

```js
export function jumpFloor(number: number): number {
    const dp = [0, 1, 2]
    if(number <= 2) return dp[number];
    let i = 3
    while(i <= number) {
        dp[i] = dp[i - 1] + dp[i - 2]
        i++
    }
    return dp[number]
}
```


## 第九题 跳台阶进阶

:::tip
一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。

输入：5
返回值：16
:::

#### 题解

> 思路：这个属于跳台阶进阶，是多少台阶就是2（n-1）次方

> Math.pow(x, y) 方法结果为：x的y次幂

#### 解法

1. for 解法

``` js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 * 
 * @param number int整型 
 * @return int整型
 */
export function jumpFloorII(number: number): number {
    // write code here
    if (number === 0) return 0
    return Math.pow(2,number - 1);
}
```

## 第十题 矩形覆盖

:::tip
我们可以用2*1的小矩形横着或者竖着去覆盖更大的矩形。请问用n个2*1的小矩形无重叠地覆盖一个2*n的大矩形，从同一个方向看总共有多少种不同的方法？

比如n=3时，2*3的矩形块有3种不同的覆盖方法(从同一个方向看)：

输入：0
返回值：0

输入：1
返回值：1

输入：4
返回值：5

输入：5
返回值：8
:::

#### 题解

> 思路：属于斐波那契数列范畴，在数据大于3的时候开始

#### 解法

1. for 解法

``` js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 * 
 * @param number int整型 
 * @return int整型
 */
export function rectCover(number: number): number {
    // write code here
    let list:any = []
    list[0] = 0
    list[1] = 1
    list[2] = 2
    for (let i = 3; i <= number; i++) {
      list[i] = list[i-1] + list[i -2]
    }
    return list[number]
}
```

2. while 解法

```js
export function rectCover(number: number): number {
    // write code here
    if(number <=3) return number;
    let a = 1;
    let b = 2;
    let c;
    let i = 2;
    while(i<number) {
      c = a+b;
      a = b;
      b = c;
      i++;
    }
    return c;
}
```