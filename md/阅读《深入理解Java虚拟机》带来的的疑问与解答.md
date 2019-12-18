title: 阅读《深入理解Java虚拟机》带来的的疑问与解答
date: 2017/01/24 16:29:54
updated: 2017/02/04 11:17:05
categories:
- 技术
---
### 1.JVM参数中 xms xmx到底是指整个内存区，还是指堆区？
解：堆区。如你所见，如果native中申请内存过多也会使app发生OOM，因为native申请内存在native heap，java则是在dalvik heap。
### 2.DVM和JVM最大的区别是什么?
DVM跟JVM很多方面类似，但是DVM是基于寄存器，JVM是基于栈的。这是最大的设计区别，另外的区别就是：DVM的字节码是dex,JVM是class。
打包时：
```
JAVA编译器: java    ->  .class  ->  .jar    ->  war/ear(包含其他资源)
安卓编译器: java    ->  .class  ->  .dex    ->  .apk(包含其他资源)
```

### 3.dex文件比jar的优势在哪里?
解:移除多余的类,减少类加载时的内存消耗。
### 4.ART虚拟机作为dalvik虚拟机的升级版本，为何导致安装变慢了？
解：老的dalvik已经不再维护了，他在安装时，直接从apk中解包拿到dex文件就可以执行了，dalvik还在使用JIT技术来加快java执行的速度，始终不如C语言,C语言build生成的字节码就是机器码，所以速度更快，所以ART虚拟机放弃使用JIT方案，ART虚拟机从apk中解包得到dex文件之后还要再把dex文件转成本地机器码，模仿C语言的做法让java可以更快更高更强，所以ART虚拟机比dalvik多执行了一步过程就变慢了。
上面有个打包时，把ART也加进来对比。
# 
安装过程：
```
JVM     :war/ear->jar   --------->  bytecode(class)
dalvik  :apk->dex       --dexopt->  bytecode(odex)
ART     :apk->dex       --------->  machinecode
```

### 5.ART虚拟机作为dalvik虚拟机的升级版本，为何运行更快了？
所有JVM执行时都需要machinecode，而上面说了，这里ART直接就拿到了machinecode.
Java字节码的执行有两种方式： 
通常采用的是第二种方法或者两种配合，DVM直接就是采用第一种。

> - 即时编译方式(JIT)：解释器先将字节码编译成机器码，然后再执行该机器码。 
> - 解释执行方式(暂且称为JT)：解释器通过每次解释并执行一小段代码来完成Java字节码程序的所有操作。 

三种虚拟机，启动到运行：
```
JVM     :   bytecod --JT--->    启动生成machinecode             -> run machinecode
dalvik  :   bytecode(启动啥也不做)  -JIT运行时生成machinecode   -> run machinecode
ART     :   machinecode(启动啥也不做)                           -> run machinecode
```


### 6.dvm采用的GC算法是什么?
解:复制和标记清除算法,《深入理解Java虚拟机》中指出：目前常见的jvm版本都会采用多种GC算法配合使用，以达到更好的GC算法效果。