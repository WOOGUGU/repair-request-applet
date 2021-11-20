Page({
    data: {
        date: '2021-11-20',
        time: '12:00',
        array: ['故障1', '故障2', '故障3', '故障4']
    },

    // 表单数据发生改变
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        })
    },

    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)

        const items = this.data.items
        for (let i = 0, len = items.length; i < len; ++i) {
            items[i].checked = items[i].value === e.detail.value
        }

        this.setData({
            items
        })
    },

    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },

    bindDateChange: function (event) {
        this.setData({
            date: event.detail.value
        })
    },

    bindTimeChange: function (event) {
        this.setData({
            time: event.detail.value
        })
    },

    onLoad: function (options) {

    }
});