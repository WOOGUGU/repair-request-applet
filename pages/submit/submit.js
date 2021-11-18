import getStorage from "../../utils/getStorage";
import setStorage from "../../utils/setStorage";

Page({
    data: {},

    onLoad: function () {

    },

    onShow: function (options) {
        // 权限验证
        var verify = getStorage('localUserInfo');
        // 验证失败跳转
        if (!verify) {
            // 记录跳转前页面位置
            setStorage('location',
                {
                    id: 'submit'
                }
            );
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