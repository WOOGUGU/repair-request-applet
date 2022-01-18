export default (key) => {
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