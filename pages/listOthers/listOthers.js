// pages/listOthers/listOthers.js
const APP = getApp();

Page({
  data: {
    typeId: "",
    list: null,    
    pageNum: null,
    pages: null
  },

  /**
   * 前往具体的页面
   */
  goToDetailOthersPage(e) {
    if (APP.globalData.login == false) {
      wx.showToast({title: "请先登录"});
      return;
    }
    wx.navigateTo({
      url: '../detailOthers/detailOthers?id=' + e.currentTarget.dataset.id +
            '&typeId=' + e.currentTarget.dataset.typeid
    });
  },

  /**
   * 页面加载时，获取数据
   */
  onLoad(options) {
    this.setData({typeId: options.typeId});

    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/list/others",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {typeId: p.data.typeId},
      success: (res) => {
        console.log("listOthers.js onLoad() print data\n", res.data);
        p.setData({
          list: res.data['list'],
          pageNum: res.data['pageNum'],
          pages: res.data['pages']
        });
      },
      fail:() => APP.fail()
    });
  },

  /**
   * 监听页面滚动到顶部,触发加载事件
   */
  onReachBottom() {
    if (this.data.pageNum == this.data.pages) {
      wx.showToast({title: '暂无最新数据'});
      return;
    }

    let p = this;
    wx.showLoading({title: '数据加载中'});
    wx.request({
      url: APP.globalData.localhost + "/list/others",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {pageNum: p.data.pageNum + 1, typeId: p.data.typeId},
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
      },
      fail:() => APP.fail()
    });
  },
})