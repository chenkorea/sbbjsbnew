//index.js

//获取应用实例
var app = getApp();
Page({
  data: {
    titleText: '',
    fogcode:'',
    verifycode:'',
    fogphone:'',
    nextstep: 'next_un_btn',
    is_click: true,
    second: 60,
    tips: '发送'
  },  
  //事件处理函数
  bindViewTap: function () {
    var that = this;
    if (app.isBlank(that.data.fogphone)) {
      wx.showModal({
        title: "提示",
        content: "手机号不能为空！",
        showCancel: false
      });

          // 校验密码
    } else if (that.data.fogcode == '' || that.data.fogcode != that.data.verifycode){
       wx.showToast({
        title: '验证码错误',
         duration: 1500,
       })
    }else{
      wx.redirectTo({
        url: '../changepwd/changepwd?phone=' + that.data.fogphone
      })
     }
  },
  onLoad: function () {
    var that = this
    if (app.phoneRe.test(app.getUserInfo().phone)) {
      that.setData({
        nextstep: 'next_en_btn',
        fogphone: app.getUserInfo().phone
      })
    } else {
      that.setData({
        nextstep: 'next_un_btn',
        fogphone: app.getUserInfo().phone
      })
    }
  },
  //获取验证码
  getcode: function () {
    var that = this;
    if(this.data.is_click){
      if (!app.phoneRe.test(this.data.fogphone)) {
        wx.showModal({
          title: "提示",
          content: "手机号格式不正确！",
          showCancel: false
        });
      } else {
        app.request({
          url: 'phone/userinfor/getverifycode',
          data: {
            phone: that.data.fogphone
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          loading: true,
          loadingMsg: "正在获取",
          successFn: function (res) {
            if (res.data.code == '1') {
              that.setData({
                verifycode: res.data.content[0],
                nextstep: 'next_en_btn',
                is_click: false,
              });

              that.countdown()
            }
          }, completeFn: function (res) {
            if (res.data.code == '-1') {
              wx.showModal({
                title: '提示',
                content: res.data.errmsg,
                showCancel: false
              })
            }
            that.setData({
              nextstep: 'next_en_btn'
            });
          }
        })
      }
    }
    
  },
  //发送冷却
  //倒计时
  countdown: function () {
    var that = this
    var id = setInterval(function () {
      //定时执行的代码
      var second = that.data.second;
      if (second == 0) {
        that.setData({
          second: 60,
          is_click: true,
          tips: '发送'
        })
        clearInterval(id);//关闭定时器
      } else {
        second = second - 1;
        that.setData({
          second: second,
          tips: second + '秒后再次获取'
        })
      }

    }, 1000);
  },
  //验证码
  getfogcode: function(e) {
    this.setData({
      fogcode: e.detail.value
    })
  },
  //手机号
  getfogname: function (e) {
    this.setData({
      fogphone: e.detail.value
    })
    if (app.phoneRe.test(e.detail.value)) {
      this.setData({
        nextstep: 'next_en_btn'
      })
    }else{
      this.setData({
        nextstep: 'next_un_btn'
      })
    }
  },

  onShow: function (opntions) {
    var that = this;
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({ fogphone: res.data })
      },
    })
  }
})
