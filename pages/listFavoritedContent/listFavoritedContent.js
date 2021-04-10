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
        if (res.confirm) {
          APP.serverLoading();
          wx.request({
            url: APP.globalData.localhost + "/login/favoritedContent/delete",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {favoritedContentId: e.currentTarget.dataset.favoritedcontentid},
            success(response) {
              wx.hideLoading();
              APP.showModal(response.data.msg);
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
              content: "@*—*@：这个收藏夹里面没有收藏东西。。",
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