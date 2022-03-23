Page({
    data: {
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
        path: ''
    },
    onLoad: function (options) {
        let path = JSON.parse(options.path);
        this.setData({
            path
        })
    },
});