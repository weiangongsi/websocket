//index.js
//获取应用实例
const app = getApp()

Page({
  data: {},

  //页面加载事件
  onLoad: function() {
    // websocket初始化
    this.initSocket();
  },
  /**
   * 初始化websocket
   * stomp文档 http://jmesnil.net/stomp-websocket/doc/
   */
  initSocket: function() {
    // socket是否连接
    var socketConnected = false;
    // 待发送的消息队列
    var messageQueue = [];
    // 是否断线重连
    var reconnect = true;


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
        url: 'wss://xcx.dcssn.com/gs-guide-websocket'
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
        const messageQueueElement = messageQueue.shift();
        wx.sendSocketMessage({
          data: messageQueueElement
        })
      }
    })

    // 监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function(res) {
      ws.onmessage(res);
    })

    // 监听 WebSocket 错误事件
    wx.onSocketError(function(res) {
      console.log("WebSocket 错误事件")
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

    var Stomp = require('../../utils/stomp.min.js').Stomp;

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

    var stompClient = Stomp.over(ws);

    let openid = "123456";

    stompClient.connect({}, function(callback) {

      // 主题订阅
      stompClient.subscribe('/topic/greetings', function(body, headers) {
        console.log('收到群发消息', body);
      });

      // 订阅自己的
      stompClient.subscribe('/user/' + openid + '/message', function(message, headers) {
        wx.vibrateLong()
        console.log('收到只发送给我的消息:', message);
        // 通知服务端收到消息
        message.ack();
      });

      // 向服务端发送消息
      stompClient.send("/app/message", {}, JSON.stringify({
        'msg': '我是客户端'
      }));
    })

  }
})