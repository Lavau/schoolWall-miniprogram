// pages/listEcard/listEcard.js
Page({
  data: {
    inputVal: ""
  },

  /**
   * 绑定搜索框的事件 
   */
  bindinput(e) {this.setData({inputVal: e.detail.value})},
  bindconfirm(e) {
    this.setData({inputVal: e.detail.value});
    // wx.navigateTo({
    //   url: '/pages/goods/list?name=' + this.data.inputVal,
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})