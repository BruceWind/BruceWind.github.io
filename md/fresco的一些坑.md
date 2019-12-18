title: fresco的一些坑
date: 2016/03/23 15:34:15
updated: 2016/04/01 18:57:26
categories:
- 技术
---

    由于fresco其实还没有发布1.0版本，目前也还是0.9版本。  所以还是会有一些坑的。

1.使用xml里配置了，圆形，但是没有效果：



最后在github的issues上看到，有人回复说用java区操作，我试了，但是没有配置setRoundingMethod，导致依旧没有效果，最后使用了setRoundingMethod才发生效果。这个问题，去issues上面看了，很多人都遇到这个问题，这个问题是同样在别人的机器上存在的。搞不清为什么，看他的源码的自定义控件的构造函数中，也有明确给  TagetApi21做了单独的构造函数，可是依旧没有效果。

后来仔细研究下：　`xmlns:fresco="http://schemas.android.com/apk/res-auto"` 这行结尾必须是`res-auto`．

# 
2.使用RoundingParams.RoundingMethod.BITMAP_ONLY配置之后导致列表滚动时，内存不断上升直至OOM触发，发生崩溃。

看这个文档的解释就是不建议在列表页用，view的复用机制导致的内存抖动问题很严重。但是，我们家产品狗就是要求在列表页使用．．．．．我了个草．．．

# 
3.官方文档里竟然没有配置bitmap色彩的地方，caocaoca！

于是,我去github的issues上去找这个问题：[点击跳转](https://github.com/facebook/fresco/issues/652)

其实官方的issues里也没有给出一个详细的答案，所以我就只能去阅读源码找到了这个方案：
代码如下：

``` java
        ImagePipelineConfig config= ImagePipelineConfig.newBuilder(this).setBitmapsConfig(Bitmap.Config.RGB_565).build();
        Fresco.initialize(this,config);
```
