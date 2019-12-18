title: Java局部字段释放规则探索
date: 2017/03/01 19:44:44
updated: 2017/04/27 10:49:16
categories:
- 技术
---
可能很多人，对局部字段释放的规则一头雾水，只是单纯的知道 只要代码作用域结束了，那么作用域内的所有字段都可以被释放。
在读《深入理解Java虚拟机》的时候，发现并非如此，其中的规则蛮复杂，堆内存和栈内存规则区别很大。

### 关于堆内存和栈内存：
> 节选自《深入理解Java虚拟机》
经常有人把Java内存区分为堆内存( Heap )和栈内存( Stack),这种分法比较粗 
糙 ,Java内存区域的划分实际上远比这复杂。这种划分方式的流行只能说明大多数程序员最关注的、与对象内存分配关系最密切的内存区域是这两块。其中所指的“堆”笔者在后面会专门讲述,而所指的“栈”就是现在讲的虚拟机栈,或者说是虚拟机栈中局部变量表部分。

所以我们写代码测试一下，试着找寻释放规则。

``` java
public class TestModel {

    //这个值希望设置为Runtime.getRuntime().maxMemory()/2 的值,这样子内存中一旦有一个没有被释放则直接OOM
    final byte[] mBytes = new byte[getXmxHalf()];//

    @Override
    protected void finalize() throws Throwable {
        Log.d("TestModel","finalize()"); //当内存被释放时 我可以从日志中看到
        super.finalize();
    }

    //内存的最大值取决于 JVM的xmx参数配置 所以这里取一半，只要内存中有两个  即可发生OOM
    public static int getXmxHalf()
    {
        return (int)(Runtime.getRuntime().maxMemory()/2);
    }
}


```
###上面这些代码中有两点需要说明：
1.finalize是什么： 这个是GC管理器释放一个对象时调用的方法。
2.getXmxHalf 为什么这么命名：app可以申请内存的最大值受ROM厂商自己打包修改的DVM 参数 xmx参数决定。xmx参数同样也是JVM可配置参数。所以，我命名用xmx来讲看起来更暴露原理一点。这里除以2,就是只要内存中有两个对象。那肯定会OOM。

> 在android开发中，常见的android studio为了优化开发工具性能，studio64.vmoptions中把xmx参数配置大一点，就是这个原理，最大申请内存调整。因为，Android Studio是拿IDEA改的，IDEA是用Java开发的，IDEA同样也有这个配置文件。
这里有个搞笑的是idea可以开发很多东西，他的默认配置xmx参数居然比as的还小呢！或许我们可以猜测，AS被google团队优化的并不理想。

# 
下面:
### 看完整的我放在Activity中的, 测试代码:
下面的代码，我就没有拆分到多个方法中，我都放在一个方法中，测试时会不断的注释所有的保留其中一段代码，这样子我写道文章里易读性也高。因为代码挨着。

```  java

public class TestAct extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        d("MAX_MEM:" + Runtime.getRuntime().maxMemory() / 1024 / 1024 + "M");
        
        test();
        testBaseType();
    }


    private void test() {

        //1.会OOM 局部字段确实 释放是需要等到方法执行完毕才能释放
//            TestModel model = new TestModel();
//            TestModel model2 = new TestModel();
//            TestModel model3 = new TestModel();
//            TestModel model4 = new TestModel();

        // 2.这里GC无效 依旧OOM，因为本身 不可释放就不可释放，手动GC也不可被释放
//        TestModel model = new TestModel();
//        System.gc();
//        TestModel model2 = new TestModel();
//        System.gc();
//        TestModel model3 = new TestModel();
//        System.gc();
//        TestModel model4 = new TestModel();
//        System.gc();


        //3.不会OOM，而且看到了四个对象的finalize日志，由此可见：没有被引用的临时字段，不需要等到方法执行完毕 就可以释放，所以这样子写出来的代码内存释放的更快。
//            new TestModel();
//            new TestModel();
//            new TestModel();
//            new TestModel();


        //4.不会OOM   因为作用域太小了，作用域内的代码执行完毕，即可释放。
            {
                TestModel model = new TestModel();
            }
            System.gc();
            {
                TestModel model2 = new TestModel();
            }
            System.gc();
            {
                TestModel model3 = new TestModel();
            }
            System.gc();
            {
                TestModel model4 = new TestModel();
            }
            System.gc();



        //5.不会OOM   (即使我没有主动调用GC,但是内存达到JVM参数配置的 警戒线会自动触发系统的GC)
            {
                TestModel model = new TestModel();
            }
            {
                TestModel model2 = new TestModel();
            }
            {
                TestModel model3 = new TestModel();
            }
            {
                TestModel model4 = new TestModel();
            }


        // 6.这里不会OOM，理论上来说=null这行代码，会被JIT编译器删除掉，但是确实有效果了，这里很快看到了 finalize,但是我把 model 里面的内存消耗降到1M就看不到finalize日志了
//        TestModel model = new TestModel();
//        model=null;
//        TestModel model2 = new TestModel();
//        model2=null;
//        TestModel model3 = new TestModel();
//        model3=null;
//        TestModel model4 = new TestModel();
//        model4=null;


        // 7.这里不会OOM，依旧会触发 finalize  因为那块地址 指针已经被清空了，内存可以被释放， 同上原理一致
//        TestModel model = new TestModel();
//        model=  new TestModel();
//        model = new TestModel();
//        model =  new TestModel();


        //8.会OOM finalize 并没有什么卵用。
//        TestModel model = new TestModel();
//
//        try {
//            model.finalize();
//        } catch (Throwable throwable) {
//            throwable.printStackTrace();
//        }
//
//        TestModel model2 = new TestModel();
//
//        try {
//            model2.finalize();
//        } catch (Throwable throwable) {
//            throwable.printStackTrace();
//        }
//        TestModel model3 = new TestModel();
//        try {
//            model3.finalize();
//        } catch (Throwable throwable) {
//            throwable.printStackTrace();
//        }
//        TestModel model4 = new TestModel();
//        try {
//            model4.finalize();
//        } catch (Throwable throwable) {
//            throwable.printStackTrace();
//        }


    }

    ## 下面我们测试基础类型 的释放,测试基础类型是否遵循那一套逻辑 
    private void testBaseType() {

        //1.会OOM，可见非基础类型就不会  遵循 上面那一套逻辑 这里作用域虽然小了，但是 这里不讲堆内存那套逻辑
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//        }
//        {
//            byte[] mBytes1 = new byte[TestModel.getXmxHalf()];
//        }

        //3.会OOM 因为内存消耗过高 自动触发FullGC  这里写不写GC都没差
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//        }
//        System.gc();
//        {
//            byte[] mBytes1 = new byte[TestModel.getXmxHalf()];
//        }
//        System.gc();


        //3.会OOm  就算我把这个字段引用置空，也没用，照样OOM，但是普通对象是可以的，基础类型没用。请对比后面的那个测试代码。
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//            mBytes=null;
//        }
//        System.gc(); //写不写这句 没差 因为已经触发了 Full GC
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//            mBytes=null;
//        }
//        System.gc();


        //4. 这里不会OOM 比上面的代码多了'int a =0'这就是 说明局部字段在栈中 不在堆中 释放规则 比较特殊。可能你这个时候已经看的懵比了，别怕，这个为什么不会OOM的话，我下面总结里会细说。
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//            mBytes=null;
//            int a=0;
//        }
////        System.gc();//这句写不写都不会 OOM
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//            mBytes=null;
//            int a=0;
//        }
////        System.gc();


        //5. 这里不会OOm 请对比上面的 代码   这里会自动触发Full GC,而System.gc()只是 major GC。
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//            mBytes=null;
//            int a=0;
//        }
//        {
//            byte[] mBytes = new byte[TestModel.getXmxHalf()];
//            mBytes=null;
//            int a=0;
//        }
    }
    
    
}


```
### 总结：
# 
1.上面有很多对比了，写和不写System.gc()的代码，这个没差的，因为JVM的GC释放策略里有个内存警戒线的概念，目前内存已经超出JVM的警戒线，会直接自动触发Full GC，内存警戒线。当然这个就是要看参数配置，不过除了警戒线之外的话，还有老年代新生代等等的一些触发Full GC。
Major GC或者Minjor GC只是俗称，在Hotspot JVM实现的Serial GC, Parallel GC, CMS, G1 GC中大致可以对应到某个Young GC和Old GC算法组合。
# 
2.调用finalize并没有效果，其实在JVM规范中，finalize手动执行是有效的，只是JVM中也不推荐你调用，这里DVM，明显结果是：你用了也没有效果根本释放不了的。就像很多人说的，DVM并不遵循JVM规范。
# 
3.System.gc并不是真的full GC了，他只是一个full gc的建议，看一些文档说JVM很大概率会采纳这个建议，但是我实际在android的DVM测试中，发现并没有触发FullGC。
# 
4.基础类型中mBytes=null不释放，反而，后面用int a=0,就释放了，这里原因是因为这种基础类型存储在局部变量栈中，而就算你赋值空，他依旧在栈顶，就无法释放，重新插一个字段到栈的时候，原来可以被释放的栈顶元素才能被释放了。这一点DVM倒是保持了JVM规范。
# 
5.上面测试对象释放的第三条，网上很多人会认为JIT编译器会把这几行代码从字节码中删除，因为JIT觉得这几行代码没有意义，应该可以删除掉，但是实际测试中，并没有被从字节码中删除，因为明显有看到四个字段被finalize的日志。实际上，JIT的删除规则，叫做**死码删除(Dead Code Elimination)**，永远都不会执行的代码，才会JIT被删除，那样子才是JIT认为的无用代码，而这里并不满足条件，JIT不会认为是无用代码。
# 
6.内存什么时候入栈，什么时候入堆：
> + 基本数据类型（int, short, long, byte, float, double, boolean, char），他们存储在栈内存中，函数调用它们的时候是”传值”；
> + 复杂数据类型（数组, 对象, map, List, Set等），他们的实体存储在堆内存中，栈内存中只存储他们的对象的名称、通过堆内存的地址引用实体对象，函数调用它们的时候是”传引用地址”；

--------------------------------
PS：如上代码，你们可以拷贝到自己项目里，在手机上进行测试，如有不同，请及时反馈。

延伸阅读：
[wiki上关于无用代码删除的介绍](https://zh.wikipedia.org/wiki/%E6%AD%BB%E7%A2%BC%E5%88%AA%E9%99%A4)


