//获取应用实例
const app = getApp()
let subscribeChatGroup;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let roomId = options.id
    wx.setNavigationBarTitle({
      title: '群聊（房间id：' + roomId + '）',
    })
    // 订阅群聊
    subscribeChatGroup = app.globalData.socketClient.subscribe('/topic/chat-group/' + roomId, function(message, headers) {
      let msg = JSON.parse(message.body);
      console.log('收到群消息:', msg);
      message.ack();
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 取消订阅
    subscribeChatGroup.unsubscribe();
  }

})