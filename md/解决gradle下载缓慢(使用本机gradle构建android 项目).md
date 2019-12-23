title: 解决gradle下载缓慢
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
推荐使用别名加如到**~/.bashrc**最后一行，这样子当你需要下载各种东西的时候都非常方便。
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

# 

### 2.懒得配置环境，保存到项目根目录进行编译
你保存到当前project根目录,/project/gradle/wrapper下,
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
        maven { url 'https://maven.aliyun.com/repository/spring/'}
        mavenLocal()
        mavenCentral()
    }
}
//这里没有google的镜像，主要google在我这边测试速度还挺快，应该他们自己弄了国内的节点。
```


