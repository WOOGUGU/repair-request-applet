import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
        status: ['审核不通过', '已取消', '待审核', '待处理', '已完成'],
        color: ['_two', '_one', 'zero', 'one', 'two'],
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