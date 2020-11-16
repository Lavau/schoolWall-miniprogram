//app.js
App({
  globalData: {
    timeout: 30000,
    localhost: "http://localhost:8080/miniprogram",
    // localhost: "https://schoolwall.imwonder.top/miniprogram",
    userInfo: null,
    login: false,
    openId: ""
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
    // 调用微信 API 从本地缓存中获取 mySessioin 数据
    this.globalData.openId = wx.getStorageSync("openId") || "";
    let openId = wx.getStorageSync("openId") || "";
    this.globalData.login = openId != "";

    console.log("app.js: onLanch() print(1)  mySessionKey\n", openId);

    let p = this;
    wx.login({
      success(res) {
        // 成功获取到 code，向服务器发送请求
        if (res.code) {
          // openId 为空，进行登录请求
          if (openId == "") {
            wx.request({
              url: p.globalData.localhost + "/toLogin",
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
                      p.globalData.openId = e.data["msg"];
                      p.globalData.login = true;
                      wx.setStorageSync("openId", e.data["msg"]);
                      console.log("app.js: onLanch() print(2) openId\n", 
                          wx.getStorageSync('openId'));
                      break;
                  default: wx.showModal({
                    content: e.data["status"],
                    showCancel: false
                  });
                }
              },
              fail:() => p.fail()
            });        
          }
        }
      },
      fail: () => wx.showModal({
        content: "获取 code 失败",
        showCancel: false
      })
    });

    console.log("app.js: onLanch() print userInfo\n", this.globalData.userInfo);
  },
})