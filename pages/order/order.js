import getStorage from "../../utils/getStorage";
import setStorage from "../../utils/setStorage";
import request from "../../utils/request";

Page({
    // data: {},
    //
    // onLoad: function () {
    //
    // },

    data: {
        current: 0
    },

    onClick: function (event) {
        var index = event.currentTarget.dataset.id;
        this.setData({
            current: index
        })
    },

    onLoad: async function () {
        // let res = await request('/oes/member/list/all', 'POST');
        // console.log(res);
    },

    // onShow: function (options) {
    //     // 权限验证
    //     var verify = getStorage('localUserInfo');
    //     // 验证失败跳转
    //     if (!verify) {
    //         // 记录跳转前页面位置
    //         setStorage('location',
    //             {
    //                 id: 'order'
    //             }
    //         );
    //         wx.showModal({
    //             title: '系统提示',
    //             content: '您还未登录，请先登录！',
    //             success: function (res) {
    //                 if (res.confirm) {
    //                     wx.navigateTo({
    //                         url: '/pages/login/login'
    //                     });
    //                 } else if (res.cancel) {
    //                     wx.switchTab({
    //                         url: '/pages/index/index',
    //                     });
    //                 }
    //             }
    //         })
    //     }
    // }
});