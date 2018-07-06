// pages/sign_up.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasLogin: app.globalData.hasLogin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo;
              app.globalData.hasLogin = true;
              self.saveUser();
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    app.globalData.hasLogin = true;
    this.saveUser();
  },
  saveUser: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://xcx.dcssn.com/xcx/getOpenidByCode.do',
            data: {
              code: res.code
            },
            success: function (res) {
              // 设置 openid
              app.globalData.openid = res.data.openid;
              // 用户没有注册
              if (res.data.id == null) {
                wx.navigateTo({
                  url: '../sign_up/index'
                })
              } else {
                wx.switchTab({
                  url: '../../me/index'
                });
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '服务器维护中',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})