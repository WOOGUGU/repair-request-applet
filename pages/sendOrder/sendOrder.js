import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

Page({
    data: {
        topNavBar: {
            bgColor: 'bg-gradual-blue'
        },
        userInfo: {},
        cookie: '',
        tel: '',
        tel_local: '',
        type: 'wire',
        posResult: null,
        posArray: [[], []],
        posIndex: [0, 0],
        positionPickerData: {},
        desIndex: null,
        desSet: ['其他'],
        desPlus: '',
        date: null,
        dateStart: '',
        dateEnd: '',
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

    bindMultiPickerChange: function (event) {
        this.setData({
            posIndex: event.detail.value,
            posResult: this.data.posArray[1][this.data.posIndex[1]]
        });
        console.log(this.data.posResult);
    },

    bindMultiPickerColumnChange: function (event) {
        let data = {
            posArray: this.data.posArray,
            posIndex: this.data.posIndex,
            positionPickerData: this.data.positionPickerData
        };
        data.posIndex[event.detail.column] = event.detail.value;
        if (event.detail.column == 0) {
            for (let i in data.positionPickerData) {
                if (i == data.posIndex[0]) {
                    data.posArray[1] = data.positionPickerData[i].position;
                    break;
                }
            }
            data.posIndex[1] = 0;
        }
        this.setData(data);
    },

    submit: async function () {
        let pattern = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        if (!pattern.test(this.data.tel)) {
            wx.showModal({
                title: '系统提示',
                content: '请输入正确的联系方式',
                showCancel: false,
            });
            return;
        } else if (this.data.posResult == null) {
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
        let position = this.data.posResult;
        let des = (this.data.desSet[this.data.desIndex] == '其他' ? '' : this.data.desSet[this.data.desIndex]) + this.data.desPlus;
        let timeSubscribe = this.data.date + ' ' + this.data.timeSet[this.data.timeIndex];

        wx.setStorage({
            key: 'tel',
            data: {
                tel: tel
            }
        });

        let res = await request('/v2/order/addOrder', 'POST', {
            cookie: this.data.cookie,
            'content-type': 'application/x-www-form-urlencoded'
        }, {
            token,
            username,
            sender,
            tel,
            type,
            position,
            des,
            timeSubscribe
        });

        if (res.data.code == '00000') {
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
        if (tel_local) {
            this.setData({
                tel_local: tel_local.tel,
                tel: tel_local.tel
            })
        }
    },

    onLoad: async function (options) {
        let userInfo = getStorage('localUserInfo');
        let cookie = getStorage('cookie');
        if (userInfo && cookie) {
            this.setData({
                userInfo,
                cookie
            });
        }

        let locationRes = await request('/v2/picker/selectAllPickerLocation', 'GET', {
            cookie
        });
        let locationData = locationRes.data;
        this.setData({
            positionPickerData: locationData.data
        })
        let areaList = [];
        for (let i in this.data.positionPickerData) {
            areaList.push(this.data.positionPickerData[i].name)
        }
        this.setData({
            posArray: [areaList, this.data.positionPickerData[0].position]
        })

        // let dateRes = await request('/v2/inner/getTime', 'GET', {
        //     cookie
        // });
        // let dateData = dateRes.data;
        // this.setData({
        //     dateStart: dateData.data.now,
        //     dateEnd: dateData.data.after
        // })

        let pickerRes = await request('/v2/picker/selectAllPicker', 'GET', {
            cookie
        });
        let timeData = pickerRes.data.data.picker.times;
        let timeList = [];
        for (let i in timeData) {
            timeList.push(timeData[i].picker)
        }
        let typeData = pickerRes.data.data.picker.types;
        let typeList = [];
        for (let i in typeData) {
            typeList.push(typeData[i].picker)
        }
        this.setData({
            timeSet: timeList,
            desSet: typeList,
            dateStart: pickerRes.data.data.now,
            dateEnd: pickerRes.data.data.after
        });
    }
});