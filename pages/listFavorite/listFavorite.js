// pages/listFavorite/listFavorite.js
const APP = getApp();

Page({
  data: {
    favorites: null,

    isHiddenInputFavoriteName: true,
  },

  showOrCloseInputFavoriteName() {this.setData({isHiddenInputFavoriteName: !this.data.isHiddenInputFavoriteName});},

  inputFavoriteName(e) {this.data.favoriteName = e.detail.value;},

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

  goToFavoritedContentPage(e) {
    wx.navigateTo({
      url: '../listFavoritedContent/listFavoritedContent?favoriteid=' + e.currentTarget.dataset.favoriteid
    });
  },

  deleteFavorite(e) {
    let p = this;
    wx.showModal({
      content: '确认删除这个收藏夹？您里面收藏的东西会丢失！',
      success(res) {
        if (res.confirm) {
          wx.showLoading({title: '处理中。。。'});
          wx.request({
            url: APP.globalData.localhost + '/login/favorite/delete',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {id: e.currentTarget.dataset.id},
            success(response) {
              wx.hideLoading();
              APP.showModal(response.data.msg);
            }
          })
        }
      }
    });
  },

  onLoad: function (options) {
    APP.obtainFavorites(this);
  }
})