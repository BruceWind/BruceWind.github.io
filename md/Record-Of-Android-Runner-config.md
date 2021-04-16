title: 配置gitlab-runner服务器的一些问题记录
date: 2021/04/07 01:24:01
updated: 2016/12/21 22:52:11
categories:
- 技术
---

## 本文是关于dockker注册到gitlab服务器上时的一些问题。

### 1.连接不上公司的gitlab服务器。公司的gitlab服务器域名解析需要用一个内网DNS。

### solution: 
修改runner主机的DNS，让内网DNS作为first，阿里dns作为second.



### 2.docker注册到gitlab服务器上如何删除。

### solution:

如果是Specific runner，可以在项目的CI设置页面直接删除。如果是share runner,可能你不一定有gitlab权限。只能用docker命令去unregister.


### 3.较低版本的gitlab服务器该选择哪个版本的docker镜像？

### answer:


