//获取应用实例
const app = getApp()

Page({
  data: {
    toUserId: "" //聊天对象id
  },

  //页面加载事件
  onLoad: function(e) {
    console.log(e)
    // 获取聊天对象id
    if (e && e.id) {
      this.setData({
        toUserId: e.id
      })
      app.globalData.socketReceiver = function(e) {
        console.log(e)
      }
    }
  },

})