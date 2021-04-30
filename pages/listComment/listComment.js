// pages/listComment/listComment.js
const APP = getApp();

Page({
  data: {
    id: "",
    hidden: true,
    commentContent: "",
    parentId: "",

    commentList: [],
    pageNum: 0,
    pages: null,

    reportReasonTypes: [],
    isHiddenReportReasonTypeModal: true,
    isHiddenInputReportReason: false,
    selectedReportReasonType: null,
    reportReason: "",
    reportedCommentId: ""
  },

  /**
   * 删除评论 
   */
  deleteComment(event) {
    wx.showModal({
      title: "确定删除本条回复评论？",
      success(res) {
        if (res.confirm) {
          APP.serverLoading();
          wx.request({
            url: APP.globalData.localhost + "/login/comment/reply/delete",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {id: event.currentTarget.dataset.id},
            success(response) {
              wx.hideLoading({});
              APP.showModal(response.data.msg);
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
      parentId: e.currentTarget.dataset.id
    });
  },

  // 获取输入的评论
  inputComment(e) {this.setData({commentContent: e.detail.value});},

  // 发布评论
  publishComment() {
    let p = this;
    if (this.data.commentContent.length == 0) {
      APP.showModal('输入评论，才能发布哦');
    } else {
      APP.serverLoading();
      wx.request({
        url: APP.globalData.localhost + "/login/comment/reply/insert",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "JSessionId": wx.getStorageSync('JSessionId')
        },
        data: {
          commentContent: p.data.commentContent,
          parentId: p.data.parentId
        },
        success(res) {
          wx.hideLoading();
          if (res.data.success) {
            wx.showToast({title: res.data.msg});
            p.setData({hidden: !p.data.hidden, commentContent: ""});
          }
        },
        fail:() => APP.fail()
      });
    }
  },

  /**
   * 以下方法为举报
   */
  determineReportReson(e) {
    let p = this;

    p.data.reportedCommentId = e.currentTarget.dataset.id;

    if (p.data.reportReasonTypes.length == 0) {
      wx.showLoading({title: '获取信息中。。'});
      wx.request({
        url: APP.globalData.localhost + '/login/reportType/list',
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "JSessionId": wx.getStorageSync('JSessionId')
        },
        success(response) {
          wx.hideLoading();
          if (response.data.success) {
            p.setData({
              reportReasonTypes: response.data.data,
              isHiddenReportReasonTypeModal: !p.data.isHiddenReportReasonTypeModal
            });
          } else {
            APP.showModal("举报类别获取失败。。。");
          }
        },
        fail() {APP.showModal("举报类别获取失败。。。"); }
      });
    } else {
      p.setData({isHiddenReportReasonTypeModal: !p.data.isHiddenReportReasonTypeModal});
    }
  },

  closeReportReasonTypeModal() {
    this.setData({isHiddenReportReasonTypeModal: !this.data.isHiddenReportReasonTypeModal});
  },

  showOrCloseInputReportReason() {
    this.setData({isHiddenInputReportReason: !this.data.isHiddenInputReportReason});
  },
  resetReportReason() {
    this.setData({isHiddenInputReportReason: !this.data.isHiddenInputReportReason,
      reportReason: ""
    });
  },

  inputReportReasonType(e) {
    this.setData({
      isHiddenReportReasonTypeModal: !this.data.isHiddenReportReasonTypeModal,
      selectedReportReasonType: e.currentTarget.dataset.reporttype
    });
    this.report();
  },
  inputOtherReportReason(e) {this.data.reportReason = e.detail.value;},

  report() {
    let p = this;
    if (p.data.selectedReportReasonType == null && p.data.reportReason.length == 0) {
      wx.hideLoading();
      APP.showModal('！！请输入举报原因！！');
    } else {
      let reportReason = p.data.selectedReportReasonType != null ? p.data.selectedReportReasonType.name  : "";
      if (p.data.selectedReportReasonType != null && p.data.reportReason.length > 0) {
        reportReason += '、';
      }
      reportReason += (p.data.reportReason.length > 0 ? p.data.reportReason : "");
      wx.showModal({
        content: '举报原因：' + reportReason,
        success(res) {
          if (res.confirm) {
            wx.showLoading({title: '处理中'});
            p.reportComment(reportReason);
          }
        }
      });
    }
  },

  reportComment(reportReason) {
    let p = this;
    wx.request({
      url: APP.globalData.localhost + '/login/comment/report',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {id: p.data.reportedCommentId, reportReason: reportReason},
      success(response) {
        wx.hideLoading();
        APP.showModal(response.data.msg);
      }
    });
  },

  /**
   * 监听页面滚动到顶部,触发加载事件————获取下一页评论数据
   */
  onReachBottom() {
    if (this.data.pageNum == this.data.pages) {
      wx.showModal({content: '暂无最新的评论', showCancel: false});
      return;
    }
    wx.showLoading({title: '数据加载中'});
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
      url: APP.globalData.localhost + "/login/comment/reply/list",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {
        parentId: p.data.id,
        pageNum: p.data.pageNum + 1
      },
      success(response) {
        if (response.data.success) {
          let listCopy = p.data.commentList;
          response.data.data.list.forEach(item => {
              listCopy.push(item);
          });

          p.setData({
            commentList: listCopy,
            pageNum: response.data.data.pageNum,
            pages: response.data.data.pages
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
  }
})