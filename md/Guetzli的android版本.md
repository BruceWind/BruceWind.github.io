title: Guetzli的android版本
date: 2017/04/23 23:40:37
updated: 2017/04/23 23:52:01
categories:
- 技术
---
guetzli确实是个好东西，以前我还想着付费tinypng，来压缩博客图片，因为我的博客图片几乎都挂在github，github确实访问有些慢。为了节省流量，加速阅读体验，一直都用tinypng压缩，那个玩意使用次数有限还要一堆python代码，确实太麻烦，我用guetzli在linux我自己配置一个软链就可以了，压缩图片超级6的。
自从有个guetzli，我实测下来发现，这个库的压缩比tinypng还要高。

众所周知，android平台压缩图片的方案用那套官方的java代码压缩你懂得，那个内存消耗是大啊！！！就算你配置option，decode只得到尺寸，然后再缩放压缩，可以节省内存但是图片变小了啊，不完美，而且很容易OOM啊！！！而且压缩是有损压缩啊！！！！ 

一个无损压缩，而且不耗内存的代码，简直是神了！！！

好了，废话说完了，我把guetzli这个烂版本，1.0版本，做了一些修改，终于移植到android平台了。
代码在此：[https://github.com/BruceWind/GuetzliAndroid](https://github.com/BruceWind/GuetzliAndroid)

欢迎Star！！！

IOS版本还在开发中。