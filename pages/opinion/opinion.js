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
        opinion:'',
        listData: {}
    },
    // 提交表单
    async submit() {
        wx.showModal({
            title: '系统提示',
            content: '提交成功！',
            showCancel: false,
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function (options) {
        // 权限验证
        let userInfo = getStorage('localUserInfo');
        // 验证失败跳转
        if (!userInfo) {
            // 记录跳转前页面位置
            wx.setStorage({
                key: 'location',
                data: {
                    id: 'mine'
                }
            });
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
        let res = await request('/selectAllOrderOfUser', 'POST',
            {
                token: userInfo.token,
            });
        console.log(res);
        if (res.status == "wrong_token") {
            // 记录跳转前页面位置
            wx.setStorage({
                key: 'location',
                data: {
                    id: 'mine'
                }
            });
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
            return;
        } else if (res.status == "handle_success") {
            this.setData({
                listData: res.data
            })
            console.log(this.data.listData);
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})