import getStorage from "../../utils/getStorage";

Page({
    data: {
        username: '',
        isLogin: false
    },

    toLogin: function () {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },

    toOpinion: function () {
        wx.navigateTo({
            url: '/pages/opinion/opinion'
        });
    },

    toAbout: function () {
        wx.navigateTo({
            url: '/pages/about/about'
        });
    },

    toExit: function () {
        let userInfo = getStorage('localUserInfo');
        if (!userInfo) {
            return;
        }
        wx.clearStorage();
        this.setData({
            username: '',
            isLogin: false
        });
        wx.showModal({
            title: '系统通知',
            content: '已退出登录',
            showCancel: false
        });
    },

    onShow: function () {
        let userInfo = getStorage('localUserInfo');
        if (userInfo) {
            this.setData({
                username: userInfo.username,
                isLogin: true
            });
        }
    }

})