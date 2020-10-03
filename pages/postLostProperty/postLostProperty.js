// pages/postLostProperty/postLostProperty.js
const APP = getApp();

Page({
  data: {
    uuid: "",
    title: "",
    description: "",
    wordNum: 0,
    photos: [],
    msg: "",
  },

  /**
   * 获取输入的内容：物品名，物品描述，认领信息
   */
  inputTitle: function(e) {this.setData({title: e.detail.value})},
  inputDescription: function(e) {
    this.data.description = e.detail.value;
    this.setData({wordNum: e.detail.value.length});
  },
  inputMsg: function(e) {this.setData({msg: e.detail.value})},

  /**
   * 选择要上传的图片
   */
  choosePhoto: function() {
    let p = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => p.setData({photos: res.tempFilePaths}),
    })
  },

  /**
   * 预览图片
   */
  previewPhoto: function(e){
    let index = e.currentTarget.dataset.index;
    let pictures = this.data.photos;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    });
   },

   /**
    * 提交物品信息
    */
  submit: function() {
    // 要求 uuid 必须不为空串
    let p = this;
    if(p.data.uuid.length == 0){
      this.showModal("uuid 为空！");
      return;
    }
    if(p.data.title.length > 0 && p.data.msg.length > 0 
      && p.data.description.length > 0 || p.data.photos.length > 0){
        console.log(p.data.uuid)
        console.log(p.data.title)
        console.log(p.data.description)
        console.log(p.data.photos.length)
        console.log(p.data.msg)

        // 提交非图片部分
        wx.request({
          url: APP.globalData.localhost + "/login/lostAndFound",
          method: "POST",
          header: {"Content-Type": "application/x-www-form-urlencoded"},
          data: {
            id: p.data.uuid,
            itemName: p.data.title,
            description: p.data.description,
            photoNum: p.data.photos.length,
            msg: p.data.msg
          },
          success: (e) => {}
        });
        
        // 提交图片
        for(let i = 0; i < p.data.photos.length; i++){
          console.log(p.data.photos[i]);
          console.log(p.data.photos);
          console.log("第"+i+"张图");
          wx.uploadFile({
            url: APP.globalData.localhost + "/login/uploadPhoto",
            filePath: p.data.photos[i],
            name: "uploadFile",
            formData: {
              i: i,
              typeId: "4",
              uuid: p.data.uuid,
            },
            success: (e) => {
              let result = JSON.parse(e.data);
              console.log(result)
              if(!result["success"]){
                p.showModal(result["msg"]);
              }
            }
          });
          console.log("上传完成");
        }
        
        p.showModal("提交成功！");
    } else {
      this.showModal("必须有描述或照片");
    }
  },

   /**
    * 页面加载时，获取 uuid
    */
  onLoad: function() {
    this.data.uuid = APP.uuid();
  },

  /**
   * 显示提示信息
   * @param {提示的信息}} e 
   */
  showModal: function(e) {
    wx.showModal({
      content: e,
      showCancel: false
    })
  }
})