import request from "../../utils/request";
import getStorage from "../../utils/getStorage";
import {hexMD5} from "../../utils/md5";

Page({
    data: {
        username: '',
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
        password: ''
    },

    onLoad: function (options) {

    },

    // 表单数据发生改变
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        })
    },

    // 提交表单
    async submit() {
        let uname = this.data.username;
        let passwd = this.data.password;

        if (uname == '') {
            wx.showModal({
                title: '系统提示',
                content: '请输入学号/工号',
                showCancel: false,
            });
            return;
        } else if (passwd == '') {
            wx.showModal({
                title: '系统提示',
                content: '请输入密码',
                showCancel: false,
            });
            return;
        }
        passwd = hexMD5(passwd).toUpperCase();
        let res = await request('/doLogin', 'POST', {}, {
            uname,
            passwd
        });
        console.log(res);
        if (res.data.code == '00000') {
            wx.setStorage({
                key: 'localUserInfo',
                data: res.data.data
            })
            let location = getStorage('location') ? getStorage('location') : 'index';
            wx.switchTab({
                url: '/pages/' + location.id + '/' + location.id
            });
        } else if (res.data.code == 'F0001') {
            wx.showModal({
                title: '系统提示',
                content: res.data.userMsg,
                showCancel: false,
            });
        } else if (res.data.code == 'A0201') {
            wx.showModal({
                title: '系统提示',
                content: '学号/工号不存在，请更正后重试',
                showCancel: false,
            });
        } else if (res.data.code == 'A0202') {
            wx.showModal({
                title: '系统提示',
                content: '发生未知错误，请重试',
                showCancel: false,
            });
        }
    }

});