title: linux下使用 ffmpeg 实现MP4转gif
date: 2016/01/13 17:32:01
updated: 2016/01/14 00:11:36
categories:
- 技术
---
linux下总是有些比win下更方便的东西，也有一些比 win还难受的。哈哈！

1.安装ffmpegffmpeg

    sudo apt-get install ffmpeg
    
2.使用  

    ffmpeg -t 3.6 -ss 00:00:01 -i Screencast_2016-01-13-17-01-38.mp4  small-clip.gif
   
 注释：3.6是秒数，00:00:01是开始时间。
 这一个命令足够走天下了。


3.结果
![](assets/20160113234704020)


参考资料
> - http://siwei.me/blog/posts/ffmpeg-useful-commands
> - http://davidwalsh.name/convert-video-gif