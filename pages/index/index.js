// pages/index/index.js
const APP = getApp();

Page({
    data: {
        tipText: '数据加载中',
        list: [],
        pageNum: 0,
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
    goToListEcardPage() {
        wx.navigateTo({
        url: '../listEcard/listEcard'
    })},
    goToListOthersPage: (e) => wx.navigateTo({
        url: '../listOthers/listOthers?typeId=' + e.currentTarget.dataset.typeid
    }),
    goToDetailPage(e) {
        if (APP.globalData.login == false) {
            wx.showModal({
                content: "请先登录",
                showCancel: false,
                success() {
                    wx.showLoading({title: '处理中'});
                    wx.login({
                        success(res) {
                            if (res.code) {
                                APP.login(res.code);
                                wx.hideLoading();
                            }
                        },
                        fail: () => wx.showToast({title: "获取 code 失败"}),
                    });
                }
            });
        } else {
            wx.navigateTo({url: '../detail/detail?id=' + e.currentTarget.dataset.id});
        }
    },

    /**
     * 页面加载时，获取首页显示的信息
     */
    onLoad() {
        let p = this;
        wx.request({
            url: APP.globalData.localhost + "/noLogin/publishedInfo/list",
            success: (res) => {
                console.log(res.data['data']['list'].length);
                if (res.data['data']['list'].length === 0) {
                    p.setData({tipText: "暂无数据"});
                } else {
                    p.setData({
                        list: res.data['data']['list'],
                        pageNum: res.data['data']['pageNum'],
                        pages: res.data['data']['pages']
                    });
                }
                
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
            url: APP.globalData.localhost + "/noLogin/publishedInfo/list",
            success: (res) => {
                p.setData({
                    list: res.data['data']['list'],
                    pageNum: res.data['data']['pageNum'],
                    pages: res.data['data']['pages']
                });
            },
            fail:() => APP.fail()
        });
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
            url: APP.globalData.localhost + "/noLogin/publishedInfo/list",
            method: 'GET',
            data: {
                pageNum: p.data.pageNum + 1
            },
            success: (res) => {
                wx.hideLoading({});
                let listCopy = p.data.list;
                res.data['data']['list'].forEach(e => {
                    listCopy.push(e);
                });
                p.setData({
                    list: listCopy,
                    pageNum: res.data['data']['pageNum'],
                    pages: res.data['data']['pages']
                });
            },
            fail:() => APP.fail()
        });
    },
})