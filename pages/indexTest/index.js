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

  test: function() {
    wx.request({
      url: app.globalData.localhost + "/test",
      success: function(e) {
        console.log(e);
      }
    });
  },

  // 前往个人中心页面
  goToMyPage: function() {
    wx.navigateTo({
      url: '../my/my',
    })
  },

  goToRegisterPage: function() {
   
  },

   // 获取用户信息，并登录
   getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    console.log(app.globalData.userInfo)
    this.login();
  },

  // 登录
  login: function() {
    let p = this;
    wx.login({
      timeout: app.globalData.timeout,
      // fail: app.fail(),
      success: res => wx.request({
        timeout: app.globalData.timeout,
        // fail: app.fail(),
        url: app.globalData.localhost + "/login",
        method: "POST",
        header: {"Content-Type": "application/x-www-form-urlencoded"},
        data: {code: res.code},
        success: function(e){
          console.log("code: " +res.code);
          if("unregistered" == e.data.status){ 
            wx.showModal({
              title: "提示",
              content: "您未注册，是否前往注册页面？",
              success: e => {
                if(e.confirm) wx.navigateTo({url: '../register/register'})
              }
            });
          }
        }
      })
    });
    console.log("发起登录请求！");
  },

  onLoad: function () {
    if (app.globalData.userInfo) {} 
    else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {}
    } else {
      wx.getUserInfo({
        success: res => {
          console.log(app.globalData.userInfo)
          app.globalData.userInfo = res.userInfo
        }
      })
    }
  }
})