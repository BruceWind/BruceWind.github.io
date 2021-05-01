title: 用docker在当前电脑起一个RTMP推流服务器
date: 2021/05/01 01:24:01
updated: 2021/05/01 22:52:11
categories:
- 技术
---

In the past, I used to [establish a RTMP stream server](https://www.cameraremote.de/how-to-setup-a-rtmp-streaming-server-on-raspberry-pi-e-g-for-gopro-cameras/) on a Raspbery PI.

Obviously Raspberry PI is small in your workbench，but you still need to find its IP, 
may the action disturbs your working. 

And now using docker is easy to establish RTMP server.

> There are some steps to establish it:


## docker pull & run it.

``` shell script
docker pull tiangolo/nginx-rtmp
docker run -d -p 80:80 -p 1935:1935 --name nginx-hls tiangolo/nginx-rtmp # bind ports : {1935, 80}
```

**The push stream url:** 

rtmp://{ip}/live/{id}  

> change {id} if you want，it is stream id.

**The play url:** 

rtmp://{ip}/live/{id}

It is over in the event that you don't want play a HLS url.


## HLS live stream test(has transcoding)

In case you wanting HLS live url, modify  conf: `vi /etc/nginx/nginx.conf` :

before it run : `docker exec -it nginx-hls bash` to enter docker sytem.
```

worker_processes  auto;
events {
    worker_connections  1024;
}

# RTMP configuration
rtmp {
    server {
        listen 1935; # Listen on standard RTMP port
        chunk_size 4000;

        application show {
            live on;
            # Turn on HLS
            hls on;
            hls_path /mnt/hls/;
            hls_fragment 3;
            hls_playlist_length 60;
            # disable consuming the stream from nginx as rtmp
            deny play all;
    # Instruct clients to adjust resolution according to bandwidth
            hls_variant _low BANDWIDTH=512000; # Low bitrate, sub-SD resolution
            hls_variant _mid BANDWIDTH=1024000; # Medium bitrate, SD resolution
            hls_variant _hd720 BANDWIDTH=2048000; # High bitrate, HD 720p resolution
        }

    }
}

http {
    sendfile off;
    tcp_nopush on;
    #aio on;
    directio 512;
    default_type application/octet-stream;

    server {
        listen 80;

        location / {
            # Disable cache
            add_header 'Cache-Control' 'no-cache';

            # CORS setup
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Expose-Headers' 'Content-Length';

            # allow CORS preflight requests
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }

            types {
                application/dash+xml mpd;
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }


            root /mnt/;
        }

}
}

```


### The url you can push stream into：

has transcoding：rtmp://localhost/show/live_hd720 , you can replace ***live_{low|mid|hd720}***

no transcoding：rtmp://localhost/show/live

### the HLS url you try to play：

http://localhost/hls/live.m3u8
