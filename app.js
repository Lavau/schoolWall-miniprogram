//app.js
App({
  globalData: {
    timeout: 30000,
    localhost: "https://www.leeti.top/miniprogram",
    // localhost: "http://localhost:8080/miniprogram",
    userInfo: null,
    login: false
  },

  setLoginTrue() {this.globalData.login = true;},

  fail:() => this.showModel("服务器繁忙"),

  /**
   * 等待服务器返回处理结果
   */
  serverLoading:() => wx.showLoading({title: '处理中。。。', mask: true}),

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
      success(response) {
        switch(response.data["data"]) {                  
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
            let cookie = response.header["Set-Cookie"];
            let indexOfJSEESSIONID = cookie.indexOf('JSESSIONID');
            let JSessionId = cookie.substring(indexOfJSEESSIONID + 11, indexOfJSEESSIONID + 47);
            wx.setStorageSync("JSessionId", JSessionId);
            break;
        }
      },
      fail:() => p.fail()
    });        
  },

  /**
   * 保证 that 实例的 data 含有 favorites 
   * @param {*} that 某个页面的实例
   */
  obtainFavorites(that) {
    let p = this;
    wx.showLoading({title: '获取收藏夹信息'});
    wx.request({
      url: p.globalData.localhost + "/login/favorite/list",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      success(response) {
        wx.hideLoading();
        if (response.data.success) {
          that.setData({favorites: response.data.data});
        }
      }
    });
  },

  verifyDescription(description) {
    let p = this;
    return new Promise(function (resolve, reject) {
      if (description.length == 0) {
        resolve(false);
      } else {
        wx.request({
          method: 'POST',
          url: p.globalData.localhost + '/login/publishedInfo/description/verify',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "JSessionId": wx.getStorageSync('JSessionId')
          },
          data: {'description': description},
          success(res) {resolve(!res.data.data);}
        });
      }
    });
  },

  showModal(content) {
    wx.showModal({
      content: content,
      showCancel: false
    })
  },

  showToast(title, icon) {
    wx.showToast({
      title: title,
      icon: "success"
    })
  }
})