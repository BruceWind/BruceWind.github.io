title: 无显示器安装raspbian
date: 2016/12/19 00:45:19
updated: 2017/01/02 18:27:38
categories:
- 技术
---
> 文章写了很久了，一致都没亮出来。

下载 [raspbian jessie lite](https://www.raspberrypi.org/downloads/raspbian/) （无GUI版本），用一个老旧的2GB内存卡，烧录，空间都剩余800M左右。
    
    最喜欢无GUI版本，命令行舒服。
## 1.烧录SD卡
```
$ cd 下载
$ sudo dd if=2016-xx-xx-raspbian-jessie-lite.img of=/dev/sdb bs=4M
//最新的目前是什么版本我已经搞不清楚了。
```

## 2.配置WIFI和连接密码 

烧录完成之后，重新插拔SD卡。
然后看到有个1.3G的盘子里，一堆的linux文件。
#  
**/etc/wpa_supplicant/wpa_supplicant.conf**这个文件才是配置wifi和密码的。

```
sudo gedit /etc/wpa_supplicant/wpa_supplicant.conf
```
在文件的最后一行之后追加：

```
network={
    ssid="testing"
    psk="testingPassword"
}
```

> 有些同学，咳咳，那什么，自己家的wifi名字起得太长了，怕拼错的，ubuntu或者mac下可以用iwconfig命令获取一下，然后**ctrl+shift+C**拷贝一下，再写入到这个文件中。

## 3.启用ssh
a.在那个盘子下创建一个空白文件即可。

```
sudo vi etc/SSHFLAG
```
# 
b.修改一个文件/etc/rc.local 追加如下代码在第一行。
```
if [ -e /etc/SSHFLAG ]; then
  /usr/sbin/update-rc.d -f ssh defaults
  /bin/rm /etc/SSHFLAG
  /sbin/shutdown -r now
fi
```
从电脑上拔掉sd卡，插RPi上，开机。
# 
c. 启动后，等待重启（也许两分钟），这之后你可以ping到RPi的IP，如果确定，关闭RPi，拔掉SD卡，再次编辑文件/etc/rc.local与电脑。
插入如下代码，到第一行。
```
sudo vi /etc/init.d/ssh start
```
# 

## 4.使用nmap扫描 局域网中 是否存在树莓派设备

```
$ sudo nmap 192.168.199.1-255

Starting Nmap 6.47 ( http://nmap.org ) at 2016-12-19 01:01 CST
Nmap scan report for Hiwifi.lan (192.168.199.1)
Host is up (0.00088s latency).
Not shown: 993 closed ports
PORT     STATE SERVICE
53/tcp   open  domain
80/tcp   open  http
81/tcp   open  hosts2-ns
82/tcp   open  xfer
83/tcp   open  mit-ml-dev
443/tcp  open  https
5000/tcp open  upnp
MAC Address: D4:EE:07:13:C9:46 (Hiwifi Co.)

Nmap scan report for 192.168.199.117
Host is up (0.0013s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
MAC Address: B8:27:EB:46:73:43 (Raspberry Pi Foundation)

Nmap scan report for android-a3929929ec50096a.lan (192.168.199.207)
Host is up (0.0022s latency).
All 1000 scanned ports on android-a3929929ec50096a.lan (192.168.199.207) are closed
MAC Address: 80:41:4E:D5:EE:13 (BBK Electronics)

Nmap scan report for raspberrypi.lan (192.168.199.218)
Host is up (0.0013s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
MAC Address: B8:27:EB:13:26:16 (Raspberry Pi Foundation)

Nmap scan report for wei-MacBookAir.lan (192.168.199.124)
Host is up (0.0000070s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 255 IP addresses (5 hosts up) scanned in 193.37 seconds'


```

单独扫描117这个ip，查看是否开启了ssh的22端口。
```

$ sudo nmap -O 192.168.199.117

'
[sudo] wei 的密码： 

Starting Nmap 6.47 ( http://nmap.org ) at 2016-12-19 01:23 CST
Nmap scan report for raspberrypi.lan (192.168.199.117)
Host is up (0.0050s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
MAC Address: B8:27:EB:46:73:43 (Raspberry Pi Foundation)
Device type: general purpose
Running: Linux 3.X
OS CPE: cpe:/o:linux:linux_kernel:3
OS details: Linux 3.11 - 3.14
Network Distance: 1 hop

OS detection performed. Please report any incorrect results at http://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.84 seconds'


```
日志上显示已经开启了这个端口，接下来。我们ssh登录一下吧。

```
$ ssh pi@192.168.199.117
'The authenticity of host 192.168.199.117 (192.168.199.117) cant be established.
ECDSA key fingerprint is SHA256:337sCVUu6oxJn7sCEy1VbNeijLqdajX/JSGkiCC7jL0.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.199.117' (ECDSA) to the list of known hosts.
pi@192.168.199.117''s password: 

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Fri Nov 25 18:01:05 2016

SSH is enabled and the default password for the 'pi' user has not been changed.
This is a security risk - please login as the 'pi' user and type 'passwd' to set a new password.


pi@raspberrypi:~ $ cpuinfo
-bash: cpuinfo: command not found
pi@raspberrypi:~ $ cpuinfo
-bash: cpuinfo: command not found
pi@raspberrypi:~ $ lscpu
Architecture:          armv7l
Byte Order:            Little Endian
CPU(s):                4
On-line CPU(s) list:   0-3
Thread(s) per core:    1
Core(s) per socket:    4
Socket(s):             1
Model name:            ARMv7 Processor rev 4 (v7l)
CPU max MHz:           1200.0000
CPU min MHz:           600.0000
'
```
--------------------------
晒一张大图。

![](assets/no_display_install_rpi.png)

