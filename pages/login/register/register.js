//index.js

//获取应用实例
var app = getApp();
Page({
  data: {
    titleText: '',
    regusername:'',
    name_icon: "../../images/phone_reg_nos.png",
    bold_name_line:'bolder-un-line',
    regpasswd: '',
    pwd_icon: "../../images/key_pwd_nor.png",
    bold_pwd_line: 'bolder-un-line',
    conformpwd: '',
    cpwd_icon: "../../images/reconform_reg_nos.png",
    bold_cpwd_line: 'bolder-un-line',
    nickname:'',
    regverifycode:'',
    verifycode:'',
    verify_icon:'../../images/verify_reg_nos.png',
    bold_verify_line:'bolder-un-line',
    isagree:false,
    agreeBg:'agree-un-btn',
    register_btn: 'register_un_btn',
    is_click: true,
    second: 60,
    tips: '获取验证码'
  },
  //事件处理函数
  bindViewTap: function () {
    var that = this;
    if (that.data.isagree) {
      if (!app.phoneRe.test(that.data.regusername)) {
        wx.showModal({
          title: '提示',
          content: '手机号码格式有误',
          showCancel: false
        })
      } else if (app.isBlank(that.data.regpasswd) || (that.data.regpasswd.length < 6)) {
        wx.showModal({
          title: '提示',
          content: '请设置至少六位登录密码',
          showCancel: false
        })
      } else if (that.data.regpasswd != that.data.conformpwd) {
        wx.showModal({
          title: '提示',
          content: '两次输入的密码不一致',
          showCancel: false
        })
      } else if (that.data.regverifycode == ''
        || that.data.regverifycode != that.data.verifycode) {
        wx.showModal({
          title: '提示',
          content: '验证码错误',
          showCancel: false
        })
      } else {
         app.request({
           url: "phone/js/user/reg",
           data: {
             phone: that.data.regusername,
             passwd: that.data.regpasswd,
             checkCode: that.data.regverifycode
           },
           loading: true,
           loadingMsg: "正在注册",
           method: 'POST',
           successFn: function (res) {
             wx.showModal({
               title: '提示',
               content: '恭喜，注册成功！',
               showCancel:false,
               success:function(e){
                 if(e.confirm){
                   app.setLoginFlag(false);
                   app.setLoginInfo({
                     phone: that.data.regusername,
                     passwd: ''
                   })
                   wx.reLaunch({
                     url: '../login',
                   })
                 }
               }
             })
           },
           successFailFn:function(){
             wx.hideLoading();
             wx.showModal({
               title: '提示',
               content: '抱歉，手机号【' + that.data.regusername+'】已被别人注册！',
               showCancel: false
             })
           },
           fail: function () {
             wx.hideLoading();

             wx.showToast({
               title: '抱歉，注册失败，稍后再试！',
               duration: 3000
             });
           }
         });
       }
     } else {
       wx.showModal({
         title: '提示',
         content: '请先确认服务协议',
         showCancel:false
       })
     }
   },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      nickname: app.getUserInfo().name
    })
  },
  getcode:function(){
    var that = this;
    if(this.data.is_click){
      if (!app.phoneRe.test(that.data.regusername)) {
        wx.showModal({
          title: '提示',
          content: '手机号码格式有误',
          showCancel:false
        })
      } else {
        app.request({
          url: "phone/userinfor/getverifycode",
          data: {
            phone: that.data.regusername
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          loading: true,
          loadingMsg: "正在获取",
          successFn: function (res) {
            console.log('successFn-----' + JSON.stringify(res))
            if (res.data.code == '1') {
              that.setData({
                verifycode: res.data.content[0],
                is_click: false
              });
              // 倒计时60之后
              that.countdown()
            }
          }, completeFn: function (res) {

            console.log('completeFn-----' + JSON.stringify(res))
            if (res.data.code == '-1') {
              wx.showModal({
                title: '提示',
                content: res.data.errmsg,
                showCancel: false
              })
            }
          }
        })
      }
    }
    
  },
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
          tips: '获取验证码'
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
  getregname: function (e) {
    this.setData({
      regusername: e.detail.value
    })
  },
  getregpasswd: function (e) {
    this.setData({
      regpasswd: e.detail.value
    })
  },
  getconformpasswd: function (e) {
    this.setData({
      conformpwd: e.detail.value
    })
  },
  getverifycode: function (e) {
    this.setData({
      regverifycode: e.detail.value
    })
  },
  chooseagree: function () {
    var isagree = this.data.isagree;
    isagree = !isagree;
    this.setData({
      isagree: isagree
    });
    if(isagree){
      this.setData({
        agreeBg:'agree-en-btn',
        register_btn:'register_en_btn'
      })
    }else{
      this.setData({
        agreeBg: 'agree-un-btn',
        register_btn: 'register_un_btn'
      })
    }
  },
  bindnamefocus:function(e){
    this.setData({
      bold_name_line: 'bolder-en-line',
      name_icon: "../../images/phone_reg_sel.png"
    })
  },
  bindnameblur: function (e) {
    this.setData({
      bold_name_line: 'bolder-un-line',
      name_icon: "../../images/phone_reg_nos.png"
    })
  },
  bindverifyfocus: function (e) {
    this.setData({
      bold_verify_line: 'bolder-en-line',
      verify_icon: '../../images/verify_reg_sel.png',
    })
  },
  bindverifyblur: function (e) {
    this.setData({
      bold_verify_line: 'bolder-un-line',
      verify_icon: '../../images/verify_reg_nos.png',
    })
  },
  bindpwdfocus: function (e) {
    this.setData({
      bold_pwd_line: 'bolder-en-line',
      pwd_icon: '../../images/key_pwd_sel.png',
    })
  },
  bindpwdblur: function (e) {
    this.setData({
      bold_pwd_line: 'bolder-un-line',
      pwd_icon: '../../images/key_pwd_nor.png',
    })
  },
  bindcpwdfocus: function (e) {
    this.setData({
      bold_cpwd_line: 'bolder-en-line',
      cpwd_icon: "../../images/reconform_reg_sel.png",
    })
  },
  bindcpwdblur: function (e) {
    this.setData({
      bold_cpwd_line: 'bolder-un-line',
      cpwd_icon: "../../images/reconform_reg_nos.png",
    })
  },
  
})
