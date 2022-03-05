import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        opinion: '',
        name: '',
        tel: '',
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        }
    },

    // 表单数据发生改变
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        })
    },

    submit: async function () {
        if (this.data.opinion == null || this.data.opinion == '') {
            wx.showModal({
                title: '系统提示',
                content: '意见不能为空',
                showCancel: false,
            });
            return;
        }
        let pattern = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        if (this.data.tel != null && this.data.tel != '' && !pattern.test(this.data.tel)) {
            wx.showModal({
                title: '系统提示',
                content: '联系方式输入有误',
                showCancel: false,
            });
            return;
        }

        let uid = this.data.userInfo.id;
        let content = ((this.data.name != null && this.data.name != '') ? (this.data.name + '：') : 'Anonymous：') + this.data.opinion;
        let tel = (this.data.tel != null && this.data.tel != '') ? this.data.tel : '';

        let sendFeedbackRes = await request('/v2/feedback/addFeedback', 'POST', {
            cookie: this.data.cookie,
            'content-type': 'application/x-www-form-urlencoded'
        }, {
            uid,
            content,
            tel
        });
        if (sendFeedbackRes.data.code == '00000') {
            wx.showModal({
                title: '系统提示',
                content: sendFeedbackRes.data.userMsg,
                showCancel: false,
                success: function () {
                    wx.switchTab({
                        url: '/pages/mine/mine'
                    });
                }
            });
        } else if (sendFeedbackRes.data.code == 'A0200') {
            wx.showModal({
                title: '系统提示',
                content: sendFeedbackRes.data.userMsg,
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/login'
                        });
                    } else if (res.cancel) {
                        wx.switchTab({
                            url: '/pages/mine/mine'
                        });
                    }
                }
            });
        } else {
            wx.showModal({
                title: '系统提示',
                content: sendFeedbackRes.data.userMsg,
                showCancel: false,
            });
        }
    },

    onLoad: function () {

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
                        wx.navigateBack();
                    }
                }
            })
            return;
        }
        let res = await request('/v2/order/selectAllOrderOfUser', 'GET', {
            cookie: cookie
        }, {
            username: userInfo.username
        });
        res = res.data;
        if (res.code == '00000') {
            userInfo = getStorage('localUserInfo');
            cookie = getStorage('cookie');
            if (userInfo && cookie) {
                this.setData({
                    userInfo,
                    cookie
                });
            }
            return;
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
                            url: '/pages/mine/mine'
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
});