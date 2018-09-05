//index.js
//获取应用实例
var app = getApp();
var Util = require('../../utils/address.js')
// var payUtil = require('../../utils/wxpay.js')
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var timer;
Page({
  data: {
    isPopping: true,//是否已经弹出  
    animPlus: {},//旋转动画  
    // animCollect: {},//item位移,透明度  
    animTranspond: {},//item位移,透明度  
    animInput: {},//item位移,透明度  
    classone: 'selected',
    classtwo: '',
    classThree: '',
    classFour: '',
    classFive: '',
    orderstatus: '1',   // 1待接单  2 开工中  3完工
    userstatus: '1',  // 1待接单 2做单中  3停单中
    userstatusname: '接单中',
    showClass: 'img-plus-style',
    jsDetailVos: [],
    jsDetailVosOne: [],
    jsDetailVosTwo: [],
    jsDetailVosThree: [],
    jsDetailVosFour: [],
    jsDetailVosFive: [],
    orderAllCount: 0,
    showModalStatus: false,
    userOrder: {},
    selctgoods: {},
    inputOneValue: '',
    inputTwoValue: '',
    inputThreeValue: '',
    allPrice: '',
    payment: '在线支付',
    payments: ['在线支付', '技师代付'],
    fdmindex: 0,
    weixinUserInfo: {},
    orderAllCount: 0,
    username: '',
    isCommitSuccess: false,
    hasMore: true,
    isloading: false,
    pageCount: 3,
    pageNum: 0,
    lastFinishArray: [],
    scrollHeight: 0,
    open_id: '0000',
    clientY: 0,//触摸时Y轴坐标
    refreshHeight: 0,//获取高度  
    refreshing: false,//是否在刷新中
    showModal: false,
    isNeed:'0',
    idcardNo:'',
    otherCard:'',
    carCard:'',
    driveCard:'',
    tempOrderId: '',
    jsonclStrTemp: '',
    jsonStrTemp: ''
  },
  toMyCenter: function () {
    wx.navigateTo({
      url: '../my/my',
    })
  },
  listenerPickerFDMSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    if (e.detail.value == 0) {
      this.setData({ payment: '在线支付' });
    } else {
      this.setData({ payment: '技师代付' });
    }
    this.setData({
      fdmindex: e.detail.value
    });
  },
  binddd: function (e) {
    var formId = e.detail.formId;
    console.log('formId = ' + formId);
  },
  //事件处理函数
  bindStatusViewTap: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    that.changeStatus(id);
    // that.getQuery();
    // that.setData({ jsDetailVosOne: []})
    // that.setData({ jsDetailVosTwo: [] })
    // that.setData({ jsDetailVosThree: [] })
    // that.setData({ jsDetailVosFour: [] })
    // that.setData({ jsDetailVosFive: [] })
  },
  changeStatus: function (id) {
    var that = this;
    if (id == 1) {
      that.setData({ classone: 'selected', classtwo: '', classThree: '', classFour: '', classFive: '', orderstatus: '1' });
      that.getOrderTaking();
      // if (app.isArray(that.data.jsDetailVosOne) && that.data.jsDetailVosOne.length == 0) {

      // } else {
      //   that.setData({ jsDetailVos: that.data.jsDetailVosOne });
      // }

    } else if (id == 2) {
      that.setData({ classone: '', classtwo: 'selected', classThree: '', classFour: '', classFive: '', orderstatus: '2' })
      that.getOrderListByStatus('04,02');
      // if (app.isArray(that.data.jsDetailVosTwo) && that.data.jsDetailVosTwo.length == 0) {
      // } else {
      //   that.setData({ jsDetailVos: that.data.jsDetailVosTwo });
      // }
    } else if (id == 3) {
      that.setData({ classone: '', classtwo: '', classThree: 'selected', classFour: '', classFive: '', orderstatus: '3' })
      that.getOrderListByStatus('05');
      // if (app.isArray(that.data.jsDetailVosThree) && that.data.jsDetailVosThree.length == 0) {
      // } else {
      //   that.setData({ jsDetailVos: that.data.jsDetailVosThree });
      // }
    } else if (id == 4) {
      that.setData({ classone: '', classtwo: '', classThree: '', classFour: 'selected', classFive: '', orderstatus: '4' })
      that.getUserOrderNOPAY('06');
      // if (app.isArray(that.data.jsDetailVosFour) && that.data.jsDetailVosFour.length == 0) {
      // } else {
      //   that.setData({ jsDetailVos: that.data.jsDetailVosFour });
      // }
    } else if (id == 5) {
      that.setData({ classone: '', classtwo: '', classThree: '', classFour: '', classFive: 'selected', orderstatus: '5' })
      if (app.isArray(that.data.jsDetailVosFive) && that.data.jsDetailVosFive.length == 0) {
        that.getUserOrderFinish('07', true);
      } else {
        that.setData({ jsDetailVos: that.data.jsDetailVosFive.concat(that.data.lastFinishArray) });
      }
    }
  },

  changeOrderTop: function (id) {
    var that = this;
    if (id == 1) {
      that.setData({ classone: 'selected', classtwo: '', classThree: '', classFour: '', classFive: '', orderstatus: '1' });
    } else if (id == 2) {
      that.setData({ classone: '', classtwo: 'selected', classThree: '', classFour: '', classFive: '', orderstatus: '2' })

    } else if (id == 3) {
      that.setData({ classone: '', classtwo: '', classThree: 'selected', classFour: '', classFive: '', orderstatus: '3' })

    } else if (id == 4) {
      that.setData({ classone: '', classtwo: '', classThree: '', classFour: 'selected', classFive: '', orderstatus: '4' })

    } else if (id == 5) {
      that.setData({ classone: '', classtwo: '', classThree: '', classFour: '', classFive: 'selected', orderstatus: '5' })
    }
  },

  //点击弹出  
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画  
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画  
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  // 技师状态 1：接单中 2：停单中
  input: function () {
    this.changeUserStatus('1');
    // 接单中
    this.setData({ userstatus: '1', userstatusname: '接单中', showClass: 'img-plus-style' })
    this.plus();
  },
  transpond: function () {

    this.changeUserStatus('2');
    // 待接单
    this.setData({ userstatus: '2', userstatusname: '休息中', showClass: 'img-plus-style img-style-2' })
    this.plus();

  },
  // collect: function () {
  //   console.log("collect")
  //   // 停工
  //   this.setData({ userstatus: '3', userstatusname: '停单中' })
  //   this.plus();
  // },

  //弹出动画  
  popp: function () {
    //plus顺时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    // var animationcollect = wx.createAnimation({
    //   duration: 500,
    //   timingFunction: 'ease-out'
    // })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    // animationPlus.rotateZ(360).step();
    // // animationcollect.translate(-180, 0).rotateZ(360).opacity(1).step();
    // animationTranspond.translate(-120, 0).rotateZ(360).opacity(1).step();
    // animationInput.translate(-60, 0).rotateZ(360).opacity(1).step();

    animationPlus.rotateZ(360).step();
    // animationcollect.translate(-100, -100).rotateZ(180).opacity(1).step();
    animationTranspond.translate(-90, 0).rotateZ(360).opacity(1).step();
    animationInput.translate(-60, -70).rotateZ(360).opacity(1).step();


    this.setData({
      animPlus: animationPlus.export(),
      // animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画  
  takeback: function () {
    //plus逆时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    // var animationcollect = wx.createAnimation({
    //   duration: 500,
    //   timingFunction: 'ease-out'
    // })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    // animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      // animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享  
    return {
      title: 'title', // 分享标题  
      desc: 'desc', // 分享描述  
      path: 'path' // 分享路径  
    }
  },

  changeStatusForNext: function () {
    var that = this;
    that.setData({ orderstatus: '5'});
    that.getUserOrderNOPAY('06');
    that.getUserOrderFinish('07', true);
    that.changeOrderTop(4);
  },

  onShow: function () {
    var that = this;

    if (that.data.open_id = '0000') {
      that.wxLogin();
    }

    var status = that.data.orderstatus;
    console.log(status + 'sdfsdfsf');
    if (that.data.isCommitSuccess) {
      that.changeOrderTop(status);
      that.getOrderListByStatus('05');
      if (status == '4') {

        that.getUserOrderFinish('07', true);
        that.getUserOrderNOPAY('06');
      } else if (status == '5') {
        that.getUserOrderNOPAY('06');
        that.getUserOrderFinish('07', true);
      }
    }

    Util.getCityName(function (locationData) {
      var uid = app.getUserInfo().id;
      console.log('getCityName--->locationData:' + JSON.stringify(locationData) + ',uid:' + uid)
      app.request({
        url: "phone/userinfor/recordcurloc",
        data: {
          longitude: locationData.location.lng,
          latitude: locationData.location.lat,
          uid: uid
        },
        method: 'POST',
        loading: true,
        loadingMsg: "",
        successFn: function (res) {

        }
      })
    })

    // 调用接口
    // qqmapsdk.search({
    //   keyword: '酒店',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // })
    // 调用接口 
    // qqmapsdk.calculateDistance({
    //   mode: 'driving',//步行，驾车为'driving'
    //   to: [{ latitude: 26.647661, longitude: 106.730154 }],
    //    success: function(res) { 
    //      if (res.status == 0) {
    //        //米为单位
    //        console.log(res.result.elements[0].distance);
    //        //表示从起点到终点的结合路况的时间，秒为单位
    //        console.log(res.result.elements[0].duration);
    //      }
    //    }, 
    //    fail: function(res) {
    //       console.log(res);
    //    },
    //   complete: function(res) { 
    //     console.log(res); 
    //   } 
    // })
    // qqmapsdk.geocoder({
    //   address: '贵州省贵阳市南明区贵乌中路27号',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // })
    // var distance = Util.getFlatternDistance(26.647661, 106.630154, 26.64766, 106.730153);
    // console.log(distance + 'sdfsdfs')
  },

  getCurrentLoc: function () {
    Util.getLocationInfoCT(function (e) {
      if (!((typeof e === "undefined") || (e == null))) {
        wx.setStorageSync("latObj", e);
        console.log('ctQQLoc' + e.latitude + ' ' + e.longitude + ' ')
      }
    })
  },
  /**
    * 获取微信登录
  */
  wxLogin: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        that.getOpenId(res.code, e);
      }
    });
  },
  /**
   * 获取openId
   */
  getOpenId: function (code, e) {
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/getWXJSopenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 
        code: code, 
        isOld: '0'
      },
      success: function (res) {
        var openIdStr = res.data.content[0];
        var jsonObj = JSON.parse(openIdStr);
        console.log('open_id = ' + jsonObj.openid);
        that.setData({ open_id: jsonObj.openid });
        var userInfo = app.getUserInfo();
        that.saveOpenId(jsonObj.openid, userInfo.id);
      }
    })
  },
  // 保存open_id
  saveOpenId: function (open_id, uid) {
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/saveWXopenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        open_id: open_id,
        uid: uid
      },
      success: function (res) {
      }
    })
  },
  // 发送极光推送通知
  sendJPushMsg: function (user_id, status) {
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/sendJPushMsg',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: user_id,
        status: status
      },
      success: function (res) {
      }
    })
  },
  onLoad: function () {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'ZNIBZ-3WJHJ-BP2FP-FJM5E-6ZBCQ-O2B5H'
    });

    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    //预加载可接单数据
    var userInfo = app.getUserInfo();
    this.getOrderTaking();
    this.getOrderViewAllCount();
    this.getUserCurStatus();
    this.setData({ weixinUserInfo: wx.getStorageSync("weixinUserInfo") });
    this.setData({ username: userInfo.name });
    timer = setInterval(this.getCurrentLoc, 30 * 60 * 1000); //30分钟刷新一次
  },

  onUnload: function () {
    clearInterval(timer);
  },

  getUserOrderFinish: function (status, isnew) {
    var that = this;

    if (isnew) {//如果是完成支付刷新的。。
      that.setData({ pageNum: 0, hasMore: true, jsDetailVos: [], jsDetailVosFive: [], lastFinishArray: [] });
    } else { //一直是上拉加载更多的。

    }
    wx.showLoading({
      title: '查询订单中...',
    })

    var userInfo = app.getUserInfo();
    // 提交数据
    Util.getUserOrderFinish(function (res) {
      if(wx.hideLoading()){wx.hideLoading();}
      var code = res.data.code;
      if (code == '1') {
        that.setData({ lastFinishArray: [] });
        // 数据成功
        that.setData({ jsDetailVos: that.data.jsDetailVosFive.concat(res.data.content) });
        if (res.data.content.length == that.data.pageCount) {
          // console.log((res.data.content.length == that.data.pageCount) + ' ' + (that.data.pageNum+1));
          that.setData({ pageNum: that.data.pageNum + 1, hasMore: true, jsDetailVosFive: that.data.jsDetailVosFive.concat(res.data.content) });
        } else { //查到的总数小于pageCount
          that.setData({ hasMore: false, lastFinishArray: res.data.content });
        }
      } else if (code == '2') {//如果没数据表示没有了.
        that.setData({ hasMore: false });
      } else {
        wx.showToast({
          title: '查询订单失败！',
        })
      }
      that.setData({ isloading: false });
    }, userInfo.id, that.data.pageCount, that.data.pageNum)
  },
  getUserOrderNOPAY: function (status) {
    var that = this;
    wx.showLoading({
      title: '查询订单中...',
    })
    var userInfo = app.getUserInfo();
    // 提交数据
    Util.getUserOrderNOPAY(function (res) {
      if(wx.hideLoading()){wx.hideLoading();}
      var code = res.data.code;
      if (code == "1") {
        // 数据成功
        that.setData({ jsDetailVos: res.data.content });
        if (status == '06') {
          that.setData({ jsDetailVosFour: res.data.content });
        }
      } else {
        wx.showToast({
          title: '查询订单失败！',
        })
      }
    }, userInfo.id)
  },
  getOrderListByStatus: function (status) {
    var userInfo = app.getUserInfo();
   
    if (!userInfo.id) {
      wx.showToast({
        title: '用户信息不正确或为空',
        duration: 3000
      });
      // 校验密码
    } else {
      var _this = this;
      // 获取订单详细
      app.request({
        url: "phone/js/orderview/getOrderViewAll",
        data: {
          order_type: status,
          jsID: userInfo.id
        },
        method: 'GET',
        loading: true,
        loadingMsg: "正在查询订单...",
        successFn: function (res) {
          console.log('res.data.code = ' + JSON.stringify(res))
          if (res.data.code == 1 || res.data.code == 39) {
            if (res.data.code == 39) {
              // 待接单
              _this.setData({ userstatus: '2', userstatusname: '休息中', showClass: 'img-plus-style img-style-2' })
            } else {
              if ('不可接单状态' == res.data.content[0]) {
                wx.showModal({
                  title: '提示',
                  content: '用户信息出错，不能接单',
                  showCancel: false
                })
                return;
              } else {
                // 接单中
                _this.setData({ userstatus: '1', userstatusname: '接单中', showClass: 'img-plus-style' })
              }   
            }
            console.log(res.data.content);
            _this.setData({ jsDetailVos: res.data.content });
            if (status == '04,02') {
              _this.setData({ jsDetailVosTwo: res.data.content });
            } else if (status == '05') {
              _this.setData({ jsDetailVosThree: res.data.content });
            } else if (status == '06') {
              _this.setData({ jsDetailVosFour: res.data.content });
            } else if (status == '07') {
              _this.setData({ jsDetailVosFive: res.data.content });
            }
          }
        },
        successFailFn: function () {

        },
        failFn: function () {

        }
      });
    }
  },

  getOrderTaking: function () {
    var _this = this;
    var userInfo = app.getUserInfo();
    _this.setData({ jsDetailVos: [] });
    if (!userInfo.id) {
      wx.showToast({
        title: '用户信息不正确或为空',
        duration: 3000
      });
      // 校验密码
    } else {

      // 获取订单详细
      app.request({
        url: "phone/js/orderview/getOrderViewTakingAll",
        data: {
          jsID: userInfo.id,
          serviceType: app.getUserInfo().service_types
        },
        method: 'GET',
        loading: true,
        loadingMsg: "正在查询订单...",
        successFn: function (res) {
          if (res.data.code == 1 || res.data.code == 39) {
            
              if (res.data.code == 39){
                
                _this.setData({ userstatus: '2', userstatusname: '休息中', showClass: 'img-plus-style img-style-2' }) 
                _this.filterByDistance(res.data.content);
              } else {
                if ('不可接单状态' == res.data.content[0]) {
                  wx.showModal({
                    title: '提示',
                    content: '用户信息出错，不能接单',
                    showCancel: false
                  })
                } else {
                  // 接单中
                  _this.setData({ userstatus: '1', userstatusname: '接单中', showClass: 'img-plus-style' })
                  _this.filterByDistance(res.data.content);
                }  
              }
          } else if (res.data.code == 2) {

            _this.setData({ jsDetailVos: res.data.content });
            _this.setData({ jsDetailVosOne: res.data.content });

          }
        },
        successFailFn: function () {

        },
        failFn: function () {

        }
      });
    }
  },

  filterByDistance: function (list) {
    //26.647661106.630154,26.601088,106.728226

    var that = this;
    var listTemp = new Array();
    var listShow = new Array();
    var listDispatch = new Array();

    var locObj = wx.getStorageSync('latObj');
    var latitude = locObj.latitude;
    var longitude = locObj.longitude;
    console.log('ctllll' + latitude + ' ' + longitude + JSON.stringify(list));
    for (var i = 0; i < list.length; i++) {
      var obj = list[i];
      if (obj.current_status == '01') {//只过滤抢单的
        listTemp.push(obj);
      } else {
        listDispatch.push(obj);
      }
    }
    console.log('ct2222' + listDispatch.length + listTemp.length);
    var index = 0;
    if (listTemp.length > 0) {
      for (var i = 0; i < listTemp.length; i++) {
        console.log(i + 'sdsssss')
        let obj = listTemp[i];
        let addr = obj.popedom_name + obj.service_address;
        // qqmapsdk.geocoder({
        //   address: '贵州省贵阳市云岩区贵乌中路27号',
        //   success: function (res) {

        //     if (status == 0) {

        //       console.log('ct' + latitude + ' ' + longitude + ' ' + res.result.location.lat + ' ' + res.result.location.lng);
        //       var distance = parseInt(Util.getFlatternDistance(latitude, longitude, res.result.location.lat, res.result.location.lng));
        //       console.log('distance = ' + distance)

        //       wx.showToast({
        //         title: '进入',
        //         duration: 3000
        //       });

        //       if (distance < 1000) {//当半径大于2000米时，不允许抢单（不显示）
        //         console.log('来这里了')
        //         listShow.push(obj);          
        //       }
        //       // console.log(i + ' ' + listTemp.length)
        //       // console.log(index == listTemp.length - 1)
        //       if (index == listTemp.length - 1) {
        //         // console.log(' listDispatch.length = ' + listDispatch.length)
        //         listShow = listShow.concat(listDispatch); 
        //         that.setData({ jsDetailVos: listShow });
        //         that.setData({ jsDetailVosOne: listShow });
        //       }
        //     }
        //     index++;
        //   },
        //   fail: function (res) {
        //     console.log(res);
        //   },
        //   complete: function (res) {
        //     console.log(res);
        //   }
        // })

        console.log(addr+ i)
        Util.getLocationLatLonByAddr(addr, {
          success: function(e) {
            if (!((typeof e === "undefined") || (e == null))) {
              console.log('ct' + latitude + ' ' + longitude + ' ' + e.location.lat + ' ' + e.location.lng + ' ');
              var distance = parseInt(Util.getFlatternDistance(latitude, longitude, e.location.lat, e.location.lng));
              console.log('distance = ' + distance + JSON.stringify(e))

              // wx.showToast({
              //   title: distance + '进入',
              //   duration: 3000
              // });

              if (distance < 1000) {//当半径大于2000米时，不允许抢单（不显示）

                console.log('来这里了' + addr + JSON.stringify(obj))
                listShow.push(obj);
              }
            }
          },
          failure:function(err) {
            console.log('fail--' + index)
            if (index == listTemp.length - 1) {
              listShow = listShow.concat(listDispatch);
              that.setData({ jsDetailVos: listShow });
              that.setData({ jsDetailVosOne: listShow });
            }
          },
          completeFn: function(rescom) {
            console.log('completeFn--' + index)
            if (index == listTemp.length - 1) {
              listShow = listShow.concat(listDispatch);
              that.setData({ jsDetailVos: listShow });
              that.setData({ jsDetailVosOne: listShow });
            }
            index++;
          }
        })
      }
    } else {
      that.setData({ jsDetailVos: listDispatch });
      that.setData({ jsDetailVosOne: listDispatch });
    }


  },

  getOrderViewAllCount: function () {
    var userInfo = app.getUserInfo();

    if (!userInfo.id) {
      wx.showToast({
        title: '用户信息不正确或为空',
        duration: 3000
      });
      // 校验密码
    } else {
      var _this = this;
      // 获取订单详细
      app.request({
        url: "phone/js/orderview/getOrderViewAllCount",
        data: {
          jsID: userInfo.id
        },
        method: 'GET',
        loading: true,
        loadingMsg: "正在查询...",
        successFn: function (res) {
          if (res.data.code == 1) {
            _this.setData({ orderAllCount: res.data.content[0].order_count });
          } else {
            _this.setData({ orderAllCount: 0 });
          }
        },
        successFailFn: function () {

        },
        failFn: function () {

        }
      });
    }
  },

  getUserCurStatus: function (status) {
    var userInfo = app.getUserInfo();

    if (!userInfo.id) {
      wx.showToast({
        title: '用户信息不正确或为空',
        duration: 3000
      });
      // 校验密码
    } else {
      var _this = this;
      // 获取订单详细
      app.request({
        url: "phone/js/orderview/getUserCurStatus",
        data: {
          jsID: userInfo.id
        },
        method: 'GET',
        loading: true,
        loadingMsg: "正在查询...",
        successFn: function (res) {
          if (res.data.code == 1) {
            console.log(res.data.content.status_str)
            if (res.data.content[0].status == '2') {
              _this.setData({ userstatus: res.data.content[0].status, userstatusname: res.data.content[0].status_str, showClass: 'img-plus-style img-style-2' });
            } else {
              _this.setData({ userstatus: res.data.content[0].status, userstatusname: res.data.content[0].status_str, showClass: 'img-plus-style' });
            }
          }
        },
        successFailFn: function () {

        },
        failFn: function () {

        }
      });
    }
  },

  changeUserStatus: function (status) {
    var userInfo = app.getUserInfo();
    console.log(status);
    if (!userInfo.id) {
      wx.showToast({
        title: '用户信息不正确或为空',
        duration: 3000
      });
      // 校验密码
    } else {
      var _this = this;
      // 获取订单详细
      app.request({
        url: "phone/js/orderview/changeUserStatus",
        data: {
          userId: userInfo.id,
          status: status
        },
        method: 'POST',
        loading: true,
        loadingMsg: "正在修改用户状态...",
        successFn: function (res) {
          if (res.data.code == 1) {

          }
        },
        successFailFn: function () {

        },
        failFn: function () {

        }
      });
    }
  },
  /**
   * 保存微信表单ID
   */
  saveWXFormId: function (form_id, uid) {
    app.request({
      url: "phone/openkey/saveWXFormId",
      data: {
        form_id: form_id,
        uid: uid
      },
      method: 'POST',
      loading: false,
      successFn: function (res) {
        // 不做任何操作
      }
    });
  },
  saveWXOrderFormId: function (form_id, order_id) {
    app.request({
      url: "phone/openkey/saveWXOrderFormId",
      data: {
        form_id: form_id,
        order_id: order_id,
        utype: '2'
      },
      method: 'POST',
      loading: false,
      successFn: function (res) {
        // 不做任何操作
      }
    });
  },
  bindChangeStatus: function (e) {

    var that = this;
    var formId = e.detail.formId;
    var userInfo = app.getUserInfo();
    var id = e.currentTarget.dataset.id;
    var orderId = e.currentTarget.dataset.orderid;
    var orderItem = e.currentTarget.dataset.item;
    // console.log('-----------orderItem-------------')
    // console.log(orderItem)

    // 保存FormId
    console.log('formId = ' + formId);
    that.saveWXFormId(formId, userInfo.id);
    that.saveWXOrderFormId(formId, orderId);
    //构建添加额外商品list
    var goods = new Array();

    var obj = new Object();
    obj.process_person_id = userInfo.id;
    obj.process_person_name = userInfo.name;
    obj.order_id = orderId;
    //支付方式 1：在线支付 2：现金
    var payType = "";

    if (id == '04') {//点击开工
      obj.process_stage = '05';
      that.changeOrderTop(3);
    } else if (id == '02') {//点击抢单
      obj.process_stage = '02';
      that.changeOrderTop(2); 
    } else if (id == '03') {//点击接单
      obj.process_stage = '04';
      that.changeOrderTop(2);
    } else if (id == '06') {//点击接单
      obj.process_stage = '07';
      that.changeOrderTop(5);
    }

    var jsonStr = JSON.stringify(obj);
    var jsonGoodsStr = JSON.stringify(goods);

    if (id == '05') {
      // 跳转
      var item = e.currentTarget.dataset.item;
      that.getFinishNeedStatus(item, jsonStr);
      that.setData({ jsonclStrTemp: JSON.stringify(item)});
      that.setData({ jsonStrTemp: jsonStr })
    } else if(id == '06'){
      that.paywxLogin(e, jsonStr, id, jsonGoodsStr, payType, orderId, obj, orderItem)
      
    } else{
      // 修改订单状态
      that.commitOrderViewStatus(jsonStr, id, jsonGoodsStr, payType, orderId, obj, orderItem);
      console.log(jsonStr)
    }
  },
  //获取订单状态
  bindChangeStatusClick: function (e) {
    var order_id = e.currentTarget.dataset.orderid;
    var that = this;
    app.request({
      url: "/phone/userinfor/getOrderStatu",
      data: {
        order_id: order_id
      },
      method: 'POST',
      loading: true,
      loadingMsg: "查询订单状态中...",
      completeFn: function (res) {
        if (res.data.code == '1'){
          if (res.data.content[0].process_stage == '09'){
            wx.showModal({
              title: '提示',
              content: '用户已取消该订单...',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.getOrderTaking();
                }
              }
            })
          }else{
            that.bindChangeStatus(e);
          }
        }else{
          wx.showModal({
            title: '提示',
            content: '订单状态异常...',
            showCancel:false,
            success:function(res){
              if(res.confirm){
              }
            }
          })
        }
      }
    })
  },
  

  // 技师端微信支付开始

  /**
   * 获取微信登录
   */
  paywxLogin: function (e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem) {
    if(wx.showLoading) {
      wx.showLoading({ title: '启动微信支付中...', })
    }
    var that = this;
    wx.login({
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        console.log(JSON.stringify(res))
        that.getpayOpenId(res.code, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem);

      }
    });
  },
/**
 * 获取openId
 */
  getpayOpenId: function (code, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem) {
    if (wx.showLoading) {
      wx.showLoading({ title: '启动微信支付中...', })
    }
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/getWXJSopenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 
        code: code,
        isOld: '0' 
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        console.log("getOpenId res-----:", res);
        var openIdStr = res.data.content[0];
        var jsonObj = JSON.parse(openIdStr);
        console.log('open_id = ' + jsonObj.openid);
        that.payxiadan(jsonObj.openid, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem);
      }
    })
  },


/**
 * 微信统一下单
 */
  payxiadan: function (opendId, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem) {
    if (wx.showLoading) {
      wx.showLoading({ title: '启动微信支付中...', })
    }
    var orderId = e.currentTarget.dataset.orderid;
    console.log('xiadan opendId', opendId + ', orderId: ' + orderId)
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/jsxiadan',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'openid': opendId, 'orderId': orderId, 'coupon_type': '0', 'coupon_price': '0' },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var code = res.data.code;
        if (code == '1') {
          // 成功
          var prepay_id = res.data.content[0];
          if (prepay_id == null || '' == prepay_id) {
            wx.showToast({
              title: 'prepay_id获取失败',
            })
            console.log('prepay_id == prepay_idprepay_id获取失败');
          } else {
            console.log('prepay_id == ' + prepay_id);
            that.paysign(prepay_id, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem);
          }
        }
      },
      complete: function (res) {
        console.log('xiadan complete', res)
      }
    })
  },


  paysign: function (prepay_id, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem) {
    if (wx.showLoading) {
      wx.showLoading({ title: '启动微信支付中...', })
    }
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/jssign',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { prepay_id: prepay_id },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var code = res.data.code;
        if (code == '1') {
          console.log(res.data.content[0].prepay_id);
          that.payrequestPayment(res.data.content[0].prepay_id, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem);

        }
      }
    })
  },


  payrequestPayment: function (objj, e, userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem) {
    if (wx.showLoading) {
      wx.showLoading({ title: '启动微信支付中...', })
    }
    var that = this;
    var formId = e.detail.formId;
    var obj = JSON.parse(objj);

    var orderObj = e.currentTarget.dataset.item;
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success: function (res) {
        // 成功
        var orderId = e.currentTarget.dataset.orderid;
        var uname = that.data.user_name;
        var uid = that.data.uid;
        
        wx.showToast({ title: '支付成功', })
        // 发送通知给师傅端
        that.paysendMsgForStatus(orderId, '07', orderObj.process_person_id, '0');

        //pay success update form_id
        that.paysaveWXFormId(formId, uid);

        that.paysaveWXOrderFormId(formId, orderId);

        // 发送推送通知给师傅端
        that.paysendJPushMsg(orderObj.process_person_id, '07');

        // 支付成功，修改tab状态
        // 修改订单状态
        that.commitOrderViewStatus(userorderjsonStr, userorderid, userorderjsonGoodsStr, userorderpayType, userorderId, userorderobj, userorderItem);
        that.changeStatusForNext();
      },
      fail: function (res) {
        // 失败
        wx.showToast({ title: '支付失败', })
      }
    })
  },

/**
 * 保存微信表单ID
 */
  paysaveWXFormId: function (form_id, uid) {
    var remoteUrl = getApp().globalData.serverIp + "openkey/saveWXFormId";
    wx.request({
      url: remoteUrl,
      data: {
        form_id: form_id,
        uid: uid
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
      }
    })
  },

  paysaveWXOrderFormId: function (form_id, order_id) {
    var remoteUrl = getApp().globalData.serverIp + "openkey/saveWXOrderFormId";
    wx.request({
      url: remoteUrl,
      data: {
        form_id: form_id,
        order_id: order_id,
        utype: "2"
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res);
      }
    })
  },


// 发送消息给微信
  paysendMsgForStatus: function (orderId, status, jsId, isOld) {
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/sendMsgForStatus',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: orderId,
        status: status,
        jsId: jsId,
        isOld: isOld,
      },
      success: function (res) {
      }
    })
  },
// 发送极光推送通知
  paysendJPushMsg: function (user_id, status) {
    var that = this;
    wx.request({
      url: getApp().globalData.serverIp + 'openkey/sendJPushMsg',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: user_id,
        status: status
      },
      success: function (res) {
      }
    })
  },

// 技师端微信支付完成

  commitOrderViewStatus: function (objStr, beforeStatus, goodsStr, payType, orderId, obj, orderItem) {
    var userInfo = app.getUserInfo();

    if (!userInfo.id) {
      wx.showToast({
        title: '用户信息不正确或为空',
        duration: 3000
      });
      // 校验密码
    } else {
      var _this = this;
      // 获取订单详细
      app.request({
        url: "phone/js/orderview/commitOrderViewStatus",
        data: {
          objStr: objStr,
          goodsStr: goodsStr,
          pay_type: payType
        },
        method: 'POST',
        loading: true,
        loadingMsg: "正在提交状态...",
        successFn: function (res) {
          if (res.data.code == 1) {
            if (beforeStatus == '02' || beforeStatus == '03') {
              _this.getOrderTaking();
              _this.getOrderListByStatus('04,02');
              _this.changeOrderTop(2);
            } else if (beforeStatus == '04') {
              _this.getOrderListByStatus('04,02');
              _this.getOrderListByStatus('05');
              _this.changeOrderTop(3);
            } else if (beforeStatus == '05') {
              _this.getOrderListByStatus(beforeStatus);
              _this.getUserOrderNOPAY('06');
              // _this.changeOrderTop(3);
            } 
            // 发送消息
            _this.sendJPushMsg(orderItem.user_id, obj.process_stage);
            _this.sendMsgForStatus(orderId, obj.process_stage, userInfo.id, '0');
            console.log('成功')
          } else if (res.data.code == -19) {
            wx.showToast({
              title: '对不起，别人抢先一步了',
              duration: 3000
            });
          }
        },
        successFailFn: function () {

        },
        failFn: function () {

        }
      });
    }
  },
  /**
   * 发送通知消息
   */
  sendMsgForStatus: function (orderId, status, jsId, isOld) {
    app.request({
      url: "phone/openkey/sendMsgForStatus",
      data: {
        orderId: orderId,
        status: status,
        jsId: jsId,
        isOld: isOld
      },
      method: 'POST',
      loading: false,
      successFn: function (res) {

      },
      successFailFn: function () {

      },
      failFn: function () {

      }
    });
  },

  bindItemClick: function (e) {
    var that = this;
    var userInfo = app.getUserInfo();
    var item = e.currentTarget.dataset.item;
    var jsonStr = JSON.stringify(item);
    
    wx.setStorageSync('newitemstr', jsonStr)
    wx.navigateTo({
      url: '../my/orderprocess/orderprocess?jsonStr=' + jsonStr,
    })
  },
  finishWork: function (e) {
    var that = this;
    var userInfo = app.getUserInfo();
    var item = e.currentTarget.dataset.item;
    var jsonStr = JSON.stringify(item);
    wx.navigateTo({
      url: '../index/finishorder/finishorder?jsonStr=' + jsonStr,
    })
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作  
    this.getOrderTaking();

  },
  loadMoreData: function () {
    var _this = this;
    console.log('到了');
    if (_this.data.orderstatus == '5') {
      if (_this.data.hasMore && !_this.data.isloading) {
        //阻塞不让重复请求
        _this.setData({ isloading: true });
        _this.getUserOrderFinish('07', false);
      }
    }
  },
  refreshCTData: function () {
    var _this = this;
    console.log('refresh到了');
    if (_this.data.orderstatus == '5') {
      if (!_this.data.refreshing) {
        //阻塞不让重复请求
        console.log('refreshing')
        _this.setData({ refreshing: true });
        updateRefreshIcon.call(this);
        // _this.getUserOrderFinish('07', true);
      }
    }
  },

  getFinishNeedStatus: function (item, jsonStr) {
    console.log('ctdd--' + JSON.stringify(item))
    var _this = this;
    app.request({
      url:'phone/js/orderview/getFinishNeedStatus',
      data:{
        service_item_id: item.service_item_id
      },
      method: 'GET',
      loading: false,
      loadingMsg: "正在查询...",
      successFn: function (res) {
       
        if (res.data.code == 1) {
          console.log(JSON.stringify(res.data.content));
          _this.setData({isNeed: res.data.content[0].is_need});
          _this.setData({ tempOrderId: item.order_id});
          _this.showDialogBtn();
        } else if (res.data.code == 2) {
          var jsonclStr = JSON.stringify(item);
          _this.setData({ isCommitSuccess: false });
          wx.navigateTo({
            url: '../index/finishorder/finishorder?jsonclStr=' + jsonclStr + '&jsonStr=' + jsonStr,
          })
        }    
      },
      successFailFn: function () {
        wx.showToast({
          title: '查询服务类型状态失败',
        })
      },
      failFn: function () {
        wx.showToast({
          title: '网络连接异常',
        })
      }
    })  

  },

  inputChange: function(event) {
    var id = event.currentTarget.dataset.id;
    if(id == '11') {
      this.setData({ idcardNo: event.detail.value});
    } else if(id == '12') {
      this.setData({ driveCard : event.detail.value});
    } else if(id == '13') {
      this.setData({ carCard: event.detail.value });
    } else if(id == '14'){
      this.setData({ otherCard: event.detail.value });
    }
  },

  /**
     * 弹窗
     */
  showDialogBtn: function () {
    this.setData({ showModal: true })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({ showModal: false });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    var that = this;
    that.hideModal();
    that.setData({ idcardNo: '' });
    that.setData({ otherCard: '' });
    that.setData({ carCard: '' });
    that.setData({ driveCard: '' });
    that.setData({ tempOrderId: '' });
    that.setData({ jsonclStrTemp: '' });
    that.setData({ jsonStrTemp: '' });
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var _this = this;
    //验证
    if (app.isNotBlank(_this.data.idcardNo)) {
      // if (!app.checkIdNumber(_this.data.idcardNo)) {
      //   wx.showToast({
      //     title: '身份证号格式错误！',
      //     duration: 3000
      //   });
      //   return;
      // }
    } else {
      wx.showToast({
        title: '身份证号不能为空！',
        duration: 3000
      });
      return;
    }
    if (_this.data.isNeed == '1') {//普通
     

    } else if (_this.data.isNeed == '2') {  //汽车
      if (app.isBlank(_this.data.carCard)) {
        wx.showToast({
          title: '行驶证号不能为空！',
          duration: 3000
        });
        return;
      }
      if (app.isBlank(_this.data.driveCard)) {
        wx.showToast({
          title: '驾驶证号不能为空！',
          duration: 3000
        });
        return;
      }
    }
 
    //提交数据
    app.request({
      url: 'phone/js/orderview/updateOrdersCertiStatus',
      data: {
        order_id: _this.data.tempOrderId,
        idCardNo: _this.data.idcardNo,
        carCard: _this.data.carCard,
        driveCard: _this.data.driveCard,
        otherCard: _this.data.otherCard
      },
      method: 'POST',
      loading: true,
      loadingMsg: "正在提交...",
      successFn: function (res) {
        if (res.data.code == 1) {
          _this.hideModal();
          _this.setData({ idcardNo: '' });
          _this.setData({ otherCard: '' });
          _this.setData({ carCard: '' });
          _this.setData({ driveCard: '' });
          _this.setData({ tempOrderId: '' });
          _this.setData({ isCommitSuccess: false });
          wx.setStorageSync('localitem', _this.data.jsonclStrTemp)
          wx.navigateTo({
            url: '../index/finishorder/finishorder?jsonclStr=' + _this.data.jsonclStrTemp + '&jsonStr=' + _this.data.jsonStrTemp,
          })
        }
      },
      successFailFn: function () {

      },
      failFn: function () {

      }
    })  
  }
})

/** 
 * 旋转上拉加载图标 
 */
function updateRefreshIcon() {
  var deg = 0;
  var _this = this;
  console.log('旋转开始了.....')
  var animation = wx.createAnimation({
    duration: 1000
  });

  var timer = setInterval(function () {
    if (!_this.data.refreshing)
      clearInterval(timer);
    animation.rotateZ(deg).step();//在Z轴旋转一个deg角度  
    deg += 360;
    _this.setData({
      refreshAnimation: animation.export()
    })
  }, 1000);
}
