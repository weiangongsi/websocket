#  小程序 使用springboot websocket stomp协议
### 已经实现的功能 双人聊天、群聊和发送文字、图片消息

#### 小程序：

- project.config.json 中， appid 换成你自己的appid
- /common/constants.js 中，API_BASE_URL 和 WEBSOCKET_URL 将域名改成你自己的域名或ip，局域网测试的时候手机和电脑要在同一个网段

#### 后台：
- application.yml 中，wechat.appid 和 wechat.secret 改为你自己的
- 项目所在磁盘根目录新建upload 目录，上传的图片会存储在这个目录


前期准备：https://blog.csdn.net/u011164906/article/details/80704828


qq群 806893930