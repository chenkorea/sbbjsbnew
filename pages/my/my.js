//logs.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    username: '',
    userphoto: '',
    userphone: '',
    logs: []
  },
  onLoad: function () {
    var that = this;
    //调用登录接口
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        that.setData({
          username: res.userInfo.nickName,
          userphoto: res.userInfo.avatarUrl
        })
      }
    })
    var phone = app.getUserInfo().phone
    this.setData({
      userphone: phone
    });
  },
  gomyorder: function () {
    wx.navigateTo({
      url: './order/order',
    })
  },
  tosetting: function () {
    wx.navigateTo({
      url: './updatepwd/updatepwd',
    })
  },
  tomyinfo: function () {
    wx.navigateTo({
      url: "../userinfo/userinfo?redirectUrl=../index/index"
    })
  },
  addgoods:function() {
    wx.navigateTo({
      url: './addgoods/addgoods',
    })
  },
})
