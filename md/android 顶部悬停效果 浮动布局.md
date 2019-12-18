title: android 顶部悬停效果 浮动布局
date: 2015/11/29 23:36:42
updated: 2015/11/29 23:48:01
categories:
- 技术
---
来不及解释了，上代码：

``` xml


    <declare-styleable name="FloatScrollView">
    <!-- Positions the right edge of this view to the left of the given anchor view ID. -->
    <attr name="floatid" format="reference" />
        <attr name="copyid" format="reference" />
    </declare-styleable>
```

FLoatScrollView类

``` java

package com.widgets;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.util.AttributeSet;
import android.view.View;
import android.widget.ScrollView;

import com.mvp.R;

/**
 * Created by xxx on 15-10-14.
 */
public class FloatScrollView extends ScrollView {

    //需要浮动区域的顶部的view的高度  这里强制要求浮动区域的控件往上到达ScrollView  必须得是一个View
    View mFloatView;
    //代替展示浮动view
    View mFlowView;

    int flowid;
    int floatid;

    public FloatScrollView(Context context) {
        super(context);
    }

    public FloatScrollView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView(attrs);
    }

    public FloatScrollView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);

        initView(attrs);
    }

    private void initView(AttributeSet attrs)
    {
        TypedArray obtainStyled = getContext().obtainStyledAttributes(attrs, R.styleable.FloatScrollView);
        flowid=obtainStyled.getResourceId(R.styleable.FloatScrollView_copyid,0);
        floatid=obtainStyled.getResourceId(R.styleable.FloatScrollView_floatid, 0);
    }


    @Override
    protected void onDraw(Canvas canvas) {

	//这几句代码我也不想写在onDraw中 写在init方法里最好不过只是 那样子 无法find view
        mFloatView = getRootView().findViewById(floatid);
        mFlowView = getRootView().findViewById(flowid);
        super.onDraw(canvas);
    }

    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {

        super.onScrollChanged(l, t, oldl, oldt);



        if(mFloatView != null && mFlowView!=null) {

            if(t >= mFloatView.getHeight()) {
                mFlowView.setVisibility(View.VISIBLE);
            } else {
                mFlowView.setVisibility(View.GONE);
            }
        }
    }
}


```


上图 ：  


![](assets/565b1d7eab6441515b000333.JPEG)

# 

![](assets/565b1d7eab6441515b000334.JPEG)


看布局代码记得寻找其中的 view_float_copy

```  xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:background="@color/bg_layout"
    android:layout_height="match_parent">

    <com.cores.widget.Topbar
        android:id="@+id/topbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">



    <com.widgets.FloatScrollView
        app:floatid="@+id/view_float"
        app:copyid="@+id/view_float_copy"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/scrollView" >

    <LinearLayout
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="10dp">

        <RelativeLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="@drawable/corner_search_border_gray">

            <EditText
                style="@style/font14_gray_white" android:hint="请输入会员卡号、姓名、手机号" android:drawableRight="@drawable/user_search"
                android:background="@color/clear"
                android:layout_width="match_parent"
                android:padding="6dp" />


        </RelativeLayout>
    </RelativeLayout>

    <RelativeLayout
        android:id="@+id/view_float"
        android:background="@drawable/bordergray_topbot_stokwhite"
        android:gravity="center_vertical"
        style="@style/hor_container">


        <CheckBox
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:button="@drawable/selector_check"
            android:text=" 全选"
            android:layout_centerVertical="true"
            style="@style/font14_balck"
            android:id="@+id/check_allsel"
            android:checked="false" />

        <TextView
            style="@style/font13_gray"
            android:id="@+id/txt_membercount"
            android:textColor="@color/grey_a4a4a4"
            android:text="共0位会员"
            android:layout_centerVertical="true"
            android:layout_toRightOf="@+id/check_allsel"
            android:layout_toEndOf="@+id/check_allsel"
            android:layout_marginLeft="15dp"
            android:layout_marginStart="15dp" />

        <TextView
            style="@style/font14"
            android:id="@+id/txt_btn_adduser"
            android:textColor="@color/home_rad_txt_blue"
            android:background="@drawable/corner_search_border_gray"
            android:text="新增会员"
            android:padding="5dp"
            android:layout_centerVertical="true"
            android:layout_alignParentRight="true"
            android:layout_alignParentEnd="true" />
    </RelativeLayout>

    <com.cores.widget.bugfixview.FixRowListView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/list_member"
        android:layout_gravity="center_horizontal" />
    </LinearLayout>

    </com.widgets.FloatScrollView>


        <RelativeLayout
            android:background="@drawable/bordergray_topbot_stokwhite"
            android:gravity="center_vertical"
            style="@style/hor_container"
            android:id="@+id/view_float_copy"
            android:visibility="gone">


            <CheckBox
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:button="@drawable/selector_check"
                android:text=" 全选"
                android:layout_centerVertical="true"
                style="@style/font14_balck"
                android:id="@+id/check_allsel_copy"/>

            <TextView
                style="@style/font13_gray"
                android:textColor="@color/grey_a4a4a4"
                android:text="共0位会员"
                android:layout_centerVertical="true"
                android:layout_toRightOf="@+id/check_allsel_copy"
                android:layout_toEndOf="@+id/check_allsel_copy"
                android:layout_marginLeft="15dp"
                android:layout_marginStart="15dp" />

            <TextView
                android:id="@+id/txt_btn_adduser_copy"
                style="@style/font14"
                android:textColor="@color/home_rad_txt_blue"
                android:background="@drawable/corner_search_border_gray"
                android:text="新增会员"
                android:padding="5dp"
                android:layout_centerVertical="true"
                android:layout_alignParentRight="true"
                android:layout_alignParentEnd="true" />
        </RelativeLayout>
    </FrameLayout>
</LinearLayout>


```

主要就是Frame布局 选择性的显示 那个copy的view，浮动的原理就是这样子的。