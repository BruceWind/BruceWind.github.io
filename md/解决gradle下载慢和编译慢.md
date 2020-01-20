title: 解决gradle下载慢和编译慢
date: 2016/03/05 23:37:38
updated: 2016/03/06 09:13:18
categories:
- 技术
---
由于各种不可描述的原因境内下载很慢。
本文是围绕gradle目录的gradle-xxxx-all.zip下载慢，和依赖的aar,jar下载慢这两块。linux或mac环境，windows用户不用看下去了。


## 一.直接代理

> + 合格大陆程序员一定要有代理，没有代理的二流程序员请跳过这部分：

### 1.命令行下所有的http(s)请求加代理（不止gradle命令）
推荐使用别名加如到**~/.bashrc**最后一行，这样子当你需要下载各种东西的时候用别名代替输入这行字符串非常方便。
```
alias proxyterminal='export http_proxy=http://127.0.0.1:1080;export https_proxy=http://127.0.0.1:1080;'
```
### 2.给gradle命令编译配置独立的http代理：
编辑**~/.gradle/gradle.properties**:

```
//cat ~/.gradle/gradle.properties
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=1080

systemProp.https.proxyPort=1080
systemProp.https.proxyHost=127.0.0.1

systemProp.http.nonProxyHosts=*.cn|localhost|*.aliyun.com|172.*|10.23*|192.168*
systemProp.https.nonProxyHosts=*.cn|localhost|*.aliyun.com|172.*|10.23*|192.168*
```
你项目根目录的配置文件**gradle.properties**也可以拷贝这个进行配置。


# 二.下载和配置gradle-xxxx-all.zip(无代理)：
###1.下载 
首先使用多线程下载解决您从国内下载缓慢的问题,你可以用各种多线程下载器进行下载，或者找国内的别人下载好上传多国内服务器的文件。


# 

### 2.本机配置gradle环境
拿到这个gradle的zip文件，下载好了解压出来到任意一个位置，然后再配置环境变量。
设置环境变量：
我是mac我需要这样子来配置，在终端输入以管理员的权限打开.bash_profile文件命令：
```sudo vim ~/.bash_profile```

    GRADE_HOME=/..../gradle2.2.1;
     export GRADE_HOME
     export PATH=/opt/local/bin:/opt/local/sbin:$PATH:$GRADE_HOME/bin

保存.bash_profile文件后执行source ~/.bash_profile

查看gradle是否配置成功命令：gradle -version，若成功输出gradle版本的一些东西。

还有个方案：
下载好丢到~/.gradle/wrapper/dists这个目录里，再重启as，或者命令行重新编译。
# 

### 3.懒得配置环境，保存到项目根目录进行编译
你保存到当前project根目录,/project/gradle/wrapper/下,
并且修改**gradle-wrapper.properties**文件。
```distributionUrl=gradle-2.2.1-all.zip```
之后就可以在idea或者as中rebuild一下即可。这里就可以跳过下载gradle的过程，继续下载依赖的jcenter代码库了。

# 三.解决依赖的aar,jar下载慢(无代理)

### 1.依赖的aar,jar等下载缓慢时走国内镜像：

```
//该方案不能解决所有依赖，可能当前仓库部分的依赖是aliyun里没有的。
allProjects {
    repositories {
		maven { url 'https://maven.aliyun.com/repository/public/' }
        maven { url 'https://maven.aliyun.com/repository/google/'}
        maven { url 'https://maven.aliyun.com/repository/jcenter/'}

        mavenLocal()
        mavenCentral()
    }
}
//这里没有google的镜像，主要google在我这边测试速度还挺快，应该他们自己弄了国内的节点。
```

gradle开启multidex之后构建缓慢问题
-------

项目越来越大，导入各种第三方的包，导致项目java方法数很轻松超过64K，那么gradle构建就会轻易的进入到一种很蛋疼的境地，直接报错  `/user/jdk/bin/.....  exit 2.`
那么解决方案只有一个就是 开启mutidex，multidex就会带来构建缓慢的问题。
就算我们开发本机有jcenter，maven库和gradle缓存，依旧是构建很慢。
# 
找到的一些解决构建速度问题的方法。如下：

## 1.可以考虑增加 studio.vmoptions 中内存设置

使用idea或者as开发,可以到编译器所在的主目录下搜索*.vmoptions 文件,可能会搜索到两个文件.  一个32位的一个6x64的，打开那个文件修改'-Xmx....'，  这个是最大申请内存限制的配置，配置之后，重启下 IDE。

## 2. 使用最新版本gradle

如果你还在使用2.4 版本的gradle,那么请赶紧更新到2.7。这个版本build较快。
> PS:制定gradle版本号为2.2 或者2.0,不要是2.+这种不固定的,防止忽然更新版本.



## ３.请更改minsdkversion 版本 和ssd
首先必须保证 SSD 和通畅的网络环境；
ssd主要是解决构建大量的IO的问题。

其次可以考虑增加 studio.vmoptions 中内存设置；
如果是大项目 (multidex) 编译慢我知道一招，Gradle 中添加
```
    defaultConfig {
        ......
        if (gradle.startParameter.taskNames.contains(":app:assembleDebug")) {
            minSdkVersion 21
        }else{
            minSdkVersion 18
        }
    }
```
minSdkVersion 设置为 Android API 级别 21 的调试应用。这些设置会使 Android Gradle 插件执行以下操作：

> + 每个子模块构建为单独的dex文件。不再做合并操作。因此可以避免为确定主 dex 文件的内容而进行长时间的计算。
> + 将每个 dex 文件加入 APK 时不做任何修改。

不过这个方案的弊端就是：
如果开发机 SDKVersion 没到 21 就跑不起来了；
如果用不到 multidex 还觉得编译慢请升级机器；
# 
用了这个之后，就在18s左右了。已经跟ios编译速度相等了。
这个方案后来还是没有使用，在全民TV，公司给研发同学的机器依旧有一半是低于5.0的设备，没办法，部分研发调试都无法用了，很蛋疼。不使用这个功能，其他的都配置了，编译速度从2分钟降到50s左右了，总之不是很理想。


## 4.加大javaheap内存限制  （要求开发的电脑内存要大于4G）
```
    dexOptions {//解决构建缓慢问题
        javaMaxHeapSize "4g" //当然可以更大 
    }
```

## 5.修改默认配置 (改善命令行编译)
在gradle 目录下“创建 `gradle.properties`文件，gradle目录在
`
/home/<username>/.gradle/ (Linux)
/Users/<username>/.gradle/ (Mac)
C:\Users\<username>\.gradle (Windows)
`
文件内写：
`
org.gradle.daemon=true //进程守护
org.gradle.parallel=true
`

## 6.使用官方gradle提供的分析工具
官方耗时分析工具,可以帮忙分析耗时的位置,
```
./gradlew --profile --recompile-scripts --offline --rerun-tasks assembleDebug
//只分析debug模式下的情况.
```

```
导出的HTMl的部分内容:
Profile report
Profiled build: assembleDebug

Started on: 2017/03/23 - 12:35:47

Summary
Configuration
Dependency Resolution
Task Execution
Description	Duration
Total Build Time	1m18.44s
Startup	1.361s
Settings and BuildSrc	0.496s
Loading Projects	0.205s
Configuring Projects	5.912s
Task Execution	2m29.34s
```

## 7.修改gradle所在虚拟机的xmx参数

gradle-wrapper.properties
```  
# 修改gradle所在JVM的xmx参数,但是生效需要 重启 gradle
org.gradle.jvmargs = -Xmx2048m
```

一些较大的项目可能会受益于更大的Gradle堆大小。但是，如果使用低内存计算机，则可能需要将IDE配置为使用更少的内存。要了解如何更改分配给IDE和Gradle的资源数量会影响构建性能，请转到关于概要分析构建的部分。

注意：如果Gradle守护程序已经运行，则需要在使用新设置进行初始化之前停止该进程。您可以通过选择View> Tool Windows> Terminal终止并输入以下命令来终止Gradle守护程序：gradlew --stop。

## 8.忽略配置直接命令行编译
```
./gradlew assembleDebug  -x lint  --parallel --max-workers=6   -PminSdk=21
```


## 9.解决由开启了multidex带来的app性能下降的问题


前面说了一些编译器的问题解决，但是终究apk的性能问题还是丢在这里没人过问
使用TurboDex

    摘录自turbodex
众所周知,Android中在Runtime加载一个 未优化的Dex文件 (尤其在 ART 模式)需要花费 很长的时间. 当你在App中使用 MultiDex 或 插件化框架 的时候, 这个问题就会显得十分严重.

TurboDex 就是为了解决这一问题而生, 就像是给AndroidVM开启了上帝模式, 在引入TurboDex后, 无论你加载了多大的Dex文件,都可以在毫秒级别内完成.

    TurboDex 的使用始终是好的，就算你的项目构建没有开启multidex也是可以使用的。

公司给我配的是高配Thinkpad, 固态盘，i7处理器，8G ram。之前是1分50秒降到50秒以内的构建速度。更改如上这些东西之后，是50秒以内。同事的mac本子要比我的linux还快几秒。

    编译的速度本来知识一个舒服不舒服的问题，不影响开发的。但是，遇到一点不舒服，都不要妥协，总有方案，让你很舒服的开发。用心去研究，努力去找方案，终究你可以自豪的地说，一个很大的项目，构建速度也一样不输ios的构建速度。

