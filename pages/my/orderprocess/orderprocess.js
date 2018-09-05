// orderprocess.js
var Util = require('../../../utils/address.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userOrder: {},
    ordersProcess:[],
    hidePhone: '',
    userLocation: {},
    hasGuarantee:true
  },
  getUserShiFuOrdersProcess: function (orderId) {
    wx.showLoading({ title: '数据加载中...', })
    var that = this;
    
    Util.getUserShiFuOrdersProcess(function (data) {
      if(wx.hideLoading()){wx.hideLoading();}
      var code = data.data.code;
      if (code == "1") {
        that.setData({ ordersProcess: data.data.content })
      } else {
        // 失败
        that.setData({ ordersProcess: [] })
      }
    }, orderId);
  },
  toDetail: function () {
    var jsonStr = JSON.stringify(this.data.userOrder);
    wx.navigateTo({
      url: '../../my/myorder/myorder?jsonStr=' + jsonStr,
    })
  },

  getUserLocation: function (techid) {
    var that = this;

    Util.gettechlocation(function (data) {
      console.log(data);

      var code = data.data.code;
      if (code == "1") {
        var locations = data.data.content;
        if (locations && locations.length > 0) {
          var userLocation = locations[0];
          that.setData({ userLocation: userLocation })
        }

      } else {
        // 失败
        that.setData({ userLocation: [] })
      }
    }, techid);
  },
  /**
   * 显示技师位置地图
   */
  showLocation: function () {

    var latitude = this.data.userLocation.latitude;
    var longitude = this.data.userLocation.longitude;

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var jsonStr = options.jsonStr;

    var jsonStr = wx.getStorageSync('newitemstr')

    var userOrder = JSON.parse(jsonStr);
    if (typeof userOrder.guarantee === "undefined"
      || userOrder.guarantee == ""
      || typeof userOrder.guarantee_date_type === "undefined"
      || userOrder.guarantee_date_type == ""){
      this.setData({ hasGuarantee: false })
    }
    this.setData({ 
      userOrder: userOrder,
      hidePhone: userOrder.user_phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
    })

    console.log(userOrder.order_id);

    this.getUserShiFuOrdersProcess(userOrder.order_id);


    var tech_id = this.data.userOrder.process_person_id;
    console.log('tech_id==' + tech_id)
    this.getUserLocation(tech_id);
  },
  toPhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.userOrder.user_phone,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  finishOrder: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认完成本次服务？',
      success: function (res) {
        if (res.confirm) {
          // 、是
          that.bindChangeStatus()
        } else if (res.cancel) {
          // that.submitSaveData();
        }
      }
    })
  },
  bindChangeStatus: function () {

    var that = this;
    var userInfo = app.getUserInfo();
    var orderId = that.data.userOrder.order_id;
    var orderItem = that.data.userOrder;

    
    //构建添加额外商品list
    var goods = new Array();

    var obj = new Object();
    obj.process_person_id = userInfo.id;
    obj.process_person_name = userInfo.name;
    obj.order_id = orderId;
    
    var payType = "2";
    obj.process_stage = '07';

    var jsonStr = JSON.stringify(obj);
    var jsonGoodsStr = JSON.stringify(goods);

    // 修改订单状态
    that.commitOrderViewStatus(jsonStr, '', jsonGoodsStr, payType, orderId, obj, orderItem);
    console.log(jsonStr)
    
  },
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
            wx.showToast({
              title: '订单完成成功！',
              success: function(res) {
                wx.navigateBack({})
              }
            })
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
})