import config from "./config";

export default (url, method = 'GET', data = {}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            method,
            data,
            success: (res) => {
                console.log('响应:', res);
                resolve(res.data);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                // console.log('请求的data对象', data);
                console.log('请求的json字符串', JSON.stringify(data));
            }
        })
    })
}