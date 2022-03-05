import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        current: 'all',
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
        listData: {}
    },

    clickNavbar: function (event) {
        var index = event.currentTarget.id;
        this.setData({
            current: index
        });
    },
    onLoad: async function () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        wx.showModal({
            title: '系统提示',
            content: res.userMsg,
            showCancel: false,
        })
    }
});