//app.js
App({
  globalData: {
    timeout: 30000,
    localhost: "http://localhost:8080/miniprogram",
    userInfo: null,
    login: false
  },

  fail: function() {
    wx.showModal({
      title: "提示",
      content: "处理失败",
      showCancel: false
    });
  },

  /**
   * 生成 uuid
   */
  uuid: function guid() {
    function id() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (id()+id()+id()+id()+id()+id()+id()+id());
  },

  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
  },
})