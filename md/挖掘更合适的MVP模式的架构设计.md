title: 挖掘更合适的MVP模式的架构设计
date: 2015/10/19 19:09:30
updated: 2015/10/20 08:40:54
categories:
- study
---
	这篇博客是上个月，在我的CSDN上发表的，后来被极客头条和CSDN的博乐推荐了，不到24小时阅读量就超过1000，所以现在重新发表到我的这个网站上来。 


    关于MVP，关于android，不得不说这篇博客已经来的很晚了，这篇博客早就想写了，一直都在偷懒，就不给自己这么久的偷懒找借口了。虽然这篇文章po出来的比较晚，但是我所接触的程序员一些朋友之类的，大家也是最近才开始听说mvp ，还没有真正的应用到项目中去。

14年年底的时候各大android的论坛博客，关于android的架构的思考越来越多，我也一直在关注，也在14年年底开始模仿着去写，其实mvp，不算什么新的架构，都是做了很多年的cs模式的应用的win开发者，wpf开发者玩烂了的东西。 mvp的概念什么的都不用说了，大家应该都看了很多遍了，多说都是废话。

# 

那么我们现在来在我们没接触到mvp之前大家都是用什么设计模式。开始，虽然很多人喜欢说自己的项目是MVC，但是话说回来，what ，where ，why。什么是MVC，你的项目里那里是controller，哪里是view，为何需要用mvc设计模式。

# 
编程历史上各种书籍大家都喜欢用的3w的问法，看到了没，这次我也装了一手好B，hahaha。
	> - what  什么是MVC？mvc是一种设计模式，大多数web项目都是采用mvc的设计模式架构，thinkphp，asp.net，以及最新的razor引擎等等。详细的c v 关系什么的大家几乎都能说的很清楚，这个不用赘述。
	>- where  你的项目里哪里是mvc给我解释下？这个。。。  一般人都是这么回答： activity fragment就是view，model就是我json解析出来的javabean，对吧。但是，controller呢？wocao，好像没有controller。
	> - why  为什么要用mvc设计模式？一般人也说不清这个问题，很多人都是回答，这是做项目必须要用的，这是代码的规范等等扯一堆没用的，反正回答的他自己也觉得好像不对。这个问题一般要归结与设计模式的学习与应用，用过一些设计模式，对比好坏之后，你才知道为何需要设计模式，为什么要用设计模式，设计模式存在的意义是什么？  就一句话：为了将低代码耦合度。什么增加可读性的话，是靠你平时的代码风格，设计模式会提高一点可读性，但是 ，这或许不是主要的存在意义。

好了3W问题说完了。
# 


我的总结是：14年往前，大部分android开发都是在用自己所谓的MVC ，但是多数人都找不到controller，是因为controller和view在一起了，从两方面来说这种代码的缺点：1.你这样不算是真正的mvc模式，2.设计模式的目的在于解耦，这样肯定就代码耦合警告。

	在thinkphp里，每一个请求都是一个action，每个action最后都指向了一个controller，但是android中没有请求，android里是有action的，但是action的概念和web的action又是两个概念。android的源码中，还是有一些mvc的，比如adapter就是一种 controller。view就是act，frag，model那就不用说了。而大家在2014年之前大家用的架构就是这样子，就是几个BaseActivity，BaseFrag，这样子，这样子是工厂模式。

问一下HOW？  对于android的本身的api，还有act生命周期这些，我们用mvc真的很合适吗？  不合适，确切的和你说，那么，哪些设计模式更适合客户端的开发呢？ 是mvvm，mvp 合适。请看下一段：

	话题说回“WHY”的问题，why 我们要用设计模式？是为了装B？no，我们为了降低代码耦合度。 综上所述，可得：设计模式用什么无所谓，只要是适合自己的就行了，不要为了装逼忘记初心，哈哈哈，用词有点。。。那么就是说，不管你用MVC，MVP，MVVM ，或者事mvvm的精简版MVM，亦或者是MVP精简版都行，解耦的目的达到了，也最大的节约了开发时间。 就好像谷歌官方建议我们放弃 getter setter方法一样，而是通过点属性直接访问字段，使用getter setter方法比使用点属性得到字段的速度要慢了一点点，虽然只是一点点，但是循环多次就会又0.几秒的速度影响，放弃原来java的写法，用android更合适的方法去写代码，放手吧，CPU耗时永远比你的代码习惯重要。

回归文章的标题，我们来聊了聊MVP，我们把view和controller写到一起的写法已经受够了吧，有些页面很大，我写过一个页面，公司没有产品经理，完全靠ui定页面，卧槽，非要把微信支付和支付宝支付还有其他一些复杂的判断都坐在一个页面，吊起支付客户端走完流程，回调回来，其中还有一些回调回来的channel等等，还有回调状态的判断，卧槽，光这些，代码都够累的，还有其他的一些数据显示判断，好多网络请求，代码太多太杂了是吧 ，caocaocaocao。所以，还是mvp好点，具体mvp标准的代码的模式结构请自己去看其他博客，我的博客不想扯一些其他博客提过很多遍的概念，view presenter的关系也不想再重复，这样只能增加我这篇博客的字数而已。

# 

那么问题来了，mvp有没有缺点呢？  

	你是一个攻城狮 你看事物就要客观，你是一个程序员你可以不客观，不要以为人家推崇他，你就崇拜它，必须正视这玩意的缺点，mvp最规范的写法很麻烦，就算在我写过几十个规范的mvp应用的页面之后，我依旧觉得这货很麻烦，虽然代码结构很清晰，但是开发时间太长了，心累。总结： mvp优点是会让代码机构清晰，缺点是降低开发效率。话说怎么理解编程能力的好坏怎么表示， 我的理解编程就是解决问题，解决问题的速度和优雅度才是代表一个人的编程能力。

如何既保证代码的结构清晰，又不降低开发速度呢？

	 回想下我们之前学过用过的那些设计模式哪一种是加快开发效率的，又适用于这种页面呢？ 好像工厂模式的是这样子的，工厂模式就像工厂一样，生产效率很高很高，快到你想不到。  但是好像mvp的规范写法的话又不是很好应用进来，caocaocao，android的view就是act跟其他平台比较不同，页面何时被释放你完全控制不了，activity基类的 结合好像不是很好结合，presenter是可以大量生产出来，我也不想每次都在act中定义一个presenter的字段，这样好奇怪。那么这就难搞了。。。。。

研究很久，降低mvp的规范度，这个是可以考虑的，毕竟设计模式的目的就是为了降低耦合度不是为了装逼，没有必要非要严格遵守mvp， 可以降低mvp的规范程度来加速开发。  但是用工厂生产的方式的完美结合，不是很好搞。在之后的纠结中，有空就看下一些国外的框架搭建的方法，最后我在一个美帝的攻城狮的github下找到一种比较特别的mvp的体验，其中他有几句代码让我发现解决问题的诀窍。下面贴我的最终的定版的例子代码：

1.这里是MainActivity，
```	java
public class MainActvity extends BaseCommActivity<MainPresenter> implements IMainView
{
    @ViewInject(R.id.lay_main)
    View lay_main； //android中本身一个layout不用于一些计算所以不需要在命名中提示类型像str_title这种  你不管是RelativeLayout还是LinearLayout，一般只是用于点击，所以统统以lay开头命名 不管类型
    @Override
    protected Class<MainPresenter> getPsClass() {
        return MainPresenter.class;
    }
    @Override
    protected int getLayoutId() {
        return R.layout.activity_main;
    }
    @Override
    protected void initAllWidget() {
        lay_main.setOnClickListener(this);
    }
    @Override 
    protected void clickView(View v)
    {
        switch(v.getId()) {
            case R.id.lay_main: 
            { 
                showMsg(); 
            } break; 
        }
    } 
    
    @Override 
    public void showMsg() { //测试 
             toast("is showmsg methon"); 
    }
}

```

2.请看IMainView
``` java
public interface IMainView extends IBaseCommView {
    //在原有IBaseView 的初上加一个方法  要求MainActivity必须重载这个方法
    public void showMsg();
}
```






3.MainPresenter

``` java 

public class MainPresenter extends BaseCommPresenter {
    //请求
    private static final int REQ_GETAPPLIST_MSG = 0x002123;
    private static final int RES_GETAPPLIST_MSG = 0x002124;
    private final String SOFT_JP_FLAG = "soft_jp_flag";
    private static final String CURRENT_PAGE = "current_page";
    private static final String PAGE = "page_size";
    private static final String SOFT_TYPE = "soft_type";
    @Override
    public void handMsg(Message msg) {
        switch (msg.what) {
            case REQ_GETAPPLIST_MSG: {
                MainRequest req = new MainRequest();
                req.put(SOFT_JP_FLAG, 2 + "");
                req.put(SOFT_TYPE, 1 + "");
                req.put("soft_jh_type", 0 + "");
                String mac = WifiUtil.getMacAddress(iView.getActivity());
                req.put(CURRENT_PAGE, 1 + "");
                req.put(PAGE, 10 + "");
                req.put("mac", mac);
                req.setResPonseMsgWhat(RES_GETAPPLIST_MSG);
                sendHttpPost(req, MainResponse.class);
                iView.showProgressBar();
            }
            break;
            case RES_GETAPPLIST_MSG:
            {
                iView.hideProgressBar();
                if(msg.obj instanceof MainResponse)
                {
                    MainResponse res=(MainResponse)msg.obj;
                    if(res.isSuc()) {
                        AppMainModel mainModel = res.getData();
                        iView.toast(mainModel.data.size() + "");
                    }
                    else{
                        iView.toast(res.getMsg());
                    }
                }
            }
            break;
        }
    }
    @Override
    public void initData(Bundle saveInstnce) {
        getHandler().sendEmptyMessage(REQ_GETAPPLIST_MSG);
    }
}

```


可以看代码 activity中没有MainPresenter这个字段，只是在getPsClass() 的时候返回的Presenter的类型，这个getPsClass() 的调用是在activity的基类里面写的，在基类中实例化了presenter，实例化之后，presenter会执行绑定IView，IView就是this了，基类的act在基类里的消息机制的处理方法直接传递到了presenter中执行了，所以，这样写Mainactivity写的代码就超级少了。管理都在基类里面了。这种写法真的好爽！哈哈哈！

presenter应该负责一些逻辑处理，这是毋庸置疑，但是 有些逻辑又需要activity的参与，这也会带来的问题事 有些逻辑是放在activity好还是presenter好，那么我们犹豫该放在哪里的时候，只需要根据一点判断，act是 view，frag是view，他应该只是负责一些控件，presenter是管理者，他就不要直接去管理view，这样子很多东西就想通了。

但是android比较特别的是act，frag都有自己的生命周期，这就是android特别的地方，跟做网站后台的区别就拉开了，具体生命周期内的一些操作，就要看你的个人喜好去分配了。


	如果你也在研究mvp的更好的方式，更好的使结构更清晰，更加加快开发速度，那你看下我的代码，找下是否有你需要，来解决你的一些困惑，我也是才疏学浅，希望大家多多指点相互学习。  或许MVVM在数据绑定这块比mvp更适合，但是 mvp的自由行很大有些细节还是需要你自己的去推敲，别人说的再好也只是说个概念罢了。
	
代码地址：   
	
	 http://code.taobao.org/svn/frame_mvp/

代码挂到了 taocode上面， 用svn检出即可，我的github上不是这个框架，是我改版的另外一个老外的mvp框架。



PS：

	最后补充几句，其实设计模式你玩的再好也只是达到了解耦的目的，但是代码的可读性的问题还是需要你业余多多学习下好的写代码方式，不要明明都是 button1 button2  ，写switch case 1  case 2  case3  回头来看你的btn 看你的case  23456789  鬼知道你表达什么意思，你个SB。多去分析下哪些开源的框架，既能懂得原理，学到知识，还能学习到好的代码风格。 就像 你看我的代码没在view  presenter中解析服务器返回的json一样，我都写在数据请求里面了，服务器本身返回的就应该做到很标准，做到你不需要判断全都可以转model ，转java bean，这才是好的服务器开发人员。  view 和 presenter应该做他应该做的事情，不应该去负责json解析的这种事情，我的swich case  也没用123456，而是用常量代替，  我不需要去为每一个case写注释，也可以清晰的看到这行代码就知道他表达什么意思，很多代码风格还是要去仔细推敲。 我不多说了。  

