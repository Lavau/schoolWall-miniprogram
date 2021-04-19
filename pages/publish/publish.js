const APP = getApp();

Page({
  data: {
    uuid: "",
    login: false,

    types: [],
    typeIndex: -1,
    typeNames: [],
    labelId: -1,

    placeholderOfDescription: "请输入具体的内容",
    placeholderOfMsg: "",
    msg: "",

    description: "",
    Anonymous: false,
    wordNum: 0,
    pictures: []
  },

  /**
   * 获取输入的内容
   */
  inputLabel(e) {
    this.setData({
      typeIndex: e.detail.value,
      labelId: this.data.types[e.detail.value].id, 
      placeholderOfDescription: "请输入具体的内容"
    });
    if (this.data.labelId == 5 || this.data.labelId == 8) {
      this.setData({
        placeholderOfDescription: "请输入具体的内容（为了物品的安全，请您在下方单独填写认领方式）",
        placeholderOfMsg: "请输入认领方式"
      });
    } 
    if (this.data.labelId == 7) {
      this.setData({
        placeholderOfDescription: "请输入具体的内容（为了您的隐私安全，建议您在下方单独填写联系方式）",
        placeholderOfMsg: "请输入您的联系方式"
      });
    } 
  },
  inputDescription(e) {
    this.data.description = e.detail.value;
    this.setData({wordNum: e.detail.value.length});
  },
  inputMsg(e) {
    this.data.msg = e.detail.value;
  },
  inputAnonymous(e) {this.setData({Anonymous: !e.currentTarget.dataset.anonymous})},

  /**
   * 选择要上传的图片
   */
  choosepicture() {
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
  previewpicture(e) {
    let index = e.currentTarget.dataset.index;
    let pictures = this.data.pictures;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    });
  },

  submit() {
    let p = this;

    if (p.data.uuid.length == 0 || p.data.labelId == -1) {
      APP.showModal(p.data.uuid.length == 0 ? "uuid 为空！" : "标签不能为空哦");
      return;
    }

    if ((p.data.labelId == '5' || p.data.labelId == '8') && p.data.msg.length == 0) {
      APP.showModal("不要忘了填认领信息啊");
      return;
    }

    if (p.data.description.length == 0 && p.data.pictures.length == 0) { 
      APP.showModal("必须有具体的文字或照片哟");
    } else {
        // 提交非图片部分
        wx.request({
          url: APP.globalData.localhost + "/login/publish",
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "JSessionId": wx.getStorageSync('JSessionId')
          },
          data: {
            id: p.data.uuid,
            typeId: p.data.labelId,
            description: p.data.description,
            msg: p.data.msg,
            anonymous: p.data.Anonymous,
            pictureNum: p.data.pictures.length
          },
          success(response) {
            wx.showModal({
              content: response.data.msg,
              showCancel: false,
              success(res) {
                if (response.data.success && res.confirm) {
                  p.resetData();
                  wx.switchTab({url: '../index/index'});
                }
              }
            });
          },
        });
        
        // 提交图片
        for (let i = 0; i < p.data.pictures.length; i++) {
          wx.uploadFile({
            url: APP.globalData.localhost + "/login/picture/save",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            filePath: p.data.pictures[i],
            name: "picture",
            formData: {
              typeId: p.data.labelId,
              id: p.data.uuid
            },
            success(response) {
              if (!response.data.success) {
                wx.showToast({content: response.data.msg});
              }
            },
          });
        }
    }
  },

  /**
   * 重置本页数据
   * （跳转到首页后，若再回到发布页，发布页数据不变；
   *   为方便用户重新发布数据，这里我们自行重置数据）
   */
  resetData() {
    this.setData({   
      uuid: APP.uuid(),

      typeIndex: -1,
      labelId: -1,

      placeholderOfDescription: "请输入具体的内容",
      placeholderOfMsg: "",
      msg: "",

      description: "",
      Anonymous: false,
      wordNum: 0,
      pictures: [],
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let p = this;

    p.setData({uuid: APP.uuid(), login: APP.globalData.login});

    wx.request({
      url: APP.globalData.localhost + "/login/type/obtain",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      success(response) {
        if (response.data.success) {
          let types = response.data.data;
          let typeNames = [];
          types.forEach(item => typeNames.push(item.chineseName));
          p.setData({types: types, typeNames: typeNames});
        } else {
          APP.showModal(response.data.msg);
        }
      },
      fail:() => APP.fail()
    });
  },

  login() {
    let p = this;
    wx.login({
      success(res) {
        // 成功获取到 code，向服务器发送请求
        if (res.code) {
          APP.login(res.code);
          p.setData({login: true});
        }
      },
      fail: () => wx.showToast({title: "获取 code 失败"}),
    });
  },
})