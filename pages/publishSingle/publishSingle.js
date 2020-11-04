// pages/publishSingle/publishSingle.js
const APP = getApp();

Page({
  data: {
    uuid: "",
    height: "",
    weight: "",
    speciality: "",
    interest: "",
    description: "",
    Anonymous: false,
    wordNum: 0,
    msg: "",
    pictures: []
  },

  /**
   * 获取输入的内容：身高，体重，特长，爱好，内容具体描述，是否匿名，联系信息
   */
  inputHeight: function(e) {this.setData({height: e.detail.value})},
  inputWeight: function(e) {this.setData({weight: e.detail.value})},
  inputSpeciality: function(e) {this.setData({speciality: e.detail.value})},
  inputInterest: function(e) {this.setData({interest: e.detail.value})},
  inputDescription: function(e) {
    this.data.description = e.detail.value;
    this.setData({wordNum: e.detail.value.length});
  },
  inputAnonymous: function(e) {this.setData({Anonymous: e.detail['value']})},
  inputMsg: function(e) {this.setData({msg: e.detail.value})},

  /**
   * 选择要上传的图片
   */
  choosepicture: function() {
    let p = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => p.setData({pictures: res.tempFilePaths}),
    })
  },

  /**
   * 预览图片
   */
  previewpicture: function(e){
    let index = e.currentTarget.dataset.index;
    let pictures = this.data.pictures;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    });
   },

   /**
    * 提交脱单信息
    */
  submit: function() {
    // 判断是否符合上传规则：
    //       要求 uuid 必须不为空串、详细描述或图片必须有一个
    let p = this;
    let success;
    let msg;
    if(p.data.uuid.length == 0){
      this.showModal("uuid 为空！");
      return;
    }
    if(p.data.description.length == 0 && p.data.pictures.length == 0){
      this.showModal("详细描述或图片必须有一个哦·");
      return;
    }

    // 提交非图片部分
    wx.request({
      url: APP.globalData.localhost + "/login/single",
      method: "POST",
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      data: {
        id: p.data.uuid,
        typeId: 6,
        height: p.data.height,
        weight: p.data.weight,
        speciality: p.data.speciality,
        interest: p.data.interest,
        description: p.data.description,
        pictureNum: p.data.pictures.length,
        Anonymous: p.data.Anonymous,
        contactInformation: p.data.msg
      },
      success: (e) => {
        wx.showModal({
          content: e.data['msg'],
          showCancel: false,
          success: (e) => wx.switchTab({url: '../index/index'})
        });
      }
    });
    
    // 提交图片
    for(let i = 0; i < p.data.pictures.length; i++){
      wx.uploadFile({
        url: APP.globalData.localhost + "/login/uploadPicture",
        filePath: p.data.pictures[i],
        name: "uploadFile",
        formData: {
          typeId: "6",
          uuid: p.data.uuid,
        },
        success: (e) => {
          // 图片提交失败时，显示提示信息
          let result = e.data;
          console.log(result)
          if(result["success"] == false) {
            wx.showModal({
              content: result["msg"] + "\n图片提交失败",
              showCancel: false,
              success: (e) => wx.switchTab({url: '../index/index'})
            });
          }
        }
      });
    }
  },

  /**
   * 取消提交
   * 重定型到首页
   */
  cancel: function() {
    wx.switchTab({url: '../index/index'});
  },

  /**
    * 页面加载时，获取 uuid
    */
  onLoad: function() {
    this.data.uuid = APP.uuid();
    console.log("single uuid：" + this.data.uuid);
  },

  /**
   * 显示提示信息
   * @param {提示的信息}} e 
   */
  showModal: function(e) {
    wx.showModal({
      content: e,
      showCancel: false
    });
  }
})