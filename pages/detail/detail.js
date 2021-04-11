// pages/detailOthers/detailOthers.js
const APP = getApp();

Page({
  data: {
    id: "",
    like: false,
    likeNum: null,
    publishedInfo: null,

    commentList: [],
    hidden: true,
    commentContent: "",
    pageNum: 0,
    pages: null,

    parentIdOrAttachedId: "",
    isCommentParent: null,

    reportTypes: [],
    isHiddenReportTypeModal: true,
    isHiddenInputReportReason: true,
    selectedReportType: null,
    reportReason: "",

    isHiddenActionSheet: true,
    isHiddenInputFavoriteName: true,
    favorites: [],
    favoriteName: ""
  },

  /**
   * 脱单类别，点击“我想脱单”后，弹出弹框
   */
  showContactInfo() {
    let p = this;
    wx.showModal({
      content: p.data.publishedInfo.msg == null ? "Ta 没有留下任何痕迹" : p.data.publishedInfo.msg,
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
          APP.serverLoading();

          wx.request({
            url: APP.globalData.localhost + "/login/publishedInfo/claim",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {id: p.data.publishedInfo.id},
            success(response) {
              wx.hideLoading({});
              if (response.data.success) {
                APP.showModal(p.data.publishedInfo.msg);
              } else {
                APP.showModal(response.data.msg);
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
  touchLike() {
    let myLikeStatus = !this.data.like;
    this.setData({like: myLikeStatus, likeNum: myLikeStatus ? this.data.likeNum + 1 : this.data.likeNum - 1});
    let p = this;
    APP.serverLoading();
    wx.request({
      url: APP.globalData.localhost + "/login/like",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {
        id: p.data.publishedInfo.id, 
        isLike: myLikeStatus
      },
      success(response) {
        wx.hideLoading({});
        wx.showToast({title: response.data.msg});
      },
      fail:() => APP.fail()
    });
  },

  /**
   * 预览图片
   */
  previewpicture(e) {
    let index = e.currentTarget.dataset.index;
    let pictures = this.data.publishedInfo.pictureUrlList;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    });
   },

   /**
    * 前往二级评论页
    */
   goToCommentListPage(e) { wx.navigateTo({
     url: '/pages/listComment/listComment?id=' + e.currentTarget.dataset.id,
   });},

  /**
   * 评论相关
   */
  // 显示/隐藏评论模态框
  isShowModal(event) {
    this.setData({
      hidden: !this.data.hidden,
      parentIdOrAttachedId: event.currentTarget.dataset.id,
      isCommentParent: event.currentTarget.dataset.parent === 'true'
    });
  },
  // 获取输入的评论
  inputComment(event) {this.setData({commentContent: event.detail.value});},
  // 发布评论
  publishComment() {
    let p = this;
    if (this.data.commentContent.length == 0) {
      wx.showToast({title: '输入评论，才能发布哦', icon: "none"});
    } else {
      APP.serverLoading();

      let uri = p.data.isCommentParent ? "/login/comment/insert" : "/login/comment/reply/insert";
      let dataToServer = p.data.isCommentParent ? {
        commentContent: p.data.commentContent,
        attachedId: p.data.parentIdOrAttachedId
      } : {
        commentContent: p.data.commentContent,
        parentId: p.data.parentIdOrAttachedId
      };

      wx.request({
        url: APP.globalData.localhost + uri,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "JSessionId": wx.getStorageSync('JSessionId')
        },
        data: dataToServer,
        success(res) {
          wx.hideLoading();
          APP.showModal(res.data.msg);
          p.setData({hidden: !p.data.hidden, commentContent: ""});
        },
        fail:() => APP.fail()
      });
    }
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
            url: APP.globalData.localhost + "/login/comment/delete/typeData",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {parentId: e.currentTarget.dataset.id},
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

  showOrCloseActionSheet() {
    let p = this;
    p.setData({isHiddenActionSheet: !p.data.isHiddenActionSheet});
    if (!p.data.isHiddenActionSheet) {
      APP.obtainFavorites(this);
    }
  },

  collect(e) {
    let p = this;
    wx.showModal({
      title: "确定收藏？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({title: '处理中。。。'});
          wx.request({
            url: APP.globalData.localhost + "/login/favorite/collect",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data:{favoriteId: e.currentTarget.dataset.favoriteid, publishedInfoId: p.data.id},
            success(response) {
              wx.hideLoading({});
              p.setData({isHiddenActionSheet: !p.data.isHiddenActionSheet});
              APP.showModal(response.data.msg);
            }
          });
        }
      }
    })
  },

  createFavorite() {
    let p = this;
    wx.showLoading({title: '创建中，稍等。。'});
    wx.request({
      url: APP.globalData.localhost + "/login/favorite/create",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data:{name: p.data.favoriteName},
      success(response) {
        wx.hideLoading({});
        p.setData({isHiddenInputFavoriteName: !p.data.isHiddenInputFavoriteName});
        APP.showModal(response.data.msg);
        APP.obtainFavorites(p);
      }
    });
  },

  inputFavoriteName(e) {this.data.favoriteName = e.detail.value;},

  showOrCloseInputFavoriteName() {this.setData({isHiddenInputFavoriteName: !this.data.isHiddenInputFavoriteName});},

  /**
   * 以下方法为举报
   */
  determineReportReson() {
    let p = this;
    if (p.data.reportTypes.length == 0) {
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
            p.setData({reportTypes: response.data.data,
              isHiddenReportTypeModal: !p.data.isHiddenReportTypeModal
            });
          } else {
            APP.showModal("举报类别获取失败。。。");
          }
        }
      });
    } else {
      p.setData({isHiddenReportTypeModal: !p.data.isHiddenReportTypeModal});
    }
  },

  closeReportTypeModal() {
    this.setData({isHiddenReportTypeModal: !this.data.isHiddenReportTypeModal});
  },

  showOrCloseInputReportReason() {
    this.setData({isHiddenInputReportReason: !this.data.isHiddenInputReportReason});
  },
  resetReportReason() {
    this.setData({isHiddenInputReportReason: !this.data.isHiddenInputReportReason,
      reportReason: ""
    });
  },

  inputReportType(e) {this.data.selectedReportType = e.currentTarget.dataset.reporttype;},
  inputOtherReportReason(e) {this.data.reportReason = e.detail.value;},

  report() {
    let p = this;
    if (p.data.selectedReportType == null && p.data.reportReason.length == 0) {
      wx.hideLoading();
      APP.showModal('！！请输入举报原因！！');
    } else {
      let reportReason = p.data.selectedReportType != null ? p.data.selectedReportType.name  : "";
      if (p.data.selectedReportType != null && p.data.reportReason.length > 0) {
        reportReason += '、';
      }
      reportReason += (p.data.reportReason.length > 0 ? p.data.reportReason : "");
      wx.showModal({
        content: '举报原因：' + reportReason,
        success(res) {
          if (res.confirm) {
            wx.showLoading({title: '处理中'});
            wx.request({
              url: APP.globalData.localhost + '/login/report',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "JSessionId": wx.getStorageSync('JSessionId')
              },
              data: {
                publishedInfoId: p.data.id,
                reportReason: reportReason
              },
              success(response) {
                wx.hideLoading();
                wx.showModal({
                  content: response.data.msg,
                  success(res) {wx.switchTab({url: '../index/index'});}
                });
              }
            });
          }
        }
      });
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.obtainDetail();

    this.data.pageNum = 0;
    this.data.commentList = [];
    this.data.commentContent = "";

    this.obtainComment();
  },

  /**
   * 监听页面滚动到顶部,触发加载事件————获取下一页评论数据
   */
  onReachBottom() {
    if (this.data.pageNum == this.data.pages) {
      APP.showModal(' @_@: 到底了。。没有评论啦');
      return;
    }
    APP.serverLoading();
    this.obtainComment();
    wx.hideLoading({});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.obtainDetail();
    this.obtainComment();
  },

  /**
   * 获取详情
   */
  obtainDetail() {
    let p = this;
    // 向服务器请求，要展示的信息
    wx.request({
      url: APP.globalData.localhost + "/login/publishedInfo/detail",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {id: p.data.id},
      success(response) {
        if (response.data.success) {
          p.setData({publishedInfo: response.data.data,
            like: response.data.data.like,
            likeNum: response.data.data.likeNum
          });
        } else {
          wx.showModal({
            content: response.data.msg,
            showCancel: false,
            success(res) {wx.switchTab({url: '../index/index'})}
          }); 
        }
      }
    });
  },

  /**
   * 获取评论信息
   */
  obtainComment() {
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/comment/list/typeData",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {
        attachedId: p.data.id,
        pageNum: p.data.pageNum + 1
      },
      success(response) {
        let listCopy = p.data.commentList;
        response.data.data.list.forEach(item => {
            listCopy.push(item);
        });

        p.setData({
          commentList: listCopy,
          pageNum: response.data.data.pageNum,
          pages: response.data.data.pages
        });
      },
      fail:() => APP.fail()
    });
  }
})