// pages/my/my.js
const APP = getApp();

Page({
  data: {
    login: false,
    infos: {},
    hasUserInfo: false,
  },

  goToObtainDataPage(e) {
    wx.navigateTo({url: '../obtainData/obtainData?typeid=' + e.currentTarget.dataset.typeid});
  },
  goToFavoritePage() {wx.navigateTo({url: "../listFavorite/listFavorite"});},
  goToMsgPage() {wx.navigateTo({url: '../listMsg/listMsg'});},

  login() {
    let p = this;
    wx.login({
      success(res) {
        // 成功获取到 code，向服务器发送请求
        if (res.code) {
          APP.login(res.code);
          p.setData({login: true});
          p.obtainMyData();
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
      p.obtainMyData();
    }
  },

  obtainMyData() {
    let p = this;
    APP.serverLoading();
    wx.request({
      url: APP.globalData.localhost + "/login/myData/info",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      success(response) {
        wx.hideLoading();
        if (response.data.success) {
          p.setData({infos: response.data.data});
        }
      },
      fail:() => APP.fail()
    });
  }
})