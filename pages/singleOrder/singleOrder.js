import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
        status: ['待审核', '待处理', '已完成', '已取消', '审核不通过'],
        color: ['zero', 'one', 'two', 'three', 'four'],
        per: [5, 55, 100, 0, 100],
        progress_color: ['#FFA500', '#1E90FF', '#2E8B57', '#656565', '#FF5D5D'],
        orderData: {},
        score: 0,
        feedback: '',
        userInfo: {}
    },

    // 表单数据发生改变
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        });
    },

    changeScore: function (event) {
        // 星星点击事件
        let target_score = event.currentTarget.id;
        this.setData({
            score: target_score
        });
    },

    onLoad: function (options) {
        // 从url获取order对象
        let data = JSON.parse(options.order);
        this.setData({
            orderData: data
        });
    },

    onShow: function () {
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
    },

    // 普通用户-添加反馈
    addFeedback: function () {
        let cookie = getStorage('cookie');
        if (this.data.score == 0) {
            wx.showModal({
                title: '系统提示',
                content: '请选择评价星级',
                showCancel: false,
            });
            return;
        } else if (this.data.feedback == null || this.data.feedback == '') {
            wx.showModal({
                title: '系统提示',
                content: '请填写评价内容',
                showCancel: false,
            });
            return;
        }

        let orderId = this.data.orderData.id;
        let stars = this.data.score;
        let feedback = this.data.feedback;

        wx.showModal({
            title: '系统提示',
            content: '确定要继续吗？',
            success: async function (res) {
                if (res.confirm) {
                    let feedbackRes = await request('/v2/order/updateOrderFeedback', 'POST', {
                        cookie,
                        'content-type': 'application/x-www-form-urlencoded'
                    }, {
                        orderId,
                        stars,
                        feedback
                    });
                    if (feedbackRes.data.code == '00000') {
                        wx.showModal({
                            title: '系统提示',
                            content: '评价成功',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.reLaunch({
                                        url: '/pages/order/order'
                                    });
                                }
                            }
                        });
                    } else {
                        wx.showModal({
                            title: '系统提示',
                            content: '出现错误',
                            showCancel: false
                        });
                    }
                }
            }
        });
    },

    // 维修员-完成工单
    finishOrder: function () {
        let cookie = getStorage('cookie');
        let orderId = this.data.orderData.id;
        wx.showModal({
            title: '系统提示',
            content: '确定要继续吗？',
            success: async function (res) {
                if (res.confirm) {
                    let finishRes = await request('/v2/order/finishOrder', 'POST', {
                        cookie,
                        'content-type': 'application/x-www-form-urlencoded'
                    }, {
                        orderId,
                    });
                    if (finishRes.data.code == '00000') {
                        wx.showModal({
                            title: '系统提示',
                            content: '工单状态已更新',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.reLaunch({
                                        url: '/pages/order/order'
                                    });
                                }
                            }
                        });
                    } else {
                        wx.showModal({
                            title: '系统提示',
                            content: '出现错误',
                            showCancel: false
                        });
                    }
                }
            }
        });
    }
})