title: Android完美实现截屏
date: 2016/12/04 18:26:29
updated: 2018/04/24 17:55:33
categories:
- 技术
---
很多app都有截屏的需求，当你遇到产品经理给你提出这个需求时，你搜索了一下：
1.取View的cacheDrawable 来实现截屏，这种方案，没有兼容性问题，但是缺点有两个：

> - 不能截状态栏
> - 遇到SurfaceView没辙，surfaceview需要用mediaplay手动取一帧buffer才行。
> - 不能在后台serivce中使用，因为主要依托于view。 

2.java代run一个 adb 命令截屏。
> - 需要root。

# 
我们之前也有这个需求，这个需求后来分给另外一个人做，当时他给我的答复就是这样子，这个我当时也是这么想的，毕竟以前调研过这个功能。
然后，我想想，好像我记得5.0以后可以直接录制屏幕为视频的，觉得这个还是自己搜索一下吧。

于是乎，我就搜索了一下，发现android 5.0以后开放了录屏API，那么所有的5.0以后的机器都应该取视频中的一帧数据，这样子我就可以实现截屏了。
这种方式的优点：
> - 可以后台，不单单只能自己的app里面的页面，还可以截别人的app。
> - 可以截状态栏了。

缺点：
> - 无法兼容5.0之前机器，这点可以不用太在意。

> - 需要一个先弹窗让用户允许。

    5.0以前的机器，我们全民TV的用户统计数据显示，有30%，但是从运营角度考虑 觉得这些用户都可以抛弃，就像多年之前我们做开发还从2.2开始兼容一样，那些用户的使用频率，花费欲望都很低，等于僵尸粉。

那么，我们就用这个API实现吧！

## 说说实现
原理比较简单，启动5.0的屏幕捕捉，使用`MediaProjection`和`ImageReader`创建一个虚拟桌面，将捕捉的数据传递到虚拟桌面，然后使用ImageReader取虚拟桌面的一帧画面。
`VirtualDisplay`这个类在android.hardware这个包下面，很明显这个是需要硬件支持。

## 来不及解释了，上代码。
这个代码我挂在github：[https://github.com/BruceWind/AndroidScreenShot_SysApi](https://github.com/BruceWind/AndroidScreenShot_SysApi)

