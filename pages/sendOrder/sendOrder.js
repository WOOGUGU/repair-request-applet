import getStorage from "../../utils/getStorage";
import setStorage from "../../utils/setStorage";
import request from "../../utils/request";

Page({
    data: {
        userInfo: {
            id: '',
            username: '',
            name: '',
            status: '',
            token: ''
        },
        tel: '',
        tel_local: '',
        type: 'wire',
        posIndex: null,
        posSet: ['北十', '轻工楼', '大学生活动中心', '科技楼'],
        desIndex: null,
        desSet: ['故障1', '故障2', '故障3', '故障4', '其他'],
        desPlus: '',
        date: null,
        timeIndex: null,
        timeSet: [
            '9:00-9:30', '9:30-10:00',
            '10:00-10:30', '10:30-11:00',
            '11:00-11:30', '14:30-15:00',
            '15:00-15:30', '15:30-16:00',
            '16:00-16:30', '16:30-17:00'
        ]
    },

    // 表单数据发生改变
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        })
    },

    submit: async function () {
        var pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        if (!pattern.test(this.data.tel)) {
            wx.showModal({
                title: '系统提示',
                content: '请输入正确的联系方式',
                showCancel: false,
            });
            return;
        } else if (this.data.posIndex == null) {
            wx.showModal({
                title: '系统提示',
                content: '请选择报修位置',
                showCancel: false,
            });
            return;
        } else if (this.data.desIndex == null || (this.data.desIndex == null && (this.data.desPlus == '' || this.data.desPlus == null))) {
            wx.showModal({
                title: '系统提示',
                content: '请选择/填写故障描述',
                showCancel: false,
            });
            return;
        } else if (this.data.date == null) {
            wx.showModal({
                title: '系统提示',
                content: '请选择日期',
                showCancel: false,
            });
            return;
        } else if (this.data.timeIndex == null) {
            wx.showModal({
                title: '系统提示',
                content: '请选择时间',
                showCancel: false,
            });
            return;
        }

        let token = this.data.userInfo.token;
        let username = this.data.userInfo.username;
        let sender = this.data.userInfo.name;
        let tel = this.data.tel;
        let type = this.data.type;
        let position = this.data.posSet[this.data.posIndex];
        let des = (this.data.desSet[this.data.desIndex] == '其他' ? '' : this.data.desSet[this.data.desIndex]) + this.data.desPlus;
        let timeSubscribe = this.data.date + ' ' + this.data.timeSet[this.data.timeIndex];

        setStorage('tel', {
            id: this.data.userInfo.id,
            tel: tel
        });

        let res = await request('/addOrder', 'POST', {
            token,
            username,
            sender,
            tel,
            type,
            position,
            des,
            timeSubscribe,
        });
        // console.log(res);
        if (res.status == 'handle_success') {
            wx.reLaunch({
                url: '/pages/order/order'
            });
        } else {
            wx.showModal({
                title: '系统提示',
                content: '发生未知错误，请重试',
                showCancel: false,
            });
        }
    },

    onShow: function () {
        let tel_local = getStorage('tel');
        console.log(tel_local);
        if (tel_local) {
            this.setData({
                tel_local: tel_local.tel,
                tel: tel_local.tel
            })
        }
    },

    onLoad: function (options) {
        let userInfo = getStorage('localUserInfo');
        if (userInfo) {
            this.setData({
                userInfo
            });
        }
    }
});