import getStorage from "../../utils/getStorage";

Page({
    data: {},

    onLoad: function (options) {

    },

    onShow: function (options) {
        // 权限验证
        let userInfo = getStorage('localUserInfo');
        // 验证失败跳转
        if (!userInfo) {
            // 记录跳转前页面位置
            wx.setStorage({
                key: 'location',
                data: {
                    id: 'mine',
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
                            url: '/pages/index/index',
                        });
                    }
                }
            })
            return;
        }
    }
});