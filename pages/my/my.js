// pages/my/my.js
const APP = getApp();

Page({
  data: {
    login: false,
    userInfo: {},
    hasUserInfo: false,

    publishedList: null,
    publishedPageNum: null,
    publishedPages: null,

    likedList: null,
    likedPageNum: null,
    likedPages: null,

    commentedList: null,
    commentedPageNum: null,
    commentedPages: null,
  },

  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },

  goToRegisterPage: function() {
    wx.navigateTo({
      url: '../register/register',
    });
  },

  /**
   * 前往 "我的XX" 详情页 
   */
  goToObtainDataPage(e) {
    wx.navigateTo({
      url: '../obtainData/obtainData?url=' + e.currentTarget.dataset.url
    });
  },

  /**
   * 获取用户信息
   */
  obtainUserInfo(e) {
    console.log(e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    APP.globalData.userInfo = this.data.userInfo;
    console.log(APP.globalData.userInfo);
  },

  /**
   * 获取发布过的
   */
  obtainPublishedList() {
    if (this.data.publishedList == null) {
      let p = this;
      wx.request({
        url: APP.globalData.localhost + "/login/obtainPublishedData",
        method: "POST",
        header: {"Content-Type": "application/x-www-form-urlencoded"},
        data: {openId: APP.globalData.openId},
        success: (res) => {
          p.setData({
            publishedList: res.data['list'],
            publishedPageNum: res.data['pageNum'],
            publishedPages: res.data['pages']
          });
        },
        fail() {
          wx.showModal({
            content: "获取已发布的数据失败",
            showCancel: false
          });
        }
      });
    }
  },

  /**
   * 获取点赞过的
   */
  obtainLikedList() {

  },

  /**
   * 获取评论过的
   */
  obtainCommentedList() {

  },

  /**
   * 登录
   */
  login() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  /**
   * 页面加载时，获取用户信息
   */
  onLoad: function () {
    this.setData({login: APP.globalData.login});
    console.log("my.js: onLoad() login", this.data.login, APP.globalData.login);
    console.log("my.js: onLoad() userInfo\n", APP.globalData.userInfo);

    if (APP.globalData.userInfo != null) {
      this.setData({
        userInfo: APP.globalData.userInfo,
        hasUserInfo: true
      });
    } else {
      wx.getUserInfo({
        success: res => {
          APP.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }

    // 如果已经登录,获取当前用户已发布过的数据
    if (this.data.login) {
      let p = this;
    }
  }
})