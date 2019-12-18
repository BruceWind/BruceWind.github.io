title: android项目中尝试使用Lambda
date: 2016/08/07 00:52:10
updated: 2016/08/11 10:41:34
categories:
- 技术
---
# android项目中尝试使用Lambda
---------
    
    最近一直在忙，也没空学习新的东西，然后公司需求又紧，所以就很久都没有更新博客，也没有在公众号上发新文章了。这个周末没有事情，就学习点东西来着。RxJava一直在看在写demo没有导入到项目中来。就在熟悉RxJava的时候发现这个好东西，所以觉得需要试试，发现用起来还比较简单，对于大项目而言，很大程度上可以降低代码行数。

## Lambda出现的意义和背景
先看两个不同风格的代码：

``` java
public void func(Student stu)
{
    if(stu!=null)
    {
        //opt
        //opt
        //opt
    }

}


public void func(Student stu)
{
    if(stu==null)
        return;
    
    //opt
    //opt
    //opt
}

```

老司机往往都是下面这个代码，为什么呢？是为了避免代码的缩进，增加代码的易读性。但是涉及到匿名内部类和interface就难以解决换行缩紧的问题了。
# 
我是做安卓开发，那么，我就拿安卓的代码例子来说。
``` java

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d("XX","click");
            }
        });


        //使用lambda
        btn.setOnClickListener(e -> Log.d("XX","click"));
        
```
很明显这个代码在上面是6行代码，而使用了lambda只有1行代码，代码的精简和易读性是非常的赞。
#  
### 当然，你肯定说你这里onClick只有一行，如果多行代码怎么处理？
```
//只需要增加两个括号
view.setOnClickListener(e -> {
                    Log.d("XX", "click1");
                    Log.d("XX", "click2");
                }
        );
```
------
## Lambda出现的背景

1.匿名内部类
2.Interface函数

解决这两种代码使用时缩紧降低易读性的问题。

---------
## 解决低版本android兼容lambda语法问题
目前只有Android N自带了java 8，而lambda又是java 8 中才出现的，低版本的android大多是java 6，只有5.0才是java7。兼容是个大问题。
两种方案：
1.谷歌官方给出的答案是使用jack工具链
    
    问题在于这个方案，兼容性和使用难度都比较大，问题比较多，所以基本放弃。

2.借助第三方实现。

    目前业内用的第三方插件大多是**retrolambda**。

详细教程retrolambda 的github上有说明的，这里我就再废话说一遍吧。
1.首先安装jdk 8
2.修改gradle 
```

buildscript {
  repositories {
     mavenCentral()
  }

  dependencies {
     classpath 'me.tatarka:gradle-retrolambda:3.2.5'
     //目前最新版是3.2.5
  }
}


apply plugin: 'com.android.application' 
apply plugin: 'me.tatarka.retrolambda'
```

3.修改language level
```
android {
  compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }
}

```
4.解决混淆问题
```
-dontwarn java.lang.invoke.* 
```


## 使用中的一些例子

上面有个runnable的例子，listener的例子，下面来个复杂点的listener例子。
```

list.setOnItemClickListener((parent,view,position,id)->{
	//opt
});
//或者
list.setOnItemClickListener((AdapterView<?> parent, View view, int position, long id)->{
	//opt
});

```


复杂使用内部类
```
     // 使用内部类排序
     Collections.sort(personList, new Comparator<Person>(){
       public int compare(Person p1, Person p2){
         return p1.getSurName().compareTo(p2.getSurName());
       }
     });
     
     
     // 使用Lambda
     
     Collections.sort(personList, (Person p1, Person p2) -> p1.getSurName().compareTo(p2.getSurName()));
     
     
     // 或者更佳简洁地使用Lambda
     
     Collections.sort(personList, (p1, p2) -> p1.getSurName().compareTo(p2.getSurName()));

```
其中` (Person p1, Person p2)`是指明了Comparator类的一个多参数方法。
后面我也免去了Person类，这种代码里免去了类型，适用于没有重载两个参数的类。
# 
**更多例子-> [点我跳转](http://jobar.iteye.com/blog/2023477)**

## 开发中遇到的问题

1.Error:(25, 25) Gradle: 错误: -source 1.6 中不支持 lambda 表达式
(请使用 -source 8 或更高版本以启用 lambda 表达式)

    解决：忘记修改javaVersion版本1_6 改为1_8
    
```
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_6
        targetCompatibility JavaVersion.VERSION_1_6
    }

```

2.找不到id 'me.tatarka.retrolambda' 或者 找不到 classpath()
`classpath 'me.tatarka:gradle-retrolambda:3.2.5'`这行代码不是要写到 android dependencies 下面，而是 android buildscript dependencies下面。


3.找不到JAVA8_HOME环境变量
```
    Execution failed for task ':app:compileDevReleaseJavaWithJavac'.
> When running gradle with java 5, 6 or 7, you must set the path to jdk8, either with property retrolambda.jdk or environment variable JAVA8_HOME
```
这个retrolambda无法知道我当前的java版本，明显我是java8 他居然不能直接用我当前的java版本，非要我添加JAVA8_HOME环境变量。所以，这里手动添加下环境变量就好了。

4.大范围使用lambda容易导致团队中其他成员看不懂代码

    确实使用lambda可以减少一些代码，但是减少了不一定意味着易读性增加了，runnable interfece可以使用lambda，一些大家司空见惯的东西都一下能想的起来。


PS:有人说，无法调试问题，这个目前测试没有发现不能调试。


# 
----------
参考文档:
    https://developer.android.com/preview/j8-jack.html
    https://github.com/evant/gradle-retrolambda
    https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html
    http://jobar.iteye.com/blog/2023477