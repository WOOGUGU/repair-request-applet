import request from "../../utils/request";
import getStorage from "../../utils/getStorage";

Component({
    properties: {
        orderData: {
            type: Object,
            value: {}
        }
    },

    data: {
        status: ['审核不通过', '已取消', '待审核', '待处理', '已完成'],
        color: ['_two', '_one', 'zero', 'one', 'two']
    },

    methods: {
        cancelOrder: async function () {
            let cookie = getStorage('cookie');
            let data = this.data.orderData;
            let token = getStorage('localUserInfo').token;
            let cancelRes = await request('/v2/order/updateOrder', 'POST', {
                cookie,
                'content-type': 'application/x-www-form-urlencoded'
            }, {
                orderId: data.id,
                username: data.username,
                sender: data.sender,
                tel: data.tel,
                type: data.type,
                des: data.des,
                position: data.position,
                timeSubscribe: data.timeSubscribe,
                progress: -1,
                solver: data.solver,
                timeStart: data.timeStart,
                timeDistribution: data.timeDistribution,
                timeEnd: data.timeEnd,
                feedback: data.feedback
            });
            let cancelData = cancelRes.data;
            if (cancelData.code == '') {
                wx.showModal({
                    title: '系统提示',
                    content: '取消成功',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.reLaunch({
                                url: '/pages/order/order'
                            })
                        }
                    }
                })
            } else if (cancelData.status == "wrong_token") {
                wx.showModal({
                    title: '系统提示',
                    content: '身份验证出现问题，请重新登录后重试',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.reLaunch({
                                url: '/pages/order/order'
                            })
                        }
                    }
                })
            } else if (cancelData.status == "data_not_exist") {
                wx.showModal({
                    title: '系统提示',
                    content: '当前工单不存在！',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.reLaunch({
                                url: '/pages/order/order'
                            })
                        }
                    }
                })
            }
        },

        more: function () {
            let data = this.data.orderData;
            wx.navigateTo({
                url: '/pages/singleOrder/singleOrder?order=' + JSON.stringify(data),
            })
        }
    }

});
