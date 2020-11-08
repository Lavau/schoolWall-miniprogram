// pages/register/register.js
const APP = getApp()

Page({
  data: {
    stuId: null,
    name: null,
    select: false,
    endDate: null,
    colleges: {},
    collegeName: '--请选择--',
    collegeId: null,
    dateValue: '2020',
    userInfo: null
  },

  bindShowMsg: function() {
    this.setData({select: !this.data.select});
  },

  mySelect: function(e) {
    let item = e.currentTarget.dataset.name;
    this.setData({
      collegeName: item['collegeName'],
      collegeId: item['collegeId'],
      select: false
    });
  },

  datePickerBindchange:function(e){
    this.setData({dateValue:e.detail.value});
   },

   /**
   * 获取用户信息
   */
  obtainUserInfo(e) {
    console.log("register.js: obtainUserInfo() \n", e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
    });
    APP.globalData.userInfo = e.detail.userInfo;
  },

  /**
   * 注册
   * 向服务器发送注册请求
   */
  register: function(){
    if (this.data.userInfo == null) {
      wx.showModal({
        content: "请您授权信息",
        cancelColor: 'cancelColor',
      });
      return;
    }

    let avatarUrl = this.data.userInfo.avatarUrl;
    let nickname = this.data.userInfo.nickName;
    let p = this.data;

    if(this.data.stuId !== null && this.data.name !== null && this.data.collegeId !== null){
      wx.login({
        timeout: APP.globalData.timeout,
        // fail: APP.fail(),
        success: res => wx.request({
          url: APP.globalData.localhost + "/register",
          method: "POST",
          header: {"Content-Type": "application/x-www-form-urlencoded"},
          data: {
            stuId: p.stuId,
            stuName: p.name,
            collegeId: p.collegeId,
            avatarUrl: avatarUrl,
            nickname: nickname,
            code: res.code
          },
          timeout: APP.globalData.timeout,
          // fail: APP.fail(),
          success: function(e) {
            if(e.data.success){
              APP.globalData.openId = e.data.status;
              APP.globalData.login = true;
              wx.setStorageSync("openId", e.data.status);
              wx.showModal({
                title: "注册成功",
                showCancel: true,
                success: function(res) {
                  if (res.confirm) {
                    wx.switchTab({url: '../index/index'});
                  }
                }
              });
            } else {
              wx.showModal({
                title: e.data.msg,
                showCancel: true
              });
            }
          }
      })
    });} else {
      wx.showModal({
        title: "请检查输入！",
        showCancel: true
      });
    }
  },

   inputStuId: function(e) {this.setData({stuId: e.detail.value});},
   inputName: function(e) {this.setData({name: e.detail.value});},

  /**
   * 在页面加载过程中获取：年份、学院信息
   */
  onLoad: function() {
    let date = new Date();
    this.setData({endDate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()});

    let p = this;
    wx.request({
      timeout: APP.globalData.timeout,
      // fail: APP.fail(),
      url:  APP.globalData.localhost + "/college",
      header: {'content-type': 'APPlication/json'},
      success: e => p.setData({colleges: e.data.list})
    });
  }
})
