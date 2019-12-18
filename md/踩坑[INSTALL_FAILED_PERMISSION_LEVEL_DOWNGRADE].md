title: 踩坑[INSTALL_FAILED_PERMISSION_LEVEL_DOWNGRADE]
date: 2016/06/19 01:22:36
updated: 2016/07/14 22:50:47
categories:
- 技术
---
情况是这样子的：
产品反馈：从1.4版本升级到2.0,发现提示**应用未安装**。我去什么鬼！！！
当时上线时都测试了，怎么会出现呢！擦擦擦！
# 
## 按照以往的经验：
1.常见都是签名问题。
2.文件下载不完整，这种情况有的手机会显示**未安装**,有的手机显示出**解析包错误**。

# 
## 这个问题是怎么找到根源的 
其实当时确实怀疑了签名问题，so，找个apk读取签名的工具，以前用过一个叫做`Gen_signature_Android.apk`微信支付官方就有读取某个安装的应用的apk的签名文件MD5，[链接在此点我跳转](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419319167&token=&lang=zh_CN)
分别安装了两个版本，用Gen_signature工具读取每个版本的签名的md5,发现都是相同的。没什么卵用。不是签名问题。

# 
后来详细的测试，发现只有6.0的机器会发生这个情况。怪不得当时没有测试出来。
# 
## 命令安装,如果发生失败起码会给我显示失败原因

想到命令安装,如果失败起码会给我失败的原因。这会是一个好的突破点。

就用360手机助手导出了手机安装的apk包，当然我没有windows 没有手机助手，好想命令也可以导出apk，但是时间不多来不及解释了。导出之后再下载一个最新版。

先用命令尝试安装老的包
```
adb install xxx.apk
//轻松安装成功
```
然后安装新版本的。
```
adb install -r  xxx.apk
//打印如下
Faild [INSTALL_FAILED_PERMISSION_LEVEL_DOWNGRADE]
```
**DOWNGRADE**这个单词比较特别，压根就没见过。
我擦，

dict 命令翻译了一下：
```
weideAir:~ wei$ dict DOWNGRADE
###################################
#  downgrade 降级 (U: ,daʊn'ɡred E: 'daʊngreɪd; daʊn'greɪd )
#  n. 退步；下坡
#  adj. 下坡的
#  vt. 使降级（过去式downgraded，过去分词downgraded，现在分词downgrading，第三人称单数downgrades）；小看
#  adv. 下坡地
###################################
```
是降级的意思。我擦，竟然是这样子的。
查了下网上给的方案都是versioncode，仔细对比versioncode是没问题的草草草！！

公司的一位领导坐我旁边说这个“可能是跟权限有关”。
那么唯一有关的就只是targetversion，targetversion会影响app在制定版本的api的手机上的运行的效果这个倒是真的，之前就读过国内一些博客所说的targetversion的概念。

#
于是用aapt命令读取两个apk包的targetversion分别是多少。

```
aapt dump baging ***.apk
```
1.4版本是`23`，2.0是`19`。那很可能是这里的问题。
# 
重新打包测试了下,确定了是这个问题，只要修改targetversion为23之后，就可以覆盖1。4版本安装，不再报错了。

# 
只是一开始不去怀疑这点，确实是因为之前的一些项目修改这个，确实都没有发生过什么问题。现在在6.0上开始不让修改了这个消息还真不知道。

## 深沉的检讨
    4.1当时项目发一个版本发版时更改了targetversion，必须得承认这是我的错误。毋庸置疑！ 我的锅！

## 深深的甩锅给谷歌
以前也经常改这个字段，从没发生过问题。5.0降级还没有任何问题呢！官方总要给点提示吧！而且直接guge搜DOWNGRADE错误给出的答案都是versioncode。 难道因为我这里是china？？
我这里就信息封闭！！！
于是去android devrloper官方：
https://developer.android.com/guide/topics/manifest/uses-sdk-element.html
文章给了一堆的targetversion的原理的介绍。并没有写出android 6.0之后这个targetversion就不能再降级了。
我擦！！！大爷的！！！你妹啊！你可是官方啊！！！官方都不给这个坑的提示。。。你们不要拦着我，我要转IOS开发！！！

欣慰的是这个错误导致的人数并不多，当时发版本的时候市面上android 6.0的机器并不多。很难买到6.0的机器。华为算是国内最早的发布6.0 的机器的厂商了，他们发布的时候也都到了16年年初了。

# 业内到底有多少人不知道这个坑？
我平时也有订阅一些android方面的周报的习惯，一些新的技术，比如android 6.0的运行时权限很早也有关注，也写过demo。但是这个坑实在是没有发现有人写过，所以这篇博客po出来的目的就是在此，希望后人不要踩坑。

![](assets/downgrade3.png)

![](assets/downgrade4.png)

![](assets/downgrade1.png)

![](assets/downgrade2.png)
# 如上：截图时搜索并没有筛选时间，截图过了才想起来需要过滤筛选一下时间为一年内的，但是实际上筛选了一样没有搜到有说6.0手机targetversion不能降级的。
----------------
### 似乎目前没有任何博客和文章说过android 6.0不能随意的更改targetversion，那我发现了就贡献出来，这就是这片文章出现在你面前的原因。



