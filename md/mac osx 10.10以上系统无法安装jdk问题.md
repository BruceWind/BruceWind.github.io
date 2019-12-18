title: mac osx 10.10以上系统无法安装jdk问题
date: 2015/12/01 23:01:14
updated: 2016/01/14 00:20:22
categories:
- 技术
---

首先你得明白需要安装什么，这些东西有什么用。

在mac 上配置 android sdk 环境需要jre jdk  android sdk 这三个东西。
###1. jre这个东西是做什么的？
    jre是java运行库。一些java文件的运行需要这个程序的支持。运行java程序必须这个东西。就像win下的一些程序的运行需要依赖 vc++ 运行库一样。
###2. jdk是做什么的？
    jdk是java开发用的，做java开发必须这个程序。
###3. androi sdk这个是做什么的？
    同上，不做赘述。


## 
本文主要讲的是mac下安装jre jdk上出现的问题。
# 
## 先说一下jre安装遇到的问题。

当然从官网下载最新的jre特么也是有问题的，他会请求一个网页，然后由于网页不在国内所以就很难请求下来，或许我家是长城宽带吧。遇到这个问题可以先断网，再安装，就不会出现这么恶心的问题了。或者fanqiang后再尝试。
# 
后来我就去邪恶的百度软件中心，下载一个旧版的jre就行了。 jre8 40版本的jre即可。
# 
## 再说下安装JDK遇到的问题
从java官网下载的jdk 8 的镜像文件，
![](assets/5689cefdab64415a2600091e.PNG)

安装之后提示：
    
    您的系统具有 Mac OS X 版本           10.10.5。此产品可安装在版本 10.7.3 或更高版本上。有关详细信息, 请访问 java.com/help。
![](assets/5689cefcab64415a2600091a.PNG)


> 之后发现appstore的一篇帖子：
https://support.apple.com/kb/DL1572?locale=zh_CN
责任可能都在苹果身上。
下载后安装即可。

![](assets/5689cefdab64415a2600091c.PNG)

我的系统是10.10.5的系统版本。


# 
之后还是发现 这个Apple提供的时2015版本的1.6的jdk，做android开发还是有问题，我日。
# 
最后我到这个网址下载了一个可用的jdk8_45的版本。
http://download.csdn.net/download/tan3739/8840461
安装后， -version就可以了。

>  PS: g radle构建的时候需要下载一堆的文件，Gradle的zip包，这个可以使用手动下载来解决，但是其他的一些idea需要的gradle的插件的jar文件依旧需要下载，还有jcenter。我租房子的地方是长城宽带，太垃圾了，fanqiang依旧不行，我用linux开发的时候，必须把硬盘拆下来放到我的硬盘盒里，带到公司去fanqiang下载gradle才行。gradle下载不起来，打开jre安装的东西也一直显示正在加载中，这特么宽带运营商不在国外建立足够多的私有CDN节点的话，我们就会一直这样慢下去。这是在拖慢中国技术的发展。
