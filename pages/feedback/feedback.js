const APP = getApp();

Page({
  data: {
    uuid: "",

    description: "",
    wordNum: 0,
    pathOfPictures: []
  },

  /**
   * 获取输入的内容
   */
  inputDescription(e) {
    this.data.description = e.detail.value;
    this.setData({wordNum: e.detail.value.length});
  },

  /**
   * 选择要上传的图片
   */
  choosepicture() {
    let p = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {p.setData({pathOfPictures: res.tempFilePaths});}
    })
  },

  /**
   * 预览图片
   */
  previewpicture(e) {
    let index = e.currentTarget.dataset.index;
    let pathOfPictures = this.data.pathOfPictures;
    wx.previewImage({
      current: pathOfPictures[index],
      urls: pathOfPictures
    });
  },

  submit() {
    let p = this;

    if (p.data.uuid.length == 0) {
      APP.showModal("uuid 为空！");
      return;
    }

    if (p.data.description.length == 0 && p.data.pathOfPictures.length == 0) { 
      APP.showModal("必须有具体的文字或照片哟");
    } else {
      p.submitDescription();
      p.submitPictures();
    }
  },

  submitDescription() {
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/publish",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {
        id: p.data.uuid,
        typeId: 10,
        description: p.data.description,
        pictureNum: p.data.pathOfPictures.length
      },
      success(response) {
        wx.showModal({
          content: '反馈成功',
          showCancel: false,
          success(res) {
            // if (response.data.success && res.confirm) {
              wx.switchTab({url: '../index/index'});
            // }
          }
        });
      },
    });
  },

  submitPictures() {
    let p = this;
    for (let i = 0; i < p.data.pathOfPictures.length; i++) {
      wx.uploadFile({
        url: APP.globalData.localhost + "/login/picture/save",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "JSessionId": wx.getStorageSync('JSessionId')
        },
        filePath: p.data.pathOfPictures[i],
        name: "picture",
        formData: {
          typeId: 10,
          id: p.data.uuid
        },
        success(response) {},
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({uuid: APP.uuid()});
  },
})