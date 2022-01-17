import getStorage from "../../utils/getStorage";
Page({
    data: {
        menuitems: [
            { text: '意见反馈', url: '../opinion/opinion', icon: '/static/icon/pen.png', tips: '', arrows: '/static/icon/arrows.png' },
            { text: '关于我们', url: '../about/about', icon: '/static/icon/info.png', tips: '', arrows: '/static/icon/arrows.png' }
        ],
        name : "n",
        test : 0,
    },

    toLogin: function () {
        wx.setStorage({
            key: 'location',
            data: {
                id: 'mine'
            }
        }),
        wx.navigateTo({url:'../login/login'})
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (){

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (){
        let userInfo = getStorage('localUserInfo');
        if (userInfo) {
            this.setData({
                    test:1,
                    name:userInfo.username
                }
            )
        }else{
            this.setData({
                    test:0,
                    name:"n"
                }
            )
        };
    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})