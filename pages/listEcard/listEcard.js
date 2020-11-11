// pages/listEcard/listEcard.js
const APP = getApp();

Page({
  data: {
    inputVal: "",
    list: null,
    pageNum: null,
    pages: null,
    obj: null,
    isShowActionSheet: true
  },

  /**
   * 绑定搜索框的事件 
   */
  bindinput(e) {this.setData({inputVal: e.detail.value})},
  bindconfirm(e) {
     // 登录验证
     if (APP.globalData.login == false) {
      wx.showModal({
        content: "请先登录",
        showCancel: false
      });
      return;
    }

    // 输入内容验证
    this.setData({inputVal: e.detail.value});
    if (this.data.inputVal.length != 9) {
      wx.showToast({title: "错误的输入"});
      return;
    }

    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/ecard/search",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {openId: APP.globalData.openId, query: e.detail.value},
      success(res) {
        console.log("listEcard.js bindconfirm() print\n", res.data);
        if (res.data.success) {
          p.setData({obj: res.data.object, isShowActionSheet: !p.data.isShowActionSheet});
        } else {
          wx.showToast({title: res.data.msg});
        }
      },
      fail:() => APP.fail()
    })
  },

  /**
   * 认领一卡通
   */
  claimEcard: e => {
    wx.navigateTo({url: '../detailEcard/detailEcard?id=' + e.target.dataset.id});
  },

  /**
   * 前往具体的页面
   */
  goToDetailEcardPage(e) {
    // 登录验证
    if (APP.globalData.login == false) {
      wx.showModal({
        content: "请先登录",
        showCancel: false
      });
      return;
    }
    wx.navigateTo({url: '../detailEcard/detailEcard?id=' + e.currentTarget.dataset.id});
  },

  /**
   * 生命周期函数--监听页面加载
   * 页面加载时，获取首页显示的信息
   */
  onLoad() {
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/list/ecard",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      success: (res) => {
        console.log("listEcard.js onLoad() print data\n", res.data);
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showModal({
      content: "上拉刷新中......",
      showCancel: false
    })
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
      url: APP.globalData.localhost + "/list/ecard",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {pageNum: p.data.pageNum + 1},
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
  }
})