import request from "../../utils/request";
import setStorage from "../../utils/setStorage";
import {hexMD5} from "../../utils/md5";
const md5 = require("../../utils/md5");

Page({
    data: {
        username: '',
        password: ''
    },

    onLoad: function (options) {

    },

    // 表单数据发生改变 start
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        })
    },
    // 表单数据发生改变 end

    // 提交表单 start
    async submit() {
        let username = this.data.username;
        let password = md5.hexMD5(this.data.password);
        let res = await request('/handleLogin', 'POST', {
            username: username,
            password: password
        });
        console.log(res);
        if (res.status == "login_success") {
            setStorage(res.data.id, username, res.data.name);
            wx.switchTab({
                url: '/pages/submit/submit',
            });
        } else if (res.status == "wrong_password") {
            wx.showModal({
                title: '系统提示',
                content: '密码错误，请更正后重试',
                showCancel: false,
            });
        } else if (res.status == "wrong_user") {
            wx.showModal({
                title: '系统提示',
                content: '学号/工号不存在，请更正后重试',
                showCancel: false,
            });
        } else {
            wx.showModal({
                title: '系统提示',
                content: '发生未知错误，请重试',
                showCancel: false,
            });
        }
    }
    // 提交表单 end

});