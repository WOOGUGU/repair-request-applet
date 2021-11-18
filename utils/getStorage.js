export default (key) => {
    // wx.getStorage({
    //     key: 'localUserInfo',
    //     success: function (res) {
    //         console.log(res.data.id)
    //     },
    //     fail: function (err) {
    //         console.log(err);
    //         wx.navigateTo({
    //             url: '/pages/login/login'
    //         });
    //     }
    // });
    try {
        var value = wx.getStorageSync(key);
        if (value) {
            if (value.id != '') {
                return value;
            } else {
                return false;
            }
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}