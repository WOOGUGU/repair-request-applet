Page({
    data: {},
    onLoad: function (options) {
        var indexPage = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('loginSuccess', function (data) {
            console.log(data)
            indexPage.setData({
                userInfo: data.userInfo,
            })
        });
    }
});