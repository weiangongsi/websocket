//获取应用实例
const app = getApp()

Page({
  data: {
    isIpx: app.globalData.isIpx,
    openid: '', // 自己的openid
    toOpenid: "", //聊天对象openid
    msg: '', //输入的消息内容,
    chatContentHeight: 0
  },

  //页面加载事件
  onLoad: function(e) {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    let ipxHeight = this.data.isIpx ? 64 : 30
    // 90顶部 接收方高度， 30底部paddingtop，  75 输入框高度
    this.setData({
      openid: app.globalData.openid,
      chatContentHeight: windowHeight * 750 / windowWidth - (90 + 30 + 75 + ipxHeight)
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
  // 输入绑定
  bindMsgInput(e) {
    this.setData({
      msg: e.detail.value
    })
  }

})