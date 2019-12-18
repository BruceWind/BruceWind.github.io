title: 局域网内配置AdGuard DNS server遇到的问题
date: 2019/08/30 13:52:18
updated: 2019/08/30 13:55:30
categories:
- 技术
---
本文只记录在局域网遇到的问题，类似搭建过程的博客一搜一大堆。机器是ubuntu 16。


## 1.报53端口被占用的问题
a.maybe is a bug, 更新到0.95之后的版本，不要要低于0.95, 这里有个历史bug.
如果你已经安装了那么删除他：
```
sudo ./AdGuardHome -s uninstall 
```


说不定真的有程序占用了端口，用这个命令去查一下那个端口占用了。
```
sudo netstat -anlp | grep -w LISTEN  

```

b.如果还不行，请安装**fiewalld**，然后设置几个端口可以被使用。
```
sudo apt install firewalld 

#firewalld放行53端口
sudo firewall-cmd --zone=public --add-port=53/tcp --permanent
sudo firewall-cmd --zone=public --add-port=53/udp --permanent
sudo firewall-cmd --reload
#iptables放行53端口
sudo iptables -A INPUT -p tcp --dport 53 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 53 -j ACCEPT

#放行3000端口（AdGuardHome初始化需要使用）
#firewalld放行3000端口
sudo firewall-cmd --zone=public --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
#iptables放行3000端口
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
service iptables save
```
我自己这里是特么的ubuntu的dnsmasq程序占用了端口。
```
sudo vi /etc/NetworkManager/NetworkManager.conf

//注释这行重启server即可
#dns=dnsmasq
```

## 2.启用关闭 服务
``` shell 
//启动
systemctl start AdGuardHome
//

开机自启

systemctl enable AdGuardHome
//重启
systemctl restart AdGuardHome
//停止
systemctl stop AdGuardHome
```




