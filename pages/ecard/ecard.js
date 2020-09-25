// pages/ecard/ecard.js
Page({
  data: {
    modalHidden: true,
    claimModalHidden: true,
    claimEcardId: "",
    ecardId: "",
    stuId: "",
    college: "",
    name: "",
  },

  /**
   * 以下是“提交一卡通 ID ”相关函数
   */
  // 出示认领的对话框
  showClaimDialog: function() {
    this.setData({claimModalHidden: !this.data.claimModalHidden});
  },

  // 隐藏认领的对话框
  hiddenClaimDialog: function() {
    this.setData({claimModalHidden: !this.data.claimModalHidden});
  },

  // 向后台提交被认领的一卡通 ID
  submitClaimEcardId: function() {
    if(this.data.claimEcardId !== "") console.log("成功");
    else 
      wx.showModal({
        title: "请填写一卡通 ID"
      })
  },


  // 确定输入的信息
  inputClaimEcardId: function(e) {this.data.claimEcardId = e.detail.value;},

  /**
   * 以下是“提交一卡通”相关函数
   */
  // 出示“提交被捡到的一卡通”的对话框
  showDialog: function() {
    this.setData({modalHidden: !this.data.modalHidden});
  },

  // 隐藏“提交被捡到的一卡通”的对话框
  hiddenDialog: function() {
    this.setData({modalHidden: !this.data.modalHidden});
  },

  // 向后台提交被捡到的一卡通信息
  submitInformation: function(e){
    if(this.data.ecardId !== "" && this.data.stuId !== "" && this.data.college !== ""
       && this.data.name !== "" && this.data.msg !== "")
       console.log("提交成功");
    else 
      wx.showModal({
        title: "请填写完整"
      })
  },

  // 确定输入的信息
  inputEcardId: function(e) {this.data.ecardId = e.detail.value;},
  inputStuId: function(e) {this.data.stuId = e.detail.value;},
  inputCollege: function(e) {this.data.college = e.detail.value},
  inputName: function(e) {this.data.name = e.detail.value},
  inputMsg: function(e) {this.data.msg = e.detail.value}
})