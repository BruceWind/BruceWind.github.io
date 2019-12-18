title: mac引导ubuntu双系统
date: 2016/05/22 23:55:13
updated: 2016/12/14 22:24:04
categories:
- 技术
---
# mac引导ubuntu双系统

    OS X的易用程度已经是非常之高了，躺在床上这超赞的触摸板，卧槽，爽的合不拢腿有没有，mac真的是适合在床上玩的笔记本，任何笔记本都无法超越。
    
好变态! 地球人好可怕,怎么会有人给mac安装ubuntu擦擦擦!

习惯了linux的啥都用命令的习惯，mac还是让我觉得还是欠缺，没有我的ubuntu玩的6,安装个软件都那么的费劲，在ubuntu一个命令搞定多6。对于开发来说，实在懒得花时间和经历在找软件下载软件和破解收费软件上面，mac软件收费情况确实严重。没有`apt-get`这种方便的安装命令,软件更新的下载也没有国内镜像服务器。

# 遂，决定还是安装个ubuntu吧。
安装ubuntu太容易，老司机轻车熟路，提着枪就上。但是难在引导上面。你以为mac是普通的笔记本，还有BIOS。不是所有的笔记本都有BIOS。
先安装老方法U盘安装ubuntu，画一个分区，重启，进入安装界面。配置swap，主目录分区几个步骤......就不详细的在这篇文章中写了，没有意义觉得，这种教程外面一搜一堆。

    安装的区别在于:普通笔记本是用bios，mac是用option按键的区别罢了。
# 
我想写的就是国内的目前的mac上安装ubuntu的难题，就是引导问题，国内的网站几乎都搜的差不多了，没有好的方案，最后还是用英文去google，在一个hack 的网站上找到方案。
# 
安装完成，只能进入到ubuntu了。发现最新的os x系统根本无法引导，重启之后进入不了os x了。
# 
用ubuntu自带的efi引导驱动
```
sudo apt-get install efibootmgr

sudo efibootmgr

sudo efibootmgr -o 0,80
```
这里把80放在前面就好了。重启就进入到os x 了。那么问题来了，再重启就还在osx 没有多系统选择界面，卧槽，这双系统装的，坑爹了。

# 使用rEFInd修复引导问题

    这个rEFInd在mac mini 和air上都测试过了一遍.
这个单词怎么大小写这么特别，对你没看错，就是真的古怪。
# 
下载好rEFInd后解压出来，启动iterm2,把这个文件拖进去。输入密码关机，记住是关机，不是重启。

再开机就可以看见丑陋的refind的界面了，其实rEfInd的命名也是精妙，既可以refind 有带有EFI这个词。666.
说到底这个工具就是帮你利用efi引导找到多系统。完了。才能够名字就可以看出来。命名之绝妙。

![](assets/refind.png)

说一些题外话，refind的界面确实丑陋，简直看不下去,怎么能配的上精美的os x和ubuntu。卧槽，不过还好官方提供了自定义UI，替换图片，更改颜色，背景色等等，总之你想要的效果一定能搞定。照片中是我替换了苹果图标的，不然简直是丑，这里有连个ubuntu的原因应该是因为还有个ubuntu的swap分区导致的。
    

这里有个sorceforget的下载地址，话说现在百度云的速度越来越差，sourceforget的速度从没降下来过。
[rEFInd下载地址在此，点我跳转》》》》](https://sourceforge.net/projects/refind/?source=typ_redirect)
## 移除refind
上面是说怎么解决这些问题，接下来，我需要说怎么删除refind这个软件。
>- refind比较智能如果你只有一个系统，那么他永远不会出现，所以你不需要移除他，你只需要remove那个linux分区即可。
> - 再或者你还是很懒，你需要在Mac 的启动磁盘设置中点击当前的mac磁盘，重启就没有了。
> - 如果你还是要remove他，那么，给你个refind官方的WIKI去撸吧。[链接再次，点我跳转](http://www.rodsbooks.com/refind/installing.html#uninstalling)

## 移除之后重新安装refind
    
按照前面写的安装过程，再把安装过程走一遍。

--------------------

## 安装遇到的一些问题：
> +  **error "Could not set boot device property: 0xe00002bc"**
这个是在 `OS X 10.11`上遇到的，需要关闭系统完整性投影的功能才可以避免这个错误。
解决方案是，关机，按住command ＋ R开机，然后到实用工具-->终端，输入命令：`csrutil disable`,再输入`reboot`重启。进入os x之后重新安装一下即可。
> + **网卡驱动问题**：mac mini上确实没有无线网卡驱动了，但是我没有选择按照网上说的去某个社区下载个博通网卡驱动命令安装一下，我选择插上网线，用`apt-get` 搜索一下bcm，找到一个驱动安装一下就完了。无线就可以用了。 mac air的驱动问题没有遇到，发现最新版的ubuntu带了bcm网卡驱动，安装界面问我是否安装，我打上勾，安装完成进入系统后即可使用了。
或者先下载无线驱动，然后再U盘拷贝进来用 `dpkg -i  filename`来安装。**下载地址：**
[http://packages.ubuntu.com/trusty/amd64/bcmwl-kernel-source/download](http://packages.ubuntu.com/trusty/amd64/bcmwl-kernel-source/download)

> + 亮度不受控制问题 
添加文件20-intel.conf 到 /usr/share/X11/xorg.conf.d/下面。

```
Section "Device"
        Identifier  "card0"
        Driver      "intel"
        Option      "Backlight"  "intel_backlight"
        BusID       "PCI:0:2:0"

EndSection
```

# 
一些参考：
    >- http://www.howtogeek.com/187410/how-to-install-and-dual-boot-linux-on-a-mac/
    >- https://wiki.archlinux.org/index.php/REFInd_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)
    >- http://www.howtogeek.com/187410/how-to-install-and-dual-boot-linux-on-a-mac/
    > - https://apple.stackexchange.com/questions/209272/how-do-i-get-refind-working-with-os-x-10-11-el-capitan