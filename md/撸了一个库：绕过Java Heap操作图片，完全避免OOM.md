title: 撸了一个库：绕过Java Heap操作图片，完全避免OOM
date: 2017/12/29 14:52:02
updated: 2018/04/24 17:58:55
categories:
- 技术
---

首先，请专心阅读，因为：这个库不能算是技术性突破，但是对国内大部分android开发者而言，都是打破常规的新认识，这里我要吹个牛了。



为什么这么说呢？你问你身边的同事，怎么操作图片避免OOM，都不会告诉你当前我的这个玩法，他们会巴拉巴拉一大堆`Bitmap.options` 参数怎么配置，先decode宽高，怎么内存复用，怎么节省内存，原理是什么巴拉巴拉一大堆。但是，终究你的大图操作还是Bitimap操作，还是免不了消耗几十兆内存，几十兆内存申请，你懂得。



国内99.9%的android程序员，你让他给你说出的最好的操作图片避免OOM的方法，回答都要经过bitmap，bitmap对于3000*4000分辨率的大图操作都没辙，很容易OOM。

 
当然有些人能告诉你会有绕过bitmap的方法，但是我负责任的说他们都不说不清楚具体怎么做，他们甚至不去了解目前linux，mac下常用的开源图片软件怎么实现的，包括不会去了解服务器上的图片操作库是怎么实现的，另外甚至想当然的以为可以做到零内存消耗，以为只操作文件即可，以为不用去解析jpeg编码中的**色彩，RGB，YUV，变换算法，文件编码**等信息。并不了解目前市面上开源的linux图片压缩库的算法都是什么。而实际上：图片操作需要很大内存开销，内存开销永远都绕不过去。


我几年前听过的一个笑话，一个不懂计算机的人说windows下拿个记事本在那里敲1010101001，然后保存一下txt，重命名后缀名为exe就可以执行了，哈哈哈。妈的exe文件的头几个字节呢，文件的头几个字节可是要表明文件编码格式，你给系统一个文件编码是txt，但是后缀是exe的文件吗？你特么根本不懂文件是怎么构成的好吗？好像一个女司机往油箱里加机油一样。





## 做这个库的初心

做各种项目总是遇到大图，三星手机相机拍摄的图片远大于3000*4000，又是在exif里做了旋转。所以这个问题很容易遇到各种问题，然后需求被卡死在这里。这里不说太多了，稍微有点经验的程序员都懂得。

再举例子：我们常见的情况手机里的照片12M这么大，需求上需要压缩图片质量，但不压缩尺寸上传，而你一旦压缩，质量不单很差，而且很容易内存爆了。3000×4000×4/1024/1024=45M 你想想这种情况的内存开销多大，除了这个图的内存消耗之外，其他地方也需要内存开销啊！这个45的申请，很容易导致OOM，而且当前的很多新机器拍摄出的图片比3000×4000还要大。


回过头来说下这个库的原理，我们都知道JVM xmx参数，这个xmx不做具体介绍，这是jvm的基本参数，不了解的请自行查询Java虚拟机原理。

android的Dalvik/ART遵守了JVM的规范，也有堆内存限制，遇到大图操作缩放旋转Bitmap的时候，就很容易OOM。

```
注：

虽然，现在新的android系统提供的这个限制都在调大，我记得6.0官方ROM好像是96M,

非官方ROM要大一些，因为非官方ROM在编译时修改了xmx参数配置，但是新出的手机相机

拍摄出来的图片更大，相机技术的增长速度远大于这个限制的开放程度，进行大图操作
，你懂得。

```
目前在android系统源码对Bitmap的操作，是在native函数里面操作，但是内存申请是申请在Java heap。(国内有的人喜欢叫javaheap有的人喜欢叫dalvik heap)

证据见如下源码：

```

//老版本android源码：来自互联网 

jobjectGraphicsJNI::createBitmap(JNIEnv* env, SkBitmap* bitmap, jbyteArray buffer,  

                                  boolisMutable, jbyteArray ninepatch, int density)  

{  

    SkASSERT(bitmap);  

    SkASSERT(bitmap->pixelRef());  

    jobject obj = env->NewObject(gBitmap_class, gBitmap_constructorMethodID,  

           static_cast<jint>(reinterpret_cast<uintptr_t>(bitmap)),  

            buffer, isMutable, ninepatch,density);  

    hasException(env); // For the side effectof logging.  

    return obj;  

}  



//新版本android 6.0源码，来自我的电脑

//路径 aosp/downloadaosp/platform_frameworks_base/core/jni/android/graphics/Graphics.cpp

jobject GraphicsJNI::createBitmap(JNIEnv* env, android::Bitmap* bitmap,

        int bitmapCreateFlags, jbyteArray ninePatchChunk, jobject ninePatchInsets,

        int density) {

    bool isMutable = bitmapCreateFlags & kBitmapCreateFlag_Mutable;

    bool isPremultiplied = bitmapCreateFlags & kBitmapCreateFlag_Premultiplied;

    // The caller needs to have already set the alpha type properly, so the

    // native SkBitmap stays in sync with the Java Bitmap.

    assert_premultiplied(bitmap->info(), isPremultiplied);

    jobject obj = env->NewObject(gBitmap_class, gBitmap_constructorMethodID,

            reinterpret_cast<jlong>(bitmap), bitmap->javaByteArray(),

            bitmap->width(), bitmap->height(), density, isMutable, isPremultiplied,

            ninePatchChunk, ninePatchInsets);

    hasException(env); // For the side effect of logging.

    return obj;

}
```

上面说的核心原因在于你的bitmap内存申请都在java heap中，这个最大内存的限制。其实我们可以选择绕过这个heap操作图片。 
native heap处于不太受管理的状态，这一点很多人不知道，这就是这个库比较有突破性的地方，native对于大部分android程序员来说，不了解，不熟悉，不写，不关心，呵呵呵呵呵呵呵。

在native中我们可以申请到硬件可提供的最大内存，而不会被虚拟机限制住size，当然你申请超过硬件的大小，比如2G，就会被系统给杀掉。

## 证明native heap内存申请无限制
我尝试用native写了个申请巨大内存又不执行free()的代码进行测试，申请了1.4G的内存还是不会OOM，下图是我用adb shell dumpsys meminfo PACKAGENAME打印出来的当前memory信息。


![](assets/native_memory_show.png)

# 

于是我动手写了一个库，基于libjpeg-turbo，因为我是一个linux 用户，大部分电脑上的软件都是开源的，我都会去稍微了解一下 源码，所以很早就得知libjpeg，libpng目前业内大部分的图片操作软件几乎都是基于他们，包括谷歌年初开源的guetzli这个图片压缩库，年初这个库出1.0版本，我也有及时去跟进，把这个库导入到android平台了，当时是依赖于libjpeg不是libjpeg-turbo，guetzli这个库的压缩比清晰度不比tinypng差，而且压缩出来的文件大小更是比tinypng还要强，但是有个问题就是他太吃CPU，内存消耗的话还好，完全取决于图片尺寸，我觉得guetzli可能目前更适合服务器，tinypng的服务器代码的压缩性能估计也是跟他类似，都是压缩非常吃硬件，但是压缩的结果非常得小，而且保持了图片的高质量。 
回到android平台，android系统开放给应用开发者的Bitmap的操作功能比如裁剪，缩放之类的，底层还是libjpeg，当然为了考虑压缩性能，没有让libjpeg的性能发挥出来，android并不是直接封装的libjpeg，而是基于了另一个叫Skia的开源项目来作为的图像处理引擎,这个引擎最大的特点就是基于比较高效低质的算法来实现，特别适用于性能差的机器。 
所以，我们android直接通过bitmap调用底层的jni算法压缩出来的图片质量远差于其他任何一个图片的压缩库。包括不如IOS。


    乔布斯：啊哈哈哈哈哈哈！！

这个是在性能跟质量方面的取舍。性能这块我不再多说,参考:《简书：Android图片编码机制（Bitmap，Skia，libJpeg） 
》

## 回到这个库本身话题：
这个库的核心价值在于绕过Java heap(有人喜欢叫叫Dalvik heap)的限制，去操作图片，保证无需担心OOM。 
怎么绕过java heap呢？就是绕过bitmap,直接用native直接对图片进行操作，毕竟上面说了Android 4.0以后的机器bitmap内存都在Java Heap中,我们所有操作图片时的内存申请都在Native heap中。



这个库是基于libjpeg-turbo，说白了还是libjpeg，但是这个是没有牺牲CPU消耗，降低色彩质量的版本。你用这个库不管是compress，还是resize都能保证很好的色彩，android原生利用bitmap调用的那个libjpeg库，色彩太垃圾了，压缩我的自拍照感觉我脸上被抹屎了。



性能方面：我目前没有出专门用于arm64这个ABI的so文件，只是出个armv5的so文件，性能并没有发挥到极致，即使即使者这样子的情况，对3000×4000多尺寸的超大图操作，小米5的表现是3s多,完全可接受范围内，而且这3s多还有10M左右的文件读写时间在里面。毕竟迎来新时代，新契机，自然有新的硬件性能，可惜android底层源码还没有迎接“党的十九大指出的新时代”。动手撸了这个库，我新时代的社会主义接班人胸前的红领巾更加的鲜艳了呢。哈哈哈哈！！！

-------------------
## 好了解释到这里，代码在这里，快上车：
[https://github.com/BruceWind/OperatingImageBypassDalvik](https://github.com/BruceWind/OperatingImageBypassDalvik)