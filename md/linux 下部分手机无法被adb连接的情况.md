title: linux 下部分手机无法被adb连接的情况
date: 2015/10/25 01:46:48
updated: 2015/10/25 02:05:35
categories:
- 技术
---
# linux 下部分手机无法被adb连接的情况

# 

android机器在linux 本身就不会像windows那样子比较麻烦的需要驱动才能链接，都是linux 大家都比较友好，在linux 的机器上 还没遇到过需要安装驱动才能adb连接进来的机器。

### MX4无法连接 的问题

但是，现在现在是凌晨2点中，在家写代码，找女票的手机，居然发现无法连接了，百思不得姐，找个办法重新扫描下devices就好了。

有个命令，重新走一下，会触发adb的重启。 然后手机就会弹出是否允许调试的弹窗。

``` shell 
adb devices -l

//产生的结果如下

adb server is out of date.  killing...
* daemon started successfully *
List of devices attached 
750ABL4FX6DD           offline usb:1-4

```

### 中兴无法连接的问题
这个问题比较棘手，不是简单的使用命令就能高定的

需要将设备的usb vender id加入到 .android/adb_usb.ini中，无法连接的设备，一般都是国产手机。步骤如下：
> - 1.打开终端，输入：system_profiler SPUSBDataType     命令 可以查看连接的usb设备的信息
	比如我手里的中兴手机，最后查看到中兴设备的 vender id: 0x19d2 Product Id:0x2207
	也可以：关于本机-->更多信息->概系统览->系统报告->usb->你所连接的device-->供应商ID(Vendor ID)
> - 2.输入： vi ~/.android/adb_usb.ini 命令，在打开的 adb_usb.ini文件中添加0x19d2， 然后保存退出，然后重启一下adb sever进程，输入以下命令：adb kill-server，重启adb服务即可。
> - 3.进入android开发环境发现，已经可以找到的中兴手机了

在终端，输入adb提示 command not found.需要将 adb的路径加入到配置文件里，终端编辑 ~/.bash_profile文件
export PATH=/Users/qc/Desktop/adt-bundle-mac/sdk/platform-tools/:$PATH
保存后重启终端，即可。


### 如果还是不能解决： 
	有时 adb devices不能显示连接设备，需要拔掉数据线，多插几次，并且退出终端，然后重新打开，再输入命令就能发现连接的设备

	并不是所有的android机器都能解决，比如有的手机有供应商ID，缺少产品ID，依然无法识别。