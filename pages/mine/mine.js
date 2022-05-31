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
        wx.showToast({
            title: '退出登录',
            icon: 'success',
            duration: 1000
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