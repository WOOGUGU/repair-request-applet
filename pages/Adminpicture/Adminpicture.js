var app = getApp()
Page({
    data: {
        navbar: ['轮播图', '公告', '使用指南','常见问题','我的头像'],
        currentTab: 0
    },
    navbarTap: function(e){
        this.setData({
            currentTab: e.currentTarget.dataset.idx
        })
    },
    onLoad: function (options) {

    }
});