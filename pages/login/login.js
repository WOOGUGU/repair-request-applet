import {hexMD5} from "../../utils/md5";
import response from "../../utils/request";
import request from "../../utils/request";

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
        let loginRes = await request('/doLogin', 'POST', {}, {
            uname,
            passwd
        });
        if (loginRes.data.code == '00000') {
            wx.setStorage({
                key: 'cookie',
                data: loginRes.cookies[0]
            });
            wx.setStorage({
                key: 'localUserInfo',
                data: loginRes.data.data
            });
            wx.navigateBack();
        } else if (loginRes.data.code == 'A0201') {
            wx.showModal({
                title: '系统提示',
                content: loginRes.data.userMsg,
                showCancel: false,
            });
        } else if (loginRes.data.code == 'A0202') {
            wx.showModal({
                title: '系统提示',
                content: loginRes.data.userMsg,
                showCancel: false,
            });
        } else {
            wx.showModal({
                title: '系统提示',
                content: loginRes.data.userMsg,
                showCancel: false,
            });
        }
    }

});