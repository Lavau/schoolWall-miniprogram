// pages/my/my.js
const APP = getApp();

Page({
  data: {
    login: false,
    userInfo: {},
    hasUserInfo: false,

    sumOfPublishedData: 0,
    likeTotalNum: 0,
    commentTotalNum: 0
  },

  /**
   * 前往 "我的XX" 详情页 
   */
  goToObtainDataPage(e) {
    wx.navigateTo({
      url: '../obtainData/obtainData?typeid=' + e.currentTarget.dataset.typeid
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
   * 登录
   */
  login() {
    if (APP.globalData.userInfo == null) {
      wx.showToast({title: '请授权基本信息'});
      return;
    }

    let p = this;
    wx.login({
      success(res) {
        // 成功获取到 code，向服务器发送请求
        if (res.code) {
          APP.login(res.code);
          p.setData({login: true});
        }
      },
      fail: () => wx.showToast({title: "获取 code 失败"}),
    });
  },

  /**
   * 页面加载时，获取用户信息
   */
  onLoad: function () {
    let p = this;

    p.setData({login: APP.globalData.login});

    if (APP.globalData.userInfo != null) {
      p.data.userInfo = APP.globalData.userInfo;
      p.data.hasUserInfo = true;
    } else {
      wx.getUserInfo({
        success(res) {
          APP.globalData.userInfo = res.userInfo;
          p.data.userInfo = res.userInfo;
          p.data.hasUserInfo = true;
        }
      });
    }

    if (APP.globalData.login) {
      wx.request({
        url: APP.globalData.localhost + "/login/myData/info",
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "JSessionId": wx.getStorageSync('JSessionId')
        },
        success(res) {
          if (res.data.success) {
            p.setData({sumOfPublishedData: res.data.data['sumOfPublishedData'],
              likeTotalNum: res.data.data['likeTotalNum'],
              commentTotalNum: res.data.data['commentTotalNum'],
            });
          }
        },
        fail:() => APP.fail()
      });
    }
  }
})