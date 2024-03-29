import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
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

    // changeScore: function (event) {
    //     // 星星点击事件
    //     let target_score = event.currentTarget.id;
    //     this.setData({
    //         score: target_score
    //     });
    // },

    previewMedia: function () {
        let files = JSON.parse(this.data.orderData.imgPath);
        if (files.length == 0) {
            wx.showToast({
                title: '当前工单没有图片',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        let sources = [];
        for (let file of files) {
            sources.push({
                url: file.url,
                type: file.type
            });
        }
        wx.previewMedia({
            sources
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

    // 普通用户-添加评价
    // addFeedback: function () {
    //     let cookie = getStorage('cookie');
    //     if (this.data.score == 0) {
    //         wx.showModal({
    //             title: '系统提示',
    //             content: '请选择评价星级',
    //             showCancel: false,
    //         });
    //         return;
    //     } else if (this.data.feedback == null || this.data.feedback == '') {
    //         wx.showModal({
    //             title: '系统提示',
    //             content: '请填写评价内容',
    //             showCancel: false,
    //         });
    //         return;
    //     }
    //
    //     let orderId = this.data.orderData.id;
    //     let stars = this.data.score;
    //     let feedback = this.data.feedback;
    //
    //     wx.showModal({
    //         title: '系统提示',
    //         content: '确定要继续吗？',
    //         success: async function (res) {
    //             if (res.confirm) {
    //                 wx.showLoading({
    //                     title: '加载中',
    //                     mask: true
    //                 });
    //                 let feedbackRes = await request('/v2/order/updateOrderFeedback', 'POST', {
    //                     cookie,
    //                     'content-type': 'application/x-www-form-urlencoded'
    //                 }, {
    //                     orderId,
    //                     stars,
    //                     feedback
    //                 });
    //                 wx.hideLoading();
    //                 if (feedbackRes.data.code == '00000') {
    //                     wx.showToast({
    //                         title: '评价成功',
    //                         icon: 'success',
    //                         duration: 1000
    //                     });
    //                     setTimeout(function () {
    //                         wx.reLaunch({
    //                             url: '/pages/order/order'
    //                         });
    //                     }, 1000);
    //                 } else {
    //                     wx.showToast({
    //                         title: '未知错误',
    //                         icon: 'error',
    //                         duration: 1000
    //                     });
    //                 }
    //             }
    //         }
    //     });
    // },

    // 维修员-填写反馈/完成工单
    finishOrder: function (event) {
        let cookie = getStorage('cookie');
        let orderId = this.data.orderData.id;
        let feedback = event.currentTarget.id == 'finish' ? this.data.orderData.feedback : this.data.feedback;
        let progress = event.currentTarget.id == 'finish' ? 2 : this.data.orderData.progress;
        wx.showModal({
            title: '系统提示',
            content: '确定要继续吗？',
            success: async function (res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    let finishRes = await request('/v2/order/finishOrder', 'POST', {
                        cookie,
                        'content-type': 'application/x-www-form-urlencoded'
                    }, {
                        orderId,
                        feedback,
                        progress
                    });
                    wx.hideLoading();
                    if (finishRes.data.code == '00000') {
                        wx.showToast({
                            title: '工单已更新',
                            icon: 'success',
                            duration: 1000
                        });
                        setTimeout(function () {
                            wx.reLaunch({
                                url: '/pages/order/order'
                            });
                        }, 1000);
                    } else {
                        wx.showToast({
                            title: '未知错误',
                            icon: 'error',
                            duration: 1000
                        });
                    }
                }
            }
        });
    }
})