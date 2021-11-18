import request from "../../utils/request";

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
        let password = this.data.password;
        console.log(username);
        console.log(password);
        let res = await request('/test', 'POST', {
            username: username,
            password: password
        });
        if (res == "map[password:1 username:1]") {
            wx.navigateTo({
                url: '/pages/submit/submit',
                success: function (res) {
                    res.eventChannel.emit('loginSuccess', {
                        userInfo: {
                            userId: '1',
                            realName: 'zhangke',
                            username: username
                        }
                    })
                }
            });
        } else {
            wx.showModal({
                title: '系统提示',
                content: '账号/密码错误，请重试',
                showCancel: false,
            });
        }
    }
    // 提交表单 end
    
});