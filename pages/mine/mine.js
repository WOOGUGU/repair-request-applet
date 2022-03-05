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

    toOpinion: async function () {
        wx.navigateTo({
            url: '/pages/opinion/opinion'
        });
    },

    toAbout: function () {
        wx.navigateTo({
            url: '/pages/about/about'
        })
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