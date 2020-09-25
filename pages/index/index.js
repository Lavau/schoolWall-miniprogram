// pages/index/index.js
// 获取 App 实例
const app = getApp()

Page({
  data: {

  },

  // 前往一卡通认领页面
  goToEcardPage: function() {
    wx.navigateTo({
      url: '../ecard/ecard',
    })
  },

  // 前往个人中心页面
  goToMyPage: function() {
    wx.navigateTo({
      url: '../my/my',
    })
  },

  onLoad: function(){
    console.log("是否登录：" + app.globalData.isLogin)
    console.log("用户信息：" + app.globalData.userInfo)
  }
})