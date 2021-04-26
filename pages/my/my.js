// pages/my/my.js
const APP = getApp();

Page({
  data: {
    login: false,
    infos: {},
    hasUserInfo: false,

    isHiddenInputNickname: true,
    nickname: "",
    pathOfPicture: ""
  },

  choosepicture() {
    let p = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        p.setData({pathOfPicture: res.tempFilePaths});

        wx.showModal({
          content: '确定修改头像？？',
          success(res) {
            if (res.confirm) {
              p.submitPicture();
            }
          }
        });
      }
    })
  },

  submitPicture() {
    let p = this;
    console.log(p.data.pathOfPicture, p.data.infos.id);
    APP.serverLoading();
    wx.uploadFile({
      url: APP.globalData.localhost + "/login/picture/save",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      filePath: p.data.pathOfPicture[0],
      name: "picture",
      formData: {typeId: 0, id: p.data.infos.id },
      success(res) {
        wx.hideLoading();
        APP.showModal(res.data);
      },
    });
  },

  showOrCloseInputNickname() {
    this.setData({isHiddenInputNickname: !this.data.isHiddenInputNickname});
  },

  inputNickname(event) {this.data.nickname = event.detail.value; },

  modifyNickname() {
    let p = this;

    if (p.data.nickname.length == 0) {
      APP.showModal('请输入昵称');
      return;
    } 

    APP.verifyDescription(p.data.nickname).then((res) => {
      if (res) { APP.showModal("！！！昵称有敏感信息！！！"); } 
      else { p.submitNickname(); }
    });
  },

  submitNickname() {
    let p = this;
    wx.showModal({
      content: '确定修改昵称？？',
      success(res) {
        if (res.confirm) {
          APP.serverLoading();
          wx.request({
            url: APP.globalData.localhost + '/login/nickname/modify',
            method: "GET",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "JSessionId": wx.getStorageSync('JSessionId')
            },
            data: {'nickname': p.data.nickname},
            success(res) {
              wx.hideLoading();
              APP.showModal(res.data.msg);
              p.setData({isHiddenInputNickname: !p.data.isHiddenInputNickname, nickname: p.data.nickname});
            }
          });
        } else {
          p.setData({isHiddenInputNickname: !p.data.isHiddenInputNickname});
        }
      }
    });
  },

  goToObtainDataPage(e) {
    wx.navigateTo({url: '../obtainData/obtainData?typeid=' + e.currentTarget.dataset.typeid});
  },
  goToFavoritePage() {wx.navigateTo({url: "../listFavorite/listFavorite"});},
  goToMsgPage() {wx.navigateTo({url: '../listMsg/listMsg'});},

  login() {
    let p = this;
    wx.login({
      success(res) {
        // 成功获取到 code，向服务器发送请求
        if (res.code) {
          APP.login(res.code);
          p.setData({login: true});
          p.obtainMyData();
        }
      },
      fail: () => wx.showToast({title: "获取 code 失败"}),
    });
  },

  /**
   * 页面加载时，获取用户信息
   */
  onLoad: function () {
    let p = this;
    p.setData({login: APP.globalData.login});
    if (APP.globalData.login) {
      p.obtainMyData();
    }
  },

  obtainMyData() {
    let p = this;
    APP.serverLoading();
    wx.request({
      url: APP.globalData.localhost + "/login/myData/info",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      success(response) {
        wx.hideLoading();
        if (response.data.success) {
          p.setData({infos: response.data.data, 
                     nickname: response.data.data.nickname, 
                     pathOfPicture: response.data.data.avatarUrl
          });
        }
      },
      fail:() => APP.fail()
    });
  }
})