import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
        current: 'all',
        listData: {}
    },

    // 发起工单
    sendOrder() {
        wx.navigateTo({
            url: '/pages/sendOrder/sendOrder'
        })
    },

    clickNavbar: function (event) {
        var index = event.currentTarget.id;
        this.setData({
            current: index
        });
    },

    onShow: async function (options) {
        // 权限验证
        let userInfo = getStorage('localUserInfo');
        let cookie = getStorage('cookie');
        // 验证失败跳转
        if (!userInfo || !cookie) {
            wx.showModal({
                title: '系统提示',
                content: '您还未登录，请先登录！',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/login'
                        });
                    } else if (res.cancel) {
                        wx.switchTab({
                            url: '/pages/index/index'
                        });
                    }
                }
            })
            return;
        }
        this.setData({
            userInfo
        });
        if (userInfo.authorities[0].authority == 'ROLE_repairman') {
            // 维修人员
            let res = await request('/v2/order/selectAllOrderOfRepairman', 'GET', {
                cookie: cookie
            }, {
                name: userInfo.name
            });
            res = res.data;
            if (res.code == '00000') {
                this.setData({
                    listData: res.data
                });
                console.log(this.data.listData);
            } else if (res.code == 'A0200') {
                wx.showModal({
                    title: '系统提示',
                    content: res.userMsg,
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/login/login'
                            });
                        } else if (res.cancel) {
                            wx.switchTab({
                                url: '/pages/index/index'
                            });
                        }
                    }
                });
            } else if (res.code == 'E0100') {
                wx.showModal({
                    title: '系统提示',
                    content: res.userMsg,
                    showCancel: false,
                });
            }
        } else if (userInfo.authorities[0].authority == 'ROLE_user') {
            // 普通用户
            let res = await request('/v2/order/selectAllOrderOfUser', 'GET', {
                cookie: cookie
            }, {
                username: userInfo.username
            });
            res = res.data;
            if (res.code == '00000') {
                this.setData({
                    listData: res.data
                });
                console.log(this.data.listData);
            } else if (res.code == 'A0200') {
                wx.showModal({
                    title: '系统提示',
                    content: res.userMsg,
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/login/login'
                            });
                        } else if (res.cancel) {
                            wx.switchTab({
                                url: '/pages/index/index'
                            });
                        }
                    }
                });
            } else if (res.code == 'E0100') {
                wx.showModal({
                    title: '系统提示',
                    content: res.userMsg,
                    showCancel: false,
                });
            }
        }
    }
});