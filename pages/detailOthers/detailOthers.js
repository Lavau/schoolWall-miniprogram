// pages/detailOthers/detailOthers.js
const APP = getApp();

Page({
  data: {
    typeId: "",
    id: "",
    like: false,
    likeNum: null,
    obj: null,

    commentList: [],
    hidden: true,
    commentContent: "",
    pageNum: 0,
    pages: null,

    publishId: "",
    publisParent: ""
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
    console.log(this.data.commentList);

    let myLikeStatus = !this.data.like;
    this.setData({like: myLikeStatus});
    this.setData({likeNum: myLikeStatus ? this.data.likeNum + 1 : this.data.likeNum - 1});

    let p = this;

    APP.serverLoading();

    wx.request({
      url: APP.globalData.localhost + "/login/others/like",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {
        id: p.data.obj.id, 
        isLike: myLikeStatus
      },
      success(response) {
        if (response.data.success) {
          wx.hideLoading({});
          wx.showToast({title: response.data.msg});
        } else {
          wx.hideLoading({});
          wx.showToast({title: response.data.msg});
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
    * 前往二级评论页
    */
   goToCommentListPage(e) { wx.navigateTo({
     url: '/pages/listComment/listComment?id=' + e.currentTarget.dataset.id,
   });},

  /**
   * 评论相关
   */
  // 显示/隐藏评论模态框
  isShowModal(e) {
    if (e == null) {
      return;
    }
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
            p.setData({hidden: !p.data.hidden});
          }
        },
        fail:() => APP.fail()
      })
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
            url: APP.globalData.localhost + "/login/comment/delete",
            method: "POST",
            header: {"Content-Type": "application/x-www-form-urlencoded"},
            data: {openId: wx.getStorageSync('openId'), id: e.currentTarget.dataset.id, isParent: true},
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
   * 监听页面滚动到顶部,触发加载事件————获取下一页评论数据
   */
  onReachBottom() {
    if (this.data.pageNum == this.data.pages) {
      wx.showModal({content: '暂无最新数据', showCancel: false});
      return;
    }
    wx.showLoading({title: '数据加载中'});
    // 向服务器请求评论内容
    this.obtainComment();
    wx.hideLoading({});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.typeId = options.typeId;

    // 向服务器请求详情
    this.obtainDetail();

    // 向服务器请求评论内容
    this.obtainComment();
  },

  /**
   * 获取详情
   */
  obtainDetail() {
    let p = this;
    // 向服务器请求，要展示的信息
    wx.request({
      url: APP.globalData.localhost + "/login/others/detail",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {id: p.data.id, typeId: p.data.typeId},
      success(response) {
        console.log("detailOthers.js onLoad() print data:\n", response.data);
        if (response.data.success) {
          p.setData({obj: response.data.data,
            like: response.data.data.like,
            likeNum: response.data.data.likeNum
          });
        } else {
          wx.showToast({title: response.data.msg});
        }
      },
      fail:() => APP.fail()
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