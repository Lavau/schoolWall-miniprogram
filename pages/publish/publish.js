// pages/publish/publish.js
Page({
  data: {

  },

  /**
   * 前往具体的发布页
   */
  // 前往失物招领发布页
  goToPublishLostPropertyPage: function() {
    wx.navigateTo({
      url: '../publishLostProperty/publishLostProperty',
    })
  },

  // 前往求助发布页
  goToPublishSeekHelpPage: function() {
    wx.navigateTo({
      url: '../publishSeekHelp/publishSeekHelp',
    })
  }
})