import getStorage from "../../utils/getStorage";
import request from "../../utils/request";

var COS = require('../../utils/cos-wx-sdk-v5')

Page({
    data: {
        userInfo: {},
        cookie: '',
        tel: '',
        type: 'wire',
        posResult: null,
        posArray: [[], []],
        posIndex: [0, 0],
        positionPickerData: {},
        posPlus: '',
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
        ],
        media: [],
        imgPath: []
    },

    // 表单数据发生改变
    handleInput(event) {
        let type = event.currentTarget.id;
        this.setData({
            [type]: event.detail.value
        });
    },

    // 多级picker数据发生改变
    bindMultiPickerChange: function (event) {
        this.setData({
            posIndex: event.detail.value,
            posResult: this.data.posArray[1][this.data.posIndex[1]]
        });
        console.log(this.data.posResult);
    },

    // 多级picker列发生改变
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

    chooseMedia: async function () {
        let that = this;
        let username = this.data.userInfo.username;
        wx.chooseMedia({
            count: 3,
            mediaType: ['image'],
            maxDuration: 10,
            camera: 'back',
            success: function (res) {
                console.log(res);
                let mediaList = [];
                for (let singleFile of res.tempFiles) {
                    if (singleFile.size > 10 * 1000 * 1000) {
                        wx.showModal({
                            title: '系统提示',
                            content: '单个文件大于10MB，请重新选择！',
                            showCancel: false,
                        });
                        return;
                    }
                    mediaList.push({
                        fileType: singleFile.fileType,
                        tempFilePath: singleFile.tempFilePath,
                        thumbTempFilePath: singleFile.thumbTempFilePath
                    });
                }
                that.setData({
                    media: mediaList
                });
            },
            fail: function (res) {
                that.setData({
                    media: []
                });
            }
        });
    },

    uploadMedia: async function () {
        let cookie = this.data.cookie;

        let barRes = await request('/v2/cos/getCosBucketAndRegion', 'GET', {
            cookie
        }, {});
        let barData = {};
        if (barRes.data.code == '00000') {
            barData = barRes.data.data;
        } else {
            return false;
        }

        // 异步获取临时密钥
        let stsRes = await request('/v2/cos/getCosTemporaryKey', 'GET', {
            cookie
        }, {});
        let stsData = {};
        if (stsRes.data.code == '00000') {
            stsData = stsRes.data.data;
        } else {
            return false;
        }

        let filesPath = [];
        let filesName = [];
        let filesType = [];
        let filenamePrefix = new Date().getTime();
        for (let file of this.data.media) {
            filesPath.push(file.tempFilePath);
            let temp = file.tempFilePath.split('.');
            filesName.push(filenamePrefix + '-' + filesPath.length + '.' + temp[temp.length - 1]);
            filesType.push(file.fileType);
        }
        // console.log(filesName);
        // console.log(filesPath);

        var cos = new COS({
            ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
            getAuthorization: function (options, callback) {
                callback({
                    TmpSecretId: stsData.id,
                    TmpSecretKey: stsData.key,
                    XCosSecurityToken: stsData.token,
                    StartTime: stsData.startTime,
                    ExpiredTime: stsData.expiredTime
                });
            },
            FileParallelLimit: 9
        });

        // 接下来可以通过 cos 实例调用 COS 请求。
        // TODO
        let urls = [];
        for (let i in filesName) {
            let uploadData = await new Promise((resolve, reject) => {
                cos.postObject({
                    Bucket: barData.bucket,
                    Region: barData.region,
                    Key: this.data.userInfo.username + '/' + filesName[i],
                    FilePath: filesPath[i], // wx.chooseImage 选择文件得到的 tmpFilePath
                    onProgress: function (progressData) {
                        console.log(JSON.stringify(progressData));
                    }
                }, function (err, data) {
                    // console.log(err || data);
                    if (err) {
                        reject(err);
                    }
                    if (data) {
                        resolve(data);
                    }
                });
            });
            urls.push({
                url: 'https://' + uploadData.Location,
                type: filesType[i]
            });
        }
        return JSON.stringify(urls);
    },

    previewMedia: function (event) {
        let sources = [];
        for (let mediaElement of this.data.media) {
            sources.push({
                url: mediaElement.tempFilePath,
                type: mediaElement.fileType
            });
        }
        let current = event.currentTarget.id;
        // console.log(current);
        wx.previewMedia({
            sources,
            current
        });
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
        } else if (this.data.posResult == null || (this.data.posResult == null && (this.data.posPlus == '' || this.data.posPlus == null))) {
            wx.showModal({
                title: '系统提示',
                content: '请选择/填写报修位置',
                showCancel: false,
            });
            return;
        } else if (this.data.desIndex == null || ((this.data.desIndex == null || this.data.desSet[this.data.desIndex] == '其他') && (this.data.desPlus == '' || this.data.desPlus == null))) {
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

        let cookie = this.data.cookie;
        let username = this.data.userInfo.username;
        let sender = this.data.userInfo.name;
        let tel = this.data.tel;
        let type = this.data.type;
        let position = (this.data.posResult == '其他' ? '' : this.data.posResult) + this.data.posPlus;
        let des = (this.data.desSet[this.data.desIndex] == '其他' ? '' : this.data.desSet[this.data.desIndex]) + this.data.desPlus;
        let timeSubscribe = this.data.date + ' ' + this.data.timeSet[this.data.timeIndex];

        let that = this;

        wx.showModal({
            title: '系统提示',
            content: '确定要提交吗？',
            success: async function (res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    });
                    let imgPath = await that.uploadMedia();
                    // console.log(imgPath);
                    let sendOrderRes = await request('/v2/order/addOrder', 'POST', {
                        cookie,
                        'content-type': 'application/x-www-form-urlencoded'
                    }, {
                        username,
                        sender,
                        tel,
                        type,
                        position,
                        des,
                        timeSubscribe,
                        imgPath
                    });
                    wx.hideLoading();
                    if (sendOrderRes.data.code == '00000') {
                        wx.showToast({
                            title: '提交成功',
                            icon: 'success',
                            duration: 1000
                        });
                        setTimeout(function () {
                            wx.reLaunch({
                                url: '/pages/order/order'
                            });
                        }, 1000);
                    } else {
                        wx.showModal({
                            title: '系统提示',
                            content: sendOrderRes.data.userMsg,
                            showCancel: false,
                        });
                    }
                }
            }
        });
    },

    onLoad: async function (options) {
        let userInfo = getStorage('localUserInfo');
        let cookie = getStorage('cookie');
        if (userInfo && cookie) {
            this.setData({
                userInfo,
                cookie,
                tel: userInfo.tel
            });
        }

        // 位置picker数据
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

        let pickerRes = await request('/v2/picker/selectAllPicker', 'GET', {
            cookie
        });
        // 时间picker数据
        let timeData = pickerRes.data.data.picker.time;
        let timeList = [];
        for (let i in timeData) {
            timeList.push(timeData[i].picker)
        }
        let dateStart = pickerRes.data.data.start;
        let dateEnd = pickerRes.data.data.end;
        // 故障类型picker数据
        let typeData = pickerRes.data.data.picker.des;
        let typeList = [];
        for (let i in typeData) {
            typeList.push(typeData[i].picker)
        }
        this.setData({
            timeSet: timeList,
            desSet: typeList,
            dateStart,
            dateEnd
        });
    }
})