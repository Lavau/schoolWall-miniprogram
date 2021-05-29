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
  getUserProfile(e) {
    let p = this;
    wx.getUserProfile({
      desc: '用于获取头像与昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success(res) {
        console.log(res.userInfo);
        p.setData({userInfo: res.userInfo });
      }
    })
  },

  /**
   * 注册
   * 向服务器发送注册请求
   */
  register: function(){
    if (this.data.userInfo == null) {
      APP.showModal("请您授权头像与昵称信息");
      return;
    }

    let avatarUrl = this.data.userInfo.avatarUrl;
    let nickname = this.data.userInfo.nickName;
    let p = this.data;

    if(this.data.stuId !== null && this.data.stuId.length == 9 &&
        this.data.name !== null && this.data.collegeId !== null && this.simpleVerify()){
      wx.login({
        success(res) {
          wx.request({
            url: APP.globalData.localhost + "/noLogin/register",
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
            success(response) {
              wx.showModal({
                content: response.data.msg,
                showCancel: false,
                success(res) {
                  if (response.data.success) wx.switchTab({url: '../my/my'});
                }
              }); 
            },
            fail:() => APP.fail()
          });
        },
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
      url:  APP.globalData.localhost + "/noLogin/college/list",
      header: {'content-type': 'APPlication/json'},
      success(response) { p.setData({colleges: response.data.data});},
      fail:() => APP.fail()
    });
  }
})
