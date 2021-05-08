title: 播放直播流过程中逐渐延迟问题解决
date: 2021/05/07 01:24:01
updated: 2021/05/07 22:52:11
categories:
- 技术
---

## 延迟分两种
1. 编码耗时和传输距离长导致的延迟，这是物理层面问题，一般不可解决，这也是软件层面能做到的最小的延迟。
2. 因网络波动问题导致的等待，进而逐渐变得延迟时间更长。编码端网络或CDN/播放设备网络波动问题导致buffer加载等待，进而导致延迟。

> 本文说的就是第二点。

### Solution.
通过获取offset再进行`丢帧、追帧`方案来解决。

## **Offset如何判断：**

如何获取offset就成了一个很复杂的事情，直播流编码时的每个画面，会被拆解为多个NAL单元，多数的单元是有时间戳的。
获取到第一个有时间戳的NAL时，去跟本地时间对比取第一个差值，之后的每个NAL都去对比本地时间取个差值，两个差值的差值就是offset。

**追帧丢帧的具体是现实什么？**

丢帧就是丢弃一些帧直接顺着直播流向后请求，拉到最后一个关键帧，该关键帧之前的开始丢弃不被渲染。
追帧就是开始加速播放。

## 几种播放器的解决方案：

**ExoPlayer：**

Exo提供了`追帧`的方案，它自己去判断这个差值，你只要告诉它你所接受的延迟是多少，他就会attempt to追帧,可以配置追帧时的播放速度。
``` java
// Global settings.
SimpleExoPlayer player =
    new SimpleExoPlayer.Builder(context)
        .setMediaSourceFactory(
            new DefaultMediaSourceFactory(context).setLiveTargetOffsetMs(5000))
        .build();
```
> 5000 这个值只是一个**attempt value**, 无需很精确地设置，如果你想要很精确的设置，我推荐你根据自己的播放流格式去设置，比如flv,HLS。

**IjkPlayer：**

很遗憾Ijk并没有提供这个，也没有把H264编码层的一些信向上抛到业务层，无法直接判断差值，这里找了一些网上的方案。

``` java
player.setOption(IjkMediaPlayer.OPT_CATEGORY_FORMAT, "fflags", "nobuffer"); 
player.setOption(IjkMediaPlayer.OPT_CATEGORY_FORMAT, "flush_packets", 1); 
```

> 或者你可以自己修改Ijk代码去把一些信息抛出，一旦发现offset太久，就stop 重新拉流播放。这是一个强制丢帧的方案，不过体验并不如`追帧`方案。


### Other layers

请参考文档，查询`延迟， 追帧`等关键字。
阿里播放器似乎有[追帧方案](https://help.aliyun.com/document_detail/124714.html)，但是我没测试过。

