// pages/index/index.js

import request from "../../utils/request";

Page({

    data: {
        slideData: {}
    },

    jump_1: function () {
        wx.navigateTo({url: '../instruction/instruction'})
    },

    jump_2: function () {
        wx.navigateTo({url: '../FAQ/FAQ'})
    },

    onLoad: async function (options) {
        let slideRes = await request('/v2/slide/selectAllSlide', 'GET');
        if (slideRes.data.code == '00000') {
            this.setData({
                slideData: slideRes.data.data
            });
            console.log(this.data.slideData);
        }
    },

    onShow: async function () {

    }
})