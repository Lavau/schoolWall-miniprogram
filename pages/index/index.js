// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  goToEcardPage: function() {
    wx.navigateTo({
      url: '../ecard/ecard',
    })
  }
})