export default (key, data={}) => {
    wx.setStorage({
        key: key,
        data: data,
    })
}