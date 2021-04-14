// pages/search/search.js
const APP = getApp();

Page({
  data: {
    types: [],
  },

  onLoad: function (options) {
    let p = this;

    wx.request({
      url: APP.globalData.localhost + "/noLogin/type/obtain",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      success(response) {
        if (response.data.success) {
          p.setData({types: response.data.data});
        } else {
          APP.showModal(response.data.msg);
        }
      },
      fail:() => APP.fail()
    });
  }
})