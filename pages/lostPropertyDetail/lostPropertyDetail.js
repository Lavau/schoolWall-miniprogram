// pages/lostPropertyDetail/losstPropertyDetail.js
const APP = getApp();

Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: APP.globalData.localhost + "/login/",
    })
  }
})