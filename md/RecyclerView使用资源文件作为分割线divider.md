title: RecyclerView使用资源文件作为分割线divider
date: 2016/02/24 23:42:02
updated: 2016/02/25 00:33:22
categories:
- 技术
---
在listview中有个很好的东西就是```android:divider```，但是recyclerview中取消了这个属性，但是像画个分割线都变得困难，必须要用Decoration类才行。我依旧想用自定义的drawable文件来作为分割线，所以我想到如下方案：

### 有一种方案是 **统一设置分割线**
你可以在theme.xml中找到该属性的使用情况。那么，使用系统的listDivider有什么好处呢？就是方便我们去随意的改变，该属性我们可以直接声明在：
``` xml
 <!-- Application theme. -->
    <style name="AppTheme" parent="AppBaseTheme">
      <item name="android:listDivider">@drawable/divider_bg</item>  
    </style>
```
这种比较简单的方案，但是无法满足当前我的需求啊，我特么的就是想要每个控件都有不同的分割线，谁知道脑残的ui和产品想要怎么折腾，这样子统一设置肯定无法满足我的需求啊！！！！

### 所以，我需要**单独设置分割线**：
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
        mRecyclerView.addItemDecoration(new ResourceItemDivider(MyActivity.this,R.color.bl));

    }
```
这里的```R.color.bl```我就用了一个color，但如果用自定义的drawable也是没有问题的。
```ResourceItemDivider``` 类定义是这么定义的

``` java
public class ResourceItemDivider extends RecyclerView.ItemDecoration {

    private Drawable mDrawable;

    /**
     *作为Divider的Drawable对象
     * @param context 当前上下文用于获取资源
     * @param resId  color drawable等类型资源文件
     */
    public ResourceItemDivider(Context context, int resId) {
        mDrawable = context.getResources().getDrawable(resId);
    }


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
            final int bottom = top + mDrawable.getIntrinsicHeight();
            mDrawable.setBounds(left, top, right, bottom);
            mDrawable.draw(c);


        }
    }

    public void getItemOffsets(Rect outRect, int position, RecyclerView parent) {
        outRect.set(0, 0, 0, mDrawable.getIntrinsicWidth());
    }

```


