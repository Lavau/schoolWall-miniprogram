// pages/index/index.js
const APP = getApp();

Page({
  data: {
      list: null,    
      pageNum: null,
      pages: null,

      type: null,

      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      navData:[
          { text: '发现'},
          { text: '一卡通'},
          { text: '失物招领'},
          { text: '求助'},
          { text: '脱单'},
      ],
      currentTab: 0,
      navScrollLeft: 0
  },

  switchNav: function(event) {
      var cur = event.currentTarget.dataset.current; 
      //每个tab选项宽度占1/5
      var singleNavWidth = this.data.windowWidth / 5;
      //tab选项居中                            
      this.setData({
          navScrollLeft: (cur - 2) * singleNavWidth
      })      
      if (this.data.currentTab == cur) {
          return false;
      } else {
          this.setData({
              currentTab: cur
          })
      }
  },
  switchTab: function(event) {
      var cur = event.detail.current;
      var singleNavWidth = this.data.windowWidth / 5;
      this.setData({
          currentTab: cur,
          navScrollLeft: (cur - 2) * singleNavWidth
      });
  },

  /**
   * 前往分类和关键字页
   */
  goToTypeAndKeywordPage: function() {
      wx.navigateTo({
        url: '../typeAndKeyword/typeAndKeyword',
      })
  },

  /**
   * 页面加载时，获取首页显示的信息
   */
  onLoad: function() {
      let p = this;
      wx.request({
        url: APP.globalData.localhost + "/index",
        success: (res) => {
            p.setData({list: res.data['list'],
                pageNum: res.data['pageNum'],
                pages: res.data['pages']
            });
            console.log(res.data)
        }
      })
  },

 /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      wx.showModal({
          content: "上拉刷新中......",
          showCancel: false
      })
  },

    /**
     * 首页上拉触发加载事件
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
            url: APP.globalData.localhost + "/index",
            method: 'GET',
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
                console.log(res.data)
            }
          })
    },
})