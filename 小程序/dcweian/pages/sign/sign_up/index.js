// pages/sign/sign_up/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    birthday: "1994-01-13",
    subBtnDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
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

  },
  bindPhoneInput: function (e) {

    this.data.userInfo.phoneNumber = e.detail.value
  },
  bindPassInput: function (e) {
    this.data.userInfo.password = e.detail.value
  },
  createUser: function () {
    this.data.userInfo.birthday = this.data.birthday;
    this.data.userInfo.openid = app.globalData.openid;
    var self = this;
    wx.request({
      url: 'https://xcx.dcssn.com/xcx/createUser.do', //仅为示例，并非真实的接口地址
      method: 'PUT',
      data: {
        user: self.data.userInfo
      },
      success: function (res) {
        if (res.data=="success"){
          wx.switchTab({
            url: '../../me/index'
          }); 
        }
      }
    })
  }
})