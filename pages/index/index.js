// pages/index/index.js

import request from "../../utils/request";

Page({

    data: {
        slideData: {},
        articleList: {}
    },

    toArticle: function (event) {
        let i = event.currentTarget.id;
        wx.navigateTo({
            url: '/pages/article/article?path=' + JSON.stringify(this.data.articleList[i].path)
        })
    },

    onLoad: async function (options) {
        let slideRes = await request('/v2/slide/selectAllSlide', 'GET');
        if (slideRes.data.code == '00000') {
            this.setData({
                slideData: slideRes.data.data
            });
            console.log(this.data.slideData);
        }
        let articleRes = await request('/v2/article/selectAllArticle', 'GET');
        if (articleRes.data.code == 'E0100') {
            return;
        }
        if (articleRes.data.code == '00000') {
            console.log(this.data.articleData);
            let articleData = articleRes.data.data;
            let articleList = [];
            for (let i in articleData) {
                if (articleData[i].displayStatus == 2) {
                    continue;
                }
                let id = articleData[i].id;
                let path = articleData[i].contentPath;
                let time = articleData[i].updateTime.substring(0, 10);
                let html = await request(path, 'GET');
                let title = html.data.split('msg_title')[2].split("'")[1];
                let des = html.data.split('msg_desc')[1].split('"')[1];
                let cover = html.data.split('cdn_url_235_1')[1].split('"')[1];
                // console.log(title);
                // console.log(des);
                // console.log(cover);
                articleList.push({
                    id,
                    title,
                    des,
                    cover,
                    path,
                    time
                })
            }
            this.setData({
                articleList: articleList
            })
        }
        let noticeRes = await request('/v2/notice/selectAllNotice', 'GET');
        if (noticeRes.data.code == '00000') {
            console.log(noticeRes.data);
            let noticeData = noticeRes.data.data;
            for (let i in noticeData) {
                if (noticeData[i].displayStatus == 2) {
                    continue;
                }
                wx.showModal({
                    title: '通知',
                    content: '【' + noticeData[i].updateTime.substring(0, 16) + '】\n' + noticeData[i].content,
                    showCancel: false,
                });
            }
        }
    },

    onShow: async function () {

    }
})