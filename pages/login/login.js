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

    async submit() {
        let username = this.data.username;
        let password = this.data.password;
        console.log(username);
        console.log(password);
        let res = await request('/test', 'POST', {
            username: username,
            password: password
        });
        console.log(res);
    }
});