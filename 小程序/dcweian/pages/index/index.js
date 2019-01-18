//获取应用实例
const {
  $Message
} = require('../../components/iview/base/index');
const app = getApp()
Page({
  data: {
    isIpx: app.globalData.isIpx,
    openid: '', // 自己的openid
  },
  //页面加载事件
  onLoad: function(e) {
    let that = this
    app.globalData.refreshCallback = function() {
      that.setData({
        openid: app.globalData.openid
      })
    }
  },
  // 复制openid到剪切板
  copyOpenid() {
    let openid = this.data.openid
    if (openid.length > 0) {
      wx.setClipboardData({
        data: openid,
        success(res) {
          $Message({
            content: 'openid已复制到剪切板',
            type: 'success',

          });
        }
      })
    } else {
      $Message({
        content: '获取openid失败',
        type: 'error',
        duration: 1
      });
    }
  }

})