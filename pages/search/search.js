// pages/search/search.js
const APP = getApp();

Page({
  data: {
    labelId: "",
    labelText: "请选择搜索的标签",
    isHiddenLabelModal: true,
    types: [],

    searchText: "",

    beginDate: "开始时间",
    endDate: "结束时间",

    list: [],
    pageNum: 0,
    pages: null,
  },

  /**
   * 获取搜索的内容
   */
  showOrCloseLabelModal() {
    this.setData({isHiddenLabelModal: !this.data.isHiddenLabelModal});
  },
  inputSearchText(e) { this.data.searchText = e.detail.value;},
  inputBeginDate(e) {this.setData({beginDate: e.detail.value});},
  inputEndDate(e) {this.setData({endDate: e.detail.value});},
  inputLabel(e) {
    this.setData({
      labelId: e.currentTarget.dataset.label.id, 
      labelText: e.currentTarget.dataset.label.chineseName,
      isHiddenLabelModal: !this.data.isHiddenLabelModal,
    });
  },

  search() {
    let p = this;
    if (p.data.labelId.length == 0 && p.data.searchText.length == 0 
      && p.data.beginDate == "开始时间" && p.data.endDate == "结束时间") {
      APP.showModal('(*^_^*)：搜索内容必须填哦');
    } else {
      p.obtainSearchResults();
    }
  },

  /**
   * 监听页面滚动到顶部,触发加载事件————获取下一页搜索结果数据
   */
  onReachBottom() {
    if (this.data.pageNum == this.data.pages) {
      APP.showModal("i( •̀ ω •́ )✧：没有内容喽。。。");
      return;
    }
    wx.showLoading({title: '数据加载中'});
    this.obtainSearchResults();
    wx.hideLoading({});
  },

  obtainSearchResults() {
    let p = this;
    wx.request({
      url: APP.globalData.localhost + "/login/comment/reply/list",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      data: {
        typeId: p.data.labelId,
        searchText: p.data.searchText,
        beginDate: p.data.beginDate,
        endDate: p.data.endDate
      },
      success(response) {
        let listCopy = p.data.list;
        response.data.data.list.forEach(item => {
            listCopy.push(item);
        });

        p.setData({
          list: listCopy,
          pageNum: response.data.data.pageNum,
          pages: response.data.data.pages
        });
      },
      fail:() => APP.fail()
    });
  },

  onLoad: function (options) {
    let p = this;

    wx.request({
      url: APP.globalData.localhost + "/noLogin/type/obtain",
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "JSessionId": wx.getStorageSync('JSessionId')
      },
      success(response) {
        if (response.data.success) {
          p.setData({types: response.data.data});
        } else {
          APP.showModal(response.data.msg);
        }
      },
      fail:() => APP.fail()
    });
  }
})