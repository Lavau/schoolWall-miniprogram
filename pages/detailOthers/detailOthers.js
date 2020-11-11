// pages/detailOthers/detailOthers.js
const APP = getApp();

Page({
  data: {
    typeId: "",
    id: "",
    like: false,
    likeNum: null,
    obj: null
  },

  /**
   * 脱单类别，点击“我想脱单”后，弹出弹框
   */
  showContactInfo() {
    let p = this;
    wx.showModal({
      content: p.data.obj.contactInformation == null ? "Ta 没有留下任何痕迹" : p.data.obj.contactInformation,
      showCancel: false
    });
  },

  /**
   * 失物类别，点击“认领”后，弹出询问框
   */
  claim() {
    let p = this;
    wx.showModal({
      content: '请仔细检查信息后认领，有问题请联系管理员',
      confirmText: "认领",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: APP.globalData.localhost + "/login/others/claim",
            method: "POST",
            header: {"Content-Type": "application/x-www-form-urlencoded"},
            data: {openId: wx.getStorageSync('openId'), id: p.data.obj.id},
            success(e) {
              if (e.data.success) {
                wx.showModal({
                  content: p.data.obj.msg,
                  showCancel: false
                });
              } else {
                wx.showToast({title: e.data.msg});
              }
            },
            fail:() => APP.fail()
          });
        }
      }
    });
  },

  /**
   * 点赞相关
   */
  touchLike(e) {
    this.setData({like: !this.data.like});
    this.setData({likeNum: this.data.like ? this.data.likeNum + 1 : this.data.likeNum - 1});

    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/others/like",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {openId: wx.getStorageSync('openId'), 
        id: p.data.obj.id, 
        like: p.data.like, 
        typeId: p.data.obj.typeId
      },
      success(e) {
        if (e.data.success) {
          wx.showToast({title: e.data.msg});
        } else {
          wx.showToast({title: e.data.msg});
        }
      },
      fail:() => APP.fail()
    });
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
          p.setData({obj: e.data.object,
            like: e.data.object.like,
            likeNum: e.data.object.likeNum
          });
        } else {
          wx.showToast({title: e.data.msg});
        }
      },
      fail:() => APP.fail()
    });
  }
})