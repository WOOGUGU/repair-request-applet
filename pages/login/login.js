import {hexMD5} from "../../utils/md5";
import request from "../../utils/request";

Page({
    data: {
        username: '',
        password: ''
    },

    // 表单数据发生改变
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        });
    },

    // 提交表单
    submit: async function () {
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
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        passwd = hexMD5(passwd).toUpperCase();
        let loginRes = await request('/doLogin', 'POST', {}, {
            uname,
            passwd
        });
        wx.hideLoading();
        if (loginRes.data.code == '00000') {
            // 登录成功【存储cookie、userInfo】
            wx.setStorage({
                key: 'cookie',
                data: loginRes.cookies[0]
            });
            wx.setStorage({
                key: 'localUserInfo',
                data: loginRes.data.data
            });
            wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1000
            });
            setTimeout(function () {
                wx.navigateBack();
            }, 1000);
        } else {
            wx.showModal({
                title: '系统提示',
                content: loginRes.data.userMsg,
                showCancel: false,
            });
        }
    }

});