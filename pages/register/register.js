// pages/register/register.js
const APP = getApp();

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
      wx.showToast({title: "请您授权信息", icon: "none"});
      return;
    }

    let avatarUrl = this.data.userInfo.avatarUrl;
    let nickname = this.data.userInfo.nickName;
    let p = this.data;

    if(this.data.stuId !== null && this.data.stuId.length == 9 &&
        this.data.name !== null && this.data.collegeId !== null && this.simpleVerify()){
      wx.login({
        timeout: APP.globalData.timeout,
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
          success: function(e) {
            if(e.data.success){
              APP.globalData.openId = e.data.status;
              APP.globalData.login = true;
              wx.setStorageSync("openId", e.data.status);
              wx.showToast({title: "注册成功"});
              wx.switchTab({url: '../index/index'});
            } else {
              wx.showModal({
                title: e.data.msg,
                showCancel: true
              });
            }
          },
          fail:() => APP.fail()
        }),
        fail:() => wx.showToast({title: "获取 code 失败", icon: "none"})
      });
  } else {
      wx.showToast({title: "请检查输入！", icon: "none"});
    }
  },

  inputStuId: function(e) {this.setData({stuId: e.detail.value});},
  inputName: function(e) {this.setData({name: e.detail.value});},

  /**
   * 简单验证
   */
  simpleVerify() {
    return this.data.dateValue.substring(2, 4) == this.data.stuId.substring(0, 2) && 
            this.data.collegeId == parseInt(this.data.stuId.substring(2, 4));
  },

  /**
   * 在页面加载过程中获取：年份、学院信息
   */
  onLoad: function() {
    let date = new Date();
    this.setData({
      endDate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
      userInfo: APP.globalData.userInfo
    });

    let p = this;
    wx.request({
      url:  APP.globalData.localhost + "/college",
      header: {'content-type': 'APPlication/json'},
      success: e => p.setData({colleges: e.data.list}),
      fail:() => APP.fail()
    });
  }
})
