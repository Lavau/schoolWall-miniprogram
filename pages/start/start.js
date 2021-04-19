Page({
  data: {
    banners:['/assets/img/start/one.png'],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },

  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  goToIndex() {wx.switchTab({url: '/pages/index/index'})},

  imgClick(){
    if (this.data.swiperCurrent + 1 != this.data.swiperMaxNumber) {
      wx.showToast({
        title: '左滑进入',
        icon: 'none',
      })
    }
  },

  onLoad() {

  }
});