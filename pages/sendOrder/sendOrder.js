import getStorage from "../../utils/getStorage";
import setStorage from "../../utils/setStorage";
import request from "../../utils/request";

Page({
    data: {
        userInfo: {
            id: '',
            username: '',
            name: '',
            status: ''
        },
        tel: '',
        tel_local: '',
        type: 'wire',
        posIndex: null,
        posSet: ['北十', '轻工楼', '大学生活动中心', '科技楼'],
        desIndex: null,
        desSet: ['故障1', '故障2', '故障3', '故障4', '其他（请填写补充说明）'],
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
        if (this.data.tel.length != 11) {
            wx.showModal({
                title: '系统提示',
                content: '请输入完整的联系方式',
                showCancel: false,
            });
            return;
        } else if (this.data.posIndex == null) {
            wx.showModal({
                title: '系统提示',
                content: '请选择故障位置',
                showCancel: false,
            });
            return;
        } else if (this.data.desIndex == null) {
            wx.showModal({
                title: '系统提示',
                content: '请选择故障描述',
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

        let username = this.data.userInfo.username;
        let sender = this.data.userInfo.name;
        let tel = this.data.tel;
        let type = this.data.type;
        let position = this.data.posSet[this.data.posIndex];
        let des = this.data.desSet[this.data.desIndex] + this.data.desPlus;
        let timeSubscribe = this.data.date + ' ' + this.data.timeSet[this.data.timeIndex];

        setStorage('tel', {
            id: this.data.userInfo.id,
            tel: tel
        });

        let res = await request('/addOrder', 'POST', {
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
            wx.switchTab({
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
                tel_local: tel_local.tel
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