// pages/q_section/q_section.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapterId: null,
  },

  goToQDetail(event) {
    let chapterId = this.data.chapterId;
    wx.navigateTo({
      url: '../q_detail/q_detail?typeId=' + event.currentTarget.dataset.id + '&' + 
           'chapterId=' + chapterId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({chapterId: options.id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})