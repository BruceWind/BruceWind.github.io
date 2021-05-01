title: 配置gitlab-runner服务器的一些问题记录
date: 2021/04/07 01:24:01
updated: 2021/05/01 22:52:11
categories:
- 技术
---

## 本文是关于runner服务器的dockker注册到gitlab服务器上时的一些问题。

### 1.连接不上公司的gitlab服务器。公司的gitlab服务器域名解析需要用一个内网DNS。

solution: 
修改runner主机的DNS，让内网DNS作为first，阿里dns作为second.

如果你不想修改DNS可以尝试修改hosts：

登陆到你的docker container中，然后再尝试修改 hosts:

```docker exec -it <container_id_or_name> bash```


### 2.docker注册到gitlab服务器上如何解绑。

solution:

如果是Specific runner，可以在项目的CI设置页面直接删除。如果是share runner,可能你不一定有gitlab权限。只能用docker命令去unregister.


### 3.gitlab服务器上的gitlab版本较低的话，该选择哪个版本的docker镜像？

answer:使用9.0以前的gitlab估计只能使用**v1.11.1**, 可以使用命令拉`docker pull gitlab/gitlab-runner:ubuntu-v1.11.1`.


### 4.docker pull runner镜像或者,runner运行时再pull一个其他镜像, 这些操作都很慢怎么办?

solution: 既然您在中国大陆做IT, 那就自备梯子. 要么在runner物理机器上开个梯子客户端,这个我没试过,不确定docker能不能使用物理机器的代理环境. 

另外一个方案是公司网络提供代理. 或者自备 **科学上网路由器**, 把runner物理机器网线插在路由器上,. 推荐您自行研究下 **merlin** or **openWRT**.  这种方案同时坚固您的日常开发网络环境.

### 5.如何做监控性能,掉线提醒等等?

answer: 我是用nodeserver做的,有各种性能监控,磁盘, 掉线发邮件等等功能. 不过中国大陆block了这个网站, 监控服务可能会挂.

### 6.能否在CI中跑Android UI Test？

answer ： 大部分情况下不能，因为你用的是虚拟化服务，因为虚拟化都是用docker镜像，别人已经配置好了，你无需再修改，比较方便。
如果必须要UI Test只能脱离 docker或者k8s的虚拟化环境，去整一个真机，自己配置环境，然后用apt 从软件中心安装gitlab-runner，把该物理机注册到gitlab服务器上。