// pages/publishOthers/publishOthers.js
const APP = getApp();

Page({

  data: {
    typeId: "",
    uuid: "",
    title: "",
    description: "",
    Anonymous: false,
    wordNum: 0,
    gmtDeat: null,
    pictures: []
  },

  /**
   * 获取输入的内容：主题，内容具体描述，是否匿名
   */
  inputTitle(e) {this.setData({title: e.detail.value})},
  inputDescription(e) {
    this.data.description = e.detail.value;
    this.setData({wordNum: e.detail.value.length});
  },
  inputAnonymous(e) {this.setData({Anonymous: e.detail['value']})},

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

   /**
    * 提交相关信息
    */
  submit() {
    // 要求 uuid 必须不为空串
    let p = this;
    if(p.data.uuid.length == 0){
      this.showModal("uuid 为空！");
      return;
    }

    if(p.data.title.length === 0){
      this.showModal("主题不能为空哦");
      return;
    }
    if(p.data.description.length > 0 || p.data.pictures.length > 0){
        // 提交非图片部分
        wx.request({
          url: APP.globalData.localhost + "/login/publicity",
          method: "POST",
          header: {"Content-Type": "application/x-www-form-urlencoded"},
          data: {
            id: p.data.uuid,
            title: p.data.title,
            description: p.data.description,
            pictureNum: p.data.pictures.length,
            Anonymous: p.data.Anonymous
          },
          success: (e) => {}
        });
        
        // 提交图片
        for(let i = 0; i < p.data.pictures.length; i++){
          wx.uploadFile({
            url: APP.globalData.localhost + "/login/uploadPicture",
            filePath: p.data.pictures[i],
            name: "uploadFile",
            formData: {
              typeId: "1",
              uuid: p.data.uuid,
            },
            success: (e) => {
              // 图片提交失败时，显示提示信息
              let result = e.data;
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

        // 显示成功提交的信息
        wx.showModal({
          content: "提交成功！",
          showCancel: false,
          success: (e) => wx.switchTab({url: '../index/index'})
        });
    } else {
      this.showModal("必须有描述或照片");
    }
  },

  /**
   * 取消提交
   * 重定型到首页
   */
  cancel() {
    wx.switchTab({url: '../index/index'});
  },

  /**
   * 显示提示信息
   * @param {提示的信息}} e 
   */
  showModal(e) {
    wx.showModal({
      content: e,
      showCancel: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      typeId: options.typeId,
      uuid: APP.uuid()
    });
  }
})