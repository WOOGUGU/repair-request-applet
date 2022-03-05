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
        feedback: ''
    },

    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        })
    },

    onLoad: async function (options) {
        let data = JSON.parse(options.order);
        this.setData({
            orderData: data
        })
    },

    addFeedback: async function () {
        let cookie = getStorage('cookie');
        let orderId = this.data.orderData.id;
        let feedback = this.data.feedback;
        let feedbackRes = await request('/v2/order/updateOrderFeedback', 'POST', {
            cookie,
            'content-type': 'application/x-www-form-urlencoded'
        }, {
            orderId,
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
                        })
                    }
                }
            })
        } else {
            wx.showModal({
                title: '系统提示',
                content: '出现错误',
                showCancel: false
            })
        }
    }
});