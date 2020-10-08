// pages/index/index.js
Page({
  data: {
      motto: 'Hello World',
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      navData:[
          { text: '关注'},
          { text: '发现'},
          { text: '吐槽'},
          { text: '求助'},
          { text: '失物招领'},
          { text: '一卡通'},
          { text: '吐槽/感谢'},
          { text: '求助'},
          { text: '找失物'},
          { text: '脱单'},
      ],
      currentTab: 0,
      navScrollLeft: 0
  },

  switchNav(event){
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
  switchTab(event){
      var cur = event.detail.current;
      var singleNavWidth = this.data.windowWidth / 5;
      this.setData({
          currentTab: cur,
          navScrollLeft: (cur - 2) * singleNavWidth
      });
  }
})