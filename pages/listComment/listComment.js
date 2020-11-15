// pages/listComment/listComment.js
const APP = getApp();

Page({
  data: {
    id: "",
    hidden: true,
    commentContent: "",

    commentList: [],
    pageNum: 1,
    pages: null,
  },

    /**
   * 评论相关
   */
  // 显示/隐藏评论模态框
  isShowModal(e) {
    this.setData({
      hidden: !this.data.hidden,
      publishId: e.currentTarget.dataset.id,
      publisParent: e.currentTarget.dataset.parent
    });
  },
  // 获取输入的评论
  inputComment(e) {this.setData({commentContent: e.detail.value});},
  // 发布评论
  publishComment() {
    let p = this;
    if (this.data.commentContent.length == 0) {
      wx.showToast({title: '输入评论，才能发布哦', icon: "none"});
    } else {
      APP.serverLoading();
      wx.request({
        url: APP.globalData.localhost + "/login/comment/publish",
        method: "POST",
        header: {"Content-Type": "application/x-www-form-urlencoded"},
        data: {
          openId: APP.globalData.openId,
          id: p.data.publishId,
          content: p.data.commentContent,
          isParent: p.data.publisParent
        },
        success(res) {
          wx.hideLoading({});
          if (res.data.success) {
            wx.showToast({title: res.data.msg});
            p.isShowModal();
          }
        },
        fail:() => APP.fail()
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id: options.id});
    this.obtainComment();
  },

  /**
   * 获取评论信息
   */
  obtainComment() {
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/comment/list",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {
        openId: wx.getStorageSync('openId'), 
        id: p.data.id, 
        isParent: false,
        pageNum: p.data.pageNum
      },
      success(e) {
        console.log("listComment.js obtainComment() print data:\n", e.data);
        let listCopy = p.data.commentList;
        e.data.list.forEach(e => {
            listCopy.push(e);
        });

        p.setData({
          commentList: listCopy,
          pageNum: e.data.pageNum,
          pages: e.data.pages
        });
      },
      fail:() => APP.fail()
    });
  }
})