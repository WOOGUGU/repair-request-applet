var app = getApp()
Page({
    data: {
        navbar: ['全部', '待审核', '待处理','已完成','已取消'],
        currentTab: 0
    },
    navbarTap: function(e){
        this.setData({
            currentTab: e.currentTarget.dataset.idx
        })
    }
})