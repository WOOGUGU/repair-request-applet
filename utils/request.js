import config from "./config";

export default (url, method = 'GET', data = {}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            method,
            data,
            success: (res) => {
                console.log(data);
                console.log(res);
                resolve(res.data);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}