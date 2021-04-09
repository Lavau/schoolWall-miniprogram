// pages/listMsg/listMsg.js
const APP = getApp();

Page({
  data: {
    msgs: []
  },

  onLoad: function (options) {
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/msg/unread/list",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      success(response) {
        if (response.data.success) {
          p.setData({msgs: response.data.data});
        }
      },
      fail:() => APP.fail()
    });
  }
})