import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
        userInfo: {},
        cookie: '',
        opinion: '',
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

    submit: function () {
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

        let cookie = this.data.cookie;
        let uid = this.data.userInfo.id;
        let content = this.data.opinion;
        let tel = (this.data.tel != null && this.data.tel != '') ? this.data.tel : '';
        wx.showModal({
            title: '系统提示',
            content: '确定要提交吗？',
            success: async function (res) {
                if (res.confirm) {
                    let sendFeedbackRes = await request('/v2/feedback/addFeedback', 'POST', {
                        cookie,
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
                    } else if (sendFeedbackRes.data.code == 'B0300') {
                        // cookie失效
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
                }
            }
        });
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
        let res = await request('/v2/inner/isExpired', 'GET', {
            cookie: cookie
        });
        res = res.data;
        if (res.code == 'B0100') {
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
            return;
        }
        this.setData({
            userInfo,
            cookie,
        });
    }
});