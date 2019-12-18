title: RecyclerView设置间隔线为虚线
date: 2016/02/24 23:37:58
updated: 2016/02/25 00:46:44
categories:
- 技术
---
以前使用listview的时候，使用了资源文件作为divider，绘制虚线也是用自定义的drawable绘制虚线，当然会遇到一些坑，虚线不会那么容易加载出来，android 4.0以后的系统都默认开启了硬件加速，虚线就绘制不出来了，所以解决方案很简单，关闭act的硬件加速或者listview 的硬件加速即可，所以，listview上用资源文件去绘制虚线还是很好用的。
但是，recyclerview的话我也试着用资源文件去绘制虚线，看我这篇[《Recyclerview使用资源文件作为分割线divider》](http://androidyuan.com/post/Recyclerview%E4%BD%BF%E7%94%A8%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6%E4%BD%9C%E4%B8%BAdivider)，在Recyclerview中，就算我关闭了硬件加速，也是直线，蛋疼。。。

所以，还是老老实实，用canvas自己绘制虚线吧！
# 
看代码，我是这么使用的：
``` java
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        initData();
        //最关键的三行代码
        mRecyclerView = (RecyclerView) findViewById(R.id.id_recyclerview);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        mRecyclerView.setAdapter(mAdapter = new HomeAdapter());

        //设置分割线
        mRecyclerView.addItemDecoration(new DashlineItemDivider());

    }
```


上```DashlineItemDivider```代码:
``` java
public class DashlineItemDivider extends RecyclerView.ItemDecoration {



    public void onDrawOver(Canvas c, RecyclerView parent) {
        final int left = parent.getPaddingLeft();
        final int right = parent.getWidth() - parent.getPaddingRight();

        final int childCount = parent.getChildCount();
        for (int i = 0; i < childCount; i++) {
            final View child = parent.getChildAt(i);
            final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child
                    .getLayoutParams();
            //以下计算主要用来确定绘制的位置
            final int top = child.getBottom() + params.bottomMargin;

            //绘制虚线
            Paint paint = new Paint();
            paint.setStyle(Paint.Style.STROKE);
            paint.setColor(Color.RED);
            Path path = new Path();
            path.moveTo(left, top);
            path.lineTo(right,top);
            PathEffect effects = new DashPathEffect(new float[]{15,15,15,15},5);//此处单位是像素不是dp  注意 请自行转化为dp
            paint.setPathEffect(effects);
            c.drawPath(path, paint);


        }
    }
    
}


```

# 
效果如图：

![](assets/20160225003700732.jpg)