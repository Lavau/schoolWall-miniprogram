// pages/detailOthers/detailOthers.js
const APP = getApp();

Page({
  data: {
    typeId: "",
    id: "",
    obj: {}
  },

  /**
   * 预览图片
   */
  previewpicture(e) {
    let index = e.currentTarget.dataset.index;
    let pictures = this.data.obj.pictureUrlList;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    });
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.typeId = options.typeId;

    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/others/detail",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {openId: wx.getStorageSync('openId'), id: options.id, typeId: options.typeId},
      success(e) {
        console.log("detailOthers.js onLoad() print data:\n", e.data);
        if (e.data.success) {
          p.setData({obj: e.data.object});
        }
      }
    });
  }
})