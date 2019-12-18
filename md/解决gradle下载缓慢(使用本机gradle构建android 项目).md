title: 解决gradle下载缓慢(使用本机gradle构建android 项目)
date: 2016/03/05 23:37:38
updated: 2016/03/06 09:13:18
categories:
- 技术
---
屌丝用户使用房东的长城宽带！！！就算fanqiang下载gradle依旧很卡，浏览器下载一样是很慢的，几十KB。
长城宽带是使用电信的网络，电信在国外的网络节点又很少给长城使用，导致最终的结果就是慢成狗。
# 
## 1.本机安装gradle
先下载gradle的zip文件，下载好了解压出来到任意一个位置，然后再配置环境变量。
设置环境变量：
我是mac 我需要这样子来配置，在终端输入以管理员的权限打开.bash_profile文件命令：
```sudo vim ~/.bash_profile```

    GRADE_HOME=/..../gradle2.2.1;
     export GRADE_HOME
     export PATH=/opt/local/bin:/opt/local/sbin:$PATH:$GRADE_HOME/bin

保存.bash_profile文件后执行source ~/.bash_profile

查看gradle是否配置成功命令：gradle -version，若成功输出gradle版本的一些东西。
# 
## 2.直接进入到项目主目录下面进行编译，使用命令```gradle build```来编译。

![](assets/56db0342ab64417fb10048fe)
编译过程会和as一致，自动下载jcenter的东西而且这里编译会和as或者idea中编译报错的结果一致。
比如我的编译报错:

``` php

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':app'.
> A problem occurred configuring project ':library'.
   > failed to find target with hash string 'android-19' in: /Users/wei/Documents/development/adt-bundle-mac-x86_64-20140702/sdk
   
```
我这里就需要更新我的sdk，新公司的项目引用的依赖项目太多了，有个依赖项目就需要依赖android 19，这里我就需要更新的我的sdk。

## 3.不习惯用命令
好的，您是真难伺候，我从百度网盘搜索好了下载，你保存到项目根目录,/project/gradle/wrapper下,
并且修改**gradle-wrapper.properties**文件。
```distributionUrl=gradle-2.2.1-all.zip```
之后就可以在idea 或者as 中rebuild一下即可。这里就可以跳过下载gradle的过程，继续下载依赖的jcenter代码库了。


