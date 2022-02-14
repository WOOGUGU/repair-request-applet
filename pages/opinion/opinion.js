// pages/opinion/opinion.js

import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        tel: '',
        opinion: '',
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
        listData: {}

    },

    onLoad: async function () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        // 权限验证
        let userInfo = getStorage('localUserInfo');
        // 验证失败跳转
        if (!userInfo) {
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
                            url: '/pages/mine/mine',
                        });
                    }
                }
            })
            return;
        }
        let res = await request('/opinion', 'POST',
            {
                token: userInfo.token,
            });
        console.log(res);
        if (res.status == "wrong_token") {
            wx.showModal({
                title: '系统提示',
                content: '您的登录状态已过期，请重新登录！',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/login'
                        });
                    } else if (res.cancel) {
                        wx.switchTab({
                            url: '/pages/mine/mine',
                        });
                    }
                }
            })
        } else if (res.status == "handle_success") {
            this.setData({
                listData: res.data
            })
            console.log(this.data.listData);
        }
    }
});