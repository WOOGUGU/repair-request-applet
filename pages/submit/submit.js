import getStorage from "../../utils/getStorage";

Page({
    data: {},
    onLoad: function () {

    },
    onShow: async function (options) {
        let verify = await getStorage();
        console.log(verify);
        if (verify.localUserInfo.id== '') {
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
                            url: '/pages/index/index',
                        });
                    }
                }
            })
        }
    }
});