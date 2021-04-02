//app.js
App({
  globalData: {
    timeout: 30000,
    localhost: "http://localhost:8080/miniprogram",
    // localhost: "https://schoolwall.imwonder.top/miniprogram",
    userInfo: null,
    login: false,
  },

  setLoginTrue() {this.globalData.login = true;},

  fail:() => wx.showToast({title: "服务器繁忙", icon: "loading"}),

  /**
   * 等待服务器返回处理结果
   */
  serverLoading:() => wx.showLoading({title: '处理中', mask: true}),

 /**
  * 生成 uuid
  */
  uuid() {
    function id() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (id() + id() + id() + id() + id() + id() + id() + id());
  },

  /**
   * 小程序初始化
   */
  onLaunch: function () {
    let p = this;
    wx.login({
      success(res) {
        if (res.code) {
          p.login(res.code);
        }
      },
      fail: () => wx.showModal({
        content: "获取 code 失败",
        showCancel: false
      })
    });
  },

  login(code) {
    let p = this;

    wx.request({
      url: p.globalData.localhost + "/noLogin/login",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {code: code},
      success(e) {
        switch(e.data["data"]) {                  
          case "unregistered":
            wx.showModal({
              content: "您未注册，是否前往注册",
              success(res) {
                if (res.confirm) {
                  wx.redirectTo({url: '/pages/register/register'});
                }
              }
            });
            break;
          case "registered": 
            p.globalData.login = true;
            let JSessionId = e.header["Set-Cookie"].toString().split(';')[0].substring(11);
            wx.setStorageSync("JSessionId", JSessionId);
            break;
        }
      },
      fail:() => p.fail()
    });        
  }
})