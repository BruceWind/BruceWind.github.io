title: 从TextView源码解析：“android开发中，文字的最难适配”
date: 2015/10/19 08:08:05
updated: 2016/01/15 16:32:54
categories:
- 技术
---
### 关于android相同分辨率，相同尺寸的手机，配置了相同尺寸sp单位字体，结果大小却不同的问题。

这个问题很难。其实android适配中有很多很多的难题，比如：定制ROM自己开发权限管理问题，官方没提供检测有没有被用户拒绝的方法，定制ROM都是自家开发的，又没给开发人员文档。

我们开发的时候，在AS开发的时候，使用预览窗口，预览了480*800，720*1280,1080*1920三种分辨率下的情况，一个向左靠拢 和 向右靠拢的两个TextView是否会因为两边文字过长而重叠。如图这种的。
![](assets/5638d7d338f41108d20001da.PNG)
这个图只是举个这种往两边靠的文字的布局而已。
# 
预览的时候都是好的，在测试的时候，大部分手机也都是正常的。
但是，在天语手机上测试的时候，还是发生了重叠。
那个实际截图我就不截图了，具体描述下：产品定的左边的文字8个，右边的文字 是服务器获取的，这样子带来的问题，就是重叠了。

# 
然后我发现小米设置界面里，有个字体大小的控制，看到这个设置界面我似乎也懂了。 
来不及解释了上图：


![](assets/5638d7d338f41108d20001d9.PNG)

最小的效果
![](assets/5633972038f411091500040c.PNG)

最大的效果

![](assets/5633972038f411091500040a.PNG)

**明显可以看出底部 按钮 “应用”两个字的明显前一个很小。**

# 
我想起之前解析自定义控件的读取自定义属性dp单位值转px单位的时候，对那段代码的解析。

让我们从源码角度，去看下字体的大小 是受什么控制的。
# 
**TextView.java**
``` java 
    public TextView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        this(context, attrs, defStyleAttr, 0);
    }
    ...

	 if (appearance != null) {
            int n = appearance.getIndexCount();
            for (int i = 0; i < n; i++) {
                int attr = appearance.getIndex(i);

                switch (attr) {

                    ...
                    ...

		case com.android.internal.R.styleable.TextView_textSize:
                textSize = a.getDimensionPixelSize(attr, textSize);
                break; 
                ...
                ...

	}


``` 

看到这里，想起了我之前的那个文章 [自定义控件中getDimension方法源码解析](http://crm345.com/post/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8E%A7%E4%BB%B6%E4%B8%ADgetDimension%E6%96%B9%E6%B3%95%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90)
这个方法最后指向了  
# 
**TypedArray.java**

``` java
    public int getDimensionPixelSize(@DimenRes int id) throws NotFoundException {
        synchronized (mAccessLock) {
            TypedValue value = mTmpValue;
            if (value == null) {
                mTmpValue = value = new TypedValue();
            }
            getValue(id, value, true);
            if (value.type == TypedValue.TYPE_DIMENSION) {
                return TypedValue.complexToDimensionPixelSize(
                        value.data, mMetrics);
            }
            throw new NotFoundException(
                    "Resource ID #0x" + Integer.toHexString(id) + " type #0x"
                    + Integer.toHexString(value.type) + " is not valid");
        }
    }

```

TypedValue.complexToDimensionPixelSize这个方法就不说了 最后还是指向了applyDimension()	这个方法。
# 
**TypedValue.java**
``` java
public static float applyDimension(int unit, float value,
                                       DisplayMetrics metrics)
    {
        switch (unit) {
        case COMPLEX_UNIT_PX:
            return value;
        case COMPLEX_UNIT_DIP:
            return value * metrics.density;
        case COMPLEX_UNIT_SP:
             return value * metrics.scaledDensity;*//这里是重点
        case COMPLEX_UNIT_PT:
            return value * metrics.xdpi * (1.0f/72);
        case COMPLEX_UNIT_IN:
            return value * metrics.xdpi;
        case COMPLEX_UNIT_MM:
            return value * metrics.xdpi * (1.0f/25.4f);
        }
        return 0;
    }

```
**scaledDensity**这个字段是用于控制字体缩放比例的。
# 
好了，那么我们来试着打印不同状态情况下的***scaledDensity***。

# 

当我使用最大的字体的时候：
``` log
10-30 16:10:44.727  11175-11175/com.xxxxx.fireworks D/DDDDDD﹕ scaledDensity = 2.42
```
当我使用最小的字体的时候：
``` log
10-30 16:13:47.887  11175-11175/com.xxxxx.fireworks D/DDDDDD﹕ scaledDensity = 1.72

```

好了最后就是这里了，不得不提到一个方法**Resources.getSystem().getDisplayMetrics()**这句可以获得DisplayMetrics。这里的含义已经很清晰，获得系统配置的**DisplayMetrics**。
# 
那么，Resources.getSystem().**getDisplayMetrics()**这个方法里面做了什么?
好吧！我们继续从这个继续找源代码。

**Resources.java**
``` java
    public static Resources getSystem() {
        synchronized (sSync) {
            Resources ret = mSystem;
            if (ret == null) {
                ret = new Resources();
                mSystem = ret;
            }

            return ret;
        }
    }
    ...
    ...
  private Resources() {
        mAssets = AssetManager.getSystem();
        mConfiguration.setToDefaults();
        mMetrics.setToDefaults();//重点在于这一句
        updateConfiguration(null, null);
        mAssets.ensureStringBlocks();
    }


```
下面看下**setToDefaults()**这个方法：

**DisplayMetrics.java**
``` java

 @Deprecated
    public static int DENSITY_DEVICE = getDeviceDensity();
...
...

 public void setToDefaults() {
        widthPixels = 0;
        heightPixels = 0;
        density =  DENSITY_DEVICE / (float) DENSITY_DEFAULT;
        densityDpi =  DENSITY_DEVICE;
        scaledDensity = density;
        xdpi = DENSITY_DEVICE;
        ydpi = DENSITY_DEVICE;
        noncompatWidthPixels = widthPixels;
        noncompatHeightPixels = heightPixels;
        noncompatDensity = density;
        noncompatDensityDpi = densityDpi;
        noncompatScaledDensity = scaledDensity;
        noncompatXdpi = xdpi;
        noncompatYdpi = ydpi;
    }
```
scaledDensity是DENSITY_DEVICE和DENSITY_DEFAULT除法计算的结果。
这个是android官方提供的frameworks_base中的源代码。
# 
但是，实际开发中我**只能打印出来DENSITY_DEFAULT，无法打印出来DENSITY_DEVICE，getDeviceDensity()这个方法也被隐藏了**。

# 
getDeviceDensity()方法里面的注释是：

	qemu.sf.lcd_density 可用于重写 ro.sf.lcd_density
	当在真机上运行，允许动态配置。
	这是由于该 ro.sf.lcd_density 
	当它解析 build.prop 之前时，由 init 进程设置

## 结论：
那么，所以我们可以得出定制ROM字体大小不同，主要是因为定制ROM修改了getDeviceDensity()方法，使DENSITY_DEVICE的和**scaledDensity的值在厂商的控制之内**，这就是为什么，**我们配置了字体大小的单位，在不同的机器上看起来还是有的很大，有的很小了**。
开发过程中，即时预览的时候我们是按照官方ROM的结果预览，但每个厂商定制化严重，所以最终适配的效果就会很差劲。以前我SONY L36 官方ROM看字体都挺好，但是我刷了个Flyme，在魅族官网下载的，是官方的东西，结果刷完了，安装自己的app发现字体都变得好小，其实就是ROM定制化的原因。
# 
PS：补充一点，setToDefaults()这个方法似乎也被小米的ROM团队修改了，因为按照常理，就算修改getDeviceDensity()，density应该与scaledDensity等值的，但是实际打印Log的过程中发现不是的，所以setToDefaults()这个方法也被厂商修改了。
所以小米这个修改字体的模式，是修改了setToDefaults()，而其他厂商可能仅仅只是修改了getDeviceDensity()。


PS：再再补充一点，MOTO G也可以修改字体大小。而其他一些机器就很少有可以修改字体大小的设置了。

#  
本文涉及到 的github源码：

> - https://github.com/android/platform_frameworks_base/blob/master/core/java/android/content/res/Resources.java


> -  https://github.com/android/platform_frameworks_base/blob/master/core/java/android/util/TypedValue.java

> - https://github.com/android/platform_frameworks_base/blob/master/core/java/android/widget/TextView.java

> - https://github.com/android/platform_frameworks_base/blob/master/core/java/android/util/DisplayMetrics.java

> - https://github.com/android/platform_frameworks_base/blob/master/core/java/android/content/res/TypedArray.java