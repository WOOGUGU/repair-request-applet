import getStorage from "../../utils/getStorage";
import setStorage from "../../utils/setStorage";
import request from "../../utils/request";

Page({
    data: {
        current: 'all',
        status: ['审核不通过', '已取消', '待审核', '待处理', '已处理'],
        listData: {}
    },

    // 发起工单
    sendOrder() {
        wx.navigateTo({
            url: '/pages/sendOrder/sendOrder'
        })
    },

    clickNavbar: function (event) {
        var index = event.currentTarget.id;
        this.setData({
            current: index
        });
    },

    onLoad: async function () {

    },

    onShow: async function (options) {
        // 权限验证
        let userInfo = getStorage('localUserInfo');
        // 验证失败跳转
        if (!userInfo) {
            // 记录跳转前页面位置
            setStorage('location',
                {
                    id: 'order'
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
            return;
        }
        let res = await request('/selectAllOrderOfUser', 'POST',
            {
                token: userInfo.token,
            });
        console.log(res);
        this.setData({
            listData: res.data
        })
        console.log(this.data.listData);
    }
});