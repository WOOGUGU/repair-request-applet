import config from "./config";

export default (key) => {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: 'localUserInfo',
            success: function (res) {
                resolve(res.data.id)
            },
            fail: function (err) {
                reject(err);
                wx.navigateTo({
                    url: '/pages/login/login'
                });
            }
        });
    })
    // try {
    //     var value = wx.getStorageSync('key')
    //     if (value) {
    //         // Do something with return value
    //     }
    // } catch (e) {
    //     // Do something when catch error
    // }
}