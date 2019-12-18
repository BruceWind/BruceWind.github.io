title: android 初次尝试Open GL
date: 2016/07/06 12:36:30
updated: 2016/07/09 16:38:12
categories:
- 技术
---
首先要考虑设备支持问题。如下是各个android 版本的支持：
android 官方给的答案：

>- OpenGL ES 1.0 and 1.1 - This API specification is supported by Android 1.0 and higher.
>- OpenGL ES 2.0 - This API specification is supported by Android 2.2 (API level 8) and higher.
>- OpenGL ES 3.0 - This API specification is supported by Android 4.3 (API level 18) and higher.
>- OpenGL ES 3.1 - This API specification is supported by Android 5.0 (API level 21) and higher.

API 8 开始可以使用Open GL ES2.0，现在的应用也一般都不在适配4.0一下的机器了，所以对于GL引擎的支持还是不错的。
这里为什么叫做ES ,ES是Embedded Syste的意思，是嵌入式系统的意思，专门针对一些设备做的。


# 
# 开始新建第一个Open GL项目

## 1.在mainfast中添加配置 GL ES版本

```
    # Open GL ES版本
    <uses-feature android:glEsVersion="0x00020000" android:required="true" />
    
    # 纹理压缩的格式  这两种适配的机器比较多
    <supports-gl-texture android:name="GL_OES_compressed_ETC1_RGB8_texture" />
    <supports-gl-texture android:name="GL_OES_compressed_paletted_texture" />
    
```
    这里使用supports-gl-texture，每个 <supports-gl-texture> 元素只能声明一种所支持的纹理压缩格式， 这通过 android:name 属性值进行指定。 如果应用程序支持多种纹理压缩格式，可以声明多个 <supports-gl-texture> 元素。这个东西的声明决定了最终在一些机器的适配结果。
    
下面是每一种纹理格式的适配范围：

|   纹理压缩格式描述符          |	说明 |
|---|:---|:---:|
|  GL_OES_compressed_ETC1_RGB8_texture	| Ericsson 纹理压缩。在 OpenGL ES 2.0 中定义，适用于所有支持 OpenGL ES 2.0 的 Android 平台设备。
|   GL_OES_compressed_paletted_texture |	通用的带调色板的纹理压缩。
|   GL_AMD_compressed_3DC_texture|	ATI 3Dc 纹理压缩。
|   GL_AMD_compressed_ATC_texture| 	ATI 纹理压缩。适用于运行 Adreno GPU 的设备，包括 HTC Nexus One、Droid Incredible、EVO 等等。 为了保证最大的兼容性，设备还可以用 |   GL_ATI_texture_compression_atitc 描述符来声明 <supports-gl-texture> 元素。
|   GL_EXT_texture_compression_latc	| Luminance alpha 纹理压缩。
|   GL_EXT_texture_compression_dxt1 |	S3 DXT1 纹理压缩。适用于 Nvidia Tegra2 平台的设备，包括 Motorala Xoom、Motorola Atrix、Droid Bionic 等等。
|   GL_EXT_texture_compression_s3tc |	S3 纹理压缩，但不支持 DXT 变体。 适用于 Nvidia Tegra2 平台的设备，包括Motorala Xoom、Motorola Atrix、Droid Bionic 等等。 如果应用程序需要 DXT 变体，请换用上一条描述符进行声明。
|GL_IMG_texture_compression_pvrtc |	PowerVR 纹理压缩。 适用于带有 PowerVR SGX530/540 GPU 的设备，比如 Motorola DROID 系列；Samsung Galaxy S、Nexus S 和 Galaxy Tab 等等。


## 2.新建一个 GLSurfaceView 的子类
```
public class ContentGLSurfaceView extends GLSurfaceView {

    private final GLSurfaceView.Renderer mRenderer;

    public ContentGLSurfaceView(Context context){
        super(context);
        // 创建 OpenGL ES 2.0 context
        setEGLContextClientVersion(2);

        //mRenderer = new BackgroundGLRenderer();
        mRenderer = new TriangleGLRenderer();
        // 给GLSurfaceview设置一个渲染器
        setRenderer(mRenderer);
        //关闭 GL的循环绘制  只在onSurfaceChanged 之后或者 调用了requestRender()之后才发生绘制  减少多余的绘制的CPU消耗
        setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
    }
}
```

## 3.新建一个渲染器  (代码的解释都在注释里了)
这里我写了两个渲染器，是学习时用的，第一个是绘制背景色的render，第二个这个这个类的子类，在背景色的基础上提供了三角形的绘制。
```
public class BackgroundGLRenderer implements GLSurfaceView.Renderer {

    final long uColor=0xff55ffff; // #AARRGGBB format

    float fRed = (float)((uColor >> 16) & 0xFF) / 0xFF;
    float fGreen = (float)((uColor >> 8) & 0xFF) / 0xFF;
    float fBlue = (float)(uColor & 0xFF) / 0xFF;
    float fAlpha = (float)(uColor >> 24) / 0xFF;


    //系统呼吁各重绘此方法GLSurfaceView。使用此方法作为主要执行点绘制（并重新绘制）图形对象。
    public void onDrawFrame(GL10 unused) {
        // 重绘背景色
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
    }

    /**
     * 在创建时，系统调用这个方法一次，GLSurfaceView。
     * 使用此方法来执行只需要发生一次的操作,如设置OpenGL的环境参数或初始化的OpenGL图形对象。
     * @param gl10
     * @param eglConfig
     */
    @Override
    public void onSurfaceCreated(GL10 gl10, EGLConfig eglConfig) {
        //使用刚刚我们预定义的背景色 每个参数的value  0-1
        GLES20.glClearColor(
                fRed,
                fGreen,
                fBlue,
                fAlpha);
    }

    //系统会调用这个方法的时候GLSurfaceView几何变化，包括尺寸变化GLSurfaceView或设备屏幕的方向
    // 。例如，当设备从纵向变为横向系统调用此方法。
    // 使用此方法可以在变化的响应GLSurfaceView容器。
    public void onSurfaceChanged(GL10 unused, int width, int height) {
        GLES20.glViewport(0, 0, width, height);
    }
}


/**
一个 三角形渲染器
**/
public class TriangleGLRenderer extends BackgroundGLRenderer implements GLSurfaceView.Renderer {

    private Triangle mTriangle;

    @Override
    public void onSurfaceCreated(GL10 gl10, EGLConfig eglConfig) {

        super.onSurfaceCreated(gl10,eglConfig);
        // 实例化这个三角形 triangle
        mTriangle = new Triangle();
    }

    @Override
    public void onSurfaceChanged(GL10 gl10, int i, int i1) {

        super.onSurfaceChanged(gl10,i,i1);
    }

    @Override
    public void onDrawFrame(GL10 gl10) {

        super.onDrawFrame(gl10);
        mTriangle.draw();
    }
}
```
## 4.剩下的就是放到Activity中展示了
```
public class OpenGLES20Activity extends Activity {

    private GLSurfaceView mGLView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 把一个GLSurafaceView设置到 contentview上去
        mGLView = new ContentGLSurfaceView(this);
        setContentView(mGLView);
    }
}
```

## 5.执行的最终效果
![](assets/opengl1.png)


##  过程中遇到的性能问题：
绘制一个背景色，在乐视1手机上，CPU消耗在0-8 %不等，我用tracevie去抓取了2160ms,其中有360ms是cpu繁忙的，都是在绘制背景里面消耗的。

调试进去发现，页面其实已经绘制完成还在绘制，所以这里故意使用这句代码来关闭多余的绘制。
```
setRenderMode(GLSurfaceView.RENDERMODE_WHEN_DIRTY);
```
然后性能解决了，今天也实现了一个简单的绘制背景色和三角形的代码。

##  引用
谷歌官方Open GL训练课程
https://developer.android.com/training/graphics/opengl/



