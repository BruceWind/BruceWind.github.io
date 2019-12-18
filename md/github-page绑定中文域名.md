title: github page绑定中文域名
date: 2016/05/04 15:17:18
updated: 2016/05/04 15:24:18
categories:
- 技术
---
1.URL转发 方案，先用一个英文域名绑定到github page上，然后再用dns后台管理，配置URL转发到这个英文域名，对于很多人来说，自然手头有英文域名，所以开一个二级域名出来，让dns自动转发到这里来即可。
2.上面方案可行有两点， 第一 你手里有另外一个英文域名，第二你的域名商后台支持配置URL转发。
由于我购买域名的商无法配置URL转发，所以第一种方案不行。
但是查了下，发现可以把中文转成punycode编码方案，配置好了之后，需要在域名提供商那里配置一个支持中文域名的DNS即可。
我用的DNS如下：

    dns21.hichina.com
    dns22.hichina.com
    
中文域名转码：http://www.cnkuai.cn/zhuanma.asp