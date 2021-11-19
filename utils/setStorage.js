export default (key, data={}) => {
    wx.setStorage({
        key,
        data
    })
}