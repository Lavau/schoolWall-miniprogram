// pages/publish/publish.js
const APP = getApp();

Page({
  data:{
    actionSheetHidden:true,
   },

  /**
   * 显示底部选择框
   */
  isShowActionSheet() {
    // 出现底部的选项前,先进行登录校验
    if (APP.globalData.login == false) {
      wx.showModal({
        content: "请登录后,再发布",
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            wx.switchTab({url: '../my/my'});
          }
        }
      });
      return;
    }

    this.setData({actionSheetHidden: !this.data.actionSheetHidden});
  },

  /**
   * 前往具体的发布页
   */
  // 前往一卡通发布页 
  goToPublishEcardPage:() => wx.navigateTo({url: '../publishEcard/publishEcard'}),
  // 前往其他类别的发布页
  goToPublishOthersPage:(e) => wx.navigateTo({
    url: '../publishOthers/publishOthers?typeId=' + e.currentTarget.dataset.typeId,
  })
})