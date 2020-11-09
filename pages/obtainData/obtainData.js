// pages/obtainData/obtainData.js
const APP = getApp();

Page({
  data: {
    url: "",
    list: null,    
    pageNum: null,
    pages: null,
  },

  /**
   * 前往具体的页面
   */
  goToDetailOthersPage(e) {
    wx.navigateTo({
        url: '../detailOthers/detailOthers?id=' + e.currentTarget.dataset.id +
             '&typeId=' + e.currentTarget.dataset.typeid
     });
  },

  /**
   * 删除某条记录
   * @param {*} e 
   */
  delete(e) {
    wx.showModal({
      content: "您确定要删除这条记录",
      success(res) {
        // 点击确定, 删除
        if (res.confirm) {
          wx.request({
            url: APP.globalData.localhost + "/login/others/delete",
            method: "POST",
            header: {"Content-Type": "application/x-www-form-urlencoded"},
            data: {
              openId: APP.globalData.openId, 
              id: e.currentTarget.dataset.id,
              typeId: e.currentTarget.dataset.typeId
            },
            success(res) {
              if (res.data.success) {
                wx.showToast({title: res.data.msg});
              } else {
                wx.showToast({title: res.data.msg});
              }
            },
            fail: () => wx.showModal({content: "删除失败,请重试"})
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let p = this;

    this.setData({url: options.url});

    wx.request({
      url: APP.globalData.localhost + "/login" + this.data.url,
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {openId: APP.globalData.openId},
      success: (res) => {
        console.log(res.data);
        if (res.data != "error") {
          if (res.data.pageNum == 0) {
            wx.showModal({
              content: "暂无数据",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({delta: -1});
                }
                return;
              }
            })
          }
          p.setData({list: res.data['list'],
            pageNum: res.data['pageNum'],
            pages: res.data['pages']
          });
        } else {
          wx.showModal({
            content: res.data,
            showCancel: false
          });
        }
      },
      fail() {
        wx.showModal({
          content: "获取数据失败",
          showCancel: false
        })
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.pageNum == this.data.pages){
      wx.showModal({
        content: '暂无最新数据',
        showCancel: false
      });
      return;
  }

    let p = this;
    wx.showLoading({
      title: '数据加载中',
    });

    wx.request({
      url: APP.globalData.localhost + "/login" + this.data.url,
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {pageNum: p.data.pageNum + 1, openId: wx.getStorageSync('openId')},
      success: (res) => {
        wx.hideLoading({});
        let listCopy =  p.data.list;
        res.data['list'].forEach(e => {
            listCopy.push(e);
        });
        p.setData({list: listCopy,
            pageNum: res.data['pageNum'],
            pages: res.data['pages']
        });
      }
    });
  }
})