//获取应用实例
const app = getApp()

Page({
  data: {
    openid: '', // 自己的openid
    toOpenid: "" //聊天对象openid
  },

  //页面加载事件
  onLoad: function(e) {
    this.setData({
      openid: app.globalData.openid
    })
    /* 获取聊天对象id，你自己实现可以参考这个，我并不知道opnenid 所以要手动输入
    if (e && e.id) {
      this.setData({
        toOpenid: e.id
      })
    }*/
    // 回调发送给自己的消息
    app.globalData.socketReceiver = function(e) {
      console.log(e)
    }
  },

})