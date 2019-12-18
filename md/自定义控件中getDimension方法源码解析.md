title: 自定义控件中getDimension方法源码解析
date: 2015/09/16 23:01:22
updated: 2016/02/25 00:29:16
categories:
- 技术
---

getDimension() 
getDimensionPixelOffset() 
两个方法的区别在哪？ 

# 

先贴出这个方法的源码：（方法的理解，我写进注释里了）

``` java

//getDimension
	 public float getDimension(int index, float defValue) {
	 
		......//省略部分判断的代码
			
        index *= AssetManager.STYLE_NUM_ENTRIES;
        final int[] data = mData;
        final int type = data[index+AssetManager.STYLE_TYPE];
        if (type == TypedValue.TYPE_NULL) {
	        //空的时候返回默认值
            return defValue;
        } else if (type == TypedValue.TYPE_DIMENSION) {
	        //类型正确的时候往下走
            return TypedValue.complexToDimension(
                data[index+AssetManager.STYLE_DATA], mMetrics);
        } else if (type == TypedValue.TYPE_ATTRIBUTE) {
	        //类型不正确的时候抛出异常
            throw new RuntimeException("Failed to resolve attribute at index " + index);
        }
		......

    }

//getDimensionPixelOffset
public int getDimensionPixelOffset(int index, int defValue) {

		......
        index *= AssetManager.STYLE_NUM_ENTRIES;
        final int[] data = mData;
        final int type = data[index+AssetManager.STYLE_TYPE];
        if (type == TypedValue.TYPE_NULL) {
            return defValue;
        } else if (type == TypedValue.TYPE_DIMENSION) {
            return TypedValue.complexToDimensionPixelOffset(
                data[index+AssetManager.STYLE_DATA], mMetrics);
        } else if (type == TypedValue.TYPE_ATTRIBUTE) {
            throw new RuntimeException("Failed to resolve attribute at index " + index);
        }
		......

    }

```
这两个方法的源代码呢，似乎都差不多的东西。
	
	区别就在于：一个是执行了TypedValue.complexToDimension 一个是执行了TypedValue.complexToDimensionPixelOffse。

等会再看complexToDimension方法。我们先来看下mData这个字段。
# 
由于再getDimension之前，我们调用了context.obtainStyleAttr()，mData被追踪到了这里。
那么我们看下这个方法的代码:
``` java

 public TypedArray obtainStyledAttributes(AttributeSet set,
                int[] attrs, int defStyleAttr, int defStyleRes) {
            final int len = attrs.length;
            final TypedArray array = TypedArray.obtain(Resources.this, len);

            // XXX note that for now we only work with compiled XML files.
            // To support generic XML files we will need to manually parse
            // out the attributes from the XML file (applying type information
            // contained in the resources and such).
            final XmlBlock.Parser parser = (XmlBlock.Parser)set;
            AssetManager.applyStyle(mTheme, defStyleAttr, defStyleRes,
                    parser != null ? parser.mParseState : 0, attrs, array.mData, array.mIndices);

            array.mTheme = this;
            array.mXml = parser;

            if (false) {
                int[] data = array.mData;
                
                System.out.println("Attributes:");
                String s = "  Attrs:";
                int i;
                for (i=0; i<set.getAttributeCount(); i++) {
                    s = s + " " + set.getAttributeName(i);
                    int id = set.getAttributeNameResource(i);
                    if (id != 0) {
                        s = s + "(0x" + Integer.toHexString(id) + ")";
                    }
                    s = s + "=" + set.getAttributeValue(i);
                }
                System.out.println(s);
                s = "  Found:";
                TypedValue value = new TypedValue();
                for (i=0; i<attrs.length; i++) {
                    int d = i*AssetManager.STYLE_NUM_ENTRIES;
                    value.type = data[d+AssetManager.STYLE_TYPE];
                    value.data = data[d+AssetManager.STYLE_DATA];
                    value.assetCookie = data[d+AssetManager.STYLE_ASSET_COOKIE];
                    value.resourceId = data[d+AssetManager.STYLE_RESOURCE_ID];
                    s = s + " 0x" + Integer.toHexString(attrs[i])
                        + "=" + value;
                }
                System.out.println(s);
            }

            return array;
        }

```



我们直接就看 TypedValue.complexToDimension(......);
        这个static方法吧?

# 
上代码 :

``` java

//TypeArray 内 getDimension方法调用了这里
public static float complexToDimension(int data, DisplayMetrics metrics)
    {
        return applyDimension(
            (data>>COMPLEX_UNIT_SHIFT)&COMPLEX_UNIT_MASK,
            complexToFloat(data),
            metrics);
    }


//TypeArray 内 getDimensionPixelOffset方法调用了这里
 public static int complexToDimensionPixelOffset(int data,
            DisplayMetrics metrics)
    {
        return (int)applyDimension(
                (data>>COMPLEX_UNIT_SHIFT)&COMPLEX_UNIT_MASK,
                complexToFloat(data),
                metrics);
    }

```

好了大概逻辑就是这样子 :
		getDimension                  -> complexToDimension
		getDimensionPixelOffset -> complexToDimensionPixelOffset

其中， (data>>COMPLEX_UNIT_SHIFT) & COMPLEX_UNIT_MASK的意思是将该int值与上0xf，以获取其最低4位，这4位是**单位**。而complexToFloat则是使用该int值的最高24位当作数值，4-7位作为radix，进行计算，转成float。

而这个complexToDimension与complexToDimensionPixelOffset方法内的代码一样的,只是一个被强制转类型为int了,一个没有被强制转。

那么，getDimension与getDimensionPixelOffset得到的值应该是几乎相等的，误差就在于类型强转。  
所以可得到官网提到的这个“原始像素带有偏移量”，这个词或许他的意思就是比较精确地像素和不太精确地，但是这里误差是小于1像素的，那么这个0.1的精确好像作用不大啊！
	
	这里我也无法理解为何这个不到1像素的误差为何还要区分出来两个方法，可能有些地方为了这些小的不到一个像素的多余的位置在对于一个布局是很重要的，如果一个横向分辨率是720的手机，父控件有横向有两个子控件，也是用这种dp属性的计算，最后计算得出的一个是359.6一个是360.4，这里子控件显示的时候肯定是知道自己的宽度的整数即可，但是父控件或许是需要知道他们的带小数点的值来求得总和的实际宽度。



然后他指向了applyDimension(....)方法,我们看下applyDimension()方法的代码:

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
            return value * metrics.scaledDensity;
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
applyDimension的第一个参数代表他是什么单位，然后根据不同的单位返回相同的值。


在applyDimension中根据单位的不同，将float乘上不同的系数。如dip/dp需乘上屏幕系数，sp需乘上字号的缩放系数，pt、in、mm等也是根据相应的算法进行换算。

	return value * metrics.density; 这个代码跟我们平时手动写dp2px方法的代码几乎是一样的，我们平时可能是为了误差的问题在后面加上0.5*density。

其实这里有有一点要提的是：dp px  mm 等，在系统中都是以 "数值+单位" 在系统中存储的。

比如：
``` xml

<?xml version="1.0" encoding="utf-8"?>  
<resources>  
    <dimen name="zl_def_indicator_radius">4dp</dimen>  
    <dimen name="zl_def_font_size">16sp</dimen>  
</resources>  

```
这种存起来的时候都是以 "数值+单位" 存储的.

Android的Resoureces类的getDimension方法，对于不同的dimension，在使用getValue获取到对应的int值之后，会通过TypedValue的complextoDimension方法将其转换为float。

# 

本文涉及到的github的android源码，地址如下：

	https://github.com/android/platform_frameworks_base/blob/master/core/java/android/content/Context.java
	https://github.com/android/platform_frameworks_base/blob/master/core/java/android/content/res/Resources.java
	https://github.com/android/platform_frameworks_base/blob/master/core/java/android/content/res/AssetManager.java
	https://github.com/android/platform_frameworks_base/blob/master/core/java/android/util/TypedValue.java
	https://github.com/android/platform_frameworks_base/blob/master/core/java/android/content/res/TypedArray.java
	https://github.com/android/platform_frameworks_base/blob/master/core/java/android/content/res/Resources.java