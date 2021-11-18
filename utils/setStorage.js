export default (id, username, realName) => {
    wx.setStorage({
        key: "localUserInfo",
        data: {
            id,
            username,
            realName
        },
    })
}