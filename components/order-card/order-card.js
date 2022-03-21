import request from "../../utils/request";
import getStorage from "../../utils/getStorage";

Component({
    properties: {
        orderData: {
            type: Object,
            value: {}
        },
        withCancelBtn: {
            type: Boolean,
            value: true
        }
    },

    data: {
        status: ['待审核', '待处理', '已完成', '已取消', '审核不通过'],
        color: ['zero', 'one', 'two', 'three', 'four'],
    },

    methods: {
        cancelOrder: function () {
            let cookie = getStorage('cookie');
            let orderId = this.data.orderData.id;
            let username = this.data.orderData.username;
            wx.showModal({
                title: '系统提示',
                content: '确定要取消吗？',
                success: async function (res) {
                    if (res.confirm) {
                        let cancelRes = await request('/v2/order/cancelOrder', 'POST', {
                            cookie,
                            'content-type': 'application/x-www-form-urlencoded'
                        }, {
                            orderId,
                            username
                        });
                        let cancelData = cancelRes.data;
                        if (cancelData.code == '00000') {
                            wx.showModal({
                                title: '系统提示',
                                content: '取消成功',
                                showCancel: false,
                                success: function (res) {
                                    wx.reLaunch({
                                        url: '/pages/order/order'
                                    })
                                }
                            });
                        } else {
                            wx.showModal({
                                title: '系统提示',
                                content: cancelData.userMsg,
                                showCancel: false
                            });
                        }
                    }
                }
            });
        },

        more: function () {
            let data = this.data.orderData;
            wx.navigateTo({
                url: '/pages/singleOrder/singleOrder?order=' + JSON.stringify(data),
            })
        }
    }

});
