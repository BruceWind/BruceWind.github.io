title: android 5.0以后的机器 BitmapFactory.decodeStream()返回null的原因是什么？
date: 2016/01/11 16:16:50
updated: 2016/01/11 17:12:48
categories:
- 技术
---
公司的项目需要从android 2.3往后适配，由于本猿平时也有关注新技术的习惯，知道android5.0上bitmap的这块做了变更，但是具体会遇到什么问题呢就不知道了，网上也没有一些详细的博客给出答案，所以只能自己摸黑走路(!=_=)。

    在自己的项目中遇到了这个 BitmapFactory.decodeStream()返回null的情况，所以我也很蛋疼的努力去研究，当时急于打包，AP 21 之后的机器，就没用这个方法。所以跳过了这个问题。现在正好有空就来研究下到底怎么弄这个问题。

代码的截图：
![](assets/569365d6ab64415be1002346.PNG)

由于本来的代码就做了trycath，直接调试进去，发现！！！！！
并没有走到catch里，但是,return 的时候却变成null了。哔了狗了。

查阅官方文档给出这么一句解释： 
***“解码的位图或如果无法解码图像数据则为 null。”***

然后我试着尝试另外一种方式也是不行的：
``` java
        byte[] data = getBytes(is);
		bmp= BitmapFactory.decodeByteArray(data, 0, data.length);
```
发现data都是可以取到的，就是decodBytArray返回还是空，我日，哔了狗了，所以目前我们还是往前又走了一步，起码我们知道比decodStream更接近底层的一个方法。

于是继续寻找decodeByteArray()方法的源代码：
``` java
 public static Bitmap decodeByteArray(byte[] data, int offset, int length) {
        return decodeByteArray(data, offset, length, null);
    }
    
    //这个方法明显走到了下面这个方法中了
    
    
/**
     * Decode an immutable bitmap from the specified byte array.
     *
     * @param data byte array of compressed image data
     * @param offset offset into imageData for where the decoder should begin
     *               parsing.
     * @param length the number of bytes, beginning at offset, to parse
     * @param opts null-ok; Options that control downsampling and whether the
     *             image should be completely decoded, or just is size returned.
     * @return The decoded bitmap, or null if the image data could not be
     *         decoded, or, if opts is non-null, if opts requested only the
     *         size be returned (in opts.outWidth and opts.outHeight)
     */
    public static Bitmap decodeByteArray(byte[] data, int offset, int length, Options opts) {
        if ((offset | length) < 0 || data.length < offset + length) {
            throw new ArrayIndexOutOfBoundsException();
        }

        Bitmap bm;

        Trace.traceBegin(Trace.TRACE_TAG_GRAPHICS, "decodeBitmap");
        try {
            bm = nativeDecodeByteArray(data, offset, length, opts);

            if (bm == null && opts != null && opts.inBitmap != null) {
                throw new IllegalArgumentException("Problem decoding into existing bitmap");
            }
            setDensityFromOptions(bm, opts);
        } finally {
            Trace.traceEnd(Trace.TRACE_TAG_GRAPHICS);
        }

        return bm;
    }


```
###如上：得到bitmap的追踪是在nativeDecodeByteArray这句，这里指向的是一个native的方法，到这里我似乎就懂了，这里真的是因为这个5.0以后的机器bitmap存放的位置不对导致的，因为5.0的这个变更是native层的变更，java层的东西是不会做出改变的。
代码追踪到native方法我也只能说尽力了，无法在继续找下去了，毕竟底层的代码我也看不懂(!=_=)，另外也没有必要去追踪底层的东西。

具体的解决方案的话，就是用setBackgroudResource代替这个方法，我以为android官方文档里会给出我一个新的方法去调用，结果发现BitmapFactory类里面没有一个方法是新加的，都是从api 1开始的（靠墙哭！！！）。

### PS:我们只研究了5.0以后的问题，但是2.2之前也有这个问题，因为没再去适配2.2，所以如果你在2.2之前遇到这个问题，那我们也管不了。




