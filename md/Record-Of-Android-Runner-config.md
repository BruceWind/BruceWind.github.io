title: 配置gitlab-runner服务器的一些问题记录
date: 2021/04/07 01:24:01
updated: 2016/12/21 22:52:11
categories:
- 技术
---

## 本文是关于runner服务器的dockker注册到gitlab服务器上时的一些问题。

### 1.连接不上公司的gitlab服务器。公司的gitlab服务器域名解析需要用一个内网DNS。

### solution: 
修改runner主机的DNS，让内网DNS作为first，阿里dns作为second.

如果你不想修改DNS可以尝试修改hosts：

登陆到你的docker container中，然后再尝试修改 hosts:

```docker exec -it <container_id_or_name> bash```


### 2.docker注册到gitlab服务器上如何解绑。

### solution:

如果是Specific runner，可以在项目的CI设置页面直接删除。如果是share runner,可能你不一定有gitlab权限。只能用docker命令去unregister.


### 3.gitlab服务器上的gitlab版本较低的话，该选择哪个版本的docker镜像？

### answer:使用9.0以前的gitlab估计只能使用**v1.11.1**, 可以使用命令拉`docker pull gitlab/gitlab-runner:ubuntu-v1.11.1`.



