App({
    globalData: {
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
    },

    onLaunch: function () {
        this.globalData = {} // 务必确保这一行在前面
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom * 0.65;
                this.globalData.CustomBar = Math.floor((custom.bottom + custom.top - e.statusBarHeight) * 0.65);
            }
        });
    }

})