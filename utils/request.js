import config from "./config";

export default (url, method, header = {'content-type': 'application/json'}, data = {}) => {
    return new Promise((resolve, reject) => {
        // console.log('header', typeof header == 'object' ? JSON.stringify(header) : header);
        console.log('request-body', typeof data == 'object' ? JSON.stringify(data) : data);
        wx.request({
            url: (url[0] == '/' ? config.host : '') + url,
            method,
            header,
            data,
            success: (res) => {
                console.log(url, res);
                // console.log('res.data', res.data);
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
        })
    })
}