import config from "./config";

export default (url, method, header = {'content-type': 'application/json'}, data = {}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            method,
            header,
            data,
            success: (res) => {
                console.log('响应', res);
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                console.log('请求的data', data);
                // console.log('请求的json字符串', JSON.stringify(data));
            }
        })
    })
}