import request from "../../utils/request";
import setStorage from "../../utils/setStorage";
import getStorage from "../../utils/getStorage";
import {hexMD5} from "../../utils/md5";

Page({
    data: {
        username: '',
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
        let username = this.data.username;
        let password = this.data.password;

        if (username == '') {
            wx.showModal({
                title: '系统提示',
                content: '请输入学号/工号',
                showCancel: false,
            });
            return;
        } else if (password == '') {
            wx.showModal({
                title: '系统提示',
                content: '请输入密码',
                showCancel: false,
            });
            return;
        }
        ;

        let res = await request('/handleLogin', 'POST', {
            username: username,
            password: hexMD5(password)
        });
        if (res.status == "user") {
            setStorage('localUserInfo',
                {
                    id: res.data.id,
                    username: res.data.username,
                    name: res.data.name,
                    status: res.status
                });
            let location = getStorage('location');
            wx.switchTab({
                url: '/pages/' + location.id + '/' + location.id
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

});