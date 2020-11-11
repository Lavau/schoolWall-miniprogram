// pages/index/index.js
const APP = getApp();

Page({
    data: {
        list: null,
        pageNum: null,
        pages: null,
        type: null,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hidden: true
    },

    /**
     * 初始或关闭页面模态框
     */
    isShowTypeModal() {
        this.setData({
            hidden: !this.data.hidden
        })
    },

    /**
     * 前往具体的页面
     */
    goToListEcardPage: () => wx.navigateTo({
        url: '../listEcard/listEcard'
    }),
    goToListOthersPage: (e) => wx.navigateTo({
        url: '../listOthers/listOthers?typeId=' + e.currentTarget.dataset.typeid
    }),
    goToDetailEcardPage(e) {
        if (this.verifyIsLogin() == false) return;
        wx.navigateTo({
            url: '../detailEcard/detailEcard?id=' + e.currentTarget.dataset.id
        });
    },
    goToDetailOthersPage(e) {
        if (this.verifyIsLogin() == false) return;
        wx.navigateTo({
            url: '../detailOthers/detailOthers?id=' + e.currentTarget.dataset.id +
                '&typeId=' + e.currentTarget.dataset.typeid
        });
    },

    /**
     * 页面加载时，获取首页显示的信息
     */
    onLoad() {
        let p = this;
        wx.request({
            url: APP.globalData.localhost + "/index",
            success: (res) => {
                p.setData({
                    list: res.data['list'],
                    pageNum: res.data['pageNum'],
                    pages: res.data['pages']
                });
            },
            fail:() => APP.fail()
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        let p = this;
        wx.request({
            url: APP.globalData.localhost + "/index",
            success: (res) => {
                p.setData({
                    list: res.data['list'],
                    pageNum: res.data['pageNum'],
                    pages: res.data['pages']
                });
            },
            fail:() => APP.fail()
        });
    },

    /**
     * 验证当前用户是否登录
     */
    verifyIsLogin() {
        if (APP.globalData.login == false) {
            wx.showModal({
                content: "请先登录",
                showCancel: false
            });
        }
        return APP.globalData.login;
    },

    /**
     * 监听页面滚动到顶部,触发加载事件
     */
    onReachBottom() {
        if (this.data.pageNum == this.data.pages) {
            wx.showModal({
                content: '暂无最新数据',
                showCancel: false
            });
            return;
        }

        let p = this;
        wx.showLoading({
            title: '数据加载中',
        });
        wx.request({
            url: APP.globalData.localhost + "/index",
            method: 'GET',
            data: {
                pageNum: p.data.pageNum + 1
            },
            success: (res) => {
                wx.hideLoading({});
                let listCopy = p.data.list;
                res.data['list'].forEach(e => {
                    listCopy.push(e);
                });
                p.setData({
                    list: listCopy,
                    pageNum: res.data['pageNum'],
                    pages: res.data['pages']
                });
            },
            fail:() => APP.fail()
        });
    },
})