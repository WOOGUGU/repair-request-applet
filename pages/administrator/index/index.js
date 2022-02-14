Page({
    data: {},
    onLoad: function (options) {

    },
    picture:function (){
        wx.navigateTo({url:'../administrator/picture/picture'})
    },
    order:function (){
        wx.navigateTo({url:'../administrator/order/order'})
    },
    text:function (){
        wx.navigateTo({url:'../administrator/text/text'})
    }
});