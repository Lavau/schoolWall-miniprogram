// pages/listFavoritedContent/listFavoritedContent.js
const APP = getApp();

Page({
  data: {
    favoriteId: "",
    favoritedContents: []
  },

  goToDetailOthersPage(e) {
    wx.navigateTo({url: '../detail/detail?id=' + e.currentTarget.dataset.id});
  },
  
  deleteFavoritedContent(e) {
    wx.showModal({
      content: "您确定要将这条记录从这个收藏夹中除去？！！",
      success(res) {
        // 点击确定, 删除
        if (res.confirm) {
          wx.showLoading({
            title: '处理中',
            mask: true,
          });
          wx.request({
            url: APP.globalData.localhost + "/login/favoritedContent/delete",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {favoritedContentId: e.currentTarget.dataset.favoritedcontentid},
            success(res) {
              wx.hideLoading({});
              if (res.data.success) {
                wx.showToast({title: res.data.msg});
              } else {
                wx.showToast({title: res.data.msg, icon: "none"});
              }
            },
            fail:() => APP.fail()
          })
        }
      }
    });
  },

  onLoad: function (options) {
    let p = this;
    p.data.favoriteId = options.favoriteid;
    wx.request({
      url: APP.globalData.localhost + "/login/favoritedContent/list",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {favoriteId: p.data.favoriteId},
      success(response) {
        if (response.data.success) {
          if (response.data.data.length == 0) {
            wx.showModal({
              content: "暂无数据",
              showCancel: false,
              success(res) {if (res.confirm) {wx.navigateBack({delta: -1});}}
            });
          } else {
            p.setData({favoritedContents: response.data.data});
          }
        }
      },
      fail:() => APP.fail()
    });
  }
})