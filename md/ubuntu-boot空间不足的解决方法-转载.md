title:  ubuntu boot空间不足的解决方法(转载)
date: 2015/11/05 10:15:50
updated: 2015/11/09 14:29:18
categories:
- 技术
---
转载说明: 以下方法我已经试验过了,的确是可行的:

``` shell

$  uname -a
Linux minjing 3.5.0-44-generic #67-Ubuntu SMP Tue Nov 12 19:36:14 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux
$ dpkg --get-selections|grep linux-image
linux-image-3.5.0-17-generic install
linux-image-3.5.0-39-generic install
linux-image-3.5.0-40-generic install
linux-image-3.5.0-41-generic install
linux-image-3.5.0-42-generic install
linux-image-3.5.0-43-generic install
linux-image-3.5.0-44-generic install
linux-image-extra-3.5.0-17-generic install
linux-image-extra-3.5.0-39-generic install
linux-image-extra-3.5.0-40-generic install
linux-image-extra-3.5.0-41-generic install
linux-image-extra-3.5.0-42-generic install
linux-image-extra-3.5.0-43-generic install
linux-image-extra-3.5.0-44-generic install
linux-image-generic install
$ sudo apt-get remove linux-image-3.5.0-17-generic

$sudo apt-get remove linux-image-3.5.0-39-generic

$sudo apt-get remove linux-image-3.5.0-40-generic

$sudo apt-get remove linux-image-3.5.0-41-generic

$sudo apt-get remove linux-image-3.5.0-42-generic

$sudo apt-get remove linux-image-3.5.0-43-generic

``` 
原文链接:

http://blog.csdn.net/hadahuluwa/article/details/7435070

在安装ubuntu11.10的时候，给/boot文件目录分配空间的时候，是100M，/boot可以单独分成一个区，也可以不单独分，在/（根目录）下也会自动为其创建一个boot目录。顺便提一下，linux分区是树结构的，/为根目录，在其目录下会分各个执行不同工作的目录，所以在分区的时候完全可以只分一个根分区和一个swap（虚拟内存）分区。如果分的细微一点，为/boot单独分区的话，100M足够，boot文件里面存放的是系统引导文件和内核的一些东西，这些东西100M是足够容纳的。而大家都知道linux内核一直在更新，跟新后，旧的内核就不在使用，但旧的内核文件还在boot里面，占据着空间，更新几次过后boot文件就会被占满，显示boot磁盘空间不足。这时为了更新需要将不用的内核文件删除，释放空间。
方法：



>- 1：
在终端下察看已经安装的旧的内核：
ctrl+alt+t——>进入终端——>输入命令：dpkg --get-selections|grep linux
如下：

![](http://my.csdn.net/uploads/201204/07/1333781139_9746.png)

>linux-后面带image的是旧的内核。因为我已经将旧的内核删除了，所以后面显示deinstall，不删除的话是install。
我们要做的就是将后面带image的linux内核删除。
# 
>- 2:删除操作：
sudo apt-get remove linux-image-(版本号)（就是上面带image的版本）
有卸载不完全的（有提示），可以用 sudo apt-get autoremove来删除。
Ok,这样boot空间就大大的有啦，呵呵。。。。。。
# 
以上是转载的原文的内容。

----------
## 转载的原文说的东西不够，无法对一些细节深入理解，所以如下是我的补充：
----------

### uname是查看当前的内核版本号。
# 
### 在Ubuntu内核镜像包含了以下的包。

linux-image-: 内核镜像

linux-image-extra-: 额外的内核模块

linux-headers-: 内核头文件

上面转载内容中已经说了删除内核镜像的方法，那我就说下删除内核头文件的方法。
# 
先查看内核版本header：

**dpkg --list | grep linux-headers**
# 
执行效果如下
``` shell
xx@xx-ThinkPad-E450:~$  dpkg --list | grep linux-headers
ii  linux-headers-3.19.0-26                              3.19.0-26.28                               all          Header files related to Linux kernel version 3.19.0
ii  linux-headers-3.19.0-26-generic                      3.19.0-26.28                               amd64        Linux kernel headers for version 3.19.0 on 64 bit x86 SMP
ii  linux-headers-3.19.0-28                              3.19.0-28.30                               all          Header files related to Linux kernel version 3.19.0
ii  linux-headers-3.19.0-28-generic                      3.19.0-28.30                               amd64        Linux kernel headers for version 3.19.0 on 64 bit x86 SMP
ii  linux-headers-3.19.0-31                              3.19.0-31.36                               all          Header files related to Linux kernel version 3.19.0
ii  linux-headers-3.19.0-31-generic                      3.19.0-31.36                               amd64        Linux kernel headers for version 3.19.0 on 64 bit x86 SMP
ii  linux-headers-4.2.0-16                               4.2.0-16.19                                all          Header files related to Linux kernel version 4.2.0
ii  linux-headers-4.2.0-16-generic                       4.2.0-16.19                                amd64        Linux kernel headers for version 4.2.0 on 64 bit x86 SMP
ii  linux-headers-4.2.0-17                               4.2.0-17.21                                all          Header files related to Linux kernel version 4.2.0
ii  linux-headers-4.2.0-17-generic                       4.2.0-17.21                                amd64        Linux kernel headers for version 4.2.0 on 64 bit x86 SMP
```

卸载的时候: 
> - 单独移除：
>  -  **sudo apt-get remove  粘贴上面的header版本名**
> - 我比较懒：不想一个个移除了， 如下命令：
	>  - **apt-get purge linux-headers-3.19.0-{26,28,31}  amd64        Generic Linux kernel headers**
	> - 同样删除镜像也可以偷懒：
	>  - **sudo apt-get purge linux-image-3.19.0-{26,28,31}**

看测试结果：
``` shell
xx@xx-ThinkPad-E450:~$  sudo apt-get purge linux-headers-3.19.0-{26,28,31}  amd64        Generic Linux kernel headers
正在读取软件包列表... 完成
正在分析软件包的依赖关系树       
正在读取状态信息... 完成       
下列软件包将被【卸载】：
  linux-headers-3.19.0-26* linux-headers-3.19.0-26-generic* linux-headers-3.19.0-28* linux-headers-3.19.0-28-generic* linux-headers-3.19.0-31*
  linux-headers-3.19.0-31-generic*
升级了 0 个软件包，新安装了 0 个软件包，要卸载 6 个软件包，有 7 个软件包未被升级。
解压缩后将会空出 241 MB 的空间。
您希望继续执行吗？ [Y/n] y
(正在读取数据库 ... 系统当前共安装有 322020 个文件和目录。)
正在卸载 linux-headers-3.19.0-26-generic (3.19.0-26.28) ...
正在卸载 linux-headers-3.19.0-26 (3.19.0-26.28) ...
正在卸载 linux-headers-3.19.0-28-generic (3.19.0-28.30) ...
正在卸载 linux-headers-3.19.0-28 (3.19.0-28.30) ...
正在卸载 linux-headers-3.19.0-31-generic (3.19.0-31.36) ...
正在卸载 linux-headers-3.19.0-31 (3.19.0-31.36) ...
```

# 
如果GRUB配置由于任何原因在删除旧内核后没有正确升级，你可以尝试手动用update-grub2命令来更新配置。

	$ sudo update-grub2
	
现在就重启来验证GRUB菜单是否已经正确清理了。

##  PS：
上面说了这个**boot空间问题**是更新系统内核后导致的，出现这个问题的时候，也同时出现另一个问题，就是**开机后的报错**，我看具体报错的日志是update的错误，删除了旧的版本后这个问题也没了。