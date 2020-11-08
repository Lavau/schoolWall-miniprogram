// pages/publish/publish.js
Page({
  data:{
    // text:"这是一个页面"
    actionSheetHidden:true,
    actionSheetItems:[
     {bindtap:'Menu1',txt:'菜单1'},
     {bindtap:'Menu2',txt:'菜单2'},
     {bindtap:'Menu3',txt:'菜单3'}
    ],
    menu:''
   },
   actionSheetTap:function(){
    this.setData({
     actionSheetHidden:!this.data.actionSheetHidden
    })
   },
   actionSheetbindchange:function(){
    this.setData({
     actionSheetHidden:!this.data.actionSheetHidden
    })
   },
   bindMenu1:function(){
    this.setData({
     menu:1,
     actionSheetHidden:!this.data.actionSheetHidden
    })
   },
   bindMenu2:function(){
    this.setData({
     menu:2,
     actionSheetHidden:!this.data.actionSheetHidden
    })
   },
   bindMenu3:function(){
    this.setData({
     menu:3,
     actionSheetHidden:!this.data.actionSheetHidden
    })
   },

  /**
   * 前往具体的发布页
   */
  // 前往一卡通发布页 
  goToEcardPage: function() {
    wx.navigateTo({
      url: '../publishEcard/publishEcard',
    })
  },

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
  },

  // 前往感谢/吐槽发布页
  goToPublishThankOrRidiculePage: function() {
    wx.navigateTo({
      url: '../publishThankOrRidicule/publishThankOrRidicule',
    })
  },

  // 前往脱单发布页
  goToPublishSinglePage: function() {
    wx.navigateTo({
      url: '../publishSingle/publishSingle',
    })
  },

  // 前往宣传发布页
  goToPublishPublicityPage: function() {
    wx.navigateTo({
      url: '../publishPublicity/publishPublicity',
    })
  },
})