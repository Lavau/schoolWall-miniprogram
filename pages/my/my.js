// pages/my/my.js
const APP = getApp();

Page({
  data: {
    login: false,
    infos: {},
    hasUserInfo: false
  },

  /**
   * 前往 "我的XX" 详情页 
   */
  goToObtainDataPage(e) {
    wx.navigateTo({
      url: '../obtainData/obtainData?typeid=' + e.currentTarget.dataset.typeid
    });
  },

  login() {
    let p = this;
    wx.login({
      success(res) {
        // 成功获取到 code，向服务器发送请求
        if (res.code) {
          APP.login(res.code);
          p.setData({login: true});
        }
      },
      fail: () => wx.showToast({title: "获取 code 失败"}),
    });
  },

  /**
   * 页面加载时，获取用户信息
   */
  onLoad: function () {
    let p = this;

    p.setData({login: APP.globalData.login});

    if (APP.globalData.login) {
      wx.request({
        url: APP.globalData.localhost + "/login/myData/info",
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "JSessionId": wx.getStorageSync('JSessionId')
        },
        success(response) {
          if (response.data.success) {
            p.setData({infos: response.data.data});
          }
        },
        fail:() => APP.fail()
      });
    }
  }
})