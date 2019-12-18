title: 修复GridView的item没有被撑开的问题
date: 2015/12/14 10:24:33
updated: 2015/12/18 15:55:23
categories:
- 技术
---
由于item中高度不同 导致的 看到背景色而且 item的布局无法fillparent。因为再gridview中嘛。既然高度无法fillparent，那么也无法居中就蛋疼了。
# 

![](assets/5673bbfaab6441660a003571.PNG)

# 

所以我需要重写gridview来重置item的高度。



``` java

public class FixChildHeightGridView extends GridView {


    private int mHeight = 0;

    public void setmHeight(int i_hei) {
        mHeight = i_hei;
    }

    //恢复默认  等待进行重新计算
    public void revertDefault()
    {
        mHeight=0;
    }

    public FixChildHeightGridView(Context context) {

        super(context);
    }

    public FixChildHeightGridView(Context context, AttributeSet attrs) {

        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        //在这里进行重新计算 做了判断 避免重复的多余的计算
        if (mHeight == 0 && getChildCount()>0) {
            fixChildHei();
        }


        int expandSpec;
        if (mHeight > 0) {
            expandSpec = MeasureSpec.makeMeasureSpec(mHeight,
                    MeasureSpec.EXACTLY);
        } else {
            expandSpec = MeasureSpec.makeMeasureSpec(Integer.MAX_VALUE >> 2, MeasureSpec.AT_MOST);
        }
        super.onMeasure(widthMeasureSpec, expandSpec);
    }




    private void fixChildHei()
    {

        final int PRE_GRIDVIEW_HEI= getHeight();

        final int CHILD_COUNT = getChildCount();
        if (CHILD_COUNT > 0) {
            final int NUMCOLUMN = getNumColumns();
            for (int i_index = 0; i_index < CHILD_COUNT / NUMCOLUMN; i_index++) {
                int t_heimax = 0;
                //先取得maxhei
                for (int i_colum = 0; i_colum < NUMCOLUMN; i_colum++) {
                    if (getChildAt(i_index * NUMCOLUMN + i_colum).getMeasuredHeight() > t_heimax) {
                        t_heimax=getChildAt(i_index * NUMCOLUMN + i_colum).getMeasuredHeight();

                    }
                }

                final int MAXHEI=t_heimax;
                //再修正height有问题的 view
                for (int i_colum = 0; i_colum < NUMCOLUMN; i_colum++) {
                    if (getChildAt(i_index * NUMCOLUMN + i_colum).getMeasuredHeight() != MAXHEI) {
                        ViewGroup.LayoutParams layoutParams=getChildAt(i_index * NUMCOLUMN + i_colum).getLayoutParams();
                        layoutParams.height=MAXHEI;
                        getChildAt(i_index * NUMCOLUMN + i_colum).setLayoutParams(layoutParams);
                    }
                }

            }



            //求得gridview自身的高度
            int thishei=getChildAt(0).getMeasuredHeight()*CHILD_COUNT / NUMCOLUMN +
                    getPaddingBottom()+
                    getPaddingTop();
            //计算VerticalSpacing
            if(Build.VERSION.SDK_INT>=16)
            {
                thishei+=(CHILD_COUNT / NUMCOLUMN-1)*getVerticalSpacing();
            }


            if(PRE_GRIDVIEW_HEI>thishei) {
                setmHeight(thishei);
                Log.d(getClass().getSimpleName(), "fixCHildHei");
            }

        }
    }
}



```

#  
代码就是这样子，看最终的效果吧！

![](assets/5673bbfaab6441660a003573)

#  
目前是可以彻底解决这个问题了，那么问题来了。


### 测试中发现：
如果gridview刚开始visible是 gone的话 ，是不行的，所以目前如果遇到用了这个自定义控件的方法不行，那么考虑下是不是给gridiview的adapter添加数据源之前，gridview就gone掉了。
