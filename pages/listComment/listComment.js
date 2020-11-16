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
   * 删除评论 
   */
  deleteComment(e) {
    wx.showModal({
      title: "确定删除？",
      showCancel: false,
      success(res) {
        if (res.confirm) {
          APP.serverLoading();
          wx.request({
            url: APP.globalData.localhost + "/login/comment/delete",
            method: "POST",
            header: {"Content-Type": "application/x-www-form-urlencoded"},
            data: {
              openId: wx.getStorageSync('openId'), 
              id: e.currentTarget.dataset.id, 
              isParent: e.currentTarget.dataset.index == 0 
            },
            success(res) {
              wx.hideLoading({});
              if (res.data.success) {
                wx.showToast({title: res.data.msg});
              } else {
                wx.showToast({title: res.data.msg, icon: "none"});
              }
            } 
          });
        }
      }
    });
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
   * 监听页面滚动到顶部,触发加载事件————获取下一页评论数据
   */
  onReachBottom() {
    if (this.data.pageNum == this.data.pages) {
      wx.showModal({content: '暂无最新数据', showCancel: false});
      return;
    }
    wx.showLoading({title: '数据加载中'});
    this.setData({pageNum: this.data.pageNum + 1});
    // 向服务器请求评论内容
    this.obtainComment();
    wx.hideLoading({});
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
      success(res) {
        console.log("listComment.js obtainComment() print data:\n", res.data);
        if (res.data.list.length == 0 ) {
          wx.showModal({
            title: "评论已被删除",
            showCancel: true,
            success(resu) {
              if (resu.confirm) {
                wx.navigateBack({delta: 1});
              }
            }
          });
        } 

        let listCopy = p.data.commentList;
        res.data.list.forEach(e => {
            listCopy.push(e);
        });

        p.setData({
          commentList: listCopy,
          pageNum: res.data.pageNum,
          pages: res.data.pages
        });
      },
      fail:() => APP.fail()
    });
  }
})