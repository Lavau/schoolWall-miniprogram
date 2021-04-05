// pages/detailEcard/detailEcard.js
const APP = getApp();

Page({
  data: {
    ecard: null,
    ecardId: ""
  },

  /**
   * 获取输入的 ecardId
   */
  inputEcardId(e) {this.setData({ecardId: e.detail.value})},

  /**
   * 认领一卡通
   */
  claimEcard() {
    if (this.data.ecardId.length == 0) {
      wx.showToast({title: '请输入一卡通号', icon: "none"});
      return;
    }

    let p = this;
    if (this.data.ecardId == this.data.ecard.ecardId) {
      wx.request({
        url: APP.globalData.localhost + "/login/ecard/claim",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "JSessionId": wx.getStorageSync('JSessionId')
        },
        data: {id: p.data.ecard.id},
        success(response) {
          if (response.data.success) {
            wx.showModal({
              content: p.data.msg,
              showCancel: false,
              success(res) {wx.switchTab({url: '../index/index'})}
            }); 
          } else {
            wx.showModal({
              content: response.data.msg,
              showCancel: false,
              success(res) {wx.switchTab({url: '../index/index'})}
            }); 
          }
        },
        fail:() => APP.fail()
      });
    } else {
      wx.showToast({title: '一卡通号错误'});
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/ecard/detail",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {id: options.id},
      success(response) {
        if (response.data.success) {
          p.setData({ecard: response.data.data});
        } else {
          wx.showModal({
            content: response.data.msg,
            showCancel: false,
            success(res) {wx.switchTab({url: '../index/index'})}
          }); 
        }
      },
      fail:() => APP.fail()
    });
  }
})