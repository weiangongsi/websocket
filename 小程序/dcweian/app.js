//app.js
App({
  onLaunch: function() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    this.getUserOpenId();
    // this.initSocket();
  },
  globalData: {
    userInfo: null,
    hasLogin: false,
    openid: null
  },

  initSocket: function() {

    var socketOpen = false

    function sendSocketMessage(msg) {
      console.log('send msg:')
      console.log(msg);
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }


    var ws = {
      send: sendSocketMessage
    }

    wx.connectSocket({
      url: 'wss://xcx.dcssn.com/gs-guide-websocket'
    })
    wx.onSocketOpen(function(res) {
      socketOpen = true
      ws.onopen()
    })

    wx.onSocketMessage(function(res) {
      ws.onmessage(res)
    })

    var Stomp = require('utils/stomp.min.js').Stomp;
    Stomp.setInterval = function() {}
    Stomp.clearInterval = function() {}
    var client = Stomp.over(ws);

    client.connect({}, function(sessionId) {

      client.subscribe('/topic/greetings', function(body, headers) {
        console.log('From MQ:', body);
      });

      let openid = 'oO1Yu5Tlih1Lxqi7yh1qc7fZJE9M';
      client.subscribe('/user/' + openid + '/message', function(body, headers) {
        wx.vibrateLong()
        console.log('From MQ to user:', body);
      });

      // client.send(destination, { priority: 9 }, 'hello workyun.com !');
    })
  },
  // lazy loading openid
  getUserOpenId: function(callback) {
    var self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success: function(data) {
          wx.request({
            url: "https://xcx.dcssn.com/xcx/getOpenidByCode.do",
            data: {
              code: data.code
            },
            success: function(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
            },
            fail: function(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
            }
          })
        },
        fail: function(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        }
      })
    }
  }

})