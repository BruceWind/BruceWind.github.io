title: android 开发中的好习惯
date: 2015/09/17 19:33:05
updated: 2015/10/29 18:39:57
categories:
- 技术
---
### 1.被adapter所引用的数据源尽量使用final。
	
	一般写adapter的时候，其中的datalist，也就数据源，一般都没有在Adapter中进行new，而adapter只是在new 的时候通过自定义的构造方法传递进来，这里是引用了act或者frag中的一个datalist的地址。
	那么为了防止act中的datalist再被adapter引用之后重新赋值，要尽量设置为final，不设置final的话，在adapter被设置之后，你重新new datalist，就会导致adapter原来引用的地址还是旧的datalist，这里你只是改变了新的地址上的数据源，旧的还没变，就容易导致一些问题，加了final，会限制自己不会重新new这个datalist，这是一个非常好的习惯。


### 2.if()后面一定要加{}，就算if只有一行也要加{}。

	这样仅仅是为了视觉，代码可读性增强。


### 3.大括号{}中的代码也要尽量用空行的方法把逻辑类似的分割开来。


	我们都懂得拆分代码，方便测试，和阅读，但是有些不适合拆分的比如，大括号内{} 可能会有多行代码，但是这些行代码，逻辑上好像不方便再拆分，但是，如果判断和下面处理用空格隔开，还有假如return 这行代码跟前面的逻辑也隔开。或者是void的方法，一般里面有判断的几行代码，数据处理的几行代码，还有set的几行代码，判断，处理，和set的几行都用空格隔开的话，似乎代码的可读性大大的加强了。

### 4.减少Thread的滥用。
	
	多用Timertask，还有线程池之类的，asynctask之类的很多很多好的东西，多去研究拿一种更加适合最好不过了。

### 5.switch case  使用时，每个case  XXXX: 之后记得加{}。

	在这里加{}，跟if尾部加{}是一个意思。这样子不是为了别的，仅仅是为了增加代码的易读性，{}后面再换行写break，每次我看到case  XXXX：后面几行写一堆的代码然后直接跟break;我看代码的目的就是分析代码，没有括号我每次都要把break的分析，加到我的脑子里，这样我就要多记忆一行代码。


###  6.多个参数的方法，记得每个参数都用一行。
举个例子：

	下面同样是写代码我写了三种方法，代码都是一样的逻辑，参数都一样，我只是改了一些换行之类的你觉得那种更容易理解。

+ a.
``` java
	RequestUtils.requestGetInfo(ZLApplication.mZLApplication.getmNetWork(),getActivity(), handler, map, URLUtil.getServer()+ URLUtil.GET_APP_ADV, RES_ADV_INFO,false);

```

+  b.
``` java
	RequestUtils.requestGetInfo(ZLApplication.mZLApplication.getmNetWork(),
                        getActivity(), handler, map, URLUtil.getServer()
                                + URLUtil.GET_APP_ADV, RES_ADV_INFO，false);

```

+ c.
``` java
	RequestUtils.requestGetInfo(
			ZLApplication.mZLApplication.getmNetWork(),
			getActivity(), 
			map, 
			URLUtil.getServer()+ URLUtil.GET_APP_ADV,
			RES_ADV_INFO,
			false
			);

```

	很显然肯定是最后一种更加易读，abc种代码分别表示了三种不同的程序员。  
	当然这个方法不是我定义的，一个同事定义的，其中一些参数很多余，明显是有些是static 都穿进来了，写进方法内部去取不就行了还做的这个麻烦，地址居然还要自己拼，看了好烦的，那个参数竟然要用 “+”进行字符串拼接。

###  4.不想让团队中的别人调用你所写的类的默认构造函数时，最好使用private 一下默认构造行数。

	比如 private ADVTool(){}，之后这个类的默认构造函数就被禁用了。虽然这个技巧用处不是很多，但是比你特么的写一堆的注释告诉别人的方式好，这样子就强制禁用默认构造函数了。

### 5.方法命名还有一些action的命名尽量减少get set put的单词的使用。

	虽然，平时英语口语中get think 之类的词语可以表示很多词，说口语时很多时候都懒得用那些拗口的单词，直接就用get think代替everthing了。但是这他妈的是编程，你特么方法名给老子全是 get 老子看得懂你写的是个鸟啊？尽量找一些更合适的单词好不好，MD。  我看到一堆的方法命名还在用My....我就头大。
	
### 6.多层for循环的时候，减少ijkl单字母变量的使用。

	又是这个问题，一眼望去，i j k l，看的眼疼，for循环的时候能不能用 "i_对象名"，这种方式，看起来似乎更易懂点。

### 7.还是说下代码段的分隔问题。

+ a.
``` java

    private static final int REQ_CATE_LIST=0X002A3;
    private static final int RES_CATE_LIST=0X00243;
    
    @ViewInject(R.id.txt_content)
    TextView txt_content;

    AppstoreCateModel cateTitleModel;

``` 

+ b.
``` java

    private static final int REQ_CATE_LIST=0X002A3;
    private static final int RES_CATE_LIST=0X00243;
    @ViewInject(R.id.txt_content)
    TextView txt_content;
    AppstoreCateModel cateTitleModel;

``` 

	这点我就不多说了，自己看哪种更易读点。其实去分析一些开源框架的时候也会看到和上面的代码一致的代码，开源框架的代码分隔的也是很有规范性的。

### 8.在写布局的的时候多用style，增加一些属性的重用，减少xml代码的行数。
比如：

``` xml
<!--TextView的例子：  -->
	<TextView
                    style="@style/font14_white_gray"
                    android:id="@+id/txt_file_size"
                    android:text="111M" />

```
	
``` xml
<!--引用的style：  -->

    <style name="font14_white_gray" parent="font14">
        <item name="android:textColor">@color/txt_white_gray</item>
    </style>
    
    <style name="font14">
        <item name="android:layout_width">wrap_content</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:textSize">14sp</item>
    </style>
```

9.popupwindow需要在合适的情况下才能显示出来，不要在oncreate中直接显示。

	在act frag真正被show出来之后才能进行popupwindow的显示，否则会出现崩溃，因为popupwindow需要跟view进行连接，如果act frag没有显示出来就无法进行连接。  对于popupwindow dialog就会没有这个问题。	
# 

### 10.缩小变量的作用域。

	如果在类的开始就声明了一堆的  mIsOpen ，mIsCanGotoHome，这些字段的话，导致你每次使用的时候都要去考虑他是否被改变过，还有判空，因为你不确定在你使用它的时候被更改了多少次，减少变量的作用域的做法：
	赋值的时候才new出来，使用的时候直接调用，比如：



- a.这种用法 应该尽量减少
``` java 
class A
{
 
 boolean mIsOpen=false；
 onreate（）
 {
	mIsOpen=true;

 ...
 ...
 ...
 opt();
 }

opt()
{

	if(mIsOpen)
	{
		toast("打开");
	}
}

}

```

- b.尽量使用这种变量作用域较小的用法。
``` java 
class A
{
	onreate（）
	{
		opt(true);
	}

	opt(boolean mIsOpe)
	{
		if(mIsOpen)
		{
			toast("打开");
		}
	}

}

```


### 11.尽量减少方法的参数个数。

	既然上面6，这里提到了那个定义的那个方法，我就想提一下这个参数数量的问题，参数过多会导致阅读代码的困难，以及调用这个方法的时候也很困难。



### 12.在部分手机上发生的问题，请先考虑api版本适配性的问题，其次再考虑ROM的问题，最后再考虑这个手机的问题。
	
	出现部分手机适配的问题，不要都直接怪那个手机，不要怪定制rom，多多去考虑api版本的适配问题，很多情况下是我们自己的工作没有做到位，直接跟领导说这个问题是手机问题这样子是很不负责任的。
	api 18上会有一些ui界面适配的问题，还有一些老的api 确实也会再ui上会有一些跑偏，但是那是整个api版本的所有手机都是这样子，不能单纯的说是那个手机的问题，卧槽，你能仔细解释下具体这个手机哪里与其他手机不同吗？ 
	当然，实际开发中是会遇到一些确实是因为那个rom的问题导致的。但是，如果发现这个rom出现问题，那么整个品牌的大部分rom都是有问题的，比如：
	华为的rom上 一些动效出不来的问题，确实是这样子，华为为了优化电量和性能，默认关闭了华为旗下部分手机品牌的 动效。 这个问题我们可以怪rom，但是这个不能怪手机，这种问题一般整个品牌的产品线都存在这个问题。
	还有OOM问题，很多时候是程序员的内存消耗没把握好，每个手机的对单个app的内存限制是不同的，官方rom的话，单个app最大可申请内存较小，国产rom都把这个限制改大了。三星，moto，nexus系列都没有调大这个限制，所以一些机器上会OOM，但是这个问题绝对是程序员自身的问题，内存消耗应该尽量的小 ，才能适配更多的机器。
	我们程序员对自己公司开发的软件出现的问题说话要负责。


