title: How to detect whether HLS is live or VOD
date: 2021/04/25 23:40:37
updated: 2021/04/25 23:40:37
categories:
- 技术
---

1. Apple 官方说 有 `#EXT-X-ENDLIST` 则一定是VOD（点播），见[链接](https://developer.apple.com/documentation/http_live_streaming/example_playlists_for_http_live_streaming/live_playlist_sliding_window_construction).

2. m3u8文件中的EXT-X-PLAYLIST-TYPE标签判断：

   a. #EXT-X-PLAYLIST-TYPE:LIVE 一定是直播。
   b. #EXT-X-PLAYLIST-TYPE:EVENT 一定是VOD（点播）。

3. 往往m3u8文件都没有按如上的标准表明自己的类型。
   可以等player prepared 之后,获取duration，直播流往往会返回`UNKNOWN_TIME`。VOD 类型则正常获取到duration.


