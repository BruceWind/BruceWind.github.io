title: Java代码动态插桩
date: 2017/03/23 20:26:54
updated: 2017/05/19 12:24:43
categories:
- 技术
---
代码插桩方案有n种，就不一一细说。说下常用的几种。

## 1.利用动态代理InvocationHandler

我动手写了个例子，这个类的目的是让方法执行之前，打印每个方法的方法名和参数，因为我老是遇到类似需求，需要我打印一个观察者的所有的方法的执行日志。

``` java

/**
 * =======让类的每个方法都执行时打印日志========
 * demo:
 *
 *  SMObserver mSMObserver = new SMObserver();
 *  SMObserverInterface me=(SMObserverInterface)MethodDynamicLogger.generatorInterface(mSMObserver);
 *  me.something();
 );
 */
public class MethodDynamicLogger implements InvocationHandler {

    Object mObject;
    CoreLogger mCoreLogger;//使用CoreLogger 在release版本跳过 打印日志
    public MethodDynamicLogger(Object obj) {
        mObject = obj;
        String tag =" "+mObject.getClass().getSimpleName()+"-->";
        mCoreLogger=CoreLogger.getLogger(tag);
    }


    @Override
    public Object invoke(Object o, Method method, Object[] args) throws Throwable {
        StringBuilder builder=new StringBuilder(method.getName()+"(");

        if(args!=null)
        {
            Iterator<Object> iterator= Arrays.asList(args).iterator();
            while (iterator.hasNext())
            {
                builder.append(iterator.next()+"");
                if(iterator.hasNext()) {
                    builder.append(" , ");
                }
            }
        }
        builder.append(")");

        mCoreLogger.d(builder.toString());
        method.invoke(mObject, args);
        return null;
    }

    private Object generator()
    {
        return Proxy.newProxyInstance(
                mObject.getClass().getClassLoader(),
                mObject.getClass().getInterfaces(),
                this
        );
    }


    public static Object generatorInterface(Object obj)
    {
        return new MethodDynamicLogger(obj).generator();
    }
}

```

这里SMObserverInterface 是一个interface，SMObserver是一个类，SMObserver只要implement这个interface，我就可以实现代码插桩，就用这个代理去绑定了observer的每个方法，在每个方法执行之前打印方法名和参数。
这种方案比较适用于类的初始化由自己控制的，是自己给自己的代码插桩。

## 2.编译时生成

其实我的github上有个项目：[GeneratorX](https://github.com/BruceWind/GeneratorX),就是利用编译时生成，我是利用java的编译时生成。

这种方案其实在butterknife上也在使用。你只是简单写了一个注解，然后butterknife利用JAVA的AbstractProcessor类实现生成代码，把findview和setOnClick事件的代码帮你插入到代码里。


## 3.修改字节码
我写了个修改字节码的demo挂在github上。[https://github.com/BruceWind/Jar_Hook](https://github.com/BruceWind/Jar_Hook)


``` java
//jar包中的代码：
package com.androidyuan;

public class Hello {
    public Hello() {
    }

    public static void sayHello(String name) {//被hook的方法
    }
}
```

在sayHello方法里插入了`MainActivity.hookXM(String name);`.
```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ...
        ...
        Hello.sayHello("hello");
    }

    public static void hookXM(String name) {//插入执行这行代码
        Log.i("hookXM", "hello av8d,im "+name+".");
    }
}
```
*执行效果请run起来看日志。*

### 目前实现原理

利用修改字节码技术，[hibeaver](https://github.com/BryanSharp/hibeaver)是ASM基于gradle的一种包装方案，核心原理在于ASM框架。

~~《ASM从入门到放弃》~~ 
~~太长不看~~
ASM是一个老牌字节码框架。当然了，字节码操作的框架这几年有很多，只不过目前ASM是很多项目都在使用的罢了，包括kotlin也在使用。


利用ASM框架hook一个jar包内的一个方法，实现代码插桩。
目前，仅仅在编译期间hook，没有在运行时hook.

### 在运行期hook是否是一种可行性方案？

> + Dalvik:
    理论上来说运行时hook也可以，基于ASMDEX框架就好，Dalvik机器使用java字节码解释执行，运行期间也不断被自带JIT编译器修改着字节码。

> + Art:
    但是Art虚拟机之后，apk安装之后会把字节码转为跟其他C或C++同样方案的机器码，这样子以机器码加速执行的性能非常高。
    DVM是不遵守JVM规范的虚拟机。
    Art在不同的版本之间实现大大变化，最初只有AOP没有JIT，后来又加入了JIT。

**综上：**
    android平台还是老老实实的使用编译后期hook的方案吧。

## 4.专门用于代码插桩的框架
比较知名的有[BCEl](http://blog.csdn.net/yczz/article/details/14497897)，[JIAPI](http://jiapi.sourceforge.net/)。
我就不写demo了，毕竟那样太辛苦了( @_@ )，上面几种我已经写了demo了，本文的目的在于分享，不在于练代码啊！！！！  
这种东西的变种就是IDE插件，帮你用插件实现代码插桩。

# 
其实，回过头来看，java的开放，编译时生成，运行时可修改字节码，反射，使用隐藏API等等，这些东西都足以说明一个问题：代码安全性几乎是没有的，我想hack你，想让你死，我可以瞬间想到一百种致你于死地的方法，哈哈哈！！ 开玩笑。。。


