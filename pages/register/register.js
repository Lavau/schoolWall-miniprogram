// pages/register/register.js
const app = getApp()

Page({
  data: {
    stuId: null,
    name: null,
    select: false,
    endDate: null,
    colleges: {},
    collegeName: '--请选择--',
    collegeId: null,
    dateValue: '2020'
  },

  bindShowMsg: function() {
    this.setData({select: !this.data.select});
  },

  mySelect: function(e) {
    let item = e.currentTarget.dataset.name;
    this.setData({
      collegeName: item.name,
      collegeId: item.collegeId,
      select: false
    });
  },

  datePickerBindchange:function(e){
    this.setData({dateValue:e.detail.value});
   },

  //  这个函数需要“瘦身”
  register: function(){
    if(this.data.stuId !== null && this.data.name !== null && this.data.collegeId !== null){
      console.log(this.data.stuId);
      console.log(this.data.name);
      console.log(this.data.collegeId);
      wx.request({
        url: app.globalData.localhost + "/user/register",
        method: "POST",
        header: {"Content-Type": "application/x-www-form-urlencoded"},
        data: {
          stuId: this.data.stuId,
          name: this.data.name,
          collegeId: this.data.collegeId
        },
        success: function(e) {
          if(e.data.success){
            wx.showModal({
              title: "注册成功",
              showCancel: true
            });
          } else {
          wx.showModal({
            title: "注册失败",
            showCancel: true
          });
          }
        }
      })
    } else {
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
      url:  app.globalData.localhost + "/college",
      header: {'content-type': 'application/json'},
      success: e => p.setData({colleges: e.data.list})
    });
  }
})
