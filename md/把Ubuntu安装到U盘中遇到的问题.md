title: 把Ubuntu安装到U盘中遇到的问题
date: 2016/04/07 20:20:15
updated: 2017/02/08 23:40:51
categories:
- 技术
---
   
    如果您通过搜索引擎搜索到此文，注意，请本文不是说怎么用U盘给电脑安装ubuntu，是把系统安装在U盘里，U盘就是我的电脑。
    
U盘中安装好ubuntu，由于是初次尝试，总是各种问题
首先U盘是单通道的闪存盘，由于单通道的问题，就像window那种，在windows下往外接移动存储设备拷贝大文件时会出现机器明显的卡顿的问题，明显这个问题，就是硬盘繁忙，IO性能消耗过高的问题。
# 
## 1.io流读写过高的问题
这个问题很严重，导致机器会卡死20秒左右。非常非常的严重了。
首先，我考虑到Swap对U盘IO的影响，我直接设置了Swap的使用优先级，设置了之后就没有在出现卡顿超过三秒的情况。
详细解决方案请参考我的另外一片blog，[链接在此，点我跳转](http://androidyuan.com/post/ubuntu%E4%BF%AE%E6%94%B9%E8%99%9A%E6%8B%9F%E5%86%85%E5%AD%98%E4%BD%BF%E7%94%A8%E9%87%8F)。

上面是关闭了ubuntu的虚拟内存，然后我发现chromium启动的时候会有明显的卡顿2秒左右，后来查询了下资料，chromium这种浏览器一般缓存机制都是自己定义的，需要手动去关闭这个程序的缓存，使用命令
``` shell
cd  /user/share/applications/
sudo gedit chromium-browser.desktop
```
在 `Exec=chromium-browser %U `这行代码后，添加`-disable-local-storage`。
即可关闭chromium的硬盘缓存。
# 
其实，主要是因为U盘的主控芯片是三星的一个比较垃圾的主控，这个主控，IO读写是单通道的，没办法，多个程序去读写就会发生IO繁忙的情况。三星也是要考虑到U盘尺寸的问题，想要把U盘做的更小总要牺牲芯片的性能。
# 
可以预测，如果把ubuntu安装到CZ88的话，就会很快的，那个U盘的主控就不在是单通道的了。但是为什么我用CZ88,因为那个太长了，插在电脑上非常不方便电脑的移动。相信以后U盘厂商还是可以做的这么小的同时读写也是多通道的。但是目前，我用三星的那个小U盘已经几乎满足我的开发需求，目前已经鲜有卡顿问题。
# 
## 2.在mac上也遇到了网卡驱动的问题
无法驱动无线网卡，我用命令行读取了硬件的型号，是博通的无线网卡，打开`新立得软件包`搜索`bcm`，搜到了博通的网卡驱动，安装下即可，安装好后，mac无线网卡也工作了，换了一台thinkpad后，ubuntu也会自动切换驱动，所以这个根本不是问题。
或者先下载无线驱动，然后再U盘拷贝进来用 `dpkg -i  filename`来安装。**下载地址：**
[http://packages.ubuntu.com/trusty/amd64/bcmwl-kernel-source/download](http://packages.ubuntu.com/trusty/amd64/bcmwl-kernel-source/download)

##  3.各个品牌电脑的boot menu 按键

<table class="tableizer-table">
<thead><tr class="tableizer-firstrow"><th>组装机主板</th><th>&nbsp;</th><th>品牌笔记本</th><th>&nbsp;</th><th>品牌台式机</th><th>&nbsp;</th></tr></thead><tbody>
 <tr><td>主板品牌</td><td>启动按键</td><td>笔记本品牌</td><td>启动按钮</td><td>台式机品牌</td><td>F12</td></tr>
 <tr><td>华硕主板</td><td>F8</td><td>联想笔记本</td><td>F12</td><td>联想台式机</td><td>F12</td></tr>
 <tr><td>技嘉主板</td><td>F12</td><td>宏基笔记本</td><td>F12</td><td>惠普台式机</td><td>F12</td></tr>
 <tr><td>微星主板</td><td>F11</td><td>华硕笔记本</td><td>ESC</td><td>宏基台式机</td><td>ESC</td></tr>
 <tr><td>映泰主板</td><td>F9</td><td>惠普笔记本</td><td>F9</td><td>戴尔台式机</td><td>F12</td></tr>
 <tr><td>梅捷主板</td><td>ESC或F12</td><td>联想Thinkpad</td><td>F12</td><td>神舟台式机</td><td>F8</td></tr>
 <tr><td>七彩虹主板</td><td>ESC或F11</td><td>戴尔笔记本</td><td>F12</td><td>华硕台式机</td><td>F12</td></tr>
 <tr><td>华擎主板</td><td>F11</td><td>神舟笔记本</td><td>F12</td><td>方正台式机</td><td>F12</td></tr>
 <tr><td>斯巴达卡主板</td><td>ESC</td><td>东芝笔记本</td><td>F12</td><td>清华同方台式机</td><td>F12</td></tr>
 <tr><td>昂达主板</td><td>F10</td><td>三星笔记本</td><td>F12</td><td>海尔台式机</td><td>F12</td></tr>
 <tr><td>双敏主板</td><td>ESC或F11</td><td>IBM笔记本</td><td>F12</td><td>明基台式机</td><td>F8</td></tr>
 <tr><td>翔升主板</td><td>F11或F12</td><td>富士通笔记本</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>精英主板</td><td>ESC或F11</td><td>海尔笔记本</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>冠盟主板</td><td>F11或F12</td><td>方正笔记本</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>富士康主板</td><td>ESC或F12</td><td>清华同方笔记本</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>顶星主板</td><td>F11或F12</td><td>微星笔记本</td><td>F11</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>铭瑄主板</td><td>ESC</td><td>明基笔记本</td><td>F9</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>盈通主板</td><td>F8</td><td>技嘉笔记本</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>捷波主板</td><td>ESC</td><td>Gateway笔记本</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>Intel主板</td><td>F12</td><td>eMachines笔记本</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>杰微主板</td><td>ESC或F8</td><td>索尼笔记本</td><td>ESC</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>致铭主板</td><td>F12</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>磐英主板</td><td>ESC</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>磐正主板</td><td>ESC</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
 <tr><td>冠铭主板</td><td>F9</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td></td></tr>
</tbody></table>


PS: 苹果电脑：option按键。
# 
不管mac还是PC，开机前，插上U盘，按住boot menu 键不松开，再按一下开机键，到选择界面即可。

# 
---------------------------

这篇博客和另外两篇博客都是在mac上使用U盘中的ubuntu写的，几乎毫无卡顿问题。