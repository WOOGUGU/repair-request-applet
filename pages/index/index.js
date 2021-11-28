// pages/index/index.js
import request from "../../utils/request";
import getStorage from "../../utils/getStorage";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        multiArray: [['default1', 'default2'], ['default1', 'default2', 'default3']],
        multiIndex: [0, 0],
        pickerData: {}
    },

    bindMultiPickerChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        console.log(e.detail)
        this.setData({
            multiIndex: e.detail.value
        })
    },

    bindMultiPickerColumnChange: function (e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex,
            list: this.data.pickerData
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        switch (data.multiIndex[0]) {
            case 0:
                data.multiArray[1] = ['两栖动物', '鱼', '爬行动物'];
                break;
            case 1:
                data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
                break;
        }
        for (var i in data.list) {
            if (i == data.multiIndex[0]) {
                data.multiArray[1] = data.list[i].position;
                break;
            }
        }
        data.multiIndex[1] = 0;
        this.setData(data);
    },

    bindPickerChange(event) {
        console.log(event.detail);
    },

    bindPickerColumnChange(event) {
        console.log(event.detail);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let res = await request('/selectAllPickerLocationForUser', 'POST',
            {
                token: getStorage('localUserInfo').token
            });
        this.setData({
            pickerData: res.data
        })
        console.log(this.data.pickerData);

        this.data.multiArray[0].splice(0, this.data.multiArray[0].length);
        for (var i in this.data.pickerData) {
            this.data.multiArray[0].push(this.data.pickerData[i].name)
        }
        console.log(this.data.multiArray[0]);
        this.data.multiArray[1] = this.data.pickerData[0].position;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {

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