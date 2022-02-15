Page({
    data: {},
    onLoad: function (options) {

    },
    picture:function (){
        wx.navigateTo({url:'../Adminpicture/Adminpicture'})
    },
    order:function (){
        wx.navigateTo({url:'../Adminorder/Adminorder'})
    },
    text:function (){
        wx.navigateTo({url:'../Admintext/Admintext'})
    }
});