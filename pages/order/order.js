import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
        current: 'all',
        listData: {},
        userInfo: null,
        loaded: false
    },

    // 发起工单
    sendOrder() {
        wx.navigateTo({
            url: '/pages/sendOrder/sendOrder'
        });
    },

    clickNavbar: function (event) {
        var index = event.currentTarget.id;
        this.setData({
            current: index
        });
    },

    onPullDownRefresh: async function () {
        if (!this.data.loaded) {
            return;
        }
        let userInfo = this.data.userInfo;
        let cookie = getStorage('cookie');
        wx.showLoading({
            title: '获取中',
            mask: true
        });
        let res;
        if (userInfo.authorities[0].authority == 'ROLE_repairman') {
            // 维修人员
            res = await request('/v2/order/selectAllOrderOfRepairman', 'GET', {
                cookie
            }, {
                username: userInfo.name + ' ' + userInfo.tel,
                pageSize: 2147483647
            });
        } else if (userInfo.authorities[0].authority == 'ROLE_user') {
            // 普通用户
            res = await request('/v2/order/selectAllOrderOfUser', 'GET', {
                cookie
            }, {
                username: userInfo.username,
                pageSize: 2147483647
            });
        }
        res = res.data;
        wx.hideLoading();
        if (res.code == '00000') {
            this.setData({
                listData: res.data.list,
                loaded: true
            });
            console.log(this.data.listData);
            wx.showToast({
                title: '获取成功',
                icon: 'success',
                duration: 1000
            });
        } else if (res.code == 'B0300') {
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
        } else {
            wx.showToast({
                title: '未知错误',
                icon: 'error',
                duration: 1000
            });
        }
        wx.stopPullDownRefresh();
    },

    onShow: async function () {
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
            });
            return;
        }
        this.setData({
            userInfo
        });
        if (this.data.loaded) {
            return;
        }
        wx.showLoading({
            title: '获取中',
            mask: true
        });
        let res;
        if (userInfo.authorities[0].authority == 'ROLE_repairman') {
            // 维修人员
            res = await request('/v2/order/selectAllOrderOfRepairman', 'GET', {
                cookie
            }, {
                username: userInfo.name + ' ' + userInfo.tel,
                pageSize: 2147483647
            });
        } else if (userInfo.authorities[0].authority == 'ROLE_user') {
            // 普通用户
            res = await request('/v2/order/selectAllOrderOfUser', 'GET', {
                cookie
            }, {
                username: userInfo.username,
                pageSize: 2147483647
            });
        }
        res = res.data;
        wx.hideLoading();
        if (res.code == '00000') {
            this.setData({
                listData: res.data.list,
                loaded: true
            });
            console.log(this.data.listData);
            wx.showToast({
                title: '获取成功',
                icon: 'success',
                duration: 1000
            });
        } else if (res.code == 'B0300') {
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
        } else {
            wx.showToast({
                title: '未知错误',
                icon: 'error',
                duration: 1000
            });
        }
    }
});