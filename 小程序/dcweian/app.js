//app.js
const constants = require('/common/constants')
App({
  onLaunch: function() {
    var that = this
    // 检测是否为iphonex xs xr
    wx.getSystemInfo({
      success: function(res) {
        var name = res.model
        if (name.indexOf("iPhone X") > -1) {
          that.globalData.isIpx = true
        }
      }
    })
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: constants.WECHAT_OPENID_URL,
            data: {
              code: res.code
            },
            success(res) {
              let openid = res.data.openid
              if(openid.length>0){
                that.globalData.openid = openid
                that.initSocket();
                that.globalData.refreshCallback();
              }else{
                console.log('获取openid失败' + res.errMsg)
                wx.showToast({
                  icon: "none",
                  title: '获取openid失败！不会连接websocket',
                })
              }              
            },
            fail(res){
              console.log('获取openid失败!' + res.errMsg)
              wx.showToast({
                icon:"none",
                title: '获取openid失败！不会连接websocket',
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          wx.showToast({
            icon: "none",
            title: '登录失败！不会连接websocket',
          })
        }
      }
    })
  },
  globalData: {
    openid: '',
    isIpx: false, //是否为iPhone x
    socketClient: null,
    socketReceiver: function(e) {}, //收到消息回调
    refreshCallback: function ( ) { }// 全局变量刷新事件回调
  },
  // 初始化websocket
  initSocket: function() {
    let that = this;
    // socket是否连接
    let socketConnected = false;
    // 待发送的消息队列
    let messageQueue = [];
    // 是否断线重连
    let reconnect = true;

    // 发送消息
    function sendSocketMessage(msg) {
      // console.log(msg);
      // 如果socket已连接则发送消息
      if (socketConnected) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        // socket没有连接将消息放入队列中
        messageQueue.push(msg);
      }
    }

    // 关闭连接
    function close() {
      if (socketConnected) {
        wx.closeSocket()
        socketConnected = false;
      }
    }

    // 符合WebSocket定义的对象
    var ws = {
      send: sendSocketMessage,
      close: close
    }

    // 创建一个 WebSocket 连接
    function connect() {
      wx.connectSocket({
        url: constants.WEBSOCKET_URL,
        header: {
          token: "lihaoyang" //从服务端获取一个token，服务端验证token是否允许连接,案例中没做限制
        }
      })
    }
    connect();

    // 监听 WebSocket 连接打开事件
    wx.onSocketOpen(function(res) {
      console.log("WebSocket 连接成功")
      socketConnected = true;
      ws.onopen();
      // 连接成功后，将队列中的消息发送出去
      let queueLength = messageQueue.length
      for (let i = 0; i < queueLength; i++) {
        sendSocketMessage(messageQueue.shift())
      }
    })

    // 监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function(res) {
      ws.onmessage(res);
    })

    // 监听 WebSocket 错误事件
    wx.onSocketError(function(res) {
      console.log("WebSocket 错误事件")
      if (!socketConnected) {
        // 断线重连
        if (reconnect) {
          connect();
        }
      }
    })

    // 监听 WebSocket 连接关闭事件
    wx.onSocketClose(function(res) {
      console.log("WebSocket 连接关闭")
      socketConnected = false;
      // 断线重连
      if (reconnect) {
        connect();
      }
    })

    const Stomp = require('/utils/stomp.js').Stomp;

    /**
     * 定期发送心跳或检测服务器心跳
     *  The heart-beating is using window.setInterval() to regularly send heart-beats and/or check server heart-beats.
     *  可看stomp.js的源码（195,207，489行），由于小程序没有window对象，所以我们要调用小程序的定时器api实现
     */
    Stomp.setInterval = function(interval, f) {
      return setInterval(f, interval);
    };
    // 结束定时器的循环调用
    Stomp.clearInterval = function(id) {
      return clearInterval(id);
    };

    const stompClient = Stomp.over(ws);

    this.globalData.socketClient = stompClient;

    stompClient.connect({}, function(callback) {

      // 订阅自己的
      stompClient.subscribe('/user/' + that.globalData.openid + '/message', function(message, headers) {
        console.log('收到只发送给我的消息:', message);
        that.globalData.callback(JSON.parse(message.body));
        // 通知服务端收到消息
        message.ack();
      });

      // 向服务端发送消息
      stompClient.send("/app/message", {}, JSON.stringify({
        'msg': '我是客户端 ' + that.globalData.openid
      }));
    })
  },

  //统一发送消息
  sendSocketMessage: function(msg) {
    this.globalData.socketClient.send("/app/message", {}, JSON.stringify(msg));
  }

})