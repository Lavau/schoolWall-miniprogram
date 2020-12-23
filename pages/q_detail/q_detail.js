// pages/q_detail/q_detail.js
const APP = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    chapterId: null,
    typeId: null,
    q_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.chapterId, options.typeId);
        
    this.setData({chapterId: options.chapterId, typeId: options.typeId});
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/list?chapterId=" + options.chapterId + "&typeId=" + options.typeId,
      method: 'GET',
      success(res) {
        console.log(res.data);
        p.setData({q_list: res.data});
      } 
    })
  },

  visitAnswer(event) {
    let p = this;

    wx.showModal({
      title: '答案',
      content: p.data.q_list[event.currentTarget.dataset.id].answer,
      showCancel: false
    })
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