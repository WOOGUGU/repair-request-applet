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
        let that = this;
        wx.showModal({
            title: '系统提示',
            content: '确定要退出登录吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.clearStorage();
                    that.setData({
                        username: '',
                        isLogin: false
                    });
                    wx.showToast({
                        title: '退出登录',
                        icon: 'success',
                        duration: 1000
                    });
                    setTimeout(function () {
                        wx.reLaunch({
                            url: '/pages/mine/mine'
                        });
                    }, 1000);
                }
            }
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