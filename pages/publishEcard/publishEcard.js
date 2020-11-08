// pages/publishEcard/publishEcard.js
const APP = getApp();

Page({
  data: {
    uuid: "",
    ecardId: "",
    stuId: "",
    collegeName: '--请选择--',
    name: "",
    msg: "",

    select: false,
    collegeId: 0,
    colleges: {}
  },

  /**
   * 确定输入的信息
   */
  inputEcardId: function(e) {this.data.ecardId = e.detail.value;},
  inputStuId: function(e) {this.data.stuId = e.detail.value;},
  inputName: function(e) {this.data.name = e.detail.value},
  inputMsg: function(e) {this.data.msg = e.detail.value},

  /**
   * 学院下拉选框
   */
  // 出示/关闭选框
  bindShowMsg: function() {
    this.setData({select: !this.data.select});
  },

  // 处理选择结果
  mySelect: function(e) {
    let item = e.currentTarget.dataset.name;
    this.setData({
      collegeName: item['collegeName'],
      collegeId: item['collegeId'],
      select: false
    });
  },

  /**
   * 向后台提交一卡通信息
   */
  submit: function() {
    // 提交前判断
    if(this.data.uuid.length === 0){
      this.showModal("uuid 不能为空！");
      return;
    }
    if(this.data.ecardId.length == 0 || this.data.stuId.length == 0 || this.data.collegeId == 0 
       || this.data.name.length == 0 || this.data.msg.length == 0){
         this.showModal("内容必须都要填哦！");
         return;
    }

    //满足提交要求，进行提交
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/ecard/publish",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {
        openId: APP.globalData.openId,
        id: p.data.uuid,
        ecardId: p.data.ecardId,
        college: p.data.collegeName,
        stuId: p.data.stuId,
        stuName: p.data.name,
        msg: p.data.msg
      },
      success: (e) => {
        let result = e.data;
        if(result["success"]) {
          wx.showModal({
            content: result["msg"],
            showCancel: false,
            success: (e) => wx.switchTab({url: '../index/index'})
          });
        } else {
          wx.showModal({
            content: result["msg"],
            showCancel: false
          })
        }
      },
      fail: () => wx.showModal({
          content: "提交失败！",
          showCancel: false,
          success: () => wx.switchTab({url: '../index/index'})
        })
    });
  },

  /**
   * 页面加载时，获取uuid、学院信息
   */
  onLoad: function() {
    this.data.uuid = APP.uuid();
    console.log("ecard uuid：" + this.data.uuid);

     // 获取学院信息
    let p = this;
    wx.request({
      timeout: APP.globalData.timeout,
      // fail: app.fail(),
      url:  APP.globalData.localhost + "/college",
      header: {'content-type': 'application/json'},
      success: e => p.setData({colleges: e.data.list})
    });
  },

  /**
   * 
   */
  showModal: function(e) {
    wx.showModal({
      content: e,
      showCancel: false
    });
  }
})