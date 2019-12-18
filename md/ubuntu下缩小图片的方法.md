title: ubuntu下缩小图片的方法
date: 2015/10/24 10:03:48
updated: 2016/01/14 15:03:11
categories:
- study
---

## 请先用命令安装Image Magick： 

``` shell
sudo apt-get install imagemagick
```

###  第一种方法，这种方法缩小之后会生成一堆的 “small-*”的文件名的文件：
,
``` shell
convert -resize 20%x20% ./*.JPG   small.jpg
```

![](assets/56974831ab64415d49003d81.PNG)



### 第二种方法：这个方法是缩小图片并保留原始文件名的命令：

``` shell

for img in `ls *.JPG`; do convert -resize 20%x20% $img small-$img; done
```

![](assets/56974831ab64415d49003d82.PNG)