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
        let data = this.data.orderData;
        let token = getStorage('localUserInfo').token;
        let res = await request('/updateOrder', 'POST',
            {
                token,
                id: data.id,
                username: data.username,
                sender: data.sender,
                tel: data.tel,
                type: data.type,
                des: data.des,
                position: data.position,
                timeSubscribe: data.timeSubscribe,
                progress: data.progress,
                solver: data.solver,
                timeStart: data.timeStart,
                timeDistribution: data.timeDistribution,
                timeEnd: data.timeEnd,
                feedback: this.data.feedback
            });
        if (res.status == "handle_success") {
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
        } else if (res.status == "wrong_token") {
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
        } else if (res.status == "data_not_exist") {
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
    }
});