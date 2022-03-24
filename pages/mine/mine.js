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
        wx.clearStorage();
        this.setData({
                test: 0,
                name: ''
            }
        )
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