import getStorage from "../../utils/getStorage";

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

    toOpinion: function () {
        wx.navigateTo({
            url: '/pages/opinion/opinion'
        });
    },

    toAbout: function () {
        wx.navigateTo({
            url: '/pages/about/about'
        })
    },

    toExit: function () {
        let userInfo = getStorage('localUserInfo');
        if (!userInfo) {
            return;
        }
        wx.clearStorage();
        this.setData({
                test: 0,
                name: ''
            }
        )
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
                    test: 1,
                    name: userInfo.username
                }
            )
        } else {
            this.setData({
                    test: 0,
                name: ''
                }
            )
        }
    }

})