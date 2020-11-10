// pages/my/my.js
const APP = getApp();

Page({
  data: {
    login: false,
    userInfo: {},
    hasUserInfo: false,
  },

  /**
   * 前往 "我的XX" 详情页 
   */
  goToObtainDataPage(e) {
    wx.navigateTo({
      url: '../obtainData/obtainData?url=' + e.currentTarget.dataset.url
    });
  },

  /**
   * 获取用户信息
   */
  obtainUserInfo(e) {
    console.log(e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    APP.globalData.userInfo = this.data.userInfo;
    console.log(APP.globalData.userInfo);
  },

  /**
   * 登录
   */
  login() {
    if (APP.globalData.userInfo == null) {
      wx.showToast({title: '请授权基本信息'});
      return
    }

    let p = this;
    wx.login({
      success(res) {
        // 成功获取到 code，向服务器发送请求
        if (res.code) {
          // openId 为空，进行登录请求
          if (APP.globalData.openId == "") {
            wx.request({
              url: APP.globalData.localhost + "/toLogin",
              method: "POST",
              header: {"Content-Type": "application/x-www-form-urlencoded"},
              data: {code: res.code},
              success(e) {
                console.log("app.js: onLanch() print 登录时服务器返回的信息\n", e);
                // 成功获取到服务器的数据
                switch(e.data["status"]) {                  
                  case "unregistered": wx.showModal({
                      content: "您未注册，是否前往注册",
                      success(res) {
                        if (res.confirm) {
                          wx.redirectTo({url: '/pages/register/register'});
                        }
                      }
                    }); break;
                  case "registered": 
                      APP.globalData.openId = e.data["msg"];
                      // wx.setStorageSync("login", true);
                      APP.globalData.login = true;
                      p.setData({login: true});
                      wx.setStorageSync("openId", e.data["msg"]);
                      console.log("app.js: onLanch() print(2) openId\n", 
                          wx.getStorageSync('openId'));
                      break;
                  default: wx.showModal({
                    content: e.data["status"],
                    showCancel: false
                  });
                }
              }
            });        
          }
        }
      },
      fail: () => wx.showToast({title: "获取 code 失败"}),
    });
  },

  /**
   * 页面加载时，获取用户信息
   */
  onLoad: function () {
    this.setData({login: APP.globalData.login});
    console.log("my.js: onLoad() login", this.data.login, APP.globalData.login);
    console.log("my.js: onLoad() userInfo\n", APP.globalData.userInfo);

    if (APP.globalData.userInfo != null) {
      this.setData({
        userInfo: APP.globalData.userInfo,
        hasUserInfo: true
      });
    } else {
      wx.getUserInfo({
        success: res => {
          APP.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }

    // 如果已经登录,获取当前用户已发布过的数据
    if (this.data.login) {
      let p = this;
    }
  }
})