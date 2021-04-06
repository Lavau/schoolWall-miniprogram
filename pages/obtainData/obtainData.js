// pages/obtainData/obtainData.js
const APP = getApp();

Page({
  data: {
    typeId: null,
    list: [],    
    pageNum: 0,
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
   */
  delete(e) {
      wx.showModal({
      content: "您确定要删除这条记录",
      success(res) {
        // 点击确定, 删除
        if (res.confirm) {
          wx.showLoading({
            title: '处理中',
            mask: true,
          });
          wx.request({
            url: APP.globalData.localhost + "/login/others/delete",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {
              id: e.currentTarget.dataset.id,
              typeId: e.currentTarget.dataset.typeid
            },
            success(res) {
              if (res.data.success) {
                wx.hideLoading({});
                wx.showToast({title: res.data.msg});
              } else {
                wx.hideLoading({});
                wx.showToast({title: res.data.msg, icon: "none"});
              }
            },
            fail:() => APP.fail()
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

    this.setData({typeId: options.typeid});

    wx.request({
      url: APP.globalData.localhost + "/login/myData",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {typeId: p.data.typeId, pageNum: p.data.pageNum + 1},
      success(res) {
          if (res.data.data.list.length == 0) {
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
          } else {
            p.setData({list: res.data.data['list'],
              pageNum: res.data.data['pageNum'],
              pages: res.data.data['pages']
            });
        }
      },
      fail:() => APP.fail()
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
      url: APP.globalData.localhost + "/login/myData",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {typeId: p.data.typeId, pageNum: p.data.pageNum + 1},
      success(res) {
        wx.hideLoading({});
        let listCopy =  p.data.list;
        res.data.data['list'].forEach(e => {
            listCopy.push(e);
        });
        p.setData({list: listCopy,
            pageNum: res.data.data['pageNum'],
            pages: res.data.data['pages']
        });
      },
      fail:() => APP.fail()
    });
  }
})