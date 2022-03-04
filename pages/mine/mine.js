import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
        name: "n",
        test: 0,
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
    },

    toLogin: function () {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },

    toOpinion: async function (options) {
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
        let res = await request('/v2/order/selectAllOrderOfUser', 'GET', {
            cookie: cookie
        }, {
            username: userInfo.username
        });
        res = res.data;
        if (res.code == '00000') {
            wx.navigateTo({
                url: '/pages/opinion/opinion'
            });
        } else if (res.code == 'A0200') {
            wx.showModal({
                title: '系统提示',
                content: res.userMsg,
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/login'
                        });
                    } else if (res.cancel) {
                        wx.navigateBack();
                    }
                }
            });
        } else if (res.code == 'E0100') {
            wx.showModal({
                title: '系统提示',
                content: res.userMsg,
                showCancel: false,
            });
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let userInfo = getStorage('localUserInfo');
        if (userInfo) {
            this.setData({
                    test: 1,
                    name: userInfo.username
                }
            )
        } else {
            this.setData({
                    test: 0,
                    name: "n"
                }
            )
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