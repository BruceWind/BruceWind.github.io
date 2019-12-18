title: 使用Facebook的Redex工具进行android app运行优化
date: 2016/04/15 10:04:47
updated: 2016/04/29 21:21:17
categories:
- 技术
---
![](assets/fb_logo.jpg)

    抱歉：我又盗了别人家的图,从网上偷了一个facebook的logo。哈哈哈！！！！好了回到正题。
    
    去年，Facebook使用叫ReDex的字节码优化工具优化了他们的安卓应用的性能.

    昨天收到消息，ReDex已经重新发布了。安卓开发者可以免费地使用这个工具优化自己的应用。也可以将它用作其它安卓字节码优化工具的基础。
    
    在Facebook工程博客的一篇文章中指出，`dex`并不是按照应用启动时候加载的顺序加载的，而是按照编译工具指定的顺序加载的。
    
    ReDex使程序运行时产生的运行数据判定哪些类应该在.DEX文件中被优先载入。“想要最小化从内存中读取数据的次数，最好从启动的时候就载入字节码。”Facebook称，他们使用ReDex对应用优化之后，对存储的读取减少了25%，运行速度提高了30%。
    关于这个速度，Facebook称，在存储较慢的老旧机器上效果非常明显，但是对于新的收集，性能也有明显的提高。
    
    Facebook在一台搭载了安卓4.4的全新的Nexus4上（有35%的安卓设备运行这个版本）测试，启动时间从2秒降至1.6秒。

    Runtime分析可以用来删除无关的元数据和接口，但是开发者也可以自定义优化的行为。比如，有些方法即使没有直接被调用，也可以让它们保留下来。

    这个优化是在应用编译完成之后进行的。也就是说，理论上你也可以结合其他优化，比如对Java进行虚拟机层的优化和语言的优化，像即将到来的Java 9的语言模块特性等等。
    优化Java的字节码文件并不是一种新技术。还有其他的开源项目，例如ProGuard就可以通过删除运行时没有使用的代码进行优化。但是它并不能像ReDex那样按照执行顺序来重新组织类。

这里值得一提的是redex这个项目，虽然facebook玩了一年了，但是github上这个项目第一次commit的日期是`Commits on Apr 7, 2016`。
不是这帮技术宅一直没开源出来，而是他们最早它是挂在[folly这个项目](https://github.com/facebook/folly)下面的。


--------------------

----------- 我是一个可爱的分割线 (⊙_⊙;)---------------

--------------------

    由于只是开放源代码，但是没有提出来做成一个软件给我们用，但是我是linux，我可以就直接下载代码make install就可以运行redex了。
## 下面是我所遇到的所有问题
# 
安装过程在[facebook的github](https://github.com/facebook/redex)上已经写的很清楚，但是linux总是各种问题你懂得，等着你去解决它。

## 报错： autoreconf: 'configure.ac' or 'configure.in' is required的解决

于是从Git上找到了这个：
Download and install double-conversion:
```
  git clone https://github.com/google/double-conversion.git
  cd double-conversion
  cmake -DBUILD_SHARED_LIBS=ON .
  make
  sudo make install
```
之后再执行　   `autoreconf -ivf`


## 报错：error: possibly undefined macro: AM_PROG_LIBTOOL       If this token and others are legitimate, please use m4_pattern_allow的解决

#

然后又从stackoverflow上找到了这个：
[How do I resolve an error about AM_PROG_LIBTOOL when building libopus from git?](http://superuser.com/questions/653172/how-do-i-resolve-an-error-about-am-prog-libtool-when-building-libopus-from-git/653173)
# 
我`install libtool`之后，终于不在报错
``` xml
...
...
parallel-tests: installing 'build-aux/test-driver'
autoreconf: Leaving directory `.'
```
# 
继续执行：
``` shell

//然后又是巴拉巴拉一堆log：
...
...
...
checking if g++ supports C++0x features without additional flags... no
checking if g++ supports C++0x features with -std=c++0x... yes
checking if g++ supports C++0x features with -std=gnu++0x... yes
checking for main in -lgflags... no
configure: error: Please install google-gflags library

```
# 
## 报错：Please install google-gflags library的解决
# 
这个问题在github上这个仓库的issues中也有提到：
https://github.com/facebook/folly/issues/117
但是这个issues并没有什么卵用：
最后还是找了这个：
http://caffe.berkeleyvision.org/install_apt.html

# 
## 报错：configure: error: Unable to find libevent

于是我用apt-cache　search了一下：libevent，
还是找到了这个:
`sudo apt-get install libevent-dev`．
就好了．


## 报错:需要的目标 gtest-1.7.0/src/gtest-all.cc

查到github issues上有人遇到跟我同样的问题：[#335](https://github.com/facebook/folly/issues/335)
说拷贝gtest代码到test/gtest下面，于是从google上搜索了一下gtest-1.7.0 找到了这个：[gtest-1.7.0d代码地址](https://github.com/m-lab/libraries/tree/master/third_party/gtest-1.7.0)
按照这个代码仓库上的，直接去下载`gtest-1.7.0.tar.gz`解压，拷贝到redex目录下的test目录下即可测试。

##  安装完成后执行redex命令时报错： Couldn't find zipalign.
这个问题实际就是连个原因
> + 打包时没有开启zip的原因
> + 第二个原因就是机器上没有配置android环境变量的问题
第一问题简单，直接
```
android {

    buildTypes {
        debug {
            zipAlignEnabled true
        }
   }
}
```
由于android IDE已经非常高明了，完全不需要配置环境变量了,所以我也一直都没有配置环境变量，这次不得不配置了，不然命令行太弱智了，找不到android 的sdk路径。

```xml
echo 'export ANDROID_HOME="'$HOME'/文档/tools/android-sdk-linux"' >> ~/.bashrc
echo 'export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"' >> ~/.bashrc
echo 'export JAVA_CMD="/home/wei/文档/tools/jdk1.7.0_76/bin/java"' >> ~/.bashrc

redex /home/wei/桌面/app.apk -o /home/wei/桌面/output.apk


echo  'export PATH="$PATH:'$HOME'/文档/tools/android-sdk-linux/build-tools/23.0.2"' >> ~/.bashrc
```
环境变量生成需要关闭终端，重新启动一个终端，重新执行redex命令即可。
# 
既然是未签名的apk，那么需要重新签名：　[google告诉我们给apk签名的方案，链接在此点我跳转。](http://developer.android.com/tools/publishing/app-signing.html#signing-manually)

     注意：facebook在github上给出了mac linux开发者的使用方式，但是windows狗没有方法使用了，so，哈哈哈！！windows狗没有春天！！！

--------------------------


