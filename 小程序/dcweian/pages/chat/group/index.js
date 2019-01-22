//获取应用实例
const app = getApp()
const constants = require('../../../common/constants')
let subscribeChatGroup;
class Message {
  from = ''; //发送方
  to = ''; // 接收方
  type = ''; //1.文本消息 2.图片
  content = ''; // 内容
  user = {}; //发送方用户信息
  constructor(from, to, type) {
    this.from = from;
    this.to = to;
    this.type = type;
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    openid: '', // 自己的openid
    roomId: "", //聊天室id
    msg: '', //输入的消息内容,
    chatContentHeight: 0,
    user: {},
    msgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let roomId = options.id
    this.setData({
      roomId: roomId
    })
    wx.setNavigationBarTitle({
      title: '群聊（房间id：' + roomId + '）',
    })
    // 订阅群聊
    subscribeChatGroup = app.globalData.socketClient.subscribe('/topic/chat-group/' + roomId, function(message) {
      let msg = JSON.parse(message.body);
      let msgList = that.data.msgList
      msgList.push(msg)
      that.setData({
        msgList: msgList
      })
      console.log('收到群消息:', msg);
      message.ack();
    });
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          user: res.data
        })
      },
    })
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    let ipxHeight = this.data.isIpx ? 64 : 30
    // 90顶部 接收方高度， 30底部paddingtop，  75 输入框高度
    this.setData({
      openid: app.globalData.openid,
      chatContentHeight: windowHeight * 750 / windowWidth - (30 + 75 + ipxHeight)
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 取消订阅
    subscribeChatGroup.unsubscribe();
  },
  // 输入绑定
  bindMsgInput(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  // 发送文本消息
  sendText() {
    let roomId = this.data.roomId
    let message = new Message(this.data.openid, this.data.toOpenid, 1);
    message.content = this.data.msg;
    message.user = this.data.user;
    app.globalData.socketClient.send("/app/chat-group/" + roomId, {}, JSON.stringify(message));
    this.setData({
      msg: ''
    })
  },
  // 选择图片
  chooseImage() {
    let that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        tempFilePaths.forEach((v, k) => {
          // 上传图片
          wx.uploadFile({
            url: constants.UPLOAD_URL,
            filePath: v,
            name: 'file',
            formData: {},
            success(res) {
              if (res.statusCode == 200) {
                let imageUrl = constants.API_BASE_URL + res.data
                that.sendImage(imageUrl)
              }
            }
          })
        })
      }
    })
  },
  // 发送图片消息
  sendImage(url) {
    let roomId = this.data.roomId
    let message = new Message(this.data.openid, this.data.toOpenid, 2);
    message.content = url;
    message.user = this.data.user;
    app.globalData.socketClient.send("/app/chat-group/" + roomId, {}, JSON.stringify(message));
  },
  //预览图片
  previewImage(e) { 
    let imageMsgArr = this.data.msgList.filter(msg => {
      return msg.type == 2;
    })
    let imageArr = Array.from(imageMsgArr, img => img.content)
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: imageArr // 需要预览的图片http链接列表
    })
  }
})