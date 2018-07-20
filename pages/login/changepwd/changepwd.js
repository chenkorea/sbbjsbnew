//index.js

//获取应用实例
var app = getApp();
Page({
  data: {
    titleText: '',
    newpwd:'',
    conformpwd:'',
    phone:'',
    uid:'',
    nickname:''
  },
  //事件处理函数
  conforupdate: function () {
    var that = this;
    if (this.data.newpwd.length < 6){
      wx.showModal({
        title: '提示',
        content: '登录密码不得少于六位',
        showCancel:false
      })
    } else if (this.data.newpwd != this.data.conformpwd) {
      wx.showModal({
        title: '提示',
        content: '两次填写的密码不一致',
        showCancel: false
      })
    } else {
      app.request({
        url: 'phone/userinfor/updatepasswd',
        data: {
          username: this.data.phone,
          passwd: this.data.conformpwd,
          user_type:'2'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        loading: true,
        loadingMsg: "正在更新",
        successFn: function (res) {
          if(res.data.code == '1'){
            wx.showModal({
              title: '提示',
              content: '重置密码成功,请返回登录体验吧',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  app.setLoginFlag(false);
                  app.setLoginInfo({
                    phone: that.data.phone,
                    passwd: ''
                  })
                  wx.reLaunch({
                    url: '../../login/login',
                  })
                }
              }
            })
          }else{
            wx.showToast({
              title: '重置密码失败了',
            })
          }
        },
        completeFn: function(res) {
          if ('-1' == res.data.code) {
            wx.showModal({
              title: '提示',
              content: '该手机号未注册！',
              showCancel: false
            })
          }
        }
      });
    }
  },
  onLoad: function (e) {
    console.log('onLoad---->' + JSON.stringify(e))
    var that = this
    this.setData({
      phone:e.phone
    })
 },
  newpwd:function(e){
    this.setData({
      newpwd: e.detail.value
    })
  },
  conformpwd: function (e) {
    this.setData({
      conformpwd: e.detail.value
    })
  }
})
