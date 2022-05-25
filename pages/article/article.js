Page({
    data: {
        path: ''
    },

    onLoad: function (options) {
        // 从url里取path值
        let path = JSON.parse(options.path);
        this.setData({
            path
        })
    },

});